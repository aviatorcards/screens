import { typeInto as typeHuman } from '../../js/human.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =====================================================================
   1. Award 486DX2 BIOS POST & MS-DOS 6.22 Cold Boot
   ===================================================================== */
export async function dosColdBoot(engine, signal) {
  engine.onStatus('BIOS POST — Starting MS-DOS 6.22');
  engine.hideTui();
  engine.showVgaCanvas(false);
  engine.cwd = 'C:\\';
  engine.clearTerm();

  engine.printHtml('<span class="vga-white">Award Modular BIOS v4.50G, An Energy Star Ally</span>');
  engine.printLine('Copyright (C) 1984-94, Award Software, Inc.');
  engine.printLine('');
  engine.printHtml('<span class="vga-cyan">486DX2-66 CPU at 66MHz · 256K Write-Back Cache</span>');
  engine.printLine('Memory Test :     640K');

  for (let kb = 1024; kb <= 16384; kb += 2048) {
    engine.replaceLastHtml(`Memory Test :  <span class="vga-white">${String(kb).padStart(6, ' ')}K</span>`);
    await engine.wait(110, signal);
  }
  engine.replaceLastHtml('Memory Test :  <span class="vga-white"> 16384K OK</span>');
  engine.sounds.postBeep();
  await engine.wait(360, signal);

  engine.printLine('');
  engine.printLine('Detecting IDE Primary Master ... WDC AC2540H (540MB)');
  engine.printLine('Detecting IDE Primary Slave  ... MITSUMI FX001D CD-ROM');
  await engine.pulseHdd(3, 100, signal);
  await engine.wait(420, signal);

  engine.clearTerm();
  engine.printHtml('<span class="vga-white">Starting MS-DOS...</span>');
  engine.printLine('');
  await engine.pulseHdd(4, 110, signal);

  const bootLines = [
    'HIMEM is testing extended memory...done.',
    'EMM386 v4.49 installed.  Expanded memory services unavailable.',
    'Sound Blaster 16 PnP · BLASTER=A220 I5 D1 H5 P330 T6',
    'MSCDEX Version 2.23 — Drive D: = Driver MSCD001 unit 0',
    'Microsoft (R) Mouse Driver Version 9.01 — Mouse driver installed',
    '',
    'Microsoft(R) MS-DOS(R) Version 6.22',
    '             (C)Copyright Microsoft Corp 1981-1994.',
    '',
  ];
  for (const line of bootLines) {
    engine.printLine(line);
    await engine.wait(140, signal);
  }

  engine.showPromptIdle();
  await engine.wait(900, signal);
}

/* =====================================================================
   2. DIR, VER, DATE & MEM /C
   ===================================================================== */
async function dosDirAndMem(engine, signal) {
  engine.onStatus('MS-DOS 6.22 — Checking files & memory');
  engine.hideTui();
  engine.cwd = 'C:\\';
  if (engine.lines.length > 14) engine.clearTerm();
  const d = engine.getDynamicDateInfo();

  await engine.typeCommand('DIR', signal);
  await engine.pulseHdd(3, 85, signal);

  const dirRows = [
    ' Volume in drive C has no label',
    ' Volume Serial Number is 1F4A-94C8',
    ' Directory of C:\\',
    '',
    `DOS          &lt;DIR&gt;         ${d.dirDate}  ${d.dirTime}`,
    `GAMES        &lt;DIR&gt;         ${d.dirDate}  ${d.dirTime}`,
    `NC           &lt;DIR&gt;         06-14-94   9:12a`,
    `TELIX        &lt;DIR&gt;         08-03-94   7:45p`,
    `COMMAND  COM        54,645 05-31-94   6:22a`,
    `AUTOEXEC BAT           482 ${d.dirDate}  ${d.dirTime}`,
    `CONFIG   SYS           318 09-12-94   8:10p`,
    `NOTES    TXT         1,840 ${d.dirDate}  ${d.dirTime}`,
    '         4 file(s)         57,285 bytes',
    '         4 dir(s)     342,814,720 bytes free',
    '',
  ];
  for (const row of dirRows) {
    engine.printHtml(row);
    await engine.wait(65, signal);
  }
  engine.showPromptIdle();
  await engine.wait(700, signal);

  await engine.typeCommand('VER', signal);
  engine.printLine('');
  engine.printLine('MS-DOS Version 6.22');
  engine.printLine('');
  engine.showPromptIdle();
  await engine.wait(480, signal);

  await engine.typeCommand('DIRR', signal);
  engine.printLine('Bad command or file name');
  engine.printLine('');
  engine.showPromptIdle();
  await engine.wait(420, signal);

  await engine.typeCommand('DIR A:', signal);
  engine.sounds.postBeep();
  engine.printLine('Not ready reading drive A');
  engine.printLine('Abort, Retry, Fail?');
  await engine.wait(700, signal);
  engine.replaceLastHtml('Abort, Retry, Fail?A');
  engine.sounds.keyClick();
  engine.printLine('');
  engine.showPromptIdle();
  await engine.wait(480, signal);

  await engine.typeCommand('MEM /C', signal);
  await engine.wait(220, signal);
  const memLines = [
    'Modules using memory below 1 MB:',
    '  Name           Total       =   Conventional   +   Upper Memory',
    '  --------  ----------------   ----------------   ----------------',
    '  MSDOS       16,845   (16K)     16,845   (16K)          0    (0K)',
    '  HIMEM        1,168    (1K)      1,168    (1K)          0    (0K)',
    '  EMM386       4,144    (4K)      4,144    (4K)          0    (0K)',
    '  SMARTDRV    29,024   (28K)          0    (0K)     29,024   (28K)',
    '  MSCDEX      27,952   (27K)          0    (0K)     27,952   (27K)',
    '  MOUSE       17,088   (17K)          0    (0K)     17,088   (17K)',
    '<span class="vga-white">  Free       633,552  (619K)    626,864  (612K)      6,688    (7K)</span>',
    'Largest executable program size      626,768   (612K)',
    '',
  ];
  for (const row of memLines) {
    engine.printHtml(row);
    await engine.wait(70, signal);
  }
  engine.showPromptIdle();
  await engine.wait(1200, signal);
}

