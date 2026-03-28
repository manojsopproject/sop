/* ============================================================
   KisanMitra — pest.js
   Smart mock pest detection (filename + symptom keywords)
   ============================================================ */

let pestData = [];

async function loadPestData() {
  try {
    const res = await fetch('data/pests.json');
    pestData  = await res.json();
  } catch {}
}

function detectPest() {
  const fileInput = document.getElementById('pestInput');
  const symptomEl = document.getElementById('symptomText');
  const resultEl  = document.getElementById('pestResult');
  const btn       = document.getElementById('pestBtn');

  const file    = fileInput && fileInput.files[0];
  const symptom = symptomEl ? symptomEl.value.toLowerCase() : '';

  if (!file && !symptom.trim()) {
    showToast('Please upload an image or describe symptoms.', 'warning');
    return;
  }

  showSpinner(btn, 'Analysing…');
  resultEl.innerHTML = '';

  setTimeout(() => {
    const detected = runDetection(file, symptom);
    hideSpinner(btn);
    renderPestResult(detected, resultEl);
  }, 1500); /* simulate processing */
}

function runDetection(file, symptom) {
  const combined = ((file ? file.name : '') + ' ' + symptom).toLowerCase();

  /* 1. Try keyword match */
  const matched = pestData.find(p =>
    combined.includes(p.keyword.toLowerCase()) ||
    (p.name && combined.includes(p.name.toLowerCase().split(' ')[0]))
  );
  if (matched) return { ...matched, confidence: Math.floor(82 + Math.random() * 15) };

  /* 2. Symptom heuristics */
  if (/yellow|pale|chloro/.test(symptom))
    return pestData.find(p => p.keyword === 'aphid') || pestData[0];
  if (/hole|bor/.test(symptom))
    return pestData.find(p => p.keyword === 'borer') || pestData[3];
  if (/curl|wilt|droop/.test(symptom))
    return pestData.find(p => p.keyword === 'leaf curl') || pestData[5];
  if (/white|powder/.test(symptom))
    return pestData.find(p => p.keyword === 'powdery mildew') || pestData[9];
  if (/spot|lesion|burn/.test(symptom))
    return pestData.find(p => p.keyword === 'blast') || pestData[1];

  /* 3. Random with medium confidence */
  const random = pestData[Math.floor(Math.random() * pestData.length)];
  return { ...random, confidence: Math.floor(48 + Math.random() * 25) };
}

function renderPestResult(pest, container) {
  if (!pest) return;

  const conf      = pest.confidence || Math.floor(60 + Math.random() * 30);
  const confColor = conf > 80 ? 'var(--green-500)' : conf > 60 ? 'var(--gold)' : 'var(--terra-500)';
  const sevClass  = { 'Low': 'sev-low', 'Medium': 'sev-medium', 'High': 'sev-high', 'Very High': 'sev-very-high', 'Extreme': 'sev-extreme' };

  container.innerHTML = `
    <div class="pest-result-card">
      <div class="pest-result-header">
        <div>
          <div class="pest-result-name">${pest.name}</div>
          ${pest.nameHi ? `<div class="pest-result-hindi">${pest.nameHi}</div>` : ''}
          <div class="pest-meta">
            <span class="pest-type-badge">${pest.type}</span>
            <span class="${sevClass[pest.severity] || 'sev-medium'} sev-badge">${pest.severity} Severity</span>
          </div>
        </div>
        <div class="confidence-ring">
          <svg viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="25" fill="none" stroke="var(--cream-200)" stroke-width="6"/>
            <circle cx="30" cy="30" r="25" fill="none" stroke="${confColor}" stroke-width="6"
              stroke-dasharray="${2 * Math.PI * 25}" stroke-dashoffset="${2 * Math.PI * 25 * (1 - conf/100)}"
              stroke-linecap="round" transform="rotate(-90 30 30)"/>
          </svg>
          <div class="confidence-text" style="color:${confColor};">${conf}%</div>
        </div>
      </div>

      <div class="pest-section">
        <h4><i class="fas fa-eye"></i> Symptoms</h4>
        <p>${pest.symptoms}</p>
      </div>

      <div class="pest-section">
        <h4><i class="fas fa-syringe" style="color:var(--terra-500);"></i> Treatment</h4>
        <p>${pest.treatment}</p>
      </div>

      <div class="pest-section">
        <h4><i class="fas fa-shield-alt" style="color:var(--green-500);"></i> Prevention</h4>
        <p>${pest.prevention}</p>
      </div>

      ${pest.crops ? `
      <div class="pest-section">
        <h4><i class="fas fa-seedling"></i> Affected Crops</h4>
        <div class="pest-crop-tags">
          ${pest.crops.map(c => `<span class="crop-tag">${c}</span>`).join('')}
        </div>
      </div>` : ''}

      <div class="pest-action">
        <a href="https://www.agrifarming.in/pest-diseases" target="_blank" class="btn-outline-green">
          <i class="fas fa-external-link-alt"></i> More Info
        </a>
        <button onclick="window.print()" class="btn-outline-green">
          <i class="fas fa-print"></i> Print Report
        </button>
      </div>
    </div>
  `;

  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast(`Detected: ${pest.name} (${conf}% confidence)`, pest.severity === 'Extreme' ? 'error' : 'success');
}

function previewImage(input) {
  const preview = document.getElementById('imagePreview');
  if (!preview) return;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Plant photo" style="max-height:180px;border-radius:8px;object-fit:cover;width:100%;">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

document.addEventListener('DOMContentLoaded', loadPestData);
