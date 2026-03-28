/**
 * KisanMitra — Intro Video Controller
 * ─────────────────────────────────────────────────────────
 * FIX 1: Plays on EVERY page load — sessionStorage removed.
 * FIX 2: Body lock uses a CSS class on <html>, not inline
 *         height/overflow styles, so laptop layout is clean.
 * ─────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  var overlay, video, spinner, skipBtn, muteBtn, progressWrap, progressBar, brand;

  /* ── Dismiss ─────────────────────────────────────────────── */
  function dismiss() {
    if (!overlay || overlay.classList.contains('fade-out')) return;

    overlay.classList.add('fade-out');

    setTimeout(function () {
      overlay.classList.add('hidden');
      /* Remove scroll lock from <html> — cleanest way, no side effects */
      document.documentElement.classList.remove('intro-active');
    }, 900);
  }

  /* ── Show video once buffered ───────────────────────────── */
  function onVideoReady() {
    spinner.classList.add('hidden');
    video.classList.add('visible');
    brand.classList.add('show');
    skipBtn.classList.add('show');
    muteBtn.classList.add('show');
    progressWrap.classList.add('show');
  }

  /* ── Progress bar ───────────────────────────────────────── */
  function onTimeUpdate() {
    if (!video.duration) return;
    progressBar.style.width = ((video.currentTime / video.duration) * 100) + '%';
  }

  /* ── Mute toggle ────────────────────────────────────────── */
  function toggleMute() {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
    muteBtn.title = video.muted ? 'Unmute' : 'Mute';
  }

  /* ── Autoplay with muted fallback ───────────────────────── */
  function attemptPlay() {
    video.muted = false;
    var p = video.play();
    if (p !== undefined) {
      p.catch(function () {
        video.muted = true;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        muteBtn.title = 'Unmute';
        return video.play();
      }).catch(function () {
        console.warn('KisanMitra: autoplay blocked — dismissing.');
        setTimeout(dismiss, 3000);
      });
    }
  }

  /* ── Safety timer ───────────────────────────────────────── */
  function startSafetyTimer(duration) {
    var ms = (duration > 0 ? duration * 1000 : 30000) + 3000;
    setTimeout(function () {
      if (!overlay.classList.contains('fade-out')) dismiss();
    }, ms);
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    overlay      = document.getElementById('intro-overlay');
    video        = document.getElementById('intro-video');
    spinner      = document.getElementById('intro-spinner');
    skipBtn      = document.getElementById('intro-skip-btn');
    muteBtn      = document.getElementById('intro-mute-btn');
    progressWrap = document.getElementById('intro-progress-wrap');
    progressBar  = document.getElementById('intro-progress-bar');
    brand        = document.getElementById('intro-brand');

    if (!overlay || !video) return;

    /* Reduced-motion: skip immediately */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dismiss();
      return;
    }

    /* Lock scroll via CSS class on <html> — no inline style conflicts */
    document.documentElement.classList.add('intro-active');

    /* Show brand during buffering */
    setTimeout(function () {
      if (brand && !spinner.classList.contains('hidden')) {
        brand.classList.add('show');
      }
    }, 400);

    video.addEventListener('canplay', function onCanPlay() {
      video.removeEventListener('canplay', onCanPlay);
      onVideoReady();
      attemptPlay();
      startSafetyTimer(video.duration);
    });

    video.addEventListener('loadedmetadata', function () {
      startSafetyTimer(video.duration);
    });

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', dismiss);
    video.addEventListener('error', function () {
      console.warn('KisanMitra: video error — dismissing.');
      dismiss();
    });

    skipBtn.addEventListener('click', dismiss);
    muteBtn.addEventListener('click', toggleMute);

    document.addEventListener('keydown', function (e) {
      if (overlay.classList.contains('hidden')) return;
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismiss();
      }
      if (e.key === 'm' || e.key === 'M') toggleMute();
    });

    video.load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
