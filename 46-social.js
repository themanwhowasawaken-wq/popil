/* ============ звук, погода, дуелі з жителями, супутники, нові вміння мобів ============ */
const isDuelMob = e => !!e && /^duel_/.test(e.type);
const isLive = () => typeof S !== "undefined" && S && typeof READY !== "undefined" && READY;

/* ---------------- ЗВУК: усе синтезується в браузері, файлів немає ---------------- */
const SND = (() => {
  let ctx = null, master = null, wind = null, rain = null, cache = {};
  const on = () => !(S && S.opt && S.opt.snd === false);
  function init(){
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return ctx; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; return null; }
    master = ctx.createGain(); master.gain.value = .55; master.connect(ctx.destination); return ctx;
  }
  function nbuf(sec){
    if (cache[sec]) return cache[sec]; const n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return cache[sec] = b;
  }
  function tone(f0, f1, dur, type, vol, delay = 0){
    const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(.0008, t + dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .02);
  }
  function noise(dur, vol, f0, f1, q = .8, delay = 0, kind = "bandpass"){
    const t = ctx.currentTime + delay, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = nbuf(1); f.type = kind; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0008, t + dur); s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * .5); s.stop(t + dur + .02);
  }
  const SFX = {
    hit(p = 1){ noise(.09, .55, 1800 * p, 300, 1.2); tone(190 * p, 55, .14, "triangle", .55); },
    crit(p = 1){ noise(.12, .7, 2600 * p, 260, 1.4); tone(240 * p, 50, .2, "sawtooth", .35); tone(1200, 1800, .12, "square", .12, .03); tone(90, 40, .3, "sine", .5, .02); },
    miss(){ noise(.16, .22, 400, 2400, .6); },
    hurt(){ tone(150, 45, .22, "sawtooth", .4); noise(.1, .4, 900, 200, 1); },
    block(){ tone(880, 760, .12, "square", .16); tone(1320, 1100, .1, "triangle", .14, .01); noise(.05, .3, 4000, 2000, 2); },
    heal(){ [523, 659, 784, 1047].forEach((f, i) => tone(f, f * 1.01, .35, "sine", .16, i * .07)); },
    spell(){ noise(.45, .35, 300, 3200, .9); tone(300, 900, .4, "sawtooth", .12); },
    fire(){ noise(.5, .5, 2400, 300, .5, 0, "lowpass"); tone(120, 70, .4, "sawtooth", .2); },
    bolt(){ noise(.25, .7, 5000, 200, .5); tone(2200, 90, .3, "sawtooth", .25); },
    thunder(){ noise(2.2, .7, 160, 40, .4, 0, "lowpass"); tone(60, 30, 1.8, "sine", .5); },
    die(){ tone(200, 40, .5, "sawtooth", .35); noise(.4, .3, 500, 80, .8); },
    win(){ [392, 523, 659, 784].forEach((f, i) => { tone(f, f, .22, "triangle", .3, i * .13); }); tone(1047, 1047, .7, "triangle", .3, .54); },
    lose(){ [330, 262, 220, 165].forEach((f, i) => tone(f, f * .97, .45, "triangle", .3, i * .22)); },
    lvl(){ [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, f, .3, "sine", .22, i * .09)); },
    coin(){ tone(1568, 1568, .12, "square", .1); tone(2093, 2093, .22, "square", .1, .07); },
    click(){ tone(660, 520, .04, "square", .05); },
    flee(){ noise(.5, .3, 300, 1800, .7); },
    summon(){ tone(110, 220, .6, "sawtooth", .18); noise(.5, .3, 200, 900, 1); },
    shriek(){ tone(1600, 2400, .35, "sawtooth", .12); tone(1400, 2600, .3, "square", .06, .05); },
    gallop(){ for (let i = 0; i < 4; i++) tone(90, 60, .08, "triangle", .3, i * .09); },
  };
  function play(k, a){ if (!on() || !init()) return; try { if (SFX[k]) SFX[k](a); } catch (e) {} }
  // фон: вітер і дощ рівнями 0..1
  function ensureAmb(){
    if (wind || !init()) return !!wind;
    const mk = (type, f, q) => { const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = nbuf(2); s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q; g.gain.value = 0; s.connect(fl); fl.connect(g); g.connect(master); s.start(); return {g, fl}; };
    wind = mk("bandpass", 380, .6); rain = mk("highpass", 3200, .3);
    // повільне хвилювання вітру
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .17; lg.gain.value = 140; lfo.connect(lg); lg.connect(wind.fl.frequency); lfo.start(); return true;
  }
  function ambient(w, r){
    if (!ctx) return; if (!on()) w = r = 0; if (!ensureAmb()) return; const t = ctx.currentTime;
    wind.g.gain.setTargetAtTime(w * .09, t, .8); rain.g.gain.setTargetAtTime(r * .07, t, .8);
  }
  document.addEventListener("pointerdown", () => { if (isLive() && on()) init(); }, {passive:true});
  document.addEventListener("click", e => { if (isLive() && e.target.closest && e.target.closest("button") && !e.target.closest(".mob,.fighter,.ract")) play("click"); }, true);
  return {play, ambient, init, on};
})();

