/* ============ карта світу: об'ємний рельєф, ліси, гори, міста й села ============ */
// світло падає з північного заходу, тіні лягають на південний схід
const MA = {
  pk: (r, a) => a[Math.floor(r() * a.length)],
  f: v => Math.round(v * 10) / 10,
};
function maShadow(x, y, rx, ry, o = .32){ return `<ellipse cx="${MA.f(x)}" cy="${MA.f(y)}" rx="${MA.f(rx)}" ry="${MA.f(ry)}" fill="#0b0906" opacity="${o}"/>`; }
// будиночок: передня стіна, бічна стіна в тіні, двосхилий дах
function maHouse(x, y, w, h, d, wall, roof, o = {}){
  const D = [d * .55, -d * .45], x0 = x - w / 2, x1 = x + w / 2, top = y - h, rh = o.rh || h * .75, f = MA.f;
  const BR = [x1 + D[0], y + D[1]], BTR = [x1 + D[0], top + D[1]], BTL = [x0 + D[0], top + D[1]];
  const RL = [x0 + D[0] / 2, top + D[1] / 2 - rh], RR = [x1 + D[0] / 2, top + D[1] / 2 - rh];
  const P = a => a.map(p => f(p[0]) + "," + f(p[1])).join(" ");
  let s = maShadow(x + w * .35 + d * .3, y + 1.5, w * .75 + d * .3, Math.max(2.5, d * .32), .3);
  s += `<polygon points="${P([[x1, y], BR, BTR, [x1, top]])}" fill="${shade(wall, .62)}"/>`;
  s += `<polygon points="${P([[x0, y], [x1, y], [x1, top], [x0, top]])}" fill="${wall}"/>`;
  s += `<polygon points="${P([RL, RR, BTR, BTL])}" fill="${shade(roof, .55)}"/>`;
  s += `<polygon points="${P([[x1, top], BTR, RR])}" fill="${shade(wall, .5)}"/>`;
  s += `<polygon points="${P([[x0 - 1, top + .5], [x1 + 1, top + .5], RR, RL])}" fill="${roof}"/>`;
  s += `<path d="M${f(RL[0])} ${f(RL[1])}L${f(RR[0])} ${f(RR[1])}" stroke="${shade(roof, 1.35)}" stroke-width=".8"/>`;
  if (!o.nodoor) s += `<rect x="${f(x - w * .12)}" y="${f(y - h * .55)}" width="${f(w * .24)}" height="${f(h * .55)}" fill="#2a1d12"/>`;
  if (o.win) s += `<rect x="${f(x0 + w * .14)}" y="${f(y - h * .7)}" width="${f(w * .16)}" height="${f(h * .22)}" fill="${o.win}"/>`;
  return s;
}
// кругла вежа зі шпилем
function maTower(x, y, r, h, wall, roof, o = {}){
  const f = MA.f, top = y - h, id = "tw" + Math.round(x) + "_" + Math.round(y);
  let s = maShadow(x + r * .9 + h * .18, y + 1, r * 1.3 + h * .2, Math.max(2.5, r * .5), .32);
  s += `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(wall, 1.18)}"/><stop offset=".45" stop-color="${wall}"/><stop offset="1" stop-color="${shade(wall, .55)}"/></linearGradient></defs>`;
  s += `<path d="M${f(x - r)} ${f(top)}V${f(y)}A${f(r)} ${f(r * .38)} 0 0 0 ${f(x + r)} ${f(y)}V${f(top)}z" fill="url(#${id})"/>`;
  if (o.flat){ s += `<ellipse cx="${f(x)}" cy="${f(top)}" rx="${f(r)}" ry="${f(r * .38)}" fill="${shade(wall, .8)}"/>`; for (let i = -1; i <= 1; i++) s += `<rect x="${f(x + i * r * .66 - r * .18)}" y="${f(top - r * .5)}" width="${f(r * .36)}" height="${f(r * .5)}" fill="${shade(wall, i < 0 ? 1.1 : i > 0 ? .6 : .85)}"/>`; }
  else { const rh = o.rh || r * 2.4; s += `<path d="M${f(x - r * 1.12)} ${f(top)}L${f(x)} ${f(top - rh)}L${f(x)} ${f(top + r * .3)}z" fill="${shade(roof, 1.12)}"/><path d="M${f(x + r * 1.12)} ${f(top)}L${f(x)} ${f(top - rh)}L${f(x)} ${f(top + r * .3)}z" fill="${shade(roof, .6)}"/>`; }
  if (o.win) s += `<rect x="${f(x - r * .2)}" y="${f(top + h * .25)}" width="${f(r * .4)}" height="${f(h * .18)}" fill="${o.win}"/>`;
  return s;
}
// намет: трикутна призма
function maTent(x, y, w, h, c){
  const f = MA.f; let s = maShadow(x + w * .35, y + 1, w * .7, w * .2, .28);
  s += `<polygon points="${f(x - w / 2)},${f(y)} ${f(x)},${f(y - h)} ${f(x)},${f(y + 1)}" fill="${shade(c, 1.12)}"/><polygon points="${f(x + w / 2)},${f(y)} ${f(x)},${f(y - h)} ${f(x)},${f(y + 1)}" fill="${shade(c, .62)}"/>`;
  s += `<path d="M${f(x)} ${f(y - h)}v-${f(h * .35)}" stroke="#2a2218" stroke-width="1"/><path d="M${f(x)} ${f(y - h * 1.35)}h${f(w * .3)}l-2 2 2 2h-${f(w * .3)}z" fill="${shade(c, 1.3)}"/>`;
  return s;
}
// хвойне й листяне дерево з освітленим і тіньовим боком
function maTree(x, y, z, kind, col){
  const f = MA.f;
  if (kind === "dead") return maShadow(x + z * .8, y + .5, z * .9, z * .25, .25) + `<path d="M${f(x)} ${f(y)}v-${f(z * 2.2)}M${f(x)} ${f(y - z * 1.2)}l-${f(z * .7)} -${f(z * .7)}M${f(x)} ${f(y - z * 1.6)}l${f(z * .6)} -${f(z * .6)}" stroke="#2a251e" stroke-width="${f(Math.max(1, z * .28))}" fill="none" stroke-linecap="round"/>`;
  if (kind === "leaf") return maShadow(x + z * 1.1, y + .5, z * 1.4, z * .45, .3) + `<rect x="${f(x - z * .12)}" y="${f(y - z * .9)}" width="${f(z * .24)}" height="${f(z * .9)}" fill="#3a2a1a"/><circle cx="${f(x)}" cy="${f(y - z * 1.5)}" r="${f(z * .95)}" fill="${shade(col, .78)}"/><circle cx="${f(x - z * .25)}" cy="${f(y - z * 1.75)}" r="${f(z * .6)}" fill="${shade(col, 1.12)}"/>`;
  return maShadow(x + z * 1.1, y + .5, z * 1.3, z * .38, .3) + `<polygon points="${f(x - z)},${f(y)} ${f(x)},${f(y - z * 2.6)} ${f(x)},${f(y)}" fill="${shade(col, 1.15)}"/><polygon points="${f(x + z)},${f(y)} ${f(x)},${f(y - z * 2.6)} ${f(x)},${f(y)}" fill="${shade(col, .7)}"/>`;
}
// гора: освітлений західний схил, тіньовий східний, сніжна шапка
function maPeak(x, y, z, snow){
  const f = MA.f, h = z * 1.35, px = x - z * .08;
  let s = maShadow(x + z * .7, y + 1, z * 1.25, z * .26, .3);
  s += `<polygon points="${f(x - z)},${f(y)} ${f(px)},${f(y - h)} ${f(x + z * .1)},${f(y)}" fill="#7d8380"/>`;
  s += `<polygon points="${f(px)},${f(y - h)} ${f(x + z)},${f(y)} ${f(x + z * .1)},${f(y)}" fill="#4a4f4d"/>`;
  s += `<path d="M${f(x - z * .55)} ${f(y - h * .35)}l${f(z * .2)} -${f(h * .12)}M${f(x + z * .3)} ${f(y - h * .4)}l${f(z * .18)} ${f(h * .14)}" stroke="#3c403e" stroke-width="1" opacity=".6"/>`;
  if (snow){ const sh = h * .38; s += `<polygon points="${f(px)},${f(y - h)} ${f(px - z * .34)},${f(y - h + sh)} ${f(px - z * .16)},${f(y - h + sh * .8)} ${f(px)},${f(y - h + sh * 1.05)}" fill="#f2f4f2"/><polygon points="${f(px)},${f(y - h)} ${f(px + z * .3)},${f(y - h + sh * .95)} ${f(px + z * .12)},${f(y - h + sh * .82)} ${f(px)},${f(y - h + sh * 1.05)}" fill="#b9c2c4"/>`; }
  return s;
}
// калюжа з бережком і відблиском
function maPool(x, y, rx, ry, c = "#1f3236"){
  const f = MA.f;
  return `<ellipse cx="${f(x + 1)}" cy="${f(y + 1)}" rx="${f(rx + 3)}" ry="${f(ry + 2)}" fill="#141a12" opacity=".8"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${c}"/><path d="M${f(x - rx * .55)} ${f(y - ry * .35)}q${f(rx * .4)} -${f(ry * .5)} ${f(rx * .9)} -${f(ry * .1)}" stroke="#8fb0b4" stroke-width="1.2" fill="none" opacity=".55"/>`;
}
function maReeds(x, y, n, r){
  const f = MA.f; let d = "", t = "";
  for (let i = 0; i < n; i++){ const ox = x + (r() * 2 - 1) * 7, oy = y + (r() * 2 - 1) * 3, hh = 6 + r() * 6, lean = (r() * 2 - 1) * 2; d += `M${f(ox)} ${f(oy)}q${f(lean)} -${f(hh * .5)} ${f(lean * 1.6)} -${f(hh)}`; if (r() < .45) t += `<ellipse cx="${f(ox + lean * 1.6)}" cy="${f(oy - hh + 1.5)}" rx="1.1" ry="2.4" fill="#4a3018"/>`; }
  return `<path d="${d}" stroke="#6d7d40" stroke-width="1.2" fill="none"/>` + t;
}
function maCross(x, y, s = 1, c = "#5a4a38"){ const f = MA.f; return maShadow(x + 4 * s, y + .5, 6 * s, 1.6 * s, .25) + `<rect x="${f(x - 1.1 * s)}" y="${f(y - 14 * s)}" width="${f(2.2 * s)}" height="${f(14 * s)}" fill="${c}"/><rect x="${f(x - 5 * s)}" y="${f(y - 10.5 * s)}" width="${f(10 * s)}" height="${f(2.2 * s)}" fill="${shade(c, 1.2)}"/>`; }
function maGrave(x, y, c = "#8a8578"){ const f = MA.f; return maShadow(x + 3, y + .5, 4.5, 1.4, .25) + `<path d="M${f(x - 3)} ${f(y)}v-5a3 3 0 0 1 6 0v5z" fill="${c}"/><path d="M${f(x + 1)} ${f(y)}v-7.6a3 3 0 0 1 2 2.6v5z" fill="${shade(c, .65)}"/>`; }
function maFlag(x, y, c, c2){ const f = MA.f; return `<path d="M${f(x)} ${f(y)}v-20" stroke="#2a2218" stroke-width="1.6"/><path d="M${f(x)} ${f(y - 20)}h11l-3 4.5 3 4.5h-11z" fill="${c}"/><circle cx="${f(x + 5)}" cy="${f(y - 15.5)}" r="1.8" fill="${c2}"/>`; }
function maRuin(x, y, w, h, c = "#7a7468"){
  const f = MA.f; let s = maShadow(x + w * .4, y + 1, w * .7, 3, .28);
  s += `<path d="M${f(x - w / 2)} ${f(y)}v-${f(h)}l${f(w * .18)} ${f(h * .25)}l${f(w * .14)} -${f(h * .4)}l${f(w * .2)} ${f(h * .55)}l${f(w * .18)} -${f(h * .2)}l${f(w * .3)} ${f(h * .45)}V${f(y)}z" fill="${c}"/>`;
  s += `<path d="M${f(x + w / 2)} ${f(y)}v-${f(h * .35)}l${f(w * .22)} -${f(w * .16)}v${f(h * .4)}z" fill="${shade(c, .6)}"/>`;
  s += `<path d="M${f(x - w * .3)} ${f(y - h * .45)}h${f(w * .14)}v${f(h * .2)}h-${f(w * .14)}z" fill="#1d1812"/>`;
  return s;
}
// кам'яний мур кільцем з вежами (місто)
function maWalls(x, y, rx, ry, c, roof, r){
  const f = MA.f; let s = maShadow(x + rx * .12, y + ry * .2, rx * 1.12, ry * 1.1, .28);
  s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${shade(c, .45)}" opacity=".35"/>`;
  s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${shade(c, .55)}" stroke-width="6"/>`;
  s += `<path d="M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 0 0 ${f(x + rx)} ${f(y)}" fill="none" stroke="${c}" stroke-width="5" transform="translate(0,-2)"/>`;
  const tw = [];
  for (let i = 0; i < 6; i++){ const a = i / 6 * Math.PI * 2 + .3; tw.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]); }
  tw.sort((a, b) => a[1] - b[1]);
  return { back:s, towers:tw.map(([tx, ty]) => maTower(tx, ty, 3.6, 10, c, roof, {flat:r() < .5, rh:7})) };
}