/* =====================================================================
   3. MS-DOS 6.22 DEFRAG — Hypnotic Animated Disk Cluster Map!
   ===================================================================== */
export async function dosDefrag(engine, signal) {
  engine.onStatus('DEFRAG C: — Optimizing hard disk clusters');
  engine.hideTui();
  engine.cwd = 'C:\\';
  await engine.typeCommand('DEFRAG C: /F', signal);
  await engine.pulseHdd(4, 90, signal);

  const totalCells = 44 * 10; // 440 clusters
  // Build fragmented initial state: some fixed 'X', scattered used '▓', gaps '·'
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < 16) cells.push('opt');
    else if (i === 52 || i === 148 || i === 260) cells.push('fixed');
    else if (i < 310 && Math.random() < 0.62) cells.push('used');
    else if (i >= 310 && Math.random() < 0.28) cells.push('used');
    else cells.push('free');
  }

  const tui = engine.showTui(`
    <div class="tui-menubar">
      <span><span class="hot">O</span>ptimize</span>
      <span style="margin-left:auto;">Microsoft Defragmenter · Drive C:</span>
    </div>
    <div class="defrag-wrap">
      <div class="defrag-map" id="df-map"></div>
      <div class="defrag-bottom">
        <div class="defrag-box">
          <div style="display:flex;justify-content:space-between;">
            <span>Status</span>
            <span id="df-pct">12%</span>
          </div>
          <div class="defrag-progress"><div id="df-bar" style="width:12%"></div></div>
          <div id="df-action">Reading cluster 118…</div>
          <div>Full Optimization · Drive C: (540 MB)</div>
        </div>
        <div class="defrag-box">
          <div>Legend</div>
          <div><span class="vga-white">▓</span> Used &nbsp; <span class="vga-cyan">■</span> Optimized &nbsp; <span class="vga-grey">·</span> Unused</div>
          <div><span style="background:#ffff55;color:#000;padding:0 3px;">r</span> Reading &nbsp; <span style="background:#ff5555;color:#fff;padding:0 3px;">W</span> Writing &nbsp; <span class="vga-yellow">X</span> Unmovable</div>
        </div>
      </div>
    </div>
    <div class="tui-statusbar">
      <span>Reading &amp; Moving Data</span>
      <span>ESC to Cancel</span>
    </div>
  `);

  const mapEl = tui.querySelector('#df-map');
  const pctEl = tui.querySelector('#df-pct');
  const barEl = tui.querySelector('#df-bar');
  const actEl = tui.querySelector('#df-action');

  const cellEls = [];
  const paintCell = (idx, state) => {
    cells[idx] = state;
    const el = cellEls[idx];
    if (!el) return;
    if (state === 'used') {
      el.className = 'df-cell df-used';
      el.textContent = '▓';
    } else if (state === 'opt') {
      el.className = 'df-cell df-opt';
      el.textContent = '■';
    } else if (state === 'read') {
      el.className = 'df-cell df-read';
      el.textContent = 'r';
    } else if (state === 'write') {
      el.className = 'df-cell df-write';
      el.textContent = 'W';
    } else if (state === 'fixed') {
      el.className = 'df-cell df-fixed';
      el.textContent = 'X';
    } else {
      el.className = 'df-cell df-free';
      el.textContent = '·';
    }
  };

  for (let i = 0; i < totalCells; i++) {
    const div = document.createElement('div');
    mapEl.appendChild(div);
    cellEls.push(div);
    paintCell(i, cells[i]);
  }

  try {
    let writePtr = 16;
    const totalMoves = 72;
    for (let m = 0; m < totalMoves; m++) {
      // Find next free slot near front and a fragmented 'used' cluster further back
      while (writePtr < totalCells && (cells[writePtr] === 'opt' || cells[writePtr] === 'fixed')) {
        writePtr++;
      }
      let readPtr = -1;
      for (let k = totalCells - 1; k > writePtr; k--) {
        if (cells[k] === 'used') {
          readPtr = k;
          break;
        }
      }
      if (readPtr < 0 || writePtr >= totalCells) break;

      const pct = Math.min(99, Math.round(12 + ((m + 1) / totalMoves) * 87));
      pctEl.textContent = `${pct}%`;
      barEl.style.width = `${pct}%`;

      actEl.textContent = `Reading cluster ${readPtr * 12}…`;
      paintCell(readPtr, 'read');
      engine.setHdd(true);
      if (m % 3 === 0) engine.sounds.hddTick();
      await engine.wait(58, signal);

      actEl.textContent = `Writing cluster ${writePtr * 12}…`;
      paintCell(readPtr, 'free');
      paintCell(writePtr, 'write');
      await engine.wait(58, signal);

      paintCell(writePtr, 'opt');
      engine.setHdd(false);
      writePtr++;
    }

    pctEl.textContent = '100%';
    barEl.style.width = '100%';
    actEl.textContent = 'Optimization of Drive C: complete!';
    engine.sounds.pcBeep(880, 0.09);
    await engine.wait(180, signal);
    engine.sounds.pcBeep(1174, 0.14);

    const modal = document.createElement('div');
    modal.className = 'tui-modal';
    modal.innerHTML = `
      <div class="tui-modal-title">Microsoft Defragmenter</div>
      <div style="text-align:center;">Optimization for Drive C: is complete.</div>
      <div class="tui-modal-btns">
        <div class="tui-modal-btn active">OK</div>
      </div>
    `;
    tui.appendChild(modal);
    await engine.wait(1500, signal);
  } finally {
    engine.setHdd(false);
    engine.hideTui();
  }

  engine.printLine('Microsoft Defragmenter completed successfully.');
  engine.showPromptIdle();
  await engine.wait(550, signal);
}

