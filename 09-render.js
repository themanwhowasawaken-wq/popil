/* ============ спрайти ============ */
function sprite(type, cssW, cssH, sc, flip, extra = ""){
  return `<canvas class="spr" width="${cssW*2}" height="${cssH*2}" style="width:${cssW}px;height:${cssH}px" data-spr="${type}" data-sc="${sc*2}" data-flip="${flip ? 1 : 0}" data-seed="${Math.round(Math.random()*500)}" ${extra}></canvas>`;
}
function drawSprite(cv){
  const Dd = designOf(cv.dataset.spr); if (!Dd) return;
  const c = cv.getContext("2d"); c.setTransform(1,0,0,1,0,0); c.clearRect(0, 0, cv.width, cv.height);
  ctx = c; const sc = +cv.dataset.sc * (+cv.dataset.mul || 1), sz = Dd.design.size || 1;
  c.translate(cv.width / 2, cv.height * .58); c.scale(cv.dataset.flip === "1" ? -sc : sc, sc);
  const e = {def:Dd, w:Math.round(22 * sz), h:Math.round(26 * sz), vx:cv.dataset.mv === "1" ? 40 : 0, x:+cv.dataset.seed, wind:cv.dataset.atk === "1" ? .45 : 0, glow:game.t * 2 + +cv.dataset.seed, face:1};
  try { drawDemonBody(e); } catch (er) {}
}
function drawAllSprites(){ for (const cv of document.querySelectorAll("canvas.spr")) drawSprite(cv); }
function discover(type){ if (!S.codex[type]){ S.codex[type] = true; msg(`Бестіарій поповнився: ${mobDef(type).name}.`, "good"); } }

