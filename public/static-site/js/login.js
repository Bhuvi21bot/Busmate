// Toast Notification System
class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
    }

    show(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' 
            ? '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
            : '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>';
        
        toast.innerHTML = `
            ${icon}
            <span class="toast-message">${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }
}

// Initialize Toast Manager
const toast = new ToastManager();

// Auth Service
class AuthService {
    constructor() {
        this.baseUrl = '/api'; // Change this to your actual API base URL
    }

    async login(email, password, rememberMe) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    rememberMe
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            return { data, error: null };
        } catch (error) {
            return { data: null, error: { code: error.message } };
        }
    }

    isLoggedIn() {
        return !!localStorage.getItem('bearer_token') || !!sessionStorage.getItem('session');
    }

    getRedirectUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('redirect') || '/';
    }

    saveSession(token, rememberMe) {
        if (rememberMe) {
            localStorage.setItem('bearer_token', token);
        }
        sessionStorage.setItem('session', JSON.stringify({ timestamp: Date.now() }));
    }
}

// Initialize Auth Service
const authService = new AuthService();

// Form Handler
class LoginForm {
    constructor() {
        this.form = document.getElementById('login-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.loadingSpinner = document.getElementById('loading-spinner');
        
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('remember');
        
        this.init();
    }

    init() {
        // Check if already logged in
        if (authService.isLoggedIn()) {
            this.redirect();
            return;
        }

        // Check for registration success message
        const params = new URLSearchParams(window.location.search);
        if (params.get('registered') === 'true') {
            toast.success('Account created successfully! Please log in.');
        }

        // Form submit handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input animations
        this.addInputAnimations();
    }

    addInputAnimations() {
        const inputs = [this.emailInput, this.passwordInput];
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.01)';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberCheckbox.checked;

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        this.setLoading(true);

        // Simulate API call (replace with actual API)
        const { data, error } = await authService.login(email, password, rememberMe);

        if (error) {
            toast.error('Invalid email or password. Please make sure you have already registered an account and try again.');
            this.setLoading(false);
            return;
        }

        // Save session
        if (data?.token) {
            authService.saveSession(data.token, rememberMe);
        }

        toast.success('Login successful!');
        
        // Redirect after short delay
        setTimeout(() => {
            this.redirect();
        }, 1000);
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.querySelector('.btn-text').textContent = 'Signing in...';
            this.submitBtn.querySelector('.btn-icon').style.display = 'none';
            this.emailInput.disabled = true;
            this.passwordInput.disabled = true;
            this.rememberCheckbox.disabled = true;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.querySelector('.btn-text').textContent = 'Sign In';
            this.submitBtn.querySelector('.btn-icon').style.display = 'block';
            this.emailInput.disabled = false;
            this.passwordInput.disabled = false;
            this.rememberCheckbox.disabled = false;
        }
    }

    redirect() {
        const redirectUrl = authService.getRedirectUrl();
        window.location.href = redirectUrl;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});

// Handle visibility change for animations
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Restart animations when page becomes visible
        const card = document.querySelector('.login-card');
        if (card) {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = '';
            }, 10);
        }
    }
});