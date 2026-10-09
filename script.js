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
  const dot = document.querySelector('.cursor-dot');
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
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu || document.body.dataset.page === 'web') return;

  const setOpen = (open) => {
    menu.classList.toggle('opacity-100', open);
    menu.classList.toggle('opacity-0', !open);
    menu.classList.toggle('pointer-events-auto', open);
    menu.classList.toggle('pointer-events-none', !open);
    btn.textContent = open ? 'Close' : 'Menu';
    btn.setAttribute('aria-expanded', String(open));
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
if (!reduced && document.body.dataset.page !== 'web') {
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
document.addEventListener('DOMContentLoaded', function () {
  const reelCards = document.querySelectorAll('.reel-card');
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  reelCards.forEach(card => {
    const video = card.querySelector('.reel-video');
    const playOverlay = card.querySelector('.play-overlay');
    const muteBtn = card.querySelector('.mute-btn');
    const muteIcon = card.querySelector('.mute-icon');
    const progressBar = card.querySelector('.progress-bar');

    if (!video) return;

    /* ═══════════════════════════════════════════════════
       0. MOBILE AUTOPLAY SETUP
       Mute by default so the browser allows autoplay,
       and update the mute icon to match.
    ═══════════════════════════════════════════════════ */
    if (isMobile) {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      if (muteIcon) {
        muteIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        `;
      }

      // Autoplay / pause based on viewport visibility
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { });
            if (playOverlay) {
              playOverlay.style.opacity = '0';
              playOverlay.style.pointerEvents = 'none';
            }
          } else {
            video.pause();
            if (playOverlay) {
              playOverlay.style.opacity = '1';
              playOverlay.style.pointerEvents = 'auto';
            }
          }
        });
      }, {
        threshold: [0, 0.6, 1.0],
        rootMargin: '0px 0px -10% 0px',
      });

      observer.observe(card);
    }

    /* ═══════════════════════════════════════════════════
       Desktop: hover to play
    ═══════════════════════════════════════════════════ */
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 768) {
        video.play().catch(() => { });
        if (playOverlay) {
          playOverlay.style.opacity = '0';
          playOverlay.style.pointerEvents = 'none';
        }
      }
    });

    card.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 768) {
        video.pause();
        video.currentTime = 0;
        if (playOverlay) {
          playOverlay.style.opacity = '1';
          playOverlay.style.pointerEvents = 'auto';
        }
      }
    });

    /* ═══════════════════════════════════════════════════
       Tap overlay to pause/resume (mobile only)
    ═══════════════════════════════════════════════════ */
    if (playOverlay) {
      playOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
          video.play().catch(() => { });
          playOverlay.style.opacity = '0';
          playOverlay.style.pointerEvents = 'none';
        } else {
          video.pause();
          playOverlay.style.opacity = '1';
          playOverlay.style.pointerEvents = 'auto';
        }
      });
    }

    /* ═══════════════════════════════════════════════════
       Mute toggle (still works on both)
    ═══════════════════════════════════════════════════ */
    if (muteBtn && muteIcon) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;

        if (video.muted) {
          muteIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          `;
        } else {
          muteIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5z" />
          `;
        }
      });
    }

    /* ═══════════════════════════════════════════════════
       Progress bar
    ═══════════════════════════════════════════════════ */
    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        if (progressBar) progressBar.style.width = pct + '%';
      }
    });

    video.addEventListener('ended', () => {
      if (progressBar) progressBar.style.width = '0%';
    });
  });
});

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


if (!reduced) {
  document.querySelectorAll("[data-magnetic]").forEach(el => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
      xTo(x); yTo(y);
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.35)" });
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
    menuBtn.setAttribute('aria-expanded', String(menuOpen));
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
      menuBtn.setAttribute('aria-expanded', 'false');
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
if (clock && document.body.dataset.page !== 'web') {
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
  const content = document.getElementById('lightboxContent');
  const imgEl = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const catEl = document.getElementById('lightboxCategory');
  const idxEl = document.getElementById('lightboxIndex');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  const triggers = Array.from(document.querySelectorAll('[data-lightbox]'));
  let currentIdx = 0;
  let isOpen = false;

  const pad = n => String(n + 1).padStart(2, '0');

  function render(index) {
    const btn = triggers[index];
    if (!btn) return;

    imgEl.src = btn.dataset.src;
    imgEl.alt = btn.dataset.title || '';
    titleEl.textContent = btn.dataset.title || '';
    catEl.textContent = btn.dataset.category || '';
    idxEl.textContent = `${pad(index)} / ${pad(triggers.length - 1)}`;
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
    gsap.set(content, { y: 30, opacity: 0 });
    gsap.set(imgEl, { scale: 0.94, opacity: 0 });

    gsap.timeline()
      .to(backdrop, { opacity: 1, duration: 0.45, ease: 'power2.out' })
      .to(content, { y: 0, opacity: 1, duration: 0.65, ease: 'expo.out' }, 0.05)
      .to(imgEl, { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.1);
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
      .to(content, { y: 20, opacity: 0, duration: 0.35, ease: 'power2.in' })
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

// contact form

/**
 * Form submit handler — builds a WhatsApp message with the form fields
 * and opens wa.me. Replace the number if it ever changes.
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const type = document.getElementById('type').value;
  const service = document.getElementById('service').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const message = document.getElementById('message').value.trim();

  const lines = [
    '*New Enquiry — Scalixo Media*',
    '',
    `*Name:* ${name}`,
    `*Phone:* ${phone}`,
    email ? `*Email:* ${email}` : null,
    `*Enquiry Type:* ${type}`,
    `*Service:* ${service}`,
    `*Preferred Date:* ${date}`,
    `*Preferred Time:* ${time}`,
    message ? `*Message:* ${message}` : null,
  ].filter(Boolean);

  const waNumber = '919328792160'; // ← update if the number changes
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join('\n'))}`;

  const note = document.getElementById('formNote');
  if (note) {
    note.classList.remove('hidden');
    setTimeout(() => note.classList.add('hidden'), 3000);
  }

  window.open(waUrl, '_blank', 'noopener,noreferrer');
  return false;

}

// faq page
// FAQ Accordion: only one open at a time
document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-item').forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

// Open accordion when TOC link is clicked
document.querySelectorAll('.toc-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target && target.classList.contains('faq-item')) {
      e.preventDefault();
      target.open = true;
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  });
});

// Open from hash on load
window.addEventListener('load', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target && target.classList.contains('faq-item')) {
      target.open = true;
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
});

(function initWebsiteDevelopmentPage() {
  if (document.body.dataset.page !== 'web') return;

  const heroLines = gsap.utils.toArray('[data-hero-line]');

  if (!reduced) {
    if (heroLines.length) {
      const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });
      timeline.from('[data-hero]', { y: 30, opacity: 0, duration: 1, stagger: 0.08 });

      heroLines.forEach((line, index) => {
        const inner = line.querySelector('[data-hero-line-inner]');
        if (!inner) return;

        timeline.fromTo(
          inner,
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2 },
          0.35 + index * 0.15
        );
      });
    }

    gsap.utils.toArray('[data-parallax]').forEach((element) => {
      const speed = Number.parseFloat(element.dataset.parallax);
      if (!Number.isFinite(speed)) return;

      gsap.to(element, {
        y: () => -(window.innerHeight * speed),
        ease: 'none',
        scrollTrigger: {
          trigger: element.closest('section') || element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    gsap.utils.toArray('[data-reveal]').forEach((element) => {
      gsap.fromTo(
        element,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    gsap.utils.toArray('.module-card').forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 80, opacity: 0, rotateX: -8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          delay: (index % 3) * 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        }
      );
    });

    gsap.utils.toArray('.tech-tile').forEach((tile, index) => {
      gsap.fromTo(
        tile,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          delay: index * 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: tile, start: 'top 92%' },
        }
      );
    });

    const processProgress = document.querySelector('.process-progress');
    if (processProgress) {
      gsap.to(processProgress, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.process-step',
          start: 'top 60%',
          end: 'bottom 70%',
          scrub: 0.6,
        },
      });
    }

    gsap.utils.toArray('.process-step').forEach((step) => {
      gsap.fromTo(
        step,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 88%' },
        }
      );
    });

    gsap.utils.toArray('[data-counter]').forEach((element) => {
      const target = Number.parseFloat(element.dataset.counter);
      if (!Number.isFinite(target)) return;

      const counter = { value: 0 };
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            value: target,
            duration: 2.2,
            ease: 'expo.out',
            onUpdate: () => {
              element.textContent = target % 1 === 0
                ? String(Math.floor(counter.value))
                : counter.value.toFixed(1);
            },
          });
        },
      });
    });

    const rail = document.querySelector('.h-scroll-track');
    if (rail && window.matchMedia('(min-width: 768px)').matches) {
      const railSection = rail.closest('section');
      const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth + 80);

      gsap.to(rail, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: railSection,
          start: 'top top',
          end: () => `+=${distance() + 200}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  if (fine) {
    document.querySelectorAll('[data-glow]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
      });
    });
  }
})();


// home page no js 
// ── GSAP reveals (same pattern as home page) ──
document.addEventListener('DOMContentLoaded', () => {

  // ── Number tickers ──
  const tickers = document.querySelectorAll('.number-ticker');
  tickers.forEach((el) => {
    const target = parseFloat(el.dataset.value);
    const decimals = parseInt(el.dataset.decimals || '0');
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%',
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate: () => { el.textContent = obj.val.toFixed(decimals); },
        });
      },
      once: true,
    });
  });

});
// performance optimizations page
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  if (typeof SplitText !== "undefined") gsap.registerPlugin(SplitText);
  if (typeof DrawSVGPlugin !== "undefined") gsap.registerPlugin(DrawSVGPlugin);

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ═══════════════════════════════════════════════════════
                 14. ORBIT DOT
              ═══════════════════════════════════════════════════════ */
  gsap.utils.toArray(".orbit-dot").forEach((orbit) => {
    gsap.to(orbit, { rotation: 360, duration: 8, repeat: -1, ease: "none", transformOrigin: "center center" });
  });


  /* ═══════════════════════════════════════════════════════
     16. PROCESS STEP REVEAL + DRAWSVG
  ═══════════════════════════════════════════════════════ */
  gsap.utils.toArray(".process-step").forEach((step, i) => {
    gsap.fromTo(step,
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.9, delay: (i % 3) * 0.06, ease: "expo.out",
        scrollTrigger: { trigger: step, start: "top 88%" },
      }
    );
  });

  /* ═══════════════════════════════════════════════════════
                17. CTA HEADLINE — Char reveal
             ═══════════════════════════════════════════════════════ */
  const ctaHeadline = document.querySelector(".cta-headline");
  if (ctaHeadline && !prefersReduced && typeof SplitText !== "undefined") {
    const s = new SplitText(ctaHeadline, { type: "chars,words,lines" });
    gsap.from(s.chars, {
      opacity: 0, yPercent: 100,
      stagger: 0.015, duration: 0.9, ease: "power4.out",
      scrollTrigger: { trigger: ctaHeadline, start: "top 85%", once: true },
    });
  }



  /* ═══════════════════════════════════════════════════════
     21. MARQUEE PAUSE ON HOVER
  ═══════════════════════════════════════════════════════ */
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.addEventListener("mouseenter", () => { marquee.style.animationPlayState = "paused"; });
    marquee.addEventListener("mouseleave", () => { marquee.style.animationPlayState = "running"; });
  }

  gsap.to('.client-marquee', {
  xPercent: -50,
  duration: 40,
  repeat: -1,
  ease: 'none',
});

});