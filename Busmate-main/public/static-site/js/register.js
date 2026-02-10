// Register Page JavaScript
class RegisterForm {
    constructor() {
        this.form = document.getElementById('register-form');
        if (!this.form) return;
        
        this.submitBtn = document.getElementById('submit-btn');
        this.loadingSpinner = document.getElementById('loading-spinner');
        
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        
        this.passwordMatchIcon = document.getElementById('password-match-icon');
        this.passwordError = document.getElementById('password-error');
        
        this.init();
    }

    init() {
        // Check if already logged in
        if (authService.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        // Form submit handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Password match validation
        this.confirmPasswordInput.addEventListener('input', () => this.checkPasswordMatch());
        this.passwordInput.addEventListener('input', () => this.checkPasswordMatch());

        // Input animations
        this.addInputAnimations();
    }

    checkPasswordMatch() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (!confirmPassword) {
            this.passwordMatchIcon.innerHTML = '';
            this.passwordError.classList.add('hidden');
            return;
        }

        if (password === confirmPassword) {
            this.passwordMatchIcon.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: oklch(0.65 0.20 145); position: absolute; right: 12px; top: 50%; transform: translateY(-50%);">
                    <path d="M20 6 9 17l-5-5"></path>
                </svg>
            `;
            this.passwordError.classList.add('hidden');
        } else {
            this.passwordMatchIcon.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: oklch(0.58 0.24 27); position: absolute; right: 12px; top: 50%; transform: translateY(-50%);">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
            `;
            this.passwordError.classList.remove('hidden');
        }
    }

    addInputAnimations() {
        const inputs = [this.nameInput, this.emailInput, this.passwordInput, this.confirmPasswordInput];
        
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
        
        const name = this.nameInput.value.trim();
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (!name || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        this.setLoading(true);

        // Simulate API call
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error?.includes('already exists')) {
                    toast.error('Email already registered. Please log in instead.');
                } else {
                    toast.error(data.error || 'Registration failed. Please try again.');
                }
                this.setLoading(false);
                return;
            }

            toast.success('Account created successfully!');
            
            // Redirect to login page with success message
            setTimeout(() => {
                window.location.href = 'login.html?registered=true';
            }, 1000);
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.querySelector('.btn-text').textContent = 'Creating account...';
            this.submitBtn.querySelector('.btn-icon').style.display = 'none';
            this.nameInput.disabled = true;
            this.emailInput.disabled = true;
            this.passwordInput.disabled = true;
            this.confirmPasswordInput.disabled = true;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.querySelector('.btn-text').textContent = 'Create Account';
            this.submitBtn.querySelector('.btn-icon').style.display = 'block';
            this.nameInput.disabled = false;
            this.emailInput.disabled = false;
            this.passwordInput.disabled = false;
            this.confirmPasswordInput.disabled = false;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RegisterForm();
});
