/* ===================================================================
   ЕТАП 3: чотири нові наземні краї (ендгейм, рівень 10+)
   Крижані Пустки (північний схід), Дике Поле (схід),
   Затоплене узбережжя (південний захід), Піски Забутих Царів (південь)
   =================================================================== */
WORLD.w = 5240; WORLD.h = 3040;
Object.assign(REGIONS, {ice:"Крижані Пустки", steppe:"Дике Поле", coast:"Затоплене узбережжя", sand:"Піски Забутих Царів"});

/* ---------- вузли карти ---------- */
Object.assign(NODES, {
  // Крижані Пустки: за Мурами Старої Марки
  ic_post:{r:"ice", name:"Крижана застава", x:3990, y:310, kind:"town", lv:"застава"},
  ic_camp:{r:"ice", name:"Табір мамонтарів", x:4300, y:510, kind:"town", lv:"табір"},
  ic_river:{r:"ice", name:"Скута Ріка", x:4170, y:150, kind:"hunt", lv:"10"},
  ic_mammoth:{r:"ice", name:"Мамонтове пасовисько", x:4500, y:650, kind:"hunt", lv:"10"},
  ic_witch:{r:"ice", name:"Хутір снігової відьми", x:4540, y:340, kind:"hunt", lv:"10"},
  ic_burrows:{r:"ice", name:"Гоблінські нори", x:4800, y:190, kind:"danger", lv:"10–11"},
  ic_mine:{r:"ice", name:"Копальня гоблінів", x:4990, y:420, kind:"danger", lv:"11"},
  ic_pass:{r:"ice", name:"Морозний перевал", x:4730, y:540, kind:"danger", lv:"11"},
  ic_jotun:{r:"ice", name:"Печера Йотуна", x:4950, y:690, kind:"danger", lv:"12"},
  ic_king:{r:"ice", name:"Тронна нора Короля нір", x:5020, y:90, kind:"danger", lv:"12"},
  // Дике Поле: за Кістяною Цитаделлю
  wd_fort:{r:"steppe", name:"Козацька застава", x:3990, y:940, kind:"town", lv:"застава"},
  wd_inn:{r:"steppe", name:"Шинок «Три Могили»", x:4290, y:1040, kind:"town", lv:"шинок"},
  wd_balka:{r:"steppe", name:"Тарпанова балка", x:4590, y:890, kind:"hunt", lv:"10"},
  wd_kurgan:{r:"steppe", name:"Курган Предків", x:4210, y:1270, kind:"hunt", lv:"10"},
  wd_baba:{r:"steppe", name:"Стоянка Кам'яної баби", x:4540, y:1170, kind:"hunt", lv:"10–11"},
  wd_yar:{r:"steppe", name:"Кентаврів Яр", x:4880, y:990, kind:"danger", lv:"11"},
  wd_witch:{r:"steppe", name:"Відьмина Балка", x:4900, y:1290, kind:"danger", lv:"11"},
  wd_levada:{r:"steppe", name:"Палена левада", x:4160, y:1500, kind:"danger", lv:"11"},
  wd_gora:{r:"steppe", name:"Гора Горинича", x:5010, y:1500, kind:"danger", lv:"12"},
  // Затоплене узбережжя: за Затопленим Абатством
  cs_harbor:{r:"coast", name:"Рибальська гавань", x:900, y:1790, kind:"town", lv:"гавань"},
  cs_light:{r:"coast", name:"Розбитий маяк", x:1180, y:1720, kind:"hunt", lv:"10"},
  cs_shoal:{r:"coast", name:"Мілини потопельників", x:1000, y:2020, kind:"hunt", lv:"10"},
  cs_mermaid:{r:"coast", name:"Русалчина заводь", x:1320, y:1940, kind:"hunt", lv:"10"},
  cs_siren:{r:"coast", name:"Скеля сирен", x:1020, y:2290, kind:"danger", lv:"11"},
  cs_crab:{r:"coast", name:"Краб'ячі мілини", x:1360, y:2210, kind:"danger", lv:"11"},
  cs_ships:{r:"coast", name:"Цвинтар кораблів", x:980, y:2560, kind:"danger", lv:"11"},
  cs_fleet:{r:"coast", name:"Затоплена флотилія", x:1330, y:2520, kind:"danger", lv:"12"},
  cs_kraken:{r:"coast", name:"Лігво Кракена", x:1130, y:2800, kind:"danger", lv:"12"},
  // Піски Забутих Царів: на південь від Собору й Братської могили
  sd_oasis:{r:"sand", name:"Оаза караванників", x:2250, y:1800, kind:"town", lv:"оаза"},
  sd_dig:{r:"sand", name:"Табір розкопників", x:2680, y:1840, kind:"town", lv:"табір"},
  sd_bed:{r:"sand", name:"Мертве русло", x:1930, y:2010, kind:"hunt", lv:"10"},
  sd_scarab:{r:"sand", name:"Гніздо скарабеїв", x:2950, y:2000, kind:"hunt", lv:"10"},
  sd_temple:{r:"sand", name:"Храм шакала", x:1900, y:2340, kind:"danger", lv:"11"},
  sd_tomb:{r:"sand", name:"Мумієва гробниця", x:2520, y:2370, kind:"danger", lv:"11"},
  sd_worm:{r:"sand", name:"Хробакова западина", x:3030, y:2290, kind:"danger", lv:"11"},
  sd_lamia:{r:"sand", name:"Лігво ламії", x:3400, y:2040, kind:"danger", lv:"11"},
  sd_sphinx:{r:"sand", name:"Піраміда Сфінкса", x:2420, y:2740, kind:"danger", lv:"12"},
  sd_lich:{r:"sand", name:"Гробниця Царя-Ліча", x:3120, y:2700, kind:"danger", lv:"12"},
});

/* ---------- дороги ---------- */
ROADS.push(...[
  // переходи зі старих земель
  ["mk_wall","ic_post",1,-22,"Крижаний шлях"],["mk_throne","wd_fort",1,20,"Шлях на Дике Поле"],
  ["bg_abbey","cs_harbor",1,-26,"Сіль і мул"],["or_cathedral","sd_oasis",1,26,"Караванний шлях"],["or_grave","sd_oasis",1,-18,"Мертвий тракт"],
  // Крижані Пустки
  ["ic_post","ic_river",0,-14],["ic_post","ic_camp",0,12],["ic_river","ic_witch",0,12],["ic_camp","ic_witch",0,-12],["ic_camp","ic_mammoth",0,14],
  ["ic_river","ic_burrows",1,-12],["ic_witch","ic_pass",1,12],["ic_burrows","ic_mine",1,12],["ic_mine","ic_pass",1,-12],
  ["ic_mammoth","ic_pass",1,10],["ic_pass","ic_jotun",1,12],["ic_burrows","ic_king",1,-10],["ic_mine","ic_king",1,14],
  // Дике Поле
  ["wd_fort","wd_inn",0,12],["wd_inn","wd_balka",0,-12],["wd_inn","wd_baba",0,14],["wd_fort","wd_kurgan",0,-14],["wd_kurgan","wd_baba",0,12],
  ["wd_balka","wd_yar",1,-12],["wd_baba","wd_yar",1,12],["wd_baba","wd_witch",1,-10],["wd_kurgan","wd_levada",1,12],["wd_levada","wd_gora",1,-14],["wd_witch","wd_gora",1,12],
  ["ic_mammoth","wd_balka",1,-16,"Мерзлий скид"],
  // Затоплене узбережжя
  ["cs_harbor","cs_light",0,-12],["cs_harbor","cs_shoal",0,12],["cs_light","cs_mermaid",0,12],["cs_shoal","cs_mermaid",0,-12],
  ["cs_shoal","cs_siren",1,12],["cs_mermaid","cs_crab",1,-12],["cs_siren","cs_crab",1,12],["cs_siren","cs_ships",1,-12],["cs_crab","cs_fleet",1,12],
  ["cs_ships","cs_fleet",1,-12],["cs_ships","cs_kraken",1,12],["cs_fleet","cs_kraken",1,-12],
  // Піски Забутих Царів
  ["sd_oasis","sd_dig",0,12],["sd_oasis","sd_bed",0,-14],["sd_dig","sd_scarab",0,12],["sd_bed","sd_temple",1,-12],["sd_oasis","sd_tomb",1,12],["sd_dig","sd_tomb",1,-12],
  ["sd_scarab","sd_worm",1,12],["sd_scarab","sd_lamia",1,-12],["sd_temple","sd_tomb",1,12],["sd_tomb","sd_sphinx",1,-12],["sd_worm","sd_lich",1,12],["sd_tomb","sd_worm",1,12],["sd_lamia","sd_worm",1,-12],
  ["sd_sphinx","sd_lich",1,14],
  // між краями
  ["cs_crab","sd_bed",1,-20,"Берегова стежка"],["wd_levada","sd_lamia",1,-22,"Сухий шлях"],
].map(mkRoad));