/* ============ рантайм локацій ============ */
const tierOf = id => 1 + Math.min(6, S.clears[id] || 0);
function locRT(id){
  if (LR[id]) return LR[id];
  const rt = {mobs:[], residents:[], spots:[], uid:0}, L = LOCS[id], N = NODES[id], tier = tierOf(id);
  LR[id] = rt;
  const add = (type, lvl, o = {}) => rt.mobs.push(spawnMob(id, type, lvl, Object.assign({tier}, o)));
  for (const [type, n, lvl] of L.mobs){ if (S.order && mobDef(type).side === S.order) continue; for (let i = 0; i < n; i++) add(type, lvl); }
  if (L.demons){
    const pool = BESTIARY.filter(d => d.reg.includes(N.reg)), weak = pool.filter(d => d.tier < 3), strong = pool.filter(d => d.tier >= 3);
    for (let i = 0; i < 6; i++){
      const d = (i === 0 && strong.length) ? pick(strong) : pick(weak.length ? weak : pool);
      const lv = Math.min(10, N.L + (d.tier >= 3 ? 1 : d.tier - 1));
      add(d.id, lv);
      if (d.arch === "swarmer" && i < 5){ add(d.id, lv); i++; }
    }
  }
  // ресурси
  for (const [type, tmax] of Object.entries(L.res)){
    for (let i = 0; i < 2; i++){ const t = Math.max(1, tmax - (i === 0 ? 0 : ri(0, Math.min(2, tmax - 1)))); rt.spots.push(spawnSpot(id, type, t, rt.spots)); }
  }
  const k = isSafe(id) ? ri(2,5) : ri(0,2), names = [...NAMES].sort(() => Math.random() - .5);
  const lvGuess = N.L || parseInt(N.lv) || ri(2, 8);
  for (let i = 0; i < k; i++) rt.residents.push([names[i], clamp(lvGuess + ri(-1, 2), 1, MAXLVL)]);
  return rt;
}
function freeSpot(locId, others, minD = 100){
  const L = LOCS[locId], c = SCENE[locId] || {}, avoid = L.npcs.map(n => [n[1], n[2]]).concat(others.map(o => [o.x, o.y]));
  let x, y, tries = 0;
  do { x = rnd(240, 830); y = rnd(150, 480); tries++; }
  while (tries < 40 && (avoid.some(([ax, ay]) => Math.hypot(ax - x, ay - y) < minD) || (c.river && x > 545 && x < 735) || (c.lake && Math.hypot((x - 540) / 320, (y - 250) / 135) < 1.05) || (c.sea && x + (y - 230) > 790)));
  return [x, y];
}
function spawnMob(locId, type, lvl, o = {}){
  const rt = LR[locId] || {mobs:[], spots:[]};
  const [x, y] = freeSpot(locId, rt.spots || [], 70);
  const elite = !o.distBoss && !mobDef(type).boss && Math.random() < .08;
  const st = mobStats(type, lvl, {tier:o.tier, elite, distBoss:o.distBoss});
  return {uid:locId + "-" + (rt.uid = (rt.uid || 0) + 1) + "-" + Math.floor(Math.random() * 1e4), type, lvl, elite, distBoss:!!o.distBoss, tier:o.tier || 1, st, x, y, hx:x, hy:y, tx:x, ty:y, wait:rnd(0,3), dead:false, busy:false, respawn:0, flip:false};
}
function spawnSpot(locId, type, t, others){
  const [x, y] = freeSpot(locId, others, 90);
  return {id:locId + "-" + type + "-" + Math.floor(Math.random() * 1e5), type, t, x, y, ready:true, respawn:0};
}
function districtBossType(id){
  const L = LOCS[id], N = NODES[id];
  if (Array.isArray(L.boss)) return L.boss;
  if (L.boss === "auto"){ const pool = BESTIARY.filter(d => d.reg.includes(N.reg)); const top = Math.max(...pool.map(d => d.tier)); return [pick(pool.filter(d => d.tier === top)).id, Math.min(10, N.L + 1)]; }
  return null;
}
function checkDistrictBoss(id){
  const L = LOCS[id]; if (!L.boss) return;
  const rt = locRT(id); if (rt.mobs.some(m => m.distBoss && !m.dead)) return;
  if ((S.kc[id] || 0) >= 8){
    const [type, lvl] = districtBossType(id);
    const m = spawnMob(id, type, lvl, {tier:tierOf(id), distBoss:true}); m.wait = 2; rt.mobs.push(m);
    msg(`На ${NODES[id].name} з'явився ${m.st.name}! Переможи його, щоб зачистити район.`, "quest");
    if (S.loc === id && UI.view === "loc" && !B) renderMobs(true);
  }
}
function playerPos(){
  if (S.prev && NODES[S.prev] && roadOf(S.loc, S.prev)){ const ang = dirTo(S.loc, S.prev);
    return {x: clamp(450 + Math.cos(ang) * 260, 200, 700), y: clamp(300 + Math.sin(ang) * 150, 150, 440)}; }
  return {x:200, y:330};
}

/* ============ верхня панель, пояс, чат ============ */

