/* ============ значки нових локацій на карті: Крижані Пустки, Дике Поле, Узбережжя, Піски ============ */
const n2Snow = (x, y, rx, ry = rx * .3, o = .85) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#eef4f8" opacity="${o}"/><ellipse cx="${x - rx * .15}" cy="${y - ry * .2}" rx="${rx * .7}" ry="${ry * .6}" fill="#fff" opacity=".7"/>`;
const n2Ice = (x, y, s = 1) => msSh(x + 2 * s, y + .5 * s, 4 * s, 1.1 * s, .25) + `<path d="M${x - 3 * s} ${y}l1.4 ${-9 * s}l2 2.4l2.2 ${-6 * s}l1.6 ${12.6 * s}z" fill="#bfe8f8" stroke="#6aa8c8" stroke-width=".5"/>`;
const n2Palm = (x, y, s = 1) => msSh(x + 4 * s, y + .5, 6 * s, 1.5 * s, .25) + `<path d="M${x} ${y}q${1.5 * s} ${-12 * s} ${-.5 * s} ${-20 * s}" stroke="#5a4226" stroke-width="${1.8 * s}" fill="none"/><path d="M${x - .5 * s} ${y - 20 * s}q${-7 * s} ${-2 * s} ${-12 * s} ${4 * s}M${x - .5 * s} ${y - 20 * s}q${7 * s} ${-2 * s} ${12 * s} ${4 * s}M${x - .5 * s} ${y - 20 * s}q${-3 * s} ${-7 * s} ${-8 * s} ${-8 * s}M${x - .5 * s} ${y - 20 * s}q${3 * s} ${-7 * s} ${8 * s} ${-8 * s}" stroke="#3a7a2a" stroke-width="${2 * s}" fill="none" stroke-linecap="round"/>`;
const n2Yurt = (x, y, s = 1, c = "#d8cca8") => msSh(x + 4 * s, y + .8, 10 * s, 2.4 * s, .26) + `<path d="M${x - 9 * s} ${y}v${-6 * s}q${9 * s} ${-9 * s} ${18 * s} 0v${6 * s}z" fill="${c}"/><path d="M${x - 9 * s} ${y - 6 * s}q${9 * s} ${-9 * s} ${18 * s} 0" fill="none" stroke="#8a6a3a" stroke-width=".9"/><path d="M${x - 1.6 * s} ${y}v${-4.4 * s}h${3.2 * s}v${4.4 * s}z" fill="#3a2a1a"/>`;
const n2Hide = (x, y, s = 1, c = "#9a7a58") => msSh(x + 3 * s, y + .6, 8 * s, 2 * s, .26) + `<path d="M${x - 8 * s} ${y}l${8 * s} ${-14 * s}l${8 * s} ${14 * s}z" fill="${c}"/><path d="M${x} ${y - 14 * s}l${8 * s} ${14 * s}h${-5 * s}z" fill="#000" opacity=".2"/><path d="M${x - 1.4 * s} ${y}l1.4 ${-6 * s}l1.4 ${6 * s}z" fill="#1a1410"/><path d="M${x} ${y - 14 * s}v${-4 * s}" stroke="#4a3220" stroke-width="1"/>`;
const n2Mound = (x, y, w, h, c, hole) => msSh(x + w * .1, y + 1, w * .6, h * .22, .3) + `<path d="M${x - w / 2} ${y}q${w / 2} ${-h * 1.7} ${w} 0z" fill="${c}"/><path d="M${x - w / 2} ${y}q${w / 2} ${-h * 1.7} ${w} 0" fill="none" stroke="#fff" stroke-width=".7" opacity=".25"/>` + (hole ? `<path d="M${x - w * .14} ${y}q${w * .14} ${-h * .8} ${w * .28} 0z" fill="#0a0806"/>` : "");
const n2Pyr = (x, y, w, h, c1 = "#d0b070", c2 = "#a88848", door = true) => msSh(x + w * .12, y + 1.6, w * .6, h * .12, .32) + `<path d="M${x - w / 2} ${y}L${x} ${y - h}L${x + w / 2} ${y}z" fill="${c1}"/><path d="M${x} ${y - h}L${x + w / 2} ${y}h${-w * .22}z" fill="${c2}"/><path d="M${x - w * .3} ${y - h * .4}h${w * .6}M${x - w * .18} ${y - h * .68}h${w * .36}" stroke="${c2}" stroke-width=".8" opacity=".6"/>` + (door ? `<path d="M${x - w * .06} ${y}v${-h * .13}h${w * .12}v${h * .13}z" fill="#0a0806"/>` : "");
const n2Dune = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .2}" fill="#d4bd80" opacity=".5"/><path d="M${x - rx * .7} ${y}q${rx * .7} ${-rx * .14} ${rx * 1.4} 0" stroke="#a8884a" stroke-width="1.2" fill="none" opacity=".5"/>`;
const n2Pool = (x, y, rx, c = "#3a8a9a") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .38}" fill="#1a3a44" opacity=".5"/><ellipse cx="${x}" cy="${y - .4}" rx="${rx * .92}" ry="${rx * .33}" fill="${c}"/><ellipse cx="${x - rx * .25}" cy="${y - rx * .08}" rx="${rx * .4}" ry="${rx * .08}" fill="#cfeff4" opacity=".45"/>`;
const n2Tent = (C, cnt, a, b, rad, cols) => C.scatter(cnt, a, b, rad, (px, py, i) => n2Hide(px, py, .9 + C.r() * .3, cols[i % cols.length]), {claim:true});
const n2Houses = (C, cnt, a, b, wall, roof) => C.scatter(cnt, a, b, 9, (px, py) => maHouse(px, py, 9 + C.r() * 4, 6 + C.r() * 2, 6 + C.r() * 2, Array.isArray(wall) ? MA.pk(C.r, wall) : wall, Array.isArray(roof) ? MA.pk(C.r, roof) : roof, {win:C.r() < .4 ? "#ffd27a" : null}), {claim:true});
const n2Gnd = (C, dx, dy, rx, ry, c, o = .3) => { C.ground += msGround(C.x + dx, C.y + dy, rx, ry, c, o); };
const n2Pines = (C, cnt, a, b, snow) => C.scatter(cnt, a, b, 7, (px, py) => maTree(px, py, 3.2 + C.r() * 1.8, "pine", snow ? "#3a5a52" : "#2f4a28"), {claim:true});
const n2Rocks = (C, cnt, a, b, c) => C.scatter(cnt, a, b, 5, (px, py) => msRockC(px, py, 2 + C.r() * 3, c), {});
const n2Bones = (C, cnt, a, b) => C.scatter(cnt, a, b, 3, (px, py) => msBones(px, py));
const n2Fire = (C, dx, dy, s = 1) => C.place(C.x + dx, C.y + dy, 5, (px, py) => msFire(px, py, s));
Object.assign(SITES, {
  /* Крижані Пустки */
  ic_post(C){ const {x, y, r} = C, cx = x - 4, cy = y - 14, rx = 42, ry = 20; n2Gnd(C, -4, -10, 54, 28, "#c8d4dc", .6); msPalisade(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry), "#8a7a62");
    C.put(cy, msWoodTower(cx + 18, cy - 4, 36, "#8a7a62", "#cfd8de")); n2Houses(C, 4, 6, 24, ["#7a6a52", "#8a7a62"], "#e8eef2"); C.scatter(3, 10, 34, 5, (px, py) => msFolk(px, py, "#4a5a6a", 1)); n2Fire(C, -8, 6); C.scatter(2, 36, 56, 5, (px, py) => n2Snow(px, py, 8)); },
  ic_camp(C){ const {x, y} = C; n2Gnd(C, 0, -6, 58, 28, "#c8d4dc", .55); n2Tent(C, 6, 10, 36, 9, ["#9a7a58", "#8a6a4a", "#a88a68"]); n2Fire(C, -4, 4, 1.2);
    C.place(x + 30, y - 6, 12, (px, py) => msSh(px, py, 14, 3, .25) + `<path d="M${px - 14} ${py}q-2 -12 4 -16q10 -6 22 0q6 6 2 16z" fill="#6a4a38"/><path d="M${px + 8} ${py - 12}q10 -4 12 6" fill="none" stroke="#ece4d0" stroke-width="2"/>`);
    C.scatter(3, 12, 40, 5, (px, py) => msFolk(px, py, "#6a4a38", 1)); n2Pines(C, 4, 40, 62, true); },
  ic_river(C){ const {x, y} = C; n2Gnd(C, 0, 0, 62, 24, "#9ac0d8", .6); C.ground += `<path d="M${x - 60} ${y + 4}q30 -14 60 -4t60 6" stroke="#cfe8f4" stroke-width="7" fill="none" opacity=".8"/><path d="M${x - 50} ${y + 2}l10 -3M${x + 10} ${y - 4}l12 4M${x + 40} ${y + 2}l-8 4" stroke="#6a98b8" stroke-width="1" fill="none"/>`;
    n2Pines(C, 5, 38, 62, true); n2Rocks(C, 3, 20, 50, "#9aa0a8"); n2Bones(C, 3, 14, 40); C.scatter(2, 18, 40, 4, (px, py) => n2Ice(px, py, 1.1)); },
  ic_mammoth(C){ const {x, y} = C; n2Gnd(C, 0, -4, 62, 26, "#dfe8ee", .6);
    C.main(28, [[-10, -10], [14, -16]], (px, py) => `<path d="M${px - 22} ${py}q-6 -22 12 -26q12 -6 22 4q14 -6 18 10q-2 10 -4 12z" fill="#6a4a38"/><path d="M${px - 20} ${py - 4}q-12 6 -16 20" stroke="#f2ecd8" stroke-width="2.6" fill="none"/>` + msSh(px, py + 1, 24, 4, .28));
    n2Bones(C, 4, 14, 44); n2Pines(C, 3, 44, 64, true); C.scatter(3, 20, 58, 6, (px, py) => n2Snow(px, py, 10)); },
  ic_witch(C){ const {x, y} = C; n2Gnd(C, 0, -4, 52, 24, "#cfdae2", .55);
    C.main(18, [[-8, -12], [12, -16]], (px, py) => maHouse(px, py, 16, 10, 9, "#6a5a48", "#e8eef2", {nodoor:false}) + msSmoke(px + 5, py - 20, 1, "#d8dce0"));
    C.place(x + 26, y + 4, 6, (px, py) => msCauldron(px, py, "#8ae0ff")); n2Pines(C, 6, 34, 60, true); n2Bones(C, 2, 20, 42); },
  ic_burrows(C){ const {x, y} = C; n2Gnd(C, 0, -4, 56, 24, "#b8c4cc", .5);
    for (const [ox, oy, w] of [[-26, -8, 26], [8, -16, 32], [30, 2, 24]]) C.place(x + ox, y + oy, 14, (px, py) => n2Mound(px, py, w, 16, "#7a766a", true));
    C.scatter(3, 20, 46, 4, (px, py) => msFolk(px, py, "#6a8a4a", 1)); n2Fire(C, 0, 10); n2Rocks(C, 4, 30, 60, "#8a8c90"); },
  ic_mine(C){ const {x, y} = C; n2Gnd(C, 0, -4, 54, 24, "#aab4bc", .5);
    C.main(22, [[-8, -14], [14, -18]], (px, py) => maPeak(px + 8, py - 6, 22, true) + msCave(px, py + 2, 16, 18, "#ffb04a") + `<path d="M${px - 10} ${py + 2}v-18h20v18" stroke="#6a4a2a" stroke-width="2.2" fill="none"/>`);
    C.place(x - 24, y + 8, 8, (px, py) => msCart(px, py, "")); n2Rocks(C, 5, 24, 56, "#7a7e86"); C.scatter(3, 20, 50, 4, (px, py) => n2Ice(px, py)); },
  ic_pass(C){ const {x, y} = C; n2Gnd(C, 0, 0, 56, 24, "#c8d2d8", .5);
    C.main(34, [[-6, -16], [10, -22]], (px, py) => maPeak(px + 18, py - 8, 30, true) + maPeak(px - 20, py - 2, 26, true) + maPeak(px, py + 6, 22, true));
    n2Pines(C, 4, 40, 62, true); n2Rocks(C, 4, 30, 58, "#8a8e96"); },
  ic_jotun(C){ const {x, y} = C; n2Gnd(C, 0, -4, 56, 24, "#b8d0e0", .55);
    C.main(30, [[-6, -14], [10, -20]], (px, py) => msSh(px, py + 2, 34, 6, .3) + `<path d="M${px - 30} ${py + 2}q4 -34 30 -40q26 6 30 40z" fill="#7aa8c8"/><path d="M${px - 30} ${py + 2}q4 -34 30 -40" fill="none" stroke="#e8f4ff" stroke-width="1.4"/>` + msCave(px, py + 2, 16, 16, "#9ae8ff"));
    C.scatter(5, 20, 52, 4, (px, py) => n2Ice(px, py, 1.4)); n2Bones(C, 3, 30, 56); },
  ic_king(C){ const {x, y} = C; n2Gnd(C, 0, -4, 54, 24, "#b0bcc4", .5);
    C.main(26, [[-6, -14], [10, -20]], (px, py) => maPeak(px + 10, py - 6, 24, true) + msCave(px, py + 2, 18, 20, "#ffd86a") + `<ellipse cx="${px + 16}" cy="${py + 4}" rx="9" ry="3" fill="#d9a441"/><ellipse cx="${px + 16}" cy="${py + 2}" rx="6" ry="2" fill="#f2d070"/>`);
    C.scatter(3, 22, 48, 4, (px, py) => msSkullPole(px, py)); C.scatter(3, 20, 50, 4, (px, py) => msFolk(px, py, "#6a8a4a", 1)); n2Rocks(C, 3, 34, 60, "#7a7e86"); },
  /* Дике Поле */
  wd_fort(C){ const {x, y} = C, cx = x - 4, cy = y - 14, rx = 42, ry = 20; n2Gnd(C, -4, -10, 54, 28, "#a89a58", .35); msPalisade(C, cx, cy, rx, ry, siteRingGates(C, cx, cy, rx, ry), "#7a5a32");
    C.put(cy, msWoodTower(cx + 16, cy - 4, 34, "#7a5a32", "#a8944a")); n2Houses(C, 4, 6, 24, ["#d8ccb0", "#cbbd9c"], ["#a8944a", "#8a7a3a"]); C.scatter(3, 10, 34, 5, (px, py) => msFolk(px, py, "#a82a22", 1));
    C.place(cx - 22, cy - 14, 4, (px, py) => msBanner(px, py, 20, "#a82a22")); },
  wd_inn(C){ const {x, y} = C; n2Gnd(C, 0, -6, 52, 24, "#a89a58", .35);
    C.main(22, [[-8, -12], [12, -16]], (px, py) => maHouse(px, py, 22, 12, 11, "#d8ccb0", "#a8944a", {chim:true, win:"#ffd27a"}));
    C.place(x + 28, y + 2, 6, (px, py) => msHay(px, py, 1.2)); C.place(x - 28, y + 4, 4, (px, py) => msWell(px, py)); C.place(x + 10, y + 10, 4, (px, py) => msBarrel(px, py)); C.scatter(3, 12, 40, 5, (px, py) => msFolk(px, py, "#8a5a3a", 1)); C.place(x - 6, y + 12, 6, (px, py) => msCart(px, py, "")); },
  wd_balka(C){ const {x, y} = C; n2Gnd(C, 0, 0, 62, 24, "#788a4a", .45); C.ground += `<path d="M${x - 62} ${y - 4}q30 18 62 8t62 -10" stroke="#5a6a38" stroke-width="12" fill="none" opacity=".55"/>`;
    C.scatter(4, 20, 56, 5, (px, py) => msSheep(px, py, "#8a6a4a")); n2Bones(C, 3, 20, 50); n2Rocks(C, 3, 30, 60, "#9a9a80"); },
  wd_kurgan(C){ const {x, y} = C; n2Gnd(C, 0, 0, 58, 24, "#9a9a5a", .4);
    C.main(28, [[-6, -14], [10, -18]], (px, py) => n2Mound(px, py, 54, 28, "#7a8a4a", true) + `<path d="M${px - 18} ${py - 20}v-8h2v8M${px + 12} ${py - 22}v-8h2v8" stroke="#ece4d0" stroke-width="1"/>`);
    C.scatter(5, 26, 56, 4, (px, py) => msMenhir(px, py, 11, "#8a8a7a")); n2Bones(C, 3, 24, 52); },
  wd_baba(C){ const {x, y, r} = C; n2Gnd(C, 0, -2, 58, 24, "#9a9a5a", .4); msStoneRing(C, x, y - 6, 34, 16, [], "#9a9a8a", 5, {ruin:1});
    C.scatter(7, 14, 46, 5, (px, py) => msMenhir(px, py, 12 + r() * 4, "#9a9a8a"), {claim:true}); n2Bones(C, 3, 20, 54); },
  wd_yar(C){ const {x, y} = C; n2Gnd(C, 0, 0, 60, 24, "#8a9a50", .4); C.ground += `<path d="M${x - 58} ${y + 6}q28 -20 58 -6t60 -6" stroke="#6a7a3a" stroke-width="10" fill="none" opacity=".45"/>`;
    C.scatter(4, 14, 40, 9, (px, py) => n2Yurt(px, py, .9 + C.r() * .3, "#d8cca8"), {claim:true}); n2Fire(C, 0, 6); C.scatter(3, 20, 54, 5, (px, py) => msSheep(px, py, "#6a4a30")); },
  wd_witch(C){ const {x, y} = C; n2Gnd(C, 0, 0, 54, 24, "#7a8a4a", .4);
    C.main(16, [[-8, -12], [12, -14]], (px, py) => maHouse(px, py, 15, 9, 8, "#8a7a58", "#a8944a", {}) + msSmoke(px + 5, py - 17, 1, "#c8d8c0"));
    C.place(x + 24, y + 4, 6, (px, py) => msCauldron(px, py, "#9aff6a")); C.scatter(6, 20, 50, 4, (px, py) => msSunflower(px, py, .8)); n2Bones(C, 2, 20, 40); },
  wd_levada(C){ const {x, y} = C; n2Gnd(C, 0, 0, 60, 26, "#4a3a2a", .55); n2Gnd(C, 10, 4, 36, 16, "#2a2018", .5);
    C.scatter(6, 14, 48, 3, (px, py) => msStake(px, py, 8, 2, "#2a2018")); n2Bones(C, 5, 12, 52); C.scatter(3, 20, 50, 4, (px, py) => msDeadTree(px, py, 7)); C.place(x + 14, y - 8, 6, (px, py) => msFire(px, py, 1)); },
  wd_gora(C){ const {x, y} = C; n2Gnd(C, 0, 0, 58, 24, "#4a3a34", .5);
    C.main(38, [[-4, -12], [10, -18]], (px, py) => maPeak(px, py, 36, false) + msGlow(px, py - 38, 12, "#ff7a2a", .8) + msSmoke(px, py - 44, 1.6, "#6a5a54"));
    C.scatter(4, 22, 52, 5, (px, py) => msRockC(px, py, 3, "#4a3a34")); n2Bones(C, 3, 24, 52); },
  /* Затоплене узбережжя */
  cs_harbor(C){ const {x, y} = C; n2Gnd(C, 0, -4, 54, 26, "#b8aa80", .4); C.ground += `<path d="M${x - 70} ${y + 10}h50v7h-50z" fill="#6a4a2a"/><path d="M${x - 66} ${y + 17}v10M${x - 50} ${y + 17}v10M${x - 34} ${y + 17}v10" stroke="#3a2a1a" stroke-width="2"/>`;
    n2Houses(C, 4, 8, 28, ["#d8ccb0", "#c8b898"], ["#5a6a7a", "#8a3a26"]); C.place(x - 56, y + 20, 8, (px, py) => msBoat(px, py, 1, "#6a4a2a", false)); C.place(x - 36, y + 26, 8, (px, py) => msBoat(px, py, .9, "#7a5a3a", true));
    C.place(x + 22, y + 10, 8, (px, py) => msRack(px, py)); C.scatter(3, 10, 36, 5, (px, py) => msFolk(px, py, "#3a5a6a", 1)); C.place(x + 4, y + 14, 4, (px, py) => msBarrel(px, py)); },
  cs_light(C){ const {x, y} = C; n2Gnd(C, 0, 0, 52, 22, "#b4a880", .4);
    C.main(18, [[-8, -12], [10, -14]], (px, py) => msSh(px + 4, py + 1, 12, 2.6, .3) + `<path d="M${px - 7} ${py}l2 -34h10l2 34z" fill="#d8d0c0"/><path d="M${px - 6} ${py - 18}h12M${px - 5.4} ${py - 28}h10.8" stroke="#a82a22" stroke-width="3"/><path d="M${px - 7} ${py - 34}h14l-3 -6h-8z" fill="#3a3a40"/><path d="M${px - 1} ${py - 34}l3 -4" stroke="#8a8a90" stroke-width="1"/>`);
    n2Rocks(C, 6, 20, 54, "#7a7e80"); n2Bones(C, 2, 22, 48); },
  cs_shoal(C){ const {x, y} = C; n2Gnd(C, 0, 0, 62, 24, "#8a9aa0", .5);
    C.main(22, [[-8, -10], [12, -14]], (px, py) => maShip(px, py, .7)); n2Bones(C, 4, 16, 50); n2Rocks(C, 4, 24, 58, "#6a7a7e"); C.scatter(3, 20, 50, 4, (px, py) => msSkullPole(px, py)); },
  cs_mermaid(C){ const {x, y} = C; n2Gnd(C, 0, 0, 56, 24, "#a0b090", .35); C.ground += n2Pool(x, y, 36, "#4a9aa0");
    C.scatter(5, 28, 54, 6, (px, py) => msRockC(px, py, 3 + C.r() * 2, "#7a8a86")); C.scatter(6, 28, 56, 3, (px, py) => maReeds(px, py, 4, C.r)); },
  cs_siren(C){ const {x, y} = C; n2Gnd(C, 0, 0, 56, 24, "#8a9aa4", .45);
    C.main(30, [[-6, -12], [10, -18]], (px, py) => maPeak(px + 14, py - 6, 26, false) + maPeak(px - 16, py, 22, false) + maPeak(px, py + 6, 18, false)); n2Bones(C, 4, 20, 50); n2Rocks(C, 4, 30, 58, "#6a7a82"); },
  cs_crab(C){ const {x, y} = C; n2Gnd(C, 0, 0, 60, 24, "#c0ae80", .4);
    C.scatter(5, 14, 46, 6, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="8" ry="3" fill="#2a2418"/><ellipse cx="${px}" cy="${py - .6}" rx="6" ry="2" fill="#0a0806"/><path d="M${px - 6} ${py + 3}l-3 2.4M${px + 6} ${py + 3}l3 2.4" stroke="#c85a3a" stroke-width="1.6" stroke-linecap="round"/>`, {claim:true}); C.scatter(2, 20, 48, 6, (px, py) => msCrow(px, py - 4, 1, "#c85a3a")); n2Rocks(C, 4, 24, 56, "#8a8a80"); },
  cs_ships(C){ const {x, y} = C; n2Gnd(C, 0, 0, 62, 24, "#8a9aa0", .5);
    C.main(22, [[-14, -10], [14, -14]], (px, py) => maShip(px, py, .75)); C.place(x + 28, y + 6, 14, (px, py) => maShip(px, py, .5)); C.scatter(3, 20, 54, 4, (px, py) => msSkullPole(px, py)); n2Bones(C, 4, 18, 52); },
  cs_fleet(C){ const {x, y} = C; n2Gnd(C, 0, 0, 62, 26, "#6a8088", .55);
    C.place(x - 28, y - 6, 16, (px, py) => maShip(px, py, .6)); C.place(x + 4, y - 14, 16, (px, py) => maShip(px, py, .7)); C.place(x + 34, y + 2, 16, (px, py) => maShip(px, py, .55)); n2Bones(C, 4, 20, 54); },
  cs_kraken(C){ const {x, y} = C; n2Gnd(C, 0, 0, 62, 26, "#20203a", .65); C.ground += n2Pool(x, y, 40, "#241a4a");
    for (const [ox, oy, k] of [[-22, -4, 1], [18, 2, 1.2], [-4, -16, .9]]) C.put(y + oy + 6, `<path d="M${x + ox} ${y + oy}q${-6 * k} ${-14 * k} ${3 * k} ${-24 * k}q${8 * k} ${-8 * k} ${3 * k} ${-14 * k}" fill="none" stroke="#5a3a8a" stroke-width="${3.6 * k}" stroke-linecap="round"/>`);
    n2Rocks(C, 4, 36, 60, "#3a3a4a"); },
  /* Піски Забутих Царів */
  sd_oasis(C){ const {x, y} = C; n2Gnd(C, 0, -4, 60, 28, "#d4bd80", .55); C.ground += n2Pool(x - 6, y + 2, 30);
    C.scatter(5, 16, 38, 6, (px, py) => n2Palm(px, py, .9 + C.r() * .3), {claim:true}); n2Tent(C, 4, 30, 54, 9, ["#e8d8a8", "#c8a868", "#b88a58"]); C.scatter(3, 10, 40, 5, (px, py) => msFolk(px, py, "#d8c898", 1)); },
  sd_dig(C){ const {x, y} = C; n2Gnd(C, 0, -4, 58, 26, "#c8b070", .5);
    for (const [ox, oy] of [[-22, -4], [10, -12], [28, 6]]) C.place(x + ox, y + oy, 10, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="12" ry="4" fill="#8a7040"/><ellipse cx="${px}" cy="${py + .6}" rx="9" ry="3" fill="#2a1e10"/><path d="M${px - 8} ${py - 2}l4 -12M${px + 8} ${py - 2}l-4 -12M${px - 8} ${py - 14}h12" stroke="#4a3220" stroke-width="1.2" fill="none"/>`);
    n2Tent(C, 4, 18, 44, 9, ["#e8d8a8", "#d8c898"]); C.scatter(3, 10, 40, 5, (px, py) => msFolk(px, py, "#8a6a3a", 1)); C.place(x - 4, y + 12, 6, (px, py) => msCart(px, py, "")); },
  sd_bed(C){ const {x, y} = C; n2Gnd(C, 0, 0, 62, 24, "#b49a60", .45); C.ground += `<path d="M${x - 64} ${y + 2}q30 -12 64 -2t64 4" stroke="#8a7440" stroke-width="12" fill="none" opacity=".6"/><path d="M${x - 50} ${y}l8 3M${x} ${y - 3}l9 2M${x + 40} ${y + 2}l7 -2" stroke="#6a5430" stroke-width="1" fill="none"/>`;
    n2Bones(C, 4, 14, 50); n2Rocks(C, 3, 24, 56, "#a8946a"); C.scatter(2, 20, 46, 5, (px, py) => msDeadTree(px, py, 7, "#5a4a30")); },
  sd_scarab(C){ const {x, y} = C; n2Gnd(C, 0, 0, 58, 24, "#c0a468", .45);
    C.main(28, [[-6, -12], [10, -16]], (px, py) => n2Mound(px, py, 50, 24, "#8a7a4a", true)); C.scatter(14, 8, 44, 1, (px, py) => `<ellipse cx="${px}" cy="${py}" rx="1.4" ry=".9" fill="#2a3a3a"/>`, {claim:false}); n2Rocks(C, 3, 30, 56, "#a8946a"); },
  sd_temple(C){ const {x, y} = C; n2Gnd(C, 0, -2, 58, 24, "#c8b070", .45);
    C.main(32, [[-6, -14], [10, -20]], (px, py) => msSh(px + 6, py + 1, 36, 5, .3) + `<path d="M${px - 26} ${py}v-22h52v22z" fill="#b8a070"/><path d="M${px - 28} ${py - 22}h56v-5h-56z" fill="#a89060"/><path d="M${px - 18} ${py}v-20M${px - 6} ${py}v-20M${px + 6} ${py}v-20M${px + 18} ${py}v-20" stroke="#8a7248" stroke-width="3"/><path d="M${px - 4} ${py}v-12h8v12z" fill="#1a140c"/><path d="M${px - 14} ${py - 28}l4 -8l4 8zM${px + 10} ${py - 28}l4 -8l4 8z" fill="#2a2418"/>`);
    n2Bones(C, 3, 24, 52); n2Rocks(C, 3, 34, 58, "#a8946a"); },
  sd_tomb(C){ const {x, y} = C; n2Gnd(C, 0, 0, 56, 24, "#c0a468", .45);
    C.main(24, [[-6, -12], [10, -16]], (px, py) => msSh(px + 4, py + 1, 26, 4, .3) + `<path d="M${px - 20} ${py}v-22h40v22z" fill="#a8946a"/><path d="M${px - 22} ${py - 22}h44v-4h-44z" fill="#8a7648"/><path d="M${px - 6} ${py}v-14a6 6 0 0 1 12 0v14z" fill="#14100a"/>`);
    C.scatter(2, 24, 50, 5, (px, py) => `<path d="M${px - 2} ${py}v-16l2 -4l2 4v16z" fill="#b8a478"/>`); n2Bones(C, 3, 24, 50); },
  sd_worm(C){ const {x, y} = C; n2Gnd(C, 0, 0, 60, 24, "#c0a468", .45);
    C.ground += `<ellipse cx="${x}" cy="${y}" rx="38" ry="14" fill="#8a7440"/><ellipse cx="${x}" cy="${y + 1}" rx="28" ry="10" fill="#6a5430"/><ellipse cx="${x}" cy="${y + 2}" rx="16" ry="6" fill="#3a2a14"/><ellipse cx="${x}" cy="${y + 3}" rx="6" ry="2.2" fill="#0a0604"/>`;
    C.put(y + 10, `<path d="M${x + 4} ${y + 2}q10 -20 2 -30q-4 -8 4 -12" fill="none" stroke="#8a7a5a" stroke-width="6" stroke-linecap="round"/>`); n2Bones(C, 3, 40, 58); },
  sd_lamia(C){ const {x, y} = C; n2Gnd(C, 0, 0, 56, 24, "#b49a60", .45);
    C.main(30, [[-6, -14], [10, -18]], (px, py) => maPeak(px + 16, py - 10, 26, false) + maPeak(px - 20, py - 4, 22, false) + msCave(px, py + 2, 16, 18, "#c8a84a")); n2Bones(C, 5, 14, 44); n2Rocks(C, 3, 30, 56, "#8a7a5a"); },
  sd_sphinx(C){ const {x, y} = C; n2Gnd(C, 0, 0, 62, 28, "#d0b878", .5);
    C.main(36, [[-8, -18], [10, -26]], (px, py) => n2Pyr(px, py, 62, 50));
    C.place(x - 28, y + 14, 14, (px, py) => msSh(px, py + 1, 16, 3, .3) + `<path d="M${px - 14} ${py}q-2 -8 6 -9l16 -1q5 1 5 6l-1 4z" fill="#c8a85a"/><path d="M${px - 8} ${py - 9}q-4 -2 -4 -8q2 -8 8 -8q6 0 7 8q0 6 -5 8z" fill="#d8b868"/>`); n2Rocks(C, 3, 40, 60, "#a8946a"); },
  sd_lich(C){ const {x, y} = C; n2Gnd(C, 0, 0, 60, 26, "#7a6a40", .55);
    C.main(34, [[-8, -18], [10, -24]], (px, py) => n2Pyr(px, py, 60, 48, "#8a7a4a", "#5a4a28", false) + `<path d="M${px - 6} ${py}v-14a6 6 0 0 1 12 0v14z" fill="#c9a24a"/>` + msGlow(px, py - 8, 10, "#6aff9a", .7));
    C.scatter(4, 24, 54, 4, (px, py) => msSkullPole(px, py)); n2Bones(C, 4, 20, 54); },
});
