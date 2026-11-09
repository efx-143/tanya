/**
 * ===================================================================
 * 💖 MAIN INTERACTION CONTROLLER FOR ANOKHEE'S BIRTHDAY
 * ===================================================================
 * Orchestrates countdowns, 3D triggers, mini-games, cards, and letters.
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.BIRTHDAY_CONFIG;
  if (!config) {
    console.error("BIRTHDAY_CONFIG not loaded!");
    return;
  }

  // 1. Initialize 3D Engine
  if (window.cosmic3D) {
    window.cosmic3D.initAll();
  }

  // 2. Populate Dynamic Text from Config
  populateConfigData(config);

  // 3. Initialize Midnight Countdown
  initMidnightCountdown(config);

  // 4. Initialize Cake Actions
  initCakeInteractions();

  // 5. Initialize Reasons Deck
  initReasonsDeck(config);

  // 6. Initialize 3D Polaroids
  initPolaroidGallery(config);

  // 7. Initialize Wax-Sealed Love Letter
  initLoveLetter(config);

  // 8. Initialize Love Quiz & Certificate
  initLoveQuiz(config);

  // 9. Initialize Wishing Sky Lanterns
  initSkyLanternWish();

  // 10. Initialize Falling Hearts Catch Mini-game
  initFallingHeartsGame();

  // 11. Music & Global UI Events
  initMusicAndNavigation();
});

// -------------------------------------------------------------
// DYNAMIC CONFIG INJECTION
// -------------------------------------------------------------
function populateConfigData(config) {
  // Update all elements with data-bind attributes
  document.querySelectorAll('[data-bind="girlName"]').forEach(el => el.textContent = config.girlName);
  document.querySelectorAll('[data-bind="boyName"]').forEach(el => el.textContent = config.boyName);
  document.querySelectorAll('[data-bind="girlNickname"]').forEach(el => el.textContent = config.girlNickname);

  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroSubtitle) heroSubtitle.textContent = config.heroSubtitle;

  // Anokhee definition
  const defWord = document.getElementById('def-word');
  if (defWord) defWord.textContent = config.definition.word;
  const defPhonetic = document.getElementById('def-phonetic');
  if (defPhonetic) defPhonetic.textContent = config.definition.phonetic;
  const defMeaning1 = document.getElementById('def-meaning1');
  if (defMeaning1) defMeaning1.textContent = config.definition.meaning1;
  const defMeaning2 = document.getElementById('def-meaning2');
  if (defMeaning2) defMeaning2.textContent = config.definition.meaning2;
  const defMeaning3 = document.getElementById('def-meaning3');
  if (defMeaning3) defMeaning3.textContent = config.definition.meaning3;
  const defQuote = document.getElementById('def-quote');
  if (defQuote) defQuote.textContent = config.definition.loveQuote;

  // Stats Grid
  const statsGrid = document.getElementById('stats-grid');
  if (statsGrid && config.stats) {
    statsGrid.innerHTML = '';
    config.stats.forEach(st => {
      const card = document.createElement('div');
      card.className = 'glass-card stat-item';
      card.innerHTML = `
        <div class="stat-icon">${st.icon}</div>
        <div class="stat-value">${st.value}</div>
        <div class="stat-label">${st.label}</div>
      `;
      statsGrid.appendChild(card);
    });
  }
}

// -------------------------------------------------------------
// MIDNIGHT COUNTDOWN CONTROLLER
// -------------------------------------------------------------
function initMidnightCountdown(config) {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  const unlockBtn = document.getElementById('unlock-magic-btn');
  const overlay = document.getElementById('midnight-lock-overlay');

  const targetDate = new Date(config.birthdayTargetTime).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      const cdTitle = document.getElementById('countdown-title');
      if (cdTitle) cdTitle.textContent = "🎉 IT'S MIDNIGHT! HAPPY BIRTHDAY! 🎉";
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      // Start Romantic Audio
      if (window.romanticAudio) {
        window.romanticAudio.play();
      }

      // Confetti burst
      triggerConfettiBurst();

      // Smooth curtain reveal
      if (overlay) {
        overlay.classList.add('unlocked');
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 800);
      }
    });
  }
}

// -------------------------------------------------------------
// 3D CAKE INTERACTIONS
// -------------------------------------------------------------
function initCakeInteractions() {
  const blowBtn = document.getElementById('blow-candles-btn');
  const relightBtn = document.getElementById('relight-candles-btn');
  const cutBtn = document.getElementById('cut-cake-btn');
  const messageBox = document.getElementById('cake-celebration-message');

  if (blowBtn) {
    blowBtn.addEventListener('click', () => {
      if (window.cosmic3D) {
        const success = window.cosmic3D.blowOutCandles();
        if (success) {
          triggerGrandFireworks();
          if (messageBox) {
            messageBox.innerHTML = `
              <div class="cake-wish-banner animate-pop">
                <h3>✨ All Your Wishes Will Come True, Anokhee! ✨</h3>
                <p>"May your year be as radiant, sweet, and unforgettable as you are to me." — Taniksh</p>
              </div>
            `;
          }
          blowBtn.style.display = 'none';
          if (relightBtn) relightBtn.style.display = 'inline-flex';
        }
      }
    });
  }

  if (relightBtn) {
    relightBtn.addEventListener('click', () => {
      if (window.cosmic3D) {
        window.cosmic3D.relightCandles();
        if (messageBox) {
          messageBox.innerHTML = '';
        }
        relightBtn.style.display = 'none';
        if (blowBtn) blowBtn.style.display = 'inline-flex';
      }
    });
  }

  if (cutBtn) {
    cutBtn.addEventListener('click', () => {
      triggerConfettiBurst();
      if (window.romanticAudio) {
        window.romanticAudio.playSparkleSound();
      }
      showCustomModal(
        "🍰 A Sweet Slice for Anokhee",
        `Here is the first and sweetest slice of birthday cake just for you! 
        Taniksh promises to always keep your life filled with sweetness, warmth, and unlimited food dates. ❤️`
      );
    });
  }
}

// -------------------------------------------------------------
// REASONS DECK (24 REASONS WHY SHE IS ONE IN A BILLION)
// -------------------------------------------------------------
function initReasonsDeck(config) {
  const container = document.getElementById('reasons-card-container');
  const prevBtn = document.getElementById('reason-prev-btn');
  const nextBtn = document.getElementById('reason-next-btn');
  const randomBtn = document.getElementById('reason-random-btn');
  const counterEl = document.getElementById('reason-counter');

  let currentIndex = 0;
  const reasons = config.reasons || [];

  function renderCard(idx) {
    if (!reasons.length) return;
    const r = reasons[idx];
    if (container) {
      container.innerHTML = `
        <div class="glass-card reason-card animate-card-swap">
          <div class="reason-badge">Reason #${r.num} of ${reasons.length}</div>
          <h3 class="reason-title">${r.title}</h3>
          <p class="reason-desc">${r.desc}</p>
          <div class="reason-footer">
            <span class="reason-heart">💖</span>
            <span class="reason-tag">Always You</span>
          </div>
        </div>
      `;
    }
    if (counterEl) {
      counterEl.textContent = `${idx + 1} / ${reasons.length}`;
    }
  }

  renderCard(currentIndex);

  // Mobile Touch Swipe support for Reasons Deck
  let touchStartX = 0;
  let touchEndX = 0;
  if (container) {
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          // Swipe Left -> Next
          currentIndex = (currentIndex + 1) % reasons.length;
        } else {
          // Swipe Right -> Prev
          currentIndex = (currentIndex - 1 + reasons.length) % reasons.length;
        }
        renderCard(currentIndex);
        if (window.romanticAudio) window.romanticAudio.playHeartPopSound();
      }
    }, { passive: true });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + reasons.length) % reasons.length;
      renderCard(currentIndex);
      if (window.romanticAudio) window.romanticAudio.playHeartPopSound();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % reasons.length;
      renderCard(currentIndex);
      if (window.romanticAudio) window.romanticAudio.playHeartPopSound();
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      let nextRand;
      do {
        nextRand = Math.floor(Math.random() * reasons.length);
      } while (nextRand === currentIndex && reasons.length > 1);
      currentIndex = nextRand;
      renderCard(currentIndex);
      if (window.romanticAudio) window.romanticAudio.playSparkleSound();
    });
  }
}

// -------------------------------------------------------------
// 3D POLAROID GALLERY
// -------------------------------------------------------------
function initPolaroidGallery(config) {
  const grid = document.getElementById('polaroid-grid');
  if (!grid || !config.memories) return;

  grid.innerHTML = '';
  config.memories.forEach((mem, idx) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card-wrapper';
    card.innerHTML = `
      <div class="polaroid-card">
        <div class="polaroid-inner">
          <!-- Front Face -->
          <div class="polaroid-front">
            <div class="tape-strip"></div>
            <div class="polaroid-photo-frame">
              <img src="${mem.image}" alt="${mem.title}" class="polaroid-img" />
              <div class="photo-glare"></div>
            </div>
            <div class="polaroid-caption">
              <h4>${mem.title}</h4>
              <p class="polaroid-date">${mem.date} • ${mem.tag}</p>
            </div>
            <span class="tap-hint">Tap to flip ↺</span>
          </div>
          <!-- Back Face -->
          <div class="polaroid-back">
            <div class="polaroid-back-content">
              <span class="polaroid-back-heart">💌</span>
              <h4>Note from Taniksh</h4>
              <p class="polaroid-note-text">"${mem.caption}"</p>
              <div class="polaroid-back-signature">— Taniksh ❤️</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 3D Tilt Effect on mouse movement
    const cardEl = card.querySelector('.polaroid-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -12;
      const tiltY = (x / (rect.width / 2)) * 12;
      if (!cardEl.classList.contains('flipped')) {
        cardEl.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.04, 1.04, 1.04)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!cardEl.classList.contains('flipped')) {
        cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });

    // Flip card on click
    card.addEventListener('click', () => {
      cardEl.classList.toggle('flipped');
      if (cardEl.classList.contains('flipped')) {
        cardEl.style.transform = 'perspective(1000px) rotateY(180deg)';
      } else {
        cardEl.style.transform = 'perspective(1000px) rotateY(0deg)';
      }
      if (window.romanticAudio) window.romanticAudio.playHeartPopSound();
    });

    grid.appendChild(card);
  });
}

// -------------------------------------------------------------
// WAX-SEALED LOVE LETTER
// -------------------------------------------------------------
function initLoveLetter(config) {
  const envelope = document.getElementById('wax-envelope');
  const letterModal = document.getElementById('letter-modal');
  const closeBtn = document.getElementById('close-letter-btn');

  // Fill in letter texts
  const l = config.letter;
  if (l) {
    const sal = document.getElementById('letter-salutation');
    if (sal) sal.textContent = l.salutation;
    const p1 = document.getElementById('letter-p1');
    if (p1) p1.textContent = l.p1;
    const p2 = document.getElementById('letter-p2');
    if (p2) p2.textContent = l.p2;
    const p3 = document.getElementById('letter-p3');
    if (p3) p3.textContent = l.p3;
    const clos = document.getElementById('letter-closing');
    if (clos) clos.textContent = l.closing;
    const sig = document.getElementById('letter-signature');
    if (sig) sig.textContent = l.signature;
    const ps = document.getElementById('letter-ps');
    if (ps) ps.textContent = l.ps;
  }

  if (envelope) {
    envelope.addEventListener('click', () => {
      envelope.classList.add('opened');
      if (window.romanticAudio) {
        window.romanticAudio.playWaxSealSound();
      }

      setTimeout(() => {
        if (letterModal) {
          letterModal.classList.add('visible');
          triggerConfettiBurst();
        }
      }, 700);
    });
  }

  if (closeBtn && letterModal) {
    closeBtn.addEventListener('click', () => {
      letterModal.classList.remove('visible');
    });
  }
}

// -------------------------------------------------------------
// LOVE QUIZ & OFFICIAL GIRLFRIEND CERTIFICATE
// -------------------------------------------------------------
function initLoveQuiz(config) {
  const quizBox = document.getElementById('quiz-box');
  const certSection = document.getElementById('certificate-container');
  if (!quizBox || !config.quiz) return;

  let qIndex = 0;
  const questions = config.quiz;

  function renderQuizQuestion() {
    if (qIndex >= questions.length) {
      // Quiz Finished! Unlock Certificate
      quizBox.innerHTML = `
        <div class="glass-card quiz-complete animate-pop">
          <h3>🎉 Score: 1,000,000% Perfect Match! 🎉</h3>
          <p>You passed the Taniksh & Anokhee Quiz with flying colors! Your official certification has been unlocked below.</p>
        </div>
      `;
      if (certSection) {
        certSection.style.display = 'block';
        certSection.scrollIntoView({ behavior: 'smooth' });
        triggerGrandFireworks();
      }
      return;
    }

    const q = questions[qIndex];
    quizBox.innerHTML = `
      <div class="glass-card quiz-card animate-card-swap">
        <div class="quiz-question-num">Question ${qIndex + 1} of ${questions.length}</div>
        <h3 class="quiz-question">${q.question}</h3>
        <div class="quiz-options-list">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt-btn" data-opt="${i}">
              <span class="opt-bullet">✨</span> ${opt}
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback" class="quiz-feedback"></div>
      </div>
    `;

    quizBox.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const feedback = document.getElementById('quiz-feedback');
        if (feedback) {
          feedback.innerHTML = `<p class="quiz-success-msg">${q.response}</p>`;
          triggerConfettiBurst();
          if (window.romanticAudio) window.romanticAudio.playSparkleSound();
        }
        setTimeout(() => {
          qIndex++;
          renderQuizQuestion();
        }, 2200);
      });
    });
  }

  renderQuizQuestion();

  // Print / Save Certificate Button
  const printBtn = document.getElementById('print-cert-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// -------------------------------------------------------------
// SKY LANTERN WISH CAPSULE
// -------------------------------------------------------------
function initSkyLanternWish() {
  const sendBtn = document.getElementById('send-wish-btn');
  const inputEl = document.getElementById('wish-input');
  const wishListEl = document.getElementById('recent-wishes-list');

  if (sendBtn && inputEl) {
    sendBtn.addEventListener('click', () => {
      const text = inputEl.value.trim();
      if (!text) {
        alert("Please write your sweet birthday wish first! ✨");
        return;
      }

      // Release 3D Lantern
      if (window.cosmic3D) {
        window.cosmic3D.releaseUserWishLantern(text);
      }

      // Confetti & Audio
      triggerConfettiBurst();

      // Append to wish wall
      if (wishListEl) {
        const wishTag = document.createElement('div');
        wishTag.className = 'wish-pill animate-pop';
        wishTag.innerHTML = `🏮 "${text}" <span class="wish-time">• Flying into the Stars</span>`;
        wishListEl.prepend(wishTag);
      }

      inputEl.value = '';
      showCustomModal("✨ Your Wish Has Been Released!", `Your wish has been launched into the night sky alongside the stars. Taniksh promises to do everything in his power to make all your dreams come true! ❤️`);
    });
  }
}

// -------------------------------------------------------------
// CATCH TANIKSH'S FALLING HEARTS MINI-GAME
// -------------------------------------------------------------
function initFallingHeartsGame() {
  const container = document.getElementById('falling-hearts-stage');
  const scoreEl = document.getElementById('heart-score-count');
  const perkEl = document.getElementById('heart-unlocked-perk');
  if (!container) return;

  let score = 0;
  const compliments = [
    "Cute smile detected! 🥰",
    "Taniksh's heart skipped a beat! 💓",
    "Bonus: 1000 cuddles unlocked! 🤗",
    "Anokhee is the prettiest in the universe! 👑",
    "Unlimited lifetime backrubs coupon unlocked! 💆‍♀️",
    "Late-night ice cream date on Taniksh! 🍨",
    "Certified Most Loved Girl on Earth! 💖"
  ];

  function spawnFallingHeart() {
    if (!container) return;
    const heart = document.createElement('div');
    heart.className = 'floating-game-heart';
    const emojis = ['💖', '💕', '✨', '🌸', '🍓', '👑'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const startX = Math.random() * (container.clientWidth - 40);
    const duration = 3.5 + Math.random() * 3.0;

    heart.style.left = `${startX}px`;
    heart.style.animationDuration = `${duration}s`;

    const collectHeart = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      score++;
      if (scoreEl) scoreEl.textContent = score;
      if (window.romanticAudio) window.romanticAudio.playHeartPopSound();

      // Show floating popup at click location
      const pop = document.createElement('div');
      pop.className = 'point-pop';
      pop.textContent = '+1 Love!';
      pop.style.left = heart.style.left;
      pop.style.top = heart.offsetTop + 'px';
      container.appendChild(pop);
      setTimeout(() => pop.remove(), 800);

      if (perkEl && score % 3 === 0) {
        const comp = compliments[(Math.floor(score / 3) - 1) % compliments.length];
        perkEl.textContent = comp;
        triggerConfettiBurst();
      }

      heart.remove();
    };

    heart.addEventListener('pointerdown', collectHeart);
    heart.addEventListener('click', collectHeart);

    container.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) heart.remove();
    }, duration * 1000);
  }

  // Spawn periodic hearts
  setInterval(spawnFallingHeart, 1200);
}

// -------------------------------------------------------------
// MUSIC PLAYER & NAV UI
// -------------------------------------------------------------
function initMusicAndNavigation() {
  const musicBtn = document.getElementById('music-toggle-btn');
  if (musicBtn && window.romanticAudio) {
    musicBtn.addEventListener('click', () => {
      window.romanticAudio.toggleMusic();
    });
  }

  // Mobile audio gesture unlock
  const unlockAudioMobile = () => {
    if (window.romanticAudio && !window.romanticAudio.isPlaying) {
      window.romanticAudio.play();
    }
  };
  document.addEventListener('touchstart', unlockAudioMobile, { once: true, passive: true });

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// -------------------------------------------------------------
// CONFETTI & CELEBRATION EFFECTS
// -------------------------------------------------------------
function triggerConfettiBurst() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b9d', '#ffd166', '#c77dff', '#ffffff']
    });
  }
}

function triggerGrandFireworks() {
  if (typeof confetti !== 'function') return;

  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 45 * (timeLeft / duration);

    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 350);
}

// -------------------------------------------------------------
// CUSTOM SWEET MODAL
// -------------------------------------------------------------
function showCustomModal(title, message) {
  let modal = document.getElementById('custom-sweet-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'custom-sweet-modal';
    modal.className = 'custom-modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="glass-card custom-modal-content animate-pop">
      <h3 class="modal-title">${title}</h3>
      <p class="modal-body">${message}</p>
      <button class="primary-glow-btn modal-close-btn" onclick="this.closest('#custom-sweet-modal').classList.remove('active')">
        Sweet! ❤️
      </button>
    </div>
  `;

  modal.classList.add('active');
}

