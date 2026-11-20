import { Win31Sounds } from './sounds.js';
import { FLAG } from './icons.js';

export class AbortSceneError extends Error {
  constructor() {
    super('Scene aborted');
    this.name = 'AbortSceneError';
  }
}

const CURSOR = `<svg width="12" height="19" viewBox="0 0 12 19" shape-rendering="crispEdges" aria-hidden="true">
  <path fill="#000" d="M1 1h1v12H1zM2 2h1v10H2zM3 3h1v8H3zM4 4h1v6H4zM4 11h1v1H4zM5 5h1v5H5zM5 12h1v2H5zM6 6h1v4H6zM6 13h1v2H6zM7 7h1v2H7zM7 14h1v1H7zM8 8h1v1H8z"/>
  <path fill="#fff" d="M2 3h1v8H2zM3 4h1v6H3zM4 5h1v4H4zM5 6h1v3H5zM5 13h1v1H5zM6 7h1v2H6z"/>
</svg>`;

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export class Win31Engine {
  constructor(container, options = {}) {
    this.container = container;
    this.onStatus = options.onStatus || (() => {});
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.destroyed = false;
    this.sounds = new Win31Sounds();
    this.sounds.setMuted(options.muted !== false);
    this.windows = [];
    this.z = 2;
    this.cursor = { x: 180, y: 160 };
    this.stars = null;

    this.root = document.createElement('div');
    this.root.className = 'w31';
    this.root.style.background = '#000080';

    this.windowsEl = document.createElement('div');
    this.windowsEl.className = 'w31-windows';
    this.menuLayer = document.createElement('div');
    this.menuLayer.className = 'w31-menus';
    this.starLayer = document.createElement('div');
    this.starLayer.className = 'w31-starfield';
    this.dosLayer = document.createElement('div');
    this.dosLayer.className = 'w31-dosfull';

    this.boot = document.createElement('div');
    this.boot.className = 'w31-boot on';
    this.boot.style.cssText = 'display:flex;position:absolute;inset:0;background:#000080;z-index:30;color:#fff;align-items:center;justify-content:center;flex-direction:column;';
    const mark = document.createElement('div');
    mark.className = 'mark';
    mark.innerHTML = FLAG;
    const ms = document.createElement('p');
    ms.className = 'w31-boot-ms';
    ms.textContent = 'Microsoft';
    const word = document.createElement('p');
    word.className = 'w31-boot-win';
    word.textContent = 'Windows';
    const ver = document.createElement('p');
    ver.className = 'w31-boot-ver';
    ver.textContent = 'Version 3.1';
    const mode = document.createElement('p');
    mode.className = 'w31-boot-mode';
    mode.textContent = '386 Enhanced Mode';
    this.boot.append(mark, ms, word, ver, mode);

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'w31-cursor';
    this.cursorEl.innerHTML = CURSOR;

    this.root.append(this.windowsEl, this.menuLayer, this.starLayer, this.dosLayer, this.boot, this.cursorEl);
    container.appendChild(this.root);

    this.cursor.x = Math.max(80, container.clientWidth * 0.42);
    this.cursor.y = Math.max(80, container.clientHeight * 0.48);
    this._renderCursor();
    this._onResize = () => this.layout();
    window.addEventListener('resize', this._onResize);
    this.clockTimer = setInterval(() => this._tickClocks(), 1000);
    this.stylesReady = this._loadCss();
  }

  _loadCss() {
    const id = 'win31-css';
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
      link.href = new URL('./win31.css?v=5', import.meta.url).href;
      document.head.appendChild(link);
    }
    return ready(link).then(() => {
      if (this.destroyed) return;
      this.root.style.background = '';
      this.boot.style.cssText = '';
    });
  }

  _tickClocks() {
    if (this.paused || this.destroyed) return;
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    this.root.querySelectorAll('[data-clock]').forEach((svg) => {
      svg.querySelector('.hour')?.setAttribute('transform', `rotate(${h * 30 + m * 0.5} 50 50)`);
      svg.querySelector('.min')?.setAttribute('transform', `rotate(${m * 6} 50 50)`);
      svg.querySelector('.sec')?.setAttribute('transform', `rotate(${s * 6} 50 50)`);
    });
  }

  setSpeed(speed) { this.speed = speed || 1; }
  setPaused(paused) { this.paused = paused; }
  setMuted(muted) { this.sounds.setMuted(muted); }

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
    const dur = duration ?? Math.max(220, Math.min(820, 160 + dist * 0.8));
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arc = (Math.random() > 0.5 ? 1 : -1) * Math.min(32, dist * 0.1);
    const cx = sx + dx * 0.45 + perpX * arc;
    const cy = sy + dy * 0.45 + perpY * arc;
    await this.animate(dur, (t) => {
      const u = ease(t);
      const k = 1 - u;
      this.cursor.x = k * k * sx + 2 * k * u * cx + u * u * x;
      this.cursor.y = k * k * sy + 2 * k * u * cy + u * u * y;
      this._renderCursor();
    }, signal);
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
    ring.className = 'w31-ring';
    ring.style.left = `${this.cursor.x}px`;
    ring.style.top = `${this.cursor.y}px`;
    this.root.appendChild(ring);
    setTimeout(() => ring.remove(), 320);
  }

  async click(el = null, opts = {}, signal = null) {
    if (el) await this.moveToElement(el, opts.rx ?? 0.5, opts.ry ?? 0.5, opts.duration ?? null, signal);
    this._ring();
    this.sounds.click();
    if (el && opts.pressClass) el.classList.add(opts.pressClass);
    try {
      await this.wait(80, signal);
    } finally {
      if (el && opts.pressClass) el.classList.remove(opts.pressClass);
    }
    await this.wait(opts.afterMs ?? 70, signal);
  }

  selectItem(el) {
    if (!el) return;
    const scope = el.closest('.w31-icons, .w31-minis, .w31-files, .w31-tree') || el.parentElement;
    scope?.querySelectorAll('.selected').forEach((node) => node.classList.remove('selected'));
    el.classList.add('selected');
  }

  async doubleClick(el, signal) {
    if (!el) throw new Error('Missing double-click target');
    await this.moveToElement(el, 0.5, 0.42, null, signal);
    this.selectItem(el);
    this._ring();
    this.sounds.click();
    await this.wait(70, signal);
    this._ring();
    this.sounds.click();
    await this.wait(120, signal);
  }

  async typeText(el, text, signal) {
    for (const ch of text) {
      this._check(signal);
      const caret = el.querySelector?.('.w31-caret');
      const node = document.createTextNode(ch);
      if (caret) el.insertBefore(node, caret);
      else el.appendChild(node);
      if (el.scrollHeight) el.scrollTop = el.scrollHeight;
      this.sounds.key();
      await this.wait(ch === '\n' ? 70 : ch === ' ' ? 28 : 40, signal);
    }
  }

  async dragEl(el, x, y, ms, signal) {
    const sx = el.offsetLeft;
    const sy = el.offsetTop;
    const parent = el.offsetParent || el.parentElement;
    const start = this._rect(el);
    const holdX = this.cursor.x - (start.x + start.w / 2);
    const holdY = this.cursor.y - (start.y + start.h / 2);
    el.style.zIndex = '6';
    await this.animate(ms, (t) => {
      const u = ease(t);
      const nx = sx + (x - sx) * u;
      const ny = sy + (y - sy) * u;
      el.style.left = `${nx}px`;
      el.style.top = `${ny}px`;
      const pr = parent.getBoundingClientRect();
      const root = this.root.getBoundingClientRect();
      this.cursor.x = pr.left - root.left + nx + el.offsetWidth / 2 + holdX;
      this.cursor.y = pr.top - root.top + ny + el.offsetHeight / 2 + holdY;
      this._renderCursor();
    }, signal);
  }

  deskSize() {
    const r = this.root.getBoundingClientRect();
    return {
      w: Math.max(640, r.width || this.root.clientWidth || 640),
      h: Math.max(440, r.height || this.root.clientHeight || 440),
    };
  }

  // Drawn for about a 1200×740 desk. Larger screens grow the main windows a little.
  windowScale() {
    const { w, h } = this.deskSize();
    const s = Math.min(w / 1200, h / 740);
    return Math.max(1, Math.min(1.2, s));
  }

  createWindow(cfg) {
    const { w: deskW, h: deskH } = this.deskSize();
    const scale = cfg.scale === false ? 1 : this.windowScale();
    let width = Math.round((cfg.width || 480) * scale);
    let height = Math.round((cfg.height || 320) * scale);
    let x = cfg.x ?? 36;
    let y = cfg.y ?? 24;

    if (cfg.parent) {
      const pw = cfg.parent.clientEl.clientWidth || 480;
      const ph = cfg.parent.clientEl.clientHeight || 320;
      width = Math.min(width, Math.max(120, pw - 8));
      height = Math.min(height, Math.max(80, ph - 8));
      x = Math.max(2, Math.min(x, Math.max(2, pw - width - 2)));
      y = Math.max(2, Math.min(y, Math.max(2, ph - height - 2)));
    } else {
      width = Math.min(width, Math.max(200, deskW - 16));
      height = Math.min(height, Math.max(140, deskH - 16));
      if (cfg.center) {
        x = Math.round((deskW - width) / 2);
        y = Math.round((deskH - height) / 2);
      }
      x = Math.max(6, Math.min(x, Math.max(6, deskW - width - 6)));
      y = Math.max(6, Math.min(y, Math.max(6, deskH - height - 6)));
    }

    const el = document.createElement('div');
    el.className = 'w31-win';
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    const title = document.createElement('div');
    title.className = 'w31-title';
    const sys = document.createElement('button');
    sys.type = 'button';
    sys.className = 'w31-sys';
    sys.setAttribute('aria-label', 'System menu');
    const titleEl = document.createElement('span');
    titleEl.className = 'w31-title-text';
    titleEl.textContent = cfg.title || 'Window';
    const btns = document.createElement('span');
    btns.className = 'w31-title-btns';
    const min = document.createElement('button');
    min.type = 'button';
    min.className = 'w31-min';
    min.setAttribute('aria-label', 'Minimize');
    const max = document.createElement('button');
    max.type = 'button';
    max.className = 'w31-max';
    max.setAttribute('aria-label', 'Maximize');
    btns.append(min, max);
    title.append(sys, titleEl, btns);

    let menuBar = null;
    if (cfg.menus?.length) {
      menuBar = document.createElement('div');
      menuBar.className = 'w31-menubar';
      for (const menu of cfg.menus) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'w31-menu';
        btn.dataset.menu = menu.label;
        const u = document.createElement('u');
        u.textContent = menu.label.slice(0, 1);
        btn.append(u, document.createTextNode(menu.label.slice(1)));
        menuBar.appendChild(btn);
      }
    }

    const client = document.createElement('div');
    client.className = 'w31-client';
    if (cfg.node) client.appendChild(cfg.node);

    el.append(title);
    if (menuBar) el.appendChild(menuBar);
    el.appendChild(client);

    const win = {
      el,
      titleEl,
      clientEl: cfg.clientEl || client,
      menuBar,
      menus: cfg.menus || [],
      parent: cfg.parent || null,
      activeChild: null,
      title: cfg.title || 'Window',
    };
    // Program Manager keeps its icon surface as the positioning parent.
    if (cfg.clientEl) win.clientEl = cfg.clientEl;

    if (cfg.parent) {
      cfg.parent.clientEl.appendChild(el);
      el.style.zIndex = '1';
    } else {
      this.windowsEl.appendChild(el);
    }
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
    const top = win.parent || win;
    if (win.parent) top.activeChild = win;
    for (const other of this.windows) other.el.classList.remove('active');
    top.el.classList.add('active');
    if (!top.parent) {
      this.z += 1;
      top.el.style.zIndex = String(this.z);
      this.windowsEl.appendChild(top.el);
    }
    if (top.activeChild && this.windows.includes(top.activeChild)) {
      top.activeChild.el.classList.add('active');
      top.clientEl.appendChild(top.activeChild.el);
    }
  }

  closeWindow(win) {
    if (!win) return;
    const kids = this.windows.filter((item) => item.parent === win);
    for (const child of kids) child.el.remove();
    win.el.remove();
    this.windows = this.windows.filter((item) => item !== win && item.parent !== win);
    if (win.parent?.activeChild === win) {
      win.parent.activeChild = this.windows.find((item) => item.parent === win.parent) || null;
    }
    const top = [...this.windows].reverse().find((item) => !item.parent);
    if (top) this.focusWindow(top.activeChild || top);
  }

  closeAllWindows() {
    for (const win of [...this.windows]) win.el.remove();
    this.windows = [];
  }

  tileGroups(pm) {
    const groups = this.windows.filter((win) => win.parent === pm);
    if (!groups.length) return;
    const cw = pm.clientEl.clientWidth;
    const ch = Math.max(120, pm.clientEl.clientHeight - 72);
    const cols = Math.min(groups.length, 2);
    const rows = Math.ceil(groups.length / cols);
    groups.forEach((group, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const width = Math.floor(cw / cols) - 10;
      const height = Math.floor(ch / rows) - 8;
      group.el.style.left = `${6 + col * Math.floor(cw / cols)}px`;
      group.el.style.top = `${6 + row * Math.floor(ch / rows)}px`;
      group.el.style.width = `${width}px`;
      group.el.style.height = `${height}px`;
    });
  }

  layout() {
    const { w, h } = this.deskSize();
    for (const win of this.windows) {
      if (win.parent) continue;
      const maxX = w - win.el.offsetWidth - 6;
      const maxY = h - win.el.offsetHeight - 6;
      win.el.style.left = `${Math.max(6, Math.min(win.el.offsetLeft, maxX))}px`;
      win.el.style.top = `${Math.max(6, Math.min(win.el.offsetTop, maxY))}px`;
    }
  }

  closePopups() {
    this.menuLayer.replaceChildren();
    this.root.querySelectorAll('.w31-menu.lit').forEach((node) => node.classList.remove('lit'));
  }

  _buildPop(items) {
    const pop = document.createElement('div');
    pop.className = 'w31-pop';
    for (const item of items) {
      if (item.divider) {
        const sep = document.createElement('div');
        sep.className = 'w31-sep';
        pop.appendChild(sep);
        continue;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w31-mi';
      if (item.disabled) btn.classList.add('disabled');
      btn.dataset.label = item.label;
      const name = document.createElement('span');
      if (item.checked) {
        const mark = document.createElement('span');
        mark.className = 'w31-check';
        mark.textContent = '✓';
        name.appendChild(mark);
      }
      name.appendChild(document.createTextNode(item.label));
      btn.appendChild(name);
      if (item.shortcut) {
        const sc = document.createElement('span');
        sc.className = 'w31-sc';
        sc.textContent = item.shortcut;
        btn.appendChild(sc);
      }
      pop.appendChild(btn);
    }
    this.menuLayer.appendChild(pop);
    return pop;
  }

  _placePop(pop, anchor) {
    const a = this._rect(anchor);
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    const rootW = this.root.clientWidth;
    const rootH = this.root.clientHeight;
    let left = a.x;
    let top = a.bottom;
    if (left + pw > rootW - 6) left = Math.max(6, rootW - pw - 6);
    if (top + ph > rootH - 6) top = Math.max(6, a.y - ph);
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    return pop;
  }

  async openWindowMenu(win, menuLabel, itemLabel, signal) {
    this.focusWindow(win);
    const btn = win.menuBar?.querySelector(`[data-menu="${CSS.escape(menuLabel)}"]`);
    const menu = win.menus.find((item) => item.label === menuLabel);
    if (!btn || !menu) throw new Error(`Missing menu ${menuLabel}`);
    await this.click(btn, {}, signal);
    btn.classList.add('lit');
    const pop = this._placePop(this._buildPop(menu.items), btn);
    const el = [...pop.querySelectorAll('.w31-mi')].find((node) => node.dataset.label === itemLabel);
    if (!el) throw new Error(`Missing menu item ${itemLabel}`);
    await this.moveToElement(el, 0.4, 0.5, null, signal);
    pop.querySelectorAll('.w31-mi').forEach((node) => node.classList.toggle('lit', node === el));
    this.sounds.menu();
    await this.wait(150, signal);
    btn.classList.remove('lit');
    this.closePopups();
  }

  showBoot() {
    this.hideDos();
    this.hideStarfield();
    this.boot.classList.add('on');
    this.setCursorVisible(false);
  }

  hideBoot() {
    this.boot.classList.remove('on');
  }

  showDos() {
    this.dosLayer.classList.add('on');
    const term = document.createElement('div');
    term.className = 'w31-dosfull-term';
    term.append(document.createTextNode('C:\\WINDOWS>'));
    const caret = document.createElement('span');
    caret.className = 'w31-caret light';
    term.appendChild(caret);
    this.dosLayer.replaceChildren(term);
    this.dosTerm = term;
  }

  hideDos() {
    this.dosLayer.classList.remove('on');
    this.dosLayer.replaceChildren();
    this.dosTerm = null;
  }

  showStarfield() {
    this.starLayer.classList.add('on');
    if (this.stars) return;
    this.stars = [];
    for (let i = 0; i < 70; i += 1) {
      const el = document.createElement('i');
      el.className = 'w31-star';
      this.starLayer.appendChild(el);
      this.stars.push({
        el,
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        phase: Math.random(),
      });
    }
  }

  tickStars(t) {
    if (!this.stars) return;
    const w = this.starLayer.clientWidth / 2;
    const h = this.starLayer.clientHeight / 2;
    for (const star of this.stars) {
      const u = (t * 0.9 + star.phase) % 1;
      const k = 0.12 + u * u * 2.6;
      star.el.style.transform = `translate(${star.x * w * k}px, ${star.y * h * k}px) scale(${0.3 + u * 2.6})`;
      star.el.style.opacity = String(Math.min(1, u * 1.7));
    }
  }

  hideStarfield() {
    this.starLayer.classList.remove('on');
  }

  resetDesk() {
    this.closePopups();
    this.closeAllWindows();
    this.hideDos();
    this.hideStarfield();
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.clockTimer);
    window.removeEventListener('resize', this._onResize);
    this.root.remove();
  }
}
