import { SYS7_ICONS } from './icons.js';
import { SYS7_PATTERNS } from './engine.js';

function formatLongDate(now = new Date()) {
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatShortDate(now = new Date()) {
  return now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * 0. Classic System 7.5 Boot — Happy Mac -> Welcome to Macintosh -> Extensions March
 */
export async function sys7Boot(engine) {
  engine.setStatus('Starting up Macintosh System 7.5…');
  engine.closeAllWindows();
  engine.setCursorKind('watch');

  const boot = document.createElement('div');
  boot.className = 'sys7-boot';
  boot.innerHTML = `
    <div style="width:46px;height:54px;" data-happy>${SYS7_ICONS.happyMac}</div>
    <div class="sys7-ext-march" data-ext-row></div>
  `;
  engine.root.appendChild(boot);
  engine.overlayEl = boot;

  try {
    engine.sounds.bootChime();
    await engine.wait(900);

    // Replace Happy Mac with iconic System 7.5 "Welcome to Macintosh / Mac OS" splash box!
    const happy = boot.querySelector('[data-happy]');
    happy.outerHTML = `
      <div class="sys7-welcome-box">
        <div style="width:58px;height:58px;">${SYS7_ICONS.macOsFace}</div>
        <h1 class="sys7-welcome-title">Welcome to Macintosh.</h1>
        <div class="sys7-welcome-sub">System 7.5 · Starting Up…</div>
      </div>
    `;

    const extRow = boot.querySelector('[data-ext-row]');
    const initIcon = (mark) => `<svg viewBox="0 0 36 36" width="100%" height="100%"><rect x="4" y="4" width="28" height="28" fill="#fff" stroke="#000" stroke-width="2"/>${mark}</svg>`;
    const exts = [
      initIcon('<rect x="10" y="12" width="16" height="12" fill="none" stroke="#000"/><polygon points="15,15 15,21 22,18" fill="#000"/>'),
      initIcon('<circle cx="13" cy="18" r="3" fill="none" stroke="#000"/><circle cx="23" cy="18" r="3" fill="none" stroke="#000"/><path d="M16 18 H20" stroke="#000"/>'),
      initIcon('<rect x="9" y="14" width="8" height="6" fill="none" stroke="#000"/><rect x="19" y="14" width="8" height="6" fill="none" stroke="#000"/>'),
      initIcon('<path d="M12 22 C12 14 24 14 24 22" fill="none" stroke="#000"/><path d="M15 22 V25 H21 V22" fill="none" stroke="#000"/>'),
      SYS7_ICONS.afterDark,
    ];
    for (const ic of exts) {
      const box = document.createElement('div');
      box.className = 'sys7-ext-icon';
      box.innerHTML = ic;
      extRow.appendChild(box);
      await engine.wait(320);
    }

    await engine.wait(650);
    boot.classList.add('fade-out');
    await engine.wait(580);
  } finally {
    boot.remove();
    engine.overlayEl = null;
    engine.setCursorKind('arrow');
  }
}

/**
 * 1. HyperCard 2.2 — Crisp 1-Bit Interactive Stack & HyperTalk Script Peek!
 */
export async function hyperCardStack(engine) {
  engine.setStatus('HyperCard 2.2 — Browsing Stacks & HyperTalk');
  engine.closeAllWindows();
  engine.setAppMenus('HyperCard', ['File', 'Edit', 'Go', 'Tools', 'Objects']);

  await engine.selectDeskIcon('hypercard', { doubleClick: true });
  await engine.wait(220);

  const win = engine.createWindow({
    id: 'hypercard',
    title: 'Home — HyperCard 2.2',
    width: 512,
    height: 344,
    zoom: false,
    bodyHtml: `<div class="sys7-hc-stage" data-hc></div>`,
  });

  const stage = win.body.querySelector('[data-hc]');
  engine.setCursorKind('hand');

  const showCard = async (html) => {
    stage.classList.add('dissolve');
    engine.sounds.cardFlip();
    await engine.wait(210);
    stage.innerHTML = html;
    stage.classList.remove('dissolve');
  };

  stage.innerHTML = `
    <div class="sys7-hc-header">
      <div class="sys7-hc-title">Home</div>
      <div style="font-size:11px;">Card 1 of 5 · ${formatShortDate()}</div>
    </div>
    <div class="sys7-hc-grid">
      <div class="sys7-hc-cardbtn" data-stack="guide">
        <div style="width:30px;height:30px;">${SYS7_ICONS.happyMac}</div>
        <span>Mac Field Guide</span>
      </div>
      <div class="sys7-hc-cardbtn" data-stack="addr">
        <div style="width:30px;height:30px;">${SYS7_ICONS.notePad}</div>
        <span>Addresses</span>
      </div>
      <div class="sys7-hc-cardbtn" data-stack="audio">
        <div style="width:30px;height:30px;">${SYS7_ICONS.afterDark}</div>
        <span>Audio Palette</span>
      </div>
    </div>
    <div class="sys7-hc-nav">
      <span style="font-size:11px;">User Level: <strong>5 — Scripting</strong></span>
      <div style="display:flex;gap:8px;">
        <span class="sys7-btn">◀ Prev</span>
        <span class="sys7-btn">Next ▶</span>
      </div>
    </div>
  `;

  await engine.wait(950);
  await engine.clickEl(stage.querySelector('[data-stack="guide"]'));

  await showCard(`
    <div class="sys7-hc-header">
      <div class="sys7-hc-title">Macintosh Field Guide</div>
      <div style="font-size:11px;">Card 2 of 5</div>
    </div>
    <div style="display:flex;gap:18px;align-items:center;margin:10px 0;">
      <div style="width:68px;height:76px;flex-shrink:0;">${SYS7_ICONS.happyMac}</div>
      <div style="font-size:12px;line-height:1.5;">
        <strong>Macintosh Quadra 650 / System 7.5</strong><br/>
        Motorola 68040 at 33 MHz · 16 MB RAM · 256 Colors.<br/>
        HyperCard turns every Macintosh owner into a software author using stacks, cards, and plain-English HyperTalk scripts.
      </div>
    </div>
    <div class="sys7-hc-nav">
      <span class="sys7-btn" data-hc-script>Edit Script…</span>
      <span class="sys7-btn" data-hc-next>Next Card ▶</span>
    </div>
  `);

  await engine.wait(1150);
  await engine.clickEl(stage.querySelector('[data-hc-script]'));
  engine.setCursorKind('ibeam');

  // Peek at a HyperTalk script window!
  const scriptWin = engine.createWindow({
    id: 'hc-script',
    title: 'Script of card button "Next Card"',
    width: 410,
    height: 215,
    x: 245,
    y: 135,
    bodyHtml: `
      <div style="flex:1;padding:12px 14px;font-family:'Courier New',monospace;font-size:12px;line-height:1.55;white-space:pre;">on mouseUp
  play "Sosumi"
  visual effect dissolve slowly
  go to next card
end mouseUp</div>
    `,
  });
  await engine.wait(1150);
  engine.setCursorKind('arrow');
  await engine.clickCloseWindow('hc-script');

  engine.setCursorKind('hand');
  await engine.clickEl(stage.querySelector('[data-hc-next]'));
  engine.sounds.sosumi();

  await showCard(`
    <div class="sys7-hc-header">
      <div class="sys7-hc-title">HyperTalk — Card 3</div>
      <div style="font-size:11px;">Card 3 of 5</div>
    </div>
    <div style="font-size:12.5px;line-height:1.6;margin:14px 0;">
      <em>"The power to be your best."</em><br/><br/>
      HyperCard cards linked text, crisp 1-bit art, sound effects, and buttons on the Macintosh desktop.
    </div>
    <div class="sys7-hc-nav">
      <span style="font-size:11px;">Stack: Field Guide (48 K)</span>
      <span class="sys7-btn default" data-hc-home>Return Home</span>
    </div>
  `);

  await engine.wait(1250);
  engine.setCursorKind('arrow');
  await engine.clickCloseWindow('hypercard');
  engine.setAppMenus('Finder', ['File', 'Edit', 'View', 'Label', 'Special']);
}

/**
 * 2. Finder 7.5 — Balloon Help (?), Disclosure Triangles & Emptying Trash
 */
export async function finderAndBalloonHelp(engine) {
  engine.setStatus('Finder 7.5 — Guide & List View');
  engine.closeAllWindows();
  engine.setAppMenus('Finder', ['File', 'Edit', 'View', 'Label', 'Special']);

  // Enable System 7's beloved Balloon Help from the `?` menu!
  await engine.pickMenu(
    'help',
    [
      { label: 'About Balloon Help…' },
      { label: 'Show Balloons' },
      { sep: true },
      { label: 'Macintosh Guide', shortcut: '⌘?' },
      { label: 'Shortcuts' },
    ],
    'Show Balloons',
  );

  // Glide over Macintosh HD & Trash to pop System 7 Help Balloons
  const hdEl = engine.root.querySelector('[data-desk="mac-hd"]');
  await engine.moveToEl(hdEl);
  engine.showBalloonNear(
    hdEl,
    'This is your hard disk, "Macintosh HD". Double-click to open it and see its folders and documents.',
  );
  await engine.wait(1200);

  const trashEl = engine.root.querySelector('[data-desk="trash"]');
  await engine.moveToEl(trashEl);
  engine.showBalloonNear(
    trashEl,
    'Trash — Drag icons here to throw them away. Choose Empty Trash from the Special menu to erase them.',
  );
  await engine.wait(1100);
  engine.hideBalloon();

  // Turn off Show Balloons and open Macintosh HD in System 7.5 List View
  await engine.selectDeskIcon('mac-hd', { doubleClick: true });
  await engine.wait(220);

  const hdWin = engine.createWindow({
    id: 'mac-hd',
    title: 'Macintosh HD',
    width: 560,
    height: 270,
    x: 110,
    y: 52,
    bodyHtml: `
      <div class="sys7-finder-bar">
        <span>4 items</span>
        <span>184.2 MB in disk</span>
        <span>315.8 MB available</span>
      </div>
      <div class="sys7-finder-content">
        <div class="sys7-finder-main" data-list>
          <div class="sys7-list-row" style="font-weight:700;border-bottom:1px solid #000;">
            <span></span><span></span><span>Name</span><span>Size</span><span>Kind</span><span>Label</span><span>Date</span>
          </div>
          <div class="sys7-list-row" data-row="sys">
            <span data-tri>▸</span>
            <span style="width:15px;height:15px;">${SYS7_ICONS.systemFolder}</span>
            <span>System Folder</span><span>24.6 MB</span><span>folder</span><span></span><span>9/12/94</span>
          </div>
          <div data-sys-children hidden>
            <div class="sys7-list-row sub">
              <span></span><span style="width:14px;height:14px;">${SYS7_ICONS.folder}</span>
              <span>Control Panels</span><span>2.1 MB</span><span>folder</span><span></span><span>9/12/94</span>
            </div>
            <div class="sys7-list-row sub">
              <span></span><span style="width:14px;height:14px;">${SYS7_ICONS.folder}</span>
              <span>Extensions</span><span>4.8 MB</span><span>folder</span><span></span><span>9/12/94</span>
            </div>
          </div>
          <div class="sys7-list-row">
            <span>▸</span>
            <span style="width:15px;height:15px;">${SYS7_ICONS.folder}</span>
            <span>Applications</span><span>38.4 MB</span><span>folder</span><span></span><span>9/12/94</span>
          </div>
          <div class="sys7-list-row">
            <span></span>
            <span style="width:15px;height:15px;">${SYS7_ICONS.teachText}</span>
            <span>Read Me First</span><span>14 K</span><span>SimpleText document</span><span></span><span>9/12/94</span>
          </div>
          <div class="sys7-list-row" data-row="temp">
            <span></span>
            <span style="width:15px;height:15px;">${SYS7_ICONS.teachText}</span>
            <span>Old_Cache_94</span><span>128 K</span><span>document</span><span></span><span>9/12/94</span>
          </div>
        </div>
        <div class="sys7-vscroll">
          <div class="sys7-scroll-btn">▲</div>
          <div class="sys7-scroll-btn bottom">▼</div>
        </div>
      </div>
    `,
  });

  await engine.wait(550);
  // Click disclosure triangle on System Folder!
  const tri = hdWin.body.querySelector('[data-tri]');
  await engine.clickEl(tri);
  tri.textContent = '▾';
  hdWin.body.querySelector('[data-sys-children]').hidden = false;
  await engine.wait(750);

  // Drag Old_Cache_94 into the Trash -> Trash bulges -> Special -> Empty Trash...
  const tempRow = hdWin.body.querySelector('[data-row="temp"]');
  tempRow.classList.add('selected');
  await engine.wait(220);
  await engine.dragElTo(tempRow, trashEl, 'Old_Cache_94');
  tempRow.remove();
  engine.setTrashFull(true);
  await engine.wait(450);

  await engine.pickMenu(
    'special',
    [
      { label: 'Clean Up Window' },
      { label: 'Empty Trash…' },
      { sep: true },
      { label: 'Eject Disk', shortcut: '⌘E', disabled: true },
      { label: 'Erase Disk…' },
      { sep: true },
      { label: 'Restart' },
      { label: 'Shut Down' },
    ],
    'Empty Trash',
  );
  engine.sounds.trashCrunch();
  engine.setTrashFull(false);
  await engine.wait(750);
  await engine.clickCloseWindow('mac-hd');
}

/**
 * 3. Note Pad 7.5 — Curled Bottom-Left Page Corner Flip & Memo
 */
export async function notePadFlip(engine) {
  engine.setStatus('Note Pad — Flipping Pages & Jotting Notes');
  engine.closeAllWindows();
  engine.setAppMenus('Note Pad', ['File', 'Edit']);

  await engine.pickMenu(
    'apple',
    [
      { label: 'About This Macintosh…' },
      { sep: true },
      { label: 'Control Panels' },
      { label: 'Note Pad' },
      { label: 'Puzzle' },
      { label: 'Scrapbook' },
    ],
    'Note Pad',
  );

  const pages = [
    'System 7.5 Checklist:\n• Install QuickDraw GX\n• Test HyperCard 2.2 stack\n• Back up to 1.44 MB floppies',
    'LocalTalk Printer:\nLaserWriter Select 360\nZone: Graphics Lab\nPaper: US Letter',
    '',
  ];
  let pageIdx = 0;

  const win = engine.createWindow({
    id: 'notepad',
    title: 'Note Pad',
    width: 320,
    height: 255,
    zoom: false,
    bodyHtml: `
      <div class="sys7-notepad">
        <span data-np-text>${pages[0]}</span><span class="sys7-caret"></span>
        <div class="sys7-notepad-fold" data-np-fold title="Next Page"></div>
        <div class="sys7-notepad-page" data-np-num>1</div>
      </div>
    `,
  });

  const textEl = win.body.querySelector('[data-np-text]');
  const foldEl = win.body.querySelector('[data-np-fold]');
  const numEl = win.body.querySelector('[data-np-num]');

  await engine.wait(900);
  for (let p = 1; p <= 2; p++) {
    await engine.clickEl(foldEl);
    engine.sounds.cardFlip();
    pageIdx = p;
    textEl.textContent = pages[pageIdx];
    numEl.textContent = String(pageIdx + 1);
    await engine.wait(650);
  }

  engine.setCursorKind('ibeam');
  await engine.typeText(
    textEl,
    `${formatShortDate()}:\nPicked up After Dark 3.0\nfor the Quadra 650.\nStarry Night looks great!`,
    { charMs: 44 },
  );
  await engine.wait(1000);
  engine.setCursorKind('arrow');
  await engine.clickCloseWindow('notepad');
  engine.setAppMenus('Finder', ['File', 'Edit', 'View', 'Label', 'Special']);
}

/**
 * Stickies — a yellow note left on the desktop.
 */
export async function stickiesNote(engine) {
  engine.setStatus('Stickies');
  engine.closeAllWindows();
  engine.setAppMenus('Stickies', ['File', 'Edit', 'Note']);

  const win = engine.createWindow({
    id: 'stickies',
    title: '',
    width: 230,
    height: 170,
    x: 196,
    y: 86,
    zoom: false,
    bodyHtml: `<div class="sys7-sticky" data-sticky></div>`,
  });
  win.el.classList.add('sys7-stickies');
  const note = win.body.querySelector('[data-sticky]');
  engine.setCursorKind('ibeam');
  await engine.typeText(note, 'Launcher is in the Apple menu.\nThis note stays on the desktop.', { charMs: 36 });
  engine.setCursorKind('arrow');
  await engine.wait(1100);
  await engine.clickCloseWindow('stickies');
  engine.setAppMenus('Finder', ['File', 'Edit', 'View', 'Label', 'Special']);
}

/**
 * 4. TeachText / SimpleText + PlainTalk Speech Manager
 */
export async function teachTextSpeech(engine) {
  engine.setStatus('SimpleText — Writing & PlainTalk Speech');
  engine.closeAllWindows();
  engine.setAppMenus('SimpleText', ['File', 'Edit', 'Font', 'Size', 'Style', 'Sound']);

  const win = engine.createWindow({
    id: 'teachtext',
    title: 'Studio Letter — SimpleText',
    width: 470,
    height: 280,
    bodyHtml: `
      <div class="sys7-teachtext">
        <span data-tt-text></span><span class="sys7-caret"></span>
      </div>
    `,
  });

  const ttEl = win.body.querySelector('[data-tt-text]');
  engine.setCursorKind('ibeam');
  await engine.typeText(
    ttEl,
    `${formatLongDate()}\n\nDear Classic Mac Enthusiast,\n\nMacintosh System 7.5 makes everyday work effortless — from HyperCard stacks to crisp 1-bit windows and built-in PlainTalk speech.\n\n— Sent from Macintosh HD`,
    { charMs: 32 },
  );
  await engine.wait(500);
  engine.setCursorKind('arrow');

  // Sound -> Speak All
  await engine.pickMenu(
    'sound',
    [
      { label: 'Speak All' },
      { label: 'Stop Speaking', shortcut: '⌘.' },
      { sep: true },
      { label: 'Voices  ▸  Fred' },
    ],
    'Speak All',
  );

  const badge = document.createElement('div');
  badge.className = 'sys7-speak-badge';
  badge.textContent = '♪ Speaking (Voice: Fred)…';
  win.body.appendChild(badge);
  await engine.wait(1400);
  badge.textContent = '♪ Speech complete';
  await engine.wait(650);

  await engine.clickCloseWindow('teachtext');
  engine.setAppMenus('Finder', ['File', 'Edit', 'View', 'Label', 'Special']);
}

/**
 * 5. Desktop Patterns Control Panel — Live 8x8 Dither Pattern Switcher
 */
export async function desktopPatternsPanel(engine) {
  engine.setStatus('Control Panels — Desktop Patterns');
  engine.closeAllWindows();
  engine.setAppMenus('Finder', ['File', 'Edit', 'View', 'Label', 'Special']);

  await engine.pickMenu(
    'apple',
    [
      { label: 'About This Macintosh…' },
      { sep: true },
      { label: 'Control Panels' },
      { label: 'Note Pad' },
      { label: 'Puzzle' },
    ],
    'Control Panels',
  );

  let previewIdx = engine.patternIndex;
  const win = engine.createWindow({
    id: 'desk-patterns',
    title: 'Desktop Patterns',
    width: 340,
    height: 250,
    zoom: false,
    bodyHtml: `
      <div class="sys7-patterns-panel">
        <div class="sys7-pat-preview" data-pat-box></div>
        <div style="font-weight:700;font-size:11.5px;" data-pat-name></div>
        <div class="sys7-pat-controls">
          <div class="sys7-btn" data-pat-prev>◀</div>
          <div class="sys7-btn default" data-pat-set>Set Desktop Pattern</div>
          <div class="sys7-btn" data-pat-next>▶</div>
        </div>
      </div>
    `,
  });

  const box = win.body.querySelector('[data-pat-box]');
  const nameEl = win.body.querySelector('[data-pat-name]');
  const nextBtn = win.body.querySelector('[data-pat-next]');
  const setBtn = win.body.querySelector('[data-pat-set]');

  const renderPreview = () => {
    const p = SYS7_PATTERNS[previewIdx];
    box.style.backgroundColor = p.bgColor;
    box.style.backgroundImage = p.bgImage;
    box.style.backgroundSize = p.bgSize;
    box.style.backgroundPosition = p.bgPos;
    nameEl.textContent = `${p.name} (${previewIdx + 1} of ${SYS7_PATTERNS.length})`;
  };

  renderPreview();
  await engine.wait(650);

  // Browse 2 patterns and apply the second one live!
  for (let i = 0; i < 2; i++) {
    await engine.clickEl(nextBtn);
    previewIdx = (previewIdx + 1) % SYS7_PATTERNS.length;
    renderPreview();
    await engine.wait(480);
  }

  await engine.clickEl(setBtn);
  engine.sounds.cardFlip();
  engine.applyPattern(previewIdx);
  await engine.wait(1100);
  await engine.clickCloseWindow('desk-patterns');
}

/**
 * 6. Classic System 7.5 15-Tile Picture Puzzle Desk Accessory
 */
export async function puzzleDeskAccessory(engine) {
  engine.setStatus('Puzzle — Sliding Mac OS 15-Tile DA');
  engine.closeAllWindows();

  await engine.pickMenu(
    'apple',
    [
      { label: 'About This Macintosh…' },
      { sep: true },
      { label: 'Control Panels' },
      { label: 'Note Pad' },
      { label: 'Puzzle' },
    ],
    'Puzzle',
  );

  // 4x4 grid (0 = empty slot) with retro Apple rainbow band colors
  const colors = {
    1: '#61bb46', 2: '#61bb46', 3: '#61bb46', 4: '#61bb46',
    5: '#fdb827', 6: '#fdb827', 7: '#fdb827', 8: '#fdb827',
    9: '#f5821f', 10: '#f5821f', 11: '#e03a3e', 12: '#e03a3e',
    13: '#963d97', 14: '#009ddc', 15: '#009ddc',
  };
  const board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 13, 14, 15, 12];

  const win = engine.createWindow({
    id: 'puzzle',
    title: 'Puzzle',
    width: 248,
    height: 252,
    zoom: false,
    bodyHtml: `
      <div class="sys7-puzzle-wrap">
        <div class="sys7-puzzle-board" data-pboard></div>
        <div style="font-size:10.5px;color:#333;">Classic Apple Menu Desk Accessory</div>
      </div>
    `,
  });

  const boardEl = win.body.querySelector('[data-pboard]');
  const renderBoard = () => {
    boardEl.innerHTML = board
      .map((val, idx) =>
        val === 0
          ? `<div class="sys7-ptile empty" data-idx="${idx}"></div>`
          : `<div class="sys7-ptile" data-idx="${idx}" style="background:${colors[val]};color:#fff;text-shadow:1px 1px 0 #000;">${val}</div>`,
      )
      .join('');
  };

  renderBoard();
  await engine.wait(650);

  // Slide tiles cleanly toward solved order!
  const moves = [11, 15, 14, 10, 11, 15];
  for (const tileIdx of moves) {
    const tileEl = boardEl.querySelector(`[data-idx="${tileIdx}"]`);
    if (tileEl) {
      await engine.clickEl(tileEl);
      const emptyIdx = board.indexOf(0);
      [board[emptyIdx], board[tileIdx]] = [board[tileIdx], board[emptyIdx]];
      engine.sounds.tileSlide();
      renderBoard();
      await engine.wait(320);
    }
  }

  engine.sounds.sosumi();
  await engine.wait(900);
  await engine.clickCloseWindow('puzzle');
}

/**
 * 7. About This Macintosh… (System Software 7.5.3 Memory Bars)
 */
export async function aboutThisMacintosh(engine) {
  engine.setStatus('About This Macintosh — System Software 7.5');
  engine.closeAllWindows();

  await engine.pickMenu(
    'apple',
    [
      { label: 'About This Macintosh…' },
      { sep: true },
      { label: 'Control Panels' },
      { label: 'Note Pad' },
      { label: 'Puzzle' },
    ],
    'About This Macintosh',
  );

  const win = engine.createWindow({
    id: 'about-mac',
    title: 'About This Macintosh',
    width: 455,
    height: 248,
    zoom: false,
    bodyHtml: `
      <div class="sys7-about">
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #000;padding-bottom:8px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:36px;height:36px;">${SYS7_ICONS.macOsFace}</div>
            <div>
              <div style="font-family:'New York',Georgia,serif;font-size:17px;font-weight:700;">Macintosh Quadra 650</div>
              <div style="font-size:11px;">System Software 7.5  © Apple Computer, Inc. 1983–1994</div>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;">
          <span><strong>Built-in Memory:</strong> 16,384 K</span>
          <span><strong>Largest Unused Block:</strong> 11,592 K</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;margin-top:4px;">
          <div class="sys7-ram-row">
            <span>System Software</span><span>4,180 K</span>
            <div class="sys7-ram-bar"><div class="sys7-ram-fill" data-bar="0" style="width:0%"></div></div>
          </div>
          <div class="sys7-ram-row">
            <span>Finder</span><span>612 K</span>
            <div class="sys7-ram-bar"><div class="sys7-ram-fill" data-bar="1" style="width:0%"></div></div>
          </div>
        </div>
      </div>
    `,
  });

  await engine.wait(220);
  win.body.querySelector('[data-bar="0"]').style.width = '26%';
  win.body.querySelector('[data-bar="1"]').style.width = '8%';

  await engine.wait(1900);
  await engine.clickCloseWindow('about-mac');
}

/**
 * 8. After Dark 3.0: Starry Night (1994 Midnight City Skyline Cameo!)
 */
export async function afterDarkStarryNight(engine) {
  engine.setStatus('After Dark 3.0 — Starry Night');
  engine.closeAllWindows();

  const overlay = document.createElement('div');
  overlay.className = 'sys7-afterdark';
  const canvas = document.createElement('canvas');
  overlay.appendChild(canvas);
  engine.root.appendChild(overlay);
  engine.overlayEl = overlay;

  const w = (canvas.width = window.innerWidth || 1280);
  const h = (canvas.height = window.innerHeight || 720);
  const ctx = canvas.getContext('2d');

  // Generate stars
  const stars = Array.from({ length: 130 }, () => ({
    x: Math.random() * w,
    y: Math.random() * (h * 0.68),
    r: Math.random() < 0.25 ? 1.8 : 1.1,
    phase: Math.random() * Math.PI * 2,
  }));

  // Generate classic After Dark skyscraper skyline with grid windows
  const buildings = [];
  let bx = 0;
  while (bx < w + 40) {
    const bw = 46 + Math.floor(Math.random() * 64);
    const bh = Math.floor(h * (0.2 + Math.random() * 0.34));
    const cols = Math.max(3, Math.floor((bw - 12) / 11));
    const rows = Math.max(4, Math.floor((bh - 18) / 14));
    const wins = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        wins.push({
          x: bx + 8 + c * 11,
          y: h - bh + 12 + r * 14,
          lit: Math.random() < 0.34,
          color: Math.random() < 0.78 ? '#ffe27a' : '#9ee2ff',
        });
      }
    }
    buildings.push({ x: bx, y: h - bh, w: bw, h: bh, wins });
    bx += bw - 4;
  }

  try {
    const frames = 95;
    for (let f = 0; f < frames; f++) {
      engine.checkAbort();
      while (engine.paused) await engine.wait(40);

      // Night sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#030616');
      grad.addColorStop(0.65, '#0b1638');
      grad.addColorStop(1, '#152248');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Crescent moon
      ctx.fillStyle = '#fff3b0';
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.17, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#060c24';
      ctx.beginPath();
      ctx.arc(w * 0.82 + 10, h * 0.17 - 5, 24, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling stars
      for (const s of stars) {
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.phase + f * 0.09));
        ctx.fillStyle = `rgba(255,255,240,${alpha.toFixed(2)})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }

      // Buildings & flickering office lights
      for (const b of buildings) {
        ctx.fillStyle = '#070b18';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#182442';
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        for (const win of b.wins) {
          if (Math.random() < 0.004) win.lit = !win.lit;
          if (win.lit) {
            ctx.fillStyle = win.color;
            ctx.fillRect(win.x, win.y, 6, 8);
          }
        }
      }

      await engine.wait(65);
    }

    // Wake up back to System 7.5 desktop!
    await engine.moveTo(w * 0.42, h * 0.45, 280);
    overlay.classList.add('fade-out');
    await engine.wait(480);
  } finally {
    overlay.remove();
    engine.overlayEl = null;
  }
}

export const REGULAR_VIGNETTES = [
  hyperCardStack,
  finderAndBalloonHelp,
  notePadFlip,
  stickiesNote,
  teachTextSpeech,
  desktopPatternsPanel,
  puzzleDeskAccessory,
  aboutThisMacintosh,
  afterDarkStarryNight,
];

export const SPECIAL_VIGNETTES = {
  'sys7-boot': sys7Boot,
  hypercard: hyperCardStack,
  'after-dark-city': afterDarkStarryNight,
  'desktop-patterns': desktopPatternsPanel,
};
