/* ============ входи в підземелля прямо на сцені локації ============ */
// x,y — центр входу в координатах сцени 900×528; w,h — розмір клікабельної зони; k — вигляд підказки
const ENTR = {
  crypt:      {x:559, y:250, w:130, h:92},
  citadel:    {x:455, y:168, w:108, h:122, c:1},
  abyss:      {x:622, y:236, w:150, h:112},
  ossuary:    {x:610, y:262, w:112, h:78},
  bone_crypt: {x:450, y:168, w:108, h:116, c:1},
  abbey:      {x:300, y:284, w:120, h:84},
  catacomb:   {x:648, y:288, w:120, h:84},
  night_keep: {x:450, y:166, w:104, h:116, c:1}
};
function entrancesHTML(id){
  const L = LOCS[id]; let h = "";
  for (const [nm, act] of L.buildings){
    if (!act.startsWith("dungeon:")) continue;
    const k = act.slice(8), P = ENTR[k], D = DUNGEONS[k]; if (!P || !D) continue;
    const done = (S.dung && S.dung[k]) | 0, low = S.lvl < D.lvl - 2;
    h += `<button class="entr${low ? " low" : ""}${P.c ? " cen" : ""}" data-build="${act}" ${T ? "disabled" : ""} style="left:${P.x}px;top:${P.y}px;width:${P.w}px;height:${P.h}px" aria-label="${esc(nm)}, рівень ${D.lvl}" title="${esc(nm)}">
      <i class="er"></i><i class="er r2"></i>
      <span class="eb">${svg("door", 15, "#fff", 2.2)}</span>
      <span class="el"><b>${esc(nm)}</b><u>рів. ${D.lvl}${done ? " · походів: " + done : ""}${low ? " · небезпечно" : ""}</u></span></button>`;
  }
  return h;
}
