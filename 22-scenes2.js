/* ============ сцени локацій: об'ємні будівлі, стежки до виходів, вода, світло ============ */
// світло з північного заходу: освітлені лівий і верхній боки, тіні падають праворуч униз
const ZW = 900, ZH = 528;
const zr = v => Math.round(v * 10) / 10;
// --- річка зі старої сцени: та сама смуга, де моби не ходять ---
const Z_RIVER = (() => { const segs = [[[650, -10], [610, 120], [660, 220], [630, 300]], [[630, 300], [600, 380], [650, 450], [610, 540]]], pts = [];
  for (const [a, b, c, d] of segs) for (let i = 0; i <= 60; i++){ const t = i / 60, u = 1 - t; pts.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]); }
  return pts; })();
function zRiverX(y){ const P = Z_RIVER; for (let i = 1; i < P.length; i++) if (P[i][1] >= y){ const [ax, ay] = P[i - 1], [bx, by] = P[i]; return ax + (bx - ax) * ((y - ay) / Math.max(.001, by - ay)); } return P[P.length - 1][0]; }

function zCtx(id){
  const c = SCENE[id] || {b:"ash"}, Bm = BIOME[c.b] || BIOME.ash, r = rng("scn2-" + id), L = LOCS[id] || {npcs:[]}, N = NODES[id];
  const u = "z" + id.replace(/[^a-z0-9]/gi, "");
  const K = {id, c, Bm, r, L, N, u, items:[], glow:"", top:"", under:"", over:"", claims:[], paths:[], safe:N.kind === "city" || N.kind === "town"};
  K.pk = a => a[Math.floor(r() * a.length)];
  K.rr = (a, b) => a + r() * (b - a);
  K.npcs = (L.npcs || []).map(n => [n[1], n[2]]);
  K.exits = neighbors(id).map(nb => { const a = dirTo(id, nb); return [450 + Math.cos(a) * 400, 290 + Math.sin(a) * 210, a, nb]; });
  K.hub = c.lake ? [300, 430] : c.sea ? [380, 300] : [450, 310];
  K.put = (y, s) => K.items.push([y, s]);
  K.wet = (x, y, pad = 0) => (c.river && Math.abs(x - zRiverX(y)) < 54 + pad) || (c.lake && ((x - 540) / (318 + pad)) ** 2 + ((y - 250) / (132 + pad)) ** 2 < 1) || (c.sea && x + (y - 230) > 800 - pad * 1.4);
  K.onPath = (x, y, pad = 0) => K.paths.some(P => P.pts.some(([px, py]) => Math.hypot(px - x, (py - y) * 1.25) < P.w / 2 + pad));
  K.free = (x, y, rad = 10, o = {}) => {
    if (x < -30 || x > 930 || y < -10 || y > 570) return false;
    if (!o.wet && K.wet(x, y, rad * .5)) return false;
    if (!o.path && K.onPath(x, y, rad * .6)) return false;
    if (!o.npc && K.npcs.some(([nx, ny]) => Math.hypot(nx - x, (ny - y) * 1.3) < 38 + rad * .5)) return false;
    if (!o.exit && K.exits.some(([ex, ey]) => Math.hypot(ex - x, (ey - y) * 1.7) < 74 + rad * .5)) return false;
    if (!o.plate && x + rad * .5 > 290 && x - rad * .5 < 610 && y < 70) return false;
    if (!o.claim && K.claims.some(([cx, cy, cr]) => Math.hypot(cx - x, (cy - y) * 1.5) < cr + rad * .8)) return false;
    if (o.edge && ((x - 470) / 330) ** 2 + ((y - 320) / 175) ** 2 < 1) return false;
    return true;
  };
  K.claim = (x, y, rad) => K.claims.push([x, y, rad]);
  K.place = (x, y, rad, fn, o = {}) => { for (const [ox, oy] of [[0, 0], [16, 0], [-16, 0], [0, -12], [0, 12], [26, -10], [-26, -10], [28, 10], [-28, 10], [40, 0], [-40, 0], [0, -24], [0, 24]]){ const qx = x + ox, qy = y + oy; if (K.free(qx, qy, rad, o)){ K.put(qy + (o.dy || 0), fn(qx, qy)); if (!o.noclaim) K.claim(qx, qy - (o.cy || 0), rad); return [qx, qy]; } } return null; };
  K.scatter = (n, rad, fn, o = {}) => { const bx = o.box || [-10, 80, 910, 545]; let k = 0;
    for (let i = 0; i < n; i++) for (let t = 0; t < (o.tries || 8); t++){ const x = bx[0] + r() * (bx[2] - bx[0]), y = bx[1] + r() * (bx[3] - bx[1]); if (!K.free(x, y, rad, o)) continue; K.put(y, fn(x, y, k++)); if (o.claim) K.claim(x, y, rad); break; } };
  K.light = (x, y, R, col, op = .5) => { K.glow += zGlow(x, y, R, col, op); };
  return K;
}

/* ---------- світіння, тіні, дрібниці ---------- */
function zGlow(x, y, R, col, op = .5){ return `<circle cx="${x}" cy="${y}" r="${R}" fill="${col}" opacity="${op * .22}" filter="url(#zb2)"/><circle cx="${x}" cy="${y}" r="${R * .45}" fill="${col}" opacity="${op * .45}" filter="url(#zb1)"/>`; }
function zSh(x, y, rx, ry, op = .3){ return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#08070a" opacity="${op}" filter="url(#zb1)"/>`; }
// тінь від прямокутної споруди: падає праворуч униз
function zCast(x0, x1, y, h, d, op = .32){ const k = h * .42; return `<path d="M${x0} ${y}L${x1 + d * .62} ${y - d * .5}L${x1 + d * .62 + k} ${y - d * .5 + k * .35}L${x0 + k} ${y + k * .35}z" fill="#08070a" opacity="${op}" filter="url(#zb1)"/>`; }
function zSmoke(x, y, s = 1, col = "#b8b4aa"){ let o = ""; for (let i = 0; i < 5; i++) o += `<circle cx="${x + i * 5 * s + Math.sin(i * 1.3) * 4 * s}" cy="${y - i * 11 * s}" r="${(5 + i * 2.6) * s}" fill="${col}" opacity="${.3 - i * .05}" filter="url(#zb1)"/>`; return o; }

function zDefs(K){
  const u = K.u;
  return `<defs>
  <filter id="zb1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="zb2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="zb3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="26"/></filter>
  <filter id="zgr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${3 + K.r() * 80 | 0}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .75 -.3"/></filter>
  <filter id="zmt" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="4" seed="${7 + K.r() * 80 | 0}"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .85  0 0 0 .55 -.24"/></filter>
  <linearGradient id="zlt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2cc" stop-opacity=".16"/><stop offset=".5" stop-color="#fff2cc" stop-opacity="0"/><stop offset="1" stop-color="#0a0a1a" stop-opacity=".26"/></linearGradient>
  <linearGradient id="zhz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8eef0" stop-opacity=".2"/><stop offset=".22" stop-color="#e8eef0" stop-opacity="0"/></linearGradient>
  <linearGradient id="zwt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5a6c"/><stop offset="1" stop-color="#22394a"/></linearGradient>
  <linearGradient id="zwd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26363a"/><stop offset="1" stop-color="#151f22"/></linearGradient>
  <radialGradient id="zvg" cx=".5" cy=".48" r=".75"><stop offset=".58" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
  </defs>`;
}

/* ---------- земля ---------- */
function zGround(K){
  const {r, Bm} = K, g = Bm.ground; let s = `<rect width="${ZW}" height="${ZH}" fill="${g[0]}"/>`;
  for (let i = 0; i < 16; i++) s += `<ellipse cx="${r() * ZW}" cy="${r() * ZH}" rx="${80 + r() * 170}" ry="${40 + r() * 80}" fill="${g[1 + (i % 2)]}" opacity=".8" filter="url(#zb3)"/>`;
  s += `<rect width="${ZW}" height="${ZH}" filter="url(#zmt)" opacity=".32"/>`;
  return s;
}
// дрібна фактура за біомом
function zTexture(K){
  const {r, c, Bm} = K, b = c.b; let s = "", d = "", d2 = "";
  const grassy = ["meadow", "forest", "polonyna", "vineyard", "battle", "swamp", "bog"].includes(b);
  if (grassy){ const gc = Bm.grass, n = b === "polonyna" ? 260 : b === "meadow" ? 220 : b === "forest" ? 150 : 120;
    for (let i = 0; i < n; i++){ const x = r() * ZW, y = 60 + r() * 470; if (K.wet(x, y, 4) || K.onPath(x, y, 2)) continue; const h = 5 + r() * 6, L = r() < .55; (L ? (d += `M${zr(x)} ${zr(y)}l-2 -${zr(h)}M${zr(x + 1.5)} ${zr(y)}l.6 -${zr(h * 1.2)}M${zr(x + 3)} ${zr(y)}l2.4 -${zr(h * .9)}`) : (d2 += `M${zr(x)} ${zr(y)}l-1.6 -${zr(h)}M${zr(x + 1.5)} ${zr(y)}l.8 -${zr(h * 1.1)}M${zr(x + 3)} ${zr(y)}l2 -${zr(h * .8)}`)); }
    s += `<path d="${d}" stroke="${shade(Bm.grass, 1.22)}" stroke-width="1.2" stroke-linecap="round" fill="none"/><path d="${d2}" stroke="${shade(Bm.grass, .78)}" stroke-width="1.2" stroke-linecap="round" fill="none"/>`; }
  if (["meadow", "polonyna"].includes(b)) for (let i = 0; i < (b === "polonyna" ? 70 : 50); i++){ const x = r() * ZW, y = 80 + r() * 440; if (K.wet(x, y, 4) || K.onPath(x, y, 2)) continue; const col = K.pk(["#f2efe6", "#e8d070", "#d87a8a", "#a8b8f0", "#f0b050"]); for (let k = 0; k < 3; k++) s += `<circle cx="${zr(x + k * 3 - 3)}" cy="${zr(y + (k % 2) * 2)}" r="1.6" fill="${col}"/>`; }
  if (b === "forest") for (let i = 0; i < 26; i++){ const x = r() * ZW, y = 90 + r() * 430; if (K.wet(x, y, 6) || K.onPath(x, y, 6)) continue; s += r() < .5 ? zFern(x, y, .8 + r() * .5) : zMush(x, y); }
  if (b === "ash" || b === "dark" || b === "bone"){ let cr = ""; for (let i = 0; i < 26; i++){ let x = r() * ZW, y = 80 + r() * 440; cr += `M${zr(x)} ${zr(y)}`; for (let k = 0; k < 4; k++){ x += 6 + r() * 14; y += (r() * 2 - 1) * 6; cr += `L${zr(x)} ${zr(y)}`; } } s += `<path d="${cr}" stroke="#1e1c18" stroke-width="1.2" fill="none" opacity=".45"/>`;
    let pb = ""; for (let i = 0; i < 90; i++){ const x = r() * ZW, y = 70 + r() * 450; pb += `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(1.4 + r() * 2)}" ry="${zr(1 + r())}" fill="${shade(Bm.ground[1], .75 + r() * .5)}"/>`; } s += pb;
    if (b === "ash") for (let i = 0; i < 16; i++) s += `<circle cx="${zr(r() * ZW)}" cy="${zr(80 + r() * 440)}" r="1.1" fill="#ff8a3a" opacity=".7"/>`;
    if (b === "bone") for (let i = 0; i < 22; i++){ const x = r() * ZW, y = 90 + r() * 430; if (!K.onPath(x, y, 4)) s += zBone(x, y, .8 + r() * .5, r); } }
  if (b === "snow"){ for (let i = 0; i < 18; i++){ const x = r() * ZW, y = 80 + r() * 440; s += `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(30 + r() * 50)}" ry="${zr(6 + r() * 6)}" fill="#f6f8fa" opacity=".55"/><ellipse cx="${zr(x + 6)}" cy="${zr(y + 4)}" rx="${zr(26 + r() * 40)}" ry="${zr(3 + r() * 3)}" fill="#9aa8b8" opacity=".25"/>`; }
    for (let i = 0; i < 60; i++) s += `<circle cx="${zr(r() * ZW)}" cy="${zr(70 + r() * 450)}" r=".9" fill="#fff"/>`; }
  if (b === "sand"){ let rp = ""; for (let i = 0; i < 40; i++){ const x = r() * ZW, y = 80 + r() * 440; if (K.wet(x, y, 6)) continue; rp += `M${zr(x)} ${zr(y)}q12 -4 24 0t24 0`; } s += `<path d="${rp}" stroke="${shade(Bm.ground[0], .82)}" stroke-width="1.3" fill="none" opacity=".7"/>`;
    for (let i = 0; i < 18; i++){ const x = r() * ZW, y = 90 + r() * 430; if (!K.wet(x, y)) s += `<path d="M${zr(x)} ${zr(y)}a3 2.4 0 0 1 6 0z" fill="#f2e8d6"/><path d="M${zr(x + 3)} ${zr(y)}v-2" stroke="#c8b898" stroke-width=".6"/>`; } }
  if (b === "battle"){ let rt = ""; for (let i = 0; i < 12; i++){ const x = r() * ZW, y = 100 + r() * 400; rt += `M${zr(x)} ${zr(y)}q40 ${zr((r() * 2 - 1) * 8)} 90 ${zr((r() * 2 - 1) * 10)}`; } s += `<path d="${rt}" stroke="#3a3024" stroke-width="3" fill="none" opacity=".4"/><path d="${rt}" stroke="#3a3024" stroke-width="2" fill="none" opacity=".3" transform="translate(0 6)"/>`;
    for (let i = 0; i < 7; i++){ const x = r() * ZW, y = 110 + r() * 400; if (!K.onPath(x, y, 20)) s += zCrater(x, y, .7 + r() * .7); } }
  if (b === "swamp" || b === "bog") for (let i = 0; i < 26; i++){ const x = r() * ZW, y = 90 + r() * 430; if (!K.onPath(x, y, 10)) s += `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(10 + r() * 22)}" ry="${zr(3 + r() * 5)}" fill="#1e2618" opacity=".45"/>`; }
  return s;
}
function zFern(x, y, s){ let d = ""; for (let i = -3; i <= 3; i++){ const a = -1.57 + i * .32, L = (14 - Math.abs(i) * 2) * s; d += `M${zr(x)} ${zr(y)}q${zr(Math.cos(a) * L * .4)} ${zr(Math.sin(a) * L * .6)} ${zr(Math.cos(a) * L)} ${zr(Math.sin(a) * L)}`; } return `<path d="${d}" stroke="#4a6a32" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#6a8a44" stroke-width=".8" fill="none" transform="translate(-.6 -.6)"/>`; }
function zMush(x, y){ return `<path d="M${zr(x - .8)} ${zr(y)}v-3h1.6v3z" fill="#e8dcc0"/><path d="M${zr(x - 3)} ${zr(y - 3)}a3 2.4 0 0 1 6 0z" fill="#b0402a"/><circle cx="${zr(x - 1)}" cy="${zr(y - 4)}" r=".5" fill="#fff"/>`; }
function zBone(x, y, s, r){ return `<path d="M${zr(x - 6 * s)} ${zr(y)}l${zr(12 * s)} -${zr(2 * s)}" stroke="#e8dfc8" stroke-width="${zr(1.8 * s)}" stroke-linecap="round" opacity=".85"/>` + (r() < .3 ? `<circle cx="${zr(x + 7 * s)}" cy="${zr(y - 3 * s)}" r="${zr(2.6 * s)}" fill="#e8dfc8"/><circle cx="${zr(x + 6 * s)}" cy="${zr(y - 3.4 * s)}" r="${zr(.7 * s)}" fill="#1a1612"/><circle cx="${zr(x + 8 * s)}" cy="${zr(y - 3.4 * s)}" r="${zr(.7 * s)}" fill="#1a1612"/>` : ""); }
function zCrater(x, y, s){ return `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(30 * s)}" ry="${zr(11 * s)}" fill="#6a5e48" opacity=".6"/><ellipse cx="${zr(x + 2)}" cy="${zr(y + 1)}" rx="${zr(22 * s)}" ry="${zr(7 * s)}" fill="#2a2218"/><ellipse cx="${zr(x + 5)}" cy="${zr(y + 2)}" rx="${zr(14 * s)}" ry="${zr(4 * s)}" fill="#1a140e"/>`; }

/* ---------- стежки до виходів ---------- */
function zPathStyle(K){
  const b = K.c.b, kind = K.N.kind;
  if (b === "bog") return "planks";
  if (kind === "city") return "cobble";
  if (b === "snow") return "snow";
  if (b === "sand") return "sand";
  if (kind === "town") return "gravel";
  return "trail";
}
function zPaths(K){
  const {r} = K, st = zPathStyle(K), [hx, hy] = K.hub; let s = "";
  for (const [ex, ey, a, nb] of K.exits){
    const kx = Math.cos(a), ky = Math.sin(a), tx = ex + kx * 90, ty = ey + ky * 70, L = Math.hypot(tx - hx, ty - hy), ux = (tx - hx) / L, uy = (ty - hy) / L, b1 = (r() * 2 - 1) * 70, b2 = (r() * 2 - 1) * 60;
    const c1 = [hx + ux * L * .33 - uy * b1, hy + uy * L * .33 + ux * b1 * .7], c2 = [hx + ux * L * .66 - uy * b2, hy + uy * L * .66 + ux * b2 * .7];
    const rd = roadOf(K.id, nb), w = st === "cobble" ? 38 : st === "planks" ? 30 : st === "gravel" ? 30 : rd && rd.danger ? 19 : 25;
    const pts = []; for (let i = 0; i <= 48; i++){ const t = i / 48, u = 1 - t; pts.push([u * u * u * hx + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * tx, u * u * u * hy + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * ty]); }
    K.paths.push({pts, w, nb});
    let seg = [], wetRun = [];
    const flush = () => { if (seg.length > 1) s += zPathDraw(seg, w, st, K, rd); seg = []; };
    for (let i = 0; i < pts.length; i++){ const p = pts[i], w0 = K.wet(p[0], p[1], 2); if (w0){ flush(); wetRun.push(i); } else { if (wetRun.length){ if (K.c.river) zBridgeFor(K, pts, wetRun, w, st); wetRun = []; } seg.push(p); } }
    flush(); if (wetRun.length && K.c.river) zBridgeFor(K, pts, wetRun, w, st);
  }
  s += zPlaza(K, hx, hy, st);
  return s;
}
function zPathD(pts){ return pts.map((p, i) => (i ? "L" : "M") + zr(p[0]) + " " + zr(p[1])).join(""); }
function zPathDraw(pts, w, st, K, rd){
  const d = zPathD(pts), Bm = K.Bm, g = Bm.ground[0];
  if (st === "planks") return `<path d="${d}" stroke="#141a12" stroke-width="${w + 8}" fill="none" stroke-linecap="round" opacity=".55" filter="url(#zb1)"/><path d="${d}" stroke="#3a2a1a" stroke-width="${w}" fill="none"/><path d="${d}" stroke="#7a5a3a" stroke-width="${w - 4}" fill="none" stroke-dasharray="7 2.4"/><path d="${d}" stroke="#9a7a50" stroke-width="${w - 18}" fill="none" stroke-dasharray="7 2.4" opacity=".55"/>`;
  if (st === "trail"){ const c0 = mixHex(g, "#3a2e22", .35), c1 = mixHex(g, "#8a7456", .38), c2 = mixHex(g, "#a08a66", .32);
    return `<path d="${d}" stroke="${c0}" stroke-width="${w + 6}" fill="none" stroke-linecap="round" opacity=".55" filter="url(#zb1)"/><path d="${d}" stroke="${c1}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".9"/><path d="${d}" stroke="${c2}" stroke-width="${w * .4}" fill="none" stroke-linecap="round" opacity=".5"/><path d="${d}" stroke="${c0}" stroke-width="1.6" fill="none" opacity=".45" transform="translate(0 -${w * .22})"/><path d="${d}" stroke="${c0}" stroke-width="1.6" fill="none" opacity=".45" transform="translate(0 ${w * .22})"/>` + (rd && rd.danger ? `<path d="${d}" stroke="${shade(Bm.grass, .9)}" stroke-width="${w * .5}" fill="none" stroke-dasharray="2 7" opacity=".55"/>` : ""); }
  const C = {cobble:["#6a645a", "#9a9282", "#b4ac9a"], gravel:["#5a5244", "#8a806c", "#a49a84"], snow:["#9aa6b4", "#dfe4ea", "#f2f4f6"], sand:["#9a8a62", "#cdbd8e", "#ddd0a4"]}[st];
  let s = `<path d="${d}" stroke="#0a0806" stroke-width="${w + 10}" fill="none" stroke-linecap="round" opacity=".22" filter="url(#zb1)"/><path d="${d}" stroke="${C[0]}" stroke-width="${w + 4}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C[1]}" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C[2]}" stroke-width="${w * .45}" fill="none" stroke-linecap="round" opacity=".55"/>`;
  if (st === "cobble") s += `<path d="${d}" stroke="${C[0]}" stroke-width="${w - 4}" fill="none" stroke-dasharray="2 5" opacity=".7"/><path d="${d}" stroke="${C[0]}" stroke-width="${w - 14}" fill="none" stroke-dasharray="2 5" stroke-dashoffset="3" opacity=".6"/>`;
  else if (st === "dirt" || st === "sand"){ s += `<path d="${d}" stroke="${C[0]}" stroke-width="2" fill="none" opacity=".55" transform="translate(0 -${w * .2})"/><path d="${d}" stroke="${C[0]}" stroke-width="2" fill="none" opacity=".55" transform="translate(0 ${w * .2})"/>`; if (rd && rd.danger) s += `<path d="${d}" stroke="${Bm.grass}" stroke-width="${w * .3}" fill="none" stroke-dasharray="3 9" opacity=".7"/>`; }
  else if (st === "gravel") s += `<path d="${d}" stroke="${C[0]}" stroke-width="${w - 6}" fill="none" stroke-dasharray="1.4 6" opacity=".8"/>`;
  else if (st === "snow") s += `<path d="${d}" stroke="#aab4c2" stroke-width="${w * .3}" fill="none" stroke-dasharray="3 7" opacity=".7"/>`;
  return s;
}
function mixHex(a, b, t){ const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const m = sh => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t); return "#" + [16, 8, 0].map(sh => m(sh).toString(16).padStart(2, "0")).join(""); }
function zPlaza(K, x, y, st){
  if (st === "planks") return `<ellipse cx="${x + 2}" cy="${y + 4}" rx="56" ry="22" fill="#141a12" opacity=".5" filter="url(#zb1)"/><ellipse cx="${x}" cy="${y}" rx="50" ry="19" fill="#5a4028"/>` + [...Array(11)].map((_, i) => `<path d="M${x - 46 + i * 9.2} ${y - 16 + Math.abs(i - 5) * 1.6}v${32 - Math.abs(i - 5) * 3.2}" stroke="#3a2a1a" stroke-width="1.6"/>`).join("") + `<ellipse cx="${x}" cy="${y}" rx="50" ry="19" fill="none" stroke="#3a2a1a" stroke-width="2.4"/>`;
  if (st === "trail" || st === "snow" || st === "sand"){ const g = K.Bm.ground[0], c1 = st === "snow" ? "#dfe4ea" : st === "sand" ? "#cdbd8e" : mixHex(g, "#8a7456", .38); return `<ellipse cx="${x}" cy="${y}" rx="46" ry="20" fill="${c1}" opacity=".85" filter="url(#zb1)"/>`; }
  const C = {cobble:["#6a645a", "#a49c8a", "#8a8474"], gravel:["#5a5244", "#8e846e", "#7a7060"]}[st], R = st === "cobble" ? 96 : 66, Ry = st === "cobble" ? 40 : 28;
  let s = `<ellipse cx="${x + 3}" cy="${y + 4}" rx="${R + 6}" ry="${Ry + 4}" fill="#000" opacity=".2" filter="url(#zb1)"/><ellipse cx="${x}" cy="${y}" rx="${R + 3}" ry="${Ry + 2}" fill="${C[0]}"/><ellipse cx="${x}" cy="${y}" rx="${R}" ry="${Ry}" fill="${C[1]}"/>`;
  for (let k = 1; k < 4; k++) s += `<ellipse cx="${x}" cy="${y}" rx="${R * k / 4}" ry="${Ry * k / 4}" fill="none" stroke="${C[2]}" stroke-width="1.2" stroke-dasharray="3 4" opacity=".7"/>`;
  return s;
}
function zBridgeFor(K, pts, run, w, st){
  const i0 = Math.max(0, run[0] - 1), i1 = Math.min(pts.length - 1, run[run.length - 1] + 1), [ax, ay] = pts[i0], [bx, by] = pts[i1];
  const stone = st === "cobble" || st === "gravel"; K.put((ay + by) / 2 + 30, zBridge(ax, ay, bx, by, w + 6, stone));
}
function zBridge(ax, ay, bx, by, w, stone){
  const L = Math.hypot(bx - ax, by - ay) + 20, a = Math.atan2(by - ay, bx - ax) * 180 / Math.PI, cx = (ax + bx) / 2, cy = (ay + by) / 2, hw = w / 2;
  const deck = stone ? "#9a9282" : "#8a6a44", edge = stone ? "#5a544a" : "#4a3220";
  let s = `<g transform="translate(${zr(cx)} ${zr(cy)}) rotate(${zr(a)})"><rect x="${zr(-L / 2 + 6)}" y="${zr(-hw + 10)}" width="${zr(L)}" height="${zr(w)}" fill="#000" opacity=".35" filter="url(#zb1)"/>`;
  if (stone) s += `<path d="M${zr(-L / 2 + 14)} ${zr(hw + 4)}q${zr(L / 2 - 14)} -${zr(hw)} ${zr(L - 28)} 0" fill="#1a2a34" stroke="${edge}" stroke-width="3"/>`;
  s += `<rect x="${zr(-L / 2)}" y="${zr(-hw)}" width="${zr(L)}" height="${zr(w)}" rx="2" fill="${deck}"/>`;
  if (!stone){ let pl = ""; for (let x = -L / 2 + 4; x < L / 2; x += 6) pl += `M${zr(x)} ${zr(-hw)}v${zr(w)}`; s += `<path d="${pl}" stroke="${edge}" stroke-width="1" opacity=".55"/>`; }
  else { let pl = ""; for (let x = -L / 2 + 6; x < L / 2; x += 9) pl += `M${zr(x)} ${zr(-hw + 4)}h4M${zr(x + 4)} ${zr(hw - 6)}h4`; s += `<path d="${pl}" stroke="${edge}" stroke-width="1.6" opacity=".5"/>`; }
  s += `<path d="M${zr(-L / 2)} ${zr(-hw)}h${zr(L)}" stroke="${edge}" stroke-width="${stone ? 6 : 3}"/><path d="M${zr(-L / 2)} ${zr(hw)}h${zr(L)}" stroke="${edge}" stroke-width="${stone ? 7 : 4}"/>`;
  if (!stone){ let po = ""; for (let x = -L / 2; x <= L / 2; x += L / 4) po += `<rect x="${zr(x - 2.5)}" y="${zr(-hw - 8)}" width="5" height="9" fill="${edge}"/><rect x="${zr(x - 2.5)}" y="${zr(hw - 3)}" width="5" height="9" fill="${edge}"/>`; s += po + `<path d="M${zr(-L / 2)} ${zr(-hw - 6)}h${zr(L)}M${zr(-L / 2)} ${zr(hw - 1)}h${zr(L)}" stroke="#6a4a2a" stroke-width="2"/>`; }
  return s + `</g>`;
}

