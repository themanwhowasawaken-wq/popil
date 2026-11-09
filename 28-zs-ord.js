/* ============ сцени: Землі Світанку й Ночі ============ */
const ORD = {dawn:["#ece2c8", "#c9a24a"], night:["#3a2a4a", "#c0a6e0"]};
function zWagon(K, x, y, col = "#e8dcc0"){ return Z.cart(x, y, "") + `<path d="M${x - 26} ${y - 26}q22 -40 44 0z" fill="${col}"/><path d="M${x - 4} ${y - 46}q22 -2 22 20h-22z" fill="${shade(col, .72)}"/><path d="M${x - 18} ${y - 34}q14 -22 28 0M${x - 10} ${y - 40}q8 -6 16 0" stroke="${shade(col, .6)}" stroke-width="1.4" fill="none"/>`; }
function zKnight(x, y, s = 1, side = "dawn", o = {}){ const [c, c2] = ORD[side], k = o.flip ? -1 : 1, steel = o.ghost ? "#c8e0e8" : "#8a9094";
  let g = `<g transform="translate(${zr(x)} ${zr(y)}) scale(${zr(k * s)} ${zr(s)})"${o.ghost ? ' opacity=".55"' : ""}>${zSh(4, 1, 12, 3, .3)}`;
  g += `<path d="M-6 0l1 -14h10l1 14h-4l-1 -9h-2l-1 9z" fill="${shade(steel, .7)}"/><path d="M-8 -14l1 -16h14l1 16z" fill="${steel}"/><path d="M-6 -30l-1 16h6v-16z" fill="${c}"/><path d="M2 -30v16h6l-1 -16z" fill="${shade(c, .7)}"/>`;
  g += `<rect x="-5" y="-40" width="10" height="11" rx="3" fill="${steel}"/><path d="M-4 -35h8" stroke="#1a1612" stroke-width="1.4"/><path d="M0 -40q2 -6 6 -8" stroke="${c2}" stroke-width="2" fill="none"/>`;
  g += `<path d="M9 2l2 -46" stroke="#4a3a2a" stroke-width="1.8"/><path d="M10 -44l1.4 -8l1.6 8z" fill="#c8ccd0"/><path d="M-12 -28q-4 8 0 16q6 -2 6 -8q0 -6 -6 -8z" fill="${c}" stroke="${c2}" stroke-width="1"/></g>`;
  return g; }
function zSunAltar(K, x, y){ K.light(x, y - 50, 70, "#ffe08a", .8); return zSh(x + 10, y + 3, 30, 6, .3) + `<path d="M${x - 24} ${y}l4 -12h40l4 12z" fill="#cfc6ae"/><path d="M${x - 10} ${y - 12}v-26h20v26z" fill="#e2dac4"/><path d="M${x + 4} ${y - 12}v-26h6v26z" fill="#b8b09a"/><circle cx="${x}" cy="${y - 54}" r="14" fill="#f0c040"/>` + [...Array(12)].map((_, i) => `<path d="M${zr(x + Math.cos(i * .52) * 17)} ${zr(y - 54 + Math.sin(i * .52) * 17)}l${zr(Math.cos(i * .52) * 8)} ${zr(Math.sin(i * .52) * 8)}" stroke="#f0c040" stroke-width="2.4"/>`).join(""); }
function zSwords(K, x, y){ return zSh(x + 14, y + 3, 40, 7, .32) + `<path d="M${x - 34} ${y}l6 -16h56l6 16z" fill="#8a867a"/><path d="M${x - 28} ${y - 16}l4 -14h48l4 14z" fill="#a8a498"/><path d="M${x + 28} ${y - 16}l6 16h-8z" fill="#5a5650"/>` + `<path d="M${x - 30} ${y - 120}L${x + 8} ${y - 34}" stroke="#d8dce0" stroke-width="7" stroke-linecap="round"/><path d="M${x + 30} ${y - 120}L${x - 8} ${y - 34}" stroke="#b8bcc0" stroke-width="7" stroke-linecap="round"/><path d="M${x - 36} ${y - 100}l18 -8M${x + 36} ${y - 100}l-18 -8" stroke="#c9a24a" stroke-width="5" stroke-linecap="round"/><circle cx="${x - 33}" cy="${y - 126}" r="4.4" fill="#c9a24a"/><circle cx="${x + 33}" cy="${y - 126}" r="4.4" fill="#c9a24a"/>`; }
function zHelmet(x, y, rust){ const c = rust ? "#7a4a2a" : "#8a9094"; return `<path d="M${x - 7} ${y}v-6a7 7 0 0 1 14 0v6z" fill="${c}"/><path d="M${x - 5} ${y - 4}h10" stroke="#1a1612" stroke-width="1.4"/><ellipse cx="${x}" cy="${y + 1}" rx="10" ry="2.4" fill="none" stroke="#c8a8a0" stroke-width="1" opacity=".5"/>`; }
function zOrdPalisade(K, col, spikes){ let pl = ""; for (let x = -10; x < 920; x += 13){ if (K.exits.some(([ex, ey]) => Math.abs(ex - x) < 46 && ey < 160)) continue; pl += `<path d="M${x} 116v-${spikes ? 60 : 54}l6.5 -${spikes ? 16 : 10} 6.5 ${spikes ? 16 : 10}v${spikes ? 60 : 54}z" fill="${x % 26 ? col : shade(col, .82)}"/>`; } return `<rect x="0" y="108" width="${ZW}" height="12" fill="#000" opacity=".25" filter="url(#zb1)"/>` + pl; }

