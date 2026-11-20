import { VIC_COLORS } from './engine.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function ensureBasic(engine, signal) {
  if (engine.mode === 'geos') {
    engine.clearGeosWindows();
    await engine.openGeosMenu('special', 'BASIC', signal);
    engine.exitGeosToBasic();
    engine.setColors(14, 6, 14);
    engine.clearBasic();
    engine.printLine('READY.');
    await engine.wait(420, signal);
  }
}

async function ensureGeos(engine, signal, withBoot = true) {
  if (engine.mode !== 'geos') {
    engine.showBasicMode();
    engine.setColors(14, 6, 14);
    if (engine.basicLines.length === 0) {
      engine.printLine('READY.');
    }
    await engine.run1541Load('GEOS', ',8,1', signal);
    await engine.enterGeos(withBoot, signal);
    await engine.wait(450, signal);
  }
}

/* =====================================================================
   1. Cold Boot + 1541 Disk Directory Listing
   ===================================================================== */
export async function c64PowerOnAndBasicDir(engine, signal) {
  engine.onStatus('BASIC V2 — Booting & reading Drive 8');
  engine.clearGeosWindows();
  await engine.resetBasicScreen(signal);
  await engine.run1541Load('$', ',8', signal);
  await engine.typeBasicCommand('LIST', signal);
  await engine.wait(180, signal);

  const dirLines = [
    '0 "WORK DISK 86    " 86 2A',
    '14   "GEOS"              PRG',
    '42   "GEOWRITE 2.1"      USR',
    '38   "GEOPAINT"          USR',
    '3    "10PRINT"           PRG',
    '11   "BALLOON"           PRG',
    '19   "SIDTUNE"           PRG',
    '412 BLOCKS FREE.',
    'READY.',
  ];
  for (const line of dirLines) {
    engine.printLine(line);
    await engine.wait(95, signal);
  }
  await engine.wait(500, signal);

  await engine.typeBasicCommand('PRONT "HI"', signal);
  engine.printLine('?SYNTAX  ERROR');
  engine.printLine('READY.');
  await engine.wait(420, signal);
  await engine.run1541Load('NOPE', ',8', signal, true);
  await engine.wait(500, signal);
}

/* =====================================================================
   2. Classic 10 PRINT CHR$(205.5+RND(1)); : GOTO 10 Maze
   ===================================================================== */
export async function basicTenPrint(engine, signal) {
  engine.onStatus('BASIC V2 — Running 10 PRINT maze');
  await ensureBasic(engine, signal);
  engine.clearBasic();
  engine.printLine('READY.');
  await engine.wait(320, signal);

  await engine.typeBasicCommand('10 PRINT CHR$(205.5+RND(1));:GOTO 10', signal, 52);
  await engine.wait(280, signal);
  await engine.typeBasicCommand('RUN', signal, 64);
  await engine.wait(220, signal);

  const ctx = engine.gfxCtx;
  const cols = 40;
  const rows = 25;
  const cw = 8;
  const ch = 8;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

  ctx.fillStyle = VIC_COLORS[6];
  ctx.fillRect(0, 0, 320, 200);
  engine.showGfxCanvas(true);

  const drawCell = (r, c, slash) => {
    const x = c * cw;
    const y = r * ch;
    ctx.fillStyle = VIC_COLORS[6];
    ctx.fillRect(x, y, cw, ch);
    ctx.strokeStyle = VIC_COLORS[14];
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (slash) {
      ctx.moveTo(x + 1, y + ch - 1);
      ctx.lineTo(x + cw - 1, y + 1);
    } else {
      ctx.moveTo(x + 1, y + 1);
      ctx.lineTo(x + cw - 1, y + ch - 1);
    }
    ctx.stroke();
  };

  try {
    // Fill rows 0..24 rapidly, then scroll 8 extra rows like a real C64!
    for (let stepRow = 0; stepRow < rows + 8; stepRow++) {
      if (stepRow < rows) {
        for (let c = 0; c < cols; c++) {
          const val = Math.random() > 0.5;
          grid[stepRow][c] = val;
          drawCell(stepRow, c, val);
          if (c % 5 === 4) await engine.wait(16, signal);
        }
      } else {
        // Scroll up one row
        grid.shift();
        grid.push(Array.from({ length: cols }, () => Math.random() > 0.5));
        ctx.fillStyle = VIC_COLORS[6];
        ctx.fillRect(0, 0, 320, 200);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            drawCell(r, c, grid[r][c]);
          }
        }
        await engine.wait(140, signal);
      }
    }
    await engine.wait(1400, signal);
  } finally {
    engine.showGfxCanvas(false);
  }

  engine.printLine('');
  engine.printLine('BREAK IN 10');
  engine.printLine('READY.');
  await engine.wait(650, signal);
}

