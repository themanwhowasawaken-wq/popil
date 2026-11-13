/* ============ нові наземні краї: вміння ворогів, вигляд жителів, споруди, сцени ============ */
Object.assign(ABIL, {
  // Крижані Пустки
  ice_wolf:["howl","bleed"], mammoth:["charge","stunhit"], snow_witch:["weaken","blind"], frost_giant:["stunhit","sunder"], gob_digger:["bleed"],
  gob_shaman:["weaken"], gob_sapper:["burn"], troglodyte:["stunhit"], ice_drake:["pierce","fear"], wolf_rider:["charge","ambush"], jotun:["stunhit","enrage"], gob_king:["howl","sunder"],
  // Дике Поле
  steppe_bandit:["ambush","bleed"], centaur:["pierce","charge"], stone_baba:["thorns","stunhit"], kurgan_dead:["rise","sunder"], steppe_wolf:["howl"], tarpan:["charge","stunhit"],
  babai:["fear","weaken"], steppe_witch:["blind","weaken"], gorynych:["burn","multihit","enrage"],
  // Затоплене узбережжя
  coast_drowned:["drag"], mermaid:["weaken","drag"], siren:["fear","weaken"], giant_crab:["pierce","thorns"], sea_serpent:["ambush","drag"], ghost_pirate:["phase","bleed"],
  kraken_tentacle:["drag","stunhit"], flotilla_captain:["sunder","howl"], kraken:["drag","multihit","enrage"],
  // Піски Забутих Царів
  mummy:["weaken","burn"], jackal_priest:["weaken","heal_low"], scarab_swarm:["split","venom"], sand_worm:["ambush","stunhit"], djinn:["burn","phase"], lamia:["multihit","venom"],
  ghoul:["bleed","venom"], dust_devil:["blind","phase"], sphinx:["blind","spellward","enrage"], lich_king:["fear","spellward"],
});

/* ---------- як виглядають жителі ---------- */
Object.assign(NPC_LOOK, {
  ratmir:  {o:{skin:"#d4aa86", hair:"#c8b898", hs:"long", beard:"full", f1:"#4a5a6a"}, g:{armor:"fur", helm:"cap", weap:"axe", cloak:"#cfd8de", belt:true, boots:"leather", gloves:true}, x:[]},
  brane:   {o:{skin:"#c8967a", hair:"#8a8a88", hs:"bald", beard:"full", f1:"#3a3a3a"}, g:{armor:"fur", gloves:true, belt:true, boots:"leather"}, x:["apron", "hammer"], s:1.1},
  borko:   {o:{skin:"#c8a07c", hair:"#6a5a4a", hs:"short", beard:"full", f1:"#6a4a2a"}, g:{armor:"fur", helm:"hat", boots:"leather", belt:true}, x:["sack"]},
  pylyp:   {o:{skin:"#c8967a", hair:"#2a2218", hs:"bald", beard:"moust", f1:"#a82a22"}, g:{armor:"chain", helm:"cap", weap:"sword", cloak:"#a82a22", legs:true, belt:true, boots:"leather"}, x:[]},
  luka:    {o:{skin:"#d4aa86", hair:"#3a2a1e", hs:"short", beard:"short", f1:"#3a3a3a"}, g:{armor:"leather", gloves:true, belt:true, boots:"leather"}, x:["apron", "tongs"]},
  darka:   {o:{fem:true, skin:"#e0b894", hair:"#7a3a22", hs:"tied", beard:"none", f1:"#a8584a"}, g:{armor:"shirt", belt:true, boots:"wrap"}, x:["apronW", "mugs"]},
  sydir:   {o:{skin:"#c8a07c", hair:"#aaa89a", hs:"short", beard:"full", f1:"#3a5a6a"}, g:{armor:"leather", helm:"hat", belt:true, boots:"leather", cloak:"#2a3a4a"}, x:["pole"]},
  timish:  {o:{skin:"#c8967a", hair:"#4a3a2a", hs:"short", beard:"short", f1:"#4a4a3a"}, g:{armor:"leather", gloves:true, belt:true, boots:"leather"}, x:["apron", "hammer"], s:1.05},
  yusuf:   {o:{skin:"#b88a62", hair:"#1a1410", hs:"short", beard:"full", f1:"#e8d8a8", f2:"#8a6a2a"}, g:{armor:"shirt", helm:"hat", cloak:"#d8c898", belt:true, boots:"wrap"}, x:["stick"]},
  zara:    {o:{fem:true, skin:"#b88a62", hair:"#1a1410", hs:"long", beard:"none", f1:"#6a8a9a"}, g:{armor:"shirt", cloak:"#a8b8a0", boots:"wrap"}, x:["scarf:#c8a868", "basket"]},
  leontiy: {o:{skin:"#d4aa86", hair:"#a8a89a", hs:"short", beard:"full", f1:"#6a5a3a"}, g:{armor:"shirt", helm:"hat", cloak:"#7a6a4a", belt:true, boots:"leather"}, x:["sack"]},
});

