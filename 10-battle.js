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
  if (origin === "loc"){ const rt = locRT(S.loc); for (const e of enemies) if (e.uid){ const m = rt.mobs.find(x => x.uid === e.uid); if (m && m.stolen){ e.stolen = m.stolen; m.stolen = 0; } } }
  B = {enemies, target:0, round:1, phase:"choose", timer:20, origin, scene, log:[], dealt:0, taken:0, boss:enemies.some(e => e.boss), block:false, shield:0, poison:0, poisonDmg:0, lostCop:0, free:0, joined:0};
  B.pet = petJoin(); if (B.pet) blog(`${B.pet.name} [${B.pet.lvl}] стає поруч з вами.`);
  for (const e of enemies) discover(e.type);
  UI.tab = "Лог бою";
  if (origin !== "dungeon" && LOCS[scene] && LOCS[scene].bog && !bogSafe()){ B.bog = true; B.poison = 3; B.poisonDmg = Math.round(6 + S.lvl * 1.5); }
  blog(`Бій почався: ${S.name} проти ${enemies.map(e => e.name + " [" + e.lvl + "]").join(", ")}.`);
  regIntro(); abilStart();
  if (enemies.length > 1 && origin === "loc") blog(`До бою приєдналися ще ${enemies.length - 1}!`, "warn");
  if (B.bog) blog("Туман Трясовини лізе в легені: отрута на 3 раунди, а енергія в багні відновлюється повільніше. Болотяні ходаки або настоянка багна захистили б.", "warn");
  if (enemies.some(e => e.duel) && enemies.length === 1 && origin === "loc") blog(`${enemies[0].name} салютує мечем: поєдинок за кодексом, сам на сам.`);
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
  if (!el || (S.opt && S.opt.dmgnum === false && /^[-+]\d/.test(text))) return; const v = $("#view"), r = el.getBoundingClientRect(), vr = v.getBoundingClientRect(), sc = vr.width / v.offsetWidth;
  const d = document.createElement("div"); d.className = "fx"; d.textContent = text; d.style.color = color;
  d.style.left = ((r.left + r.width / 2 - vr.left) / sc) + "px"; d.style.top = ((r.top - vr.top) / sc - 10) + "px";
  v.appendChild(d); setTimeout(() => d.remove(), 1200);
}
function lunge(i){ const cv = document.getElementById("spr-e" + i); if (cv){ cv.dataset.atk = 1; setTimeout(() => { cv.dataset.atk = 0; }, 450); } }
const alive = e => !!e && e.hp > 0 && !e.fled;
// бій закінчено, якщо битися нема з ким: когось убили — перемога, усі втекли — ворог утік
const battleOver = () => !B.enemies.some(alive);
const overResult = () => B.enemies.some(e => e.hp <= 0 && !e.fled) ? "win" : "gone";
function renderBattle(){
  const v = $("#view"), st = stats(), tg = B.enemies[B.target];
  const bst = "width:1216px;height:528px;object-fit:cover";
  let h = (B.origin === "dungeon" ? dungeonImg(DUNGEONS[DG.id].scene, bst) : sceneImg(B.scene, bst)) + `<div class="bshade"></div>`;
  const phase = B.phase === "choose" ? `<div class="go"><i id="btimer" style="width:100%"></i><span>ВАШ ХІД</span><b id="bsec">20</b></div>` : B.phase === "end" ? `<div class="fight done">БІЙ ЗАВЕРШЕНО</div>` : `<div class="fight">БІЙ</div>`;
  const chips = (B.poison ? `<span class="po">Отрута ${B.poison}</span>` : "") + (B.rage ? `<span class="bf">Лють ${B.rage}</span>` : "") + (B.cry ? `<span class="bf">Клич ${B.cry}</span>` : "") + (B.hawk ? `<span class="bf">Око ${B.hawk}</span>` : "") + (B.iron ? `<span class="bl">Шкіра ${B.iron}</span>` : "") + (B.absorb ? `<span class="bl">Щит ${B.absorb}</span>` : "") + (B.bleed ? `<span class="po">Кровотеча ${B.bleed}</span>` : "") + (B.burnMe ? `<span class="po">Опік ${B.burnMe}</span>` : "") + (B.weak ? `<span class="po">Слабкість ${B.weak}</span>` : "") + (B.armBreak ? `<span class="po">Броня ${B.armBreak}</span>` : "") + (B.held || B.web ? `<span class="po">Тримають ${Math.max(B.held || 0, B.web || 0)}</span>` : "") + (B.blind ? `<span class="po">Сліпота</span>` : "") + (B.block ? `<span class="bl">Блок</span>` : "") + (B.shield ? `<span class="bl">Щит ${B.shield}</span>` : "") + S.buffs.map(b => `<span class="bf">${ITEMS[b.id].name.replace("Еліксир ", "")}</span>`).join("");
  h += `<div class="bstat"><div class="side"><div class="avatar sm">${esc(S.name[0])}</div><div class="bb"><b>${esc(S.name)} [${S.lvl}]</b><div class="bar hp"><div class="tr"><div class="fl" style="width:${S.hp / st.maxHp * 100}%"></div></div><span>${Math.ceil(S.hp)}/${st.maxHp}</span></div><div class="bar en"><div class="tr"><div class="fl" style="width:${S.en / st.maxEn * 100}%"></div></div><span>${Math.floor(S.en)}/${st.maxEn}</span></div>${maxMp() ? `<div class="bar mp"><div class="tr"><div class="fl" style="width:${(S.mp || 0) / maxMp() * 100}%"></div></div><span>${Math.floor(S.mp || 0)}/${maxMp()}</span></div>` : ""}${chips ? `<div class="fx-chips">${chips}</div>` : ""}</div></div>
    <div class="phase">${phase}</div>
    <div class="side r"><div class="bb"><b>${tg ? tg.name + " [" + tg.lvl + "]" : ""}</b>${tg ? `<div class="bar hp rev"><span>${Math.max(0, Math.ceil(tg.hp))}/${tg.maxHp}</span><div class="tr"><div class="fl" style="width:${Math.max(0, tg.hp) / tg.maxHp * 100}%"></div></div></div>` : ""}<div class="hint lm">раунд ${B.round}${tg && tg.arch ? " · " + (ARCHL[tg.arch] || "") : ""}${tg && tg.curse ? " · прокляття " + tg.curse : ""}${tg && tg.mark ? " · мітка " + tg.mark : ""}${tg && tg.hex ? " · порча " + tg.hex : ""}${tg && tg.pois ? " · отрута " + tg.pois : ""}</div></div></div></div>`;
  const PX = FORM.ally[0].x, PY = FORM.ally[0].y, PP = FORM.ally[B.petSlot || 3];
  if (B.pet){ const p = B.pet; h += `<div class="fighter petf${p.hp > 0 ? "" : " dead"}" id="f-pet" style="left:${PP.x}px;top:${PP.y}px;z-index:${Math.round(PP.y / 10)};scale:${PP.s}"><span class="sp">${sprite(p.type, 110, 96, 2.1, false)}</span><span class="nm">${p.name} [${p.lvl}]</span><span class="hb"><div style="width:${Math.max(0, p.hp) / p.maxHp * 100}%"></div></span></div>`; }
  h += `<div class="fighter pl" id="f-p" style="left:${PX}px;top:${PY}px"><span class="hfig">${heroArt(86)}<span class="lv">${S.lvl}</span></span><span class="nm">${esc(S.name)}</span><span class="hb"><div style="width:${S.hp / st.maxHp * 100}%"></div></span></div>`;
  if (B.phase === "choose"){
    const wd = tg && ownedWard(tg);
    const acts = [["hit","crossed-swords","Удар",""],["strong","sword-brandish","Сильний",sCost() + " ен."],["block","checked-shield","Блок","+15 ен."],["flee","run","Втекти",B.boss ? "25%" : "50%"]];
    if (wd) acts.push(["ward","ward","Оберіг",B.wardCd ? "через " + B.wardCd : ITEMS[wd].name.split(" ")[0]]);
    if (tal("w4")) acts.push(["rage","fist","Лють",B.rage ? "діє " + B.rage : "30 ен."]);
    if (tal("h4")) acts.push(["volley","arrow-cluster","Дощ стріл","35 ен."]);
    if (tal("m4")) acts.push(["dawn","sun","Світанок",B.dawn ? "вже було" : "30 ен."]);
    // вміння гілки — теж у колі; якщо не влазить, кільце має сторінки, як у «Кристалі»
    for (const id of skillsKnown()){ const k = SKILLS[id]; acts.push(["sk:" + id, k.icon, k.short, (k.cost.en ? k.cost.en + " ен." : k.cost.mp + " мана"), k.free]); }
    const PER = 8, pages = Math.ceil(acts.length / PER), pg = Math.min(UI.ringPage || 0, pages - 1), shown = pages > 1 ? acts.slice(pg * PER, pg * PER + PER) : acts;
    const N = shown.length;
    h += `<div class="ring" style="left:${PX}px;top:${PY}px">` + shown.map(([a, ic, l, sm, free], i) => { const ang = (-90 + i * 360 / N) * Math.PI / 180, isSk = a.startsWith("sk:"), dis = isSk ? !skillOk(a.slice(3)) : !actOk(a);
      const tip = isSk ? (SKILLS[a.slice(3)].name + ". " + SKILLS[a.slice(3)].text + (free ? " Не витрачає хід." : "")) : l;
      return `<button class="ract${a === "ward" ? " ward" : ""}${["rage","volley","dawn"].includes(a) ? " ult" : ""}${isSk ? " skill" : ""}${free || a === "rage" ? " free" : ""}" data-bact="${a}" style="left:${Math.cos(ang) * 112}px;top:${Math.sin(ang) * 112}px" ${dis ? "disabled" : ""} aria-label="${esc(tip)}" title="${esc(tip)}">${a === "ward" ? svg("ward", 18) : gi(ic, 20)}<span>${l}</span>${sm ? `<small>${sm}</small>` : ""}</button>`; }).join("")
      + (pages > 1 ? `<button class="rpage" data-rpage="1" aria-label="Наступна сторінка вмінь">${pg + 1}/${pages}</button>` : "") + `</div>`;
  }
  const n = B.enemies.length;
  B.enemies.forEach((e, i) => {
    const SP = FORM.enemyAt(formSlotOf(i)), x = SP.x, y = SP.y;
    h += `<button class="fighter${i === B.target ? " tg" : ""}${alive(e) ? "" : " dead"}" id="f-e${i}" data-tgt="${i}" style="left:${x}px;top:${y}px;z-index:${Math.round(y / 10)};scale:${SP.s}" ${alive(e) ? "" : "disabled"} aria-label="Ціль: ${e.name}"><span class="sp">${sprite(e.type, 130, 120, e.size > 1.45 ? 2.1 : e.size > 1.2 ? 2.5 : 3, true, `id="spr-e${i}"`)}<span class="lv">${e.lvl}</span>${e.stun ? `<span class="stun">оглушений</span>` : ""}</span><span class="nm">${e.fled ? "втік" : e.name}</span><span class="hb"><div style="width:${Math.max(0, e.hp) / e.maxHp * 100}%"></div></span></button>`;
  });
  h += `<div class="flist"><div class="fl self"><span class="lvc g">${S.lvl}</span><span class="w"><b>${esc(S.name)}</b><i><u style="width:${S.hp / st.maxHp * 100}%"></u></i></span></div>` +
    B.enemies.map((e, i) => `<button class="fl${i === B.target ? " tg" : ""}" data-tgt="${i}" ${alive(e) ? "" : "disabled"}><span class="lvc r">${e.lvl}</span><span class="w"><b>${e.name}</b><i><u style="width:${Math.max(0, e.hp) / e.maxHp * 100}%"></u></i></span></button>`).join("") + `</div>`;
  h += `<div class="bhint">${B.phase === "choose" ? "Ціль: клацніть по ворогу чи натисніть 1–5. Дія в колі. Зілля й сувої з пояса зліва: це теж хід." : ""}</div>`;
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
const bsleep = ms => sleep(S.opt && S.opt.fast ? ms * .4 : ms);
const weaponBlunt = () => { const w = S.equip.weapon; return !!(w && ITEMS[w] && ITEMS[w].blunt); };
const sCost = () => Math.max(8, 20 - 4 * tal("w2"));
function actOk(a){
  if (a === "strong") return S.en >= sCost();
  if (a === "rage") return tal("w4") && !B.rage && S.en >= 30 && (B.free || 0) < 2;
  if (a === "ward") return !B.wardCd;
  if (a === "flee") return !abilNoFlee();
  if (a === "volley") return tal("h4") && S.en >= 35;
  if (a === "dawn") return tal("m4") && !B.dawn && S.en >= 30;
  return true;
}
// один удар героя по цілі: звичайний, сильний або стріла з дощу стріл
function strike(tg, kind, me){
  const i = B.enemies.indexOf(tg);
  const mc = abilMissCheck(tg); if (mc){ fx(document.getElementById("f-e" + i), mc, "#ece6d8"); B.log.push([B.round, `${S.name} → ${tg.name}`, mc, "miss"]); return 0; }
  const extra = (kind === "strong" ? 8 : 0) + (tg.arch === "kiter" ? 8 : 0) + (tg.arch === "wisp" ? 12 : 0) + (tg.evade || 0);
  tg.heavy = kind === "strong" || weaponBlunt();
  const mult = (kind === "strong" ? 1.6 * (1 + .1 * tal("w2")) : kind === "volley" ? .7 : 1) * myDmgMul();
  const r = rollHit(B.hawk ? {...me, crit:(me.crit || 0) + 20} : me, tg.curse || tg.mark ? {...tg, def:tg.curse ? 0 : tg.def, agi:tg.mark ? -99 : tg.agi} : tg, mult, tg.mark ? 0 : extra);
  if (r.miss){ fx(document.getElementById("f-e" + i), "ухилення", "#ece6d8"); B.log.push([B.round, `${S.name} → ${tg.name}`, "ухилення", "miss"]); blog(`${tg.name} ухилився від вашого удару.`); return 0; }
  let d = r.dmg, note = "";
  if (tg.curse && !tg.sunder) d = Math.round(d * 1.2);
  d = Math.round(d * dmgTakenMul(tg) * physMul(tg, kind));
  if (tg.arch === "shielded" && kind !== "strong"){ d = Math.max(1, Math.round(d * .4)); note = "щит"; }
  hitEnemy(tg, d, "", null, r.crit); if (kind !== "volley") abilThorns(tg, d);
  B.log.push([B.round, `${S.name} → ${tg.name}`, "−" + d + (r.crit ? " крит" : "") + (note ? " " + note : ""), "hit"]);
  blog(`Ви ${kind === "strong" ? "сильно " : kind === "volley" ? "стрілою " : ""}вдарили ${tg.name}: −${d}${r.crit ? " (критичний!)" : ""}${note ? ". Щит тримає удар, бийте сильним" : ""}.`);
  return d;
}
function hitEnemy(e, d, label, col, crit){ if (e.eshield){ const ab = Math.min(e.eshield, d); e.eshield -= ab; d -= ab; if (ab) fx(document.getElementById("f-e" + B.enemies.indexOf(e)), "щит −" + ab, "#9fc2ea"); if (!d) return; } e.hp -= d; B.dealt += d; fx(document.getElementById("f-e" + B.enemies.indexOf(e)), "-" + d + (label ? " " + label : "") + (crit ? "!" : ""), col || (crit ? "#ffcf6b" : "#ff8a6b")); }
async function act(a, itemId){
  if (!B || B.phase !== "choose") return;
  const st = stats();
  if (a.startsWith("sk:")){ const id = a.slice(3), k = SKILLS[id]; if (!k || !skillOk(id)) return; if (k.free){ freeSkill(id); return; } }
  if (a === "rage"){ if (!actOk("rage") || (B.free || 0) >= 2) return; S.en -= 30; B.rage = 3; B.free = (B.free || 0) + 1; blog("Лють: 3 раунди удари на 35% сильніші. Хід ще ваш.", "good"); B.log.push([B.round, `${S.name}: лють`, "вільна дія", "heal"]); render(); return; }
  if (!a.startsWith("sk:") && !actOk(a)) return;
  if (a === "item" && (!itemId || !inv(itemId))) return;
  if (battleOver()){ endBattle(overResult()); return; }
  if (!alive(B.enemies[B.target])) B.target = B.enemies.findIndex(alive);
  const tg = B.enemies[B.target];
  let wardId = null; if (a === "ward"){ wardId = ownedWard(tg); if (!wardId) return; }
  B.phase = "resolve"; B.block = a === "block"; render();
  const me = {agi:st.agi, def:st.def, dmg:st.dmg, crit:st.crit};
  const pEl = () => document.getElementById("f-p");
  await bsleep(300);
  if (a === "hit" || a === "strong"){
    if (a === "strong") S.en -= sCost();
    strike(tg, a, me);
    if (alive(tg) && tal("h2") && Math.random() < .06 * tal("h2")){ await bsleep(250); blog("Подвійний удар!", "good"); strike(tg, "hit", me); }
  } else if (a.startsWith("sk:")){
    const id = a.slice(3), k = SKILLS[id]; payCost(k);
    if (id === "venom"){ const d0 = strike(tg, "hit", me); if (alive(tg) && d0 && poisonImmune(tg)) blog(`${tg.name}: отрута не діє на ${isK(tg.type, "undead") ? "нежить" : "камінь"}.`); else if (alive(tg) && d0){ tg.pois = 3; tg.poisD = Math.round(6 + S.lvl * 2.2); blog(`${tg.name} отруєний: −${tg.poisD} щораунду, 3 раунди.`, "good"); } }
    if (id === "bolt"){ const d = Math.round(spellPow() * rnd(90, 115) / 100 * dmgTakenMul(tg) * myDmgMul() * elemMul(tg, "bolt")); tg.heavy = true; hitEnemy(tg, d, "блискавка", "#9fd8ff"); B.log.push([B.round, `${S.name}: блискавка → ${tg.name}`, "−" + d, "hit"]); blog(`Блискавка б'є ${tg.name}: −${d}.`); }
    if (id === "fireball"){ const d = Math.round(spellPow() * 1.35 * dmgTakenMul(tg) * myDmgMul() * elemMul(tg, "fire")); tg.heavy = true; tg.burn = 3; hitEnemy(tg, d, "вогонь", "#ffb24a"); B.log.push([B.round, `${S.name}: вогняна куля → ${tg.name}`, "−" + d, "hit"]);
      for (const e of B.enemies) if (e !== tg && alive(e)){ const d2 = Math.round(d * .5 * elemMul(e, "fire") / elemMul(tg, "fire")); e.burn = 3; hitEnemy(e, d2, "опік", "#ffb24a"); } blog(`Вогняна куля: −${d} ${tg.name}, сусідів обпікає наполовину.`); }
    if (id === "mend"){
      if (B.allyTg === "pet" && B.pet && B.pet.hp > 0){ const ph = Math.round(B.pet.maxHp * .4 + st.wil * 5), p0 = B.pet.hp; B.pet.hp = Math.min(B.pet.maxHp, B.pet.hp + ph); const got = Math.round(B.pet.hp - p0); fx(document.getElementById("f-pet"), "+" + got, "#8fd18a");
        B.log.push([B.round, `${S.name}: зцілення → ${B.pet.name}`, "+" + got, "heal"]); blog(`Зцілення: ${B.pet.name} +${got} здоров'я.`, "good"); }
      else { const hv = Math.round(st.maxHp * .22 + st.wil * 5); S.hp = Math.min(st.maxHp, S.hp + hv); fx(pEl(), "+" + hv, "#8fd18a");
        B.log.push([B.round, `${S.name}: зцілення`, "+" + hv, "heal"]); blog(`Зцілення: +${hv} здоров'я.`, "good"); }
    }
  } else if (a === "rage"){
    S.en -= 30; B.rage = 3; fx(pEl(), "лють", "#ff8a5a"); B.log.push([B.round, `${S.name}: лють`, "+35% урону", "heal"]); blog("Лють: 3 раунди ваші удари на 35% сильніші.", "good");
  } else if (a === "volley"){
    S.en -= 35; blog("Дощ стріл накриває всіх ворогів.", "good");
    for (const e of B.enemies) if (alive(e)) strike(e, "volley", me);
  } else if (a === "dawn"){
    S.en -= 30; B.dawn = true; const hv = Math.round(st.maxHp * .35); S.hp = Math.min(st.maxHp, S.hp + hv); B.poison = 0;
    fx(pEl(), "+" + hv, "#ffe08a"); B.log.push([B.round, `${S.name}: світанок`, "+" + hv, "heal"]); blog(`Світанок: +${hv} здоров'я, отрута зникла.`, "good");
  } else if (a === "ward"){
    take(wardId);
    const d = Math.round((tg.maxHp * (tg.boss ? .05 : .1) + tg.lvl * 5) * spellMul() * elemMul(tg, "holy")); tg.heavy = true; tg.burn = 3; hitEnemy(tg, d, "оберіг", "#b7f0a0"); if (!tg.boss) tg.stun = 1; B.wardCd = 3;
    B.log.push([B.round, `${S.name}: ${ITEMS[wardId].name} → ${tg.name}`, "−" + d + " оглуш.", "heal"]);
    blog(`${ITEMS[wardId].name} пече ${tg.name}: −${d}, нечисть оглушена!`, "good"); renderBelt();
  } else if (a === "block"){
    S.en = Math.min(st.maxEn, S.en + 15); fx(pEl(), "блок", "#9fc2ea"); B.log.push([B.round, `${S.name}: блок`, "", "miss"]); blog("Ви стали в блок.");
  } else if (a === "item"){
    const it = ITEMS[itemId];
    if (B.allyTg === "pet" && petItemHeal(itemId)) renderBelt();
    else if (it.scroll){
      take(itemId);
      if (it.scroll === "heal"){ const hv = Math.round(st.maxHp * .3 * Math.min(1.6, spellMul())); S.hp = Math.min(st.maxHp, S.hp + hv); fx(pEl(), "+" + hv, "#8fd18a"); blog(`${it.name}: +${hv} здоров'я.`, "good"); B.log.push([B.round, `${S.name}: ${it.name}`, "+" + hv, "heal"]); }
      else if (it.scroll === "fire"){ const d = Math.round((40 + 8 * S.lvl) * spellMul() * elemMul(tg, "fire")); tg.heavy = true; tg.burn = 3; hitEnemy(tg, d, "вогонь", "#ffb24a"); blog(`${it.name} обпікає ${tg.name}: −${d}.`); B.log.push([B.round, `${S.name}: ${it.name} → ${tg.name}`, "−" + d, "hit"]); }
      else if (it.scroll === "shield"){ B.shield = 2; fx(pEl(), "щит", "#9fc2ea"); blog("Сувій щита: два раунди удари по вас слабші."); B.log.push([B.round, `${S.name}: ${it.name}`, "щит 2", "heal"]); }
      else if (it.scroll === "curse"){ tg.curse = 3; fx(document.getElementById("f-e" + B.target), "прокляття", "#c88aff"); blog(`${tg.name} проклятий: захист зник, урон по ньому +20%.`); B.log.push([B.round, `${S.name}: ${it.name} → ${tg.name}`, "прокляття", "hit"]); }
      else if (it.scroll === "storm"){ const d = Math.round((50 + 6 * S.lvl) * spellMul()); for (const e of B.enemies) if (alive(e)){ e.heavy = true; e.burn = 3; hitEnemy(e, Math.round(d * elemMul(e, "bolt")), "буря", "#9fd8ff"); } blog(`${it.name}: усім ворогам −${d}.`); B.log.push([B.round, `${S.name}: ${it.name}`, "−" + d + " усім", "hit"]); }
      else if (it.scroll === "ward"){ const d = Math.round((tg.maxHp * (tg.boss ? .05 : .1) + tg.lvl * 5) * spellMul() * elemMul(tg, "holy")); tg.heavy = true; tg.burn = 3; hitEnemy(tg, d, "оберіг", "#b7f0a0"); if (!tg.boss) tg.stun = 1; B.wardCd = 3; blog(`${it.name}: −${d}, ${tg.name} оглушений.`, "good"); B.log.push([B.round, `${S.name}: ${it.name}`, "−" + d, "heal"]); }
      else if (it.scroll === "tp"){ give(itemId, 1, true); blog("Сувій перенесення не діє в бою.", "warn"); }
      renderBelt();
    } else {
      const txt = useItem(itemId, true); fx(pEl(), txt, "#8fd18a"); B.log.push([B.round, `${S.name}: ${it.name}`, txt, "heal"]);
    }
  } else if (a === "flee"){
    if (Math.random() < (B.boss ? .25 : .5) * fleeMul()){ blog("Вам вдалося втекти!", "good"); endBattle("flee"); return; }
    blog("Втекти не вдалося!", "warn"); B.log.push([B.round, `${S.name}: спроба втечі`, "невдало", "miss"]);
  }
  refreshBars();
  await petTurn();
  for (const e of B.enemies) if (e.hp <= 0 && !e.deadLogged){
    if (e.rise && !e.risen && !e.heavy){ e.risen = true; e.hp = Math.round(e.maxHp * (e.boss ? .2 : .35)); await bsleep(300); fx(document.getElementById("f-e" + B.enemies.indexOf(e)), "повстає!", "#e8e0cc");
      blog(`${e.name} розсипався, але кістки знову зібралися (+${e.hp})! Добивайте сильним ударом, булавою, вогнем чи святою водою.`, "warn"); B.log.push([B.round, `${e.name} повстає`, "+" + e.hp, "hurt"]); refreshBars(); continue; }
    e.deadLogged = true; onEnemyDeath(e); abilDeath(e); await bsleep(300); blog(`${e.name} загинув.`, "good"); B.log.push([B.round, `${e.name} загинув`, "", "dead"]); const el = document.getElementById("f-e" + B.enemies.indexOf(e)); if (el) el.classList.add("dead"); }
  if (!B.enemies.some(alive)){ await bsleep(500); endBattle("win"); return; }
  // хід ворогів
  for (let i = 0; i < B.enemies.length; i++){
    const e = B.enemies[i]; if (!alive(e)) continue;
    await bsleep(500);
    if (e.curse) e.curse--; tickEnemyCurses(e);
    const eEl = () => document.getElementById("f-e" + i);
    if (e.regrow && e.hp < e.maxHp){
      if (e.burn) blog(`${e.name}: обпечені шиї не відростають.`);
      else { const hv = Math.round(e.maxHp * e.regrow); e.hp = Math.min(e.maxHp, e.hp + hv); fx(eEl(), "+" + hv, "#9fe08a"); blog(`${e.name}: відрубана голова відростає (+${hv}). Припечіть вогнем або сувоєм!`, "warn"); B.log.push([B.round, `${e.name}: голова відростає`, "+" + hv, "hurt"]); refreshBars(); }
    }
    if (e.burn) e.burn--;
    if (e.stun){ e.stun = 0; blog(`${e.name} оглушений і пропускає хід.`); B.log.push([B.round, e.name, "оглушений", "miss"]); continue; }
    if (e.arch === "thief" && e.stolen && Math.random() < .4){ e.fled = true; blog(`${e.name} втік з вашими грошима (${moneyTxt(e.stolen)})!${B.origin === "loc" && e.uid ? " Він ховається десь тут: наздоженіть і заберіть своє." : ""}`, "warn"); B.log.push([B.round, `${e.name} втік`, moneyTxt(e.stolen), "hurt"]); B.lostCop += e.stolen; render(); continue; }
    if ((e.arch === "summoner" || e.dboss) && B.round % (e.dboss ? 4 : 3) === 0 && B.enemies.filter(alive).length < 3){
      const type = e.summon || (pick(BESTIARY.filter(d => NODES[B.scene] && d.reg.includes(NODES[B.scene].reg || "") && d.tier === 1)) || {}).id || "chort";
      const add = mkEnemy(type, Math.max(1, e.lvl - 2), {}, null); add.hp = add.maxHp = Math.round(add.maxHp * (e.dboss ? .4 : .6)); add.xp = Math.round(add.xp * .4); add.drop = []; add.rise = false;
      B.enemies.push(add); discover(type); blog(`${e.name} кличе на поміч: ${add.name}!`, "warn"); B.log.push([B.round, `${e.name} кличе підмогу`, add.name, "hurt"]); render(); continue;
    }
    if (e.mend && Math.random() < .5){ const hurt = B.enemies.filter(o => o !== e && alive(o) && o.hp < o.maxHp * .6).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (hurt){ const hv = Math.round(hurt.maxHp * (hurt.boss ? .06 : .15)); hurt.hp = Math.min(hurt.maxHp, hurt.hp + hv); fx(document.getElementById("f-e" + B.enemies.indexOf(hurt)), "+" + hv, "#ffe08a"); blog(`${e.name} молиться над ${hurt.name}: +${hv} здоров'я.`, "warn"); B.log.push([B.round, `${e.name} лікує ${hurt.name}`, "+" + hv, "hurt"]); refreshBars(); continue; } }
    lunge(i);
    let mult = 1, fury = false; if ((e.boss || e.arch === "bruiser" || e.strong) && Math.random() < .25){ mult = 1.5; fury = true; }
    if (e.cleave && B.round % 3 === 0){ mult = Math.max(mult, 1.6); fury = true; }
    if (e.hex) mult *= .7;
    mult *= enemyRegMul(e) * abilPre(e, i);
    if (enemyPicksPet()){ const rp = rollHit(e, B.pet, mult); if (rp.miss){ fx(document.getElementById("f-pet"), "ухилення", "#ece6d8"); blog(`${B.pet.name} ухилився від ${e.name}.`); } else hurtPet(e, rp.dmg); refreshBars(); continue; }
    const r = rollHit(e, abilDefOf(e, e.arch === "caster" ? {agi:me.agi, def:0} : me), mult, (e.arch === "flyer" ? -5 : 0) + (st.dodge || 0));
    if (r.miss){ fx(pEl(), "ухилення", "#ece6d8"); B.log.push([B.round, `${e.name} → ${S.name}`, "ухилення", "miss"]); blog(`Ви ухилилися від удару ${e.name}.`); }
    else { let d = r.dmg; if (e.arch === "caster") d = Math.max(1, Math.round(d * magicCut()));
      if (B.block) d = Math.max(1, Math.round(d * Math.max(.19, .4 - .07 * tal("w3")))); else if (B.shield) d = Math.max(1, Math.round(d * .4));
      if (B.iron) d = Math.max(1, Math.round(d * .65));
      let ab = 0; if (B.absorb){ ab = Math.min(B.absorb, d); B.absorb -= ab; d -= ab; if (!B.absorb) blog("Щит мольфара розбився.", "warn"); }
      S.hp -= d; B.taken += d;
      const notes = []; if (ab) notes.push(`щит −${ab}`); if (fury) notes.push("лють"); if (B.block) notes.push("блок"); else if (B.shield) notes.push("щит"); if (e.arch === "caster") notes.push("магія");
      if (e.arch === "flyer"){ S.en = Math.max(0, S.en - 10); notes.push("−10 ен."); }
      if (e.drain){ S.en = Math.max(0, S.en - e.drain); notes.push(`−${e.drain} ен.`); }
      if (e.venom){ B.poison = Math.max(B.poison, 3); B.poisonDmg = Math.max(B.poisonDmg, Math.round(e.lvl * 1.6)); notes.push("отрута"); }
      if (e.lifesteal){ const hv = Math.round(d * e.lifesteal); e.hp = Math.min(e.maxHp, e.hp + hv); if (hv) notes.push(`п'є +${hv}`); }
      if (e.arch === "thief" && !e.stolen){ const s = Math.min(S.cop, 8 + e.lvl * 4); spend("theft", s); e.stolen = s; if (s) notes.push("вкрав " + moneyTxt(s)); }
      abilOnHit(e, d, notes);
      const note = notes.join(", ");
      fx(pEl(), "-" + d, "#ff6b5b"); B.log.push([B.round, `${e.name} → ${S.name}`, "−" + d + (note ? " " + note : ""), "hurt"]);
      blog(`${e.name} ${fury ? "люто " : ""}б'є вас: −${d}${note ? " (" + note + ")" : ""}.`); }
    abilSecond(e);
    refreshBars();
    if (S.hp <= 0){ await bsleep(500); endBattle("lose"); return; }
  }
  if (battleOver()){ await bsleep(500); endBattle(overResult()); return; }
  if (B.poison > 0){ const pd = Math.max(1, Math.round(B.poisonDmg * poisonCut())); S.hp -= pd; B.taken += pd; B.poison--; fx(pEl(), "-" + pd + " отрута", "#c88aff"); blog(`Отрута: −${pd}.`); refreshBars(); if (S.hp <= 0){ await bsleep(500); endBattle("lose"); return; } }
  if (B.shield) B.shield--;
  enemyDots(); abilRoundEnd(); refreshBars();
  if (S.hp <= 0){ await bsleep(500); endBattle("lose"); return; }
  for (const e of B.enemies) if (e.hp <= 0 && !e.deadLogged){ e.deadLogged = true; abilDeath(e); B.log.push([B.round, `${e.name} загинув`, "", "dead"]); const el = document.getElementById("f-e" + B.enemies.indexOf(e)); if (el) el.classList.add("dead"); }
  if (battleOver()){ await bsleep(500); endBattle(overResult()); return; }
  await bsleep(400);
  if (B.rage) B.rage--; tickMyBuffs(); if (B.wardCd) B.wardCd--;
  if (maxMp()) S.mp = Math.min(maxMp(), (S.mp || 0) + 6 + Math.floor(st.wil / 3));
  reinforce(); regRoundEnd();
  B.round++; B.phase = "choose"; B.timer = 20; S.en = Math.min(st.maxEn, S.en + Math.max(2, 6 + Math.floor(st.wil / 4) - (B.bog ? 3 : 0)));
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
      if (e.fled){ if (rt && e.uid){ const m = rt.mobs.find(x => x.uid === e.uid); if (m){ m.busy = false; m.stolen = e.stolen; } } continue; }
      xp += Math.round(e.xp * (S.lvl > e.lvl + 2 ? .35 : 1)); cop += ri(e.cop[0], e.cop[1]) + e.stolen;
      if (e.stolen) msg(`Ви повернули вкрадене: ${moneyTxt(e.stolen)}.`, "good");
      for (const [it, ch] of e.drop) if (it && Math.random() < ch){ give(it, 1, true); loot.push(it); }
      S.kills++; questKill(e); contractKill(e.type);
      if (rt && e.uid){ const m = rt.mobs.find(x => x.uid === e.uid); if (m){ m.dead = true; m.busy = false; m.respawn = performance.now() + (m.distBoss ? 1e12 : e.boss ? 150000 : e.strong ? 90000 : 40000); } }
      if (b.origin === "loc"){
        if (e.distBoss){ S.clears[S.loc] = (S.clears[S.loc] || 0) + 1; S.kc[S.loc] = 0; questEvent("clear", S.loc);
          msg(`Район ${NODES[S.loc].name} зачищено! Тепер тут сильніша нечисть і кращий лут (тір ${tierOf(S.loc)}).`, "good"); b.cleared = S.loc; }
        else if (!e.boss) S.kc[S.loc] = (S.kc[S.loc] || 0) + 1;
      }
    }
    for (const it of loot){ const q = questNeedsItem(it); if (q) msg(`Зібрано: ${ITEMS[it].name}, ${q}.`, "quest"); }
    earn("loot", cop); msg("Ви перемогли в бою!", "good");
    msg(`Ви отримали: ${[moneyTxt(cop), ...loot.map(i => ITEMS[i].name)].join(", ")}${xp && S.lvl < MAXLVL ? "; досвід +" + xp : ""}.`);
    gainXp(xp);
    if (b.origin === "loc") checkDistrictBoss(S.loc);
  } else {
    if (rt) for (const e of b.enemies) if (e.uid){ const m = rt.mobs.find(x => x.uid === e.uid); if (m){ m.busy = false; if (e.stolen) m.stolen = e.stolen; } }
    if (res === "gone") msg(b.lostCop ? `Бій завершено: ворог утік з вашими грошима (${moneyTxt(b.lostCop)}).` : "Бій завершено: ворог утік.", "warn");
    if (res === "lose"){ const lost = Math.floor(S.cop * .1); spend("death", lost); S.hp = 0; msg(`Ви загинули. Втрачено ${moneyTxt(lost)}.`, "warn"); }
  }
  if (b.pet && S.pets[b.pet.key]){ S.pets[b.pet.key].hp = Math.max(0, b.pet.hp); if (res === "win" && b.pet.hp > 0) petGainXp(b.pet.key, Math.round(xp * .6)); }
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
  while (S.lvl < MAXLVL && S.xp >= need(S.lvl)){ S.xp -= need(S.lvl); S.lvl++; const st = stats(); S.hp = st.maxHp; S.en = st.maxEn; S.mp = maxMp();
    msg(`Новий рівень: ${S.lvl}! Сила, спритність і витривалість зросли, здоров'я відновлене.`, "good");
    if (S.lvl === 6) msg("За Карпатами лежить Закарпаття: три дороги ведуть туди з Попелястих земель.", "quest");
    if (S.lvl === MAXLVL){ S.xp = 0; msg("Ви досягли найвищого рівня. Далі сила йде від спорядження, самоцвітів, ремесел, підземель і зачисток.", "good"); } }
}
function showSummary(b, res, xp, cop, loot){
  const win = res === "win", gone = res === "gone";
  const mine = `<div class="side-col"><div class="hd ${win ? "w" : gone ? "n" : "l"}">${win ? "Переможці" : gone ? "Ви" : "Переможені"}</div><div class="bx"><h4>${esc(S.name)} <span class="hint">[${S.lvl}]</span></h4>
    ${win && S.lvl < MAXLVL ? `<div class="kv"><span>Досвід</span><b>+${xp}</b></div>` : ""}<div class="kv"><span>Нанесено шкоди</span><b>${b.dealt}</b></div><div class="kv"><span>Отримано шкоди</span><b>${b.taken}</b></div><div class="kv"><span>Загинув</span><b>${win || gone ? "ні" : "так"}</b></div></div></div>`;
  const theirs = `<div class="side-col"><div class="hd ${win ? "l" : gone ? "n" : "w"}">${win ? "Переможені" : gone ? "Втекли" : "Переможці"}</div>${b.enemies.map(e => `<div class="bx"><h4>${e.name} <span class="hint">[${e.lvl}]</span></h4><div class="kv"><span>${e.fled ? "Втік з грошима" : "Залишок здоров'я"}</span><b>${e.fled ? moneyTxt(e.stolen) : Math.max(0, Math.ceil(e.hp)) + " / " + e.maxHp}</b></div></div>`).join("")}</div>`;
  const col = {hit:"var(--ink)", hurt:"var(--ember)", miss:"var(--muted)", heal:"var(--green)", dead:"var(--ink)"};
  const log = `<div class="logcol"><div class="sub">Лог бою</div><div class="blog">${b.log.map(([r, w, v, k]) => `<div><span class="hint">р. ${r}</span><span class="${k === "dead" ? "bd" : ""}">${w}</span><span class="v" style="color:${col[k]}">${v}</span></div>`).join("")}</div></div>`;
  const lootH = win ? `<div class="loot"><span class="lbl">Здобич</span>${loot.map(i => { const q = questNeedsItem(i); return `<span class="${q ? "a" : ""}${ITEMS[i].rare ? " rare" : ""}">${ITEMS[i].name}${q ? ": квест " + q : ""}</span>`; }).join("")}<span>${moneyTxt(cop)}</span>${S.lvl < MAXLVL ? `<span>+${xp} досвіду</span>` : ""}${b.lostCop ? `<span class="a">втрачено ${moneyTxt(b.lostCop)}</span>` : ""}${b.cleared ? `<span class="a">район зачищено</span>` : ""}</div>`
    : gone ? `<div class="warn">Ворог утік${b.lostCop ? ` з вашими грошима (${moneyTxt(b.lostCop)})` : ""}.${b.origin === "loc" && b.enemies.some(e => e.fled && e.uid) ? " Він досі на цій локації: переможіть його, щоб повернути гроші." : ""}</div>`
    : `<div class="warn">Ви втратили 10% грошей і отямитеся в найближчому місті.</div>`;
  openModal(`<div class="mbox wide"><div class="mhead"><h2>Підсумки бою</h2><span class="hint">${esc(S.name)} проти ${b.enemies.map(e => `${e.name} [${e.lvl}]`).join(", ")} · раундів: ${b.round}</span></div>
    <div class="sumrow">${mine}${log}${theirs}</div>
    <div class="sumfoot">${lootH}<button class="btn p big" data-act="sumok">Далі</button></div></div>`, true);
}
