/* ============ світ: одна велика карта ============ */
const WORLD = {w:2800, h:920};
const REGIONS = {kab:"Землі Кабаллону", ash:"Попелясті землі", zak:"Закарпаття"};
// kind: city (велике місто), town (безпечне), hunt (мисливські угіддя), danger (небезпечні)
const NODES = {
  // ---- Землі Кабаллону (за мотивами «Кристала Вечності») ----
  kaballon:{r:"kab", name:"Кабаллон", x:270, y:430, kind:"city", lv:"місто"},
  spring:{r:"kab", name:"Село Джерела", x:105, y:320, kind:"town", lv:"село"},
  fair:{r:"kab", name:"Ярмаркова галявина", x:175, y:610, kind:"town", lv:"ярмарок"},
  sagin:{r:"kab", name:"Сагін", x:430, y:225, kind:"town", lv:"вежа"},
  kab_env:{r:"kab", name:"Околиці Кабаллону", x:450, y:480, kind:"hunt", lv:"2–3"},
  mill:{r:"kab", name:"Старий млин", x:610, y:345, kind:"hunt", lv:"3–4"},
  sparkford:{r:"kab", name:"Іскристий брід", x:830, y:420, kind:"hunt", lv:"2–3"},
  north_cross:{r:"kab", name:"Північна переправа", x:650, y:165, kind:"hunt", lv:"4–5"},
  sand:{r:"kab", name:"Піщана коса", x:640, y:565, kind:"hunt", lv:"3–5"},
  order_camp:{r:"kab", name:"Табір Ордену", x:820, y:700, kind:"danger", lv:"5–6"},
  dead_wood:{r:"kab", name:"Мертвий ліс", x:470, y:720, kind:"danger", lv:"5–6"},
  academy:{r:"kab", name:"Руїни Магічної Академії", x:150, y:150, kind:"danger", lv:"6–7"},
  doom:{r:"kab", name:"Згубна хаща", x:295, y:810, kind:"danger", lv:"7"},
  bay:{r:"kab", name:"Бухта Відчаю", x:70, y:770, kind:"danger", lv:"7–8"},
  citadel:{r:"kab", name:"Темна Цитадель", x:640, y:860, kind:"danger", lv:"8"},
  // ---- Попелясті землі ----
  spire:{r:"ash", name:"Попелястий Шпиль", x:1080, y:500, kind:"city", lv:"місто"},
  tavern:{r:"ash", name:"Таверна «Іржавий Цвях»", x:1230, y:380, kind:"town", lv:"таверна"},
  forge:{r:"ash", name:"Стара Кузня", x:1230, y:640, kind:"hunt", lv:"1–2"},
  ford:{r:"ash", name:"Сірий Брід", x:1380, y:518, kind:"hunt", lv:"3–4"},
  ruins:{r:"ash", name:"Руїни Варти", x:995, y:640, kind:"danger", lv:"4–5"},
  ravine:{r:"ash", name:"Вовчий Яр", x:1530, y:380, kind:"danger", lv:"5–6"},
  swamp:{r:"ash", name:"Болото Шепоту", x:1555, y:640, kind:"hunt", lv:"3–5"},
  camp:{r:"ash", name:"Табір Найманців", x:1690, y:500, kind:"town", lv:"табір"},
  chapel:{r:"ash", name:"Чорна Каплиця", x:1700, y:285, kind:"danger", lv:"7–8"},
  pass:{r:"ash", name:"Карпатський перевал", x:1800, y:410, kind:"danger", lv:"6"},
  // ---- Закарпаття ----
  uzhgorod:{r:"zak", name:"Ужгород", x:1870, y:600, kind:"city", lv:"місто"},
  mukachevo:{r:"zak", name:"Мукачево", x:2040, y:420, kind:"city", lv:"місто"},
  svalyava:{r:"zak", name:"Свалява", x:2075, y:700, kind:"town", lv:"місто"},
  khust:{r:"zak", name:"Хуст", x:2430, y:470, kind:"town", lv:"місто"},
  rakhiv:{r:"zak", name:"Рахів", x:2660, y:650, kind:"town", lv:"місто"},
  uzh:{r:"zak", name:"Ужгородщина", x:1950, y:520, kind:"hunt", L:6, reg:"uzh", biome:"forest", lore:"Темні діброви над Ужем. Тут починається шлях знахаря."},
  perech:{r:"zak", name:"Перечинщина", x:1960, y:690, kind:"hunt", L:6, reg:"perech", biome:"forest", lore:"Глухі смерекові ліси. У кронах ховаються мавки."},
  velbz:{r:"zak", name:"Великоберезнянщина", x:1930, y:800, kind:"danger", L:7, reg:"velbz", biome:"forest", lore:"Ужанський край. Чугайстер танцює серед вікових дерев."},
  sval:{r:"zak", name:"Свалявщина", x:2120, y:600, kind:"hunt", L:6, reg:"sval", biome:"forest", lore:"Мінеральні джерела й вогкі хащі."},
  muk:{r:"zak", name:"Мукачівщина", x:2150, y:500, kind:"hunt", L:7, reg:"muk", biome:"castle", lore:"Під мурами старого замку блукають упирі й песиголовці."},
  ber:{r:"zak", name:"Берегівщина", x:2170, y:330, kind:"danger", L:8, reg:"ber", biome:"vineyard", lore:"Винні погреби й старі склепи. Тут сплять вампіри."},
  vyn:{r:"zak", name:"Виноградівщина", x:2320, y:360, kind:"danger", L:8, reg:"vyn", biome:"vineyard", lore:"Севлющина. Виноградники Великих Ком'ят, а в хащі живе відьма."},
  irsh:{r:"zak", name:"Іршавщина", x:2270, y:540, kind:"hunt", L:7, reg:"irsh", biome:"swamp", lore:"Вогкі низини й мочари. Злидні тягнуть усе, що блищить."},
  volv:{r:"zak", name:"Воловеччина", x:2200, y:790, kind:"danger", L:9, reg:"volv", biome:"polonyna", lore:"Високі полонини. Вітер носить босоркуна й лихо."},
  hust:{r:"zak", name:"Хустщина", x:2410, y:590, kind:"danger", L:8, reg:"hust", biome:"swamp", lore:"Болота під Замковою горою. Потерчата ведуть у трясовину."},
  mizh:{r:"zak", name:"Міжгірщина (Синевир)", x:2380, y:720, kind:"danger", L:9, reg:"mizh", biome:"lake", lore:"Чорні води Синевиру. Водяник і русалки чекають на дні."},
  tia:{r:"zak", name:"Тячівщина", x:2560, y:530, kind:"danger", L:9, reg:"tia", biome:"salt", lore:"Солотвинські копальні й тисові долини. Кістки та твань."},
  rah:{r:"zak", name:"Рахівщина (Чорногора)", x:2620, y:800, kind:"danger", L:10, reg:"rah", biome:"snow", lore:"Чорна Гора. Лід, арідник і скарбник стережуть шлях до перевалу."},
};
for (const n of Object.values(NODES)) if (n.L) n.lv = n.L === 10 ? "10" : n.L + "–" + Math.min(10, n.L + 1);
const isSafe = id => ["city","town"].includes(NODES[id].kind);