/* =====================================================================
   3. Boot into GEOS 2.0 deskTop
   ===================================================================== */
export async function bootIntoGeos(engine, signal) {
  engine.onStatus('GEOS 2.0 — Booting deskTop');
  if (engine.mode === 'geos') {
    engine.clearGeosWindows();
    engine.exitGeosToBasic();
    engine.clearBasic();
    engine.printLine('READY.');
    await engine.wait(300, signal);
  }
  await ensureGeos(engine, signal, true);
  await engine.wait(750, signal);
}

/* =====================================================================
   4. GEOS deskTop — geoWrite 2.1 Word Processing
   ===================================================================== */
async function geosGeoWrite(engine, signal) {
  engine.onStatus('GEOS deskTop — Typing in geoWrite 2.1');
  await ensureGeos(engine, signal, true);
  engine.clearGeosWindows();
  engine.renderGeosDiskPage(0);

  const gwIcon = engine.getGeosFileEl('geowrite');
  if (gwIcon) {
    engine.selectGeosFile('geowrite');
    await engine.doubleClick(gwIcon, signal);
    engine.selectGeosFile(null);
  }

  engine.setDriveActivity(true, true, '1541 DRIVE 8 · GEOWRITE');
  engine.sounds.driveStep();
  await engine.wait(420, signal);
  engine.setDriveActivity(false, false);

  const d = engine.getDynamicDateInfo();
  const win = engine.createGeosWindow({
    id: 'geos-geowrite',
    title: 'geoWrite 2.1 — Desk Notes',
    x: 24,
    y: 14,
    width: 470,
    height: 310,
    content: `
      <div class="geowrite-ruler">
        <span>BSW 9pt · Plain</span>
        <span>1···2···3···4···5···6</span>
        <span>Page 1</span>
      </div>
      <div class="geowrite-doc" data-gw-doc></div>
    `,
  });

  const docEl = win.bodyEl.querySelector('[data-gw-doc]');
  const drafts = [
    `Commodore 64 Journal — ${d.fullDate}\n\nBooted WORK DISK 86 straight from BASIC V2 into GEOS 2.0 deskTop at ${d.timeStr}.\n\nStill amazing what 64 kilobytes of RAM and a 1541 floppy drive can do when you have WYSIWYG fonts in geoWrite and sprite graphics in BASIC.\n\nNext up: sketch a C= logo in geoPaint and listen to SIDTUNE.`,
    `Notes from the Desk — ${d.shortDate}\n\n• Verified 412 blocks free on Drive A: 1541.\n• Tested 10 PRINT CHR$(205.5+RND(1)) labyrinth.\n• Checked MPS-803 dot-matrix ribbon before printing.\n• Logged on ${d.weekday} at ${d.timeStr}.`,
  ];

  await engine.click(docEl, { rx: 0.25, ry: 0.25, afterMs: 120 }, signal);
  await engine.typeGeosText(docEl, pickRandom(drafts), { delay: 44 }, signal);
  await engine.wait(950, signal);

  // Save to 1541 Drive A:
  engine.setDriveActivity(true, true, '1541 DRIVE 8 · SAVING');
  engine.sounds.driveStep();
  await engine.wait(500, signal);
  engine.setDriveActivity(false, false);

  await engine.click(win.closeBtn, { afterMs: 120 }, signal);
  engine.closeGeosWindow(win);
}

/* =====================================================================
   5. GEOS deskTop — geoPaint Live 8-Bit Doodling
   ===================================================================== */
