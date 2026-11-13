/* ===================================================================
   ЕТАП 2: три нові краї
   Кістяна Марка (7–9), Чорна Трясовина (8–10), Землі Світанку й Ночі (9–10)
   =================================================================== */
WORLD.w = 3760; WORLD.h = 1560;
Object.assign(REGIONS, {mark:"Кістяна Марка", bog:"Чорна Трясовина", ord:"Землі Світанку й Ночі"});

/* ---------- вузли карти ---------- */
Object.assign(NODES, {
  // Кістяна Марка: на схід від Чорногори
  mk_fort:{r:"mark", name:"Застава Кордон", x:2960, y:560, kind:"town", lv:"застава"},
  mk_bell:{r:"mark", name:"Монастир Дзвонарів", x:3040, y:330, kind:"town", lv:"монастир"},
  mk_road:{r:"mark", name:"Тракт Хрестів", x:3090, y:700, kind:"hunt", lv:"7"},
  mk_field:{r:"mark", name:"Поле Ста Хрестів", x:3240, y:520, kind:"hunt", lv:"7–8"},
  mk_village:{r:"mark", name:"Мертве Липове", x:3210, y:840, kind:"hunt", lv:"7–8"},
  mk_barrow:{r:"mark", name:"Курган Воєводи", x:3230, y:220, kind:"danger", lv:"8"},
  mk_mill:{r:"mark", name:"Кістяний млин", x:3400, y:700, kind:"danger", lv:"8"},
  mk_ossuary:{r:"mark", name:"Оссуарій", x:3430, y:420, kind:"danger", lv:"8"},
  mk_bridge:{r:"mark", name:"Міст Повішених", x:3580, y:590, kind:"danger", lv:"8–9"},
  mk_crows:{r:"mark", name:"Вороняча вежа", x:3460, y:150, kind:"danger", lv:"9"},
  mk_wall:{r:"mark", name:"Мури Старої Марки", x:3650, y:300, kind:"danger", lv:"9"},
  mk_throne:{r:"mark", name:"Кістяна Цитадель", x:3640, y:820, kind:"danger", lv:"9"},
  // Чорна Трясовина: на південь від Попелястих земель
  bg_gat:{r:"bog", name:"Стара Гать", x:1520, y:990, kind:"hunt", lv:"8"},
  bg_village:{r:"bog", name:"Багнище", x:1380, y:1110, kind:"town", lv:"село на палях"},
  bg_camp:{r:"bog", name:"Рибальська стоянка", x:1110, y:1020, kind:"town", lv:"стоянка"},
  bg_reeds:{r:"bog", name:"Очеретяні Плавні", x:1230, y:1190, kind:"hunt", lv:"8"},
  bg_peat:{r:"bog", name:"Торфовища", x:1580, y:1190, kind:"hunt", lv:"8–9"},
  bg_willows:{r:"bog", name:"Плакучі Верби", x:1000, y:1180, kind:"danger", lv:"9"},
  bg_coven:{r:"bog", name:"Хата Ковену", x:1110, y:1330, kind:"danger", lv:"9"},
  bg_sunk:{r:"bog", name:"Затоплене село", x:1400, y:1320, kind:"danger", lv:"9"},
  bg_midges:{r:"bog", name:"Острів Мошкари", x:1720, y:1330, kind:"danger", lv:"9"},
  bg_abbey:{r:"bog", name:"Затоплене Абатство", x:960, y:1430, kind:"danger", lv:"9–10"},
  bg_lair:{r:"bog", name:"Лігво Гідри", x:1290, y:1450, kind:"danger", lv:"10"},
  bg_eye:{r:"bog", name:"Чорне Око", x:1600, y:1450, kind:"danger", lv:"10"},
  // Землі Світанку й Ночі: на південь від Закарпаття
  or_cross:{r:"ord", name:"Перехрестя Мечів", x:2160, y:1010, kind:"town", lv:"перехрестя"},
  or_dawn:{r:"ord", name:"Табір Світанку", x:1990, y:1170, kind:"town", lv:"табір"},
  or_night:{r:"ord", name:"Табір Ночі", x:2650, y:1040, kind:"town", lv:"табір"},
  or_field:{r:"ord", name:"Поле Останньої Битви", x:2320, y:1150, kind:"hunt", lv:"9"},
  or_sun:{r:"ord", name:"Сонячне поле", x:2050, y:1340, kind:"hunt", lv:"9"},
  or_banners:{r:"ord", name:"Пагорб Прапорів", x:2490, y:1250, kind:"hunt", lv:"9–10"},
  or_moat:{r:"ord", name:"Кривавий Рів", x:2320, y:1340, kind:"danger", lv:"10"},
  or_cathedral:{r:"ord", name:"Руїни Собору Світанку", x:2160, y:1460, kind:"danger", lv:"10"},
  or_grave:{r:"ord", name:"Братська могила", x:2500, y:1450, kind:"danger", lv:"10"},
  or_lists:{r:"ord", name:"Турнірне ристалище", x:2790, y:1200, kind:"danger", lv:"10"},
  or_keep:{r:"ord", name:"Підніжжя Чорної Твердині", x:2760, y:1420, kind:"danger", lv:"10"},
});

/* ---------- дороги ---------- */
ROADS.push(...[
  // переходи зі старих земель
  ["tia","mk_fort",1,-20,"Солотвинський шлях"],
  ["swamp","bg_gat",1,-24,"Гнила гать"],["ruins","bg_camp",1,30,"Стежка Варти"],["citadel","bg_willows",1,-30,"Мертвий брід"],
  ["velbz","or_dawn",1,20,"Ужанський шлях"],["rah","or_night",1,26,"Рахівський спуск"],
  
  // Кістяна Марка
  ["mk_fort","mk_road",0,-12],["mk_fort","mk_bell",0,14],["mk_road","mk_field",0,14],["mk_road","mk_village",0,-12],
  ["mk_bell","mk_barrow",1,-14],["mk_field","mk_ossuary",1,12],["mk_village","mk_mill",1,14],
  ["mk_barrow","mk_crows",1,12],["mk_crows","mk_wall",1,-14],["mk_ossuary","mk_wall",1,10],["mk_ossuary","mk_bridge",1,-12],["mk_mill","mk_bridge",1,12],
  ["mk_bridge","mk_throne",1,-14],
  // Чорна Трясовина
  ["bg_gat","bg_village",0,10],["bg_camp","bg_village",0,-14],["bg_camp","bg_reeds",0,12],["bg_village","bg_peat",0,12],
  ["bg_camp","bg_willows",1,-12],["bg_willows","bg_coven",1,12],["bg_reeds","bg_coven",1,-12],["bg_village","bg_sunk",1,10],["bg_peat","bg_sunk",1,-12],["bg_peat","bg_midges",1,12],
  ["bg_coven","bg_abbey",1,-10],["bg_sunk","bg_lair",1,12],["bg_lair","bg_eye",1,10],["bg_midges","bg_eye",1,-12],
  // Землі Світанку й Ночі
  ["or_cross","or_dawn",0,12],["or_cross","or_night",0,-16],["or_cross","or_field",0,10],["or_dawn","or_sun",0,-12],["or_night","or_banners",0,12],
  ["or_field","or_banners",0,-12],["or_field","or_moat",1,12],["or_sun","or_cathedral",1,12],["or_moat","or_grave",1,10],
  ["or_night","or_lists",1,-12],["or_grave","or_keep",1,10],["or_lists","or_keep",1,-14],
].map(mkRoad));

/* ---------- локації ---------- */
Object.assign(LOCS, {
  // --- Кістяна Марка ---
  mk_fort:{desc:"Остання жива застава на кордоні Марки. Частокіл, дзвін на вежі й прикордонники, що сплять у кольчугах.", npcs:[["bogdan",330,220],["gnat",590,260]],
    buildings:[["Сотня застави","npc:bogdan"],["Кузня Гната","npc:gnat"],["Вартова вежа","heal:Ви поспали під охороною вартових. Сили повністю відновилися."]]},
  mk_bell:{desc:"Монастир, де дзвонарі вже сто років не дають мертвим підійти. Дзвони б'ють кожну годину.", npcs:[["varlaam",450,230]],
    buildings:[["Келія ігумена","npc:varlaam"],["Дзвіниця","heal:Дзвін гуде крізь вас. Утома й рани відступають."]], res:{herb:4}},
  mk_road:{desc:"Старий тракт, обставлений дерев'яними хрестами. Кожен хрест колись був могилою.", mobs:[["mk_warrior",3,7],["mk_hound",3,7],["mk_crow",2,7]], res:{herb:3}, boss:["mk_warrior",8]},
  mk_field:{desc:"Поле, де стоїть сто хрестів. Земля між ними ворушиться ночами.", mobs:[["mk_warrior",2,8],["mk_spear",3,7],["mk_swarm",2,8]], res:{herb:4, mine:3}, boss:["mk_watcher",9]},
  mk_village:{desc:"Село, що вимерло за одну ніч. Кістяні пси досі стережуть подвір'я.", mobs:[["mk_hound",4,7],["mk_spear",2,8],["mk_crow",3,7]], res:{herb:3, fish:3}, boss:["mk_hound",9]},
  mk_barrow:{desc:"Високий курган, у якому поховали воєводу з усією дружиною. Дружина встала першою.", mobs:[["mk_knight",3,8],["mk_archer",2,8],["mk_spear",2,8]], res:{mine:4}, boss:["mk_voivode",9]},
  mk_mill:{desc:"Млин, що меле кістки на борошно. Хто крутить жорна, ніхто не бачив.", mobs:[["mk_bellringer",2,8],["mk_warrior",2,8],["mk_crow",2,8]], res:{fish:4}, boss:["mk_giant",9]},
  mk_ossuary:{desc:"Каплиця з черепів. Унизу Оссуарій, де черепи шепочуть один одному.", mobs:[["mk_swarm",3,8],["mk_mage",2,8],["mk_warrior",2,8]], res:{mine:4}, buildings:[["Спуск в Оссуарій","dungeon:ossuary"]]},
  mk_bridge:{desc:"Кам'яний міст над Рікою Забуття. На поручнях досі гойдаються зашморги.", mobs:[["mk_archer",3,8],["mk_spear",2,9],["mk_swarm",2,9]], res:{fish:5}, boss:["mk_archer",10]},
  mk_crows:{desc:"Вежа некроманта, обсіла воронами. Ворони тут їдять не зерно.", mobs:[["mk_crow",4,9],["mk_mage",2,9],["mk_swarm",2,9]], res:{herb:5}, boss:["mk_necro",10]},
  mk_wall:{desc:"Мури старого прикордонного князівства. Варта на мурах так і не зійшла з посту.", mobs:[["mk_knight",2,9],["mk_archer",2,9],["mk_giant",1,9]], res:{mine:5}, boss:["mk_knight",10]},
  mk_throne:{desc:"Цитадель з кісток і чорного каменю. Під нею Склеп, де сидить на троні Кістковий Король.", mobs:[["mk_knight",2,9],["mk_giant",1,9],["mk_bellringer",2,9]], res:{mine:5}, buildings:[["Вхід у Склеп Короля","dungeon:bone_crypt"]]},
  // --- Чорна Трясовина ---
  bg_gat:{desc:"Стара гать з дубових колод. Поки стоїш на колодах, туман тебе не дістає.", mobs:[["bg_leech",3,8],["bg_frogman",3,8],["bg_wisp",2,8]], res:{fish:4}, boss:["bg_giant_leech",9]},
  bg_village:{desc:"Село на палях посеред багна. Хати з'єднані кладками, а під кладками хтось плаває.", npcs:[["yavdokha",300,220],["gordiy",600,250]],
    buildings:[["Хата старійшини","npc:yavdokha"],["Човнярня Гордія","npc:gordiy"]], res:{fish:4}},
  bg_camp:{desc:"Рибальська стоянка на сухому горбі. Тут варять юшку й настоянки від туману.", npcs:[["omelko",420,230]],
    buildings:[["Курінь знахаря","npc:omelko"],["Багаття","heal:Гаряча юшка й дим багаття. Сили повністю відновилися."]], res:{fish:4, herb:4}},
  bg_reeds:{desc:"Очерет вищий за людину. Жаболюди полюють тут зграями.", bog:true, mobs:[["bg_frogman",4,8],["bg_wisp",2,8],["bg_leech",2,8]], res:{herb:4, fish:4}, boss:["bg_frog_shaman",9]},
  bg_peat:{desc:"Торфовища, що тліють зсередини. Торф'яні големи виходять з диму.", bog:true, mobs:[["bg_peat",2,9],["bg_leech",3,8],["bg_wisp",1,9]], res:{mine:4, herb:4}, boss:["bg_peat",10]},
  bg_willows:{desc:"Плакучі верби, що ловлять гіллям. Під корінням кістки тих, хто тут відпочив.", bog:true, mobs:[["bg_willow",2,9],["bg_frog_shaman",2,9],["bg_wisp",2,9]], res:{herb:5}, boss:["bg_willow",10]},
  bg_coven:{desc:"Хата на курячих лапах. Три сестри варять тут туман для всієї Трясовини.", bog:true, mobs:[["bg_witch",2,9],["bg_frogman",2,9],["bg_serpent",1,9]], res:{herb:5}, boss:["bg_eldest",10]},
  bg_sunk:{desc:"Село, яке Трясовина проковтнула за одну весну. Утопленики досі ходять до своїх хат.", bog:true, mobs:[["bg_drowned",3,9],["bg_leech",2,9],["bg_serpent",1,9]], res:{fish:5}, boss:["bg_drowned",10]},
  bg_midges:{desc:"Острів, над яким гуде хмара мошкари. Вона з'їдає коня за ніч.", bog:true, mobs:[["bg_midge",4,9],["bg_serpent",2,9],["bg_wisp",2,9]], res:{herb:5}, boss:["bg_giant_leech",10]},
  bg_abbey:{desc:"Абатство пішло під воду разом з братією. Дзвін на затопленій дзвіниці часом дзвонить сам.", bog:true, mobs:[["bg_monk",2,9],["bg_drowned",2,9],["bg_leech",2,9]], res:{fish:5}, buildings:[["Спуск у затоплену крипту","dungeon:abbey"]]},
  bg_lair:{desc:"Лігво гідр серед чорних коренів. Кожна відрубана голова відростає вдвічі злішою.", bog:true, mobs:[["bg_hydra",2,10],["bg_serpent",2,10],["bg_drowned",2,10]], res:{fish:5}, boss:["bg_hydra_mother",10]},
  bg_eye:{desc:"Кругле чорне озеро посеред трясовини. Кажуть, воно дивиться на тебе.", bog:true, mobs:[["bg_giant_leech",2,10],["bg_serpent",2,10],["bg_midge",2,10]], res:{fish:5, mine:5}, boss:["bg_leech_queen",10]},
  // --- Землі Світанку й Ночі ---
  or_cross:{desc:"Перехрестя, де два ордени складають зброю, щоб поговорити. Тут присягають і тут торгують.", npcs:[["oleksa",330,220],["kylyna",600,260]],
    buildings:[["Намет герольда","npc:oleksa"],["Маркітантський віз","npc:kylyna"],["Польовий шпиталь","heal:Сестри милосердя перев'язали ваші рани. Сили повністю відновилися."]]},
  or_dawn:{desc:"Білий табір під золотими прапорами з сонцем. Молитва тут починається до світанку.", npcs:[["yaropolk",450,230]], buildings:[["Намет командора","npc:yaropolk"]], res:{herb:4}},
  or_night:{desc:"Чорний табір під срібним місяцем. Вартові тут не сплять ніколи.", npcs:[["veresk",450,230]], buildings:[["Намет лорда-командора","npc:veresk"]], res:{mine:4}},
  or_field:{desc:"Поле, де ордени зійшлися востаннє. Мертві лицарі обох сторін досі шукають ворога.", mobs:[["or_dead_knight",2,9],["or_dawn_knight",2,9],["or_night_knight",2,9],["or_warhound",2,9]], res:{herb:4, mine:4}, boss:["or_dead_knight",10]},
  or_sun:{desc:"Поле соняшників біля Собору. Тут стоять дозори Світанку.", mobs:[["or_dawn_knight",2,9],["or_dawn_cleric",2,9],["or_martyr",2,9]], res:{herb:5}, boss:["or_dawn_knight",10]},
  or_banners:{desc:"Пагорб, утиканий прапорами обох орденів. Хто зніме чужий прапор, того вшанують у таборі.", mobs:[["or_night_knight",2,9],["or_squire",2,9],["or_night_archer",2,10],["or_dawn_knight",1,10]], res:{mine:4}, boss:["or_night_knight",10]},
  or_moat:{desc:"Рів, повний іржавих обладунків. Вода тут червона й без дощу.", mobs:[["or_dead_knight",3,10],["or_warhound",2,10],["or_ghost_horse",1,10]], res:{fish:5}, boss:["or_bannerman",10]},
  or_cathedral:{desc:"Зруйнований Собор Світанку. Під ним Катакомби, де спить Перший Магістр.", mobs:[["or_martyr",3,10],["or_dead_knight",2,10],["or_dawn_cleric",2,10]], res:{herb:5}, buildings:[["Спуск у Катакомби","dungeon:catacomb"]]},
  or_grave:{desc:"Братська могила обох орденів. Тут лицарі Світанку й Ночі нарешті лежать поруч, але не спокійно.", mobs:[["or_dead_knight",3,10],["or_ghost_horse",2,10],["or_martyr",1,10]], res:{mine:5}, boss:["or_grave_lord",10]},
  or_lists:{desc:"Турнірне ристалище. Чемпіон досі чекає суперника, а глядачі на трибунах давно кістяки.", mobs:[["or_squire",2,10],["or_night_knight",2,10],["or_dawn_knight",2,10]], res:{mine:5}, boss:["or_champion",10]},
  or_keep:{desc:"Підніжжя Чорної Твердині. Її кастелян зачинив ворота і від своїх, і від чужих.", mobs:[["or_night_knight",2,10],["or_night_archer",2,10],["or_warhound",2,10],["or_bats",3,10]], res:{mine:5}, buildings:[["Ворота Твердині","dungeon:night_keep"]]},
});
for (const id of Object.keys(NODES)) if (LOCS[id]) prepLoc(LOCS[id]);
const MOB_TOP = Math.max(...Object.values(LOCS).flatMap(L => L.mobs.map(m => m[2])));

