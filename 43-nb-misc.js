/* ============ нові істоти: жаба, духи, павуки, птахи, п'явки, гідри, змії, рої ============ */
const nbG = () => ctx, nbSh = (g, h) => g.fillStyle = "rgba(8,6,4,.3)";
function nbGround(g, w, y){ g.fillStyle = "rgba(8,6,4,.3)"; g.beginPath(); g.ellipse(0, y === undefined ? 47 : y, w, 4.4, 0, 0, TAU); g.fill(); }
// ---------- жаба ----------
function nbFrog(o){
  const {h, t, e, has, dsn, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, blink = nbBlink(t, seed);
  const P = nbPal(dsn.col, 1.2), Pb = nbPal(nbMix(dsn.col, "#f2e6a8", .6)), Pf = {b:P.d, d:P.dd, l:P.b};
  const cyc = (t * .55 + seed * .13) % 1, hop = cyc < .22 ? Math.sin(cyc / .22 * Math.PI) : 0, moving = Math.abs(e.vx) > 30, hopH = (moving ? 1.2 : 1) * hop * 20;
  const throat = 1 + Math.sin(t * 3.4 + seed) * .12, sc = h / 100 * 1.5, squat = hop > 0 ? 1 : 1 + Math.sin(t * 2 + seed) * .03;
  g.save(); g.scale(sc, sc); nbGround(g, 36 - hopH * .4, 47);
  g.translate(atk * 5, -hopH + 6); g.translate(0, 40); g.scale(1, squat * (hop > 0 ? 1.08 : 1)); g.translate(0, -40);
  const stretch = hop * 14;
  // дальня задня лапа
  nbLimbs([[-14, 24, -26 - stretch, 34, 10], [-26 - stretch, 34, -10 - stretch * 1.6, 44 - hop * 4, 7]], Pf);
  // дальня передня
  nbLimbs([[16, 22, 22 + stretch * .5, 34, 6], [22 + stretch * .5, 34, 30 + stretch * .5, 42, 5]], Pf);
  // тіло
  const body = () => nbSmooth(g, [[-32, 20], [-28, 0], [-12, -12], [8, -14], [26, -8], [36, 6], [34, 22], [14, 33], [-14, 34]], true);
  nbCel(body, P, 2.6);
  nbCel(() => nbSmooth(g, [[-18, 24], [4, 18], [26, 12], [34, 20], [14, 32], [-14, 33]], true), Pb, 0, {sx:0, sy:-2.5});
  g.save(); g.beginPath(); body(); g.clip(); g.fillStyle = P.dd; g.globalAlpha = .55; for (const [x, y, r] of [[-20, 0, 3], [-6, -6, 2.4], [10, -8, 2.8], [-26, 12, 2.2], [-10, 6, 2]]){ g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); } g.globalAlpha = 1; g.restore();
  // горлова сумка
  nbCel(() => nbEllP(30, 16, 8 * throat, 8 * throat)(), Pb, 1.6);
  // голова: широкий рот
  g.strokeStyle = NB.OL; g.lineWidth = 2; g.lineCap = "round"; g.beginPath(); g.moveTo(37, 11); g.quadraticCurveTo(24, 16 + (atk ? 5 : 0), 6, 9); g.stroke();
  if (atk > .05){ const L = 18 + atk * 30; g.strokeStyle = NB.OL; g.lineWidth = 6; g.beginPath(); g.moveTo(32, 11); g.quadraticCurveTo(32 + L * .5, 8, 32 + L, 10); g.stroke(); g.strokeStyle = "#e0707a"; g.lineWidth = 3.6; g.stroke(); nbCel(nbCircP(32 + L, 10, 3.6), {b:"#e0707a", d:"#a04050", l:"#ffb0b8"}, 1.4); }
  // очі
  for (const [x, y, r] of [[14, -16, 8.5], [28, -9, 6.6]]){ nbCel(nbCircP(x, y, r), P, 2.2); g.fillStyle = "#f4dc4a"; g.beginPath(); g.arc(x + 1.2, y + .6, r * .7, 0, TAU); g.fill(); g.strokeStyle = NB.OL; g.lineWidth = .8; g.stroke(); g.fillStyle = "#120a06"; g.fillRect(x + .6, y + .6 - r * .62 * blink, 2.2, r * 1.24 * blink); g.fillStyle = "rgba(255,255,255,.85)"; g.beginPath(); g.arc(x - r * .1, y - r * .3, r * .18, 0, TAU); g.fill(); }
  // ближня задня лапа (велика)
  nbLimbs([[-14, 18, -22 - stretch * .6, 32, 13], [-22 - stretch * .6, 32, -4 - stretch * 1.6, 43 - hop * 4, 8]], P);
  nbCel(nbEllP(-2 - stretch * 1.6, 44 - hop * 4, 13, 3.6), P, 1.8);
  for (let i = 0; i < 3; i++){ g.fillStyle = P.d; g.beginPath(); g.arc(6 - stretch * 1.6 + i * 3.6, 44 - hop * 4, 1.8, 0, TAU); g.fill(); }
  // ближня передня
  nbLimbs([[18, 22, 24 + stretch * .5, 33, 7.5], [24 + stretch * .5, 33, 31 + stretch * .5, 43, 6]], P);
  nbCel(nbEllP(33 + stretch * .5, 44, 7, 3.2), P, 1.6);
  g.restore();
}
// ---------- духи ----------
function nbWisp(o){
  const {h, t, e, has, dsn, id, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, blink = nbBlink(t, seed);
  const col = dsn.eye || "#9fe0ff", P = nbPal(dsn.col, 1.1), base = dsn.col, sc = h / 100 * 1.45, bob = Math.sin(t * 2.2 + seed) * 4 - 6;
  g.save(); g.scale(sc, sc); g.translate(atk * 8, bob);
  g.fillStyle = "rgba(8,6,4,.18)"; g.beginPath(); g.ellipse(0, 52 - bob, 16 + Math.sin(t * 2.2 + seed) * 2, 3.4, 0, 0, TAU); g.fill();
  const orb = id === "spark" || id === "bg_wisp";
  g.save(); const gr = g.createRadialGradient(0, 0, 4, 0, 0, 52); gr.addColorStop(0, nbMix(col, "#ffffff", .1) + "88"); gr.addColorStop(1, col + "00"); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 52, 0, TAU); g.fill(); g.restore();
  if (orb){
    // язики полум'я
    for (let i = 0; i < 7; i++){ const a = i / 7 * TAU + t * (id === "spark" ? 3 : 1.2), L = 20 + Math.sin(t * 5 + i * 2) * 6 + (id === "spark" ? (i % 2) * 10 : 4);
      g.save(); g.rotate(a); nbCel(() => nbSmooth(g, [[10, -5], [L * .7, -4 + Math.sin(t * 6 + i) * 3], [L + 8, 0], [L * .7, 5 + Math.sin(t * 6 + i) * 3], [10, 5]], true), {b:nbMix(base, col, .3), d:P.d, l:col}, 1.6); g.restore(); }
    nbCel(nbCircP(0, 0, 17), {b:nbMix(base, col, .35), d:P.d, l:nbMix(col, "#fff", .4)}, 2.4);
    g.save(); g.shadowColor = col; g.shadowBlur = 14; g.fillStyle = nbMix(col, "#ffffff", .5); g.beginPath(); g.arc(-2, -2, 9, 0, TAU); g.fill(); g.restore();
    nbEye(5, -2, 3.2, "#2a1408", blink); nbEye(-5, -2, 2.8, "#2a1408", blink);
    g.strokeStyle = NB.OL; g.lineWidth = 1.6; g.beginPath(); g.arc(0, 4, 4, .2, Math.PI - .2); g.stroke();
  } else {
    // привид: голова + тільце з рваним хвостом
    const w1 = Math.sin(t * 3 + seed) * 4, w2 = Math.sin(t * 3.4 + seed + 1) * 5;
    const dark = id === "shade";
    const GP = nbPal(dark ? nbMix(base, "#1a0a28", .3) : base, 1.1);
    g.save(); g.globalAlpha = dark ? .95 : .88;
    nbCel(() => nbSmooth(g, [[-16, -6], [-14, -22], [0, -28], [14, -22], [16, -6], [14 + w1, 12], [18 + w2, 28], [8 + w1, 40], [2, 32 + w2 * .3], [-6 + w2, 42], [-14 + w1, 28], [-18 + w2, 12]], true), {b:GP.b, d:GP.d, l:nbMix(GP.hex, "#ffffff", .5)}, 2.2);
    g.restore();
    // руки-вихри
    g.strokeStyle = GP.l; g.globalAlpha = .75; g.lineWidth = 4; g.lineCap = "round"; for (const s of [-1, 1]){ g.beginPath(); g.moveTo(s * 14, 0); g.quadraticCurveTo(s * 26, 6 + Math.sin(t * 3 + s) * 4, s * 24 + atk * 8 * s, 18 + atk * (-12)); g.stroke(); } g.globalAlpha = 1;
    if (dark){ g.fillStyle = "#12081c"; g.beginPath(); g.moveTo(-14, -14); g.quadraticCurveTo(0, -34, 14, -14); g.lineTo(10, -4); g.quadraticCurveTo(0, -12, -10, -4); g.closePath(); g.fill(); g.strokeStyle = NB.OL; g.lineWidth = 1.6; g.stroke(); }
    // обличчя
    g.fillStyle = "rgba(10,6,14,.75)"; g.beginPath(); g.ellipse(2, -12, 10, 8.5, 0, 0, TAU); g.fill();
    nbEye(7, -13, 3.1, col, blink); nbEye(-3, -13, 2.8, col, blink); g.fillStyle = "rgba(10,6,14,.9)"; g.beginPath(); g.ellipse(2, -5, 3, 2 + atk * 3, 0, 0, TAU); g.fill();
    if (has("hair")){ g.strokeStyle = nbMix(base, "#2a6a4a", .5); g.lineWidth = 2.4; for (let i = -3; i <= 3; i++){ g.beginPath(); g.moveTo(i * 4, -26); g.quadraticCurveTo(i * 6 + Math.sin(t * 3 + i) * 5, -40, i * 7 + Math.sin(t * 2 + i) * 6, -50); g.stroke(); } }
    if (id === "ghost_mage"){ nbCel(() => nbPoly(g, [[-14, -22], [2, -52 + Math.sin(t * 2) * 2], [16, -22]]), {b:"#4a5a9a", d:"#2a3470", l:"#8a9ad8"}, 2); }
  }
  g.restore();
}
// ---------- павуки та скорпіони ----------
function nbSpider(o){
  const {h, t, e, has, dsn, id, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, blink = nbBlink(t, seed);
  const P = nbPal(dsn.col, 1.2), Pf = {b:P.d, d:P.dd, l:P.b}, moving = Math.abs(e.vx) > 30, ph = t * (moving ? 10 : 2.6) + seed, sc = h / 100 * 1.5;
  const scorp = id === "scorpion";
  g.save(); g.scale(sc, sc); g.translate(atk * 6, 0); nbGround(g, 44, 47);
  const legs = (far) => { const list = []; for (let i = 0; i < 4; i++){ const side = far ? -1 : 1; const hx = (i - 1.5) * 8 + 4, base = (i - 1.5) * 15 + (far ? -5 : 7) + 6, sw2 = Math.sin(ph + i * 1.3 + (far ? Math.PI : 0)) * (moving ? 8 : 1.5), lift = moving ? Math.max(0, Math.cos(ph + i * 1.3 + (far ? Math.PI : 0))) * 5 : 0;
      const fx = base * 1.5 + sw2, fy = 46 - lift, k = nbIK(hx, 8, fx, fy, 30, 28, -1); list.push([hx, 8, k[0], k[1] - 4, 4.4], [k[0], k[1] - 4, fx, fy, 3.2]); } return list; };
  nbLimbs(legs(true), Pf);
  if (scorp){
    // хвіст-жало
    const sw = Math.sin(t * 2 + seed) * 4 + atk * -10;
    nbLimbs([[-22, 14, -42, 4, 9], [-42, 4, -50 + sw * .3, -16, 8], [-50 + sw * .3, -16, -38 + sw, -34, 7]], P);
    nbCel(() => nbPoly(g, [[-40 + sw, -34], [-28 + sw, -42], [-33 + sw, -30]]), {b:"#e8d8a0", d:"#a89860", l:"#fff"}, 1.6);
    nbCel(nbEllP(-8, 18, 25, 13), P, 2.4);
    for (let i = 0; i < 5; i++){ g.strokeStyle = "rgba(20,10,5,.5)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-26 + i * 9, 8); g.quadraticCurveTo(-24 + i * 9, 18, -26 + i * 9, 28); g.stroke(); }
    // клешні
    for (const [dy, s] of [[-3, 1], [10, .85]]){ nbLimbs([[18, 14, 32, 8 + dy, 6 * s], [32, 8 + dy, 44 + atk * 8, 4 + dy, 5.4 * s]], P); nbCel(() => nbSmooth(g, [[42 + atk * 8, 4 + dy - 6 * s], [56 + atk * 8, 4 + dy - 2], [50 + atk * 8, 4 + dy + 3], [42 + atk * 8, 4 + dy + 5 * s]], true), P, 1.8); }
    nbCel(nbEllP(18, 14, 11, 9), P, 2.2); nbEye(22, 9, 2.4, dsn.eye || "#ffcf5a", blink); nbEye(15, 9, 2, dsn.eye || "#ffcf5a", blink);
  } else {
    nbCel(nbEllP(-14, 12, 26, 18), P, 2.6);
    g.save(); g.beginPath(); g.ellipse(-14, 12, 26, 18, 0, 0, TAU); g.clip(); const mk = id === "jal_king" ? "#e8d8a0" : "#d8c08a"; g.fillStyle = mk; g.globalAlpha = .9; g.beginPath(); g.moveTo(-14, -2); g.lineTo(-22, 12); g.lineTo(-14, 28); g.lineTo(-6, 12); g.closePath(); g.fill(); g.fillStyle = "#b02a1c"; g.fillRect(-15.5, 0, 3, 24); g.globalAlpha = 1; g.restore();
    nbCel(nbEllP(14, 10, 14, 12), P, 2.4);
    // жвала
    for (const dy of [3, 9]){ nbCel(() => nbPoly(g, [[24, 10 + dy - 2], [34 + atk * 6, 14 + dy + atk * 3], [26, 14 + dy]]), {b:"#e8dcc0", d:"#a89a7a", l:"#fff"}, 1.5); }
    for (const [x, y, r] of [[22, 2, 2.6], [17, 0, 2], [26, 6, 1.8], [12, 1, 1.6], [20, 6, 1.5]]) nbEye(x, y, r, dsn.eye || "#ff6a3a", blink);
  }
  nbLimbs(legs(false), P);
  g.restore();
}
// ---------- птахи, кажани, горгуль ----------
function nbBird(o){
  const {h, t, e, has, dsn, id, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, blink = nbBlink(t, seed);
  const P = nbPal(dsn.col, 1.15), Pw = {b:P.d, d:P.dd, l:P.b}, sc = h / 100 * 1.9, fl = Math.sin(t * (id === "gargoyle" ? 5 : 11) + seed), bob = Math.sin(t * 2 + seed) * 3 - 6;
  g.save(); g.scale(sc, sc); g.translate(atk * 8, bob); g.fillStyle = "rgba(8,6,4,.2)"; g.beginPath(); g.ellipse(0, 52 - bob, 18, 3.4, 0, 0, TAU); g.fill();
  const wing = (s, near) => { const up = fl * 22, Wp = near ? P : Pw; nbCel(() => nbSmooth(g, [[-2 * s, -6], [-14 * s, -30 - up], [-40 * s, -36 - up * 1.3], [-52 * s, -14 - up * .6], [-38 * s, -18 - up * .4], [-30 * s, -4 - up * .2], [-20 * s, 2], [-10 * s, 4]], true), Wp, 2.2);
    g.strokeStyle = "rgba(10,6,6,.5)"; g.lineWidth = 1.4; for (const k of [.5, .8]){ g.beginPath(); g.moveTo(-2 * s, -6); g.lineTo(-52 * s * k, -26 - up * k * 1.1 + 8); g.stroke(); } };
  if (id === "or_bats" || id === "mk_crow"){
    const bat = id === "or_bats";
    wing(-1, false);
    nbCel(nbEllP(0, 4, 13, 15), P, 2.4);
    if (!bat){ nbCel(() => nbSmooth(g, [[-6, 16], [-22, 22 + Math.sin(t * 4) * 3], [-8, 24]], true), P, 1.6); }
    nbCel(nbCircP(10, -10, 9), P, 2.2);
    if (bat){ nbCel(() => nbPoly(g, [[5, -16], [3, -30], [11, -17]]), P, 1.8); nbCel(() => nbPoly(g, [[12, -16], [17, -30], [18, -14]]), P, 1.8); nbEye(14, -10, 2.2, dsn.eye || "#ff3a3a", blink); nbFangs(15, -3, 2, 1.6, -1); }
    else { nbCel(() => nbPoly(g, [[17, -12], [32, -8 + atk * 4], [17, -6]]), {b:"#d8a850", d:"#a07828", l:"#f8d890"}, 1.6); nbEye(13, -12, 2.2, dsn.eye || "#ff3a3a", blink, {slit:0}); }
    wing(1, true);
    if (!bat){ g.strokeStyle = NB.OL; g.lineWidth = 2.6; for (const x of [-3, 5]){ g.beginPath(); g.moveTo(x, 16); g.lineTo(x + 1, 28 + Math.sin(t * 4 + x) * 2); g.stroke(); } }
  } else { // горгулья
    wing(-1, false);
    nbCel(() => nbSmooth(g, [[-14, -10], [0, -18], [14, -12], [16, 8], [8, 26], [-8, 26], [-16, 8]], true), P, 2.6);
    nbLimbs([[-8, 22, -10, 40, 9], [8, 22, 12, 40, 9]], P); nbCel(nbEllP(-9, 42, 8, 3.4), P, 1.8); nbCel(nbEllP(13, 42, 8, 3.4), P, 1.8);
    nbCel(nbCircP(2, -22, 11), P, 2.4);
    for (const s of [-1, 1]){ g.fillStyle = "#cfc6b4"; g.strokeStyle = NB.OL; g.lineWidth = 1.6; g.beginPath(); g.moveTo(2 + s * 5, -30); g.quadraticCurveTo(2 + s * 18, -34, 2 + s * 15, -46); g.quadraticCurveTo(2 + s * 8, -38, 2 + s * 2, -30); g.closePath(); g.fill(); g.stroke(); }
    nbEye(8, -22, 2.8, dsn.eye || "#ffb84f", blink); nbEye(-3, -22, 2.4, dsn.eye || "#ffb84f", blink); nbFangs(0, -14, 2, 1.8, 1);
    wing(1, true);
  }
  g.restore();
}
// ---------- кістяний пес (скелет-звір) ----------
function nbBoneBeast(o){
  const d2 = Object.assign({}, o.dsn, {col:"#e8e0cc", feat:["claws", "tail", "fangs"]}), o2 = Object.assign({}, o, {dsn:d2, id:"mk_hound", has:f => d2.feat.includes(f)});
  NEW_SHAPES.beast(o2);
  const g = ctx, h = o.h, sc = h / 100;
  g.save(); g.scale(sc, sc); g.strokeStyle = "rgba(20,12,8,.8)"; g.lineWidth = 1.8; for (let i = 0; i < 5; i++){ g.beginPath(); g.moveTo(-18 + i * 7, -14); g.quadraticCurveTo(-16 + i * 7, 2, -12 + i * 7, 8); g.stroke(); } g.restore();
}

// ---------- п'явки, гідри, змії, рої, мошка ----------
function nbLeech(o){
  const {h, t, e, dsn, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, P = nbPal(dsn.col, 1.2), sc = h / 100 * 1.5, big = (dsn.size || 1) > 1.2;
  g.save(); g.scale(sc, sc); g.translate(atk * 6, 0); nbGround(g, 40, 47);
  const arch = 18 + Math.sin(t * 3 + seed) * 6 + atk * 6, N = 9;
  for (let i = N - 1; i >= 0; i--){ const u = i / (N - 1), x = -34 + u * 68 + Math.sin(t * 3 + seed - u * 2) * 3, y = 44 - Math.sin(u * Math.PI) * (28 + arch * .4) - (u > .9 ? 4 : 0), r = 8 - Math.abs(u - .4) * 8 + 4;
    nbCel(nbCircP(x, y, r), {b:i % 2 ? P.b : P.d, d:P.dd, l:P.l}, 2); if (i === N - 1){ // голова зі ротом
      g.fillStyle = "#3a0a14"; g.beginPath(); g.ellipse(x + r * .6, y, r * .5, r * .65, 0, 0, TAU); g.fill(); g.strokeStyle = NB.OL; g.lineWidth = 1.2; g.stroke(); g.fillStyle = "#f4ecd8"; for (let k = -2; k <= 2; k++){ g.beginPath(); g.moveTo(x + r * .35, y + k * 2.1 - 1); g.lineTo(x + r * .9, y + k * 1.2); g.lineTo(x + r * .35, y + k * 2.1 + 1); g.fill(); }
      nbEye(x - r * .2, y - r * .55, 1.8, dsn.eye || "#ffcf5a", 1); } }
  g.restore();
}
function nbHydra(o){
  const {h, t, e, dsn, has, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, P = nbPal(dsn.col, 1.2), sc = h / 100 * 1.45, blink = nbBlink(t, seed), N = (dsn.size || 1) > 1.4 ? 5 : 3;
  g.save(); g.scale(sc, sc); nbGround(g, 44, 47);
  nbCel(() => nbSmooth(g, [[-36, 44], [-30, 22], [-10, 10], [14, 10], [34, 22], [40, 44], [0, 48]], true), P, 2.6);
  const heads = [];
  for (let i = 0; i < N; i++){ const u = (i - (N - 1) / 2) / ((N - 1) / 2 || 1), bx = u * 20, sw = Math.sin(t * 1.8 + i * 1.7 + seed) * 8, hx = u * 30 + sw + (i === N - 1 ? atk * 10 : 0), hy = -26 - (1 - Math.abs(u)) * 12 + Math.sin(t * 2.4 + i) * 3 + (i === N - 1 ? atk * 8 : 0);
    heads.push([i, bx, hx, hy]); }
  for (const [i, bx, hx, hy] of heads){ g.strokeStyle = NB.OL; g.lineWidth = 11; g.lineCap = "round"; g.beginPath(); g.moveTo(bx, 20); g.quadraticCurveTo(bx, hy + 18, hx, hy); g.stroke(); g.strokeStyle = i % 2 ? P.b : nbMix(dsn.col, "#ffffff", .06); g.lineWidth = 8.6; g.stroke(); g.strokeStyle = P.d; g.lineWidth = 3; g.beginPath(); g.moveTo(bx + 2.4, 20); g.quadraticCurveTo(bx + 2.4, hy + 18, hx + 2.4, hy); g.stroke(); }
  for (const [i, bx, hx, hy] of heads){ g.save(); g.translate(hx, hy); nbCel(() => nbSmooth(g, [[-9, 2], [-7, -7], [5, -8], [15, -3], [16, 3], [4, 6]], true), P, 2.2); nbEye(5, -3, 2.2, dsn.eye || "#ffcf3a", blink); nbFangs(8, 4, 2, 1.5, 1); g.strokeStyle = "#d04646"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(15, 1); g.lineTo(21 + Math.sin(t * 8 + i) * 2, 1); g.stroke(); g.restore(); }
  g.restore();
}
function nbSerpent(o){
  const {h, t, e, dsn, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, P = nbPal(dsn.col, 1.2), sc = h / 100 * 1.9, blink = nbBlink(t, seed);
  g.save(); g.scale(sc, sc); nbGround(g, 40, 47);
  const pts = []; for (let i = 0; i < 14; i++){ const u = i / 13, x = -36 + u * 46 + Math.sin(t * 2 + seed - u * 5) * 7 * (1 - u * .3), y = 42 - Math.pow(u, 1.5) * 60 - Math.sin(u * 8 + t) * 2; pts.push([x, y]); }
  pts[13][0] += atk * 14;
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < 13; i++){ const r = 4 + (1 - Math.abs(i / 13 - .55)) * 6, [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; g.lineCap = "round";
    g.strokeStyle = pass ? (i % 2 ? P.b : P.d) : NB.OL; g.lineWidth = pass ? r * 2 : r * 2 + 2.6; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  const [hx, hy] = pts[13]; g.save(); g.translate(hx, hy - 4);
  nbCel(() => nbSmooth(g, [[-10, 2], [-6, -8], [6, -9], [18, -3], [18, 4], [4, 7]], true), P, 2.2); nbEye(5, -3, 2.4, dsn.eye || "#caa030", blink, {slit:1}); nbFangs(10, 4, 2, 1.8, 1);
  g.strokeStyle = "#d04646"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(18, 1); g.lineTo(26, 1 + Math.sin(t * 9) * 2); g.stroke(); g.restore();
  g.restore();
}
function nbSwarm(o){
  const {h, t, e, dsn, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, sc = h / 100 * 1.9;
  g.save(); g.scale(sc, sc); g.fillStyle = "rgba(8,6,4,.2)"; g.beginPath(); g.ellipse(0, 47, 26, 3.6, 0, 0, TAU); g.fill();
  const N = 3; for (let i = 0; i < N; i++){ const ang = t * 1.4 + i / N * TAU + seed, rx = 18, x = Math.cos(ang) * rx + atk * 6, y = Math.sin(ang * 1.3) * 7 - 6 + (i - 1) * 6, z = Math.sin(ang);
    g.save(); g.translate(x, y); g.scale(.8 + z * .15, .8 + z * .15);
    g.globalAlpha = .5; const gr = g.createLinearGradient(0, 8, 0, 34); gr.addColorStop(0, (dsn.eye || "#9fe0ff") + "88"); gr.addColorStop(1, (dsn.eye || "#9fe0ff") + "00"); g.fillStyle = gr; g.beginPath(); g.moveTo(-8, 8); g.quadraticCurveTo(Math.sin(t * 4 + i) * 6, 22, 0, 34); g.quadraticCurveTo(8 + Math.sin(t * 4 + i) * 6, 22, 8, 8); g.fill(); g.globalAlpha = 1;
    nbSkull(g, 0, 0, 10, dsn.col, dsn.eye || "#9fe0ff", (Math.sin(t * 5 + i) > .6 || atk) ? 1 : 0, false, 1); g.restore(); }
  g.restore();
}
function nbMidges(o){
  const {h, t, e, dsn, reach} = o, g = ctx, seed = e.x || 0, atk = reach || 0, sc = h / 100 * 2.3;
  g.save(); g.scale(sc, sc);
  for (let i = 0; i < 26; i++){ const a = t * (1.5 + (i % 5) * .5) + i * 2.4 + seed, r = 6 + (i * 7) % 26, x = Math.cos(a) * r * 1.3 + atk * 8, y = Math.sin(a * 1.3) * r * .8 - 4 + Math.sin(t * 20 + i) * 1.2;
    g.fillStyle = "#1a1410"; g.beginPath(); g.ellipse(x, y, 2.4, 1.6, a, 0, TAU); g.fill(); g.fillStyle = "rgba(220,230,255,.55)"; g.beginPath(); g.ellipse(x, y - 2, 2.6, 1.1, Math.sin(t * 40 + i) * .5, 0, TAU); g.fill(); if (i % 6 === 0){ g.fillStyle = dsn.eye || "#ffcf3a"; g.fillRect(x + 1, y - .5, 1.2, 1.2); } }
  g.restore();
}
NEW_SHAPES.blob = function(o){ if (o.id === "merman" || o.id === "chosen_merman") return NEW_SHAPES.__biped(o); return nbFrog(o); };
Object.assign(NEW_SHAPES, {wisp:nbWisp, spider:nbSpider, bird:nbBird, bonebeast:nbBoneBeast, leech:nbLeech, hydra:nbHydra, serpent:nbSerpent, swarm:nbSwarm, midges:nbMidges});
for (const k of ["blob", "wisp", "spider", "bird", "bonebeast", "leech", "hydra", "serpent", "swarm", "midges"]) NEW_SHAPES[k].full = true;
