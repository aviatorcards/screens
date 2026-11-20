import { NEXT_ICONS } from './icons.js';
import { NextSounds } from './sounds.js';

export class NextAbortError extends Error {
  constructor() {
    super('NeXTSTEP scene aborted');
    this.name = 'NextAbortError';
  }
}

const APP_MENUS = {
  Workspace: [
    { label: 'Info', sub: ['Info Panel…', 'Preferences…', 'Help…'] },
    { label: 'File', sub: ['Open', 'New Folder', 'Duplicate', 'Destroy'] },
    { label: 'Edit', sub: ['Cut', 'Copy', 'Paste'] },
    { label: 'Disk', sub: ['Check for Disks', 'Eject'] },
    { label: 'View', sub: ['Browser', 'Icon', 'Listing'] },
    { label: 'Tools', sub: ['Inspector…', 'Finder…', 'Empty Recycler'] },
    { label: 'Windows', sub: ['Miniaturize', 'Close'] },
    { label: 'Hide', key: 'h' },
    { label: 'Log Out', key: 'q' },
  ],
  Terminal: [
    { label: 'Info', sub: ['Info Panel…'] },
    { label: 'Shell', sub: ['New Shell', 'Close Shell'] },
    { label: 'Edit', sub: ['Copy', 'Paste', 'Find…'] },
    { label: 'Windows', sub: ['Miniaturize', 'Close'] },
    { label: 'Hide', key: 'h' },
    { label: 'Quit', key: 'q' },
  ],
  Edit: [
    { label: 'Info', sub: ['Info Panel…'] },
    { label: 'File', sub: ['New', 'Open…', 'Save', 'Save As…', 'Close'] },
    { label: 'Edit', sub: ['Undo', 'Cut', 'Copy', 'Paste'] },
    { label: 'Format', sub: ['Font', 'Page Layout…'] },
    { label: 'Windows', sub: ['Miniaturize', 'Close'] },
    { label: 'Hide', key: 'h' },
    { label: 'Quit', key: 'q' },
  ],
  WorldWideWeb: [
    { label: 'Info', sub: ['About WorldWideWeb…'] },
    { label: 'Document', sub: ['Open from full URL…', 'Back', 'Home', 'Close'] },
    { label: 'Navigate', sub: ['Back', 'Next', 'Previous', 'Home'] },
    { label: 'Edit', sub: ['Copy', 'Find…'] },
    { label: 'Windows', sub: ['Miniaturize', 'Close'] },
    { label: 'Quit', key: 'q' },
  ],
  InterfaceBuilder: [
    { label: 'Info', sub: ['Info Panel…'] },
    { label: 'Document', sub: ['New Application', 'Save', 'Test Interface'] },
    { label: 'Edit', sub: ['Cut', 'Copy', 'Paste'] },
    { label: 'Tools', sub: ['Inspector', 'Palettes', 'Classes'] },
    { label: 'Windows', sub: ['Miniaturize', 'Close'] },
    { label: 'Quit', key: 'q' },
  ],
  Mail: [
    { label: 'Info', sub: ['Info Panel…'] },
    { label: 'Mailbox', sub: ['Check New Mail', 'Compact'] },
    { label: 'Message', sub: ['New', 'Reply', 'Deliver', 'Delete'] },
    { label: 'Windows', sub: ['Miniaturize', 'Close'] },
    { label: 'Quit', key: 'q' },
  ],
  Preferences: [
    { label: 'Info', sub: ['Info Panel…'] },
    { label: 'Edit', sub: ['Cut', 'Copy', 'Paste'] },
    { label: 'Windows', sub: ['Miniaturize', 'Close'] },
    { label: 'Quit', key: 'q' },
  ],
  'Display PS': [
    { label: 'Info', sub: ['About Display PostScript…'] },
    { label: 'File', sub: ['Execute Buffer', 'Clear Canvas'] },
    { label: 'Windows', sub: ['Miniaturize', 'Close'] },
    { label: 'Quit', key: 'q' },
  ],
};