/* ---------- сцени локацій ---------- */
Object.assign(BIOME, {
  bone:{ground:["#77715f","#837c69","#6a6453"], grass:"#8a8466", veg:{dead:9, rocks:8, grass:30}, mood:"dusk"},
  bog:{ground:["#2f3a2c","#384431","#262f24"], grass:"#4d5a37", veg:{dead:12, reeds:55, grass:18, bush:4}, pools:12, fog:true, mood:"dark"},
  battle:{ground:["#5e5440","#6a5f48","#524a38"], grass:"#7a7450", veg:{grass:46, rocks:8, bush:4, dead:3}},
});
Object.assign(SCENE, {
  mk_fort:{b:"bone", road:true, x:["palisade","village","watchtower"]}, mk_bell:{b:"bone", road:true, x:["monastery"]},
  mk_road:{b:"bone", road:true, x:["crosses"]}, mk_field:{b:"bone", x:["crosses","bones"]}, mk_village:{b:"bone", x:["dead_village","bones"]},
  mk_barrow:{b:"bone", x:["barrow","bones"]}, mk_mill:{b:"bone", river:true, x:["bone_mill","bones"]}, mk_ossuary:{b:"bone", x:["ossuary_b","crosses"]},
  mk_bridge:{b:"bone", river:true, x:["gallows_bridge"]}, mk_crows:{b:"dark", x:["necro_tower","bones"]}, mk_wall:{b:"bone", x:["bone_wall"]},
  mk_throne:{b:"dark", x:["bonecastle","bones"]},
  bg_gat:{b:"bog", x:["gat"]}, bg_village:{b:"bog", x:["stilts"]}, bg_camp:{b:"swamp", x:["camp_small","hut"]}, bg_reeds:{b:"bog"},
  bg_peat:{b:"bog", x:["smoke"]}, bg_willows:{b:"bog", x:["willows"]}, bg_coven:{b:"bog", x:["coven_hut"]}, bg_sunk:{b:"bog", x:["sunk_houses"]},
  bg_midges:{b:"bog", x:["midge_cloud"]}, bg_abbey:{b:"bog", x:["abbey"]}, bg_lair:{b:"bog", x:["roots"]}, bg_eye:{b:"bog", lake:true},
  or_cross:{b:"battle", road:true, x:["tents","signpost"]}, or_dawn:{b:"meadow", road:true, x:["camp_dawn"]}, or_night:{b:"battle", road:true, x:["camp_night"], mood:"dusk"},
  or_field:{b:"battle", x:["spears","banners2"]}, or_sun:{b:"meadow", x:["sunflowers","banners2"]}, or_banners:{b:"battle", x:["banners_hill"]},
  or_moat:{b:"battle", river:true, x:["spears"], mood:"dusk"}, or_cathedral:{b:"ash", x:["cathedral"], mood:"dusk"}, or_grave:{b:"dark", x:["graves","spears"]},
  or_lists:{b:"battle", x:["lists"]}, or_keep:{b:"dark", x:["keep"]},
});
BIG_STRUCT.push("monastery","ossuary_b","necro_tower","bonecastle","bone_mill","abbey","cathedral","keep","coven_hut","watchtower");

/* ---------- правила країв ---------- */
const REG_RULE = {
  mark:() => `<div class="regrule"><b>Повстання.</b> Скелети встають ще раз, якщо добити їх звичайним ударом. Кладіть кістяків назавжди сильним ударом, булавою, вогнем, бурею чи оберегом.${weaponBlunt() ? " <b>У вас булава: кістки не зберуться.</b>" : ""}</div>`,
  bog:id => LOCS[id].bog ? `<div class="regrule${bogSafe() ? "" : " bad"}"><b>Трясовина.</b> Туман отруює на початку кожного бою, а енергія в багні відновлюється повільніше. ${bogSafe() ? "<b>Ви захищені від туману.</b>" : "Рятують болотяні ходаки або настоянка багна."}</div>`
    : isSafe(id) ? "" : `<div class="regrule"><b>Гать.</b> Тут сухі колоди: туман Трясовини не дістає.</div>`,
  ord:() => `<div class="regrule"><b>Два ордени.</b> ${S.order ? `Ви присягнули ${ORDERS[S.order].gen}. Лицарі ${ORDERS[S.order === "dawn" ? "night" : "dawn"].gen} нападають першими, а ваші брати вам не вороги.` : "Ви без присяги: живі лицарі не нападають самі. Присягнути можна в герольда на Перехресті Мечів з ${OATH_LVL} рівня."}</div>`,
};
function regRuleHTML(id){ const f = REG_RULE[NODES[id].r]; return f ? f(id) : ""; }

/* ---------- ордени ---------- */
const ORDERS = {
  dawn:{name:"Орден Світанку", gen:"Ордену Світанку", ic:"sun", col:"#c9a24a", bonus:"+40 здоров'я, +3 волі",
    text:"Лицарі сонця. Тримають стрій, лікують своїх і вірять, що мертвих треба упокоїти, а не воювати з ними."},
  night:{name:"Орден Ночі", gen:"Ордену Ночі", ic:"moon", col:"#a07ae0", bonus:"+5% криту, +5% урону",
    text:"Лицарі місяця. Б'ють першими, не просять пощади і вважають, що перемога виправдовує все."},
};
const OATH_LVL = 9, RENOUNCE_COST = 2000;
function oathHTML(){
  if (S.order){ const o = ORDERS[S.order];
    return `<div class="qbox"><b>${gi(o.ic, 18, o.col)} Ви присягнули ${o.gen}</b><p class="hint">Дар присяги: ${o.bonus}. Квести й крамниця ордену відкриті для вас.</p>
      <button class="btn" data-renounce="1">Зректися присяги (${moneyTxt(RENOUNCE_COST)})</button></div>`; }
  const low = S.lvl < OATH_LVL;
  return `<div class="oath">${["dawn","night"].map(k => { const o = ORDERS[k]; return `<div class="side ${k}"><h4>${gi(o.ic, 20, o.col)} ${o.name}</h4><p>${o.text}</p><div class="bon">Дар присяги: ${o.bonus}</div>
    <button class="btn ${k === "dawn" ? "p" : ""}" data-oath="${k}" ${low ? "disabled" : ""}>Присягнути</button></div>`; }).join("")}</div>
    <p class="hint">${low ? `Присягають з ${OATH_LVL} рівня.` : "Від присяги залежать квести, крамниці й те, хто нападатиме на вас у цих землях. Зректися можна пізніше, але не задарма."}</p>`;
}
function resetOrderLocs(){ for (const id of Object.keys(LR)) if (NODES[id] && NODES[id].r === "ord") delete LR[id]; }
function takeOath(side){
  if (S.order || S.lvl < OATH_LVL || !ORDERS[side]) return;
  S.order = side; resetOrderLocs();
  msg(`Ви присягнули ${ORDERS[side].gen}. Дар присяги: ${ORDERS[side].bonus}.`, "good");
  save(); checkAch(); openNpc("oleksa"); render();
}
function renounceOrder(){
  if (!S.order) return;
  if (S.cop < RENOUNCE_COST){ msg(`Зректися присяги коштує ${moneyTxt(RENOUNCE_COST)}.`, "warn"); return; }
  spend("oath", RENOUNCE_COST);
  for (const [qid, q] of Object.entries(S.quests)) if (QUESTS[qid].order === S.order && q.st === "active") delete S.quests[qid];
  msg(`Ви зреклися присяги ${ORDERS[S.order].gen}.`, "warn"); S.order = null; resetOrderLocs();
  save(); openNpc("oleksa"); render();
}
ECON_OUT.oath = "Присяги";

