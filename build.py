#!/usr/bin/env python3
"""
standalone.html üretir: index.html + style.css + tüm .js dosyaları tek dosyada.

Kullanım:  python build.py

Neden gerekli: index.html harici dosyalar yükler; tek dosyalık sürüm
mail'le gönderilebilir, USB'den açılabilir, sunucu istemez.
"""
import io
import os
import re

BURASI = os.path.dirname(os.path.abspath(__file__))
JS_SIRASI = ("moods.js", "faces.js", "app.js", "signature.js")


def oku(ad):
    return io.open(os.path.join(BURASI, ad), encoding="utf-8").read()


def guvenli(metin):
    """Gömülü içerikteki </script> HTML script bloğunu erken kapatır —
    yorumun ya da dizginin içinde olması tarayıcıyı ilgilendirmez.
    Kaçırılmış hâli JS için aynı anlama gelir, HTML parçalayıcı için gelmez."""
    return re.sub(r"</(script)", r"<\\/\1", metin, flags=re.IGNORECASE)


def main():
    html = oku("index.html")
    govde = html.split("<body>", 1)[1].rsplit("</body>", 1)[0]
    govde = re.sub(r'\s*<script src="[^"]+"></script>', "", govde).strip()

    css = oku("style.css")
    js = "\n".join(oku(f) for f in JS_SIRASI)

    viewport_shim = (
        "/* Tek dosya sürümü bir Artifact/iframe içinde de açılabiliyor; oralarda\n"
        "   <head> bizim değil. Telefonda düzenin cihaz genişliğine göre kurulması\n"
        "   için viewport etiketini çalışma anında ekliyoruz. */\n"
        "(function () {\n"
        '  if (!document.querySelector(\'meta[name="viewport"]\')) {\n'
        "    var m = document.createElement('meta');\n"
        "    m.name = 'viewport';\n"
        "    m.content = 'width=device-width,initial-scale=1,"
        "maximum-scale=1,user-scalable=no,viewport-fit=cover';\n"
        "    document.head.appendChild(m);\n"
        "  }\n"
        "})();"
    )

    cikti = (
        '<meta charset="utf-8">\n'
        "<title>Choose Your Mood</title>\n\n"
        "<style>\n" + guvenli(css) + "\n</style>\n\n"
        + guvenli(govde) + "\n\n"
        "<script>\n" + viewport_shim + "\n" + guvenli(js) + "\n</script>\n"
    )

    hedef = os.path.join(BURASI, "standalone.html")
    io.open(hedef, "w", encoding="utf-8").write(cikti)

    # üretilen dosyada script bloğunu erken kapatan bir şey kalmadığını doğrula
    govde_js = cikti.split("<script>", 1)[1]
    if "</script>" in govde_js[: govde_js.rindex("</script>")]:
        raise SystemExit("HATA: script bloğu erken kapanıyor, paket bozuk.")

    print("standalone.html yazildi: %d bayt" % len(cikti))


if __name__ == "__main__":
    main()
