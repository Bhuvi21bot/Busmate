// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after clicking
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// Chat Widget
const chatButton = document.getElementById('chatButton');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

// Toggle chat widget
chatButton.addEventListener('click', () => {
    chatWidget.classList.add('active');
    chatButton.style.display = 'none';
    chatInput.focus();
});

chatClose.addEventListener('click', () => {
    chatWidget.classList.remove('active');
    chatButton.style.display = 'flex';
});

// Send message
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Simulate bot response
    setTimeout(() => {
        const response = generateBotResponse(message.toLowerCase());
        addMessage(response, 'bot');
    }, 500);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(message) {
    const responses = {
        'hello': 'Hello! How can I assist you today with your travel needs?',
        'hi': 'Hi there! What can I help you with?',
        'fare': 'Our fares vary by route and vehicle type. Government buses start from ₹10, private buses from ₹20, and e-rickshaws from ₹5. Would you like to know a specific route?',
        'book': 'You can book a ride by visiting our Vehicles page and selecting your preferred bus. Would you like me to guide you?',
        'route': 'We cover extensive routes across the city. Which area are you traveling to?',
        'schedule': 'Buses run from 6 AM to 10 PM daily. Private buses have more flexible schedules. Which route are you interested in?',
        'driver': 'To become a driver, please visit our Driver Dashboard and complete the registration form with your documents.',
        'track': 'You can track your bus in real-time from our Tracking page. Do you need help with that?',
        'payment': 'We accept cash, cards, UPI, and wallet payments. Online booking offers additional discounts!',
        'cancel': 'Cancellations are free up to 2 hours before departure. After that, a 20% fee applies.',
        'refund': 'Refunds are processed within 5-7 business days to your original payment method.',
        'support': 'For support, you can call us at +91 123 456 7890 or email info@busmate.com',
        'government': 'Government buses are affordable and reliable with fixed schedules. They start from ₹10 per ride.',
        'private': 'Private buses offer more comfort and flexibility with better amenities. They start from ₹20.',
        'rickshaw': 'E-rickshaws are perfect for short distances! They\'re eco-friendly and start from just ₹5.',
        'chartered': 'Chartered buses are great for groups and events with flexible scheduling. Contact us for custom quotes!',
        'default': 'I\'m here to help! You can ask me about fares, routes, booking, schedules, or becoming a driver. What would you like to know?'
    };

    for (const [key, value] of Object.entries(responses)) {
        if (message.includes(key)) {
            return value;
        }
    }

    return responses.default;
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all fade-in-up elements
document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Hover effect for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(13, 13, 13, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(13, 13, 13, 0.8)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Animate stat numbers on scroll
function animateNumber(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const valueElement = entry.target.querySelector('.stat-value');
            const value = valueElement.textContent;
            const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
            
            valueElement.dataset.suffix = value.replace(/[0-9]/g, '');
            animateNumber(valueElement, numericValue);
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
    }
    
    if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Console welcome message
console.log('%cWelcome to Bus Mate! 🚌', 'color: #008870; font-size: 24px; font-weight: bold;');
console.log('%cYour smart travel companion', 'color: #666; font-size: 14px;');
