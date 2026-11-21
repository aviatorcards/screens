import { caretApply, settlePointer, typeInto as typeHuman, valueApply } from '../../js/human.js';
import { KdeSounds } from './sounds.js';
import { KMARK, iconSvg } from './icons.js';

export class AbortSceneError extends Error {
  constructor() {
    super('Scene aborted');
    this.name = 'AbortSceneError';
  }
}

const INTERNET = [{ label: 'Web Browser', icon: 'browser' }];
const UTILITIES = [
  { label: 'Text Editor', icon: 'text' },
  { label: 'Calculator', icon: 'calc' },
];

const K_MENU = [
  { label: 'Internet', icon: 'browser', submenu: INTERNET },
  { label: 'Utilities', icon: 'folder', submenu: UTILITIES },
  { divider: true },
  { label: 'Find Files', icon: 'find' },
  { label: 'Run Command…', icon: 'run' },
  { divider: true },
  { label: 'Lock Session', icon: 'lock' },
  { label: 'Logout', icon: 'logout' },
];

const CURSOR = `<svg width="17" height="22" viewBox="0 0 17 22" aria-hidden="true">
  <path d="M1 1 L1 16.2 L4.6 12.8 L7.6 20.2 L10.2 19 L7.2 11.6 L12.6 11.4 Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="miter"/>
</svg>`;

