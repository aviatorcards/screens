/**
 * Synthesized Windows Evolution Audio Engine (1985 PC Speaker → 2001 XP Chime)
 * Opt-in Web Audio API — muted by default until user enables sound ('M' or HUD).
 */
export class WinEvoSounds {
  constructor() {
    this.muted = true;
    this.ctx = null;
  }

  setMuted(muted) {
    this.muted = muted;
    if (!muted) this._ensureContext();
  }

  _ensureContext() {
    if (this.muted) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  keyClick() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 240, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.017);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.022);
  }

  mouseClick() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1650, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.02);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.026);
  }

  pcBeep(freq = 1000, dur = 0.12) {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.036, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.01);
  }

  // Windows 3.1 TADA-inspired bright brass/synth two-step fanfare
  win31Tada() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const play = (freqs, t, dur, vol = 0.035) => {
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const flt = ctx.createBiquadFilter();
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(2200, t);
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(flt).connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      });
    };
    play([392.0, 493.88], now, 0.14, 0.028);
    play([523.25, 659.25, 783.99, 1046.5], now + 0.15, 0.85, 0.026);
  }

  // Windows 95 ambient pad startup swell
  win95Startup() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const chords = [
      { t: 0.0, freqs: [261.63, 329.63, 392.0, 587.33], dur: 1.1 },
      { t: 0.55, freqs: [293.66, 369.99, 440.0, 659.25], dur: 1.45 },
    ];
    for (const c of chords) {
      for (const f of c.freqs) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + c.t);
        gain.gain.setValueAtTime(0.001, now + c.t);
        gain.gain.linearRampToValueAtTime(0.032, now + c.t + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + c.t + c.dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + c.t);
        osc.stop(now + c.t + c.dur + 0.04);
      }
    }
  }

  // Windows 98 shimmering ascending arpeggio chime
  win98Startup() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [329.63, 440.0, 554.37, 659.25, 880.0];
    notes.forEach((f, i) => {
      const t = now + i * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.038, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.95);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.0);
    });
  }

  // Windows XP warm electric-piano-like 4-note startup cadence
  winXpStartup() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const seq = [
      { t: 0.0, f: 622.25, d: 0.35 },
      { t: 0.22, f: 466.16, d: 0.38 },
      { t: 0.44, f: 311.13, d: 0.45 },
      { t: 0.68, f: 466.16, d: 1.25 },
      { t: 0.68, f: 622.25, d: 1.25 },
      { t: 0.68, f: 932.33, d: 1.25 },
    ];
    for (const n of seq) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.001, now + n.t);
      gain.gain.linearRampToValueAtTime(0.042, now + n.t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + n.t + n.d);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.04);
    }
  }

  balloonPop() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.065);
    gain.gain.setValueAtTime(0.036, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  destroy() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