function renderTop(){
  const st = stats();
  const bar = (v, max, cls, lbl) => `<div class="bar ${cls}"><div class="tr"><div class="fl" style="width:${clamp(v / max * 100, 0, 100)}%"></div></div><span>${lbl}</span></div>`;
  const xpLbl = S.lvl >= MAXLVL ? "макс. рівень" : `досвід ${S.xp} / ${need(S.lvl)}`;
  $("#top").innerHTML = `<div class="who"><div class="portrait-ring"><div class="avatar" style="${crestBg(S.crest)}">${esc(S.name[0])}</div><span class="lvgem" title="Рівень">${S.lvl}</span></div><div class="bars">
    <div class="nm"><b>${esc(S.name)}</b>${S.buffs.length ? `<span class="buffs" title="${S.buffs.map(b => ITEMS[b.id].name + ": ще " + b.n + " бої").join(", ")}">${svg("elixir", 14)} ${S.buffs.length}</span>` : ""}</div>
    ${bar(S.hp, st.maxHp, "hp", Math.ceil(S.hp) + " / " + st.maxHp)}${bar(S.en, st.maxEn, "en", Math.floor(S.en) + " / " + st.maxEn)}${bar(S.lvl >= MAXLVL ? 1 : S.xp, S.lvl >= MAXLVL ? 1 : need(S.lvl), "xp", xpLbl)}</div></div>
    <nav class="menu2" aria-label="Головне меню">${BOOK.map(([id, l, ic, key], i) => { const on = id === "map" ? UI.view === "map" : modalOpen() && $("#modal .kvw") && (UI.book === id || (id === "hero" && UI.book === "bag") || (id === "codex" && UI.book === "zcodex")), b = bookBadge(id);
      return `${i === 3 || i === 7 ? `<span class="msep" aria-hidden="true"></span>` : ""}<button class="rb${on ? " on" : ""}" ${id === "map" ? `data-menu="Карта світу"` : `data-book="${id}"`} aria-label="${l}" title="${l}${key ? " (" + key + ")" : ""}" ${B ? "disabled" : ""}><span class="rr">${gi(ic, 22)}${b ? `<i class="bdg">${b}</i>` : ""}</span><span class="rl">${l}</span></button>`; }).join("")}</nav>
    <div class="money">${money(S.cop)}<span class="clock" id="clock">${now()}</span></div>`;
}
function beltSlot(i){
  const id = S.belt[i], it = id && ITEMS[id], n = id ? inv(id) : 0;
  if (!it) return `<button class="slot empty" data-beltslot="${i}" aria-label="Порожня комірка пояса" title="Порожньо: додайте зілля чи сувій з торби"></button>`;
  const icon = gi(itemIc(id), 28, it.use && it.use.en && !it.use.hp ? "#6f9bd1" : it.scroll ? "#e2c88a" : it.buff ? "#9fd08f" : it.open ? "#e0b25a" : "#e0675a");
  return `<button class="slot" data-belt="${id}" aria-label="${it.name}, ${n} шт." title="${it.name}${n ? "" : " (закінчилось)"}" ${n ? "" : "disabled"}>${icon}${n ? `<span class="n">${n}</span>` : ""}</button>`;
}
function renderBelt(){
  const used = Object.keys(S.inv).length;
  $("#belt").innerHTML = `<span class="cap">ПОЯС</span>${beltSlot(0)}${beltSlot(1)}${beltSlot(2)}
    <button class="bagbtn" data-book="bag" aria-label="Торба" title="Торба (B)" ${B ? "disabled" : ""}>${gi("knapsack", 28)}<span class="pg">${used}</span></button>
    ${beltSlot(3)}${beltSlot(4)}${beltSlot(5)}`;
}
function renderChat(){
  $("#tabs").innerHTML = Object.keys(TABCH).map(t => `<button class="tab${UI.tab === t ? " on" : ""}" role="tab" aria-selected="${UI.tab === t}" data-tab="${t}">${t}</button>`).join("");
  const chs = TABCH[UI.tab], rows = MSG.filter(m => chs.includes(m.ch));
  let h = rows.slice(-70).map(m => `<div class="cl ${m.kind}"><span class="t">${m.t}</span><span class="m">${m.text}</span></div>`).join("");
  if (!rows.length) h = `<div class="cl"><span class="m" style="color:var(--muted)">${UI.tab === "Група" ? "Ви не в групі." : UI.tab === "Клан" ? "Ви не в клані." : "Поки тихо."}</span></div>`;
  const el = $("#clog"); el.innerHTML = h; el.scrollTop = el.scrollHeight;
  const res = T || DG ? [] : locRT(S.loc).residents;
  $("#rlist").innerHTML = `<div class="rr"><b>${esc(S.name)}</b><span>[${S.lvl}]</span></div>` + res.map(([n, l]) => `<div class="rr">${n}<span>[${l}]</span></div>`).join("");
  $("#rcount").textContent = T ? "у дорозі" : DG ? "у підземеллі" : "тут: " + (res.length + 1);
  $("#cinp").placeholder = UI.tab === "Торгівля" ? "Написати в торгівлю" : "Написати в локацію";
}

