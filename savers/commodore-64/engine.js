import { C64Sounds } from './sounds.js';

export class C64AbortError extends Error {
  constructor() {
    super('C64 scene aborted');
    this.name = 'C64AbortError';
  }
}

export const VIC_COLORS = [
  '#000000', // 0 black
  '#ffffff', // 1 white
  '#68372b', // 2 red
  '#70a4b2', // 3 cyan
  '#6f3d86', // 4 purple
  '#588d43', // 5 green
  '#352879', // 6 blue
  '#b8c76f', // 7 yellow
  '#6f4f25', // 8 orange
  '#433900', // 9 brown
  '#9a6759', // 10 light red
  '#444444', // 11 dark grey
  '#6c6c6c', // 12 grey
  '#9ad284', // 13 light green
  '#6c5eb5', // 14 light blue
  '#959595', // 15 light grey
];

export const GEOS_ICONS = {
  drive1541: `
    <svg viewBox="0 0 32 24" width="30" height="22">
      <rect x="2" y="4" width="28" height="16" fill="#d9d4c5" stroke="currentColor" stroke-width="2"/>
      <rect x="6" y="10" width="16" height="3" fill="currentColor"/>
      <rect x="11" y="8" width="6" height="7" fill="currentColor"/>
      <circle cx="25.5" cy="14" r="2" fill="#d93829"/>
    </svg>
  `,
  printer: `
    <svg viewBox="0 0 32 24" width="30" height="22">
      <rect x="7" y="2" width="18" height="8" fill="#fff" stroke="currentColor" stroke-width="1.8"/>
      <rect x="3" y="9" width="26" height="12" fill="currentColor" opacity="0.18"/>
      <rect x="3" y="9" width="26" height="12" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="9" y1="5" x2="22" y2="5" stroke="currentColor" stroke-width="1.3"/>
      <line x1="9" y1="15" x2="23" y2="15" stroke="currentColor" stroke-width="1.8"/>
    </svg>
  `,
  trash: `
    <svg viewBox="0 0 28 28" width="24" height="24">
      <rect x="5" y="6" width="18" height="3" fill="currentColor"/>
      <rect x="10" y="3" width="8" height="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <path d="M7 9 H21 L19.5 25 H8.5 Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="11" y1="12" x2="11.5" y2="22" stroke="currentColor" stroke-width="1.6"/>
      <line x1="14" y1="12" x2="14" y2="22" stroke="currentColor" stroke-width="1.6"/>
      <line x1="17" y1="12" x2="16.5" y2="22" stroke="currentColor" stroke-width="1.6"/>
    </svg>
  `,
  geoWrite: `
    <svg viewBox="0 0 28 24" width="24" height="20">
      <rect x="4" y="2" width="16" height="20" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <line x1="7" y1="7" x2="17" y2="7" stroke="currentColor" stroke-width="1.6"/>
      <line x1="7" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="1.6"/>
      <line x1="7" y1="15" x2="14" y2="15" stroke="currentColor" stroke-width="1.6"/>
      <path d="M18 17 L25 9 L27 11 L20 19 L17 20 Z" fill="currentColor"/>
    </svg>
  `,
  geoPaint: `
    <svg viewBox="0 0 28 24" width="24" height="20">
      <rect x="3" y="3" width="22" height="18" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <path d="M5 17 L11 10 L16 15 L20 11 L23 17 Z" fill="currentColor" opacity="0.4"/>
      <circle cx="9" cy="8" r="2.2" fill="currentColor"/>
    </svg>
  `,
  doc: `
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path d="M5 3 H15 L19 7 V21 H5 Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <path d="M15 3 V7 H19" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="1.5"/>
      <line x1="8" y1="15" x2="15" y2="15" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  `,
  program: `
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect x="3" y="4" width="18" height="16" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <path d="M7 10 L10 12.5 L7 15" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <line x1="12" y1="15" x2="17" y2="15" stroke="currentColor" stroke-width="1.8"/>
    </svg>
  `,
  cursor: `
    <svg viewBox="0 0 18 22" width="16" height="20">
      <path d="M1 1 L1 17 L5 13.5 L8 19.5 L10.6 18.2 L7.6 12.2 L13 12.2 Z" fill="#111" stroke="#fff" stroke-width="1.6"/>
    </svg>
  `,
};

