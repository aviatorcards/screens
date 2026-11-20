import { startTree } from './apps.js';
import { FLAG, iconSvg } from './icons.js';
import { Win95Sounds } from './sounds.js';

export class AbortSceneError extends Error {
  constructor() {
    super('Scene aborted');
    this.name = 'AbortSceneError';
  }
}

const BAR = 30;

const CURSOR = `<svg width="12" height="19" viewBox="0 0 12 19" shape-rendering="crispEdges" aria-hidden="true">
  <path fill="#000" d="M1 1h1v12H1zM2 2h1v10H2zM3 3h1v8H3zM4 4h1v6H4zM4 11h1v1H4zM5 5h1v5H5zM5 12h1v2H5zM6 6h1v4H6zM6 13h1v2H6zM7 7h1v2H7zM7 14h1v1H7zM8 8h1v1H8z"/>
  <path fill="#fff" d="M2 3h1v8H2zM3 4h1v6H3zM4 5h1v4H4zM5 6h1v3H5zM5 13h1v1H5zM6 7h1v2H6z"/>
</svg>`;

const MIN_GLYPH = `<svg viewBox="0 0 9 9" shape-rendering="crispEdges" aria-hidden="true"><rect x="1" y="6" width="7" height="2" fill="#000"/></svg>`;
const MAX_GLYPH = `<svg viewBox="0 0 9 9" shape-rendering="crispEdges" aria-hidden="true"><path fill="#000" d="M1 1h7v2H1zM1 7h7v1H1zM1 1h1v7H1zM7 1h1v7H7z"/></svg>`;
const CLOSE_GLYPH = `<svg viewBox="0 0 9 9" shape-rendering="crispEdges" aria-hidden="true"><path fill="#000" d="M1 1h2v1H1zM6 1h2v1H6zM2 2h2v1H2zM5 2h2v1H5zM3 3h3v1H3zM4 4h1v1H4zM3 5h3v1H3zM2 6h2v1H2zM5 6h2v1H5zM1 7h2v1H1zM6 7h2v1H6z"/></svg>`;

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function glyph(name) {
  const span = document.createElement('span');
  span.className = 'w95-glyph';
  span.innerHTML = iconSvg(name);
  return span;
}

