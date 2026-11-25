function getLimaTodayISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function formatDateEsPe(isoDate) {
  if (!isoDate) return '[Fecha por confirmar]';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const dateObj = new Date(`${isoDate}T12:00:00-05:00`);
  if (Number.isNaN(dateObj.getTime())) return isoDate;
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Lima',
  }).format(dateObj);
}

function createVCardBlob() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Show Rumba Latina - Jesús Alberto Rojas Ochoa',
    'N:Rojas Ochoa;Jesús Alberto;;;',
    'ORG:Show Rumba Latina (Grupo Musical Huancayo)',
    'TITLE:Director General y Voz Principal',
    'TEL;TYPE=CELL,VOICE,WHATSAPP:+51964966904',
    'ADR;TYPE=WORK:;;Huancayo;Junín;;Perú',
    'URL:https://showrumbalatina.github.io/',
    'NOTE:Reconocidos por el Congreso de la República (2026). Música 100% variada: Cumbia, Salsa, Santiago, Rock y Boleros. Facebook Agrupación: /showrumbalatinahuancayo/ | Facebook Artista: /showrumbalatina/ | Instagram: @showrumbalatina | YouTube: @BETOCANTARO4',
    'END:VCARD',
  ].join('\r\n');
  return new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
}

export function triggerVCardDownload() {
  const blob = createVCardBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Show_Rumba_Latina_Jesus_Alberto_Rojas_Ochoa.vcf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setupAriaValidation(form, announcer) {
  let announceTimer;
  let announcedField;
  const flagged = new WeakSet();
  const announced = new WeakSet();
  const dirtyFallback = new WeakMap();
  const supportsUserInvalid = CSS.supports('selector(:user-invalid)');

  const spokenText = (node) => {
    const copy = node.cloneNode(true);
    copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    copy.querySelectorAll('[role="img"][aria-label]').forEach((n) => {
      n.replaceWith(`${n.getAttribute('aria-label')}: `);
    });
    return copy.textContent.replace(/\s+/g, ' ').trim();
  };

  const linkError = (el, shown) => {
    const errorId = el.dataset.error;
    if (!errorId) return;
    const ids = (el.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  const announceError = (el) => {
    const error = document.getElementById(el.dataset.error || '');
    if (!error || !announcer) return;
    const label = el.labels?.[0] ? `${spokenText(el.labels[0])}: ` : '';
    clearTimeout(announceTimer);
    announcer.textContent = '';
    announcedField = el;
    announceTimer = setTimeout(() => {
      announcer.textContent = label + spokenText(error);
    }, 500);
  };

  const syncAria = (el, announce = false) => {
    if (!el || !el.matches?.('input, select, textarea')) return;
    const invalid = supportsUserInvalid
      ? el.matches(':user-invalid')
      : el.classList.contains('user-invalid-fallback');

    if (invalid) {
      if (announce && !announced.has(el)) {
        announceError(el);
        announced.add(el);
      }
      el.setAttribute('aria-invalid', 'true');
      linkError(el, true);
      flagged.add(el);
    } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
      el.setAttribute('aria-invalid', 'false');
      linkError(el, false);
      flagged.delete(el);
      announced.delete(el);
      if (announcedField === el && announcer) {
        clearTimeout(announceTimer);
        announcer.textContent = '';
      }
    }
  };

  const updateFallbackClass = (el, announce = false) => {
    if (!el.checkValidity) return;
    const valid = el.validity.valid;
    el.classList.toggle('user-invalid-fallback', !valid);
    el.classList.toggle('user-valid-fallback', valid);
    syncAria(el, announce);
  };

  form.querySelectorAll('input, select, textarea').forEach((el) => syncAria(el));

  if (supportsUserInvalid) {
    form.addEventListener('blur', (e) => syncAria(e.target, true), true);
    form.addEventListener('input', (e) => {
      if (e.target.hasAttribute('aria-invalid')) syncAria(e.target);
    });
    form.addEventListener('change', (e) => syncAria(e.target, true), true);
    form.addEventListener(
      'invalid',
      (e) => {
        announced.add(e.target);
        syncAria(e.target);
      },
      true
    );
  } else {
    form.addEventListener(
      'invalid',
      (e) => {
        const el = e.target;
        dirtyFallback.set(el, { hasInteracted: true, hasBlurred: true });
        announced.add(el);
        updateFallbackClass(el, false);
      },
      true
    );
    form.addEventListener('input', (e) => {
      const el = e.target;
      const state = dirtyFallback.get(el) || { hasInteracted: false, hasBlurred: false };
      state.hasInteracted = true;
      dirtyFallback.set(el, state);
      if (state.hasBlurred) updateFallbackClass(el, false);
    });
    form.addEventListener('change', (e) => {
      const el = e.target;
      dirtyFallback.set(el, { hasInteracted: true, hasBlurred: true });
      updateFallbackClass(el, true);
    });
    form.addEventListener(
      'blur',
      (e) => {
        const el = e.target;
        const state = dirtyFallback.get(el) || { hasInteracted: false, hasBlurred: false };
        state.hasBlurred = true;
        dirtyFallback.set(el, state);
        if (state.hasInteracted) updateFallbackClass(el, true);
      },
      true
    );
  }

  form.addEventListener(
    'reset',
    () => {
      setTimeout(() => {
        form.querySelectorAll('input, select, textarea').forEach((el) => {
          el.classList.remove('user-invalid-fallback', 'user-valid-fallback');
          dirtyFallback.delete(el);
          syncAria(el);
        });
      });
    },
    true
  );

  return {
    forceSyncAll() {
      form.querySelectorAll('input, select, textarea').forEach((el) => {
        if (!supportsUserInvalid && el.checkValidity) {
          dirtyFallback.set(el, { hasInteracted: true, hasBlurred: true });
          el.classList.toggle('user-invalid-fallback', !el.validity.valid);
          el.classList.toggle('user-valid-fallback', el.validity.valid);
        }
        syncAria(el);
      });
    },
  };
}

export function initQuoteForm(announcer) {
  const quoteForm = document.getElementById('quote-form');
  const clientName = document.getElementById('client-name');
  const eventType = document.getElementById('event-type');
  const eventFormat = document.getElementById('event-format');
  const eventDate = document.getElementById('event-date');
  const eventLocation = document.getElementById('event-location');
  const eventGuests = document.getElementById('event-guests');
  const eventNotes = document.getElementById('event-notes');
  const previewEl = document.getElementById('message-preview');
  const copyBtn = document.getElementById('copy-quote-btn');
  const genreChecks = Array.from(document.querySelectorAll('input[name="genres"]'));
  const cityChips = Array.from(document.querySelectorAll('[data-city-chip]'));

  if (eventDate) {
    eventDate.min = getLimaTodayISO();
  }

  const validator = quoteForm ? setupAriaValidation(quoteForm, announcer) : null;

  function buildMessage() {
    const name = clientName?.value?.trim() || '[Tu Nombre]';
    const type = eventType?.value || 'Evento';
    const format = eventFormat?.value || 'Orquesta Estándar';
    const readableDate = formatDateEsPe(eventDate?.value || '');
    const location = eventLocation?.value?.trim() || '[Ciudad / Distrito]';
    const guests = eventGuests?.value || '';
    const notes = eventNotes?.value?.trim();
    const selectedGenres = genreChecks.filter((c) => c.checked).map((c) => c.value);

    let msg = `Hola Show Rumba Latina (Jesús Alberto Rojas Ochoa),\n`;
    msg += `Mi nombre es ${name}. Solicito cotización y disponibilidad para mi evento:\n\n`;
    msg += `• Tipo de Evento: ${type}\n`;
    msg += `• Formato Musical: ${format}\n`;
    msg += `• Fecha Estimada: ${readableDate}\n`;
    msg += `• Lugar / Ciudad: ${location}\n`;
    if (guests) {
      msg += `• Aforo aproximado: ${guests}\n`;
    }
    if (selectedGenres.length > 0) {
      msg += `• Géneros de interés: ${selectedGenres.join(', ')}\n`;
    }
    if (notes) {
      msg += `• Detalles adicionales: ${notes}\n`;
    }
    msg += `\nQuedo atento(a) para coordinar presupuesto y detalles. ¡Muchas gracias!`;
    return msg;
  }

  function updatePreview() {
    if (previewEl) {
      previewEl.textContent = buildMessage();
    }
  }

  [clientName, eventType, eventFormat, eventDate, eventLocation, eventGuests, eventNotes, ...genreChecks].forEach(
    (el) => {
      if (el) {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
      }
    }
  );

  // Chips de ciudad rápida
  cityChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const city = chip.getAttribute('data-city-chip') || '';
      if (eventLocation) {
        eventLocation.value = city;
        eventLocation.dispatchEvent(new Event('input', { bubbles: true }));
        eventLocation.dispatchEvent(new Event('change', { bubbles: true }));
      }
      cityChips.forEach((c) => {
        const active = c === chip;
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
        c.classList.toggle('bg-gold-500/20', active);
        c.classList.toggle('border-gold-400', active);
        c.classList.toggle('text-gold-300', active);
      });
    });
  });

  // Preseleccionar tipo de evento al pulsar "Cotizar Paquete" en tarjetas de Servicios
  document.addEventListener('click', (e) => {
    const btn = e.target.closest?.('[data-select-service]');
    if (!btn) return;
    const serviceVal = btn.getAttribute('data-select-service');
    if (eventType && serviceVal) {
      eventType.value = serviceVal;
      updatePreview();
    }
    document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      clientName?.focus({ preventScroll: true });
    }, 450);
  });

  updatePreview();

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      if (!quoteForm.checkValidity()) {
        e.preventDefault();
        validator?.forceSyncAll();
        quoteForm.reportValidity();
        return;
      }
      e.preventDefault();
      const waUrl = `https://wa.me/51964966904?text=${encodeURIComponent(buildMessage())}`;
      const newWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = waUrl;
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const msg = buildMessage();
      try {
        await navigator.clipboard.writeText(msg);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = msg;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const labelSpan = copyBtn.querySelector('span');
      const prev = labelSpan ? labelSpan.textContent : '';
      if (labelSpan) labelSpan.textContent = '¡Cotización copiada!';
      if (announcer) announcer.textContent = 'Resumen de cotización copiado al portapapeles.';
      setTimeout(() => {
        if (labelSpan) labelSpan.textContent = prev;
      }, 2400);
    });
  }

  document.querySelectorAll('[data-download-vcard]').forEach((btn) => {
    btn.addEventListener('click', () => {
      triggerVCardDownload();
      if (announcer) announcer.textContent = 'Archivo de contacto vCard descargado.';
    });
  });
}