const GEOS_MENUS = {
  geos: [
    { label: 'deskTop info' },
    { divider: true },
    { label: 'alarm clock' },
    { label: 'calculator' },
    { label: 'note pad' },
    { label: 'preference mgr' },
  ],
  file: [
    { label: 'open' },
    { label: 'duplicate' },
    { label: 'rename' },
    { label: 'info' },
    { divider: true },
    { label: 'delete' },
  ],
  view: [
    { label: 'by icon' },
    { label: 'by name' },
    { label: 'by date' },
    { label: 'by size' },
  ],
  disk: [
    { label: 'open' },
    { label: 'validate' },
    { label: 'copy disk' },
    { label: 'rename' },
  ],
  special: [
    { label: 'BASIC' },
    { label: 'reset' },
  ],
  options: [
    { label: 'select printer' },
    { label: 'select input' },
  ],
};

export class C64Engine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});

    this.sounds = new C64Sounds();
    this.sounds.setMuted(options.muted ?? true);

    this.mode = 'basic';
    this.basicLines = [];
    this.geosTheme = 'default';
    this.geosPage = 0;
    this.geosWindows = new Map();
    this.zCounter = 160;
    this.cursor = { x: 220, y: 150 };
    this.destroyed = false;
    this.clockInterval = null;

    this.diskPages = [
      [
        { id: 'geowrite', name: 'geoWrite 2.1', icon: GEOS_ICONS.geoWrite },
        { id: 'geopaint', name: 'geoPaint', icon: GEOS_ICONS.geoPaint },
        { id: 'notes86', name: "Notes '86", icon: GEOS_ICONS.doc },
        { id: 'readme', name: 'READ ME', icon: GEOS_ICONS.doc },
        { id: 'tenprint', name: '10PRINT', icon: GEOS_ICONS.program },
        { id: 'balloon', name: 'BALLOON', icon: GEOS_ICONS.program },
        { id: 'sidtune', name: 'SIDTUNE', icon: GEOS_ICONS.program },
        { id: 'scratch', name: 'SCRATCH.TMP', icon: GEOS_ICONS.doc },
      ],
      [
        { id: 'letter', name: 'Letter.gw', icon: GEOS_ICONS.doc },
        { id: 'sprites', name: 'SPRITE.ED', icon: GEOS_ICONS.program },
        { id: 'photo', name: 'Photo Album', icon: GEOS_ICONS.geoPaint },
        { id: 'backup', name: 'BAK.SEQ', icon: GEOS_ICONS.doc },
      ],
    ];

    this._buildShell();
    this._startClock();
  }

  _buildShell() {
    this.root = document.createElement('div');
    this.root.className = 'c64-root';
    this.root.innerHTML = `
      <div class="c64-screen" id="c64-screen">
        <!-- Mode 1: BASIC V2 Terminal -->
        <div class="c64-basic-layer" id="c64-basic-layer">
          <div class="c64-basic-lines" id="c64-basic-lines"></div>
        </div>

        <!-- VIC-II 320x200 Graphics / Demo Canvas -->
        <canvas class="c64-gfx-canvas" id="c64-gfx-canvas" width="320" height="200"></canvas>

        <!-- Mode 2: GEOS 2.0 deskTop -->
        <div class="c64-geos-layer" id="c64-geos-layer">
          <header class="geos-menubar">
            <div class="geos-menu-left" id="geos-menus"></div>
            <div class="geos-menu-right">
              <div class="geos-clock" id="geos-clock">--:--</div>
            </div>
          </header>
          <div class="geos-workspace" id="geos-workspace">
            <section class="geos-diskpad" id="geos-diskpad">
              <div class="geos-pad-head">
                <span>deskTop 2.0 — WORK DISK 86</span>
                <span id="geos-page-lbl">Page 1</span>
              </div>
              <div class="geos-pad-info">
                <span id="geos-pad-count">8 files on Drive A:</span>
                <span>170K · 412 blocks free</span>
              </div>
              <div class="geos-pad-grid" id="geos-pad-grid"></div>
            </section>

            <div class="geos-desk-icons">
              <div class="geos-desk-group">
                <div class="geos-icon" data-geos-desk="drive">
                  <div class="geos-icon-box">${GEOS_ICONS.drive1541}</div>
                  <div class="geos-icon-label">Drive A: 1541</div>
                </div>
                <div class="geos-icon" data-geos-desk="printer">
                  <div class="geos-icon-box">${GEOS_ICONS.printer}</div>
                  <div class="geos-icon-label">MPS-803</div>
                </div>
              </div>
              <div class="geos-desk-group">
                <div class="geos-icon" data-geos-desk="trash">
                  <div class="geos-icon-box">${GEOS_ICONS.trash}</div>
                  <div class="geos-icon-label">Trash</div>
                </div>
              </div>
            </div>

            <div class="geos-windows" id="geos-windows"></div>
            <div class="geos-cursor" id="geos-cursor">${GEOS_ICONS.cursor}</div>
          </div>
        </div>
      </div>

      <div class="c64-drive-hud" id="c64-drive-hud">
        <span class="c64-drive-led"></span>
        <span id="c64-drive-text">1541 DRIVE 8</span>
      </div>
    `;

    this.container.appendChild(this.root);

    this.screenEl = this.root.querySelector('#c64-screen');
    this.basicLayerEl = this.root.querySelector('#c64-basic-layer');
    this.basicLinesEl = this.root.querySelector('#c64-basic-lines');
    this.gfxCanvas = this.root.querySelector('#c64-gfx-canvas');
    this.gfxCtx = this.gfxCanvas.getContext('2d');
    this.geosLayerEl = this.root.querySelector('#c64-geos-layer');
    this.geosMenusEl = this.root.querySelector('#geos-menus');
    this.geosClockEl = this.root.querySelector('#geos-clock');
    this.geosWorkspaceEl = this.root.querySelector('#geos-workspace');
    this.geosPadGridEl = this.root.querySelector('#geos-pad-grid');
    this.geosPageLblEl = this.root.querySelector('#geos-page-lbl');
    this.geosPadCountEl = this.root.querySelector('#geos-pad-count');
    this.geosWindowsEl = this.root.querySelector('#geos-windows');
    this.geosCursorEl = this.root.querySelector('#geos-cursor');
    this.driveHudEl = this.root.querySelector('#c64-drive-hud');
    this.driveTextEl = this.root.querySelector('#c64-drive-text');

    this._buildGeosMenus();
    this.renderGeosDiskPage(0);
    this._renderCursor();
  }

  _buildGeosMenus() {
    this.geosMenusEl.innerHTML = '';
    for (const key of ['geos', 'file', 'view', 'disk', 'special', 'options']) {
      const el = document.createElement('div');
      el.className = 'geos-menu-item';
      el.dataset.geosMenu = key;
      el.textContent = key;
      this.geosMenusEl.appendChild(el);
    }
  }

  _startClock() {
    const tick = () => {
      const now = new Date();
      let hrs = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12 || 12;
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      this.geosClockEl.textContent = `${days[now.getDay()]} ${hrs}:${mins} ${ampm}`;
    };
    tick();
    this.clockInterval = setInterval(tick, 1000);
  }

  getDynamicDateInfo() {
    const now = new Date();
    return {
      now,
      weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
      shortDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      timeStr: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
  }

  /* =================================================================
     Timing & Controls
     ================================================================= */
  setSpeed(speed) {
    this.speed = speed;
  }

  setPaused(paused) {
    this.paused = paused;
  }

  setMuted(muted) {
    this.sounds.setMuted(muted);
  }

  _checkSignal(signal) {
    if (this.destroyed || signal?.aborted) {
      throw new C64AbortError();
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

  /* =================================================================
     VIC-II Colors & 1541 Floppy Drive HUD
     ================================================================= */
  setColors(borderIdx = 14, bgIdx = 6, fgIdx = 14) {
    this.root.style.setProperty('--c64-border', VIC_COLORS[borderIdx] || VIC_COLORS[14]);
    this.root.style.setProperty('--c64-bg', VIC_COLORS[bgIdx] || VIC_COLORS[6]);
    this.root.style.setProperty('--c64-fg', VIC_COLORS[fgIdx] || VIC_COLORS[14]);
  }

  setRasterBorder(enabled) {
    this.root.classList.toggle('raster-border', Boolean(enabled));
  }

  setDriveActivity(visible, active = false, text = '1541 DRIVE 8') {
    this.driveTextEl.textContent = text;
    this.driveHudEl.classList.toggle('visible', Boolean(visible));
    this.driveHudEl.classList.toggle('active', Boolean(active));
  }

  showGfxCanvas(visible) {
    this.gfxCanvas.classList.toggle('visible', Boolean(visible));
  }

  /* =================================================================
     BASIC V2 Terminal Primitives
     ================================================================= */
  showBasicMode() {
    this.mode = 'basic';
    this.geosLayerEl.classList.remove('visible');
    this.showGfxCanvas(false);
    this.setRasterBorder(false);
    this.basicLayerEl.style.display = 'flex';
  }

  clearBasic() {
    this.basicLines = [];
    this._renderBasic();
  }

  printLine(text = '') {
    this.basicLines.push(text);
    if (this.basicLines.length > 22) {
      this.basicLines = this.basicLines.slice(-22);
    }
    this._renderBasic();
  }

  _renderBasic(typingLine = null) {
    const html = this.basicLines
      .map((line) => `<div class="c64-basic-line">${this._esc(line)}</div>`)
      .join('');
    const active =
      typingLine !== null
        ? `<div class="c64-basic-line">${this._esc(typingLine)}<span class="c64-basic-cursor"></span></div>`
        : `<div class="c64-basic-line"><span class="c64-basic-cursor"></span></div>`;
    this.basicLinesEl.innerHTML = html + active;
  }

  _esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  async resetBasicScreen(signal) {
    this.showBasicMode();
    this.setColors(14, 6, 14);
    this.clearBasic();
    this.sounds.powerThump();
    await this.wait(280, signal);
    this.printLine('');
    this.printLine('    **** COMMODORE 64 BASIC V2 ****');
    this.printLine('');
    this.printLine(' 64K RAM SYSTEM  38911 BASIC BYTES FREE');
    this.printLine('');
    this.printLine('READY.');
    await this.wait(650, signal);
  }

  async typeBasicCommand(cmd, signal, delay = 62) {
    let buf = '';
    this._renderBasic(buf);
    for (let i = 0; i < cmd.length; i++) {
      buf += cmd[i];
      this._renderBasic(buf);
      if (cmd[i] !== ' ') this.sounds.keyClack();
      await this.wait(delay + Math.random() * 42, signal);
    }
    await this.wait(240, signal);
    this.sounds.keyClack();
    this.printLine(buf);
  }

  async run1541Load(filename, suffix = ',8', signal = null, missing = false) {
    await this.typeBasicCommand(`LOAD "${filename}"${suffix}`, signal);
    this.printLine('');
    this.printLine(`SEARCHING FOR ${filename}`);
    this.setDriveActivity(true, true, `1541 DRIVE 8 · ${filename}`);
    await this.strobeBorder(8, signal);
    if (missing) {
      this.setDriveActivity(false, false);
      this.printLine('?FILE NOT FOUND ERROR');
      this.printLine('READY.');
      await this.wait(420, signal);
      return;
    }
    this.printLine('LOADING');
    await this.strobeBorder(16, signal);
    this.setDriveActivity(true, false, '1541 DRIVE 8 · READY');
    this.printLine('READY.');
    await this.wait(420, signal);
    this.setDriveActivity(false, false);
  }

  /** Kernal disk load flickers the border between the screen color and black. */
  async strobeBorder(ticks, signal) {
    const painted = this.root.style.getPropertyValue('--c64-border') || VIC_COLORS[14];
    try {
      for (let i = 0; i < ticks; i++) {
        this.root.style.setProperty('--c64-border', i % 2 ? painted : '#000000');
        this.sounds.driveStep();
        await this.wait(80, signal);
      }
    } finally {
      this.root.style.setProperty('--c64-border', painted);
    }
  }

  /* =================================================================
     GEOS 2.0 deskTop Primitives
     ================================================================= */
  setGeosTheme(theme) {
    this.geosTheme = theme;
    this.geosLayerEl.classList.remove('theme-blue', 'theme-green', 'theme-amber');
    if (theme === 'blue') this.geosLayerEl.classList.add('theme-blue');
    else if (theme === 'green') this.geosLayerEl.classList.add('theme-green');
    else if (theme === 'amber') this.geosLayerEl.classList.add('theme-amber');
  }

  renderGeosDiskPage(pageIdx = 0) {
    this.geosPage = ((pageIdx % this.diskPages.length) + this.diskPages.length) % this.diskPages.length;
    const files = this.diskPages[this.geosPage];
    this.geosPageLblEl.textContent = `Page ${this.geosPage + 1} of ${this.diskPages.length}`;
    this.geosPadCountEl.textContent = `${files.length} files on Drive A:`;
    this.geosPadGridEl.innerHTML =
      files
        .map(
          (f) => `
        <div class="geos-file-item" data-geos-file="${f.id}">
          <div class="geos-file-glyph">${f.icon}</div>
          <div class="geos-file-name">${f.name}</div>
        </div>`,
        )
        .join('') + `<div class="geos-page-flip" id="geos-page-flip">P${this.geosPage + 1}</div>`;
  }

  getGeosFileEl(id) {
    return this.geosPadGridEl.querySelector(`[data-geos-file="${id}"]`);
  }

  selectGeosFile(id) {
    this.geosPadGridEl.querySelectorAll('.geos-file-item').forEach((el) => {
      el.classList.toggle('selected', el.dataset.geosFile === id);
    });
  }

  getGeosDeskEl(name) {
    return this.geosWorkspaceEl.querySelector(`[data-geos-desk="${name}"]`);
  }

  async enterGeos(withBoot = true, signal = null) {
    this.mode = 'geos';
    this.showGfxCanvas(false);
    this.setRasterBorder(false);
    this.setColors(11, 0, 14);
    this.geosLayerEl.classList.add('visible');

    if (withBoot) {
      const splash = document.createElement('div');
      splash.className = 'geos-boot-splash';
      splash.innerHTML = `
        <div class="geos-boot-box">
          <div class="geos-boot-logo">GEOS 2.0</div>
          <div class="geos-boot-sub">GRAPHIC ENVIRONMENT OPERATING SYSTEM · BERKELEY SOFTWORKS</div>
          <div class="geos-boot-bar"><div class="geos-boot-fill" id="geos-boot-fill"></div></div>
          <div style="font-size:11px;color:#9ad284;" id="geos-boot-msg">LOADING DESKTOP 2.0 FROM DRIVE A: 1541…</div>
        </div>
      `;
      this.geosLayerEl.appendChild(splash);
      const fill = splash.querySelector('#geos-boot-fill');
      const msg = splash.querySelector('#geos-boot-msg');
      this.setDriveActivity(true, true, '1541 DRIVE 8 · GEOS 2.0');

      try {
        const stages = [
          [24, 'INITIALIZING VIC-II BITMAP DRIVER…'],
          [52, 'LOADING 1541 TURBO KERNAL…'],
          [78, 'MOUNTING WORK DISK 86…'],
          [100, 'STARTING GEOS DESKTOP…'],
        ];
        for (const [pct, text] of stages) {
          fill.style.width = `${pct}%`;
          msg.textContent = text;
          this.sounds.driveStep();
          await this.wait(420, signal);
        }
        await this.wait(300, signal);
      } finally {
        this.setDriveActivity(false, false);
        splash.remove();
      }
    }

    this.setColors(14, 6, 14);
    this.renderGeosDiskPage(0);
  }

  exitGeosToBasic() {
    this.clearGeosWindows();
    this.cleanupGeosMenus();
    this.showBasicMode();
  }

  _renderCursor() {
    this.geosCursorEl.style.transform = `translate3d(${Math.round(this.cursor.x)}px, ${Math.round(this.cursor.y)}px, 0)`;
  }

  _getWorkspacePoint(el, rx = 0.5, ry = 0.5) {
    const wsRect = this.geosWorkspaceEl.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - wsRect.left + r.width * rx,
      y: r.top - wsRect.top + r.height * ry,
    };
  }

  async moveTo(targetX, targetY, durationMs = null, signal = null) {
    this._checkSignal(signal);
    const sx = this.cursor.x;
    const sy = this.cursor.y;
    const dx = targetX - sx;
    const dy = targetY - sy;
    const dist = Math.hypot(dx, dy);
    if (dist < 2) {
      this.cursor.x = targetX;
      this.cursor.y = targetY;
      this._renderCursor();
      return;
    }

    const dur = durationMs ?? Math.max(240, Math.min(820, 190 + dist * 0.95));
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arc = (Math.random() > 0.5 ? 1 : -1) * Math.min(34, dist * 0.14);
    const cx1 = sx + dx * 0.34 + perpX * arc;
    const cy1 = sy + dy * 0.34 + perpY * arc;
    const cx2 = sx + dx * 0.7 + perpX * (arc * 0.45);
    const cy2 = sy + dy * 0.7 + perpY * (arc * 0.45);

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
      this.cursor.x = u * u * u * sx + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * targetX;
      this.cursor.y = u * u * u * sy + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * targetY;
      this._renderCursor();
    }
    this.cursor.x = targetX;
    this.cursor.y = targetY;
    this._renderCursor();
  }

  async moveToElement(el, rx = 0.5, ry = 0.5, durationMs = null, signal = null) {
    const pt = this._getWorkspacePoint(el, rx, ry);
    await this.moveTo(pt.x, pt.y, durationMs, signal);
    return pt;
  }

  async click(el = null, opts = {}, signal = null) {
    if (el) await this.moveToElement(el, opts.rx ?? 0.5, opts.ry ?? 0.5, opts.duration ?? null, signal);
    this.sounds.geosClick();
    if (el && opts.pressClass) el.classList.add(opts.pressClass);
    await this.wait(110, signal);
    if (el && opts.pressClass) el.classList.remove(opts.pressClass);
    await this.wait(opts.afterMs ?? 120, signal);
  }

  async doubleClick(el, signal = null) {
    await this.moveToElement(el, 0.5, 0.45, null, signal);
    this.sounds.geosClick();
    await this.wait(95, signal);
    this.sounds.geosClick();
    await this.wait(140, signal);
  }

  async drag(fromEl, toEl, labelText, signal = null) {
    await this.moveToElement(fromEl, 0.5, 0.5, null, signal);
    this.sounds.geosClick();
    await this.wait(110, signal);

    const ghost = document.createElement('div');
    ghost.className = 'geos-drag-ghost';
    ghost.textContent = labelText;
    this.geosWorkspaceEl.appendChild(ghost);

    const sx = this.cursor.x;
    const sy = this.cursor.y;
    const endPt = this._getWorkspacePoint(toEl, 0.5, 0.45);
    const dur = 640;
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
      await this.wait(140, signal);
      this.sounds.geosClick();
    } finally {
      toEl.classList.remove('drop-target');
      ghost.remove();
    }
  }

  cleanupGeosMenus() {
    this.geosMenusEl.querySelectorAll('.geos-dropdown').forEach((d) => d.remove());
    this.geosMenusEl.querySelectorAll('.geos-menu-item.open').forEach((m) => m.classList.remove('open'));
  }

  async openGeosMenu(menuKey, itemLabel, signal = null) {
    const trigger = this.geosMenusEl.querySelector(`[data-geos-menu="${menuKey}"]`);
    if (!trigger) return;

    await this.click(trigger, { afterMs: 80 }, signal);
    const items = GEOS_MENUS[menuKey] || [];

    const dd = document.createElement('div');
    dd.className = 'geos-dropdown';
    const rows = [];
    for (const item of items) {
      if (item.divider) {
        const div = document.createElement('div');
        div.className = 'geos-dropdown-divider';
        dd.appendChild(div);
      } else {
        const row = document.createElement('div');
        row.className = 'geos-dropdown-item';
        row.textContent = item.label;
        dd.appendChild(row);
        rows.push({ label: item.label, el: row });
      }
    }

    trigger.classList.add('open');
    trigger.appendChild(dd);
    try {
      await this.wait(220, signal);
      const target = rows.find((r) => r.label === itemLabel) || rows[0];
      if (target) {
        await this.moveToElement(target.el, 0.45, 0.5, 340, signal);
        target.el.classList.add('active');
        this.sounds.geosClick();
        await this.wait(280, signal);
        target.el.classList.add('blink');
        await this.wait(260, signal);
      }
    } finally {
      trigger.classList.remove('open');
      dd.remove();
    }
  }

  async typeGeosText(el, text, opts = {}, signal = null) {
    const delay = opts.delay ?? 50;
    let buf = opts.append ? el.dataset.raw || '' : '';
    const render = (caret = true) => {
      el.dataset.raw = buf;
      const esc = this._esc(buf);
      el.innerHTML = caret ? `${esc}<span class="geowrite-caret"></span>` : esc;
    };
    render(true);
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      buf += ch;
      render(true);
      if (ch !== ' ') this.sounds.keyClack();
      let pause = delay + Math.random() * 38;
      if (ch === '.' || ch === '!' || ch === '?') pause += 200;
      else if (ch === '\n') pause += 220;
      await this.wait(pause, signal);
    }
    if (opts.removeCaretAtEnd) render(false);
  }

  createGeosWindow(cfg) {
    const wsRect = this.geosWorkspaceEl.getBoundingClientRect();
    const maxW = Math.max(320, wsRect.width - 28);
    const maxH = Math.max(240, wsRect.height - 24);
    const w = Math.min(cfg.width || 420, maxW);
    const h = cfg.height ? Math.min(cfg.height, maxH) : null;
    const x = Math.max(10, Math.min(cfg.x ?? 26, wsRect.width - w - 10));
    const y = Math.max(10, Math.min(cfg.y ?? 16, wsRect.height - (h || 220) - 10));

    const el = document.createElement('section');
    el.className = 'geos-win';
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${Math.round(w)}px`;
    if (h) el.style.height = `${Math.round(h)}px`;
    this.zCounter += 1;
    el.style.zIndex = String(this.zCounter);

    el.innerHTML = `
      <div class="geos-win-bar">
        ${cfg.closable !== false ? '<div class="geos-win-close">✕</div>' : '<span></span>'}
        <div class="geos-win-title">${cfg.title}</div>
        <span style="width:13px"></span>
      </div>
      <div class="geos-win-body">${cfg.content || ''}</div>
    `;

    this.geosWindowsEl.appendChild(el);
    const win = {
      id: cfg.id || `gwin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      el,
      bodyEl: el.querySelector('.geos-win-body'),
      closeBtn: el.querySelector('.geos-win-close'),
    };
    this.geosWindows.set(win.id, win);
    return win;
  }

  closeGeosWindow(win) {
    if (!win) return;
    win.el.remove();
    this.geosWindows.delete(win.id);
  }

  clearGeosWindows() {
    for (const w of [...this.geosWindows.values()]) {
      w.el.remove();
    }
    this.geosWindows.clear();
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.clockInterval);
    this.sounds.destroy();
    this.root.remove();
  }
}