// [a, b, небезпечна, вигин, назва дороги]
const ROADS = [
  // Кабаллон
  ["kaballon","spring",0,10],["kaballon","fair",0,-12],["kaballon","sagin",0,12],["kaballon","kab_env",0,-10],["kab_env","mill",0,14],["kab_env","sand",0,-12],
  ["sagin","academy",1,-14],["sagin","north_cross",0,10],["mill","north_cross",0,-10],["mill","sparkford",0,12],["kab_env","sparkford",0,-16],["sand","order_camp",1,12],["sand","dead_wood",1,-12],
  ["dead_wood","doom",1,10],["doom","fair",1,-12],["doom","bay",1,12],["fair","bay",1,-10],["order_camp","citadel",1,-12],["dead_wood","citadel",1,14],["spring","academy",1,12],
  // перехід Кабаллон ↔ Попелясті землі
  ["sparkford","spire",0,-14,"Іскристий шлях"],["order_camp","ruins",1,12,"Стежка Ордену"],["north_cross","tavern",1,-30,"Старий північний тракт"],
  // Попелясті землі
  ["spire","tavern",0,-12],["spire","ford",0,14],["spire","forge",0,-14],["forge","ford",0,12],["ford","camp",0,-10],
  ["tavern","ravine",1,16],["ford","swamp",1,-14],["camp","chapel",1,16],["ravine","chapel",1,-14],["swamp","camp",1,16],["spire","ruins",1,-14],["camp","pass",1,-10],
  // перехід Попелясті землі ↔ Закарпаття (три дороги)
  ["pass","uzh",1,-12,"Карпатський перехід"],["chapel","ber",1,-40,"Старий тракт"],["swamp","perech",1,20,"Ужанська переправа"],
  // Закарпаття
  ["uzhgorod","uzh",0,8],["uzhgorod","perech",0,-8],["mukachevo","muk",0,8],["mukachevo","ber",0,-10],["mukachevo","uzh",0,10],["svalyava","sval",0,-8],["svalyava","volv",1,10],["svalyava","perech",0,8],
  ["khust","hust",0,10],["khust","vyn",1,-10],["khust","irsh",0,8],["rakhiv","rah",1,10],["rakhiv","tia",1,-10],
  ["uzh","perech",0,10],["perech","velbz",1,12],["muk","sval",0,12],["muk","ber",1,-10],["ber","vyn",1,12],["sval","irsh",0,-12],["irsh","vyn",1,-10],["irsh","hust",1,12],
  ["hust","mizh",1,-12],["volv","mizh",1,10],["hust","tia",1,-12],["mizh","tia",1,12],["tia","rah",1,-12],["mizh","rah",1,10],
].map(([a, b, danger, k, name]) => {
  const A = NODES[a], B = NODES[b];
  const cx = (A.x + B.x) / 2 + k, cy = (A.y + B.y) / 2 - k;
  return {a, b, danger:!!danger, cx, cy, name:name || "", dur:clamp(Math.round(Math.hypot(B.x - A.x, B.y - A.y) / 22), 5, 22)};
});
const roadOf = (a, b) => ROADS.find(r => (r.a === a && r.b === b) || (r.a === b && r.b === a));
const neighbors = id => ROADS.filter(r => r.a === id || r.b === id).map(r => r.a === id ? r.b : r.a);
function route(from, to){
  const prev = {[from]:null}, q = [from];
  while (q.length){ const c = q.shift(); if (c === to) break; for (const n of neighbors(c)) if (!(n in prev)){ prev[n] = c; q.push(n); } }
  if (!(to in prev)) return null;
  const path = []; let c = to; while (c){ path.unshift(c); c = prev[c]; }
  return path;
}
const dirTo = (from, to) => Math.atan2(NODES[to].y - NODES[from].y, NODES[to].x - NODES[from].x);
function nearestTown(from){
  const prev = {[from]:null}, q = [from];
  while (q.length){ const c = q.shift(); if (isSafe(c)) return c; for (const n of neighbors(c)) if (!(n in prev)){ prev[n] = c; q.push(n); } }
  return "spire";
}