// пагорб: освітлений захід, тінь на сході
function maHill(x, y, w, h, col){
  const f = MA.f, id = "hl" + Math.round(x) + "_" + Math.round(y);
  return maShadow(x + w * .35, y + 1, w * .9, h * .22, .22) + `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="${shade(col, 1.25)}"/><stop offset=".5" stop-color="${col}"/><stop offset="1" stop-color="${shade(col, .62)}"/></linearGradient></defs>
    <path d="M${f(x - w)} ${f(y)}Q${f(x - w * .45)} ${f(y - h * 1.05)} ${f(x - w * .05)} ${f(y - h)}Q${f(x + w * .5)} ${f(y - h * .95)} ${f(x + w)} ${f(y)}z" fill="url(#${id})"/>`;
}
function maRock(x, y, z, wet){
  const f = MA.f; return (wet ? `<ellipse cx="${f(x)}" cy="${f(y + z * .2)}" rx="${f(z * 1.6)}" ry="${f(z * .5)}" fill="none" stroke="#c8d8dc" stroke-width="1" opacity=".5"/>` : maShadow(x + z * .6, y + 1, z * 1.2, z * .35, .3)) +
    `<path d="M${f(x - z)} ${f(y)}L${f(x - z * .6)} ${f(y - z * .8)}L${f(x + z * .1)} ${f(y - z)}L${f(x + z)} ${f(y - z * .3)}L${f(x + z * .8)} ${f(y)}z" fill="#7a7a72"/><path d="M${f(x + z * .1)} ${f(y - z)}L${f(x + z)} ${f(y - z * .3)}L${f(x + z * .8)} ${f(y)}L${f(x + z * .05)} ${f(y)}z" fill="#4e4e48"/>`;
}
// дрібна фактура землі по краях: трава, квіти, тріщини, гравій, мох, вирви, поля
function maTextures(r, near, coast, W, H){
  const f = MA.f, seaCtx = document.createElement("canvas").getContext("2d"), seaP = new Path2D(coast + " L0 1600z");
  const inSea = (x, y) => seaCtx.isPointInPath(seaP, x, y), nodes = Object.values(NODES);
  const nearNode = (x, y, d) => nodes.some(n => Math.abs(n.x - x) < d && Math.abs(n.y - y) < d * .7);
  const GR = {kab:["#7e8e4a","#56682e"], zak:["#5a6e3a","#34462a"], ord:["#8a7e52","#5a5236"], mark:["#a49a7c","#6e6854"], bog:["#5a6a34","#34421e"], ash:["#4a463c","#2e2b26"], wild:["#5a5e48","#3a3e30"]};
  const tufts = {}; let s = "";
  for (let i = 0; i < 11000; i++){ const x = r() * W, y = r() * H; if (inSea(x, y)) continue; const reg = near(x, y), c = GR[reg][r() < .5 ? 0 : 1];
    (tufts[c] = tufts[c] || []).push(`M${f(x)} ${f(y)}l-1.6 -3.4M${f(x)} ${f(y)}l.2 -4.4M${f(x)} ${f(y)}l1.8 -3.2`); }
  for (const [c, a] of Object.entries(tufts)) s += `<path d="${a.join("")}" stroke="${c}" stroke-width="1" fill="none" opacity=".75"/>`;
  // квіти на луках
  const FL = ["#e8d070","#f2ece0","#d8705a","#b89ae0"]; const fl = {};
  for (let i = 0; i < 2600; i++){ const x = r() * W, y = r() * H; const reg = near(x, y); if (!["kab","ord","zak"].includes(reg) || inSea(x, y)) continue; if (reg === "zak" && r() < .6) continue; const c = MA.pk(r, FL); (fl[c] = fl[c] || []).push(`M${f(x)} ${f(y)}h.01`); }
  for (const [c, a] of Object.entries(fl)) s += `<path d="${a.join("")}" stroke="${c}" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>`;
  // попелище: тріщини й випалені плями
  let cr = "", sc = ""; for (let i = 0; i < 420; i++){ const x = 980 + r() * 780, y = 30 + r() * 880; if (near(x, y) !== "ash") continue; let px = x, py = y; cr += `M${f(px)} ${f(py)}`; for (let k = 0; k < 4; k++){ px += (r() * 2 - 1) * 9; py += (r() * 2 - 1) * 6; cr += `L${f(px)} ${f(py)}`; } }
  for (let i = 0; i < 40; i++){ const x = 980 + r() * 780, y = 30 + r() * 880; if (near(x, y) !== "ash") continue; sc += `<ellipse cx="${x | 0}" cy="${y | 0}" rx="${30 + r() * 60 | 0}" ry="${14 + r() * 26 | 0}" fill="#1e1c18" opacity=".35"/>`; }
  s += `<g filter="url(#blwm)">${sc}</g><path d="${cr}" stroke="#211f1a" stroke-width="1.2" fill="none" opacity=".7"/>`;
  // каміння й гравій у Марці та на попелищі
  let gv = ""; for (let i = 0; i < 1600; i++){ const x = r() * W, y = r() * H, reg = near(x, y); if (reg !== "mark" && reg !== "ash") continue; gv += `M${f(x)} ${f(y)}h.01`; }
  s += `<path d="${gv}" stroke="#c8c0a8" stroke-width="1.8" stroke-linecap="round" opacity=".35"/>`;
  for (let i = 0; i < 70; i++){ const x = r() * W, y = r() * H, reg = near(x, y); if (!["mark","ash","wild"].includes(reg) || inSea(x, y) || nearNode(x, y, 46)) continue; s += maRock(x, y, 3 + r() * 5); }
  // мох і багно на болоті
  let ms = ""; for (let i = 0; i < 160; i++){ const x = 900 + r() * 980, y = 960 + r() * 600; if (near(x, y) !== "bog") continue; ms += `<ellipse cx="${x | 0}" cy="${y | 0}" rx="${14 + r() * 30 | 0}" ry="${6 + r() * 12 | 0}" fill="${r() < .5 ? "#4a6030" : "#2a2a18"}" opacity=".4"/>`; }
  s += `<g filter="url(#shwm)">${ms}</g>`;
  // вирви на полі битви орденів
  for (let i = 0; i < 60; i++){ const x = 1950 + r() * 880, y = 990 + r() * 560; if (near(x, y) !== "ord" || nearNode(x, y, 40)) continue; const z = 5 + r() * 8;
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(z * 1.5)}" ry="${f(z * .6)}" fill="#3a3224"/><ellipse cx="${f(x + z * .2)}" cy="${f(y + z * .1)}" rx="${f(z * 1.1)}" ry="${f(z * .4)}" fill="#241e16"/><path d="M${f(x - z * 1.5)} ${f(y)}a${f(z * 1.5)} ${f(z * .6)} 0 0 1 ${f(z * 3)} 0" stroke="#8a7a58" stroke-width="1" fill="none" opacity=".6"/>`; }
  // поля біля сіл і міст
  for (const n of nodes){ const sc0 = SCENE[Object.keys(NODES).find(k => NODES[k] === n)] || {}; const X = sc0.x || [];
    const farm = (n.kind === "city" || n.kind === "town" || X.includes("village") || X.includes("mill") || X.includes("fence")) && ["kab","zak","ord","ash"].includes(n.r) && !X.includes("dead_village") && !X.includes("stilts");
    if (!farm) continue; const cnt = n.kind === "city" ? 9 : 5, rr = rng("farm" + n.x + n.y);
    const pal = n.r === "ash" ? ["#6a6450","#5a5444","#7a6e52"] : ["#b8a44a","#a0a24a","#7e8e3a","#a8884a","#6e5a3a","#c4b060"];
    const patches = n.kind === "city" ? 3 : 2;
    for (let pI = 0; pI < patches; pI++){
      const a = rr() * Math.PI * 2, d = (n.kind === "city" ? 150 : 74) + rr() * 24, ox = n.x + Math.cos(a) * d * 1.25, oy = n.y + Math.sin(a) * d * .7, th = (rr() * 2 - 1) * .35;
      const cols = 3 + (rr() * 2 | 0), rows = 2 + (rr() * 2 | 0), cw = 22 + rr() * 8, ch = 13 + rr() * 5, gap = 3, ct = Math.cos(th), sn = Math.sin(th);
      const T = (u, v) => [ox + u * ct - v * sn * .6, oy + u * sn * .6 + v * ct];
      for (let ci = 0; ci < cols; ci++) for (let ri = 0; ri < rows; ri++){ if (rr() < .18) continue;
        const u0 = (ci - cols / 2) * (cw + gap), v0 = (ri - rows / 2) * (ch + gap), P = [T(u0, v0), T(u0 + cw, v0), T(u0 + cw, v0 + ch), T(u0, v0 + ch)];
        if (P.some(p => inSea(p[0], p[1]) || nearNode(p[0], p[1], 26))) continue; const c = MA.pk(rr, pal);
        s += `<polygon points="${P.map(p => f(p[0]) + "," + f(p[1])).join(" ")}" fill="${c}" opacity=".82" stroke="#3a4424" stroke-width="1.6" stroke-opacity=".75"/>`;
        let st = ""; const vert = rr() < .5; for (let k = 1; k < 5; k++){ const t = k / 5; const A2 = vert ? T(u0 + cw * t, v0) : T(u0, v0 + ch * t), B2 = vert ? T(u0 + cw * t, v0 + ch) : T(u0 + cw, v0 + ch * t); st += `M${f(A2[0])} ${f(A2[1])}L${f(B2[0])} ${f(B2[1])}`; }
        s += `<path d="${st}" stroke="${shade(c, .72)}" stroke-width="1" opacity=".75"/>`; }
      // живопліт уздовж поля
      let hd = ""; for (let k = 0; k < 7; k++){ const pt = T((k / 6 - .5) * cols * (cw + gap), rows / 2 * (ch + gap) + 3); hd += `<circle cx="${f(pt[0])}" cy="${f(pt[1])}" r="${f(2.4 + rr() * 1.4)}" fill="#3a5226"/>`; }
      s += hd; } }
  // пагорби на рівнинах
  const hc = {kab:"#6a7a42", zak:"#4a5a36", ord:"#6a6046", mark:"#7a7460", wild:"#4a4e3c"};
  const hs = []; for (let i = 0; i < 140; i++){ const x = r() * W, y = r() * H, reg = near(x, y); if (!hc[reg] || inSea(x, y) || nearNode(x, y, 56)) continue; hs.push([x, y, reg]); }
  hs.sort((a, b) => a[1] - b[1]); for (const [x, y, reg] of hs) s += maHill(x, y, 16 + r() * 18, 9 + r() * 9, hc[reg]);
  return s;
}