/* ---------- моби ---------- */
const BONE = "#d8d0bc";
Object.assign(MOBS, {
  // --- Кістяна Марка ---
  mk_warrior:{name:"Скелет-воїн", arch:"shielded", rise:true, lore:"Мертвий прикордонник у проржавілій кольчузі. Щит гасить звичайний удар, а розсипані кістки збираються знову.", p:{def:1.2}, ward:["Освячена вода","Дзвін","Залізо"], drop:[["bonemeal",.6],["grave_iron",.12]], design:D("skeleton",BONE,"#5a5040","#7fd0ff",["shield"],{prop:"sword"})},
  mk_spear:{name:"Скелет-списник", arch:"chaser", rise:true, pack:true, lore:"Списники стояли в першому ряду й досі тримають стрій. Нападають гуртом.", p:{agi:1}, ward:["Освячена вода","Дзвін","Залізо"], drop:[["bonemeal",.6]], design:D("skeleton","#cfc6b0","#4a4236","#9fe0ff",[],{prop:"spear"})},
  mk_archer:{name:"Кістяний стрілець", arch:"kiter", rise:true, lore:"Стрілець з мурів Марки. Цілиться порожніми очницями й рідко хибить.", p:{dmg:1.05}, ward:["Освячена вода","Дзвін"], drop:[["bonemeal",.5],["crow_feather",.3]], design:D("skeleton","#c8c0aa","#3a3a30","#ffcf6a",[],{prop:"bow"})},
  mk_hound:{name:"Кістяний пес", arch:"chaser", pack:true, aggro:true, drain:10, lore:"Пси воєводи, що пережили господаря на сто років. Кусають у сухожилля й виснажують.", p:{hp:.85, agi:2}, ward:["Освячена вода","Вогонь"], drop:[["hound_fang",.55]], design:D("bonebeast",BONE,"#5a4a3a","#ff6a3a",[])},
  mk_swarm:{name:"Рій черепів", arch:"flyer", aggro:true, evade:20, lore:"Черепи з Оссуарію, що злетілися в рій. Розлітаються від святої води, але влучити в них важко.", p:{hp:.75, dmg:.9}, ward:["Освячена вода","Дзвін","Молитва"], drop:[["skull",.5]], design:D("swarm",BONE,"#3a3a30","#7fffd0",[])},
  mk_mage:{name:"Кістяний маг", arch:"summoner", summon:"mk_warrior", lore:"Учень некроманта в мантії з людської шкіри. Поки він живий, кістки встають.", p:{hp:.9}, ward:["Освячена вода","Хрест","Свячена крейда"], drop:[["skull",.5],["bell_shard",.15]], design:D("robed","#3a3444","#2a2430","#7fffd0",["skull"],{prop:"staff"})},
  mk_bellringer:{name:"Мертвий дзвонар", arch:"caster", aggro:true, lore:"Дзвонар, що впав з дзвіниці. Його дзвін гуде просто в кістках, і жодна броня від нього не рятує.", p:{hp:.95}, ward:["Дзвін","Освячена вода"], drop:[["bell_shard",.55]], design:D("robed","#5a5a66","#3a3a44","#9fe0ff",["skull"])},
  mk_knight:{name:"Кістяний лицар", arch:"shielded", rise:true, lore:"Дружинник воєводи в іржавих латах. Б'ється, як за життя, тільки не втомлюється.", p:{hp:1.3, def:1.4, agi:-1}, ward:["Освячена вода","Хрест"], drop:[["grave_iron",.5]], design:D("knight","#b8b0a0","#4a3a2a","#ff6a3a",["shield","horns"],{prop:"sword"})},
  mk_giant:{name:"Кістяний велетень", arch:"bruiser", cleave:true, lore:"Скелет велета, якого колись прикували до мурів. Кожен третій замах трощить усе довкола.", p:{hp:1.6, dmg:1.1, agi:-3}, ward:["Освячена вода","Залізо"], drop:[["giant_bone",.55]], design:D("giant",BONE,"#3a3026","#ff5a3a",["bones"],{prop:"club", size:1.45})},
  mk_crow:{name:"Трупний ворон", arch:"swarmer", aggro:true, lore:"Ворони з Вороняччої вежі. Літають зграями й дзьобають в очі.", p:{hp:.55, dmg:.75, agi:2}, ward:["Вогонь","Дзвін"], drop:[["crow_feather",.6]], design:D("bird","#1e1a22","#0e0c10","#ff3a3a",["wings"],{size:.8})},
  mk_voivode:{name:"Воєвода Кістяк", arch:"shielded", boss:true, rise:true, lore:"Воєвода Марки, похований з усією дружиною. Встав першим і підняв інших.", p:{def:1.3}, ward:["Освячена вода","Хрест"], drop:[["voivode_plate",.45],["grave_iron",1],["raw2",.5]], design:D("skeleton","#e0d8c2","#6a1a1a","#ff5a3a",["shield","crown"],{prop:"sword", size:1.45})},
  mk_watcher:{name:"Сторож Хрестів", arch:"bruiser", boss:true, cleave:true, lore:"Велетень з кісток, що обходить Поле Ста Хрестів і рахує могили. Котрої бракує, ту він і поповнить.", p:{hp:1.15}, ward:["Освячена вода","Залізо"], drop:[["giant_bone",1],["skull_belt",.35],["raw2",.5]], design:D("giant","#e8e0cc","#2a2420","#7fffd0",["bones","horns"],{prop:"club", size:1.7})},
  mk_necro:{name:"Некромант Ворон", arch:"summoner", boss:true, summon:"mk_crow", lore:"Той, хто першим розбудив мертвих Марки. Тепер служить Кістковому Королю й кличе своїх воронів.", p:{hp:1.1}, ward:["Освячена вода","Хрест","Свячена крейда"], drop:[["crow_cloak",.45],["bell_shard",1],["raw2",.5]], design:D("robed","#1e1a26","#120e18","#ff3a6a",["skull"],{prop:"staff", size:1.4})},
  mk_skullpile:{name:"Сто Черепів", arch:"summoner", dboss:true, summon:"mk_swarm", evade:10, lore:"Сто черепів, що зрослися в одну волю. Кличе рої собі на поміч і шепоче голосами померлих.", p:{}, drop:[["bone_ring",.5],["skull",1],["raw3",1]], design:D("swarm","#e8e0cc","#2a2a24","#ff5a3a",[],{size:1.9})},
  mk_bone_king:{name:"Кістковий Король", arch:"shielded", dboss:true, rise:true, summon:"mk_knight", lore:"Князь Старої Марки. Помер на троні й не захотів з нього злазити. Кістки його короновані, а воля тримає весь край.", p:{hp:.75, dmg:.95}, drop:[["king_scepter",.45],["bone_crown",.4],["voivode_plate",.3],["raw3",1]], design:D("skeleton","#efe7d2","#4a1a4a","#bf6fff",["shield","crown"],{prop:"staff", size:1.9})},
  // --- Чорна Трясовина ---
  bg_frogman:{name:"Жаболюд", arch:"chaser", pack:true, aggro:true, lore:"Напівжаба-напівлюдина з гарпуном. Полює зграєю в очереті.", p:{agi:1}, ward:["Сіль","Вогонь"], drop:[["frog_skin",.6]], design:D("frog","#5a7a3a","#2f4a22","#ffe24f",["fin","claws"])},
  bg_frog_shaman:{name:"Жаболюд-шаман", arch:"caster", venom:true, lore:"Старий жаболюд, що плює отрутою й бурмоче до туману.", p:{hp:.9}, ward:["Сіль","Полин"], drop:[["frog_skin",.5],["leech_slime",.3]], design:D("frog","#4a6a32","#2a3a1a","#ffe24f",[],{prop:"staff"})},
  bg_leech:{name:"Болотяна п'явка", arch:"chaser", lifesteal:.4, lore:"П'явка завдовжки з руку. Присмоктується й п'є, поки не відірвеш.", p:{hp:.9}, ward:["Сіль","Вогонь"], drop:[["leech_slime",.6]], design:D("leech","#4a2420","#7a3a2a","#ffcf6a",[])},
  bg_giant_leech:{name:"П'явка-велетень", arch:"bruiser", lifesteal:.5, lore:"Велетенська п'явка з чорного озера. Може випити коня.", p:{hp:1.5, agi:-2}, ward:["Сіль","Вогонь"], drop:[["leech_slime",1],["raw2",.1]], design:D("leech","#3a1a18","#6a2a20","#ff9a3a",[],{size:1.4})},
  bg_wisp:{name:"Болотяний вогник", arch:"wisp", aggro:true, evade:10, lore:"Зелений вогник, що веде в трясовину. Хто піде за ним, той уже не вернеться.", p:{hp:.7}, ward:["Молитва","Свячена крейда"], drop:[["marsh_light",.55]], design:D("wisp","#c8ff9a","#7fdf6a","#1a3a1a",["glow"])},
  bg_midge:{name:"Мошкара", arch:"swarmer", aggro:true, evade:15, lore:"Хмара мошкари, що кусає крізь одяг. Поодинці нікчемна, разом страшна.", p:{hp:.5, dmg:.7, agi:3}, ward:["Вогонь","Полин"], drop:[["midge_wings",.5]], design:D("midges","#3a3a2a","#1a1a12","#ffcf3a",[],{size:.9})},
  bg_peat:{name:"Торф'яний голем", arch:"bruiser", lore:"Торф, що тлів сто років і нарешті підвівся. Важкий, повільний і гарячий зсередини.", p:{hp:1.4, def:1.4, agi:-3}, ward:["Освячена вода","Сіль"], drop:[["peat_heart",.5]], design:D("golem","#4a3a2a","#2a2016","#ff9a3a",[],{size:1.25})},
  bg_drowned:{name:"Утопленик Трясовини", arch:"kiter", venom:true, lore:"Мешканець затопленого села. Кидає твань і тягне на дно.", p:{}, ward:["Освячена вода","Полин"], drop:[["drowned_cross",.4]], design:D("humanoid","#5a7a7a","#2a3a3a","#bfefff",["hair"])},
  bg_willow:{name:"Верболіз", arch:"bruiser", cleave:true, lore:"Плакуча верба, що вийшла з берега. Гілки ловлять, коріння душить.", p:{hp:1.5, agi:-3}, ward:["Вогонь","Залізо"], drop:[["willow_bark",.55]], design:D("giant","#4a5a32","#2a3420","#ffcf3a",["horns"],{prop:"club", size:1.4})},
  bg_witch:{name:"Сестра Ковену", arch:"caster", venom:true, aggro:true, lore:"Одна з трьох сестер. Варить туман і шле отруйні чари.", p:{hp:.95}, ward:["Сіль","Полин","Рута-м'ята"], drop:[["witch_hair",.5]], design:D("robed","#4a2a4a","#2a1a2a","#aaff66",[],{prop:"staff"})},
  bg_hydra:{name:"Болотяна гідра", arch:"bruiser", regrow:.08, lore:"Трьохголова гідра з чорних коренів. Відрубана голова відростає, якщо не припекти.", p:{hp:1.3}, ward:["Вогонь","Сіль"], drop:[["hydra_scale",.55]], design:D("hydra","#3a5a3a","#1a2a1a","#ffcf3a",[],{size:1.3})},
  bg_serpent:{name:"Болотяний змій", arch:"chaser", venom:true, lore:"Змій з жовтим черевом. Жалить і ховається в твані.", p:{agi:2}, ward:["Вогонь","Сіль"], drop:[["serpent_fang",.55]], design:D("serpent","#3a4a2a","#8aa03a","#ffe24f",[])},
  bg_monk:{name:"Утоплений чернець", arch:"caster", mend:true, lore:"Брат затопленого абатства. Досі молиться, тільки тепер за мертвих.", p:{hp:.95}, ward:["Освячена вода","Хрест"], drop:[["drowned_cross",.55]], design:D("robed","#3a4a5a","#1a2a3a","#9fe0ff",["skull"])},
  bg_eldest:{name:"Старша Сестра", arch:"caster", boss:true, venom:true, summon:"bg_witch", lore:"Найстарша з трьох сестер. Туман над Трясовиною її подих.", p:{}, ward:["Сіль","Полин","Рута-м'ята"], drop:[["coven_ring",.45],["witch_hair",1],["raw2",.5]], design:D("robed","#5a2a5a","#2a102a","#aaff66",["crown"],{prop:"staff", size:1.5})},
  bg_hydra_mother:{name:"Гідра-Мати", arch:"bruiser", boss:true, regrow:.07, cleave:true, lore:"Мати всіх гідр Трясовини. П'ять голів, і кожна пам'ятає свою образу.", p:{hp:1.1}, ward:["Вогонь","Сіль"], drop:[["hydra_fang",.4],["hydra_eye",.35],["hydra_scale",1],["raw3",.5]], design:D("hydra","#2a4a2a","#0f1f0f","#ff7a2a",[],{heads:5, size:1.9})},
  bg_leech_queen:{name:"Чорна П'явиця", arch:"bruiser", boss:true, lifesteal:.6, lore:"Королева п'явок з Чорного Ока. Що більше п'є, то сильніша стає.", p:{hp:1.1}, ward:["Сіль","Вогонь"], drop:[["bog_belt",.4],["leech_slime",1],["raw2",.6]], design:D("leech","#2a0e0e","#5a1a1a","#ff3a3a",["crown"],{size:1.7})},
  bg_abbot:{name:"Утоплений Абат", arch:"summoner", dboss:true, summon:"bg_monk", mend:true, lore:"Абат, що замкнув братію в абатстві, коли прийшла вода. Тепер вони служать йому й по смерті.", p:{hp:.85}, drop:[["hydra_eye",.3],["coven_ring",.3],["drowned_cross",1],["raw3",1]], design:D("robed","#2a3a4a","#0f1a24","#7fd0ff",["skull","crown"],{prop:"staff", size:1.8})},
  // --- Землі Світанку й Ночі ---
  or_dawn_knight:{name:"Лицар Світанку", arch:"shielded", side:"dawn", lore:"Лицар у білих латах із сонцем на щиті. Тримає стрій і б'ється за свій орден.", p:{hp:1.15, def:1.3}, drop:[["dawn_sigil",.4],["banner_scrap",.4]], design:D("knight","#e8e0cc","#c9a24a","#ffe08a",["shield","crest"],{prop:"sword", emblem:"sun"})},
  or_dawn_cleric:{name:"Капелан Світанку", arch:"caster", side:"dawn", mend:true, lore:"Капелан, що лікує братів молитвою і палить ворогів світлом.", p:{hp:.9}, drop:[["dawn_sigil",.5]], design:D("robed","#efe6d0","#c9a24a","#ffe08a",["crown"],{prop:"staff"})},
  or_night_knight:{name:"Лицар Ночі", arch:"bruiser", side:"night", duel:true, lore:"Лицар у чорних латах із місяцем на нагруднику. За кодексом викликає на поєдинок сам на сам.", p:{hp:1.1, dmg:1.1}, drop:[["night_sigil",.4],["banner_scrap",.4]], design:D("knight","#3a3444","#6a3a8a","#c08aff",["horns","cape"],{prop:"sword", emblem:"moon"})},
  or_night_archer:{name:"Арбалетник Ночі", arch:"kiter", side:"night", lore:"Стріляє з-за щитів своїх лицарів. Болт пробиває кольчугу.", p:{dmg:1.05}, drop:[["night_sigil",.4]], design:D("elf","#2a2632","#4a3a5a","#c08aff",["cape"],{prop:"bow"})},
  or_squire:{name:"Зброєносець Ночі", arch:"chaser", side:"night", pack:true, lore:"Молодий зброєносець, що мріє про лицарські остроги. Нападає зграєю з товаришами.", p:{hp:.85, agi:1}, drop:[["banner_scrap",.5]], design:D("knight","#4a4652","#2a2632","#c08aff",[],{prop:"sword", size:.88})},
  or_dead_knight:{name:"Мертвий лицар", arch:"shielded", rise:true, lore:"Лицар, що впав в останній битві. Вже не пам'ятає, якому ордену служив, і б'є всіх.", p:{hp:1.2, def:1.3}, ward:["Освячена вода","Хрест"], drop:[["rusted_spur",.5],["banner_scrap",.3]], design:D("knight","#8a8676","#3a3a32","#7fffd0",["shield"],{prop:"sword"})},
  or_martyr:{name:"Мученик", arch:"caster", mend:true, aggro:true, lore:"Святий, що загинув у Соборі. Досі молиться, але молитва його стала прокляттям.", p:{hp:.9}, ward:["Освячена вода","Молитва"], drop:[["martyr_relic",.45]], design:D("robed","#d8d0c0","#8a2a2a","#fff0a0",["crown"])},
  or_warhound:{name:"Бойовий пес", arch:"chaser", pack:true, aggro:true, drain:8, lore:"Пес у шипастому нашийнику. Обидва ордени тримали таких, і обидва їх покинули.", p:{agi:2}, ward:["Вогонь","Срібло"], drop:[["hound_collar",.5]], design:D("beast","#2a2626","#141010","#ff5a2a",["claws","tail","fangs"])},
  or_ghost_horse:{name:"Вовкодав-примара", arch:"chaser", evade:15, aggro:true, lore:"Лицарський вовкодав, що загинув разом з господарем і досі його шукає. Прозорий, як туман, і такий самий невловимий.", p:{agi:3}, ward:["Освячена вода","Підкова"], drop:[["ghost_mane",.4]], design:D("beast","#cfe0ef","#8aa0b8","#ffffff",["tail"],{size:1.2})},
  or_bats:{name:"Нічні кажани", arch:"swarmer", aggro:true, evade:10, lore:"Кажани з веж Чорної Твердині. Злітають хмарою, щойно зайде сонце.", p:{hp:.55, dmg:.8, agi:3}, ward:["Вогонь","Срібло"], drop:[["midge_wings",.3]], design:D("bird","#2a2232","#140e1a","#ff3a6a",["wings"],{size:.75})},
  or_champion:{name:"Чемпіон Ристалища", arch:"bruiser", boss:true, duel:true, lore:"Непереможний чемпіон турнірів. Помер на ристалищі, але суперників досі чекає.", p:{dmg:1.05}, drop:[["night_dagger",.3],["tophelm",.3],["banner_scrap",1],["raw2",.6]], design:D("knight","#c9a24a","#7a1a1a","#ffe08a",["crest","crown","cape"],{prop:"sword", size:1.45})},
  or_grave_lord:{name:"Курганний Лицар", arch:"shielded", boss:true, rise:true, lore:"Лицар, що вибрався з братської могили першим. Підняв щит із прапорів обох орденів.", p:{}, ward:["Освячена вода","Хрест"], drop:[["plate_legs",.35],["rusted_spur",1],["raw2",.6]], design:D("knight","#9a9484","#2a2a24","#7fffd0",["shield","crown","cape"],{prop:"sword", size:1.5})},
  or_bannerman:{name:"Прапороносець Мертвих", arch:"summoner", boss:true, summon:"or_dead_knight", lore:"Він ніс прапор у першому ряду й досі кличе під нього мертвих.", p:{hp:.85, dmg:.92}, ward:["Освячена вода","Хрест"], drop:[["sabatons",.4],["banner_scrap",1],["raw2",.6]], design:D("knight","#8a8676","#6a1a1a","#7fffd0",["cape","crest"],{prop:"sword", size:1.45})},
  or_magister:{name:"Перший Магістр", arch:"caster", dboss:true, mend:true, summon:"or_martyr", lore:"Засновник Ордену Світанку. Похований під Собором, він устав, щоб покарати обидва ордени за братовбивчу війну.", p:{hp:.8, dmg:.92}, drop:[["magister_sword",.45],["dawn_shield",.3],["martyr_relic",1],["raw3",1]], design:D("knight","#f2ead6","#c9a24a","#fff0a0",["crown","cape"],{prop:"sword", emblem:"sun", size:1.8})},
  or_castellan:{name:"Кастелян Ночі", arch:"bruiser", dboss:true, lifesteal:.35, summon:"or_bats", lore:"Кастелян Чорної Твердині. Зачинив ворота й п'є кров усіх, хто до нього прийшов, і своїх, і чужих.", p:{hp:.9}, drop:[["castellan_blade",.45],["night_cloak",.3],["night_sigil",1],["raw3",1]], design:D("knight","#1e1a26","#5a1a3a","#ff3a6a",["horns","crown","cape"],{prop:"sword", emblem:"moon", size:1.85})},
});
for (const [id, m] of Object.entries(MOBS)) if (!m.id) prepMob(id, m);

