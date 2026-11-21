import { caretApply, settlePointer, typeInto as typeHuman, valueApply } from '../../js/human.js';
import { GnomeSounds } from './sounds.js';
import { FOOT, iconSvg } from './icons.js';

export class AbortSceneError extends Error {
  constructor() {
    super('Scene aborted');
    this.name = 'AbortSceneError';
  }
}

const ACCESSORIES = [
  { label: 'Calculator', icon: 'calc' },
  { label: 'Text Editor', icon: 'text' },
  { label: 'Terminal', icon: 'terminal' },
];

const INTERNET = [{ label: 'Web Browser', icon: 'browser' }];

const APP_ITEMS = [
  { label: 'Accessories', icon: 'folder', submenu: ACCESSORIES },
  { label: 'Internet', icon: 'browser', submenu: INTERNET },
  { divider: true },
  { label: 'Home Folder', icon: 'home' },
];

const ACTION_ITEMS = [
  { label: 'Run Application', icon: 'run' },
  { label: 'Search for Files', icon: 'search' },
  { divider: true },
  { label: 'Lock Screen', icon: 'lock' },
  { label: 'Log Out', icon: 'logout' },
];

const FOOT_ITEMS = [...ACTION_ITEMS, { divider: true }, ...APP_ITEMS];

const DESKTOP_ICONS = [
  { id: 'home', label: 'Home', icon: 'home', x: 16, y: 12 },
  { id: 'start', label: 'Start Here', icon: 'start', x: 16, y: 112 },
  { id: 'trash', label: 'Trash', icon: 'trash', x: 16, y: 'end' },
];

const BOOT_GLYPHS = ['home', 'folder', 'terminal', 'browser', 'calc'];

const CURSOR = `<svg width="15" height="20" viewBox="0 0 15 20" aria-hidden="true">
  <path d="M1.2 1.2 L1.2 15.2 L4.6 11.8 L7.4 17.2 L9.5 16.2 L6.6 10.8 L11.6 10.6 Z" fill="#000" stroke="#fff" stroke-width="1"/>
</svg>`;

