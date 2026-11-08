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
function qAvail(qid){ const Q = QUESTS[qid]; return !S.quests[qid] && (!Q.req || (S.quests[Q.req] && S.quests[Q.req].st === "done")); }
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
  S.quests[qid].st = "done"; S.cop += R.cop || 0;
  if (R.item) give(R.item, 1, true);
  if (R.items) for (const [k, n] of Object.entries(R.items)) give(k, n, true);
  let chosen = "";
  if (R.choice){ const c = R.choice[choice]; if (c.item) give(c.item, c.n || 1, true); if (c.cop) S.cop += c.cop; chosen = rewTxt(c); }
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
      qs += `<div class="qbox ready"><b>${Q.name}</b><p>Ти впорався. Тримай, що обіцяв.</p><p class="hint">Нагорода: ${rewardTxt(Q)}</p>${R.choice ? `<div class="choice"><span class="lbl">Оберіть одну річ:</span>${R.choice.map((c, i) => `<button class="cell" data-qdone="${qid}" data-choice="${i}">${c.item ? `<span class="ii">${svg(iconOf(ITEMS[c.item]), 18, gemCol(c.item))}</span>` : `<span class="ii">${svg("star", 18, "#e0b25a")}</span>`}<span class="tx"><b>${rewTxt(c)}</b><span>${c.item ? itemLine(ITEMS[c.item]) : "гроші"}</span></span></button>`).join("")}</div>` : `<button class="btn p" data-qdone="${qid}">Здати завдання</button>`}</div>`;
    }
    else if (q && q.st === "active") qs += `<div class="qbox"><b>${Q.name}</b><p class="hint">Виконано: ${qProgressTxt(qid)}.</p></div>`;
  }
  const st = stats(), healCost = Math.max(5, Math.round((st.maxHp - S.hp) * .3));
  let acts = "";
  if (N.shop) acts += `<button class="btn p" data-shop="${N.shop}">Торгувати</button>`;
  if (N.heal) acts += `<button class="btn" data-act="heal" data-npcid="${id}" ${S.hp >= st.maxHp ? "disabled" : ""}>Вилікуватися (${moneyTxt(healCost)})</button>`;
  if (N.rest) acts += `<button class="btn" data-act="rest">Відпочити (5 мід.)</button>`;
  openModal(`<div class="mbox" style="width:660px"><div class="mhead"><div class="npchd"><div class="portrait">${N.letter}</div><div><h2>${N.name}</h2><div class="hint">${N.role}</div></div></div><button class="x" data-act="close" aria-label="Закрити">×</button></div>
    <p class="say">«${N.hello}»</p>${qs}${acts ? `<div class="acts">${acts}</div>` : ""}</div>`);
}
function itemLine(it){
  const p = [];
  if (it.dmg) p.push(`урон ${it.dmg[0]}–${it.dmg[1]}`); if (it.hp) p.push(`здоров'я +${it.hp}`); if (it.def) p.push(`захист +${it.def}`);
  if (it.agi) p.push(`спритність +${it.agi}`); if (it.str) p.push(`сила +${it.str}`); if (it.crit) p.push(`крит +${it.crit}%`);
  if (it.sock) p.push(`гнізд: ${it.sock}`);
  if (it.use){ if (it.use.hp >= 9999) p.push("повністю відновлює сили"); else { if (it.use.hp) p.push(`відновлює ${it.use.hp} здоров'я`); if (it.use.en) p.push(`відновлює ${it.use.en} енергії`); } }
  if (it.buff) p.push(Object.entries(it.buff).map(([k, v]) => `+${v} ${STATN[k]}`).join(", ") + " на 3 бої");
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

/* персонаж: лялька, гнізда, характеристики */
function openChar(){
  const st = stats(), b = base();
  const doll = SLOTS.map(([s, l]) => { const id = S.equip[s], it = id && ITEMS[id];
    const socks = it && it.sock ? `<div class="socks">${sockArr(s).map((g, i) => g ? `<button class="sock full" data-unsock="${s}:${i}" title="${ITEMS[g].name}: ${itemLine(ITEMS[g])}. Натисніть, щоб вийняти" style="--gc:${ITEMS[g].col}"></button>` : `<button class="sock${UI.sockPick === s + ":" + i ? " pick" : ""}" data-sockpick="${s}:${i}" title="Порожнє гніздо: вставити самоцвіт"></button>`).join("")}</div>` : "";
    return `<div class="dslot${it && it.rare ? " rare" : ""}${it ? "" : " empty"}"><button class="ii" ${id ? `data-unequip="${s}" title="Зняти ${it.name}"` : "disabled"} aria-label="${it ? it.name : l}">${svg(iconOf(it || {slot:s === "ring1" || s === "ring2" ? "ring" : s}), 22, it ? gemCol(id) : "#5a534b")}</button><div class="tx"><b>${it ? it.name : l}</b><span>${it ? itemLine(it) : "порожньо"}</span>${socks}</div></div>`; }).join("");
  let pickBox = "";
  if (UI.sockPick){ const gems = Object.keys(S.inv).filter(k => ITEMS[k].gem); pickBox = `<div class="qbox"><b>Вставити самоцвіт</b>${gems.length ? `<div class="gems">${gems.map(g => `<button class="cell" data-insgem="${g}"><span class="ii">${svg("gem", 18, ITEMS[g].col)}</span><span class="tx"><b>${ITEMS[g].name} ×${inv(g)}</b><span>${itemLine(ITEMS[g])}</span></span></button>`).join("")}</div>` : `<p class="hint">У торбі немає огранених самоцвітів. Сирці огранює ювелір (вікно «Ремесла»).</p>`}</div>`; }
  const P = S.perks, perks = [P.hp ? `+${P.hp} здоров'я` : "", P.en ? `+${P.en} енергії` : "", P.dmg ? `+${P.dmg}% урону` : "", P.crit ? `+${P.crit}% криту` : ""].filter(Boolean).join(", ");
  const kv = (k, v) => `<div class="kv"><span>${k}</span><b>${v}</b></div>`;
  openModal(`<div class="mbox" style="width:960px">${mhead("Персонаж")}
   <div class="charrow"><div class="doll2">${doll}</div>
   <div class="charside">${pickBox}
     <div class="sub">Характеристики</div>${kv("Рівень", S.lvl + (S.lvl >= MAXLVL ? " (максимум)" : ""))}${S.lvl < MAXLVL ? kv("Досвід", S.xp + " / " + need(S.lvl)) : ""}${kv("Здоров'я", Math.ceil(S.hp) + " / " + st.maxHp)}${kv("Енергія", Math.floor(S.en) + " / " + st.maxEn)}
     ${kv("Урон", st.dmg[0] + "–" + st.dmg[1])}${kv("Захист", st.def + ` <i class="hint">(−${Math.round(reduce(st.def) * 100)}% шкоди)</i>`)}${kv("Сила", st.str)}${kv("Спритність", st.agi)}${kv("Витривалість", st.end)}${kv("Шанс криту", Math.round(5 + st.agi * .5 + st.crit) + "%")}
     ${perks ? kv("Дари з квестів", perks) : ""}${S.buffs.length ? kv("Еліксири", S.buffs.map(x => ITEMS[x.id].name + " (" + x.n + ")").join(", ")) : ""}
     <div class="sub">Ремесла</div><div class="profmini">${Object.entries(PROFS).map(([k, p]) => `<span>${svg(p.icon, 14)} ${p.name} <b>${S.prof[k].lv}</b></span>`).join("")}</div>
     <div class="sub">Досягнення</div>${kv("Перемог", S.kills)}${kv("Зачищено районів", Object.values(S.clears).reduce((a, b) => a + b, 0))}${kv("Пройдено підземель", Object.values(S.dung).reduce((a, b) => a + b, 0))}
     <button class="btn" data-menu="Торба">${svg("bag", 16)} Відкрити торбу</button></div></div></div>`);
}
/* торба */
const BAGTABS = [["gear","Речі"],["use","Зілля й сувої"],["gem","Самоцвіти"],["res","Ресурси"],["ward","Обереги"],["misc","Трофеї"]];
function openBag(){
  const ids = Object.keys(S.inv).filter(id => inv(id) > 0 && ITEMS[id].cat === UI.bagTab).sort((a, b) => (ITEMS[a].lvl || 0) - (ITEMS[b].lvl || 0));
  const cells = ids.map(id => { const it = ITEMS[id], locked = it.lvl && it.lvl > S.lvl;
    let btns = "";
    if (it.slot) btns += `<button class="btn sm" data-equip="${id}" ${locked ? "disabled" : ""}>Надягти</button>`;
    if (it.cat === "use") btns += `<button class="btn sm" data-use="${id}">${it.open ? "Відкрити" : "Використати"}</button><button class="btn sm" data-tobelt="${id}" ${S.belt.includes(id) ? "disabled" : ""}>${S.belt.includes(id) ? "На поясі" : "На пояс"}</button>`;
    return `<div class="cell${it.rare ? " rare" : ""}"><span class="ii">${svg(iconOf(it), 20, gemCol(id))}</span><span class="tx"><b>${it.name}${inv(id) > 1 ? " ×" + inv(id) : ""}</b><span>${itemLine(it)}</span></span><span class="cb">${btns}</span></div>`; }).join("") || `<div class="hint">Тут поки порожньо.</div>`;
  openModal(`<div class="mbox" style="width:900px">${mhead("Торба", `<span class="hint">Комірок зайнято: ${Object.keys(S.inv).length}</span>`)}
    <div class="mtabs">${BAGTABS.map(([k, l]) => `<button class="mtab${UI.bagTab === k ? " on" : ""}" data-bagtab="${k}">${l} <i>${Object.keys(S.inv).filter(id => ITEMS[id].cat === k).length}</i></button>`).join("")}</div>
    <div class="bagbelt"><span class="lbl">Пояс:</span>${S.belt.map((id, i) => `<button class="mini${id ? "" : " e"}" data-unbelt="${i}" title="${id ? ITEMS[id].name + ": натисніть, щоб зняти з пояса" : "Порожньо"}">${id ? svg(iconOf(ITEMS[id]), 16, gemCol(id)) : ""}</button>`).join("")}</div>
    <div class="list">${cells}</div><div class="money ink">${money(S.cop)}</div></div>`);
}
function openShop(id){
  const tabs = `<div class="mtabs"><button class="mtab${UI.shopTab === "buy" ? " on" : ""}" data-shoptab="buy" data-shopid="${id}">Купити</button><button class="mtab${UI.shopTab === "sell" ? " on" : ""}" data-shoptab="sell" data-shopid="${id}">Продати</button></div>`;
  let rows = "";
  if (UI.shopTab === "buy"){
    rows = SHOPS[id].filter(i => !UI.onlyAvail || (ITEMS[i].price <= S.cop && (ITEMS[i].lvl || 1) <= S.lvl)).map(i => { const it = ITEMS[i];
      return `<div class="shoprow${it.rare ? " rare" : ""}"><span class="ii">${svg(iconOf(it), 20, gemCol(i))}</span><span class="tx"><b>${it.name}</b><span>${itemLine(it)}</span></span><span class="pr">${money(it.price)}</span><button class="btn p sm" data-buy="${i}" data-shopid="${id}" ${it.price > S.cop ? "disabled" : ""}>Купити</button></div>`; }).join("");
    rows += `<label class="chk"><input type="checkbox" data-avail="${id}" ${UI.onlyAvail ? "checked" : ""}> Показати тільки доступні</label>`;
  } else {
    rows = Object.keys(S.inv).filter(i => inv(i) > 0).sort((a, b) => ITEMS[a].cat.localeCompare(ITEMS[b].cat)).map(i => { const it = ITEMS[i], p = Math.max(1, Math.floor(it.price / 2)), q = questNeedsItem(i);
      return `<div class="shoprow"><span class="ii">${svg(iconOf(it), 20, gemCol(i))}</span><span class="tx"><b>${it.name} ×${inv(i)}</b><span>${q ? "потрібно для квесту " + q : itemLine(it)}</span></span><span class="pr">${money(p)}</span><button class="btn sm" data-sell="${i}" data-shopid="${id}">Продати 1</button>${inv(i) > 1 ? `<button class="btn sm" data-sellall="${i}" data-shopid="${id}">Усі</button>` : ""}</div>`; }).join("") || `<div class="hint">Нема чого продати.</div>`;
  }
  openModal(`<div class="mbox" style="width:820px">${mhead("Крамниця", `<span class="hint">${NPCS[Object.keys(NPCS).find(k => NPCS[k].shop === id)].name}</span>`)}${tabs}<div class="list">${rows}</div><div class="money ink">У вас: ${money(S.cop)}</div></div>`);
}
function openJournal(){
  const act = Object.entries(S.quests).filter(([, q]) => q.st === "active"), done = Object.entries(S.quests).filter(([, q]) => q.st === "done");
  const where = giver => { const l = Object.keys(LOCS).find(k => LOCS[k].npcs.some(n => n[0] === giver)); return l ? NODES[l].name : ""; };
  const avail = Object.keys(QUESTS).filter(qAvail);
  const box = ([qid]) => { const Q = QUESTS[qid]; return `<div class="qbox${qReady(qid) ? " ready" : ""}"><b>${Q.name}</b><p>${Q.text}</p><p class="hint">Дає: ${NPCS[Q.giver].name} (${where(Q.giver)}). Виконано: ${qProgressTxt(qid)}.${qReady(qid) ? " <b class='q'>Можна здавати!</b>" : ""}</p></div>`; };
  openModal(`<div class="mbox" style="width:720px">${mhead("Квести", `<span class="hint">виконано ${done.length} із ${Object.keys(QUESTS).length}</span>`)}
   ${act.length ? act.map(box).join("") : `<div class="hint">Активних завдань нема. Шукайте персонажів зі знаком «!» на карті й у локаціях.</div>`}
   ${avail.length ? `<div class="sub">Можна взяти</div>${avail.map(q => `<div class="row"><span class="qm">!</span><span class="g">${QUESTS[q].name}</span><span class="r">${NPCS[QUESTS[q].giver].name}, ${where(QUESTS[q].giver)}</span></div>`).join("")}` : ""}
   ${done.length ? `<div class="sub">Виконані</div><div class="donelist">${done.map(([qid]) => `<span>${QUESTS[qid].name}</span>`).join("")}</div>` : ""}</div>`);
}
function allTypes(){ return [...Object.keys(MOBS), ...BESTIARY.map(d => d.id)]; }
function whereFound(type){
  const out = Object.keys(LOCS).filter(k => LOCS[k].mobs.some(m => m[0] === type)).map(k => NODES[k].name);
  const d = bestById(type); if (d && !MOBS[type]) out.push(...Object.values(NODES).filter(n => n.reg && d.reg.includes(n.reg)).map(n => n.name));
  for (const Dn of Object.values(DUNGEONS)) if (Dn.pool.includes(type) || Dn.boss === type) out.push(Dn.name);
  return [...new Set(out)];
}
function openCodex(){
  const types = allTypes(), known = types.filter(t => S.codex[t]).length;
  const sel = UI.cxSel || types.find(t => S.codex[t]);
  const grid = types.map(t => S.codex[t] ? `<button class="cx${t === sel ? " on" : ""}" data-cx="${t}" aria-label="${mobDef(t).name}">${sprite(t, 72, 62, 1.45, false)}<span>${mobDef(t).name}</span></button>` : `<div class="cx unk">?</div>`).join("");
  let info = `<div class="hint">Ще нікого не зустріли. Вирушайте в дорогу.</div>`;
  if (sel){ const d = mobDef(sel), st = mobStats(sel, 5);
    info = `<div class="cxinfo"><div class="big">${sprite(sel, 150, 150, (d.design.size || 1) > 1.4 ? 2.4 : 3.3, false)}</div><div class="cxt"><h3>${d.name}</h3>
      <div class="hint">${(ARCHL[st.arch] || "Звір")}${d.tier ? " · ступінь " + d.tier : ""}${d.boss ? " · бос" : d.dboss ? " · бос підземелля" : ""}</div><div class="lore">${d.lore || ""}</div>
      ${wardHTML(st)}<div class="kvs"><b>Трофеї:</b> ${st.drop.filter(([i]) => !i.startsWith("raw")).map(([i]) => ITEMS[i] ? ITEMS[i].name : "").filter(Boolean).join(", ") || "мідь"}</div><div class="kvs"><b>Де водиться:</b> ${whereFound(sel).join(", ") || "—"}</div></div></div>`; }
  openModal(`<div class="mbox" style="width:980px">${mhead("Бестіарій", `<span class="hint">відкрито ${known} із ${types.length}</span>`)}${info}<div class="codex">${grid}</div></div>`);
}
function openCrafts(){
  const k = UI.craftTab, P = PROFS[k], p = S.prof[k];
  const tabs = Object.entries(PROFS).map(([id, x]) => `<button class="ptab${id === k ? " on" : ""}" data-crafttab="${id}">${svg(x.icon, 18)}<span>${x.name}</span><b>${S.prof[id].lv}</b><i style="width:${S.prof[id].lv >= 10 ? 100 : S.prof[id].xp / profNeed(S.prof[id].lv) * 100}%"></i></button>`).join("");
  let body = `<div class="hint it">${P.text}</div><div class="kv"><span>Рівень ремесла</span><b>${p.lv}${p.lv < 10 ? ` · ${p.xp}/${profNeed(p.lv)}` : " (максимум)"}</b></div>`;
  if (P.kind === "gather"){
    const L = id => Object.keys(LOCS).filter(l => LOCS[l].res[k]).map(l => ({l, t:LOCS[l].res[k]}));
    body += `<div class="sub">Ресурси</div>` + [1,2,3,4,5].map(t => { const it = ITEMS[{herb:"h", mine:"o", fish:"f"}[k] + t], ok = p.lv >= TIER_LV[t];
      return `<div class="shoprow${ok ? "" : " off"}"><span class="ii">${svg(P.icon, 18, ok ? "#e7c9a8" : "#5a534b")}</span><span class="tx"><b>${it.name}</b><span>тір ${t} · потрібен ${TIER_LV[t]} рівень · у торбі: ${inv(it.id)}</span></span></div>`; }).join("");
    body += `<div class="sub">Де шукати</div><div class="hint">${L().map(x => `${NODES[x.l].name} (до ${x.t})`).join(", ")}</div><div class="hint">Збирайте, натискаючи на значки трав, руди й риби просто на сцені локації.</div>`;
  } else {
    const gOrd = g => g === "Огранювання" ? 1 : g === "З'єднання" ? 2 : 0;
    const list = RECIPES.filter(r => r.prof === k).sort((a, b) => gOrd(a.group) - gOrd(b.group) || a.lv - b.lv);
    let lastG = null;
    body += list.map(r => { const it = ITEMS[r.out], ok = canCraft(r), lvOk = p.lv >= r.lv;
      const head = r.group && r.group !== lastG ? `<div class="sub">${(lastG = r.group)}</div>` : "";
      return head + `<div class="shoprow${lvOk ? "" : " off"}"><span class="ii">${svg(iconOf(it), 18, gemCol(r.out))}</span><span class="tx"><b>${it.name}</b><span>${Object.entries(r.in).map(([i, n]) => `<em class="${inv(i) >= n ? "ok" : "no"}">${ITEMS[i].name} ${inv(i)}/${n}</em>`).join(" · ")}${lvOk ? "" : ` · потрібен ${r.lv} рівень`}</span></span><button class="btn p sm" data-craft="${r.id}" ${ok ? "" : "disabled"}>Створити</button></div>`; }).join("");
    if (k === "jewel") body += `<div class="hint">Огранені самоцвіти вставляються в гнізда речей у вікні «Персонаж».</div>`;
  }
  openModal(`<div class="mbox" style="width:900px">${mhead("Ремесла")}<div class="craftrow"><div class="ptabs">${tabs}</div><div class="craftbody">${body}</div></div></div>`);
}
function openInfo(title, text){ openModal(`<div class="mbox" style="width:540px">${mhead(title)}<p class="say">${text}</p></div>`); }
function openSkills(){
  openInfo("Вміння в бою", `<b>Удар</b>: звичайна атака зброєю.<br><b>Сильний удар</b>: урон ×1,6, але легше ухилитися; 20 енергії. Пробиває щит.<br><b>Блок</b>: удари по вас слабшають до 40%, енергія +15.<br><b>Втекти</b>: 50% (від боса 25%).<br><b>Оберіг</b>: з'являється, якщо в торбі є те, чого боїться нечисть. Пече на чверть здоров'я й оглушує.<br><b>Пояс</b>: зілля, еліксири й сувої. Застосування в бою займає хід.<br><br>Повадки: Стрілець здаля й блудний вогник частіше ухиляються; Чаклун б'є крізь броню; Налітач висмоктує енергію; Злодій краде гроші й тікає; Прикликач кличе підмогу; Падає зі стелі: перший удар і отрута; За щитом: звичайний удар слабне.`);
}
function openSettings(){ openModal(`<div class="mbox" style="width:500px">${mhead("Налаштування")}<p class="say">Прогрес героя ${esc(S.name)} зберігається в цьому браузері автоматично.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-act="logout">Вийти до екрана входу</button><button class="btn p" data-act="reset">Почати цим героєм з 1 рівня</button></div></div>`); }