/* ---------- речі ---------- */
Object.assign(ITEMS, {
  // зброя (blunt: булави й молоти дроблять кістки, скелети не повстають)
  bone_mace:{name:"Кістколомна булава", slot:"weapon", dmg:[20,25], str:1, blunt:true, price:2850, lvl:7},
  border_sword:{name:"Меч прикордонника", slot:"weapon", dmg:[23,28], agi:1, price:3650, lvl:8, sock:1},
  pernach:{name:"Пернач застави", slot:"weapon", dmg:[25,31], str:2, blunt:true, price:4700, lvl:9, sock:1},
  bog_harpoon:{name:"Болотяний гарпун", slot:"weapon", dmg:[24,32], agi:2, price:4400, lvl:9, sock:1},
  hunter_axe:{name:"Сокира ловця гідр", slot:"weapon", dmg:[28,35], str:2, price:6000, lvl:10, sock:1},
  dawn_hammer:{name:"Молот Світанку", slot:"weapon", dmg:[29,36], wil:2, blunt:true, price:6350, lvl:10, sock:1},
  night_blade:{name:"Клинок Ночі", slot:"weapon", dmg:[27,37], crit:3, price:6350, lvl:10, sock:1},
  king_scepter:{name:"Скіпетр Кісткового Короля", slot:"weapon", dmg:[30,38], str:3, wil:2, blunt:true, price:9100, lvl:9, sock:2, rare:true, unique:true},
  hydra_fang:{name:"Ікло Гідри-Матері", slot:"weapon", dmg:[30,39], agi:3, price:7800, lvl:10, sock:1, rare:true},
  magister_sword:{name:"Меч Першого Магістра", slot:"weapon", dmg:[33,40], str:2, wil:3, price:10400, lvl:10, sock:2, rare:true, unique:true},
  castellan_blade:{name:"Ніч-клинок Кастеляна", slot:"weapon", dmg:[32,43], agi:2, crit:5, price:11050, lvl:10, sock:2, rare:true, unique:true},
  // шоломи
  border_helm:{name:"Шишак прикордонника", slot:"helmet", def:5, hp:10, price:2350, lvl:8},
  bog_hood:{name:"Каптур перевізника", slot:"helmet", def:4, hp:16, agi:1, price:2100, lvl:8},
  tophelm:{name:"Топфгельм", slot:"helmet", def:7, hp:16, price:3500, lvl:10, sock:1},
  dawn_helm:{name:"Шолом Світанку", slot:"helmet", def:8, hp:20, wil:2, price:4050, lvl:10},
  night_helm:{name:"Шолом Ночі", slot:"helmet", def:6, hp:14, crit:2, price:4050, lvl:10},
  bone_crown:{name:"Корона Кісткового Короля", slot:"helmet", def:6, hp:40, wil:3, price:7800, lvl:9, sock:1, rare:true, unique:true},
  // обладунки
  border_mail:{name:"Кольчуга застави", slot:"armor", def:8, hp:20, price:3400, lvl:8},
  bog_leather:{name:"Шкірянка з жаболюда", slot:"armor", def:7, hp:30, agi:2, price:3650, lvl:9},
  plate:{name:"Латний нагрудник", slot:"armor", def:10, hp:30, price:4950, lvl:10, sock:1},
  dawn_plate:{name:"Біла лата Світанку", slot:"armor", def:11, hp:40, wil:2, price:5700, lvl:10},
  night_plate:{name:"Чорна лата Ночі", slot:"armor", def:9, hp:30, crit:3, price:5700, lvl:10},
  voivode_plate:{name:"Панцир Воєводи", slot:"armor", def:10, hp:30, str:2, price:5850, lvl:8, sock:1, rare:true},
  // чоботи
  border_boots:{name:"Окуті чоботи", slot:"boots", def:4, agi:1, price:1950, lvl:8},
  bog_boots:{name:"Болотяні ходаки", slot:"boots", def:3, hp:12, bog:true, price:1800, lvl:7},
  sabatons:{name:"Латні сабатони", slot:"boots", def:4, hp:12, price:3000, lvl:10},
  // наголінники
  border_legs:{name:"Пластинчасті наголінники", slot:"legs", def:4, hp:18, price:2200, lvl:8},
  plate_legs:{name:"Латні наголінники", slot:"legs", def:4, hp:24, price:3250, lvl:10},
  dawn_legs:{name:"Наголінники Світанку", slot:"legs", def:4, hp:28, wil:1, price:3650, lvl:10},
  // рукавиці
  border_gloves:{name:"Латні рукавиці", slot:"gloves", def:2, str:2, price:1950, lvl:8},
  breaker_gloves:{name:"Рукавиці кістколома", slot:"gloves", str:3, crit:2, price:2750, lvl:9},
  // плащі
  border_cloak:{name:"Плащ прикордонника", slot:"cloak", hp:20, agi:2, wil:1, price:1950, lvl:8},
  crow_cloak:{name:"Плащ із воронячого пір'я", slot:"cloak", hp:24, agi:3, crit:2, price:4550, lvl:9, sock:1, rare:true},
  night_cloak:{name:"Плащ Ночі", slot:"cloak", hp:26, agi:3, crit:2, price:3650, lvl:10},
  // пояси
  skull_belt:{name:"Пояс із черепами", slot:"belt", hp:22, str:2, def:1, price:2450, lvl:9},
  bog_belt:{name:"Пояс трясовинника", slot:"belt", hp:28, agi:2, str:1, price:3000, lvl:9, sock:1},
  // друга рука
  tower_shield:{name:"Баштовий щит", slot:"offhand", def:4, hp:22, price:2450, lvl:8},
  dawn_shield:{name:"Щит Сонця", slot:"offhand", def:6, hp:32, wil:2, price:4150, lvl:10},
  night_dagger:{name:"Кинджал лівої руки", slot:"offhand", str:2, crit:3, agi:1, price:3400, lvl:10},
  // персні й амулети
  bone_ring:{name:"Перстень з кістки", slot:"ring", hp:30, wil:2, price:2200, lvl:8},
  coven_ring:{name:"Перстень Ковену", slot:"ring", crit:3, wil:3, hp:10, price:4200, lvl:9, rare:true},
  night_ring:{name:"Перстень Ночі", slot:"ring", hp:24, crit:3, price:3900, lvl:10},
  bell_amulet:{name:"Ладанка дзвонаря", slot:"amulet", hp:32, wil:3, price:2350, lvl:8},
  hydra_eye:{name:"Око Гідри", slot:"amulet", hp:50, agi:2, price:5850, lvl:10, sock:1, rare:true},
  // зілля
  potion_xl:{name:"Зілля чорного меду", use:{hp:380}, price:100, lvl:7, cat:"use"},
  bog_tincture:{name:"Настоянка багна", buff:{bog:1}, bn:8, price:100, lvl:7, cat:"use"},
  // трофеї
  bonemeal:{name:"Кістяне борошно", price:40}, skull:{name:"Цілий череп", price:60}, hound_fang:{name:"Ікло кістяного пса", price:45},
  grave_iron:{name:"Могильне залізо", price:70}, bell_shard:{name:"Уламок дзвона", price:80}, crow_feather:{name:"Трупне перо", price:35}, giant_bone:{name:"Кістка велетня", price:120},
  frog_skin:{name:"Шкіра жаболюда", price:45}, leech_slime:{name:"П'явчача слина", price:40}, peat_heart:{name:"Торф'яне серце", price:90}, serpent_fang:{name:"Зміїне ікло", price:70},
  witch_hair:{name:"Відьмине пасмо", price:90}, hydra_scale:{name:"Луска гідри", price:110}, marsh_light:{name:"Болотяний вогник", price:60}, midge_wings:{name:"Крильця мошкари", price:25},
  drowned_cross:{name:"Утоплений хрестик", price:80}, willow_bark:{name:"Плакуча кора", price:70},
  banner_scrap:{name:"Обривок прапора", price:55}, dawn_sigil:{name:"Знак Світанку", price:90}, night_sigil:{name:"Знак Ночі", price:90}, rusted_spur:{name:"Іржава острога", price:60},
  martyr_relic:{name:"Мощі мученика", price:100}, hound_collar:{name:"Шипастий нашийник", price:50}, ghost_mane:{name:"Примарна шерсть", price:120},
});
for (const [id, it] of Object.entries(ITEMS)) if (!it.id) prepItem(id, it);
Object.assign(SETS, {
  zastava:{name:"Комплект Застави", items:["border_helm","border_mail","border_boots","border_legs","border_gloves"], bonus:{2:{def:4}, 4:{hp:50}, 5:{str:3, dmgp:5}}},
  dawn:{name:"Комплект Світанку", items:["dawn_helm","dawn_plate","dawn_shield","dawn_hammer","dawn_legs"], bonus:{2:{wil:3, hp:30}, 4:{def:6}, 5:{dmgp:8, hp:40}}},
  night:{name:"Комплект Ночі", items:["night_helm","night_plate","night_blade","night_cloak","night_ring"], bonus:{2:{crit:3}, 4:{agi:3, dmgp:6}, 5:{crit:4, dmgp:6}}},
});
for (const k of ["zastava","dawn","night"]) for (const id of SETS[k].items) ITEMS[id].set = k;
Object.assign(SHOPS, {
  gnat:["potion_l","potion_xl","bone_mace","border_sword","pernach","border_helm","border_mail","border_boots","border_legs","border_gloves","breaker_gloves","skull_belt","tower_shield","bone_ring","border_cloak"],
  varlaam:["potion_l","potion_xl","potion_xe","w_water","w_prayer","w_bell","w_cross","w_iron","w_chalk","w_salt","scroll_fire","elix_wil","bell_amulet"],
  gordiy:["bog_tincture","potion_xl","potion_xe","bog_boots","bog_hood","bog_leather","bog_harpoon","bog_belt","w_torch","w_salt","scroll_fire","elix_skin"],
  omelko:["bog_tincture","potion_l","potion_xl","h4","elix_agi","elix_str","w_polyn","w_ruta","w_salt"],
  kylyna:["potion_xl","potion_xe","w_prayer","w_water","hunter_axe","tophelm","plate","sabatons","plate_legs","scroll_storm","scroll_curse","elix_str","zhyvytsia"],
  dawn_qm:["dawn_helm","dawn_plate","dawn_shield","dawn_hammer","dawn_legs","potion_xl","w_water","w_prayer"],
  night_qm:["night_helm","night_plate","night_blade","night_cloak","night_ring","night_dagger","potion_xl"],
});
SMITHS.push("gnat");
RECIPES.push({id:"r_bt", prof:"alch", lv:6, in:{h4:1, f3:1}, out:"bog_tincture"}, {id:"r_px2", prof:"alch", lv:8, in:{h4:2, h5:1}, out:"potion_xl"});
Object.assign(ITEM_IC, {
  bone_mace:"spiked-mace", border_sword:"broadsword", pernach:"flanged-mace", bog_harpoon:"harpoon-trident", hunter_axe:"battle-axe", dawn_hammer:"warhammer", night_blade:"crescent-blade",
  king_scepter:"skull-staff", hydra_fang:"bestial-fangs", magister_sword:"sun", castellan_blade:"bloody-sword",
  border_helm:"visored-helm", bog_hood:"hood", tophelm:"closed-barbute", dawn_helm:"crested-helmet", night_helm:"horned-helm", bone_crown:"crown",
  border_mail:"chain-mail", bog_leather:"leather-vest", plate:"breastplate", dawn_plate:"breastplate", night_plate:"breastplate", voivode_plate:"breastplate",
  border_boots:"metal-boot", bog_boots:"leather-boot", sabatons:"metal-boot", border_legs:"leg-armor", plate_legs:"leg-armor", dawn_legs:"leg-armor",
  border_gloves:"gauntlet", breaker_gloves:"mailed-fist", border_cloak:"cape", crow_cloak:"feathered-wing", night_cloak:"cape", skull_belt:"belt-armor", bog_belt:"belt",
  tower_shield:"checked-shield", dawn_shield:"sun", night_dagger:"plain-dagger", bone_ring:"ring", coven_ring:"ring", night_ring:"ring", bell_amulet:"ringing-bell", hydra_eye:"eye-target",
  potion_xl:"heart-bottle", bog_tincture:"potion-ball", w_prayer:"book-cover",
  bonemeal:"powder", skull:"skull-crossed-bones", hound_fang:"fangs", grave_iron:"metal-scales", bell_shard:"ringing-bell", crow_feather:"feather", giant_bone:"broken-bone",
  frog_skin:"animal-hide", leech_slime:"powder", peat_heart:"stone-sphere", serpent_fang:"fangs", witch_hair:"rolled-cloth", hydra_scale:"fish-scales", marsh_light:"crystal-shine",
  midge_wings:"feather", drowned_cross:"medal", willow_bark:"rolled-cloth", banner_scrap:"rolled-cloth", dawn_sigil:"sun", night_sigil:"moon", rusted_spur:"metal-scales",
  martyr_relic:"crystal-shine", hound_collar:"medal", ghost_mane:"rolled-cloth",
});

