/* ============ моби: профілі (стати рахуються від рівня) ============ */
// p: множники hp/dmg/def/agi/xp/cop відносно «звичайного» моба свого рівня
const D = (shape, col, col2, eye, feat, extra) => Object.assign({shape, col, col2, eye, feat:feat || []}, extra || {});
const MOBS = {
  // --- Попелясті землі ---
  rat:{name:"Щур-переросток", lore:"Щури з покинутої кузні, що наїлися попелу й вугілля.", p:{hp:.8, dmg:.7}, drop:[["rat_tail",.7]], design:D("beast","#6a5a50","#3a2e26","#ff5a3a",["tail","fangs"],{size:.75})},
  golem:{name:"Іржавий голем", arch:"bruiser", lore:"Кузнечний вартовий, який досі стереже давно згаслий горн.", p:{hp:1.2, def:1.5, agi:-2}, drop:[["scrap",.8]], design:D("humanoid","#7a6450","#4a3a2a","#ffb84f",["mask"],{size:1.15})},
  wolf:{name:"Попелястий вовк", arch:"chaser", lore:"Сірий, як попіл. Ходить зграєю і ніколи не нападає сам.", p:{agi:2}, drop:[["fang",.75],["wolf_skin",.45]], design:D("beast","#7a746c","#4a4540","#ff9a3a",["claws","tail","fangs"])},
  frog:{name:"Болотяна жаба", passive:true, lore:"Жаба завбільшки з собаку. Перегризає канати й чоботи.", p:{hp:1.1, dmg:.85}, drop:[["slime",.7]], design:D("blob","#5a7a3a","#2f4a22","#ffe24f",["fin"])},
  marauder:{name:"Мародер", arch:"thief", aggro:true, lore:"Грабує мандрівників на броді. Вихопить гаманець і дремене.", p:{cop:2.5}, drop:[["potion_s",.3]], design:D("humanoid","#7a5a40","#3a2a1a","#ffd0a0",["cape"],{prop:"sword"})},
  skel:{name:"Скелет-лучник", arch:"kiter", lore:"Колишній стрілець варти. Тримає віддаль і стріляє.", p:{}, drop:[["bone",.6]], design:D("humanoid","#e8e0cc","#9a8f72","#9fe0ff",["skull"],{prop:"sword"})},
  warden:{name:"Кістяний вартовий", arch:"shielded", boss:true, lore:"Капітан варти, що не покинув пост і по смерті. За щитом його не взяти в лоб.", p:{}, drop:[["warden_amulet",1]], design:D("humanoid","#d8d0bc","#6a6252","#7fd0ff",["skull","shield"],{prop:"sword", size:1.35})},
  wolf2:{name:"Чорний вовк", arch:"chaser", lore:"Вовки Вовчого Яру. Чорніші й лютіші за попелястих.", p:{agi:2, dmg:1.05}, drop:[["fang",.75],["wolf_skin",.5]], design:D("beast","#3a3530","#1f1b18","#ff5a2a",["claws","tail","fangs"])},
  alpha:{name:"Ватажок зграї", arch:"bruiser", boss:true, pack:true, lore:"Здоровенний вовк з рогами на лобі. Зграя йде за ним на смерть.", p:{}, drop:[["alpha_pelt",1]], design:D("beast","#2e2a28","#14110f","#ff3a1a",["claws","tail","fangs","horns"],{size:1.35})},
  whisper:{name:"Болотяний шептун", arch:"wisp", aggro:true, lore:"Шепоче твоє ім'я з туману, а коли підійдеш, обпікає холодом.", p:{hp:.9}, drop:[["wisp_dust",.6]], design:D("wisp","#a8d4b0","#6fbf8a","#1a2a22",["glow","hair"])},
  cultist:{name:"Культист Каплиці", arch:"caster", aggro:true, lore:"Служить Тіні. Його закляття проходять крізь будь-яку броню.", p:{}, drop:[["dark_shard",.5],["potion_l",.2]], design:D("humanoid","#3a2a3a","#1a1020","#ff4a4a",["cape","mask"],{prop:"staff"})},
  shade:{name:"Тінь Каплиці", arch:"summoner", boss:true, summon:"cultist", lore:"Те, що прокинулося під Каплицею. Кличе своїх слуг собі на поміч.", p:{}, drop:[["shade_blade",1]], design:D("wisp","#4a3a5a","#1a1024","#ff3a6a",["glow","hair"],{size:1.6})},
  // --- Землі Кабаллону ---
  forest_wolf:{name:"Лісовий вовк", arch:"chaser", lore:"Сіро-бурі вовки з перелісків довкола Кабаллону.", p:{hp:.9}, drop:[["fang",.6],["wolf_skin",.35]], design:D("beast","#6e5c48","#3e3226","#ffb04a",["claws","tail","fangs"])},
  boar:{name:"Дикий кабан", arch:"bruiser", lore:"Ікла як ножі. Б'є з розгону.", p:{hp:1.15}, drop:[["boar_tusk",.6]], design:D("beast","#5a4434","#2e2218","#ff7a3a",["horns","fangs"],{size:1.05})},
  tiger:{name:"Лютий тигр", arch:"chaser", lore:"Здоровенна звірюка. Полює не ради їжі, а спеціально чатує на мандрівників.", p:{dmg:1.15, agi:3}, drop:[["tiger_claw",.55]], design:D("beast","#c8762a","#2a1a10","#fff06a",["claws","tail","fangs"],{size:1.15})},
  thief:{name:"Злодій", arch:"thief", aggro:true, lore:"Ховається за млином і чатує на гаманці.", p:{cop:2}, drop:[["potion_s",.25]], design:D("humanoid","#5a5040","#2a2418","#ffd86f",["cape","mask"])},
  spark:{name:"Іскрянка", arch:"wisp", lore:"Вогник з броду. Коли б'є, пече, мов кропива.", p:{hp:.8}, drop:[["spark_dust",.6]], design:D("wisp","#ffd86f","#ff9a3a","#4a2a10",["glow"])},
  zombie:{name:"Сильний зомбі", arch:"bruiser", lore:"Мрець, що встав із річки на захопленій переправі.", p:{hp:1.25, agi:-2}, drop:[["rotten_cloth",.6]], design:D("humanoid","#6a8a5a","#3a4a2a","#e0ff8a",["claws"])},
  drowned:{name:"Утопленик", arch:"kiter", lore:"Стоїть по пояс у воді й жбурляє мул.", p:{}, drop:[["rotten_cloth",.5]], design:D("humanoid","#5a7a8a","#2a3a4a","#bfefff",["hair"])},
  scorpion:{name:"Піщаний скорпіон", arch:"chaser", lore:"Ховається в піску й жалить у п'яту.", p:{hp:.9, dmg:1.05}, drop:[["sting",.6]], design:D("spider","#a8562a","#5a2a14","#ffcf6a",[],{size:.95})},
  jal_king:{name:"Король Джалів", arch:"bruiser", boss:true, lore:"Велетенський скорпіон, володар Піщаної коси.", p:{}, drop:[["sting",1],["raw2",.5]], design:D("spider","#7a2a1a","#3a1408","#ffe04a",[],{size:1.6})},
  soldier:{name:"Солдат Ордену", arch:"shielded", lore:"Важкий піхотинець Ордену. За щитом тримає удар.", p:{def:1.4}, drop:[["order_badge",.5]], design:D("humanoid","#6a7a9a","#2e3a5a","#cfe0ff",["shield"],{prop:"sword"})},
  order_mage:{name:"Маг Ордену", arch:"caster", aggro:true, lore:"Бойовий маг Ордену. Палить крізь броню.", p:{hp:.85}, drop:[["order_badge",.4],["potion_e",.2]], design:D("humanoid","#5a3a7a","#2a1a3a","#cf9fff",["cape"],{prop:"staff"})},
  rabble_mage:{name:"Маг Набродів", arch:"caster", lore:"Недоучка з Академії, що пристав до набродів.", p:{hp:.85}, drop:[["dark_shard",.3]], design:D("humanoid","#7a3a5a","#3a1a2a","#ffcf9f",["cape"],{prop:"staff"})},
  rabble_hunter:{name:"Ловчий Набродів", arch:"kiter", lore:"Стріляє з-за дерев і відходить.", p:{}, drop:[["wolf_skin",.3]], design:D("humanoid","#4a6a3a","#2a3a1a","#ffe08a",["cape"])},
  villain:{name:"Лиходій", arch:"thief", aggro:true, lore:"Ватажок набродів. Краде, б'є, тікає.", p:{hp:1.2, cop:2.5}, drop:[["potion_l",.3]], design:D("humanoid","#3a2a2a","#1a1010","#ff6a4a",["cape","mask"],{prop:"sword"})},
  ghost_mage:{name:"Привид магістра", arch:"caster", lore:"Тінь викладача Академії, що досі читає закляття.", p:{hp:.9}, drop:[["ghost_dust",.6]], design:D("wisp","#9fc8ff","#5a7fbf","#1a2a4a",["glow","hair"])},
  gargoyle:{name:"Кам'яна горгулья", arch:"flyer", lore:"Ожила зі стін Академії. Висмоктує сили.", p:{def:1.5}, drop:[["stone_heart",.4]], design:D("bird","#7a7a80","#3a3a40","#ff9a3a",["wings","horns"],{size:1.1})},
  hunter_spider:{name:"Павук-мисливець", arch:"ceiling", lore:"Велетенський павук, що чатує в кронах Згубної хащі.", p:{hp:1.3, dmg:1.1}, drop:[["web",.7],["raw1",.1]], design:D("spider","#3a2a1a","#1a1008","#ff4a2a",[],{size:1.35})},
  troll:{name:"Хащовий троль", arch:"bruiser", lore:"Гора м'язів, моху й злості.", p:{hp:1.5, agi:-3}, drop:[["troll_hide",.5]], design:D("beast","#4a5a3a","#2a3420","#ffcf3a",["claws","horns"],{size:1.35})},
  merman:{name:"Мерман", arch:"chaser", lore:"Луската тварюка з бухти. Виходить на берег зграями.", p:{}, drop:[["scale",.6]], design:D("blob","#3a6a8a","#1a3a5a","#bfffff",["fin"])},
  chosen_merman:{name:"Обраний мерман", arch:"caster", lore:"Жрець мерманів у короні з мушель.", p:{hp:1.4}, drop:[["scale",1],["raw2",.2]], design:D("blob","#2a5a7a","#0f2a3a","#dfffff",["fin","crown"],{size:1.3})},
  black_knight:{name:"Чорний лицар", arch:"shielded", lore:"Лицар Цитаделі. Колись присягав світлу.", p:{hp:1.2, def:1.4}, drop:[["order_badge",.5],["order_blade",.03]], design:D("humanoid","#2a2a34","#101018","#ff3a3a",["cape","shield"],{prop:"sword"})},
  // --- боси підземель ---
  crypt_captain:{name:"Капітан Склепів", arch:"shielded", dboss:true, summon:"skel", lore:"Мертвий капітан варти. Кличе своїх стрільців.", p:{}, drop:[["captain_ring",1],["raw2",1]], design:D("humanoid","#d8d0bc","#4a4232","#ff5a3a",["skull","shield","cape"],{prop:"sword", size:1.6})},
  dark_magister:{name:"Чорний Магістр", arch:"caster", dboss:true, summon:"order_mage", lore:"Володар Темної Цитаделі.", p:{}, drop:[["knight_helm",.6],["order_blade",.5],["raw3",1]], design:D("humanoid","#2a1a3a","#0a0510","#bf6fff",["cape","mask","horns"],{prop:"staff", size:1.6})},
  abyss_lord:{name:"Владар Безодні", arch:"summoner", dboss:true, summon:"chort", lore:"Те, що спить під Чорногорою. Арідник серед арідників.", p:{}, drop:[["chorno_bartka",.5],["abyss_plate",.5],["chorno_ring",.4],["raw3",1]], design:D("humanoid","#2a1a2a","#120812","#ff3a3a",["horns","cape"],{prop:"staff", size:1.8})},
};
for (const [id, m] of Object.entries(MOBS)){ m.id = id; m.p = Object.assign({hp:1, dmg:1, def:1, agi:0, xp:1, cop:1}, m.p); }
// демони: профіль з бази бестіарію
for (const d of BESTIARY){
  d.p = {hp:clamp(d.base.hp / 45, .4, 1.8), dmg:clamp(d.base.dmg / 13, .6, 1.4), def:["bruiser","shielded"].includes(d.arch) ? 1.4 : 1, agi:Math.round((d.base.spd - 140) / 25), xp:1, cop:1};
  if (d.tier >= 3){ d.p.xp = 1.6; }
}
const isDemon = type => !MOBS[type] && !!bestById(type);
function designOf(type){ if (MOBS[type]) return {id:type, design:MOBS[type].design}; return bestById(type); }
function mobDef(type){ return MOBS[type] || bestById(type); }