async function geosGeoPaint(engine, signal) {
  engine.onStatus('GEOS deskTop — Sketching in geoPaint');
  await ensureGeos(engine, signal, false);
  engine.clearGeosWindows();
  engine.renderGeosDiskPage(0);

  const gpIcon = engine.getGeosFileEl('geopaint');
  if (gpIcon) {
    engine.selectGeosFile('geopaint');
    await engine.doubleClick(gpIcon, signal);
    engine.selectGeosFile(null);
  }

  const swatches = [VIC_COLORS[6], VIC_COLORS[2], VIC_COLORS[14], VIC_COLORS[3], VIC_COLORS[7], VIC_COLORS[0]];
  const win = engine.createGeosWindow({
    id: 'geos-geopaint',
    title: 'geoPaint — Untitled',
    x: 30,
    y: 16,
    width: 456,
    height: 316,
    content: `
      <div class="geopaint-wrap">
        <div class="geopaint-tools">
          <div class="geopaint-tool active">✎</div>
          <div class="geopaint-tool">▭</div>
          <div class="geopaint-tool">◯</div>
          <div class="geopaint-tool">▤</div>
          <div class="geopaint-tool">⌫</div>
        </div>
        <div class="geopaint-main">
          <div class="geopaint-swatches">
            ${swatches.map((hex, i) => `<div class="geopaint-swatch${i === 0 ? ' active' : ''}" data-gp-color="${hex}" style="background:${hex}"></div>`).join('')}
          </div>
          <div class="geopaint-stage">
            <canvas class="geopaint-canvas" width="220" height="148"></canvas>
          </div>
        </div>
      </div>
    `,
  });

  const canvas = win.bodyEl.querySelector('.geopaint-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const toWsPt = (cx, cy) => {
    const wsRect = engine.geosWorkspaceEl.getBoundingClientRect();
    const r = canvas.getBoundingClientRect();
    return {
      x: r.left - wsRect.left + (cx / canvas.width) * r.width,
      y: r.top - wsRect.top + (cy / canvas.height) * r.height,
    };
  };

  const selectSwatch = async (hex) => {
    const el = win.bodyEl.querySelector(`[data-gp-color="${hex}"]`);
    if (el) {
      await engine.click(el, { afterMs: 90 }, signal);
      win.bodyEl.querySelectorAll('.geopaint-swatch').forEach((s) => s.classList.toggle('active', s === el));
    }
  };

  const strokePoly = async (pts, color, width = 6) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    const start = toWsPt(pts[0][0], pts[0][1]);
    await engine.moveTo(start.x, start.y, 240, signal);
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1];
      const [x2, y2] = pts[i];
      const steps = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) / 7));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const nx = x1 + (x2 - x1) * t;
        const ny = y1 + (y2 - y1) * t;
        ctx.beginPath();
        ctx.moveTo(x1 + (x2 - x1) * ((s - 1) / steps), y1 + (y2 - y1) * ((s - 1) / steps));
        ctx.lineTo(nx, ny);
        ctx.stroke();
        const wp = toWsPt(nx, ny);
        engine.cursor.x = wp.x;
        engine.cursor.y = wp.y;
        engine._renderCursor();
        await engine.wait(18, signal);
      }
    }
  };

  // Draw the iconic Commodore C= Chicken-Head Logo!
  await selectSwatch(VIC_COLORS[6]);
  const cPts = [];
  for (let a = 0.55; a <= Math.PI * 2 - 0.55; a += 0.25) {
    cPts.push([95 + Math.cos(a) * 44, 74 + Math.sin(a) * 44]);
  }
  await strokePoly(cPts, VIC_COLORS[6], 16);

  // Upper blue lip
  await selectSwatch(VIC_COLORS[14]);
  await strokePoly([[116, 56], [164, 56], [148, 66], [116, 66]], VIC_COLORS[14], 8);

  // Lower red lip
  await selectSwatch(VIC_COLORS[2]);
  await strokePoly([[116, 82], [148, 82], [164, 92], [116, 92]], VIC_COLORS[2], 8);

  await engine.wait(1300, signal);
  await engine.click(win.closeBtn, { afterMs: 120 }, signal);
  engine.closeGeosWindow(win);
}

/* =====================================================================
   6. GEOS Desk Accessories — Calculator & Note Pad
   ===================================================================== */