/* ============ міста на карті: мури з брамами, вулиці, площа, пам'ятки, передмістя ============ */
// будинок фронтоном до глядача: гребінь даху йде вглиб
function maHouseG(x, y, w, h, d, wall, roof, o = {}){
  const f = MA.f, D = [d * .55, -d * .45], x0 = x - w / 2, x1 = x + w / 2, top = y - h, gh = o.gh || w * .55;
  const P = a => a.map(p => f(p[0]) + "," + f(p[1])).join(" ");
  const apex = [x, top - gh], apexB = [x + D[0], top - gh + D[1]];
  let s = maShadow(x + w * .35 + d * .3, y + 1.5, w * .75 + d * .3, Math.max(2.5, d * .32), .3);
  s += `<polygon points="${P([[x1, y], [x1 + D[0], y + D[1]], [x1 + D[0], top + D[1]], [x1, top]])}" fill="${shade(wall, .62)}"/>`;
  s += `<polygon points="${P([[x1 + 1, top], [x1 + 1 + D[0], top + D[1]], apexB, apex])}" fill="${shade(roof, .62)}"/>`;
  s += `<polygon points="${P([[x0, y], [x1, y], [x1, top], apex, [x0, top]])}" fill="${wall}"/>`;
  s += `<polygon points="${P([[x0 - 1.2, top + .8], apex, [x + .6, top - gh - .8], [x0 - 2, top + 1.6]])}" fill="${shade(roof, 1.15)}"/>`;
  s += `<path d="M${f(x1 + 1)} ${f(top)}L${f(apex[0])} ${f(apex[1])}" stroke="${shade(roof, .9)}" stroke-width="1.6"/>`;
  s += `<rect x="${f(x - w * .12)}" y="${f(y - h * .5)}" width="${f(w * .24)}" height="${f(h * .5)}" fill="#2a1d12"/>`;
  if (h > 10) s += `<rect x="${f(x0 + w * .16)}" y="${f(top + h * .18)}" width="${f(w * .18)}" height="${f(h * .18)}" fill="${o.win || "#3a2a1a"}"/><rect x="${f(x1 - w * .34)}" y="${f(top + h * .18)}" width="${f(w * .18)}" height="${f(h * .18)}" fill="${o.win2 || "#3a2a1a"}"/>`;
  s += `<rect x="${f(x - w * .08)}" y="${f(top - gh * .55)}" width="${f(w * .16)}" height="${f(gh * .22)}" fill="#2a1d12" opacity=".7"/>`;
  if (o.chim) s += `<rect x="${f(x + D[0] * .6 + w * .1)}" y="${f(top - gh * .8 + D[1] * .6)}" width="2.6" height="${f(gh * .55)}" fill="${shade(wall, .75)}"/>`;
  return s;
}
// квадратна вежа-донжон із зубцями й прапором
function maKeep(x, y, w, h, stone, o = {}){
  const f = MA.f, D = [w * .5, -w * .4], x0 = x - w / 2, x1 = x + w / 2, top = y - h;
  let s = maShadow(x + w * .6 + h * .15, y + 1.5, w + h * .2, w * .3, .32);
  s += `<polygon points="${f(x1)},${f(y)} ${f(x1 + D[0])},${f(y + D[1])} ${f(x1 + D[0])},${f(top + D[1])} ${f(x1)},${f(top)}" fill="${shade(stone, .6)}"/>`;
  s += `<rect x="${f(x0)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="${stone}"/>`;
  s += `<polygon points="${f(x0)},${f(top)} ${f(x1)},${f(top)} ${f(x1 + D[0])},${f(top + D[1])} ${f(x0 + D[0])},${f(top + D[1])}" fill="${shade(stone, .82)}"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${f(x0 + i * w / 3.5)}" y="${f(top - 3)}" width="${f(w / 7)}" height="3" fill="${shade(stone, 1.08)}"/>`;
  for (let i = 0; i < 3; i++) s += `<rect x="${f(x1 + 1 + i * D[0] / 3)}" y="${f(top - 3 + i * D[1] / 3)}" width="${f(D[0] / 6)}" height="3" fill="${shade(stone, .62)}"/>`;
  for (let k = 0; k < Math.floor(h / 12); k++) s += `<rect x="${f(x - 1.5)}" y="${f(top + 6 + k * 12)}" width="3" height="5" fill="${o.win && k === 0 ? o.win : "#1d1812"}"/>`;
  if (o.flag) s += `<path d="M${f(x + D[0] / 2)} ${f(top + D[1] / 2)}v-16" stroke="#2a2218" stroke-width="1.4"/><path d="M${f(x + D[0] / 2)} ${f(top + D[1] / 2 - 16)}h10l-3 3 3 3h-10z" fill="${o.flag}"/>`;
  return s;
}
// собор: довга нава й дзвіниця зі шпилем
function maCathedral(x, y, stone, roof){
  return maHouse(x + 8, y, 30, 15, 13, stone, roof, {nodoor:true, win:"#ffcf6a"}) + maKeep(x - 12, y + 2, 11, 30, stone) + `<path d="M${x - 12.5} ${y - 30}L${x - 6} ${y - 52}L${x + .5} ${y - 30}z" fill="${shade(roof, 1.1)}"/><path d="M${x - 6} ${y - 52}L${x + .5} ${y - 30}L${x + 5} ${y - 34}z" fill="${shade(roof, .6)}"/><circle cx="${x + 8}" cy="${y - 9}" r="2.6" fill="#ffcf6a"/>`;
}
// церква з банями (закарпатська)
function maOnion(x, y, wall, dome){
  const f = MA.f; let s = maHouse(x, y, 20, 13, 12, wall, "#5a3a2a", {nodoor:false});
  const dm = (cx, cy, r) => `<rect x="${f(cx - r * .55)}" y="${f(cy)}" width="${f(r * 1.1)}" height="${f(r * 1.4)}" fill="${shade(wall, .9)}"/><path d="M${f(cx - r)} ${f(cy)}Q${f(cx - r * 1.1)} ${f(cy - r * 1.2)} ${f(cx)} ${f(cy - r * 2)}Q${f(cx + r * 1.1)} ${f(cy - r * 1.2)} ${f(cx + r)} ${f(cy)}z" fill="${dome}"/><path d="M${f(cx)} ${f(cy - r * 2)}Q${f(cx + r * 1.1)} ${f(cy - r * 1.2)} ${f(cx + r)} ${f(cy)}H${f(cx)}z" fill="${shade(dome, .6)}"/><path d="M${f(cx)} ${f(cy - r * 2)}v-5M${f(cx - 2)} ${f(cy - r * 2 - 3)}h4" stroke="#e8c060" stroke-width="1"/>`;
  s += dm(x + 4, y - 24, 6) + dm(x - 6, y - 17, 3.6) + dm(x + 13, y - 17, 3.6);
  return s;
}
// дерев'яна церква з триярусним дахом
function maWoodChurch(x, y){
  const f = MA.f; let s = maShadow(x + 10, y + 1, 18, 4, .3);
  const tier = (cy, w, h) => `<polygon points="${f(x - w)},${f(cy)} ${f(x)},${f(cy - h)} ${f(x)},${f(cy + 1)}" fill="#5a4030"/><polygon points="${f(x + w)},${f(cy)} ${f(x)},${f(cy - h)} ${f(x)},${f(cy + 1)}" fill="#3a2818"/>`;
  s += `<rect x="${f(x - 9)}" y="${f(y - 9)}" width="18" height="9" fill="#7a5a3a"/><rect x="${f(x + 9)}" y="${f(y - 9)}" width="4" height="9" fill="#4e3826"/>`;
  s += tier(y - 9, 13, 8) + `<rect x="${f(x - 5)}" y="${f(y - 21)}" width="10" height="5" fill="#6a4a30"/>` + tier(y - 16, 9, 7) + `<rect x="${f(x - 3)}" y="${f(y - 27)}" width="6" height="4" fill="#6a4a30"/>` + tier(y - 23, 6, 9);
  s += `<path d="M${f(x)} ${f(y - 32)}v-6M${f(x - 2.5)} ${f(y - 36)}h5" stroke="#d9c070" stroke-width="1"/>`;
  return s;
}
function maStall(x, y, c){ const f = MA.f; return maShadow(x + 4, y + 1, 7, 2, .25) + `<rect x="${f(x - 5)}" y="${f(y - 5)}" width="10" height="5" fill="#6a4a2a"/><polygon points="${f(x - 7)},${f(y - 5)} ${f(x + 7)},${f(y - 5)} ${f(x + 5)},${f(y - 10)} ${f(x - 5)},${f(y - 10)}" fill="${c}"/><path d="M${f(x - 5)} ${f(y - 10)}l-2 5M${f(x - 1)} ${f(y - 10)}l-1 5M${f(x + 3)} ${f(y - 10)}v5" stroke="#f2ead6" stroke-width="1.6"/>`; }
function maWell(x, y){ const f = MA.f; return maShadow(x + 3, y + 1, 5, 1.6, .25) + `<ellipse cx="${f(x)}" cy="${f(y)}" rx="4.5" ry="2" fill="#6a6458"/><ellipse cx="${f(x)}" cy="${f(y - 1)}" rx="3" ry="1.2" fill="#1d2a30"/><path d="M${f(x - 4)} ${f(y)}v-8M${f(x + 4)} ${f(y)}v-8M${f(x - 5)} ${f(y - 8)}l5 -3l5 3" stroke="#4a3424" stroke-width="1.4" fill="none"/>`; }
function maFountain(x, y){ const f = MA.f; return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="9" ry="4" fill="#8a8272"/><ellipse cx="${f(x)}" cy="${f(y - .5)}" rx="7" ry="2.8" fill="#3e6a7a"/><rect x="${f(x - 1)}" y="${f(y - 8)}" width="2" height="7" fill="#9a9282"/><path d="M${f(x)} ${f(y - 8)}q-4 2 -5 6M${f(x)} ${f(y - 8)}q4 2 5 6" stroke="#bfe0ea" stroke-width="1" fill="none" opacity=".8"/>`; }
function maHay(x, y){ const f = MA.f; return maShadow(x + 3, y + 1, 5, 1.6, .25) + `<path d="M${f(x - 4)} ${f(y)}Q${f(x - 4)} ${f(y - 9)} ${f(x)} ${f(y - 10)}Q${f(x + 4)} ${f(y - 9)} ${f(x + 4)} ${f(y)}z" fill="#c8a85a"/><path d="M${f(x)} ${f(y - 10)}Q${f(x + 4)} ${f(y - 9)} ${f(x + 4)} ${f(y)}H${f(x)}z" fill="#9a7e3e"/><path d="M${f(x)} ${f(y - 10)}v-3" stroke="#3a2a1a" stroke-width="1"/>`; }
function maGarden(x, y, w, h, r){ const f = MA.f; let s = `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" fill="#5a6a30" opacity=".85"/>`; for (let i = 0; i < 3; i++) s += `<path d="M${f(x - w / 2 + 2)} ${f(y - h / 2 + 2 + i * (h - 4) / 2)}h${f(w - 4)}" stroke="#3a4a1e" stroke-width="1.6" stroke-dasharray="2 2"/>`; s += `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="#5a4028" stroke-width="1" stroke-dasharray="2 1.5"/>`; return s; }

// стіна кільцем: задня половина видна зсередини, передня назовні; зубці, вежі, брами
function maWallRing(cx, cy, rx, ry, o){
  const f = MA.f, N = 44, h = o.h || 9, stone = o.stone, pts = [];
  for (let i = 0; i < N; i++){ const a = i / N * Math.PI * 2, wob = 1 + Math.sin(a * 3 + o.seed) * .04; pts.push([cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob, a]); }
  const angDiff = (a, b) => Math.abs(((a - b + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
  const gateAt = i => o.gates.some(g => angDiff(pts[i][2], g) < .16), gapAt = i => (o.gaps || []).some(g => angDiff(pts[i][2], g) < .2) || (o.water && o.water(pts[i][0], pts[i][1]));
  let back = "", front = "", tb = [], tf = [];
  for (let i = 0; i < N; i++){ const A = pts[i], Bp = pts[(i + 1) % N]; if (gateAt(i) || gateAt((i + 1) % N) || gapAt(i) || gapAt((i + 1) % N)) continue;
    const mx = (A[0] + Bp[0]) / 2, my = (A[1] + Bp[1]) / 2, nx = (mx - cx) / rx, ny = (my - cy) / ry, nl = Math.hypot(nx, ny), isFront = my > cy;
    const lit = isFront ? .7 + .32 * Math.max(0, -nx / nl) : .78 + .2 * Math.max(0, nx / nl);
    const q = `<polygon points="${f(A[0])},${f(A[1])} ${f(Bp[0])},${f(Bp[1])} ${f(Bp[0])},${f(Bp[1] - h)} ${f(A[0])},${f(A[1] - h)}" fill="${shade(stone, lit)}"/>`;
    const top = `<path d="M${f(A[0])} ${f(A[1] - h)}L${f(Bp[0])} ${f(Bp[1] - h)}" stroke="${shade(stone, 1.15)}" stroke-width="2.4"/>`;
    let mer = ""; if (isFront) for (let t = .15; t < 1; t += .34) mer += `<rect x="${f(A[0] + (Bp[0] - A[0]) * t - 1.2)}" y="${f(A[1] + (Bp[1] - A[1]) * t - h - 3)}" width="2.4" height="3" fill="${shade(stone, 1.05)}"/>`;
    if (isFront) front += q + top + mer; else back += q + top; }
  // вежі
  for (let i = 0; i < N; i++){ const p = pts[i], g = gateAt(i) && (!gateAt((i + 1) % N) || !gateAt((i + N - 1) % N));
    if ((i % 6 === 0 && !gateAt(i) && !gapAt(i)) || g){ const t = maTower(p[0], p[1] + 1, g ? 5.4 : 4.6, g ? 19 : 15, stone, o.roof, {flat:!g && i % 12 === 0, rh:g ? 10 : 8}); (p[1] > cy ? tf : tb).push([p[1], t]); } }
  // арки брам
  for (const ga of o.gates){ const gx = cx + Math.cos(ga) * rx, gy = cy + Math.sin(ga) * ry; if (o.water && o.water(gx, gy)) continue; const arch = `<path d="M${f(gx - 5)} ${f(gy)}v-6a5 5 0 0 1 10 0v6" fill="none" stroke="${shade(stone, .55)}" stroke-width="2.6"/>`; (gy > cy ? tf : tb).push([gy - .5, arch]); }
  tb.sort((a, b) => a[0] - b[0]); tf.sort((a, b) => a[0] - b[0]);
  return {back:back + tb.map(t => t[1]).join(""), front:front + tf.map(t => t[1]).join("")};
}
const CITY_STYLE = {
  kaballon:{moat:1, rx:112, ry:64, stone:"#a89c84", roofs:["#9a3a24","#8a4a2a","#a8582e","#7a3a26","#b06a36"], walls:["#e2d6b8","#d6c8a6","#cbbd9c","#e8dcc0"], ground:"#8e8470", sub:["#cbbd9c","#d6c8a6"]},
  spire:{rx:96, ry:56, stone:"#6e675c", roofs:["#3e3632","#4a3a32","#34302c","#5a4436"], walls:["#8e867a","#7e776c","#9a9284"], ground:"#5a564c", gaps:[-.9, -.75], sub:["#7e776c"]},
  uzhgorod:{rx:104, ry:60, stone:"#b0a48a", roofs:["#a03a26","#8a3424","#b0502c","#7a4a2a"], walls:["#ece0c4","#e0d2b2","#d6c8a6"], ground:"#8a8270", sub:["#d6c8a6","#cbbd9c"]},
  mukachevo:{rx:98, ry:58, stone:"#a69a82", roofs:["#9a4026","#8a3a24","#a85a30","#6a3a26"], walls:["#e6dabd","#d8caa8","#cdbf9e"], ground:"#8a8270", sub:["#d8caa8","#cbbd9c"]},
};
function maCityPro(id, water){
  const n = NODES[id], C = CITY_STYLE[id] || CITY_STYLE.kaballon, r = rng("city-" + id), f = MA.f, pk = a => MA.pk(r, a);
  const cx = n.x, cy = n.y - 8, rx = C.rx, ry = C.ry;
  const gates = ROADS.filter(rd => rd.a === id || rd.b === id).map(rd => Math.atan2(rd.cy - n.y, rd.cx - n.x));
  const wet = water ? (x, y) => water.hit(x, y, 3) : null;
  let s = "";
  // земля міста: вимощена й утоптана
  s += `<ellipse cx="${cx}" cy="${cy + 3}" rx="${rx + 30}" ry="${ry + 20}" fill="#5a4a32" opacity=".16"/><ellipse cx="${cx}" cy="${cy + 2}" rx="${rx + 14}" ry="${ry + 10}" fill="#6a5a3e" opacity=".2"/>`;
  if (C.moat){ s += `<ellipse cx="${cx}" cy="${cy + 1}" rx="${rx + 9}" ry="${ry + 7}" fill="none" stroke="#18242c" stroke-width="9"/><ellipse cx="${cx}" cy="${cy + 1}" rx="${rx + 9}" ry="${ry + 7}" fill="none" stroke="#2e4858" stroke-width="6"/><ellipse cx="${cx - 1}" cy="${cy}" rx="${rx + 9}" ry="${ry + 7}" fill="none" stroke="#6a90a0" stroke-width="1" stroke-dasharray="8 22" opacity=".6"/>`; }
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.ground}"/><ellipse cx="${cx - rx * .1}" cy="${cy - ry * .08}" rx="${rx * .8}" ry="${ry * .78}" fill="${shade(C.ground, 1.1)}" opacity=".6"/>`;
  if (water && water.svg && (() => { for (let yy = -ry; yy <= ry; yy += 8) for (let xx = -rx; xx <= rx; xx += 8) if ((xx / rx) ** 2 + (yy / ry) ** 2 <= 1 && wet(cx + xx, cy + yy)) return true; return false; })())
    s += `<clipPath id="cw-${id}"><ellipse cx="${cx}" cy="${cy}" rx="${rx + 2}" ry="${ry + 2}"/></clipPath><g clip-path="url(#cw-${id})">${water.svg}</g>`;
  let cob = ""; for (let i = 0; i < 260; i++){ const a = r() * Math.PI * 2, d = Math.sqrt(r()); cob += `M${f(cx + Math.cos(a) * rx * .94 * d)} ${f(cy + Math.sin(a) * ry * .94 * d)}h1.6`; } s += `<path d="${cob}" stroke="${shade(C.ground, .75)}" stroke-width="1.4" opacity=".6"/>`;
  // передмістя: північна половина малюється до мурів, південна після
  const subN = [], subS = [];
  for (let i = 0; i < 22; i++){ const a = r() * Math.PI * 2; if (gates.some(g => Math.abs(((a - g + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < .22)) continue; const d = 1.12 + r() * .38, x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
    if (wet && wet(x, y)) continue; const it = r() < .6 ? maHouse(x, y, 9 + r() * 4, 6 + r() * 2, 6 + r() * 2, pk(C.sub), pk(C.roofs), {win:r() < .25 ? "#ffd27a" : null}) : r() < .5 ? maGarden(x, y, 16, 9, r) : maTree(x, y, 3.6 + r() * 1.5, "leaf", "#4a6a2e");
    (y < cy ? subN : subS).push([y, it]); }
  subN.sort((a, b) => a[0] - b[0]); subS.sort((a, b) => a[0] - b[0]);
  s += subN.map(v => v[1]).join("");
  const W = maWallRing(cx, cy, rx, ry, {h:10, stone:C.stone, roof:pk(C.roofs), gates, gaps:C.gaps, water:wet, seed:r() * 6});
  s += W.back;
  // вулиці від брам до площі
  const pr = rx * .2, bridges = [], streetX = [];
  const items = [], foot = [];
  const put = (x, y, rad, svg) => { items.push([y, svg]); foot.push([x, y, rad]); };
  if (id === "kaballon"){ put(cx - 10, cy - 30, 26, maCathedral(cx - 10, cy - 30, "#d8ccb0", "#4a5a6a")); put(cx + 52, cy - 8, 20, maHouse(cx + 52, cy - 8, 30, 14, 13, "#ece2c8", "#3a5a7a", {nodoor:true, win:"#ffcf6a"}) + maTower(cx + 36, cy - 6, 4.6, 24, "#ece2c8", "#3a5a7a") + maTower(cx + 69, cy - 4, 4.6, 24, "#ece2c8", "#3a5a7a")); }
  if (id === "spire"){ put(cx - 4, cy - 24, 22, `<ellipse cx="${cx - 4}" cy="${cy - 70}" rx="18" ry="30" fill="#ffb84a" opacity=".12"/>` + maTower(cx - 4, cy - 24, 10, 78, "#4a443e", "#1e1a18", {win:"#ffb84a", rh:46}) + `<rect x="${cx - 6}" y="${cy - 80}" width="4" height="7" fill="#ffd27a"/><rect x="${cx - 6}" y="${cy - 56}" width="4" height="6" fill="#ffb84a" opacity=".8"/>`);
    for (let i = 0; i < 6; i++){ const a = -.9 + i * .05; const x = cx + Math.cos(a) * rx * (1 + r() * .1), y = cy + Math.sin(a) * ry; items.push([y, maRock(x, y, 3 + r() * 3)]); } }
  if (id === "uzhgorod"){ put(cx + 48, cy - 22, 24, `<g transform="translate(94 -2)">` + `<ellipse cx="${cx - 44}" cy="${cy - 16}" rx="28" ry="12" fill="#6a6450"/>` + maKeep(cx - 46, cy - 20, 14, 26, "#c0b49a", {flag:"#3a6aaa", win:"#ffcf6a"}) + maTower(cx - 60, cy - 14, 4.6, 16, "#c0b49a", "#7a3a26", {flat:true}) + maTower(cx - 30, cy - 12, 4.6, 16, "#c0b49a", "#7a3a26", {flat:true}) + `</g>`); put(cx - 36, cy - 30, 18, `<g transform="translate(-62 -4)">` + maOnion(cx + 26, cy - 26, "#f2ead6", "#4a8a5a") + `</g>`); }
  if (id === "mukachevo"){ put(cx + 4, cy - 30, 18, maHouse(cx + 4, cy - 30, 24, 13, 12, "#efe4c8", "#8a3424", {nodoor:true, win:"#ffcf6a"}) + maKeep(cx - 10, cy - 28, 9, 30, "#efe4c8", {}) + `<path d="M${cx - 10.5} ${cy - 58}L${cx - 6} ${cy - 74}L${cx - 1} ${cy - 58}z" fill="#3a6a5a"/><circle cx="${cx - 6}" cy="${cy - 46}" r="2.6" fill="#e8d8a0" stroke="#3a2a1a" stroke-width=".8"/>`); put(cx + 42, cy - 18, 16, maOnion(cx + 42, cy - 18, "#f2ead6", "#c09a30")); }
  let qx = cx, qy = cy; if (wet || foot.some(([fx, fy, fr]) => Math.hypot(cx - fx, (cy - fy) * 1.4) < fr + pr + 6)){ let bd = 1e9; for (let yy = -ry * .5; yy <= ry * .5; yy += 6) for (let xx = -rx * .55; xx <= rx * .55; xx += 6){ const x = cx + xx, y = cy + yy, d = Math.hypot(xx, yy * 1.6); if (d >= bd) continue; let ok = true; if (wet) for (let a = 0; a < 6.28 && ok; a += .5) for (const k of [0, .5, 1]) if (wet(x + Math.cos(a) * (pr + 14) * k, y + Math.sin(a) * (pr * .62 + 10) * k)){ ok = false; break; } if (ok && !foot.some(([fx, fy, fr]) => Math.hypot(x - fx, (y - fy) * 1.4) < fr + pr + 6)){ bd = d; qx = x; qy = y; } } }
  for (const g of gates){ const gx = cx + Math.cos(g) * rx, gy = cy + Math.sin(g) * ry, sx = qx + Math.cos(g) * pr, sy = qy + Math.sin(g) * pr * .6;
    s += `<path d="M${f(gx)} ${f(gy)}L${f(sx)} ${f(sy)}" stroke="#4a463c" stroke-width="8" stroke-linecap="round" opacity=".7"/><path d="M${f(gx)} ${f(gy)}L${f(sx)} ${f(sy)}" stroke="#a49c8a" stroke-width="5.5" stroke-linecap="round"/><path d="M${f(gx)} ${f(gy)}L${f(sx)} ${f(sy)}" stroke="#7a7466" stroke-width="5.5" stroke-dasharray="1.5 2.5" opacity=".6"/>`;
    if (wet){ let a0 = -1, a1 = -1; for (let k = 0; k <= 40; k++){ const t = k / 40; if (wet(gx + (sx - gx) * t, gy + (sy - gy) * t)){ if (a0 < 0) a0 = t; a1 = t; } }
      if (a0 >= 0){ const tm = (a0 + a1) / 2, L = Math.hypot(sx - gx, sy - gy) * (a1 - a0) + 18; bridges.push(maBridge(gx + (sx - gx) * tm, gy + (sy - gy) * tm, Math.atan2(sy - gy, sx - gx), L, true)); } }
    if (C.moat) bridges.push(maBridge(cx + Math.cos(g) * (rx + 9), cy + 1 + Math.sin(g) * (ry + 7), Math.atan2(Math.sin(g) * ry, Math.cos(g) * rx), 18, true)); }
  const crossT = (ax, ay, bx, by) => { let a0 = -1, a1 = -1; if (wet) for (let k = 0; k <= 40; k++){ const t = k / 40; if (wet(ax + (bx - ax) * t, ay + (by - ay) * t)){ if (a0 < 0) a0 = t; a1 = t; } } return [a0, a1]; };
  if ((qx !== cx || qy !== cy) && crossT(qx, qy, cx + (cx - qx) * .9, cy + (cy - qy) * .9)[0] >= 0){ const tx = cx + (cx - qx) * .9, ty = cy + (cy - qy) * .9, ex = qx + (tx - qx) * .25, ey = qy + (ty - qy) * .25;
    s += `<path d="M${f(ex)} ${f(ey)}L${f(tx)} ${f(ty)}" stroke="#4a463c" stroke-width="8" stroke-linecap="round" opacity=".7"/><path d="M${f(ex)} ${f(ey)}L${f(tx)} ${f(ty)}" stroke="#a49c8a" stroke-width="5.5" stroke-linecap="round"/>`;
    gates.push(Math.atan2(ty - cy, tx - cx) + 100);
    if (wet){ let a0 = -1, a1 = -1; for (let k = 0; k <= 40; k++){ const t = k / 40; if (wet(ex + (tx - ex) * t, ey + (ty - ey) * t)){ if (a0 < 0) a0 = t; a1 = t; } }
      if (a0 >= 0){ const tm = (a0 + a1) / 2, L = Math.hypot(tx - ex, ty - ey) * (a1 - a0) + 18; bridges.push(maBridge(ex + (tx - ex) * tm, ey + (ty - ey) * tm, Math.atan2(ty - ey, tx - ex), L, true)); } }
    streetX.push([ex, ey, tx, ty]); }
  s += bridges.join("");
  s += `<ellipse cx="${f(qx)}" cy="${f(qy)}" rx="${f(pr + 6)}" ry="${f(pr * .62 + 4)}" fill="#4a463c" opacity=".6"/><ellipse cx="${f(qx)}" cy="${f(qy)}" rx="${f(pr + 4)}" ry="${f(pr * .62 + 2)}" fill="#b4ac98"/>`;
  let pz = ""; for (let i = 0; i < 70; i++){ const a = r() * Math.PI * 2, d = Math.sqrt(r()); pz += `M${f(qx + Math.cos(a) * pr * d)} ${f(qy + Math.sin(a) * pr * .6 * d)}h1.4`; } s += `<path d="${pz}" stroke="#8a8474" stroke-width="1.2"/>`;
  // що стоїть у місті
  // площа: фонтан і ринкові ряди
  items.push([qy - 2, maFountain(qx - 12, qy - 2)]);
  const SC = ["#c0503a","#3a6a9a","#d9a441","#5a8a4a","#a04a8a"];
  for (let i = 0; i < 5; i++){ const a = Math.PI * .15 + i * .55, x = qx + Math.cos(a) * pr * .95, y = qy + Math.sin(a) * pr * .6 + 2; items.push([y, maStall(x, y, SC[i])]); }
  // будинки кварталами між вулицями
  const segD = (x, y, ax, ay, bx, by) => { const vx = bx - ax, vy = by - ay, t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy))); return Math.hypot(x - ax - vx * t, y - ay - vy * t); };
  const onStreet = (x, y) => streetX.some(q => segD(x, y, ...q) < 9) || gates.filter(g => g < 50).some(g => { const gx = cx + Math.cos(g) * rx, gy = cy + Math.sin(g) * ry, sx = qx + Math.cos(g) * pr, sy = qy + Math.sin(g) * pr * .6, vx = gx - sx, vy = gy - sy, t = Math.max(0, Math.min(1, ((x - sx) * vx + (y - sy) * vy) / (vx * vx + vy * vy))); return Math.hypot(x - sx - vx * t, y - sy - vy * t) < 9; });
  for (let y = cy - ry * .9; y < cy + ry * .95; y += 11) for (let x = cx - rx * .92; x < cx + rx * .92; x += 15){ const px = x + (r() * 2 - 1) * 3.5, py = y + (r() * 2 - 1) * 2.5;
    if (((px - cx) / (rx * .86)) ** 2 + ((py - cy) / (ry * .8)) ** 2 > 1) continue; if (((px - qx) / (pr + 12)) ** 2 + ((py - qy) / (pr * .62 + 10)) ** 2 < 1) continue;
    if (onStreet(px, py) || foot.some(([fx, fy, fr]) => Math.hypot(px - fx, (py - fy) * 1.4) < fr) || (wet && wet(px, py)) || r() < .08) continue;
    const tall = r() < .3, w = 10 + r() * 5, h = tall ? 12 + r() * 4 : 8 + r() * 3, d = 7 + r() * 3, wl = pk(C.walls), rf = pk(C.roofs), lit = r() < .35 ? "#ffd27a" : null;
    items.push([py, r() < .5 ? maHouseG(px, py, w, h, d, wl, rf, {win:lit, chim:r() < .5}) : maHouse(px, py, w, h, d, wl, rf, {win:lit})]); }
  items.sort((a, b) => a[0] - b[0]);
  s += items.map(v => v[1]).join("") + W.front + subS.map(v => v[1]).join("");
  if (id === "mukachevo"){ const RP = ROADS.flatMap(rd => roadPts(rd, 50)); let best = null, bs = -1;
    for (let i = 0; i < 36; i++){ const a = i / 36 * Math.PI * 2, x = cx + Math.cos(a) * (rx + 70), y = cy + Math.sin(a) * (ry + 46); if (wet && water.hit(x, y, 40)) continue; if (Object.values(NODES).some(m => Math.hypot(m.x - x, m.y - y) < 80)) continue;
      const sc = Math.min(...RP.map(([px, py]) => Math.hypot(px - x, py - y))); if (sc > bs){ bs = sc; best = [x, y]; } }
    const [hx, hy] = best || [cx + rx + 54, cy - 34]; s += maHill(hx, hy + 14, 50, 30, "#5a6a3a") + maRock(hx - 30, hy + 12, 6) + maRock(hx + 26, hy + 10, 5) + `<ellipse cx="${hx}" cy="${hy - 6}" rx="30" ry="12" fill="none" stroke="#9a8e76" stroke-width="5"/>` + maTower(hx - 22, hy - 4, 4.4, 14, "#b4a88e", "#6a3a26", {flat:true}) + maKeep(hx + 2, hy - 4, 13, 24, "#b4a88e", {flag:"#c0a030"}) + maTower(hx + 24, hy - 2, 4.4, 14, "#b4a88e", "#6a3a26"); }
  return s;
}
// село або містечко: хати, церква, криниця, тини, стоги, городи
function maTownPro(id, x, y, n, r, o, water){
  const f = MA.f, zak = NODES[id].r === "zak", items = [];
  const roofs = zak ? ["#5a4030","#4a3a2a","#6a3a26","#3a4a5a"] : ["#8a3a26","#7a4a2a","#9a5a30","#6a3a2a"], walls = zak ? ["#e8e0cc","#d8ccb0","#c8b898"] : MA_WALL;
  for (let i = 0; i < n; i++){ const a = r() * Math.PI * 2, rr = 12 + r() * 30, px = x + Math.cos(a) * rr * 1.35, py = y + Math.sin(a) * rr * .7; if (Math.hypot(px - x, (py - y) * 1.6) < 12 || (water && water.hit(px, py, 6))) continue;
    items.push([py, r() < .45 ? maHouseG(px, py, 9 + r() * 4, 7 + r() * 3, 6 + r() * 2, o.wall || MA.pk(r, walls), o.roof || MA.pk(r, roofs), {chim:r() < .5, win:r() < .3 ? "#ffd27a" : null}) : maHouse(px, py, 10 + r() * 4, 6 + r() * 3, 6 + r() * 3, o.wall || MA.pk(r, walls), o.roof || MA.pk(r, roofs), {win:r() < .3 ? "#ffd27a" : null})]); }
  if (!o.noChurch) items.push([y - 22, zak ? maWoodChurch(x - 4, y - 22) : maHouse(x - 4, y - 22, 14, 9, 10, "#e6dcc4", "#4a5a6a", {nodoor:true}) + maTower(x - 13, y - 20, 3.4, 18, "#e6dcc4", "#4a5a6a")]);
  items.push([y + 10, maWell(x + 14, y + 10)]);
  for (let i = 0; i < 3; i++){ const a = r() * Math.PI * 2, px = x + Math.cos(a) * 52, py = y + Math.sin(a) * 26; items.push([py, r() < .5 ? maHay(px, py) : maGarden(px, py, 15, 8, r)]); }
  for (let i = 0; i < 4; i++){ const a = r() * Math.PI * 2, px = x + Math.cos(a) * 46, py = y + Math.sin(a) * 24; items.push([py, maTree(px, py, 3.6 + r() * 1.4, "leaf", zak ? "#3e5a2a" : "#4a6a2e")]); }
  items.sort((a, b) => a[0] - b[0]);
  return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="58" ry="30" fill="#6a5a3e" opacity=".16"/>` + items.map(v => v[1]).join("");
}

/* ---------- діорами локацій ---------- */
const MA_ROOF = ["#8a3a26","#7a4a2a","#6a3a2a","#9a5a30","#5a4a3a"], MA_WALL = ["#d8ccb0","#cbbd9c","#bfb398","#d2c4a2"];
function maVillage(x, y, n, r, o = {}){
  const items = [];
  for (let i = 0; i < n; i++){ const a = r() * Math.PI * 2, rr = 8 + r() * (o.spread || 22);
    items.push([x + Math.cos(a) * rr * 1.3, y + Math.sin(a) * rr * .65, i]); }
  items.sort((a, b) => a[1] - b[1]);
  return items.map(([hx, hy]) => maHouse(hx, hy, 9 + r() * 5, 6 + r() * 3, 6 + r() * 3, o.wall || MA.pk(r, MA_WALL), o.roof || MA.pk(r, MA_ROOF), {win:r() < .3 ? "#ffd27a" : null})).join("");
}
function maCity(x, y, r, o = {}){
  const W = maWalls(x, y, o.rx || 44, o.ry || 24, o.stone || "#8e8676", o.roof || "#6a3a2a", r);
  const back = W.towers.filter((_, i) => i < 3).join(""), front = W.towers.filter((_, i) => i >= 3).join("");
  const houses = []; for (let i = 0; i < (o.n || 11); i++){ const a = r() * Math.PI * 2, rr = Math.sqrt(r()); houses.push([x + Math.cos(a) * rr * (o.rx || 44) * .72, y + Math.sin(a) * rr * (o.ry || 24) * .62]); }
  houses.sort((a, b) => a[1] - b[1]);
  let mid = ""; const keepAt = o.keep ? houses.length >> 1 : -1;
  houses.forEach(([hx, hy], i) => { mid += i === keepAt ? o.keep(hx, hy) : maHouse(hx, hy, 9 + r() * 5, 7 + r() * 4, 6 + r() * 3, o.wall || MA.pk(r, MA_WALL), o.roofs ? MA.pk(r, o.roofs) : MA.pk(r, MA_ROOF), {win:r() < .4 ? "#ffd27a" : null}); });
  return W.back + back + mid + front;
}
function maDiorama(id, r, water){
  const n = NODES[id], sc = SCENE[id] || {}, X = sc.x || [], b = sc.b || "", x = n.x, y = n.y;
  if (n.kind === "city") return maCityPro(id, water);
  const has = k => X.includes(k);
  let s = "", g = "";   // g — дрібниці навколо
  const ring = (k, rad = 26) => { const a = r() * Math.PI * 2; return [x + Math.cos(a) * rad * (1 + r() * .4), y + Math.sin(a) * rad * .55 * (1 + r() * .4)]; };
  // рослинність і земля довкола за біомом
  const trees = (cnt, kind, col, rad = 30) => { const arr = []; for (let i = 0; i < cnt; i++) arr.push(ring(0, rad)); arr.sort((a, b2) => a[1] - b2[1]); return arr.map(([tx, ty]) => maTree(tx, ty, 3.2 + r() * 1.8, kind, col)).join(""); };
  if (b === "forest") g += trees(9, "pine", "#2f4a28", 30);
  if (b === "meadow") g += trees(4, "leaf", "#4a6a2e", 34);
  if (b === "dark") g += trees(6, "dead", "", 30);
  if (b === "ash") g += trees(3, "dead", "", 30);
  if (b === "snow") for (let i = 0; i < 3; i++){ const [px, py] = ring(0, 30); g += maPeak(px, py - 6, 9 + r() * 6, true); }
  if (b === "swamp" || b === "bog"){ for (let i = 0; i < 4; i++){ const [px, py] = ring(0, 28); g += maPool(px, py, 7 + r() * 8, 3 + r() * 2.5); } for (let i = 0; i < 5; i++){ const [px, py] = ring(0, 30); g += maReeds(px, py, 4, r); } }
  if (b === "polonyna") g += trees(3, "pine", "#3a5a30", 34);
  if (b === "vineyard") for (let i = 0; i < 5; i++) g += `<path d="M${MA.f(x - 34 + i * 6)} ${MA.f(y + 8 - i * 2)}l30 -14" stroke="#4e6a2a" stroke-width="2.6" stroke-dasharray="2 3"/>`;
  if (b === "battle") for (let i = 0; i < 7; i++){ const [px, py] = ring(0, 30); g += `<path d="M${MA.f(px)} ${MA.f(py)}l${MA.f(r() * 8 - 4)} -12" stroke="#2a2218" stroke-width="1.4"/>`; }
  if (b === "bone") for (let i = 0; i < 4; i++){ const [px, py] = ring(0, 30); g += maCross(px, py, .7 + r() * .3); }
  // головне: що стоїть на місці
  const dx = x - 4, dy = y - 12;
  if (n.kind === "city"){
    if (has("spire")) s += maCity(dx, dy, r, {rx:40, ry:22, n:9, stone:"#6e675c", roofs:["#4a3a32","#5a3a2a","#3a3230"], keep:(hx, hy) => maTower(hx, hy, 6, 34, "#5a544c", "#2a2420", {win:"#ffb84a", rh:20})});
    else if (has("castle")) s += maCity(dx, dy, r, {rx:46, ry:24, n:10, keep:(hx, hy) => maTower(hx - 8, hy, 6, 22, "#a69a82", "#6a3a2a", {flat:true}) + maTower(hx + 8, hy + 3, 6, 18, "#a69a82", "#6a3a2a")});
    else s += maCity(dx, dy, r, {rx:48, ry:25, n:12, keep:(hx, hy) => maHouse(hx, hy, 16, 10, 10, "#e2d6b8", "#6a3a2a", {nodoor:true}) + maTower(hx + 10, hy - 1, 3.4, 18, "#e2d6b8", "#4a5a6a")});
  } else if (has("stilts")){
    s += maPool(dx, dy + 4, 40, 15, "#1d2e30");
    const hs = [[-18, -2], [4, -6], [20, 2], [-4, 8]]; for (const [hx, hy] of hs){ s += `<path d="M${MA.f(dx + hx - 4)} ${MA.f(dy + hy + 6)}v-6M${MA.f(dx + hx + 4)} ${MA.f(dy + hy + 6)}v-6" stroke="#3a2a1a" stroke-width="1.6"/>` + maHouse(dx + hx, dy + hy, 10, 6, 6, "#7a6a50", "#5a4a30"); }
  } else if (has("tents") || has("camp_dawn") || has("camp_night") || has("camp_small")){
    const col = has("camp_dawn") ? ["#e8dcb0","#d0c090"] : has("camp_night") ? ["#3a2a4a","#4a3a5a"] : ["#a89070","#8a6a4a","#7a8a5a"];
    if (has("palisade")) s += `<ellipse cx="${dx}" cy="${dy}" rx="38" ry="20" fill="none" stroke="#3a2a1a" stroke-width="5" stroke-dasharray="3 1.5"/><ellipse cx="${dx}" cy="${dy - 2}" rx="38" ry="20" fill="none" stroke="#6a4a2a" stroke-width="3" stroke-dasharray="3 1.5"/>`;
    const pts = [[-16, -4], [10, -8], [-2, 6], [20, 4], [-24, 6]].slice(0, has("camp_small") ? 2 : 5); pts.sort((a, b2) => a[1] - b2[1]);
    for (const [tx, ty] of pts) s += maTent(dx + tx, dy + ty, 12, 10, MA.pk(r, col));
    if (has("camp_dawn")) s += maFlag(dx + 26, dy - 4, "#e8dcb0", "#c9a24a"); if (has("camp_night")) s += maFlag(dx + 26, dy - 4, "#3a2a4a", "#c0a6e0");
    s += `<circle cx="${dx + 2}" cy="${dy + 1}" r="2.4" fill="#ff9a3a"/><circle cx="${dx + 2}" cy="${dy + 1}" r="5" fill="#ff9a3a" opacity=".25"/>`;
  } else if (has("village") || has("dead_village") || has("sunk_houses")){
    s += has("dead_village") || has("sunk_houses") ? maVillage(dx, dy, 5, r, has("dead_village") ? {roof:"#3a342c", wall:"#8a8270"} : {roof:"#3a3a2a", wall:"#6a6a58"}) : maTownPro(id, dx, dy, n.kind === "town" ? 9 : 6, r, {noChurch:n.kind !== "town" || has("watchtower")}, water);
    if (has("sunk_houses")) s = maPool(dx, dy + 2, 40, 14) + s;
    if (has("tower")) s += maTower(dx + 24, dy - 2, 5, 26, "#9a8e78", "#4a3a5a", {win:"#cf9fff"});
    if (has("castle_ruin")) s += maRuin(dx - 26, dy + 2, 18, 14);
    if (has("watchtower")) s += maTower(dx + 26, dy, 4, 22, "#7a6a50", "#5a3a2a", {flat:true});
    if (has("palisade")) s = `<ellipse cx="${dx}" cy="${dy}" rx="42" ry="22" fill="none" stroke="#3a2a1a" stroke-width="5" stroke-dasharray="3 1.5"/>` + s;
    if (has("spring")) s += maPool(dx - 22, dy + 10, 7, 3, "#2e5a6a");
  } else if (has("tavern")) s += maHouse(dx, dy, 22, 11, 12, "#bfa784", "#6a3a26", {win:"#ffd27a"}) + `<path d="M${dx + 12} ${dy - 14}v-6" stroke="#2a2218" stroke-width="1.4"/><rect x="${dx + 9}" y="${dy - 20}" width="7" height="5" fill="#d9a441"/>`;
  else if (has("forge")) s += maHouse(dx, dy, 18, 9, 10, "#8a7a68", "#3a3230") + `<rect x="${dx + 4}" y="${dy - 24}" width="4" height="10" fill="#5a4e44"/><circle cx="${dx + 6}" cy="${dy - 28}" r="4" fill="#9a9a9a" opacity=".35"/><circle cx="${dx + 9}" cy="${dy - 34}" r="5" fill="#9a9a9a" opacity=".25"/>`;
  else if (has("mill") || has("bone_mill")){ const bone = has("bone_mill"); s += maTower(dx, dy, 7, 20, bone ? "#cfc6ae" : "#bfae8a", bone ? "#3a3430" : "#6a3a26", {rh:10}); s += `<g transform="translate(${dx},${dy - 22})"><path d="M0 0L-16 -12M0 0L14 -14M0 0L14 12M0 0L-13 13" stroke="${bone ? "#e6dcc4" : "#5a4632"}" stroke-width="2.6"/></g>`; }
  else if (has("bridge") || has("gallows_bridge")){ s += `<path d="M${dx - 22} ${dy + 4}q22 -12 44 0" stroke="#3a2a1a" stroke-width="7" fill="none"/><path d="M${dx - 22} ${dy + 2}q22 -12 44 0" stroke="#8a6a44" stroke-width="4" fill="none"/>`; if (has("gallows_bridge")) s += `<path d="M${dx + 8} ${dy - 8}v-18h10v4" stroke="#2a2218" stroke-width="2" fill="none"/><path d="M${dx + 18} ${dy - 22}v6" stroke="#9a8a6a" stroke-width="1"/>`; }
  else if (has("ruins") || has("ruins_big")) s += maRuin(dx - 10, dy, has("ruins_big") ? 24 : 16, has("ruins_big") ? 20 : 13) + maRuin(dx + 14, dy + 6, 12, 9);
  else if (has("citadel") || has("keep") || has("bonecastle") || has("necro_tower") || has("ossuary_b")){
    const bone = has("bonecastle") || has("ossuary_b"), c = bone ? "#cfc6ae" : "#3a3440", rf = bone ? "#4a4038" : "#1e1a24";
    if (has("necro_tower")) s += maTower(dx, dy, 6, 34, "#3a3440", "#1e1a24", {win:"#ff3a6a", rh:16});
    else if (has("ossuary_b")) s += maHouse(dx, dy, 22, 12, 12, "#cfc6ae", "#3a3430") + maTower(dx - 12, dy - 1, 4, 18, "#cfc6ae", "#3a3430");
    else s += maTower(dx - 14, dy - 4, 5, 22, c, rf, {flat:true}) + maHouse(dx, dy, 18, 14, 12, c, rf, {nodoor:true, win:"#ff3a6a"}) + maTower(dx + 14, dy + 2, 5, 26, c, rf, {win:"#ff5a3a"});
  }
  else if (has("chapel") || has("monastery") || has("cathedral") || has("abbey")){
    const ruin = has("cathedral") || has("abbey"); const c = has("cathedral") ? "#cfc2a0" : has("abbey") ? "#6a6a58" : has("monastery") ? "#cfc6ae" : "#4a4440";
    if (has("abbey")) s += maPool(dx, dy + 4, 34, 12);
    s += maHouse(dx, dy, 20, 11, 14, c, ruin ? "#3a3430" : "#5a3a2a") + maTower(dx - 14, dy - 2, 4, 24, c, ruin ? "#3a3430" : "#4a4a5a", {rh:12});
    if (has("monastery")) s += `<ellipse cx="${dx}" cy="${dy}" rx="34" ry="17" fill="none" stroke="#8a8270" stroke-width="3"/>`;
    if (has("graves")) for (let i = 0; i < 4; i++) s += maGrave(dx + 16 + i * 6, dy + 8 + (i % 2) * 4);
  }
  else if (has("graves")) for (let i = 0; i < 7; i++) s += maGrave(dx - 18 + (i % 4) * 11, dy - 4 + Math.floor(i / 4) * 9);
  else if (has("crosses") || has("barrow")){ if (has("barrow")) s += `<ellipse cx="${dx}" cy="${dy + 2}" rx="26" ry="11" fill="#4a4636"/><ellipse cx="${dx - 4}" cy="${dy - 1}" rx="20" ry="8" fill="#6a6450"/>`; for (let i = 0; i < 5; i++) s += maCross(dx - 18 + i * 9, dy + (i % 2) * 6, .9); }
  else if (has("bone_wall")) s += `<path d="M${dx - 34} ${dy + 6}L${dx - 10} ${dy - 4}L${dx + 14} ${dy + 2}L${dx + 34} ${dy - 6}" stroke="#4a4436" stroke-width="9" fill="none"/><path d="M${dx - 34} ${dy + 3}L${dx - 10} ${dy - 7}L${dx + 14} ${dy - 1}L${dx + 34} ${dy - 9}" stroke="#cfc6ae" stroke-width="6" fill="none" stroke-dasharray="7 2"/>`;
  else if (has("cave") || has("mine")) s += `<path d="M${dx - 22} ${dy + 6}Q${dx - 14} ${dy - 22} ${dx} ${dy - 24}Q${dx + 18} ${dy - 22} ${dx + 24} ${dy + 6}z" fill="#6a665c"/><path d="M${dx} ${dy - 24}Q${dx + 18} ${dy - 22} ${dx + 24} ${dy + 6}H${dx + 6}z" fill="#4a4740"/><path d="M${dx - 7} ${dy + 6}v-8a7 7 0 0 1 14 0v8z" fill="#120e0a"/>`;
  else if (has("koliba")) s += maHouse(dx, dy, 13, 6, 8, "#7a5a3a", "#4a3a2a");
  else if (has("hut") || has("coven_hut")) s += maHouse(dx, dy, 13, 7, 8, has("coven_hut") ? "#5a5040" : "#a08a68", has("coven_hut") ? "#2a2a1a" : "#6a5030", {win:has("coven_hut") ? "#9aff6a" : null});
  else if (has("lists")) s += `<rect x="${dx - 28}" y="${dy - 4}" width="56" height="2.4" fill="#6a4a2a"/><rect x="${dx - 28}" y="${dy + 6}" width="56" height="2.4" fill="#6a4a2a"/>` + maTent(dx - 30, dy - 8, 12, 12, "#e8dcb0") + maTent(dx + 30, dy - 8, 12, 12, "#3a2a4a");
  else if (has("banners_hill") || has("banners2")) for (let i = 0; i < 5; i++){ const dawn = i % 2 === 0; s += maFlag(dx - 20 + i * 10, dy + (i % 2) * 6, dawn ? "#e8dcb0" : "#3a2a4a", dawn ? "#c9a24a" : "#c0a6e0"); }
  else if (has("wreck")) s += `<path d="M${dx - 18} ${dy + 4}q18 8 34 -6l-4 -4q-14 8 -30 2z" fill="#4a3424"/><path d="M${dx - 4} ${dy - 2}v-20M${dx - 4} ${dy - 18}l12 6" stroke="#3a2a1a" stroke-width="2" fill="none"/>`;
  else if (has("webs")) s += trees(5, "dead", "", 18) + `<path d="M${dx - 14} ${dy - 14}l28 14M${dx + 14} ${dy - 14}l-28 14M${dx} ${dy - 18}v20" stroke="#e8e8e8" stroke-width=".7" opacity=".6"/>`;
  else if (has("old_oaks")) s += trees(5, "leaf", "#3a5a2a", 16);
  else if (has("willows") || has("roots")) s += trees(4, "leaf", "#4a5a3a", 16);
  else if (has("gat")) s += `<path d="M${dx - 30} ${dy + 6}l60 -14" stroke="#5a4630" stroke-width="5" stroke-dasharray="4 2"/>`;
  else if (has("sunflowers")) for (let i = 0; i < 14; i++) s += `<circle cx="${MA.f(dx - 24 + r() * 48)}" cy="${MA.f(dy - 6 + r() * 16)}" r="2.2" fill="#e8b830"/>`;
  else if (has("signpost")) s += `<path d="M${dx + 14} ${dy + 4}v-20" stroke="#4a3424" stroke-width="2"/><path d="M${dx + 14} ${dy - 14}h12l3 3 -3 3h-12zM${dx + 14} ${dy - 8}h-12l-3 3 3 3h12z" fill="#8a6a44"/>`;
  else if (has("fence")) s += `<path d="M${dx - 30} ${dy + 6}h60" stroke="#6a4a2a" stroke-width="2"/><path d="M${dx - 30} ${dy + 2}h60" stroke="#6a4a2a" stroke-width="2"/>` + maHouse(dx + 6, dy - 6, 10, 6, 7, "#cbbd9c", "#7a4a2a");
  else if (has("fair")) s += maTent(dx - 12, dy, 12, 10, "#c0503a") + maTent(dx + 4, dy - 6, 12, 10, "#3a6a9a") + maTent(dx + 18, dy + 2, 12, 10, "#d9a441");
  else if (has("nests")) for (let i = 0; i < 5; i++) s += `<ellipse cx="${MA.f(dx - 18 + i * 9)}" cy="${MA.f(dy + (i % 2) * 5)}" rx="4" ry="2" fill="#8a7a5a"/>`;
  else if (has("smoke")) for (let i = 0; i < 4; i++) s += `<circle cx="${MA.f(dx - 12 + i * 8)}" cy="${MA.f(dy - 6 - i * 3)}" r="${5 + i}" fill="#9a9a8a" opacity=".22"/>`;
  else if (has("spears")) for (let i = 0; i < 8; i++) s += `<path d="M${MA.f(dx - 20 + i * 6)} ${MA.f(dy + (i % 3) * 3)}l${MA.f(r() * 8 - 4)} -14" stroke="#2a2218" stroke-width="1.6"/>`;
  else if (has("midge_cloud")) for (let i = 0; i < 30; i++) s += `<circle cx="${MA.f(dx + (r() * 2 - 1) * 16)}" cy="${MA.f(dy - 10 + (r() * 2 - 1) * 8)}" r=".9" fill="#1a1a12"/>`;
  if (has("crypt")) s += `<path d="M${dx + 18} ${dy + 4}v-10l7 -6 7 6v10z" fill="#5a5448"/><path d="M${dx + 22} ${dy + 4}v-6h6v6z" fill="#120e0a"/>`;
  return g + s;
}

/* ---------- рельєф: карта висот і тінь від світла ---------- */
function maRelief(peaks, coastD, rivers, W, H){
  const S2 = 4, w = Math.ceil(W / S2), h = Math.ceil(H / S2), hm = new Float32Array(w * h);
  const r = rng("relief");
  const G = 16, gw = Math.ceil(w / G) + 2, gh = Math.ceil(h / G) + 2, grid = new Float32Array(gw * gh).map(() => r());
  const G2 = 5, gw2 = Math.ceil(w / G2) + 2, gh2 = Math.ceil(h / G2) + 2, grid2 = new Float32Array(gw2 * gh2).map(() => r());
  const vn = (gr, gW, gs, x, y) => { const fx = x / gs, fy = y / gs, ix = fx | 0, iy = fy | 0, tx = fx - ix, ty = fy - iy, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const a = gr[iy * gW + ix], b = gr[iy * gW + ix + 1], c = gr[(iy + 1) * gW + ix], d = gr[(iy + 1) * gW + ix + 1]; return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy; };
  const regAt = []; const nodes = Object.values(NODES);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){ hm[y * w + x] = vn(grid, gw, G, x, y) * .16 + vn(grid2, gw2, G2, x, y) * .035; }
  // горби: від кожної гори на карті
  for (const [px, py, z] of peaks){ const cx = px / S2, cy = (py - z * .5) / S2, sg = z * 1.05 / S2, A = z / 34;
    const x0 = Math.max(0, cx - sg * 3 | 0), x1 = Math.min(w - 1, cx + sg * 3 | 0), y0 = Math.max(0, cy - sg * 3 | 0), y1 = Math.min(h - 1, cy + sg * 3 | 0);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++){ const d2 = ((x - cx) ** 2 + (y - cy) ** 2) / (sg * sg); hm[y * w + x] += A * Math.exp(-d2 * .5); } }
  // долини рік
  for (const pts of rivers) for (const [px, py] of pts){ const cx = px / S2, cy = py / S2, sg = 6;
    for (let y = Math.max(0, cy - 14 | 0); y <= Math.min(h - 1, cy + 14 | 0); y++) for (let x = Math.max(0, cx - 14 | 0); x <= Math.min(w - 1, cx + 14 | 0); x++){ const d2 = ((x - cx) ** 2 + (y - cy) ** 2) / (sg * sg); hm[y * w + x] -= .06 * Math.exp(-d2 * .5); } }
  // море й болото рівні
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const cx2 = cv.getContext("2d");
  const sea = new Path2D(coastD + " L0 1600z"), bogN = Object.values(NODES).filter(n => n.r === "bog");
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){ const wx = x * S2, wy = y * S2;
    if (cx2.isPointInPath(sea, wx, wy)) hm[y * w + x] = -.2;
    else { let bd = 1e9; for (const n of bogN){ const d = (n.x - wx) ** 2 + (n.y - wy) ** 2; if (d < bd) bd = d; } const wgt = Math.max(0, Math.min(1, 1 - (Math.sqrt(bd) - 160) / 240)); if (wgt) hm[y * w + x] *= 1 - wgt * .85; } }
  // тінь за нормаллю, світло з північного заходу
  const img = cx2.createImageData(w, h), L = [-.55, -.55, .85], ln = Math.hypot(...L), Lx = L[0] / ln, Ly = L[1] / ln, Lz = L[2] / ln, k = 9;
  const flat = Lz, SH = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++){ const i = y * w + x;
    const dx = (hm[i + 1] - hm[i - 1]) * k, dy = (hm[i + w] - hm[i - w]) * k, nl = Math.hypot(dx, dy, 1);
    const sh = (-dx * Lx - dy * Ly + Lz) / nl - flat; SH[i] = sh;
    const v = Math.max(0, Math.min(255, 128 + (sh > 0 ? sh * 200 : sh * 115))), j = i * 4; img.data[j] = img.data[j + 1] = img.data[j + 2] = v; img.data[j + 3] = 255; }
  for (let x = 0; x < w; x++){ for (const y of [0, h - 1]){ const j = (y * w + x) * 4; img.data[j] = img.data[j + 1] = img.data[j + 2] = 128; img.data[j + 3] = 255; } }
  for (let y = 0; y < h; y++){ for (const x of [0, w - 1]){ const j = (y * w + x) * 4; img.data[j] = img.data[j + 1] = img.data[j + 2] = 128; img.data[j + 3] = 255; } }
  return {hm, SH, w, h, S2};
}
function maSample(d, step = 18){
  const ns = "http://www.w3.org/2000/svg", sv = document.createElementNS(ns, "svg"), p = document.createElementNS(ns, "path");
  sv.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden"); p.setAttribute("d", d); sv.appendChild(p); document.body.appendChild(sv);
  const L = p.getTotalLength(), out = []; for (let t = 0; t <= L; t += step){ const q = p.getPointAtLength(t); out.push([q.x, q.y]); }
  sv.remove(); return out;
}

