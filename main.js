// This JavaScript file can be used to add interactivity.
document.addEventListener("DOMContentLoaded", function() {
  // Determine current page for nav behavior
  const currentPage = window.location.pathname.split('/').pop();

  // Expand/collapse only when clicking the plus/minus area; clicking text navigates
  const mainCategories = document.querySelectorAll('.main-category');

  mainCategories.forEach(category => {
    category.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const toggleZoneWidth = 28; // px from the right side
      const clickedToggleZone = (rect.right - e.clientX) <= toggleZoneWidth;

      if (clickedToggleZone) {
        // Find adjacent project group; only toggle if it exists
        const parentLi = this.closest('li');
        const projectGroup = parentLi ? parentLi.nextElementSibling : null;
        if (projectGroup && projectGroup.classList.contains('project-group')) {
          e.preventDefault();
          this.classList.toggle('expanded');
          projectGroup.classList.toggle('expanded');
          return;
        }
        // No expandable group, fall through to normal navigation
      }

      // Outside toggle zone: allow default navigation to href
      // No preventDefault here; clicking text always navigates
    });
  });

  // Set default expanded state based on current page
  const expandForPage = (page) => {
    const category = document.querySelector(`a[href="${page}"]`);
    if (category) {
      category.classList.add('expanded');
      const parentLi = category.closest('li');
      const projectGroup = parentLi ? parentLi.nextElementSibling : null;
      if (projectGroup && projectGroup.classList.contains('project-group')) {
        projectGroup.classList.add('expanded');
      }
    }
  };

  if (currentPage === 'architecture.html') {
    expandForPage('architecture.html');
  } else if (currentPage === 'computation.html') {
    expandForPage('computation.html');
  } else if (currentPage === 'life.html') {
    expandForPage('life.html');
  }

  // Wire up inline project galleries (horizontal scroll with arrows)
  const galleries = document.querySelectorAll('.project-gallery');
  const galleryLightboxGroups = [];
  galleries.forEach(gal => {
    const track = gal.querySelector('.gallery-track');
    const prevBtn = gal.querySelector('.gallery-arrow.left');
    const nextBtn = gal.querySelector('.gallery-arrow.right');
    const galleryImages = Array.from(gal.querySelectorAll('.gallery-image'));

    if (galleryImages.length) {
      galleryLightboxGroups.push(galleryImages);
    }

    if (!track || !prevBtn || !nextBtn) return;

    const getStep = () => Math.max(240, Math.floor(track.clientWidth * 0.8));
    const isRTL = () => getComputedStyle(track).direction === 'rtl';

    prevBtn.addEventListener('click', () => {
      const step = getStep();
      const dir = isRTL() ? step : -step; // in RTL, prev moves content rightward visually
      track.scrollBy({ left: dir, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      const step = getStep();
      const dir = isRTL() ? -step : step; // in RTL, next moves content leftward visually
      track.scrollBy({ left: dir, behavior: 'smooth' });
    });
  });

  // Lightbox for project gallery images
  const openLightbox = (items, startIndex = 0) => {
    if (!items || !items.length) return;

    const resolveItem = (index) => {
      const clampedIndex = Math.min(Math.max(index, 0), items.length - 1);
      const el = items[clampedIndex];
      return {
        index: clampedIndex,
        element: el,
        src: el.dataset.full || el.src,
        alt: el.alt || ''
      };
    };

    const originFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const hasCarousel = items.length > 1;
    const initialItem = resolveItem(startIndex);
    let currentIndex = initialItem.index;
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const frame = document.createElement('div');
    frame.className = 'lightbox-frame';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close image');
    closeBtn.textContent = '×';

    const img = document.createElement('img');
    img.src = initialItem.src;
    img.alt = initialItem.alt;
    img.className = 'lightbox-image';
    img.draggable = false;

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'lightbox-media';
    mediaWrap.appendChild(img);

    frame.appendChild(closeBtn);
    frame.appendChild(mediaWrap);

    if (hasCarousel) {
      const hint = document.createElement('div');
      hint.className = 'lightbox-hint';
      hint.textContent = 'Use arrows to flip through images.';
      frame.appendChild(hint);
    }

    let prevNav = null;
    let nextNav = null;

    const updateNavState = () => {
      if (!prevNav || !nextNav) return;
      prevNav.disabled = currentIndex <= 0;
      nextNav.disabled = currentIndex >= items.length - 1;
    };

    const showItem = (targetIndex) => {
      const nextItem = resolveItem(targetIndex);
      if (nextItem.index === currentIndex) return;
      currentIndex = nextItem.index;
      img.src = nextItem.src;
      img.alt = nextItem.alt;
      updateNavState();
    };

    const handlePrev = () => {
      if (currentIndex <= 0) return;
      showItem(currentIndex - 1);
    };

    const handleNext = () => {
      if (currentIndex >= items.length - 1) return;
      showItem(currentIndex + 1);
    };

    if (hasCarousel) {
      prevNav = document.createElement('button');
      prevNav.type = 'button';
      prevNav.className = 'lightbox-nav prev';
      prevNav.setAttribute('aria-label', 'View previous image');
      prevNav.innerHTML = '&#10094;';
      prevNav.addEventListener('click', (evt) => {
        evt.stopPropagation();
        handlePrev();
      });

      nextNav = document.createElement('button');
      nextNav.type = 'button';
      nextNav.className = 'lightbox-nav next';
      nextNav.setAttribute('aria-label', 'View next image');
      nextNav.innerHTML = '&#10095;';
      nextNav.addEventListener('click', (evt) => {
        evt.stopPropagation();
        handleNext();
      });

      frame.appendChild(prevNav);
      frame.appendChild(nextNav);
    }

    updateNavState();
    overlay.appendChild(frame);
    document.body.appendChild(overlay);

    const tearDown = () => {
      document.removeEventListener('keydown', onKeyDown);
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.remove();
        if (originFocus && typeof originFocus.focus === 'function') {
          originFocus.focus({ preventScroll: true });
        }
      }, 220);
    };

    const onKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        tearDown();
        return;
      }
      if (hasCarousel) {
        if (evt.key === 'ArrowLeft') {
          evt.preventDefault();
          handlePrev();
        } else if (evt.key === 'ArrowRight') {
          evt.preventDefault();
          handleNext();
        }
      }
    };

    closeBtn.addEventListener('click', tearDown);
    overlay.addEventListener('click', (evt) => {
      if (evt.target === overlay) {
        tearDown();
      }
    });

    requestAnimationFrame(() => overlay.classList.add('open'));
    document.addEventListener('keydown', onKeyDown);
    closeBtn.focus({ preventScroll: true });
  };

  const wireLightboxTriggers = (images) => {
    if (!images || !images.length) return;

    images.forEach(imgEl => {
      if (imgEl.dataset.lightboxBound === '1') return;
      imgEl.dataset.lightboxBound = '1';

      if (!imgEl.hasAttribute('tabindex')) {
        imgEl.setAttribute('tabindex', '0');
      }

      const launchLightbox = () => {
        const startIndex = images.indexOf(imgEl);
        openLightbox(images, startIndex >= 0 ? startIndex : 0);
      };

      imgEl.addEventListener('click', () => {
        launchLightbox();
      });

      imgEl.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          launchLightbox();
        }
      });
    });
  };

  galleryLightboxGroups.forEach(group => wireLightboxTriggers(group));

  const standaloneImages = Array.from(document.querySelectorAll('.gallery-image')).filter(img => !img.closest('.project-gallery'));
  wireLightboxTriggers(standaloneImages);

  // Update "Latest" timestamp on home hero from document last modified
  const lastUpdatedEl = document.getElementById('last-updated');
  if (lastUpdatedEl) {
    try {
      const modified = new Date(document.lastModified);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formatted = modified.toLocaleDateString(undefined, options);
      lastUpdatedEl.textContent = `✨ Last updated on ${formatted}`;
    } catch (err) {
      console.warn('Unable to parse last modified date', err);
    }
  }

  // Index page: background thumbnails disabled for a cleaner hero
  if (currentPage === '' || currentPage === 'index.html') {
    const stage = document.getElementById('home-bg');
    if (stage) {
      stage.textContent = '';
    }
  }
});
