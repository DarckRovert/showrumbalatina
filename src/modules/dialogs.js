export function initDialogs() {
  const videoDialog = document.getElementById('video-modal');
  const qrDialog = document.getElementById('qr-modal');
  const diplomaDialog = document.getElementById('diploma-modal');
  const playerWrap = document.getElementById('video-modal-player');
  const titleEl = document.getElementById('video-modal-title');
  const metaEl = document.getElementById('video-modal-meta');
  const descEl = document.getElementById('video-modal-desc');
  const ytLinkEl = document.getElementById('video-modal-yt-link');

  // Fallback de light dismiss para navegadores sin HTMLDialogElement.prototype.closedBy (ej. Safari)
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = isOutside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && isOutside(e, dialog)) {
          dialog.close();
        }
      });
    });
  }

  // Limpiar returnValue en todo diálogo nativo al cerrar
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('close', () => {
      dialog.returnValue = '';
    });
  });

  if (videoDialog) {
    videoDialog.addEventListener('close', () => {
      if (playerWrap) {
        playerWrap.innerHTML = '';
      }
    });
  }

  function openVideoModal(video) {
    if (!videoDialog || !video || !video.id) return;
    if (titleEl) titleEl.textContent = video.title;
    if (metaEl) metaEl.textContent = `${video.performer} • ${video.year} • ${video.duration} • ${video.views} vistas`;
    if (descEl) descEl.textContent = video.description || '';
    if (ytLinkEl) ytLinkEl.href = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;

    if (playerWrap) {
      playerWrap.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.className = 'w-full h-full';
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = video.title;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      );
      iframe.allowFullscreen = true;
      playerWrap.appendChild(iframe);
    }

    videoDialog.showModal();
  }

  document.querySelectorAll('[data-open-qr]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (qrDialog) {
        qrDialog.showModal();
      }
    });
  });

  document.querySelectorAll('[data-open-diploma]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (diplomaDialog) {
        diplomaDialog.showModal();
      }
    });
  });

  return { openVideoModal };
}
