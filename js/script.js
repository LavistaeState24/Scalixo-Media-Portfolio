gsap.registerPlugin(ScrollTrigger);

const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── Image fallback ───────── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = '1';
    img.src = 'https://picsum.photos/seed/' + Math.random().toString(36).slice(2, 8) + '/900/1100';
  });
});

/* ───────── Custom cursor ───────── */
if (fine) {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.10, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.10, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });

  window.addEventListener('mousemove', e => {
    dotX(e.clientX); dotY(e.clientY);
    ringX(e.clientX); ringY(e.clientY);
  });

  document.querySelectorAll('a, button, .service-card, .video-card, .post-card').forEach(el => {
    el.addEventListener('mouseenter', () =>
      gsap.to(ring, { scale: 2.3, borderColor: 'rgba(28,88,227,.85)', duration: 0.35, ease: 'power3' })  /* ← updated */
    );
    el.addEventListener('mouseleave', () =>
      gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,.35)', duration: 0.35, ease: 'power3' })
    );
  });
} else {
  document.querySelector('.cursor-dot')?.remove();
  document.querySelector('.cursor-ring')?.remove();
}

 (function () {
    const btn  = document.getElementById('menuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle('opacity-100', open);
      menu.classList.toggle('opacity-0', !open);
      menu.classList.toggle('pointer-events-auto', open);
      menu.classList.toggle('pointer-events-none', !open);
      btn.textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
    };

    btn.addEventListener('click', () => setOpen(!menu.classList.contains('opacity-100')));

    menu.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        setOpen(false);
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      });
    });

    window.addEventListener('resize', () => { if (window.innerWidth >= 768) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  })();

/* ───────── Hero intro ───────── */
// gsap.timeline({ defaults: { ease: 'expo.out' } })
//   .fromTo('.hero-line', { yPercent: 110 }, { yPercent: 0, duration: 1.5, stagger: 0.14 }, 0.15)
//   .from('.hero-rule', { scaleX: 0, transformOrigin: 'left center', duration: 1.4 }, 0.55)
//   .from('.hero-meta', { y: 34, opacity: 0, duration: 1.1, stagger: 0.09 }, 0.7)
//   .from('header > div', { y: -26, opacity: 0, duration: 1 }, 0.1);

/* ───────── Marquee ───────── */
const track = document.querySelector('.marquee-track');
if (track) {
  gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
}

/* ───────── Scroll progress ───────── */
gsap.to('.progress-bar', {
  scaleX: 1, ease: 'none',
  scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
});

