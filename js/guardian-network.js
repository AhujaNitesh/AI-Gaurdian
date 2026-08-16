/* ================================================================
   AI GUARDIAN — GUARDIAN NETWORK LOGIC
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const NETWORK_DATA = [
    {
      id: 'g1',
      name: 'Priya Verma',
      category: 'guardian',
      typeText: 'Verified Community Guardian',
      avatarClass: 'avatar-guardian',
      initials: 'PV',
      distance: '0.3 km away',
      rating: '★ 4.9 (42 escorts)',
      status: 'active',
      statusText: 'Available',
      desc: 'Certified local volunteer in Tech Park area. Available for evening walking escorts and transit support.'
    },
    {
      id: 'g2',
      name: 'City Police Station (Sector 4)',
      category: 'police',
      typeText: 'Emergency Dispatch & Patrol',
      avatarClass: 'avatar-police',
      initials: 'CP',
      distance: '0.4 km away',
      rating: '★ 5.0 (24/7 Unit)',
      status: 'active',
      statusText: 'Active Patrol',
      desc: 'Local police precinct with dedicated women safety helpline desk and rapid response mobile PCR vans.'
    },
    {
      id: 'g3',
      name: 'Apollo 24/7 Safe Haven',
      category: 'haven',
      typeText: '24/7 Verified Safe Haven',
      avatarClass: 'avatar-haven',
      initials: 'AP',
      distance: '0.6 km away',
      rating: '★ 4.8 (Verified Partner)',
      status: 'active',
      statusText: 'Open 24/7',
      desc: 'Well-lit 24-hour pharmacy with CCTV coverage, direct emergency call buttons, and staff safety protocol.'
    },
    {
      id: 'g4',
      name: 'Pink Shield Rapid Escort',
      category: 'escort',
      typeText: 'Professional Safety Escort',
      avatarClass: 'avatar-escort',
      initials: 'PS',
      distance: '0.8 km away',
      rating: '★ 4.9 (120+ trips)',
      status: 'active',
      statusText: 'On Standby',
      desc: 'Dedicated female safety escort team for nighttime transit between metro stations and residential complexes.'
    },
    {
      id: 'g5',
      name: 'Ananya Deshmukh',
      category: 'guardian',
      typeText: 'Neighborhood Volunteer',
      avatarClass: 'avatar-guardian',
      initials: 'AD',
      distance: '0.9 km away',
      rating: '★ 4.8 (19 escorts)',
      status: 'active',
      statusText: 'Available',
      desc: 'University campus safety coordinator and certified first responder in University North area.'
    },
    {
      id: 'g6',
      name: 'Cafe Bloom (Safe Zone)',
      category: 'haven',
      typeText: 'Verified Safe Business',
      avatarClass: 'avatar-haven',
      initials: 'CB',
      distance: '1.1 km away',
      rating: '★ 4.7 (Safe Haven)',
      status: 'active',
      statusText: 'Open till 1 AM',
      desc: 'Crowded high-visibility cafe with free SOS charging, emergency phone access, and security guard presence.'
    }
  ];

  let currentCategory = 'all';
  let searchQuery = '';

  const gridEl = document.getElementById('gnGrid');
  const tabs = document.querySelectorAll('.gn-tab');
  const searchInput = document.getElementById('gnSearchInput');

  const modalOverlay = document.getElementById('gnModalOverlay');
  const modalCancel = document.getElementById('gnModalCancel');
  const requestForm = document.getElementById('gnRequestForm');
  const targetNameInp = document.getElementById('gnTargetName');

  function renderGrid() {
    if (!gridEl) return;

    const filtered = NETWORK_DATA.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery) ||
        item.typeText.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px; color:#64748b; background:#fff; border-radius:14px; border:1px solid #e8eaf0;">
          <p style="font-size:16px; font-weight:600; margin-bottom:6px;">No network partners found</p>
          <p style="font-size:13px;">Try adjusting your search query or selecting a different category filter.</p>
        </div>`;
      return;
    }

    gridEl.innerHTML = filtered.map(item => `
      <div class="gn-card" data-id="${item.id}">
        <div class="gn-card-top">
          <div class="gn-avatar ${item.avatarClass}">${item.initials}</div>
          <div class="gn-details">
            <div class="gn-name">${item.name}</div>
            <div class="gn-type">${item.typeText}</div>
          </div>
          <span class="gn-status-badge status-${item.status}">${item.statusText}</span>
        </div>

        <div class="gn-meta-row">
          <div class="gn-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${item.distance}</span>
          </div>
          <div class="gn-meta-item">
            <span>${item.rating}</span>
          </div>
        </div>

        <div class="gn-desc">${item.desc}</div>

        <div class="gn-actions">
          <button class="gn-btn-help" data-name="${item.name}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
            Request Help
          </button>
          <a href="SafePlaces.html" class="gn-btn-map" title="View location on map">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>
            Map
          </a>
        </div>
      </div>
    `).join('');

    // Wire up help buttons
    gridEl.querySelectorAll('.gn-btn-help').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.currentTarget.dataset.name;
        if (targetNameInp) targetNameInp.value = name;
        if (modalOverlay) modalOverlay.classList.add('open');
      });
    });
  }

  // Filter Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      renderGrid();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderGrid();
    });
  }

  // Modal actions
  if (modalCancel) {
    modalCancel.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('open');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
  }

  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const target = targetNameInp.value;
      if (modalOverlay) modalOverlay.classList.remove('open');
      if (window.showGuardianToast) {
        window.showGuardianToast(`✓ Help request dispatched to ${target}! ETA: 3 mins`, 'success');
      }
      if (window.agPushNotif) {
        window.agPushNotif('🤝 Guardian Escort Dispatched', `${target} has accepted your request and is en route to your GPS location.`);
      }
    });
  }

  renderGrid();
});
