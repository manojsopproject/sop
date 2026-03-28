/* ============================================================
   KisanMitra — crops.js
   Rule-based crop recommendation from crops.json
   ============================================================ */

const CROP_ICONS = {
  Rice:'🌾', Wheat:'🌾', Maize:'🌽', Cotton:'🌿', Sugarcane:'🎋',
  Potato:'🥔', Onion:'🧅', Tomato:'🍅', Groundnut:'🥜', Soybean:'🫘',
  Mustard:'🌻', Sunflower:'🌻', Bajra:'🌾', Jowar:'🌾', Ragi:'🌾',
  Chickpea:'🫘', Arhar:'🫘', Moong:'🫘', Urad:'🫘', Lentil:'🫘',
  Jute:'🌿', Barley:'🌾', Gram:'🫘', Cowpea:'🫘', Watermelon:'🍉',
  Cucumber:'🥒', Pumpkin:'🎃', Brinjal:'🍆', Okra:'🫑',
};

function getCropIcon(name) {
  for (const [k, v] of Object.entries(CROP_ICONS)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '🌱';
}

async function recommendCrops(e) {
  if (e) e.preventDefault();

  const soil   = document.getElementById('soilType').value;
  const season = document.getElementById('season').value;
  const resEl  = document.getElementById('cropResult');
  const btn    = document.getElementById('cropBtn');

  if (!soil || !season) {
    showToast('Please select soil type and season.', 'warning'); return;
  }

  showSpinner(btn, 'Analysing…');
  resEl.innerHTML = '';

  try {
    const res  = await fetch('data/crops.json');
    const data = await res.json();

    const entry = data[soil] && data[soil][season];
    hideSpinner(btn);

    if (!entry) {
      resEl.innerHTML = `<div class="empty-state"><i class="fas fa-seedling"></i><p>No data found for this combination.</p></div>`;
      return;
    }

    const { crops, tip } = entry;

    resEl.innerHTML = `
      <div class="crop-tip-banner">
        <i class="fas fa-lightbulb"></i>
        <span>${tip}</span>
      </div>
      <div class="crop-grid">
        ${crops.map((c, i) => `
          <div class="crop-card" style="animation-delay:${i * 0.07}s">
            <div class="crop-emoji">${getCropIcon(c)}</div>
            <div class="crop-name">${c}</div>
            <div class="crop-badge">${season}</div>
          </div>`).join('')}
      </div>
    `;

    resEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast(`Found ${crops.length} crops for ${soil} soil in ${season} season!`, 'success');

  } catch (err) {
    hideSpinner(btn);
    resEl.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Error loading crop data.</p></div>`;
  }
}

/* Pre-fill from user profile */
document.addEventListener('DOMContentLoaded', () => {
  const session = getSession && getSession();
  if (session && session.soilType) {
    const el = document.getElementById('soilType');
    if (el) el.value = session.soilType;
  }
});