/* ---------- мальована земля: колір краю, фактура, волога біля рік, висота й світло ---------- */
function maNoise(seed, w, h, sc){
  const r = rng(seed), gw = Math.ceil(w / sc) + 2, gh = Math.ceil(h / sc) + 2, g = new Float32Array(gw * gh);
  for (let i = 0; i < g.length; i++) g[i] = r();
  return (x, y) => { const fx = x / sc, fy = y / sc, ix = fx | 0, iy = fy | 0, tx = fx - ix, ty = fy - iy, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty), o = iy * gw + ix;
    const a = g[o], b = g[o + 1], c = g[o + gw], d = g[o + gw + 1]; return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy; };
}
function maBil(A, w, h, fx, fy){ const ix = Math.min(w - 2, Math.max(0, fx | 0)), iy = Math.min(h - 2, Math.max(0, fy | 0)), tx = Math.min(1, Math.max(0, fx - ix)), ty = Math.min(1, Math.max(0, fy - iy)), o = iy * w + ix;
  return A[o] * (1 - tx) * (1 - ty) + A[o + 1] * tx * (1 - ty) + A[o + w] * (1 - tx) * ty + A[o + w + 1] * tx * ty; }
function maPaint(W, H, field, HM, waters){
  const S = 2, w = Math.ceil(W / S), h = Math.ceil(H / S);
  const mk = (cw, ch) => { const k = document.createElement("canvas"); k.width = cw; k.height = ch; return [k, k.getContext("2d")]; };
  // кольорове поле малюємо дрібно, розмиваємо й розтягуємо: швидко й м'яко
  const q = 8, [t1, c1] = mk(Math.ceil(w / q), Math.ceil(h / q)); c1.fillStyle = "#454b37"; c1.fillRect(0, 0, t1.width, t1.height); c1.scale(1 / (S * q), 1 / (S * q));
  for (const [x, y, rx, ry, col] of field){ c1.fillStyle = col; c1.beginPath(); c1.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c1.fill(); }
  const [t2, c2] = mk(t1.width, t1.height); c2.filter = "blur(3px)"; c2.drawImage(t1, 0, 0);
  const [cv, c] = mk(w, h); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high"; c.drawImage(t2, 0, 0, w, h);
  const img = c.getImageData(0, 0, w, h), P = img.data;
  // волога біля рік: так само дрібно
  const q2 = 4, [t3, c3] = mk(Math.ceil(w / q2), Math.ceil(h / q2)); c3.scale(1 / (S * q2), 1 / (S * q2)); c3.strokeStyle = "#fff"; c3.lineCap = "round"; c3.lineJoin = "round";
  for (const [d, wd] of waters){ c3.lineWidth = wd * 4.5; c3.stroke(new Path2D(d)); }
  const [t4, c4] = mk(t3.width, t3.height); c4.filter = "blur(4px)"; c4.drawImage(t3, 0, 0);
  const [mc, m2] = mk(w, h); m2.imageSmoothingEnabled = true; m2.drawImage(t4, 0, 0, w, h);
  const M = m2.getImageData(0, 0, w, h).data;
  const n1 = maNoise("pa1", w, h, 70), n2 = maNoise("pa2", w, h, 18), n3 = maNoise("pa3", w, h, 4.5), n4 = maNoise("pa4", w, h, 1.6);
  const k4 = S / HM.S2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){ const j = (y * w + x) * 4;
    let R = P[j], G = P[j + 1], B = P[j + 2];
    const a1 = n1(x, y), a2 = n2(x, y), a3 = n3(x, y), a4 = n4(x, y);
    const br = .93 + .2 * a1 + .12 * (a2 - .5) + .09 * (a3 - .5) + .07 * (a4 - .5);
    R *= br; G *= br * (1 + (a2 - .5) * .08); B *= br * (1 - (a1 - .5) * .06);
    const mo = M[j] / 255; R += (48 - R) * mo * .28; G += (70 - G) * mo * .22; B += (42 - B) * mo * .28;
    const fx = x * k4, fy = y * k4, hv = maBil(HM.hm, HM.w, HM.h, fx, fy), sv = Math.max(-.3, Math.min(.3, maBil(HM.SH, HM.w, HM.h, fx, fy)));
    if (hv > .28){ const t = Math.min(1, (hv - .28) / .45) * .55; R += (188 - R) * t; G += (182 - G) * t; B += (166 - B) * t; }
    const kk = 1 + sv * 1.1; R *= kk; G *= kk; B *= kk;
    if (sv > 0){ R += sv * 30; G += sv * 22; B += sv * 6; } else B -= sv * 14;
    P[j] = R; P[j + 1] = G; P[j + 2] = B; }
  c.putImageData(img, 0, 0);
  return cv.toDataURL("image/jpeg", .9);
}
// просторова сітка для швидкої перевірки «чи близько до дороги, ріки, гори»
function maHash(cell = 40){
  const m = new Map(), key = (x, y) => ((x / cell) | 0) + "," + ((y / cell) | 0);
  return { add(x, y, rad){ const k = key(x, y); if (!m.has(k)) m.set(k, []); m.get(k).push([x, y, rad]); },
    hit(x, y, extra = 0){ const cx = (x / cell) | 0, cy = (y / cell) | 0; for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++){ const a = m.get((cx + dx) + "," + (cy + dy)); if (!a) continue; for (const [px, py, rad] of a) if ((px - x) ** 2 + (py - y) ** 2 < (rad + extra) ** 2) return true; } return false; },
    near(x, y, maxd){ const cx = (x / cell) | 0, cy = (y / cell) | 0; let best = null, bd = maxd * maxd; for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++){ const a = m.get((cx + dx) + "," + (cy + dy)); if (!a) continue; for (const p of a){ const d = (p[0] - x) ** 2 + (p[1] - y) ** 2; if (d < bd){ bd = d; best = p; } } } return best; } };
}
const roadPts = (rd, n = 60) => { const A = NODES[rd.a], Bn = NODES[rd.b], out = []; for (let i = 0; i <= n; i++){ const t = i / n, u = 1 - t; out.push([u * u * A.x + 2 * u * t * rd.cx + t * t * Bn.x, u * u * A.y + 2 * u * t * rd.cy + t * t * Bn.y]); } return out; };
// символи дерев: один раз намальовані, далі тільки ставимо на карту
function maTreeDefs(){
  const sym = (id, body) => `<symbol id="${id}" overflow="visible">${body}</symbol>`;
  return `<defs>${sym("tp0", maTree(0, 0, 5, "pine", "#2f4a28"))}${sym("tp1", maTree(0, 0, 5, "pine", "#3a5832"))}${sym("tp2", maTree(0, 0, 5, "pine", "#24392a"))}${sym("tp3", maTree(0, 0, 5, "pine", "#2a2e26"))}
    ${sym("tl0", maTree(0, 0, 5, "leaf", "#4a6a2e"))}${sym("tl1", maTree(0, 0, 5, "leaf", "#506c30"))}${sym("tl2", maTree(0, 0, 5, "leaf", "#3e5a2a"))}${sym("tl3", maTree(0, 0, 5, "leaf", "#5e6430"))}${sym("tw0", maTree(0, 0, 5, "leaf", "#56683a"))}${sym("td0", maTree(0, 0, 5, "dead", ""))}</defs>`;
}
function maForests(r, near, inSea, avoid, W, H){
  const f1 = maNoise("fo1", W, H, 240), f2 = maNoise("fo2", W, H, 70);
  const BIAS = {zak:.2, kab:.02, wild:.16, ash:-.06, mark:-.12, bog:-.09, ord:-.12};
  const HOT = [[150, 165, 120, 80], [390, 760, 170, 100], [560, 650, 80, 60], [1210, 260, 140, 60], [1560, 320, 80, 60], [1980, 650, 160, 190], [2150, 600, 80, 80], [2450, 700, 100, 80], [2560, 420, 110, 90], [2180, 1120, 80, 50], [2620, 1320, 100, 70]];
  const TYPES = {zak:["tp0","tp0","tp2","tp1","tl2"], kab:["tl0","tl1","tl2","tp1","tl0"], wild:["tp2","tp3","tp0"], ash:["td0","td0","tp3"], mark:["td0"], bog:["tw0","td0","tw0"], ord:["tl3","tl0","tl1"]};
  const trees = [], floor = [];
  for (let y = 14; y < H; y += 11) for (let x = 6; x < W; x += 11){ const px = x + (r() * 2 - 1) * 5, py = y + (r() * 2 - 1) * 5, reg = near(px, py);
    let d = f1(px, py) * .75 + f2(px, py) * .35 + (BIAS[reg] || 0);
    for (const [hx, hy, rx, ry] of HOT){ const q = ((px - hx) / rx) ** 2 + ((py - hy) / ry) ** 2; if (q < 1) d += .32 * (1 - q); }
    const thr = reg === "mark" || reg === "ash" ? .82 : .66; if (d < thr) continue;
    if (inSea(px, py) || avoid.hit(px, py)) continue;
    const t = MA.pk(r, TYPES[reg] || TYPES.wild); trees.push([px, py, t, .82 + r() * .5 + Math.min(.3, (d - thr))]);
    if (t !== "td0" && r() < .25) floor.push([px, py]); }
  trees.sort((a, b) => a[1] - b[1]);
  let fl = ""; for (const [x, y] of floor) fl += `<ellipse cx="${x | 0}" cy="${y - 4 | 0}" rx="18" ry="11" fill="#1c2a16" opacity=".28"/>`;
  return `<g filter="url(#blwm)">${fl}</g>` + trees.map(([x, y, t, k]) => `<use href="#${t}" transform="translate(${MA.f(x)} ${MA.f(y)}) scale(${MA.f(k)})"/>`).join("");
}
function maBridge(x, y, ang, len, stone){
  const f = MA.f, deck = stone ? "#8e8676" : "#7a5c3a", edge = stone ? "#4e483e" : "#3a2818";
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang * 180 / Math.PI)})">`;
  s += `<rect x="${f(-len / 2 + 3)}" y="-2" width="${f(len)}" height="11" fill="#000" opacity=".35"/>`;
  s += `<rect x="${f(-len / 2)}" y="-5.5" width="${f(len)}" height="11" rx="1.5" fill="${deck}"/>`;
  if (stone){ s += `<path d="M${f(-len / 2 + 4)} 5.5q${f(len / 2 - 4)} -6 ${f(len - 8)} 0" stroke="${edge}" stroke-width="1.6" fill="none"/>`; }
  else { let pl = ""; for (let i = -len / 2 + 3; i < len / 2; i += 3) pl += `M${f(i)} -5v11`; s += `<path d="${pl}" stroke="${edge}" stroke-width=".7" opacity=".6"/>`; }
  s += `<path d="M${f(-len / 2)} -5.5h${f(len)}M${f(-len / 2)} 5.5h${f(len)}" stroke="${edge}" stroke-width="2"/>`;
  s += `<rect x="${f(-len / 2 - 1)}" y="-7" width="3" height="3" fill="${edge}"/><rect x="${f(len / 2 - 2)}" y="-7" width="3" height="3" fill="${edge}"/><rect x="${f(-len / 2 - 1)}" y="4" width="3" height="3" fill="${edge}"/><rect x="${f(len / 2 - 2)}" y="4" width="3" height="3" fill="${edge}"/>`;
  return s + `</g>`;
}
// картографічні прикраси: компас, корабель, морський змій
function maCompass(x, y, R){
  const f = MA.f; let s = `<g transform="translate(${x} ${y})" opacity=".85">`;
  s += `<circle r="${R}" fill="none" stroke="#e8dcb8" stroke-width="2" opacity=".55"/><circle r="${R * .82}" fill="none" stroke="#e8dcb8" stroke-width="1" stroke-dasharray="3 5" opacity=".5"/>`;
  for (let i = 0; i < 8; i++){ const a = i * Math.PI / 4 - Math.PI / 2, L = i % 2 ? R * .55 : R * .95, w = i % 2 ? R * .08 : R * .13, ca = Math.cos(a), sa = Math.sin(a), px = -sa * w, py = ca * w;
    s += `<polygon points="0,0 ${f(ca * L)},${f(sa * L)} ${f(px)},${f(py)}" fill="#efe3c4"/><polygon points="0,0 ${f(ca * L)},${f(sa * L)} ${f(-px)},${f(-py)}" fill="#6a5a3a"/>`; }
  s += `<circle r="${R * .08}" fill="#d9a441" stroke="#3a2a14" stroke-width="1.5"/>`;
  s += `<text y="${-R - 8}" text-anchor="middle" font-family="Georgia, serif" font-size="${R * .32}" font-weight="700" fill="#efe3c4" stroke="#1d150c" stroke-width="3" paint-order="stroke">Пн</text>`;
  return s + `</g>`;
}
function maShip(x, y, k = 1){
  return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-40 6q20 10 40 2q20 -8 40 -2" stroke="#c8d8dc" stroke-width="1.4" fill="none" opacity=".5"/>
    <ellipse cx="4" cy="4" rx="30" ry="5" fill="#000" opacity=".3"/><path d="M-26 -4h52l-8 10h-36z" fill="#5a3a22"/><path d="M-26 -4h52l-2 3h-48z" fill="#7a5232"/>
    <path d="M-2 -4v-44M14 -4v-32" stroke="#3a2a1a" stroke-width="2"/><path d="M-2 -46q16 12 0 24z" fill="#efe6d0"/><path d="M-2 -46q-14 12 0 24z" fill="#c8bea6"/><path d="M14 -34q12 9 0 18z" fill="#e2d8c0"/>
    <path d="M-2 -48h12l-3 3 3 3h-12z" fill="#a83a2a"/></g>`;
}
function maSerpent(x, y, k = 1){
  let s = `<g transform="translate(${x} ${y}) scale(${k})">`;
  for (let i = 0; i < 3; i++){ const hx = -50 + i * 30; s += `<ellipse cx="${hx + 10}" cy="4" rx="16" ry="3" fill="#c8d8dc" opacity=".35"/><path d="M${hx} 2a12 12 0 0 1 22 0z" fill="#2e5a4a"/><path d="M${hx + 11} -10a12 12 0 0 1 11 12h-11z" fill="#1e3e32"/><path d="M${hx + 4} -6l3 -6 3 5" fill="#8ab04a"/>`; }
  s += `<path d="M40 2q4 -20 18 -22q12 0 10 8l-10 3q-6 2 -8 11z" fill="#2e5a4a"/><circle cx="62" cy="-15" r="1.8" fill="#ffd27a"/><path d="M50 -20l4 -8 4 7" fill="#8ab04a"/>`;
  return s + `</g>`;
}

/* ---------- уся карта ---------- */
function mapSVG(){
  if (MAP_SVG) return MAP_SVG;
  const r = rng("world-v6"), W = WORLD.w, H = WORLD.h, u = "wm", pk = a => MA.pk(r, a);
  let s = sceneDefs(u, 11).replace(/_U/g, u);
  s += `<defs><radialGradient id="wmvig" cx="50%" cy="50%" r="75%"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient>
    <linearGradient id="wmsea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a4658"/><stop offset=".55" stop-color="#1c3240"/><stop offset="1" stop-color="#12222c"/></linearGradient>
    <filter id="wmshallow" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="14"/></filter></defs>` + maTreeDefs();
  const PAL = {kab:["#6c7c46","#5f6f3d","#556534"], ash:["#5e594b","#524e42","#47453b"], zak:["#4c5c3a","#425034","#37442d"], mark:["#7a7461","#6c6756","#605c4d"], bog:["#34422c","#2b3824","#232e1d"], ord:["#6c6249","#605742","#564e3c"], wild:["#41463a","#3a3f32","#34392d"]};
  const near = (x, y) => { let best = "wild", bd = 420; for (const n of Object.values(NODES)){ const d = Math.hypot(n.x - x, n.y - y); if (d < bd){ bd = d; best = n.r; } } return PAL[best] ? best : "wild"; };
  const field = []; for (let y = -60; y < H + 120; y += 110) for (let x = -60; x < W + 120; x += 120){ const px = x + (r() * 2 - 1) * 50, py = y + (r() * 2 - 1) * 40; field.push([px, py, 110 + r() * 80, 70 + r() * 50, pk(PAL[near(px, py)])]); }
  // гори
  const m = [];
  for (let y = 60; y < 900; y += 24){ if ((y > 360 && y < 450) || (y > 250 && y < 320) || (y > 610 && y < 690)) continue; m.push([1765 + (r() * 2 - 1) * 24 + (y - 480) * .03, y, 20 + r() * 14]); }
  for (let i = 0; i < 46; i++) m.push([2560 + r() * 240, 620 + r() * 300, 20 + r() * 22]);
  for (let i = 0; i < 22; i++) m.push([2620 + r() * 180, 80 + r() * 260, 18 + r() * 18]);
  for (let i = 0; i < 14; i++) m.push([20 + r() * 260, 20 + r() * 90, 16 + r() * 14]);
  for (let i = 0; i < 80; i++){ const x = 2900 + r() * 840, y = 1000 + r() * 540; if (Math.hypot(x - 2760, y - 1420) < 160 || Math.abs(x - 3560 - (y - 1300) * .2) < 44) continue; m.push([x, y, 18 + r() * 26]); }
  const RV = [
    ["M560 -10 C640 90 690 150 650 210 S 590 310 615 360 S 760 380 830 420 S 910 530 880 660 S 820 860 870 930 S 680 1090 560 1205", 14, "#2e4858"],
    ["M1450 -10 C1400 200 1430 400 1380 518 S 1350 700 1410 930 S 1440 1060 1400 1150 S 1330 1250 1360 1330 S 1480 1420 1590 1455", 16, "#2e4858"],
    ["M2120 -10 C2060 200 1990 380 1940 470 S 1860 620 1815 860 S 1890 1080 1880 1200 S 1900 1440 1870 1590", 15, "#2e4858"],
    ["M1815 860 C1950 900 2150 860 2350 900 S 2560 850 2700 860 S 2920 810 3060 790 S 3350 770 3528 800", 18, "#2e4858"],
    ["M3540 -10 C3500 160 3560 300 3520 460 S 3560 640 3500 760 S 3560 860 3530 960 S 3480 1150 3560 1300 S 3620 1450 3600 1590", 15, "#33444c"]];
  const coast = "M0 640 C80 660 150 720 200 780 C240 840 250 880 300 920 C360 1000 470 1060 560 1140 C640 1210 700 1320 760 1420 C790 1480 805 1530 815 1600";
  // струмки (форма випадкова, але завжди та сама)
  const ST = [];
  const stream = (x0, y0, x1, y1, w = 3.5) => { let d = `M${x0} ${y0}`, px = x0, py = y0; const n = 5; for (let i = 1; i <= n; i++){ const t = i / n, x = x0 + (x1 - x0) * t + (i < n ? (r() * 2 - 1) * 26 : 0), y = y0 + (y1 - y0) * t + (i < n ? (r() * 2 - 1) * 18 : 0); d += ` Q${(px + x) / 2 + (r() * 2 - 1) * 22 | 0} ${(py + y) / 2 + (r() * 2 - 1) * 16 | 0} ${x | 0} ${y | 0}`; px = x; py = y; } ST.push([d, w]); };
  stream(1790, 160, 1985, 360); stream(1785, 560, 1880, 700, 3); stream(1740, 300, 1600, 420, 3); stream(2640, 330, 2690, 520); stream(2690, 520, 2720, 850, 4); stream(2600, 700, 2470, 880, 3);
  stream(150, 120, 380, 300, 3); stream(380, 300, 610, 370, 3.5); stream(1120, 160, 1395, 300, 3); stream(2980, 260, 3240, 330, 3); stream(3240, 330, 3500, 420, 3.5); stream(2960, 1060, 3200, 1180, 3); stream(3200, 1180, 3500, 1220, 3.5); stream(2240, 1060, 2160, 1240, 3); stream(2160, 1240, 1900, 1300, 3.5);
  const rvPts = RV.map(v => maSample(v[0], 6)), stPts = ST.map(v => maSample(v[0], 6));
  // висоти, світло й мальована земля
  let HM = null; try { HM = maRelief(m, coast, rvPts, W, H); } catch (e){}
  try { if (HM) s += `<image href="${maPaint(W, H, field, HM, [...RV.map(v => [v[0], v[1]]), ...ST.map(v => [v[0], v[1] * 2])])}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>`; }
  catch (e){ let fld = ""; for (const [x, y, rx, ry, c] of field) fld += `<ellipse cx="${x | 0}" cy="${y | 0}" rx="${rx | 0}" ry="${ry | 0}" fill="${c}"/>`; s += `<rect width="${W}" height="${H}" fill="#454b37"/><g filter="url(#blwm)">${fld}</g>`; }
  s += maTextures(r, near, coast, W, H);
  // море з мілиною й піщаним берегом
  s += `<path d="${coast}" fill="none" stroke="#5a5432" stroke-width="30" opacity=".5" transform="translate(4,3)"/><path d="${coast}" fill="none" stroke="#cdbd8a" stroke-width="24"/><path d="${coast}" fill="none" stroke="#e2d6a8" stroke-width="10" opacity=".7"/>`;
  s += `<path d="${coast} L0 1600z" fill="url(#wmsea)"/>`;
  s += `<path d="${coast}" fill="none" stroke="#4a7a88" stroke-width="44" opacity=".55" filter="url(#wmshallow)"/>`;
  s += `<path d="${coast}" fill="none" stroke="#c9bf98" stroke-width="7" opacity=".55"/><path d="${coast}" fill="none" stroke="#f2ecd8" stroke-width="2" opacity=".5" transform="translate(-6,4)"/>`;
  const seaCtx = document.createElement("canvas").getContext("2d"), seaP = new Path2D(coast + " L0 1600z"), inSea = (x, y) => seaCtx.isPointInPath(seaP, x, y);
  let wv = ""; for (let i = 0; i < 160; i++){ const x = r() * 760, y = 660 + r() * 920; if (!inSea(x, y) || !inSea(x + 30, y)) continue; wv += `M${x | 0} ${y | 0}q6 -4 12 0q6 4 12 0 `; }
  s += `<path d="${wv}" stroke="#7a9aa8" stroke-width="1.6" fill="none" opacity=".4"/>`;
  for (let i = 0; i < 30; i++){ const x = r() * 700, y = 660 + r() * 920; if (!inSea(x, y) || (inSea(x + 70, y) && inSea(x + 40, y + 40))) continue; s += maRock(x, y, 4 + r() * 6, true); }
  s += maCompass(250, 1330, 66) + maShip(520, 1470, 1.1) + maSerpent(130, 1110, 1);
  let fog = ""; for (let i = 0; i < 9; i++) fog += `<ellipse cx="${r() * 640 | 0}" cy="${1000 + r() * 520 | 0}" rx="${140 + r() * 120 | 0}" ry="${24 + r() * 26 | 0}" fill="#c9d4d8" opacity="${.07 + r() * .07}"/>`;
  s += `<g filter="url(#bl${u})">${fog}</g>`;
  // струмки й ріки
  let wsv = ""; for (const [d, w] of ST) wsv += `<path d="${d}" fill="none" stroke="#18242c" stroke-width="${w + 2.5}" stroke-linecap="round" opacity=".85"/><path d="${d}" fill="none" stroke="#3e6274" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#7aa0b0" stroke-width="1" stroke-dasharray="6 14" stroke-linecap="round" opacity=".6"/>`;
  const river = (d, w, c) => `<path d="${d}" fill="none" stroke="#5a5a3a" stroke-width="${w + 12}" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/><path d="${d}" fill="none" stroke="#18242c" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#4e7284" stroke-width="${Math.max(2, w * .35)}" stroke-linecap="round" opacity=".6" transform="translate(-2,-1.5)"/><path d="${d}" fill="none" stroke="#8ab0c0" stroke-width="1.4" stroke-dasharray="10 26" opacity=".55"/>`;
  for (const [d, w, c] of RV) wsv += river(d, w, c);
  s += wsv;
  s += maPool(2380, 760, 40, 16, "#2e4858") + maPool(1612, 1468, 64, 25, "#16242a");
  // ліси: густі масиви з дерев, обходять дороги, ріки, гори й поселення
  const avoid = maHash(40);
  for (const rd of ROADS) for (const [x, y] of roadPts(rd, 40)) avoid.add(x, y, 14);
  RV.forEach((v, i) => { for (const [x, y] of rvPts[i]) avoid.add(x, y, v[1] / 2 + 10); });
  ST.forEach((v, i) => { for (const [x, y] of stPts[i]) avoid.add(x, y, 9); });
  for (const [x, y, z] of m) avoid.add(x, y - z * .4, z * 1.05);
  for (const n of Object.values(NODES)) avoid.add(n.x, n.y - 8, n.kind === "city" ? 175 : n.kind === "town" ? 110 : 62);
  avoid.add(2380, 760, 50); avoid.add(1612, 1468, 74);
  s += maForests(r, near, inSea, avoid, W, H);
  // виноградники
  for (let i = 0; i < 10; i++) s += `<path d="M${2120 + i * 22} 290l120 -60" stroke="#2e3a1a" stroke-width="5" stroke-dasharray="2 6" opacity=".5" transform="translate(2,2)"/><path d="M${2120 + i * 22} 290l120 -60" stroke="#5a7a2a" stroke-width="4" stroke-dasharray="2 6"/>`;
  // гори з передгір'ями, тінню й снігом
  let snow = ""; for (const [x, y, z] of m) if (z > 26) snow += `<ellipse cx="${x + 6 | 0}" cy="${y - z * .2 | 0}" rx="${z * 1.6 | 0}" ry="${z * .5 | 0}" fill="#e8ecea" opacity=".22"/>`;
  s += `<g filter="url(#bl${u})">${snow}</g>`;
  const foot = []; for (const [x, y, z] of m) if (r() < .55){ const a = r() * Math.PI * 2, d = z * (1.4 + r() * .9); foot.push([x + Math.cos(a) * d, y + Math.abs(Math.sin(a)) * d * .55 + 6, 9 + r() * 7]); }
  const all = [...m.map(v => [...v, 0]), ...foot.map(v => [...v, 1])].sort((a, b) => a[1] - b[1]);
  s += all.map(([x, y, z, f]) => f ? maHill(x, y, z * 1.6, z * .8, "#5e6250") : maPeak(x, y, z, z > 24 || y < 400 || (x > 2550 && y > 600 && y < 940))).join("");
  if (typeof mapExtra === "function") s += mapExtra(r);
  // дороги: біля міст бруківка, далі утоптана земля
  for (const rd of ROADS){ const A = NODES[rd.a], Bn = NODES[rd.b], d = `M${A.x} ${A.y} Q${rd.cx} ${rd.cy} ${Bn.x} ${Bn.y}`, paved = A.kind === "city" || Bn.kind === "city";
    s += `<path d="${d}" fill="none" stroke="#1a1510" stroke-width="10" stroke-linecap="round" opacity=".28" transform="translate(1.5,2)"/>`;
    s += paved ? `<path d="${d}" fill="none" stroke="#3a362e" stroke-width="8" stroke-linecap="round" opacity=".8"/><path d="${d}" fill="none" stroke="#7e786a" stroke-width="5.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#5a5548" stroke-width="5.5" stroke-dasharray="2 3" opacity=".7"/>`
      : `<path d="${d}" fill="none" stroke="#8a7650" stroke-width="6" stroke-linecap="round" opacity=".55"/>`;
    s += `<path d="${d}" fill="none" stroke="${rd.danger ? "#e0703f" : "#efe6c0"}" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`; }
  // мости там, де дорога перетинає ріку чи струмок
  const water = maHash(30); water.svg = wsv; water.lines = [...rvPts.map((p, i) => ({p, w:RV[i][1]})), ...stPts.map((p, i) => ({p, w:ST[i][1]}))]; RV.forEach((v, i) => { for (const [x, y] of rvPts[i]) water.add(x, y, v[1] / 2 + 3); }); ST.forEach((v, i) => { for (const [x, y] of stPts[i]) water.add(x, y, v[1] / 2 + 2); });
  const bridges = [];
  for (const rd of ROADS){ const pts = roadPts(rd, 140); let inW = false;
    for (let i = 1; i < pts.length - 1; i++){ const [x, y] = pts[i], hitp = water.near(x, y, 12);
      if (hitp && !inW && !bridges.some(b => Math.hypot(b[0] - x, b[1] - y) < 26)){ inW = true; const ang = Math.atan2(pts[i + 1][1] - pts[i - 1][1], pts[i + 1][0] - pts[i - 1][0]); const big = hitp[2] > 7;
        const A = NODES[rd.a], Bn = NODES[rd.b]; bridges.push([x, y, ang, big ? hitp[2] * 2 + 16 : 16, big && (A.kind === "city" || Bn.kind === "city" || A.kind === "town" || Bn.kind === "town")]); }
      else if (!hitp) inW = false; } }
  for (const b of bridges) s += maBridge(...b);
  // міста, села, табори, руїни на місці кожної локації
  for (const id of Object.keys(NODES).sort((a, b) => NODES[a].y - NODES[b].y)){ const n = NODES[id], k = n.kind === "city" ? 1 : n.kind === "town" ? 1.3 : 1.25, site = maSite(id, rng("site-" + id), water);
    s += site != null ? site : `<g transform="translate(${n.x},${n.y}) scale(${k}) translate(${-n.x},${-n.y})">${maDiorama(id, rng("dio-" + id), water)}</g>`; }
  // назви країв
  for (const [t, x, y, fs, rot] of [["ЗЕМЛІ КАББАЛОНУ", 470, 70, 46, -2], ["ПОПЕЛЯСТІ ЗЕМЛІ", 1330, 110, 46, 1.5], ["ЗАКАРПАТТЯ", 2300, 110, 48, -1.5], ["КІСТЯНА МАРКА", 3260, 80, 44, 2], ["ЧОРНА ТРЯСОВИНА", 1360, 1540, 40, -1.5], ["ЗЕМЛІ СВІТАНКУ Й НОЧІ", 2380, 1540, 38, 1], ["МОРЕ ТУМАНІВ", 230, 1200, 34, -18]])
    s += `<text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})" text-anchor="middle" font-family="Alegreya, Georgia, serif" font-size="${fs}" font-weight="700" letter-spacing="12" fill="#efe3c4" stroke="#1d150c" stroke-width="7" stroke-linejoin="round" paint-order="stroke" opacity=".62">${t}</text>`;
  s += `<rect width="${W}" height="${H}" filter="url(#gr${u})" opacity=".24"/><rect width="${W}" height="${H}" fill="url(#wmvig)"/>`;
  s += `<rect x="5" y="5" width="${W - 10}" height="${H - 10}" fill="none" stroke="#1a140c" stroke-width="10" opacity=".75"/><rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="#c9a24a" stroke-width="2" opacity=".55"/>`;
  MAP_SVG = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true" style="position:absolute;left:0;top:0">${s}</svg>`;
  return MAP_SVG;
}

