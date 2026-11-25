export function initRepertoireTabs() {
  const tablist = document.getElementById('repertoire-tablist');
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll('.rep-tab'));
  const panels = tabs
    .map((tab) => document.getElementById(tab.getAttribute('data-panel') || ''))
    .filter(Boolean);

  if (!tabs.length || !panels.length) return;

  const supportsFocusGroup = 'focusGroup' in HTMLElement.prototype;

  if (!supportsFocusGroup) {
    tablist.setAttribute('role', 'tablist');
    tabs.forEach((t) => t.setAttribute('role', 'tab'));
  }

  function activateTab(selectedTab, { moveFocus = false } = {}) {
    const targetPanelId = selectedTab.getAttribute('data-panel');

    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.toggleAttribute('focusgroupstart', isSelected);
      if (!supportsFocusGroup) {
        tab.tabIndex = isSelected ? 0 : -1;
      }
    });

    panels.forEach((panel) => {
      const match = panel.id === targetPanelId;
      if (match) {
        panel.hidden = false;
        panel.tabIndex = 0;
      } else {
        panel.hidden = 'until-found';
        panel.removeAttribute('tabindex');
      }
    });

    try {
      selectedTab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
    } catch {
      selectedTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    if (moveFocus) {
      selectedTab.focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });

    // Selección al recibir foco con flechas cuando el navegador soporta focusgroup
    tab.addEventListener('focus', () => {
      if (supportsFocusGroup && tab.getAttribute('aria-selected') !== 'true') {
        activateTab(tab);
      }
    });

    // Fallback de teclado (ArrowLeft, ArrowRight, Home, End) para Safari / Firefox
    if (!supportsFocusGroup) {
      tab.addEventListener('keydown', (e) => {
        let nextIndex = null;
        if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') nextIndex = 0;
        else if (e.key === 'End') nextIndex = tabs.length - 1;

        if (nextIndex !== null) {
          e.preventDefault();
          activateTab(tabs[nextIndex], { moveFocus: true });
        }
      });
    }
  });

  // Sincronizar pestaña cuando "Buscar en la página" (Ctrl+F) revela contenido oculto con until-found
  panels.forEach((panel) => {
    panel.addEventListener('beforematch', () => {
      const matchingTab = tabs.find((t) => t.getAttribute('data-panel') === panel.id);
      if (matchingTab) {
        activateTab(matchingTab);
      }
    });
  });

  // Fallback de bordes difuminados para navegadores sin animation-timeline: scroll()
  if (!CSS.supports('animation-timeline', 'scroll()') && tabs.length > 1) {
    const first = tabs[0];
    const last = tabs[tabs.length - 1];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, intersectionRatio } of entries) {
          tablist.classList.toggle(target === first ? 'more-start' : 'more-end', intersectionRatio < 1);
        }
      },
      { root: tablist, threshold: 1, rootMargin: '1px' }
    );
    observer.observe(first);
    observer.observe(last);
  }
}
