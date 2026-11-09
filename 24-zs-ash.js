/* ============ сцени: Попелясті землі (+ спільні дрібниці для інших країв) ============ */
// гора з освітленим західним схилом
function zMount(x, y, w, h, o = {}){
  const c = o.col || "#7d8380", px = x - w * .08, sn = o.snow;
  let s = zSh(x + w * .5, y + 4, w * 1.1, h * .12, .3);
  s += `<polygon points="${zPoly([[x - w, y], [px, y - h], [x + w * .12, y]])}" fill="${c}"/><polygon points="${zPoly([[px, y - h], [x + w, y], [x + w * .12, y]])}" fill="${shade(c, .6)}"/>`;
  s += `<path d="M${zr(x - w * .55)} ${zr(y - h * .35)}l${zr(w * .2)} -${zr(h * .12)}M${zr(x + w * .3)} ${zr(y - h * .42)}l${zr(w * .18)} ${zr(h * .14)}M${zr(x - w * .2)} ${zr(y - h * .6)}l${zr(w * .1)} ${zr(h * .1)}" stroke="${shade(c, .55)}" stroke-width="1.6" opacity=".6"/>`;
  if (sn){ const k = h * .36; s += `<polygon points="${zPoly([[px, y - h], [px - w * .36, y - h + k], [px - w * .2, y - h + k * .82], [px - w * .08, y - h + k * 1.05], [px + w * .05, y - h + k * .8], [px + w * .3, y - h + k * 1.02]])}" fill="#f2f4f2"/><polygon points="${zPoly([[px, y - h], [px + w * .3, y - h + k * 1.02], [px + w * .05, y - h + k * .8]])}" fill="#c8ccd0"/>`; }
  return s;
}
// скеля-стіна на задньому плані (яр, кар'єр)
function zCliffBand(K, y0, y1, col = "#6a665c", o = {}){
  const {r} = K, P = []; for (let x = -20; x <= 960; x += 34 + r() * 16) P.push([x, y0 + (r() * 2 - 1) * 16 + Math.sin(x / 110) * 12]);
  const top = P.map((p, i) => (i ? "L" : "M") + zr(p[0]) + " " + zr(p[1])).join(""), gid = "zcg" + (++Z_GID);
  let s = `<path d="${top}L960 ${y1}L-20 ${y1}z" fill="${col}"/>`;
  for (let i = 0; i < P.length - 1; i++){ const [ax, ay] = P[i], [bx, by] = P[i + 1], mx = (ax + bx) / 2 + (r() * 2 - 1) * 8, my = Math.max(ay, by) + (y1 - Math.max(ay, by)) * (.35 + r() * .3);
    s += `<polygon points="${zPoly([[ax, ay], [mx, my], [mx - 4, y1], [ax - 3, y1]])}" fill="${shade(col, 1.14)}" opacity=".75"/><polygon points="${zPoly([[mx, my], [bx, by], [bx + 2, y1], [mx - 4, y1]])}" fill="${shade(col, .68)}" opacity=".8"/>`;
    if (r() < .5) s += `<path d="M${zr(ax + 4)} ${zr(ay + (y1 - ay) * .5)}l${zr(10 + r() * 10)} -2" stroke="${shade(col, 1.3)}" stroke-width="2" opacity=".6"/>`; }
  s += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient></defs><path d="${top}L960 ${y1}L-20 ${y1}z" fill="url(#${gid})"/>`;
  s += `<path d="${top}" stroke="${o.rim || "#4e5a38"}" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M-20 ${y1}H960" stroke="#000" stroke-width="10" opacity=".25" filter="url(#zb1)"/>`;
  return s;
}
function zGear(x, y, R, c = "#6a5a4a"){ return `<circle cx="${zr(x)}" cy="${zr(y)}" r="${zr(R)}" fill="none" stroke="${c}" stroke-width="${zr(R * .32)}" stroke-dasharray="${zr(R * .4)} ${zr(R * .32)}"/><circle cx="${zr(x)}" cy="${zr(y)}" r="${zr(R * .72)}" fill="none" stroke="${c}" stroke-width="${zr(R * .3)}"/><circle cx="${zr(x)}" cy="${zr(y)}" r="${zr(R * .2)}" fill="${shade(c, .6)}"/>`; }
function zRat(x, y, flip){ const k = flip ? -1 : 1; return `<g transform="translate(${zr(x)} ${zr(y)}) scale(${k} 1)">${zSh(2, 1, 7, 1.6, .25)}<ellipse cx="0" cy="-3" rx="6" ry="3.4" fill="#4a4440"/><circle cx="5.4" cy="-4" r="2.4" fill="#4a4440"/><circle cx="6.4" cy="-4.6" r=".6" fill="#ff5a3a"/><path d="M-6 -2q-6 3 -10 -1" stroke="#6a5a54" stroke-width="1" fill="none"/></g>`; }
function zWolf(x, y, s = 1, flip, col = "#5a5650"){ const k = flip ? -1 : 1; return `<g transform="translate(${zr(x)} ${zr(y)}) scale(${zr(k * s)} ${zr(s)})">${zSh(4, 2, 22, 4, .3)}<path d="M-18 0l2 -12q-6 -2 -8 -8q4 2 8 2l6 -4h16l6 -6l2 -6l3 5l4 1l-1 5l-4 2l-2 6l-2 14h-4l-1 -11h-12l-2 11h-4l-1 -12z" fill="${col}"/><path d="M-4 -18h12l4 -4l2 4l-2 6l-2 12h-4l-1 -11h-8z" fill="${shade(col, .65)}"/><circle cx="14" cy="-21" r="1" fill="#ffd040"/></g>`; }
function zWisp(K, x, y, c = "#9affc0"){ K.light(x, y, 26, c, .7); return `<circle cx="${zr(x)}" cy="${zr(y)}" r="3.4" fill="#f2fff6"/>`; }
function zBoardwalk(pts, w = 18){ let s = ""; for (let i = 0; i < pts.length - 1; i++){ const [ax, ay] = pts[i], [bx, by] = pts[i + 1], L = Math.hypot(bx - ax, by - ay), a = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
    s += `<g transform="translate(${zr(ax)} ${zr(ay)}) rotate(${zr(a)})"><rect x="2" y="${-w / 2 + 6}" width="${zr(L)}" height="${w}" fill="#000" opacity=".3" filter="url(#zb1)"/><rect x="0" y="${-w / 2}" width="${zr(L)}" height="${w}" fill="#6a4a2c"/>`; for (let x = 3; x < L; x += 7) s += `<path d="M${x} ${-w / 2}v${w}" stroke="#3a2818" stroke-width="1.4"/>`; s += `<path d="M0 ${w / 2}h${zr(L)}" stroke="#3a2818" stroke-width="2.4"/><rect x="${zr(L / 2 - 2)}" y="${w / 2 - 2}" width="4" height="9" fill="#3a2818"/></g>`; }
  return s; }
