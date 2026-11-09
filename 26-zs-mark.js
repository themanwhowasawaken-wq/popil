/* ============ сцени: Кістяна Марка ============ */
function zSkull(x, y, s = 1){ return `<circle cx="${zr(x)}" cy="${zr(y - 6 * s)}" r="${zr(6 * s)}" fill="#e8dfc8"/><rect x="${zr(x - 3.4 * s)}" y="${zr(y - 2 * s)}" width="${zr(6.8 * s)}" height="${zr(4 * s)}" fill="#e8dfc8"/><circle cx="${zr(x - 2.2 * s)}" cy="${zr(y - 6.6 * s)}" r="${zr(1.7 * s)}" fill="#1a1612"/><circle cx="${zr(x + 2.2 * s)}" cy="${zr(y - 6.6 * s)}" r="${zr(1.7 * s)}" fill="#1a1612"/><path d="M${zr(x + 1 * s)} ${zr(y - 12 * s)}a6 6 0 0 1 ${zr(5 * s)} ${zr(6 * s)}" stroke="#b8ae96" stroke-width="${zr(1.4 * s)}" fill="none"/>`; }
function zSkel(x, y, s = 1, o = {}){ const c = "#e8dfc8", k = o.flip ? -1 : 1;
  return zSh(x + 6 * s, y + 1, 12 * s, 3 * s, .3) + `<g transform="translate(${zr(x)} ${zr(y)}) scale(${zr(k * s)} ${zr(s)})"><path d="M-5 0l3 -18M5 0l-2 -18M0 -18v-16M-9 -22l6 -10M9 -24l-5 -8" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M-6 -30h12M-5 -26h10M-4 -22h8" stroke="${c}" stroke-width="1.6"/><circle cx="0" cy="-40" r="5.4" fill="${c}"/><circle cx="-2" cy="-40.6" r="1.4" fill="#1a1612"/><circle cx="2" cy="-40.6" r="1.4" fill="#1a1612"/>${o.spear ? `<path d="M10 4l4 -54" stroke="#4a3a2a" stroke-width="2"/><path d="M13 -50l1.4 -8l1.6 8z" fill="#9aa4a8"/>` : ""}${o.shield ? `<ellipse cx="-9" cy="-20" rx="6" ry="9" fill="#5a4a38"/><circle cx="-9" cy="-20" r="2" fill="#9a8a6a"/>` : ""}</g>`; }
