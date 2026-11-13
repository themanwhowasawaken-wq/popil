/* ============ нові двоногі: піхота, лицарі, маги, скелети, велетні ============ */
function nbBipedCfg(id, dsn, has){
  const sh = dsn.shape, C = {skin:"#d6a478", bone:false, outfit:"tunic", head:"bare", build:1, hunch:0, arms:"", weapon:dsn.prop || null, shield:has("shield"), cape:has("cape"), horns:has("horns"), crown:has("crown"), mask:has("mask"), hair:has("hair"), crest:has("crest"),
    main:dsn.col, trim:dsn.col2 && dsn.col2 !== "#000" ? dsn.col2 : nbMix(dsn.col, "#000000", .55), eye:dsn.eye || "#ff3a2a", size:1, glow:false};
  if (sh === "frog"){ C.head = "frog"; C.skin = dsn.col; C.outfit = "rags"; C.main = nbMix(dsn.col2 && dsn.col2 !== "#000" ? dsn.col2 : "#4a3a20", "#5a4a30", .4); C.hunch = 6; C.rags = true; }
  if (id === "merman" || id === "chosen_merman"){ C.head = "fish"; C.skin = dsn.col; C.outfit = "rags"; C.main = nbMix(dsn.col, "#1a3a5a", .5); C.weapon = "spear"; C.hunch = 3; C.crown = id === "chosen_merman"; C.rags = true; }
  if (id === "golem" || sh === "golem"){ C.build = 1.35; C.outfit = "construct"; C.head = "block"; C.mask = false; C.skin = dsn.col; }
  if (sh === "skeleton"){ C.bone = true; C.outfit = "none"; C.head = "skull"; C.skin = dsn.col; }
  else if (sh === "knight"){ C.outfit = "armor"; C.head = "helm"; }
  else if (sh === "robed"){ C.outfit = "robe"; C.head = "hood"; C.weapon = dsn.prop || null; }
  else if (sh === "giant"){ C.build = 1.55; C.outfit = "tunic"; C.head = "bare"; C.size = 1.15; }
  else if (sh === "elf"){ C.build = .86; C.outfit = "tunic"; C.head = "hood"; }
  
  if (has("skull") && sh === "humanoid"){ C.bone = true; C.head = "skull"; C.skin = dsn.col; C.outfit = (C.shield || id === "crypt_captain") ? "armor" : "none"; if (C.outfit === "armor") C.main = dsn.col2 || "#5a5040"; }
  if (sh === "robed" && has("skull")) C.skull = true;
  if (sh === "giant" && has("bones")){ C.bone = true; C.head = "skull"; C.skin = dsn.col; C.outfit = "none"; }
  if (sh === "giant" && !has("bones")){ C.skin = nbMix(dsn.col, "#8a9a5a", .1); C.outfit = "bark"; }
  if (sh === "humanoid" && (id === "cultist" || id === "villain" || id === "thief")){ C.head = "hood"; if (id === "cultist") C.outfit = "robe"; }
  if (id === "marauder"){ C.head = "bare"; C.bandana = true; C.skin = "#c89a70"; C.beard = true; }
  if (id === "soldier"){ C.outfit = "armor"; C.head = "helm"; C.main = "#7a88a8"; }
  if (id === "black_knight"){ C.outfit = "armor"; C.head = "helm"; }
  if (id === "zombie"){ C.skin = "#8aa06a"; C.main = "#5a4a3a"; C.hunch = 8; C.arms = "reach"; C.rags = true; C.outfit = "rags"; }
  if (id === "drowned" || id === "bg_drowned"){ C.skin = "#86a8a4"; C.main = "#3a5a5a"; C.hunch = 5; C.outfit = "rags"; C.rags = true; C.weed = true; }
  if (id === "thief"){ C.hunch = 7; C.crouch = 1; C.weapon = "dagger"; C.mask = true; }
  if (id === "rabble_hunter"){ C.head = "hood"; C.weapon = "bow"; }
  if (id === "order_mage" || id === "rabble_mage"){ C.outfit = "robe"; C.head = "hat"; C.cape = false; }
  if (id === "cultist"){ C.cape = false; }
  if (id === "dark_magister"){ C.outfit = "robe"; C.cape = false; C.head = "hood"; }
  if (id === "abyss_lord"){ C.outfit = "robe"; C.cape = false; C.head = "hood"; }
  if (id === "warden"){ C.outfit = "armor"; C.build = 1.2; }
  if (id === "crypt_captain"){ C.outfit = "armor"; C.build = 1.2; C.crown = false; C.plume = true; }
  if (id === "mk_knight"){ C.bone = false; }
  if (id === "mk_bellringer"){ C.weapon = "bell"; }
  if (C.weapon === "staff" || C.weapon === "spear" || C.weapon === "bow") C.shield = false;
  if (sh === "robed" && !C.weapon && !C.skull) C.weapon = null;
  return C;
}
const nbLerp = (a, b, t) => a + (b - a) * t;
function nbSkull(g, x, y, r, bone, eye, jawOpen, crown, blink){
  const Pb = nbPal(bone, 1.0);
  nbCel(() => nbSmooth(g, [[x - r * .9, y - r * .1], [x - r * .7, y - r * .85], [x, y - r * 1.05], [x + r * .75, y - r * .8], [x + r, y - r * .05], [x + r * .75, y + r * .5], [x + r * .5, y + r * .62], [x - r * .55, y + r * .55]], true), Pb, 2.2);
  g.fillStyle = "#120b0a"; g.beginPath(); g.ellipse(x + r * .38, y - r * .12, r * .3, r * .34, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x - r * .3, y - r * .08, r * .26, r * .3, 0, 0, TAU); g.fill();
  g.save(); g.shadowColor = eye; g.shadowBlur = 6; g.fillStyle = eye; g.beginPath(); g.arc(x + r * .4, y - r * .1, r * .13 * (blink > .5 ? 1 : .4), 0, TAU); g.arc(x - r * .28, y - r * .06, r * .11 * (blink > .5 ? 1 : .4), 0, TAU); g.fill(); g.restore();
  g.fillStyle = "#120b0a"; g.beginPath(); g.moveTo(x + r * .72, y + r * .18); g.lineTo(x + r * .6, y + r * .38); g.lineTo(x + r * .86, y + r * .36); g.closePath(); g.fill();
  // щелепа
  g.save(); g.translate(x + r * .1, y + r * .5); g.rotate(jawOpen * .35); nbCel(() => nbPoly(g, [[-r * .5, 0], [r * .55, 0], [r * .5, r * .5], [-r * .25, r * .55]]), Pb, 1.8);
  g.strokeStyle = "#120b0a"; g.lineWidth = 1; for (let i = -1; i <= 2; i++){ g.beginPath(); g.moveTo(i * r * .22, 0); g.lineTo(i * r * .22, r * .3); g.stroke(); } g.restore();
  if (crown){ g.fillStyle = "#e8c24a"; g.strokeStyle = NB.OL; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - r * .8, y - r * .8); g.lineTo(x - r * .8, y - r * 1.5); g.lineTo(x - r * .4, y - r * 1.1); g.lineTo(x, y - r * 1.7); g.lineTo(x + r * .4, y - r * 1.1); g.lineTo(x + r * .8, y - r * 1.5); g.lineTo(x + r * .8, y - r * .8); g.closePath(); g.fill(); g.stroke(); }
}
function nbWeapon(g, kind, hx, hy, ang, eye, t, cfg){
  g.save(); g.translate(hx, hy); g.rotate(ang); g.lineCap = "round"; g.lineJoin = "round";
  const metal = {b:"#aab2c0", d:"#6a7284", l:"#eef2f8"}, wood = {b:"#7a5430", d:"#4a3018", l:"#a87a48"};
  if (kind === "sword"){ nbCel(() => nbPoly(g, [[-2.4, -4], [2.4, -4], [2.2, -38], [0, -43], [-2.2, -38]]), metal, 1.8); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = .9; g.beginPath(); g.moveTo(0, -6); g.lineTo(0, -36); g.stroke();
    nbCel(() => nbPoly(g, [[-8, -4], [8, -4], [7, -1], [-7, -1]]), {b:"#8a6a2a", d:"#5a4018", l:"#d8b050"}, 1.6); nbCel(nbEllP(0, 4, 2.2, 5), wood, 1.4); nbCel(nbCircP(0, 9, 2.6), {b:"#8a6a2a", d:"#5a4018", l:"#d8b050"}, 1.4); }
  else if (kind === "dagger"){ nbCel(() => nbPoly(g, [[-2, -2], [2, -2], [1.6, -18], [0, -22], [-1.6, -18]]), metal, 1.6); nbCel(nbEllP(0, 3, 2, 4), wood, 1.3); nbCel(() => nbPoly(g, [[-5, -2], [5, -2], [4, 0], [-4, 0]]), wood, 1.3); }
  else if (kind === "spear"){ nbLimbs([[0, 30, 0, -48, 3.2]], wood, 1.6); nbCel(() => nbPoly(g, [[-4.5, -46], [0, -66], [4.5, -46], [0, -49]]), metal, 1.7); g.fillStyle = "#b02a2a"; g.beginPath(); g.moveTo(0, -44); g.quadraticCurveTo(7 + Math.sin(t * 5) * 2, -40, 3, -32); g.lineTo(0, -40); g.fill(); }
  else if (kind === "staff"){ nbLimbs([[0, 40, 0, -52, 3.6]], wood, 1.6); nbCel(nbCircP(0, -56, 6.5), {b:nbMix(eye, "#ffffff", .1), d:nbMix(eye, "#000000", .35), l:"#fff"}, 1.8); g.save(); g.shadowColor = eye; g.shadowBlur = 12 + Math.sin(t * 4) * 4; g.fillStyle = eye; g.beginPath(); g.arc(0, -56, 3.6, 0, TAU); g.fill(); g.restore();
    g.strokeStyle = NB.OL; g.lineWidth = 1.8; g.beginPath(); g.moveTo(-6, -50); g.quadraticCurveTo(-8, -62, -2, -64); g.moveTo(6, -50); g.quadraticCurveTo(8, -62, 2, -64); g.stroke(); }
  else if (kind === "club"){ nbCel(() => nbSmooth(g, [[-3, 20], [3, 20], [5, -20], [10, -28], [8, -42], [0, -46], [-8, -42], [-10, -28], [-5, -20]], true), wood, 2); g.fillStyle = "#c8c0b0"; for (const [x, y] of [[-6, -34], [6, -30], [0, -40]]){ g.beginPath(); g.moveTo(x - 2, y + 2); g.lineTo(x, y - 5); g.lineTo(x + 2, y + 2); g.fill(); } }
  else if (kind === "bell"){ nbLimbs([[0, 16, 0, -10, 3]], wood, 1.4); nbCel(() => nbSmooth(g, [[-10, -4], [-8, -18], [0, -24], [8, -18], [10, -4]], true), {b:"#c8a24a", d:"#8a6a26", l:"#f0d890"}, 1.8); g.fillStyle = "#4a3a1a"; g.beginPath(); g.arc(0, -2, 2.6, 0, TAU); g.fill(); }
  g.restore();
}
function nbBow(g, x, y, ar, pull, t){ g.save(); g.translate(x, y); g.lineCap = "round"; g.strokeStyle = NB.OL; g.lineWidth = 5.4; g.beginPath(); g.arc(-14, 0, 26, -1.0, 1.0); g.stroke(); g.strokeStyle = "#8a6030"; g.lineWidth = 3; g.stroke();
  const ty = 26 * Math.sin(1.0), tx = -14 + 26 * Math.cos(1.0); g.strokeStyle = "rgba(240,232,210,.9)"; g.lineWidth = 1; g.beginPath(); g.moveTo(tx, -ty); g.lineTo(-10 - pull * 8, 0); g.lineTo(tx, ty); g.stroke();
  if (pull > 0.05){ g.strokeStyle = "#caa060"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-10 - pull * 8, 0); g.lineTo(22, 0); g.stroke(); } g.restore(); }
