/**
 * Synthesized Commodore 64 (SID 6581 + 1541 Drive + Keyboard) Sound Engine
 * Opt-in Web Audio API — muted by default until user enables audio ('M' or HUD).
 */
export class C64Sounds {
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

  powerThump() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.14);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  keyClack() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Deep mechanical breadbin C64 key click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420 + Math.random() * 120, now);
    osc.frequency.exponentialRampToValueAtTime(125, now + 0.022);
    gain.gain.setValueAtTime(0.032, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.028);
  }

  driveStep() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Classic 1541 floppy head stepper rattle
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(165 + Math.random() * 45, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.045);
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.052);
  }

  geosClick() {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.018);
    gain.gain.setValueAtTime(0.026, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.024);
  }

  sidNote(freq, dur = 0.14, type = 'square', vol = 0.032) {
    const ctx = this._ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1850, now);
    filter.Q.setValueAtTime(3.2, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.01);
  }

  sidArpStep(stepIdx) {
    // Iconic C64 minor-9th SID chiptune arpeggio pattern
    const chordProgression = [
      [220.0, 261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 261.63], // Am9
      [174.61, 220.0, 261.63, 329.63, 392.0, 329.63, 261.63, 220.0], // Fmaj9
      [196.0, 246.94, 293.66, 392.0, 440.0, 392.0, 293.66, 246.94], // G6
      [164.81, 196.0, 246.94, 329.63, 392.0, 329.63, 246.94, 196.0], // Em7
    ];
    const bar = Math.floor(stepIdx / 8) % chordProgression.length;
    const note = chordProgression[bar][stepIdx % 8];
    this.sidNote(note, 0.13, 'square', 0.026);
    if (stepIdx % 4 === 0) {
      this.sidNote(chordProgression[bar][0] * 0.5, 0.24, 'triangle', 0.042);
    }
  }

  destroy() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
