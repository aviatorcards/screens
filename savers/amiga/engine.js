import { DPAINT_MENUS, WORKBENCH_MENUS } from './apps.js';
import { glyph } from './icons.js';
import { WbSounds } from './sounds.js';

export class AbortSceneError extends Error {
  constructor() {
    super('Scene aborted');
    this.name = 'AbortSceneError';
  }
}

const BAR = 28;
const SCREEN_TITLE = 'Workbench Release.';

const CURSOR = `<svg width="17" height="23" viewBox="0 0 17 23" shape-rendering="crispEdges" aria-hidden="true">
  <polygon fill="#000" points="0,0 0,17 4,13 6,21 10,19 8,13 14,13"/>
  <polygon fill="#e10600" points="1,2 1,14 4,12 5,17 8,16 6,12 12,12"/>
</svg>`;

const ARM = `<svg viewBox="0 0 280 220" aria-hidden="true">
  <path fill="#fff" stroke="#000" stroke-width="6" stroke-linejoin="round" d="M0 118 H150 Q190 118 200 92 V168 Q186 210 140 210 H0 Z"/>
  <ellipse cx="188" cy="150" rx="78" ry="58" fill="#fff" stroke="#000" stroke-width="6"/>
  <ellipse cx="168" cy="86" rx="34" ry="22" transform="rotate(-28 168 86)" fill="#fff" stroke="#000" stroke-width="6"/>
</svg>`;

