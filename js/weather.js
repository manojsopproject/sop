/* ============================================================
   KisanMitra — weather.js
   OpenWeatherMap integration + farming advisory
   ============================================================ */

const OWM_KEY = '4ec17c3a4f2c45660392276c2b20d69f'; // demo public key — replace with your own

const FARMING_TIPS = {
  Clear:       { en: 'Great day for field work and spraying.', hi: 'खेत का काम और छिड़काव के लिए अच्छा दिन।' },
  Clouds:      { en: 'Mild conditions — ideal for transplanting seedlings.', hi: 'हल्का मौसम — पौध रोपाई के लिए उत्तम।' },
  Rain:        { en: 'Hold off pesticide spraying. Check for waterlogging.', hi: 'कीटनाशक छिड़काव न करें। जलभराव की जाँच करें।' },
  Drizzle:     { en: 'Light rain — good for germination, avoid heavy machinery.', hi: 'हल्की बारिश — अंकुरण के लिए अच्छी।' },
  Thunderstorm:{ en: 'Stay indoors. Secure equipment and crops.', hi: 'घर के अंदर रहें। उपकरण और फसल सुरक्षित करें।' },
  Snow:        { en: 'Frost warning — protect sensitive crops with mulch.', hi: 'पाले की चेतावनी — नाज़ुक फसलें मल्च से ढकें।' },
  Mist:        { en: 'Watch for fungal diseases in humid conditions.', hi: 'नमी में फफूंदी रोगों पर नज़र रखें।' },
  Haze:        { en: 'Reduce irrigation; haze often precedes dry spells.', hi: 'सिंचाई कम करें; धुंध अक्सर सूखे से पहले आती है।' },
};

async function getWeather(cityOverride) {
  const input   = document.getElementById('weatherCity');
  const resultEl= document.getElementById('weatherResult');
  const btn     = document.getElementById('weatherBtn');
  const city    = cityOverride || (input && input.value.trim());

  if (!city) { showToast('Please enter a city name.', 'warning'); return; }

  if (btn) showSpinner(btn, '…');

  try {
    const url  = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric`;
    const res  = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) throw new Error(data.message || 'City not found');

    renderWeather(data, resultEl);
    if (btn) hideSpinner(btn);
  } catch (err) {
    if (resultEl) resultEl.innerHTML = `
      <div class="weather-error">
        <i class="fas fa-cloud-slash" style="font-size:2rem;color:var(--terra-500);"></i>
        <p style="margin-top:8px;color:var(--terra-500);">Could not fetch weather: ${err.message}.<br>
        <small>Check city name or try again later.</small></p>
      </div>`;
    if (btn) hideSpinner(btn);
  }
}

function renderWeather(data, container) {
  if (!container) return;
  const main      = data.weather[0].main;
  const desc      = data.weather[0].description;
  const temp      = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity  = data.main.humidity;
  const wind      = (data.wind.speed * 3.6).toFixed(1); // km/h
  const icon      = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const tip       = FARMING_TIPS[main] || { en: 'Monitor crop conditions closely.', hi: 'फसल की स्थिति पर ध्यान दें।' };

  const bgColors = {
    Clear: 'linear-gradient(135deg,#f9c74f,#f8961e)',
    Clouds: 'linear-gradient(135deg,#b8c1cc,#768390)',
    Rain: 'linear-gradient(135deg,#4895ef,#3a0ca3)',
    Thunderstorm: 'linear-gradient(135deg,#560bad,#3a0ca3)',
    Snow: 'linear-gradient(135deg,#caf0f8,#90e0ef)',
    Drizzle: 'linear-gradient(135deg,#74c0fc,#4895ef)',
  };
  const bg = bgColors[main] || 'linear-gradient(135deg,var(--green-600),var(--green-800))';

  container.innerHTML = `
    <div class="weather-card" style="background:${bg};">
      <div class="weather-main">
        <div>
          <div class="weather-city">${data.name}, ${data.sys.country}</div>
          <div class="weather-temp">${temp}°C</div>
          <div class="weather-desc">${desc.charAt(0).toUpperCase()+desc.slice(1)}</div>
        </div>
        <img src="${icon}" alt="${desc}" class="weather-icon" />
      </div>
      <div class="weather-stats">
        <div class="weather-stat"><i class="fas fa-thermometer-half"></i>Feels ${feelsLike}°C</div>
        <div class="weather-stat"><i class="fas fa-tint"></i>${humidity}% Humidity</div>
        <div class="weather-stat"><i class="fas fa-wind"></i>${wind} km/h Wind</div>
      </div>
    </div>
    <div class="weather-advisory">
      <i class="fas fa-leaf" style="color:var(--green-500);"></i>
      <span><strong>Farming Tip:</strong> ${currentLang === 'hi' ? tip.hi : tip.en}</span>
    </div>
  `;

  /* Also update dashboard mini-widget if present */
  const mini = document.getElementById('dashWeatherMini');
  if (mini) {
    mini.innerHTML = `
      <img src="${icon}" alt="${desc}" style="width:50px;">
      <div>
        <div style="font-size:1.8rem;font-weight:700;color:var(--green-800);">${temp}°C</div>
        <div style="color:var(--text-500);font-size:0.85rem;">${data.name} · ${desc}</div>
      </div>`;
  }
}

function getWeatherByLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported.', 'warning'); return; }
  const btn = document.getElementById('weatherBtn');
  if (btn) showSpinner(btn, 'Locating…');
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude: lat, longitude: lon } = pos.coords;
      const url  = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      const input = document.getElementById('weatherCity');
      if (input) input.value = data.name;
      renderWeather(data, document.getElementById('weatherResult'));
      if (btn) hideSpinner(btn);
    } catch (err) {
      showToast('Could not fetch weather by location.', 'error');
      if (btn) hideSpinner(btn);
    }
  }, () => {
    showToast('Location access denied.', 'warning');
    if (btn) hideSpinner(btn);
  });
}
