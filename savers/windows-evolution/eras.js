const WIN_FLAG_SVG = `
  <svg viewBox="0 0 16 16" width="14" height="14">
    <rect x="1" y="1" width="6" height="6" fill="#e53935"/>
    <rect x="9" y="1" width="6" height="6" fill="#43a047"/>
    <rect x="1" y="9" width="6" height="6" fill="#1e88e5"/>
    <rect x="9" y="9" width="6" height="6" fill="#fdd835"/>
  </svg>
`;

/* =====================================================================
   ERA 1: MS-DOS 3.1 (1985) → Upgrade to Windows 1.01
   ===================================================================== */
export async function eraDos(engine, signal) {
  engine.onStatus('1985 · MS-DOS 3.1 → Installing Windows 1.01');
  engine.setEraBadge('1985 · MS-DOS 3.1 · IBM PC/AT 286 · 640 KB');
  engine.setCursorVisible(false);

  const d = engine.getNowClock();
  engine.journalLines = [
    `[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.`,
  ];

  const stage = engine.setStageHtml(`<div class="wev-dos" id="dos-box"></div>`);
  const box = stage.querySelector('#dos-box');
  let lines = [
    'IBM Personal Computer DOS Version 3.10',
    '(C)Copyright IBM Corp 1981, 1985',
    `Current date is ${d.shortDate} · Current time is ${d.timeStr}`,
    '',
  ];
  const render = (extra = '') => {
    box.innerHTML = `${engine.esc(lines.join('\n'))}${extra}`;
  };
  const typeCmd = async (cmd) => {
    let buf = '';
    for (let i = 0; i < cmd.length; i++) {
      buf += cmd[i];
      render(`\nC:\\>${engine.esc(buf)}<span class="wev-dos-cursor"></span>`);
      if (cmd[i] !== ' ') engine.sounds.keyClick();
      await engine.wait(52 + Math.random() * 34, signal);
    }
    await engine.wait(220, signal);
    lines.push(`C:\\>${cmd}`);
    render('');
  };

  engine.sounds.pcBeep(1000, 0.12);
  render('\nC:\\><span class="wev-dos-cursor"></span>');
  await engine.wait(650, signal);

  await typeCmd('COPY CON NOTES.TXT');
  await engine.wait(180, signal);
  const note = engine.journalLines[0];
  let nbuf = '';
  for (let i = 0; i < note.length; i++) {
    nbuf += note[i];
    render(`\n${engine.esc(nbuf)}<span class="wev-dos-cursor"></span>`);
    if (note[i] !== ' ') engine.sounds.keyClick();
    await engine.wait(38 + Math.random() * 28, signal);
  }
  lines.push(note, '^Z', '        1 File(s) copied', '');
  render('\nC:\\><span class="wev-dos-cursor"></span>');
  await engine.wait(700, signal);

  await typeCmd('A:\\SETUP');
  await engine.wait(450, signal);

  await engine.runBlueSetup(
    {
      header: 'Microsoft Windows Operating Environment · Version 1.01 Setup',
      diskNote: 'Insert Disk 1 (Setup / Build) in Drive A: (5.25" 360K)',
      steps: [
        [20, 'Checking 640K conventional memory & EGA display…', 'Copying: WIN100.BIN → C:\\WINDOWS'],
        [46, 'Insert Disk 2 (Utilities) into Drive A:…', 'Copying: MSDOS.EXE, CLOCK.EXE, CALC.EXE'],
        [74, 'Insert Disk 3 (Desktop Applications) into Drive A:…', 'Copying: NOTEPAD.EXE, PAINT.EXE, REVERSI.EXE'],
        [100, 'Windows 1.01 Setup complete! Type WIN to start.', 'Setup finished — launching WIN.COM…'],
      ],
    },
    signal,
  );
}

/* =====================================================================
   ERA 2: Windows 1.01 (1985 · EGA Tiled Windows) → Upgrade to Windows 3.1
   ===================================================================== */
