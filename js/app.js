/**
 * Guruji VPN - Main Application Controller
 * Coordinates component lifecycle, routing, and global listeners
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Toast System
    Toast.init();

    // 2. Initialize Core UI Components
    Navbar.init();
    Hero.init();
    Pricing.init();
    HowItWorks.init();
    Features.init();
    Docs.init();
    Dashboard.init();
    Footer.init();

    // 3. Initialize Modals
    AuthModal.init();
    CheckoutModal.init();

    // 4. Handle smooth scrolling and active hash highlights
    setupNavigationHighlighting();

    console.log('🚀 Guruji VPN application initialized successfully.');
});

function setupNavigationHighlighting() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.desktop-nav a, nav a.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                if (targetId === currentSectionId) {
                    link.classList.add('text-emerald-400', 'font-semibold');
                    link.classList.remove('text-slate-300', 'text-slate-700');
                    const indicator = link.querySelector('.nav-indicator');
                    if (indicator) indicator.style.display = 'block';
                } else {
                    link.classList.remove('text-emerald-400', 'font-semibold');
                    link.classList.add('text-slate-300');
                    const indicator = link.querySelector('.nav-indicator');
                    if (indicator) indicator.style.display = 'none';
                }
            }
        });
    });
}
