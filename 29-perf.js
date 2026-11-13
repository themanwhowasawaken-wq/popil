/* ============ швидкодія: сцени й карта показуються готовою картинкою ============ */
// Складний SVG браузер перемальовує щоразу, як він з'являється на екрані (у бою — на кожен хід).
// Тому кожну сцену один раз переводимо в растр і далі показуємо його.
const RAS = {};
function rasterURL(key, mk){
  let r = RAS[key];
  if (!r){
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZW}" height="${ZH}" viewBox="0 0 ${ZW} ${ZH}">${mk()}</svg>`;
    r = RAS[key] = {url:svgURL(svg), bmp:false};
    const img = new Image();
    img.onload = () => { const go = () => { try {
        const k = 1.6, cv = document.createElement("canvas"); cv.width = Math.round(ZW * k); cv.height = Math.round(ZH * k);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        canvasURL(cv, "image/webp", .9, u => { const old = r.url; r.url = u; r.bmp = true;
          document.querySelectorAll(`img[data-ras="${key}"]`).forEach(e => { e.src = r.url; }); setTimeout(() => freeURL(old), 4000); });
      } catch (e){} };
      if (window.requestIdleCallback) requestIdleCallback(go, {timeout:1200}); else setTimeout(go, 200); };
    img.src = r.url;
  }
  return r.url;
}
function sceneImg(id, style = ""){ const k = "sc:" + id; return `<img class="scene" data-ras="${k}" src="${rasterURL(k, () => sceneSVG(id))}" width="${ZW}" height="${ZH}"${style ? ` style="${style}"` : ""} alt="" aria-hidden="true" draggable="false">`; }
function dungeonImg(sc, style){ const k = "dg:" + sc; return `<img class="scene" data-ras="${k}" src="${rasterURL(k, () => dungeonSVG(sc))}" width="${ZW}" height="${ZH}" style="${style}" alt="" aria-hidden="true" draggable="false">`; }
// карта: готова картинка вшита в гру при збиранні (MAP_PRE), тож її не треба генерувати й пекти
function ensureMapURL(){ if (!MAP_URL && typeof MAP_PRE === "string" && MAP_PRE){ try { MAP_URL = bytesURL(MAP_PRE, "image/webp"); } catch (e){} } }
// коли вкладка схована, анімації стоять
document.addEventListener("visibilitychange", () => document.body.classList.toggle("hid", document.hidden));