export async function eraWin1(engine, signal) {
  engine.onStatus('1985 · Windows 1.01 — Tiled EGA Desk');
  engine.setEraBadge('1985 · Windows 1.01 · EGA · 640 KB');

  if (engine.journalLines.length === 0) {
    engine.journalLines = ['[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.'];
  }

  const stage = engine.setStageHtml(`
    <div class="wev-win1">
      <div class="wev-win1-tiles">
        <div class="wev-win1-pane">
          <div class="wev-win1-title"><span>≡</span><span>MS-DOS Executive</span><span>▲</span></div>
          <div class="wev-win1-menu"><span>File</span><span>View</span><span>Special</span></div>
          <div class="wev-win1-body">
            <div style="margin-bottom:10px;font-weight:700;">A:  [C:]   C:\\WINDOWS</div>
            <div class="wev-win1-files">
              <div class="wev-win1-file">CALC.EXE</div>
              <div class="wev-win1-file">CLOCK.EXE</div>
              <div class="wev-win1-file selected" data-w1-file="notepad">NOTEPAD.EXE</div>
              <div class="wev-win1-file">PAINT.EXE</div>
              <div class="wev-win1-file">REVERSI.EXE</div>
              <div class="wev-win1-file">WRITE.EXE</div>
              <div class="wev-win1-file" data-w1-file="notes">NOTES.TXT</div>
              <div class="wev-win1-file" data-w1-file="setup31">SETUP31.EXE</div>
            </div>
          </div>
        </div>
        <div class="wev-win1-right">
          <div class="wev-win1-pane">
            <div class="wev-win1-title inactive"><span>≡</span><span>Clock</span><span>▲</span></div>
            <div class="wev-win1-body" style="display:grid;place-items:center;">
              <canvas id="w1-clock" width="150" height="150"></canvas>
            </div>
          </div>
          <div class="wev-win1-pane">
            <div class="wev-win1-title"><span>≡</span><span>Notepad - NOTES.TXT</span><span>▲</span></div>
            <div class="wev-win1-menu"><span>File</span><span>Edit</span><span>Search</span></div>
            <div class="wev-win1-body" id="w1-notepad"></div>
          </div>
        </div>
      </div>
      <div class="wev-win1-tray">
        <div class="wev-win1-icon">REVERSI</div>
        <div class="wev-win1-icon">PAINT</div>
        <div class="wev-win1-icon">CALC</div>
      </div>
    </div>
  `);

  // Draw live analog Windows 1.0 clock!
  const clockCanvas = stage.querySelector('#w1-clock');
  const drawClock = () => {
    const ctx = clockCanvas.getContext('2d');
    const now = new Date();
    ctx.clearRect(0, 0, 150, 150);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(75, 75, 62, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      ctx.fillStyle = '#0000aa';
      ctx.fillRect(75 + Math.cos(a) * 52 - 2, 75 + Math.sin(a) * 52 - 2, 4, 4);
    }
    const sec = now.getSeconds();
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;
    const hand = (ang, len, w, col) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(75, 75);
      ctx.lineTo(75 + Math.cos(ang - Math.PI / 2) * len, 75 + Math.sin(ang - Math.PI / 2) * len);
      ctx.stroke();
    };
    hand((hr * Math.PI) / 6, 32, 3.5, '#000');
    hand((min * Math.PI) / 30, 46, 2.5, '#000');
    hand((sec * Math.PI) / 30, 50, 1.2, '#aa0000');
  };
  drawClock();
  const clkTimer = setInterval(drawClock, 1000);

  engine.setCursorVisible(true);
  const notepadEl = stage.querySelector('#w1-notepad');
  const existing = engine.journalLines.join('\n');
  notepadEl.textContent = existing;

  try {
    await engine.wait(700, signal);
    await engine.click(notepadEl, { rx: 0.3, ry: 0.45 }, signal);
    const addition = `\n[1985 · Windows 1.01] Tiled windows! No overlapping yet, but a real mouse & Clock.`;
    engine.journalLines.push(addition.trim());
    await engine.typeInto(notepadEl, addition, { prefix: existing, delay: 42, removeCaretAtEnd: true }, signal);
    await engine.wait(1100, signal);

    // Trigger upgrade to Windows 3.1!
    const setupEl = stage.querySelector('[data-w1-file="setup31"]');
    await engine.doubleClick(setupEl, signal);
  } finally {
    clearInterval(clkTimer);
  }

  engine.onStatus('Upgrading Windows 1.01 → Windows 3.1 (1992)');
  await engine.runBlueSetup(
    {
      header: 'Microsoft Windows 3.1 Setup — Express Upgrade',
      diskNote: 'Upgrading 386DX-40 · 4 MB RAM · 3.5" High-Density Disks (1–6)',
      steps: [
        [18, 'Upgrading Windows 1.01 system files…', 'Copying Disk 1: KRNL386.EXE, GDI.EXE, USER.EXE'],
        [45, 'Installing TrueType Fonts & 386 Enhanced Mode…', 'Copying Disk 3: ARIAL.TTF, TIMES.TTF, PROGMAN.EXE'],
        [76, 'Migrating Accessories & NOTES.TXT…', 'Copying Disk 5: SOL.EXE, PBRUSH.EXE, WRITE.EXE'],
        [100, 'Windows 3.1 installed! Rebooting into 386 Enhanced Mode…', 'Done — Starting Windows 3.1…'],
      ],
    },
    signal,
  );

  // Brief Windows 3.1 Boot Splash + TADA!
  engine.setStageHtml(`
    <div class="wev-splash" style="background:#000080;color:#fff;">
      <div style="transform:scale(2.4);margin-bottom:10px;">${WIN_FLAG_SVG}</div>
      <div style="font-size:34px;font-weight:800;letter-spacing:-0.02em;">Microsoft Windows 3.1</div>
      <div style="font-size:13px;opacity:0.8;">386 Enhanced Mode · 4 MB Extended Memory</div>
    </div>
  `);
  engine.sounds.win31Tada();
  await engine.wait(1650, signal);
}

