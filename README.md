# Show Rumba Latina — Sitio Web Oficial (v2.0)

Portal web de alto alcance, conversión y difusión audiovisual para la agrupación musical **Show Rumba Latina** (Huancayo, Perú), bajo la dirección de **Jesús Alberto "Beto" Rojas Ochoa**.

👉 **Sitio en vivo:** [https://showrumbalatina.github.io/](https://showrumbalatina.github.io/)

---

## 🎵 Información Verificada de la Agrupación
* **Director General y Voz Principal:** Jesús Alberto "Beto" Rojas Ochoa.
* **Trayectoria Documentada:** +15 años (registros verificados en YouTube desde abril de 2011).
* **Sede y Cobertura:** Huancayo Metropolitano, Valle del Mantaro (El Tambo, Chilca, Jauja, Concepción, Chupaca), Región Junín / Selva Central y giras a nivel nacional.
* **Contacto Directo / WhatsApp:** `+51 964 966 904`.
* **Canales Oficiales:**
  * [Facebook: /showrumbalatinahuancayo/](https://www.facebook.com/showrumbalatinahuancayo/)
  * [Instagram: @showrumbalatina](https://www.instagram.com/showrumbalatina/)
  * [YouTube: @BETOCANTARO4](https://www.youtube.com/@BETOCANTARO4) (9 presentaciones oficiales embebidas)
* **5 Géneros Verificados:** Cumbia de antología y actual, Salsa & Merengue, Santiago & Folclore del Mantaro, Rock en Español & Hora Loca, y Boleros & Clásicos del Recuerdo (*Camino del Puente*, *Intruso Corazón*, *Loco por ti*, *Mis 18 Años*).

---

## 🚀 Arquitectura v2.0 & Estándares Web Modernos ($0.00 Permanente)
* **Fotografía Editorial AVIF / WebP / JPG:** `<picture>` optimizado con `fetchpriority="high"` exclusivo para el Hero LCP y `loading="lazy"` bajo el pliegue.
* **Videoteca Lite (0 KB de iframe inicial):** 9 videos oficiales en vivo de `@BETOCANTARO4` abiertos bajo demanda en `<dialog closedby="any">` nativo con `referrerpolicy="strict-origin-when-cross-origin"`.
* **Repertorio Accesible (`tabs`):** Pestañas en una sola fila con `focusgroup="tablist nomemory"`, bordes difuminados por scroll, paneles `hidden="until-found"` con `beforematch` y fallback de teclado para Safari/Firefox.
* **Cotizador Inteligente & Kit Viral:** Fecha mínima en zona horaria `America/Lima`, formato `es-PE`, validación `:user-invalid` sincronizada con `aria-invalid`, descarga de contacto `.vcf` (vCard), botón Web Share y Código QR SVG/PNG imprimible (`errorCorrectionLevel: 'H'`).
* **SEO Técnico:** Triple bloque JSON-LD (`MusicGroup`, `FAQPage`, `VideoObject`), `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, iconos PWA (`180/192/512`) y `404.html` seguro.
* **Soberanía Anti-Billing ($0.00):** Sin `.github/workflows/`; compilación local en CPU y despliegue directo por CLI.

---

## 🛠️ Comandos de Desarrollo y Despliegue
```powershell
# Servidor local de desarrollo
npm run dev

# Regenerar códigos QR SVG/PNG (1000x1000, ECC H)
npm run generate:qr

# Compilar y ejecutar auditoría automatizada local
npm run build ; python scripts/audit-site.py

# Desplegar a showrumbalatina.github.io (rama main)
npm run deploy

# Desplegar en ambos repositorios (org + respaldo personal)
npm run deploy:all
```

---

## 📸 Créditos Fotográficos
Las fotografías atmosféricas de escenario y eventos provienen de **Wikimedia Commons** bajo licencias abiertas (`CC0`, `CC BY 2.0`, `CC BY 4.0`, `CC BY-SA 4.0`). Consulta el detalle en [public/images/README.md](public/images/README.md).
