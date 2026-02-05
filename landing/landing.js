// ============================================
// Navigation Functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // Animated Counter for Stats
    // ============================================

    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K+';
        }
        return num.toLocaleString();
    }

    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const target = parseInt(statNumber.getAttribute('data-target'));
                if (!statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber, target);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });

    // ============================================
    // Scroll Animations (Fade In on Scroll)
    // ============================================

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Apply fade animation to property cards
    document.querySelectorAll('.property-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(card);
    });

    // Apply fade animation to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(card);
    });

    // Apply fade animation to testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(card);
    });

    // ============================================
    // Analytics Chart (Simple Canvas Chart)
    // ============================================

    const chartCanvas = document.getElementById('analyticsChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        const chartWidth = chartCanvas.parentElement.clientWidth;
        const chartHeight = chartCanvas.parentElement.clientHeight;
        chartCanvas.width = chartWidth;
        chartCanvas.height = chartHeight;

        // Chart data
        const data = [
            { month: 'Jan', value: 65 },
            { month: 'Feb', value: 78 },
            { month: 'Mar', value: 85 },
            { month: 'Apr', value: 92 },
            { month: 'May', value: 88 },
            { month: 'Jun', value: 95 },
            { month: 'Jul', value: 100 }
        ];

        const padding = 40;
        const chartAreaWidth = chartWidth - padding * 2;
        const chartAreaHeight = chartHeight - padding * 2;
        const maxValue = 100;
        const pointSpacing = chartAreaWidth / (data.length - 1);

        // Draw grid
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartAreaHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(chartWidth - padding, y);
            ctx.stroke();
        }

        // Draw line chart
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + pointSpacing * index;
            const y = padding + chartAreaHeight - (point.value / maxValue) * chartAreaHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, padding, 0, chartHeight - padding);
        gradient.addColorStop(0, 'rgba(74, 144, 226, 0.3)');
        gradient.addColorStop(1, 'rgba(74, 144, 226, 0)');
        ctx.fillStyle = gradient;
        
        ctx.lineTo(chartWidth - padding, chartHeight - padding);
        ctx.lineTo(padding, chartHeight - padding);
        ctx.closePath();
        ctx.fill();

        // Draw points
        data.forEach((point, index) => {
            const x = padding + pointSpacing * index;
            const y = padding + chartAreaHeight - (point.value / maxValue) * chartAreaHeight;
            
            // Outer circle
            ctx.fillStyle = '#4A90E2';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner circle
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Month labels
            ctx.fillStyle = '#666666';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(point.month, x, chartHeight - padding + 20);
        });
    }

    // ============================================
    // Parallax Effect for Hero Section
    // ============================================

    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });
    }

    // ============================================
    // Active Navigation Link Highlighting
    // ============================================

    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Add active class styling via CSS
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--primary-color) !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // Form Validation (if any forms are added)
    // ============================================

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form validation logic here if needed
        });
    });

    // ============================================
    // Lazy Loading for Images (if any are added)
    // ============================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Performance: Debounce scroll events
    // ============================================

    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll handlers
    window.addEventListener('scroll', debounce(() => {
        handleScroll();
        highlightNavLink();
    }, 10));

    // ============================================
    // Console Welcome Message
    // ============================================

    console.log('%c60 Yard', 'font-size: 24px; font-weight: bold; color: #FF7A45;');
    console.log('%cWelcome to 60 Yard - Your trusted real estate partner!', 'font-size: 14px; color: #666;');

    // ============================================
    // Accessibility: Keyboard Navigation
    // ============================================

    // Ensure all interactive elements are keyboard accessible
    document.addEventListener('keydown', function(e) {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.focus();
        }
    });

    // ============================================
    // Smooth Scroll Polyfill for older browsers
    // ============================================

    if (!CSS.supports('scroll-behavior', 'smooth')) {
        const smoothScrollPolyfill = document.createElement('script');
        smoothScrollPolyfill.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15/dist/smooth-scroll.polyfills.min.js';
        document.head.appendChild(smoothScrollPolyfill);
    }

    // ============================================
    // Analytics Tracking (placeholder)
    // ============================================

    // Track page views (implement with your analytics service)
    function trackPageView() {
        // Example: Google Analytics, Mixpanel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: window.location.pathname
            });
        }
    }

    trackPageView();

    // Track button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            // Track button click event
            console.log('Button clicked:', buttonText);
            // Add your analytics tracking here
        });
    });

    // ============================================
    // Property Search Tabs
    // ============================================

    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchForm = document.querySelector('.search-form');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const tabType = this.getAttribute('data-tab');
            console.log('Search type changed to:', tabType);
            // Update search form based on tab selection if needed
        });
    });

    // ============================================
    // Property Search Form Submission
    // ============================================

    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = searchInput ? searchInput.value : '';
            const activeTab = document.querySelector('.tab-btn.active');
            const searchType = activeTab ? activeTab.getAttribute('data-tab') : 'buy';
            
            console.log('Search initiated:', {
                type: searchType,
                term: searchTerm
            });
            
            // Add search functionality here
            // This could redirect to a search results page or filter properties
        });
    }

    // ============================================
    // Contact Form Submission
    // ============================================

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            console.log('Contact form submitted:', data);
            
            // Add form submission logic here
            // This could send data to an API endpoint
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // ============================================
    // Property Card Interactions
    // ============================================

    document.querySelectorAll('.property-btn').forEach(button => {
        button.addEventListener('click', function() {
            const propertyCard = this.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('.property-title').textContent;
            
            console.log('Property viewed:', propertyTitle);
            
            // Add property view functionality here
            // This could open a property detail modal or navigate to property page
        });
    });
});

// ============================================
// Utility Functions
// ============================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other scripts if needed
window.LandingPageUtils = {
    isInViewport,
    throttle
};