NEW_SHAPES.__biped = function(o){
  const {h, t, e, has, dsn, id, reach} = o, C = nbBipedCfg(id, dsn, has), g = ctx, seed = e.x || 0, atk = reach || 0;
  const moving = Math.abs(e.vx) > 30, ph = t * (moving ? 8 : 2) + seed, blink = nbBlink(t, seed), sw = Math.sin(t * 2 + seed);
  const M = nbPal(C.main), T = nbPal(C.trim), S = nbPal(C.skin), BN = nbPal(C.skin, 1);
  const B = C.build, sc = h / 100 * 1.42 * C.size, bob = moving ? Math.abs(Math.sin(ph)) * -1.8 : sw * .7;
  const gy = 46, crouch = C.crouch ? 6 : 0, hunch = C.hunch + (atk ? 3 : 0), hipY = 12 + crouch, shY = -13 + crouch * 1.3, neckY = shY - 4;
  g.save(); g.scale(sc, sc); g.translate(atk * 5, bob * .5);
  g.fillStyle = "rgba(8,6,4,.32)"; g.beginPath(); g.ellipse(0, gy + 1, 20 * B + 6, 4.4, 0, 0, TAU); g.fill();
  const hx0 = hunch * .9;   // зсув голови вперед
  // --- плащ позаду
  if (C.cape){ const sx = Math.sin(t * 2.3 + seed) * 3 + (moving ? -5 : 0); const CP = nbPal(nbMix(C.main, C.trim, .45)); nbCel(() => nbSmooth(g, [[-3, shY - 1], [-9 * B - 2, shY + 8], [-13 * B - 4 + sx, 26], [-9 * B - 1 + sx, 41], [-1 + sx * .4, 38], [2, 8]], true), CP, 2.2); }
  const legSpread = 6.5 * B;
  const legPose = (side, far) => { const off = side > 0 ? 0 : Math.PI, s = Math.sin(ph + off), lift = moving ? Math.max(0, Math.cos(ph + off)) * 6 : 0, fx = side * legSpread * .6 + (moving ? s * 11 : (side > 0 ? 3 : -2)), fy = gy - lift - 2;
    return {hx:side * 4.5 * B + 0, hy:hipY, fx, fy, side, far}; };
  const drawLeg = (L, pal, boot) => { const k = nbIK(L.hx, L.hy, L.fx, L.fy, 18, 18, 1); nbLimbs([[L.hx, L.hy, k[0], k[1], (C.bone ? 6.5 : 11.5) * B], [k[0], k[1], L.fx, L.fy - 2, (C.bone ? 5.2 : 9.5) * B]], pal); nbCel(nbEllP(L.fx + 3, L.fy, 8.6 * B, 4.2), boot, 1.8); };
  const trouser = C.bone ? BN : (C.outfit === "robe" ? {b:M.d, d:M.dd, l:M.b} : C.outfit === "armor" ? {b:nbPal(nbMix(C.main, "#6a7080", .5)).b, d:nbPal(nbMix(C.main, "#6a7080", .5)).d, l:nbPal(nbMix(C.main, "#6a7080", .5)).l} : {b:T.b, d:T.dd, l:T.l}), boot = C.bone ? BN : nbPal(C.outfit === "armor" ? "#5a5e6c" : "#3a2a20");
  const legs = [legPose(-1, 1), legPose(1, 0)];
  // дальня нога, дальня рука
  if (C.outfit !== "robe"){ drawLeg(legs[0], {b:trouser.d, d:trouser.dd, l:trouser.b}, {b:boot.d, d:boot.dd, l:boot.b}); }
  // руки: цілі
  const wk = C.weapon, two = wk === "staff" || wk === "spear" || wk === "club" || wk === "bow";
  const shx = hunch * .55 + 1, hand = (kind, far) => { // позиції рук
    const sy = shY + 3; let tx, ty;
    if (C.arms === "reach"){ tx = 26 + Math.sin(t * 3 + (far ? 1 : 0)) * 3 + atk * 8; ty = shY + 6 + (far ? 3 : 0) + Math.sin(t * 2.4 + seed) * 2; }
    else if (far){ tx = two ? 6 : -9 + sw * 2; ty = two ? -4 : 14 + sw; if (C.shield) { tx = 11; ty = 3; } if (wk === "bow") { tx = 24; ty = -4; } }
    else { if (wk === "bow") { tx = 6 - atk * 4; ty = -5; } else if (two){ tx = 19 + atk * 8; ty = 0 - atk * 6; } else if (wk){ tx = 25 + atk * 10; ty = -3 - atk * 12 + sw; } else { tx = 13 + atk * 12; ty = 8 - atk * 8 + sw; } }
    return [shx + (far ? -4 * B : 5 * B), sy, tx, ty]; };
  const arm = (far) => { const [sx, sy, tx, ty] = hand(0, far), k = nbIK(sx, sy, tx, ty, 14, 14, far ? 1 : 1), sl = C.bone ? BN : C.outfit === "armor" ? nbPal(nbMix(C.main, "#80889a", .35)) : (C.outfit === "robe" || C.outfit === "rags" || C.outfit === "bark" || C.outfit === "construct") ? nbPal(C.main) : (C.outfit === "none" ? BN : nbPal(C.main));
    const pal = far ? {b:sl.d, d:sl.dd, l:sl.b} : sl, aw = (C.bone ? 5.2 : 8.6) * Math.min(1.35, B);
    nbLimbs([[sx, sy, k[0], k[1], aw], [k[0], k[1], tx, ty, aw * .9]], pal);
    nbCel(nbCircP(tx, ty, aw * .62), C.bone ? BN : (C.outfit === "armor" ? {b:"#8a92a4", d:"#5a6274", l:"#dde2ee"} : nbPal(C.skin)), 1.6); return [tx, ty]; };
  let farHand = arm(true);
  if (wk === "staff" || wk === "spear" || wk === "club" || wk === "bow") {} // зброя вже в ближній руці
  // --- торс
  const tw = 13.5 * B, wy = hipY + 2, torso = () => nbSmooth(g, [[-tw + 1 + hunch * .1, shY], [-tw * .55, shY - 2.5], [tw * .6 + hunch * .3, shY - 2], [tw + hunch * .55, shY + 3], [tw * .72 + hunch * .1, wy - 4], [tw * .62, wy + 2], [-tw * .62, wy + 2], [-tw * .75, wy - 4]], true);
  if (C.outfit === "robe"){
    const hem = Math.sin(t * 2.2 + seed) * 2;
    nbCel(() => nbSmooth(g, [[-tw + 1, shY], [tw * .7 + hunch * .3, shY - 2], [tw + 2, shY + 14], [tw * 1.5 + hem, 30], [tw * 1.7 + hem, 45], [0, 47], [-tw * 1.7 + hem, 45], [-tw * 1.5, 30], [-tw - 2, shY + 14]], true), M, 2.4);
    nbCel(() => nbSmooth(g, [[-3, shY + 2], [4, shY + 2], [6, 46], [-4, 46]], true), T, 1.6, {sx:-1, sy:-1});
    g.fillStyle = T.l; g.strokeStyle = NB.OL; g.lineWidth = 1.2; g.beginPath(); g.rect(-tw * 1.6, 42, tw * 3.2, 3); g.fill();
    nbCel(() => nbPoly(g, [[-tw, 0], [tw, 0], [tw - 1, 5], [-tw + 1, 5]]), T, 1.4);
  } else if (C.outfit === "none"){
    // ребра, хребет, таз
    g.strokeStyle = NB.OL; g.lineWidth = 5; g.lineCap = "round"; g.beginPath(); g.moveTo(hx0 * .3, neckY); g.quadraticCurveTo(hunch * .3, -2, 0, hipY); g.stroke(); g.strokeStyle = BN.b; g.lineWidth = 2.6; g.stroke();
    for (let i = 0; i < 4; i++){ const yy = shY + 1 + i * 5.2, ww = (12 - i * 1.6) * B; nbCel(() => nbSmooth(g, [[-ww, yy + 2], [-ww * .3, yy - 1.6], [ww * .7, yy - 1.6], [ww, yy + 2.6]], false), BN, 0); g.strokeStyle = NB.OL; g.lineWidth = 3.8; g.beginPath(); nbSmooth(g, [[-ww, yy + 2], [-ww * .3, yy - 1.6], [ww * .7, yy - 1.6], [ww, yy + 2.6]], false); g.stroke(); g.strokeStyle = BN.b; g.lineWidth = 1.8; g.stroke(); }
    nbCel(() => nbSmooth(g, [[-7 * B, hipY - 3], [7 * B, hipY - 3], [6 * B, hipY + 5], [0, hipY + 7], [-6 * B, hipY + 5]], true), BN, 1.8);
    if (C.bone && C.main && (id === "mk_voivode" || id === "mk_bone_king")){ nbCel(() => nbPoly(g, [[-tw, shY - 1], [tw, shY - 1], [tw * .7, shY + 7], [-tw * .7, shY + 7]]), nbPal(C.trim), 1.6); }
  } else {
    // одяг/броня
    const tp = C.outfit === "armor" ? nbPal(nbMix(C.main, "#8890a0", .25), 1.0) : M;
    nbCel(torso, tp, 2.4);
    if (C.outfit === "armor"){ // нагрудник, пояс, наплічники
      nbCel(() => nbSmooth(g, [[-tw * .5, shY + 1], [tw * .6, shY + 1], [tw * .5, 5], [0, 8], [-tw * .45, 5]], true), {b:nbMix(tp.hex, "#ffffff", .12), d:tp.d, l:tp.l}, 1.4, {sx:-2, sy:-2});
      g.strokeStyle = "rgba(20,14,12,.55)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(1, shY + 3); g.lineTo(1, 7); g.stroke();
      nbCel(() => nbPoly(g, [[-tw * .8, wy - 6], [tw * .8, wy - 6], [tw * 1.05, wy + 8 + 2], [-tw * 1.05, wy + 8 + 2]]), nbPal(C.trim), 1.8);
      nbCel(nbEllP(shx - 5.5 * B, shY + 1, 6.5 * B, 5.5 * B), {b:tp.b, d:tp.d, l:tp.l}, 2); }
    else if (C.outfit === "construct"){ g.save(); g.beginPath(); torso(); g.clip(); g.strokeStyle = "rgba(20,14,10,.6)"; g.lineWidth = 1.6; for (let i = 0; i < 3; i++){ g.beginPath(); g.moveTo(-tw, shY + 6 + i * 8); g.lineTo(tw, shY + 6 + i * 8); g.stroke(); } g.shadowColor = C.eye; g.shadowBlur = 10; g.fillStyle = C.eye; g.globalAlpha = .6 + .3 * Math.sin(t * 3); g.beginPath(); g.ellipse(2, 0, 4.5, 6, 0, 0, TAU); g.fill(); g.restore(); }
    else if (C.outfit === "tunic" || C.outfit === "bark"){ nbCel(() => nbPoly(g, [[-tw * .35, shY], [tw * .35, shY], [tw * .9, wy], [-tw * .9, wy]]), nbPal(C.trim), 0, {sx:0, sy:-3}); g.save(); g.beginPath(); torso(); g.clip(); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(-tw, wy - 5, tw * 2, 3); g.restore();
      nbCel(() => nbPoly(g, [[-tw * .8, wy - 4], [tw * .8, wy - 4], [tw * .8, wy - 1], [-tw * .8, wy - 1]]), {b:"#4a3020", d:"#2a1a10", l:"#7a5a3a"}, 1.2); nbCel(nbCircP(0, wy - 2.5, 1.8), {b:"#e8c24a", d:"#a88020", l:"#fff0a0"}, .8); }
    else if (C.outfit === "rags"){ g.save(); g.beginPath(); torso(); g.clip(); g.strokeStyle = "rgba(15,10,6,.5)"; g.lineWidth = 1.2; for (let i = 0; i < 4; i++){ g.beginPath(); g.moveTo(-tw + i * 6, shY + 4); g.lineTo(-tw + i * 6 + 3, wy + 2); g.stroke(); } g.restore(); g.fillStyle = M.d; g.strokeStyle = NB.OL; g.lineWidth = 1.2; for (let i = 0; i < 4; i++){ const x = -tw * .7 + i * tw * .5; g.beginPath(); g.moveTo(x, wy); g.lineTo(x + 3 + Math.sin(t * 3 + i) * 1, wy + 11 + i % 2 * 4); g.lineTo(x + 6, wy); g.fill(); g.stroke(); } }
  }
  // ближня нога
  if (C.outfit !== "robe") drawLeg(legs[1], trouser, boot);
  // шия/голова
  const hy = shY - 14 + crouch * .8 + sw * .5, hx = hx0 + 3 + atk * 3, R = 13.5 * Math.min(1.12, .9 + B * .1);
  if (C.outfit !== "robe" && C.head !== "helm" && C.head !== "block" && C.head !== "skull" && C.head !== "frog") nbLimbs([[hx0 * .4, shY], [hx - 2, hy + 8, hx - 2, hy + 8, 6]].slice(0, 1).concat([[hx0 * .4, shY, hx - 1, hy + 6, 6 * B]]).slice(1), nbPal(C.skin), 1.6);
  // щит перед тілом
  const drawHead = () => {
    const eye = C.eye;
    if (C.head === "skull"){ nbSkull(g, hx + 2, hy, R * .92, C.skin, eye, atk ? 1 : 0, C.crown && C.bone, blink); }
    else if (C.head === "bare"){
      if (C.hair){ nbCel(() => nbSmooth(g, [[hx - R * .6, hy - R * .7], [hx + R * .2, hy - R * 1.25], [hx + R, hy - R * .3], [hx - R * 1.1, hy + 8 + sw * 2], [hx - R * 1.4, hy - R * .2]], true), nbPal(C.weed ? "#3a6a4a" : nbMix(C.trim, "#000000", .1)), 2); }
      nbCel(() => nbSmooth(g, [[hx - R * .85, hy - R * .1], [hx - R * .6, hy - R * .85], [hx + R * .2, hy - R], [hx + R * .85, hy - R * .55], [hx + R * 1.05, hy + R * .1], [hx + R * .6, hy + R * .85], [hx - R * .1, hy + R * .95], [hx - R * .7, hy + R * .5]], true), S, 2.2);
      nbCel(() => nbPoly(g, [[hx + R * .95, hy - R * .05], [hx + R * 1.2, hy + R * .22], [hx + R * .85, hy + R * .3]]), S, 1.4);
      nbEye(hx + R * .5, hy - R * .08, R * .17, eye, blink); g.strokeStyle = NB.OL; g.lineWidth = 1.6; g.beginPath(); g.moveTo(hx + R * .18, hy - R * .3); g.lineTo(hx + R * .8, hy - R * .22); g.stroke();
      g.strokeStyle = "rgba(30,10,8,.7)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(hx + R * .35, hy + R * .52); g.lineTo(hx + R * .8, hy + R * .5); g.stroke();
      if (C.beard){ nbCel(() => nbSmooth(g, [[hx - R * .3, hy + R * .3], [hx + R * .8, hy + R * .4], [hx + R * .5, hy + R * 1.2], [hx - R * .1, hy + R * 1.1]], true), nbPal("#3a2a1a"), 1.8); }
      if (!C.hair && id !== "zombie") nbCel(() => nbSmooth(g, [[hx - R * .9, hy - R * .1], [hx - R * .6, hy - R * 1.0], [hx + R * .3, hy - R * 1.05], [hx + R * .9, hy - R * .5], [hx + R * .1, hy - R * .55]], true), nbPal(C.bandana ? "#a03a2a" : "#4a3322"), 1.8);
      if (C.bandana){ g.fillStyle = "#a03a2a"; g.strokeStyle = NB.OL; g.lineWidth = 1.2; g.beginPath(); g.moveTo(hx - R * .9, hy - R * .2); g.lineTo(hx - R * 1.6, hy + Math.sin(t * 4) * 2); g.lineTo(hx - R * 1.4, hy - R * .6 + Math.sin(t * 4) * 2); g.closePath(); g.fill(); g.stroke(); }
    }
    else if (C.head === "hood" || C.head === "hat"){
      const hp = {b:M.b, d:M.dd, l:M.l};
      if (C.head === "hat"){ nbCel(() => nbSmooth(g, [[hx - R * 1.5, hy - R * .5], [hx - R * .2, hy - R * 1.9], [hx + R * 1.1, hy - R * 1.9 + Math.sin(t * 2) * 3], [hx + R * 1.5, hy - R * .55]], true), {b:T.b, d:T.dd, l:T.d}, 0); }
      nbCel(() => nbSmooth(g, [[hx - R * 1.15, hy + R * .6], [hx - R * 1.2, hy - R * .5], [hx - R * .1, hy - R * 1.3], [hx + R * .9, hy - R * .7], [hx + R * 1.1, hy + R * .1], [hx + R * .5, hy + R * .9]], true), hp, 2.4);
      if (C.head === "hat"){ nbCel(() => nbPoly(g, [[hx - R * 1.0, hy - R * .7], [hx + R * .2, hy - R * 2.5 + Math.sin(t * 2) * 2], [hx + R * 1.1, hy - R * .6]]), hp, 2.2); nbCel(() => nbSmooth(g, [[hx - R * 1.5, hy - R * .55], [hx, hy - R * .85], [hx + R * 1.5, hy - R * .55], [hx, hy - R * .3]], true), T, 1.8); }
      // обличчя в тіні
      g.fillStyle = "#0e0a10"; g.beginPath(); g.ellipse(hx + R * .35, hy + R * .05, R * .62, R * .62, 0, 0, TAU); g.fill();
      if (C.skull){ nbSkull(g, hx + R * .3, hy + R * .05, R * .58, "#e8e0cc", eye, 0, false, blink); } else { nbEye(hx + R * .5, hy - R * .05, R * .15, eye, blink); nbEye(hx + R * .05, hy - R * .02, R * .13, eye, blink); }
      if (C.mask && !C.skull){ nbCel(() => nbSmooth(g, [[hx - R * .1, hy + R * .15], [hx + R * .9, hy + R * .15], [hx + R * .7, hy + R * .8], [hx, hy + R * .75]], true), nbPal("#2a2018"), 1.6); }
    }
    else if (C.head === "helm"){
      const hp = nbPal(nbMix(C.main, "#8a90a0", .3), 1);
      if (C.plume){ g.fillStyle = "#b02a2a"; g.strokeStyle = NB.OL; g.lineWidth = 1.4; g.beginPath(); g.moveTo(hx - R * .2, hy - R * 1.0); g.quadraticCurveTo(hx - R * 1.6, hy - R * 1.6 + Math.sin(t * 3) * 3, hx - R * 2, hy - R * .2 + Math.sin(t * 3) * 3); g.quadraticCurveTo(hx - R * 1.1, hy - R * .7, hx - R * .5, hy - R * .6); g.fill(); g.stroke(); }
      nbCel(() => nbSmooth(g, [[hx - R * .95, hy + R * .85], [hx - R * 1.0, hy - R * .3], [hx - R * .5, hy - R * 1.05], [hx + R * .4, hy - R * 1.1], [hx + R * 1.0, hy - R * .3], [hx + R * 1.0, hy + R * .85]], true), hp, 2.4);
      g.fillStyle = "#0c0808"; g.beginPath(); g.rect(hx + R * .05, hy - R * .22, R * .95, R * .3); g.fill();
      g.save(); g.shadowColor = C.eye; g.shadowBlur = 6; g.fillStyle = C.eye; g.globalAlpha = blink > .5 ? 1 : .4; g.fillRect(hx + R * .45, hy - R * .15, R * .4, R * .16); g.restore();
      g.strokeStyle = "rgba(20,14,12,.5)"; g.lineWidth = 1; g.beginPath(); g.moveTo(hx + R * .2, hy + R * .1); g.lineTo(hx + R * .2, hy + R * .8); g.moveTo(hx + R * .6, hy + R * .1); g.lineTo(hx + R * .6, hy + R * .8); g.stroke();
      if (C.crest){ nbCel(() => nbSmooth(g, [[hx - R * .6, hy - R * .95], [hx - R * .1, hy - R * 1.7 + Math.sin(t * 3) * 1.5], [hx + R * .8, hy - R * 1.0]], true), nbPal(C.trim), 1.8); }
    }
    else if (C.head === "frog" || C.head === "fish"){
      const fr = C.head === "frog", hp = nbPal(C.skin, 1.15);
      if (!fr) nbCel(() => nbSmooth(g, [[hx - R * 1.1, hy - R * .3], [hx - R * .5, hy - R * 1.9 + Math.sin(t * 4) * 1.5], [hx + R * .3, hy - R * 1.0]], true), nbPal(nbMix(C.skin, "#e8a04a", .5)), 1.8);
      nbCel(() => nbSmooth(g, fr ? [[hx - R * .9, hy + R * .2], [hx - R * .7, hy - R * .6], [hx + R * .3, hy - R * .8], [hx + R * 1.3, hy - R * .3], [hx + R * 1.4, hy + R * .5], [hx + R * .4, hy + R * .95], [hx - R * .5, hy + R * .85]] : [[hx - R * .9, hy + R * .1], [hx - R * .6, hy - R * .9], [hx + R * .5, hy - R * .9], [hx + R * 1.3, hy - R * .1], [hx + R * 1.1, hy + R * .6], [hx, hy + R * .95], [hx - R * .7, hy + R * .7]], true), hp, 2.4);
      nbCel(() => nbSmooth(g, [[hx - R * .2, hy + R * .5], [hx + R * 1.3, hy + R * .35], [hx + R * .9, hy + R * .95], [hx, hy + R * .95]], true), nbPal(nbMix(C.skin, "#f4e8b0", .55)), 0, {sx:0, sy:-1.5});
      g.strokeStyle = NB.OL; g.lineWidth = 1.6; g.beginPath(); g.moveTo(hx + R * 1.38, hy + R * .3); g.quadraticCurveTo(hx + R * .6, hy + R * (fr ? .62 : .5) + (atk ? 3 : 0), hx - R * .2, hy + R * .4); g.stroke();
      if (fr){ for (const [ex, er] of [[hx + R * .75, R * .5], [hx + R * .05, R * .42]]){ nbCel(nbCircP(ex, hy - R * .72, er), hp, 2); g.fillStyle = "#f0d848"; g.beginPath(); g.arc(ex + 1, hy - R * .72, er * .66, 0, TAU); g.fill(); g.fillStyle = "#120a06"; g.fillRect(ex + .2, hy - R * .72 - er * .55 * blink, 1.8, er * 1.1 * blink); } }
      else { nbEye(hx + R * .55, hy - R * .18, R * .24, "#f0e060", blink); g.strokeStyle = "rgba(10,40,60,.6)"; g.lineWidth = 1.2; for (let i = 0; i < 3; i++){ g.beginPath(); g.moveTo(hx - R * .25 - i * 1.6, hy - R * .1); g.lineTo(hx - R * .35 - i * 1.6, hy + R * .4); g.stroke(); } }
    }
    else if (C.head === "block"){ nbCel(() => nbSmooth(g, [[hx - R, hy - R * .7], [hx + R * .9, hy - R * .8], [hx + R * 1.0, hy + R * .7], [hx - R * .9, hy + R * .8]], true), M, 2.4);
      g.fillStyle = "#0c0806"; g.fillRect(hx - R * .2, hy - R * .2, R * 1.1, R * .38); g.save(); g.shadowColor = C.eye; g.shadowBlur = 9; g.fillStyle = C.eye; g.fillRect(hx + R * .1, hy - R * .14, R * .7, R * .22); g.restore(); }
    if (C.horns){ g.fillStyle = "#e8dcc0"; g.strokeStyle = NB.OL; g.lineWidth = 1.5; for (const [dx, s] of [[-.3, -1], [.9, 1]]){ g.beginPath(); g.moveTo(hx + R * dx, hy - R * .8); g.quadraticCurveTo(hx + R * dx + s * R * 1.1, hy - R * 1.1, hx + R * dx + s * R * .9, hy - R * 2.1); g.quadraticCurveTo(hx + R * dx + s * R * .4, hy - R * 1.2, hx + R * dx + s * R * .1, hy - R * .7); g.closePath(); g.fill(); g.stroke(); } }
    if (C.crown && !(C.bone && C.head === "skull")){ g.fillStyle = "#e8c24a"; g.strokeStyle = NB.OL; g.lineWidth = 1.4; const cy = hy - R * (C.head === "hood" ? 1.05 : 1.05); g.beginPath(); g.moveTo(hx - R * .7, cy + 2); g.lineTo(hx - R * .7, cy - 7); g.lineTo(hx - R * .3, cy - 2); g.lineTo(hx, cy - 9); g.lineTo(hx + R * .3, cy - 2); g.lineTo(hx + R * .7, cy - 7); g.lineTo(hx + R * .7, cy + 2); g.closePath(); g.fill(); g.stroke(); }
  };
  drawHead();
  // щит
  if (C.shield){ const sx = 10 + hunch * .3, sy = 3; g.save(); g.translate(sx, sy); nbCel(() => nbSmooth(g, [[-8, -12], [8, -12], [9, 2], [0, 14], [-9, 2]], true), nbPal(C.outfit === "armor" || C.bone ? nbMix(C.trim, "#7a7a86", .3) : "#6a4a26"), 2.2);
    g.fillStyle = C.crest ? "#c9a24a" : "rgba(220,210,190,.55)"; g.beginPath(); g.arc(0, -2, 3.4, 0, TAU); g.fill(); g.strokeStyle = NB.OL; g.lineWidth = 1; g.stroke(); g.restore(); }
  // ближня рука з зброєю
  const nh = arm(false), ang = wk === "sword" ? (.05 + atk * 1.2 + Math.sin(t * 2 + seed) * .05) : wk === "dagger" ? (.3 + atk * 1.0) : wk === "spear" ? (-.12 + atk * .9) : wk === "staff" ? (.12 + Math.sin(t * 1.6) * .03) : wk === "club" ? (.15 + atk * 1.5) : wk === "bell" ? (Math.sin(t * 3) * .25) : 0;
  if (wk === "bow") nbBow(g, nh[0] + 2, nh[1], 1, atk, t); else if (wk) nbWeapon(g, wk, nh[0], nh[1], ang, C.eye, t, C);
  g.restore();
};
NEW_SHAPES.__biped.full = true; NEW_SHAPES.beast.full = true;
for (const s of ["humanoid", "knight", "robed", "skeleton", "giant", "elf", "golem", "frog"]) NEW_SHAPES[s] = NEW_SHAPES.__biped;