// хуки: усе чутно саме від подій бою
{ const fx0 = fx;
  fx = function(el, text, color){
    try {
      const id = el && el.id || "", t = String(text);
      if (t === "ухилення") SND.play("miss");
      else if (/^-\d/.test(t)){ if (id === "f-p" || id === "f-comp") SND.play(/отрута|кровотеча|опік/.test(t) ? "hurt" : "hurt"); else if (id === "f-pet") SND.play("hurt"); else { const sz = (B && B.enemies[+id.replace("f-e", "")] || {}).size || 1; SND.play(/крит|!/.test(t) ? "crit" : "hit", 1.15 / Math.sqrt(sz)); } }
      else if (/^\+\d/.test(t)) SND.play("heal");
      else if (/^щит/.test(t)) SND.play("block");
    } catch (e) {}
    return fx0(el, text, color);
  };
  const eb = endBattle;
  endBattle = function(res){
    try { SND.play(res === "win" ? "win" : res === "lose" ? "lose" : "flee"); } catch (e) {}
    const b = B;
    if (b && b.comp && res !== "flee" && S.comp){ S.comp.left--; if (S.comp.left <= 0){ msg(`${NPCS[S.comp.id].name} завершив найм і йде у своїх справах.`, "warn"); S.comp = null; } }
    return eb(res);
  };
  const gx = gainXp;
  gainXp = function(x){ const l = S.lvl; gx(x); if (S.lvl > l) SND.play("lvl"); };
}

