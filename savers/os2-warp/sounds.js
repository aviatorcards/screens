/**
 * Opt-in Web Audio synthesizer for IBM OS/2 Warp 4 (MMPM/2)
 * Muted by default until the user enables sound (M or HUD toggle).
 */
export class WarpSounds {
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

  click() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.022);
    g.gain.setValueAtTime(0.055, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.026);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  key() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Buckling-spring IBM Model M click
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1500 + Math.random() * 450, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.018);
    g.gain.setValueAtTime(0.028, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.024);
  }

  // Warm MMPM/2 OS/2 Warp 4 startup chord progression
  warpStartup() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [
      { f: 261.63, start: 0.0, dur: 0.55 },  // C4
      { f: 329.63, start: 0.11, dur: 0.55 }, // E4
      { f: 392.00, start: 0.22, dur: 0.65 }, // G4
      { f: 523.25, start: 0.34, dur: 0.95 }, // C5
      { f: 659.25, start: 0.46, dur: 0.9 },  // E5
    ];
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t + n.start);
      g.gain.setValueAtTime(0.001, t + n.start);
      g.gain.linearRampToValueAtTime(0.055, t + n.start + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0008, t + n.start + n.dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t + n.start);
      osc.stop(t + n.start + n.dur + 0.05);
    }
  }

  windowOpen() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [520, 740].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + idx * 0.045);
      g.gain.setValueAtTime(0.032, t + idx * 0.045);
      g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.045 + 0.08);
      osc.connect(g).connect(ctx.destination);
      osc.start(t + idx * 0.045);
      osc.stop(t + idx * 0.045 + 0.09);
    });
  }

  // Authentic paper-shredder whir when shredding an object
  shred() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dur = 0.48;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.sin((i / data.length) * Math.PI);
      const grind = Math.sin(i * 0.08) * 0.5 + 0.5;
      data[i] = (Math.random() * 2 - 1) * env * grind * 0.45;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, t);
    filter.Q.setValueAtTime(1.4, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.11, t);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(t);
  }

  // VoiceType microphone ready chirp
  voiceBeep() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [880, 1175].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.065);
      g.gain.setValueAtTime(0.045, t + i * 0.065);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.065 + 0.09);
      osc.connect(g).connect(ctx.destination);
      osc.start(t + i * 0.065);
      osc.stop(t + i * 0.065 + 0.1);
    });
  }

  cardSnap() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.035);
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.045);
  }
}
