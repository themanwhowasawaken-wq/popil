/* ============ нові типи тіла мобів ============
   Кожна функція малює в тій самій системі координат, що й drawDemonBody: центр у (0,0), w і h — розмір тіла, ноги на h*0.55.
   o: {w, h, t, R, R2, eye, eyes, px, tri, m, has, dsn, id, reach} */
const OUTL = "rgba(14,11,9,.85)";
function nb_line(x1, y1, x2, y2, wd, col){ ctx.lineCap = "round"; ctx.strokeStyle = OUTL; ctx.lineWidth = wd + 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function nb_circ(x, y, r, col, out){ ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); if (out !== false){ ctx.strokeStyle = OUTL; ctx.lineWidth = 1; ctx.stroke(); } }
function nb_ell(x, y, rx, ry, col, rot){ ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot || 0, 0, TAU); ctx.fill(); }
function nb_poly(pts, col, out){ ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fill(); if (out){ ctx.strokeStyle = OUTL; ctx.lineWidth = 1; ctx.stroke(); } }
function nb_arc(x, y, r, a0, a1, wd, col){ ctx.lineCap = "round"; ctx.strokeStyle = OUTL; ctx.lineWidth = wd + 2; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); }
function nb_glowDot(x, y, r, col){ ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
// череп: кругле склепіння, щелепа, темні очниці з вогниками
function nb_skull(x, y, r, bone, eye, jaw){
  nb_circ(x, y, r, bone); px2(x - r * .62, y + r * .55, r * 1.24, r * .5 + (jaw || 0) * r * .4, bone);
  ctx.fillStyle = "rgba(20,14,10,.9)"; ctx.beginPath(); ctx.ellipse(x - r * .4, y + r * .02, r * .28, r * .32, 0, 0, TAU); ctx.ellipse(x + r * .4, y + r * .02, r * .28, r * .32, 0, 0, TAU); ctx.fill();
  nb_glowDot(x - r * .4, y + r * .04, r * .13, eye); nb_glowDot(x + r * .4, y + r * .04, r * .13, eye);
  ctx.fillStyle = "rgba(20,14,10,.9)"; ctx.beginPath(); ctx.moveTo(x - r * .1, y + r * .45); ctx.lineTo(x, y + r * .28); ctx.lineTo(x + r * .1, y + r * .45); ctx.fill();
  for (let k = 1; k < 4; k++) px2(x - r * .62 + r * 1.24 * k / 4 - .4, y + r * .58, .8, r * .38, "rgba(20,14,10,.7)");
}
function px2(x, y, w, h, c){ ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
function nb_sword(x, y, h, ang, len){ ctx.save(); ctx.translate(x, y); ctx.rotate(ang); px2(-1.6, -h * (len || .5), 3.2, h * (len || .5), "#9aa0ac"); px2(-1.6, -h * (len || .5), 1.2, h * (len || .5), "#d6dae2"); px2(-h * .08, -1.5, h * .16, 3, "#3a2a1a"); px2(-1.4, 0, 2.8, h * .08, "#5a4326"); ctx.restore(); }
function nb_bow(x, y, h){ ctx.strokeStyle = "#6a4a26"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x + h * .12, y, h * .3, Math.PI * .62, Math.PI * 1.38); ctx.stroke(); ctx.strokeStyle = "rgba(230,220,200,.8)"; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(x + h * .12 + Math.cos(Math.PI * .62) * h * .3, y + Math.sin(Math.PI * .62) * h * .3); ctx.lineTo(x + h * .12 + Math.cos(Math.PI * 1.38) * h * .3, y + Math.sin(Math.PI * 1.38) * h * .3); ctx.stroke(); }
function nb_spear(x, y, h, ang){ ctx.save(); ctx.translate(x, y); ctx.rotate(ang); px2(-1.3, -h * .75, 2.6, h * 1.05, "#6a4a26"); nb_poly([-3, -h * .75, 0, -h * .9, 3, -h * .75], "#c8ccd4", true); ctx.restore(); }
function nb_staff(x, y, h, eye){ px2(x - 1.3, y - h * .55, 2.6, h * .95, "#5a3a20"); nb_glowDot(x, y - h * .58, Math.max(2, h * .05), eye || "#9fe0ff"); }
function nb_crown(x, y, r){ nb_poly([x - r, y + r * .5, x - r * .8, y - r * .4, x - r * .35, y + r * .1, x, y - r * .6, x + r * .35, y + r * .1, x + r * .8, y - r * .4, x + r, y + r * .5], "#e0b04a", true); nb_glowDot(x, y + r * .1, r * .14, "#ff4a4a"); }
function nb_shield(x, y, r, col){ nb_circ(x, y, r, col || "#6a4a26"); ctx.strokeStyle = "#a07a3e"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, y, r * .72, 0, TAU); ctx.stroke(); nb_circ(x, y, r * .26, "#c9a24a"); }

