// This JavaScript file can be used to add interactivity.
document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded!");

    // Determine current page for nav behavior
    const currentPage = window.location.pathname.split('/').pop();

    // Expandable navigation functionality
    const mainCategories = document.querySelectorAll('.main-category');

    mainCategories.forEach(category => {
        category.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            const linkPage = href.split('/').pop().split('#')[0];

            // If clicking would navigate to a different page, allow navigation
            if (linkPage && linkPage !== '' && linkPage !== currentPage) {
                return; // do not prevent default; no toggle needed
            }

            // Same-page: prevent navigation and toggle expand
            e.preventDefault();

            // Toggle the expanded class on the main category
            this.classList.toggle('expanded');

            // The markup is <li><a.main-category></a></li><li.class="project-group">...</li>
            // So we need the parent <li> first, then its next sibling
            const parentLi = this.closest('li');
            const projectGroup = parentLi ? parentLi.nextElementSibling : null;
            if (projectGroup && projectGroup.classList.contains('project-group')) {
                projectGroup.classList.toggle('expanded');
            }
        });
    });

    // Set default expanded state based on current page
    if (currentPage === 'architecture.html') {
        const archCategory = document.querySelector('a[href="architecture.html"]');
        if (archCategory) {
            archCategory.classList.add('expanded');
            const parentLi = archCategory.closest('li');
            const projectGroup = parentLi ? parentLi.nextElementSibling : null;
            if (projectGroup && projectGroup.classList.contains('project-group')) {
                projectGroup.classList.add('expanded');
            }
        }
    } else if (currentPage === 'computation.html') {
        const compCategory = document.querySelector('a[href="computation.html"]');
        if (compCategory) {
            compCategory.classList.add('expanded');
            const parentLi = compCategory.closest('li');
            const projectGroup = parentLi ? parentLi.nextElementSibling : null;
            if (projectGroup && projectGroup.classList.contains('project-group')) {
                projectGroup.classList.add('expanded');
            }
        }
    } else if (currentPage === 'life.html') {
        const lifeCategory = document.querySelector('a[href="life.html"]');
        if (lifeCategory) {
            lifeCategory.classList.add('expanded');
            const parentLi = lifeCategory.closest('li');
            const projectGroup = parentLi ? parentLi.nextElementSibling : null;
            if (projectGroup && projectGroup.classList.contains('project-group')) {
                projectGroup.classList.add('expanded');
            }
        }
    }
});
