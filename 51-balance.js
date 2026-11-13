/* ============ баланс: усі важелі в одному місці ============ */
const BAL = {questCop:.5, questXp:.6, mobHp:1.1, mobDmg:1.08, wardPct:.06, wardBossPct:.03, wardLvl:3, wardCd:4};
(function(){
  const hp0 = BASE.hp, dm0 = BASE.dmg;
  BASE.hp = L => hp0(L) * BAL.mobHp;
  BASE.dmg = L => dm0(L) * BAL.mobDmg;
  const rd = (v, k) => Math.max(5, Math.round(v * k / 5) * 5);
  for (const Q of Object.values(QUESTS)){ const R = Q.reward; if (!R || R._bal) continue; R._bal = 1;
    if (R.cop) R.cop = rd(R.cop, BAL.questCop);
    if (R.xp) R.xp = rd(R.xp, BAL.questXp);
    if (R.choice) for (const c of R.choice) if (c.cop) c.cop = rd(c.cop, BAL.questCop); }
})();