/* ---------- персонажі ---------- */
Object.assign(NPCS, {
  bogdan:{name:"Сотник Богдан", letter:"Б", role:"сотник Застави Кордон", quests:["mk_q1","mk_q2","mk_q3","mk_q4","mk_q5","mk_q6","mk_q7"], hello:"Тридцять років тримаю кордон. Раніше від живих, тепер від мертвих. Мертві гірші: не втомлюються й не продаються."},
  gnat:{name:"Коваль Гнат Кістколом", letter:"Г", role:"коваль Застави Кордон", quests:["mk_g1","mk_g2","mk_g3"], shop:"gnat", hello:"Меч скелета розсікає, а він збирається назад. Булава дробить, і вже не збереться. Бери булаву, дурню."},
  varlaam:{name:"Отець Варлаам", letter:"В", role:"ігумен Монастиря Дзвонарів", quests:["mk_v1","mk_v2","mk_v3"], shop:"varlaam", heal:true, hello:"Поки дзвонять наші дзвони, мертві не переступають монастирського муру. Але дзвонарів у нас усе менше."},
  yavdokha:{name:"Старійшина Явдоха", letter:"Я", role:"старійшина Багнища", quests:["bg_q1","bg_q2","bg_q3","bg_q4","bg_q5","bg_q6"], hello:"Колись тут були луки й сінокоси. Потім прийшла вода, а за водою туман. А в тумані сестри."},
  gordiy:{name:"Перевізник Гордій", letter:"Г", role:"човняр і крамар Багнища", quests:["bg_h1","bg_h2","bg_h3"], shop:"gordiy", hello:"Без ходаків у Трясовині ти мрець. Туман лізе в легені, а багно тягне силу. Купуй ходаки, не скупися."},
  omelko:{name:"Знахар Омелько", letter:"О", role:"знахар з Рибальської стоянки", quests:["bg_o1","bg_o2","bg_o3"], shop:"omelko", heal:true, hello:"Настоянка багна: полин, арніка й риб'ячий жир. Гидка, зате туман після неї тебе не бере."},
  oleksa:{name:"Герольд Олекса", letter:"О", role:"герольд обох орденів", quests:["or_h1","or_h2","or_h3"], herald:true, hello:"Я служу обом орденам і жодному. Записую присяги, рахую мертвих і оголошую поєдинки. Хочеш присягнути?"},
  kylyna:{name:"Маркітантка Килина", letter:"К", role:"маркітантка Перехрестя Мечів", quests:["or_k1","or_k2"], shop:"kylyna", heal:true, hello:"Мені однаково, чий ти. Срібло в обох орденів однакове. Лати, сувої, зілля: бери, поки ще живий."},
  yaropolk:{name:"Командор Ярополк", letter:"Я", role:"командор Ордену Світанку", quests:["or_d1","or_d2","or_d3","or_d4"], shop:"dawn_qm", shopOrder:"dawn", hello:"Світанок приходить щоранку, хоч би якою довгою була ніч. Так і наш орден: його не можна перемогти, можна лише відкласти."},
  veresk:{name:"Лорд-командор Вереск", letter:"В", role:"лорд-командор Ордену Ночі", quests:["or_n1","or_n2","or_n3","or_n4"], shop:"night_qm", shopOrder:"night", hello:"Ніч не просить дозволу. Вона приходить і бере своє. Ти з тих, хто бере, чи з тих, у кого беруть?"},
});
NPCS.dmytro.quests.push("dmytro_east"); NPCS.yarema.quests.push("yarema_bog"); NPCS.ivan.quests.push("ivan_orders");

