// Toast Notification Function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set message
    toastMessage.textContent = message;
    
    // Remove existing type classes
    toast.classList.remove('success', 'error');
    
    // Add new type class
    toast.classList.add(type);
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle Login Form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        // Basic validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        btnText.textContent = 'Signing in...';
        
        // Simulate API call (replace with your actual API endpoint)
        try {
            // Example: const response = await fetch('/api/auth/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password, rememberMe })
            // });
            
            // Simulated delay for demo
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo purposes - show success
            showToast('Login successful!', 'success');
            
            // Redirect to home page after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            showToast('Login failed. Please try again.', 'error');
            submitBtn.disabled = false;
            btnText.textContent = originalText;
        }
    });
}

// Handle Register Form
const registerForm = document.getElementById('register-form');
if (registerForm) {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('password-error');
    const passwordMatchIcon = document.getElementById('password-match-icon');
    
    // Password match validation
    function checkPasswordMatch() {
        if (confirmPassword.value) {
            if (password.value === confirmPassword.value) {
                passwordError.style.display = 'none';
                passwordMatchIcon.style.display = 'block';
                passwordMatchIcon.style.stroke = '#22c55e';
                confirmPassword.parentElement.style.borderColor = '';
            } else {
                passwordError.style.display = 'block';
                passwordMatchIcon.style.display = 'block';
                passwordMatchIcon.style.stroke = '#ef4444';
                confirmPassword.parentElement.style.borderColor = '#ef4444';
            }
        } else {
            passwordError.style.display = 'none';
            passwordMatchIcon.style.display = 'none';
            confirmPassword.parentElement.style.borderColor = '';
        }
    }
    
    if (password && confirmPassword) {
        password.addEventListener('input', checkPasswordMatch);
        confirmPassword.addEventListener('input', checkPasswordMatch);
    }
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;
        
        // Validation
        if (!name || !email || !passwordValue || !confirmPasswordValue) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (passwordValue !== confirmPasswordValue) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (passwordValue.length < 8) {
            showToast('Password must be at least 8 characters long', 'error');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        btnText.textContent = 'Creating account...';
        
        // Simulate API call (replace with your actual API endpoint)
        try {
            // Example: const response = await fetch('/api/auth/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, password: passwordValue })
            // });
            
            // Simulated delay for demo
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo purposes - show success
            showToast('Account created successfully!', 'success');
            
            // Redirect to login page after 1 second
            setTimeout(() => {
                window.location.href = 'login.html?registered=true';
            }, 1000);
            
        } catch (error) {
            showToast('Registration failed. Please try again.', 'error');
            submitBtn.disabled = false;
            btnText.textContent = originalText;
        }
    });
}

// Check for registration success message on login page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showToast('Account created successfully! Please log in.', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
