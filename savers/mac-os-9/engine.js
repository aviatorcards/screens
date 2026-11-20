import { ICONS, csSoundIcon } from './icons.js';
import { DESKTOP_PATTERNS, HIGHLIGHT_COLORS } from './wallpapers.js';
import { PlatinumSounds } from './sounds.js';

export class AbortSceneError extends Error {
  constructor() {
    super('Scene aborted');
    this.name = 'AbortSceneError';
  }
}

const APP_MENUS = {
  Finder: [
    {
      key: 'file',
      label: 'File',
      items: [
        { label: 'New Folder', shortcut: '⌘N' },
        { label: 'Open', shortcut: '⌘O' },
        { label: 'Print', shortcut: '⌘P', disabled: true },
        { divider: true },
        { label: 'Close Window', shortcut: '⌘W' },
        { label: 'Get Info', shortcut: '⌘I' },
        { label: 'Duplicate', shortcut: '⌘D' },
        { divider: true },
        { label: 'Move to Trash', shortcut: '⌘⌫' },
      ],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', disabled: true },
        { divider: true },
        { label: 'Cut', shortcut: '⌘X' },
        { label: 'Copy', shortcut: '⌘C' },
        { label: 'Paste', shortcut: '⌘V' },
        { label: 'Select All', shortcut: '⌘A' },
        { divider: true },
        { label: 'Preferences…' },
      ],
    },
    {
      key: 'view',
      label: 'View',
      items: [
        { label: 'as Icons' },
        { label: 'as Buttons' },
        { label: 'as List' },
        { divider: true },
        { label: 'Clean Up' },
        { label: 'Arrange by Name' },
        { label: 'View Options…' },
      ],
    },
    {
      key: 'special',
      label: 'Special',
      items: [
        { label: 'Empty Trash…' },
        { divider: true },
        { label: 'Eject', shortcut: '⌘E' },
        { label: 'Erase Disk…', disabled: true },
        { divider: true },
        { label: 'Sleep' },
        { label: 'Restart' },
        { label: 'Shut Down' },
      ],
    },
    {
      key: 'help',
      label: 'Help',
      items: [
        { label: 'Mac Help', shortcut: '⌘?' },
        { label: 'Show Balloons' },
        { label: 'About Mac OS 9.2' },
      ],
    },
  ],
  SimpleText: [
    {
      key: 'file',
      label: 'File',
      items: [
        { label: 'New', shortcut: '⌘N' },
        { label: 'Open…', shortcut: '⌘O' },
        { label: 'Close', shortcut: '⌘W' },
        { label: 'Save', shortcut: '⌘S' },
        { label: 'Save As…' },
        { divider: true },
        { label: 'Quit', shortcut: '⌘Q' },
      ],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z' },
        { divider: true },
        { label: 'Cut', shortcut: '⌘X' },
        { label: 'Copy', shortcut: '⌘C' },
        { label: 'Paste', shortcut: '⌘V' },
        { label: 'Select All', shortcut: '⌘A' },
      ],
    },
    {
      key: 'font',
      label: 'Font',
      items: [{ label: 'Charcoal' }, { label: 'Geneva' }, { label: 'Monaco' }, { label: 'Palatino' }],
    },
    {
      key: 'size',
      label: 'Size',
      items: [{ label: '9 Point' }, { label: '10 Point' }, { label: '12 Point' }, { label: '14 Point' }],
    },
    {
      key: 'style',
      label: 'Style',
      items: [{ label: 'Plain Text', shortcut: '⌘T' }, { label: 'Bold', shortcut: '⌘B' }, { label: 'Italic', shortcut: '⌘I' }],
    },
  ],
  'Netscape Communicator': [
    {
      key: 'file',
      label: 'File',
      items: [
        { label: 'New Navigator Window', shortcut: '⌘N' },
        { label: 'Open Page…', shortcut: '⌘O' },
        { label: 'Save As…', shortcut: '⌘S' },
        { divider: true },
        { label: 'Close', shortcut: '⌘W' },
      ],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [{ label: 'Copy', shortcut: '⌘C' }, { label: 'Find in Page…', shortcut: '⌘F' }, { label: 'Preferences…' }],
    },
    {
      key: 'view',
      label: 'View',
      items: [{ label: 'Reload', shortcut: '⌘R' }, { label: 'Page Source', shortcut: '⌘U' }, { label: 'Page Info' }],
    },
    {
      key: 'go',
      label: 'Go',
      items: [{ label: 'Back', shortcut: '⌘[' }, { label: 'Forward', shortcut: '⌘]' }, { label: 'Home' }],
    },
    {
      key: 'communicator',
      label: 'Communicator',
      items: [{ label: 'Navigator', shortcut: '⌘1' }, { label: 'Messenger', shortcut: '⌘2' }, { label: 'Bookmarks' }],
    },
  ],
  'Sherlock 2': [
    {
      key: 'file',
      label: 'File',
      items: [{ label: 'New Channel…' }, { label: 'Open Item', shortcut: '⌘O' }, { label: 'Close', shortcut: '⌘W' }],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [{ label: 'Cut', shortcut: '⌘X' }, { label: 'Copy', shortcut: '⌘C' }, { label: 'Paste', shortcut: '⌘V' }],
    },
    {
      key: 'find',
      label: 'Find',
      items: [{ label: 'Index Volumes…' }, { label: 'More Search Options…' }],
    },
    {
      key: 'channels',
      label: 'Channels',
      items: [{ label: 'Files' }, { label: 'Internet' }, { label: 'Apple' }, { label: 'News' }],
    },
  ],
  'AOL Instant Messenger': [
    {
      key: 'file',
      label: 'File',
      items: [{ label: 'Send Instant Message', shortcut: '⌘I' }, { label: 'Sign Off' }, { label: 'Close', shortcut: '⌘W' }],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [{ label: 'Copy', shortcut: '⌘C' }, { label: 'Paste', shortcut: '⌘V' }],
    },
    {
      key: 'people',
      label: 'People',
      items: [{ label: 'Get Member Info' }, { label: 'Add Buddy…' }, { label: 'Away Message' }],
    },
  ],
  'Outlook Express': [
    {
      key: 'file',
      label: 'File',
      items: [{ label: 'New Mail Message', shortcut: '⌘N' }, { label: 'Send & Receive All', shortcut: '⌘M' }, { label: 'Close', shortcut: '⌘W' }],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [{ label: 'Copy', shortcut: '⌘C' }, { label: 'Find…', shortcut: '⌘F' }],
    },
    {
      key: 'message',
      label: 'Message',
      items: [{ label: 'Reply', shortcut: '⌘R' }, { label: 'Forward', shortcut: '⌘J' }, { label: 'Mark as Read' }],
    },
  ],
  AppleWorks: [
    {
      key: 'file',
      label: 'File',
      items: [{ label: 'New…', shortcut: '⌘N' }, { label: 'Save', shortcut: '⌘S' }, { label: 'Close', shortcut: '⌘W' }],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Clear' }],
    },
    {
      key: 'transform',
      label: 'Transform',
      items: [{ label: 'Flip Horizontal' }, { label: 'Invert' }, { label: 'Fill' }],
    },
  ],
  Stickies: [
    {
      key: 'file',
      label: 'File',
      items: [{ label: 'New Note', shortcut: '⌘N' }, { label: 'Close Note', shortcut: '⌘W' }],
    },
    {
      key: 'color',
      label: 'Color',
      items: [{ label: 'Yellow' }, { label: 'Pink' }, { label: 'Blue' }, { label: 'Green' }],
    },
    {
      key: 'note',
      label: 'Note',
      items: [{ label: 'Text Style…' }, { label: 'Floating Window' }],
    },
  ],
  'QuickTime Player': [
    {
      key: 'file',
      label: 'File',
      items: [
        { label: 'New Player', shortcut: '⌘N' },
        { label: 'Open Movie…', shortcut: '⌘O' },
        { label: 'Close', shortcut: '⌘W' },
        { divider: true },
        { label: 'Quit', shortcut: '⌘Q' },
      ],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [{ label: 'Copy', shortcut: '⌘C' }, { label: 'Select All', shortcut: '⌘A' }],
    },
    {
      key: 'movie',
      label: 'Movie',
      items: [{ label: 'Play' }, { label: 'Loop' }, { label: 'Normal Size' }, { label: 'Double Size' }],
    },
  ],
  'SoundJam MP': [
    {
      key: 'file',
      label: 'File',
      items: [
        { label: 'New Playlist', shortcut: '⌘N' },
        { label: 'Open…', shortcut: '⌘O' },
        { label: 'Close', shortcut: '⌘W' },
        { divider: true },
        { label: 'Quit', shortcut: '⌘Q' },
      ],
    },
    {
      key: 'controls',
      label: 'Controls',
      items: [{ label: 'Play' }, { label: 'Next Track', shortcut: '⌘→' }, { label: 'Previous Track', shortcut: '⌘←' }],
    },
    {
      key: 'playlist',
      label: 'Playlist',
      items: [{ label: 'Add to Playlist…' }, { label: 'Shuffle' }, { label: 'Repeat' }],
    },
  ],
  'Disk First Aid': [
    {
      key: 'file',
      label: 'File',
      items: [{ label: 'Close', shortcut: '⌘W' }, { label: 'Quit', shortcut: '⌘Q' }],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [{ label: 'Copy', shortcut: '⌘C' }, { label: 'Select All', shortcut: '⌘A' }],
    },
    {
      key: 'disk',
      label: 'Disk',
      items: [{ label: 'Verify Disk' }, { label: 'Repair Disk' }],
    },
  ],
  Scrapbook: [
    {
      key: 'file',
      label: 'File',
      items: [{ label: 'Close', shortcut: '⌘W' }, { label: 'Quit', shortcut: '⌘Q' }],
    },
    {
      key: 'edit',
      label: 'Edit',
      items: [
        { label: 'Cut', shortcut: '⌘X' },
        { label: 'Copy', shortcut: '⌘C' },
        { label: 'Paste', shortcut: '⌘V' },
        { label: 'Clear' },
      ],
    },
  ],
};

