/* ============ підземелля ============ */
const ROOM = {fight:["Сутичка","arena"], elite:["Сильний ворог","skull2"], chest:["Скриня","chest"], trap:["Пастка","trap"], shrine:["Святиня","shrine"], boss:["Бос","codex"], unknown:["Невідомо","door"]};
function enterDungeon(id){
  if (T || B) return; const Dn = DUNGEONS[id];
  if (S.lvl < Dn.lvl - 2){ msg(`${Dn.name}: радимо щонайменше ${Dn.lvl - 1} рівень. Там дуже небезпечно.`, "warn"); }
  DG = {id, room:0, run:(S.dung[id] || 0) + 1, cur:null, doors:[], done:false};
  genDoors(); UI.view = "dungeon"; UI.sel = null;
  msg(`Ви спускаєтесь у ${Dn.name}. Похід ${DG.run}.`, "warn"); render();
}
function genDoors(){
  const Dn = DUNGEONS[DG.id];
  if (DG.room >= Dn.rooms - 1){ DG.doors = [{type:"boss", known:true}]; return; }
  const n = ri(2, 3), roll = () => { const x = Math.random(); return x < .45 ? "fight" : x < .58 ? "elite" : x < .74 ? "chest" : x < .86 ? "trap" : "shrine"; };
  DG.doors = [...Array(n)].map(() => ({type:roll(), known:Math.random() < .7}));
}
function dTier(){ return Math.min(7, DG.run); }
function chooseDoor(i){
  const d = DG.doors[i]; if (!d || (DG.cur && !DG.cur.done)) return;
  const Dn = DUNGEONS[DG.id];
  DG.cur = {type:d.type, done:false};
  if (d.type === "fight"){ const k = ri(1, 3); startBattle([...Array(k)].map(() => ({type:pick(Dn.pool), lvl:Dn.lvl, tier:dTier()})), null, "dungeon", Dn.node); return; }
  if (d.type === "elite"){ startBattle([{type:pick(Dn.pool), lvl:Dn.lvl, tier:dTier(), elite:true}], null, "dungeon", Dn.node); return; }
  if (d.type === "boss"){ msg(`${mobDef(Dn.boss).name} піднімається вам назустріч!`, "warn"); startBattle([{type:Dn.boss, lvl:Dn.lvl, tier:dTier()}], null, "dungeon", Dn.node); return; }
  if (d.type === "trap"){
    const st = stats(), avoid = clamp(30 + st.agi * 2.5, 30, 80);
    if (Math.random() * 100 < avoid){ DG.cur.text = "Ви помітили натяжну нитку й обійшли пастку."; }
    else { const dmg = Math.round(st.maxHp * .14); S.hp = Math.max(1, S.hp - dmg); DG.cur.text = `Плита провалилася під ногою: −${dmg} здоров'я.`; }
    DG.cur.done = true; nextRoom(true);
  }
  render();
}
function openChest(){
  if (!DG.cur || DG.cur.type !== "chest" || DG.cur.done) return;
  const Dn = DUNGEONS[DG.id];
  if (Math.random() < .12){ msg("Скриня ожила! Це пастка-мімік.", "warn"); DG.cur.type = "elite"; startBattle([{type:pick(Dn.pool), lvl:Dn.lvl, tier:dTier(), elite:true}], null, "dungeon", Dn.node); return; }
  const got = [], cop = ri(Dn.lvl * 15, Dn.lvl * 40) * (1 + .1 * (dTier() - 1));
  got.push([Dn.lvl >= 8 && Math.random() < .4 ? "raw2" : "raw1", 1]);
  got.push([pick(["potion_l","scroll_fire","scroll_shield","elix_str","elix_skin","potion_xe"]), 1]);
  if (Math.random() < .25) got.push([pick(["gem_ruby1","gem_topaz1","gem_onyx1","gem_emer1"]), 1]);
  for (const [id, n] of got) give(id, n, true); S.cop += Math.round(cop);
  DG.cur.text = `У скрині: ${got.map(([id]) => ITEMS[id].name).join(", ")}, ${moneyTxt(Math.round(cop))}.`;
  msg(DG.cur.text, "good"); DG.cur.done = true; nextRoom(true); save(); render();
}
function pray(){
  if (!DG.cur || DG.cur.type !== "shrine" || DG.cur.done) return;
  const st = stats(); S.hp = Math.min(st.maxHp, S.hp + st.maxHp * .4); S.en = Math.min(st.maxEn, S.en + st.maxEn * .4);
  DG.cur.text = "Тихе світло святині загоює рани (+40% здоров'я й енергії)."; DG.cur.done = true; nextRoom(true); save(); render();
}
function nextRoom(keepCur){ DG.room++; genDoors(); if (!keepCur) DG.cur = null; }
function dungeonAfterFight(res){
  if (!DG || !DG.cur) return;
  UI.view = "dungeon";
  if (res === "win"){ if (DG.cur.type === "boss"){ completeDungeon(); return; } DG.cur.done = true; DG.cur.text = "Кімнату очищено."; nextRoom(true); }
  else { DG.cur = null; genDoors(); }
}
function completeDungeon(){
  const Dn = DUNGEONS[DG.id];
  S.dung[DG.id] = (S.dung[DG.id] || 0) + 1; questEvent("dungeon", DG.id);
  const cop = Math.round(Dn.lvl * 120 * (1 + .15 * (dTier() - 1))); S.cop += cop;
  const raw = Dn.lvl >= 8 ? "raw3" : "raw2"; give(raw, 1, true);
  DG.done = true; DG.cur = {type:"boss", done:true, text:`Підземелля пройдено! Нагорода: ${moneyTxt(cop)}, ${ITEMS[raw].name}. Наступний похід буде важчим.`};
  msg(`${Dn.name}: пройдено (похід ${DG.run})!`, "good"); save(); UI.view = "dungeon";
}
function leaveDungeon(){ if (!DG) return; msg(DG.done ? "Ви вийшли з підземелля переможцем." : "Ви вийшли з підземелля.", DG.done ? "good" : ""); DG = null; UI.view = "loc"; render(); }
function renderDungeon(){
  const Dn = DUNGEONS[DG.id], v = $("#view");
  let h = `<svg class="scene" width="900" height="528" viewBox="0 0 900 528" aria-hidden="true">${dungeonSVG(Dn.scene)}</svg>`;
  h += `<div class="title-plate"><b>${Dn.name}</b><span>Похід ${DG.run} · рівень ${Dn.lvl}${dTier() > 1 ? " · тір " + dTier() : ""}</span></div>`;
  h += `<div class="droom">${[...Array(Dn.rooms)].map((_, i) => `<i class="${i < DG.room ? "ok" : i === DG.room ? "cur" : ""}${i === Dn.rooms - 1 ? " boss" : ""}"></i>`).join("")}</div>`;
  h += `<div class="npc me-tok" style="left:140px;top:380px"><span class="c">${esc(S.name[0])}</span><span class="n">Ви</span></div>`;
  const c = DG.cur;
  if (c && c.text) h += `<div class="card dcard"><p>${c.text}</p></div>`;
  if (c && !c.done && c.type === "chest") h += `<div class="card dcard"><b>Стара скриня</b><p>Окута залізом, замок проржавів.</p><button class="btn p" data-act="chest">Відкрити</button></div>`;
  if (c && !c.done && c.type === "shrine") h += `<div class="card dcard"><b>Святиня</b><p>Кам'яний вівтар зі свічкою, що горить без вогню.</p><button class="btn p" data-act="pray">Помолитися</button></div>`;
  if (!DG.done && (!c || c.done)){
    h += `<div class="doors">${DG.doors.map((d, i) => { const [l, ic] = ROOM[d.known ? d.type : "unknown"]; return `<button class="door${d.type === "boss" ? " boss" : ""}" data-door="${i}">${svg(ic, 26, "#e9e1cf")}<span>${l}</span></button>`; }).join("")}</div>`;
  }
  h += `<button class="btn dk dleave" data-act="leaveDg">${DG.done ? "Вийти переможцем" : "Вийти з підземелля"}</button>`;
  v.innerHTML = h;
  const boss = mobDef(Dn.boss);
  $("#panel").innerHTML = `<h2 class="ph">${Dn.name}</h2><div class="hint it">${Dn.text}</div>
    <div class="sub">Похід</div><div class="kv"><span>Кімната</span><b>${Math.min(DG.room + 1, Dn.rooms)} / ${Dn.rooms}</b></div><div class="kv"><span>Пройдено раніше</span><b>${S.dung[DG.id] || 0}</b></div><div class="kv"><span>Сила ворогів</span><b>тір ${dTier()}</b></div>
    <div class="sub">Бос</div><div class="bossrow"><span class="ic">${sprite(Dn.boss, 56, 56, 1.1, false)}</span><div><b>${boss.name}</b><div class="hint">${boss.lore}</div></div></div>
    <div class="sub">Можна здобути</div><div class="hint">${(boss.drop || []).map(([id]) => ITEMS[id] ? `<span class="${ITEMS[id].rare ? "rare" : ""}">${ITEMS[id].name}</span>` : "").filter(Boolean).join(", ")}, самоцвіти, золото.</div>
    <div class="sub">Поради</div><div class="hint">Двері з «?» можуть приховувати будь-що. Святині лікують. Після кожного проходу підземелля стає сильнішим, а нагорода більшою.</div>`;
  drawAllSprites();
}