/* ============ локації ============ */
// mobs: [тип, кількість, рівень]; res: тіри ресурсів; boss: бос району (з'являється після 8 вбивств)
const LOCS = {
  // Кабаллон
  kaballon:{desc:"Столиця заходу. Мури, торговий центр і замок.", npcs:[["ulf",330,210],["isak",560,250],["todor",250,360]], buildings:[["Замок Кабаллону","npc:ulf"],["Торговий центр","npc:isak"],["Майстерня Тодора","npc:todor"],["Банк","stub"],["Аукціон","stub"]]},
  spring:{desc:"Тихе село біля цілющого джерела.", npcs:[["olena",420,230]], buildings:[["Хата знахарки","npc:olena"],["Цілюще джерело","spring"]], res:{herb:1, fish:1}},
  fair:{desc:"Строкаті намети, музики й торговці шкатулками.", npcs:[["kotr",470,250]], buildings:[["Намет Котра","npc:kotr"]]},
  sagin:{desc:"Висока біла вежа мага Сафара.", npcs:[["safar",450,190]], buildings:[["Вежа Сафара","npc:safar"]]},
  kab_env:{desc:"Поля й перелiски довкола Кабаллону.", mobs:[["forest_wolf",3,2],["boar",3,3]], res:{herb:1}, boss:["boar",4]},
  mill:{desc:"Старий млин над річкою. Тут ховаються злодії.", mobs:[["thief",3,3],["tiger",2,4]], res:{herb:1, fish:1}, boss:["tiger",5]},
  sparkford:{desc:"Брід, де вода іскриться від дивних вогників.", mobs:[["spark",3,2],["forest_wolf",3,2]], res:{fish:2, mine:1}, boss:["spark",3]},
  north_cross:{desc:"Захоплена мерцями переправа.", mobs:[["zombie",4,4],["drowned",2,5]], res:{fish:2, herb:2}, boss:["zombie",6]},
  sand:{desc:"Піщана коса, де гніздяться скорпіони.", mobs:[["scorpion",5,4],["jal_king",1,5]], res:{mine:2, fish:2}},
  order_camp:{desc:"Табір воїнів Ордену. Чужинців тут не люблять.", mobs:[["soldier",4,5],["order_mage",2,6]], res:{mine:2}, boss:["soldier",7]},
  dead_wood:{desc:"Мертвий ліс, де ховаються набродні.", mobs:[["rabble_mage",2,5],["rabble_hunter",3,5],["villain",1,6]], res:{herb:3}, boss:["villain",7]},
  academy:{desc:"Руїни, де досі блукають тіні магістрів.", mobs:[["ghost_mage",3,6],["gargoyle",2,7]], res:{herb:3, mine:3}, boss:["gargoyle",8]},
  doom:{desc:"Хаща, з якої мало хто вертається.", mobs:[["hunter_spider",2,7],["troll",2,7],["forest_wolf",2,6]], res:{herb:4}, boss:["hunter_spider",8]},
  bay:{desc:"Бухта, де з води виходять мермани.", npcs:[["myron",160,260]], mobs:[["merman",4,7],["chosen_merman",1,8]], res:{fish:4}, boss:["chosen_merman",9]},
  citadel:{desc:"Чорні мури Цитаделі. Під ними підземелля.", mobs:[["black_knight",3,8],["order_mage",2,8]], res:{mine:4}, buildings:[["Вхід у підземелля","dungeon:citadel"]], boss:["black_knight",9]},
  // Попелясті землі
  spire:{desc:"Місто під старою вежею. Тут безпечно.", npcs:[["ostap",330,230],["healer",560,250]], buildings:[["Кузня зброяра Остапа","npc:ostap"],["Дім цілительки","npc:healer"],["Банк","stub"],["Міська рада","stub"]]},
  tavern:{desc:"Тепло, гамір і запах юшки.", npcs:[["myroslava",450,260]], buildings:[["Зала таверни","rest"],["Дошка оголошень","board"]]},
  forge:{desc:"Покинута кузня. Щурі й іржаві механізми.", mobs:[["rat",5,1],["golem",2,2]], res:{mine:1, herb:1}, boss:["golem",3]},
  ford:{desc:"Кам'яний брід через сіру річку.", npcs:[["stakh",256,238]], mobs:[["wolf",3,3],["frog",3,3],["marauder",1,4]], res:{fish:1, herb:1}, buildings:[["Хата перевізника","npc:stakh"]], boss:["wolf",5]},
  ruins:{desc:"Обвалені мури старої варти. Внизу склепи.", mobs:[["skel",4,4],["warden",1,5]], res:{mine:2}, buildings:[["Спуск у склепи","dungeon:crypt"]]},
  ravine:{desc:"Глибокий яр, звідки чути виття.", mobs:[["wolf2",4,5],["alpha",1,6]], res:{herb:2, mine:2}},
  swamp:{desc:"Туман, кочки й чужий шепіт.", mobs:[["frog",3,3],["whisper",2,5]], res:{herb:2, fish:2}, boss:["whisper",6]},
  camp:{desc:"Табір найманців за частоколом.", npcs:[["yarema",420,220],["sutler",600,300]], buildings:[["Намет капітана","npc:yarema"],["Крамниця маркітанта","npc:sutler"]]},
  chapel:{desc:"Чорна каплиця серед мертвих дерев.", mobs:[["cultist",3,7],["shade",1,8]], res:{herb:3}},
  pass:{desc:"Сніг, вітер і стара дорога через гори.", mobs:[["chort",3,6],["kazhan",3,6]], res:{mine:3}},
  // Закарпаття: міста
  uzhgorod:{desc:"Старе місто над Ужем.", npcs:[["bandura",320,200],["paraska",580,240]], buildings:[["Хата бандуриста","npc:bandura"],["Хижа знахарки","npc:paraska"]]},
  mukachevo:{desc:"Місто під замком Паланок.", npcs:[["yurko",280,320]], buildings:[["Кузня під Паланком","npc:yurko"]]},
  svalyava:{desc:"Місто мінеральних джерел.", npcs:[["marichka",360,190]], buildings:[["Хата травниці","npc:marichka"],["Цілюще джерело","spring"]], res:{fish:3}},
  khust:{desc:"Місто під Замковою горою.", npcs:[["ivan",420,220]], buildings:[["Сотня","npc:ivan"]]},
  rakhiv:{desc:"Гірське містечко біля Чорногори.", npcs:[["dmytro",380,230]], buildings:[["Колиба опришків","npc:dmytro"]]},
};
const ZAK_RES = {uzh:{herb:3}, perech:{herb:3}, velbz:{herb:4}, sval:{herb:3, fish:3}, muk:{mine:3}, ber:{herb:3}, vyn:{herb:4}, irsh:{fish:3}, hust:{fish:3}, volv:{herb:4, mine:4}, mizh:{fish:4}, tia:{mine:4}, rah:{mine:5, herb:5}};
for (const [id, n] of Object.entries(NODES)) if (n.reg){ LOCS[id] = {desc:n.lore, demons:true, res:ZAK_RES[id] || {}, boss:"auto"}; }
LOCS.rah.buildings = [["Вхід у Безодню","dungeon:abyss"]];
for (const L of Object.values(LOCS)){ L.npcs = L.npcs || []; L.mobs = L.mobs || []; L.buildings = L.buildings || []; L.res = L.res || {}; }