/* =====================================================================
   ERA 3: Windows 3.1 (1992 · Program Manager) → Upgrade to Windows 95
   ===================================================================== */
export async function eraWin31(engine, signal) {
  engine.onStatus('1992 · Windows 3.1 — Program Manager');
  engine.setEraBadge('1992 · Windows 3.1 · 386DX-40 · 4 MB RAM');

  if (engine.journalLines.length === 0) {
    engine.journalLines = ['[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.'];
  }

  const stage = engine.setStageHtml(`
    <div class="wev-win31">
      <div class="w31-win" style="left:40px;top:34px;width:min(540px,82vw);height:320px;">
        <div class="w31-bar"><div class="w31-ctrl">—</div><span>Program Manager</span><div class="w31-ctrl">▲</div></div>
        <div class="w31-menu"><span data-w31-file><u>F</u>ile</span><span><u>O</u>ptions</span><span><u>W</u>indow</span><span><u>H</u>elp</span></div>
        <div class="w31-body" style="background:#c0c0c0;">
          <div class="w31-win" style="left:16px;top:14px;width:calc(100% - 34px);height:210px;">
            <div class="w31-bar"><div class="w31-ctrl">—</div><span>Accessories &amp; Games</span><div class="w31-ctrl">▼</div></div>
            <div class="w31-body">
              <div class="w31-icons">
                <div class="w31-app-icon" data-w31-app="write"><div class="w31-glyph">📝</div><span>Write</span></div>
                <div class="w31-app-icon" data-w31-app="paint"><div class="w31-glyph">🎨</div><span>Paintbrush</span></div>
                <div class="w31-app-icon" data-w31-app="sol"><div class="w31-glyph">🃏</div><span>Solitaire</span></div>
                <div class="w31-app-icon" data-w31-app="mines"><div class="w31-glyph">💣</div><span>Minesweeper</span></div>
                <div class="w31-app-icon" data-w31-app="win95"><div class="w31-glyph">💿</div><span>Win95 Setup</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="w31-overlay"></div>
    </div>
  `);

  engine.setCursorVisible(true);
  const overlay = stage.querySelector('#w31-overlay');
  await engine.wait(650, signal);

  // Double-click Write to append 1992 journal entry
  const writeIcon = stage.querySelector('[data-w31-app="write"]');
  writeIcon.classList.add('selected');
  await engine.doubleClick(writeIcon, signal);
  writeIcon.classList.remove('selected');

  overlay.innerHTML = `
    <div class="w31-win" style="left:140px;top:92px;width:min(460px,82vw);height:250px;z-index:20;">
      <div class="w31-bar"><div class="w31-ctrl" data-w31-close>—</div><span>Write - NOTES.TXT</span><div class="w31-ctrl">▲</div></div>
      <div class="w31-menu"><span>File</span><span>Edit</span><span>Character</span><span>Paragraph</span></div>
      <div class="w31-body" id="w31-doc" style="font-family:Georgia,serif;font-size:13px;white-space:pre-wrap;"></div>
    </div>
  `;
  const docEl = overlay.querySelector('#w31-doc');
  const existing = engine.journalLines.join('\n');
  docEl.textContent = existing;
  await engine.click(docEl, { rx: 0.3, ry: 0.5 }, signal);
  const addition = `\n[1992 · Windows 3.1] Overlapping windows, TrueType fonts & Solitaire!`;
  engine.journalLines.push(addition.trim());
  await engine.typeInto(docEl, addition, { prefix: existing, delay: 40, removeCaretAtEnd: true }, signal);
  await engine.wait(1000, signal);
  await engine.click(overlay.querySelector('[data-w31-close]'), {}, signal);
  overlay.innerHTML = '';

  // Launch Windows 95 Setup CD-ROM!
  const w95Icon = stage.querySelector('[data-w31-app="win95"]');
  w95Icon.classList.add('selected');
  await engine.doubleClick(w95Icon, signal);

  engine.onStatus('Upgrading Windows 3.1 → Windows 95 (1995)');
  await engine.runGraphicalWizard(
    {
      title: 'Microsoft Windows 95 Setup',
      steps: [
        '1. Preparing Windows 95 Setup Wizard',
        '2. Collecting information about your computer',
        '3. Copying Windows 95 files (CD-ROM)',
        '4. Restarting your computer',
        '5. Setting up Plug and Play hardware',
      ],
      billboards: [
        ['Start Here — Meet the Start Button!', 'Everything you need is now one click away on the brand-new Taskbar.'],
        ['32-Bit Multitasking & Long File Names', 'Say goodbye to 8.3 filenames — welcome to preemptive multitasking on Pentium!'],
        ['Plug and Play Hardware Support', 'Automatically configuring your Sound Blaster, CD-ROM, and SVGA display.'],
      ],
    },
    signal,
  );

  // Iconic Windows 95 Cloudy Boot Splash + Ambient Chord!
  engine.setStageHtml(`
    <div class="wev-splash cloud">
      <div style="transform:scale(2.8);margin-bottom:14px;">${WIN_FLAG_SVG}</div>
      <div style="font-size:38px;font-weight:900;letter-spacing:-0.03em;">Microsoft <span style="font-weight:400;">Windows</span> 95</div>
      <div style="font-size:13px;font-weight:700;color:#1e3f7a;">Starting Windows 95…</div>
    </div>
  `);
  engine.sounds.win95Startup();
  await engine.wait(2100, signal);
}