/* ---------- вороги: Крижані Пустки ---------- */
Object.assign(MOBS, {
  ice_wolf:{name:"Крижаний вовк", arch:"chaser", pack:true, aggro:true, lore:"Білий вовк із інеєм на шерсті. Полює зграями й загризає тих, хто відстав.", p:{hp:1.1, dmg:1.1, agi:3}, ward:["Вогонь","Залізо"], drop:[["ice_fang",.6],["frost_pelt",.3]], design:D("beast","#cfd8de","#8a98a4","#8ae0ff",[],{size:1.1})},
  mammoth:{name:"Мамонт", arch:"bruiser", lore:"Волохатий велетень з бивнями, як стовпи. Переходить дорогу, не помічаючи тих, хто на ній стоїть.", p:{hp:1.8, dmg:1.15, def:1.2, agi:-3}, ward:["Вогонь"], drop:[["mammoth_tusk",.6],["frost_pelt",.4]], design:D("beast","#7a5a44","#3a2a20","#ffd86f",["horns"],{size:1.8})},
  snow_witch:{name:"Снігова відьма", arch:"caster", lore:"Стара жінка, що живе на хуторі посеред заметів. Холод у її руках чекає на тебе.", p:{hp:.95, dmg:1.1}, ward:["Вогонь","Срібло"], drop:[["witch_icicle",.6],["frost_pelt",.2]], design:D("robed","#bcd4e4","#6a8aa4","#8ae0ff",["hood"],{prop:"staff", size:1.3})},
  frost_giant:{name:"Паморозний велетень", arch:"bruiser", cleave:true, lore:"Велетень, що виріс із криги. Кожен його крок лишає тріщини в землі.", p:{hp:1.7, dmg:1.2, def:1.1, agi:-3}, ward:["Вогонь"], drop:[["jotun_heart",.1],["frost_pelt",.4],["mammoth_tusk",.2]], design:D("giant","#a8c8dc","#4a6a84","#8ae0ff",["horns"],{prop:"club", size:1.85})},
  gob_digger:{name:"Гоблін-копач", arch:"chaser", pack:true, aggro:true, lore:"Дрібний гоблін із кайлом. Копає ходи під усією Пусткою й вилазить там, де його не чекають.", p:{hp:.8, dmg:.95, agi:2}, ward:["Залізо","Вогонь"], drop:[["gob_nugget",.6]], design:D("humanoid","#6a8a4a","#3a4a2a","#ffd86f",[],{prop:"pick", size:.9})},
  gob_shaman:{name:"Гоблін-шаман", arch:"summoner", summon:"gob_digger", lore:"Шаман із черепом на палиці. Поки він шепоче, з нір лізуть нові гобліни.", p:{hp:.9}, ward:["Вогонь","Срібло"], drop:[["gob_nugget",.5],["witch_icicle",.15]], design:D("robed","#6a8a4a","#3a2a1a","#ff9a3a",["skull"],{prop:"staff", size:1})},
  gob_sapper:{name:"Гоблін-підривник", arch:"exploder", aggro:true, lore:"Гоблін із бочкою чорного пороху. Біжить прямо на тебе й сміється.", p:{hp:.75, dmg:1.4, agi:2}, ward:["Сіль"], drop:[["gob_nugget",.6]], design:D("humanoid","#8a7a3a","#4a3a1a","#ff5a3a",[],{prop:"bomb", size:.95})},
  troglodyte:{name:"Троглодит", arch:"chaser", aggro:true, lore:"Сліпа істота з гоблінських копалень. Чує крок за сотню кроків і нападає з темряви.", p:{hp:1.15, dmg:1.1, agi:1}, ward:["Вогонь"], drop:[["gob_nugget",.5],["drake_scale",.1]], design:D("humanoid","#7a7a6a","#3a3a30","#d8e8ff",[],{size:1.15})},
  ice_drake:{name:"Крижаний вивірн", arch:"flyer", aggro:true, lore:"Крилатий змій із перевалу. Дихає морозом і спускається з неба, коли чує запах крові.", p:{hp:1.4, dmg:1.2, agi:2}, ward:["Вогонь"], drop:[["drake_scale",.6],["jotun_heart",.08]], design:D("bird","#8ac8e8","#3a6a8a","#ffffff",["horns"],{size:1.7})},
  wolf_rider:{name:"Гоблін на вовку", arch:"chaser", aggro:true, lore:"Гобліни-вершники налітають на мамонтарів уздовж Скутої Ріки. Вовк кусає, гоблін коле списом.", p:{hp:1, dmg:1.15, agi:3}, ward:["Вогонь","Залізо"], drop:[["ice_fang",.4],["gob_nugget",.4]], design:D("beast","#7a8a6a","#3a4a2a","#ffd86f",[],{size:1.3})},
  jotun:{name:"Йотун", arch:"bruiser", boss:true, cleave:true, lore:"Старший з велетнів Пустки. Спить у печері на горі смарагдових крижин і прокидається раз на сто років. Цього разу ви його розбудили.", p:{hp:1.3, dmg:1.1}, ward:["Вогонь"], drop:[["jotun_hammer",.45],["jotun_heart",1],["mammoth_tusk",.6],["raw3",1]], design:D("giant","#9ad0f0","#3a6a8a","#ffffff",["horns","crown"],{prop:"club", size:2.1})},
  gob_king:{name:"Король нір", arch:"summoner", boss:true, summon:"gob_digger", lore:"Найбагатший і найпідліший із гоблінів. Сидить на купі золота, яке гобліни крали сто років, і кличе нових підданих, коли гине старий.", p:{hp:1.1}, ward:["Вогонь","Залізо"], drop:[["gob_crown",.45],["gob_nugget",1],["raw3",1]], design:D("humanoid","#8a9a5a","#4a3a1a","#ffd86f",["crown"],{prop:"staff", size:1.5})},
});

/* ---------- вороги: Дике Поле ---------- */
Object.assign(MOBS, {
  steppe_bandit:{name:"Степовий розбійник", arch:"thief", aggro:true, lore:"Розбійник на коні, що втратив коня. Грабує на шляху й тікає в бур'ян.", p:{cop:3, agi:2, dmg:1.05}, ward:["Залізо"], drop:[["bandit_tamga",.5],["tarpan_mane",.15]], design:D("humanoid","#8a6a4a","#4a3220","#ffd86f",["hood"],{prop:"sword", size:1.1})},
  centaur:{name:"Кентавр", arch:"kiter", lore:"Напівкінь-напівлюдина з луком. Стріляє здаля й тікає від усього, що наближається.", p:{hp:1.1, dmg:1.15, agi:3}, ward:["Залізо"], drop:[["centaur_shoe",.5],["tarpan_mane",.3]], design:D("beast","#8a5a3a","#3a2a1a","#ffd86f",[],{prop:"bow", size:1.5})},
  stone_baba:{name:"Кам'яна баба", arch:"bruiser", lore:"Давній ідол зі степової могили. Каже, що ожила з нудьги, і б'є тих, хто заважає спати.", p:{hp:1.6, dmg:1.1, def:1.8, agi:-3}, ward:["Залізо"], drop:[["baba_chip",.6],["kurgan_gold",.15]], design:D("golem","#9a9a8a","#5a5a50","#ffd86f",[],{size:1.7})},
  kurgan_dead:{name:"Мертвий курганник", arch:"shielded", rise:true, lore:"Воїн зі скіфського кургану. Поховали його з конем, золотом і мечем, і він цього не забув.", p:{hp:1.2, def:1.3, dmg:1.1}, ward:["Освячена вода","Хрест","Залізо"], drop:[["kurgan_gold",.5],["tarpan_mane",.15]], design:D("skeleton","#c8b890","#5a4a2a","#ffd86f",["shield"],{prop:"sword", size:1.2})},
  steppe_wolf:{name:"Степовий вовк", arch:"chaser", pack:true, aggro:true, lore:"Рудий вовк високої трави. Бігає цілий день і не втомлюється.", p:{hp:.95, dmg:1.05, agi:3}, ward:["Вогонь","Залізо"], drop:[["tarpan_mane",.3]], design:D("beast","#a8885a","#5a4a2a","#ffd86f",[],{size:1.05})},
  tarpan:{name:"Дикий тарпан", arch:"chaser", aggro:true, lore:"Дикий степовий кінь. Ніхто його не їздив, і він іде в атаку, не дивлячись на те, чи ти на його шляху.", p:{hp:1.2, dmg:1.1, agi:2}, ward:["Залізо"], drop:[["tarpan_mane",.6]], design:D("beast","#8a7a5a","#3a2a1a","#ff9a3a",[],{size:1.4})},
  babai:{name:"Бабай", arch:"caster", aggro:true, lore:"Чорна постать з-під степової трави. Приходить до тих, хто вночі не спить, і забирає їх сни.", p:{hp:1, dmg:1.1}, ward:["Сіль","Вогонь","Молитва"], drop:[["witch_wort",.5],["bandit_tamga",.2]], design:D("robed","#2a2a3a","#12121a","#ff3a6a",["hood"],{size:1.3})},
  steppe_witch:{name:"Степова відьма", arch:"caster", lore:"Відьма Відьминої Балки. Варить зілля з чебрецю й полину, а від зілля тікає все живе.", p:{hp:.95, dmg:1.15}, ward:["Вогонь","Срібло","Рута-м'ята"], drop:[["witch_wort",.6],["centaur_shoe",.1]], design:D("robed","#7a6a4a","#3a2a1a","#9aff6a",["hood"],{prop:"staff", size:1.3})},
  gorynych:{name:"Змій Горинич", arch:"bruiser", boss:true, regrow:.06, cleave:true, lore:"Триголовий змій з гори. Дихає вогнем, і кожну відрубану голову відтягує вогнем назад.", p:{hp:1.2, dmg:1.15}, ward:["Освячена вода","Залізо"], drop:[["gorynych_fang",.45],["gorynych_scale",1],["raw3",1]], design:D("hydra","#7a3a2a","#2a1a14","#ff9a3a",["horns"],{size:2.1})},
});