async function geosDeskAccessories(engine, signal) {
  engine.onStatus('GEOS deskTop — Calculator & Note Pad');
  await ensureGeos(engine, signal, false);
  engine.clearGeosWindows();

  // Calculator
  await engine.openGeosMenu('geos', 'calculator', signal);
  const calcKeys = [
    'C', '/', '*', '-',
    '7', '8', '9', '+',
    '4', '5', '6', '=',
    '1', '2', '3', '0',
  ];
  const calcWin = engine.createGeosWindow({
    id: 'geos-calc',
    title: 'calculator',
    x: 340,
    y: 28,
    width: 178,
    content: `
      <div class="geos-calc">
        <div class="geos-calc-lcd" data-gc-lcd>0</div>
        <div class="geos-calc-grid">
          ${calcKeys.map((k) => `<div class="geos-calc-key" data-gc-key="${k}">${k}</div>`).join('')}
        </div>
      </div>
    `,
  });

  const lcd = calcWin.bodyEl.querySelector('[data-gc-lcd]');
  const seq = [
    ['6', '6'], ['4', '64'], ['*', '64'], ['1', '1'], ['0', '10'], ['2', '102'], ['4', '1024'], ['=', '65536'],
  ];
  for (const [key, val] of seq) {
    const btn = calcWin.bodyEl.querySelector(`[data-gc-key="${key}"]`);
    if (btn) {
      await engine.click(btn, { pressClass: 'pressed', duration: 220, afterMs: 90 }, signal);
      lcd.textContent = val;
    }
  }
  await engine.wait(850, signal);

  // Open Note Pad alongside Calculator
  await engine.openGeosMenu('geos', 'note pad', signal);
  const d = engine.getDynamicDateInfo();
  const noteWin = engine.createGeosWindow({
    id: 'geos-notepad',
    title: `note pad — ${d.shortDate}`,
    x: 42,
    y: 44,
    width: 266,
    height: 196,
    content: `<div class="geowrite-doc" style="font-family:var(--c64-font);font-size:11.5px;" data-np-body></div>`,
  });

  const npBody = noteWin.bodyEl.querySelector('[data-np-body]');
  await engine.click(npBody, { rx: 0.3, ry: 0.3, afterMs: 100 }, signal);
  await engine.typeGeosText(
    npBody,
    `${d.weekday} (${d.timeStr}):\n64 * 1024 = 65536 bytes!\nCheck Disk 86 free blocks.\nPlay SIDTUNE later.`,
    { delay: 44, removeCaretAtEnd: true },
    signal,
  );
  await engine.wait(900, signal);

  await engine.click(noteWin.closeBtn, { afterMs: 110 }, signal);
  engine.closeGeosWindow(noteWin);
  await engine.click(calcWin.closeBtn, { afterMs: 110 }, signal);
  engine.closeGeosWindow(calcWin);
}

/* =====================================================================
   7. GEOS deskTop — Page Flip, Trash Drag, Validate & Preference Mgr
   ===================================================================== */
