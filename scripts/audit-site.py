import html as html_lib
import json
import os
import re
import sys

ERRORS = []

def check(condition: bool, msg: str):
    if not condition:
        ERRORS.append(msg)
        print(f"[FAIL] {msg}", file=sys.stderr)
    else:
        print(f"[OK]   {msg}")

def main() -> int:
    # 1. Prohibir GitHub Actions (.github/workflows) por política anti-billing $0.00
    check(not os.path.exists(".github/workflows"), "No existe .github/workflows/ (costo $0.00)")

    # 2. Verificar package.json limpio de lucide
    with open("package.json", "r", encoding="utf-8") as f:
        pkg = json.load(f)
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    check("lucide" not in deps, "lucide eliminado de package.json")
    check("qrcode" in pkg.get("devDependencies", {}), "qrcode presente en devDependencies")

    # 3. Verificar dist/ completo y ausencia de obsoletos
    required_files = [
        "dist/index.html",
        "dist/404.html",
        "dist/robots.txt",
        "dist/sitemap.xml",
        "dist/manifest.webmanifest",
        "dist/favicon.svg",
        "dist/apple-touch-icon.png",
        "dist/icon-192.png",
        "dist/icon-512.png",
        "dist/images/og-image.jpg",
        "dist/images/qr-showrumbalatina.svg",
        "dist/images/qr-showrumbalatina.png",
        "dist/images/hero-stage-1600.avif",
        "dist/images/hero-stage-1600.webp",
        "dist/images/hero-stage-1600.jpg",
        "dist/images/hero-stage-800.avif",
        "dist/images/hero-stage-800.webp",
        "dist/images/hero-stage-800.jpg",
    ]
    for ev in ["event-wedding", "event-quince", "event-patronal", "event-corporate"]:
        for ext in ["avif", "webp", "jpg"]:
            required_files.append(f"dist/images/{ev}.{ext}")

    for path in required_files:
        check(os.path.isfile(path) and os.path.getsize(path) > 0, f"Existe {path}")

    og_size = os.path.getsize("dist/images/og-image.jpg") if os.path.isfile("dist/images/og-image.jpg") else 999999
    check(og_size < 300_000, f"og-image.jpg < 300 KB ({og_size} bytes, compatible con WhatsApp)")
    check(not os.path.exists("dist/images/og-image.png"), "No existe dist/images/og-image.png obsoleto")
    check(not os.path.exists("dist/images/.gitkeep"), "No existe dist/images/.gitkeep obsoleto")

    # 4. Verificar dist/404.html sin bucle infinito ./
    with open("dist/404.html", "r", encoding="utf-8") as f:
        html404 = f.read()
    check("url=./" not in html404 and "replace('./')" not in html404, "dist/404.html libre de bucle infinito")

    # 5. Auditar dist/index.html
    with open("dist/index.html", "r", encoding="utf-8") as f:
        html = f.read()
    html_unescaped = html_lib.unescape(html)

    check("<main" in html, "Landmark <main> presente")
    check("skip-link" in html, "Skip link presente")
    check('name="theme-color"' in html, "Meta theme-color presente")
    check("apple-touch-icon" in html, "Apple touch icon enlazado")
    check("manifest.webmanifest" in html, "Manifest PWA enlazado")
    check("og-image.jpg" in html and "og-image.png" not in html, "OpenGraph apunta a og-image.jpg (sin referencias a og-image.png)")
    check('pattern=".*\\S.*\\S.*"' in html, "Validación anti-espacios (pattern) presente en formulario")
    check("https://www.youtube.com/@BETOCANTARO4" in html, "Canal oficial YouTube @BETOCANTARO4 incluido")

    hero_imgs = re.findall(r'<img\b[^>]*fetchpriority="high"[^>]*>', html, re.I)
    check(len(hero_imgs) == 1, f"Exactamente 1 imagen hero con fetchpriority='high' (encontradas: {len(hero_imgs)})")
    if hero_imgs:
        check('loading="lazy"' not in hero_imgs[0], "Imagen hero LCP NO tiene loading='lazy'")

    blank_links = re.findall(r'<a\b[^>]*target="_blank"[^>]*>', html, re.I)
    missing_rel = [a for a in blank_links if 'rel="noopener noreferrer"' not in a]
    check(len(missing_rel) == 0, f"Todos los enlaces target='_blank' ({len(blank_links)}) tienen rel='noopener noreferrer'")

    summaries = re.findall(r'<summary\b[^>]*>.*?</summary>', html, re.I | re.S)
    bad_summaries = [s for s in summaries if re.search(r'<h[1-6]\b', s, re.I)]
    check(len(summaries) >= 6 and len(bad_summaries) == 0, f"FAQ <summary> ({len(summaries)}) sin encabezados anidados")

    dialogs = re.findall(r'<dialog\b[^>]*>', html, re.I)
    bad_dialogs = [d for d in dialogs if "role=" in d.lower() or "aria-modal" in d.lower()]
    check(len(dialogs) == 2 and len(bad_dialogs) == 0, "Modales <dialog> nativos sin role='dialog' ni aria-modal redundantes")

    # Verificar todos los bloques JSON-LD válidos y capturar FAQPage
    ld_blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    check(len(ld_blocks) >= 3, f"Al menos 3 bloques JSON-LD presentes ({len(ld_blocks)})")
    faq_ld_questions = set()
    for idx, block in enumerate(ld_blocks, 1):
        try:
            parsed = json.loads(block)
            print(f"[OK]   JSON-LD bloque #{idx} parsea correctamente")
            if parsed.get("@type") == "FAQPage":
                for q_obj in parsed.get("mainEntity", []):
                    faq_ld_questions.add(q_obj.get("name", ""))
        except Exception as exc:
            check(False, f"JSON-LD bloque #{idx} inválido: {exc}")

    # 6. Verificar CSS compilado contiene no-clip subtract
    css_files = [f for f in os.listdir("dist/assets") if f.endswith(".css")]
    check(len(css_files) == 1, "Exactamente 1 archivo CSS compilado")
    if css_files:
        with open(os.path.join("dist/assets", css_files[0]), "r", encoding="utf-8") as cf:
            css_txt = cf.read()
        check("no-clip subtract" in css_txt, "CSS compilado conserva mask ... no-clip subtract")

    # 7. Verificar modules JS
    with open("src/modules/dialogs.js", "r", encoding="utf-8") as f:
        dialogs_js = f.read()
    check("strict-origin-when-cross-origin" in dialogs_js, "dialogs.js aplica referrerpolicy='strict-origin-when-cross-origin' en iframes YouTube")

    with open("src/modules/tabs.js", "r", encoding="utf-8") as f:
        tabs_js = f.read()
    check("t.tabIndex =" in tabs_js or "tab.tabIndex =" in tabs_js, "tabs.js inicializa roving tabIndex cuando falta focusGroup")

    # 8. Verificar datos JSON válidos y paridad con dist/index.html
    for jf in ["src/data/videos.json", "src/data/repertoire.json", "src/data/services.json", "src/data/faq.json"]:
        with open(jf, "r", encoding="utf-8") as f:
            data = json.load(f)
        check(isinstance(data, list) and len(data) > 0, f"{jf} válido ({len(data)} items)")

    with open("src/data/repertoire.json", "r", encoding="utf-8") as f:
        rep_data = json.load(f)
    for item in rep_data:
        check(item["title"] in html_unescaped, f"Paridad repertorio: '{item['title']}' presente en HTML")

    with open("src/data/faq.json", "r", encoding="utf-8") as f:
        faq_data = json.load(f)
    for item in faq_data:
        q = item["question"]
        check(q in html_unescaped and q in faq_ld_questions, f"Paridad FAQ (HTML + JSON-LD): '{q[:48]}...'")

    if ERRORS:
        print(f"\nFALLARON {len(ERRORS)} COMPROBACIONES", file=sys.stderr)
        return 1

    print("\nALL CHECKS PASSED")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
