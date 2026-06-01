/* =========================================
   STRATA WORKS — Main JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initReveal();
  initCounters();
  initAudienceTabs();
});

// --- Sticky Nav ---
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Mobile Menu ---
function initMobileMenu() {
  const btn = document.getElementById('nav-hamburger');
  const menu = document.getElementById('nav-mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    })
  );
}

// --- Scroll Reveal ---
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// --- Counter Animation ---
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const dur = 1800;
      const start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = (target * ease).toFixed(decimals);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// --- Audience Tabs (B2B / B2C toggle) ---
function initAudienceTabs() {
  document.querySelectorAll('[data-tabs]').forEach(container => {
    const tabs = container.querySelectorAll('[data-tab]');
    const panels = container.querySelectorAll('[data-panel]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => { t.classList.toggle('active', t.dataset.tab === target); t.setAttribute('aria-selected', t.dataset.tab === target); });
        panels.forEach(p => { p.classList.toggle('active', p.dataset.panel === target); });
      });
    });
  });
}

// --- Scroll progress bar ---
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(to right,var(--c-orange),var(--c-navy));z-index:9999;transition:width 80ms linear;pointer-events:none;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const pct = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    bar.style.width = (pct * 100) + '%';
  }, { passive: true });
});

// --- Lazy image fade ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s';
    const show = () => img.style.opacity = '1';
    if (img.complete) { show(); } else { img.addEventListener('load', show, { once: true }); }
  });
});
