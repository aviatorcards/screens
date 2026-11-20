import { ICONS } from './icons.js';
import { DESKTOP_PATTERNS, HIGHLIGHT_COLORS } from './wallpapers.js';

function vScrollHtml() {
  return `
    <div class="os9-vscroll">
      <div class="os9-vscroll-track">
        <div class="os9-vscroll-thumb"></div>
      </div>
      <div class="os9-scroll-arrow">▲</div>
      <div class="os9-scroll-arrow">▼</div>
    </div>
  `;
}

/* =====================================================================
   Finder Window (Icon View + List View)
   ===================================================================== */
export function createFinderWindow(engine, cfg) {
  const win = engine.createWindow({
    id: cfg.id,
    appName: 'Finder',
    appIcon: ICONS.finderFace,
    title: cfg.title || 'Macintosh HD',
    titleIcon: cfg.titleIcon || ICONS.macHd,
    x: cfg.x,
    y: cfg.y,
    width: cfg.width || 470,
    height: cfg.height || 300,
    content: `
      <div class="os9-finder-status">${cfg.statusText || `${cfg.items.length} items, 1.84 GB available`}</div>
      <div class="os9-finder-body">
        <div class="os9-finder-content"></div>
        ${vScrollHtml()}
      </div>
    `,
  });

  const contentEl = win.bodyEl.querySelector('.os9-finder-content');
  const statusEl = win.bodyEl.querySelector('.os9-finder-status');
  let items = [...cfg.items];
  let viewMode = cfg.view || 'icons';
  let selectedId = null;

  function render() {
    statusEl.textContent = cfg.statusText || `${items.length} items, 1.84 GB available`;
    if (viewMode === 'icons') {
      contentEl.innerHTML = `
        <div class="os9-finder-icons">
          ${items
            .map(
              (item) => `
            <div class="os9-finder-icon-item${selectedId === item.id ? ' selected' : ''}" data-item-id="${item.id}">
              ${item.icon}
              <span>${item.name}</span>
            </div>`,
            )
            .join('')}
        </div>
      `;
    } else {
      contentEl.innerHTML = `
        <table class="os9-finder-table">
          <thead>
            <tr>
              <th class="sorted">Name ▾</th>
              <th>Date Modified</th>
              <th>Size</th>
              <th>Kind</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
              <tr class="${selectedId === item.id ? 'selected' : ''}" data-item-id="${item.id}">
                <td class="sorted-col"><span class="os9-list-name">${item.icon}<span>${item.name}</span></span></td>
                <td>${item.date}</td>
                <td>${item.size}</td>
                <td>${item.kind}</td>
              </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      `;
    }
  }

  render();

  return {
    win,
    setView(mode) {
      viewMode = mode;
      render();
    },
    selectItem(id) {
      selectedId = id;
      render();
    },
    removeItem(id) {
      items = items.filter((i) => i.id !== id);
      if (selectedId === id) selectedId = null;
      render();
    },
    getItemEl(id) {
      return contentEl.querySelector(`[data-item-id="${id}"]`);
    },
  };
}

/* =====================================================================
   SimpleText Window
   ===================================================================== */
export function createSimpleTextWindow(engine, cfg) {
  const win = engine.createWindow({
    id: cfg.id,
    appName: 'SimpleText',
    appIcon: ICONS.simpleTextDoc,
    title: cfg.title || 'Untitled',
    titleIcon: ICONS.simpleTextDoc,
    x: cfg.x,
    y: cfg.y,
    width: cfg.width || 430,
    height: cfg.height || 290,
    content: `
      <div class="os9-simpletext-wrap">
        <div class="os9-simpletext-doc"></div>
        ${vScrollHtml()}
      </div>
    `,
  });

  const docEl = win.bodyEl.querySelector('.os9-simpletext-doc');
  if (cfg.initialText) {
    docEl.dataset.rawText = cfg.initialText;
    docEl.textContent = cfg.initialText;
  }

  return { win, docEl };
}

/* =====================================================================
   Stickies Note Window
   ===================================================================== */
export function createStickyWindow(engine, cfg) {
  const win = engine.createWindow({
    id: cfg.id,
    appName: 'Stickies',
    appIcon: ICONS.simpleTextDoc,
    title: cfg.title || 'Sticky Note',
    className: `sticky ${cfg.color || 'yellow'}`,
    x: cfg.x,
    y: cfg.y,
    width: cfg.width || 226,
    height: cfg.height || null,
    zoomable: false,
    persistent: Boolean(cfg.persistent),
    content: `<div class="os9-sticky-body"></div>`,
  });

  const bodyEl = win.bodyEl.querySelector('.os9-sticky-body');
  if (cfg.text) {
    bodyEl.dataset.rawText = cfg.text;
    bodyEl.textContent = cfg.text;
  }

  return { win, bodyEl };
}

/* =====================================================================
   Classic Mac OS 9 Calculator
   ===================================================================== */
export function createCalculatorWindow(engine, cfg = {}) {
  const keys = [
    ['C', 'C'], ['=', '='], ['/', '/'], ['*', '*'],
    ['7', '7'], ['8', '8'], ['9', '9'], ['-', '-'],
    ['4', '4'], ['5', '5'], ['6', '6'], ['+', '+'],
    ['1', '1'], ['2', '2'], ['3', '3'], ['eq', '=', 'tall'],
    ['0', '0', 'wide'], ['.', '.'],
  ];

  const win = engine.createWindow({
    id: cfg.id || 'os9-calc',
    appName: 'Calculator',
    appIcon: ICONS.finderFace,
    title: 'Calculator',
    className: 'calculator',
    x: cfg.x,
    y: cfg.y,
    width: 174,
    scale: false,
    zoomable: false,
    shadable: false,
    content: `
      <div class="os9-calc-display">0</div>
      <div class="os9-calc-grid">
        ${keys
          .map(
            ([id, label, extra]) =>
              `<div class="os9-calc-key${extra ? ` ${extra}` : ''}" data-calc-key="${id}">${label}</div>`,
          )
          .join('')}
      </div>
    `,
  });

  const displayEl = win.bodyEl.querySelector('.os9-calc-display');
  return {
    win,
    setDisplay(val) {
      displayEl.textContent = String(val);
    },
    getKeyEl(k) {
      return win.bodyEl.querySelector(`[data-calc-key="${k}"]`);
    },
  };
}

/* =====================================================================
   Sherlock 2 (Brushed Silver Search)
   ===================================================================== */
