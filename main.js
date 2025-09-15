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
  galleries.forEach(gal => {
    const track = gal.querySelector('.gallery-track');
    const prevBtn = gal.querySelector('.gallery-arrow.left');
    const nextBtn = gal.querySelector('.gallery-arrow.right');
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
});