/* ---------- вороги: Затоплене узбережжя ---------- */
Object.assign(MOBS, {
  coast_drowned:{name:"Береговий потопельник", arch:"chaser", aggro:true, lore:"Моряк, що не дійшов до гавані. Тягне за ногу в мілину й не відпускає.", p:{hp:1.1, dmg:1.05}, ward:["Сіль","Вогонь","Молитва"], drop:[["drowned_coin",.6],["ship_bell",.1]], design:D("humanoid","#6a8a8a","#2a4a4a","#9affd8",[],{size:1.1})},
  mermaid:{name:"Русалка-мореня", arch:"caster", lore:"Русалка з брудної заводі. Співає так, що ноги самі ідуть до води.", p:{hp:.95, dmg:1.1}, ward:["Сіль","Вогонь"], drop:[["siren_hair",.5],["sea_pearl",.3]], design:D("frog","#7ab8a8","#2a6a6a","#9affd8",[],{size:1.1})},
  siren:{name:"Сирена", arch:"flyer", aggro:true, lore:"Крилата діва зі скелі. Її спів бачать ті, хто втрачає розум, а чують лише ті, хто ще не втратив.", p:{hp:1, dmg:1.15, agi:2}, ward:["Дзвін","Залізо"], drop:[["siren_hair",.6],["sea_pearl",.3]], design:D("bird","#9ab8d8","#3a5a8a","#ff9aff",["horns"],{size:1.3})},
  giant_crab:{name:"Велетенський краб", arch:"shielded", lore:"Краб завбільшки з віз. Клешня перекушує мачту, і йому однаково, що кусати.", p:{hp:1.4, def:1.7, dmg:1.1, agi:-1}, ward:["Вогонь"], drop:[["crab_claw",.6],["sea_scale",.2]], design:D("blob","#c85a3a","#6a2a1a","#ffd86f",["claws"],{size:1.5})},
  sea_serpent:{name:"Морський змій", arch:"bruiser", lore:"Довгий, як три шлюпки. Підкрадається з-під води й обвиває жертву так швидко, що та не встигає крикнути.", p:{hp:1.3, dmg:1.15}, ward:["Вогонь","Залізо"], drop:[["sea_scale",.6],["sea_pearl",.15]], design:D("serpent","#3a7a8a","#1a3a4a","#9affd8",[],{size:1.8})},
  ghost_pirate:{name:"Привид пірата", arch:"chaser", aggro:true, lore:"Пірат із Цвинтаря кораблів. Мечем не вбити, золотом не підкупити, а грабує він і мертвих.", p:{hp:1, dmg:1.15, agi:2}, ward:["Срібло","Сіль","Молитва"], drop:[["drowned_coin",.6],["ship_bell",.2]], design:D("humanoid","#7a9a9a","#2a3a4a","#9affd8",["hood"],{prop:"sword", size:1.2})},
  kraken_tentacle:{name:"Щупалець Кракена", arch:"bruiser", lore:"Один з десятка щупалець. Вистрибує з води, коли чує кроки на березі.", p:{hp:1.4, dmg:1.1, agi:-2}, ward:["Вогонь"], drop:[["kraken_ink",.5],["sea_scale",.15]], design:D("serpent","#5a3a7a","#2a1a3a","#ff9aff",[],{size:1.7})},
  flotilla_captain:{name:"Капітан Затопленої флотилії", arch:"shielded", boss:true, summon:"ghost_pirate", lore:"Адмірал, що привів флот до Лігва й не повернувся. Він і досі командує, і матроси відповідають йому з дна.", p:{hp:1.2, def:1.2}, ward:["Срібло","Молитва"], drop:[["captain_compass",.45],["ship_bell",1],["raw3",1]], design:D("humanoid","#5a7a8a","#1a2a3a","#9affd8",["hood","crown"],{prop:"sword", size:1.6})},
  kraken:{name:"Кракен", arch:"bruiser", boss:true, cleave:true, lore:"Тварина, що старша за узбережжя. Потопила кораблі, які її шукали, і чекає тих, що шукають ще.", p:{hp:1.3, dmg:1.1}, ward:["Вогонь","Залізо"], drop:[["kraken_trident",.45],["kraken_ink",1],["raw3",1]], design:D("blob","#5a3a8a","#2a1a4a","#ff9aff",["tentacles"],{size:2.2})},
});

/* ---------- вороги: Піски Забутих Царів ---------- */
Object.assign(MOBS, {
  mummy:{name:"Мумія", arch:"shielded", lore:"Забальзамований служник давніх царів. Не квапиться, бо до кінця світу ще далеко, а гроби охороняти нікому більше.", p:{hp:1.3, def:1.2, dmg:1.1}, ward:["Вогонь","Освячена вода"], drop:[["mummy_linen",.6],["desert_glass",.15]], design:D("humanoid","#d8c8a0","#8a7a50","#6aff9a",[],{size:1.25})},
  jackal_priest:{name:"Жрець шакала", arch:"caster", lore:"Жрець із шакалячою головою. Знає, яке слово розбудить мерця й яке його вкладе.", p:{hp:1, dmg:1.15}, ward:["Вогонь","Срібло","Молитва"], drop:[["jackal_idol",.5],["mummy_linen",.3]], design:D("robed","#2a2a3a","#8a7a2a","#ffd86f",["horns"],{prop:"staff", size:1.35})},
  scarab_swarm:{name:"Рій скарабеїв", arch:"swarmer", aggro:true, evade:15, lore:"Чорний рій із гробниць. Об'їдає все до кісток і лишає тільки бурштин.", p:{hp:.8, dmg:.9, agi:3}, ward:["Вогонь"], drop:[["scarab_amber",.6]], design:D("swarm","#2a3a3a","#0a1a1a","#6aff9a",[],{size:1.7})},
  sand_worm:{name:"Піщаний хробак", arch:"bruiser", lore:"Хробак довжиною з вулицю. Виринає з-під піску й пірнає назад із тим, що встиг схопити.", p:{hp:1.6, dmg:1.2, agi:-1}, ward:["Вогонь"], drop:[["desert_glass",.5],["ghoul_tooth",.1]], design:D("serpent","#9a8a5a","#4a3a20","#ff9a3a",[],{size:1.9})},
  djinn:{name:"Джин", arch:"caster", aggro:true, lore:"Дух, що вийшов із лампи й не повернувся. Виконує бажання, але не ті, які просили.", p:{hp:1.1, dmg:1.2}, ward:["Залізо","Срібло"], drop:[["djinn_ash",.6],["desert_glass",.2]], design:D("wisp","#ff9a3a","#8a3a10","#ffffff",[],{size:1.5})},
  lamia:{name:"Ламія", arch:"chaser", aggro:true, lore:"Напівжінка-напівзмія. Заманює мандрівників у печеру й вичавлює з них усе, що вони везли з собою.", p:{hp:1.2, dmg:1.15, agi:2}, ward:["Залізо","Вогонь"], drop:[["lamia_scale",.6],["desert_glass",.15]], design:D("serpent","#8a6a3a","#3a2a10","#ffd86f",[],{size:1.5})},
  ghoul:{name:"Гуль", arch:"chaser", pack:true, aggro:true, lore:"Пожирач мерців. Ночами виходить із-під піску й шукає, що поїсти.", p:{hp:1.1, dmg:1.1, agi:2}, ward:["Залізо","Сіль","Вогонь"], drop:[["ghoul_tooth",.6]], design:D("humanoid","#8a8a6a","#3a3a2a","#ff5a3a",[],{size:1.2})},
  dust_devil:{name:"Пустельний вихор", arch:"flyer", aggro:true, lore:"Пилова буря, що ходить пішки. Засліплює піском і вириває зброю з рук.", p:{hp:.95, dmg:1.1, agi:3}, ward:["Рута-м'ята"], drop:[["desert_glass",.4],["djinn_ash",.2]], design:D("wisp","#c8b88a","#8a7a4a","#ffffff",[],{size:1.4})},
  sphinx:{name:"Сфінкс", arch:"caster", boss:true, lore:"Лев із людським обличчям. Загадує тим, хто хоче пройти до піраміди, а не відгадав — той уже ніколи нічого не загадає.", p:{hp:1.3, dmg:1.15}, ward:["Залізо","Вогонь"], drop:[["sphinx_eye",.45],["desert_glass",1],["raw3",1]], design:D("beast","#c8a85a","#6a4a1a","#6aff9a",["crown"],{size:2.1})},
  lich_king:{name:"Цар-Ліч", arch:"summoner", boss:true, summon:"mummy", lore:"Цар, що вмер і вирішив не вмирати. Сидить на золотому троні й ніколи не втомлюється чекати.", p:{hp:1.15, dmg:1.1}, ward:["Освячена вода","Срібло","Молитва"], drop:[["lich_scepter",.45],["desert_glass",1],["raw3",1]], design:D("robed","#e8d890","#4a3a10","#6aff9a",["crown","skull"],{prop:"staff", size:1.9})},
});
for (const [id, m] of Object.entries(MOBS)) if (!m.id) prepMob(id, m);