/* ============ карта світу (прокрутка й масштаб) ============ */
function questMarks(locId){ let m = ""; for (const [npc] of LOCS[locId].npcs){ const k = npcMark(npc); if (k === "?") return "?"; if (k === "!") m = "!"; } return m; }
function legPos(a, b, t){ const rd = roadOf(a, b), A = NODES[a], Bn = NODES[b], u = 1 - t; return {x:u*u*A.x + 2*u*t*rd.cx + t*t*Bn.x, y:u*u*A.y + 2*u*t*rd.cy + t*t*Bn.y}; }
function mePos(){ if (!T) return {x:NODES[S.loc].x, y:NODES[S.loc].y}; const leg = T.legs[T.i]; return legPos(leg[0], leg[1], clamp(T.t / T.dur, 0, 1)); }
function camClamp(){ const z = UI.zoom; UI.cam.x = clamp(UI.cam.x, 0, Math.max(0, WORLD.w - 900 / z)); UI.cam.y = clamp(UI.cam.y, 0, Math.max(0, WORLD.h - 528 / z)); }
function camCenter(p){ UI.cam = {x:p.x - 450 / UI.zoom, y:p.y - 264 / UI.zoom}; camClamp(); }
function renderMap(){
  const v = $("#view"), pos = mePos();
  if (!UI.cam) camCenter(pos);
  let nodes = "";
  for (const [id, n] of Object.entries(NODES)){
    const q = questMarks(id), cl = S.clears[id] || 0, here = !T && S.loc === id;
    const dg = LOCS[id].buildings.find(b => b[1].startsWith("dungeon:"));
    nodes += `<button class="node k-${n.kind}${here ? " here" : ""}${n.x > WORLD.w - 260 ? " east" : ""}" data-node="${id}" data-x="${n.x}" data-y="${n.y}" aria-label="${n.name}, ${n.lv}">
      <span class="dot">${q ? `<span class="badge">${q}</span>` : ""}${dg ? `<span class="dg" title="Підземелля">${svg("door", 10, "#fff", 2.2)}</span>` : ""}</span>
      <span class="lb">${n.name}${n.kind === "hunt" || n.kind === "danger" ? ` <i>${n.lv}</i>` : ""}${cl ? ` <i class="clr" title="Зачищено разів: ${cl}">×${cl}</i>` : ""}</span></button>`;
  }
  let travel = "";
  if (T){
    const leg = T.legs[T.i], rd = roadOf(leg[0], leg[1]);
    travel = `<div class="card travel">
      <div class="tr-h"><b>Подорож</b><span class="hint" id="tleft"></span></div>
      <div class="tr-r">${NODES[leg[0]].name} → <b>${NODES[leg[1]].name}</b>${rd.name ? `<br><span class="hint">${rd.name}</span>` : ""}${T.legs.length > 1 ? `<br><span class="hint">Далі: ${T.legs.slice(T.i + 1).map(l => NODES[l[1]].name).join(" → ")}</span>` : ""}</div>
      <div class="ptr"><div id="tbar" style="width:0%"></div></div>
      <div class="hint${rd.danger ? " warn" : ""}">${rd.danger ? "Небезпечна дорога: можлива засідка." : "Дорога безпечна."}</div>
      <button class="btn sm" data-act="turnback">Повернути назад</button></div>`;
  }
  v.innerHTML = `<div class="mapwrap" id="mapwrap"><div id="world" style="width:${WORLD.w}px;height:${WORLD.h}px">${mapLayer()}${mapFX()}</div><div id="mapov">${nodes}<div class="me" id="me"><i></i><b>Ви</b></div></div>
    ${travel}
    <div class="mapctl"><button class="ib sm" data-zoom="1" aria-label="Наблизити">+</button><button class="ib sm" data-zoom="-1" aria-label="Віддалити">−</button><button class="ib sm" data-act="mecenter" aria-label="До мене" title="До мене">${svg("hero", 16)}</button></div>
    ${T ? "" : `<div class="legend"><div><span class="ln safe"></span>безпечна дорога</div><div><span class="ln danger"></span>небезпечна, засідки</div><div><span class="badge inl">!</span> квест <span class="badge inl">?</span> здати <span class="dgi">${svg("door", 10, "#fff", 2.2)}</span> підземелля</div></div>`}
    ${!T ? `<button class="btn dk toloc" data-act="toLoc">До локації: ${NODES[S.loc].name}</button>` : ""}</div>`;
  placeMap();
  // панель
  const near = T ? [] : neighbors(S.loc), curR = NODES[T ? T.legs[T.i][1] : S.loc].r;
  const row = id => { const rd = !T && roadOf(S.loc, id), q = questMarks(id), n = NODES[id];
    return `<button class="row" data-node="${id}" title="${n.name}"><span class="qm${q ? "" : " no"}">${q}</span><span class="g">${n.name}</span><span class="r${n.kind === "danger" || (rd && rd.danger) ? " d" : ""}">${rd ? rd.dur + " с" : n.lv}</span></button>`; };
  const regs = [curR, ...Object.keys(REGIONS).filter(r => r !== curR)];
  $("#panel").innerHTML = `<h2 class="ph">Карта світу</h2><div class="hint">${T ? "Ви в дорозі." : "Тягніть карту мишкою. Натисніть на місце, щоб піти туди: маршрут прокладеться сам."}</div>
    ${near.length ? `<div class="sub">Поруч</div><div>${near.map(row).join("")}</div>` : ""}
    ${regs.map(r => `<div class="sub">${REGIONS[r]}</div><div>${Object.keys(NODES).filter(id => NODES[id].r === r && !near.includes(id)).map(row).join("")}</div>`).join("")}`;
  updateTravelUI();
}
function placeMap(){
  const w = document.getElementById("world"); if (!w) return;
  const z = UI.zoom, cx = UI.cam.x, cy = UI.cam.y;
  w.style.transform = `translate(${-cx * z}px,${-cy * z}px) scale(${z})`;
  const small = z < .7;
  for (const el of document.querySelectorAll("#mapov .node")){
    const x = (+el.dataset.x - cx) * z, y = (+el.dataset.y - cy) * z;
    const vis = x > -200 && x < 1100 && y > -40 && y < 570;
    el.style.display = vis ? "" : "none"; el.style.left = x + "px"; el.style.top = y + "px";
    el.classList.toggle("small", small && !el.classList.contains("k-city") && !el.classList.contains("here"));
  }
  const me = document.getElementById("me"); if (me){ const p = mePos(); me.style.left = (p.x - cx) * z + "px"; me.style.top = (p.y - cy) * z + "px"; }
}
function zoomMap(dir, ax = 450, ay = 264){
  const zs = [.4, .6, .8, 1, 1.2], i = clamp(zs.indexOf(UI.zoom) + dir, 0, zs.length - 1); if (zs.indexOf(UI.zoom) < 0){ UI.zoom = .8; return placeMap(); }
  const wx = UI.cam.x + ax / UI.zoom, wy = UI.cam.y + ay / UI.zoom; UI.zoom = zs[i]; UI.cam.x = wx - ax / UI.zoom; UI.cam.y = wy - ay / UI.zoom; camClamp(); placeMap();
}

