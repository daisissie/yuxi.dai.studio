// Native links and disclosures remain usable without JavaScript.
(() => {
  const legacyProjects = {
    'text-meets-map-section': 'projects/when-text-meets-map.html',
    'memory-tides-section': 'projects/memory-tides.html',
    'casita-city-section': 'projects/casita-city.html',
    'jewelry-section': 'projects/suzhou-jewelry.html',
    'photography-section': 'explorations.html#photography',
    'drawings-section': 'explorations.html#drawings'
  };
  function followHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) return;
    if (location.pathname.endsWith('/work.html') && legacyProjects[id]) {
      location.replace(legacyProjects[id]);
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    const details = target.closest('details');
    if (details) {
      details.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  }
  followHash();
  window.addEventListener('hashchange', followHash);
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

  const links = Array.from(document.querySelectorAll('a[data-gallery]'));
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML = `<div class="lightbox-bar"><span class="lightbox-count" aria-live="polite"></span><button type="button" data-close aria-label="Close image viewer">Close ×</button></div><img class="lightbox-image" alt=""><div class="lightbox-bottom"><p class="lightbox-caption"></p><div class="lightbox-controls"><button type="button" data-prev aria-label="Previous image">←</button><button type="button" data-next aria-label="Next image">→</button></div></div>`;
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const count = dialog.querySelector('.lightbox-count');
  const caption = dialog.querySelector('.lightbox-caption');
  const previous = dialog.querySelector('[data-prev]');
  const next = dialog.querySelector('[data-next]');
  let group = [];
  let current = 0;
  let origin = null;
  function show(index) {
    if (index < 0 || index >= group.length) return;
    current = index;
    const link = group[current];
    const thumbnail = link.querySelector('img');
    image.src = link.href;
    image.alt = thumbnail.alt;
    caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || thumbnail.alt;
    count.textContent = `${current + 1} / ${group.length}`;
    previous.disabled = current === 0;
    next.disabled = current === group.length - 1;
  }
  links.forEach(link => link.addEventListener('click', event => {
    // Preserve opening an image in another tab with modifier keys.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    origin = link;
    group = links.filter(item => item.dataset.gallery === link.dataset.gallery);
    show(group.indexOf(link));
    dialog.showModal();
    document.body.classList.add('image-open');
    dialog.querySelector('[data-close]').focus();
  }));
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('image-open');
    image.removeAttribute('src');
    origin?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });
})();
