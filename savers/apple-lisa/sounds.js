/**
 * Synthesized Apple Lisa (1983) Sound Engine
 * Lisa ROM Self-Test two-tone beep, ProFile 5 MB hard drive seek, tactile mouse & keys.
 * Opt-in Web Audio API — muted by default until user enables audio ('M' or HUD).
 */
export class LisaSounds {
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
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /** Classic Apple Lisa ROM self-test OK beep */
  selfTestBeep(high = false) {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(high ? 1046.5 : 784, t);
    g.gain.setValueAtTime(0.038, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  /** ProFile 5 MB Seagate ST-506 hard disk stepper tick */
  profileSeek() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(210 + Math.random() * 75, t);
    osc.frequency.exponentialRampToValueAtTime(115, t + 0.028);
    g.gain.setValueAtTime(0.024, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.032);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  /** Tactile single-button Lisa mouse click */
  click() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1180, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.015);
    g.gain.setValueAtTime(0.03, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.019);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.02);
  }

  /** Soft Keytronic capacitive Lisa keyboard keystroke */
  key() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(740 + Math.random() * 200, t);
    osc.frequency.exponentialRampToValueAtTime(190, t + 0.017);
    g.gain.setValueAtTime(0.028, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.021);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.023);
  }

  /** Crisp stationery sheet tear-off sound */
  tearPaper() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dur = 0.16;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const p = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.sin(p * Math.PI) * 0.45;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1600, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.075, t);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(t);
  }

  /** Wastebasket crumple */
  crumple() {
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

  /** 1200 baud VT100 terminal chirp */
  modemChirp() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1270, t);
    osc.frequency.setValueAtTime(2225, t + 0.07);
    osc.frequency.setValueAtTime(1070, t + 0.14);
    g.gain.setValueAtTime(0.032, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  destroy() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
