/* ============ мальовані речі й герой: об'ємні іконки, герб, фігура героя (усе пектиметься в картинки один раз) ============ */
const ART = (() => {
const CUST = {wolf:"M14 70L22 40L18 10L36 28L50 24L56 6L64 30Q80 38 94 52L88 62L70 60Q64 72 50 78L40 96L26 80Z"};
let IG2 = 0;
const T = (c) => { const n = parseInt(c.slice(1), 16), f = (k) => { const m = (v) => Math.max(0, Math.min(255, Math.round(k > 1 ? v + (255 - v) * (k - 1) : v * k))); return "#" + ((1 << 24) + (m((n >> 16) & 255) << 16) + (m((n >> 8) & 255) << 8) + m(n & 255)).toString(16).slice(1); }; return {hi:f(1.75), lt:f(1.35), b:c, dk:f(.62), dd:f(.32)}; };
const st = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ""}/>`).join("");
const LG = (id, a, x1 = 0, y1 = 0, x2 = 1, y2 = 1) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st(a)}</linearGradient>`;
const RG = (id, a, cx = .35, cy = .3, r = .8) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${st(a)}</radialGradient>`;
// полірований метал: смуги відблисків
const STEEL = [[0, "#ffffff"], [.18, "#dfe5ea"], [.32, "#8e99a3"], [.46, "#c7cfd6"], [.62, "#5d6872"], [.8, "#9aa5ae"], [1, "#39424a"]];
const GOLD = [[0, "#fff6cf"], [.16, "#f6d77c"], [.34, "#b7832a"], [.5, "#f0c75e"], [.68, "#8a5a16"], [.85, "#d9a442"], [1, "#4d3008"]];
const DARKSTEEL = [[0, "#c8ccd4"], [.2, "#6a7280"], [.4, "#3a404a"], [.55, "#7a8290"], [.75, "#2a2e36"], [1, "#14161a"]];
function base(id){ // спільні фільтри для однієї іконки
  return `<filter id="${id}gr" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="${IG2 % 9}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="${id}bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="${id}b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="${id}ds" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
<linearGradient id="${id}rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
}
// форма з обвідкою, фактурою, AO й рефлексом
function F(id, d, fill, o = {}){ const k = ++IG2, c = `${id}c${k}`;
  return `<clipPath id="${c}"><path d="${d}"/></clipPath>
<path d="${d}" fill="none" stroke="${o.ol || "#120c08"}" stroke-width="${o.olw || 4.5}" stroke-linejoin="round"/>
<path d="${d}" fill="${fill}"/>
<g clip-path="url(#${c})">${o.grain === false ? "" : `<rect width="128" height="128" fill="#000" filter="url(#${id}gr)" opacity="${o.grain || .22}"/>`}<path d="${d}" fill="none" stroke="#000" stroke-width="${o.ao || 10}" opacity="${o.aoo ?? .38}" filter="url(#${id}bl)" transform="translate(2.5 3)"/><path d="${d}" fill="none" stroke="url(#${id}rim)" stroke-width="${o.rimw || 3}" opacity="${o.rim ?? .8}" transform="translate(1.2 1.2)"/>${o.inner || ""}</g>`; }
const GLINT = (x, y, s = 1, c = "#fff") => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="7" fill="${c}" opacity=".35" filter="url(#gl)"/><path d="M0 -9L1.4 -1.4L9 0L1.4 1.4L0 9L-1.4 1.4L-9 0L-1.4 -1.4Z" fill="${c}"/></g>`;
const SHD = (id, cx = 66, cy = 116, rx = 40, ry = 7) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity=".6" filter="url(#${id}ds)"/>`;
const RIV = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r + 1}" fill="#1a1410"/><circle cx="${x}" cy="${y}" r="${r}" fill="#9aa4ac"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .45}" fill="#fff"/>`;
const GEM = (id, x, y, r, c) => { const t = T(c); return `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="${t.lt}" opacity=".35" filter="url(#${id}b4)"/><circle cx="${x}" cy="${y}" r="${r + 1.6}" fill="#1a0c06"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}g${c.slice(1)})"/><path d="M${x - r * .7} ${y - r * .1}L${x - r * .1} ${y - r * .75}L${x + r * .5} ${y - r * .55}L${x} ${y}Z" fill="#fff" opacity=".35"/><circle cx="${x - r * .38}" cy="${y - r * .38}" r="${r * .26}" fill="#fff" opacity=".95"/>`; };
const GEMDEF = (id, c) => { const t = T(c); return RG(`${id}g${c.slice(1)}`, [[0, t.hi], [.35, t.lt], [.7, t.b], [1, t.dd]], .4, .35, .75); };
const IC2 = {
  sword(id){ return `<defs>${base(id)}${LG(id + "stl", STEEL, 0, 0, 1, 0)}${LG(id + "gd", GOLD, 0, 0, 1, 1)}${LG(id + "lt", [[0, "#8a5a32"], [.5, "#5a361a"], [1, "#2a160a"]], 0, 0, 1, 0)}${GEMDEF(id, "#e0283a")}</defs>${SHD(id, 64, 118, 46, 6)}
<g transform="translate(64 64) scale(1.12) rotate(42) translate(-64 -60)">
${F(id, "M56 6L64 -6L72 6L73 78H55Z", `url(#${id}stl)`, {inner:`<path d="M64 -2V76" stroke="#3a444c" stroke-width="2.4"/><path d="M65.2 0V74" stroke="#fff" stroke-width="1" opacity=".8"/><path d="M60 20h3M60 30h3M60 40h3" stroke="#6ad0ff" stroke-width="1.4" opacity=".85"/><path d="M60 22l3 -2M60 32l3 2M60 42l3 -2" stroke="#6ad0ff" stroke-width="1" opacity=".7"/>`})}
<g opacity=".5">${`<path d="M60 20h3M60 30h3M60 40h3" stroke="#6ad0ff" stroke-width="3" filter="url(#${id}bl)"/>`}</g>
${F(id, "M38 78Q64 72 90 78Q94 82 90 86Q64 82 38 86Q34 82 38 78Z", `url(#${id}gd)`, {inner:`<path d="M44 81Q64 77 84 81" stroke="#5a3a0a" stroke-width="1.2" fill="none"/><circle cx="64" cy="82" r="3" fill="#5a3a0a"/>`, ao:6})}
<circle cx="36" cy="82" r="5.5" fill="url(#${id}gd)" stroke="#120c08" stroke-width="2.5"/><circle cx="92" cy="82" r="5.5" fill="url(#${id}gd)" stroke="#120c08" stroke-width="2.5"/>
${F(id, "M59 86H69V110H59Z", `url(#${id}lt)`, {inner:[0, 1, 2, 3, 4, 5].map(i => `<path d="M58 ${88 + i * 4}L70 ${91 + i * 4}" stroke="#1e0e04" stroke-width="1.6"/><path d="M58 ${89 + i * 4}L70 ${92 + i * 4}" stroke="#b07a4a" stroke-width=".7" opacity=".7"/>`).join(""), ao:5})}
${F(id, "M56 110H72L70 116H58Z", `url(#${id}gd)`, {ao:4})}
<circle cx="64" cy="122" r="8" fill="url(#${id}gd)" stroke="#120c08" stroke-width="3"/>${GEM(id, 64, 122, 4.4, "#e0283a")}
</g>${GLINT(92, 22, 1)}`; },
  axe(id){ return `<defs>${base(id)}${LG(id + "stl", [[0, "#ffffff"], [.3, "#d4dbe0"], [.6, "#8e99a3"], [1, "#4a545c"]], 0, 0, 1, 1)}${LG(id + "wd", [[0, "#c8945a"], [.4, "#8a5a30"], [1, "#3a2210"]], 0, 0, 1, 0)}${LG(id + "br", GOLD)}</defs>${SHD(id, 60, 118, 36, 6)}
${F(id, "M68 18L82 15L46 120L32 116Z", `url(#${id}wd)`, {inner:`<path d="M76 20L40 116" stroke="#2a1608" stroke-width="1" opacity=".6"/><path d="M72 24L38 112" stroke="#e0b07a" stroke-width=".8" opacity=".6"/>`})}
${[38, 62, 98].map(t => { const x = 80 - (t - 16) * 36 / 102, y = t; return `<path d="M${x - 7} ${y - 1}l12 4" stroke="#120c08" stroke-width="6"/><path d="M${x - 7} ${y - 1}l12 4" stroke="url(#${id}br)" stroke-width="3.6"/>`; }).join("")}
${F(id, "M68 20Q86 0 114 6Q126 34 116 66Q102 52 84 50Q82 36 72 32Z", `url(#${id}stl)`, {inner:`<path d="M84 50Q102 52 116 66Q126 34 114 6" fill="none" stroke="#fff" stroke-width="2.4" opacity=".95"/><path d="M80 26Q96 16 110 18M82 38Q98 32 112 38" stroke="#4a5258" stroke-width="1.4" fill="none"/><path d="M88 24l5 5 5 -5 5 5 5 -5" stroke="#c99a3a" stroke-width="2" fill="none"/>`})}${F(id, "M72 22Q56 16 46 28Q58 32 70 38Z", `url(#${id}stl)`)}${RIV(76, 30, 2.4)}${GLINT(110, 16, .8)}`; },
  shield(id, c = "#2a4a7a"){ const t = T(c); return `<defs>${base(id)}${LG(id + "f", [[0, t.lt], [.5, t.b], [1, t.dd]])}${LG(id + "r", STEEL)}${LG(id + "w", GOLD)}${LG(id + "pl", [[0, "#a87a4a"], [1, "#5a3a1e"]])}</defs>${SHD(id, 66, 120, 44, 6)}
${F(id, "M16 12Q64 2 112 12V58Q112 100 64 122Q16 100 16 58Z", `url(#${id}r)`, {rimw:4})}
${F(id, "M24 19Q64 11 104 19V58Q104 94 64 113Q24 94 24 58Z", `url(#${id}f)`, {grain:.32, inner:`<path d="M64 12V115" stroke="#000" stroke-width="1.4" opacity=".35"/><path d="M28 30l12 8M96 70l-10 8M40 90l8 -4" stroke="#fff" stroke-width=".9" opacity=".35"/>`})}
<g transform="translate(36 30) scale(.58)">${F(id, CUST.wolf, `url(#${id}w)`, {olw:5, ao:6, rimw:2.5})}</g>
${[[22, 16], [64, 8], [106, 16], [110, 56], [18, 56], [40, 104], [88, 104], [64, 118]].map(([x, y]) => RIV(x, y, 2.4)).join("")}${GLINT(32, 22, .9)}`; },
  helm(id){ return `<defs>${base(id)}${RG(id + "s", [[0, "#ffffff"], [.25, "#d6dde3"], [.55, "#7a858e"], [.8, "#3f474e"], [1, "#1e2328"]], .32, .28, .9)}${LG(id + "g", GOLD)}${LG(id + "pl", [[0, "#ff8a6a"], [.5, "#c02a1a"], [1, "#5a0a06"]])}</defs>${SHD(id)}
${F(id, "M60 22Q50 2 64 -2Q70 10 74 24Q90 6 98 12Q86 20 80 30Z", `url(#${id}pl)`, {grain:.15, inner:`<path d="M62 4Q66 14 70 24M84 14Q80 22 78 28" stroke="#ffb09a" stroke-width="1.2" fill="none" opacity=".8"/>`})}
${F(id, "M22 96Q16 34 64 26Q112 34 106 96L94 108H34Z", `url(#${id}s)`, {rimw:4, inner:`<path d="M64 26V108" stroke="#2a3036" stroke-width="2"/><path d="M65.5 28V106" stroke="#fff" stroke-width="1" opacity=".6"/>`})}
${F(id, "M34 64H94V74H70V104H58V74H34Z", "#0e1012", {grain:false, rim:.15, aoo:.2})}
${F(id, "M60 26H68V64H60Z", `url(#${id}g)`, {ao:4, rimw:1.5})}${F(id, "M28 96H100L94 108H34Z", `url(#${id}g)`, {ao:4})}
${[[32, 56], [96, 56], [38, 86], [90, 86], [48, 100], [80, 100]].map(([x, y]) => RIV(x, y, 2.2)).join("")}${[0, 1, 2, 3, 4].map(i => `<circle cx="${80 + (i % 2) * 6}" cy="${80 + i * 4}" r="1.6" fill="#0e1012"/>`).join("")}${GLINT(40, 40, 1)}`; },
  armor(id){ return `<defs>${base(id)}${RG(id + "s", [[0, "#ffffff"], [.3, "#c8d0d6"], [.6, "#6a747c"], [1, "#22282e"]], .3, .25, .95)}${LG(id + "l", [[0, "#a86e3a"], [1, "#3e220e"]])}${LG(id + "g", GOLD)}<pattern id="${id}m" width="6" height="5" patternUnits="userSpaceOnUse"><rect width="6" height="5" fill="#3a4148"/><circle cx="3" cy="2.5" r="2.2" fill="none" stroke="#b8c0c6" stroke-width="1.1"/><circle cx="0" cy="0" r="2.2" fill="none" stroke="#8a929a" stroke-width="1.1"/><circle cx="6" cy="0" r="2.2" fill="none" stroke="#8a929a" stroke-width="1.1"/></pattern></defs>${SHD(id, 64, 122, 42, 6)}
${F(id, "M34 82H94L100 116Q64 124 28 116Z", `url(#${id}m)`, {grain:.1})}
${F(id, "M30 30L48 16Q64 24 80 16L98 30V86Q64 98 30 86Z", `url(#${id}s)`, {rimw:4, inner:`<path d="M64 22V92" stroke="#2a3036" stroke-width="2.6"/><path d="M66 24V90" stroke="#fff" stroke-width="1.2" opacity=".7"/><path d="M36 64Q64 76 92 64M36 74Q64 86 92 74" stroke="#2a3036" stroke-width="1.6" fill="none"/><path d="M44 32Q54 46 52 60" stroke="#fff" stroke-width="3" opacity=".35" fill="none"/>`})}
${F(id, "M6 34Q12 18 32 20L40 42Q20 46 10 56Z", `url(#${id}s)`, {inner:`<path d="M10 44Q22 34 36 36M12 50Q24 40 38 42" stroke="#2a3036" stroke-width="1.4" fill="none"/>`})}${F(id, "M122 34Q116 18 96 20L88 42Q108 46 118 56Z", `url(#${id}s)`, {inner:`<path d="M118 44Q106 34 92 36" stroke="#2a3036" stroke-width="1.4" fill="none"/>`})}
${F(id, "M30 50H98V58H30Z", `url(#${id}l)`, {ao:4})}<rect x="58" y="47" width="12" height="14" rx="2" fill="none" stroke="#120c08" stroke-width="5"/><rect x="58" y="47" width="12" height="14" rx="2" fill="none" stroke="url(#${id}g)" stroke-width="3"/>
${F(id, "M56 22Q64 28 72 22L70 34Q64 38 58 34Z", `url(#${id}g)`, {ao:3})}${[[38, 30], [90, 30], [38, 80], [90, 80], [20, 28], [108, 28]].map(([x, y]) => RIV(x, y, 2.2)).join("")}${GLINT(46, 36, 1)}`; },
  cloak(id, c = "#5a2a22"){ const t = T(c); return `<defs>${base(id)}${LG(id + "c", [[0, t.lt], [.25, t.b], [.45, t.dk], [.6, t.b], [.8, t.dd], [1, t.dk]], 0, 0, 1, 0)}${RG(id + "fur", [[0, "#f2ead8"], [.6, "#b8a68a"], [1, "#5a4a3a"]], .35, .3, .9)}${LG(id + "g", GOLD)}${GEMDEF(id, "#2fa060")}</defs>${SHD(id, 64, 120, 46, 6)}
${F(id, "M40 24H88L112 116Q64 126 16 116Z", `url(#${id}c)`, {grain:.35, inner:`<path d="M52 30Q46 70 34 116M64 30V120M76 30Q82 70 94 116" stroke="#000" stroke-width="5" opacity=".28" filter="url(#${id}bl)" fill="none"/><path d="M58 30Q54 70 48 116M70 30Q74 70 82 116" stroke="${t.hi}" stroke-width="2" opacity=".3" fill="none"/><path d="M16 116q8 -5 16 0t16 0t16 0t16 0t16 0t16 0" stroke="${t.dd}" stroke-width="2.4" fill="none"/>`})}
${F(id, "M30 30Q40 10 64 12Q88 10 98 30Q86 38 64 36Q42 38 30 30Z", `url(#${id}fur)`, {grain:.4, inner:[...Array(14)].map((_, i) => `<path d="M${32 + i * 5} ${30 + Math.sin(i) * 3}q2 -6 4 0" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6"/>`).join("")})}
<circle cx="64" cy="36" r="9" fill="url(#${id}g)" stroke="#120c08" stroke-width="3"/>${GEM(id, 64, 36, 5, "#2fa060")}${GLINT(36, 24, .7)}`; },
  gloves(id){ return `<defs>${base(id)}${LG(id + "l", [[0, "#e0aa70"], [.45, "#9a6234"], [1, "#3a200c"]])}${LG(id + "s", STEEL)}</defs>${SHD(id)}
${F(id, "M36 116V74L26 54Q24 44 32 46L42 58V22Q42 14 50 16V52V12Q58 6 60 14V50V16Q68 10 70 18V52V28Q78 22 80 30L82 76Q80 98 74 116Z", `url(#${id}l)`, {grain:.38, inner:`<path d="M50 18V50M60 14V48M70 20V50" stroke="#2a1608" stroke-width="1.2" stroke-dasharray="2.4 2" opacity=".8"/><path d="M44 24Q46 20 48 24V48" stroke="#fff" stroke-width="2" opacity=".35" fill="none"/>`})}
${[[46, 58], [56, 56], [66, 58], [76, 62]].map(([x, y]) => F(id, `M${x - 5} ${y}h10v8h-10z`, `url(#${id}s)`, {ao:3, rimw:1.4})).join("")}
${F(id, "M32 92H84V116H32Z", `url(#${id}s)`, {inner:`<path d="M32 100H84M32 108H84" stroke="#2a3036" stroke-width="1.6"/>`})}${RIV(40, 104, 2)}${RIV(76, 104, 2)}${GLINT(78, 96, .7)}`; },
  belt(id){ return `<defs>${base(id)}${LG(id + "l", [[0, "#c8885a"], [.5, "#7a4a24"], [1, "#2e180a"]], 0, 0, 0, 1)}${LG(id + "g", GOLD)}${LG(id + "p", [[0, "#b07a4a"], [1, "#4a2a12"]])}</defs>${SHD(id, 64, 112, 50, 6)}
${F(id, "M6 48Q64 70 122 48V70Q64 92 6 70Z", `url(#${id}l)`, {grain:.4, inner:`<path d="M8 52Q64 74 120 52M8 66Q64 88 120 66" stroke="#2a1608" stroke-width="1.2" stroke-dasharray="3 2.4" fill="none"/>`})}
${F(id, "M80 72H108V100Q94 106 80 100Z", `url(#${id}p)`, {grain:.4, inner:`<path d="M80 80H108" stroke="#2a1608" stroke-width="1.4"/>`})}${RIV(94, 76, 2.4)}
${[18, 30, 98, 110].map(x => RIV(x, 59 + Math.abs(64 - x) * -.12 + 8, 2.2)).join("")}
<rect x="48" y="52" width="32" height="30" rx="5" fill="none" stroke="#120c08" stroke-width="9"/><rect x="48" y="52" width="32" height="30" rx="5" fill="none" stroke="url(#${id}g)" stroke-width="6"/><path d="M64 56V78" stroke="#120c08" stroke-width="5"/><path d="M64 56V78" stroke="url(#${id}g)" stroke-width="3"/><path d="M51 55h10" stroke="#fff" stroke-width="1.6" opacity=".8"/>${GLINT(54, 56, .7)}`; },
  boots(id){ return `<defs>${base(id)}${LG(id + "l", [[0, "#d09a64"], [.45, "#8a5a30"], [1, "#2e180a"]])}${LG(id + "d", [[0, "#8a5a30"], [1, "#1e0e04"]])}${LG(id + "g", GOLD)}</defs>${SHD(id, 66, 118, 50, 6)}
${F(id, "M62 14H90V84L118 96V114H62Z", `url(#${id}d)`, {grain:.4})}
${F(id, "M24 18H56V84L84 96V116H24Z", `url(#${id}l)`, {grain:.42, inner:`<path d="M30 44Q38 40 48 46M28 60Q40 56 52 62" stroke="#2a1608" stroke-width="1.6" fill="none" opacity=".7"/><path d="M30 22V80" stroke="#fff" stroke-width="3" opacity=".25"/>`})}
${F(id, "M20 14H60V30H20Z", `url(#${id}l)`, {grain:.4, inner:`<path d="M20 26H60" stroke="#2a1608" stroke-width="1.2" stroke-dasharray="3 2"/>`})}${F(id, "M22 108H86V118H22Z", "#1e1008", {grain:false})}
${F(id, "M24 66H56V74H24Z", `url(#${id}d)`, {ao:3})}<rect x="44" y="64" width="10" height="12" rx="1.5" fill="none" stroke="#120c08" stroke-width="4"/><rect x="44" y="64" width="10" height="12" rx="1.5" fill="none" stroke="url(#${id}g)" stroke-width="2.4"/>${GLINT(30, 20, .6)}`; },
  ring(id, c = "#d0283a"){ return `<defs>${base(id)}${LG(id + "g", GOLD, 0, 0, 1, 1)}${LG(id + "g2", [[0, "#4d3008"], [.5, "#b7832a"], [1, "#fff1b8"]], 0, 0, 1, 1)}${GEMDEF(id, c)}<filter id="gl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>${SHD(id, 64, 116, 38, 6)}
<ellipse cx="64" cy="80" rx="38" ry="30" fill="none" stroke="#120c08" stroke-width="17"/><ellipse cx="64" cy="80" rx="38" ry="30" fill="none" stroke="url(#${id}g2)" stroke-width="12"/><path d="M28 74A38 30 0 0 1 64 50A38 30 0 0 1 100 74" fill="none" stroke="url(#${id}g)" stroke-width="12"/><path d="M32 70A36 28 0 0 1 60 52" fill="none" stroke="#fff" stroke-width="2.4" opacity=".85"/>
${F(id, "M48 44L56 30H72L80 44L72 54H56Z", `url(#${id}g)`, {ao:4})}${[[50, 32], [78, 32], [50, 52], [78, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="url(#${id}g)" stroke="#120c08" stroke-width="1.4"/>`).join("")}
<path d="M64 18L80 30L74 50H54L48 30Z" fill="#1a0c06"/><path d="M64 20L78 30L72 48H56L50 30Z" fill="url(#${id}g${c.slice(1)})"/><path d="M64 20L72 30L64 38L56 30Z" fill="#fff" opacity=".35"/><path d="M50 30L56 30L56 48Z M78 30L72 30L72 48Z" fill="#000" opacity=".25"/><path d="M56 48L64 38L72 48Z" fill="#000" opacity=".3"/>${GLINT(58, 26, 1)}`; },
  amulet(id, c = "#2a8ad0"){ const t = T(c); return `<defs>${base(id)}${LG(id + "g", GOLD)}${RG(id + "core", [[0, "#ffffff"], [.25, t.hi], [.6, t.b], [1, t.dd]], .42, .38, .7)}<filter id="gl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>${SHD(id, 64, 120, 30, 5)}
<path d="M18 4Q64 70 110 4" fill="none" stroke="#120c08" stroke-width="5" stroke-dasharray="5 2"/><path d="M18 4Q64 70 110 4" fill="none" stroke="url(#${id}g)" stroke-width="3" stroke-dasharray="5 2"/>
<circle cx="64" cy="82" r="34" fill="${t.lt}" opacity=".35" filter="url(#${id}b4)"/>
${F(id, "M64 42L92 62L88 96L64 116L40 96L36 62Z", `url(#${id}g)`, {inner:`<path d="M64 48L86 64L83 93L64 109L45 93L42 64Z" fill="none" stroke="#5a3a0a" stroke-width="1.4"/>${[[64, 46], [88, 64], [86, 94], [64, 112], [42, 94], [40, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff6cf"/>`).join("")}`})}
<ellipse cx="64" cy="80" rx="17" ry="20" fill="#0a0604"/><ellipse cx="64" cy="80" rx="15" ry="18" fill="url(#${id}core)"/><path d="M54 74Q58 64 66 64" stroke="#fff" stroke-width="2.4" fill="none" opacity=".9"/>
${F(id, "M58 30H70V44H58Z", `url(#${id}g)`, {ao:3, rimw:1.5})}${GLINT(70, 70, 1.2)}`; },
  potion(id, c = "#e0302a"){ const t = T(c); return `<defs>${base(id)}${RG(id + "liq", [[0, t.lt], [.35, t.b], [.75, t.dk], [1, t.dd]], .4, .4, .8)}${LG(id + "glass", [[0, "#ffffff", .5], [.3, "#e8f4f8", .12], [.8, "#9ab8c8", .18], [1, "#2a3a44", .45]], 0, 0, 1, 0)}${LG(id + "ck", [[0, "#d8a870"], [1, "#6a4220"]], 0, 0, 1, 0)}${LG(id + "wx", [[0, "#e04030"], [1, "#6a0a06"]])}</defs>${SHD(id, 64, 120, 38, 7)}
<circle cx="64" cy="82" r="40" fill="${t.lt}" opacity=".28" filter="url(#${id}b4)"/>
<path d="M54 12H74V40Q104 52 102 82Q100 118 64 118Q28 118 26 82Q24 52 54 40Z" fill="none" stroke="#120c08" stroke-width="5"/>
<path d="M28.5 72Q64 60 99.5 72Q102 116 64 116Q26 116 28.5 72Z" fill="url(#${id}liq)"/>
<path d="M29 72Q64 62 99 72" stroke="${t.hi}" stroke-width="2.4" fill="none" opacity=".9"/>${[[54, 98, 3], [70, 88, 2.2], [78, 104, 1.8], [60, 84, 1.6], [46, 92, 1.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>`).join("")}
<path d="M54 12H74V40Q104 52 102 82Q100 118 64 118Q28 118 26 82Q24 52 54 40Z" fill="url(#${id}glass)"/>
<path d="M36 60Q44 48 56 46Q42 58 38 84Z" fill="#fff" opacity=".7"/><path d="M88 84Q88 100 78 108" stroke="#fff" stroke-width="2.4" fill="none" opacity=".5"/>
${F(id, "M50 22H78V32H50Z", `url(#${id}wx)`, {ao:3, rimw:1.4, inner:`<path d="M54 32q-2 6 2 8M74 32q2 5 -1 9" stroke="#8a0a06" stroke-width="3" fill="none"/>`})}${F(id, "M54 2H74V24H54Z", `url(#${id}ck)`, {grain:.45, ao:3})}
<path d="M50 28Q38 36 40 50" stroke="#d8c8a0" stroke-width="1.6" fill="none"/>${F(id, "M30 50L42 46L46 58L34 62Z", "#e8dcb8", {ao:3, rimw:1.2, inner:`<path d="M35 53l8 -3M36 57l7 -2" stroke="#7a5a2a" stroke-width="1"/>`})}${GLINT(44, 56, .9)}`; },
  scroll(id){ return `<defs>${base(id)}${LG(id + "p", [[0, "#fffbea"], [.5, "#ecdcb4"], [1, "#a88a58"]], 0, 0, 0, 1)}${LG(id + "r", [[0, "#d8c494"], [.5, "#8a7244"], [1, "#4a3a1e"]], 0, 0, 0, 1)}${RG(id + "wx", [[0, "#ff7a6a"], [.5, "#b0201a"], [1, "#4a0806"]])}${LG(id + "rb", [[0, "#3a6aaa"], [1, "#16284a"]])}</defs>${SHD(id, 66, 116, 50, 6)}
${F(id, "M26 22H100Q108 22 108 30V100H34Q26 100 26 92Z", `url(#${id}p)`, {grain:.35, inner:`${[36, 46, 56, 66, 76].map((y, i) => `<path d="M38 ${y}Q60 ${y - 2} ${i % 2 ? 86 : 94} ${y}" stroke="#5a3a1a" stroke-width="1.8" fill="none" opacity=".75"/>`).join("")}<path d="M100 22Q106 50 100 100" stroke="#8a6a3a" stroke-width="3" opacity=".4" fill="none"/>`})}
${F(id, "M18 16Q10 16 10 26Q10 36 20 36H34V22Q34 14 26 16Z", `url(#${id}r)`, {grain:.3})}${F(id, "M100 92H116Q122 98 116 108Q110 114 100 112Z", `url(#${id}r)`, {grain:.3})}
${F(id, "M70 90L76 122L80 112L86 120L82 90Z", `url(#${id}rb)`, {ao:3, rimw:1.2})}<circle cx="76" cy="88" r="12" fill="url(#${id}wx)" stroke="#120c08" stroke-width="3"/><path d="M70 88l6 -6l6 6l-6 6z" fill="none" stroke="#5a0806" stroke-width="1.6"/><circle cx="71" cy="83" r="2.2" fill="#fff" opacity=".7"/>`; },
  gem(id, c = "#d0283a"){ const t = T(c); return `<defs>${base(id)}<filter id="gl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>${RG(id + "in", [[0, t.hi, .9], [1, t.b, 0]], .5, .5, .5)}</defs>${SHD(id, 64, 118, 40, 6)}
<circle cx="64" cy="64" r="46" fill="${t.lt}" opacity=".3" filter="url(#${id}b4)"/>
<path d="M40 22H88L114 50L64 116L14 50Z" fill="#120c08" stroke="#120c08" stroke-width="6" stroke-linejoin="round"/>
<path d="M40 22H88L76 50H52Z" fill="${t.hi}"/><path d="M40 22L52 50H14Z" fill="${t.lt}"/><path d="M88 22L76 50H114Z" fill="${t.b}"/><path d="M40 22L64 22L52 50Z" fill="#fff" opacity=".45"/>
<path d="M14 50H52L64 116Z" fill="${t.lt}"/><path d="M52 50H76L64 116Z" fill="${t.b}"/><path d="M76 50H114L64 116Z" fill="${t.dk}"/><path d="M14 50H40L64 116Z" fill="#fff" opacity=".12"/><path d="M90 50H114L64 116Z" fill="${t.dd}" opacity=".7"/>
<path d="M52 50L64 116L60 50Z M28 50L64 116L38 50Z" fill="#fff" opacity=".18"/><ellipse cx="64" cy="66" rx="26" ry="22" fill="url(#${id}in)"/>
<path d="M40 22H88L114 50L64 116L14 50Z" fill="none" stroke="${t.hi}" stroke-width="1.2" opacity=".7"/><path d="M14 50H114" stroke="${t.hi}" stroke-width="1" opacity=".6"/>${GLINT(48, 30, 1.2)}${GLINT(84, 78, .6)}`; },
  herb(id){ return `<defs>${base(id)}${LG(id + "lf", [[0, "#d8f0a0"], [.5, "#6aa83a"], [1, "#1e3a10"]])}${LG(id + "lf2", [[0, "#b8e090"], [.5, "#4a8a3a"], [1, "#16300e"]])}${RG(id + "fl", [[0, "#f8e8ff"], [.5, "#b07ae0"], [1, "#4a2a7a"]])}${RG(id + "fy", [[0, "#fff8c0"], [.6, "#f0c030"], [1, "#8a5a0a"]])}${LG(id + "tw", [[0, "#e8c890"], [1, "#8a6a3a"]])}</defs>${SHD(id, 64, 120, 34, 6)}
${["M60 116Q56 80 30 44", "M64 116Q64 70 66 30", "M68 116Q76 80 100 50", "M62 116Q48 90 22 76", "M66 116Q84 92 108 84"].map(d => `<path d="${d}" stroke="#120c08" stroke-width="5" fill="none"/><path d="${d}" stroke="#4a7a2a" stroke-width="2.6" fill="none"/>`).join("")}
${[["M30 44Q14 36 18 20Q34 24 36 40Z", 1], ["M66 30Q56 14 66 2Q78 14 70 30Z", 2], ["M100 50Q116 40 118 26Q100 26 96 44Z", 1], ["M22 76Q6 74 4 62Q20 60 26 72Z", 2], ["M108 84Q124 84 126 72Q110 70 104 80Z", 1], ["M42 62Q28 58 30 46Q42 50 46 60Z", 2], ["M84 66Q98 60 98 48Q86 50 80 62Z", 1]].map(([d, k]) => F(id, d, `url(#${id}lf${k === 2 ? "2" : ""})`, {ao:4, rimw:1.6, olw:3.5, inner:`<path d="${d.split("Q")[0]}Q${d.split("Q")[1]}" stroke="#16300e" stroke-width="1" fill="none" opacity=".5"/>`})).join("")}
${[[66, 8, 6, "fl"], [22, 22, 5, "fl"], [116, 30, 5, "fy"], [6, 64, 4, "fy"], [70, 18, 4.4, "fl"]].map(([x, y, r, g]) => `<circle cx="${x}" cy="${y}" r="${r + 1.6}" fill="#120c08"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}${g})"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .3}" fill="#fff" opacity=".8"/>`).join("")}
${F(id, "M52 96H76V108H52Z", `url(#${id}tw)`, {ao:3, inner:`<path d="M52 100L76 104M52 104L76 100" stroke="#5a3a1a" stroke-width="1.4"/>`})}`; },
  ore(id){ return `<defs>${base(id)}${LG(id + "r", [[0, "#b0aca2"], [.4, "#76726a"], [1, "#22201c"]])}${LG(id + "f2", [[0, "#8a867c"], [1, "#2e2c28"]])}${LG(id + "g", GOLD)}${RG(id + "cr", [[0, "#e8f4ff"], [.5, "#7ab8e8"], [1, "#1e4a7a"]])}<filter id="gl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>${SHD(id, 64, 118, 50, 7)}
${F(id, "M14 92L26 46L58 24L96 34L116 80L86 114H34Z", `url(#${id}r)`, {grain:.5, inner:`<path d="M26 46L60 60L96 34M60 60L86 114M60 60L34 114M60 60L116 80" stroke="#1a1816" stroke-width="1.6" fill="none"/><path d="M26 46L58 24L60 60Z" fill="#fff" opacity=".18"/><path d="M60 60L116 80L86 114Z" fill="#000" opacity=".28"/>`})}
${[[36, 64, 1], [80, 50, 1.2], [70, 84, .9], [46, 92, .8]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${F(id, "M-8 2L-2 -9L8 -5L6 6L-4 8Z", `url(#${id}g)`, {ao:3, rimw:1.4, olw:3})}</g>`).join("")}
${F(id, "M88 38L96 14L104 40Z", `url(#${id}cr)`, {ao:3, rimw:1.4, olw:3})}${F(id, "M98 42L110 26L110 48Z", `url(#${id}cr)`, {ao:3, rimw:1.4, olw:3})}${GLINT(96, 22, .8)}${GLINT(78, 46, .6)}`; },
  fish(id){ return `<defs>${base(id)}${LG(id + "b", [[0, "#f2f8fa"], [.35, "#a8c8d8"], [.65, "#4a7a90"], [1, "#16303c"]], 0, 0, 0, 1)}${LG(id + "fn", [[0, "#9ab8c8", .9], [1, "#2a4a5a", .9]])}<pattern id="${id}sc" width="8" height="6" patternUnits="userSpaceOnUse"><path d="M0 6Q4 0 8 6" fill="none" stroke="#16303c" stroke-width=".9" opacity=".55"/></pattern></defs>${SHD(id, 64, 112, 50, 6)}
${F(id, "M88 60L120 38L114 64L122 92L88 72Z", `url(#${id}fn)`, {ao:4, inner:`<path d="M92 62L116 44M92 66L118 66M92 70L118 86" stroke="#16303c" stroke-width="1" opacity=".6"/>`})}
${F(id, "M48 44Q60 30 74 38L66 50Z", `url(#${id}fn)`, {ao:3})}${F(id, "M56 82Q64 96 74 92L68 80Z", `url(#${id}fn)`, {ao:3})}
${F(id, "M8 66Q34 30 74 46Q86 52 92 66Q86 80 74 86Q34 102 8 66Z", `url(#${id}b)`, {inner:`<rect x="28" y="40" width="64" height="52" fill="url(#${id}sc)"/><path d="M22 60Q50 52 90 64" stroke="#fff" stroke-width="2.6" fill="none" opacity=".6"/><path d="M30 62Q54 70 88 68" stroke="#d07a8a" stroke-width="2" fill="none" opacity=".5"/><path d="M30 50Q34 66 30 82" stroke="#16303c" stroke-width="1.6" fill="none"/>`})}
<circle cx="20" cy="62" r="5" fill="#f2f0e8" stroke="#120c08" stroke-width="1.6"/><circle cx="21" cy="62" r="3" fill="#0a0806"/><circle cx="19.6" cy="60.6" r="1.2" fill="#fff"/><path d="M10 72Q14 74 18 72" stroke="#120c08" stroke-width="1.4" fill="none"/>${GLINT(44, 52, .7)}`; },
  fang(id){ return `<defs>${base(id)}${LG(id + "b", [[0, "#fffdf4"], [.4, "#e8dec4"], [.8, "#a89a7c"], [1, "#4a4232"]])}${LG(id + "c", [[0, "#a86e3a"], [1, "#3a200c"]])}${RG(id + "bd", [[0, "#ff9a7a"], [.6, "#b0201a"], [1, "#4a0806"]])}</defs>${SHD(id, 60, 120, 30, 5)}
<path d="M30 10Q64 40 98 10" fill="none" stroke="#120c08" stroke-width="5"/><path d="M30 10Q64 40 98 10" fill="none" stroke="url(#${id}c)" stroke-width="3"/>
${F(id, "M40 30Q76 26 88 44Q96 78 54 120Q66 84 54 60Q44 46 40 30Z", `url(#${id}b)`, {grain:.25, inner:`<path d="M50 34Q74 34 80 46Q82 66 66 92" stroke="#fff" stroke-width="3" fill="none" opacity=".75"/><path d="M58 56Q64 62 62 74" stroke="#8a7a5a" stroke-width="1.2" fill="none" opacity=".6"/>`})}
${F(id, "M38 22H80V36H40Z", `url(#${id}c)`, {grain:.4, ao:3, inner:`<path d="M42 28H78" stroke="#1e0e04" stroke-width="1.2" stroke-dasharray="3 2"/>`})}<circle cx="60" cy="18" r="6" fill="url(#${id}bd)" stroke="#120c08" stroke-width="2.4"/><circle cx="58" cy="16" r="1.8" fill="#fff" opacity=".8"/>${GLINT(70, 40, .7)}`; },
  coins(id){ const coin = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="5" rx="22" ry="9" fill="#120c08"/><ellipse cx="0" cy="3.4" rx="20.5" ry="8" fill="#6a420c"/><ellipse cx="0" cy="0" rx="20.5" ry="8" fill="url(#${id}g)" stroke="#120c08" stroke-width="2"/><ellipse cx="0" cy="0" rx="13" ry="4.8" fill="none" stroke="#7a5212" stroke-width="1.4"/><path d="M-4 -1l4 -2.4l4 2.4l-4 2.4z" fill="#7a5212"/><path d="M-16 -2Q-8 -6 4 -6.4" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/></g>`;
    return `<defs>${base(id)}${LG(id + "g", GOLD, 0, 0, 1, .5)}<filter id="gl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>${SHD(id, 64, 118, 50, 7)}${coin(44, 104)}${coin(84, 100)}${coin(44, 92)}${coin(46, 80)}${coin(44, 68)}${coin(48, 56)}${coin(86, 88)}<g transform="rotate(-62 96 62)">${coin(96, 62, .95)}</g>${GLINT(36, 52, 1)}${GLINT(100, 46, .7)}`; },
};
// ---------- будь-яка іконка game-icons, але об'ємна: рельєф, світло, фактура ----------
const MATS = {
  steel:STEEL, dark:DARKSTEEL, gold:GOLD,
  leather:[[0, "#d39a5e"], [.45, "#8a5428"], [1, "#3a1e0a"]],
  wood:[[0, "#c89a5e"], [.5, "#74502a"], [1, "#2e1c0c"]],
  fur:[[0, "#c8a878"], [.5, "#76593a"], [1, "#2a1e12"]],
  bone:[[0, "#fffcec"], [.45, "#e2d4ac"], [1, "#7a6a48"]],
  stone:[[0, "#d4d0c6"], [.5, "#7e7a70"], [1, "#2e2c28"]],
  paper:[[0, "#fff6da"], [.5, "#e2c890"], [1, "#8a6a3a"]],
  chitin:[[0, "#f08a64"], [.5, "#8e2c1a"], [1, "#2a0a06"]],
};
const matStops = (m, c) => MATS[m] || (() => { const t = T(c || "#7a8aa0"); return [[0, t.hi], [.4, t.lt], [.7, t.b], [1, t.dd]]; })();
function emb(id, name, mat = "steel", c, o = {}){
  const g = (GI[name] || GI["swap-bag"]).replace(/fill="currentColor"/g, ""), tr = `translate(${o.x ?? 15} ${o.y ?? 11}) scale(${o.s ?? .19})`;
  const spec = mat === "steel" || mat === "gold" || mat === "dark" || mat === "glass" ? 1.1 : mat === "magic" ? .9 : .45;
  const glow = mat === "magic" || mat === "glass" ? T(c || "#7a8aa0").lt : null;
  return `<defs>${base(id)}${LG(id + "m", matStops(mat, c), 0, 0, 1, 1)}<g id="${id}s">${g}</g>
<filter id="${id}bv" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b"/>
<feSpecularLighting in="b" surfaceScale="5" specularConstant="${spec}" specularExponent="16" lighting-color="#fff" result="s"><feDistantLight azimuth="225" elevation="40"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
<feDiffuseLighting in="b" surfaceScale="5" diffuseConstant="1.2" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting><feComposite in="d" in2="SourceAlpha" operator="in" result="d2"/>
<feBlend in="SourceGraphic" in2="d2" mode="multiply" result="m"/><feComposite in="m" in2="s2" operator="arithmetic" k2="1" k3="1"/></filter>
<mask id="${id}k"><g transform="${tr}"><use href="#${id}s" fill="#fff"/></g></mask></defs>
${glow ? `<g transform="${tr}" filter="url(#${id}b4)" opacity=".75"><use href="#${id}s" fill="${glow}"/></g>` : ""}${SHD(id, 64, 117, 40, 6)}
<g transform="${tr}"><use href="#${id}s" fill="#120c08" stroke="#120c08" stroke-width="26" stroke-linejoin="round"/></g>
<g filter="url(#${id}bv)"><g transform="${tr}"><use href="#${id}s" fill="url(#${id}m)"/></g></g>
<rect width="128" height="128" fill="#000" filter="url(#${id}gr)" mask="url(#${id}k)" opacity=".2"/>`;
}
// яка мальована форма відповідає іконці game-icons
const PAINT = {broadsword:"sword", "piercing-sword":"sword", "bloody-sword":"sword", "crescent-blade":"sword", "battle-axe":"axe", "war-axe":"axe", "wood-axe":"axe",
  "round-shield":"shield", "bell-shield":"shield", "checked-shield":"shield", "visored-helm":"helm", "closed-barbute":"helm", "black-knight-helm":"helm", "crested-helmet":"helm", "horned-helm":"helm",
  breastplate:"armor", "chain-mail":"armor", cape:"cloak", gloves:"gloves", gauntlet:"gloves", "mailed-fist":"gloves", belt:"belt", "belt-armor":"belt", boots:"boots", "leather-boot":"boots", "metal-boot":"boots",
  ring:"ring", "gem-pendant":"amulet", "gem-necklace":"amulet", "pearl-necklace":"amulet", "primitive-necklace":"amulet",
  "health-potion":"potion", "heart-bottle":"potion", "potion-ball":"potion", "round-potion":"potion", "bubbling-flask":"potion", "fizzing-flask":"potion", "magic-potion":"potion", "round-bottom-flask":"potion", "standing-potion":"potion",
  "scroll-unfurled":"scroll", "tied-scroll":"scroll", "cut-diamond":"gem", "crystal-cluster":"gem", "crystal-growth":"gem", "crystal-shine":"gem", "herbs-bundle":"herb", ore:"ore", "fish-cooked":"fish", fangs:"fang", "bestial-fangs":"fang"};
// решта: матеріал рельєфу
const EMAT = {halberd:"steel", "harpoon-trident":"steel", "spiked-mace":"dark", "flanged-mace":"steel", warhammer:"steel", "plain-dagger":"steel", "skull-staff":"bone", sun:"gold",
  crown:"gold", hood:"cloth", "pilgrim-hat":"leather", "leather-armor":"leather", "fur-shirt":"fur", "leather-vest":"leather", "leg-armor":"steel", "feathered-wing":"cloth",
  "eye-target":"magic", "ringing-bell":"gold", teleport:"magic", "locked-chest":"wood", "book-cover":"leather", "animal-hide":"fur", "boar-tusks":"bone", "broken-bone":"bone", claws:"bone",
  feather:"cloth", "fish-scales":"glass", medal:"gold", "metal-scales":"steel", moon:"magic", powder:"magic", "rolled-cloth":"cloth", "scorpion-tail":"chitin", "skull-crossed-bones":"bone",
  "spider-web":"bone", "stone-sphere":"stone", "swap-bag":"leather"};
const BY_ID = {wood_shield:"#7a5430", iron_shield:"#4a5866", warden_shield:"#2a4a7a", order_shield:"#7a2a22", chorno_shield:"#24201c",
  patched_cloak:"#6a5a44", wool_cloak:"#7a5a3a", ranger_cloak:"#2f5a35", shadow_cloak:"#2a2238",
  potion_s:"#e0302a", potion_l:"#c41830", potion_e:"#2a7ae0", potion_xe:"#1a4ad0", zhyvytsia:"#30c0a0", elix_str:"#e07020", elix_skin:"#8a9a3a", elix_agi:"#30b050", elix_wil:"#8a40d0",
  leather_pants:"leather", chain_legs:"steel", steel_legs:"steel", knight_legs:"dark", leather_cap:"leather", wolf_skin:"fur", troll_hide:"fur", slime:"#6ac040", wisp_dust:"#7ad0ff", spark_dust:"#ffb030", ghost_dust:"#c0d8ff",
  rat_tail:"#8a6a5a", rotten_cloth:"#6a6a4a", dark_shard:"#7a3ad0", web:"bone", scale:"#3aa090", raw1:"#9ad0e0", raw2:"#7aa0ff", raw3:"#c070ff", o5:"#b070ff"};
const COLS = ["#a03a2a", "#2a5a8a", "#3a6a3a", "#6a3a7a", "#8a6a2a", "#2a6a6a", "#7a2a4a", "#4a4a5a"];
const hsh = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
function spec(id){
  const it = ITEMS[id] || {}, n = typeof itemIc === "function" ? itemIc(id) : "swap-bag", r = rarity(it), by = BY_ID[id];
  const col = it.gem ? it.col : by && by[0] === "#" ? by : null, fx = {};
  if (it.res && !it.gem) fx.hue = [0, 35, -40, 95, 200][((it.t || 1) - 1) % 5];
  const k = PAINT[n];
  if (k){ let a = col;
    if (!a && (k === "ring" || k === "amulet")) a = r ? RARC[r] : COLS[hsh(id) % COLS.length];
    if (!a && k === "potion") a = it.use && it.use.en && !it.use.hp ? "#2a7ae0" : it.buff ? "#40b050" : "#e0302a";
    if (!a && (k === "shield" || k === "cloak")) a = COLS[hsh(id) % COLS.length];
    if (!a && k === "gem") a = RARC[Math.max(2, r)];
    return {k, a, fx, r}; }
  let m = by && by[0] !== "#" ? by : EMAT[n] || "steel", c = col;
  if ((m === "cloth" || m === "magic" || m === "glass") && !c) c = m === "magic" ? "#9a7ae0" : COLS[hsh(id) % COLS.length];
  return {g:n, m, c, fx, r};
}
// одна річ — одна картинка, намальована раз і далі з кешу
const A = {}, PX = 144;
function ras(key, svg, w, h){
  let r = A[key]; if (r) return r.url;
  r = A[key] = {url:svgURL(svg)};
  const img = new Image();
  img.onload = () => { const go = () => { try { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(img, 0, 0, w, h);
      canvasURL(cv, "image/webp", .92, u => { const old = r.url; r.url = u; document.querySelectorAll(`img[data-art="${key}"]`).forEach(e => { e.src = r.url; }); setTimeout(() => freeURL(old), 4000); });
    } catch (e){} }; if (window.requestIdleCallback) requestIdleCallback(go, {timeout:900}); else setTimeout(go, 120); };
  img.src = r.url; return r.url;
}
function itemSVG(id){
  const s = spec(id), k = "a" + (++IG2), rc = s.r >= 2 ? RARC[s.r] : null;
  let body = s.k ? IC2[s.k](k, s.a) : emb(k, s.g, s.m, s.c);
  let f = "";
  if (s.r === 0 && ITEMS[id] && ITEMS[id].slot) f = `<filter id="${k}fx"><feColorMatrix type="saturate" values=".55"/><feComponentTransfer><feFuncR type="linear" slope=".92"/><feFuncG type="linear" slope=".86"/><feFuncB type="linear" slope=".78"/></feComponentTransfer></filter>`;
  else if (s.fx.hue) f = `<filter id="${k}fx"><feColorMatrix type="hueRotate" values="${s.fx.hue}"/></filter>`;
  if (f) body = `<g filter="url(#${k}fx)">${body}</g>`;
  const halo = rc ? `<radialGradient id="${k}hl"><stop offset="0" stop-color="${rc}" stop-opacity="${s.r >= 3 ? .55 : .3}"/><stop offset="1" stop-color="${rc}" stop-opacity="0"/></radialGradient><circle cx="64" cy="62" r="60" fill="url(#${k}hl)"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128" width="${PX}" height="${PX}"><defs>${f}<filter id="gl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>${halo}${body}</svg>`;
}
function itemArt(id, sz = 40, cls = ""){
  if (!ITEMS[id]) return gi("swap-bag", sz);
  const key = "it:" + id;
  return `<img class="iart${cls ? " " + cls : ""}" data-art="${key}" src="${ras(key, itemSVG(id), PX, PX)}" width="${sz}" height="${sz}" alt="" aria-hidden="true" draggable="false">`;
}

// ---------- герб і герой ----------
const SHIELDS = {
  heater:["Іспанський", "M10 8H90V58Q90 98 50 114Q10 98 10 58Z"],
  round:["Круглий низ", "M10 8H90V68A40 40 0 0 1 10 68Z"],
  kite:["Мигдаль", "M50 4Q90 8 88 42Q82 90 50 116Q18 90 12 42Q10 8 50 4Z"],
  notch:["Турнірний", "M8 8L30 15L50 7L70 15L92 8V60Q92 98 50 114Q8 98 8 60Z"],
  tarch:["Тарч", "M50 6A44 50 0 1 1 49.9 6Z"],
};
const DIVS = {
  plain:["Суцільне", ""], pale:["Навпіл", "M50 0H100V120H50Z"], fess:["Перетин", "M0 60H100V120H0Z"],
  bend:["Скісне", "M0 0H100V18L0 102Z"], quarter:["Чверті", "M50 0H100V60H50ZM0 60H50V120H0Z"], chevron:["Шеврон", "M0 120L0 92L50 46L100 92V120L50 74Z"],
};
const HCUST = Object.assign({}, CUST, {
  raven:"M8 54Q30 38 46 40Q52 22 66 22Q76 22 80 30L96 34L80 38Q78 52 68 60L84 86L66 70L54 90L52 66Q30 66 8 54Z",
  spruce:"M50 4L66 30H58L74 54H62L82 80H54V96H46V80H18L38 54H26L42 30H34Z",
  oak:"M50 6Q60 16 56 24Q70 22 66 36Q80 38 70 52Q84 58 68 66Q74 80 58 76L54 96H46L42 76Q26 80 32 66Q16 58 30 52Q20 38 34 36Q30 22 44 24Q40 16 50 6Z",
});
const CHARGES = [["wolf", "Вовк"], ["raven", "Ворон"], ["spruce", "Смерека"], ["oak", "Дуб"], ["broadsword", "Меч"], ["crossed-swords", "Мечі"], ["war-axe", "Бартка"], ["crown", "Корона"], ["sun", "Сонце"], ["moon", "Місяць"], ["fire", "Полум'я"], ["watchtower", "Вежа"], ["boar", "Вепр"], ["ringing-bell", "Дзвін"], ["anvil", "Ковадло"], ["feather", "Перо"]];
const TINC = [["#9a2a22", "Червлень"], ["#2a4a7a", "Лазур"], ["#2f5a35", "Зелень"], ["#5a2a5a", "Пурпур"], ["#1e1c1a", "Чернь"], ["#6a645a", "Попіл"]];
const METAL = [["#d9a441", "Золото"], ["#d8d8d0", "Срібло"]];
function chargePath(k){ if (HCUST[k]) return `<path d="${HCUST[k]}" transform="translate(24 26) scale(.52)"/>`; const p = GI[k] || ""; return `<g transform="translate(23 25) scale(.105)">${p.replace(/fill="currentColor"/g, "")}</g>`; }
function crestSVG(o, w = 100){
  const id = "cr" + (++IG2), sh = SHIELDS[o.shield || "heater"][1], dv = DIVS[o.div || "plain"][1];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="${w}" height="${w * 1.2}" aria-hidden="true"><defs><clipPath id="${id}"><path d="${sh}"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
<path d="${sh}" fill="#000" opacity=".45" transform="translate(2 3)"/>
<g clip-path="url(#${id})"><rect width="100" height="120" fill="${o.f1}"/>${dv ? `<path d="${dv}" fill="${o.f2}"/>` : ""}<g fill="${o.m}" stroke="#1a1612" stroke-width="${HCUST[o.ch] ? 1.4 : 12}" stroke-opacity=".55">${chargePath(o.ch)}</g><rect width="100" height="120" fill="url(#${id}g)"/></g>
<path d="${sh}" fill="none" stroke="#c8a86a" stroke-width="4"/><path d="${sh}" fill="none" stroke="#5a4628" stroke-width="1.2"/></svg>`;
}
const LOOK0 = {skin:"#d9a882", hair:"#4a2e1a", hs:"short", beard:"short", cloak:"#2a3a5a", shield:"heater", div:"pale", f1:"#2a4a7a", f2:"#1e1c1a", m:"#d8d8d0", ch:"wolf"};
// що надягнуто — те й видно: шолом, обладунок, плащ, зброя, щит
function gearLook(eq){
  const n = (s) => eq && eq[s] ? itemIc(eq[s]) : null, g = {};
  const h = n("helmet"); g.helm = !h ? null : /hood|pilgrim|leather-armor/.test(h) ? (h === "pilgrim-hat" ? "hat" : "cap") : h === "crown" ? "crown" : /black-knight|closed-barbute|visored/.test(h) ? "great" : "nasal";
  const a = n("armor"); g.armor = !a ? "shirt" : /leather|fur/.test(a) ? (a === "fur-shirt" ? "fur" : "leather") : a === "chain-mail" ? "chain" : "plate";
  g.cloak = eq && eq.cloak ? (BY_ID[eq.cloak] && BY_ID[eq.cloak][0] === "#" ? BY_ID[eq.cloak] : "#2a3a5a") : null;
  const w = n("weapon"); g.weap = !w ? null : /axe|halberd/.test(w) ? "axe" : /mace|hammer/.test(w) ? "mace" : /staff|sun|trident/.test(w) ? "staff" : "sword";
  const o = n("offhand"); g.shield = !!o && /shield/.test(o); g.dagger = o === "plain-dagger";
  g.legs = !!n("legs"); g.gloves = !!n("gloves"); g.boots = n("boots") === "metal-boot" ? "metal" : n("boots") ? "leather" : "wrap"; g.belt = !!n("belt");
  return g;
}
function heroSVG(o, g = {}, w = 240, vb = "0 0 240 440"){
  const id = "hr" + (++IG2), skin = o.skin, hc = o.hair, fem = o.fem;
  const tun = {shirt:"#8a7a62", leather:"#6e4826", fur:"#7a5e3e", chain:"#8a9096", plate:"#a8b0b8"}[g.armor || "shirt"];
  const [vx, vy, vw, vh] = vb.split(" ").map(Number);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${w * vh / vw}" aria-hidden="true"><defs><clipPath id="${id}t"><path d="M96 134H144L150 312Q120 320 90 312Z"/></clipPath>
<linearGradient id="${id}sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
<linearGradient id="${id}st" x1="0" x2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".35" stop-color="#9aa4ae"/><stop offset=".6" stop-color="#d0d6dc"/><stop offset="1" stop-color="#4a525a"/></linearGradient>
<pattern id="${id}ch" width="6" height="5" patternUnits="userSpaceOnUse"><path d="M0 2.5a3 2.5 0 0 0 6 0" fill="none" stroke="#2a2e32" stroke-width="1.1" opacity=".55"/></pattern>
<filter id="${id}ds"><feGaussianBlur stdDeviation="4"/></filter></defs>`;
  s += `<ellipse cx="124" cy="426" rx="82" ry="11" fill="#000" opacity=".5" filter="url(#${id}ds)"/>`;
  if (g.cloak) s += `<path d="M68 122Q34 270 40 422L200 422Q206 270 172 122Z" fill="${g.cloak}"/><path d="M120 122L172 122Q206 270 200 422H128Z" fill="#000" opacity=".3"/><path d="M40 422q20 -8 40 0t40 0t40 0t40 0" stroke="#000" stroke-opacity=".3" stroke-width="3" fill="none"/><path d="M86 140Q66 270 70 414" stroke="#fff" stroke-opacity=".08" stroke-width="10" fill="none"/>`;
  // ноги
  const lg = g.legs ? `url(#${id}st)` : "#3a3228";
  s += `<path d="M92 290L88 398H110L116 290Z" fill="${lg}"/><path d="M124 290L130 398H152L148 290Z" fill="${g.legs ? lg : "#2a241e"}"/>${g.legs ? `<path d="M124 290L130 398H152L148 290Z" fill="#000" opacity=".3"/><path d="M90 340h22M128 340h22" stroke="#2a2e32" stroke-width="2.5"/>` : ""}`;
  const bt = g.boots === "metal" ? [`url(#${id}st)`, "#6a727a"] : g.boots === "leather" ? ["#5a3e26", "#3e2a1a"] : ["#7a6a52", "#5a4c3a"];
  s += `<path d="M86 384H112V418H80Q80 402 86 384Z" fill="${bt[0]}"/><path d="M128 384H154Q160 402 160 418H128Z" fill="${bt[1]}"/><path d="M80 418H112M128 418H160" stroke="#1e140c" stroke-width="3"/><path d="M86 386h26M128 386h26" stroke="#000" stroke-opacity=".35" stroke-width="3"/>`;
  // тулуб
  s += fem ? `<path d="M84 128Q120 118 156 128L166 318Q120 330 74 318Z" fill="${tun}"/>` : `<path d="M76 128Q120 116 164 128L170 304Q120 314 70 304Z" fill="${tun}"/>`;
  if (g.armor === "chain" || g.armor === "plate") s += `<path d="M76 128Q120 116 164 128L170 304Q120 314 70 304Z" fill="url(#${id}ch)"/>`;
  if (g.armor === "fur") s += `<path d="M72 296q8 10 16 0t16 0t16 0t16 0t16 0t16 0t14 0" stroke="#4a3622" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M80 130q40 -12 80 0" stroke="#c8b08a" stroke-width="10" stroke-linecap="round" fill="none"/>`;
  if (g.armor === "leather") s += `<path d="M78 170h84M76 214h88M74 258h92" stroke="#2a180a" stroke-width="2" opacity=".5"/>`;
  // накидка з гербом
  s += `<g clip-path="url(#${id}t)"><rect x="80" y="120" width="80" height="210" fill="${o.f1}"/>${o.div && o.div !== "plain" ? `<g transform="translate(90 130) scale(.6 1.6)"><path d="${DIVS[o.div][1]}" fill="${o.f2}"/></g>` : ""}<g transform="translate(80 158) scale(.8)" fill="${o.m}">${chargePath(o.ch)}</g><rect x="80" y="120" width="80" height="210" fill="url(#${id}sh)"/></g>`;
  s += `<path d="M96 134H144L150 312Q120 320 90 312Z" fill="none" stroke="${o.m}" stroke-width="2" stroke-opacity=".8"/>`;
  if (g.armor === "plate") s += `<path d="M64 142Q64 116 98 114L100 150Q80 156 64 142Z" fill="url(#${id}st)" stroke="#2a2e32" stroke-width="2"/><path d="M176 142Q176 116 142 114L140 150Q160 156 176 142Z" fill="url(#${id}st)" stroke="#2a2e32" stroke-width="2"/>`;
  s += `<rect x="72" y="238" width="96" height="11" fill="${g.belt ? "#3a2412" : "#5a4632"}"/>${g.belt ? `<rect x="113" y="235" width="14" height="17" rx="2" fill="none" stroke="#d9a441" stroke-width="3"/><circle cx="96" cy="243.5" r="2" fill="#d9a441"/><circle cx="144" cy="243.5" r="2" fill="#d9a441"/>` : ""}`;
  // права рука і зброя
  s += `<path d="M78 132Q60 150 62 232L78 234Q80 172 92 150Z" fill="${tun}"/><path d="M78 132Q60 150 62 232L70 233Q70 170 84 140Z" fill="#fff" opacity=".1"/>`;
  if (g.weap === "sword") s += `<path d="M69 244L65 384" stroke="url(#${id}st)" stroke-width="8" stroke-linecap="round"/><path d="M71 246L68 380" stroke="#fff" stroke-opacity=".6" stroke-width="1.5"/><path d="M54 240L86 242" stroke="#b08a3a" stroke-width="6" stroke-linecap="round"/><path d="M70 238V222" stroke="#4a3220" stroke-width="6"/><circle cx="70" cy="219" r="4.5" fill="#d9a441"/>`;
  if (g.weap === "axe") s += `<path d="M70 210L66 392" stroke="#5a3a1e" stroke-width="7" stroke-linecap="round"/><path d="M64 360Q40 352 34 336Q52 340 66 334Z" fill="url(#${id}st)" stroke="#1e1a16" stroke-width="2"/><path d="M68 356Q92 364 100 388Q80 380 66 376Z" fill="url(#${id}st)" stroke="#1e1a16" stroke-width="2"/>`;
  if (g.weap === "mace") s += `<path d="M70 226L67 372" stroke="#5a3a1e" stroke-width="7" stroke-linecap="round"/><circle cx="67" cy="378" r="14" fill="url(#${id}st)" stroke="#1e1a16" stroke-width="2"/><path d="M67 360v-6M67 396v6M49 378h-6M85 378h6M55 366l-4 -4M79 366l4 -4M55 390l-4 4M79 390l4 4" stroke="#4a525a" stroke-width="4" stroke-linecap="round"/>`;
  if (g.weap === "staff") s += `<path d="M70 120L66 410" stroke="#6a4a26" stroke-width="7" stroke-linecap="round"/><circle cx="70" cy="114" r="9" fill="#ffd27a" opacity=".9"/><circle cx="70" cy="114" r="18" fill="#ffd27a" opacity=".25"/>`;
  s += g.gloves ? `<circle cx="70" cy="238" r="9" fill="#4a3220"/><path d="M62 232h16" stroke="#2a1a0e" stroke-width="3"/>` : `<circle cx="70" cy="238" r="8" fill="${skin}"/>`;
  // плечі плаща
  if (g.cloak) s += `<path d="M64 140Q66 118 96 116Q90 128 92 148Q78 150 64 140Z" fill="${g.cloak}"/><path d="M176 140Q174 118 144 116Q150 128 148 148Q162 150 176 140Z" fill="${g.cloak}"/><path d="M176 140Q174 118 144 116Q150 128 148 148Q162 150 176 140Z" fill="#000" opacity=".25"/>`;
  // шия, голова
  s += `<path d="M110 98H130V124H110Z" fill="${skin}"/><path d="M120 98H130V124H120Z" fill="#000" opacity=".18"/>`;
  const great = g.helm === "great";
  if (!great && (o.hs === "long" || o.hs === "tied")) s += `<path d="M94 70Q90 110 98 132L110 128L104 76ZM146 70Q150 110 142 132L130 128L136 76Z" fill="${hc}"/>`;
  if (!g.helm && o.hs === "tied") s += `<ellipse cx="122" cy="44" rx="11" ry="8" fill="${hc}"/>`;
  s += `<ellipse cx="120" cy="76" rx="${fem ? 22 : 24}" ry="28" fill="${skin}"/><path d="M120 48A24 28 0 0 1 120 104Z" fill="#000" opacity=".14"/>`;
  s += `<path d="M108 74h8M126 74h8" stroke="#2a1d12" stroke-width="2.6" stroke-linecap="round"/><path d="M106 68l10 -2M124 66l10 2" stroke="${hc}" stroke-width="2.4" stroke-linecap="round"/><path d="M120 76l-2 10h4" stroke="#000" stroke-opacity=".3" stroke-width="1.6" fill="none"/>`;
  s += fem ? `<path d="M113 93q7 4 14 0" stroke="#8a3a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : `<path d="M113 94h14" stroke="#5a2a1a" stroke-width="2" stroke-linecap="round"/>`;
  if (o.hs !== "bald" && !g.helm) s += `<path d="M95 72Q94 44 120 44Q147 44 146 72Q140 56 124 58Q110 56 104 62Q99 64 95 72Z" fill="${hc}"/>`;
  if (o.beard === "short") s += `<path d="M97 82Q99 108 120 110Q141 108 143 82Q138 99 120 100Q102 99 97 82Z" fill="${hc}"/>`;
  if (o.beard === "full") s += `<path d="M96 80Q96 120 120 126Q144 120 144 80Q138 99 120 100Q102 99 96 80Z" fill="${hc}"/><path d="M112 92q8 -4 16 0" stroke="${hc}" stroke-width="4"/>`;
  if (o.beard === "moust") s += `<path d="M108 91q12 -6 24 0q-4 6 -12 2q-8 4 -12 -2z" fill="${hc}"/>`;
  // шолом
  if (g.helm === "nasal") s += `<path d="M94 72Q94 40 120 40Q146 40 146 72H94Z" fill="url(#${id}st)" stroke="#1e2226" stroke-width="2.5"/><path d="M92 70H148" stroke="#5a626a" stroke-width="5"/><path d="M117 70h6v18h-6z" fill="url(#${id}st)" stroke="#1e2226" stroke-width="1.5"/>`;
  if (great) s += `<path d="M92 104V66Q92 40 120 40Q148 40 148 66V104Q120 112 92 104Z" fill="url(#${id}st)" stroke="#1e2226" stroke-width="3"/><path d="M96 74H144" stroke="#0e1012" stroke-width="5"/><path d="M120 44V104" stroke="#000" stroke-opacity=".25" stroke-width="2"/><g fill="#0e1012">${[0, 1, 2, 3].map(i => `<circle cx="${130 + (i % 2) * 6}" cy="${86 + (i >> 1) * 7}" r="1.6"/>`).join("")}</g>`;
  if (g.helm === "cap") s += `<path d="M94 70Q94 42 120 42Q146 42 146 70Q120 62 94 70Z" fill="#6e4826" stroke="#2a180a" stroke-width="2"/>`;
  if (g.helm === "hat") s += `<ellipse cx="120" cy="58" rx="40" ry="8" fill="#2a2218"/><path d="M100 58Q100 30 120 30Q140 30 140 58Z" fill="#3a2e20"/><path d="M100 52H140" stroke="#9a2a22" stroke-width="5"/><path d="M138 48q14 -20 6 -34" stroke="#c8b08a" stroke-width="3" fill="none"/>`;
  if (g.helm === "crown") s += `<path d="M98 56L100 38L110 48L120 34L130 48L140 38L142 56Z" fill="#e8b84a" stroke="#6a4a10" stroke-width="2"/>`;
  s += `<circle cx="120" cy="132" r="5" fill="#d9a441"/>`;
  // щит із гербом — лише коли є щит
  if (g.shield) s += `<g transform="translate(140 152) scale(.82)">${crestSVG(o, 96).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g>`;
  else s += `<path d="M162 132Q180 150 178 232L162 234Q160 172 148 150Z" fill="${tun}"/>${g.gloves ? `<circle cx="170" cy="238" r="9" fill="#4a3220"/>` : `<circle cx="170" cy="238" r="8" fill="${skin}"/>`}${g.dagger ? `<path d="M171 246L173 296" stroke="url(#${id}st)" stroke-width="5" stroke-linecap="round"/><path d="M162 245h18" stroke="#8a6a2a" stroke-width="4"/>` : ""}`;
  return s + `</svg>`;
}
function heroLook(st = S){ if (st && st.look) return Object.assign({}, LOOK0, st.look); const c = typeof CRESTS !== "undefined" ? CRESTS[(st && st.crest) || 0] || CRESTS[0] : null; return Object.assign({}, LOOK0, c ? {f1:c[0], f2:c[1]} : {}); }
function heroArt(w = 170, st = S){
  const o = heroLook(st), g = gearLook(st && st.equip), key = "hero:" + hsh(JSON.stringify([o, g])), h = Math.round(w * 440 / 240);
  return `<img class="hart" data-art="${key}" src="${ras(key, heroSVG(o, g), 360, 660)}" width="${w}" height="${h}" alt="" aria-hidden="true" draggable="false">`;
}

return {itemArt, itemSVG, heroArt, heroSVG, crestSVG, heroLook, gearLook, SHIELDS, DIVS, CHARGES, TINC, METAL, LOOK0, ras};
})();
const itemArt = ART.itemArt, heroArt = ART.heroArt;