export function createSherlockWindow(engine, cfg = {}) {
  const channels = [
    { id: 'files', icon: '📁', label: 'Files' },
    { id: 'internet', icon: '🌐', label: 'Internet' },
    { id: 'people', icon: '👤', label: 'People' },
    { id: 'apple', icon: '', label: 'Apple' },
    { id: 'news', icon: '📰', label: 'News' },
    { id: 'shopping', icon: '🛍', label: 'Shopping' },
  ];

  const win = engine.createWindow({
    id: cfg.id || 'os9-sherlock',
    appName: 'Sherlock 2',
    appIcon: ICONS.sherlock,
    title: 'Sherlock 2',
    titleIcon: ICONS.sherlock,
    x: cfg.x,
    y: cfg.y,
    width: cfg.width || 520,
    height: cfg.height || 345,
    content: `
      <div class="os9-sherlock-header">
        <div class="os9-sherlock-channels">
          ${channels
            .map(
              (c, idx) => `
            <div class="os9-sherlock-ch${idx === 1 ? ' active' : ''}" data-ch="${c.id}">
              <span style="font-size:15px">${c.icon}</span>
              <span>${c.label}</span>
            </div>`,
            )
            .join('')}
        </div>
        <div class="os9-sherlock-searchrow">
          <div class="os9-sherlock-input" data-sh-input></div>
          <div class="os9-sherlock-go" data-sh-go>🔍</div>
        </div>
      </div>
      <div class="os9-sherlock-status">
        <span data-sh-status>Ready — Select a channel and enter words to search.</span>
        <div class="os9-progress-track indeterminate" data-sh-progress style="width:110px;display:none">
          <div class="os9-progress-fill"></div>
        </div>
      </div>
      <div class="os9-sherlock-results">
        <table class="os9-finder-table">
          <thead>
            <tr>
              <th class="sorted">Name</th>
              <th>Relevance</th>
              <th>Site / Location</th>
            </tr>
          </thead>
          <tbody data-sh-rows></tbody>
        </table>
      </div>
      <div class="os9-sherlock-preview" data-sh-preview>
        Tip: Sherlock 2 searches your Macintosh HD and the Internet simultaneously using plug-in channels.
      </div>
    `,
  });

  const inputEl = win.bodyEl.querySelector('[data-sh-input]');
  const goBtn = win.bodyEl.querySelector('[data-sh-go]');
  const statusEl = win.bodyEl.querySelector('[data-sh-status]');
  const progressEl = win.bodyEl.querySelector('[data-sh-progress]');
  const rowsEl = win.bodyEl.querySelector('[data-sh-rows]');
  const previewEl = win.bodyEl.querySelector('[data-sh-preview]');

  return {
    win,
    inputEl,
    goBtn,
    getChannelEl(id) {
      return win.bodyEl.querySelector(`[data-ch="${id}"]`);
    },
    setActiveChannel(id) {
      win.bodyEl.querySelectorAll('.os9-sherlock-ch').forEach((el) => {
        el.classList.toggle('active', el.dataset.ch === id);
      });
    },
    setSearching(searching, text) {
      statusEl.textContent = text;
      progressEl.style.display = searching ? 'block' : 'none';
    },
    setResults(items) {
      rowsEl.innerHTML = items
        .map(
          (item, i) => `
        <tr data-sh-row="${i}">
          <td>${item.title}</td>
          <td><div class="os9-relevance-bar"><div style="width:${item.score}%"></div></div></td>
          <td>${item.site}</td>
        </tr>`,
        )
        .join('');
    },
    selectRow(idx, summary) {
      rowsEl.querySelectorAll('tr').forEach((tr, i) => {
        tr.classList.toggle('selected', i === idx);
      });
      previewEl.innerHTML = summary;
    },
    getRowEl(idx) {
      return rowsEl.querySelector(`[data-sh-row="${idx}"]`);
    },
  };
}

/* =====================================================================
   Netscape Communicator 4.7 + Built-in 1999 Mock Pages
   ===================================================================== */
