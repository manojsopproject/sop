/* ============================================================
   KisanMitra — i18n (Internationalisation)
   Supports: English (en) | Hindi (hi)
   ============================================================ */

const I18N = {
  en: {
    /* ── Nav ── */
    'nav.dashboard':  'Dashboard',
    'nav.crops':      'Crop Advisor',
    'nav.prices':     'Market Prices',
    'nav.pest':       'Pest Check',
    'nav.schemes':    'Schemes',
    'nav.profile':    'Profile',
    'nav.logout':     'Logout',

    /* ── Auth ── */
    'auth.username':  'Username',
    'auth.password':  'Password',
    'auth.name':      'Full Name',
    'auth.phone':     'Phone',
    'auth.state':     'State',
    'auth.login.btn': 'Login to KisanMitra',
    'auth.reg.btn':   'Create Account',

    /* ── Dashboard ── */
    'dash.greeting':  'Good Morning',
    'dash.welcome':   'Welcome back',
    'dash.weather.title': 'Today\'s Weather',
    'dash.quick':     'Quick Actions',

    /* ── Crop ── */
    'crop.title':     'Crop Advisor',
    'crop.soil':      'Soil Type',
    'crop.season':    'Season',
    'crop.btn':       'Get Recommendations',
    'crop.result':    'Recommended Crops',

    /* ── Prices ── */
    'price.title':    'Market Prices (Mandi)',
    'price.search':   'Search crop…',
    'price.crop':     'Crop',
    'price.price':    'Price (₹)',
    'price.state':    'State',
    'price.trend':    'Trend',

    /* ── Pest ── */
    'pest.title':     'Pest & Disease Checker',
    'pest.upload':    'Upload Plant Photo',
    'pest.btn':       'Analyse',
    'pest.or':        'or describe symptoms',
    'pest.symptom.ph':'e.g. yellow leaves, holes in stem…',

    /* ── Schemes ── */
    'scheme.title':   'Government Schemes',
    'scheme.apply':   'How to Apply',
    'scheme.docs':    'Documents Needed',
    'scheme.visit':   'Visit Official Site',

    /* ── Weather ── */
    'weather.title':  'Weather Advisory',
    'weather.city':   'Enter city name…',
    'weather.btn':    'Get Weather',

    /* ── Profile ── */
    'profile.title':  'My Profile',
    'profile.logout': 'Logout',
  },

  hi: {
    /* ── Nav ── */
    'nav.dashboard':  'डैशबोर्ड',
    'nav.crops':      'फसल सलाहकार',
    'nav.prices':     'बाज़ार भाव',
    'nav.pest':       'कीट जाँच',
    'nav.schemes':    'सरकारी योजनाएँ',
    'nav.profile':    'प्रोफ़ाइल',
    'nav.logout':     'लॉग आउट',

    /* ── Auth ── */
    'auth.username':  'उपयोगकर्ता नाम',
    'auth.password':  'पासवर्ड',
    'auth.name':      'पूरा नाम',
    'auth.phone':     'फ़ोन',
    'auth.state':     'राज्य',
    'auth.login.btn': 'लॉगिन करें',
    'auth.reg.btn':   'खाता बनाएँ',

    /* ── Dashboard ── */
    'dash.greeting':  'नमस्कार',
    'dash.welcome':   'स्वागत है',
    'dash.weather.title': 'आज का मौसम',
    'dash.quick':     'त्वरित विकल्प',

    /* ── Crop ── */
    'crop.title':     'फसल सलाहकार',
    'crop.soil':      'मिट्टी का प्रकार',
    'crop.season':    'मौसम',
    'crop.btn':       'सिफ़ारिश पाएँ',
    'crop.result':    'अनुशंसित फसलें',

    /* ── Prices ── */
    'price.title':    'मंडी भाव',
    'price.search':   'फसल खोजें…',
    'price.crop':     'फसल',
    'price.price':    'भाव (₹)',
    'price.state':    'राज्य',
    'price.trend':    'रुझान',

    /* ── Pest ── */
    'pest.title':     'कीट एवं रोग जाँच',
    'pest.upload':    'पौधे की फ़ोटो अपलोड करें',
    'pest.btn':       'विश्लेषण करें',
    'pest.or':        'या लक्षण बताएँ',
    'pest.symptom.ph':'जैसे: पीली पत्तियाँ, तने में छेद…',

    /* ── Schemes ── */
    'scheme.title':   'सरकारी योजनाएँ',
    'scheme.apply':   'कैसे आवेदन करें',
    'scheme.docs':    'ज़रूरी दस्तावेज़',
    'scheme.visit':   'आधिकारिक साइट देखें',

    /* ── Weather ── */
    'weather.title':  'मौसम सलाह',
    'weather.city':   'शहर का नाम लिखें…',
    'weather.btn':    'मौसम देखें',

    /* ── Profile ── */
    'profile.title':  'मेरी प्रोफ़ाइल',
    'profile.logout': 'लॉग आउट',
  }
};

let currentLang = localStorage.getItem('km_lang') || 'en';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N['en'][key]) || key;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-ph'));
  });
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('km_lang', currentLang);
  updateLangBtn();
  applyI18n();
}

function updateLangBtn() {
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = currentLang === 'en' ? 'हिंदी' : 'English';
}

document.addEventListener('DOMContentLoaded', () => {
  updateLangBtn();
  applyI18n();
});
