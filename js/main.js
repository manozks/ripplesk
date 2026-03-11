/* ===== RIPPLESK — MAIN JS ===== */
document.addEventListener('DOMContentLoaded', () => {

  /* --- AOS Init --- */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 680, once: true, offset: 70, easing: 'ease-out-cubic' });
  }

  /* --- Navbar scroll --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Hamburger --- */
  const ham = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (ham && mobileNav) {
    ham.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      const spans = ham.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      })
    );
  }

  /* --- Active nav --- */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const seg = href.replace(/^(\.\.\/)+/, '').replace('/index.html','').split('/')[0];
    const cur = path.split('/').filter(Boolean)[0] || '';
    if (seg && seg !== '#' && seg === cur) a.classList.add('active');
  });

  /* --- Code tabs --- */
  document.querySelectorAll('.code-block').forEach(block => {
    block.querySelectorAll('.code-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        block.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
        block.querySelectorAll('.code-body').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        const body = block.querySelector(`.code-body[data-body="${key}"]`);
        if (body) body.classList.add('active');
      });
    });
  });

  /* --- Accordion --- */
  document.querySelectorAll('.acc-header').forEach(h => {
    h.addEventListener('click', () => {
      const item = h.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-body').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* --- Pricing toggle --- */
  const toggle = document.getElementById('billing-toggle');
  if (toggle) {
    toggle.addEventListener('change', () => {
      document.querySelectorAll('.price-monthly').forEach(el => el.style.display = toggle.checked ? 'none' : 'block');
      document.querySelectorAll('.price-annual').forEach(el => el.style.display = toggle.checked ? 'block' : 'none');
    });
  }

  /* --- Counter animation --- */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = target * ease;
        el.textContent = (target % 1 === 0 ? Math.floor(val).toLocaleString() : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = (target % 1 === 0 ? target.toLocaleString() : target.toFixed(1)) + suffix;
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

  /* --- Demo metric bars --- */
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width || '75%';
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.dm-fill').forEach(el => {
    el.style.width = '0';
    barObs.observe(el);
  });

  /* --- Hero entrance --- */
  document.querySelectorAll('.reveal-1,.reveal-2,.reveal-3,.reveal-4,.reveal-5').forEach(el => {
    setTimeout(() => el.classList.add('revealed'), 80);
  });

  /* --- Contact form --- */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…'; btn.disabled = true;
      await new Promise(r => setTimeout(r, 1500));
      btn.textContent = '✓ Message sent!'; btn.style.background = '#22c55e';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; form.reset(); }, 3500);
    });
  }
});