/* ---------------- ПОГОДА: шар частинок поверх сцени ---------------- */
const WX = {cv:null, ctx:null, kind:null, ps:[], flash:0, raf:0, id:null, last:0};
function hash32(s){ let h = 2166136261; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function wxBiome(id){ const c = SCENE[id] || {}; if (c.b) return c.b; const n = NODES[id]; return n && n.biome || null; }
// яка погода зараз у локації: сніг на горах, туман у багнах, інше залежить від часу доби й дня
function wxOf(id){
  const b = wxBiome(id); if (!b) return null;
  if (b === "snow") return "snow";
  if (b === "swamp" || b === "lake") return "fog";
  if (b === "sand" || b === "salt") return "dust";
  const d = new Date(), seed = hash32(id + ":" + d.getFullYear() + d.getMonth() + d.getDate() + ":" + Math.floor(d.getHours() / 4)) % 100;
  if (b === "dark" || b === "ash") return seed < 30 ? "ash" : seed < 45 ? "fog" : null;
  if (seed < 18) return "rain"; if (seed < 25) return "storm"; if (seed < 36) return "fog"; return null;
}
function wxScene(){
  if (!isLive()) return null; if (S.opt && S.opt.wx === false) return null;
  if (B) return B.origin === "dungeon" ? null : (B.scene || S.loc); if (DG || T) return null; if (UI.view !== "loc") return null; return S.loc;
}
function wxSpawn(kind, W, H, init){
  const r = Math.random;
  if (kind === "rain" || kind === "storm") return {x:r() * (W + 200) - 100, y:init ? r() * H : -20, vx:-3.2 - r() * 1.2, vy:15 + r() * 7, l:11 + r() * 9, a:.25 + r() * .3};
  if (kind === "snow") return {x:r() * W, y:init ? r() * H : -10, vx:-.6 + r() * 1.2, vy:.8 + r() * 1.5, s:1.2 + r() * 2.4, ph:r() * 6.28, a:.55 + r() * .4};
  if (kind === "ash") return {x:r() * W, y:init ? r() * H : -10, vx:.3 + r() * .8, vy:.5 + r() * 1.1, s:1 + r() * 2, ph:r() * 6.28, a:.35 + r() * .35};
  if (kind === "dust") return {x:init ? r() * W : -20, y:r() * H, vx:4 + r() * 5, vy:-.2 + r() * .5, s:1 + r() * 2.2, ph:r() * 6.28, a:.18 + r() * .25};
  return {x:init ? r() * W : -60, y:r() * H, vx:.25 + r() * .35, vy:0, s:90 + r() * 140, ph:r() * 6.28, a:.05 + r() * .07};
}
function wxAttach(){
  const v = document.getElementById("view"), id = wxScene(), kind = id ? wxOf(id) : null;
  if (!v || !kind){ if (WX.cv && WX.cv.parentNode) WX.cv.remove(); WX.kind = null; SND.ambient(0, 0); return; }
  if (!WX.cv || WX.cv.parentNode !== v){
    if (WX.cv && WX.cv.parentNode) WX.cv.remove();
    const c = document.createElement("canvas"); c.className = "wxc"; c.width = v.offsetWidth || 900; c.height = v.offsetHeight || 528; v.appendChild(c); WX.cv = c; WX.ctx = c.getContext("2d"); WX.kind = null;
  }
  if (WX.kind !== kind || WX.id !== id){
    WX.kind = kind; WX.id = id; const W = WX.cv.width, H = WX.cv.height, n = {rain:170, storm:300, snow:130, ash:55, dust:50, fog:9}[kind] || 0;
    WX.ps = Array.from({length:n}, () => wxSpawn(kind, W, H, true)); WX.flash = 0;
  }
  SND.ambient(kind === "snow" ? .7 : kind === "dust" ? .8 : kind === "storm" ? 1 : kind === "ash" ? .4 : kind === "fog" ? .25 : .2, kind === "rain" ? .8 : kind === "storm" ? 1 : 0);
  if (!WX.raf) WX.raf = requestAnimationFrame(wxTick);
}
function wxTick(ts){
  WX.raf = 0; const c = WX.cv; if (!c || !c.isConnected || !WX.kind) return;
  const g = WX.ctx, W = c.width, H = c.height, k = WX.kind, dt = Math.min(2, (ts - (WX.last || ts)) / 16.7); WX.last = ts;
  g.clearRect(0, 0, W, H);
  if (k === "fog"){
    for (const p of WX.ps){ p.x += p.vx * dt; if (p.x - p.s > W) p.x = -p.s; const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s); gr.addColorStop(0, `rgba(210,215,215,${p.a * 1.6})`); gr.addColorStop(1, "rgba(210,215,215,0)"); g.fillStyle = gr; g.fillRect(p.x - p.s, p.y - p.s, p.s * 2, p.s * 2); }
    g.fillStyle = "rgba(190,198,198,.08)"; g.fillRect(0, 0, W, H);
  } else {
    if (k === "rain" || k === "storm"){ g.strokeStyle = "rgba(200,215,235,.6)"; g.lineWidth = 1.1; g.beginPath(); }
    for (let i = 0; i < WX.ps.length; i++){
      const p = WX.ps[i];
      if (k === "rain" || k === "storm"){ p.x += p.vx * dt; p.y += p.vy * dt; g.globalAlpha = p.a; g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * p.l / 8, p.y - p.vy * p.l / 8 * 1.0);
        if (p.y > H) WX.ps[i] = wxSpawn(k, W, H, false); }
      else { p.ph += .02 * dt; p.x += (p.vx + Math.sin(p.ph) * (k === "snow" ? .5 : .3)) * dt; p.y += p.vy * dt; g.globalAlpha = p.a; g.fillStyle = k === "snow" ? "#fff" : k === "ash" ? "#8a8680" : "#d8c48a";
        g.beginPath(); g.arc(p.x, p.y, p.s, 0, 6.283); g.fill(); if (p.y > H + 5 || p.x > W + 20 || p.x < -20) WX.ps[i] = wxSpawn(k, W, H, false); }
    }
    if (k === "rain" || k === "storm"){ g.stroke(); }
    g.globalAlpha = 1;
    if (k === "storm" && !WX.flash && Math.random() < .004){ WX.flash = 1; setTimeout(() => SND.play("thunder"), 250 + Math.random() * 900); }
    if (WX.flash > 0){ g.fillStyle = `rgba(235,240,255,${WX.flash * .45})`; g.fillRect(0, 0, W, H); WX.flash = Math.max(0, WX.flash - .06 * dt); }
    if (k === "snow" || k === "dust"){ g.fillStyle = k === "snow" ? "rgba(235,240,248,.07)" : "rgba(200,170,110,.1)"; g.fillRect(0, 0, W, H); }
  }
  WX.raf = requestAnimationFrame(wxTick);
}

