/* Quatuor Sauvage — JS minimal, sans dépendance.
   1. Menu plein écran   2. État de la barre de navigation
   3. Apparition au défilement   4. Visionneuse d'images     */
(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.menu-toggle');
  var overlay = document.querySelector('.overlay');
  var hero = document.querySelector('.hero');

  /* ---------------------------------------------------------------- 1. Menu */
  function setMenu(open) {
    if (!overlay || !toggle || !nav) return;
    overlay.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    toggle.setAttribute('aria-expanded', String(open));
    overlay.setAttribute('aria-hidden', String(!open));
    if (open) {
      nav.classList.remove('is-over-hero', 'is-solid');
    } else {
      updateNav();
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!overlay.classList.contains('is-open'));
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (overlay && overlay.classList.contains('is-open')) setMenu(false);
    closeLightbox();
  });

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
  }

  /* ------------------------------------------------- 2. Barre de navigation */
  function updateNav() {
    if (!nav || (overlay && overlay.classList.contains('is-open'))) return;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (hero) {
      var threshold = hero.offsetHeight - 96;
      nav.classList.toggle('is-over-hero', y < threshold);
      nav.classList.toggle('is-solid', y >= threshold);
    } else {
      nav.classList.remove('is-over-hero');
      nav.classList.toggle('is-solid', y > 8);
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateNav();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  /* ----------------------------------------------------- 3. Apparition doux */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-visible'); });
  }

  /* -------------------------------------------------- 4. Visionneuse images */
  var lightbox = document.querySelector('.lightbox');
  var shots = document.querySelectorAll('.shot');
  var lbImg, lbCap, index = 0, lastFocus = null;

  if (lightbox && shots.length) {
    lbImg = lightbox.querySelector('img');
    lbCap = lightbox.querySelector('figcaption');

    Array.prototype.forEach.call(shots, function (btn, i) {
      btn.addEventListener('click', function () { openLightbox(i); });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  function openLightbox(i) {
    if (!lightbox) return;
    lastFocus = document.activeElement;
    index = i;
    render();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    index = (index + dir + shots.length) % shots.length;
    render();
  }

  function render() {
    var source = shots[index].querySelector('img');
    if (!source || !lbImg) return;
    lbImg.src = source.getAttribute('data-full') || source.src;
    lbImg.alt = source.alt || '';
    var fig = shots[index].closest('figure');
    var cap = fig ? fig.querySelector('figcaption') : null;
    if (lbCap) lbCap.textContent = cap ? cap.textContent : '';
  }
})();
