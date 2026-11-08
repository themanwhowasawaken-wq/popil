/* ============ екран входу ============ */
const ACC = "popelyastyi-shpyl-accounts", CKEY = n => "popelyastyi-shpyl-c:" + n.toLowerCase();
const SESS = "popelyastyi-shpyl-session", REMEMBER = "popelyastyi-shpyl-remember";
const CRESTS = [["#4a443c","#262320","Попіл"], ["#8a3a12","#3a1608","Жар"], ["#2f5a7a","#122636","Річка"], ["#3f5a35","#18240f","Ліс"], ["#6a4a7a","#2a1a34","Сутінки"], ["#8a7a4a","#3a301a","Мідь"]];
function crestBg(i){ const c = CRESTS[i] || CRESTS[0]; return `background:radial-gradient(circle at 40% 35%,${c[0]},${c[1]})`; }
const LS = {
  get(k){ try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v){ try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  del(k){ try { localStorage.removeItem(k); } catch (e) {} }
};
const SS = {
  get(k){ try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v){ try { sessionStorage.setItem(k, v); } catch (e) {} },
  del(k){ try { sessionStorage.removeItem(k); } catch (e) {} }
};
function accAll(){ try { return JSON.parse(LS.get(ACC)) || {}; } catch (e) { return {}; } }
function accSave(a){ LS.set(ACC, JSON.stringify(a)); }
function accTouch(){
  const a = accAll(), k = S.name.toLowerCase(); if (!a[k]) return;
  a[k].lvl = S.lvl; a[k].loc = S.loc; a[k].crest = S.crest || 0; a[k].last = Date.now(); accSave(a);
}
// простий хеш: пароль лише береже від випадкового входу на спільному комп'ютері
function phash(name, pass){
  const s = name.toLowerCase() + "\u0001" + pass + "\u0001shpyl";
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++){ const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}
// старе єдине збереження стає героєм без пароля
function migrateOld(){
  const raw = LS.get(SAVE); if (!raw || LS.get(SAVE + "-moved")) return;
  try {
    const o = JSON.parse(raw), nm = (o && o.name) || "Сивий_Лицар", a = accAll(), k = nm.toLowerCase();
    if (!a[k]){ a[k] = {name:nm, h:"", lvl:Math.min(MAXLVL, o.lvl || 1), loc:o.loc || "spire", crest:0, created:Date.now(), last:Date.now()}; accSave(a); LS.set(CKEY(nm), raw); }
    LS.set(SAVE + "-moved", "1");
  } catch (e) {}
}
const LG = {tab:"in", err:"", name:"", crest:0, del:null};
const NEWS = [
  ["Великий світ", "Землі Кабаллону, Попелясті землі й Закарпаття тепер одна карта. До Закарпаття ведуть три шляхи."],
  ["Ремесла", "Травництво, руда, рибальство, алхімія, писарство і ювелірна справа. Самоцвіти вставляються в гнізда речей."],
  ["Підземелля", "Склеп під Руїнами Варти, Чорна Цитадель і Безодня Чорногори. У кінці на вас чекає бос."],
  ["Рівень 10", "Максимальний рівень тепер 10. Далі сила йде від речей, каменів, зачисток районів і підземель."]
];
function ago(t){
  if (!t) return ""; const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "щойно"; if (m < 60) return m + " хв тому"; const h = Math.round(m / 60); if (h < 24) return h + " год тому";
  const d = Math.round(h / 24); return d + " дн тому";
}
function renderLogin(){
  const a = accAll(), list = Object.values(a).sort((x, y) => (y.last || 0) - (x.last || 0));
  const inTab = LG.tab === "in";
  const heroes = list.length ? list.map(h => `<div class="lg-hero${LG.name.toLowerCase() === h.name.toLowerCase() ? " on" : ""}">
      <button class="lg-pick" data-lg="pick" data-n="${esc(h.name)}"><span class="avatar sm" style="${crestBg(h.crest)}">${esc(h.name[0])}</span>
      <span class="lg-hi"><b>${esc(h.name)}</b><small>${h.lvl || 1} рівень · ${esc((NODES[h.loc] || NODES.spire).name)}</small></span>
      <span class="lg-ago">${h.h ? svg("ward", 13) : ""}${ago(h.last)}</span></button>
      <button class="lg-x" data-lg="del" data-n="${esc(h.name)}" title="Видалити героя">${LG.del === h.name.toLowerCase() ? "Точно?" : "✕"}</button></div>`).join("")
    : `<p class="lg-empty">На цьому пристрої ще немає героїв. Створіть першого.</p>`;
  const form = inTab ? `
      <label class="lg-f"><span>Ім'я героя</span><input id="lgName" maxlength="16" autocomplete="username" value="${esc(LG.name)}"></label>
      <label class="lg-f"><span>Пароль</span><input id="lgPass" type="password" maxlength="40" autocomplete="current-password" placeholder="порожній, якщо не ставили"></label>
      <label class="lg-chk"><input id="lgRem" type="checkbox"${LS.get(REMEMBER) ? " checked" : ""}> Запам'ятати мене на цьому пристрої</label>
      <button class="btn p big lg-go" data-lg="login" type="submit">Увійти у світ</button>`
    : `
      <label class="lg-f"><span>Ім'я героя</span><input id="lgName" maxlength="16" autocomplete="username" value="${esc(LG.name)}" placeholder="3–16 літер, цифри, _ або -"></label>
      <label class="lg-f"><span>Пароль</span><input id="lgPass" type="password" maxlength="40" autocomplete="new-password" placeholder="щонайменше 4 символи"></label>
      <label class="lg-f"><span>Пароль ще раз</span><input id="lgPass2" type="password" maxlength="40" autocomplete="new-password"></label>
      <div class="lg-f"><span>Знак роду</span><div class="lg-crests">${CRESTS.map((c, i) => `<button type="button" class="lg-crest${LG.crest === i ? " on" : ""}" data-lg="crest" data-i="${i}" title="${c[2]}"><span class="avatar sm" style="${crestBg(i)}">${esc((LG.name || "?")[0])}</span></button>`).join("")}</div></div>
      <button class="btn p big lg-go" data-lg="reg" type="submit">Створити героя</button>`;
  $("#login").innerHTML = `
    <svg class="lg-bg" viewBox="0 0 900 528" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${sceneSVG("spire")}</svg>
    <div class="lg-shade"></div>
    <div class="lg-logo"><h1>Попелястий Шпиль</h1><p>Землі Кабаллону · Попелясті землі · Закарпаття</p></div>
    <form class="lg-box" id="lgForm" autocomplete="on" novalidate>
      <div class="lg-tabs" role="tablist"><button type="button" role="tab" aria-selected="${inTab}" class="${inTab ? "on" : ""}" data-lg="tab" data-t="in">Вхід</button><button type="button" role="tab" aria-selected="${!inTab}" class="${!inTab ? "on" : ""}" data-lg="tab" data-t="reg">Новий герой</button></div>
      ${form}
      <p class="lg-err" role="alert">${esc(LG.err)}</p>
    </form>
    <div class="lg-side">
      <section class="lg-card"><h3>Герої на цьому пристрої</h3><div class="lg-heroes">${heroes}</div></section>
      <section class="lg-card"><h3>Вісті світу</h3>${NEWS.map(n => `<div class="lg-news"><b>${n[0]}</b><span>${n[1]}</span></div>`).join("")}</section>
    </div>
    <p class="lg-foot">Герої зберігаються в цьому браузері. Пароль лише береже від випадкового входу на спільному комп'ютері.</p>`;
  const f = $(inTab && LG.name ? "#lgPass" : "#lgName"); if (f) setTimeout(() => f.focus(), 0);
}
function enterAs(name, remember){
  const k = name.toLowerCase(), a = accAll(), acc = a[k];
  let s = null; try { s = JSON.parse(LS.get(CKEY(acc.name))); } catch (e) {}
  if (!s){ s = fresh(); s.name = acc.name; s.crest = acc.crest || 0; }
  S = migrate(s); S.name = acc.name; CUR = CKEY(acc.name);
  SS.set(SESS, k); if (remember) LS.set(REMEMBER, k); else if (remember === false) LS.del(REMEMBER);
  const L = $("#login"); if (L) L.remove(); startGame();
}
function lgSubmit(kind){
  const name = ($("#lgName").value || "").trim(), pass = $("#lgPass").value || "", a = accAll(), k = name.toLowerCase();
  LG.name = name; LG.err = "";
  if (kind === "login"){
    if (!a[k]) LG.err = "Такого героя тут немає. Перевірте ім'я або створіть нового.";
    else if (a[k].h && a[k].h !== phash(name, pass)) LG.err = "Пароль не підходить.";
    else return enterAs(name, $("#lgRem").checked);
  } else {
    const p2 = $("#lgPass2").value || "";
    if (!/^[A-Za-zА-ЩЬЮЯҐЄІЇа-щьюяґєії0-9_'\-]{3,16}$/.test(name)) LG.err = "Ім'я: від 3 до 16 знаків, літери, цифри, _ або -. Без пропусків.";
    else if (a[k]) LG.err = "Герой з таким ім'ям уже є.";
    else if (pass.length < 4) LG.err = "Пароль має бути щонайменше 4 символи.";
    else if (pass !== p2) LG.err = "Паролі не збігаються.";
    else {
      a[k] = {name, h:phash(name, pass), lvl:1, loc:"spire", crest:LG.crest, created:Date.now(), last:Date.now()};
      accSave(a); const s = fresh(); s.name = name; s.crest = LG.crest; LS.set(CKEY(name), JSON.stringify(s));
      return enterAs(name, false);
    }
  }
  renderLogin();
}
function showLogin(){
  migrateOld();
  const a = accAll(), auto = SS.get(SESS) || LS.get(REMEMBER);
  if (auto && a[auto]) return enterAs(a[auto].name);
  const box = document.createElement("div"); box.id = "login"; $("#game").appendChild(box);
  const last = Object.values(a).sort((x, y) => (y.last || 0) - (x.last || 0))[0];
  if (last) LG.name = last.name; else LG.tab = "reg";
  box.addEventListener("click", e => {
    const t = e.target.closest("[data-lg]"); if (!t) return; e.preventDefault();
    const d = t.dataset.lg;
    if (d === "tab"){ LG.tab = t.dataset.t; LG.err = ""; LG.del = null; if (LG.tab === "reg") LG.name = ""; renderLogin(); }
    else if (d === "pick"){ LG.tab = "in"; LG.err = ""; LG.del = null; LG.name = t.dataset.n; const ac = accAll()[t.dataset.n.toLowerCase()]; if (ac && !ac.h) return enterAs(ac.name); renderLogin(); }
    else if (d === "crest"){ LG.crest = +t.dataset.i; const v = $("#lgName").value; LG.name = v; const p = [$("#lgPass").value, $("#lgPass2").value]; renderLogin(); $("#lgPass").value = p[0]; $("#lgPass2").value = p[1]; }
    else if (d === "del"){
      const k = t.dataset.n.toLowerCase();
      if (LG.del !== k){ LG.del = k; return renderLogin(); }
      const ac = accAll(); LS.del(CKEY(t.dataset.n)); delete ac[k]; accSave(ac);
      if (LS.get(REMEMBER) === k) LS.del(REMEMBER); if (LG.name.toLowerCase() === k) LG.name = ""; LG.del = null; renderLogin();
    }
    else if (d === "login" || d === "reg") lgSubmit(d);
  });
  box.addEventListener("submit", e => { e.preventDefault(); lgSubmit(LG.tab === "in" ? "login" : "reg"); });
  box.addEventListener("input", e => { if (e.target.id === "lgName" && LG.tab === "reg"){ const ch = (e.target.value || "?")[0]; box.querySelectorAll(".lg-crest .avatar").forEach(x => x.textContent = ch); } });
  renderLogin();
}
function logout(){ save(); SS.del(SESS); LS.del(REMEMBER); location.reload(); }
showLogin();