const APPLE_MENU_ITEMS = [
  { label: 'About This Computer…' },
  { divider: true },
  { label: 'AppleWorks 6' },
  { label: 'Calculator' },
  { label: 'Control Panels ▶' },
  { label: 'Sherlock 2' },
  { label: 'SimpleText' },
  { label: 'Stickies' },
  { label: 'Scrapbook' },
  { divider: true },
  { label: 'Recent Applications ▶' },
];

export class MacOS9Engine {
  constructor(container, options = {}) {
    this.container = container;
    this.speed = options.speed || 1;
    this.paused = Boolean(options.paused);
    this.onStatus = options.onStatus || (() => {});

    this.sounds = new PlatinumSounds();
    this.sounds.setMuted(options.muted ?? true);

    this.zCounter = 60;
    this.windows = new Map();
    this.activeWindowId = null;
    this.activeApp = 'Finder';
    this.wallpaperIndex = 0;
    this.highlightIndex = 0;
    this.trashFull = false;
    this.controlStrip = {
      expanded: false,
      volume: 5,
      resolution: '1024 × 768',
      colorDepth: 'Millions',
      appleTalk: true,
      fileSharing: false,
      cdTrack: 'Track 2 — Platinum Afternoon',
      location: 'Home (56K)',
      energy: 'Better Performance',
    };

    this.cursor = { x: 260, y: 180, mode: 'arrow' };
    this.clockInterval = null;
    this.resizeHandler = () => this._layoutDesktopIcons();
    this.destroyed = false;

    this._buildShell();
    this._startClock();
    this.applyWallpaper(0);
    this.applyHighlight(0);
    window.addEventListener('resize', this.resizeHandler);
  }