/* ---------- сцени: біоми для зображення дерев і фону ---------- */
Object.assign(Z_BIO, {
  ice:{line:"pine", edge:{pine:11}, mid:{rock:7, pine:2}, fg:"pine"},
  steppe:{line:null, edge:{bush:3}, mid:{rock:5, bush:4}, fg:null},
  coast:{line:null, edge:{rock:5, bush:2}, mid:{rock:5, reeds:3}, fg:null},
  desert:{line:null, edge:{rock:4, dead:2}, mid:{rock:4, bush:2}, fg:null},
});

/* ---------- нові споруди ---------- */
const SHDW = (x, y, rx, ry = 8, o = .3) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}"/>`;
const rr = (r, a, b) => a + r() * (b - a);
Object.assign(STRUCT, {
  mammoth_bones:(r) => { const a = []; const x = 380 + r() * 120, y = 300 + r() * 60;
    let s = SHDW(x, y + 2, 120, 12, .25);
    for (let i = -5; i <= 5; i++){ const rx = x + i * 16, h = 60 - Math.abs(i) * 6; s += `<path d="M${rx} ${y}q${i * 3} -${h} ${-i * 2 + 6} -${h + 12}" fill="none" stroke="#e8e2d0" stroke-width="5" stroke-linecap="round"/>`; }
    s += `<path d="M${x - 60} ${y - 4}q-40 -30 -10 -62M${x + 60} ${y - 4}q40 -30 10 -62" fill="none" stroke="#f2ecd8" stroke-width="9" stroke-linecap="round"/>`;
    a.push({y:y + 4, s}); return a; },
  witch_hut:(r) => [{y:250, s:`${SHDW(460, 252, 80, 10)}<path d="M400 250v-56h120v56z" fill="#4a3a2c"/><path d="M386 196l74-62 74 62z" fill="#cfd8de"/><path d="M386 196l74-62 74 62" fill="none" stroke="#3a2c20" stroke-width="5" stroke-linejoin="round"/><path d="M440 250v-34h30v34z" fill="#1a1410"/><rect x="480" y="214" width="20" height="18" fill="#8ae0ff" opacity=".8"/><path d="M508 140v-34h14v38z" fill="#5a5a60"/><path d="M366 252q-14 -30 -2 -52M552 252q14 -28 4 -50" stroke="#9fb0bb" stroke-width="6" fill="none"/>`}],
  burrows:(r) => { const a = []; for (const [x, y, k] of [[200, 250, 1.2], [480, 220, 1.5], [760, 280, 1]]) a.push({y, s:`${SHDW(x, y + 2, 60 * k, 8)}<path d="M${x - 56 * k} ${y}q${56 * k} -${70 * k} ${112 * k} 0z" fill="#6a665c"/><path d="M${x - 24 * k} ${y}q${24 * k} -${44 * k} ${48 * k} 0z" fill="#0d0c0b"/><path d="M${x - 52 * k} ${y - 6 * k}q${10 * k} -${22 * k} ${28 * k} -${34 * k}" stroke="#e8f0f6" stroke-width="5" fill="none"/>`}); return a; },
  ice_cave:(r) => [{y:240, s:`${SHDW(470, 242, 190, 12)}<path d="M290 240q30 -170 180 -190q150 20 180 190z" fill="#7aa8c8"/><path d="M290 240q30 -170 180 -190" fill="none" stroke="#e8f4ff" stroke-width="6"/><path d="M400 240v-70a70 70 0 0 1 140 0v70z" fill="#0a1018"/><path d="M420 170l12 30M470 150l-6 34M510 168l-10 28" stroke="#cfe8ff" stroke-width="4"/><path d="M330 150l30 -40M580 130l20 -30" stroke="#fff" stroke-width="4"/>`}],
  steppe_inn:(r) => [{y:250, s:`${SHDW(460, 252, 150, 12)}<path d="M340 250v-76h240v76z" fill="#d8cca8"/><path d="M324 176l136 -66 136 66z" fill="#a8883a"/><path d="M324 176l136 -66 136 66" fill="none" stroke="#6a4a20" stroke-width="5"/><path d="M430 250v-50h50v50z" fill="#3a2a1a"/><rect x="360" y="196" width="40" height="30" fill="#e8c46a" opacity=".85"/><rect x="520" y="196" width="40" height="30" fill="#e8c46a" opacity=".85"/><path d="M600 252v-60M590 196h36" stroke="#5a3a1a" stroke-width="6"/><circle cx="608" cy="206" r="9" fill="#8a2a22"/>`}],
  horse_bones:(r) => { const a = []; for (let i = 0; i < 5; i++){ const x = rr(r, 100, 800), y = rr(r, 180, 500); a.push({y, s:`<path d="M${x - 22} ${y}q12 -16 24 -4q12 -14 24 0M${x - 22} ${y}l-6 12M${x + 24} ${y}l6 12M${x} ${y - 4}l-2 14M${x + 12} ${y - 4}l1 14" stroke="#ece4d0" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x + 26} ${y - 2}q10 -4 16 4l-6 8z" fill="#ece4d0"/>`}); } return a; },
  stone_babas:(r) => { const a = []; for (const [x, y] of [[180, 220], [420, 190], [700, 240], [300, 440], [620, 460], [820, 380]]){ const k = rr(r, .8, 1.2); a.push({y, s:`${SHDW(x, y + 2, 20 * k, 5)}<path d="M${x - 14 * k} ${y}q-2 -${34 * k} 4 -${42 * k}q${10 * k} -${10 * k} ${20 * k} 0q${4 * k} ${8 * k} 2 ${42 * k}z" fill="#8a8a7a"/><path d="M${x - 14 * k} ${y}q-2 -${34 * k} 4 -${42 * k}" fill="none" stroke="#a8a898" stroke-width="3"/><circle cx="${x}" cy="${y - 36 * k}" r="${7 * k}" fill="#9a9a8a"/><path d="M${x - 5 * k} ${y - 38 * k}h${3 * k}M${x + 3 * k} ${y - 38 * k}h${3 * k}M${x - 3 * k} ${y - 31 * k}h${7 * k}" stroke="#3a3a30" stroke-width="1.8"/>`}); } return a; },
  yurts:(r) => { const a = []; for (const [x, y] of [[180, 230], [440, 200], [700, 250], [300, 450], [620, 460]]){ const k = rr(r, .9, 1.2); a.push({y, s:`${SHDW(x, y + 2, 46 * k, 8)}<path d="M${x - 44 * k} ${y}v-${26 * k}q${44 * k} -${44 * k} ${88 * k} 0v${26 * k}z" fill="#d8cca8"/><path d="M${x - 44 * k} ${y - 26 * k}q${44 * k} -${44 * k} ${88 * k} 0" fill="none" stroke="#8a6a3a" stroke-width="3"/><path d="M${x - 8 * k} ${y}v-${22 * k}h${16 * k}v${22 * k}z" fill="#3a2a1a"/><path d="M${x} ${y - 44 * k}v-${16 * k}" stroke="#4a3a2a" stroke-width="3"/>`}); } return a; },
  steppe_hut:(r) => [{y:260, s:`${SHDW(470, 262, 90, 10)}<path d="M410 260v-50h120v50z" fill="#8a7a58"/><path d="M396 212l74 -46 74 46z" fill="#a8943a"/><path d="M440 260v-32h26v32z" fill="#1a1410"/><path d="M486 232h30v18h-30z" fill="#9aff6a" opacity=".55"/><path d="M390 262q-20 -10 -30 -40M552 262q22 -8 30 -44" stroke="#6a8a3a" stroke-width="4" fill="none"/>`}],
  fire_mountain:(r) => [{y:260, s:`${SHDW(460, 264, 260, 14, .35)}<path d="M200 260l140 -170q120 -50 240 0l120 170z" fill="#4a3a34"/><path d="M340 90q120 -50 240 0l-30 30q-90 -30 -180 0z" fill="#2a1e1a"/><path d="M420 90q40 -14 80 0l-14 -24q-26 -8 -52 0z" fill="#ff5a1a"/><path d="M450 76q10 -30 0 -50q22 18 18 50z" fill="#ffb04a" opacity=".85"/><path d="M380 260v-60M460 260v-90M540 260v-50" stroke="#ff7a2a" stroke-width="3" opacity=".6"/><path d="M380 100q-30 -30 -10 -62M560 96q30 -30 14 -60" stroke="#7a6a64" stroke-width="10" fill="none" opacity=".4"/>`}],
  pier:(r) => [{y:300, s:`<path d="M600 290h300v18h-300z" fill="#6a4a2a"/><path d="M600 290h300" stroke="#8a6a3a" stroke-width="3"/><path d="M620 308v34M680 308v34M740 308v34M800 308v34M860 308v34" stroke="#3a2a1a" stroke-width="7"/><path d="M780 290v-20" stroke="#4a3a2a" stroke-width="4"/>`}, {y:342, s:`<path d="M640 340q30 20 90 0l-8 -24q-40 14 -74 0z" fill="#6a4a30"/><path d="M684 318v-46" stroke="#3a2a1e" stroke-width="4"/><path d="M684 276l30 20h-30z" fill="#d8d0b8"/>`}],
  lighthouse:(r) => [{y:260, s:`${SHDW(460, 264, 70, 10)}<path d="M430 260l12 -170h36l12 170z" fill="#d8d0c0"/><path d="M436 200h48M440 150h40" stroke="#a82a22" stroke-width="12"/><path d="M426 92h68v-12h-68z" fill="#3a3a40"/><path d="M432 80h56v-26h-56z" fill="#6a6a70" opacity=".6"/><path d="M450 54l10 -22 10 22z" fill="#3a3a40"/><path d="M500 214l-40 24M436 150l40 20" stroke="#3a3a30" stroke-width="3" opacity=".6"/>`}],
  reef:(r) => { const a = []; for (let i = 0; i < 7; i++){ const x = rr(r, 360, 880), y = rr(r, 230, 500), k = rr(r, .8, 1.4); a.push({y, s:`${SHDW(x, y + 2, 26 * k, 6, .3)}<path d="M${x - 24 * k} ${y}q4 -${40 * k} ${18 * k} -${34 * k}q${10 * k} -${22 * k} ${26 * k} -${4 * k}q${14 * k} ${14 * k} ${10 * k} ${40 * k}z" fill="#5a6a6a"/><path d="M${x - 14 * k} ${y - 20 * k}q8 -10 16 -2" stroke="#8aa8a0" stroke-width="3" fill="none"/>`}); } return a; },
  crab_holes:(r) => { const a = []; for (let i = 0; i < 6; i++){ const x = rr(r, 100, 780), y = rr(r, 200, 500); a.push({y, s:`<ellipse cx="${x}" cy="${y}" rx="22" ry="8" fill="#2a2418"/><ellipse cx="${x}" cy="${y - 2}" rx="18" ry="5" fill="#0a0806"/><path d="M${x - 16} ${y + 6}l-8 6M${x + 16} ${y + 6}l8 6" stroke="#c85a3a" stroke-width="3" stroke-linecap="round"/>`}); } return a; },
  ship_ribs:(r) => { const a = []; const x = 380 + r() * 160, y = 330 + r() * 50; let s = SHDW(x, y + 4, 180, 12, .3) + `<path d="M${x - 170} ${y}q170 22 340 0" fill="none" stroke="#3a2a1e" stroke-width="9" stroke-linecap="round"/>`;
    for (let i = -6; i <= 6; i++){ const rx = x + i * 26, h = 70 - Math.abs(i) * 5; s += `<path d="M${rx} ${y + 4}q${i * 2} -${h * .6} ${i * -1.6 + 2} -${h}" stroke="#4a3626" stroke-width="6" fill="none" stroke-linecap="round"/>`; }
    s += `<path d="M${x + 60} ${y - 6}v-120M${x + 60} ${y - 120}l60 24" stroke="#3a2a1e" stroke-width="7" fill="none"/>`; a.push({y:y + 6, s}); return a; },
  kraken_pit:(r) => { const a = [{y:300, s:`<ellipse cx="460" cy="300" rx="220" ry="60" fill="#0a0a1a"/><ellipse cx="460" cy="300" rx="170" ry="40" fill="#14123a"/><ellipse cx="460" cy="300" rx="90" ry="22" fill="#05051a"/>`}];
    for (const [x, y, k] of [[300, 296, 1], [620, 298, 1.1], [460, 270, 1.3]]) a.push({y:y + 20, s:`<path d="M${x} ${y}q-${20 * k} -${50 * k} ${10 * k} -${80 * k}q${30 * k} -${24 * k} ${10 * k} -${58 * k}" fill="none" stroke="#5a3a8a" stroke-width="${14 * k}" stroke-linecap="round"/>`}); return a; },
  oasis:(r) => { let s = `<ellipse cx="450" cy="340" rx="170" ry="44" fill="#2a6a7a"/><ellipse cx="450" cy="336" rx="150" ry="36" fill="#3a8a9a"/><ellipse cx="420" cy="332" rx="70" ry="10" fill="#8ad0e0" opacity=".5"/>`;
    const a = [{y:340, s}]; for (const [x, y, k] of [[300, 320, 1.1], [620, 330, 1], [370, 400, .9], [540, 410, 1.1]]) a.push({y:y + 12, s:`<path d="M${x} ${y}q4 -${60 * k} -2 -${100 * k}" stroke="#5a4226" stroke-width="${6 * k}" fill="none"/><path d="M${x} ${y - 100 * k}q-${40 * k} -${6 * k} -${60 * k} ${24 * k}M${x} ${y - 100 * k}q${40 * k} -${6 * k} ${60 * k} ${24 * k}M${x} ${y - 100 * k}q-${12 * k} -${28 * k} -${34 * k} -${34 * k}M${x} ${y - 100 * k}q${12 * k} -${28 * k} ${34 * k} -${34 * k}" stroke="#3a7a2a" stroke-width="${6 * k}" fill="none" stroke-linecap="round"/>`}); return a; },
  dig_site:(r) => { const a = []; for (const [x, y, w] of [[200, 250, 110], [640, 220, 130], [470, 450, 100]]) a.push({y, s:`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * .22}" fill="#8a7040"/><ellipse cx="${x}" cy="${y + 2}" rx="${w * .8}" ry="${w * .17}" fill="#2a1e10"/><path d="M${x - w * .5} ${y - 6}l${w * .2} -${w * .5}M${x + w * .4} ${y - 6}l-${w * .2} -${w * .5}M${x - w * .5} ${y - w * .5}h${w * .7}" stroke="#4a3220" stroke-width="3" fill="none"/>`}); return a; },
  scarab_mound:(r) => [{y:260, s:`${SHDW(460, 264, 200, 14, .3)}<path d="M260 260q200 -200 400 0z" fill="#8a7a4a"/><path d="M260 260q200 -200 400 0" fill="none" stroke="#a8964a" stroke-width="5"/><path d="M430 260v-30q30 -30 60 0v30z" fill="#0a0806"/><path d="M360 220l6 4M400 200l6 4M540 210l6 4M580 240l6 4" stroke="#1a2a2a" stroke-width="5" stroke-linecap="round"/>`}],
  jackal_temple:(r) => [{y:270, s:`${SHDW(470, 272, 220, 14, .3)}<path d="M280 270v-110h380v110z" fill="#b8a070"/><path d="M270 160h400v-18h-400z" fill="#a89060"/><path d="M310 270v-100M380 270v-100M550 270v-100M620 270v-100" stroke="#8a7248" stroke-width="16"/><path d="M430 270v-70h80v70z" fill="#1a140c"/><path d="M440 150l20 -34 20 34zM500 150l20 -34 20 34z" fill="#2a2418"/><path d="M450 130l20 -24 20 24z" fill="#3a3a40"/>`}],
  tomb_door:(r) => [{y:260, s:`${SHDW(460, 264, 140, 12, .3)}<path d="M340 260v-150h240v150z" fill="#a8946a"/><path d="M340 110h240v-18h-240z" fill="#8a7648"/><path d="M420 260v-84a40 40 0 0 1 80 0v84z" fill="#14100a"/><path d="M360 130h200M360 150h200" stroke="#6a5834" stroke-width="3"/><path d="M370 240l10 -40M550 240l-10 -40" stroke="#3a2e18" stroke-width="6"/><circle cx="460" cy="122" r="10" fill="#c9a24a"/>`}],
  worm_pit:(r) => [{y:300, s:`<ellipse cx="460" cy="300" rx="200" ry="52" fill="#8a7440"/><ellipse cx="460" cy="302" rx="150" ry="38" fill="#6a5430"/><ellipse cx="460" cy="304" rx="90" ry="22" fill="#3a2a14"/><ellipse cx="460" cy="306" rx="34" ry="8" fill="#0a0604"/>`}, {y:330, s:`<path d="M470 306q40 -70 10 -110q-20 -28 14 -46" fill="none" stroke="#8a7a5a" stroke-width="20" stroke-linecap="round"/>`}],
  pyramid:(r) => [{y:280, s:`${SHDW(470, 284, 300, 16, .35)}<path d="M200 280l270 -240l270 240z" fill="#c6a864"/><path d="M470 40l270 240h-130z" fill="#a8884a"/><path d="M470 40l270 240" stroke="#6a5028" stroke-width="3"/><path d="M200 280h540" stroke="#6a5028" stroke-width="4"/><path d="M280 230h360M350 170h220M410 110h100" stroke="#a8884a" stroke-width="3" opacity=".55"/><path d="M440 280v-44a30 30 0 0 1 60 0v44z" fill="#0a0806"/>`}],
  sphinx_statue:(r) => [{y:440, s:`${SHDW(440, 446, 140, 12, .3)}<path d="M320 440q-4 -40 20 -48q30 -6 70 -2l60 -4q40 4 40 30l-8 24z" fill="#c8a85a"/><path d="M360 392q-20 -10 -20 -40q8 -38 38 -38q30 0 36 38q0 30 -22 40z" fill="#d8b868"/><path d="M342 340l-12 14M414 340l12 14" stroke="#8a6a2a" stroke-width="10" stroke-linecap="round"/><path d="M360 346q10 -8 26 0" stroke="#3a2a10" stroke-width="3" fill="none"/><path d="M362 316h32v-8h-32z" fill="#3a5a8a"/><path d="M330 440q-16 4 -16 -12" fill="none" stroke="#a8884a" stroke-width="6"/>`}],
});