/* ---------------- ЖИТЕЛІ: дуелі ---------------- */
const DUEL_OK = {
  ostap:{arch:"bruiser", p:{hp:1.1, dmg:1.05, def:1.3}, abil:["heal_low", "armor"], gb:"ударити молотом"},
  yarema:{arch:"bruiser", p:{hp:1.15, dmg:1.05}, abil:["heal_low", "guard", "bloodlust"]},
  ulf:{arch:"bruiser", p:{hp:1.25, dmg:1, def:1.3}, abil:["heal_low", "guard", "armor"]},
  ivan:{arch:"bruiser", p:{hp:1.2, dmg:1.05, def:1.2}, abil:["heal_low", "guard"]},
  dmytro:{arch:"thief", p:{hp:.95, dmg:1.15, agi:2}, abil:["heal_low", "multihit", "bloodlust"]},
  safar:{arch:"caster", p:{hp:.9, dmg:1.1}, abil:["heal_low", "guard", "spellward"]},
  yurko:{arch:"bruiser", p:{hp:1.15, dmg:1.1, def:1.3}, abil:["heal_low", "armor"]},
  stakh:{arch:"bruiser", p:{hp:1.05, dmg:.95}, abil:["heal_low"]},
  todor:{arch:"bruiser", p:{hp:1, dmg:1}, abil:["heal_low", "guard"]}
};
const duelStake = () => Math.max(20, S.lvl * 15);
function duelMobId(id){
  const key = "duel_" + id;
  if (!MOBS[key]){ const D0 = DUEL_OK[id], N = NPCS[id]; MOBS[key] = {name:N.name, arch:D0.arch, npc:id, hidden:true, duel:true, lore:N.role, p:Object.assign({}, D0.p), drop:[], design:D("humanoid", "#7a6a50", "#3a2a1a", "#ffd86f", [])}; prepMob(key, MOBS[key]); }
  ABIL[key] = DUEL_OK[id].abil.slice(); return key;
}
function openDuel(id){
  const N = NPCS[id], stake = duelStake(), st = stats();
  const why = S.hp < st.maxHp * .6 ? "Ви надто поранені: спершу відновіть сили." : S.cop < stake ? "Не вистачає грошей на ставку." : S.lvl < 3 ? "Потрібен 3 рівень." : "";
  openModal(`<div class="mbox" style="width:560px"><div class="mhead"><div class="npchd"><div class="portrait pic">${npcPortrait(id, 64)}</div><div><h2>Дуель: ${N.name}</h2><div class="hint">${N.role}</div></div></div><button class="x" data-act="close" aria-label="Закрити">×</button></div>
    <p class="say">«Ставка ${moneyTxt(stake)} з кожного. Б'ємося до здачі, на смерть не будемо. Тільки не ображайся, якщо я покличу на поміч.»</p>
    <ul class="hint" style="margin:6px 18px"><li>Бій сам на сам: пет і супутник не втручаються.</li><li>Житель лікується, коли йому кепсько, а поранений може покликати варту.</li><li>Переможеш: забереш його ставку й трохи досвіду. Програєш: втратиш свою ставку, але отямишся тут же. Втечеш: ставка пропаде.</li></ul>
    ${why ? `<p class="hint warn">${why}</p>` : ""}<div class="acts"><button class="btn p" data-duelgo="${id}" ${why ? "disabled" : ""}>Прийняти виклик</button><button class="btn" data-act="close">Передумав</button></div></div>`);
}
function startDuel(id){
  const stake = duelStake(); if (B || S.cop < stake) return; closeModal();
  const type = duelMobId(id), savePet = S.pet; S.pet = null; SOCIAL.noComp = true;
  try { startBattle([{type, lvl:S.lvl}], null, "loc", S.loc); } finally { S.pet = savePet; SOCIAL.noComp = false; }
  if (!B) return;
  spend("duel", stake); const e = B.enemies[0]; e.cop = [stake * 2, stake * 2]; e.drop = []; e.xp = Math.round(e.xp * .5);
  B.duel = {id, stake}; B.noHelp = true; B.pet = null; B.comp = null;
  blog(`${NPCS[id].name} приймає виклик. Ставка: ${moneyTxt(stake)} з кожного.`, "warn"); render();
}

