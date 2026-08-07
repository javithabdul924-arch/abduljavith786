/* ==========================================================================
   PORTFOLIO SCRIPT — A. Abdul Javith
   Sections:
   1. Loading Screen
   2. Custom Cursor
   3. Particle Background (Canvas)
   4. Mouse Glow Effect
   5. Navbar Scroll + Mobile Toggle + Active Link
   6. Typing Animation
   7. Scroll Reveal Animations
   8. Animated Counters (Stats)
   9. Skill Bar Animation
   10. Back To Top Button
   11. Contact Form Validation + Fake Submit
   12. Resume Button Placeholder
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================= 
     1. LOADING SCREEN
     ============================= */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 900);
  });
  // Safety fallback in case 'load' event is delayed
  setTimeout(() => loader.classList.add('hidden'), 3500);


  /* ============================= 
     2. CUSTOM CURSOR
     ============================= */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(min-width: 901px)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .project-card, .service-card, .skill-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }


  /* ============================= 
     3. PARTICLE BACKGROUND (CANVAS)
     ============================= */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * window.innerHeight;
      this.size = Math.random() * 1.8 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.25;
      const colors = ['#4361ee', '#7b2ff7', '#00e5ff', '#a855f7'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function initParticles() {
    const particleCount = window.innerWidth < 768 ? 45 : 90;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = '#6a5cff';
          ctx.globalAlpha = (1 - dist / maxDist) * 0.15;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, window.innerHeight);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });


  /* ============================= 
     4. MOUSE GLOW EFFECT
     ============================= */
  const mouseGlow = document.getElementById('mouseGlow');
  if (window.matchMedia('(min-width: 901px)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }


  /* ============================= 
     5. NAVBAR SCROLL + MOBILE TOGGLE + ACTIVE LINK
     ============================= */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id], section#journey');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('mobile-open');
    });
  });

  function updateActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.nav === current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();


  /* ============================= 
     6. TYPING ANIMATION
     ============================= */
  const typedTextEl = document.getElementById('typedText');
  const phrases = [
    'Future Full Stack Web Developer',
    'Front-End Developer',
    'Python Learner',
    'UI/UX Enthusiast'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(typeLoop, typeSpeed);
  }
  typeLoop();


  /* ============================= 
     7. SCROLL REVEAL ANIMATIONS
     ============================= */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 20px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================= 
     8. ANIMATED COUNTERS (STATS)
     ============================= */
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  statNumbers.forEach(el => counterObserver.observe(el));


  /* ============================= 
     9. SKILL BAR ANIMATION
     ============================= */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width;
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* ============================= 
     10. BACK TO TOP BUTTON
     ============================= */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================= 
     11. CONTACT FORM VALIDATION + FAKE SUBMIT
     ============================= */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  const fields = {
    name: { el: document.getElementById('name'), errorEl: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), errorEl: document.getElementById('emailError') },
    phone: { el: document.getElementById('phone'), errorEl: document.getElementById('phoneError') },
    subject: { el: document.getElementById('subject'), errorEl: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), errorEl: document.getElementById('messageError') }
  };

  // Ensure floating labels work even without placeholder attr by tracking value state
  Object.values(fields).forEach(field => {
    field.el.setAttribute('placeholder', ' ');
    field.el.addEventListener('input', () => {
      field.el.classList.toggle('has-value', field.el.value.trim().length > 0);
      clearError(field);
    });
  });

  function setError(field, message) {
    field.el.closest('.form-group').classList.add('error');
    field.errorEl.textContent = message;
  }

  function clearError(field) {
    field.el.closest('.form-group').classList.remove('error');
    field.errorEl.textContent = '';
  }

  function validateForm() {
    let isValid = true;

    if (fields.name.el.value.trim().length < 2) {
      setError(fields.name, 'Please enter your full name.');
      isValid = false;
    } else {
      clearError(fields.name);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(fields.email.el.value.trim())) {
      setError(fields.email, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(fields.email);
    }

    if (fields.phone.el.value.trim().length > 0) {
      const phonePattern = /^[0-9+\-\s()]{7,15}$/;
      if (!phonePattern.test(fields.phone.el.value.trim())) {
        setError(fields.phone, 'Please enter a valid phone number.');
        isValid = false;
      } else {
        clearError(fields.phone);
      }
    }

    if (fields.subject.el.value.trim().length < 3) {
      setError(fields.subject, 'Please enter a subject.');
      isValid = false;
    } else {
      clearError(fields.subject);
    }

    if (fields.message.el.value.trim().length < 10) {
      setError(fields.message, 'Message should be at least 10 characters.');
      isValid = false;
    } else {
      clearError(fields.message);
    }

    return isValid;
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');

    if (!validateForm()) return;

    // Simulate sending (frontend-only demo)
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> <span>Sending...</span>";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
      formSuccess.classList.add('show');
      contactForm.reset();
      Object.values(fields).forEach(field => {
        field.el.classList.remove('has-value');
      });

      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }, 1200);
  });


  /* ============================= 
     12. RESUME BUTTON PLACEHOLDER
     ============================= */
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Resume download coming soon! Please check back later or contact me directly via email or WhatsApp.');
    });
  }


  /* ============================= 
     13. LIVE PREVIEW MODAL & IFRAME CONTROLS
     ============================= */
  const luckyIframe = document.getElementById('luckyIframe');
  const iframeLoader = document.getElementById('iframeLoader');
  
  if (luckyIframe && iframeLoader) {
    luckyIframe.addEventListener('load', () => {
      iframeLoader.classList.add('loaded');
    });
    setTimeout(() => iframeLoader.classList.add('loaded'), 3000);
  }

  const previewModal = document.getElementById('previewModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalIframeLoader = document.getElementById('modalIframeLoader');
  const modalIframeWrapper = document.getElementById('modalIframeWrapper');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const deviceBtns = document.querySelectorAll('.device-btn');

  function openPreviewModal() {
    if (!previewModal) return;
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (modalIframe && modalIframe.getAttribute('src') === 'about:blank') {
      const src = modalIframe.dataset.src || 'https://luckytimes.vercel.app';
      modalIframe.src = src;
      modalIframe.addEventListener('load', () => {
        if (modalIframeLoader) modalIframeLoader.classList.add('loaded');
      });
      setTimeout(() => {
        if (modalIframeLoader) modalIframeLoader.classList.add('loaded');
      }, 3500);
    }
  }

  function closePreviewModal() {
    if (!previewModal) return;
    previewModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPreviewModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closePreviewModal);
  }

  if (previewModal) {
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) {
        closePreviewModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal && previewModal.classList.contains('active')) {
      closePreviewModal();
    }
  });

  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const device = btn.dataset.device;
      if (modalIframeWrapper) {
        modalIframeWrapper.className = `modal-iframe-wrapper device-${device}`;
      }
    });
  });

});