/* ---------- вода ---------- */
function zWater(K){
  const {c, r} = K; let s = "";
  if (c.river){ const d = zPathD(Z_RIVER);
    s += `<path d="${d}" stroke="#4a4a32" stroke-width="134" fill="none" opacity=".35" filter="url(#zb1)"/><path d="${d}" stroke="${K.c.b === "snow" ? "#b8c0c8" : K.c.b === "ash" || K.c.b === "dark" || K.c.b === "bone" ? "#5a5648" : "#8a7a58"}" stroke-width="122" fill="none"/><path d="${d}" stroke="#1a2a30" stroke-width="106" fill="none"/><path d="${d}" stroke="url(#zwt)" stroke-width="96" fill="none"/>`;
    s += `<path d="${d}" stroke="#4e7284" stroke-width="40" fill="none" opacity=".35" transform="translate(-14 0)"/><path d="${d}" stroke="#8ab0c0" stroke-width="2" fill="none" stroke-dasharray="20 40" opacity=".55" transform="translate(-22 0)"/><path d="${d}" stroke="#8ab0c0" stroke-width="1.6" fill="none" stroke-dasharray="12 50" opacity=".45" transform="translate(18 0)"/><path d="${d}" stroke="#d8e8ee" stroke-width="2" fill="none" opacity=".35" transform="translate(-47 0)"/>`;
    for (let i = 0; i < 6; i++){ const y = 60 + r() * 440, x = zRiverX(y) + (r() * 2 - 1) * 30; s += `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="7" ry="3.4" fill="#5a5a50"/><path d="M${zr(x - 10)} ${zr(y + 2)}q10 4 20 0" stroke="#d8e8ee" stroke-width="1.2" fill="none" opacity=".6"/>`; } }
  if (c.lake){ s += `<ellipse cx="546" cy="256" rx="334" ry="146" fill="#000" opacity=".25" filter="url(#zb1)"/><ellipse cx="540" cy="250" rx="328" ry="142" fill="${K.c.b === "bog" ? "#3a3a28" : "#7a7058"}"/><ellipse cx="540" cy="250" rx="316" ry="132" fill="#16242a"/><ellipse cx="540" cy="250" rx="308" ry="126" fill="url(#${K.c.b === "bog" ? "zwd" : "zwt"})"/>`;
    for (let i = 0; i < 9; i++){ const x = 300 + r() * 480, y = 160 + r() * 180; s += `<path d="M${zr(x)} ${zr(y)}q${zr(20 + r() * 20)} -4 ${zr(44 + r() * 30)} 0" stroke="#8ab0c0" stroke-width="1.6" fill="none" opacity=".45"/>`; }
    s += `<ellipse cx="460" cy="190" rx="140" ry="16" fill="#d8e8ee" opacity=".08"/>`; }
  if (c.sea){ const sh = "M900 222 C770 290 700 410 560 548", sea = sh + " L900 548z";
    s += `<path d="${sh}" stroke="#c8b888" stroke-width="44" fill="none" opacity=".7"/><path d="${sea}" fill="url(#zwt)"/><path d="${sh}" stroke="#e8e2cc" stroke-width="5" fill="none" opacity=".7"/>`;
    for (let k = 1; k < 5; k++) s += `<path d="${sh}" stroke="#d8e8ee" stroke-width="${3 - k * .4}" fill="none" stroke-dasharray="${30 + k * 10} ${20 + k * 14}" opacity="${.5 - k * .08}" transform="translate(${k * 22} ${k * 12})"/>`;
    for (let i = 0; i < 30; i++){ const x = 640 + r() * 260, y = 260 + r() * 260; if (x + (y - 230) > 840) s += `<path d="M${zr(x)} ${zr(y)}q6 -4 12 0q6 4 12 0" stroke="#8ab0c0" stroke-width="1.3" fill="none" opacity=".5"/>`; } }
  return s;
}
function zPools(K, n, col = "#1f3236"){ const {r} = K; let s = "";
  for (let i = 0, t = 0; i < n && t < n * 6; t++){ const x = 60 + r() * 780, y = 120 + r() * 380, rx = 26 + r() * 46; if (!K.free(x, y, rx * .7, {})) continue; i++; K.claim(x, y, rx * .8);
    s += `<ellipse cx="${zr(x + 3)}" cy="${zr(y + 2)}" rx="${zr(rx + 7)}" ry="${zr(rx * .34 + 5)}" fill="#141a12" opacity=".7"/><ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(rx)}" ry="${zr(rx * .32)}" fill="url(#zwd)"/><path d="M${zr(x - rx * .6)} ${zr(y - rx * .1)}q${zr(rx * .4)} -3 ${zr(rx * .8)} 0" stroke="#7a9aa8" stroke-width="1.2" fill="none" opacity=".45"/>`;
    for (let k = 0; k < 3; k++) if (r() < .6) s += `<ellipse cx="${zr(x + (r() * 2 - 1) * rx * .6)}" cy="${zr(y + (r() * 2 - 1) * rx * .18)}" rx="4" ry="1.8" fill="#4a6a3a"/>`;
    for (let k = 0; k < 4; k++){ const a = r() * 6.28; K.put(y + Math.sin(a) * rx * .34 + 2, zReeds(x + Math.cos(a) * rx * .95, y + Math.sin(a) * rx * .34 + 2, .7 + r() * .4, r)); } }
  return s; }

