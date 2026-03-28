# 🌾 KisanMitra — Smart Farmer Web App

A production-ready, competition-level static farmer support web application for Indian farmers.

## ✅ Features

| Feature | Status |
|---------|--------|
| Login / Register (localStorage) | ✅ Complete |
| Dashboard with stats & news | ✅ Complete |
| Crop Advisor (soil + season rules) | ✅ Complete |
| Market Prices (23 crops, filter/search) | ✅ Complete |
| Pest & Disease Detection (mock AI) | ✅ Complete |
| Weather (OpenWeatherMap API) | ✅ Complete |
| Government Schemes (8 schemes) | ✅ Complete |
| Hindi/English multilingual toggle | ✅ Complete |
| Voice commands (Web Speech API) | ✅ Complete |
| Mobile-responsive design | ✅ Complete |
| Railway deployment ready | ✅ Complete |

## 🗂 Folder Structure

```
kisanmitra/
├── index.html          ← Login/Register
├── dashboard.html      ← Main dashboard
├── crops.html          ← Crop Advisor
├── prices.html         ← Market Prices
├── pest.html           ← Pest Detection
├── schemes.html        ← Gov Schemes
├── weather.html        ← Weather page
├── profile.html        ← User Profile
├── css/
│   └── styles.css      ← Full design system
├── js/
│   ├── auth.js         ← Login/Register logic
│   ├── common.js       ← Shared utilities (toast, session)
│   ├── crops.js        ← Crop recommendation
│   ├── i18n.js         ← Hindi/English translations
│   ├── pest.js         ← Pest detection logic
│   ├── prices.js       ← Market prices display
│   ├── schemes.js      ← Government schemes
│   ├── voice.js        ← Web Speech API
│   └── weather.js      ← OpenWeatherMap integration
├── data/
│   ├── users.json      ← Demo user accounts
│   ├── crops.json      ← Soil/season crop rules
│   ├── market_prices.json ← 23 crop prices
│   ├── pests.json      ← 15 pest profiles
│   └── schemes.json    ← 8 government schemes
├── Dockerfile          ← Railway deployment
├── nginx.conf          ← Nginx config
└── README.md
```

## 🚀 Railway Deployment (Step-by-Step)

### Method 1: GitHub + Railway Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "KisanMitra v1 - production ready"
   git remote add origin https://github.com/YOUR_USERNAME/kisanmitra.git
   git push -u origin main
   ```

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app) → New Project
   - Select **Deploy from GitHub repo**
   - Choose your `kisanmitra` repo
   - Railway auto-detects the `Dockerfile` and builds

3. **Verify Deployment**
   - Railway shows build logs in real-time
   - Once deployed, click **Generate Domain** to get your URL
   - Visit `https://your-app.up.railway.app`

### Method 2: Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway domain
```

## 🔑 Demo Accounts

| Username | Password | Profile |
|----------|----------|---------|
| farmer1 | pass123 | Ramu Patel, Maharashtra, Cotton |
| sunita | sunita123 | Sunita Devi, UP, Wheat |
| admin | admin123 | Admin account |

## 🌤 Weather API

Uses **OpenWeatherMap** free tier (2,000,000 calls/month).
- The demo key in `weather.js` is a public demo key.
- For production, get your own key at [openweathermap.org](https://openweathermap.org/api)
- Replace `OWM_KEY` in `js/weather.js` with your key.

## 🐛 Common Deployment Issues

| Issue | Fix |
|-------|-----|
| Blank page on Railway | Ensure `index.html` is at root (not in subfolder) |
| CSS/JS not loading | Check paths are relative (`css/styles.css`, `js/auth.js`) |
| Weather not working | OpenWeatherMap CORS is allowed — check your API key |
| `$PORT` not set | Railway auto-sets PORT; the Dockerfile handles it via envsubst |
| 404 on page refresh | The `try_files` in nginx.conf handles SPA-style routing |

## 📱 Voice Commands

Say these commands after clicking the microphone button:

| English | Hindi | Action |
|---------|-------|--------|
| "weather in Delhi" | "दिल्ली का मौसम" | Load weather |
| "crop advice" | "फसल सलाह" | Go to Crop Advisor |
| "market prices" | "मंडी भाव" | Go to Prices |
| "pest check" | "कीट जाँच" | Go to Pest Checker |
| "government schemes" | "सरकारी योजनाएँ" | Go to Schemes |

## 📊 Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — Zero dependencies
- **Bootstrap-free** — Custom design system in `css/styles.css`
- **Fonts** — Rajdhani + Hind (Google Fonts, India-designed)
- **Icons** — Font Awesome 6.5
- **Weather** — OpenWeatherMap API (free tier)
- **Deployment** — Docker + Nginx on Railway