/* ---------- предмети ---------- */
Object.assign(ITEMS, {
  // Крижані Пустки
  ice_axe:{name:"Сокира мамонтаря", slot:"weapon", dmg:[31,40], str:2, price:7200, lvl:10, sock:1},
  frost_halberd:{name:"Крижана алебарда", slot:"weapon", dmg:[30,41], agi:2, crit:2, price:7600, lvl:10, sock:1},
  mammoth_helm:{name:"Шолом із бивнем", slot:"helmet", def:7, hp:26, price:4400, lvl:10, sock:1},
  mammoth_plate:{name:"Хутряний панцир", slot:"armor", def:10, hp:46, price:6200, lvl:10, sock:1},
  ice_boots:{name:"Хутряні унти", slot:"boots", def:4, hp:16, agi:1, price:3300, lvl:10},
  bear_gloves:{name:"Рукавиці з ведмежої шкури", slot:"gloves", def:2, str:2, hp:14, price:3200, lvl:10},
  wolf_cloak:{name:"Плащ полярного вовка", slot:"cloak", hp:30, agi:3, crit:1, price:4100, lvl:10},
  jotun_hammer:{name:"Молот Йотуна", slot:"weapon", dmg:[36,47], str:3, blunt:true, price:13200, lvl:10, sock:2, rare:true, unique:true},
  gob_crown:{name:"Корона Короля нір", slot:"helmet", def:6, hp:36, crit:3, wil:2, price:9400, lvl:10, sock:1, rare:true, unique:true},
  // Дике Поле
  steppe_saber:{name:"Козацька шабля", slot:"weapon", dmg:[32,41], agi:2, crit:3, price:7800, lvl:10, sock:1},
  baba_mace:{name:"Булава з Кам'яної баби", slot:"weapon", dmg:[33,42], str:3, blunt:true, price:7900, lvl:10, sock:1},
  kozak_helm:{name:"Шишак-мисюрка", slot:"helmet", def:6, hp:22, crit:2, price:4300, lvl:10},
  steppe_mail:{name:"Кольчуга-бехтерець", slot:"armor", def:10, hp:34, agi:1, price:6000, lvl:10, sock:1},
  steppe_boots:{name:"Чоботи-сап'янці", slot:"boots", def:4, hp:12, agi:2, price:3300, lvl:10},
  kozak_belt:{name:"Козацький пояс", slot:"belt", hp:30, str:2, agi:1, price:3500, lvl:10},
  burka:{name:"Бурка", slot:"cloak", hp:28, agi:3, def:1, price:4000, lvl:10},
  gorynych_fang:{name:"Ікло Горинича", slot:"weapon", dmg:[37,48], str:2, agi:2, crit:3, price:13400, lvl:10, sock:2, rare:true, unique:true},
  // Затоплене узбережжя
  whaler_harpoon:{name:"Гарпун китобоя", slot:"weapon", dmg:[31,41], agi:2, price:7400, lvl:10, sock:1},
  boarding_cutlass:{name:"Абордажний тесак", slot:"weapon", dmg:[30,40], crit:4, price:7500, lvl:10, sock:1},
  captain_hat:{name:"Капітанський трикутник", slot:"helmet", def:6, hp:24, wil:2, price:4300, lvl:10},
  scale_armor:{name:"Лускатий панцир", slot:"armor", def:10, hp:38, price:6100, lvl:10, sock:1},
  sea_boots:{name:"Високі морські чоботи", slot:"boots", def:4, hp:16, agi:1, price:3300, lvl:10},
  pearl_amulet:{name:"Перлинне намисто", slot:"amulet", hp:42, wil:3, price:5200, lvl:10, sock:1},
  sea_cloak:{name:"Плащ із водоростей", slot:"cloak", hp:28, wil:2, agi:2, price:4000, lvl:10},
  captain_compass:{name:"Компас адмірала", slot:"amulet", hp:56, agi:3, wil:2, price:9800, lvl:10, sock:1, rare:true, unique:true},
  kraken_trident:{name:"Тризуб Кракена", slot:"weapon", dmg:[36,47], agi:3, wil:2, price:13200, lvl:10, sock:2, rare:true, unique:true},
  // Піски Забутих Царів
  khopesh:{name:"Хопеш царя", slot:"weapon", dmg:[32,42], crit:3, price:7800, lvl:10, sock:1},
  scarab_staff:{name:"Посох із скарабея", slot:"weapon", dmg:[28,38], wil:4, price:7600, lvl:10, sock:1},
  gold_mask:{name:"Золота маска", slot:"helmet", def:6, hp:24, wil:2, price:4400, lvl:10, sock:1},
  linen_wrap:{name:"Лляний панцир бальзамувальника", slot:"armor", def:9, hp:34, wil:2, price:6000, lvl:10},
  sand_sandals:{name:"Пісчані сандалі", slot:"boots", def:3, hp:12, agi:3, price:3300, lvl:10},
  burnus:{name:"Бурнус мандрівника", slot:"cloak", hp:28, agi:3, wil:1, price:4000, lvl:10},
  ankh_amulet:{name:"Анкх", slot:"amulet", hp:40, wil:3, price:5200, lvl:10, sock:1},
  scarab_ring:{name:"Перстень-скарабей", slot:"ring", hp:24, crit:3, price:4000, lvl:10},
  sphinx_eye:{name:"Око Сфінкса", slot:"amulet", hp:52, wil:4, crit:2, price:10000, lvl:10, sock:1, rare:true, unique:true},
  lich_scepter:{name:"Скіпетр Царя-Ліча", slot:"weapon", dmg:[34,46], wil:5, price:13600, lvl:10, sock:2, rare:true, unique:true},
  // трофеї
  ice_fang:{name:"Крижане ікло", price:60}, mammoth_tusk:{name:"Бивень мамонта", price:140}, frost_pelt:{name:"Біла шкура", price:80}, witch_icicle:{name:"Бурулька відьми", price:100},
  gob_nugget:{name:"Гоблінський самородок", price:70}, jotun_heart:{name:"Серце велетня", price:220}, drake_scale:{name:"Луска вивірна", price:130},
  tarpan_mane:{name:"Грива тарпана", price:60}, baba_chip:{name:"Уламок баби", price:80}, kurgan_gold:{name:"Курганне золото", price:150}, centaur_shoe:{name:"Кентаврова підкова", price:90},
  witch_wort:{name:"Відьмин полин", price:80}, bandit_tamga:{name:"Тамга розбійника", price:55}, gorynych_scale:{name:"Луска Горинича", price:240},
  sea_pearl:{name:"Морська перлина", price:150}, crab_claw:{name:"Клешня краба", price:90}, siren_hair:{name:"Волосся сирени", price:110}, sea_scale:{name:"Морська луска", price:100},
  ship_bell:{name:"Корабельний дзвін", price:130}, kraken_ink:{name:"Чорнило Кракена", price:200}, drowned_coin:{name:"Утоплена монета", price:75},
  mummy_linen:{name:"Бальзамувальне полотно", price:70}, scarab_amber:{name:"Бурштиновий скарабей", price:110}, jackal_idol:{name:"Ідол шакала", price:120}, desert_glass:{name:"Пустельне скло", price:140},
  djinn_ash:{name:"Попіл джина", price:130}, ghoul_tooth:{name:"Зуб гуля", price:80}, lamia_scale:{name:"Луска ламії", price:120},
});
for (const [id, it] of Object.entries(ITEMS)) if (!it.id) prepItem(id, it);
Object.assign(ITEM_IC, {
  ice_axe:"battle-axe", frost_halberd:"halberd", mammoth_helm:"horned-helm", mammoth_plate:"fur-shirt", ice_boots:"leather-boot", bear_gloves:"gloves", wolf_cloak:"cape", jotun_hammer:"warhammer", gob_crown:"crown",
  steppe_saber:"crescent-blade", baba_mace:"flanged-mace", kozak_helm:"visored-helm", steppe_mail:"chain-mail", steppe_boots:"leather-boot", kozak_belt:"belt", burka:"cloak", gorynych_fang:"bestial-fangs",
  whaler_harpoon:"harpoon-trident", boarding_cutlass:"piercing-sword", captain_hat:"pilgrim-hat", scale_armor:"leather-armor", sea_boots:"metal-boot", pearl_amulet:"pearl-necklace", sea_cloak:"cape", captain_compass:"treasure-map", kraken_trident:"harpoon-trident",
  khopesh:"crescent-blade", scarab_staff:"skull-staff", gold_mask:"black-knight-helm", linen_wrap:"rolled-cloth", sand_sandals:"boots", burnus:"cloak", ankh_amulet:"gem-pendant", scarab_ring:"ring", sphinx_eye:"eye-target", lich_scepter:"skull-staff",
  ice_fang:"fangs", mammoth_tusk:"boar-tusks", frost_pelt:"animal-hide", witch_icicle:"crystal-shine", gob_nugget:"ore", jotun_heart:"stone-sphere", drake_scale:"fish-scales",
  tarpan_mane:"rolled-cloth", baba_chip:"stone-sphere", kurgan_gold:"two-coins", centaur_shoe:"metal-scales", witch_wort:"herbs-bundle", bandit_tamga:"medal", gorynych_scale:"fish-scales",
  sea_pearl:"pearl-necklace", crab_claw:"claws", siren_hair:"rolled-cloth", sea_scale:"fish-scales", ship_bell:"ringing-bell", kraken_ink:"drop", drowned_coin:"two-coins",
  mummy_linen:"rolled-cloth", scarab_amber:"crystal-shine", jackal_idol:"skull-crossed-bones", desert_glass:"crystal-cluster", djinn_ash:"powder", ghoul_tooth:"fangs", lamia_scale:"fish-scales",
});
Object.assign(SETS, {
  mammoth:{name:"Комплект мамонтаря", items:["mammoth_helm","mammoth_plate","ice_boots","bear_gloves","wolf_cloak"], bonus:{2:{hp:40}, 4:{def:6, str:2}, 5:{dmgp:8, hp:60}}},
  kozak:{name:"Комплект козака", items:["kozak_helm","steppe_mail","steppe_boots","kozak_belt","burka"], bonus:{2:{agi:2}, 4:{crit:3, hp:30}, 5:{dmgp:8, crit:3}}},
  sailor:{name:"Комплект морського вовка", items:["captain_hat","scale_armor","sea_boots","pearl_amulet","sea_cloak"], bonus:{2:{hp:40}, 4:{wil:3, agi:2}, 5:{dmgp:7, hp:60}}},
  pharaoh:{name:"Комплект царських слуг", items:["gold_mask","linen_wrap","sand_sandals","ankh_amulet","burnus"], bonus:{2:{wil:2, hp:30}, 4:{crit:3, wil:2}, 5:{dmgp:8, crit:3}}},
});
for (const k of ["mammoth","kozak","sailor","pharaoh"]) for (const id of SETS[k].items) ITEMS[id].set = k;