  /* =================================================================
     DOM Construction
     ================================================================= */
  _buildShell() {
    this.root = document.createElement('div');
    this.root.className = 'os9-root';

    this.root.innerHTML = `
      <div class="os9-corner tl"></div>
      <div class="os9-corner tr"></div>

      <header class="os9-menubar">
        <div class="os9-menubar-left" id="os9-menus"></div>
        <div class="os9-menubar-right">
          <div class="os9-clock" id="os9-clock">--:--</div>
          <div class="os9-menubar-sep"></div>
          <div class="os9-app-switcher" id="os9-app-switcher"></div>
        </div>
      </header>

      <div class="os9-desktop" id="os9-desktop">
        <div class="os9-desktop-icons" id="os9-desktop-icons"></div>
        <div class="os9-windows" id="os9-windows"></div>

        <!-- Classic Bottom-Left Control Strip -->
        <div class="os9-control-strip collapsed" id="os9-control-strip">
          <div class="os9-cs-tray" id="os9-cs-tray">
            <div class="os9-cs-scroll" aria-hidden="true">◂</div>
            <div class="os9-cs-modules">
              <div class="os9-cs-btn" data-cs="sound" title="Sound Volume">${csSoundIcon(5)}</div>
              <div class="os9-cs-btn" data-cs="display" title="Monitor Resolution">${ICONS.csDisplay}</div>
              <div class="os9-cs-btn" data-cs="colors" title="Monitor Bit Depth">${ICONS.csColors}</div>
              <div class="os9-cs-btn" data-cs="appletalk" title="AppleTalk Switch">${ICONS.csAppleTalk}</div>
              <div class="os9-cs-btn status-off" data-cs="sharing" title="File Sharing">${ICONS.csSharing}</div>
              <div class="os9-cs-btn" data-cs="cd" title="CD Strip">${ICONS.csCd}</div>
              <div class="os9-cs-btn" data-cs="location" title="Location Manager">${ICONS.csLocation}</div>
              <div class="os9-cs-btn" data-cs="energy" title="Energy Saver">${ICONS.csEnergy}</div>
            </div>
            <div class="os9-cs-scroll" aria-hidden="true">▸</div>
          </div>
          <div class="os9-cs-tab" id="os9-cs-tab"><span class="os9-cs-grip"></span><span id="os9-cs-arrow">▸</span></div>
        </div>
      </div>

      <div class="os9-cursor" id="os9-cursor">${ICONS.cursorArrow}</div>
    `;

    this.container.appendChild(this.root);

    this.menusEl = this.root.querySelector('#os9-menus');
    this.clockEl = this.root.querySelector('#os9-clock');
    this.switcherEl = this.root.querySelector('#os9-app-switcher');
    this.desktopEl = this.root.querySelector('#os9-desktop');
    this.iconsEl = this.root.querySelector('#os9-desktop-icons');
    this.windowsEl = this.root.querySelector('#os9-windows');
    this.controlStripEl = this.root.querySelector('#os9-control-strip');
    this.controlStripTrayEl = this.root.querySelector('#os9-cs-tray');
    this.controlStripTabEl = this.root.querySelector('#os9-cs-tab');
    this.controlStripArrowEl = this.root.querySelector('#os9-cs-arrow');
    this.cursorEl = this.root.querySelector('#os9-cursor');

    this._createDesktopIcons();
    this.setActiveApp('Finder', ICONS.finderFace);
    this._renderCursor();
  }

  _createDesktopIcons() {
    this.desktopIcons = new Map();
    const defs = [
      { id: 'mac-hd', label: 'Macintosh HD', icon: ICONS.macHd, slot: 'top', order: 0 },
      { id: 'zip-100', label: 'Backup Zip 100', icon: ICONS.zipDisk, slot: 'top', order: 1 },
      { id: 'projects', label: "Projects '99", icon: ICONS.folder, slot: 'top', order: 2 },
      { id: 'readme', label: 'Read Me First', icon: ICONS.simpleTextDoc, slot: 'top', order: 3 },
      { id: 'trash', label: 'Trash', icon: ICONS.trashEmpty, slot: 'bottom', order: 0 },
    ];

    for (const def of defs) {
      const el = document.createElement('div');
      el.className = 'os9-icon';
      el.dataset.iconId = def.id;
      el.innerHTML = `
        <div class="os9-icon-graphic">${def.icon}</div>
        <div class="os9-icon-label">${def.label}</div>
      `;
      this.iconsEl.appendChild(el);
      this.desktopIcons.set(def.id, { ...def, el });
    }

    this._layoutDesktopIcons();
  }