function zBell(x, y, s = 1, c = "#b08a3a"){ return `<path d="M${zr(x - 8 * s)} ${zr(y)}q0 -16 ${zr(8 * s)} -${zr(16 * s)}q${zr(8 * s)} 0 ${zr(8 * s)} ${zr(16 * s)}l${zr(2 * s)} ${zr(2 * s)}h-${zr(20 * s)}z" fill="${c}"/><path d="M${zr(x)} ${zr(y - 16 * s)}q${zr(8 * s)} 0 ${zr(8 * s)} ${zr(16 * s)}l${zr(2 * s)} ${zr(2 * s)}h-${zr(10 * s)}z" fill="${shade(c, .65)}"/><circle cx="${zr(x)}" cy="${zr(y + 3 * s)}" r="${zr(2 * s)}" fill="${shade(c, .5)}"/>`; }
function zNoose(x, y, L = 30){ return `<path d="M${x} ${y}v${L}" stroke="#8a7a5a" stroke-width="1.6"/><ellipse cx="${x}" cy="${y + L + 5}" rx="3.6" ry="5" fill="none" stroke="#8a7a5a" stroke-width="1.6"/>`; }
function zBoneDog(x, y, s = 1, flip){ return zWolf(x, y, s, flip, "#d8cfb8").replace(/#ffd040/, "#ff3a3a"); }
function zCrossRows(K, x0, y0, cols, rows, dx, dy, s = 1){ const r = K.r; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++){ const x = x0 + i * dx + (j % 2) * dx * .5 + (r() * 2 - 1) * 4, y = y0 + j * dy + (r() * 2 - 1) * 4; if (!K.free(x, y, 8, {npc:1, exit:0})) continue; K.put(y, Z.cross(x, y, s * (.8 + r() * .3), K.pk(["#4a3e30", "#5a4a38", "#3a3026"]))); } }

Object.assign(ZS, {
  mk_fort(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6}, mid:{rock:3}};
    let pl = ""; for (let x = -10; x < 920; x += 13){ if (K.exits.some(([ex, ey]) => Math.abs(ex - x) < 46 && ey < 160)) continue; pl += `<path d="M${x} 116v-56l6.5 -10 6.5 10v56z" fill="${x % 26 ? "#5a4a36" : "#4a3c2c"}"/>`; } K.put(116, `<rect x="0" y="108" width="${ZW}" height="12" fill="#000" opacity=".25" filter="url(#zb1)"/>` + pl);
    // вартова вежа з дзвоном
    K.place(780, 200, 40, (px, py) => zTower(K, px, py, 26, 150, {wall:"#6a5a42", roof:"#3a2e24", rh:50}) + `<rect x="${px - 14}" y="${py - 138}" width="28" height="22" fill="#1a1612"/>` + zBell(px, py - 120, 1), {cy:60});
    K.place(330, 180, 56, (px, py) => zLog(K, px, py, 116, 50, 54, {wall:"#7a6450", roof:"#3a302a", sign:"#3a4a6a", signIc:"#e8c860", chimney:true}) + Z.banner(px - 80, py + 4, 76, "#3a4a6a", "#e8dfc8"), {cy:30});
    K.place(610, 222, 50, (px, py) => zHouse(K, px, py, 96, 50, 50, {wall:"#8a8070", roof:"#2e2a26", timber:"#3a2a1a", sign:"#5a4a3a", signIc:"#c0c0c0", chimney:true}) + Z.anvil(px - 66, py + 14), {cy:30}); K.light(610, 210, 50, "#ff7a2a", .4);
    for (const [x, y] of [[300, 330], [600, 340]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py), {npc:1});
    K.place(180, 420, 22, (px, py) => Z.rack(px, py)); for (const [x, y] of [[700, 420], [740, 450]]) K.place(x, y, 12, (px, py) => Z.dummy(px, py));
    K.place(160, 280, 48, (px, py) => zLog(K, px, py, 84, 42, 48, {wall:"#7a6450", roof:"#3a302a"}), {cy:30});
    K.scatter(5, 8, (x, y) => Z.folk(x, y, K.pk(["#5a5a62", "#3a4a6a", "#4a3a2a"])), {box:[220, 260, 700, 480]});
  },
  mk_bell(K){ const r = K.r; K.dress = {veg:.4, edge:{dead:5}, mid:{rock:2}};
    K.put(112, zWall(K, -20, 118, 920, 108, 46, {wall:"#b8ae96"}));
    K.put(196, zGothic(K, 450, 194, 160, 96, 80, {wall:"#cfc6ae", gh:60, lit:"#ffd27a"})); K.claim(450, 140, 100);
    // дзвіниця з видимими дзвонами
    zAny(K, [[700, 214], [760, 240], [640, 210], [200, 250], [760, 440]], 46, (px, py) => zKeep(K, px, py, 54, 150, 30, {wall:"#cfc6ae"}) + `<rect x="${px - 22}" y="${py - 146}" width="44" height="34" fill="#1a1612"/>` + zBell(px - 10, py - 120, 1.1) + zBell(px + 12, py - 122, .9) + `<path d="M${px - 30} ${py - 150}L${px} ${py - 200}L${px + 30} ${py - 150}z" fill="#4a4038"/><path d="M${px} ${py - 200}L${px + 30} ${py - 150}L${px + 45} ${py - 162}z" fill="#2e2824"/><path d="M${px} ${py - 200}v-12M${px - 5} ${py - 207}h10" stroke="#c9a24a" stroke-width="2"/>`, {cy:80});
    zAny(K, [[190, 230], [160, 300], [720, 300]], 50, (px, py) => zHouse(K, px, py, 110, 46, 50, {wall:"#cfc6ae", roof:"#4a4038", archWin:true}), {cy:30});
    K.place(240, 420, 40, (px, py) => Z.fence([[px - 60, py - 20], [px + 60, py - 26]]) + [0, 1, 2, 3].map(i => `<rect x="${px - 54 + i * 28}" y="${py - 14 - i}" width="22" height="12" fill="#5a6a30"/><path d="M${px - 52 + i * 28} ${py - 8 - i}h18" stroke="#3a4a1e" stroke-width="2" stroke-dasharray="2 2"/>`).join(""));
    K.place(660, 420, 20, (px, py) => Z.well(px, py));
    for (let i = 0; i < 8; i++) K.place(150 + r() * 600, 280 + r() * 220, 10, (px, py) => Z.cross(px, py, .8, "#5a4a38"));
    K.scatter(3, 8, (x, y) => Z.folk(x, y, "#3a3430", true), {box:[260, 280, 680, 460]});
  },
  mk_road(K){ const r = K.r; K.dress = {veg:.6, edge:{dead:8}, mid:{rock:4}};
    for (const P of K.paths) for (let i = 6; i < P.pts.length - 4; i += 5){ const [x, y] = P.pts[i], [x2, y2] = P.pts[i + 1], a = Math.atan2(y2 - y, x2 - x), sd = (i / 5) % 2 ? 1 : -1, off = P.w / 2 + 16, cx = x - Math.sin(a) * off * sd, cy = y + Math.cos(a) * off * sd; if (K.free(cx, cy, 8, {npc:1})) K.put(cy, Z.cross(cx, cy, 1 + r() * .3, K.pk(["#4a3e30", "#5a4a38"]))); }
    K.place(250, 220, 26, (px, py) => zSh(px + 10, py + 2, 18, 4, .3) + `<rect x="${px - 3}" y="${py - 50}" width="6" height="50" fill="#5a4a38"/><path d="M${px - 18} ${py - 54}l18 -14l18 14z" fill="#3a3028"/><rect x="${px - 14}" y="${py - 54}" width="28" height="22" fill="#4a3e32"/>` + Z.cross(px, py - 34, .5, "#d8c890") + zGlow(px, py - 42, 18, "#ffc860", .6));
    K.place(640, 220, 36, (px, py) => Z.gallows(px, py) + `<path d="M${px + 26} ${py - 60}h12v26h-12z" fill="none" stroke="#2a2420" stroke-width="2"/><path d="M${px + 30} ${py - 60}v26M${px + 34} ${py - 60}v26" stroke="#2a2420" stroke-width="1.2"/>`);
    for (let i = 0; i < 8; i++) K.place(150 + r() * 600, 260 + r() * 240, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (let i = 0; i < 10; i++) K.top += Z.crow(100 + r() * 700, 40 + r() * 80, 1.1);
  },
  mk_field(K){ const r = K.r; K.dress = {veg:.4, edge:{dead:6}, mid:{rock:2}};
    zCrossRows(K, 40, 140, 16, 7, 56, 54, 1);
    for (let i = 0; i < 10; i++) K.place(150 + r() * 600, 220 + r() * 280, 10, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="18" ry="6" fill="#3a3226" opacity=".7"/>` + zBone(px - 4, py - 2, 1.2, r), {noclaim:1});
    K.place(420, 260, 10, (px, py) => `<ellipse cx="${px}" cy="${py + 2}" rx="18" ry="5" fill="#2a2218" opacity=".7"/><path d="M${px - 2} ${py}l-2 -12M${px - 4} ${py - 12}l-4 -6M${px - 4} ${py - 12}l-1 -8M${px - 4} ${py - 12}l3 -7" stroke="#e8dfc8" stroke-width="2.2" stroke-linecap="round"/>` + zSkull(px + 10, py + 2, .8), {path:1});
    for (let i = 0; i < 14; i++) K.top += Z.crow(80 + r() * 740, 30 + r() * 90, 1.1);
  },
  mk_village(K){ const r = K.r; K.dress = {veg:.7, edge:{dead:9}, mid:{rock:3, dead:2}}; K.fog = true; K.fogOp = .1;
    for (const [x, y, w] of [[160, 200, 86], [720, 200, 90], [180, 460, 82], [700, 470, 86], [430, 170, 80]]) K.place(x, y, 50, (px, py) => zHouse(K, px, py, w, 46, 50, {wall:"#6a6458", roof:"#2e2a26", lit:false, timber:"#2a221a"}) + `<path d="M${px - w / 2 + 10} ${py - 60}l${w * .4} -16l${w * .3} 18z" fill="#1a1612"/><path d="M${px - w / 2} ${py - 30}h${w * .3}" stroke="#1a1612" stroke-width="5" opacity=".4"/>`, {cy:30});
    K.place(320, 330, 20, (px, py) => Z.well(px, py));
    for (let i = 0; i < 4; i++) K.place(150 + r() * 600, 250 + r() * 250, 30, (px, py) => Z.fence([[px - 30, py], [px + 20, py - 6]], "#3a3026"));
    for (let i = 0; i < 8; i++) K.top += Z.crow(100 + r() * 700, 40 + r() * 70, 1.1);
  },
  mk_barrow(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6}, mid:{rock:3}};
    K.put(210, zSh(470, 214, 300, 24, .35) + `<path d="M170 212Q260 96 450 92Q650 96 760 212z" fill="#5a5a44"/><path d="M450 92Q650 96 760 212H470z" fill="#46462f"/><path d="M220 180q90 -60 220 -76" stroke="#6e6e54" stroke-width="4" fill="none"/><path d="M420 212v-50h60v50z" fill="#7a766a"/><path d="M410 162h80v-10h-80z" fill="#9a968a"/><path d="M432 212v-40h36v40z" fill="#0d0b09"/>`); K.claim(460, 150, 150); K.light(450, 196, 30, "#9aff9a", .3);
    for (let i = 0; i < 9; i++){ const a = Math.PI * (1.05 + i / 8 * .9), x = 465 + Math.cos(a) * 380, y = 250 + Math.sin(a) * -1 * 0 + (i % 2) * 20 + 30 * Math.abs(Math.sin(a)); K.place(x, y + 40, 14, (px, py) => Z.menhir(px, py, 56 + r() * 20, "#8a867a")); }
    for (const [x, f] of [[404, 0], [496, 1]]) K.put(214, zSkel(x, 214, 1.05, {spear:true, shield:true, flip:f}));
    K.place(200, 340, 12, (px, py) => Z.banner(px, py, 80, "#5a4a3a", "#c8b890", {torn:true})); K.place(720, 350, 12, (px, py) => Z.banner(px, py, 70, "#5a4a3a", "#c8b890", {torn:true}));
    for (let i = 0; i < 8; i++) K.place(150 + r() * 600, 280 + r() * 220, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
  },
  mk_mill(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6}, mid:{rock:3}};
    zAny(K, [[320, 210], [260, 240], [400, 200], [200, 300], [400, 440]], 70, (px, py) => zWindmill(K, px, py, 1.15, {wall:"#4a443a", roof:"#2a2622", sail:"#efe6cc", frame:"#d8ccb0"}), {cy:60});
    K.place(170, 250, 46, (px, py) => zHouse(K, px, py, 80, 42, 46, {wall:"#5a544a", roof:"#2a2622", lit:false}), {cy:26});
    for (const [x, y] of [[440, 260], [250, 400], [480, 430]]) K.place(x, y, 30, (px, py) => zSh(px + 8, py + 2, 34, 6, .3) + `<path d="M${px - 32} ${py}q32 -26 64 0z" fill="#d8cfb8"/>` + [0, 1, 2, 3, 4].map(i => zBone(px - 22 + i * 11, py - 6 - (i % 2) * 6, 1, r)).join("") + zSkull(px + 4, py - 14, .9));
    for (let i = 0; i < 6; i++) K.place(380 + i * 18, 300 + (i % 2) * 8, 8, (px, py) => Z.sack(px, py).replace(/#cdbb92/g, "#efe8d6"), {noclaim:1});
  },
  mk_ossuary(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:7}, mid:{rock:3}}; K.c.mood = "dusk";
    K.put(200, zGothic(K, 450, 198, 150, 92, 80, {wall:"#cfc6ae", gh:56}) + zTower(K, 340, 202, 20, 120, {wall:"#cfc6ae", roof:"#3a3430"}) + [...Array(9)].map((_, i) => zSkull(390 + i * 15, 124, .8)).join("") + [...Array(6)].map((_, i) => zSkull(395 + i * 22, 168, .7)).join("")); K.claim(450, 140, 100);
    K.place(620, 280, 34, (px, py) => Z.stair(K, px, py, 54, "#ff5a6a"), {path:1, npc:1});
    for (let i = 0; i < 10; i++) K.place(150 + r() * 600, 270 + r() * 230, 10, (px, py) => Z.cross(px, py, .9, "#4a3e30"));
    for (let i = 0; i < 6; i++) K.place(150 + r() * 600, 270 + r() * 230, 8, (px, py) => zSkull(px, py, .9), {noclaim:1});
  },
  mk_bridge(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:7}, mid:{rock:3}}; K.fog = true; K.fogOp = .12;
    // зашморги вздовж ріки й шибениці на берегах
    for (const y of [150, 420]){ const xl = zRiverX(y) - 80, xr = zRiverX(y) + 80; for (const x of [xl, xr]) if (K.free(x, y, 26, {npc:1})){ K.put(y, Z.gallows(x - 14, y) + zNoose(x + 20, y - 60, 22)); K.claim(x, y, 26); } }
    for (let i = 0; i < 10; i++){ const y = 100 + r() * 400, x = zRiverX(y) + (r() < .5 ? -1 : 1) * 64; if (K.free(x, y, 8, {npc:1})) K.put(y, Z.lamp(K, x, y, "#ff9a5a")); i += 2; }
    for (let i = 0; i < 12; i++) K.top += Z.crow(100 + r() * 700, 40 + r() * 80, 1.1);
    for (let i = 0; i < 6; i++) K.place(150 + r() * 600, 270 + r() * 230, 10, (px, py) => Z.cross(px, py, .9, "#4a3e30"));
  },
  mk_crows(K){ const r = K.r; K.dress = {veg:1, edge:{dead:12}, mid:{dead:3, rock:4}}; K.c.mood = "dark";
    K.put(220, zTower(K, 450, 222, 46, 200, {wall:"#3a3440", roof:"#1a1620", win:"#ff3a6a", rh:90, door:true})); K.claim(450, 150, 70); K.light(450, 60, 90, "#ff3a6a", .35);
    for (let i = 0; i < 40; i++){ const a = r() * 6.283, d = 40 + r() * 160; K.top += Z.crow(450 + Math.cos(a) * d * 1.4, 70 + Math.sin(a) * d * .35, .9 + r() * .5); }
    for (let i = 0; i < 10; i++) K.place(150 + r() * 600, 270 + r() * 230, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (let i = 0; i < 5; i++) K.place(150 + r() * 600, 270 + r() * 230, 10, (px, py) => zSkull(px, py, 1), {noclaim:1});
  },
  mk_wall(K){ const r = K.r; K.dress = {veg:.4, noLine:true, edge:{dead:5}, mid:{rock:4}};
    K.put(180, zWall(K, -20, 186, 380, 176, 110, {wall:"#a89e86", bones:true}) + zWall(K, 520, 176, 920, 186, 110, {wall:"#a89e86", bones:true, ruin:true, seed:3}));
    K.put(186, zKeep(K, 450, 190, 120, 150, 50, {wall:"#a89e86", gate:true})); K.claim(450, 120, 90);
    for (const x of [120, 760]) K.put(190, zTower(K, x, 194, 30, 140, {wall:"#a89e86", flat:true}));
    for (const x of [60, 180, 260, 340, 600, 680]) K.top += zSkull(x, 74 + (x % 3) * 2, 1.1);
    for (const x of [90, 220, 320, 600, 700, 840]) K.top += `<g transform="translate(0 0)">${zSkel(x, 78 - (x % 3), .7, {spear:true, flip:x > 450})}</g>`;
    for (let i = 0; i < 10; i++) K.place(150 + r() * 600, 260 + r() * 240, 14, (px, py) => zRock(px, py, .5 + r() * .5, "#a89e86"));
  },
  mk_throne(K){ const r = K.r; K.dress = {veg:.8, noLine:true, edge:{dead:8}, mid:{rock:4}}; K.c.mood = "dark";
    K.put(200, zWall(K, 130, 204, 770, 198, 120, {wall:"#2e2a30", gate:.5, gw:70, portcullis:true, bones:true}) + zTower(K, 120, 210, 42, 210, {wall:"#d8cfb8", roof:"#16141a", win:"#ff3a3a", rh:90}) + zTower(K, 780, 206, 42, 210, {wall:"#d8cfb8", roof:"#16141a", win:"#ff3a3a", rh:90}) + zKeep(K, 455, 92, 130, 46, 40, {wall:"#2e2a34", win:"#ff3a3a"}));
    K.put(204, [0, 1, 2, 3, 4, 5].map(i => `<path d="M${300 + i * 10} 210q-${30 - i * 3} -${70 - i * 6} 0 -${120 - i * 10}" stroke="#e8dfc8" stroke-width="5" fill="none"/><path d="M${600 - i * 10} 210q${30 - i * 3} -${70 - i * 6} 0 -${120 - i * 10}" stroke="#e8dfc8" stroke-width="5" fill="none"/>`).join("") + [...Array(7)].map((_, i) => zSkull(400 + i * 18, 108, 1)).join(""));
    K.claim(450, 140, 300); K.light(455, 170, 80, "#ff3a3a", .5);
    K.place(455, 280, 30, (px, py) => Z.stair(K, px, py, 54, "#ff3a3a"), {path:1, npc:1});
    for (const [x, f] of [[392, 0], [518, 1]]) K.put(206, zSkel(x, 206, 1.1, {spear:true, shield:true, flip:f}));
    for (let i = 0; i < 9; i++) K.top += Z.crow(150 + r() * 600, 40 + r() * 60, 1.2);
  },
});