async function geosDeskTopManage(engine, signal) {
  engine.onStatus('GEOS deskTop — Organizing Work Disk 86');
  await ensureGeos(engine, signal, false);
  engine.clearGeosWindows();
  engine.renderGeosDiskPage(0);

  // Drag SCRATCH.TMP to Trash
  const scratchEl = engine.getGeosFileEl('scratch');
  const trashEl = engine.getGeosDeskEl('trash');
  if (scratchEl && trashEl) {
    engine.selectGeosFile('scratch');
    await engine.drag(scratchEl, trashEl, 'SCRATCH.TMP', signal);
    engine.selectGeosFile(null);
    await engine.wait(360, signal);
  }

  // Click the iconic bottom-left dog-eared corner to flip to Page 2!
  const flip1 = engine.geosPadGridEl.querySelector('#geos-page-flip');
  if (flip1) {
    await engine.click(flip1, { afterMs: 160 }, signal);
    engine.renderGeosDiskPage(1);
    await engine.wait(850, signal);
  }
  const flip2 = engine.geosPadGridEl.querySelector('#geos-page-flip');
  if (flip2) {
    await engine.click(flip2, { afterMs: 160 }, signal);
    engine.renderGeosDiskPage(0);
    await engine.wait(550, signal);
  }

  // Open Preference Manager to cycle authentic GEOS monitor tint!
  await engine.openGeosMenu('geos', 'preference mgr', signal);
  const themes = [
    { id: 'default', label: 'Classic B&W', color: '#eef0f4' },
    { id: 'blue', label: 'C64 Blue', color: '#6c5eb5' },
    { id: 'green', label: 'Green CRT', color: '#588d43' },
    { id: 'amber', label: 'Amber CRT', color: '#d48d28' },
  ];

  const prefWin = engine.createGeosWindow({
    id: 'geos-pref',
    title: 'preference mgr',
    x: 110,
    y: 48,
    width: 320,
    content: `
      <div class="geos-dialog">
        <div><strong>Display Palette:</strong></div>
        <div class="geos-theme-grid">
          ${themes
            .map(
              (t) => `
            <div class="geos-theme-opt${engine.geosTheme === t.id ? ' selected' : ''}" data-gtheme="${t.id}">
              <span class="geos-theme-dot" style="background:${t.color}"></span>
              <span>${t.label}</span>
            </div>`,
            )
            .join('')}
        </div>
        <div class="geos-btn-row"><div class="geos-btn" data-pref-ok>OK</div></div>
      </div>
    `,
  });

  const nextThemeIdx = (themes.findIndex((t) => t.id === engine.geosTheme) + 1) % themes.length;
  const nextTheme = themes[nextThemeIdx];
  const optEl = prefWin.bodyEl.querySelector(`[data-gtheme="${nextTheme.id}"]`);
  if (optEl) {
    await engine.click(optEl, { afterMs: 160 }, signal);
    prefWin.bodyEl.querySelectorAll('.geos-theme-opt').forEach((el) => el.classList.toggle('selected', el === optEl));
    engine.setGeosTheme(nextTheme.id);
  }
  await engine.wait(650, signal);

  const okBtn = prefWin.bodyEl.querySelector('[data-pref-ok]');
  await engine.click(okBtn, { pressClass: 'pressed', afterMs: 140 }, signal);
  engine.closeGeosWindow(prefWin);
}

/* =====================================================================
   8. BASIC V2 — Iconic Commodore Hot-Air Sprite Balloons!
   ===================================================================== */
async function basicSpriteBalloon(engine, signal) {
  engine.onStatus('VIC-II Sprites — Floating Commodore Balloons');
  await ensureBasic(engine, signal);
  engine.clearBasic();
  engine.printLine('READY.');
  await engine.run1541Load('BALLOON', ',8,1', signal);
  await engine.typeBasicCommand('SYS 49152', signal);
  await engine.wait(220, signal);

  const ctx = engine.gfxCtx;
  engine.showGfxCanvas(true);

  const balloons = [
    { x: 40, y: 80, vx: 34, phase: 0, body: VIC_COLORS[2], stripe: VIC_COLORS[7] },
    { x: 160, y: 120, vx: 26, phase: 1.9, body: VIC_COLORS[14], stripe: VIC_COLORS[1] },
    { x: 255, y: 65, vx: 40, phase: 3.7, body: VIC_COLORS[5], stripe: VIC_COLORS[13] },
  ];

  const drawBalloon = (x, y, body, stripe) => {
    const px = Math.round(x);
    const py = Math.round(y);
    // Classic chunky 24x21 VIC-II hardware sprite look!
    ctx.fillStyle = body;
    ctx.fillRect(px - 10, py - 14, 20, 4);
    ctx.fillRect(px - 14, py - 10, 28, 12);
    ctx.fillRect(px - 10, py + 2, 20, 6);
    ctx.fillRect(px - 6, py + 8, 12, 4);
    // Commodore stripe across middle
    ctx.fillStyle = stripe;
    ctx.fillRect(px - 14, py - 6, 28, 4);
    // C= mark
    ctx.fillStyle = VIC_COLORS[6];
    ctx.fillRect(px - 4, py - 6, 8, 4);
    // Ropes & basket
    ctx.fillStyle = VIC_COLORS[1];
    ctx.fillRect(px - 4, py + 12, 2, 4);
    ctx.fillRect(px + 2, py + 12, 2, 4);
    ctx.fillStyle = VIC_COLORS[8];
    ctx.fillRect(px - 5, py + 16, 10, 6);
  };

  let alive = true;
  let elapsed = 0;
  let last = performance.now();
  let raf = 0;

  const render = (now) => {
    if (!alive || engine.destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!engine.paused) elapsed += dt * engine.speed;

    ctx.fillStyle = VIC_COLORS[6];
    ctx.fillRect(0, 0, 320, 200);

    // Classic Programmer's Reference Guide header
    ctx.fillStyle = VIC_COLORS[14];
    ctx.font = 'bold 10px monospace';
    ctx.fillText('VIC-II SPRITE DEMO  (53248-53294)', 16, 22);

    // Pixel clouds
    ctx.fillStyle = VIC_COLORS[15];
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 92 + elapsed * 10) % 360) - 30;
      const cy = 44 + (i % 2) * 30;
      ctx.fillRect(Math.round(cx), cy, 26, 6);
      ctx.fillRect(Math.round(cx) + 4, cy - 4, 16, 4);
    }

    for (const b of balloons) {
      const bx = ((b.x + elapsed * b.vx) % 360) - 20;
      const by = b.y + Math.sin(elapsed * 2.1 + b.phase) * 14;
      drawBalloon(bx, by, b.body, b.stripe);
    }

    raf = requestAnimationFrame(render);
  };

  raf = requestAnimationFrame(render);
  try {
    await engine.wait(7200, signal);
  } finally {
    alive = false;
    cancelAnimationFrame(raf);
    engine.showGfxCanvas(false);
  }

  engine.printLine('READY.');
  await engine.wait(450, signal);
}

