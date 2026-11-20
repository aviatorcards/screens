import { iconSvg } from './icons.js';
import { SolarisSounds } from './sounds.js';

export class AbortSceneError extends Error {
  constructor() {
    super('Scene aborted');
    this.name = 'AbortSceneError';
  }
}

const HOME = '/export/home/user';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WORKSPACES = ['One', 'Two', 'Three', 'Four'];

const LEFT_CONTROLS = [
  { id: 'clock', tab: 'Links', label: 'Clock' },
  { id: 'calendar', tab: 'Cards', label: 'Calendar' },
  { id: 'files', tab: 'Files', label: 'File Manager', icon: 'folder' },
  { id: 'apps', tab: 'Applications', label: 'Text Note', icon: 'note' },
  { id: 'mail', tab: 'Mail', label: 'Mailer', icon: 'mail' },
  { id: 'lock', label: 'Lock', icon: 'lock' },
];

const RIGHT_CONTROLS = [
  { id: 'globe', label: 'Activity', icon: 'globe' },
  { id: 'exit', label: 'Exit', icon: 'door' },
  { id: 'print', tab: 'Personal Printers', label: 'Printer', icon: 'printer' },
  { id: 'style', tab: 'Tools', label: 'Style Manager', icon: 'style' },
  { id: 'meter', tab: 'Hosts', label: 'Performance Meter', icon: 'meter' },
  { id: 'help', tab: 'Help', label: 'Help', icon: 'help' },
  { id: 'trash', tab: 'Trash', label: 'Trash', icon: 'trash' },
];

const SUBPANELS = {
  apps: {
    title: 'Applications',
    items: ['Text Note', 'Text Editor', 'Voice Note', 'Applications'],
  },
};

const ROOT_MENU = [
  { title: true, label: 'Workspace Menu' },
  { label: 'Terminal' },
  { label: 'Applications', sub: true },
  { label: 'Cards', sub: true },
  { label: 'Files', sub: true },
  { label: 'Folders', sub: true },
  { label: 'Help', sub: true },
  { label: 'Hosts', sub: true },
  { label: 'Links', sub: true },
  { label: 'Mail', sub: true },
  { label: 'Tools', sub: true },
  { sep: true },
  { label: 'Windows' },
  { sep: true },
  { label: 'Add Item to Menu...' },
  { label: 'Customize Menu...' },
  { sep: true },
  { label: 'Lock Display' },
  { label: 'Log out...' },
];

const FILE_MENU = [
  { label: 'New' },
  { label: 'Open...' },
  { label: 'Save' },
  { label: 'Save As...' },
  { label: 'Close' },
];

const STYLE_CONTROLS = ['Color', 'Font', 'Backdrop', 'Keyboard', 'Mouse', 'Beep', 'Screen', 'Window', 'Startup'];

const CURSOR = `<svg viewBox="0 0 16 22" width="16" height="22" aria-hidden="true"><path d="M1 1 L1 17 L4.6 13.6 L8.2 21 L11 19.8 L7.4 12.6 L13.2 12.6 Z" fill="#111" stroke="#fff" stroke-width="1"/></svg>`;

