/* ============ стан гри ============ */
const SAVE = "popelyastyi-shpyl-v1";
const MAXLVL = 10;
const NEED = [0, 100, 180, 300, 450, 650, 900, 1200, 1600, 2100];   // досвід до наступного рівня
const need = l => l >= MAXLVL ? Infinity : NEED[l];
const EQUIP0 = () => ({weapon:"rusty_sword", helmet:null, armor:null, boots:null, amulet:null, ring1:null, ring2:null});
function fresh(){
  return {v:3, name:"Сивий_Лицар", lvl:1, xp:0, hp:130, en:60, cop:150, equip:EQUIP0(), sock:{}, inv:{potion_s:3, potion_e:1, scroll_heal:1},
    belt:["potion_s","potion_e","scroll_heal",null,null,null], loc:"spire", prev:null, quests:{}, kills:0, perks:{}, codex:{}, buffs:[],
    prof:{herb:{lv:1, xp:0}, mine:{lv:1, xp:0}, fish:{lv:1, xp:0}, alch:{lv:1, xp:0}, scribe:{lv:1, xp:0}, jewel:{lv:1, xp:0}},
    kc:{}, clears:{}, dung:{}, crafted:{}, intro:false, crest:0};
}
function migrate(s){
  if (!s || typeof s !== "object") return fresh();
  const f = fresh();
  if (s.v !== 3){
    s.lvl = Math.min(MAXLVL, s.lvl || 1); s.xp = s.lvl >= MAXLVL ? 0 : Math.min(s.xp || 0, need(s.lvl) - 1);
    delete s.str; delete s.agi; delete s.end;
    s.v = 3;
  }
  for (const k of Object.keys(f)) if (s[k] === undefined) s[k] = f[k];
  s.equip = Object.assign(EQUIP0(), s.equip); for (const k of Object.keys(s.equip)) if (s.equip[k] && !ITEMS[s.equip[k]]) s.equip[k] = null;
  for (const k of Object.keys(s.inv)) if (!ITEMS[k] || !(s.inv[k] > 0)) delete s.inv[k];
  for (const k of Object.keys(s.quests)) if (!QUESTS[k]) delete s.quests[k];
  for (const k of Object.keys(f.prof)) if (!s.prof[k]) s.prof[k] = {lv:1, xp:0};
  if (!NODES[s.loc]) s.loc = "spire";
  if (s.prev && !NODES[s.prev]) s.prev = null;
  s.belt = (s.belt || []).concat([null,null,null,null,null,null]).slice(0, 6).map(x => x && ITEMS[x] ? x : null);
  return s;
}
let S = fresh(), CUR = null, READY = false;   // CUR: ключ збереження поточного героя
function save(){ if (!CUR) return; try { localStorage.setItem(CUR, JSON.stringify(S)); accTouch(); } catch (e) {} }

const UI = {view:"loc", tab:"Локація", sel:null, bagTab:"gear", shopTab:"buy", onlyAvail:false, cxSel:null, craftTab:"alch", cam:null, zoom:.8, gathering:null};
let T = null, B = null, DG = null;
const LR = {}, MSG = [];

/* ---- характеристики ---- */
function base(){ const L = S.lvl; return {str:3 + 2 * (L - 1), agi:3 + (L - 1), end:3 + 2 * (L - 1)}; }
function gemBonus(){
  const b = {hp:0, en:0, agi:0, str:0, def:0, crit:0};
  for (const [slot, arr] of Object.entries(S.sock)){ if (!S.equip[slot]) continue; for (const g of arr || []) if (g && ITEMS[g]) b[ITEMS[g].stat] += ITEMS[g].val; }
  return b;
}
function buffBonus(){ const b = {str:0, def:0, agi:0}; for (const x of S.buffs) for (const [k, v] of Object.entries(x.k)) b[k] = (b[k] || 0) + v; return b; }
function stats(){
  let hp = 0, def = 0, agi = 0, str = 0, crit = 0, dmg = [1,2];
  for (const [slot] of SLOTS){ const id = S.equip[slot]; if (!id) continue; const it = ITEMS[id];
    hp += it.hp || 0; def += it.def || 0; agi += it.agi || 0; str += it.str || 0; crit += it.crit || 0; if (it.dmg) dmg = it.dmg; }
  const g = gemBonus(), bf = buffBonus(), b = base(), P = S.perks;
  const STR = b.str + str + g.str + (bf.str || 0), AGI = b.agi + agi + g.agi + (bf.agi || 0), mul = 1 + (P.dmg || 0) / 100;
  return {maxHp:90 + 25 * S.lvl + b.end * 4 + hp + g.hp + (P.hp || 0), maxEn:50 + 8 * S.lvl + g.en + (P.en || 0), def:def + g.def + (bf.def || 0),
    agi:AGI, str:STR, end:b.end, crit:crit + g.crit + (P.crit || 0), dmg:[Math.round((dmg[0] + STR * .9) * mul), Math.round((dmg[1] + STR * .9) * mul)]};
}
const reduce = def => def / (def + 40);

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
