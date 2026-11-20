import { WARP_ICONS } from './icons.js';
import { WarpSounds } from './sounds.js';

export class WarpAbortError extends Error {
  constructor() {
    super('Warp vignette aborted');
    this.name = 'WarpAbortError';
  }
}

export const WARP_SCHEMES = {
  default: {
    name: 'Warp 4 Default',
    desk: '#9db7c4',
    titleActive: '#235a9e',
    titleInactive: '#8c96a0',
    chrome: '#c8c8c8',
  },
  cobalt: {
    name: 'Merlin Cobalt',
    desk: '#6d8db0',
    titleActive: '#133a70',
    titleInactive: '#7a8a9e',
    chrome: '#c6ccd4',
  },
  meadow: {
    name: 'Spring Meadow',
    desk: '#88ac96',
    titleActive: '#226646',
    titleInactive: '#82948a',
    chrome: '#c8cec8',
  },
  sandstone: {
    name: 'Warm Sandstone',
    desk: '#baa894',
    titleActive: '#7a4424',
    titleInactive: '#9a8e82',
    chrome: '#d0c8be',
  },
};

export class WarpEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});
    this.sounds = new WarpSounds();
    this.sounds.setMuted(options.muted !== undefined ? options.muted : true);

    this.destroyed = false;
    this.abortFlag = false;
    this.windows = new Map();
    this.nextZ = 100;
    this.activeWinId = null;
    this.cursorX = 360;
    this.cursorY = 260;
    this.cpuLoadTarget = 14;
    this.cpuHistory = new Array(22).fill(10);
    this.currentScheme = 'default';

    this._timers = new Set();
    this._intervals = new Set();
    this._buildDOM();
    this._startClockAndCpu();
  }

  _buildDOM() {
    this.container.innerHTML = '';
    const root = document.createElement('div');
    root.className = 'warp-root';
    root.innerHTML = `
      <header class="warp-center">
        <div class="wc-btn wc-btn-warp" data-wc="warp">
          <span class="wc-btn-icon">${WARP_ICONS.warpLogo}</span>
          <span>Warp</span>
        </div>
        <div class="wc-btn" data-wc="lockup" title="Lockup">
          <span class="wc-btn-icon">${WARP_ICONS.lockup}</span>
        </div>
        <div class="wc-btn" data-wc="winlist" title="Window List">
          <span class="wc-btn-icon">${WARP_ICONS.windowList}</span>
        </div>
        <div class="wc-sep"></div>
        <div class="wc-tasks" data-wc-tasks></div>
        <div class="wc-sep"></div>
        <div class="wc-tray" data-wc-tray>
          <span class="wc-tray-label">Tray 1</span>
          <span class="wc-tray-icon" data-tray="cmd" title="OS/2 Window">${WARP_ICONS.cmdOs2}</span>
          <span class="wc-tray-icon" data-tray="editor" title="System Editor">${WARP_ICONS.editor}</span>
          <span class="wc-tray-icon" data-tray="web" title="IBM WebExplorer">${WARP_ICONS.webExplorer}</span>
          <span class="wc-tray-icon" data-tray="pulse" title="Pulse">${WARP_ICONS.pulse}</span>
        </div>
        <div class="wc-cpu-box" title="CPU Activity">
          <canvas class="wc-cpu-canvas" width="44" height="16"></canvas>
          <span class="wc-cpu-pct">12%</span>
        </div>
        <div class="wc-clock">
          <span class="wc-clock-time">12:00:00</span>
          <span class="wc-clock-date"></span>
        </div>
      </header>

      <div class="warp-desktop">
        <div class="warp-desk-icons">
          <div class="warp-icon" data-desk="os2-system">
            <div class="warp-icon-glyph">${WARP_ICONS.os2System}</div>
            <div class="warp-icon-label">OS/2 System</div>
          </div>
          <div class="warp-icon" data-desk="drives">
            <div class="warp-icon-glyph">${WARP_ICONS.drives}</div>
            <div class="warp-icon-label">Drives</div>
          </div>
          <div class="warp-icon" data-desk="templates">
            <div class="warp-icon-glyph">${WARP_ICONS.templates}</div>
            <div class="warp-icon-label">Templates</div>
          </div>
          <div class="warp-icon" data-desk="connections">
            <div class="warp-icon-glyph">${WARP_ICONS.connections}</div>
            <div class="warp-icon-label">Connections</div>
          </div>
          <div class="warp-icon" data-desk="assistance">
            <div class="warp-icon-glyph">${WARP_ICONS.assistance}</div>
            <div class="warp-icon-label">Assistance Center</div>
          </div>
          <div class="warp-icon" data-desk="voicetype">
            <div class="warp-icon-glyph">${WARP_ICONS.voiceType}</div>
            <div class="warp-icon-label">VoiceType</div>
          </div>
        </div>

        <div class="warp-desk-right">
          <div class="warp-icon" data-desk="min-viewer">
            <div class="warp-icon-glyph">${WARP_ICONS.minimizedViewer}</div>
            <div class="warp-icon-label">Minimized Window Viewer</div>
          </div>
          <div class="warp-icon" data-desk="shredder">
            <div class="warp-icon-glyph">${WARP_ICONS.shredder}</div>
            <div class="warp-icon-label">Shredder</div>
          </div>
        </div>

        <div class="warp-windows"></div>
      </div>

      <div class="warp-cursor">${WARP_ICONS.cursorArrow}</div>
    `;

    this.container.appendChild(root);
    this.root = root;
    this.desktopEl = root.querySelector('.warp-desktop');
    this.windowsEl = root.querySelector('.warp-windows');
    this.tasksEl = root.querySelector('[data-wc-tasks]');
    this.cursorEl = root.querySelector('.warp-cursor');
    this.cpuCanvas = root.querySelector('.wc-cpu-canvas');
    this.cpuPctEl = root.querySelector('.wc-cpu-pct');
    this.clockTimeEl = root.querySelector('.wc-clock-time');
    this.clockDateEl = root.querySelector('.wc-clock-date');
    this.popupMenuEl = null;
    this.bootEl = null;

    this._setCursorPos(this.cursorX, this.cursorY);
  }

  _startClockAndCpu() {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      if (this.clockTimeEl) this.clockTimeEl.textContent = `${hh}:${mm}:${ss}`;
      if (this.clockDateEl) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.clockDateEl.textContent = `${months[now.getMonth()]} ${now.getDate()}`;
      }
    };

    const drawCpu = () => {
      if (this.paused || this.destroyed) return;
      const jitter = (Math.random() - 0.45) * 14;
      const val = Math.max(4, Math.min(98, Math.round(this.cpuLoadTarget + jitter)));
      this.cpuHistory.push(val);
      if (this.cpuHistory.length > 22) this.cpuHistory.shift();
      if (this.cpuPctEl) this.cpuPctEl.textContent = `${val}%`;

      if (this.cpuCanvas) {
        const ctx = this.cpuCanvas.getContext('2d');
        ctx.fillStyle = '#09140e';
        ctx.fillRect(0, 0, 44, 16);
        this.cpuHistory.forEach((v, i) => {
          const h = Math.max(1, Math.round((v / 100) * 14));
          ctx.fillStyle = v > 72 ? '#ef4444' : v > 42 ? '#eab308' : '#2ee066';
          ctx.fillRect(i * 2, 16 - h, 1.5, h);
        });
      }
      // Natural decay toward idle
      this.cpuLoadTarget = this.cpuLoadTarget + (12 - this.cpuLoadTarget) * 0.14;
    };

    updateClock();
    drawCpu();
    const t1 = setInterval(updateClock, 1000);
    const t2 = setInterval(drawCpu, 420);
    this._intervals.add(t1);
    this._intervals.add(t2);
  }

  spikeCpu(target = 68) {
    this.cpuLoadTarget = Math.max(this.cpuLoadTarget, target);
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
    if (this.destroyed || this.abortFlag) throw new WarpAbortError();
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

  // ---------- Cursor Choreography ----------
  setCursorKind(kind = 'arrow') {
    if (!this.cursorEl) return;
    if (kind === 'wait') this.cursorEl.innerHTML = WARP_ICONS.cursorWait;
    else if (kind === 'ibeam') this.cursorEl.innerHTML = WARP_ICONS.cursorIbeam;
    else this.cursorEl.innerHTML = WARP_ICONS.cursorArrow;
  }

  _setCursorPos(x, y) {
    this.cursorX = x;
    this.cursorY = y;
    if (this.cursorEl) {
      this.cursorEl.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    }
  }

  async moveTo(tx, ty, durationMs = 560) {
    const sx = this.cursorX;
    const sy = this.cursorY;
    const dx = tx - sx;
    const dy = ty - sy;
    const dist = Math.hypot(dx, dy);
    const dur = Math.max(160, Math.min(900, durationMs || dist * 1.1)) / this.speed;

    // Gentle cubic Bezier arc
    const cx1 = sx + dx * 0.35 + (Math.random() - 0.5) * 44;
    const cy1 = sy + dy * 0.25 + (Math.random() - 0.5) * 34;
    const cx2 = sx + dx * 0.72 + (Math.random() - 0.5) * 28;
    const cy2 = sy + dy * 0.85 + (Math.random() - 0.5) * 24;

    const steps = Math.max(10, Math.round(dur / 16));
    for (let i = 1; i <= steps; i++) {
      this.checkAbort();
      while (this.paused) {
        await this.wait(40);
      }
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

  async moveToEl(el, durationMs = 520) {
    if (!el) return;
    const { x, y } = this.getElCenter(el);
    await this.moveTo(x, y, durationMs);
  }

  async clickEl(el, { doubleClick = false } = {}) {
    if (!el) return;
    await this.moveToEl(el);
    this.sounds.click();
    el.classList.add('pressed');
    await this.wait(110);
    el.classList.remove('pressed');
    if (doubleClick) {
      await this.wait(90);
      this.sounds.click();
      el.classList.add('pressed');
      await this.wait(110);
      el.classList.remove('pressed');
    }
  }

  async selectDeskIcon(key, { doubleClick = false } = {}) {
    const all = this.root.querySelectorAll('.warp-desk-icons .warp-icon, .warp-desk-right .warp-icon');
    all.forEach((n) => n.classList.remove('selected'));
    const el = this.root.querySelector(`[data-desk="${key}"]`);
    if (!el) return null;
    await this.moveToEl(el);
    this.sounds.click();
    el.classList.add('selected');
    if (doubleClick) {
      await this.wait(110);
      this.sounds.click();
      this.spikeCpu(52);
    }
    return el;
  }

  async dragElTo(sourceEl, targetEl, ghostHtml) {
    if (!sourceEl || !targetEl) return;
    await this.moveToEl(sourceEl);
    this.sounds.click();
    await this.wait(120);

    const ghost = document.createElement('div');
    ghost.className = 'warp-drag-ghost';
    ghost.innerHTML = ghostHtml;
    document.body.appendChild(ghost);

    const start = this.getElCenter(sourceEl);
    const end = this.getElCenter(targetEl);
    const steps = 28;
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
        await new Promise((r) => setTimeout(r, Math.max(10, 22 / this.speed)));
      }
      await this.wait(140);
    } finally {
      targetEl.classList.remove('drop-target');
      ghost.remove();
    }
  }

  // ---------- Popup Menus (WarpCenter & WPS Right-Click) ----------
  closePopupMenu() {
    if (this.popupMenuEl) {
      this.popupMenuEl.remove();
      this.popupMenuEl = null;
    }
    const warpBtn = this.root.querySelector('[data-wc="warp"]');
    if (warpBtn) warpBtn.classList.remove('active');
  }

  showPopupMenu(x, y, items) {
    this.closePopupMenu();
    const menu = document.createElement('div');
    menu.className = 'warp-menu-popup';
    menu.style.left = `${Math.round(x)}px`;
    menu.style.top = `${Math.round(y)}px`;

    menu.innerHTML = items
      .map((item, idx) => {
        if (item.sep) return `<div class="warp-menu-sep"></div>`;
        return `<div class="warp-menu-item" data-menu-idx="${idx}">
          ${item.icon ? `<span class="warp-menu-item-icon">${item.icon}</span>` : ''}
          <span>${item.label}</span>
          ${item.sub ? `<span class="warp-menu-arrow">▸</span>` : ''}
        </div>`;
      })
      .join('');

    this.root.appendChild(menu);
    this.popupMenuEl = menu;
    return menu;
  }

  async openWarpMenuAndPick(labelMatch) {
    const warpBtn = this.root.querySelector('[data-wc="warp"]');
    await this.moveToEl(warpBtn);
    this.sounds.click();
    warpBtn.classList.add('active');

    const items = [
      { label: 'OS/2 System', icon: WARP_ICONS.os2System, sub: true },
      { label: 'Programs', icon: WARP_ICONS.folder, sub: true },
      { label: 'Command Prompts', icon: WARP_ICONS.cmdOs2, sub: true },
      { label: 'Connections', icon: WARP_ICONS.connections, sub: true },
      { label: 'Assistance Center', icon: WARP_ICONS.assistance },
      { sep: true },
      { label: 'Find Objects...', icon: WARP_ICONS.drives },
      { label: 'Shut Down...', icon: WARP_ICONS.lockup },
    ];
    const menu = this.showPopupMenu(6, 32, items);
    await this.wait(280);

    const target = [...menu.querySelectorAll('.warp-menu-item')].find((el) =>
      el.textContent.toLowerCase().includes(labelMatch.toLowerCase()),
    );
    if (target) {
      await this.moveToEl(target, 320);
      target.classList.add('highlight');
      await this.wait(300);
      this.sounds.click();
    }
    this.closePopupMenu();
  }

  // ---------- Window Management ----------
  getStageSize() {
    const r = this.desktopEl.getBoundingClientRect();
    return { w: r.width || window.innerWidth, h: r.height || window.innerHeight - 31 };
  }

  createWindow({
    id,
    title,
    icon = WARP_ICONS.folder,
    width = 520,
    height = 360,
    x,
    y,
    menus = [],
    bodyHtml = '',
    statusLeft = '',
    statusRight = '',
  }) {
    if (this.windows.has(id)) {
      this.closeWindow(id);
    }
    const { w, h } = this.getStageSize();
    const clampedW = Math.min(width, Math.max(280, w - 40));
    const clampedH = Math.min(height, Math.max(180, h - 36));
    const left = x !== undefined ? Math.min(x, w - clampedW - 14) : Math.max(20, Math.round((w - clampedW) / 2));
    const top = y !== undefined ? Math.min(y, h - clampedH - 14) : Math.max(16, Math.round((h - clampedH) / 2));

    const el = document.createElement('section');
    el.className = 'warp-win';
    el.dataset.winId = id;
    el.style.width = `${clampedW}px`;
    el.style.height = `${clampedH}px`;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    const menuBarHtml = menus.length
      ? `<div class="warp-menubar">${menus
          .map((m) => `<span class="warp-mbar-item" data-mbar="${m}"><u>${m[0]}</u>${m.slice(1)}</span>`)
          .join('')}</div>`
      : '';

    const statusBarHtml =
      statusLeft || statusRight
        ? `<div class="warp-statusbar"><span data-status-left>${statusLeft}</span><span data-status-right>${statusRight}</span></div>`
        : '';

    el.innerHTML = `
      <div class="warp-win-frame">
        <div class="warp-titlebar">
          <div class="warp-sysbtn">${icon}</div>
          <div class="warp-title-text">${title}</div>
          <div class="warp-win-btns">
            <div class="warp-wbtn warp-wbtn-hide" title="Hide"></div>
            <div class="warp-wbtn warp-wbtn-max" title="Maximize"></div>
            <div class="warp-wbtn warp-wbtn-close" data-close-win title="Close">×</div>
          </div>
        </div>
        ${menuBarHtml}
        <div class="warp-body">${bodyHtml}</div>
        ${statusBarHtml}
      </div>
    `;

    this.windowsEl.appendChild(el);
    const winObj = { id, title, icon, el, body: el.querySelector('.warp-body') };
    this.windows.set(id, winObj);
    this.focusWindow(id);
    this.sounds.windowOpen();
    this.spikeCpu(44);
    return winObj;
  }

  focusWindow(id) {
    this.activeWinId = id;
    for (const [wid, w] of this.windows) {
      w.el.classList.toggle('active', wid === id);
      if (wid === id) {
        w.el.style.zIndex = String(++this.nextZ);
      }
    }
    this._renderWarpCenterTasks();
  }

  closeWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;
    win.el.remove();
    this.windows.delete(id);
    if (this.activeWinId === id) {
      const remaining = [...this.windows.keys()];
      this.activeWinId = remaining.length ? remaining[remaining.length - 1] : null;
      if (this.activeWinId) this.focusWindow(this.activeWinId);
    }
    this._renderWarpCenterTasks();
  }

  async clickCloseWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;
    const btn = win.el.querySelector('[data-close-win]');
    if (btn) await this.clickEl(btn);
    this.closeWindow(id);
  }

  closeAllWindows() {
    this.closePopupMenu();
    for (const [, w] of this.windows) {
      w.el.remove();
    }
    this.windows.clear();
    this.activeWinId = null;
    this._renderWarpCenterTasks();
    this.root.querySelectorAll('.warp-icon.selected').forEach((n) => n.classList.remove('selected'));
  }

  _renderWarpCenterTasks() {
    if (!this.tasksEl) return;
    this.tasksEl.innerHTML = '';
    for (const [wid, w] of this.windows) {
      const pill = document.createElement('div');
      pill.className = `wc-task-pill ${wid === this.activeWinId ? 'active' : ''}`;
      pill.innerHTML = `<span class="wc-task-icon">${w.icon}</span><span>${w.title}</span>`;
      this.tasksEl.appendChild(pill);
    }
  }

  applyScheme(schemeKey) {
    const s = WARP_SCHEMES[schemeKey] || WARP_SCHEMES.default;
    this.currentScheme = schemeKey;
    this.root.style.setProperty('--warp-desk', s.desk);
    this.root.style.setProperty('--warp-title-active', s.titleActive);
    this.root.style.setProperty('--warp-title-inactive', s.titleInactive);
    this.root.style.setProperty('--warp-chrome', s.chrome);
  }

  async typeText(targetEl, text, { charMs = 46, sound = true } = {}) {
    for (let i = 0; i < text.length; i++) {
      this.checkAbort();
      targetEl.textContent += text[i];
      if (sound && text[i] !== ' ') this.sounds.key();
      const jitter = Math.random() * 26;
      await this.wait(charMs + jitter);
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
    if (this.bootEl) this.bootEl.remove();
    this.container.innerHTML = '';
  }
}