/* =====================================================================
   4. MS-DOS Editor — EDIT NOTES.TXT / AUTOEXEC.BAT
   ===================================================================== */
async function dosEdit(engine, signal) {
  engine.onStatus('MS-DOS Editor — Editing NOTES.TXT');
  engine.hideTui();
  engine.cwd = 'C:\\';
  const d = engine.getDynamicDateInfo();

  await engine.typeCommand('EDIT NOTES.TXT', signal);
  await engine.pulseHdd(2, 85, signal);

  const tui = engine.showTui(`
    <div class="tui-menubar" id="ed-menu">
      <span id="ed-file"><span class="hot">F</span>ile</span>
      <span><span class="hot">E</span>dit</span>
      <span><span class="hot">S</span>earch</span>
      <span><span class="hot">O</span>ptions</span>
      <span style="margin-left:auto;"><span class="hot">H</span>elp</span>
    </div>
    <div class="tui-blue-app">
      <div class="tui-edit-frame">
        <div class="tui-edit-title">NOTES.TXT</div>
        <div class="tui-edit-body" id="ed-body"></div>
      </div>
    </div>
    <div class="tui-statusbar">
      <span>&lt;F1=Help&gt;  &lt;Alt=Menu&gt;  MS-DOS Editor</span>
      <span id="ed-pos">00001:00001</span>
    </div>
  `);

  const bodyEl = tui.querySelector('#ed-body');
  const posEl = tui.querySelector('#ed-pos');
  const fileMenuBtn = tui.querySelector('#ed-file');

  if (!engine.sessionNotes) engine.sessionNotes = [];
  const stamp = `- Checked the desk at ${d.dirTime}.`;
  if (!engine.sessionNotes.includes(stamp)) engine.sessionNotes.push(stamp);
  if (engine.sessionNotes.length > 3) engine.sessionNotes.shift();

  const content = `${pickRandom([
    `486DX2-66 SYSTEM LOG — ${d.dosDate}\n========================================\n\n- Conventional memory tuned to 612K free via EMM386.\n- Sound Blaster 16 IRQ 5 / DMA 1 verified in DOOM.\n- Ran DEFRAG on Drive C: (540MB Western Digital).\n- Dial-up BBS session scheduled for ${d.weekday} night (${d.dirTime}).`,
    `REM  AUTOEXEC.BAT NOTES (${d.prettyDate})\n@ECHO OFF\nPROMPT $P$G\nPATH C:\\DOS;C:\\NC;C:\\TELIX\nSET BLASTER=A220 I5 D1 H5 P330 T6\nLH C:\\DOS\\SMARTDRV.EXE /X\nLH C:\\DOS\\MOUSE.COM\nECHO Ready for ${d.weekday}!`,
    `C:\\NOTES.TXT\n${d.prettyDate}\n\n- ScanDisk finished the surface check.\n- Norton Commander still has C:\\GAMES.\n- Left the turbo light on.`,
  ])}\n${engine.sessionNotes.join('\n')}`;

  let buf = '';
  const paint = () => {
    const lines = buf.split('\n');
    const row = String(lines.length).padStart(5, '0');
    const col = String(lines[lines.length - 1].length + 1).padStart(5, '0');
    bodyEl.innerHTML = `${engine.esc(buf)}<span class="dos-cursor" style="background:#fff"></span>`;
    posEl.textContent = `${row}:${col}`;
  };
  await typeHuman(content, { base: 36 }, {
    check: () => engine._checkSignal(signal),
    apply: (step) => {
      if (step.kind === 'backspace') buf = buf.slice(0, -1);
      else buf += step.ch;
      paint();
    },
    sound: (step) => {
      if (step.kind === 'backspace' || step.ch !== ' ') engine.sounds.keyClick();
    },
    wait: (ms) => engine.wait(ms, signal),
  });

  await engine.wait(700, signal);

  // Open File menu -> Save -> Exit
  fileMenuBtn.classList.add('active');
  const dd = document.createElement('div');
  dd.className = 'tui-dropdown';
  dd.innerHTML = `
    <div class="tui-dropdown-row">New</div>
    <div class="tui-dropdown-row">Open...</div>
    <div class="tui-dropdown-row active" data-row="save">Save</div>
    <div class="tui-dropdown-row">Save As...</div>
    <div class="tui-dropdown-row" data-row="exit">Exit</div>
  `;
  tui.appendChild(dd);
  engine.sounds.keyClick();
  await engine.wait(550, signal);
  await engine.pulseHdd(3, 80, signal);

  dd.querySelector('[data-row="save"]').classList.remove('active');
  dd.querySelector('[data-row="exit"]').classList.add('active');
  engine.sounds.keyClick();
  await engine.wait(480, signal);

  engine.hideTui();
  engine.showPromptIdle();
  await engine.wait(450, signal);
}

