import { SYS7_ICONS } from './icons.js';
import { Sys7Sounds } from './sounds.js';

export class Sys7AbortError extends Error {
  constructor() {
    super('System 7.5 vignette aborted');
    this.name = 'Sys7AbortError';
  }
}

export const SYS7_PATTERNS = [
  {
    name: 'Classic 50% Gray',
    bgColor: '#c8c8c8',
    bgImage:
      'radial-gradient(#7f7f7f 1px, transparent 1px), radial-gradient(#7f7f7f 1px, #d8d8d8 1px)',
    bgSize: '4px 4px',
    bgPos: '0 0, 2px 2px',
  },
  {
    name: 'Periwinkle Weave',
    bgColor: '#98a6d4',
    bgImage:
      'repeating-linear-gradient(45deg, rgba(255,255,255,0.28) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(40,56,112,0.22) 0 2px, transparent 2px 6px)',
    bgSize: '12px 12px',
    bgPos: '0 0',
  },
  {
    name: 'Teal Plaid 7.5',
    bgColor: '#5c8c8c',
    bgImage:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 8px), repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0 2px, transparent 2px 8px)',
    bgSize: '16px 16px',
    bgPos: '0 0',
  },
  {
    name: 'Blue Bricks',
    bgColor: '#6d84b8',
    bgImage:
      'linear-gradient(335deg, rgba(255,255,255,0.18) 2px, transparent 2px), linear-gradient(155deg, rgba(0,0,0,0.18) 2px, transparent 2px)',
    bgSize: '12px 12px',
    bgPos: '0 0, 6px 6px',
  },
  {
    name: 'Warm Linen',
    bgColor: '#c8bea8',
    bgImage:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(110,95,70,0.16) 0 1px, transparent 1px 4px)',
    bgSize: '8px 8px',
    bgPos: '0 0',
  },
];