export class GnomeEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.onStatus = options.onStatus || (() => {});
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.destroyed = false;
    this.sounds = new GnomeSounds();
    this.sounds.setMuted(options.muted !== false);
    this.windows = [];
    this.z = 4;
    this.workspace = 1;
    this.cursor = { x: 220, y: 220 };

    this.root = document.createElement('div');
    this.root.className = 'gnome';

    this.desk = document.createElement('div');
    this.desk.className = 'gnome-desk';
    this.deskIcons = document.createElement('div');
    this.deskIcons.className = 'gnome-deskicons';
    this.windowsEl = document.createElement('div');
    this.windowsEl.className = 'gnome-windows';
    this.desk.append(this.deskIcons, this.windowsEl);

    this.top = document.createElement('div');
    this.top.className = 'gnome-panel gnome-panel-top';
    this.footBtn = this._panelButton('gnome-foot', 'GNOME Menu', FOOT);
    this.appsBtn = this._textButton('Applications');
    this.actionsBtn = this._textButton('Actions');
    this.homeLaunch = this._panelButton('gnome-launch', 'Home Folder', iconSvg('home'));
    this.termLaunch = this._panelButton('gnome-launch', 'Terminal', iconSvg('terminal'));
    const spacer = document.createElement('div');
    spacer.className = 'gnome-spacer';
    this.clockEl = document.createElement('div');
    this.clockEl.className = 'gnome-clock';
    this.volumeBtn = this._panelButton('gnome-volume', 'Volume', iconSvg('volume'));
    this.winListBtn = this._panelButton('gnome-winlist', 'Window list', iconSvg('windows'));
    this.top.append(this.footBtn, this.appsBtn, this.actionsBtn, this.homeLaunch, this.termLaunch, spacer, this.clockEl, this.volumeBtn, this.winListBtn);

    this.bottom = document.createElement('div');
    this.bottom.className = 'gnome-panel gnome-panel-bottom';
    this.showDeskBtn = this._panelButton('gnome-showdesk', 'Show Desktop', iconSvg('showdesk'));
    this.tasksEl = document.createElement('div');
    this.tasksEl.className = 'gnome-tasks';
    this.pagerEl = document.createElement('div');
    this.pagerEl.className = 'gnome-pager';
    for (let i = 1; i <= 4; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'gnome-ws';
      cell.dataset.ws = String(i);
      cell.setAttribute('aria-label', `Workspace ${i}`);
      this.pagerEl.appendChild(cell);
    }
    this.bottom.append(this.showDeskBtn, this.tasksEl, this.pagerEl);

    this.menuLayer = document.createElement('div');
    this.menuLayer.className = 'gnome-menus';

    this.calendar = document.createElement('div');
    this.calendar.className = 'gnome-calendar';

    this.lock = document.createElement('div');
    this.lock.className = 'gnome-lock';
    const lockCard = document.createElement('div');
    lockCard.className = 'gnome-lock-card';
    const lockTitle = document.createElement('h2');
    lockTitle.textContent = 'Lock Screen';
    this.lockField = document.createElement('input');
    this.lockField.className = 'gnome-entry';
    this.lockField.type = 'password';
    this.lockField.setAttribute('aria-label', 'Password');
    lockCard.append(lockTitle, this.lockField);
    this.lock.appendChild(lockCard);

    this.boot = document.createElement('div');
    this.boot.className = 'gnome-boot on';
    this.boot.style.cssText = 'display:flex;position:absolute;inset:0;z-index:70;background:#241f33;color:#f4f1ea;flex-direction:column;align-items:center;justify-content:center;gap:14px;';
    const mark = document.createElement('div');
    mark.className = 'gnome-boot-mark';
    mark.innerHTML = FOOT;
    const word = document.createElement('p');
    word.className = 'gnome-boot-word';
    word.textContent = 'GNOME';
    this.bootRow = document.createElement('div');
    this.bootRow.className = 'gnome-boot-row';
    BOOT_GLYPHS.forEach((name) => {
      const icon = document.createElement('div');
      icon.className = 'gnome-boot-icon';
      icon.innerHTML = iconSvg(name);
      this.bootRow.appendChild(icon);
    });
    const track = document.createElement('div');
    track.className = 'gnome-boot-track';
    this.bootBar = document.createElement('i');
    track.appendChild(this.bootBar);
    this.bootHint = document.createElement('p');
    this.bootHint.className = 'gnome-boot-hint';
    this.bootHint.textContent = 'Starting GNOME 2.4';
    this.boot.append(mark, word, this.bootRow, track, this.bootHint);

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'gnome-cursor';
    this.cursorEl.innerHTML = CURSOR;

    this.root.append(this.desk, this.top, this.bottom, this.menuLayer, this.calendar, this.lock, this.boot, this.cursorEl);
    container.appendChild(this.root);

    this._paintDesktopIcons();
    this.syncTasks();
    this.syncPager();
    this._tickClock();
    this.clockTimer = setInterval(() => this._tickClock(), 15000);
    this._onResize = () => this.layoutDesktop();
    window.addEventListener('resize', this._onResize);
    this.layoutDesktop();
    this.cursor.x = Math.max(80, container.clientWidth * 0.42);
    this.cursor.y = Math.max(80, container.clientHeight * 0.5);
    this._renderCursor();
    this.stylesReady = this._loadCss();
  }

  _panelButton(className, label, svg) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = svg;
    return btn;
  }

  _textButton(label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    return btn;
  }

  _paintDesktopIcons() {
    for (const spec of DESKTOP_ICONS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gnome-deskicon';
      btn.dataset.id = spec.id;
      btn.style.left = `${spec.x}px`;
      if (spec.y !== 'end') btn.style.top = `${spec.y}px`;
      const glyph = document.createElement('span');
      glyph.className = 'gnome-glyph';
      glyph.innerHTML = iconSvg(spec.icon);
      const label = document.createElement('span');
      label.className = 'gnome-label';
      label.textContent = spec.label;
      btn.append(glyph, label);
      this.deskIcons.appendChild(btn);
    }
  }

  layoutDesktop() {
    const trash = this.desktopIcon('trash');
    if (!trash) return;
    trash.style.top = `${Math.max(210, this.desk.clientHeight - 96)}px`;
  }

  desktopIcon(id) {
    return this.deskIcons.querySelector(`[data-id="${id}"]`);
  }

  _tickClock() {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'short' });
    let hrs = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    this.clockEl.textContent = `${day} ${hrs}:${mins} ${ampm}`;
  }

  _loadCss() {
    const id = 'gnome-css';
    const href = new URL('./gnome.css?v=4', import.meta.url).href;
    let link = document.getElementById(id);
    const ready = (node, wait) =>
      new Promise((resolve) => {
        if (!wait && node.sheet) {
          resolve();
          return;
        }
        node.addEventListener('load', () => resolve(), { once: true });
        node.addEventListener('error', () => resolve(), { once: true });
      });
    let wait = true;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    } else if (link.href !== href) {
      link.href = href;
    } else {
      wait = false;
    }
    return ready(link, wait).then(() => {
      if (this.destroyed) return;
      this.boot.style.cssText = '';
    });
  }

  setSpeed(speed) {
    this.speed = speed || 1;
  }

  setPaused(paused) {
    this.paused = paused;
  }

  setMuted(muted) {
    this.sounds.setMuted(muted);
  }

  _check(signal) {
    if (this.destroyed || signal?.aborted) throw new AbortSceneError();
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

  async animate(ms, fn, signal) {
    let elapsed = 0;
    let last = performance.now();
    while (elapsed < ms) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      this._check(signal);
      const now = performance.now();
      const dt = Math.min(50, now - last);
      last = now;
      if (!this.paused) elapsed += dt * this.speed;
      fn(Math.min(1, elapsed / ms));
    }
    fn(1);
  }

  setCursorVisible(on) {
    this.cursorEl.classList.toggle('on', on);
  }

  _renderCursor() {
    this.cursorEl.style.transform = `translate3d(${Math.round(this.cursor.x)}px, ${Math.round(this.cursor.y)}px, 0)`;
  }

  _rect(el) {
    const root = this.root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - root.left,
      y: r.top - root.top,
      w: r.width,
      h: r.height,
      right: r.right - root.left,
      bottom: r.bottom - root.top,
    };
  }

  async moveTo(x, y, duration, signal) {
    this._check(signal);
    const sx = this.cursor.x;
    const sy = this.cursor.y;
    const dx = x - sx;
    const dy = y - sy;
    const dist = Math.hypot(dx, dy);
    if (dist < 2) {
      this.cursor.x = x;
      this.cursor.y = y;
      this._renderCursor();
      return;
    }
    const dur = duration ?? Math.max(240, Math.min(880, 180 + dist * 0.85));
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arc = (Math.random() > 0.5 ? 1 : -1) * Math.min(36, dist * 0.12);
    const cx = sx + dx * 0.45 + perpX * arc;
    const cy = sy + dy * 0.45 + perpY * arc;
    await this.animate(
      dur,
      (t) => {
        const u = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const k = 1 - u;
        this.cursor.x = k * k * sx + 2 * k * u * cx + u * u * x;
        this.cursor.y = k * k * sy + 2 * k * u * cy + u * u * y;
        this._renderCursor();
      },
      signal,
    );
    await settlePointer(sx, sy, x, y, {
      signal,
      wait: (ms, sig) => this.wait(ms, sig),
      place: (px, py) => {
        this.cursor.x = px;
        this.cursor.y = py;
        this._renderCursor();
      },
    });
  }

  async moveToElement(el, rx = 0.5, ry = 0.5, duration, signal) {
    if (!el) throw new Error('Missing cursor target');
    const r = this._rect(el);
    await this.moveTo(r.x + r.w * rx, r.y + r.h * ry, duration, signal);
  }

  _ring() {
    const ring = document.createElement('div');
    ring.className = 'gnome-ring';
    ring.style.left = `${this.cursor.x}px`;
    ring.style.top = `${this.cursor.y}px`;
    this.root.appendChild(ring);
    setTimeout(() => ring.remove(), 360);
  }

  async click(el = null, opts = {}, signal = null) {
    if (el) await this.moveToElement(el, opts.rx ?? 0.5, opts.ry ?? 0.5, opts.duration ?? null, signal);
    this._ring();
    this.sounds.click();
    if (el && opts.pressClass) el.classList.add(opts.pressClass);
    try {
      await this.wait(90, signal);
    } finally {
      if (el && opts.pressClass) el.classList.remove(opts.pressClass);
    }
    await this.wait(opts.afterMs ?? 80, signal);
  }

  selectItem(el) {
    if (!el) return;
    const scope = el.closest('.gnome-deskicons, .gnome-igrid, .gnome-tree') || el.parentElement;
    scope?.querySelectorAll('.selected').forEach((node) => node.classList.remove('selected'));
    el.classList.add('selected');
  }

  async doubleClick(el, signal) {
    await this.moveToElement(el, 0.5, 0.35, null, signal);
    this.selectItem(el);
    this._ring();
    this.sounds.click();
    await this.wait(80, signal);
    this._ring();
    this.sounds.click();
    await this.wait(130, signal);
  }

  async typeText(el, text, signal) {
    await typeHuman(text, { base: 42 }, {
      check: () => this._check(signal),
      apply: caretApply(el, '.gnome-caret'),
      sound: () => this.sounds.key(),
      wait: (ms) => this.wait(ms, signal),
    });
  }

  async typeValue(input, text, signal) {
    await typeHuman(text, { base: 36 }, {
      check: () => this._check(signal),
      apply: valueApply(input),
      sound: () => this.sounds.key(),
      wait: (ms) => this.wait(ms, signal),
    });
  }

  getSafeBox() {
    const w = this.desk.clientWidth || 1024;
    const h = this.desk.clientHeight || 640;
    return { left: 108, top: 16, width: Math.max(340, w - 128), height: Math.max(240, h - 28) };
  }

  windowScale() {
    const w = Math.max(640, this.desk.clientWidth || 640);
    const h = Math.max(480, this.desk.clientHeight || 480);
    const s = Math.min(w / 1320, h / 820);
    return Math.max(1, Math.min(1.2, s));
  }

  createWindow(cfg) {
    const box = this.getSafeBox();
    const scale = cfg.scale === false ? 1 : this.windowScale();
    const width = Math.min(Math.round((cfg.width || 480) * scale), box.width);
    const height = Math.min(Math.round((cfg.height || 320) * scale), box.height);
    const n = this.windows.filter((w) => w.workspace === this.workspace && !w.minimized).length;
    let x = cfg.x ?? box.left + (n % 4) * 26;
    let y = cfg.y ?? box.top + (n % 4) * 28;
    if (cfg.center) {
      x = Math.max(8, Math.round((this.desk.clientWidth - width) / 2));
      y = Math.max(8, Math.round((this.desk.clientHeight - height) / 2));
    }
    x = Math.max(8, Math.min(x, Math.max(8, this.desk.clientWidth - width - 8)));
    y = Math.max(8, Math.min(y, Math.max(8, this.desk.clientHeight - height - 8)));

    const el = document.createElement('div');
    el.className = 'gnome-win';
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    const title = document.createElement('div');
    title.className = 'gnome-title';
    const titleIcon = document.createElement('span');
    titleIcon.className = 'gnome-title-icon';
    if (cfg.icon) titleIcon.innerHTML = iconSvg(cfg.icon);
    const titleEl = document.createElement('span');
    titleEl.className = 'gnome-title-text';
    titleEl.textContent = cfg.title || 'Window';
    const minBtn = document.createElement('button');
    minBtn.type = 'button';
    minBtn.className = 'gnome-box min';
    minBtn.setAttribute('aria-label', 'Minimize');
    const maxBtn = document.createElement('button');
    maxBtn.type = 'button';
    maxBtn.className = 'gnome-box max';
    maxBtn.setAttribute('aria-label', 'Maximize');
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'gnome-box close';
    closeBtn.setAttribute('aria-label', 'Close');
    title.append(titleIcon, titleEl, minBtn, maxBtn, closeBtn);

    const frame = document.createElement('div');
    frame.className = 'gnome-frame';
    let menuBar = null;
    if (cfg.menus?.length) {
      menuBar = document.createElement('div');
      menuBar.className = 'gnome-menubar';
      for (const menu of cfg.menus) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gnome-menu';
        btn.dataset.menu = menu.label;
        btn.textContent = menu.label;
        menuBar.appendChild(btn);
      }
      frame.appendChild(menuBar);
    }
    const body = document.createElement('div');
    body.className = 'gnome-body';
    if (cfg.node) body.appendChild(cfg.node);
    frame.appendChild(body);
    el.append(title, frame);
    this.windowsEl.appendChild(el);

    const win = {
      el,
      titleEl,
      body,
      closeBtn,
      minBtn,
      maxBtn,
      menuBar,
      menus: cfg.menus || [],
      app: cfg.app || cfg.title || 'Window',
      title: cfg.title || 'Window',
      workspace: cfg.workspace || this.workspace,
      minimized: false,
    };
    if (win.workspace !== this.workspace) el.style.display = 'none';
    this.windows.push(win);
    this.focusWindow(win);
    return win;
  }

  setTitle(win, title) {
    win.title = title;
    win.titleEl.textContent = title;
    this.syncTasks();
  }

  focusWindow(win) {
    if (!win || !this.windows.includes(win)) return;
    for (const other of this.windows) {
      if (other.workspace === win.workspace) other.el.classList.remove('active');
    }
    win.el.classList.add('active');
    this.z += 1;
    win.el.style.zIndex = String(this.z);
    this.windowsEl.appendChild(win.el);
    this.syncTasks();
    this.syncPager();
  }

  closeWindow(win) {
    if (!win) return;
    win.el.remove();
    this.windows = this.windows.filter((item) => item !== win);
    const front = [...this.windows].reverse().find((item) => item.workspace === this.workspace && !item.minimized);
    if (front) this.focusWindow(front);
    else {
      this.syncTasks();
      this.syncPager();
    }
  }

  closeAllWindows() {
    for (const win of [...this.windows]) win.el.remove();
    this.windows = [];
    this.syncTasks();
    this.syncPager();
  }

  minimize(win) {
    win.minimized = true;
    win.el.style.display = 'none';
    this.syncTasks();
    this.syncPager();
  }

  restore(win) {
    win.minimized = false;
    win.el.style.display = win.workspace === this.workspace ? '' : 'none';
    this.focusWindow(win);
  }

  showDesktop() {
    const visible = this.windows.some((win) => win.workspace === this.workspace && !win.minimized);
    for (const win of this.windows) {
      if (win.workspace !== this.workspace) continue;
      if (visible) this.minimize(win);
      else this.restore(win);
    }
  }

  _laidOut(el) {
    return el.offsetWidth > 0 || el.offsetHeight > 0;
  }

  _origin(el) {
    if (this._laidOut(el)) return { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
    return {
      x: parseFloat(el.style.left) || 0,
      y: parseFloat(el.style.top) || 0,
      w: parseFloat(el.style.width) || 320,
      h: parseFloat(el.style.height) || 240,
    };
  }

  /** ax/ay are 0..1 across the desk that is left after the window and the icon column. */
  placePoint(win, ax, ay) {
    const deskW = this.desk.clientWidth || 1024;
    const deskH = this.desk.clientHeight || 640;
    const { w, h } = this._origin(win.el);
    const minX = 108;
    const minY = 12;
    const maxX = Math.max(minX, deskW - w - 12);
    const maxY = Math.max(minY, deskH - h - 12);
    const u = Math.max(0, Math.min(1, ax));
    const v = Math.max(0, Math.min(1, ay));
    return {
      x: Math.round(minX + (maxX - minX) * u),
      y: Math.round(minY + (maxY - minY) * v),
    };
  }

  async placeWindow(win, ax, ay, ms, signal) {
    const spot = this.placePoint(win, ax, ay);
    await this.dragWindow(win, spot.x, spot.y, ms, signal);
  }

  async dragWindow(win, x, y, ms = 640, signal) {
    if (!win?.el?.isConnected) return;
    const handle = win.titleEl || win.el.querySelector('.gnome-title');
    await this.moveToElement(handle, 0.4, 0.55, null, signal);
    this.focusWindow(win);
    this._ring();
    this.sounds.click();
    const { x: sx, y: sy, w, h } = this._origin(win.el);
    const maxX = Math.max(8, (this.desk.clientWidth || 1024) - w - 8);
    const maxY = Math.max(8, (this.desk.clientHeight || 640) - h - 8);
    const tx = Math.max(8, Math.min(x, maxX));
    const ty = Math.max(8, Math.min(y, maxY));
    const cursorOffsetX = this.cursor.x - sx;
    const cursorOffsetY = this.cursor.y - sy;
    win.el.classList.add('dragging');
    try {
      await this.wait(70, signal);
      await this.animate(
        ms,
        (t) => {
          const u = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const nx = sx + (tx - sx) * u;
          const ny = sy + (ty - sy) * u;
          win.el.style.left = `${Math.round(nx)}px`;
          win.el.style.top = `${Math.round(ny)}px`;
          this.cursor.x = nx + cursorOffsetX;
          this.cursor.y = ny + cursorOffsetY;
          this._renderCursor();
        },
        signal,
      );
    } finally {
      win.el.classList.remove('dragging');
    }
  }

  syncTasks() {
    const front = [...this.windows].reverse().find((win) => win.workspace === this.workspace && !win.minimized);
    this.tasksEl.replaceChildren();
    for (const win of this.windows) {
      if (win.workspace !== this.workspace) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gnome-task';
      btn.textContent = win.title;
      btn.classList.toggle('on', win === front);
      btn.classList.toggle('min', win.minimized);
      this.tasksEl.appendChild(btn);
    }
  }

  syncPager() {
    this.pagerEl.querySelectorAll('.gnome-ws').forEach((cell) => {
      const n = Number(cell.dataset.ws);
      cell.classList.toggle('on', n === this.workspace);
      const busy = this.windows.some((win) => win.workspace === n && !win.minimized);
      cell.classList.toggle('busy', busy);
    });
  }

  workspaceButton(n) {
    return this.pagerEl.querySelector(`[data-ws="${n}"]`);
  }

  setWorkspace(n) {
    this.workspace = n;
    for (const win of this.windows) {
      win.el.style.display = win.workspace === n && !win.minimized ? '' : 'none';
    }
    this.syncPager();
    const front = [...this.windows].reverse().find((win) => win.workspace === n && !win.minimized);
    if (front) this.focusWindow(front);
    else this.syncTasks();
  }

  closePopups() {
    this.menuLayer.replaceChildren();
    this.appsBtn.classList.remove('lit');
    this.actionsBtn.classList.remove('lit');
    this.footBtn.classList.remove('lit');
    this.hideCalendar();
    this.hideLock();
  }

  _buildPop(items) {
    const pop = document.createElement('div');
    pop.className = 'gnome-pop';
    for (const item of items) {
      if (item.divider) {
        const sep = document.createElement('div');
        sep.className = 'gnome-sep';
        pop.appendChild(sep);
        continue;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gnome-mi';
      if (item.submenu) btn.classList.add('sub');
      btn.dataset.label = item.label;
      if (item.icon) {
        const ico = document.createElement('span');
        ico.className = 'mi-ico';
        ico.innerHTML = iconSvg(item.icon);
        btn.appendChild(ico);
      }
      const name = document.createElement('span');
      name.className = 'mi-label';
      name.textContent = item.label;
      btn.appendChild(name);
      if (item.submenu) btn._submenu = item.submenu;
      pop.appendChild(btn);
    }
    this.menuLayer.appendChild(pop);
    return pop;
  }

  _placePop(pop, anchor, mode) {
    const a = this._rect(anchor);
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    const rootW = this.root.clientWidth;
    const rootH = this.root.clientHeight;
    let left = a.x;
    let top = a.bottom;
    if (mode === 'side') {
      left = a.right - 4;
      top = a.y - 3;
      if (left + pw > rootW - 6) left = a.x - pw + 4;
    }
    if (left + pw > rootW - 6) left = Math.max(6, rootW - pw - 6);
    if (top + ph > rootH - 6) top = Math.max(6, rootH - ph - 6);
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    return pop;
  }

  _light(pop, label) {
    pop.querySelectorAll('.gnome-mi').forEach((el) => el.classList.toggle('lit', el.dataset.label === label));
  }

  async openMenu(anchor, items, path, signal) {
    await this.click(anchor, { pressClass: 'pressed' }, signal);
    anchor.classList.add('lit');
    let pop = this._placePop(this._buildPop(items), anchor, 'below');
    try {
      for (let i = 0; i < path.length; i++) {
        const label = path[i];
        const el = [...pop.querySelectorAll(':scope > .gnome-mi')].find((node) => node.dataset.label === label);
        if (!el) throw new Error(`Missing menu item: ${label}`);
        await this.moveToElement(el, 0.4, 0.5, null, signal);
        this._light(pop, label);
        await this.wait(150, signal);
        if (i < path.length - 1) {
          pop = this._placePop(this._buildPop(el._submenu || []), el, 'side');
          await this.wait(90, signal);
        }
      }
      this.sounds.menu();
      await this.wait(110, signal);
    } finally {
      anchor.classList.remove('lit');
      this.menuLayer.replaceChildren();
    }
  }

  openApplications(path, signal) {
    return this.openMenu(this.appsBtn, APP_ITEMS, path, signal);
  }

  openActions(path, signal) {
    return this.openMenu(this.actionsBtn, ACTION_ITEMS, path, signal);
  }

  openFoot(path, signal) {
    return this.openMenu(this.footBtn, FOOT_ITEMS, path, signal);
  }

  async openWindowMenu(win, menuLabel, itemLabel, signal) {
    this.focusWindow(win);
    const btn = win.menuBar?.querySelector(`[data-menu="${CSS.escape(menuLabel)}"]`);
    const menu = win.menus.find((item) => item.label === menuLabel);
    if (!btn || !menu) throw new Error(`Missing menu ${menuLabel}`);
    await this.openMenu(btn, menu.items, [itemLabel], signal);
  }

  async openWindowList(signal) {
    const items = this.windows
      .filter((win) => win.workspace === this.workspace)
      .map((win) => ({ label: win.title, icon: 'windows' }));
    const path = items.length ? [items[0].label] : ['No open windows'];
    if (!items.length) items.push({ label: 'No open windows' });
    await this.openMenu(this.winListBtn, items, path, signal);
  }

  showCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    this.calendar.replaceChildren();
    const title = document.createElement('div');
    title.className = 'gnome-cal-title';
    title.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const grid = document.createElement('div');
    grid.className = 'gnome-cal-grid';
    for (const label of ['S', 'M', 'T', 'W', 'T', 'F', 'S']) {
      const span = document.createElement('span');
      span.textContent = label;
      grid.appendChild(span);
    }
    for (let i = 0; i < first; i++) grid.appendChild(document.createElement('span'));
    for (let day = 1; day <= count; day++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(day);
      if (day === now.getDate()) btn.classList.add('is-today');
      grid.appendChild(btn);
    }
    this.calendar.append(title, grid);
    this.calendar.classList.add('on');
    const a = this._rect(this.clockEl);
    const w = this.calendar.offsetWidth || 196;
    this.calendar.style.left = `${Math.max(8, a.right - w)}px`;
    this.calendar.style.top = `${a.bottom + 4}px`;
  }

  hideCalendar() {
    this.calendar.classList.remove('on');
  }

  showLock() {
    this.lockField.value = '';
    this.lock.classList.add('on');
  }

  hideLock() {
    this.lock.classList.remove('on');
    if (this.lockField) this.lockField.value = '';
  }

  showBoot() {
    this.boot.querySelectorAll('.gnome-boot-icon').forEach((icon) => icon.classList.remove('lit'));
    if (this.bootBar) this.bootBar.style.width = '0%';
    this.boot.classList.add('on');
    this.setCursorVisible(false);
  }

  setBootIcon(index, on) {
    const icon = this.bootRow.children[index];
    if (icon) icon.classList.toggle('lit', on);
    if (this.bootBar) this.bootBar.style.width = `${Math.round(((index + 1) / this.bootRow.children.length) * 100)}%`;
  }

  hideBoot() {
    this.boot.classList.remove('on');
  }

  resetDesk() {
    this.closePopups();
    this.closeAllWindows();
    this.workspace = 1;
    this.syncPager();
    this.deskIcons.querySelectorAll('.selected').forEach((node) => node.classList.remove('selected'));
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.clockTimer);
    window.removeEventListener('resize', this._onResize);
    this.root.remove();
  }
}
