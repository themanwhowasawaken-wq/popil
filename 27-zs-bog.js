/* ============ сцени: Чорна Трясовина ============ */
function zBogWater(x, y, rx, ry){ return `<ellipse cx="${zr(x + 4)}" cy="${zr(y + 4)}" rx="${zr(rx + 10)}" ry="${zr(ry + 6)}" fill="#141a12" opacity=".7" filter="url(#zb1)"/><ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(rx)}" ry="${zr(ry)}" fill="url(#zwd)"/><path d="M${zr(x - rx * .6)} ${zr(y - ry * .3)}q${zr(rx * .4)} -4 ${zr(rx * .8)} 0M${zr(x - rx * .2)} ${zr(y + ry * .3)}q${zr(rx * .3)} -3 ${zr(rx * .6)} 0" stroke="#7a9aa8" stroke-width="1.4" fill="none" opacity=".4"/>`; }
function zStilts(K, x, y, w, h, d, o = {}){ let s = ""; for (const ox of [-w * .42, -w * .14, w * .14, w * .42]) s += `<path d="M${zr(x + ox)} ${zr(y + 22)}v-24" stroke="#2e2014" stroke-width="5"/><ellipse cx="${zr(x + ox)}" cy="${zr(y + 22)}" rx="7" ry="2" fill="none" stroke="#8ab0c0" stroke-width="1" opacity=".5"/>`; return s + zLog(K, x, y, w, h, d, Object.assign({wall:"#6a5a44", roof:"#3a3a28"}, o)); }
function zChickenHut(K, x, y){ let s = zSh(x + 20, y + 4, 50, 8, .35);
  const leg = (lx, k) => `<path d="M${lx} ${y}l${k * 6} -26l${-k * 4} -26" stroke="#c8a040" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${lx - 12} ${y}l12 -4l12 4M${lx} ${y - 4}v6" stroke="#c8a040" stroke-width="4" stroke-linecap="round"/>`;
  s += leg(x - 22, 1) + leg(x + 22, -1);
  s += `<g transform="rotate(-5 ${x} ${y - 52})">${zLog(K, x, y - 52, 92, 46, 50, {wall:"#5a4a36", roof:"#2a2a1a", win:true, lit:true})}</g>`;
  return s; }
function zFrogman(x, y, s = 1, flip){ const k = flip ? -1 : 1; return `<g transform="translate(${zr(x)} ${zr(y)}) scale(${zr(k * s)} ${zr(s)})">${zSh(4, 1, 12, 3, .3)}<path d="M-8 0q-2 -10 2 -16q-6 -8 0 -16q8 -6 14 0q4 8 -2 16q4 6 2 16h-4l-2 -10h-4l-2 10z" fill="#4a6a3a"/><path d="M0 -16q4 8 2 16h-2l-1 -10z" fill="#3a5a2a"/><circle cx="-2" cy="-30" r="2.6" fill="#e8e070"/><circle cx="4" cy="-30" r="2.6" fill="#e8e070"/><circle cx="-2" cy="-30" r="1" fill="#141210"/><circle cx="4" cy="-30" r="1" fill="#141210"/><path d="M8 -20l10 -14" stroke="#4a3a2a" stroke-width="2"/><path d="M17 -36l2 -6l1 6z" fill="#9aa4a8"/></g>`; }
function zDrowned(x, y, s = 1){ return `<g opacity=".6">${zSh(x + 4, y + 1, 9, 2, .25)}<path d="M${zr(x - 6 * s)} ${zr(y)}q-2 -16 2 -26h8q4 10 2 26z" fill="#9ab8b8"/><circle cx="${zr(x)}" cy="${zr(y - 30 * s)}" r="${zr(5 * s)}" fill="#b8d0d0"/><path d="M${zr(x - 5 * s)} ${zr(y - 32 * s)}q5 10 10 0" stroke="#5a7a7a" stroke-width="2" fill="none"/></g>`; }
function zPeatGolem(K, x, y, s = 1){ K.light(x, y - 50 * s, 30 * s, "#ff7a2a", .5); return zSh(x + 10 * s, y + 3, 30 * s, 6 * s, .35) + `<path d="M${zr(x - 24 * s)} ${zr(y)}l4 -40l-10 -10l16 -24h28l16 24l-10 10l4 40h-12l-4 -24h-16l-4 24z" fill="#3a2a1e"/><path d="M${zr(x + 2 * s)} ${zr(y - 74 * s)}h12l16 24l-10 10l4 40h-12l-4 -24h-6z" fill="#2a1e14"/><path d="M${zr(x - 10 * s)} ${zr(y - 40 * s)}l8 -10l6 14M${zr(x + 6 * s)} ${zr(y - 24 * s)}l6 -8" stroke="#ff7a2a" stroke-width="2" fill="none" opacity=".8"/><circle cx="${zr(x - 4 * s)}" cy="${zr(y - 62 * s)}" r="2.6" fill="#ffb84a"/><circle cx="${zr(x + 8 * s)}" cy="${zr(y - 62 * s)}" r="2.6" fill="#ffb84a"/>`; }
function zRoots(K, x, y, R, n = 7){ const r = K.r; let s = ""; for (let i = 0; i < n; i++){ const a = Math.PI * (1.05 + i / (n - 1) * .9), bx = x + Math.cos(a) * R * 1.4, by = y + Math.sin(a) * R * .5, h = 40 + r() * 50;
    s += `<path d="M${zr(bx)} ${zr(y + 10)}q${zr((x - bx) * .2)} -${zr(h)} ${zr((x - bx) * .5)} -${zr(h * .8)}q${zr((x - bx) * .2)} ${zr(h * .3)} ${zr((x - bx) * .3)} ${zr(h * .9)}" stroke="#2a1e14" stroke-width="${zr(8 + r() * 6)}" fill="none" stroke-linecap="round"/><path d="M${zr(bx)} ${zr(y + 10)}q${zr((x - bx) * .2)} -${zr(h)} ${zr((x - bx) * .5)} -${zr(h * .8)}" stroke="#4a3626" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(-2 -1)"/>`; }
  return s; }
