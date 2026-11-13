/* ============ іконки речей ============ */
const ITEM_IC = {
  rusty_sword:"broadsword", smith_sword:"broadsword", merc_axe:"war-axe", toporets:"wood-axe", bartka:"halberd", order_blade:"piercing-sword", shade_blade:"bloody-sword", chorno_bartka:"battle-axe",
  leather_cap:"leather-armor", iron_helm:"visored-helm", krysania:"pilgrim-hat", knight_helm:"black-knight-helm",
  leather_vest:"leather-vest", chain:"chain-mail", alpha_pelt:"fur-shirt", keptar:"fur-shirt", abyss_plate:"breastplate",
  boots:"boots", iron_boots:"metal-boot", postoly:"leather-boot",
  warden_amulet:"gem-pendant", gerdan:"pearl-necklace", kryvulia:"primitive-necklace", molfar_amulet:"gem-necklace",
  patched_cloak:"cape", wool_cloak:"cape", ranger_cloak:"cape", shadow_cloak:"cape",
  rope_belt:"belt", leather_belt:"belt", cheres:"belt-armor", dovbush_belt:"belt-armor",
  leather_pants:"leg-armor", chain_legs:"leg-armor", steel_legs:"leg-armor", knight_legs:"leg-armor",
  leather_gloves:"gloves", iron_gloves:"gauntlet", opryshok_gloves:"gloves", abyss_gloves:"mailed-fist",
  wood_shield:"round-shield", iron_shield:"round-shield", warden_shield:"bell-shield", order_shield:"checked-shield", chorno_shield:"bell-shield",
  potion_s:"health-potion", potion_l:"heart-bottle", potion_e:"potion-ball", potion_xe:"round-potion", zhyvytsia:"standing-potion",
  elix_str:"bubbling-flask", elix_skin:"fizzing-flask", elix_agi:"round-bottom-flask", elix_wil:"magic-potion",
  scroll_heal:"scroll-unfurled", scroll_fire:"scroll-unfurled", scroll_shield:"scroll-unfurled", scroll_tp:"teleport", scroll_curse:"scroll-unfurled", scroll_storm:"scroll-unfurled", scroll_ward:"tied-scroll",
  box:"locked-chest", rat_tail:"rolled-cloth", scrap:"metal-scales", fang:"fangs", wolf_skin:"animal-hide", slime:"powder", bone:"broken-bone", wisp_dust:"powder",
  dark_shard:"crystal-shine", boar_tusk:"boar-tusks", tiger_claw:"claws", spark_dust:"powder", rotten_cloth:"rolled-cloth", sting:"scorpion-tail", order_badge:"medal",
  ghost_dust:"powder", stone_heart:"stone-sphere", web:"spider-web", troll_hide:"animal-hide", scale:"fish-scales",
  raw1:"crystal-growth", raw2:"crystal-cluster", raw3:"crystal-cluster", o5:"crystal-cluster",
};
const SLOT_IC = {helmet:"visored-helm", amulet:"gem-pendant", cloak:"cape", armor:"breastplate", belt:"belt", legs:"leg-armor", gloves:"gauntlet", ring1:"ring", ring2:"ring", ring:"ring", boots:"boots", weapon:"broadsword", offhand:"round-shield"};
function itemIc(id){
  const it = ITEMS[id]; if (!it) return "swap-bag"; if (ITEM_IC[id]) return ITEM_IC[id];
  if (it.slot) return SLOT_IC[it.slot]; if (it.gem) return "cut-diamond"; if (it.cat === "ward") return "bell-shield";
  if (it.res === "herb") return "herbs-bundle"; if (it.res === "mine") return "ore"; if (it.res === "fish") return "fish-cooked";
  if (it.scroll) return "scroll-unfurled"; if (it.use) return "health-potion"; return "swap-bag";
}
const icCol = id => { const it = ITEMS[id]; if (!it) return "#cfc6b4"; if (it.gem) return it.col; const r = rarity(it); return r ? RARC[r] : "#e6dccb"; };
// клітинка з річчю: іконка в рамці рідкості
function cellIt(id, o = {}){
  const it = ITEMS[id], r = rarity(it), sz = o.size || 56, n = o.n, sh = sharpOf(id);
  const mark = o.cmp ? (o.cmp > 0 ? `<i class="mk up">▲</i>` : o.cmp < 0 ? `<i class="mk dn">▼</i>` : "") : "";
  return `<button class="gcell r${r}${o.sel ? " sel" : ""}${o.lock ? " lock" : ""}" style="width:${sz}px;height:${sz}px" ${o.data || ""} aria-label="${esc(it.name)}${n > 1 ? ", " + n + " шт." : ""}"${o.notitle ? "" : ` title="${esc(it.name)}"`}>${itemArt(id, Math.round(sz * .86))}${n > 1 ? `<b class="n">${n}</b>` : ""}${sh && it.slot ? `<b class="sh">+${sh}</b>` : ""}${mark}</button>`;
}
// наскільки річ краща за надягнуту: сума зважених характеристик
function itemScore(it){ if (!it) return 0; const d = it.dmg ? (it.dmg[0] + it.dmg[1]) / 2 : 0; return d * 3 + (it.hp || 0) * .5 + (it.def || 0) * 3 + (it.str || 0) * 3 + (it.agi || 0) * 2.5 + (it.wil || 0) * 2 + (it.crit || 0) * 3 + (it.sock || 0) * 4; }
function cmpEquip(id){
  const it = ITEMS[id]; if (!it.slot) return 0;
  const slots = it.slot === "ring" ? ["ring1", "ring2"] : [it.slot];
  const cur = slots.map(s => S.equip[s] ? itemScore(ITEMS[S.equip[s]]) : -1);
  const worst = Math.min(...cur), me = itemScore(it);
  return me > worst + .5 ? 1 : me < worst - .5 ? -1 : 0;
}
function diffLines(id){
  const it = ITEMS[id]; if (!it.slot) return "";
  const slot = it.slot === "ring" ? (!S.equip.ring1 ? "ring1" : !S.equip.ring2 ? "ring2" : (itemScore(ITEMS[S.equip.ring1]) <= itemScore(ITEMS[S.equip.ring2]) ? "ring1" : "ring2")) : it.slot;
  const cur = S.equip[slot] ? ITEMS[S.equip[slot]] : null;
  const keys = [["dmg","Урон"],["hp","Здоров'я"],["def","Захист"],["str","Сила"],["agi","Спритність"],["wil","Воля"],["crit","Крит, %"],["sock","Гнізда"]];
  const val = (x, k) => !x ? 0 : k === "dmg" ? (x.dmg ? (x.dmg[0] + x.dmg[1]) / 2 : 0) : (x[k] || 0);
  const rows = keys.map(([k, l]) => { const a = val(cur, k), b = val(it, k); if (!a && !b) return ""; const d = Math.round((b - a) * 10) / 10;
    return `<div class="dl ${d > 0 ? "up" : d < 0 ? "dn" : ""}"><span>${l}</span><b>${d > 0 ? "▲ +" + d : d < 0 ? "▼ " + d : "="}</b></div>`; }).join("");
  return `<div class="cmp"><div class="lbl">${cur ? "Порівняно з «" + esc(cur.name) + "»" : "Слот порожній"}</div>${rows}</div>`;
}

