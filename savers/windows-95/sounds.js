/** Windows 95 / 98 UI tones. Silent until the screensaver is unmuted. */

export class Win95Sounds {
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
    this._tone(740, 0.035, 'square', 0.025);
  }

  key() {
    this._tone(560, 0.028, 'square', 0.018);
  }

  menu() {
    this._tone(680, 0.04, 'square', 0.024);
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

  /** Synthesized swell in the shape of the Windows 95 startup. Not the Microsoft sample. */
  startup95() {
    const ctx = this._ctx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const chords = [
      { t: 0, freqs: [261.63, 329.63, 392.0, 587.33], dur: 1.1 },
      { t: 0.55, freqs: [293.66, 369.99, 440.0, 659.25], dur: 1.45 },
    ];
    for (const chord of chords) {
      for (const freq of chord.freqs) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + chord.t);
        gain.gain.setValueAtTime(0.001, now + chord.t);
        gain.gain.linearRampToValueAtTime(0.032, now + chord.t + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + chord.t + chord.dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + chord.t);
        osc.stop(now + chord.t + chord.dur + 0.04);
      }
    }
  }

  /** Synthesized Windows 98 chime. Not the Microsoft sample. */
  startup98() {
    const ctx = this._ctx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [329.63, 440.0, 554.37, 659.25, 880.0].forEach((freq, i) => {
      const t = now + i * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.038, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.95);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.0);
    });
  }
}
