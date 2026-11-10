/* ============ квести ============ */
function questNeedsItem(item){
  for (const [qid, q] of Object.entries(S.quests)){ const Q = QUESTS[qid]; if (q.st !== "active") continue;
    if (Q.goal.item === item) return `${Math.min(inv(item), Q.goal.n)}/${Q.goal.n}`;
    if (Q.goal.items && Q.goal.items[item]) return `${Math.min(inv(item), Q.goal.items[item])}/${Q.goal.items[item]}`; }
  return "";
}
function qGoalN(Q){ return Q.goal.items ? 1 : Q.goal.n; }
function qProgress(qid){ const Q = QUESTS[qid], q = S.quests[qid]; if (!q) return 0; const G = Q.goal;
  if (G.item) return Math.min(inv(G.item), G.n);
  if (G.items) return Object.entries(G.items).every(([k, n]) => inv(k) >= n) ? 1 : 0;
  return Math.min(q.n, G.n); }
function qProgressTxt(qid){ const Q = QUESTS[qid]; if (Q.goal.items) return Object.entries(Q.goal.items).map(([k, n]) => `${ITEMS[k].name} ${Math.min(inv(k), n)}/${n}`).join(", "); return `${qProgress(qid)} із ${Q.goal.n}`; }
function qAvail(qid){ const Q = QUESTS[qid]; return !S.quests[qid] && (!Q.req || (S.quests[Q.req] && S.quests[Q.req].st === "done")) && (!Q.order || S.order === Q.order) && (!Q.minLvl || S.lvl >= Q.minLvl); }
function qReady(qid){ const q = S.quests[qid]; return q && q.st === "active" && qProgress(qid) >= qGoalN(QUESTS[qid]); }
function npcMark(npc){ const qs = NPCS[npc].quests || []; if (qs.some(qReady)) return "?"; if (qs.some(qAvail)) return "!"; return ""; }
function rewTxt(x){ if (x.item) return ITEMS[x.item].name + (x.n > 1 ? " ×" + x.n : ""); if (x.cop) return moneyTxt(x.cop); return ""; }
function rewardTxt(Q){ const R = Q.reward; return [moneyTxt(R.cop || 0), R.xp && S.lvl < MAXLVL ? R.xp + " досвіду" : "", R.item ? ITEMS[R.item].name : "", R.items ? Object.entries(R.items).map(([k, n]) => ITEMS[k].name + (n > 1 ? " ×" + n : "")).join(", ") : "", Q.perkText || "", R.choice ? "один предмет на вибір" : ""].filter(Boolean).join(", "); }
function takeQuest(qid){ S.quests[qid] = {st:"active", n:0}; msg(`Нове завдання: «${QUESTS[qid].name}».`, "quest"); const G = QUESTS[qid].goal; if (G.visit === S.loc) S.quests[qid].n = 1; save(); openNpc(QUESTS[qid].giver); render(); }
function doneQuest(qid, choice){
  const Q = QUESTS[qid], R = Q.reward; if (!qReady(qid)) return;
  if (R.choice && choice === undefined) return;
  if (Q.goal.item) take(Q.goal.item, Q.goal.n);
  if (Q.goal.items) for (const [k, n] of Object.entries(Q.goal.items)) take(k, n);
  S.quests[qid].st = "done"; earn("quest", R.cop || 0);
  if (R.item) give(R.item, 1, true);
  if (R.items) for (const [k, n] of Object.entries(R.items)) give(k, n, true);
  let chosen = "";
  if (R.choice){ const c = R.choice[choice]; if (c.item) give(c.item, c.n || 1, true); if (c.cop) earn("quest", c.cop); chosen = rewTxt(c); }
  if (R.perk) for (const [k, v] of Object.entries(R.perk)) S.perks[k] = (S.perks[k] || 0) + v;
  msg(`Завдання «${Q.name}» виконано! Нагорода: ${[moneyTxt(R.cop || 0), chosen, Q.perkText || ""].filter(Boolean).join(", ")}.`, "good");
  gainXp(R.xp || 0); save(); openNpc(Q.giver); render();
}

/* ============ модальні вікна ============ */
let modalLocked = false;
function openModal(html, locked){ const m = $("#modal"); m.innerHTML = html; m.classList.add("on"); modalLocked = !!locked; const f = m.querySelector("button:not(:disabled)"); if (f) f.focus({preventScroll:true}); drawAllSprites(); }
function closeModal(){ const m = $("#modal"); m.classList.remove("on"); m.innerHTML = ""; modalLocked = false; UI.sockPick = null; }
const modalOpen = () => $("#modal").classList.contains("on");
const mhead = (title, extra = "") => `<div class="mhead"><h2>${title}</h2>${extra}<button class="x" data-act="close" aria-label="Закрити">×</button></div>`;

