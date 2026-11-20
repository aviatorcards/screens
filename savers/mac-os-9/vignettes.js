import { ICONS } from './icons.js';
import { DESKTOP_PATTERNS, HIGHLIGHT_COLORS } from './wallpapers.js';
import {
  createFinderWindow,
  createSimpleTextWindow,
  createStickyWindow,
  createCalculatorWindow,
  createSherlockWindow,
  createNetscapeWindow,
  createAIMBuddyList,
  createAIMChatWindow,
  createOutlookWindow,
  createPaintWindow,
  createAppearanceWindow,
  createCopyDialog,
  createAlertDialog,
  createAboutWindow,
  createQuickTimeWindow,
  createSoundJamWindow,
  createScrapbookWindow,
  createDiskFirstAidWindow,
  createGetInfoWindow,
} from './apps.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =====================================================================
   1. Finder & Trash Cleanup
   ===================================================================== */
async function finderCleanup(engine, signal) {
  engine.onStatus('Finder — Organizing Macintosh HD');
  engine.closeNonPersistentWindows(1);

  const hdIcon = engine.desktopIcons.get('mac-hd').el;
  const trashIcon = engine.desktopIcons.get('trash').el;

  engine.selectDesktopIcon('mac-hd');
  await engine.doubleClick(hdIcon, signal);
  engine.selectDesktopIcon(null);

  const d = engine.getDynamicDateInfo();
  const box = engine.getSafeDesktopBox();
  const finder = createFinderWindow(engine, {
    id: 'win-mac-hd',
    title: 'Macintosh HD',
    titleIcon: ICONS.macHd,
    x: box.left + 44,
    y: box.top + 32,
    width: 490,
    height: 300,
    view: 'icons',
    items: [
      { id: 'sys', name: 'System Folder', icon: ICONS.systemFolder, date: d.fmtOffset(1620), size: '--', kind: 'folder' },
      { id: 'apps', name: 'Applications (Mac OS 9)', icon: ICONS.folder, date: d.fmtOffset(940), size: '--', kind: 'folder' },
      { id: 'docs', name: 'Documents', icon: ICONS.folder, date: d.fmtOffset(64), size: '--', kind: 'folder' },
      { id: 'util', name: 'Utilities', icon: ICONS.folder, date: d.fmtOffset(2880), size: '--', kind: 'folder' },
      { id: 'tmp1', name: 'Temp_Cache.tmp', icon: ICONS.simpleTextDoc, date: d.fmtOffset(42), size: '184 K', kind: 'document' },
      { id: 'tmp2', name: 'Old_Installer.hqx', icon: ICONS.simpleTextDoc, date: d.fmtOffset(510), size: '2.4 MB', kind: 'BinHex document' },
    ],
  });

  await engine.wait(900, signal);

  // Switch to List View via menu bar
  await engine.openMenuAndPick('view', 'as List', signal);
  finder.setView('list');
  await engine.wait(850, signal);

  // Select and drag Temp_Cache.tmp to Trash
  finder.selectItem('tmp1');
  const itemEl = finder.getItemEl('tmp1');
  if (itemEl) {
    await engine.click(itemEl, { afterMs: 220 }, signal);
    await engine.drag(itemEl, trashIcon, `${ICONS.simpleTextDoc}<span>Temp_Cache.tmp</span>`, signal);
    finder.removeItem('tmp1');
    engine.setTrashFull(true);
    await engine.wait(550, signal);
  }

  // Empty Trash via Special menu
  await engine.openMenuAndPick('special', 'Empty Trash…', signal);
  engine.sounds.sosumi();

  const alert = createAlertDialog(engine, {
    title: 'Empty Trash',
    icon: ICONS.caution,
    heading: 'Are you sure you want to permanently remove the items in the Trash?',
    body: 'The Trash contains 1 item (184 K). You cannot undo this action.',
    primaryLabel: 'OK',
    secondaryLabel: 'Cancel',
  });

  await engine.wait(700, signal);
  await engine.click(alert.primaryBtn, { pressClass: 'pressed', afterMs: 140 }, signal);
  engine.closeWindow(alert.win);
  engine.sounds.trashEmpty();
  engine.setTrashFull(false);
  await engine.wait(650, signal);

  // WindowShade Finder briefly, then close
  await engine.click(finder.win.shadeBtn, { afterMs: 180 }, signal);
  engine.shadeWindow(finder.win, true);
  await engine.wait(700, signal);
  await engine.click(finder.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(finder.win);
}

/* =====================================================================
   2. SimpleText — Live Journal / Memo Typing
   ===================================================================== */
async function simpleTextJournal(engine, signal) {
  engine.onStatus('SimpleText — Writing notes');
  engine.closeNonPersistentWindows(1);

  const readmeIcon = engine.desktopIcons.get('readme').el;
  engine.selectDesktopIcon('readme');
  await engine.doubleClick(readmeIcon, signal);
  engine.selectDesktopIcon(null);

  const d = engine.getDynamicDateInfo();
  const box = engine.getSafeDesktopBox();
  const entries = [
    `Mac OS 9.2 Studio Notes — ${d.headerDate}\n----------------------------------------\n\n• Cleaned up Macintosh HD and freed 184 KB.\n• Burned latest project archive to Backup Zip 100.\n• Remember to test the new site in Netscape 4.7 at 1024x768.\n• Still amazed how snappy this PowerPC G4 feels at ${d.timeStr}.`,
    `Ideas for ${d.weekday} — ${d.shortDate}\n==============================\n\n1. Play the studio playlist in iTunes.\n2. Sort desktop patterns in Appearance Manager.\n3. Render a QuickTime 5 preview before dinner.\n4. Don't forget to check AIM & Outlook Express later!`,
    `Quick ReadMe — ${d.headerDate}\n------------------------------\n\nEverything is backed up on the blue Zip 100 disk.\nIf Sherlock 2 finishes indexing Macintosh HD, we'll have instant file search across all folders.\n\nSigned at ${d.timeStr} on Mac OS 9.2.2.`,
  ];

  const st = createSimpleTextWindow(engine, {
    id: 'win-simpletext',
    title: 'Read Me First',
    x: box.left + randInt(50, 110),
    y: box.top + randInt(34, 70),
    width: 445,
    height: 278,
  });

  await engine.moveToElement(st.docEl, 0.25, 0.25, null, signal);
  engine.setCursorMode('ibeam');
  await engine.click(null, { afterMs: 160 }, signal);

  await engine.typeText(st.docEl, pickRandom(entries), { delay: 46, caret: true, allowTypo: true }, signal);
  await engine.wait(900, signal);

  engine.setCursorMode('arrow');
  await engine.openMenuAndPick('file', 'Save', signal);
  await engine.wait(650, signal);
  await engine.click(st.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(st.win);
}

/* =====================================================================
   3. Stickies — Pastel Desktop Reminders
   ===================================================================== */
async function stickiesNotes(engine, signal) {
  engine.onStatus('Stickies — Jotting a reminder');
  const d = engine.getDynamicDateInfo();
  const box = engine.getSafeDesktopBox();

  const colors = ['yellow', 'pink', 'blue', 'green'];
  const chosenColor = pickRandom(colors);
  const existing = engine.windows.get('win-sticky-main');
  if (existing) engine.closeWindow(existing);

  const notes = [
    `${d.shortDate} · To-Do:\n- Empty Trash\n- Sync Zip 100 backup\n- Reply to Alex on AIM\n- Check MacNN news`,
    `Desktop Notes (${d.weekday}):\nTry the Bondi iMac pattern in Appearance Manager!\n\nCurrent time: ${d.timeStr}`,
    `Mac OS 9 Shortcuts:\n⌘W  Close Window\n⌘M  Make Alias\n⌘F  Sherlock 2\nDouble-click title bar for WindowShade!`,
  ];

  const sticky = createStickyWindow(engine, {
    id: 'win-sticky-main',
    color: chosenColor,
    title: `Sticky — ${d.shortWeekday}`,
    x: box.left + 20,
    y: box.top + box.height - 178,
    width: 224,
    persistent: true,
  });

  await engine.moveToElement(sticky.bodyEl, 0.3, 0.3, null, signal);
  engine.setCursorMode('ibeam');
  await engine.click(null, { afterMs: 120 }, signal);
  await engine.typeText(
    sticky.bodyEl,
    pickRandom(notes),
    { delay: 48, caret: true, removeCaretAtEnd: true, allowTypo: true },
    signal,
  );
  engine.setCursorMode('arrow');
  await engine.wait(650, signal);

  // Gently nudge sticky slightly for authentic lived-in feel
  await engine.moveWindowSmooth(sticky.win, box.left + randInt(16, 42), box.top + box.height - randInt(170, 200), 460, signal);
  await engine.wait(700, signal);
}

/* =====================================================================
   4. Netscape Communicator 4.7 — Late-90s Web Surfing
   ===================================================================== */
async function netscapeSurf(engine, signal) {
  engine.onStatus('Netscape 4.7 — Browsing 1999 web');
  engine.closeNonPersistentWindows(1);

  const box = engine.getSafeDesktopBox();
  const ns = createNetscapeWindow(engine, {
    x: box.left + randInt(48, 120),
    y: box.top + randInt(22, 54),
    width: 560,
    height: 378,
  });

  const navigate = async (pageKey, hostLabel) => {
    ns.setLoading(true, `Connecting to ${hostLabel}…`);
    engine.setCursorMode('watch');
    await engine.wait(520, signal);
    ns.setLoading(true, `Transferring data from ${hostLabel} (14.4 KB/s)…`);
    ns.renderPage(pageKey);
    await engine.wait(640, signal);
    ns.setLoading(false, 'Document: Done');
    engine.setCursorMode('arrow');
  };

  await navigate('apple', 'www.apple.com');
  await engine.wait(1100, signal);

  // Smoothly scroll down a bit
  ns.scrollPage(34);
  await engine.wait(900, signal);

  // Click link to MacNN
  const macnnLink = ns.getLink('macnn');
  if (macnnLink) {
    await engine.click(macnnLink, { afterMs: 140 }, signal);
  }
  await navigate('macnn', 'www.macnn.com');
  await engine.wait(1300, signal);

  // Click link to GeoCities fan page
  const geoLink = ns.getLink('geocities');
  if (geoLink) {
    await engine.click(geoLink, { afterMs: 140 }, signal);
  }
  await navigate('geocities', 'www.geocities.com');
  await engine.wait(1500, signal);

  // Hit Back button
  const backBtn = ns.getBtn('back');
  await engine.click(backBtn, { pressClass: 'pressed', afterMs: 150 }, signal);
  await navigate('yahoo', 'www.yahoo.com');
  await engine.wait(1200, signal);

  await engine.click(ns.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(ns.win);
}

/* =====================================================================
   5. Sherlock 2 — Brushed-Silver Search
   ===================================================================== */
async function sherlockSearch(engine, signal) {
  engine.onStatus('Sherlock 2 — Searching channels');
  engine.closeNonPersistentWindows(1);

  await engine.openMenuAndPick('apple', 'Sherlock 2', signal);

  const box = engine.getSafeDesktopBox();
  const sh = createSherlockWindow(engine, {
    x: box.left + randInt(60, 140),
    y: box.top + randInt(28, 66),
  });

  const searches = [
    {
      channel: 'apple',
      query: 'Mac OS 9.2 updates',
      results: [
        { title: 'Mac OS 9.2.2 Update — Apple Support', score: 98, site: 'support.apple.com', summary: '<strong>Mac OS 9.2.2</strong> improves Classic environment compatibility, Finder responsiveness, and USB/FireWire audio stability.' },
        { title: 'Sherlock 2 Channel Plug-ins Guide', score: 86, site: 'apple.com/sherlock', summary: 'Add custom search plug-ins to Sherlock 2 to query Apple TIL, VersionTracker, and reference sites right from your desktop.' },
        { title: 'QuickTime 5 for Macintosh', score: 74, site: 'apple.com/quicktime', summary: 'Stream live media, interactive VR panoramas, and Sorenson Video movies directly in QuickTime Player.' },
        { title: 'CarbonLib for Mac OS 9', score: 65, site: 'info.apple.com', summary: 'Runtime library for Carbon applications on Mac OS 9.' },
      ],
    },
    {
      channel: 'internet',
      query: 'iMac DV FireWire',
      results: [
        { title: 'Say Hello to iMac DV Special Edition', score: 96, site: 'www.apple.com', summary: '<strong>400MHz PowerPC G3</strong>, Graphite translucent enclosure, dual 400Mbps FireWire ports, and iMovie included.' },
        { title: 'MacNN Review: iMac DV & iMovie', score: 89, site: 'www.macnn.com', summary: 'Desktop video editing has never been easier — plug in a DV camcorder and edit clips right out of the box.' },
        { title: 'RAM Upgrade Guide (PC100 SDRAM)', score: 72, site: 'www.everymac.com', summary: 'The iMac takes 144-pin PC100 SO-DIMMs through the bottom access door.' },
        { title: 'AirPort 802.11b Wireless Card Setup', score: 61, site: 'til.info.apple.com', summary: 'Snap in an AirPort card for 11 Mbps wireless networking across your home or studio.' },
      ],
    },
  ];

  const scenario = pickRandom(searches);

  // Click target channel
  const chEl = sh.getChannelEl(scenario.channel);
  if (chEl) {
    await engine.click(chEl, { afterMs: 160 }, signal);
    sh.setActiveChannel(scenario.channel);
  }

  // Type query
  await engine.moveToElement(sh.inputEl, 0.25, 0.5, null, signal);
  engine.setCursorMode('ibeam');
  await engine.click(null, { afterMs: 120 }, signal);
  await engine.typeText(sh.inputEl, scenario.query, { delay: 54, caret: true, removeCaretAtEnd: true }, signal);
  engine.setCursorMode('arrow');

  // Click green magnifying glass button
  await engine.click(sh.goBtn, { afterMs: 120 }, signal);
  sh.setSearching(true, `Searching ${scenario.channel} channels for "${scenario.query}"…`);
  engine.setCursorMode('watch');
  await engine.wait(1250, signal);

  engine.setCursorMode('arrow');
  sh.setSearching(false, `Found ${scenario.results.length} matching items.`);
  sh.setResults(scenario.results);
  engine.sounds.menuTick();
  await engine.wait(500, signal);

  // Click first two rows to inspect summaries
  for (let i = 0; i < 2; i++) {
    const row = sh.getRowEl(i);
    if (row) {
      await engine.click(row, { afterMs: 160 }, signal);
      sh.selectRow(i, scenario.results[i].summary);
      await engine.wait(1100, signal);
    }
  }

  await engine.click(sh.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(sh.win);
}

/* =====================================================================
   6. AOL Instant Messenger 4.0 — Buddy List & Live IM
   ===================================================================== */
async function aimChat(engine, signal) {
  engine.onStatus('AIM 4.0 — Chatting with BondiBlue99');
  engine.closeNonPersistentWindows(1);

  const box = engine.getSafeDesktopBox();
  const list = createAIMBuddyList(engine, {
    x: box.left + 26,
    y: box.top + 32,
  });

  await engine.wait(650, signal);
  const buddyEl = list.getBuddyEl('BondiBlue99');
  list.selectBuddy('BondiBlue99');
  await engine.doubleClick(buddyEl, signal);

  const chat = createAIMChatWindow(engine, {
    buddy: 'BondiBlue99',
    x: box.left + 236,
    y: box.top + 68,
  });

  const scripts = [
    [
      { from: 'BondiBlue99', text: 'hey!! did u try Mac OS 9.2 yet?' },
      { me: true, text: 'yep, running it right now — Platinum UI looks so crisp' },
      { from: 'BondiBlue99', text: 'awesome!! bring ur Zip 100 disk tonight, got new MP3s' },
      { me: true, text: 'on it! see u soon :)' },
    ],
    [
      { from: 'BondiBlue99', text: 'yo u around? did the new QuickTime trailer finish downloading?' },
      { me: true, text: 'almost! 56K modem is holding steady at 4.8 KB/s lol' },
      { from: 'BondiBlue99', text: 'classic haha. brb grabbing soda' },
    ],
  ];

  const convo = pickRandom(scripts);

  for (const turn of convo) {
    if (turn.me) {
      await engine.moveToElement(chat.inputEl, 0.3, 0.4, null, signal);
      engine.setCursorMode('ibeam');
      await engine.click(null, { afterMs: 120 }, signal);
      await engine.typeText(chat.inputEl, turn.text, { delay: 48, caret: true, removeCaretAtEnd: true }, signal);
      engine.setCursorMode('arrow');
      await engine.click(chat.sendBtn, { pressClass: 'pressed', afterMs: 100 }, signal);
      chat.clearInput();
      chat.addMessage('MacUser99', turn.text, true);
      engine.sounds.aimChime(false);
      await engine.wait(900, signal);
    } else {
      await engine.wait(700, signal);
      chat.addMessage(turn.from, turn.text, false);
      engine.sounds.aimChime(true);
      await engine.wait(850, signal);
    }
  }

  await engine.wait(700, signal);
  await engine.click(chat.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(chat.win);
  await engine.click(list.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(list.win);
}

/* =====================================================================
   7. AppleWorks Paint — Live Stroke-by-Stroke Retro Doodling
   ===================================================================== */
async function paintDoodle(engine, signal) {
  engine.onStatus('AppleWorks Paint — Doodling retro art');
  engine.closeNonPersistentWindows(1);

  const box = engine.getSafeDesktopBox();
  const paint = createPaintWindow(engine, {
    x: box.left + randInt(70, 150),
    y: box.top + randInt(28, 60),
  });

  const canvasRectPoint = (cx, cy) => {
    const rootRect = engine.root.getBoundingClientRect();
    const r = paint.canvas.getBoundingClientRect();
    return {
      x: r.left - rootRect.left + (cx / paint.canvas.width) * r.width,
      y: r.top - rootRect.top + (cy / paint.canvas.height) * r.height,
    };
  };

  const pickColor = async (hex) => {
    const sw = paint.getSwatchEl(hex);
    if (sw) {
      await engine.click(sw, { afterMs: 100 }, signal);
      paint.setActiveSwatch(hex);
    }
  };

  const drawStroke = async (points, color, width = 4) => {
    const ctx = paint.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const p0 = canvasRectPoint(points[0][0], points[0][1]);
    await engine.moveTo(p0.x, p0.y, 260, signal);

    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];
      const steps = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) / 8));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const nx = x1 + (x2 - x1) * t;
        const ny = y1 + (y2 - y1) * t;
        ctx.beginPath();
        ctx.moveTo(x1 + (x2 - x1) * ((s - 1) / steps), y1 + (y2 - y1) * ((s - 1) / steps));
        ctx.lineTo(nx, ny);
        ctx.stroke();

        const scr = canvasRectPoint(nx, ny);
        engine.cursor.x = scr.x;
        engine.cursor.y = scr.y;
        engine._renderCursor();
        await engine.wait(16, signal);
      }
    }
  };

  const drawMode = pickRandom(['imac', 'sunset']);

  if (drawMode === 'imac') {
    // Draw a charming Bondi Blue iMac G3!
    await pickColor('#2c868e');
    await drawStroke(
      [
        [102, 185], [96, 120], [116, 62], [178, 46], [240, 62], [260, 120], [254, 185], [102, 185],
      ],
      '#2c868e',
      8,
    );
    // Base foot
    await drawStroke([[130, 188], [114, 212], [242, 212], [226, 188]], '#2c868e', 6);

    // Screen frame
    await pickColor('#3366cc');
    await drawStroke(
      [
        [124, 84], [232, 84], [232, 158], [124, 158], [124, 84],
      ],
      '#3366cc',
      5,
    );
    // Happy Mac face inside screen
    await pickColor('#111111');
    await drawStroke([[156, 108], [156, 120]], '#111111', 5);
    await drawStroke([[200, 108], [200, 120]], '#111111', 5);
    await drawStroke([[154, 136], [178, 146], [202, 136]], '#111111', 4);
    // Green power button
    await pickColor('#61bb46');
    await drawStroke([[178, 174], [179, 174]], '#61bb46', 7);
  } else {
    // Draw a retro rainbow horizon landscape!
    await pickColor('#fdb827');
    await drawStroke(
      [
        [142, 142], [150, 112], [178, 98], [206, 112], [214, 142],
      ],
      '#fdb827',
      10,
    );
    await pickColor('#e03a3e');
    await drawStroke([[54, 148], [302, 148]], '#e03a3e', 5);
    await pickColor('#963d97');
    await drawStroke([[54, 170], [118, 116], [176, 166], [242, 104], [302, 170]], '#963d97', 5);
    await pickColor('#3366cc');
    await drawStroke([[60, 194], [296, 194]], '#3366cc', 4);
    await drawStroke([[88, 214], [268, 214]], '#3366cc', 3);
  }

  await engine.wait(1400, signal);
  await engine.click(paint.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(paint.win);
}

/* =====================================================================
   8. Classic Mac OS 9 Calculator
   ===================================================================== */
async function calculatorMath(engine, signal) {
  engine.onStatus('Calculator — Crunching upgrade numbers');
  await engine.openMenuAndPick('apple', 'Calculator', signal);

  const box = engine.getSafeDesktopBox();
  const calc = createCalculatorWindow(engine, {
    x: box.left + box.width - 220,
    y: box.top + 48,
  });

  const equations = [
    { seq: ['1', '2', '9', '9', '+', '1', '4', '9', '+', '7', '9', 'eq'], displays: ['1', '12', '129', '1299', '1299', '1', '14', '149', '1448', '7', '79', '1527'] },
    { seq: ['6', '4', '*', '2', 'eq'], displays: ['6', '64', '64', '2', '128'] },
    { seq: ['1', '9', '9', '9', '+', '1', 'eq'], displays: ['1', '19', '199', '1999', '1999', '1', '2000'] },
  ];

  const eq = pickRandom(equations);
  for (let i = 0; i < eq.seq.length; i++) {
    const keyEl = calc.getKeyEl(eq.seq[i]);
    if (keyEl) {
      await engine.click(keyEl, { pressClass: 'pressed', duration: 240, afterMs: 110 }, signal);
      calc.setDisplay(eq.displays[i]);
    }
  }

  await engine.wait(1100, signal);
  await engine.click(calc.getKeyEl('C'), { pressClass: 'pressed', duration: 280, afterMs: 160 }, signal);
  calc.setDisplay('0');
  await engine.wait(450, signal);
  await engine.click(calc.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(calc.win);
}

/* =====================================================================
   9. Zip 100 Backup — Platinum Candy-Stripe Copy Progress
   ===================================================================== */
async function zipBackup(engine, signal) {
  engine.onStatus('Finder — Backing up to Zip 100');
  engine.closeNonPersistentWindows(1);

  const projectsIcon = engine.desktopIcons.get('projects').el;
  const zipIcon = engine.desktopIcons.get('zip-100').el;

  engine.selectDesktopIcon('projects');
  await engine.doubleClick(projectsIcon, signal);
  engine.selectDesktopIcon(null);

  const d = engine.getDynamicDateInfo();
  const box = engine.getSafeDesktopBox();
  const projWin = createFinderWindow(engine, {
    id: 'win-projects',
    title: 'Projects',
    titleIcon: ICONS.folder,
    x: box.left + 64,
    y: box.top + 52,
    width: 440,
    height: 240,
    view: 'list',
    statusText: '4 items, 1.84 GB available',
    items: [
      { id: 'site', name: 'Website_Final_v2', icon: ICONS.folder, date: d.fmtOffset(18), size: '14.2 MB', kind: 'folder' },
      { id: 'logo', name: 'Logo_Vector.eps', icon: ICONS.simpleTextDoc, date: d.fmtOffset(95), size: '640 K', kind: 'PostScript' },
      { id: 'mov', name: 'Intro_Demo.mov', icon: ICONS.simpleTextDoc, date: d.fmtOffset(320), size: '8.7 MB', kind: 'QuickTime Movie' },
      { id: 'todo', name: 'Launch_Checklist', icon: ICONS.simpleTextDoc, date: d.fmtOffset(12), size: '12 K', kind: 'SimpleText' },
    ],
  });

  await engine.wait(700, signal);
  projWin.selectItem('site');
  const siteEl = projWin.getItemEl('site');
  await engine.drag(siteEl, zipIcon, `${ICONS.folder}<span>Website_Final_v2</span>`, signal);

  engine.setCursorMode('watch');
  const cp = createCopyDialog(engine, {
    title: 'Copy',
    heading: 'Copying "Website_Final_v2" to "Backup Zip 100"',
  });

  const totalItems = 18;
  for (let i = 1; i <= totalItems; i++) {
    const pct = Math.round((i / totalItems) * 100);
    const left = totalItems - i;
    const secs = Math.max(1, Math.round(left * 0.7));
    cp.setProgress(pct, left > 0 ? `Items remaining to be copied: ${left} — About ${secs} seconds` : 'Finishing copy…');
    await engine.wait(150 + Math.random() * 140, signal);
  }

  engine.sounds.menuTick();
  await engine.wait(420, signal);
  engine.setCursorMode('arrow');
  engine.closeWindow(cp.win);
  await engine.click(projWin.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(projWin.win);
}

/* =====================================================================
   10. Outlook Express 5 — Reading Dynamic-Date Mail
   ===================================================================== */
async function outlookMail(engine, signal) {
  engine.onStatus('Outlook Express — Checking Inbox');
  engine.closeNonPersistentWindows(1);

  const box = engine.getSafeDesktopBox();
  const oe = createOutlookWindow(engine, {
    x: box.left + randInt(52, 120),
    y: box.top + randInt(26, 62),
  });

  await engine.wait(900, signal);
  for (const id of ['m1', 'm2', 'm3']) {
    const row = oe.getMessageEl(id);
    if (row) {
      await engine.click(row, { afterMs: 140 }, signal);
      oe.selectMessage(id);
      await engine.wait(1450, signal);
    }
  }

  await engine.click(oe.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(oe.win);
}

/* =====================================================================
   11. Appearance Manager & Control Strip Tweak
   ===================================================================== */
async function appearanceAndControlStrip(engine, signal) {
  engine.onStatus('Appearance — Refreshing Platinum theme');
  engine.closeNonPersistentWindows(1);

  await engine.openMenuAndPick('apple', 'Control Panels ▶', signal);

  const box = engine.getSafeDesktopBox();
  const app = createAppearanceWindow(engine, {
    x: box.left + randInt(60, 140),
    y: box.top + randInt(34, 70),
  });

  await engine.wait(650, signal);

  // Pick next classic OS 9 wallpaper pattern
  const nextPat = (engine.wallpaperIndex + 1) % DESKTOP_PATTERNS.length;
  const patEl = app.getPatternEl(nextPat);
  if (patEl) {
    await engine.click(patEl, { afterMs: 160 }, signal);
    app.setSelectedPattern(nextPat);
    engine.applyWallpaper(nextPat);
  }
  await engine.wait(750, signal);

  // Pick next Platinum highlight color
  const nextHl = (engine.highlightIndex + 1) % HIGHLIGHT_COLORS.length;
  const hlEl = app.getHighlightEl(nextHl);
  if (hlEl) {
    await engine.click(hlEl, { afterMs: 160 }, signal);
    app.setSelectedHighlight(nextHl);
    engine.applyHighlight(nextHl);
  }
  await engine.wait(700, signal);
  await engine.click(app.win.closeBtn, { afterMs: 140 }, signal);
  engine.closeWindow(app.win);

  // Slide out bottom-left Control Strip and inspect display resolution
  const wasExpanded = engine.controlStrip.expanded;
  if (!wasExpanded) {
    await engine.expandControlStrip(signal, { drag: true });
  }
  await engine.openControlStripPopup(
    'display',
    [
      { label: '640 × 480', checked: engine.controlStrip.resolution === '640 × 480' },
      { label: '800 × 600', checked: engine.controlStrip.resolution === '800 × 600' },
      { label: '1024 × 768', checked: engine.controlStrip.resolution === '1024 × 768' },
      { label: '1152 × 870', checked: engine.controlStrip.resolution === '1152 × 870' },
    ],
    '1024 × 768',
    signal,
  );
  engine.controlStrip.resolution = '1024 × 768';

  if (!wasExpanded && Math.random() < 0.5) {
    await engine.collapseControlStrip(signal);
  }
}

/* =====================================================================
   11b. Control Strip — Expanding & Tweaking Classic Modules
   ===================================================================== */
export async function controlStripFiddle(engine, signal) {
  engine.onStatus('Control Strip — Adjusting desktop modules');
  engine.focusDesktop();

  if (!engine.controlStrip.expanded) {
    await engine.expandControlStrip(signal, { drag: Math.random() < 0.72 });
  } else {
    await engine.moveToElement(engine.controlStripEl, 0.35, 0.5, null, signal);
    await engine.wait(320, signal);
  }

  const actions = [
    async () => {
      const target = engine.controlStrip.volume >= 5 ? randInt(2, 4) : randInt(5, 7);
      await engine.adjustControlStripVolume(target, signal);
    },
    async () => {
      const nextDepth = engine.controlStrip.colorDepth === 'Millions' ? 'Thousands' : 'Millions';
      await engine.openControlStripPopup(
        'colors',
        [
          { label: '256 Colors', checked: engine.controlStrip.colorDepth === '256 Colors' },
          { label: 'Thousands', checked: engine.controlStrip.colorDepth === 'Thousands' },
          { label: 'Millions', checked: engine.controlStrip.colorDepth === 'Millions' },
        ],
        nextDepth,
        signal,
      );
      engine.controlStrip.colorDepth = nextDepth;
    },
    async () => {
      const nextAt = !engine.controlStrip.appleTalk;
      await engine.openControlStripPopup(
        'appletalk',
        [
          { label: 'AppleTalk Active', checked: engine.controlStrip.appleTalk },
          { label: 'AppleTalk Inactive', checked: !engine.controlStrip.appleTalk },
          { divider: true },
          { label: 'Open AppleTalk…' },
        ],
        nextAt ? 'AppleTalk Active' : 'AppleTalk Inactive',
        signal,
      );
      engine.controlStrip.appleTalk = nextAt;
      engine.updateControlStripIcons();
    },
    async () => {
      const nextShare = !engine.controlStrip.fileSharing;
      await engine.openControlStripPopup(
        'sharing',
        [
          { label: 'Start File Sharing', checked: engine.controlStrip.fileSharing },
          { label: 'Stop File Sharing', checked: !engine.controlStrip.fileSharing },
          { divider: true },
          { label: 'Open File Sharing…' },
        ],
        nextShare ? 'Start File Sharing' : 'Stop File Sharing',
        signal,
      );
      engine.controlStrip.fileSharing = nextShare;
      engine.updateControlStripIcons();
    },
    async () => {
      const tracks = ['Track 1 — Opening', 'Track 2 — Platinum Afternoon', 'Track 3 — Bondi Window'];
      const nextTrack = pickRandom(tracks.filter((t) => t !== engine.controlStrip.cdTrack));
      await engine.openControlStripPopup(
        'cd',
        [
          { label: 'Play / Pause' },
          { divider: true },
          ...tracks.map((t) => ({ label: t, checked: engine.controlStrip.cdTrack === t })),
        ],
        nextTrack,
        signal,
      );
      engine.controlStrip.cdTrack = nextTrack;
    },
    async () => {
      const locs = ['Home (56K)', 'Office (Ethernet)', 'AirPort Wireless'];
      const nextLoc = pickRandom(locs.filter((l) => l !== engine.controlStrip.location));
      await engine.openControlStripPopup(
        'location',
        locs.map((l) => ({ label: l, checked: engine.controlStrip.location === l })),
        nextLoc,
        signal,
      );
      engine.controlStrip.location = nextLoc;
    },
    async () => {
      const nextEnergy =
        engine.controlStrip.energy === 'Better Performance' ? 'Better Conservation' : 'Better Performance';
      await engine.openControlStripPopup(
        'energy',
        [
          { label: 'Better Performance', checked: engine.controlStrip.energy === 'Better Performance' },
          { label: 'Better Conservation', checked: engine.controlStrip.energy === 'Better Conservation' },
          { divider: true },
          { label: 'Sleep Now' },
        ],
        nextEnergy,
        signal,
      );
      engine.controlStrip.energy = nextEnergy;
    },
  ];

  // Run 2 distinct module interactions
  const pool = [...actions].sort(() => Math.random() - 0.5).slice(0, 2);
  for (const act of pool) {
    await act();
    await engine.wait(420, signal);
  }

  // Sometimes leave the Control Strip expanded on the desktop, sometimes tuck it back in
  if (Math.random() < 0.52) {
    await engine.collapseControlStrip(signal);
  } else {
    await engine.moveTo(engine.cursor.x + 120, engine.cursor.y - 95, 480, signal);
    await engine.wait(450, signal);
  }
}

/* =====================================================================
   SPECIAL A: After Dark — Flying Toasters Cameo!
   ===================================================================== */
export async function afterDarkCameo(engine, signal) {
  engine.onStatus('After Dark — Flying Toasters cameo');
  await engine.wait(500, signal);

  const overlay = document.createElement('div');
  overlay.className = 'os9-afterdark';

  // Starfield
  for (let i = 0; i < 42; i++) {
    const s = document.createElement('div');
    s.className = 'os9-ad-star';
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.opacity = String(0.25 + Math.random() * 0.7);
    overlay.appendChild(s);
  }

  const badge = document.createElement('div');
  badge.className = 'os9-ad-badge';
  badge.textContent = 'After Dark · Flying Toasters';
  overlay.appendChild(badge);

  const rect = engine.root.getBoundingClientRect();
  const w = Math.max(800, rect.width);
  const h = Math.max(600, rect.height);

  const flyers = [];
  for (let i = 0; i < 12; i++) {
    const isToast = i % 3 === 2;
    const el = document.createElement('div');
    el.className = 'os9-ad-flyer';
    el.innerHTML = isToast ? ICONS.flyingToast : ICONS.flyingToaster;
    const scale = isToast ? 0.85 + Math.random() * 0.3 : 0.78 + Math.random() * 0.36;
    const flyer = {
      el,
      x: Math.random() * (w + 300),
      y: Math.random() * (h + 240) - 180,
      vx: -(68 + Math.random() * 52),
      vy: 42 + Math.random() * 34,
      scale,
    };
    overlay.appendChild(el);
    flyers.push(flyer);
  }

  engine.root.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));

  let rafId = null;
  let last = performance.now();
  const animate = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!engine.paused) {
      for (const f of flyers) {
        f.x += f.vx * dt * engine.speed;
        f.y += f.vy * dt * engine.speed;
        if (f.x < -120 || f.y > h + 90) {
          if (Math.random() > 0.45) {
            f.x = w + 60 + Math.random() * 140;
            f.y = Math.random() * h * 0.7 - 80;
          } else {
            f.x = Math.random() * w + 140;
            f.y = -90 - Math.random() * 60;
          }
        }
        f.el.style.transform = `translate3d(${Math.round(f.x)}px, ${Math.round(f.y)}px, 0) scale(${f.scale})`;
      }
    }
    rafId = requestAnimationFrame(animate);
  };
  rafId = requestAnimationFrame(animate);

  try {
    await engine.wait(9500, signal);
    // Ghost mouse wiggles to wake the Mac back up!
    await engine.moveTo(engine.cursor.x + 65, engine.cursor.y - 38, 280, signal);
    await engine.moveTo(engine.cursor.x - 42, engine.cursor.y + 24, 240, signal);
    overlay.classList.remove('visible');
    await engine.wait(550, signal);
  } finally {
    if (rafId) cancelAnimationFrame(rafId);
    overlay.remove();
  }
}