/* =====================================================================
   9. 6581 SID Demo Scene — Raster Bars, 3-Voice VU & Sine Scroller!
   ===================================================================== */
export async function basicSidDemo(engine, signal) {
  engine.onStatus('SID 6581 — Running chiptune demo scene');
  await ensureBasic(engine, signal);
  engine.clearBasic();
  engine.printLine('READY.');
  await engine.run1541Load('SIDTUNE', ',8,1', signal);
  await engine.typeBasicCommand('RUN', signal);
  await engine.wait(180, signal);

  const ctx = engine.gfxCtx;
  engine.showGfxCanvas(true);
  engine.setRasterBorder(true);

  const d = engine.getDynamicDateInfo();
  const scrollMsg = `   *** COMMODORE 64 · 6581 SID SYNTH ONLINE ***   ${d.fullDate.toUpperCase()}   *** GREETINGS FROM LIVING OS SCREENSAVERS — 64K RAM FOREVER ***   `;
  let alive = true;
  let elapsed = 0;
  let last = performance.now();
  let lastArpStep = -1;
  let raf = 0;

  const render = (now) => {
    if (!alive || engine.destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!engine.paused) {
      elapsed += dt * engine.speed;
      const arpStep = Math.floor(elapsed * 6.5);
      if (arpStep !== lastArpStep) {
        lastArpStep = arpStep;
        engine.sounds.sidArpStep(arpStep);
      }
    }

    ctx.fillStyle = VIC_COLORS[0];
    ctx.fillRect(0, 0, 320, 200);

    // Copper / VIC-II raster bars
    const barColors = [VIC_COLORS[6], VIC_COLORS[14], VIC_COLORS[3], VIC_COLORS[1], VIC_COLORS[3], VIC_COLORS[14], VIC_COLORS[6]];
    for (let b = 0; b < 3; b++) {
      const cy = 52 + b * 24 + Math.sin(elapsed * 2.6 + b * 1.1) * 20;
      barColors.forEach((col, idx) => {
        ctx.fillStyle = col;
        ctx.fillRect(0, Math.round(cy + idx * 2), 320, 2);
      });
    }

    // Header
    ctx.fillStyle = VIC_COLORS[7];
    ctx.font = 'bold 12px monospace';
    ctx.fillText('MOS 6581 SID · 3-VOICE PLAYER', 44, 24);

    // 3-Voice VU meters
    const voices = [
      { label: 'V1 PULSE', color: VIC_COLORS[3], val: 0.35 + Math.abs(Math.sin(elapsed * 7.2)) * 0.65 },
      { label: 'V2 SAW  ', color: VIC_COLORS[13], val: 0.25 + Math.abs(Math.sin(elapsed * 4.9 + 1.4)) * 0.72 },
      { label: 'V3 TRI  ', color: VIC_COLORS[7], val: 0.3 + Math.abs(Math.cos(elapsed * 3.1 + 0.7)) * 0.68 },
    ];
    voices.forEach((v, idx) => {
      const y = 114 + idx * 16;
      ctx.fillStyle = VIC_COLORS[15];
      ctx.font = 'bold 9px monospace';
      ctx.fillText(v.label, 20, y + 8);
      ctx.fillStyle = VIC_COLORS[11];
      ctx.fillRect(82, y, 210, 9);
      const segs = Math.round(v.val * 20);
      ctx.fillStyle = v.color;
      for (let s = 0; s < segs; s++) {
        ctx.fillRect(84 + s * 10, y + 1, 8, 7);
      }
    });

    // Classic horizontal sine-wave scroller!
    ctx.font = 'bold 13px monospace';
    const scrollPx = elapsed * 72;
    for (let i = 0; i < scrollMsg.length; i++) {
      const cx = 320 + i * 10 - (scrollPx % (scrollMsg.length * 10 + 340));
      if (cx > -14 && cx < 334) {
        const cy = 182 + Math.sin(elapsed * 6 + i * 0.45) * 6;
        ctx.fillStyle = VIC_COLORS[(i + Math.floor(elapsed * 4)) % 2 === 0 ? 1 : 14];
        ctx.fillText(scrollMsg[i], Math.round(cx), Math.round(cy));
      }
    }

    raf = requestAnimationFrame(render);
  };

  raf = requestAnimationFrame(render);
  try {
    await engine.wait(8400, signal);
  } finally {
    alive = false;
    cancelAnimationFrame(raf);
    engine.setRasterBorder(false);
    engine.showGfxCanvas(false);
  }

  engine.printLine('READY.');
  await engine.wait(450, signal);
}

