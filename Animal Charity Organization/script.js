// ── CURSOR ──
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a,button,.mission-card,.program-card,.story-card,.vol-item,.impact-box').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
});

// ── BACK TO TOP (declared early so scroll handler can use it) ──
document.addEventListener('DOMContentLoaded', () => {
  const btt = document.getElementById('btt');
  if (btt) {
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── NAV ──
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  });
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navLinks) navLinks.classList.toggle('open');
    });
  }

  // ── SCROLL REVEAL ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('[data-count]').forEach(countEl => animateCount(countEl));
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Fix: force-reveal elements already visible on load (handles direct #anchor links like #donate)
  window.addEventListener('load', () => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        el.classList.add('visible');
      }
    });
  });

  // ── PROGRESS BAR ──
  const progressSection = document.getElementById('donate');
  const progressObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) progressFill.style.width = '74%';
      }, 300);
      progressObserver.disconnect();
    }
  }, { threshold: 0.2 });
  
  if (progressSection) progressObserver.observe(progressSection);

  // Also trigger if donate section is already in view on load
  window.addEventListener('load', () => {
    const rect = progressSection ? progressSection.getBoundingClientRect() : null;
    if (rect && rect.top < window.innerHeight) {
      setTimeout(() => {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) progressFill.style.width = '74%';
      }, 400);
    }
  });

  // ── COUNT-UP ──
  function animateCount(el) {
    if (el._counted) return;
    el._counted = true;
    const target = parseInt(el.dataset.count);
    const dur = 2000;
    const start = performance.now();
    function update(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  }

  document.querySelectorAll('[data-count]').forEach(el => {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCount(el); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
  });
});

// ── DONATE AMOUNT ──
let selectedAmt = 25;
const impactMessages = {
  10:  '🌱 $10 provides a day of meals and enrichment for a shelter animal.',
  25:  '💙 $25 provides food and shelter for one animal for a week.',
  50:  '💊 $50 covers vaccinations and basic medical care for one animal.',
  100: '🏥 $100 funds emergency veterinary treatment for an injured animal.',
  250: '🐾 $250 fully sponsors an animal from rescue to adoption.'
};

function selectAmount(amt, btn) {
  selectedAmt = amt;
  document.querySelectorAll('.amt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('donateAmt').textContent = amt;
  document.getElementById('donateImpact').textContent =
    impactMessages[amt] || `💙 $${amt} makes a real difference for animals in need.`;
}

function handleDonate() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;
    background:rgba(46,27,14,.7);
    z-index:9999;
    display:flex;align-items:center;justify-content:center;
    backdrop-filter:blur(6px)
  `;
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:28px;padding:3rem;max-width:420px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.3)">
      <div style="font-size:4rem;margin-bottom:1rem">🎉</div>
      <h2 style="font-family:'Playfair Display',serif;color:#2e1b0e;font-size:1.8rem;margin-bottom:1rem">Thank You!</h2>
      <p style="color:#7a6055;line-height:1.7;margin-bottom:1.5rem">
        Your donation of <strong style="color:#c96a45">$${selectedAmt}</strong> is making a real difference for animals in need.
        You'll receive a confirmation email shortly.
      </p>
      <button onclick="this.closest('div').parentElement.remove()"
        style="background:#e8a84c;border:none;padding:.8rem 2rem;border-radius:50px;font-size:1rem;font-weight:600;cursor:pointer;color:#2e1b0e">
        Close ✕
      </button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ── MOBILE NAV: close on link click ──
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});