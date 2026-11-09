/* ============ сцени: Землі Кабаллону ============ */
Object.assign(ZS, {
  kaballon(K){ const r = K.r; K.dress = {noLine:true, veg:.25, fg:null, edge:{oak:4}, mid:{}};
    const st = "#a49a86";
    K.put(118, zWall(K, -20, 124, 660, 116, 50, {wall:st}) + zWall(K, 732, 116, 920, 112, 50, {wall:st}));
    K.put(120, zKeep(K, 696, 122, 76, 78, 32, {wall:"#b0a690", gate:true, flag:"#3a5a8a"}));
    K.put(128, zTower(K, 40, 132, 24, 100, {wall:"#b0a690", roof:"#3a4a6a", win:"#ffd27a", flag:"#3a5a8a"}));
    K.put(124, zTower(K, 880, 120, 24, 100, {wall:"#b0a690", roof:"#3a4a6a", win:"#ffd27a"}));
    // замок капітана Ульфа
    K.put(182, zTower(K, 262, 190, 18, 118, {wall:"#bcb29c", roof:"#3a4a6a", win:"#ffd27a", flag:"#3a5a8a"}) + zKeep(K, 330, 184, 92, 96, 46, {wall:"#c4baa4", win:"#ffd27a", gate:true, roof:"#3a4a6a", rh:52}) + zTower(K, 400, 190, 16, 104, {wall:"#bcb29c", roof:"#3a4a6a", win:"#ffd27a"}));
    K.claim(330, 150, 90);
    // торговий дім Ісака
    K.put(222, zHouse(K, 568, 220, 124, 72, 56, {timber:"#4a3424", wall:"#ece2c4", roof:"#8a3a24", storeys:2, sign:"#c9a24a", chimney:true, shut:"#3a5a3a", flowers:true})); K.claim(568, 180, 70);
    // банк
    K.put(250, zHouse(K, 790, 252, 104, 66, 52, {wall:"#d0c8b4", roof:"#3a4a5a", archWin:true, sign:"#3a6a3a", signIc:"#e8c860", base:"#8a8476"}) + [0, 1, 2, 3].map(i => `<rect x="${742 + i * 30}" y="198" width="7" height="54" fill="#e8e2d2"/><rect x="${746 + i * 30}" y="198" width="3" height="54" fill="#b8b2a2"/>`).join("")); K.claim(800, 210, 66);
    // майстерня Тодора
    K.put(336, zHouse(K, 160, 334, 108, 58, 52, {gable:"front", timber:"#4a3424", wall:"#dccaa6", roof:"#6a3a26", sign:"#7a5a3a", signIc:"#c0c0c0"}) + Z.anvil(228, 344) + Z.barrel(96, 350)); K.claim(160, 300, 64);
    // аукціон: ятки з навісом унизу праворуч
    K.put(470, zHouse(K, 700, 470, 96, 48, 44, {gable:"front", wall:"#e6d8b4", roof:"#5a3a6a", sign:"#8a3a8a"})); K.claim(700, 440, 54);
    K.put(318, zFountain(K, 450, 318));
    for (const [x, y, c] of [[340, 400, "#c0503a"], [470, 418, "#3a6a9a"], [590, 398, "#d9a441"]]) K.place(x, y, 26, (px, py) => Z.stall(px, py, c), {npc:1});
    for (const [x, y] of [[372, 262], [528, 262], [300, 300], [608, 330]]) K.place(x, y, 8, (px, py) => Z.lamp(K, px, py), {npc:1, path:1});
    for (let i = 0; i < 14; i++) K.place(260 + r() * 400, 260 + r() * 200, 6, (px, py) => Z.folk(px, py, K.pk(["#7a3a26", "#3a5a7a", "#5a6a30", "#8a6a2a", "#6a3a6a", "#a05a3a"])), {path:1, noclaim:1});
    K.place(120, 430, 30, (px, py) => Z.cart(px, py, `<path d="M${px - 20} ${py - 26}q10 -10 20 0q10 -10 20 0" fill="#c8a85a"/>`));
    for (const [x, y] of [[620, 300], [660, 330], [96, 250]]) K.place(x, y, 8, (px, py) => Z.barrel(px, py), {npc:1});
    for (const [x, y] of [[440, 170], [520, 160]]) K.place(x, y, 10, (px, py) => Z.banner(px, py, 62, "#3a5a8a", "#e8c060"), {npc:1});
  },
  spring(K){ const r = K.r; K.dress = {veg:.7, edge:{oak:6, birch:3, pine:2}};
    // джерело біля знахарки
    K.put(196, `<ellipse cx="560" cy="198" rx="74" ry="26" fill="#000" opacity=".25" filter="url(#zb1)"/><ellipse cx="560" cy="196" rx="70" ry="24" fill="#6a6458"/><ellipse cx="560" cy="194" rx="58" ry="18" fill="#2e6a7a"/><ellipse cx="548" cy="190" rx="26" ry="5" fill="#bfe8f0" opacity=".6"/>` + [...Array(12)].map((_, i) => `<ellipse cx="${560 + Math.cos(i * .52) * 66}" cy="${198 + Math.sin(i * .52) * 22}" rx="9" ry="6" fill="${i % 2 ? "#8a847a" : "#9a948a"}"/>`).join("") + zSmoke(560, 176, .7, "#e8f4f8")); K.light(560, 192, 60, "#bff4ff", .4); K.claim(560, 190, 70);
    K.put(212, zHouse(K, 410, 210, 92, 48, 52, {wall:"#e2d6b8", roof:"#7a5a3a", timber:"#5a3a22", chimney:true, shut:"#3a6a4a", flowers:true, sign:"#4a7a4a", signIc:"#e8f0c0"})); K.claim(410, 180, 60);
    for (const [x, y, w] of [[150, 200, 84], [740, 210, 88], [180, 470, 80], [700, 476, 84]]) K.place(x, y, 50, (px, py) => zHouse(K, px, py, w, 46, 52, {timber:"#4a3424", roof:K.pk(["#8a3a24", "#6a4a2a", "#5a3a2a"]), chimney:r() < .7, shut:K.pk(["#3a5a7a", "#7a3a2a", "#3a6a4a"])}), {cy:30});
    K.place(270, 250, 20, (px, py) => Z.well(px, py)); for (const [x, y] of [[90, 330], [820, 330]]) K.place(x, y, 18, (px, py) => Z.hay(px, py));
    K.place(300, 420, 30, (px, py) => Z.fence([[px - 50, py], [px + 40, py - 8]]) + [0, 1, 2].map(i => `<rect x="${px - 44 + i * 30}" y="${py - 26 + i * -2}" width="24" height="12" fill="#5a6a30"/><path d="M${px - 42 + i * 30} ${py - 20 + i * -2}h20" stroke="#3a4a1e" stroke-width="2" stroke-dasharray="2 2"/>`).join(""));
    K.scatter(4, 8, (x, y) => Z.folk(x, y, K.pk(["#7a3a26", "#3a5a7a", "#5a6a30"])), {box:[200, 240, 700, 480]});
  },
  fair(K){ const r = K.r; K.dress = {veg:.5, edge:{oak:6}, mid:{bush:2}};
    // намет Котра
    K.put(222, zPavilion(K, 470, 222, 54, 92, "#c0503a", "#f2ead6", {flag:"#d9a441"})); K.claim(470, 180, 70);
    for (const [x, y, R, c, c2] of [[250, 196, 38, "#3a6ab0", "#f2ead6"], [660, 200, 40, "#5a9a4a", "#f2e0b0"], [770, 280, 34, "#b08a3a", "#5a2a2a"], [150, 300, 32, "#8a3ab0", "#f2e0b0"]]) K.place(x, y, R + 10, (px, py) => zPavilion(K, px, py, R, R * 1.7, c, c2), {cy:R});
    // гірлянда прапорців
    let bt = ""; for (let i = 0; i < 30; i++){ const t = i / 29, x = 120 + t * 680, y = 110 + Math.sin(t * 3.14) * 34; bt += `<path d="M${zr(x)} ${zr(y)}l7 0l-3.5 7z" fill="${["#c0503a", "#f2ead6", "#3a6ab0", "#d9a441", "#5a9a4a"][i % 5]}"/>`; } K.top += `<path d="M120 110Q460 178 800 110" stroke="#3a2a1a" stroke-width="1.2" fill="none"/>` + bt;
    // майське дерево
    K.place(330, 330, 12, (px, py) => zSh(px + 6, py + 2, 10, 3, .3) + `<path d="M${px} ${py}v-110" stroke="#e8dcc0" stroke-width="4"/>` + ["#c0503a", "#3a6ab0", "#d9a441", "#5a9a4a", "#f2ead6", "#8a3ab0"].map((c, i) => `<path d="M${px} ${py - 106}q${-40 + i * 16} 30 ${-48 + i * 19} 100" stroke="${c}" stroke-width="2" fill="none"/>`).join("") + `<circle cx="${px}" cy="${py - 110}" r="5" fill="#d9a441"/>`, {path:1});
    for (const [x, y, c] of [[560, 360, "#c0503a"], [640, 420, "#3a6a9a"], [400, 450, "#d9a441"], [260, 430, "#5a8a4a"]]) K.place(x, y, 28, (px, py) => Z.stall(px, py, c));
    K.place(120, 430, 30, (px, py) => Z.cart(px, py, `<path d="M${px - 20} ${py - 26}q10 -10 20 0q10 -10 20 0" fill="#c8a85a"/>`));
    for (let i = 0; i < 6; i++) K.place(200 + r() * 520, 260 + r() * 220, 8, (px, py) => r() < .5 ? Z.barrel(px, py) : Z.crate(px, py));
    for (let i = 0; i < 18; i++) K.place(180 + r() * 560, 240 + r() * 240, 6, (px, py) => Z.folk(px, py, K.pk(["#7a3a26", "#3a5a7a", "#5a6a30", "#8a6a2a", "#6a3a6a", "#a05a3a"])), {path:1, noclaim:1});
  },
  sagin(K){ const r = K.r; K.dress = {veg:.6};
    // вежа мага Сафара
    K.put(170, zTower(K, 450, 168, 34, 190, {wall:"#e2ded4", roof:"#4a5a8a", win:"#b8a0ff", door:true, flag:"#7a5ac0", rh:90})); K.claim(450, 110, 60);
    K.light(450, 60, 70, "#b8a0ff", .4);
    for (let i = 0; i < 5; i++){ const a = i * 1.26, x = 450 + Math.cos(a) * 70, y = 60 + Math.sin(a) * 18; K.top += `<path d="M${zr(x)} ${zr(y - 4)}l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#e0d4ff" opacity=".8"/>`; }
    for (const [x, y, w] of [[180, 200, 84], [720, 210, 88], [200, 470, 80], [700, 476, 84]]) K.place(x, y, 50, (px, py) => zHouse(K, px, py, w, 46, 52, {timber:"#4a3424", roof:K.pk(["#8a3a24", "#6a4a2a", "#3a4a6a"]), chimney:r() < .6}), {cy:30});
    K.place(560, 250, 12, (px, py) => Z.crystal(K, px, py, 1.2, "#b8a0ff"), {npc:1}); K.place(340, 250, 12, (px, py) => Z.crystal(K, px, py, 1, "#9ab8ff"), {npc:1});
    K.ground2 = ""; K.floor = `<ellipse cx="450" cy="214" rx="90" ry="26" fill="none" stroke="#b8a0ff" stroke-width="2" opacity=".55"/><ellipse cx="450" cy="214" rx="72" ry="20" fill="none" stroke="#b8a0ff" stroke-width="1.2" stroke-dasharray="6 4" opacity=".55"/>`;
    K.place(280, 400, 18, (px, py) => Z.well(px, py)); K.scatter(3, 8, (x, y) => Z.folk(x, y, K.pk(["#7a3a26", "#3a5a7a", "#5a6a30"])), {box:[220, 260, 700, 480]});
  },
  kab_env(K){ const r = K.r; K.dress = {veg:.7};
    K.place(200, 200, 60, (px, py) => zHouse(K, px - 40, py, 82, 46, 50, {gable:"front", timber:"#4a3424", roof:"#8a3a24", chimney:true}) + zShed(K, px + 70, py + 6, 100, 46, 50, {wall:"#8a5a3a", roof:"#5a3424", inner:Z.hay(px + 70, py + 4, .9)}), {cy:30});
    // кошара з вівцями
    const fx = 620, fy = 210; K.put(fy - 40, Z.fence([[fx - 110, fy - 40], [fx + 110, fy - 52]])); K.put(fy + 40, Z.fence([[fx - 110, fy - 40], [fx - 120, fy + 40], [fx + 100, fy + 30], [fx + 110, fy - 52]])); K.claim(fx, fy, 110);
    for (let i = 0; i < 9; i++){ const x = fx - 90 + r() * 180, y = fy - 30 + r() * 56; K.put(y, Z.sheep(x, y)); }
    for (const [x, y] of [[120, 380], [170, 410]]) K.place(x, y, 20, (px, py) => Z.hay(px, py));
    K.place(380, 210, 20, (px, py) => Z.well(px, py)); K.place(500, 440, 30, (px, py) => Z.cart(px, py));
    K.under += [[300, 140, 120, 40, "#c8a850"], [760, 380, 110, 46, "#a8a040"], [140, 140, 90, 34, "#8a9a3a"]].map(([x, y, w, h, c]) => `<g transform="translate(${x} ${y}) skewX(-20)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${c}" opacity=".85"/>${[...Array(6)].map((_, i) => `<path d="M${-w / 2} ${-h / 2 + i * h / 6}h${w}" stroke="${shade(c, .7)}" stroke-width="1.4"/>`).join("")}</g>`).join("");
  },
  mill(K){ const r = K.r; K.dress = {veg:.7};
    K.place(460, 200, 70, (px, py) => zWindmill(K, px, py, 1.15), {cy:60});
    K.place(320, 210, 50, (px, py) => zHouse(K, px, py, 80, 44, 48, {timber:"#4a3424", roof:"#7a4a2a", chimney:true}), {cy:30});
    for (let i = 0; i < 5; i++) K.place(520 + i * 14, 236 + (i % 2) * 6, 7, (px, py) => Z.sack(px, py), {noclaim:1});
    K.place(380, 440, 30, (px, py) => Z.cart(px, py, `<path d="M${px - 20} ${py - 26}h30" stroke="#cdbb92" stroke-width="8"/>`));
    K.under += [[180, 150, 130, 50, "#d0b050"], [220, 420, 120, 44, "#c09a40"], [780, 450, 100, 40, "#c8a850"]].map(([x, y, w, h, c]) => `<g transform="translate(${x} ${y}) skewX(-20)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${c}" opacity=".85"/>${[...Array(7)].map((_, i) => `<path d="M${-w / 2} ${-h / 2 + i * h / 7}h${w}" stroke="${shade(c, .7)}" stroke-width="1.4"/>`).join("")}</g>`).join("");
    for (let y = 120; y < 520; y += 130){ const x = zRiverX(y) + 52; K.place(x + 20, y, 14, (px, py) => Z.hay(px, py, .8)); }
  },
  sparkford(K){ const r = K.r; K.dress = {veg:.7, edge:{oak:5, willow:3, birch:2}};
    for (let i = -3; i <= 3; i++){ const y = 300 + i * 4, x = zRiverX(y) + i * 15; K.put(y + 4, zRock(x, y + 6, .5 + (i % 2) * .12, "#7a766c", {moss:1})); }
    for (let i = 0; i < 26; i++){ const y = 80 + r() * 440, x = zRiverX(y) + (r() * 2 - 1) * 40; K.top += zGlow(x, y, 8 + r() * 6, r() < .5 ? "#fff4b0" : "#b0f4ff", .7) + `<path d="M${zr(x)} ${zr(y - 4)}l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1z" fill="#fffbe0"/>`; }
    K.place(420, 200, 14, (px, py) => Z.menhir(px, py, 52, "#9a968a") + zGlow(px, py - 34, 18, "#b0f4ff", .6));
    K.place(780, 180, 30, (px, py) => zWillow(px, py, 1.2)); K.place(470, 470, 30, (px, py) => zWillow(px, py, 1.1));
    for (let i = 0; i < 10; i++){ const y = 90 + r() * 420, side = r() < .5 ? -1 : 1, x = zRiverX(y) + side * (58 + r() * 8); K.put(y, zReeds(x, y, 1, r)); }
  },
  north_cross(K){ const r = K.r; K.dress = {veg:.9};
    K.place(400, 200, 50, (px, py) => zHouse(K, px, py, 78, 46, 48, {wall:"#b8a080", roof:"#4a3424", timber:"#3a2a1a", chimney:true}) + Z.sign(px - 60, py + 12), {cy:30});
    K.place(220, 230, 20, (px, py) => zTower(K, px, py, 18, 80, {wall:"#7a6a50", roof:"#4a3424", flat:true}));
    K.place(470, 300, 10, (px, py) => `<path d="M${px - 40} ${py - 18}h80" stroke="#c0503a" stroke-width="5" stroke-dasharray="10 10"/><path d="M${px - 40} ${py - 18}h80" stroke="#f2ead6" stroke-width="5" stroke-dasharray="10 10" stroke-dashoffset="10"/><path d="M${px - 42} ${py}v-24" stroke="#4a3424" stroke-width="4"/>`, {path:1});
    for (let y of [150, 430]){ const x = zRiverX(y) - 30; K.put(y + 8, zPier(x - 70, y, 70) + Z.boat(x - 4, y + 18, .9)); }
    K.place(340, 420, 20, (px, py) => Z.crate(px, py) + Z.crate(px + 18, py + 4, 12) + Z.barrel(px - 16, py + 2));
    for (const [x, y] of [[300, 280], [520, 360]]) K.place(x, y, 8, (px, py) => Z.lamp(K, px, py), {path:1});
  },
  sand(K){ const r = K.r; K.dress = {veg:.6};
    const nest = (x, y, s = 1) => zSh(x + 6, y + 3, 40 * s, 10 * s, .3) + `<ellipse cx="${x}" cy="${y}" rx="${36 * s}" ry="${14 * s}" fill="#7a5a34"/><ellipse cx="${x}" cy="${y - 2}" rx="${26 * s}" ry="${9 * s}" fill="#3a2a1a"/>` + [[-8, -6], [4, -5], [-2, -10]].map(([ox, oy]) => `<ellipse cx="${x + ox * s}" cy="${y + oy * s}" rx="${6 * s}" ry="${8 * s}" fill="#f2ece0"/><ellipse cx="${x + ox * s + 2 * s}" cy="${y + oy * s + 1}" rx="${3 * s}" ry="${6 * s}" fill="#d8d0c0"/>`).join("") + [...Array(10)].map((_, i) => `<path d="M${zr(x + Math.cos(i * .63) * 34 * s)} ${zr(y + Math.sin(i * .63) * 13 * s)}l${zr(Math.cos(i * .63) * 8)} ${zr(Math.sin(i * .63) * 3 - 2)}" stroke="#8a6a44" stroke-width="1.6"/>`).join("");
    for (const [x, y, s] of [[230, 220, 1], [600, 180, 1.1], [300, 440, .9], [700, 380, .8]]) K.place(x, y, 40 * s, (px, py) => nest(px, py, s));
    K.scatter(6, 16, (x, y) => `<path d="M${zr(x - 30)} ${zr(y)}l52 -10" stroke="#8a7a5a" stroke-width="7" stroke-linecap="round"/><path d="M${zr(x - 2)} ${zr(y - 6)}l8 -14M${zr(x + 12)} ${zr(y - 8)}l10 -6" stroke="#8a7a5a" stroke-width="3" stroke-linecap="round"/>`);
    for (let i = 0; i < 6; i++) K.top += Z.crow(100 + r() * 600, 90 + r() * 80, 1.2).replace("#141210", "#f2f2ee");
  },
  order_camp(K){ const r = K.r; K.dress = {veg:.5};
    let pl = ""; for (let x = -10; x < 920; x += 13){ if (Math.abs(x - 130) < 40 || Math.abs(x - 828) < 40) continue; pl += `<path d="M${x} 112v-52l6.5 -9 6.5 9v52z" fill="${x % 26 ? "#6a4a2e" : "#5a3e26"}"/>`; } K.put(112, `<rect x="0" y="104" width="${ZW}" height="12" fill="#000" opacity=".25" filter="url(#zb1)"/>` + pl);
    K.put(230, zPavilion(K, 450, 226, 56, 96, "#ece4d0", "#9a2a2a", {flag:"#9a2a2a"})); K.claim(450, 190, 70);
    for (const [x, y] of [[250, 210], [660, 200], [740, 280], [190, 300], [700, 470]]) K.place(x, y, 40, (px, py) => zTent(K, px, py, 62, 50, 50, "#ddd6c4", {stripe:"#9a2a2a"}), {cy:20});
    K.place(330, 300, 30, (px, py) => Z.fire(K, px, py));
    for (const [x, y] of [[560, 300], [580, 360], [530, 390]]) K.place(x, y, 12, (px, py) => Z.dummy(px, py));
    K.place(240, 420, 22, (px, py) => Z.rack(px, py)); K.place(800, 180, 20, (px, py) => zTower(K, px, py, 16, 70, {wall:"#7a5a3a", roof:"#4a3424", flat:true}));
    for (const [x, y] of [[380, 160], [520, 160]]) K.place(x, y, 10, (px, py) => Z.banner(px, py, 70, "#9a2a2a", "#ece4d0"), {npc:1});
  },
  dead_wood(K){ const r = K.r; K.dress = {veg:1.5, edge:{dead:16}, mid:{dead:6, rock:5}}; K.fog = true; K.fogCol = "#c8ccc4";
    K.place(430, 300, 20, (px, py) => Z.fire(K, px, py), {path:1});
    for (const [x, y] of [[340, 260], [540, 250]]) K.place(x, y, 34, (px, py) => zTent(K, px, py, 54, 42, 44, "#4a3e32"), {cy:20});
    for (let i = 0; i < 5; i++) K.place(260 + r() * 360, 340 + r() * 140, 8, (px, py) => Z.skullPole(px, py));
    K.place(600, 420, 20, (px, py) => Z.crate(px, py, 14, "#5a4a3a") + Z.barrel(px + 22, py + 2, "#4a3e30"));
  },
  academy(K){ const r = K.r; K.dress = {veg:.9};
    K.put(210, zGothic(K, 280, 208, 150, 110, 80, {wall:"#8a8478", ruin:true, gh:56})); K.claim(280, 150, 100);
    K.put(196, zWall(K, 400, 196, 620, 186, 70, {wall:"#8a8478", ruin:true, seed:2}) + zTower(K, 680, 196, 26, 120, {wall:"#8a8478", roof:"#3a3440", win:"#c08aff"})); K.claim(560, 150, 90);
    K.floor = `<ellipse cx="470" cy="330" rx="130" ry="44" fill="none" stroke="#b07aff" stroke-width="2.4" opacity=".7"/><ellipse cx="470" cy="330" rx="100" ry="33" fill="none" stroke="#b07aff" stroke-width="1.4" stroke-dasharray="10 6" opacity=".7"/>` + [...Array(8)].map((_, i) => `<path d="M${zr(470 + Math.cos(i * .785) * 115)} ${zr(330 + Math.sin(i * .785) * 39)}l4 -6l4 6z" fill="#c08aff" opacity=".7"/>`).join("");
    K.light(470, 330, 140, "#b07aff", .35);
    for (const [x, y, s] of [[380, 360, 1.3], [580, 300, 1.1], [520, 420, .9], [660, 390, 1]]) K.place(x, y, 14, (px, py) => Z.crystal(K, px, py, s), {path:1});
    for (let i = 0; i < 10; i++) K.place(150 + r() * 650, 240 + r() * 260, 12, (px, py) => zRock(px, py, .5 + r() * .4, "#8a8478"));
  },
  doom(K){ const r = K.r; K.dress = {veg:1.6, edge:{pine:18, oak:6}, mid:{pine:5, bush:5}, line:"pine"}; K.c.mood = "dark";
    for (let i = 0; i < 7; i++){ const x = 120 + r() * 660, y = 120 + r() * 220; K.top += Z.web(x, y, 26 + r() * 18); }
    for (let i = 0; i < 8; i++) K.place(200 + r() * 500, 260 + r() * 220, 8, (px, py) => Z.cocoon(px, py + 20).replace(/M[\d.]+ [\d.]+v10/, m => m), {path:1});
    for (let i = 0; i < 8; i++){ const x = 80 + r() * 740, y = 150 + r() * 300; K.glow += `<circle cx="${zr(x)}" cy="${zr(y)}" r="2" fill="#ff3a3a"/><circle cx="${zr(x + 6)}" cy="${zr(y)}" r="2" fill="#ff3a3a"/>` + zGlow(x + 3, y, 10, "#ff3a3a", .5); }
  },
  bay(K){ const r = K.r; K.dress = {veg:.6};
    K.put(390, zSh(640, 396, 120, 18, .35) + `<path d="M520 380q80 30 200 -14l-16 -46q-80 26 -170 10z" fill="#3a2a1a"/><path d="M520 380q90 -14 184 -50l8 14q-90 42 -186 52z" fill="#5a4028"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${548 + i * 26} ${380 - i * 6}q-6 -40 6 -64" stroke="#2a1d12" stroke-width="5" fill="none"/>`).join("") + `<path d="M612 360l34 -150" stroke="#3a2a1a" stroke-width="8"/><path d="M640 220q-40 30 -30 90q30 -10 56 -50z" fill="#d8ccb0" opacity=".85"/><path d="M620 300l62 -14" stroke="#3a2a1a" stroke-width="4"/>`); K.claim(620, 340, 110);
    K.scatter(8, 14, (x, y) => r() < .5 ? Z.barrel(x, y, "#5a4028") : Z.crate(x, y, 14, "#7a5a3a"), {box:[300, 300, 760, 500]});
    K.place(160, 300, 30, (px, py) => Z.boat(px, py + 6, 1, "#5a3e26") + `<path d="M${px + 40} ${py}h40M${px + 46} ${py}v-14l14 8" stroke="#8a8478" stroke-width="1.2" fill="none"/>`, {npc:1});
    for (let i = 0; i < 8; i++) K.top += Z.crow(200 + r() * 600, 80 + r() * 80, 1.3).replace("#141210", "#f2f2ee");
  },
  citadel(K){ const r = K.r; K.dress = {veg:1, noLine:true};
    K.put(200, zWall(K, 150, 200, 760, 196, 120, {wall:"#34303a", gate:.5, gw:64, portcullis:true}) + zTower(K, 140, 206, 40, 200, {wall:"#3a3640", roof:"#16141a", win:"#ff3a3a", rh:80}) + zTower(K, 770, 202, 40, 200, {wall:"#3a3640", roof:"#16141a", win:"#ff3a3a", rh:80}) + zKeep(K, 455, 90, 120, 40, 40, {wall:"#2e2a34", win:"#ff3a3a"}));
    K.claim(450, 140, 300); K.light(455, 170, 70, "#ff3a3a", .5);
    for (const x of [250, 360, 560, 660]) K.put(205, Z.banner(x, 205, 80, "#3a1a1a", "#ff5a3a", {bh:50}));
    K.place(455, 270, 30, (px, py) => Z.stair(K, px, py, 54, "#ff3a3a"), {path:1, npc:1});
    for (let i = 0; i < 9; i++) K.top += Z.crow(150 + r() * 600, 40 + r() * 60, 1.2);
  },
});
