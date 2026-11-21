import { settlePointer, textApply, typeInto as typeHuman } from '../../js/human.js';
import { LISA_ICONS } from './icons.js';
import { LisaSounds } from './sounds.js';

export class LisaAbortError extends Error {
  constructor() {
    super('Apple Lisa scene aborted');
    this.name = 'LisaAbortError';
  }
}

export class LisaEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});

    this.sounds = new LisaSounds();
    this.sounds.setMuted(options.muted ?? true);

    this.destroyed = false;
    this.windows = new Map();
    this.nextZ = 100;
    this.activeWinId = null;
    this.cursorX = 340;
    this.cursorY = 220;
    this.dropdownEl = null;
    this.overlayEl = null;
    this.clockInterval = null;

    this._buildDOM();
    this._startClock();
  }

  _buildDOM() {
    this.container.innerHTML = '';
    const root = document.createElement('div');
    root.className = 'lisa-root';
    root.innerHTML = `
      <div class="lisa-corner tl"></div>
      <div class="lisa-corner tr"></div>
      <div class="lisa-corner bl"></div>
      <div class="lisa-corner br"></div>

      <header class="lisa-menubar">
        <div class="lisa-menu-left" data-menu-left></div>
        <div class="lisa-menu-right">
          <span class="lisa-app-badge" data-app-badge>Desktop Manager</span>
          <span class="lisa-clock" data-clock>9:41 AM</span>
        </div>
      </header>

      <div class="lisa-desktop" data-desktop>
        <!-- Left column: Lisa's iconic Stationery Pads! -->
        <div class="lisa-desk-left">
          <div class="lisa-icon" data-desk="pad-write">
            <div class="lisa-icon-glyph">${LISA_ICONS.padWrite}</div>
            <div class="lisa-icon-label">LisaWrite Paper</div>
          </div>
          <div class="lisa-icon" data-desk="pad-draw">
            <div class="lisa-icon-glyph">${LISA_ICONS.padDraw}</div>
            <div class="lisa-icon-label">LisaDraw Paper</div>
          </div>
          <div class="lisa-icon" data-desk="pad-calc">
            <div class="lisa-icon-glyph">${LISA_ICONS.padCalc}</div>
            <div class="lisa-icon-label">LisaCalc Paper</div>
          </div>
          <div class="lisa-icon" data-desk="pad-graph">
            <div class="lisa-icon-glyph">${LISA_ICONS.padGraph}</div>
            <div class="lisa-icon-label">LisaGraph Paper</div>
          </div>
          <div class="lisa-icon" data-desk="pad-project">
            <div class="lisa-icon-glyph">${LISA_ICONS.padProject}</div>
            <div class="lisa-icon-label">LisaProject Paper</div>
          </div>
        </div>

        <!-- Right column: ProFile 5 MB, Tools & Accessories -->
        <div class="lisa-desk-right">
          <div class="lisa-icon" data-desk="profile">
            <div class="lisa-icon-glyph">${LISA_ICONS.profile5mb}</div>
            <div class="lisa-icon-label">ProFile</div>
          </div>
          <div class="lisa-icon" data-desk="terminal">
            <div class="lisa-icon-glyph">${LISA_ICONS.terminal}</div>
            <div class="lisa-icon-label">LisaTerminal</div>
          </div>
          <div class="lisa-icon" data-desk="calculator">
            <div class="lisa-icon-glyph">${LISA_ICONS.calculator}</div>
            <div class="lisa-icon-label">Calculator</div>
          </div>
          <div class="lisa-icon" data-desk="preferences">
            <div class="lisa-icon-glyph">${LISA_ICONS.preferences}</div>
            <div class="lisa-icon-label">Preferences</div>
          </div>
          <div class="lisa-icon" data-desk="lisaguide">
            <div class="lisa-icon-glyph">${LISA_ICONS.lisaGuide}</div>
            <div class="lisa-icon-label">LisaGuide</div>
          </div>
        </div>

        <!-- Bottom-right: Clipboard & iconic Lisa Wastebasket -->
        <div class="lisa-desk-bottom">
          <div class="lisa-icon" data-desk="clipboard">
            <div class="lisa-icon-glyph">${LISA_ICONS.clipboard}</div>
            <div class="lisa-icon-label">Clipboard</div>
          </div>
          <div class="lisa-icon" data-desk="wastebasket">
            <div class="lisa-icon-glyph" data-waste-glyph>${LISA_ICONS.wastebasketEmpty}</div>
            <div class="lisa-icon-label">Wastebasket</div>
          </div>
        </div>

        <div class="lisa-windows" data-windows></div>
      </div>

      <div class="lisa-cursor" data-cursor>${LISA_ICONS.cursorArrow}</div>

      <div class="lisa-profile-hud" data-profile-hud>
        <span class="lisa-profile-led"></span>
        <span data-profile-text>ProFile 5 MB</span>
      </div>
    `;

    this.container.appendChild(root);
    this.root = root;
    this.menuLeftEl = root.querySelector('[data-menu-left]');
    this.appBadgeEl = root.querySelector('[data-app-badge]');
    this.clockEl = root.querySelector('[data-clock]');
    this.desktopEl = root.querySelector('[data-desktop]');
    this.windowsEl = root.querySelector('[data-windows]');
    this.cursorEl = root.querySelector('[data-cursor]');
    this.profileHudEl = root.querySelector('[data-profile-hud]');
    this.profileTextEl = root.querySelector('[data-profile-text]');

    this.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
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
    this.clockInterval = setInterval(tick, 1000);
  }

  getDateInfo() {
    const now = new Date();
    return {
      now,
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

  setContrast(value = 1) {
    this.root.style.setProperty('--lisa-contrast', String(value));
  }

  setWastebasketFull(full) {
    const g = this.root.querySelector('[data-waste-glyph]');
    if (g) g.innerHTML = full ? LISA_ICONS.wastebasketFull : LISA_ICONS.wastebasketEmpty;
  }

  async pulseProFile(steps = 4, label = 'ProFile 5 MB · Reading', signal = null) {
    this.profileTextEl.textContent = label;
    this.profileHudEl.classList.add('visible', 'busy');
    try {
      for (let i = 0; i < steps; i++) {
        this.sounds.profileSeek();
        await this.wait(85, signal);
      }
      this.profileHudEl.classList.remove('busy');
      await this.wait(180, signal);
    } finally {
      this.profileHudEl.classList.remove('visible', 'busy');
    }
  }

  setAppMenus(appName, items) {
    this.appBadgeEl.textContent = appName;
    this.menuLeftEl.innerHTML = items
      .map((label) => `<span class="lisa-mitem" data-menu="${label.toLowerCase()}">${label}</span>`)
      .join('');
  }

  _checkSignal(signal) {
    if (this.destroyed || signal?.aborted) {
      throw new LisaAbortError();
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

  /* =================================================================
     Cursor & Motion
     ================================================================= */
  setCursorKind(kind = 'arrow') {
    if (!this.cursorEl) return;
    if (kind === 'hourglass') this.cursorEl.innerHTML = LISA_ICONS.cursorHourglass;
    else if (kind === 'ibeam') this.cursorEl.innerHTML = LISA_ICONS.cursorIbeam;
    else if (kind === 'cross') this.cursorEl.innerHTML = LISA_ICONS.cursorCross;
    else this.cursorEl.innerHTML = LISA_ICONS.cursorArrow;
  }

  _setCursorPos(x, y) {
    this.cursorX = x;
    this.cursorY = y;
    if (this.cursorEl) {
      this.cursorEl.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    }
  }

  getElCenter(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  async moveTo(tx, ty, durationMs = null, signal = null) {
    this._checkSignal(signal);
    const sx = this.cursorX;
    const sy = this.cursorY;
    const dx = tx - sx;
    const dy = ty - sy;
    const dist = Math.hypot(dx, dy);
    if (dist < 2) {
      this._setCursorPos(tx, ty);
      return;
    }

    const dur = durationMs ?? Math.max(240, Math.min(820, 180 + dist * 0.85));
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arc = (Math.random() > 0.5 ? 1 : -1) * Math.min(30, dist * 0.13);
    const cx1 = sx + dx * 0.34 + perpX * arc;
    const cy1 = sy + dy * 0.34 + perpY * arc;
    const cx2 = sx + dx * 0.72 + perpX * (arc * 0.4);
    const cy2 = sy + dy * 0.72 + perpY * (arc * 0.4);

    let elapsed = 0;
    let last = performance.now();
    while (elapsed < dur) {
      await new Promise((r) => requestAnimationFrame(r));
      this._checkSignal(signal);
      const now = performance.now();
      const dt = Math.min(60, now - last);
      last = now;
      if (!this.paused) elapsed += dt * this.speed;
      const rawT = Math.min(1, elapsed / dur);
      const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
      const u = 1 - t;
      this._setCursorPos(
        u * u * u * sx + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * tx,
        u * u * u * sy + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * ty,
      );
    }
    await settlePointer(sx, sy, tx, ty, {
      signal,
      wait: (ms, sig) => this.wait(ms, sig),
      place: (px, py) => this._setCursorPos(px, py),
    });
  }

  async moveToEl(el, durationMs = null, signal = null) {
    if (!el) return;
    const { x, y } = this.getElCenter(el);
    await this.moveTo(x, y, durationMs, signal);
  }

  async clickEl(el, { doubleClick = false } = {}, signal = null) {
    if (!el) return;
    await this.moveToEl(el, null, signal);
    this.sounds.click();
    el.classList.add('pressed');
    await this.wait(95, signal);
    el.classList.remove('pressed');
    if (doubleClick) {
      await this.wait(85, signal);
      this.sounds.click();
      el.classList.add('pressed');
      await this.wait(95, signal);
      el.classList.remove('pressed');
    }
  }

  async selectDeskIcon(key, { doubleClick = false } = {}, signal = null) {
    this.root.querySelectorAll('.lisa-icon.selected').forEach((n) => n.classList.remove('selected'));
    const el = this.root.querySelector(`[data-desk="${key}"]`);
    if (!el) return null;
    await this.moveToEl(el, null, signal);
    this.sounds.click();
    el.classList.add('selected');
    if (doubleClick) {
      await this.wait(95, signal);
      this.sounds.click();
    }
    return el;
  }

  /**
   * Iconic Apple Lisa Stationery Pad workflow:
   * Select pad -> File/Print -> Tear Off Stationery -> fresh sheet slides out!
   */
  async tearOffStationery(padKey, docName, signal = null) {
    const padEl = await this.selectDeskIcon(padKey, {}, signal);
    await this.wait(220, signal);
    await this.pickMenu(
      'file/print',
      [
        { label: 'Tear Off Stationery' },
        { label: 'Open' },
        { label: 'Duplicate' },
        { sep: true },
        { label: 'Save & Put Away', disabled: true },
        { label: 'Print…' },
      ],
      'Tear Off Stationery',
      signal,
    );

    if (!padEl) return;
    const rect = padEl.getBoundingClientRect();
    const sheet = document.createElement('div');
    sheet.className = 'lisa-torn-sheet';
    sheet.innerHTML = `
      <div class="lisa-icon-glyph">${padEl.querySelector('.lisa-icon-glyph')?.innerHTML || ''}</div>
      <div class="lisa-icon-label" style="background:#0f0f0e;color:#f5f4ed;">${docName}</div>
    `;
    sheet.style.left = `${Math.round(rect.left)}px`;
    sheet.style.top = `${Math.round(rect.top)}px`;
    this.desktopEl.appendChild(sheet);

    this.sounds.tearPaper();
    try {
      const targetX = rect.left + 108;
      const targetY = rect.top + 8;
      for (let i = 1; i <= 14; i++) {
        const t = i / 14;
        sheet.style.left = `${Math.round(rect.left + (targetX - rect.left) * t)}px`;
        sheet.style.top = `${Math.round(rect.top + (targetY - rect.top) * t)}px`;
        await this.wait(18, signal);
      }
      await this.moveTo(targetX + 24, targetY + 22, 340, signal);
      this.sounds.click();
      await this.wait(85, signal);
      this.sounds.click();
      this.setCursorKind('hourglass');
      await this.pulseProFile(4, `ProFile 5 MB · Opening ${docName}`, signal);
    } finally {
      sheet.remove();
      this.setCursorKind('arrow');
    }
  }

  async dragElTo(sourceEl, targetEl, label, signal = null) {
    if (!sourceEl || !targetEl) return;
    await this.moveToEl(sourceEl, null, signal);
    this.sounds.click();
    await this.wait(90, signal);

    const ghost = document.createElement('div');
    ghost.className = 'lisa-drag-ghost';
    ghost.textContent = label;
    document.body.appendChild(ghost);

    const start = this.getElCenter(sourceEl);
    const end = this.getElCenter(targetEl);
    const steps = 24;
    try {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const x = start.x + (end.x - start.x) * ease;
        const y = start.y + (end.y - start.y) * ease;
        this._setCursorPos(x, y);
        ghost.style.left = `${x}px`;
        ghost.style.top = `${y}px`;
        targetEl.classList.toggle('drop-target', t > 0.85);
        await this.wait(22, signal);
      }
      await this.wait(110, signal);
      this.sounds.click();
    } finally {
      targetEl.classList.remove('drop-target');
      ghost.remove();
    }
  }

  /* =================================================================
     Menu Bar Dropdowns
     ================================================================= */
  closeDropdown() {
    if (this.dropdownEl) {
      this.dropdownEl.remove();
      this.dropdownEl = null;
    }
    this.root.querySelectorAll('.lisa-mitem.active').forEach((m) => m.classList.remove('active'));
  }

  async pickMenu(menuKey, items, pickMatch, signal = null) {
    this.closeDropdown();
    const trigger = this.root.querySelector(`[data-menu="${menuKey.toLowerCase()}"]`);
    if (!trigger) return;

    await this.moveToEl(trigger, 360, signal);
    this.sounds.click();
    trigger.classList.add('active');

    const r = trigger.getBoundingClientRect();
    const dd = document.createElement('div');
    dd.className = 'lisa-dropdown';
    dd.style.left = `${Math.max(6, Math.round(r.left))}px`;

    dd.innerHTML = items
      .map((item) => {
        if (item.sep) return `<div class="lisa-dd-sep"></div>`;
        return `<div class="lisa-dd-item ${item.disabled ? 'disabled' : ''}">
          <span>${item.label}</span>
          ${item.shortcut ? `<span>${item.shortcut}</span>` : ''}
        </div>`;
      })
      .join('');

    this.root.appendChild(dd);
    this.dropdownEl = dd;

    try {
      await this.wait(240, signal);
      const target = [...dd.querySelectorAll('.lisa-dd-item')].find((el) =>
        el.textContent.toLowerCase().includes(pickMatch.toLowerCase()),
      );
      if (target) {
        await this.moveToEl(target, 280, signal);
        for (let b = 0; b < 2; b++) {
          target.classList.add('highlight');
          await this.wait(80, signal);
          target.classList.remove('highlight');
          await this.wait(65, signal);
        }
        target.classList.add('highlight');
        this.sounds.click();
        await this.wait(110, signal);
      }
    } finally {
      this.closeDropdown();
    }
  }

  /* =================================================================
     Lisa Window Manager
     ================================================================= */
  getStageSize() {
    const r = this.desktopEl.getBoundingClientRect();
    return { w: r.width || window.innerWidth, h: r.height || window.innerHeight - 22 };
  }

  createWindow({ id, title, width = 540, height = 360, x, y, scrollbars = true, bodyHtml = '' }) {
    if (this.windows.has(id)) this.closeWindow(id);
    const { w, h } = this.getStageSize();
    const cw = Math.min(width, Math.max(280, w - 44));
    const ch = Math.min(height, Math.max(190, h - 38));
    const left = x !== undefined ? Math.max(14, Math.min(x, w - cw - 14)) : Math.max(18, Math.round((w - cw) / 2));
    const top = y !== undefined ? Math.max(12, Math.min(y, h - ch - 12)) : Math.max(16, Math.round((h - ch) / 2));

    const el = document.createElement('section');
    el.className = `lisa-win ${scrollbars ? '' : 'no-scroll'}`;
    el.dataset.winId = id;
    el.style.width = `${cw}px`;
    el.style.height = `${ch}px`;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    const scrollMarkup = scrollbars
      ? `
        <div class="lisa-vscroll">
          <div>
            <div class="lisa-split-knob"></div>
            <div class="lisa-sbtn">▲</div>
          </div>
          <div class="lisa-sthumb-v"></div>
          <div class="lisa-sbtn">▼</div>
        </div>
        <div class="lisa-hscroll">
          <div style="display:flex;align-items:center;">
            <div class="lisa-sbtn">◀</div>
          </div>
          <div class="lisa-sthumb-h"></div>
          <div class="lisa-sbtn">▶</div>
        </div>
        <div class="lisa-resize-box"></div>
      `
      : '';

    el.innerHTML = `
      <div class="lisa-titlebar">
        <div class="lisa-title-docbtn" data-close-win title="Set Aside">${LISA_ICONS.miniDoc}</div>
        <div class="lisa-title-text">${title}</div>
        <div style="width:15px;flex:none;"></div>
      </div>
      <div class="lisa-win-inner">
        <div class="lisa-win-body">${bodyHtml}</div>
        ${scrollMarkup}
      </div>
    `;

    this.windowsEl.appendChild(el);
    const win = { id, title, el, body: el.querySelector('.lisa-win-body') };
    this.windows.set(id, win);
    this.focusWindow(id);
    return win;
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

  async setAsideWindow(id, signal = null) {
    const win = this.windows.get(id);
    if (!win) return;
    const btn = win.el.querySelector('[data-close-win]');
    if (btn) await this.clickEl(btn, { doubleClick: true }, signal);
    this.closeWindow(id);
  }

  closeAllWindows() {
    this.closeDropdown();
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }
    for (const [, w] of this.windows) w.el.remove();
    this.windows.clear();
    this.activeWinId = null;
    this.root.querySelectorAll('.lisa-icon.selected').forEach((n) => n.classList.remove('selected'));
    this.root.querySelectorAll('.lisa-torn-sheet').forEach((n) => n.remove());
    this.profileHudEl.classList.remove('visible', 'busy');
    this.setCursorKind('arrow');
    this.setContrast(1);
    this.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
  }

  async typeText(el, text, { charMs = 42, sound = true, allowTypo = true } = {}, signal = null) {
    await typeHuman(text, { base: charMs, allowTypo: allowTypo && sound }, {
      check: () => this._checkSignal(signal),
      apply: textApply(el),
      sound: (step) => {
        if (sound && (step.kind === 'backspace' || (step.ch !== ' ' && step.ch !== '\n'))) this.sounds.key();
      },
      wait: (ms) => this.wait(ms, signal),
    });
  }

  destroy() {
    this.destroyed = true;
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.closeAllWindows();
    this.sounds.destroy();
    this.container.innerHTML = '';
  }
}