function zHydra(x, y, s, dir, c = "#2e4a34"){ const k = dir;
  return `<path d="M${zr(x)} ${zr(y)}q${zr(-20 * s * k)} ${zr(-60 * s)} ${zr(16 * s * k)} ${zr(-100 * s)}q${zr(30 * s * k)} ${zr(-24 * s)} ${zr(46 * s * k)} ${zr(-6 * s)}" stroke="${shade(c, .65)}" stroke-width="${zr(20 * s)}" fill="none" stroke-linecap="round"/><path d="M${zr(x - 3 * s)} ${zr(y)}q${zr(-20 * s * k)} ${zr(-60 * s)} ${zr(16 * s * k)} ${zr(-100 * s)}q${zr(30 * s * k)} ${zr(-24 * s)} ${zr(46 * s * k)} ${zr(-6 * s)}" stroke="${c}" stroke-width="${zr(13 * s)}" fill="none" stroke-linecap="round"/>` +
    `<path d="M${zr(x + 56 * s * k)} ${zr(y - 108 * s)}l${zr(22 * s * k)} ${zr(6 * s)}l${zr(-22 * s * k)} ${zr(10 * s)}z" fill="${shade(c, .8)}"/><path d="M${zr(x + 60 * s * k)} ${zr(y - 100 * s)}l${zr(16 * s * k)} ${zr(-1 * s)}" stroke="#e8dfc8" stroke-width="${zr(2 * s)}" stroke-dasharray="2 2"/><circle cx="${zr(x + 58 * s * k)}" cy="${zr(y - 110 * s)}" r="${zr(3 * s)}" fill="#ffd040"/>` +
    `<ellipse cx="${zr(x)}" cy="${zr(y + 2)}" rx="${zr(18 * s)}" ry="${zr(5 * s)}" fill="none" stroke="#9ab8c0" stroke-width="1.6" opacity=".55"/>`; }
