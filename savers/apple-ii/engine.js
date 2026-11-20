import { Apple2Sounds } from './sounds.js';

export class Apple2AbortError extends Error {
  constructor() {
    super('Apple II scene aborted');
    this.name = 'Apple2AbortError';
  }
}

/** Authentic Apple II 16-color Lo-Res (GR) palette */
export const LORES_COLORS = [
  '#000000', // 0 Black
  '#901740', // 1 Magenta / Deep Red
  '#402ca5', // 2 Dark Blue
  '#d043e5', // 3 Purple / Violet
  '#006940', // 4 Dark Green
  '#808080', // 5 Dark Gray
  '#2f95e5', // 6 Medium Blue
  '#bfabff', // 7 Light Blue
  '#405400', // 8 Brown
  '#d06a1a', // 9 Orange
  '#808080', // 10 Light Gray
  '#ff96bf', // 11 Pink
  '#2fbc1a', // 12 Light Green
  '#bfd35a', // 13 Yellow
  '#6fe8bf', // 14 Aqua
  '#ffffff', // 15 White
];

/** Authentic Apple II 6-color Hi-Res (HGR) NTSC artifact palette */
export const HIRES_COLORS = {
  black: '#000000',
  green: '#24d63a',
  violet: '#d442f5',
  white: '#ffffff',
  orange: '#ff701c',
  blue: '#22a8ff',
};