/* ---------- крамниці ---------- */
Object.assign(SHOPS, {
  brane:["potion_xl","potion_xe","ice_axe","frost_halberd","mammoth_helm","mammoth_plate","ice_boots","bear_gloves","wolf_cloak"],
  borko:["potion_xl","potion_xe","w_torch","w_salt","w_water","scroll_fire","elix_str","elix_skin","zhyvytsia"],
  luka:["potion_xl","potion_xe","steppe_saber","baba_mace","kozak_helm","steppe_mail","steppe_boots","kozak_belt","burka"],
  darka:["potion_xl","potion_xe","w_ruta","w_polyn","w_silver","w_iron","w_salt","scroll_storm","elix_agi","elix_wil","zhyvytsia"],
  timish:["potion_xl","potion_xe","whaler_harpoon","boarding_cutlass","captain_hat","scale_armor","sea_boots","pearl_amulet","sea_cloak"],
  zara:["potion_xl","potion_xe","w_water","w_salt","w_torch","w_prayer","scroll_curse","elix_wil","elix_skin"],
  leontiy:["potion_xl","potion_xe","khopesh","scarab_staff","gold_mask","linen_wrap","sand_sandals","burnus","ankh_amulet","scarab_ring"],
});
SMITHS.push("brane","luka","timish","leontiy");

/* ---------- локації ---------- */
Object.assign(LOCS, {
  // --- Крижані Пустки ---
  ic_post:{desc:"Застава ярла за Мурами Старої Марки. Зруби обліплені інеєм, а над воротами висить череп мамонта.", npcs:[["ratmir",330,220],["brane",590,260]],
    buildings:[["Дім ярла","npc:ratmir"],["Кузня Бране","npc:brane"],["Гаряча купіль","heal:Ви відігрілися в гарячій купелі. Сили повністю відновилися."]]},
  ic_camp:{desc:"Табір мамонтарів: хутряні намети на узбіччі пасовиська. Тут продають шкури, бивні й гарячий узвар.", npcs:[["borko",450,230]],
    buildings:[["Намет Борка","npc:borko"],["Загартований вогонь","heal:Ви посиділи біля багаття мамонтарів. Сили повністю відновилися."]], res:{herb:3}},
  ic_river:{desc:"Скута Ріка. Лід такий товстий, що мамонти ходять по ньому, а вовки полюють вздовж берега.", mobs:[["ice_wolf",3,10],["wolf_rider",2,10],["snow_witch",1,10]], res:{fish:4}, boss:["ice_wolf",11]},
  ic_mammoth:{desc:"Широке пасовисько під снігом. Мамонти пасуться цілим стадом і не люблять, коли на них дивляться.", mobs:[["mammoth",3,10],["ice_wolf",2,10],["frost_giant",1,11]], res:{herb:4}, boss:["mammoth",11]},
  ic_witch:{desc:"Самотній хутір серед заметів. Димар не димить, а двері відчинені. Ті, хто ввійшов, не виходили.", mobs:[["snow_witch",3,10],["ice_wolf",2,10],["wolf_rider",1,10]], res:{herb:4}, boss:["snow_witch",11]},
  ic_burrows:{desc:"Лабіринт гоблінських нір під скелею. У темряві пахне порохом і смаженим м'ясом.", mobs:[["gob_digger",4,10],["gob_shaman",2,10],["gob_sapper",2,10]], res:{mine:4}, boss:["gob_shaman",11]},
  ic_mine:{desc:"Стара копальня. Гобліни викопали більше, ніж могли вивезти, і тепер там живе те, що вони розбудили.", mobs:[["gob_sapper",3,11],["troglodyte",3,11],["gob_digger",2,10]], res:{mine:5}, boss:["troglodyte",11]},
  ic_pass:{desc:"Перевал між двома кряжами. Вітер зриває намети, а з неба падає те, що спить у скелях.", mobs:[["frost_giant",2,11],["ice_drake",2,11],["ice_wolf",2,10],["wolf_rider",2,10]], res:{mine:4}, boss:["ice_drake",12]},
  ic_jotun:{desc:"Печера в кризі синього кольору. Крізь льодяні стіни видно щось величезне.", mobs:[["frost_giant",2,11],["ice_drake",1,11],["mammoth",1,11]], res:{mine:5}, boss:["jotun",12]},
  ic_king:{desc:"Тронна нора під горою золота. Король сидить на ній і лічить, скільки вкрав.", mobs:[["gob_shaman",2,11],["gob_digger",2,10],["troglodyte",2,11],["wolf_rider",1,11]], res:{mine:5}, boss:["gob_king",12]},
  // --- Дике Поле ---
  wd_fort:{desc:"Козацька застава на межі степу. Тин з дубових колод, вежа з дзвоном, і всі пильнують небо.", npcs:[["pylyp",330,220],["luka",590,260]],
    buildings:[["Курінь отамана","npc:pylyp"],["Зброярня Луки","npc:luka"],["Сінник","heal:Ви виспалися в сіннику. Сили повністю відновилися."]]},
  wd_inn:{desc:"Шинок серед степу, поставлений на перетині шляхів. Тут п'ють, торгують і чекають, поки перейде гроза.", npcs:[["darka",450,230]],
    buildings:[["Шинкарка Дарка","npc:darka"],["Нічліг","heal:Ви проспали ніч під дахом шинку. Сили повністю відновилися."]], res:{herb:3}},
  wd_balka:{desc:"Широка балка, де пасуться дикі коні. Їх пасуть вовки, а вовків пасуть розбійники.", mobs:[["tarpan",3,10],["steppe_wolf",2,10],["steppe_bandit",2,10]], res:{herb:4}, boss:["tarpan",11]},
  wd_kurgan:{desc:"Курган предків. Земля навколо нього стоїть дибки, а місяць завжди над ним.", mobs:[["kurgan_dead",3,10],["steppe_wolf",1,10],["babai",1,10]], res:{mine:3}, boss:["kurgan_dead",11]},
  wd_baba:{desc:"Стоянка, де століттями стоять кам'яні баби. Вночі вони розмовляють, а вдень дивляться.", mobs:[["stone_baba",2,10],["steppe_bandit",2,10],["steppe_wolf",2,10]], res:{mine:5}, boss:["stone_baba",11]},
  wd_yar:{desc:"Глибокий яр, де кентаври пасуть табуни. Вони не люблять, коли заходять без запрошення.", mobs:[["centaur",3,11],["tarpan",2,10],["steppe_bandit",2,10]], res:{herb:4}, boss:["centaur",12]},
  wd_witch:{desc:"Балка, де цвіте полин і стоїть напівзруйнована хата. Тут живуть ті, кого степ вирішив прийняти.", mobs:[["steppe_witch",3,11],["babai",2,11],["steppe_wolf",2,10]], res:{herb:5}, boss:["steppe_witch",12]},
  wd_levada:{desc:"Левада, що колись була пасовищем. Тепер там випалена земля й скелети коней.", mobs:[["steppe_bandit",3,11],["centaur",2,11],["stone_baba",2,11]], res:{mine:4}, boss:["centaur",12]},
  wd_gora:{desc:"Гора, що диміє. Старі кажуть, що змій там спить, а не живе, і прокидається, щойно хтось зайде в його печеру.", mobs:[["stone_baba",2,11],["centaur",2,11],["babai",1,11]], res:{mine:5}, boss:["gorynych",12]},
  // --- Затоплене узбережжя ---
  cs_harbor:{desc:"Гавань під скелею. Кораблі стоять без вітрил, бо в морі нічого не варто ловити, крім біди.", npcs:[["sydir",330,220],["timish",590,260]],
    buildings:[["Контора гавані","npc:sydir"],["Корабельня Тиміша","npc:timish"],["Корчма «Якір»","heal:Ви відпочили в «Якорі». Сили повністю відновилися."]]},
  cs_light:{desc:"Розбитий маяк на мисі. Вогонь на ньому не горить, але ночами хтось махає ліхтарем.", mobs:[["coast_drowned",3,10],["giant_crab",1,10],["ghost_pirate",2,10]], res:{fish:3}, boss:["ghost_pirate",11]},
  cs_shoal:{desc:"Мілини, де відлив лишає на піску утоплених. Вони лежать, поки не піде приплив.", mobs:[["coast_drowned",4,10],["sea_serpent",1,10],["giant_crab",2,10]], res:{fish:5}, boss:["sea_serpent",11]},
  cs_mermaid:{desc:"Тиха заводь. Вода такого кольору, що очі самі тягнуться до неї. Русалки співають звідусіль.", mobs:[["mermaid",3,10],["siren",1,10],["coast_drowned",2,10]], res:{fish:5}, boss:["mermaid",11]},
  cs_siren:{desc:"Скеля, до якої не пристають кораблі. Всі, хто пристав, лишилися там навічно.", mobs:[["siren",3,11],["mermaid",2,11],["sea_serpent",1,11]], res:{fish:4}, boss:["siren",12]},
  cs_crab:{desc:"Мілини, де краби завбільшки з віз. Вони копають у піску ходи й виглядають звідти.", mobs:[["giant_crab",4,11],["sea_serpent",2,11],["kraken_tentacle",1,11]], res:{fish:5}, boss:["giant_crab",12]},
  cs_ships:{desc:"Цвинтар кораблів. Щогли стирчать із води, як ребра, а привиди ходять по палубах, як ходили сто років тому.", mobs:[["ghost_pirate",4,11],["coast_drowned",2,11],["kraken_tentacle",1,11]], res:{fish:5}, boss:["ghost_pirate",12]},
  cs_fleet:{desc:"Затоплена флотилія. Кораблі стоять рівним строєм на дні, і між ними ходить адмірал.", mobs:[["ghost_pirate",3,11],["coast_drowned",2,11]], res:{fish:5}, boss:["flotilla_captain",12]},
  cs_kraken:{desc:"Лігво Кракена. Вода тут чорна, і чорнила в ній більше, ніж води.", mobs:[["kraken_tentacle",4,11],["sea_serpent",2,11]], res:{fish:5}, boss:["kraken",12]},
  // --- Піски Забутих Царів ---
  sd_oasis:{desc:"Оаза з єдиним колодязем. Каравани тут зупиняються перед пісками й після них, якщо повертаються.", npcs:[["yusuf",330,220],["zara",590,260]],
    buildings:[["Намет караван-баші","npc:yusuf"],["Колодязь Зари","npc:zara"],["Тінь пальм","heal:Ви відпочили під пальмами. Сили повністю відновилися."]]},
  sd_dig:{desc:"Табір розкопників. Під наметами лежать черепки, а в ямах стоять мумії, які ще не знають, що вони мумії.", npcs:[["leontiy",450,230]],
    buildings:[["Намет Леонтія","npc:leontiy"],["Намет розкопників","heal:Ви виспалися в наметі розкопників. Сили повністю відновилися."]], res:{mine:4}},
  sd_bed:{desc:"Русло ріки, що висохла за царів. Вітер мете по ньому пісок, а в піску щось ворушиться.", mobs:[["dust_devil",3,10],["ghoul",2,10],["scarab_swarm",1,10]], res:{herb:3}, boss:["ghoul",11]},
  sd_scarab:{desc:"Пагорб, де зарито мільйони скарабеїв. Земля там двигтить від чорного шерехоту.", mobs:[["scarab_swarm",4,10],["sand_worm",1,10],["dust_devil",1,10]], res:{mine:4}, boss:["sand_worm",11]},
  sd_temple:{desc:"Храм шакала в піску. Стіни розписані сценами суду, і тільки судді там уже нема.", mobs:[["jackal_priest",3,11],["mummy",2,11],["ghoul",2,11]], res:{mine:4}, boss:["jackal_priest",12]},
  sd_tomb:{desc:"Гробниця, повна мумій. Вони лежать у рядах, і тільки руки в них складені не так, як було.", mobs:[["mummy",3,11],["ghoul",2,11],["scarab_swarm",2,11]], res:{mine:5}, boss:["mummy",12]},
  sd_worm:{desc:"Западина, де пісок осів, як вода. Те, що там живе, пропускає крізь себе все, що вміщається.", mobs:[["sand_worm",3,11],["dust_devil",2,11],["scarab_swarm",1,11]], res:{mine:5}, boss:["sand_worm",12]},
  sd_lamia:{desc:"Печера в скелі над пісками. Вхід прикрашений кістками, а вночі там співають.", mobs:[["lamia",3,11],["djinn",2,11],["ghoul",1,11]], res:{herb:4}, boss:["lamia",12]},
  sd_sphinx:{desc:"Піраміда, біля підніжжя якої лежить сфінкс. Він дивиться на те, що ти ще не зробив.", mobs:[["djinn",2,11],["lamia",1,11],["jackal_priest",2,11]], res:{mine:5}, boss:["sphinx",12]},
  sd_lich:{desc:"Гробниця царя, що вирішив не вмирати. Двері золоті, а стіни кричать.", mobs:[["mummy",3,11],["ghoul",2,11],["jackal_priest",2,11]], res:{mine:5}, boss:["lich_king",12]},
});
for (const id of Object.keys(NODES)) if (LOCS[id]) prepLoc(LOCS[id]);

