/* ==================================================
   AI GUARDIAN — LIVE JOURNEY SCRIPT (Women's Safety)
   Unified Shell Version
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- URL PARAMETERS & ROUTE SETUP ---------- */
  const params = new URLSearchParams(window.location.search);
  const routeParam = params.get('route') || 'B';
  const destParam = params.get('dest') || 'Home (Oak Ridge)';
  const originParam = params.get('origin') || 'Office (Tech Hub)';

  // Update DOM with URL values
  const routeTitleEl = document.querySelector('.route-card h2');
  if (routeTitleEl) {
    routeTitleEl.textContent = `Route ${routeParam} — ${routeParam === 'B' ? 'AI Recommended' : routeParam === 'A' ? 'Fastest' : 'Commercial Hub'}`;
  }
  const scoreBadge = document.getElementById('scoreBadge');
  if (scoreBadge) {
    scoreBadge.textContent = routeParam === 'B' ? '94 / 100 Safety' : routeParam === 'A' ? '76 / 100 Safety' : '87 / 100 Safety';
  }

  const pointValues = document.querySelectorAll('.point-value');
  if (pointValues.length >= 2) {
    pointValues[0].textContent = originParam;
    pointValues[1].textContent = destParam;
  }

  /* ---------- ELEMENT REFERENCES ---------- */
  const progressFill    = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  const etaTime          = document.getElementById('etaTime');
  const manualSlider     = document.getElementById('manualSlider');
  const finishBtn        = document.getElementById('finishBtn');
  const simulateBtn      = document.getElementById('simulateBtn');
  const routeStatusBadge = document.getElementById('routeStatusBadge');

  const sirenBtn         = document.getElementById('sirenBtn');
  const sosBtn           = document.getElementById('sosBtn');
  const sosModeBtn       = document.getElementById('sosModeBtn');
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
  const feedList         = document.getElementById('feedList');

  const toastContainer   = document.getElementById('toastContainer');

  /* ---------- STATE ---------- */
  let progress = 0;
  const totalMinutes = routeParam === 'A' ? 26 : routeParam === 'B' ? 29 : 34;
  let simInterval = null;
  let simulating = false;
  let arrived = false;

  // Load contacts from Safety Circle or default
  let contacts = [
    { name: 'Mom', relation: 'Family', status: 'Notified & Live' },
    { name: 'Riya Patel', relation: 'Friend', status: 'Notified & Live' },
    { name: 'Dad', relation: 'Family', status: 'Notified' }
  ];

  /* ================= TOAST SYSTEM ================= */
  function showToast(message, type = 'info') {
    if (window.showGuardianToast) {
      window.showGuardianToast(message, type);
      return;
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    if (toastContainer) {
      toastContainer.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
      }, 3600);
    }
  }

  /* ================= CONTACTS RENDERING ================= */
  function statusClass(status) {
    if (status === 'Notified & Live') return 'status-live';
    if (status === 'Notified') return 'status-notified';
    return 'status-pending';
  }

  function renderContacts() {
    if (!contactsList) return;
    contactsList.innerHTML = contacts.map(c => `
      <li>
        <span>${c.name} <small>(${c.relation})</small></span>
        <span class="status-badge ${statusClass(c.status)}">${c.status}</span>
      </li>
    `).join('');
  }

  function renderManageList() {
    if (!manageList) return;
    manageList.innerHTML = contacts.map((c, i) => `
      <li>
        <span>${c.name} <small>(${c.relation})</small></span>
        <button data-index="${i}" title="Remove">&times;</button>
      </li>
    `).join('');

    manageList.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const removed = contacts.splice(idx, 1)[0];
        renderManageList();
        renderContacts();
        showToast(`Removed ${removed.name} from Safety Circle`, 'info');
      });
    });
  }

  renderContacts();

  /* ================= FEED HELPERS ================= */
  function addFeedItem(text) {
    if (!feedList) return;
    const li = document.createElement('li');
    li.className = 'feed-item';
    li.innerHTML = `
      <span class="feed-time">Just now</span>
      <span class="feed-text">${text}</span>
    `;
    feedList.prepend(li);
  }

  /* ================= PROGRESS LOGIC ================= */
  function updateUI() {
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;
    if (manualSlider) manualSlider.value = progress;

    const remaining = Math.max(0, Math.round(totalMinutes * (1 - progress / 100)));
    if (etaTime) etaTime.textContent = `${remaining} min remaining`;

    // Milestone feed updates
    if (progress >= 25 && progress < 30) {
      addFeedItem('Checkpoint 1 reached: Passed 24/7 Apollo Safe Haven.');
    } else if (progress >= 50 && progress < 55) {
      addFeedItem('Checkpoint 2: Police patrol unit visible (300m). Route optimal.');
    } else if (progress >= 75 && progress < 80) {
      addFeedItem('Checkpoint 3: Entering residential area. Continuous lighting confirmed.');
    }

    if (progress >= 100 && !arrived) {
      handleArrival();
    }
  }

  function handleArrival() {
    arrived = true;
    stopSimulation();
    if (routeStatusBadge) {
      routeStatusBadge.textContent = 'ARRIVED SAFELY';
      routeStatusBadge.className = 'badge badge-success';
    }
    addFeedItem('🎉 Arrived safely! Safety Circle notified of verified arrival.');
    showToast('🎉 You arrived safely! Safety Circle notified.', 'success');
  }

  /* ================= MANUAL SLIDER ================= */
  if (manualSlider) {
    manualSlider.addEventListener('input', (e) => {
      if (simulating) stopSimulation();
      progress = Number(e.target.value);
      updateUI();
    });
  }

  /* ================= AUTO SIMULATION ================= */
  function startSimulation() {
    simulating = true;
    if (simulateBtn) simulateBtn.textContent = '⏸ Pause Walk';
    showToast('AI Guardian real-time walk simulation started', 'info');

    simInterval = setInterval(() => {
      if (progress < 100) {
        progress += 1.5;
        if (progress > 100) progress = 100;
        updateUI();
      } else {
        stopSimulation();
      }
    }, 400);
  }

  function stopSimulation() {
    simulating = false;
    clearInterval(simInterval);
    simInterval = null;
    if (simulateBtn) simulateBtn.textContent = '▶ Start Auto Walk';
  }

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      if (simulating) {
        stopSimulation();
        showToast('Walk simulation paused', 'info');
      } else {
        if (progress >= 100) progress = 0;
        startSimulation();
      }
    });
  }

  /* ================= ARRIVED SAFELY BUTTON ================= */
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      progress = 100;
      updateUI();
    });
  }

  /* ================= SIREN / ALARM ================= */
  let audioCtx = null;
  let sirenOsc = null;

  function playSiren() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      sirenOsc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      sirenOsc.type = 'sawtooth';
      sirenOsc.frequency.setValueAtTime(800, audioCtx.currentTime);
      sirenOsc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.3);
      sirenOsc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      sirenOsc.connect(gain);
      gain.connect(audioCtx.destination);

      sirenOsc.start();
      sirenOsc.stop(audioCtx.currentTime + 2.5);
      showToast('🔊 Safety Siren activated!', 'danger');
    } catch (e) {
      showToast('🔊 Safety Siren sounding!', 'danger');
    }
  }

  if (sirenBtn) sirenBtn.addEventListener('click', playSiren);

  /* ================= SOS FLOW ================= */
  function openSosModal() {
    if (sosModal) sosModal.classList.add('active');
  }
  function closeSosModal() {
    if (sosModal) sosModal.classList.remove('active');
  }

  [sosBtn, sosModeBtn, fabSos].forEach(btn => {
    if (btn) btn.addEventListener('click', openSosModal);
  });

  if (cancelSos) cancelSos.addEventListener('click', closeSosModal);

  if (confirmSos) {
    confirmSos.addEventListener('click', () => {
      closeSosModal();
      document.body.classList.add('sos-active');
      showToast('🚨 Emergency SOS broadcasted! Safety Circle and local services alerted.', 'danger');
      addFeedItem('🚨 EMERGENCY SOS TRIGGERED. High-priority location dispatch sent.');
      setTimeout(() => document.body.classList.remove('sos-active'), 5000);
    });
  }

  /* ================= MANAGE CONTACTS MODAL ================= */
  if (manageBtn) {
    manageBtn.addEventListener('click', () => {
      renderManageList();
      if (manageModal) manageModal.classList.add('active');
    });
  }

  if (closeManage) {
    closeManage.addEventListener('click', () => {
      if (manageModal) manageModal.classList.remove('active');
    });
  }

  if (addContactForm) {
    addContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactNameInp.value.trim();
      const relation = contactRelInp.value.trim();
      if (!name || !relation) return;

      contacts.push({ name, relation, status: 'Notified & Live' });
      contactNameInp.value = '';
      contactRelInp.value = '';
      renderManageList();
      renderContacts();
      showToast(`Added ${name} to Safety Circle`, 'success');
    });
  }

  updateUI();
});