/* ---------- карта як готова картинка: малюємо один раз, далі тільки рухаємо ---------- */
let MAP_URL = null, MAP_BUSY = false;
function mapLayer(){
  if (MAP_URL) return `<img id="mapimg" src="${MAP_URL}" width="${WORLD.w}" height="${WORLD.h}" alt="" draggable="false" style="position:absolute;left:0;top:0;width:${WORLD.w}px;height:${WORLD.h}px;pointer-events:none">`;
  const svg = mapSVG();
  if (!MAP_BUSY){ MAP_BUSY = true; setTimeout(bakeMap, 30); }
  return svg;
}
function bakeMap(){
  try {
    const src = mapSVG().replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    const url = URL.createObjectURL(new Blob([src], {type:"image/svg+xml"})), img = new Image(), K = 1.25;
    img.onload = () => {
      try {
        const cv = document.createElement("canvas"); cv.width = Math.round(WORLD.w * K); cv.height = Math.round(WORLD.h * K);
        const c = cv.getContext("2d"); c.drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
        cv.toBlob(b => { if (!b) return; MAP_URL = URL.createObjectURL(b); const w = document.getElementById("world"); const sv = w && w.querySelector(":scope > svg"); if (sv) sv.outerHTML = mapLayer(); }, "image/png");
      } catch (e){ URL.revokeObjectURL(url); }
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  } catch (e){}
}

/* ---------- живий шар: хмари з тінями, дим з комінів, відблиски на морі, птахи ---------- */
function mapFX(){
  if (S.opt && S.opt.mapfx === false) return "";
  const W = WORLD.w, H = WORLD.h, r = rng("mapfx"); let h = `<div class="mfx" aria-hidden="true">`;
  for (let i = 0; i < 10; i++){ const y = (i + r() * .8) / 10 * H - 120, dur = 240 + r() * 200, sc = .7 + r() * .8;
    h += `<div class="mcl" style="top:${y | 0}px;animation-duration:${dur | 0}s;animation-delay:${-(r() * dur) | 0}s"><div style="transform:scale(${sc.toFixed(2)})"><i class="sh"></i><i class="cl"></i></div></div>`; }
  for (const n of Object.values(NODES)) if (n.kind === "city" || n.kind === "town"){ const k = n.kind === "city" ? 3 : 2; for (let j = 0; j < k; j++) h += `<i class="msm" style="left:${n.x - 22 + j * 14 + (r() * 6 | 0)}px;top:${n.y - 50 - (j % 2) * 8}px;animation-delay:${-(r() * 6).toFixed(2)}s;animation-duration:${(4.5 + r() * 2.5).toFixed(2)}s"></i>`; }
  const sc = document.createElement("canvas").getContext("2d"), sp = new Path2D("M0 640 C80 660 150 720 200 780 C240 840 250 880 300 920 C360 1000 470 1060 560 1140 C640 1210 700 1320 760 1420 C790 1480 805 1530 815 1600 L0 1600z");
  for (let i = 0; i < 70; i++){ const x = r() * 760, y = 650 + r() * 920; if (!sc.isPointInPath(sp, x, y) || !sc.isPointInPath(sp, x + 20, y)) continue; h += `<i class="mgl" style="left:${x | 0}px;top:${y | 0}px;animation-delay:${-(r() * 5).toFixed(2)}s;animation-duration:${(3 + r() * 3).toFixed(2)}s"></i>`; }
  const bird = `<svg width="60" height="30" viewBox="0 0 60 30"><path d="M4 12q5 -6 10 0q5 -6 10 0M26 4q4 -5 8 0q4 -5 8 0M30 20q4 -5 8 0q4 -5 8 0M44 10q3 -4 6 0q3 -4 6 0" stroke="#1a1612" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
  for (let i = 0; i < 3; i++) h += `<div class="mbd" style="top:${200 + i * 420 + (r() * 160 | 0)}px;animation-duration:${90 + r() * 60 | 0}s;animation-delay:${-(r() * 120) | 0}s">${bird}</div>`;
  return h + `</div>`;
}

// карту малюємо заздалегідь, поки гравець ще в локації, щоб вона відкривалася одразу
function prebakeMap(){ if (MAP_URL || MAP_BUSY) return; const go = () => { if (MAP_URL || MAP_BUSY) return; MAP_BUSY = true; try { mapSVG(); } catch (e){} bakeMap(); };
  if (window.requestIdleCallback) requestIdleCallback(go, {timeout:4000}); else setTimeout(go, 1500); }