/* =====================================================================
   5. Norton Commander 4.0 Dual-Pane File Manager
   ===================================================================== */
async function dosNortonCommander(engine, signal) {
  engine.onStatus('Norton Commander 4.0 — Browsing C:\\GAMES');
  engine.hideTui();
  engine.cwd = 'C:\\';
  await engine.typeCommand('NC', signal);
  await engine.pulseHdd(2, 90, signal);

  const d = engine.getDynamicDateInfo();
  const leftFiles = [
    { name: '..', size: 'UP--DIR', date: '05-31-94', dir: true },
    { name: 'COMMAND.COM', size: '54,645', date: '05-31-94' },
    { name: 'DEFRAG.EXE', size: '79,177', date: '05-31-94' },
    { name: 'EDIT.COM', size: '413', date: '05-31-94' },
    { name: 'EMM386.EXE', size: '120,926', date: '05-31-94' },
    { name: 'HIMEM.SYS', size: '29,136', date: '05-31-94' },
    { name: 'MEM.EXE', size: '32,502', date: '05-31-94' },
    { name: 'QBASIC.EXE', size: '194,309', date: '05-31-94' },
    { name: 'SCANDISK.EXE', size: '124,250', date: '05-31-94' },
    { name: 'SMARTDRV.EXE', size: '45,145', date: '05-31-94' },
  ];
  const rightFiles = [
    { name: '..', size: 'UP--DIR', date: '08-12-94', dir: true },
    { name: 'DOOM', size: 'SUB-DIR', date: '09-01-94', dir: true },
    { name: 'WOLF3D', size: 'SUB-DIR', date: '06-18-94', dir: true },
    { name: 'KEEN4', size: 'SUB-DIR', date: '04-02-94', dir: true },
    { name: 'SIMCITY', size: 'SUB-DIR', date: '07-20-94', dir: true },
    { name: 'XWING', size: 'SUB-DIR', date: '08-05-94', dir: true },
    { name: 'README.TXT', size: '2,418', date: d.dirDate },
    { name: 'SAVES.ZIP', size: '84,120', date: d.dirDate },
  ];

  let activeIdx = 1;
  const tui = engine.showTui(`
    <div class="nc-wrap">
      <div class="nc-panels">
        <div class="nc-pane">
          <div class="nc-pane-title">C:\\DOS</div>
          <div class="nc-header"><span>Name</span><span>Size</span><span>Date</span></div>
          <div class="nc-rows">
            ${leftFiles.map((f) => `<div class="nc-row${f.dir ? ' dir' : ''}"><span>${f.name}</span><span>${f.size}</span><span>${f.date}</span></div>`).join('')}
          </div>
          <div class="nc-pane-foot"><span>10 files</span><span>680,503 bytes</span></div>
        </div>
        <div class="nc-pane active">
          <div class="nc-pane-title">C:\\GAMES</div>
          <div class="nc-header"><span>Name</span><span>Size</span><span>Date</span></div>
          <div class="nc-rows" id="nc-right"></div>
          <div class="nc-pane-foot"><span id="nc-sel">DOOM</span><span>342 MB free</span></div>
        </div>
      </div>
      <div class="nc-cmdbar">C:\\GAMES&gt;<span class="dos-cursor"></span></div>
      <div class="nc-fnkeys">
        <div class="nc-fn"><span>1</span><span>Help</span></div>
        <div class="nc-fn"><span>2</span><span>Menu</span></div>
        <div class="nc-fn"><span>3</span><span>View</span></div>
        <div class="nc-fn"><span>4</span><span>Edit</span></div>
        <div class="nc-fn"><span>5</span><span>Copy</span></div>
        <div class="nc-fn"><span>6</span><span>RenMov</span></div>
        <div class="nc-fn"><span>7</span><span>Mkdir</span></div>
        <div class="nc-fn"><span>8</span><span>Delete</span></div>
        <div class="nc-fn"><span>9</span><span>PullDn</span></div>
        <div class="nc-fn"><span>10</span><span>Quit</span></div>
      </div>
    </div>
  `);

  const rightEl = tui.querySelector('#nc-right');
  const selEl = tui.querySelector('#nc-sel');
  const renderRight = () => {
    rightEl.innerHTML = rightFiles
      .map(
        (f, i) => `
      <div class="nc-row${f.dir ? ' dir' : ''}${i === activeIdx ? ' selected' : ''}">
        <span>${f.name}</span><span>${f.size}</span><span>${f.date}</span>
      </div>`,
      )
      .join('');
    selEl.textContent = rightFiles[activeIdx].name;
  };
  renderRight();

  // Step highlight bar down to SAVES.ZIP
  for (let i = 2; i <= 7; i++) {
    await engine.wait(340, signal);
    activeIdx = i;
    renderRight();
    engine.sounds.keyClick();
  }
  await engine.wait(420, signal);

  // F5 Copy dialog
  const modal = document.createElement('div');
  modal.className = 'tui-modal';
  modal.innerHTML = `
    <div class="tui-modal-title">Copy</div>
    <div>Copy "SAVES.ZIP" (84,120 bytes) to:</div>
    <div style="background:#0000aa;color:#fff;padding:2px 8px;">A:\\BACKUP\\SAVES.ZIP</div>
    <div class="defrag-progress"><div id="nc-cp-bar" style="width:0%"></div></div>
  `;
  tui.appendChild(modal);
  const cpBar = modal.querySelector('#nc-cp-bar');
  for (let p = 15; p <= 100; p += 17) {
    cpBar.style.width = `${Math.min(100, p)}%`;
    engine.setHdd(true);
    engine.sounds.hddTick();
    await engine.wait(190, signal);
  }
  engine.setHdd(false);
  await engine.wait(480, signal);

  engine.hideTui();
  engine.showPromptIdle();
  await engine.wait(450, signal);
}