/* ---------- сцени: багатший вигляд нових країв ---------- */
const NSC2 = {
  drift:(x, y, rx, c = "#eef4f8") => `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(rx)}" ry="${zr(rx * .22)}" fill="${c}" opacity=".85"/><ellipse cx="${zr(x - rx * .1)}" cy="${zr(y - rx * .08)}" rx="${zr(rx * .7)}" ry="${zr(rx * .12)}" fill="#ffffff" opacity=".7"/>`,
  shard:(K, x, y, s) => { K.light(x, y - 8, 18 * s, "#9ae8ff", .35); return `${zSh(x + 2, y + 1, 8 * s, 2.4, .22)}<path d="M${zr(x - 5 * s)} ${zr(y)}l${zr(3 * s)} -${zr(20 * s)}l${zr(4 * s)} ${zr(4 * s)}l${zr(4 * s)} -${zr(12 * s)}l${zr(3 * s)} ${zr(28 * s)}z" fill="#bfe8f8" stroke="#6aa8c8" stroke-width="1"/><path d="M${zr(x - 2 * s)} ${zr(y - 4 * s)}l${zr(1 * s)} -${zr(12 * s)}" stroke="#fff" stroke-width="1.4"/>`; },
  grassT:(x, y, s, c) => { const h = 12 * s; return `<path d="M${zr(x)} ${zr(y)}q-2 -${zr(h * .6)} -${zr(5)} -${zr(h)}M${zr(x + 2)} ${zr(y)}q1 -${zr(h * .7)} ${zr(3)} -${zr(h * 1.1)}M${zr(x + 4)} ${zr(y)}q4 -${zr(h * .5)} ${zr(8)} -${zr(h * .8)}" stroke="${c}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`; },
  poppy:(x, y, s) => `<path d="M${zr(x)} ${zr(y)}v-${zr(9 * s)}" stroke="#4a6a2a" stroke-width="1.2"/><circle cx="${zr(x)}" cy="${zr(y - 10 * s)}" r="${zr(2.6 * s)}" fill="#c82a22"/>`,
  ripple:(x, y, w, c) => `<path d="M${zr(x)} ${zr(y)}q${zr(w * .25)} -${zr(5)} ${zr(w * .5)} 0t${zr(w * .5)} 0" fill="none" stroke="${c}" stroke-width="1.6" opacity=".55"/>`,
  shell:(x, y, s) => `<path d="M${zr(x)} ${zr(y)}q${zr(4 * s)} -${zr(7 * s)} ${zr(8 * s)} 0z" fill="#f0dcc8" stroke="#b89878" stroke-width=".8"/>`,
  weed:(x, y, s) => `<path d="M${zr(x)} ${zr(y)}q-${zr(6 * s)} -${zr(4 * s)} -${zr(10 * s)} -${zr(2 * s)}M${zr(x)} ${zr(y)}q${zr(4 * s)} -${zr(7 * s)} ${zr(9 * s)} -${zr(5 * s)}M${zr(x)} ${zr(y)}q-${zr(2 * s)} -${zr(9 * s)} ${zr(2 * s)} -${zr(11 * s)}" stroke="#4a5a2a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  dune:(x, y, rx, c, c2) => `<ellipse cx="${zr(x)}" cy="${zr(y)}" rx="${zr(rx)}" ry="${zr(rx * .18)}" fill="${c}" opacity=".5" filter="url(#zb3)"/><path d="M${zr(x - rx * .8)} ${zr(y - rx * .02)}q${zr(rx * .7)} -${zr(rx * .22)} ${zr(rx * 1.6)} ${zr(rx * .04)}" stroke="${c2}" stroke-width="2.6" fill="none" opacity=".5" stroke-linecap="round"/>`,
  ripl:(x, y, w, c) => `<path d="M${zr(x)} ${zr(y)}q${zr(w * .25)} -${zr(3)} ${zr(w * .5)} 0t${zr(w * .5)} 0" fill="none" stroke="${c}" stroke-width="1.3" opacity=".5"/>`,
  cactus:(x, y, s) => `${zSh(x + 3, y + 1, 7 * s, 2.2, .22)}<path d="M${zr(x)} ${zr(y)}v-${zr(24 * s)}" stroke="#3a6a3a" stroke-width="${zr(5 * s)}" stroke-linecap="round"/><path d="M${zr(x)} ${zr(y - 8 * s)}h-${zr(6 * s)}v-${zr(8 * s)}M${zr(x)} ${zr(y - 12 * s)}h${zr(6 * s)}v-${zr(8 * s)}" stroke="#3a6a3a" stroke-width="${zr(3 * s)}" fill="none" stroke-linecap="round"/>`,
  skullH:(x, y, s) => `<path d="M${zr(x - 7 * s)} ${zr(y)}q${zr(4 * s)} -${zr(8 * s)} ${zr(10 * s)} -${zr(4 * s)}l${zr(6 * s)} ${zr(4 * s)}z" fill="#ece4d0"/><path d="M${zr(x + 6 * s)} ${zr(y - 3 * s)}h${zr(2 * s)}" stroke="#2a2418" stroke-width="1.4"/>`,
  snowfall:(r, n) => { let s = ""; for (let i = 0; i < n; i++){ const x = r() * ZW, y = r() * ZH; s += `<circle cx="${zr(x)}" cy="${zr(y)}" r="${zr(1 + r() * 1.5)}" fill="#fff" opacity="${(.3 + r() * .5).toFixed(2)}"/>`; } return s; },
  dust:(r, n) => { let s = ""; for (let i = 0; i < n; i++){ const x = r() * ZW, y = 100 + r() * 460; s += `<path d="M${zr(x)} ${zr(y)}h${zr(18 + r() * 40)}" stroke="#f4e4b0" stroke-width="1.2" opacity="${(.12 + r() * .18).toFixed(2)}" stroke-linecap="round"/>`; } return s; },
};
function nsDecor2(K){
  const id = K.id, reg = id.slice(0, 2), r = K.r, safe = K.safe, q = safe ? .6 : 1, g0 = K.Bm.ground[0];
  const pick = a => a[Math.floor(r() * a.length)];
  const sc = (n, rad, fn, o = {}) => K.scatter(Math.round(n * q), rad, fn, o);
  if (reg === "ic"){
    K.under += nsGround(K, "#9ab0c4", "#ffffff", 12);
    for (let i = 0; i < 10 * q; i++){ const x = 30 + r() * 840, y = 140 + r() * 400; if (K.free(x, y, 30, {npc:0})) K.under += NSC2.drift(x, y, 34 + r() * 70, pick(["#eef4f8", "#dfe9f2"])); }
    for (let i = 0; i < 4; i++){ const x = 60 + r() * 780, y = 180 + r() * 340; if (!K.wet(x, y, 30) && K.free(x, y, 24, {npc:0})) K.under += NSC.puddle(x, y, 22 + r() * 40, "#8ab8d4"); }
    sc(6, 12, (x, y) => NSC2.shard(K, x, y, .9 + r() * .8));
    sc(9, 10, (x, y) => NSC.tuft(x, y, .7 + r() * .5, pick(["#8a9aa4", "#7a8a94", "#9aa8b0"])));
    K.over += NSC2.snowfall(r, 40);
    K.fog = true; K.fogCol = "#dfe9f2"; K.fogOp = .17;
  } else if (reg === "wd"){
    K.under += nsGround(K, shade(g0, .7), shade(g0, 1.25), 11);
    let t = ""; for (let i = 0; i < 150 * q; i++){ const x = r() * ZW, y = 90 + r() * 450; if (K.wet(x, y, 4) || K.onPath(x, y, 3)) continue; t += NSC2.grassT(x, y, .8 + r() * .9, pick(["#b8aa5e", "#a89a4e", "#c8b86a", "#8a8a46"])); }
    K.under += t;
    sc(14, 7, (x, y) => NSC2.poppy(x, y, .8 + r() * .5));
    sc(3, 14, (x, y) => NSC2.skullH(x, y, .9 + r() * .5));
    for (let i = 0; i < 3; i++) { const y = 150 + r() * 380, x = r() * 300; K.under += `<path d="M${zr(x)} ${zr(y)}q${zr(260)} -${zr(12)} ${zr(500)} ${zr(r() * 12)}" stroke="#d8c872" stroke-width="1.6" fill="none" opacity=".2"/>`; }
    K.fog = true; K.fogCol = "#f4e4b0"; K.fogOp = .06;
  } else if (reg === "cs"){
    K.under += nsGround(K, "#7e7656", "#c8bc92", 9);
    for (let i = 0; i < 18 * q; i++){ const x = r() * ZW, y = 100 + r() * 460; if (K.wet(x, y, 6)) continue; K.under += NSC2.shell(x, y, .8 + r() * .6); }
    sc(7, 10, (x, y) => NSC2.weed(x, y, .8 + r() * .6));
    if (K.c.sea) for (let i = 0; i < 12; i++){ const y = 120 + r() * 400, x = 560 + (r() * 340) - (y - 200) * .8; K.under += NSC2.ripple(x, y, 40 + r() * 60, "#e8f4f0"); }
    sc(2, 20, (x, y) => `<path d="M${zr(x)} ${zr(y)}h${zr(38)}" stroke="#5a4226" stroke-width="5" stroke-linecap="round"/><path d="M${zr(x + 4)} ${zr(y - 3)}h${zr(24)}" stroke="#7a5a36" stroke-width="2"/>`, {claim:true});
    K.fog = true; K.fogCol = "#b8d0d4"; K.fogOp = .13;
  } else if (reg === "sd"){
    for (let i = 0; i < 9 * q; i++){ const x = r() * ZW, y = 150 + r() * 380; K.under += NSC2.dune(x, y, 70 + r() * 120, shade(g0, .7), shade(g0, 1.3)); }
    for (let i = 0; i < 40 * q; i++){ const x = r() * ZW, y = 100 + r() * 460; if (K.wet(x, y, 6) || K.onPath(x, y, 3)) continue; K.under += NSC2.ripl(x, y, 24 + r() * 36, shade(g0, 1.28)); }
    sc(4, 12, (x, y) => NSC2.cactus(x, y, .9 + r() * .5));
    sc(3, 12, (x, y) => NSC2.skullH(x, y, .8 + r() * .4));
    K.over += NSC2.dust(r, 22);
    K.fog = true; K.fogCol = "#f4dfa0"; K.fogOp = .1;
  }
}
(function(){
  const o = zDress;
  zDress = function(K){ o(K); if (/^(ic|wd|cs|sd)_/.test(K.id)) nsDecor2(K); };
})();

/* ---------- карта світу: прикраси нових країв ---------- */
(function(){
  const base = mapExtra;
  mapExtra = function(r){
    let s = base(r);
    const r4 = rng("world-v7-extra"), q = () => r4();
    const nfar = (x, y, d) => Object.values(NODES).every(n => Math.hypot(n.x - x, (n.y - y) * 1.2) > d);
    // Крижані Пустки: замети, крига, шматки льоду
    let sn = ""; for (let i = 0; i < 60; i++){ const x = 3850 + q() * 1380, y = 30 + q() * 760, rx = 30 + q() * 70; if (!nfar(x, y, 50)) continue; sn += `<ellipse cx="${x | 0}" cy="${y | 0}" rx="${rx | 0}" ry="${(rx * .26) | 0}" fill="#f2f6f8"/>`; }
    s += `<g opacity=".7" filter="url(#blwm)">${sn}</g>`;
    for (let i = 0; i < 40; i++){ const x = 3850 + q() * 1380, y = 40 + q() * 740; if (!nfar(x, y, 60)) continue; const z = 5 + q() * 6; s += `<path d="M${x | 0} ${y | 0}l${-z * .5 | 0} ${-z * 2.4 | 0}l${z * .5 | 0} ${z * .6 | 0}l${z * .7 | 0} ${-z * 1.6 | 0}l${z * .4 | 0} ${z * 3.4 | 0}z" fill="#c8ecfa" stroke="#7ab0d0" stroke-width="1"/>`; }
    for (const [x, y] of [[4390, 160], [4520, 700]]) s += `<ellipse cx="${x}" cy="${y}" rx="60" ry="18" fill="#a8d8ee" opacity=".7"/>`;
    // Дике Поле: ковила, мак, кургани
    let gr = ""; for (let i = 0; i < 360; i++){ const x = 3880 + q() * 1340, y = 840 + q() * 760; if (!nfar(x, y, 40)) continue; gr += `M${x | 0} ${y | 0}q-1.5 -5 -3 -9M${(x + 2) | 0} ${y | 0}q.5 -6 2 -10M${(x + 4) | 0} ${y | 0}q2 -5 5 -8`; }
    s += `<path d="${gr}" stroke="#d6c878" stroke-width="1.3" fill="none" opacity=".75"/>`;
    let pp = ""; for (let i = 0; i < 120; i++){ const x = 3880 + q() * 1340, y = 840 + q() * 760; if (nfar(x, y, 40)) pp += `M${x | 0} ${y | 0}h.01`; }
    s += `<path d="${pp}" stroke="#c8402a" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`;
    for (const [x, y, z] of [[4390, 1170, 20], [4690, 1430, 24], [4000, 1380, 18], [4780, 1060, 22], [4300, 920, 16]]) if (nfar(x, y, 40)) s += `<path d="M${x - z * 1.5} ${y}q${z * 1.5} ${-z * 1.4} ${z * 3} 0z" fill="#7a8a4a"/><path d="M${x - z * 1.5} ${y}q${z * 1.5} ${-z * 1.4} ${z * 3} 0" fill="none" stroke="#b8c070" stroke-width="1.4" opacity=".7"/>`;
    // Піски: дюни, гребені, ріки сухого русла
    for (let i = 0; i < 70; i++){ const x = 1700 + q() * 1900, y = 1700 + q() * 1300, rx = 40 + q() * 90; if (!nfar(x, y, 46)) continue;
      s += `<ellipse cx="${x | 0}" cy="${y | 0}" rx="${rx | 0}" ry="${(rx * .2) | 0}" fill="#d8c07e" opacity=".32"/><path d="M${(x - rx * .8) | 0} ${y | 0}q${rx * .8 | 0} ${-rx * .22 | 0} ${rx * 1.6 | 0} ${rx * .04 | 0}" stroke="#a88848" stroke-width="2" fill="none" opacity=".55"/>`; }
    for (let i = 0; i < 26; i++){ const x = 1700 + q() * 1900, y = 1700 + q() * 1300; if (nfar(x, y, 60)) s += `<path d="M${x | 0} ${y | 0}v${-14 | 0}M${x | 0} ${(y - 6) | 0}h-6v-7M${x | 0} ${(y - 9) | 0}h6v-6" stroke="#3a6a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`; }
    // Узбережжя: скелі, мілина, прибій
    for (let i = 0; i < 40; i++){ const x = 740 + q() * 700, y = 1650 + q() * 1300; if (nfar(x, y, 50)) s += maRock(x, y, 3 + q() * 6); }
    for (const [x, y] of [[1000, 2340], [1150, 2120]]) s += `<ellipse cx="${x}" cy="${y}" rx="70" ry="20" fill="#3a6a78" opacity=".45"/>`;
    return s;
  };
})();
