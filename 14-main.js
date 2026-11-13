/* ============ загальний рендер ============ */
function render(){
  renderTop(); renderBelt();
  $("#mid").classList.toggle("battle", !!B);
  if (B) renderBattle(); else if (DG && UI.view === "dungeon") renderDungeon(); else if (UI.view === "map") renderMap(); else renderLoc();
  renderChat(); drawAllSprites(); renderTracker();
}

/* ============ подорожі ============ */
function startTravel(to){
  if (B || T || DG) return;
  if (to === S.loc){ UI.view = "loc"; render(); return; }
  const path = route(S.loc, to); if (!path) return;
  const legs = []; for (let i = 0; i < path.length - 1; i++) legs.push([path[i], path[i + 1]]);
  T = {legs, i:0, t:0}; setLeg(); UI.sel = null; UI.gathering = null; UI.follow = true;
  msg(`Ви вирушили до ${NODES[to].name}.`); render();
}
function setLeg(){ const leg = T.legs[T.i], rd = roadOf(leg[0], leg[1]); T.dur = rd.dur; T.t = 0; T.ambush = rd.danger && Math.random() < .4 ? rnd(.3, .7) : null; }
function turnBack(){ if (!T) return; const leg = T.legs[T.i]; T = {legs:[[leg[1], leg[0]]], i:0, t:Math.max(0, T.dur - T.t), dur:T.dur, ambush:null}; msg("Ви повернули назад."); render(); }
function ambushPool(locId){
  const L = LOCS[locId], N = NODES[locId];
  if (L.demons) return BESTIARY.filter(d => d.reg.includes(N.reg) && d.tier < 3).map(d => [d.id, Math.min(10, N.L + d.tier - 1)]);
  return L.mobs.filter(([t]) => !mobDef(t).boss && !(S.order && mobDef(t).side === S.order)).map(([t,, l]) => [t, l]);
}
function tickTravel(dt){
  if (!T || B) return;
  T.t += dt;
  if (T.ambush !== null && T.t / T.dur >= T.ambush){
    T.ambush = null;
    const leg = T.legs[T.i]; let pool = ambushPool(leg[1]), src = leg[1]; if (!pool.length){ pool = ambushPool(leg[0]); src = leg[0]; }
    if (pool.length){ const [type, lvl] = pick(pool); msg(`Засідка! ${mobDef(type).name} нападає на дорозі.`, "warn"); startBattle([{type, lvl}], null, "travel", src); return; }
  }
  if (T.t >= T.dur){
    const leg = T.legs[T.i];
    if (T.i < T.legs.length - 1){ T.i++; S.prev = leg[0]; S.loc = leg[1]; S.visited[S.loc] = 1; setLeg(); msg(`Ви минули ${NODES[leg[1]].name}.`); questEvent("visit", S.loc); render(); }
    else { S.prev = leg[0]; S.loc = leg[1]; T = null; UI.view = "loc"; arrive(); }
  }
  updateTravelUI();
}
function arrive(){
  const rt = locRT(S.loc); rt.arrived = performance.now(); S.visited[S.loc] = 1;
  msg(`Ви прибули: ${NODES[S.loc].name}.`);
  questEvent("visit", S.loc); checkDistrictBoss(S.loc);
  for (const [npc] of LOCS[S.loc].npcs){ const mk = npcMark(npc); if (mk === "!") msg(`${NPCS[npc].name} має для вас завдання.`, "quest"); if (mk === "?") msg(`Можна здати завдання: ${NPCS[npc].name}.`, "quest"); }
  save(); render();
}
function updateTravelUI(){
  if (!T) return;
  const b = document.getElementById("tbar"), l = document.getElementById("tleft");
  if (b) b.style.width = clamp(T.t / T.dur * 100, 0, 100) + "%";
  if (l) l.textContent = Math.max(0, Math.ceil(T.dur - T.t)) + " с";
  if (UI.view === "map" && document.getElementById("world")){ if (UI.follow && !UI.drag){ const p = mePos(), z = UI.zoom; UI.cam.x += (p.x - 450 / z - UI.cam.x) * .08; UI.cam.y += (p.y - 264 / z - UI.cam.y) * .08; camClamp(); } placeMap(); }
}