const FINGERS = `<svg viewBox="0 0 180 150" aria-hidden="true">
  <g fill="#fff" stroke="#000" stroke-width="6" stroke-linejoin="round">
    <rect x="8" y="18" width="34" height="92" rx="16"/>
    <rect x="46" y="8" width="32" height="100" rx="16"/>
    <rect x="82" y="20" width="30" height="92" rx="15"/>
    <rect x="116" y="36" width="28" height="78" rx="14"/>
  </g>
</svg>`;

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function clockText(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

export class WbEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.onStatus = options.onStatus || (() => {});
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.destroyed = false;
    this.sounds = new WbSounds();
    this.sounds.setMuted(options.muted !== false);
    this.windows = [];
    this.z = 2;
    this.activeKind = 'workbench';
    this.cursor = { x: 180, y: 160 };

    this.root = document.createElement('div');
    this.root.className = 'wb';
    this.root.style.background = '#0055aa';

    this.deskIcons = document.createElement('div');
    this.deskIcons.className = 'wb-deskicons';
    this._buildDesk();

    this.windowsEl = document.createElement('div');
    this.windowsEl.className = 'wb-windows';
    this.menuLayer = document.createElement('div');
    this.menuLayer.className = 'wb-menus';

    this.boingLayer = document.createElement('div');
    this.boingLayer.className = 'wb-boing';
    const floor = document.createElement('div');
    floor.className = 'wb-floor';
    const grid = document.createElement('div');
    grid.className = 'wb-floorgrid';
    floor.appendChild(grid);
    this.shadowEl = document.createElement('div');
    this.shadowEl.className = 'wb-shadow';
    this.ballEl = document.createElement('div');
    this.ballEl.className = 'wb-ball';
    const spin = document.createElement('div');
    spin.className = 'wb-ball-spin';
    this.ballSpin = spin;
    this.ballEl.appendChild(spin);
    this.boingLayer.append(floor, this.shadowEl, this.ballEl);

    this.boot = document.createElement('div');
    this.boot.className = 'wb-boot on';
    this.boot.style.cssText = 'display:block;position:absolute;inset:0;z-index:60;background:#fff;';
    this.drive = document.createElement('div');
    this.drive.className = 'wb-drive';
    const slot = document.createElement('i');
    slot.className = 'wb-slot';
    const led = document.createElement('i');
    led.className = 'wb-led';
    this.drive.append(slot, led);
    this.hand = document.createElement('div');
    this.hand.className = 'wb-hand';
    const arm = document.createElement('div');
    arm.className = 'wb-arm';
    arm.innerHTML = ARM;
    const fingers = document.createElement('div');
    fingers.className = 'wb-fingers';
    fingers.innerHTML = FINGERS;
    this.disk = document.createElement('div');
    this.disk.className = 'wb-disk';
    const shutter = document.createElement('i');
    const label = document.createElement('span');
    label.textContent = 'Workbench';
    const shine = document.createElement('b');
    this.disk.append(label, shutter, shine);
    this.hand.append(arm, this.disk, fingers);
    this.boot.append(this.drive, this.hand);

    this.guru = document.createElement('div');
    this.guru.className = 'wb-guru';
    const guruLead = document.createElement('p');
    guruLead.textContent = 'Software Failure.  Press left mouse button to continue.';
    const guruCode = document.createElement('p');
    guruCode.className = 'wb-guru-code';
    guruCode.textContent = 'Guru Meditation #80000005.00C0172A';
    this.guru.append(guruLead, guruCode);

    this.bar = document.createElement('div');
    this.bar.className = 'wb-bar';
    const depth = document.createElement('button');
    depth.type = 'button';
    depth.className = 'wb-sgadget';
    depth.setAttribute('aria-label', 'Screen depth');
    this.barFill = document.createElement('div');
    this.barFill.className = 'wb-bar-fill';
    this.barTitle = document.createElement('span');
    this.barTitle.className = 'wb-bar-title';
    this.barTitle.textContent = SCREEN_TITLE;
    this.barMenus = document.createElement('div');
    this.barMenus.className = 'wb-bar-menus';
    this.barFill.append(this.barTitle, this.barMenus);
    this.bar.append(depth, this.barFill);

    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'wb-cursor';
    this.cursorEl.innerHTML = CURSOR;

    this.root.append(
      this.deskIcons,
      this.windowsEl,
      this.bar,
      this.menuLayer,
      this.boingLayer,
      this.boot,
      this.guru,
      this.cursorEl,
    );
    container.appendChild(this.root);

    this.cursor.x = Math.max(80, container.clientWidth * 0.42);
    this.cursor.y = Math.max(80, container.clientHeight * 0.46);
    this._renderCursor();
    this._onResize = () => this.layout();
    window.addEventListener('resize', this._onResize);
    this.clockTimer = setInterval(() => this._tickClock(), 1000);
    this.stylesReady = this._loadCss();
  }

  _buildDesk() {
    const icons = [
      ['Workbench1.3', 'floppy', 18, 44],
      ['RAM Disk', 'ram', 18, 168],
      ['DeluxePaint', 'dpaint', 18, 292],
      ['Trashcan', 'trash', 18, 416],
    ];
    for (const [label, name, x, y] of icons) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wb-dicon';
      btn.dataset.label = label;
      btn.style.left = `${x}px`;
      btn.style.top = `${y}px`;
      const text = document.createElement('span');
      text.className = 'wb-label';
      text.textContent = label;
      btn.append(glyph(name), text);
      this.deskIcons.appendChild(btn);
    }
  }

  _loadCss() {
    const id = 'wb-css';
    const href = new URL('./wb.css?v=4', import.meta.url).href;
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

  clockString() {
    return clockText(new Date());
  }

  _tickClock() {
    if (this.paused || this.destroyed) return;
    const text = this.clockString();
    this.root.querySelectorAll('.wb-time').forEach((node) => {
      node.textContent = text;
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
    ring.className = 'wb-ring';
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
    const scope = el.closest('.wb-deskicons, .wb-icons') || el.parentElement;
    scope?.querySelectorAll('.selected').forEach((node) => node.classList.remove('selected'));
    el.classList.add('selected');
  }

  async doubleClick(el, signal) {
    if (!el) throw new Error('Missing double-click target');
    await this.moveToElement(el, 0.5, 0.35, null, signal);
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
      const caret = el.querySelector?.('.wb-caret');
      const node = document.createTextNode(ch);
      if (caret) el.insertBefore(node, caret);
      else el.appendChild(node);
      if (el.scrollHeight) el.scrollTop = el.scrollHeight;
      this.sounds.key();
      await this.wait(ch === '\n' ? 70 : ch === ' ' ? 28 : 40, signal);
    }
  }

  deskIcon(label) {
    return [...this.deskIcons.querySelectorAll('.wb-dicon')].find((node) => node.dataset.label === label);
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

  setBarTitle(text) {
    this.barTitle.textContent = text;
  }

  createWindow(cfg) {
    const { w: deskW, h: deskH } = this.deskSize();
    const scale = cfg.scale === false ? 1 : this.windowScale();
    let width = Math.round((cfg.width || 420) * scale);
    let height = Math.round((cfg.height || 280) * scale);
    let x = cfg.x ?? 148;
    let y = cfg.y ?? 46;
    const top = BAR + 4;
    width = Math.min(width, Math.max(180, deskW - 16));
    height = Math.min(height, Math.max(120, deskH - top - 8));
    if (cfg.center) {
      x = Math.round((deskW - width) / 2);
      y = Math.round(top + (deskH - top - height) / 2);
    }
    x = Math.max(4, Math.min(x, Math.max(4, deskW - width - 4)));
    y = Math.max(top, Math.min(y, Math.max(top, deskH - height - 4)));

    const el = document.createElement('div');
    el.className = 'wb-win';
    el.dataset.kind = cfg.kind || 'window';
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    const title = document.createElement('div');
    title.className = 'wb-title';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'wb-close';
    close.setAttribute('aria-label', 'Close');
    const titleEl = document.createElement('span');
    titleEl.className = 'wb-title-text';
    titleEl.textContent = cfg.title || 'Window';
    const depths = document.createElement('span');
    depths.className = 'wb-depths';
    const front = document.createElement('button');
    front.type = 'button';
    front.className = 'wb-depth';
    front.setAttribute('aria-label', 'Front');
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'wb-depth';
    back.setAttribute('aria-label', 'Back');
    depths.append(front, back);
    title.append(close, titleEl, depths);

    const client = document.createElement('div');
    client.className = `wb-client${cfg.clientClass ? ` ${cfg.clientClass}` : ''}`;
    if (cfg.node) client.appendChild(cfg.node);

    const size = document.createElement('button');
    size.type = 'button';
    size.className = 'wb-size';
    size.setAttribute('aria-label', 'Size');
    size.appendChild(document.createElement('i'));

    el.append(title, client, size);

    const win = {
      el,
      titleEl,
      closeEl: close,
      clientEl: client,
      kind: cfg.kind || 'window',
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
  }

  focusWindow(win) {
    if (!win || !this.windows.includes(win)) return;
    for (const other of this.windows) other.el.classList.remove('active');
    win.el.classList.add('active');
    this.z += 1;
    win.el.style.zIndex = String(this.z);
    this.windowsEl.appendChild(win.el);
    this.activeKind = win.kind || 'workbench';
  }

  closeWindow(win) {
    if (!win) return;
    win.el.remove();
    this.windows = this.windows.filter((item) => item !== win);
    const top = this.windows[this.windows.length - 1];
    if (top) this.focusWindow(top);
    else {
      this.activeKind = 'workbench';
      this.setBarTitle(SCREEN_TITLE);
    }
  }

  closeAllWindows() {
    for (const win of [...this.windows]) win.el.remove();
    this.windows = [];
    this.activeKind = 'workbench';
    this.setBarTitle('Workbench Screen');
  }

  layout() {
    const { w, h } = this.deskSize();
    const top = BAR + 4;
    for (const win of this.windows) {
      const maxX = w - win.el.offsetWidth - 4;
      const maxY = h - win.el.offsetHeight - 4;
      win.el.style.left = `${Math.max(4, Math.min(win.el.offsetLeft, maxX))}px`;
      win.el.style.top = `${Math.max(top, Math.min(win.el.offsetTop, maxY))}px`;
    }
  }

  closePopups() {
    this.menuLayer.replaceChildren();
    this.bar.classList.remove('menu');
    this.barMenus.replaceChildren();
    this.root.querySelectorAll('.lit').forEach((node) => node.classList.remove('lit'));
  }

  _buildPop(items) {
    const pop = document.createElement('div');
    pop.className = 'wb-pop';
    for (const item of items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = item.ghost ? 'wb-mi ghost' : 'wb-mi';
      btn.dataset.label = item.label;
      btn.textContent = item.label;
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
    if (top + ph > this.root.clientHeight - 4) top = Math.max(BAR + 2, a.y - ph);
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    return pop;
  }

  async openScreenMenu(menuLabel, itemLabel, signal) {
    this.closePopups();
    const set = this.activeKind === 'dpaint' ? DPAINT_MENUS : WORKBENCH_MENUS;
    this.bar.classList.add('menu');
    this.barMenus.replaceChildren();
    try {
      for (const menu of set) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wb-bar-menu';
        btn.dataset.menu = menu.label;
        btn.textContent = menu.label;
        this.barMenus.appendChild(btn);
      }
      const btn = [...this.barMenus.children].find((node) => node.dataset.menu === menuLabel);
      const menu = set.find((item) => item.label === menuLabel);
      if (!btn || !menu) throw new Error(`Missing menu ${menuLabel}`);
      await this.moveToElement(btn, 0.45, 0.5, null, signal);
      btn.classList.add('lit');
      this.sounds.menu();
      await this.wait(140, signal);
      const pop = this._placePop(this._buildPop(menu.items), btn);
      const el = [...pop.querySelectorAll('.wb-mi')].find((node) => node.dataset.label === itemLabel);
      if (!el) throw new Error(`Missing menu item ${itemLabel}`);
      await this.moveToElement(el, 0.35, 0.5, null, signal);
      pop.querySelectorAll('.wb-mi').forEach((node) => node.classList.toggle('lit', node === el));
      this.sounds.menu();
      await this.wait(1100, signal);
    } finally {
      this.closePopups();
    }
  }

  showBoot() {
    this.hideBoing();
    this.boot.classList.add('on');
    this.setCursorVisible(false);
    this.tickInsert(0);
  }

  hideBoot() {
    this.boot.classList.remove('on');
  }

  tickInsert(t) {
    const w = this.boot.clientWidth || this.root.clientWidth || 800;
    const driveLeft = this.drive.offsetLeft || Math.round(w * 0.62);
    const diskLeft = this.disk.offsetLeft || 250;
    const diskW = this.disk.offsetWidth || 108;
    const end = driveLeft + 48 - diskLeft - diskW;
    const start = end - Math.round(w * 0.46);
    const u = ease(Math.min(1, t));
    this.hand.style.left = `${Math.round(start + (end - start) * u)}px`;
    this.disk.style.opacity = t > 0.84 ? String(Math.max(0, 1 - (t - 0.84) / 0.16)) : '1';
  }

  showBoing() {
    this.boingLayer.classList.add('on');
    this.setCursorVisible(false);
    this.tickBoing(0);
  }

  tickBoing(t) {
    const hops = 5;
    const p = (t * hops) % 1;
    const height = Math.sin(p * Math.PI);
    const w = this.boingLayer.clientWidth || this.root.clientWidth || 800;
    const h = this.boingLayer.clientHeight || this.root.clientHeight || 600;
    const ball = 150;
    const floor = h * 0.78;
    const travel = h * 0.5;
    const x = w * (0.2 + 0.58 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2)));
    const squash = height < 0.14 ? 1.22 - height : 1;
    const stretch = height < 0.14 ? 0.74 + height : 1;
    const cy = floor - height * travel - ball * 0.5;
    this.ballEl.style.transform = `translate(${Math.round(x - ball / 2)}px, ${Math.round(cy)}px)`;
    this.ballSpin.style.transform = `scale(${squash}, ${stretch}) rotate(${Math.round(t * 280)}deg)`;
    const shade = 0.45 + (1 - height) * 0.7;
    this.shadowEl.style.transform = `translate(${Math.round(x - 70)}px, ${Math.round(floor - 16)}px) scale(${shade}, 0.4)`;
    this.shadowEl.style.opacity = String(0.2 + (1 - height) * 0.45);
  }

  hideBoing() {
    this.boingLayer.classList.remove('on');
  }

  showGuru() {
    this.guru.classList.add('on');
    this.setCursorVisible(false);
  }

  hideGuru() {
    this.guru.classList.remove('on');
  }

  resetDesk() {
    this.closePopups();
    this.closeAllWindows();
    this.hideBoing();
    this.hideGuru();
    this.hideBoot();
    this.deskIcons.querySelectorAll('.selected').forEach((node) => node.classList.remove('selected'));
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.clockTimer);
    window.removeEventListener('resize', this._onResize);
    this.root.remove();
  }
}