const NEW_SHAPES = {
  skeleton(o){
    const {w, h, m, R, R2, eye, has, dsn, reach} = o, bone = R[3], bw = Math.max(1.6, w * .07), st = m.leg * (Math.abs(o.e.vx) > 30 ? 3 : 0);
    if (has("cape")){ const sw = Math.sin(o.t * 2) * w * .05; nb_poly([-w * .22, -h * .14, w * .22, -h * .14, w * .34 + sw, h * .4, -w * .34 + sw, h * .4], R2[1], true); }
    nb_line(-w * .1, h * .2, -w * .14, h * .38 + st, bw, bone); nb_line(-w * .14, h * .38 + st, -w * .13, h * .54, bw, bone);
    nb_line(w * .1, h * .2, w * .14, h * .38 - st, bw, bone); nb_line(w * .14, h * .38 - st, w * .15, h * .54, bw, bone);
    px2(-w * .2, h * .53, w * .12, h * .03, bone); px2(w * .08, h * .53, w * .12, h * .03, bone);
    nb_ell(0, h * .2, w * .17, h * .055, bone);
    nb_line(0, h * .2, 0, -h * .14, bw * .9, R[2]);
    for (let i = 0; i < 3; i++) nb_arc(0, -h * .02 + i * h * .07, w * (.2 - i * .02), Math.PI * 1.1, Math.PI * 1.9, bw * .7, bone);
    for (let i = 0; i < 3; i++) nb_arc(0, -h * .1 + i * h * .07, w * (.2 - i * .02), Math.PI * .1, Math.PI * .9, bw * .7, bone);
    nb_line(-w * .2, -h * .13, w * .2, -h * .13, bw * .8, bone);
    const aL = m.arm * 3, aR = m.armR * 3;
    if (has("shield")) nb_shield(-w * .36, h * .06 + aL * .5, w * .18, R2[1]);
    nb_line(-w * .2, -h * .12, -w * .3, h * .04 + aL, bw * .8, bone); nb_line(-w * .3, h * .04 + aL, -w * .28, h * .18 + aL, bw * .8, bone);
    const hx = w * .32 + reach * w * .2, hy = h * .12 - aR - reach * h * .1;
    nb_line(w * .2, -h * .12, w * .3, h * .02 - aR, bw * .8, bone); nb_line(w * .3, h * .02 - aR, hx, hy, bw * .8, bone);
    if (dsn.prop === "bow") nb_bow(-w * .3, h * .05 + aL, h); else if (dsn.prop === "sword") nb_sword(hx, hy, h, .45 + Math.sin(o.t * 2) * .05);
    else if (dsn.prop === "spear") nb_spear(hx, hy, h, .2 + reach * .5); else if (dsn.prop === "staff") nb_staff(hx, hy, h, eye);
    nb_skull(0, -h * .3, w * .19, bone, eye, reach);
    if (has("crown")){ ctx.fillStyle = "#e0b04a"; ctx.beginPath(); ctx.moveTo(-w * .17, -h * .4); ctx.lineTo(-w * .1, -h * .52); ctx.lineTo(0, -h * .43); ctx.lineTo(w * .1, -h * .52); ctx.lineTo(w * .17, -h * .4); ctx.closePath(); ctx.fill(); }
    if (has("horns")) for (const s of [-1, 1]) nb_poly([s * w * .14, -h * .38, s * w * .32, -h * .52, s * w * .2, -h * .34], R2[2], true);
  },
  bonebeast(o){
    const {w, h, m, R, eye, t} = o, bone = R[3], bw = Math.max(1.6, w * .07), st = m.leg * (Math.abs(o.e.vx) > 30 ? 4 : 1.2);
    for (let i = 0; i < 4; i++){ const x = -w * .5 - i * w * .07, y = -h * .02 - i * h * .07 + Math.sin(t * 3 + i) * 1.5; nb_circ(x, y, w * .04, bone); }
    const legs = [[-w * .3, st], [-w * .14, -st], [w * .14, -st], [w * .3, st]];
    for (const [x, s] of legs){ nb_line(x, h * .04, x - w * .03, h * .3 + s, bw, bone); nb_line(x - w * .03, h * .3 + s, x, h * .53, bw, bone); }
    ctx.strokeStyle = OUTL; ctx.lineWidth = bw + 3; ctx.beginPath(); ctx.moveTo(-w * .42, 0); ctx.quadraticCurveTo(0, -h * .12, w * .3, -h * .04); ctx.stroke();
    ctx.strokeStyle = bone; ctx.lineWidth = bw + 1; ctx.beginPath(); ctx.moveTo(-w * .42, 0); ctx.quadraticCurveTo(0, -h * .12, w * .3, -h * .04); ctx.stroke();
    for (let i = 0; i < 5; i++){ const x = -w * .2 + i * w * .09; nb_line(x, -h * .07, x + w * .02, h * .1, bw * .6, bone); }
    const hx = w * .42, hy = -h * .12;
    nb_poly([hx - w * .1, hy - h * .08, hx + w * .2, hy - h * .02, hx + w * .22, hy + h * .05, hx - w * .06, hy + h * .08], bone, true);
    const jaw = o.reach > .05 ? h * .08 : h * .02;
    nb_poly([hx - w * .04, hy + h * .06, hx + w * .2, hy + h * .06 + jaw, hx - w * .02, hy + h * .1 + jaw * .5], R[2], true);
    for (let k = 0; k < 3; k++) px2(hx + w * .04 + k * w * .05, hy + h * .05, 1.2, 2.4, "#f4efe2");
    nb_poly([hx - w * .06, hy - h * .07, hx - w * .02, hy - h * .2, hx + w * .04, hy - h * .06], bone, true);
    ctx.fillStyle = "rgba(20,14,10,.9)"; ctx.beginPath(); ctx.ellipse(hx + w * .03, hy - h * .02, w * .045, h * .03, 0, 0, TAU); ctx.fill(); nb_glowDot(hx + w * .03, hy - h * .02, w * .025, eye);
  },
  swarm(o){
    const {w, h, t, R, eye} = o, bone = R[4];
    const sk = [[-w * .26, -h * .1, w * .17, 0], [w * .24, -h * .22, w * .14, 1.7], [w * .02, h * .14, w * .2, 3.1]];
    for (const [x0, y0, r, ph] of sk){ const x = x0 + Math.sin(t * 1.6 + ph) * w * .05, y = y0 + Math.cos(t * 2.1 + ph) * h * .05;
      const g = ctx.createLinearGradient(x, y, x, y + r * 3.2); g.addColorStop(0, "rgba(200,230,225,.45)"); g.addColorStop(1, "rgba(200,230,225,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - r * .8, y + r * .3); ctx.quadraticCurveTo(x - r * 1.2 + Math.sin(t * 3 + ph) * 3, y + r * 2.4, x, y + r * 3.1); ctx.quadraticCurveTo(x + r * 1.2 + Math.sin(t * 3 + ph + 1) * 3, y + r * 2.4, x + r * .8, y + r * .3); ctx.fill();
      nb_skull(x, y, r, bone, eye, Math.abs(Math.sin(t * 4 + ph)) * .4); }
  },
  robed(o){
    const {w, h, t, R, R2, eye, has, m} = o, sw = Math.sin(t * 2) * w * .04;
    nb_poly([-w * .3, -h * .08, w * .3, -h * .08, w * .4 + sw, h * .54, w * .2, h * .48, 0, h * .55, -w * .2, h * .48, -w * .4 + sw, h * .54], R2[2], true);
    nb_poly([w * .06, -h * .08, w * .3, -h * .08, w * .4 + sw, h * .54, w * .2, h * .48], R2[1]);
    px2(-w * .3, h * .14, w * .6, h * .05, R[1]);
    const hand = has("skull") ? R[4] : bShade(o.dsn.col, 1.4);
    nb_line(w * .22, -h * .02, w * .42, h * .1 - m.armR * 3, w * .1, R2[2]); nb_circ(w * .44, h * .12 - m.armR * 3, w * .06, hand);
    nb_line(-w * .22, -h * .02, -w * .32, h * .16 + m.arm * 3, w * .1, R2[2]); nb_circ(-w * .32, h * .2 + m.arm * 3, w * .06, hand);
    nb_poly([-w * .26, -h * .1, -w * .2, -h * .44, 0, -h * .6, w * .2, -h * .44, w * .26, -h * .1], R2[1], true);
    ctx.fillStyle = "rgba(10,8,6,.92)"; ctx.beginPath(); ctx.ellipse(0, -h * .3, w * .15, h * .13, 0, 0, TAU); ctx.fill();
    if (has("skull")){ nb_skull(0, -h * .3, w * .12, R[4], eye, 0); }
    else { nb_glowDot(-w * .06, -h * .31, w * .035, eye); nb_glowDot(w * .06, -h * .31, w * .035, eye); }
    if (o.dsn.prop === "staff") nb_staff(w * .44, h * .12 - m.armR * 3, h, eye);
    if (has("crown")) nb_crown(0, -h * .55, w * .2);
  },
  giant(o){
    const {w, h, t, R, R2, eye, has, m, reach} = o, bones = has("bones"), st = m.leg * (Math.abs(o.e.vx) > 30 ? 3 : 0);
    const skin = R[2], dark = R[1];
    px2(-w * .3, h * .22, w * .2, h * .32 + st, dark); px2(w * .1, h * .22, w * .2, h * .32 - st, dark);
    px2(-w * .34, h * .5, w * .26, h * .06, R2[0]); px2(w * .08, h * .5, w * .26, h * .06, R2[0]);
    nb_poly([-w * .4, -h * .2, w * .4, -h * .2, w * .3, h * .26, -w * .3, h * .26], bones ? R[3] : skin, true);
    if (bones){ ctx.fillStyle = "rgba(20,14,10,.75)"; ctx.fillRect(-w * .3, -h * .14, w * .6, h * .34); for (let i = 0; i < 4; i++) nb_arc(0, -h * .02 + i * h * .07, w * .26, Math.PI * 1.08, Math.PI * 1.92, w * .05, R[3]); nb_line(0, -h * .18, 0, h * .22, w * .06, R[3]); }
    else { nb_poly([w * .05, -h * .2, w * .4, -h * .2, w * .3, h * .26, w * .1, h * .26], R[1]); px2(-w * .3, h * .16, w * .6, h * .05, R2[1]); }
    const aL = m.arm * 4, aR = m.armR * 4;
    nb_line(-w * .4, -h * .14, -w * .5, h * .14 + aL, w * .15, bones ? R[3] : skin); nb_circ(-w * .5, h * .2 + aL, w * .1, bones ? R[3] : dark);
    const hx = w * .5 + reach * w * .15, hy = h * .14 - aR - reach * h * .1;
    nb_line(w * .4, -h * .14, hx, hy, w * .15, bones ? R[3] : skin);
    if (o.dsn.prop === "club"){ nb_line(hx, hy, hx + w * .2, hy - h * .5, w * .1, "#6a4a2a"); nb_circ(hx + w * .2, hy - h * .5, w * .1, "#7a5a36"); } else nb_circ(hx, hy + h * .04, w * .1, bones ? R[3] : dark);
    if (bones) nb_skull(0, -h * .34, w * .16, R[4], eye, reach); else { nb_circ(0, -h * .32, w * .15, skin); ctx.save(); ctx.translate(0, -h * .33); o.eyes(0, w * .07, 2.4); ctx.restore(); px2(-w * .06, -h * .26, w * .12, 1.6, "rgba(30,20,10,.8)"); }
    if (has("horns")) for (const s of [-1, 1]) nb_poly([s * w * .1, -h * .42, s * w * .32, -h * .58, s * w * .18, -h * .36], R2[2], true);
    if (has("frost")) for (let i = 0; i < 5; i++){ const x = -w * .3 + i * w * .15; nb_poly([x, -h * .2, x + w * .05, -h * .34 - (i % 2) * h * .06, x + w * .1, -h * .2], "#d8eeff", true); }
  },
  hydra(o){
    const {w, h, t, R, eye} = o;
    nb_ell(0, h * .36, w * .46, h * .2, R[1]); nb_ell(0, h * .32, w * .4, h * .16, R[2]);
    const heads = (o.dsn.heads || 3) >= 5 ? [[-w * .46, -h * .1, 0], [-w * .24, -h * .38, .8], [0, -h * .5, 1.4], [w * .24, -h * .38, 2.1], [w * .46, -h * .1, 2.6]] : [[-w * .34, -h * .26, 0], [0, -h * .44, 1.4], [w * .34, -h * .26, 2.6]];
    for (const [hx0, hy0, ph] of heads){ const hx = hx0 + Math.sin(t * 2 + ph) * w * .05, hy = hy0 + Math.cos(t * 1.7 + ph) * h * .03;
      ctx.strokeStyle = OUTL; ctx.lineWidth = w * .16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hx0 * .4, h * .26); ctx.quadraticCurveTo(hx0 * .9, h * .02, hx, hy); ctx.stroke();
      ctx.strokeStyle = R[2]; ctx.lineWidth = w * .12; ctx.beginPath(); ctx.moveTo(hx0 * .4, h * .26); ctx.quadraticCurveTo(hx0 * .9, h * .02, hx, hy); ctx.stroke();
      const d = hx0 < 0 ? -1 : 1, jaw = o.reach > .05 ? h * .05 : h * .015;
      nb_poly([hx - w * .1 * d, hy - h * .06, hx + w * .16 * d, hy - h * .02, hx + w * .2 * d, hy + h * .02, hx - w * .08 * d, hy + h * .06], R[3], true);
      nb_poly([hx - w * .04 * d, hy + h * .04, hx + w * .18 * d, hy + h * .04 + jaw, hx - w * .02 * d, hy + h * .08 + jaw], R[1], true);
      nb_glowDot(hx + w * .04 * d, hy - h * .02, w * .03, eye); }
  },
  goblin(o){
    const {w, h, t, R, R2, eye, m, has, dsn, reach} = o, skin = R[2], st = m.leg * (Math.abs(o.e.vx) > 30 ? 3 : 0);
    px2(-w * .16, h * .3, w * .12, h * .24 + st, R[1]); px2(w * .04, h * .3, w * .12, h * .24 - st, R[1]);
    nb_poly([-w * .24, h * .0, w * .24, h * .0, w * .3, h * .34, -w * .3, h * .34], R2[2], true);
    for (let i = -3; i <= 2; i++) nb_poly([i * w * .1, h * .3, i * w * .1 + w * .05, h * .4, i * w * .1 + w * .1, h * .3], R2[1]);
    nb_line(-w * .22, h * .04, -w * .32, h * .22 + m.arm * 3, w * .08, skin);
    const hx = w * .3 + reach * w * .15, hy = h * .16 - m.armR * 3; nb_line(w * .22, h * .04, hx, hy, w * .08, skin);
    if (dsn.prop === "sword") nb_sword(hx, hy, h * .7, .6); else if (dsn.prop === "staff"){} else nb_sword(hx, hy, h * .5, .7, .5);
    for (const s of [-1, 1]) nb_poly([s * w * .18, -h * .24, s * w * .52, -h * .36, s * w * .2, -h * .14], skin, true);
    nb_ell(0, -h * .2, w * .26, h * .2, skin); nb_ell(w * .06, -h * .17, w * .18, h * .16, R[3]);
    ctx.save(); ctx.translate(0, -h * .23); o.eyes(0, w * .1, 3); ctx.restore();
    ctx.fillStyle = "#2a1a10"; ctx.beginPath(); ctx.ellipse(0, -h * .08, w * .14, h * .035 + reach * h * .04, 0, 0, Math.PI); ctx.fill();
    px2(-w * .08, -h * .08, 1.4, 2.2, "#fff"); px2(w * .06, -h * .08, 1.4, 2.2, "#fff");
    if (has("mask")) px2(-w * .2, -h * .28, w * .4, h * .06, "#3a2a1a");
  },
  dwarf(o){
    const {w, h, t, R, R2, eye, m, has, dsn, reach} = o, st = m.leg * (Math.abs(o.e.vx) > 30 ? 3 : 0);
    px2(-w * .22, h * .3, w * .18, h * .25 + st, "#4a3a2a"); px2(w * .04, h * .3, w * .18, h * .25 - st, "#4a3a2a");
    nb_poly([-w * .36, -h * .06, w * .36, -h * .06, w * .38, h * .34, -w * .38, h * .34], R[2], true); nb_poly([w * .06, -h * .06, w * .36, -h * .06, w * .38, h * .34, w * .12, h * .34], R[1]);
    px2(-w * .38, h * .2, w * .76, h * .06, "#6a4a2a"); px2(-w * .05, h * .19, w * .1, h * .08, "#c9a24a");
    const skin = "#e0a882";
    nb_line(-w * .36, -h * .02, -w * .44, h * .2 + m.arm * 3, w * .12, R[2]);
    const hx = w * .42 + reach * w * .12, hy = h * .12 - m.armR * 3 - reach * h * .1; nb_line(w * .36, -h * .02, hx, hy, w * .12, R[2]);
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.5 - reach); px2(-1.4, -h * .46, 2.8, h * .5, "#6a4a2a"); nb_poly([-w * .16, -h * .5, w * .16, -h * .5, w * .16, -h * .38, -w * .16, -h * .38], "#8a96a2", true); ctx.restore();
    nb_circ(0, -h * .26, w * .19, skin);
    nb_poly([-w * .22, -h * .24, w * .22, -h * .24, w * .16, h * .04, 0, h * .14, -w * .16, h * .04], R2[2], true);
    ctx.save(); ctx.translate(0, -h * .29); o.eyes(0, w * .08, 2.4); ctx.restore();
    nb_poly([-w * .24, -h * .3, -w * .2, -h * .46, 0, -h * .52, w * .2, -h * .46, w * .24, -h * .3], "#7e8a96", true); px2(-w * .03, -h * .55, w * .06, h * .26, "#9aa6b2");
    if (has("glow")) nb_glowDot(hx + w * .02, hy - h * .44, w * .05, eye);
  },
  elf(o){
    const {w, h, t, R, R2, eye, m, has, dsn} = o, st = m.leg * (Math.abs(o.e.vx) > 30 ? 3 : 0);
    px2(-w * .12, h * .26, w * .09, h * .29 + st, R2[0]); px2(w * .03, h * .26, w * .09, h * .29 - st, R2[0]);
    const sw = Math.sin(t * 2) * w * .03;
    nb_poly([-w * .2, -h * .14, w * .2, -h * .14, w * .3 + sw, h * .46, -w * .3 + sw, h * .46], R2[2], true);
    nb_poly([-w * .14, -h * .12, w * .14, -h * .12, w * .12, h * .3, -w * .12, h * .3], R[2], true); px2(-w * .14, h * .12, w * .28, h * .04, "#4a3a26");
    nb_line(-w * .16, -h * .08, -w * .36, -h * .02 + m.arm * 2, w * .07, "#e6d2b6");
    nb_bow(-w * .46, -h * .02 + m.arm * 2, h);
    nb_line(w * .16, -h * .08, w * .1, h * .1 - m.armR * 2, w * .07, R[2]);
    nb_poly([-w * .2, -h * .2, -w * .14, -h * .48, 0, -h * .56, w * .14, -h * .48, w * .2, -h * .2], R2[1], true);
    nb_ell(0, -h * .3, w * .12, h * .13, "#e6d2b6");
    for (const s of [-1, 1]) nb_poly([s * w * .1, -h * .32, s * w * .3, -h * .42, s * w * .11, -h * .26], "#e6d2b6", true);
    ctx.save(); ctx.translate(0, -h * .31); o.eyes(0, w * .06, 2); ctx.restore();
  },
  siren(o){
    const {w, h, t, R, R2, eye, m} = o, sw = Math.sin(t * 2.4) * w * .1;
    ctx.fillStyle = R[2]; ctx.beginPath(); ctx.moveTo(-w * .16, h * .02); ctx.quadraticCurveTo(-w * .24, h * .34, w * .02 + sw * .4, h * .44); ctx.quadraticCurveTo(w * .26 + sw, h * .48, w * .38 + sw, h * .36);
    ctx.lineTo(w * .52 + sw, h * .26); ctx.lineTo(w * .44 + sw, h * .44); ctx.lineTo(w * .58 + sw, h * .52); ctx.quadraticCurveTo(w * .2, h * .62, -w * .02, h * .52); ctx.quadraticCurveTo(-w * .34, h * .36, w * .16, h * .02); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = OUTL; ctx.lineWidth = 1; ctx.stroke();
    ctx.strokeStyle = R[1]; ctx.lineWidth = 1; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(-w * .04 + i * w * .08, h * .26 + i * h * .04, w * .05, 0, Math.PI); ctx.stroke(); }
    const skin = "#d8c8b8";
    nb_poly([-w * .16, -h * .14, w * .16, -h * .14, w * .14, h * .06, -w * .14, h * .06], skin, true);
    nb_line(-w * .14, -h * .1, -w * .3, h * .04 + m.arm * 3, w * .07, skin); nb_line(w * .14, -h * .1, w * .32, -h * .06 - m.armR * 3, w * .07, skin);
    const hair = R2[1]; ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-w * .18, -h * .3); ctx.quadraticCurveTo(-w * .3, h * .02 + Math.sin(t * 2) * 2, -w * .2, h * .1); ctx.lineTo(w * .2, h * .1); ctx.quadraticCurveTo(w * .3, h * .02 + Math.sin(t * 2 + 1) * 2, w * .18, -h * .3); ctx.closePath(); ctx.fill();
    nb_ell(0, -h * .28, w * .13, h * .14, skin); ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, -h * .32, w * .15, Math.PI, 0); ctx.fill();
    ctx.save(); ctx.translate(0, -h * .27); o.eyes(0, w * .06, 2); ctx.restore();
  },
  knight(o){
    const {w, h, t, R, R2, eye, m, has, dsn, reach} = o, st = m.leg * (Math.abs(o.e.vx) > 30 ? 3 : 0), A = R[2], A2 = R[1], A3 = R[3];
    if (has("cape")){ const sw = Math.sin(t * 2) * w * .05; nb_poly([-w * .28, -h * .16, w * .28, -h * .16, w * .4 + sw, h * .46, -w * .4 + sw, h * .46], R2[1], true); }
    px2(-w * .2, h * .26, w * .15, h * .28 + st, A2); px2(w * .05, h * .26, w * .15, h * .28 - st, A2);
    px2(-w * .22, h * .5, w * .19, h * .06, R[0]); px2(w * .03, h * .5, w * .19, h * .06, R[0]);
    nb_poly([-w * .3, -h * .14, w * .3, -h * .14, w * .26, h * .3, -w * .26, h * .3], A, true);
    nb_poly([w * .04, -h * .14, w * .3, -h * .14, w * .26, h * .3, w * .1, h * .3], A2); px2(-w * .03, -h * .12, w * .06, h * .4, A3);
    px2(-w * .28, h * .14, w * .56, h * .05, R2[2]);
    if (dsn.emblem === "sun"){ nb_circ(0, h * .02, w * .1, "#e8b830"); for (let k = 0; k < 8; k++){ const a = k / 8 * TAU; nb_line(Math.cos(a) * w * .12, h * .02 + Math.sin(a) * w * .12, Math.cos(a) * w * .17, h * .02 + Math.sin(a) * w * .17, 1.2, "#e8b830"); } }
    else if (dsn.emblem === "moon"){ nb_circ(0, h * .02, w * .11, "#d8d0f0"); nb_circ(w * .05, h * .0, w * .09, A); }
    nb_circ(-w * .3, -h * .12, w * .12, A3); nb_circ(w * .3, -h * .12, w * .12, A);
    const aL = m.arm * 3, aR = m.armR * 3;
    nb_line(-w * .32, -h * .06, -w * .36, h * .16 + aL, w * .11, A);
    if (has("shield")){ nb_poly([-w * .56, -h * .12, -w * .3, -h * .12, -w * .3, h * .2, -w * .43, h * .32, -w * .56, h * .2], R2[2], true); nb_circ(-w * .43, h * .02, w * .05, "#c9a24a"); }
    const hx = w * .38 + reach * w * .18, hy = h * .14 - aR - reach * h * .1; nb_line(w * .32, -h * .06, hx, hy, w * .11, A);
    if (dsn.prop !== "none") nb_sword(hx, hy, h * 1.1, .55 + Math.sin(t * 2) * .05);
    nb_poly([-w * .17, -h * .2, -w * .18, -h * .44, 0, -h * .52, w * .18, -h * .44, w * .17, -h * .2], A3, true);
    px2(-w * .13, -h * .35, w * .26, h * .035, "rgba(8,6,6,.95)"); ctx.fillStyle = eye; ctx.shadowColor = eye; ctx.shadowBlur = 8; ctx.fillRect(-w * .1, -h * .345, w * .2, h * .02); ctx.shadowBlur = 0;
    if (has("horns")) for (const s of [-1, 1]) nb_poly([s * w * .14, -h * .44, s * w * .34, -h * .62, s * w * .2, -h * .38], R2[1], true);
    if (has("crest")) nb_poly([-w * .02, -h * .52, w * .14, -h * .7, w * .04, -h * .5], R2[3], true);
    if (has("crown")) nb_crown(0, -h * .53, w * .17);
  },
  dragon(o){
    const {w, h, t, R, R2, eye, reach} = o, wf = Math.sin(t * 3) * h * .1;
    for (const s of [-1, 1]){ nb_poly([s * w * .04, -h * .12, s * w * .7, -h * .5 - wf, s * w * .62, -h * .18 - wf * .5, s * w * .8, -h * .08 - wf * .3, s * w * .32, h * .08], s < 0 ? R2[1] : R2[2], true); }
    ctx.strokeStyle = R[2]; ctx.lineWidth = w * .12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-w * .2, h * .26); ctx.quadraticCurveTo(-w * .62, h * .38 + Math.sin(t * 2) * 3, -w * .7, h * .1); ctx.stroke();
    nb_poly([-w * .74, h * .06, -w * .64, h * .0, -w * .66, h * .16], R[3], true);
    px2(-w * .24, h * .32, w * .14, h * .22, R[1]); px2(w * .1, h * .32, w * .14, h * .22, R[1]);
    nb_ell(0, h * .18, w * .34, h * .22, R[2]); nb_ell(w * .04, h * .26, w * .24, h * .1, "#c88a4a");
    ctx.strokeStyle = OUTL; ctx.lineWidth = w * .17; ctx.beginPath(); ctx.moveTo(w * .14, h * .06); ctx.quadraticCurveTo(w * .34, -h * .12, w * .3, -h * .34); ctx.stroke();
    ctx.strokeStyle = R[2]; ctx.lineWidth = w * .13; ctx.beginPath(); ctx.moveTo(w * .14, h * .06); ctx.quadraticCurveTo(w * .34, -h * .12, w * .3, -h * .34); ctx.stroke();
    const hx = w * .32, hy = -h * .4, jaw = reach > .05 ? h * .06 : h * .015;
    nb_poly([hx - w * .1, hy - h * .06, hx + w * .26, hy, hx + w * .28, hy + h * .05, hx - w * .08, hy + h * .07], R[3], true);
    nb_poly([hx - w * .02, hy + h * .05, hx + w * .24, hy + h * .05 + jaw, hx, hy + h * .1 + jaw], R[1], true);
    for (const dx of [-.04, .04]) nb_poly([hx + w * dx - w * .02, hy - h * .05, hx + w * dx - w * .1, hy - h * .2, hx + w * dx + w * .04, hy - h * .06], "#d8c8a8", true);
    nb_glowDot(hx + w * .06, hy - h * .01, w * .028, eye);
    if (reach > .05){ const g = ctx.createRadialGradient(hx + w * .36, hy + h * .04, 0, hx + w * .36, hy + h * .04, w * .3); g.addColorStop(0, "rgba(255,210,120,.9)"); g.addColorStop(1, "rgba(255,90,30,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx + w * .36, hy + h * .04, w * .3, 0, TAU); ctx.fill(); }
  },
  // жаболюд: кривенькі жаб'ячі ноги, черевце, широка голова з очима-банькатими, гарпун
  frog(o){
    const {w, h, t, R, R2, eye, m, has, dsn, reach} = o, st = m.leg * (Math.abs(o.e.vx) > 30 ? 3 : 0), sac = 1 + .15 * Math.sin(t * 4);
    for (const s of [-1, 1]){ const sx = s * w * .2, k = s < 0 ? st : -st;
      nb_ell(sx, h * .34, w * .18, h * .12, R[1], s * .5); nb_line(sx + s * w * .06, h * .4, sx + s * w * .02, h * .54 + k, w * .08, R[1]);
      nb_poly([sx - w * .12, h * .55, sx + w * .14, h * .55, sx + s * w * .02, h * .5 + k], R[0], true); }
    nb_ell(0, h * .12, w * .3, h * .28, R[2]); nb_ell(0, h * .17, w * .2, h * .2, R[4] || R[3]);
    if (has("fin")) for (let i = 0; i < 4; i++) nb_poly([-w * .06, -h * .12 + i * h * .1, -w * .32, -h * .06 + i * h * .1, -w * .06, -h * .02 + i * h * .1], R2[2], true);
    nb_line(-w * .26, h * .02, -w * .38, h * .2 + m.arm * 3, w * .08, R[2]);
    const hx = w * .32 + reach * w * .2, hy = h * .06 - m.armR * 3; nb_line(w * .24, h * .0, hx, hy, w * .08, R[2]);
    if (dsn.prop === "staff") nb_staff(hx, hy, h * .9, eye); else nb_spear(hx, hy, h * .8, .35 + reach * .5);
    nb_ell(0, -h * .04, w * .14 * sac, h * .07 * sac, R[3]);
    nb_ell(0, -h * .2, w * .34, h * .16, R[2]); nb_ell(0, -h * .16, w * .3, h * .1, R[3]);
    for (const s of [-1, 1]){ nb_circ(s * w * .18, -h * .32, w * .1, R[2]); nb_circ(s * w * .18, -h * .32, w * .07, "#f2e8b0", false); nb_glowDot(s * w * .18, -h * .32, w * .035, eye); ctx.fillStyle = "#120c06"; ctx.fillRect(s * w * .18 - w * .035, -h * .325, w * .07, h * .012); }
    ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-w * .28, -h * .15); ctx.quadraticCurveTo(0, -h * .07 + reach * h * .08, w * .28, -h * .15); ctx.stroke();
    if (has("claws")) for (const s of [-1, 1]) nb_circ(s * w * .08, -h * .24, 1.2, "#1a120a", false);
    if (has("crown")) nb_crown(0, -h * .44, w * .14);
  },
  // п'явка: кільчасте тіло хвилею, присосок з колом зубів
  leech(o){
    const {w, h, t, R, R2, eye, has, reach} = o, n = 9, pts = [];
    for (let i = 0; i < n; i++){ const k = i / (n - 1), x = -w * .5 + k * w * (.95 + reach * .25), y = h * .4 - Math.sin(k * Math.PI) * h * .42 + Math.sin(t * 3 + k * 5) * h * .05; pts.push([x, y, w * (.1 + Math.sin(k * Math.PI * .9 + .2) * .12)]); }
    for (const [x, y, r] of pts) nb_ell(x, y + r * .25, r * 1.1, r * .55, "rgba(0,0,0,.25)");
    for (let i = 0; i < n; i++){ const [x, y, r] = pts[i]; nb_circ(x, y, r, i % 2 ? R[1] : R[2]); ctx.fillStyle = R2[2]; ctx.globalAlpha = .45; ctx.fillRect(x - r * .9, y - r * .1, r * 1.8, r * .2); ctx.globalAlpha = 1; nb_ell(x - r * .3, y - r * .45, r * .35, r * .15, "rgba(255,240,220,.35)"); }
    const [hx, hy, hr] = pts[n - 1]; nb_circ(hx + hr * .4, hy, hr * 1.05, R[3]); nb_circ(hx + hr * .55, hy, hr * .7, "#2a0808");
    for (let a = 0; a < 10; a++){ const an = a / 10 * TAU; nb_poly([hx + hr * .55 + Math.cos(an) * hr * .7, hy + Math.sin(an) * hr * .7, hx + hr * .55 + Math.cos(an + .2) * hr * .4, hy + Math.sin(an + .2) * hr * .4, hx + hr * .55 + Math.cos(an + .4) * hr * .7, hy + Math.sin(an + .4) * hr * .7], "#efe2c4"); }
    nb_glowDot(hx - hr * .2, hy - hr * .7, Math.max(1.6, hr * .18), eye); nb_glowDot(hx + hr * .5, hy - hr * .85, Math.max(1.6, hr * .18), eye);
    if (has("crown")) nb_crown(hx, hy - hr * 1.5, hr * .8);
  },
  // мошкара: хмара дрібних комах, що гуде навколо одного центру
  midges(o){
    const {w, h, t, eye, R} = o; ctx.globalAlpha = .18; nb_ell(0, 0, w * .5, h * .34, R[1]); ctx.globalAlpha = 1;
    for (let i = 0; i < 70; i++){ const a = i * 2.39996 + t * (1 + (i % 5) * .3), rr = Math.sqrt((i + .5) / 70);
      const x = Math.cos(a) * w * .5 * rr + Math.sin(t * 7 + i) * 1.5, y = Math.sin(a * 1.3) * h * .34 * rr + Math.cos(t * 6 + i) * 1.5 - h * .06;
      px2(x - .9, y - .9, 1.8, 1.8, i % 9 ? "#1a1a12" : R[3]); if (i % 4 === 0){ ctx.globalAlpha = .4; px2(x - 2.4, y - 1.4, 1.6, .8, "#e8f0f0"); px2(x + .8, y - 1.4, 1.6, .8, "#e8f0f0"); ctx.globalAlpha = 1; } }
    for (const [ex, ey] of [[-w * .12, -h * .1], [w * .14, -h * .02], [0, h * .1]]) nb_glowDot(ex + Math.sin(t * 2) * 2, ey, 1.6, eye);
  },
  golem(o){
    const {w, h, t, R, R2, eye, m, reach} = o, st = m.leg * (Math.abs(o.e.vx) > 30 ? 2 : 0);
    const block = (x, y, bw, bh, c) => { nb_poly([x, y, x + bw, y + bh * .06, x + bw * .96, y + bh, x + bw * .04, y + bh * .96], c, true); };
    block(-w * .3, h * .26, w * .22, h * .28 + st, R[1]); block(w * .08, h * .26, w * .22, h * .28 - st, R[1]);
    block(-w * .36, -h * .18, w * .72, h * .46, R[2]); block(-w * .1, -h * .12, w * .44, h * .36, R[3]);
    const core = .7 + .3 * Math.sin(t * 3); ctx.globalAlpha = core; nb_glowDot(0, h * .04, w * .08, eye); ctx.globalAlpha = 1;
    block(-w * .6, -h * .14 + m.arm * 3, w * .22, h * .4, R[1]); block(w * .38 + reach * w * .12, -h * .14 - m.armR * 3, w * .22, h * .4, R[1]);
    block(-w * .17, -h * .44, w * .34, h * .26, R[2]);
    ctx.save(); ctx.translate(0, -h * .32); o.eyes(0, w * .08, 2.6, true); ctx.restore();
    ctx.strokeStyle = "rgba(20,14,10,.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-w * .2, -h * .1); ctx.lineTo(-w * .05, h * .1); ctx.lineTo(-w * .18, h * .24); ctx.stroke();
  },
};