/* ============ поведінка мобів ============ */
function tickMobs(dt){
  const t = performance.now();
  for (const [id, rt] of Object.entries(LR)){
    for (const m of rt.mobs){
      if (m.dead){ if (t > m.respawn){ Object.assign(m, spawnMob(id, m.type, m.lvl, {tier:tierOf(id)}), {uid:m.uid}); if (id === S.loc && UI.view === "loc" && !B) renderMobs(true); } continue; }
      if (m.busy) continue;
      if (m.wait > 0){ m.wait -= dt; continue; }
      const dx = m.tx - m.x, dy = m.ty - m.y, d = Math.hypot(dx, dy);
      if (d < 2){ m.wait = rnd(1, 4); const R = m.st.boss ? 50 : 110; let nx, ny, k = 0; const c = SCENE[id] || {};
        do { nx = clamp(m.hx + rnd(-R, R), 70, 850); ny = clamp(m.hy + rnd(-R * .7, R * .7), 140, 495); k++; } while (k < 8 && ((c.river && nx > 555 && nx < 725) || (c.lake && Math.hypot((nx - 540) / 320, (ny - 250) / 135) < 1.05) || (c.sea && nx + (ny - 230) > 800)));
        m.tx = nx; m.ty = ny; continue; }
      const step = Math.min(d, m.st.speed * dt); m.x += dx / d * step; m.y += dy / d * step; if (Math.abs(dx) > 1) m.flip = dx < 0;
    }
  }
  if (UI.view === "loc" && !B && !T) renderMobs(false);
  if (!B && !T && !DG && UI.view === "loc" && !modalOpen()){
    const rt = locRT(S.loc), pp = playerPos();
    if (rt.arrived && t - rt.arrived > 7000){
      for (const m of rt.mobs){ if (m.dead || m.busy || !m.st.aggro || m.distBoss) continue;
        if (Math.hypot(m.x - pp.x, m.y - pp.y) < 85 && Math.random() < .02){ msg(`${m.st.name} напав на вас!`, "warn"); startBattle([{type:m.type, lvl:m.lvl, elite:m.elite, tier:m.tier, uid:m.uid}], m, "loc", S.loc); rt.arrived = t + 20000; return; } }
    }
  }
}