/* ---------- рослинність ---------- */
const Z_PAL = {
  pine:["#1c2e1e", "#284028", "#3a5a34"], pineDk:["#16241a", "#203220", "#2e4628"], pineSn:["#24362e", "#30463a", "#44604e"],
  oak:["#2c4220", "#3e5c2c", "#5a7e3a"], oakDk:["#1e2c18", "#2a3c22", "#3a5030"], oakAu:["#5a4a1e", "#7a6428", "#a08436"], olive:["#3a4224", "#4e5a30", "#6a7840"],
};
function zPine(x, y, s, o = {}){
  const P = o.pal || (o.snow ? Z_PAL.pineSn : Z_PAL.pine), H = 70 * s, tiers = 5; let g = zSh(x + 16 * s, y + 3, 24 * s, 6 * s, .35);
  g += `<path d="M${zr(x - 2.6 * s)} ${zr(y)}l${zr(1 * s)} -${zr(14 * s)}h${zr(3.2 * s)}l${zr(1 * s)} ${zr(14 * s)}z" fill="#3a2a1a"/>`;
  for (let i = 0; i < tiers; i++){ const k = i / tiers, by = y - 8 * s - k * H * .8, ty = by - H * .34, w = (22 - i * 3.6) * s, j = w * .18;
    g += `<path d="M${zr(x)} ${zr(ty)}L${zr(x - w)} ${zr(by)}l${zr(w * .25)} -${zr(j)}l${zr(w * .25)} ${zr(j * .8)}l${zr(w * .25)} -${zr(j)}L${zr(x)} ${zr(by - j * .5)}z" fill="${P[1]}"/>`;
    g += `<path d="M${zr(x)} ${zr(ty)}L${zr(x + w)} ${zr(by)}l-${zr(w * .25)} -${zr(j)}l-${zr(w * .25)} ${zr(j * .8)}l-${zr(w * .25)} -${zr(j)}L${zr(x)} ${zr(by - j * .5)}z" fill="${P[0]}"/>`;
    g += `<path d="M${zr(x - 1)} ${zr(ty + 2)}L${zr(x - w * .62)} ${zr(by - j * 1.2)}" stroke="${P[2]}" stroke-width="${zr(2 * s)}" stroke-linecap="round" opacity=".8"/>`;
    if (o.snow) g += `<path d="M${zr(x)} ${zr(ty)}L${zr(x - w * .5)} ${zr(ty + (by - ty) * .55)}q${zr(w * .2)} 3 ${zr(w * .32)} -1L${zr(x)} ${zr(ty + (by - ty) * .4)}z" fill="#eef2f4"/>`; }
  return g;
}
function zOak(x, y, s, pal, o = {}){
  const P = pal || Z_PAL.oak, R = 15 * s; let g = zSh(x + 18 * s, y + 3, 30 * s, 7 * s, .35);
  g += `<path d="M${zr(x - 4 * s)} ${zr(y)}q${zr(1 * s)} -${zr(12 * s)} -${zr(1 * s)} -${zr(26 * s)}l${zr(3 * s)} 0l${zr(1 * s)} ${zr(8 * s)}l${zr(2 * s)} -${zr(9 * s)}h${zr(3 * s)}q-${zr(2 * s)} ${zr(14 * s)} ${zr(1.5 * s)} ${zr(27 * s)}z" fill="#3e2c1c"/><path d="M${zr(x + 1 * s)} ${zr(y)}q${zr(1 * s)} -${zr(12 * s)} ${zr(.5 * s)} -${zr(26 * s)}h${zr(2 * s)}q-${zr(1 * s)} ${zr(14 * s)} ${zr(1.5 * s)} ${zr(26 * s)}z" fill="#2a1c12"/>`;
  const B = [[0, -40, 1.25], [-14, -32, 1], [14, -33, 1.05], [-6, -50, .95], [9, -48, .9], [-18, -42, .7], [19, -42, .72]];
  for (const [ox, oy, k] of B) g += `<circle cx="${zr(x + ox * s)}" cy="${zr(y + oy * s)}" r="${zr(R * k)}" fill="${P[0]}"/>`;
  for (const [ox, oy, k] of B) g += `<circle cx="${zr(x + ox * s - R * k * .2)}" cy="${zr(y + oy * s - R * k * .22)}" r="${zr(R * k * .74)}" fill="${P[1]}"/>`;
  for (const [ox, oy, k] of B.slice(0, 5)) g += `<circle cx="${zr(x + ox * s - R * k * .38)}" cy="${zr(y + oy * s - R * k * .4)}" r="${zr(R * k * .36)}" fill="${P[2]}"/>`;
  if (o.fruit) for (let i = 0; i < 6; i++) g += `<circle cx="${zr(x + ((i * 37) % 30 - 15) * s)}" cy="${zr(y - (34 + (i * 13) % 18) * s)}" r="${zr(1.6 * s)}" fill="${o.fruit}"/>`;
  return g;
}
function zBirch(x, y, s){ let g = zSh(x + 12 * s, y + 2, 18 * s, 5 * s, .3) + `<path d="M${zr(x - 2 * s)} ${zr(y)}l${zr(1 * s)} -${zr(44 * s)}h${zr(2.4 * s)}l${zr(.8 * s)} ${zr(44 * s)}z" fill="#e8e4da"/>`; for (let i = 0; i < 6; i++) g += `<path d="M${zr(x - 1.6 * s)} ${zr(y - (6 + i * 7) * s)}h${zr(2 * s)}" stroke="#2a2420" stroke-width="${zr(1 * s)}"/>`;
  for (const [ox, oy, k] of [[0, -46, 1], [-8, -38, .8], [8, -38, .8], [-3, -54, .7]]) g += `<ellipse cx="${zr(x + ox * s)}" cy="${zr(y + oy * s)}" rx="${zr(9 * k * s)}" ry="${zr(11 * k * s)}" fill="#5a7a34"/><ellipse cx="${zr(x + ox * s - 2 * s)}" cy="${zr(y + oy * s - 3 * s)}" rx="${zr(5 * k * s)}" ry="${zr(6 * k * s)}" fill="#7a9a44"/>`; return g; }
function zDead(x, y, s, col = "#2a241e"){
  let g = zSh(x + 12 * s, y + 2, 16 * s, 4 * s, .3), d = "";
  const br = (bx, by, a, L, w, n) => { const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L; d += `<path d="M${zr(bx)} ${zr(by)}L${zr(ex)} ${zr(ey)}" stroke="${col}" stroke-width="${zr(w)}" stroke-linecap="round"/>`; if (n > 0){ br(ex, ey, a - .5, L * .62, w * .62, n - 1); br(ex, ey, a + .45, L * .58, w * .6, n - 1); } };
  g += `<path d="M${zr(x - 3.4 * s)} ${zr(y)}q${zr(1 * s)} -${zr(18 * s)} ${zr(2 * s)} -${zr(34 * s)}h${zr(2.4 * s)}q${zr(1 * s)} ${zr(16 * s)} ${zr(3.6 * s)} ${zr(34 * s)}z" fill="${col}"/>`;
  br(x + .6 * s, y - 32 * s, -1.75, 14 * s, 2.6 * s, 2); br(x, y - 22 * s, -2.5, 12 * s, 2.2 * s, 1); br(x + 1 * s, y - 18 * s, -.6, 11 * s, 2 * s, 1);
  return g + d;
}
function zWillow(x, y, s, c = "#56723a"){
  let g = zSh(x + 20 * s, y + 3, 32 * s, 7 * s, .32) + `<path d="M${zr(x - 4 * s)} ${zr(y)}q${zr(2 * s)} -${zr(20 * s)} -${zr(2 * s)} -${zr(38 * s)}h${zr(8 * s)}q-${zr(3 * s)} ${zr(18 * s)} ${zr(2 * s)} ${zr(38 * s)}z" fill="#3a2a1a"/>`;
  g += `<ellipse cx="${zr(x)}" cy="${zr(y - 44 * s)}" rx="${zr(28 * s)}" ry="${zr(14 * s)}" fill="${shade(c, .7)}"/>`;
  let d = "", d2 = ""; for (let i = 0; i < 22; i++){ const t = i / 21 - .5, ox = x + t * 56 * s, oy = y - 46 * s + Math.abs(t) * 18 * s, L = (30 + ((i * 7) % 5) * 3) * s - Math.abs(t) * 18 * s, q = `M${zr(ox)} ${zr(oy)}q${zr(t * 8 * s)} ${zr(L * .5)} ${zr(t * 12 * s)} ${zr(L)}`; (t < .1 ? (d += q) : (d2 += q)); }
  return g + `<path d="${d2}" stroke="${shade(c, .72)}" stroke-width="${zr(3.4 * s)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${shade(c, 1.12)}" stroke-width="${zr(3.4 * s)}" fill="none" stroke-linecap="round"/><ellipse cx="${zr(x - 8 * s)}" cy="${zr(y - 48 * s)}" rx="${zr(16 * s)}" ry="${zr(7 * s)}" fill="${shade(c, 1.22)}"/>`;
}
function zBush(x, y, s, pal, o = {}){
  const P = pal || ["#2a3e1c", "#3e5a28", "#5a7a36"]; let g = zSh(x + 7 * s, y + 2, 15 * s, 4 * s, .28);
  for (const [ox, oy, k] of [[-7, -6, .8], [7, -6, .85], [0, -10, 1]]) g += `<circle cx="${zr(x + ox * s)}" cy="${zr(y + oy * s)}" r="${zr(8 * k * s)}" fill="${P[0]}"/>`;
  for (const [ox, oy, k] of [[-8, -8, .55], [5, -8, .6], [-2, -13, .7]]) g += `<circle cx="${zr(x + ox * s)}" cy="${zr(y + oy * s)}" r="${zr(8 * k * s)}" fill="${P[1]}"/>`;
  g += `<circle cx="${zr(x - 4 * s)}" cy="${zr(y - 15 * s)}" r="${zr(3 * s)}" fill="${P[2]}"/>`;
  if (o.berry) for (let i = 0; i < 5; i++) g += `<circle cx="${zr(x + ((i * 7) % 14 - 7) * s)}" cy="${zr(y - (6 + (i * 5) % 9) * s)}" r="${zr(1.3 * s)}" fill="${o.berry}"/>`;
  return g;
}
function zReeds(x, y, s, r){ let d = "", t = ""; for (let i = 0; i < 6; i++){ const ox = x + (r() * 2 - 1) * 7 * s, h = (14 + r() * 12) * s, l = (r() * 2 - 1) * 3 * s; d += `M${zr(ox)} ${zr(y)}q${zr(l)} -${zr(h * .5)} ${zr(l * 1.6)} -${zr(h)}`; if (r() < .45) t += `<ellipse cx="${zr(ox + l * 1.5)}" cy="${zr(y - h + 2)}" rx="${zr(1.6 * s)}" ry="${zr(4 * s)}" fill="#5a3a20"/>`; } return `<path d="${d}" stroke="#6a7a40" stroke-width="${zr(1.6 * s)}" fill="none" stroke-linecap="round"/>` + t; }
function zRock(x, y, s, col = "#77726a", o = {}){
  const w = 18 * s, h = 13 * s; let g = zSh(x + 8 * s, y + 2, w * 1.1, 4 * s, .3);
  g += `<path d="M${zr(x - w)} ${zr(y)}l${zr(w * .2)} -${zr(h * .7)}l${zr(w * .5)} -${zr(h * .3)}l${zr(w * .6)} ${zr(h * .1)}l${zr(w * .5)} ${zr(h * .5)}l${zr(w * .2)} ${zr(h * .4)}z" fill="${col}"/>`;
  g += `<path d="M${zr(x - w * .8)} ${zr(y - h * .7)}l${zr(w * .5)} -${zr(h * .3)}l${zr(w * .6)} ${zr(h * .1)}l-${zr(w * .2)} ${zr(h * .45)}z" fill="${shade(col, 1.25)}"/><path d="M${zr(x + w * .3)} ${zr(y - h * .9)}l${zr(w * .5)} ${zr(h * .5)}l${zr(w * .2)} ${zr(h * .4)}h-${zr(w * .8)}z" fill="${shade(col, .7)}"/>`;
  if (o.moss) g += `<path d="M${zr(x - w * .7)} ${zr(y - h * .72)}l${zr(w * .45)} -${zr(h * .26)}l${zr(w * .3)} ${zr(h * .05)}" stroke="#5a7a3a" stroke-width="${zr(3 * s)}" stroke-linecap="round" fill="none"/>`;
  if (o.snow) g += `<path d="M${zr(x - w * .8)} ${zr(y - h * .7)}l${zr(w * .5)} -${zr(h * .3)}l${zr(w * .6)} ${zr(h * .1)}l-${zr(w * .3)} ${zr(h * .2)}q-${zr(w * .4)} -${zr(h * .1)} -${zr(w * .8)} 0z" fill="#f2f4f6"/>`;
  return g;
}
// лінія дерев на дальньому плані (зверху), трохи вицвіла
function zTreeline(K, kind, y0 = 40, y1 = 112){
  const {r} = K; let s = ""; const T = [];
  for (let x = -20; x < 930; x += 22 + r() * 18){ const y = y0 + r() * (y1 - y0); if (K.exits.some(([ex, ey]) => Math.abs(ex - x) < 60 && ey < 130)) continue; T.push([x, y]); }
  T.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of T){ const s0 = .7 + r() * .35; s += kind === "pine" ? zPine(x, y, s0, {pal:Z_PAL.pineDk, snow:K.c.b === "snow"}) : kind === "dead" ? zDead(x, y, s0 * 1.1, "#24201c") : kind === "mix" ? (r() < .5 ? zPine(x, y, s0, {pal:Z_PAL.pineDk}) : zOak(x, y, s0 * .9, Z_PAL.oakDk)) : zOak(x, y, s0 * .9, Z_PAL.oakDk); }
  return `<g>${s}</g><rect x="0" y="0" width="${ZW}" height="${y1 + 10}" fill="url(#zhz)"/>`;
}