export const RETRO_WEB_PAGES = {
  apple: {
    url: 'http://www.apple.com/imac/',
    title: 'Apple — Say hello to iMac DV',
    html: () => `
      <div style="text-align:center;font-family:Georgia,serif;">
        <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#666;margin-bottom:4px;">Apple Computer, Inc. · Think Different.</div>
        <div style="font-size:24px;font-weight:700;color:#111;margin-bottom:8px;">Say hello to iMac DV.</div>
        <div style="display:flex;justify-content:center;gap:8px;margin:10px 0 12px;">
          <span style="padding:3px 9px;background:#2f8394;color:#fff;font-size:10px;border-radius:10px;font-family:Helvetica,Arial,sans-serif;">Blueberry</span>
          <span style="padding:3px 9px;background:#d86c25;color:#fff;font-size:10px;border-radius:10px;font-family:Helvetica,Arial,sans-serif;">Tangerine</span>
          <span style="padding:3px 9px;background:#834b9c;color:#fff;font-size:10px;border-radius:10px;font-family:Helvetica,Arial,sans-serif;">Grape</span>
          <span style="padding:3px 9px;background:#c43b5a;color:#fff;font-size:10px;border-radius:10px;font-family:Helvetica,Arial,sans-serif;">Strawberry</span>
          <span style="padding:3px 9px;background:#68a836;color:#fff;font-size:10px;border-radius:10px;font-family:Helvetica,Arial,sans-serif;">Lime</span>
        </div>
        <div style="background:#f3f6fb;border:1px solid #cbd5e1;padding:12px;text-align:left;font-family:Geneva,Verdana,sans-serif;font-size:11px;line-height:1.5;color:#222;">
          <strong>Desktop Movies for the Rest of Us.</strong><br/>
          Introducing the new 400MHz PowerPC G3 iMac DV with FireWire, slot-loading DVD-ROM drive, Harmon Kardon Odyssey audio, and <strong>Mac OS 9</strong> pre-installed — starting at $1,299.
          <div style="margin-top:8px;display:flex;gap:14px;color:#0033cc;text-decoration:underline;">
            <span data-ns-link="macnn">Read MacNN Coverage →</span>
            <span data-ns-link="yahoo">Browse Yahoo! Directory →</span>
          </div>
        </div>
        <div style="margin-top:12px;font-size:10px;color:#555;font-family:Geneva,sans-serif;">
          QuickTime 4 Pro · AirPort Wireless Networking · Sherlock 2 · Built for the Internet Age
        </div>
      </div>
    `,
  },
  yahoo: {
    url: 'http://www.yahoo.com/',
    title: 'Yahoo!',
    html: (dateInfo) => `
      <div style="font-family:Times New Roman,Georgia,serif;">
        <div style="text-align:center;border-bottom:2px solid #990033;padding-bottom:6px;margin-bottom:10px;">
          <span style="font-size:26px;font-weight:700;color:#cc0033;letter-spacing:0.04em;">YAHOO!</span>
          <div style="font-size:10px;font-family:Geneva,Arial,sans-serif;color:#444;">${dateInfo.headerDate} · Check Email · My Yahoo! · Weather</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;font-family:Geneva,Arial,sans-serif;font-size:11px;line-height:1.55;">
          <div>
            <div style="font-weight:700;color:#003399;text-decoration:underline;">Computers &amp; Internet</div>
            <div style="font-size:10px;color:#333;">Macintosh, Software, WWW, Games, MP3</div>
            <div style="font-weight:700;color:#003399;text-decoration:underline;margin-top:7px;" data-ns-link="macnn">News &amp; Media</div>
            <div style="font-size:10px;color:#333;">Full Coverage, Technology, MacNN, Weather</div>
            <div style="font-weight:700;color:#003399;text-decoration:underline;margin-top:7px;" data-ns-link="geocities">GeoCities Neighborhoods</div>
            <div style="font-size:10px;color:#333;">SiliconValley, Tokyo, TimesSquare, SunsetStrip</div>
          </div>
          <div>
            <div style="font-weight:700;color:#003399;text-decoration:underline;">Entertainment</div>
            <div style="font-size:10px;color:#333;">Movies, QuickTime Trailers, Music, Sci-Fi</div>
            <div style="font-weight:700;color:#003399;text-decoration:underline;margin-top:7px;" data-ns-link="apple">Apple Computer Showcase</div>
            <div style="font-size:10px;color:#333;">iMac DV, PowerBook G3, Mac OS 9 Updates</div>
            <div style="font-weight:700;color:#003399;text-decoration:underline;margin-top:7px;">Reference</div>
            <div style="font-size:10px;color:#333;">Dictionaries, Libraries, Phone Numbers</div>
          </div>
        </div>
      </div>
    `,
  },
  macnn: {
    url: 'http://www.macnn.com/',
    title: 'MacNN — The Macintosh News Network',
    html: (dateInfo) => `
      <div style="font-family:Geneva,Verdana,sans-serif;">
        <div style="background:#1c3d7a;color:#fff;padding:6px 10px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <strong style="font-size:14px;">MacNN · Macintosh News Network</strong>
          <span style="font-size:10px;opacity:0.9;">${dateInfo.shortDate}</span>
        </div>
        <div style="font-size:11px;line-height:1.5;color:#111;display:flex;flex-direction:column;gap:9px;">
          <div style="border-bottom:1px dotted #aaa;padding-bottom:7px;">
            <strong style="color:#003399;">Mac OS 9.2 Update Brings Snappier Platinum UI &amp; Sherlock 2 Speedups</strong><br/>
            Users report noticeably faster Finder window redraws, improved Open Transport stability, and smoother QuickTime 4 streaming playback.
          </div>
          <div style="border-bottom:1px dotted #aaa;padding-bottom:7px;">
            <strong style="color:#003399;">VersionTracker Picks: SoundJam MP, GraphicConverter, StuffIt Expander 5.5</strong><br/>
            Essential shareware utilities for every PowerPC desktop—plus a fresh set of Kaleidoscope Platinum themes.
          </div>
          <div>
            <span data-ns-link="geocities" style="color:#0033cc;text-decoration:underline;">Visit Featured Retro Home Page (GeoCities) →</span>
          </div>
        </div>
      </div>
    `,
  },
  geocities: {
    url: 'http://www.geocities.com/SiliconValley/Bay/1999/',
    title: "Welcome to MacZone '99!",
    html: () => `
      <div style="background:#000044;color:#ffff66;padding:12px;border:3px ridge #00ccff;font-family:'Comic Sans MS',Geneva,sans-serif;text-align:center;">
        <div style="font-size:17px;font-weight:700;color:#00ffff;text-shadow:1px 1px #ff00ff;">★ Welcome to MacZone '99! ★</div>
        <div style="font-size:10.5px;color:#ffffff;margin:6px 0 10px;">Best viewed in Netscape Navigator 4.7 at 1024×768 · Made on a Macintosh!</div>
        <div style="background:#001166;border:1px dashed #ffcc00;padding:8px;font-size:11px;color:#d8f8ff;text-align:left;line-height:1.5;">
          • Download my custom <strong>Mac OS 9 Desktop Patterns</strong> (.sit archive, 412 KB)<br/>
          • My Top 5 After Dark Modules: Flying Toasters, Starry Night, Warp, Lunatic Fringe<br/>
          • Sign my Guestbook or IM me on AIM!
        </div>
        <div style="margin-top:10px;display:flex;justify-content:center;align-items:center;gap:12px;font-family:Monaco,monospace;font-size:11px;">
          <span style="background:#000;color:#00ff44;border:1px solid #888;padding:2px 8px;">Visitors: 004,892</span>
          <span data-ns-link="apple" style="color:#66e0ff;text-decoration:underline;font-family:Geneva,sans-serif;">« Back to Apple.com</span>
        </div>
      </div>
    `,
  },
};

