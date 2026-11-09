/* ============ локації на карті: у кожної своя діорама ============ */
// усе малюється в масштабі 1 навколо точки локації; підпис праворуч від маркера лишається вільним
const SITE_RH = {h:null};
function siteRoadHash(){
  if (!SITE_RH.h){ const h = maHash(30); for (const rd of ROADS) for (const [x, y] of roadPts(rd, 110)) h.add(x, y, 4); SITE_RH.h = h; }
  return SITE_RH.h;
}
// масштаб діорами: усе малюється в «місцевих» координатах і збільшується навколо точки локації
const SITE_K = {mk_crows:1.15, order_camp:1.1, camp:1.05, or_dawn:1.1, or_night:1.1, citadel:1.15, mk_throne:1.15, or_keep:1.15, mk_bell:1.15, ruins:1.2, mizh:1.1, bg_village:1.15, bg_sunk:1.2, bg_lair:1.15, bg_eye:1.15, bg_abbey:1.2, bg_midges:1.2, mk_field:1.1, or_moat:1.15, or_lists:1.15, fair:1.25, mk_road:1.2, bg_gat:1.1};
function siteCtx(id, r, water){
  const n = NODES[id], x = n.x, y = n.y, RH = siteRoadHash(), items = [], foot = [], K = SITE_K[id] || 1.35;
  const Wd = (px, py) => [x + (px - x) * K, y + (py - y) * K], Lc = (wx, wy) => [x + (wx - x) / K, y + (wy - y) / K];
  const C = {
    id, n, x, y, r, water, items, foot, ground:"", top:"", K, Lc, Wd,
    rpts(rd, from){ let P = roadPts(rd, 140).map(p => Lc(p[0], p[1])); if (from && rd.b === from) P = P.reverse(); return P; },
    put(py, svg){ items.push([py, svg]); },
    wet(px, py, e = 0){ const [wx, wy] = Wd(px, py); return !!(water && water.hit(wx, wy, e * K)); },
    road(px, py, e = 0){ const [wx, wy] = Wd(px, py); return RH.hit(wx, wy, e * K); },
    clear(px, py, rad = 6, o = {}){
      const [wx, wy] = Wd(px, py), wr = rad * K;
      if (!o.road && RH.hit(wx, wy, wr * .8 + 3)) return false;
      if (!o.wet && water && water.hit(wx, wy, wr * .5)) return false;
      if (!o.mark && Math.hypot(wx - x, (wy - y) * 1.2) < 12 + wr * .7) return false;
      if (!o.label && wx + wr > x + 8 && wx - wr < x + 150 && wy + wr * .2 > y - 15 && wy - wr * .5 < y + 13) return false;
      if (!o.foot && foot.some(([fx, fy, fr]) => Math.hypot(px - fx, (py - fy) * 1.5) < fr + rad * .8)) return false;
      return true;
    },
    // місце для головної споруди радіусом R: перше з бажаних, що вільне від доріг і підпису
    spot(R, cands, o = {}){
      let best = null, bs = -1;
      for (const [ox, oy] of cands){ const ax = x + ox, ay = y + oy; let sc = 0, N = 0;
        for (let a = 0; a < 6.28; a += .7) for (const k of [0, .5, 1]){ N++; if (C.clear(ax + Math.cos(a) * R * k, ay - R * .45 + Math.sin(a) * R * .55 * k, 1, o)) sc++; }
        if (sc / N > .97) return [ax, ay]; if (sc > bs){ bs = sc; best = [ax, ay]; } }
      return best;
    },
    claim(px, py, rad){ foot.push([px, py, rad]); },
    // поставити річ біля бажаного місця (з невеликим зсувом, якщо там дорога чи підпис)
    place(px, py, rad, fn, o = {}){ for (const [ox, oy] of [[0, 0], [8, 0], [-8, 0], [0, -7], [0, 7], [12, -6], [-12, -6], [14, 6], [-14, 6], [18, 0], [-18, 0]]){ const qx = px + ox, qy = py + oy; if (C.clear(qx, qy, rad, o)){ C.put(qy, fn(qx, qy)); if (!o.noclaim) C.claim(qx, qy, rad); return [qx, qy]; } } return null; },
    // головна споруда: обирає вільне місце, ставить і бронює
    main(R, cands, fn, o = {}){ const [ax, ay] = C.spot(R, cands, o); C.put(ay + (o.dy || 0), fn(ax, ay)); C.claim(ax, ay - R * .35, R); return [ax, ay]; },
    // розкидати дрібниці кільцем навколо точки
    scatter(cnt, r0, r1, rad, fn, o = {}){ const cx = o.cx ?? x, cy = o.cy ?? y; let k = 0;
      for (let i = 0; i < cnt; i++) for (let t = 0; t < (o.tries || 10); t++){ const a = r() * 6.283, d = r0 + r() * (r1 - r0), px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * (o.fl || .6);
        if (!C.clear(px, py, rad, o)) continue; C.put(py, fn(px, py, k++)); if (o.claim) C.claim(px, py, rad); break; } },
    // річка поруч: найближча точка й напрям течії
    river(px, py, maxd = 90){ if (!water || !water.lines) return null; let best = null, bd = maxd; const [qx, qy] = Wd(px, py);
      for (const L of water.lines){ const P = L.p; for (let i = 1; i < P.length - 1; i++){ const d = Math.hypot(P[i][0] - qx, P[i][1] - qy); if (d < bd){ bd = d; const [lx, ly] = Lc(P[i][0], P[i][1]); best = {x:lx, y:ly, ang:Math.atan2(P[i + 1][1] - P[i - 1][1], P[i + 1][0] - P[i - 1][0]), w:L.w / K, d}; } } }
      return best; },
    // напрям дороги біля точки
    roadDir(px, py, maxd = 60){ let best = null, bd = maxd;
      for (const rd of ROADS){ if (rd.a !== id && rd.b !== id) continue; const P = roadPts(rd, 110); for (let i = 1; i < P.length - 1; i++){ const d = Math.hypot(P[i][0] - px, P[i][1] - py); if (d < bd){ bd = d; best = {x:P[i][0], y:P[i][1], ang:Math.atan2(P[i + 1][1] - P[i - 1][1], P[i + 1][0] - P[i - 1][0])}; } } }
      return best; },
    gates(){ return ROADS.filter(rd => rd.a === id || rd.b === id).map(rd => Math.atan2(rd.cy - n.y, rd.cx - n.x)); },
    out(){ items.sort((a, b) => a[0] - b[0]); const body = (C.ground + items.map(v => v[1]).join("") + C.top).replace(/\d+\.\d{3,}/g, m => (+m).toFixed(1)); return K === 1 ? body : `<g transform="translate(${x} ${y}) scale(${K}) translate(${-x} ${-y})">${body}</g>`; }
  };
  return C;
}

/* ---------- дрібні речі ---------- */
const msSh = (x, y, rx, ry, o = .28) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#0b0906" opacity="${o}"/>`;
function msGround(x, y, rx, ry, c, o = .35){ let s = ""; for (let i = 0; i < 3; i++){ const k = 1 - i * .22; s += `<ellipse cx="${x + i * 2}" cy="${y + i}" rx="${rx * k}" ry="${ry * k}" fill="${c}" opacity="${o * (.45 + i * .2)}"/>`; } return s; }
function msBlob(r, x, y, R, c, o = .35, n = 5){ let s = ""; for (let i = 0; i < n; i++){ const a = r() * 6.283, d = r() * R * .45; s += `<ellipse cx="${x + Math.cos(a) * d}" cy="${y + Math.sin(a) * d * .5}" rx="${R * (.45 + r() * .35)}" ry="${R * (.22 + r() * .16)}" fill="${c}" opacity="${o}"/>`; } return s; }
function msGlow(x, y, R, c, o = .5){ return `<circle cx="${x}" cy="${y}" r="${R}" fill="${c}" opacity="${o * .22}"/><circle cx="${x}" cy="${y}" r="${R * .55}" fill="${c}" opacity="${o * .4}"/><circle cx="${x}" cy="${y}" r="${R * .25}" fill="${c}" opacity="${o * .7}"/>`; }
function msFire(x, y, s = 1, c = "#ff8a2a", c2 = "#ffd86a"){ return msGlow(x, y - 3 * s, 15 * s, c, .55) + `<path d="M${x - 5 * s} ${y}l${10 * s} -${2.4 * s}M${x - 5 * s} ${y - 2.4 * s}l${10 * s} ${2.4 * s}" stroke="#3a2414" stroke-width="${1.8 * s}"/><path d="M${x - 3.4 * s} ${y - .5}q${s} -${6 * s} ${3.4 * s} -${9 * s}q${2.4 * s} ${3 * s} ${3.4 * s} ${9 * s}z" fill="${c}"/><path d="M${x - 1.6 * s} ${y - .5}q${.6 * s} -${3.4 * s} ${1.6 * s} -${5.4 * s}q${1.2 * s} ${2 * s} ${1.6 * s} ${5.4 * s}z" fill="${c2}"/>`; }
function msSmoke(x, y, s = 1, c = "#a8a498"){ let o = ""; for (let i = 0; i < 4; i++) o += `<circle cx="${x + i * 3 * s + Math.sin(i) * 2 * s}" cy="${y - i * 6 * s}" r="${(2.6 + i * 1.3) * s}" fill="${c}" opacity="${.32 - i * .06}"/>`; return o; }
function msFolk(x, y, c = "#7a3a26", hood){ return msSh(x + 1.5, y + .4, 2.4, .8, .25) + `<path d="M${x - 1.8} ${y}l.6 -5h2.4l.6 5z" fill="${c}"/><circle cx="${x}" cy="${y - 6.2}" r="1.4" fill="${hood ? c : "#e0b890"}"/>`; }
function msBanner(x, y, h, c, c2 = "#e8c060", o = {}){
  let s = msSh(x + 3, y + .5, 4, 1, .25) + `<path d="M${x} ${y}v-${h}" stroke="#2a2218" stroke-width="1.5"/><path d="M${x - 4.5} ${y - h + 1.5}h9" stroke="#2a2218" stroke-width="1.2"/><circle cx="${x}" cy="${y - h - .6}" r="1.2" fill="${c2}"/>`;
  const w = 8, bh = o.bh || h * .48, ty = y - h + 1.5;
  s += `<path d="M${x - w / 2} ${ty}h${w}v${bh}l-${w / 2} -${bh * .2}l-${w / 2} ${bh * .2}z" fill="${c}"/><path d="M${x} ${ty}h${w / 2}v${bh}l-${w / 2} -${bh * .2}z" fill="#000" opacity=".22"/>`;
  if (o.moon) s += `<path d="M${x + 1.2} ${ty + bh * .25}a3 3 0 1 0 0 ${bh * .4}a2.3 2.3 0 1 1 0 -${bh * .4}z" fill="${c2}"/>`;
  else s += `<circle cx="${x}" cy="${ty + bh * .45}" r="${Math.min(2.4, bh * .2)}" fill="${c2}"/>`;
  if (o.torn) s += `<path d="M${x - 2} ${ty + bh * .7}l2 3 1 -2" stroke="#1d1812" stroke-width="1.2" fill="none"/>`;
  return s;
}
function msBarrel(x, y, c = "#7a5232"){ return msSh(x + 2.4, y + .5, 3.6, 1.1, .25) + `<rect x="${x - 3}" y="${y - 7}" width="3" height="7" fill="${c}"/><rect x="${x}" y="${y - 7}" width="3" height="7" fill="${shade(c, .62)}"/><ellipse cx="${x}" cy="${y - 7}" rx="3" ry="1.1" fill="${shade(c, 1.25)}"/><path d="M${x - 3} ${y - 2}h6M${x - 3} ${y - 5}h6" stroke="#241810" stroke-width=".7" opacity=".7"/>`; }
function msCrate(x, y, s = 5, c = "#9a7a4a"){ const d = s * .5; return msSh(x + s * .6, y + .5, s, s * .3, .25) + `<rect x="${x - s / 2}" y="${y - s}" width="${s}" height="${s}" fill="${c}"/><path d="M${x - s / 2} ${y - s}l${d} -${d * .8}h${s}l-${d} ${d * .8}z" fill="${shade(c, 1.2)}"/><path d="M${x + s / 2} ${y}l${d} -${d * .8}v-${s}l-${d} ${d * .8}z" fill="${shade(c, .62)}"/><path d="M${x - s / 2} ${y - s}l${s} ${s}" stroke="${shade(c, .6)}" stroke-width=".6"/>`; }
function msSack(x, y){ return msSh(x + 2, y + .4, 3, .9, .22) + `<path d="M${x - 2.6} ${y}q-.6 -4 1 -5.6l-.6 -1.2h4.4l-.6 1.2q1.6 1.6 1 5.6z" fill="#cdbb92"/><path d="M${x} ${y}q1.8 -3 .8 -6.6h1.2q1.4 1.6 .6 6.6z" fill="#9a8a68"/>`; }
function msCart(x, y, load = ""){ return msSh(x + 4, y + 1, 11, 2.4, .26) + `<path d="M${x - 9} ${y - 4}l-8 3" stroke="#4a3220" stroke-width="1.3"/><path d="M${x - 8} ${y - 9}h14l3 -2.6h-14z" fill="#9a7a50"/>${load}<path d="M${x - 8} ${y - 4}h14v-5h-14z" fill="#6a4a2a"/><path d="M${x + 6} ${y - 4}l3 -2.6v-5l-3 2.6z" fill="#4a3220"/><ellipse cx="${x - 4.5}" cy="${y - 2.6}" rx="2.6" ry="3" fill="none" stroke="#2a1d12" stroke-width="1.3"/><ellipse cx="${x + 3.5}" cy="${y - 2.6}" rx="2.6" ry="3" fill="none" stroke="#2a1d12" stroke-width="1.3"/>`; }
function msSheep(x, y, c = "#ece6d6"){ return msSh(x + 1.5, y + .3, 3.2, .9, .22) + `<path d="M${x - 2} ${y}v1.4M${x + 1.6} ${y}v1.4" stroke="#2a2420" stroke-width=".7"/><ellipse cx="${x}" cy="${y - 1.4}" rx="3.2" ry="2.1" fill="${c}"/><ellipse cx="${x + .8}" cy="${y - 1}" rx="2" ry="1.3" fill="${shade(c, .8)}"/><ellipse cx="${x - 3.2}" cy="${y - 2.2}" rx="1.2" ry=".9" fill="#2a2420"/>`; }
function msLogs(x, y, n = 3){ let s = msSh(x + 9, y + .6, 12, 2, .25); const rows = n === 3 ? [[0, 3], [1, 2], [2, 1]] : [[0, 2], [1, 1]];
  for (const [k, m] of rows) for (let i = 0; i < m; i++){ const lx = x + i * 4.6 + k * 2.3, ly = y - k * 3.8 - 2.3; s += `<path d="M${lx} ${ly - 2.2}h16l1 2.2 -1 2.2h-16z" fill="#6a4a2a"/><circle cx="${lx}" cy="${ly}" r="2.3" fill="#c8a070" stroke="#5a3a1e" stroke-width=".6"/>`; }
  return s; }
