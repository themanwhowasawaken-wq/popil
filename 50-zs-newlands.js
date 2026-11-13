/* ============ сцени: Крижані Пустки, Дике Поле, Узбережжя, Піски ============ */
// готові малюнки зі STRUCT (48-newlands.js) кладемо в сцену і резервуємо під них місце
function nsPut(K, tag, claims = [], dy = 0){ for (const it of STRUCT[tag](K.r)) K.put(it.y + dy, it.s); for (const [x, y, rad] of claims) K.claim(x, y, rad); }
function nsPal(K, y, col = "#6a5a46", col2 = "#5a4a38", snow = false){
  let pl = ""; for (let x = -10; x < 920; x += 13){ if (K.exits.some(([ex, ey]) => Math.abs(ex - x) < 46 && ey < 160)) continue; pl += `<path d="M${x} ${y}v-56l6.5 -10 6.5 10v56z" fill="${x % 26 ? col : col2}"/>` + (snow ? `<path d="M${x} ${y - 56}l6.5 -10 6.5 10z" fill="#eef4f8"/>` : ""); }
  K.put(y, `<rect x="0" y="${y - 8}" width="${ZW}" height="12" fill="#000" opacity=".25" filter="url(#zb1)"/>` + pl);
}
function nsRoofs(snow){ return snow ? ["#dfe8ee", "#cfdce6", "#e6eef2"] : ["#8a3a24", "#6a4a2a", "#5a3a2a"]; }
function nsPole(x, y, h = 70, c = "#4a3a2c", flag){ return zSh(x + 6, y + 2, 10, 3, .3) + `<rect x="${x - 2}" y="${y - h}" width="4" height="${h}" fill="${c}"/>` + (flag ? Z.banner(x, y, h, flag, "#e8dfc8") : ""); }
function nsMast(x, y, h = 120, tilt = 0, sail){ return `<g transform="translate(${zr(x)} ${zr(y)}) rotate(${tilt})">${zSh(6, 3, 12, 3, .3)}<rect x="-3" y="${-h}" width="6" height="${h}" fill="#4a3626"/><rect x="-26" y="${-h * .8}" width="52" height="4" fill="#4a3626"/>${sail ? `<path d="M-24 ${-h * .78}q24 28 48 0v${h * .4}q-24 14 -48 0z" fill="${sail}" opacity=".85"/>` : ""}</g>`; }
function nsPillar(x, y, h = 90, w = 16, c = "#c8b078"){ return zSh(x + w * .7, y + 2, w * 1.1, 4, .3) + `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="${c}"/><rect x="${x}" y="${y - h}" width="${w / 2}" height="${h}" fill="${shade(c, .72)}"/><rect x="${x - w * .7}" y="${y - h - 6}" width="${w * 1.4}" height="8" fill="${shade(c, .9)}"/><path d="M${x - w / 2} ${y - h * .5}h${w}M${x - w / 2} ${y - h * .25}h${w}" stroke="${shade(c, .6)}" stroke-width="1.2"/>`; }
function nsSarc(x, y, c = "#b8a070"){ return zSh(x + 10, y + 2, 28, 5, .3) + `<path d="M${x - 24} ${y}v-16l8 -10h32l8 10v16z" fill="${c}"/><path d="M${x + 8} ${y}v-26h16l8 10v16z" fill="${shade(c, .68)}"/><circle cx="${x - 8}" cy="${y - 17}" r="4.4" fill="${shade(c, 1.15)}"/><path d="M${x - 20} ${y - 8}h28" stroke="#3a6a8a" stroke-width="2"/>`; }
function nsPalm(x, y, s = 1){ return zSh(x + 8 * s, y + 3, 16 * s, 4, .3) + `<path d="M${x} ${y}q5 ${-40 * s} ${-2 * s} ${-84 * s}" stroke="#5a4226" stroke-width="${6 * s}" fill="none" stroke-linecap="round"/>` + [-70, -35, 0, 35, 70].map(a => `<path d="M${x - 2 * s} ${y - 84 * s}q${a * .5 * s} ${-18 * s} ${a * s} ${6 * s}" stroke="#3a7a3a" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>`).join(""); }
function nsTusk(x, y, s = 1, flip){ const k = flip ? -1 : 1; return `<path d="M${x} ${y}q${k * 22 * s} ${-8 * s} ${k * 20 * s} ${-46 * s}q${k * -6 * s} ${24 * s} ${k * -20 * s} ${46 * s}z" fill="#f2ecd8" stroke="#c8bea0" stroke-width="1"/>`; }