/* =====================================================================
   SPECIAL B: Classic System Error (Bomb) → Happy Mac → OS 9.2 Reboot
   ===================================================================== */
export async function playBootSequence(engine, signal) {
  engine.onStatus('Mac OS 9.2 — Starting up');
  const cursor = engine.cursorEl;
  if (cursor) cursor.style.visibility = 'hidden';

  const boot = document.createElement('div');
  boot.className = 'os9-boot visible';
  boot.innerHTML = `<div id="os9-boot-stage">${ICONS.happyMac}</div><div class="os9-extensions-row" id="os9-ext-row"></div>`;

  try {
    engine.root.appendChild(boot);
    engine.sounds.startupChime();
    await engine.wait(1100, signal);

    const stage = boot.querySelector('#os9-boot-stage');
    const extRow = boot.querySelector('#os9-ext-row');
    stage.innerHTML = `
      <div class="os9-boot-splash">
        <div class="os9-boot-logo">
          ${ICONS.finderFace}
          <div>
            <div class="os9-boot-title">Mac OS 9.2</div>
            <div class="os9-boot-sub">Welcome to Mac OS</div>
          </div>
        </div>
        <div class="os9-boot-bar-wrap">
          <div class="os9-progress-track">
            <div class="os9-progress-fill" id="os9-boot-fill" style="width:6%"></div>
          </div>
          <div class="os9-boot-caption" id="os9-boot-cap">Starting up…</div>
        </div>
      </div>
    `;

    const fillEl = boot.querySelector('#os9-boot-fill');
    const capEl = boot.querySelector('#os9-boot-cap');
    const extensions = [
      { icon: '🎬', name: 'QT 5' },
      { icon: '🌐', name: 'OpenTr' },
      { icon: '🖨', name: 'ApTalk' },
      { icon: '🎛', name: 'CStrip' },
      { icon: '🎨', name: 'Appear' },
      { icon: '🔊', name: 'Sound' },
      { icon: '⚡', name: 'FireW' },
      { icon: '🔌', name: 'USB' },
      { icon: '🧩', name: 'Carbon' },
    ];

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];
      const badge = document.createElement('div');
      badge.className = 'os9-ext-icon';
      badge.innerHTML = `${ext.icon}<span>${ext.name}</span>`;
      extRow.appendChild(badge);
      fillEl.style.width = `${Math.round(((i + 1) / extensions.length) * 100)}%`;
      capEl.textContent = 'Welcome to Mac OS';
      await engine.wait(240, signal);
    }

    capEl.textContent = 'Starting Finder…';
    await engine.wait(480, signal);
    if (cursor) cursor.style.visibility = '';
    boot.classList.remove('visible');
    await engine.wait(380, signal);
  } finally {
    if (cursor) cursor.style.visibility = '';
    boot.remove();
  }
}

