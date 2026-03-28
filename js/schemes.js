/* ============================================================
   KisanMitra — schemes.js
   Government schemes display from schemes.json
   ============================================================ */

async function loadSchemes() {
  const container = document.getElementById('schemesContainer');
  try {
    const res     = await fetch('data/schemes.json');
    const schemes = await res.json();
    renderSchemes(schemes, container);
  } catch {
    if (container) container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load schemes data.</p></div>`;
  }
}

function renderSchemes(schemes, container) {
  if (!container) return;
  container.innerHTML = schemes.map((s, i) => `
    <div class="scheme-card" style="--accent:${s.color || 'var(--green-500)'};animation-delay:${i*0.08}s">
      <div class="scheme-header">
        <div class="scheme-icon-wrap" style="background:${s.color || 'var(--green-500)'}22;">
          <i class="fas ${s.icon || 'fa-scroll'}" style="color:${s.color || 'var(--green-500)'};"></i>
        </div>
        <div>
          <div class="scheme-name">${s.name}</div>
          <div class="scheme-full-name">${s.fullName}</div>
          ${s.nameHi ? `<div class="scheme-hindi">${s.nameHi}</div>` : ''}
        </div>
        <span class="scheme-tag" style="background:${s.color || 'var(--green-500)'}22;color:${s.color || 'var(--green-500)'};">${s.tag || s.category}</span>
      </div>

      <div class="scheme-benefit">
        <i class="fas fa-gift" style="color:${s.color || 'var(--green-500)'};"></i>
        <span>${s.benefit}</span>
      </div>

      <details class="scheme-details">
        <summary>
          <i class="fas fa-chevron-down"></i>
          <span data-i18n="scheme.apply">How to Apply & Eligibility</span>
        </summary>
        <div class="scheme-details-body">
          <div class="scheme-section">
            <h5><i class="fas fa-user-check"></i> Eligibility</h5>
            <p>${s.eligibility}</p>
          </div>
          <div class="scheme-section">
            <h5><i class="fas fa-file-alt" data-i18n="scheme.docs"></i> Documents Needed</h5>
            <ul>
              ${s.documents.map(d => `<li><i class="fas fa-check" style="color:var(--green-500);margin-right:6px;"></i>${d}</li>`).join('')}
            </ul>
          </div>
          <div class="scheme-section">
            <h5><i class="fas fa-map-marker-alt"></i> How to Apply</h5>
            <p>${s.howToApply}</p>
          </div>
        </div>
      </details>

      <div class="scheme-footer">
        <a href="${s.link}" target="_blank" rel="noopener" class="btn-scheme-apply" style="background:${s.color || 'var(--green-500)'};">
          <i class="fas fa-external-link-alt"></i>
          <span data-i18n="scheme.visit">Visit Official Site</span>
        </a>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadSchemes);
