/**
 * SECURELIFE INSURANCE WEBSITE - MAIN JAVASCRIPT
 * ================================================
 * This file contains all the interactive functionality for the website including:
 * - Hero slideshow with autoplay, arrows, dots, and pause on hover
 * - Mobile navigation menu
 * - Smooth scrolling and active nav highlighting
 * - FAQ accordion
 * - Contact form validation and EmailJS integration
 * - Scroll animations using IntersectionObserver
 * - Sticky header on scroll
 */

// ==========================================
// DOCUMENT READY
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initHeroSlideshow();
    initMobileMenu();
    initSmoothScrolling();
    initFAQ();
    initContactForm();
    initScrollAnimations();
    initStickyHeader();
    initActiveNavigation();
});

// ==========================================
// HERO SLIDESHOW
// ==========================================

function initHeroSlideshow() {
    const slideshow = document.querySelector('.hero-slideshow');
    if (!slideshow) return;

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-arrow-prev');
    const nextBtn = document.querySelector('.hero-arrow-next');

    let currentSlide = 0;
    let autoplayInterval;
    let isAutoplayPaused = false;

    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Wrap around if index is out of bounds
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start autoplay
    function startAutoplay() {
        if (!isAutoplayPaused) {
            autoplayInterval = setInterval(nextSlide, 5000);
        }
    }

    // Stop autoplay
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Event listeners for arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 1000);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 1000);
        });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopAutoplay();
            setTimeout(startAutoplay, 1000);
        });
    });

    // Pause autoplay on hover
    slideshow.addEventListener('mouseenter', function() {
        isAutoplayPaused = true;
        stopAutoplay();
    });

    slideshow.addEventListener('mouseleave', function() {
        isAutoplayPaused = false;
        startAutoplay();
    });

    // Start autoplay on page load
    startAutoplay();

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 1000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 1000);
        }
    });
}

// ==========================================
// MOBILE MENU
// ==========================================

function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ==========================================

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Call on load
}

// ==========================================
// FAQ ACCORDION
// ==========================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ==========================================
// CONTACT FORM VALIDATION & SUBMISSION
// ==========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // EmailJS configuration check
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

    const isEmailJSConfigured =
        EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
        EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
        EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

    // Show configuration warning if EmailJS is not set up
    if (!isEmailJSConfigured) {
        console.warn('EmailJS is not configured. Please update the credentials in main.js to enable email sending.');
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const insuranceType = document.getElementById('insurance-type').value;
        const message = document.getElementById('message').value.trim();

        // Validate form
        let isValid = true;

        if (name === '' || name.length < 2) {
            showError('name', 'Please enter your full name');
            isValid = false;
        }

        if (email === '' || !isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (phone !== '' && !isValidPhone(phone)) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        if (message === '' || message.length < 10) {
            showError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }

        if (!isValid) return;

        // If EmailJS is configured, send email
        if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
            sendEmail({
                name,
                email,
                phone,
                insurance_type: insuranceType,
                message
            });
        } else {
            // Show success message even without EmailJS (for demo purposes)
            showSuccessMessage();
            console.log('Form submitted with data:', { name, email, phone, insuranceType, message });
        }
    });

    // Send email using EmailJS
    function sendEmail(formData) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData, EMAILJS_PUBLIC_KEY)
            .then(function(response) {
                console.log('Email sent successfully!', response);
                showSuccessMessage();
            })
            .catch(function(error) {
                console.error('Failed to send email:', error);
                alert('Sorry, there was an error sending your message. Please try again later or contact us directly.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    }

    // Show success message and hide form
    function showSuccessMessage() {
        const formContainer = document.getElementById('contactFormContainer');
        const successMessage = document.getElementById('successMessage');

        formContainer.style.display = 'none';
        successMessage.style.display = 'block';

        // Reset form
        form.reset();

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Send another message button
    const sendAnotherBtn = document.getElementById('sendAnotherBtn');
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', function() {
            const formContainer = document.getElementById('contactFormContainer');
            const successMessage = document.getElementById('successMessage');

            successMessage.style.display = 'none';
            formContainer.style.display = 'block';

            // Scroll to form
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Validation helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const errorFields = document.querySelectorAll('.error');

        errorMessages.forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });

        errorFields.forEach(field => {
            field.classList.remove('error');
        });
    }

    // Real-time validation on input
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ==========================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optional: stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
    }
}

// ==========================================
// STICKY HEADER ON SCROLL
// ==========================================

function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance optimization
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// EMAILJS INITIALIZATION (Optional)
// ==========================================

/**
 * To use EmailJS for sending emails from the contact form:
 *
 * 1. Sign up for a free account at https://www.emailjs.com/
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with these variables:
 *    - {{name}}
 *    - {{email}}
 *    - {{phone}}
 *    - {{insurance_type}}
 *    - {{message}}
 * 4. Get your Service ID, Template ID, and Public Key
 * 5. Replace the placeholders above in the EMAILJS_* constants
 * 6. Add this script to your HTML (before main.js):
 *    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
 * 7. Initialize EmailJS by adding this to your HTML:
 *    <script>
 *        (function(){
 *            emailjs.init('YOUR_PUBLIC_KEY');
 *        })();
 *    </script>
 */

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c SecureLife Insurance ', 'background: #0066FF; color: #fff; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('Website loaded successfully! All interactive features are ready.');