/* ============ вікна з верхнього меню, як у Кристалі Вічності ============ */
const BOOK = [["hero","Герой","visored-helm","C"],["bag","Торба","knapsack","B"],["skills","Вміння","spell-book","K"],["quests","Квести","scroll-quill","Q"],["craft","Ремесла","anvil","R"],
  ["map","Мапа","treasure-map","M"],["codex","Бестіарій","crowned-skull","X"],["market","Ринок","two-coins","T"],["ach","Досягнення","trophy","A"],["settings","Налаштування","settings-knobs",""]];
function bookBadge(k){
  if (k === "skills") return S.lvl >= BRANCH_LVL && !S.branch ? "!" : "";
  if (k === "quests"){ const r = Object.keys(S.quests).filter(qReady).length; return r ? "?" : ""; }
  if (k === "craft"){ const n = RECIPES.filter(canCraft).length; return n || ""; }
  if (k === "market"){ const n = contracts().filter(cReady).length; return n || ""; }
  return "";
}
const WINW = {hero:1240, skills:980, quests:1000, craft:960, codex:1060, zcodex:1060, market:1100, ach:1000, settings:720};
const WINT = {hero:"Персонаж", skills:"Вміння", quests:"Журнал квестів", craft:"Ремесла", codex:"Бестіарій", zcodex:"Бестіарій Закарпаття", market:"Ринок і контракти", ach:"Досягнення", settings:"Налаштування"};
const WINI = {hero:"visored-helm", skills:"spell-book", quests:"scroll-quill", craft:"anvil", codex:"crowned-skull", zcodex:"crowned-skull", market:"two-coins", ach:"trophy", settings:"settings-knobs"};
// одне вікно на кожну кнопку меню; торба відкривається разом з героєм
function openBook(tab){
  if (tab) UI.book = tab; if (!UI.book) UI.book = "hero";
  let k = UI.book === "bag" ? "hero" : UI.book;
  if (k === "zcodex" && !inZak()) k = UI.book = "codex";
  const body = ({hero:winHero, skills:bookSkills, quests:bookQuests, craft:craftBody, codex:() => codexBody(false), zcodex:() => codexBody(true), market:bookMarket, ach:bookAch, settings:bookSettings}[k] || winHero)();
  const who = k === "hero" ? `<span class="who">${esc(S.name)} · ${S.lvl} рівень${S.branch ? " · " + BRANCHES[S.branch].name : ""}</span>` : "";
  hideTip();
  openModal(`<div class="kvw kv-${k}" role="document" style="width:${WINW[k] || 1000}px"><div class="kvh">${gi(WINI[k], 24, "#d9a441")}<h2>${WINT[k]}</h2>${who}<button class="x" data-act="close" aria-label="Закрити">×</button></div><section class="kvb">${body}</section></div>`);
  if (READY) renderTop();
}
const inZak = () => NODES[S.loc] && NODES[S.loc].r === "zak";
const lbl = t => `<div class="blbl">${t}</div>`;
const kvl = (k, v, sub) => `<div class="bkv"><span>${k}</span><b>${v}${sub ? ` <i>${sub}</i>` : ""}</b></div>`;

