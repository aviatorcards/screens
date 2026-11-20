/**
 * Opt-in Web Audio synthesizer for Classic Macintosh System 7.5 (1994)
 * Includes Quadra/PowerMac startup chime and Jim Reekes' iconic "Sosumi" alert!
 */
export class Sys7Sounds {
  constructor() {
    this.muted = true;
    this.ctx = null;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (!this.muted) this._ensureCtx();
  }

  _ensureCtx() {
    if (this.muted) return null;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Iconic 1994 Macintosh Quadra / PowerMac startup chime (warm F-major chord)
  bootChime() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const freqs = [174.61, 220.0, 261.63, 349.23, 523.25];
    for (const f of freqs) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.042, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 1.55);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.6);
    }
  }

  // Iconic System 7 "Sosumi" xylophone/marimba alert sound!
  sosumi() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const partials = [
      { f: 659.25, a: 0.075, d: 0.24 },
      { f: 1318.5, a: 0.04, d: 0.14 },
      { f: 1975.5, a: 0.025, d: 0.09 },
    ];
    for (const p of partials) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, t);
      g.gain.setValueAtTime(p.a, t);
      g.gain.exponentialRampToValueAtTime(0.0008, t + p.d);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + p.d + 0.02);
    }
  }

  click() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1250, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.015);
    g.gain.setValueAtTime(0.032, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.018);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.02);
  }

  key() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920 + Math.random() * 280, t);
    osc.frequency.exponentialRampToValueAtTime(210, t + 0.016);
    g.gain.setValueAtTime(0.032, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.022);
  }

  cardFlip() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(860, t + 0.045);
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  tileSlide() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(175, t + 0.04);
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.048);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  trashCrunch() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dur = 0.24;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.4;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.08, t);
    src.connect(g).connect(ctx.destination);
    src.start(t);
  }
}