export async function systemBombReboot(engine, signal) {
  engine.onStatus('System Error — Rebooting Mac OS 9.2');
  engine.sounds.sosumi();

  const bomb = createAlertDialog(engine, {
    id: 'win-bomb',
    title: 'System Error',
    icon: ICONS.bomb,
    heading: 'Sorry, a system error occurred.',
    body: 'ID = 11',
    primaryLabel: 'Restart',
    width: 420,
  });

  await engine.wait(1500, signal);
  await engine.click(bomb.primaryBtn, { pressClass: 'pressed', afterMs: 180 }, signal);
  engine.clearAllWindows();
  await playBootSequence(engine, signal);
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawQuickTimeFrame(ctx, t) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (t < 3.2) {
    const labels = ['3', '2', '1'];
    const idx = Math.min(2, Math.floor(t / 1.05));
    const local = (t % 1.05) / 1.05;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 92, -Math.PI / 2, -Math.PI / 2 + local * Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 108, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2, 28);
    ctx.lineTo(w / 2, h - 28);
    ctx.moveTo(28, h / 2);
    ctx.lineTo(w - 28, h / 2);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 92px Georgia, "Times New Roman", serif';
    ctx.fillText(labels[idx], w / 2, h / 2 + 6);
    ctx.font = '16px Geneva, Verdana, sans-serif';
    ctx.fillText('QUICKTIME  ·  LEADER', w / 2, h - 36);
    return;
  }

  if (t < 6.2) {
    const bars = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
    const bw = w / bars.length;
    bars.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(i * bw, 0, bw + 1, h * 0.72);
    });
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, h * 0.72, w, h * 0.28);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Geneva, Verdana, sans-serif';
    ctx.fillText('Color bars  ·  Mac OS 9.2', w / 2, h * 0.86);
    return;
  }

  const u = Math.min(1, (t - 6.2) / 1.1);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#7eb6e6');
  sky.addColorStop(1, '#d7ecfb');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ead8bf';
  ctx.fillRect(0, h * 0.74, w, h * 0.26);

  ctx.save();
  ctx.globalAlpha = 0.25 + 0.75 * u;
  ctx.translate(w / 2, h * 0.58 + Math.sin(t * 1.3) * 4);
  roundRectPath(ctx, -86, -96, 172, 148, 42);
  ctx.fillStyle = '#2c868e';
  ctx.fill();
  roundRectPath(ctx, -64, -74, 128, 92, 8);
  ctx.fillStyle = '#d7e6ff';
  ctx.fill();
  ctx.fillStyle = '#16324f';
  ctx.fillRect(-10, -36, 4, 12);
  ctx.fillRect(8, -36, 4, 12);
  ctx.strokeStyle = '#16324f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -8, 16, 0.15, Math.PI - 0.15);
  ctx.stroke();
  roundRectPath(ctx, -98, 52, 196, 16, 7);
  ctx.fillStyle = '#24747c';
  ctx.fill();
  ctx.restore();

  ctx.globalAlpha = u;
  ctx.fillStyle = '#143044';
  ctx.font = 'bold 28px Georgia, "Times New Roman", serif';
  ctx.fillText('Desktop movies.', w / 2, 42);
  ctx.globalAlpha = 1;
}

