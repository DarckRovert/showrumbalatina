import math
import os
from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps

RAW_DIR = r"C:\Users\darck\.gemini\antigravity\brain\e66491fa-4726-4ed7-be07-e5bb542f0e39\scratch\raw_images"
OUT_IMG_DIR = os.path.abspath("public/images")
OUT_PUB_DIR = os.path.abspath("public")
FONTS_DIR = r"C:\Windows\Fonts"

os.makedirs(OUT_IMG_DIR, exist_ok=True)


def pick_font(candidates, size):
    for name in candidates:
        p = os.path.join(FONTS_DIR, name)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def apply_obsidian_gold_grade(img: Image.Image, vignette_strength: int = 85) -> Image.Image:
    """Aplica gradación editorial coherente Obsidian & Warm Gold sobre fotografías abiertas."""
    graded = ImageEnhance.Contrast(img.convert("RGB")).enhance(1.10)
    graded = ImageEnhance.Color(graded).enhance(1.06)

    # Baño cálido ámbar al 10% para cohesión nocturna con la paleta dorada
    amber_tint = Image.new("RGB", graded.size, (255, 200, 105))
    graded = Image.blend(graded, amber_tint, 0.08).convert("RGBA")

    # Viñeta suave en bordes
    w, h = graded.size
    vignette = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    steps = 24
    for i in range(steps):
        frac = i / steps
        alpha = int(vignette_strength * (1.0 - frac) ** 2)
        inset_x = int((w * 0.14) * frac)
        inset_y = int((h * 0.14) * frac)
        vdraw.rectangle(
            [inset_x, inset_y, w - inset_x, h - inset_y],
            outline=(8, 8, 14, alpha),
            width=max(2, int(min(w, h) * 0.018)),
        )

    return Image.alpha_composite(graded, vignette).convert("RGB")


def save_multi_format(img: Image.Image, base_path_no_ext: str):
    rgb = img.convert("RGB")
    rgb.save(f"{base_path_no_ext}.avif", format="AVIF", quality=65)
    rgb.save(f"{base_path_no_ext}.webp", format="WEBP", quality=82, method=6)
    rgb.save(f"{base_path_no_ext}.jpg", format="JPEG", quality=85, optimize=True, progressive=True)


def process_stage_images():
    hero_raw = Image.open(os.path.join(RAW_DIR, "hero-stage.jpg")).convert("RGB")
    hero_1600 = apply_obsidian_gold_grade(
        ImageOps.fit(hero_raw, (1600, 900), method=Image.Resampling.LANCZOS, centering=(0.55, 0.45)),
        vignette_strength=110,
    )
    hero_800 = hero_1600.resize((800, 450), Image.Resampling.LANCZOS)
    save_multi_format(hero_1600, os.path.join(OUT_IMG_DIR, "hero-stage-1600"))
    save_multi_format(hero_800, os.path.join(OUT_IMG_DIR, "hero-stage-800"))
    print("[OK] Hero 1600 & 800 AVIF/WebP/JPG")

    for name in ["event-wedding", "event-quince", "event-patronal", "event-corporate"]:
        raw = Image.open(os.path.join(RAW_DIR, f"{name}.jpg")).convert("RGB")
        fitted = apply_obsidian_gold_grade(
            ImageOps.fit(raw, (800, 600), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5)),
            vignette_strength=90,
        )
        save_multi_format(fitted, os.path.join(OUT_IMG_DIR, name))
        print(f"[OK] {name} AVIF/WebP/JPG")

    return hero_raw