export function createNetscapeWindow(engine, cfg = {}) {
  const win = engine.createWindow({
    id: cfg.id || 'os9-netscape',
    appName: 'Netscape Communicator',
    appIcon: ICONS.netscape,
    title: 'Netscape — Apple',
    titleIcon: ICONS.netscape,
    x: cfg.x,
    y: cfg.y,
    width: cfg.width || 560,
    height: cfg.height || 375,
    content: `
      <div class="os9-ns-toolbar">
        <div class="os9-ns-buttons">
          <div class="os9-ns-btn" data-ns-btn="back"><span>◀</span><span>Back</span></div>
          <div class="os9-ns-btn" data-ns-btn="forward"><span>▶</span><span>Forward</span></div>
          <div class="os9-ns-btn" data-ns-btn="reload"><span>↻</span><span>Reload</span></div>
          <div class="os9-ns-btn" data-ns-btn="home"><span>⌂</span><span>Home</span></div>
          <div class="os9-ns-btn" data-ns-btn="search"><span>🔍</span><span>Search</span></div>
        </div>
        <div class="os9-ns-throbber" data-ns-throbber>N</div>
      </div>
      <div class="os9-ns-location">
        <span>Location:</span>
        <div class="os9-ns-url" data-ns-url>http://www.apple.com/imac/</div>
      </div>
      <div class="os9-ns-viewport">
        <div class="os9-ns-page" data-ns-page></div>
      </div>
      <div class="os9-ns-statusbar">
        <span data-ns-status>Document: Done</span>
        <span>🔒 128-bit · 56K Modem</span>
      </div>
    `,
  });

  const urlEl = win.bodyEl.querySelector('[data-ns-url]');
  const pageEl = win.bodyEl.querySelector('[data-ns-page]');
  const statusEl = win.bodyEl.querySelector('[data-ns-status]');
  const throbberEl = win.bodyEl.querySelector('[data-ns-throbber]');
  const titleSpan = win.el.querySelector('.os9-title-text span');

  return {
    win,
    urlEl,
    pageEl,
    getBtn(name) {
      return win.bodyEl.querySelector(`[data-ns-btn="${name}"]`);
    },
    getLink(key) {
      return pageEl.querySelector(`[data-ns-link="${key}"]`);
    },
    setLoading(loading, statusText) {
      throbberEl.classList.toggle('loading', loading);
      statusEl.textContent = statusText;
    },
    renderPage(pageKey) {
      const page = RETRO_WEB_PAGES[pageKey] || RETRO_WEB_PAGES.apple;
      urlEl.textContent = page.url;
      titleSpan.textContent = `Netscape — ${page.title}`;
      pageEl.style.transform = 'translateY(0)';
      pageEl.innerHTML = page.html(engine.getDynamicDateInfo());
    },
    scrollPage(px) {
      pageEl.style.transform = `translateY(${-px}px)`;
    },
  };
}

/* =====================================================================
   AIM Buddy List & Instant Message Chat
   ===================================================================== */
export function createAIMBuddyList(engine, cfg = {}) {
  const win = engine.createWindow({
    id: cfg.id || 'os9-aim-list',
    appName: 'AOL Instant Messenger',
    appIcon: ICONS.aim,
    title: "Buddy List",
    titleIcon: ICONS.aim,
    x: cfg.x,
    y: cfg.y,
    width: 196,
    height: 280,
    zoomable: false,
    content: `
      <div class="os9-aim-banner">
        ${ICONS.aim}
        <span>AIM 4.0 · Online</span>
      </div>
      <div class="os9-aim-list" data-aim-list>
        <div class="os9-aim-group">▾ Buddies (4/6)</div>
        <div class="os9-aim-buddy online" data-buddy="BondiBlue99">BondiBlue99</div>
        <div class="os9-aim-buddy online" data-buddy="QuickDrawKid">QuickDrawKid</div>
        <div class="os9-aim-buddy away" data-buddy="PixarFan2000">PixarFan2000</div>
        <div class="os9-aim-buddy online" data-buddy="MacAddictCD">MacAddictCD</div>
        <div class="os9-aim-group" style="margin-top:8px;color:#777;">▸ Offline (2)</div>
      </div>
    `,
  });

  return {
    win,
    getBuddyEl(name) {
      return win.bodyEl.querySelector(`[data-buddy="${name}"]`);
    },
    selectBuddy(name) {
      win.bodyEl.querySelectorAll('.os9-aim-buddy').forEach((el) => {
        el.classList.toggle('selected', el.dataset.buddy === name);
      });
    },
  };
}

export function createAIMChatWindow(engine, cfg) {
  const win = engine.createWindow({
    id: cfg.id || 'os9-aim-chat',
    appName: 'AOL Instant Messenger',
    appIcon: ICONS.aim,
    title: `${cfg.buddy} — Instant Message`,
    titleIcon: ICONS.aim,
    x: cfg.x,
    y: cfg.y,
    width: 340,
    height: 248,
    content: `
      <div class="os9-aim-chat-log" data-chat-log></div>
      <div class="os9-aim-compose" data-chat-input></div>
      <div class="os9-aim-footer">
        <div class="os9-btn primary" data-chat-send>Send</div>
      </div>
    `,
  });

  const logEl = win.bodyEl.querySelector('[data-chat-log]');
  const inputEl = win.bodyEl.querySelector('[data-chat-input]');
  const sendBtn = win.bodyEl.querySelector('[data-chat-send]');

  return {
    win,
    inputEl,
    sendBtn,
    addMessage(sender, text, isMe = false) {
      const p = document.createElement('div');
      p.className = isMe ? 'os9-aim-msg-me' : 'os9-aim-msg-them';
      p.innerHTML = `<strong>${sender}:</strong> ${text}`;
      logEl.appendChild(p);
    },
    clearInput() {
      inputEl.dataset.rawText = '';
      inputEl.innerHTML = '';
    },
  };
}

/* =====================================================================
   Outlook Express 5
   ===================================================================== */
