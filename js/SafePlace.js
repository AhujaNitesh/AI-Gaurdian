/* =============================================================
   AI GUARDIAN — Safety Map
   script.js

   This file is split into two halves on purpose:

   1. "BACKEND" — a small async, Promise-based data layer that
      currently reads/writes to localStorage as a stand-in for a
      real API. Every function returns a Promise and shapes its
      data the way a REST endpoint would, so swapping it out is a
      matter of replacing the function bodies with fetch() calls
      against your real service (see the TODO markers below).

   2. "APP" — DOM rendering + interaction logic that only talks to
      the data layer through the API object, never to localStorage
      directly. Nothing in this half needs to change when you wire
      up a real backend.
   ============================================================= */

(() => {
  "use strict";

  /* ===========================================================
     1. MOCK BACKEND — replace with real HTTP calls when ready
     =========================================================== */
  const API = (() => {
    const STORE_KEY = "aiguardian_places_v1";
    const NOTIF_KEY = "aiguardian_notifications_v1";
    const NETWORK_DELAY = 120; // ms — simulates round-trip latency

    const wait = (v) => new Promise((res) => setTimeout(() => res(v), NETWORK_DELAY));

    const readStore = () => {
      try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
      catch { return []; }
    };
    const writeStore = (arr) => localStorage.setItem(STORE_KEY, JSON.stringify(arr));

    const readNotifs = () => {
      try { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || []; }
      catch { return []; }
    };
    const writeNotifs = (arr) => localStorage.setItem(NOTIF_KEY, JSON.stringify(arr));

    // Deterministic pseudo-random generator so the same place
    // always gets the same "sensor" readings until real data
    // (a lighting API, crowd-density feed, incident reports…)
    // replaces this. Swap safetySignalFor() for a real fetch to
    // e.g. GET /api/safety-signals?lat=...&lng=...
    function seededRandom(seed) {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }
    function safetySignalFor(place) {
      const seed = [...place.id].reduce((a, c) => a + c.charCodeAt(0), 0);
      const lighting = Math.round(40 + seededRandom(seed) * 60);       // 40-100
      const activity = Math.round(30 + seededRandom(seed + 1) * 70);   // 30-100
      const reports = Math.floor(seededRandom(seed + 2) * 4);          // 0-3
      const haven = ["police", "hospital", "transit"].includes(place.category) || seededRandom(seed + 3) > 0.82;
      let riskBand = "safe";
      if (reports >= 2 || lighting < 45) riskBand = "danger";
      else if (lighting < 70 || activity < 45) riskBand = "moderate";
      return { lighting, activity, reports, haven, riskBand };
    }

    return {
      // GET /api/places
      async getPlaces() {
        const places = readStore().map((p) => ({ ...p, signal: safetySignalFor(p) }));
        return wait(places);
      },
      // POST /api/places
      async savePlace(place) {
        const all = readStore();
        const idx = all.findIndex((p) => p.id === place.id);
        if (idx >= 0) all[idx] = place; else all.push(place);
        writeStore(all);
        return wait({ ...place, signal: safetySignalFor(place) });
      },
      // DELETE /api/places/:id
      async deletePlace(id) {
        writeStore(readStore().filter((p) => p.id !== id));
        return wait({ ok: true });
      },
      // GET /api/notifications
      async getNotifications() {
        return wait(readNotifs());
      },
      // POST /api/notifications
      async pushNotification(notif) {
        const all = readNotifs();
        all.unshift(notif);
        writeNotifs(all.slice(0, 30));
        return wait(notif);
      },
      async markNotificationsRead() {
        const all = readNotifs().map((n) => ({ ...n, read: true }));
        writeNotifs(all);
        return wait({ ok: true });
      },
      // POST /api/sos  — TODO: point this at your real emergency endpoint
      async sendSOS(payload) {
        return wait({ ok: true, sentAt: Date.now(), ...payload });
      },
    };
  })();

  /* ===========================================================
     2. APP — rendering & interaction
     =========================================================== */

  const CATEGORY_META = {
    home:     { label: "Home",           icon: "🏠", color: "#e11d48", bg: "#ffe4ea" },
    work:     { label: "Work / Office",  icon: "💼", color: "#be123c", bg: "#ffe4ea" },
    college:  { label: "College/School", icon: "🎓", color: "#9333ea", bg: "#f6ecfe" },
    gym:      { label: "Gym",            icon: "🏋️", color: "#ec4899", bg: "#fdf2f8" },
    hospital: { label: "Hospital",       icon: "🏥", color: "#2563eb", bg: "#eaf1ff" },
    police:   { label: "Police station", icon: "🚓", color: "#2563eb", bg: "#eaf1ff" },
    cafe:     { label: "Café / Restaurant", icon: "☕", color: "#e8a317", bg: "#fff7e6" },
    transit:  { label: "Metro / Bus stop", icon: "🚉", color: "#2563eb", bg: "#eaf1ff" },
    other:    { label: "Other",          icon: "📍", color: "#584f5f", bg: "#f4f1f6" },
  };

  const LAYER_META = {
    lighting: { label: "Street lighting", color: "#16a34a" },
    activity: { label: "Activity density", color: "#e8a317" },
    reports:  { label: "Safety reports",   color: "#dc2626" },
    havens:   { label: "24/7 havens",      color: "#2563eb" },
  };

  const LEGEND_ITEMS = [
    { color: "#16a34a", label: "Well-lit street / safe zone" },
    { color: "#e8a317", label: "Moderate lighting / activity" },
    { color: "#dc2626", label: "Reported dark spot / caution" },
    { color: "#9333ea", label: "High foot-traffic area" },
    { color: "#2563eb", label: "24/7 haven (police / medical / transit)" },
  ];

  // ---- state -------------------------------------------------
  let places = [];
  let notifications = [];
  let activeLayers = new Set(Object.keys(LAYER_META));
  let pendingPin = null; // {x,y} percentage while add-modal open
  let editingId = null;

  // ---- element refs ------------------------------------------
  const $ = (sel) => document.querySelector(sel);
  const el = {
    statsGrid: $("#statsGrid"),
    layerToggles: $("#layerToggles"),
    mapCanvas: $("#mapCanvas"), mapViewport: $("#mapViewport"), mapGrid: $("#mapGrid"),
    mapEmpty: $("#mapEmpty"), emptyAddBtn: $("#emptyAddBtn"), mapSubline: $("#mapSubline"),
    mapHint: $("#mapHint"),
    legendPanel: $("#legendPanel"), legendList: $("#legendList"), legendToggle: $("#legendToggle"), legendClose: $("#legendClose"),
    placesList: $("#placesList"), placesCount: $("#placesCount"),
    overlay: $("#overlay"),
    placeModal: $("#placeModal"), placeForm: $("#placeForm"), placeModalTitle: $("#placeModalTitle"),
    placeId: $("#placeId"), placeX: $("#placeX"), placeY: $("#placeY"),
    placeName: $("#placeName"), placeCategory: $("#placeCategory"), placeNotes: $("#placeNotes"),
    placeDeleteBtn: $("#placeDeleteBtn"), placeCancelBtn: $("#placeCancelBtn"), placeModalClose: $("#placeModalClose"),
    addPlaceBtn: $("#addPlaceBtn"),
    markerPopover: $("#markerPopover"),
    sosModal: $("#sosModal"), sosCancelBtn: $("#sosCancelBtn"), sosConfirmBtn: $("#sosConfirmBtn"),
    // notifBtn/notifDot/notifCount are injected by app-shell; resolved lazily below
    searchInput: $("#searchInput"),
    toast: $("#toast"),
  };

  // ---- helpers -------------------------------------------------
  function uid() { return "p_" + Math.random().toString(36).slice(2, 10); }
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => (el.toast.hidden = true), 2400);
  }
  function openOverlayFor(modalEl) {
    el.overlay.hidden = false;
    modalEl.hidden = false;
  }
  function closeModals() {
    el.overlay.hidden = true;
    el.placeModal.hidden = true;
    el.sosModal.hidden = true;
    el.markerPopover.hidden = true;
  }

  /* ---------------- rendering: stats --------------------------- */
  function renderStats() {
    const total = places.length;
    const havens = places.filter((p) => p.signal.haven).length;
    const alerts = places.reduce((n, p) => n + p.signal.reports, 0);
    const avgLighting = total ? Math.round(places.reduce((s, p) => s + p.signal.lighting, 0) / total) : 0;

    const cards = [
      { label: "Places tracked", value: total, icon: "📍", accent: "#e11d48", accentBg: "#ffe4ea" },
      { label: "24/7 havens nearby", value: havens, icon: "🛡️", accent: "#2563eb", accentBg: "#eaf1ff" },
      { label: "Active safety reports", value: alerts, icon: "⚠️", accent: "#dc2626", accentBg: "#fdecec" },
      { label: "Avg. lighting coverage", value: total ? avgLighting + "%" : "—", icon: "💡", accent: "#16a34a", accentBg: "#eafaf0" },
    ];
    el.statsGrid.innerHTML = cards.map((c) => `
      <div class="stat-card" style="--accent:${c.accent};--accent-bg:${c.accentBg}">
        <div class="stat-card-top">
          <div class="stat-icon">${c.icon}</div>
        </div>
        <div class="stat-value">${c.value}</div>
        <div class="stat-label">${c.label}</div>
      </div>`).join("");
  }

  /* ---------------- rendering: layer toggle pills --------------- */
  function renderLayerToggles() {
    el.layerToggles.innerHTML = Object.entries(LAYER_META).map(([key, meta]) => {
      const count = key === "havens"
        ? places.filter((p) => p.signal.haven).length
        : key === "reports"
        ? places.reduce((n, p) => n + p.signal.reports, 0)
        : places.length;
      const on = activeLayers.has(key);
      return `<button type="button" class="layer-pill ${on ? "layer-pill--on" : ""}"
        style="--c:${meta.color};--c-bg:${meta.color}1a" data-layer="${key}">
        <span class="swatch"></span>${meta.label}<span class="count">${count}</span>
      </button>`;
    }).join("");
  }

  /* ---------------- rendering: legend ---------------------------- */
  function renderLegend() {
    el.legendList.innerHTML = LEGEND_ITEMS.map((i) =>
      `<li><span class="dot" style="background:${i.color}"></span>${i.label}</li>`).join("");
  }

  /* ---------------- rendering: map grid backdrop ------------------ */
  function renderGrid() {
    const w = 100, h = 100;
    let svg = `<defs><pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M10 0H0V10" fill="none" stroke="#ffe1ea" stroke-width="0.3"/>
    </pattern></defs>
    <rect width="${w}" height="${h}" fill="url(#gridPattern)"/>
    <path d="M0 78 Q 25 68 45 80 T 100 72" stroke="#eaf1ff" stroke-width="6" fill="none" opacity="0.7"/>`;
    el.mapGrid.setAttribute("viewBox", `0 0 ${w} ${h}`);
    el.mapGrid.innerHTML = svg;
  }

  /* ---------------- rendering: markers + auras -------------------- */
  function riskColor(band) {
    return band === "danger" ? "#dc2626" : band === "moderate" ? "#e8a317" : "#16a34a";
  }

  function renderMarkers() {
    // clear previous markers/auras but keep the base <svg> grid
    [...el.mapCanvas.querySelectorAll(".marker, .aura")].forEach((n) => n.remove());

    places.forEach((p) => {
      const meta = CATEGORY_META[p.category] || CATEGORY_META.other;

      // Lighting / activity aura (soft radial "safety zone")
      if (activeLayers.has("lighting")) {
        const aura = document.createElement("div");
        const size = 60 + p.signal.lighting * 0.9;
        aura.className = "aura";
        aura.style.cssText = `left:${p.x}%;top:${p.y}%;width:${size}px;height:${size}px;
          background:radial-gradient(circle, ${riskColor(p.signal.riskBand)}33 0%, transparent 72%);`;
        el.mapCanvas.appendChild(aura);
      }
      if (activeLayers.has("activity")) {
        const aura2 = document.createElement("div");
        const size2 = 40 + p.signal.activity * 0.7;
        aura2.className = "aura";
        aura2.style.cssText = `left:${p.x}%;top:${p.y}%;width:${size2}px;height:${size2}px;
          background:radial-gradient(circle, #93338033 0%, transparent 75%);`;
        el.mapCanvas.appendChild(aura2);
      }
      if (activeLayers.has("reports") && p.signal.reports > 0) {
        const aura3 = document.createElement("div");
        const size3 = 34 + p.signal.reports * 16;
        aura3.className = "aura";
        aura3.style.cssText = `left:${p.x}%;top:${p.y}%;width:${size3}px;height:${size3}px;
          background:radial-gradient(circle, #dc262640 0%, transparent 75%);`;
        el.mapCanvas.appendChild(aura3);
      }
      if (activeLayers.has("havens") && p.signal.haven) {
        const aura4 = document.createElement("div");
        aura4.className = "aura";
        aura4.style.cssText = `left:${p.x}%;top:${p.y}%;width:70px;height:70px;
          background:radial-gradient(circle, #2563eb2e 0%, transparent 75%);`;
        el.mapCanvas.appendChild(aura4);
      }

      const marker = document.createElement("div");
      marker.className = "marker";
      marker.style.cssText = `left:${p.x}%;top:${p.y}%;`;
      marker.innerHTML = `<div class="marker-pin" style="--c:${meta.color}"><span>${meta.icon}</span></div>
        <div class="marker-label">${escapeHtml(p.name)}</div>`;
      marker.addEventListener("click", (e) => { e.stopPropagation(); openMarkerPopover(p, marker); });
      el.mapCanvas.appendChild(marker);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------------- marker popover --------------------------------- */
  function openMarkerPopover(place, markerEl) {
    const meta = CATEGORY_META[place.category] || CATEGORY_META.other;
    const s = place.signal;
    const pop = el.markerPopover;
    pop.innerHTML = `
      <h4>${escapeHtml(place.name)}</h4>
      <span class="cat">${meta.icon} ${meta.label}</span>
      <div class="metric-row"><span>Lighting</span><b>${s.lighting}%</b></div>
      <div class="metric-row"><span>Activity</span><b>${s.activity}%</b></div>
      <div class="metric-row"><span>Open reports</span><b>${s.reports}</b></div>
      <div class="metric-row"><span>24/7 haven</span><b>${s.haven ? "Yes" : "No"}</b></div>
      ${place.notes ? `<p style="margin-top:8px;color:var(--ink-mute);font-size:.76rem;">${escapeHtml(place.notes)}</p>` : ""}
      <div class="popover-actions">
        <button type="button" class="btn btn-ghost" data-act="edit">Edit</button>
        <button type="button" class="btn btn-danger" data-act="delete">Remove</button>
      </div>`;

    const rect = markerEl.getBoundingClientRect();
    const parentRect = el.mapViewport.getBoundingClientRect();
    pop.style.left = Math.min(rect.left - parentRect.left, parentRect.width - 244) + "px";
    pop.style.top = Math.max(rect.top - parentRect.top - 10, 8) + "px";
    pop.hidden = false;

    pop.querySelector('[data-act="edit"]').onclick = () => { pop.hidden = true; openPlaceModal(place); };
    pop.querySelector('[data-act="delete"]').onclick = async () => {
      pop.hidden = true;
      await API.deletePlace(place.id);
      await pushNotif(`Removed "${place.name}" from your saved places.`);
      await refresh();
      showToast("Place removed");
    };
  }

  /* ---------------- places list card --------------------------------- */
  function renderPlacesList() {
    el.placesCount.textContent = places.length === 1 ? "1 place" : `${places.length} places`;
    if (!places.length) {
      el.placesList.innerHTML = `<p class="places-empty">You haven't added any places yet — tap the map above to add your first one.</p>`;
      return;
    }
    el.placesList.innerHTML = places.map((p) => {
      const meta = CATEGORY_META[p.category] || CATEGORY_META.other;
      const s = p.signal;
      return `<div class="place-card" data-id="${p.id}">
        <div class="place-card-icon" style="--c:${meta.color};--c-bg:${meta.bg}">${meta.icon}</div>
        <div class="place-card-body">
          <strong>${escapeHtml(p.name)}</strong>
          <span>Lighting ${s.lighting}% · Activity ${s.activity}%</span>
          <span class="place-card-tag" style="--c:${riskColor(s.riskBand)};--c-bg:${riskColor(s.riskBand)}1a">
            ${s.riskBand === "danger" ? "Needs caution" : s.riskBand === "moderate" ? "Moderate" : "Looks safe"}
          </span>
        </div>
      </div>`;
    }).join("");

    el.placesList.querySelectorAll(".place-card").forEach((card) => {
      card.addEventListener("click", () => {
        const p = places.find((x) => x.id === card.dataset.id);
        const markerEl = [...el.mapCanvas.querySelectorAll(".marker")].find((m) =>
          m.style.left === `${p.x}%` && m.style.top === `${p.y}%`);
        if (markerEl) openMarkerPopover(p, markerEl);
      });
    });
  }

  /* ---------------- empty state / subline ------------------------------ */
  function renderEmptyState() {
    el.mapEmpty.style.display = places.length ? "none" : "flex";
    el.mapSubline.textContent = places.length
      ? `Showing live signals around ${places.length} saved place${places.length > 1 ? "s" : ""}`
      : "No places added yet";
  }

  /* ---------------- user card ------------------------------------------ */
  // User card lives in the app-shell sidebar — no local render needed.

  /* ---------------- notifications --------------------------------------- */
  async function pushNotif(message) {
    const notif = { id: uid(), message, time: new Date().toISOString(), read: false };
    await API.pushNotification(notif);
    notifications = await API.getNotifications();
    renderNotifBadge();
  }
  function renderNotifBadge() {
    const unread = notifications.filter((n) => !n.read).length;
    // Badge elements are injected by app-shell.js — resolve lazily
    const countEl = document.getElementById("ag-notif-count");
    const dotEl   = document.getElementById("ag-notif-dot");
    if (countEl) countEl.textContent = unread;
    if (dotEl)   dotEl.hidden = unread === 0;
  }
  function renderNotifDrawer() {
    // Notification list is managed by app-shell; push items via the shared store
    // if a real backend is wired up. For now we keep the local badge only.
  }

  /* ---------------- master refresh -------------------------------------- */
  async function refresh() {
    places = await API.getPlaces();
    renderStats();
    renderLayerToggles();
    renderMarkers();
    renderPlacesList();
    renderEmptyState();
  }

  /* ===========================================================
     Interaction wiring
     =========================================================== */

  // Sidebar is managed by app-shell.js — no local wiring needed.

  // Layer toggles
  el.layerToggles.addEventListener("click", (e) => {
    const btn = e.target.closest(".layer-pill");
    if (!btn) return;
    const key = btn.dataset.layer;
    activeLayers.has(key) ? activeLayers.delete(key) : activeLayers.add(key);
    renderLayerToggles();
    renderMarkers();
  });

  // Legend
  el.legendToggle.addEventListener("click", () => { el.legendPanel.hidden = !el.legendPanel.hidden; });
  el.legendClose.addEventListener("click", () => { el.legendPanel.hidden = true; });

  // Map click -> add pin
  function handleMapClick(e) {
    if (e.target.closest(".marker") || e.target.closest(".popover")) return;
    const rect = el.mapCanvas.getBoundingClientRect();
    const x = Math.min(97, Math.max(3, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(95, Math.max(5, ((e.clientY - rect.top) / rect.height) * 100));
    pendingPin = { x, y };
    openPlaceModal(null, pendingPin);
  }
  el.mapCanvas.addEventListener("click", handleMapClick);
  el.emptyAddBtn.addEventListener("click", () => {
    el.mapHint.hidden = false;
    setTimeout(() => (el.mapHint.hidden = true), 3200);
  });
  el.addPlaceBtn.addEventListener("click", () => {
    el.mapHint.hidden = false;
    setTimeout(() => (el.mapHint.hidden = true), 3200);
  });

  // click elsewhere closes marker popover
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".popover") && !e.target.closest(".marker")) el.markerPopover.hidden = true;
  });

  /* ---------------- place modal (add/edit) --------------------------- */
  function openPlaceModal(place, coords) {
    editingId = place ? place.id : null;
    el.placeModalTitle.textContent = place ? "Edit place" : "Add a place";
    el.placeId.value = place ? place.id : "";
    el.placeX.value = place ? place.x : coords.x;
    el.placeY.value = place ? place.y : coords.y;
    el.placeName.value = place ? place.name : "";
    el.placeCategory.value = place ? place.category : "home";
    el.placeNotes.value = place ? (place.notes || "") : "";
    el.placeDeleteBtn.hidden = !place;
    openOverlayFor(el.placeModal);
    setTimeout(() => el.placeName.focus(), 50);
  }
  function closePlaceModal() { el.placeModal.hidden = true; el.overlay.hidden = true; pendingPin = null; }

  el.placeModalClose.addEventListener("click", closePlaceModal);
  el.placeCancelBtn.addEventListener("click", closePlaceModal);
  el.overlay.addEventListener("click", closeModals);

  el.placeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const place = {
      id: el.placeId.value || uid(),
      name: el.placeName.value.trim() || "Untitled place",
      category: el.placeCategory.value,
      x: parseFloat(el.placeX.value),
      y: parseFloat(el.placeY.value),
      notes: el.placeNotes.value.trim(),
      createdAt: new Date().toISOString(),
    };
    await API.savePlace(place);
    await pushNotif(editingId ? `Updated "${place.name}".` : `Safety layers calculated for "${place.name}".`);
    closePlaceModal();
    await refresh();
    showToast(editingId ? "Place updated" : "Place added");
  });

  el.placeDeleteBtn.addEventListener("click", async () => {
    if (!editingId) return;
    const p = places.find((x) => x.id === editingId);
    await API.deletePlace(editingId);
    await pushNotif(`Removed "${p ? p.name : "place"}" from your saved places.`);
    closePlaceModal();
    await refresh();
    showToast("Place removed");
  });

  /* ---------------- SOS flow ------------------------------------------- */
  function openSos() { if (el.sosModal) openOverlayFor(el.sosModal); }
  document.addEventListener("DOMContentLoaded", () => {
    const shellSosBtn = document.getElementById("ag-sos-btn");
    if (shellSosBtn) shellSosBtn.addEventListener("click", openSos);
  }, { once: true });
  if (el.sosCancelBtn) el.sosCancelBtn.addEventListener("click", closeModals);
  if (el.sosConfirmBtn) {
    el.sosConfirmBtn.addEventListener("click", async () => {
      el.sosConfirmBtn.textContent = "Sending…";
      el.sosConfirmBtn.disabled = true;
      await API.sendSOS({ note: "Manual SOS from safety map" });
      await pushNotif("SOS alert sent to your guardians with your current location.");
      closeModals();
      el.sosConfirmBtn.textContent = "Confirm SOS";
      el.sosConfirmBtn.disabled = false;
      showToast("SOS alert sent to your guardians");
    });
  }

  /* ---------------- notifications drawer --------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const shellNotifBtn = document.getElementById("ag-notif-btn");
    if (shellNotifBtn) {
      shellNotifBtn.addEventListener("click", async () => {
        await API.markNotificationsRead();
        notifications = notifications.map((n) => ({ ...n, read: true }));
        renderNotifBadge();
      });
    }
  }, { once: true });

  /* ---------------- search -------------------------------------------------- */
  if (el.searchInput) {
    el.searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll(".marker").forEach((m) => (m.style.opacity = "1"));
      document.querySelectorAll(".place-card").forEach((c) => (c.style.display = "flex"));
      if (!q) return;
      places.forEach((p) => {
        const match = p.name.toLowerCase().includes(q);
        const markerEl = [...el.mapCanvas.querySelectorAll(".marker")].find((m) =>
          m.style.left === `${p.x}%` && m.style.top === `${p.y}%`);
        if (markerEl) markerEl.style.opacity = match ? "1" : ".2";
        const card = el.placesList.querySelector(`[data-id="${p.id}"]`);
        if (card) card.style.display = match ? "flex" : "none";
      });
    });
  }

  /* ---------------- boot ------------------------------------------------------ */
  async function init() {
    renderGrid();
    renderLegend();
    notifications = await API.getNotifications();
    renderNotifBadge();
    await refresh();
    window.addEventListener("resize", () => {
      el.markerPopover.hidden = true;
    });
  }

  init();
})();