/* =====================================================================
   ERA 4: Windows 95 (1995 · Start Button) → Upgrade to Windows 98 SE
   ===================================================================== */
export async function eraWin95(engine, signal) {
  engine.onStatus('1995 · Windows 95 — Start Button & WordPad');
  engine.setEraBadge('1995 · Windows 95 · Pentium 100 · 16 MB RAM');

  if (engine.journalLines.length === 0) {
    engine.journalLines = ['[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.'];
  }

  const clk = engine.getNowClock();
  const stage = engine.setStageHtml(`
    <div class="wev-w9x">
      <div class="w9x-desk" id="w95-desk">
        <div class="w9x-icons">
          <div class="w9x-icon"><div class="w9x-icon-box">💻</div><span>My Computer</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">🌐</div><span>Network Neighborhood</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">🗑</div><span>Recycle Bin</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">💼</div><span>My Briefcase</span></div>
        </div>
        <div id="w95-layer"></div>
      </div>
      <div class="w9x-taskbar">
        <div class="w9x-tb-left">
          <div class="w9x-start" id="w95-start">${WIN_FLAG_SVG}<span>Start</span></div>
          <div class="w9x-tb-task" id="w95-task" style="display:none;">📝 My Journal.rtf</div>
        </div>
        <div class="w9x-tray"><span>🔊</span><span id="w95-clock">${clk.timeStr}</span></div>
      </div>
    </div>
  `);

  engine.setCursorVisible(true);
  const startBtn = stage.querySelector('#w95-start');
  const layer = stage.querySelector('#w95-layer');
  const taskPill = stage.querySelector('#w95-task');

  await engine.wait(700, signal);
  await engine.click(startBtn, {}, signal);
  startBtn.classList.add('open');

  layer.innerHTML = `
    <div class="w9x-start-menu" id="w95-sm">
      <div class="w9x-start-rail">Windows 95</div>
      <div class="w9x-start-items">
        <div class="w9x-start-item">📂 Programs ▸</div>
        <div class="w9x-start-item active" data-sm="wordpad">📝 Documents — My Journal</div>
        <div class="w9x-start-item">⚙ Settings ▸</div>
        <div class="w9x-start-item">🔍 Find ▸</div>
        <div class="w9x-start-item">❓ Help</div>
        <div class="w9x-start-item">▶ Run…</div>
      </div>
    </div>
  `;
  await engine.click(layer.querySelector('[data-sm="wordpad"]'), {}, signal);
  startBtn.classList.remove('open');
  taskPill.style.display = 'inline-flex';

  layer.innerHTML = `
    <div class="w9x-win" style="left:130px;top:48px;width:min(510px,82vw);height:285px;">
      <div class="w9x-bar"><span>My Journal.rtf - WordPad</span><div class="w9x-bar-btns"><div class="w9x-b">_</div><div class="w9x-b">□</div><div class="w9x-b" data-w95-x>✕</div></div></div>
      <div class="w9x-body" id="w95-doc" style="font-family:Georgia,serif;"></div>
    </div>
  `;
  const docEl = layer.querySelector('#w95-doc');
  const existing = engine.journalLines.join('\n');
  docEl.textContent = existing;
  await engine.click(docEl, { rx: 0.3, ry: 0.6 }, signal);
  const addition = `\n[1995 · Windows 95] Long filenames, the Start button, and 32-bit speed!`;
  engine.journalLines.push(addition.trim());
  await engine.typeInto(docEl, addition, { prefix: existing, delay: 40, removeCaretAtEnd: true }, signal);
  await engine.wait(950, signal);

  // Classic Windows 98 CD-ROM AutoPlay Upgrade Dialog pops up!
  const cdDlg = document.createElement('div');
  cdDlg.className = 'w9x-win';
  cdDlg.style.cssText = 'left:50%;top:50%;transform:translate(-50%,-50%);width:400px;z-index:260;';
  cdDlg.innerHTML = `
    <div class="w9x-bar"><span>Windows 98 CD-ROM</span><div class="w9x-bar-btns"><div class="w9x-b">✕</div></div></div>
    <div style="padding:14px 16px;display:flex;flex-direction:column;gap:14px;font-size:12px;">
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <span style="font-size:28px;">💿</span>
        <div>This CD-ROM contains a newer version of Windows than the one you are presently using. Would you like to upgrade to <strong>Windows 98 Second Edition</strong>?</div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <div class="w9x-btn" data-cd-yes>Yes</div>
        <div class="w9x-btn">No</div>
      </div>
    </div>
  `;
  layer.appendChild(cdDlg);
  await engine.wait(850, signal);
  await engine.click(cdDlg.querySelector('[data-cd-yes]'), { pressClass: 'pressed' }, signal);

  engine.onStatus('Upgrading Windows 95 → Windows 98 SE (1998)');
  await engine.runGraphicalWizard(
    {
      title: 'Windows 98 Second Edition Setup',
      steps: [
        '1. Preparing to run Windows 98 Setup',
        '2. Collecting information about your computer',
        '3. Copying Windows 98 files',
        '4. Restarting your computer',
        '5. Setting up hardware and finalizing settings',
      ],
      billboards: [
        ['Faster, Easier, More Reliable', 'Windows 98 SE adds USB support, FAT32, Quick Launch, and Internet Explorer 5.'],
        ['Your Files Stay Right Where They Are', 'Preserving My Journal.rtf and Windows 95 settings during upgrade.'],
      ],
    },
    signal,
  );

  engine.setStageHtml(`
    <div class="wev-splash cloud">
      <div style="transform:scale(2.8);margin-bottom:14px;">${WIN_FLAG_SVG}</div>
      <div style="font-size:38px;font-weight:900;letter-spacing:-0.03em;">Microsoft <span style="font-weight:400;">Windows</span> 98</div>
      <div style="font-size:13px;font-weight:700;color:#1e3f7a;">Second Edition · USB &amp; Active Desktop</div>
    </div>
  `);
  engine.sounds.win98Startup();
  await engine.wait(1950, signal);
}