async function quickTimeMovie(engine, signal) {
  engine.onStatus('QuickTime Player — Desktop movie');
  engine.closeNonPersistentWindows(1);
  engine.setCursorMode('watch');
  await engine.wait(420, signal);
  engine.setCursorMode('arrow');

  const box = engine.getSafeDesktopBox();
  const qt = createQuickTimeWindow(engine, {
    x: box.left + randInt(36, 90),
    y: box.top + randInt(18, 46),
  });
  drawQuickTimeFrame(qt.ctx, 0);
  qt.setTime(0, 16);

  let alive = true;
  let playing = false;
  let movieTime = 0;
  let last = performance.now();
  let raf = 0;
  const tick = (now) => {
    if (!alive || engine.destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (playing && !engine.paused) movieTime += dt * engine.speed;
    drawQuickTimeFrame(qt.ctx, movieTime);
    qt.setTime(movieTime, 16);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  try {
    await engine.click(qt.playBtn, { pressClass: 'pressed', afterMs: 80 }, signal);
    playing = true;
    qt.setPlaying(true);
    await engine.moveToElement(qt.scrubEl, 0.42, 0.5, 900, signal);
    await engine.wait(8200, signal);
    await engine.click(qt.win.closeBtn, { afterMs: 120 }, signal);
    engine.closeWindow(qt.win);
  } finally {
    alive = false;
    cancelAnimationFrame(raf);
  }
}

async function soundJamListen(engine, signal) {
  engine.onStatus('iTunes — Studio playlist');
  engine.closeNonPersistentWindows(1);

  const tracks = [
    { title: 'Platinum Afternoon', artist: 'Studio B', length: 222, hue: 230 },
    { title: 'Bondi Window', artist: 'Late Checkout', length: 198, hue: 174 },
    { title: '56k Lullaby', artist: 'Open Transport', length: 246, hue: 330 },
    { title: 'Zip Disk Diary', artist: 'MacUser99', length: 175, hue: 28 },
    { title: 'Sherlock Hours', artist: 'Channel 2', length: 214, hue: 205 },
  ];

  const box = engine.getSafeDesktopBox();
  const sj = createSoundJamWindow(engine, {
    x: box.left + randInt(40, 110),
    y: box.top + randInt(18, 48),
    tracks,
  });

  let alive = true;
  let playing = false;
  let trackIndex = 0;
  let elapsed = 48;
  let last = performance.now();
  let raf = 0;
  const tick = (now) => {
    if (!alive || engine.destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (playing && !engine.paused) {
      elapsed = Math.min(tracks[trackIndex].length, elapsed + dt * engine.speed);
      const levels = Array.from({ length: 16 }, (_, i) => {
        const wave = Math.abs(Math.sin(elapsed * (2.1 + i * 0.17) + i * 0.6));
        return 0.12 + wave * 0.88;
      });
      sj.setLevels(levels);
      sj.setElapsed(elapsed);
    }
    raf = requestAnimationFrame(tick);
  };

  try {
    sj.setTrack(0);
    sj.setElapsed(elapsed);
    sj.setPlaying(true);
    playing = true;
    raf = requestAnimationFrame(tick);
    await engine.wait(2200, signal);

    const row = sj.getRowEl(2);
    if (row) {
      await engine.click(row, { afterMs: 140 }, signal);
      trackIndex = 2;
      elapsed = 12;
      sj.setTrack(2);
      sj.setElapsed(elapsed);
      engine.sounds.menuTick();
    }
    await engine.wait(2600, signal);

    await engine.click(sj.nextBtn, { pressClass: 'pressed', afterMs: 120 }, signal);
    trackIndex = Math.min(tracks.length - 1, trackIndex + 1);
    elapsed = 4;
    sj.setTrack(trackIndex);
    sj.setElapsed(elapsed);
    await engine.wait(900, signal);

    // Occasionally reach down to the Control Strip to nudge volume while music plays
    if (Math.random() < 0.65) {
      if (!engine.controlStrip.expanded) {
        await engine.expandControlStrip(signal, { drag: false });
      }
      const volTarget = engine.controlStrip.volume < 6 ? Math.min(7, engine.controlStrip.volume + 2) : 5;
      await engine.adjustControlStripVolume(volTarget, signal);
    } else {
      await engine.wait(900, signal);
    }

    await engine.click(sj.win.closeBtn, { afterMs: 120 }, signal);
    engine.closeWindow(sj.win);
  } finally {
    alive = false;
    cancelAnimationFrame(raf);
  }
}

async function aboutThisMac(engine, signal) {
  engine.onStatus('Finder — About This Computer');
  engine.closeNonPersistentWindows(1);
  engine.focusDesktop();
  await engine.openMenuAndPick('apple', 'About This Computer…', signal);

  const box = engine.getSafeDesktopBox();
  const about = createAboutWindow(engine, {
    x: box.left + (box.width - 430) / 2,
    y: box.top + 36,
  });
  about.reveal();
  await engine.moveToElement(about.barEl, 0.55, 0.5, 520, signal);
  await engine.wait(1700, signal);
  await engine.click(about.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(about.win);
}

async function scrapbookFlip(engine, signal) {
  engine.onStatus('Scrapbook — Flipping clippings');
  engine.closeNonPersistentWindows(1);
  await engine.openMenuAndPick('apple', 'Scrapbook', signal);

  const box = engine.getSafeDesktopBox();
  const scrap = createScrapbookWindow(engine, {
    x: box.left + randInt(70, 140),
    y: box.top + randInt(24, 60),
  });

  await engine.wait(700, signal);
  for (let i = 0; i < 3; i++) {
    await engine.click(scrap.nextBtn, { pressClass: 'pressed', afterMs: 120 }, signal);
    scrap.next();
    engine.sounds.menuTick();
    await engine.wait(1100, signal);
  }

  await engine.click(scrap.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(scrap.win);
}

async function diskFirstAid(engine, signal) {
  engine.onStatus('Disk First Aid — Checking Macintosh HD');
  engine.closeNonPersistentWindows(1);

  const hd = engine.desktopIcons.get('mac-hd').el;
  engine.selectDesktopIcon('mac-hd');
  await engine.doubleClick(hd, signal);
  engine.selectDesktopIcon(null);

  const d = engine.getDynamicDateInfo();
  const box = engine.getSafeDesktopBox();
  const hdWin = createFinderWindow(engine, {
    id: 'win-hd-utils',
    title: 'Macintosh HD',
    titleIcon: ICONS.macHd,
    x: box.left + 28,
    y: box.top + 18,
    width: 420,
    height: 230,
    view: 'icons',
    items: [
      { id: 'apps', name: 'Applications (Mac OS 9)', icon: ICONS.folder, date: d.fmtOffset(940), size: '--', kind: 'folder' },
      { id: 'util', name: 'Utilities', icon: ICONS.folder, date: d.fmtOffset(2880), size: '--', kind: 'folder' },
      { id: 'docs', name: 'Documents', icon: ICONS.folder, date: d.fmtOffset(64), size: '--', kind: 'folder' },
      { id: 'sys', name: 'System Folder', icon: ICONS.systemFolder, date: d.fmtOffset(1620), size: '--', kind: 'folder' },
    ],
  });

  await engine.wait(550, signal);
  hdWin.selectItem('util');
  const utilEl = hdWin.getItemEl('util');
  await engine.doubleClick(utilEl, signal);

  const utilWin = createFinderWindow(engine, {
    id: 'win-utilities',
    title: 'Utilities',
    titleIcon: ICONS.folder,
    x: box.left + 78,
    y: box.top + 58,
    width: 430,
    height: 210,
    view: 'list',
    statusText: '3 items, 1.84 GB available',
    items: [
      { id: 'dfa', name: 'Disk First Aid', icon: ICONS.diskFirstAid, date: d.fmtOffset(4000), size: '412 K', kind: 'application' },
      { id: 'setup', name: 'Drive Setup', icon: ICONS.macHd, date: d.fmtOffset(5000), size: '640 K', kind: 'application' },
      { id: 'copy', name: 'Disk Copy', icon: ICONS.simpleTextDoc, date: d.fmtOffset(4500), size: '288 K', kind: 'application' },
    ],
  });

  await engine.wait(450, signal);
  utilWin.selectItem('dfa');
  const dfaIcon = utilWin.getItemEl('dfa');
  await engine.doubleClick(dfaIcon, signal);

  const dfa = createDiskFirstAidWindow(engine, {
    x: box.left + 96,
    y: box.top + 28,
  });
  await engine.wait(350, signal);
  await engine.moveToElement(dfa.volumeEl, 0.35, 0.5, 360, signal);
  await engine.click(dfa.verifyBtn, { pressClass: 'pressed', afterMs: 120 }, signal);
  engine.setCursorMode('watch');

  const lines = [
    ['Verifying volume "Macintosh HD"…'],
    ['Checking catalog B-tree.'],
    ['Checking extent file.'],
    ['Checking volume bitmap.'],
    ['Checking volume information.'],
    ['The volume "Macintosh HD" appears to be OK.', 'ok'],
  ];
  for (const [line, kind] of lines) {
    if (kind === 'ok') engine.setCursorMode('arrow');
    dfa.appendLog(line, kind);
    await engine.wait(kind === 'ok' ? 900 : 460, signal);
  }
  engine.sounds.menuTick();
  await engine.wait(500, signal);

  await engine.click(dfa.win.closeBtn, { afterMs: 100 }, signal);
  engine.closeWindow(dfa.win);
  await engine.click(utilWin.win.closeBtn, { afterMs: 100 }, signal);
  engine.closeWindow(utilWin.win);
  await engine.click(hdWin.win.closeBtn, { afterMs: 100 }, signal);
  engine.closeWindow(hdWin.win);
}

async function getInfoNote(engine, signal) {
  engine.onStatus('Finder — Get Info');
  engine.closeNonPersistentWindows(1);
  engine.focusDesktop();

  const readme = engine.desktopIcons.get('readme').el;
  await engine.click(readme, { afterMs: 160 }, signal);
  engine.selectDesktopIcon('readme');
  await engine.openMenuAndPick('file', 'Get Info', signal);

  const d = engine.getDynamicDateInfo();
  const box = engine.getSafeDesktopBox();
  const info = createGetInfoWindow(engine, {
    x: box.left + 64,
    y: box.top + 32,
    name: 'Read Me First',
  });

  await engine.wait(500, signal);
  await engine.click(info.commentsEl, { afterMs: 80 }, signal);
  info.commentsEl.classList.add('focused');
  engine.setCursorMode('ibeam');
  const notes = [
    'Backed up to the Zip 100 before the LAN party.',
    `Updated ${d.shortDate}. Keep this on the desktop.`,
    'Open in SimpleText. Do not move to the Trash.',
  ];
  await engine.typeText(info.commentsEl, pickRandom(notes), {
    delay: 42,
    caret: true,
    removeCaretAtEnd: true,
  }, signal);
  info.commentsEl.classList.remove('focused');
  engine.setCursorMode('arrow');
  await engine.click(info.lockEl, { afterMs: 120 }, signal);
  info.setLocked(true);
  await engine.wait(700, signal);
  await engine.click(info.win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(info.win);
  engine.selectDesktopIcon(null);
}

async function idleGlance(engine, signal) {
  engine.onStatus('Finder — Between tasks');
  engine.focusDesktop();
  await engine.moveToElement(engine.clockEl, 0.55, 0.7, 680, signal);
  await engine.wait(800, signal);

  const projects = engine.desktopIcons.get('projects').el;
  await engine.click(projects, { afterMs: 180 }, signal);
  engine.selectDesktopIcon('projects');
  await engine.wait(750, signal);

  const sticky = engine.windows.get('win-sticky-main');
  if (sticky) {
    await engine.moveToElement(sticky.el, 0.62, 0.42, null, signal);
    await engine.wait(900, signal);
  }

  // Casually slide the Control Strip open or closed while idling
  if (Math.random() < 0.65) {
    if (engine.controlStrip.expanded) {
      await engine.collapseControlStrip(signal);
    } else {
      await engine.expandControlStrip(signal, { drag: true });
      await engine.wait(650, signal);
    }
  }

  await engine.moveTo(Math.max(90, engine.cursor.x - 180), Math.min(engine.cursor.y + 36, 420), 520, signal);
  engine.selectDesktopIcon(null);
  await engine.wait(360, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'finder-cleanup', run: finderCleanup },
  { id: 'simpletext-journal', run: simpleTextJournal },
  { id: 'netscape-surf', run: netscapeSurf },
  { id: 'quicktime-movie', run: quickTimeMovie },
  { id: 'soundjam-listen', run: soundJamListen },
  { id: 'about-this-mac', run: aboutThisMac },
  { id: 'scrapbook-flip', run: scrapbookFlip },
  { id: 'disk-first-aid', run: diskFirstAid },
  { id: 'get-info', run: getInfoNote },
  { id: 'sherlock-search', run: sherlockSearch },
  { id: 'stickies-notes', run: stickiesNotes },
  { id: 'aim-chat', run: aimChat },
  { id: 'paint-doodle', run: paintDoodle },
  { id: 'calculator-math', run: calculatorMath },
  { id: 'zip-backup', run: zipBackup },
  { id: 'outlook-mail', run: outlookMail },
  { id: 'appearance-tweak', run: appearanceAndControlStrip },
  { id: 'control-strip-fiddle', run: controlStripFiddle },
  { id: 'idle-glance', run: idleGlance },
];

export const SPECIAL_VIGNETTES = {
  'after-dark': afterDarkCameo,
  'system-bomb': systemBombReboot,
  appearance: appearanceAndControlStrip,
  'control-strip': controlStripFiddle,
};