  _layoutDesktopIcons() {
    const rect = this.desktopEl.getBoundingClientRect();
    const w = Math.max(rect.width, 640);
    const h = Math.max(rect.height, 420);
    const rightX = w - 96;

    for (const item of this.desktopIcons.values()) {
      if (item.slot === 'top') {
        item.el.style.left = `${rightX}px`;
        item.el.style.top = `${16 + item.order * 78}px`;
      } else {
        item.el.style.left = `${rightX}px`;
        item.el.style.top = `${Math.max(330, h - 82)}px`;
      }
    }
  }

  selectDesktopIcon(id) {
    for (const [key, item] of this.desktopIcons.entries()) {
      item.el.classList.toggle('selected', key === id);
    }
  }

  setTrashFull(full) {
    this.trashFull = full;
    const trash = this.desktopIcons.get('trash');
    if (trash) {
      trash.el.querySelector('.os9-icon-graphic').innerHTML = full ? ICONS.trashFull : ICONS.trashEmpty;
    }
  }

  /* =================================================================
     Clock & Dynamic Date Helpers
     ================================================================= */
  _startClock() {
    const tick = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let hrs = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12 || 12;
      this.clockEl.textContent = `${days[now.getDay()]} ${hrs}:${mins} ${ampm}`;
    };
    tick();
    this.clockInterval = setInterval(tick, 1000);
  }

  getDynamicDateInfo() {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    const shortWeekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    const monthLong = now.toLocaleDateString('en-US', { month: 'long' });
    const monthShort = now.toLocaleDateString('en-US', { month: 'short' });
    const day = now.getDate();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const fmtOffset = (minsAgo) => {
      const d = new Date(now.getTime() - minsAgo * 60000);
      const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      if (d.toDateString() === now.toDateString()) return `Today, ${t}`;
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      if (d.toDateString() === y.toDateString()) return `Yesterday, ${t}`;
      return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${t}`;
    };

    return {
      now,
      weekday,
      shortWeekday,
      monthLong,
      monthShort,
      day,
      timeStr,
      headerDate: `${weekday}, ${monthLong} ${day}`,
      shortDate: `${shortWeekday}, ${monthShort} ${day}`,
      fmtOffset,
    };
  }

  /* =================================================================
     Menu Bar & Themes
     ================================================================= */
  setActiveApp(appName, appIcon = ICONS.finderFace) {
    this.activeApp = appName;
    const menus = APP_MENUS[appName] || APP_MENUS.Finder;

    this.menusEl.innerHTML = '';

    const appleEl = document.createElement('div');
    appleEl.className = 'os9-menu-item apple-menu';
    appleEl.dataset.menuKey = 'apple';
    appleEl.innerHTML = ICONS.rainbowApple;
    this.menusEl.appendChild(appleEl);

    for (const m of menus) {
      const el = document.createElement('div');
      el.className = 'os9-menu-item';
      el.dataset.menuKey = m.key;
      el.textContent = m.label;
      this.menusEl.appendChild(el);
    }

    this.switcherEl.innerHTML = `${appIcon}<span>${appName}</span>`;
  }

  focusDesktop() {
    for (const w of this.windows.values()) {
      w.el.classList.add('inactive');
    }
    this.activeWindowId = null;
    this.setActiveApp('Finder', ICONS.finderFace);
  }

  applyWallpaper(index) {
    this.wallpaperIndex = ((index % DESKTOP_PATTERNS.length) + DESKTOP_PATTERNS.length) % DESKTOP_PATTERNS.length;
    const pat = DESKTOP_PATTERNS[this.wallpaperIndex];
    this.desktopEl.style.backgroundColor = pat.backgroundColor;
    this.desktopEl.style.backgroundImage = pat.backgroundImage;
    this.desktopEl.style.backgroundSize = pat.backgroundSize;
    return pat;
  }

  applyHighlight(index) {
    this.highlightIndex = ((index % HIGHLIGHT_COLORS.length) + HIGHLIGHT_COLORS.length) % HIGHLIGHT_COLORS.length;
    const hl = HIGHLIGHT_COLORS[this.highlightIndex];
    this.root.style.setProperty('--os9-highlight', hl.color);
    this.root.style.setProperty('--os9-highlight-text', hl.text);
    this.root.style.setProperty('--os9-highlight-soft', hl.soft);
    return hl;
  }

  toggleControlStrip(open) {
    const isCollapsed = open ? false : true;
    this.controlStrip.expanded = !isCollapsed;
    this.controlStripEl.classList.toggle('collapsed', isCollapsed);
    this.controlStripTrayEl.style.maxWidth = '';
    if (this.controlStripArrowEl) {
      this.controlStripArrowEl.textContent = isCollapsed ? '▸' : '◂';
    }
    this.sounds.click();
  }

  cleanupControlStripPopups() {
    this.controlStripEl.querySelectorAll('.os9-cs-popup, .os9-cs-vol-popup').forEach((el) => el.remove());
    this.controlStripEl.querySelectorAll('.os9-cs-btn.active').forEach((el) => el.classList.remove('active'));
    this.controlStripEl.classList.remove('dragging');
    this.controlStripTabEl.classList.remove('pressed');
    this.controlStripTrayEl.style.maxWidth = '';
  }

  updateControlStripIcons() {
    const soundBtn = this.controlStripEl.querySelector('[data-cs="sound"]');
    if (soundBtn) soundBtn.innerHTML = csSoundIcon(this.controlStrip.volume);

    const atBtn = this.controlStripEl.querySelector('[data-cs="appletalk"]');
    if (atBtn) atBtn.classList.toggle('status-off', !this.controlStrip.appleTalk);

    const shareBtn = this.controlStripEl.querySelector('[data-cs="sharing"]');
    if (shareBtn) shareBtn.classList.toggle('status-off', !this.controlStrip.fileSharing);
  }

  async expandControlStrip(signal, { drag = true } = {}) {
    if (this.controlStrip.expanded) return;

    await this.moveToElement(this.controlStripTabEl, 0.5, 0.5, null, signal);
    this.controlStripTabEl.classList.add('pressed');
    this.sounds.click();

    if (!drag) {
      await this.wait(110, signal);
      this.controlStripTabEl.classList.remove('pressed');
      this.toggleControlStrip(true);
      await this.wait(380, signal);
      return;
    }

    // Authentic Mac OS 9 Control Strip pull-out drag!
    const fullWidth = 282;
    const startX = this.cursor.x;
    const startY = this.cursor.y;
    const dur = 520;
    this.controlStripEl.classList.remove('collapsed');
    this.controlStripEl.classList.add('dragging');
    this.controlStripTrayEl.style.maxWidth = '0px';

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
        const curW = Math.round(fullWidth * t);
        this.controlStripTrayEl.style.maxWidth = `${curW}px`;
        this.cursor.x = startX + curW;
        this.cursor.y = startY + Math.sin(rawT * Math.PI) * 2;
        this._renderCursor();
      }
      this.controlStrip.expanded = true;
      if (this.controlStripArrowEl) this.controlStripArrowEl.textContent = '◂';
    } finally {
      this.controlStripEl.classList.remove('dragging');
      this.controlStripTabEl.classList.remove('pressed');
      this.controlStripTrayEl.style.maxWidth = '';
    }
    await this.wait(220, signal);
  }

  async collapseControlStrip(signal) {
    if (!this.controlStrip.expanded) return;
    await this.click(this.controlStripTabEl, { pressClass: 'pressed', afterMs: 80 }, signal);
    this.toggleControlStrip(false);
    await this.wait(360, signal);
  }

  async openControlStripPopup(moduleId, items, pickLabel, signal) {
    const btn = this.controlStripEl.querySelector(`[data-cs="${moduleId}"]`);
    if (!btn) return;

    await this.click(btn, { afterMs: 90 }, signal);
    btn.classList.add('active');

    const popup = document.createElement('div');
    popup.className = 'os9-cs-popup';
    const leftOffset = Math.max(4, btn.offsetLeft - 6);
    popup.style.left = `${leftOffset}px`;

    const rowEls = [];
    for (const item of items) {
      if (item.divider) {
        const div = document.createElement('div');
        div.className = 'os9-cs-popup-divider';
        popup.appendChild(div);
      } else {
        const row = document.createElement('div');
        row.className = `os9-cs-popup-item${item.checked ? ' checked' : ''}`;
        row.textContent = item.label;
        popup.appendChild(row);
        rowEls.push({ label: item.label, el: row });
      }
    }

    this.controlStripEl.appendChild(popup);
    try {
      await this.wait(260, signal);
      const target = rowEls.find((r) => r.label === pickLabel) || rowEls[0];
      if (target) {
        await this.moveToElement(target.el, 0.45, 0.5, 360, signal);
        target.el.classList.add('active');
        this.sounds.menuTick();
        await this.wait(320, signal);
        target.el.classList.add('blink');
        this.sounds.click();
        await this.wait(260, signal);
      }
    } finally {
      popup.remove();
      btn.classList.remove('active');
    }
  }

  async adjustControlStripVolume(targetLevel, signal) {
    const btn = this.controlStripEl.querySelector('[data-cs="sound"]');
    if (!btn) return;

    const clamped = Math.max(0, Math.min(7, targetLevel));
    const pctFromLevel = (lvl) => 8 + ((7 - lvl) / 7) * 84;

    await this.click(btn, { afterMs: 100 }, signal);
    btn.classList.add('active');

    const popup = document.createElement('div');
    popup.className = 'os9-cs-vol-popup';
    popup.style.left = `${Math.max(4, btn.offsetLeft - 12)}px`;
    popup.innerHTML = `
      <div class="os9-cs-vol-label" data-vol-lbl>${this.controlStrip.volume === 0 ? 'Mute' : `Vol ${this.controlStrip.volume}`}</div>
      <div class="os9-cs-vol-track" data-vol-track>
        <div class="os9-cs-vol-groove"></div>
        <div class="os9-cs-vol-ticks">${Array.from({ length: 8 }, () => '<div class="os9-cs-vol-tick"></div>').join('')}</div>
        <div class="os9-cs-vol-thumb" data-vol-thumb style="top:${pctFromLevel(this.controlStrip.volume)}%"></div>
      </div>
    `;
    this.controlStripEl.appendChild(popup);

    const track = popup.querySelector('[data-vol-track]');
    const thumb = popup.querySelector('[data-vol-thumb]');
    const lbl = popup.querySelector('[data-vol-lbl]');

    try {
      await this.wait(220, signal);
      await this.moveToElement(thumb, 0.5, 0.5, 280, signal);
      this.sounds.click();

      const steps = Math.abs(clamped - this.controlStrip.volume);
      const dir = clamped >= this.controlStrip.volume ? 1 : -1;
      for (let s = 1; s <= steps; s++) {
        this.controlStrip.volume += dir;
        const pct = pctFromLevel(this.controlStrip.volume);
        thumb.style.top = `${pct}%`;
        lbl.textContent = this.controlStrip.volume === 0 ? 'Mute' : `Vol ${this.controlStrip.volume}`;
        this.updateControlStripIcons();
        const trPt = this._getElementPoint(track, 0.5, pct / 100);
        await this.moveTo(trPt.x, trPt.y, 150, signal);
        this.sounds.menuTick();
      }
      await this.wait(360, signal);
      if (this.controlStrip.volume > 0) this.sounds.sosumi();
      await this.wait(260, signal);
    } finally {
      popup.remove();
      btn.classList.remove('active');
    }
  }

  /* =================================================================
     Timing & Abortable Async Primitives
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
      throw new AbortSceneError();
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
      if (!this.paused) {
        elapsed += dt * this.speed;
      }
    }
  }

  /* =================================================================
     Cursor & Human Motion Primitives
     ================================================================= */
  setCursorMode(mode) {
    if (this.cursor.mode === mode) return;
    this.cursor.mode = mode;
    if (mode === 'ibeam') this.cursorEl.innerHTML = ICONS.cursorIBeam;
    else if (mode === 'watch') this.cursorEl.innerHTML = ICONS.cursorWatch;
    else this.cursorEl.innerHTML = ICONS.cursorArrow;
  }

  _renderCursor() {
    this.cursorEl.style.transform = `translate3d(${Math.round(this.cursor.x)}px, ${Math.round(this.cursor.y)}px, 0)`;
  }

  _getElementPoint(el, rx = 0.5, ry = 0.5) {
    const rootRect = this.root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - rootRect.left + r.width * rx,
      y: r.top - rootRect.top + r.height * ry,
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

    const dur = durationMs ?? Math.max(260, Math.min(920, 210 + dist * 0.92));

    // Organic slight curve perpendicular to path
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const arc = (Math.random() > 0.5 ? 1 : -1) * Math.min(44, dist * 0.14);
    const cx1 = sx + dx * 0.32 + perpX * arc;
    const cy1 = sy + dy * 0.32 + perpY * arc;
    const cx2 = sx + dx * 0.72 + perpX * (arc * 0.45);
    const cy2 = sy + dy * 0.72 + perpY * (arc * 0.45);

    let elapsed = 0;
    let last = performance.now();

    while (elapsed < dur) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      this._checkSignal(signal);
      const now = performance.now();
      const dt = Math.min(60, now - last);
      last = now;
      if (!this.paused) {
        elapsed += dt * this.speed;
      }
      const rawT = Math.min(1, elapsed / dur);
      // Smooth quintic ease-in-out
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
    const pt = this._getElementPoint(el, rx, ry);
    await this.moveTo(pt.x, pt.y, durationMs, signal);
    return pt;
  }

  _spawnClickRing(x, y) {
    const ring = document.createElement('div');
    ring.className = 'os9-click-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    this.root.appendChild(ring);
    setTimeout(() => ring.remove(), 360);
  }

  async click(el = null, opts = {}, signal = null) {
    if (el) {
      await this.moveToElement(el, opts.rx ?? 0.5, opts.ry ?? 0.5, opts.duration ?? null, signal);
    }
    this.cursorEl.classList.add('clicking');
    this._spawnClickRing(this.cursor.x, this.cursor.y);
    this.sounds.click();
    if (el && opts.pressClass) el.classList.add(opts.pressClass);
    await this.wait(110, signal);
    if (el && opts.pressClass) el.classList.remove(opts.pressClass);
    this.cursorEl.classList.remove('clicking');
    await this.wait(opts.afterMs ?? 120, signal);
  }

  async doubleClick(el, signal = null) {
    await this.moveToElement(el, 0.5, 0.45, null, signal);
    this.sounds.click();
    this._spawnClickRing(this.cursor.x, this.cursor.y);
    await this.wait(95, signal);
    this.sounds.click();
    this._spawnClickRing(this.cursor.x, this.cursor.y);
    await this.wait(130, signal);
  }

  async drag(fromEl, toEl, ghostHtml, signal = null) {
    await this.moveToElement(fromEl, 0.5, 0.5, null, signal);
    this.sounds.click();
    await this.wait(120, signal);

    const ghost = document.createElement('div');
    ghost.className = 'os9-drag-ghost';
    ghost.innerHTML = ghostHtml;
    this.root.appendChild(ghost);

    const startX = this.cursor.x;
    const startY = this.cursor.y;
    const endPt = this._getElementPoint(toEl, 0.5, 0.45);
    const dist = Math.hypot(endPt.x - startX, endPt.y - startY);
    const dur = Math.max(520, Math.min(1150, 320 + dist * 1.1));

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

        this.cursor.x = startX + (endPt.x - startX) * t;
        this.cursor.y = startY + (endPt.y - startY) * t;
        this._renderCursor();
        ghost.style.left = `${this.cursor.x}px`;
        ghost.style.top = `${this.cursor.y}px`;

        toEl.classList.toggle('drop-target', rawT > 0.85);
      }
      await this.wait(130, signal);
      this.sounds.click();
    } finally {
      toEl.classList.remove('drop-target');
      ghost.remove();
    }
  }

  async openMenuAndPick(menuKey, itemLabel, signal = null) {
    const trigger = this.menusEl.querySelector(`[data-menu-key="${menuKey}"]`);
    if (!trigger) return;

    await this.click(trigger, { afterMs: 80 }, signal);

    const items =
      menuKey === 'apple'
        ? APPLE_MENU_ITEMS
        : (APP_MENUS[this.activeApp] || APP_MENUS.Finder).find((m) => m.key === menuKey)?.items || [];

    const dropdown = document.createElement('div');
    dropdown.className = 'os9-dropdown';
    const itemEls = [];

    for (const item of items) {
      if (item.divider) {
        const div = document.createElement('div');
        div.className = 'os9-dropdown-divider';
        dropdown.appendChild(div);
      } else {
        const row = document.createElement('div');
        row.className = `os9-dropdown-item${item.disabled ? ' disabled' : ''}`;
        row.innerHTML = `<span>${item.label}</span>${item.shortcut ? `<span class="os9-shortcut">${item.shortcut}</span>` : ''}`;
        dropdown.appendChild(row);
        itemEls.push({ label: item.label, el: row, disabled: item.disabled });
      }
    }

    trigger.classList.add('open');
    trigger.appendChild(dropdown);

    try {
      await this.wait(200, signal);
      const target = itemEls.find((x) => x.label === itemLabel) || itemEls.find((x) => !x.disabled);
      if (target) {
        // Sweep down smoothly to the menu item
        await this.moveToElement(target.el, 0.45, 0.5, 340, signal);
        target.el.classList.add('active');
        this.sounds.menuTick();
        await this.wait(280, signal);
        target.el.classList.add('blink');
        this.sounds.click();
        await this.wait(280, signal);
      }
    } finally {
      trigger.classList.remove('open');
      dropdown.remove();
    }
  }

  async typeText(el, text, opts = {}, signal = null) {
    const baseDelay = opts.delay ?? 58;
    const withCaret = opts.caret ?? true;
    const allowTypo = opts.allowTypo ?? true;
    let current = opts.append ? el.dataset.rawText || el.textContent || '' : '';
    let didTypo = false;

    const render = () => {
      el.dataset.rawText = current;
      const escaped = current
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      el.innerHTML = withCaret ? `${escaped}<span class="os9-caret"></span>` : escaped;
    };

    render();

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      // Occasional realistic typo + quick backspace fix
      if (allowTypo && !didTypo && i > 12 && i < text.length - 6 && /[a-z]/.test(ch) && Math.random() < 0.04) {
        didTypo = true;
        const wrong = ch === 'e' ? 'r' : ch === 'a' ? 's' : ch === 'o' ? 'p' : 'n';
        current += wrong;
        render();
        this.sounds.key();
        await this.wait(baseDelay * 2.4, signal);
        current = current.slice(0, -1);
        render();
        this.sounds.key();
        await this.wait(baseDelay * 1.6, signal);
      }

      current += ch;
      render();
      if (ch !== ' ') this.sounds.key();

      let pause = baseDelay + Math.random() * 44;
      if (ch === '.' || ch === '!' || ch === '?') pause += 220;
      else if (ch === ',' || ch === '—') pause += 120;
      else if (ch === '\n') pause += 240;

      await this.wait(pause, signal);
    }

    if (opts.removeCaretAtEnd) {
      el.innerHTML = current
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }

  /* =================================================================
     Window Manager
     ================================================================= */
  getSafeDesktopBox() {
    const r = this.desktopEl.getBoundingClientRect();
    const w = Math.max(640, r.width);
    const h = Math.max(440, r.height);
    return {
      left: 20,
      top: 16,
      width: Math.max(420, w - 134),
      height: Math.max(360, h - 64),
    };
  }

  // Layouts were drawn for roughly a 1220×760 stage. Larger screens, such as a
  // MacBook Pro, grow document windows a little and then stop.
  windowScale() {
    const r = this.desktopEl.getBoundingClientRect();
    const w = Math.max(640, r.width);
    const h = Math.max(440, r.height);
    const s = Math.min(w / 1220, h / 760);
    return Math.max(1, Math.min(1.28, s));
  }

  createWindow(cfg) {
    const box = this.getSafeDesktopBox();
    const scale = cfg.scale === false ? 1 : this.windowScale();
    const width = Math.min(Math.round((cfg.width || 440) * scale), box.width - 10);
    const height = cfg.height ? Math.min(Math.round(cfg.height * scale), box.height - 10) : null;
    const x = Math.max(12, Math.min(cfg.x ?? box.left + 40, box.left + box.width - width));
    const y = Math.max(10, Math.min(cfg.y ?? box.top + 28, box.top + box.height - (height || 260)));

    const el = document.createElement('section');
    el.className = `os9-window${cfg.className ? ` ${cfg.className}` : ''}`;
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${Math.round(width)}px`;
    if (height) el.style.height = `${Math.round(height)}px`;

    const closable = cfg.closable !== false;
    const zoomable = cfg.zoomable !== false;
    const shadable = cfg.shadable !== false;

    el.innerHTML = `
      <div class="os9-titlebar">
        ${closable ? '<div class="os9-win-btn close"></div>' : ''}
        <div class="os9-stripes"></div>
        <div class="os9-title-text">${cfg.titleIcon || ''}<span>${cfg.title}</span></div>
        <div class="os9-stripes"></div>
        ${zoomable ? '<div class="os9-win-btn zoom"></div>' : ''}
        ${shadable ? '<div class="os9-win-btn shade"></div>' : ''}
      </div>
      <div class="os9-window-inner"></div>
    `;

    const bodyEl = el.querySelector('.os9-window-inner');
    if (typeof cfg.content === 'string') {
      bodyEl.innerHTML = cfg.content;
    } else if (cfg.content instanceof HTMLElement) {
      bodyEl.appendChild(cfg.content);
    }

    this.windowsEl.appendChild(el);

    const win = {
      id: cfg.id || `win-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      appName: cfg.appName || 'Finder',
      appIcon: cfg.appIcon || ICONS.finderFace,
      el,
      bodyEl,
      titlebarEl: el.querySelector('.os9-titlebar'),
      closeBtn: el.querySelector('.os9-win-btn.close'),
      zoomBtn: el.querySelector('.os9-win-btn.zoom'),
      shadeBtn: el.querySelector('.os9-win-btn.shade'),
      shaded: false,
      persistent: Boolean(cfg.persistent),
    };

    this.windows.set(win.id, win);
    this.focusWindow(win);
    return win;
  }

  focusWindow(win) {
    if (!win || !this.windows.has(win.id)) return;
    for (const w of this.windows.values()) {
      w.el.classList.toggle('inactive', w.id !== win.id);
    }
    this.zCounter += 1;
    win.el.style.zIndex = String(this.zCounter);
    this.activeWindowId = win.id;
    this.setActiveApp(win.appName, win.appIcon);
  }

  shadeWindow(win, collapsed = !win.shaded) {
    if (!win) return;
    win.shaded = collapsed;
    win.el.classList.toggle('shaded', collapsed);
    this.sounds.windowShade(collapsed);
  }

  async moveWindowSmooth(win, targetX, targetY, durationMs = 520, signal = null) {
    if (!win) return;
    const sx = parseFloat(win.el.style.left) || 0;
    const sy = parseFloat(win.el.style.top) || 0;
    const box = this.getSafeDesktopBox();
    const w = win.el.offsetWidth;
    const h = win.el.offsetHeight;
    const tx = Math.max(10, Math.min(targetX, box.left + box.width - w));
    const ty = Math.max(8, Math.min(targetY, box.top + box.height - Math.min(h, 240)));

    await this.moveToElement(win.titlebarEl, 0.5, 0.5, null, signal);
    this.sounds.click();
    const cursorOffsetX = this.cursor.x - sx;
    const cursorOffsetY = this.cursor.y - sy;

    let elapsed = 0;
    let last = performance.now();
    while (elapsed < durationMs) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      this._checkSignal(signal);
      const now = performance.now();
      const dt = Math.min(60, now - last);
      last = now;
      if (!this.paused) elapsed += dt * this.speed;
      const rawT = Math.min(1, elapsed / durationMs);
      const t = rawT < 0.5 ? 2 * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 2) / 2;
      const nx = sx + (tx - sx) * t;
      const ny = sy + (ty - sy) * t;
      win.el.style.left = `${Math.round(nx)}px`;
      win.el.style.top = `${Math.round(ny)}px`;
      this.cursor.x = nx + cursorOffsetX;
      this.cursor.y = ny + cursorOffsetY;
      this._renderCursor();
    }
  }

  closeWindow(winOrId) {
    const id = typeof winOrId === 'string' ? winOrId : winOrId?.id;
    const win = this.windows.get(id);
    if (!win) return;
    win.el.remove();
    this.windows.delete(id);

    // Focus next highest window or return to Finder
    let topWin = null;
    let maxZ = -1;
    for (const w of this.windows.values()) {
      const z = parseInt(w.el.style.zIndex || '0', 10);
      if (z > maxZ) {
        maxZ = z;
        topWin = w;
      }
    }
    if (topWin) {
      this.focusWindow(topWin);
    } else {
      this.activeWindowId = null;
      this.setActiveApp('Finder', ICONS.finderFace);
    }
  }

  closeNonPersistentWindows(maxKeep = 1) {
    const removable = [...this.windows.values()]
      .filter((w) => !w.persistent)
      .sort((a, b) => parseInt(a.el.style.zIndex || '0', 10) - parseInt(b.el.style.zIndex || '0', 10));

    while (removable.length > maxKeep) {
      const oldest = removable.shift();
      this.closeWindow(oldest.id);
    }
  }

  clearAllWindows() {
    for (const id of [...this.windows.keys()]) {
      this.closeWindow(id);
    }
  }

  /* =================================================================
     Cleanup
     ================================================================= */
  destroy() {
    this.destroyed = true;
    clearInterval(this.clockInterval);
    window.removeEventListener('resize', this.resizeHandler);
    this.sounds.destroy();
    this.root.remove();
  }
}