/* ---------- будівлі ---------- */
let Z_GID = 0;
function zLerp(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function zPoly(P){ return P.map(p => zr(p[0]) + "," + zr(p[1])).join(" "); }
function zWindow(K, x, y, w, h, lit, o = {}){
  const fr = o.frame || "#d8ccb0"; let s = "";
  if (o.shut) s += `<rect x="${zr(x - w * .5 - 1)}" y="${zr(y)}" width="${zr(w * .5)}" height="${zr(h)}" fill="${o.shut}"/><rect x="${zr(x + w + 1)}" y="${zr(y)}" width="${zr(w * .5)}" height="${zr(h)}" fill="${shade(o.shut, .8)}"/>`;
  s += `<rect x="${zr(x - 1.4)}" y="${zr(y - 1.4)}" width="${zr(w + 2.8)}" height="${zr(h + 2.8)}" fill="${fr}"/>`;
  s += o.arch ? `<path d="M${zr(x)} ${zr(y + h)}v-${zr(h - w / 2)}a${zr(w / 2)} ${zr(w / 2)} 0 0 1 ${zr(w)} 0v${zr(h - w / 2)}z" fill="${lit ? "#ffd27a" : "#221c16"}"/>` : `<rect x="${zr(x)}" y="${zr(y)}" width="${zr(w)}" height="${zr(h)}" fill="${lit ? "#ffd27a" : "#221c16"}"/>`;
  if (lit) s += `<rect x="${zr(x)}" y="${zr(y + h * .55)}" width="${zr(w)}" height="${zr(h * .45)}" fill="#ffb84a" opacity=".6"/>`;
  s += `<path d="M${zr(x + w / 2)} ${zr(y)}v${zr(h)}M${zr(x)} ${zr(y + h * .45)}h${zr(w)}" stroke="${fr}" stroke-width="1.2"/><rect x="${zr(x - 2)}" y="${zr(y + h + 1)}" width="${zr(w + 4)}" height="2.2" fill="${shade(fr, .8)}"/>`;
  if (lit && K) K.light(x + w / 2, y + h / 2, 20 + w, "#ffc860", .55);
  return s;
}
function zDoor(x, y, w, h, o = {}){
  const c = o.col || "#5a3a22"; return `<rect x="${zr(x - w / 2 - 2.4)}" y="${zr(y - h - 2.4)}" width="${zr(w + 4.8)}" height="${zr(h + 2.4)}" rx="${zr(w / 2)}" fill="${o.frame || "#7a6a52"}"/><path d="M${zr(x - w / 2)} ${zr(y)}v-${zr(h - w / 2)}a${zr(w / 2)} ${zr(w / 2)} 0 0 1 ${zr(w)} 0v${zr(h - w / 2)}z" fill="${c}"/><path d="M${zr(x - w / 6)} ${zr(y)}v-${zr(h - 2)}M${zr(x + w / 6)} ${zr(y)}v-${zr(h - 2)}" stroke="${shade(c, .7)}" stroke-width="1"/><circle cx="${zr(x + w * .28)}" cy="${zr(y - h * .45)}" r="1.2" fill="#c8a860"/><rect x="${zr(x - w / 2 - 4)}" y="${zr(y)}" width="${zr(w + 8)}" height="3.4" fill="#7a7466"/>`; }
function zHouse(K, x, y, w, h, d, o = {}){
  const wall = o.wall || "#d8caa8", roof = o.roof || "#8a3a24", D = [d * .62, -d * .5], x0 = x - w / 2, x1 = x + w / 2, top = y - h, ov = 6, lit = o.lit ?? true;
  let s = zCast(x0, x1, y, h + w * .3, d, .34);
  // бічна стіна
  s += `<polygon points="${zPoly([[x1, y], [x1 + D[0], y + D[1]], [x1 + D[0], top + D[1]], [x1, top]])}" fill="${shade(wall, .6)}"/>`;
  if (d > 30 && !o.noSideWin){ const a = zLerp([x1, top + h * .32], [x1 + D[0], top + D[1] + h * .32], .38), b = zLerp([x1, top + h * .32], [x1 + D[0], top + D[1] + h * .32], .58); s += `<polygon points="${zPoly([a, b, [b[0], b[1] + h * .22], [a[0], a[1] + h * .22]])}" fill="${lit && K.r() < .5 ? "#b89048" : "#1a1612"}"/>`; }
  if (o.gable === "front"){
    const gh = o.rh || w * .48, ap = [x, top - gh];
    s += `<polygon points="${zPoly([[x0, y], [x1, y], [x1, top], ap, [x0, top]])}" fill="${wall}"/>`;
    s += `<polygon points="${zPoly([[x1 + D[0], top + D[1]], [x1, top], ap, [ap[0] + D[0], ap[1] + D[1]]])}" fill="${shade(wall, .5)}"/>`;
    const RS = [ap, [x1 + ov * .6, top + ov * .45], [x1 + ov * .6 + D[0], top + ov * .45 + D[1]], [ap[0] + D[0], ap[1] + D[1]]];
    s += `<polygon points="${zPoly(RS)}" fill="${shade(roof, .72)}"/>`;
    let sh = ""; for (let k = 1; k < 6; k++){ const a = zLerp(RS[0], RS[1], k / 6), b = zLerp(RS[3], RS[2], k / 6); sh += `M${zr(a[0])} ${zr(a[1])}L${zr(b[0])} ${zr(b[1])}`; } s += `<path d="${sh}" stroke="${shade(roof, .5)}" stroke-width="1.1" opacity=".55"/>`;
    s += `<path d="M${zr(x0 - ov)} ${zr(top + ov * .45)}L${zr(ap[0])} ${zr(ap[1] - 2)}" stroke="${shade(roof, 1.15)}" stroke-width="5" stroke-linecap="round"/><path d="M${zr(ap[0])} ${zr(ap[1] - 2)}L${zr(ap[0] + D[0])} ${zr(ap[1] + D[1] - 2)}" stroke="${shade(roof, 1.25)}" stroke-width="2.4"/>`;
    if (o.timber) s += `<path d="M${zr(x0 + 2)} ${zr(top)}L${zr(ap[0])} ${zr(ap[1] + 4)}L${zr(x1 - 2)} ${zr(top)}M${zr(x)} ${zr(ap[1] + 4)}V${zr(top)}" stroke="${o.timber}" stroke-width="3" fill="none"/>`;
    s += zWindow(K, x - 4, top - gh * .5, 8, 9, lit && K.r() < .5, {frame:o.frame});
  } else {
    const rh = o.rh || w * .3 + d * .2, RL = [x0 + D[0] / 2, top + D[1] / 2 - rh], RR = [x1 + D[0] / 2, top + D[1] / 2 - rh];
    s += `<polygon points="${zPoly([[x1, top], [x1 + D[0], top + D[1]], RR])}" fill="${shade(wall, .5)}"/>`;
    s += `<polygon points="${zPoly([[x0, y], [x1, y], [x1, top], [x0, top]])}" fill="${wall}"/>`;
    const FS = [[x0 - ov, top + 3], [x1 + ov * .7, top + 3], [RR[0] + ov * .7, RR[1]], [RL[0] - ov, RL[1]]];
    s += `<polygon points="${zPoly([[RL[0] - ov, RL[1]], [RR[0] + ov * .7, RR[1]], [x1 + D[0] + ov * .7, top + D[1] + 3], [x1 + ov * .7, top + 3]])}" fill="${shade(roof, .55)}"/>`;
    s += `<polygon points="${zPoly(FS)}" fill="${roof}"/>`;
    let sh = ""; for (let k = 1; k < 6; k++){ const a = zLerp(FS[0], FS[3], k / 6), b = zLerp(FS[1], FS[2], k / 6); sh += `M${zr(a[0])} ${zr(a[1])}L${zr(b[0])} ${zr(b[1])}`; }
    let tk = ""; for (let k = 0; k < 6; k++) for (let j = 1; j < w / 9; j++){ const t = k / 6 + .08, a = zLerp(FS[0], FS[3], t), b = zLerp(FS[1], FS[2], t), p = zLerp(a, b, (j + (k % 2) * .5) / (w / 9)); tk += `M${zr(p[0])} ${zr(p[1])}l${zr((RL[0] - x0) / 6 * .9)} ${zr((RL[1] - top) / 6 * .9)}`; }
    s += `<path d="${sh}" stroke="${shade(roof, .62)}" stroke-width="1.3" opacity=".7"/><path d="${tk}" stroke="${shade(roof, .62)}" stroke-width=".8" opacity=".5"/>`;
    s += `<path d="M${zr(RL[0] - ov)} ${zr(RL[1])}L${zr(RR[0] + ov * .7)} ${zr(RR[1])}" stroke="${shade(roof, 1.3)}" stroke-width="2.4"/><path d="M${zr(x0 - ov)} ${zr(top + 3)}L${zr(x1 + ov * .7)} ${zr(top + 3)}" stroke="${shade(roof, .55)}" stroke-width="2"/>`;
    if (o.chimney){ const cx = x0 + w * .72 + D[0] * .3, cy = top + D[1] * .3 - rh * .55; s += `<rect x="${zr(cx)}" y="${zr(cy - 18)}" width="9" height="${zr(rh * .5 + 18)}" fill="${shade(o.cwall || "#8a7e6e", 1)}"/><rect x="${zr(cx + 5)}" y="${zr(cy - 18)}" width="4" height="${zr(rh * .5 + 18)}" fill="${shade(o.cwall || "#8a7e6e", .65)}"/><rect x="${zr(cx - 1.5)}" y="${zr(cy - 21)}" width="12" height="4" fill="${shade(o.cwall || "#8a7e6e", .8)}"/>`; K.over += zSmoke(cx + 5, cy - 28, 1.1); }
  }
  // фасад: фахверк, цоколь, вікна, двері
  if (o.timber && o.gable !== "front") s += `<path d="M${zr(x0 + 2)} ${zr(top + 2)}H${zr(x1 - 2)}M${zr(x0 + 2)} ${zr(y - h * .5)}H${zr(x1 - 2)}M${zr(x0 + 2)} ${zr(top)}V${zr(y)}M${zr(x1 - 2)} ${zr(top)}V${zr(y)}" stroke="${o.timber}" stroke-width="3.4"/>`;
  else if (o.timber) s += `<path d="M${zr(x0 + 2)} ${zr(top)}V${zr(y)}M${zr(x1 - 2)} ${zr(top)}V${zr(y)}M${zr(x0)} ${zr(y - h * .5)}H${zr(x1)}" stroke="${o.timber}" stroke-width="3.4"/>`;
  s += `<rect x="${zr(x0)}" y="${zr(y - 7)}" width="${zr(w)}" height="7" fill="${o.base || "#7a7466"}"/><path d="M${zr(x0 + 4)} ${zr(y - 3.5)}h6M${zr(x0 + 18)} ${zr(y - 3.5)}h7M${zr(x0 + 34)} ${zr(y - 3.5)}h6" stroke="#4a463e" stroke-width="1" opacity=".6"/>`;
  s += `<polygon points="${zPoly([[x1, y], [x1 + D[0], y + D[1]], [x1 + D[0], y + D[1] - 7], [x1, y - 7]])}" fill="${shade(o.base || "#7a7466", .65)}"/>`;
  const rows = o.storeys || (h > 52 ? 2 : 1), dx = o.doorX ?? 0, ww = 11, wh = 13;
  for (let rI = 0; rI < rows; rI++){ const wy = rows === 1 ? top + h * .3 : top + h * (rI ? .56 : .16), n = Math.max(1, Math.floor(w / 34));
    for (let i = 0; i < n + (rI && rows > 1 ? 1 : 0); i++){ const cnt = n + (rI && rows > 1 ? 1 : 0), wx = x0 + (w / (cnt + 1)) * (i + 1) - ww / 2; if (rI === rows - 1 && Math.abs(wx + ww / 2 - (x + dx)) < 16) continue; s += zWindow(K, wx, wy, ww, wh, lit && K.r() < .65, {shut:o.shut, frame:o.frame, arch:o.archWin}); } }
  if (!o.nodoor) s += zDoor(x + dx, y - 1, 13, Math.min(24, h * .5), {col:o.doorCol});
  if (o.sign){ const sx = x0 - 2, sy = top + h * .25; s += `<path d="M${zr(sx)} ${zr(sy)}h-14" stroke="#2a2018" stroke-width="2"/><path d="M${zr(sx - 13)} ${zr(sy)}v3M${zr(sx - 3)} ${zr(sy)}v3" stroke="#2a2018" stroke-width="1"/><rect x="${zr(sx - 16)}" y="${zr(sy + 3)}" width="15" height="12" fill="${o.sign}" stroke="#2a2018" stroke-width="1"/><circle cx="${zr(sx - 8.5)}" cy="${zr(sy + 9)}" r="3" fill="${o.signIc || "#e8d8a8"}"/>`; }
  if (o.flowers) s += `<rect x="${zr(x0 + 6)}" y="${zr(top + h * .3 + 15)}" width="14" height="3" fill="#6a4a2a"/>` + [0, 1, 2, 3].map(i => `<circle cx="${zr(x0 + 8 + i * 3.4)}" cy="${zr(top + h * .3 + 14)}" r="1.8" fill="${["#d84a4a", "#f2e070", "#d87ab0", "#f2f2f2"][i]}"/>`).join("");
  return s;
}
function zTower(K, x, y, r, h, o = {}){
  const wall = o.wall || "#a49a86", roof = o.roof || "#4a3a5a", top = y - h, id = "zt" + (++Z_GID);
  let s = zSh(x + r * 1.2 + h * .15, y + 3, r * 1.4 + h * .22, r * .5, .34);
  s += `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(wall, 1.2)}"/><stop offset=".4" stop-color="${wall}"/><stop offset="1" stop-color="${shade(wall, .5)}"/></linearGradient></defs>`;
  s += `<path d="M${zr(x - r)} ${zr(top)}V${zr(y)}A${zr(r)} ${zr(r * .34)} 0 0 0 ${zr(x + r)} ${zr(y)}V${zr(top)}z" fill="url(#${id})"/>`;
  let cr = ""; for (let yy = top + 10; yy < y; yy += 10) cr += `M${zr(x - r)} ${zr(yy)}A${zr(r)} ${zr(r * .34)} 0 0 0 ${zr(x + r)} ${zr(yy)}`; s += `<path d="${cr}" stroke="${shade(wall, .7)}" stroke-width=".9" fill="none" opacity=".5"/>`;
  for (let k = 0; k < Math.floor(h / 34); k++){ const wy = top + 14 + k * 34, lit = o.win && (k === 0 || K.r() < .4); s += `<path d="M${zr(x - 3.6)} ${zr(wy + 14)}v-10a3.6 3.6 0 0 1 7.2 0v10z" fill="${lit ? o.win : "#1d1812"}"/>`; if (lit) K.light(x, wy + 8, 22, o.win, .55); }
  if (o.door) s += zDoor(x, y + r * .3, 12, 20);
  if (o.flat){ s += `<ellipse cx="${zr(x)}" cy="${zr(top)}" rx="${zr(r + 2)}" ry="${zr((r + 2) * .34)}" fill="${shade(wall, .75)}"/><ellipse cx="${zr(x)}" cy="${zr(top)}" rx="${zr(r - 3)}" ry="${zr((r - 3) * .34)}" fill="${shade(wall, .45)}"/>`;
    for (let i = -2; i <= 2; i++){ const mx = x + i * r * .42; s += `<rect x="${zr(mx - r * .14)}" y="${zr(top - 7 + Math.abs(i) * r * .06)}" width="${zr(r * .28)}" height="8" fill="${i > 0 ? shade(wall, .62) : shade(wall, 1.1)}"/>`; } }
  else { const rh = o.rh || r * 2.4, ovr = r * 1.18; s += `<path d="M${zr(x - ovr)} ${zr(top + 2)}L${zr(x)} ${zr(top - rh)}L${zr(x)} ${zr(top + ovr * .4)}z" fill="${shade(roof, 1.12)}"/><path d="M${zr(x + ovr)} ${zr(top + 2)}L${zr(x)} ${zr(top - rh)}L${zr(x)} ${zr(top + ovr * .4)}z" fill="${shade(roof, .58)}"/>`;
    let ra = ""; for (let k = 1; k < 5; k++){ const t = k / 5, yy = top + 2 - (rh + 2) * (1 - t) * 0, ry = top - rh + (rh + 2) * t, rx = ovr * t; ra += `M${zr(x - rx)} ${zr(ry)}A${zr(rx)} ${zr(rx * .34)} 0 0 0 ${zr(x + rx)} ${zr(ry)}`; } s += `<path d="${ra}" stroke="${shade(roof, .45)}" stroke-width=".9" fill="none" opacity=".5"/>`;
    s += `<path d="M${zr(x)} ${zr(top - rh)}v-8" stroke="#2a2218" stroke-width="1.4"/>` + (o.flag ? `<path d="M${zr(x)} ${zr(top - rh - 8)}h16l-4 4 4 4h-16z" fill="${o.flag}"/>` : `<circle cx="${zr(x)}" cy="${zr(top - rh - 9)}" r="2.2" fill="#c9a24a"/>`); }
  return s;
}
function zKeep(K, x, y, w, h, d, o = {}){
  const wall = o.wall || "#8a8274", D = [d * .62, -d * .5], x0 = x - w / 2, x1 = x + w / 2, top = y - h;
  let s = zCast(x0, x1, y, h, d, .36);
  s += `<polygon points="${zPoly([[x1, y], [x1 + D[0], y + D[1]], [x1 + D[0], top + D[1]], [x1, top]])}" fill="${shade(wall, .58)}"/>`;
  s += `<rect x="${zr(x0)}" y="${zr(top)}" width="${zr(w)}" height="${zr(h)}" fill="${wall}"/>`;
  let st = ""; for (let yy = top + 8; yy < y; yy += 9) for (let xx = x0 + ((yy / 9) % 2 ? 4 : 10); xx < x1 - 4; xx += 14) st += `M${zr(xx)} ${zr(yy)}h8`; s += `<path d="${st}" stroke="${shade(wall, .75)}" stroke-width="1" opacity=".5"/>`;
  s += `<polygon points="${zPoly([[x0, top], [x1, top], [x1 + D[0], top + D[1]], [x0 + D[0], top + D[1]]])}" fill="${shade(wall, .78)}"/>`;
  if (o.roof){ const ap = [x + D[0] / 2, top + D[1] / 2 - (o.rh || w * .7)]; s += `<polygon points="${zPoly([[x0 - 3, top + 1], [x1 + 3, top + 1], ap])}" fill="${o.roof}"/><polygon points="${zPoly([[x1 + 3, top + 1], [x1 + D[0] + 3, top + D[1]], ap])}" fill="${shade(o.roof, .6)}"/>`; }
  else { for (let i = 0; i < Math.round(w / 10); i++) if (i % 2 === 0) s += `<rect x="${zr(x0 + i * w / Math.round(w / 10))}" y="${zr(top - 7)}" width="${zr(w / Math.round(w / 10))}" height="7" fill="${shade(wall, 1.08)}"/>`;
    for (let i = 1; i < 4; i += 2){ const p = zLerp([x1, top], [x1 + D[0], top + D[1]], i / 4); s += `<polygon points="${zPoly([[p[0] - D[0] / 8, p[1] - D[1] / 8], [p[0] + D[0] / 8, p[1] + D[1] / 8], [p[0] + D[0] / 8, p[1] + D[1] / 8 - 7], [p[0] - D[0] / 8, p[1] - D[1] / 8 - 7]])}" fill="${shade(wall, .62)}"/>`; } }
  for (let k = 0; k < Math.floor(h / 30); k++){ const wy = top + 12 + k * 30, lit = o.win && k < 2; for (const wx of w > 50 ? [x - w * .25, x + w * .25] : [x]){ s += `<path d="M${zr(wx - 2.6)} ${zr(wy + 13)}v-10a2.6 2.6 0 0 1 5.2 0v10z" fill="${lit ? o.win : "#16120e"}"/>`; if (lit) K.light(wx, wy + 8, 18, o.win, .6); } }
  if (o.gate) s += `<path d="M${zr(x - 13)} ${zr(y)}v-24a13 13 0 0 1 26 0v24z" fill="#120e0a"/><path d="M${zr(x - 9)} ${zr(y)}v-24M${zr(x - 3)} ${zr(y)}v-30M${zr(x + 3)} ${zr(y)}v-30M${zr(x + 9)} ${zr(y)}v-24M${zr(x - 12)} ${zr(y - 12)}h24M${zr(x - 12)} ${zr(y - 22)}h24" stroke="#3a3430" stroke-width="1.6"/>`;
  if (o.flag) s += `<path d="M${zr(x + D[0] / 2)} ${zr(top + D[1] / 2 - 6)}v-30" stroke="#2a2218" stroke-width="1.6"/><path d="M${zr(x + D[0] / 2)} ${zr(top + D[1] / 2 - 36)}h20l-5 5 5 5h-20z" fill="${o.flag}"/>`;
  return s;
}
// пряма стіна з бійницями між двома точками основи
function zWall(K, x0, y0, x1, y1, h, o = {}){
  const wall = o.wall || "#8a8274", L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / 14)), D = [7, -6];
  const tp = []; for (let i = 0; i <= n; i++){ const t = i / n, hh = o.ruin ? h * (.4 + Math.abs(Math.sin(i * 1.9 + (o.seed || 0))) * .65) : h; tp.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - hh]); }
  let s = `<path d="M${zr(x0)} ${zr(y0)}L${zr(x1)} ${zr(y1)}L${zr(x1 + h * .4)} ${zr(y1 + h * .14)}L${zr(x0 + h * .4)} ${zr(y0 + h * .14)}z" fill="#08070a" opacity=".3" filter="url(#zb1)"/>`;
  if (!o.ruin) s += `<polygon points="${zPoly([...tp, [tp[n][0] + D[0], tp[n][1] + D[1]], [tp[0][0] + D[0], tp[0][1] + D[1]]].map((p, i) => i <= n ? p : p))}" fill="${shade(wall, .78)}"/>`;
  s += `<path d="M${zr(x0)} ${zr(y0)}L${zr(x1)} ${zr(y1)}${tp.slice().reverse().map(p => `L${zr(p[0])} ${zr(p[1])}`).join("")}z" fill="${wall}"/>`;
  let st = ""; for (let k = 1; k < h / 9; k++) for (let i = 0; i < n; i++){ const t = (i + (k % 2) * .5) / n, p = [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - k * 9]; if (p[1] > tp[Math.min(n, Math.round(t * n))][1] + 3) st += `M${zr(p[0])} ${zr(p[1])}h${zr(L / n * .6)}`; } s += `<path d="${st}" stroke="${shade(wall, .72)}" stroke-width="1" opacity=".5"/>`;
  if (!o.ruin){ let m = ""; for (let i = 0; i < n; i++) if (i % 2 === 0){ const a = tp[i], b = tp[i + 1]; m += `M${zr(a[0])} ${zr(a[1])}L${zr(b[0])} ${zr(b[1])}v-8L${zr(a[0])} ${zr(a[1] - 8)}z`; } s += `<path d="${m}" fill="${shade(wall, 1.08)}"/>`; }
  s += `<path d="${tp.map((p, i) => (i ? "L" : "M") + zr(p[0]) + " " + zr(p[1])).join("")}" stroke="${shade(wall, 1.25)}" stroke-width="1.4" fill="none"/>`;
  if (o.gate != null){ const t = o.gate, gx = x0 + (x1 - x0) * t, gy = y0 + (y1 - y0) * t, gw = o.gw || 30; s += `<path d="M${zr(gx - gw / 2)} ${zr(gy)}v-${zr(gw * .8)}a${zr(gw / 2)} ${zr(gw / 2)} 0 0 1 ${zr(gw)} 0v${zr(gw * .8)}z" fill="#141010"/><path d="M${zr(gx - gw / 2 - 3)} ${zr(gy)}v-${zr(gw * .8)}a${zr(gw / 2 + 3)} ${zr(gw / 2 + 3)} 0 0 1 ${zr(gw + 6)} 0v${zr(gw * .8)}" stroke="${shade(wall, 1.2)}" stroke-width="3" fill="none"/>`; if (o.portcullis) s += `<path d="${[...Array(5)].map((_, i) => `M${zr(gx - gw / 2 + 4 + i * (gw - 8) / 4)} ${zr(gy - gw * .3)}v-${zr(gw * .7)}`).join("")}M${zr(gx - gw / 2)} ${zr(gy - gw * .6)}h${zr(gw)}" stroke="#3a3430" stroke-width="2"/>`; }
  if (o.bones){ let b = ""; for (let i = 0; i < n * 2; i++){ const t = (i + .5) / (n * 2), px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t - h * (.25 + (i % 3) * .2); b += `M${zr(px - 3)} ${zr(py)}h6`; } s += `<path d="${b}" stroke="#efe6cc" stroke-width="2" stroke-linecap="round" opacity=".85"/>`; }
  return s;
}
function zGothic(K, x, y, w, h, d, o = {}){
  const c = o.wall || "#b8ad94", D = [d * .62, -d * .48], x0 = x - w / 2, x1 = x + w / 2, top = y - h, gh = o.gh || w * .5, ruin = o.ruin, litC = o.lit;
  let s = zCast(x0, x1, y, h + gh * .5, d, .34);
  // нава вглиб
  const sideTop = ruin ? [[x1 + D[0] * .3, top + D[1] * .3 + h * .3], [x1 + D[0] * .55, top + D[1] * .55 + h * .05], [x1 + D[0] * .8, top + D[1] * .8 + h * .4], [x1 + D[0], top + D[1] + h * .2]] : [[x1 + D[0], top + D[1]]];
  s += `<polygon points="${zPoly([[x1, y], [x1 + D[0], y + D[1]], ...sideTop.slice().reverse(), [x1, top]])}" fill="${shade(c, .58)}"/>`;
  for (let i = 1; i <= 4; i++){ const p = zLerp([x1, y], [x1 + D[0], y + D[1]], i / 5); s += `<path d="M${zr(p[0] - 3)} ${zr(p[1] - h * .2)}v-${zr(h * .38)}l3 -${zr(h * .12)}l3 ${zr(h * .12)}v${zr(h * .38)}z" fill="${litC || "#16120e"}" opacity="${litC ? .85 : 1}"/><path d="M${zr(p[0] + 5)} ${zr(p[1])}v-${zr(h * .8)}" stroke="${shade(c, .42)}" stroke-width="3"/>`; if (litC && !ruin) K.light(p[0], p[1] - h * .4, 16, litC, .4); }
  if (!ruin && o.roof) s += `<polygon points="${zPoly([[x, top - gh], [x + D[0], top - gh + D[1]], [x1 + D[0] + 4, top + D[1] + 2], [x1 + 4, top + 2]])}" fill="${shade(o.roof, .7)}"/>`;
  // фасад
  const F = ruin ? [[x0, y], [x1, y], [x1, top + h * .12], [x + w * .3, top - gh * .25], [x + w * .12, top - gh * .05], [x, top - gh * .62], [x - w * .16, top - gh * .3], [x0, top + h * .06]] : [[x0, y], [x1, y], [x1, top], [x, top - gh], [x0, top]];
  s += `<polygon points="${zPoly(F)}" fill="${c}"/>`;
  s += `<path d="M${zr(x0 + 3)} ${zr(y)}V${zr(top + 4)}M${zr(x1 - 3)} ${zr(y)}V${zr(top + 4)}" stroke="${shade(c, .72)}" stroke-width="5"/>`;
  const pw = w * .2; s += `<path d="M${zr(x - pw - 4)} ${zr(y)}v-${zr(h * .36)}q${zr(pw + 4)} -${zr(h * .3)} ${zr(pw * 2 + 8)} 0v${zr(h * .36)}z" fill="${shade(c, .8)}"/><path d="M${zr(x - pw)} ${zr(y)}v-${zr(h * .34)}q${zr(pw)} -${zr(h * .26)} ${zr(pw * 2)} 0v${zr(h * .34)}z" fill="#141010"/>`;
  const rr = Math.min(w * .14, h * .15), ry = top + h * .2; s += `<circle cx="${zr(x)}" cy="${zr(ry)}" r="${zr(rr + 3)}" fill="${shade(c, .8)}"/><circle cx="${zr(x)}" cy="${zr(ry)}" r="${zr(rr)}" fill="${litC || "#16120e"}"/><path d="M${zr(x - rr)} ${zr(ry)}h${zr(rr * 2)}M${zr(x)} ${zr(ry - rr)}v${zr(rr * 2)}M${zr(x - rr * .7)} ${zr(ry - rr * .7)}l${zr(rr * 1.4)} ${zr(rr * 1.4)}M${zr(x + rr * .7)} ${zr(ry - rr * .7)}l-${zr(rr * 1.4)} ${zr(rr * 1.4)}" stroke="${c}" stroke-width="1.3"/>`;
  if (litC) K.light(x, ry, rr * 3 + 10, litC, .7);
  for (const k of [-.33, .33]) s += `<path d="M${zr(x + k * w - 3.6)} ${zr(y - h * .42)}v-${zr(h * .26)}l3.6 -${zr(h * .1)}l3.6 ${zr(h * .1)}v${zr(h * .26)}z" fill="${litC || "#16120e"}"/>`;
  if (ruin) for (let i = 0; i < 7; i++) s += zRock(x0 + i * w / 6 + 4, y + 6 + (i % 2) * 5, .4 + (i % 3) * .15, shade(c, .85));
  return s;
}
function zSpireTop(x, top, w, h, roof, o = {}){ return `<path d="M${zr(x - w / 2 - 2)} ${zr(top)}L${zr(x)} ${zr(top - h)}L${zr(x)} ${zr(top + 3)}z" fill="${shade(roof, 1.1)}"/><path d="M${zr(x + w / 2 + 2)} ${zr(top)}L${zr(x)} ${zr(top - h)}L${zr(x)} ${zr(top + 3)}z" fill="${shade(roof, .58)}"/><path d="M${zr(x)} ${zr(top - h)}v-10M${zr(x - 4)} ${zr(top - h - 6)}h8" stroke="${o.cross || "#c9a24a"}" stroke-width="1.6"/>`; }
function zDome(x, y, R, col, o = {}){ return `<path d="M${zr(x - R)} ${zr(y)}Q${zr(x - R * 1.15)} ${zr(y - R * 1.3)} ${zr(x)} ${zr(y - R * 2.1)}Q${zr(x + R * 1.15)} ${zr(y - R * 1.3)} ${zr(x + R)} ${zr(y)}z" fill="${col}"/><path d="M${zr(x)} ${zr(y - R * 2.1)}Q${zr(x + R * 1.15)} ${zr(y - R * 1.3)} ${zr(x + R)} ${zr(y)}H${zr(x + R * .1)}z" fill="${shade(col, .6)}"/><path d="M${zr(x - R * .55)} ${zr(y - R * .8)}q${zr(R * .2)} -${zr(R * .7)} ${zr(R * .45)} -${zr(R * 1.05)}" stroke="${shade(col, 1.4)}" stroke-width="${zr(R * .18)}" fill="none" opacity=".7" stroke-linecap="round"/><path d="M${zr(x)} ${zr(y - R * 2.1)}v-${zr(R * .8)}M${zr(x - R * .3)} ${zr(y - R * 2.6)}h${zr(R * .6)}" stroke="${o.cross || "#e8c060"}" stroke-width="${zr(Math.max(1.2, R * .12))}"/>`; }

