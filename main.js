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

  // Index page: randomly place background thumbnails, allow overlap
  if (currentPage === '' || currentPage === 'index.html') {
    const stage = document.getElementById('home-bg');
    if (stage) {
      const images = [
        'assets/thumb_nails/a/1_casita_city.jpg',
        'assets/thumb_nails/c/5_terra_tower.jpg',
        'assets/thumb_nails/a/4_between_mounds.jpg',
        'assets/thumb_nails/a/5_lpc_headquarter.jpg',
        'assets/thumb_nails/a/6_recycle_sphere.jpg',
        'assets/thumb_nails/a/7_new_york_archive.jpg',
        'assets/thumb_nails/a/8_art_center.jpg',
        'assets/thumb_nails/a/9_pavillian.jpg',
        'assets/thumb_nails/c/1_when_text_meets_map.jpg',
        'assets/thumb_nails/c/2_memory_tides.jpg',
        'assets/thumb_nails/c/3_bento.jpg',
        'assets/thumb_nails/c/4_all_data_are_spatial.jpg',
        'assets/thumb_nails/c/6_information_power.jpg',
        'assets/thumb_nails/c/7_city_glitch.jpg',
        'assets/thumb_nails/c/8_seeing_with_algorithm.jpg',
        'assets/thumb_nails/p/2_photography.jpg',
        'assets/thumb_nails/p/3_jelwery.jpg',
      ];

      const rand = (min, max) => Math.random() * (max - min) + min;
      const pick = arr => arr[Math.floor(Math.random() * arr.length)];
      const inUse = new Set(); // ensure no duplicate image appears at once

      const spawn = () => {
        const el = document.createElement('div');
        el.className = 'bg-thumb';
        // choose an image not currently in use
        const candidates = images.filter(src => !inUse.has(src));
        if (candidates.length === 0) {
          // all images are on screen; skip this spawn
          return;
        }
        const src = pick(candidates);
        inUse.add(src);
        el.dataset.src = src;
        el.style.backgroundImage = `url(${src})`;

        const vw = stage.clientWidth;
        const vh = stage.clientHeight;
        const size = rand(180, 340); // px

        // Define a safe zone around the main heading/buttons to avoid overlap
        const container = document.querySelector('.container');
        const stageRect = stage.getBoundingClientRect();
        const contRect = container ? container.getBoundingClientRect() : null;
        const margin = 120; // extra clearance from content

        // Build candidate bands around the safe rect
        let bands = [];
        if (contRect) {
          const safeLeft = Math.max(0, contRect.left - stageRect.left - margin);
          const safeTop = Math.max(0, contRect.top - stageRect.top - margin);
          const safeRight = Math.min(vw, contRect.right - stageRect.left + margin);
          const safeBottom = Math.min(vh, contRect.bottom - stageRect.top + margin);

          // Top band
          bands.push({ x0: 0, y0: 0, x1: vw, y1: safeTop });
          // Bottom band
          bands.push({ x0: 0, y0: safeBottom, x1: vw, y1: vh });
          // Left band (aligned with content vertically)
          bands.push({ x0: 0, y0: safeTop, x1: safeLeft, y1: safeBottom });
          // Right band
          bands.push({ x0: safeRight, y0: safeTop, x1: vw, y1: safeBottom });
        } else {
          bands.push({ x0: 0, y0: 0, x1: vw, y1: vh });
        }

        // Filter to valid bands and weight by area for selection
        bands = bands
          .map(b => ({ ...b, w: Math.max(0, b.x1 - b.x0), h: Math.max(0, b.y1 - b.y0) }))
          .filter(b => b.w > 30 && b.h > 30);

        let band;
        if (bands.length) {
          const totalArea = bands.reduce((sum, b) => sum + b.w * b.h, 0);
          let r = Math.random() * totalArea;
          for (const b of bands) {
            r -= b.w * b.h;
            if (r <= 0) { band = b; break; }
          }
          if (!band) band = bands[0];
        } else {
          band = { x0: 0, y0: 0, x1: vw, y1: vh, w: vw, h: vh };
        }

        // Choose a position inside band while avoiding overlaps with existing thumbs
        const existing = Array.from(stage.querySelectorAll('.bg-thumb')).map(node => {
          const r = node.getBoundingClientRect();
          return {
            cx: (r.left + r.right) / 2 - stageRect.left,
            cy: (r.top + r.bottom) / 2 - stageRect.top,
            w: r.width,
            h: r.height
          };
        });

        const gap = 52; // desired spacing between thumbs
        const noOverlap = (x, y, w, h) => {
          for (const r of existing) {
            const leftA = x - w / 2 - gap;
            const rightA = x + w / 2 + gap;
            const topA = y - h / 2 - gap;
            const bottomA = y + h / 2 + gap;
            const leftB = r.cx - r.w / 2;
            const rightB = r.cx + r.w / 2;
            const topB = r.cy - r.h / 2;
            const bottomB = r.cy + r.h / 2;
            if (!(rightA < leftB || leftA > rightB || bottomA < topB || topA > bottomB)) {
              return false; // overlaps
            }
          }
          return true;
        };

        let x, y;
        const attempts = 18;
        for (let i = 0; i < attempts; i++) {
          const candX = rand(band.x0 + size * 0.6, band.x1 - size * 0.6);
          const candY = rand(band.y0 + size * 0.6, band.y1 - size * 0.6);
          const cx = Math.max(size * 0.6, Math.min(vw - size * 0.6, candX));
          const cy = Math.max(size * 0.6, Math.min(vh - size * 0.6, candY));
          if (noOverlap(cx, cy, size, size * 0.66)) {
            x = cx; y = cy; break;
          }
          if (i === attempts - 1) { x = cx; y = cy; } // fallback
        }

        // No tilt for home thumbnails on index page
        const rot = '0deg';

        el.style.width = `${size}px`;
        el.style.height = `${size * 0.66}px`;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.setProperty('--rot', rot);
        el.style.zIndex = String(Math.floor(rand(1, 99)));

        stage.appendChild(el);

        // Optionally fade out and remove after a while, then respawn
        setTimeout(() => {
          el.style.transition = 'opacity 1.2s ease';
          el.style.opacity = '0';
          setTimeout(() => {
            // free the image for future use
            if (el.dataset && el.dataset.src) {
              inUse.delete(el.dataset.src);
            }
            el.remove();
          }, 1200);
        }, 10000 + Math.random() * 5000);
      };

      // Initial burst
      const initial = 8;
      for (let i = 0; i < initial; i++) {
        setTimeout(spawn, i * 220);
      }
      // Ongoing trickle
      setInterval(spawn, 2200);
    }
  }
});
