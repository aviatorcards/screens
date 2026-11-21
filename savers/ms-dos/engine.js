import { typeInto as typeHuman } from '../../js/human.js';
import { DosSounds } from './sounds.js';

export class DosAbortError extends Error {
  constructor() {
    super('DOS scene aborted');
    this.name = 'DosAbortError';
  }
}

export class DosEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});

    this.sounds = new DosSounds();
    this.sounds.setMuted(options.muted ?? true);

    this.cwd = 'C:\\';
    this.lines = [];
    this.destroyed = false;

    this._buildShell();
  }

  _buildShell() {
    this.root = document.createElement('div');
    this.root.className = 'dos-root';
    this.root.innerHTML = `
      <div class="dos-screen" id="dos-screen">
        <div class="dos-term" id="dos-term"></div>
        <div class="dos-tui" id="dos-tui"></div>
        <canvas class="dos-vga-canvas" id="dos-vga-canvas" width="320" height="200"></canvas>
      </div>
      <div class="dos-leds">
        <span class="dos-led-item"><span class="dos-led-dot turbo"></span>TURBO 66</span>
        <span class="dos-led-item"><span class="dos-led-dot hdd" id="dos-hdd-led"></span>HDD</span>
      </div>
    `;
    this.container.appendChild(this.root);

    this.screenEl = this.root.querySelector('#dos-screen');
    this.termEl = this.root.querySelector('#dos-term');
    this.tuiEl = this.root.querySelector('#dos-tui');
    this.vgaCanvas = this.root.querySelector('#dos-vga-canvas');
    this.vgaCtx = this.vgaCanvas.getContext('2d');
    this.hddLedEl = this.root.querySelector('#dos-hdd-led');
  }

  getDynamicDateInfo() {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const yyyy = now.getFullYear();
    const yy = String(yyyy).slice(-2);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    let hrs = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ap = hrs >= 12 ? 'p' : 'a';
    const hrs12 = hrs % 12 || 12;
    return {
      now,
      weekday,
      dosDate: `${days[now.getDay()]} ${mm}-${dd}-${yyyy}`,
      dirDate: `${mm}-${dd}-${yy}`,
      dirTime: `${String(hrs12).padStart(2, ' ')}:${mins}${ap}`,
      clock24: `${String(now.getHours()).padStart(2, '0')}:${mins}:${secs}`,
      prettyDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  setPaused(paused) {
    this.paused = paused;
  }

  setMuted(muted) {
    this.sounds.setMuted(muted);
  }

  _checkSignal(signal) {
    if (this.destroyed || signal?.aborted) {
      throw new DosAbortError();
    }
  }

  async wait(ms, signal) {
    this._checkSignal(signal);
    const target = Math.max(10, ms);
    let elapsed = 0;
    let last = performance.now();
    while (elapsed < target) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      this._checkSignal(signal);
      const now = performance.now();
      const dt = Math.min(80, now - last);
      last = now;
      if (!this.paused) elapsed += dt * this.speed;
    }
  }

  setHdd(active) {
    this.hddLedEl.classList.toggle('active', Boolean(active));
  }

  async pulseHdd(steps = 4, stepMs = 95, signal = null) {
    try {
      for (let i = 0; i < steps; i++) {
        this.setHdd(true);
        this.sounds.hddTick();
        await this.wait(stepMs * 0.65, signal);
        this.setHdd(false);
        await this.wait(stepMs * 0.35, signal);
      }
    } finally {
      this.setHdd(false);
    }
  }

  esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  clearTerm() {
    this.lines = [];
    this._renderTerm();
  }

  printLine(text = '') {
    this.printHtml(this.esc(text));
  }

  printHtml(html = '') {
    this.lines.push(html);
    if (this.lines.length > 24) {
      this.lines = this.lines.slice(-24);
    }
    this._renderTerm();
  }

  replaceLastHtml(html) {
    if (this.lines.length === 0) this.lines.push(html);
    else this.lines[this.lines.length - 1] = html;
    this._renderTerm();
  }

  _renderTerm(activePromptHtml = null) {
    const body = this.lines.map((l) => `<div class="dos-term-line">${l || '&nbsp;'}</div>`).join('');
    const promptLine =
      activePromptHtml !== null
        ? `<div class="dos-term-line">${activePromptHtml}<span class="dos-cursor"></span></div>`
        : '';
    this.termEl.innerHTML = body + promptLine;
  }

  showPromptIdle() {
    this._renderTerm(`${this.esc(this.cwd)}&gt;`);
  }

  async typeCommand(cmd, signal, delay = 52, { allowTypo = true } = {}) {
    const prefix = `${this.esc(this.cwd)}&gt;`;
    let buf = '';
    this._renderTerm(prefix);
    await this.wait(180, signal);

    await typeHuman(cmd, { base: delay, allowTypo }, {
      check: () => this._checkSignal(signal),
      apply: (step) => {
        if (step.kind === 'backspace') buf = buf.slice(0, -1);
        else buf += step.ch;
        this._renderTerm(`${prefix}${this.esc(buf)}`);
      },
      sound: (step) => {
        if (step.kind === 'backspace' || step.ch !== ' ') this.sounds.keyClick();
      },
      wait: (ms) => this.wait(ms, signal),
    });
    await this.wait(220, signal);
    this.sounds.keyClick();
    this.printHtml(`${prefix}${this.esc(buf)}`);
  }

  showTui(html) {
    this.tuiEl.innerHTML = html;
    this.tuiEl.classList.add('visible');
    return this.tuiEl;
  }

  hideTui() {
    this.tuiEl.classList.remove('visible');
    this.tuiEl.innerHTML = '';
  }

  showVgaCanvas(visible) {
    this.vgaCanvas.classList.toggle('visible', Boolean(visible));
  }

  destroy() {
    this.destroyed = true;
    this.sounds.destroy();
    this.root.remove();
  }
}