// базова «звичайна» потвора рівня L
const BASE = {hp:L => 20 + 18 * L, dmg:L => 6 + 6 * L, def:L => L * 1.4, agi:L => 2 + L * .8, xp:L => 8 + 7 * L, cop:L => [L * 3, L * 8]};
const MOD = {
  elite:{hp:2.0, dmg:1.25, xp:2.5, cop:2, label:"еліта"},
  strong:{hp:1.25, dmg:1.1, xp:1.8, cop:1.5},
  boss:{hp:3.0, dmg:1.25, xp:5, cop:4},
  dboss:{hp:4.5, dmg:1.3, xp:8, cop:6},
};
// tier: зачистки району (1..7) або походи в підземелля
function mobStats(type, lvl, o = {}){
  const d = mobDef(type), p = d.p, arch = d.arch || "";
  const strong = isDemon(type) && d.tier >= 3;
  const tierK = 1 + .12 * ((o.tier || 1) - 1);
  let hp = BASE.hp(lvl) * p.hp * tierK, dmg = BASE.dmg(lvl) * p.dmg * tierK, xp = BASE.xp(lvl) * p.xp, cop = BASE.cop(lvl).map(v => v * p.cop);
  const mods = [];
  if (d.boss || o.distBoss) mods.push(MOD.boss); else if (d.dboss) mods.push(MOD.dboss);
  if (strong && !o.distBoss) mods.push(MOD.strong);
  if (o.elite) mods.push(MOD.elite);
  for (const m of mods){ hp *= m.hp; dmg *= m.dmg; xp *= m.xp; cop = cop.map(v => v * m.cop); }
  xp *= 1 + .1 * ((o.tier || 1) - 1);
  const drop = (d.drop || []).map((x, i) => typeof x === "string" ? [DROPID[x], i === 0 ? .6 : .25] : x).filter(x => x[0]);
  // самоцвіти-сирці: шанс з будь-кого від 4 рівня, з босів більше
  if (lvl >= 4) drop.push([lvl >= 9 ? "raw2" : "raw1", (d.boss || o.distBoss || d.dboss) ? .6 : o.elite ? .2 : .03 + .01 * ((o.tier || 1) - 1)]);
  const nm = (o.distBoss ? "Отаман: " : "") + d.name + (o.elite ? " (еліта)" : "");
  return {type, name:nm, lvl, hp:Math.round(hp), dmg:[Math.round(dmg * .8), Math.round(dmg * 1.2)], def:Math.round(BASE.def(lvl) * p.def), agi:Math.round(BASE.agi(lvl) + p.agi),
    xp:Math.round(xp), cop:cop.map(Math.round), drop, arch, boss:!!(d.boss || o.distBoss || d.dboss), dboss:!!d.dboss, strong, elite:!!o.elite, distBoss:!!o.distBoss,
    pack:!!d.pack || ["chaser","swarmer"].includes(arch), aggro:!!d.aggro || (isDemon(type) && ["chaser","flyer","swarmer","thief"].includes(arch)), passive:!!d.passive,
    speed:isDemon(type) ? d.base.spd / 7 : 6 + (p.agi + 4) * 3, lore:d.lore, wards:d.ward || [], summon:d.summon,
    kind:(ARCHL[arch] || "Звір") + (d.dboss ? " · бос підземелля" : (d.boss || o.distBoss) ? " · бос" : strong ? " · сильний" : ""), size:(d.design.size || 1) * (o.distBoss ? 1.25 : 1)};
}