function zLily(x, y){ return `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="7" ry="2.6" fill="#3a6a3a"/><circle cx="${zr(x + 2)}" cy="${zr(y - 1)}" r="1.8" fill="#f2f0e8"/>`; }
function zNet(x, y){ return zSh(x + 8, y + 2, 26, 4, .25) + `<path d="M${x - 26} ${y}v-40M${x + 26} ${y}v-40M${x - 28} ${y - 38}h56" stroke="#4a3424" stroke-width="2.6"/><path d="M${x - 24} ${y - 38}q24 30 48 0" fill="none" stroke="#9a9a8a" stroke-width="1"/>` + [...Array(6)].map((_, i) => `<path d="M${x - 22 + i * 9} ${y - 38}v${20 - Math.abs(i - 2.5) * 4}" stroke="#9a9a8a" stroke-width=".8"/>`).join(""); }
function zFishRack(x, y){ return zSh(x + 8, y + 2, 26, 4, .25) + `<path d="M${x - 24} ${y}v-36M${x + 24} ${y}v-36M${x - 26} ${y - 34}h52" stroke="#4a3424" stroke-width="2.6"/>` + [...Array(6)].map((_, i) => `<path d="M${x - 20 + i * 8} ${y - 34}v6" stroke="#4a3424" stroke-width="1"/><path d="M${x - 22 + i * 8} ${y - 28}l2 12l2 -12z" fill="${["#b8c0c0", "#a8a898", "#c8c0a8"][i % 3]}"/>`).join(""); }

