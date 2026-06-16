/* ── Scroll-reveal via IntersectionObserver ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    } else {
      entry.target.classList.remove('is-visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll(
  '.animate-up, .animate-left, .animate-right, .animate-scale, .animate-fade'
).forEach(el => revealObserver.observe(el));

/* ── Hero entrance: stagger each child on load ── */
document.querySelectorAll('.hero-animate').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.13}s`;
  requestAnimationFrame(() => el.classList.add('hero-loaded'));
});

/* ── Navbar: shrink + shadow on scroll ── */
const nav = document.querySelector('.nav');
const navInner = document.querySelector('.nav-inner');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  nav.classList.toggle('nav--scrolled', scrolled);
}, { passive: true });

/* ── Stat counter animation ── */
function runCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  if (!target) return;
  const duration = 1800;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;
  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
    if (frame === totalFrames) clearInterval(counter);
  }, frameDuration);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));

/* ── Contact form → Formspree ── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    contactForm.querySelector('.form-error')?.remove();

    try {
      const res = await fetch('https://formspree.io/f/xvznlelg', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm),
      });

      if (res.ok) {
        contactForm.innerHTML = `
          <div class="form-success">
            <div class="form-success-icon">✓</div>
            <h3>Message sent!</h3>
            <p>Thanks for reaching out — we'll get back to you soon.</p>
          </div>`;
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      const err = document.createElement('p');
      err.className = 'form-error';
      err.textContent = 'Something went wrong. Please try again.';
      contactForm.appendChild(err);
    }
  });
}

/* ── Hamburger menu toggle ── */
const hamburger = document.querySelector('.nav-hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
