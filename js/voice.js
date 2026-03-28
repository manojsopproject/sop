/* ============================================================
   KisanMitra — voice.js
   Web Speech API — recognition + synthesis
   ============================================================ */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

function initVoice() {
  if (!SpeechRecognition) return; /* not supported */

  recognition = new SpeechRecognition();
  recognition.continuous   = false;
  recognition.interimResults = false;
  recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.toLowerCase();
    handleVoiceCommand(text);
    stopListening();
  };

  recognition.onerror  = () => stopListening();
  recognition.onend    = () => stopListening();
}

function startListening() {
  if (!recognition) initVoice();
  if (!recognition) { showToast('Voice not supported in this browser.', 'warning'); return; }

  isListening = true;
  recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  recognition.start();

  document.querySelectorAll('.voice-btn').forEach(b => b.classList.add('listening'));
  showToast('Listening… Speak now 🎤', 'info', 2500);
}

function stopListening() {
  isListening = false;
  if (recognition) try { recognition.stop(); } catch {}
  document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('listening'));
}

function toggleVoice() {
  isListening ? stopListening() : startListening();
}

function handleVoiceCommand(text) {
  speak(null); /* stop previous */

  /* Weather */
  if (/weather|mausam|मौसम/.test(text)) {
    const cityMatch = text.match(/(?:weather|mausam|मौसम)\s+(?:in|of|at|में|का)?\s*(.+)/);
    const city = cityMatch ? cityMatch[1].trim() : 'Delhi';
    const inp  = document.getElementById('weatherCity');
    if (inp) inp.value = city;
    if (typeof getWeather === 'function') getWeather(city);
    return;
  }

  /* Crop advice */
  if (/crop|fasal|फसल/.test(text)) {
    window.location.href = 'crops.html'; return;
  }

  /* Prices */
  if (/price|bhav|daam|भाव|दाम/.test(text)) {
    window.location.href = 'prices.html'; return;
  }

  /* Pest */
  if (/pest|keet|रोग|कीट/.test(text)) {
    window.location.href = 'pest.html'; return;
  }

  /* Schemes */
  if (/scheme|yojana|योजना/.test(text)) {
    window.location.href = 'schemes.html'; return;
  }

  /* Dashboard */
  if (/dashboard|home|ghar|घर/.test(text)) {
    window.location.href = 'dashboard.html'; return;
  }

  /* Search in prices page */
  const priceSearch = document.getElementById('priceSearch');
  if (priceSearch) {
    priceSearch.value = text;
    if (typeof filterPrices === 'function') filterPrices();
    return;
  }

  /* Fallback: fill symptom text */
  const symptom = document.getElementById('symptomText');
  if (symptom) { symptom.value = text; return; }

  speak(`I heard: ${text}. Try saying weather, crops, prices, or pest.`);
}

function speak(text) {
  window.speechSynthesis.cancel();
  if (!text) return;
  const msg  = new SpeechSynthesisUtterance(text);
  msg.lang   = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  msg.rate   = 0.95;
  msg.pitch  = 1;
  window.speechSynthesis.speak(msg);
}

/* Fill voice search for any page input */
function voiceFillInput(inputId) {
  if (!SpeechRecognition) { showToast('Voice not supported.', 'warning'); return; }

  const tempRec = new SpeechRecognition();
  tempRec.lang  = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  tempRec.onresult = e => {
    const txt = e.results[0][0].transcript;
    const el  = document.getElementById(inputId);
    if (el) { el.value = txt; el.dispatchEvent(new Event('input')); }
    showToast(`Heard: "${txt}"`, 'info');
  };
  tempRec.onerror = () => showToast('Voice error. Please try again.', 'error');
  tempRec.start();
  showToast('Listening…', 'info', 2000);
}

document.addEventListener('DOMContentLoaded', initVoice);
