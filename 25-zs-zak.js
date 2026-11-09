/* ============ сцени: Закарпаття ============ */
// поставити велику річ у перше вільне з кількох місць
function zAny(K, cands, rad, fn, o = {}){ for (const [x, y] of cands){ const p = K.place(x, y, rad, fn, o); if (p) return p; } return null; }
// пагорб з освітленим західним боком
function zHill(x, y, w, h, col = "#5a7a3a"){ const id = "zh" + (++Z_GID);
  return zSh(x + w * .2, y + 4, w * 1.05, h * .14, .3) + `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="${shade(col, 1.2)}"/><stop offset=".5" stop-color="${col}"/><stop offset="1" stop-color="${shade(col, .62)}"/></linearGradient></defs><path d="M${zr(x - w)} ${zr(y)}Q${zr(x - w * .55)} ${zr(y - h * 1.08)} ${zr(x)} ${zr(y - h)}Q${zr(x + w * .55)} ${zr(y - h * 1.02)} ${zr(x + w)} ${zr(y)}z" fill="url(#${id})"/>`; }
// зрубна хата: дерев'яні вінці під високим гонтовим дахом
function zLog(K, x, y, w, h, d, o = {}){
  const s = zHouse(K, x, y, w, h, d, Object.assign({wall:"#8a6440", roof:"#3e3226", rh:w * .42 + d * .25}, o)); let l = "";
  for (let yy = y - h + 5; yy < y - 2; yy += 5.5) l += `M${zr(x - w / 2)} ${zr(yy)}h${w}`;
  return s + `<path d="${l}" stroke="#3e2a18" stroke-width="1.1" opacity=".42"/>`;
}
// дерев'яна церква з ярусними верхами
function zWoodChurch(K, x, y, s = 1, o = {}){
  const wd = o.wall || "#7a5a3a", rf = o.roof || "#3a2e24"; let g = zCast(x - 70 * s, x + 70 * s, y, 70 * s, 40 * s, .32);
  const block = (cx, by, w, h) => `<rect x="${zr(cx - w / 2)}" y="${zr(by - h)}" width="${zr(w / 2)}" height="${zr(h)}" fill="${wd}"/><rect x="${zr(cx)}" y="${zr(by - h)}" width="${zr(w / 2)}" height="${zr(h)}" fill="${shade(wd, .66)}"/>` + `<path d="${[...Array(Math.floor(h / 5))].map((_, i) => `M${zr(cx - w / 2)} ${zr(by - h + 4 + i * 5)}h${zr(w)}`).join("")}" stroke="#3e2a18" stroke-width=".8" opacity=".4"/>`;
  const skirt = (cx, by, w, h) => `<polygon points="${zPoly([[cx - w / 2, by], [cx, by - h], [cx, by + 2]])}" fill="${shade(rf, 1.18)}"/><polygon points="${zPoly([[cx + w / 2, by], [cx, by - h], [cx, by + 2]])}" fill="${shade(rf, .7)}"/><path d="M${zr(cx - w / 2)} ${zr(by)}H${zr(cx + w / 2)}" stroke="${shade(rf, .55)}" stroke-width="2"/>`;
  const tower = (cx, by, w, h, tiers) => { let t = block(cx, by, w, h), yy = by - h, ww = w * 1.5;
    for (let i = 0; i < tiers; i++){ t += skirt(cx, yy, ww, ww * .38); yy -= ww * .28; const bw = ww * .42, bh = ww * .22; t += block(cx, yy, bw, bh); yy -= bh; ww *= .66; }
    t += `<polygon points="${zPoly([[cx - ww * .5, yy], [cx, yy - ww * .9], [cx, yy + 1]])}" fill="${shade(rf, 1.18)}"/><polygon points="${zPoly([[cx + ww * .5, yy], [cx, yy - ww * .9], [cx, yy + 1]])}" fill="${shade(rf, .7)}"/><path d="M${zr(cx)} ${zr(yy - ww * .9)}v-${zr(12 * s)}M${zr(cx - 5 * s)} ${zr(yy - ww * .9 - 8 * s)}h${zr(10 * s)}" stroke="#d9c070" stroke-width="${zr(1.8 * s)}"/>`; return t; };
  g += tower(x - 44 * s, y, 40 * s, 34 * s, 1) + tower(x + 42 * s, y, 40 * s, 34 * s, 1) + tower(x, y + 2, 54 * s, 46 * s, 2);
  g += `<path d="M${zr(x - 8 * s)} ${zr(y + 2)}v-${zr(22 * s)}a${zr(8 * s)} ${zr(8 * s)} 0 0 1 ${zr(16 * s)} 0v${zr(22 * s)}z" fill="#2a1a10"/>`;
  return g;
}
// мурована церква з банями
function zOnionChurch(K, x, y, s = 1, dome = "#3a8a5a", wall = "#f2ead6"){
  let g = zHouse(K, x, y, 110 * s, 62 * s, 56 * s, {wall, roof:shade(dome, .8), gable:"front", archWin:true, nodoor:false, rh:40 * s});
  for (const [ox, h, R] of [[-62, 96, 13], [62, 96, 13]]){ const tx = x + ox * s; g += zTower(K, tx, y + 2, 15 * s, h * s, {wall, flat:true}) + zDome(tx, y - h * s - 4 * s, R * s, dome, {cross:true}); }
  g += zDome(x + 14 * s, y - 102 * s, 20 * s, dome, {cross:true});
  return g;
}
function zVines(K, x, y, rows, len, dx = 34, dy = 22){ let s = "";
  for (let i = 0; i < rows; i++){ const ax = x + i * dx * .2, ay = y + i * dy, bx = ax + len, by = ay - len * .12;
    s += zSh((ax + bx) / 2 + 8, (ay + by) / 2 + 4, len * .52, 5, .25) + `<path d="M${zr(ax)} ${zr(ay - 12)}L${zr(bx)} ${zr(by - 12)}" stroke="#4a3a28" stroke-width="1.2"/>`;
    for (let k = 0; k <= len; k += 22){ const px = ax + (bx - ax) * k / len, py = ay + (by - ay) * k / len; s += `<path d="M${zr(px)} ${zr(py)}v-16" stroke="#4a3a28" stroke-width="2"/>`; }
    for (let k = 4; k < len; k += 7){ const px = ax + (bx - ax) * k / len, py = ay + (by - ay) * k / len - 10 + Math.sin(k) * 2; s += `<circle cx="${zr(px)}" cy="${zr(py)}" r="5.6" fill="${k % 3 ? "#4e7a2a" : "#5e8a34"}"/>`; if (K.r() < .3) s += `<circle cx="${zr(px + 1)}" cy="${zr(py + 4)}" r="2.6" fill="#4a2a5a"/>`; } }
  return s; }
