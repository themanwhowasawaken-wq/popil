/* ============ нові краї: багатший візуал сцен (Марка, Трясовина, Землі Світанку й Ночі) ============ */
const NSC = {
  tuft:(x, y, s, c) => { const h = 6 * s; return `<path d="M${zr(x)} ${zr(y)}l-2.4 -${zr(h)}M${zr(x + 1.5)} ${zr(y)}l.4 -${zr(h * 1.3)}M${zr(x + 3)} ${zr(y)}l2.6 -${zr(h)}M${zr(x + 4.5)} ${zr(y)}l4 -${zr(h * .7)}" stroke="${c}" stroke-width="1.2" stroke-linecap="round" fill="none"/>`; },
  thistle:(x, y, s) => zSh(x + 3, y + 1, 6 * s, 2, .22) + `<path d="M${zr(x)} ${zr(y)}v-${zr(16 * s)}M${zr(x)} ${zr(y - 6 * s)}l-${zr(5 * s)} -${zr(6 * s)}M${zr(x)} ${zr(y - 9 * s)}l${zr(5 * s)} -${zr(6 * s)}" stroke="#4a4a30" stroke-width="1.5" fill="none"/><circle cx="${zr(x)}" cy="${zr(y - 17 * s)}" r="${zr(3 * s)}" fill="#8a5a8a"/><circle cx="${zr(x)}" cy="${zr(y - 16 * s)}" r="${zr(2 * s)}" fill="#5a3a5a"/>`,
  spear:(x, y, s, c = "#4a3a2a") => zSh(x + 4, y + 1, 7 * s, 2, .25) + `<path d="M${zr(x)} ${zr(y)}l${zr(8 * s)} -${zr(40 * s)}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M${zr(x + 7 * s)} ${zr(y - 38 * s)}l${zr(1.6 * s)} -${zr(9 * s)}l${zr(3 * s)} ${zr(9 * s)}z" fill="#9aa4a8"/>`,
  arrows:(x, y, s) => zSh(x + 3, y + 1, 7 * s, 2, .2) + `<path d="M${zr(x)} ${zr(y)}l${zr(3 * s)} -${zr(18 * s)}M${zr(x + 5 * s)} ${zr(y + 1)}l${zr(2 * s)} -${zr(16 * s)}M${zr(x - 5 * s)} ${zr(y + 1)}l${zr(4 * s)} -${zr(15 * s)}" stroke="#6a5a3a" stroke-width="1.4"/><path d="M${zr(x + 3 * s)} ${zr(y - 18 * s)}l-1.6 -3M${zr(x + 7 * s)} ${zr(y - 15 * s)}l-1.6 -3M${zr(x - 1 * s)} ${zr(y - 14 * s)}l-1.6 -3" stroke="#d8d0b8" stroke-width="1.6"/>`,
  banner:(x, y, s, a, b) => zSh(x + 6, y + 1, 10 * s, 2.6, .26) + `<path d="M${zr(x)} ${zr(y)}l${zr(3 * s)} -${zr(54 * s)}" stroke="#3a2c1e" stroke-width="2.4"/><path d="M${zr(x + 3 * s)} ${zr(y - 52 * s)}q${zr(14 * s)} ${zr(4 * s)} ${zr(24 * s)} -${zr(2 * s)}l-${zr(6 * s)} ${zr(10 * s)}l${zr(5 * s)} ${zr(10 * s)}q-${zr(12 * s)} ${zr(3 * s)} -${zr(23 * s)} ${zr(-2 * s)}z" fill="${a}"/><circle cx="${zr(x + 13 * s)}" cy="${zr(y - 45 * s)}" r="${zr(3.4 * s)}" fill="${b}"/>`,
  wheel:(x, y, s) => zSh(x + 4, y + 2, 16 * s, 4, .26) + `<ellipse cx="${zr(x)}" cy="${zr(y - 8 * s)}" rx="${zr(13 * s)}" ry="${zr(11 * s)}" fill="none" stroke="#4a3622" stroke-width="2.4"/><path d="M${zr(x)} ${zr(y - 8 * s - 11 * s)}v${zr(22 * s)}M${zr(x - 13 * s)} ${zr(y - 8 * s)}h${zr(26 * s)}M${zr(x - 9 * s)} ${zr(y - 8 * s - 8 * s)}l${zr(18 * s)} ${zr(16 * s)}" stroke="#4a3622" stroke-width="1.4"/>`,
  pile:(K, x, y, s) => { let g = zSh(x + 6, y + 2, 22 * s, 5, .3); for (const [dx, dy] of [[-8, 0], [6, 1], [-1, -5], [12, -3], [-12, -4]]) g += zSkull(x + dx * s, y + dy * s, .75 * s); return g; },
  puddle:(x, y, rx, c = "#2a3236") => `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(rx)}" ry="${zr(rx * .3)}" fill="${c}" opacity=".85"/><ellipse cx="${zr(x - rx * .25)}" cy="${zr(y - rx * .06)}" rx="${zr(rx * .5)}" ry="${zr(rx * .1)}" fill="#a8b8bc" opacity=".25"/>`,
  lily:(x, y, s) => { let g = ""; for (const [dx, dy, k] of [[0, 0, 1], [9, 3, .8], [-7, 4, .7]]) g += `<ellipse cx="${zr(x + dx * s)}" cy="${zr(y + dy * s)}" rx="${zr(6 * k * s)}" ry="${zr(2.2 * k * s)}" fill="#3a5a30"/><path d="M${zr(x + dx * s)} ${zr(y + dy * s)}l${zr(5 * k * s)} -${zr(1 * s)}" stroke="#1a2a18" stroke-width=".8"/>`; return g + `<circle cx="${zr(x + 2 * s)}" cy="${zr(y - 1.5 * s)}" r="${zr(1.6 * s)}" fill="#e8c0d0"/>`; },
  shroom:(K, x, y, s, c = "#6aff9a") => { K.light(x, y - 3, 22 * s, c, .5); return `<path d="M${zr(x)} ${zr(y)}v-${zr(5 * s)}" stroke="#d8e8d0" stroke-width="${zr(2 * s)}"/><path d="M${zr(x - 4 * s)} ${zr(y - 5 * s)}q${zr(4 * s)} -${zr(6 * s)} ${zr(8 * s)} 0z" fill="${c}"/>`; },
  ember:(K, x, y) => { K.light(x, y, 20, "#ff8a3a", .45); return `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="7" ry="2.4" fill="#2a1a14"/><circle cx="${zr(x - 2)}" cy="${zr(y - 1)}" r="1.5" fill="#ffb04a"/><circle cx="${zr(x + 2)}" cy="${zr(y)}" r="1.1" fill="#ff6a2a"/>`; },
  fence:(x, y, n, c = "#4a3a28") => { let g = ""; for (let i = 0; i < n; i++){ const px = x + i * 12, l = (i * 7 % 5 - 2) * 1.2; g += `<path d="M${zr(px)} ${zr(y)}l${zr(l)} -${zr(18 - (i % 3) * 3)}" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`; if (i % 2 === 0 && i < n - 1) g += `<path d="M${zr(px)} ${zr(y - 11)}l12 ${zr(l * .5)}" stroke="${c}" stroke-width="1.6"/>`; } return zSh(x + n * 6, y + 2, n * 7, 2.4, .22) + g; },
};
// великі м'які плями землі: темніші мокрі й світліші сухі, щоб земля не була пласкою
function nsGround(K, dark, light, n = 9){
  const r = K.r; let s = "";
  for (let i = 0; i < n; i++){ const x = r() * ZW, y = 120 + r() * 400, rx = 60 + r() * 130, ry = 22 + r() * 40; if (K.wet(x, y, 20)) continue;
    s += `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(rx)}" ry="${zr(ry)}" fill="${i % 3 ? dark : light}" opacity="${i % 3 ? .42 : .3}" filter="url(#zb3)"/>`; }
  return s;
}
function nsDecor(K){
  const id = K.id, reg = id.slice(0, 2), r = K.r, safe = K.safe, q = safe ? .55 : 1, g0 = K.Bm.ground[0];
  const pick = a => a[Math.floor(r() * a.length)];
  const sc = (n, rad, fn, o = {}) => K.scatter(Math.round(n * q), rad, fn, o);
  if (reg === "mk"){
    K.under += nsGround(K, shade(g0, .62), shade(g0, 1.25), 10);
    let t = ""; for (let i = 0; i < 90 * q; i++){ const x = r() * ZW, y = 90 + r() * 450; if (K.wet(x, y, 4) || K.onPath(x, y, 3)) continue; t += NSC.tuft(x, y, .8 + r() * .7, pick(["#7a6a42", "#6a5c38", "#8a7a52", "#5a5a3a"])); }
    K.under += t;
    sc(12, 8, (x, y) => NSC.thistle(x, y, .8 + r() * .5));
    sc(3, 24, (x, y) => NSC.pile(K, x, y, .9 + r() * .4), {claim:true});
    sc(4, 10, (x, y) => NSC.spear(x, y, .8 + r() * .4));
    sc(3, 30, (x, y) => NSC.fence(x, y, 5 + (r() * 4 | 0)), {claim:true});
    if (!safe) for (let i = 0; i < 2; i++) K.light(120 + r() * 660, 300 + r() * 190, 34, "#8affb0", .16);
    K.fog = true; K.fogCol = "#b8c4b8"; K.fogOp = .12;
  } else if (reg === "bg"){
    K.under += nsGround(K, "#14241a", shade(g0, 1.4), 10);
    let t = ""; for (let i = 0; i < 110 * q; i++){ const x = r() * ZW, y = 90 + r() * 450; if (K.onPath(x, y, 3)) continue; t += NSC.tuft(x, y, .9 + r() * .8, pick(["#4a6a38", "#3a5a30", "#5a7a40", "#2e4a2a"])); }
    K.under += t;
    for (let i = 0; i < 8 * q; i++){ const x = 40 + r() * 820, y = 150 + r() * 380; if (K.free(x, y, 18, {npc:0})) K.under += NSC.puddle(x, y, 18 + r() * 34, "#1c2e30"); }
    sc(7, 16, (x, y) => NSC.lily(x, y, .9 + r() * .5), {wet:1});
    sc(6, 8, (x, y) => NSC.shroom(K, x, y, .9 + r() * .6, pick(["#6aff9a", "#9affd8", "#c8ff7a"])));
    if (!safe) for (let i = 0; i < 3; i++) K.light(100 + r() * 700, 180 + r() * 330, 46, "#7aff9a", .55);
    sc(2, 30, (x, y) => NSC.fence(x, y, 5, "#3a3422"), {claim:true});
    K.fog = true; K.fogCol = "#a8c0b0"; K.fogOp = .17;
  } else if (reg === "or"){
    const dawn = ["or_dawn", "or_sun", "or_cathedral"].includes(id), night = ["or_night", "or_lists", "or_keep", "or_grave"].includes(id);
    const ba = dawn ? "#e8dcb0" : night ? "#4a3a6a" : pick(["#e8dcb0", "#4a3a6a"]), bb = dawn ? "#d9a441" : night ? "#c8ccd8" : "#c8ccd8";
    K.under += nsGround(K, shade(g0, .6), shade(g0, 1.25), 10);
    for (let i = 0; i < 2; i++){ const y0 = 190 + r() * 300, x0 = -20 + r() * 200; if (!K.onPath(450, y0, 400)) K.under += `<path d="M${zr(x0)} ${zr(y0)}q${zr(300)} ${zr(-30 + r() * 60)} ${zr(940)} ${zr(-20 + r() * 40)}M${zr(x0)} ${zr(y0 + 7)}q${zr(300)} ${zr(-30 + r() * 60)} ${zr(940)} ${zr(-20 + r() * 40)}" stroke="#2a2016" stroke-width="2.2" opacity=".3" fill="none"/>`; }
    let t = ""; for (let i = 0; i < 70 * q; i++){ const x = r() * ZW, y = 90 + r() * 450; if (K.wet(x, y, 4) || K.onPath(x, y, 3)) continue; t += NSC.tuft(x, y, .8 + r() * .6, pick(["#7a7450", "#6a6444", "#8a8458"])); }
    K.under += t;
    for (let i = 0; i < 5 * q; i++){ const x = 60 + r() * 780, y = 160 + r() * 360; if (K.free(x, y, 16)) K.under += NSC.puddle(x, y, 14 + r() * 24, "#2e2620"); }
    sc(9, 10, (x, y) => r() < .6 ? NSC.spear(x, y, .8 + r() * .4) : NSC.arrows(x, y, .9 + r() * .4));
    sc(4, 14, (x, y) => NSC.banner(x, y, .9 + r() * .3, ba, bb), {claim:true});
    sc(2, 24, (x, y) => NSC.wheel(x, y, .9 + r() * .4), {claim:true});
    if (!safe || night) sc(4, 14, (x, y) => NSC.ember(K, x, y));
    K.fog = true; K.fogCol = dawn ? "#e8e0c8" : "#9a98b0"; K.fogOp = .1;
  }
}
(function(){
  const o = zDress;
  zDress = function(K){ o(K); if (/^(mk|bg|or)_/.test(K.id)) nsDecor(K); };
})();
