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
    'Full Stack Developer',
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


  /* ============================= 
     13. CERTIFICATIONS 3D FLIP VIEWER & DECK SLIDER
     ============================= */
  const certCards = document.querySelectorAll('.cert-card-3d');
  const certDots = document.querySelectorAll('.cert-dot');
  const prevCertBtn = document.querySelector('.prev-cert-btn');
  const nextCertBtn = document.querySelector('.next-cert-btn');
  const manualFlipBtn = document.querySelector('.cert-manual-flip-btn');
  let currentCertIndex = 0;

  function showCertIndex(index) {
    if (certCards.length === 0) return;
    
    // Normalize index
    if (index < 0) index = certCards.length - 1;
    if (index >= certCards.length) index = 0;
    currentCertIndex = index;

    // Reset flips and update active card
    certCards.forEach((card, idx) => {
      card.classList.remove('flipped');
      if (idx === currentCertIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update active dot indicator
    certDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentCertIndex);
    });
  }

  // Toggle card flip
  function toggleCurrentFlip() {
    if (certCards[currentCertIndex]) {
      certCards[currentCertIndex].classList.toggle('flipped');
    }
  }

  // Card click to flip (ignoring links/buttons inside)
  certCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      card.classList.toggle('flipped');
    });
  });

  // Flip back buttons on card reverse side
  const flipBackBtns = document.querySelectorAll('.flip-back-btn');
  flipBackBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.cert-card-3d');
      if (card) card.classList.remove('flipped');
    });
  });

  if (prevCertBtn) {
    prevCertBtn.addEventListener('click', () => {
      showCertIndex(currentCertIndex - 1);
    });
  }

  if (nextCertBtn) {
    nextCertBtn.addEventListener('click', () => {
      showCertIndex(currentCertIndex + 1);
    });
  }

  if (manualFlipBtn) {
    manualFlipBtn.addEventListener('click', () => {
      toggleCurrentFlip();
    });
  }

  certDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      showCertIndex(idx);
    });
  });


  /* ============================= 
     14. DARK / LIGHT MODE THEME TOGGLE
     ============================= */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    });
  }


  /* ============================= 
     15. AI PORTFOLIO ASSISTANT CHATBOT
     ============================= */
  const aiChatbotToggle = document.getElementById('aiChatbotToggle');
  const aiChatbotWindow = document.getElementById('aiChatbotWindow');
  const aiChatClose = document.getElementById('aiChatClose');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiSendBtn = document.getElementById('aiSendBtn');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  if (aiChatbotToggle && aiChatbotWindow) {
    aiChatbotToggle.addEventListener('click', () => {
      aiChatbotWindow.classList.toggle('active');
      aiChatbotToggle.classList.toggle('active');
    });
  }

  if (aiChatClose) {
    aiChatClose.addEventListener('click', () => {
      aiChatbotWindow.classList.remove('active');
      aiChatbotToggle.classList.remove('active');
    });
  }

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-msg user';
    msgDiv.innerHTML = `
      <div class="msg-bubble">${escapeHTML(text)}</div>
      <span class="msg-time">${formatTime()}</span>
    `;
    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function appendBotMessage(htmlContent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-msg bot';
    msgDiv.innerHTML = `
      <div class="msg-bubble">${htmlContent}</div>
      <span class="msg-time">${formatTime()}</span>
    `;
    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function generateAIResponse(query) {
    const q = query.toLowerCase();

    // Personal Training Details
    if (q.includes('contact number') || q.includes('phone number') || q.includes('mobile number') || q.includes('phone') || q.includes('number') || q.includes('mobile')) {
      return "📞 <strong>Contact Number:</strong> <a href='tel:6379748608'>6379748608</a> (WhatsApp: <a href='https://wa.me/916379748608' target='_blank'>+91 6379748608</a>)";
    }
    else if (q.includes('how many siblings') || q.includes('number of brothers') || q.includes('count of siblings')) {
      return "👨‍👦‍👦 Abdul has <strong>3 brothers</strong> (3 siblings).";
    }
    else if (q.includes('sibling') || q.includes('brothers name') || q.includes('brother name')) {
      return "👦 <strong>Siblings Names:</strong><br>• <strong>First Brother:</strong> Mohamed Jameel<br>• <strong>Second Brother:</strong> Mohamed Faisal<br>• <strong>Third Brother:</strong> Abdul Basith";
    }
    else if (q.includes('city')) {
      return "🏙️ <strong>City Name:</strong> Karaikkudi";
    }
    else if (q.includes('area')) {
      return "📍 <strong>Area Name:</strong> Kattuthalaivasal";
    }
    else if (q.includes('district')) {
      return "🏛️ <strong>District Name:</strong> Sivaganga";
    }
    else if (q.includes('address') || q.includes('where does he live') || q.includes('location')) {
      return "🏠 <strong>Full Address:</strong><br>No.9, Munisipal Vaikkal Street, Kattuthalaivasal, Karaikkudi, Sivaganga District.";
    }
    else if (q.includes('age') || q.includes('how old')) {
      return "🎂 <strong>Abdul Javith</strong> is <strong>20 years old</strong>.";
    } 
    else if (q.includes('single') || q.includes('commited') || q.includes('committed') || q.includes('relationship') || q.includes('gf') || q.includes('girlfriend') || q.includes('marital')) {
      return "❤️ <strong>Relationship Status:</strong> Abdul Javith is currently <strong>Single</strong> and focused on building his tech career!";
    } 
    else if (q.includes('currently doing') || q.includes('what is he doing') || q.includes('current work') || q.includes('job') || q.includes('miniso') || q.includes('karaikkudi')) {
      return "💼 <strong>Currently Doing:</strong><br>• He is studying <strong>3rd Year B.E. CSE</strong> (Computer Science & Engineering).<br>• He is also working part-time at the <strong>Miniso Franchise Store in Karaikkudi</strong>! 🛍️";
    } 
    else if (q.includes('father') || q.includes('dad')) {
      return "👨‍👦 <strong>Father's Name:</strong> Abdul Nazar";
    } 
    else if (q.includes('mother') || q.includes('mom')) {
      return "👩‍👦 <strong>Mother's Name:</strong> Jarina Begum";
    } 
    else if (q.includes('first brother') || q.includes('1st brother') || q.includes('elder brother')) {
      return "👦 <strong>First Brother's Name:</strong> Mohamed Jameel";
    } 
    else if (q.includes('second brother') || q.includes('2nd brother')) {
      return "👦 <strong>Second Brother's Name:</strong> Mohamed Faisal";
    } 
    else if (q.includes('third brother') || q.includes('3rd brother') || q.includes('youngest brother')) {
      return "👦 <strong>Third Brother's Name:</strong> Abdul Basith";
    } 
    else if (q.includes('family')) {
      return "👨‍👩‍👦‍👦 <strong>Abdul Javith's Family:</strong><br>• <strong>Father:</strong> Abdul Nazar<br>• <strong>Mother:</strong> Jarina Begum<br>• <strong>1st Brother:</strong> Mohamed Jameel<br>• <strong>2nd Brother:</strong> Mohamed Faisal<br>• <strong>3rd Brother:</strong> Abdul Basith";
    } 
    // Portfolio & Technical
    else if (q.includes('skill') || q.includes('technology') || q.includes('stack') || q.includes('know')) {
      return "💡 <strong>Abdul's Technical Stack:</strong><br>• <strong>Languages:</strong> HTML5, CSS3, JavaScript (ES6+), Python, Java, SQL<br>• <strong>Tools:</strong> Git, GitHub, VS Code, REST APIs<br>• <strong>Specialties:</strong> Responsive Design, Vector Search (MongoDB RAG), UI/UX!";
    } 
    else if (q.includes('project') || q.includes('work') || q.includes('build')) {
      return "💻 <strong>Featured Projects:</strong><br>1. <strong>Lucky Times Website</strong> — Fully responsive e-commerce web platform<br>2. <strong>RAG Vector Search Engine</strong> — Built with MongoDB & AI Data Strategy<br>3. <strong>Interactive Portfolio</strong> — Modern UI with Dark/Light theme & 3D animations!<br><a href='#projects' onclick='document.getElementById(\"aiChatbotWindow\").classList.remove(\"active\")'>👉 Scroll to Projects</a>";
    }
    else if (q.includes('certif') || q.includes('mongodb')) {
      return "📜 <strong>Official Certifications:</strong><br>• <strong>RAG with MongoDB</strong> (ID: MDBdx0ovivumg)<br>• <strong>MongoDB Basics for Students</strong> (ID: MDBd4bf0gvcv7)<br>• <strong>AI Data Strategy with MongoDB</strong> (ID: MDBhukc2xeb0z)<br><a href='#certifications' onclick='document.getElementById(\"aiChatbotWindow\").classList.remove(\"active\")'>👉 Scroll to Certifications</a>";
    }
    else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach')) {
      return "📞 <strong>Get in Touch with Abdul:</strong><br>• <strong>Email:</strong> <a href='mailto:javithabdul924@gmail.com'>javithabdul924@gmail.com</a><br>• <strong>WhatsApp:</strong> <a href='https://wa.me/916379748608' target='_blank'>+91 6379748608</a><br>• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/abdul-javith-10b9763b6/' target='_blank'>Abdul Javith Profile</a>";
    }
    else if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('study')) {
      return "🎓 <strong>Education Background:</strong><br>Abdul is currently studying <strong>3rd Year Bachelor of Engineering (B.E.)</strong> in <em>Computer Science and Engineering</em> while working part-time at Miniso Karaikkudi!";
    }
    // General Knowledge Answering Capability
    else if (q.includes('capital of india')) {
      return "🇮🇳 The capital of India is <strong>New Delhi</strong>.";
    }
    else if (q.includes('capital of france')) {
      return "🇫🇷 The capital of France is <strong>Paris</strong>.";
    }
    else if (q.includes('who created python') || q.includes('father of python')) {
      return "🐍 Python was created by <strong>Guido van Rossum</strong> in 1991.";
    }
    else if (q.includes('what is html')) {
      return "🌐 <strong>HTML</strong> stands for <em>HyperText Markup Language</em>. It is the standard language for creating Web pages.";
    }
    else if (q.includes('what is css')) {
      return "🎨 <strong>CSS</strong> stands for <em>Cascading Style Sheets</em>. It is used to format and style the layout of Web pages.";
    }
    else if (q.includes('what is javascript') || q.includes('what is js')) {
      return "⚡ <strong>JavaScript</strong> is a programming language used to build interactive and dynamic content on websites.";
    }
    else if (q.includes('who is prime minister of india') || q.includes('pm of india')) {
      return "🇮🇳 The Prime Minister of India is <strong>Narendra Modi</strong>.";
    }
    else if (q.includes('what is ai') || q.includes('artificial intelligence')) {
      return "🤖 <strong>AI (Artificial Intelligence)</strong> refers to computer systems engineered to perform tasks that typically require human intelligence, like speech recognition, learning, and decision-making.";
    }
    else {
      return "🤖 Thanks for asking! I'm trained with Abdul's personal background, portfolio details, and general knowledge. Feel free to ask about his age, family, education, skills, projects, or general tech/GK questions! 🚀";
    }
  }

  function handleSend() {
    const text = aiChatInput.value.trim();
    if (!text) return;

    appendUserMessage(text);
    aiChatInput.value = '';

    // Simulate typing delay for bot
    setTimeout(() => {
      const reply = generateAIResponse(text);
      appendBotMessage(reply);
    }, 600);
  }

  if (aiSendBtn) {
    aiSendBtn.addEventListener('click', handleSend);
  }

  if (aiChatInput) {
    aiChatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      aiChatInput.value = q;
      handleSend();
    });
  });

});