export function createOutlookWindow(engine, cfg = {}) {
  const d = engine.getDynamicDateInfo();
  const messages = [
    {
      id: 'm1',
      from: 'Apple eNews',
      subject: 'Welcome to Mac OS 9 — 50+ New Features',
      date: d.fmtOffset(28),
      unread: true,
      body: `Hello Mac User,\n\nThanks for upgrading to Mac OS 9.2! Try out Sherlock 2's new internet channels, Voiceprint Passwords, and Multiple Users.\n\n— The Apple Team, Cupertino CA`,
    },
    {
      id: 'm2',
      from: 'Alex (BondiBlue99)',
      subject: `Re: ${d.weekday} LAN night + Quake III demo?`,
      date: d.fmtOffset(105),
      unread: true,
      body: `Hey! Are we still on for ${d.weekday} night? I burned the latest MacAddict cover disc onto a CD-R and brought my extra 10/100 Ethernet hub.\n\nSee you on AIM! — Alex`,
    },
    {
      id: 'm3',
      from: 'VersionTracker Daily',
      subject: `Mac OS Updates for ${d.shortDate}`,
      date: d.fmtOffset(380),
      unread: false,
      body: `Top Downloads Today:\n• StuffIt Expander 5.5 (Freeware)\n• GraphicConverter 3.8 (Shareware)\n• SoundJam MP 1.5 (MP3 Player for Mac OS 9)\n• Kaleidoscope 2.2 (Platinum & retro schemes)`,
    },
  ];

  const win = engine.createWindow({
    id: cfg.id || 'os9-outlook',
    appName: 'Outlook Express',
    appIcon: ICONS.outlook,
    title: 'Outlook Express — Inbox',
    titleIcon: ICONS.outlook,
    x: cfg.x,
    y: cfg.y,
    width: cfg.width || 540,
    height: cfg.height || 340,
    content: `
      <div class="os9-oe-layout">
        <div class="os9-oe-sidebar">
          <div class="os9-oe-folder active">📥 Inbox (2)</div>
          <div class="os9-oe-folder">📤 Outbox</div>
          <div class="os9-oe-folder">✉ Sent Mail</div>
          <div class="os9-oe-folder">📝 Drafts</div>
          <div class="os9-oe-folder">🗑 Deleted Items</div>
        </div>
        <div class="os9-oe-main">
          <div class="os9-oe-list" data-oe-list></div>
          <div class="os9-oe-preview" data-oe-preview></div>
        </div>
      </div>
    `,
  });

  const listEl = win.bodyEl.querySelector('[data-oe-list]');
  const previewEl = win.bodyEl.querySelector('[data-oe-preview]');
  let selectedId = 'm1';

  function render() {
    listEl.innerHTML = messages
      .map(
        (m) => `
      <div class="os9-oe-row${m.unread ? ' unread' : ''}${m.id === selectedId ? ' selected' : ''}" data-mail-id="${m.id}">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.from}</span>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.subject}</span>
        <span style="text-align:right;">${m.date.replace('Today, ', '')}</span>
      </div>`,
      )
      .join('');

    const cur = messages.find((m) => m.id === selectedId) || messages[0];
    previewEl.innerHTML = `
      <div class="os9-oe-headers">
        <div><strong>From:</strong> ${cur.from}</div>
        <div><strong>Subject:</strong> ${cur.subject}</div>
        <div><strong>Date:</strong> ${cur.date}</div>
      </div>
      <div style="white-space:pre-wrap;">${cur.body}</div>
    `;
  }

  render();

  return {
    win,
    selectMessage(id) {
      const m = messages.find((x) => x.id === id);
      if (m) m.unread = false;
      selectedId = id;
      render();
    },
    getMessageEl(id) {
      return listEl.querySelector(`[data-mail-id="${id}"]`);
    },
  };
}

/* =====================================================================
   AppleWorks Paint Studio
   ===================================================================== */
export function createPaintWindow(engine, cfg = {}) {
  const palette = ['#111111', '#2c868e', '#3366cc', '#e03a3e', '#fdb827', '#61bb46', '#963d97', '#ffffff'];
  const win = engine.createWindow({
    id: cfg.id || 'os9-paint',
    appName: 'AppleWorks',
    appIcon: ICONS.paint,
    title: 'Untitled Painting (PT)',
    titleIcon: ICONS.paint,
    x: cfg.x,
    y: cfg.y,
    width: 440,
    height: 332,
    content: `
      <div class="os9-paint-layout">
        <div class="os9-paint-tools">
          <div class="os9-paint-tool active" data-tool="brush">🖌</div>
          <div class="os9-paint-tool" data-tool="rect">▭</div>
          <div class="os9-paint-tool" data-tool="circle">◯</div>
          <div class="os9-paint-tool" data-tool="fill">🪣</div>
          <div class="os9-paint-tool" data-tool="eraser">⌫</div>
        </div>
        <div class="os9-paint-main">
          <div class="os9-paint-palette">
            ${palette
              .map(
                (hex, i) =>
                  `<div class="os9-swatch${i === 0 ? ' active' : ''}" data-color="${hex}" style="background:${hex}"></div>`,
              )
              .join('')}
          </div>
          <div class="os9-paint-stage">
            <canvas class="os9-paint-canvas" width="356" height="248"></canvas>
          </div>
        </div>
      </div>
    `,
  });

  const canvas = win.bodyEl.querySelector('.os9-paint-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return {
    win,
    canvas,
    ctx,
    getSwatchEl(hex) {
      return win.bodyEl.querySelector(`[data-color="${hex}"]`);
    },
    setActiveSwatch(hex) {
      win.bodyEl.querySelectorAll('.os9-swatch').forEach((el) => {
        el.classList.toggle('active', el.dataset.color === hex);
      });
    },
    getToolEl(tool) {
      return win.bodyEl.querySelector(`[data-tool="${tool}"]`);
    },
    setActiveTool(tool) {
      win.bodyEl.querySelectorAll('.os9-paint-tool').forEach((el) => {
        el.classList.toggle('active', el.dataset.tool === tool);
      });
    },
  };
}

/* =====================================================================
   Appearance Manager Control Panel
   ===================================================================== */
export function createAppearanceWindow(engine, cfg = {}) {
  const win = engine.createWindow({
    id: cfg.id || 'os9-appearance',
    appName: 'Finder',
    appIcon: ICONS.finderFace,
    title: 'Appearance',
    titleIcon: ICONS.finderFace,
    x: cfg.x,
    y: cfg.y,
    width: 448,
    height: 328,
    zoomable: false,
    content: `
      <div style="display:flex;flex-direction:column;height:100%;background:#dddddd;">
        <div class="os9-tabs">
          <div class="os9-tab">Themes</div>
          <div class="os9-tab">Appearance</div>
          <div class="os9-tab">Fonts</div>
          <div class="os9-tab active">Desktop</div>
          <div class="os9-tab">Sound</div>
        </div>
        <div class="os9-tab-panel">
          <div style="font-size:11px;font-weight:700;">Desktop Pattern:</div>
          <div class="os9-pattern-grid">
            ${DESKTOP_PATTERNS.map(
              (p, idx) => `
              <div class="os9-pattern-card${idx === engine.wallpaperIndex ? ' selected' : ''}" data-pat-idx="${idx}">
                <div class="os9-pattern-swatch" style="background-color:${p.backgroundColor};background-image:${p.backgroundImage};background-size:20px 20px;"></div>
                <span>${p.name}</span>
              </div>`,
            ).join('')}
          </div>
          <div style="font-size:11px;font-weight:700;margin-top:4px;">Highlight Color:</div>
          <div class="os9-hl-row">
            ${HIGHLIGHT_COLORS.map(
              (h, idx) => `
              <div class="os9-hl-chip${idx === engine.highlightIndex ? ' selected' : ''}" data-hl-idx="${idx}">
                <span class="os9-hl-dot" style="background:${h.color}"></span>
                <span>${h.name}</span>
              </div>`,
            ).join('')}
          </div>
        </div>
      </div>
    `,
  });

  return {
    win,
    getPatternEl(idx) {
      return win.bodyEl.querySelector(`[data-pat-idx="${idx}"]`);
    },
    setSelectedPattern(idx) {
      win.bodyEl.querySelectorAll('.os9-pattern-card').forEach((el) => {
        el.classList.toggle('selected', Number(el.dataset.patIdx) === idx);
      });
    },
    getHighlightEl(idx) {
      return win.bodyEl.querySelector(`[data-hl-idx="${idx}"]`);
    },
    setSelectedHighlight(idx) {
      win.bodyEl.querySelectorAll('.os9-hl-chip').forEach((el) => {
        el.classList.toggle('selected', Number(el.dataset.hlIdx) === idx);
      });
    },
  };
}