function msHay(x, y, s = 1){ return maShadow(x + 4 * s, y + 1, 6 * s, 1.8 * s, .25) + `<path d="M${x - 5 * s} ${y}Q${x - 5 * s} ${y - 11 * s} ${x} ${y - 12 * s}Q${x + 5 * s} ${y - 11 * s} ${x + 5 * s} ${y}z" fill="#d0ae5c"/><path d="M${x} ${y - 12 * s}Q${x + 5 * s} ${y - 11 * s} ${x + 5 * s} ${y}H${x}z" fill="#9a7e3e"/><path d="M${x} ${y - 12 * s}v-3" stroke="#3a2a1a" stroke-width="1"/>`; }
function msField(x, y, w, h, c, rows = 6, ang = -.18){ const dx = Math.cos(ang), dy = Math.sin(ang); let s = `<g transform="translate(${x} ${y}) skewY(${ang * 40})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${c}" opacity=".9"/>`; for (let i = 1; i < rows; i++) s += `<path d="M${-w / 2} ${-h / 2 + i * h / rows}h${w}" stroke="${shade(c, .72)}" stroke-width="1.1"/>`; return s + `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="#3a3220" stroke-width=".8" opacity=".5"/></g>`; }
function msFence(pts, c = "#5a4028"){ let d = "", p = ""; for (let i = 0; i < pts.length; i++){ const [ax, ay] = pts[i]; d += (i ? "L" : "M") + ax + " " + (ay - 2.6); if (i < pts.length - 1){ const [bx, by] = pts[i + 1], L = Math.hypot(bx - ax, by - ay), k = Math.max(1, Math.round(L / 5)); for (let j = 0; j < k; j++) p += `M${ax + (bx - ax) * j / k} ${ay + (by - ay) * j / k}v-4.4`; } } return `<path d="${d}" stroke="${c}" stroke-width="1" fill="none"/><path d="${d}" stroke="${c}" stroke-width="1" fill="none" transform="translate(0 1.6)"/><path d="${p}" stroke="${shade(c, .8)}" stroke-width="1.1"/>`; }
function msWell(x, y){ return maWell(x, y); }
function msStall(x, y, c){ return maStall(x, y, c); }
function msLantern(x, y, c = "#ffc860"){ return `<path d="M${x} ${y}v-11h3" stroke="#2a2218" stroke-width="1.1" fill="none"/><rect x="${x + 2}" y="${y - 11}" width="2.4" height="3.2" fill="${c}"/>` + msGlow(x + 3.2, y - 9.4, 7, c, .5); }
function msCrow(x, y, s = 1, c = "#141210"){ return `<path d="M${x - 3 * s} ${y - 1 * s}q${1.5 * s} -${1.6 * s} ${3 * s} ${s}q${1.5 * s} -${2.6 * s} ${3 * s} -${s}" stroke="${c}" stroke-width="${1.1 * s}" fill="none"/>`; }
function msRockC(x, y, z, c = "#7a766c"){ return msSh(x + z * .5, y + .5, z * 1.1, z * .3, .25) + `<path d="M${x - z} ${y}l${z * .3} -${z * .8}l${z * .7} -${z * .3}l${z * .6} ${z * .4}l${z * .4} ${z * .7}z" fill="${c}"/><path d="M${x + z * .6} ${y - z * .7}l${z * .4} ${z * .7}h-${z * .7}z" fill="${shade(c, .6)}"/>`; }
function msMenhir(x, y, h, c = "#8a867a"){ return msSh(x + h * .3, y + .5, h * .35, h * .08, .28) + `<path d="M${x - h * .16} ${y}l${h * .04} -${h * .85}l${h * .12} -${h * .15}l${h * .12} ${h * .12}l${h * .04} ${h * .88}z" fill="${c}"/><path d="M${x} ${y - h}l${h * .12} ${h * .12}l${h * .04} ${h * .88}h-${h * .14}z" fill="${shade(c, .6)}"/>`; }
function msStake(x, y, h = 10, lean = 0, c = "#5a4028"){ return `<path d="M${x} ${y}l${lean} -${h}" stroke="${c}" stroke-width="1.6"/><path d="M${x + lean - .8} ${y - h + 1}l.8 -3l.8 3z" fill="${shade(c, 1.3)}"/>`; }
function msSkullPole(x, y){ return `<path d="M${x} ${y}v-13" stroke="#3a2a1a" stroke-width="1.3"/><circle cx="${x}" cy="${y - 14.5}" r="2.4" fill="#e6dcc4"/><rect x="${x - 1.3}" y="${y - 13}" width="2.6" height="1.6" fill="#e6dcc4"/><circle cx="${x - .9}" cy="${y - 14.8}" r=".6" fill="#1a1612"/><circle cx="${x + .9}" cy="${y - 14.8}" r=".6" fill="#1a1612"/>`; }
function msBones(x, y){ return `<path d="M${x - 4} ${y}l8 -1.6M${x - 2} ${y - 2.6}l5 3" stroke="#e6dcc4" stroke-width="1.3" stroke-linecap="round"/><circle cx="${x + 3.4}" cy="${y - 1.5}" r="1.7" fill="#e6dcc4"/>`; }
function msSpark(x, y, s = 1, c = "#fff4b0"){ return msGlow(x, y, 6 * s, c, .45) + `<path d="M${x} ${y - 3 * s}l${.7 * s} ${2.3 * s}l${2.3 * s} ${.7 * s}l-${2.3 * s} ${.7 * s}l-${.7 * s} ${2.3 * s}l-${.7 * s} -${2.3 * s}l-${2.3 * s} -${.7 * s}l${2.3 * s} -${.7 * s}z" fill="${c}"/>`; }
function msSunflower(x, y, s = 1){ return `<path d="M${x} ${y}v-${9 * s}" stroke="#4a6a2a" stroke-width="${.9 * s}"/><path d="M${x} ${y - 4 * s}q${2 * s} -${1.4 * s} ${3.4 * s} 0q-${2 * s} ${1.2 * s} -${3.4 * s} 0z" fill="#5a7a30"/><circle cx="${x}" cy="${y - 10 * s}" r="${2.5 * s}" fill="#f0c030"/><circle cx="${x + .3 * s}" cy="${y - 10 * s}" r="${1.1 * s}" fill="#5a3a1a"/>`; }
function msDummy(x, y){ return msSh(x + 2, y + .4, 3, .8, .22) + `<path d="M${x} ${y}v-12M${x - 4.5} ${y - 9}h9" stroke="#5a4028" stroke-width="1.4"/><ellipse cx="${x}" cy="${y - 8}" rx="2.4" ry="3.4" fill="#c8a85a"/><circle cx="${x}" cy="${y - 12.5}" r="1.9" fill="#d8bc70"/>`; }
function msRack(x, y){ return msSh(x + 4, y + .5, 7, 1.2, .2) + `<path d="M${x - 6} ${y}v-9M${x + 6} ${y}v-9M${x - 7} ${y - 8.5}h14" stroke="#4a3424" stroke-width="1.2"/><path d="M${x - 4} ${y - 8}l-1 7M${x - 1} ${y - 8}l0 7.4M${x + 2} ${y - 8}l1 7M${x + 4.6} ${y - 8}l.4 6.6" stroke="#9aa4a8" stroke-width="1"/>`; }
function msBeehive(x, y){ return msSh(x + 2, y + .4, 3, .8, .22) + `<path d="M${x - 3} ${y}q0 -6 3 -6.4q3 .4 3 6.4z" fill="#d0a650"/><path d="M${x} ${y - 6.4}q3 .4 3 6.4h-3z" fill="#9a7a3a"/><path d="M${x - 2.8} ${y - 2}h5.6M${x - 2.2} ${y - 4}h4.4" stroke="#7a5a2a" stroke-width=".6"/><circle cx="${x}" cy="${y - 1}" r=".7" fill="#2a1d12"/>`; }
function msBoat(x, y, s = 1, c = "#6a4a2a", flip = false){ const k = flip ? -1 : 1; return `<g transform="translate(${x} ${y}) scale(${k * s} ${s})">${msSh(2, 1, 9, 2, .25)}<path d="M-8 -2q8 5 16 0l2 -2.4h-20z" fill="${c}"/><path d="M-10 -4.4h20l-2 2.4q-8 1.6 -16 0z" fill="${shade(c, 1.3)}" opacity=".8"/><path d="M-4 -4.2v1.6M3 -4.2v1.6" stroke="${shade(c, .6)}" stroke-width=".8"/></g>`; }
function msWeb(x, y, R){ let d = ""; for (let i = 0; i < 8; i++){ const a = i / 8 * 6.283; d += `M${x} ${y}l${Math.cos(a) * R} ${Math.sin(a) * R}`; } for (const k of [.35, .65, .95]){ d += "M"; for (let i = 0; i <= 8; i++){ const a = i / 8 * 6.283; d += `${i ? "L" : ""}${x + Math.cos(a) * R * k} ${y + Math.sin(a) * R * k} `; } } return `<path d="${d}" stroke="#eef0f0" stroke-width=".55" fill="none" opacity=".75"/>`; }
function msCocoon(x, y){ return `<path d="M${x} ${y - 9}v3" stroke="#eef0f0" stroke-width=".5"/><ellipse cx="${x}" cy="${y - 3}" rx="1.8" ry="3.4" fill="#e0dcd0"/><path d="M${x - 1.6} ${y - 4}l3.2 1M${x - 1.6} ${y - 2}l3.2 1" stroke="#a8a49a" stroke-width=".5"/>`; }
function msCauldron(x, y, c = "#7aff5a"){ return msGlow(x, y - 6, 12, c, .5) + `<path d="M${x - 5} ${y}l1.4 -2M${x + 5} ${y}l-1.4 -2" stroke="#1a1612" stroke-width="1.2"/><path d="M${x - 5} ${y - 6}a5 4.4 0 0 0 10 0z" fill="#22201c"/><ellipse cx="${x}" cy="${y - 6}" rx="5" ry="1.6" fill="${c}"/><circle cx="${x - 1}" cy="${y - 9}" r="1" fill="${c}" opacity=".6"/><circle cx="${x + 1.5}" cy="${y - 11}" r=".8" fill="${c}" opacity=".4"/>` + msFire(x, y + .6, .5); }
function msStair(x, y, w = 12, glow){ return (glow ? msGlow(x, y - 3, w * 1.1, glow, .45) : "") + `<path d="M${x - w / 2 - 2} ${y + 1}l2 -${w * .55}h${w}l2 ${w * .55}z" fill="#6a6458"/><path d="M${x - w / 2 + 1} ${y}l1.4 -${w * .45}h${w - 4.8}l1.4 ${w * .45}z" fill="#0d0b09"/><path d="M${x - w / 2 + 2} ${y - w * .12}h${w - 4}M${x - w / 2 + 2.6} ${y - w * .25}h${w - 5.2}M${x - w / 2 + 3.2} ${y - w * .37}h${w - 6.4}" stroke="#3a3630" stroke-width=".9"/>`; }
function msAnvil(x, y){ return msSh(x + 2, y + .4, 4, .9, .25) + `<path d="M${x - 2} ${y}h4l-.6 -2.6h-2.8z" fill="#3a3a3e"/><path d="M${x - 5} ${y - 2.6}h8.4q2 0 2.6 -1.6h-9.6q-1 0 -1.4 1.6z" fill="#5a5a60"/>`; }
function msHeron(x, y){ return `<path d="M${x} ${y}v-5M${x + 1} ${y}v-5" stroke="#2a2420" stroke-width=".6"/><ellipse cx="${x + .6}" cy="${y - 6.5}" rx="2.6" ry="1.6" fill="#e8ecec"/><path d="M${x - 1.4} ${y - 7}q-1 -3 .6 -5" stroke="#e8ecec" stroke-width="1.1" fill="none"/><path d="M${x - .8} ${y - 12}l-2.6 .6" stroke="#d0a040" stroke-width=".9"/>`; }
function msSign(x, y, c = "#8a6a44"){ return `<path d="M${x} ${y}v-12" stroke="#4a3424" stroke-width="1.6"/><path d="M${x} ${y - 11}h9l2.4 2 -2.4 2h-9zM${x} ${y - 6.4}h-9l-2.4 2 2.4 2h9z" fill="${c}"/><path d="M${x} ${y - 11}h9l2.4 2h-11.4z" fill="${shade(c, 1.2)}"/>`; }

/* ---------- великі споруди ---------- */
function msPavilion(x, y, R, H, c, c2, o = {}){
  const id = "pv" + Math.round(x * 10) + "_" + Math.round(y * 10), top = y - H * .5, rh = H * .62;
  let s = maShadow(x + R * .9 + H * .1, y + 1, R * 1.4 + H * .15, R * .36, .3);
  s += `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c, 1.15)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, .55)}"/></linearGradient></defs>`;
  s += `<path d="M${x - R} ${top}V${y}A${R} ${R * .35} 0 0 0 ${x + R} ${y}V${top}z" fill="url(#${id})"/>`;
  if (c2) for (const k of [-.62, 0, .62]) s += `<path d="M${x + k * R - R * .13} ${top}h${R * .26}v${H * .5 + R * .34 * Math.sqrt(1 - k * k)}h-${R * .26}z" fill="${c2}" opacity="${k > 0 ? .55 : .8}"/>`;
  s += `<path d="M${x - R * .22} ${y + R * .3}v-${H * .32}q${R * .22} -${H * .12} ${R * .44} 0v${H * .32}z" fill="#2a1d12"/>`;
  s += `<path d="M${x - R * 1.12} ${top}L${x} ${top - rh}L${x} ${top + R * .4}z" fill="${shade(o.roof || c, 1.12)}"/><path d="M${x + R * 1.12} ${top}L${x} ${top - rh}L${x} ${top + R * .4}z" fill="${shade(o.roof || c, .6)}"/>`;
  if (c2) s += `<path d="M${x - R * .5} ${top + R * .2}L${x} ${top - rh}L${x - R * .2} ${top + R * .34}z" fill="${c2}" opacity=".7"/>`;
  s += `<path d="M${x - R * 1.12} ${top}q${R * .28} ${R * .3} ${R * .56} ${R * .2}q${R * .28} ${R * .3} ${R * .56} ${R * .2}q${R * .28} ${R * .18} ${R * .56} 0q${R * .28} ${R * .1} ${R * .56} -${R * .2}" fill="none" stroke="${shade(o.roof || c, .8)}" stroke-width="1"/>`;
  s += `<path d="M${x} ${top - rh}v-${H * .3}" stroke="#2a2218" stroke-width="1"/><path d="M${x} ${top - rh - H * .3}h${R * .8}l-1.6 1.8 1.6 1.8h-${R * .8}z" fill="${o.flag || c2 || shade(c, 1.3)}"/>`;
  return s;
}
function msRidgeTent(x, y, w, h, d, c){
  const D = [d * .6, -d * .45];
  return maShadow(x + w * .4 + d * .3, y + 1, w * .7 + d * .3, d * .3, .28) + `<polygon points="${x},${y - h} ${x + D[0]},${y - h + D[1]} ${x + w / 2 + D[0]},${y + D[1]} ${x + w / 2},${y}" fill="${shade(c, .62)}"/><polygon points="${x - w / 2},${y} ${x},${y - h} ${x + w / 2},${y}" fill="${c}"/><path d="M${x - w * .14} ${y}l${w * .14} -${h * .55}l${w * .14} ${h * .55}z" fill="#2a1d12"/><path d="M${x} ${y - h}l${D[0]} ${D[1]}" stroke="${shade(c, 1.3)}" stroke-width=".8"/>`;
}
function msWoodTower(x, y, h, c = "#6a4a2a", roof = "#4a3424"){
  const w = 9, top = y - h;
  return maShadow(x + 6 + h * .15, y + 1, 8 + h * .15, 2.4, .28) + `<path d="M${x - w / 2} ${y}L${x - w / 2 + 2} ${top}M${x + w / 2} ${y}L${x + w / 2 - 2} ${top}M${x - w / 2 + 1} ${y - h * .35}L${x + w / 2 - 1} ${y - h * .7}M${x + w / 2 - 1} ${y - h * .35}L${x - w / 2 + 1} ${y - h * .7}" stroke="${c}" stroke-width="1.6"/><path d="M${x - w / 2} ${top}h${w}l2.6 -2h-${w}z" fill="${shade(c, 1.2)}"/><rect x="${x - w / 2}" y="${top}" width="${w}" height="4.6" fill="${c}"/><path d="M${x + w / 2} ${top + 4.6}l2.6 -2v-4.6l-2.6 2z" fill="${shade(c, .6)}"/><path d="M${x - w / 2 - 1.5} ${top - 2}L${x + 1} ${top - 10}L${x + w / 2 + 3.5} ${top - 3}z" fill="${roof}"/><path d="M${x + 1} ${top - 10}L${x + w / 2 + 3.5} ${top - 3}L${x + w / 2 + 1.5} ${top - 1.6}z" fill="${shade(roof, .6)}"/>`;
}
function msWindmill(x, y, s = 1, o = {}){
  const wall = o.wall || "#c8b890", roof = o.roof || "#6a3a26", sail = o.sail || "#e8dcc0", frame = o.frame || "#4a3424", H = 26 * s, cy = y - H - 2 * s;
  let sh = maShadow(x + 10 * s, y + 1, 14 * s, 3 * s, .3);
  sh += `<path d="M${x - 7 * s} ${y}L${x - 4.6 * s} ${y - H}H${x + 4.6 * s}L${x + 7 * s} ${y}z" fill="${wall}"/><path d="M${x + 1.5 * s} ${y}L${x + 1 * s} ${y - H}H${x + 4.6 * s}L${x + 7 * s} ${y}z" fill="${shade(wall, .62)}"/>`;
  sh += `<path d="M${x - 2 * s} ${y}v-${6 * s}a2 2 0 0 1 ${4 * s} 0v${6 * s}z" fill="#2a1d12"/><rect x="${x - 1.4 * s}" y="${y - H * .62}" width="${2.4 * s}" height="${3 * s}" fill="#2a1d12"/>`;
  sh += `<path d="M${x - 6 * s} ${y - H}L${x} ${y - H - 9 * s}L${x + 6 * s} ${y - H}z" fill="${roof}"/><path d="M${x} ${y - H - 9 * s}L${x + 6 * s} ${y - H}H${x + 1 * s}z" fill="${shade(roof, .6)}"/>`;
  let bl = ""; for (let i = 0; i < 4; i++){ const a = (o.ang ?? 22) + i * 90;
    bl += `<g transform="rotate(${a} ${x - 1 * s} ${cy})"><path d="M${x - 1 * s} ${cy}h${20 * s}" stroke="${frame}" stroke-width="${1.3 * s}"/><rect x="${x + 4 * s}" y="${cy - 3.6 * s}" width="${15 * s}" height="${3.4 * s}" fill="${sail}" opacity=".9" stroke="${frame}" stroke-width=".5"/><path d="M${x + 8 * s} ${cy - 3.6 * s}v${3.4 * s}M${x + 12 * s} ${cy - 3.6 * s}v${3.4 * s}M${x + 16 * s} ${cy - 3.6 * s}v${3.4 * s}" stroke="${frame}" stroke-width=".5"/></g>`; }
  return sh + bl + `<circle cx="${x - 1 * s}" cy="${cy}" r="${1.6 * s}" fill="${frame}"/>`;
}
function msWillow(x, y, z, c = "#5a7a3a"){
  let s = maShadow(x + z * 1.2, y + .5, z * 1.8, z * .45, .3) + `<path d="M${x - z * .18} ${y}q${z * .1} -${z * 1.2} -${z * .2} -${z * 2.3}h${z * .55}q-${z * .2} ${z * .9} ${z * .1} ${z * 2.3}z" fill="#3a2a1a"/>`;
  s += `<ellipse cx="${x}" cy="${y - z * 2.5}" rx="${z * 1.2}" ry="${z * .6}" fill="${shade(c, .75)}"/>`;
  let d = "", d2 = ""; for (let i = 0; i < 16; i++){ const t = i / 15 - .5, ox = x + t * z * 2.5, oy = y - z * 2.5 + Math.abs(t) * z * .8, L = z * (1.5 + ((i * 7) % 5) * .12) - Math.abs(t) * z * .6, q = `M${ox} ${oy}q${t * z * .5} ${L * .5} ${t * z * .7} ${L}`; (t < .1 ? (d += q) : (d2 += q)); }
  return s + `<path d="${d2}" stroke="${shade(c, .72)}" stroke-width="${z * .2}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${shade(c, 1.12)}" stroke-width="${z * .2}" fill="none" stroke-linecap="round"/><ellipse cx="${x - z * .35}" cy="${y - z * 2.65}" rx="${z * .7}" ry="${z * .3}" fill="${shade(c, 1.2)}"/>`;
}
function msOak(x, y, z, c = "#4a6a2e"){
  let s = maShadow(x + z * 1.4, y + .5, z * 2.2, z * .55, .32) + `<path d="M${x - z * .35} ${y}q${z * .2} -${z * 1} 0 -${z * 1.8}h${z * .7}q-${z * .2} ${z * .8} 0 ${z * 1.8}z" fill="#3a2a1a"/><path d="M${x} ${y - z * 1.2}l-${z * .7} -${z * .5}M${x + z * .1} ${y - z * 1.4}l${z * .7} -${z * .4}" stroke="#3a2a1a" stroke-width="${z * .18}"/>`;
  const B = [[0, -2.5, 1.2], [-1, -2.1, .85], [1, -2.15, .9], [-.4, -3.1, .8], [.6, -3, .75]];
  for (const [ox, oy, rr] of B) s += `<circle cx="${x + ox * z}" cy="${y + oy * z}" r="${rr * z}" fill="${shade(c, .72)}"/>`;
  for (const [ox, oy, rr] of B) s += `<circle cx="${x + ox * z - rr * z * .22}" cy="${y + oy * z - rr * z * .22}" r="${rr * z * .7}" fill="${c}"/>`;
  s += `<circle cx="${x - z * .6}" cy="${y - z * 3}" r="${z * .4}" fill="${shade(c, 1.22)}"/>`;
  return s;
}
function msDeadTree(x, y, z, c = "#2a251e"){ return maShadow(x + z * .9, y + .5, z, z * .26, .25) + `<path d="M${x} ${y}q-${z * .1} -${z * 1.4} ${z * .1} -${z * 2.6}M${x} ${y - z * 1.1}q-${z * .5} -${z * .3} -${z * .9} -${z * 1}M${x + z * .05} ${y - z * 1.7}q${z * .5} -${z * .2} ${z * .8} -${z * .9}M${x - z * .6} ${y - z * 1.7}l-${z * .3} -${z * .4}M${x + z * .1} ${y - z * 2.6}l-${z * .3} -${z * .5}M${x + z * .1} ${y - z * 2.5}l${z * .4} -${z * .3}" stroke="${c}" stroke-width="${z * .18}" fill="none" stroke-linecap="round"/>`; }
function msShell(x, y, w, h, d, wall){
  const D = [d * .55, -d * .45], x0 = x - w / 2, x1 = x + w / 2, top = y - h;
  let s = maShadow(x + w * .35 + d * .3, y + 1.5, w * .75 + d * .3, Math.max(2.5, d * .32), .26);
  s += `<polygon points="${x1},${y} ${x1 + D[0]},${y + D[1]} ${x1 + D[0]},${top + D[1] + h * .35} ${x1},${top + h * .2}" fill="${shade(wall, .55)}"/>`;
  s += `<polygon points="${x0},${top} ${x0 + D[0]},${top + D[1]} ${x1 + D[0]},${top + D[1] + h * .35} ${x1},${top + h * .2}" fill="#16120e"/>`;
  s += `<path d="M${x0} ${y}V${top}l${w * .2} ${h * .22}l${w * .15} -${h * .12}l${w * .25} ${h * .32}l${w * .15} -${h * .1}L${x1} ${top + h * .2}V${y}z" fill="${wall}"/>`;
  s += `<path d="M${x0 + w * .15} ${top + h * .2}v${h * .5}M${x1 - w * .2} ${top + h * .35}v${h * .4}" stroke="#16120e" stroke-width="${w * .14}" opacity=".35"/>`;
  s += `<rect x="${x - w * .12}" y="${y - h * .55}" width="${w * .24}" height="${h * .55}" fill="#16120e"/><path d="M${x0 + D[0] * .5 + 1} ${top + D[1] * .5}l${w * .85} ${h * .4}" stroke="#2a2018" stroke-width="1.3"/>`;
  return s;
}
// стрілчасті вікна: готичний фасад і нава, може бути руїною
function msGothic(x, y, w, h, d, c, o = {}){
  const D = [d * .6, -d * .42], x0 = x - w / 2, x1 = x + w / 2, top = y - h, gh = o.gh ?? w * .45, ruin = o.ruin;
  let s = maShadow(x + w * .4 + d * .35, y + 2, w * .8 + d * .35, d * .3, .32);
  // бічна стіна нави (вглиб)
  const sideTop = ruin ? `L${x1 + D[0] * .8} ${top + D[1] * .8 + h * .25}L${x1 + D[0] * .55} ${top + D[1] * .55 + h * .1}L${x1 + D[0] * .3} ${top + D[1] * .3 + h * .3}` : `L${x1 + D[0]} ${top + D[1]}`;
  s += `<path d="M${x1} ${y}L${x1 + D[0]} ${y + D[1]}V${top + D[1] + (ruin ? h * .4 : 0)}${sideTop}L${x1} ${top}z" fill="${shade(c, .6)}"/>`;
  for (let i = 1; i <= 3; i++){ const px = x1 + D[0] * i / 4, py = y + D[1] * i / 4; s += `<path d="M${px - 1.2} ${py - h * .25}v-${h * .32}l1.2 -${h * .1}l1.2 ${h * .1}v${h * .32}z" fill="${o.lit ? o.lit : "#16120e"}" opacity="${o.lit ? .9 : 1}"/><path d="M${px + 2.2} ${py}v-${h * .7}" stroke="${shade(c, .45)}" stroke-width="1.6"/>`; }
  if (!ruin && o.roof) s += `<polygon points="${x},${top - gh} ${x + D[0]},${top - gh + D[1]} ${x1 + D[0]},${top + D[1]} ${x1},${top}" fill="${shade(o.roof, .62)}"/>`;
  // фасад
  const gable = ruin ? `L${x1} ${top + h * .12}L${x + w * .3} ${top - gh * .2}L${x + w * .1} ${top - gh * .05}L${x} ${top - gh * .6}L${x - w * .15} ${top - gh * .3}L${x0} ${top + h * .05}` : `L${x1} ${top}L${x} ${top - gh}L${x0} ${top}`;
  s += `<path d="M${x0} ${y}H${x1}V${top + h * .12}${gable.replace(/^L[^L]+/, m => m)}z" fill="${c}"/>`;
  s += `<path d="M${x - w * .16} ${y}v-${h * .42}q${w * .16} -${h * .26} ${w * .32} 0v${h * .42}z" fill="#16120e"/>`;
  const rr = Math.min(w * .17, h * .16); s += `<circle cx="${x}" cy="${top + h * .22}" r="${rr}" fill="${o.lit || "#16120e"}"/><path d="M${x - rr} ${top + h * .22}h${rr * 2}M${x} ${top + h * .22 - rr}v${rr * 2}" stroke="${c}" stroke-width=".7"/>`;
  for (const k of [-.36, .36]) s += `<path d="M${x + k * w - 1.3} ${y - h * .45}v-${h * .28}l1.3 -${h * .1}l1.3 ${h * .1}v${h * .28}z" fill="${o.lit || "#16120e"}"/>`;
  s += `<path d="M${x0 + 1} ${y}V${top + h * .1}M${x1 - 1} ${y}V${top + h * .1}" stroke="${shade(c, .7)}" stroke-width="2.2"/>`;
  if (ruin) for (let i = 0; i < 5; i++) s += msRockC(x0 + i * w * .28 + 2, y + 3 + (i % 2) * 2, 2 + (i % 3), shade(c, .85));
  return s;
}
function msBrokenTower(x, y, r, h, c){
  const top = y - h, id = "bt" + Math.round(x) + "_" + Math.round(y);
  return maShadow(x + r + h * .18, y + 1, r * 1.3 + h * .2, r * .5, .3) + `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c, 1.15)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, .55)}"/></linearGradient></defs><path d="M${x - r} ${top + h * .1}V${y}A${r} ${r * .38} 0 0 0 ${x + r} ${y}V${top + h * .3}l-${r * .4} -${h * .12}l-${r * .3} ${h * .08}l-${r * .5} -${h * .26}l-${r * .4} ${h * .1}z" fill="url(#${id})"/><rect x="${x - r * .25}" y="${top + h * .45}" width="${r * .45}" height="${h * .14}" fill="#16120e"/><path d="M${x - r * .2} ${y}v-${h * .2}a${r * .25} ${r * .25} 0 0 1 ${r * .5} 0v${h * .2}z" fill="#16120e"/>`;
}
function msCave(x, y, w, h, glow){
  return maShadow(x + w * .4, y + 2, w * .9, h * .2, .3) + `<path d="M${x - w} ${y}Q${x - w * .8} ${y - h * .9} ${x - w * .2} ${y - h}Q${x + w * .3} ${y - h * 1.1} ${x + w * .7} ${y - h * .6}Q${x + w} ${y - h * .3} ${x + w * 1.05} ${y}z" fill="#6e6a60"/><path d="M${x + w * .1} ${y - h * 1.02}Q${x + w * .3} ${y - h * 1.1} ${x + w * .7} ${y - h * .6}Q${x + w} ${y - h * .3} ${x + w * 1.05} ${y}H${x + w * .35}z" fill="#4a4740"/><path d="M${x - w * .7} ${y - h * .5}l${w * .3} -${h * .15}M${x + w * .5} ${y - h * .7}l${w * .2} ${h * .2}" stroke="#3a3832" stroke-width="1" opacity=".6"/>` + (glow ? msGlow(x - w * .05, y - h * .3, w * .7, glow, .5) : "") + `<path d="M${x - w * .38} ${y}v-${h * .4}a${w * .33} ${h * .3} 0 0 1 ${w * .66} 0v${h * .4}z" fill="#0d0b09"/>`;
}
function msMenhirRing(C, cx, cy, rx, ry, n, h, c){ for (let i = 0; i < n; i++){ const a = i / n * 6.283 + .3, px = cx + Math.cos(a) * rx, py = cy + Math.sin(a) * ry; C.put(py, msMenhir(px, py, h * (.8 + C.r() * .4), c)); } }
// стрілчастий мур з бійницями (сегмент), може бути зруйнованим
function msWallSeg(ax, ay, bx, by, h, c, o = {}){
  const L = Math.hypot(bx - ax, by - ay), n = Math.max(2, Math.round(L / 6)); let top = `M${ax} ${ay}`; const pts = [];
  for (let i = 0; i <= n; i++){ const t = i / n, px = ax + (bx - ax) * t, py = ay + (by - ay) * t, hh = o.ruin ? h * (.45 + Math.abs(Math.sin(i * 1.7 + (o.seed || 0))) * .6) : h; pts.push([px, py - hh]); }
  let d = `M${ax} ${ay}L${bx} ${by}`; for (let i = n; i >= 0; i--) d += `L${pts[i][0]} ${pts[i][1]}`;
  const nx = -(by - ay) / L, lit = nx < 0 ? 1 : .7;
  let s = `<path d="${d}z" fill="${shade(c, lit)}"/>`;
  if (!o.ruin){ let m = ""; for (let i = 0; i < n; i++) if (i % 2 === 0){ const [px, py] = pts[i], [qx, qy] = pts[i + 1]; m += `M${px} ${py}L${qx} ${qy}l0 -3L${px} ${py - 3}z`; } s += `<path d="${m}" fill="${shade(c, lit * 1.1)}"/>`; }
  s += `<path d="${pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join("")}" stroke="${shade(c, 1.2)}" stroke-width="1.4" fill="none"/>`;
  if (o.bones){ let b = ""; for (let i = 0; i < n * 2; i++){ const t = (i + .5) / (n * 2), px = ax + (bx - ax) * t, py = ay + (by - ay) * t - h * (.2 + (i % 3) * .18); b += `M${px - 1.6} ${py}h3.2`; } s += `<path d="${b}" stroke="#efe6cc" stroke-width="1.3" stroke-linecap="round" opacity=".8"/>`; }
  return s;
}
function msHydraNeck(x, y, s, dir, c = "#2e4a34"){
  const k = dir; return `<path d="M${x} ${y}q${-6 * s * k} ${-14 * s} ${4 * s * k} ${-24 * s}q${8 * s * k} ${-6 * s} ${12 * s * k} ${-2 * s}" stroke="${shade(c, .7)}" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/><path d="M${x - 1 * s} ${y}q${-6 * s * k} ${-14 * s} ${4 * s * k} ${-24 * s}q${8 * s * k} ${-6 * s} ${12 * s * k} ${-2 * s}" stroke="${c}" stroke-width="${3.4 * s}" fill="none" stroke-linecap="round"/><path d="M${x + 15 * s * k} ${y - 26 * s}l${5 * s * k} ${1.6 * s}l${-5 * s * k} ${2.4 * s}z" fill="${shade(c, .8)}"/><circle cx="${x + 15 * s * k}" cy="${y - 26.6 * s}" r="${.9 * s}" fill="#ffd040"/>` + `<ellipse cx="${x}" cy="${y + .5}" rx="${4 * s}" ry="${1.4 * s}" fill="none" stroke="#9ab8c0" stroke-width=".7" opacity=".6"/>`;
}
function msCatapult(x, y){ return msSh(x + 6, y + 1, 12, 2.4, .26) + `<path d="M${x - 10} ${y - 3}h18l3 -2.4h-18z" fill="#7a5a3a"/><path d="M${x - 10} ${y - 3}h18v2h-18z" fill="#5a4028"/><path d="M${x - 4} ${y - 4}l4 -12l4 12" stroke="#5a4028" stroke-width="1.5" fill="none"/><path d="M${x} ${y - 14}l-12 6" stroke="#6a4a2a" stroke-width="1.6"/><ellipse cx="${x - 12}" cy="${y - 8}" rx="2" ry="1.3" fill="#3a2a1a"/><circle cx="${x - 6}" cy="${y - 1}" r="2.4" fill="none" stroke="#2a1d12" stroke-width="1.2"/><circle cx="${x + 5}" cy="${y - 1}" r="2.4" fill="none" stroke="#2a1d12" stroke-width="1.2"/>`; }
function msShield(x, y, c){ return `<ellipse cx="${x}" cy="${y}" rx="2.8" ry="1.3" fill="${c}"/><circle cx="${x}" cy="${y}" r=".7" fill="#c8b070"/>`; }
function msSpears(x, y, n, r){ let d = ""; for (let i = 0; i < n; i++){ const px = x + (r() * 2 - 1) * 10, py = y + (r() * 2 - 1) * 4, l = (r() * 2 - 1) * 5; d += `M${px} ${py}l${l} -${8 + r() * 6}`; } return `<path d="${d}" stroke="#2a2218" stroke-width="1.3"/>`; }
function msTribune(x, y, w, c, c2){
  const D = [6, -4.6]; let s = maShadow(x + w * .45, y + 1, w * .65, 3, .28);
  for (let k = 0; k < 3; k++){ const yy = y - k * 3.2, xx = x + k * 1.2; s += `<path d="M${xx - w / 2} ${yy}h${w}l${D[0] * .3} ${D[1] * .3}h-${w}z" fill="#9a7a50"/><rect x="${xx - w / 2}" y="${yy}" width="${w}" height="3.2" fill="#6a4a2a"/>`; for (let i = 0; i < w / 4; i++) s += `<circle cx="${xx - w / 2 + 2 + i * 4}" cy="${yy - 1.4}" r="1.2" fill="${["#c0503a","#3a6a9a","#e8dcb0","#5a8a4a","#d9a441"][(i + k) % 5]}"/>`; }
  s += `<path d="M${x - w / 2} ${y}v-17M${x + w / 2 + 3} ${y - 3}v-16" stroke="#4a3424" stroke-width="1.2"/>`;
  let aw = ""; for (let i = 0; i < 6; i++) aw += `<path d="M${x - w / 2 + i * w / 6 + 2} ${y - 17 - i * .5}h${w / 6}v3l-${w / 12} 2l-${w / 12} -2z" fill="${i % 2 ? c2 : c}"/>`;
  return s + aw;
}
function msRoofHouse(x, y, w, d, roof){ // дах, що стирчить з води
  const D = [d * .55, -d * .45], rh = w * .45;
  return `<polygon points="${x - w / 2},${y} ${x + w / 2},${y} ${x + w / 2 + D[0]},${y + D[1]} ${x - w / 2 + D[0]},${y + D[1]}" fill="#16242a" opacity=".6"/><polygon points="${x - w / 2},${y} ${x},${y - rh} ${x + D[0]},${y - rh + D[1]} ${x - w / 2 + D[0]},${y + D[1]}" fill="${shade(roof, .55)}"/><polygon points="${x - w / 2 - 1},${y} ${x + w / 2 + 1},${y} ${x + D[0] * .0 + w / 2},${y} ${x},${y - rh}" fill="${roof}"/><polygon points="${x + w / 2},${y} ${x + w / 2 + D[0]},${y + D[1]} ${x + D[0]},${y - rh + D[1]} ${x},${y - rh}" fill="${shade(roof, .75)}"/><ellipse cx="${x + D[0] / 2}" cy="${y + 1}" rx="${w * .75}" ry="1.6" fill="none" stroke="#8ab0c0" stroke-width=".7" opacity=".5"/>`;
}