/* =====================================================================
   6. Microsoft ScanDisk 6.22
   ===================================================================== */
async function dosScanDisk(engine, signal) {
  engine.onStatus('SCANDISK C: — Checking file system');
  engine.hideTui();
  engine.cwd = 'C:\\';
  await engine.typeCommand('SCANDISK C:', signal);
  await engine.wait(260, signal);

  const checks = [
    'Media descriptor',
    'File allocation tables',
    'Directory structure',
    'File system',
    'Free space',
    'Surface scan (quick)',
  ];

  const tui = engine.showTui(`
    <div class="sd-wrap">
      <div>
        <div class="sd-title">Microsoft ScanDisk</div>
        <div style="margin-top:0.6em;">ScanDisk is now checking drive C: for the following problems:</div>
        <div class="sd-steps" id="sd-steps"></div>
      </div>
      <div>
        <div id="sd-msg" style="margin-bottom:0.4em;color:#ffffff;">Checking media descriptor…</div>
        <div class="sd-bar"><div id="sd-fill"></div></div>
      </div>
    </div>
  `);

  const stepsEl = tui.querySelector('#sd-steps');
  const msgEl = tui.querySelector('#sd-msg');
  const fillEl = tui.querySelector('#sd-fill');

  const renderSteps = (doneCount) => {
    stepsEl.innerHTML = checks
      .map((label, i) => {
        if (i < doneCount) return `<div class="sd-step done"><span>♦</span><span>${label} — OK</span></div>`;
        if (i === doneCount) return `<div class="sd-step running"><span>»</span><span>${label}…</span></div>`;
        return `<div class="sd-step"><span> </span><span>${label}</span></div>`;
      })
      .join('');
  };

  try {
    for (let i = 0; i < checks.length; i++) {
      renderSteps(i);
      msgEl.textContent = `Checking ${checks[i].toLowerCase()}…`;
      fillEl.style.width = `${Math.round(((i + 0.5) / checks.length) * 100)}%`;
      await engine.pulseHdd(3, 140, signal);
    }
    renderSteps(checks.length);
    fillEl.style.width = '100%';
    msgEl.textContent = 'ScanDisk did not find any problems on drive C:.';
    engine.sounds.pcBeep(920, 0.09);
    await engine.wait(1350, signal);
  } finally {
    engine.hideTui();
  }

  engine.showPromptIdle();
  await engine.wait(450, signal);
}

