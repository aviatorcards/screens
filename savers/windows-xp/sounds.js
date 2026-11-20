/**
 * Opt-in Web Audio synthesizer for Windows XP (2001)
 * Includes XP Startup fanfare, Balloon pop, AIM sign-on & message, Pinball bumpers, and Critical Error!
 */
export class XpSounds {
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

  // Iconic lush Windows XP Startup melody (Eb5 -> Bb4 -> Ab4 -> Eb5 -> Bb4)
  xpStartup() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [
      { f: 622.25, s: 0.0, d: 0.55, a: 0.055 },  // Eb5
      { f: 311.13, s: 0.0, d: 0.8, a: 0.04 },    // Eb4 bass
      { f: 466.16, s: 0.24, d: 0.45, a: 0.05 },  // Bb4
      { f: 415.30, s: 0.48, d: 0.65, a: 0.055 }, // Ab4
      { f: 622.25, s: 0.78, d: 0.75, a: 0.055 }, // Eb5
      { f: 466.16, s: 1.02, d: 1.25, a: 0.055 }, // Bb4 resolve
      { f: 233.08, s: 1.02, d: 1.3, a: 0.035 },  // Bb3 warm pad
    ];
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t + n.s);
      g.gain.setValueAtTime(0.001, t + n.s);
      g.gain.linearRampToValueAtTime(n.a, t + n.s + 0.035);
      g.gain.exponentialRampToValueAtTime(0.0006, t + n.s + n.d);
      osc.connect(g).connect(ctx.destination);
      osc.start(t + n.s);
      osc.stop(t + n.s + n.d + 0.05);
    }
  }

  // Iconic XP Tray Balloon pop-bloop
  xpBalloon() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(780, t + 0.065);
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Buddy signs on: a short latch click, then two original tones.
  aimSignOn() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const len = Math.floor(ctx.sampleRate * 0.05);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, t);
    filter.Q.setValueAtTime(0.7, t);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.07, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    noise.connect(filter).connect(ng).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.06);
    [392, 523.25].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const s = t + 0.07 + i * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, s);
      g.gain.setValueAtTime(0.045, s);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.16);
      osc.connect(g).connect(ctx.destination);
      osc.start(s);
      osc.stop(s + 0.17);
    });
  }

  // Incoming IM: a short two-note chime. Original tones, not an AOL sample.
  aimMessage() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [784, 988].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const s = t + i * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, s);
      g.gain.setValueAtTime(0.05, s);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.13);
      osc.connect(g).connect(ctx.destination);
      osc.start(s);
      osc.stop(s + 0.14);
    });
  }

  // Classic XP Critical Stop / Error Ding
  xpError() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [330, 247].forEach((f) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.065, t);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.24);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  click() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.018);
    g.gain.setValueAtTime(0.036, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  key() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(840 + Math.random() * 260, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.015);
    g.gain.setValueAtTime(0.025, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.018);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.02);
  }

  pinballBumper() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520 + Math.random() * 220, t);
    osc.frequency.exponentialRampToValueAtTime(1280, t + 0.06);
    g.gain.setValueAtTime(0.042, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  recycleEmpty() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dur = 0.28;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.4;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.085, t);
    src.connect(g).connect(ctx.destination);
    src.start(t);
  }
}
