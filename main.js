(() => {
  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (menuBtn && menu) {
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Screenshot slideshow
  const track = document.getElementById('slides');
  if (track) {
    const slides = [...track.querySelectorAll('.slide')];
    const dotsWrap = document.getElementById('slideDots');
    const prev = document.getElementById('slidePrev');
    const next = document.getElementById('slideNext');
    const stepWidth = () => slides[0].getBoundingClientRect().width + 20;
    const perView = () => Math.max(1, Math.round(track.clientWidth / stepWidth()));
    const pages = () => Math.max(1, slides.length - perView() + 1);
    const current = () => Math.round(track.scrollLeft / stepWidth());
    const goTo = (i) => track.scrollTo({ left: i * stepWidth() });

    const renderDots = () => {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < pages(); i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Go to screenshot ${i + 1}`);
        b.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(b);
      }
      update();
    };
    const update = () => {
      const i = Math.min(current(), pages() - 1);
      [...dotsWrap.children].forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      prev.disabled = i <= 0;
      next.disabled = i >= pages() - 1;
    };

    prev.addEventListener('click', () => goTo(Math.max(0, current() - 1)));
    next.addEventListener('click', () => goTo(Math.min(pages() - 1, current() + 1)));
    let t;
    track.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(update, 80); }, { passive: true });
    window.addEventListener('resize', renderDots);
    renderDots();

    // Gentle autoplay; pauses on hover/focus and when reduced motion is preferred
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let paused = false;
      ['mouseenter', 'focusin', 'touchstart'].forEach((e) => track.parentElement.addEventListener(e, () => { paused = true; }, { passive: true }));
      ['mouseleave', 'focusout'].forEach((e) => track.parentElement.addEventListener(e, () => { paused = false; }));
      setInterval(() => {
        if (paused || document.hidden) return;
        const i = current();
        goTo(i >= pages() - 1 ? 0 : i + 1);
      }, 4000);
    }
  }

  // Pricing toggle
  const plans = {
    monthly: { price: '$9.99', period: '/ month', note: 'Billed monthly · cancel any time', badge: 'Flexible' },
    yearly: { price: '$99.99', period: '/ year', note: "That's about $8.33 a month", badge: 'Best value' },
  };
  const toggles = document.querySelectorAll('.billing-toggle button');
  toggles.forEach((btn) => btn.addEventListener('click', () => {
    const p = plans[btn.dataset.period];
    toggles.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    document.getElementById('planPrice').textContent = p.price;
    document.getElementById('planPeriod').textContent = p.period;
    document.getElementById('planNote').textContent = p.note;
    document.getElementById('planBadge').textContent = p.badge;
  }));

  // Legal pages: highlight current section in the table of contents
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map([...tocLinks].map((a) => [a.getAttribute('href').slice(1), a]));
    const tocIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('active'));
          byId.get(e.target.id)?.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) tocIo.observe(s); });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
