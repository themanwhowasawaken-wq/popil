/* ============ вміння, мана, пети, підмога в бою ============ */
// free: вміння на себе (баф) чи на ворога (прокляття) не витрачає хід — далі ще можна вдарити. До 2 таких дій за раунд.
const SKILLS = {
  // воїн: енергія
  cry:{short:"Клич", br:"war", lvl:3, name:"Бойовий клич", icon:"barbarian", cost:{en:20}, free:true, kind:"buff", text:"3 раунди ваші удари на 30% сильніші."},
  iron:{short:"Шкіра", br:"war", lvl:5, name:"Залізна шкіра", icon:"shield", cost:{en:20}, free:true, kind:"buff", text:"2 раунди вся шкода по вас на 35% менша."},
  sunder:{short:"Розтрощ.", br:"war", lvl:7, name:"Розтрощити обладунок", icon:"warhammer", cost:{en:15}, free:true, kind:"curse", text:"3 раунди ціль без захисту й отримує на 20% більше."},
  // мисливець: енергія
  hawk:{short:"Око", br:"hunt", lvl:3, name:"Око яструба", icon:"eye-target", cost:{en:15}, free:true, kind:"buff", text:"3 раунди +20% до криту."},
  mark:{short:"Мітка", br:"hunt", lvl:5, name:"Мітка мисливця", icon:"crossbow", cost:{en:15}, free:true, kind:"curse", text:"3 раунди ціль не ухиляється й отримує на 25% більше."},
  venom:{short:"Отрута", br:"hunt", lvl:7, name:"Отруйна стріла", icon:"scorpion-tail", cost:{en:20}, kind:"attack", text:"Удар і отрута на 3 раунди."},
  // мольфар: мана
  bolt:{short:"Блискавка", br:"myst", lvl:3, name:"Блискавка", icon:"magic-swirl", cost:{mp:15}, kind:"attack", text:"Удар чарами крізь будь-який захист. Сильніша від волі."},
  ward_sh:{short:"Щит", br:"myst", lvl:3, name:"Щит мольфара", icon:"shield-reflect", cost:{mp:20}, free:true, kind:"buff", text:"Щит, що поглинає шкоду, поки не розіб'ється."},
  hex:{short:"Порча", br:"myst", lvl:5, name:"Порча", icon:"skull-staff", cost:{mp:15}, free:true, kind:"curse", text:"3 раунди ціль б'є на 30% слабше й отримує на 15% більше."},
  mend:{short:"Зцілення", br:"myst", lvl:6, name:"Зцілення", icon:"heart-bottle", cost:{mp:25}, kind:"heal", text:"Лікує вас або пета: ви обираєте."},
  fireball:{short:"Вогонь", br:"myst", lvl:8, name:"Вогняна куля", icon:"fire", cost:{mp:35}, kind:"attack", text:"Б'є ціль і обпікає сусідів наполовину."},
};
const skillsKnown = () => S.branch ? Object.entries(SKILLS).filter(([, k]) => k.br === S.branch && S.lvl >= k.lvl).map(([id]) => id) : [];
const maxMp = () => S.branch === "myst" ? 40 + 7 * S.lvl + stats().wil * 5 : 0;
const spellPow = () => (12 + 5 * S.lvl + stats().wil * 2.5) * spellMul();
const BUFF_OF = {cry:"cry", iron:"iron", hawk:"hawk", ward_sh:"absorb"};
function skillOk(id){
  const k = SKILLS[id]; if (!k || !B || B.phase !== "choose") return false;
  if (k.cost.en && S.en < k.cost.en) return false; if (k.cost.mp && (S.mp || 0) < k.cost.mp) return false;
  if (k.free && (B.free || 0) >= 2) return false;
  const tg = B.enemies[B.target];
  if (BUFF_OF[id] && B[BUFF_OF[id]] && !(B.pet && B.pet.hp > 0 && !B.pet[BUFF_OF[id]])) return false;
  if (k.kind === "curse" && (!tg || !alive(tg) || tg[id])) return false;
  return true;
}
function payCost(k){ if (k.cost.en) S.en -= k.cost.en; if (k.cost.mp) S.mp = (S.mp || 0) - k.cost.mp; }
// вільна дія: баф чи прокляття — хід лишається
function freeSkill(id){
  const k = SKILLS[id]; if (!skillOk(id)) return; payCost(k); B.free = (B.free || 0) + 1;
  const tg = B.enemies[B.target], toPet = B.allyTg === "pet" && B.pet && B.pet.hp > 0 && !B.pet[BUFF_OF[id]], who = toPet ? B.pet : null;
  if (id === "cry"){ if (who){ who.cry = 3; blog(`Бойовий клич: ${who.name} 3 раунди б'є на 30% сильніше. Хід ще ваш.`, "good"); } else { B.cry = 3; blog("Бойовий клич: 3 раунди удари на 30% сильніші. Хід ще ваш.", "good"); } }
  if (id === "iron"){ if (who){ who.iron = 2; blog(`Залізна шкіра: 2 раунди шкода по ${who.name} на 35% менша. Хід ще ваш.`, "good"); } else { B.iron = 2; blog("Залізна шкіра: 2 раунди шкода по вас на 35% менша. Хід ще ваш.", "good"); } }
  if (id === "hawk"){ if (who){ who.hawk = 3; blog(`Око яструба: ${who.name} +20% до криту на 3 раунди. Хід ще ваш.`, "good"); } else { B.hawk = 3; blog("Око яструба: +20% до криту на 3 раунди. Хід ще ваш.", "good"); } }
  if (id === "ward_sh"){ const ab = Math.round(30 + 9 * S.lvl + stats().wil * 4); if (who){ who.absorb = ab; blog(`Щит мольфара на ${who.name} поглине ${ab} шкоди. Хід ще ваш.`, "good"); } else { B.absorb = ab; blog(`Щит мольфара поглине ${ab} шкоди. Хід ще ваш.`, "good"); } }
  if (id === "sunder"){ tg.sunder = 3; tg.curse = Math.max(tg.curse || 0, 3); blog(`${tg.name}: обладунок розтрощено на 3 раунди. Бийте!`, "good"); }
  if (id === "mark"){ tg.mark = 3; blog(`${tg.name} під міткою: 3 раунди не ухиляється й отримує на 25% більше.`, "good"); }
  if (id === "hex"){ tg.hex = 3; blog(`Порча на ${tg.name}: б'є слабше й отримує більше 3 раунди.`, "good"); }
  B.log.push([B.round, `${S.name}: ${k.name}${k.kind === "curse" ? " → " + tg.name : who ? " → " + who.name : ""}`, "вільна дія", "heal"]);
  render(); fx(k.kind === "curse" ? document.getElementById("f-e" + B.target) : document.getElementById(toPet ? "f-pet" : "f-p"), k.name.toLowerCase(), k.kind === "curse" ? "#c88aff" : "#ffd27a");
}
// множник шкоди по ворогу від проклять і бафів
const dmgTakenMul = e => (e.sunder ? 1.2 : 1) * (e.mark ? 1.25 : 1) * (e.hex ? 1.15 : 1) * (hasA(e, "armor") && !e.heavy && !weaponBlunt() ? .8 : 1);
const myDmgMul = () => (B.rage ? 1.35 : 1) * (B.cry ? 1.3 : 1) * (B.weak ? .8 : 1);

