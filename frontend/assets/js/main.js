// Navbar scroll effects + mobile menu handling
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Add 'scrolled' class when user scrolls down
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // Execute once on load (handles page refresh at mid-scroll position)
    handleScroll();
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Smooth scrolling for anchor links (href="#xxx")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle (activates if .nav-toggle is added in future)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
});

// Homepage hero: "Learn More" button reveals video
document.addEventListener('DOMContentLoaded', function () {
    const learnMoreBtn = document.getElementById('learn-more-btn');
    const heroSection = document.querySelector('.hero-fullscreen');

    if (learnMoreBtn && heroSection) {
        learnMoreBtn.addEventListener('click', function () {
            heroSection.classList.add('show-video');
        });
    }
});

// Services page: service-hero card "Learn More" functionality
// 1. Click triggers "Opening video…" state and opens YouTube in new tab
// 2. Auto-revert to original state after 5 seconds maximum
document.addEventListener('DOMContentLoaded', function () {
    const serviceHeroes = document.querySelectorAll('.service-hero');

    if (!serviceHeroes.length) return;

    serviceHeroes.forEach(hero => {
        const btn = hero.querySelector('.service-learn-more');
        if (!btn) return;

        const videoUrl = btn.getAttribute('data-video-url');

        btn.addEventListener('click', function () {
            if (!videoUrl) return;

            // Switch to "video page" state (background slides away, shows "Opening video…")
            hero.classList.add('show-video');

            // Open YouTube in new tab after 0.8s (matches CSS animation timing)
            setTimeout(() => {
                window.open(videoUrl, '_blank');
            }, 800);

            // Clear any existing reset timer to avoid duplicates
            if (hero._resetTimer) {
                clearTimeout(hero._resetTimer);
            }

            // Auto-revert to original state after 5 seconds
            hero._resetTimer = setTimeout(() => {
                hero.classList.remove('show-video');
            }, 5000);
        });
    });
});

// Contact form validation and submission handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission/page refresh

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    // Basic validation check
    if (!fullName || !email || !phone || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    // TODO: Add backend API call here in production
    console.log('Form data ready to send:', { fullName, email, phone, message });
    alert('This is a demo. In production this will send your enquiry.');
  });
});