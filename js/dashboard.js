/* ================================================================
   AI GUARDIAN — DASHBOARD LOGIC
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Load user name
  try {
    const user = JSON.parse(localStorage.getItem('ag_user') || '{}');
    if (user.name) {
      const firstName = user.name.split(' ')[0];
      const nameEl = document.getElementById('dashUserName');
      if (nameEl) nameEl.textContent = firstName;
    }
  } catch (e) {}

  // Load saved places count
  try {
    const places = JSON.parse(localStorage.getItem('ag_guardian_places_v1') || '[]');
    const placesCountEl = document.getElementById('dashPlacesCount');
    if (placesCountEl) {
      placesCountEl.textContent = places.length > 0 ? places.length : '2';
    }
  } catch (e) {}

  // Rotate Safety Tips based on day
  const TIPS = [
    '"When walking alone after dusk, keep your headphones in ambient transparency mode and share your live route with your Safety Circle."',
    '"Choose well-lit commercial streets over short-cut alleyways. AI Guardian routes are scored specifically for lighting coverage."',
    '"If you ever feel uncomfortable or followed, tap Emergency SOS in the top bar to immediately alert your guardians and sound the alarm."',
    '"You can add verified safe havens—like 24/7 pharmacies and police stations—to your Safety Map for quick refuge along any path."',
    '"Remember to keep your battery above 20% before starting long commutes, and enable auto-checkin in Settings."',
    '"Your location is end-to-end encrypted and only transmitted to your designated Safety Circle contacts during active journeys."',
    '"Trust your intuition. If a route feels unsafe even with good lighting, take an alternate AI-evaluated commercial path."'
  ];

  const tipIndex = new Date().getDay() % TIPS.length;
  const tipEl = document.getElementById('dailyTipText');
  if (tipEl) tipEl.textContent = TIPS[tipIndex];
});
