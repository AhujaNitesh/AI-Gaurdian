/* ================================================================
   AI GUARDIAN — APP SHELL JS
   Unified: sidebar, topbar, SOS modal, notifications, toasts, user state
   ================================================================ */

(function () {
  'use strict';

  /* ── Icons ─────────────────────────────────────────────────── */
  const icons = {
    grid:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    compass:  `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    map:      `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
    radio:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.25a6 6 0 0 1 0-8.49M20.49 3.51a14 14 0 0 1 0 19.79M3.51 20.49a14 14 0 0 1 0-19.79"/></svg>`,
    users:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    network:  `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/><line x1="5" y1="19" x2="19" y2="19"/></svg>`,
    bell:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    clock:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    settings: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.31.35.6.62.82.27.23.6.38.94.44H21a2 2 0 0 1 0 4h-.09c-.34.06-.67.21-.94.44-.27.22-.48.51-.62.82Z"/></svg>`,
    shield:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12l2 2 4-4"/></svg>`,
    logout:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    sos:      `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><line x1="12" y1="9" x2="12" y2="12"/><circle cx="12" cy="15" r="0.5" fill="currentColor" stroke-width="0"/></svg>`,
    x:        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    menu:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    user:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  };

  /* ── Page Map ─────────────────────────────────────────────────── */
  const PAGE_PATHS = {
    dashboard:     'dashboard.html',
    saferoute:     'saferoute.html',
    safetymap:     'SafePlaces.html',
    livejourney:   'livejouney.html',
    safetycircle:  'safety-circle.html',
    guardiannet:   'guardian-network.html',
    history:       'journey-history.html',
    settings:      'settings.html',
  };

  /* ── Detect current page ──────────────────────────────────────── */
  function getCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    const file = path.split('/').pop().replace(/\?.*$/, '');
    if (file === 'dashboard.html' || file === '') return 'dashboard';
    if (file === 'saferoute.html') return 'saferoute';
    if (file === 'safeplaces.html') return 'safetymap';
    if (file === 'livejouney.html' || file === 'livejourney.html') return 'livejourney';
    if (file === 'safety-circle.html') return 'safetycircle';
    if (file === 'guardian-network.html') return 'guardiannet';
    if (file === 'journey-history.html') return 'history';
    if (file === 'settings.html') return 'settings';
    return '';
  }

  /* ── Build sidebar nav items ──────────────────────────────────── */
  const NAV_ITEMS = [
    { key: 'dashboard',    label: 'Dashboard',        icon: icons.grid },
    { key: 'saferoute',    label: 'Safe Route',       icon: icons.compass },
    { key: 'safetymap',    label: 'Safety Map',       icon: icons.map },
    { key: 'livejourney',  label: 'Live Journey',     icon: icons.radio },
    { key: 'safetycircle', label: 'Safety Circle',    icon: icons.users },
    { key: 'guardiannet',  label: 'Guardian Network', icon: icons.network },
    { key: 'history',      label: 'Journey History',  icon: icons.clock },
    { key: 'settings',     label: 'Settings',         icon: icons.settings },
  ];

  /* ── User State ───────────────────────────────────────────────── */
  function getUser() {
    try {
      const u = JSON.parse(localStorage.getItem('ag_user') || '{}');
      return {
        name:  u.name  || 'Priya Sharma',
        email: u.email || 'demo@guardian.ai',
        initials: (u.name || 'Priya Sharma').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2),
      };
    } catch { return { name: 'Priya Sharma', email: 'demo@guardian.ai', initials: 'PS' }; }
  }

  /* ── Notifications ────────────────────────────────────────────── */
  const NOTIF_KEY = 'ag_notifications_v2';
  function getNotifications() {
    try { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || getDefaultNotifs(); }
    catch { return getDefaultNotifs(); }
  }
  function getDefaultNotifs() {
    const now = Date.now();
    return [
      { id: 'n1', title: 'Welcome to AI Guardian 🛡️', body: 'Your women\'s safety companion is active and ready.', time: now - 120000, read: false },
      { id: 'n2', title: 'Safety Circle Active', body: '3 contacts in your circle are receiving live telemetry.', time: now - 360000, read: false },
      { id: 'n3', title: 'Optimal Route Ready', body: 'AI Guardian found a high-safety illuminated route for you.', time: now - 7200000, read: true },
    ];
  }
  function saveNotifications(notifs) {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  }
  function getUnreadCount() {
    return getNotifications().filter(n => !n.read).length;
  }
  function pushNotification(title, body) {
    const notifs = getNotifications();
    notifs.unshift({ id: 'n_' + Date.now(), title, body, time: Date.now(), read: false });
    saveNotifications(notifs.slice(0, 30));
    updateNotifBadge();
  }
  window.agPushNotif = pushNotification;

  /* ── Toast ────────────────────────────────────────────────────── */
  function showToast(msg, type = 'info') {
    let stack = document.getElementById('ag-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'ag-toast-stack';
      stack.className = 'ag-toast-stack';
      document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = 'ag-toast ' + type;
    t.textContent = msg;
    stack.appendChild(t);
    requestAnimationFrame(() => { t.classList.add('show'); });
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 250);
    }, 3500);
  }
  window.showGuardianToast = showToast;

  /* ── Inject Shell HTML ────────────────────────────────────────── */
  function injectShell() {
    // Avoid double injection
    if (document.getElementById('ag-sidebar')) return;

    const currentPage = getCurrentPage();
    const user = getUser();
    const unread = getUnreadCount();

    // Determine relative path prefix (all pages in /html/ subfolder)
    const isHtmlSubfolder = window.location.pathname.toLowerCase().includes('/html/');
    const prefix = isHtmlSubfolder ? '' : 'html/';
    const rootPrefix = isHtmlSubfolder ? '../' : '';

    function navHref(key) {
      return prefix + PAGE_PATHS[key];
    }

    // Build nav HTML
    const navHtml = NAV_ITEMS.map(item => {
      const active = item.key === currentPage ? 'active' : '';
      return `<a href="${navHref(item.key)}" class="sb-nav-item ${active}" data-key="${item.key}">${item.icon}<span>${item.label}</span></a>`;
    }).join('');

    const sidebarHtml = `
<aside class="ag-sidebar" id="ag-sidebar">
  <div class="sb-brand">
    <div class="sb-brand-mark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5V11C4 16.55 7.36 21.74 12 23C16.64 21.74 20 16.55 20 11V5L12 2Z" fill="white"/><path d="M10.2 12.6L9 11.4L7.8 12.6L10.2 15L16.2 9L15 7.8L10.2 12.6Z" fill="#E11D48"/></svg>
    </div>
    <div class="sb-brand-name">AI GUARDIAN <em>Women's Safety</em></div>
  </div>
  <div class="sb-label">Navigation</div>
  <nav class="sb-nav">${navHtml}
    <a href="#" class="sb-nav-item sos-item" id="ag-sos-trigger">
      ${icons.sos}<span>Emergency SOS</span>
    </a>
  </nav>
  <div class="sb-user" id="ag-sb-user">
    <div class="sb-user-avatar" id="ag-sb-avatar">${user.initials}</div>
    <div class="sb-user-info">
      <div class="sb-user-name" id="ag-sb-name">${user.name}</div>
      <div class="sb-user-email" id="ag-sb-email">${user.email}</div>
    </div>
    <button class="sb-logout-btn" id="ag-logout-btn" title="Sign out">${icons.logout}</button>
  </div>
</aside>
<div class="ag-sidebar-backdrop" id="ag-sidebar-backdrop"></div>`;

    const topbarHtml = `
<header class="ag-topbar" id="ag-topbar">
  <button class="tb-hamburger" id="ag-hamburger" aria-label="Open menu">${icons.menu}</button>
  <span class="tb-title" id="ag-topbar-title"></span>
  <div class="tb-spacer"></div>
  <div class="tb-live-badge">
    <span class="pulse"></span>
    <span>PROTECTED</span>
  </div>
  <button class="tb-sos-pill" id="ag-topbar-sos">
    ${icons.shield} SOS
  </button>
  <button class="tb-icon-btn" id="ag-notif-btn" aria-label="Notifications" title="Notifications">
    ${icons.bell}
    <span class="tb-notif-dot" id="ag-notif-dot" style="${unread > 0 ? '' : 'display:none;'}"></span>
  </button>
  <button class="tb-icon-btn" id="ag-profile-btn" aria-label="Profile" title="Settings">${icons.user}</button>
</header>`;

    const sosModalHtml = `
<div class="ag-sos-modal-overlay" id="ag-sos-overlay">
  <div class="ag-sos-modal">
    <div class="sos-ring">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="#E11D48"/></svg>
    </div>
    <h2>Confirm Emergency SOS</h2>
    <p>This will instantly broadcast your high-accuracy GPS coordinates, notify your Safety Circle, and initiate emergency recording.</p>
    <div class="sos-modal-actions">
      <button class="btn-cancel" id="ag-sos-cancel">Cancel</button>
      <button class="btn-confirm-sos" id="ag-sos-confirm">🚨 Activate SOS Now</button>
    </div>
  </div>
</div>`;

    const notifsHtml = `
<div class="ag-notif-drawer" id="ag-notif-drawer">
  <div class="nd-header">
    <h2>Notifications</h2>
    <button class="nd-close" id="ag-notif-close">${icons.x}</button>
  </div>
  <div class="nd-list" id="ag-notif-list"></div>
</div>`;

    // Target elements
    const mainContainer = document.querySelector('.ag-main');
    if (mainContainer) {
      mainContainer.insertAdjacentHTML('beforebegin', sidebarHtml);
      if (!mainContainer.querySelector('.ag-topbar')) {
        mainContainer.insertAdjacentHTML('afterbegin', topbarHtml);
      }
    } else {
      document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
    }

    document.body.insertAdjacentHTML('beforeend', sosModalHtml + notifsHtml + '<div class="ag-toast-stack" id="ag-toast-stack"></div>');

    // Page title
    const titleMap = {
      dashboard: '🛡️ Dashboard',
      saferoute: '🗺️ Safe Route Navigation',
      safetymap: '📍 Safety Map & Heatmap',
      livejourney: '📡 Live Journey Guardian',
      safetycircle: '👥 Safety Circle Contacts',
      guardiannet: '🤝 Guardian Network',
      history: '⏱️ Journey History',
      settings: '⚙️ Settings & Privacy',
    };
    const titleEl = document.getElementById('ag-topbar-title');
    if (titleEl && titleMap[currentPage]) titleEl.textContent = titleMap[currentPage];

    wireEvents();
  }

  /* ── Wire Events ──────────────────────────────────────────────── */
  function wireEvents() {
    const sidebar   = document.getElementById('ag-sidebar');
    const backdrop  = document.getElementById('ag-sidebar-backdrop');
    const hamburger = document.getElementById('ag-hamburger');
    const sosOverlay = document.getElementById('ag-sos-overlay');
    const sosTriggers = document.querySelectorAll('#ag-sos-trigger, #ag-topbar-sos');
    const sosCancel  = document.getElementById('ag-sos-cancel');
    const sosConfirm = document.getElementById('ag-sos-confirm');
    const notifBtn   = document.getElementById('ag-notif-btn');
    const notifClose = document.getElementById('ag-notif-close');
    const notifDrawer= document.getElementById('ag-notif-drawer');
    const logoutBtn  = document.getElementById('ag-logout-btn');

    // Toggle sidebar
    function openSidebar() {
      sidebar && sidebar.classList.add('open');
      backdrop && backdrop.classList.add('visible');
    }
    function closeSidebar() {
      sidebar && sidebar.classList.remove('open');
      backdrop && backdrop.classList.remove('visible');
    }
    hamburger && hamburger.addEventListener('click', () => {
      sidebar && (sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
    });
    backdrop && backdrop.addEventListener('click', closeSidebar);

    // SOS Modal
    function openSOS() { sosOverlay && sosOverlay.classList.add('open'); }
    function closeSOS() { sosOverlay && sosOverlay.classList.remove('open'); }
    sosTriggers.forEach(b => b && b.addEventListener('click', (e) => { e.preventDefault(); openSOS(); }));
    sosCancel  && sosCancel.addEventListener('click', closeSOS);
    sosOverlay && sosOverlay.addEventListener('click', (e) => { if (e.target === sosOverlay) closeSOS(); });
    sosConfirm && sosConfirm.addEventListener('click', () => {
      closeSOS();
      pushNotification('🚨 Emergency SOS Activated', 'Live location shared with your Safety Circle. Help is dispatched.');
      showToast('🚨 Emergency SOS activated! Your Safety Circle has been alerted.', 'danger');
    });

    // Notifications
    function openNotifDrawer() {
      renderNotifDrawer();
      notifDrawer && notifDrawer.classList.add('open');
      const notifs = getNotifications();
      notifs.forEach(n => n.read = true);
      saveNotifications(notifs);
      updateNotifBadge();
    }
    function closeNotifDrawer() {
      notifDrawer && notifDrawer.classList.remove('open');
    }
    notifBtn   && notifBtn.addEventListener('click', openNotifDrawer);
    notifClose && notifClose.addEventListener('click', closeNotifDrawer);

    // Logout
    logoutBtn && logoutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Sign out of AI Guardian?')) {
        localStorage.removeItem('ag_user');
        const isHtmlSubfolder = window.location.pathname.toLowerCase().includes('/html/');
        const rootPrefix = isHtmlSubfolder ? '../' : '';
        window.location.href = rootPrefix + 'html/Signin.html';
      }
    });

    // Profile / Settings button
    const profileBtn = document.getElementById('ag-profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        const isHtmlSubfolder = window.location.pathname.toLowerCase().includes('/html/');
        window.location.href = (isHtmlSubfolder ? '' : 'html/') + 'settings.html';
      });
    }

    // Close notifications drawer on document click
    document.addEventListener('click', (e) => {
      if (notifDrawer && notifDrawer.classList.contains('open')) {
        if (!notifDrawer.contains(e.target) && e.target !== notifBtn && !notifBtn.contains(e.target)) {
          closeNotifDrawer();
        }
      }
    });
  }

  /* ── Render Notifications ─────────────────────────────────────── */
  function renderNotifDrawer() {
    const list = document.getElementById('ag-notif-list');
    if (!list) return;
    const notifs = getNotifications();
    if (!notifs.length) {
      list.innerHTML = '<div class="nd-empty">No notifications right now.</div>';
      return;
    }
    list.innerHTML = notifs.map(n => `
      <div class="nd-item ${n.read ? '' : 'unread'}">
        <div class="nd-item-title">${escHtml(n.title)}</div>
        <div class="nd-item-body">${escHtml(n.body)}</div>
        <div class="nd-item-time">${timeAgo(n.time)}</div>
      </div>`).join('');
  }

  function updateNotifBadge() {
    const count = getUnreadCount();
    const dot = document.getElementById('ag-notif-dot');
    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
  }

  /* ── Helpers ──────────────────────────────────────────────────── */
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function timeAgo(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
    return Math.floor(diff/86400000) + 'd ago';
  }

  /* ── Init ─────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectShell);
  } else {
    injectShell();
  }

})();
