/* ============ нове тіло мобів: спільні інструменти ============
   Усе малюється у «сотенній» системі: фігура ≈ 100 одиниць заввишки, земля на y = +46, центр (0,0).
   Стиль: чітка темна обводка, пласка заливка + мультяшна тінь і блік, насичені кольори, об'ємні плавні форми. */
const NB = {OL:"#160f0c"};
function nbRGB(hex){ let h = (hex || "#888").replace("#", ""); if (h.length === 3) h = h.split("").map(x => x + x).join(""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
function nbHSL(hex){ const [r, g, b] = nbRGB(hex).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b); let hh = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn){ const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; } return [hh, s, l]; }
const nbHs = (h, s, l) => `hsl(${Math.round((h + 360) % 360)},${Math.round(Math.max(0, Math.min(1, s)) * 100)}%,${Math.round(Math.max(0, Math.min(1, l)) * 100)}%)`;
function nbMix(a, b, t){ const A = nbRGB(a), B = nbRGB(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); }
// палітра з одного кольору: основа, тінь (холодніша), блік (тепліший), темна основа
function nbPal(hex, sat){ const [h, s, l] = nbHSL(hex), S = Math.min(1, s * (sat || 1.12) + .04);
  return {b:nbHs(h, S, l), d:nbHs(h - 10, S * 1.05, l * .56), dd:nbHs(h - 14, S, l * .34), l:nbHs(h + 7, S * .95, Math.min(.88, l * 1.38 + .05)), hex}; }
// плавна крива через точки
function nbSmooth(g, pts, closed){ const n = pts.length, at = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < (closed ? n : n - 1); i++){ const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    g.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]); }
  if (closed) g.closePath(); }
const nbPoly = (g, pts) => { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); };
// заливка форми: основа + тінь знизу-справа + блік зверху-зліва + обводка. pathFn() додає контур у поточний шлях
function nbCel(pathFn, P, ol, o){
  const g = ctx; o = o || {}; g.save(); g.beginPath(); pathFn(); g.fillStyle = o.fill || P.b; g.fill();
  g.save(); g.clip();
  g.fillStyle = P.d; g.beginPath(); g.rect(-400, -400, 800, 800); g.save(); g.translate(o.sx === undefined ? -3.4 : o.sx, o.sy === undefined ? -4.2 : o.sy); pathFn(); g.restore(); g.fill("evenodd");
  g.globalAlpha = .55; g.fillStyle = P.l; g.beginPath(); g.rect(-400, -400, 800, 800); g.save(); g.translate(2.4, 3.2); pathFn(); g.restore(); g.fill("evenodd");
  g.restore();
  g.lineJoin = "round"; g.lineCap = "round"; g.lineWidth = ol === undefined ? 2.4 : ol; g.strokeStyle = NB.OL; g.beginPath(); pathFn(); g.stroke(); g.restore();
}
// кінцівки: [[x1,y1,x2,y2,w],...] — спершу всі обводки, потім заливки й тіні
function nbLimbs(list, P, ol){
  const g = ctx; ol = ol === undefined ? 2.4 : ol; g.save(); g.lineCap = "round"; g.lineJoin = "round";
  for (const [x1, y1, x2, y2, w] of list){ g.strokeStyle = NB.OL; g.lineWidth = w + ol; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  for (const [x1, y1, x2, y2, w] of list){ g.strokeStyle = P.b; g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  for (const [x1, y1, x2, y2, w] of list){ g.strokeStyle = P.d; g.lineWidth = w * .42; g.beginPath(); g.moveTo(x1 + w * .24, y1 + w * .2); g.lineTo(x2 + w * .24, y2 + w * .2); g.stroke();
    g.strokeStyle = P.l; g.globalAlpha = .5; g.lineWidth = w * .22; g.beginPath(); g.moveTo(x1 - w * .22, y1 - w * .2); g.lineTo(x2 - w * .22, y2 - w * .2); g.stroke(); g.globalAlpha = 1; }
  g.restore();
}
const nbEllP = (x, y, rx, ry, rot) => () => ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot || 0, 0, TAU);
const nbCircP = (x, y, r) => () => { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); };
// двокістковий IK: куди зігнеться «коліно»
function nbIK(hx, hy, fx, fy, L1, L2, dir){ let dx = fx - hx, dy = fy - hy, d = Math.hypot(dx, dy) || 1; const mx = L1 + L2 - .01; if (d > mx){ dx *= mx / d; dy *= mx / d; d = mx; }
  const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, L1 * L1 - a * a)), ux = dx / d, uy = dy / d;
  return [hx + ux * a - uy * hh * dir, hy + uy * a + ux * hh * dir, hx + dx, hy + dy]; }
// світле око з відблиском і блимання
function nbEye(x, y, r, col, blink, o){ const g = ctx; o = o || {};
  g.save(); g.fillStyle = "rgba(10,6,4,.85)"; g.beginPath(); g.ellipse(x, y, r * 1.25, r * 1.25 * Math.max(.18, blink), 0, 0, TAU); g.fill();
  g.shadowColor = col; g.shadowBlur = 7; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, r, r * Math.max(.15, blink) * (o.slit ? 1 : .9), 0, 0, TAU); g.fill(); g.shadowBlur = 0;
  if (o.slit){ g.fillStyle = "#120a08"; g.fillRect(x - r * .16, y - r * .9 * blink, r * .32, r * 1.8 * blink); }
  else if (blink > .5){ g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.arc(x - r * .3, y - r * .3, r * .28, 0, TAU); g.fill(); }
  g.restore(); }
const nbBlink = (t, s) => ((Math.sin(t * 1.7 + s) + Math.sin(t * .6 + 1.3)) * .5 > .93) ? .15 : 1;
function nbFangs(x, y, n, sz, dir){ ctx.fillStyle = "#f4ecd8"; ctx.strokeStyle = NB.OL; ctx.lineWidth = .8; for (let i = 0; i < n; i++){ const px = x + i * (sz * 1.5) * (dir || 1); ctx.beginPath(); ctx.moveTo(px - sz * .5, y); ctx.lineTo(px + sz * .5, y); ctx.lineTo(px, y + sz * 1.6); ctx.closePath(); ctx.fill(); ctx.stroke(); } }
