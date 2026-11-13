/* ============ уміння кожного моба ============ */
const ABIL_INFO = {
  ambush:["Засідка", "Нападає першим, ще до вашого ходу."],
  charge:["Розгін", "Перший удар у бою в 1,8 раза сильніший."],
  bleed:["Рве до крові", "Удар може відкрити кровотечу: 3 раунди шкоди."],
  burn:["Палить", "Удар підпалює: 2 раунди шкоди вогнем."],
  stunhit:["Приголомшує", "Удар може приголомшити: −25 енергії."],
  sunder:["Трощить броню", "Удар може зім'яти обладунок: 2 раунди ваш захист на 40% менший."],
  weaken:["Порча", "Удар може наслати слабкість: 2 раунди ви б'єте на 20% слабше."],
  blind:["Сліпить", "Удар може засліпити: ваш наступний удар з шансом 50% мимо."],
  drag:["Тягне на дно", "Хапає й тягне: 2 раунди не втекти, −10 енергії."],
  web:["Павутина", "На початку бою обплутує: 2 раунди не втекти й не ухилитися."],
  multihit:["Два удари", "Б'є двічі за хід, другий удар слабший."],
  pierce:["Пробиває броню", "Удар ігнорує половину вашого захисту."],
  enrage:["Лють", "Коли здоров'я менше третини, б'є на 40% сильніше."],
  heal_low:["Друге дихання", "Раз за бій, коли здоров'я менше 40%, лікується на 30%."],
  thorns:["Колючий", "Віддає вам 15% шкоди від кожного вашого удару зблизька."],
  spellward:["Чаростійкий", "Чари, сувої й обереги б'ють його вдвічі слабше."],
  phase:["Безтілесний", "Кожен третій ваш удар проходить крізь нього."],
  split:["Розпадається", "Гинучи, розлітається на двох менших."],
  howl:["Кличе своїх", "Поранений кличе ще одного такого самого."],
  fear:["Жах", "На початку бою лякає: −20 енергії."],
  frog:["Жаб'яча шкура", "Гинучи, обертається на жабу, яку теж треба добити."],
  rise:["Повстає", "Встає ще раз після звичайного удару."],
};
const ABIL = {
  // Землі Кабаллону
  forest_wolf:["howl"], boar:["charge"], thief:["ambush"], tiger:["ambush","bleed"], spark:["burn"], zombie:["stunhit"], drowned:["drag"],
  scorpion:["ambush","venom"], jal_king:["venom","sunder"], soldier:["stunhit"], order_mage:["burn"], rabble_mage:["weaken"], rabble_hunter:["pierce"],
  villain:["enrage"], ghost_mage:["phase","spellward"], gargoyle:["spellward","thorns"], hunter_spider:["web","venom"], troll:["heal_low","enrage"],
  merman:["howl"], chosen_merman:["drag"], black_knight:["sunder","enrage"],
  // Попелясті землі
  rat:["bleed"], golem:["thorns"], wolf:["howl"], frog:["blind"], marauder:["ambush"], skel:["pierce"], warden:["stunhit","sunder"],
  wolf2:["bleed"], alpha:["howl","enrage"], whisper:["weaken","phase"], cultist:["weaken"], shade:["fear","phase"],
  // Закарпаття (нечисть)
  chort:["multihit"], kazhan:["bleed"], mavka:["weaken"], pavuk:["web"], lisovyk:["heal_low"], pesyholovets:["howl","bleed"], vovkulaka:["enrage","bleed"],
  nichnytsia:["blind"], mara:["fear","phase"], chuhaister:["multihit","stunhit"], skarbnyk:["thorns"], aridnyk:["burn","weaken"], lykho:["fear","enrage"],
  vartovyi:["stunhit"], niavka:["pierce"], perelesnyk:["burn","phase"], upyr:["lifesteal","heal_low"], kistiak:["rise"], zlydni:["split"], vidma:["weaken","frog"],
  upyrytsia:["weaken","lifesteal"], vampir:["lifesteal","multihit"], potercha:["blind","phase"], bolotianyk:["drag"], blud:["blind","drag"],
  bosorkun:["pierce","weaken"], vodianyk:["drag","heal_low"], rusalka:["drag","weaken"],
  // Кістяна Марка
  mk_warrior:["stunhit"], mk_hound:["bleed"], mk_spear:["pierce"], mk_swarm:["split"], mk_watcher:["enrage"], mk_crow:["blind"], mk_knight:["sunder"],
  mk_archer:["pierce"], mk_voivode:["howl"], mk_bellringer:["stunhit","weaken"], mk_giant:["stunhit"], mk_mage:["spellward"], mk_necro:["weaken"],
  mk_skullpile:["fear"], mk_bone_king:["sunder"],
  // Чорна Трясовина
  bg_leech:["bleed"], bg_frogman:["howl","pierce"], bg_giant_leech:["drag"], bg_wisp:["blind"], bg_frog_shaman:["weaken"], bg_peat:["burn","thorns"],
  bg_willow:["drag"], bg_witch:["weaken"], bg_serpent:["ambush"], bg_eldest:["fear"], bg_drowned:["drag"], bg_midge:["split"], bg_monk:["weaken"],
  bg_hydra:["multihit"], bg_hydra_mother:["multihit"], bg_leech_queen:["enrage"], bg_abbot:["drag"],
  // Землі Світанку й Ночі
  or_dead_knight:["sunder"], or_dawn_knight:["blind"], or_night_knight:["bleed"], or_warhound:["bleed"], or_dawn_cleric:["burn"], or_martyr:["weaken"],
  or_squire:["howl","multihit"], or_night_archer:["pierce"], or_ghost_horse:["phase"], or_bannerman:["fear"], or_grave_lord:["thorns"],
  or_champion:["charge","enrage"], or_bats:["bleed"],
  // боси підземель
  crypt_captain:["stunhit"], dark_magister:["spellward","burn"], abyss_lord:["fear","burn"], or_magister:["blind","heal_low"], or_castellan:["enrage"],
};
// частина вмінь — це вже наявні механіки рушія
const ENGINE_ABIL = {venom:1, lifesteal:.2, rise:1};
const hasA = (e, k) => !!(ABIL[e.type] && ABIL[e.type].includes(k));
// при створенні ворога
const mkEnemy0 = mkEnemy;
mkEnemy = function(type, lvl, o = {}, uid = null){
  const e = mkEnemy0(type, lvl, o, uid);
  for (const k of ABIL[type] || []) if (ENGINE_ABIL[k] && !e[k]) e[k] = ENGINE_ABIL[k];
  if (hasA(e, "spellward")) e.spellward = true;
  return e;
};
// перед першим ходом
function abilStart(){
  for (const e of B.enemies){
    if (hasA(e, "fear")){ S.en = Math.max(0, S.en - 20); blog(`${e.name} наводить жах: −20 енергії.`, "warn"); }
    if (hasA(e, "web")){ B.web = 2; blog(`${e.name} обплутує вас павутиною: 2 раунди не втекти й не ухилитися.`, "warn"); }
    if (hasA(e, "ambush")){ const st = stats(), r = rollHit(e, {agi:st.agi, def:st.def}, 1);
      if (!r.miss){ S.hp = Math.max(1, S.hp - r.dmg); B.taken += r.dmg; B.log.push([0, `${e.name} із засідки`, "−" + r.dmg, "hurt"]); blog(`${e.name} нападає із засідки: −${r.dmg}.`, "warn"); }
      else blog(`${e.name} кидається із засідки, але ви ухиляєтесь.`); }
  }
}
// ваш удар по ворогу: безтілесні, сліпота
function abilMissCheck(tg){
  if (B.blind){ B.blind = 0; if (Math.random() < .5){ blog("Ви осліплені: удар мимо.", "warn"); return "сліпота"; } }
  if (hasA(tg, "phase")){ tg.phc = (tg.phc || 0) + 1; if (tg.phc % 3 === 0){ blog(`Удар проходить крізь ${tg.name}.`); return "крізь"; } }
  return null;
}
function abilThorns(tg, d){
  if (!hasA(tg, "thorns") || d <= 0) return; const r = Math.max(1, Math.round(d * .15)); S.hp = Math.max(1, S.hp - r); B.taken += r;
  fx(document.getElementById("f-p"), "-" + r + " шипи", "#ff9a6b"); blog(`${tg.name} колючий: −${r} вам.`);
}
// хід ворога: що він робить до удару і наскільки сильно б'є
function abilPre(e, i){
  let m = 1;
  if (hasA(e, "heal_low") && !e.healed && e.hp < e.maxHp * .4){ e.healed = true; const hv = Math.round(e.maxHp * .3); e.hp += hv; fx(document.getElementById("f-e" + i), "+" + hv, "#9fe08a"); blog(`${e.name}: друге дихання, +${hv}.`, "warn"); }
  if (hasA(e, "enrage") && e.hp < e.maxHp / 3){ m *= 1.4; if (!e.raged){ e.raged = true; blog(`${e.name} лютує!`, "warn"); } }
  if (hasA(e, "charge") && !e.charged){ e.charged = true; m *= 1.8; blog(`${e.name} бере розгін!`, "warn"); }
  if (hasA(e, "howl") && !e.howled && e.hp < e.maxHp * .5 && B.enemies.filter(alive).length < 5){ e.howled = true;
    const add = mkEnemy(e.type, Math.max(1, e.lvl - 1), {}, null); add.hp = add.maxHp = Math.round(add.maxHp * .6); add.xp = Math.round(add.xp * .5); add.drop = []; delete add.rise;
    add.howled = true; B.enemies.push(add); blog(`${e.name} кличе своїх: прибігає ${add.name}!`, "warn"); B.log.push([B.round, `${e.name} кличе своїх`, add.name, "hurt"]); render(); }
  return m;
}
// захист героя проти цього удару
function abilDefOf(e, me){
  let def = me.def; if (B.armBreak) def *= .6; if (hasA(e, "pierce")) def *= .5;
  return {...me, def, agi:B.web ? -99 : me.agi};
}
// після влучання по герою
function abilOnHit(e, d, notes){
  const ch = p => Math.random() < p;
  if (hasA(e, "bleed") && ch(.4)){ B.bleed = 3; B.bleedD = Math.max(B.bleedD || 0, Math.round(4 + e.lvl * 1.5)); notes.push("кровотеча"); }
  if (hasA(e, "burn") && ch(.5)){ B.burnMe = 2; B.burnD = Math.max(B.burnD || 0, Math.round(5 + e.lvl * 1.6)); notes.push("опік"); }
  if (hasA(e, "stunhit") && ch(.25)){ S.en = Math.max(0, S.en - 25); notes.push("−25 ен."); }
  if (hasA(e, "sunder") && ch(.3)){ B.armBreak = 2; notes.push("броня зім'ята"); }
  if (hasA(e, "weaken") && ch(.3)){ B.weak = 2; notes.push("слабкість"); }
  if (hasA(e, "blind") && ch(.3)){ B.blind = 1; notes.push("сліпота"); }
  if (hasA(e, "drag") && ch(.35)){ B.held = 2; S.en = Math.max(0, S.en - 10); notes.push("тягне на дно"); }
}
// другий удар за хід
function abilSecond(e){
  if (!hasA(e, "multihit") || S.hp <= 0) return;
  const st = stats(), r = rollHit(e, abilDefOf(e, {agi:st.agi, def:st.def}), .6);
  if (r.miss){ blog(`${e.name} б'є вдруге, але мимо.`); return; }
  let d = r.dmg; if (B.block) d = Math.max(1, Math.round(d * .4)); if (B.iron) d = Math.round(d * .65);
  if (B.absorb){ const ab = Math.min(B.absorb, d); B.absorb -= ab; d -= ab; }
  S.hp -= d; B.taken += d; fx(document.getElementById("f-p"), "-" + d, "#ff6b5b"); B.log.push([B.round, `${e.name} → ${S.name} (ще раз)`, "−" + d, "hurt"]); blog(`${e.name} б'є вдруге: −${d}.`);
}
// кінець раунду: кровотеча, опік, ефекти спадають
function abilRoundEnd(){
  for (const [k, kd, nm, col] of [["bleed","bleedD","кровотеча","#ff6b5b"],["burnMe","burnD","опік","#ffb24a"]]) if (B[k] > 0 && S.hp > 0){
    const d = B[kd] || 5; S.hp -= d; B.taken += d; B[k]--; fx(document.getElementById("f-p"), "-" + d + " " + nm, col); blog(`${nm[0].toUpperCase() + nm.slice(1)}: −${d}.`); }
  for (const k of ["weak","armBreak","held","web"]) if (B[k]) B[k]--;
}
const abilNoFlee = () => B.held || B.web;
// смерть: розпад, жаба
function abilDeath(e){
  if (hasA(e, "split") && !e.child){
    for (let k = 0; k < 2; k++){ const c = mkEnemy(e.type, Math.max(1, e.lvl - 2), {}, null); c.hp = c.maxHp = Math.round(c.maxHp * .3); c.xp = Math.round(c.xp * .3); c.drop = []; c.child = true; c.name = e.name.replace(/ \(.+\)$/, "") + " (уламок)"; B.enemies.push(c); }
    blog(`${e.name} розпадається на двох менших!`, "warn"); render();
  }
  if (hasA(e, "frog")){ const f = mkEnemy("frog", e.lvl, {}, null); f.hp = f.maxHp = Math.round(f.maxHp * .5); f.drop = []; f.name = "Відьмина жаба"; B.enemies.push(f); blog(`${e.name} обертається на жабу!`, "warn"); render(); }
}
// опис для картки
const mobFxText1 = mobFxText;
mobFxText = function(st){
  const t = mobFxText1(st);
  for (const k of ABIL[st.type] || []){ if (ENGINE_ABIL[k] && (k === "rise" ? st.rise : k === "venom" ? st.venom : st.lifesteal)) continue; const a = ABIL_INFO[k]; if (a) t.unshift(`${a[0]}: ${a[1]}`); else if (k === "venom") t.unshift("Отруює: 3 раунди шкоди після удару."); else if (k === "lifesteal") t.unshift("П'є кров: лікується з кожного удару."); }
  return t;
};
