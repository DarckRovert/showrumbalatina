import os
import ssl
import sys
import urllib.request

RAW_DIR = r"C:\Users\darck\.gemini\antigravity\brain\e66491fa-4726-4ed7-be07-e5bb542f0e39\scratch\raw_images"
os.makedirs(RAW_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "ShowRumbaLatinaWeb/2.0 (https://showrumbalatina.github.io/; darckrovert@gmail.com)"
}

PHOTOS = [
    {
        "filename": "hero-stage.jpg",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/b/b2/Musicians_performing_on_stage_at_a_night_concert_featuring_vibrant_lights_and_energetic_atmosphere.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/2/2d/Live_rock_band_performance_under_stage_lights_during_an_outdoor_festival_in_the_evening.jpg",
        ],
    },
    {
        "filename": "event-wedding.jpg",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/5/52/Wedding_reception_tables_and_benches_%28Unsplash%29.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/8/8d/DZ6_0943_A_brightly_lit_mobile_bar_at_night_serves_drinks_beneath_string_lights_in_an_open-air_market_inviting_guests_to_relax_at_nearby_tables.jpg",
        ],
    },
    {
        "filename": "event-quince.jpg",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/1/1a/Bangkok%2C_Thailand%2C_Party%2C_Lights_and_sounds%2C_Electronic_music.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/3/31/A_woman_dancing_at_a_party_with_neon_lights.jpg",
        ],
    },
    {
        "filename": "event-patronal.jpg",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/8/85/Beach-Please-2022-crowd-stage-lights-night-performance.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/9/9c/DSC_6184_A_large_crowd_gathers_on_the_beachfront_at_night_colorful_stage_lights_and_city_high-rises_glowing_in_the_background_as_people_enjoy_an_outdoor_concert_or_festival.jpg",
        ],
    },
    {
        "filename": "event-corporate.jpg",
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/b/ba/M%C3%BAsico_con_Guitarra_Requinto.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/0/0a/DSC_7673_A_musician_sings_and_plays_acoustic_guitar_into_a_microphone_during_an_outdoor_evening_performance_with_another_bandmate_playing_keys_in_the_background.jpg",
        ],
    },
]

def main() -> int:
    ctx = ssl._create_unverified_context()
    failures = []
    for item in PHOTOS:
        dest = os.path.join(RAW_DIR, item["filename"])
        if os.path.exists(dest) and os.path.getsize(dest) > 50000:
            print(f"[SKIP] Ya descargado: {dest} ({os.path.getsize(dest)} bytes)")
            continue
        ok = False
        for url in item["urls"]:
            try:
                print(f"[GET] {item['filename']} <- {url[:85]}...")
                req = urllib.request.Request(url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=35, context=ctx) as r:
                    data = r.read()
                if len(data) < 25000:
                    raise ValueError(f"Archivo demasiado pequeño ({len(data)} bytes)")
                with open(dest, "wb") as f:
                    f.write(data)
                print(f"[OK]  {dest} ({len(data):,} bytes)")
                ok = True
                break
            except Exception as exc:
                print(f"[WARN] Falló {url[:70]}: {exc}", file=sys.stderr)
        if not ok:
            failures.append(item["filename"])

    if failures:
        print("Fallaron descargas:", failures, file=sys.stderr)
        return 1
    print("ALL 5 WIKIMEDIA PHOTOS DOWNLOADED")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