/* ---------- квести ---------- */
Object.assign(QUESTS, {
  // мости зі старих земель
  dmytro_east:{name:"Шлях на схід", giver:"dmytro", minLvl:7, text:"За Чорногорою на схід лежить Кістяна Марка. Звідти ходять мертві, і сотник Богдан з Застави Кордон кличе всіх, хто вміє тримати зброю. Дійди до Застави.", goal:{visit:"mk_fort", n:1}, reward:{cop:520, xp:150, items:{potion_xl:2}}},
  yarema_bog:{name:"Що за Болотом Шепоту", giver:"yarema", minLvl:7, text:"На південь від Болота Шепоту лежить Чорна Трясовина. Мої розвідники не вернулися. Знайди село на палях і старійшину Явдоху.", goal:{visit:"bg_village", n:1}, reward:{cop:520, xp:150, items:{bog_tincture:3}}},
  ivan_orders:{name:"Два ордени", giver:"ivan", minLvl:8, text:"На південь від Воловеччини два лицарські ордени досі воюють на полі, де давно мали б помиритися. Дійди до Перехрестя Мечів і поговори з герольдом.", goal:{visit:"or_cross", n:1}, reward:{cop:520, xp:150, items:{potion_xl:2}}},
  // Кістяна Марка: сотник Богдан, «Хто будить мертвих?»
  mk_q1:{name:"Кістки на тракті", giver:"bogdan", text:"Хто будить мертвих? Почнемо з того, що поблизу. На Тракті Хрестів скелети-воїни перекрили дорогу. Розбий шістьох.", goal:{kill:"mk_warrior", n:6}, reward:{cop:840, xp:220, choice:[{item:"bone_mace"},{item:"border_helm"},{item:"potion_xl", n:4}]}},
  mk_q2:{name:"Пси воєводи", giver:"bogdan", req:"mk_q1", text:"У Мертвому Липовому кістяні пси розривають кожного, хто йде з того боку. Восьмеро, і село наше.", goal:{kill:"mk_hound", n:8}, reward:{cop:980, xp:250, choice:[{item:"border_boots"},{item:"border_gloves"},{item:"w_water", n:5}]}},
  mk_q3:{name:"Хто дзвонить у дзвони?", giver:"bogdan", req:"mk_q2", text:"На Кістяному млині дзвонять мертві дзвонарі. Їхній дзвін піднімає кістки по всій окрузі. Заглуш чотирьох.", goal:{kill:"mk_bellringer", n:4}, reward:{cop:1100, xp:280, item:"bell_amulet"}},
  mk_q4:{name:"Курган Воєводи", giver:"bogdan", req:"mk_q3", text:"Дзвонарі дзвонили на наказ воєводи. Він устав зі свого кургану й веде дружину. Набий у Кургані досить мертвих, і воєвода вийде сам. Поклади його.", goal:{kill:"mk_voivode", n:1}, reward:{cop:1620, xp:400, choice:[{item:"border_mail"},{item:"tower_shield"},{item:"gem_ruby2", n:2}]}},
  mk_q5:{name:"Сто Черепів", giver:"bogdan", req:"mk_q4", text:"Воєвода, вмираючи вдруге, прохрипів про Оссуарій. Там сто черепів шепочуть, хто їх розбудив. Спустися й заткни їм рота.", goal:{dungeon:"ossuary", n:1}, reward:{cop:2280, xp:500, choice:[{item:"pernach"},{item:"voivode_plate"},{item:"gem_topaz3"}]}},
  mk_q6:{name:"Вороняча вежа", giver:"bogdan", req:"mk_q5", text:"Черепи назвали ім'я: Некромант Ворон. Він сидить у вежі за Курганом. Зачисти вежу, поки він не вийде сам, і вбий його.", goal:{kill:"mk_necro", n:1}, reward:{cop:1950, xp:450, perk:{wil:3}}, perkText:"+3 волі назавжди"},
  mk_q7:{name:"Кістковий Король", giver:"bogdan", req:"mk_q6", text:"Ворон служив Королю. Під Кістяною Цитаделлю сидить на троні князь Старої Марки, і доки він там, мертві не спатимуть. Спустися в Склеп і скинь його з трону.", goal:{dungeon:"bone_crypt", n:1}, reward:{cop:3250, xp:650, perk:{hp:40, dmg:4}}, perkText:"+40 здоров'я і +4% урону назавжди"},
  // коваль Гнат
  mk_g1:{name:"Кістяне борошно", giver:"gnat", text:"Кістяне борошно добре для гарту: сталь виходить пружна. Принеси вісім мішечків, а я подарую тобі булаву, яка кістки дробить.", goal:{item:"bonemeal", n:8}, reward:{cop:390, xp:180, item:"bone_mace"}},
  mk_g2:{name:"Могильне залізо", giver:"gnat", req:"mk_g1", text:"Лати кістяних лицарів з доброго заліза, тільки іржаві. Принеси шість шматків могильного заліза з Кургану чи мурів.", goal:{item:"grave_iron", n:6}, reward:{cop:1040, xp:250, choice:[{item:"breaker_gloves"},{item:"skull_belt"},{item:"border_legs"}]}},
  mk_g3:{name:"Сторож Хрестів", giver:"gnat", req:"mk_g2", text:"На Полі Ста Хрестів ходить велетень і рахує могили. Його кістки міцніші за сталь. Убий його й принеси мені вістку, а я тебе навчу бити так, щоб ламалося.", goal:{kill:"mk_watcher", n:1}, reward:{cop:1690, xp:400, perk:{dmg:4}}, perkText:"+4% урону назавжди"},
  // отець Варлаам
  mk_v1:{name:"Перо для літопису", giver:"varlaam", text:"Наш літописець пише лише трупним пером: каже, тоді мертві читати не можуть. Принеси десять пір'їн з воронів.", goal:{item:"crow_feather", n:10}, reward:{cop:580, xp:200, items:{w_water:4, w_bell:2}}},
  mk_v2:{name:"Тиша для дзвонів", giver:"varlaam", req:"mk_v1", text:"Рої черепів злітаються на звук наших дзвонів і б'ються об мури. Розбий десятьох, щоб дзвонарі могли дзвонити спокійно.", goal:{kill:"mk_swarm", n:10}, reward:{cop:1040, xp:280, choice:[{item:"bell_amulet"},{item:"elix_wil", n:4},{item:"scroll_ward", n:2}]}},
  mk_v3:{name:"Освячена земля", giver:"varlaam", req:"mk_v2", text:"Земля Марки не освячена вже сто років. Зачисти два райони, щоб ми могли пройти з хрестом і кропилом.", goal:{clearAny:"mark", n:2}, reward:{cop:1560, xp:400, perk:{wil:2, hp:20}}, perkText:"+2 волі і +20 здоров'я назавжди"},
  // Чорна Трясовина: старійшина Явдоха, «Туман над Трясовиною»
  bg_q1:{name:"Гать без п'явок", giver:"yavdokha", text:"Почнемо з гаті: по ній ходять наші діти. П'явки повилазили на колоди й п'ють кожного, хто йде. Убий шістьох.", goal:{kill:"bg_leech", n:6}, reward:{cop:840, xp:220, choice:[{item:"bog_boots"},{item:"bog_tincture", n:6},{item:"potion_xl", n:3}]}},
  bg_q2:{name:"Жаболюди з Плавнів", giver:"yavdokha", req:"bg_q1", text:"Жаболюди крадуть сіті й людей. Вісьмох, і вони забудуть дорогу до села.", goal:{kill:"bg_frogman", n:8}, reward:{cop:980, xp:250, choice:[{item:"bog_hood"},{item:"bog_belt"},{item:"gem_emer2", n:2}]}},
  bg_q3:{name:"Що сталося з селом", giver:"yavdokha", req:"bg_q2", text:"Наше старе село пішло під воду за одну весну. Ніхто не знає чому. Дійди туди й подивися.", goal:{visit:"bg_sunk", n:1}, reward:{cop:650, xp:200, items:{bog_tincture:4}}},
  bg_q4:{name:"Три сестри", giver:"yavdokha", req:"bg_q3", text:"Утопленики шепочуть одне: сестри. Ковен у хаті на курячих лапах варить туман. Набий там досить нечисті, і Старша Сестра вийде. Убий її, і туман порідшає.", goal:{kill:"bg_eldest", n:1}, reward:{cop:1690, xp:420, choice:[{item:"bog_leather"},{item:"bog_harpoon"},{item:"gem_ame2", n:2}]}},
  bg_q5:{name:"Абатство під водою", giver:"yavdokha", req:"bg_q4", text:"Сестри впустили воду не самі. Їм відчинив шлюзи абат затопленого абатства. Спустися в його крипту.", goal:{dungeon:"abbey", n:1}, reward:{cop:2470, xp:550, choice:[{item:"hydra_eye"},{item:"coven_ring"},{item:"gem_sapph3"}]}},
  bg_q6:{name:"Мати всіх голів", giver:"yavdokha", req:"bg_q5", text:"Лишилася вона. Гідра-Мати в Лігві: поки вона жива, гідри плодяться в кожній калюжі. Принось вогонь, бо голови відростають.", goal:{kill:"bg_hydra_mother", n:1}, reward:{cop:3250, xp:650, perk:{hp:40, crit:3}}, perkText:"+40 здоров'я і +3% криту назавжди"},
  // перевізник Гордій
  bg_h1:{name:"Шкура на ходаки", giver:"gordiy", text:"Ходаки шию з шкіри жаболюдів: вона не пропускає ні води, ні туману. Принеси шість шкір, і одна пара твоя.", goal:{item:"frog_skin", n:6}, reward:{cop:320, xp:180, item:"bog_boots"}},
  bg_h2:{name:"Мошкара над островом", giver:"gordiy", req:"bg_h1", text:"На Острові Мошкари моя стара пристань, а мошкара жере людей. Розжени дванадцять хмар.", goal:{kill:"bg_midge", n:12}, reward:{cop:1100, xp:280, choice:[{item:"bog_belt"},{item:"bog_hood"},{cop:1430}]}},
  bg_h3:{name:"Торф для печі", giver:"gordiy", req:"bg_h2", text:"Торф'яне серце горить цілий тиждень. Чотири, і всю зиму в Багнищі буде тепло.", goal:{item:"peat_heart", n:4}, reward:{cop:1300, xp:300, choice:[{item:"bog_harpoon"},{item:"bog_leather"},{item:"gem_ruby2", n:2}]}},
  // знахар Омелько
  bg_o1:{name:"Зміїна отрута", giver:"omelko", text:"Із зміїного ікла роблю протиотруту для всього Багнища. Принеси п'ять.", goal:{item:"serpent_fang", n:5}, reward:{cop:580, xp:200, items:{bog_tincture:5, potion_xl:2}}},
  bg_o2:{name:"Гірська арніка", giver:"omelko", req:"bg_o1", text:"Арніка в Трясовині не росте, а без неї настоянки не звариш. Принеси шість пучків з гір чи з Плакучих Верб.", goal:{item:"h4", n:6}, reward:{cop:780, xp:250, choice:[{item:"elix_agi", n:3},{item:"elix_str", n:3},{item:"bog_tincture", n:8}]}},
  bg_o3:{name:"Чорна П'явиця", giver:"omelko", req:"bg_o2", text:"У Чорному Оці живе королева п'явок. Вона п'є з Трясовини саме життя. Зачисти озеро, поки вона не випливе, і вбий її.", goal:{kill:"bg_leech_queen", n:1}, reward:{cop:1820, xp:450, perk:{hp:30}}, perkText:"+30 здоров'я назавжди"},
  // Землі Світанку й Ночі: герольд Олекса
  or_h1:{name:"Вісті з поля", giver:"oleksa", text:"Перш ніж присягати, подивися, за що воюють. Піди на Поле Останньої Битви й повернись живим.", goal:{visit:"or_field", n:1}, reward:{cop:520, xp:180, items:{potion_xl:2}}},
  or_h2:{name:"Мертві не розрізняють прапорів", giver:"oleksa", req:"or_h1", text:"Мертві лицарі б'ють і білих, і чорних. Це спільна біда. Поклади вісьмох, і обидва ордени будуть тобі вдячні.", goal:{kill:"or_dead_knight", n:8}, reward:{cop:1170, xp:300, choice:[{item:"sabatons"},{item:"plate_legs"},{item:"w_water", n:6}]}},
  or_h3:{name:"Ристалище", giver:"oleksa", req:"or_h2", text:"Чемпіон Ристалища досі чекає суперника. Набий на ристалищі досить зброєносців і лицарів, і він вийде. Переможи його за всіма правилами.", goal:{kill:"or_champion", n:1}, reward:{cop:2080, xp:500, perk:{crit:3}}, perkText:"+3% криту назавжди"},
  // маркітантка Килина
  or_k1:{name:"Прапори на продаж", giver:"kylyna", text:"Обривки прапорів купують і білі, і чорні: кожен хоче показати, скільки ворогів побив. Принеси десять.", goal:{item:"banner_scrap", n:10}, reward:{cop:1040, xp:250, choice:[{item:"tophelm"},{item:"plate"},{cop:1560}]}},
  or_k2:{name:"Прапороносець Мертвих", giver:"kylyna", req:"or_k1", text:"У Кривавому Рові мертвий прапороносець скликає мертвих. Поки він там, мої вози не проїдуть. Розберися.", goal:{kill:"or_bannerman", n:1}, reward:{cop:1950, xp:480, choice:[{item:"hunter_axe"},{item:"plate"},{item:"gem_onyx3"}]}},
  // Орден Світанку
  or_d1:{name:"Перший обов'язок", giver:"yaropolk", order:"dawn", text:"Лицарі Ночі нападають на наші дозори. Поклади шістьох, брате.", goal:{kill:"or_night_knight", n:6}, reward:{cop:1300, xp:300, choice:[{item:"dawn_helm"},{item:"dawn_legs"},{item:"potion_xl", n:5}]}},
  or_d2:{name:"Мученики Собору", giver:"yaropolk", order:"dawn", req:"or_d1", text:"Наші святі встали з могил і молитвою піднімають мертвих. Це ганьба для ордену. Упокой вісьмох мучеників.", goal:{kill:"or_martyr", n:8}, reward:{cop:1560, xp:350, choice:[{item:"dawn_shield"},{item:"dawn_plate"},{item:"gem_ruby3"}]}},
  or_d3:{name:"Штурм Чорної Твердині", giver:"yaropolk", order:"dawn", req:"or_d2", text:"Кастелян Ночі зачинився в Твердині й п'є кров полонених. Візьми Твердиню, і війна скінчиться нашою перемогою.", goal:{dungeon:"night_keep", n:1}, reward:{cop:2920, xp:600, choice:[{item:"dawn_hammer"},{item:"dawn_plate"},{item:"dawn_shield"}]}},
  or_d4:{name:"Спокій Першого Магістра", giver:"yaropolk", order:"dawn", req:"or_d3", text:"Найважче лишилося. Наш засновник, Перший Магістр, устав під Собором. Він був нашим світлом. Дай йому спокій.", goal:{dungeon:"catacomb", n:1}, reward:{cop:3580, xp:700, perk:{hp:50, wil:3}}, perkText:"+50 здоров'я і +3 волі назавжди"},
  // Орден Ночі
  or_n1:{name:"Ціна присяги", giver:"veresk", order:"night", text:"Присяга Ночі пишеться кров'ю. Чужою. Поклади шістьох лицарів Світанку.", goal:{kill:"or_dawn_knight", n:6}, reward:{cop:1300, xp:300, choice:[{item:"night_helm"},{item:"night_ring"},{item:"potion_xl", n:5}]}},
  or_n2:{name:"Курганний Лицар", giver:"veresk", order:"night", req:"or_n1", text:"У братській могилі підвівся лицар з нашим місяцем на щиті. Він ганьбить орден. Поклади його назад.", goal:{kill:"or_grave_lord", n:1}, reward:{cop:1690, xp:380, choice:[{item:"night_cloak"},{item:"night_plate"},{item:"gem_topaz3"}]}},
  or_n3:{name:"Катакомби під Собором", giver:"veresk", order:"night", req:"or_n2", text:"Під Собором Світанку спить їхній Перший Магістр. Поки він там, світляки вірять у своє світло. Спустися в Катакомби й забери в них цю віру.", goal:{dungeon:"catacomb", n:1}, reward:{cop:2920, xp:600, choice:[{item:"night_blade"},{item:"night_plate"},{item:"night_dagger"}]}},
  or_n4:{name:"Зрада Кастеляна", giver:"veresk", order:"night", req:"or_n3", text:"Наш кастелян збожеволів і зачинив Твердиню навіть від нас. П'є кров і своїх, і чужих. Орден не прощає зради.", goal:{dungeon:"night_keep", n:1}, reward:{cop:3580, xp:700, perk:{crit:4, dmg:4}}, perkText:"+4% криту і +4% урону назавжди"},
});

/* ---------- підземелля ---------- */
Object.assign(DUNGEONS, {
  ossuary:{name:"Оссуарій Ста Черепів", node:"mk_ossuary", lvl:8, rooms:6, pool:["mk_warrior","mk_archer","mk_swarm","mk_hound"], boss:"mk_skullpile", scene:"ossuary", text:"Склепіння з черепів, підлога з кісток. Усі сто черепів дивляться на тебе."},
  bone_crypt:{name:"Склеп Кісткового Короля", node:"mk_throne", lvl:9, rooms:7, pool:["mk_knight","mk_mage","mk_warrior","mk_giant"], boss:"mk_bone_king", scene:"bonecrypt", text:"Тронна зала під Кістяною Цитаделлю. Король чекає на тебе сто років."},
  abbey:{name:"Затоплене Абатство", node:"bg_abbey", lvl:10, rooms:7, pool:["bg_monk","bg_drowned","bg_leech","bg_serpent"], boss:"bg_abbot", scene:"abbey", text:"Крипта по коліна у воді. Під склепіннями досі співають утоплені ченці."},
  catacomb:{name:"Катакомби Світанку", node:"or_cathedral", lvl:10, rooms:7, pool:["or_martyr","or_dead_knight","or_ghost_horse","or_dawn_cleric"], boss:"or_magister", scene:"catacomb", text:"Білі катакомби під Собором. Світло тут не гріє, а сліпить."},
  night_keep:{name:"Чорна Твердиня", node:"or_keep", lvl:10, rooms:8, pool:["or_night_knight","or_night_archer","or_warhound","or_bats","or_squire"], boss:"or_castellan", scene:"nightkeep", text:"Коридори Чорної Твердині. Кастелян чекає в тронній залі, і на підлозі там не вино."},
});

