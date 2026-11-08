/* ============ предмети ============ */
// sock: кількість гнізд для самоцвітів
const ITEMS = {
  // зброя
  rusty_sword:{name:"Іржавий меч", slot:"weapon", dmg:[5,8], price:20, lvl:1},
  smith_sword:{name:"Меч зброяра", slot:"weapon", dmg:[8,11], price:250, lvl:2},
  merc_axe:{name:"Сокира найманця", slot:"weapon", dmg:[12,16], price:700, lvl:4, sock:1},
  toporets:{name:"Опришківський топірець", slot:"weapon", dmg:[17,22], price:1600, lvl:6, sock:1},
  bartka:{name:"Бартка Довбуша", slot:"weapon", dmg:[23,29], str:2, price:3600, lvl:8, sock:2},
  order_blade:{name:"Клинок Ордену", slot:"weapon", dmg:[24,30], agi:2, price:3000, lvl:8, sock:1, rare:true},
  shade_blade:{name:"Клинок Тіні", slot:"weapon", dmg:[25,32], str:3, price:3200, lvl:8, sock:2, rare:true},
  chorno_bartka:{name:"Чорногорська бартка", slot:"weapon", dmg:[32,40], str:4, price:9000, lvl:10, sock:2, rare:true, unique:true},
  // шоломи
  leather_cap:{name:"Шкіряний шолом", slot:"helmet", hp:8, def:1, price:60, lvl:1},
  iron_helm:{name:"Залізний шолом", slot:"helmet", hp:18, def:3, price:420, lvl:4, sock:1},
  krysania:{name:"Гуцульська крисаня", slot:"helmet", hp:28, def:5, agi:1, price:1300, lvl:7, sock:1},
  knight_helm:{name:"Шолом Чорного лицаря", slot:"helmet", hp:42, def:7, str:2, price:4200, lvl:9, sock:2, rare:true},
  // обладунки
  leather_vest:{name:"Шкіряна куртка", slot:"armor", hp:15, def:2, price:120, lvl:1},
  chain:{name:"Кольчуга", slot:"armor", hp:32, def:5, price:600, lvl:4, sock:1},
  alpha_pelt:{name:"Шкура ватажка", slot:"armor", hp:40, def:6, agi:2, price:1200, lvl:6, sock:1, rare:true},
  keptar:{name:"Кептар з овечої шкури", slot:"armor", hp:50, def:7, price:1800, lvl:7, sock:1},
  abyss_plate:{name:"Обладунок Безодні", slot:"armor", hp:80, def:11, price:9000, lvl:10, sock:2, rare:true, unique:true},
  // чоботи
  boots:{name:"Чоботи мандрівника", slot:"boots", agi:2, def:1, price:80, lvl:1},
  iron_boots:{name:"Залізні чоботи", slot:"boots", agi:1, def:3, hp:10, price:380, lvl:4},
  postoly:{name:"Постоли верховинця", slot:"boots", agi:4, def:3, hp:15, price:1100, lvl:7, sock:1},
  // амулети
  warden_amulet:{name:"Амулет Варти", slot:"amulet", str:3, hp:25, price:900, lvl:5, rare:true},
  gerdan:{name:"Срібний гердан", slot:"amulet", str:4, hp:40, agi:2, price:2400, lvl:8, sock:1},
  // персні (два слоти)
  copper_ring:{name:"Мідний перстень", slot:"ring", hp:10, price:90, lvl:1},
  silver_ring:{name:"Срібний перстень", slot:"ring", hp:20, agi:1, price:700, lvl:4, sock:1},
  captain_ring:{name:"Перстень капітана варти", slot:"ring", str:2, hp:25, price:1500, lvl:5, sock:1, rare:true},
  gold_ring:{name:"Золотий перстень", slot:"ring", str:2, hp:30, price:2000, lvl:7, sock:2},
  safar_ring:{name:"Перстень Сафара", slot:"ring", str:2, agi:2, crit:2, price:2600, lvl:8, sock:1, rare:true},
  chorno_ring:{name:"Перстень Чорногори", slot:"ring", str:3, agi:3, hp:30, price:6000, lvl:10, sock:1, rare:true, unique:true},
  // зілля, еліксири
  potion_s:{name:"Мале зілля здоров'я", use:{hp:90}, price:30, cat:"use"},
  potion_l:{name:"Велике зілля здоров'я", use:{hp:220}, price:90, lvl:4, cat:"use"},
  potion_e:{name:"Зілля енергії", use:{en:40}, price:30, cat:"use"},
  potion_xe:{name:"Велике зілля енергії", use:{en:90}, price:80, lvl:6, cat:"use"},
  zhyvytsia:{name:"Живиця", use:{hp:9999, en:9999}, price:400, lvl:8, cat:"use"},
  elix_str:{name:"Еліксир сили", buff:{str:4}, price:150, lvl:4, cat:"use"},
  elix_skin:{name:"Еліксир кам'яної шкіри", buff:{def:5}, price:150, lvl:5, cat:"use"},
  elix_agi:{name:"Еліксир спритності", buff:{agi:4}, price:160, lvl:6, cat:"use"},
  // сувої (начертатель)
  scroll_heal:{name:"Сувій лікування", scroll:"heal", price:60, cat:"use"},
  scroll_fire:{name:"Сувій вогню", scroll:"fire", price:120, lvl:3, cat:"use"},
  scroll_shield:{name:"Сувій щита", scroll:"shield", price:120, lvl:4, cat:"use"},
  scroll_tp:{name:"Сувій перенесення", scroll:"tp", price:150, lvl:2, cat:"use"},
  scroll_curse:{name:"Сувій прокляття", scroll:"curse", price:160, lvl:6, cat:"use"},
  scroll_storm:{name:"Сувій бурі", scroll:"storm", price:260, lvl:8, cat:"use"},
  scroll_ward:{name:"Сувій оберегу", scroll:"ward", price:300, lvl:9, cat:"use"},
  box:{name:"Велика ярмаркова шкатулка", open:true, price:500, cat:"use"},
  // трофеї
  rat_tail:{name:"Щурячий хвіст", price:6}, scrap:{name:"Брухт", price:16}, fang:{name:"Ікло вовка", price:12}, wolf_skin:{name:"Шкура вовка", price:30},
  slime:{name:"Жаб'ячий слиз", price:20}, bone:{name:"Кістка", price:14}, wisp_dust:{name:"Пил шептуна", price:40}, dark_shard:{name:"Темний уламок", price:70},
  boar_tusk:{name:"Ікло кабана", price:14}, tiger_claw:{name:"Кіготь тигра", price:30}, spark_dust:{name:"Іскристий пил", price:18}, rotten_cloth:{name:"Гниле лахміття", price:12},
  sting:{name:"Жало скорпіона", price:26}, order_badge:{name:"Знак Ордену", price:45}, ghost_dust:{name:"Пил привида", price:55}, stone_heart:{name:"Кам'яне серце", price:80},
  web:{name:"Павутина мисливця", price:60}, troll_hide:{name:"Шкура троля", price:90}, scale:{name:"Луска мермана", price:70},
  // ресурси ремесел
  h1:{name:"Попелиця", res:"herb", t:1, price:8}, h2:{name:"Звіробій", res:"herb", t:2, price:14}, h3:{name:"Рута", res:"herb", t:3, price:24}, h4:{name:"Арніка гірська", res:"herb", t:4, price:36}, h5:{name:"Папороть-цвіт", res:"herb", t:5, price:60},
  o1:{name:"Мідна руда", res:"mine", t:1, price:10}, o2:{name:"Залізна руда", res:"mine", t:2, price:16}, o3:{name:"Срібна руда", res:"mine", t:3, price:28}, o4:{name:"Золота руда", res:"mine", t:4, price:42}, o5:{name:"Чорногірський кришталь", res:"mine", t:5, price:70},
  f1:{name:"Плітка", res:"fish", t:1, price:8}, f2:{name:"Форель", res:"fish", t:2, price:14}, f3:{name:"Сом", res:"fish", t:3, price:24}, f4:{name:"Синевирський харіус", res:"fish", t:4, price:36}, f5:{name:"Золотий короп", res:"fish", t:5, price:60},
  raw1:{name:"Необроблений самоцвіт", cat:"gem", raw:1, price:40}, raw2:{name:"Чистий самоцвіт-сирець", cat:"gem", raw:2, price:120}, raw3:{name:"Рідкісний самоцвіт-сирець", cat:"gem", raw:3, price:300},
};
const ITEM_HINT = {box:"Усередині може бути зілля, сувої, самоцвіти або рідкісна річ"};
// самоцвіти: тип × ступінь
const GEMS = {ruby:["Рубін","hp",[15,30,50],"#d0443a"], sapph:["Сапфір","en",[8,15,25],"#3a6ad0"], emer:["Смарагд","agi",[1,2,4],"#3aa060"], topaz:["Топаз","str",[1,2,4],"#e0a23a"], onyx:["Онікс","def",[1,3,5],"#4a4a52"], ame:["Аметист","crit",[1,2,4],"#9a4ad0"]};
const GRADE = ["", "Уламок", "Камінь", "Досконалий"];
for (const [k, [nm, st, vals, col]] of Object.entries(GEMS)) for (let g = 1; g <= 3; g++){
  ITEMS[`gem_${k}${g}`] = {name:`${nm} (${GRADE[g].toLowerCase()})`, cat:"gem", gem:k, g, stat:st, val:vals[g - 1], col, price:[0, 80, 260, 700][g]};
}
// обереги
const WARD_ITEMS = {
  "Осиковий кіл":["w_osyka","Осиковий кілок",120], "Часник":["w_garlic","Головка часнику",60], "Освячена вода":["w_water","Освячена вода",110],
  "Сіль":["w_salt","Четвергова сіль",70], "Свячена крейда":["w_chalk","Свячена крейда",90], "Рута-м'ята":["w_ruta","Пучок рути-м'яти",80],
  "Срібло":["w_silver","Срібний ніж",150], "Дзвін":["w_bell","Мідний дзвіночок",100], "Вогонь":["w_torch","Смолоскип",60],
  "Полин":["w_polyn","Пучок полину",70], "Мак":["w_mak","Мак-самосій",80], "Підкова":["w_horse","Стара підкова",90],
  "Хрест":["w_cross","Натільний хрестик",110], "Залізо":["w_iron","Залізний цвях",60], "Вогнище":["w_torch","Смолоскип",60],
};
for (const [, [id, name, price]] of Object.entries(WARD_ITEMS)) ITEMS[id] = {name, price, cat:"ward"};
const wardIds = names => [...new Set((names || []).map(n => WARD_ITEMS[n] && WARD_ITEMS[n][0]).filter(Boolean))];
// трофеї демонів
const DROPID = {};
for (const d of BESTIARY) for (const nm of d.drop || []){
  if (nm === "Іржавий меч"){ DROPID[nm] = "rusty_sword"; continue; }
  if (!DROPID[nm]){ const id = "dr" + Object.keys(DROPID).length; DROPID[nm] = id; ITEMS[id] = {name:nm, price:12 + d.tier * 16}; }
}
for (const [id, it] of Object.entries(ITEMS)){ it.id = id; if (!it.cat) it.cat = it.slot ? "gear" : it.res ? "res" : "misc"; }
const SLOTS = [["helmet","Шолом"],["amulet","Амулет"],["armor","Обладунок"],["weapon","Зброя"],["ring1","Перстень"],["ring2","Перстень"],["boots","Чоботи"]];
const slotFits = (slot, it) => it && it.slot && (it.slot === slot || (it.slot === "ring" && slot.startsWith("ring")));
const SHOPS = {
  ostap:["potion_s","potion_e","scroll_heal","leather_cap","leather_vest","boots","smith_sword","copper_ring"],
  sutler:["potion_s","potion_l","potion_e","scroll_tp","iron_helm","iron_boots","chain","merc_axe"],
  isak:["potion_l","potion_e","scroll_tp","iron_helm","chain","iron_boots","silver_ring","merc_axe","toporets"],
  kotr:["box","potion_s","potion_l","scroll_heal","scroll_fire","elix_str"],
  olena:["potion_s","potion_l","potion_e","h1","h2"],
  paraska:["potion_l","potion_e","w_garlic","w_osyka","w_water","w_salt","w_chalk","w_ruta","w_silver","w_bell","w_torch","w_polyn","w_mak","w_horse","w_cross","w_iron"],
  yurko:["toporets","krysania","keptar","postoly","gerdan","bartka","gold_ring"],
  marichka:["potion_l","potion_xe","elix_agi","elix_skin","w_ruta","w_polyn","w_garlic"],
};

