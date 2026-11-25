import repertoireData from './data/repertoire.json';
import servicesData from './data/services.json';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Año dinámico en footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Menú Móvil
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. Renderizado de Repertorio
  const repGrid = document.getElementById('repertoire-grid');
  const filterBtns = document.querySelectorAll('.repertoire-tab-btn');

  function renderRepertoire(filter = 'all') {
    if (!repGrid) return;
    repGrid.innerHTML = '';

    const items = filter === 'all' 
      ? repertoireData 
      : repertoireData.filter(i => i.category === filter);

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl border border-slate-800 hover:border-gold-500/40';

      const hitsList = item.hits.map(h => `
        <li class="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
          <span class="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
          <span>${h}</span>
        </li>
      `).join('');

      card.innerHTML = `
        <div>
          <div class="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
            <svg class="w-6 h-6 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
          </div>
          <h3 class="text-white font-bold text-lg mb-2">${item.title}</h3>
          <p class="text-slate-400 text-xs sm:text-sm mb-5 leading-relaxed">${item.description}</p>
        </div>
        <div>
          <h4 class="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">Éxitos Destacados:</h4>
          <ul class="space-y-1.5">
            ${hitsList}
          </ul>
        </div>
      `;
      repGrid.appendChild(card);
    });
  }

  renderRepertoire('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-gold-500', 'text-black', 'border-gold-500');
        b.classList.add('bg-slate-900', 'text-slate-300', 'border-slate-800');
      });
      btn.classList.add('active', 'bg-gold-500', 'text-black', 'border-gold-500');
      btn.classList.remove('bg-slate-900', 'text-slate-300', 'border-slate-800');

      const cat = btn.getAttribute('data-cat');
      renderRepertoire(cat);
    });
  });

  // Estilos iniciales para botones de filtro
  filterBtns.forEach((b, idx) => {
    if (idx === 0) {
      b.className = 'repertoire-tab-btn px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all bg-gold-500 text-black border border-gold-500 shadow-md';
    } else {
      b.className = 'repertoire-tab-btn px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all bg-slate-900 text-slate-300 border border-slate-800 hover:border-gold-500/40';
    }
  });

  // 4. Renderizado de Servicios
  const srvGrid = document.getElementById('services-grid');
  if (srvGrid) {
    srvGrid.innerHTML = '';
    servicesData.forEach(srv => {
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl border border-slate-800 hover:border-gold-500/40 relative overflow-hidden';

      const featList = srv.features.map(f => `
        <li class="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
          <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>${f}</span>
        </li>
      `).join('');

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] font-bold uppercase tracking-wider">
              ${srv.badge}
            </span>
          </div>
          <h3 class="text-white font-bold text-xl mb-3">${srv.title}</h3>
          <p class="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">${srv.description}</p>
        </div>
        <div>
          <h4 class="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Incluye:</h4>
          <ul class="space-y-2 mb-6">
            ${featList}
          </ul>
          <a href="#cotizar" class="block text-center py-2.5 rounded-xl bg-slate-900 hover:bg-gold-500 hover:text-black border border-slate-700 hover:border-gold-500 text-xs font-bold text-slate-200 transition-all uppercase tracking-wider">
            Cotizar Paquete
          </a>
        </div>
      `;
      srvGrid.appendChild(card);
    });
  }

  // 5. Cotizador Interactivo de WhatsApp
  const quoteForm = document.getElementById('quote-form');
  const clientName = document.getElementById('client-name');
  const eventType = document.getElementById('event-type');
  const eventDate = document.getElementById('event-date');
  const eventLoc = document.getElementById('event-location');
  const eventNotes = document.getElementById('event-notes');
  const previewEl = document.getElementById('message-preview');

  function buildMessage() {
    const name = clientName?.value?.trim() || '[Tu Nombre]';
    const type = eventType?.value || 'Evento';
    const date = eventDate?.value || '[Fecha]';
    const loc = eventLoc?.value?.trim() || '[Ciudad/Lugar]';
    const notes = eventNotes?.value?.trim();

    let msg = `Hola Show Rumba Latina (Jesús Rojas Ochoa),\n`;
    msg += `Mi nombre es ${name}. Deseo solicitar cotización y disponibilidad para mi evento:\n\n`;
    msg += `• Tipo de Evento: ${type}\n`;
    msg += `• Fecha Estimada: ${date}\n`;
    msg += `• Lugar / Ciudad: ${loc}\n`;
    if (notes) {
      msg += `• Detalles / Requerimientos: ${notes}\n`;
    }
    msg += `\nQuedo atento a su respuesta para coordinar la contratación. ¡Muchas gracias!`;

    return msg;
  }

  function updatePreview() {
    if (!previewEl) return;
    const msg = buildMessage();
    previewEl.textContent = msg;
  }

  [clientName, eventType, eventDate, eventLoc, eventNotes].forEach(input => {
    if (input) {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    }
  });

  updatePreview();

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = buildMessage();
      const phone = '51964966904';
      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