/* ---------- ціни, досягнення ---------- */
Object.assign(REG_PRICE, {mark:{herb:1.2, mine:.9, fish:1.25, misc:.9}, bog:{herb:.85, mine:1.3, fish:.8, misc:1.05}, ord:{herb:1.15, mine:1.1, fish:1.2, misc:1.2}});
ACH.push(
  {id:"o1", icon:"crossed-swords", name:"Присяга", text:"Присягнути одному з орденів", val:() => S.order ? 1 : 0, n:1, rew:{hp:20}},
  {id:"mk1", icon:"crowned-skull", name:"Король без трону", text:"Скинути Кісткового Короля", val:() => S.dung.bone_crypt || 0, n:1, rew:{dmg:2}},
  {id:"bg1", icon:"hydra", name:"Гідроборець", text:"Здолати Гідру-Матір", val:() => S.quests.bg_q6 && S.quests.bg_q6.st === "done" ? 1 : 0, n:1, rew:{crit:1}},
  {id:"nw1", icon:"treasure-map", name:"Три краї", text:"Побувати в Марці, Трясовині й Землях орденів", val:() => ["mark","bog","ord"].filter(r => Object.keys(S.visited).some(k => NODES[k] && NODES[k].r === r)).length, n:3, rew:{cop:3000}},
);

/* ---------- карта світу: нові краї й незвідані землі ---------- */
function mapExtra(r){
  let s = "";
  // Кістяна Марка: хрести, кістки, мури, цитадель, вежа некроманта
  const crs = []; for (let i = 0; i < 70; i++){ const x = 2920 + r() * 800, y = 60 + r() * 820; if (Math.abs(x - 3530) < 40) continue; crs.push([x, y]); } crs.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of crs) s += maCross(x, y, .8 + r() * .3, "#4a3e30");
  let bn = ""; for (let i = 0; i < 40; i++){ const x = 2920 + r() * 800, y = 60 + r() * 820; bn += `M${x - 5} ${y}l10 3M${x + 4} ${y - 3}l-7 6 `; } s += `<path d="${bn}" stroke="#e6dcc4" stroke-width="1.6" fill="none" opacity=".4"/>`;
  s += `<path d="M3700 40 L3690 200 L3712 330 L3696 470" fill="none" stroke="#3a3630" stroke-width="12" stroke-dasharray="26 8"/><path d="M3700 40 L3690 200 L3712 330 L3696 470" fill="none" stroke="#8a8270" stroke-width="5" stroke-dasharray="26 8"/>`;
  // Чорна Трясовина: калюжі, очерет, туман
  for (let i = 0; i < 30; i++){ const x = 960 + r() * 880, y = 1000 + r() * 520, rx = 16 + r() * 38; if (Math.abs(x - 1880) < 60) continue; s += maPool(x, y, rx, rx * .38); if (r() < .6) s += `<ellipse cx="${x + rx * .3}" cy="${y + 1}" rx="3" ry="1.3" fill="#4e6a34"/><ellipse cx="${x - rx * .4}" cy="${y - 2}" rx="2.4" ry="1.1" fill="#4e6a34"/>`; }
  for (let i = 0; i < 70; i++) s += maReeds(940 + r() * 900, 980 + r() * 560, 5, r);
  let mist = ""; for (let i = 0; i < 10; i++) mist += `<ellipse cx="${960 + r() * 880 | 0}" cy="${1000 + r() * 520 | 0}" rx="${120 + r() * 120 | 0}" ry="${22 + r() * 18 | 0}" fill="#dfe8e0" opacity=".12"/>`;
  s += `<g filter="url(#blwm)">${mist}</g>`;
  const dts = []; for (let i = 0; i < 46; i++) dts.push([930 + r() * 920, 990 + r() * 560]); dts.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of dts) s += r() < .5 ? maTree(x, y, 3.5 + r() * 2, "dead", "") : maTree(x, y, 4 + r() * 2, "leaf", "#3a4a2a");
  // Землі Світанку й Ночі: прапори обох орденів, зламані списи, собор і твердиня
  let sp = ""; for (let i = 0; i < 60; i++){ const x = 1960 + r() * 860, y = 990 + r() * 540; sp += `M${x} ${y}l${r() * 10 - 5} -14 `; } s += `<path d="${sp}" stroke="#2a2218" stroke-width="1.8" fill="none" opacity=".8"/>`;
  for (let i = 0; i < 22; i++){ const x = 1960 + r() * 860, y = 1000 + r() * 520, dawn = x < 2400 ? r() < .75 : r() < .25;
    s += `<path d="M${x} ${y}v-22" stroke="#2a2218" stroke-width="2"/><path d="M${x} ${y - 22}h12l-3 5 3 5h-12z" fill="${dawn ? "#e8dcb0" : "#3a2a4a"}"/><circle cx="${x + 6}" cy="${y - 17}" r="2" fill="${dawn ? "#c9a24a" : "#c0a6e0"}"/>`; }
  return s;
}

