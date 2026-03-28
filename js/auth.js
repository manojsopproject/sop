/* ============================================================
   KisanMitra — auth.js
   Login / Register using localStorage + static users.json
   ============================================================ */

async function loginUser(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');
  const btn      = document.getElementById('loginBtn');

  errEl.style.display = 'none';

  if (!username || !password) {
    errEl.textContent = 'Please enter username and password.';
    errEl.style.display = 'block';
    return;
  }

  showSpinner(btn, 'Verifying…');

  try {
    /* Load registered users from localStorage (added by registration) */
    let users = [];
    try {
      const res   = await fetch('data/users.json');
      const seed  = await res.json();
      users = seed;
    } catch {}

    /* Also check localStorage-registered users */
    const localUsers = JSON.parse(localStorage.getItem('km_users') || '[]');
    users = [...users, ...localUsers];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      const session = {
        id:       user.id || Date.now(),
        username: user.username,
        name:     user.name || user.username,
        state:    user.state || '',
        soilType: user.soilType || '',
        primaryCrop: user.primaryCrop || '',
        landHolding: user.landHolding || '',
        phone:    user.phone || '',
      };
      localStorage.setItem('km_session', JSON.stringify(session));
      showToast(`Welcome back, ${session.name}! 🌾`, 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    } else {
      errEl.textContent = 'Invalid username or password. Try the demo accounts.';
      errEl.style.display = 'block';
      hideSpinner(btn);
    }
  } catch (err) {
    errEl.textContent = 'Error loading user data. Please try again.';
    errEl.style.display = 'block';
    hideSpinner(btn);
  }
}

async function registerUser(e) {
  e.preventDefault();
  const name     = document.getElementById('regName').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const phone    = document.getElementById('regPhone').value.trim();
  const state    = document.getElementById('regState').value;
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regConfirm').value;
  const errEl    = document.getElementById('regError');
  const btn      = document.getElementById('registerBtn');

  errEl.style.display = 'none';

  if (!name || !username || !state || !password) {
    errEl.textContent = 'Please fill in all required fields.';
    errEl.style.display = 'block'; return;
  }
  if (username.length < 4) {
    errEl.textContent = 'Username must be at least 4 characters.';
    errEl.style.display = 'block'; return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.style.display = 'block'; return;
  }
  if (password !== confirm) {
    errEl.textContent = 'Passwords do not match.';
    errEl.style.display = 'block'; return;
  }

  showSpinner(btn, 'Creating…');

  const localUsers = JSON.parse(localStorage.getItem('km_users') || '[]');
  if (localUsers.find(u => u.username === username)) {
    errEl.textContent = 'Username already taken. Please choose another.';
    errEl.style.display = 'block';
    hideSpinner(btn); return;
  }

  const newUser = {
    id: Date.now(), username, password, name, phone, state,
    soilType: '', primaryCrop: '', landHolding: '',
    memberSince: new Date().toISOString().split('T')[0]
  };

  localUsers.push(newUser);
  localStorage.setItem('km_users', JSON.stringify(localUsers));

  const session = { id: newUser.id, username, name, state };
  localStorage.setItem('km_session', JSON.stringify(session));

  showToast(`Account created! Welcome, ${name}! 🎉`, 'success');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
}