/* =====================================================================
   7. MS-DOS QBasic 1.1 → GORILLA.BAS
   ===================================================================== */
export async function dosQBasicDemo(engine, signal) {
  engine.onStatus('QBasic 1.1 — GORILLA.BAS');
  engine.hideTui();
  engine.cwd = 'C:\\';
  await engine.typeCommand('QBASIC /RUN GORILLA.BAS', signal);
  await engine.pulseHdd(2, 85, signal);

  const tui = engine.showTui(`
    <div class="tui-menubar">
      <span><span class="hot">F</span>ile</span>
      <span><span class="hot">E</span>dit</span>
      <span><span class="hot">V</span>iew</span>
      <span><span class="hot">S</span>earch</span>
      <span class="active"><span class="hot">R</span>un</span>
      <span><span class="hot">D</span>ebug</span>
      <span><span class="hot">O</span>ptions</span>
    </div>
    <div class="tui-blue-app">
      <div class="tui-edit-frame">
        <div class="tui-edit-title">GORILLA.BAS</div>
        <div class="tui-edit-body" id="qb-code"></div>
      </div>
    </div>
    <div class="tui-statusbar">
      <span>&lt;Shift+F5=Start&gt;  &lt;F5=Continue&gt;  MS-DOS QBasic 1.1</span>
      <span>00009:00001</span>
    </div>
  `);

  const codeEl = tui.querySelector('#qb-code');
  const code = `REM  GORILLA.BAS — QBasic 1.1\nSCREEN 9\nPRINT "Player 1"\nPRINT "Player 2"\nPRINT "Angle, velocity:"`;
  codeEl.textContent = code;
  await engine.wait(1100, signal);

  const ctx = engine.vgaCtx;
  engine.showVgaCanvas(true);
  let alive = true;
  let elapsed = 0;
  let last = performance.now();
  let raf = 0;

  const gorilla = (x, y) => {
    ctx.fillStyle = '#aa5500';
    ctx.fillRect(x + 6, y, 10, 8);
    ctx.fillRect(x, y + 8, 22, 12);
    ctx.fillRect(x + 2, y + 20, 6, 8);
    ctx.fillRect(x + 14, y + 20, 6, 8);
  };

  const render = (now) => {
    if (!alive || engine.destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!engine.paused) elapsed += dt * engine.speed;

    ctx.fillStyle = '#0000aa';
    ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = '#ffff55';
    ctx.beginPath();
    ctx.arc(246, 28, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(16, 108, 78, 92);
    ctx.fillRect(226, 92, 78, 108);
    ctx.fillStyle = '#5555ff';
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        ctx.fillRect(24 + col * 18, 118 + row * 16, 8, 10);
        ctx.fillRect(236 + col * 18, 104 + row * 16, 8, 10);
      }
    }
    gorilla(36, 80);
    gorilla(250, 64);
    const p = (elapsed % 2.2) / 2.2;
    const bx = 62 + p * 190;
    const by = 78 - Math.sin(p * Math.PI) * 62;
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-0.7 + p * 1.4);
    ctx.fillStyle = '#ffff55';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('GORILLA.BAS · SCREEN 9 · QBASIC 1.1', 8, 14);
    raf = requestAnimationFrame(render);
  };

  raf = requestAnimationFrame(render);
  try {
    await engine.wait(6400, signal);
  } finally {
    alive = false;
    cancelAnimationFrame(raf);
    engine.showVgaCanvas(false);
    engine.hideTui();
  }

  engine.showPromptIdle();
  await engine.wait(450, signal);
}