/* ---------- частокіл і мури навколо табору ---------- */
function siteRingGates(C, cx, cy, rx, ry){
  const out = [];
  for (const rd of ROADS){ if (rd.a !== C.id && rd.b !== C.id) continue; const P = C.rpts(rd, C.id);
    for (const [px, py] of P){ const u = (px - cx) / rx, v = (py - cy) / ry; if (u * u + v * v >= 1){ out.push(Math.atan2(v, u)); break; } } }
  return out;
}
function msPalisade(C, cx, cy, rx, ry, gates, col = "#6a4a2a", h = 9){
  const N = Math.round((rx + ry) * 1.3), back = [], front = [], gw = 9 / ((rx + ry) / 2);
  const near = a => gates.some(g => Math.abs(((a - g + 9.4248) % 6.2832) - 3.1416) < gw);
  for (let i = 0; i < N; i++){ const a = i / N * 6.2832; if (near(a)) continue; const px = cx + Math.cos(a) * rx, py = cy + Math.sin(a) * ry, lit = (Math.cos(a) < .25 ? 1.08 : .72) * (.92 + (i * 7 % 5) * .03), hh = h * (.88 + (i * 13 % 4) * .06);
    (py >= cy ? front : back).push([py, `<path d="M${px - 1.5} ${py}v${-hh}l1.5 -2.6l1.5 2.6v${hh}z" fill="${shade(col, lit)}"/>`]); }
  for (const g of gates){ const px = cx + Math.cos(g) * rx, py = cy + Math.sin(g) * ry, tx = -Math.sin(g) * rx, ty = Math.cos(g) * ry, tl = Math.hypot(tx, ty), ux = tx / tl * 8, uy = ty / tl * 8;
    (py >= cy ? front : back).push([py, `<path d="M${px - ux} ${py - uy}v-${h * 1.7}M${px + ux} ${py + uy}v-${h * 1.7}" stroke="${shade(col, .8)}" stroke-width="2.8"/><path d="M${px - ux - 1} ${py - uy - h * 1.55}L${px + ux + 1} ${py + uy - h * 1.55}" stroke="${shade(col, 1.15)}" stroke-width="2.2"/>`]); }
  back.sort((a, b) => a[0] - b[0]); front.sort((a, b) => a[0] - b[0]);
  C.ground += `<ellipse cx="${cx + 1}" cy="${cy + 1.5}" rx="${rx}" ry="${ry}" fill="none" stroke="#000" stroke-width="3" opacity=".2"/>`;
  C.put(cy - ry - .5, back.map(v => v[1]).join("")); C.put(cy + ry * .72, front.map(v => v[1]).join(""));
}
// кругла стіна (камінь), можна з руїною
function msStoneRing(C, cx, cy, rx, ry, gates, c, h = 8, o = {}){
  const N = 26, gw = 10 / ((rx + ry) / 2), near = a => gates.some(g => Math.abs(((a - g + 9.4248) % 6.2832) - 3.1416) < gw);
  const back = [], front = [];
  for (let i = 0; i < N; i++){ const a0 = i / N * 6.2832, a1 = (i + 1) / N * 6.2832; if (near(a0) || near(a1)) continue; if (o.gap && o.gap(i)) continue;
    const ax = cx + Math.cos(a0) * rx, ay = cy + Math.sin(a0) * ry, bx = cx + Math.cos(a1) * rx, by = cy + Math.sin(a1) * ry;
    (ay + by > cy * 2 ? front : back).push([(ay + by) / 2, msWallSeg(ax, ay, bx, by, h, c, {ruin:o.ruin, seed:i, bones:o.bones})]); }
  back.sort((a, b) => a[0] - b[0]); front.sort((a, b) => a[0] - b[0]);
  C.put(cy - ry - .5, back.map(v => v[1]).join("")); C.put(cy + ry * .72, front.map(v => v[1]).join(""));
}