/* ---------- намети, вітряк, дрібні речі ---------- */
function zTent(K, x, y, w, h, d, c, o = {}){
  const D = [d * .62, -d * .5], ap = [x, y - h];
  let s = zCast(x - w / 2, x + w / 2, y, h * .6, d, .3);
  s += `<polygon points="${zPoly([ap, [ap[0] + D[0], ap[1] + D[1]], [x + w / 2 + D[0], y + D[1]], [x + w / 2, y]])}" fill="${shade(c, .62)}"/>`;
  s += `<polygon points="${zPoly([[x - w / 2, y], ap, [x + w / 2, y]])}" fill="${c}"/>`;
  if (o.stripe) s += `<polygon points="${zPoly([[x - w * .3, y], ap, [x - w * .1, y]])}" fill="${o.stripe}" opacity=".75"/><polygon points="${zPoly([[x + w * .1, y], ap, [x + w * .3, y]])}" fill="${o.stripe}" opacity=".6"/>`;
  s += `<path d="M${zr(x - w * .16)} ${zr(y)}L${zr(x)} ${zr(y - h * .62)}L${zr(x + w * .16)} ${zr(y)}z" fill="#1a1410"/><path d="M${zr(x)} ${zr(y - h * .62)}L${zr(x - w * .22)} ${zr(y)}h${zr(w * .06)}z" fill="${shade(c, 1.2)}"/>`;
  s += `<path d="M${zr(ap[0])} ${zr(ap[1])}L${zr(ap[0] + D[0])} ${zr(ap[1] + D[1])}" stroke="${shade(c, 1.3)}" stroke-width="1.6"/><path d="M${zr(x - w / 2)} ${zr(y)}l-10 4M${zr(x + w / 2)} ${zr(y)}l10 3" stroke="#4a3a2a" stroke-width=".8"/>`;
  if (o.flag) s += `<path d="M${zr(ap[0])} ${zr(ap[1])}v-14" stroke="#2a2018" stroke-width="1.4"/><path d="M${zr(ap[0])} ${zr(ap[1] - 14)}h13l-3 3.5 3 3.5h-13z" fill="${o.flag}"/>`;
  return s;
}
function zPavilion(K, x, y, R, H, c, c2, o = {}){
  const id = "zp" + (++Z_GID), top = y - H * .5, rh = H * .6;
  let s = zSh(x + R + H * .2, y + 4, R * 1.5 + H * .2, R * .4, .32) + `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c, 1.15)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, .55)}"/></linearGradient></defs>`;
  s += `<path d="M${zr(x - R)} ${zr(top)}V${zr(y)}A${zr(R)} ${zr(R * .34)} 0 0 0 ${zr(x + R)} ${zr(y)}V${zr(top)}z" fill="url(#${id})"/>`;
  if (c2) for (const k of [-.66, -.22, .22, .66]) s += `<path d="M${zr(x + k * R - R * .1)} ${zr(top)}h${zr(R * .2)}v${zr(H * .5 + R * .32 * Math.sqrt(1 - k * k))}h-${zr(R * .2)}z" fill="${c2}" opacity="${k > 0 ? .5 : .85}"/>`;
  s += `<path d="M${zr(x - R * .2)} ${zr(y + R * .32)}v-${zr(H * .34)}q${zr(R * .2)} -${zr(H * .1)} ${zr(R * .4)} 0v${zr(H * .34)}z" fill="#1a1410"/>`;
  s += `<path d="M${zr(x - R * 1.12)} ${zr(top)}L${zr(x)} ${zr(top - rh)}L${zr(x)} ${zr(top + R * .38)}z" fill="${shade(c, 1.1)}"/><path d="M${zr(x + R * 1.12)} ${zr(top)}L${zr(x)} ${zr(top - rh)}L${zr(x)} ${zr(top + R * .38)}z" fill="${shade(c, .58)}"/>`;
  if (c2) s += `<path d="M${zr(x - R * .55)} ${zr(top + R * .2)}L${zr(x)} ${zr(top - rh)}L${zr(x - R * .25)} ${zr(top + R * .32)}z" fill="${c2}" opacity=".75"/><path d="M${zr(x + R * .3)} ${zr(top + R * .32)}L${zr(x)} ${zr(top - rh)}L${zr(x + R * .6)} ${zr(top + R * .2)}z" fill="${c2}" opacity=".45"/>`;
  let sc = `M${zr(x - R * 1.12)} ${zr(top)}`; for (let i = 0; i < 8; i++){ const a0 = Math.PI - i / 8 * Math.PI, a1 = Math.PI - (i + 1) / 8 * Math.PI, p1 = [x + Math.cos(a1) * R * 1.12, top + Math.sin(a1) * R * .38]; sc += `Q${zr((x + Math.cos((a0 + a1) / 2) * R * 1.12))} ${zr(top + Math.sin((a0 + a1) / 2) * R * .38 + 6)} ${zr(p1[0])} ${zr(p1[1])}`; }
  s += `<path d="${sc}" fill="${c2 || shade(c, .8)}" stroke="${shade(c, .6)}" stroke-width=".8"/>`;
  s += `<path d="M${zr(x)} ${zr(top - rh)}v-14" stroke="#2a2018" stroke-width="1.4"/><path d="M${zr(x)} ${zr(top - rh - 14)}h${zr(R * .7)}l-3 3.5 3 3.5h-${zr(R * .7)}z" fill="${o.flag || c2 || shade(c, 1.3)}"/>`;
  return s;
}
function zWindmill(K, x, y, s, o = {}){
  const wall = o.wall || "#c8b890", roof = o.roof || "#6a3a26", sail = o.sail || "#e8dcc0", fr = o.frame || "#4a3424", H = 90 * s, cy = y - H - 6 * s;
  let g = zCast(x - 22 * s, x + 22 * s, y, H, 20 * s, .32);
  g += `<path d="M${zr(x - 24 * s)} ${zr(y)}L${zr(x - 15 * s)} ${zr(y - H)}H${zr(x + 15 * s)}L${zr(x + 24 * s)} ${zr(y)}z" fill="${wall}"/><path d="M${zr(x + 5 * s)} ${zr(y)}L${zr(x + 3 * s)} ${zr(y - H)}H${zr(x + 15 * s)}L${zr(x + 24 * s)} ${zr(y)}z" fill="${shade(wall, .62)}"/>`;
  let pl = ""; for (let yy = y - 12 * s; yy > y - H; yy -= 9 * s) pl += `M${zr(x - 24 * s + (y - yy) / H * 9 * s)} ${zr(yy)}H${zr(x + 24 * s - (y - yy) / H * 9 * s)}`; g += `<path d="${pl}" stroke="${shade(wall, .7)}" stroke-width=".9" opacity=".5"/>`;
  g += zDoor(x - 3 * s, y, 13 * s, 22 * s) + `<rect x="${zr(x - 5 * s)}" y="${zr(y - H * .62)}" width="${zr(8 * s)}" height="${zr(10 * s)}" fill="#221c16"/>`;
  g += `<path d="M${zr(x - 20 * s)} ${zr(y - H)}Q${zr(x - 4 * s)} ${zr(y - H - 30 * s)} ${zr(x + 20 * s)} ${zr(y - H)}z" fill="${roof}"/><path d="M${zr(x)} ${zr(y - H - 22 * s)}Q${zr(x + 14 * s)} ${zr(y - H - 16 * s)} ${zr(x + 20 * s)} ${zr(y - H)}H${zr(x + 2 * s)}z" fill="${shade(roof, .6)}"/>`;
  let bl = ""; for (let i = 0; i < 4; i++){ const a = (o.ang ?? 24) + i * 90; bl += `<g transform="rotate(${a} ${zr(x - 4 * s)} ${zr(cy)})"><path d="M${zr(x - 4 * s)} ${zr(cy)}h${zr(70 * s)}" stroke="${fr}" stroke-width="${zr(3 * s)}"/><rect x="${zr(x + 12 * s)}" y="${zr(cy - 12 * s)}" width="${zr(56 * s)}" height="${zr(11 * s)}" fill="${sail}" opacity=".92" stroke="${fr}" stroke-width="1"/><path d="${[1, 2, 3, 4, 5].map(k => `M${zr(x + 12 * s + k * 9.4 * s)} ${zr(cy - 12 * s)}v${zr(11 * s)}`).join("")}" stroke="${fr}" stroke-width=".8"/></g>`; }
  return g + bl + `<circle cx="${zr(x - 4 * s)}" cy="${zr(cy)}" r="${zr(5 * s)}" fill="${fr}"/>`;
}
const Z = {
  barrel:(x, y, c = "#7a5232") => zSh(x + 6, y + 1, 9, 3, .3) + `<rect x="${zr(x - 7)}" y="${zr(y - 16)}" width="7" height="16" fill="${c}"/><rect x="${zr(x)}" y="${zr(y - 16)}" width="7" height="16" fill="${shade(c, .62)}"/><ellipse cx="${zr(x)}" cy="${zr(y - 16)}" rx="7" ry="2.6" fill="${shade(c, 1.25)}"/><ellipse cx="${zr(x)}" cy="${zr(y - 16)}" rx="5" ry="1.6" fill="${shade(c, .9)}"/><path d="M${zr(x - 7)} ${zr(y - 4)}h14M${zr(x - 7)} ${zr(y - 12)}h14" stroke="#3a3432" stroke-width="1.3"/>`,
  crate:(x, y, sz = 14, c = "#9a7a4a") => { const d = sz * .5; return zSh(x + sz * .6, y + 1, sz, sz * .3, .28) + `<rect x="${zr(x - sz / 2)}" y="${zr(y - sz)}" width="${sz}" height="${sz}" fill="${c}"/><path d="M${zr(x - sz / 2)} ${zr(y - sz)}l${zr(d)} -${zr(d * .8)}h${sz}l-${zr(d)} ${zr(d * .8)}z" fill="${shade(c, 1.22)}"/><path d="M${zr(x + sz / 2)} ${zr(y)}l${zr(d)} -${zr(d * .8)}v-${sz}l-${zr(d)} ${zr(d * .8)}z" fill="${shade(c, .62)}"/><path d="M${zr(x - sz / 2)} ${zr(y - sz)}l${sz} ${sz}M${zr(x - sz / 2 + 1)} ${zr(y - sz + 1)}h${sz - 2}v${sz - 2}h-${sz - 2}z" stroke="${shade(c, .6)}" stroke-width="1" fill="none"/>`; },
  sack:(x, y) => zSh(x + 4, y + 1, 7, 2, .25) + `<path d="M${zr(x - 6)} ${zr(y)}q-1.4 -9 2.4 -12.6l-1.4 -2.6h10l-1.4 2.6q3.8 3.6 2.4 12.6z" fill="#cdbb92"/><path d="M${zr(x + 1)} ${zr(y)}q3.6 -7 1.6 -15.2h2.6q3 3.6 1.4 15.2z" fill="#9a8a68"/><path d="M${zr(x - 4)} ${zr(y - 13)}h8" stroke="#6a5a3a" stroke-width="1.2"/>`,
  cart:(x, y, load = "") => zSh(x + 8, y + 2, 30, 6, .3) + `<path d="M${zr(x - 26)} ${zr(y - 10)}l-22 8" stroke="#4a3220" stroke-width="2.6"/><path d="M${zr(x - 24)} ${zr(y - 26)}h40l8 -7h-40z" fill="#9a7a50"/>${load}<path d="M${zr(x - 24)} ${zr(y - 11)}h40v-15h-40z" fill="#6a4a2a"/><path d="M${zr(x + 16)} ${zr(y - 11)}l8 -7v-15l-8 7z" fill="#4a3220"/><path d="M${zr(x - 24)} ${zr(y - 18)}h40" stroke="#4a3220" stroke-width="1"/><circle cx="${zr(x - 13)}" cy="${zr(y - 7)}" r="8" fill="none" stroke="#2a1d12" stroke-width="2.6"/><path d="M${zr(x - 21)} ${zr(y - 7)}h16M${zr(x - 13)} ${zr(y - 15)}v16" stroke="#2a1d12" stroke-width="1.2"/><circle cx="${zr(x + 10)}" cy="${zr(y - 7)}" r="8" fill="none" stroke="#2a1d12" stroke-width="2.6"/><path d="M${zr(x + 2)} ${zr(y - 7)}h16M${zr(x + 10)} ${zr(y - 15)}v16" stroke="#2a1d12" stroke-width="1.2"/>`,
  well:(x, y) => zSh(x + 10, y + 2, 20, 5, .3) + `<path d="M${zr(x - 16)} ${zr(y - 14)}v14a16 5 0 0 0 32 0v-14z" fill="#8a8272"/><path d="M${zr(x + 2)} ${zr(y - 14)}v19a16 5 0 0 0 14 -5v-14z" fill="#5a5448"/><ellipse cx="${zr(x)}" cy="${zr(y - 14)}" rx="16" ry="5" fill="#a49c8a"/><ellipse cx="${zr(x)}" cy="${zr(y - 14)}" rx="11" ry="3" fill="#18262c"/><path d="M${zr(x - 14)} ${zr(y - 14)}v-30M${zr(x + 14)} ${zr(y - 14)}v-30" stroke="#5a4028" stroke-width="3"/><path d="M${zr(x - 20)} ${zr(y - 42)}l20 -12l20 12z" fill="#7a4a2a"/><path d="M${zr(x)} ${zr(y - 54)}l20 12h-6z" fill="#4a2a1a"/><path d="M${zr(x - 14)} ${zr(y - 34)}h28M${zr(x)} ${zr(y - 34)}v12" stroke="#3a2a1a" stroke-width="1.6"/><path d="M${zr(x - 3)} ${zr(y - 22)}h6v5h-6z" fill="#7a5a3a"/>`,
  stall:(x, y, c, c2 = "#f2ead6", goods) => zSh(x + 14, y + 2, 26, 5, .28) + `<path d="M${zr(x - 20)} ${zr(y)}v-28M${zr(x + 20)} ${zr(y)}v-28" stroke="#4a3424" stroke-width="2.4"/><path d="M${zr(x - 22)} ${zr(y - 14)}h44v14h-44z" fill="#7a5a3a"/><path d="M${zr(x - 22)} ${zr(y - 14)}h44l5 -4h-44z" fill="#9a7a50"/>${goods || [0, 1, 2, 3, 4].map(i => `<circle cx="${zr(x - 16 + i * 8)}" cy="${zr(y - 17)}" r="3" fill="${["#c03a2a", "#e8b030", "#5a8a3a", "#d87a2a", "#8a3a8a"][i]}"/>`).join("")}<path d="M${zr(x - 26)} ${zr(y - 28)}h52l-4 -10h-44z" fill="${c}"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${zr(x - 26 + i * 8.7)} ${zr(y - 28)}l${zr(i < 3 ? 2 : 1)} -10h4.3l-${zr(i < 3 ? 1 : 2)} 10z" fill="${c2}" opacity=".85"/>`).join("")}<path d="M${zr(x - 26)} ${zr(y - 28)}q4.3 5 8.7 0q4.3 5 8.7 0q4.3 5 8.7 0q4.3 5 8.7 0q4.3 5 8.7 0q4.3 5 8.7 0" fill="${c}"/>`,
  hay:(x, y, s = 1) => zSh(x + 12 * s, y + 2, 18 * s, 5 * s, .3) + `<path d="M${zr(x - 16 * s)} ${zr(y)}Q${zr(x - 16 * s)} ${zr(y - 34 * s)} ${zr(x)} ${zr(y - 38 * s)}Q${zr(x + 16 * s)} ${zr(y - 34 * s)} ${zr(x + 16 * s)} ${zr(y)}z" fill="#d0ae5c"/><path d="M${zr(x)} ${zr(y - 38 * s)}Q${zr(x + 16 * s)} ${zr(y - 34 * s)} ${zr(x + 16 * s)} ${zr(y)}H${zr(x + 2 * s)}z" fill="#9a7e3e"/><path d="M${zr(x - 12 * s)} ${zr(y - 12 * s)}q12 -4 26 0M${zr(x - 10 * s)} ${zr(y - 24 * s)}q10 -4 22 0" stroke="#7a6230" stroke-width="1" fill="none" opacity=".6"/><path d="M${zr(x)} ${zr(y - 38 * s)}v-8" stroke="#3a2a1a" stroke-width="1.6"/>`,
  logs:(x, y) => { let s = zSh(x + 22, y + 2, 30, 5, .3); for (const [k, m] of [[0, 4], [1, 3], [2, 2]]) for (let i = 0; i < m; i++){ const lx = x + i * 11 + k * 5.5, ly = y - k * 9 - 5.5; s += `<path d="M${zr(lx)} ${zr(ly - 5.4)}h36l2 5.4 -2 5.4h-36z" fill="#6a4a2a"/><path d="M${zr(lx)} ${zr(ly - 5.4)}h36" stroke="#8a6a44" stroke-width="1.2"/><circle cx="${zr(lx)}" cy="${zr(ly)}" r="5.4" fill="#c8a070" stroke="#5a3a1e" stroke-width="1"/><circle cx="${zr(lx)}" cy="${zr(ly)}" r="2" fill="none" stroke="#9a7a50" stroke-width=".8"/>`; } return s; },
  fence:(pts, c = "#6a4a2c") => { let d = "", p = ""; for (let i = 0; i < pts.length; i++){ const [ax, ay] = pts[i]; d += (i ? "L" : "M") + zr(ax) + " " + zr(ay - 6); if (i < pts.length - 1){ const [bx, by] = pts[i + 1], L = Math.hypot(bx - ax, by - ay), k = Math.max(1, Math.round(L / 12)); for (let j = 0; j <= k; j++) p += `M${zr(ax + (bx - ax) * j / k)} ${zr(ay + (by - ay) * j / k)}v-15`; } } return `<path d="${d}" stroke="${c}" stroke-width="2.4" fill="none"/><path d="${d}" stroke="${c}" stroke-width="2.4" fill="none" transform="translate(0 -6)"/><path d="${p}" stroke="${shade(c, .75)}" stroke-width="3"/><path d="${p}" stroke="${shade(c, 1.2)}" stroke-width="1" transform="translate(-1 0)"/>`; },
  sign:(x, y, c = "#8a6a44") => zSh(x + 6, y + 1, 8, 2, .25) + `<path d="M${zr(x)} ${zr(y)}v-38" stroke="#4a3424" stroke-width="3.4"/><path d="M${zr(x)} ${zr(y - 34)}h26l6 5 -6 5h-26zM${zr(x)} ${zr(y - 21)}h-26l-6 5 6 5h26z" fill="${c}"/><path d="M${zr(x)} ${zr(y - 34)}h26l6 5h-32z" fill="${shade(c, 1.2)}"/><path d="M${zr(x + 4)} ${zr(y - 29)}h18M${zr(x - 22)} ${zr(y - 16)}h18" stroke="#3a2a1a" stroke-width="1" opacity=".6"/>`,
  bench:(x, y) => zSh(x + 6, y + 1, 18, 3, .25) + `<path d="M${zr(x - 16)} ${zr(y - 8)}h32l4 -3h-32z" fill="#9a7a50"/><path d="M${zr(x - 16)} ${zr(y - 8)}h32v2.4h-32z" fill="#6a4a2a"/><path d="M${zr(x - 13)} ${zr(y - 6)}v6M${zr(x + 13)} ${zr(y - 6)}v6" stroke="#4a3220" stroke-width="2"/>`,
  boat:(x, y, s = 1, c = "#6a4a2a", flip) => `<g transform="translate(${zr(x)} ${zr(y)}) scale(${flip ? -s : s} ${s})">${zSh(4, 3, 30, 5, .3)}<path d="M-28 -5q28 14 56 0l6 -7h-68z" fill="${c}"/><path d="M-34 -12h68l-6 7q-28 5 -56 0z" fill="${shade(c, 1.3)}" opacity=".85"/><path d="M-12 -11v5M8 -11v5" stroke="${shade(c, .6)}" stroke-width="2"/><path d="M-36 -1q36 8 72 0" stroke="#d8e8ee" stroke-width="1.2" fill="none" opacity=".5"/></g>`,
  cross:(x, y, s = 1, c = "#5a4a38") => zSh(x + 8 * s, y + 1, 10 * s, 2.6 * s, .28) + `<rect x="${zr(x - 2 * s)}" y="${zr(y - 30 * s)}" width="${zr(4 * s)}" height="${zr(30 * s)}" fill="${c}"/><rect x="${zr(x - 10 * s)}" y="${zr(y - 23 * s)}" width="${zr(20 * s)}" height="${zr(4 * s)}" fill="${shade(c, 1.15)}"/><rect x="${zr(x)}" y="${zr(y - 30 * s)}" width="${zr(2 * s)}" height="${zr(30 * s)}" fill="${shade(c, .7)}"/>`,
  grave:(x, y, c = "#7a766c", s = 1) => zSh(x + 7 * s, y + 1, 11 * s, 3 * s, .3) + `<path d="M${zr(x - 7 * s)} ${zr(y)}v-${zr(16 * s)}a${zr(7 * s)} ${zr(7 * s)} 0 0 1 ${zr(14 * s)} 0v${zr(16 * s)}z" fill="${c}"/><path d="M${zr(x + 3 * s)} ${zr(y)}v-${zr(22 * s)}a${zr(7 * s)} ${zr(7 * s)} 0 0 1 ${zr(4 * s)} ${zr(6 * s)}v${zr(16 * s)}z" fill="${shade(c, .65)}"/><path d="M${zr(x - 2.6 * s)} ${zr(y - 14 * s)}h${zr(5.2 * s)}M${zr(x)} ${zr(y - 17 * s)}v${zr(8 * s)}" stroke="${shade(c, .7)}" stroke-width="${zr(1.2 * s)}"/><ellipse cx="${zr(x)}" cy="${zr(y + 5 * s)}" rx="${zr(9 * s)}" ry="${zr(3 * s)}" fill="#4a4030" opacity=".5"/>`,
  menhir:(x, y, h, c = "#8a867a") => zSh(x + h * .3, y + 2, h * .4, h * .1, .32) + `<path d="M${zr(x - h * .17)} ${zr(y)}l${zr(h * .04)} -${zr(h * .82)}l${zr(h * .13)} -${zr(h * .18)}l${zr(h * .12)} ${zr(h * .12)}l${zr(h * .05)} ${zr(h * .88)}z" fill="${c}"/><path d="M${zr(x)} ${zr(y - h)}l${zr(h * .12)} ${zr(h * .12)}l${zr(h * .05)} ${zr(h * .88)}h-${zr(h * .15)}z" fill="${shade(c, .6)}"/><path d="M${zr(x - h * .08)} ${zr(y - h * .6)}l${zr(h * .06)} ${zr(h * .08)}l-${zr(h * .03)} ${zr(h * .1)}" stroke="${shade(c, .6)}" stroke-width="1" fill="none"/>`,
  banner:(x, y, h, c, c2 = "#e8c060", o = {}) => { const w = 18, bh = o.bh || h * .45, ty = y - h + 4; let s = zSh(x + 8, y + 1, 9, 2.4, .25) + `<path d="M${zr(x)} ${zr(y)}v-${h}" stroke="#2a2218" stroke-width="3"/><path d="M${zr(x - 11)} ${zr(ty)}h22" stroke="#2a2218" stroke-width="2.4"/><circle cx="${zr(x)}" cy="${zr(y - h - 2)}" r="2.6" fill="${c2}"/>`;
    s += `<path d="M${zr(x - w / 2)} ${zr(ty)}h${w}v${zr(bh)}l-${w / 2} -${zr(bh * .18)}l-${w / 2} ${zr(bh * .18)}z" fill="${c}"/><path d="M${zr(x)} ${zr(ty)}h${w / 2}v${zr(bh)}l-${w / 2} -${zr(bh * .18)}z" fill="#000" opacity=".2"/>`;
    s += o.moon ? `<path d="M${zr(x + 2)} ${zr(ty + bh * .22)}a6 6 0 1 0 0 ${zr(bh * .4)}a4.6 4.6 0 1 1 0 -${zr(bh * .4)}z" fill="${c2}"/>` : o.sun ? `<circle cx="${zr(x)}" cy="${zr(ty + bh * .42)}" r="4.4" fill="${c2}"/><path d="${[...Array(8)].map((_, i) => `M${zr(x + Math.cos(i * .785) * 6)} ${zr(ty + bh * .42 + Math.sin(i * .785) * 6)}l${zr(Math.cos(i * .785) * 3)} ${zr(Math.sin(i * .785) * 3)}`).join("")}" stroke="${c2}" stroke-width="1.4"/>` : `<circle cx="${zr(x)}" cy="${zr(ty + bh * .42)}" r="4.4" fill="${c2}"/>`;
    if (o.torn) s += `<path d="M${zr(x - 4)} ${zr(ty + bh * .7)}l4 6 2 -4" stroke="#1d1812" stroke-width="2" fill="none"/>`; return s; },
  skullPole:(x, y) => `<path d="M${zr(x)} ${zr(y)}v-34" stroke="#3a2a1a" stroke-width="2.6"/><circle cx="${zr(x)}" cy="${zr(y - 38)}" r="6" fill="#e8dfc8"/><rect x="${zr(x - 3.4)}" y="${zr(y - 34)}" width="6.8" height="4" fill="#e8dfc8"/><circle cx="${zr(x - 2.2)}" cy="${zr(y - 38.6)}" r="1.6" fill="#1a1612"/><circle cx="${zr(x + 2.2)}" cy="${zr(y - 38.6)}" r="1.6" fill="#1a1612"/><path d="M${zr(x - 1.6)} ${zr(y - 31)}v-2M${zr(x)} ${zr(y - 31)}v-2M${zr(x + 1.6)} ${zr(y - 31)}v-2" stroke="#1a1612" stroke-width=".7"/>`,
  dummy:(x, y) => zSh(x + 6, y + 1, 9, 2.4, .25) + `<path d="M${zr(x)} ${zr(y)}v-34M${zr(x - 13)} ${zr(y - 25)}h26" stroke="#5a4028" stroke-width="3"/><ellipse cx="${zr(x)}" cy="${zr(y - 22)}" rx="7" ry="10" fill="#c8a85a"/><path d="M${zr(x - 5)} ${zr(y - 26)}l10 6M${zr(x - 5)} ${zr(y - 18)}l10 -4" stroke="#9a7e3e" stroke-width="1"/><circle cx="${zr(x)}" cy="${zr(y - 36)}" r="5.4" fill="#d8bc70"/><path d="M${zr(x - 3)} ${zr(y - 26)}l6 4" stroke="#c03a2a" stroke-width="2"/>`,
  rack:(x, y) => zSh(x + 8, y + 1, 18, 3, .25) + `<path d="M${zr(x - 16)} ${zr(y)}v-26M${zr(x + 16)} ${zr(y)}v-26M${zr(x - 18)} ${zr(y - 24)}h36M${zr(x - 18)} ${zr(y - 6)}h36" stroke="#4a3424" stroke-width="2.4"/><path d="M${zr(x - 10)} ${zr(y - 4)}l-2 -30M${zr(x - 3)} ${zr(y - 4)}v-32M${zr(x + 4)} ${zr(y - 4)}l2 -30M${zr(x + 11)} ${zr(y - 4)}l1 -28" stroke="#9aa4a8" stroke-width="1.8"/><path d="M${zr(x - 12)} ${zr(y - 34)}l2 -4l2 4M${zr(x - 3)} ${zr(y - 36)}l1.6 -4l1.6 4M${zr(x + 6)} ${zr(y - 34)}l1.6 -4l1.6 4" fill="#c8d0d4"/>`,
  anvil:(x, y) => zSh(x + 6, y + 1, 12, 3, .3) + `<path d="M${zr(x - 6)} ${zr(y)}h12l-2 -8h-8z" fill="#3a3a3e"/><path d="M${zr(x - 14)} ${zr(y - 8)}h22q5 0 7 -5h-26q-2 0 -3 5z" fill="#5a5a62"/><path d="M${zr(x - 14)} ${zr(y - 13)}h26" stroke="#8a8a92" stroke-width="1.4"/>`,
  lamp:(K, x, y, c = "#ffc860") => { K.light(x + 7, y - 34, 26, c, .7); return zSh(x + 4, y + 1, 6, 2, .25) + `<path d="M${zr(x)} ${zr(y)}v-40h9" stroke="#2a2218" stroke-width="2.4" fill="none"/><path d="M${zr(x + 4)} ${zr(y - 37)}h6l1 2v6l-1 2h-6l-1 -2v-6z" fill="${c}"/><path d="M${zr(x + 3)} ${zr(y - 37)}h8l-4 -4z" fill="#2a2218"/>`; },
  fire:(K, x, y, s = 1, c = "#ff8a2a") => { K.light(x, y - 10 * s, 60 * s, c, .8); return zSh(x, y + 2, 18 * s, 5 * s, .3) + [0, 1, 2, 3, 4, 5, 6].map(i => `<ellipse cx="${zr(x + Math.cos(i * .9) * 14 * s)}" cy="${zr(y + Math.sin(i * .9) * 5 * s)}" rx="${zr(4 * s)}" ry="${zr(3 * s)}" fill="#6a6458"/>`).join("") + `<path d="M${zr(x - 12 * s)} ${zr(y)}l${zr(24 * s)} -${zr(6 * s)}M${zr(x - 12 * s)} ${zr(y - 6 * s)}l${zr(24 * s)} ${zr(6 * s)}" stroke="#3a2414" stroke-width="${zr(4 * s)}" stroke-linecap="round"/><path d="M${zr(x - 8 * s)} ${zr(y - 2)}q${zr(2 * s)} -${zr(14 * s)} ${zr(8 * s)} -${zr(22 * s)}q${zr(6 * s)} ${zr(8 * s)} ${zr(8 * s)} ${zr(22 * s)}z" fill="${c}"/><path d="M${zr(x - 4 * s)} ${zr(y - 2)}q${zr(1.4 * s)} -${zr(8 * s)} ${zr(4 * s)} -${zr(13 * s)}q${zr(3 * s)} ${zr(5 * s)} ${zr(4 * s)} ${zr(13 * s)}z" fill="#ffe08a"/>` + zSmoke(x + 2, y - 30 * s, .8 * s, "#8a8478"); },
  cauldron:(K, x, y, c = "#7aff5a") => { K.light(x, y - 18, 40, c, .7); return zSh(x + 6, y + 2, 18, 4, .3) + `<path d="M${zr(x - 14)} ${zr(y)}l4 -6M${zr(x + 14)} ${zr(y)}l-4 -6" stroke="#1a1612" stroke-width="2.4"/><path d="M${zr(x - 15)} ${zr(y - 18)}a15 13 0 0 0 30 0z" fill="#22201c"/><path d="M${zr(x + 2)} ${zr(y - 18)}a15 13 0 0 1 -6 12.6a15 13 0 0 0 19 -12.6z" fill="#141210"/><ellipse cx="${zr(x)}" cy="${zr(y - 18)}" rx="15" ry="4" fill="${c}"/><circle cx="${zr(x - 3)}" cy="${zr(y - 24)}" r="2.4" fill="${c}" opacity=".7"/><circle cx="${zr(x + 4)}" cy="${zr(y - 30)}" r="1.8" fill="${c}" opacity=".5"/>` + zSmoke(x, y - 34, .8, c); },
  web:(x, y, R) => { let d = ""; for (let i = 0; i < 9; i++){ const a = i / 9 * 6.283; d += `M${zr(x)} ${zr(y)}l${zr(Math.cos(a) * R)} ${zr(Math.sin(a) * R)}`; } for (const k of [.3, .55, .8, 1]){ d += "M"; for (let i = 0; i <= 9; i++){ const a = i / 9 * 6.283, q = R * k * (i % 2 ? .94 : 1); d += `${i ? "L" : ""}${zr(x + Math.cos(a) * q)} ${zr(y + Math.sin(a) * q)} `; } } return `<path d="${d}" stroke="#eef0f0" stroke-width=".8" fill="none" opacity=".7"/>`; },
  cocoon:(x, y) => `<path d="M${zr(x)} ${zr(y - 30)}v10" stroke="#eef0f0" stroke-width=".8"/><ellipse cx="${zr(x)}" cy="${zr(y - 10)}" rx="5" ry="10" fill="#e0dcd0"/><path d="M${zr(x - 4.6)} ${zr(y - 14)}l9 3M${zr(x - 4.6)} ${zr(y - 8)}l9 3M${zr(x - 4)} ${zr(y - 3)}l8 2" stroke="#a8a49a" stroke-width=".8"/>`,
  stakes:(x, y, n, c = "#5a4028") => { let s = ""; for (let i = 0; i < n; i++){ const px = x + i * 10, l = (i % 3 - 1) * 2; s += `<path d="M${zr(px)} ${zr(y)}l${l} -22" stroke="${c}" stroke-width="3.4"/><path d="M${zr(px + l - 1.7)} ${zr(y - 20)}l1.7 -6l1.7 6z" fill="${shade(c, 1.3)}"/>`; } return s; },
  crow:(x, y, s = 1) => `<path d="M${zr(x - 6 * s)} ${zr(y - 2 * s)}q${zr(3 * s)} -${zr(3.4 * s)} ${zr(6 * s)} ${zr(2 * s)}q${zr(3 * s)} -${zr(5 * s)} ${zr(6 * s)} -${zr(2 * s)}" stroke="#141210" stroke-width="${zr(2 * s)}" fill="none" stroke-linecap="round"/>`,
  sunflower:(x, y, s = 1) => `<path d="M${zr(x)} ${zr(y)}v-${zr(26 * s)}" stroke="#4a6a2a" stroke-width="${zr(2 * s)}"/><path d="M${zr(x)} ${zr(y - 12 * s)}q${zr(6 * s)} -${zr(4 * s)} ${zr(10 * s)} 0q-${zr(6 * s)} ${zr(3 * s)} -${zr(10 * s)} 0z" fill="#5a7a30"/><circle cx="${zr(x)}" cy="${zr(y - 28 * s)}" r="${zr(7 * s)}" fill="#f0c030"/><circle cx="${zr(x - 1.4 * s)}" cy="${zr(y - 29.4 * s)}" r="${zr(4 * s)}" fill="#f8d850"/><circle cx="${zr(x + .6 * s)}" cy="${zr(y - 28 * s)}" r="${zr(3.2 * s)}" fill="#5a3a1a"/>`,
  crystal:(K, x, y, s = 1, c = "#c08aff") => { K.light(x, y - 12 * s, 40 * s, c, .8); return zSh(x + 6 * s, y + 1, 10 * s, 3 * s, .3) + `<path d="M${zr(x)} ${zr(y - 30 * s)}l${zr(7 * s)} ${zr(16 * s)}l-${zr(7 * s)} ${zr(14 * s)}l-${zr(7 * s)} -${zr(14 * s)}z" fill="${shade(c, 1.2)}"/><path d="M${zr(x)} ${zr(y - 30 * s)}l${zr(7 * s)} ${zr(16 * s)}l-${zr(7 * s)} ${zr(14 * s)}z" fill="${shade(c, .7)}"/><path d="M${zr(x - 9 * s)} ${zr(y - 2)}l${zr(3 * s)} -${zr(12 * s)}l${zr(4 * s)} ${zr(10 * s)}z" fill="${c}"/>`; },
  stair:(K, x, y, w = 40, glow) => { if (glow) K.light(x, y - 12, w * 1.4, glow, .7); return zSh(x + 8, y + 3, w * .8, 6, .3) + `<path d="M${zr(x - w / 2 - 8)} ${zr(y + 2)}l8 -${zr(w * .5)}h${w}l8 ${zr(w * .5)}z" fill="#6a6458"/><path d="M${zr(x - w / 2 - 8)} ${zr(y + 2)}l8 -${zr(w * .5)}h4l-6 ${zr(w * .5)}z" fill="#8a8476"/><path d="M${zr(x - w / 2 + 4)} ${zr(y)}l5 -${zr(w * .42)}h${zr(w - 18)}l5 ${zr(w * .42)}z" fill="#0c0a08"/>` + [1, 2, 3, 4].map(k => `<path d="M${zr(x - w / 2 + 6 + k * 1.2)} ${zr(y - k * w * .08)}h${zr(w - 12 - k * 2.4)}" stroke="#2e2a26" stroke-width="2"/>`).join("") + (glow ? `<ellipse cx="${zr(x)}" cy="${zr(y - w * .3)}" rx="${zr(w * .3)}" ry="${zr(w * .1)}" fill="${glow}" opacity=".35"/>` : ""); },
  cave:(K, x, y, w, h, glow) => { if (glow) K.light(x - w * .05, y - h * .3, w * 1.2, glow, .7); return zSh(x + w * .4, y + 4, w * 1.1, h * .16, .32) + `<path d="M${zr(x - w)} ${zr(y)}Q${zr(x - w * .85)} ${zr(y - h * .9)} ${zr(x - w * .2)} ${zr(y - h)}Q${zr(x + w * .3)} ${zr(y - h * 1.1)} ${zr(x + w * .75)} ${zr(y - h * .6)}Q${zr(x + w * 1.05)} ${zr(y - h * .3)} ${zr(x + w * 1.1)} ${zr(y)}z" fill="#6e6a60"/><path d="M${zr(x + w * .05)} ${zr(y - h * 1.04)}Q${zr(x + w * .3)} ${zr(y - h * 1.1)} ${zr(x + w * .75)} ${zr(y - h * .6)}Q${zr(x + w * 1.05)} ${zr(y - h * .3)} ${zr(x + w * 1.1)} ${zr(y)}H${zr(x + w * .35)}z" fill="#4a4740"/><path d="M${zr(x - w * .7)} ${zr(y - h * .5)}l${zr(w * .3)} -${zr(h * .15)}M${zr(x + w * .5)} ${zr(y - h * .7)}l${zr(w * .2)} ${zr(h * .2)}M${zr(x - w * .5)} ${zr(y - h * .8)}l${zr(w * .2)} ${zr(h * .05)}" stroke="#3a3832" stroke-width="1.6" opacity=".6"/><path d="M${zr(x - w * .4)} ${zr(y)}v-${zr(h * .4)}a${zr(w * .36)} ${zr(h * .32)} 0 0 1 ${zr(w * .72)} 0v${zr(h * .4)}z" fill="#0c0a08"/>` + (glow ? `<path d="M${zr(x - w * .3)} ${zr(y)}v-${zr(h * .3)}a${zr(w * .26)} ${zr(h * .22)} 0 0 1 ${zr(w * .52)} 0v${zr(h * .3)}z" fill="${glow}" opacity=".25"/>` : ""); },
  gallows:(x, y) => zSh(x + 20, y + 2, 26, 5, .3) + `<path d="M${zr(x - 10)} ${zr(y)}v-70h44M${zr(x - 10)} ${zr(y - 52)}l18 -18" stroke="#2a2018" stroke-width="5" fill="none"/><path d="M${zr(x - 18)} ${zr(y)}h16" stroke="#2a2018" stroke-width="4"/><path d="M${zr(x + 26)} ${zr(y - 70)}v10" stroke="#3a3028" stroke-width="1.4"/><path d="M${zr(x + 18)} ${zr(y - 60)}h16v26h-16z" fill="none" stroke="#1e1a16" stroke-width="2"/><path d="M${zr(x + 22)} ${zr(y - 60)}v26M${zr(x + 26)} ${zr(y - 60)}v26M${zr(x + 30)} ${zr(y - 60)}v26M${zr(x + 18)} ${zr(y - 48)}h16" stroke="#1e1a16" stroke-width="1.2"/>`,
  folk:(x, y, c = "#7a3a26", hood) => zSh(x + 4, y + 1, 7, 2, .28) + `<path d="M${zr(x - 5)} ${zr(y)}l1.6 -15h6.8l1.6 15z" fill="${c}"/><path d="M${zr(x)} ${zr(y)}l0 -15h3.4l1.6 15z" fill="${shade(c, .7)}"/><circle cx="${zr(x)}" cy="${zr(y - 19)}" r="4" fill="${hood ? c : "#e0b890"}"/>${hood ? `<path d="M${zr(x - 4)} ${zr(y - 18)}q4 -9 8 0" fill="${shade(c, .8)}"/>` : `<path d="M${zr(x - 4)} ${zr(y - 20)}q4 -5 8 0" fill="#5a3a22"/>`}`,
  sheep:(x, y) => zSh(x + 5, y + 1, 10, 2.6, .25) + `<path d="M${zr(x - 6)} ${zr(y)}v4M${zr(x + 5)} ${zr(y)}v4" stroke="#2a2420" stroke-width="1.6"/><ellipse cx="${zr(x)}" cy="${zr(y - 4)}" rx="10" ry="7" fill="#ece6d6"/><ellipse cx="${zr(x + 3)} " cy="${zr(y - 2)}" rx="6" ry="4" fill="#cfc8b6"/><ellipse cx="${zr(x - 10)}" cy="${zr(y - 7)}" rx="3.6" ry="3" fill="#2a2420"/>`,
};