/* ============ події ============ */
document.addEventListener("click", e => {
  if (!READY) return;
  const t = e.target.closest("button, [data-avail]"); if (!t || t.disabled) return;
  const d = t.dataset;
  if (d.menu){
    if (B && d.menu !== "Торба") return;
    switch (d.menu){
      case "Персонаж": UI.sockPick = null; openChar(); break;
      case "Торба": if (!B) openBag(); break;
      case "Вміння": openSkills(); break;
      case "Карта світу": if (DG) { msg("Спершу вийдіть з підземелля.", "warn"); break; } if (modalOpen()){ closeModal(); UI.view = "loc"; } UI.view = UI.view === "map" ? "loc" : "map"; if (UI.view === "map") camCenter(mePos()); render(); break;
      case "Квести": openJournal(); break;
      case "Ремесла": openCrafts(); break;
      case "Бестіарій": openCodex(); break;
      case "Налаштування": openSettings(); break;
      default: openInfo(d.menu, "Цей розділ з'явиться, коли гра стане мережевою: торгівля з іншими гравцями, клани й арена.");
    }
    return;
  }
  if (d.tab){ UI.tab = d.tab; renderChat(); return; }
  if (d.book){ if (B) return; UI.bsel = null; UI.sockPick = null; openBook(d.book); return; }
  if (d.bsel){ const tn = Date.now(); if (UI.lastSel === d.bsel && tn - UI.lastSelT < 420){ UI.lastSel = null; dblItem(d.bsel); return; } UI.lastSel = d.bsel; UI.lastSelT = tn; UI.bsel = d.bsel; UI.sockPick = null; openBook(); return; }
  if (d.bsort){ UI.bagSort = d.bsort; openBook("bag"); return; }
  if (d.branch){ if (S.branch && !t.dataset.sure){ t.dataset.sure = "1"; t.textContent = "Точно змінити?"; return; } chooseBranch(d.branch); openBook("skills"); return; }
  if (d.qsel){ UI.qsel = d.qsel; openBook("quests"); return; }
  if (d.qtrack){ S.track = S.track === d.qtrack ? null : d.qtrack; save(); openBook("quests"); renderTracker(); return; }
  if (d.qmap){ if (DG){ msg("Спершу вийдіть з підземелля.", "warn"); return; } closeModal(); UI.view = "map"; camCenter({x:NODES[d.qmap].x, y:NODES[d.qmap].y}); UI.follow = false; render(); return; }
  if (d.ctdone){ contractDone(d.ctdone); openBook("market"); return; }
  if (d.forge){ openForge(); return; }
  if (d.sharp){ sharpen(d.sharp); openForge(); return; }
  if (d.junk){ sellJunk(); openShop(d.junk); return; }
  if (d.drop){ if (!t.dataset.sure){ t.dataset.sure = "1"; t.textContent = "Точно викинути?"; return; } take(d.drop); msg(`Ви викинули: ${ITEMS[d.drop].name}.`); save(); openBook("bag"); return; }
  if (d.zoom){ zoomMap(+d.zoom); return; }
  if (d.node){ if (UI.dragMoved) return; if (T || DG) return; if (d.node === S.loc){ UI.view = "loc"; render(); } else startTravel(d.node); return; }
  if (d.go){ if (!T && !DG) startTravel(d.go); return; }
  if (d.mob){ UI.sel = d.mob; renderMobs(true); renderMobCard(); drawAllSprites(); return; }
  if (d.spot){ startGather(d.spot); return; }
  if (d.attack){ const m = locRT(S.loc).mobs.find(x => x.uid === d.attack); if (m && !m.dead && !m.busy){ msg(`Ви напали на ${m.st.name} [${m.lvl}].`); startBattle([{type:m.type, lvl:m.lvl, elite:m.elite, tier:m.tier, distBoss:m.distBoss, uid:m.uid}], m, "loc", S.loc); } return; }
  if (d.npc){ openNpc(d.npc); return; }
  if (d.cx){ UI.cxSel = d.cx; openCodex(); return; }
  if (d.door !== undefined){ chooseDoor(+d.door); return; }
  if (d.build){ const a = d.build;
    if (a.startsWith("npc:")) openNpc(a.slice(4)); else if (a.startsWith("dungeon:")) enterDungeon(a.slice(8));
    else if (a === "pets") openPets(); else if (a.startsWith("heal:")){ const st = stats(); S.hp = st.maxHp; S.en = st.maxEn; S.mp = maxMp(); healPets(); S.buffs = S.buffs.filter(x => x.n > 0); msg(a.slice(5), "good"); save(); render(); } else if (a === "rest") openNpc("myroslava");
    else if (a === "spring"){ const st = stats(); S.hp = st.maxHp; S.en = st.maxEn; msg("Мінеральна вода з джерела. Сили повністю відновилися.", "good"); save(); renderTop(); }
    else if (a === "board") openInfo("Дошка оголошень", "«Шукаю групу на Руїни Варти». «Під руїнами склепи, кажуть, там капітан». «Продам кольчугу, питати в Табір Найманців». «Хто бачив ватажка зграї, не ходіть у Вовчий Яр самі». «Майстер Тодор у Кабаллоні вчить ремесел задарма»."); else openInfo("Зачинено", "Ця будівля відкриється, коли гра стане мережевою.");
    return; }
  if (d.bact){ act(d.bact); return; }
  if (d.pet){ petAction(d.pet); return; }
  if (d.rpage){ UI.ringPage = (UI.ringPage || 0) + 1; const nk = 4 + (ownedWard(B && B.enemies[B.target]) ? 1 : 0) + ['w4','h4','m4'].filter(tal).length + skillsKnown().length; if (UI.ringPage >= Math.ceil(nk / 8)) UI.ringPage = 0; render(); return; }
  if (d.tgt){ if (B && B.phase === "choose"){ B.target = +d.tgt; renderBattle(); } return; }
  if (d.belt){ if (B){ if (B.phase === "choose") act("item", d.belt); } else { useItem(d.belt); if (modalOpen()) openBag(); } return; }
  if (d.beltslot !== undefined){ if (!B){ UI.bagTab = "use"; openBag(); } return; }
  if (d.use){ useItem(d.use); if (modalOpen() && $("#modal .kvw")) openBook(); return; }
  if (d.tobelt){ const i = S.belt.indexOf(null); S.belt[i >= 0 ? i : S.belt.length - 1] = d.tobelt; save(); renderBelt(); openBag(); return; }
  if (d.unbelt !== undefined){ S.belt[+d.unbelt] = null; save(); renderBelt(); openBag(); return; }
  if (d.equip){ equip(d.equip); UI.bsel = null; openBag(); return; }
  if (d.unequip){ unequip(d.unequip); UI.bsel = null; openChar(); return; }
  if (d.sockpick){ UI.sockPick = d.sockpick; openChar(); return; }
  if (d.insgem){ const [s, i] = UI.sockPick.split(":"); insertGem(s, +i, d.insgem); return; }
  if (d.unsock){ const [s, i] = d.unsock.split(":"); removeGem(s, +i); return; }
  if (d.bagtab){ UI.bagTab = d.bagtab; openBag(); return; }
  if (d.crafttab){ UI.craftTab = d.crafttab; openCrafts(); return; }
  if (d.craft){ doCraft(d.craft); return; }
  if (d.shop){ UI.shopTab = "buy"; openShop(d.shop); return; }
  if (d.shoptab){ UI.shopTab = d.shoptab; openShop(d.shopid); return; }
  if (d.buy){ const it = ITEMS[d.buy], pr = buyPrice(d.buy); if (S.cop < pr) return; spend("shop", pr); give(d.buy, 1, true); msg(`Ви купили: ${it.name} за ${moneyTxt(pr)}.`); save(); openShop(d.shopid); renderTop(); renderBelt(); return; }
  if (d.sell || d.sellall){ const id = d.sell || d.sellall, it = ITEMS[id], n = d.sellall ? inv(id) : 1, p = sellPrice(id) * n;
    if (S.opt.confirmRare && rarity(it) >= 2 && !t.dataset.sure){ t.dataset.sure = "1"; t.textContent = "Точно продати?"; return; }
    take(id, n); earn("sale", p); msg(`Ви продали: ${it.name}${n > 1 ? " ×" + n : ""} за ${moneyTxt(p)}.`); save(); openShop(d.shopid); renderTop(); renderBelt(); return; }
  if (d.oath){ takeOath(d.oath); return; }
  if (d.renounce !== undefined){ if (!t.dataset.sure){ t.dataset.sure = "1"; t.textContent = "Точно зректися присяги?"; return; } renounceOrder(); return; }
  if (d.qtake){ takeQuest(d.qtake); return; }
  if (d.qdone){ doneQuest(d.qdone, d.choice !== undefined ? +d.choice : undefined); return; }
  switch (d.act){
    case "close": closeModal(); render(); break;
    case "unsel": UI.sel = null; renderMobs(true); renderMobCard(); drawAllSprites(); break;
    case "map": if (DG){ msg("Спершу вийдіть з підземелля.", "warn"); break; } UI.view = "map"; camCenter(mePos()); render(); break;
    case "toLoc": UI.view = "loc"; render(); break;
    case "mecenter": camCenter(mePos()); UI.follow = true; placeMap(); break;
    case "turnback": turnBack(); break;
    case "sumok": closeModal(); finishBattle(); break;
    case "chest": openChest(); break;
    case "pray": pray(); break;
    case "leaveDg": leaveDungeon(); break;
    case "heal": { const st = stats(), ph = Object.keys(S.pets || {}).reduce((a, k) => a + Math.max(0, petStats(k).maxHp - S.pets[k].hp), 0), c = Math.max(5, Math.round((st.maxHp - S.hp + ph) * .3)); if (S.cop < c){ msg("Не вистачає грошей на лікування.", "warn"); break; } spend("heal", c); S.hp = st.maxHp; S.en = st.maxEn; S.mp = maxMp(); healPets(); msg("Рани перев'язано. Ви повністю здорові.", "good"); save(); openNpc(d.npcid || "healer"); renderTop(); break; }
    case "rest": { if (S.cop < 5){ msg("Не вистачає грошей.", "warn"); break; } const st = stats(); spend("heal", 5); S.hp = st.maxHp; S.en = st.maxEn; msg("Ви відпочили в таверні. Сили повернулися.", "good"); save(); openNpc("myroslava"); renderTop(); break; }
    case "reset": if (t.dataset.sure){ const nm = S.name, cr = S.crest; S = fresh(); S.name = nm; S.crest = cr; save(); for (const k in LR) delete LR[k]; T = null; B = null; DG = null; MSG.length = 0; UI.cam = null; UI.view = "loc"; closeModal(); intro(); render(); } else { t.dataset.sure = "1"; t.textContent = "Точно? Натисніть ще раз"; } break;
    case "logout": logout(); break;
  }
});
document.addEventListener("change", e => { const t = e.target; if (t.dataset && t.dataset.avail){ UI.onlyAvail = t.checked; openShop(t.dataset.avail); }
  if (t.dataset && t.dataset.opt){ S.opt[t.dataset.opt] = t.checked; applyOpts(); save(); } });
