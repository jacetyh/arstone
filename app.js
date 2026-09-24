/**
 * ARstone — Interaktywny silnik strony
 * - Dynamiczne ładowanie realizacji z katalogów (projects.json)
 * - Sortowanie zdjęć: numeryczne (1, 2, ...) lub losowe (shuffle)
 * - Pełnoekranowa galeria inwestycji (Lightbox)
 * - Animacja HTML5: uderzenia młotkiem w kamień z fizyką cząsteczek i transformacją w blat
 * - Syntetyczny dźwięk kamieniarski (Web Audio API)
 */

// Fallbackowe dane projektów (gdy strona jest uruchamiana bezpośrednio z pliku file://)
const DEFAULT_PROJECTS = [
  {
    "id": "01-kuchnia-marmur-calacatta",
    "title": "Kuchnia Rezydencji Wilanów — Marmur Calacatta Gold",
    "category": "Kuchnie & Blaty",
    "description": "Monolityczna wyspa kuchenna oraz blaty robocze z marmuru Calacatta z ciągłością użylenia (bookmatch).",
    "location": "Warszawa, Polska",
    "is_random": false,
    "cover": "projects/01-kuchnia-marmur-calacatta/1.svg",
    "images": [
      "projects/01-kuchnia-marmur-calacatta/1.svg",
      "projects/01-kuchnia-marmur-calacatta/2.svg",
      "projects/01-kuchnia-marmur-calacatta/3.svg"
    ]
  },
  {
    "id": "02-lazienka-granit-nero-marquina",
    "title": "Łazienka Master — Czarny Marmur Nero Marquina",
    "category": "Łazienki",
    "description": "Wykończenie strefy prysznicowej i blat umywalkowy z kontrastowym białym użyleniem w polerze.",
    "location": "Warszawa, Polska",
    "is_random": false,
    "cover": "projects/02-lazienka-granit-nero-marquina/1.svg",
    "images": [
      "projects/02-lazienka-granit-nero-marquina/1.svg",
      "projects/02-lazienka-granit-nero-marquina/2.svg"
    ]
  },
  {
    "id": "03-wyspa-kuchenna-kwarcyt-taj-mahal",
    "title": "Wyspa Kuchenna — Naturalny Kwarcyt Taj Mahal",
    "category": "Kuchnie & Blaty",
    "description": "Ekskluzywny kwarcyt brazylijski o perłowym odcieniu i legendarnej odporności.",
    "location": "Warszawa, Polska",
    "is_random": true,
    "cover": "projects/03-wyspa-kuchenna-kwarcyt-taj-mahal/detal.svg",
    "images": [
      "projects/03-wyspa-kuchenna-kwarcyt-taj-mahal/detal.svg",
      "projects/03-wyspa-kuchenna-kwarcyt-taj-mahal/front.svg",
      "projects/03-wyspa-kuchenna-kwarcyt-taj-mahal/zblizenie.svg"
    ]
  },
  {
    "id": "04-schody-lewitujace-granit-star-galaxy",
    "title": "Schody Wspornikowe — Granit Star Galaxy",
    "category": "Schody & Posadzki",
    "description": "Samonośne stopnie kamienne z głęboką czernią i miedziano-złotymi kryształami bronzytu.",
    "location": "Warszawa, Polska",
    "is_random": false,
    "cover": "projects/04-schody-lewitujace-granit-star-galaxy/1.svg",
    "images": [
      "projects/04-schody-lewitujace-granit-star-galaxy/1.svg",
      "projects/04-schody-lewitujace-granit-star-galaxy/2.svg"
    ]
  }
];

let allProjects = [];
let currentFilter = 'all';

// Stan Lightboxa
let currentProject = null;
let currentImageIndex = 0;
let activeGalleryImages = [];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  loadProjects();
  initCraftAnimation();
  initContactForm();
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

/* ==========================================================================
   Motyw Dark / Light
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('arstone-theme') || 'dark';

  if (savedTheme === 'light') {
    root.setAttribute('data-theme', 'light');
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('arstone-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('arstone-theme', 'light');
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
    });
  });
}

/* ==========================================================================
   Ładowanie i Filtrowanie Projektów
   ========================================================================== */
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">Ładowanie inwestycji...</div>';

  try {
    const response = await fetch('./projects.json');
    if (!response.ok) throw new Error('Brak pliku projects.json');
    allProjects = await response.json();
  } catch (err) {
    console.warn('Wczytano domyślny rejestr projektów (offline fallback):', err);
    allProjects = DEFAULT_PROJECTS;
  }

  renderProjects();
  initFilterButtons();
}

function initFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-category');
      renderProjects();
    });
  });
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';

  const filtered = currentFilter === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.category === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">Brak realizacji w wybranej kategorii.</div>';
    return;
  }

  filtered.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Otwórz galerię: ${project.title}`);

    card.innerHTML = `
      <div class="project-cover-wrap">
        <img src="${project.cover}" alt="${project.title}" class="project-cover-img" loading="lazy">
        <span class="project-category-badge">${project.category}</span>
        <span class="project-photos-count">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          ${project.images.length} ${project.images.length === 1 ? 'zdjęcie' : (project.images.length < 5 ? 'zdjęcia' : 'zdjęć')}
        </span>
      </div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="project-footer">
          <span>${project.location || 'Polska'}</span>
          <span class="project-open-link">
            Zobacz album &rarr;
          </span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openLightbox(project));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(project);
      }
    });

    grid.appendChild(card);
  });
}

/* ==========================================================================
   Obsługa Galerii Lightbox (z sortowaniem numerycznym lub losowym)
   ========================================================================== */
function openLightbox(project) {
  currentProject = project;
  
  // Zastosowanie reguły użytkownika:
  // "zdjęcia jeśli nie będą ponazywane 1, 2 z dowolnym rozszeżeniem wyświetlaj losowo, jeśli będą ponumerowane wyświetlaj je w tej kolejności."
  if (project.is_random) {
    // Losowe tasowanie (Fisher-Yates shuffle)
    activeGalleryImages = [...project.images];
    for (let i = activeGalleryImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeGalleryImages[i], activeGalleryImages[j]] = [activeGalleryImages[j], activeGalleryImages[i]];
    }
  } else {
    // Kolejność numeryczna zdefiniowana w nazwach
    activeGalleryImages = [...project.images];
  }

  currentImageIndex = 0;

  const modal = document.getElementById('lightboxModal');
  document.getElementById('lightboxTitle').textContent = project.title;
  document.getElementById('lightboxDesc').textContent = `${project.category} &bull; ${project.description}`;
  
  const orderIndicator = document.getElementById('lightboxOrderIndicator');
  if (project.is_random) {
    orderIndicator.innerHTML = '<span style="color: var(--accent-gold-light);">&#x2684; Kolejność losowa (zdjęcia nienumerowane)</span>';
  } else {
    orderIndicator.innerHTML = '<span style="color: var(--accent-blue);">&#x2713; Kolejność chronologiczna (ponumerowane 1, 2...)</span>';
  }

  // Budowa miniaturek
  const thumbsWrap = document.getElementById('lightboxThumbs');
  thumbsWrap.innerHTML = '';
  activeGalleryImages.forEach((imgSrc, idx) => {
    const thumb = document.createElement('img');
    thumb.src = imgSrc;
    thumb.className = `lightbox-thumb ${idx === 0 ? 'active' : ''}`;
    thumb.alt = `Miniatura ${idx + 1}`;
    thumb.addEventListener('click', () => {
      showLightboxImage(idx);
    });
    thumbsWrap.appendChild(thumb);
  });

  showLightboxImage(0);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function showLightboxImage(index) {
  if (!activeGalleryImages.length) return;
  if (index < 0) index = activeGalleryImages.length - 1;
  if (index >= activeGalleryImages.length) index = 0;

  currentImageIndex = index;
  const mainImg = document.getElementById('lightboxMainImg');
  mainImg.src = activeGalleryImages[currentImageIndex];

  // Aktualizuj aktywne miniatury
  const thumbs = document.querySelectorAll('.lightbox-thumb');
  thumbs.forEach((t, i) => {
    t.classList.toggle('active', i === currentImageIndex);
    if (i === currentImageIndex) {
      t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Obsługa przycisków i klawiatury w Lightboxie
document.getElementById('lightboxCloseBtn')?.addEventListener('click', closeLightbox);
document.getElementById('lightboxPrevBtn')?.addEventListener('click', () => showLightboxImage(currentImageIndex - 1));
document.getElementById('lightboxNextBtn')?.addEventListener('click', () => showLightboxImage(currentImageIndex + 1));

window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightboxModal');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
  if (e.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
});

/* ==========================================================================
   ANIMACJA HTML5: Stukanie młotkiem w kamień -> Transformacja w blat
   ========================================================================== */
function initCraftAnimation() {
  const hammer = document.getElementById('craftHammer');
  const rock = document.getElementById('craftRock');
  const slab = document.getElementById('craftSlab');
  const fill = document.getElementById('craftProgressFill');
  const progressPercent = document.getElementById('craftProgressPercent');
  const statusDesc = document.getElementById('craftStatusDesc');
  const hitBtn = document.getElementById('strikeHammerBtn');
  const autoBtn = document.getElementById('autoTransformBtn');
  const soundBtn = document.getElementById('soundToggleBtn');
  const canvas = document.getElementById('particlesCanvas');

  if (!hammer || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resizeCanvas() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Fizyka cząsteczek
  let particles = [];

  class Spark {
    constructor(x, y, isGlow = false) {
      this.x = x;
      this.y = y;
      const angle = (Math.random() * -Math.PI) - 0.2;
      const speed = Math.random() * 8 + 3;
      this.vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 4;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.25;
      this.life = 1;
      this.decay = Math.random() * 0.03 + 0.02;
      this.size = Math.random() * 3 + 1.5;
      this.color = isGlow ? '#38bdf8' : (Math.random() > 0.4 ? '#fbbf24' : '#f59e0b');
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.life -= this.decay;
    }
    draw(context) {
      context.save();
      context.globalAlpha = Math.max(this.life, 0);
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  function emitSparks(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      particles.push(new Spark(x, y, Math.random() > 0.6));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Dźwięk syntetyczny przez Web Audio API
  let audioCtx = null;
  let isSoundEnabled = false;

  function playChiselSound() {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      // Częstotliwość uderzenia metal o kamień (wysoki rezonans)
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  soundBtn?.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundBtn.innerHTML = isSoundEnabled 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Dźwięk: WŁ'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Dźwięk: WYŁ';
  });

  // Etapy obróbki
  const STAGES = [
    { p: 0, text: "Etap 1: Wyselekcjonowany, surowy blok skalny z kamieniołomu" },
    { p: 20, text: "Etap 2: Wstępne ciosanie i odłupywanie narzutów skalnych" },
    { p: 40, text: "Etap 3: Formatowanie geometrii i wyznaczanie płaszczyzny blatu" },
    { p: 65, text: "Etap 4: Precyzyjne fasetowanie i fazowanie krawędzi (CNC / ręczne)" },
    { p: 85, text: "Etap 5: Stopniowy szlif diamentowy i wydobywanie użylenia" },
    { p: 100, text: "Dzieło skończone! Luksusowy blat kamienny z lustrzanym polerem ✨" }
  ];

  let currentStep = 0;
  let autoInterval = null;

  function strike() {
    // Animacja zamachu młotka
    hammer.classList.remove('hit-anim');
    void hammer.offsetWidth; // reflow
    hammer.classList.add('hit-anim');

    // Drżenie skały
    rock.classList.remove('shake');
    void rock.offsetWidth;
    rock.classList.add('shake');

    // Dźwięk i iskry
    playChiselSound();
    const hitX = width * 0.48;
    const hitY = height * 0.48;
    emitSparks(hitX, hitY, 30);

    // Następny krok
    currentStep++;
    if (currentStep >= STAGES.length) {
      currentStep = 0;
    }

    updateStageDisplay();
  }

  function updateStageDisplay() {
    const stage = STAGES[currentStep];
    const progress = stage.p;

    fill.style.width = `${progress}%`;
    progressPercent.textContent = `${progress}%`;
    statusDesc.textContent = stage.text;

    // Przekształcenie surowego bloku w gładki blat
    const transitionRatio = progress / 100;
    rock.style.opacity = (1 - transitionRatio).toString();
    rock.style.transform = `scale(${1 - transitionRatio * 0.25})`;

    slab.style.opacity = transitionRatio.toString();
    slab.style.transform = `scale(${0.75 + transitionRatio * 0.25})`;

    if (progress === 100) {
      // Efekt sukcesu: fontanna złotych iskier
      emitSparks(width * 0.5, height * 0.5, 60);
    }
  }

  // Ręczne uderzenie młotkiem
  hitBtn?.addEventListener('click', () => {
    stopAuto();
    strike();
  });

  hammer?.addEventListener('click', () => {
    stopAuto();
    strike();
  });

  // Automatyczny cykl
  function stopAuto() {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
      if (autoBtn) autoBtn.textContent = 'Automatyczna transformacja ⚡';
    }
  }

  autoBtn?.addEventListener('click', () => {
    if (autoInterval) {
      stopAuto();
    } else {
      autoBtn.textContent = 'Zatrzymaj animację ⏸';
      currentStep = 0;
      updateStageDisplay();
      autoInterval = setInterval(() => {
        strike();
        if (currentStep === STAGES.length - 1) {
          // Poczekaj chwilę po ukończeniu blatu przed ponownym startem
          setTimeout(() => {}, 2000);
        }
      }, 1200);
    }
  });

  // Domyślna inicjalizacja
  updateStageDisplay();
}

/* ==========================================================================
   Formularz kontaktowy
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = 'Wysyłanie zapytania...';

    setTimeout(() => {
      btn.innerHTML = 'Dziękujemy! Skontaktujemy się w 24h &check;';
      btn.style.background = '#10b981';
      form.reset();

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 4000);
    }, 800);
  });
}
