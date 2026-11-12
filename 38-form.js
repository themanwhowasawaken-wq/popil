/* ============ розстановка 1+2+2 і вибір цілей ============ */
// П'ять місць з кожного боку: 0 центр, 1–2 по боках, 3–4 ззаду. s — масштаб (задні трохи далі).
const FORM = {
  ally:  [{x:410, y:295, s:1}, {x:340, y:165, s:1}, {x:340, y:420, s:1}, {x:208, y:232, s:.92}, {x:208, y:362, s:.92}],
  enemy: [{x:780, y:295, s:1}, {x:780, y:172, s:1}, {x:780, y:418, s:1}, {x:905, y:234, s:.92}, {x:905, y:358, s:.92}],
  enemyAt(k){ return k < 5 ? this.enemy[k] : {x:this.enemy[3 + (k % 2)].x - 40, y:this.enemy[3 + (k % 2)].y + (k % 2 ? 60 : -60), s:.85}; }
};
const SLOT_NAME = ["центр", "ліворуч", "праворуч", "ззаду", "ззаду"];
// місце ворога = його номер серед живих: коли центральний падає, наступний стає в центр
function formSlotOf(i){
  const e = B.enemies[i]; if (!alive(e)) return e.lastSlot == null ? 0 : e.lastSlot;
  let k = 0; for (let j = 0; j < i; j++) if (alive(B.enemies[j])) k++;
  e.lastSlot = k; return k;
}
// пет на флангу привертає більше ударів, ззаду менше
function petSlotTaunt(){ const k = B && B.petSlot || 3; return k === 1 || k === 2 ? .12 : k >= 3 ? -.1 : 0; }

// ---- маркери місць на землі й пет на своєму місці ----
function formMarkers(){
  const canMove = B.phase === "choose" && B.pet && B.pet.hp > 0 && !B.pick;
  let h = "";
  FORM.enemy.forEach((p, k) => { h += `<i class="slotm e" style="left:${p.x}px;top:${p.y + 56}px;scale:${p.s}"></i>`; });
  FORM.ally.forEach((p, k) => {
    const mine = k === 0, pet = B.pet && (B.petSlot || 3) === k;
    if (!mine && !pet && canMove) h += `<button class="slotm a free" data-pslot="${k}" style="left:${p.x}px;top:${p.y + 56}px;scale:${p.s}" title="Поставити пета сюди (${SLOT_NAME[k]})" aria-label="Поставити пета: ${SLOT_NAME[k]}"><b>пет сюди</b></button>`;
    else h += `<i class="slotm a${mine ? " me" : ""}${pet ? " pet" : ""}" style="left:${p.x}px;top:${p.y + 56}px;scale:${p.s}"></i>`;
  });
  return h;
}

// ---- вибір союзника для бафа чи лікування ----
const ALLY_SK = {cry:"cry", iron:"iron", hawk:"hawk", ward_sh:"absorb", mend:null};
function petAlive(){ return !!(B && B.pet && B.pet.hp > 0); }
// чи можна цю дію спрямувати на пета, і кого саме можна обрати
function allyChoices(a, itemId){
  if (!petAlive()) return null;
  if (a.startsWith("sk:")){
    const id = a.slice(3); if (!(id in ALLY_SK)) return null;
    const key = ALLY_SK[id];
    if (id === "mend") return {self:S.hp < stats().maxHp, pet:B.pet.hp < B.pet.maxHp, what:"Кого зцілити?", sk:id};
    return {self:!B[key], pet:!B.pet[key], what:"Кого підсилити?", sk:id};
  }
  if (a === "item" && itemId){
    const it = ITEMS[itemId]; if (!it) return null;
    const heal = it.scroll === "heal" || (it.use && it.use.hp && !it.scroll);
    if (!heal) return null;
    return {self:true, pet:B.pet.hp < B.pet.maxHp, what:"Кого лікувати?", sk:null};
  }
  return null;
}
function petItemHeal(itemId){
  const it = ITEMS[itemId], p = B.pet; if (!it || !p || p.hp <= 0) return false;
  const hv = it.scroll === "heal" ? Math.round(p.maxHp * .3 * Math.min(1.6, spellMul())) : it.use && it.use.hp ? Math.round(it.use.hp) : 0;
  if (!hv) return false;
  take(itemId); const h0 = p.hp; p.hp = Math.min(p.maxHp, p.hp + hv); const got = Math.round(p.hp - h0);
  fx(document.getElementById("f-pet"), "+" + got, "#8fd18a"); B.log.push([B.round, `${S.name}: ${it.name} → ${p.name}`, "+" + got, "heal"]); blog(`${it.name}: ${p.name} +${got} здоров'я.`, "good");
  return true;
}
const bact0 = act;
act = function(a, itemId){
  if (!B || B.phase !== "choose") return bact0.apply(this, arguments);
  if (a === "block"){ B.pick = null; B.allyTg = null; return bact0.apply(this, arguments); }
  const ch = B.pick ? null : allyChoices(a, itemId);
  // два варіанти: питаємо. Лише один: беремо його без питання
  if (ch && ch.self && ch.pet){ B.pick = {a, itemId, ch}; renderBattle(); return; }
  B.allyTg = ch && ch.pet && !ch.self ? "pet" : null;
  return bact0.apply(this, arguments);
};
function pickAlly(who){
  const p = B && B.pick; if (!p) return;
  if (!p.ch[who]) return;
  B.pick = null; B.allyTg = who === "pet" ? "pet" : null;
  bact0(p.a, p.itemId);
}
function pickCancel(){ if (B && B.pick){ B.pick = null; renderBattle(); } }