/* =====================================================================
   8. Telix 14.4K Dial-Up ANSI BBS Session
   ===================================================================== */
export async function dosDialupBbs(engine, signal) {
  engine.onStatus('TELIX 3.22 — Dialing 14.4K ANSI BBS');
  engine.hideTui();
  engine.cwd = 'C:\\TELIX';
  engine.clearTerm();
  const d = engine.getDynamicDateInfo();

  await engine.typeCommand('TELIX', signal);
  await engine.wait(300, signal);
  engine.clearTerm();

  engine.printHtml('<span class="vga-bg-blue">  TELIX 3.22  ·  COM2: 14400-8-N-1  ·  ANSI-BBS  ·  ALT-Z FOR HELP              </span>');
  engine.printLine('');
  engine.printLine('ATZ');
  engine.printLine('OK');
  await engine.wait(280, signal);

  const num = '555-0194';
  engine.printLine(`ATDT ${num}`);
  for (const ch of num) {
    if (/\d/.test(ch)) {
      engine.sounds.dialTone(ch);
      await engine.wait(110, signal);
    }
  }
  await engine.wait(320, signal);
  engine.sounds.modemConnect();
  await engine.wait(720, signal);
  engine.printHtml('<span class="vga-green">CONNECT 14400/ARQ/V32BIS/LAPM</span>');
  await engine.wait(520, signal);

  const ansiBanner = [
    '',
    '<span class="vga-cyan">╔══════════════════════════════════════════════════════════════╗</span>',
    '<span class="vga-cyan">║</span>  <span class="vga-yellow">▓▒░  THE SILICON VALLEY BBS  ·  NODE 1 (14.4K USR)  ░▒▓</span>  <span class="vga-cyan">║</span>',
    `<span class="vga-cyan">║</span>  <span class="vga-white">SysOp: 486Guy  ·  ${d.dosDate}  ·  ${d.clock24}</span>          <span class="vga-cyan">║</span>`,
    '<span class="vga-cyan">╚══════════════════════════════════════════════════════════════╝</span>',
    '',
    '<span class="vga-white">Welcome back, CALLER #4,892!</span>',
    '<span class="vga-green">[NEW FILES]</span>  DOOM1666.ZIP · QMOD42.ZIP · PKZIP204.EXE',
    '<span class="vga-yellow">[MESSAGE #14]</span> From: Turbo66 — "Anyone beat E1M8 on Ultra-Violence yet?"',
    '',
    '<span class="vga-cyan">Main Menu [F]iles [M]essages [D]oors [G]oodbye:</span> G',
  ];
  for (const line of ansiBanner) {
    engine.printHtml(line);
    await engine.wait(120, signal);
  }
  await engine.wait(1700, signal);

  engine.printLine('Thanks for calling! Hanging up...');
  engine.printHtml('<span class="vga-red">NO CARRIER</span>');
  await engine.wait(700, signal);
  engine.cwd = 'C:\\';
  engine.clearTerm();
  engine.showPromptIdle();
}

