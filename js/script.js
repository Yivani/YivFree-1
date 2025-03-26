/**
 * Minimalist Website JavaScript
 * Handles navigation, animations, and form functionality
 */

// DOM Elements
const nav = document.querySelector('nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const animatedElements = document.querySelectorAll('.feature-item, .service-card, .team-member');

/**
 * Utility Functions
 */
// Debounce function for performance optimization
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Navigation Functions
 */
function setupNavigation() {
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', closeMobileMenuOnClickOutside);

    // Navbar scroll effect
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));

    // Smooth scrolling for anchor links
    setupSmoothScrolling();
}

function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    // Toggle aria-expanded for accessibility
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);

    // Toggle body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenuOnClickOutside(e) {
    if (navLinks &&
        navLinks.classList.contains('active') &&
        !e.target.closest('.nav-links') &&
        !e.target.closest('.menu-toggle')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

function handleNavbarScroll() {
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }

                // Smooth scroll to target
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form Handling
 */
function setupContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        setupFormValidation();
    }
}

function setupFormValidation() {
    const inputs = contactForm.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        // Add validation styling on blur
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
            }
        });

        // Real-time validation feedback
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('invalid');
            }
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Simple validation check
    const inputs = contactForm.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.classList.add('invalid');
            isValid = false;
        } else {
            input.classList.remove('invalid');
        }
    });

    if (!isValid) {
        return;
    }

    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Add loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate form submission (replace with actual AJAX request)
    setTimeout(() => {
        console.log(formData);

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your message! We will get back to you soon.';

        contactForm.innerHTML = '';
        contactForm.appendChild(successMessage);
    }, 1500);
}

/**
 * Animation Functions
 */
function setupAnimations() {
    // Set intersection observer for scroll animations
    setupScrollAnimations();

    // Add animation classes for initial page load elements
    addPageLoadAnimations();
}

function setupScrollAnimations() {
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, options);

    // Observe all animated elements
    animatedElements.forEach(element => {
        element.classList.add('will-animate');
        observer.observe(element);
    });
}

function addPageLoadAnimations() {
    // Add staggered animations to specific sections on page load
    const pageLoadElements = document.querySelectorAll('.fade-in, .fade-in-up');

    pageLoadElements.forEach(element => {
        element.style.visibility = 'visible';
    });
}

/**
 * Image Lazy Loading
 */
function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('lazyloaded');
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.add('lazyloaded');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        const lazyImages = document.querySelectorAll('.lazyload');
        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    }
}

/**
 * Performance Optimizations
 */
function setupPerformanceOptimizations() {
    // Add passive event listeners where appropriate
    const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'wheel'];
    passiveEvents.forEach(event => {
        window.addEventListener(event, null, { passive: true });
    });

    // Optimize animations for GPU
    const animatedItems = document.querySelectorAll('.feature-item, .service-card, .team-member');
    animatedItems.forEach(item => {
        item.classList.add('will-change-transform');
    });
}

/**
 * Initialize all functionality on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupContactForm();
    setupAnimations();
    setupLazyLoading();
    setupPerformanceOptimizations();

    // Add accessibility attributes
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
});
