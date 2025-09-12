// This JavaScript file can be used to add interactivity.
document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded!");
    
    // Expandable navigation functionality
    const mainCategories = document.querySelectorAll('.main-category');
    
    mainCategories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle the expanded class on the main category
            this.classList.toggle('expanded');
            
            // Find the next project group and toggle it
            const projectGroup = this.nextElementSibling;
            if (projectGroup && projectGroup.classList.contains('project-group')) {
                projectGroup.classList.toggle('expanded');
            }
        });
    });
    
    // Set default expanded state based on current page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'architecture.html') {
        const archCategory = document.querySelector('a[href="architecture.html"]');
        if (archCategory) {
            archCategory.classList.add('expanded');
            const projectGroup = archCategory.nextElementSibling;
            if (projectGroup && projectGroup.classList.contains('project-group')) {
                projectGroup.classList.add('expanded');
            }
        }
    } else if (currentPage === 'computation.html') {
        const compCategory = document.querySelector('a[href="computation.html"]');
        if (compCategory) {
            compCategory.classList.add('expanded');
            const projectGroup = compCategory.nextElementSibling;
            if (projectGroup && projectGroup.classList.contains('project-group')) {
                projectGroup.classList.add('expanded');
            }
        }
    } else if (currentPage === 'life.html') {
        const lifeCategory = document.querySelector('a[href="life.html"]');
        if (lifeCategory) {
            lifeCategory.classList.add('expanded');
            const projectGroup = lifeCategory.nextElementSibling;
            if (projectGroup && projectGroup.classList.contains('project-group')) {
                projectGroup.classList.add('expanded');
            }
        }
    }
});