function zNotice(x, y){ return zSh(x + 10, y + 2, 30, 5, .3) + `<path d="M${x - 24} ${y}v-50M${x + 24} ${y}v-50" stroke="#4a3220" stroke-width="4"/><rect x="${x - 28}" y="${y - 50}" width="56" height="34" fill="#7a5a3a"/><rect x="${x - 28}" y="${y - 50}" width="56" height="4" fill="#5a3e26"/><path d="M${x - 32} ${y - 52}l32 -10l32 10z" fill="#5a3424"/>` + [[-20, -44, "#efe6cc"], [-6, -42, "#e8dcb8"], [8, -45, "#f2ecd8"], [-14, -30, "#e0d4b0"], [4, -31, "#efe6cc"]].map(([ox, oy, c]) => `<rect x="${x + ox}" y="${y + oy}" width="11" height="12" fill="${c}" transform="rotate(${(ox % 7) - 3} ${x + ox + 5} ${y + oy + 6})"/><circle cx="${x + ox + 5.5}" cy="${y + oy + 1.6}" r="1" fill="#8a2a2a"/>`).join(""); }
function zHorse(x, y, col = "#6a4a30", flip){ const k = flip ? -1 : 1; return `<g transform="translate(${zr(x)} ${zr(y)}) scale(${k} 1)">${zSh(4, 2, 26, 5, .3)}<path d="M-20 0l1 -16q-2 -8 4 -12h22l8 -12l4 -2l4 4l-2 6l-6 4l-2 14l-1 14h-4l-1 -12h-16l-2 12h-4l-1 -12l-2 12z" fill="${col}"/><path d="M14 -40l-4 2l-6 10l2 2" fill="#2a1d12"/><path d="M-20 -20q-6 6 -4 16" stroke="#2a1d12" stroke-width="3" fill="none"/></g>`; }
function zBrazier(K, x, y, c = "#ff8a2a"){ K.light(x, y - 30, 50, c, .75); return zSh(x + 6, y + 2, 10, 3, .3) + `<path d="M${x - 6} ${y}l6 -22l6 22M${x - 7} ${y - 8}h14" stroke="#2a2420" stroke-width="2.4" fill="none"/><path d="M${x - 10} ${y - 24}h20l-3 6h-14z" fill="#3a3430"/><path d="M${x - 7} ${y - 24}q2 -12 7 -16q5 6 7 16z" fill="${c}"/><path d="M${x - 3} ${y - 24}q1 -6 3 -9q2 4 3 9z" fill="#ffe08a"/>`; }
function zCairn(x, y, s = 1, c = "#8a867a"){ let g = zSh(x + 8 * s, y + 2, 16 * s, 4 * s, .3); for (let i = 0; i < 5; i++) g += `<ellipse cx="${zr(x + (i % 2 ? 2 : -2) * s)}" cy="${zr(y - i * 7 * s)}" rx="${zr((14 - i * 2.4) * s)}" ry="${zr(4.4 * s)}" fill="${shade(c, 1 - i * .04)}"/><ellipse cx="${zr(x + (i % 2 ? 6 : 2) * s)}" cy="${zr(y - i * 7 * s + 1)}" rx="${zr((8 - i * 1.4) * s)}" ry="${zr(3 * s)}" fill="${shade(c, .7)}"/>`; return g; }
function zArch(x, y, w, h, c = "#8a867a", o = {}){
  const t = 14; let s = zSh(x + w * .3, y + 4, w * .7, 6, .3);
  s += `<path d="M${x - w / 2} ${y}v-${h}q${w / 2} -${w * .5} ${w} 0v${h}h-${t}v-${h}q-${w / 2 - t} -${w * .32} -${w - t * 2} 0v${h}z" fill="${c}"/><path d="M${x + w / 2} ${y}v-${h}l7 -5v${h}z" fill="${shade(c, .6)}"/>`;
  s += `<path d="M${x - w / 2} ${y - h * .5}h${t}M${x + w / 2 - t} ${y - h * .6}h${t}M${x - w / 2} ${y - h * .8}h${t}" stroke="${shade(c, .72)}" stroke-width="1.4"/>`;
  if (o.snow) s += `<path d="M${x - w / 2 - 2} ${y - h}q${w / 2 + 2} -${w * .52} ${w + 4} 0" stroke="#f2f4f6" stroke-width="5" fill="none"/>`;
  return s; }
