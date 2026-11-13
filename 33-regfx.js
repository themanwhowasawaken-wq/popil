/* ============ особливості мобів за краями ============ */
// Види істот: від виду залежить, чим їх бити. Від краю — правило бою, що діє на всіх місцевих.
const KIND_RE = {
  undead:/^(mk_|skel$|warden$|zombie$|crypt_captain$|ghost_mage$|drowned$|bg_drowned$|bg_monk$|bg_abbot$|or_dead_knight$|or_martyr$|or_ghost_horse$|or_grave_lord$|or_bannerman$|or_magister$)/,
  construct:/^(golem|gargoyle|bg_peat|bg_willow)$/,
  human:/^(soldier|order_mage|marauder|thief|cultist|rabble_mage|rabble_hunter|villain|black_knight|dark_magister|or_dawn_knight|or_dawn_cleric|or_night_knight|or_night_archer|or_squire|or_champion|or_castellan|bg_witch|bg_eldest)$/,
  beast:/^(rat|wolf|wolf2|alpha|forest_wolf|boar|tiger|scorpion|jal_king|hunter_spider|frog|or_warhound|bg_serpent|bg_leech|bg_giant_leech|bg_leech_queen|or_bats|bg_hydra|bg_hydra_mother)$/,
  water:/^(bg_|merman$|chosen_merman$|drowned$)/,
};
const isK = (type, k) => k === "demon" ? isDemon(type) : KIND_RE[k].test(type);
const SHIELD_CASTERS = /^(order_mage|rabble_mage|or_dawn_cleric|bg_frog_shaman)$/;
const isDay = () => { const h = new Date().getHours(); return h >= 6 && h < 20; };
function battleReg(){
  if (!B) return null;
  if (B.origin === "dungeon" && DG) return NODES[DUNGEONS[DG.id].node] ? NODES[DUNGEONS[DG.id].node].r : null;
  return NODES[B.scene] ? NODES[B.scene].r : NODES[S.loc] ? NODES[S.loc].r : null;
}
const alliesOf = (e, k) => B.enemies.filter(o => o !== e && alive(o) && isK(o.type, k)).length;
// шкода від звичайного удару зброєю
function physMul(tg, kind){
  const heavy = kind === "strong" || weaponBlunt(); let m = 1;
  if (isK(tg.type, "undead") && !heavy) m *= .7;                 // клинок ковзає по кістках
  if (isK(tg.type, "construct")) m *= heavy ? 1.25 : .65;        // камінь і торф треба трощити
  if (battleReg() === "kab" && isK(tg.type, "human")) m *= 1 - .1 * Math.min(2, alliesOf(tg, "human")); // стрій
  return m;
}
// стихії: fire — вогонь, bolt — блискавка й буря, holy — обереги й світанок
function elemMul(tg, el){
  let m = 1; const r = battleReg();
  if (el === "fire"){ if (isK(tg.type, "undead")) m *= 1.4; if (isK(tg.type, "construct") && tg.type === "bg_willow") m *= 1.5; if (r === "bog") m *= .7; }
  if (el === "bolt"){ if (r === "bog" || isK(tg.type, "water")) m *= 1.3; if (isK(tg.type, "construct") && tg.type !== "bg_willow") m *= 1.2; }
  if (el === "holy"){ if (isK(tg.type, "undead") || isK(tg.type, "demon")) m *= 1.3; }
  if (tg.spellward) m *= .5;
  return m;
}
const poisonImmune = e => isK(e.type, "undead") || isK(e.type, "construct");
// наскільки сильніше б'є ворог
function enemyRegMul(e){
  const r = battleReg(), d = mobDef(e.type) || {}; let m = 1;
  if (r === "ash" && isK(e.type, "beast")) m *= 1 + .12 * Math.min(3, alliesOf(e, "beast"));    // зграя
  if (d.side === "dawn" && isDay()) m *= 1.2;
  if (d.side === "night" && !isDay()) m *= 1.2;
  return m;
}
const fleeMul = () => battleReg() === "bog" ? .5 : 1;
// початок бою: підказка, що тут діє
function regIntro(){
  const r = battleReg(), t = B.enemies.map(e => e.type), has = k => t.some(x => isK(x, k));
  const lines = [];
  if (r === "kab" && has("human")) lines.push("Стрій: люди Кабаллону прикривають одне одного — поки їх кілька, кожен отримує менше шкоди. Маги ставлять союзникам щити.");
  if (r === "ash" && has("beast")) lines.push("Зграя: звірі Попелястих земель б'ють тим сильніше, чим їх більше поруч. Вибивайте по одному.");
  if (r === "zak" && has("demon")){ lines.push("Нечисть відновлюється щораунду, поки її не обпекти оберегом, вогнем чи не прокляти.");
    if (!B.enemies.some(e => ownedWard(e))){ S.en = Math.max(0, S.en - 15); lines.push("Жах: без оберега нечисть лякає вас, −15 енергії."); } }
  if (has("undead")) lines.push("Нежить: клинок ковзає по кістках (−30%). Бийте сильним ударом чи булавою, вогонь пече її на 40% сильніше. Отрута не діє.");
  if (has("construct")) lines.push("Голем: звичайні удари слабкі, трощіть сильним ударом чи булавою. Отрута не діє.");
  if (r === "mark") lines.push("Дзвони Марки: кожен четвертий раунд дзвін піднімає сили нежиті.");
  if (r === "bog") lines.push("Трясовина: вогонь у багні слабший, блискавка сильніша. Втекти з багна вдвічі важче.");
  if (r === "ord"){ const dn = isDay(); if (B.enemies.some(e => (mobDef(e.type) || {}).side === (dn ? "dawn" : "night"))) lines.push(dn ? "День: лицарі Світанку при силі, б'ють на 20% сильніше." : "Ніч: лицарі Ночі при силі, б'ють на 20% сильніше."); }
  for (const l of lines) blog(l, "warn");
}
// кінець раунду: регенерація нечисті, дзвони, щити магів
function regRoundEnd(){
  const r = battleReg();
  for (const e of B.enemies) if (alive(e)){
    const el = document.getElementById("f-e" + B.enemies.indexOf(e));
    if (r === "zak" && isK(e.type, "demon") && !e.burn && !e.curse && !e.hex && e.hp < e.maxHp){ const hv = Math.round(e.maxHp * .04); e.hp = Math.min(e.maxHp, e.hp + hv); fx(el, "+" + hv, "#9fe08a"); }
    if (r === "bog" && isK(e.type, "water") && B.poison > 0 && e.hp < e.maxHp){ const hv = Math.round(e.maxHp * .03); e.hp = Math.min(e.maxHp, e.hp + hv); fx(el, "+" + hv, "#9fe08a"); }
  }
  if (r === "mark" && B.round % 4 === 0 && B.enemies.some(e => alive(e) && isK(e.type, "undead"))){
    blog("Б'є дзвін Марки: нежить набирається сил (+8% здоров'я).", "warn");
    for (const e of B.enemies) if (alive(e) && isK(e.type, "undead")){ const hv = Math.round(e.maxHp * .08); e.hp = Math.min(e.maxHp, e.hp + hv); fx(document.getElementById("f-e" + B.enemies.indexOf(e)), "+" + hv, "#e8e0cc"); }
  }
  for (const e of B.enemies) if (alive(e) && SHIELD_CASTERS.test(e.type) && Math.random() < .35){
    const ally = B.enemies.filter(o => alive(o) && !o.eshield).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (ally){ ally.eshield = Math.round(6 * e.lvl); fx(document.getElementById("f-e" + B.enemies.indexOf(ally)), "щит", "#9fc2ea"); blog(`${e.name} ставить щит на ${ally === e ? "себе" : ally.name}: поглине ${ally.eshield}.`, "warn"); }
  }
  refreshBars();
}
// смерть ворога: іскрянка вибухає
function onEnemyDeath(e){
  if (e.type === "spark"){ const d = Math.round(8 + e.lvl * 4); S.hp -= d; B.taken += d; fx(document.getElementById("f-p"), "-" + d + " вибух", "#ffb24a"); blog(`${e.name} вибухає, гине і обпікає вас: −${d}.`, "warn"); }
}
// опис для картки моба й бестіарію
const mobFxText0 = mobFxText;
mobFxText = function(st){
  const t = mobFxText0(st), ty = st.type;
  if (isK(ty, "undead")) t.push("Нежить: звичайний удар клинком слабший на 30%, сильний удар і булава — повні. Вогонь +40%, обереги +30%. Отрута не діє.");
  if (isK(ty, "construct")) t.push("Голем: звичайні удари −35%, сильний удар і булава +25%. Отрута не діє.");
  const here = NODES[S.loc] ? NODES[S.loc].r : null;
  if (isK(ty, "human") && here === "kab") t.push("Стрій: поки поруч свої люди, отримує до 20% менше шкоди.");
  if (SHIELD_CASTERS.test(ty)) t.push("Ставить союзникам щит, що поглинає шкоду.");
  if (isK(ty, "beast") && here === "ash") t.push("Зграя: б'є на 12% сильніше за кожного звіра поруч.");
  if (isK(ty, "demon")) t.push("Нечисть: відновлює 4% здоров'я щораунду, поки не обпечеш чи не проклянеш.");
  if (isK(ty, "water")) t.push("Болотяна тварюка: у тумані Трясовини гоїться, блискавка б'є її на 30% сильніше.");
  if (ty === "spark") t.push("Гинучи, вибухає й обпікає того, хто вбив.");
  const sd = (mobDef(ty) || {}).side; if (sd) t.push(sd === "dawn" ? "Удень (6:00–20:00) б'є на 20% сильніше." : "Уночі (20:00–6:00) б'є на 20% сильніше.");
  return t;
};
// правила країв на панелі локації
Object.assign(REG_RULE, {
  kab:() => `<div class="regrule"><b>Стрій.</b> Люди Кабаллону б'ються гуртом: поки поруч свої, кожен отримує менше шкоди, а маги ставлять щити. Вибивайте магів першими.</div>`,
  ash:() => `<div class="regrule"><b>Зграя.</b> Звірі тут полюють разом і б'ють сильніше, коли їх більше. Кличуть своїх до бою.</div>`,
  zak:() => `<div class="regrule"><b>Нечисть.</b> Відновлюється щораунду, поки не обпечеш оберегом чи вогнем або не проклянеш. Без оберега в торбі на початку бою лякає: −15 енергії.</div>`,
});
const REG_MARK0 = REG_RULE.mark, REG_BOG0 = REG_RULE.bog, REG_ORD0 = REG_RULE.ord;
REG_RULE.mark = id => REG_MARK0(id) + `<div class="regrule"><b>Дзвони.</b> Кожен четвертий раунд дзвін лікує нежить на 8%. Клинок ковзає по кістках: −30%, а вогонь пече на 40% сильніше.</div>`;
REG_RULE.bog = id => REG_BOG0(id) + `<div class="regrule"><b>Багно.</b> Вогонь слабший на 30%, блискавка сильніша на 30%. Втекти вдвічі важче, а болотяні тварюки в тумані гояться.</div>`;
REG_RULE.ord = id => REG_ORD0(id) + `<div class="regrule"><b>${isDay() ? "День" : "Ніч"}.</b> ${isDay() ? "Лицарі Світанку при силі до 20:00" : "Лицарі Ночі при силі до 6:00"}: б'ють на 20% сильніше.</div>`;