/* ============ сцени: конфіг пейзажу ============ */
const BIOME = {
  meadow:{ground:["#5b6a3a","#677748","#4d5a31"], grass:"#7d8f4f", veg:{leaf:9, pine:3, bush:12, grass:70, flowers:30, rocks:4}},
  ash:{ground:["#54514a","#615d52","#47443e"], grass:"#7a7462", veg:{dead:11, bush:4, grass:28, rocks:9}},
  forest:{ground:["#3c4a32","#475639","#33402b"], grass:"#5f7244", veg:{pine:30, leaf:4, bush:10, grass:45, rocks:5}},
  swamp:{ground:["#3a4436","#45503f","#2f3a2e"], grass:"#5d6b45", veg:{dead:10, bush:6, reeds:40, grass:25}, pools:8, fog:true},
  sand:{ground:["#b3a174","#c4b383","#a28f63"], grass:"#9a8f5a", veg:{rocks:9, bush:4, grass:16}},
  snow:{ground:["#c3c7cb","#d6d9dc","#adb2b7"], grass:"#9aa3a8", veg:{pine:18, rocks:10}, snow:true},
  polonyna:{ground:["#687848","#778858","#5b6a3d"], grass:"#8a9a5a", veg:{grass:80, flowers:34, rocks:9, pine:5, bush:5}},
  dark:{ground:["#3a3735","#44403c","#2d2b29"], grass:"#55504a", veg:{dead:15, rocks:7, grass:16}, mood:"dark"},
  vineyard:{ground:["#5c5440","#695f48","#4f4836"], grass:"#7d7a50", veg:{dead:5, bush:6, grass:30, rocks:4}},
};
// для кожної локації: біом + об'єкти
const SCENE = {
  kaballon:{b:"meadow", road:true, x:["city"]}, spring:{b:"meadow", road:true, x:["village","spring"]}, fair:{b:"meadow", road:true, x:["fair"]},
  sagin:{b:"meadow", road:true, x:["tower","village"]}, kab_env:{b:"meadow", road:true, x:["fence"]}, mill:{b:"meadow", river:true, x:["mill"]},
  sparkford:{b:"meadow", river:true, x:["sparks"]}, north_cross:{b:"forest", river:true, x:["bridge"], mood:"dusk"}, sand:{b:"sand", sea:true, x:["nests"]},
  order_camp:{b:"meadow", x:["tents","palisade"], road:true}, dead_wood:{b:"dark", x:["camp_small"]}, academy:{b:"ash", x:["ruins_big"], mood:"dusk"},
  doom:{b:"forest", x:["webs"], mood:"dark"}, bay:{b:"sand", sea:true, x:["wreck"]}, citadel:{b:"dark", x:["citadel"]},
  spire:{b:"ash", road:true, x:["spire","village"]}, tavern:{b:"ash", road:true, x:["tavern"]}, forge:{b:"ash", road:true, x:["forge"]},
  ford:{b:"ash", river:true, road:true, x:["hut"]}, ruins:{b:"ash", x:["ruins"]}, ravine:{b:"forest", x:["cliffs"], mood:"dusk"},
  swamp:{b:"swamp"}, camp:{b:"ash", road:true, x:["tents","palisade"]}, chapel:{b:"dark", x:["chapel","graves"]}, pass:{b:"snow", road:true, x:["peaks"]},
  uzhgorod:{b:"meadow", road:true, x:["city","river_small"]}, mukachevo:{b:"meadow", road:true, x:["castle","village"]}, svalyava:{b:"forest", road:true, x:["village","spring"]},
  khust:{b:"meadow", road:true, x:["village","castle_ruin"]}, rakhiv:{b:"snow", road:true, x:["village","peaks"]},
  uzh:{b:"forest", road:true}, perech:{b:"forest"}, velbz:{b:"forest", x:["old_oaks"]}, sval:{b:"forest", x:["spring"]}, muk:{b:"meadow", x:["castle"], road:true},
  ber:{b:"vineyard", x:["vines","crypt"]}, vyn:{b:"vineyard", x:["vines"]}, irsh:{b:"swamp"}, volv:{b:"polonyna", x:["peaks","koliba"]}, hust:{b:"swamp", x:["castle_ruin"]},
  mizh:{b:"forest", lake:true}, tia:{b:"ash", x:["mine","salt"]}, rah:{b:"snow", x:["peaks","cave"]},
};