function applyOpts(){}
$("#modal").addEventListener("click", e => { if (e.target.id === "modal" && !modalLocked){ closeModal(); render(); } });
document.addEventListener("keydown", e => {
  if (!READY || e.target.tagName === "INPUT") return;
  if (e.key === "Escape" && modalOpen() && !modalLocked){ closeModal(); render(); }
  else if (!B){ const k = e.key.toLowerCase();
    const HK = {c:"hero", "с":"hero", b:"bag", "и":"bag", k:"skills", "л":"skills", q:"quests", "й":"quests", r:"craft", "к":"craft", x:"codex", "ч":"codex", t:"market", "е":"market", a:"ach", "ф":"ach"};
    const same = HK[k] && modalOpen() && $("#modal .kvw") && (UI.book === HK[k] || (["hero","bag"].includes(UI.book) && ["hero","bag"].includes(HK[k])));
    if (HK[k]){ if (same){ closeModal(); render(); } else if (!modalOpen() || $("#modal .kvw")){ UI.bsel = null; UI.sockPick = null; openBook(HK[k]); } }
    else if ((k === "m" || k === "ь") && !DG && (!modalOpen() || $("#modal .kvw"))){ if (modalOpen()){ closeModal(); UI.view = "loc"; } UI.view = UI.view === "map" ? "loc" : "map"; if (UI.view === "map") camCenter(mePos()); render(); } }
});
// перетягування карти
document.addEventListener("pointerdown", e => {
  const w = e.target.closest("#mapwrap"); if (!w || e.target.closest(".card, .mapctl, .legend, .toloc, .travel")) return;
  UI.drag = {x:e.clientX, y:e.clientY, cx:UI.cam.x, cy:UI.cam.y}; UI.dragMoved = false;
});
document.addEventListener("pointermove", e => {
  if (!UI.drag) return; const sc = $("#game").getBoundingClientRect().width / 1280;
  const dx = (e.clientX - UI.drag.x) / sc, dy = (e.clientY - UI.drag.y) / sc;
  if (Math.abs(dx) + Math.abs(dy) > 4){ UI.dragMoved = true; UI.follow = false; }
  UI.cam.x = UI.drag.cx - dx / UI.zoom; UI.cam.y = UI.drag.cy - dy / UI.zoom; camClamp(); placeMap();
});
document.addEventListener("pointerup", () => { if (UI.drag){ UI.drag = null; setTimeout(() => { UI.dragMoved = false; }, 0); } });
document.addEventListener("wheel", e => { const w = e.target.closest("#mapwrap"); if (!w) return; e.preventDefault(); const r = w.getBoundingClientRect(), sc = r.width / 900; zoomMap(e.deltaY < 0 ? 1 : -1, (e.clientX - r.left) / sc, (e.clientY - r.top) / sc); }, {passive:false});
$("#cform").addEventListener("submit", e => {
  e.preventDefault(); const v = $("#cinp").value.trim(); if (!v) return; $("#cinp").value = "";
  const ch = UI.tab === "Торгівля" ? "trade" : "loc"; msg(`${esc(S.name)}: ${esc(v)}`, ch === "trade" ? "trade" : "", ch);
  if (Math.random() < .5) setTimeout(() => { const res = locRT(S.loc).residents; const who = res.length ? pick(res)[0] : pick(NAMES); msg(`${who}: ${pick(["ага","та ну","і тобі привіт","хто в групу?","я з тобою","не зараз, б'юся","часник маєш?","продам самоцвіт, пиши"])}`, ch === "trade" ? "trade" : "", ch); }, rnd(1500, 4000));
});

