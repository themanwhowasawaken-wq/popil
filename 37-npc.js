/* ============ жителі: намальовані фігури замість кружечків з літерами ============ */
// Кожен житель збирається з тієї ж «ляльки», що й герой: зовнішність, одяг, знаряддя.
// o — обличчя й колір одягу, g — що надіто, x — що в руках і на голові (малюнки поверх фігури).
const NX = {
  apron:  '<path d="M92 156H148L156 332H84Z" fill="#8a6a40" stroke="#3a2812" stroke-width="2.5"/><path d="M92 156L98 128M148 156L142 128" stroke="#3a2812" stroke-width="5"/><path d="M100 250h40v32h-40z" fill="#6a4e2c" stroke="#3a2812" stroke-width="2"/>',
  apronW: '<path d="M92 170H148L158 334H82Z" fill="#ece6d4" stroke="#8a826a" stroke-width="2.5"/><path d="M92 170L98 136M148 170L142 136" stroke="#8a826a" stroke-width="4"/>',
  hammer: '<path d="M70 236L64 340" stroke="#5a3a1e" stroke-width="8" stroke-linecap="round"/><rect x="40" y="212" width="48" height="26" rx="4" fill="#8a929a" stroke="#1e1a16" stroke-width="2.5"/><rect x="40" y="212" width="48" height="8" rx="3" fill="#fff" opacity=".25"/>',
  tongs:  '<path d="M70 232L52 330M72 232L88 330" stroke="#6a727a" stroke-width="5" stroke-linecap="round"/>',
  basket: '<path d="M150 244Q148 294 174 304Q200 294 198 244Z" fill="#a8803e" stroke="#4a3210" stroke-width="2.5"/><path d="M152 262h44M152 280h44" stroke="#6a4a1a" stroke-width="2"/><path d="M152 244Q174 214 196 244" fill="none" stroke="#4a3210" stroke-width="4"/><circle cx="164" cy="240" r="7" fill="#7ab05a"/><circle cx="178" cy="236" r="7" fill="#5a9a4a"/><circle cx="190" cy="241" r="6" fill="#c8c84a"/>',
  sack:   '<path d="M148 246Q142 296 172 306Q202 296 194 246Q172 236 148 246Z" fill="#8a6a3a" stroke="#3a2812" stroke-width="2.5"/><path d="M158 246Q172 232 184 246" fill="none" stroke="#3a2812" stroke-width="4"/><path d="M160 262h24" stroke="#5a4222" stroke-width="2"/>',
  pole:   '<path d="M184 70L176 420" stroke="#6a4a26" stroke-width="7" stroke-linecap="round"/><path d="M176 420L170 432" stroke="#6a4a26" stroke-width="7" stroke-linecap="round"/>',
  rod:    '<path d="M180 250L214 40" stroke="#6a4a26" stroke-width="4" stroke-linecap="round"/><path d="M214 40Q226 120 216 220" stroke="#d8d8cc" stroke-width="1.4" fill="none"/><ellipse cx="216" cy="226" rx="7" ry="4" fill="#6a9ab0"/>',
  lute:   '<ellipse cx="152" cy="262" rx="27" ry="34" fill="#8a5a2a" stroke="#3a2210" stroke-width="2.5" transform="rotate(-22 152 262)"/><ellipse cx="152" cy="262" rx="8" ry="9" fill="#2a1608" transform="rotate(-22 152 262)"/><path d="M166 232L198 160" stroke="#5a3a1e" stroke-width="7" stroke-linecap="round"/><path d="M162 244L194 168M168 242L198 170" stroke="#e8dcb0" stroke-width="1"/>',
  banner: '<path d="M186 60L180 420" stroke="#6a4a26" stroke-width="6"/><path d="M186 64L232 80L186 116Z" fill="#e8d8a8" stroke="#2a2216" stroke-width="2"/><path d="M186 64L232 80L186 90Z" fill="#1e1c1a"/>',
  cross:  '<path d="M72 150L66 420" stroke="#6a4a26" stroke-width="6" stroke-linecap="round"/><path d="M52 176H92M72 160V206" stroke="#d9a441" stroke-width="6" stroke-linecap="round"/>',
  stick:  '<path d="M68 214L60 420" stroke="#6a4a26" stroke-width="7" stroke-linecap="round"/><path d="M68 214q-8 -8 -2 -14" stroke="#6a4a26" stroke-width="6" fill="none" stroke-linecap="round"/>',
  barrel: '<rect x="142" y="256" width="52" height="54" rx="9" fill="#7a5426" stroke="#2a1a0a" stroke-width="2.5"/><path d="M142 272h52M142 294h52" stroke="#2a1a0a" stroke-width="3"/>',
  mugs:   '<path d="M150 252h22v24h-22z" fill="#c8a860" stroke="#4a3210" stroke-width="2"/><path d="M172 258q10 0 10 9t-10 9" fill="none" stroke="#4a3210" stroke-width="3"/><path d="M150 252q5 -9 11 -3t11 -6" fill="#f4ecd4" stroke="#8a826a" stroke-width="1.5"/>',
  scarf:  c => `<path d="M92 76Q90 38 120 36Q150 38 148 76Q140 56 120 56Q100 56 92 76Z" fill="${c}"/><path d="M96 74Q92 108 104 124L112 112Q100 100 102 78ZM144 74Q148 108 136 124L128 112Q140 100 138 78Z" fill="${c}"/><path d="M92 76Q120 64 148 76" stroke="#000" stroke-opacity=".25" stroke-width="2" fill="none"/>`,
  cowl:   c => `<path d="M84 110Q80 36 120 32Q160 36 156 110L144 128Q120 118 96 128Z" fill="${c}"/><ellipse cx="120" cy="82" rx="22" ry="26" fill="#d9b690"/><path d="M108 78h8M126 78h8" stroke="#2a1d12" stroke-width="2.6" stroke-linecap="round"/><path d="M114 98h12" stroke="#5a2a1a" stroke-width="2" stroke-linecap="round"/><path d="M98 96Q120 134 142 96Q130 112 120 112Q110 112 98 96Z" fill="#d8d4cc"/>`,
  mage:   c => `<ellipse cx="120" cy="58" rx="42" ry="9" fill="${c}"/><path d="M94 58Q108 28 124 -6Q128 30 146 58Z" fill="${c}"/><path d="M94 58Q108 28 124 -6" stroke="#fff" stroke-opacity=".2" stroke-width="3" fill="none"/><path d="M98 54Q120 62 144 54" stroke="#d9a441" stroke-width="4" fill="none"/>`,
  wreath: '<g><circle cx="94" cy="56" r="5" fill="#e8a8c8"/><circle cx="104" cy="46" r="5" fill="#f4e8a0"/><circle cx="118" cy="42" r="5" fill="#fff"/><circle cx="134" cy="44" r="5" fill="#e8a8c8"/><circle cx="146" cy="54" r="5" fill="#f4e8a0"/><path d="M92 60Q120 36 148 60" stroke="#5a9a4a" stroke-width="3" fill="none"/></g>',
  fur:    '<path d="M92 50Q92 22 120 22Q148 22 148 50Q120 42 92 50Z" fill="#4a3a2a"/><path d="M90 52q6 6 12 0t12 0t12 0t12 0t10 0" stroke="#2a2016" stroke-width="5" fill="none" stroke-linecap="round"/>',
  fish:   '<path d="M154 262q14 -10 28 0q-14 10 -28 0z" fill="#8aa8b8" stroke="#2a3a44" stroke-width="2"/><path d="M182 262l10 -8v16z" fill="#8aa8b8" stroke="#2a3a44" stroke-width="2"/>',
  book:   '<rect x="146" y="236" width="40" height="52" rx="3" fill="#6a2a22" stroke="#2a1008" stroke-width="2.5"/><path d="M152 244h28M152 256h28" stroke="#d9a441" stroke-width="2"/>',
  sabre:  '<path d="M69 240Q80 300 62 382" stroke="url(#st)" stroke-width="8" fill="none" stroke-linecap="round"/>'
};
const NPC_LOOK = {
  ostap:    {o:{skin:"#c8967a", hair:"#3a2a1e", hs:"bald", beard:"full", f1:"#5a4a38"}, g:{armor:"leather", gloves:true, belt:true, legs:false, boots:"leather"}, x:["apron", "hammer"]},
  healer:   {o:{fem:true, skin:"#e6bf9e", hair:"#7a5a3a", hs:"long", beard:"none", f1:"#6a8a5a"}, g:{armor:"shirt", cloak:"#e8e0cc", boots:"wrap"}, x:["basket"]},
  myroslava:{o:{fem:true, skin:"#e6bf9e", hair:"#8a4a22", hs:"tied", beard:"none", f1:"#8a3a2a"}, g:{armor:"shirt", boots:"wrap"}, x:["apronW", "mugs"]},
  stakh:    {o:{skin:"#c8a07c", hair:"#6a5a42", hs:"short", beard:"full", f1:"#4a5a3a"}, g:{armor:"fur", helm:"hat", boots:"leather", belt:true}, x:["pole"]},
  yarema:   {o:{skin:"#c8967a", hair:"#2a1e16", hs:"short", beard:"short", f1:"#7a2a22"}, g:{armor:"chain", helm:"nasal", weap:"sword", shield:true, cloak:"#5a2a22", legs:true, gloves:true, belt:true, boots:"leather"}, x:[]},
  sutler:   {o:{skin:"#d4aa86", hair:"#4a3a28", hs:"short", beard:"moust", f1:"#6a5a3a"}, g:{armor:"leather", helm:"hat", boots:"leather", belt:true}, x:["sack"]},
  ulf:      {o:{skin:"#c8967a", hair:"#8a8a8a", hs:"short", beard:"short", f1:"#2a3a5a"}, g:{armor:"plate", helm:"great", weap:"sword", shield:true, cloak:"#2a3a5a", legs:true, gloves:true, belt:true, boots:"metal"}, x:[]},
  isak:     {o:{skin:"#d4aa86", hair:"#2a1e16", hs:"short", beard:"short", f1:"#6a2a5a"}, g:{armor:"shirt", helm:"hat", belt:true, boots:"leather", cloak:"#3a1a3a"}, x:["sack"]},
  todor:    {o:{skin:"#c8a07c", hair:"#a8a8a0", hs:"short", beard:"short", f1:"#5a4a2a"}, g:{armor:"leather", helm:"cap", boots:"leather", gloves:true}, x:["apron", "tongs"]},
  safar:    {o:{skin:"#e6c8a8", hair:"#d8d8d6", hs:"long", beard:"full", f1:"#3a4a7a"}, g:{armor:"shirt", cloak:"#2a3a6a", weap:"staff", boots:"leather"}, x:["mage:#2a3a6a"]},
  kotr:     {o:{skin:"#d4aa86", hair:"#6a3a22", hs:"short", beard:"moust", f1:"#8a3a22"}, g:{armor:"shirt", helm:"hat", belt:true, boots:"leather"}, x:["sack"]},
  olena:    {o:{fem:true, skin:"#e0b894", hair:"#9a8a7a", hs:"tied", beard:"none", f1:"#5a7a4a"}, g:{armor:"shirt", cloak:"#7a5a3a", boots:"wrap"}, x:["basket"]},
  myron:    {o:{skin:"#c8a07c", hair:"#b8b8b0", hs:"short", beard:"full", f1:"#4a5a6a"}, g:{armor:"shirt", helm:"hat", boots:"leather"}, x:["rod", "fish"]},
  bandura:  {o:{skin:"#d4aa86", hair:"#dcdcd8", hs:"long", beard:"full", f1:"#5a4a3a"}, g:{armor:"shirt", helm:"cap", boots:"wrap"}, x:["lute"]},
  paraska:  {o:{fem:true, skin:"#dcb690", hair:"#8a8a88", hs:"tied", beard:"none", f1:"#6a3a5a"}, g:{armor:"shirt", cloak:"#4a2a4a", boots:"wrap"}, x:["scarf:#a8584a", "basket"]},
  marichka: {o:{fem:true, skin:"#e6bf9e", hair:"#c89a4a", hs:"long", beard:"none", f1:"#6a8a4a"}, g:{armor:"shirt", boots:"wrap"}, x:["wreath", "basket"]},
  yurko:    {o:{skin:"#c8967a", hair:"#2a2018", hs:"short", beard:"full", f1:"#4a3a30"}, g:{armor:"leather", gloves:true, belt:true, boots:"leather"}, x:["apron", "hammer"]},
  ivan:     {o:{skin:"#c8967a", hair:"#3a2a1e", hs:"short", beard:"moust", f1:"#3a4a2a"}, g:{armor:"chain", helm:"cap", weap:"sword", cloak:"#3a4a2a", legs:true, belt:true, boots:"leather"}, x:[]},
  dmytro:   {o:{skin:"#c8967a", hair:"#2a1e16", hs:"long", beard:"moust", f1:"#6a2a22"}, g:{armor:"fur", helm:"hat", weap:"axe", belt:true, boots:"leather", gloves:true}, x:[]},
  bogdan:   {o:{skin:"#c8967a", hair:"#6a6a6a", hs:"short", beard:"short", f1:"#5a2a22"}, g:{armor:"plate", helm:"nasal", weap:"sword", cloak:"#4a1e1a", legs:true, gloves:true, belt:true, boots:"metal"}, x:[]},
  gnat:     {o:{skin:"#d8c4a8", hair:"#1e1a16", hs:"bald", beard:"full", f1:"#3a3a3a"}, g:{armor:"leather", gloves:true, belt:true, boots:"metal"}, x:["apron", "hammer"], s:1.1},
  varlaam:  {o:{skin:"#d9b690", hair:"#d8d4cc", hs:"bald", beard:"full", f1:"#4a3a2a"}, g:{armor:"shirt", boots:"wrap"}, x:["cross", "cowl:#3a2e22"]},
  yavdokha: {o:{fem:true, skin:"#d4ae8c", hair:"#b8b8b4", hs:"tied", beard:"none", f1:"#4a4a3a"}, g:{armor:"shirt", cloak:"#5a4a3a", boots:"wrap"}, x:["scarf:#6a6a5a", "stick"]},
  gordiy:   {o:{skin:"#c8a07c", hair:"#4a3a2a", hs:"short", beard:"full", f1:"#3a4a4a"}, g:{armor:"fur", helm:"hat", boots:"leather", belt:true}, x:["pole"]},
  omelko:   {o:{skin:"#d4aa86", hair:"#a8a89a", hs:"short", beard:"full", f1:"#4a6a4a"}, g:{armor:"shirt", cloak:"#5a6a3a", boots:"wrap"}, x:["cowl:#4a5a30", "basket"]},
  oleksa:   {o:{skin:"#d4aa86", hair:"#6a4a22", hs:"short", beard:"short", f1:"#e8d8a8", f2:"#1e1c1a", div:"pale"}, g:{armor:"leather", helm:"crown", belt:true, boots:"leather"}, x:["banner"]},
  kylyna:   {o:{fem:true, skin:"#e0b894", hair:"#7a3a22", hs:"tied", beard:"none", f1:"#7a4a2a"}, g:{armor:"shirt", belt:true, boots:"wrap"}, x:["apronW", "barrel"]},
  yaropolk: {o:{skin:"#d9b690", hair:"#c89a4a", hs:"short", beard:"short", f1:"#d9b84a", f2:"#f4ecd0", div:"pale"}, g:{armor:"plate", helm:"great", weap:"sword", shield:true, cloak:"#e8d8a8", legs:true, gloves:true, belt:true, boots:"metal"}, x:[]},
  veresk:   {o:{skin:"#c8bcb0", hair:"#1a1a1e", hs:"long", beard:"short", f1:"#2a1a3a", f2:"#12081a", div:"pale", m:"#a8a0c0"}, g:{armor:"plate", helm:"great", weap:"sword", shield:true, cloak:"#1a1226", legs:true, gloves:true, belt:true, boots:"metal"}, x:[]}
};
// запасний вигляд за словами в ролі
function npcLookOf(id){
  if (NPC_LOOK[id]) return NPC_LOOK[id];
  const N = NPCS[id] || {}, r = (N.role || "").toLowerCase();
  if (/коваль|зброяр/.test(r)) return NPC_LOOK.ostap; if (/знахар|травн|цілит/.test(r)) return NPC_LOOK.olena; if (/капітан|сотник|командор|варт/.test(r)) return NPC_LOOK.ivan;
  if (/торгов|купець|маркіт/.test(r)) return NPC_LOOK.isak; if (/маг/.test(r)) return NPC_LOOK.safar; return NPC_LOOK.stakh;
}
function npcSVG(id, vb = "0 0 240 440", w = 240){
  const L = npcLookOf(id), o = Object.assign({}, ART.LOOK0, {div:"plain", ch:"none", f2:"#2a2016", m:"#8a7a5a", shield:"heater", beard:"none", hs:"short"}, L.o);
  o.f2 = L.o.f2 || o.f1; if (!L.o.div) o.div = "plain";
  let s = ART.heroSVG(o, L.g || {}, w, vb);
  const ex = (L.x || []).map(k => { const [n, arg] = k.split(":"); const v = NX[n]; return typeof v === "function" ? v(arg) : v || ""; }).join("");
  return s.replace(/<\/svg>$/, ex.replace(/url\(#st\)/g, "#9aa4ae") + "</svg>");
}
function npcArt(id, w = 46, cls = "nfig"){
  const sc = (npcLookOf(id).s || 1), key = "npc:" + id, h = Math.round(w * 440 / 240 * sc);
  return `<img class="${cls}" data-art="${key}" src="${ART.ras(key, npcSVG(id), 300, 550)}" width="${Math.round(w * sc)}" height="${h}" alt="" aria-hidden="true" draggable="false">`;
}
function npcPortrait(id, px = 64){
  const key = "npcp:" + id;
  return `<img class="nport" data-art="${key}" src="${ART.ras(key, npcSVG(id, "56 14 128 150", 256), 256, 300)}" width="${px}" height="${Math.round(px * 150 / 128)}" alt="" aria-hidden="true" draggable="false">`;
}