Object.assign(ZS, {
  or_cross(K){ const r = K.r; K.dress = {veg:.5, edge:{oak:4, dead:3}, mid:{rock:3}};
    K.place(450, 300, 40, (px, py) => zSwords(K, px, py), {path:1, npc:1});
    K.place(330, 180, 60, (px, py) => zPavilion(K, px, py, 50, 86, "#ece2c8", "#3a2a4a", {flag:"#c9a24a"}), {cy:40});
    K.place(640, 224, 44, (px, py) => zWagon(K, px, py) + Z.barrel(px - 44, py + 2) + Z.crate(px + 40, py + 4), {cy:20});
    zAny(K, [[180, 300], [760, 330], [200, 440]], 50, (px, py) => zTent(K, px, py, 76, 58, 56, "#e8e2d2") + `<rect x="${px - 8}" y="${py - 44}" width="16" height="16" fill="#f2ead6"/><path d="M${px} ${py - 42}v12M${px - 6} ${py - 36}h12" stroke="#4a8a4a" stroke-width="3.4"/>`, {cy:30});
    K.place(560, 360, 14, (px, py) => Z.sign(px, py)); K.place(300, 400, 20, (px, py) => Z.well(px, py));
    for (const [x, y, sd] of [[220, 200, "dawn"], [700, 190, "night"], [180, 470, "night"], [740, 470, "dawn"]]) K.place(x, y, 12, (px, py) => Z.banner(px, py, 76, ORD[sd][0], sd === "dawn" ? "#c9a24a" : "#c0a6e0", {sun:sd === "dawn", moon:sd === "night"}));
    for (let i = 0; i < 6; i++) K.place(250 + r() * 400, 260 + r() * 210, 10, (px, py) => zKnight(px, py, .85, r() < .5 ? "dawn" : "night", {flip:r() < .5}), {path:1, noclaim:1});
  },
  or_dawn(K){ const r = K.r; K.dress = {veg:.4, edge:{oak:4}, mid:{}};
    K.put(116, zOrdPalisade(K, "#8a6a3a"));
    K.put(194, zPavilion(K, 450, 192, 60, 104, "#f2ead6", "#c9a24a", {flag:"#c9a24a"})); K.claim(450, 150, 72);
    for (const [x, y] of [[240, 210], [660, 200], [760, 290], [170, 320], [720, 460], [220, 460]]) K.place(x, y, 38, (px, py) => zTent(K, px, py, 60, 48, 48, "#ece4cc", {stripe:"#c9a24a"}), {cy:20});
    K.place(330, 330, 30, (px, py) => zSunAltar(K, px, py), {npc:1});
    for (let i = 0; i < 4; i++) K.place(300 + i * 26, 390, 8, (px, py) => zSh(px + 3, py + 1, 7, 2, .25) + `<path d="M${px - 5} ${py}h10l-1 -9h-8z" fill="#ece2c8"/><circle cx="${px}" cy="${py - 12}" r="3.4" fill="#e0b890"/>`, {noclaim:1});
    for (const [x, y] of [[330, 150], [570, 150]]) K.place(x, y, 10, (px, py) => Z.banner(px, py, 76, "#ece2c8", "#c9a24a", {sun:true}), {npc:1});
    for (let i = 0; i < 5; i++) K.place(250 + r() * 400, 280 + r() * 200, 10, (px, py) => zKnight(px, py, .9, "dawn", {flip:r() < .5}), {path:1, noclaim:1});
  },
  or_night(K){ const r = K.r; K.dress = {veg:.4, edge:{dead:5}, mid:{rock:2}}; K.c.mood = "dusk";
    K.put(116, zOrdPalisade(K, "#2e2a2e", true));
    K.put(194, zPavilion(K, 450, 192, 60, 104, "#2e2238", "#5a4a7a", {flag:"#c0a6e0"}) + `<path d="M454 150a12 12 0 1 0 0 22a9 9 0 1 1 0 -22z" fill="#c0a6e0"/>`); K.claim(450, 150, 72);
    for (const [x, y] of [[240, 210], [660, 200], [760, 290], [170, 320], [720, 460], [220, 460]]) K.place(x, y, 38, (px, py) => zTent(K, px, py, 60, 48, 48, "#3a2a4a", {stripe:"#6a5a8a"}), {cy:20});
    for (const [x, y] of [[330, 300], [570, 300], [300, 430], [600, 430]]) K.place(x, y, 14, (px, py) => zBrazier(K, px, py, "#b080ff"), {npc:1});
    for (const [x, y] of [[330, 150], [570, 150]]) K.place(x, y, 10, (px, py) => Z.banner(px, py, 76, "#3a2a4a", "#c0a6e0", {moon:true}), {npc:1});
    for (let i = 0; i < 5; i++) K.place(250 + r() * 400, 280 + r() * 200, 10, (px, py) => zKnight(px, py, .9, "night", {flip:r() < .5}), {path:1, noclaim:1});
  },
  or_field(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6, oak:2}, mid:{rock:4}};
    for (let i = 0; i < 7; i++) K.place(120 + r() * 660, 180 + r() * 320, 30, (px, py) => zCrater(px, py, 1 + r() * .5));
    zAny(K, [[300, 230], [620, 220], [200, 330], [700, 330], [300, 440]], 50, (px, py) => `<g transform="scale(2.6) translate(${px / 2.6 - px} ${py / 2.6 - py})">` + msCatapult(px, py) + `</g>`, {cy:30});
    for (let i = 0; i < 8; i++) K.place(120 + r() * 660, 200 + r() * 300, 20, (px, py) => Z.stakes(px - 20, py, 4 + (r() * 3 | 0), "#3a2a1a"));
    for (let i = 0; i < 10; i++) K.place(150 + r() * 600, 220 + r() * 280, 10, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="9" ry="4" fill="${K.pk([ORD.dawn[0], ORD.night[0], "#7a6a50"])}"/><circle cx="${px}" cy="${py}" r="2" fill="#c8b070"/>`, {noclaim:1});
    for (let i = 0; i < 5; i++) K.place(150 + r() * 600, 220 + r() * 280, 20, (px, py) => `<g transform="rotate(${-70 + r() * 30} ${px} ${py})">${Z.banner(px, py, 56, r() < .5 ? ORD.dawn[0] : ORD.night[0], "#c9a24a", {torn:true})}</g>`);
    for (let i = 0; i < 10; i++) K.top += Z.crow(100 + r() * 700, 40 + r() * 80, 1.1);
  },
  or_sun(K){ const r = K.r; K.dress = {veg:.4, edge:{oak:5}, mid:{}};
    for (let i = 0; i < 240; i++){ const x = 20 + r() * 860, y = 130 + r() * 400; if (K.free(x, y, 6, {npc:1, claim:1})) K.put(y, Z.sunflower(x, y, .8 + r() * .35)); }
    K.place(700, 220, 40, (px, py) => zTower(K, px, py, 18, 90, {wall:"#8a6a44", roof:"#5a3a24", flat:true}) + Z.banner(px + 30, py + 4, 70, "#ece2c8", "#c9a24a", {sun:true}), {cy:40});
    K.place(300, 300, 14, (px, py) => zSh(px + 6, py + 2, 10, 3, .3) + `<path d="M${px} ${py}v-46M${px - 18} ${py - 32}h36" stroke="#5a4028" stroke-width="3"/><path d="M${px - 8} ${py - 10}l2 -22h12l2 22z" fill="#7a3a26"/><circle cx="${px}" cy="${py - 38}" r="7" fill="#d8bc70"/><path d="M${px - 10} ${py - 40}h20l-10 -8z" fill="#4a3424"/>`);
  },
  or_banners(K){ const r = K.r; K.dress = {veg:.5, edge:{oak:3, dead:3}, mid:{rock:3}};
    K.put(250, zHill(450, 250, 330, 130, "#6a6a44")); K.claim(450, 190, 220);
    for (let i = 0; i < 13; i++){ const a = (i / 12 - .5) * 2.2, x = 450 + Math.sin(a) * 220, y = 150 + (1 - Math.cos(a)) * 90 + (i % 2) * 8, sd = i % 2 ? "night" : "dawn"; K.put(y, Z.banner(x, y, 70 + (i % 3) * 10, ORD[sd][0], ORD[sd][1], {sun:sd === "dawn", moon:sd === "night"})); }
    K.put(140, zCairn(450, 140, 1.4));
    for (let i = 0; i < 6; i++) K.place(150 + r() * 600, 330 + r() * 180, 20, (px, py) => Z.stakes(px - 14, py, 3, "#3a2a1a"));
  },
  or_moat(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6}, mid:{rock:3}};
    K.under += `<path d="${zPathD(Z_RIVER)}" stroke="#6a1a14" stroke-width="96" fill="none" opacity=".62"/><path d="${zPathD(Z_RIVER)}" stroke="#c84a3a" stroke-width="2" fill="none" stroke-dasharray="20 40" opacity=".5" transform="translate(-22 0)"/>`;
    for (let i = 0; i < 12; i++){ const y = 80 + r() * 440, x = zRiverX(y) + (r() * 2 - 1) * 32; K.put(y, zHelmet(x, y, r() < .6)); }
    for (const side of [-1, 1]) for (let y = 100; y < 520; y += 46){ const x = zRiverX(y) + side * 76; if (K.free(x, y, 14, {npc:1})) K.put(y, Z.stakes(x - 16, y, 4, "#3a2a1a")); }
    for (let i = 0; i < 8; i++) K.place(150 + r() * 600, 260 + r() * 240, 8, (px, py) => zBone(px, py, 1.3, r), {noclaim:1});
    for (let i = 0; i < 8; i++) K.top += Z.crow(100 + r() * 700, 40 + r() * 80, 1.1);
  },
  or_cathedral(K){ const r = K.r; K.dress = {veg:.7, edge:{dead:6, oak:3}, mid:{rock:6}};
    K.put(222, zGothic(K, 470, 220, 220, 150, 110, {wall:"#cfc2a0", ruin:true, gh:80, lit:"#ffe08a"}) + zTower(K, 300, 226, 36, 190, {wall:"#cfc2a0", flat:true})); K.claim(450, 140, 140); K.light(470, 150, 120, "#ffe08a", .4);
    K.place(650, 300, 34, (px, py) => Z.stair(K, px, py, 56, "#ffe08a"), {path:1, npc:1});
    for (const [x, y] of [[200, 330], [740, 360]]) K.place(x, y, 20, (px, py) => zSh(px + 8, py + 2, 14, 4, .3) + `<rect x="${px - 12}" y="${py - 12}" width="24" height="12" fill="#a8a088"/><path d="M${px - 6} ${py - 12}l-2 -26q6 -10 12 0l-2 26z" fill="#d8ceb4"/><circle cx="${px}" cy="${py - 44}" r="5" fill="#d8ceb4"/>`);
    for (let i = 0; i < 14; i++) K.place(120 + r() * 680, 250 + r() * 260, 14, (px, py) => zRock(px, py, .5 + r() * .5, "#b8ad90"));
  },
  or_grave(K){ const r = K.r; K.dress = {veg:.8, edge:{dead:9}, mid:{rock:3}}; K.c.mood = "dusk"; K.fog = true; K.fogOp = .12;
    K.put(210, zSh(470, 214, 260, 20, .35) + `<path d="M210 212Q330 140 470 136Q610 140 730 212z" fill="#4a3e30"/><path d="M470 136Q610 140 730 212H480z" fill="#3a3026"/>`); K.claim(470, 170, 200);
    for (let i = 0; i < 22; i++){ const t = i / 21, x = 250 + t * 440 + (r() * 2 - 1) * 8, y = 196 - Math.sin(t * 3.14) * 50 + (i % 2) * 10; K.put(y, i % 3 === 0 ? `<path d="M${zr(x)} ${zr(y)}v-34" stroke="#c8ccd0" stroke-width="3.4"/><path d="M${zr(x - 8)} ${zr(y - 26)}h16" stroke="#c9a24a" stroke-width="3.4"/>` : Z.cross(x, y, .9, i % 2 ? "#5a4a38" : "#4a3e30")); }
    K.place(720, 300, 20, (px, py) => zSh(px + 8, py + 2, 16, 4, .3) + `<path d="M${px - 14} ${py}v-42l14 -10l14 10v42z" fill="#9a968a"/><path d="M${px + 14} ${py}v-42l6 3v39z" fill="#6a665a"/>`);
    for (let i = 0; i < 14; i++){ const x = 260 + r() * 420, y = 220 + r() * 40; K.top += `<rect x="${zr(x - 1.5)}" y="${zr(y - 8)}" width="3" height="8" fill="#efe6cc"/>`; K.light(x, y - 10, 12, "#ffc860", .7); }
  },
  or_lists(K){ const r = K.r; K.dress = {veg:.4, edge:{oak:3, dead:3}, mid:{rock:2}};
    K.put(206, zTribune(K, 300, 206, 180, "#ece2c8", "#c9a24a") + zTribune(K, 620, 206, 180, "#3a2a4a", "#6a5a8a")); K.claim(460, 170, 200);
    K.place(140, 300, 50, (px, py) => zPavilion(K, px, py, 44, 80, "#f2ead6", "#c9a24a", {flag:"#c9a24a"}), {cy:30}); K.place(780, 300, 50, (px, py) => zPavilion(K, px, py, 44, 80, "#2e2238", "#5a4a7a", {flag:"#c0a6e0"}), {cy:30});
    K.under += `<path d="M150 400H760" stroke="#000" stroke-width="10" opacity=".2" filter="url(#zb1)"/>`; K.put(398, `<path d="M150 398H760" stroke="#6a4a2a" stroke-width="6"/><path d="M150 386H760" stroke="#8a6a44" stroke-width="6"/>` + [...Array(19)].map((_, i) => `<path d="M${150 + i * 34} 398v-16" stroke="#5a4028" stroke-width="3"/><path d="M${150 + i * 34} 386h17" stroke="${i % 2 ? "#3a2a4a" : "#ece2c8"}" stroke-width="6"/>`).join(""));
    for (let i = 0; i < 6; i++) K.place(160 + i * 120, 470, 10, (px, py) => Z.banner(px, py, 70, i % 2 ? ORD.night[0] : ORD.dawn[0], i % 2 ? "#c0a6e0" : "#c9a24a", {sun:i % 2 === 0, moon:i % 2 === 1}), {noclaim:1});
  },
  or_keep(K){ const r = K.r; K.dress = {veg:.8, noLine:true, edge:{dead:8}, mid:{rock:4}}; K.c.mood = "dark";
    K.put(206, zWall(K, -20, 212, 920, 202, 150, {wall:"#2e2a34", gate:.5, gw:90, portcullis:true}) + zTower(K, 160, 216, 46, 220, {wall:"#2e2a34", roof:"#16121a", win:"#ff3a3a", rh:90}) + zTower(K, 750, 210, 46, 220, {wall:"#2e2a34", roof:"#16121a", win:"#ff3a3a", rh:90}) + zKeep(K, 455, 60, 150, 50, 50, {wall:"#26222c", win:"#ff3a3a", flag:"#3a2a4a"}));
    K.claim(450, 140, 400); K.light(455, 160, 90, "#ff3a3a", .5);
    for (let i = 0; i < 12; i++){ const x = 90 + i * 66 + (r() * 2 - 1) * 10; if (Math.abs(x - 455) < 70) continue; K.put(240, Z.stakes(x, 240, 2, "#2a2420")); }
    for (const x of [300, 610]) K.put(214, Z.banner(x, 214, 90, "#3a2a4a", "#c0a6e0", {moon:true, bh:56}));
    for (let i = 0; i < 9; i++) K.top += Z.crow(150 + r() * 600, 30 + r() * 50, 1.2);
  },
});
function zTribune(K, x, y, w, c, c2){ let s = zSh(x + 20, y + 4, w * .6, 8, .3);
  for (let k = 0; k < 4; k++){ const yy = y - k * 12, xx = x + k * 4; s += `<path d="M${xx - w / 2} ${yy}h${w}l10 -7h-${w}z" fill="#9a7a50"/><rect x="${xx - w / 2}" y="${yy}" width="${w}" height="12" fill="#6a4a2a"/>`; for (let i = 0; i < w / 14; i++){ const sx = xx - w / 2 + 7 + i * 14; s += `<circle cx="${sx}" cy="${yy - 4}" r="4" fill="#e8dfc8"/><path d="M${sx - 3} ${yy + 4}v-4h6v4" fill="#e8dfc8"/>`; } }
  s += `<path d="M${x - w / 2} ${y}v-80M${x + w / 2 + 14} ${y - 10}v-74" stroke="#4a3424" stroke-width="4"/>`;
  for (let i = 0; i < 8; i++) s += `<path d="M${x - w / 2 + i * w / 8} ${y - 82 - i}h${w / 8 + 2}v10l-${w / 16} 6l-${w / 16} -6z" fill="${i % 2 ? c2 : c}"/>`;
  return s; }
