/* ============ анімації й ефекти бою ============ */
// Усе тут працює поверх наявного бою: хуки на fx(), strike(), lunge(), renderBattle().
// Стани героя й ворогів малюються шаром .fxl всередині бійця; разові ефекти (удар, кров, блискавка) — частинками у #view.
let bfxLungeAt = 0, bfxEnemyLungeAt = 0;
const bfxV = () => document.getElementById("view");
function bctr(el){
  const v = bfxV(), r = el.getBoundingClientRect(), vr = v.getBoundingClientRect(), sc = vr.width / v.offsetWidth || 1;
  return {x:(r.left + r.width / 2 - vr.left) / sc, y:(r.top + r.height / 2 - vr.top) / sc, w:r.width / sc, h:r.height / sc, top:(r.top - vr.top) / sc};
}
const bBody = el => el ? (el.querySelector(".hfig") || el.querySelector(".sp") || el) : null;
function bnode(html, ms){ const v = bfxV(); if (!v) return null; const t = document.createElement("div"); t.innerHTML = html; const n = t.firstElementChild; v.appendChild(n); setTimeout(() => n.remove(), ms); return n; }
// розліт частинок
function bpart(x, y, n, o = {}){
  const v = bfxV(); if (!v) return; const cols = Array.isArray(o.c) ? o.c : [o.c || "#fff"];
  for (let i = 0; i < n; i++){
    const a = (o.up ? -Math.PI / 2 + (Math.random() - .5) * 1.7 : Math.random() * Math.PI * 2), d = (o.d || 40) * (.45 + Math.random() * .75), s = (o.s ? o.s[0] + Math.random() * (o.s[1] - o.s[0]) : 4 + Math.random() * 4);
    const p = document.createElement("i"); p.className = "bp" + (o.sq ? " sq" : "");
    p.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s * (o.sq ? 1.8 : 1)}px;background:${cols[i % cols.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d + (o.g || 0)}px;--t:${(o.t || 600) * (.7 + Math.random() * .5)}ms;${o.glow ? `box-shadow:0 0 ${s * 2}px ${cols[i % cols.length]}` : ""}`;
    v.appendChild(p); setTimeout(() => p.remove(), (o.t || 600) * 1.3);
  }
}
const KIND_FLESH = ["#b3261e", "#d0483c", "#7a1510"], KIND_BONE = ["#d8d0b8", "#a89e84", "#7a7260"], KIND_ECTO = ["#bfe8ff", "#8ac4ea", "#e8f6ff"], KIND_STONE = ["#9a9a94", "#6a6a66", "#c8c4b8"], KIND_SWAMP = ["#4a7a4a", "#2a4a2a", "#8ab07a"];
function bkindCols(type){
  try { if (isK(type, "undead")) return KIND_BONE; if (isK(type, "construct")) return KIND_STONE; if (isK(type, "water")) return KIND_SWAMP; } catch (e) {}
  const a = typeof ABIL !== "undefined" && ABIL[type]; if (a && a.includes("phase")) return KIND_ECTO;
  return KIND_FLESH;
}
function bslash(x, y, big, crit){
  const rot = -28 + Math.random() * 56, c = crit ? "#ffe9a8" : "#fff";
  bnode(`<svg class="bslash${big ? " big" : ""}" style="left:${x}px;top:${y}px;--r:${rot}deg" viewBox="0 0 120 80" aria-hidden="true"><path d="M8 62Q50 40 112 8" stroke="${c}" stroke-width="${big ? 5.5 : 4}" fill="none" stroke-linecap="round"/><path d="M14 64Q54 46 108 16" stroke="#ffb24a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/></svg>`, 420);
}
function bbolt(x, y){
  const pts = []; let cx = x + 20; for (let t = y - 330; t < y; t += 38){ pts.push(`${cx.toFixed(0)},${t}`); cx += (Math.random() - .5) * 46; } pts.push(`${x},${y}`);
  bnode(`<svg class="bbolt" style="left:0;top:0" viewBox="0 0 1216 528" aria-hidden="true"><polyline points="${pts.join(" ")}" fill="none" stroke="#bfe6ff" stroke-width="5" stroke-linejoin="bevel"/><polyline points="${pts.join(" ")}" fill="none" stroke="#fff" stroke-width="2"/></svg><i class="bflash"></i>`, 380);
  bpart(x, y, 10, {c:["#bfe6ff", "#fff", "#7ab8ff"], d:52, s:[3, 6], t:420, glow:1});
  bnode(`<i class="bring" style="left:${x}px;top:${y}px;border-color:#9fd8ff;--s:2.4"></i>`, 520);
}
function bfire(x, y){
  for (let i = 0; i < 7; i++) bnode(`<i class="bfl" style="left:${x + (Math.random() - .5) * 64}px;top:${y + 26 + Math.random() * 10}px;animation-delay:${i * 40}ms;--h:${50 + Math.random() * 40}px"></i>`, 1000);
  bpart(x, y, 12, {c:["#ffb24a", "#ff7a2a", "#ffe08a"], d:60, up:1, s:[3, 6], t:700, glow:1});
  bnode(`<i class="bring" style="left:${x}px;top:${y + 10}px;border-color:#ff9a3a;--s:2.2"></i>`, 520);
}
function bholy(x, y){
  bnode(`<i class="bsun" style="left:${x}px;top:${y}px"></i>`, 700);
  bpart(x, y, 10, {c:["#fff7c8", "#ffe08a", "#b7f0a0"], d:56, up:1, s:[3, 5], t:700, glow:1});
}
function bheal(x, y, col){ bpart(x, y + 14, 9, {c:[col || "#8fd18a", "#d8ffd0", "#fff"], d:46, up:1, s:[3, 6], t:900, glow:1}); bnode(`<i class="bring" style="left:${x}px;top:${y + 34}px;border-color:${col || "#8fd18a"};--s:1.7"></i>`, 520); }
function bshake(ms = 260, big){ const v = bfxV(); if (!v) return; v.classList.remove("shk", "shk2"); void v.offsetWidth; v.classList.add(big ? "shk2" : "shk"); setTimeout(() => v.classList.remove("shk", "shk2"), ms); }
function bcls(el, c, ms){ if (!el) return; el.classList.remove(c); void el.offsetWidth; el.classList.add(c); setTimeout(() => el && el.classList.remove(c), ms); }

// ---- хук на числа шкоди: усе, що показує fx(), отримує свій візуальний ефект ----
const bfx0 = fx;
fx = function(el, text, color){
  bfx0(el, text, color);
  try { bfxEvent(el, String(text), color); } catch (e) {}
};
function bfxEvent(el, text, color){
  if (!B || !el || !el.id) return;
  const dmg = /^[-−]\d/.test(text), amt = dmg ? parseInt(text.replace("−", "-").slice(1)) : 0;
  if (el.id === "f-p"){
    const b = bBody(el), c = bctr(b), st = stats(), heavy = amt > st.maxHp * .14;
    const late = performance.now() - bfxEnemyLungeAt < 90 ? 170 : 0;
    if (dmg){
      if (/отрута/.test(text)){ bpart(c.x, c.y + 10, 9, {c:["#7fd04a", "#4a9a2a", "#c8ff9a"], d:34, up:1, s:[4, 8], t:800}); bcls(el, "tint-poison", 500); return; }
      if (/кровотеча/.test(text)){ bpart(c.x, c.y, 7, {c:KIND_FLESH, d:30, g:30, s:[3, 6], t:600}); bcls(el, "hurt", 380); return; }
      if (/опік/.test(text)){ bpart(c.x, c.y + 20, 8, {c:["#ffb24a", "#ff7a2a"], d:34, up:1, s:[3, 6], t:600, glow:1}); bcls(el, "hurt", 380); return; }
      setTimeout(() => {
        const cc = bctr(bBody(el)); bpart(cc.x, cc.y - 10, heavy ? 14 : 8, {c:KIND_FLESH, d:heavy ? 62 : 42, g:34, s:[3, 7], t:650});
        bcls(el, "hurt", 420); bflashEl(bBody(el)); if (heavy) bshake(280, true); else if (amt > st.maxHp * .06) bshake(200);
      }, late);
    } else if (/ухилення|сліпота|крізь/.test(text)) setTimeout(() => bcls(el, "dodge", 420), late);
    else if (/^\+/.test(text)) bheal(c.x, c.y, /ffe08a/i.test(color) ? "#ffe08a" : "#8fd18a");
    else if (/^блок$/.test(text)) bshield(c.x + 28, c.y, "#9fc2ea");
    else if (/^щит/.test(text)) bshield(c.x + 28, c.y, "#9fc2ea");
    else if (/^лють/.test(text)) { bpart(c.x, c.y + 10, 14, {c:["#ff7a2a", "#ffb24a", "#ff4a2a"], d:50, up:1, s:[4, 8], t:800, glow:1}); bnode(`<i class="bring" style="left:${c.x}px;top:${c.y + 30}px;border-color:#ff7a2a;--s:2.6"></i>`, 520); }
    return;
  }
  if (el.id === "f-pet"){
    const c = bctr(bBody(el));
    if (dmg){ bpart(c.x, c.y, 7, {c:KIND_FLESH, d:36, g:26, t:600}); bcls(el, "hurt", 420); } else if (/ухилення/.test(text)) bcls(el, "dodge", 420); else if (/^\+/.test(text)) bheal(c.x, c.y);
    return;
  }
  const m = /^f-e(\d+)$/.exec(el.id); if (!m) return;
  const i = +m[1], e = B.enemies[i], sp = bBody(el), c = bctr(sp), late = performance.now() - bfxLungeAt < 90 ? 190 : 0;
  if (dmg){
    const crit = /!$/.test(text), big = crit || (e && amt > e.maxHp * .12), cols = bkindCols(e ? e.type : "");
    setTimeout(() => {
      const cc = bctr(bBody(el)); bcls(el, "hit", 360); bflashEl(bBody(el), crit);
      if (/блискавка/.test(text)) bbolt(cc.x, cc.y);
      else if (/вогонь|опік/.test(text)) bfire(cc.x, cc.y);
      else if (/оберіг/.test(text)) bholy(cc.x, cc.y);
      else if (/кровотеча/.test(text)) bpart(cc.x, cc.y, 7, {c:KIND_FLESH, d:30, g:30, t:600});
      else if (/отрута/.test(text)) bpart(cc.x, cc.y, 8, {c:["#7fd04a", "#4a9a2a"], d:30, up:1, t:700});
      else { bslash(cc.x, cc.y - 6, big, crit); bpart(cc.x, cc.y, big ? 13 : 7, {c:cols, d:big ? 66 : 44, g:30, s:[3, 7], t:620, sq:cols === KIND_STONE || cols === KIND_BONE}); }
      if (crit){ bpart(cc.x, cc.y, 8, {c:["#ffe9a8", "#fff"], d:70, s:[3, 5], t:500, glow:1}); bshake(240); } else if (big) bshake(200);
    }, late);
  } else if (/ухилення|крізь/.test(text)) bcls(el, "dodge", 420);
  else if (/^\+/.test(text)) bheal(c.x, c.y, /ffe08a/i.test(color) ? "#ffe08a" : "#8fd18a");
  else if (/^щит/.test(text)) bshield(c.x, c.y, "#9fc2ea");
  else if (/повстає/.test(text)){ bpart(c.x, c.y + 20, 14, {c:KIND_BONE, d:54, up:1, s:[3, 7], t:800, sq:1}); bcls(el, "rise", 700); }
  else if (/прокляття/.test(text)){ bpart(c.x, c.y, 12, {c:["#a46ae0", "#6a2aa8", "#d8b0ff"], d:50, up:1, s:[4, 8], t:900, glow:1}); bnode(`<i class="bring" style="left:${c.x}px;top:${c.y + 10}px;border-color:#a46ae0;--s:2.2"></i>`, 520); }
}
function bshield(x, y, col){
  bnode(`<svg class="bsh" style="left:${x}px;top:${y}px" viewBox="0 0 60 90" aria-hidden="true"><path d="M30 4Q58 16 56 46Q52 74 30 86Q8 74 4 46Q2 16 30 4Z" fill="${col}" fill-opacity=".25" stroke="${col}" stroke-width="3"/><path d="M30 14Q48 22 46 46Q43 66 30 76" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/></svg>`, 650);
}
function bflashEl(el, crit){ if (!el) return; el.classList.remove("flash", "flash2"); void el.offsetWidth; el.classList.add(crit ? "flash2" : "flash"); setTimeout(() => el && el.classList.remove("flash", "flash2"), 300); }

// ---- випад героя: удар підходить до цілі, а не стоїть на місці ----
const bstrike0 = strike;
strike = function(tg, kind, me){
  try {
    const i = B.enemies.indexOf(tg), eEl = document.getElementById("f-e" + i), pEl = document.getElementById("f-p");
    if (pEl && eEl){
      const pc = bctr(pEl), ec = bctr(eEl);
      if (kind === "volley") bproj(pc.x + 20, pc.y - 10, ec.x, ec.y, "arrow");
      else {
        const dx = Math.max(60, ec.x - pc.x - 150);
        pEl.style.setProperty("--dx", dx + "px"); pEl.classList.remove("lunge", "heavy"); void pEl.offsetWidth; pEl.classList.add("lunge"); if (kind === "strong") pEl.classList.add("heavy");
        setTimeout(() => { if (pEl) pEl.classList.remove("lunge", "heavy"); }, 580);
        bfxLungeAt = performance.now();
      }
    }
  } catch (e) {}
  return bstrike0.apply(this, arguments);
};
function bproj(x0, y0, x1, y1, kind){
  const n = bnode(`<i class="bpj ${kind}" style="left:${x0}px;top:${y0}px"></i>`, 520); if (!n) return;
  const a = Math.atan2(y1 - y0, x1 - x0); n.style.rotate = a + "rad";
  requestAnimationFrame(() => requestAnimationFrame(() => { n.style.left = x1 + "px"; n.style.top = y1 + "px"; n.style.opacity = ".9"; }));
}
// випад ворога до героя
const blunge0 = lunge;
lunge = function(i){
  blunge0(i);
  try {
    const f = document.getElementById("f-e" + i), p = document.getElementById("f-p"); if (!f || !p) return;
    const ec = bctr(f), pc = bctr(p); f.style.setProperty("--dx", -Math.max(80, ec.x - pc.x - 140) + "px");
    f.classList.remove("atk"); void f.offsetWidth; f.classList.add("atk"); setTimeout(() => f && f.classList.remove("atk"), 620); bfxEnemyLungeAt = performance.now();
  } catch (e) {}
};

// ---- стани: шар .fxl у бійці, оновлюється після кожного renderBattle ----
const BFX_E = {
  rage:   {back:'<i class="lyr rg"></i>', front:'<i class="stm" style="left:34%"></i><i class="stm" style="left:58%;animation-delay:-.5s"></i>'},
  phase:  {front:[0, 1, 2].map(k => `<i class="bwp blu" style="left:${24 + k * 24}%;animation-delay:${-k * .8}s"></i>`).join("")},
  ward:   {front:'<svg class="lyr rn" viewBox="0 0 130 120" aria-hidden="true"><ellipse cx="65" cy="98" rx="54" ry="13" fill="none" stroke="#9fd8ff" stroke-width="2" stroke-dasharray="7 5"/><ellipse cx="65" cy="98" rx="62" ry="16" fill="none" stroke="#9fd8ff" stroke-opacity=".4" stroke-width="1"/><g class="rg4"><path d="M10 98l4-5 4 5-4 5z M112 98l4-5 4 5-4 5z M62 80l4-5 4 5-4 5z M62 114l4-5 4 5-4 5z" fill="#bfe8ff"/></g></svg>'},
  thorns: {front:'<svg class="lyr th" viewBox="0 0 130 120" aria-hidden="true"><g fill="#b8b0a0" stroke="#2a2620" stroke-width="1"><path d="M30 34l-9-13 14 7z M50 22l-4-16 11 11z M72 20l3-17 9 14z M94 30l11-12 -1 16z M104 54l16-6 -8 14z M24 58l-17-5 15-7z M112 78l12 8 -16 3z M18 82l-13 8 17 2z"/></g></svg>'},
  burning:{front:[0, 1, 2, 3, 4].map(k => `<i class="bfl on" style="left:${18 + k * 17}%;bottom:${20 + (k % 2) * 28}px;animation-delay:${-k * .22}s"></i>`).join("")},
  ember:  {front:[0, 1, 2].map(k => `<i class="bem" style="left:${30 + k * 20}%;animation-delay:${-k * .8}s"></i>`).join("")},
  curse:  {back:'<i class="lyr cu"></i>', front:[0, 1, 2].map(k => `<i class="bwp" style="left:${28 + k * 22}%;animation-delay:${-k * .7}s"></i>`).join("")},
  mark:   {front:'<svg class="lyr mk" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="13" fill="none" stroke="#ff4a3a" stroke-width="2.5"/><path d="M20 2v10M20 28v10M2 20h10M28 20h10" stroke="#ff4a3a" stroke-width="2.5"/><circle cx="20" cy="20" r="2.5" fill="#ff4a3a"/></svg>'},
  stun:   {front:'<div class="lyr sn"><b>★</b><b>★</b><b>★</b></div>'},
  eshield:{front:'<i class="lyr bub"></i>'},
  sunder: {front:'<svg class="lyr sd" viewBox="0 0 130 120" aria-hidden="true"><path d="M52 46l10 12-8 6 12 14-6 10M78 40l-8 14 10 6-8 12" fill="none" stroke="#e8e0cc" stroke-width="2.2" stroke-linecap="round" opacity=".85"/></svg>'},
  venom:  {front:[0, 1].map(k => `<i class="bdp" style="left:${42 + k * 22}%;animation-delay:${-k * .9}s"></i>`).join("")}
};
const BFX_H = {
  bleed:  {front:[0, 1, 2, 3].map(k => `<i class="bdp r" style="left:${28 + k * 15}%;animation-delay:${-k * .4}s"></i>`).join("")},
  poison: {front:[0, 1, 2, 3].map(k => `<i class="bbb" style="left:${20 + k * 18}%;animation-delay:${-k * .5}s"></i>`).join("")},
  burnMe: {front:[0, 1, 2].map(k => `<i class="bfl on" style="left:${24 + k * 24}%;bottom:${4 + (k % 2) * 8}px;animation-delay:${-k * .25}s"></i>`).join("")},
  web:    {front:'<svg class="lyr web" viewBox="0 0 86 158" aria-hidden="true"><g fill="none" stroke="#f4f2ea" stroke-width="1.3" stroke-opacity=".85"><path d="M43 6V152M4 40L82 120M82 40L4 120M4 80H82"/><path d="M43 36L22 48 14 80 24 112 43 124 62 112 72 80 64 48Z"/><path d="M43 58L32 66 29 80 34 94 43 100 52 94 57 80 54 66Z"/><path d="M43 18L10 36 2 80 12 128 43 146 74 128 84 80 76 36Z" stroke-opacity=".6"/></g></svg>'},
  held:   {front:'<svg class="lyr hd" viewBox="0 0 86 158" aria-hidden="true"><ellipse class="rp" cx="43" cy="150" rx="26" ry="6" fill="none" stroke="#6a9a8a" stroke-width="2"/><ellipse class="rp r2" cx="43" cy="150" rx="26" ry="6" fill="none" stroke="#6a9a8a" stroke-width="2"/><path d="M20 158Q18 136 24 120Q22 112 28 112L28 120Q30 108 34 110L34 122Q36 108 40 110L40 124Q43 112 46 114L44 130Q58 126 54 142Q50 158 50 158Z" fill="#1e3a34" stroke="#0a1a16" stroke-width="1.5"/><path d="M66 158Q68 138 62 122Q64 114 58 114L58 122Q56 110 52 112L52 124Q50 112 46 114" fill="#26463e" stroke="#0a1a16" stroke-width="1.5"/></svg>'},
  weak:   {front:'<svg class="lyr wk" viewBox="0 0 30 30" aria-hidden="true"><path d="M15 26L4 12H11V4H19V12H26Z" fill="#9a9a94" stroke="#2a2a28" stroke-width="1.5"/></svg>'},
  armBreak:{front:'<svg class="lyr sd" viewBox="0 0 86 158" aria-hidden="true"><path d="M34 52l9 12-7 6 10 14-5 9M56 50l-7 12 9 5-6 12" fill="none" stroke="#e8e0cc" stroke-width="2.2" stroke-linecap="round"/></svg>'},
  rage:   {back:'<i class="lyr hrg"></i>', front:'<i class="hfl" style="left:8%"></i><i class="hfl" style="left:44%;animation-delay:-.3s"></i><i class="hfl" style="left:76%;animation-delay:-.6s"></i>'},
  cry:    {front:'<i class="bring loop" style="border-color:#e8c36a"></i><i class="bring loop l2" style="border-color:#e8c36a"></i>'},
  hawk:   {front:'<svg class="lyr hk" viewBox="0 0 40 24" aria-hidden="true"><path d="M2 12Q20 -2 38 12Q20 26 2 12Z" fill="#2a1a0a" stroke="#e8c36a" stroke-width="2"/><circle cx="20" cy="12" r="5" fill="#ffe08a"/><circle cx="20" cy="12" r="2" fill="#000"/></svg>'},
  absorb: {front:'<i class="lyr bub gold"></i>'},
  shield: {front:'<svg class="lyr shf" viewBox="0 0 60 90" aria-hidden="true"><path d="M30 4Q58 16 56 46Q52 74 30 86Q8 74 4 46Q2 16 30 4Z" fill="#9fc2ea" fill-opacity=".22" stroke="#9fc2ea" stroke-width="2.5"/></svg>'},
  block:  {front:'<svg class="lyr shf big" viewBox="0 0 60 90" aria-hidden="true"><path d="M30 4Q58 16 56 46Q52 74 30 86Q8 74 4 46Q2 16 30 4Z" fill="#cfe4ff" fill-opacity=".3" stroke="#fff" stroke-width="3"/><path d="M30 14Q48 22 46 46Q43 66 30 76" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/></svg>'},
  iron:   {front:'<i class="lyr irs"></i>'}
};
function bEnemyStates(e){
  const s = [], A = typeof ABIL !== "undefined" ? (ABIL[e.type] || []) : [];
  if (e.raged) s.push("rage"); if (A.includes("phase")) s.push("phase"); if (e.spellward) s.push("ward"); if (A.includes("thorns")) s.push("thorns");
  if (e.burn > 0) s.push("burning"); else if (A.includes("burn")) s.push("ember"); if (e.curse > 0) s.push("curse"); if (e.mark) s.push("mark");
  if (e.stun) s.push("stun"); if (e.eshield > 0) s.push("eshield"); if (e.sunder) s.push("sunder"); if (e.venom || A.includes("venom")) s.push("venom");
  return s;
}
function bHeroStates(){
  const s = []; for (const k of ["bleed", "poison", "burnMe", "web", "held", "weak", "armBreak", "rage", "cry", "hawk", "absorb", "shield", "block", "iron"]) if (B[k] > 0 || B[k] === true) s.push(k);
  return s;
}
function bLayer(el, host, states, MAP, prev){
  if (!host) return;
  let L = host.querySelector(":scope > .fxl"), Bk = host.querySelector(":scope > .fxb");
  if (L) L.remove(); if (Bk) Bk.remove();
  [...el.classList].filter(c => c.startsWith("st-")).forEach(c => el.classList.remove(c));
  const front = states.map(k => MAP[k] && MAP[k].front || "").join(""), back = states.map(k => MAP[k] && MAP[k].back || "").join("");
  if (back){ Bk = document.createElement("span"); Bk.className = "fxb"; Bk.innerHTML = back; host.prepend(Bk); }
  if (front){ L = document.createElement("span"); L.className = "fxl"; L.innerHTML = front; host.appendChild(L); }
  for (const k of states) el.classList.add("st-" + k);
}
const BFX_COL = {bleed:"#d0483c", poison:"#7fd04a", burnMe:"#ff9a3a", web:"#f4f2ea", held:"#6a9a8a", weak:"#9a9a94", armBreak:"#e8e0cc", rage:"#ff7a2a", cry:"#e8c36a", hawk:"#e8c36a", absorb:"#e8c36a", shield:"#9fc2ea", iron:"#c8d0d8", curse:"#a46ae0", mark:"#ff4a3a", stun:"#ffe08a", eshield:"#9fc2ea", burning:"#ff9a3a"};
function bfxSync(){
  if (!B) return; bfxObserve();
  const v = bfxV(); if (!v) return;
  const first = !B.fxSeen; if (first){ B.fxSeen = new Set(B.enemies); B.fxPrev = {}; }
  const prev = B.fxPrev;
  // герой
  const pl = document.getElementById("f-p");
  if (pl){
    const st = bHeroStates(); bLayer(pl, pl.querySelector(".hfig"), st, BFX_H);
    const old = prev["p"] || []; for (const k of st) if (!old.includes(k) && BFX_COL[k] && !first){ const c = bctr(bBody(pl)); bnode(`<i class="bring" style="left:${c.x}px;top:${c.y + 30}px;border-color:${BFX_COL[k]};--s:2.3"></i>`, 520); }
    prev["p"] = st;
  }
  const pe = document.getElementById("f-pet");
  if (pe && B.pet){ const ps = ["cry", "iron", "hawk"].filter(k => B.pet[k] > 0); if (B.pet.absorb > 0) ps.push("absorb"); bLayer(pe, pe.querySelector(".sp"), ps, BFX_H); prev.pet = ps; }
  B.enemies.forEach((e, i) => {
    const el = document.getElementById("f-e" + i); if (!el) return;
    const st = alive(e) ? bEnemyStates(e) : []; bLayer(el, el.querySelector(".sp"), st, BFX_E);
    const key = "e" + i, old = prev[key] || []; for (const k of st) if (!old.includes(k) && BFX_COL[k] && !first){ const c = bctr(bBody(el)); bnode(`<i class="bring" style="left:${c.x}px;top:${c.y + 20}px;border-color:${BFX_COL[k]};--s:2"></i>`, 520); }
    prev[key] = st;
    el.style.setProperty("--bd", (3.2 + (i % 3) * .55 + (e.lvl % 5) * .07).toFixed(2) + "s"); el.style.setProperty("--bdl", (-i * 1.1).toFixed(1) + "s");
    if (!B.fxSeen.has(e)){ B.fxSeen.add(e); el.classList.add("enter"); setTimeout(() => el && el.classList.remove("enter"), 800); }
  });
  v.classList.toggle("bfx-blind", !!B.blind);
  let vg = v.querySelector(".bvig"); if (B.blind && !vg){ vg = document.createElement("div"); vg.className = "bvig"; v.appendChild(vg); } else if (!B.blind && vg) vg.remove();
}
const brenderBattle0 = renderBattle;
renderBattle = function(){ brenderBattle0(); try { bfxSync(); } catch (e) { console.error(e); } };

// ---- смерть ворога: розліт уламків, коли клас dead з'являється на живому елементі ----
let bfxObs = null;
function bfxObserve(){
  const v = bfxV(); if (!v || bfxObs) return;
  bfxObs = new MutationObserver(ms => {
    if (!B) return;
    for (const m of ms){
      const t = m.target; if (!t.classList || !t.classList.contains("fighter") || !t.classList.contains("dead")) continue;
      if (/\bdead\b/.test(m.oldValue || "")) continue;
      const i = /^f-e(\d+)$/.exec(t.id); if (!i) continue; const e = B.enemies[+i[1]]; const c = bctr(bBody(t));
      bpart(c.x, c.y + 10, 16, {c:bkindCols(e ? e.type : ""), d:70, g:28, s:[3, 8], t:800, sq:1});
      bnode(`<i class="bdust" style="left:${c.x}px;top:${c.y + 40}px"></i>`, 900);
    }
  });
  bfxObs.observe(v, {attributes:true, attributeFilter:["class"], attributeOldValue:true, subtree:true});
}