/* ---------- сцени: нові споруди ---------- */
const shd = (x, y, rx, ry = 8, o = .3) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}"/>`;
const crossSVG = (x, y, s, c = "#4a3a2a") => `${shd(x + 4 * s, y + 1, 10 * s, 3 * s, .25)}<path d="M${x - 1.6 * s} ${y}v-${24 * s}h${3.2 * s}v${24 * s}z" fill="${c}"/><path d="M${x - 8 * s} ${y - 17 * s}h${16 * s}v${3 * s}h-${16 * s}z" fill="${shade(c, 1.15)}"/>`;
const skullSVG = (x, y, s) => `<circle cx="${x}" cy="${y - 4 * s}" r="${4.5 * s}" fill="#e6dcc4"/><path d="M${x - 3 * s} ${y - 1 * s}h${6 * s}v${3 * s}h-${6 * s}z" fill="#e6dcc4"/><circle cx="${x - 1.7 * s}" cy="${y - 4.5 * s}" r="${1.2 * s}" fill="#1a1612"/><circle cx="${x + 1.7 * s}" cy="${y - 4.5 * s}" r="${1.2 * s}" fill="#1a1612"/>`;
const flagSVG = (x, y, c, c2, h = 70) => `<path d="M${x} ${y}v-${h}" stroke="#3a2a1e" stroke-width="3"/><path d="M${x + 1} ${y - h}h${h * .42}l-${h * .1} ${h * .14}l${h * .1} ${h * .14}h-${h * .42}z" fill="${c}"/><circle cx="${x + h * .17}" cy="${y - h + h * .14}" r="${h * .06}" fill="${c2}"/>`;
Object.assign(STRUCT, {
  watchtower:(r) => [{y:230, s:`${shd(735, 232, 40)}<path d="M710 230l8-120h34l8 120z" fill="#5a4632"/><path d="M704 112h62v-10h-62z" fill="#3a2c20"/><path d="M700 102l35-30 35 30z" fill="#3a2c20"/><circle cx="735" cy="94" r="7" fill="#c9a24a"/><path d="M716 160h38M714 196h42" stroke="#3a2c20" stroke-width="3"/>`}],
  monastery:(r) => [{y:250, s:`${shd(470, 252, 150, 12)}<path d="M360 250h170v-100h-170z" fill="#8a8274"/><path d="M350 152l95-50 95 50z" fill="#4a3a30"/><path d="M500 250h60v-170h-60z" fill="#958c7c"/><path d="M494 82l36-40 36 40z" fill="#4a3a30"/><path d="M514 120h32v34h-32z" fill="#2a2018"/><path d="M522 128q8-10 16 0v20h-16z" fill="#c9a24a"/><path d="M528 30v-14M522 22h12" stroke="#c9a24a" stroke-width="3"/><path d="M420 250v-46a25 25 0 0 1 50 0v46z" fill="#2a2018"/><rect x="380" y="180" width="14" height="22" fill="#e8c46a" opacity=".8"/>`}],
  crosses:(r) => { const a = []; for (let i = 0; i < 16; i++){ const x = 60 + r() * 780, y = 130 + r() * 380; a.push({y, s:crossSVG(x, y, .8 + r() * .5, pick(["#4a3a2a","#5a4632","#3a3026"]))}); } return a; },
  bones:(r) => { const a = []; for (let i = 0; i < 12; i++){ const x = 60 + r() * 780, y = 140 + r() * 370; a.push({y, s:`<path d="M${x - 8} ${y}l16 -3M${x - 4} ${y - 5}l10 7" stroke="#e6dcc4" stroke-width="2.4" stroke-linecap="round"/>${r() < .4 ? skullSVG(x + 10, y + 2, .8) : ""}`}); } return a; },
  dead_village:(r) => [[130,210,80,50],[640,200,90,54],[300,470,80,48],[700,460,70,44]].map(([x, y, w, h]) => ({y, s:house(x, y, w, h, {wall:"#4a443a", roof:"#2a2622", lit:false}) + `<path d="M${x + 10} ${y - h + 4}l${w - 20} ${h - 10}" stroke="#2a2622" stroke-width="3"/>`})),
  barrow:(r) => [{y:260, s:`${shd(460, 262, 220, 14)}<path d="M240 260q220-190 440 0z" fill="#5a5a44"/><path d="M240 260q220-190 440 0" fill="none" stroke="#6e6e54" stroke-width="6"/><path d="M430 260v-44h60v44z" fill="#4a463e"/><path d="M440 260v-34h40v34z" fill="#0d0c0b"/><path d="M424 214h72v-8h-72z" fill="#6a665c"/>${skullSVG(460, 205, 1.3)}`}],
  bone_mill:(r) => [{y:230, s:house(380, 230, 120, 80, {wall:"#4a443a", roof:"#2a2622", lit:false})}, {y:232, s:`<circle cx="528" cy="200" r="34" fill="none" stroke="#e6dcc4" stroke-width="5" opacity=".7"/><path d="M528 166v68M494 200h68M504 176l48 48M552 176l-48 48" stroke="#d8d0bc" stroke-width="4"/>`}, {y:300, s:`${shd(330, 302, 50, 8)}<path d="M290 300q40-40 80 0z" fill="#d8d0bc"/>${skullSVG(320, 292, .9)}${skullSVG(342, 296, .8)}`}],
  ossuary_b:(r) => [{y:250, s:`${shd(470, 252, 120, 12)}<path d="M380 250h180v-110h-180z" fill="#b8ae96"/><path d="M370 142l100-60 100 60z" fill="#4a4036"/><path d="M440 250v-60a30 30 0 0 1 60 0v60z" fill="#0d0c0b"/>${[0,1,2,3,4,5].map(i => skullSVG(392 + i * 31, 168, 1)).join("")}${[0,1,2,3].map(i => skullSVG(392 + i * 18, 222, .8) + skullSVG(500 + i * 18, 222, .8)).join("")}`}],
  gallows_bridge:(r) => [{y:315, s:`<path d="M520 300h240v28h-240z" fill="#6a6458"/><path d="M520 300h240v6h-240z" fill="#8a8270"/>${[0,1,2,3,4].map(i => `<path d="M${540 + i * 46} 328v22h12v-22z" fill="#5a544a"/>`).join("")}<path d="M560 300v-90h80" stroke="#3a2a1e" stroke-width="6" fill="none"/><path d="M630 210v34" stroke="#8a7a5a" stroke-width="2"/><circle cx="630" cy="248" r="5" fill="none" stroke="#8a7a5a" stroke-width="2"/>`}],
  necro_tower:(r) => [{y:250, s:`${shd(470, 252, 70, 10)}<path d="M430 250l6-200h68l6 200z" fill="#2a2630"/><path d="M424 52l46-40 46 40z" fill="#1a1620"/><rect x="460" y="80" width="20" height="26" fill="#ff3a6a" opacity=".7"/><rect x="460" y="150" width="20" height="26" fill="#7fffd0" opacity=".45"/>${[0,1,2,3,4].map(i => `<path d="M${400 + i * 30 + r() * 20} ${30 + r() * 40}l8 4 8-4" stroke="#0e0c10" stroke-width="3" fill="none"/>`).join("")}`}],
  bone_wall:(r) => [{y:150, s:`${wallSeg(0, 150, 900, 70, "#7a7466")}${[0,1,2,3,4,5,6,7].map(i => skullSVG(60 + i * 110, 120, 1.1)).join("")}<path d="M300 150v-90l-30-10M620 150v-60" stroke="#4a463e" stroke-width="2" fill="none"/>`}],
  bonecastle:(r) => [{y:200, s:`${shd(450, 206, 300, 14, .35)}${wallSeg(170, 200, 560, 110, "#2a2622")}<path d="M380 200v-180h140v180z" fill="#221e1a"/><path d="M370 24l80-50 80 50z" fill="#1a1612"/><path d="M420 200v-60a30 30 0 0 1 60 0v60z" fill="#0d0c0b"/>${skullSVG(450, 132, 2)}<rect x="440" y="60" width="20" height="30" fill="#bf6fff" opacity=".55"/>`}],
  gat:(r) => [{y:300, s:`<path d="M-10 380 L910 230" stroke="#3a2c20" stroke-width="64" opacity=".55"/>${[...Array(30)].map((_, i) => { const x = -10 + i * 32, y = 380 - i * 5.2; return `<path d="M${x} ${y - 26}l12 50" stroke="#6a5236" stroke-width="10"/><path d="M${x} ${y - 26}l12 50" stroke="#7a6244" stroke-width="3" opacity=".6"/>`; }).join("")}`}],
  stilts:(r) => [[140,220,90,54],[620,200,100,58],[330,450,90,52],[680,470,80,48]].map(([x, y, w, h]) => ({y, s:`${[0,1,2,3].map(i => `<path d="M${x + 6 + i * (w / 3.4)} ${y}v34" stroke="#3a2c20" stroke-width="6"/>`).join("")}<ellipse cx="${x + w / 2}" cy="${y + 34}" rx="${w * .8}" ry="9" fill="#24343a" opacity=".8"/>${house(x, y, w, h, {wall:"#5a4a36", roof:"#3a3426", chimney:true})}`})).concat([{y:330, s:`<path d="M230 252L330 420M710 232L700 455" stroke="#6a5236" stroke-width="8" stroke-dasharray="14 6"/>`}]),
  smoke:(r) => { const a = []; for (let i = 0; i < 7; i++){ const x = 80 + r() * 740, y = 160 + r() * 330; a.push({y, s:`<ellipse cx="${x}" cy="${y}" rx="22" ry="7" fill="#2a1a10"/><ellipse cx="${x}" cy="${y}" rx="10" ry="3" fill="#ff7a2a" opacity=".6"/><ellipse cx="${x + 6}" cy="${y - 30}" rx="16" ry="22" fill="#8a847a" opacity=".25" filter="url(#bl_U)"/>`}); } return a; },
  willows:(r) => [[170,230],[720,220],[460,480],[90,470]].map(([x, y]) => ({y, s:`${shd(x + 10, y + 2, 40, 7)}<path d="M${x - 4} ${y}q4-50 0-90h8q-4 40 0 90z" fill="#3a2c20"/>${[...Array(14)].map((_, i) => { const a = -1 + i / 6.5; return `<path d="M${x} ${y - 90}q${a * 40} -10 ${a * 50} ${60 + (i % 3) * 14}" stroke="${pick(["#4a5a32","#3a4a28","#5a6a3a"])}" stroke-width="5" fill="none"/>`; }).join("")}`})),
  coven_hut:(r) => [{y:260, s:`${shd(470, 262, 80, 10)}<path d="M440 260l-12-40 14 4 -8-30M500 260l12-40-14 4 8-30" stroke="#c8a040" stroke-width="5" fill="none" stroke-linecap="round"/>${house(410, 196, 120, 70, {wall:"#4a3a2a", roof:"#2a2a1e", chimney:true})}<circle cx="430" cy="160" r="8" fill="#aaff66" opacity=".5"/><ellipse cx="610" cy="250" rx="34" ry="10" fill="#1a1612"/><ellipse cx="610" cy="244" rx="28" ry="8" fill="#5a8a3a" opacity=".8"/><circle cx="604" cy="238" r="5" fill="#aaff66" opacity=".7"/>`}],
  sunk_houses:(r) => { const a = []; for (const [x, y] of [[150,230],[420,200],[690,250],[280,440],[620,460]]) a.push({y, s:`<ellipse cx="${x + 40}" cy="${y}" rx="80" ry="14" fill="#1a262a"/><path d="M${x} ${y}L${x + 40} ${y - 46}L${x + 80} ${y}z" fill="#3a3024"/><path d="M${x + 40} ${y - 46}L${x + 80} ${y}h-14z" fill="#2a2218"/><path d="M${x - 10} ${y + 2}h100" stroke="#5a7a80" stroke-width="2" opacity=".6"/>`}); return a; },
  midge_cloud:(r) => { let s = ""; for (let c = 0; c < 4; c++){ const cx = 150 + r() * 600, cy = 120 + r() * 300; for (let i = 0; i < 70; i++) s += `<circle cx="${cx + (r() - .5) * 120}" cy="${cy + (r() - .5) * 60}" r="1.3" fill="#141410" opacity=".75"/>`; } return [{y:600, s}]; },
  abbey:(r) => [{y:280, s:`<ellipse cx="460" cy="282" rx="260" ry="26" fill="#1a262a"/>${shd(460, 280, 200, 10)}<path d="M330 280v-120h200v120z" fill="#5a5a54"/><path d="M320 162l110-60 110 60z" fill="#3a3630"/><path d="M540 280v-200h60v200z" fill="#66665e"/><path d="M534 82l36-44 36 44z" fill="#3a3630"/><path d="M556 120h28v30h-28z" fill="#0d0c0b"/><path d="M400 280v-60a30 30 0 0 1 60 0v60z" fill="#0d0c0b"/><path d="M300 270h340" stroke="#5a7a80" stroke-width="3" opacity=".6"/><rect x="300" y="250" width="340" height="30" fill="#24343a" opacity=".75"/>`}],
  roots:(r) => { const a = []; for (let i = 0; i < 9; i++){ const x = 60 + r() * 780, y = 140 + r() * 360; a.push({y, s:`<path d="M${x - 40} ${y}q20-50 40-10q20-50 40 0" stroke="#1a1410" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${x - 40} ${y}q20-50 40-10q20-50 40 0" stroke="#2e241a" stroke-width="4" fill="none"/>`}); } return a; },
  signpost:(r) => [{y:280, s:`${shd(470, 282, 20, 5)}<path d="M466 282v-80h8v80z" fill="#4a3a2a"/><path d="M474 214h54l10 9-10 9h-54z" fill="#c9a24a"/><path d="M466 236h-54l-10 9 10 9h54z" fill="#4a3a5a"/>`}],
  camp_dawn:(r) => [[280,200,"#e8dcb0"],[420,180,"#efe6c8"],[620,210,"#e8dcb0"],[180,420,"#efe6c8"],[700,440,"#e8dcb0"]].map(([x, y, c]) => ({y, s:tent(x, y, c) + (x === 420 ? flagSVG(440, y - 52, "#c9a24a", "#fff0a0", 50) : "")})).concat([{y:300, s:flagSVG(560, 300, "#e8dcb0", "#c9a24a", 80)}]),
  camp_night:(r) => [[280,200,"#3a2a4a"],[420,180,"#2a2232"],[620,210,"#3a2a4a"],[180,420,"#2a2232"],[700,440,"#3a2a4a"]].map(([x, y, c]) => ({y, s:tent(x, y, c) + (x === 420 ? flagSVG(440, y - 52, "#3a2a4a", "#c0a6e0", 50) : "")})).concat([{y:300, s:flagSVG(560, 300, "#2a2232", "#c0a6e0", 80)}]),
  spears:(r) => { const a = []; for (let i = 0; i < 14; i++){ const x = 60 + r() * 780, y = 140 + r() * 370, k = r() * 30 - 15; a.push({y, s:`<path d="M${x} ${y}l${k} -${40 + r() * 20}" stroke="#4a3a2a" stroke-width="3"/>${r() < .5 ? `<path d="M${x + k} ${y - 46}l-3 -8 6 0z" fill="#8a8a8a"/>` : ""}${r() < .3 ? `<path d="M${x - 10} ${y - 2}q10-14 22 0" fill="#7a7a72"/>` : ""}`}); } return a; },
  banners2:(r) => { const a = []; for (let i = 0; i < 6; i++){ const x = 80 + r() * 740, y = 150 + r() * 330, dawn = i % 2 === 0; a.push({y, s:flagSVG(x, y, dawn ? "#e8dcb0" : "#2a2232", dawn ? "#c9a24a" : "#c0a6e0", 56 + r() * 20)}); } return a; },
  sunflowers:(r) => { let s = ""; for (let i = 0; i < 70; i++){ const x = 30 + r() * 840, y = 160 + r() * 350; s += `<path d="M${x} ${y}v-16" stroke="#4a6a2a" stroke-width="2"/><circle cx="${x}" cy="${y - 18}" r="5" fill="#e8b830"/><circle cx="${x}" cy="${y - 18}" r="2.2" fill="#5a3a1a"/>`; } return [{y:0, s}]; },
  banners_hill:(r) => { const a = [{y:300, s:`${shd(450, 302, 260, 16)}<path d="M180 300q270-150 540 0z" fill="#6a6250"/>`}]; for (let i = 0; i < 9; i++){ const x = 240 + i * 52, y = 296 - Math.sin(i / 8 * Math.PI) * 70, dawn = i % 2 === 0; a.push({y:y + 1, s:flagSVG(x, y, dawn ? "#e8dcb0" : "#2a2232", dawn ? "#c9a24a" : "#c0a6e0", 60)}); } return a; },
  cathedral:(r) => [{y:250, s:`${shd(470, 252, 200, 12)}<path d="M300 250v-130h60v-40l20-30 20 30v40h140v-40l20-30 20 30v40h60v130z" fill="#bab0a0"/><path d="M300 250v-130h340v130" fill="none" stroke="#8a8270" stroke-width="3"/><path d="M440 250v-80a30 30 0 0 1 60 0v80z" fill="#0d0c0b"/><circle cx="470" cy="140" r="22" fill="#2a2620"/><circle cx="470" cy="140" r="16" fill="#ffe08a" opacity=".55"/><path d="M560 120l40 80-20 50" stroke="#7a7466" stroke-width="16" fill="none" opacity=".6"/><path d="M320 140l20 20M600 160l-30 30" stroke="#5a544a" stroke-width="3"/>`}],
  lists:(r) => [{y:170, s:`<path d="M60 170h780v-60h-780z" fill="#5a4632"/><path d="M60 110h780v-14h-780z" fill="#7a1a1a"/>${[...Array(18)].map((_, i) => skullSVG(90 + i * 42, 104, .8)).join("")}`}, {y:330, s:`<path d="M80 330h740" stroke="#6a5236" stroke-width="8"/>${[...Array(16)].map((_, i) => `<path d="M${90 + i * 48} 330v-26" stroke="#6a5236" stroke-width="5"/>`).join("")}<path d="M80 312h740" stroke="#c9a24a" stroke-width="3"/>`}],
  keep:(r) => [{y:200, s:`${shd(450, 206, 320, 14, .35)}${wallSeg(130, 200, 640, 130, "#1e1a22")}<path d="M360 200v-190h180v190z" fill="#18141c"/><path d="M350 14l100-40 100 40z" fill="#0e0c12"/><path d="M410 200v-80a40 40 0 0 1 80 0v80z" fill="#050406"/><path d="M410 130h80M410 150h80M410 170h80M430 120v80M470 120v80" stroke="#3a3440" stroke-width="3"/><rect x="438" y="50" width="24" height="34" fill="#ff3a6a" opacity=".55"/>${flagSVG(370, 14, "#2a2232", "#c0a6e0", 60)}`}],
});

/* ---------- підземелля: нові зали ---------- */
Object.assign(DG_COL, {ossuary:["#5a5446","#3a3630"], bonecrypt:["#3a3238","#241e24"], abbey:["#3a4446","#22302f"], catacomb:["#8a8478","#5a5650"], nightkeep:["#24202a","#151218"]});
Object.assign(DG_DECOR, {
  ossuary:(r) => { let s = ""; for (let y = 20; y < 210; y += 26) for (let x = 14; x < 900; x += 30) s += skullSVG(x + (y / 26 % 2) * 15, y + 14, .9).replace(/#e6dcc4/g, "#d8cfb4"); return s + `<rect width="900" height="220" fill="#000" opacity=".25"/>`; },
  bonecrypt:(r) => `${[120, 330, 570, 780].map(x => `<path d="M${x - 22} 220v-200h44v200z" fill="#4a4048"/>${skullSVG(x, 70, 1.6)}`).join("")}<path d="M380 220v-90h140v90z" fill="#2a2228"/><path d="M400 130v-40l50-26 50 26v40z" fill="#3a3038"/>${skullSVG(450, 112, 1.4)}<rect x="436" y="140" width="28" height="40" fill="#bf6fff" opacity=".35"/>`,
  abbey:(r) => `${[150, 450, 750].map(x => `<path d="M${x - 70} 220v-120a70 70 0 0 1 140 0v120z" fill="#2a3436"/>`).join("")}<rect x="0" y="236" width="900" height="292" fill="#2a4448" opacity=".55"/>${[...Array(12)].map(() => `<path d="M${r() * 900} ${250 + r() * 260}h${30 + r() * 50}" stroke="#7aa0a6" stroke-width="2" opacity=".5"/>`).join("")}`,
  catacomb:(r) => `${[0,1,2,3,4,5].map(i => `<path d="M${40 + i * 150} 220v-150a35 35 0 0 1 70 0v150z" fill="#4a463e"/><circle cx="${75 + i * 150}" cy="90" r="10" fill="#ffe08a" opacity=".5"/>`).join("")}<circle cx="450" cy="40" r="26" fill="#ffe08a" opacity=".25"/>`,
  nightkeep:(r) => `${[100, 300, 600, 800].map(x => flagSVG(x, 200, "#4a3a66", "#c0a6e0", 110)).join("")}<path d="M380 220v-150h140v150z" fill="#1a1620"/><path d="M420 220v-90a30 30 0 0 1 60 0v90z" fill="#050406"/><circle cx="450" cy="50" r="18" fill="#c0a6e0" opacity=".25"/>`,
});