/* ---------------- ЖИТЕЛІ: супутники ---------------- */
const COMPS = {
  yarema:{role:"warrior", hp:1, dmg:.65, def:1, taunt:.28, text:"тримає удар і б'є вашу ціль"},
  ulf:{role:"warrior", hp:1.25, dmg:.55, def:1.3, taunt:.34, text:"важкий і витривалий, приймає удари на себе"},
  dmytro:{role:"rogue", hp:.8, dmg:.7, def:.7, taunt:.1, text:"швидкі удари, подвійні й криті"},
  safar:{role:"mage", hp:.6, dmg:.85, def:.5, taunt:.07, text:"б'є вогнем крізь броню"},
  healer:{role:"healer", hp:.75, dmg:.3, def:.6, taunt:.06, text:"лікує вас і пета"},
  paraska:{role:"healer", hp:.7, dmg:.3, def:.6, taunt:.06, cleanse:true, text:"лікує й знімає отруту та кровотечу"}
};
const compCost = () => Math.max(30, S.lvl * 28);
function compMake(){
  const C = S.comp && COMPS[S.comp.id]; if (!C) return null; const L = S.lvl, id = S.comp.id, mh = Math.round((70 + 26 * L) * C.hp);
  return {key:id, id, role:C.role, name:NPCS[id].name, lvl:L, hp:mh, maxHp:mh, dmg:[Math.round((6 + 4.6 * L) * C.dmg), Math.round((9 + 6 * L) * C.dmg)], def:Math.round(L * 1.4 * C.def), agi:3 + L * .7, crit:C.role === "rogue" ? 22 : 4, taunt:C.taunt, cleanse:!!C.cleanse};
}
function compSlot(){ const ps = B && B.petSlot || 3; for (const k of [1, 2, 4, 3]) if (k !== ps) return k; return 1; }
function compHTML(){
  const c = B.comp; if (!c) return ""; const P = FORM.ally[B.compSlot || 1];
  return `<div class="fighter petf comp${c.hp > 0 ? "" : " dead"}" id="f-comp" style="left:${P.x}px;top:${P.y}px;z-index:${Math.round(P.y / 10)};scale:${P.s}"><span class="hfig cfig">${npcArt(c.id, 66, "nfig")}<span class="lv">${c.lvl}</span></span><span class="nm">${esc(c.name)}</span><span class="hb"><div style="width:${Math.max(0, c.hp) / c.maxHp * 100}%"></div></span></div>`;
}
async function compTurn(){
  const c = B && B.comp; if (!c || c.hp <= 0 || !B.enemies.some(alive)) return;
  await bsleep(300); const el = document.getElementById("f-comp"), pop = () => { if (el){ el.classList.add("atk"); setTimeout(() => el.classList.remove("atk"), 380); } };
  const st = stats();
  if (c.role === "healer"){
    if (c.cleanse && (B.poison > 0 || B.bleed > 0 || B.burnMe > 0)){ B.poison = 0; B.bleed = 0; B.burnMe = 0; pop(); fx(document.getElementById("f-p"), "очищення", "#9fe0c8"); blog(`${c.name} знімає з вас отруту й кровотечу.`, "good"); B.log.push([B.round, `${c.name}: очищення`, "", "heal"]); refreshBars(); return; }
    const cand = [{n:"me", r:S.hp / st.maxHp}]; if (B.pet && B.pet.hp > 0) cand.push({n:"pet", r:B.pet.hp / B.pet.maxHp});
    cand.sort((a, b) => a.r - b.r); const t = cand[0];
    if (t.r < .78){ pop(); const base = (n) => Math.round(n * .13 + c.lvl * 4);
      if (t.n === "me"){ const hv = Math.min(base(st.maxHp), Math.ceil(st.maxHp - S.hp)); S.hp += hv; fx(document.getElementById("f-p"), "+" + hv, "#8fd18a"); blog(`${c.name} лікує вас: +${hv}.`, "good"); B.log.push([B.round, `${c.name} лікує ${S.name}`, "+" + hv, "heal"]); }
      else { const hv = Math.min(base(B.pet.maxHp), Math.ceil(B.pet.maxHp - B.pet.hp)); B.pet.hp += hv; fx(document.getElementById("f-pet"), "+" + hv, "#8fd18a"); blog(`${c.name} лікує ${B.pet.name}: +${hv}.`, "good"); B.log.push([B.round, `${c.name} лікує ${B.pet.name}`, "+" + hv, "heal"]); }
      refreshBars(); return; }
  }
  let tg = B.enemies[B.target]; if (!alive(tg)) tg = B.enemies.find(alive); if (!tg) return;
  const hits = c.role === "rogue" && Math.random() < .25 ? 2 : 1;
  for (let k = 0; k < hits && alive(tg); k++){
    const tgt = c.role === "mage" ? {...tg, def:tg.def * .4} : tg, r = rollHit(c, tg.mark ? {...tgt, agi:-99} : tgt, 1); pop();
    if (r.miss){ fx(document.getElementById("f-e" + B.enemies.indexOf(tg)), "ухилення", "#ece6d8"); B.log.push([B.round, `${c.name} → ${tg.name}`, "ухилення", "miss"]); continue; }
    const d = Math.max(1, Math.round(r.dmg * dmgTakenMul(tg) * (c.role === "mage" ? 1.15 : 1) * (c.role === "healer" ? 1 : 1)));
    if (c.role === "mage"){ SND.play("fire"); if (!tg.burn && Math.random() < .35) tg.burn = 2; }
    hitEnemy(tg, d, "", c.role === "mage" ? "#ffb070" : "#9fd0ff", r.crit); B.log.push([B.round, `${c.name} → ${tg.name}`, "−" + d + (r.crit ? " крит" : ""), "hit"]);
    blog(`${c.name} ${c.role === "mage" ? "палить" : "б'є"} ${tg.name}: −${d}${r.crit ? " (крит)" : ""}.`);
  }
  refreshBars();
}
const enemyPicksComp = () => !!(B && B.comp && B.comp.hp > 0 && Math.random() < B.comp.taunt);
function hurtComp(e, d){
  const c = B.comp, el = document.getElementById("f-comp"); c.hp -= d; fx(el, "-" + d, "#ff6b5b"); B.log.push([B.round, `${e.name} → ${c.name}`, "−" + d, "hurt"]); blog(`${e.name} б'є ${c.name}: −${d}.`);
  if (el){ const hb = el.querySelector(".hb div"); if (hb) hb.style.width = Math.max(0, c.hp) / c.maxHp * 100 + "%"; }
  if (c.hp <= 0){ c.hp = 0; blog(`${c.name} падає без сил і виходить із бою.`, "warn"); B.log.push([B.round, `${c.name} виходить з бою`, "", "dead"]); if (el) el.classList.add("dead"); }
}
{ const rb = renderBattle, rf = refreshBars, sb = startBattle, pt = petTurn, spr = sprite;
  renderBattle = function(){ rb(); if (B && B.comp){ const v = document.getElementById("view"); if (v) v.insertAdjacentHTML("beforeend", compHTML()); } try { wxAttach(); } catch (e) {} };
  refreshBars = function(){ rf(); if (B && B.comp){ const el = document.querySelector("#f-comp .hb div"); if (el) el.style.width = Math.max(0, B.comp.hp) / B.comp.maxHp * 100 + "%"; } };
  startBattle = function(...a){
    sb(...a);
    if (B && !SOCIAL.noComp && S.comp){ B.comp = compMake(); if (B.comp){ B.compSlot = compSlot(); blog(`${B.comp.name} [${B.comp.lvl}] стає поруч з вами.`); render(); } }
  };
  petTurn = async function(){ await pt(); await compTurn(); };
  // жителі в бою малюються своїми фігурами
  sprite = function(type, w, h, sc, flip, extra = ""){
    const d = MOBS[type]; if (!d || !d.npc) return spr(type, w, h, sc, flip, extra);
    const iw = Math.round(Math.min(w * .46, h * .5)), ih = Math.round(iw * 440 / 240 * (npcLookOf(d.npc).s || 1));
    const im = npcArt(d.npc, iw).replace("<img ", `<img style="left:${Math.round((w - iw) / 2)}px;top:${Math.max(0, h - ih - 2)}px${flip ? ";transform:scaleX(-1)" : ""}" `);
    return `<span class="sprart${w >= 120 ? " big" : ""}" style="width:${w}px;height:${h}px" ${extra}>${im}</span>`;
  };
}
const SOCIAL = {noComp:false};

