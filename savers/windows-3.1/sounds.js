/** Windows 3.1 UI tones. Silent until the screensaver is unmuted. */

export class Win31Sounds {
  constructor() {
    this.muted = true;
    this.ctx = null;
  }

  setMuted(muted) {
    this.muted = muted;
    if (!muted) this._ctx();
  }

  _ctx() {
    if (this.muted) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    } catch {
      return null;
    }
  }

  _tone(freq, dur, type, gainValue) {
    const ctx = this._ctx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  click() {
    this._tone(640, 0.04, 'square', 0.03);
  }

  key() {
    this._tone(520, 0.03, 'square', 0.02);
  }

  menu() {
    this._tone(720, 0.045, 'square', 0.028);
  }

  error() {
    const ctx = this._ctx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [440, 349].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.14;
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    });
  }

  /** Startup fanfare in the shape of the Windows 3.1 chord, synthesized, not sampled. */
  tada() {
    const ctx = this._ctx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const play = (freqs, t, dur, vol) => {
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, t);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(filter).connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      });
    };
    play([392, 493.88], now, 0.13, 0.03);
    play([523.25, 659.25, 783.99, 1046.5], now + 0.14, 0.8, 0.026);
  }
}
