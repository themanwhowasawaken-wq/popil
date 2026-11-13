/* ============ стан гри ============ */
const SAVE = "popelyastyi-shpyl-v1";
const MAXLVL = 10;
const NEED = [0, 100, 180, 300, 450, 650, 900, 1200, 1600, 2100];   // досвід до наступного рівня
const need = l => l >= MAXLVL ? Infinity : NEED[l];
const EQUIP0 = () => ({weapon:"rusty_sword", helmet:null, armor:null, boots:null, amulet:null, ring1:null, ring2:null, cloak:null, belt:null, legs:null, gloves:null, offhand:null});
function fresh(){
  return {v:3, name:"Сивий_Лицар", lvl:1, xp:0, hp:130, en:60, cop:150, equip:EQUIP0(), sock:{}, inv:{potion_s:3, potion_e:1, scroll_heal:1},
    belt:["potion_s","potion_e","scroll_heal",null,null,null], loc:"spire", prev:null, quests:{}, kills:0, perks:{}, codex:{}, buffs:[],
    prof:{herb:{lv:1, xp:0}, mine:{lv:1, xp:0}, fish:{lv:1, xp:0}, alch:{lv:1, xp:0}, scribe:{lv:1, xp:0}, jewel:{lv:1, xp:0}},
    kc:{}, clears:{}, dung:{}, crafted:{}, intro:false, crest:0,
    tal:{}, sharp:{}, ach:{}, visited:{}, track:null, contracts:null, econ:{in:{}, out:{}, sec:0}, opt:{dmgnum:true, confirmRare:true, fast:false, mapfx:true, snd:true, wx:true}, v4:true, order:null, v5:true, branch:null, pets:{}, pet:null, mp:0};
}
function migrate(s){
  if (!s || typeof s !== "object") return fresh();
  const f = fresh(), noBranch = !("branch" in s);
  if (s.v !== 3){
    s.lvl = Math.min(MAXLVL, s.lvl || 1); s.xp = s.lvl >= MAXLVL ? 0 : Math.min(s.xp || 0, need(s.lvl) - 1);
    delete s.str; delete s.agi; delete s.end;
    s.v = 3;
  }
  for (const k of Object.keys(f)) if (s[k] === undefined) s[k] = f[k];
  s.lvl = Math.min(MAXLVL, s.lvl || 1); if (s.lvl >= MAXLVL) s.xp = 0;
  s.equip = Object.assign(EQUIP0(), s.equip); for (const k of Object.keys(s.equip)) if (s.equip[k] && !ITEMS[s.equip[k]]) s.equip[k] = null;
  for (const k of Object.keys(s.inv)) if (!ITEMS[k] || !(s.inv[k] > 0)) delete s.inv[k];
  for (const k of Object.keys(s.quests)) if (!QUESTS[k]) delete s.quests[k];
  for (const k of Object.keys(f.prof)) if (!s.prof[k]) s.prof[k] = {lv:1, xp:0};
  if (!NODES[s.loc]) s.loc = "spire";
  if (s.prev && !NODES[s.prev]) s.prev = null;
  for (const k of ["tal","sharp","ach","visited","opt"]) if (!s[k] || typeof s[k] !== "object") s[k] = f[k];
  s.opt = Object.assign({}, f.opt, s.opt);
  if (!s.econ || !s.econ.in) s.econ = f.econ;
  for (const k of Object.keys(s.tal)) if (!TALENTS[k]) delete s.tal[k];
  // старі очки вмінь: гілкою стає та, куди вкладено найбільше
  if (noBranch){ s.branch = null; const sum = {}; for (const [k, v] of Object.entries(s.tal)) if (TALENTS[k]) sum[TALENTS[k].br] = (sum[TALENTS[k].br] || 0) + v; const best = Object.entries(sum).sort((a, b) => b[1] - a[1])[0]; if (best && s.lvl >= BRANCH_LVL) s.branch = best[0]; }
  if (s.track && !QUESTS[s.track]) s.track = null;
  if (!["dawn","night"].includes(s.order)) s.order = null;
  if (!s.v4){ s.v4 = true; if (s.lvl >= 10) s.xp = 0; s.visited[s.loc] = 1; }
  if (!s.pets || typeof s.pets !== "object") s.pets = {}; for (const k of Object.keys(s.pets)) if (!PETS[k]) delete s.pets[k]; if (s.pet && !s.pets[s.pet]) s.pet = null;
  s.belt = (s.belt || []).concat([null,null,null,null,null,null]).slice(0, 6).map(x => x && ITEMS[x] ? x : null);
  return s;
}
let S = fresh(), CUR = null, READY = false;   // CUR: ключ збереження поточного героя
function save(){ if (!CUR) return; try { localStorage.setItem(CUR, JSON.stringify(S)); accTouch(); } catch (e) {} }

const UI = {view:"loc", tab:"Локація", sel:null, bagTab:"all", shopTab:"buy", onlyAvail:false, cxSel:null, craftTab:"alch", cam:null, zoom:.8, gathering:null};
let T = null, B = null, DG = null;
const LR = {}, MSG = [];

