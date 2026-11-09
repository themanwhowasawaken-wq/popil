/* ============ вміння: гілка розвитку з 3 рівня, як у Кристалі Вічності ============ */
const BRANCHES = {
  war:{name:"Воїн", stat:"сила", col:"#d0574d", icon:"sword-brandish", row:"перший ряд", text:"Б'є важко й ламає щити. Тримає удар у блоці, а з 8 рівня входить у Лють."},
  hunt:{name:"Стрілець", stat:"спритність", col:"#7fb65f", icon:"crossbow", row:"другий ряд", text:"Влучає в слабкі місця, б'є двічі й ухиляється. З 8 рівня накриває всіх ворогів Дощем стріл."},
  myst:{name:"Жрець", stat:"воля", col:"#8a9ae0", icon:"sun", row:"другий ряд", text:"Сильніші сувої й обереги, менше шкоди від чар і отрути. З 8 рівня Світанок лікує прямо в бою."},
};
const TALENTS = {
  w1:{br:"war", tier:1, max:3, icon:"sword-brandish", name:"Важкий замах", text:"+4% урону за ранг."},
  w2:{br:"war", tier:2, max:3, icon:"flanged-mace", name:"Кістколам", text:"Сильний удар: +10% урону й на 4 енергії дешевший за ранг."},
  w3:{br:"war", tier:3, max:3, icon:"round-shield", name:"Стіна щитів", text:"Блок гасить ще 7% шкоди за ранг."},
  w4:{br:"war", tier:4, max:1, icon:"fist", name:"Лють", act:"rage", text:"Прийом у бою: 3 раунди +35% урону. 30 енергії."},
  h1:{br:"hunt", tier:1, max:3, icon:"crossbow", name:"Влучне око", text:"+2% криту за ранг."},
  h2:{br:"hunt", tier:2, max:3, icon:"daggers", name:"Подвійний удар", text:"6% за ранг вдарити вдруге в тому ж ході."},
  h3:{br:"hunt", tier:3, max:3, icon:"footsteps", name:"Ухилення", text:"+3% до ухилення від ударів за ранг."},
  h4:{br:"hunt", tier:4, max:1, icon:"arrow-cluster", name:"Дощ стріл", act:"volley", text:"Прийом у бою: б'є всіх ворогів на 70% урону. 35 енергії."},
  m1:{br:"myst", tier:1, max:3, icon:"water-drop", name:"Свята вода", text:"Сувої й обереги сильніші на 12% за ранг."},
  m2:{br:"myst", tier:2, max:3, icon:"magic-swirl", name:"Тверда воля", text:"+2 волі за ранг."},
  m3:{br:"myst", tier:3, max:3, icon:"shield-reflect", name:"Відвести чари", text:"Магія й отрута шкодять на 8% менше за ранг."},
  m4:{br:"myst", tier:4, max:1, icon:"sun", name:"Світанок", act:"dawn", text:"Прийом у бою: лікує 35% здоров'я й знімає отруту. 30 енергії, раз на бій."},
};
const BRANCH_LVL = 3;
// на яких рівнях вміння гілки отримує наступний ранг
const TAL_SCHED = {1:[3, 4, 6], 2:[5, 6, 9], 3:[7, 9, 10], 4:[8]};
const tal = k => { const T0 = TALENTS[k]; if (!T0 || !S.branch || T0.br !== S.branch) return 0; return TAL_SCHED[T0.tier].filter(l => S.lvl >= l).length; };
const talNext = k => { const T0 = TALENTS[k]; return TAL_SCHED[T0.tier].find(l => S.lvl < l) || null; };
const branchCost = () => 100 * S.lvl;
function chooseBranch(br){
  if (!BRANCHES[br] || S.lvl < BRANCH_LVL || S.branch === br) return;
  if (S.branch){ const c = branchCost(); if (S.cop < c){ msg(`Змінити гілку коштує ${moneyTxt(c)}.`, "warn"); return; } spend("tal", c); }
  S.branch = br; msg(`Ваша гілка розвитку: ${BRANCHES[br].name}.`, "good"); save(); renderTop();
}
function talentBonus(){ return {dmgp:4 * tal("w1"), crit:2 * tal("h1"), dodge:3 * tal("h3"), wil:2 * tal("m2")}; }
const spellMul = () => (1 + .12 * tal("m1")) * (1 + stats().wil * .03);
const magicCut = () => 1 - Math.min(.45, stats().wil * .012 + .08 * tal("m3"));
const poisonCut = () => 1 - Math.min(.55, stats().wil * .02 + .08 * tal("m3"));

