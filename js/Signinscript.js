document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('signInForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const submitBtn = document.getElementById('submitBtn');

  // ===== Eye Icon SVG Paths =====
  const eyeOpenIcon = `
    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
  `;

  const eyeClosedIcon = `
    <path d="M17.94 17.94A10.94 10.94 0 0112 20C5 20 1 12 1 12a19.7 19.7 0 015.06-6.06M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a19.6 19.6 0 01-3.22 4.44M14.12 14.12a3 3 0 11-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `;

  // ===== Toggle Password Visibility =====
  togglePasswordBtn.addEventListener('click', () => {
    const isCurrentlyPassword = passwordInput.type === 'password';
    passwordInput.type = isCurrentlyPassword ? 'text' : 'password';
    togglePasswordBtn.classList.toggle('active', isCurrentlyPassword);
    const iconSvg = togglePasswordBtn.querySelector('svg');
    iconSvg.innerHTML = isCurrentlyPassword ? eyeClosedIcon : eyeOpenIcon;
    passwordInput.focus();
  });

  // ===== Simple Validators =====
  const isValidEmail = (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value.trim());
  };

  const clearErrors = () => {
    emailError.textContent = '';
    passwordError.textContent = '';
    emailInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
  };

  const showError = (input, errorEl, message) => {
    errorEl.textContent = message;
    input.style.borderColor = '#ef4444';
  };

  // Real-time validation feedback
  emailInput.addEventListener('input', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      showError(emailInput, emailError, 'Please enter a valid email address');
    } else {
      emailError.textContent = '';
      emailInput.style.borderColor = '';
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.value && passwordInput.value.length < 6) {
      showError(passwordInput, passwordError, 'Password must be at least 6 characters');
    } else {
      passwordError.textContent = '';
      passwordInput.style.borderColor = '';
    }
  });

  // ===== Form Submission =====
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    let hasError = false;

    if (!emailValue) {
      showError(emailInput, emailError, 'Email address is required');
      hasError = true;
    } else if (!isValidEmail(emailValue)) {
      showError(emailInput, emailError, 'Please enter a valid email address');
      hasError = true;
    }

    if (!passwordValue) {
      showError(passwordInput, passwordError, 'Password is required');
      hasError = true;
    } else if (passwordValue.length < 6) {
      showError(passwordInput, passwordError, 'Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) {
      const card = document.querySelector('.auth-card');
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = 'shake 0.4s ease';
      });
      return;
    }

    setLoadingState(true);

    setTimeout(() => {
      setLoadingState(false);
      // Save authenticated user profile
      const rawName = emailValue.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Priya Sharma';
      localStorage.setItem('ag_user', JSON.stringify({
        name: formattedName,
        email: emailValue,
        phone: '+91 98765 43210'
      }));

      // Redirect to unified Dashboard
      window.location.href = 'dashboard.html';
    }, 900);
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span><span class="btn-text">Signing In...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span class="btn-text">Sign In to Dashboard</span>
        <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
  }

});