function openNpc(id){
  const N = NPCS[id];
  let qs = "";
  for (const qid of N.quests || []){
    const Q = QUESTS[qid], q = S.quests[qid];
    if (qAvail(qid)) qs += `<div class="qbox"><b>${Q.name}</b><p>${Q.text}</p><p class="hint">Нагорода: ${rewardTxt(Q)}</p><button class="btn p" data-qtake="${qid}">Взяти завдання</button></div>`;
    else if (qReady(qid)){
      const R = Q.reward;
      qs += `<div class="qbox ready"><b>${Q.name}</b><p>Ти впорався. Тримай, що обіцяв.</p><p class="hint">Нагорода: ${rewardTxt(Q)}</p>${R.choice ? `<div class="choice"><span class="lbl">Оберіть одну річ:</span>${R.choice.map((c, i) => `<button class="cell" data-qdone="${qid}" data-choice="${i}">${c.item ? `<span class="ii">${itemArt(c.item, 30)}</span>` : `<span class="ii">${svg("star", 18, "#e0b25a")}</span>`}<span class="tx"><b>${rewTxt(c)}</b><span>${c.item ? itemLine(ITEMS[c.item]) : "гроші"}</span></span></button>`).join("")}</div>` : `<button class="btn p" data-qdone="${qid}">Здати завдання</button>`}</div>`;
    }
    else if (q && q.st === "active") qs += `<div class="qbox"><b>${Q.name}</b><p class="hint">Виконано: ${qProgressTxt(qid)}.</p></div>`;
  }
  const st = stats(), healCost = Math.max(5, Math.round((st.maxHp - S.hp) * .3));
  let acts = "";
  if (N.shop && (!N.shopOrder || S.order === N.shopOrder)) acts += `<button class="btn p" data-shop="${N.shop}">Торгувати</button>`;
  else if (N.shop) qs += `<div class="qbox"><p class="hint">Крамниця відчинена лише для тих, хто присягнув ${ORDERS[N.shopOrder].gen}.</p></div>`;
  if (N.herald) qs += oathHTML();
  if (N.heal) acts += `<button class="btn" data-act="heal" data-npcid="${id}" ${S.hp >= st.maxHp ? "disabled" : ""}>Вилікуватися (${moneyTxt(healCost)})</button>`;
  if (N.rest) acts += `<button class="btn" data-act="rest">Відпочити (5 мід.)</button>`;
  if (SMITHS.includes(id)) acts += `<button class="btn" data-forge="1">${gi("anvil", 16)} Заточити спорядження</button>`;
  openModal(`<div class="mbox" style="width:660px"><div class="mhead"><div class="npchd"><div class="portrait">${N.letter}</div><div><h2>${N.name}</h2><div class="hint">${N.role}</div></div></div><button class="x" data-act="close" aria-label="Закрити">×</button></div>
    <p class="say">«${N.hello}»</p>${qs}${acts ? `<div class="acts">${acts}</div>` : ""}</div>`);
}
function itemLine(it){
  const p = [];
  if (it.dmg) p.push(`урон ${it.dmg[0]}–${it.dmg[1]}`); if (it.hp) p.push(`здоров'я +${it.hp}`); if (it.def) p.push(`захист +${it.def}`);
  if (it.agi) p.push(`спритність +${it.agi}`); if (it.str) p.push(`сила +${it.str}`); if (it.wil) p.push(`воля +${it.wil}`); if (it.crit) p.push(`крит +${it.crit}%`);
  if (it.sock) p.push(`гнізд: ${it.sock}`);
  if (it.use){ if (it.use.hp >= 9999) p.push("повністю відновлює сили"); else { if (it.use.hp) p.push(`відновлює ${it.use.hp} здоров'я`); if (it.use.en) p.push(`відновлює ${it.use.en} енергії`); } }
  if (it.buff) p.push(Object.entries(it.buff).map(([k, v]) => k === "bog" ? "захист від туману Трясовини" : `+${v} ${STATN[k]}`).join(", ") + ` на ${it.bn || 3} боїв`);
  if (it.bog) p.push("захищає від туману Трясовини");
  if (it.blunt) p.push("дробить кістки: скелети не повстають");
  if (it.scroll) p.push({heal:"лікує 30% здоров'я", fire:`вогонь: ${40 + 8 * S.lvl} шкоди`, shield:"2 раунди удари слабші", tp:"переносить до найближчого міста", curse:"знімає захист ворога, +20% урону", storm:`буря: ${50 + 6 * S.lvl} шкоди всім`, ward:"діє як оберіг проти будь-якої нечисті"}[it.scroll]);
  if (it.gem) p.push(`+${it.val} ${STATN[it.stat]} у гнізді`);
  if (it.raw) p.push("ювелір огранює в самоцвіт");
  if (it.res) p.push(`ресурс ${it.t} тіру`);
  if (it.cat === "ward"){ const who = BESTIARY.filter(d => wardIds(d.ward).includes(it.id)).map(d => d.name); p.push("оберіг проти: " + (who.slice(0, 4).join(", ") || "—") + (who.length > 4 ? "…" : "")); }
  if (ITEM_HINT[it.id]) p.push(ITEM_HINT[it.id]);
  if (it.lvl > 1) p.push(`від ${it.lvl} рівня`);
  return p.join(" · ") || "трофей, можна продати";
}
const iconOf = it => !it ? "item" : it.slot ? ({weapon:"sword", helmet:"helmet", armor:"armor", boots:"boots", amulet:"amulet", ring:"ring"})[it.slot] : it.scroll ? "scroll" : it.buff ? "elixir" : it.open ? "box" : it.use ? "flask" : it.cat === "ward" ? "ward" : it.cat === "gem" ? "gem" : it.res === "herb" ? "herb" : it.res === "mine" ? "ore" : it.res === "fish" ? "fish" : "item";
const gemCol = id => { const it = ITEMS[id]; if (!it) return "#e7c9a8"; if (it.col) return it.col; if (it.cat === "ward") return "#9fd08f"; if (it.raw) return "#c9b8e8"; if (it.rare) return "#e8c46a"; return "#e7c9a8"; };