Object.assign(ZS, {
  /* ---------------- КРИЖАНІ ПУСТКИ ---------------- */
  ic_post(K){ const r = K.r; K.dress = {veg:.3, edge:{pine:6}, mid:{rock:3}};
    nsPal(K, 120, "#6a5a46", "#5a4a38", true);
    K.place(760, 205, 40, (px, py) => zTower(K, px, py, 26, 150, {wall:"#6a5a46", roof:"#dfe8ee", rh:46}) + `<rect x="${px - 14}" y="${py - 138}" width="28" height="22" fill="#1a1612"/>` + zGlow(px, py - 126, 26, "#ffb040", .6), {cy:60});
    K.place(330, 190, 56, (px, py) => zLog(K, px, py, 116, 50, 54, {wall:"#7a6450", roof:"#dfe8ee", sign:"#5a4a6a", signIc:"#e8c860", chimney:true}) + zSmoke(px + 30, py - 100, 1, "#e8eef2"), {cy:30}); K.light(330, 180, 60, "#ffb040", .4);
    K.place(600, 225, 50, (px, py) => zHouse(K, px, py, 94, 48, 50, {wall:"#8a7a66", roof:"#d6e2ea", timber:"#3a2a1a", sign:"#5a4a3a", signIc:"#c0c0c0", chimney:true}) + Z.anvil(px - 64, py + 14), {cy:30}); K.light(600, 214, 50, "#ff7a2a", .4);
    K.place(150, 270, 46, (px, py) => zLog(K, px, py, 84, 42, 48, {wall:"#7a6450", roof:"#e6eef2"}), {cy:30});
    for (const [x, y] of [[270, 360], [640, 380]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py), {npc:1});
    K.place(180, 440, 30, (px, py) => zTent(K, px, py, 60, 46, 44, "#6a5a7a"), {cy:20}); K.place(760, 440, 30, (px, py) => zTent(K, px, py, 60, 46, 44, "#7a5a4a"), {cy:20});
    K.place(420, 460, 20, (px, py) => Z.cart(px, py, `<path d="M${px - 20} ${py - 26}h34l4 -6h-34z" fill="#8a6a44"/>`)); K.place(700, 300, 12, (px, py) => Z.barrel(px, py)); K.place(716, 306, 12, (px, py) => Z.barrel(px, py, "#6a4a2a"));
    K.scatter(5, 8, (x, y) => Z.folk(x, y, K.pk(["#5a5a62", "#3a4a6a", "#6a3a2a"]), true), {box:[220, 260, 700, 480]});
  },
  ic_camp(K){ const r = K.r; K.dress = {veg:.3, edge:{pine:5}, mid:{rock:3}};
    nsPut(K, "mammoth_bones", [[440, 330, 120]]);
    for (const [x, y, c] of [[170, 220, "#7a5a3a"], [330, 190, "#6a5a7a"], [640, 200, "#7a6a4a"], [760, 260, "#5a6a7a"], [210, 420, "#6a4a3a"]]) K.place(x, y, 34, (px, py) => zTent(K, px, py, 66, 52, 46, c), {cy:20});
    K.place(470, 230, 20, (px, py) => Z.fire(K, px, py, 1.3), {npc:1}); K.light(470, 220, 80, "#ff8a2a", .6);
    for (const [x, y] of [[560, 250], [380, 250]]) K.place(x, y, 18, (px, py) => Z.rack(px, py));
    K.place(740, 420, 20, (px, py) => Z.hay(px, py)); K.place(120, 330, 12, (px, py) => Z.barrel(px, py));
    K.scatter(4, 8, (x, y) => Z.folk(x, y, K.pk(["#5a5a62", "#6a3a2a", "#3a4a5a"]), true), {box:[240, 240, 700, 470]});
  },
  ic_river(K){ const r = K.r; K.dress = {veg:.3, edge:{pine:5}, mid:{rock:3, reeds:2}};
    zAny(K, [[190, 220], [140, 300], [760, 240]], 40, (px, py) => zShed(K, px, py, 70, 40, 40, {wall:"#7a6450", roof:"#dfe8ee"}), {cy:20});
    for (const [x, y] of [[300, 400], [600, 430], [740, 340]]) K.place(x, y, 14, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="20" ry="6" fill="#2a3a4a" opacity=".8"/><ellipse cx="${px}" cy="${py - 1}" rx="14" ry="3.6" fill="#0a1a2a"/>` + Z.stakes(px + 24, py + 2, 2), {noclaim:1});
    for (let i = 0; i < 9; i++) K.place(100 + r() * 700, 230 + r() * 280, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (let i = 0; i < 7; i++) K.place(80 + r() * 740, 200 + r() * 320, 10, (px, py) => NSC2.shard(K, px, py, 1 + r() * .8), {noclaim:1});
    K.place(220, 470, 20, (px, py) => Z.boat(px, py, .9, "#5a4a3a")); K.place(660, 300, 20, (px, py) => Z.logs(px, py));
  },
  ic_mammoth(K){ const r = K.r; K.dress = {veg:.2, edge:{pine:5}, mid:{rock:4}};
    nsPut(K, "mammoth_bones", [[450, 330, 140]]);
    for (const [x, y, f] of [[200, 280, 0], [720, 260, 1]]) K.place(x, y, 24, (px, py) => nsTusk(px, py, 1.4, f) + nsTusk(px + 16, py, 1.2, !f));
    K.place(640, 420, 26, (px, py) => zWolf(px, py, 1.1, 1, "#9aa4ae"), {noclaim:1}); K.place(260, 440, 26, (px, py) => zWolf(px, py, 1, 0, "#9aa4ae"), {noclaim:1});
    for (let i = 0; i < 7; i++) K.place(100 + r() * 700, 200 + r() * 300, 10, (px, py) => zBone(px, py, 1.5, r), {noclaim:1});
    K.place(150, 180, 30, (px, py) => zRock(px, py, 1.6, "#8a95a0")); K.place(790, 190, 30, (px, py) => zRock(px, py, 1.8, "#8a95a0"));
  },
  ic_witch(K){ const r = K.r; K.dress = {veg:.3, edge:{pine:6, dead:3}, mid:{rock:2}}; K.fog = true; K.fogOp = .12;
    nsPut(K, "witch_hut", [[460, 220, 100]]);
    K.place(330, 330, 22, (px, py) => Z.cauldron(K, px, py, "#9aff7a"), {npc:1}); K.light(330, 316, 50, "#9aff7a", .5);
    for (const [x, y] of [[220, 300], [700, 320], [260, 440], [680, 440], [150, 220], [790, 230]]) K.place(x, y, 12, (px, py) => Z.skullPole(px, py));
    K.place(560, 360, 20, (px, py) => Z.hay(px, py, .7)); K.place(600, 400, 12, (px, py) => Z.barrel(px, py));
    for (let i = 0; i < 8; i++) K.top += Z.crow(100 + r() * 700, 40 + r() * 100, 1.1);
  },
  ic_burrows(K){ const r = K.r; K.dress = {veg:.2, edge:{pine:4}, mid:{rock:5}};
    nsPut(K, "burrows", [[200, 250, 70], [480, 220, 90], [760, 280, 60]]);
    K.place(420, 380, 20, (px, py) => Z.fire(K, px, py, 1), {npc:1}); K.light(420, 368, 60, "#ff8a2a", .5);
    K.place(300, 420, 22, (px, py) => Z.stakes(px, py, 4, "#5a4a3a")); K.place(600, 430, 22, (px, py) => Z.stakes(px, py, 4, "#5a4a3a"));
    for (const [x, y] of [[560, 330], [330, 340]]) K.place(x, y, 14, (px, py) => Z.crate(px, py, 14, "#6a5a3a"));
    for (let i = 0; i < 8; i++) K.place(100 + r() * 700, 250 + r() * 260, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
  },
  ic_mine(K){ const r = K.r; K.dress = {veg:.2, edge:{pine:4}, mid:{rock:5}};
    K.put(236, zSh(450, 240, 240, 14, .35) + `<path d="M200 236Q250 40 450 30Q650 40 700 236z" fill="#6a7480"/><path d="M450 30Q650 40 700 236H460z" fill="#525c68"/><path d="M230 120q60 -50 150 -62" stroke="#eef4f8" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M380 236v-96h140v96z" fill="#5a4630"/><path d="M394 236v-82h112v82z" fill="#0a0806"/><path d="M370 140h160v-12h-160z" fill="#7a5a36"/><path d="M394 236v-82M506 236v-82" stroke="#7a5a36" stroke-width="9"/><path d="M420 236l30 -60M480 236l-30 -60" stroke="#2a2218" stroke-width="2"/>`); K.claim(450, 160, 150); K.light(450, 200, 60, "#ffb040", .5);
    K.place(300, 330, 30, (px, py) => `<path d="M${px - 60} ${py + 6}h120M${px - 56} ${py + 12}h112" stroke="#4a3a2a" stroke-width="3"/>` + Z.cart(px, py, `<path d="M${px - 22} ${py - 28}q18 -14 38 0z" fill="#5a6a7a"/>`));
    K.place(640, 330, 24, (px, py) => Z.cart(px, py, `<path d="M${px - 22} ${py - 28}q18 -14 38 0z" fill="#6a5a3a"/>`));
    K.place(220, 220, 20, (px, py) => Z.lamp(K, px, py, "#ffc860")); K.place(700, 240, 20, (px, py) => Z.lamp(K, px, py, "#ffc860"));
    K.place(160, 430, 20, (px, py) => Z.anvil(px, py)); K.place(740, 440, 20, (px, py) => Z.crate(px, py, 16, "#6a5a3a"));
    for (let i = 0; i < 6; i++) K.place(100 + r() * 700, 320 + r() * 180, 10, (px, py) => zRock(px, py, 1, "#7a8490"), {noclaim:1});
  },
  ic_pass(K){ const r = K.r; K.dress = {veg:.2, edge:{pine:3}, mid:{rock:6}};
    for (const [x, y, h] of [[70, 230, 130], [140, 330, 110], [820, 220, 140], [760, 340, 120], [100, 460, 100], [830, 470, 110]]) K.place(x, y, 40, (px, py) => zRock(px, py, h / 40, "#7a8490"));
    for (const [x, y] of [[300, 280], [620, 300], [450, 440]]) K.place(x, y, 14, (px, py) => Z.menhir(px, py, 56 + r() * 18, "#9aa4ae"), {noclaim:1});
    K.place(450, 220, 22, (px, py) => zSh(px + 6, py + 2, 18, 4, .3) + `<path d="M${px - 16} ${py}l8 -12l8 -8l8 8l8 12z" fill="#8a95a0"/><path d="M${px - 8} ${py - 12}l8 -8l8 8z" fill="#eef4f8"/>`);
    K.place(240, 190, 12, (px, py) => Z.banner(px, py, 80, "#4a3a2a", "#c8b890", {torn:true})); K.place(680, 190, 12, (px, py) => Z.banner(px, py, 80, "#4a3a2a", "#c8b890", {torn:true}));
    for (let i = 0; i < 7; i++) K.place(80 + r() * 740, 230 + r() * 290, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    K.place(560, 440, 20, (px, py) => zWolf(px, py, 1, 1, "#9aa4ae"), {noclaim:1});
  },
  ic_jotun(K){ const r = K.r; K.dress = {veg:.2, edge:{pine:3}, mid:{rock:3}};
    nsPut(K, "ice_cave", [[470, 160, 190]]); K.light(470, 190, 90, "#9ae8ff", .5);
    for (const [x, y, s] of [[190, 260, 2], [740, 270, 2.2], [270, 400, 1.6], [660, 410, 1.8]]) K.place(x, y, 24, (px, py) => NSC2.shard(K, px, py, s));
    for (const [x, y, f] of [[360, 330, 0], [560, 350, 1], [450, 430, 0]]) K.place(x, y, 14, (px, py) => zSkel(px, py, 1, {flip:f, spear:true}), {noclaim:1});
    for (let i = 0; i < 6; i++) K.place(120 + r() * 660, 250 + r() * 250, 8, (px, py) => zBone(px, py, 1.6, r), {noclaim:1});
    for (const [x, y] of [[150, 330], [770, 340]]) K.place(x, y, 12, (px, py) => Z.menhir(px, py, 90, "#9ac8e0"));
  },
  ic_king(K){ const r = K.r; K.dress = {veg:.2, edge:{pine:3}, mid:{rock:4}};
    nsPut(K, "burrows", [[200, 250, 70], [480, 220, 90], [760, 280, 60]]);
    K.place(450, 350, 40, (px, py) => zSh(px + 10, py + 3, 40, 8, .3) + `<path d="M${px - 34} ${py}v-34h68v34z" fill="#4a4034"/><path d="M${px - 26} ${py - 34}v-48h52v48z" fill="#5a4e40"/><path d="M${px - 40} ${py - 84}l14 -22l14 22l12 -26l12 26l14 -22l14 22z" fill="#d8cfb8"/><path d="M${px - 14} ${py - 56}h28v22h-28z" fill="#7a2a22"/>` + zSkull(px - 22, py - 90, 1) + zSkull(px + 22, py - 90, 1), {npc:1, cy:40});
    for (const [x, y] of [[330, 340], [570, 340], [260, 440], [650, 440]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py, "#ff6a2a"), {npc:1});
    for (const [x, y] of [[180, 340], [720, 350]]) K.place(x, y, 12, (px, py) => Z.banner(px, py, 90, "#4a2a22", "#c8b890", {torn:true}));
    for (let i = 0; i < 9; i++) K.place(100 + r() * 700, 260 + r() * 250, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
  },

  /* ---------------- ДИКЕ ПОЛЕ ---------------- */
  wd_fort(K){ const r = K.r; K.dress = {veg:.5, edge:{bush:4}, mid:{rock:2}};
    nsPal(K, 120, "#8a6a42", "#7a5a38");
    K.place(780, 210, 40, (px, py) => zTower(K, px, py, 26, 150, {wall:"#8a6a42", roof:"#5a3a24", rh:50}) + `<rect x="${px - 14}" y="${py - 138}" width="28" height="22" fill="#1a1612"/>` + Z.banner(px + 10, py - 150, 40, "#a82a22", "#e8c060"), {cy:60});
    K.place(330, 190, 56, (px, py) => zLog(K, px, py, 116, 50, 54, {wall:"#9a7a52", roof:"#6a4a24", sign:"#a82a22", signIc:"#e8c860", chimney:true}), {cy:30});
    K.place(610, 230, 50, (px, py) => zHouse(K, px, py, 94, 48, 50, {wall:"#b8a07a", roof:"#7a4a24", timber:"#3a2a1a", sign:"#5a4a3a", signIc:"#c0c0c0", chimney:true}) + Z.anvil(px - 64, py + 14), {cy:30}); K.light(610, 218, 50, "#ff7a2a", .4);
    K.place(170, 280, 46, (px, py) => zLog(K, px, py, 84, 42, 48, {wall:"#9a7a52", roof:"#6a4a24"}), {cy:30});
    for (const [x, y] of [[280, 360], [640, 380]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py), {npc:1});
    K.place(160, 430, 22, (px, py) => Z.rack(px, py)); K.place(740, 430, 22, (px, py) => Z.dummy(px, py)); K.place(780, 470, 22, (px, py) => Z.dummy(px, py));
    K.place(450, 470, 20, (px, py) => Z.hay(px, py)); K.place(520, 480, 20, (px, py) => Z.hay(px, py, .8));
    K.scatter(5, 8, (x, y) => Z.folk(x, y, K.pk(["#7a3a26", "#3a4a6a", "#5a4a2a"])), {box:[220, 260, 700, 480]});
  },
  wd_inn(K){ const r = K.r; K.dress = {veg:.6, edge:{bush:4}, mid:{rock:2, grass:4}};
    zAny(K, [[440, 215], [400, 230], [330, 210], [560, 220], [250, 250]], 56, (px, py) => zHouse(K, px, py, 190, 70, 64, {wall:"#d8cca8", roof:"#a8883a", timber:"#5a3a1a", sign:"#8a5a2a", signIc:"#e8c860", chimney:true, lit:true}) + zSmoke(px + 50, py - 110, 1.1, "#d8d4c8"), {cy:40}); K.light(440, 200, 90, "#ffb040", .45);
    K.place(180, 260, 50, (px, py) => zShed(K, px, py, 90, 46, 44, {wall:"#9a7a52", roof:"#6a4a24"}), {cy:20});
    K.place(700, 270, 44, (px, py) => Z.cart(px, py, `<path d="M${px - 22} ${py - 26}q18 -18 40 0z" fill="#d0ae5c"/>`));
    K.place(780, 420, 24, (px, py) => Z.hay(px, py)); K.place(110, 430, 24, (px, py) => Z.hay(px, py, .9));
    K.place(260, 380, 20, (px, py) => Z.well(px, py)); K.place(640, 400, 24, (px, py) => Z.fence([[px - 50, py], [px + 50, py - 8]]));
    for (const [x, y] of [[350, 330], [560, 340]]) K.place(x, y, 12, (px, py) => Z.barrel(px, py));
    K.scatter(4, 8, (x, y) => Z.folk(x, y, K.pk(["#7a3a26", "#3a4a6a", "#5a4a2a"])), {box:[240, 260, 700, 470]});
  },
  wd_balka(K){ const r = K.r; K.dress = {veg:.7, edge:{bush:6, reeds:2}, mid:{reeds:4, rock:2}};
    nsPut(K, "horse_bones");
    K.place(200, 280, 40, (px, py) => Z.cart(px, py, "") + `<path d="M${px - 26} ${py - 10}l-20 6M${px + 12} ${py - 8}l4 14" stroke="#4a3220" stroke-width="3"/>`);
    K.place(620, 440, 30, (px, py) => Z.stakes(px, py, 4)); K.place(730, 300, 24, (px, py) => Z.logs(px, py));
    for (let i = 0; i < 8; i++) K.place(100 + r() * 700, 220 + r() * 300, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (let i = 0; i < 8; i++) K.top += Z.crow(100 + r() * 700, 40 + r() * 80, 1);
  },
  wd_kurgan(K){ const r = K.r; K.dress = {veg:.5, edge:{bush:3}, mid:{rock:3}};
    K.put(230, zSh(470, 232, 300, 24, .35) + `<path d="M170 230Q260 96 450 90Q650 96 770 230z" fill="#7a8a4a"/><path d="M450 90Q650 96 770 230H470z" fill="#5a6a38"/><path d="M220 190q90 -60 220 -76" stroke="#9aaa5a" stroke-width="4" fill="none"/><path d="M420 230v-50h60v50z" fill="#8a867a"/><path d="M410 180h80v-10h-80z" fill="#aaa69a"/><path d="M432 230v-40h36v40z" fill="#0d0b09"/>`); K.claim(470, 170, 160);
    for (const [x, y] of [[150, 330], [300, 380], [620, 380], [790, 330], [470, 450]]) K.place(x, y, 14, (px, py) => Z.menhir(px, py, 70 + r() * 20, "#8a867a"));
    for (const [x, f] of [[404, 0], [496, 1]]) K.put(232, zSkel(x, 232, 1.05, {spear:true, shield:true, flip:f}));
    for (let i = 0; i < 8; i++) K.place(120 + r() * 660, 280 + r() * 230, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    K.place(220, 440, 12, (px, py) => Z.banner(px, py, 80, "#5a3a2a", "#c8b890", {torn:true}));
  },
  wd_baba(K){ const r = K.r; K.dress = {veg:.5, edge:{bush:3}, mid:{rock:2, grass:4}};
    nsPut(K, "stone_babas", [[180, 220, 24], [420, 190, 24], [700, 240, 24], [300, 440, 24], [620, 460, 24], [820, 380, 24]]);
    for (let i = 0; i < 9; i++){ const a = i / 9 * Math.PI * 2; K.place(450 + Math.cos(a) * 250, 330 + Math.sin(a) * 120, 10, (px, py) => Z.menhir(px, py, 44 + r() * 14, "#9a968a"), {noclaim:1}); }
    K.place(450, 340, 16, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="30" ry="8" fill="#4a4636"/><ellipse cx="${px}" cy="${py - 3}" rx="20" ry="5" fill="#6a6650"/>` + zBone(px, py - 6, 1.2, r), {npc:1, noclaim:1});
    for (let i = 0; i < 6; i++) K.place(80 + r() * 740, 250 + r() * 260, 8, (px, py) => NSC2.poppy(px, py, 1 + r() * .5), {noclaim:1});
  },
  wd_yar(K){ const r = K.r; K.dress = {veg:.5, edge:{bush:3}, mid:{grass:4, rock:1}};
    nsPut(K, "yurts", [[180, 230, 50], [440, 200, 50], [700, 250, 50], [300, 450, 50], [620, 460, 50]]);
    K.place(460, 360, 20, (px, py) => Z.fire(K, px, py, 1.2), {npc:1}); K.light(460, 350, 70, "#ff8a2a", .5);
    K.place(780, 400, 40, (px, py) => Z.fence([[px - 50, py], [px, py - 14], [px + 40, py - 2], [px + 44, py + 40]])); K.place(780, 440, 12, (px, py) => Z.sheep(px, py), {noclaim:1}); K.place(740, 420, 12, (px, py) => Z.sheep(px, py), {noclaim:1});
    for (const [x, y] of [[100, 340], [820, 300]]) K.place(x, y, 20, (px, py) => Z.hay(px, py)); K.place(140, 440, 12, (px, py) => Z.rack(px, py));
    K.scatter(4, 8, (x, y) => Z.folk(x, y, K.pk(["#8a3a26", "#3a5a6a", "#6a5a2a"])), {box:[240, 260, 700, 470]});
  },
  wd_witch(K){ const r = K.r; K.dress = {veg:.5, edge:{bush:4, dead:2}, mid:{rock:2}}; K.fog = true; K.fogOp = .1;
    nsPut(K, "steppe_hut", [[470, 220, 100]]);
    K.place(300, 340, 22, (px, py) => Z.cauldron(K, px, py, "#9aff7a"), {npc:1}); K.light(300, 326, 50, "#9aff7a", .5);
    for (const [x, y] of [[210, 280], [720, 310], [250, 450], [690, 450]]) K.place(x, y, 12, (px, py) => Z.skullPole(px, py));
    K.place(610, 380, 20, (px, py) => Z.hay(px, py, .7)); K.place(140, 200, 20, (px, py) => zDead(px, py, 1.3));
    for (let i = 0; i < 6; i++) K.top += Z.crow(100 + r() * 700, 40 + r() * 100, 1.1);
  },
  wd_levada(K){ const r = K.r; K.dress = {veg:.7, edge:{bush:4}, mid:{grass:5, rock:1}};
    nsPut(K, "horse_bones");
    K.place(260, 260, 40, (px, py) => Z.cart(px, py, "") + `<path d="M${px - 26} ${py - 12}l-24 4" stroke="#4a3220" stroke-width="3"/>`);
    K.place(620, 300, 30, (px, py) => Z.stakes(px, py, 5)); K.place(480, 440, 14, (px, py) => zSkel(px, py, 1.05, {spear:true, flip:1}), {noclaim:1});
    K.place(160, 440, 12, (px, py) => Z.banner(px, py, 80, "#5a3a2a", "#c8b890", {torn:true})); K.place(760, 220, 12, (px, py) => Z.banner(px, py, 80, "#5a3a2a", "#c8b890", {torn:true}));
    for (let i = 0; i < 12; i++) K.place(60 + r() * 780, 200 + r() * 320, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (let i = 0; i < 10; i++) K.top += Z.crow(60 + r() * 780, 30 + r() * 90, 1);
  },
  wd_gora(K){ const r = K.r; K.dress = {veg:.1, edge:{dead:5}, mid:{rock:6}};
    nsPut(K, "fire_mountain", [[460, 160, 230]]); K.light(470, 130, 140, "#ff5a1a", .8); K.light(300, 250, 70, "#ff5a1a", .5); K.light(640, 250, 70, "#ff5a1a", .5);
    for (const [x, y] of [[180, 340], [330, 400], [610, 400], [770, 340]]) K.place(x, y, 20, (px, py) => zRock(px, py, 1.4, "#3a2a26") + zGlow(px, py - 6, 20, "#ff6a2a", .5), {noclaim:1});
    for (let i = 0; i < 6; i++) K.place(100 + r() * 700, 300 + r() * 220, 8, (px, py) => zSkull(px, py, 1.1), {noclaim:1});
    for (let i = 0; i < 8; i++) K.place(80 + r() * 740, 280 + r() * 240, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    K.place(120, 220, 20, (px, py) => zDead(px, py, 1.5, "#1a1410")); K.place(800, 230, 20, (px, py) => zDead(px, py, 1.4, "#1a1410"));
  },

  /* ---------------- ЗАТОПЛЕНЕ УЗБЕРЕЖЖЯ ---------------- */
  cs_harbor(K){ const r = K.r; K.dress = {veg:.2, edge:{rock:4}, mid:{rock:3}};
    K.put(300, zPier(560, 296, 330, 0)); K.claim(740, 296, 160);
    K.place(180, 210, 56, (px, py) => zHouse(K, px, py, 104, 50, 54, {wall:"#d8d0b8", roof:"#4a6a8a", timber:"#4a3a2a", sign:"#3a5a7a", signIc:"#e8c860", chimney:true}), {cy:30});
    K.place(380, 190, 56, (px, py) => zHouse(K, px, py, 110, 54, 54, {wall:"#c8d0c8", roof:"#6a4a2a", timber:"#4a3a2a", sign:"#6a4a2a", signIc:"#e8c860", chimney:true}) + zSmoke(px + 28, py - 100, 1, "#d8d4c8"), {cy:30}); K.light(380, 180, 60, "#ffb040", .4);
    K.place(620, 180, 46, (px, py) => zShed(K, px, py, 90, 46, 44, {wall:"#7a6a52", roof:"#4a3a2a"}), {cy:20});
    K.place(150, 400, 40, (px, py) => Z.stall(px, py, "#3a6a8a")); K.place(300, 430, 40, (px, py) => Z.stall(px, py, "#a83a2a"));
    K.place(470, 380, 20, (px, py) => Z.boat(px, py, 1, "#6a4a2a")); K.place(430, 460, 20, (px, py) => Z.boat(px, py, .8, "#4a5a6a", 1));
    for (const [x, y] of [[560, 360], [640, 380], [220, 330]]) K.place(x, y, 12, (px, py) => Z.barrel(px, py)); K.place(520, 420, 12, (px, py) => Z.crate(px, py, 14));
    for (let i = 0; i < 5; i++) K.place(80 + r() * 480, 260 + r() * 250, 8, (px, py) => NSC2.shell(px, py, 1), {noclaim:1});
    K.scatter(4, 8, (x, y) => Z.folk(x, y, K.pk(["#3a5a7a", "#7a3a26", "#5a5a4a"])), {box:[240, 280, 600, 480]});
    for (let i = 0; i < 6; i++) K.top += Z.crow(100 + r() * 700, 30 + r() * 80, .9);
  },
  cs_light(K){ const r = K.r; K.dress = {veg:.2, edge:{rock:5}, mid:{rock:4}};
    nsPut(K, "lighthouse", [[460, 170, 80]]); K.light(460, 70, 90, "#ffe08a", .8);
    K.place(250, 320, 50, (px, py) => zHouse(K, px, py, 80, 44, 44, {wall:"#d8d0b8", roof:"#8a3a24", timber:"#4a3a2a", chimney:true}), {cy:25});
    K.place(640, 420, 20, (px, py) => Z.boat(px, py, 1, "#6a4a2a")); K.place(150, 450, 20, (px, py) => Z.logs(px, py));
    for (const [x, y, s] of [[110, 260, 2], [800, 300, 2.4], [330, 470, 1.6]]) K.place(x, y, 26, (px, py) => zRock(px, py, s, "#6a7078"));
    for (let i = 0; i < 6; i++) K.place(80 + r() * 600, 280 + r() * 240, 8, (px, py) => NSC2.shell(px, py, 1), {noclaim:1});
    for (let i = 0; i < 9; i++) K.top += Z.crow(100 + r() * 700, 30 + r() * 120, 1);
  },
  cs_shoal(K){ const r = K.r; K.dress = {veg:.2, edge:{rock:5}, mid:{rock:3}};
    const hx = 330 + r() * 80;
    K.put(340, zSh(hx, 344, 150, 12, .3) + `<path d="M${hx - 140} 330q140 26 280 0" fill="none" stroke="#3a2a1e" stroke-width="9" stroke-linecap="round"/>` + [-5, -3, -1, 1, 3, 5].map(i => `<path d="M${hx + i * 24} 334q${i * 2} -${40 - Math.abs(i) * 4} ${-i * 1.5 + 2} -${64 - Math.abs(i) * 6}" stroke="#4a3626" stroke-width="6" fill="none" stroke-linecap="round"/>`).join("") + nsMast(hx + 60, 330, 120, -6)); K.claim(hx, 300, 150);
    K.place(180, 440, 20, (px, py) => Z.boat(px, py, 1, "#4a5a6a", 1)); K.place(650, 430, 20, (px, py) => Z.logs(px, py));
    for (let i = 0; i < 10; i++) K.place(80 + r() * 600, 250 + r() * 270, 8, (px, py) => NSC2.shell(px, py, 1.1), {noclaim:1});
    for (let i = 0; i < 8; i++) K.place(80 + r() * 600, 230 + r() * 280, 8, (px, py) => NSC2.weed(px, py, 1.2), {noclaim:1});
    for (let i = 0; i < 6; i++) K.place(80 + r() * 600, 250 + r() * 260, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (const [x, y, s] of [[120, 250, 1.6], [780, 300, 1.8]]) K.place(x, y, 24, (px, py) => zRock(px, py, s, "#6a7078"));
  },
  cs_mermaid(K){ const r = K.r; K.dress = {veg:.3, edge:{rock:4, reeds:3}, mid:{reeds:5, rock:3}};
    nsPut(K, "reef", [[620, 360, 200]]);
    for (const [x, y, s] of [[110, 230, 1.8], [800, 220, 2], [150, 450, 1.5]]) K.place(x, y, 26, (px, py) => zRock(px, py, s, "#6a7880"));
    for (let i = 0; i < 9; i++) K.place(80 + r() * 740, 240 + r() * 270, 8, (px, py) => NSC2.shell(px, py, 1.2), {noclaim:1});
    for (let i = 0; i < 7; i++) K.place(80 + r() * 740, 240 + r() * 270, 8, (px, py) => NSC2.weed(px, py, 1.1), {noclaim:1});
    K.place(240, 400, 20, (px, py) => Z.boat(px, py, .9, "#5a4a3a")); K.light(540, 250, 80, "#8ad0e0", .35);
  },
  cs_siren(K){ const r = K.r; K.dress = {veg:.2, edge:{rock:5}, mid:{rock:4}};
    nsPut(K, "reef", [[620, 360, 200]]);
    K.place(240, 300, 40, (px, py) => nsMast(px, py, 110, 8, "#d8d0b8"), {cy:20}); K.place(160, 440, 40, (px, py) => nsMast(px, py, 80, -12));
    for (let i = 0; i < 9; i++) K.place(80 + r() * 740, 240 + r() * 270, 8, (px, py) => zSkull(px, py, 1), {noclaim:1});
    for (let i = 0; i < 8; i++) K.place(80 + r() * 740, 240 + r() * 270, 8, (px, py) => zBone(px, py, 1.4, r), {noclaim:1});
    for (const [x, y, s] of [[110, 230, 2], [800, 230, 2.2]]) K.place(x, y, 26, (px, py) => zRock(px, py, s, "#5a6870"));
    K.place(430, 260, 14, (px, py) => Z.boat(px, py, .8, "#3a3a4a", 1), {noclaim:1});
  },
  cs_crab(K){ const r = K.r; K.dress = {veg:.2, edge:{rock:5}, mid:{rock:4}};
    nsPut(K, "crab_holes");
    for (const [x, y, s] of [[110, 240, 2], [790, 260, 2.2], [420, 450, 1.8]]) K.place(x, y, 26, (px, py) => zRock(px, py, s, "#7a6a5a"));
    for (let i = 0; i < 8; i++) K.place(80 + r() * 720, 230 + r() * 280, 8, (px, py) => `<path d="M${px - 10} ${py}q10 -14 20 0q-10 4 -20 0z" fill="#b84a2a"/><path d="M${px - 10} ${py - 2}l-6 -8M${px + 10} ${py - 2}l6 -8" stroke="#b84a2a" stroke-width="2.4" stroke-linecap="round"/>`, {noclaim:1});
    for (let i = 0; i < 9; i++) K.place(80 + r() * 720, 230 + r() * 280, 8, (px, py) => NSC2.shell(px, py, 1.2), {noclaim:1});
    K.place(640, 420, 20, (px, py) => Z.boat(px, py, .9, "#5a4a3a", 1));
  },
  cs_ships(K){ const r = K.r; K.dress = {veg:.2, edge:{rock:5}, mid:{rock:4}};
    nsPut(K, "ship_ribs", [[460, 280, 190]]);
    K.place(180, 260, 40, (px, py) => nsMast(px, py, 110, 10, "#c8c0a8"), {cy:20}); K.place(780, 300, 40, (px, py) => nsMast(px, py, 90, -8));
    K.place(240, 440, 20, (px, py) => Z.barrel(px, py, "#5a4a3a")); K.place(660, 440, 20, (px, py) => Z.crate(px, py, 14, "#5a4a3a")); K.place(700, 460, 14, (px, py) => Z.crate(px, py, 12, "#4a3a2a"));
    for (let i = 0; i < 8; i++) K.place(80 + r() * 740, 240 + r() * 270, 8, (px, py) => zBone(px, py, 1.4, r), {noclaim:1});
    for (let i = 0; i < 6; i++) K.place(80 + r() * 740, 240 + r() * 270, 8, (px, py) => NSC2.weed(px, py, 1.2), {noclaim:1});
  },
  cs_fleet(K){ const r = K.r; K.dress = {veg:.1, edge:{rock:5}, mid:{rock:4}}; K.fog = true; K.fogOp = .16;
    nsPut(K, "ship_ribs", [[460, 280, 190]]); K.light(480, 240, 120, "#6aff9a", .45);
    for (const [x, y, s] of [[190, 230, 1], [760, 250, 1.1]]) K.place(x, y, 40, (px, py) => Z.boat(px, py, s * 1.6, "#2a3a3a") + nsMast(px, py - 4, 120, 4, "#7a9a8a") + zGlow(px, py - 90, 30, "#6aff9a", .5), {noclaim:0});
    for (const [x, y] of [[300, 440], [620, 450], [140, 380], [800, 400]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py, "#6aff9a"), {noclaim:1});
    for (let i = 0; i < 7; i++) K.place(80 + r() * 740, 260 + r() * 250, 8, (px, py) => zSkull(px, py, 1.1), {noclaim:1});
    K.place(430, 450, 14, (px, py) => zSkel(px, py, 1.1, {spear:true}), {noclaim:1});
  },
  cs_kraken(K){ const r = K.r; K.dress = {veg:.1, edge:{rock:5}, mid:{rock:5}}; K.fog = true; K.fogOp = .12;
    nsPut(K, "kraken_pit", [[460, 300, 230]]); K.light(460, 300, 110, "#8a5aff", .5);
    for (const [x, y, s] of [[110, 260, 2.2], [800, 250, 2.4], [160, 450, 1.8], [770, 450, 2]]) K.place(x, y, 26, (px, py) => zRock(px, py, s, "#2a2a3a"));
    for (let i = 0; i < 8; i++) K.place(80 + r() * 740, 380 + r() * 130, 8, (px, py) => zBone(px, py, 1.5, r), {noclaim:1});
    for (const [x, y] of [[250, 400], [660, 410]]) K.place(x, y, 30, (px, py) => nsMast(px, py, 70, 20));
  },

  /* ---------------- ПІСКИ ЗАБУТИХ ЦАРІВ ---------------- */
  sd_oasis(K){ const r = K.r; K.dress = {veg:.1, edge:{dead:3, rock:3}, mid:{rock:3}};
    nsPut(K, "oasis", [[450, 340, 190]]);
    for (const [x, y, c] of [[170, 220, "#c8a868"], [330, 190, "#a88a5a"], [630, 190, "#d8c088"], [780, 250, "#b89860"]]) K.place(x, y, 34, (px, py) => zTent(K, px, py, 70, 52, 46, c), {cy:20});
    K.place(190, 400, 40, (px, py) => Z.stall(px, py, "#b83a22")); K.place(740, 410, 40, (px, py) => Z.stall(px, py, "#2a6a8a"));
    for (const [x, y] of [[130, 300], [820, 330]]) K.place(x, y, 20, (px, py) => nsPalm(px, py, .9));
    K.place(280, 470, 12, (px, py) => Z.barrel(px, py)); K.place(640, 470, 12, (px, py) => Z.sack(px, py));
    K.scatter(4, 8, (x, y) => Z.folk(x, y, K.pk(["#c8a040", "#7a3a26", "#3a6a7a"]), true), {box:[240, 260, 700, 480]});
  },
  sd_dig(K){ const r = K.r; K.dress = {veg:.1, edge:{dead:3, rock:4}, mid:{rock:4}};
    nsPut(K, "dig_site", [[200, 250, 110], [640, 220, 120], [470, 450, 100]]);
    for (const [x, y, c] of [[330, 190, "#c8b888"], [770, 280, "#b8a478"], [110, 360, "#d8cc9c"]]) K.place(x, y, 34, (px, py) => zTent(K, px, py, 66, 50, 44, c), {cy:20});
    K.place(420, 330, 20, (px, py) => Z.cart(px, py, `<path d="M${px - 22} ${py - 26}q18 -14 38 0z" fill="#c8a868"/>`)); K.place(580, 350, 14, (px, py) => Z.crate(px, py, 16)); K.place(600, 370, 14, (px, py) => Z.crate(px, py, 12, "#8a6a3a")); K.place(300, 470, 12, (px, py) => Z.sack(px, py));
    K.place(730, 440, 30, (px, py) => nsPillar(px, py, 70, 14)); K.place(160, 450, 30, (px, py) => nsPillar(px, py, 40, 14));
    K.scatter(4, 8, (x, y) => Z.folk(x, y, K.pk(["#c8a040", "#7a5a3a", "#5a6a7a"]), true), {box:[240, 260, 700, 480]});
  },
  sd_bed(K){ const r = K.r; K.dress = {veg:.1, edge:{dead:4, rock:3}, mid:{rock:3}};
    for (const [x, y] of [[180, 230], [740, 240], [250, 470], [680, 460]]) K.place(x, y, 20, (px, py) => zDead(px, py, 1.4, "#4a3a28"));
    for (let i = 0; i < 6; i++) K.place(100 + r() * 700, 240 + r() * 270, 10, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="${14 + r() * 10}" ry="4" fill="#7a6240" opacity=".55"/><path d="M${px - 12} ${py - 2}l6 3l6 -4l6 4l6 -3" stroke="#5a4426" stroke-width="1.2" fill="none"/>`, {noclaim:1});
    for (let i = 0; i < 8; i++) K.place(80 + r() * 740, 230 + r() * 290, 8, (px, py) => zBone(px, py, 1.4, r), {noclaim:1});
    K.place(420, 420, 14, (px, py) => zSkel(px, py, 1.1, {flip:1}), {noclaim:1}); K.place(560, 270, 30, (px, py) => Z.cart(px, py, "") + `<path d="M${px - 22} ${py + 2}h4" stroke="#2a1e12" stroke-width="3"/>`);
    K.place(130, 360, 20, (px, py) => zRock(px, py, 1.4, "#8a7650")); K.place(800, 380, 20, (px, py) => zRock(px, py, 1.6, "#8a7650"));
  },
  sd_scarab(K){ const r = K.r; K.dress = {veg:.1, edge:{dead:3, rock:4}, mid:{rock:3}};
    nsPut(K, "scarab_mound", [[460, 190, 200]]);
    for (let i = 0; i < 14; i++) K.place(100 + r() * 700, 280 + r() * 240, 8, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="5.4" ry="3.4" fill="#1a2a3a"/><ellipse cx="${px}" cy="${py - 1}" rx="3.4" ry="1.8" fill="#3a8aaa" opacity=".7"/><path d="M${px - 5} ${py}l-3 3M${px + 5} ${py}l3 3" stroke="#0a1a2a" stroke-width="1"/>`, {noclaim:1});
    for (let i = 0; i < 8; i++) K.place(80 + r() * 740, 260 + r() * 260, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (const [x, y] of [[140, 300], [790, 320]]) K.place(x, y, 20, (px, py) => nsPillar(px, py, 60, 14)); K.place(200, 450, 20, (px, py) => zSkull(px, py, 1.3), {noclaim:1});
  },
  sd_temple(K){ const r = K.r; K.dress = {veg:.1, edge:{dead:3, rock:4}, mid:{rock:3}};
    nsPut(K, "jackal_temple", [[470, 200, 230]]); K.light(470, 220, 70, "#ffb040", .35);
    for (const [x, y] of [[300, 330], [620, 330], [220, 420], [720, 420]]) K.place(x, y, 18, (px, py) => nsPillar(px, py, 80, 16));
    for (const [x, y, f] of [[380, 360, 0], [560, 360, 1]]) K.place(x, y, 18, (px, py) => zWolf(px, py, 1.3, f, "#2a2a2e"), {npc:1, noclaim:1});
    for (const [x, y] of [[150, 280], [790, 290]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py, "#ffb040"));
    for (let i = 0; i < 6; i++) K.place(80 + r() * 740, 360 + r() * 160, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
  },
  sd_tomb(K){ const r = K.r; K.dress = {veg:.1, edge:{dead:3, rock:4}, mid:{rock:3}};
    nsPut(K, "tomb_door", [[460, 190, 160]]); K.light(460, 210, 50, "#7aff9a", .3);
    for (const [x, y] of [[250, 330], [660, 330]]) K.place(x, y, 26, (px, py) => nsSarc(px, py)); K.place(450, 420, 26, (px, py) => nsSarc(px, py, "#a89868"));
    for (const [x, y] of [[170, 260], [770, 270]]) K.place(x, y, 18, (px, py) => nsPillar(px, py, 90, 16));
    for (let i = 0; i < 6; i++) K.place(80 + r() * 740, 340 + r() * 170, 8, (px, py) => zSkull(px, py, 1.1), {noclaim:1});
    for (let i = 0; i < 6; i++) K.place(80 + r() * 740, 300 + r() * 210, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
  },
  sd_worm(K){ const r = K.r; K.dress = {veg:.05, edge:{dead:3, rock:5}, mid:{rock:3}};
    nsPut(K, "worm_pit", [[460, 300, 220]]);
    for (const [x, y, s] of [[130, 240, 1.8], [800, 250, 2], [170, 450, 1.5], [770, 450, 1.7]]) K.place(x, y, 26, (px, py) => zRock(px, py, s, "#8a7650"));
    for (let i = 0; i < 9; i++) K.place(80 + r() * 740, 240 + r() * 280, 8, (px, py) => zBone(px, py, 1.5, r), {noclaim:1});
    for (let i = 0; i < 4; i++) K.place(100 + r() * 700, 380 + r() * 120, 8, (px, py) => zSkull(px, py, 1.3), {noclaim:1});
  },
  sd_lamia(K){ const r = K.r; K.dress = {veg:.1, edge:{dead:3, rock:5}, mid:{rock:4}};
    K.place(450, 220, 120, (px, py) => Z.cave(K, px, py, 150, 120, "#7aff9a"), {cy:60}); K.light(450, 200, 80, "#7aff9a", .4);
    for (const [x, y, h] of [[240, 310, 90], [660, 310, 90], [160, 400, 70], [740, 400, 70]]) K.place(x, y, 18, (px, py) => nsPillar(px, py, h, 16, "#a89868"));
    for (const [x, y] of [[360, 380], [550, 390]]) K.place(x, y, 20, (px, py) => `${zSh(px + 6, py + 2, 22, 5, .3)}<path d="M${px - 18} ${py}q8 -24 18 -10q10 14 20 -6q-6 12 -14 14z" fill="#3a7a4a"/><circle cx="${px + 2}" cy="${py - 22}" r="6" fill="#4a8a5a"/>`, {noclaim:1});
    for (let i = 0; i < 6; i++) K.place(80 + r() * 740, 330 + r() * 180, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (let i = 0; i < 4; i++) K.place(100 + r() * 700, 300 + r() * 200, 8, (px, py) => NSC2.cactus(px, py, 1), {noclaim:1});
  },
  sd_sphinx(K){ const r = K.r; K.dress = {veg:.05, edge:{dead:2, rock:4}, mid:{rock:3}};
    nsPut(K, "pyramid", [[470, 170, 250]]); nsPut(K, "sphinx_statue", [[440, 410, 150]]);
    for (const [x, y] of [[200, 330], [740, 330]]) K.place(x, y, 18, (px, py) => `${zSh(px + 6, py + 2, 12, 3, .3)}<path d="M${px - 8} ${py}h16l-4 -110z" fill="#c8a85a"/><path d="M${px} ${py}h8l-4 -110z" fill="#a8884a"/>`);
    for (const [x, y] of [[130, 440], [820, 440]]) K.place(x, y, 18, (px, py) => nsPillar(px, py, 80, 16));
    for (const [x, y] of [[350, 330], [600, 330]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py, "#ffb040"));
    for (let i = 0; i < 6; i++) K.place(80 + r() * 740, 330 + r() * 180, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
  },
  sd_lich(K){ const r = K.r; K.dress = {veg:.05, edge:{dead:4, rock:4}, mid:{rock:4}}; K.fog = true; K.fogOp = .14;
    nsPut(K, "pyramid", [[470, 170, 250]]); K.light(470, 160, 140, "#7aff9a", .5);
    for (const [x, y] of [[250, 360], [670, 360], [160, 440], [760, 440]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py, "#7aff9a"), {npc:1});
    for (const [x, y] of [[180, 300], [760, 300]]) K.place(x, y, 18, (px, py) => nsPillar(px, py, 100, 16, "#8a8a7a"));
    for (const [x, y, f] of [[380, 400, 0], [560, 410, 1], [450, 470, 0]]) K.place(x, y, 14, (px, py) => zSkel(px, py, 1.1, {spear:true, flip:f}), {noclaim:1});
    for (let i = 0; i < 8; i++) K.place(80 + r() * 740, 330 + r() * 180, 8, (px, py) => zSkull(px, py, 1.1), {noclaim:1});
    K.place(450, 340, 30, (px, py) => nsSarc(px, py, "#6a7a6a"), {npc:1});
  },
});
