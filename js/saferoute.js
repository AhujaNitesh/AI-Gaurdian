// ===========================
// AI Guardian — Safe Route
// ===========================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Step 1: origin / destination ----------
  const originInput = document.getElementById('origin');
  const destinationInput = document.getElementById('destination');
  const calculateBtn = document.getElementById('calculateBtn');
  const calcHint = document.getElementById('calcHint');
  const useLocationBtn = document.getElementById('useLocation');
  const presetRow = document.getElementById('presetRow');

  function refreshCalculateState() {
    const ready = originInput.value.trim().length > 1 && destinationInput.value.trim().length > 1;
    calculateBtn.disabled = !ready;
    calcHint.textContent = ready
      ? 'Ready — AI Guardian will evaluate routes for lighting, activity, and safety.'
      : 'Enter both a starting point and destination to continue.';
  }

  originInput.addEventListener('input', refreshCalculateState);
  destinationInput.addEventListener('input', refreshCalculateState);

  useLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      originInput.value = 'Current Location';
      refreshCalculateState();
      return;
    }
    useLocationBtn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        originInput.value = `Current Location (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`;
        refreshCalculateState();
        useLocationBtn.disabled = false;
      },
      () => {
        originInput.value = 'Current Location';
        refreshCalculateState();
        useLocationBtn.disabled = false;
      }
    );
  });

  presetRow.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    presetRow.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-selected'));
    chip.classList.add('is-selected');
    destinationInput.value = chip.dataset.value;
    refreshCalculateState();
  });

  // ---------- Route data (sample AI evaluation output) ----------
  const ROUTES = [
    {
      id: 'A',
      title: 'Route A — Fastest',
      time: '38 min',
      distance: '3.2 km',
      score: 61,
      tier: 'low',
      recommended: false,
      bullets: [
        'Shortest travel time',
        'Passes through 2 low-activity areas',
        'Limited lighting on 30% of route',
      ],
      metrics: [
        { name: 'Street Lighting Index', icon: 'sun', value: 58, desc: 'Well-lit coverage across 58% of pathway' },
        { name: 'Foot Traffic & Population Density', icon: 'people', value: 63, desc: 'Moderate activity, some quiet stretches' },
        { name: 'Crowdsourced Safety Reports', icon: 'flag', value: 70, desc: '1 minor incident reported in past 48h' },
        { name: 'Proximity to 24/7 Public Havens', icon: 'building', value: 55, desc: '1 police station reachable within 400 meters' },
      ],
    },
    {
      id: 'B',
      title: 'Route B — AI Recommended',
      time: '41 min',
      distance: '4.1 km',
      score: 94,
      tier: 'high',
      recommended: true,
      bullets: [
        'Well-lit throughout entire route',
        'Passes through high-activity commercial areas',
        'Near police patrol zone',
      ],
      metrics: [
        { name: 'Street Lighting Index', icon: 'sun', value: 95, desc: 'Well-lit coverage across 95%+ of pathway' },
        { name: 'Foot Traffic & Population Density', icon: 'people', value: 92, desc: 'High active population & open commercial storefronts' },
        { name: 'Crowdsourced Safety Reports', icon: 'flag', value: 96, desc: 'Zero dark spots or reported incidents in past 48h' },
        { name: 'Proximity to 24/7 Public Havens', icon: 'building', value: 93, desc: '2 police stations & 24/7 commercial stores reachable within 150 meters' },
      ],
    },
    {
      id: 'C',
      title: 'Route C — Balanced',
      time: '39 min',
      distance: '3.6 km',
      score: 78,
      tier: 'mid',
      recommended: false,
      bullets: [
        'Moderate lighting coverage',
        'Passes near metro station',
        'Some residential areas with moderate activity',
      ],
      metrics: [
        { name: 'Street Lighting Index', icon: 'sun', value: 74, desc: 'Well-lit coverage across 74% of pathway' },
        { name: 'Foot Traffic & Population Density', icon: 'people', value: 80, desc: 'Steady activity near transit and residential blocks' },
        { name: 'Crowdsourced Safety Reports', icon: 'flag', value: 82, desc: 'No major incidents reported in past 48h' },
        { name: 'Proximity to 24/7 Public Havens', icon: 'building', value: 76, desc: '1 metro station & pharmacy reachable within 250 meters' },
      ],
    },
  ];

  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 3V5M12 19V21M4.2 4.2L5.6 5.6M18.4 18.4L19.8 19.8M3 12H5M19 12H21M4.2 19.8L5.6 18.4M18.4 5.6L19.8 4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    people: '<circle cx="8.5" cy="8" r="2.6" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 19C3.5 15.7 5.7 14 8.5 14C11.3 14 13.5 15.7 13.5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16.5" cy="9" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M14.2 14.3C16.6 14.6 18.3 16 18.5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    flag: '<path d="M12 9V21M12 9C12 9 12.5 3 5.5 3C5.5 8 5.5 8 5.5 8C5.5 13 12 9 12 9Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    building: '<rect x="4" y="7" width="9" height="14" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="3" width="7" height="18" stroke="currentColor" stroke-width="1.6"/><path d="M7 11H10M7 15H10M16 7H17M16 11H17M16 15H17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  };

  // ---------- Stepper ----------
  const stepper = document.getElementById('stepper');
  function setStepperState(activeStep) {
    stepper.querySelectorAll('.stepper__item').forEach((item) => {
      const step = Number(item.dataset.step);
      item.classList.remove('is-active', 'is-complete');
      if (step < activeStep) item.classList.add('is-complete');
      if (step === activeStep) item.classList.add('is-active');
    });
  }

  // ---------- Step 2: build route cards ----------
  const step2Block = document.getElementById('step2Block');
  const step3Block = document.getElementById('step3Block');
  const routesGrid = document.getElementById('routesGrid');

  function tierIcon() {
    return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L9.5 17.5L20 6.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function renderRoutes() {
    routesGrid.innerHTML = ROUTES.map((r) => `
      <button type="button" class="route-card ${r.recommended ? 'is-recommended' : ''}" data-route="${r.id}">
        ${r.recommended ? '<span class="route-card__badge"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L14.2 9.3L21 12L14.2 14.7L12 21L9.8 14.7L3 12L9.8 9.3L12 3Z" fill="white"/></svg> AI RECOMMENDED</span>' : ''}
        <h3 class="route-card__title">${r.title}</h3>
        <div class="route-card__meta">
          <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7V12L15.5 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> ${r.time}</span>
          <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 12 7 6 12 6C17 6 20 12 20 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 12C4 12 7 18 12 18C17 18 20 12 20 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> ${r.distance}</span>
        </div>
        <div>
          <div class="score-row">
            <span class="score-row__label">Safety Score</span>
            <span class="score-row__value tier-${r.tier}">${r.score}/100</span>
          </div>
          <div class="score-bar"><div class="score-bar__fill tier-${r.tier}" style="width:${r.score}%"></div></div>
        </div>
        <ul class="route-card__bullets">
          ${r.bullets.map((b) => `<li>${tierIcon()} ${b}</li>`).join('')}
        </ul>
        <div class="route-card__footer">
          ${tierIcon()}
          <span class="footer-text">Click to Select</span>
        </div>
      </button>
    `).join('');
  }

  let selectedRouteId = null;

  function selectRoute(id) {
    selectedRouteId = id;
    routesGrid.querySelectorAll('.route-card').forEach((card) => {
      const isSelected = card.dataset.route === id;
      card.classList.toggle('is-selected', isSelected);
      card.querySelector('.footer-text').textContent = isSelected ? 'Selected Route' : 'Click to Select';
    });
    renderBreakdown(id);
    step3Block.classList.remove('hidden');
    setStepperState(3);
    step3Block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  routesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.route-card');
    if (!card) return;
    selectRoute(card.dataset.route);
  });

  // ---------- Step 3: breakdown + recommendation ----------
  const metricsList = document.getElementById('metricsList');
  const breakdownSubtitle = document.getElementById('breakdownSubtitle');
  const choiceBadge = document.getElementById('choiceBadge');
  const recommendationHeading = document.getElementById('recommendationHeading');
  const recommendationBody = document.getElementById('recommendationBody');
  const startJourneyLabel = document.getElementById('startJourneyLabel');

  function renderBreakdown(routeId) {
    const route = ROUTES.find((r) => r.id === routeId);
    const best = ROUTES.find((r) => r.recommended);

    breakdownSubtitle.textContent = `Detailed metrics evaluated for ${route.title}:`;

    metricsList.innerHTML = route.metrics.map((m) => `
      <div class="metric-row">
        <div class="metric-row__top">
          <span class="metric-row__name"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${ICONS[m.icon]}</svg> ${m.name}</span>
          <span class="metric-row__value">${m.value}%</span>
        </div>
        <div class="metric-bar"><div class="metric-bar__fill" style="width:${m.value}%"></div></div>
        <p class="metric-row__desc">${m.desc}</p>
      </div>
    `).join('');

    recommendationHeading.textContent = `Why ${route.title.split(' — ')[0]} ${route.recommended ? 'is strongly recommended' : 'may not be your safest option'}:`;
    startJourneyLabel.textContent = `Start Safe Journey on ${route.title.split(' — ')[0]}`;

    const destinationName = destinationInput.value.trim() || 'your destination';

    if (route.recommended) {
      choiceBadge.textContent = 'OPTIMAL CHOICE';
      choiceBadge.className = 'choice-badge';
      recommendationBody.textContent = `${route.title.split(' — ')[0]} is recommended for reaching ${destinationName} because it has significantly stronger safety signals while adding only a few minutes versus the fastest option. It passes through well-lit commercial areas with high foot traffic and stays near a police patrol zone.`;
    } else if (route.tier === 'low') {
      choiceBadge.textContent = 'LOWER SAFETY SCORE';
      choiceBadge.className = 'choice-badge tier-low';
      recommendationBody.textContent = `${route.title.split(' — ')[0]} is the fastest way to ${destinationName}, but it scores lower on lighting and activity than ${best.title.split(' — ')[0]}. If timing allows, ${best.title.split(' — ')[0]} offers meaningfully stronger safety coverage for a small time trade-off.`;
    } else {
      choiceBadge.textContent = 'MODERATE SAFETY';
      choiceBadge.className = 'choice-badge tier-mid';
      recommendationBody.textContent = `${route.title.split(' — ')[0]} balances travel time and safety on the way to ${destinationName}, with moderate lighting and activity throughout. For the strongest safety confidence, ${best.title.split(' — ')[0]} remains AI Guardian's top recommendation.`;
    }
  }

  // ---------- Calculate button: reveal step 2 ----------
  calculateBtn.addEventListener('click', () => {
    if (calculateBtn.disabled) return;
    renderRoutes();
    step2Block.classList.remove('hidden');
    step3Block.classList.add('hidden');
    selectedRouteId = null;
    setStepperState(2);
    step2Block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ---------- Start journey: navigate to Live Journey ----------
  document.getElementById('startJourneyBtn').addEventListener('click', () => {
    if (!selectedRouteId) return;
    window.location.href = 'livejourney.html?route=' + selectedRouteId
      + '&dest=' + encodeURIComponent(destinationInput.value.trim())
      + '&origin=' + encodeURIComponent(originInput.value.trim());
  });

  refreshCalculateState();
});