/* персонаж і торба живуть у Книзі героя */
function openChar(){ openBook("hero"); }
const BAGTABS = [["gear","Речі"],["use","Зілля й сувої"],["gem","Самоцвіти"],["res","Ресурси"],["ward","Обереги"],["misc","Трофеї"]];
function openBag(){ openBook("bag"); }
function openShop(id){
  const tabs = `<div class="mtabs"><button class="mtab${UI.shopTab === "buy" ? " on" : ""}" data-shoptab="buy" data-shopid="${id}">Купити</button><button class="mtab${UI.shopTab === "sell" ? " on" : ""}" data-shoptab="sell" data-shopid="${id}">Продати</button></div>`;
  const reg = NODES[S.loc].r, note = `<div class="pnote">Ціни скупника сьогодні (${REGIONS[reg]}): ${Object.entries(PCAT).map(([c, n]) => `${n} ×${priceMul(reg, c).toFixed(2).replace(".", ",")}`).join(" · ")}</div>`;
  let rows = "";
  if (UI.shopTab === "buy"){
    rows = SHOPS[id].filter(i => !UI.onlyAvail || (buyPrice(i) <= S.cop && (ITEMS[i].lvl || 1) <= S.lvl)).map(i => { const it = ITEMS[i], pr = buyPrice(i), c = it.slot ? cmpEquip(i) : 0;
      return `<div class="shoprow2">${cellIt(i, {size:46, cmp:c, lock:(it.lvl || 1) > S.lvl})}<span class="tx"><b class="r${rarity(it)}">${it.name}</b><span>${itemLine(it)}</span></span><span class="pr">${money(pr)}</span><button class="btn p sm" data-buy="${i}" data-shopid="${id}" ${pr > S.cop ? "disabled" : ""}>Купити</button></div>`; }).join("");
    rows += `<label class="chk"><input type="checkbox" data-avail="${id}" ${UI.onlyAvail ? "checked" : ""}> Показати тільки доступні</label>`;
  } else {
    const jv = junkValue();
    rows = (jv ? `<button class="btn p" data-junk="${id}">${gi("two-coins", 16, "#fff")} Продати весь мотлох за ${moneyTxt(jv)}</button>` : "") + note +
      Object.keys(S.inv).filter(i => inv(i) > 0).sort((a, b) => ITEMS[a].cat.localeCompare(ITEMS[b].cat) || rarity(ITEMS[b]) - rarity(ITEMS[a])).map(i => { const it = ITEMS[i], p = sellPrice(i), q = questNeedsItem(i);
      return `<div class="shoprow2">${cellIt(i, {size:46, n:inv(i)})}<span class="tx"><b class="r${rarity(it)}">${it.name} ×${inv(i)}</b><span>${q ? "потрібно для квесту " + q : itemLine(it)}</span></span><span class="pr">${money(p)}</span><button class="btn sm" data-sell="${i}" data-shopid="${id}">Продати 1</button>${inv(i) > 1 ? `<button class="btn sm" data-sellall="${i}" data-shopid="${id}">Усі</button>` : ""}</div>`; }).join("") || `<div class="hint">Нема чого продати.</div>`;
  }
  openModal(`<div class="mbox" style="width:860px">${mhead("Крамниця", `<span class="hint">${NPCS[Object.keys(NPCS).find(k => NPCS[k].shop === id)].name}${S.perks.disc ? " · ваша знижка " + S.perks.disc + "%" : ""}</span>`)}${tabs}<div class="list">${rows}</div><div class="money ink">У вас: ${money(S.cop)}</div></div>`);
}
function openJournal(){ openBook("quests"); }
function allTypes(){ return [...Object.keys(MOBS), ...BESTIARY.map(d => d.id)]; }
function whereFound(type){
  const out = Object.keys(LOCS).filter(k => LOCS[k].mobs.some(m => m[0] === type)).map(k => NODES[k].name);
  const d = bestById(type); if (d && !MOBS[type]) out.push(...Object.values(NODES).filter(n => n.reg && d.reg.includes(n.reg)).map(n => n.name));
  for (const Dn of Object.values(DUNGEONS)) if (Dn.pool.includes(type) || Dn.boss === type) out.push(Dn.name);
  return [...new Set(out)];
}
function codexBody(zak){
  const types = zak ? BESTIARY.map(d => d.id) : Object.keys(MOBS), known = types.filter(t => S.codex[t]).length;
  const sel = UI.cxSel && types.includes(UI.cxSel) && S.codex[UI.cxSel] ? UI.cxSel : types.find(t => S.codex[t]);
  const grid = types.map(t => S.codex[t] ? `<button class="cx${t === sel ? " on" : ""}" data-cx="${t}" aria-label="${mobDef(t).name}">${sprite(t, 72, 62, 1.45, false)}<span>${mobDef(t).name}</span></button>` : `<div class="cx unk">?</div>`).join("");
  let info = `<div class="hint">Ще нікого не зустріли. Вирушайте в дорогу.</div>`;
  if (sel){ const d = mobDef(sel), st = mobStats(sel, 5);
    info = `<div class="cxinfo"><div class="big">${sprite(sel, 150, 150, (d.design.size || 1) > 1.4 ? 2.4 : 3.3, false)}</div><div class="cxt"><h3>${d.name}</h3>
      <div class="hint">${(ARCHL[st.arch] || "Звір")}${d.tier ? " · ступінь " + d.tier : ""}${d.boss ? " · бос" : d.dboss ? " · бос підземелля" : ""}</div><div class="lore">${d.lore || ""}</div>${fxHTML(st)}
      ${wardHTML(st)}<div class="kvs"><b>Трофеї:</b> ${st.drop.filter(([i]) => !i.startsWith("raw")).map(([i]) => ITEMS[i] ? ITEMS[i].name : "").filter(Boolean).join(", ") || "мідь"}</div><div class="kvs"><b>Де водиться:</b> ${whereFound(sel).join(", ") || "—"}</div></div></div>`; }
  const note = zak ? "Нечисть Закарпаття з давніх переказів: чорти, мавки, чугайстри й інші." : inZak() ? `<button class="btn dk sm" data-book="zcodex">${gi("crowned-skull", 14, "#d9a441")} Бестіарій Закарпаття</button>` : "Нечисть Закарпаття записано в окремий бестіарій, його можна гортати лише в Закарпатті.";
  let groups = `<div class="codex">${grid}</div>`;
  if (!zak){ const regOf = t => { const l = Object.keys(LOCS).find(k => LOCS[k].mobs.some(m => m[0] === t) || (LOCS[k].boss && LOCS[k].boss[0] === t)); if (l) return NODES[l].r; const D = Object.values(DUNGEONS).find(Dn => Dn.pool.includes(t) || Dn.boss === t); return D && NODES[D.node] ? NODES[D.node].r : "other"; };
    const by = {}; for (const t of types) (by[regOf(t)] = by[regOf(t)] || []).push(t);
    const cell = t => S.codex[t] ? `<button class="cx${t === sel ? " on" : ""}" data-cx="${t}" aria-label="${mobDef(t).name}">${sprite(t, 72, 62, 1.45, false)}<span>${mobDef(t).name}</span></button>` : `<div class="cx unk">?</div>`;
    groups = Object.keys(by).sort((a, b) => Object.keys(REGIONS).indexOf(a) - Object.keys(REGIONS).indexOf(b)).map(r => `<div class="creg"><h4>${REGIONS[r] || "Підземелля"}</h4><span>${by[r].filter(t => S.codex[t]).length} з ${by[r].length}</span></div><div class="codex">${by[r].map(cell).join("")}</div>`).join(""); }
  return `<div class="codex2 codex3"><div class="skhd"><span>Відкрито: <b class="pts">${known}</b> з ${types.length}</span><span class="hint lm">${note}</span></div><div class="bcard">${info}</div>${groups}</div>`;
}
function openCodex(){ openBook(inZak() && UI.book === "zcodex" ? "zcodex" : "codex"); }
function craftBody(){
  const k = UI.craftTab, P = PROFS[k], p = S.prof[k];
  const tabs = Object.entries(PROFS).map(([id, x]) => `<button class="ptab${id === k ? " on" : ""}" data-crafttab="${id}">${svg(x.icon, 18)}<span>${x.name}</span><b>${S.prof[id].lv}</b><i style="width:${S.prof[id].lv >= 10 ? 100 : S.prof[id].xp / profNeed(S.prof[id].lv) * 100}%"></i></button>`).join("");
  let body = `<div class="hint it">${P.text}</div><div class="kv"><span>Рівень ремесла</span><b>${p.lv}${p.lv < 10 ? ` · ${p.xp}/${profNeed(p.lv)}` : " (максимум)"}</b></div>`;
  if (P.kind === "gather"){
    const L = id => Object.keys(LOCS).filter(l => LOCS[l].res[k]).map(l => ({l, t:LOCS[l].res[k]}));
    body += `<div class="sub">Ресурси</div>` + [1,2,3,4,5].map(t => { const it = ITEMS[{herb:"h", mine:"o", fish:"f"}[k] + t], ok = p.lv >= TIER_LV[t];
      return `<div class="shoprow${ok ? "" : " off"}"><span class="ii">${itemArt(it.id, 32, ok ? "" : "off")}</span><span class="tx"><b>${it.name}</b><span>тір ${t} · потрібен ${TIER_LV[t]} рівень · у торбі: ${inv(it.id)}</span></span></div>`; }).join("");
    body += `<div class="sub">Де шукати</div><div class="hint">${L().map(x => `${NODES[x.l].name} (до ${x.t})`).join(", ")}</div><div class="hint">Збирайте, натискаючи на значки трав, руди й риби просто на сцені локації.</div>`;
  } else {
    const gOrd = g => g === "Огранювання" ? 1 : g === "З'єднання" ? 2 : 0;
    const list = RECIPES.filter(r => r.prof === k).sort((a, b) => gOrd(a.group) - gOrd(b.group) || a.lv - b.lv);
    let lastG = null;
    body += list.map(r => { const it = ITEMS[r.out], ok = canCraft(r), lvOk = p.lv >= r.lv;
      const head = r.group && r.group !== lastG ? `<div class="sub">${(lastG = r.group)}</div>` : "";
      return head + `<div class="shoprow${lvOk ? "" : " off"}"><span class="ii">${itemArt(r.out, 32)}</span><span class="tx"><b>${it.name}</b><span>${Object.entries(r.in).map(([i, n]) => `<em class="${inv(i) >= n ? "ok" : "no"}">${ITEMS[i].name} ${inv(i)}/${n}</em>`).join(" · ")}${lvOk ? "" : ` · потрібен ${r.lv} рівень`}</span></span><button class="btn p sm" data-craft="${r.id}" ${ok ? "" : "disabled"}>Створити</button></div>`; }).join("");
    if (k === "jewel") body += `<div class="hint">Огранені самоцвіти вставляються в гнізда речей у вікні «Персонаж».</div>`;
  }
  return `<div class="craft2"><div class="craftrow"><div class="ptabs bcard">${tabs}</div><div class="craftbody bcard">${body}</div></div></div>`;
}
function openCrafts(){ openBook("craft"); }
function openInfo(title, text){ openModal(`<div class="mbox" style="width:540px">${mhead(title)}<p class="say">${text}</p></div>`); }
function openSkills(){ openBook("skills"); }
function openSettings(){ openBook("settings"); }