Object.assign(ZS, {
  bg_gat(K){ const r = K.r; K.dress = {veg:1, edge:{willow:3, dead:8}, mid:{reeds:12, bush:2}, pools:8}; K.fog = true; K.fogOp = .22; K.fogCol = "#d8e2d8";
    for (const P of K.paths) for (let i = 8; i < P.pts.length - 4; i += 11){ const [x, y] = P.pts[i], [x2, y2] = P.pts[i + 1], a = Math.atan2(y2 - y, x2 - x), off = P.w / 2 + 10, cx = x - Math.sin(a) * off, cy = y + Math.cos(a) * off; if (K.free(cx, cy, 6, {npc:1})) K.put(cy, Z.lamp(K, cx, cy, "#c8ff9a")); }
    K.place(250, 230, 30, (px, py) => Z.logs(px, py)); K.place(640, 420, 30, (px, py) => Z.logs(px, py));
    K.place(700, 230, 16, (px, py) => zSh(px + 6, py + 2, 12, 3, .3) + `<path d="M${px - 7} ${py}v-46l7 -6l7 6v46z" fill="#5a4a34"/><path d="M${px} ${py - 52}l7 6v46h-7z" fill="#3a2e20"/><circle cx="${px - 3}" cy="${py - 38}" r="1.8" fill="#c8ff9a"/><circle cx="${px + 3}" cy="${py - 38}" r="1.8" fill="#c8ff9a"/>` + zGlow(px, py - 38, 12, "#c8ff9a", .5));
  },
  bg_village(K){ const r = K.r; K.dress = {veg:.6, edge:{willow:3, dead:5}, mid:{reeds:10}, noPools:true};
    K.under += zBogWater(450, 300, 470, 190);
    const H = []; const add = (x, y, w, o = {}) => { const p = K.place(x, y, w * .55, (px, py) => zStilts(K, px, py, w, 40, 46, o), {cy:24, wet:1}); if (p) H.push(p); };
    add(290, 180, 96, {sign:"#4a6a3a", signIc:"#e8c860", chimney:true}); add(150, 300, 80); add(720, 340, 84); add(180, 460, 78); add(760, 470, 80);
    // човнярня Гордія
    K.place(640, 214, 56, (px, py) => [-40, -14, 14, 40].map(ox => `<path d="M${px + ox} ${py + 20}v-22" stroke="#2e2014" stroke-width="5"/>`).join("") + zShed(K, px, py, 110, 46, 50, {wall:"#5a4a36", roof:"#3a3a28", inner:Z.boat(px, py - 4, .8, "#6a4a2a")}), {cy:24, wet:1});
    for (let i = 0; i < H.length - 1; i++) K.under += zBoardwalk([[H[i][0] + 20, H[i][1] + 10], [H[i + 1][0] - 20, H[i + 1][1] + 10]], 14);
    K.place(420, 420, 30, (px, py) => Z.boat(px, py, 1, "#5a3e26"), {wet:1}); K.place(560, 400, 26, (px, py) => zNet(px, py), {wet:1});
    for (let i = 0; i < 8; i++){ const x = 150 + r() * 600, y = 250 + r() * 220; if (K.free(x, y, 6, {wet:1})) K.under += zLily(x, y); }
    K.place(470, 470, 20, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="26" ry="6" fill="#0d1414" opacity=".6"/><circle cx="${px - 6}" cy="${py - 2}" r="2" fill="#ffe08a"/><circle cx="${px + 4}" cy="${py - 2}" r="2" fill="#ffe08a"/>`, {wet:1, path:1});
  },
  bg_camp(K){ const r = K.r; K.dress = {veg:.6, edge:{willow:4, oak:3}, mid:{reeds:8}, pools:4};
    K.under += `<ellipse cx="450" cy="300" rx="380" ry="170" fill="#4a5a34" opacity=".45" filter="url(#zb1)"/>`;
    K.place(420, 190, 50, (px, py) => zLog(K, px, py, 90, 40, 48, {wall:"#6a5a40", roof:"#3a4a2a", sign:"#4a6a3a", signIc:"#e8f0c0", chimney:true}) + [0, 1, 2, 3, 4].map(i => `<path d="M${px - 40 + i * 9} ${py - 42}l3 9l3 -9z" fill="${["#6a8a3a", "#8a7a3a", "#5a7a4a"][i % 3]}"/>`).join("") + zSmoke(px + 14, py - 70, .7), {cy:26});
    K.place(560, 300, 30, (px, py) => Z.fire(K, px, py) + `<path d="M${px - 16} ${py - 10}l16 -26l16 26" stroke="#2a2420" stroke-width="2.4" fill="none"/><path d="M${px - 10} ${py - 22}a10 8 0 0 0 20 0z" fill="#22201c"/>` + zSmoke(px, py - 36, .6, "#e8f0e8"), {npc:1});
    for (const [x, y] of [[220, 250], [700, 240]]) K.place(x, y, 30, (px, py) => zFishRack(px, py));
    for (const [x, y, f] of [[160, 420, 0], [720, 430, 1]]) K.place(x, y, 34, (px, py) => Z.boat(px, py, 1, "#5a3e26", f));
    K.place(320, 420, 26, (px, py) => zNet(px, py)); K.scatter(4, 10, (x, y) => Z.barrel(x, y, "#5a4028"), {box:[200, 280, 700, 480]});
    K.scatter(3, 8, (x, y) => Z.folk(x, y, K.pk(["#4a5a3a", "#5a4a3a"])), {box:[260, 280, 680, 460]});
  },
  bg_reeds(K){ const r = K.r; K.dress = {veg:.8, edge:{willow:2, dead:3}, mid:{reeds:30}, pools:9};
    for (let i = 0; i < 40; i++) K.place(40 + r() * 820, 110 + r() * 410, 8, (px, py) => zReeds(px, py, 1.4 + r() * .6, r), {noclaim:1});
    K.place(460, 430, 30, (px, py) => Z.boat(px, py, .9, "#4a3a2a"), {path:1});
  },
  bg_peat(K){ const r = K.r; K.dress = {veg:.6, edge:{dead:8}, mid:{rock:2, reeds:4}, noPools:true}; K.c.mood = "dusk";
    K.under += `<rect x="0" y="100" width="${ZW}" height="${ZH}" fill="#2a1e14" opacity=".35"/>`;
    for (const [x, y] of [[200, 220], [700, 220], [260, 420], [660, 430], [450, 180]]) K.place(x, y, 50, (px, py) => `<g transform="translate(${px} ${py}) skewX(-20)"><rect x="-60" y="-16" width="120" height="32" fill="#120c08"/><rect x="-60" y="-16" width="120" height="6" fill="#4a3424"/>` + `<path d="M-40 6l20 -6l14 8M10 2l18 -6l14 6" stroke="#ff6a2a" stroke-width="1.6" fill="none" opacity=".7"/></g>` + zSmoke(px, py - 10, 1.2, "#7a7268"), {path:0});
    for (let i = 0; i < 6; i++) K.place(150 + r() * 600, 260 + r() * 240, 14, (px, py) => zSh(px + 6, py + 2, 16, 4, .3) + [0, 1, 2, 3].map(k => `<rect x="${px - 14 + k * 1.6}" y="${py - 8 - k * 8}" width="${28 - k * 3.2}" height="8" fill="${shade("#4a3420", 1 + k * .08)}" stroke="#241810" stroke-width=".8"/>`).join(""));
    K.place(320, 330, 30, (px, py) => Z.cart(px, py, `<path d="M${px - 22} ${py - 26}h36" stroke="#4a3420" stroke-width="8"/>`));
  },
  bg_willows(K){ const r = K.r; K.dress = {veg:.6, edge:{dead:6}, mid:{reeds:10}, pools:7, fg:"willow"}; K.fog = true; K.fogOp = .14;
    for (const [x, y, s] of [[200, 220, 2], [700, 230, 2.2], [460, 180, 1.7], [160, 440, 1.8], [760, 450, 1.9]]) K.place(x, y, 50 * s / 2, (px, py) => zRoots(K, px, py, 40 * s / 2, 5) + zWillow(px, py, s, "#4e6a3a") + zBone(px + 30, py + 10, 1.2, r) + zSkull(px - 26, py + 8, .8), {cy:50});
    for (let i = 0; i < 18; i++) K.glow += zGlow(80 + r() * 740, 110 + r() * 380, 6, "#e8ff8a", .8);
  },
  bg_coven(K){ const r = K.r; K.dress = {veg:.8, edge:{dead:10}, mid:{reeds:6}, pools:5}; K.c.mood = "dark"; K.fog = true; K.fogCol = "#9aff8a"; K.fogOp = .08;
    K.place(450, 200, 60, (px, py) => zChickenHut(K, px, py), {cy:60, npc:1});
    K.place(600, 320, 30, (px, py) => Z.cauldron(K, px, py) + zSmoke(px, py - 30, 1, "#9aff8a"), {npc:1});
    for (let i = 0; i < 8; i++){ const a = Math.PI * (.1 + i / 7 * .8), x = 450 + Math.cos(a) * 300, y = 250 + Math.sin(a) * 140; K.place(x, y, 8, (px, py) => Z.skullPole(px, py)); }
  },
  bg_sunk(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6, willow:2}, mid:{reeds:6}, noPools:true}; K.fog = true; K.fogOp = .16;
    K.under += zBogWater(450, 300, 470, 200);
    for (const [x, y, w] of [[180, 220, 90], [700, 220, 96], [160, 430, 84], [740, 440, 90], [330, 160, 80]]) K.place(x, y, 40, (px, py) => { const D = [w * .3, -w * .24], rh = w * .42; return `<polygon points="${zPoly([[px - w / 2, py], [px, py - rh], [px + D[0], py - rh + D[1]], [px - w / 2 + D[0], py + D[1]]])}" fill="${shade("#5a4e36", .55)}"/><polygon points="${zPoly([[px - w / 2 - 4, py], [px + w / 2 + 4, py], [px, py - rh]])}" fill="#6a5a3e"/><polygon points="${zPoly([[px + w / 2 + 4, py], [px + w / 2 + D[0], py + D[1]], [px + D[0], py - rh + D[1]], [px, py - rh]])}" fill="${shade("#6a5a3e", .7)}"/><ellipse cx="${px + 6}" cy="${py + 2}" rx="${w * .7}" ry="5" fill="none" stroke="#8ab0c0" stroke-width="1.2" opacity=".5"/>`; }, {wet:1, cy:10});
    K.place(560, 170, 20, (px, py) => `<path d="M${px - 12} ${py}l12 -70l12 70z" fill="#4a4a3e"/><path d="M${px} ${py - 70}l12 70h-5z" fill="#2e2e26"/><path d="M${px} ${py - 70}v-14M${px - 6} ${py - 78}h12" stroke="#8a8270" stroke-width="2.4"/><ellipse cx="${px}" cy="${py + 2}" rx="20" ry="4" fill="none" stroke="#8ab0c0" stroke-width="1.2" opacity=".6"/>`, {wet:1});
  },
  bg_midges(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6}, mid:{reeds:8}, pools:4};
    K.place(560, 200, 70, (px, py) => zBogWater(px, py, 150, 50) + `<ellipse cx="${px}" cy="${py - 4}" rx="70" ry="22" fill="#3a4a2a"/><ellipse cx="${px - 4}" cy="${py - 8}" rx="56" ry="15" fill="#4a5a32"/>` + zDead(px - 6, py - 4, 2.2) + zBone(px + 30, py - 4, 1.4, r) + zSkull(px + 20, py - 2, 1), {cy:20});
    let m = ""; for (let i = 0; i < 360; i++){ const a = r() * 6.283, d = Math.pow(r(), .6) * 90; m += `<circle cx="${zr(554 + Math.cos(a) * d * 1.4)}" cy="${zr(110 + Math.sin(a) * d * .5)}" r="${zr(.9 + r() * .8)}" fill="#14140e"/>`; }
    K.top += `<ellipse cx="554" cy="110" rx="130" ry="46" fill="#14140e" opacity=".16" filter="url(#zb2)"/>` + m;
    K.place(250, 400, 40, (px, py) => [0, 1, 2, 3, 4, 5].map(i => zBone(px - 30 + i * 12, py - (i % 2) * 4, 1.6, r)).join("") + zSkull(px + 40, py, 1.3));
  },
  bg_abbey(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6, willow:2}, mid:{reeds:8}, noPools:true}; K.fog = true; K.fogOp = .12;
    K.under += zBogWater(470, 230, 420, 120);
    K.put(210, zGothic(K, 450, 208, 160, 100, 80, {wall:"#7a7a68", ruin:true, gh:56}) + `<rect x="360" y="196" width="190" height="16" fill="#1d2e30" opacity=".85"/>`); K.claim(450, 150, 100);
    K.put(214, zTower(K, 680, 220, 30, 130, {wall:"#7a7a68", flat:true}) + `<rect x="668" y="110" width="24" height="24" fill="#1a1612"/>` + zBell(680, 130, 1, "#7a6a3a") + `<ellipse cx="684" cy="222" rx="40" ry="6" fill="none" stroke="#8ab0c0" stroke-width="1.4" opacity=".6"/>`);
    K.place(300, 300, 30, (px, py) => Z.stair(K, px, py, 50, "#8ad8ff"), {path:1, npc:1});
    for (let i = 0; i < 10; i++){ const x = 150 + r() * 600, y = 190 + r() * 90; K.under += zLily(x, y); }
  },
  bg_lair(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:8}, mid:{reeds:4}, noPools:true}; K.c.mood = "dark";
    K.under += zBogWater(470, 230, 300, 90) + `<ellipse cx="470" cy="230" rx="240" ry="66" fill="#0a1010" opacity=".6"/>`;
    K.put(150, zRoots(K, 470, 200, 260, 9)); K.claim(470, 200, 220);
    K.put(232, zHydra(380, 240, 1, -1) + zHydra(470, 250, 1.25, 1) + zHydra(570, 236, 1, 1));
    for (let i = 0; i < 12; i++) K.place(150 + r() * 600, 300 + r() * 200, 10, (px, py) => zBone(px, py, 1.4, r), {noclaim:1});
    for (let i = 0; i < 3; i++) K.place(200 + r() * 500, 320 + r() * 160, 10, (px, py) => zSkull(px, py, 1.1), {noclaim:1});
  },
  bg_eye(K){ const r = K.r; K.dress = {veg:.6, edge:{dead:8}, mid:{reeds:4}, noPools:true}; K.c.mood = "dark";
    K.under += `<ellipse cx="540" cy="250" rx="308" ry="126" fill="#05070a"/><ellipse cx="540" cy="250" rx="250" ry="100" fill="none" stroke="#a06aff" stroke-width="3" opacity=".7"/><ellipse cx="540" cy="250" rx="110" ry="46" fill="#1a0e2a"/><ellipse cx="540" cy="250" rx="40" ry="18" fill="#05070a"/><ellipse cx="520" cy="240" rx="12" ry="4" fill="#e8dcff" opacity=".5"/>`;
    K.glow += zGlow(540, 250, 220, "#a06aff", .3);
    for (let i = 0; i < 10; i++){ const a = i / 10 * 6.283 + .2, x = 540 + Math.cos(a) * 350, y = 260 + Math.sin(a) * 160; K.place(x, y, 12, (px, py) => Z.menhir(px, py, 54 + r() * 18, "#5a5a54"), {wet:0}); }
  },
});