/* ---------------- пети ---------------- */
Object.assign(MOBS, {
  pet_wolf:{name:"Вовк", arch:"chaser", p:{}, design:D("beast","#8a8278","#4a443e","#ffd06a",["claws","tail","fangs"])},
  pet_lynx:{name:"Рись", arch:"chaser", p:{}, design:D("beast","#c09a62","#5a4024","#c8f07a",["claws","fangs"],{size:.95})},
  pet_bear:{name:"Ведмідь", arch:"bruiser", p:{}, design:D("beast","#5a3e26","#2a1c10","#ffb04a",["claws","fangs"],{size:1.35})},
});
const PETS = {
  wolf:{type:"pet_wolf", name:"Бойовий вовк", lvl:3, price:2500, hp:1, dmg:1, agi:4, text:"Швидкий і злий. Б'є часто, іноді кусає двічі.", twice:.2},
  lynx:{type:"pet_lynx", name:"Карпатська рись", lvl:5, price:6000, hp:.8, dmg:1.3, agi:9, text:"Ухиляється від ударів і рве до крові: часті крити.", crit:15},
  bear:{type:"pet_bear", name:"Бойовий ведмідь", lvl:7, price:12000, hp:1.9, dmg:.9, agi:0, text:"Важкий і товстий. Відтягує удари ворогів на себе.", taunt:.55},
};
function petStats(key){
  const P = PETS[key], o = S.pets[key], L = o.lvl;
  return {key, type:P.type, name:P.name, lvl:L, maxHp:Math.round((50 + 26 * L) * P.hp), dmg:[Math.round((5 + 4.4 * L) * P.dmg), Math.round((8 + 5.4 * L) * P.dmg)], def:Math.round(L * 1.3 * P.hp), agi:2 + L * .6 + P.agi, crit:P.crit || 0, taunt:P.taunt || 0, twice:P.twice || 0};
}
const petNeed = L => 70 + 45 * L;
function petGainXp(key, x){
  const o = S.pets[key]; if (!o) return; if (o.lvl >= S.lvl){ o.xp = 0; return; }
  o.xp += x; while (o.lvl < S.lvl && o.xp >= petNeed(o.lvl)){ o.xp -= petNeed(o.lvl); o.lvl++; o.hp = petStats(key).maxHp; msg(`${PETS[key].name} виріс до ${o.lvl} рівня!`, "good"); }
}
function healPets(){ for (const k of Object.keys(S.pets || {})) S.pets[k].hp = petStats(k).maxHp; }
function openPets(){
  const rows = Object.entries(PETS).map(([k, P]) => {
    const own = S.pets[k], st = own ? petStats(k) : null, act = S.pet === k;
    const btn = own ? (act ? `<button class="btn" data-pet="off">Залишити вдома</button>` : `<button class="btn p" data-pet="use:${k}">Брати в бій</button>`)
      : `<button class="btn p" data-pet="buy:${k}" ${S.lvl < P.lvl || S.cop < P.price ? "disabled" : ""}>Купити · ${moneyTxt(P.price)}</button>`;
    return `<div class="petrow${act ? " on" : ""}"><span class="pic">${sprite(P.type, 88, 80, 1.5, false)}</span><div class="tx"><b>${P.name}${own ? ` · ${own.lvl} рівень` : ""}</b><span>${P.text}</span>
      <span class="hint">${own ? `Здоров'я ${Math.ceil(own.hp)}/${st.maxHp} · удар ${st.dmg[0]}–${st.dmg[1]} · досвід ${own.lvl >= S.lvl ? "росте разом з вами" : own.xp + "/" + petNeed(own.lvl)}${own.hp <= 0 ? " · поранений: вилікуйте в цілителя" : ""}` : `Потрібен ${P.lvl} рівень`}</span></div>${btn}</div>`; }).join("");
  openModal(`<div class="mbox" style="width:640px">${mhead("Звіринець")}<p class="hint" style="margin:0 0 10px">Пет іде з вами в кожен бій, б'є вашу ціль і росте з досвідом. Поранений пет не б'ється, доки його не вилікує цілитель чи відпочинок.</p><div class="petlist">${rows}</div></div>`);
}
function petAction(a){
  if (a === "off"){ S.pet = null; msg("Пет лишився вдома."); }
  else if (a.startsWith("use:")){ S.pet = a.slice(4); msg(`${PETS[S.pet].name} іде з вами.`, "good"); }
  else if (a.startsWith("buy:")){ const k = a.slice(4), P = PETS[k]; if (S.pets[k] || S.lvl < P.lvl || S.cop < P.price) return;
    spend("pets", P.price); S.pets[k] = {lvl:Math.min(S.lvl, P.lvl + 1), xp:0, hp:0}; S.pets[k].hp = petStats(k).maxHp; S.pet = k; msg(`Ви придбали: ${P.name}. Він уже з вами.`, "good"); }
  save(); renderTop(); openPets();
}
// у бою
function petJoin(){ if (!S.pet || !S.pets[S.pet] || S.pets[S.pet].hp <= 0) return null; const st = petStats(S.pet); return Object.assign(st, {hp:Math.min(st.maxHp, S.pets[S.pet].hp)}); }
async function petTurn(){
  const p = B.pet; if (!p || p.hp <= 0 || !B.enemies.some(alive)) return;
  let tg = B.enemies[B.target]; if (!alive(tg)) tg = B.enemies.find(alive); if (!tg) return;
  await bsleep(350);
  const hits = Math.random() < p.twice ? 2 : 1;
  for (let k = 0; k < hits && alive(tg); k++){
    const r = rollHit(p.hawk ? {...p, crit:(p.crit || 0) + 20} : p, tg.mark ? {...tg, agi:-99} : tg, 1);
    const el = document.getElementById("f-pet"); if (el){ el.classList.add("atk"); setTimeout(() => el.classList.remove("atk"), 380); }
    if (r.miss){ fx(document.getElementById("f-e" + B.enemies.indexOf(tg)), "ухилення", "#ece6d8"); B.log.push([B.round, `${p.name} → ${tg.name}`, "ухилення", "miss"]); continue; }
    const d = Math.max(1, Math.round(r.dmg * dmgTakenMul(tg) * (p.cry ? 1.3 : 1)));
    hitEnemy(tg, d, "", "#ffd08a", r.crit); B.log.push([B.round, `${p.name} → ${tg.name}`, "−" + d + (r.crit ? " крит" : ""), "hit"]);
    blog(`${p.name} ${k ? "кусає ще раз" : "рве " + tg.name}: −${d}${r.crit ? " (крит)" : ""}.`);
  }
  refreshBars();
}
// кого б'є ворог: героя чи пета
const enemyPicksPet = () => B.pet && B.pet.hp > 0 && Math.random() < clamp((B.pet.taunt || .3) + petSlotTaunt(), .05, .85);
function hurtPet(e, d){
  const p = B.pet, el = document.getElementById("f-pet");
  if (p.iron) d = Math.max(1, Math.round(d * .65));
  if (p.absorb){ const ab = Math.min(p.absorb, d); p.absorb -= ab; d -= ab; if (!p.absorb) blog(`Щит на ${p.name} розбився.`, "warn"); if (!d){ fx(el, "щит −" + ab, "#9fc2ea"); return; } }
  p.hp -= d;
  fx(el, "-" + d, "#ff6b5b"); B.log.push([B.round, `${e.name} → ${p.name}`, "−" + d, "hurt"]); blog(`${e.name} б'є ${p.name}: −${d}.`);
  if (el){ const hb = el.querySelector(".hb div"); if (hb) hb.style.width = Math.max(0, p.hp) / p.maxHp * 100 + "%"; }
  if (p.hp <= 0){ p.hp = 0; blog(`${p.name} падає поранений. Його треба вилікувати.`, "warn"); B.log.push([B.round, `${p.name} поранений`, "", "dead"]); if (el) el.classList.add("dead"); }
}
// підмога ворогам: моби з локації підтягуються до бою, як у «Кристалі»
function reinforce(){
  if (!B || B.origin !== "loc" || B.round < 2 || B.noHelp) return;
  if (B.enemies.filter(alive).length >= 5 || B.joined >= 3) return;
  const rt = locRT(S.loc); if (!rt) return;
  const first = B.enemies[0];
  const cand = rt.mobs.filter(m => !m.dead && !m.busy && !m.distBoss && !(m.st && m.st.boss) && (m.type === first.type || (m.st && (m.st.aggro || m.st.pack))));
  if (!cand.length || Math.random() > (B.boss ? .35 : .25)) return;
  const m = pick(cand); m.busy = true; B.joined = (B.joined || 0) + 1;
  const e = mkEnemy(m.type, m.lvl, {elite:m.elite, tier:m.tier}, m.uid); B.enemies.push(e); discover(m.type);
  blog(`${e.name} [${e.lvl}] приєднується до бою!`, "warn"); B.log.push([B.round, `${e.name} приєднався`, "", "hurt"]);
}
// дії, що тривають у ворогів: отрута від стріли
function enemyDots(){
  for (const e of B.enemies) if (alive(e) && e.pois && !poisonImmune(e)){ const d = e.poisD || 10; e.hp -= d; B.dealt += d; e.pois--; fx(document.getElementById("f-e" + B.enemies.indexOf(e)), "-" + d + " отрута", "#9fe08a"); if (e.hp <= 0) blog(`${e.name} помирає від отрути.`, "good"); }
}
function tickEnemyCurses(e){ for (const k of ["sunder","mark","hex"]) if (e[k]) e[k]--; }
function tickMyBuffs(){ for (const k of ["cry","iron","hawk"]) if (B[k]) B[k]--; if (B.pet) for (const k of ["cry","iron","hawk"]) if (B.pet[k]) B.pet[k]--; B.free = 0; B.allyTg = null; }
// панель умінь під героєм
function skillBar(){
  const ids = skillsKnown(); if (!ids.length) return "";
  return `<div class="skbar">${ids.map(id => { const k = SKILLS[id], ok = skillOk(id), c = k.cost.en ? k.cost.en + " ен." : k.cost.mp + " мани";
    return `<button class="sk${k.free ? " free" : ""}" data-bact="sk:${id}" ${ok ? "" : "disabled"} title="${esc(k.name + ". " + k.text + (k.free ? " Не витрачає хід." : ""))}">${gi(k.icon, 24)}<b>${k.name}</b><small>${c}${k.free ? " · хід лишається" : ""}</small></button>`; }).join("")}</div>`;
}