/* ---------- рослинність і настрій за біомом ---------- */
const Z_BIO = {
  meadow:{line:"mix", edge:{oak:8, pine:2, birch:2}, mid:{bush:7, rock:3}, fg:"oak"},
  forest:{line:"pine", edge:{pine:16, oak:3}, mid:{bush:6, rock:4, pine:2}, fg:"pine"},
  ash:{line:"dead", edge:{dead:9}, mid:{rock:8, dead:2, bush:2}, fg:"dead"},
  dark:{line:"dead", edge:{dead:12}, mid:{rock:6, dead:3}, fg:"dead"},
  swamp:{line:"dead", edge:{willow:3, dead:6, oak:2}, mid:{bush:4, reeds:10}, pools:5, fg:"willow"},
  bog:{line:"dead", edge:{willow:3, dead:8}, mid:{reeds:12, bush:2}, pools:7, fg:"dead"},
  sand:{line:null, edge:{rock:5, bush:3}, mid:{rock:4}, fg:null},
  snow:{line:"pine", edge:{pine:12}, mid:{rock:6, pine:2}, fg:"pine"},
  polonyna:{line:null, edge:{pine:6}, mid:{rock:6, bush:3}, fg:null},
  vineyard:{line:"mix", edge:{oak:5}, mid:{bush:4, rock:3}, fg:"oak"},
  bone:{line:"dead", edge:{dead:7}, mid:{rock:5}, fg:"dead"},
  battle:{line:null, edge:{oak:3, dead:3}, mid:{rock:4}, fg:null},
};
function zTree(K, kind, x, y, s){ const snow = K.c.b === "snow";
  return kind === "pine" ? zPine(x, y, s, {snow}) : kind === "oak" ? zOak(x, y, s, K.c.b === "vineyard" ? Z_PAL.olive : null) : kind === "birch" ? zBirch(x, y, s) : kind === "dead" ? zDead(x, y, s * 1.2) : kind === "willow" ? zWillow(x, y, s * .9) : kind === "bush" ? zBush(x, y, s * 1.1) : kind === "reeds" ? zReeds(x, y, s, K.r) : zRock(x, y, s * .9, K.c.b === "snow" ? "#8a9096" : K.c.b === "sand" ? "#a8987a" : "#77726a", {snow, moss:["forest", "swamp", "bog"].includes(K.c.b)}); }