/* ============ економіка ============ */
function earn(cat, c){ if (!c) return; S.cop += c; S.econ.in[cat] = (S.econ.in[cat] || 0) + c; }
function spend(cat, c){ if (!c) return; S.cop -= c; S.econ.out[cat] = (S.econ.out[cat] || 0) + c; }
const ECON_IN = {loot:"Здобич у боях", quest:"Квести", sale:"Продаж", contract:"Контракти", ach:"Досягнення", box:"Шкатулки"};
const ECON_OUT = {shop:"Покупки", heal:"Лікування й відпочинок", sharp:"Заточка", gem:"Ювелір", death:"Втрати при смерті", theft:"Крадіжки", tal:"Зміна гілки"};
const dayNo = () => Math.floor((Date.now() + 2 * 3600e3) / 86400e3);
function seedRnd(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// базові ціни ресурсів у регіонах: де чого багато, там дешевше
const REG_PRICE = {
  kab:{herb:1.0, mine:1.15, fish:.85, misc:1.0},
  ash:{herb:1.1, mine:.85, fish:1.05, misc:1.1},
  zak:{herb:.85, mine:1.25, fish:1.3, misc:.95},
};
const PCAT = {herb:"Трави", mine:"Руда", fish:"Риба", misc:"Трофеї"};
function priceMul(reg, cat){
  const b = (REG_PRICE[reg] || {})[cat] || 1, r = seedRnd(dayNo() * 97 + reg.charCodeAt(0) * 13 + cat.charCodeAt(0) * 7 + cat.length)();
  return Math.round(b * (.85 + r * .35) * 100) / 100;
}
const itemPCat = it => it.res || (it.cat === "misc" ? "misc" : null);
// скільки дає скупник: речі 25%, ресурси й трофеї 50% × ціна регіону, решта 50%
function sellPrice(id, loc){
  const it = ITEMS[id], reg = NODES[loc || S.loc].r, c = itemPCat(it);
  if (it.slot) return Math.max(1, Math.floor(it.price * .25));
  if (c) return Math.max(1, Math.floor(it.price * .5 * priceMul(reg, c)));
  return Math.max(1, Math.floor(it.price / 2));
}
function buyPrice(id){ const it = ITEMS[id], d = (S.perks.disc || 0) / 100; return Math.max(1, Math.round(it.price * (1 - d))); }
function tradeRoute(){
  let best = null;
  for (const cat of Object.keys(PCAT)) for (const a of Object.keys(REG_PRICE)) for (const b of Object.keys(REG_PRICE)) if (a !== b){
    const k = priceMul(b, cat) / priceMul(a, cat); if (!best || k > best.k) best = {cat, from:a, to:b, k};
  }
  return best;
}
function junkValue(){ return Object.keys(S.inv).filter(id => ITEMS[id].cat === "misc" && !questNeedsItem(id)).reduce((a, id) => a + sellPrice(id) * inv(id), 0); }
function sellJunk(){
  const ids = Object.keys(S.inv).filter(id => ITEMS[id].cat === "misc" && !questNeedsItem(id)); if (!ids.length) return;
  let sum = 0, n = 0; for (const id of ids){ const k = inv(id); sum += sellPrice(id) * k; n += k; take(id, k); }
  earn("sale", sum); msg(`Ви продали мотлох (${n} шт.) за ${moneyTxt(sum)}.`, "trade", "trade"); msg(`Продано мотлох: ${moneyTxt(sum)}.`); save(); renderTop();
}

/* ============ заточка ============ */
const SHARP_MAX = 10;
function sharpCost(id){ const it = ITEMS[id], n = sharpOf(id); return Math.max(20, Math.round(it.price * .15 * (n + 1))); }
const sharpChance = id => Math.max(.3, .95 - .07 * sharpOf(id));
function sharpen(slot){
  const id = S.equip[slot]; if (!id) return; const n = sharpOf(id); if (n >= SHARP_MAX) return;
  const c = sharpCost(id); if (S.cop < c){ msg(`Заточка коштує ${moneyTxt(c)}.`, "warn"); return; }
  spend("sharp", c);
  if (Math.random() < sharpChance(id)){ S.sharp[id] = n + 1; msg(`${ITEMS[id].name} заточено до +${n + 1}!`, "good"); }
  else msg(`Заточка не вдалася. ${ITEMS[id].name} лишається +${n}, гроші пішли на вугілля.`, "warn");
  save(); renderTop();
}
const SMITHS = ["ostap", "yurko"];
const smithHere = () => !T && !DG && LOCS[S.loc].npcs.some(([n]) => SMITHS.includes(n));

/* ============ щоденні контракти гільдій ============ */
function genContracts(){
  const r = seedRnd(dayNo() * 31 + S.name.length * 7 + S.lvl), pick2 = a => a[Math.floor(r() * a.length)];
  const L = S.lvl, list = [];
  const mobsNear = [];
  for (const [id, Lc] of Object.entries(LOCS)){ const N = NODES[id]; for (const [t,, lv] of Lc.mobs || []) if (!mobDef(t).boss && !(S.order && mobDef(t).side === S.order) && Math.abs(lv - Math.min(L, MOB_TOP)) <= 2) mobsNear.push([t, id, lv]); }
  if (mobsNear.length){ const [t, at, lv] = pick2(mobsNear), n = 6 + Math.floor(r() * 7);
    list.push({id:"k", kind:"kill", type:t, at, n, prog:0, cop:Math.round((25 + 18 * lv) * n * .6), xp:Math.round((8 + 7 * lv) * n * .5), text:`Здолати: ${mobDef(t).name} ×${n}`, where:NODES[at].name}); }
  const prof = pick2(["herb", "mine", "fish"]), tier = clamp(Math.ceil((S.prof[prof].lv + 1) / 2), 1, 5), rid = {herb:"h", mine:"o", fish:"f"}[prof] + tier, gn = 4 + Math.floor(r() * 5);
  list.push({id:"g", kind:"deliver", item:rid, n:gn, cop:Math.round(ITEMS[rid].price * gn * 1.6), xp:20 * tier * gn / 2, text:`Привезти: ${ITEMS[rid].name} ×${gn}`, where:"будь-яке місто"});
  const troph = Object.entries(ITEMS).filter(([, it]) => it.cat === "misc" && it.price >= 10 && it.price <= 30 + L * 8).map(([k]) => k);
  if (troph.length){ const tid = pick2(troph), tn = 3 + Math.floor(r() * 4);
    list.push({id:"t", kind:"deliver", item:tid, n:tn, cop:Math.round(ITEMS[tid].price * tn * 1.8), xp:Math.round(ITEMS[tid].price * tn * .8), text:`Здати трофеї: ${ITEMS[tid].name} ×${tn}`, where:"будь-яке місто"}); }
  return {day:dayNo(), list};
}
function contracts(){ if (!S.contracts || S.contracts.day !== dayNo()) S.contracts = genContracts(); return S.contracts.list; }
const cReady = c => !c.done && (c.kind === "kill" ? c.prog >= c.n : inv(c.item) >= c.n);
function contractKill(type){ for (const c of contracts()) if (!c.done && c.kind === "kill" && c.type === type && c.prog < c.n){ c.prog++; if (c.prog === c.n) msg(`Контракт виконано: ${c.text}. Здайте в місті.`, "quest"); } }
function contractDone(cid){
  if (!isSafe(S.loc) || T || DG){ msg("Контракти здають у місті.", "warn"); return; }
  const c = contracts().find(x => x.id === cid); if (!c || !cReady(c)) return;
  if (c.kind === "deliver") take(c.item, c.n);
  c.done = true; earn("contract", c.cop); gainXp(c.xp); msg(`Контракт гільдії виконано: ${c.text}. Нагорода: ${moneyTxt(c.cop)}${S.lvl < MAXLVL ? ", досвід +" + c.xp : ""}.`, "good");
  save(); renderTop();
}
const contractsTimeLeft = () => { const ms = (dayNo() + 1) * 86400e3 - 2 * 3600e3 - Date.now(), h = Math.floor(ms / 3600e3), m = Math.floor(ms % 3600e3 / 60e3); return `${h} год ${m} хв`; };

/* ============ досягнення ============ */
const sumv = o => Object.values(o || {}).reduce((a, b) => a + b, 0);
const ACH = [
  {id:"k1", icon:"crossed-swords", name:"Перша кров", text:"Перемогти 25 ворогів", val:() => S.kills, n:25, rew:{hp:10}},
  {id:"k2", icon:"crossed-swords", name:"Різник", text:"Перемогти 250 ворогів", val:() => S.kills, n:250, rew:{hp:25}},
  {id:"k3", icon:"skull-crossed-bones", name:"Гроза нечисті", text:"Перемогти 1000 ворогів", val:() => S.kills, n:1000, rew:{dmg:3}},
  {id:"c1", icon:"castle-ruins", name:"Чистильник", text:"Зачистити 3 райони", val:() => sumv(S.clears), n:3, rew:{dmg:2}},
  {id:"c2", icon:"castle-ruins", name:"Отаманоборець", text:"Зачистити 15 районів", val:() => sumv(S.clears), n:15, rew:{crit:2}},
  {id:"d1", icon:"dungeon-gate", name:"Підземельник", text:"Пройти 3 підземелля", val:() => sumv(S.dung), n:3, rew:{crit:1}},
  {id:"q1", icon:"scroll-quill", name:"Помічник", text:"Виконати 10 квестів", val:() => Object.values(S.quests).filter(q => q.st === "done").length, n:10, rew:{en:10}},
  {id:"q2", icon:"scroll-quill", name:"Оповідач", text:"Виконати 30 квестів", val:() => Object.values(S.quests).filter(q => q.st === "done").length, n:30, rew:{en:20}},
  {id:"v1", icon:"treasure-map", name:"Мандрівник", text:"Побувати в 20 локаціях", val:() => Object.keys(S.visited).length, n:20, rew:{cop:500}},
  {id:"v2", icon:"treasure-map", name:"Картограф", text:"Побувати в усіх локаціях", val:() => Object.keys(S.visited).filter(k => NODES[k]).length, n:() => Object.keys(NODES).length, rew:{wil:2}},
  {id:"b1", icon:"crowned-skull", name:"Знавець нечисті", text:"Відкрити 40 істот у бестіарії", val:() => Object.keys(S.codex).length, n:40, rew:{wil:2}},
  {id:"m1", icon:"two-coins", name:"Купець", text:"Заробити 5 золотих", val:() => sumv(S.econ.in), n:50000, rew:{disc:3}, money:true},
  {id:"r1", icon:"anvil", name:"Майстер", text:"Створити 30 речей ремеслом", val:() => sumv(S.crafted), n:30, rew:{hp:15}},
  {id:"s1", icon:"flanged-mace", name:"Коваль долі", text:"Заточити річ до +5", val:() => Math.max(0, ...Object.values(S.sharp || {})), n:5, rew:{dmg:2}},
];
const achN = a => typeof a.n === "function" ? a.n() : a.n;
function rewText(r){ return Object.entries(r).map(([k, v]) => k === "cop" ? moneyTxt(v) : k === "disc" ? `знижка ${v}% у крамницях` : `+${v}${k === "dmg" ? "% урону" : k === "crit" ? "% криту" : k === "hp" ? " здоров'я" : k === "en" ? " енергії" : k === "wil" ? " волі" : ""}`).join(", "); }
function checkAch(){
  let got = false;
  for (const a of ACH){ if (S.ach[a.id]) continue; if (a.val() >= achN(a)){ S.ach[a.id] = 1; got = true;
    for (const [k, v] of Object.entries(a.rew)){ if (k === "cop") earn("ach", v); else S.perks[k] = (S.perks[k] || 0) + v; }
    msg(`Досягнення «${a.name}»! Нагорода: ${rewText(a.rew)}.`, "good"); } }
  if (got){ save(); renderTop(); }
}