/* =====================================================================
   Platinum Copy Progress & Modal Alert Dialogs
   ===================================================================== */
export function createCopyDialog(engine, cfg) {
  const box = engine.getSafeDesktopBox();
  const win = engine.createWindow({
    id: cfg.id || 'os9-copy-dialog',
    appName: 'Finder',
    appIcon: ICONS.finderFace,
    title: cfg.title || 'Copy',
    x: box.left + (box.width - 370) / 2,
    y: box.top + 88,
    width: 370,
    closable: false,
    zoomable: false,
    shadable: false,
    content: `
      <div class="os9-dialog-body">
        <div class="os9-dialog-text" data-cp-title>${cfg.heading}</div>
        <div class="os9-progress-track">
          <div class="os9-progress-fill" data-cp-bar style="width:0%"></div>
        </div>
        <div class="os9-dialog-sub" data-cp-sub style="margin-top:-6px;">Preparing to copy…</div>
      </div>
    `,
  });

  const barEl = win.bodyEl.querySelector('[data-cp-bar]');
  const subEl = win.bodyEl.querySelector('[data-cp-sub]');

  return {
    win,
    setProgress(pct, subText) {
      barEl.style.width = `${Math.max(0, Math.min(100, pct))}%`;
      if (subText) subEl.textContent = subText;
    },
  };
}

export function createAlertDialog(engine, cfg) {
  const box = engine.getSafeDesktopBox();
  const width = cfg.width || 390;
  const win = engine.createWindow({
    id: cfg.id || 'os9-alert',
    appName: cfg.appName || 'Finder',
    appIcon: ICONS.finderFace,
    title: cfg.title || '',
    x: box.left + (box.width - width) / 2,
    y: box.top + 100,
    width,
    closable: false,
    zoomable: false,
    shadable: false,
    content: `
      <div class="os9-dialog-body">
        <div class="os9-dialog-top">
          <div style="flex-shrink:0;">${cfg.icon || ICONS.caution}</div>
          <div>
            <div class="os9-dialog-text">${cfg.heading}</div>
            ${cfg.body ? `<div class="os9-dialog-sub">${cfg.body}</div>` : ''}
          </div>
        </div>
        <div class="os9-dialog-actions">
          ${cfg.secondaryLabel ? `<div class="os9-btn" data-alert-secondary>${cfg.secondaryLabel}</div>` : ''}
          <div class="os9-btn primary" data-alert-primary>${cfg.primaryLabel || 'OK'}</div>
        </div>
      </div>
    `,
  });

  return {
    win,
    primaryBtn: win.bodyEl.querySelector('[data-alert-primary]'),
    secondaryBtn: win.bodyEl.querySelector('[data-alert-secondary]'),
  };
}