function zDress(K){
  const B = Z_BIO[K.c.b] || Z_BIO.meadow, d = K.dress || {}, r = K.r;
  if (B.pools && !d.noPools) K.under += zPools(K, d.pools ?? B.pools);
  if (B.line && !d.noLine) K.under += zTreeline(K, d.line || B.line);
  const mul = d.veg ?? 1;
  for (const [k, n] of Object.entries(d.edge || B.edge)) K.scatter(Math.round(n * mul), k === "rock" ? 14 : 22, (x, y) => zTree(K, k, x, y, .85 + r() * .5), {edge:true, box:[-20, 90, 920, 540]});
  for (const [k, n] of Object.entries(d.mid || B.mid)) K.scatter(Math.round(n * mul), k === "rock" || k === "reeds" ? 10 : 16, (x, y) => zTree(K, k, x, y, .6 + r() * .4), {box:[40, 110, 860, 520]});
  // передній план у кутах: темніший, ближче до глядача
  const fg = d.fg !== undefined ? d.fg : B.fg;
  if (fg) for (const [x, y] of [[-6, 548], [906, 552]]){ if (K.exits.some(([ex, ey]) => Math.hypot(ex - x, ey - y) < 150)) continue; K.over += `<g opacity=".92">${zTree(K, fg, x, y, 1.7)}</g><g opacity=".4">${zTree(K, fg, x, y, 1.7).replace(/fill="#[0-9a-f]{6}"/g, 'fill="#0a0a08"')}</g>`; }
}
function zMood(K){
  const m = K.c.mood || K.Bm.mood || "day"; let s = `<rect width="${ZW}" height="${ZH}" fill="url(#zlt)"/>`;
  if (m === "dusk") s += `<rect width="${ZW}" height="${ZH}" fill="#ff8a3a" opacity=".08"/><rect width="${ZW}" height="${ZH}" fill="#2a1a40" opacity=".18"/>`;
  if (m === "dark") s += `<rect width="${ZW}" height="${ZH}" fill="#0a0a1e" opacity=".34"/>`;
  if (K.c.b === "snow") s += `<rect width="${ZW}" height="${ZH}" fill="#dfe8f0" opacity=".06"/>`;
  if (K.c.b === "bog" || K.c.b === "swamp") s += `<rect width="${ZW}" height="${ZH}" fill="#1e3a2a" opacity=".12"/>`;
  return s;
}
function zFog(K, n = 6, col = "#dfe8e0", op = .14){ let s = ""; for (let i = 0; i < n; i++) s += `<ellipse cx="${zr(K.r() * ZW)}" cy="${zr(140 + K.r() * 380)}" rx="${zr(140 + K.r() * 140)}" ry="${zr(18 + K.r() * 18)}" fill="${col}" opacity="${op}" filter="url(#zb3)"/>`; return s; }

