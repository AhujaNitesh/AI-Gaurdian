/* ==================================================
   AI GUARDIAN — LIVE JOURNEY PAGE (Women's Safety)
   Permanent Sidebar — Website Version
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- ELEMENT REFERENCES ---------- */
  const progressFill    = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  const etaTime          = document.getElementById('etaTime');
  const manualSlider     = document.getElementById('manualSlider');
  const finishBtn        = document.getElementById('finishBtn');
  const simulateBtn      = document.getElementById('simulateBtn');
  const routeStatusBadge = document.getElementById('routeStatusBadge');
  const scoreBadge       = document.getElementById('scoreBadge');

  const sirenBtn         = document.getElementById('sirenBtn');
  const sosBtn           = document.getElementById('sosBtn');
  const sosModeBtn       = document.getElementById('sosModeBtn');
  const sosNavBtn        = document.getElementById('sosNavBtn');
  const fabSos           = document.getElementById('fabSos');

  const sosModal         = document.getElementById('sosModal');
  const cancelSos        = document.getElementById('cancelSos');
  const confirmSos       = document.getElementById('confirmSos');

  const manageBtn        = document.getElementById('manageBtn');
  const manageModal      = document.getElementById('manageModal');
  const closeManage      = document.getElementById('closeManage');
  const manageList       = document.getElementById('manageList');
  const addContactForm   = document.getElementById('addContactForm');
  const contactNameInp   = document.getElementById('contactName');
  const contactRelInp    = document.getElementById('contactRelation');
  const contactsList     = document.getElementById('contactsList');

  const pedValue         = document.getElementById('pedValue');
  const pedMeter         = document.getElementById('pedMeter');

  const toastContainer   = document.getElementById('toastContainer');

  const navItems         = document.querySelectorAll('.nav-item:not(.sos-nav)');

  /* ---------- STATE ---------- */
  let progress = 0;
  const totalMinutes = 41;
  let simInterval = null;
  let simulating = false;
  let arrived = false;

  let contacts = [
    { name: 'Mom', relation: 'Family', status: 'Notified & Live' },
    { name: 'Riya Patel', relation: 'Friend', status: 'Notified & Live' },
    { name: 'Dad', relation: 'Family', status: 'Notified' }
  ];

  /* ================= SIDEBAR NAV (DEMO PAGE ONLY) ================= */
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.classList.contains('active')) return;
      const name = item.dataset.name;
      showToast(`"${name}" is available in the full AI Guardian website.`, 'info');
    });
  });

  /* ================= TOAST SYSTEM ================= */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3600);
  }

  /* ================= CONTACTS RENDERING ================= */
  function statusClass(status) {
    if (status === 'Notified & Live') return 'status-live';
    if (status === 'Notified') return 'status-notified';
    return 'status-pending';
  }

  function renderContacts() {
    contactsList.innerHTML = contacts.map(c => `
      <li>
        <span>${c.name} <small>(${c.relation})</small></span>
        <span class="status-badge ${statusClass(c.status)}">${c.status}</span>
      </li>
    `).join('');
  }

  function renderManageList() {
    manageList.innerHTML = contacts.map((c, i) => `
      <li>
        <span>${c.name} <small>(${c.relation})</small></span>
        <button data-index="${i}" title="Remove">&times;</button>
      </li>
    `).join('');

    manageList.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        contacts.splice(idx, 1);
        renderManageList();
        renderContacts();
        showToast('Contact removed from Safety Circle.', 'info');
      });
    });
  }

  renderContacts();

  /* ================= MANAGE MODAL ================= */
  manageBtn.addEventListener('click', () => {
    renderManageList();
    manageModal.classList.add('show');
  });
  closeManage.addEventListener('click', () => manageModal.classList.remove('show'));

  addContactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactNameInp.value.trim();
    const relation = contactRelInp.value.trim();
    if (!name || !relation) return;

    contacts.push({ name, relation, status: 'Pending' });
    renderManageList();
    renderContacts();
    addContactForm.reset();
    showToast(`${name} added to your Safety Circle.`, 'success');
  });

  /* ================= SOS MODAL ================= */
  function openSosModal(e) {
    if (e) e.preventDefault();
    sosModal.classList.add('show');
  }
  function closeSosModal() { sosModal.classList.remove('show'); }

  [sosBtn, sosModeBtn, sosNavBtn, fabSos].forEach(btn => {
    btn.addEventListener('click', openSosModal);
  });
  cancelSos.addEventListener('click', closeSosModal);

  confirmSos.addEventListener('click', () => {
    closeSosModal();
    activateSOS();
  });

  function activateSOS() {
    contacts = contacts.map(c => ({ ...c, status: 'Notified & Live' }));
    renderContacts();
    showToast('🚨 Emergency SOS Activated! Live location shared with your Safety Circle.', 'danger');

    document.body.classList.add('sos-alert');
    setTimeout(() => document.body.classList.remove('sos-alert'), 4000);
  }

  /* ================= JOURNEY PROGRESS ================= */
  function updateProgressUI() {
    progressFill.style.width = progress + '%';
    progressPercent.textContent = Math.round(progress) + '% Complete';
    manualSlider.value = progress;

    const remaining = Math.max(0, Math.round(totalMinutes * (1 - progress / 100)));
    etaTime.textContent = progress >= 100 ? 'Arrived' : remaining + ' mins';

    if (progress >= 100 && !arrived) {
      handleArrival();
    }
  }

  function handleArrival() {
    arrived = true;
    stopSimulation();
    routeStatusBadge.innerHTML = `<i class="dot-green"></i> ARRIVED`;
    simulateBtn.disabled = true;
    simulateBtn.style.opacity = 0.6;
    showToast('🎉 You have arrived safely at your destination!', 'success');
  }

  function startSimulation() {
    if (arrived) return;
    simulating = true;
    simulateBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg> Pause Simulation`;

    simInterval = setInterval(() => {
      progress = Math.min(100, progress + 2);
      updateProgressUI();
      if (progress >= 100) stopSimulation();
    }, 500);
  }

  function stopSimulation() {
    simulating = false;
    clearInterval(simInterval);
    if (!arrived) {
      simulateBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Simulate Movement`;
    }
  }

  simulateBtn.addEventListener('click', () => {
    if (simulating) stopSimulation();
    else startSimulation();
  });

  manualSlider.addEventListener('input', (e) => {
    stopSimulation();
    progress = parseInt(e.target.value, 10);
    if (progress < 100) arrived = false;
    updateProgressUI();
  });

  finishBtn.addEventListener('click', () => {
    stopSimulation();
    progress = 100;
    updateProgressUI();
  });

  /* ================= AI SAFETY ACTIONS ================= */
  const pedLevels = [
    { text: 'Low Activity', width: 25 },
    { text: 'Moderate Activity', width: 55 },
    { text: 'High Activity', width: 80 }
  ];

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('loading')) return;
      const titleEl = btn.querySelector('.action-title');
      const originalText = titleEl.textContent;

      btn.classList.add('loading');
      titleEl.textContent = 'Scanning...';

      setTimeout(() => {
        btn.classList.remove('loading');
        titleEl.textContent = originalText;
        handleAction(btn.dataset.action);
      }, 1200);
    });
  });

  function handleAction(action) {
    switch (action) {
      case 'audio':
        showToast('🎙️ Audio scan complete — no distress sounds detected.', 'success');
        break;

      case 'env': {
        const random = pedLevels[Math.floor(Math.random() * pedLevels.length)];
        pedValue.textContent = random.text;
        pedMeter.style.width = random.width + '%';
        showToast('📷 Environment scan complete — surroundings look safe.', 'success');
        break;
      }

      case 'reroute':
        scoreBadge.textContent = 'Score: 97/100';
        showToast('🔄 Safer route found! Safety score improved to 97/100.', 'success');
        break;
    }
  }

  /* ================= MANUAL SIREN (WEB AUDIO) ================= */
  let audioCtx, oscillator, sirenInterval;
  let sirenActive = false;

  function startSiren() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0.04;
      oscillator.type = 'sawtooth';
      oscillator.connect(gainNode).connect(audioCtx.destination);
      oscillator.start();

      let up = true;
      sirenInterval = setInterval(() => {
        if (!oscillator) return;
        oscillator.frequency.linearRampToValueAtTime(up ? 880 : 440, audioCtx.currentTime + 0.35);
        up = !up;
      }, 380);
    } catch (err) {
      console.warn('Audio not supported in this browser.');
    }
  }

  function stopSiren() {
    clearInterval(sirenInterval);
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
    if (audioCtx) audioCtx.close();
  }

  sirenBtn.addEventListener('click', () => {
    sirenActive = !sirenActive;
    if (sirenActive) {
      startSiren();
      sirenBtn.textContent = 'Stop Alarm (Active)';
      sirenBtn.classList.add('active-alarm');
      showToast('🔊 Audible alarm activated!', 'danger');
    } else {
      stopSiren();
      sirenBtn.textContent = 'Trigger Audible Alarm';
      sirenBtn.classList.remove('active-alarm');
      showToast('Alarm stopped.', 'info');
    }
  });

  /* ================= INIT ================= */
  updateProgressUI();
});