import { CompilerSounds } from './sounds.js';

export class CompilerAbortError extends Error {
  constructor() {
    super('Compiler scene aborted');
    this.name = 'CompilerAbortError';
  }
}

const PROMPT = 'src $ ';
const HISTORY_CAP = 48;

export class CompilerEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});
    this.sounds = new CompilerSounds();
    this.sounds.setMuted(options.muted ?? true);
    this.destroyed = false;

    this.lines = [];
    this.prompt = PROMPT;

    this._buildDOM();
    this._render('idle');
  }

  _buildDOM() {
    this.container.innerHTML = '';
    this.root = document.createElement('div');
    this.root.className = 'cmp-root';
    if (this.paused) this.root.classList.add('is-paused');
    this.root.innerHTML = `
      <div class="cmp-chrome">
        <div class="cmp-top">
          <span class="cmp-title">src</span>
          <span class="cmp-lamp">
            <span class="cmp-led" data-led></span>
            <span class="cmp-lamp-label">BUILD</span>
          </span>
        </div>
        <div class="cmp-screen">
          <div class="cmp-text" data-text></div>
        </div>
      </div>
    `;
    this.container.appendChild(this.root);
    this.textEl = this.root.querySelector('[data-text]');
    this.ledEl = this.root.querySelector('[data-led]');
  }

  setSpeed(speed) {
    this.speed = speed || 1;
  }

  setPaused(paused) {
    this.paused = Boolean(paused);
    this.root?.classList.toggle('is-paused', this.paused);
  }

  setMuted(muted) {
    this.sounds.setMuted(muted);
  }

  _check(signal) {
    if (this.destroyed || signal?.aborted) throw new CompilerAbortError();
  }

  async wait(ms, signal) {
    this._check(signal);
    const target = Math.max(10, ms);
    let elapsed = 0;
    let last = performance.now();
    while (elapsed < target) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      this._check(signal);
      const now = performance.now();
      const dt = Math.min(80, now - last);
      last = now;
      if (!this.paused) elapsed += dt * this.speed;
    }
  }

  setLamp(active) {
    this.ledEl?.classList.toggle('on', Boolean(active));
  }

  async compile(signal, ms = 720) {
    this._check(signal);
    this.setLamp(true);
    this.sounds.buildTick();
    try {
      await this.wait(ms * 0.45, signal);
      this.sounds.buildTick();
      await this.wait(ms * 0.55, signal);
    } finally {
      if (!this.destroyed) this.setLamp(false);
    }
  }

  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  _lineHtml(line) {
    if (line.kind === 'cmd' && line.text.startsWith(PROMPT)) {
      const rest = line.text.slice(PROMPT.length);
      return `<div class="cmp-line cmd"><span class="cmp-prompt">${this._esc(PROMPT)}</span>${this._esc(rest)}</div>`;
    }
    return `<div class="cmp-line ${line.kind}">${line.text === '' ? '' : this._esc(line.text)}</div>`;
  }

  _render(mode, buffer = '') {
    const visible = this.lines.slice(-HISTORY_CAP);
    const body = visible.map((line) => this._lineHtml(line)).join('');
    const cursor = '<span class="cmp-cursor"></span>';
    let active;
    if (mode === 'idle') {
      active = `<span class="cmp-prompt">${this._esc(PROMPT)}</span>${cursor}`;
    } else if (mode === 'typing' && this.prompt.startsWith('src $')) {
      active = `<span class="cmp-prompt">${this._esc(this.prompt)}</span>${this._esc(buffer)}${cursor}`;
    } else if (mode === 'typing') {
      active = `${this._esc(buffer)}${cursor}`;
    } else {
      active = cursor;
    }
    this.textEl.innerHTML = `${body}<div class="cmp-line">${active}</div>`;
  }

  showPrompt() {
    this.prompt = PROMPT;
    this._render('idle');
  }

  ensurePrompt() {
    this.showPrompt();
  }

  print(text = '', kind = 'out') {
    this.lines.push({ text, kind });
    this._render('output');
  }

  async _type(text, { prompt, delay, kind }, signal) {
    this.prompt = prompt;
    let buf = '';
    this._render('typing', buf);
    for (const ch of text) {
      this._check(signal);
      buf += ch;
      this._render('typing', buf);
      if (ch !== ' ') this.sounds.keyClick();
      const jitter = delay > 30 ? 16 : 12;
      await this.wait(delay + Math.random() * jitter, signal);
    }
    await this.wait(80, signal);
    this.lines.push({ text: prompt + buf, kind });
    this._render('output');
  }

  async typeCommand(cmd, signal) {
    await this._type(cmd, { prompt: PROMPT, delay: 34, kind: 'cmd' }, signal);
  }

  async typeSource(line, signal) {
    await this._type(line, { prompt: '', delay: 22, kind: 'src' }, signal);
  }

  resetTransient() {
    this.setLamp(false);
  }

  destroy() {
    this.destroyed = true;
    this.sounds.destroy();
    this.container.innerHTML = '';
  }
}