// ---- малювання поверх renderBattle ----
const bform0 = renderBattle;
renderBattle = function(){
  bform0();
  try {
    if (!B) return; const v = document.getElementById("view"); if (!v) return;
    const sh = v.querySelector(".bshade"); if (sh) sh.insertAdjacentHTML("afterend", formMarkers());
    // позначка вибраної цілі над ворогом
    if (B.phase === "choose" && !B.pick){ const n = B.enemies.map((e, i) => alive(e) ? i : -1).filter(i => i >= 0); n.forEach((i, k) => { const el = document.getElementById("f-e" + i); if (el && k < 9) el.dataset.key = k + 1; }); }
    if (B.pick){
      const r = v.querySelector(".ring"); if (r) r.remove();
      const ch = B.pick.ch, pn = B.pet ? B.pet.name : "Пет";
      v.insertAdjacentHTML("beforeend", `<div class="pickbar"><b>${ch.what}</b><button class="btn p" data-pickwho="self" ${ch.self ? "" : "disabled"}>Себе</button><button class="btn p" data-pickwho="pet" ${ch.pet ? "" : "disabled"}>${esc(pn)}</button><button class="btn" data-pickcancel="1">Скасувати</button></div>`);
      const pl = document.getElementById("f-p"), pe = document.getElementById("f-pet");
      if (pl && ch.self) pl.classList.add("pickable"); if (pe && ch.pet) pe.classList.add("pickable");
    }
  } catch (e) { console.error(e); }
};

// ---- кліки й клавіші ----
document.addEventListener("click", ev => {
  if (!B) return;
  const t = ev.target;
  const slot = t.closest && t.closest("[data-pslot]");
  if (slot && B.phase === "choose" && petAlive()){ ev.stopPropagation(); B.petSlot = +slot.dataset.pslot; renderBattle(); return; }
  if (B.pick){
    const w = t.closest && t.closest("[data-pickwho]"); if (w){ ev.stopPropagation(); pickAlly(w.dataset.pickwho); return; }
    if (t.closest && t.closest("[data-pickcancel]")){ ev.stopPropagation(); pickCancel(); return; }
    const f = t.closest && t.closest("#f-p,#f-pet"); if (f){ ev.stopPropagation(); pickAlly(f.id === "f-pet" ? "pet" : "self"); return; }
  }
}, true);
document.addEventListener("keydown", ev => {
  if (!B || B.phase !== "choose" || modalOpen()) return;
  const tag = (ev.target && ev.target.tagName) || ""; if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
  if (ev.key === "Escape" && B.pick){ pickCancel(); return; }
  if (/^[1-9]$/.test(ev.key) && !B.pick){
    const list = B.enemies.map((e, i) => alive(e) ? i : -1).filter(i => i >= 0), i = list[+ev.key - 1];
    if (i != null){ B.target = i; renderBattle(); }
  }
});
