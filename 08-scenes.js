/* ============ художник пейзажів ============ */
const SCN_CACHE = {};
function sceneDefs(u, seed){
  return `<defs>
  <filter id="gr${u}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${seed}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .7 -.28"/></filter>
  <filter id="gl${u}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="${seed + 7}"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 .9  0 0 0 .5 -.22"/></filter>
  <filter id="bl${u}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="sh${u}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="gw${u}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <radialGradient id="vg${u}" cx=".5" cy=".46" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
  <linearGradient id="wt${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f4656"/><stop offset="1" stop-color="#1e3240"/></linearGradient>
  </defs>`;
}
function shade(hex, f){ return bShade(hex, f); }
// --- рослинність і каміння ---
const V = {
  pine(x, y, s, snow){
    let h = `<ellipse cx="${x + 7*s}" cy="${y + 1}" rx="${15*s}" ry="${4.5*s}" fill="#000" opacity=".28"/><rect x="${x - 2*s}" y="${y - 9*s}" width="${4*s}" height="${10*s}" fill="#3a2a1e"/>`;
    const dk = snow ? "#2a3a30" : "#22301e", lt = snow ? "#3d5244" : "#34482b";
    for (let i = 0; i < 3; i++){ const b = y - 6*s - i * 11*s, t = b - 20*s, w = (17 - i * 4) * s;
      h += `<path d="M${x} ${t}L${x - w} ${b}L${x} ${b - 2*s}z" fill="${dk}"/><path d="M${x} ${t}L${x + w} ${b}L${x} ${b - 2*s}z" fill="${lt}"/>`;
      if (snow) h += `<path d="M${x} ${t}L${x - w*.45} ${t + 9*s}L${x} ${t + 6*s}L${x + w*.45} ${t + 9*s}z" fill="#eef1f3"/>`; }
    return h;
  },
  leaf(x, y, s, pal){
    const [c0, c1, c2] = pal || ["#344d24","#4a6a30","#66873e"];
    return `<ellipse cx="${x + 8*s}" cy="${y + 1}" rx="${20*s}" ry="${5.5*s}" fill="#000" opacity=".28"/><path d="M${x - 2.5*s} ${y}L${x - 1.5*s} ${y - 22*s}L${x + 1.5*s} ${y - 22*s}L${x + 2.5*s} ${y}z" fill="#3e2c1e"/>
      <circle cx="${x - 9*s}" cy="${y - 28*s}" r="${12*s}" fill="${c0}"/><circle cx="${x + 9*s}" cy="${y - 27*s}" r="${12*s}" fill="${c0}"/><circle cx="${x}" cy="${y - 38*s}" r="${14*s}" fill="${c1}"/>
      <circle cx="${x - 6*s}" cy="${y - 32*s}" r="${10*s}" fill="${c1}"/><circle cx="${x - 5*s}" cy="${y - 42*s}" r="${7*s}" fill="${c2}"/><circle cx="${x + 6*s}" cy="${y - 33*s}" r="${5*s}" fill="${c2}" opacity=".8"/>`;
  },
  dead(x, y, s){
    return `<ellipse cx="${x + 7*s}" cy="${y + 1}" rx="${11*s}" ry="${3.5*s}" fill="#000" opacity=".25"/><path d="M${x - 2.5*s} ${y}C${x - 1*s} ${y - 12*s} ${x - 2*s} ${y - 20*s} ${x} ${y - 30*s}C${x + 1*s} ${y - 20*s} ${x + 1*s} ${y - 12*s} ${x + 2.5*s} ${y}z" fill="#2a2520"/>
      <path d="M${x} ${y - 14*s}l-${10*s}-${9*s}l-${3*s}-${5*s}M${x} ${y - 20*s}l${9*s}-${10*s}l${2*s}-${6*s}M${x} ${y - 25*s}l-${6*s}-${7*s}M${x - 6*s} ${y - 20*s}l-${4*s}${1*s}" stroke="#2a2520" stroke-width="${Math.max(1.5, 2.4*s)}" stroke-linecap="round" fill="none"/>`;
  },
  bush(x, y, s, pal){
    const [c0, c1, c2] = pal || ["#2f4420","#40592a","#58743a"];
    return `<ellipse cx="${x + 4*s}" cy="${y + 1}" rx="${12*s}" ry="${3*s}" fill="#000" opacity=".22"/><circle cx="${x - 6*s}" cy="${y - 5*s}" r="${7*s}" fill="${c0}"/><circle cx="${x + 6*s}" cy="${y - 5*s}" r="${7*s}" fill="${c0}"/><circle cx="${x}" cy="${y - 9*s}" r="${8*s}" fill="${c1}"/><circle cx="${x - 3*s}" cy="${y - 12*s}" r="${4*s}" fill="${c2}"/>`;
  },
  rock(x, y, s, r, col){
    const c = col || "#6b665d", n = 7, pts = [];
    for (let i = 0; i < n; i++){ const a = Math.PI + i / (n - 1) * Math.PI, rr = (10 + r() * 8) * s; pts.push([x + Math.cos(a) * rr * 1.3, y + Math.sin(a) * rr * .9]); }
    const d = "M" + pts.map(p => p.map(v => v.toFixed(1)).join(" ")).join("L") + "z";
    return `<ellipse cx="${x + 5*s}" cy="${y + 1}" rx="${17*s}" ry="${4*s}" fill="#000" opacity=".25"/><path d="${d}" fill="${c}"/><path d="M${pts[1][0]} ${pts[1][1]}L${pts[3][0]} ${pts[3][1]}L${x} ${y - 2*s}z" fill="${shade(c, 1.25)}"/><path d="M${pts[4][0]} ${pts[4][1]}L${pts[6][0]} ${pts[6][1]}L${x + 3*s} ${y}z" fill="${shade(c, .75)}"/>`;
  },
  grass(x, y, s, c){ let h = ""; for (const a of [-.5, -.15, .2, .55]) h += `<path d="M${x} ${y}q${a * 5*s} -${4*s} ${a * 10*s} -${(7 + Math.abs(a) * 4) * s}" stroke="${c}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`; return h; },
  flower(x, y, c){ return `<circle cx="${x}" cy="${y}" r="1.8" fill="${c}"/><circle cx="${x + 3}" cy="${y + 2}" r="1.4" fill="${c}"/>`; },
  reed(x, y, s){ return `<path d="M${x} ${y}v-${20*s}M${x + 3} ${y}v-${15*s}M${x - 3} ${y}v-${12*s}" stroke="#5a6a3a" stroke-width="1.4"/><ellipse cx="${x}" cy="${y - 20*s}" rx="1.8" ry="4" fill="#5a3a20"/>`; },
};
// --- будівлі ---
function house(x, y, w, h, o = {}){
  const wall = o.wall || "#5a4a38", roof = o.roof || "#3a2c24", side = w * .38, lit = o.lit !== false;
  const apex = y - h - h * .7;
  let s = `<path d="M${x + w} ${y}l${side} -10l${8} 0l-${side} 14z" fill="#000" opacity=".2" filter="url(#sh_U)"/>`;
  s += `<path d="M${x} ${y - h}h${w}v${h}h-${w}z" fill="${wall}"/><path d="M${x + w} ${y - h}l${side} -${h * .3}v${h}l-${side} ${h * .3}z" fill="${shade(wall, .72)}"/>`;
  s += `<path d="M${x - 6} ${y - h + 2}L${x + w / 2} ${apex}L${x + w + 6} ${y - h + 2}z" fill="${roof}"/><path d="M${x + w / 2} ${apex}L${x + w + 6} ${y - h + 2}L${x + w + side + 6} ${y - h - h * .3 + 2}L${x + w / 2 + side} ${apex - h * .3}z" fill="${shade(roof, .8)}"/>`;
  s += `<path d="M${x + w / 2 - 6} ${y - 18}h12v18h-12z" fill="#2a2018"/>`;
  const wc = lit ? "#e8c46a" : "#2a2018";
  s += `<rect x="${x + 6}" y="${y - h + 8}" width="9" height="9" fill="${wc}"/><rect x="${x + w - 15}" y="${y - h + 8}" width="9" height="9" fill="${wc}"/>`;
  if (o.chimney) s += `<path d="M${x + w * .8} ${apex + 6}h8v${h * .35}h-8z" fill="${shade(wall, .6)}"/><circle cx="${x + w * .8 + 6}" cy="${apex - 4}" r="6" fill="#9a958c" opacity=".35"/><circle cx="${x + w * .8 + 12}" cy="${apex - 16}" r="8" fill="#9a958c" opacity=".25"/>`;
  return s;
}
function tower(x, y, w, h, wall, roof){
  return `<ellipse cx="${x + w / 2 + 14}" cy="${y}" rx="${w}" ry="7" fill="#000" opacity=".25"/><path d="M${x} ${y - h}h${w}v${h}h-${w}z" fill="${wall}"/><path d="M${x + w * .6} ${y - h}h${w * .4}v${h}h-${w * .4}z" fill="${shade(wall, .78)}"/>
    <path d="M${x - 5} ${y - h}L${x + w / 2} ${y - h - w * 1.4}L${x + w + 5} ${y - h}z" fill="${roof}"/><path d="M${x + w / 2} ${y - h - w * 1.4}L${x + w + 5} ${y - h}h-${w * .45}z" fill="${shade(roof, .75)}"/>
    <rect x="${x + w / 2 - 4}" y="${y - h * .7}" width="8" height="12" fill="#e8c46a" opacity=".8"/><rect x="${x + w / 2 - 4}" y="${y - h * .4}" width="8" height="12" fill="#2a2018"/>`;
}
function tent(x, y, c){ return `<ellipse cx="${x + 10}" cy="${y}" rx="40" ry="6" fill="#000" opacity=".25"/><path d="M${x} ${y - 52}L${x - 38} ${y}h38z" fill="${c}"/><path d="M${x} ${y - 52}L${x + 34} ${y}h-34z" fill="${shade(c, .7)}"/><path d="M${x} ${y - 30}l-9 30h18z" fill="#1a1410"/><path d="M${x} ${y - 52}v-12" stroke="#2a2018" stroke-width="2"/><path d="M${x} ${y - 64}l12 4-12 4z" fill="${shade(c, 1.3)}"/>`; }
function wallSeg(x, y, w, h, c){ let s = `<path d="M${x} ${y - h}h${w}v${h}h-${w}z" fill="${c}"/><path d="M${x} ${y - h}h${w}v5h-${w}z" fill="${shade(c, 1.2)}"/>`; for (let i = 0; i < w; i += 16) s += `<path d="M${x + i} ${y - h - 9}h9v9h-9z" fill="${c}"/>`; return s; }
const STRUCT = {
  spire:(r) => [{y:240, s:tower(420, 240, 54, 190, "#6a655c", "#3a3530")}],
  tower:(r) => [{y:230, s:tower(440, 230, 50, 170, "#d8d4ca", "#4a5a8a")}],
  village:(r) => [{y:200, s:house(140, 200, 80, 50, {chimney:true})}, {y:210, s:house(640, 210, 90, 54, {wall:"#665440"})}, {y:470, s:house(700, 470, 76, 46, {roof:"#4a3428"})}, {y:460, s:house(130, 460, 70, 44)}],
  city:(r) => { const a = [{y:120, s:wallSeg(0, 120, 900, 46, "#6e6a62")}]; for (const [x, y, w] of [[150,230,90],[300,190,110],[560,200,100],[700,250,84],[120,470,80],[760,480,90]]) a.push({y, s:house(x, y, w, w * .6, {chimney:r() < .5, wall:pick(["#5a4a38","#6a5a44","#5e5242"]), roof:pick(["#3a2c24","#5a3024","#2e3a4a"])})}); a.push({y:150, s:tower(60, 150, 40, 130, "#6e6a62", "#3a3530")}, {y:150, s:tower(810, 150, 40, 130, "#6e6a62", "#3a3530")}); return a; },
  tavern:(r) => [{y:240, s:house(340, 240, 200, 90, {wall:"#6a5236", roof:"#3d3026", chimney:true})}, {y:236, s:`<path d="M560 170h4v50h-4zM548 214h28v22h-28z" fill="#2a2018"/>`}],
  forge:(r) => [{y:240, s:house(360, 240, 170, 80, {wall:"#4e463c", roof:"#2f2a25", chimney:true, lit:false})}, {y:420, s:`<path d="M420 400h60l-8 12h-44z" fill="#3b3631"/><path d="M438 412h24v22h-24z" fill="#33302b"/>`}],
  hut:(r) => [{y:210, s:house(210, 210, 90, 60, {chimney:true})}, {y:400, s:`<path d="M540 382h52v9h-52z" fill="#6b5a45"/><path d="M548 391v20M584 391v20" stroke="#3b3128" stroke-width="4"/>`}],
  ruins:(r) => [{y:150, s:`<path d="M110 150h70v-60l-10-12-8 9-12-14-10 9-30-4z" fill="#6a655c"/><path d="M110 150h70v-8h-70z" fill="#57534b"/>`}, {y:130, s:`<path d="M300 130h130v-46h-22v-20h-34v34h-74z" fill="#6a655c"/>`}, {y:220, s:`<path d="M610 220h44v-100l-14-16-12 12-18-10z" fill="#625d55"/>`}, {y:400, s:`<path d="M380 400h170v-28h-56v-14h-44v20h-70z" fill="#5e5952"/>`}],
  ruins_big:(r) => { const a = STRUCT.ruins(r); a.push({y:250, s:`<path d="M720 250h20v-120h-20zM780 250h20v-90h-20z" fill="#7a756c"/><path d="M714 130h92v12h-92z" fill="#7a756c"/>`}); return a; },
  tents:(r) => [[300,200,"#6a3b55"],[400,215,"#6a3b55"],[640,190,"#3b4a6a"],[730,260,"#6a3b55"],[200,420,"#4f6a3b"]].map(([x, y, c]) => ({y, s:tent(x, y, c)})),
  palisade:(r) => { let s = ""; for (let x = 20; x < 880; x += 13) s += `<path d="M${x} 108v-46l6-8 6 8v46z" fill="${x % 26 ? "#5a4632" : "#4e3c2a"}"/>`; return [{y:108, s}]; },
  chapel:(r) => [{y:250, s:`<ellipse cx="470" cy="252" rx="110" ry="10" fill="#000" opacity=".3"/><path d="M380 250h150v-130h-150z" fill="#2c2a28"/><path d="M530 250l40-14v-120l-40 4z" fill="#211f1d"/><path d="M370 124L455 30L540 124z" fill="#1c1a18"/><path d="M440 190h28v60h-28z" fill="#0b0a09"/><path d="M448 60h12v40h-12z" fill="#5a1d14"/><rect x="400" y="150" width="14" height="22" fill="#6a2a1a" opacity=".8"/><rect x="496" y="150" width="14" height="22" fill="#6a2a1a" opacity=".8"/>`}],
  graves:(r) => { const a = []; for (let i = 0; i < 9; i++){ const x = 120 + r() * 660, y = 320 + r() * 170; a.push({y, s:`<ellipse cx="${x + 10}" cy="${y}" rx="12" ry="3" fill="#000" opacity=".3"/><path d="M${x} ${y}v-20q9-10 18 0v20z" fill="#56524c"/><path d="M${x + 9} ${y}v-25q4 0 9 5v20z" fill="#46433e"/>`}); } return a; },
  peaks:(r) => [{y:0, s:`<path d="M0 0h900v150l-70-80-60 55-80-100-90 90-70-60-100 110-80-70-90 80-100-100-80 80-80-50-100 105z" fill="#7d8287"/><path d="M0 0h900v80l-70-40-60 30-80-60-90 50-70-30-100 60-80-40-90 40-100-60-80 40-80-30-100 60z" fill="#a3a8ad"/><path d="M190 0l-40 50 34-10 26 18zM520 0l-40 55 34-14 22 16zM760 0l-30 44 26-8z" fill="#f2f3f4"/>`}],
  cliffs:(r) => [{y:0, s:`<path d="M0 0h900v90q-120 34-230 4t-240 22q-200-14-430-30z" fill="#3a362e"/><path d="M0 0h900v50q-150 24-300 0t-300 16q-150-10-300 0z" fill="#2c2924"/>`}],
  castle:(r) => [{y:200, s:`<ellipse cx="660" cy="204" rx="170" ry="12" fill="#000" opacity=".3"/>${wallSeg(540, 200, 240, 110, "#6a6860")}${tower(520, 205, 46, 160, "#706e66", "#3a3a33")}${tower(760, 205, 46, 160, "#706e66", "#3a3a33")}<path d="M640 200v-50a20 20 0 0 1 40 0v50z" fill="#211f1c"/>`}],
  castle_ruin:(r) => [{y:180, s:`<path d="M600 180h60v-90l10-10 10 12 10-8v96h50v-60l12-10 8 14v56z" fill="#5f5d55"/><path d="M600 180h140v-10h-140z" fill="#4e4c45"/>`}],
  citadel:(r) => [{y:200, s:`<ellipse cx="450" cy="206" rx="320" ry="14" fill="#000" opacity=".35"/>${wallSeg(160, 200, 580, 120, "#2e2c30")}${tower(130, 205, 60, 190, "#34323a", "#16151a")}${tower(710, 205, 60, 190, "#34323a", "#16151a")}${tower(420, 160, 60, 150, "#34323a", "#16151a")}<path d="M420 200v-60a30 30 0 0 1 60 0v60z" fill="#0c0b0e"/><rect x="438" y="150" width="24" height="10" fill="#bf3a2a" opacity=".7"/>`}],
  mill:(r) => [{y:230, s:house(420, 230, 120, 80, {wall:"#6a5640", chimney:false})}, {y:232, s:`<circle cx="568" cy="200" r="34" fill="none" stroke="#4a3626" stroke-width="7"/>${[0,1,2,3,4,5].map(i => `<path d="M568 200l${Math.cos(i) * 34} ${Math.sin(i) * 34}" stroke="#4a3626" stroke-width="5"/>`).join("")}`}],
  bridge:(r) => [{y:315, s:`<path d="M560 286h170v26h-170z" fill="#6b5a45"/>${[0,1,2,3,4,5,6,7,8,9].map(i => `<path d="M${566 + i * 17} 286v26" stroke="#4a3a2a" stroke-width="2"/>`).join("")}<path d="M560 282h170" stroke="#3b2e22" stroke-width="4"/>`}],
  fair:(r) => { const cols = [["#c0503a","#e8d6b0"],["#3a6ab0","#e8d6b0"],["#5a9a4a","#f0e0b0"],["#b08a3a","#5a2a2a"],["#8a3ab0","#f0e0b0"]]; const a = []; [[220,210],[380,180],[560,200],[700,250],[300,450],[640,460]].forEach(([x, y], i) => { const [c1, c2] = cols[i % cols.length]; a.push({y, s:`<ellipse cx="${x + 12}" cy="${y}" rx="46" ry="7" fill="#000" opacity=".22"/><path d="M${x} ${y - 70}L${x - 42} ${y}h84z" fill="${c1}"/><path d="M${x} ${y - 70}L${x - 14} ${y}h14zM${x} ${y - 70}L${x + 28} ${y}h-14z" fill="${c2}"/><path d="M${x} ${y - 70}v-14l14 5-14 5" fill="${c1}" stroke="#2a2018" stroke-width="1.5"/>`}); }); a.push({y:110, s:`<path d="M60 90q200 40 400 0t400 0" stroke="#6a4a2a" stroke-width="2" fill="none"/>${[...Array(18)].map((_, i) => `<path d="M${70 + i * 45} ${96 + Math.sin(i) * 6}l7 14 7-14z" fill="${pick(["#c0503a","#3a6ab0","#e0c04a","#5a9a4a"])}"/>`).join("")}`}); return a; },
  sparks:(r) => { let s = ""; for (let i = 0; i < 26; i++){ const x = 500 + r() * 300, y = 120 + r() * 380; s += `<circle cx="${x}" cy="${y}" r="${1.5 + r() * 2}" fill="#ffe08a" opacity=".85" filter="url(#gw_U)"/><circle cx="${x}" cy="${y}" r="1.2" fill="#fff6c8"/>`; } return [{y:600, s}]; },
  nests:(r) => { const a = []; for (let i = 0; i < 6; i++){ const x = 120 + r() * 600, y = 180 + r() * 300; a.push({y, s:`<ellipse cx="${x}" cy="${y}" rx="30" ry="12" fill="#9a875a"/><ellipse cx="${x - 4}" cy="${y - 3}" rx="22" ry="8" fill="#b4a272"/><ellipse cx="${x}" cy="${y - 1}" rx="8" ry="4" fill="#3a2e1e"/>`}); } return a; },
  wreck:(r) => [{y:380, s:`<path d="M540 380q60 20 150-10l-20-40q-60 18-120 6z" fill="#4a3626"/><path d="M590 340v-80M600 270l60 30" stroke="#3a2a1e" stroke-width="5"/><path d="M600 270l58 28-56 10z" fill="#bfb7a2" opacity=".75"/>`}],
  webs:(r) => { let s = ""; for (let i = 0; i < 6; i++){ const x = 120 + r() * 660, y = 100 + r() * 200; s += `<path d="M${x} ${y}l40 30M${x} ${y}l-30 40M${x} ${y}l10 50M${x - 20} ${y + 25}q20 -10 40 5" stroke="#e8e8e8" stroke-width=".8" opacity=".55" fill="none"/>`; } return [{y:560, s}]; },
  camp_small:(r) => [{y:330, s:`<ellipse cx="450" cy="332" rx="30" ry="8" fill="#000" opacity=".3"/><path d="M430 330l40-10M432 320l38 12" stroke="#4a3222" stroke-width="6" stroke-linecap="round"/><circle cx="450" cy="318" r="14" fill="#ff9a3a" opacity=".5" filter="url(#gw_U)"/><path d="M444 326q6-20 12 0z" fill="#ffb24a"/>`}],
  mine:(r) => [{y:240, s:`<path d="M520 240q80-130 200-20z" fill="#4a4540"/><path d="M590 240v-50a25 25 0 0 1 50 0v50z" fill="#0d0c0b"/><path d="M584 190h62" stroke="#6b5a45" stroke-width="7"/><path d="M584 190v50M646 190v50" stroke="#6b5a45" stroke-width="6"/><path d="M600 300l-20 120M630 300l20 120" stroke="#5a5048" stroke-width="3"/>`}],
  salt:(r) => { let s = ""; for (let i = 0; i < 12; i++){ const x = 60 + r() * 780, y = 140 + r() * 360; s += `<path d="M${x} ${y}l6-14 5 10 6-16 7 20z" fill="#e8e4dc" opacity=".85"/>`; } return [{y:100, s}]; },
  koliba:(r) => [{y:230, s:house(200, 230, 90, 56, {wall:"#6a5236", roof:"#4a4540", chimney:true})}],
  cave:(r) => [{y:220, s:`<path d="M560 220q60-150 200-10z" fill="#5d6063"/><path d="M620 220v-40a30 30 0 0 1 60 0v40z" fill="#0d0c0b"/>`}],
  spring:(r) => [{y:210, s:`<ellipse cx="560" cy="200" rx="64" ry="24" fill="#3a5a64"/><ellipse cx="560" cy="198" rx="44" ry="15" fill="#6fa8b8"/><ellipse cx="548" cy="194" rx="16" ry="4" fill="#bfe8f0" opacity=".7"/>${[0,1,2,3,4,5,6,7].map(i => `<ellipse cx="${560 + Math.cos(i * .8) * 66}" cy="${202 + Math.sin(i * .8) * 24}" rx="7" ry="5" fill="#8a847a"/>`).join("")}`}],
  vines:(r) => { let s = ""; for (let i = 0; i < 9; i++) s += `<path d="M${40 + i * 34} 400 L${380 + i * 34} 120" stroke="#3a4a24" stroke-width="8" stroke-dasharray="4 8" stroke-linecap="round"/><path d="M${40 + i * 34} 400 L${380 + i * 34} 120" stroke="#5a2a4a" stroke-width="3" stroke-dasharray="1 14" stroke-linecap="round"/>`; return [{y:90, s}]; },
  crypt:(r) => [{y:300, s:`<ellipse cx="710" cy="302" rx="70" ry="8" fill="#000" opacity=".3"/><path d="M650 300h120v-70h-120z" fill="#4a4540"/><path d="M640 232L710 186L780 232z" fill="#2e2a27"/><path d="M698 300v-40h24v40z" fill="#0d0c0b"/>`}],
  old_oaks:(r) => [[180,220],[700,200],[420,470]].map(([x, y]) => ({y, s:V.leaf(x, y, 2.2, ["#2c3e1e","#3a5226","#4e6a32"])})),
  fence:(r) => [{y:380, s:[...Array(14)].map((_, i) => `<path d="M${560 + i * 22} 380v-24" stroke="#5a4632" stroke-width="4"/>`).join("") + `<path d="M556 362h300M556 372h300" stroke="#6b5440" stroke-width="3"/>`}],
  river_small:(r) => [],
};
// --- шари води/доріг ---
function sceneWater(c){
  let s = "";
  if (c.river) s += `<path d="M650 -10 C610 120 660 220 630 300 C600 380 650 450 610 540" fill="none" stroke="#1e2e38" stroke-width="112"/><path d="M650 -10 C610 120 660 220 630 300 C600 380 650 450 610 540" fill="none" stroke="url(#wt_U)" stroke-width="92"/>
    <path d="M650 -10 C610 120 660 220 630 300 C600 380 650 450 610 540" fill="none" stroke="#4d6d80" stroke-width="2" stroke-dasharray="14 22" opacity=".7"/><path d="M684 -10 C644 120 694 220 664 300 C634 380 684 450 644 540" fill="none" stroke="#c9c2a8" stroke-width="3" opacity=".35"/>`;
  if (c.lake) s += `<ellipse cx="540" cy="250" rx="310" ry="128" fill="#1a2a30"/><ellipse cx="540" cy="250" rx="296" ry="116" fill="url(#wt_U)"/><path d="M330 220q60-12 120 0M560 290q80-14 160 0M420 320q40-8 80 0" stroke="#4d6d80" stroke-width="2" fill="none" opacity=".7"/><ellipse cx="540" cy="250" rx="300" ry="122" fill="none" stroke="#c9c2a8" stroke-width="2" opacity=".3"/>`;
  if (c.sea) s += `<path d="M900 230 C760 300 700 420 560 540 L900 540z" fill="url(#wt_U)"/><path d="M900 230 C760 300 700 420 560 540" fill="none" stroke="#e8e2cc" stroke-width="4" opacity=".55"/><path d="M880 270 C760 330 720 430 620 520" fill="none" stroke="#4d6d80" stroke-width="2" stroke-dasharray="20 18" opacity=".6"/>`;
  return s;
}
function sceneRoad(c){
  if (!c.road) return "";
  const col = c.b === "snow" ? "#d9dcdf" : c.b === "sand" ? "#c9b88a" : "#7d7461";
  return `<path d="M-10 312 Q220 290 450 304 T910 292" fill="none" stroke="${shade(col, .7)}" stroke-width="34" stroke-linecap="round" opacity=".55"/><path d="M-10 312 Q220 290 450 304 T910 292" fill="none" stroke="${col}" stroke-width="26" stroke-linecap="round"/><path d="M-10 312 Q220 290 450 304 T910 292" fill="none" stroke="${shade(col, 1.15)}" stroke-width="2" stroke-dasharray="3 26" stroke-linecap="round"/>`;
}
const BIG_STRUCT = ["spire","tower","chapel","tavern","forge","mill","citadel"];
function sceneSVGOld(id){
  if (SCN_CACHE[id]) return SCN_CACHE[id];
  const c = SCENE[id] || {b:"ash"}, Bm = BIOME[c.b], r = rng("scene-" + id), u = id.replace(/[^a-z0-9]/gi, "");
  const g = Bm.ground;
  let s = sceneDefs(u, Math.floor(r() * 90) + 1).replace(/_U/g, u);
  s += `<rect width="900" height="528" fill="${g[0]}"/>`;
  for (let i = 0; i < 8; i++) s += `<ellipse cx="${r() * 900}" cy="${r() * 528}" rx="${90 + r() * 160}" ry="${50 + r() * 70}" fill="${g[1 + (i % 2)]}" filter="url(#bl${u})" opacity=".85"/>`;
  s += `<rect width="900" height="528" filter="url(#gl${u})" opacity=".35"/>`;
  if (Bm.pools) for (let i = 0; i < Bm.pools; i++){ const x = 80 + r() * 740, y = 120 + r() * 360, rx = 30 + r() * 50; s += `<ellipse cx="${x}" cy="${y}" rx="${rx + 6}" ry="${rx * .32 + 4}" fill="#2a3428"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .32}" fill="url(#wt${u})"/><ellipse cx="${x - rx * .3}" cy="${y - 2}" rx="${rx * .3}" ry="2" fill="#6f8f9f" opacity=".5"/>`; }
  s += sceneWater(c).replace(/_U/g, u) + sceneRoad(c);
  // об'єкти, відсортовані за глибиною
  const items = [];
  for (const x of c.x || []) if (STRUCT[x]) for (const it of STRUCT[x](r)) items.push({y:it.y, s:it.s.replace(/_U/g, u)});
  const blocked = (x, y) => (c.road && y > 280 && y < 330) || (c.river && x > 545 && x < 735) || (c.lake && Math.hypot((x - 540) / 320, (y - 250) / 135) < 1) || (c.sea && x + (y - 230) * 1.0 > 820) ||
    (c.x || []).some(k => ["city","palisade"].includes(k) ? y < 140 : ["peaks","cliffs"].includes(k) ? y < 130 : false) || (y < 260 && x > 380 && x < 560 && (c.x || []).some(k => BIG_STRUCT.includes(k)));
  const place = (n, fn, ymin = 70) => { for (let i = 0, tries = 0; i < n && tries < n * 6; tries++){ const x = 20 + r() * 860, y = ymin + r() * (520 - ymin); if (blocked(x, y)) continue; items.push({y, s:fn(x, y)}); i++; } };
  const v = Bm.veg, snow = !!Bm.snow, pal = c.b === "vineyard" ? ["#5a4a22","#7a6328","#9a7e34"] : null;
  if (v.pine) place(v.pine, (x, y) => V.pine(x, y, .8 + r() * .55, snow), 90);
  if (v.leaf) place(v.leaf, (x, y) => V.leaf(x, y, .8 + r() * .5, pal), 90);
  if (v.dead) place(v.dead, (x, y) => V.dead(x, y, .8 + r() * .6), 90);
  if (v.bush) place(v.bush, (x, y) => V.bush(x, y, .8 + r() * .6, pal));
  if (v.rocks) place(v.rocks, (x, y) => V.rock(x, y, .6 + r() * .7, r, snow ? "#8a8e93" : c.b === "sand" ? "#9a8e72" : null));
  if (v.reeds) place(v.reeds, (x, y) => V.reed(x, y, .8 + r() * .5));
  let fine = "";
  for (let i = 0; i < (v.grass || 0); i++){ const x = r() * 900, y = 80 + r() * 448; if (!blocked(x, y)) fine += V.grass(x, y, .8 + r() * .5, i % 3 ? Bm.grass : shade(Bm.grass, 1.25)); }
  for (let i = 0; i < (v.flowers || 0); i++){ const x = r() * 900, y = 90 + r() * 430; if (!blocked(x, y)) fine += V.flower(x, y, pick(["#e8d070","#d87a6a","#a8b8e8","#f2efe6"])); }
  s += fine;
  items.sort((a, b) => a.y - b.y);
  s += items.map(i => i.s).join("");
  if (Bm.fog) for (let i = 0; i < 6; i++) s += `<ellipse cx="${r() * 900}" cy="${150 + r() * 380}" rx="${120 + r() * 120}" ry="${20 + r() * 20}" fill="#dfe8e0" opacity=".12" filter="url(#bl${u})"/>`;
  const mood = c.mood || Bm.mood;
  if (mood === "dusk") s += `<rect width="900" height="528" fill="#ff8a3a" opacity=".07"/><rect width="900" height="528" fill="#2a1a40" opacity=".14"/>`;
  if (mood === "dark") s += `<rect width="900" height="528" fill="#0a0a1a" opacity=".28"/>`;
  if (snow) s += `<rect width="900" height="528" fill="#fff" opacity=".04"/>`;
  s += `<rect width="900" height="528" filter="url(#gr${u})" opacity=".55"/><rect width="900" height="528" fill="url(#vg${u})"/>`;
  SCN_CACHE[id] = s; return s;
}
// підземелля
const DG_COL = {crypt:["#3a3632","#2a2724"], citadel_d:["#2a2830","#1c1a22"], abyss:["#2a2226","#1a1416"]}, DG_DECOR = {};
function dungeonSVG(kind){
  const key = "dg-" + kind; if (SCN_CACHE[key]) return SCN_CACHE[key];
  const col = DG_COL[kind] || ["#3a3632","#2a2724"];
  const u = "dg" + kind.replace(/[^a-z]/g, ""), r = rng(key);
  let s = sceneDefs(u, 33).replace(/_U/g, u) + `<rect width="900" height="528" fill="${col[1]}"/>`;
  s += `<path d="M0 0h900v220H0z" fill="${col[0]}"/>`;
  for (let y = 0; y < 220; y += 28) for (let x = (y / 28) % 2 ? -30 : 0; x < 900; x += 60) s += `<rect x="${x + 2}" y="${y + 2}" width="56" height="24" fill="${shade(col[0], .9 + r() * .25)}"/>`;
  s += `<path d="M0 220h900v10H0z" fill="#000" opacity=".4"/>`;
  for (let y = 240; y < 528; y += 36) for (let x = (y / 36) % 2 ? -40 : 0; x < 900; x += 80) s += `<path d="M${x} ${y}h78l-4 34h-70z" fill="${shade(col[1], 1 + r() * .3)}"/>`;
  for (const x of [160, 740]) s += `<path d="M${x - 4} 90h8v30h-8z" fill="#3a2a1e"/><circle cx="${x}" cy="84" r="22" fill="#ff9a3a" opacity=".35" filter="url(#gw${u})"/><path d="M${x - 5} 90q5-20 10 0z" fill="#ffc24a"/>`;
  if (DG_DECOR[kind]) s += DG_DECOR[kind](r);
  if (kind === "abyss") s += `<path d="M0 0h900v60q-200 40-450 0T0 60z" fill="#120c0e"/>${[...Array(14)].map((_, i) => `<path d="M${30 + i * 64} 0l10 ${30 + r() * 50}l10-${30 + r() * 50}z" fill="#1a1416"/>`).join("")}`;
  s += `<rect width="900" height="528" fill="#0a0810" opacity=".25"/><rect width="900" height="528" filter="url(#gr${u})" opacity=".6"/><rect width="900" height="528" fill="url(#vg${u})"/>`;
  SCN_CACHE[key] = s; return s;
}

/* ============ карта світу ============ */
let MAP_SVG = null;
