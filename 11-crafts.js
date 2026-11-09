/* ============ використання предметів ============ */
function useItem(id, inBattle){
  const it = ITEMS[id], st = stats(); if (!inv(id)) return "";
  if (it.scroll === "tp"){
    if (inBattle || T || DG){ msg("Зараз перенестися не вийде.", "warn"); return ""; }
    take(id); const to = nearestTown(S.loc) === S.loc ? "spire" : nearestTown(S.loc);
    S.prev = null; S.loc = to; UI.view = "loc"; msg(`Сувій перенесення: ви в ${NODES[to].name}.`, "good"); arrive(); return "";
  }
  if (it.scroll === "heal"){ take(id); const hv = Math.round(st.maxHp * .3); S.hp = Math.min(st.maxHp, S.hp + hv); msg(`${it.name}: +${hv} здоров'я.`, "good"); save(); renderTop(); renderBelt(); return "+" + hv; }
  if (it.scroll){ msg("Цей сувій діє лише в бою.", "warn"); return ""; }
  if (it.open){ take(id); openBox(); save(); renderBelt(); renderTop(); return ""; }
  take(id);
  let txt = "";
  if (it.use){
    if (it.use.hp){ const h = Math.min(it.use.hp, st.maxHp - S.hp); S.hp += h; txt = "+" + Math.round(h); }
    if (it.use.en){ const h = Math.min(it.use.en, st.maxEn - S.en); S.en += h; txt += (txt ? " " : "+") + Math.round(h) + " ен."; }
    msg(`${it.name}: ${txt}.`, "good", inBattle ? "fight" : "loc");
  }
  if (it.buff){ S.buffs = S.buffs.filter(b => b.id !== id); S.buffs.push({id, k:it.buff, n:it.bn || 3}); txt = Object.entries(it.buff).map(([k, v]) => k === "bog" ? "захист від туману Трясовини" : `+${v} ${STATN[k]}`).join(", "); msg(`${it.name}: ${txt} на ${it.bn || 3} боїв.`, "good", inBattle ? "fight" : "loc"); }
  save(); renderBelt(); renderTop(); return txt;
}
const STATN = {hp:"здоров'я", en:"енергії", agi:"спритності", str:"сили", def:"захисту", crit:"% криту", wil:"волі"};
function openBox(){
  const roll = Math.random(); let got = [];
  if (roll < .04){ msg("Шкатулка порожня. Буває і таке.", "warn"); return; }
  if (roll < .12){ const r = pick(["silver_ring","iron_helm","chain","merc_axe","postoly","gerdan"]); got.push([r, 1]); }
  else if (roll < .3) got.push([pick(["raw1","raw1","raw2"]), 1]);
  else if (roll < .6) got.push([pick(["scroll_fire","scroll_shield","scroll_heal","scroll_tp"]), ri(1, 2)]);
  else got.push([pick(["potion_l","potion_s","potion_e","elix_str","elix_skin"]), ri(1, 3)]);
  if (Math.random() < .5) got.push(["box_coin", ri(40, 160)]);
  for (const [id, n] of got){ if (id === "box_coin") earn("box", n); else give(id, n, true); }
  msg(`У шкатулці: ${got.map(([id, n]) => id === "box_coin" ? moneyTxt(n) : ITEMS[id].name + (n > 1 ? " ×" + n : "")).join(", ")}.`, "good");
}