/* ---------- біоми й сцени ---------- */
Object.assign(BIOME, {
  ice:{ground:["#c9d3db","#dce4ea","#b3bfc9"], grass:"#9fb0bb", veg:{pine:16, rocks:12, grass:12}, snow:true, mood:"dusk"},
  steppe:{ground:["#8e8a52","#9c985e","#7b7746"], grass:"#b8aa62", veg:{grass:95, flowers:14, rocks:6, bush:6}},
  coast:{ground:["#a69b72","#b4a97f","#938860"], grass:"#8c9264", veg:{rocks:14, grass:16, bush:3, reeds:8}},
  desert:{ground:["#c6a964","#d4b873","#b39651"], grass:"#a28f55", veg:{rocks:8, bush:3, grass:8, dead:3}},
});
Object.assign(SCENE, {
  ic_post:{b:"ice", road:true, x:["palisade","tents"]}, ic_camp:{b:"ice", road:true, x:["tents","mammoth_bones"]}, ic_river:{b:"ice", river:true, x:["bones"]},
  ic_mammoth:{b:"ice", x:["mammoth_bones"]}, ic_witch:{b:"ice", x:["witch_hut"]}, ic_burrows:{b:"ice", x:["burrows"]}, ic_mine:{b:"ice", x:["mine"]},
  ic_pass:{b:"ice", x:["peaks"]}, ic_jotun:{b:"ice", x:["ice_cave"]}, ic_king:{b:"ice", x:["burrows","bones"]},
  wd_fort:{b:"steppe", road:true, x:["palisade","watchtower"]}, wd_inn:{b:"steppe", road:true, x:["steppe_inn"]}, wd_balka:{b:"steppe", river:true, x:["horse_bones"]},
  wd_kurgan:{b:"steppe", x:["barrow","stone_babas"]}, wd_baba:{b:"steppe", x:["stone_babas"]}, wd_yar:{b:"steppe", x:["yurts"]}, wd_witch:{b:"steppe", x:["steppe_hut"]},
  wd_levada:{b:"steppe", x:["horse_bones","bones"]}, wd_gora:{b:"dark", x:["fire_mountain"]},
  cs_harbor:{b:"coast", sea:true, road:true, x:["pier","tavern"]}, cs_light:{b:"coast", sea:true, x:["lighthouse"]}, cs_shoal:{b:"coast", sea:true, x:["wreck"]},
  cs_mermaid:{b:"coast", lake:true, x:["reef"]}, cs_siren:{b:"coast", sea:true, x:["reef"]}, cs_crab:{b:"coast", sea:true, x:["crab_holes"]},
  cs_ships:{b:"coast", sea:true, x:["wreck","ship_ribs"]}, cs_fleet:{b:"coast", sea:true, x:["ship_ribs"], mood:"dusk"}, cs_kraken:{b:"dark", sea:true, x:["kraken_pit"]},
  sd_oasis:{b:"desert", road:true, x:["oasis","tents"]}, sd_dig:{b:"desert", road:true, x:["dig_site","tents"]}, sd_bed:{b:"desert", river:true, x:["bones"]},
  sd_scarab:{b:"desert", x:["scarab_mound"]}, sd_temple:{b:"desert", x:["jackal_temple"]}, sd_tomb:{b:"desert", x:["tomb_door"]},
  sd_worm:{b:"desert", x:["worm_pit"]}, sd_lamia:{b:"desert", x:["cave"]}, sd_sphinx:{b:"desert", x:["pyramid","sphinx_statue"]}, sd_lich:{b:"dark", x:["pyramid"], mood:"dusk"},
});
BIG_STRUCT.push("pyramid","jackal_temple","lighthouse","fire_mountain","ice_cave","steppe_inn","pier");

/* ---------- правила країв ---------- */
Object.assign(REG_RULE, {
  ice:() => `<div class="regrule"><b>Крижані Пустки.</b> Гобліни й вовки бояться вогню: смолоскипи й сувої вогню б'ють по них сильніше. Хутряні комплекти мамонтарів захищають від морозу, а дух тримає тепло.</div>`,
  steppe:() => `<div class="regrule"><b>Дике Поле.</b> Кентаври й розбійники нападають на тих, хто без коня. Курганних мерців краще класти булавою, а відьми бояться срібла й полину.</div>`,
  coast:() => `<div class="regrule"><b>Узбережжя.</b> Утоплені й привиди бояться солі й молитви. Морські чудовиська слабші до вогню, а кракена не візьме залізо.</div>`,
  sand:() => `<div class="regrule"><b>Піски.</b> Мумії й ламії боїться вогню, а гулі бояться солі й заліза. Джини чутливі до срібла. Сфінкс загадує, а Цар-Ліч не відчиняє двері.</div>`,
});
Object.assign(REG_PRICE, {ice:{herb:.7, mine:1.3, fish:1.15, misc:1.2}, steppe:{herb:1.2, mine:1.1, fish:.8, misc:.95}, coast:{herb:.9, mine:1.2, fish:.7, misc:1.1}, sand:{herb:1.3, mine:.8, fish:1.4, misc:1.25}});

/* ---------- мешканці ---------- */
Object.assign(NPCS, {
  ratmir:{name:"Ярл Ратмир", letter:"Р", role:"ярл Крижаної застави", quests:["ic_q1","ic_q2","ic_q3","ic_q4","ic_q5","ic_q6"], hello:"За цим перевалом нема ні короля, ні закону. Є вовки, велетні й гобліни. Я тримаю заставу, бо більше нікому."},
  brane:{name:"Коваль Бране", letter:"Б", role:"коваль Крижаної застави", quests:["ic_b1","ic_b2"], shop:"brane", hello:"Метал тут холодний, а руки гарячі. Бивень мамонта ріжеться кращою за сталь, якщо знати, як його гріти."},
  borko:{name:"Мамонтар Борко", letter:"Б", role:"ватажок мамонтарів і торговець", quests:["ic_m1","ic_m2","ic_m3"], shop:"borko", heal:true, hello:"Мамонт, якщо не лякати, мирна тварина. Але гобліни лякають, а відьма проклинає, тож нам доводиться воювати."},
  pylyp:{name:"Отаман Пилип", letter:"П", role:"отаман Козацької застави", quests:["wd_q1","wd_q2","wd_q3","wd_q4","wd_q5","wd_q6"], hello:"Степ без козака, як хата без хазяїна. Я стою тут, поки є кому стояти. Допоможеш?"},
  luka:{name:"Зброяр Лука", letter:"Л", role:"зброяр Козацької застави", quests:["wd_l1","wd_l2"], shop:"luka", hello:"Шабля для козака, як перо для писаря. Без неї ні жити, ні помирати."},
  darka:{name:"Шинкарка Дарка", letter:"Д", role:"шинкарка шинку «Три Могили»", quests:["wd_d1","wd_d2","wd_d3"], shop:"darka", heal:true, hello:"Я бачила тут усіх: розбійників, козаків, кентаврів. Усі п'ють однаково. Сідай, а то холодне стане."},
  sydir:{name:"Начальник гавані Сидір", letter:"С", role:"начальник Рибальської гавані", quests:["cs_q1","cs_q2","cs_q3","cs_q4","cs_q5","cs_q6"], hello:"Колись ми виходили в море, а тепер тільки дивимося. Море дало нам риби, а потім забрало флот. Допоможеш повернути?"},
  timish:{name:"Корабел Тиміш", letter:"Т", role:"корабел і зброяр гавані", quests:["cs_t1","cs_t2"], shop:"timish", heal:true, hello:"Корабель з акулячої шкіри не тоне. А ось із людської, кажуть, тоне. Бери що треба й не питай."},
  yusuf:{name:"Караван-баші Юсуф", letter:"Ю", role:"старшина караванів", quests:["sd_q1","sd_q2","sd_q3","sd_q4","sd_q5","sd_q6"], hello:"Піски пам'ятають більше, ніж ми. Вони пам'ятають царів, яких вже ніхто не пам'ятає. Іди обережно."},
  zara:{name:"Водоносиця Зара", letter:"З", role:"водоносиця оази", quests:["sd_z1","sd_z2"], shop:"zara", heal:true, hello:"Вода тут дорожча за золото. Зате золота в пісках стільки, що можна купатися."},
  leontiy:{name:"Археолог Леонтій", letter:"Л", role:"археолог табору розкопників", quests:["sd_l1","sd_l2","sd_l3"], shop:"leontiy", hello:"Кожен черепок тут розповідає свою історію. На жаль, більшість із них закінчується прокляттям."},
});
NPCS.bogdan.quests.push("mk_ice","mk_steppe"); NPCS.yavdokha.quests.push("bg_coast"); NPCS.oleksa.quests.push("or_sands");