export class Sys7Engine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});
    this.sounds = new Sys7Sounds();
    this.sounds.setMuted(options.muted !== undefined ? options.muted : true);

    this.destroyed = false;
    this.abortFlag = false;
    this.windows = new Map();
    this.nextZ = 100;
    this.activeWinId = null;
    this.cursorX = 320;
    this.cursorY = 220;
    this.patternIndex = 0;
    this.trashFull = false;

    this._timers = new Set();
    this._intervals = new Set();
    this._buildDOM();
    this.applyPattern(0);
    this._startClock();
  }

  _buildDOM() {
    this.container.innerHTML = '';
    const root = document.createElement('div');
    root.className = 'sys7-root';
    root.innerHTML = `
      <div class="sys7-corner tl"></div>
      <div class="sys7-corner tr"></div>
      <div class="sys7-corner bl"></div>
      <div class="sys7-corner br"></div>

      <header class="sys7-menubar">
        <div class="sys7-menu-left" data-menu-left></div>
        <div class="sys7-menu-right">
          <span class="sys7-clock" data-clock>9:41 AM</span>
          <span class="sys7-mitem" data-menu="help" title="Guide">${SYS7_ICONS.balloonHelp}</span>
          <span class="sys7-mitem" data-menu="app" title="Application Switcher">${SYS7_ICONS.appFinder}</span>
        </div>
      </header>

      <div class="sys7-desktop">
        <div class="sys7-desk-icons">
          <div class="sys7-icon" data-desk="mac-hd">
            <div class="sys7-icon-glyph">${SYS7_ICONS.macHd}</div>
            <div class="sys7-icon-label">Macintosh HD</div>
          </div>
          <div class="sys7-icon" data-desk="floppy">
            <div class="sys7-icon-glyph">${SYS7_ICONS.floppy}</div>
            <div class="sys7-icon-label">System 7.5 Tools</div>
          </div>
          <div class="sys7-icon" data-desk="hypercard">
            <div class="sys7-icon-glyph">${SYS7_ICONS.hyperCard}</div>
            <div class="sys7-icon-label">HyperCard 2.2</div>
          </div>
        </div>

        <div class="sys7-desk-trash">
          <div class="sys7-icon" data-desk="trash">
            <div class="sys7-icon-glyph" data-trash-glyph>${SYS7_ICONS.trashEmpty}</div>
            <div class="sys7-icon-label">Trash</div>
          </div>
        </div>

        <div class="sys7-windows"></div>
      </div>

      <div class="sys7-cursor">${SYS7_ICONS.cursorArrow}</div>
    `;

    this.container.appendChild(root);
    this.root = root;
    this.menuLeftEl = root.querySelector('[data-menu-left]');
    this.clockEl = root.querySelector('[data-clock]');
    this.desktopEl = root.querySelector('.sys7-desktop');
    this.windowsEl = root.querySelector('.sys7-windows');
    this.cursorEl = root.querySelector('.sys7-cursor');
    this.dropdownEl = null;
    this.balloonEl = null;
    this.overlayEl = null;

    this.setAppMenus('Finder', ['File', 'Edit', 'View', 'Label', 'Special']);
    this._setCursorPos(this.cursorX, this.cursorY);
  }

  _startClock() {
    const tick = () => {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      if (this.clockEl) this.clockEl.textContent = `${h}:${m} ${ampm}`;
    };
    tick();
    const id = setInterval(tick, 1000);
    this._intervals.add(id);
  }

  setAppMenus(appName, items) {
    this.appName = appName;
    this.menuLeftEl.innerHTML =
      `<span class="sys7-mitem" data-menu="apple">${SYS7_ICONS.rainbowApple}</span>` +
      items.map((m) => `<span class="sys7-mitem" data-menu="${m.toLowerCase()}">${m}</span>`).join('');
  }

  applyPattern(idx) {
    const p = SYS7_PATTERNS[idx % SYS7_PATTERNS.length];
    this.patternIndex = idx % SYS7_PATTERNS.length;
    this.root.style.backgroundColor = p.bgColor;
    this.root.style.backgroundImage = p.bgImage;
    this.root.style.backgroundSize = p.bgSize;
    this.root.style.backgroundPosition = p.bgPos;
  }

  setTrashFull(full) {
    this.trashFull = Boolean(full);
    const g = this.root.querySelector('[data-trash-glyph]');
    if (g) g.innerHTML = this.trashFull ? SYS7_ICONS.trashFull : SYS7_ICONS.trashEmpty;
  }

  setStatus(text) {
    this.onStatus(text);
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

  abortCurrent() {
    this.abortFlag = true;
  }

  clearAbort() {
    this.abortFlag = false;
  }

  checkAbort() {
    if (this.destroyed || this.abortFlag) throw new Sys7AbortError();
  }

  async wait(ms) {
    const scaled = Math.max(12, ms / this.speed);
    const step = 30;
    let elapsed = 0;
    while (elapsed < scaled) {
      this.checkAbort();
      if (!this.paused) elapsed += step;
      await new Promise((r) => {
        const id = setTimeout(() => {
          this._timers.delete(id);
          r();
        }, step);
        this._timers.add(id);
      });
    }
    this.checkAbort();
  }

  // ---------- Cursor ----------
  setCursorKind(kind = 'arrow') {
    if (!this.cursorEl) return;
    if (kind === 'watch') this.cursorEl.innerHTML = SYS7_ICONS.cursorWatch;
    else if (kind === 'hand') this.cursorEl.innerHTML = SYS7_ICONS.cursorHand;
    else if (kind === 'ibeam') this.cursorEl.innerHTML = SYS7_ICONS.cursorIbeam;
    else this.cursorEl.innerHTML = SYS7_ICONS.cursorArrow;
  }

  _setCursorPos(x, y) {
    this.cursorX = x;
    this.cursorY = y;
    if (this.cursorEl) {
      this.cursorEl.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    }
  }

  async moveTo(tx, ty, durationMs = 520) {
    const sx = this.cursorX;
    const sy = this.cursorY;
    const dx = tx - sx;
    const dy = ty - sy;
    const dur = Math.max(160, Math.min(860, durationMs)) / this.speed;

    const cx1 = sx + dx * 0.33 + (Math.random() - 0.5) * 40;
    const cy1 = sy + dy * 0.28 + (Math.random() - 0.5) * 32;
    const cx2 = sx + dx * 0.7 + (Math.random() - 0.5) * 24;
    const cy2 = sy + dy * 0.85 + (Math.random() - 0.5) * 22;

    const steps = Math.max(10, Math.round(dur / 16));
    for (let i = 1; i <= steps; i++) {
      this.checkAbort();
      while (this.paused) await this.wait(40);
      const rawT = i / steps;
      const t = rawT < 0.5 ? 2 * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 2) / 2;
      const u = 1 - t;
      const x = u * u * u * sx + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * tx;
      const y = u * u * u * sy + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * ty;
      this._setCursorPos(x, y);
      await new Promise((r) => setTimeout(r, 16));
    }
    this._setCursorPos(tx, ty);
  }

  getElCenter(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  async moveToEl(el, durationMs = 480) {
    if (!el) return;
    const { x, y } = this.getElCenter(el);
    await this.moveTo(x, y, durationMs);
  }

  async clickEl(el, { doubleClick = false } = {}) {
    if (!el) return;
    await this.moveToEl(el);
    this.sounds.click();
    el.classList.add('pressed');
    await this.wait(100);
    el.classList.remove('pressed');
    if (doubleClick) {
      await this.wait(85);
      this.sounds.click();
      el.classList.add('pressed');
      await this.wait(100);
      el.classList.remove('pressed');
    }
  }

  async selectDeskIcon(key, { doubleClick = false } = {}) {
    this.root.querySelectorAll('.sys7-icon.selected').forEach((n) => n.classList.remove('selected'));
    const el = this.root.querySelector(`[data-desk="${key}"]`);
    if (!el) return null;
    await this.moveToEl(el);
    this.sounds.click();
    el.classList.add('selected');
    if (doubleClick) {
      await this.wait(100);
      this.sounds.click();
    }
    return el;
  }

  async dragElTo(sourceEl, targetEl, label) {
    if (!sourceEl || !targetEl) return;
    await this.moveToEl(sourceEl);
    this.sounds.click();
    await this.wait(100);

    const ghost = document.createElement('div');
    ghost.className = 'sys7-drag-ghost';
    ghost.textContent = label;
    document.body.appendChild(ghost);

    const start = this.getElCenter(sourceEl);
    const end = this.getElCenter(targetEl);
    const steps = 26;
    try {
      for (let i = 0; i <= steps; i++) {
        this.checkAbort();
        while (this.paused) await this.wait(40);
        const t = i / steps;
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const x = start.x + (end.x - start.x) * ease;
        const y = start.y + (end.y - start.y) * ease;
        this._setCursorPos(x, y);
        ghost.style.left = `${x}px`;
        ghost.style.top = `${y}px`;
        if (t > 0.85) targetEl.classList.add('drop-target');
        await new Promise((r) => setTimeout(r, Math.max(10, 20 / this.speed)));
      }
      await this.wait(120);
    } finally {
      targetEl.classList.remove('drop-target');
      ghost.remove();
    }
  }

  // ---------- Classic Blink-On-Select Menu Bar Dropdown ----------
  closeDropdown() {
    if (this.dropdownEl) {
      this.dropdownEl.remove();
      this.dropdownEl = null;
    }
    this.root.querySelectorAll('.sys7-mitem.active').forEach((m) => m.classList.remove('active'));
  }

  async pickMenu(menuKey, items, pickMatch) {
    this.closeDropdown();
    const trigger = this.root.querySelector(`[data-menu="${menuKey}"]`);
    if (!trigger) return;
    await this.moveToEl(trigger);
    this.sounds.click();
    trigger.classList.add('active');

    const r = trigger.getBoundingClientRect();
    const dd = document.createElement('div');
    dd.className = 'sys7-dropdown';
    const alignRight = r.left + 190 > window.innerWidth;
    if (alignRight) dd.style.right = `${Math.max(4, window.innerWidth - r.right)}px`;
    else dd.style.left = `${Math.max(4, r.left)}px`;

    dd.innerHTML = items
      .map((item) => {
        if (item.sep) return `<div class="sys7-dd-sep"></div>`;
        return `<div class="sys7-dd-item ${item.disabled ? 'disabled' : ''}">
          <span>${item.label}</span>
          ${item.shortcut ? `<span>${item.shortcut}</span>` : ''}
        </div>`;
      })
      .join('');

    this.root.appendChild(dd);
    this.dropdownEl = dd;
    await this.wait(280);

    const target = [...dd.querySelectorAll('.sys7-dd-item')].find((el) =>
      el.textContent.toLowerCase().includes(pickMatch.toLowerCase()),
    );
    if (target) {
      await this.moveToEl(target, 300);
      // Authentic Classic Mac menu-select flash!
      for (let b = 0; b < 2; b++) {
        target.classList.add('highlight');
        await this.wait(90);
        target.classList.remove('highlight');
        await this.wait(70);
      }
      target.classList.add('highlight');
      this.sounds.click();
      await this.wait(120);
    }
    this.closeDropdown();
  }

  // ---------- Balloon Help ----------
  showBalloonNear(el, text) {
    this.hideBalloon();
    if (!el) return;
    const r = el.getBoundingClientRect();
    const b = document.createElement('div');
    b.className = 'sys7-balloon';
    b.textContent = text;
    document.body.appendChild(b);
    const br = b.getBoundingClientRect();
    const left = Math.max(12, Math.min(window.innerWidth - br.width - 12, r.left - br.width * 0.65));
    const top = Math.max(28, r.top - br.height - 10);
    b.style.left = `${Math.round(left)}px`;
    b.style.top = `${Math.round(top)}px`;
    this.balloonEl = b;
  }

  hideBalloon() {
    if (this.balloonEl) {
      this.balloonEl.remove();
      this.balloonEl = null;
    }
  }

  // ---------- Windows ----------
  getStageSize() {
    const r = this.desktopEl.getBoundingClientRect();
    return { w: r.width || window.innerWidth, h: r.height || window.innerHeight - 21 };
  }

  createWindow({ id, title, width = 480, height = 320, x, y, zoom = true, bodyHtml = '' }) {
    if (this.windows.has(id)) this.closeWindow(id);
    const { w, h } = this.getStageSize();
    const cw = Math.min(width, Math.max(250, w - 36));
    const ch = Math.min(height, Math.max(160, h - 32));
    const left = x !== undefined ? Math.min(x, w - cw - 12) : Math.max(16, Math.round((w - cw) / 2) - 24);
    const top = y !== undefined ? Math.min(y, h - ch - 12) : Math.max(14, Math.round((h - ch) / 2));

    const el = document.createElement('section');
    el.className = 'sys7-win';
    el.dataset.winId = id;
    el.style.width = `${cw}px`;
    el.style.height = `${ch}px`;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    el.innerHTML = `
      <div class="sys7-titlebar">
        <div class="sys7-box-btn close" data-close-win title="Close"></div>
        <div class="sys7-stripes"></div>
        <div class="sys7-title-text">${title}</div>
        <div class="sys7-stripes"></div>
        ${zoom ? `<div class="sys7-box-btn zoom" title="Zoom"></div>` : ''}
      </div>
      <div class="sys7-win-body">${bodyHtml}</div>
    `;

    this.windowsEl.appendChild(el);
    const winObj = { id, title, el, body: el.querySelector('.sys7-win-body') };
    this.windows.set(id, winObj);
    this.focusWindow(id);
    return winObj;
  }

  focusWindow(id) {
    this.activeWinId = id;
    for (const [wid, w] of this.windows) {
      w.el.classList.toggle('active', wid === id);
      if (wid === id) w.el.style.zIndex = String(++this.nextZ);
    }
  }

  closeWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;
    win.el.remove();
    this.windows.delete(id);
    if (this.activeWinId === id) {
      const rest = [...this.windows.keys()];
      this.activeWinId = rest.length ? rest[rest.length - 1] : null;
      if (this.activeWinId) this.focusWindow(this.activeWinId);
    }
  }

  async clickCloseWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;
    const btn = win.el.querySelector('[data-close-win]');
    if (btn) await this.clickEl(btn);
    this.closeWindow(id);
  }

  closeAllWindows() {
    this.closeDropdown();
    this.hideBalloon();
    for (const [, w] of this.windows) w.el.remove();
    this.windows.clear();
    this.activeWinId = null;
    this.root.querySelectorAll('.sys7-icon.selected').forEach((n) => n.classList.remove('selected'));
    this.setCursorKind('arrow');
  }

  async typeText(targetEl, text, { charMs = 46, sound = true } = {}) {
    for (let i = 0; i < text.length; i++) {
      this.checkAbort();
      targetEl.textContent += text[i];
      if (sound && text[i] !== ' ') this.sounds.key();
      await this.wait(charMs + Math.random() * 24);
    }
  }

  unmount() {
    this.destroyed = true;
    this.abortFlag = true;
    for (const t of this._timers) clearTimeout(t);
    for (const iv of this._intervals) clearInterval(iv);
    this._timers.clear();
    this._intervals.clear();
    this.closeAllWindows();
    if (this.overlayEl) this.overlayEl.remove();
    this.container.innerHTML = '';
  }
}