export function leftScrollHtml() {
  return `
    <div class="nx-lscroll">
      <div class="nx-lscroll-track">
        <div class="nx-lscroll-thumb"></div>
      </div>
      <div class="nx-lscroll-arrows">
        <div class="nx-lscroll-btn">▲</div>
        <div class="nx-lscroll-btn">▼</div>
      </div>
    </div>
  `;
}

export class NextStepEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});

    this.sounds = new NextSounds();
    this.sounds.setMuted(options.muted ?? true);

    this.zCounter = 110;
    this.windows = new Map();
    this.miniWindows = new Map();
    this.activeApp = 'Workspace';
    this.cursor = { x: 260, y: 180, mode: 'arrow' };
    this.deskShadeIndex = 0;
    this.destroyed = false;
    this.clockInterval = null;

    this._buildShell();
    this._startDockClock();
  }

  _buildShell() {
    this.root = document.createElement('div');
    this.root.className = 'nx-root';

    this.root.innerHTML = `
      <!-- Floating Top-Left Vertical Main Menu -->
      <aside class="nx-main-menu" id="nx-main-menu">
        <div class="nx-menu-head" id="nx-menu-head">Workspace</div>
        <div class="nx-menu-list" id="nx-menu-list"></div>
      </aside>

      <!-- Windows Layer -->
      <div class="nx-windows" id="nx-windows"></div>

      <!-- Miniaturized 64×64 Windows Tray (Bottom-Left) -->
      <div class="nx-miniwindows" id="nx-miniwindows"></div>

      <!-- Iconic Right-Edge 64×64 NeXT Dock -->
      <aside class="nx-dock" id="nx-dock">
        <div class="nx-dock-stack">
          <div class="nx-tile running" data-dock="workspace" title="Workspace Manager">${NEXT_ICONS.nextCube}</div>
          <div class="nx-tile nx-dock-clock" data-dock="clock" title="NeXT Clock">
            <canvas id="nx-clock-canvas" width="42" height="42"></canvas>
            <div class="nx-dock-date" id="nx-clock-date">THU 19</div>
          </div>
          <div class="nx-tile" data-dock="terminal" title="Terminal.app">${NEXT_ICONS.terminal}</div>
          <div class="nx-tile" data-dock="edit" title="Edit.app">${NEXT_ICONS.edit}</div>
          <div class="nx-tile" data-dock="www" title="WorldWideWeb.app">${NEXT_ICONS.www}</div>
          <div class="nx-tile" data-dock="mail" title="Mail.app">${NEXT_ICONS.mail}</div>
          <div class="nx-tile" data-dock="ib" title="InterfaceBuilder.app">${NEXT_ICONS.ib}</div>
          <div class="nx-tile" data-dock="prefs" title="Preferences.app">${NEXT_ICONS.prefs}</div>
        </div>
        <div class="nx-dock-stack">
          <div class="nx-tile" data-dock="recycler" title="Recycler">${NEXT_ICONS.recycler}</div>
        </div>
      </aside>

      <div class="nx-cursor" id="nx-cursor">${NEXT_ICONS.cursorArrow}</div>
    `;

    this.container.appendChild(this.root);

    this.menuHeadEl = this.root.querySelector('#nx-menu-head');
    this.menuListEl = this.root.querySelector('#nx-menu-list');
    this.windowsEl = this.root.querySelector('#nx-windows');
    this.miniTrayEl = this.root.querySelector('#nx-miniwindows');
    this.dockEl = this.root.querySelector('#nx-dock');
    this.clockCanvas = this.root.querySelector('#nx-clock-canvas');
    this.clockDateEl = this.root.querySelector('#nx-clock-date');
    this.cursorEl = this.root.querySelector('#nx-cursor');

    this.setActiveApp('Workspace');
    this._renderCursor();
  }

  _startDockClock() {
    const draw = () => {
      const now = new Date();
      const ctx = this.clockCanvas.getContext('2d');
      ctx.clearRect(0, 0, 42, 42);
      ctx.fillStyle = '#ececec';
      ctx.beginPath();
      ctx.arc(21, 21, 18.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        ctx.fillStyle = '#000';
        ctx.fillRect(21 + Math.cos(a) * 14.5 - 0.8, 21 + Math.sin(a) * 14.5 - 0.8, 1.6, 1.6);
      }

      const s = now.getSeconds();
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      const hand = (ang, len, w, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(21, 21);
        ctx.lineTo(21 + Math.cos(ang - Math.PI / 2) * len, 21 + Math.sin(ang - Math.PI / 2) * len);
        ctx.stroke();
      };
      hand((h * Math.PI) / 6, 9, 2, '#000');
      hand((m * Math.PI) / 30, 13.5, 1.4, '#000');
      hand((s * Math.PI) / 30, 14.5, 0.8, '#b02828');

      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      this.clockDateEl.textContent = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`;
    };
    draw();
    this.clockInterval = setInterval(draw, 1000);
  }

  getDynamicDateInfo() {
    const now = new Date();
    return {
      now,
      weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
      shortDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      timeStr: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      unixDate: now.toUTCString().replace('GMT', 'PST'),
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

  setDeskShade(hex) {
    this.root.style.setProperty('--nx-desk', hex);
  }

  setActiveApp(appName) {
    this.activeApp = appName;
    this.menuHeadEl.textContent = appName;
    const rows = APP_MENUS[appName] || APP_MENUS.Workspace;
    this.menuListEl.innerHTML = rows
      .map(
        (r) => `
      <div class="nx-menu-row" data-nx-menu="${r.label}">
        <span>${r.label}</span>
        ${r.sub ? '<span>▸</span>' : r.key ? `<span class="nx-key">${r.key}</span>` : ''}
      </div>`,
      )
      .join('');
  }

  getDockTile(id) {
    return this.dockEl.querySelector(`[data-dock="${id}"]`);
  }

  setDockRunning(id, running) {
    const tile = this.getDockTile(id);
    if (tile) tile.classList.toggle('running', Boolean(running));
  }

  _checkSignal(signal) {
    if (this.destroyed || signal?.aborted) {
      throw new NextAbortError();
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

  setCursorMode(mode) {
    if (this.cursor.mode === mode) return;
    this.cursor.mode = mode;
    if (mode === 'ibeam') this.cursorEl.innerHTML = NEXT_ICONS.cursorIBeam;
    else if (mode === 'wait') this.cursorEl.innerHTML = NEXT_ICONS.cursorWait;
    else this.cursorEl.innerHTML = NEXT_ICONS.cursorArrow;
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

    const dur = durationMs ?? Math.max(240, Math.min(860, 200 + dist * 0.9));
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arc = (Math.random() > 0.5 ? 1 : -1) * Math.min(40, dist * 0.14);
    const cx1 = sx + dx * 0.34 + perpX * arc;
    const cy1 = sy + dy * 0.34 + perpY * arc;
    const cx2 = sx + dx * 0.72 + perpX * (arc * 0.45);
    const cy2 = sy + dy * 0.72 + perpY * (arc * 0.45);

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

  async click(el = null, opts = {}, signal = null) {
    if (el) {
      const pt = this._getElPoint(el, opts.rx ?? 0.5, opts.ry ?? 0.5);
      await this.moveTo(pt.x, pt.y, opts.duration ?? null, signal);
    }
    this.sounds.click();
    if (el && opts.pressClass) el.classList.add(opts.pressClass);
    await this.wait(110, signal);
    if (el && opts.pressClass) el.classList.remove(opts.pressClass);
    await this.wait(opts.afterMs ?? 120, signal);
  }

  async doubleClick(el, signal = null) {
    const pt = this._getElPoint(el, 0.5, 0.5);
    await this.moveTo(pt.x, pt.y, null, signal);
    this.sounds.click();
    await this.wait(90, signal);
    this.sounds.click();
    await this.wait(140, signal);
  }

  async drag(fromEl, toEl, labelText, signal = null) {
    const startPt = this._getElPoint(fromEl, 0.5, 0.5);
    await this.moveTo(startPt.x, startPt.y, null, signal);
    this.sounds.click();
    await this.wait(110, signal);

    const ghost = document.createElement('div');
    ghost.className = 'nx-drag-ghost';
    ghost.textContent = labelText;
    this.root.appendChild(ghost);

    const sx = this.cursor.x;
    const sy = this.cursor.y;
    const endPt = this._getElPoint(toEl, 0.5, 0.5);
    const dur = 680;
    let elapsed = 0;
    let last = performance.now();

    try {
      while (elapsed < dur) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        this._checkSignal(signal);
        const now = performance.now();
        const dt = Math.min(60, now - last);
        last = now;
        if (!this.paused) elapsed += dt * this.speed;
        const rawT = Math.min(1, elapsed / dur);
        const t = rawT < 0.5 ? 2 * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 2) / 2;
        this.cursor.x = sx + (endPt.x - sx) * t;
        this.cursor.y = sy + (endPt.y - sy) * t;
        this._renderCursor();
        ghost.style.left = `${this.cursor.x}px`;
        ghost.style.top = `${this.cursor.y}px`;
        toEl.classList.toggle('drop-target', rawT > 0.84);
      }
      await this.wait(120, signal);
      this.sounds.click();
    } finally {
      toEl.classList.remove('drop-target');
      ghost.remove();
    }
  }

  cleanupSubmenus() {
    this.menuListEl.querySelectorAll('.nx-submenu').forEach((s) => s.remove());
    this.menuListEl.querySelectorAll('.nx-menu-row.active').forEach((r) => r.classList.remove('active'));
  }

  async pickMainMenu(parentLabel, subLabel = null, signal = null) {
    const row = this.menuListEl.querySelector(`[data-nx-menu="${parentLabel}"]`);
    if (!row) return;
    await this.click(row, { afterMs: 80 }, signal);
    row.classList.add('active');

    const def = (APP_MENUS[this.activeApp] || APP_MENUS.Workspace).find((m) => m.label === parentLabel);
    if (!def?.sub || !subLabel) {
      await this.wait(220, signal);
      row.classList.remove('active');
      return;
    }

    const sub = document.createElement('div');
    sub.className = 'nx-submenu';
    const subRows = [];
    for (const s of def.sub) {
      const sr = document.createElement('div');
      sr.className = 'nx-menu-row';
      sr.textContent = s;
      sub.appendChild(sr);
      subRows.push({ label: s, el: sr });
    }
    row.appendChild(sub);

    try {
      await this.wait(200, signal);
      const target = subRows.find((r) => r.label === subLabel) || subRows[0];
      if (target) {
        await this.click(target.el, { afterMs: 90 }, signal);
        target.el.classList.add('active');
        await this.wait(260, signal);
      }
    } finally {
      sub.remove();
      row.classList.remove('active');
    }
  }

  async typeText(el, text, opts = {}, signal = null) {
    const delay = opts.delay ?? 46;
    let buf = opts.prefix || '';
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const render = (caret = true) => {
      el.innerHTML = caret ? `${esc(buf)}<span class="nx-caret"></span>` : esc(buf);
    };
    render(true);
    for (let i = 0; i < text.length; i++) {
      buf += text[i];
      render(true);
      if (text[i] !== ' ') this.sounds.key();
      let pause = delay + Math.random() * 34;
      if (text[i] === '\n') pause += 180;
      else if (text[i] === '.' || text[i] === ';') pause += 130;
      await this.wait(pause, signal);
    }
    if (opts.removeCaretAtEnd) render(false);
  }

  getSafeWorkspaceBox() {
    const r = this.root.getBoundingClientRect();
    const w = Math.max(760, r.width);
    const h = Math.max(480, r.height);
    return {
      left: 164,
      top: 18,
      width: Math.max(440, w - 252),
      height: Math.max(380, h - 92),
    };
  }

  createWindow(cfg) {
    const box = this.getSafeWorkspaceBox();
    const width = Math.min(cfg.width || 500, box.width - 10);
    const height = cfg.height ? Math.min(cfg.height, box.height - 10) : null;
    const x = Math.max(box.left, Math.min(cfg.x ?? box.left + 20, box.left + box.width - width));
    const y = Math.max(14, Math.min(cfg.y ?? box.top + 16, box.top + box.height - (height || 280)));

    const el = document.createElement('section');
    el.className = 'nx-win';
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${Math.round(width)}px`;
    if (height) el.style.height = `${Math.round(height)}px`;

    el.innerHTML = `
      <div class="nx-titlebar">
        ${cfg.miniaturizable !== false ? '<div class="nx-win-btn mini" data-nx-mini></div>' : '<span style="width:14px"></span>'}
        <div class="nx-win-title">${cfg.title}</div>
        ${cfg.closable !== false ? '<div class="nx-win-btn" data-nx-close>✕</div>' : '<span style="width:14px"></span>'}
      </div>
      <div class="nx-win-body">${cfg.content || ''}</div>
      ${cfg.resizable !== false ? '<div class="nx-resizebar"><div class="nx-resize-grip"></div><div class="nx-resize-grip right"></div></div>' : ''}
    `;

    this.windowsEl.appendChild(el);
    const win = {
      id: cfg.id || `nxw-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      appName: cfg.appName || 'Workspace',
      title: cfg.title,
      icon: cfg.icon || NEXT_ICONS.file,
      el,
      bodyEl: el.querySelector('.nx-win-body'),
      miniBtn: el.querySelector('[data-nx-mini]'),
      closeBtn: el.querySelector('[data-nx-close]'),
    };
    this.windows.set(win.id, win);
    this.focusWindow(win);
    return win;
  }

  focusWindow(win) {
    if (!win || !this.windows.has(win.id)) return;
    for (const w of this.windows.values()) {
      w.el.classList.toggle('inactive', w.id !== win.id);
    }
    this.zCounter += 1;
    win.el.style.zIndex = String(this.zCounter);
    this.setActiveApp(win.appName);
  }

  miniaturizeWindow(win) {
    if (!win || !this.windows.has(win.id)) return;
    win.el.style.display = 'none';
    const tile = document.createElement('div');
    tile.className = 'nx-miniwin';
    tile.innerHTML = `
      <div class="nx-miniwin-head">${win.title}</div>
      <div class="nx-miniwin-body">${win.icon}</div>
    `;
    this.miniTrayEl.appendChild(tile);
    this.miniWindows.set(win.id, { win, tile });
    this.sounds.click();
  }

  clearMiniWindows() {
    for (const { win, tile } of this.miniWindows.values()) {
      tile.remove();
      win.el.remove();
      this.windows.delete(win.id);
    }
    this.miniWindows.clear();
  }

  closeWindow(win) {
    if (!win) return;
    const mini = this.miniWindows.get(win.id);
    if (mini) {
      mini.tile.remove();
      this.miniWindows.delete(win.id);
    }
    win.el.remove();
    this.windows.delete(win.id);
    const remaining = [...this.windows.values()].filter((w) => w.el.style.display !== 'none');
    if (remaining.length > 0) {
      this.focusWindow(remaining[remaining.length - 1]);
    } else {
      this.setActiveApp('Workspace');
    }
  }

  clearWindows() {
    for (const w of [...this.windows.values()]) w.el.remove();
    this.windows.clear();
    for (const m of [...this.miniWindows.values()]) m.tile.remove();
    this.miniWindows.clear();
    this.setActiveApp('Workspace');
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.clockInterval);
    this.sounds.destroy();
    this.root.remove();
  }
}