/* ============ збирання ресурсів ============ */
const profNeed = lv => 20 * lv;
function profXp(k, x){
  const p = S.prof[k]; if (p.lv >= 10) return;
  p.xp += x;
  while (p.lv < 10 && p.xp >= profNeed(p.lv)){ p.xp -= profNeed(p.lv); p.lv++; msg(`${PROFS[k].name}: новий рівень ремесла ${p.lv}!`, "good"); }
}
function startGather(spotId){
  if (T || B || UI.gathering) return;
  const rt = locRT(S.loc), sp = rt.spots.find(s => s.id === spotId); if (!sp || !sp.ready) return;
  const P = S.prof[sp.type], req = TIER_LV[sp.t];
  if (P.lv < req){ msg(`${resName(sp.type, sp.t)}: потрібен ${PROFS[sp.type].name.toLowerCase()} ${req} рівня (у вас ${P.lv}).`, "warn"); return; }
  UI.gathering = {spot:spotId, t:0, dur:2.4};
  renderLoc();
}
function tickGather(dt){
  const g = UI.gathering; if (!g) return;
  if (T || B || UI.view !== "loc"){ UI.gathering = null; return; }
  g.t += dt; const el = document.getElementById("gbar"); if (el) el.style.width = clamp(g.t / g.dur * 100, 0, 100) + "%";
  if (g.t < g.dur) return;
  UI.gathering = null;
  const rt = locRT(S.loc), sp = rt.spots.find(s => s.id === g.spot); if (!sp) return;
  const P = S.prof[sp.type], req = TIER_LV[sp.t], gap = P.lv - req;
  const ok = Math.random() < clamp(.6 + gap * .1, .55, .95);
  const id = {herb:"h", mine:"o", fish:"f"}[sp.type] + sp.t;
  if (ok){
    const n = 1 + (Math.random() < gap * .08 ? 1 : 0); give(id, n);
    let extra = "";
    if (sp.type === "mine" && Math.random() < .06 + sp.t * .02){ const raw = sp.t >= 5 ? "raw3" : sp.t >= 3 ? "raw2" : "raw1"; give(raw, 1, true); extra = `, ${ITEMS[raw].name}`; }
    msg(`${PROFS[sp.type].name}: ${ITEMS[id].name}${n > 1 ? " ×2" : ""}${extra}.`, "good");
  } else msg(`${PROFS[sp.type].name}: не вдалося, ${sp.type === "fish" ? "риба зірвалася" : sp.type === "mine" ? "жила розсипалась" : "трава пом'ялась"}.`, "warn");
  profXp(sp.type, Math.round((ok ? 6 : 2) * sp.t * (gap <= 1 ? 1 : gap <= 3 ? .5 : .2)) + 1);
  sp.ready = false; sp.respawn = performance.now() + 50000;
  save(); renderLoc(); renderBelt();
}
function tickSpots(){
  const t = performance.now();
  for (const [id, rt] of Object.entries(LR)) for (const sp of rt.spots) if (!sp.ready && t > sp.respawn){
    const fresh = spawnSpot(id, sp.type, sp.t, rt.spots.filter(o => o !== sp)); Object.assign(sp, fresh, {id:sp.id});
    if (id === S.loc && UI.view === "loc" && !B && !UI.gathering) renderLoc();
  }
}

/* ============ майстерня ============ */
function canCraft(r){ return S.prof[r.prof].lv >= r.lv && Object.entries(r.in).every(([k, n]) => inv(k) >= n); }
function doCraft(rid){
  const r = RECIPES.find(x => x.id === rid); if (!r || !canCraft(r)) return;
  for (const [k, n] of Object.entries(r.in)) take(k, n);
  give(r.out, 1, true);
  S.crafted[r.out] = (S.crafted[r.out] || 0) + 1;
  questEvent("craft", r.out);
  const p = S.prof[r.prof]; profXp(r.prof, Math.round(8 * (p.lv - r.lv <= 1 ? 1.5 : p.lv - r.lv <= 3 ? 1 : .4) + r.lv));
  msg(`${PROFS[r.prof].name}: створено ${ITEMS[r.out].name}.`, "good");
  save(); renderBelt(); if (modalOpen()) openCrafts();
}

/* ============ гнізда й самоцвіти ============ */
function sockArr(slot){ const it = ITEMS[S.equip[slot]]; const n = (it && it.sock) || 0; const a = (S.sock[slot] || []).slice(0, n); while (a.length < n) a.push(null); S.sock[slot] = a; return a; }
function insertGem(slot, idx, gem){
  const a = sockArr(slot); if (a[idx] || !inv(gem)) return;
  take(gem); a[idx] = gem; S.hp = Math.min(S.hp, stats().maxHp);
  msg(`${ITEMS[gem].name} вставлено в ${ITEMS[S.equip[slot]].name}.`, "good"); save(); UI.sockPick = null; openChar(); renderTop();
}
function removeGem(slot, idx){
  const a = sockArr(slot), g = a[idx]; if (!g) return; const cost = 30 * ITEMS[g].g;
  if (S.cop < cost){ msg(`Щоб вийняти камінь, ювелір бере ${moneyTxt(cost)}.`, "warn"); return; }
  spend("gem", cost); a[idx] = null; give(g, 1, true); S.hp = Math.min(S.hp, stats().maxHp);
  msg(`Ви вийняли ${ITEMS[g].name} (${moneyTxt(cost)}).`); save(); openChar(); renderTop();
}
function returnGems(slot){ for (const g of S.sock[slot] || []) if (g) give(g, 1, true); S.sock[slot] = []; }
function equip(id, slot){
  const it = ITEMS[id]; if (!it || !it.slot || !inv(id)) return;
  if ((it.lvl || 1) > S.lvl){ msg(`${it.name}: потрібен ${it.lvl} рівень.`, "warn"); return; }
  if (!slot) slot = it.slot === "ring" ? (!S.equip.ring1 ? "ring1" : !S.equip.ring2 ? "ring2" : "ring1") : it.slot;
  const old = S.equip[slot]; returnGems(slot);
  S.equip[slot] = id; take(id); if (old) give(old, 1, true);
  S.hp = Math.min(S.hp, stats().maxHp); msg(`Ви надягли: ${it.name}.`); save(); renderTop();
}
function unequip(slot){ const id = S.equip[slot]; if (!id) return; returnGems(slot); S.equip[slot] = null; give(id, 1, true); S.hp = Math.min(S.hp, stats().maxHp); save(); renderTop(); }
