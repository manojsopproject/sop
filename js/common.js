/* ============================================================
   KisanMitra — common.js
   Shared utilities used across all pages
   ============================================================ */

/* ── Toast Notifications ───────────────────────────────── */
function showToast(msg, type = 'success', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ── Auth Helpers ───────────────────────────────────────── */
function getSession() {
  try { return JSON.parse(localStorage.getItem('km_session')) || null; }
  catch { return null; }
}

function requireAuth() {
  if (!getSession()) { window.location.href = 'index.html'; return false; }
  return true;
}

function logout() {
  localStorage.removeItem('km_session');
  window.location.href = 'index.html';
}

/* ── Navbar Active State ────────────────────────────────── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}

/* ── Navbar User Info ───────────────────────────────────── */
function renderNavUser() {
  const session = getSession();
  const el = document.getElementById('navUserName');
  if (el && session) el.textContent = session.name || session.username;
}

/* ── Greeting by time ───────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (currentLang === 'hi') {
    if (h < 12) return 'सुप्रभात';
    if (h < 17) return 'नमस्कार';
    return 'शुभ संध्या';
  }
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/* ── Number formatter ───────────────────────────────────── */
function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

/* ── Spinner helpers ────────────────────────────────────── */
function showSpinner(btnEl, text = 'Loading…') {
  btnEl._origHTML = btnEl.innerHTML;
  btnEl.disabled = true;
  btnEl.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}
function hideSpinner(btnEl) {
  btnEl.disabled = false;
  btnEl.innerHTML = btnEl._origHTML || btnEl.innerHTML;
}

/* ── Tab switching utility ──────────────────────────────── */
function switchTab(tabId) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form-panel').forEach(p => p.classList.remove('active'));
  const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
  const panel  = document.getElementById(`panel-${tabId}`);
  if (tabBtn) tabBtn.classList.add('active');
  if (panel)  panel.classList.add('active');
}

function fillDemo(u, p) {
  const uEl = document.getElementById('loginUsername');
  const pEl = document.getElementById('loginPassword');
  if (uEl) uEl.value = u;
  if (pEl) pEl.value = p;
}

/* ── On DOM ready ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  renderNavUser();
});