/* ============ локація ============ */
function renderLoc(){
  const id = S.loc, L = LOCS[id], rt = locRT(id), n = NODES[id];
  const v = $("#view"), alive = rt.mobs.filter(m => !m.dead && !m.busy).length;
  let h = sceneImg(id);
  const tierTxt = (S.clears[id] ? ` · зачищено ×${S.clears[id]}` : "") + (L.boss ? ` · до отамана: ${Math.max(0, 8 - (S.kc[id] || 0))}` : "");
  h += `<div class="title-plate"><b>${n.name}</b><span>${n.kind === "city" || n.kind === "town" ? "Безпечне місце" : "Рівень " + n.lv}${rt.mobs.length ? " · мобів: " + alive : ""}${tierTxt}</span></div>`;
  for (const sp of rt.spots){ if (!sp.ready) continue; const P = PROFS[sp.type], ok = S.prof[sp.type].lv >= TIER_LV[sp.t];
    h += `<button class="spot sp-${sp.type}${ok ? "" : " low"}" data-spot="${sp.id}" style="left:${sp.x}px;top:${sp.y}px" title="${resName(sp.type, sp.t)}${ok ? "" : ` (потрібен ${P.name.toLowerCase()} ${TIER_LV[sp.t]} рівня)`}" aria-label="${resName(sp.type, sp.t)}">${svg(P.icon, 18, "#fff", 2)}<span class="pips">${"·".repeat(sp.t)}</span>${UI.gathering && UI.gathering.spot === sp.id ? `<span class="gbar"><i id="gbar"></i></span>` : ""}</button>`; }
  for (const [npc, x, y] of L.npcs){ const N = NPCS[npc], mk = npcMark(npc);
    h += `<button class="npc" data-npc="${npc}" style="left:${x}px;top:${y}px" aria-label="${N.name}"><span class="c">${N.letter}${mk ? `<span class="badge">${mk}</span>` : ""}</span><span class="n">${N.name}</span></button>`; }
  const pp = playerPos();
  h += `<div class="npc me-tok" style="left:${pp.x}px;top:${pp.y}px"><span class="c">${esc(S.name[0])}</span><span class="n">Ви</span></div><div id="mobs"></div>`;
  for (const nb of neighbors(id)){
    const b = NODES[nb], ang = dirTo(id, nb), rd = roadOf(id, nb);
    const ex = 450 + Math.cos(ang) * 400, ey = 290 + Math.sin(ang) * 210, left = Math.cos(ang) < -.35, right = Math.cos(ang) > .35;
    const style = left ? `left:10px;top:${clamp(ey - 17, 70, 474)}px` : right ? `right:10px;top:${clamp(ey - 17, 70, 474)}px` : `left:${clamp(ex - 90, 20, 690)}px;top:${Math.sin(ang) < 0 ? 72 : 478}px`;
    h += `<button class="exit${rd.danger ? " d" : ""}" data-go="${nb}" style="${style}" title="${b.name}${rd.name ? " (" + rd.name + ")" : ""}">${left ? "← " : ""}${b.name}${left ? "" : " →"}</button>`;
  }
  if (T) h += `<div class="dim"><div class="card dimcard"><b>Ви в дорозі</b><span>${NODES[T.legs[T.i][0]].name} → ${NODES[T.legs[T.i][1]].name}</span></div></div>`;
  h += `<div id="mobcard"></div>`;
  v.innerHTML = h;
  renderMobs(true); renderMobCard();
  // панель
  const groups = {};
  for (const m of rt.mobs) if (!m.dead && !m.busy){ const k = m.st.name + "|" + m.lvl; groups[k] = (groups[k] || 0) + 1; }
  const timer = T ? `<div class="trbox"><div><span>Перехід до ${NODES[T.legs[T.i][1]].name}</span><b id="tleft"></b></div><div class="ptr"><div id="tbar" style="width:0%"></div></div></div>` : "";
  const resTxt = Object.entries(L.res).map(([k, t]) => `${PROFS[k].name.toLowerCase()} (до ${t} тіру)`).join(", ");
  $("#panel").innerHTML = `<h2 class="ph">${n.name}</h2><div class="hint it">${L.desc}</div>${regRuleHTML(id)}${timer}
    <div class="sub">Переходи</div><div>${neighbors(id).map(nb => { const rd = roadOf(id, nb), q = questMarks(nb); return `<button class="row" data-go="${nb}" ${T ? "disabled" : ""} title="${NODES[nb].name}"><span class="qm${q ? "" : " no"}">${q}</span><span class="g">${NODES[nb].name}</span><span class="r${rd.danger ? " d" : ""}">${rd.dur} с</span></button>`; }).join("")}
      <button class="row" data-act="map"><span class="qm no">${svg("map", 14)}</span><span class="g">Відкрити карту світу</span></button>${inZak() ? `<button class="row" data-book="zcodex"><span class="qm no">${gi("crowned-skull", 14, "#8a7a60")}</span><span class="g">Бестіарій Закарпаття</span></button>` : ""}</div>
    ${L.buildings.length ? `<div class="sub">Будівлі</div><div>${L.buildings.map(([nm, act]) => { const mk = act.startsWith("npc:") ? npcMark(act.slice(4)) : ""; const isD = act.startsWith("dungeon:"); return `<button class="row" data-build="${act}" ${T ? "disabled" : ""}><span class="qm${mk ? "" : " no"}">${mk || (isD ? svg("door", 13) : "")}</span><span class="g">${nm}</span>${isD ? `<span class="r d">рів. ${DUNGEONS[act.slice(8)].lvl}</span>` : ""}</button>`; }).join("")}</div>` : ""}
    ${resTxt ? `<div class="sub">Ремесла</div><div class="hint">Тут можна збирати: ${resTxt}.</div>` : ""}
    ${rt.mobs.length || L.boss ? `<div class="sub">Моби тут</div><div>${Object.entries(groups).map(([k, c]) => { const [nm, lv] = k.split("|"); return `<div class="row"><span class="qm no"></span><span class="g">${nm}${c > 1 ? " ×" + c : ""}</span><span class="r">[${lv}]</span></div>`; }).join("") || `<div class="hint">Усіх перебили. Скоро повернуться.</div>`}</div>` : `<div class="hint">Тут безпечно: моби не водяться.</div>`}`;
  updateTravelUI();
}
const resName = (type, t) => ITEMS[{herb:"h", mine:"o", fish:"f"}[type] + t].name;
function renderMobs(full){
  if (UI.view !== "loc" || B) return;
  const box = $("#mobs"); if (!box) return;
  const rt = locRT(S.loc);
  if (full){
    box.innerHTML = rt.mobs.filter(m => !m.dead && !m.busy).map(m => { const st = m.st, big = st.boss || st.strong || st.size > 1.2;
      discover(m.type);
      return `<button class="mob${big ? " big" : ""}${m.elite ? " elite" : ""}${m.distBoss ? " dboss" : ""}${UI.sel === m.uid ? " sel" : ""}" id="m-${m.uid}" data-mob="${m.uid}" aria-label="${st.name}, рівень ${m.lvl}" style="transform:translate(${m.x}px,${m.y}px)">${big ? sprite(m.type, 88, 88, 1.6, m.flip) : sprite(m.type, 64, 64, 1.45, m.flip)}<span class="lv${st.aggro ? " hostile" : ""}">${m.lvl}</span><span class="tip">${st.name} [${m.lvl}]</span></button>`; }).join("");
  } else {
    for (const m of rt.mobs){ const el = document.getElementById("m-" + m.uid); if (!el) continue; el.style.transform = `translate(${m.x}px,${m.y}px)`; const cv = el.firstChild; cv.dataset.flip = m.flip ? 1 : 0; cv.dataset.mv = m.wait > 0 ? 0 : 1; }
  }
}
function mobFxText(st){
  const t = [];
  if (st.rise) t.push("Повстає один раз після звичайного удару. Сильний удар, булава, вогонь, буря чи оберіг кладуть назавжди.");
  if (st.regrow) t.push("Голови відростають щораунду, поки не припечеш вогнем, бурею чи оберегом.");
  if (st.venom) t.push("Отруює: 3 раунди шкоди після удару.");
  if (st.drain) t.push(`Кожен удар забирає ${st.drain} енергії.`);
  if (st.lifesteal) t.push("П'є кров: лікується з кожного удару.");
  if (st.cleave) t.push("Кожен третій раунд б'є з розмаху, у 1,6 раза сильніше.");
  if (st.mend) t.push("Молиться за союзників: лікує поранених.");
  if (st.evade) t.push(`Важко влучити: +${st.evade}% до ухилення.`);
  if (st.duel) t.push("Кодекс честі: б'ється сам на сам, інші не втручаються.");
  if (st.side){ const o = ORDERS[st.side]; t.push(o.name + ". " + (!S.order ? "Поки ви без присяги, сам не нападає." : S.order === st.side ? "Ваш брат по ордену." : "Ворог вашого ордену: нападає першим.")); }
  return t;
}
function fxHTML(st){ const t = mobFxText(st); return t.length ? `<div class="fxl">${t.map(x => `<span>${x}</span>`).join("")}</div>` : ""; }
function wardHTML(st){ if (!st.wards.length) return ""; return `<div><span class="lbl">Боїться</span><div class="wards">${st.wards.map(w => { const it = WARD_ITEMS[w], own = it && inv(it[0]) > 0; return `<span class="${own ? "own" : ""}" title="${it ? (own ? "Є в торбі" : "Продає знахарка Параска в Ужгороді") : "Не предмет"}">${w}</span>`; }).join("")}</div></div>`; }
function renderMobCard(){
  const box = $("#mobcard"); if (!box) return;
  const m = UI.sel && locRT(S.loc).mobs.find(x => x.uid === UI.sel && !x.dead && !x.busy);
  if (!m){ box.innerHTML = ""; UI.sel = null; return; }
  const st = m.st;
  const drops = st.drop.filter(([d]) => !d.startsWith("raw") || st.boss).map(([d]) => { const q = questNeedsItem(d); return ITEMS[d].name + (q ? ` <b class="q">(квест ${q})</b>` : ""); }).join(", ");
  const pack = st.pack ? locRT(S.loc).mobs.filter(o => o !== m && o.type === m.type && !o.dead && !o.busy && Math.hypot(o.x - m.x, o.y - m.y) < 170).length : 0;
  const left = m.x > 450 ? m.x - 380 : m.x + 64, top = clamp(m.y - 180, 60, 150);
  box.innerHTML = `<div class="card mobcard" style="left:${left}px;top:${top}px">
    <div class="hd"><span class="ic">${sprite(m.type, 56, 56, 1.25, false)}</span><div><h3>${st.name}</h3><div class="k">${st.kind} · рівень ${m.lvl}${m.tier > 1 ? " · тір " + m.tier : ""}</div></div></div>
    ${st.lore ? `<div class="lore">${st.lore}</div>` : ""}${fxHTML(st)}
    ${m.stolen ? `<div class="lore" style="color:var(--ember)"><b>Несе ваші гроші (${moneyTxt(m.stolen)}).</b> Переможіть, щоб повернути.</div>` : ""}
    <div class="stats"><div class="st"><span>Здоров'я</span><b>${st.hp}</b></div><div class="st"><span>Урон</span><b>${st.dmg[0]}–${st.dmg[1]}</b></div><div class="st"><span>Захист</span><b>${st.def}</b></div><div class="st"><span>Спритн.</span><b>${st.agi}</b></div></div>
    ${wardHTML(st)}
    <div class="drops"><span class="lbl">Можна здобути</span>${drops ? drops + ", " : ""}мідь${st.boss ? ", самоцвіти" : ""}</div>
    ${pack ? `<div class="warn">Поруч ще ${pack} таких: можуть приєднатися до бою.</div>` : ""}
    ${m.lvl > S.lvl + 1 || st.boss ? `<div class="warn">${st.boss ? "Бос. Візьміть зілля й сувої." : "Цей супротивник сильніший за вас."}</div>` : ""}
    <div class="acts"><button class="btn p" data-attack="${m.uid}">Атакувати</button><button class="btn" data-act="unsel">Відміна</button></div></div>`;
  drawAllSprites();
}
