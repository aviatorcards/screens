const WIN_FLAG_SVG = `
  <svg viewBox="0 0 16 16" width="14" height="14">
    <rect x="1" y="1" width="6" height="6" fill="#e53935"/>
    <rect x="9" y="1" width="6" height="6" fill="#43a047"/>
    <rect x="1" y="9" width="6" height="6" fill="#1e88e5"/>
    <rect x="9" y="9" width="6" height="6" fill="#fdd835"/>
  </svg>
`;

function ico(body) {
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${body}</svg>`;
}

/* Original geometric stand-ins. Not Microsoft trademarks. */
const GLY = {
  pc: ico(`<rect x="7" y="2" width="18" height="14" fill="#d8d4cc" stroke="#000"/><rect x="9" y="4" width="14" height="9" fill="#000080"/><rect x="9" y="4" width="5" height="3" fill="#9ec2ff"/><rect x="13" y="16" width="6" height="3" fill="#808080"/><rect x="6" y="19" width="20" height="6" fill="#c0c0c0" stroke="#000"/><rect x="8" y="21" width="8" height="2" fill="#808080"/>`),
  network: ico(`<rect x="2" y="4" width="12" height="9" fill="#d8d4cc" stroke="#000"/><rect x="4" y="6" width="8" height="5" fill="#000080"/><rect x="4" y="13" width="8" height="3" fill="#c0c0c0" stroke="#000"/><rect x="18" y="12" width="12" height="9" fill="#d8d4cc" stroke="#000"/><rect x="20" y="14" width="8" height="5" fill="#000080"/><rect x="20" y="21" width="8" height="3" fill="#c0c0c0" stroke="#000"/><rect x="8" y="17" width="2" height="8" fill="#404040"/><rect x="8" y="23" width="16" height="2" fill="#404040"/><rect x="22" y="24" width="2" height="4" fill="#404040"/>`),
  bin: ico(`<rect x="8" y="5" width="16" height="3" fill="#808080" stroke="#000"/><rect x="12" y="3" width="8" height="3" fill="none" stroke="#000"/><polygon points="9,10 12,28 20,28 23,10" fill="#c8c8c8" stroke="#000"/><rect x="13" y="13" width="2" height="11" fill="#808080"/><rect x="17" y="13" width="2" height="11" fill="#808080"/>`),
  case: ico(`<rect x="11" y="5" width="10" height="5" fill="none" stroke="#000" stroke-width="2"/><rect x="4" y="10" width="24" height="16" fill="#8a6232" stroke="#000"/><rect x="4" y="16" width="24" height="3" fill="#c4964a"/><rect x="14" y="15" width="4" height="5" fill="#f0d78c" stroke="#000"/>`),
  folder: ico(`<path d="M4 11 H13 L15 8 H28 V26 H4 Z" fill="#f0c84a" stroke="#000"/><rect x="4" y="13" width="24" height="13" fill="#ffe07a" stroke="#000"/>`),
  page: ico(`<rect x="7" y="3" width="16" height="24" fill="#fff" stroke="#000"/><rect x="7" y="3" width="3" height="24" fill="#c62828"/><rect x="13" y="8" width="7" height="2" fill="#222"/><rect x="13" y="13" width="7" height="2" fill="#222"/><rect x="13" y="18" width="5" height="2" fill="#222"/>`),
  notepad: ico(`<rect x="7" y="3" width="18" height="24" fill="#fff" stroke="#000"/><rect x="7" y="3" width="18" height="4" fill="#1d4e9c"/><rect x="10" y="11" width="12" height="2" fill="#2458b5"/><rect x="10" y="15" width="12" height="2" fill="#2458b5"/><rect x="10" y="19" width="8" height="2" fill="#2458b5"/>`),
  paint: ico(`<rect x="3" y="6" width="18" height="16" fill="#fff" stroke="#000"/><circle cx="8" cy="12" r="2" fill="#e53935"/><circle cx="13" cy="12" r="2" fill="#fdd835"/><circle cx="18" cy="16" r="2" fill="#1e88e5"/><rect x="20" y="8" width="4" height="14" rx="1" fill="#8d6e63" stroke="#000" transform="rotate(28 22 15)"/>`),
  card: ico(`<rect x="8" y="3" width="16" height="26" fill="#fff" stroke="#000"/><polygon points="16,8 20,14 16,20 12,14" fill="#c62828"/>`),
  mine: ico(`<rect x="5" y="5" width="22" height="22" fill="#c0c0c0" stroke="#000"/><rect x="6" y="6" width="20" height="3" fill="#fff"/><rect x="15" y="9" width="2" height="12" fill="#222"/><polygon points="17,9 25,13 17,17" fill="#d32f2f"/>`),
  disc: ico(`<circle cx="16" cy="16" r="12" fill="#d5d8e0" stroke="#000"/><circle cx="16" cy="16" r="4" fill="#f7f7f7" stroke="#000"/><circle cx="16" cy="16" r="1.6" fill="#222"/><path d="M10 10 A8 8 0 0 1 20 8" fill="none" stroke="#fff" stroke-width="2"/>`),
  globe: ico(`<circle cx="16" cy="16" r="12" fill="#1e88e5" stroke="#0d3f73"/><ellipse cx="16" cy="16" rx="5" ry="12" fill="none" stroke="#fff" stroke-width="1.3"/><path d="M5 16 H27 M7 11 H25 M7 21 H25" fill="none" stroke="#fff" stroke-width="1.2"/>`),
  mail: ico(`<rect x="3" y="8" width="26" height="16" fill="#fff" stroke="#000"/><path d="M3 8 L16 19 L29 8" fill="none" stroke="#000" stroke-width="1.4"/>`),
  monitor: ico(`<rect x="4" y="5" width="24" height="16" fill="#d8d4cc" stroke="#000"/><rect x="7" y="8" width="18" height="10" fill="#000080"/><rect x="12" y="21" width="8" height="3" fill="#808080"/><rect x="8" y="24" width="16" height="3" fill="#c0c0c0" stroke="#000"/>`),
  speaker: ico(`<polygon points="6,12 12,12 20,6 20,26 12,20 6,20" fill="#d0d0d0" stroke="#000"/><path d="M23 12 Q27 16 23 20" fill="none" stroke="#222" stroke-width="1.6"/>`),
  shield: ico(`<polygon points="16,3 28,8 26,18 16,29 6,18 4,8" fill="#2458b5" stroke="#0c2f66"/><polygon points="16,8 23,11 22,17 16,24 10,17 9,11" fill="#8eb6ef"/>`),
  find: ico(`<circle cx="13" cy="13" r="7" fill="#fff" stroke="#000080" stroke-width="3"/><rect x="18" y="17" width="3" height="10" rx="1" fill="#333" transform="rotate(-40 19 18)"/>`),
  help: ico(`<circle cx="16" cy="16" r="12" fill="#000080"/><path d="M12 13c.4-2.4 2.2-3.8 4.4-3.8 2.6 0 4.2 1.5 4.2 3.6 0 1.8-1.1 2.7-2.6 3.6-1 .6-1.5 1.1-1.5 2.3v.6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="16.4" cy="23" r="1.4" fill="#fff"/>`),
  sliders: ico(`<rect x="4" y="7" width="24" height="3" fill="#808080"/><rect x="4" y="15" width="24" height="3" fill="#808080"/><rect x="4" y="23" width="24" height="3" fill="#808080"/><rect x="8" y="4" width="6" height="9" fill="#c0c0c0" stroke="#000"/><rect x="18" y="12" width="6" height="9" fill="#c0c0c0" stroke="#000"/><rect x="11" y="20" width="6" height="9" fill="#c0c0c0" stroke="#000"/>`),
  programs: ico(`<rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000"/><rect x="4" y="4" width="24" height="6" fill="#000080"/><rect x="8" y="14" width="16" height="2" fill="#222"/><rect x="8" y="18" width="12" height="2" fill="#222"/><rect x="8" y="22" width="14" height="2" fill="#222"/>`),
  run: ico(`<rect x="4" y="6" width="18" height="16" fill="#fff" stroke="#000"/><rect x="4" y="6" width="18" height="4" fill="#000080"/><polygon points="18,14 28,19 18,24" fill="#2e7d32"/>`),
  calc: ico(`<rect x="6" y="3" width="20" height="26" fill="#d0d0d0" stroke="#000"/><rect x="9" y="6" width="14" height="6" fill="#c5e17a" stroke="#000"/><rect x="9" y="15" width="4" height="4" fill="#fff" stroke="#000"/><rect x="15" y="15" width="4" height="4" fill="#fff" stroke="#000"/><rect x="21" y="15" width="4" height="4" fill="#fff" stroke="#000"/><rect x="9" y="21" width="4" height="4" fill="#fff" stroke="#000"/><rect x="15" y="21" width="4" height="4" fill="#fff" stroke="#000"/>`),
  hdd: ico(`<rect x="5" y="8" width="22" height="16" fill="#e4e4e4" stroke="#000"/><rect x="5" y="8" width="22" height="5" fill="#000080"/><circle cx="22" cy="19" r="2.2" fill="#43a047" stroke="#000"/>`),
  media: ico(`<rect x="4" y="6" width="24" height="20" rx="2" fill="#1a1a1a" stroke="#000"/><polygon points="13,11 22,16 13,21" fill="#f5f5f5"/>`),
};

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
          <div class="wev-win1-title"><i class="w1-sys"></i><span>MS-DOS Executive</span><i class="w1-zoom"></i></div>
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
            <div class="wev-win1-title inactive"><i class="w1-sys"></i><span>Clock</span><i class="w1-zoom"></i></div>
            <div class="wev-win1-body" style="display:grid;place-items:center;">
              <canvas id="w1-clock" width="150" height="150"></canvas>
            </div>
          </div>
          <div class="wev-win1-pane">
            <div class="wev-win1-title"><i class="w1-sys"></i><span>Notepad - NOTES.TXT</span><i class="w1-zoom"></i></div>
            <div class="wev-win1-menu"><span>File</span><span>Edit</span><span>Search</span></div>
            <div class="wev-win1-body" id="w1-notepad"></div>
          </div>
        </div>
      </div>
      <div class="wev-win1-tray">
        <div class="wev-win1-icon"><span class="wev-ico">${GLY.card}</span>REVERSI</div>
        <div class="wev-win1-icon"><span class="wev-ico">${GLY.paint}</span>PAINT</div>
        <div class="wev-win1-icon"><span class="wev-ico">${GLY.calc}</span>CALC</div>
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
        <div class="w31-bar"><i class="w31-ctrl sys"></i><span>Program Manager</span><span class="w31-caps"><i class="w31-ctrl min"></i><i class="w31-ctrl max"></i></span></div>
        <div class="w31-menu"><span data-w31-file><u>F</u>ile</span><span><u>O</u>ptions</span><span><u>W</u>indow</span><span><u>H</u>elp</span></div>
        <div class="w31-body">
          <div class="w31-win" style="left:16px;top:14px;width:calc(100% - 34px);height:210px;">
            <div class="w31-bar"><i class="w31-ctrl sys"></i><span>Accessories &amp; Games</span><span class="w31-caps"><i class="w31-ctrl min"></i><i class="w31-ctrl max"></i></span></div>
            <div class="w31-body">
              <div class="w31-icons">
                <div class="w31-app-icon" data-w31-app="write"><div class="w31-glyph">${GLY.page}</div><span>Write</span></div>
                <div class="w31-app-icon" data-w31-app="paint"><div class="w31-glyph">${GLY.paint}</div><span>Paintbrush</span></div>
                <div class="w31-app-icon" data-w31-app="sol"><div class="w31-glyph">${GLY.card}</div><span>Solitaire</span></div>
                <div class="w31-app-icon" data-w31-app="mines"><div class="w31-glyph">${GLY.mine}</div><span>Minesweeper</span></div>
                <div class="w31-app-icon" data-w31-app="win95"><div class="w31-glyph">${GLY.disc}</div><span>Win95 Setup</span></div>
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
      <div class="w31-bar"><i class="w31-ctrl sys" data-w31-close></i><span>Write - NOTES.TXT</span><span class="w31-caps"><i class="w31-ctrl min"></i><i class="w31-ctrl max"></i></span></div>
      <div class="w31-menu"><span>File</span><span>Edit</span><span>Character</span><span>Paragraph</span></div>
      <div class="w31-body w31-doc" id="w31-doc" style="font-family:Georgia,serif;font-size:13px;white-space:pre-wrap;"></div>
    </div>
  `;
  const docEl = overlay.querySelector('#w31-doc');
  const existing = engine.journalLines.join('\n');
  docEl.textContent = existing;
  await engine.click(docEl, { rx: 0.3, ry: 0.5 }, signal);
  const addition = `\n[1992 · Windows 3.1] TrueType fonts and Minesweeper.`;
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
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.pc}</div><span>My Computer</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.network}</div><span>Network Neighborhood</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.bin}</div><span>Recycle Bin</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.case}</div><span>My Briefcase</span></div>
        </div>
        <div id="w95-layer"></div>
      </div>
      <div class="w9x-taskbar">
        <div class="w9x-tb-left">
          <div class="w9x-start" id="w95-start">${WIN_FLAG_SVG}<span>Start</span></div>
          <div class="w9x-tb-task" id="w95-task" style="display:none;"><span class="wev-ico">${GLY.page}</span>My Journal.rtf</div>
        </div>
        <div class="w9x-tray"><span class="wev-ico">${GLY.speaker}</span><span id="w95-clock">${clk.timeStr}</span></div>
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
        <div class="w9x-start-item"><span class="wev-ico">${GLY.programs}</span>Programs ▸</div>
        <div class="w9x-start-item active" data-sm="wordpad"><span class="wev-ico">${GLY.page}</span>Documents — My Journal</div>
        <div class="w9x-start-item"><span class="wev-ico">${GLY.sliders}</span>Settings ▸</div>
        <div class="w9x-start-item"><span class="wev-ico">${GLY.find}</span>Find ▸</div>
        <div class="w9x-start-item"><span class="wev-ico">${GLY.help}</span>Help</div>
        <div class="w9x-start-item"><span class="wev-ico">${GLY.run}</span>Run…</div>
      </div>
    </div>
  `;
  await engine.click(layer.querySelector('[data-sm="wordpad"]'), {}, signal);
  startBtn.classList.remove('open');
  taskPill.style.display = 'inline-flex';

  layer.innerHTML = `
    <div class="w9x-win" style="left:130px;top:48px;width:min(510px,82vw);height:285px;">
      <div class="w9x-bar"><span class="wev-ico">${GLY.page}</span><span class="w9x-title-text">My Journal.rtf - WordPad</span><div class="w9x-bar-btns"><i class="w9x-b min"></i><i class="w9x-b max"></i><i class="w9x-b close" data-w95-x></i></div></div>
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
    <div class="w9x-bar"><span class="wev-ico">${GLY.disc}</span><span class="w9x-title-text">Windows 98 CD-ROM</span><div class="w9x-bar-btns"><i class="w9x-b close"></i></div></div>
    <div style="padding:14px 16px;display:flex;flex-direction:column;gap:14px;font-size:12px;">
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <span class="w9x-dlg-ico">${GLY.disc}</span>
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

  engine.onStatus('Upgrading Windows 95 → Windows 98 SE (1999)');
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
        ['Internet Explorer 5', 'Windows 98 Second Edition, from 1999, includes Internet Explorer 5 and Internet Connection Sharing.'],
        ['Your Files Stay Right Where They Are', 'Preserving My Journal.rtf and Windows 95 settings during upgrade.'],
      ],
    },
    signal,
  );

  engine.setStageHtml(`
    <div class="wev-splash cloud">
      <div style="transform:scale(2.8);margin-bottom:14px;">${WIN_FLAG_SVG}</div>
      <div style="font-size:38px;font-weight:900;letter-spacing:-0.03em;">Microsoft <span style="font-weight:400;">Windows</span> 98</div>
      <div style="font-size:13px;font-weight:700;color:#1e3f7a;">Second Edition · 1999</div>
    </div>
  `);
  engine.sounds.win98Startup();
  await engine.wait(1950, signal);
}

/* =====================================================================
   ERA 5: Windows 98 SE (1999 · IE5) → Upgrade to Windows XP
   ===================================================================== */
export async function eraWin98(engine, signal) {
  engine.onStatus('1999 · Windows 98 SE — Internet Explorer 5');
  engine.setEraBadge('1999 · Windows 98 SE · Pentium II 350 · 64 MB RAM');

  if (engine.journalLines.length === 0) {
    engine.journalLines = ['[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.'];
  }

  const clk = engine.getNowClock();
  const stage = engine.setStageHtml(`
    <div class="wev-w9x win98">
      <div class="w9x-desk">
        <div class="w9x-icons">
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.pc}</div><span>My Computer</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.globe}</div><span>Internet Explorer</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.bin}</div><span>Recycle Bin</span></div>
        </div>
        <div id="w98-layer"></div>
      </div>
      <div class="w9x-taskbar">
        <div class="w9x-tb-left">
          <div class="w9x-start">${WIN_FLAG_SVG}<span>Start</span></div>
          <div style="border-left:1px solid #808080;border-right:1px solid #fff;height:18px;margin:0 2px;"></div>
          <span class="w9x-ql" title="Quick Launch"><span class="wev-ico">${GLY.globe}</span><span class="wev-ico">${GLY.mail}</span><span class="wev-ico">${GLY.monitor}</span></span>
          <div class="w9x-tb-task"><span class="wev-ico">${GLY.notepad}</span>My Journal — Notepad</div>
        </div>
        <div class="w9x-tray"><span class="wev-ico">${GLY.speaker}</span><span>${clk.timeStr}</span></div>
      </div>
    </div>
  `);

  engine.setCursorVisible(true);
  const layer = stage.querySelector('#w98-layer');
  layer.innerHTML = `
    <div class="w9x-win" style="left:128px;top:40px;width:min(520px,82vw);height:290px;">
      <div class="w9x-bar"><span class="wev-ico">${GLY.notepad}</span><span class="w9x-title-text">My Journal.txt - Notepad</span><div class="w9x-bar-btns"><i class="w9x-b min"></i><i class="w9x-b max"></i><i class="w9x-b close"></i></div></div>
      <div class="w9x-body" id="w98-doc" style="font-family:'Courier New',monospace;font-size:12.5px;"></div>
    </div>
  `;
  const docEl = layer.querySelector('#w98-doc');
  const existing = engine.journalLines.join('\n');
  docEl.textContent = existing;

  await engine.wait(650, signal);
  await engine.click(docEl, { rx: 0.3, ry: 0.68 }, signal);
  const addition = `\n[1999 · Windows 98 SE] Internet Explorer 5 and Internet Connection Sharing.`;
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
        ['Your 1985–1999 files come with you', 'Migrating My Journal.txt onto the Windows XP disk.'],
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
      '[1992 · Windows 3.1] TrueType fonts and Minesweeper.',
      '[1995 · Windows 95] Long filenames, the Start button, and 32-bit speed!',
      '[1999 · Windows 98 SE] Internet Explorer 5 and Internet Connection Sharing.',
    ];
  }

  const clk = engine.getNowClock();
  const stage = engine.setStageHtml(`
    <div class="wev-xp">
      <div class="xp-desk" id="xp-desk">
        <div class="w9x-icons">
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.pc}</div><span>My Computer</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.folder}</div><span>My Documents</span></div>
          <div class="w9x-icon"><div class="w9x-icon-box">${GLY.bin}</div><span>Recycle Bin</span></div>
        </div>
        <div id="xp-layer"></div>
      </div>
      <div class="xp-taskbar">
        <div class="xp-start" id="xp-start">${WIN_FLAG_SVG}<span>start</span></div>
        <div class="xp-tray"><span class="wev-ico">${GLY.speaker}</span><span class="wev-ico">${GLY.shield}</span><span>${clk.timeStr}</span></div>
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
  balloon.innerHTML = `<strong><i class="xp-bang"></i>Take a tour of Windows XP</strong><br/>Upgrade complete! Your files from MS-DOS through Windows 98 are ready in My Documents.`;
  layer.appendChild(balloon);
  await engine.wait(1500, signal);

  // Open glossy two-column Luna Start Menu
  await engine.click(startBtn, {}, signal);
  balloon.remove();
  layer.innerHTML = `
    <div class="xp-start-menu">
      <div class="xp-sm-head"><span class="xp-user"></span><span>Tristan</span></div>
      <div class="xp-sm-cols">
        <div class="xp-sm-left">
          <div class="xp-sm-item"><span class="wev-ico">${GLY.globe}</span>Internet Explorer</div>
          <div class="xp-sm-item"><span class="wev-ico">${GLY.mail}</span>Outlook Express</div>
          <div class="xp-sm-item active" data-xp-np><span class="wev-ico">${GLY.notepad}</span>Notepad — My Journal</div>
          <div class="xp-sm-item"><span class="wev-ico">${GLY.paint}</span>Paint</div>
          <div class="xp-sm-item"><span class="wev-ico">${GLY.media}</span>Windows Media Player</div>
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
      <div class="xp-bar"><span class="wev-ico">${GLY.notepad}</span><span class="xp-title-text">My Journal.txt - Notepad</span><div class="xp-caps"><i class="xp-cap min"></i><i class="xp-cap max"></i><i class="xp-close" data-xp-x></i></div></div>
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
      <div class="xp-bar"><span class="wev-ico">${GLY.pc}</span><span class="xp-title-text">My Computer</span><div class="xp-caps"><i class="xp-cap min"></i><i class="xp-cap max"></i><i class="xp-close" data-xp-mcx></i></div></div>
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
          <div class="xp-drive"><div class="w9x-icon-box">${GLY.hdd}</div><div>Local Disk (C:)</div></div>
          <div class="xp-drive"><div class="w9x-icon-box">${GLY.disc}</div><div>CD-RW Drive (D:)</div></div>
          <div class="xp-drive"><div class="w9x-icon-box">${GLY.folder}</div><div>Shared Documents</div></div>
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
  endBalloon.innerHTML = `<strong><i class="xp-bang"></i>1985 → 2001 Evolution Complete</strong><br/>Rewinding back to MS-DOS 3.1 to replay the upgrade timeline…`;
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
