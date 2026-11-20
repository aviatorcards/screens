import { BeOSSounds } from './sounds.js';
import { BOOT_ICONS, DESKTOP_ICONS, LOGO, iconSvg } from './icons.js';

export class AbortSceneError extends Error {
  constructor() {
    super('Scene aborted');
    this.name = 'AbortSceneError';
  }
}

const BE_MENU = [
  { label: 'About BeOS…' },
  { divider: true },
  { label: 'Find…' },
  { divider: true },
  {
    label: 'Applications',
    submenu: [
      { label: 'StyledEdit' },
      { label: 'Terminal' },
      { label: 'NetPositive' },
      { label: 'MediaPlayer' },
      { label: 'ShowImage' },
    ],
  },
  {
    label: 'Preferences',
    submenu: [{ label: 'Backgrounds' }, { label: 'Screen' }],
  },
  { divider: true },
  { label: 'Restart' },
  { label: 'Shut down' },
];

const CURSOR = `<svg width="15" height="20" viewBox="0 0 15 20" aria-hidden="true">
  <path d="M1.2 1.2 L1.2 15.2 L4.6 11.8 L7.4 17.2 L9.5 16.2 L6.6 10.8 L11.6 10.6 Z" fill="#000" stroke="#fff" stroke-width="1"/>
</svg>`;

