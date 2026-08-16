/* ================================================================
   AI GUARDIAN — SETTINGS & PRIVACY LOGIC
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const profNameInp = document.getElementById('profName');
  const profEmailInp = document.getElementById('profEmail');
  const profPhoneInp = document.getElementById('profPhone');

  const testSirenBtn = document.getElementById('testSirenBtn');
  const testCallBtn = document.getElementById('testCallBtn');

  const fakeCallOverlay = document.getElementById('fakeCallOverlay');
  const declineCallBtn = document.getElementById('declineCallBtn');
  const acceptCallBtn = document.getElementById('acceptCallBtn');

  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const resetDemoBtn = document.getElementById('resetDemoBtn');
  const signOutBtn = document.getElementById('settingsSignOutBtn');

  // Load profile from localStorage
  try {
    const user = JSON.parse(localStorage.getItem('ag_user') || '{}');
    if (user.name && profNameInp) profNameInp.value = user.name;
    if (user.email && profEmailInp) profEmailInp.value = user.email;
    if (user.phone && profPhoneInp) profPhoneInp.value = user.phone;
  } catch (e) {}

  // Save profile
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedUser = {
        name: profNameInp.value.trim() || 'Priya Sharma',
        email: profEmailInp.value.trim() || 'demo@guardian.ai',
        phone: profPhoneInp.value.trim() || '+91 98765 43210'
      };

      localStorage.setItem('ag_user', JSON.stringify(updatedUser));

      // Update sidebar avatar and name in live session
      const sbName = document.getElementById('ag-sb-name');
      const sbEmail = document.getElementById('ag-sb-email');
      const sbAvatar = document.getElementById('ag-sb-avatar');

      if (sbName) sbName.textContent = updatedUser.name;
      if (sbEmail) sbEmail.textContent = updatedUser.email;
      if (sbAvatar) sbAvatar.textContent = updatedUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);

      if (window.showGuardianToast) {
        window.showGuardianToast('✓ Profile updated successfully', 'success');
      }
    });
  }

  // Siren Alarm Test
  if (testSirenBtn) {
    testSirenBtn.addEventListener('click', () => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(850, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.25);
        osc.frequency.exponentialRampToValueAtTime(850, audioCtx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.0);

        if (window.showGuardianToast) {
          window.showGuardianToast('🔊 Siren sound test playing (2s)', 'danger');
        }
      } catch (e) {
        if (window.showGuardianToast) {
          window.showGuardianToast('🔊 Siren test triggered', 'danger');
        }
      }
    });
  }

  // Fake Call Simulator
  if (testCallBtn) {
    testCallBtn.addEventListener('click', () => {
      if (fakeCallOverlay) fakeCallOverlay.classList.add('active');
    });
  }

  function closeFakeCall() {
    if (fakeCallOverlay) fakeCallOverlay.classList.remove('active');
  }

  if (declineCallBtn) declineCallBtn.addEventListener('click', closeFakeCall);
  if (acceptCallBtn) {
    acceptCallBtn.addEventListener('click', () => {
      const status = fakeCallOverlay.querySelector('.call-status');
      if (status) status.textContent = 'Connected (0:01) — Pretending to talk';
      setTimeout(closeFakeCall, 2500);
    });
  }

  // Clear History
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Clear all local journey logs?')) {
        if (window.showGuardianToast) {
          window.showGuardianToast('Journey history cleared from this device', 'info');
        }
      }
    });
  }

  // Reset Demo
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      if (confirm('Reset demo state and notification counters?')) {
        localStorage.removeItem('ag_notifications_v2');
        localStorage.removeItem('ag_guardian_places_v1');
        if (window.showGuardianToast) {
          window.showGuardianToast('App data reset to default demo state', 'info');
        }
        setTimeout(() => location.reload(), 800);
      }
    });
  }

  // Sign Out
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('ag_user');
        window.location.href = 'Signin.html';
      }
    });
  }
});