/* =====================================================================
   9. C:\GAMES\DOOM — Classic DOOM v1.666 Startup Banner Tease!
   ===================================================================== */
async function dosDoomTease(engine, signal) {
  engine.onStatus('C:\\GAMES\\DOOM — Shareware v1.666 startup');
  engine.hideTui();
  engine.cwd = 'C:\\';
  await engine.typeCommand('CD \\GAMES\\DOOM', signal);
  engine.cwd = 'C:\\GAMES\\DOOM';
  await engine.typeCommand('DOOM', signal);
  await engine.pulseHdd(3, 95, signal);

  engine.clearTerm();
  engine.printHtml('<span class="vga-bg-red">                     DOOM Shareware Startup v1.666                      </span>');
  const log = [
    'V_Init: allocate screens.',
    'M_LoadDefaults: Load system defaults.',
    'Z_Init: Init zone memory allocation daemon.',
    'W_Init: Init WADfiles.',
    'adding doom1.wad',
    'M_Init: Init miscellaneous info.',
    'R_Init: Init DOOM refresh daemon - .............................',
    'P_Init: Init Playloop state.',
    'I_Init: Setting up machine state.',
    'D_CheckNetGame: Checking network game status.',
    'S_Init: Setting up sound.',
  ];
  for (const line of log) {
    engine.printLine(line);
    if (Math.random() < 0.4) engine.sounds.hddTick();
    await engine.wait(135, signal);
  }
  await engine.wait(900, signal);

  // Brief retro VGA Mode 13h 3D corridor pulse preview
  const ctx = engine.vgaCtx;
  engine.showVgaCanvas(true);
  let alive = true;
  let elapsed = 0;
  let last = performance.now();
  let raf = 0;

  const render = (now) => {
    if (!alive || engine.destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!engine.paused) elapsed += dt * engine.speed;

    ctx.fillStyle = '#18181c';
    ctx.fillRect(0, 0, 320, 100);
    ctx.fillStyle = '#2d2620';
    ctx.fillRect(0, 100, 320, 100);

    // Classic perspective corridor rings moving forward
    for (let i = 0; i < 9; i++) {
      const depth = ((i + (elapsed * 2.2) % 1) / 9);
      const w = 24 + depth * 296;
      const h = 18 + depth * 176;
      ctx.strokeStyle = i % 2 === 0 ? '#aa0000' : '#aaaaaa';
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(160 - w / 2), Math.round(92 - h / 2), Math.round(w), Math.round(h));
    }

    // Classic gray stone HUD bar at bottom
    ctx.fillStyle = '#6c6c6c';
    ctx.fillRect(0, 168, 320, 32);
    ctx.strokeStyle = '#333333';
    ctx.strokeRect(1, 169, 318, 30);
    ctx.fillStyle = '#ff5555';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('AMMO 50   HEALTH 100%   ARMOR 100%', 22, 188);

    raf = requestAnimationFrame(render);
  };
  raf = requestAnimationFrame(render);

  try {
    await engine.wait(4200, signal);
  } finally {
    alive = false;
    cancelAnimationFrame(raf);
    engine.showVgaCanvas(false);
  }

  engine.clearTerm();
  engine.printHtml('<span class="vga-bg-blue">  Thank you for playing DOOM Shareware!  ·  id Software 1993-1994           </span>');
  engine.printLine('');
  await engine.typeCommand('CD \\', signal);
  engine.cwd = 'C:\\';
  engine.showPromptIdle();
  await engine.wait(500, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'dos-boot', run: dosColdBoot },
  { id: 'dos-dir-mem', run: dosDirAndMem },
  { id: 'dos-defrag', run: dosDefrag },
  { id: 'dos-edit', run: dosEdit },
  { id: 'dos-nc', run: dosNortonCommander },
  { id: 'dos-scandisk', run: dosScanDisk },
  { id: 'dos-qbasic', run: dosQBasicDemo },
  { id: 'dos-bbs', run: dosDialupBbs },
  { id: 'dos-doom', run: dosDoomTease },
];

export const SPECIAL_VIGNETTES = {
  defrag: dosDefrag,
  bbs: dosDialupBbs,
  qbasic: dosQBasicDemo,
  'bios-boot': dosColdBoot,
};