export class BeOSEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.onStatus = options.onStatus || (() => {});
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.destroyed = false;
    this.sounds = new BeOSSounds();
    this.sounds.setMuted(options.muted !== false);
    this.windows = [];
    this.z = 4;
    this.workspace = 1;
    this.workspaceBackgrounds = {
      1: 'linear-gradient(160deg, #3e7ea8 0%, #24577a 100%)',
      2: 'linear-gradient(165deg, #3d8f78 0%, #1d5c50 100%)',
      3: 'linear-gradient(165deg, #6a5a98 0%, #322850 100%)',
      4: 'linear-gradient(165deg, #a07848 0%, #5c3e24 100%)',
    };
    this.cursor = { x: 200, y: 200 };

    this.root = document.createElement('div');
    this.root.className = 'beos';
    this.root.style.background = '#000';

    this.desk = document.createElement('div');
    this.desk.className = 'beos-desk';
    this.deskIcons = document.createElement('div');
    this.deskIcons.className = 'beos-deskicons';
    this.windowsEl = document.createElement('div');
    this.windowsEl.className = 'beos-windows';
    this.desk.append(this.deskIcons, this.windowsEl);

    this.deskbar = document.createElement('div');
    this.deskbar.className = 'beos-deskbar';
    this.beBtn = document.createElement('button');
    this.beBtn.type = 'button';
    this.beBtn.className = 'beos-bebtn';
    this.beBtn.innerHTML = LOGO;
    this.beBtn.setAttribute('aria-label', 'Be menu');
    this.appsEl = document.createElement('div');
    this.appsEl.className = 'beos-apps';
    this.tray = document.createElement('div');
    this.tray.className = 'beos-tray';
    this.wsEl = document.createElement('div');
    this.wsEl.className = 'beos-workspaces';
    for (let i = 1; i <= 4; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'beos-ws';
      cell.dataset.ws = String(i);
      cell.setAttribute('aria-label', `Workspace ${i}`);
      this.wsEl.appendChild(cell);
    }
    this.clockEl = document.createElement('div');
    this.clockEl.className = 'beos-clock';
    this.tray.append(this.wsEl, this.clockEl);
    this.deskbar.append(this.beBtn, this.appsEl, this.tray);

    this.menuLayer = document.createElement('div');
    this.menuLayer.className = 'beos-menus';

    this.boot = document.createElement('div');
    this.boot.className = 'beos-boot on';
    this.boot.style.cssText = 'display:flex;position:absolute;inset:0;background:#000;z-index:30;';
    const mark = document.createElement('div');
    mark.className = 'mark';
    mark.innerHTML = LOGO;
    const word = document.createElement('p');
    word.className = 'beos-boot-word';
    word.textContent = 'BeOS';
    this.bootRow = document.createElement('div');
    this.bootRow.className = 'beos-boot-row';
    BOOT_ICONS.forEach((svg) => {
      const icon = document.createElement('div');
      icon.className = 'beos-boot-icon';
      icon.innerHTML = svg;
      this.bootRow.appendChild(icon);
    });
    this.bootHint = document.createElement('p');
    this.bootHint.className = 'beos-boot-hint';
    this.bootHint.textContent = 'Press space for boot options';
    this.boot.append(mark, word, this.bootRow, this.bootHint);

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'beos-cursor';
    this.cursorEl.innerHTML = CURSOR;

    this.root.append(this.desk, this.deskbar, this.menuLayer, this.boot, this.cursorEl);
    container.appendChild(this.root);

    this._paintDesktopIcons();
    this.syncDeskbar();
    this.syncWorkspaces();
    this._tickClock();
    this.clockTimer = setInterval(() => this._tickClock(), 1000);
    this._onResize = () => this.layoutDesktop();
    window.addEventListener('resize', this._onResize);
    this.layoutDesktop();
    this.cursor.x = Math.max(80, container.clientWidth * 0.46);
    this.cursor.y = Math.max(80, container.clientHeight * 0.55);
    this._renderCursor();

    this.stylesReady = this._loadCss();
  }

  _loadCss() {
    const id = 'beos-css';
    let link = document.getElementById(id);
    const ready = (node) =>
      new Promise((resolve) => {
        if (node.sheet) {
          resolve();
          return;
        }
        node.addEventListener('load', () => resolve(), { once: true });
        node.addEventListener('error', () => resolve(), { once: true });
      });
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = new URL('./beos.css', import.meta.url).href;
      document.head.appendChild(link);
    }
    return ready(link).then(() => {
      if (this.destroyed) return;
      this.root.style.background = '';
      this.boot.style.cssText = '';
    });
  }

  _paintDesktopIcons() {
    for (const spec of DESKTOP_ICONS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'beos-deskicon';
      btn.dataset.id = spec.id;
      btn.style.left = `${spec.x}px`;
      if (spec.y !== 'end') btn.style.top = `${spec.y}px`;
      const glyph = document.createElement('span');
      glyph.className = 'beos-glyph';
      glyph.innerHTML = iconSvg(spec.icon);
      const label = document.createElement('span');
      label.className = 'beos-label';
      label.textContent = spec.label;
      btn.append(glyph, label);
      this.deskIcons.appendChild(btn);
    }
  }

  layoutDesktop() {
    const trash = this.deskIcons.querySelector('[data-id="trash"]');
    if (!trash) return;
    trash.style.top = `${Math.max(210, this.desk.clientHeight - 96)}px`;
  }

  desktopIcon(id) {
    return this.deskIcons.querySelector(`[data-id="${id}"]`);
  }

  _tickClock() {
    const now = new Date();
    let hrs = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    this.clockEl.textContent = `${hrs}:${mins}:${secs} ${ampm}`;
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
    ring.className = 'beos-ring';
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
    const scope = el.closest('.beos-icons-view, .beos-deskicons, .beos-list') || el.parentElement;
    scope?.querySelectorAll('.selected').forEach((node) => node.classList.remove('selected'));
    el.classList.add('selected');
  }

  async doubleClick(el, signal) {
    await this.moveToElement(el, 0.5, 0.4, null, signal);
    this.selectItem(el);
    this._ring();
    this.sounds.click();
    await this.wait(80, signal);
    this._ring();
    this.sounds.click();
    await this.wait(130, signal);
  }

  async typeText(el, text, signal) {
    for (const ch of text) {
      this._check(signal);
      const caret = el.querySelector?.('.beos-caret');
      const node = document.createTextNode(ch);
      if (caret) el.insertBefore(node, caret);
      else el.appendChild(node);
      if (el.scrollHeight) el.scrollTop = el.scrollHeight;
      this.sounds.key();
      await this.wait(ch === ' ' ? 28 : 44, signal);
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

  getSafeBox() {
    const w = this.desk.clientWidth || 1024;
    const h = this.desk.clientHeight || 700;
    return {
      left: 108,
      top: 40,
      width: Math.max(340, w - 128),
      height: Math.max(280, h - 56),
    };
  }

  // Layouts are drawn for about a 1320×820 desk. Larger screens grow windows a little.
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
    const n = this.windows.filter((w) => w.workspace === this.workspace).length;
    // Step past the tab and the menu bar so the window behind stays readable.
    let x = cfg.x ?? box.left + 12 + (n % 4) * 8;
    let y = cfg.y ?? box.top + 8 + (n % 4) * 46;
    if (cfg.center) {
      x = Math.max(12, Math.round((this.desk.clientWidth - width) / 2));
      y = Math.max(box.top, Math.round((this.desk.clientHeight - height) / 2));
    }
    x = Math.max(8, Math.min(x, this.desk.clientWidth - width - 8));
    y = Math.max(32, Math.min(y, this.desk.clientHeight - height - 8));

    const el = document.createElement('div');
    el.className = 'beos-win';
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    const tab = document.createElement('div');
    tab.className = 'beos-tab';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'beos-box beos-close';
    closeBtn.setAttribute('aria-label', 'Close');
    const titleEl = document.createElement('span');
    titleEl.className = 'beos-tab-title';
    titleEl.textContent = cfg.title || 'Window';
    const zoomBtn = document.createElement('button');
    zoomBtn.type = 'button';
    zoomBtn.className = 'beos-box beos-zoom';
    zoomBtn.setAttribute('aria-label', 'Zoom');
    tab.append(closeBtn, titleEl, zoomBtn);

    const frame = document.createElement('div');
    frame.className = 'beos-frame';
    let menuBar = null;
    if (cfg.menus?.length) {
      menuBar = document.createElement('div');
      menuBar.className = 'beos-menubar';
      for (const menu of cfg.menus) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'beos-menu';
        btn.dataset.menu = menu.label;
        btn.textContent = menu.label;
        menuBar.appendChild(btn);
      }
      frame.appendChild(menuBar);
    }
    const body = document.createElement('div');
    body.className = 'beos-body';
    if (cfg.node) body.appendChild(cfg.node);
    const grip = document.createElement('div');
    grip.className = 'beos-grip';
    frame.append(body, grip);
    el.append(tab, frame);
    this.windowsEl.appendChild(el);

    const win = {
      el,
      titleEl,
      body,
      closeBtn,
      zoomBtn,
      menuBar,
      menus: cfg.menus || [],
      app: cfg.app || null,
      title: cfg.title || 'Window',
      workspace: cfg.workspace || this.workspace,
      zoomed: false,
      restore: null,
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
      if (other.workspace === win.workspace) other.el.classList.remove('active');
    }
    win.el.classList.add('active');
    this.z += 1;
    win.el.style.zIndex = String(this.z);
    this.windowsEl.appendChild(win.el);
    this.syncDeskbar();
  }

  closeWindow(win) {
    if (!win) return;
    win.el.remove();
    this.windows = this.windows.filter((item) => item !== win);
    const front = [...this.windows].reverse().find((item) => item.workspace === this.workspace && item.el.style.display !== 'none');
    if (front) this.focusWindow(front);
    else this.syncDeskbar();
  }

  closeAllWindows() {
    for (const win of [...this.windows]) win.el.remove();
    this.windows = [];
    this.syncDeskbar();
  }

  zoomWindow(win) {
    if (!win.zoomed) {
      win.restore = {
        x: win.el.offsetLeft,
        y: win.el.offsetTop,
        w: win.el.offsetWidth,
        h: win.el.offsetHeight,
      };
      const box = this.getSafeBox();
      const w = Math.min(box.width - 8, Math.round(win.restore.w * 1.26));
      const h = Math.min(box.height - 8, Math.round(win.restore.h * 1.2));
      win.el.style.width = `${w}px`;
      win.el.style.height = `${h}px`;
      win.zoomed = true;
    } else if (win.restore) {
      win.el.style.width = `${win.restore.w}px`;
      win.el.style.height = `${win.restore.h}px`;
      win.el.style.left = `${win.restore.x}px`;
      win.el.style.top = `${win.restore.y}px`;
      win.zoomed = false;
    }
  }

  async moveWindow(win, x, y, ms, signal) {
    const sx = win.el.offsetLeft;
    const sy = win.el.offsetTop;
    const maxX = this.desk.clientWidth - win.el.offsetWidth - 8;
    const maxY = this.desk.clientHeight - win.el.offsetHeight - 8;
    const tx = Math.max(8, Math.min(x, maxX));
    const ty = Math.max(32, Math.min(y, maxY));
    await this.animate(
      ms,
      (t) => {
        const u = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        win.el.style.left = `${Math.round(sx + (tx - sx) * u)}px`;
        win.el.style.top = `${Math.round(sy + (ty - sy) * u)}px`;
      },
      signal,
    );
  }

  syncDeskbar() {
    const names = ['Tracker'];
    for (const win of this.windows) {
      if (win.workspace !== this.workspace || !win.app) continue;
      if (!names.includes(win.app)) names.push(win.app);
    }
    const front = [...this.windows].reverse().find((win) => win.workspace === this.workspace && win.el.style.display !== 'none');
    const active = front?.app || null;
    this.appsEl.replaceChildren();
    for (const name of names) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'beos-appbtn';
      btn.dataset.app = name;
      btn.textContent = name;
      if (name === active) btn.classList.add('on');
      this.appsEl.appendChild(btn);
    }
  }

  syncWorkspaces() {
    this.wsEl.querySelectorAll('.beos-ws').forEach((cell) => {
      cell.classList.toggle('on', Number(cell.dataset.ws) === this.workspace);
    });
  }

  setDeskBackground(value) {
    this.workspaceBackgrounds[this.workspace] = value;
    this.desk.style.background = value;
  }

  setWorkspace(n) {
    this.workspace = n;
    this.desk.style.background = this.workspaceBackgrounds[n];
    for (const win of this.windows) {
      win.el.style.display = win.workspace === n ? '' : 'none';
    }
    this.syncWorkspaces();
    const front = [...this.windows].reverse().find((win) => win.workspace === n);
    if (front) this.focusWindow(front);
    else this.syncDeskbar();
  }

  workspaceButton(n) {
    return this.wsEl.querySelector(`[data-ws="${n}"]`);
  }

  closePopups() {
    this.menuLayer.replaceChildren();
  }

  _buildPop(items) {
    const pop = document.createElement('div');
    pop.className = 'beos-pop';
    for (const item of items) {
      if (item.divider) {
        const sep = document.createElement('div');
        sep.className = 'beos-sep';
        pop.appendChild(sep);
        continue;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'beos-mi';
      if (item.submenu) btn.classList.add('sub');
      if (item.disabled) btn.classList.add('disabled');
      if (item.checked) btn.classList.add('checked');
      btn.dataset.label = item.label;
      const name = document.createElement('span');
      name.textContent = item.label;
      btn.appendChild(name);
      if (item.shortcut) {
        const sc = document.createElement('span');
        sc.className = 'sc';
        sc.textContent = item.shortcut;
        btn.appendChild(sc);
      }
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
      left = a.x - pw + 4;
      top = a.y - 3;
      if (left < 6) left = a.right - 6;
    }
    if (left + pw > rootW - 6) left = Math.max(6, rootW - pw - 6);
    if (top + ph > rootH - 6) top = Math.max(6, rootH - ph - 6);
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    return pop;
  }

  _light(pop, label) {
    pop.querySelectorAll('.beos-mi').forEach((el) => el.classList.toggle('lit', el.dataset.label === label));
  }

  async openBeMenu(path, signal) {
    await this.click(this.beBtn, { pressClass: 'pressed' }, signal);
    let pop = this._placePop(this._buildPop(BE_MENU), this.beBtn, 'below');
    for (let i = 0; i < path.length; i++) {
      const label = path[i];
      const el = [...pop.querySelectorAll('.beos-mi')].find((node) => node.dataset.label === label);
      if (!el) throw new Error(`Missing Be menu item: ${label}`);
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
    this.closePopups();
  }

  async openWindowMenu(win, menuLabel, itemLabel, signal) {
    this.focusWindow(win);
    const btn = win.menuBar?.querySelector(`[data-menu="${CSS.escape(menuLabel)}"]`);
    const menu = win.menus.find((item) => item.label === menuLabel);
    if (!btn || !menu) throw new Error(`Missing menu ${menuLabel}`);
    await this.click(btn, {}, signal);
    btn.classList.add('lit');
    const pop = this._placePop(this._buildPop(menu.items), btn, 'below');
    const el = [...pop.querySelectorAll('.beos-mi')].find((node) => node.dataset.label === itemLabel);
    if (!el) throw new Error(`Missing menu item ${itemLabel}`);
    await this.moveToElement(el, 0.35, 0.5, null, signal);
    this._light(pop, itemLabel);
    this.sounds.menu();
    await this.wait(140, signal);
    btn.classList.remove('lit');
    this.closePopups();
  }

  showBoot() {
    this.boot.querySelectorAll('.beos-boot-icon').forEach((icon) => icon.classList.remove('lit'));
    this.bootHint.hidden = false;
    this.boot.classList.add('on');
    this.setCursorVisible(false);
  }

  setBootIcon(index, on) {
    const icon = this.bootRow.children[index];
    if (icon) icon.classList.toggle('lit', on);
  }

  hideBootHint() {
    this.bootHint.hidden = true;
  }

  hideBoot() {
    this.boot.classList.remove('on');
  }

  resetDesk() {
    this.closePopups();
    this.closeAllWindows();
    this.workspace = 1;
    this.workspaceBackgrounds[1] = 'linear-gradient(160deg, #3e7ea8 0%, #24577a 100%)';
    this.desk.style.background = this.workspaceBackgrounds[1];
    this.syncWorkspaces();
    this.deskIcons.querySelectorAll('.selected').forEach((node) => node.classList.remove('selected'));
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.clockTimer);
    window.removeEventListener('resize', this._onResize);
    this.root.remove();
  }
}