export class KdeEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.onStatus = options.onStatus || (() => {});
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.destroyed = false;
    this.sounds = new KdeSounds();
    this.sounds.setMuted(options.muted !== false);
    this.windows = [];
    this.z = 4;
    this.desktop = 1;
    this.cursor = { x: 240, y: 220 };

    this.root = document.createElement('div');
    this.root.className = 'kde';

    this.desk = document.createElement('div');
    this.desk.className = 'kde-desk';
    this.deskIcons = document.createElement('div');
    this.deskIcons.className = 'kde-deskicons';
    this.windowsEl = document.createElement('div');
    this.windowsEl.className = 'kde-windows';
    this.desk.append(this.deskIcons, this.windowsEl);

    this.kicker = document.createElement('div');
    this.kicker.className = 'kde-kicker';
    this.kBtn = document.createElement('button');
    this.kBtn.type = 'button';
    this.kBtn.className = 'kde-kbtn';
    this.kBtn.setAttribute('aria-label', 'K menu');
    this.kBtn.innerHTML = KMARK;
    this.tasksEl = document.createElement('div');
    this.tasksEl.className = 'kde-tasks';
    this.pagerEl = document.createElement('div');
    this.pagerEl.className = 'kde-pager';
    for (let i = 1; i <= 4; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'kde-deskbtn';
      cell.dataset.desk = String(i);
      cell.textContent = String(i);
      cell.setAttribute('aria-label', `Desktop ${i}`);
      this.pagerEl.appendChild(cell);
    }
    this.clockEl = document.createElement('div');
    this.clockEl.className = 'kde-clock';
    this.kicker.append(this.kBtn, this.tasksEl, this.pagerEl, this.clockEl);

    this.menuLayer = document.createElement('div');
    this.menuLayer.className = 'kde-menus';

    this.lock = document.createElement('div');
    this.lock.className = 'kde-lock';
    const card = document.createElement('div');
    card.className = 'kde-lock-card';
    const lockTitle = document.createElement('h2');
    lockTitle.textContent = 'Lock Session';
    this.lockField = document.createElement('input');
    this.lockField.className = 'kde-entry';
    this.lockField.type = 'password';
    this.lockField.setAttribute('aria-label', 'Password');
    card.append(lockTitle, this.lockField);
    this.lock.appendChild(card);

    this.boot = document.createElement('div');
    this.boot.className = 'kde-boot on';
    this.boot.style.cssText = 'display:flex;position:absolute;inset:0;z-index:70;background:#102848;color:#f4f8fb;flex-direction:column;align-items:center;justify-content:center;gap:16px;';
    const mark = document.createElement('div');
    mark.className = 'kde-boot-mark';
    mark.innerHTML = KMARK;
    const word = document.createElement('p');
    word.className = 'kde-boot-word';
    word.textContent = 'Starting KDE 3.1';
    const track = document.createElement('div');
    track.className = 'kde-boot-track';
    this.bootBar = document.createElement('i');
    track.appendChild(this.bootBar);
    this.boot.append(mark, word, track);

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'kde-cursor';
    this.cursorEl.innerHTML = CURSOR;

    this.root.append(this.desk, this.kicker, this.menuLayer, this.lock, this.boot, this.cursorEl);
    container.appendChild(this.root);

    this._paintDesktopIcons();
    this.syncTasks();
    this.syncPager();
    this._tickClock();
    this.clockTimer = setInterval(() => this._tickClock(), 15000);
    this._onResize = () => this.layoutDesktop();
    window.addEventListener('resize', this._onResize);
    this.layoutDesktop();
    this.cursor.x = Math.max(80, container.clientWidth * 0.48);
    this.cursor.y = Math.max(80, container.clientHeight * 0.46);
    this._renderCursor();
    this.stylesReady = this._loadCss();
  }

  _paintDesktopIcons() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kde-deskicon';
    btn.dataset.id = 'trash';
    btn.style.left = '18px';
    const glyph = document.createElement('span');
    glyph.className = 'kde-glyph';
    glyph.innerHTML = iconSvg('trash');
    const label = document.createElement('span');
    label.className = 'kde-label';
    label.textContent = 'Trash';
    btn.append(glyph, label);
    this.deskIcons.appendChild(btn);
  }

  layoutDesktop() {
    const trash = this.desktopIcon('trash');
    if (!trash) return;
    trash.style.top = `${Math.max(18, this.desk.clientHeight - 96)}px`;
  }

  desktopIcon(id) {
    return this.deskIcons.querySelector(`[data-id="${id}"]`);
  }

  _tickClock() {
    const now = new Date();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    let hrs = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    this.clockEl.textContent = `${month} ${now.getDate()}  ${hrs}:${mins} ${ampm}`;
  }

  _loadCss() {
    const id = 'kde-css';
    const href = new URL('./kde.css?v=5', import.meta.url).href;
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
    ring.className = 'kde-ring';
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
    const scope = el.closest('.kde-deskicons, .kde-view') || el.parentElement;
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
      apply: caretApply(el, '.kde-caret'),
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
    return { left: 100, top: 24, width: Math.max(340, w - 120), height: Math.max(240, h - 36) };
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
    const width = Math.min(Math.round((cfg.width || 520) * scale), box.width);
    const height = Math.min(Math.round((cfg.height || 360) * scale), box.height);
    const n = this.windows.filter((w) => w.desktop === this.desktop).length;
    let x = cfg.x ?? box.left + (n % 4) * 28;
    let y = cfg.y ?? box.top + (n % 4) * 26;
    if (cfg.center) {
      x = Math.max(8, Math.round((this.desk.clientWidth - width) / 2));
      y = Math.max(12, Math.round((this.desk.clientHeight - height) / 2));
    }
    x = Math.max(8, Math.min(x, Math.max(8, this.desk.clientWidth - width - 8)));
    y = Math.max(8, Math.min(y, Math.max(8, this.desk.clientHeight - height - 8)));

    const el = document.createElement('div');
    el.className = 'kde-win';
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    const title = document.createElement('div');
    title.className = 'kde-title';
    const titleIcon = document.createElement('span');
    titleIcon.className = 'kde-title-icon';
    if (cfg.icon) titleIcon.innerHTML = iconSvg(cfg.icon);
    const titleEl = document.createElement('span');
    titleEl.className = 'kde-title-text';
    titleEl.textContent = cfg.title || 'Window';
    const pills = document.createElement('div');
    pills.className = 'kde-pills';
    const minBtn = document.createElement('button');
    minBtn.type = 'button';
    minBtn.className = 'kde-deco min';
    minBtn.setAttribute('aria-label', 'Minimize');
    const maxBtn = document.createElement('button');
    maxBtn.type = 'button';
    maxBtn.className = 'kde-deco max';
    maxBtn.setAttribute('aria-label', 'Maximize');
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'kde-deco close';
    closeBtn.setAttribute('aria-label', 'Close');
    pills.append(minBtn, maxBtn, closeBtn);
    title.append(titleIcon, titleEl, pills);

    const frame = document.createElement('div');
    frame.className = 'kde-frame';
    let menuBar = null;
    if (cfg.menus?.length) {
      menuBar = document.createElement('div');
      menuBar.className = 'kde-menubar';
      for (const menu of cfg.menus) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'kde-menu';
        btn.dataset.menu = menu.label;
        btn.textContent = menu.label;
        menuBar.appendChild(btn);
      }
      frame.appendChild(menuBar);
    }
    const body = document.createElement('div');
    body.className = 'kde-body';
    if (cfg.node) body.appendChild(cfg.node);
    frame.appendChild(body);
    el.append(title, frame);
    this.windowsEl.appendChild(el);

    const win = {
      el,
      titleEl,
      body,
      closeBtn,
      menuBar,
      menus: cfg.menus || [],
      app: cfg.app || cfg.title || 'Window',
      title: cfg.title || 'Window',
      desktop: cfg.desktop || this.desktop,
    };
    if (win.desktop !== this.desktop) el.style.display = 'none';
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
      if (other.desktop === win.desktop) other.el.classList.remove('active');
    }
    win.el.classList.add('active');
    this.z += 1;
    win.el.style.zIndex = String(this.z);
    this.windowsEl.appendChild(win.el);
    this.syncTasks();
  }

  closeWindow(win) {
    if (!win) return;
    win.el.remove();
    this.windows = this.windows.filter((item) => item !== win);
    const front = [...this.windows].reverse().find((item) => item.desktop === this.desktop);
    if (front) this.focusWindow(front);
    else this.syncTasks();
  }

  closeAllWindows() {
    for (const win of [...this.windows]) win.el.remove();
    this.windows = [];
    this.syncTasks();
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

  /** ax/ay are 0..1 across the open desk, clear of the kicker. */
  placePoint(win, ax, ay) {
    const deskW = this.desk.clientWidth || 1024;
    const deskH = this.desk.clientHeight || 640;
    const { w, h } = this._origin(win.el);
    const minX = 20;
    const minY = 16;
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
    const handle = win.titleEl || win.el.querySelector('.kde-title');
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
    const front = [...this.windows].reverse().find((win) => win.desktop === this.desktop && win.el.style.display !== 'none');
    this.tasksEl.replaceChildren();
    for (const win of this.windows) {
      if (win.desktop !== this.desktop) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kde-task';
      btn.textContent = win.title;
      if (win === front) btn.classList.add('on');
      this.tasksEl.appendChild(btn);
    }
  }

  syncPager() {
    this.pagerEl.querySelectorAll('.kde-deskbtn').forEach((cell) => {
      cell.classList.toggle('on', Number(cell.dataset.desk) === this.desktop);
    });
  }

  desktopButton(n) {
    return this.pagerEl.querySelector(`[data-desk="${n}"]`);
  }

  setDesktop(n) {
    this.desktop = n;
    for (const win of this.windows) win.el.style.display = win.desktop === n ? '' : 'none';
    this.syncPager();
    const front = [...this.windows].reverse().find((win) => win.desktop === n);
    if (front) this.focusWindow(front);
    else this.syncTasks();
  }

  closePopups() {
    this.menuLayer.replaceChildren();
    this.kBtn.classList.remove('lit');
    this.hideLock();
  }

  _buildPop(items) {
    const pop = document.createElement('div');
    pop.className = 'kde-pop';
    for (const item of items) {
      if (item.divider) {
        const sep = document.createElement('div');
        sep.className = 'kde-sep';
        pop.appendChild(sep);
        continue;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kde-mi';
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
    let top = mode === 'above' ? a.y - ph - 4 : a.bottom;
    if (mode === 'side') {
      left = a.right - 4;
      top = a.y - 3;
      if (left + pw > rootW - 6) left = a.x - pw + 4;
    }
    if (left + pw > rootW - 6) left = Math.max(6, rootW - pw - 6);
    if (top < 6) top = 6;
    if (top + ph > rootH - 6) top = Math.max(6, rootH - ph - 6);
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    return pop;
  }

  _light(pop, label) {
    pop.querySelectorAll('.kde-mi').forEach((el) => el.classList.toggle('lit', el.dataset.label === label));
  }

  async openMenu(anchor, items, path, signal, mode = 'below') {
    await this.click(anchor, { pressClass: 'pressed' }, signal);
    anchor.classList.add('lit');
    let pop = this._placePop(this._buildPop(items), anchor, mode);
    try {
      for (let i = 0; i < path.length; i++) {
        const label = path[i];
        const el = [...pop.querySelectorAll(':scope > .kde-mi')].find((node) => node.dataset.label === label);
        if (!el) throw new Error(`Missing menu item: ${label}`);
        await this.moveToElement(el, 0.45, 0.5, null, signal);
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

  openKMenu(path, signal) {
    return this.openMenu(this.kBtn, K_MENU, path, signal, 'above');
  }

  async openWindowMenu(win, menuLabel, itemLabel, signal) {
    this.focusWindow(win);
    const btn = win.menuBar?.querySelector(`[data-menu="${CSS.escape(menuLabel)}"]`);
    const menu = win.menus.find((item) => item.label === menuLabel);
    if (!btn || !menu) throw new Error(`Missing menu ${menuLabel}`);
    await this.openMenu(btn, menu.items, [itemLabel], signal, 'below');
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
    if (this.bootBar) this.bootBar.style.width = '0%';
    this.boot.classList.add('on');
    this.setCursorVisible(false);
  }

  setBootProgress(amount) {
    if (this.bootBar) this.bootBar.style.width = `${Math.round(amount * 100)}%`;
  }

  hideBoot() {
    this.boot.classList.remove('on');
  }

  resetDesk() {
    this.closePopups();
    this.closeAllWindows();
    this.desktop = 1;
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
