/* ============ бій ============ */
function ownedWard(e){ if (inv("scroll_ward") && isDemon(e.type)) return "scroll_ward"; return wardIds(e.wards).find(id => inv(id) > 0) || null; }
function mkEnemy(type, lvl, o = {}, uid = null){ const st = mobStats(type, lvl, o); return {...st, uid, maxHp:st.hp, stun:0, curse:0, stolen:0, fled:false}; }
function startBattle(list, mobRef, origin, scene){
  UI.sel = null; UI.gathering = null; closeModal();
  const enemies = list.map(x => mkEnemy(x.type, x.lvl, {elite:x.elite, tier:x.tier, distBoss:x.distBoss}, x.uid || null));
  if (origin === "loc" && mobRef && mobRef.st.pack && !mobRef.distBoss){
    const rt = locRT(S.loc);
    const mates = rt.mobs.filter(o => o !== mobRef && o.type === mobRef.type && !o.dead && !o.busy && Math.hypot(o.x - mobRef.x, o.y - mobRef.y) < 170);
    const chance = mobRef.st.arch === "swarmer" ? .85 : .4;
    for (const o of mates.slice(0, 2)) if (Math.random() < chance){ enemies.push(mkEnemy(o.type, o.lvl, {elite:o.elite, tier:o.tier}, o.uid)); o.busy = true; }
  }
  if (mobRef) mobRef.busy = true;
  B = {enemies, target:0, round:1, phase:"choose", timer:20, origin, scene, log:[], dealt:0, taken:0, boss:enemies.some(e => e.boss), block:false, shield:0, poison:0, poisonDmg:0, lostCop:0};
  for (const e of enemies) discover(e.type);
  UI.tab = "Лог бою";
  blog(`Бій почався: ${S.name} проти ${enemies.map(e => e.name + " [" + e.lvl + "]").join(", ")}.`);
  if (enemies.length > 1 && origin === "loc") blog(`До бою приєдналися ще ${enemies.length - 1}!`, "warn");
  const ceil = enemies.find(e => e.arch === "ceiling");
  if (ceil){ const d = Math.max(1, Math.round(rnd(ceil.dmg[0], ceil.dmg[1]) * (1 - reduce(stats().def)))); S.hp = Math.max(1, S.hp - d); B.taken += d; B.poison = 3; B.poisonDmg = Math.max(3, Math.round(ceil.lvl * 2));
    blog(`${ceil.name} падає зверху: −${d} і отрута!`, "warn"); B.log.push([0, `${ceil.name} падає зверху`, "−" + d, "hurt"]); }
  render();
}
function blog(text, kind = ""){ msg(text, kind, "fight"); }
function rollHit(att, def, mult = 1, extraDodge = 0){
  const dodge = clamp(5 + (def.agi - att.agi) * 2 + extraDodge, 3, 40);
  if (Math.random() * 100 < dodge) return {miss:true};
  let d = rnd(att.dmg[0], att.dmg[1]) * mult; const crit = Math.random() * 100 < 5 + att.agi * .5 + (att.crit || 0);
  if (crit) d *= 1.7;
  return {dmg:Math.max(1, Math.round(d * (1 - reduce(def.def)))), crit};
}
function fx(el, text, color){
  if (!el) return; const v = $("#view"), r = el.getBoundingClientRect(), vr = v.getBoundingClientRect(), sc = vr.width / v.offsetWidth;
  const d = document.createElement("div"); d.className = "fx"; d.textContent = text; d.style.color = color;
  d.style.left = ((r.left + r.width / 2 - vr.left) / sc) + "px"; d.style.top = ((r.top - vr.top) / sc - 10) + "px";
  v.appendChild(d); setTimeout(() => d.remove(), 1200);
}
function lunge(i){ const cv = document.getElementById("spr-e" + i); if (cv){ cv.dataset.atk = 1; setTimeout(() => { cv.dataset.atk = 0; }, 450); } }
const alive = e => e.hp > 0 && !e.fled;
function renderBattle(){
  const v = $("#view"), st = stats(), tg = B.enemies[B.target];
  const bg = B.origin === "dungeon" ? dungeonSVG(DUNGEONS[DG.id].scene) : sceneSVG(B.scene);
  let h = `<svg class="scene" width="1216" height="528" viewBox="0 0 900 528" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg}</svg><div class="bshade"></div>`;
  const phase = B.phase === "choose" ? `<div class="go"><i id="btimer" style="width:100%"></i><span>ВАШ ХІД</span><b id="bsec">20</b></div>` : B.phase === "end" ? `<div class="fight done">БІЙ ЗАВЕРШЕНО</div>` : `<div class="fight">БІЙ</div>`;
  const chips = (B.poison ? `<span class="po">Отрута ${B.poison}</span>` : "") + (B.block ? `<span class="bl">Блок</span>` : "") + (B.shield ? `<span class="bl">Щит ${B.shield}</span>` : "") + S.buffs.map(b => `<span class="bf">${ITEMS[b.id].name.replace("Еліксир ", "")}</span>`).join("");
  h += `<div class="bstat"><div class="side"><div class="avatar sm">${esc(S.name[0])}</div><div class="bb"><b>${esc(S.name)} [${S.lvl}]</b><div class="bar hp"><div class="tr"><div class="fl" style="width:${S.hp / st.maxHp * 100}%"></div></div><span>${Math.ceil(S.hp)}/${st.maxHp}</span></div><div class="bar en"><div class="tr"><div class="fl" style="width:${S.en / st.maxEn * 100}%"></div></div><span>${Math.floor(S.en)}/${st.maxEn}</span></div>${chips ? `<div class="fx-chips">${chips}</div>` : ""}</div></div>
    <div class="phase">${phase}</div>
    <div class="side r"><div class="bb"><b>${tg ? tg.name + " [" + tg.lvl + "]" : ""}</b>${tg ? `<div class="bar hp rev"><span>${Math.max(0, Math.ceil(tg.hp))}/${tg.maxHp}</span><div class="tr"><div class="fl" style="width:${Math.max(0, tg.hp) / tg.maxHp * 100}%"></div></div></div>` : ""}<div class="hint lm">раунд ${B.round}${tg && tg.arch ? " · " + (ARCHL[tg.arch] || "") : ""}${tg && tg.curse ? " · прокляття " + tg.curse : ""}</div></div></div></div>`;
  const PX = 330, PY = 300;
  h += `<div class="fighter pl" id="f-p" style="left:${PX}px;top:${PY}px"><span class="c">${esc(S.name[0])}<span class="lv">${S.lvl}</span></span><span class="nm">${esc(S.name)}</span><span class="hb"><div style="width:${S.hp / st.maxHp * 100}%"></div></span></div>`;
  if (B.phase === "choose"){
    const wd = tg && ownedWard(tg);
    const acts = [["hit","sword","Удар",""],["strong","strong","Сильний","20 ен."],["block","shield","Блок","+15 ен."],["flee","run","Втекти",B.boss ? "25%" : "50%"]];
    if (wd) acts.push(["ward","ward","Оберіг",ITEMS[wd].name.split(" ")[0]]);
    const angs = [-90, -148, -32, 148, 32];
    h += `<div class="ring" style="left:${PX}px;top:${PY}px">` + acts.map(([a, ic, l, sm], i) => { const ang = angs[i] * Math.PI / 180, dis = a === "strong" && S.en < 20;
      return `<button class="ract${a === "ward" ? " ward" : ""}" data-bact="${a}" style="left:${Math.cos(ang) * 108}px;top:${Math.sin(ang) * 108}px" ${dis ? "disabled" : ""} aria-label="${l}">${svg(ic, 18)}<span>${l}</span>${sm ? `<small>${sm}</small>` : ""}</button>`; }).join("") + `</div>`;
  }
  const n = B.enemies.length;
  B.enemies.forEach((e, i) => {
    const x = n === 1 ? 800 : 760 + (i % 2) * 150, y = n === 1 ? 290 : 165 + i * (290 / Math.max(1, n - 1));
    h += `<button class="fighter${i === B.target ? " tg" : ""}${alive(e) ? "" : " dead"}" id="f-e${i}" data-tgt="${i}" style="left:${x}px;top:${y}px" ${alive(e) ? "" : "disabled"} aria-label="Ціль: ${e.name}"><span class="sp">${sprite(e.type, 130, 120, e.size > 1.45 ? 2.1 : e.size > 1.2 ? 2.5 : 3, true, `id="spr-e${i}"`)}<span class="lv">${e.lvl}</span>${e.stun ? `<span class="stun">оглушений</span>` : ""}</span><span class="nm">${e.fled ? "втік" : e.name}</span><span class="hb"><div style="width:${Math.max(0, e.hp) / e.maxHp * 100}%"></div></span></button>`;
  });
  h += `<div class="flist"><div class="fl self"><span class="lvc g">${S.lvl}</span><span class="w"><b>${esc(S.name)}</b><i><u style="width:${S.hp / st.maxHp * 100}%"></u></i></span></div>` +
    B.enemies.map((e, i) => `<button class="fl${i === B.target ? " tg" : ""}" data-tgt="${i}" ${alive(e) ? "" : "disabled"}><span class="lvc r">${e.lvl}</span><span class="w"><b>${e.name}</b><i><u style="width:${Math.max(0, e.hp) / e.maxHp * 100}%"></u></i></span></button>`).join("") + `</div>`;
  h += `<div class="bhint">${B.phase === "choose" ? "Оберіть ціль праворуч і дію в колі. Зілля й сувої беріть з пояса зліва: це теж хід." : ""}</div>`;
  v.innerHTML = h;
  updateBattleTimer(); drawAllSprites();
}
function updateBattleTimer(){
  if (!B || B.phase !== "choose") return;
  const b = document.getElementById("btimer"), s = document.getElementById("bsec");
  if (b) b.style.width = (B.timer / 20 * 100) + "%"; if (s) s.textContent = Math.ceil(B.timer);
}
function tickBattle(dt){
  if (!B || B.phase !== "choose" || modalOpen()) return;
  B.timer -= dt; updateBattleTimer();
  if (B.timer <= 0){ blog("Час вийшов: ви стали в блок.", "warn"); act("block"); }
}
function hitEnemy(e, d, label, col, crit){ e.hp -= d; B.dealt += d; fx(document.getElementById("f-e" + B.enemies.indexOf(e)), "-" + d + (label ? " " + label : "") + (crit ? "!" : ""), col || (crit ? "#ffcf6b" : "#ff8a6b")); }
async function act(a, itemId){
  if (!B || B.phase !== "choose") return;
  const st = stats();
  if (a === "strong" && S.en < 20) return;
  if (a === "item" && (!itemId || !inv(itemId))) return;
  if (!alive(B.enemies[B.target])) B.target = B.enemies.findIndex(alive);
  const tg = B.enemies[B.target];
  let wardId = null; if (a === "ward"){ wardId = ownedWard(tg); if (!wardId) return; }
  B.phase = "resolve"; B.block = a === "block"; render();
  const me = {agi:st.agi, def:st.def, dmg:st.dmg, crit:st.crit};
  const pEl = () => document.getElementById("f-p");
  await sleep(300);
  if (a === "hit" || a === "strong"){
    if (a === "strong") S.en -= 20;
    const extra = (a === "strong" ? 8 : 0) + (tg.arch === "kiter" ? 8 : 0) + (tg.arch === "wisp" ? 12 : 0);
    const r = rollHit(me, tg.curse ? {...tg, def:0} : tg, a === "strong" ? 1.6 : 1, extra);
    if (r.miss){ fx(document.getElementById("f-e" + B.target), "ухилення", "#ece6d8"); B.log.push([B.round, `${S.name} → ${tg.name}`, "ухилення", "miss"]); blog(`${tg.name} ухилився від вашого удару.`); }
    else { let d = r.dmg, note = "";
      if (tg.curse) d = Math.round(d * 1.2);
      if (tg.arch === "shielded" && a === "hit"){ d = Math.max(1, Math.round(d * .4)); note = "щит"; }
      hitEnemy(tg, d, "", null, r.crit);
      B.log.push([B.round, `${S.name} → ${tg.name}`, "−" + d + (r.crit ? " крит" : "") + (note ? " " + note : ""), "hit"]);
      blog(`Ви ${a === "strong" ? "сильно " : ""}вдарили ${tg.name}: −${d}${r.crit ? " (критичний!)" : ""}${note ? ". Щит тримає удар, бийте сильним" : ""}.`); }
  } else if (a === "ward"){
    take(wardId);
    const d = Math.round(tg.maxHp * .25 + tg.lvl * 4); hitEnemy(tg, d, "оберіг", "#b7f0a0"); tg.stun = 1;
    B.log.push([B.round, `${S.name}: ${ITEMS[wardId].name} → ${tg.name}`, "−" + d + " оглуш.", "heal"]);
    blog(`${ITEMS[wardId].name} пече ${tg.name}: −${d}, нечисть оглушена!`, "good"); renderBelt();
  } else if (a === "block"){
    S.en = Math.min(st.maxEn, S.en + 15); fx(pEl(), "блок", "#9fc2ea"); B.log.push([B.round, `${S.name}: блок`, "", "miss"]); blog("Ви стали в блок.");
  } else if (a === "item"){
    const it = ITEMS[itemId];
    if (it.scroll){
      take(itemId);
      if (it.scroll === "heal"){ const hv = Math.round(st.maxHp * .3); S.hp = Math.min(st.maxHp, S.hp + hv); fx(pEl(), "+" + hv, "#8fd18a"); blog(`${it.name}: +${hv} здоров'я.`, "good"); B.log.push([B.round, `${S.name}: ${it.name}`, "+" + hv, "heal"]); }
      else if (it.scroll === "fire"){ const d = 40 + 8 * S.lvl; hitEnemy(tg, d, "вогонь", "#ffb24a"); blog(`${it.name} обпікає ${tg.name}: −${d}.`); B.log.push([B.round, `${S.name}: ${it.name} → ${tg.name}`, "−" + d, "hit"]); }
      else if (it.scroll === "shield"){ B.shield = 2; fx(pEl(), "щит", "#9fc2ea"); blog("Сувій щита: два раунди удари по вас слабші."); B.log.push([B.round, `${S.name}: ${it.name}`, "щит 2", "heal"]); }
      else if (it.scroll === "curse"){ tg.curse = 3; fx(document.getElementById("f-e" + B.target), "прокляття", "#c88aff"); blog(`${tg.name} проклятий: захист зник, урон по ньому +20%.`); B.log.push([B.round, `${S.name}: ${it.name} → ${tg.name}`, "прокляття", "hit"]); }
      else if (it.scroll === "storm"){ const d = 50 + 6 * S.lvl; for (const e of B.enemies) if (alive(e)) hitEnemy(e, d, "буря", "#9fd8ff"); blog(`${it.name}: усім ворогам −${d}.`); B.log.push([B.round, `${S.name}: ${it.name}`, "−" + d + " усім", "hit"]); }
      else if (it.scroll === "ward"){ const d = Math.round(tg.maxHp * .25 + tg.lvl * 4); hitEnemy(tg, d, "оберіг", "#b7f0a0"); tg.stun = 1; blog(`${it.name}: −${d}, ${tg.name} оглушений.`, "good"); B.log.push([B.round, `${S.name}: ${it.name}`, "−" + d, "heal"]); }
      else if (it.scroll === "tp"){ give(itemId, 1, true); blog("Сувій перенесення не діє в бою.", "warn"); }
      renderBelt();
    } else {
      const txt = useItem(itemId, true); fx(pEl(), txt, "#8fd18a"); B.log.push([B.round, `${S.name}: ${it.name}`, txt, "heal"]);
    }
  } else if (a === "flee"){
    if (Math.random() < (B.boss ? .25 : .5)){ blog("Вам вдалося втекти!", "good"); endBattle("flee"); return; }
    blog("Втекти не вдалося!", "warn"); B.log.push([B.round, `${S.name}: спроба втечі`, "невдало", "miss"]);
  }
  refreshBars();
  for (const e of B.enemies) if (e.hp <= 0 && !e.deadLogged){ e.deadLogged = true; await sleep(300); blog(`${e.name} загинув.`, "good"); B.log.push([B.round, `${e.name} загинув`, "", "dead"]); const el = document.getElementById("f-e" + B.enemies.indexOf(e)); if (el) el.classList.add("dead"); }
  if (!B.enemies.some(alive)){ await sleep(500); endBattle("win"); return; }
  // хід ворогів
  for (let i = 0; i < B.enemies.length; i++){
    const e = B.enemies[i]; if (!alive(e)) continue;
    await sleep(500);
    if (e.curse) e.curse--;
    if (e.stun){ e.stun = 0; blog(`${e.name} оглушений і пропускає хід.`); B.log.push([B.round, e.name, "оглушений", "miss"]); continue; }
    if (e.arch === "thief" && e.stolen && Math.random() < .4){ e.fled = true; blog(`${e.name} втік з вашими грошима (${moneyTxt(e.stolen)})!`, "warn"); B.log.push([B.round, `${e.name} втік`, moneyTxt(e.stolen), "hurt"]); B.lostCop += e.stolen; render(); continue; }
    if ((e.arch === "summoner" || e.dboss) && B.round % 3 === 0 && B.enemies.filter(alive).length < 4){
      const type = e.summon || (pick(BESTIARY.filter(d => NODES[B.scene] && d.reg.includes(NODES[B.scene].reg || "") && d.tier === 1)) || {}).id || "chort";
      const add = mkEnemy(type, Math.max(1, e.lvl - 2), {}, null); add.hp = add.maxHp = Math.round(add.maxHp * .6); add.xp = Math.round(add.xp * .4); add.drop = [];
      B.enemies.push(add); discover(type); blog(`${e.name} кличе на поміч: ${add.name}!`, "warn"); B.log.push([B.round, `${e.name} кличе підмогу`, add.name, "hurt"]); render(); continue;
    }
    lunge(i);
    let mult = 1, fury = false; if ((e.boss || e.arch === "bruiser" || e.strong) && Math.random() < .25){ mult = 1.5; fury = true; }
    const r = rollHit(e, e.arch === "caster" ? {agi:me.agi, def:0} : me, mult, e.arch === "flyer" ? -5 : 0);
    if (r.miss){ fx(pEl(), "ухилення", "#ece6d8"); B.log.push([B.round, `${e.name} → ${S.name}`, "ухилення", "miss"]); blog(`Ви ухилилися від удару ${e.name}.`); }
    else { let d = r.dmg; if (B.block || B.shield) d = Math.max(1, Math.round(d * .4)); S.hp -= d; B.taken += d;
      const notes = []; if (fury) notes.push("лють"); if (B.block) notes.push("блок"); else if (B.shield) notes.push("щит"); if (e.arch === "caster") notes.push("магія");
      if (e.arch === "flyer"){ S.en = Math.max(0, S.en - 10); notes.push("−10 ен."); }
      if (e.arch === "thief" && !e.stolen){ const s = Math.min(S.cop, 8 + e.lvl * 4); S.cop -= s; e.stolen = s; if (s) notes.push("вкрав " + moneyTxt(s)); }
      const note = notes.join(", ");
      fx(pEl(), "-" + d, "#ff6b5b"); B.log.push([B.round, `${e.name} → ${S.name}`, "−" + d + (note ? " " + note : ""), "hurt"]);
      blog(`${e.name} ${fury ? "люто " : ""}б'є вас: −${d}${note ? " (" + note + ")" : ""}.`); }
    refreshBars();
    if (S.hp <= 0){ await sleep(500); endBattle("lose"); return; }
  }
  if (B.poison > 0){ S.hp -= B.poisonDmg; B.taken += B.poisonDmg; B.poison--; fx(pEl(), "-" + B.poisonDmg + " отрута", "#c88aff"); blog(`Отрута: −${B.poisonDmg}.`); refreshBars(); if (S.hp <= 0){ await sleep(500); endBattle("lose"); return; } }
  if (B.shield) B.shield--;
  await sleep(400);
  B.round++; B.phase = "choose"; B.timer = 20; S.en = Math.min(st.maxEn, S.en + 6);
  if (!alive(B.enemies[B.target])) B.target = B.enemies.findIndex(alive);
  render();
}
function refreshBars(){
  if (!B) return; const st = stats();
  const p = document.querySelector("#f-p .hb div"); if (p) p.style.width = clamp(S.hp / st.maxHp * 100, 0, 100) + "%";
  B.enemies.forEach((e, i) => { const el = document.querySelector(`#f-e${i} .hb div`); if (el) el.style.width = Math.max(0, e.hp) / e.maxHp * 100 + "%"; });
  renderTop();
}
function questKill(e){
  for (const [qid, q] of Object.entries(S.quests)){ const G = QUESTS[qid].goal; if (q.st !== "active" || q.n >= G.n) continue;
    if (G.kill === e.type || (G.strong && (e.strong || e.boss))){ q.n++; msg(`Квест «${QUESTS[qid].name}»: ${q.n} із ${G.n}.`, "quest"); } }
}
function questEvent(kind, key){
  for (const [qid, q] of Object.entries(S.quests)){ const G = QUESTS[qid].goal; if (q.st !== "active" || q.n >= G.n) continue;
    if ((kind === "clear" && (G.clear === key || (G.clearAny && NODES[key].r === G.clearAny))) || (kind === "dungeon" && G.dungeon === key) || (kind === "craft" && G.craft === key) || (kind === "visit" && G.visit === key)){
      q.n++; msg(`Квест «${QUESTS[qid].name}»: ${q.n} із ${G.n}.`, "quest"); } }
}
function endBattle(res){
  const b = B; b.phase = "end"; b.result = res;
  const rt = b.origin === "loc" ? locRT(S.loc) : null;
  let xp = 0, cop = 0; const loot = [];
  if (res === "win"){
    for (const e of b.enemies){
      if (e.fled){ if (rt && e.uid){ const m = rt.mobs.find(x => x.uid === e.uid); if (m) m.busy = false; } continue; }
      xp += Math.round(e.xp * (S.lvl > e.lvl + 2 ? .35 : 1)); cop += ri(e.cop[0], e.cop[1]) + e.stolen;
      if (e.stolen) msg(`Ви повернули вкрадене: ${moneyTxt(e.stolen)}.`, "good");
      for (const [it, ch] of e.drop) if (it && Math.random() < ch){ give(it, 1, true); loot.push(it); }
      S.kills++; questKill(e);
      if (rt && e.uid){ const m = rt.mobs.find(x => x.uid === e.uid); if (m){ m.dead = true; m.busy = false; m.respawn = performance.now() + (m.distBoss ? 1e12 : e.boss ? 150000 : e.strong ? 90000 : 40000); } }
      if (b.origin === "loc"){
        if (e.distBoss){ S.clears[S.loc] = (S.clears[S.loc] || 0) + 1; S.kc[S.loc] = 0; questEvent("clear", S.loc);
          msg(`Район ${NODES[S.loc].name} зачищено! Тепер тут сильніша нечисть і кращий лут (тір ${tierOf(S.loc)}).`, "good"); b.cleared = S.loc; }
        else if (!e.boss) S.kc[S.loc] = (S.kc[S.loc] || 0) + 1;
      }
    }
    for (const it of loot){ const q = questNeedsItem(it); if (q) msg(`Зібрано: ${ITEMS[it].name}, ${q}.`, "quest"); }
    S.cop += cop; msg("Ви перемогли в бою!", "good");
    msg(`Ви отримали: ${[moneyTxt(cop), ...loot.map(i => ITEMS[i].name)].join(", ")}${xp && S.lvl < MAXLVL ? "; досвід +" + xp : ""}.`);
    gainXp(xp);
    if (b.origin === "loc") checkDistrictBoss(S.loc);
  } else {
    if (rt) for (const e of b.enemies) if (e.uid){ const m = rt.mobs.find(x => x.uid === e.uid); if (m) m.busy = false; }
    if (res === "lose"){ const lost = Math.floor(S.cop * .1); S.cop -= lost; S.hp = 0; msg(`Ви загинули. Втрачено ${moneyTxt(lost)}.`, "warn"); }
  }
  // еліксири діють кілька боїв
  S.buffs = S.buffs.filter(x => --x.n > 0);
  save();
  if (res === "flee"){ finishBattle(); return; }
  showSummary(b, res, xp, cop, loot);
}
function finishBattle(){
  const b = B; B = null; UI.tab = "Локація";
  if (b && b.cleared){ delete LR[b.cleared]; }
  if (S.hp <= 0){ const st = stats(); S.hp = Math.round(st.maxHp * .4); DG = null; T = null; S.prev = null; S.loc = nearestTown(S.loc); UI.view = "loc"; msg(`Ви отямилися: ${NODES[S.loc].name}.`, "warn"); arrive(); return; }
  if (b && b.origin === "dungeon"){ dungeonAfterFight(b.result); save(); render(); return; }
  if (b && b.origin === "travel" && T) UI.view = "map";
  save(); render();
}
function gainXp(x){
  if (S.lvl >= MAXLVL){ S.xp = 0; return; }
  S.xp += x;
  while (S.lvl < MAXLVL && S.xp >= need(S.lvl)){ S.xp -= need(S.lvl); S.lvl++; const st = stats(); S.hp = st.maxHp; S.en = st.maxEn;
    msg(`Новий рівень: ${S.lvl}! Сила, спритність і витривалість зросли, здоров'я відновлене.`, "good");
    if (S.lvl === 6) msg("За Карпатами лежить Закарпаття: три дороги ведуть туди з Попелястих земель.", "quest");
    if (S.lvl === MAXLVL){ S.xp = 0; msg("Ви досягли найвищого рівня. Далі сила йде від спорядження, самоцвітів, ремесел, підземель і зачисток.", "good"); } }
}
function showSummary(b, res, xp, cop, loot){
  const win = res === "win";
  const mine = `<div class="side-col"><div class="hd ${win ? "w" : "l"}">${win ? "Переможці" : "Переможені"}</div><div class="bx"><h4>${esc(S.name)} <span class="hint">[${S.lvl}]</span></h4>
    ${win && S.lvl < MAXLVL ? `<div class="kv"><span>Досвід</span><b>+${xp}</b></div>` : ""}<div class="kv"><span>Нанесено шкоди</span><b>${b.dealt}</b></div><div class="kv"><span>Отримано шкоди</span><b>${b.taken}</b></div><div class="kv"><span>Загинув</span><b>${win ? "ні" : "так"}</b></div></div></div>`;
  const theirs = `<div class="side-col"><div class="hd ${win ? "l" : "w"}">${win ? "Переможені" : "Переможці"}</div>${b.enemies.map(e => `<div class="bx"><h4>${e.name} <span class="hint">[${e.lvl}]</span></h4><div class="kv"><span>${e.fled ? "Втік з грошима" : "Залишок здоров'я"}</span><b>${e.fled ? moneyTxt(e.stolen) : Math.max(0, Math.ceil(e.hp)) + " / " + e.maxHp}</b></div></div>`).join("")}</div>`;
  const col = {hit:"var(--ink)", hurt:"var(--ember)", miss:"var(--muted)", heal:"var(--green)", dead:"var(--ink)"};
  const log = `<div class="logcol"><div class="sub">Лог бою</div><div class="blog">${b.log.map(([r, w, v, k]) => `<div><span class="hint">р. ${r}</span><span class="${k === "dead" ? "bd" : ""}">${w}</span><span class="v" style="color:${col[k]}">${v}</span></div>`).join("")}</div></div>`;
  const lootH = win ? `<div class="loot"><span class="lbl">Здобич</span>${loot.map(i => { const q = questNeedsItem(i); return `<span class="${q ? "a" : ""}${ITEMS[i].rare ? " rare" : ""}">${ITEMS[i].name}${q ? ": квест " + q : ""}</span>`; }).join("")}<span>${moneyTxt(cop)}</span>${S.lvl < MAXLVL ? `<span>+${xp} досвіду</span>` : ""}${b.lostCop ? `<span class="a">втрачено ${moneyTxt(b.lostCop)}</span>` : ""}${b.cleared ? `<span class="a">район зачищено</span>` : ""}</div>`
    : `<div class="warn">Ви втратили 10% грошей і отямитеся в найближчому місті.</div>`;
  openModal(`<div class="mbox wide"><div class="mhead"><h2>Підсумки бою</h2><span class="hint">${esc(S.name)} проти ${b.enemies.map(e => `${e.name} [${e.lvl}]`).join(", ")} · раундів: ${b.round}</span></div>
    <div class="sumrow">${mine}${log}${theirs}</div>
    <div class="sumfoot">${lootH}<button class="btn p big" data-act="sumok">Далі</button></div></div>`, true);
}
