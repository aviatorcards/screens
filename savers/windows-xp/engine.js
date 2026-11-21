import { settlePointer, textApply, typeInto as typeHuman } from '../../js/human.js';
import { XP_ICONS } from './icons.js?v=12';
import { XpSounds } from './sounds.js?v=12';

export class XpAbortError extends Error {
  constructor() {
    super('Windows XP vignette aborted');
    this.name = 'XpAbortError';
  }
}

export const XP_THEMES = [
  { id: 'blue', label: 'Default (blue)', cls: '' },
  { id: 'olive', label: 'Olive Green', cls: 'theme-olive' },
  { id: 'silver', label: 'Silver', cls: 'theme-silver' },
];

export class XpEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});
    this.sounds = new XpSounds();
    this.sounds.setMuted(options.muted !== undefined ? options.muted : true);

    this.destroyed = false;
    this.abortFlag = false;
    this.windows = new Map();
    this.nextZ = 100;
    this.activeWinId = null;
    this.cursorX = 380;
    this.cursorY = 260;
    this.themeIndex = 0;
    this.recycleFull = false;

    this._timers = new Set();
    this._intervals = new Set();
    this._buildDOM();
    this._startClockAndNet();
  }

  _buildDOM() {
    this.container.innerHTML = '';
    const root = document.createElement('div');
    root.className = 'xp-root';
    root.innerHTML = `
      <div class="xp-bliss">
        <svg class="xp-bliss-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="xpSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2f6fbe"/>
              <stop offset="42%" stop-color="#4c94e0"/>
              <stop offset="70%" stop-color="#9ed0f6"/>
              <stop offset="100%" stop-color="#e7f5fd"/>
            </linearGradient>
            <linearGradient id="xpHaze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#e7f5fd" stop-opacity="0"/>
              <stop offset="100%" stop-color="#f7fbff" stop-opacity="0.85"/>
            </linearGradient>
            <linearGradient id="xpHillBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#7eae58"/>
              <stop offset="100%" stop-color="#5d8c3c"/>
            </linearGradient>
            <linearGradient id="xpHillFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#c6de6a"/>
              <stop offset="38%" stop-color="#7fbe3a"/>
              <stop offset="100%" stop-color="#3f7c1c"/>
            </linearGradient>
            <filter id="xpCloud" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="7"/>
            </filter>
          </defs>
          <rect width="1440" height="900" fill="url(#xpSky)"/>
          <g fill="#ffffff" filter="url(#xpCloud)">
            <g opacity="0.95">
              <circle cx="248" cy="188" r="52"/>
              <circle cx="312" cy="156" r="70"/>
              <circle cx="386" cy="182" r="56"/>
              <circle cx="292" cy="214" r="46"/>
              <circle cx="198" cy="204" r="34"/>
              <circle cx="360" cy="216" r="38"/>
            </g>
            <g opacity="0.82">
              <circle cx="690" cy="118" r="36"/>
              <circle cx="748" cy="100" r="48"/>
              <circle cx="808" cy="122" r="34"/>
              <circle cx="734" cy="146" r="28"/>
            </g>
            <g opacity="0.9">
              <circle cx="1108" cy="198" r="44"/>
              <circle cx="1184" cy="170" r="60"/>
              <circle cx="1262" cy="202" r="42"/>
              <circle cx="1152" cy="228" r="32"/>
            </g>
          </g>
          <rect x="0" y="430" width="1440" height="110" fill="url(#xpHaze)"/>
          <path d="M0 548 C200 492 420 528 640 506 C880 482 1100 524 1440 486 L1440 900 L0 900 Z" fill="url(#xpHillBack)"/>
          <path d="M0 648 C220 548 460 572 700 628 C960 688 1180 590 1440 640 L1440 900 L0 900 Z" fill="url(#xpHillFront)"/>
        </svg>
      </div>

      <div class="xp-desktop">
        <div class="xp-desk-icons">
          <div class="xp-icon" data-desk="my-documents">
            <div class="xp-icon-glyph">${XP_ICONS.myDocuments}</div>
            <div class="xp-icon-label">My Documents</div>
          </div>
          <div class="xp-icon" data-desk="my-computer">
            <div class="xp-icon-glyph">${XP_ICONS.myComputer}</div>
            <div class="xp-icon-label">My Computer</div>
          </div>
          <div class="xp-icon" data-desk="ie6">
            <div class="xp-icon-glyph">${XP_ICONS.ie6}</div>
            <div class="xp-icon-label">Internet Explorer</div>
          </div>
          <div class="xp-icon" data-desk="recycle">
            <div class="xp-icon-glyph" data-recycle-glyph>${XP_ICONS.recycleEmpty}</div>
            <div class="xp-icon-label">Recycle Bin</div>
          </div>
        </div>

        <div class="xp-windows"></div>
      </div>

      <footer class="xp-taskbar">
        <div class="xp-start-btn" data-start-btn>
          <span class="xp-start-flag">${XP_ICONS.xpFlag}</span>
          <span>start</span>
        </div>
        <div class="xp-quicklaunch">
          <span class="xp-ql-icon" title="Internet Explorer">${XP_ICONS.ie6}</span>
          <span class="xp-ql-icon" title="Winamp">${XP_ICONS.winamp}</span>
          <span class="xp-ql-icon" title="Paint">${XP_ICONS.paint}</span>
        </div>
        <div class="xp-tasks" data-xp-tasks></div>
        <div class="xp-tray">
          <span class="xp-tray-icon" title="Local Area Connection">${XP_ICONS.networkTray}</span>
          <span class="xp-tray-icon" title="AIM">${XP_ICONS.aim}</span>
          <span class="xp-tray-icon" title="Volume">${XP_ICONS.volumeTray}</span>
          <span class="xp-clock" data-clock>12:00 PM</span>
        </div>
      </footer>

      <div class="xp-cursor">${XP_ICONS.cursorArrow}</div>
    `;

    this.container.appendChild(root);
    this.root = root;
    this.desktopEl = root.querySelector('.xp-desktop');
    this.windowsEl = root.querySelector('.xp-windows');
    this.tasksEl = root.querySelector('[data-xp-tasks]');
    this.clockEl = root.querySelector('[data-clock]');
    this.cursorEl = root.querySelector('.xp-cursor');
    this.startMenuEl = null;
    this.balloonEl = null;
    this.overlayEl = null;

    this._setCursorPos(this.cursorX, this.cursorY);
  }

  _startClockAndNet() {
    const tickClock = () => {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      if (this.clockEl) this.clockEl.textContent = `${h}:${m} ${ampm}`;
    };
    const blinkNet = () => {
      if (this.destroyed || this.paused) return;
      const a = this.root.querySelector('.xp-net-led-a');
      const b = this.root.querySelector('.xp-net-led-b');
      if (a) a.setAttribute('fill', Math.random() < 0.45 ? '#4cf2ff' : '#1b5096');
      if (b) b.setAttribute('fill', Math.random() < 0.45 ? '#4cf2ff' : '#1b5096');
    };
    tickClock();
    this._intervals.add(setInterval(tickClock, 1000));
    this._intervals.add(setInterval(blinkNet, 650));
  }

  applyTheme(idx) {
    const t = XP_THEMES[idx % XP_THEMES.length];
    this.themeIndex = idx % XP_THEMES.length;
    this.root.classList.remove('theme-olive', 'theme-silver');
    if (t.cls) this.root.classList.add(t.cls);
  }

  setRecycleFull(full) {
    this.recycleFull = Boolean(full);
    const g = this.root.querySelector('[data-recycle-glyph]');
    if (g) g.innerHTML = this.recycleFull ? XP_ICONS.recycleFull : XP_ICONS.recycleEmpty;
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
    if (this.destroyed || this.abortFlag) throw new XpAbortError();
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
    if (kind === 'hand') this.cursorEl.innerHTML = XP_ICONS.cursorHand;
    else if (kind === 'ibeam') this.cursorEl.innerHTML = XP_ICONS.cursorIbeam;
    else this.cursorEl.innerHTML = XP_ICONS.cursorArrow;
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
    const dur = Math.max(150, Math.min(860, durationMs)) / this.speed;

    const cx1 = sx + dx * 0.34 + (Math.random() - 0.5) * 44;
    const cy1 = sy + dy * 0.25 + (Math.random() - 0.5) * 34;
    const cx2 = sx + dx * 0.72 + (Math.random() - 0.5) * 28;
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
    await settlePointer(sx, sy, tx, ty, {
      wait: (ms) => this.wait(ms),
      place: (px, py) => this._setCursorPos(px, py),
    });
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
      await this.wait(90);
      this.sounds.click();
      el.classList.add('pressed');
      await this.wait(100);
      el.classList.remove('pressed');
    }
  }

  async selectDeskIcon(key, { doubleClick = false } = {}) {
    this.root.querySelectorAll('.xp-icon.selected').forEach((n) => n.classList.remove('selected'));
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

  async dragElTo(sourceEl, targetEl, ghostHtml) {
    if (!sourceEl || !targetEl) return;
    await this.moveToEl(sourceEl);
    this.sounds.click();
    await this.wait(100);

    const ghost = document.createElement('div');
    ghost.className = 'xp-drag-ghost';
    ghost.innerHTML = ghostHtml;
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

  // ---------- Start Menu Choreography ----------
  closeStartMenu() {
    if (this.startMenuEl) {
      this.startMenuEl.remove();
      this.startMenuEl = null;
    }
    const btn = this.root.querySelector('[data-start-btn]');
    if (btn) btn.classList.remove('active');
  }

  async openStartAndPick(labelMatch) {
    this.closeStartMenu();
    const startBtn = this.root.querySelector('[data-start-btn]');
    await this.moveToEl(startBtn);
    this.sounds.click();
    startBtn.classList.add('active');

    const menu = document.createElement('div');
    menu.className = 'xp-start-menu';
    menu.innerHTML = `
      <div class="xp-sm-header">
        <div class="xp-sm-avatar">${XP_ICONS.userAvatar}</div>
        <div>Windows XP User</div>
      </div>
      <div class="xp-sm-cols">
        <div class="xp-sm-left">
          <div class="xp-sm-item bold"><span class="xp-sm-item-icon">${XP_ICONS.ie6}</span><span>Internet Explorer</span></div>
          <div class="xp-sm-item bold"><span class="xp-sm-item-icon">${XP_ICONS.aim}</span><span>AIM</span></div>
          <div class="xp-sm-sep"></div>
          <div class="xp-sm-item"><span class="xp-sm-item-icon">${XP_ICONS.winamp}</span><span>Winamp 2.91</span></div>
          <div class="xp-sm-item"><span class="xp-sm-item-icon">${XP_ICONS.pinball}</span><span>3D Pinball</span></div>
          <div class="xp-sm-item"><span class="xp-sm-item-icon">${XP_ICONS.paint}</span><span>Paint</span></div>
          <div class="xp-sm-item"><span class="xp-sm-item-icon">${XP_ICONS.notepad}</span><span>Notepad</span></div>
          <div class="xp-sm-sep"></div>
          <div class="xp-sm-item bold" style="margin-top:auto;justify-content:center;">All Programs ▸</div>
        </div>
        <div class="xp-sm-right">
          <div class="xp-sm-item bold"><span class="xp-sm-item-icon">${XP_ICONS.myDocuments}</span><span>My Documents</span></div>
          <div class="xp-sm-item bold"><span class="xp-sm-item-icon">${XP_ICONS.myComputer}</span><span>My Computer</span></div>
          <div class="xp-sm-sep"></div>
          <div class="xp-sm-item"><span class="xp-sm-item-icon">${XP_ICONS.displayProps}</span><span>Control Panel</span></div>
          <div class="xp-sm-item"><span class="xp-sm-item-icon">${XP_ICONS.infoBalloon}</span><span>Help and Support</span></div>
          <div class="xp-sm-item"><span class="xp-sm-item-icon">${XP_ICONS.infoBalloon}</span><span>Search</span></div>
          <div class="xp-sm-item"><span class="xp-sm-item-icon">${XP_ICONS.notepad}</span><span>Run…</span></div>
        </div>
      </div>
      <div class="xp-sm-footer">
        <span>🔑 Log Off</span>
        <span>⏻ Turn Off Computer</span>
      </div>
    `;
    this.root.appendChild(menu);
    this.startMenuEl = menu;
    await this.wait(320);

    const target = [...menu.querySelectorAll('.xp-sm-item')].find((el) =>
      el.textContent.toLowerCase().includes(labelMatch.toLowerCase()),
    );
    if (target) {
      await this.moveToEl(target, 320);
      target.classList.add('highlight');
      await this.wait(300);
      this.sounds.click();
    }
    this.closeStartMenu();
  }

  // ---------- Classic Yellow Tray Balloon ----------
  hideBalloon() {
    if (this.balloonEl) {
      this.balloonEl.remove();
      this.balloonEl = null;
    }
  }

  showBalloon(title, body, iconHtml = XP_ICONS.infoBalloon) {
    this.hideBalloon();
    this.sounds.xpBalloon();
    const b = document.createElement('div');
    b.className = 'xp-balloon';
    b.innerHTML = `
      <div class="xp-balloon-head">
        <span style="width:16px;height:16px;display:inline-flex;">${iconHtml}</span>
        <span>${title}</span>
        <span class="xp-balloon-close">×</span>
      </div>
      <div style="font-size:11px;line-height:1.38;color:#222;">${body}</div>
    `;
    this.root.appendChild(b);
    this.balloonEl = b;
    return b;
  }

  // ---------- Window Management ----------
  getStageSize() {
    const r = this.desktopEl.getBoundingClientRect();
    return { w: r.width || window.innerWidth, h: r.height || window.innerHeight - 30 };
  }

  createWindow({
    id,
    title,
    icon = XP_ICONS.myComputer,
    width = 540,
    height = 370,
    x,
    y,
    menus = [],
    bodyHtml = '',
    raw = false,
  }) {
    if (this.windows.has(id)) this.closeWindow(id);
    const { w, h } = this.getStageSize();
    const cw = Math.min(width, Math.max(260, w - 34));
    const ch = Math.min(height, Math.max(150, h - 28));
    const left = x !== undefined ? Math.min(x, w - cw - 12) : Math.max(20, Math.round((w - cw) / 2));
    const top = y !== undefined ? Math.min(y, h - ch - 12) : Math.max(14, Math.round((h - ch) / 2));

    const el = document.createElement('section');
    el.className = raw ? 'xp-raw-win' : 'xp-win';
    el.style.position = 'absolute';
    el.style.width = `${cw}px`;
    if (height) el.style.height = `${ch}px`;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    if (raw) {
      el.innerHTML = bodyHtml;
    } else {
      const mbar = menus.length
        ? `<div class="xp-menubar">${menus
            .map((m) => `<span class="xp-mitem" data-mbar="${m}">${m}</span>`)
            .join('')}</div>`
        : '';
      el.innerHTML = `
        <div class="xp-titlebar">
          <span class="xp-title-icon">${icon}</span>
          <span class="xp-title-text">${title}</span>
          <div class="xp-cap-btns">
            <div class="xp-cap">_</div>
            <div class="xp-cap">□</div>
            <div class="xp-cap close" data-close-win>×</div>
          </div>
        </div>
        ${mbar}
        <div class="xp-body">${bodyHtml}</div>
      `;
    }

    this.windowsEl.appendChild(el);
    const winObj = { id, title, icon, el, body: raw ? el : el.querySelector('.xp-body'), flashing: false };
    this.windows.set(id, winObj);
    this.focusWindow(id);
    return winObj;
  }

  focusWindow(id) {
    this.activeWinId = id;
    for (const [wid, w] of this.windows) {
      w.el.classList.toggle('active', wid === id);
      if (wid === id) {
        w.flashing = false;
        w.el.style.zIndex = String(++this.nextZ);
      }
    }
    this._renderTasks();
  }

  flashTask(id, on = true) {
    const w = this.windows.get(id);
    if (w) {
      w.flashing = on;
      this._renderTasks();
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
    this._renderTasks();
  }

  async clickCloseWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;
    const btn = win.el.querySelector('[data-close-win]');
    if (btn) await this.clickEl(btn);
    this.closeWindow(id);
  }

  closeAllWindows() {
    this.closeStartMenu();
    this.hideBalloon();
    for (const [, w] of this.windows) w.el.remove();
    this.windows.clear();
    this.activeWinId = null;
    this._renderTasks();
    this.root.querySelectorAll('.xp-icon.selected').forEach((n) => n.classList.remove('selected'));
    this.setCursorKind('arrow');
  }

  _renderTasks() {
    if (!this.tasksEl) return;
    this.tasksEl.innerHTML = '';
    for (const [wid, w] of this.windows) {
      const pill = document.createElement('div');
      pill.className = `xp-task-btn ${wid === this.activeWinId ? 'active' : ''} ${w.flashing ? 'flashing' : ''}`;
      pill.innerHTML = `<span class="xp-task-icon">${w.icon}</span><span>${w.title}</span>`;
      this.tasksEl.appendChild(pill);
    }
  }

  async typeText(targetEl, text, { charMs = 42, sound = true, allowTypo = true } = {}) {
    await typeHuman(text, { base: charMs, allowTypo: allowTypo && sound }, {
      check: () => this.checkAbort(),
      apply: textApply(targetEl),
      sound: (step) => {
        if (sound && (step.kind === 'backspace' || step.ch !== ' ')) this.sounds.key();
      },
      wait: (ms) => this.wait(ms),
    });
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