def generate_og_image(hero_raw: Image.Image):
    width, height = 1200, 630
    bg = apply_obsidian_gold_grade(
        ImageOps.fit(hero_raw, (width, height), method=Image.Resampling.LANCZOS, centering=(0.55, 0.45)),
        vignette_strength=120,
    ).convert("RGBA")

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    for y in range(height):
        dist_center = abs(y - height * 0.44) / (height * 0.56)
        alpha = int(172 + min(70, dist_center * 70))
        odraw.line([(0, y), (width, y)], fill=(8, 8, 14, alpha))

    composed = Image.alpha_composite(bg, overlay)
    draw = ImageDraw.Draw(composed)

    draw.rectangle([22, 22, width - 22, height - 22], outline=(229, 165, 6, 235), width=3)
    draw.rectangle([30, 30, width - 30, height - 30], outline=(254, 213, 66, 95), width=1)

    font_badge = pick_font(["segoeuib.ttf", "arialbd.ttf"], 24)
    font_title = pick_font(["georgiab.ttf", "timesbd.ttf", "arialbd.ttf"], 78)
    font_sub = pick_font(["seguisb.ttf", "segoeui.ttf", "arialbd.ttf"], 30)
    font_genres = pick_font(["segoeuib.ttf", "arialbd.ttf"], 25)
    font_pill = pick_font(["segoeuib.ttf", "arialbd.ttf"], 28)

    def text_shadow(xy, text, font, fill, anchor="mm", shadow_offset=(0, 3)):
        draw.text((xy[0] + shadow_offset[0], xy[1] + shadow_offset[1]), text, font=font, fill=(0, 0, 0, 225), anchor=anchor)
        draw.text(xy, text, font=font, fill=fill, anchor=anchor)

    def draw_star(cx, cy, outer_r=10, inner_r=4.2, fill=(253, 192, 18, 255)):
        pts = []
        for i in range(10):
            ang = -math.pi / 2 + i * math.pi / 5
            r = outer_r if i % 2 == 0 else inner_r
            pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
        draw.polygon(pts, fill=fill)

    text_shadow((width // 2, 112), "GRUPO MUSICAL EN HUANCAYO  •  PERÚ", font_badge, (253, 192, 18, 255))
    draw_star(width // 2 - 282, 112, outer_r=11, inner_r=4.5)
    draw_star(width // 2 + 282, 112, outer_r=11, inner_r=4.5)
    text_shadow((width // 2, 212), "SHOW RUMBA LATINA", font_title, (255, 245, 214, 255), shadow_offset=(0, 5))
    text_shadow((width // 2, 294), "Dir. Jesús 'Beto' Rojas Ochoa  •  +15 Años de Trayectoria", font_sub, (226, 232, 240, 255))
    text_shadow((width // 2, 378), "Cumbia  •  Salsa  •  Santiago  •  Rock  •  Boleros", font_genres, (254, 213, 66, 255))

    pill_w, pill_h = 840, 74
    px0, py0 = (width - pill_w) // 2, 466
    draw.rounded_rectangle(
        [px0, py0, px0 + pill_w, py0 + pill_h],
        radius=37,
        fill=(10, 22, 18, 240),
        outline=(16, 185, 129, 235),
        width=2,
    )
    text_shadow(
        (width // 2, py0 + pill_h // 2),
        "WhatsApp: +51 964 966 904   •   showrumbalatina.github.io",
        font_pill,
        (110, 231, 183, 255),
        shadow_offset=(0, 2),
    )

    og_path = os.path.join(OUT_IMG_DIR, "og-image.png")
    composed.convert("RGB").save(og_path, format="PNG", optimize=True)
    print(f"[OK] {og_path} ({os.path.getsize(og_path)} bytes)")


def generate_pwa_icons():
    S = 1024
    icon = Image.new("RGBA", (S, S), (10, 10, 15, 255))
    draw = ImageDraw.Draw(icon)

    cx, cy = S // 2, S // 2
    for r in range(440, 0, -8):
        alpha = int(34 * (1 - r / 440))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(229, 165, 6, alpha))

    pad = 58
    draw.ellipse([pad, pad, S - pad, S - pad], fill=(16, 16, 26, 255), outline=(254, 213, 66, 255), width=26)
    draw.ellipse([pad + 26, pad + 26, S - pad - 26, S - pad - 26], outline=(184, 121, 3, 180), width=6)

    gold = (254, 213, 66, 255)
    amber = (229, 165, 6, 255)

    draw.ellipse([270, 585, 420, 710], fill=amber)
    draw.ellipse([278, 590, 412, 702], fill=gold)
    draw.ellipse([585, 505, 735, 630], fill=amber)
    draw.ellipse([593, 510, 727, 622], fill=gold)

    draw.rounded_rectangle([376, 285, 420, 650], radius=16, fill=gold)
    draw.rounded_rectangle([691, 205, 735, 570], radius=16, fill=gold)

    draw.polygon([(376, 275), (735, 195), (735, 265), (376, 345)], fill=gold)
    draw.polygon([(376, 365), (735, 285), (735, 325), (376, 405)], fill=amber)

    star_cx, star_cy, outer_r, inner_r = 512, 165, 52, 22
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        r = outer_r if i % 2 == 0 else inner_r
        pts.append((star_cx + r * math.cos(ang), star_cy + r * math.sin(ang)))
    draw.polygon(pts, fill=gold)

    for size, fname in [
        (180, "apple-touch-icon.png"),
        (192, "icon-192.png"),
        (512, "icon-512.png"),
    ]:
        resized = icon.resize((size, size), resample=Image.Resampling.LANCZOS)
        dest = os.path.join(OUT_PUB_DIR, fname)
        resized.convert("RGB").save(dest, format="PNG", optimize=True)
        print(f"[OK] {dest} ({os.path.getsize(dest)} bytes)")


def main():
    hero_raw = process_stage_images()
    generate_og_image(hero_raw)
    generate_pwa_icons()
    print("ALL MEDIA ASSETS PROCESSED SUCCESSFULLY")


if __name__ == "__main__":
    main()