function zCellar(K, x, y, s = 1){ return zHill(x, y, 90 * s, 48 * s, "#5a6a34") + `<path d="M${zr(x - 22 * s)} ${zr(y)}v-${zr(22 * s)}a${zr(22 * s)} ${zr(22 * s)} 0 0 1 ${zr(44 * s)} 0v${zr(22 * s)}z" fill="#7a6e5a"/><path d="M${zr(x - 16 * s)} ${zr(y)}v-${zr(19 * s)}a${zr(16 * s)} ${zr(16 * s)} 0 0 1 ${zr(32 * s)} 0v${zr(19 * s)}z" fill="#5a3a22"/><path d="M${zr(x)} ${zr(y - 35 * s)}v${zr(35 * s)}M${zr(x - 16 * s)} ${zr(y - 12 * s)}h${zr(32 * s)}" stroke="#3a2414" stroke-width="${zr(1.6 * s)}"/>`; }
function zHeadframe(x, y, s = 1){ const c = "#4a3a2a"; let g = zSh(x + 20 * s, y + 3, 40 * s, 7 * s, .32);
  g += `<path d="M${zr(x - 30 * s)} ${zr(y)}L${zr(x - 8 * s)} ${zr(y - 110 * s)}M${zr(x + 30 * s)} ${zr(y)}L${zr(x + 8 * s)} ${zr(y - 110 * s)}M${zr(x - 26 * s)} ${zr(y - 16 * s)}L${zr(x + 22 * s)} ${zr(y - 54 * s)}M${zr(x + 26 * s)} ${zr(y - 16 * s)}L${zr(x - 22 * s)} ${zr(y - 54 * s)}M${zr(x - 20 * s)} ${zr(y - 56 * s)}L${zr(x + 16 * s)} ${zr(y - 92 * s)}M${zr(x + 20 * s)} ${zr(y - 56 * s)}L${zr(x - 16 * s)} ${zr(y - 92 * s)}M${zr(x - 24 * s)} ${zr(y - 55 * s)}h${zr(48 * s)}" stroke="${c}" stroke-width="${zr(3.6 * s)}"/><path d="M${zr(x + 30 * s)} ${zr(y)}l${zr(60 * s)} -${zr(90 * s)}" stroke="${c}" stroke-width="${zr(4 * s)}"/>`;
  g += `<circle cx="${zr(x)}" cy="${zr(y - 112 * s)}" r="${zr(16 * s)}" fill="none" stroke="${c}" stroke-width="${zr(3.4 * s)}"/><path d="M${zr(x - 16 * s)} ${zr(y - 112 * s)}h${zr(32 * s)}M${zr(x)} ${zr(y - 128 * s)}v${zr(32 * s)}" stroke="${c}" stroke-width="${zr(1.6 * s)}"/><path d="M${zr(x + 14 * s)} ${zr(y - 112 * s)}V${zr(y - 20 * s)}" stroke="#2a2420" stroke-width="1.2"/>`;
  return g; }