// кнопки в розмові з жителем
function npcExtraActs(id){
  if (B || T || DG) return ""; let h = "";
  if (DUEL_OK[id]) h += `<button class="btn" data-duel="${id}" title="Поєдинок за ставку, не на смерть">${gi("crossed-swords", 16)} Викликати на дуель</button>`;
  if (COMPS[id]){
    if (S.comp && S.comp.id === id) h += `<button class="btn" data-comp="dismiss:${id}">Відпустити (лишилось боїв: ${S.comp.left})</button>`;
    else h += `<button class="btn" data-comp="hire:${id}" ${S.cop < compCost() || S.lvl < 2 ? "disabled" : ""} title="${COMPS[id].text}">Найняти в похід: ${moneyTxt(compCost())}, 5 боїв</button>`;
  }
  return h;
}
document.addEventListener("click", e => {
  const t = e.target.closest && e.target.closest("[data-duel],[data-duelgo],[data-comp]"); if (!t || !isLive()) return;
  if (t.dataset.duel) openDuel(t.dataset.duel);
  else if (t.dataset.duelgo) startDuel(t.dataset.duelgo);
  else if (t.dataset.comp.startsWith("dismiss:")){ if (S.comp){ msg(`${NPCS[S.comp.id].name} більше не йде з вами.`); S.comp = null; save(); } openNpc(t.dataset.comp.slice(8)); }
  else if (t.dataset.comp.startsWith("hire:")){ const id = t.dataset.comp.slice(5), cost = compCost(); if (S.cop < cost) return;
    spend("comp", cost); S.comp = {id, left:5}; msg(`${NPCS[id].name} іде з вами в наступні 5 боїв: ${COMPS[id].text}.`, "good"); save(); renderTop(); openNpc(id); SND.play("coin"); }
}, true);

