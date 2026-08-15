document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("card");
  const form = document.getElementById("reset-form");
  const emailInput = document.getElementById("email");
  const emailMsg = document.getElementById("email-msg");

  const stepRequest = document.getElementById("step-request");
  const stepSent = document.getElementById("step-sent");
  const sentEmailLabel = document.getElementById("sent-email");

  const resendBtn = document.getElementById("resend-btn");
  const resendLabel = document.getElementById("resend-label");
  const editEmailLink = document.getElementById("edit-email-link");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const RESEND_COOLDOWN_SECONDS = 30;

  let resendTimer = null;

  function showError(message) {
    emailMsg.textContent = message;
    card.classList.add("has-error");
  }

  function clearError() {
    emailMsg.textContent = "";
    card.classList.remove("has-error");
  }

  function switchStep(from, to) {
    from.dataset.active = "false";
    to.dataset.active = "true";
  }

  function startResendCooldown() {
    let remaining = RESEND_COOLDOWN_SECONDS;
    resendBtn.disabled = true;
    resendLabel.textContent = `Resend available in ${remaining}s`;

    clearInterval(resendTimer);
    resendTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(resendTimer);
        resendBtn.disabled = false;
        resendLabel.textContent = "Resend Email";
      } else {
        resendLabel.textContent = `Resend available in ${remaining}s`;
      }
    }, 1000);
  }

  // ---- Live validation while typing ----
  emailInput.addEventListener("input", () => {
    if (card.classList.contains("has-error") && EMAIL_PATTERN.test(emailInput.value.trim())) {
      clearError();
    }
  });

  // ---- Submit: request reset link ----
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = emailInput.value.trim();

    if (!value) {
      showError("Enter the email address linked to your account.");
      emailInput.focus();
      return;
    }

    if (!EMAIL_PATTERN.test(value)) {
      showError("Enter a valid email address.");
      emailInput.focus();
      return;
    }

    clearError();
    card.classList.add("is-loading");

    // Simulate a network request to send the reset link.
    setTimeout(() => {
      card.classList.remove("is-loading");
      sentEmailLabel.textContent = value;
      switchStep(stepRequest, stepSent);
      startResendCooldown();
    }, 1100);
  });

  // ---- Resend email ----
  resendBtn.addEventListener("click", () => {
    if (resendBtn.disabled) return;
    resendLabel.textContent = "Sending…";
    resendBtn.disabled = true;

    setTimeout(() => {
      startResendCooldown();
    }, 700);
  });

  // ---- Edit email: go back to step 1 ----
  editEmailLink.addEventListener("click", (e) => {
    e.preventDefault();
    clearInterval(resendTimer);
    switchStep(stepSent, stepRequest);
    emailInput.focus();
    emailInput.select();
  });
});