function zStall2(K, x, y, c, goods){ return Z.stall(x, y, c, "#f2ead6", goods); }

Object.assign(ZS, {
  spire(K){ const r = K.r; K.dress = {noLine:true, veg:.2, fg:null, edge:{dead:4}, mid:{}};
    const st = "#7a746a";
    K.put(116, zWall(K, -20, 122, 590, 116, 46, {wall:st}) + zWall(K, 660, 116, 920, 114, 46, {wall:st}));
    // сам Шпиль: стара чорна вежа над містом
    for (const [x, y] of [[760, 180], [140, 190], [660, 176], [820, 200]]){ const p = K.place(x, y, 60, (px, py) => zTower(K, px, py, 40, 180, {wall:"#4a443e", roof:"#1e1a18", win:"#ffb84a", rh:118, door:true}), {cy:50}); if (p){ K.light(p[0], 60, 110, "#ffb84a", .3); break; } }
    K.put(134, zTower(K, 60, 136, 22, 96, {wall:st, roof:"#2e2a26", win:"#ffb84a"}));
    // кузня Остапа
    K.put(196, zHouse(K, 290, 196, 110, 60, 52, {wall:"#8a8274", roof:"#2e2a28", timber:"#3a2a1a", sign:"#5a4a3a", signIc:"#c0c0c0", chimney:true, cwall:"#5a524a"}) + Z.anvil(372, 218) + Z.barrel(208, 214, "#4a4440")); K.claim(290, 160, 66); K.light(290, 190, 50, "#ff7a2a", .5);
    // дім цілительки
    K.put(214, zHouse(K, 590, 214, 100, 54, 50, {wall:"#d8ccb0", roof:"#4a5a3a", timber:"#4a3424", flowers:true, sign:"#4a7a4a", signIc:"#e8f0c0", shut:"#3a6a4a"}) + [0, 1, 2, 3, 4].map(i => `<path d="M${548 + i * 9} 170v8" stroke="#3a2a1a" stroke-width="1"/><path d="M${545 + i * 9} 178l3 8l3 -8z" fill="${["#6a8a3a", "#8a7a3a", "#5a7a4a"][i % 3]}"/>`).join("")); K.claim(590, 180, 60);
    // міська рада з годинником і банк
    K.place(790, 440, 60, (px, py) => zHouse(K, px, py, 120, 70, 54, {wall:"#a49c8a", roof:"#2e2a28", storeys:2, archWin:true, base:"#6a645a", sign:"#3a3a5a", signIc:"#e8c860"}) + zTower(K, px + 66, py - 4, 16, 104, {wall:"#a49c8a", roof:"#2e2a28"}) + `<circle cx="${px + 66}" cy="${py - 84}" r="8" fill="#efe6cc" stroke="#3a2a1a" stroke-width="1.6"/><path d="M${px + 66} ${py - 84}v-5M${px + 66} ${py - 84}h4" stroke="#1a1612" stroke-width="1.2"/>`, {cy:40});
    K.place(200, 330, 60, (px, py) => zHouse(K, px, py, 110, 64, 50, {wall:"#b8b0a0", roof:"#3a3a40", archWin:true, base:"#7a7466", sign:"#3a6a3a", signIc:"#e8c860"}) + [0, 1, 2].map(i => `<rect x="${px - 44 + i * 36}" y="${py - 64}" width="7" height="62" fill="#ddd6c6"/><rect x="${px - 40 + i * 36}" y="${py - 64}" width="3" height="62" fill="#a8a294"/>`).join(""), {cy:40});
    K.place(160, 470, 46, (px, py) => zHouse(K, px, py, 86, 46, 48, {wall:"#9a9282", roof:"#3a3230", chimney:true, timber:"#3a2a1a"}), {cy:28});
    for (const [x, y] of [[372, 270], [528, 262], [300, 360], [600, 360]]) K.place(x, y, 8, (px, py) => Z.lamp(K, px, py, "#ffb84a"), {npc:1, path:1});
    K.place(450, 300, 20, (px, py) => zBrazier(K, px, py), {path:1, npc:1});
    for (const [x, y, c] of [[360, 420, "#7a3a26"], [520, 430, "#4a5a6a"]]) K.place(x, y, 26, (px, py) => Z.stall(px, py, c, "#cfc6ae"), {npc:1});
    for (let i = 0; i < 10; i++) K.place(260 + r() * 400, 260 + r() * 210, 6, (px, py) => Z.folk(px, py, K.pk(["#5a4a3a", "#4a4a52", "#6a3a26", "#3a4a3a", "#7a6a50"])), {path:1, noclaim:1});
  },
  tavern(K){ const r = K.r; K.dress = {veg:.5, edge:{dead:6}, mid:{rock:3}};
    K.put(220, zHouse(K, 450, 220, 176, 92, 70, {timber:"#3a2a1a", wall:"#cbb48e", roof:"#5a2a1e", storeys:2, sign:"#8a3a1e", signIc:"#c0c0c0", chimney:true, shut:"#5a3a2a", flowers:true})); K.claim(450, 170, 100);
    K.light(450, 200, 120, "#ffc860", .35);
    K.place(240, 270, 30, (px, py) => zNotice(px, py), {npc:1});
    K.place(700, 236, 60, (px, py) => zShed(K, px, py, 110, 50, 50, {wall:"#7a5a3a", roof:"#4a3424", inner:zHorse(px - 10, py - 2, "#6a4a30")}) + zHorse(px + 70, py + 30, "#4a3424", true), {cy:30});
    K.place(150, 400, 36, (px, py) => Z.cart(px, py), {npc:1});
    for (const [x, y] of [[330, 330], [580, 330]]) K.place(x, y, 22, (px, py) => Z.bench(px, py) + Z.barrel(px + 26, py + 2), {npc:1});
    for (const [x, y] of [[360, 240], [540, 240], [300, 420], [620, 420]]) K.place(x, y, 8, (px, py) => Z.lamp(K, px, py), {npc:1, path:1});
    for (let i = 0; i < 6; i++) K.place(260 + r() * 400, 280 + r() * 180, 6, (px, py) => Z.folk(px, py, K.pk(["#5a4a3a", "#6a3a26", "#3a4a5a", "#7a6a50"])), {path:1, noclaim:1});
    K.place(780, 420, 20, (px, py) => Z.barrel(px, py) + Z.barrel(px + 16, py + 4) + Z.crate(px - 18, py + 6));
  },
  forge(K){ const r = K.r; K.dress = {veg:.7, edge:{dead:8}, mid:{rock:6}};
    // покинута кузня з проваленим дахом
    K.put(214, zHouse(K, 430, 214, 150, 74, 64, {wall:"#7a7064", roof:"#3a3430", timber:"#3a2a1a", lit:false, nodoor:true}) + `<path d="M380 150l40 -34l40 30l-20 18z" fill="#1e1a16"/><path d="M386 150l28 -22M420 120l30 24" stroke="#4a3a2a" stroke-width="3"/><path d="M398 214v-36h52v36z" fill="#1a1410"/>` + zGlow(424, 204, 30, "#ff6a2a", .45) + `<rect x="404" y="200" width="40" height="8" fill="#ff7a2a" opacity=".7"/><rect x="474" y="96" width="18" height="70" fill="#5a524a"/><rect x="484" y="96" width="8" height="70" fill="#3a3632"/>` + zSmoke(484, 86, .8, "#8a8680"));
    K.claim(430, 170, 90);
    K.place(300, 260, 20, (px, py) => Z.anvil(px, py) + Z.anvil(px + 34, py + 14));
    for (const [x, y, R] of [[600, 250, 22], [640, 280, 14], [230, 360, 18], [680, 420, 26]]) K.place(x, y, R + 4, (px, py) => zSh(px + 8, py + 2, R, R * .3, .3) + zGear(px, py - R, R, K.pk(["#6a4a3a", "#5a4a40", "#7a5a44"])));
    K.place(560, 200, 20, (px, py) => Z.barrel(px, py, "#4a4440") + Z.barrel(px + 18, py + 6, "#5a4a3a"));
    K.place(250, 430, 30, (px, py) => zSh(px + 10, py + 2, 40, 7, .3) + `<path d="M${px - 36} ${py}q36 -26 72 0z" fill="#3a3632"/>` + [...Array(7)].map((_, i) => `<path d="M${px - 24 + i * 8} ${py - 4 - (i % 3) * 4}l6 -4" stroke="${["#7a5a44", "#8a8478", "#5a4a40"][i % 3]}" stroke-width="3"/>`).join(""));
    for (let i = 0; i < 6; i++) K.place(200 + r() * 500, 280 + r() * 200, 6, (px, py) => zRat(px, py, r() < .5), {path:1, noclaim:1});
  },
  ford(K){ const r = K.r; K.dress = {veg:.7, edge:{dead:7, willow:2}, mid:{rock:4}};
    // кам'яний брід: плоскі камені впоперек ріки
    for (let i = -4; i <= 4; i++){ const y = 380 + i * 3, x = zRiverX(y) + i * 12; K.put(y + 6, `<ellipse cx="${x + 2}" cy="${y + 4}" rx="12" ry="5" fill="#1a2a30" opacity=".6"/><ellipse cx="${x}" cy="${y}" rx="11" ry="4.6" fill="#8a867a"/><ellipse cx="${x - 2}" cy="${y - 1}" rx="7" ry="2.4" fill="#a8a498"/>`); }
    // хата перевізника на палях
    K.place(220, 180, 50, (px, py) => [-30, -8, 16, 34].map(ox => `<path d="M${px + ox} ${py + 18}v-20" stroke="#3a2a1a" stroke-width="4"/>`).join("") + zHouse(K, px, py, 84, 42, 46, {wall:"#7a7064", roof:"#3e3832", timber:"#3a2a1a", chimney:true, sign:"#5a4a3a", signIc:"#8ab0c0"}), {cy:30});
    // пором на канаті
    const fy = 210, fx = zRiverX(fy); K.put(fy - 30, `<path d="M${fx - 74} ${fy - 30}L${fx + 74} ${fy - 40}" stroke="#4a3a2a" stroke-width="1.6"/><path d="M${fx - 74} ${fy - 30}v-26M${fx + 74} ${fy - 40}v-26" stroke="#3a2a1a" stroke-width="4"/>`);
    K.put(fy + 8, zSh(fx + 6, fy + 10, 40, 8, .35) + `<path d="M${fx - 34} ${fy}h68l-4 10h-60z" fill="#6a4a2a"/><path d="M${fx - 34} ${fy}h68l4 -6h-68z" fill="#8a6a44"/><path d="M${fx - 20} ${fy - 6}v-22" stroke="#3a2a1a" stroke-width="2"/>` + Z.crate(fx + 12, fy - 2, 12, "#7a5a3a"));
    for (let i = 0; i < 12; i++){ const y = 90 + r() * 420, side = r() < .5 ? -1 : 1, x = zRiverX(y) + side * (58 + r() * 10); K.put(y, zReeds(x, y, 1, r)); }
    K.place(140, 420, 30, (px, py) => Z.boat(px, py, 1, "#5a4a3a", true), {npc:1}); K.place(760, 160, 8, (px, py) => Z.lamp(K, px, py, "#d0e0ff"));
  },
  ruins(K){ const r = K.r; K.dress = {veg:.9, edge:{dead:7, bush:3}, mid:{rock:6}};
    K.put(170, zWall(K, -20, 176, 300, 166, 80, {wall:"#8a8274", ruin:true, seed:1}) + zWall(K, 600, 166, 920, 176, 74, {wall:"#8a8274", ruin:true, seed:4}));
    K.put(178, zTower(K, 330, 182, 30, 120, {wall:"#8a8274", flat:true}) + `<path d="M300 66l20 18l14 -10l14 16l14 -6v-20h-62z" fill="#3a3a30" opacity=".0"/>`); K.claim(330, 130, 50);
    K.put(150, zKeep(K, 650, 150, 60, 70, 30, {wall:"#7a7468"})); K.claim(650, 110, 40);
    // спуск у склепи
    K.place(560, 270, 34, (px, py) => Z.stair(K, px, py, 54, "#7aff9a") + zArch(px, py - 24, 70, 34, "#7a7468"), {path:1, npc:1});
    for (let i = 0; i < 14; i++) K.place(120 + r() * 680, 220 + r() * 290, 12, (px, py) => zRock(px, py, .5 + r() * .5, "#8a8274", {moss:r() < .4}));
    K.place(200, 300, 12, (px, py) => Z.banner(px, py, 70, "#5a4a3a", "#9a8a6a", {torn:true}));
    for (let i = 0; i < 6; i++) K.place(200 + r() * 520, 260 + r() * 240, 8, (px, py) => zBone(px, py, 1.2, r), {path:1, noclaim:1});
    K.fog = true; K.fogOp = .08;
  },
  ravine(K){ const r = K.r; K.dress = {veg:.7, noLine:true, edge:{pine:6, bush:3}, mid:{rock:8, bush:2}};
    K.under += zCliffBand(K, 70, 186, "#6e6a60");
    for (let x = -10; x < 920; x += 26 + r() * 20) if (!K.exits.some(([ex, ey]) => Math.abs(ex - x) < 70 && ey < 140)) K.under += zPine(x, 72 + (r() * 2 - 1) * 12, .6 + r() * .3, {pal:Z_PAL.pineDk});
    K.place(620, 190, 50, (px, py) => Z.cave(K, px, py, 54, 64), {cy:30, exit:1});
    for (const [x, y, f] of [[700, 150, 0], [520, 160, 1]]) K.put(y, zWolf(x, y, 1, f, "#4a4640"));
    for (let i = 0; i < 10; i++) K.place(150 + r() * 650, 220 + r() * 280, 8, (px, py) => zBone(px, py, 1.3, r), {path:1, noclaim:1});
    K.under += `<path d="M-20 198q200 10 400 -4t540 6" stroke="#000" stroke-width="18" opacity=".18" filter="url(#zb1)" fill="none"/>`;
    K.c.mood = "dusk";
  },
  swamp(K){ const r = K.r; K.dress = {veg:1, edge:{willow:4, dead:8}, mid:{reeds:14, bush:2}, pools:7}; K.fog = true; K.fogOp = .16;
    K.place(240, 240, 40, (px, py) => zBoardwalk([[px - 90, py + 20], [px - 30, py], [px + 40, py + 10]]), {path:1});
    K.place(680, 400, 40, (px, py) => zBoardwalk([[px - 60, py], [px + 10, py - 14], [px + 80, py - 4]]), {path:1});
    K.place(640, 200, 40, (px, py) => zShed(K, px, py, 70, 34, 40, {wall:"#4a4436", roof:"#2e2a22"}) + `<path d="M${px - 30} ${py - 34}l60 -10" stroke="#1a1612" stroke-width="5"/>`, {cy:20});
    K.place(150, 420, 30, (px, py) => `<g transform="rotate(-12 ${px} ${py})">${Z.boat(px, py, .9, "#3a3020")}</g>`);
    for (let i = 0; i < 9; i++){ const x = 120 + r() * 660, y = 130 + r() * 330; K.top += zWisp(K, x, y, r() < .5 ? "#9affc0" : "#a0d8ff"); }
  },
  camp(K){ const r = K.r; K.dress = {veg:.4, edge:{dead:6}, mid:{rock:3}};
    let pl = ""; for (let x = -10; x < 920; x += 13){ if (K.exits.some(([ex, ey]) => Math.abs(ex - x) < 46 && ey < 160)) continue; pl += `<path d="M${x} 118v-56l6.5 -10 6.5 10v56z" fill="${x % 26 ? "#5a3e26" : "#4a3420"}"/>`; } K.put(118, `<rect x="0" y="110" width="${ZW}" height="12" fill="#000" opacity=".25" filter="url(#zb1)"/>` + pl);
    for (const x of [120, 780]) K.put(124, zTower(K, x, 126, 18, 96, {wall:"#5a3e26", roof:"#3a2a1a", flat:true}));
    // намет капітана Ярема
    K.put(190, zPavilion(K, 420, 188, 58, 98, "#7a2a22", "#1e1a18", {flag:"#c9a24a"})); K.claim(420, 150, 70);
    // крамниця маркітанта
    K.place(650, 268, 40, (px, py) => Z.stall(px, py, "#6a5a3a", "#cfc6ae", `<rect x="${px - 18}" y="${py - 22}" width="10" height="8" fill="#8a2a2a"/><rect x="${px - 4}" y="${py - 22}" width="10" height="8" fill="#3a5a7a"/><rect x="${px + 10}" y="${py - 22}" width="8" height="8" fill="#c9a24a"/>`) + Z.cart(px + 70, py + 16), {npc:1});
    for (const [x, y] of [[240, 200], [600, 190], [760, 260], [180, 330], [720, 470], [260, 460]]) K.place(x, y, 38, (px, py) => zTent(K, px, py, 60, 48, 48, K.pk(["#8a7454", "#7a6a50", "#6a5a42"])), {cy:20});
    K.place(330, 330, 30, (px, py) => Z.fire(K, px, py), {npc:1});
    for (const [x, y] of [[520, 380], [560, 410]]) K.place(x, y, 12, (px, py) => Z.dummy(px, py));
    K.place(440, 450, 22, (px, py) => Z.rack(px, py));
    for (const [x, y] of [[300, 150], [540, 150]]) K.place(x, y, 10, (px, py) => Z.banner(px, py, 70, "#7a2a22", "#1e1a18"), {npc:1});
    for (let i = 0; i < 7; i++) K.place(220 + r() * 480, 260 + r() * 200, 6, (px, py) => Z.folk(px, py, K.pk(["#4a3a2a", "#7a2a22", "#3a3a3a", "#5a4a3a"])), {path:1, noclaim:1});
  },
  chapel(K){ const r = K.r; K.dress = {veg:1.1, edge:{dead:12}, mid:{rock:4, dead:2}}; K.fog = true; K.fogCol = "#b8b8c8"; K.fogOp = .12;
    K.put(214, zGothic(K, 470, 212, 150, 100, 90, {wall:"#4a4440", gh:60, lit:"#ffb84a"}) + zTower(K, 370, 216, 26, 160, {wall:"#4a4440", roof:"#1a1816", win:"#ffb84a", rh:80})); K.claim(450, 150, 110);
    K.light(470, 170, 90, "#ffb84a", .3);
    // цвинтар за кованою огорожею
    const G = []; for (let i = 0; i < 16; i++){ const x = 150 + (i % 8) * 86 + (r() * 2 - 1) * 10, y = 300 + Math.floor(i / 8) * 150 + (r() * 2 - 1) * 20; G.push([x, y]); }
    for (const [x, y] of G) K.place(x, y, 12, (px, py) => r() < .6 ? Z.grave(px, py, K.pk(["#6a6660", "#5a5650", "#7a766c"])) : Z.cross(px, py, 1, "#3a3430"));
    K.place(170, 250, 40, (px, py) => Z.fence([[px - 60, py], [px + 60, py - 6]], "#1e1c1a"), {noclaim:1}); K.place(730, 250, 40, (px, py) => Z.fence([[px - 60, py - 6], [px + 60, py]], "#1e1c1a"), {noclaim:1});
    for (let i = 0; i < 7; i++) K.place(200 + r() * 500, 260 + r() * 240, 5, (px, py) => { K.light(px, py - 8, 14, "#ffc860", .7); return `<rect x="${px - 2}" y="${py - 8}" width="4" height="8" fill="#efe6cc"/><path d="M${px} ${py - 8}q-2 -4 0 -7q2 3 0 7z" fill="#ffd27a"/>`; }, {noclaim:1});
    for (let i = 0; i < 10; i++) K.top += Z.crow(150 + r() * 600, 40 + r() * 70, 1.2);
    K.c.mood = "dark";
  },
  pass(K){ const r = K.r; K.dress = {veg:.6, noLine:true, edge:{pine:8}, mid:{rock:6, pine:1}};
    let m = ""; for (const [x, y, w, h] of [[80, 190, 170, 170], [300, 150, 150, 120], [640, 170, 190, 190], [860, 200, 160, 160], [470, 120, 110, 80]]) m += zMount(x, y, w, h, {snow:true, col:"#7d8380"});
    K.under += `<rect x="0" y="0" width="${ZW}" height="200" fill="#c8d4e0" opacity=".25"/>` + m;
    K.place(450, 250, 50, (px, py) => zArch(px, py, 100, 70, "#8a867a", {snow:true}), {path:1, npc:1});
    K.place(250, 330, 20, (px, py) => zCairn(px, py, 1.2, "#8a867a"));
    K.place(640, 300, 12, (px, py) => Z.banner(px, py, 70, "#3a5a7a", "#f2f4f6", {torn:true}));
    for (let i = 0; i < 10; i++) K.place(120 + r() * 680, 230 + r() * 280, 14, (px, py) => zRock(px, py, .5 + r() * .5, "#8a8e93", {snow:true}));
    let sn = ""; for (let i = 0; i < 60; i++){ const x = r() * ZW, y = r() * ZH; sn += `<path d="M${zr(x)} ${zr(y)}l${zr(10 + r() * 14)} ${zr(2 + r() * 3)}" stroke="#fff" stroke-width="${zr(.8 + r())}" opacity="${zr(.25 + r() * .3)}"/>`; } K.top += sn;
  },
});