/* =====================================================================
   ERA 5: Windows 98 SE (1998 · Quick Launch & IE5) → Upgrade to Windows XP
   ===================================================================== */
export async function eraWin98(engine, signal) {
  engine.onStatus('1998 · Windows 98 SE — Active Desktop & IE 5');
  engine.setEraBadge('1998 · Windows 98 SE · Pentium II 350 · 64 MB RAM');

  if (engine.journalLines.length === 0) {
    engine.journalLines = ['[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.'];
  }

  const clk = engine.getNowClock();
  const stage = engine.setStageHtml(`
    <div class="wev-w9x win98">
      <div class="w9x-desk">
        <div class="w9x-icons">
          <div class="w9x-icon"><div class="w9x-icon-box">💻</div><span>My Computer</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">🌐</div><span>Internet Explorer</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">🗑</div><span>Recycle Bin</span></div>
        </div>
        <div id="w98-layer"></div>
      </div>
      <div class="w9x-taskbar">
        <div class="w9x-tb-left">
          <div class="w9x-start">${WIN_FLAG_SVG}<span>Start</span></div>
          <div style="border-left:1px solid #808080;border-right:1px solid #fff;height:18px;margin:0 2px;"></div>
          <span title="Quick Launch" style="font-size:13px;display:inline-flex;gap:7px;padding:0 4px;"><span>🌐</span><span>✉</span><span>🖥</span></span>
          <div class="w9x-tb-task">📝 My Journal — Notepad</div>
        </div>
        <div class="w9x-tray"><span>🔊</span><span>${clk.timeStr}</span></div>
      </div>
    </div>
  `);

  engine.setCursorVisible(true);
  const layer = stage.querySelector('#w98-layer');
  layer.innerHTML = `
    <div class="w9x-win" style="left:128px;top:40px;width:min(520px,82vw);height:290px;">
      <div class="w9x-bar"><span>My Journal.txt - Notepad</span><div class="w9x-bar-btns"><div class="w9x-b">_</div><div class="w9x-b">□</div><div class="w9x-b">✕</div></div></div>
      <div class="w9x-body" id="w98-doc" style="font-family:'Courier New',monospace;font-size:12.5px;"></div>
    </div>
  `;
  const docEl = layer.querySelector('#w98-doc');
  const existing = engine.journalLines.join('\n');
  docEl.textContent = existing;

  await engine.wait(650, signal);
  await engine.click(docEl, { rx: 0.3, ry: 0.68 }, signal);
  const addition = `\n[1998 · Windows 98 SE] Gradient title bars, Quick Launch & USB!`;
  engine.journalLines.push(addition.trim());
  await engine.typeInto(docEl, addition, { prefix: existing, delay: 40, removeCaretAtEnd: true }, signal);
  await engine.wait(950, signal);

  // Windows XP Professional CD-ROM AutoPlay menu!
  const xpAuto = document.createElement('div');
  xpAuto.className = 'w9x-win';
  xpAuto.style.cssText = 'left:50%;top:50%;transform:translate(-50%,-50%);width:430px;z-index:260;padding:0;border-color:#245edb;';
  xpAuto.innerHTML = `
    <div style="background:linear-gradient(135deg,#1d56c4,#4a89f0);color:#fff;padding:18px 20px;">
      <div style="font-size:12px;opacity:0.85;">Welcome to Microsoft</div>
      <div style="font-size:24px;font-weight:800;">Windows XP <span style="color:#ff9922;font-style:italic;">Pro</span></div>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;font-size:13px;">
        <div style="background:rgba(255,255,255,0.2);padding:8px 12px;border-radius:4px;font-weight:700;" data-xp-go>▸ Install Windows XP (Upgrade Recommended)</div>
        <div style="opacity:0.75;padding:4px 12px;">▸ Check system compatibility</div>
      </div>
    </div>
  `;
  layer.appendChild(xpAuto);
  await engine.wait(850, signal);
  await engine.click(xpAuto.querySelector('[data-xp-go]'), {}, signal);

  engine.onStatus('Upgrading Windows 98 SE → Windows XP Luna (2001)');
  await engine.runGraphicalWizard(
    {
      xp: true,
      title: 'Windows XP Professional Setup',
      steps: [
        'Collecting information',
        'Dynamic Update',
        'Preparing installation',
        'Installing Windows',
        'Finalizing installation',
      ],
      billboards: [
        ['An exciting new look — Luna & Bliss', 'Windows XP brings a crisp, modern desktop built on rock-solid Windows NT technology.'],
        ['Your 1985–1998 files come with you', 'Migrating My Journal.txt seamlessly from FAT32 to NTFS.'],
        ['Faster, smarter, more reliable', 'Completing installation on Pentium 4 1.8 GHz with 256 MB RAM.'],
      ],
    },
    signal,
  );

  // Iconic Black Windows XP 3-Block Boot Screen!
  engine.setStageHtml(`
    <div class="wev-splash xp-boot">
      <div style="transform:scale(2.8);margin-bottom:14px;">${WIN_FLAG_SVG}</div>
      <div style="font-size:36px;font-weight:800;letter-spacing:-0.02em;">Microsoft <span style="font-weight:300;">Windows</span> <span style="color:#ff8c1a;font-style:italic;">XP</span></div>
      <div class="wev-xp-loader"><div class="wev-xp-blocks"></div></div>
    </div>
  `);
  await engine.wait(2200, signal);

  // Iconic Luna "Welcome" Blue Screen + XP Chime!
  engine.setStageHtml(`<div class="wev-xp-welcome">welcome</div>`);
  engine.sounds.winXpStartup();
  await engine.wait(1750, signal);
}