/* ---------- квести ---------- */
Object.assign(QUESTS, {
  // мости зі старих земель
  mk_ice:{name:"За Мури Марки", giver:"bogdan", req:"mk_q7", minLvl:10, text:"Кістковий Король скинутий, але за Мурами Старої Марки є ще одна земля: сніг, вовки й гобліни. Ярл Ратмир кличе всіх, хто вміє тримати зброю.", goal:{visit:"ic_post", n:1}, reward:{cop:900, xp:200, items:{potion_xl:3}}},
  mk_steppe:{name:"Степові козаки", giver:"bogdan", req:"mk_q7", minLvl:10, text:"На схід від Цитаделі починається Дике Поле. Козаки там воюють з кентаврами й розбійниками, а їм потрібні ще мечі.", goal:{visit:"wd_fort", n:1}, reward:{cop:900, xp:200, items:{potion_xl:3}}},
  bg_coast:{name:"Берег за Абатством", giver:"yavdokha", req:"bg_q6", minLvl:10, text:"За Затопленим Абатством починається море. Там у гавані живуть люди, які колись вміли ловити рибу. Дійди до них, поговори.", goal:{visit:"cs_harbor", n:1}, reward:{cop:900, xp:200, items:{potion_xl:3}}},
  or_sands:{name:"Піски Царів", giver:"oleksa", minLvl:10, text:"На південь від Собору лежать Піски Забутих Царів. Там зупиняються каравани, а в піску лежать гробниці. Дійди до оази й поговори з караван-баші.", goal:{visit:"sd_oasis", n:1}, reward:{cop:900, xp:200, items:{potion_xl:3}}},
  // Крижані Пустки: ярл Ратмир
  ic_q1:{name:"Вовки Скутої Ріки", giver:"ratmir", text:"Вовки перейшли ріку по льоду й різали наших мамонтарів. Розбий вісьмох, поки не повернулися.", goal:{kill:"ice_wolf", n:8}, reward:{cop:1900, xp:480, choice:[{item:"wolf_cloak"},{item:"bear_gloves"},{item:"potion_xe", n:3}]}},
  ic_q2:{name:"Мамонти під ножем", giver:"ratmir", req:"ic_q1", text:"Мамонти збожеволіли від страху й топчуть табір. Заспокой п'ятьох, як зможеш.", goal:{kill:"mammoth", n:5}, reward:{cop:2200, xp:520, choice:[{item:"mammoth_helm"},{item:"ice_boots"},{item:"gem_ruby2", n:2}]}},
  ic_q3:{name:"Хутір без диму", giver:"ratmir", req:"ic_q2", text:"На хуторі за пасовиськом живе снігова відьма. Це вона навела мороз. Знищ чотирьох відьом, поки зима не стала вічною.", goal:{kill:"snow_witch", n:4}, reward:{cop:2500, xp:560, choice:[{item:"frost_halberd"},{item:"mammoth_plate"},{item:"gem_topaz3", n:2}]}},
  ic_q4:{name:"Нори гоблінів", giver:"ratmir", req:"ic_q3", text:"Гобліни копали під самою заставою. Знищ десять копачів, поки вони не провалили нам підлогу.", goal:{kill:"gob_digger", n:10}, reward:{cop:2800, xp:600, item:"ice_axe"}},
  ic_q5:{name:"Серце Пустки", giver:"ratmir", req:"ic_q4", text:"Йотун прокинувся, і весь край здригається. Підніми його з печери й поклади навіки, поки не розбудив решту велетнів.", goal:{kill:"jotun", n:1}, reward:{cop:3600, xp:800, perk:{str:3, hp:30}}, perkText:"+3 сили і +30 здоров'я назавжди"},
  ic_q6:{name:"Король нір", giver:"ratmir", req:"ic_q5", text:"Король нір сидить на золоті й посилає гоблінів у наші зруби. Спустися в його нору й поклади його на золото.", goal:{kill:"gob_king", n:1}, reward:{cop:4500, xp:1000, perk:{hp:60, dmg:5}}, perkText:"+60 здоров'я і +5% урону назавжди"},
  // коваль Бране
  ic_b1:{name:"Бивні для кузні", giver:"brane", text:"Бивень мамонта кується краще за сталь. Принеси чотири, і я зроблю з них щось путнє.", goal:{item:"mammoth_tusk", n:4}, reward:{cop:2000, xp:450, choice:[{item:"mammoth_helm"},{item:"wolf_cloak"},{item:"potion_xe", n:3}]}},
  ic_b2:{name:"Серце велетня", giver:"brane", req:"ic_b1", text:"Паморозні велетні мають серце з льоду, що не тане навіть у горні. Принеси мені одне, і я скую з нього молот.", goal:{item:"jotun_heart", n:1}, reward:{cop:3500, xp:700, item:"jotun_hammer"}},
  // Борко
  ic_m1:{name:"Шкури на продаж", giver:"borko", text:"Білі шкури вовків продаються по всій Марці. Принеси мені десять, і поділимося.", goal:{item:"frost_pelt", n:10}, reward:{cop:2200, xp:480, choice:[{item:"bear_gloves"},{item:"ice_boots"},{item:"potion_xe", n:4}]}},
  ic_m2:{name:"Гоблінське золото", giver:"borko", req:"ic_m1", text:"Гобліни крадуть наше золото, а золото це їхнє. Принеси мені п'ятнадцять самородків, і ми запишемо це в борг.", goal:{item:"gob_nugget", n:15}, reward:{cop:2800, xp:560, perk:{disc:5}}, perkText:"знижка 5% в усіх крамницях"},
  ic_m3:{name:"Вивірн над перевалом", giver:"borko", req:"ic_m2", text:"Над перевалом літає вивірн, і жоден караван не проходить. Збий трьох.", goal:{kill:"ice_drake", n:3}, reward:{cop:3200, xp:650, choice:[{item:"gem_ruby2", n:3},{item:"potion_xe", n:5}]}},
  // Дике Поле: отаман Пилип
  wd_q1:{name:"Тарпани в балці", giver:"pylyp", text:"Дикі тарпани топчуть наші посіви. Заспокой шістьох, але не вбивай усіх: коні гарні.", goal:{kill:"tarpan", n:6}, reward:{cop:1900, xp:480, choice:[{item:"steppe_boots"},{item:"burka"},{item:"potion_xe", n:3}]}},
  wd_q2:{name:"Розбійники з Яру", giver:"pylyp", req:"wd_q1", text:"Розбійники нападають на кожного, хто ходить без коня. Знищ вісьмох, і ми знову зможемо ходити пішки.", goal:{kill:"steppe_bandit", n:8}, reward:{cop:2200, xp:520, choice:[{item:"kozak_helm"},{item:"kozak_belt"},{item:"gem_ruby2", n:2}]}},
  wd_q3:{name:"Баби прокинулися", giver:"pylyp", req:"wd_q2", text:"Кам'яні баби на стоянці зійшли з постаментів і б'ють усіх. Розбий чотирьох, бо інакше вони дійдуть до застави.", goal:{kill:"stone_baba", n:4}, reward:{cop:2500, xp:560, choice:[{item:"baba_mace"},{item:"steppe_mail"},{item:"gem_topaz3", n:2}]}},
  wd_q4:{name:"Кентаври", giver:"pylyp", req:"wd_q3", text:"Кентаври з Яру обстрілюють наші дозори. Знищ п'ятьох, і дозори зможуть дихати.", goal:{kill:"centaur", n:5}, reward:{cop:2800, xp:600, item:"steppe_saber"}},
  wd_q5:{name:"Відьмина Балка", giver:"pylyp", req:"wd_q4", text:"Степові відьми варять зілля з людських снів. Розбий чотирьох, поки в степу ще лишилися живі.", goal:{kill:"steppe_witch", n:4}, reward:{cop:3600, xp:800, perk:{wil:3, hp:30}}, perkText:"+3 волі і +30 здоров'я назавжди"},
  wd_q6:{name:"Змій Горинич", giver:"pylyp", req:"wd_q5", text:"Горинич прокинувся й палить степ з гори. Піднімись і поклади його, поки не згорів весь край.", goal:{kill:"gorynych", n:1}, reward:{cop:4500, xp:1000, perk:{hp:60, crit:4}}, perkText:"+60 здоров'я і +4% криту назавжди"},
  // зброяр Лука
  wd_l1:{name:"Золото курганів", giver:"luka", text:"У курганах лежить золото, а я з нього кую. Принеси шість шматків, і я скую тобі щось путнє.", goal:{item:"kurgan_gold", n:6}, reward:{cop:2300, xp:500, choice:[{item:"kozak_helm"},{item:"steppe_boots"},{item:"potion_xe", n:3}]}},
  wd_l2:{name:"Уламки баби", giver:"luka", req:"wd_l1", text:"З Кам'яної баби виходить добра зброя. Принеси вісім уламків, і я зроблю булаву.", goal:{item:"baba_chip", n:8}, reward:{cop:2900, xp:600, item:"baba_mace"}},
  // Дарка
  wd_d1:{name:"Полин для відьми", giver:"darka", text:"Мені потрібен полин для настоянки. Принеси десять пучків із Відьминої Балки, але не питай, для чого.", goal:{item:"witch_wort", n:10}, reward:{cop:2200, xp:480, choice:[{item:"burka"},{item:"potion_xe", n:4}]}},
  wd_d2:{name:"Тамги на столі", giver:"darka", req:"wd_d1", text:"Розбійники лишають тамги за пиво. Принеси двадцять, і ми дізнаємося, скільки їх.", goal:{item:"bandit_tamga", n:20}, reward:{cop:2600, xp:540, perk:{disc:5}}, perkText:"знижка 5% в усіх крамницях"},
  wd_d3:{name:"Мертві в кургані", giver:"darka", req:"wd_d2", text:"Мертві з Кургану Предків ходять до мого шинку. Не люблю, коли в мене п'ють без грошей. Розбий шістьох.", goal:{kill:"kurgan_dead", n:6}, reward:{cop:3200, xp:650, choice:[{item:"gem_ruby2", n:3},{item:"potion_xe", n:5}]}},
  // Затоплене узбережжя: Сидір
  cs_q1:{name:"Потопельники на мілині", giver:"sydir", text:"Відлив лишив на мілині утоплених, і вони повзуть до гавані. Розбий вісьмох.", goal:{kill:"coast_drowned", n:8}, reward:{cop:1900, xp:480, choice:[{item:"sea_boots"},{item:"sea_cloak"},{item:"potion_xe", n:3}]}},
  cs_q2:{name:"Краб'ячі мілини", giver:"sydir", req:"cs_q1", text:"Велетенські краби перекушують наші сітки. Розбий п'ятьох.", goal:{kill:"giant_crab", n:5}, reward:{cop:2200, xp:520, choice:[{item:"captain_hat"},{item:"pearl_amulet"},{item:"gem_ruby2", n:2}]}},
  cs_q3:{name:"Пісня сирен", giver:"sydir", req:"cs_q2", text:"Сирени зі скелі заманюють наші човни. Знищ чотирьох, поки рибалки не повтікали.", goal:{kill:"siren", n:4}, reward:{cop:2500, xp:560, choice:[{item:"scale_armor"},{item:"boarding_cutlass"},{item:"gem_topaz3", n:2}]}},
  cs_q4:{name:"Привиди флоту", giver:"sydir", req:"cs_q3", text:"На Цвинтарі кораблів ходять пірати. Знищ шістьох, поки вони не знайшли дорогу в гавань.", goal:{kill:"ghost_pirate", n:6}, reward:{cop:2800, xp:600, item:"whaler_harpoon"}},
  cs_q5:{name:"Адмірал дна", giver:"sydir", req:"cs_q4", text:"Адмірал Затопленої флотилії досі командує своїми матросами. Знайди його й накажи їм відпочити.", goal:{kill:"flotilla_captain", n:1}, reward:{cop:3600, xp:800, perk:{wil:3, hp:30}}, perkText:"+3 волі і +30 здоров'я назавжди"},
  cs_q6:{name:"Кракен", giver:"sydir", req:"cs_q5", text:"Кракен у Лігві топить усе, що вийде в море. Поклади його, і ми знову зможемо ловити рибу.", goal:{kill:"kraken", n:1}, reward:{cop:4500, xp:1000, perk:{hp:60, dmg:5}}, perkText:"+60 здоров'я і +5% урону назавжди"},
  // Тиміш
  cs_t1:{name:"Перлини для намиста", giver:"timish", text:"Із морської перлини виходить добре намисто. Принеси чотири, і я зроблю тобі щось на згадку.", goal:{item:"sea_pearl", n:4}, reward:{cop:2300, xp:500, choice:[{item:"pearl_amulet"},{item:"sea_boots"},{item:"potion_xe", n:3}]}},
  cs_t2:{name:"Луска для панцира", giver:"timish", req:"cs_t1", text:"З морської луски виходить панцир, якому не страшні ні клинок, ні волога. Принеси вісім шматків.", goal:{item:"sea_scale", n:8}, reward:{cop:2900, xp:600, item:"scale_armor"}},
  // Піски: Юсуф
  sd_q1:{name:"Вихори в руслі", giver:"yusuf", text:"Піщані вихори зривають намети. Розбий шістьох, поки вони не добралися до оази.", goal:{kill:"dust_devil", n:6}, reward:{cop:1900, xp:480, choice:[{item:"sand_sandals"},{item:"burnus"},{item:"potion_xe", n:3}]}},
  sd_q2:{name:"Скарабеї", giver:"yusuf", req:"sd_q1", text:"Скарабеї з Гнізда об'їдають наші запаси. Знищ шістьох роїв.", goal:{kill:"scarab_swarm", n:6}, reward:{cop:2200, xp:520, choice:[{item:"gold_mask"},{item:"scarab_ring"},{item:"gem_ruby2", n:2}]}},
  sd_q3:{name:"Мумії в гробниці", giver:"yusuf", req:"sd_q2", text:"Мумії встали зі своїх нош і ходять по гробниці. Знищ п'ятьох.", goal:{kill:"mummy", n:5}, reward:{cop:2500, xp:560, choice:[{item:"linen_wrap"},{item:"scarab_staff"},{item:"gem_topaz3", n:2}]}},
  sd_q4:{name:"Жреці шакала", giver:"yusuf", req:"sd_q3", text:"Жреці Храму шакала будять мерців. Знищ чотирьох, поки не збудили всіх.", goal:{kill:"jackal_priest", n:4}, reward:{cop:2800, xp:600, item:"khopesh"}},
  sd_q5:{name:"Загадка Сфінкса", giver:"yusuf", req:"sd_q4", text:"Сфінкс біля піраміди загадує загадки і вбиває тих, хто не відгадав. Відгадай, а якщо ні, то поклади.", goal:{kill:"sphinx", n:1}, reward:{cop:3600, xp:800, perk:{wil:3, hp:30}}, perkText:"+3 волі і +30 здоров'я назавжди"},
  sd_q6:{name:"Цар-Ліч", giver:"yusuf", req:"sd_q5", text:"Цар-Ліч сидить у золотій гробниці й чекає. Спустися до нього й відмов його від вічності.", goal:{kill:"lich_king", n:1}, reward:{cop:4500, xp:1000, perk:{hp:60, dmg:5}}, perkText:"+60 здоров'я і +5% урону назавжди"},
  // Зара
  sd_z1:{name:"Попіл для лікування", giver:"zara", text:"З попелу джина варять ліки від сонячної лихоманки. Принеси чотири жмені.", goal:{item:"djinn_ash", n:4}, reward:{cop:2300, xp:500, choice:[{item:"burnus"},{item:"potion_xe", n:4}]}},
  sd_z2:{name:"Скло з пустелі", giver:"zara", req:"sd_z1", text:"Пустельне скло продають купцям по всьому світу. Принеси вісім шматків.", goal:{item:"desert_glass", n:8}, reward:{cop:2900, xp:600, perk:{disc:5}}, perkText:"знижка 5% в усіх крамницях"},
  // Леонтій
  sd_l1:{name:"Полотно мумій", giver:"leontiy", text:"Бальзамувальне полотно допомагає датувати знахідки. Принеси десять шматків.", goal:{item:"mummy_linen", n:10}, reward:{cop:2300, xp:500, choice:[{item:"gold_mask"},{item:"sand_sandals"},{item:"potion_xe", n:3}]}},
  sd_l2:{name:"Бурштинові скарабеї", giver:"leontiy", req:"sd_l1", text:"Бурштинові скарабеї дорожчі за золото. Принеси шість.", goal:{item:"scarab_amber", n:6}, reward:{cop:2800, xp:580, item:"scarab_ring"}},
  sd_l3:{name:"Ідоли шакала", giver:"leontiy", req:"sd_l2", text:"Ідоли шакала дають мені підстави вважати, що храм старший, ніж думали. Принеси чотири.", goal:{item:"jackal_idol", n:4}, reward:{cop:3300, xp:680, choice:[{item:"ankh_amulet"},{item:"scarab_staff"},{item:"gem_ruby2", n:3}]}},
});

ACH.push(
  {id:"nw2", icon:"treasure-map", name:"Чотири сторони", text:"Побувати в Крижаних Пустках, Дикому Полі, на Узбережжі й у Пісках", val:() => ["ice","steppe","coast","sand"].filter(r => Object.keys(S.visited).some(k => NODES[k] && NODES[k].r === r)).length, n:4, rew:{cop:6000}},
  {id:"nw3", icon:"crowned-skull", name:"Володарі країв", text:"Здолати Йотуна, Горинича, Кракена і Сфінкса", val:() => ["ic_q5","wd_q6","cs_q6","sd_q5"].filter(q => S.quests[q] && S.quests[q].st === "done").length, n:4, rew:{hp:30, dmg:2}},
);
