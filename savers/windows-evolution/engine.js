import { WinEvoSounds } from './sounds.js';

export class WinEvoAbortError extends Error {
  constructor() {
    super('Windows Evolution scene aborted');
    this.name = 'WinEvoAbortError';
  }
}

const CURSOR_SVG = `
  <svg viewBox="0 0 18 22" width="16" height="20">
    <path d="M1 1 L1 17 L5 13.5 L8 19.5 L10.6 18.2 L7.6 12.2 L13 12.2 Z" fill="#fff" stroke="#000" stroke-width="1.6"/>
  </svg>
`;

export class WinEvoEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});

    this.sounds = new WinEvoSounds();
    this.sounds.setMuted(options.muted ?? true);

    this.cursor = { x: 240, y: 180 };
    this.journalLines = [];
    this.destroyed = false;

    this._buildShell();
  }

  _buildShell() {
    this.root = document.createElement('div');
    this.root.className = 'wev-root';
    this.root.innerHTML = `
      <div class="wev-stage" id="wev-stage"></div>
      <div class="wev-era-pill" id="wev-era-pill">1985 · MS-DOS 3.1 · 286 · 640 KB</div>
      <div class="wev-cursor" id="wev-cursor">${CURSOR_SVG}</div>
    `;
    this.container.appendChild(this.root);

    this.stageEl = this.root.querySelector('#wev-stage');
    this.eraPillEl = this.root.querySelector('#wev-era-pill');
    this.cursorEl = this.root.querySelector('#wev-cursor');
    this._renderCursor();
  }

  setEraBadge(text) {
    this.eraPillEl.textContent = text;
  }

  setCursorVisible(visible) {
    this.cursorEl.classList.toggle('visible', Boolean(visible));
  }

  setStageHtml(html) {
    this.stageEl.innerHTML = html;
    return this.stageEl;
  }

  getNowClock() {
    const now = new Date();
    let hrs = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    return {
      now,
      timeStr: `${hrs}:${mins} ${ampm}`,
      shortDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
    };
  }

  esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
      throw new WinEvoAbortError();
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

  _renderCursor() {
    this.cursorEl.style.transform = `translate3d(${Math.round(this.cursor.x)}px, ${Math.round(this.cursor.y)}px, 0)`;
  }

  _getElPoint(el, rx = 0.5, ry = 0.5) {
    const rr = this.root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - rr.left + r.width * rx,
      y: r.top - rr.top + r.height * ry,
    };
  }

  async moveTo(tx, ty, durationMs = null, signal = null) {
    this._checkSignal(signal);
    const sx = this.cursor.x;
    const sy = this.cursor.y;
    const dx = tx - sx;
    const dy = ty - sy;
    const dist = Math.hypot(dx, dy);
    if (dist < 2) {
      this.cursor.x = tx;
      this.cursor.y = ty;
      this._renderCursor();
      return;
    }

    const dur = durationMs ?? Math.max(240, Math.min(840, 200 + dist * 0.9));
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arc = (Math.random() > 0.5 ? 1 : -1) * Math.min(38, dist * 0.14);
    const cx1 = sx + dx * 0.34 + perpX * arc;
    const cy1 = sy + dy * 0.34 + perpY * arc;
    const cx2 = sx + dx * 0.7 + perpX * (arc * 0.45);
    const cy2 = sy + dy * 0.7 + perpY * (arc * 0.45);

    let elapsed = 0;
    let last = performance.now();
    while (elapsed < dur) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      this._checkSignal(signal);
      const now = performance.now();
      const dt = Math.min(60, now - last);
      last = now;
      if (!this.paused) elapsed += dt * this.speed;
      const rawT = Math.min(1, elapsed / dur);
      const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
      const u = 1 - t;
      this.cursor.x = u * u * u * sx + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * tx;
      this.cursor.y = u * u * u * sy + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * ty;
      this._renderCursor();
    }
    this.cursor.x = tx;
    this.cursor.y = ty;
    this._renderCursor();
  }

  async click(el, opts = {}, signal = null) {
    if (el) {
      const pt = this._getElPoint(el, opts.rx ?? 0.5, opts.ry ?? 0.5);
      await this.moveTo(pt.x, pt.y, opts.duration ?? null, signal);
    }
    this.sounds.mouseClick();
    if (el && opts.pressClass) el.classList.add(opts.pressClass);
    await this.wait(110, signal);
    if (el && opts.pressClass) el.classList.remove(opts.pressClass);
    await this.wait(opts.afterMs ?? 120, signal);
  }

  async doubleClick(el, signal = null) {
    const pt = this._getElPoint(el, 0.5, 0.45);
    await this.moveTo(pt.x, pt.y, null, signal);
    this.sounds.mouseClick();
    await this.wait(95, signal);
    this.sounds.mouseClick();
    await this.wait(140, signal);
  }

  async typeInto(el, text, opts = {}, signal = null) {
    const delay = opts.delay ?? 44;
    let buf = opts.prefix || '';
    const render = (caret = true) => {
      const esc = this.esc(buf);
      el.innerHTML = caret ? `${esc}<span class="wev-dos-cursor" style="background:${opts.caretColor || 'currentColor'}"></span>` : esc;
    };
    render(true);
    for (let i = 0; i < text.length; i++) {
      buf += text[i];
      render(true);
      if (text[i] !== ' ') this.sounds.keyClick();
      let pause = delay + Math.random() * 34;
      if (text[i] === '.' || text[i] === '!') pause += 160;
      else if (text[i] === '\n') pause += 180;
      await this.wait(pause, signal);
    }
    if (opts.removeCaretAtEnd) render(false);
  }

  async runBlueSetup({ header, steps, diskNote }, signal) {
    this.setCursorVisible(false);
    const stage = this.setStageHtml(`
      <div class="wev-blue-setup">
        <div class="wev-blue-setup-head">${header}</div>
        <div class="wev-blue-box">
          <div id="bs-step">Preparing setup…</div>
          <div class="wev-setup-bar"><div id="bs-fill"></div></div>
          <div id="bs-file" style="color:#aaaaff;font-size:0.9em;">${diskNote}</div>
        </div>
        <div style="color:#cccccc;font-size:0.85em;">ENTER=Continue &nbsp;&nbsp; F3=Quit &nbsp;&nbsp; Upgrading existing system files…</div>
      </div>
    `);
    const stepEl = stage.querySelector('#bs-step');
    const fillEl = stage.querySelector('#bs-fill');
    const fileEl = stage.querySelector('#bs-file');

    for (let i = 0; i < steps.length; i++) {
      const [pct, title, file] = steps[i];
      stepEl.textContent = title;
      fileEl.textContent = file;
      fillEl.style.width = `${pct}%`;
      this.sounds.keyClick();
      await this.wait(540, signal);
    }
    await this.wait(450, signal);
  }

  async runGraphicalWizard({ xp = false, title, steps, billboards }, signal) {
    this.setCursorVisible(false);
    const stage = this.setStageHtml(`
      <div class="wev-wizard-bg${xp ? ' xp' : ''}">
        <div class="wev-wizard-head">${title}</div>
        <div class="wev-wizard-grid">
          <div class="wev-wizard-steps" id="wz-steps"></div>
          <div class="wev-wizard-card">
            <div style="font-size:19px;font-weight:800;" id="wz-bb-title">${billboards[0][0]}</div>
            <div style="font-size:13.5px;line-height:1.5;opacity:0.92;" id="wz-bb-body">${billboards[0][1]}</div>
            <div class="wev-wizard-bar"><div id="wz-fill"></div></div>
            <div style="font-size:12px;opacity:0.85;" id="wz-sub">Copying system files…</div>
          </div>
        </div>
      </div>
    `);
    const stepsEl = stage.querySelector('#wz-steps');
    const bbTitle = stage.querySelector('#wz-bb-title');
    const bbBody = stage.querySelector('#wz-bb-body');
    const fill = stage.querySelector('#wz-fill');
    const sub = stage.querySelector('#wz-sub');

    for (let i = 0; i < steps.length; i++) {
      stepsEl.innerHTML = steps
        .map((s, idx) => {
          const cls = idx < i ? 'done' : idx === i ? 'active' : '';
          const mark = idx < i ? '✓' : idx === i ? '▸' : '○';
          return `<div class="wev-wstep ${cls}"><span>${mark}</span><span>${s}</span></div>`;
        })
        .join('');
      const bb = billboards[i % billboards.length];
      bbTitle.textContent = bb[0];
      bbBody.textContent = bb[1];
      const pct = Math.round(((i + 1) / steps.length) * 100);
      fill.style.width = `${pct}%`;
      sub.textContent = `${steps[i]} (${pct}%) — Preserving NOTES.TXT…`;
      await this.wait(920, signal);
    }
    await this.wait(450, signal);
  }

  destroy() {
    this.destroyed = true;
    this.sounds.destroy();
    this.root.remove();
  }
}