/* ---------- збирання сцени ---------- */
function sceneSVG(id){
  if (SCN_CACHE[id]) return SCN_CACHE[id];
  const K = zCtx(id);
  let s = zDefs(K) + zGround(K);
  const water = zWater(K), paths = zPaths(K);
  const f = ZS[id]; if (f) f(K); else zGeneric(K);
  zDress(K);
  s += zTexture(K) + water + K.under + paths + (K.floor || "");
  K.items.sort((a, b) => a[0] - b[0]);
  s += K.items.map(v => v[1]).join("") + K.over;
  s += zMood(K) + K.glow;
  if (K.Bm.fog || K.fog) s += zFog(K, 7, K.fogCol || "#dfe8e0", K.fogOp || .14);
  s += K.top + `<rect width="${ZW}" height="${ZH}" filter="url(#zgr)" opacity=".45"/><rect width="${ZW}" height="${ZH}" fill="url(#zvg)"/>`;
  s = s.replace(/\d+\.\d{3,}/g, m => (+m).toFixed(1));
  SCN_CACHE[id] = s; return s;
}
// сцена як картинка: малюється один раз, далі браузер просто показує її
const SCN_URL = {};
function sceneImg(id){
  if (!SCN_URL[id]){ const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZW}" height="${ZH}" viewBox="0 0 ${ZW} ${ZH}">${sceneSVG(id)}</svg>`; try { SCN_URL[id] = URL.createObjectURL(new Blob([svg], {type:"image/svg+xml"})); } catch (e){ SCN_URL[id] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); } }
  return `<img class="scene" src="${SCN_URL[id]}" width="${ZW}" height="${ZH}" alt="" aria-hidden="true" draggable="false">`;
}

/* ---------- загальна композиція з тегів (якщо локація не має своєї) ---------- */
function zGeneric(K){
  const X = K.c.x || [], has = k => X.includes(k), r = K.r;
  if (has("village") || has("dead_village")) for (const [x, y] of [[150, 200], [700, 200], [180, 470], [720, 470]]) K.place(x, y, 50, (px, py) => has("dead_village") ? zHouse(K, px, py, 80, 44, 52, {wall:"#6a6458", roof:"#2e2a26", lit:false}) : zHouse(K, px, py, 84, 46, 56, {chimney:r() < .6, timber:"#4a3424", roof:K.pk(["#8a3a24", "#6a4a2a", "#5a3a2a"])}), {cy:30});
  if (has("tents") || has("camp_dawn") || has("camp_night")) for (const [x, y] of [[300, 200], [420, 190], [640, 200], [740, 250]]) K.place(x, y, 34, (px, py) => zTent(K, px, py, 60, 48, 46, has("camp_night") ? "#3a2a4a" : has("camp_dawn") ? "#ece2c8" : K.pk(["#8a7454", "#7a6a50"])), {cy:20});
  K.dress = {};
}
const ZS = {};
// фонтан, криниця-джерело, причал, повітка
function zFountain(K, x, y, s = 1){ let g = zSh(x + 8 * s, y + 4, 44 * s, 12 * s, .3);
  g += `<ellipse cx="${x}" cy="${y}" rx="${40 * s}" ry="${15 * s}" fill="#8a8272"/><ellipse cx="${x}" cy="${y - 5 * s}" rx="${40 * s}" ry="${15 * s}" fill="#b4ac98"/><ellipse cx="${x}" cy="${y - 5 * s}" rx="${33 * s}" ry="${11.5 * s}" fill="#2e5a6a"/><ellipse cx="${x - 6 * s}" cy="${y - 8 * s}" rx="${18 * s}" ry="${4 * s}" fill="#6aa0b0" opacity=".6"/>`;
  g += `<path d="M${x - 5 * s} ${y - 5 * s}v-${26 * s}h${10 * s}v${26 * s}z" fill="#a49c8a"/><path d="M${x + 1 * s} ${y - 5 * s}v-${26 * s}h${4 * s}v${26 * s}z" fill="#7a7466"/><ellipse cx="${x}" cy="${y - 31 * s}" rx="${15 * s}" ry="${5 * s}" fill="#b4ac98"/><ellipse cx="${x}" cy="${y - 32 * s}" rx="${11 * s}" ry="${3 * s}" fill="#4a8aa0"/>`;
  g += `<path d="M${x - 12 * s} ${y - 31 * s}q-${10 * s} 4 -${14 * s} ${22 * s}M${x + 12 * s} ${y - 31 * s}q${10 * s} 4 ${14 * s} ${22 * s}M${x} ${y - 34 * s}v-${10 * s}" stroke="#cfe8f0" stroke-width="${1.6 * s}" fill="none" opacity=".85"/><circle cx="${x}" cy="${y - 45 * s}" r="${2.4 * s}" fill="#e8f4f8" opacity=".8"/>`;
  return g; }
function zPier(x, y, L, ang = 0){ let s = `<g transform="translate(${zr(x)} ${zr(y)}) rotate(${ang})">${zSh(L / 2 + 6, 8, L / 2 + 4, 6, .3)}<rect x="0" y="-8" width="${L}" height="16" fill="#7a5a3a"/>`; for (let i = 4; i < L; i += 6) s += `<path d="M${i} -8v16" stroke="#4a3220" stroke-width="1"/>`; for (let i = 0; i <= L; i += L / 3) s += `<rect x="${zr(i - 2)}" y="6" width="4" height="10" fill="#3a2a1a"/>`; return s + `<path d="M0 -8h${L}" stroke="#9a7a50" stroke-width="2"/></g>`; }
function zShed(K, x, y, w, h, d, o = {}){ const wall = o.wall || "#7a5a3a", roof = o.roof || "#5a3a24", D = [d * .62, -d * .5], x0 = x - w / 2, x1 = x + w / 2, top = y - h;
  let s = zCast(x0, x1, y, h, d, .3);
  s += `<polygon points="${zPoly([[x1, y], [x1 + D[0], y + D[1]], [x1 + D[0], top + D[1]], [x1, top]])}" fill="${shade(wall, .6)}"/><rect x="${zr(x0)}" y="${zr(top)}" width="${zr(w)}" height="${zr(h)}" fill="#1e1610"/>`;
  for (const px of [x0, x1 - 4, x0 + w / 2 - 2]) s += `<rect x="${zr(px)}" y="${zr(top)}" width="4" height="${zr(h)}" fill="${wall}"/>`;
  s += `<polygon points="${zPoly([[x0 - 5, top + 2], [x1 + 5, top + 2], [x1 + D[0] + 5, top + D[1] - 6], [x0 + D[0] - 5, top + D[1] - 6]])}" fill="${roof}"/><path d="M${zr(x0 - 5)} ${zr(top + 2)}H${zr(x1 + 5)}" stroke="${shade(roof, .6)}" stroke-width="2"/>`;
  if (o.inner) s += o.inner; return s; }