/* ---------------- НОВІ ВМІННЯ МОБІВ ---------------- */
Object.assign(ABIL_INFO, {
  regen:["Регенерація", "Щораунду відновлює 6% здоров'я, якщо не обпечений."],
  armor:["Важкий панцир", "Звичайні удари завдають на 20% менше шкоди. Булава й сильний удар цього не відчувають."],
  shriek:["Пронизливий крик", "Кожен третій раунд верещить: −12 енергії."],
  bloodlust:["Кровожерність", "З кожним влучанням б'є на 8% сильніше (до п'яти разів)."],
  guard:["Кличе варту", "Поранений до половини здоров'я кличе на поміч вартового."],
});
{ const add = (ids, k) => { for (const id of ids) if (MOBS[id] || typeof bestById === "function" && bestById(id)){ ABIL[id] = ABIL[id] || []; if (!ABIL[id].includes(k)) ABIL[id].push(k); } };
  add(["troll", "bg_leech_queen", "mk_giant", "bolotianyk", "bg_giant_leech", "bg_hydra_mother", "jal_king"], "regen");
  add(["golem", "gargoyle", "warden", "black_knight", "soldier", "or_dawn_knight", "or_night_knight", "or_champion", "or_grave_lord", "mk_knight", "bg_peat", "crypt_captain"], "armor");
  add(["or_bats", "mk_crow", "gargoyle", "vampir", "upyrytsia"], "shriek");
  add(["tiger", "wolf2", "alpha", "mk_hound", "or_warhound", "vovkulaka", "forest_wolf", "pesyholovets", "bg_serpent"], "bloodlust");
}
{ const ap = abilPre, ah = abilOnHit, ar = abilRoundEnd;
  abilPre = function(e, i){
    let m = ap(e, i);
    if (hasA(e, "bloodlust") && e.bl) m *= 1 + .08 * e.bl;
    if (hasA(e, "shriek") && B.round % 3 === 0){ S.en = Math.max(0, S.en - 12); SND.play("shriek"); fx(document.getElementById("f-p"), "-12 ен.", "#c8a0ff"); blog(`${e.name} верещить: −12 енергії.`, "warn"); }
    if (hasA(e, "guard") && !e.guarded && e.hp < e.maxHp * .5 && B.enemies.filter(alive).length < 3){
      e.guarded = true; if (!MOBS.duel_guard){ MOBS.duel_guard = {name:"Вартовий", arch:"shielded", npc:"ulf", hidden:true, lore:"Міська варта.", p:{hp:.8, dmg:.8, def:1.3}, drop:[], design:D("humanoid", "#7a8aa0", "#3a4a60", "#ffe0a0", ["shield"])}; prepMob("duel_guard", MOBS.duel_guard); }
      const add = mkEnemy("duel_guard", Math.max(1, e.lvl - 2), {}, null); add.drop = []; add.xp = Math.round(add.xp * .3); add.cop = [0, 0]; B.enemies.push(add); SND.play("summon");
      blog(`${e.name} кличе на поміч: прибігає вартовий!`, "warn"); B.log.push([B.round, `${e.name} кличе варту`, "", "hurt"]); render(); }
    return m;
  };
  abilOnHit = function(e, d, notes){ ah(e, d, notes); if (hasA(e, "bloodlust")){ e.bl = Math.min(5, (e.bl || 0) + 1); if (e.bl === 5) notes.push("жага крові"); } };
  abilRoundEnd = function(){
    ar();
    for (const e of B.enemies) if (alive(e) && hasA(e, "regen") && e.hp < e.maxHp && !e.burn){ const hv = Math.round(e.maxHp * .06); e.hp = Math.min(e.maxHp, e.hp + hv); fx(document.getElementById("f-e" + B.enemies.indexOf(e)), "+" + hv, "#9fe08a"); }
  };
}

// налаштування за замовчуванням, коли гравець уже має збереження
{ const rd = render; render = function(){ if (isLive() && S.opt){ if (S.opt.snd === undefined) S.opt.snd = true; if (S.opt.wx === undefined) S.opt.wx = true; } rd(); try { wxAttach(); } catch (e) {} }; }