function clockText(date) {
  let h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

export class Win95Engine {
  constructor(container, options = {}) {
    this.container = container;
    this.onStatus = options.onStatus || (() => {});
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.destroyed = false;
    this.sounds = new Win95Sounds();
    this.sounds.setMuted(options.muted !== false);
    this.windows = [];
    this.z = 2;
    this.era = '95';
    this.cursor = { x: 180, y: 160 };
    this.stars = null;
    this.flags = null;

    this.root = document.createElement('div');
    this.root.className = 'w95';
    this.root.style.background = '#008080';

    this.deskIcons = document.createElement('div');
    this.deskIcons.className = 'w95-deskicons';
    this._buildDesk();

    this.windowsEl = document.createElement('div');
    this.windowsEl.className = 'w95-windows';
    this.menuLayer = document.createElement('div');
    this.menuLayer.className = 'w95-menus';
    this.flyLayer = document.createElement('div');
    this.flyLayer.className = 'w95-fly';
    this.safeLayer = document.createElement('div');
    this.safeLayer.className = 'w95-safe';
    this.safeLayer.textContent = "It's now safe to turn off your computer.";
    this.scanLayer = document.createElement('div');
    this.scanLayer.className = 'w95-scandisk';
    const scanA = document.createElement('p');
    scanA.textContent = 'Windows was not properly shut down. One or more of your disk drives may have errors on it.';
    const scanB = document.createElement('p');
    scanB.textContent = 'ScanDisk is now checking drive C for errors.';
    this.scanLayer.append(scanA, scanB);

    this.boot = document.createElement('div');
    this.boot.className = 'w95-boot on';
    this.boot.style.cssText = 'display:flex;position:absolute;inset:0;z-index:60;background:#3a9fe8;color:#fff;align-items:center;justify-content:center;flex-direction:column;';
    for (let i = 0; i < 5; i += 1) {
      const cloud = document.createElement('i');
      cloud.className = 'w95-cloud';
      this.boot.appendChild(cloud);
    }
    const card = document.createElement('div');
    card.className = 'w95-boot-card';
    const mark = document.createElement('div');
    mark.className = 'w95-logo';
    mark.innerHTML = FLAG;
    const ms = document.createElement('p');
    ms.className = 'w95-boot-ms';
    ms.textContent = 'Microsoft';
    this.bootProduct = document.createElement('p');
    this.bootProduct.className = 'w95-boot-win';
    this.bootProduct.textContent = 'Windows 95';
    const bar = document.createElement('div');
    bar.className = 'w95-load';
    for (let i = 0; i < 18; i += 1) bar.appendChild(document.createElement('i'));
    card.append(mark, ms, this.bootProduct, bar);
    this.boot.appendChild(card);

    this.taskbar = document.createElement('div');
    this.taskbar.className = 'w95-taskbar';
    this.startBtn = document.createElement('button');
    this.startBtn.type = 'button';
    this.startBtn.className = 'w95-start';
    this.startBtn.setAttribute('aria-label', 'Start');
    const logo = document.createElement('span');
    logo.className = 'w95-logo';
    logo.innerHTML = FLAG;
    const startLabel = document.createElement('span');
    startLabel.className = 'w95-start-label';
    startLabel.textContent = 'Start';
    this.startBtn.append(logo, startLabel);

    this.quick = document.createElement('div');
    this.quick.className = 'w95-quick';
    const sepA = document.createElement('i');
    sepA.className = 'w95-qsep';
    this.quick.appendChild(sepA);
    for (const name of ['ie', 'mail', 'desk']) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w95-qbtn';
      btn.appendChild(glyph(name));
      this.quick.appendChild(btn);
    }
    const sepB = document.createElement('i');
    sepB.className = 'w95-qsep';
    this.quick.appendChild(sepB);

    this.tasksEl = document.createElement('div');
    this.tasksEl.className = 'w95-tasks';
    this.clockEl = document.createElement('div');
    this.clockEl.className = 'w95-clock';
    this.taskbar.append(this.startBtn, this.quick, this.tasksEl, this.clockEl);

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'w95-cursor';
    this.cursorEl.innerHTML = CURSOR;

    this.root.append(
      this.deskIcons,
      this.windowsEl,
      this.taskbar,
      this.menuLayer,
      this.flyLayer,
      this.safeLayer,
      this.scanLayer,
      this.boot,
      this.cursorEl,
    );
    container.appendChild(this.root);

    this.cursor.x = Math.max(80, container.clientWidth * 0.42);
    this.cursor.y = Math.max(80, container.clientHeight * 0.46);
    this._renderCursor();
    this._tickClock();
    this._onResize = () => this.layout();
    window.addEventListener('resize', this._onResize);
    this.clockTimer = setInterval(() => this._tickClock(), 1000);
    this.stylesReady = this._loadCss();
  }

  _buildDesk() {
    const icons = [
      ['My Documents', 'documents', 'w95-only98'],
      ['My Computer', 'computer', ''],
      ['Network Neighborhood', 'network', ''],
      ['Recycle Bin', 'recycle', ''],
      ['Inbox', 'inbox', 'w95-only95'],
      ['Internet Explorer', 'ie', 'w95-only98'],
    ];
    for (const [label, name, extra] of icons) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `w95-dicon${extra ? ` ${extra}` : ''}`;
      btn.dataset.label = label;
      btn.appendChild(glyph(name));
      const text = document.createElement('span');
      text.className = 'w95-dlabel';
      text.textContent = label;
      btn.appendChild(text);
      this.deskIcons.appendChild(btn);
    }
  }

  _loadCss() {
    const id = 'w95-css';
    const href = new URL('./win95.css?v=7', import.meta.url).href;
    let link = document.getElementById(id);
    const ready = (node, wait) => new Promise((resolve) => {
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
      this.root.style.background = '';
      this.boot.style.cssText = '';
    });
  }

  _tickClock() {
    if (this.paused || this.destroyed) return;
    this.clockEl.textContent = clockText(new Date());
  }

  setSpeed(speed) { this.speed = speed || 1; }
  setPaused(paused) { this.paused = paused; }
  setMuted(muted) { this.sounds.setMuted(muted); }

  setEra(era) {
    this.era = era === '98' ? '98' : '95';
    this.root.classList.toggle('w98', this.era === '98');
    this.bootProduct.textContent = this.era === '98' ? 'Windows 98' : 'Windows 95';
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
    ring.className = 'w95-ring';
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
    const scope = el.closest('.w95-deskicons, .w95-licons, .w95-files, .w95-tree, .w95-list') || el.parentElement;
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
      const caret = el.querySelector?.('.w95-caret');
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

  deskIcon(label) {
    return [...this.deskIcons.querySelectorAll('.w95-dicon')].find((node) => node.dataset.label === label);
  }

  deskSize() {
    const r = this.root.getBoundingClientRect();
    return {
      w: Math.max(640, r.width || this.root.clientWidth || 640),
      h: Math.max(440, r.height || this.root.clientHeight || 440),
    };
  }

  windowScale() {
    const { w, h } = this.deskSize();
    const s = Math.min(w / 1280, h / 800);
    return Math.max(1, Math.min(1.18, s));
  }

  createWindow(cfg) {
    const { w: deskW, h: deskH } = this.deskSize();
    const scale = cfg.scale === false ? 1 : this.windowScale();
    let width = Math.round((cfg.width || 480) * scale);
    let height = Math.round((cfg.height || 320) * scale);
    let x = cfg.x ?? 108;
    let y = cfg.y ?? 18;
    const limit = deskH - BAR;
    width = Math.min(width, Math.max(180, deskW - 16));
    height = Math.min(height, Math.max(120, limit - 12));
    if (cfg.center) {
      x = Math.round((deskW - width) / 2);
      y = Math.round((limit - height) / 2);
    }
    x = Math.max(4, Math.min(x, Math.max(4, deskW - width - 4)));
    y = Math.max(4, Math.min(y, Math.max(4, limit - height - 4)));

    const el = document.createElement('div');
    el.className = 'w95-win';
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    const title = document.createElement('div');
    title.className = 'w95-title';
    if (cfg.icon) title.appendChild(glyph(cfg.icon));
    const titleEl = document.createElement('span');
    titleEl.className = 'w95-title-text';
    titleEl.textContent = cfg.title || 'Window';
    const btns = document.createElement('span');
    btns.className = 'w95-title-btns';
    const min = document.createElement('button');
    min.type = 'button';
    min.className = 'w95-cap';
    min.setAttribute('aria-label', 'Minimize');
    min.innerHTML = MIN_GLYPH;
    const max = document.createElement('button');
    max.type = 'button';
    max.className = 'w95-cap';
    max.setAttribute('aria-label', 'Maximize');
    max.innerHTML = MAX_GLYPH;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'w95-cap';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = CLOSE_GLYPH;
    btns.append(min, max, close);
    title.append(titleEl, btns);

    let menuBar = null;
    if (cfg.menus?.length) {
      menuBar = document.createElement('div');
      menuBar.className = 'w95-menubar';
      for (const menu of cfg.menus) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'w95-menu';
        btn.dataset.menu = menu.label;
        const u = document.createElement('u');
        u.textContent = menu.label.slice(0, 1);
        btn.append(u, document.createTextNode(menu.label.slice(1)));
        menuBar.appendChild(btn);
      }
    }

    const client = document.createElement('div');
    client.className = 'w95-client';
    if (cfg.node) client.appendChild(cfg.node);

    el.append(title);
    if (menuBar) el.appendChild(menuBar);
    el.appendChild(client);

    const taskBtn = document.createElement('button');
    taskBtn.type = 'button';
    taskBtn.className = 'w95-task';
    if (cfg.icon) taskBtn.appendChild(glyph(cfg.icon));
    const taskText = document.createElement('span');
    taskText.textContent = cfg.title || 'Window';
    taskBtn.appendChild(taskText);
    this.tasksEl.appendChild(taskBtn);

    const win = {
      el,
      titleEl,
      taskText,
      taskBtn,
      clientEl: client,
      menuBar,
      menus: cfg.menus || [],
      title: cfg.title || 'Window',
    };
    this.windowsEl.appendChild(el);
    this.windows.push(win);
    this.focusWindow(win);
    return win;
  }

  setTitle(win, title) {
    win.title = title;
    win.titleEl.textContent = title;
    if (win.taskText) win.taskText.textContent = title;
  }

  focusWindow(win) {
    if (!win || !this.windows.includes(win)) return;
    for (const other of this.windows) other.el.classList.remove('active');
    win.el.classList.add('active');
    this.z += 1;
    win.el.style.zIndex = String(this.z);
    this.windowsEl.appendChild(win.el);
    this._syncTasks();
  }

  _syncTasks() {
    for (const win of this.windows) {
      win.taskBtn?.classList.toggle('on', win.el.classList.contains('active'));
    }
  }

  closeWindow(win) {
    if (!win) return;
    win.el.remove();
    win.taskBtn?.remove();
    this.windows = this.windows.filter((item) => item !== win);
    const top = this.windows[this.windows.length - 1];
    if (top) this.focusWindow(top);
  }

  closeAllWindows() {
    for (const win of [...this.windows]) win.el.remove();
    this.windows = [];
    this.tasksEl.replaceChildren();
  }

  layout() {
    const { w, h } = this.deskSize();
    for (const win of this.windows) {
      const maxX = w - win.el.offsetWidth - 4;
      const maxY = h - BAR - win.el.offsetHeight - 4;
      win.el.style.left = `${Math.max(4, Math.min(win.el.offsetLeft, maxX))}px`;
      win.el.style.top = `${Math.max(4, Math.min(win.el.offsetTop, maxY))}px`;
    }
  }

  closePopups() {
    this.menuLayer.replaceChildren();
    this.startBtn?.classList.remove('open');
    this.root.querySelectorAll('.w95-menu.lit, .w95-si.lit').forEach((node) => node.classList.remove('lit'));
  }

  _menuButton(item) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w95-si';
    btn.dataset.label = item.label;
    btn.appendChild(glyph(item.icon || 'file'));
    const name = document.createElement('span');
    name.textContent = item.label;
    btn.appendChild(name);
    if (item.children) {
      const arrow = document.createElement('i');
      arrow.className = 'w95-arrow';
      btn.appendChild(arrow);
    }
    return btn;
  }

  _fillPop(pop, items) {
    for (const item of items) {
      if (item.divider) {
        const sep = document.createElement('div');
        sep.className = 'w95-sep';
        pop.appendChild(sep);
        continue;
      }
      pop.appendChild(this._menuButton(item));
    }
    return pop;
  }

  async openStart(path, signal) {
    this.closePopups();
    await this.click(this.startBtn, {}, signal);
    this.startBtn.classList.add('open');
    let items = startTree(this.era);
    const menu = document.createElement('div');
    menu.className = 'w95-startmenu';
    const rail = document.createElement('div');
    rail.className = 'w95-rail';
    const railText = document.createElement('span');
    railText.textContent = this.era === '98' ? 'Windows 98' : 'Windows 95';
    rail.appendChild(railText);
    const column = document.createElement('div');
    column.className = 'w95-sitems';
    this._fillPop(column, items);
    menu.append(rail, column);
    this.menuLayer.appendChild(menu);
    let pop = column;
    for (let i = 0; i < path.length; i += 1) {
      const label = path[i];
      const el = [...pop.querySelectorAll(':scope > .w95-si')].find((node) => node.dataset.label === label);
      if (!el) throw new Error(`Missing start item ${label}`);
      await this.moveToElement(el, 0.4, 0.5, null, signal);
      pop.querySelectorAll(':scope > .w95-si').forEach((node) => node.classList.toggle('lit', node === el));
      this.sounds.menu();
      await this.wait(160, signal);
      const item = items.find((entry) => entry.label === label);
      const last = i === path.length - 1;
      if (!last && item?.children) {
        items = item.children;
        const fly = document.createElement('div');
        fly.className = 'w95-pop';
        this._fillPop(fly, items);
        this.menuLayer.appendChild(fly);
        const anchor = this._rect(el);
        const pw = fly.offsetWidth;
        const ph = fly.offsetHeight;
        let left = anchor.right - 4;
        let top = anchor.y;
        if (left + pw > this.root.clientWidth - 4) left = Math.max(4, anchor.x - pw + 4);
        if (top + ph > this.root.clientHeight - BAR - 4) top = Math.max(4, this.root.clientHeight - BAR - ph - 4);
        fly.style.left = `${Math.round(left)}px`;
        fly.style.top = `${Math.round(top)}px`;
        pop = fly;
      }
    }
    this._ring();
    this.sounds.click();
    await this.wait(80, signal);
    this.closePopups();
  }

  _buildPop(items) {
    const pop = document.createElement('div');
    pop.className = 'w95-pop';
    for (const item of items) {
      if (item.divider) {
        const sep = document.createElement('div');
        sep.className = 'w95-sep';
        pop.appendChild(sep);
        continue;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w95-mi';
      if (item.disabled) btn.classList.add('disabled');
      btn.dataset.label = item.label;
      const name = document.createElement('span');
      if (item.checked) {
        const mark = document.createElement('span');
        mark.className = 'w95-check';
        mark.textContent = '✓';
        name.appendChild(mark);
      }
      name.appendChild(document.createTextNode(item.label));
      btn.appendChild(name);
      if (item.shortcut) {
        const sc = document.createElement('span');
        sc.className = 'w95-sc';
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
    let left = a.x;
    let top = a.bottom;
    if (left + pw > this.root.clientWidth - 4) left = Math.max(4, this.root.clientWidth - pw - 4);
    if (top + ph > this.root.clientHeight - BAR - 4) top = Math.max(4, a.y - ph);
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    return pop;
  }

  async openWindowMenu(win, menuLabel, itemLabel, signal) {
    this.focusWindow(win);
    this.closePopups();
    const btn = win.menuBar?.querySelector(`[data-menu="${CSS.escape(menuLabel)}"]`);
    const menu = win.menus.find((item) => item.label === menuLabel);
    if (!btn || !menu) throw new Error(`Missing menu ${menuLabel}`);
    await this.click(btn, {}, signal);
    btn.classList.add('lit');
    const pop = this._placePop(this._buildPop(menu.items), btn);
    const el = [...pop.querySelectorAll('.w95-mi')].find((node) => node.dataset.label === itemLabel);
    if (!el) throw new Error(`Missing menu item ${itemLabel}`);
    await this.moveToElement(el, 0.4, 0.5, null, signal);
    pop.querySelectorAll('.w95-mi').forEach((node) => node.classList.toggle('lit', node === el));
    this.sounds.menu();
    await this.wait(150, signal);
    btn.classList.remove('lit');
    this.closePopups();
  }

  showBoot() {
    this.hideFlying();
    this.hideSafe();
    this.hideScanDisk();
    this.boot.classList.add('on');
    this.setCursorVisible(false);
  }

  hideBoot() {
    this.boot.classList.remove('on');
  }

  showSafe() {
    this.safeLayer.classList.add('on');
    this.setCursorVisible(false);
  }

  hideSafe() {
    this.safeLayer.classList.remove('on');
  }

  showScanDisk() {
    this.scanLayer.classList.add('on');
    this.setCursorVisible(false);
  }

  hideScanDisk() {
    this.scanLayer.classList.remove('on');
  }

  showFlying() {
    this.flyLayer.classList.add('on');
    this.flyLayer.replaceChildren();
    this.stars = [];
    this.flags = [];
    for (let i = 0; i < 80; i += 1) {
      const el = document.createElement('i');
      el.className = 'w95-star';
      this.flyLayer.appendChild(el);
      this.stars.push({
        el,
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        phase: Math.random(),
      });
    }
    for (let i = 0; i < 6; i += 1) {
      const el = document.createElement('div');
      el.className = 'w95-flag';
      el.innerHTML = FLAG;
      this.flyLayer.appendChild(el);
      this.flags.push({
        el,
        x: Math.random() * 1.6 - 0.8,
        y: Math.random() * 1.4 - 0.7,
        phase: Math.random(),
      });
    }
  }

  tickFlying(t) {
    if (!this.stars) return;
    const w = this.flyLayer.clientWidth / 2;
    const h = this.flyLayer.clientHeight / 2;
    for (const star of this.stars) {
      const u = (t * 2.4 + star.phase) % 1;
      const k = 0.08 + u * u * 2.8;
      star.el.style.transform = `translate(${star.x * w * k}px, ${star.y * h * k}px) scale(${0.35 + u * 2.4})`;
      star.el.style.opacity = String(u < 0.08 ? u / 0.08 : Math.min(1, (1 - u) * 4));
    }
    for (const flag of this.flags) {
      const u = (t * 1.35 + flag.phase) % 1;
      const k = 0.06 + u * u * 1.7;
      const fade = u < 0.08 ? u / 0.08 : u > 0.9 ? (1 - u) / 0.1 : 1;
      flag.el.style.transform = `translate(${flag.x * w * k}px, ${flag.y * h * k}px) scale(${0.18 + u * u * 4.4})`;
      flag.el.style.opacity = String(fade);
    }
  }

  hideFlying() {
    this.flyLayer.classList.remove('on');
    this.flyLayer.replaceChildren();
    this.stars = null;
    this.flags = null;
  }

  resetDesk() {
    this.closePopups();
    this.closeAllWindows();
    this.hideFlying();
    this.hideSafe();
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.clockTimer);
    window.removeEventListener('resize', this._onResize);
    this.root.remove();
  }
}
