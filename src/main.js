import videosData from './data/videos.json';
import servicesData from './data/services.json';
import { initDialogs } from './modules/dialogs.js';
import { initRepertoireTabs } from './modules/tabs.js';
import { initQuoteForm } from './modules/quote-form.js';
import { initShareActions } from './modules/share-qr.js';
import { initAccordionAndMotion } from './modules/accordion-motion.js';

document.addEventListener('DOMContentLoaded', () => {
  // Región única polite para anuncios de accesibilidad (errores, copias, compartidos)
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'visually-hidden';
  document.body.appendChild(announcer);

  // 1. Año dinámico en footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Menú móvil accesible
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      mobileBtn.setAttribute('aria-expanded', String(!isHidden));
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Modales nativos <dialog> (Videoteca Lightbox + QR)
  const { openVideoModal } = initDialogs();

  // 4. Videoteca Oficial (9 videos de @BETOCANTARO4) con fachadas ligeras (0 KB iframe hasta clic)
  const featuredContainer = document.getElementById('featured-video-card');
  const videosGrid = document.getElementById('videos-grid');
  const videoFilters = Array.from(document.querySelectorAll('[data-video-cat]'));

  const featuredVideo = videosData.find((v) => v.featured) || videosData[0];

  if (featuredContainer && featuredVideo) {
    featuredContainer.innerHTML = `
      <button type="button"
              data-play-video="${featuredVideo.id}"
              class="group relative block w-full text-left rounded-2xl overflow-hidden bg-slate-950 border border-gold-500/30 hover:border-gold-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400">
        <div class="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div class="lg:col-span-7 relative aspect-video bg-black overflow-hidden">
            <img src="${featuredVideo.thumbnail}"
                 alt="${featuredVideo.title}"
                 width="480" height="360"
                 loading="lazy"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-center justify-center">
              <span class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-400 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </div>
            <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-gold-400/50 text-gold-300 text-xs font-bold uppercase tracking-wider">
              ${featuredVideo.badge || 'Destacado'}
            </span>
            <span class="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/85 text-white text-xs font-mono font-semibold">
              ${featuredVideo.duration}
            </span>
          </div>
          <div class="lg:col-span-5 p-6 sm:p-8 space-y-4">
            <div class="flex flex-wrap items-center gap-2 text-xs text-gold-400 font-semibold uppercase tracking-wider">
              <span>${featuredVideo.performer}</span>
              <span aria-hidden="true">•</span>
              <span>${featuredVideo.year}</span>
              <span aria-hidden="true">•</span>
              <span>${featuredVideo.views} vistas</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-extrabold text-white font-display leading-snug">
              ${featuredVideo.title}
            </h3>
            <p class="text-slate-300 text-sm leading-relaxed">
              ${featuredVideo.description}
            </p>
            <div class="inline-flex items-center gap-2 text-gold-300 font-bold text-sm pt-2">
              <span>Reproducir presentación oficial</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </div>
          </div>
        </div>
      </button>
    `;
  }

  function renderVideos(category = 'all') {
    if (!videosGrid) return;
    videosGrid.innerHTML = '';

    const items = category === 'all'
      ? videosData
      : videosData.filter((v) => v.category === category);

    items.forEach((video) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-play-video', video.id);
      btn.className = 'reveal-item group glass-card rounded-2xl overflow-hidden text-left flex flex-col justify-between hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400';

      btn.innerHTML = `
        <div class="relative aspect-video w-full bg-black overflow-hidden">
          <img src="${video.thumbnail}"
               alt="${video.title}"
               width="480" height="360"
               loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
            <span class="w-12 h-12 rounded-full bg-gold-400/95 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </span>
          </div>
          ${
            video.badge
              ? `<span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 border border-gold-500/40 text-gold-300 text-[11px] font-bold">${video.badge}</span>`
              : ''
          }
          <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 text-white text-[11px] font-mono font-semibold">${video.duration}</span>
        </div>
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-2">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wider text-gold-400">${video.performer} • ${video.year}</p>
            <h3 class="text-white font-bold text-sm sm:text-base mt-1 leading-snug group-hover:text-gold-300 transition-colors">${video.title}</h3>
          </div>
          <p class="text-xs text-slate-400">${video.views} reproducciones verificadas</p>
        </div>
      `;
      videosGrid.appendChild(btn);
    });
  }

  renderVideos('all');

  videoFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-video-cat') || 'all';
      videoFilters.forEach((b) => {
        const active = b === btn;
        b.setAttribute('aria-pressed', String(active));
        b.classList.toggle('bg-gold-500', active);
        b.classList.toggle('text-black', active);
        b.classList.toggle('border-gold-500', active);
        b.classList.toggle('bg-slate-900', !active);
        b.classList.toggle('text-slate-300', !active);
        b.classList.toggle('border-slate-800', !active);
      });
      renderVideos(cat);
    });
  });

  document.addEventListener('click', (e) => {
    const playBtn = e.target.closest?.('[data-play-video]');
    if (!playBtn) return;
    const vid = playBtn.getAttribute('data-play-video');
    const found = videosData.find((v) => v.id === vid);
    if (found) {
      openVideoModal(found);
    }
  });

  // 5. Renderizado de Servicios con imágenes AVIF / WebP / JPG responsivas
  const srvGrid = document.getElementById('services-grid');
  if (srvGrid) {
    srvGrid.innerHTML = '';
    servicesData.forEach((srv) => {
      const article = document.createElement('article');
      article.className = 'reveal-item glass-card rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl';

      const featList = srv.features
        .map(
          (f) => `
          <li class="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
            <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${f}</span>
          </li>`
        )
        .join('');

      article.innerHTML = `
        <div>
          <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
            <picture>
              <source srcset="./images/${srv.image}.avif" type="image/avif">
              <source srcset="./images/${srv.image}.webp" type="image/webp">
              <img src="./images/${srv.image}.jpg"
                   alt="${srv.imageAlt}"
                   width="800" height="600"
                   loading="lazy"
                   class="w-full h-full object-cover">
            </picture>
            <div class="absolute inset-0 bg-gradient-to-t from-[#12121c] via-[#12121c]/20 to-transparent"></div>
            <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 border border-gold-500/40 text-gold-300 text-[11px] font-bold uppercase tracking-wider">
              ${srv.badge}
            </span>
          </div>
          <div class="p-6 pb-2">
            <h3 class="text-white font-bold text-xl mb-1.5 font-display">${srv.title}</h3>
            <p class="text-[11px] text-gold-400 font-semibold uppercase tracking-wider mb-3">${srv.duration}</p>
            <p class="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">${srv.description}</p>
          </div>
        </div>
        <div class="px-6 pb-6 pt-2">
          <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Incluye:</h4>
          <ul class="space-y-2 mb-5">
            ${featList}
          </ul>
          <button type="button"
                  data-select-service="${srv.eventTypeValue}"
                  class="w-full py-3 rounded-xl bg-slate-900 hover:bg-gold-500 hover:text-black border border-slate-700 hover:border-gold-500 text-xs font-bold text-slate-100 transition-colors uppercase tracking-wider">
            Cotizar Este Paquete
          </button>
        </div>
      `;
      srvGrid.appendChild(article);
    });
  }

  // 6. Inicializar Tabs, Cotizador, Compartir/QR y FAQ + Scroll Motion
  initRepertoireTabs();
  initQuoteForm(announcer);
  initShareActions(announcer);
  initAccordionAndMotion();
});