function zSaltHeap(x, y, s = 1){ return zSh(x + 12 * s, y + 3, 40 * s, 8 * s, .3) + `<path d="M${zr(x - 38 * s)} ${zr(y)}Q${zr(x - 10 * s)} ${zr(y - 42 * s)} ${zr(x)} ${zr(y - 44 * s)}Q${zr(x + 14 * s)} ${zr(y - 40 * s)} ${zr(x + 38 * s)} ${zr(y)}z" fill="#f2f0ec"/><path d="M${zr(x)} ${zr(y - 44 * s)}Q${zr(x + 14 * s)} ${zr(y - 40 * s)} ${zr(x + 38 * s)} ${zr(y)}H${zr(x + 4 * s)}z" fill="#c8ccd2"/>`; }
function zRails(pts){ const d = zPathD(pts); return `<path d="${d}" stroke="#4a3a2a" stroke-width="14" stroke-dasharray="3 6" fill="none"/><path d="${d}" stroke="#6a6a70" stroke-width="2" fill="none" transform="translate(0 -4)"/><path d="${d}" stroke="#6a6a70" stroke-width="2" fill="none" transform="translate(0 4)"/>`; }
function zTrembita(x, y){ return `<path d="M${x} ${y}l70 -90" stroke="#8a6a44" stroke-width="5" stroke-linecap="round"/><path d="M${x + 64} ${y - 82}l10 -12" stroke="#5a3e26" stroke-width="9" stroke-linecap="round"/><path d="M${x + 10} ${y - 12}l4 -5M${x + 30} ${y - 38}l4 -5M${x + 50} ${y - 64}l4 -5" stroke="#3a2818" stroke-width="7"/>`; }
function zMoss(x, y, w){ return `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(w)}" ry="${zr(w * .3)}" fill="#4a6a2a" opacity=".6"/>`; }
function zFlowerBed(K, x, y, w, h, c = "#faf6e8", c2 = "#e8b020", n = 50){ let s = ""; for (let i = 0; i < n; i++){ const a = K.r() * 6.283, d = Math.sqrt(K.r()), px = x + Math.cos(a) * w * d, py = y + Math.sin(a) * h * d; s += `<path d="M${zr(px)} ${zr(py)}v-7" stroke="#5a7a30" stroke-width="1.2"/><circle cx="${zr(px)}" cy="${zr(py - 8)}" r="3" fill="${c}"/><circle cx="${zr(px)}" cy="${zr(py - 8)}" r="1.2" fill="${c2}"/>`; } return s; }
function zSpringPool(K, x, y, s = 1){ K.light(x, y - 4, 50 * s, "#bff4ff", .35); return `<ellipse cx="${x}" cy="${y + 2}" rx="${54 * s}" ry="${19 * s}" fill="#000" opacity=".25" filter="url(#zb1)"/><ellipse cx="${x}" cy="${y}" rx="${50 * s}" ry="${17 * s}" fill="#7a7266"/><ellipse cx="${x}" cy="${y - 1}" rx="${42 * s}" ry="${13 * s}" fill="#3a8a92"/><ellipse cx="${x - 10 * s}" cy="${y - 4}" rx="${16 * s}" ry="${3 * s}" fill="#d8f4f8" opacity=".6"/>` + [...Array(10)].map((_, i) => `<ellipse cx="${zr(x + Math.cos(i * .63) * 48 * s)}" cy="${zr(y + Math.sin(i * .63) * 16 * s)}" rx="${zr(7 * s)}" ry="${zr(4.4 * s)}" fill="${i % 2 ? "#8a847a" : "#9a948a"}"/>`).join("") + zSmoke(x - 6 * s, y - 12 * s, .7 * s, "#eef6f8"); }

