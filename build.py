import glob, os
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.join(here, "src") if os.path.isdir(os.path.join(here, "src")) else here
css = open(f"{root}/style.css", encoding="utf-8").read()
import base64, hashlib
mapsrc = "".join(open(f"{root}/{f}", encoding="utf-8").read() for f in ["03-world.js", "19-regions.js", "20-mapart.js", "21-sites.js"])
mh = hashlib.md5(mapsrc.encode()).hexdigest()
pre = ""
if os.path.exists(f"{root}/map.webp") and os.path.exists(f"{root}/map.hash") and open(f"{root}/map.hash").read().strip() == mh:
    pre = "const MAP_PRE = \"" + base64.b64encode(open(f"{root}/map.webp", "rb").read()).decode() + "\";\n"
else:
    print("УВАГА: map.webp застарів або відсутній — карта пектиметься в браузері. Хеш:", mh)
js = pre + "\n".join(open(f, encoding="utf-8").read() for f in sorted(glob.glob(f"{root}/[0-9][0-9]-*.js")))
html = f'''<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Попелястий Шпиль</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:wght@500;700&family=PT+Sans:wght@400;700&display=swap">
<style>
{css}
</style>
</head>
<body>
<div id="stage">
  <div id="game" role="application" aria-label="Попелястий Шпиль">
    <header id="top"></header>
    <div id="mid">
      <aside id="belt" aria-label="Пояс"></aside>
      <main id="view"></main>
      <aside id="panel"></aside>
    </div>
    <section id="chat" aria-label="Чат">
      <div class="cmain">
        <div class="tabs" role="tablist" aria-label="Канали чату" id="tabs"></div>
        <div class="clog" id="clog" aria-live="polite"></div>
        <form class="cin" id="cform"><label class="sr" for="cinp">Повідомлення</label><input id="cinp" type="text" autocomplete="off" placeholder="Написати в локацію"></form>
      </div>
      <div class="res">
        <div class="h"><b>Мешканці</b><span id="rcount"></span></div>
        <div class="rlist" id="rlist"></div>
      </div>
    </section>
    <div id="modal" role="dialog" aria-modal="true"></div>
  </div>
</div>
<script>
{js}
</script>
</body>
</html>
'''
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html"), "w", encoding="utf-8").write(html)
print(len(html))