/* =====================================================================
   10. BASIC V2 — Classic POKE 53280 / 53281 Color Playground
   ===================================================================== */
async function basicPokePlayground(engine, signal) {
  engine.onStatus('BASIC V2 — Poking VIC-II color registers');
  await ensureBasic(engine, signal);
  engine.clearBasic();
  engine.printLine('READY.');
  await engine.wait(300, signal);

  await engine.typeBasicCommand('POKE 53280,0 : POKE 53281,0', signal);
  engine.setColors(0, 0, 14);
  engine.printLine('READY.');
  await engine.wait(550, signal);

  const d = engine.getDynamicDateInfo();
  await engine.typeBasicCommand(`PRINT "HELLO FROM ${d.shortDate.toUpperCase()}!"`, signal);
  engine.printLine(`HELLO FROM ${d.shortDate.toUpperCase()}!`);
  engine.printLine('READY.');
  await engine.wait(500, signal);

  await engine.typeBasicCommand('FOR I=0 TO 15 : POKE 53280,I : NEXT', signal);
  for (let i = 0; i < 16; i++) {
    engine.setColors(i, 0, 14);
    engine.sounds.sidNote(220 + i * 32, 0.08, 'square', 0.02);
    await engine.wait(110, signal);
  }
  engine.printLine('READY.');
  await engine.wait(350, signal);

  await engine.typeBasicCommand('POKE 53280,14 : POKE 53281,6', signal);
  engine.setColors(14, 6, 14);
  engine.printLine('READY.');
  await engine.wait(700, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'c64-dir', run: c64PowerOnAndBasicDir },
  { id: 'basic-10print', run: basicTenPrint },
  { id: 'boot-geos', run: bootIntoGeos },
  { id: 'geos-geowrite', run: geosGeoWrite },
  { id: 'geos-geopaint', run: geosGeoPaint },
  { id: 'geos-accessories', run: geosDeskAccessories },
  { id: 'geos-desktop', run: geosDeskTopManage },
  { id: 'basic-balloon', run: basicSpriteBalloon },
  { id: 'basic-sid', run: basicSidDemo },
  { id: 'basic-poke', run: basicPokePlayground },
];

export const SPECIAL_VIGNETTES = {
  'geos-boot': bootIntoGeos,
  'ten-print': basicTenPrint,
  'sid-demo': basicSidDemo,
  'hard-reset': c64PowerOnAndBasicDir,
};
