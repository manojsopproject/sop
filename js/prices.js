/* ============================================================
   KisanMitra — prices.js
   Market prices from market_prices.json with filter/search
   ============================================================ */

let allPrices = [];

async function loadPrices() {
  const tbody  = document.getElementById('pricesTbody');
  const loader = document.getElementById('pricesLoader');

  try {
    const res  = await fetch('data/market_prices.json');
    allPrices  = await res.json();
    if (loader) loader.style.display = 'none';
    renderPrices(allPrices);
    renderPriceStats(allPrices);
  } catch (err) {
    if (loader) loader.innerHTML = '<p style="color:var(--terra-500)">Failed to load prices.</p>';
  }
}

function renderPrices(data) {
  const tbody = document.getElementById('pricesTbody');
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:2rem;color:var(--text-500);">No crops match your search.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => {
    const trendIcon  = p.trend === 'up'   ? '▲' : p.trend === 'down' ? '▼' : '—';
    const trendClass = p.trend === 'up'   ? 'trend-up' : p.trend === 'down' ? 'trend-down' : 'trend-stable';
    const changeSign = p.change > 0       ? '+' : '';

    return `<tr>
      <td>
        <div style="font-weight:600;color:var(--green-800);">${p.crop}</div>
        <div style="font-size:0.75rem;color:var(--text-500);">${p.category}</div>
      </td>
      <td style="font-weight:700;font-size:1rem;color:var(--green-700);">${formatINR(p.price)}<span style="font-size:0.7rem;color:var(--text-500);font-weight:400;"> /${p.unit.split(' ').pop()}</span></td>
      <td style="color:var(--text-500);font-size:0.88rem;">${p.state}</td>
      <td>
        <span class="price-category-badge">${p.category}</span>
      </td>
      <td>
        <span class="${trendClass} trend-badge">
          ${trendIcon} ${changeSign}${p.change}%
        </span>
      </td>
    </tr>`;
  }).join('');
}

function renderPriceStats(data) {
  const statsEl = document.getElementById('priceStats');
  if (!statsEl) return;

  const gainers  = data.filter(p => p.trend === 'up').sort((a,b) => b.change - a.change).slice(0,3);
  const losers   = data.filter(p => p.trend === 'down').sort((a,b) => a.change - b.change).slice(0,3);

  statsEl.innerHTML = `
    <div class="price-stat-card">
      <h4><i class="fas fa-arrow-trend-up" style="color:var(--green-500);"></i> Top Gainers</h4>
      ${gainers.map(p => `
        <div class="stat-row">
          <span>${p.crop}</span>
          <span class="trend-up">+${p.change}%</span>
        </div>`).join('')}
    </div>
    <div class="price-stat-card">
      <h4><i class="fas fa-arrow-trend-down" style="color:var(--terra-500);"></i> Top Losers</h4>
      ${losers.map(p => `
        <div class="stat-row">
          <span>${p.crop}</span>
          <span class="trend-down">${p.change}%</span>
        </div>`).join('')}
    </div>
  `;
}

function filterPrices() {
  const search   = (document.getElementById('priceSearch').value || '').toLowerCase();
  const category = (document.getElementById('categoryFilter').value || '').toLowerCase();
  const trend    = (document.getElementById('trendFilter').value || '').toLowerCase();

  const filtered = allPrices.filter(p => {
    const matchSearch   = !search   || p.crop.toLowerCase().includes(search) || p.state.toLowerCase().includes(search);
    const matchCategory = !category || p.category.toLowerCase() === category;
    const matchTrend    = !trend    || p.trend === trend;
    return matchSearch && matchCategory && matchTrend;
  });

  renderPrices(filtered);
}

document.addEventListener('DOMContentLoaded', loadPrices);
