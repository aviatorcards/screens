import { CpmSounds } from './sounds.js';

export class CpmAbortError extends Error {
  constructor() {
    super('CP/M scene aborted');
    this.name = 'CpmAbortError';
  }
}

/** Directory order on this working disk. MBASIC.COM is present; it is not a Digital Research master file. */
const BASE_FILES = [
  ['ASM', 'COM'],
  ['DDT', 'COM'],
  ['DUMP', 'COM'],
  ['ED', 'COM'],
  ['LOAD', 'COM'],
  ['MBASIC', 'COM'],
  ['MOVCPM', 'COM'],
  ['PIP', 'COM'],
  ['STAT', 'COM'],
  ['SUBMIT', 'COM'],
  ['SYSGEN', 'COM'],
  ['XSUB', 'COM'],
  ['NOTES', 'TXT'],
];

export class CpmEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});
    this.sounds = new CpmSounds();
    this.sounds.setMuted(options.muted ?? true);
    this.destroyed = false;

    this.lines = [];
    this.prompt = 'A>';
    this.files = BASE_FILES.map((pair) => [...pair]);
    this.hasBak = false;
    // Depiction of a partly filled disk, not a quoted image and not a claimed geometry.
    this.freeKb = 196;

    const when = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    this.notes = [
      'STUDIO LOG',
      '64K CP/M-80 2.2',
      'STILL ROOM FOR DIR, PIP, AND MBASIC.',
      when.toUpperCase(),
    ];

    this._buildDOM();
    this._render('output');
  }

  _buildDOM() {
    this.container.innerHTML = '';
    this.root = document.createElement('div');
    this.root.className = 'cpm-root';
    this.root.innerHTML = `
      <div class="cpm-rig">
        <div class="cpm-crt">
          <div class="cpm-screen">
            <div class="cpm-text" data-text></div>
          </div>
        </div>
        <div class="cpm-bay">
          <span class="cpm-led" data-led></span>
          <span class="cpm-bay-label">DRIVE A</span>
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
  }

  setMuted(muted) {
    this.sounds.setMuted(muted);
  }

  _check(signal) {
    if (this.destroyed || signal?.aborted) throw new CpmAbortError();
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

  setDrive(active) {
    this.ledEl.classList.toggle('on', Boolean(active));
  }

  async diskAccess(signal, ms = 320) {
    this._check(signal);
    this.setDrive(true);
    this.sounds.driveTick();
    try {
      await this.wait(ms, signal);
      this.sounds.driveTick();
      await this.wait(Math.min(140, ms * 0.35), signal);
    } finally {
      if (!this.destroyed) this.setDrive(false);
    }
  }

  noteBackup() {
    if (this.hasBak) return;
    this.files.push(['NOTES', 'BAK']);
    this.hasBak = true;
    this.freeKb = 195;
  }

  dirLines() {
    const cell = ([name, ext]) => `A: ${name.padEnd(8, ' ')} ${ext.padEnd(3, ' ')}`;
    const lines = [];
    for (let i = 0; i < this.files.length; i += 4) {
      lines.push(this.files.slice(i, i + 4).map(cell).join(' : '));
    }
    return lines;
  }

  spaceLine() {
    return `A: R/W, SPACE: ${this.freeKb}K`;
  }

  statLines() {
    const names = this.hasBak
      ? [['NOTES', 'BAK'], ['NOTES', 'TXT']]
      : [['NOTES', 'TXT']];
    const row = ([name, ext]) =>
      `${'1'.padStart(4, ' ')}${'1k'.padStart(6, ' ')}${'1'.padStart(4, ' ')} R/W A:${name}.${ext}`;
    return [
      '',
      ' Recs  Bytes  Ext Acc',
      ...names.map(row),
      `Bytes Remaining On A: ${this.freeKb}k`,
    ];
  }

  _esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _render(mode, buffer = '') {
    const visible = this.lines.slice(-23);
    const body = visible
      .map((line) => `<div class="cpm-line">${this._esc(line)}</div>`)
      .join('');
    let active;
    if (mode === 'idle') {
      active = `${this._esc(this.prompt)}<span class="cpm-cursor"></span>`;
    } else if (mode === 'typing') {
      active = `${this._esc(this.prompt + buffer)}<span class="cpm-cursor"></span>`;
    } else {
      active = '<span class="cpm-cursor"></span>';
    }
    this.textEl.innerHTML = `${body}<div class="cpm-line">${active}</div>`;
  }

  clearText() {
    this.lines = [];
    this.prompt = 'A>';
    this._render('output');
  }

  print(text = '') {
    this.lines.push(text);
    this._render('output');
  }

  showPrompt(prompt = 'A>') {
    this.prompt = prompt;
    this._render('idle');
  }

  ensurePrompt() {
    this.showPrompt('A>');
  }

  commitLine(text) {
    this.lines.push(text);
    this._render('output');
  }

  async typeCommand(cmd, { prompt = 'A>', delay = 52 } = {}, signal) {
    this.prompt = prompt;
    let buf = '';
    this._render('typing', buf);
    for (const ch of cmd) {
      this._check(signal);
      buf += ch;
      this._render('typing', buf);
      if (ch !== ' ') this.sounds.keyClick();
      await this.wait(delay + Math.random() * 36, signal);
    }
    await this.wait(150, signal);
    this.sounds.keyClick();
    this.lines.push(this.prompt + buf);
    this._render('output');
  }

  async coldBoot(signal) {
    this.clearText();
    this.sounds.bell();
    await this.diskAccess(signal, 420);
    this.print('64K CP/M VERS 2.2');
    this.print('');
    await this.wait(260, signal);
    this.showPrompt('A>');
  }

  resetTransient() {
    this.setDrive(false);
  }

  destroy() {
    this.destroyed = true;
    this.sounds.destroy();
    this.container.innerHTML = '';
  }
}