/* ---- характеристики ---- */
function base(){ const L = S.lvl; return {str:3 + 2 * (L - 1), agi:3 + (L - 1), end:3 + 2 * (L - 1), wil:2 + Math.floor((L - 1) / 2)}; }
function gemBonus(){
  const b = {hp:0, en:0, agi:0, str:0, def:0, crit:0};
  for (const [slot, arr] of Object.entries(S.sock)){ if (!S.equip[slot]) continue; for (const g of arr || []) if (g && ITEMS[g]) b[ITEMS[g].stat] += ITEMS[g].val; }
  return b;
}
function buffBonus(){ const b = {str:0, def:0, agi:0, wil:0}; for (const x of S.buffs) for (const [k, v] of Object.entries(x.k)) b[k] = (b[k] || 0) + v; return b; }
// скільки речей кожного комплекту надягнуто і які бонуси діють
function setCounts(){ const c = {}; for (const [slot] of SLOTS){ const id = S.equip[slot]; if (id && ITEMS[id] && ITEMS[id].set) c[ITEMS[id].set] = (c[ITEMS[id].set] || 0) + 1; } return c; }
function setBonus(){
  const b = {hp:0, def:0, str:0, agi:0, crit:0, wil:0, dmgp:0};
  for (const [k, n] of Object.entries(setCounts())) for (const [need, bon] of Object.entries(SETS[k].bonus)) if (n >= +need) for (const [st, v] of Object.entries(bon)) b[st] = (b[st] || 0) + v;
  return b;
}
const sharpOf = id => (S.sharp && S.sharp[id]) || 0;
function stats(){
  let hp = 0, def = 0, agi = 0, str = 0, crit = 0, wil = 0, dmg = [1,2], wsharp = 0;
  for (const [slot] of SLOTS){ const id = S.equip[slot]; if (!id) continue; const it = ITEMS[id], sh = sharpOf(id);
    hp += it.hp || 0; def += it.def || 0; agi += it.agi || 0; str += it.str || 0; crit += it.crit || 0; wil += it.wil || 0;
    if (it.dmg){ dmg = it.dmg; wsharp = sh; } else if (sh){ def += sh; hp += sh * 4; } }
  const g = gemBonus(), bf = buffBonus(), b = base(), P = S.perks, sb = setBonus(), tb = talentBonus(), ob = ORDER_BONUS[S.order] || {};
  const STR = b.str + str + g.str + (bf.str || 0) + sb.str, AGI = b.agi + agi + g.agi + (bf.agi || 0) + sb.agi;
  const mul = (1 + ((P.dmg || 0) + sb.dmgp + tb.dmgp + (ob.dmgp || 0)) / 100) * (1 + .06 * wsharp);
  return {maxHp:90 + 25 * S.lvl + b.end * 4 + hp + g.hp + (P.hp || 0) + sb.hp + (ob.hp || 0), maxEn:50 + 8 * S.lvl + g.en + (P.en || 0), def:def + g.def + (bf.def || 0) + sb.def,
    agi:AGI, str:STR, end:b.end, wil:b.wil + wil + (bf.wil || 0) + sb.wil + (P.wil || 0) + tb.wil + (ob.wil || 0), crit:crit + g.crit + (P.crit || 0) + sb.crit + tb.crit + (ob.crit || 0), dodge:tb.dodge,
    dmg:[Math.round((dmg[0] + STR * .9) * mul), Math.round((dmg[1] + STR * .9) * mul)]};
}
const reduce = def => def / (def + 40);
// присяга ордену в Землях Світанку й Ночі
const ORDER_BONUS = {dawn:{hp:40, wil:3}, night:{crit:5, dmgp:5}};
// у Трясовині туман отруює, якщо не вбраний у болотяні ходаки й не випита настоянка багна
const bogSafe = () => Object.values(S.equip).some(id => id && ITEMS[id] && ITEMS[id].bog) || S.buffs.some(x => x.k && x.k.bog);

function money(c){
  const g = Math.floor(c / 10000), s = Math.floor(c % 10000 / 100), m = c % 100;
  const part = (v, cls, l) => `<span class="coin ${cls}"><i></i>${v} ${l}</span>`;
  return (g ? part(g, "g", "зол.") : "") + (g || s ? part(s, "s", "ср.") : "") + part(m, "c", "мід.");
}
function moneyTxt(c){ const g = Math.floor(c/10000), s = Math.floor(c%10000/100), m = c%100; return [g?g+" зол.":"", s?s+" ср.":"", m||(!g&&!s)?m+" мід.":""].filter(Boolean).join(" "); }
const inv = id => S.inv[id] || 0;
function give(id, n = 1, quiet){
  if (!ITEMS[id]) return; S.inv[id] = inv(id) + n;
  const it = ITEMS[id];
  if (it.cat === "use" && !S.belt.includes(id)){ const i = S.belt.indexOf(null); if (i >= 0) S.belt[i] = id; }
  if (!quiet) for (const [qid, q] of Object.entries(S.quests)){ const Q = QUESTS[qid]; if (q.st === "active" && (Q.goal.item === id || (Q.goal.items && Q.goal.items[id]))) msg(`Квест «${Q.name}»: ${qProgressTxt(qid)}.`, "quest"); }
}
function take(id, n = 1){ S.inv[id] = inv(id) - n; if (S.inv[id] <= 0) delete S.inv[id]; }

/* ---- повідомлення ---- */
function msg(text, kind = "", ch = "loc"){ MSG.push({t:now(), text, kind, ch}); if (MSG.length > 150) MSG.shift(); if (typeof renderChat === "function") renderChat(); }
const TABCH = {"Локація":["loc"], "Торгівля":["trade"], "Група":[], "Лог бою":["fight"], "Клан":[]};
