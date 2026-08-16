/* ================================================================
   AI GUARDIAN — JOURNEY HISTORY LOGIC
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const JOURNEYS = [
    {
      id: 'j1',
      date: 'Today, 8:42 PM',
      origin: 'Office (Tech Hub)',
      destination: 'Home (Oak Ridge)',
      route: 'Route B — AI Recommended',
      score: 94,
      distance: '4.1 km',
      duration: '29 min',
      status: 'Arrived Safely',
      lighting: '98% Continuous LED',
      footTraffic: 'High (Commercial)',
      guardiansNotified: 'Mom, Riya Patel, Dad',
      checkinTime: '8:42 PM (Verified)'
    },
    {
      id: 'j2',
      date: 'Yesterday, 9:15 PM',
      origin: 'University North Campus',
      destination: 'Home (Oak Ridge)',
      route: 'Route B — AI Recommended',
      score: 96,
      distance: '3.8 km',
      duration: '27 min',
      status: 'Arrived Safely',
      lighting: '100% High Luminance',
      footTraffic: 'High (Main Boulevard)',
      guardiansNotified: 'Mom, Riya Patel',
      checkinTime: '9:15 PM (Verified)'
    },
    {
      id: 'j3',
      date: '14 Aug 2026, 7:30 PM',
      origin: 'City Mall Plaza',
      destination: 'Office (Tech Hub)',
      route: 'Route C — Commercial Hub',
      score: 87,
      distance: '2.5 km',
      duration: '19 min',
      status: 'Arrived Safely',
      lighting: '84% Moderate',
      footTraffic: 'Crowded Shopping Zone',
      guardiansNotified: 'Mom, Dad',
      checkinTime: '7:30 PM (Verified)'
    },
    {
      id: 'j4',
      date: '13 Aug 2026, 10:05 PM',
      origin: 'Cafe Bloom',
      destination: 'Home (Oak Ridge)',
      route: 'Route B — AI Recommended',
      score: 93,
      distance: '5.2 km',
      duration: '35 min',
      status: 'Arrived Safely',
      lighting: '95% Continuous LED',
      footTraffic: 'Moderate',
      guardiansNotified: 'Mom, Riya Patel, Dad',
      checkinTime: '10:05 PM (Verified)'
    },
    {
      id: 'j5',
      date: '11 Aug 2026, 6:45 PM',
      origin: 'Metro Station Central',
      destination: 'Office (Tech Hub)',
      route: 'Route A — Fastest Path',
      score: 79,
      distance: '1.8 km',
      duration: '14 min',
      status: 'Arrived Safely',
      lighting: '72% Standard Streetlights',
      footTraffic: 'Moderate',
      guardiansNotified: 'Mom',
      checkinTime: '6:45 PM (Verified)'
    }
  ];

  let searchQuery = '';
  let scoreFilter = 'all';

  const listEl = document.getElementById('jhList');
  const searchInput = document.getElementById('jhSearch');
  const filterSelect = document.getElementById('jhFilterSelect');
  const exportBtn = document.getElementById('jhExportBtn');

  function renderList() {
    if (!listEl) return;

    const filtered = JOURNEYS.filter(j => {
      const matchSearch = !searchQuery ||
        j.origin.toLowerCase().includes(searchQuery) ||
        j.destination.toLowerCase().includes(searchQuery) ||
        j.route.toLowerCase().includes(searchQuery) ||
        j.date.toLowerCase().includes(searchQuery);

      const matchFilter = scoreFilter === 'all' ||
        (scoreFilter === 'safe' && j.score >= 90) ||
        (scoreFilter === 'moderate' && j.score < 90);

      return matchSearch && matchFilter;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:40px; color:#64748b; background:#fff; border-radius:14px; border:1px solid #e8eaf0;">
          <p style="font-size:15px; font-weight:600;">No journey history matching criteria</p>
        </div>`;
      return;
    }

    listEl.innerHTML = filtered.map(j => `
      <div class="jh-item" data-id="${j.id}">
        <div class="jh-item-main">
          <div class="jh-route-info">
            <div class="jh-route-icon">🗺️</div>
            <div>
              <div class="jh-route-names">${j.origin} &rarr; ${j.destination}</div>
              <div class="jh-route-meta">${j.date} &bull; ${j.route} &bull; ${j.distance} (${j.duration})</div>
            </div>
          </div>

          <div class="jh-metrics-row">
            <span class="jh-score-badge ${j.score >= 90 ? 'score-high' : 'score-mid'}">
              🛡️ ${j.score}/100
            </span>
            <span class="jh-status-badge">✓ ${j.status}</span>
            <button class="jh-toggle-btn" data-toggle="${j.id}">
              Details
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
        </div>

        <div class="jh-detail" id="detail-${j.id}">
          <div class="jh-detail-grid">
            <div class="jh-detail-col">
              <strong>Lighting Coverage</strong>
              <span>💡 ${j.lighting}</span>
            </div>
            <div class="jh-detail-col">
              <strong>Pedestrian &amp; Traffic Signal</strong>
              <span>👥 ${j.footTraffic}</span>
            </div>
            <div class="jh-detail-col">
              <strong>Safety Circle Contacts Active</strong>
              <span>🛡️ ${j.guardiansNotified}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Wire up expand / collapse
    listEl.querySelectorAll('.jh-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.toggle;
        const detailEl = document.getElementById(`detail-${id}`);
        if (detailEl) {
          detailEl.classList.toggle('open');
          e.currentTarget.classList.toggle('active');
        }
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderList();
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      scoreFilter = e.target.value;
      renderList();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (window.showGuardianToast) {
        window.showGuardianToast('📥 Encrypted Safety History downloaded as CSV.', 'success');
      }
    });
  }

  renderList();
});