export function solarisDate(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, ' ');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  let tz = 'UTC';
  try {
    tz = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
      .formatToParts(d)
      .find((part) => part.type === 'timeZoneName')?.value || tz;
  } catch {
    tz = 'UTC';
  }
  return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${dd} ${hh}:${mm}:${ss} ${tz} ${d.getFullYear()}`;
}

export class SolarisEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.onStatus = options.onStatus || (() => {});
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.destroyed = false;
    this.sounds = new SolarisSounds();
    this.sounds.setMuted(options.muted !== false);
    this.home = HOME;
    this.files = [];
    this.windows = [];
    this.workspace = 'One';
    this.cursor = { x: 280, y: 180 };

    this.root = document.createElement('div');
    this.root.className = 'sol';
    if (this.paused) this.root.classList.add('is-paused');

    this.desk = document.createElement('div');
    this.desk.className = 'sol-desk';
    this.windowsEl = document.createElement('div');
    this.windowsEl.className = 'sol-windows';
    this.desk.appendChild(this.windowsEl);

    this.panelWrap = document.createElement('div');
    this.panelWrap.className = 'sol-panel-wrap';
    this.panel = document.createElement('div');
    this.panel.className = 'sol-panel';
    this.panel.setAttribute('role', 'toolbar');
    this.panel.setAttribute('aria-label', 'Front Panel');
    for (const spec of LEFT_CONTROLS) this.panel.appendChild(this._slot(spec));
    this.panel.appendChild(this._switch());
    for (const spec of RIGHT_CONTROLS) this.panel.appendChild(this._slot(spec));
    this.panelWrap.appendChild(this.panel);

    this.menuLayer = document.createElement('div');
    this.menuLayer.className = 'sol-menus';

    this.logout = document.createElement('div');
    this.logout.className = 'sol-logout';
    const logoutCard = document.createElement('div');
    logoutCard.className = 'sol-dialog';
    const logoutTitle = document.createElement('div');
    logoutTitle.className = 'sol-dialog-title';
    logoutTitle.textContent = 'Log out';
    const logoutRow = document.createElement('div');
    logoutRow.className = 'sol-buttons';
    this.logoutOk = document.createElement('button');
    this.logoutOk.type = 'button';
    this.logoutOk.className = 'sol-push';
    this.logoutOk.textContent = 'OK';
    this.logoutCancel = document.createElement('button');
    this.logoutCancel.type = 'button';
    this.logoutCancel.className = 'sol-push';
    this.logoutCancel.textContent = 'Cancel';
    logoutRow.append(this.logoutOk, this.logoutCancel);
    logoutCard.append(logoutTitle, logoutRow);
    this.logout.appendChild(logoutCard);

    this.lock = document.createElement('div');
    this.lock.className = 'sol-lock';
    const lockCard = document.createElement('div');
    lockCard.className = 'sol-lock-card';
    const lockTitle = document.createElement('h2');
    lockTitle.textContent = 'Lock Display';
    this.lockField = document.createElement('input');
    this.lockField.className = 'sol-field';
    this.lockField.type = 'password';
    this.lockField.setAttribute('aria-label', 'Password');
    lockCard.append(lockTitle, this.lockField);
    this.lock.appendChild(lockCard);

    this.boot = document.createElement('div');
    this.boot.className = 'sol-boot on';
    const sun = document.createElement('div');
    sun.className = 'sol-sun';
    sun.setAttribute('aria-hidden', 'true');
    const word = document.createElement('p');
    word.className = 'sol-boot-word';
    word.textContent = 'Solaris 9';
    const track = document.createElement('div');
    track.className = 'sol-boot-track';
    this.bootBar = document.createElement('i');
    track.appendChild(this.bootBar);
    this.boot.append(sun, word, track);

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'sol-cursor';
    this.cursorEl.innerHTML = CURSOR;

    this.root.append(this.desk, this.panelWrap, this.menuLayer, this.logout, this.lock, this.boot, this.cursorEl);
    container.appendChild(this.root);

    this.globeEl = this.control('globe');
    this._tickClock();
    this.clockTimer = setInterval(() => this._tickClock(), 1000);
    this._onResize = () => this.layout();
    window.addEventListener('resize', this._onResize);
    this.layout();
    requestAnimationFrame(() => {
      if (!this.destroyed) this.layout();
    });
    this.cursor.x = Math.max(80, container.clientWidth * 0.46);
    this.cursor.y = Math.max(80, container.clientHeight * 0.38);
    this._renderCursor();
    this.stylesReady = Promise.resolve();
  }

  _slot(spec) {
    const slot = document.createElement('div');
    slot.className = 'sol-slot';
    if (!spec.tab) slot.classList.add('notab');
    if (spec.tab) {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'sol-tab';
      tab.dataset.tab = spec.id;
      tab.setAttribute('aria-label', spec.tab);
      slot.appendChild(tab);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sol-ctrl';
    btn.dataset.control = spec.id;
    btn.setAttribute('aria-label', spec.label);
    if (spec.id === 'clock') {
      btn.innerHTML = `<svg class="sol-clock" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="#f4f7fb" stroke="#1a3348" stroke-width="1.6"/><line class="sol-hour" x1="16" y1="16" x2="16" y2="9" stroke="#1a3348" stroke-width="1.8" stroke-linecap="round"/><line class="sol-minute" x1="16" y1="16" x2="16" y2="7" stroke="#1a3348" stroke-width="1.3" stroke-linecap="round"/><line class="sol-second" x1="16" y1="16" x2="16" y2="6" stroke="#8a3030" stroke-width="1" stroke-linecap="round"/></svg>`;
    } else if (spec.id === 'calendar') {
      btn.innerHTML = `<span class="sol-calicon" aria-hidden="true"><i class="sol-caltop"></i><b class="sol-day"></b></span>`;
    } else {
      btn.innerHTML = iconSvg(spec.icon);
    }
    slot.appendChild(btn);
    return slot;
  }

  _switch() {
    const box = document.createElement('div');
    box.className = 'sol-switch';
    box.setAttribute('aria-label', 'Workspaces');
    for (const name of WORKSPACES) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sol-ws';
      btn.dataset.ws = name;
      btn.textContent = name;
      btn.setAttribute('aria-label', name);
      btn.setAttribute('aria-pressed', name === 'One' ? 'true' : 'false');
      if (name === 'One') btn.classList.add('on');
      box.appendChild(btn);
    }
    return box;
  }

  _tickClock() {
    const now = new Date();
    const hourAngle = ((now.getHours() % 12) + now.getMinutes() / 60) * 30 - 90;
    const minuteAngle = now.getMinutes() * 6 - 90;
    const secondAngle = now.getSeconds() * 6 - 90;
    this._hand('.sol-hour', hourAngle, 7);
    this._hand('.sol-minute', minuteAngle, 9);
    this._hand('.sol-second', secondAngle, 10);
    const clock = this.control('clock');
    if (clock) {
      const label = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      clock.setAttribute('aria-label', label);
    }
    const day = this.panel.querySelector('.sol-day');
    if (day) day.textContent = String(now.getDate());
    const cal = this.control('calendar');
    if (cal) {
      const when = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      cal.setAttribute('aria-label', when);
    }
  }

  _hand(selector, angleDeg, length) {
    const line = this.panel.querySelector(selector);
    if (!line) return;
    const rad = (angleDeg * Math.PI) / 180;
    line.setAttribute('x2', (16 + Math.cos(rad) * length).toFixed(2));
    line.setAttribute('y2', (16 + Math.sin(rad) * length).toFixed(2));
  }

  layout() {
    const avail = (this.root.clientWidth || 0) - 8;
    this.panel.style.transform = 'none';
    const needed = this.panel.offsetWidth;
    const scale = needed > 0 && avail > 0 && needed > avail ? avail / needed : 1;
    this.panel.style.transform = scale < 0.999 ? `scale(${scale})` : '';
  }

  control(id) {
    return this.panel.querySelector(`[data-control="${id}"]`);
  }

  workspaceButton(name) {
    return this.panel.querySelector(`[data-ws="${name}"]`);
  }

  setSpeed(speed) {
    this.speed = speed || 1;
  }

  setPaused(paused) {
    this.paused = paused;
    this.root.classList.toggle('is-paused', paused);
  }

  setMuted(muted) {
    this.sounds.setMuted(muted);
  }

  setBusy(on) {
    this.globeEl?.classList.toggle('busy', Boolean(on));
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
    const dur = duration ?? Math.max(220, Math.min(860, 160 + dist * 0.8));
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arc = (Math.random() > 0.5 ? 1 : -1) * Math.min(32, dist * 0.1);
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
    this.cursor.x = x;
    this.cursor.y = y;
    this._renderCursor();
  }

  async moveToElement(el, rx = 0.5, ry = 0.5, duration, signal) {
    if (!el) throw new Error('Missing cursor target');
    const r = this._rect(el);
    await this.moveTo(r.x + r.w * rx, r.y + r.h * ry, duration, signal);
  }

  _ring() {
    const ring = document.createElement('div');
    ring.className = 'sol-ring';
    ring.style.left = `${this.cursor.x}px`;
    ring.style.top = `${this.cursor.y}px`;
    this.root.appendChild(ring);
    setTimeout(() => ring.remove(), 360);
  }

  async click(el = null, opts = {}, signal = null) {
    if (el) await this.moveToElement(el, opts.rx ?? 0.5, opts.ry ?? 0.5, opts.duration ?? null, signal);
    if (el?.classList?.contains('sol-item') || el?.classList?.contains('sol-menu-btn')) {
      el.parentElement?.querySelectorAll('.lit').forEach((node) => node.classList.remove('lit'));
      el.classList.add('lit');
    }
    this._ring();
    this.sounds.click();
    if (el && opts.pressClass) el.classList.add(opts.pressClass);
    try {
      await this.wait(90, signal);
    } finally {
      if (el && opts.pressClass) el.classList.remove(opts.pressClass);
    }
    await this.wait(opts.afterMs ?? 70, signal);
  }

  async typeText(el, text, signal) {
    for (const ch of text) {
      this._check(signal);
      const caret = el.querySelector?.('.sol-caret');
      const node = document.createTextNode(ch);
      if (caret) el.insertBefore(node, caret);
      else el.appendChild(node);
      const scroller = el.closest?.('.sol-term, .sol-doc') || el;
      if (scroller.scrollHeight) scroller.scrollTop = scroller.scrollHeight;
      this.sounds.key();
      await this.wait(ch === '\n' ? 64 : ch === ' ' ? 26 : 40, signal);
    }
  }

  async typeValue(input, text, signal) {
    for (const ch of text) {
      this._check(signal);
      input.value += ch;
      this.sounds.key();
      await this.wait(36, signal);
    }
  }

  async launch(signal) {
    this.setBusy(true);
    try {
      await this.wait(700, signal);
    } finally {
      if (!this.destroyed) this.setBusy(false);
    }
  }

  getSafeBox() {
    const w = this.desk.clientWidth || 1024;
    const h = this.desk.clientHeight || 640;
    const clearance = this.panelClearance();
    return {
      left: 16,
      top: 16,
      width: Math.max(300, w - 32),
      height: Math.max(200, h - clearance - 12),
    };
  }

  panelClearance() {
    const height = this.panelWrap?.offsetHeight || 96;
    return Math.max(88, height + 18);
  }

  windowScale() {
    const w = Math.max(640, this.desk.clientWidth || 640);
    const h = Math.max(480, this.desk.clientHeight || 480);
    const s = Math.min(w / 1280, h / 800);
    return Math.max(0.82, Math.min(1.15, s));
  }

  createWindow(cfg) {
    const box = this.getSafeBox();
    const scale = cfg.scale === false ? 1 : this.windowScale();
    const width = Math.min(Math.round((cfg.width || 460) * scale), box.width);
    const height = Math.min(Math.round((cfg.height || 300) * scale), box.height);
    const n = this.windows.filter((win) => win.workspace === this.workspace && !win.minimized).length;
    let x = cfg.x ?? box.left + (n % 4) * 28;
    let y = cfg.y ?? box.top + (n % 4) * 26;
    if (cfg.center) {
      x = Math.max(box.left, Math.round((this.desk.clientWidth - width) / 2));
      y = Math.max(box.top, Math.round(box.top + (box.height - height) / 2));
    }
    x = Math.max(8, Math.min(x, Math.max(8, this.desk.clientWidth - width - 8)));
    y = Math.max(8, Math.min(y, Math.max(8, this.desk.clientHeight - height - this.panelClearance())));

    const el = document.createElement('div');
    el.className = 'sol-win';
    if (cfg.dialog) el.classList.add('dialog');
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    const titleBar = document.createElement('div');
    titleBar.className = 'sol-title';
    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'sol-wbtn menu';
    menuBtn.setAttribute('aria-label', 'Window menu');
    const titleEl = document.createElement('span');
    titleEl.className = 'sol-title-text';
    titleEl.textContent = cfg.title || 'Window';
    titleBar.append(menuBtn, titleEl);
    let minBtn = null;
    let maxBtn = null;
    if (!cfg.dialog) {
      minBtn = document.createElement('button');
      minBtn.type = 'button';
      minBtn.className = 'sol-wbtn min';
      minBtn.setAttribute('aria-label', 'Minimize');
      maxBtn = document.createElement('button');
      maxBtn.type = 'button';
      maxBtn.className = 'sol-wbtn max';
      maxBtn.setAttribute('aria-label', 'Maximize');
      titleBar.append(minBtn, maxBtn);
    }

    const client = document.createElement('div');
    client.className = 'sol-client';
    let menuBar = null;
    if (cfg.menus?.length) {
      menuBar = document.createElement('div');
      menuBar.className = 'sol-menubar';
      for (const label of cfg.menus) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sol-menu-btn';
        btn.dataset.menu = label;
        btn.textContent = label;
        menuBar.appendChild(btn);
      }
      client.appendChild(menuBar);
    }
    const body = document.createElement('div');
    body.className = 'sol-body';
    if (cfg.node) body.appendChild(cfg.node);
    client.appendChild(body);
    el.append(titleBar, client);
    this.windowsEl.appendChild(el);

    const win = {
      el,
      titleBar,
      titleEl,
      menuBtn,
      minBtn,
      maxBtn,
      menuBar,
      body,
      dialog: Boolean(cfg.dialog),
      title: cfg.title || 'Window',
      workspace: cfg.workspace || this.workspace,
      minimized: false,
      maximized: false,
    };
    if (win.workspace !== this.workspace) el.style.display = 'none';
    this.windows.push(win);
    this.focusWindow(win);
    return win;
  }

  setTitle(win, title) {
    win.title = title;
    win.titleEl.textContent = title;
  }

  focusWindow(win) {
    if (!win || !this.windows.includes(win)) return;
    for (const other of this.windows) {
      other.el.classList.remove('active');
      other.el.style.zIndex = '2';
    }
    win.el.classList.add('active');
    win.el.style.zIndex = '3';
    this.windowsEl.appendChild(win.el);
  }

  closeWindow(win) {
    if (!win) return;
    win.el.remove();
    this.windows = this.windows.filter((item) => item !== win);
    const front = [...this.windows].reverse().find((item) => item.workspace === this.workspace && !item.minimized);
    if (front) this.focusWindow(front);
  }

  closeAllWindows() {
    for (const win of [...this.windows]) win.el.remove();
    this.windows = [];
  }

  _origin(el) {
    if (el.offsetWidth > 0 || el.offsetHeight > 0) {
      return { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
    }
    return {
      x: parseFloat(el.style.left) || 0,
      y: parseFloat(el.style.top) || 0,
      w: parseFloat(el.style.width) || 320,
      h: parseFloat(el.style.height) || 220,
    };
  }

  placePoint(win, ax, ay) {
    const deskW = this.desk.clientWidth || 1024;
    const deskH = this.desk.clientHeight || 640;
    const { w, h } = this._origin(win.el);
    const minX = 12;
    const minY = 12;
    const maxX = Math.max(minX, deskW - w - 12);
    const maxY = Math.max(minY, deskH - h - this.panelClearance());
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
    const handle = win.titleBar || win.el.querySelector('.sol-title');
    await this.moveToElement(handle, 0.42, 0.55, null, signal);
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

  setWorkspace(name) {
    if (!WORKSPACES.includes(name)) return;
    this.workspace = name;
    for (const btn of this.panel.querySelectorAll('.sol-ws')) {
      const on = btn.dataset.ws === name;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    for (const win of this.windows) {
      win.el.style.display = win.workspace === name && !win.minimized ? '' : 'none';
    }
    const front = [...this.windows].reverse().find((win) => win.workspace === name && !win.minimized);
    if (front) this.focusWindow(front);
  }

  _place(el, x, y) {
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    const w = el.offsetWidth || 160;
    const h = el.offsetHeight || 40;
    const maxX = Math.max(4, (this.root.clientWidth || 800) - w - 4);
    const maxY = Math.max(4, (this.root.clientHeight || 600) - h - 4);
    el.style.left = `${Math.round(Math.max(4, Math.min(x, maxX)))}px`;
    el.style.top = `${Math.round(Math.max(4, Math.min(y, maxY)))}px`;
  }

  showMenu(entries, x, y) {
    this.menuLayer.replaceChildren();
    const menu = document.createElement('div');
    menu.className = 'sol-menu';
    for (const entry of entries) {
      if (entry.sep) {
        const sep = document.createElement('div');
        sep.className = 'sol-sep';
        menu.appendChild(sep);
        continue;
      }
      if (entry.title) {
        const title = document.createElement('div');
        title.className = 'sol-menu-title';
        title.textContent = entry.label;
        menu.appendChild(title);
        continue;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sol-item';
      if (entry.sub) btn.classList.add('sub');
      btn.dataset.label = entry.label;
      const name = document.createElement('span');
      name.textContent = entry.label;
      btn.appendChild(name);
      if (entry.accel) {
        const accel = document.createElement('span');
        accel.className = 'sol-accel';
        accel.textContent = entry.accel;
        btn.appendChild(accel);
      }
      menu.appendChild(btn);
    }
    this.menuLayer.appendChild(menu);
    this._place(menu, x, y);
    this.sounds.menu();
    return menu;
  }

  menuItem(label) {
    return [...this.menuLayer.querySelectorAll('button.sol-item')].find((el) => el.dataset.label === label) || null;
  }

  async openRootMenu(signal) {
    const x = Math.round((this.root.clientWidth || 800) * 0.34);
    const y = Math.round((this.root.clientHeight || 600) * 0.22);
    await this.moveTo(x, y, null, signal);
    this._ring();
    this.sounds.click();
    await this.wait(80, signal);
    this.showMenu(ROOT_MENU, x, y + 8);
  }

  async chooseRoot(label, signal) {
    await this.openRootMenu(signal);
    const item = this.menuItem(label);
    if (!item) throw new Error(`Missing menu item ${label}`);
    await this.click(item, {}, signal);
    this.closePopups();
  }

  showSubpanel(id) {
    const spec = SUBPANELS[id];
    if (!spec) return null;
    this.menuLayer.replaceChildren();
    const panel = document.createElement('div');
    panel.className = 'sol-sub';
    const title = document.createElement('div');
    title.className = 'sol-sub-title';
    title.textContent = spec.title;
    panel.appendChild(title);
    for (const label of spec.items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sol-item';
      btn.dataset.label = label;
      btn.textContent = label;
      panel.appendChild(btn);
    }
    this.menuLayer.appendChild(panel);
    const tab = this.panel.querySelector(`[data-tab="${id}"]`);
    const r = tab ? this._rect(tab) : { x: 80, y: 80 };
    const height = panel.offsetHeight || 120;
    this._place(panel, r.x - 6, r.y - height - 6);
    this.sounds.menu();
    return panel;
  }

  async chooseSubpanel(id, label, signal) {
    const tab = this.panel.querySelector(`[data-tab="${id}"]`);
    await this.click(tab, {}, signal);
    this.showSubpanel(id);
    const item = this.menuItem(label);
    if (!item) throw new Error(`Missing subpanel item ${label}`);
    await this.click(item, {}, signal);
    this.closePopups();
  }

  async appMenu(win, menuLabel, itemLabel, signal) {
    const btn = [...(win.menuBar?.children || [])].find((el) => el.dataset.menu === menuLabel);
    if (!btn) throw new Error(`Missing menu ${menuLabel}`);
    await this.click(btn, {}, signal);
    btn.classList.add('lit');
    const entries = menuLabel === 'File' ? FILE_MENU : [];
    const r = this._rect(btn);
    this.showMenu(entries, r.x, r.bottom + 2);
    if (!itemLabel) return;
    const item = this.menuItem(itemLabel);
    if (!item) throw new Error(`Missing menu item ${itemLabel}`);
    await this.click(item, {}, signal);
    this.closePopups();
    btn.classList.remove('lit');
  }

  openFileManager() {
    const node = document.createElement('div');
    node.className = 'sol-files';
    const icons = document.createElement('div');
    icons.className = 'sol-icons';
    for (const name of this.files) {
      if (name.startsWith('.')) continue;
      const file = document.createElement('button');
      file.type = 'button';
      file.className = 'sol-ficon';
      file.dataset.file = name;
      const glyph = document.createElement('span');
      glyph.className = 'sol-glyph';
      glyph.innerHTML = iconSvg('doc');
      const label = document.createElement('span');
      label.textContent = name;
      file.append(glyph, label);
      icons.appendChild(file);
    }
    node.appendChild(icons);
    const win = this.createWindow({
      title: this.home,
      width: 480,
      height: 320,
      menus: ['File', 'Selected', 'View', 'Help'],
      node,
      app: 'dtfile',
    });
    win.iconsEl = icons;
    return win;
  }

  selectFile(el) {
    if (!el) return;
    el.parentElement?.querySelectorAll('.selected').forEach((node) => node.classList.remove('selected'));
    el.classList.add('selected');
  }

  openEditor() {
    const doc = document.createElement('div');
    doc.className = 'sol-doc';
    const caret = document.createElement('span');
    caret.className = 'sol-caret';
    doc.appendChild(caret);
    const win = this.createWindow({
      title: 'Text Editor',
      width: 520,
      height: 340,
      menus: ['File', 'Edit', 'Format', 'Options', 'Help'],
      node: doc,
      app: 'dtpad',
    });
    win.docEl = doc;
    return win;
  }

  openSaveAs(editor) {
    const node = document.createElement('div');
    node.className = 'sol-save';
    const field = document.createElement('input');
    field.className = 'sol-field';
    field.type = 'text';
    field.value = `${this.home}/notes.txt`;
    field.setAttribute('aria-label', 'Save As path');
    const row = document.createElement('div');
    row.className = 'sol-buttons';
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'sol-push';
    ok.textContent = 'OK';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'sol-push';
    cancel.textContent = 'Cancel';
    row.append(ok, cancel);
    node.append(field, row);
    const win = this.createWindow({
      title: 'Save As',
      width: 440,
      height: 148,
      dialog: true,
      center: true,
      node,
    });
    win.field = field;
    win.okBtn = ok;
    win.cancelBtn = cancel;
    win.editor = editor;
    return win;
  }

  confirmSave(dialog) {
    const base = (dialog.field?.value || '').split('/').pop() || 'notes.txt';
    if (base && !base.startsWith('.') && !this.files.includes(base)) this.files.push(base);
    if (dialog.editor) this.setTitle(dialog.editor, base);
    this.closeWindow(dialog);
  }

  openTerminal() {
    const term = document.createElement('div');
    term.className = 'sol-term';
    const win = this.createWindow({
      title: 'Terminal',
      width: 560,
      height: 320,
      node: term,
      app: 'dtterm',
    });
    win.termEl = term;
    this.termPrompt(win);
    return win;
  }

  termPrompt(win) {
    const line = document.createElement('div');
    line.className = 'sol-line';
    const prompt = document.createElement('span');
    prompt.className = 'sol-prompt';
    prompt.textContent = '$ ';
    const input = document.createElement('span');
    input.className = 'sol-input';
    const caret = document.createElement('span');
    caret.className = 'sol-caret';
    input.appendChild(caret);
    line.append(prompt, input);
    win.termEl.appendChild(line);
    win.inputEl = input;
    win.termEl.scrollTop = win.termEl.scrollHeight;
  }

  commitCommand(win, lines) {
    win.inputEl?.querySelector('.sol-caret')?.remove();
    for (const line of lines) {
      const row = document.createElement('div');
      row.className = 'sol-line out';
      row.textContent = line;
      win.termEl.appendChild(row);
    }
    this.termPrompt(win);
  }

  async runCommand(win, command, output, signal) {
    await this.click(win.termEl, { rx: 0.22, ry: 0.78 }, signal);
    await this.typeText(win.inputEl, command, signal);
    await this.wait(140, signal);
    this.commitCommand(win, output);
    await this.wait(200, signal);
  }

  openCalendar() {
    const now = new Date();
    const wrap = document.createElement('div');
    wrap.className = 'sol-cal';
    const head = document.createElement('div');
    head.className = 'sol-cal-head';
    head.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const grid = document.createElement('div');
    grid.className = 'sol-cal-grid';
    for (const label of DAYS) {
      const cell = document.createElement('span');
      cell.className = 'sol-cal-dow';
      cell.textContent = label;
      grid.appendChild(cell);
    }
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let i = 0; i < first.getDay(); i += 1) {
      const cell = document.createElement('span');
      cell.className = 'sol-cal-cell';
      grid.appendChild(cell);
    }
    for (let day = 1; day <= count; day += 1) {
      const cell = document.createElement('span');
      cell.className = 'sol-cal-cell';
      cell.textContent = String(day);
      if (day === now.getDate()) cell.classList.add('today');
      grid.appendChild(cell);
    }
    wrap.append(head, grid);
    return this.createWindow({
      title: 'Calendar',
      width: 360,
      height: 300,
      node: wrap,
      app: 'dtcm',
    });
  }

  openStyleManager() {
    const grid = document.createElement('div');
    grid.className = 'sol-style-grid';
    for (const name of STYLE_CONTROLS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sol-style';
      btn.dataset.style = name;
      const glyph = document.createElement('span');
      glyph.className = `sol-style-glyph ${name.toLowerCase()}`;
      const label = document.createElement('span');
      label.textContent = name;
      btn.append(glyph, label);
      grid.appendChild(btn);
    }
    return this.createWindow({
      title: 'Style Manager',
      width: 440,
      height: 320,
      node: grid,
      app: 'dtstyle',
    });
  }

  openTrash() {
    const node = document.createElement('div');
    node.className = 'sol-empty';
    return this.createWindow({
      title: 'Trash',
      width: 360,
      height: 240,
      node,
      app: 'trash',
    });
  }

  openMailer() {
    const node = document.createElement('div');
    node.className = 'sol-empty';
    return this.createWindow({
      title: 'Mailer',
      width: 460,
      height: 280,
      node,
      app: 'dtmail',
    });
  }

  openHelp() {
    const node = document.createElement('div');
    node.className = 'sol-empty';
    return this.createWindow({
      title: 'Help Viewer',
      width: 460,
      height: 300,
      node,
      app: 'dthelp',
    });
  }

  openPerformanceMeter() {
    const wrap = document.createElement('div');
    wrap.className = 'sol-perf';
    for (const name of ['cpu', 'disk']) {
      const row = document.createElement('div');
      row.className = 'sol-perf-row';
      const label = document.createElement('span');
      label.textContent = name;
      const strip = document.createElement('i');
      row.append(label, strip);
      wrap.appendChild(row);
    }
    return this.createWindow({
      title: 'Performance Meter',
      width: 300,
      height: 168,
      node: wrap,
      app: 'perfmeter',
    });
  }

  showLock() {
    this.lockField.value = '';
    this.lock.classList.add('on');
  }

  hideLock() {
    this.lock.classList.remove('on');
    this.lockField.value = '';
  }

  showLogout() {
    this.logout.classList.add('on');
    this.sounds.beep();
  }

  hideLogout() {
    this.logout.classList.remove('on');
  }

  showBoot() {
    this.boot.classList.add('on');
    this.bootBar.style.width = '0%';
  }

  setBootProgress(amount) {
    this.bootBar.style.width = `${Math.round(Math.max(0, Math.min(1, amount)) * 100)}%`;
  }

  hideBoot() {
    this.boot.classList.remove('on');
  }

  closePopups() {
    this.menuLayer.replaceChildren();
    this.root.querySelectorAll('.lit').forEach((el) => el.classList.remove('lit'));
    this.hideLogout();
    this.hideLock();
    this.setBusy(false);
    for (const win of [...this.windows]) {
      if (win.dialog) this.closeWindow(win);
    }
  }

  resetDesk() {
    this.closePopups();
    this.closeAllWindows();
    this.setWorkspace('One');
    this.setBusy(false);
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.clockTimer);
    window.removeEventListener('resize', this._onResize);
    this.root.remove();
  }
}
