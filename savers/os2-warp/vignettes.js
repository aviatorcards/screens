import { WARP_ICONS } from './icons.js';
import { WARP_SCHEMES } from './engine.js';

function formatWarpDate(now = new Date()) {
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  return `${mm}-${dd}-${yy}`;
}

function formatLongDate(now = new Date()) {
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * 0. Classic IBM OS/2 Warp 4 ("Merlin") Boot Splash
 */
export async function warpBoot(engine) {
  engine.setStatus('Booting IBM OS/2 Warp 4…');
  engine.closeAllWindows();
  engine.setCursorKind('wait');

  const boot = document.createElement('div');
  boot.className = 'warp-boot';
  boot.innerHTML = `
    <div class="warp-boot-card">
      <svg class="warp-boot-swoosh" viewBox="0 0 240 180">
        <ellipse cx="148" cy="88" rx="95" ry="38" transform="rotate(-22 148 88)" fill="none" stroke="#cf2c24" stroke-width="14"/>
        <ellipse cx="148" cy="84" rx="76" ry="27" transform="rotate(-22 148 84)" fill="none" stroke="#f2be35" stroke-width="6"/>
        <path d="M40 120 C90 48, 175 34, 230 52" fill="none" stroke="#2268b8" stroke-width="10" stroke-linecap="round"/>
      </svg>
      <div class="warp-boot-ibm">IBM PERSONAL SOFTWARE PRODUCTS</div>
      <h1 class="warp-boot-title">OS/2 <span>Warp</span></h1>
      <div class="warp-boot-ver">Version 4.0 · Internal Revision 9.023 (Merlin)</div>
      <div class="warp-boot-log" data-boot-log></div>
      <div class="warp-boot-bar-wrap"><div class="warp-boot-bar" data-boot-bar></div></div>
    </div>
  `;
  engine.root.appendChild(boot);
  engine.bootEl = boot;

  const logEl = boot.querySelector('[data-boot-log]');
  const barEl = boot.querySelector('[data-boot-bar]');
  const lines = [
    'IBM OS/2 Kernel 4.00 — 32-bit Preemptive Multitasking',
    'Mounting HPFS.IFS (High Performance File System) on C:\\ … OK',
    'Loading IBM1S506.ADD · PMDD.SYS · MMPM/2 Audio Subsystem',
    'Starting TCP/IP Stack & IBM VoiceType Speech Engine',
    'Initializing Workplace Shell (PMSHELL.EXE) & WarpCenter…',
  ];

  try {
    for (let i = 0; i < lines.length; i++) {
      logEl.textContent += (i ? '\n' : '') + lines[i];
      barEl.style.width = `${Math.round(((i + 1) / lines.length) * 100)}%`;
      await engine.wait(480);
    }
    engine.sounds.warpStartup();
    await engine.wait(550);
    boot.classList.add('fade-out');
    await engine.wait(700);
  } finally {
    boot.remove();
    engine.bootEl = null;
    engine.setCursorKind('arrow');
  }
}

/**
 * 1. OS/2 System Folder, Shredder Drag-and-Drop & Spiral Notebook Properties
 */
export async function os2SystemAndShredder(engine) {
  engine.setStatus('Workplace Shell — OS/2 System & Shredder');
  engine.closeAllWindows();

  await engine.selectDeskIcon('os2-system', { doubleClick: true });
  await engine.wait(260);

  const sysWin = engine.createWindow({
    id: 'os2-system',
    title: 'OS/2 System - Icon View',
    icon: WARP_ICONS.os2System,
    width: 490,
    height: 310,
    x: 155,
    y: 52,
    menus: ['File', 'Edit', 'View', 'Help'],
    bodyHtml: `
      <div class="warp-folder-grid">
        <div class="warp-icon" data-item="setup">
          <div class="warp-icon-glyph">${WARP_ICONS.schemePalette}</div>
          <div class="warp-icon-label">System Setup</div>
        </div>
        <div class="warp-icon" data-item="drives">
          <div class="warp-icon-glyph">${WARP_ICONS.drives}</div>
          <div class="warp-icon-label">Drives</div>
        </div>
        <div class="warp-icon" data-item="cmd">
          <div class="warp-icon-glyph">${WARP_ICONS.cmdOs2}</div>
          <div class="warp-icon-label">Command Prompts</div>
        </div>
        <div class="warp-icon" data-item="prod">
          <div class="warp-icon-glyph">${WARP_ICONS.editor}</div>
          <div class="warp-icon-label">Productivity</div>
        </div>
        <div class="warp-icon" data-item="games">
          <div class="warp-icon-glyph">${WARP_ICONS.klondike}</div>
          <div class="warp-icon-label">Games</div>
        </div>
        <div class="warp-icon" data-item="scratch">
          <div class="warp-icon-glyph">${WARP_ICONS.docFile}</div>
          <div class="warp-icon-label">SCRATCH.TMP</div>
        </div>
      </div>
    `,
    statusLeft: '6 objects',
    statusRight: 'HPFS · 412 MB free',
  });

  await engine.wait(650);

  // Drag SCRATCH.TMP straight onto the OS/2 Shredder!
  const scratchEl = sysWin.body.querySelector('[data-item="scratch"]');
  const shredderEl = engine.root.querySelector('[data-desk="shredder"]');
  scratchEl.classList.add('selected');
  await engine.wait(280);

  await engine.dragElTo(
    scratchEl,
    shredderEl,
    `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="width:34px;height:34px;">${WARP_ICONS.docFile}</div>
      <div style="background:#235a9e;color:#fff;font-size:10px;padding:1px 4px;">SCRATCH.TMP</div>
    </div>`,
  );

  // Classic OS/2 Shredder confirmation dialog
  const confirmWin = engine.createWindow({
    id: 'shred-confirm',
    title: 'Confirm Delete — Shredder',
    icon: WARP_ICONS.shredder,
    width: 340,
    height: 155,
    bodyHtml: `
      <div style="flex:1;background:#d0d0d0;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:38px;height:38px;flex-shrink:0;">${WARP_ICONS.shredder}</div>
          <div style="font-size:12px;line-height:1.4;">
            Are you sure you want to permanently shred <strong>SCRATCH.TMP</strong>?
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <div class="warp-btn default" data-shred-ok>Delete</div>
          <div class="warp-btn">Cancel</div>
        </div>
      </div>
    `,
  });

  await engine.wait(550);
  await engine.clickEl(confirmWin.body.querySelector('[data-shred-ok]'));
  engine.sounds.shred();
  engine.closeWindow('shred-confirm');
  scratchEl.remove();
  sysWin.el.querySelector('[data-status-left]').textContent = '5 objects (SCRATCH.TMP shredded)';
  await engine.wait(550);

  // Right-click WPS object to open iconic Spiral-Bound Notebook Properties!
  const prodEl = sysWin.body.querySelector('[data-item="prod"]');
  await engine.moveToEl(prodEl);
  engine.sounds.click();
  prodEl.classList.add('selected');
  const pos = engine.getElCenter(prodEl);
  const ctxMenu = engine.showPopupMenu(pos.x + 12, pos.y + 4, [
    { label: 'Open as', sub: true },
    { label: 'Properties' },
    { sep: true },
    { label: 'Create shadow' },
    { label: 'Copy…' },
    { label: 'Delete…' },
  ]);
  await engine.wait(360);
  const propItem = [...ctxMenu.querySelectorAll('.warp-menu-item')].find((el) =>
    el.textContent.includes('Properties'),
  );
  await engine.moveToEl(propItem, 300);
  propItem.classList.add('highlight');
  await engine.wait(300);
  engine.sounds.click();
  engine.closePopupMenu();

  const nbWin = engine.createWindow({
    id: 'wps-notebook',
    title: 'Productivity — Properties',
    icon: WARP_ICONS.folder,
    width: 440,
    height: 295,
    x: 280,
    y: 120,
    bodyHtml: `
      <div class="warp-notebook">
        <div class="warp-nb-spiral">
          ${'<div class="warp-nb-ring"></div>'.repeat(8)}
        </div>
        <div class="warp-nb-page" data-nb-content>
          <div style="font-weight:700;color:#123664;border-bottom:1px solid #999;padding-bottom:4px;">View — Page 1 of 3</div>
          <label style="display:flex;gap:8px;align-items:center;"><input type="radio" checked /> Flowed Icon View</label>
          <label style="display:flex;gap:8px;align-items:center;"><input type="radio" /> Non-grid Tree View</label>
          <label style="display:flex;gap:8px;align-items:center;"><input type="radio" /> Details View (HPFS Extended Attributes)</label>
          <div style="margin-top:auto;font-size:11px;color:#444;">Font: 9.WarpSans · Object Class: WPFolder</div>
        </div>
        <div class="warp-nb-tabs">
          <div class="warp-nb-tab active" data-tab="view">View</div>
          <div class="warp-nb-tab" data-tab="bg">Background</div>
          <div class="warp-nb-tab" data-tab="sort">Sort</div>
          <div class="warp-nb-tab" data-tab="window">Window</div>
          <div class="warp-nb-tab" data-tab="icon">Icon</div>
        </div>
      </div>
    `,
  });

  await engine.wait(850);
  const bgTab = nbWin.body.querySelector('[data-tab="bg"]');
  await engine.clickEl(bgTab);
  nbWin.body.querySelectorAll('.warp-nb-tab').forEach((t) => t.classList.remove('active'));
  bgTab.classList.add('active');
  nbWin.body.querySelector('[data-nb-content]').innerHTML = `
    <div style="font-weight:700;color:#123664;border-bottom:1px solid #999;padding-bottom:4px;">Background — Page 1 of 1</div>
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:74px;height:52px;background:#ffffff;border:2px inset #888;"></div>
      <div style="font-size:11.5px;line-height:1.5;">
        <strong>Background type:</strong> Color only<br/>
        <strong>Palette:</strong> Warp 4 Standard<br/>
        <strong>Image:</strong> (None)
      </div>
    </div>
    <div style="margin-top:auto;font-size:11px;color:#444;">Drag any swatch from Scheme Palette to recolor instantly.</div>
  `;
  await engine.wait(1100);
  await engine.clickCloseWindow('wps-notebook');
  await engine.wait(220);
  await engine.clickCloseWindow('os2-system');
}

/**
 * 2. OS/2 Command Prompt ([C:\]) & Classic REXX SysInfo
 */
export async function os2CommandRexx(engine) {
  engine.setStatus('OS/2 Window — VER, HPFS DIR & REXX');
  engine.closeAllWindows();

  const trayCmd = engine.root.querySelector('[data-tray="cmd"]');
  await engine.clickEl(trayCmd);
  trayCmd.classList.add('active');
  await engine.wait(220);

  const win = engine.createWindow({
    id: 'os2-cmd',
    title: 'OS/2 Window',
    icon: WARP_ICONS.cmdOs2,
    width: 600,
    height: 370,
    bodyHtml: `<div class="warp-cmd-body"><span data-cmd-out></span><span class="warp-cmd-cursor"></span></div>`,
    statusLeft: 'CMD.EXE (32-bit)',
    statusRight: 'REXX Ready',
  });

  const out = win.body.querySelector('[data-cmd-out]');
  const today = formatWarpDate();

  out.textContent =
    'Operating System/2 Command Interpreter Version 4.00\n' +
    'Type HELP = help  (C) Copyright IBM Corp. 1981, 1996.\n\n[C:\\] ';
  await engine.wait(500);

  await engine.typeText(out, 'ver /r', { charMs: 65 });
  await engine.wait(220);
  out.textContent +=
    '\nThe Operating System/2 Version is 4.00\n' +
    'Revision 9.023 (IBM OS/2 Warp 4)\n\n[C:\\] ';
  await engine.wait(700);

  await engine.typeText(out, 'dir c:\\projects', { charMs: 55 });
  await engine.wait(220);
  engine.spikeCpu(48);
  out.textContent +=
    `\n\n The volume label in drive C is WARP4_HPFS.\n` +
    ` Directory of C:\\PROJECTS\n\n` +
    ` ${today}  09:14a      <DIR>           .\n` +
    ` ${today}  09:14a      <DIR>           ..\n` +
    ` ${today}  10:02a         2,418        SYSINFO.CMD\n` +
    ` ${today}  11:28a        18,944        WARP_NOTES.TXT\n` +
    ` ${today}  02:15p       142,880        PMCLOCK.EXE\n` +
    `        5 file(s)    164,242 bytes used\n` +
    `                 432,185,344 bytes free\n\n[C:\\] `;
  await engine.wait(900);

  await engine.typeText(out, 'rexx sysinfo.cmd', { charMs: 55 });
  await engine.wait(260);
  engine.spikeCpu(74);
  out.textContent +=
    '\n\n--- OS/2 REXX System Report ---\n' +
    '  OS/2 Kernel : Warp 4.00 (Preemptive Multitasking)\n' +
    '  File System : HPFS (Long Filenames + Extended Attrs)\n' +
    '  Threads     : 42 active · Priority Boost ON\n' +
    '  Status      : All Workplace Shell objects nominal.\n\n[C:\\] ';

  await engine.wait(1500);
  trayCmd.classList.remove('active');
  await engine.clickCloseWindow('os2-cmd');
}

/**
 * 3. IBM VoiceType Dictation (Warp 4's Iconic 1996 Speech Feature!)
 */
export async function voiceTypeDictation(engine) {
  engine.setStatus('IBM VoiceType — Live Speech Dictation');
  engine.closeAllWindows();

  await engine.selectDeskIcon('voicetype', { doubleClick: true });
  await engine.wait(260);

  const vtWin = engine.createWindow({
    id: 'voicetype',
    title: 'IBM VoiceType Dictation',
    icon: WARP_ICONS.voiceType,
    width: 440,
    height: 118,
    x: 180,
    y: 34,
    bodyHtml: `
      <div class="warp-voice-bar">
        <div class="warp-voice-mic" data-vt-mic>${WARP_ICONS.voiceType}</div>
        <div class="warp-voice-vu" data-vt-vu>
          ${'<div class="warp-voice-vu-bar"></div>'.repeat(12)}
        </div>
        <div class="warp-voice-status">
          <div style="font-size:10.5px;color:#333;font-weight:700;" data-vt-state>Microphone: Sleeping</div>
          <div class="warp-voice-heard" data-vt-heard>Say "Wake up" to begin…</div>
        </div>
      </div>
    `,
  });

  const padWin = engine.createWindow({
    id: 'vt-pad',
    title: 'Dictation Pad — OS/2 System Editor',
    icon: WARP_ICONS.editor,
    width: 520,
    height: 265,
    x: 165,
    y: 168,
    menus: ['File', 'Edit', 'Options', 'Voice', 'Help'],
    bodyHtml: `<div class="warp-editor-body"><span data-pad-text></span><span class="warp-editor-caret"></span></div>`,
    statusLeft: 'VoiceType Active',
    statusRight: 'US English 22kHz',
  });

  const micEl = vtWin.body.querySelector('[data-vt-mic]');
  const stateEl = vtWin.body.querySelector('[data-vt-state]');
  const heardEl = vtWin.body.querySelector('[data-vt-heard]');
  const vuBars = [...vtWin.body.querySelectorAll('.warp-voice-vu-bar')];
  const padEl = padWin.body.querySelector('[data-pad-text]');

  await engine.wait(500);
  await engine.clickEl(micEl);
  engine.sounds.voiceBeep();
  micEl.classList.add('listening');
  stateEl.textContent = 'Microphone: Listening (Dictation Mode)';

  const speakPhrase = async (heard, written) => {
    heardEl.textContent = `"${heard}"`;
    engine.spikeCpu(62);
    const ticks = 14;
    for (let i = 0; i < ticks; i++) {
      vuBars.forEach((b) => {
        b.style.height = `${4 + Math.floor(Math.random() * 19)}px`;
      });
      await engine.wait(55);
    }
    vuBars.forEach((b) => (b.style.height = '4px'));
    await engine.typeText(padEl, written, { charMs: 22, sound: false });
    await engine.wait(420);
  };

  await speakPhrase('Begin dictation', `IBM OS/2 Warp 4 Voice Memo — ${formatLongDate()}\n\n`);
  await speakPhrase(
    'Built-in voice navigation and dictation',
    'Warp 4 ships with built-in IBM VoiceType navigation and dictation.\n',
  );
  await speakPhrase(
    'Open WarpCenter, new paragraph',
    'Commands like "Open OS/2 System" work hands-free across the desktop.\n\n',
  );
  await speakPhrase(
    'Multitasking stays smooth while speech runs',
    'Even during 22 kHz acoustic recognition, Presentation Manager stays responsive.\n',
  );
  await speakPhrase('Stop listening', '');

  micEl.classList.remove('listening');
  stateEl.textContent = 'Microphone: Sleeping';
  heardEl.textContent = 'Dictation paused.';
  await engine.wait(900);

  await engine.clickCloseWindow('vt-pad');
  await engine.wait(180);
  await engine.clickCloseWindow('voicetype');
}

/**
 * 4. IBM WebExplorer 1.1h (1996 Native OS/2 Web Browser)
 */
export async function ibmWebExplorer(engine) {
  engine.setStatus('IBM WebExplorer — Browsing 1996 OS/2 Web');
  engine.closeAllWindows();

  const trayWeb = engine.root.querySelector('[data-tray="web"]');
  await engine.clickEl(trayWeb);
  trayWeb.classList.add('active');
  await engine.wait(220);

  const win = engine.createWindow({
    id: 'webexplorer',
    title: 'IBM WebExplorer — Warp 4 Home Page',
    icon: WARP_ICONS.webExplorer,
    width: 610,
    height: 390,
    menus: ['File', 'Edit', 'Navigate', 'Configure', 'QuickList', 'Help'],
    bodyHtml: `
      <div class="warp-web-toolbar">
        <div class="warp-web-row">
          <div class="warp-btn" style="padding:2px 8px;">◀ Back</div>
          <div class="warp-btn" style="padding:2px 8px;">Forward ▶</div>
          <div class="warp-btn" style="padding:2px 8px;">Home</div>
          <div class="warp-btn" style="padding:2px 8px;">Reload</div>
          <div class="warp-web-url" data-web-url>http://www.software.ibm.com/os/warp/</div>
          <div class="warp-web-globe" data-web-globe>${WARP_ICONS.webExplorer}</div>
        </div>
      </div>
      <div class="warp-web-page" data-web-page></div>
    `,
    statusLeft: 'Document: Done',
    statusRight: 'TCP/IP · 28.8k PPP',
  });

  const urlEl = win.body.querySelector('[data-web-url]');
  const globeEl = win.body.querySelector('[data-web-globe]');
  const pageEl = win.body.querySelector('[data-web-page]');
  const statusLeft = win.el.querySelector('[data-status-left]');

  const renderPage = async (url, html) => {
    globeEl.classList.add('spinning');
    statusLeft.textContent = `Connecting to ${url}…`;
    engine.spikeCpu(54);
    urlEl.textContent = url;
    await engine.wait(650);
    pageEl.innerHTML = html;
    globeEl.classList.remove('spinning');
    statusLeft.textContent = 'Document: Done';
  };

  await renderPage(
    'http://www.software.ibm.com/os/warp/',
    `
      <h1>IBM OS/2 Warp 4 — The Universal Client</h1>
      <p><strong>Welcome, OS/2 Explorer!</strong> Released in September 1996, OS/2 Warp 4 brings native Java 1.0.2, built-in IBM VoiceType speech recognition, OpenDoc, and the all-new WarpCenter.</p>
      <hr />
      <p><strong>Featured 1996 Links:</strong></p>
      <ul>
        <li><span class="warp-web-link" data-link="hobbes">Hobbes OS/2 Software Archive (hobbes.nmsu.edu)</span> — New PM utilities &amp; REXX scripts</li>
        <li><span class="warp-web-link" data-link="teamos2">Team OS/2 Worldwide Advocacy</span> — Local user groups &amp; WarpStock '96</li>
        <li><span class="warp-web-link">IBM Java Developer Kit for OS/2 Warp</span> — Run applets straight on the Workplace Shell</li>
      </ul>
      <p style="font-size:11px;color:#444;margin-top:16px;">Viewed on ${formatLongDate()} with IBM WebExplorer 1.1h for OS/2 Warp.</p>
    `,
  );

  await engine.wait(1350);
  const hobbesLink = pageEl.querySelector('[data-link="hobbes"]');
  await engine.moveToEl(hobbesLink);
  hobbesLink.classList.add('hover');
  await engine.wait(280);
  engine.sounds.click();

  await renderPage(
    'http://hobbes.nmsu.edu/os2/incoming/',
    `
      <h1>Hobbes — The OS/2 Archive at NMSU</h1>
      <p style="font-family:monospace;font-size:12px;background:#efefef;padding:10px;border:1px inset #999;">
        /pub/os2/incoming/  (Updated ${formatWarpDate()})<br/><br/>
        pmview96.zip    418 KB   PMView 0.96 Fast Image Viewer<br/>
        warpin09.zip    312 KB   WarpIN Package Installer<br/>
        pmmail19.zip    892 KB   SouthSide PMMail 1.95 for OS/2<br/>
        xfree32.zip   2,140 KB   XFree86/OS2 Warp Graphics Pack<br/>
        doom2os2.zip    620 KB   Native 32-bit OS/2 DIVE Engine
      </p>
      <p>Mirror status: <strong>Online</strong> · Serving Team OS/2 since 1993.</p>
    `,
  );

  await engine.wait(1500);
  trayWeb.classList.remove('active');
  await engine.clickCloseWindow('webexplorer');
}

/**
 * 5. OS/2 Pulse CPU Oscilloscope + Preemptive Multitasking Demo
 */
export async function pulseCpuMonitor(engine) {
  engine.setStatus('OS/2 Pulse — Preemptive Multitasking Load');
  engine.closeAllWindows();

  const trayPulse = engine.root.querySelector('[data-tray="pulse"]');
  await engine.clickEl(trayPulse);
  trayPulse.classList.add('active');
  await engine.wait(220);

  const pulseWin = engine.createWindow({
    id: 'os2-pulse',
    title: 'Pulse — CPU Usage',
    icon: WARP_ICONS.pulse,
    width: 390,
    height: 235,
    x: 150,
    y: 55,
    menus: ['Options'],
    bodyHtml: `
      <div class="warp-pulse-wrap">
        <canvas class="warp-pulse-canvas" width="360" height="145"></canvas>
        <div class="warp-pulse-stats">
          <span data-p-cur>CPU: 14%</span>
          <span data-p-thr>Threads: 38</span>
          <span>SMP: Ready</span>
        </div>
      </div>
    `,
  });

  const canvas = pulseWin.body.querySelector('.warp-pulse-canvas');
  const curEl = pulseWin.body.querySelector('[data-p-cur]');
  const thrEl = pulseWin.body.querySelector('[data-p-thr]');
  const ctx = canvas.getContext('2d');
  const samples = new Array(60).fill(14);
  let targetLoad = 16;

  const drawFrame = () => {
    const v = Math.max(5, Math.min(96, Math.round(targetLoad + (Math.random() - 0.45) * 14)));
    samples.push(v);
    if (samples.length > 60) samples.shift();
    curEl.textContent = `CPU: ${v}%`;

    ctx.fillStyle = '#07140b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Oscilloscope grid
    ctx.strokeStyle = '#133a20';
    ctx.lineWidth = 1;
    for (let y = 20; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let x = 0; x < canvas.width; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Filled green Pulse wave
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    samples.forEach((s, i) => {
      const px = (i / (samples.length - 1)) * canvas.width;
      const py = canvas.height - (s / 100) * (canvas.height - 14) - 4;
      ctx.lineTo(px, py);
    });
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(46, 230, 106, 0.25)';
    ctx.fill();

    ctx.beginPath();
    samples.forEach((s, i) => {
      const px = (i / (samples.length - 1)) * canvas.width;
      const py = canvas.height - (s / 100) * (canvas.height - 14) - 4;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = '#38f274';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  for (let i = 0; i < 14; i++) {
    drawFrame();
    await engine.wait(90);
  }

  // Launch a background worker window to visibly spike Pulse + WarpCenter CPU graph
  const workWin = engine.createWindow({
    id: 'os2-bench',
    title: 'OS/2 Window — HPFS Cache & Thread Test',
    icon: WARP_ICONS.cmdOs2,
    width: 410,
    height: 190,
    x: 360,
    y: 235,
    bodyHtml: `<div class="warp-cmd-body" data-bench-out>[C:\\OS2] threads_demo.exe /workers=8\n</div>`,
  });
  const benchOut = workWin.body.querySelector('[data-bench-out]');
  thrEl.textContent = 'Threads: 46';
  targetLoad = 78;
  engine.spikeCpu(84);

  const benchLines = [
    'Spawning 8 preemptive 32-bit OS/2 threads…',
    '  Thread #1..#4: HPFS B-tree index verify (0 stalls)',
    '  Thread #5..#8: Display DIVE blitter pass — 60 fps',
    'Workplace Shell responsiveness: 100% (0 dropped frames)',
    'Benchmark complete. Returning to idle.',
  ];

  for (let s = 0; s < benchLines.length; s++) {
    benchOut.textContent += benchLines[s] + '\n';
    if (s === benchLines.length - 1) targetLoad = 18;
    else engine.spikeCpu(76);
    for (let k = 0; k < 6; k++) {
      drawFrame();
      await engine.wait(95);
    }
  }

  thrEl.textContent = 'Threads: 38';
  for (let i = 0; i < 10; i++) {
    drawFrame();
    await engine.wait(90);
  }

  await engine.clickCloseWindow('os2-bench');
  await engine.wait(160);
  trayPulse.classList.remove('active');
  await engine.clickCloseWindow('os2-pulse');
}

/**
 * 6. WPS Scheme Palette — Direct Drag-and-Drop Theme Switching!
 */
export async function schemePaletteDrag(engine) {
  engine.setStatus('Scheme Palette — Dragging WPS Color Scheme');
  engine.closeAllWindows();

  await engine.openWarpMenuAndPick('OS/2 System');
  await engine.wait(180);

  const schemeKeys = Object.keys(WARP_SCHEMES);
  const nextIndex = (schemeKeys.indexOf(engine.currentScheme) + 1) % schemeKeys.length;
  const targetKey = schemeKeys[nextIndex];
  const targetScheme = WARP_SCHEMES[targetKey];

  const palWin = engine.createWindow({
    id: 'scheme-palette',
    title: 'Scheme Palette — Workplace Shell',
    icon: WARP_ICONS.schemePalette,
    width: 390,
    height: 300,
    x: 190,
    y: 78,
    bodyHtml: `
      <div class="warp-scheme-grid">
        ${schemeKeys
          .map((k) => {
            const sc = WARP_SCHEMES[k];
            return `<div class="warp-scheme-card ${k === engine.currentScheme ? 'active' : ''}" data-scheme="${k}">
              <div class="warp-scheme-swatch" style="background:${sc.desk};">
                <div class="warp-scheme-miniwin" style="background:${sc.chrome};">
                  <div class="warp-scheme-minibar" style="background:${sc.titleActive};"></div>
                </div>
              </div>
              <div class="warp-scheme-name">${sc.name}</div>
            </div>`;
          })
          .join('')}
      </div>
    `,
    statusLeft: 'Drag any scheme onto the desktop',
    statusRight: `Active: ${WARP_SCHEMES[engine.currentScheme].name}`,
  });

  await engine.wait(650);

  // Drag the chosen scheme directly from Scheme Palette onto an open patch of the desktop!
  const cardEl = palWin.body.querySelector(`[data-scheme="${targetKey}"]`);
  const dropZone = engine.root.querySelector('[data-desk="min-viewer"]');
  await engine.dragElTo(
    cardEl,
    dropZone,
    `<div style="width:76px;height:44px;background:${targetScheme.desk};border:2px solid #fff;box-shadow:2px 2px 6px rgba(0,0,0,0.45);padding:4px;">
      <div style="height:10px;background:${targetScheme.titleActive};"></div>
    </div>`,
  );

  engine.sounds.windowOpen();
  engine.applyScheme(targetKey);
  palWin.body.querySelectorAll('.warp-scheme-card').forEach((c) => {
    c.classList.toggle('active', c.dataset.scheme === targetKey);
  });
  palWin.el.querySelector('[data-status-right]').textContent = `Active: ${targetScheme.name}`;

  await engine.wait(1200);
  await engine.clickCloseWindow('scheme-palette');
}

/**
 * 7. OS/2 System Editor (E.EXE) — Writing a REXX Utility
 */
export async function systemEditorRexx(engine) {
  engine.setStatus('System Editor (E.EXE) — Editing WARP4.CMD');
  engine.closeAllWindows();

  const trayEd = engine.root.querySelector('[data-tray="editor"]');
  await engine.clickEl(trayEd);
  trayEd.classList.add('active');
  await engine.wait(220);

  const win = engine.createWindow({
    id: 'sys-editor',
    title: 'OS/2 System Editor — WARP4.CMD',
    icon: WARP_ICONS.editor,
    width: 540,
    height: 340,
    menus: ['File', 'Edit', 'Options', 'Help'],
    bodyHtml: `<div class="warp-editor-body"><span data-ed-text></span><span class="warp-editor-caret"></span></div>`,
    statusLeft: 'Line 1  Col 1',
    statusRight: 'Insert · REXX',
  });

  const edText = win.body.querySelector('[data-ed-text]');
  const statusLeft = win.el.querySelector('[data-status-left]');

  const scriptLines = [
    `/* OS/2 Warp 4 REXX Utility — ${formatLongDate()} */`,
    `Call RxFuncAdd 'SysLoadFuncs', 'RexxUtil', 'SysLoadFuncs'`,
    `Call SysLoadFuncs`,
    ``,
    `Say 'IBM OS/2 Warp' SysOS2Ver() 'is up and running!'`,
    `Say 'Boot Drive:' SysBootDrive() ' · Free Space:' SysDriveInfo('C:')`,
    `Call SysSleep 1`,
    `Exit 0`,
  ];

  for (let i = 0; i < scriptLines.length; i++) {
    await engine.typeText(edText, scriptLines[i] + '\n', { charMs: 36 });
    statusLeft.textContent = `Line ${i + 2}  Col 1`;
    await engine.wait(110);
  }

  // Click File -> Save
  const fileItem = win.el.querySelector('[data-mbar="File"]');
  await engine.moveToEl(fileItem);
  fileItem.classList.add('active');
  engine.sounds.click();
  const r = fileItem.getBoundingClientRect();
  const menu = engine.showPopupMenu(r.left, r.bottom + 1, [
    { label: 'New' },
    { label: 'Open…' },
    { label: 'Save          Ctrl+S' },
    { label: 'Save as…' },
    { sep: true },
    { label: 'Exit' },
  ]);
  await engine.wait(320);
  const saveItem = [...menu.querySelectorAll('.warp-menu-item')].find((el) =>
    el.textContent.trim().startsWith('Save '),
  );
  await engine.moveToEl(saveItem, 280);
  saveItem.classList.add('highlight');
  await engine.wait(280);
  engine.sounds.click();
  engine.closePopupMenu();
  fileItem.classList.remove('active');
  statusLeft.textContent = 'Saved C:\\PROJECTS\\WARP4.CMD (278 bytes)';

  await engine.wait(900);
  trayEd.classList.remove('active');
  await engine.clickCloseWindow('sys-editor');
}

/**
 * 8. OS/2 Klondike Solitaire
 */
export async function klondikeSolitaire(engine) {
  engine.setStatus('Klondike Solitaire — Playing a Hand');
  engine.closeAllWindows();

  await engine.openWarpMenuAndPick('Programs');
  await engine.wait(200);

  const cardHtml = (rank, suit, color, topPx = 0, id = '') =>
    `<div class="warp-card ${color}" ${id ? `data-card="${id}"` : ''} style="top:${topPx}px;">
      <div>${rank}${suit}</div>
      <div style="text-align:center;font-size:24px;line-height:1;">${suit}</div>
      <div style="text-align:right;">${rank}${suit}</div>
    </div>`;

  const win = engine.createWindow({
    id: 'klondike',
    title: 'Klondike Solitaire — OS/2 Games',
    icon: WARP_ICONS.klondike,
    width: 530,
    height: 375,
    menus: ['Game', 'Moves', 'Options', 'Help'],
    bodyHtml: `
      <div class="warp-klondike">
        <div class="warp-kl-top">
          <div class="warp-kl-slots">
            <div class="warp-card back" data-deck></div>
            <div class="warp-card-slot" data-waste></div>
          </div>
          <div class="warp-kl-slots">
            <div class="warp-card-slot" data-ace="spades">♠</div>
            <div class="warp-card-slot" data-ace="hearts">♥</div>
            <div class="warp-card-slot" data-ace="clubs">♣</div>
            <div class="warp-card-slot" data-ace="diamonds">♦</div>
          </div>
        </div>
        <div class="warp-kl-tableau">
          <div class="warp-kl-col" data-col="0">
            ${cardHtml('A', '♠', 'black', 0, 'as')}
          </div>
          <div class="warp-kl-col" data-col="1">
            <div class="warp-card back" style="top:0px;"></div>
            ${cardHtml('9', '♥', 'red', 18, '9h')}
          </div>
          <div class="warp-kl-col" data-col="2">
            <div class="warp-card back" style="top:0px;"></div>
            <div class="warp-card back" style="top:16px;"></div>
            ${cardHtml('10', '♣', 'black', 32, '10c')}
          </div>
          <div class="warp-kl-col" data-col="3">
            <div class="warp-card back" style="top:0px;"></div>
            ${cardHtml('A', '♥', 'red', 18, 'ah')}
          </div>
          <div class="warp-kl-col" data-col="4">
            <div class="warp-card back" style="top:0px;"></div>
            <div class="warp-card back" style="top:16px;"></div>
            ${cardHtml('K', '♦', 'red', 32, 'kd')}
          </div>
        </div>
      </div>
    `,
    statusLeft: 'Score: 0',
    statusRight: 'Moves: 0',
  });

  const scoreEl = win.el.querySelector('[data-status-left]');
  const movesEl = win.el.querySelector('[data-status-right]');
  await engine.wait(650);

  // Move 1: Ace of Spades to foundation
  const cardAS = win.body.querySelector('[data-card="as"]');
  const aceSpades = win.body.querySelector('[data-ace="spades"]');
  await engine.dragElTo(cardAS, aceSpades, cardAS.outerHTML);
  engine.sounds.cardSnap();
  cardAS.remove();
  aceSpades.outerHTML = cardHtml('A', '♠', 'black', 0);
  scoreEl.textContent = 'Score: 10';
  movesEl.textContent = 'Moves: 1';
  await engine.wait(500);

  // Move 2: Ace of Hearts to foundation
  const cardAH = win.body.querySelector('[data-card="ah"]');
  const aceHearts = win.body.querySelector('[data-ace="hearts"]');
  await engine.dragElTo(cardAH, aceHearts, cardAH.outerHTML);
  engine.sounds.cardSnap();
  cardAH.remove();
  aceHearts.outerHTML = cardHtml('A', '♥', 'red', 0);
  scoreEl.textContent = 'Score: 20';
  movesEl.textContent = 'Moves: 2';
  await engine.wait(500);

  // Move 3: 9 of Hearts onto 10 of Clubs
  const card9H = win.body.querySelector('[data-card="9h"]');
  const card10C = win.body.querySelector('[data-card="10c"]');
  await engine.dragElTo(card9H, card10C, card9H.outerHTML);
  engine.sounds.cardSnap();
  card9H.style.top = '54px';
  win.body.querySelector('[data-col="2"]').appendChild(card9H);
  scoreEl.textContent = 'Score: 25';
  movesEl.textContent = 'Moves: 3';
  await engine.wait(550);

  // Flip a card from the stock deck
  const deckEl = win.body.querySelector('[data-deck]');
  await engine.clickEl(deckEl);
  engine.sounds.cardSnap();
  const wasteEl = win.body.querySelector('[data-waste]');
  wasteEl.outerHTML = cardHtml('2', '♠', 'black', 0);
  movesEl.textContent = 'Moves: 4';

  await engine.wait(1100);
  await engine.clickCloseWindow('klondike');
}

export const REGULAR_VIGNETTES = [
  os2SystemAndShredder,
  os2CommandRexx,
  voiceTypeDictation,
  ibmWebExplorer,
  pulseCpuMonitor,
  schemePaletteDrag,
  systemEditorRexx,
  klondikeSolitaire,
];

export const SPECIAL_VIGNETTES = {
  'warp-boot': warpBoot,
  voicetype: voiceTypeDictation,
  'scheme-palette': schemePaletteDrag,
  webexplorer: ibmWebExplorer,
};