Object.assign(ZS, {
  uzhgorod(K){ const r = K.r; K.dress = {noLine:true, veg:.3, fg:null, edge:{oak:5}, mid:{}};
    // замок на горі й собор з двома вежами
    K.under += zHill(160, 150, 230, 90, "#5a7a3a"); K.put(96, zWall(K, 40, 100, 280, 96, 40, {wall:"#c0b49a"}) + zKeep(K, 160, 96, 90, 70, 40, {wall:"#c8bca2", flag:"#3a6aaa", win:"#ffd27a"}) + zTower(K, 40, 104, 18, 74, {wall:"#c0b49a", roof:"#7a3a26"}) + zTower(K, 280, 100, 18, 74, {wall:"#c0b49a", roof:"#7a3a26"}));
    zAny(K, [[720, 176], [780, 210], [650, 170], [760, 440], [160, 420]], 70, (px, py) => zHouse(K, px, py, 120, 76, 56, {wall:"#ece2c8", roof:"#4a6a8a", gable:"front", archWin:true, rh:44}) + zTower(K, px - 70, py + 2, 18, 130, {wall:"#ece2c8", roof:"#4a6a8a", rh:44}) + zTower(K, px + 70, py + 2, 18, 130, {wall:"#ece2c8", roof:"#4a6a8a", rh:44}), {cy:50});
    // хата бандуриста й хижа знахарки
    K.place(300, 166, 50, (px, py) => zHouse(K, px, py, 96, 52, 50, {wall:"#e8dcc0", roof:"#8a3424", timber:"#4a3424", flowers:true, sign:"#8a6a3a", signIc:"#e8c860", chimney:true}), {cy:30, npc:0});
    K.place(600, 206, 46, (px, py) => zLog(K, px, py, 82, 44, 46, {sign:"#4a7a4a", signIc:"#e8f0c0"}) + [0, 1, 2, 3].map(i => `<path d="M${px - 30 + i * 10} ${py - 44}l3 9l3 -9z" fill="${["#6a8a3a", "#8a7a3a"][i % 2]}"/>`).join(""), {cy:30});
    K.put(318, zFountain(K, 450, 318, .9));
    for (const [x, y, c] of [[340, 420, "#c0503a"], [560, 420, "#3a6a9a"]]) K.place(x, y, 26, (px, py) => Z.stall(px, py, c), {npc:1});
    K.place(160, 420, 50, (px, py) => zHouse(K, px, py, 96, 54, 50, {wall:"#e0d4b4", roof:"#9a3a26", storeys:2, timber:"#4a3424", shut:"#3a5a7a"}), {cy:30});
    K.place(760, 450, 50, (px, py) => zHouse(K, px, py, 90, 50, 50, {wall:"#e8dcc0", roof:"#7a3a26", chimney:true, shut:"#3a6a4a"}), {cy:30});
    for (const [x, y] of [[372, 262], [528, 262], [300, 360], [608, 350]]) K.place(x, y, 8, (px, py) => Z.lamp(K, px, py), {npc:1, path:1});
    for (let i = 0; i < 12; i++) K.place(260 + r() * 400, 260 + r() * 210, 6, (px, py) => Z.folk(px, py, K.pk(["#7a3a26", "#3a5a7a", "#5a6a30", "#8a6a2a", "#e8e0cc"])), {path:1, noclaim:1});
  },
  mukachevo(K){ const r = K.r; K.dress = {noLine:true, veg:.3, fg:null, edge:{oak:5}, mid:{}};
    // Паланок на горі
    K.under += zHill(560, 150, 260, 110, "#5a7a3a");
    K.put(100, zWall(K, 400, 106, 720, 100, 44, {wall:"#b4a88e"}) + zKeep(K, 560, 92, 100, 70, 44, {wall:"#c0b49a", flag:"#c0a030", win:"#ffd27a"}) + zTower(K, 400, 110, 20, 70, {wall:"#b4a88e", roof:"#6a3a26"}) + zTower(K, 720, 104, 20, 76, {wall:"#b4a88e", roof:"#6a3a26"}));
    // ратуша
    K.place(760, 220, 66, (px, py) => zHouse(K, px, py, 130, 74, 56, {wall:"#efe4c8", roof:"#8a3424", storeys:2, archWin:true}) + zTower(K, px - 30, py - 30, 16, 120, {wall:"#efe4c8", roof:"#3a6a5a", rh:46}) + `<circle cx="${px - 30}" cy="${py - 116}" r="8" fill="#efe6cc" stroke="#3a2a1a" stroke-width="1.6"/>`, {cy:40});
    // кузня під Паланком
    K.place(230, 270, 54, (px, py) => zHouse(K, px, py, 100, 54, 50, {wall:"#a89c84", roof:"#4a3a2a", timber:"#3a2a1a", sign:"#5a4a3a", signIc:"#c0c0c0", chimney:true}) + Z.anvil(px + 66, py + 14), {cy:30}); K.light(230, 260, 50, "#ff7a2a", .4);
    K.place(320, 160, 50, (px, py) => zOnionChurch(K, px, py, .8, "#c09a30"), {cy:50});
    K.put(330, zFountain(K, 450, 330, .8));
    for (const [x, y] of [[160, 440], [740, 450], [560, 470]]) K.place(x, y, 48, (px, py) => zHouse(K, px, py, 88, 48, 50, {wall:K.pk(["#e6dabd", "#d8caa8", "#efe4c8"]), roof:K.pk(["#9a4026", "#8a3a24", "#6a3a26"]), chimney:r() < .6, shut:K.pk(["#3a5a7a", "#3a6a4a"])}), {cy:30});
    for (const [x, y] of [[372, 270], [530, 270], [600, 370]]) K.place(x, y, 8, (px, py) => Z.lamp(K, px, py), {npc:1, path:1});
    for (let i = 0; i < 10; i++) K.place(260 + r() * 400, 280 + r() * 200, 6, (px, py) => Z.folk(px, py, K.pk(["#7a3a26", "#3a5a7a", "#5a6a30", "#e8e0cc"])), {path:1, noclaim:1});
  },
  svalyava(K){ const r = K.r; K.dress = {veg:.7, edge:{pine:8, oak:4}};
    // хата травниці й цілюще джерело
    K.place(330, 156, 50, (px, py) => zLog(K, px, py, 92, 46, 50, {flowers:true, sign:"#4a7a4a", signIc:"#e8f0c0", chimney:true}) + [0, 1, 2, 3, 4].map(i => `<path d="M${px - 40 + i * 8} ${py - 48}l3 9l3 -9z" fill="${["#6a8a3a", "#8a7a3a", "#5a7a4a"][i % 3]}"/>`).join(""), {cy:30});
    K.place(620, 230, 60, (px, py) => { let g = zSpringPool(K, px, py + 20, 1); g += [-.85, -.42, 0, .42, .85].map(k => `<rect x="${px + k * 46 - 3}" y="${py - 46}" width="6" height="56" fill="${k > .2 ? "#a8a08a" : "#efe8d6"}"/>`).join(""); return g + `<path d="M${px - 58} ${py - 46}a58 40 0 0 1 116 0z" fill="#4a8a7a"/><path d="M${px} ${py - 86}a58 40 0 0 1 58 40h-58z" fill="#2e5e52"/><path d="M${px} ${py - 86}v-10M${px - 4} ${py - 92}h8" stroke="#d9c070" stroke-width="2"/>`; }, {cy:40});
    K.place(130, 230, 60, (px, py) => zWoodChurch(K, px, py, .8), {cy:50});
    for (const [x, y] of [[200, 440], [720, 440], [470, 470]]) K.place(x, y, 48, (px, py) => zLog(K, px, py, 84, 44, 48, {chimney:r() < .6, shut:K.pk(["#3a5a7a", "#7a3a2a", "#3a6a4a"])}), {cy:30});
    K.place(300, 320, 20, (px, py) => Z.well(px, py)); for (const [x, y] of [[820, 300], [90, 360]]) K.place(x, y, 18, (px, py) => Z.hay(px, py));
    K.scatter(5, 8, (x, y) => Z.folk(x, y, K.pk(["#7a3a26", "#3a5a7a", "#5a6a30", "#e8e0cc"])), {box:[220, 260, 700, 480]});
  },
  khust(K){ const r = K.r; K.dress = {veg:.6, edge:{oak:6, pine:3}};
    // руїни Хустського замку на Замковій горі
    K.under += zHill(660, 160, 250, 110, "#5a6a3a");
    K.put(110, zWall(K, 540, 116, 820, 104, 50, {wall:"#9a9078", ruin:true, seed:3}) + zTower(K, 600, 112, 22, 70, {wall:"#9a9078", flat:true}) + zKeep(K, 740, 100, 54, 60, 30, {wall:"#a89e86"}));
    // сотня: двір з частоколом, прапор, мішені
    K.place(400, 180, 60, (px, py) => zLog(K, px, py, 120, 54, 56, {sign:"#7a2a22", signIc:"#e8c860", chimney:true}) + Z.banner(px + 80, py + 6, 80, "#2a4a8a", "#e8c860"), {cy:30});
    for (const [x, y] of [[560, 300], [600, 330]]) K.place(x, y, 12, (px, py) => Z.dummy(px, py));
    K.place(250, 300, 22, (px, py) => Z.rack(px, py));
    for (const [x, y] of [[150, 220], [180, 460], [720, 460]]) K.place(x, y, 48, (px, py) => zLog(K, px, py, 84, 44, 48, {chimney:r() < .6, shut:K.pk(["#3a5a7a", "#7a3a2a"])}), {cy:30});
    K.place(320, 420, 20, (px, py) => Z.well(px, py)); K.place(820, 330, 18, (px, py) => Z.hay(px, py));
    K.scatter(5, 8, (x, y) => Z.folk(x, y, K.pk(["#2a4a8a", "#7a3a26", "#5a6a30", "#e8e0cc"])), {box:[220, 260, 700, 480]});
  },
  rakhiv(K){ const r = K.r; K.dress = {veg:.6, noLine:true, edge:{pine:10}, mid:{rock:3}};
    let m = ""; for (const [x, y, w, h] of [[110, 170, 180, 150], [400, 130, 160, 110], [700, 160, 200, 170], [900, 190, 150, 140]]) m += zMount(x, y, w, h, {snow:true, col:"#7a8078"});
    K.under += m; for (let x = -10; x < 920; x += 26 + r() * 20) K.under += zPine(x, 168 + (r() * 2 - 1) * 14, .55 + r() * .25, {pal:Z_PAL.pineSn, snow:true});
    // колиба опришків
    K.place(380, 196, 50, (px, py) => zLog(K, px, py, 96, 40, 52, {roof:"#2e2620", chimney:true, sign:"#5a3a22", signIc:"#c9a24a"}) + zSmoke(px + 20, py - 70, .8), {cy:30});
    K.place(650, 230, 60, (px, py) => zWoodChurch(K, px, py, .75, {roof:"#2e2a26"}), {cy:50});
    for (const [x, y] of [[170, 260], [180, 460], [720, 450]]) K.place(x, y, 48, (px, py) => zLog(K, px, py, 80, 42, 48, {roof:"#3a302a", chimney:true}), {cy:30});
    K.place(560, 420, 26, (px, py) => Z.logs(px, py)); K.place(290, 330, 24, (px, py) => Z.fire(K, px, py, .8));
    K.scatter(4, 8, (x, y) => Z.folk(x, y, K.pk(["#7a2a22", "#3a3a3a", "#5a4a3a"])), {box:[220, 260, 700, 480]});
  },
  uzh(K){ const r = K.r; K.dress = {veg:1.1, edge:{oak:14, pine:3}, mid:{oak:3, bush:6}, line:"mix"};
    // діброва: хижка знахаря, сушарка трав, коло з грибів
    K.place(620, 200, 44, (px, py) => zLog(K, px, py, 70, 38, 42, {roof:"#3a4a2a", chimney:true}) + zSmoke(px + 10, py - 64, .6, "#a8b8a0"), {cy:26});
    K.place(500, 230, 22, (px, py) => zSh(px + 8, py + 2, 26, 4, .25) + `<path d="M${px - 20} ${py}v-30M${px + 20} ${py}v-30M${px - 22} ${py - 28}h44" stroke="#4a3424" stroke-width="2.4"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${px - 16 + i * 6.4} ${py - 28}l2.4 10l2.4 -10z" fill="${["#6a8a3a", "#8a7a3a", "#5a7a4a"][i % 3]}"/>`).join(""));
    K.place(300, 380, 40, (px, py) => [...Array(12)].map((_, i) => zMush(px + Math.cos(i * .52) * 34, py + Math.sin(i * .52) * 12)).join("") + zGlow(px, py - 4, 30, "#e8ffb0", .25), {path:1});
    K.place(220, 250, 16, (px, py) => Z.cross(px, py, 1.2, "#5a4a38") + `<path d="M${px - 14} ${py - 34}l14 -10l14 10" stroke="#3a2a1a" stroke-width="3" fill="none"/>`);
    for (let i = 0; i < 6; i++) K.place(120 + r() * 660, 240 + r() * 260, 12, (px, py) => zFern(px, py, 1 + r() * .4));
  },
  perech(K){ const r = K.r; K.dress = {veg:1.5, edge:{pine:22}, mid:{pine:5, bush:3, rock:3}, line:"pine"}; K.c.mood = "dusk";
    for (let i = 0; i < 5; i++) K.place(150 + r() * 600, 260 + r() * 240, 30, (px, py) => zSh(px + 10, py + 3, 40, 6, .3) + `<path d="M${px - 36} ${py}l70 -10" stroke="#5a3e26" stroke-width="11" stroke-linecap="round"/><path d="M${px - 36} ${py}l70 -10" stroke="#4a6a2a" stroke-width="5" stroke-linecap="round" opacity=".6" transform="translate(0 -4)"/><circle cx="${px - 36}" cy="${py}" r="5.4" fill="#b08a5a"/>`);
    for (let i = 0; i < 8; i++) K.place(120 + r() * 660, 240 + r() * 270, 12, (px, py) => zFern(px, py, 1 + r() * .5));
    for (let i = 0; i < 6; i++) K.place(200 + r() * 500, 280 + r() * 220, 6, (px, py) => zMush(px, py), {noclaim:1});
    // мавки в кронах: бліді вогники
    for (let i = 0; i < 10; i++){ const x = 80 + r() * 740, y = 70 + r() * 120; K.top += zGlow(x, y, 10, "#c8ffd8", .8) + `<circle cx="${zr(x)}" cy="${zr(y)}" r="2" fill="#f2fff6"/>`; }
  },
  velbz(K){ const r = K.r; K.dress = {veg:.8, edge:{oak:6, pine:4}, mid:{bush:4, rock:2}, line:"mix"}; K.fog = true; K.fogOp = .1;
    for (const [x, y, s] of [[200, 230, 2.1], [700, 220, 2.3], [140, 470, 1.8], [770, 470, 1.9]]) K.place(x, y, 60 * s / 2, (px, py) => zOak(px, py, s, Z_PAL.oakDk || null), {cy:50});
    K.place(450, 220, 30, (px, py) => Z.menhir(px - 26, py, 58, "#7a766a") + Z.menhir(px + 26, py, 54, "#7a766a") + `<path d="M${px - 40} ${py - 56}h80l6 -5h-80z" fill="#9a968a"/><rect x="${px - 40}" y="${py - 56}" width="80" height="8" fill="#6a665a"/>` + zMoss(px - 26, py - 2, 14), {npc:1});
    K.place(560, 360, 20, (px, py) => zSh(px + 8, py + 2, 12, 3, .3) + `<path d="M${px - 9} ${py}v-46l9 -7l9 7v46z" fill="#8a7a5a"/><path d="M${px} ${py - 53}l9 7v46h-9z" fill="#5a4e3a"/><circle cx="${px - 4}" cy="${py - 38}" r="2" fill="#1d1812"/><circle cx="${px + 4}" cy="${py - 38}" r="2" fill="#1d1812"/><path d="M${px - 5} ${py - 28}h10" stroke="#1d1812" stroke-width="2"/>` + zMoss(px, py - 2, 12));
    for (let i = 0; i < 8; i++) K.place(150 + r() * 600, 260 + r() * 240, 12, (px, py) => zFern(px, py, 1.2));
    for (let i = 0; i < 8; i++){ const x = 100 + r() * 700, y = 120 + r() * 300; K.top += zGlow(x, y, 6, "#f2ffc8", .7); }
  },
  sval(K){ const r = K.r; K.dress = {veg:1.1, edge:{pine:12, oak:4, birch:3}, mid:{bush:5, reeds:4}};
    for (const [x, y, s] of [[300, 240, 1.2], [640, 300, 1.3], [220, 440, 1]]) K.place(x, y, 50 * s, (px, py) => zSpringPool(K, px, py, s), {path:0});
    K.place(500, 200, 20, (px, py) => zSh(px + 6, py + 2, 10, 3, .3) + `<rect x="${px - 6}" y="${py - 30}" width="12" height="30" fill="#8a847a"/><rect x="${px}" y="${py - 30}" width="6" height="30" fill="#5a564e"/><path d="M${px - 3} ${py - 22}h-8v4" stroke="#7a7470" stroke-width="3" fill="none"/><path d="M${px - 11} ${py - 18}q-1 8 0 16" stroke="#bfe8f0" stroke-width="2" fill="none"/>`);
    for (let i = 0; i < 8; i++) K.place(150 + r() * 600, 260 + r() * 240, 12, (px, py) => zFern(px, py, 1.1));
    K.fog = true; K.fogCol = "#e8f2f0"; K.fogOp = .1;
  },
  muk(K){ const r = K.r; K.dress = {veg:.8, edge:{oak:7, dead:3}, mid:{bush:4, rock:3}}; K.c.mood = "dusk";
    K.under += zHill(450, 170, 340, 110, "#4e6a34");
    K.put(118, zWall(K, 260, 126, 640, 118, 54, {wall:"#9a9078", ruin:true, seed:5}) + zKeep(K, 450, 104, 110, 74, 50, {wall:"#a89e86", win:"#ff8a3a"}) + zTower(K, 260, 128, 22, 82, {wall:"#9a9078", roof:"#3a2a24"}) + zTower(K, 640, 120, 22, 86, {wall:"#9a9078", flat:true}));
    K.put(126, zVines(K, 30, 150, 3, 180, 34, 24) + zVines(K, 690, 150, 3, 190, 34, 24));
    K.place(240, 320, 16, (px, py) => Z.cross(px, py, 1.3, "#4a3a2a") + `<path d="M${px - 16} ${py - 38}l16 -12l16 12" stroke="#3a2a1a" stroke-width="3" fill="none"/>`);
    for (let i = 0; i < 6; i++) K.place(200 + r() * 520, 280 + r() * 220, 12, (px, py) => Z.grave(px, py, K.pk(["#6a6660", "#7a766c"])));
    for (let i = 0; i < 8; i++) K.top += Z.crow(150 + r() * 600, 40 + r() * 60, 1.1);
    K.fog = true; K.fogOp = .1;
  },
  ber(K){ const r = K.r; K.dress = {veg:.6, edge:{oak:5}, mid:{bush:3}}; K.c.mood = "dusk";
    K.under += zHill(220, 190, 300, 120, "#6a7a3a") + zHill(720, 200, 280, 110, "#5e7034");
    K.put(160, zVines(K, 60, 140, 3, 220, 34, 22) + zVines(K, 600, 150, 3, 230, 34, 22));
    for (const [x, y] of [[300, 260], [640, 270]]) K.place(x, y, 50, (px, py) => zCellar(K, px, py, 1) + Z.barrel(px + 52, py + 6) + Z.barrel(px + 70, py + 10), {cy:20});
    zAny(K, [[160, 400], [760, 420], [150, 300], [450, 470]], 44, (px, py) => zGothic(K, px, py, 70, 52, 50, {wall:"#7a7468", gh:30}) + zGlow(px, py - 20, 26, "#9a6aff", .35), {cy:30});
    for (let i = 0; i < 10; i++) K.top += Z.crow(150 + r() * 600, 40 + r() * 80, 1).replace(/q/g, "q");
    K.scatter(4, 10, (x, y) => Z.barrel(x, y), {box:[200, 300, 700, 480]});
  },
  vyn(K){ const r = K.r; K.dress = {veg:.6, edge:{oak:6, dead:2}, mid:{bush:3}};
    K.under += zHill(450, 200, 520, 120, "#6a7a3a");
    K.put(170, zVines(K, 80, 140, 4, 300, 30, 20) + zVines(K, 520, 150, 4, 320, 30, 20));
    K.place(640, 300, 50, (px, py) => zHouse(K, px, py, 96, 48, 50, {wall:"#efe4c8", roof:"#8a3424", gable:"front", timber:"#4a3424"}) + Z.barrel(px - 60, py + 4) + Z.barrel(px - 44, py + 8), {cy:30});
    // відьмина хата в хащі
    K.place(170, 420, 44, (px, py) => zDead(px - 60, py + 10, 1.6) + zDead(px + 60, py + 6, 1.4) + `<g transform="rotate(-4 ${px} ${py})">${zLog(K, px, py, 70, 36, 40, {roof:"#2a2a1a", lit:false})}</g>` + zGlow(px - 14, py - 20, 22, "#9aff6a", .5) + `<rect x="${px - 20}" y="${py - 26}" width="10" height="9" fill="#9aff6a"/>` + Z.cauldron(K, px + 56, py + 30), {cy:30});
    K.scatter(4, 10, (x, y) => Z.folk(x, y, K.pk(["#6a3a5a", "#e8e0cc", "#7a3a26"])), {box:[300, 260, 700, 460]});
  },
  irsh(K){ const r = K.r; K.dress = {veg:1, edge:{willow:5, oak:3}, mid:{reeds:14, bush:2}, pools:7};
    K.place(640, 210, 46, (px, py) => [-28, -6, 18, 34].map(ox => `<path d="M${px + ox} ${py + 16}v-18" stroke="#3a2a1a" stroke-width="4"/>`).join("") + zLog(K, px, py, 74, 38, 42, {roof:"#3e3a2a"}), {cy:26});
    // розбитий віз і розсипані блискітки: злидні тягнуть усе, що блищить
    K.place(300, 380, 36, (px, py) => `<g transform="rotate(10 ${px} ${py})">${Z.cart(px, py)}</g>` + [...Array(9)].map((_, i) => `<circle cx="${px - 40 + r() * 80}" cy="${py + 6 + r() * 18}" r="2.4" fill="#e8c860"/>` + zGlow(px - 40 + r() * 80, py + 10 + r() * 14, 6, "#ffe08a", .5)).join(""));
    K.fog = true; K.fogOp = .12;
  },
  volv(K){ const r = K.r; K.dress = {veg:.6, noLine:true, edge:{pine:6}, mid:{rock:5, bush:2}};
    let m = ""; for (const [x, y, w, h] of [[120, 200, 220, 140], [450, 170, 260, 130], [800, 200, 230, 150]]) m += zMount(x, y, w, h, {col:"#5a7a44"});
    K.under += `<rect x="0" y="0" width="${ZW}" height="180" fill="#3a3a48" opacity=".25"/>` + m;
    K.place(300, 230, 50, (px, py) => zLog(K, px, py, 90, 34, 50, {roof:"#2e2620", chimney:true}) + zSmoke(px + 18, py - 60, .9), {cy:26});
    const fx = 620, fy = 290; K.put(fy - 40, Z.fence([[fx - 100, fy - 40], [fx + 100, fy - 50]])); K.put(fy + 40, Z.fence([[fx - 100, fy - 40], [fx - 110, fy + 40], [fx + 90, fy + 30], [fx + 100, fy - 50]])); K.claim(fx, fy, 100);
    for (let i = 0; i < 10; i++){ const x = fx - 80 + r() * 160, y = fy - 30 + r() * 56; K.put(y, Z.sheep(x, y)); }
    K.place(180, 380, 20, (px, py) => zTrembita(px, py)); K.scatter(6, 10, (x, y) => Z.sheep(x, y), {box:[100, 300, 800, 500]});
    K.place(400, 360, 10, (px, py) => Z.folk(px, py, "#3a2a1a"));
    let wd = ""; for (let i = 0; i < 16; i++){ const x = r() * ZW, y = 80 + r() * 300; wd += `<path d="M${zr(x)} ${zr(y)}q30 -6 60 0" stroke="#e8eef0" stroke-width="1.2" fill="none" opacity=".35"/>`; } K.top += wd;
  },
  hust(K){ const r = K.r; K.dress = {veg:1, edge:{willow:4, dead:6}, mid:{reeds:12}, pools:6}; K.fog = true; K.fogOp = .14;
    K.under += zHill(660, 170, 260, 130, "#4e5e34");
    K.put(116, zWall(K, 560, 120, 800, 110, 50, {wall:"#9a9078", ruin:true, seed:6}) + zTower(K, 610, 118, 22, 76, {wall:"#9a9078", flat:true}) + zKeep(K, 730, 104, 56, 54, 30, {wall:"#a89e86"}));
    for (let i = 0; i < 10; i++){ const x = 100 + r() * 700, y = 180 + r() * 300; K.top += zWisp(K, x, y, r() < .5 ? "#c8ffd8" : "#ffe8a0"); }
    K.place(260, 380, 30, (px, py) => zBoardwalk([[px - 80, py], [px - 10, py - 12], [px + 60, py - 2]]), {path:1});
  },
  mizh(K){ const r = K.r; K.dress = {veg:1.2, edge:{pine:16}, mid:{pine:2, rock:3}, line:"pine"};
    // острівець посеред Синевиру
    K.put(250, `<ellipse cx="560" cy="252" rx="64" ry="22" fill="#3a5a2a"/><ellipse cx="556" cy="248" rx="54" ry="17" fill="#4a6a34"/>` + zPine(540, 252, .8) + zPine(570, 256, .7) + zPine(590, 250, .55));
    K.put(330, `<g transform="rotate(-6 760 330)"><rect x="720" y="322" width="80" height="20" fill="#6a4a2a"/>` + [...Array(8)].map((_, i) => `<path d="M${722 + i * 10} 322v20" stroke="#3a2818" stroke-width="1.6"/>`).join("") + `</g>`);
    for (let i = 0; i < 8; i++){ const x = 300 + r() * 460, y = 180 + r() * 150; K.under += `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="7" ry="2.6" fill="#3a6a3a"/><circle cx="${zr(x + 2)}" cy="${zr(y - 1)}" r="1.6" fill="#f2f0e8"/>`; }
    for (let i = 0; i < 5; i++){ const x = 320 + r() * 440, y = 190 + r() * 120; K.glow += zGlow(x, y, 22, "#8affd0", .3); }
    K.place(160, 420, 40, (px, py) => zLog(K, px, py, 70, 36, 40, {roof:"#2e2a22"}), {cy:24});
  },
  tia(K){ const r = K.r; K.dress = {veg:.6, edge:{pine:6, dead:4}, mid:{rock:5}};
    K.place(640, 230, 60, (px, py) => zHeadframe(px, py, 1) + zShed(K, px + 90, py + 10, 90, 44, 44, {wall:"#7a6e5e", roof:"#3a3430"}), {cy:60});
    for (const [x, y, s] of [[200, 220, 1.2], [280, 250, .8], [760, 420, 1]]) K.place(x, y, 40 * s, (px, py) => zSaltHeap(px, py, s));
    K.place(330, 410, 60, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="90" ry="26" fill="#e8ece8"/><ellipse cx="${px}" cy="${py - 2}" rx="80" ry="21" fill="#4ab0b8"/><ellipse cx="${px - 20}" cy="${py - 6}" rx="30" ry="4" fill="#d8f8f8" opacity=".6"/>`, {cy:0});
    K.under += zRails([[520, 300], [600, 280], [700, 270], [820, 290]]); K.place(700, 300, 30, (px, py) => Z.cart(px, py, `<path d="M${px - 22} ${py - 26}q20 -14 40 0z" fill="#f2f0ec"/>`), {path:1});
    for (let i = 0; i < 6; i++) K.place(150 + r() * 600, 260 + r() * 240, 8, (px, py) => zBone(px, py, 1.2, r), {noclaim:1});
    for (let i = 0; i < 4; i++) K.place(100 + r() * 700, 200 + r() * 300, 26, (px, py) => zPine(px, py, 1.1, {pal:Z_PAL.pineDk}));
  },
  rah(K){ const r = K.r; K.dress = {veg:.6, noLine:true, edge:{pine:8}, mid:{rock:6}};
    let m = ""; for (const [x, y, w, h] of [[100, 210, 200, 190], [350, 170, 180, 150], [600, 190, 240, 220], [860, 210, 200, 170]]) m += zMount(x, y, w, h, {snow:true, col:"#6e7470"});
    K.under += m;
    K.place(640, 260, 60, (px, py) => Z.cave(K, px, py, 70, 80, "#9a5aff"), {cy:40, path:1});
    for (let i = 0; i < 8; i++) K.place(150 + r() * 600, 250 + r() * 250, 16, (px, py) => zRock(px, py, .5 + r() * .5, "#8a8e93", {snow:true}));
    for (let i = 0; i < 6; i++) K.place(150 + r() * 600, 260 + r() * 240, 10, (px, py) => Z.crystal(K, px, py, .8, "#bfe8ff"));
    let sn = ""; for (let i = 0; i < 50; i++){ const x = r() * ZW, y = r() * ZH; sn += `<circle cx="${zr(x)}" cy="${zr(y)}" r="${zr(.8 + r() * 1.2)}" fill="#fff" opacity="${zr(.4 + r() * .4)}"/>`; } K.top += sn;
  },
});
