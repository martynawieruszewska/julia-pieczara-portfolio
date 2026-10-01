document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".portfolio-side-nav__link");
    const sideNav = document.querySelector(".portfolio-side-nav");
    const hero = document.querySelector(".portfolio-hero");

    if (!links.length) {
        return;
    }

    const sections = [...links]
        .map(link => document.getElementById(link.dataset.section))
        .filter(Boolean);

    function updateActiveSection() {

        if (sideNav && hero) {
            const heroBottom = hero.getBoundingClientRect().bottom;
        
            sideNav.classList.toggle(
                "is-visible",
                heroBottom <= window.innerHeight * 0.5
            );
        }

        const viewportPoint = window.innerHeight * 0.5;

        let activeSection = null;

        sections.forEach(section => {

            const rect = section.getBoundingClientRect();

            if (
                rect.top <= viewportPoint &&
                rect.bottom >= viewportPoint
            ) {
                activeSection = section.id;
            }

        });

        links.forEach(link => {

            link.classList.toggle(
                "portfolio-side-nav__link--active",
                link.dataset.section === activeSection
            );

        });
    }

    window.addEventListener("scroll", updateActiveSection, {
        passive: true
    });

    window.addEventListener("resize", updateActiveSection);

    updateActiveSection();

});