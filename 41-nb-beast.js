/* ============ нові звірі: вовк, щур, вепр, тигр/рись, ведмідь, кінь ============ */
const NB_KIND = {
  wolf:{head:"wolf", sc:1, tail:"bush", ruff:1, belly:"#d8cdb4", lanky:1},
  rat:{head:"rat", sc:.82, tail:"whip", hunch:7, short:1, belly:"#e0c4b4"},
  boar:{head:"boar", sc:1.05, tail:"curl", hump:9, short:1, bristle:1, belly:"#8a6a50"},
  cat:{head:"cat", sc:1.05, tail:"long", stripes:1, belly:"#f2e4c4", lanky:1},
  lynx:{head:"cat", sc:.95, tail:"stub", tufts:1, belly:"#efe3c8", lanky:1},
  bear:{head:"bear", sc:1.12, tail:"stub", hump:7, short:1, thick:1, belly:"#7a5a3c"},
  horse:{head:"horse", sc:1.15, tail:"mane", lanky:1, long:1, belly:"#eef4fa"},
};
function nbBeastKind(id, dsn, has){
  if (id === "rat") return NB_KIND.rat; if (id === "boar") return NB_KIND.boar; if (id === "tiger") return NB_KIND.cat; if (id === "pet_lynx") return NB_KIND.lynx;
  if (id === "pet_bear") return NB_KIND.bear; if (id === "or_ghost_horse") return NB_KIND.horse;
  if (has("horns") && !has("tail")) return NB_KIND.boar; return NB_KIND.wolf;
}
function nbBeastHead(g, kind, P, Pb, eye, blink, jaw, has, t){
  const lipY = 6;
  const jawAng = jaw * .55;
  const lowerJaw = (pts) => { g.save(); g.translate(5, 6); g.rotate(jawAng); g.translate(-5, -6); nbCel(() => nbSmooth(g, pts, true), Pb.b ? Pb : P, 2); g.restore(); };
  if (kind.head === "wolf"){
    // дальнє вухо
    nbCel(() => nbPoly(g, [[4, -12], [10, -33], [17, -11]]), {b:P.d, d:P.dd, l:P.b}, 2);
    lowerJaw([[4, 6], [20, 6], [31, 9], [24, 15], [8, 14]]);
    nbCel(() => nbSmooth(g, [[-11, -6], [-4, -14], [8, -12], [18, -7], [29, -4], [35, 1], [33, 6], [23, 7], [14, 8], [4, 12], [-6, 9], [-12, 1]], true), P, 2.4);
    // світла щока й морда
    nbCel(() => nbSmooth(g, [[12, 0], [24, -1], [33, 2], [30, 6], [18, 8], [8, 6]], true), Pb, 0, {sx:-1.5, sy:-2});
    nbCel(() => nbPoly(g, [[-7, -9], [-10, -31], [3, -14]]), P, 2.2);
    g.fillStyle = "#e8a0a0"; g.globalAlpha = .55; g.beginPath(); g.moveTo(-6, -13); g.lineTo(-8, -26); g.lineTo(0, -14); g.fill(); g.globalAlpha = 1;
    g.fillStyle = "#0c0806"; g.beginPath(); g.ellipse(35, 1, 3, 2.3, .3, 0, TAU); g.fill();
    g.strokeStyle = NB.OL; g.lineWidth = 1.2; g.beginPath(); g.moveTo(29, 6); g.quadraticCurveTo(20, 9 + jaw * 5, 11, 8); g.stroke();
    nbEye(16, -4, 2.6, eye, blink, {slit:1});
    g.strokeStyle = NB.OL; g.lineWidth = 1.6; g.beginPath(); g.moveTo(10, -9); g.lineTo(21, -6); g.stroke();
    if (has("fangs")) nbFangs(26, 7, 2, 1.7, -1);
  } else if (kind.head === "rat"){
    nbCel(() => nbCircP(-6, -10, 9)(), {b:"#d89a9a", d:"#a86a72", l:"#f0c0c0"}, 2);
    lowerJaw([[8, 6], [20, 6], [27, 8], [18, 12]]);
    nbCel(() => nbSmooth(g, [[-10, -4], [-3, -10], [8, -9], [20, -4], [32, 1], [33, 5], [22, 8], [10, 9], [0, 10], [-9, 5]], true), P, 2.4);
    nbCel(() => nbSmooth(g, [[10, 0], [24, 0], [31, 3], [20, 7], [10, 6]], true), Pb, 0, {sx:-1, sy:-1.5});
    g.fillStyle = "#e07080"; g.beginPath(); g.arc(33, 2, 2.6, 0, TAU); g.fill(); g.strokeStyle = NB.OL; g.lineWidth = .8; g.stroke();
    g.strokeStyle = "rgba(240,230,210,.9)"; g.lineWidth = .9; for (const dy of [-2, 1, 4]){ g.beginPath(); g.moveTo(24, 3 + dy * .3); g.quadraticCurveTo(34, dy + 1, 40, dy * 1.8 + 1); g.stroke(); }
    nbEye(10, -3, 2.6, eye, blink);
    nbFangs(26, 8, 2, 1.8, -1);
  } else if (kind.head === "boar"){
    lowerJaw([[2, 6], [20, 8], [30, 10], [22, 16], [6, 15]]);
    nbCel(() => nbPoly(g, [[-2, -13], [4, -26], [11, -11]]), P, 2);
    nbCel(() => nbSmooth(g, [[-14, -4], [-8, -14], [6, -14], [20, -8], [32, -2], [37, 4], [34, 11], [22, 12], [8, 13], [-6, 10], [-14, 4]], true), P, 2.4);
    nbCel(() => nbEllP(36, 4, 5.5, 6.5, .1)(), {b:"#c8808a", d:"#9a5864", l:"#e8b0b6"}, 2);
    g.fillStyle = "#1a0c0c"; g.beginPath(); g.ellipse(36, 2.5, 1.2, 1.6, 0, 0, TAU); g.ellipse(36, 7, 1.2, 1.6, 0, 0, TAU); g.fill();
    // ікла
    for (const [bx, by, s] of [[26, 11, 1], [18, 12, .8]]){ g.fillStyle = "#f4ecd8"; g.strokeStyle = NB.OL; g.lineWidth = 1.2; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + 9 * s, by - 2, bx + 8 * s, by - 13 * s); g.quadraticCurveTo(bx + 4 * s, by - 5, bx - 3, by - 1); g.closePath(); g.fill(); g.stroke(); }
    nbEye(14, -5, 2.4, eye, blink);
    g.strokeStyle = NB.OL; g.lineWidth = 2; g.beginPath(); g.moveTo(8, -10); g.lineTo(20, -6); g.stroke();
  } else if (kind.head === "cat"){
    nbCel(() => nbPoly(g, [[4, -12], [9, -28], [17, -12]]), {b:P.d, d:P.dd, l:P.b}, 2);
    lowerJaw([[6, 6], [18, 6], [24, 9], [16, 13], [6, 12]]);
    nbCel(() => nbSmooth(g, [[-12, -2], [-8, -12], [4, -14], [16, -10], [26, -3], [28, 4], [22, 9], [10, 12], [-4, 11], [-12, 6]], true), P, 2.4);
    nbCel(() => nbSmooth(g, [[10, 1], [22, -1], [28, 4], [21, 9], [11, 8]], true), Pb, 0, {sx:-1.2, sy:-1.5});
    nbCel(() => nbPoly(g, [[-8, -10], [-11, -28], [2, -13]]), P, 2.2);
    if (kind.tufts){ g.strokeStyle = NB.OL; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-11, -28); g.lineTo(-12.5, -35); g.moveTo(2, -13); g.lineTo(5, -19); g.stroke(); }
    g.fillStyle = "#e08a8a"; g.beginPath(); g.moveTo(28, 1); g.lineTo(24, 0); g.lineTo(27, 4); g.closePath(); g.fill();
    g.strokeStyle = "rgba(255,250,235,.85)"; g.lineWidth = .9; for (const dy of [-1, 2]){ g.beginPath(); g.moveTo(21, 4 + dy * .3); g.lineTo(35, dy * 2 + 2); g.stroke(); }
    nbEye(11, -3, 2.7, eye, blink, {slit:1});
    if (has("fangs")) nbFangs(20, 8, 2, 1.8, -1);
  } else if (kind.head === "bear"){
    nbCel(() => nbCircP(-4, -13, 6)(), P, 2);
    nbCel(() => nbCircP(7, -14, 5)(), {b:P.d, d:P.dd, l:P.b}, 2);
    lowerJaw([[6, 7], [20, 7], [27, 10], [19, 15], [6, 14]]);
    nbCel(() => nbSmooth(g, [[-14, -2], [-9, -12], [4, -15], [16, -10], [26, -3], [30, 4], [25, 10], [10, 14], [-4, 13], [-14, 6]], true), P, 2.4);
    nbCel(() => nbSmooth(g, [[12, 0], [24, 0], [30, 5], [24, 10], [12, 10]], true), {b:nbMix(dsn0(P), "#d8b890", .5), d:P.d, l:P.l}, 0, {sx:-1.2, sy:-1.5});
    g.fillStyle = "#0e0806"; g.beginPath(); g.ellipse(29, 3, 3.2, 2.5, 0, 0, TAU); g.fill();
    nbEye(11, -4, 2.3, eye, blink);
    g.strokeStyle = NB.OL; g.lineWidth = 1.6; g.beginPath(); g.moveTo(6, -9); g.lineTo(16, -7); g.stroke();
    if (has("fangs")) nbFangs(22, 9, 2, 1.8, -1);
  } else { // horse
    nbCel(() => nbPoly(g, [[-6, -14], [-6, -34], [2, -15]]), {b:P.d, d:P.dd, l:P.b}, 2);
    lowerJaw([[8, 8], [28, 12], [40, 16], [34, 20], [10, 16]]);
    nbCel(() => nbSmooth(g, [[-12, -8], [-4, -16], [6, -12], [20, 0], [36, 8], [42, 14], [38, 19], [24, 17], [8, 14], [-6, 8]], true), P, 2.4);
    nbCel(() => nbPoly(g, [[-2, -14], [-3, -35], [6, -15]]), P, 2.2);
    g.fillStyle = "#101420"; g.beginPath(); g.ellipse(40, 14, 2.4, 3, .5, 0, TAU); g.fill();
    nbEye(10, -2, 2.5, eye, blink);
    // грива
    g.fillStyle = P.l; g.strokeStyle = NB.OL; g.lineWidth = 1.4; for (let i = 0; i < 5; i++){ const x = -14 + i * 4; g.beginPath(); g.moveTo(x, -14 + i * 2); g.quadraticCurveTo(x - 8 + Math.sin(t * 3 + i) * 3, -4 + i * 2, x - 6, 8 + i * 3 + Math.sin(t * 3 + i) * 2); g.quadraticCurveTo(x - 1, 0, x + 4, -12 + i * 2); g.fill(); g.stroke(); }
  }
}
const dsn0 = P => P.hex;
NEW_SHAPES.beast = function(o){
  if (o.id === "troll") return NEW_SHAPES.__biped(Object.assign({}, o, {dsn:Object.assign({}, o.dsn, {shape:"giant", prop:"club"})}));
  const {h, t, e, has, dsn, id, reach} = o, K = nbBeastKind(id, dsn, has), g = ctx, seed = e.x || 0, atk = reach || 0;
  const P = nbPal(dsn.col), Pb = nbPal(nbMix(dsn.col, K.belly || "#e6d9bd", .55)), Pf = {b:P.d, d:P.dd, l:P.b, dd:P.dd};
  const moving = Math.abs(e.vx) > 30, ph = t * (moving ? 9 : 2.4) + seed, amp = moving ? 9 : 1.4, blink = nbBlink(t, seed);
  const sc = h / 100 * (K.sc || 1), br = 1 + Math.sin(t * 2 + seed) * .018, bob = (moving ? Math.abs(Math.sin(ph)) * -2.2 : 0);
  g.save(); g.scale(sc, sc); g.translate(atk * 7, bob);
  const gy = 46, hunch = K.hunch || 0, hump = K.hump || 0, ly = K.short ? 34 : 44, legW = K.thick ? 11 : K.short ? 7.5 : 6.2;
  // тінь на землі
  g.fillStyle = "rgba(8,6,4,.32)"; g.beginPath(); g.ellipse(-2, gy + 1, 46 * (K.long ? 1.1 : 1), 5, 0, 0, TAU); g.fill();
  g.save(); g.translate(0, gy); g.scale(1, br); g.translate(0, -gy);
  // ноги: дальні
  const foot = (bx, off, ph2) => { const s = Math.sin(ph + off), lift = moving ? Math.max(0, Math.cos(ph + off)) * 5 : 0; return [bx + s * amp, gy - lift + (K.short ? -3 : 0)]; };
  const legs = [];
  const mkLeg = (hx, hy, bx, off, front, far) => { const [fx, fy] = foot(bx, off), a = front ? nbIK(hx, hy, fx, fy - 3, K.short ? 14 : 20, K.short ? 14 : 20, -1) : nbIK(hx, hy, fx - 5, fy - 11, K.short ? 14 : 19, K.short ? 12 : 16, 1);
    const L = front ? [[hx, hy, a[0], a[1], legW + 2], [a[0], a[1], fx, fy - 3, legW]] : [[hx, hy, a[0], a[1], legW + 4], [a[0], a[1], fx - 5, fy - 11, legW], [fx - 5, fy - 11, fx, fy - 3, legW - 1]];
    return {L, fx, fy, far}; };
  const lg = [mkLeg(-22, 2 + hunch * .3, -28, 3.2, 0, 1), mkLeg(18, 6, 18, 0, 1, 1)];
  for (const l of lg){ nbLimbs(l.L, Pf); nbCel(nbEllP(l.fx + 2, l.fy - 1, 6.2, 3.2), Pf, 1.6); }
  // хвіст
  const wag = Math.sin(t * 3 + seed) * 5 + (moving ? 3 : 0), ty = -6 - hunch * .4;
  if (K.tail === "bush") nbCel(() => nbSmooth(g, [[-30, ty - 4], [-44, ty - 12 + wag * .5], [-60, ty - 8 + wag], [-70, ty + 2 + wag], [-58, ty + 4 + wag], [-44, ty + 2 + wag * .4], [-30, ty + 5]], true), P, 2.2);
  else if (K.tail === "whip"){ g.strokeStyle = NB.OL; g.lineWidth = 4.8; g.lineCap = "round"; g.beginPath(); g.moveTo(-30, ty + 2); g.quadraticCurveTo(-52, ty + 6 + wag, -62, ty - 6 + wag * 1.6); g.stroke(); g.strokeStyle = "#d89aa0"; g.lineWidth = 2.4; g.stroke(); }
  else if (K.tail === "long"){ g.strokeStyle = NB.OL; g.lineWidth = 8.4; g.lineCap = "round"; g.beginPath(); g.moveTo(-30, ty); g.quadraticCurveTo(-54, ty + 8 + wag, -64, ty - 12 + wag * 1.5); g.stroke(); g.strokeStyle = P.b; g.lineWidth = 5.6; g.stroke(); g.strokeStyle = "#2a1a10"; g.lineWidth = 5.6; g.setLineDash([3, 4]); g.stroke(); g.setLineDash([]); }
  else if (K.tail === "curl"){ g.strokeStyle = NB.OL; g.lineWidth = 4.6; g.lineCap = "round"; g.beginPath(); g.moveTo(-32, ty - 4); g.quadraticCurveTo(-42, ty - 14, -37, ty - 20 + wag * .3); g.stroke(); g.strokeStyle = P.d; g.lineWidth = 2.4; g.stroke(); }
  else if (K.tail === "stub") nbCel(nbEllP(-34, ty - 2, 6, 5), P, 2);
  else if (K.tail === "mane") nbCel(() => nbSmooth(g, [[-30, ty - 4], [-46, ty - 2 + wag * .4], [-58, ty + 16 + wag], [-50, ty + 30 + wag], [-42, ty + 14], [-30, ty + 6]], true), {b:P.l, d:P.b, l:"#fff"}, 2.2);
  // тулуб
  const back = [[-36, -2 - hunch * .2], [-30, -17 - hunch], [-10, -22 - hunch * 1.2 - hump * .4], [12, -23 - hump], [26, -18 - hump * .6], [34, -6], [30, 9], [10, 13], [-14, 11], [-32, 9]];
  nbCel(() => nbSmooth(g, back, true), P, 2.5);
  nbCel(() => nbSmooth(g, [[-26, 4], [-8, 9], [14, 10], [28, 6], [26, 11], [8, 14], [-14, 12], [-30, 10]], true), Pb, 0, {sx:0, sy:-2});
  // візерунки
  g.save(); g.beginPath(); nbSmooth(g, back, true); g.clip();
  if (K.stripes){ g.strokeStyle = "#241408"; g.lineCap = "round"; for (let i = 0; i < 6; i++){ const x = -26 + i * 10; g.lineWidth = 2.6 - (i % 2) * .6; g.beginPath(); g.moveTo(x, -26); g.quadraticCurveTo(x + 4, -12, x - 1, 2 + (i % 2) * 3); g.stroke(); } }
  if (K.bristle || K.ruff){ g.fillStyle = P.l; g.globalAlpha = .55; for (let i = 0; i < 8; i++){ g.beginPath(); g.moveTo(-10 + i * 5, -14); g.lineTo(-8 + i * 5, -6); g.lineTo(-6 + i * 5, -14); g.fill(); } g.globalAlpha = 1; }
  g.restore();
  // щетина/загривок
  if (K.bristle || K.ruff || K.horse){ g.fillStyle = K.bristle ? "#1a120c" : P.d; g.strokeStyle = NB.OL; g.lineWidth = 1.4; const n = K.bristle ? 9 : 7;
    for (let i = 0; i < n; i++){ const x = -8 + i * (K.bristle ? 3.6 : 4.8), yb = -22 - hunch * 1.2 - hump * (x < 14 ? .8 : .6) + (x > 14 ? 4 : 0), sw = Math.sin(t * 2.2 + i) * .8; g.beginPath(); g.moveTo(x - 3, yb + 3); g.lineTo(x + 1 + sw, yb - (K.bristle ? 10 : 8) - (i % 2) * 3); g.lineTo(x + 4, yb + 3); g.closePath(); g.fill(); g.stroke(); } }
  // голова на шиї
  const hx = 40 + atk * 10, hy = -18 - hump * .5 - (K.head === "horse" ? 8 : 0) + Math.sin(t * 2 + seed) * 1.1, tilt = -.06 - atk * .2 + (moving ? Math.sin(ph) * .03 : 0);
  nbLimbs([[22, -8 - hump * .4, hx - 6, hy + 3, K.thick ? 26 : K.short ? 22 : 17]], P);
  g.save(); g.translate(hx, hy); g.rotate(tilt); nbBeastHead(g, K, P, Pb, dsn.eye || "#ff3a2a", blink, atk ? .7 : (Math.max(0, Math.sin(t * .9 + seed) - .93) * 7), has, t); g.restore();
  // ближні ноги
  const nl = [mkLeg(-20, 3 + hunch * .3, -26, 3.2 + Math.PI, 0, 0), mkLeg(22, 7, 22, Math.PI, 1, 0)];
  for (const l of nl){ nbLimbs(l.L, P); nbCel(nbEllP(l.fx + 2, l.fy - 1, 6.8, 3.4), P, 1.8);
    if (has("claws")){ g.fillStyle = "#efe6d0"; for (let i = 0; i < 3; i++){ g.beginPath(); g.moveTo(l.fx + 5 + i * 1.6, l.fy - 1); g.lineTo(l.fx + 9 + i * 1.6, l.fy + 1.5); g.lineTo(l.fx + 4 + i * 1.6, l.fy + 1.5); g.fill(); } } }
  // роги (вепр/троль-звір)
  if (has("horns") && !(K.head === "boar" && 0)){ g.save(); g.translate(hx, hy); g.rotate(tilt); g.fillStyle = "#e8dcc0"; g.strokeStyle = NB.OL; g.lineWidth = 1.5; for (const dx of [-4, 4]){ g.beginPath(); g.moveTo(dx, -12); g.quadraticCurveTo(dx - 10, -24, dx - 2, -32); g.quadraticCurveTo(dx - 3, -22, dx + 4, -12); g.closePath(); g.fill(); g.stroke(); } g.restore(); }
  g.restore(); g.restore();
};
