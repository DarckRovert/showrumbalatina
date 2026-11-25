const SITE_URL = 'https://showrumbalatina.github.io/';

export function initShareActions(announcer) {
  const buttons = document.querySelectorAll('[data-share-site]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const shareData = {
        title: 'Show Rumba Latina — Grupo Musical Huancayo',
        text: 'Música 100% variada para matrimonios, 15 años y fiestas patronales (Cumbia, Salsa, Santiago, Rock y Boleros). Contratos: +51 964 966 904.',
        url: SITE_URL,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          if (announcer) announcer.textContent = 'Enlace compartido correctamente.';
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }

      try {
        await navigator.clipboard.writeText(SITE_URL);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = SITE_URL;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }

      const labelEl = btn.querySelector('[data-share-label]');
      const prev = labelEl ? labelEl.textContent : '';
      if (labelEl) labelEl.textContent = '¡Enlace copiado!';
      if (announcer) announcer.textContent = 'Enlace oficial copiado al portapapeles.';
      setTimeout(() => {
        if (labelEl) labelEl.textContent = prev;
      }, 2200);
    });
  });
}