/* ============ ремесла ============ */
const PROFS = {
  herb:{name:"Травник", kind:"gather", icon:"herb", text:"Збирає трави на сценах локацій. Трави потрібні алхіміку й начертателю."},
  mine:{name:"Старатель", kind:"gather", icon:"pick", text:"Добуває руду й іноді самоцвіти-сирці. Руда потрібна ювеліру."},
  fish:{name:"Рибак", kind:"gather", icon:"fish", text:"Ловить рибу на річках, озерах і в бухті. Риб'ячий жир потрібен начертателю для сувоїв."},
  alch:{name:"Алхімік", kind:"craft", icon:"flask", text:"Варить зілля здоров'я й енергії та еліксири, що підсилюють на кілька боїв."},
  scribe:{name:"Начертатель", kind:"craft", icon:"scroll", text:"Пише бойові сувої: вогонь, щит, прокляття, буря, перенесення."},
  jewel:{name:"Ювелір", kind:"craft", icon:"gem", text:"Гранує самоцвіти, з'єднує їх у кращі, робить персні й вставляє камені в гнізда речей."},
};
const TIER_LV = [0, 1, 3, 5, 7, 9];       // рівень ремесла для тіру ресурсу
const RECIPES = [
  // алхімія
  {id:"r_ps", prof:"alch", lv:1, in:{h1:2}, out:"potion_s"},
  {id:"r_pe", prof:"alch", lv:2, in:{h1:1, h2:1}, out:"potion_e"},
  {id:"r_pl", prof:"alch", lv:3, in:{h2:2, h3:1}, out:"potion_l"},
  {id:"r_es", prof:"alch", lv:4, in:{h3:2, f2:1}, out:"elix_str"},
  {id:"r_ek", prof:"alch", lv:5, in:{h3:2, o2:1}, out:"elix_skin"},
  {id:"r_ea", prof:"alch", lv:6, in:{h4:1, h2:2}, out:"elix_agi"},
  {id:"r_px", prof:"alch", lv:7, in:{h4:2, f3:1}, out:"potion_xe"},
  {id:"r_zh", prof:"alch", lv:9, in:{h5:1, h4:2}, out:"zhyvytsia"},
  // начертання
  {id:"r_sh", prof:"scribe", lv:1, in:{f1:2, h1:1}, out:"scroll_heal"},
  {id:"r_tp", prof:"scribe", lv:2, in:{f1:1, h2:1}, out:"scroll_tp"},
  {id:"r_sf", prof:"scribe", lv:3, in:{f2:2, o1:1}, out:"scroll_fire"},
  {id:"r_ss", prof:"scribe", lv:4, in:{f2:1, h2:2}, out:"scroll_shield"},
  {id:"r_sc", prof:"scribe", lv:6, in:{f3:2, h3:1}, out:"scroll_curse"},
  {id:"r_st", prof:"scribe", lv:8, in:{f4:2, o3:1}, out:"scroll_storm"},
  {id:"r_sw", prof:"scribe", lv:9, in:{f5:1, h5:1}, out:"scroll_ward"},
  // ювелірство
  {id:"r_cr", prof:"jewel", lv:1, in:{o1:3}, out:"copper_ring"},
  {id:"r_sr", prof:"jewel", lv:4, in:{o3:3, raw1:1}, out:"silver_ring"},
  {id:"r_gr", prof:"jewel", lv:7, in:{o4:3, raw2:1}, out:"gold_ring"},
];
for (const k of Object.keys(GEMS)){
  RECIPES.push({id:`r_${k}1`, prof:"jewel", lv:1, in:{raw1:1, o1:1}, out:`gem_${k}1`, group:"Огранювання"});
  RECIPES.push({id:`r_${k}2`, prof:"jewel", lv:4, in:{raw2:1, o3:1}, out:`gem_${k}2`, group:"Огранювання"});
  RECIPES.push({id:`r_${k}3`, prof:"jewel", lv:7, in:{raw3:1, o5:1}, out:`gem_${k}3`, group:"Огранювання"});
  RECIPES.push({id:`r_${k}c2`, prof:"jewel", lv:3, in:{[`gem_${k}1`]:3}, out:`gem_${k}2`, group:"З'єднання"});
  RECIPES.push({id:`r_${k}c3`, prof:"jewel", lv:6, in:{[`gem_${k}2`]:3}, out:`gem_${k}3`, group:"З'єднання"});
}

/* ============ підземелля ============ */
const DUNGEONS = {
  crypt:{name:"Склепи Варти", node:"ruins", lvl:5, rooms:5, pool:["skel","rat","zombie"], boss:"crypt_captain", scene:"crypt", text:"Під Руїнами Варти лежать склепи, де спить мертвий капітан."},
  citadel:{name:"Підземелля Темної Цитаделі", node:"citadel", lvl:8, rooms:6, pool:["black_knight","order_mage","villain","gargoyle"], boss:"dark_magister", scene:"citadel_d", text:"Під Цитаделлю Чорний Магістр готує військо."},
  abyss:{name:"Безодня Чорногори", node:"rah", lvl:10, rooms:7, pool:["chort","aridnyk","lykho","nichnytsia","bosorkun"], boss:"abyss_lord", scene:"abyss", text:"Найглибша печера Карпат. Кожен наступний похід важчий."},
};