/* ============ цикл ============ */
const NAMES = ["Ольха","Гром_з_Ужа","Krivyi_Nis","Тиха_Верба","Bohdan_UA","Сокіл","Лісовик77","Мавка_з_Синевиру","Чорт_з_Табору","Яринка","Kozak_Mamai","Вітрогон","Сова","Чугайстер_UA","Opryshok","Лицар_Кабаллону","Sagin_Mage"];
const TRADE = ["продам ікла вовка, по 3 срібла","куплю кольчугу, недорого","міняю шкури на зілля","хто йде в Склепи Варти? шукаю групу","продам Сокиру найманця, пишіть","куплю рубін-уламок","продам руту пучками","віддам жаб'ячий слиз за безцінь","продам осикові кілки, на упирів саме те","хто на Синевир? беру в групу","куплю Древнє ікло","продаю ярмаркові шкатулки"];
const AMB = {
  forge:["У кузні щось брязкає в темряві."], ford:["Річка шумить на каменях броду."], ruins:["Між мурами шелестить сухий вітер.","З-під землі чути, як хтось ходить склепами."],
  ravine:["Виття зграї відбивається від схилів."], swamp:["Хтось шепоче ваше ім'я з туману."], chapel:["Дзвін каплиці б'є, хоча дзвонаря нема."],
  pass:["Вітер свище між скелями."], mill:["Колесо млина рипить, хоч вода стоїть."], sparkford:["Над водою спалахують іскри."], bay:["Хвилі б'ють у розбитий човен."],
  uzh:["Над Ужем стелиться туман."], muk:["Над Паланком кружляють кажани."], mizh:["Чорна вода Синевиру не дає відображення."], rah:["З Чорногори десь далеко сходить лавина."], hust:["З болота підіймаються зелені вогники."],
};
let last = performance.now(), acc = 0, ambT = 15, tradeT = 8, sprT = 0;
function loop(){
  const t = performance.now(), dt = Math.min(.25, (t - last) / 1000); last = t;
  game.t += dt;
  tickTravel(dt); tickMobs(dt); tickBattle(dt); tickGather(dt);
  sprT += dt; if (sprT > 1 / 30){ sprT = 0; drawAllSprites(); }
  acc += dt;
  if (acc >= 1){ acc = 0;
    if (!B){ const st = stats(), oh = S.hp, oe = S.en; S.hp = Math.min(st.maxHp, S.hp + st.maxHp * .012); S.en = Math.min(st.maxEn, S.en + st.maxEn * .02); const mm = maxMp(); if (mm) S.mp = Math.min(mm, (S.mp || 0) + mm * .02); for (const k of Object.keys(S.pets || {})){ const o = S.pets[k]; if (o.hp > 0){ const ph = petStats(k).maxHp; o.hp = Math.min(ph, o.hp + ph * .012); } } if (oh !== S.hp || oe !== S.en) renderTop(); }
    const c = document.getElementById("clock"); if (c) c.textContent = now();
    tickSpots();
    tradeT -= 1; if (tradeT <= 0){ tradeT = rnd(18, 35); msg(`${pick(NAMES)}: ${pick(TRADE)}`, "trade", "trade"); }
    ambT -= 1; if (ambT <= 0){ ambT = rnd(25, 50); if (!T && !B && !DG && AMB[S.loc]) msg(pick(AMB[S.loc])); }
    if (READY && !document.hidden) S.econ.sec++;
    if (Math.floor(game.t) % 5 === 0) checkAch();
    if (Math.random() < .1) save();
  }
  requestAnimationFrame(loop);
}
function fit(){ const g = $("#game"), s = Math.min(innerWidth / 1280, innerHeight / 800); g.style.transform = `scale(${s})`; g.style.left = (innerWidth - 1280 * s) / 2 + "px"; g.style.top = (innerHeight - 800 * s) / 2 + "px"; }
addEventListener("resize", fit);
function intro(){
  msg("Ласкаво просимо до Попелястого Шпиля.", "good");
  if (!Object.keys(S.quests).length) msg("Зброяр Остап шукає помічника: знайдіть його в місті (знак «!»).", "quest");
  msg("Торба на поясі зліва (клавіша B), карта світу (M). Світ великий: на заході Землі Кабаллону, на сході Закарпаття.");
  if (!S.intro && S.lvl > 1){ msg("Світ оновився: тепер максимальний рівень 10, а далі сила йде від спорядження, самоцвітів, ремесел, підземель і зачисток районів.", "quest"); }
  if (!S.v4intro){ msg("Оновлення: вікно Персонажа разом з торбою (перетягуйте речі просто на героя, а зілля на пояс), гілка розвитку з 3 рівня, 5 нових слотів спорядження, заточка в кузні, комплекти й щоденні контракти гільдій.", "quest"); msg("Нечисть стала міцнішою з рівнем. Купіть у зброярів плащ, пояс, наголінники, рукавиці й щит.", "warn"); S.v4intro = true; }
  if (!S.v5intro){ msg("Нові краї: Кістяна Марка на схід від Чорногори (7–9), Чорна Трясовина на південь від Попелястих земель (8–10) і Землі Світанку й Ночі на південь від Закарпаття (9–10). П'ять нових підземель, два ордени й понад 40 квестів. З 7 рівня шлях покажуть опришок Дмитро в Рахові, капітан Ярема в Таборі найманців і сотник Іван у Хусті.", "quest"); S.v5intro = true; }
  S.intro = true;
}
function startGame(){
  S.hp = Math.min(S.hp, stats().maxHp); S.en = Math.min(S.en, stats().maxEn);
  READY = true; applyOpts(); intro(); locRT(S.loc).arrived = performance.now(); checkDistrictBoss(S.loc); render(); save(); requestAnimationFrame(loop); setTimeout(prebakeMap, 1200);
}
fit();