export class Apple2Engine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});

    this.sounds = new Apple2Sounds();
    this.sounds.setMuted(options.muted ?? true);

    this.lines = [];
    this.maxLines = 22;
    this.cols80 = false;
    this.phosphor = 'green'; // 'green' | 'amber' | 'color'
    this.cursorStyle = 'block'; // 'block' | 'checker'
    this.destroyed = false;

    this._buildDOM();
  }

  _buildDOM() {
    this.container.innerHTML = '';
    this.root = document.createElement('div');
    this.root.className = 'a2-root';
    this.root.innerHTML = `
      <div class="a2-crt">
        <div class="a2-text-layer" data-text-layer></div>

        <div class="a2-gfx-layer" data-gfx-layer>
          <div class="a2-canvas-wrap">
            <canvas class="a2-gfx-canvas" data-gfx-canvas width="280" height="192"></canvas>
          </div>
          <div class="a2-split-text" data-split-text></div>
        </div>

        <div class="a2-app-layer" data-app-layer></div>
      </div>

      <div class="a2-hw-hud">
        <div class="a2-disk-hud" data-disk-hud>
          <span class="a2-disk-led"></span>
          <span data-disk-text>DISK II · S6,D1</span>
        </div>
      </div>
    `;
    this.container.appendChild(this.root);

    this.textLayerEl = this.root.querySelector('[data-text-layer]');
    this.gfxLayerEl = this.root.querySelector('[data-gfx-layer]');
    this.gfxCanvas = this.root.querySelector('[data-gfx-canvas]');
    this.gfxCtx = this.gfxCanvas.getContext('2d');
    this.splitTextEl = this.root.querySelector('[data-split-text]');
    this.appLayerEl = this.root.querySelector('[data-app-layer]');
    this.diskHudEl = this.root.querySelector('[data-disk-hud]');
    this.diskTextEl = this.root.querySelector('[data-disk-text]');
  }

  getDateInfo() {
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dd = String(now.getDate()).padStart(2, '0');
    const mon = months[now.getMonth()];
    const yy = String(now.getFullYear()).slice(-2);
    return {
      now,
      prodosDate: `${dd}-${mon}-${yy}`,
      longDate: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      shortDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
      timeStr: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
  }

  setSpeed(speed) {
    this.speed = speed || 1;
  }

  setPaused(paused) {
    this.paused = Boolean(paused);
  }

  setMuted(muted) {
    this.sounds.setMuted(muted);
  }

  _checkSignal(signal) {
    if (this.destroyed || signal?.aborted) {
      throw new Apple2AbortError();
    }
  }

  async wait(ms, signal) {
    this._checkSignal(signal);
    const target = Math.max(10, ms);
    let elapsed = 0;
    let last = performance.now();
    while (elapsed < target) {
      await new Promise((r) => requestAnimationFrame(r));
      this._checkSignal(signal);
      const now = performance.now();
      const dt = Math.min(80, now - last);
      last = now;
      if (!this.paused) elapsed += dt * this.speed;
    }
  }

  setPhosphor(mode = 'green') {
    this.phosphor = mode;
    this.root.classList.remove('phosphor-amber', 'phosphor-color');
    if (mode === 'amber') this.root.classList.add('phosphor-amber');
    else if (mode === 'color') this.root.classList.add('phosphor-color');
  }

  setColumns(cols = 40) {
    this.cols80 = cols === 80;
    this.textLayerEl.classList.toggle('cols-80', this.cols80);
    this.maxLines = this.cols80 ? 24 : 21;
  }

  setDiskActivity(visible, active = false, label = 'DISK II · S6,D1') {
    this.diskTextEl.textContent = label;
    this.diskHudEl.classList.toggle('visible', Boolean(visible));
    this.diskHudEl.classList.toggle('active', Boolean(active));
  }

  async diskSeek(steps = 7, label = 'DISK II · S6,D1', signal = null, recalibrate = false) {
    this.setDiskActivity(true, true, label);
    try {
      for (let i = 0; i < steps; i++) {
        this.sounds.diskStep(recalibrate && i < 4);
        await this.wait(recalibrate && i < 4 ? 58 : 74, signal);
      }
      this.setDiskActivity(true, false, label);
      await this.wait(220, signal);
    } finally {
      this.setDiskActivity(false, false);
    }
  }

  /* =================================================================
     Mode Switching: Text / Graphics / App Overlay
     ================================================================= */
  showTextMode() {
    this.gfxLayerEl.classList.remove('visible', 'split');
    this.appLayerEl.classList.remove('visible');
    this.appLayerEl.innerHTML = '';
    this.textLayerEl.style.display = 'flex';
  }

  showGfxMode({ split = false, width = 280, height = 192 } = {}) {
    this.appLayerEl.classList.remove('visible');
    this.appLayerEl.innerHTML = '';
    this.gfxCanvas.width = width;
    this.gfxCanvas.height = height;
    this.gfxLayerEl.classList.toggle('split', Boolean(split));
    this.gfxLayerEl.classList.add('visible');
  }

  setSplitLines(lines) {
    this.splitTextEl.textContent = lines.slice(-4).join('\n');
  }

  showAppMode(html) {
    this.gfxLayerEl.classList.remove('visible', 'split');
    this.appLayerEl.innerHTML = html;
    this.appLayerEl.classList.add('visible');
    return this.appLayerEl;
  }

  /* =================================================================
     Text Terminal Helpers
     ================================================================= */
  _esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  clearText() {
    this.lines = [];
    this._renderText();
  }

  print(text = '', { rawHtml = false } = {}) {
    this.lines.push({ text, rawHtml });
    if (this.lines.length > this.maxLines) {
      this.lines = this.lines.slice(-this.maxLines);
    }
    this._renderText();
  }

  _renderText(activeLine = null, prompt = ']') {
    const cursorCls = this.cursorStyle === 'checker' ? 'a2-cursor checker' : 'a2-cursor';
    const body = this.lines
      .map((l) => `<div class="a2-text-line">${l.rawHtml ? l.text : this._esc(l.text)}</div>`)
      .join('');
    const current =
      activeLine !== null
        ? `<div class="a2-text-line">${this._esc(prompt + activeLine)}<span class="${cursorCls}"></span></div>`
        : `<div class="a2-text-line">${this._esc(prompt)}<span class="${cursorCls}"></span></div>`;
    this.textLayerEl.innerHTML = body + current;
  }

  async typeCommand(cmd, { prompt = ']', delay = 58, sound = true } = {}, signal = null) {
    let buf = '';
    this._renderText(buf, prompt);
    for (let i = 0; i < cmd.length; i++) {
      buf += cmd[i];
      this._renderText(buf, prompt);
      if (sound && cmd[i] !== ' ') this.sounds.keyClick();
      await this.wait(delay + Math.random() * 34, signal);
    }
    await this.wait(220, signal);
    if (sound) this.sounds.keyClick();
    this.print(prompt + buf);
  }

  async coldBootBanner(signal) {
    this.showTextMode();
    this.setColumns(40);
    this.setPhosphor('green');
    this.cursorStyle = 'checker';
    this.clearText();
    this.sounds.beep(1000, 0.12, 0.048);
    this.print('              APPLE //E');
    this.print('');
    await this.wait(260, signal);
    await this.diskSeek(10, 'DISK II · S6,D1 · BOOT', signal, true);
    this.print('DOS VERSION 3.3  SYSTEM MASTER');
    this.print('APPLE COMPUTER INC. 1980, 1983');
    this.print('');
    this._renderText(null, ']');
    await this.wait(520, signal);
  }

  resetTransient() {
    this.setDiskActivity(false, false);
    this.gfxLayerEl.classList.remove('visible', 'split');
    this.appLayerEl.classList.remove('visible');
    this.appLayerEl.innerHTML = '';
  }

  destroy() {
    this.destroyed = true;
    this.sounds.destroy();
    this.container.innerHTML = '';
  }
}