function formatMin(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

/* =====================================================================
   About This Computer
   ===================================================================== */
export function createAboutWindow(engine, cfg = {}) {
  const rows = [
    { name: 'Mac OS 9.2.2', size: '28.4 MB', pct: 18, color: '#7d8494' },
    { name: 'Finder', size: '6.2 MB', pct: 4, color: '#6a8fd8' },
    { name: 'Netscape Communicator', size: '22.8 MB', pct: 14, color: '#3f8f4e' },
    { name: 'SimpleText', size: '1.4 MB', pct: 2, color: '#d4a017' },
    { name: 'Largest Unused Block', size: '101.2 MB', pct: 62, color: '', free: true },
  ];

  const win = engine.createWindow({
    id: cfg.id || 'os9-about',
    appName: 'Finder',
    appIcon: ICONS.finderFace,
    title: 'About This Computer',
    titleIcon: ICONS.macHd,
    className: 'about',
    x: cfg.x,
    y: cfg.y,
    width: 430,
    height: 332,
    zoomable: false,
    content: `
      <div class="os9-about">
        <div class="os9-about-head">
          <div class="os9-about-icon">${ICONS.macHd}</div>
          <div>
            <div class="os9-about-name">Macintosh</div>
            <div class="os9-about-version">Mac OS 9.2.2</div>
          </div>
        </div>
        <div class="os9-about-label">Built-in Memory: 160 MB</div>
        <div class="os9-mem-bar" data-about-bar>
          ${rows
            .map(
              (row) =>
                `<div class="os9-mem-seg${row.free ? ' free' : ''}" style="--w:${row.pct}%;${row.color ? `background:${row.color}` : ''}"></div>`,
            )
            .join('')}
        </div>
        <div class="os9-about-rows">
          ${rows
            .map(
              (row) => `
            <div class="os9-about-row">
              <span class="os9-about-swatch${row.free ? ' free' : ''}" ${row.color ? `style="background:${row.color}"` : ''}></span>
              <span>${row.name}</span>
              <span>${row.size}</span>
            </div>`,
            )
            .join('')}
        </div>
        <div class="os9-about-foot">Virtual Memory is on.</div>
      </div>
    `,
  });

  const barEl = win.bodyEl.querySelector('[data-about-bar]');
  return {
    win,
    barEl,
    reveal() {
      requestAnimationFrame(() => barEl.classList.add('ready'));
    },
  };
}

/* =====================================================================
   QuickTime Player 4
   ===================================================================== */
export function createQuickTimeWindow(engine, cfg = {}) {
  const win = engine.createWindow({
    id: cfg.id || 'os9-quicktime',
    appName: 'QuickTime Player',
    appIcon: ICONS.quicktime,
    title: cfg.title || 'Sample Movie.mov',
    titleIcon: ICONS.quicktime,
    className: 'quicktime',
    x: cfg.x,
    y: cfg.y,
    width: cfg.width || 520,
    height: cfg.height || 360,
    content: `
      <div class="os9-qt">
        <div class="os9-qt-stage">
          <canvas class="os9-qt-canvas" width="640" height="360"></canvas>
        </div>
        <div class="os9-qt-controls">
          <div class="os9-qt-play" data-qt-play>▶</div>
          <div class="os9-qt-time" data-qt-time>0:00</div>
          <div class="os9-qt-scrub" data-qt-scrub>
            <div class="os9-qt-scrub-fill" data-qt-fill></div>
            <div class="os9-qt-knob" data-qt-knob></div>
          </div>
          <div class="os9-qt-badge">QT 4</div>
        </div>
      </div>
    `,
  });

  const canvas = win.bodyEl.querySelector('.os9-qt-canvas');
  const ctx = canvas.getContext('2d');
  const playBtn = win.bodyEl.querySelector('[data-qt-play]');
  const timeEl = win.bodyEl.querySelector('[data-qt-time]');
  const fillEl = win.bodyEl.querySelector('[data-qt-fill]');
  const knobEl = win.bodyEl.querySelector('[data-qt-knob]');
  const scrubEl = win.bodyEl.querySelector('[data-qt-scrub]');

  return {
    win,
    canvas,
    ctx,
    playBtn,
    scrubEl,
    setPlaying(playing) {
      playBtn.textContent = playing ? '❚❚' : '▶';
    },
    setTime(current, total) {
      const shown = Math.max(0, current);
      const pct = total > 0 ? Math.max(0, Math.min(100, (shown / total) * 100)) : 0;
      timeEl.textContent = formatMin(shown);
      fillEl.style.width = `${pct}%`;
      knobEl.style.left = `${pct}%`;
    },
  };
}

/* =====================================================================
   SoundJam MP
   ===================================================================== */
export function createSoundJamWindow(engine, cfg = {}) {
  const tracks = cfg.tracks || [];
  const win = engine.createWindow({
    id: cfg.id || 'os9-soundjam',
    appName: 'SoundJam MP',
    appIcon: ICONS.soundjam,
    title: 'SoundJam MP',
    titleIcon: ICONS.soundjam,
    className: 'soundjam',
    x: cfg.x,
    y: cfg.y,
    width: cfg.width || 460,
    height: cfg.height || 372,
    content: `
      <div class="os9-sj">
        <div class="os9-sj-top">
          <div class="os9-sj-art" data-sj-art></div>
          <div class="os9-sj-now">
            <div class="os9-sj-kicker">Now Playing</div>
            <div class="os9-sj-title" data-sj-title>—</div>
            <div class="os9-sj-artist" data-sj-artist>—</div>
            <div class="os9-sj-time"><span data-sj-elapsed>0:00</span> / <span data-sj-total>0:00</span></div>
          </div>
        </div>
        <div class="os9-sj-eq" data-sj-eq>
          ${Array.from({ length: 16 }, () => '<div class="os9-sj-bar"><span></span></div>').join('')}
        </div>
        <div class="os9-sj-list" data-sj-list></div>
        <div class="os9-sj-transport">
          <div class="os9-sj-btn" data-sj-prev>⏮</div>
          <div class="os9-sj-btn play" data-sj-play>▶</div>
          <div class="os9-sj-btn" data-sj-next>⏭</div>
        </div>
      </div>
    `,
  });

  const artEl = win.bodyEl.querySelector('[data-sj-art]');
  const titleEl = win.bodyEl.querySelector('[data-sj-title]');
  const artistEl = win.bodyEl.querySelector('[data-sj-artist]');
  const elapsedEl = win.bodyEl.querySelector('[data-sj-elapsed]');
  const totalEl = win.bodyEl.querySelector('[data-sj-total]');
  const listEl = win.bodyEl.querySelector('[data-sj-list]');
  const bars = [...win.bodyEl.querySelectorAll('.os9-sj-bar span')];
  let active = 0;

  function paintTrack(index) {
    active = index;
    const track = tracks[index];
    if (!track) return;
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist;
    totalEl.textContent = formatMin(track.length);
    artEl.style.background = `linear-gradient(145deg, hsl(${track.hue}, 72%, 62%), hsl(${track.hue}, 48%, 30%))`;
    listEl.innerHTML = tracks
      .map(
        (item, i) => `
        <div class="os9-sj-row${i === active ? ' selected' : ''}" data-sj-row="${i}">
          <span>${i + 1}</span>
          <span>${item.title}</span>
          <span>${item.artist}</span>
          <span>${formatMin(item.length)}</span>
        </div>`,
      )
      .join('');
  }

  paintTrack(0);

  return {
    win,
    playBtn: win.bodyEl.querySelector('[data-sj-play]'),
    nextBtn: win.bodyEl.querySelector('[data-sj-next]'),
    setTrack(index) {
      paintTrack(index);
      elapsedEl.textContent = '0:00';
    },
    setElapsed(seconds) {
      elapsedEl.textContent = formatMin(seconds);
    },
    setLevels(levels) {
      bars.forEach((bar, i) => {
        const amount = Math.max(0.08, Math.min(1, levels[i] || 0));
        bar.style.height = `${Math.round(amount * 100)}%`;
      });
    },
    setPlaying(playing) {
      win.bodyEl.querySelector('[data-sj-play]').textContent = playing ? '❚❚' : '▶';
    },
    getRowEl(index) {
      return listEl.querySelector(`[data-sj-row="${index}"]`);
    },
  };
}

/* =====================================================================
   Scrapbook
   ===================================================================== */
export function createScrapbookWindow(engine, cfg = {}) {
  const pages = [
    {
      title: 'iMac DV',
      html: `
        <div class="os9-scrap-kicker">Apple · 1999</div>
        <div class="os9-scrap-swatches">
          <span style="background:#2f8394"></span>
          <span style="background:#d86c25"></span>
          <span style="background:#834b9c"></span>
          <span style="background:#c43b5a"></span>
          <span style="background:#68a836"></span>
        </div>
        <div class="os9-scrap-caption">Five flavors. Slot-loading DVD. Say hello to iMac DV.</div>
      `,
    },
    {
      title: 'After Dark',
      html: `
        <div class="os9-scrap-hero">${ICONS.flyingToaster}</div>
        <div class="os9-scrap-caption">Flying Toasters, clipped into the Scrapbook.</div>
      `,
    },
    {
      title: 'Clipping',
      html: `
        <div class="os9-scrap-clip">
          Sherlock searches the disk and the Internet.
          The Zip 100 is for backups. Netscape 4.7 still opens the old homepage.
        </div>
      `,
    },
    {
      title: 'Appearance',
      html: `
        <div class="os9-scrap-pattern"></div>
        <div class="os9-scrap-caption">Bondi desktop pattern, saved from Appearance.</div>
      `,
    },
  ];

  const win = engine.createWindow({
    id: cfg.id || 'os9-scrapbook',
    appName: 'Scrapbook',
    appIcon: ICONS.scrapbook,
    title: 'Scrapbook',
    titleIcon: ICONS.scrapbook,
    className: 'scrapbook',
    x: cfg.x,
    y: cfg.y,
    width: 360,
    height: 318,
    zoomable: false,
    content: `
      <div class="os9-scrap">
        <div class="os9-scrap-page" data-scrap-page></div>
        <div class="os9-scrap-bar">
          <div class="os9-btn" data-scrap-prev>◀</div>
          <span data-scrap-count>1 of ${pages.length}</span>
          <div class="os9-btn" data-scrap-next>▶</div>
        </div>
      </div>
    `,
  });

  const pageEl = win.bodyEl.querySelector('[data-scrap-page]');
  const countEl = win.bodyEl.querySelector('[data-scrap-count]');
  let index = 0;

  function render(animate) {
    const page = pages[index];
    pageEl.innerHTML = page.html;
    countEl.textContent = `${index + 1} of ${pages.length}`;
    const titleEl = win.el.querySelector('.os9-title-text span');
    if (titleEl) titleEl.textContent = `Scrapbook — ${page.title}`;
    if (animate) {
      pageEl.classList.remove('turn');
      void pageEl.offsetWidth;
      pageEl.classList.add('turn');
    }
  }

  render(false);

  return {
    win,
    prevBtn: win.bodyEl.querySelector('[data-scrap-prev]'),
    nextBtn: win.bodyEl.querySelector('[data-scrap-next]'),
    next() {
      index = Math.min(pages.length - 1, index + 1);
      render(true);
    },
    prev() {
      index = Math.max(0, index - 1);
      render(true);
    },
  };
}

/* =====================================================================
   Disk First Aid
   ===================================================================== */
export function createDiskFirstAidWindow(engine, cfg = {}) {
  const win = engine.createWindow({
    id: cfg.id || 'os9-dfa',
    appName: 'Disk First Aid',
    appIcon: ICONS.diskFirstAid,
    title: 'Disk First Aid',
    titleIcon: ICONS.diskFirstAid,
    className: 'diskfirstaid',
    x: cfg.x,
    y: cfg.y,
    width: 440,
    height: 318,
    zoomable: false,
    content: `
      <div class="os9-dfa">
        <div class="os9-dfa-lead">Select a volume, then click Verify.</div>
        <div class="os9-dfa-vol selected" data-dfa-vol>
          <span class="os9-checkbox checked"></span>
          <span>Macintosh HD</span>
          <span>4.2 GB</span>
        </div>
        <div class="os9-dfa-vol">
          <span class="os9-checkbox"></span>
          <span>Backup Zip 100</span>
          <span>96 MB</span>
        </div>
        <div class="os9-dfa-actions">
          <div class="os9-btn primary" data-dfa-verify>Verify</div>
          <div class="os9-btn" data-dfa-repair>Repair</div>
        </div>
        <div class="os9-dfa-log" data-dfa-log><div>Disk First Aid is ready.</div></div>
      </div>
    `,
  });

  const logEl = win.bodyEl.querySelector('[data-dfa-log]');
  return {
    win,
    volumeEl: win.bodyEl.querySelector('[data-dfa-vol]'),
    verifyBtn: win.bodyEl.querySelector('[data-dfa-verify]'),
    appendLog(line, kind) {
      const row = document.createElement('div');
      if (kind) row.className = `os9-dfa-${kind}`;
      row.textContent = line;
      logEl.appendChild(row);
      logEl.scrollTop = logEl.scrollHeight;
    },
  };
}

/* =====================================================================
   Finder Get Info
   ===================================================================== */
export function createGetInfoWindow(engine, cfg = {}) {
  const d = engine.getDynamicDateInfo();
  const created = new Date(d.now.getTime() - 1000 * 60 * 60 * 24 * 126);
  const createdStr = created.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const win = engine.createWindow({
    id: cfg.id || 'os9-getinfo',
    appName: 'Finder',
    appIcon: ICONS.finderFace,
    title: `${cfg.name || 'Read Me First'} Info`,
    titleIcon: cfg.icon || ICONS.simpleTextDoc,
    className: 'getinfo',
    x: cfg.x,
    y: cfg.y,
    width: 390,
    height: 312,
    zoomable: false,
    content: `
      <div class="os9-info">
        <div class="os9-info-head">
          <div class="os9-info-icon">${cfg.icon || ICONS.simpleTextDoc}</div>
          <div class="os9-info-name">${cfg.name || 'Read Me First'}</div>
        </div>
        <table class="os9-info-table">
          <tr><td>Kind</td><td>${cfg.kind || 'SimpleText document'}</td></tr>
          <tr><td>Size</td><td>${cfg.size || '12K on disk (4,218 bytes)'}</td></tr>
          <tr><td>Where</td><td>Macintosh HD</td></tr>
          <tr><td>Created</td><td>${createdStr}</td></tr>
          <tr><td>Modified</td><td>${d.fmtOffset(18)}</td></tr>
          <tr><td>Version</td><td>—</td></tr>
        </table>
        <div class="os9-info-comments-label">Comments:</div>
        <div class="os9-info-comments" data-info-comments></div>
        <div class="os9-info-lock" data-info-lock>
          <span class="os9-checkbox" data-info-box></span>
          <span>Locked</span>
        </div>
      </div>
    `,
  });

  const commentsEl = win.bodyEl.querySelector('[data-info-comments]');
  const lockEl = win.bodyEl.querySelector('[data-info-lock]');
  const boxEl = win.bodyEl.querySelector('[data-info-box]');

  return {
    win,
    commentsEl,
    lockEl,
    setLocked(locked) {
      boxEl.classList.toggle('checked', locked);
    },
  };
}