/* ───────── Reveals ───────── */
if (!reduced) {
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.from(el, {
      y: 44, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
      y: 60, opacity: 0, duration: 1, ease: 'expo.out',
      delay: i * 0.06,
      scrollTrigger: { trigger: card.parentElement, start: 'top 82%' },
    });
  });

  gsap.utils.toArray('.video-grid').forEach(grid => {
    gsap.from(grid.querySelectorAll('.video-card'), {
      y: 60, opacity: 0, scale: 0.94, duration: 1.1, ease: 'expo.out', stagger: 0.09,
      scrollTrigger: { trigger: grid, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('.post-grid').forEach(grid => {
    gsap.from(grid.querySelectorAll('.post-card'), {
      y: 50, opacity: 0, rotate: 2.5, duration: 1.1, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: grid, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('.watermark').forEach(wm => {
    gsap.to(wm, {
      yPercent: -18, ease: 'none',
      scrollTrigger: { trigger: wm.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ───────── Video hover-play ───────── */
if (fine) {
  document.querySelectorAll('.video-card[data-play]').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const video = e.target.querySelector('video');
      if (!video) return;
      if (e.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.video-card[data-play]').forEach(c => observer.observe(c));
}

/* ───────── Magnetic buttons ───────── */
if (fine) {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.32, y: y * 0.42, duration: 0.6, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ───────── Mobile menu ───────── */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuBtn.textContent = menuOpen ? 'Close' : 'Menu';
    gsap.to(mobileMenu, {
      opacity: menuOpen ? 1 : 0, duration: 0.4, ease: 'power3.out',
      onStart: () => {
        mobileMenu.style.zIndex = menuOpen ? '40' : '-1';
        mobileMenu.style.pointerEvents = menuOpen ? 'auto' : 'none';
      },
    });
    if (menuOpen) {
      gsap.fromTo('.mobile-link',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'expo.out', delay: 0.1 }
      );
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      menuBtn.textContent = 'Menu';
      gsap.to(mobileMenu, {
        opacity: 0, duration: 0.3,
        onComplete: () => {
          mobileMenu.style.zIndex = '-1';
          mobileMenu.style.pointerEvents = 'none';
        },
      });
    });
  });
}

/* ───────── Clock ───────── */
const clock = document.getElementById('clock');
if (clock) {
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };
  tick();
  setInterval(tick, 1000);
}

/* ───────── HERO ENHANCED INTERACTIONS ───────── */
/* ═══════════════════════════════════════════
   LIGHTBOX — Tailwind + GSAP
   ═══════════════════════════════════════════ */
(function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const backdrop = document.getElementById('lightboxBackdrop');
  const content  = document.getElementById('lightboxContent');
  const imgEl    = document.getElementById('lightboxImg');
  const titleEl  = document.getElementById('lightboxTitle');
  const catEl    = document.getElementById('lightboxCategory');
  const idxEl    = document.getElementById('lightboxIndex');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev  = document.getElementById('lightboxPrev');
  const btnNext  = document.getElementById('lightboxNext');

  const triggers = Array.from(document.querySelectorAll('[data-lightbox]'));
  let currentIdx = 0;
  let isOpen     = false;

  const pad = n => String(n + 1).padStart(2, '0');

  function render(index) {
    const btn = triggers[index];
    if (!btn) return;

    imgEl.src = btn.dataset.src;
    imgEl.alt = btn.dataset.title || '';
    titleEl.textContent = btn.dataset.title || '';
    catEl.textContent   = btn.dataset.category || '';
    idxEl.textContent   = `${pad(index)} / ${pad(triggers.length - 1)}`;
    currentIdx = index;
  }

  function open(index) {
    if (isOpen) return;
    isOpen = true;

    document.body.classList.add('lightbox-open');
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');

    render(index);

    // reset to initial state
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(content,  { y: 30, opacity: 0 });
    gsap.set(imgEl,    { scale: 0.94, opacity: 0 });

    gsap.timeline()
      .to(backdrop, { opacity: 1, duration: 0.45, ease: 'power2.out' })
      .to(content,  { y: 0, opacity: 1, duration: 0.65, ease: 'expo.out' }, 0.05)
      .to(imgEl,    { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.1);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    gsap.timeline({
      onComplete: () => {
        lb.classList.remove('is-open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        imgEl.src = '';
      },
    })
      .to(content,  { y: 20, opacity: 0, duration: 0.35, ease: 'power2.in' })
      .to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.05);
  }

  function go(delta) {
    const len = triggers.length;
    if (!len) return;
    const next = (currentIdx + delta + len) % len;

    gsap.timeline()
      .to(imgEl, { opacity: 0, scale: 0.95, duration: 0.22, ease: 'power2.in' })
      .add(() => render(next))
      .to(imgEl, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
  }

  triggers.forEach((btn, i) => {
    btn.addEventListener('click', () => open(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));

  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
})();

// footer 
(function () {
      // Auto year
      const year = document.getElementById('year');
      if (year) year.textContent = new Date().getFullYear();

      // Live clock — Ahmedabad (IST)
      const clock = document.getElementById('clock');
      if (!clock) return;

      const fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const tick = () => { clock.textContent = fmt.format(new Date()); };
      tick();
      setInterval(tick, 1000);
    })();