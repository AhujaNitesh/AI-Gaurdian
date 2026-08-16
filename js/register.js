// ===========================
// AI Guardian — Sign Up logic
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const successPanel = document.getElementById('successPanel');
  const resetBtn = document.getElementById('resetBtn');
  const submitBtn = document.getElementById('submitBtn');

  const fields = {
    fullName: document.getElementById('fullName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    terms: document.getElementById('terms'),
  };

  const errors = {
    fullName: document.getElementById('fullNameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    password: document.getElementById('passwordError'),
    confirmPassword: document.getElementById('confirmPasswordError'),
    terms: document.getElementById('termsError'),
  };

  const strengthMeter = document.querySelector('.strength-meter');
  const strengthLabel = document.getElementById('strengthLabel');

  // ---------- Password show/hide ----------
  document.querySelectorAll('.toggle-visibility').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isHidden = input.type === 'password';

      input.type = isHidden ? 'text' : 'password';
      btn.querySelector('.eye-open').hidden = isHidden;
      btn.querySelector('.eye-closed').hidden = !isHidden;
      btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  });

  // ---------- Password strength ----------
  function scorePassword(value) {
    let score = 0;
    if (value.length >= 6) score++;
    if (value.length >= 10) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
    return score; // 0-4
  }

  const strengthText = ['Too short', 'Weak password', 'Okay password', 'Good password', 'Strong password'];

  fields.password.addEventListener('input', () => {
    const value = fields.password.value;
    const score = value.length === 0 ? 0 : Math.max(1, scorePassword(value));
    strengthMeter.setAttribute('data-level', value.length === 0 ? 0 : score);
    strengthLabel.textContent = value.length === 0 ? '\u00A0' : strengthText[score];
    clearError('password');
    if (fields.confirmPassword.value) validateConfirmPassword();
  });

  // ---------- Field-level validation ----------
  function setError(key, message) {
    const field = fields[key];
    const errorEl = errors[key];
    errorEl.textContent = message;
    errorEl.classList.add('visible');
    const wrapper = field.closest('.field');
    if (wrapper) wrapper.classList.add('has-error');
  }

  function clearError(key) {
    const field = fields[key];
    const errorEl = errors[key];
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
    const wrapper = field.closest('.field');
    if (wrapper) wrapper.classList.remove('has-error');
  }

  function validateFullName() {
    const value = fields.fullName.value.trim();
    if (!value) return setError('fullName', 'Enter your full name.'), false;
    if (value.length < 2) return setError('fullName', 'Name looks too short.'), false;
    clearError('fullName');
    return true;
  }

  function validateEmail() {
    const value = fields.email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return setError('email', 'Enter your email address.'), false;
    if (!re.test(value)) return setError('email', 'Enter a valid email address.'), false;
    clearError('email');
    return true;
  }

  function validatePhone() {
    const value = fields.phone.value.trim();
    if (!value) { clearError('phone'); return true; } // optional
    const re = /^[+]?[\d\s-]{7,15}$/;
    if (!re.test(value)) return setError('phone', 'Enter a valid phone number.'), false;
    clearError('phone');
    return true;
  }

  function validatePassword() {
    const value = fields.password.value;
    if (!value) return setError('password', 'Create a password.'), false;
    if (value.length < 6) return setError('password', 'Use at least 6 characters.'), false;
    clearError('password');
    return true;
  }

  function validateConfirmPassword() {
    const value = fields.confirmPassword.value;
    if (!value) return setError('confirmPassword', 'Repeat your password.'), false;
    if (value !== fields.password.value) return setError('confirmPassword', 'Passwords do not match.'), false;
    clearError('confirmPassword');
    return true;
  }

  function validateTerms() {
    if (!fields.terms.checked) return setError('terms', 'You must accept the Terms and Privacy Policy to continue.'), false;
    clearError('terms');
    return true;
  }

  // Validate on blur
  fields.fullName.addEventListener('blur', validateFullName);
  fields.email.addEventListener('blur', validateEmail);
  fields.phone.addEventListener('blur', validatePhone);
  fields.password.addEventListener('blur', validatePassword);
  fields.confirmPassword.addEventListener('blur', validateConfirmPassword);
  fields.terms.addEventListener('change', validateTerms);

  // Clear errors as user corrects them
  [fields.fullName, fields.email, fields.phone, fields.confirmPassword].forEach((input) => {
    const key = Object.keys(fields).find((k) => fields[k] === input);
    input.addEventListener('input', () => clearError(key));
  });

  // ---------- Submit ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const validations = [
      validateFullName(),
      validateEmail(),
      validatePhone(),
      validatePassword(),
      validateConfirmPassword(),
      validateTerms(),
    ];

    const isValid = validations.every(Boolean);

    if (!isValid) {
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');

      const firstInvalid = Object.keys(errors).find((key) => errors[key].classList.contains('visible'));
      if (firstInvalid && fields[firstInvalid].focus) fields[firstInvalid].focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Creating account…';

    setTimeout(() => {
      const name = fields.fullName.value.trim();
      const email = fields.email.value.trim();
      const phone = fields.phone.value.trim();

      // Save user to localStorage
      localStorage.setItem('ag_user', JSON.stringify({
        name: name,
        email: email,
        phone: phone || '+91 98765 43210'
      }));

      document.getElementById('successName').textContent = name.split(' ')[0] || 'friend';
      form.hidden = true;
      successPanel.hidden = false;
    }, 600);
  });

  // ---------- Reset ----------
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      Object.keys(errors).forEach(clearError);
      strengthMeter.setAttribute('data-level', 0);
      strengthLabel.textContent = '\u00A0';
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Register & Start Safe Journey';
      successPanel.hidden = true;
      form.hidden = false;
      fields.fullName.focus();
    });
  }
});
