/**
 * ===================================================================
 * 🎵 DREAMY PROCEDURAL ROMANTIC AUDIO & SFX ENGINE
 * ===================================================================
 * Zero external dependencies. Uses HTML5 Web Audio API.
 * Never fails, never blocked by CORS, works completely offline!
 * Plays soothing romantic piano arpeggios & provides custom sound effects.
 */

class RomanticAudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    // Set to very soft background minimum volume as requested
    this.volume = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.music && typeof window.BIRTHDAY_CONFIG.music.volume === 'number') 
      ? window.BIRTHDAY_CONFIG.music.volume 
      : 0.18;
    this.melodyTimer = null;
    this.customAudio = null;
    this.hasCustomAudio = false;
    this.noteIndex = 0;
    
    // Romantic chords in C major / A minor (Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 -> Em7)
    // Dreamy frequencies in Hz
    this.chords = [
      // Cmaj7 (C4, E4, G4, B4, D5)
      [261.63, 329.63, 392.00, 493.88, 587.33],
      // Am9 (A3, C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00, 493.88],
      // Fmaj7 (F3, A3, C4, E4, G4)
      [174.61, 220.00, 261.63, 329.63, 392.00],
      // Gsus4 / G6 (G3, C4, D4, E4, G4)
      [196.00, 261.63, 293.66, 329.63, 392.00],
      // Em7 (E3, G3, B3, D4, F#4)
      [164.81, 196.00, 246.94, 293.66, 369.99]
    ];
    this.chordIndex = 0;

    this.checkCustomAudio();
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  checkCustomAudio() {
    const musicConfig = window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.music;
    const primaryPath = (musicConfig && musicConfig.customAudioPath) ? musicConfig.customAudioPath : 'perfect_chorus.mp3';
    const fallbackPath = (musicConfig && musicConfig.fallbackAudioPath) ? musicConfig.fallbackAudioPath : 'assets/audio/perfect_chorus.mp3';

    const tryLoadAudio = (src, onFail) => {
      const audio = new Audio();
      audio.src = src;
      audio.loop = true;
      audio.volume = this.volume;
      audio.preload = 'auto';

      audio.addEventListener('canplaythrough', () => {
        this.customAudio = audio;
        this.hasCustomAudio = true;
      }, { once: true });

      audio.addEventListener('error', () => {
        if (onFail) onFail();
      }, { once: true });

      // Trigger load
      audio.load();
    };

    tryLoadAudio(primaryPath, () => {
      tryLoadAudio(fallbackPath, () => {
        // Fallback silently to procedural synthesizer
        this.hasCustomAudio = false;
      });
    });
  }

  playMelodyNote(freq, time, duration = 2.2, type = 'sine') {
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      // Lowpass filter for warm, dreamy felt-piano tone
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.Q.setValueAtTime(1.5, time);

      // Soft attack, long lush decay (bell/harp like)
      const baseGain = 0.08 * this.volume;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(baseGain, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(baseGain * 0.4, time + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.00001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {
      console.warn("Audio note error:", e);
    }
  }

  scheduleMelodyCycle() {
    if (!this.isPlaying || this.isMuted) return;

    this.initContext();
    const chord = this.chords[this.chordIndex];
    const now = this.ctx.currentTime;

    // Arpeggio pattern
    const pattern = [0, 1, 2, 3, 4, 3, 2, 1];
    const noteGap = 0.42;

    pattern.forEach((pIdx, step) => {
      const freq = chord[pIdx % chord.length];
      // subtle octave sparkle
      const finalFreq = (step === 4) ? freq * 1.5 : freq;
      this.playMelodyNote(finalFreq, now + (step * noteGap), 2.4, 'sine');
    });

    // Deep warm bass root note
    this.playMelodyNote(chord[0] * 0.5, now, 3.2, 'triangle');

    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    this.melodyTimer = setTimeout(() => {
      this.scheduleMelodyCycle();
    }, pattern.length * noteGap * 1000);
  }

  toggleMusic() {
    this.initContext();

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  play() {
    this.initContext();
    this.isPlaying = true;

    if (this.customAudio) {
      this.customAudio.volume = this.volume;
      const playPromise = this.customAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Audio autoplay waiting for user gesture:", err);
          // Wait for user gesture or fallback to procedural chords
          this.scheduleMelodyCycle();
        });
      }
    } else {
      clearTimeout(this.melodyTimer);
      this.scheduleMelodyCycle();
    }
    this.updateUI();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.melodyTimer);
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.updateUI();
  }

  updateUI() {
    const btn = document.getElementById('music-toggle-btn');
    const visualizer = document.getElementById('music-visualizer');
    const songName = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.music && window.BIRTHDAY_CONFIG.music.title) 
      ? window.BIRTHDAY_CONFIG.music.title 
      : "Perfect";

    if (btn) {
      if (this.isPlaying) {
        btn.innerHTML = `<span class="music-icon">🎵</span> <span class="music-label">${songName}</span>`;
        btn.classList.add('active');
        if (visualizer) visualizer.classList.add('playing');
      } else {
        btn.innerHTML = `<span class="music-icon">🔇</span> <span class="music-label">Music: Paused</span>`;
        btn.classList.remove('active');
        if (visualizer) visualizer.classList.remove('playing');
      }
    }
  }

  // --- SOUND EFFECTS ---

  playBlowSound() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // White noise whoosh
    const bufferSize = this.ctx.sampleRate * 1.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 1.2);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.45 * this.volume, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 1.4);
  }

  playSparkleSound() {
    this.initContext();
    if (!this.ctx) return;
    const notes = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      this.playMelodyNote(freq, now + idx * 0.08, 0.8, 'sine');
    });
  }

  playFireworkSound() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Soft resonant thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // Followed by crackle sparkles
    setTimeout(() => {
      this.playSparkleSound();
    }, 280);
  }

  playWaxSealSound() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Crisp crack sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);

    // Paper slide sound
    setTimeout(() => {
      this.playSparkleSound();
    }, 150);
  }

  playHeartPopSound() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);

    gain.gain.setValueAtTime(0.2 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }
}

// Global instance
window.romanticAudio = new RomanticAudioManager();

