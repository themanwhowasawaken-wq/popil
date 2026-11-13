"use strict";
/* ============ helpers ============ */
const $ = s => document.querySelector(s);

/* ===== адреси картинок: blob; а якщо середовище блокує blob (наприклад, вікно попереднього перегляду), то data: ===== */
let BLOB_OK = true;
(function(){
  try {
    const i = new Image(); i.onerror = () => { BLOB_OK = false; };
    i.src = URL.createObjectURL(new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'], {type:"image/svg+xml"}));
    document.addEventListener("securitypolicyviolation", e => { if (/blob/i.test(e.blockedURI || "")) BLOB_OK = false; });
  } catch (e){ BLOB_OK = false; }
})();
const svgURL = svg => { if (BLOB_OK) try { return URL.createObjectURL(new Blob([svg], {type:"image/svg+xml"})); } catch (e){} return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); };
const bytesURL = (b64, mime) => { if (BLOB_OK) try { const b = atob(b64), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return URL.createObjectURL(new Blob([u], {type:mime})); } catch (e){} return "data:" + mime + ";base64," + b64; };
function canvasURL(cv, mime, q, cb){
  if (BLOB_OK && cv.toBlob) cv.toBlob(b => { if (b) cb(URL.createObjectURL(b)); else { try { cb(cv.toDataURL(mime, q)); } catch (e){} } }, mime, q);
  else { try { cb(cv.toDataURL(mime, q)); } catch (e){} }
}
const freeURL = u => { if (u && u.startsWith("blob:")) URL.revokeObjectURL(u); };
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));
function rng(seed){ let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) | 0; return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const now = () => { const d = new Date(); return String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0"); };
const TAU = Math.PI * 2;
let ctx = null;              // для drawDemonBody
const game = {t:0};

const IC = {
  hero:'<path d="M5 14a7 7 0 0 1 14 0v6H5z"/><path d="M5 14h14M9.5 14v6M14.5 14v6"/>',
  bag:'<path d="M8 7c0-2 1.8-3.5 4-3.5S16 5 16 7"/><path d="M5 8h14l-1.2 11.5a1.5 1.5 0 0 1-1.5 1.5H7.7a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M9 12h6"/>',
  book:'<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5z"/><path d="M12 6v14.5"/>',
  map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  quest:'<path d="M7 4h10v16H7z"/><path d="M12 8v5M12 16v.5"/>',
  codex:'<path d="M5 11a7 7 0 0 1 14 0v3l-2 1v3H7v-3l-2-1z"/><circle cx="9.5" cy="11.5" r="1.5"/><circle cx="14.5" cy="11.5" r="1.5"/><path d="M10 18v-2M14 18v-2"/>',
  craft:'<path d="M14 4l6 6-3 3-6-6z"/><path d="M11 10l-7 7 3 3 7-7"/>',
  auction:'<path d="M12 4v16M7 20h10M4 8h16"/><path d="M6 8l-2.5 5h5zM18 8l-2.5 5h5z"/>',
  clan:'<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/>',
  arena:'<path d="M5 4l10 10M19 4L9 14"/><path d="M12.5 15.5l3 3M11.5 15.5l-3 3M16.5 17.5l2.5 2.5M7.5 17.5L5 20"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  flask:'<path d="M10 3h4M10.5 3v5l-4.5 8a3 3 0 0 0 2.6 4.5h6.8A3 3 0 0 0 18 16l-4.5-8V3"/><path d="M8 14h8"/>',
  elixir:'<path d="M9 3h6M10 3v4L7 10v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9l-3-3V3"/><path d="M7 13h10"/>',
  scroll:'<path d="M7 4h11a2 2 0 0 1 0 4H8"/><path d="M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M9 12h6M9 15h4"/>',
  sword:'<path d="M14.5 4.5l5-1-1 5-8 8-4-4z"/><path d="M6.5 12.5l5 5M5 19l3-3"/>',
  strong:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  shield:'<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M12 7v10"/>',
  run:'<path d="M13 5a1.5 1.5 0 1 0 0-.01M11 9l-3 4h4l-1 6M11 9l4 2 3-1M8 21l3-2"/>',
  ward:'<path d="M12 3c-3 3-6 4-8 4 0 7 3 11 8 14 5-3 8-7 8-14-2 0-5-1-8-4z"/><path d="M12 8v8M8.5 11h7"/>',
  helmet:'<path d="M5 14a7 7 0 0 1 14 0v6H5z"/><path d="M5 14h14"/>',
  armor:'<path d="M8 4l4 2 4-2 3 3-2 3v10H7V10L5 7z"/>',
  boots:'<path d="M7 4h5v10l6 2v4H7z"/>',
  amulet:'<path d="M7 3c0 5 2 8 5 9 3-1 5-4 5-9"/><circle cx="12" cy="16" r="3.5"/>',
  ring:'<circle cx="12" cy="14" r="6"/><path d="M9.5 7.5L12 4l2.5 3.5"/>',
  gem:'<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 16M15 4l-3 16"/>',
  herb:'<path d="M12 21V10"/><path d="M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 11c0-4 2-7 6-7 0 4-2 7-6 7z"/>',
  ore:'<path d="M3 18l4-9 5 2 4-6 5 13z"/><path d="M8 13l2 1M14 10l1 2"/>',
  fish:'<path d="M3 12c3-5 9-6 14-2l4-3v10l-4-3c-5 4-11 3-14-2z"/><circle cx="8" cy="11" r=".8"/>',
  pick:'<path d="M4 20l9-9"/><path d="M8 5c4-1 8 0 11 3-3-1-6 0-8 2"/>',
  box:'<path d="M4 9h16v11H4z"/><path d="M3 5h18v4H3zM12 5v15"/>',
  door:'<path d="M6 21V5a6 6 0 0 1 12 0v16"/><path d="M4 21h16M14 13v1"/>',
  skull2:'<path d="M5 11a7 7 0 0 1 14 0v3l-2 1v3H7v-3l-2-1z"/>',
  chest:'<path d="M4 10a8 5 0 0 1 16 0v9H4z"/><path d="M4 12h16M11 12v3h2v-3"/>',
  trap:'<path d="M3 18h18M5 18l2-6 2 6 2-6 2 6 2-6 2 6 2-6 1 6"/>',
  shrine:'<path d="M12 3v6M9 6h6"/><path d="M6 21v-8h12v8M4 21h16M10 21v-4h4v4"/>',
  star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  item:'<path d="M5 8l7-4 7 4v8l-7 4-7-4z"/><path d="M5 8l7 4 7-4M12 12v8"/>',
};
const svg = (name, size = 22, color = "currentColor", sw = 1.6) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[name] || IC.item}</svg>`;
