// Common JavaScript for All Pages

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('bearer_token');
    const session = sessionStorage.getItem('session');
    return !!(token || session);
}

// Get current user (mock implementation - replace with actual API call)
function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Get current plan (mock implementation)
function getCurrentPlan() {
    const plan = localStorage.getItem('current_plan');
    return plan || 'Free';
}

// Header Component
function renderHeader() {
    const isAuthenticated = checkAuth();
    const user = getCurrentUser();
    const plan = getCurrentPlan();

    const header = `
        <header class="header">
            <div class="header-container container">
                <a href="index.html" class="logo">Bus Mate</a>
                
                <nav class="nav">
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="vehicles.html">Vehicles</a></li>
                        <li><a href="booking.html">Book Ride</a></li>
                        <li><a href="tracking.html">Live Tracking</a></li>
                        <li><a href="pricing.html">Pricing</a></li>
                        <li><a href="index.html#contact">Contact</a></li>
                    </ul>
                </nav>

                <div class="header-actions">
                    ${isAuthenticated ? `
                        <a href="pricing.html" class="plan-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path>
                            </svg>
                            ${plan}
                        </a>
                        <div class="user-menu">
                            <button class="user-menu-trigger" id="user-menu-trigger">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>
                            <div class="user-menu-content" id="user-menu-content">
                                <div class="user-menu-header">
                                    <p>${user?.name || 'User'}</p>
                                    <p class="user-email">${user?.email || ''}</p>
                                </div>
                                <div class="user-menu-separator"></div>
                                <a href="pricing.html" class="user-menu-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                                        <line x1="2" x2="22" y1="10" y2="10"></line>
                                    </svg>
                                    Manage Plan
                                </a>
                                <a href="driver-dashboard.html" class="user-menu-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                    Driver Dashboard
                                </a>
                                <a href="tracking.html" class="user-menu-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    Track My Ride
                                </a>
                                <div class="user-menu-separator"></div>
                                <button onclick="handleSignOut()" class="user-menu-item danger">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" x2="9" y1="12" y2="12"></line>
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                        <a href="booking.html" class="btn btn-primary">Book Now</a>
                    ` : `
                        <a href="login.html" class="btn btn-outline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" x2="3" y1="12" y2="12"></line>
                            </svg>
                            Login
                        </a>
                        <a href="register.html" class="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <line x1="19" x2="19" y1="8" y2="14"></line>
                                <line x1="22" x2="16" y1="11" y2="11"></line>
                            </svg>
                            Sign Up
                        </a>
                    `}
                </div>

                <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="4" x2="20" y1="12" y2="12"></line>
                        <line x1="4" x2="20" y1="6" y2="6"></line>
                        <line x1="4" x2="20" y1="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="mobile-menu" id="mobile-menu">
                <nav class="mobile-nav">
                    <a href="index.html">Home</a>
                    <a href="vehicles.html">Vehicles</a>
                    <a href="booking.html">Book Ride</a>
                    <a href="tracking.html">Live Tracking</a>
                    <a href="pricing.html">Pricing</a>
                    <a href="index.html#contact">Contact</a>
                    ${isAuthenticated ? `
                        <div style="padding-top: 1rem; border-top: 1px solid var(--color-border); margin-top: 1rem;">
                            <p style="font-size: 0.75rem; color: var(--color-muted-foreground); margin-bottom: 0.25rem;">Signed in as</p>
                            <p style="font-size: 0.875rem; font-weight: 500;">${user?.name || 'User'}</p>
                            <p style="font-size: 0.75rem; color: var(--color-muted-foreground);">${user?.email || ''}</p>
                            <div style="margin-top: 0.5rem;">
                                <span class="plan-badge">${plan} Plan</span>
                            </div>
                        </div>
                        <a href="pricing.html" class="btn btn-outline" style="width: 100%; margin-top: 1rem;">Manage Plan</a>
                        <a href="driver-dashboard.html" class="btn btn-outline" style="width: 100%;">Driver Dashboard</a>
                        <a href="booking.html" class="btn btn-primary" style="width: 100%;">Book Now</a>
                        <button onclick="handleSignOut()" class="btn btn-outline" style="width: 100%; background: var(--color-destructive); border-color: var(--color-destructive); color: white;">Sign Out</button>
                    ` : `
                        <a href="login.html" class="btn btn-outline" style="width: 100%; margin-top: 1rem;">Login</a>
                        <a href="register.html" class="btn btn-primary" style="width: 100%;">Sign Up</a>
                    `}
                </nav>
            </div>
        </header>
    `;

    return header;
}

// Footer Component
function renderFooter() {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Contact Us</h3>
                        <div class="footer-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>ABESIT, Ghaziabad, India</span>
                        </div>
                        <div class="footer-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>+91 9789970218</span>
                        </div>
                        <div class="footer-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                            <span>info@busmate.com</span>
                        </div>
                        <div class="footer-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>Monday-Saturday: 9AM - 7PM</span>
                        </div>
                    </div>

                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="index.html#about">About Us</a></li>
                            <li><a href="vehicles.html">Available Vehicles</a></li>
                            <li><a href="booking.html">Book a Ride</a></li>
                            <li><a href="driver-dashboard.html">Driver Portal</a></li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h3>Our Services</h3>
                        <ul>
                            <li>Government Bus</li>
                            <li>Private Bus</li>
                            <li>Chartered Bus</li>
                            <li>E-Rickshaw</li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h3>Follow Us</h3>
                        <div class="social-links">
                            <a href="#" aria-label="Facebook">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect width="4" height="12" x="2" y="9"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>© ${new Date().getFullYear()} BusMate. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    `;
}

// Sign Out Handler
async function handleSignOut() {
    try {
        // Clear local storage
        localStorage.removeItem('bearer_token');
        localStorage.removeItem('current_user');
        localStorage.removeItem('current_plan');
        sessionStorage.removeItem('session');

        // Show success message
        if (typeof toast !== 'undefined') {
            toast.success('Signed out successfully');
        }

        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    } catch (error) {
        if (typeof toast !== 'undefined') {
            toast.error('Failed to sign out');
        }
    }
}

// Initialize header and footer
document.addEventListener('DOMContentLoaded', () => {
    // Render header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = renderHeader();
    }

    // Render footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = renderFooter();
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // User menu toggle
    const userMenuTrigger = document.getElementById('user-menu-trigger');
    const userMenuContent = document.getElementById('user-menu-content');
    if (userMenuTrigger && userMenuContent) {
        userMenuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenuContent.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuContent.contains(e.target) && e.target !== userMenuTrigger) {
                userMenuContent.classList.remove('active');
            }
        });
    }
});