/* =====================================================================
   ERA 6: Windows XP Luna (2001 · Bliss) — Full Circle!
   ===================================================================== */
export async function eraWinXp(engine, signal) {
  engine.onStatus('2001 · Windows XP Luna — Bliss Desktop');
  engine.setEraBadge('2001 · Windows XP · Pentium 4 · 256 MB RAM');

  if (engine.journalLines.length === 0) {
    engine.journalLines = [
      '[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.',
      '[1992 · Windows 3.1] Overlapping windows, TrueType fonts & Solitaire!',
      '[1995 · Windows 95] Long filenames, the Start button, and 32-bit speed!',
      '[1998 · Windows 98 SE] Gradient title bars, Quick Launch & USB!',
    ];
  }

  const clk = engine.getNowClock();
  const stage = engine.setStageHtml(`
    <div class="wev-xp">
      <div class="xp-desk" id="xp-desk">
        <div class="w9x-icons">
          <div class="w9x-icon"><div class="w9x-icon-box">💻</div><span>My Computer</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">📁</div><span>My Documents</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">🗑</div><span>Recycle Bin</span></div>
        </div>
        <div id="xp-layer"></div>
      </div>
      <div class="xp-taskbar">
        <div class="xp-start" id="xp-start">${WIN_FLAG_SVG}<span>start</span></div>
        <div class="xp-tray"><span>🔊</span><span>🛡</span><span>${clk.timeStr}</span></div>
      </div>
    </div>
  `);

  engine.setCursorVisible(true);
  const layer = stage.querySelector('#xp-layer');
  const startBtn = stage.querySelector('#xp-start');

  // Classic XP Tour Balloon pops up right after login!
  await engine.wait(700, signal);
  engine.sounds.balloonPop();
  const balloon = document.createElement('div');
  balloon.className = 'xp-balloon';
  balloon.innerHTML = `<strong>ⓘ Take a tour of Windows XP</strong><br/>Upgrade complete! Your files from MS-DOS through Windows 98 are ready in My Documents.`;
  layer.appendChild(balloon);
  await engine.wait(1500, signal);

  // Open glossy two-column Luna Start Menu
  await engine.click(startBtn, {}, signal);
  balloon.remove();
  layer.innerHTML = `
    <div class="xp-start-menu">
      <div class="xp-sm-head"><span style="background:#fff;color:#1d56c4;border-radius:4px;padding:3px 6px;">☺</span><span>Tristan</span></div>
      <div class="xp-sm-cols">
        <div class="xp-sm-left">
          <div class="xp-sm-item">🌐 Internet Explorer</div>
          <div class="xp-sm-item">✉ Outlook Express</div>
          <div class="xp-sm-item active" data-xp-np>📝 Notepad — My Journal</div>
          <div class="xp-sm-item">🎨 Paint</div>
          <div class="xp-sm-item">🎵 Windows Media Player</div>
        </div>
        <div class="xp-sm-right">
          <div class="xp-sm-item">My Documents</div>
          <div class="xp-sm-item">My Pictures</div>
          <div class="xp-sm-item">My Music</div>
          <div class="xp-sm-item">My Computer</div>
          <div class="xp-sm-item">Control Panel</div>
        </div>
      </div>
    </div>
  `;
  await engine.click(layer.querySelector('[data-xp-np]'), {}, signal);

  // Open My Computer + Notepad side-by-side showing the full 16-year journey!
  layer.innerHTML = `
    <div class="xp-win" style="left:110px;top:36px;width:min(540px,82vw);height:310px;">
      <div class="xp-bar"><span>My Journal.txt - Notepad</span><div class="xp-close" data-xp-x>✕</div></div>
      <div class="xp-body" id="xp-doc" style="font-family:'Courier New',monospace;font-size:12.5px;"></div>
    </div>
  `;
  const docEl = layer.querySelector('#xp-doc');
  const existing = engine.journalLines.join('\n');
  docEl.textContent = existing;

  await engine.click(docEl, { rx: 0.3, ry: 0.72 }, signal);
  const finalLine = `\n[2001 · Windows XP · ${clk.shortDate}] From 640K C:\\> to Bliss & Luna — 16 years of PC history, still the same file!`;
  await engine.typeInto(docEl, finalLine, { prefix: existing, delay: 40, removeCaretAtEnd: true }, signal);
  await engine.wait(1800, signal);

  // Close Notepad and admire My Computer + Bliss briefly before looping back to 1985!
  await engine.click(layer.querySelector('[data-xp-x]'), {}, signal);
  layer.innerHTML = `
    <div class="xp-win" style="left:130px;top:46px;width:min(540px,82vw);height:286px;">
      <div class="xp-bar"><span>My Computer</span><div class="xp-close" data-xp-mcx>✕</div></div>
      <div class="xp-explorer">
        <div class="xp-sidebar">
          <div class="xp-sidecard">
            <div class="xp-sidecard-head">System Tasks</div>
            <div class="xp-sidecard-body"><span>View system information</span><span>Add or remove programs</span><span>Change a setting</span></div>
          </div>
          <div class="xp-sidecard">
            <div class="xp-sidecard-head">Details</div>
            <div class="xp-sidecard-body"><span>Pentium 4 · 1.8 GHz</span><span>256 MB RAM · NTFS</span></div>
          </div>
        </div>
        <div style="padding:14px;display:flex;flex-wrap:wrap;gap:18px;align-content:flex-start;font-size:12px;">
          <div style="text-align:center;width:96px;"><div style="font-size:28px;">💾</div><div>Local Disk (C:)</div></div>
          <div style="text-align:center;width:96px;"><div style="font-size:28px;">💿</div><div>CD-RW Drive (D:)</div></div>
          <div style="text-align:center;width:96px;"><div style="font-size:28px;">📁</div><div>Shared Documents</div></div>
        </div>
      </div>
    </div>
  `;
  await engine.wait(2200, signal);
  await engine.click(layer.querySelector('[data-xp-mcx]'), {}, signal);
  layer.innerHTML = '';

  engine.sounds.balloonPop();
  const endBalloon = document.createElement('div');
  endBalloon.className = 'xp-balloon';
  endBalloon.innerHTML = `<strong>ⓘ 1985 → 2001 Evolution Complete</strong><br/>Rewinding back to MS-DOS 3.1 to replay the upgrade timeline…`;
  layer.appendChild(endBalloon);
  await engine.wait(2600, signal);
}

export const TIMELINE_ERAS = [
  { key: 'era-dos', run: eraDos },
  { key: 'era-win1', run: eraWin1 },
  { key: 'era-win31', run: eraWin31 },
  { key: 'era-win95', run: eraWin95 },
  { key: 'era-win98', run: eraWin98 },
  { key: 'era-winxp', run: eraWinXp },
];