/* ---------- самі локації ---------- */
const SITE_UP = [[0, -22], [-26, -18], [24, -30], [-40, -4], [-6, -40], [-30, 22], [10, 30], [40, -36]];
const SITES = {
  /* Землі Кабаллону */
  fair(C){ const {x, y, r} = C; C.ground += msGround(x - 14, y - 6, 74, 34, "#8a7a4a", .28);
    const T = [[-44, -16, 8, 15, "#c0503a", "#f2ead6"], [-16, -32, 10, 18, "#3a6a9a", "#f2ead6"], [16, -30, 8, 15, "#d9a441", "#8a3a26"], [-62, 6, 7, 13, "#5a8a4a", "#f2ead6"], [44, -26, 7, 13, "#8a3a8a", "#f2ead6"]];
    for (const [ox, oy, R, H, c, c2] of T) C.place(x + ox, y + oy, R + 2, (px, py) => msPavilion(px, py, R, H, c, c2));
    C.place(x - 30, y - 2, 4, (px, py) => `<path d="M${px} ${py}v-26" stroke="#e8dcc0" stroke-width="1.6"/>` + ["#c0503a", "#3a6a9a", "#d9a441", "#5a8a4a", "#f2ead6"].map((c, i) => `<path d="M${px} ${py - 25}q${-12 + i * 6} 8 ${-14 + i * 7} 24" stroke="${c}" stroke-width=".8" fill="none"/>`).join("") + `<circle cx="${px}" cy="${py - 26.5}" r="1.6" fill="#d9a441"/>`);
    ["#c0503a", "#3a6a9a", "#d9a441", "#5a8a4a"].forEach((c, i) => C.place(x - 50 + i * 12, y + 22 + (i % 2) * 3, 5, (px, py) => msStall(px, py, c)));
    C.place(x - 78, y - 12, 10, (px, py) => msCart(px, py, `<path d="M${px - 7} ${py - 9}q3 -4 6 0q3 -4 6 0" fill="#c8a85a"/>`));
    C.scatter(5, 20, 70, 3, (px, py) => msBarrel(px, py), {});
    C.scatter(14, 16, 64, 2.5, (px, py, i) => msFolk(px, py, MA.pk(r, ["#7a3a26", "#3a5a7a", "#5a6a30", "#8a6a2a", "#6a3a6a", "#a05a3a"])));
    let bt = ""; for (let i = 0; i < 9; i++) bt += `<path d="M${x - 62 + i * 9} ${y - 20 - Math.sin(i / 8 * 3.14) * 6}l4 0l-2 3z" fill="${["#c0503a", "#f2ead6", "#3a6a9a", "#d9a441"][i % 4]}"/>`;
    C.put(y - 21, `<path d="M${x - 62} ${y - 20}Q${x - 26} ${y - 30} ${x + 10} ${y - 20}" stroke="#4a3424" stroke-width=".6" fill="none"/>` + bt); },
  kab_env(C){ const {x, y, r} = C; C.ground += msGround(x - 30, y - 6, 60, 26, "#6a7a3a", .25);
    const [hx, hy] = C.main(22, [[-34, -16], [-44, 4], [-20, -32], [30, -34], [-30, 26]], (px, py) => maHouseG(px - 10, py, 15, 11, 9, "#e0d4b4", "#8a3a24", {chim:1, win:"#ffd27a"}) + maHouse(px + 12, py - 3, 20, 12, 12, "#a05a3a", "#5a3424", {nodoor:true}) + `<path d="M${px + 6} ${py - 3}v-7h7v7z" fill="#2a1d12"/>`);
    const fx = hx - 8, fy = hy + 22; const P = [[fx - 26, fy], [fx + 14, fy - 4], [fx + 22, fy + 10], [fx - 18, fy + 16], [fx - 26, fy]];
    if (C.clear(fx, fy + 6, 18)){ C.put(fy - 4, msFence(P.slice(0, 2))); C.put(fy + 16, msFence(P.slice(1))); for (let i = 0; i < 6; i++){ const sx = fx - 16 + r() * 30, sy = fy + 2 + r() * 10; C.put(sy, msSheep(sx, sy)); } C.claim(fx, fy + 6, 18); }
    C.place(hx - 36, hy - 6, 6, (px, py) => msHay(px, py)); C.place(hx - 44, hy + 4, 6, (px, py) => msHay(px, py, .8)); C.place(hx + 30, hy + 4, 5, (px, py) => msWell(px, py));
    C.place(hx + 22, hy - 30, 22, (px, py) => msField(px, py, 34, 16, "#c8a850", 6), {noclaim:1}); C.place(hx - 40, hy - 34, 20, (px, py) => msField(px, py, 30, 14, "#8a9a3a", 5), {noclaim:1});
    C.scatter(4, 40, 80, 5, (px, py) => maTree(px, py, 4 + r() * 1.5, "leaf", "#4a6a2e")); },
  mill(C){ const {x, y, r} = C; C.ground += msGround(x - 4, y - 10, 46, 22, "#8a7a4a", .25);
    const [mx, my] = C.main(24, [[-6, -16], [-30, -12], [-20, 18], [22, -26]], (px, py) => msWindmill(px, py, 1.15));
    C.place(mx - 26, my + 4, 9, (px, py) => maHouse(px, py, 14, 8, 9, "#d8caa6", "#7a4a2a"));
    for (let i = 0; i < 4; i++) C.place(mx + 10 + i * 4, my + 6 + (i % 2) * 2, 2, (px, py) => msSack(px, py), {noclaim:1});
    C.place(mx - 18, my + 16, 10, (px, py) => msCart(px, py, `<path d="M${px - 6} ${py - 9}h10" stroke="#cdbb92" stroke-width="3"/>`));
    C.place(mx - 50, my - 6, 22, (px, py) => msField(px, py, 34, 18, "#d0b050", 7), {noclaim:1}); C.place(mx - 44, my + 22, 20, (px, py) => msField(px, py, 30, 14, "#c09a40", 6), {noclaim:1}); },
  sparkford(C){ const {x, y, r} = C, rv = C.river(x, y, 60);
    if (rv){ const nx = -Math.sin(rv.ang), ny = Math.cos(rv.ang), cx = rv.x + Math.cos(rv.ang) * -26, cy = rv.y + Math.sin(rv.ang) * -26;
      for (let i = -3; i <= 3; i++){ const px = cx + nx * i * 4.6, py = cy + ny * i * 4.6; C.put(py, maRock(px, py + 1, 2.4 + (i % 2), true)); }
      for (let i = 0; i < 16; i++){ const t = (r() * 2 - 1) * 70, w = (r() * 2 - 1) * rv.w * .4, px = rv.x + Math.cos(rv.ang) * t + nx * w, py = rv.y + Math.sin(rv.ang) * t + ny * w; if (C.wet(px, py) && !(px > x + 6 && px < x + 150 && Math.abs(py - y) < 14)) C.top += msSpark(px, py - 2, .6 + r() * .6, r() < .5 ? "#fff4b0" : "#b0f4ff"); } }
    C.scatter(5, 26, 60, 7, (px, py) => msWillow(px, py, 5 + r() * 1.5, "#5a7a3a"));
    C.place(x - 34, y - 26, 6, (px, py) => msMenhir(px, py, 13, "#9a968a") + msGlow(px, py - 9, 6, "#b0f4ff", .5));
    C.scatter(5, 14, 50, 3, (px, py) => maReeds(px, py, 4, r)); },
  north_cross(C){ const {x, y, r} = C, rv = C.river(x, y, 70);
    C.main(18, [[-30, -18], [-36, 8], [20, -32], [-12, -36], [-20, 26]], (px, py) => maHouse(px, py, 16, 10, 10, "#b8a080", "#4a3424", {win:"#ffd27a"}) + msWoodTower(px - 16, py + 2, 18) + msBanner(px + 12, py + 2, 22, "#3a5a7a"));
    C.scatter(2, 16, 34, 3, (px, py) => msLantern(px, py));
    if (rv){ const nx = -Math.sin(rv.ang), ny = Math.cos(rv.ang); for (const [t, sd] of [[-30, 1], [34, -1], [48, 1]]){ const px = rv.x + Math.cos(rv.ang) * t + nx * rv.w * .2 * sd, py = rv.y + Math.sin(rv.ang) * t + ny * rv.w * .2 * sd; if (C.wet(px, py) && C.clear(px, py, 6, {wet:1})) C.put(py, msBoat(px, py, .8, "#6a4a2a", sd < 0)); } }
    C.scatter(3, 20, 60, 6, (px, py) => msCrate(px, py, 4.6));
    C.scatter(6, 40, 80, 6, (px, py) => maTree(px, py, 4 + r() * 1.5, "pine", "#2f4a28")); },
  sand(C){ const {x, y, r} = C; C.ground += msBlob(r, x - 10, y - 6, 64, "#d8c890", .16, 12) + msBlob(r, x - 10, y - 6, 44, "#e8dcb0", .16, 8);
    let du = ""; for (let i = 0; i < 6; i++){ const px = x - 60 + r() * 100, py = y - 24 + r() * 40; du += `M${px} ${py}q8 -4 16 0`; } C.ground += `<path d="${du}" stroke="#b8a870" stroke-width="1.2" fill="none" opacity=".7"/>`;
    const nest = (px, py) => msSh(px + 2, py + .5, 8, 2, .25) + `<ellipse cx="${px}" cy="${py - 1.5}" rx="8" ry="3.2" fill="#7a5a34"/><ellipse cx="${px}" cy="${py - 2.2}" rx="5.6" ry="2" fill="#4a3420"/><ellipse cx="${px - 2}" cy="${py - 3.4}" rx="1.8" ry="2.2" fill="#f2ece0"/><ellipse cx="${px + 1.4}" cy="${py - 3}" rx="1.8" ry="2.2" fill="#e8e0d0"/><ellipse cx="${px - .2}" cy="${py - 4.2}" rx="1.6" ry="2" fill="#faf6ee"/><path d="M${px - 8} ${py - 2}l-3 -1M${px + 8} ${py - 1}l3 -1.4M${px - 6} ${py - 4}l-2 -2" stroke="#7a5a34" stroke-width=".8"/>`;
    C.place(x - 26, y - 20, 9, nest); C.place(x - 4, y - 32, 9, nest); C.place(x - 52, y - 2, 9, nest); C.place(x + 22, y - 26, 9, nest);
    C.scatter(3, 20, 60, 6, (px, py) => `<path d="M${px - 8} ${py}l14 -3" stroke="#8a7a5a" stroke-width="2.6" stroke-linecap="round"/><path d="M${px + 2} ${py - 2}l3 -4" stroke="#8a7a5a" stroke-width="1.2"/>`);
    C.scatter(10, 12, 70, 3, (px, py) => `<path d="M${px} ${py}l-1.6 -4M${px} ${py}l.2 -5M${px} ${py}l1.8 -3.6" stroke="#9aa060" stroke-width=".8"/>`);
    C.scatter(3, 20, 60, 4, (px, py) => msRockC(px, py, 3 + r() * 2, "#a89a7a"));
    for (let i = 0; i < 4; i++) C.top += msCrow(x - 40 + r() * 60, y - 50 - r() * 20, .9, "#f2f2ee"); },
  order_camp(C){ const {x, y, r} = C, cx = x - 6, cy = y - 10, rx = 54, ry = 30; C.ground += msGround(cx, cy, rx + 4, ry + 3, "#7a6a4a", .32);
    msPalisade(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry));
    C.place(cx - 20, cy - 10, 12, (px, py) => msPavilion(px, py, 11, 20, "#ece4d0", "#9a2a2a", {flag:"#9a2a2a"}));
    for (const [ox, oy] of [[12, -16], [26, -6], [-40, 4], [-30, 14], [8, 14]]) C.place(cx + ox, cy + oy, 7, (px, py) => msRidgeTent(px, py, 12, 9, 9, "#d8d0bc"));
    C.place(cx + 2, cy + 2, 5, (px, py) => msFire(px, py, .9), {mark:1});
    C.place(cx - 4, cy - 22, 4, (px, py) => msBanner(px, py, 26, "#9a2a2a", "#ece4d0")); C.place(cx + 34, cy - 16, 4, (px, py) => msBanner(px, py, 22, "#ece4d0", "#9a2a2a"));
    C.place(cx - 46, cy - 12, 6, (px, py) => msWoodTower(px, py, 22));
    C.place(cx + 40, cy + 8, 4, (px, py) => msDummy(px, py)); C.place(cx + 46, cy + 2, 4, (px, py) => msDummy(px, py)); C.place(cx - 14, cy + 16, 6, (px, py) => msRack(px, py)); },
  dead_wood(C){ const {x, y, r} = C; C.ground += msGround(x - 6, y - 6, 66, 30, "#2a2820", .4);
    C.scatter(16, 28, 76, 6, (px, py) => msDeadTree(px, py, 5 + r() * 3), {tries:14});
    C.place(x - 22, y - 18, 8, (px, py) => msRidgeTent(px, py, 13, 10, 9, "#5a4a3a")); C.place(x + 2, y - 30, 8, (px, py) => msRidgeTent(px, py, 12, 9, 8, "#4a3e32"));
    C.place(x - 8, y - 8, 5, (px, py) => msFire(px, py), {mark:1});
    C.scatter(4, 14, 40, 3, (px, py) => msSkullPole(px, py)); C.scatter(4, 10, 50, 3, (px, py) => msBones(px, py));
    let fog = ""; for (let i = 0; i < 6; i++) fog += `<ellipse cx="${x - 60 + r() * 110}" cy="${y - 30 + r() * 50}" rx="${30 + r() * 30}" ry="${5 + r() * 4}" fill="#c8ccc4" opacity=".07"/>`; C.top += fog; },
  academy(C){ const {x, y, r} = C; C.ground += msGround(x - 10, y - 12, 66, 30, "#4a4a44", .35);
    const [ax, ay] = C.main(30, [[-10, -22], [-34, -12], [20, -30], [-30, 20]], (px, py) => msGothic(px, py, 30, 24, 22, "#8a8478", {ruin:1, gh:12}) + msBrokenTower(px - 24, py + 2, 7, 34, "#8a8478") + msBrokenTower(px + 26, py - 6, 5, 18, "#7a7468"));
    C.ground += `<ellipse cx="${ax - 2}" cy="${ay + 18}" rx="26" ry="9" fill="none" stroke="#b07aff" stroke-width="1.2" opacity=".7"/><ellipse cx="${ax - 2}" cy="${ay + 18}" rx="19" ry="6.4" fill="none" stroke="#b07aff" stroke-width=".8" stroke-dasharray="3 2" opacity=".7"/>` + msGlow(ax - 2, ay + 18, 26, "#b07aff", .3);
    for (const [ox, oy, s] of [[-30, -46, 1.2], [8, -52, 1], [30, -40, .9], [-6, 14, .8]]){ const px = ax + ox, py = ay + oy; C.top += msGlow(px, py, 10 * s, "#c08aff", .55) + `<path d="M${px} ${py - 6 * s}l${3 * s} ${6 * s}l-${3 * s} ${6 * s}l-${3 * s} -${6 * s}z" fill="#d6b0ff"/><path d="M${px} ${py - 6 * s}l${3 * s} ${6 * s}l-${3 * s} ${6 * s}z" fill="#8a5ad0"/>`; }
    C.scatter(10, 20, 64, 4, (px, py) => msRockC(px, py, 2.5 + r() * 2.5, "#8a8478")); C.scatter(4, 40, 70, 5, (px, py) => msDeadTree(px, py, 5)); },
  doom(C){ const {x, y, r} = C; C.ground += msGround(x - 4, y - 10, 62, 30, "#1d241a", .45);
    const trees = []; C.scatter(14, 30, 70, 6, (px, py) => { trees.push([px, py]); return maTree(px, py, 5.5 + r() * 2, r() < .5 ? "pine" : "leaf", r() < .5 ? "#1e3420" : "#2a3a24"); }, {tries:14});
    trees.sort((a, b) => a[0] - b[0]); for (let i = 0; i < trees.length - 1; i += 2){ const [ax, ay] = trees[i], [bx, by] = trees[i + 1]; if (Math.hypot(bx - ax, by - ay) < 50) C.top += `<g opacity=".55">${msWeb((ax + bx) / 2, (ay + by) / 2 - 12, 5 + r() * 2.5)}</g>`; }
    C.place(x - 28, y - 22, 8, (px, py) => `<path d="M${px - 9} ${py}l2 -16M${px + 9} ${py}l-2 -16" stroke="#2a251e" stroke-width="1.6"/>` + `<g opacity=".7">${msWeb(px, py - 9, 8)}</g>` + msCocoon(px - 5, py) + msCocoon(px + 4, py + 1));
    C.scatter(5, 14, 50, 3, (px, py) => msCocoon(px, py)); C.scatter(4, 14, 40, 3, (px, py) => msBones(px, py));
    for (let i = 0; i < 5; i++){ const px = x - 50 + r() * 80, py = y - 40 + r() * 46; if (!C.clear(px, py, 2)) continue; C.top += `<circle cx="${px}" cy="${py}" r=".9" fill="#ff3a3a"/><circle cx="${px + 2.4}" cy="${py}" r=".9" fill="#ff3a3a"/>` + msGlow(px + 1.2, py, 4, "#ff3a3a", .4); } },
  bay(C){ const {x, y, r} = C;
    C.main(26, [[-30, -20], [-36, 6], [-10, -34], [-40, 26], [10, 30]], (px, py) => msSh(px + 6, py + 2, 30, 6, .3) + `<path d="M${px - 26} ${py - 4}q4 8 22 8q14 0 24 -10l-4 -12q-6 8 -20 9q-14 1 -22 -2z" fill="#4a3424"/><path d="M${px - 26} ${py - 4}q8 -4 22 -3q14 0 20 -11l2 4q-6 10 -22 12q-14 1 -22 -2z" fill="#6a4a2e"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${px - 18 + i * 8} ${py + 2 - i}q-2 -10 2 -16" stroke="#2a1d12" stroke-width="1.6" fill="none"/>`).join("") + `<path d="M${px - 2} ${py - 4}l10 -30" stroke="#3a2a1a" stroke-width="2.2"/><path d="M${px + 7} ${py - 30}q-8 6 -6 16q6 -2 12 -10z" fill="#d8ccb0" opacity=".85"/><path d="M${px + 1} ${py - 14}l12 -3" stroke="#3a2a1a" stroke-width="1"/>` + `<ellipse cx="${px - 4}" cy="${py + 4}" rx="34" ry="5" fill="none" stroke="#c8dce4" stroke-width=".8" opacity=".5"/>`, {wet:1});
    C.scatter(6, 18, 60, 4, (px, py) => r() < .5 ? msBarrel(px, py, "#5a4028") : msCrate(px, py, 5, "#7a5a3a"), {wet:1});
    C.scatter(4, 20, 60, 5, (px, py) => maRock(px, py, 3 + r() * 3, true), {wet:1});
    for (let i = 0; i < 6; i++) C.top += msCrow(x - 50 + r() * 70, y - 46 - r() * 24, .9, "#f2f2ee"); },
  citadel(C){ const {x, y, r} = C, cx = x - 4, cy = y - 18, rx = 40, ry = 20; C.ground += msGround(cx, cy + 4, 62, 30, "#1e1a22", .45);
    msStoneRing(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry), "#3a3440", 10);
    C.put(cy - 2, maKeep(cx - 4, cy - 2, 18, 40, "#3a3440", {win:"#ff3a3a"}) + msGlow(cx - 4, cy - 30, 20, "#ff3a3a", .35));
    for (const [ox, oy, h] of [[-rx, 0, 26], [rx, -2, 28], [-rx * .6, ry * .8, 20], [rx * .6, ry * .8, 22], [0, -ry, 24]]) C.put(cy + oy, maTower(cx + ox, cy + oy, 5.6, h, "#3a3440", "#1e1a24", {win:"#ff5a3a", rh:13}));
    C.scatter(8, 50, 80, 6, (px, py) => msDeadTree(px, py, 5 + r() * 2.5)); for (let i = 0; i < 7; i++) C.top += msCrow(cx - 30 + r() * 60, cy - 70 - r() * 20); },

  /* Попелясті землі */
  tavern(C){ const {x, y, r} = C; C.ground += msGround(x - 10, y - 8, 54, 24, "#6a5a40", .35);
    const [tx, ty] = C.main(24, [[-18, -16], [-36, 0], [10, -30], [-30, 22]], (px, py) => maHouseG(px, py, 24, 17, 15, "#cbb48e", "#5a2a1e", {win:"#ffd27a", win2:"#ffd27a", chim:1, gh:12}) + `<path d="M${px - 12} ${py - 12}h-5" stroke="#3a2a1a" stroke-width="1.2"/><rect x="${px - 20}" y="${py - 12}" width="6" height="5" fill="#8a3a1e"/><circle cx="${px - 17}" cy="${py - 9.5}" r="1.3" fill="#c0c0c0"/>` + msGlow(px - 6, py - 12, 14, "#ffc860", .35) + msSmoke(px + 6, py - 36, .9));
    C.place(tx + 28, ty + 4, 12, (px, py) => maHouse(px, py, 18, 8, 10, "#8a6a44", "#5a3a26", {nodoor:true}) + `<path d="M${px - 6} ${py}v-6h12v6z" fill="#2a1d12"/>`);
    C.place(tx - 24, ty + 10, 9, (px, py) => msCart(px, py)); for (let i = 0; i < 3; i++) C.place(tx - 6 + i * 6, ty + 8, 3, (px, py) => msBarrel(px, py), {noclaim:1});
    C.place(tx + 16, ty + 16, 4, (px, py) => msLantern(px, py)); C.place(tx - 34, ty - 6, 4, (px, py) => msLantern(px, py));
    C.place(tx + 24, ty + 20, 6, (px, py) => `<path d="M${px - 8} ${py}h16M${px - 8} ${py - 3}h16M${px - 7} ${py + 1}v-6M${px + 7} ${py + 1}v-6" stroke="#5a4028" stroke-width="1.1"/>` + msSh(px + 2, py + 6, 5, 1.2, .2) + `<path d="M${px - 3} ${py + 5}h7q1 -4 -1 -5h-5zM${px + 4} ${py}l2 -3h1.6l-1 3" fill="#6a4a30"/>`);
    C.scatter(4, 16, 46, 3, (px, py, i) => msFolk(px, py, MA.pk(r, ["#5a4a3a", "#6a3a26", "#3a4a5a"]))); },
  forge(C){ const {x, y, r} = C; C.ground += msGround(x - 6, y - 8, 46, 22, "#2a2622", .4);
    const [fx, fy] = C.main(20, [[-14, -16], [-30, 2], [12, -30], [-24, 22]], (px, py) => maHouse(px, py, 22, 11, 13, "#7a6e60", "#2e2a28", {nodoor:true}) + `<path d="M${px - 8} ${py}v-8h10v8z" fill="#1a1410"/>` + msGlow(px - 3, py - 4, 14, "#ff7a2a", .6) + `<rect x="${px - 7}" y="${py - 5}" width="8" height="3" fill="#ff9a3a"/><rect x="${px + 5}" y="${py - 30}" width="5" height="20" fill="#5a524a"/><rect x="${px + 8.5}" y="${py - 30}" width="2" height="20" fill="#3a3632"/>` + msSmoke(px + 8, py - 34, 1.1, "#8a8680"));
    C.place(fx - 20, fy + 8, 5, (px, py) => msAnvil(px, py) + msGlow(px, py - 3, 5, "#ffb060", .4)); C.place(fx - 30, fy, 4, (px, py) => msBarrel(px, py, "#4a4a4a"));
    C.place(fx + 22, fy + 8, 8, (px, py) => msSh(px + 3, py + 1, 9, 2, .25) + `<path d="M${px - 8} ${py}q8 -10 16 0z" fill="#1e1c1a"/><path d="M${px - 4} ${py - 3}l2 -1M${px + 2} ${py - 4}l2 1" stroke="#4a4642" stroke-width="1"/>`);
    C.place(fx + 8, fy + 18, 6, (px, py) => msSh(px + 2, py + 1, 6, 1.6, .25) + `<path d="M${px - 6} ${py}q6 -7 12 0z" fill="#7a5a4a"/><circle cx="${px - 2}" cy="${py - 2}" r="1.2" fill="#a07050"/><circle cx="${px + 2}" cy="${py - 3}" r="1" fill="#906040"/>`);
    C.place(fx - 10, fy + 20, 6, (px, py) => msRack(px, py)); C.scatter(4, 30, 60, 4, (px, py) => msRockC(px, py, 3, "#5a5650")); },
  ford(C){ const {x, y, r} = C, rv = C.river(x, y, 60);
    if (rv){ const nx = -Math.sin(rv.ang), ny = Math.cos(rv.ang), cx = rv.x + Math.cos(rv.ang) * 24, cy = rv.y + Math.sin(rv.ang) * 24;
      for (let i = -3; i <= 3; i++){ const px = cx + nx * i * 4.4, py = cy + ny * i * 4.4; C.put(py, maRock(px, py + 1, 2.3 + (i % 2) * .6, true)); }
      const hx = rv.x - Math.cos(rv.ang) * 30 + nx * (rv.w * .5 + 8), hy = rv.y - Math.sin(rv.ang) * 30 + ny * (rv.w * .5 + 8);
      C.place(hx, hy, 10, (px, py) => `<path d="M${px - 6} ${py + 3}v-6M${px + 6} ${py + 3}v-6M${px} ${py + 4}v-6" stroke="#3a2a1a" stroke-width="1.4"/>` + maHouse(px, py - 3, 14, 8, 9, "#7a7064", "#3e3832"), {wet:1});
      const bx = rv.x + Math.cos(rv.ang) * 50, by = rv.y + Math.sin(rv.ang) * 50; if (C.wet(bx, by)) C.put(by, msBoat(bx, by, .9, "#5a4a3a")); }
    C.scatter(8, 16, 60, 3, (px, py) => maReeds(px, py, 4, r), {wet:1}); C.scatter(2, 20, 40, 4, (px, py) => msLantern(px, py, "#d0e0ff"));
    C.scatter(4, 30, 64, 5, (px, py) => msDeadTree(px, py, 4.5)); },
  ruins(C){ const {x, y, r} = C, cx = x - 8, cy = y - 16, rx = 40, ry = 20; C.ground += msGround(cx, cy + 4, 56, 28, "#3e3a34", .35);
    msStoneRing(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry), "#9a9282", 12, {ruin:1, gap:i => i % 7 === 3});
    C.put(cy - 6, msBrokenTower(cx - 10, cy - 6, 9, 30, "#8a8478")); C.put(cy + 4, maRuin(cx + 16, cy + 4, 16, 12));
    C.place(cx + 2, cy + 10, 8, (px, py) => msStair(px, py, 13, "#7aff9a"), {mark:1});
    C.scatter(10, 20, 60, 3, (px, py) => msRockC(px, py, 2 + r() * 2.4, "#7a7468")); C.place(cx - 32, cy + 8, 4, (px, py) => msBanner(px, py, 20, "#5a4a3a", "#9a8a6a", {torn:1})); },
  ravine(C){ const {x, y, r} = C;
    const [gx, gy] = C.spot(32, [[-22, -22], [-40, 0], [8, -38], [-22, 28], [26, 30]]); C.claim(gx, gy, 34);
    const L = 70, a = -.32, ux = Math.cos(a), uy = Math.sin(a), N = 14, NR = [], SR = [], FL = [];
    for (let i = 0; i <= N; i++){ const t = i / N, w = Math.pow(Math.max(0, Math.sin(t * 3.1416)), .7) * 10 + .8, cx = gx + ux * (t - .5) * L + (r() * 2 - 1) * 1.5, cy = gy + uy * (t - .5) * L + (r() * 2 - 1) * 1.2;
      NR.push([cx + (r() * 2 - 1), cy - w + (r() * 2 - 1) * 1.2]); SR.push([cx + (r() * 2 - 1), cy + w * .55 + (r() * 2 - 1)]); FL.push([NR[i][0], NR[i][1] + w * 1.15]); }
    const pl = a => a.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(""), rv = a => a.slice().reverse().map(p => "L" + p[0] + " " + p[1]).join("");
    let st = ""; for (let k = 1; k < 4; k++) st += pl(NR.map((p, i) => [p[0], p[1] + (FL[i][1] - p[1]) * k / 4]));
    C.put(gy - 6, msSh(gx + 8, gy + 6, L * .6, 12, .22) + `<path d="${pl(NR)}${rv(SR)}z" fill="#120e0a"/><path d="${pl(NR)}${rv(FL)}z" fill="#7a7266"/><path d="${st}" stroke="#5a544a" stroke-width=".8" fill="none"/><path d="${pl(FL)}" stroke="#3a3630" stroke-width="1.4" fill="none"/><path d="${pl(NR)}" stroke="#4e5a38" stroke-width="2.2" fill="none"/><path d="${pl(SR)}" stroke="#8a8478" stroke-width="1.8" fill="none"/><path d="${pl(SR)}" stroke="#4e5a38" stroke-width="1.6" fill="none" transform="translate(0 1.6)"/>`);
    for (let i = 0; i < 9; i++){ const k = 1 + Math.floor(r() * (N - 2)), up = r() < .55, [px, py] = up ? [NR[k][0], NR[k][1] - 3 - r() * 4] : [SR[k][0], SR[k][1] + 5 + r() * 3]; if (C.clear(px, py, 3, {foot:1})) C.put(py, maTree(px, py, 4.4 + r() * 1.6, "pine", "#2a3e28")); }
    C.place(gx - 30, gy + 20, 10, (px, py) => msCave(px, py, 10, 11), {foot:1});
    C.scatter(5, 20, 60, 3, (px, py) => msBones(px, py)); C.scatter(5, 20, 60, 4, (px, py) => msRockC(px, py, 3 + r() * 2, "#6a665c"));
    C.scatter(3, 20, 50, 4, (px, py) => msSh(px + 2, py + .5, 4, 1, .2) + `<path d="M${px - 4} ${py}l1 -3h5l2 -2l1 2l-1 3z" fill="#6a6660"/><path d="M${px + 4} ${py - 5}l1.4 -2l.6 2" fill="#6a6660"/>`); },
  swamp(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 60, 28, "#2a3a2a", .3);
    C.scatter(6, 14, 60, 9, (px, py) => maPool(px, py, 8 + r() * 10, 3 + r() * 3, "#1f3236"), {claim:1});
    C.scatter(9, 10, 64, 3, (px, py) => maReeds(px, py, 5, r)); C.scatter(6, 20, 66, 5, (px, py) => msDeadTree(px, py, 4.5 + r() * 2, "#2a2a22"));
    C.place(x - 30, y - 16, 12, (px, py) => [0, 1, 2, 3, 4, 5].map(i => `<path d="M${px - 14 + i * 5} ${py + 2 - i * 2}l2 -4" stroke="#6a5038" stroke-width="2.4"/>`).join(""), {wet:1});
    for (let i = 0; i < 6; i++){ const px = x - 55 + r() * 90, py = y - 40 + r() * 50; if (C.clear(px, py, 2)) C.top += msGlow(px, py, 7, r() < .5 ? "#9affc0" : "#a0d8ff", .55); } },
  camp(C){ const {x, y, r} = C, cx = x - 4, cy = y - 8, rx = 58, ry = 32; C.ground += msGround(cx, cy, rx + 4, ry + 3, "#5a4a36", .35);
    const G = siteRingGates(C, cx, cy, rx, ry); msPalisade(C, cx, cy, rx, ry, G, "#5a3e26", 10);
    for (const g of G){ const px = cx + Math.cos(g) * rx, py = cy + Math.sin(g) * ry, tx = -Math.sin(g) * rx, ty = Math.cos(g) * ry, tl = Math.hypot(tx, ty); C.put(py + .2, msWoodTower(px + tx / tl * 13, py + ty / tl * 13, 20, "#5a3e26")); }
    C.place(cx - 18, cy - 12, 12, (px, py) => msPavilion(px, py, 11, 20, "#7a2a22", "#1e1a18", {flag:"#1e1a18"}));
    for (const [ox, oy] of [[14, -20], [30, -10], [-44, 2], [-34, 16], [12, 16], [-6, -26]]) C.place(cx + ox, cy + oy, 7, (px, py) => msRidgeTent(px, py, 12, 9, 9, MA.pk(r, ["#8a7454", "#7a6a50", "#6a5a42"])));
    C.place(cx + 2, cy + 2, 5, (px, py) => msFire(px, py), {mark:1});
    C.place(cx - 2, cy - 30, 4, (px, py) => msBanner(px, py, 28, "#7a2a22", "#1e1a18")); C.place(cx + 40, cy - 20, 4, (px, py) => msBanner(px, py, 22, "#1e1a18", "#c0a040"));
    C.place(cx + 40, cy + 12, 10, (px, py) => msCart(px, py)); C.place(cx - 20, cy + 20, 6, (px, py) => msRack(px, py)); C.place(cx + 26, cy + 20, 4, (px, py) => msDummy(px, py));
    C.scatter(6, 10, 40, 2.5, (px, py) => msFolk(px, py, MA.pk(r, ["#4a3a2a", "#7a2a22", "#3a3a3a"]))); },
  chapel(C){ const {x, y, r} = C; C.ground += msGround(x - 6, y - 8, 56, 26, "#26221e", .4);
    const [cx, cy] = C.main(22, [[-12, -20], [-30, -6], [16, -32], [-24, 20]], (px, py) => msGothic(px + 6, py, 18, 16, 20, "#4a4440", {roof:"#22201e", gh:12, lit:"#ffb84a"}) + maKeep(px - 9, py + 2, 9, 30, "#4a4440") + `<path d="M${px - 13.6} ${py - 28}L${px - 9} ${py - 46}L${px - 4.4} ${py - 28}z" fill="#2a2624"/><path d="M${px - 9} ${py - 46}L${px - 4.4} ${py - 28}L${px - 1} ${py - 31}z" fill="#1a1816"/><path d="M${px - 9} ${py - 46}v-5M${px - 11} ${py - 49}h4" stroke="#8a8478" stroke-width=".9"/>`);
    const gx = cx + 4, gy = cy + 24; C.ground += `<ellipse cx="${gx}" cy="${gy}" rx="30" ry="11" fill="#3a3a2e" opacity=".5"/>`;
    for (let i = 0; i < 12; i++){ const px = gx - 24 + (i % 6) * 9 + (r() * 2 - 1), py = gy - 6 + Math.floor(i / 6) * 8; if (C.clear(px, py, 3)) C.put(py, i % 3 ? maGrave(px, py, "#6a6660") : maCross(px, py, .7, "#4a4036")); }
    C.place(gx - 32, gy, 4, (px, py) => msLantern(px, py, "#ffb84a")); C.scatter(6, 34, 70, 5, (px, py) => msDeadTree(px, py, 5 + r() * 2)); for (let i = 0; i < 6; i++) C.top += msCrow(cx - 20 + r() * 50, cy - 60 - r() * 18); },
  pass(C){ const {x, y, r} = C; C.ground += msBlob(r, x - 6, y - 8, 46, "#e8ece8", .12, 6);
    C.main(30, [[-36, -10], [-44, 14], [-30, -30]], (px, py) => maPeak(px, py, 30, true) + maPeak(px + 18, py + 6, 20, true));
    C.main(26, [[30, -34], [8, -40], [44, -20], [-10, 34]], (px, py) => maPeak(px, py, 26, true));
    C.place(x - 6, y - 20, 10, (px, py) => msSh(px + 4, py + 1, 12, 2.4, .3) + `<path d="M${px - 10} ${py}v-14q10 -10 20 0v14h-4v-12q-6 -6 -12 0v12z" fill="#8a867a"/><path d="M${px + 6} ${py}v-12q2 0 4 2v10z" fill="#5a5650"/><path d="M${px - 10} ${py - 14}q10 -10 20 0" stroke="#f2f4f2" stroke-width="1.6" fill="none"/>`);
    C.place(x - 22, y + 12, 5, (px, py) => [0, 1, 2, 3].map(i => `<ellipse cx="${px}" cy="${py - i * 2.6}" rx="${4.4 - i}" ry="1.6" fill="${shade("#8a867a", 1 - i * .06)}"/>`).join(""));
    C.place(x + 22, y + 18, 4, (px, py) => msBanner(px, py, 18, "#3a5a7a", "#f2f4f2", {torn:1})); C.scatter(6, 20, 66, 4, (px, py) => msRockC(px, py, 3 + r() * 2.5, "#8a8e8a"));
    C.scatter(5, 40, 70, 5, (px, py) => maTree(px, py, 4 + r() * 1.5, "pine", "#2a3e2e")); },

  /* Закарпаття */
  uzh(C){ const {x, y, r} = C; C.ground += msGround(x - 10, y - 8, 50, 22, "#4a6a2e", .3);
    const [hx, hy] = C.main(20, [[-24, -16], [-36, 4], [12, -30], [-20, 22]], (px, py) => maHouseG(px, py, 15, 10, 10, "#8a6a44", "#3a4a2a", {chim:1, win:"#ffd27a"}) + msSmoke(px + 4, py - 26, .7));
    for (let i = 0; i < 5; i++) C.place(hx - 24 + i * 6, hy + 14 + (i % 2) * 2, 3, (px, py) => msBeehive(px, py), {noclaim:1});
    C.place(hx + 22, hy + 6, 10, (px, py) => msLogs(px, py)); C.place(hx - 26, hy - 4, 5, (px, py) => msFence([[px - 8, py], [px + 8, py - 3]]));
    C.scatter(2, 30, 50, 4, (px, py) => msSh(px + 2, py + .5, 4, 1, .2) + `<path d="M${px - 3} ${py}v-3M${px + 2} ${py}v-3" stroke="#5a3a20" stroke-width=".8"/><ellipse cx="${px}" cy="${py - 4}" rx="3.6" ry="1.8" fill="#9a6a3a"/><path d="M${px - 3} ${py - 5}l-1.6 -3l-1 -1M${px - 3.6} ${py - 7}l1 -2" stroke="#5a3a20" stroke-width=".8" fill="none"/><circle cx="${px - 3.6}" cy="${py - 6}" r="1.2" fill="#9a6a3a"/>`);
    C.scatter(8, 36, 72, 6, (px, py) => maTree(px, py, 4.5 + r() * 1.5, r() < .6 ? "pine" : "leaf", r() < .6 ? "#2f4a28" : "#4a6a2e")); },
  perech(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 52, 22, "#5a4a32", .3);
    const [sx, sy] = C.main(22, [[-24, -14], [-36, 6], [14, -30], [-24, 24]], (px, py) => maHouse(px, py, 26, 10, 12, "#8a6a44", "#4a3424", {nodoor:true}) + `<path d="M${px - 10} ${py}v-7h12v7z" fill="#2a1d12"/><path d="M${px - 18} ${py - 4}h10" stroke="#c8a070" stroke-width="3"/>`);
    C.place(sx + 26, sy + 6, 10, (px, py) => msLogs(px, py)); C.place(sx - 30, sy + 10, 10, (px, py) => msLogs(px, py, 2)); C.place(sx + 6, sy + 18, 10, (px, py) => msLogs(px, py));
    for (const [ox, oy] of [[-40, -14], [-52, 2]]) C.place(sx + ox, sy + oy, 7, (px, py) => msSh(px + 3, py + 1, 8, 2, .25) + `<path d="M${px - 7} ${py}q7 -12 14 0z" fill="#3a3430"/><path d="M${px} ${py - 9}q7 3 7 9h-7z" fill="#26221e"/>` + msSmoke(px + 1, py - 12, .8, "#7a7670"));
    C.scatter(8, 38, 74, 6, (px, py) => maTree(px, py, 4.5 + r() * 1.5, "pine", "#2f4a28")); C.scatter(5, 20, 50, 3, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="2.2" ry="1.2" fill="#c8a070" stroke="#6a4a2a" stroke-width=".6"/>`); },
  velbz(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 8, 60, 26, "#3a5a2a", .3);
    C.main(18, [[-30, -14], [-40, 8], [12, -32]], (px, py) => msOak(px, py, 9, "#3a5a26"));
    C.place(x + 14, y - 30, 16, (px, py) => msOak(px, py, 7.5, "#44602a")); C.place(x - 56, y - 22, 14, (px, py) => msOak(px, py, 7, "#3e5a28")); C.place(x - 50, y + 20, 14, (px, py) => msOak(px, py, 6.5, "#4a6a2e"));
    C.place(x - 10, y - 16, 6, (px, py) => msSh(px + 3, py + 1, 6, 1.4, .3) + `<path d="M${px - 3} ${py}v-14l3 -2.4l3 2.4v14z" fill="#8a7a5a"/><path d="M${px} ${py - 16.4}l3 2.4v14h-3z" fill="#5a4e3a"/><circle cx="${px - 1.4}" cy="${py - 12}" r=".7" fill="#1d1812"/><circle cx="${px + 1}" cy="${py - 12}" r=".7" fill="#1d1812"/><path d="M${px - 1.6} ${py - 8.4}h2.8" stroke="#1d1812" stroke-width=".7"/>`);
    C.place(x - 30, y + 16, 9, (px, py) => msMenhir(px - 6, py, 9, "#7a766a") + msMenhir(px + 6, py, 9, "#7a766a") + `<path d="M${px - 10} ${py - 10}h20l2 -2h-20z" fill="#9a968a"/><rect x="${px - 10}" y="${py - 10}" width="20" height="2.4" fill="#6a665a"/>`);
    let fog = ""; for (let i = 0; i < 5; i++) fog += `<ellipse cx="${x - 60 + r() * 100}" cy="${y - 20 + r() * 40}" rx="${30 + r() * 20}" ry="${4 + r() * 3}" fill="#e0e8e0" opacity=".07"/>`; C.top += fog; },
  sval(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 8, 48, 22, "#5a7a3a", .3);
    const [px0, py0] = C.main(18, [[-20, -14], [-34, 6], [12, -30], [-20, 24]], (px, py) => { const id = "dm" + Math.round(px); let s = msSh(px + 6, py + 2, 16, 3.4, .3) + `<ellipse cx="${px}" cy="${py}" rx="13" ry="4.4" fill="#cfc6ae"/>`; for (const k of [-.85, -.4, .05, .5, .9]) s += `<rect x="${px + k * 11 - 1}" y="${py - 14}" width="2" height="14" fill="${k > .2 ? "#a8a08a" : "#efe8d6"}"/>`; return s + `<ellipse cx="${px}" cy="${py - 14}" rx="13" ry="4" fill="#bfb6a0"/><path d="M${px - 13} ${py - 14}a13 11 0 0 1 26 0z" fill="#4a8a7a"/><path d="M${px} ${py - 25}a13 11 0 0 1 13 11h-13z" fill="#2e5e52"/><path d="M${px} ${py - 25}v-4" stroke="#d9c070" stroke-width="1"/><ellipse cx="${px}" cy="${py - 1}" rx="6" ry="2" fill="#6ac0c8"/>`; });
    C.place(px0 - 26, py0 + 10, 9, (px, py) => maPool(px, py, 9, 3.4, "#3a8a92") + msSmoke(px, py - 4, .6, "#e8f0f0"), {noclaim:0});
    C.place(px0 + 22, py0 + 10, 5, (px, py) => `<path d="M${px - 6} ${py}h12l2 -2h-12zM${px - 5} ${py}v2M${px + 5} ${py}v2" stroke="#5a4028" stroke-width="1.4" fill="#7a5a3a"/>`);
    C.scatter(6, 30, 66, 6, (px, py) => maTree(px, py, 4 + r() * 1.5, r() < .5 ? "leaf" : "pine", r() < .5 ? "#4a6a2e" : "#2f4a28")); C.scatter(3, 16, 40, 3, (px, py) => msFolk(px, py, MA.pk(r, ["#3a5a7a", "#7a3a26", "#5a6a30"]))); },
  muk(C){ const {x, y, r} = C;
    const [hx, hy] = C.main(30, [[-24, -16], [-34, 8], [12, -32], [-20, 26]], (px, py) => maHill(px, py + 6, 38, 22, "#5a7a3a") + `<ellipse cx="${px}" cy="${py - 10}" rx="24" ry="8" fill="none" stroke="#d8d0bc" stroke-width="3"/>` + maOnion(px - 6, py - 12, "#f2ead6", "#3a8a5a") + maTower(px + 14, py - 10, 3.6, 18, "#f2ead6", "#3a8a5a"));
    for (let i = 0; i < 12; i++){ const px = hx - 50 + (i % 6) * 9 + (Math.floor(i / 6) * 4), py = hy + 22 + Math.floor(i / 6) * 8; if (C.clear(px, py, 3)) C.put(py, maTree(px, py, 2.8, "leaf", i % 3 ? "#5a7a30" : "#6a8a3a") + (i % 4 === 0 ? `<circle cx="${px - 1}" cy="${py - 4}" r=".8" fill="#c03a2a"/>` : "")); }
    C.scatter(3, 20, 50, 3, (px, py) => msFolk(px, py, "#2a2420", 1)); C.scatter(3, 30, 60, 3, (px, py) => msBeehive(px, py)); },
  ber(C){ const {x, y, r} = C;
    const [hx, hy] = C.main(26, [[-22, -16], [-34, 6], [14, -32]], (px, py) => maHill(px, py + 4, 30, 18, "#6a7a3a") + `<path d="M${px - 7} ${py + 4}v-8a7 7 0 0 1 14 0v8z" fill="#5a4e3e"/><path d="M${px - 5} ${py + 4}v-7a5 5 0 0 1 10 0v7z" fill="#1d1812"/><path d="M${px} ${py - 8}v8" stroke="#3a2a1a" stroke-width=".8"/>` + msBarrel(px + 12, py + 6) + msBarrel(px + 17, py + 8) + msBarrel(px - 12, py + 7));
    for (let k = 0; k < 6; k++){ const ox = x - 66 + k * 9, oy = y - 30 + k * 3; if (!C.clear(ox + 14, oy + 6, 8)) continue; let d = ""; for (let i = 0; i < 6; i++) d += `M${ox + i * 4} ${oy + i * 2.6}l2 -1`; C.put(oy + 8, `<path d="M${ox} ${oy}l24 15" stroke="#4a3a28" stroke-width=".8"/><path d="${d}" stroke="#4e7a2a" stroke-width="3.2" stroke-linecap="round"/>`); }
    C.place(hx + 30, hy + 14, 8, (px, py) => msSh(px + 4, py + 1, 9, 2, .3) + `<path d="M${px - 7} ${py}v-9l7 -6l7 6v9z" fill="#6a6458"/><path d="M${px} ${py - 15}l7 6v9h4v-8l-7 -6z" fill="#4a463e"/><path d="M${px - 3} ${py}v-6h6v6z" fill="#120e0a"/>` + msGlow(px, py - 3, 8, "#9a6aff", .3));
    C.scatter(3, 30, 60, 3, (px, py) => msCrow(px, py - 20)); },
  vyn(C){ const {x, y, r} = C;
    C.main(30, [[-22, -18], [-34, 4], [14, -34]], (px, py) => maHill(px, py + 8, 36, 24, "#5a6a3a") + msBrokenTower(px - 4, py - 8, 8, 28, "#9a9078") + msWallSeg(px - 26, py - 4, px - 10, py - 8, 8, "#9a9078", {ruin:1}) + msWallSeg(px + 4, py - 8, px + 22, py - 2, 7, "#8a8068", {ruin:1, seed:3}));
    for (let k = 0; k < 8; k++){ const ox = x - 70 + k * 10, oy = y + 4 + (k % 2) * 2; if (!C.clear(ox + 12, oy + 4, 8)) continue; let d = ""; for (let i = 0; i < 6; i++) d += `M${ox + i * 4} ${oy + i * 1.6}l2 -1`; C.put(oy + 6, `<path d="M${ox} ${oy}l24 9" stroke="#4a3a28" stroke-width=".8"/><path d="${d}" stroke="#4e7a2a" stroke-width="3.2" stroke-linecap="round"/>` + (k % 3 === 0 ? `<circle cx="${ox + 10}" cy="${oy + 2}" r="1.1" fill="#5a2a5a"/>` : "")); }
    C.scatter(3, 20, 50, 4, (px, py) => msBarrel(px, py)); C.scatter(2, 20, 50, 3, (px, py) => msFolk(px, py, "#6a3a5a")); },
  irsh(C){ const {x, y, r} = C;
    const [px0, py0] = C.main(24, [[-28, -10], [-36, 10], [8, -30], [-20, 26]], (px, py) => maPool(px, py - 4, 24, 9, "#2a4a52"), {dy:-14});
    C.place(px0 + 16, py0 - 14, 9, (px, py) => `<path d="M${px - 6} ${py + 2}v-4M${px + 6} ${py + 2}v-4" stroke="#3a2a1a" stroke-width="1.2"/>` + maHouse(px, py - 2, 12, 7, 8, "#8a6a44", "#4a3a2a"), {wet:1});
    C.place(px0 - 6, py0 - 6, 6, (px, py) => msBoat(px, py, .8, "#5a3e26"), {wet:1}); C.place(px0 - 22, py0 - 2, 4, (px, py) => msHeron(px, py), {wet:1});
    C.put(py0 - 4, `<path d="M${px0 + 8} ${py0 - 10}l14 -6" stroke="#6a4a2a" stroke-width="3"/>`);
    C.scatter(10, 20, 60, 3, (px, py) => maReeds(px, py, 5, r), {wet:1}); C.scatter(3, 30, 60, 7, (px, py) => msWillow(px, py, 5, "#5a7a3a")); },
  volv(C){ const {x, y, r} = C; C.ground += msBlob(r, x - 8, y - 6, 50, "#7a9a4a", .14, 6);
    C.main(30, [[-10, -40], [-34, -30], [20, -44]], (px, py) => maPeak(px - 14, py, 22, false) + maPeak(px + 12, py + 4, 18, false), {});
    const [kx, ky] = C.main(14, [[-28, -10], [-38, 8], [14, -24], [-20, 22]], (px, py) => maHouse(px, py, 14, 7, 10, "#7a5a3a", "#3a2a1a", {nodoor:false}) + msSmoke(px + 2, py - 18, .7));
    const fx = kx + 22, fy = ky + 16; if (C.clear(fx, fy, 16)){ C.put(fy - 6, msFence([[fx - 18, fy - 6], [fx + 14, fy - 10]])); C.put(fy + 10, msFence([[fx + 14, fy - 10], [fx + 18, fy + 6], [fx - 14, fy + 10], [fx - 18, fy - 6]])); C.claim(fx, fy, 16); for (let i = 0; i < 7; i++){ const sx = fx - 10 + r() * 22, sy = fy - 4 + r() * 10; C.put(sy, msSheep(sx, sy)); } }
    C.scatter(6, 30, 70, 3, (px, py) => msSheep(px, py)); C.place(kx - 18, ky + 10, 3, (px, py) => msFolk(px, py, "#3a2a1a") + `<path d="M${px + 2} ${py}l3 -9" stroke="#4a3424" stroke-width=".8"/>`);
    C.scatter(5, 40, 76, 5, (px, py) => maTree(px, py, 4 + r(), "pine", "#2a4a2a")); },
  hust(C){ const {x, y, r} = C;
    const [hx, hy] = C.main(30, [[-26, -18], [-36, 4], [14, -34]], (px, py) => maHill(px, py + 8, 36, 24, "#5a6a3a") + msBrokenTower(px - 10, py - 8, 7, 22, "#9a9078") + msWallSeg(px - 4, py - 10, px + 14, py - 6, 9, "#8a8068", {ruin:1, seed:2}) + msBrokenTower(px + 18, py - 6, 5, 14, "#8a8068"));
    for (let i = 0; i < 60; i++){ const a = r() * 6.283, d = Math.sqrt(r()) * 46, px = x - 20 + Math.cos(a) * d, py = y + 14 + Math.sin(a) * d * .4; if (!C.clear(px, py, 1.5)) continue; C.put(py, `<path d="M${px} ${py}v-3" stroke="#5a7a30" stroke-width=".6"/><circle cx="${px}" cy="${py - 3.4}" r="1.3" fill="#faf6e8"/><circle cx="${px}" cy="${py - 3.4}" r=".5" fill="#e8b020"/>`); } },
  mizh(C){ const {x, y, r} = C;
    const lx = x - 6, ly = y + 42; C.ground += maPool(lx, ly, 52, 20, "#24485a") + `<ellipse cx="${lx}" cy="${ly}" rx="44" ry="15" fill="#2e5a6a" opacity=".5"/><path d="M${lx - 30} ${ly - 4}q10 -3 20 0M${lx + 8} ${ly + 6}q8 -2 16 0" stroke="#8ab0c0" stroke-width=".8" fill="none" opacity=".6"/>`;
    C.put(ly + 2, `<ellipse cx="${lx + 6}" cy="${ly + 1}" rx="10" ry="4" fill="#3a5a2a"/>` + maTree(lx + 3, ly + 1, 3.6, "pine", "#24392a") + maTree(lx + 9, ly + 2, 3, "pine", "#2a4030"));
    C.put(ly + 8, msBoat(lx - 24, ly + 8, .8, "#6a4a2a"));
    for (let i = 0; i < 18; i++){ const a = i / 18 * 6.283, px = lx + Math.cos(a) * 62, py = ly + Math.sin(a) * 26; if (C.clear(px, py, 4)) C.put(py, maTree(px, py, 4.5 + r() * 1.6, "pine", MA.pk(r, ["#24392a", "#2f4a28", "#2a4030"]))); }
    C.place(x - 40, y - 12, 9, (px, py) => maHouse(px, py, 12, 7, 8, "#7a5a3a", "#3a2a1a")); },
  tia(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 56, 24, "#8a8478", .3);
    const [mx, my] = C.main(22, [[-20, -16], [-34, 4], [14, -32]], (px, py) => maHouse(px + 10, py, 18, 10, 11, "#8a7e6e", "#4a3e34", {nodoor:true}) + msSh(px - 4, py + 1, 10, 2.4, .3) + `<path d="M${px - 14} ${py}l6 -34M${px} ${py}l-6 -34M${px - 12} ${py - 12}l10 0M${px - 11} ${py - 22}l8 0M${px - 13} ${py}l12 -20M${px - 1} ${py}l-12 -20" stroke="#4a3a2a" stroke-width="1.3"/><circle cx="${px - 7}" cy="${py - 35}" r="5" fill="none" stroke="#3a2a1a" stroke-width="1.4"/><path d="M${px - 12} ${py - 35}h10M${px - 7} ${py - 40}v10" stroke="#3a2a1a" stroke-width=".7"/>`);
    for (const [ox, oy, s] of [[-30, 10, 1], [-42, 2, .8], [22, 14, .9]]) C.place(mx + ox, my + oy, 9 * s, (px, py) => msSh(px + 3, py + 1, 10 * s, 2.2, .25) + `<path d="M${px - 9 * s} ${py}L${px} ${py - 11 * s}L${px + 9 * s} ${py}z" fill="#f4f2ee"/><path d="M${px} ${py - 11 * s}L${px + 9 * s} ${py}H${px + 1}z" fill="#c8c8cc"/>`);
    C.place(mx + 4, my + 28, 14, (px, py) => maPool(px, py, 14, 5, "#4aa0a8") + `<ellipse cx="${px}" cy="${py}" rx="16" ry="6" fill="none" stroke="#f4f2ee" stroke-width="1.2" opacity=".7"/>`);
    C.place(mx - 16, my + 20, 8, (px, py) => `<path d="M${px - 14} ${py + 2}l28 -6M${px - 14} ${py + 5}l28 -6" stroke="#5a4a3a" stroke-width=".9"/>` + msCart(px, py, `<path d="M${px - 7} ${py - 9}q6 -4 12 0z" fill="#f4f2ee"/>`)); },
  rah(C){ const {x, y, r} = C; C.ground += msBlob(r, x - 8, y - 8, 50, "#e8ece8", .12, 6);
    const [px0, py0] = C.main(34, [[-12, -20], [-34, -6], [16, -36]], (px, py) => maPeak(px + 16, py - 12, 26, true) + maPeak(px - 22, py - 4, 22, true) + msCave(px, py + 2, 16, 18, "#9a5aff"));
    C.place(px0 + 34, py0 - 44, 8, (px, py) => maHouse(px, py, 10, 6, 7, "#efeae0", "#6a6a70", {nodoor:true}) + `<path d="M${px - 4} ${py - 6}a4 4 0 0 1 8 0z" fill="#d8dcdc"/>`, {foot:1});
    C.scatter(6, 20, 64, 4, (px, py) => msRockC(px, py, 3 + r() * 2.4, "#8a8e8a")); C.scatter(4, 30, 60, 3, (px, py) => msBones(px, py)); },

  /* Кістяна Марка */
  mk_bell(C){ const {x, y, r} = C, cx = x - 6, cy = y - 14, rx = 44, ry = 22; C.ground += msGround(cx, cy, rx + 6, ry + 4, "#8a8270", .3);
    msStoneRing(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry), "#b8ae96", 7);
    C.put(cy - 4, msGothic(cx + 4, cy - 4, 22, 16, 20, "#cfc6ae", {roof:"#4a4038", gh:11, lit:"#ffd27a"}));
    C.put(cy - 2, maKeep(cx - 18, cy - 2, 10, 34, "#cfc6ae") + `<rect x="${cx - 21.5}" y="${cy - 30}" width="7" height="8" fill="#1d1812"/><path d="M${cx - 20.5} ${cy - 23}q2.5 -6 5 0z" fill="#c9a24a"/><path d="M${cx - 23} ${cy - 36}L${cx - 18} ${cy - 52}L${cx - 13} ${cy - 36}z" fill="#4a4038"/><path d="M${cx - 18} ${cy - 52}L${cx - 13} ${cy - 36}L${cx - 8} ${cy - 40}z" fill="#2e2824"/>`);
    C.place(cx + 22, cy + 8, 10, (px, py) => maGarden(px, py, 16, 8, r)); C.place(cx - 26, cy + 10, 5, (px, py) => msWell(px, py));
    C.scatter(3, 10, 30, 2.5, (px, py) => msFolk(px, py, "#3a3430", 1)); },
  mk_road(C){ const {x, y, r} = C;
    for (const rd of ROADS){ if (rd.a !== C.id && rd.b !== C.id) continue; const P = C.rpts(rd, C.id);
      for (let i = 6; i < 40; i += 6){ const [px, py] = P[i], [qx, qy] = P[i + 1], a = Math.atan2(qy - py, qx - px), nx = -Math.sin(a) * 10, ny = Math.cos(a) * 10, sd = (i / 6) % 2 ? 1 : -1; const cx = px + nx * sd, cy = py + ny * sd; if (C.clear(cx, cy, 3)) C.put(cy, maCross(cx, cy, 1.1, "#4a3e30")); } }
    C.main(14, [[-24, -16], [-30, 10], [10, -28]], (px, py) => msSh(px + 4, py + 1, 8, 2, .3) + `<path d="M${px - 1.4} ${py}v-16h2.8v16z" fill="#5a4a38"/><path d="M${px - 7} ${py - 18}l7 -5l7 5z" fill="#3a3028"/><path d="M${px - 5} ${py - 18}h10v-8h-10z" fill="#4a3e32"/><path d="M${px - 1} ${py - 25}v6M${px - 3} ${py - 23}h4" stroke="#d8c890" stroke-width=".9"/>` + msGlow(px, py - 21, 6, "#ffc860", .4));
    C.place(x - 40, y - 26, 8, (px, py) => `<path d="M${px - 8} ${py}v-22h14" stroke="#3a2a1a" stroke-width="1.8" fill="none"/><path d="M${px + 4} ${py - 22}v4" stroke="#3a2a1a" stroke-width=".7"/><path d="M${px + 1} ${py - 18}h6v8h-6z" fill="none" stroke="#2a2420" stroke-width=".9"/><path d="M${px + 3} ${py - 18}v8M${px + 5} ${py - 18}v8" stroke="#2a2420" stroke-width=".6"/>`);
    for (let i = 0; i < 6; i++) C.top += msCrow(x - 50 + r() * 70, y - 40 - r() * 20); C.scatter(4, 20, 50, 3, (px, py) => msBones(px, py)); },
  mk_field(C){ const {x, y, r} = C; C.ground += msGround(x - 10, y - 4, 70, 30, "#5a5040", .3);
    for (let row = 0; row < 6; row++) for (let col = 0; col < 11; col++){ const px = x - 74 + col * 11 + (row % 2) * 5 + (r() * 2 - 1) * 1.5, py = y - 36 + row * 10 + (r() * 2 - 1); if (C.clear(px, py, 3)) C.put(py, maCross(px, py, .75 + r() * .2, MA.pk(r, ["#4a3e30", "#5a4a38", "#3a3026"]))); }
    C.scatter(6, 10, 60, 3, (px, py) => msBones(px, py)); C.place(x - 40, y + 26, 10, (px, py) => msCart(px, py)); for (let i = 0; i < 9; i++) C.top += msCrow(x - 60 + r() * 90, y - 50 - r() * 24); },
  mk_village(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 60, 26, "#3a342c", .35);
    for (const [ox, oy, w] of [[-34, -20, 15], [-10, -32, 14], [16, -26, 13], [-50, 0, 13], [-30, 18, 14], [6, 24, 12]]) C.place(x + ox, y + oy, w * .7, (px, py) => msShell(px, py, w, 10, 9, "#8a8270"));
    C.place(x - 8, y - 10, 5, (px, py) => msWell(px, py)); C.scatter(6, 30, 70, 5, (px, py) => msDeadTree(px, py, 5 + r() * 2.5));
    C.scatter(4, 20, 60, 6, (px, py) => msFence([[px - 8, py], [px + 2, py - 2]], "#3a3026")); C.scatter(4, 20, 60, 3, (px, py) => msBones(px, py)); for (let i = 0; i < 6; i++) C.top += msCrow(x - 40 + r() * 60, y - 50 - r() * 20); },
  mk_barrow(C){ const {x, y, r} = C;
    const [bx, by] = C.main(36, [[-20, -14], [-30, 6], [10, -30]], (px, py) => msSh(px + 8, py + 3, 40, 8, .3) + `<path d="M${px - 38} ${py}Q${px - 24} ${py - 30} ${px} ${py - 32}Q${px + 26} ${py - 30} ${px + 38} ${py}z" fill="#5a5a44"/><path d="M${px} ${py - 32}Q${px + 26} ${py - 30} ${px + 38} ${py}H${px + 6}z" fill="#44442f"/><path d="M${px - 30} ${py - 10}q10 -14 26 -18" stroke="#6e6e54" stroke-width="2" fill="none"/><path d="M${px - 8} ${py}v-12h16v12z" fill="#7a766a"/><path d="M${px - 10} ${py - 12}h20v-3h-20z" fill="#9a968a"/><path d="M${px - 5} ${py}v-10h10v10z" fill="#0d0b09"/>`);
    for (let i = 0; i < 7; i++){ const a = i / 7 * 6.283 + .4, px = bx + Math.cos(a) * 52, py = by + 6 + Math.sin(a) * 20; if (C.clear(px, py, 4, {foot:1})) C.put(py, msMenhir(px, py, 11 + r() * 5, "#8a867a")); }
    C.place(bx - 34, by + 14, 4, (px, py) => msBanner(px, py, 22, "#5a4a3a", "#c8b890", {torn:1})); C.scatter(5, 20, 60, 3, (px, py) => msBones(px, py)); },
  mk_mill(C){ const {x, y, r} = C; C.ground += msGround(x - 6, y - 8, 48, 22, "#4a443a", .3);
    const [mx, my] = C.main(24, [[-8, -16], [-30, -6], [16, -30], [-20, 20]], (px, py) => msWindmill(px, py, 1.15, {wall:"#4a443a", roof:"#2a2622", sail:"#efe6cc", frame:"#d8ccb0"}));
    C.place(mx - 26, my + 4, 9, (px, py) => msShell(px, py, 14, 9, 9, "#5a544a")); C.scatter(6, 14, 44, 4, (px, py) => msBones(px, py) + msBones(px + 3, py + 2)); C.place(mx + 20, my + 10, 6, (px, py) => msSh(px + 2, py + 1, 7, 1.6, .25) + `<path d="M${px - 6} ${py}q6 -8 12 0z" fill="#e6dcc4"/><circle cx="${px - 1}" cy="${py - 3}" r="1.6" fill="#f2ead6"/><circle cx="${px + 2}" cy="${py - 2}" r="1.3" fill="#d8ccb0"/>`); },
  mk_ossuary(C){ const {x, y, r} = C; C.ground += msGround(x - 6, y - 8, 48, 22, "#5a5040", .3);
    const [ox, oy] = C.main(22, [[-14, -16], [-30, 2], [14, -30]], (px, py) => msGothic(px + 4, py, 20, 16, 18, "#cfc6ae", {roof:"#3a3430", gh:12}) + maTower(px - 12, py + 2, 4.4, 26, "#cfc6ae", "#3a3430") + [0, 1, 2, 3, 4].map(i => `<circle cx="${px - 4 + i * 4}" cy="${py - 18.4}" r="1.5" fill="#efe6cc"/><circle cx="${px - 4.6 + i * 4}" cy="${py - 18.6}" r=".45" fill="#1a1612"/><circle cx="${px - 3.4 + i * 4}" cy="${py - 18.6}" r=".45" fill="#1a1612"/>`).join(""));
    C.place(ox + 26, oy + 10, 8, (px, py) => msStair(px, py, 12, "#ff5a6a")); C.scatter(6, 20, 60, 3, (px, py) => maCross(px, py, .8, "#4a3e30")); C.scatter(4, 16, 50, 3, (px, py) => msBones(px, py)); },
  mk_bridge(C){ const {x, y, r} = C, rv = C.river(x, y, 70);
    const ends = rv ? [[rv.x - Math.sin(rv.ang) * (rv.w + 12), rv.y + Math.cos(rv.ang) * (rv.w + 12)], [rv.x + Math.sin(rv.ang) * (rv.w + 12), rv.y - Math.cos(rv.ang) * (rv.w + 12)]] : [[x - 30, y - 10], [x + 20, y - 26]];
    for (const [ex, ey] of ends) C.place(ex, ey, 8, (px, py) => msSh(px + 4, py + 1, 10, 2, .3) + `<path d="M${px - 6} ${py}v-24h16M${px + 8} ${py - 24}v4" stroke="#2a2018" stroke-width="2" fill="none"/><path d="M${px - 6} ${py - 18}l5 -6" stroke="#2a2018" stroke-width="1.2"/><path d="M${px + 5} ${py - 20}h6v9h-6z" fill="none" stroke="#1e1a16" stroke-width="1"/><path d="M${px + 7} ${py - 20}v9M${px + 9} ${py - 20}v9" stroke="#1e1a16" stroke-width=".6"/>` + msLantern(px - 9, py + 1, "#ff9a5a"));
    for (let i = 0; i < 8; i++) C.top += msCrow(x - 40 + r() * 60, y - 50 - r() * 20); C.scatter(5, 20, 60, 4, (px, py) => maCross(px, py, .8, "#4a3e30")); },
  mk_crows(C){ const {x, y, r} = C; C.ground += msGround(x - 6, y - 8, 50, 22, "#26221e", .4);
    const [tx, ty] = C.main(18, [[-30, 18], [-40, 4], [-14, 26], [16, 30]], (px, py) => maTower(px, py, 8, 44, "#3a3440", "#1a1620", {win:"#ff3a6a", rh:18}) + `<rect x="${px - 2}" y="${py - 28}" width="4" height="5" fill="#ff3a6a"/>` + msGlow(px, py - 38, 14, "#ff3a6a", .3) + `<path d="M${px - 9} ${py - 44}q4 -3 8 0" stroke="#3a2a1a" stroke-width="2" fill="none"/>`);
    for (let i = 0; i < 22; i++){ const a = r() * 6.283, d = 10 + r() * 30; C.top += msCrow(tx + Math.cos(a) * d, ty - 56 + Math.sin(a) * d * .45, .8 + r() * .5); }
    C.scatter(7, 24, 66, 5, (px, py) => msDeadTree(px, py, 5 + r() * 2.5)); C.scatter(5, 14, 50, 3, (px, py) => msBones(px, py)); },
  mk_wall(C){ const {x, y, r} = C;
    const [wx, wy] = C.spot(40, [[-20, -18], [-30, 4], [10, -34]]); C.claim(wx, wy, 40);
    C.put(wy - 2, msWallSeg(wx - 46, wy + 6, wx - 10, wy - 4, 16, "#a89e86", {bones:1}) + msWallSeg(wx + 10, wy - 8, wx + 44, wy - 18, 14, "#a89e86", {ruin:1, bones:1, seed:4}));
    C.put(wy - 3, maKeep(wx, wy - 4, 16, 30, "#a89e86") + `<path d="M${wx - 5} ${wy - 4}v-12a5 5 0 0 1 10 0v12z" fill="#120e0a"/>`);
    C.put(wy + 8, maTower(wx - 46, wy + 8, 6, 24, "#a89e86", "#3a3430", {flat:true})); C.scatter(8, 20, 66, 4, (px, py) => msRockC(px, py, 2.5 + r() * 2.5, "#a89e86")); C.scatter(5, 20, 60, 3, (px, py) => msBones(px, py)); },
  mk_throne(C){ const {x, y, r} = C, cx = x - 6, cy = y - 20, rx = 44, ry = 22; C.ground += msGround(cx, cy + 4, 64, 30, "#2a2420", .4);
    msStoneRing(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry), "#cfc6ae", 11, {bones:1});
    C.put(cy - 2, maKeep(cx - 2, cy - 2, 20, 44, "#d8ceb4", {win:"#ff3a3a"}) + msGlow(cx - 2, cy - 30, 22, "#ff3a3a", .3) + [0, 1, 2].map(i => `<path d="M${cx - 12 + i * 10} ${cy - 46}l2 -10l2 10z" fill="#efe6cc"/>`).join(""));
    for (const [ox, oy, h] of [[-rx, 0, 30], [rx, -2, 32], [-rx * .55, ry * .85, 22], [rx * .55, ry * .85, 24]]) C.put(cy + oy, maTower(cx + ox, cy + oy, 6, h, "#cfc6ae", "#2a2420", {win:"#ff3a3a", rh:16}));
    let rib = ""; for (let i = 0; i < 5; i++) rib += `<path d="M${cx - 30 + i * 3} ${cy + 26 + i * .6}q-${8 - i} -${14 - i} 0 -${22 - i * 2}" stroke="#efe6cc" stroke-width="1.6" fill="none"/>`;
    C.put(cy + 26, rib); C.scatter(6, 50, 80, 4, (px, py) => msBones(px, py)); for (let i = 0; i < 8; i++) C.top += msCrow(cx - 40 + r() * 70, cy - 80 - r() * 20); },

  /* Чорна Трясовина */
  bg_gat(C){ const {x, y, r} = C;
    for (const rd of ROADS){ if (rd.a !== C.id && rd.b !== C.id) continue; const P = C.rpts(rd, C.id);
      let d = ""; for (let i = 2; i < 34; i++){ const [px, py] = P[i], [qx, qy] = P[i + 1], a = Math.atan2(qy - py, qx - px), nx = -Math.sin(a) * 6, ny = Math.cos(a) * 6; d += `M${px - nx} ${py - ny}L${px + nx} ${py + ny}`; }
      C.ground += `<path d="${d}" stroke="#3a2a1a" stroke-width="2.6"/><path d="${d}" stroke="#7a5a3a" stroke-width="1.6"/>`;
      for (let i = 8; i < 34; i += 12){ const [px, py] = P[i], a = Math.atan2(P[i + 1][1] - py, P[i + 1][0] - px), nx = -Math.sin(a) * 9, ny = Math.cos(a) * 9; C.put(py + ny, `<path d="M${px + nx} ${py + ny}v-9" stroke="#4a3424" stroke-width="1.6"/>` + msLantern(px + nx, py + ny + .1, "#c8ff9a")); } }
    C.scatter(6, 20, 60, 9, (px, py) => maPool(px, py, 7 + r() * 8, 3 + r() * 2), {claim:1}); C.scatter(8, 12, 60, 3, (px, py) => maReeds(px, py, 5, r)); },
  bg_village(C){ const {x, y, r} = C, lx = x - 12, ly = y - 14; C.ground += maPool(lx, ly, 46, 17, "#1d2e30");
    const H = [[-30, -6], [-8, -14], [16, -8], [-22, 10], [6, 8], [30, 4], [-40, 4], [-18, -20], [24, -18], [-4, 18]]; const pts = [];
    for (const [ox, oy] of H){ if (pts.length >= 6) break; const px = lx + ox, py = ly + oy; if (!C.clear(px, py, 7, {wet:1})) continue; pts.push([px, py]); C.put(py, `<path d="M${px - 5} ${py + 4}v-6M${px + 5} ${py + 4}v-6M${px} ${py + 5}v-6" stroke="#3a2a1a" stroke-width="1.6"/><ellipse cx="${px}" cy="${py + 4}" rx="7" ry="1.4" fill="none" stroke="#8ab0c0" stroke-width=".5" opacity=".5"/>` + maHouse(px, py - 2, 12, 7, 8, "#7a6a50", "#5a4a30", {win:r() < .5 ? "#ffd27a" : null})); C.claim(px, py, 8); }
    let wk = ""; for (let i = 0; i < pts.length - 1; i++) wk += `M${pts[i][0] + 4} ${pts[i][1] + 1}L${pts[i + 1][0] - 4} ${pts[i + 1][1] + 1}`; C.ground += `<path d="${wk}" stroke="#3a2a1a" stroke-width="3.2"/><path d="${wk}" stroke="#8a6a44" stroke-width="2" stroke-dasharray="1.6 .8"/>`;
    C.scatter(3, 20, 50, 7, (px, py) => msBoat(px, py, .8, "#5a3e26", r() < .5), {wet:1}); C.scatter(2, 30, 56, 6, (px, py) => msRack(px, py)); C.scatter(6, 46, 70, 3, (px, py) => maReeds(px, py, 5, r), {wet:1}); },
  bg_camp(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 46, 20, "#4a4a32", .3);
    const [hx, hy] = C.main(14, [[-22, -14], [-34, 4], [12, -28]], (px, py) => maHouse(px, py, 14, 8, 9, "#7a6a50", "#4a3a26", {win:"#ffd27a"}) + msSmoke(px + 3, py - 20, .6));
    C.place(hx + 20, hy + 2, 6, (px, py) => msSh(px + 3, py + .5, 8, 1.4, .2) + `<path d="M${px - 7} ${py}v-10M${px + 7} ${py}v-10M${px - 8} ${py - 9}h16" stroke="#4a3424" stroke-width="1.1"/>` + [0, 1, 2, 3].map(i => `<path d="M${px - 5 + i * 3.4} ${py - 9}v4" stroke="#b8c0c0" stroke-width="1.6"/>`).join(""));
    C.place(hx - 18, hy + 10, 5, (px, py) => msFire(px, py, .8)); C.place(hx + 4, hy + 16, 8, (px, py) => msBoat(px, py, .9, "#5a3e26"), {wet:1}); C.place(hx - 28, hy - 6, 6, (px, py) => msRidgeTent(px, py, 11, 8, 8, "#8a7454"));
    C.place(hx + 26, hy + 18, 6, (px, py) => `<path d="M${px - 8} ${py}l8 -6l8 6M${px - 6} ${py - 1}l6 -4.4l6 4.4" stroke="#9a9a8a" stroke-width=".5" fill="none"/><path d="M${px - 8} ${py}h16" stroke="#4a3424" stroke-width=".8"/>`); C.scatter(3, 16, 40, 3, (px, py) => msBarrel(px, py, "#5a4028")); },
  bg_reeds(C){ const {x, y, r} = C; C.ground += msBlob(r, x - 10, y - 4, 60, "#24383a", .5, 5);
    for (let i = 0; i < 40; i++){ const a = r() * 6.283, d = 14 + r() * 60, px = x - 10 + Math.cos(a) * d, py = y + Math.sin(a) * d * .5; if (C.clear(px, py, 3, {wet:1})) C.put(py, maReeds(px, py, 6, r)); }
    C.place(x - 30, y - 18, 4, (px, py) => msHeron(px, py), {wet:1}); C.place(x - 8, y + 20, 8, (px, py) => msBoat(px, py, .8, "#5a3e26"), {wet:1}); C.place(x + 14, y - 24, 4, (px, py) => msHeron(px, py), {wet:1}); },
  bg_peat(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 54, 22, "#3a2e22", .45);
    for (const [ox, oy] of [[-40, -16], [-22, -26], [-46, 4], [10, -30]]){ const px = x + ox, py = y + oy; if (!C.clear(px, py, 9)) continue; C.ground += `<g transform="translate(${px} ${py}) skewY(-10)"><rect x="-10" y="-4" width="20" height="8" fill="#1e1610"/><rect x="-10" y="-4" width="20" height="2" fill="#4a3a28"/></g>`; C.claim(px, py, 9); }
    C.scatter(5, 14, 50, 5, (px, py) => msSh(px + 3, py + .5, 6, 1.4, .25) + [0, 1, 2].map(k => `<rect x="${px - 5 + k}" y="${py - 3 - k * 3}" width="${9 - k * 2}" height="3" fill="${shade("#4a3420", 1 + k * .1)}" stroke="#2a1d12" stroke-width=".4"/>`).join(""));
    for (let i = 0; i < 4; i++){ const px = x - 50 + r() * 70, py = y - 30 + r() * 40; if (C.clear(px, py, 3)) C.top += msSmoke(px, py, .9, "#8a8478"); }
    C.place(x - 20, y + 18, 9, (px, py) => msCart(px, py, `<path d="M${px - 7} ${py - 9}h12" stroke="#4a3420" stroke-width="3"/>`)); C.scatter(3, 20, 50, 4, (px, py) => msFolk(px, py, "#4a3e2a")); },
  bg_willows(C){ const {x, y, r} = C;
    C.scatter(5, 14, 52, 10, (px, py) => maPool(px, py, 8 + r() * 10, 3 + r() * 3), {claim:1});
    for (const [ox, oy] of [[-30, -18], [-8, -32], [16, -26], [-48, 6], [-26, 22]]) C.place(x + ox, y + oy, 9, (px, py) => msWillow(px, py, 6 + r() * 1.5, MA.pk(r, ["#4e6a3a", "#5a7444", "#46603a"])));
    let fog = ""; for (let i = 0; i < 5; i++) fog += `<ellipse cx="${x - 60 + r() * 100}" cy="${y - 20 + r() * 40}" rx="${30 + r() * 20}" ry="${4 + r() * 3}" fill="#e0e8e0" opacity=".07"/>`; C.top += fog;
    for (let i = 0; i < 10; i++) C.top += msGlow(x - 60 + r() * 100, y - 40 + r() * 50, 3, "#e8ff8a", .6); },
  bg_coven(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 46, 20, "#1e261a", .45);
    const [hx, hy] = C.main(16, [[-20, -16], [-32, 4], [12, -30]], (px, py) => `<path d="M${px - 6} ${py + 4}l1 -7M${px + 6} ${py + 4}l-1 -7M${px - 1} ${py + 5}l.6 -8" stroke="#2a1d12" stroke-width="2"/>` + `<g transform="rotate(-4 ${px} ${py})">${maHouse(px, py - 3, 15, 9, 10, "#7a6a50", "#3a3a24", {win:"#9aff6a"})}</g>` + msGlow(px - 4, py - 10, 10, "#9aff6a", .35) + msSmoke(px + 4, py - 24, .7, "#7a9a6a"));
    C.place(hx + 22, hy + 8, 6, (px, py) => msCauldron(px, py)); for (let i = 0; i < 6; i++){ const a = -.6 + i * .45, px = hx + Math.cos(a) * 30, py = hy + 10 + Math.sin(a) * 12; if (C.clear(px, py, 3)) C.put(py, msSkullPole(px, py)); }
    C.place(hx - 18, hy + 10, 4, (px, py) => msSh(px + 1, py + .4, 2.4, .6, .2) + `<path d="M${px - 2} ${py}q0 -4 2 -4q2 0 2 4z" fill="#141210"/><path d="M${px - 1.6} ${py - 4}l.4 -1.6l.8 1.2l.8 -1.2l.4 1.6" fill="#141210"/><circle cx="${px - .6}" cy="${py - 3.4}" r=".35" fill="#c8ff6a"/><circle cx="${px + .6}" cy="${py - 3.4}" r=".35" fill="#c8ff6a"/>`);
    C.scatter(5, 26, 60, 5, (px, py) => msDeadTree(px, py, 5, "#22201a")); C.top += `<ellipse cx="${hx}" cy="${hy + 6}" rx="40" ry="7" fill="#9aff6a" opacity=".06"/>`; },
  bg_sunk(C){ const {x, y, r} = C, lx = x - 10, ly = y - 10; C.ground += maPool(lx, ly, 56, 22, "#1d2e30");
    for (const [ox, oy, w] of [[-30, -6, 13], [-6, -16, 12], [18, -8, 12], [-20, 10, 11], [8, 8, 12]]){ const px = lx + ox, py = ly + oy; if (C.clear(px, py, 7, {wet:1})) C.put(py, msRoofHouse(px, py, w * 1.2, 9, MA.pk(r, ["#6a5a3e", "#7a5a3a", "#5a4e36"]))); }
    C.place(lx + 34, ly - 14, 5, (px, py) => `<path d="M${px - 4} ${py}l4 -18l4 18z" fill="#4a4a3e"/><path d="M${px} ${py - 18}l4 18h-2z" fill="#2e2e26"/><path d="M${px} ${py - 18}v-5M${px - 2} ${py - 21}h4" stroke="#8a8270" stroke-width=".9"/><ellipse cx="${px}" cy="${py}" rx="6" ry="1.4" fill="none" stroke="#8ab0c0" stroke-width=".6" opacity=".6"/>`, {wet:1});
    C.scatter(5, 50, 70, 5, (px, py) => msDeadTree(px, py, 4.5)); },
  bg_midges(C){ const {x, y, r} = C, lx = x - 14, ly = y - 14; C.ground += maPool(lx, ly, 50, 20, "#1d2e30") + `<ellipse cx="${lx - 4}" cy="${ly - 2}" rx="20" ry="8" fill="#3a4a2a"/><ellipse cx="${lx - 6}" cy="${ly - 3}" rx="16" ry="6" fill="#4a5a32"/>`;
    C.put(ly - 2, msDeadTree(lx - 6, ly - 2, 7, "#22201a") + maReeds(lx + 8, ly, 5, r) + maReeds(lx - 18, ly - 1, 4, r));
    let m = ""; for (let i = 0; i < 160; i++){ const a = r() * 6.283, d = Math.pow(r(), .6) * 26; m += `<circle cx="${lx - 4 + Math.cos(a) * d}" cy="${ly - 26 + Math.sin(a) * d * .55}" r="${.5 + r() * .4}" fill="#14140e"/>`; } C.top += `<ellipse cx="${lx - 4}" cy="${ly - 26}" rx="26" ry="14" fill="#14140e" opacity=".14"/>` + m; },
  bg_abbey(C){ const {x, y, r} = C;
    const [ax, ay] = C.spot(30, [[-14, -14], [-30, 2], [12, -30]], {wet:1}); C.ground += maPool(ax, ay + 4, 50, 18, "#1d2e30"); C.claim(ax, ay - 8, 30);
    C.put(ay, msGothic(ax, ay, 26, 22, 22, "#7a7a68", {ruin:1, gh:12}) + `<ellipse cx="${ax + 8}" cy="${ay + 1}" rx="26" ry="3" fill="#1d2e30" opacity=".85"/><path d="M${ax - 14} ${ay + 1}h46" stroke="#8ab0c0" stroke-width=".7" opacity=".6"/>`);
    C.put(ay + 2, msBrokenTower(ax - 22, ay + 2, 6, 30, "#7a7a68")); C.put(ay + 6, `<path d="M${ax + 22} ${ay + 8}v-12a6 6 0 0 1 12 0v12" stroke="#7a7a68" stroke-width="3" fill="none"/><path d="M${ax + 38} ${ay + 10}v-9" stroke="#7a7a68" stroke-width="3"/>`);
    C.scatter(6, 30, 60, 3, (px, py) => maReeds(px, py, 5, r), {wet:1}); C.top += msGlow(ax, ay - 14, 12, "#c8e8ff", .25); },
  bg_lair(C){ const {x, y, r} = C;
    const [lx, ly] = C.spot(36, [[-18, -10], [-30, 6], [10, -26]], {wet:1}); C.ground += maPool(lx, ly, 46, 18, "#121e1e") + `<ellipse cx="${lx}" cy="${ly}" rx="36" ry="13" fill="#0d1414" opacity=".6"/>`; C.claim(lx, ly - 10, 36);
    C.put(ly + 2, msHydraNeck(lx - 14, ly + 2, 1.1, -1) + msHydraNeck(lx + 2, ly + 4, 1.3, 1) + msHydraNeck(lx + 16, ly, 1, 1));
    let rt = ""; for (let i = 0; i < 7; i++){ const a = i / 7 * 6.283, px = lx + Math.cos(a) * 46, py = ly + Math.sin(a) * 18; rt += `<path d="M${px} ${py}q${-Math.cos(a) * 10} ${-8} ${-Math.cos(a) * 16} ${-Math.sin(a) * 8 + 2}" stroke="#3a2a1a" stroke-width="${3 + r() * 2}" fill="none" stroke-linecap="round"/>`; } C.put(ly - 18, rt);
    C.scatter(5, 50, 70, 3, (px, py) => msBones(px, py)); },
  bg_eye(C){ const {x, y, r} = C;
    const [lx, ly] = C.spot(30, [[-16, -16], [-30, 0], [10, -30]], {wet:1}); C.claim(lx, ly - 4, 34);
    C.ground += `<ellipse cx="${lx}" cy="${ly}" rx="34" ry="14" fill="#2a3a2a"/><ellipse cx="${lx}" cy="${ly}" rx="28" ry="11" fill="#06080a"/><ellipse cx="${lx}" cy="${ly}" rx="28" ry="11" fill="none" stroke="#a06aff" stroke-width="1.4" opacity=".7"/><ellipse cx="${lx}" cy="${ly}" rx="10" ry="4" fill="#1a0e2a"/>` + msGlow(lx, ly, 34, "#a06aff", .25);
    for (let i = 0; i < 8; i++){ const a = i / 8 * 6.283 + .2, px = lx + Math.cos(a) * 42, py = ly + Math.sin(a) * 18; if (C.clear(px, py, 3, {foot:1})) C.put(py, msMenhir(px, py, 12 + r() * 4, "#5a5a54")); }
    C.scatter(4, 50, 70, 5, (px, py) => msDeadTree(px, py, 5)); },

  /* Землі Світанку й Ночі */
  or_cross(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 54, 24, "#6a5a40", .3);
    const [mx, my] = C.main(14, [[-18, -18], [-30, 2], [12, -30]], (px, py) => msSh(px + 6, py + 2, 14, 3, .3) + `<path d="M${px - 10} ${py}l2 -6h16l2 6z" fill="#8a867a"/><path d="M${px - 8} ${py - 6}l1.4 -5h13.2l1.4 5z" fill="#a8a498"/><path d="M${px + 8} ${py - 6}l2 6h-4z" fill="#5a5650"/>` + `<path d="M${px - 8} ${py - 34}L${px + 3} ${py - 9}" stroke="#d8dce0" stroke-width="2.4"/><path d="M${px + 8} ${py - 34}L${px - 3} ${py - 9}" stroke="#b8bcc0" stroke-width="2.4"/><path d="M${px - 10} ${py - 29}l6 -3M${px + 10} ${py - 29}l-6 -3" stroke="#c9a24a" stroke-width="2"/><circle cx="${px - 9}" cy="${py - 36}" r="1.6" fill="#c9a24a"/><circle cx="${px + 9}" cy="${py - 36}" r="1.6" fill="#c9a24a"/>`);
    C.place(mx + 24, my + 8, 6, (px, py) => msSign(px, py)); C.place(mx - 26, my + 10, 5, (px, py) => msWell(px, py));
    C.place(mx - 40, my - 6, 8, (px, py) => msRidgeTent(px, py, 12, 9, 8, "#e8dcb0")); C.place(mx + 34, my - 14, 8, (px, py) => msRidgeTent(px, py, 12, 9, 8, "#4a3a5a"));
    C.place(mx - 12, my + 22, 4, (px, py) => msBanner(px, py, 24, "#e8dcb0", "#c9a24a")); C.place(mx + 12, my + 22, 4, (px, py) => msBanner(px, py, 24, "#3a2a4a", "#c0a6e0", {moon:1}));
    C.scatter(5, 14, 46, 2.5, (px, py) => msFolk(px, py, MA.pk(r, ["#e8dcb0", "#3a2a4a", "#6a5a40"]))); },
  or_dawn(C){ const {x, y, r} = C, cx = x - 4, cy = y - 10, rx = 50, ry = 28; C.ground += msGround(cx, cy, rx + 4, ry + 3, "#a8986a", .3);
    msPalisade(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry), "#8a6a3a");
    C.place(cx - 18, cy - 12, 12, (px, py) => msPavilion(px, py, 11, 20, "#f2ead6", "#c9a24a", {flag:"#c9a24a"}));
    for (const [ox, oy] of [[14, -18], [28, -6], [-38, 4], [-28, 14], [10, 14]]) C.place(cx + ox, cy + oy, 7, (px, py) => msPavilion(px, py, 6, 12, "#ece2c8", "#d9b860"));
    C.place(cx + 2, cy - 4, 6, (px, py) => msSh(px + 3, py + 1, 6, 1.4, .25) + `<path d="M${px - 3} ${py}v-8h6v8z" fill="#cfc6ae"/><circle cx="${px}" cy="${py - 13}" r="4.4" fill="#f0c040"/>` + msGlow(px, py - 13, 14, "#ffe08a", .6), {mark:1});
    C.place(cx - 4, cy - 26, 4, (px, py) => msBanner(px, py, 26, "#e8dcb0", "#c9a24a")); C.place(cx + 36, cy - 18, 4, (px, py) => msBanner(px, py, 22, "#e8dcb0", "#c9a24a"));
    C.scatter(5, 10, 40, 2.5, (px, py) => msFolk(px, py, MA.pk(r, ["#e8dcb0", "#c9a24a"]))); },
  or_night(C){ const {x, y, r} = C, cx = x - 4, cy = y - 10, rx = 50, ry = 28; C.ground += msGround(cx, cy, rx + 4, ry + 3, "#3a3040", .35);
    msPalisade(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry), "#3a3030", 11);
    C.place(cx - 18, cy - 12, 12, (px, py) => msPavilion(px, py, 11, 20, "#3a2a4a", "#6a5a8a", {flag:"#c0a6e0"}));
    for (const [ox, oy] of [[14, -18], [28, -6], [-38, 4], [-28, 14], [10, 14]]) C.place(cx + ox, cy + oy, 7, (px, py) => msRidgeTent(px, py, 12, 9, 9, "#4a3a5a"));
    for (const [ox, oy] of [[0, -2], [-12, 8]]) C.place(cx + ox, cy + oy, 4, (px, py) => `<path d="M${px - 2} ${py}l2 -6l2 6M${px} ${py - 6}v-2" stroke="#2a2420" stroke-width="1.1"/><path d="M${px - 2.6} ${py - 8}h5.2l-1 -2h-3.2z" fill="#3a3430"/>` + msGlow(px, py - 11, 10, "#b080ff", .6) + `<path d="M${px - 2} ${py - 10}q2 -5 2 -6q2 3 2 6z" fill="#c8a8ff"/>`, {mark:1});
    C.place(cx - 4, cy - 26, 4, (px, py) => msBanner(px, py, 26, "#3a2a4a", "#c0a6e0", {moon:1})); C.place(cx + 36, cy - 18, 4, (px, py) => msBanner(px, py, 22, "#3a2a4a", "#c0a6e0", {moon:1}));
    C.scatter(5, 10, 40, 2.5, (px, py) => msFolk(px, py, MA.pk(r, ["#3a2a4a", "#2a2430"]))); },
  or_field(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 6, 64, 26, "#4a3e30", .35);
    C.scatter(6, 14, 64, 7, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="7" ry="2.8" fill="#2a2018" opacity=".7"/><ellipse cx="${px - 1}" cy="${py - .6}" rx="5" ry="1.8" fill="#1a140e"/>`);
    C.main(16, [[-24, -16], [-34, 6], [14, -28]], (px, py) => msCatapult(px, py));
    C.scatter(6, 12, 60, 6, (px, py) => msSpears(px, py, 4, r)); C.scatter(8, 10, 60, 3, (px, py) => msShield(px, py, MA.pk(r, ["#e8dcb0", "#3a2a4a", "#7a6a50"])));
    C.scatter(4, 20, 60, 5, (px, py, i) => `<path d="M${px - 8} ${py}l14 -4" stroke="#2a2218" stroke-width="1.3"/><path d="M${px - 6} ${py - 1}l7 -2v5l-7 1z" fill="${i % 2 ? "#3a2a4a" : "#e8dcb0"}"/>`); C.scatter(3, 20, 50, 4, (px, py) => msBanner(px, py, 20, MA.pk(r, ["#e8dcb0", "#3a2a4a"]), "#c9a24a", {torn:1}));
    for (let i = 0; i < 8; i++) C.top += msCrow(x - 50 + r() * 70, y - 46 - r() * 20); },
  or_sun(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 4, 66, 28, "#7a8a3a", .3);
    C.ground += msBlob(r, x - 14, y - 4, 50, "#5a6a28", .14, 8); for (let i = 0; i < 160; i++){ const a = r() * 6.283, d = Math.sqrt(r()) * 58, px = x - 14 + Math.cos(a) * d, py = y - 4 + Math.sin(a) * d * .42; if (C.clear(px, py, 1.5)) C.put(py, msSunflower(px, py, .75 + r() * .3)); }
    C.place(x - 20, y - 10, 4, (px, py) => `<path d="M${px} ${py}v-16M${px - 6} ${py - 11}h12" stroke="#5a4028" stroke-width="1.2"/><path d="M${px - 3} ${py - 4}l1 -7h4l1 7z" fill="#7a3a26"/><circle cx="${px}" cy="${py - 13}" r="2.4" fill="#d8bc70"/><path d="M${px - 3.6} ${py - 14}h7.2l-3.6 -3z" fill="#4a3424"/>`, {mark:1});
    C.place(x + 10, y - 30, 4, (px, py) => msBanner(px, py, 22, "#e8dcb0", "#c9a24a")); C.place(x - 50, y - 22, 4, (px, py) => msBanner(px, py, 22, "#e8dcb0", "#c9a24a")); },
  or_banners(C){ const {x, y, r} = C;
    const [hx, hy] = C.main(36, [[-20, -14], [-30, 6], [12, -30]], (px, py) => maHill(px, py + 6, 40, 22, "#6a6a44"));
    for (let i = 0; i < 9; i++){ const a = (i / 8 - .5) * 2.4, px = hx + Math.sin(a) * 26, py = hy - 6 - Math.cos(a) * 8 + (i % 2) * 3; C.put(py, msBanner(px, py, 20 + (i % 3) * 3, i % 2 ? "#3a2a4a" : "#e8dcb0", i % 2 ? "#c0a6e0" : "#c9a24a", {moon:i % 2 === 1})); }
    C.put(hy - 12, [0, 1, 2].map(i => `<ellipse cx="${hx}" cy="${hy - 12 - i * 2.4}" rx="${4.4 - i}" ry="1.6" fill="${shade("#8a867a", 1 - i * .06)}"/>`).join("")); C.scatter(4, 30, 60, 6, (px, py) => msSpears(px, py, 3, r)); },
  or_moat(C){ const {x, y, r} = C;
    const [mx, my] = C.spot(40, [[-16, -16], [-30, 4], [10, -30], [-10, 26]]); C.claim(mx, my, 44);
    const d = `M${mx - 56} ${my + 8}Q${mx - 20} ${my - 6} ${mx} ${my - 2}T${mx + 54} ${my - 14}`;
    C.ground += `<path d="${d}" stroke="#5a4a36" stroke-width="20" fill="none" stroke-linecap="round" opacity=".7"/><path d="${d}" stroke="#2a1e16" stroke-width="13" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#3a1612" stroke-width="7" fill="none" stroke-linecap="round" transform="translate(0 1.5)"/><path d="${d}" stroke="#7a3a2e" stroke-width="1" fill="none" stroke-dasharray="5 12" transform="translate(-1 1)" opacity=".7"/>`;
    for (let i = 0; i < 16; i++){ const t = i / 15, px = mx - 52 + t * 104, py = my + 8 - t * 22 + Math.sin(t * 3.14) * -6; C.put(py - 10, msStake(px - 2, py - 9, 9, -2)); C.put(py + 10, msStake(px + 2, py + 11, 9, 2)); }
    C.put(my, `<path d="M${mx - 4} ${my + 10}l8 -20" stroke="#5a4028" stroke-width="5"/><path d="M${mx - 4} ${my + 10}l3 -7" stroke="#3a2a1a" stroke-width="5"/>`); C.scatter(5, 20, 60, 3, (px, py) => msBones(px, py)); for (let i = 0; i < 6; i++) C.top += msCrow(mx - 40 + r() * 60, my - 40 - r() * 16); },
  or_cathedral(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 8, 60, 26, "#5a5246", .35);
    const [ax, ay] = C.main(32, [[-12, -20], [-30, -4], [14, -34]], (px, py) => msGothic(px + 6, py, 30, 28, 30, "#cfc2a0", {ruin:1, gh:16, lit:"#ffe08a"}) + msBrokenTower(px - 18, py + 2, 8, 44, "#cfc2a0") + msGlow(px + 6, py - 14, 22, "#ffe08a", .35));
    C.scatter(10, 24, 60, 4, (px, py) => msRockC(px, py, 2.5 + r() * 3, "#b8ad90")); C.place(ax - 36, ay + 10, 4, (px, py) => msBanner(px, py, 22, "#e8dcb0", "#c9a24a", {torn:1})); },
  or_grave(C){ const {x, y, r} = C;
    const [gx, gy] = C.main(34, [[-16, -14], [-30, 4], [12, -28]], (px, py) => msSh(px + 6, py + 2, 36, 6, .3) + `<path d="M${px - 34} ${py}Q${px} ${py - 18} ${px + 34} ${py}z" fill="#4a3e30"/><path d="M${px} ${py - 9}Q${px + 20} ${py - 8} ${px + 34} ${py}H${px}z" fill="#3a3026"/>`);
    for (let i = 0; i < 14; i++){ const px = gx - 26 + (i % 7) * 8.6 + (r() * 2 - 1), py = gy - 3 - (Math.floor(i / 7) * 4) + Math.abs(i % 7 - 3) * -1.4; C.put(py + 1, i % 3 === 0 ? `<path d="M${px} ${py}v-12" stroke="#c8ccd0" stroke-width="1.4"/><path d="M${px - 3} ${py - 9}h6" stroke="#c9a24a" stroke-width="1.4"/>` : maCross(px, py, .75, "#5a4a38")); }
    C.place(gx + 40, gy + 8, 6, (px, py) => msSh(px + 3, py + 1, 6, 1.4, .3) + `<path d="M${px - 4} ${py}v-12l4 -3l4 3v12z" fill="#9a968a"/><path d="M${px + 4} ${py}v-12l2 1v11z" fill="#6a665a"/>`);
    for (let i = 0; i < 7; i++){ const px = gx - 30 + r() * 64, py = gy + 4 + r() * 6; C.top += `<rect x="${px - .6}" y="${py - 3}" width="1.2" height="3" fill="#efe6cc"/>` + msGlow(px, py - 3.6, 4, "#ffc860", .7); } },
  or_lists(C){ const {x, y, r} = C; C.ground += msGround(x - 10, y - 8, 70, 26, "#7a6a44", .32);
    const [lx, ly] = C.spot(40, [[-16, -14], [-30, 4], [10, -26]]); C.claim(lx, ly, 44);
    C.put(ly + 2, msSh(lx, ly + 3, 46, 2.4, .25) + `<path d="M${lx - 44} ${ly + 2}h88" stroke="#5a4028" stroke-width="1.4"/><path d="M${lx - 44} ${ly - 3}h88" stroke="#8a6a44" stroke-width="3"/>` + Array.from({length:12}, (_, i) => `<path d="M${lx - 44 + i * 8} ${ly + 2}v-6" stroke="#5a4028" stroke-width="1.2"/><path d="M${lx - 44 + i * 8} ${ly - 3}h4" stroke="${i % 2 ? "#3a2a4a" : "#e8dcb0"}" stroke-width="3"/>`).join(""));
    C.put(ly - 14, msTribune(lx - 6, ly - 14, 34, "#e8dcb0", "#3a2a4a"));
    C.place(lx - 56, ly + 4, 10, (px, py) => msPavilion(px, py, 9, 17, "#f2ead6", "#c9a24a", {flag:"#c9a24a"})); C.place(lx + 54, ly - 8, 10, (px, py) => msPavilion(px, py, 9, 17, "#3a2a4a", "#6a5a8a", {flag:"#c0a6e0"}));
    for (let i = 0; i < 6; i++) C.place(lx - 40 + i * 16, ly + 16, 3, (px, py) => msBanner(px, py, 18, i % 2 ? "#3a2a4a" : "#e8dcb0", i % 2 ? "#c0a6e0" : "#c9a24a", {moon:i % 2 === 1}), {noclaim:1});
    C.scatter(6, 20, 66, 2.5, (px, py) => msFolk(px, py, MA.pk(r, ["#e8dcb0", "#3a2a4a", "#7a3a26", "#5a6a30"]))); },
  or_keep(C){ const {x, y, r} = C; C.ground += msGround(x - 8, y - 10, 66, 30, "#1e1a24", .45);
    const [kx, ky] = C.main(40, [[-12, -20], [-30, -6], [14, -34]], (px, py) => msWallSeg(px - 46, py + 4, px - 12, py - 2, 18, "#2e2a34") + msWallSeg(px + 12, py - 4, px + 46, py - 10, 18, "#2e2a34") + maKeep(px, py - 6, 26, 62, "#2e2a34", {win:"#ff3a3a", flag:"#3a2a4a"}) + `<path d="M${px - 7} ${py - 6}v-16a7 7 0 0 1 14 0v16z" fill="#120e14"/>` + msGlow(px, py - 14, 14, "#ff3a3a", .45) + maTower(px - 46, py + 4, 7, 34, "#2e2a34", "#16121a", {win:"#ff3a3a", rh:18}) + maTower(px + 46, py - 10, 7, 38, "#2e2a34", "#16121a", {win:"#ff3a3a", rh:18}));
    for (let i = 0; i < 10; i++){ const px = kx - 40 + i * 9, py = ky + 12 + (i % 2) * 3; if (C.clear(px, py, 3, {foot:1})) C.put(py, msStake(px, py, 8, (i % 3 - 1) * 1.5, "#2a2420")); }
    C.place(kx - 56, ky + 18, 4, (px, py) => msBanner(px, py, 22, "#3a2a4a", "#c0a6e0", {moon:1})); C.scatter(4, 50, 76, 5, (px, py) => msDeadTree(px, py, 5)); for (let i = 0; i < 8; i++) C.top += msCrow(kx - 40 + r() * 70, ky - 80 - r() * 20); },
};
function maSite(id, r, water){ const f = SITES[id]; if (!f) return null; const C = siteCtx(id, r, water); f(C); return C.out(); }