/* ---------- Персонаж: лялька, характеристики й торба в одному вікні ---------- */
const DOLL_L = ["helmet","amulet","cloak","armor","belt","legs"], DOLL_R = ["weapon","offhand","gloves","ring1","ring2","boots"];
function dollSlot(s){
  const id = S.equip[s], it = id && ITEMS[id], nm = SLOTS.find(x => x[0] === s)[1], sel = UI.bsel === "eq:" + s;
  const socks = it && it.sock ? `<span class="dsocks">${sockArr(s).map((g, i) => g ? `<button class="sock full" data-unsock="${s}:${i}" data-tip="gem:${g}" style="--gc:${ITEMS[g].col}" aria-label="${ITEMS[g].name}: вийняти"></button>` : `<button class="sock${UI.sockPick === s + ":" + i ? " pick" : ""}" data-sockpick="${s}:${i}" aria-label="Порожнє гніздо" title="Порожнє гніздо: перетягніть сюди самоцвіт"></button>`).join("")}</span>` : "";
  const cell = it ? cellIt(id, {size:58, sel, notitle:true, data:`data-bsel="eq:${s}" data-drag="eq:${s}" draggable="true" data-tip="eq:${s}"`})
    : `<span class="gcell empty" style="width:58px;height:58px" data-tip="slot:${s}">${gi(SLOT_IC[s], 28, "#4f473e")}</span>`;
  return `<div class="dslot3" data-dz="eq:${s}">${cell}${socks}<span class="dnm">${nm}</span></div>`;
}
function winHero(){
  const st = stats(), xpPct = S.lvl >= MAXLVL ? 100 : Math.round(S.xp / need(S.lvl) * 100);
  const bar = (cls, v, max, t) => `<div class="hbar ${cls}"><i style="width:${Math.max(0, Math.min(100, v / max * 100))}%"></i><span>${t}</span></div>`;
  const sets = Object.entries(setCounts()).map(([k, n]) => { const St = SETS[k];
    return `<div class="setb"><b>${St.name} ${n}/${St.items.length}</b>${Object.entries(St.bonus).map(([need, bon]) => `<span class="${n >= +need ? "on" : ""}">${n >= +need ? "✓" : need + ":"} ${statsText(bon)}</span>`).join("")}</div>`; }).join("");
  const doll = `<section class="hdoll" data-dz="doll">
      <div class="dcols"><div class="dc">${DOLL_L.map(dollSlot).join("")}</div>
        <div class="dfig">${heroArt(165)}<div class="dlv"><b>${S.lvl}</b><span>рівень</span></div></div>
        <div class="dc">${DOLL_R.map(dollSlot).join("")}</div></div>
      ${bar("hp", S.hp, st.maxHp, `Здоров'я ${Math.ceil(S.hp)} / ${st.maxHp}`)}${bar("en", S.en, st.maxEn, `Енергія ${Math.floor(S.en)} / ${st.maxEn}`)}${bar("xp", xpPct, 100, S.lvl >= MAXLVL ? "Максимальний рівень" : `Досвід ${S.xp} / ${need(S.lvl)}`)}
      ${sets ? `<div class="dsets">${sets}</div>` : ""}</section>`;
  const P = S.perks, perks = statsText({hp:P.hp, en:P.en, dmg:P.dmg, crit:P.crit, wil:P.wil, disc:P.disc});
  const stat = `<section class="hstats">${lbl("Характеристики")}
      ${kvl("Сила", st.str)}${kvl("Спритність", st.agi)}${kvl("Витривалість", st.end)}${kvl("Воля", st.wil)}
      ${lbl("У бою")}${kvl("Урон", st.dmg[0] + "–" + st.dmg[1])}${kvl("Захист", st.def, "−" + Math.round(reduce(st.def) * 100) + "%")}
      ${kvl("Шанс криту", Math.round(5 + st.agi * .5 + st.crit) + "%")}${st.dodge ? kvl("Ухилення", "+" + st.dodge + "%") : ""}${kvl("Сила сувоїв", "+" + Math.round((spellMul() - 1) * 100) + "%")}${kvl("Захист від чар", "−" + Math.round((1 - magicCut()) * 100) + "%")}
      ${lbl("Розвиток")}${kvl("Гілка", S.branch ? `<span style="color:${BRANCHES[S.branch].col}">${BRANCHES[S.branch].name}</span>` : S.lvl >= BRANCH_LVL ? `<button class="lnk" data-book="skills">обрати</button>` : "з " + BRANCH_LVL + " рівня")}
      ${S.order ? kvl("Орден", ORDERS[S.order].name) : ""}${kvl("Перемог", S.kills)}
      ${perks ? kvl("Дари", perks) : ""}${S.buffs.length ? kvl("Еліксири", S.buffs.map(x => ITEMS[x.id].name + " (" + x.n + ")").join(", ")) : ""}
      ${lbl("Ремесла")}<div class="profrow">${Object.entries(PROFS).map(([k, p]) => `<span>${p.name} <b>${S.prof[k].lv}</b></span>`).join("")}</div></section>`;
  return `<div class="hrow3">${doll}${stat}${bagPanel()}</div>`;
}
const BAGF = [["all","Усе"],["gear","Речі"],["use","Зілля"],["gem","Самоцвіти"],["res","Ресурси"],["ward","Обереги"],["misc","Трофеї"]];
function bagPanel(){
  const f = UI.bagTab && BAGF.some(x => x[0] === UI.bagTab) ? UI.bagTab : "all";
  const ids = Object.keys(S.inv).filter(id => inv(id) > 0 && (f === "all" || ITEMS[id].cat === f))
    .sort((a, b) => (ITEMS[a].slot ? 0 : 1) - (ITEMS[b].slot ? 0 : 1) || rarity(ITEMS[b]) - rarity(ITEMS[a]) || (ITEMS[b].lvl || 0) - (ITEMS[a].lvl || 0) || ITEMS[a].name.localeCompare(ITEMS[b].name, "uk"));
  const sel = UI.bsel && UI.bsel.startsWith("inv:") && inv(UI.bsel.slice(4)) ? UI.bsel.slice(4) : null;
  const cells = ids.map(id => cellIt(id, {size:52, n:inv(id), sel:id === sel, notitle:true, lock:ITEMS[id].lvl > S.lvl, cmp:ITEMS[id].slot ? cmpEquip(id) : 0, data:`data-bsel="inv:${id}" data-drag="inv:${id}" draggable="true" data-tip="inv:${id}"`}));
  const free = Math.max(0, 40 - cells.length); for (let i = 0; i < free; i++) cells.push(`<span class="gcell empty" style="width:52px;height:52px"></span>`);
  const chips = BAGF.map(([k, l]) => `<button class="chip${k === f ? " on" : ""}" data-bagtab="${k}">${l}</button>`).join("");
  const belt = S.belt.map((id, i) => `<span class="beltc" data-dz="belt:${i}">${id ? cellIt(id, {size:46, n:inv(id), notitle:true, data:`data-drag="belt:${i}" draggable="true" data-tip="belt:${i}" data-unbelt="${i}" aria-label="${esc(ITEMS[id].name)}: зняти з пояса"`}) : `<span class="gcell empty" style="width:46px;height:46px"></span>`}</span>`).join("");
  let act = `<div class="selbar hint lm">Перетягніть річ на героя, щоб надягти, а зілля на пояс. Подвійний клік робить те саме.</div>`;
  const selId = sel || (UI.bsel && UI.bsel.startsWith("eq:") ? S.equip[UI.bsel.slice(3)] : null);
  if (selId && ITEMS[selId]){ const it = ITEMS[selId], eqSlot = UI.bsel.startsWith("eq:") ? UI.bsel.slice(3) : null, locked = it.lvl && it.lvl > S.lvl; let b = "";
    if (eqSlot) b += `<button class="btn sm" data-unequip="${eqSlot}" ${B ? "disabled" : ""}>Зняти</button>`;
    else { if (it.slot) b += `<button class="btn p sm" data-equip="${selId}" ${locked || B ? "disabled" : ""}>${locked ? "Потрібен " + it.lvl + " рівень" : "Надягти"}</button>`;
      if (it.cat === "use") b += `<button class="btn p sm" data-use="${selId}">${it.open ? "Відкрити" : "Використати"}</button><button class="btn sm" data-tobelt="${selId}" ${S.belt.includes(selId) ? "disabled" : ""}>На пояс</button>`;
      if (it.cat !== "use" && !questNeedsItem(selId)) b += `<button class="btn sm" data-drop="${selId}">Викинути</button>`; }
    act = `<div class="selbar">${cellIt(selId, {size:40, notitle:true})}<span class="sbt"><b class="r${rarity(it)}">${esc(it.name)}</b><i>${itemLine(it)}</i></span><span class="sbb">${b}</span></div>`; }
  if (UI.sockPick){ const gems = Object.keys(S.inv).filter(k => ITEMS[k].gem);
    act = `<div class="selbar">${lbl("Вставити самоцвіт:")}${gems.length ? gems.map(g => cellIt(g, {size:40, n:inv(g), notitle:true, data:`data-insgem="${g}" data-tip="inv:${g}"`})).join("") : `<span class="hint lm">Немає огранених самоцвітів. Сирці огранює ювелір.</span>`}</div>`; }
  const jv = junkValue();
  return `<section class="hbag"><div class="bagh">${lbl("Торба")}<span class="hint lm">${Object.keys(S.inv).length} речей</span></div><div class="chips">${chips}</div>
    <div class="bgrid3" data-dz="bag">${cells.join("")}</div>${act}
    <div class="beltrow">${lbl("Пояс")}<div class="beltcells">${belt}</div></div>
    <div class="bfoot">${gi("two-coins", 18, "#d9a441")}<span>${money(S.cop)}</span>${jv ? `<span class="hint lm">мотлоху на ${moneyTxt(jv)}</span>` : ""}</div></section>`;
}

/* ---------- підказка над річчю ---------- */
function tipItem(src){
  const [k, v] = src.split(":"); if (k === "inv" || k === "gem") return v; if (k === "eq") return S.equip[v]; if (k === "belt") return S.belt[+v]; return null;
}
function tipHTML(src){
  if (src.startsWith("slot:")){ const s = src.slice(5); return `<b>${SLOTS.find(x => x[0] === s)[1]}</b><span class="tl">Порожньо. Перетягніть сюди річ з торби.</span>`; }
  const id = tipItem(src), it = id && ITEMS[id]; if (!it) return "";
  const r = rarity(it), sh = sharpOf(id), eq = src.startsWith("eq:");
  const kind = it.slot ? SLOTS.find(s => s[0] === it.slot || (it.slot === "ring" && s[0] === "ring1"))[1] : {use:"Зілля й сувої", gem:"Самоцвіт", res:"Ресурс", ward:"Оберіг", misc:"Трофей"}[it.cat] || "";
  const setTxt = it.set ? `<span class="tl">${SETS[it.set].name}: ${SETS[it.set].items.map(x => ITEMS[x] ? `<em class="${Object.values(S.equip).includes(x) ? "on" : ""}">${ITEMS[x].name}</em>` : "").join(", ")}</span>` : "";
  return `<b class="r${r}">${esc(it.name)}${sh && it.slot ? ` +${sh}` : ""}</b><span class="tk">${RARN[r]} · ${kind}${it.lvl > 1 ? ` · <span class="${it.lvl > S.lvl ? "no" : ""}">від ${it.lvl} рівня</span>` : ""}</span>
    <span class="tl">${itemLine(it)}</span>${setTxt}${it.slot && !eq ? diffLines(id) : ""}<span class="tf">Скупник дасть ${moneyTxt(sellPrice(id))}${src.startsWith("inv:") && inv(id) > 1 ? " · у торбі " + inv(id) : ""}</span>`;
}
function showTip(el, src){
  let t = document.getElementById("itip"); const h = tipHTML(src); if (!h){ hideTip(); return; }
  if (!t){ t = document.createElement("div"); t.id = "itip"; t.className = "itip"; document.body.appendChild(t); }
  if (t.dataset.src !== src){ t.innerHTML = h; t.dataset.src = src; }
  const r = el.getBoundingClientRect(); t.style.display = "block";
  const tw = t.offsetWidth, th = t.offsetHeight; let x = r.right + 10, y = r.top;
  if (x + tw > innerWidth - 8) x = r.left - tw - 10; if (y + th > innerHeight - 8) y = innerHeight - th - 8;
  t.style.left = Math.max(8, x) + "px"; t.style.top = Math.max(8, y) + "px";
}
function hideTip(){ const t = document.getElementById("itip"); if (t){ t.style.display = "none"; t.dataset.src = ""; } }

/* ---------- перетягування: торба ↔ лялька ↔ пояс ---------- */
let DRAG = null;
function dropOk(src, dst){
  const [sk, sv] = src.split(":"), [dk, dv] = dst.split(":");
  if (B && (sk === "eq" || dk === "eq" || dk === "doll")) return false;
  if (sk === "inv"){ const it = ITEMS[sv]; if (!it) return false;
    if (dk === "eq"){ if (it.gem) return !!S.equip[dv] && sockArr(dv).includes(null); return !!it.slot && (it.slot === dv || (it.slot === "ring" && (dv === "ring1" || dv === "ring2"))) && (it.lvl || 1) <= S.lvl; }
    if (dk === "doll") return !!it.slot && (it.lvl || 1) <= S.lvl;
    if (dk === "belt") return it.cat === "use";
    return false; }
  if (sk === "eq") return dk === "bag";
  if (sk === "belt") return dk === "bag" || (dk === "belt" && dv !== sv);
  return false;
}
function doDrop(src, dst){
  const [sk, sv] = src.split(":"), [dk, dv] = dst.split(":");
  if (sk === "inv"){ const it = ITEMS[sv];
    if (dk === "eq" && it.gem){ const i = sockArr(dv).indexOf(null); if (i >= 0) insertGem(dv, i, sv); }
    else if (dk === "eq") equip(sv, dv);
    else if (dk === "doll") equip(sv);
    else if (dk === "belt"){ const j = S.belt.indexOf(sv); if (j >= 0) S.belt[j] = S.belt[+dv]; S.belt[+dv] = sv; save(); renderBelt(); } }
  else if (sk === "eq"){ unequip(sv); }
  else if (sk === "belt"){ if (dk === "bag") S.belt[+sv] = null; else { const a = S.belt[+sv]; S.belt[+sv] = S.belt[+dv]; S.belt[+dv] = a; } save(); renderBelt(); }
  UI.bsel = null; if (modalOpen()) openBook("hero");
}
function dblItem(src){
  const [k, v] = src.split(":");
  if (k === "inv"){ const it = ITEMS[v]; if (!it) return; if (it.slot){ if (!B) equip(v); } else if (it.cat === "use") useItem(v); else return; }
  else if (k === "eq"){ if (!B) unequip(v); }
  else if (k === "belt"){ S.belt[+v] = null; save(); renderBelt(); }
  UI.bsel = null; if (modalOpen()) openBook("hero");
}
function initDrag(){
  document.addEventListener("dragstart", ev => { const el = ev.target.closest && ev.target.closest("[data-drag]"); if (!el) return;
    DRAG = el.dataset.drag; try { ev.dataTransfer.setData("text/plain", DRAG); ev.dataTransfer.effectAllowed = "move"; } catch (e){}
    hideTip(); el.classList.add("dragging"); document.querySelectorAll("[data-dz]").forEach(d => { if (dropOk(DRAG, d.dataset.dz)) d.classList.add("dropok"); }); });
  document.addEventListener("dragend", () => { DRAG = null; document.querySelectorAll(".dragging,.dropok,.dropover").forEach(e => e.classList.remove("dragging", "dropok", "dropover")); });
  document.addEventListener("dragover", ev => { if (!DRAG) return; const t = ev.target.closest && ev.target.closest("[data-dz]");
    document.querySelectorAll(".dropover").forEach(e => { if (e !== t) e.classList.remove("dropover"); });
    if (t && dropOk(DRAG, t.dataset.dz)){ ev.preventDefault(); try { ev.dataTransfer.dropEffect = "move"; } catch (e){} t.classList.add("dropover"); } });
  document.addEventListener("drop", ev => { const t = ev.target.closest && ev.target.closest("[data-dz]"); if (!DRAG || !t || !dropOk(DRAG, t.dataset.dz)) return; ev.preventDefault(); const s = DRAG; DRAG = null; doDrop(s, t.dataset.dz); });
  document.addEventListener("mouseover", ev => { const el = ev.target.closest && ev.target.closest("[data-tip]"); if (!el || DRAG){ hideTip(); return; } showTip(el, el.dataset.tip); });
  document.addEventListener("scroll", hideTip, true);
}

function statsText(o){
  const N = {hp:" здоров'я", en:" енергії", def:" захисту", str:" сили", agi:" спритності", wil:" волі", crit:"% криту", dmg:"% урону", dmgp:"% урону", disc:"% знижки"};
  return Object.entries(o).filter(([, v]) => v).map(([k, v]) => `+${v}${N[k] || " " + k}`).join(", ");
}

/* ---------- Вміння: гілка розвитку й прийоми ---------- */
function bookSkills(){
  const basic = [["Удар", "sword-brandish", "Звичайна атака зброєю.", "—"], ["Сильний удар", "flanged-mace", "Урон ×1,6, пробиває щит, але легше ухилитися.", sCost() + " енергії"], ["Блок", "round-shield", "Удари слабшають до 40%, енергія +15.", "+15 енергії"], ["Оберіг", "bell-shield", "З'являється, коли в торбі є те, чого боїться нечисть. Приголомшує.", "оберіг"], ["Втекти", "run", "50% шансу, від боса 25%.", "—"]];
  const brow = ([n, ic, t, c]) => `<div class="prow">${gi(ic, 30, "#d9a441")}<span><b>${n}</b><i>${t}</i></span><em>${c}</em></div>`;
  let main;
  if (!S.branch){
    const can = S.lvl >= BRANCH_LVL;
    main = `<div class="bchoose"><p class="hint lm">${can ? "Оберіть гілку розвитку. Від неї залежать вміння, які герой отримуватиме з рівнями." : `Гілку розвитку обирають на ${BRANCH_LVL} рівні. До того герой б'ється базовими прийомами.`}</p>
      <div class="bcards">${Object.entries(BRANCHES).map(([k, Bd]) => `<div class="brc" style="--c:${Bd.col}">${gi(Bd.icon, 46, Bd.col)}<h3>${Bd.name}</h3><span class="hint lm">${Bd.stat} · ${Bd.row}</span><p>${Bd.text}</p>
        <ul>${Object.entries(TALENTS).filter(([, t]) => t.br === k).map(([, t]) => `<li>${t.name} <i>з ${TAL_SCHED[t.tier][0]} рівня</i></li>`).join("")}</ul>
        <button class="btn p" data-branch="${k}" ${can ? "" : "disabled"}>Обрати</button></div>`).join("")}</div></div>`;
  } else {
    const Bd = BRANCHES[S.branch];
    const rows = Object.entries(TALENTS).filter(([, t]) => t.br === S.branch).sort((a, b) => a[1].tier - b[1].tier).map(([k, t]) => { const r = tal(k), nx = talNext(k);
      return `<div class="trow${r ? " on" : ""}" style="--c:${Bd.col}"><span class="tic">${gi(t.icon, 34, r ? Bd.col : "#6b6152")}</span><span class="tt"><b>${t.name}${t.act ? ' <em class="act">прийом</em>' : ""}</b><i>${t.text}</i></span>
        <span class="tr"><b>${r ? "ранг " + r + "/" + t.max : "закрито"}</b><i>${nx ? (r ? "наступний ранг" : "відкриється") + " на " + nx + " рівні" : "максимум"}</i></span></div>`; }).join("");
    const others = Object.entries(BRANCHES).filter(([k]) => k !== S.branch).map(([k, O]) => `<button class="btn dk sm" data-branch="${k}">${O.name} · ${moneyTxt(branchCost())}</button>`).join("");
    main = `<div class="bhero" style="--c:${Bd.col}">${gi(Bd.icon, 54, Bd.col)}<div><h3>${Bd.name}</h3><span class="hint lm">${Bd.stat} · ${Bd.row}</span><p>${Bd.text}</p></div></div>
      ${lbl("Вміння гілки")}<div class="tlist">${rows}</div>
      <div class="bswitch">${lbl("Змінити гілку")}<span class="hint lm">Наставник переучує за гроші. Ранги нової гілки рахуються від вашого рівня.</span><div class="ibtn">${others}</div></div>`;
  }
  return `<div class="skills3"><div class="skm">${main}</div><aside class="skb">${lbl("Базові прийоми")}${basic.map(brow).join("")}</aside></div>`;
}
function questWhere(qid){ const g = QUESTS[qid].giver; const l = Object.keys(LOCS).find(k => LOCS[k].npcs.some(n => n[0] === g)); return l; }
function bookQuests(){
  const act = Object.keys(S.quests).filter(q => S.quests[q].st === "active"), done = Object.keys(S.quests).filter(q => S.quests[q].st === "done"), avail = Object.keys(QUESTS).filter(qAvail);
  const sel = UI.qsel && QUESTS[UI.qsel] ? UI.qsel : act[0] || avail[0];
  const row = (q, kind) => { const Q = QUESTS[q], l = questWhere(q);
    return `<button class="qrow${q === sel ? " on" : ""}${kind === "done" ? " done" : ""}" data-qsel="${q}"><span><b>${Q.name}</b><i>${kind === "act" ? (qReady(q) ? "можна здавати" : qProgressTxt(q)) : kind === "avail" ? "можна взяти" : "виконано"}</i></span><small>${NPCS[Q.giver].name}${l ? ", " + NODES[l].name : ""}${S.track === q ? " · відстежується" : ""}</small></button>`; };
  let det = `<div class="bcard empty">${gi("scroll-quill", 64, "#6b6152")}<p>Квестів поки нема. Шукайте персонажів зі знаком «!».</p></div>`;
  if (sel){ const Q = QUESTS[sel], q = S.quests[sel], l = questWhere(sel), st = q ? q.st : "avail";
    det = `<div class="bcard qdet"><span class="rr">${st === "active" ? (qReady(sel) ? "Можна здавати" : "Активний") : st === "done" ? "Виконано" : "Можна взяти"}</span><h3>${Q.name}</h3><p>${Q.text}</p>
      ${kvl("Хто дає", NPCS[Q.giver].name)}${l ? kvl("Де", NODES[l].name) : ""}${q && st === "active" ? kvl("Прогрес", qProgressTxt(sel)) : ""}${kvl("Нагорода", rewardTxt(Q))}
      <div class="ibtn">${l ? `<button class="btn p" data-qmap="${l}">${gi("treasure-map", 16, "#fff")} Показати на мапі</button>` : ""}${st === "active" ? `<button class="btn" data-qtrack="${sel}">${S.track === sel ? "Не відстежувати" : "Відстежувати на екрані"}</button>` : ""}</div></div>`; }
  return `<div class="quests2"><div class="qlist">
      ${lbl("Активні · " + act.length)}${act.map(q => row(q, "act")).join("") || `<div class="hint lm">Немає активних завдань.</div>`}
      ${avail.length ? lbl("Можна взяти · " + avail.length) + avail.map(q => row(q, "avail")).join("") : ""}
      ${done.length ? lbl("Виконані · " + done.length) + done.slice(-8).reverse().map(q => row(q, "done")).join("") : ""}
    </div><div class="qside">${det}</div></div>`;
}
function bookMarket(){
  const here = NODES[S.loc].r, regs = Object.keys(REG_PRICE), tr = tradeRoute();
  const table = `<table class="prtab"><thead><tr><th>Товар</th>${regs.map(r => `<th class="${r === here ? "here" : ""}">${REGIONS[r]}</th>`).join("")}</tr></thead><tbody>${Object.entries(PCAT).map(([c, n]) => { const vals = regs.map(r => priceMul(r, c)), mx = Math.max(...vals), mn = Math.min(...vals);
    return `<tr><td>${n}</td>${regs.map((r, i) => `<td class="${r === here ? "here" : ""} ${vals[i] === mx ? "hi" : vals[i] === mn ? "lo" : ""}">×${vals[i].toFixed(2).replace(".", ",")}</td>`).join("")}</tr>`; }).join("")}</tbody></table>`;
  const cs = contracts().map(c => { const rd = cReady(c), prog = c.kind === "kill" ? `${Math.min(c.prog, c.n)}/${c.n}` : `${Math.min(inv(c.item), c.n)}/${c.n}`;
    return `<div class="ctr${c.done ? " done" : rd ? " ready" : ""}"><div><b>${c.text}</b><span>${c.done ? "здано" : prog} · ${c.where}</span><span class="rw">${moneyTxt(c.cop)}${S.lvl < MAXLVL ? " · " + c.xp + " досвіду" : ""}</span></div>${c.done ? gi("check-mark", 22, "#7fb65f") : `<button class="btn sm ${rd ? "p" : "dk"}" data-ctdone="${c.id}" ${rd && isSafe(S.loc) && !T && !DG ? "" : "disabled"}>${rd ? (isSafe(S.loc) ? "Здати" : "Здати в місті") : "У процесі"}</button>`}</div>`; }).join("");
  const E = S.econ, hrs = Math.max(1 / 60, E.sec / 3600), tin = sumv(E.in), tout = sumv(E.out);
  const econ = Object.entries(ECON_IN).filter(([k]) => E.in[k]).map(([k, n]) => kvl(n, moneyTxt(E.in[k]))).join("") + Object.entries(ECON_OUT).filter(([k]) => E.out[k]).map(([k, n]) => kvl(n, "−" + moneyTxt(E.out[k]))).join("");
  const smith = smithHere();
  return `<div class="market2"><div class="mcol">
      <div class="bcard dk route">${gi("treasure-map", 26, "#d9a441")}<div><b>Торговий шлях дня</b><span>${PCAT[tr.cat]}: ${REGIONS[tr.from]} → ${REGIONS[tr.to]}, ціна <b class="gold">×${tr.k.toFixed(1).replace(".", ",")}</b>.</span><span class="hint lm">Ресурси й трофеї скупники беруть за 50% ціни × множник регіону. Речі завжди за 25%.</span></div></div>
      <div class="bcard">${lbl("Ціни скупників сьогодні · ви в: " + REGIONS[here])}${table}</div>
      <div class="bcard dk">${lbl("Заточка спорядження")}<span>Кожен рівень заточки: зброя +6% урону, броня +1 захисту і +4 здоров'я. До +10, шанс падає з кожним рівнем, невдача забирає лише гроші.</span>
        ${smith ? `<button class="btn p" data-forge="1">${gi("anvil", 16, "#fff")} Відкрити кузню</button>` : `<span class="hint lm">Кузні є в Попелястому Шпилі (Зброяр Остап) і в Мукачеві (Коваль Юрко).</span>`}</div>
    </div><div class="mcol">
      <div class="bcard">${lbl("Контракти гільдій · нові через " + contractsTimeLeft())}${cs}</div>
      <div class="bcard">${lbl("Ваша економіка")}${econ || `<span class="hint">Поки що нема ні доходів, ні витрат.</span>`}
        ${kvl("Разом", moneyTxt(tin) + " / −" + moneyTxt(tout))}${S.econ.sec >= 600 ? (v => kvl("За годину гри", (v < 0 ? "−" : "+") + moneyTxt(Math.abs(v)), "доходи мінус витрати"))(Math.round((tin - tout) / hrs)) : kvl("За годину гри", "—", "рахуємо після 10 хв гри")}</div>
    </div></div>`;
}
function bookAch(){
  checkAch();
  const n = ACH.filter(a => S.ach[a.id]).length;
  return `<div class="ach2"><div class="skhd"><span>Відкрито: <b class="pts">${n}</b> з ${ACH.length}</span><span class="hint lm">Кожне досягнення дає постійну нагороду.</span></div><div class="agrid">${ACH.map(a => { const v = Math.min(a.val(), achN(a)), N = achN(a), ok = S.ach[a.id];
    return `<div class="ach${ok ? " ok" : ""}"><span class="aic">${gi(a.icon, 30, ok ? "#e8b84a" : "#6b6152")}</span><div><b>${a.name}</b><span>${a.text}</span><span class="abar"><i style="width:${v / N * 100}%"></i></span><span class="arw">${ok ? "Отримано: " : "Нагорода: "}${rewText(a.rew)} · ${a.money ? moneyTxt(v) + " / " + moneyTxt(N) : v + " / " + N}</span></div></div>`; }).join("")}</div></div>`;
}
function bookSettings(){
  const o = S.opt, tg = (k, n, sub) => `<label class="opt"><span><b>${n}</b>${sub ? `<i>${sub}</i>` : ""}</span><input type="checkbox" data-opt="${k}" ${o[k] ? "checked" : ""}></label>`;
  return `<div class="set2"><div class="ogrid">${tg("dmgnum", "Показувати цифри шкоди", "над героєм і ворогами в бою")}${tg("mapfx", "Живі хмари й дим на карті", "вимкніть, якщо карта гальмує")}${tg("confirmRare", "Підтверджувати продаж цінних речей", "від рідкісних і вище, щоб не продати випадково")}${tg("fast", "Швидкий бій", "коротші паузи між ударами")}${tg("snd", "Звук", "удари, магія, перемоги й вітер: усе синтезується в браузері")}${tg("wx", "Погода на локаціях", "дощ, сніг, туман, пил і попіл")}</div>
    <div class="bcard dk"><span>Прогрес героя ${esc(S.name)} зберігається в цьому браузері автоматично.</span><div class="ibtn"><button class="btn dk" data-act="logout">Вийти до екрана входу</button><button class="btn p" data-act="reset">Почати цим героєм з 1 рівня</button></div></div>
    <p class="hint lm">Іконки: game-icons.net (Lorc, Delapouite та інші), ліцензія CC BY 3.0.</p></div>`;
}

/* ============ кузня ============ */
function openForge(){
  const rows = SLOTS.map(([s, l]) => { const id = S.equip[s]; if (!id) return ""; const it = ITEMS[id], n = sharpOf(id), max = n >= SHARP_MAX;
    return `<div class="frow">${cellIt(id, {size:48})}<div class="ftx"><b>${esc(it.name)} ${n ? `<span class="shp">+${n}</span>` : ""}</b><span>${l} · ${it.dmg ? "урон +" + 6 * n + "%" : "захист +" + n + ", здоров'я +" + 4 * n}${max ? " · максимум" : ` · шанс ${Math.round(sharpChance(id) * 100)}%`}</span></div>
      ${max ? "" : `<button class="btn p sm" data-sharp="${s}" ${S.cop >= sharpCost(id) ? "" : "disabled"}>+${n + 1} за ${moneyTxt(sharpCost(id))}</button>`}</div>`; }).join("");
  openModal(`<div class="mbox" style="width:640px">${mhead("Кузня: заточка", `<span class="hint">${money(S.cop)}</span>`)}<p class="hint">Зброя: +6% урону за рівень. Броня, щит і прикраси: +1 захисту й +4 здоров'я. Невдача не ламає річ, а лише забирає гроші.</p><div class="list">${rows || `<div class="hint">На вас нічого не надягнуто.</div>`}</div></div>`);
}

/* ============ відстеження квесту на екрані ============ */
function renderTracker(){
  const v = $("#view"); if (!v) return; let el = document.getElementById("qtrack");
  const q = S.track && S.quests[S.track] && S.quests[S.track].st === "active" ? S.track : null;
  if (!q || B || T || DG || UI.view !== "loc"){ if (el) el.remove(); return; }
  if (!el){ el = document.createElement("button"); el.id = "qtrack"; el.className = "qtrack"; v.appendChild(el); }
  el.dataset.book = "quests"; UI.qsel = q;
  el.innerHTML = `${gi("scroll-quill", 18, "#d9a441")}<span><b>${QUESTS[q].name}</b><i>${qReady(q) ? "можна здавати" : qProgressTxt(q)}</i></span>`;
}
