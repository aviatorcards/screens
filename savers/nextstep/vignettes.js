import { NEXT_ICONS } from './icons.js';
import { leftScrollHtml } from './engine.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* =====================================================================
   1. NeXTSTEP 3.3 Boot & Login Panel (Mach Kernel · 68040)
   ===================================================================== */
export async function nextBootAndLogin(engine, signal) {
  engine.onStatus('NeXTSTEP 3.3 — Loading Mach Kernel');
  engine.clearWindows();
  engine.cleanupSubmenus();

  const overlay = document.createElement('div');
  overlay.className = 'nx-boot-overlay';
  overlay.innerHTML = `
    <div class="nx-login-box" id="nx-login-box">
      <div class="nx-login-head">
        ${NEXT_ICONS.nextCube}
        <div>
          <div style="font-size:18px;font-weight:800;letter-spacing:-0.01em;">NeXTSTEP 3.3</div>
          <div style="font-size:11px;color:#333;">NeXTcube Turbo · Motorola 68040 33MHz · Display PostScript</div>
        </div>
      </div>
      <div id="nx-boot-phase" style="font-family:var(--nx-mono);font-size:11.5px;line-height:1.5;background:#111;color:#e8e8e8;padding:10px 12px;border:1px solid #000;"></div>
    </div>
  `;
  engine.root.appendChild(overlay);
  const phaseEl = overlay.querySelector('#nx-boot-phase');

  try {
    engine.sounds.bootChord();
    const lines = [
      'NeXT ROM Monitor v2.5 (68040 Turbo)',
      'Testing 32 MB RAM & 24 KB DSP56001 (8K×24)… OK',
      'Loading /mach — NeXTSTEP Release 3.3',
      'Starting Display PostScript Window Server…',
      'Mounting /NextApps and /LocalApps…',
    ];
    let buf = '';
    for (const line of lines) {
      buf += (buf ? '\n' : '') + line;
      phaseEl.textContent = buf;
      await engine.wait(320, signal);
    }
    await engine.wait(380, signal);

    // Classic NeXTSTEP Login Panel
    engine.onStatus('NeXTSTEP 3.3 — Logging into Workspace');
    const box = overlay.querySelector('#nx-login-box');
    box.innerHTML = `
      <div class="nx-login-head">
        ${NEXT_ICONS.nextCube}
        <div>
          <div style="font-size:18px;font-weight:800;">NeXTcube Workstation</div>
          <div style="font-size:11px;color:#333;">localhost.next.com · NeXTSTEP Release 3.3</div>
        </div>
      </div>
      <div class="nx-login-field"><span>Name:</span><div class="nx-input" id="nx-user"></div></div>
      <div class="nx-login-field"><span>Password:</span><div class="nx-input" id="nx-pass"></div></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <div class="nx-btn">Restart</div>
        <div class="nx-btn default" id="nx-login-btn">Log In</div>
      </div>
    `;
    const userEl = box.querySelector('#nx-user');
    const passEl = box.querySelector('#nx-pass');
    const loginBtn = box.querySelector('#nx-login-btn');

    await engine.click(userEl, { rx: 0.25, ry: 0.5 }, signal);
    await engine.typeText(userEl, 'me', { delay: 70, removeCaretAtEnd: true }, signal);
    await engine.click(passEl, { rx: 0.25, ry: 0.5 }, signal);
    await engine.typeText(passEl, '••••••••', { delay: 65, removeCaretAtEnd: true }, signal);
    await engine.click(loginBtn, { pressClass: 'pressed', afterMs: 140 }, signal);
    engine.setCursorMode('wait');
    await engine.wait(520, signal);
    engine.setCursorMode('arrow');
  } finally {
    overlay.remove();
  }
}

/* =====================================================================
   2. Workspace Manager — Iconic Miller Columns File Viewer & Recycler
   ===================================================================== */
async function workspaceFileViewer(engine, signal) {
  engine.onStatus('Workspace — Browsing Miller Columns');
  engine.clearWindows();

  const box = engine.getSafeWorkspaceBox();
  const win = engine.createWindow({
    id: 'nx-fileviewer',
    appName: 'Workspace',
    title: 'File Viewer — /me',
    icon: NEXT_ICONS.folder,
    x: box.left + 12,
    y: box.top + 14,
    width: 560,
    height: 350,
    content: `
      <div class="nx-shelf">
        <div class="nx-shelf-item">${NEXT_ICONS.nextCube}<span>NeXTcube</span></div>
        <div class="nx-shelf-item">${NEXT_ICONS.folder}<span>me</span></div>
        <div class="nx-shelf-item">${NEXT_ICONS.folder}<span>NextApps</span></div>
        <div class="nx-shelf-item">${NEXT_ICONS.folder}<span>Projects</span></div>
      </div>
      <div class="nx-pathbar">
        <span id="nx-path">/me/Projects</span>
        <span>412 MB free on SCSI-0</span>
      </div>
      <div class="nx-miller">
        <div class="nx-col" id="nx-c0">
          <div class="nx-col-row"><span>LocalApps</span><span>▸</span></div>
          <div class="nx-col-row"><span>NextApps</span><span>▸</span></div>
          <div class="nx-col-row"><span>NextDeveloper</span><span>▸</span></div>
          <div class="nx-col-row selected"><span>me</span><span>▸</span></div>
        </div>
        <div class="nx-col" id="nx-c1">
          <div class="nx-col-row" data-col1="Mailboxes"><span>Mailboxes</span><span>▸</span></div>
          <div class="nx-col-row selected" data-col1="Projects"><span>Projects</span><span>▸</span></div>
          <div class="nx-col-row" data-col1="Library"><span>Library</span><span>▸</span></div>
          <div class="nx-col-row" data-col1="Desktop"><span>Apps</span><span>▸</span></div>
        </div>
        <div class="nx-col" id="nx-c2">
          <div class="nx-col-row" data-col2="hello"><span>HelloController.m</span></div>
          <div class="nx-col-row" data-col2="nib"><span>MyWindow.nib</span></div>
          <div class="nx-col-row" data-col2="www"><span>WorldWideWeb.app</span><span>▸</span></div>
          <div class="nx-col-row" data-col2="scratch"><span>scratch.ps</span></div>
          <div class="nx-col-row" data-col2="makefile"><span>Makefile</span></div>
        </div>
      </div>
    `,
  });

  await engine.wait(750, signal);
  const pathEl = win.bodyEl.querySelector('#nx-path');
  const helloRow = win.bodyEl.querySelector('[data-col2="hello"]');
  await engine.click(helloRow, { afterMs: 140 }, signal);
  helloRow.classList.add('selected');
  pathEl.textContent = '/me/Projects/HelloController.m';
  await engine.wait(700, signal);

  // Drag scratch.ps onto the swirling black-hole Recycler in the Dock!
  const scratchRow = win.bodyEl.querySelector('[data-col2="scratch"]');
  const recyclerTile = engine.getDockTile('recycler');
  if (scratchRow && recyclerTile) {
    helloRow.classList.remove('selected');
    scratchRow.classList.add('selected');
    pathEl.textContent = '/me/Projects/scratch.ps';
    await engine.drag(scratchRow, recyclerTile, 'scratch.ps', signal);
    scratchRow.remove();
    recyclerTile.classList.add('spin');
    engine.sounds.recyclerWhoosh();
    await engine.wait(850, signal);
    recyclerTile.classList.remove('spin');
  }

  // Empty Recycler via Workspace floating left menu!
  await engine.pickMainMenu('Tools', 'Empty Recycler', signal);
  engine.sounds.recyclerWhoosh();
  await engine.wait(500, signal);

  await engine.click(win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(win);
}

/* =====================================================================
   3. WorldWideWeb.app (CERN) — Where the Web Was Born on NeXTSTEP!
   ===================================================================== */
export async function worldWideWebCern(engine, signal) {
  engine.onStatus('WorldWideWeb.app — Browsing CERN Hypertext');
  engine.clearWindows();

  const wwwTile = engine.getDockTile('www');
  await engine.doubleClick(wwwTile, signal);
  engine.setDockRunning('www', true);
  engine.setCursorMode('wait');
  await engine.wait(420, signal);
  engine.setCursorMode('arrow');

  const box = engine.getSafeWorkspaceBox();
  const win1 = engine.createWindow({
    id: 'nx-www-1',
    appName: 'WorldWideWeb',
    title: 'The World Wide Web project',
    icon: NEXT_ICONS.www,
    x: box.left + 10,
    y: box.top + 10,
    width: 470,
    height: 335,
    content: `
      <div class="nx-scroll-layout">
        ${leftScrollHtml()}
        <div class="nx-www-body">
          <div style="font-size:20px;font-weight:800;margin-bottom:8px;">World Wide Web</div>
          <p style="margin:0 0 10px;">The WorldWideWeb (W3) is a wide-area <span class="nx-www-link" data-link="hyper">hypermedia</span> information retrieval initiative aiming to give universal access to a large universe of documents.</p>
          <p style="margin:0 0 10px;">Everything there is online about W3 is linked directly or indirectly to this document, including an <span class="nx-www-link" data-link="summary">executive summary</span> of the project, Mailing lists, Policy, and <span class="nx-www-link" data-link="next">NeXTSTEP Browser Notes</span>.</p>
          <p style="margin:0;font-size:11.5px;color:#444;">http://info.cern.ch/hypertext/WWW/TheProject.html · CERN, Geneva</p>
        </div>
      </div>
    `,
  });

  await engine.wait(1100, signal);
  const linkEl = win1.bodyEl.querySelector('[data-link="next"]');
  await engine.click(linkEl, { afterMs: 120 }, signal);
  linkEl.classList.add('active');
  await engine.wait(280, signal);
  linkEl.classList.remove('active');

  // Authentic WorldWideWeb.app behavior: clicking a link opens a crisp new hypertext window!
  const d = engine.getDynamicDateInfo();
  const win2 = engine.createWindow({
    id: 'nx-www-2',
    appName: 'WorldWideWeb',
    title: 'NeXTSTEP WorldWideWeb Notes',
    icon: NEXT_ICONS.www,
    x: box.left + 125,
    y: box.top + 78,
    width: 440,
    height: 268,
    content: `
      <div class="nx-scroll-layout">
        ${leftScrollHtml()}
        <div class="nx-www-body">
          <div style="font-size:17px;font-weight:800;margin-bottom:8px;">WorldWideWeb on NeXTSTEP</div>
          <p style="margin:0 0 10px;">Built with Objective-C, AppKit, and Display PostScript on a NeXTcube at CERN. WorldWideWeb is both a hypertext browser and a live WYSIWYG HTML editor.</p>
          <p style="margin:0;font-size:11.5px;color:#333;">Session date: ${d.fullDate} · Connected via Ethernet</p>
        </div>
      </div>
    `,
  });

  await engine.wait(1800, signal);
  await engine.click(win2.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(win2);
  await engine.click(win1.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(win1);
  engine.setDockRunning('www', false);
}

/* =====================================================================
   4. Terminal.app — Mach 2.5 / BSD UNIX Shell
   ===================================================================== */
async function terminalMach(engine, signal) {
  engine.onStatus('Terminal.app — Running Mach UNIX commands');
  engine.clearWindows();

  const termTile = engine.getDockTile('terminal');
  await engine.doubleClick(termTile, signal);
  engine.setDockRunning('terminal', true);

  const d = engine.getDynamicDateInfo();
  const box = engine.getSafeWorkspaceBox();
  const win = engine.createWindow({
    id: 'nx-terminal',
    appName: 'Terminal',
    title: 'Terminal — /bin/csh (NeXTcube)',
    icon: NEXT_ICONS.terminal,
    x: box.left + 26,
    y: box.top + 22,
    width: 540,
    height: 330,
    content: `
      <div class="nx-scroll-layout">
        ${leftScrollHtml()}
        <div class="nx-term-body" id="nx-term"></div>
      </div>
    `,
  });

  const termEl = win.bodyEl.querySelector('#nx-term');
  let lines = [`NeXTSTEP Release 3.3 (NeXTcube) — ${d.unixDate}`, ''];
  const render = (extra = '') => {
    termEl.innerHTML = `${lines.join('\n')}${extra}`;
  };
  const runCmd = async (cmd, output) => {
    let buf = '';
    for (let i = 0; i < cmd.length; i++) {
      buf += cmd[i];
      render(`\nlocalhost% ${buf}<span class="nx-caret"></span>`);
      if (cmd[i] !== ' ') engine.sounds.key();
      await engine.wait(44 + Math.random() * 28, signal);
    }
    await engine.wait(200, signal);
    lines.push(`localhost% ${cmd}`, ...output);
    if (lines.length > 16) lines = lines.slice(-16);
    render('\nlocalhost% <span class="nx-caret"></span>');
    await engine.wait(650, signal);
  };

  render('\nlocalhost% <span class="nx-caret"></span>');
  await engine.wait(450, signal);

  await runCmd('hostinfo', [
    'Mach kernel version:',
    '     NeXT Mach 3.3: Wed Nov 16 17:10:37 PST 1994; root:RELEASE_M68K',
    'Kernel configured for a single processor only.',
    '1 processor is physically available.',
    'Processor type: MC680x0 (68040)',
    'Primary memory available: 32.00 megabytes.',
  ]);

  await runCmd('ls /NextApps', [
    'Edit.app            Mail.app            Preferences.app',
    'InterfaceBuilder.app Preview.app        PrintManager.app',
    'Librarian.app       ProjectBuilder.app  Terminal.app',
    'Webster.app',
  ]);

  await runCmd('cc hello.m -o hello -lNeXT_s && ./hello', [
    `Hello from Objective-C on NeXTSTEP 3.3 (${d.shortDate}, ${d.timeStr})!`,
  ]);

  await engine.wait(1000, signal);
  await engine.click(win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(win);
  engine.setDockRunning('terminal', false);
}

/* =====================================================================
   5. Edit.app — Live Objective-C & AppKit Coding + Miniaturize!
   ===================================================================== */
async function editObjectiveC(engine, signal) {
  engine.onStatus('Edit.app — Writing Objective-C AppKit code');
  engine.clearWindows();

  const editTile = engine.getDockTile('edit');
  await engine.doubleClick(editTile, signal);
  engine.setDockRunning('edit', true);

  const d = engine.getDynamicDateInfo();
  const box = engine.getSafeWorkspaceBox();
  const win = engine.createWindow({
    id: 'nx-edit',
    appName: 'Edit',
    title: 'HelloController.m — /me/Projects',
    icon: NEXT_ICONS.edit,
    x: box.left + 20,
    y: box.top + 18,
    width: 530,
    height: 326,
    content: `
      <div class="nx-scroll-layout">
        ${leftScrollHtml()}
        <div class="nx-edit-body" id="nx-edit-doc"></div>
      </div>
    `,
  });

  const docEl = win.bodyEl.querySelector('#nx-edit-doc');
  await engine.click(docEl, { rx: 0.25, ry: 0.25 }, signal);
  engine.setCursorMode('ibeam');

  const code = `/* HelloController.m — NeXTSTEP 3.3 (${d.shortDate}) */\n#import <appkit/appkit.h>\n\n@implementation HelloController\n- (void)sayHello:sender\n{\n    NXRunAlertPanel("NeXTSTEP",\n        "Welcome to Workspace — %s",\n        "OK", NULL, NULL, "${d.timeStr}");\n}\n@end`;

  await engine.typeText(docEl, code, { delay: 38, removeCaretAtEnd: true }, signal);
  engine.setCursorMode('arrow');
  await engine.wait(600, signal);

  // Save via floating left Main Menu
  await engine.pickMainMenu('File', 'Save', signal);
  await engine.wait(450, signal);

  // Miniaturize into iconic 64×64 NeXT bottom-left miniwindow!
  await engine.click(win.miniBtn, { afterMs: 140 }, signal);
  engine.miniaturizeWindow(win);
  await engine.wait(900, signal);
}

/* =====================================================================
   6. Interface Builder — Visual .nib Construction (Xcode's Ancestor!)
   ===================================================================== */
export async function interfaceBuilder(engine, signal) {
  engine.onStatus('InterfaceBuilder — Designing MyWindow.nib');
  engine.clearWindows();

  const ibTile = engine.getDockTile('ib');
  await engine.doubleClick(ibTile, signal);
  engine.setDockRunning('ib', true);

  const box = engine.getSafeWorkspaceBox();
  const nibWin = engine.createWindow({
    id: 'nx-ib-nib',
    appName: 'InterfaceBuilder',
    title: 'MyWindow.nib — Window',
    icon: NEXT_ICONS.ib,
    x: box.left + 14,
    y: box.top + 26,
    width: 310,
    height: 240,
    content: `
      <div class="nx-ib-canvas">
        <div style="font-size:11px;font-weight:700;color:#222;">Drop AppKit Controls Here:</div>
        <div class="nx-ib-drop" id="nx-ib-drop"></div>
      </div>
    `,
  });

  const palWin = engine.createWindow({
    id: 'nx-ib-pal',
    appName: 'InterfaceBuilder',
    title: 'Palettes — Views',
    icon: NEXT_ICONS.ib,
    x: box.left + 344,
    y: box.top + 26,
    width: 210,
    height: 240,
    content: `
      <div class="nx-ib-palette-grid">
        <div class="nx-btn default" id="pal-btn">Button</div>
        <div class="nx-slider" id="pal-slider"><div class="nx-slider-knob"></div></div>
        <div class="nx-input" style="font-size:11px;">TextField</div>
      </div>
    `,
  });

  const dropEl = nibWin.bodyEl.querySelector('#nx-ib-drop');
  await engine.wait(650, signal);

  // Drag Button from Palette onto MyWindow.nib!
  await engine.drag(palWin.bodyEl.querySelector('#pal-btn'), dropEl, 'NXButton', signal);
  const placedBtn = document.createElement('div');
  placedBtn.className = 'nx-btn default';
  placedBtn.style.alignSelf = 'flex-start';
  placedBtn.textContent = 'Build Project';
  dropEl.appendChild(placedBtn);
  await engine.wait(450, signal);

  // Drag Slider from Palette onto MyWindow.nib!
  await engine.drag(palWin.bodyEl.querySelector('#pal-slider'), dropEl, 'NXSlider', signal);
  const placedSlider = document.createElement('div');
  placedSlider.className = 'nx-slider';
  placedSlider.innerHTML = '<div class="nx-slider-knob" style="left:62%"></div>';
  dropEl.appendChild(placedSlider);
  await engine.wait(500, signal);

  // Run Document -> Test Interface via floating left menu!
  engine.focusWindow(nibWin);
  await engine.pickMainMenu('Document', 'Test Interface', signal);
  await engine.click(placedBtn, { pressClass: 'pressed', afterMs: 150 }, signal);
  engine.sounds.bonk();
  await engine.wait(900, signal);

  await engine.click(palWin.closeBtn, { afterMs: 110 }, signal);
  engine.closeWindow(palWin);
  await engine.click(nibWin.closeBtn, { afterMs: 110 }, signal);
  engine.closeWindow(nibWin);
  engine.setDockRunning('ib', false);
}

/* =====================================================================
   7. NeXTMail — Rich Multimedia Mail
   ===================================================================== */
async function nextMail(engine, signal) {
  engine.onStatus('Mail.app — Reading NeXTMail');
  engine.clearWindows();

  const mailTile = engine.getDockTile('mail');
  await engine.doubleClick(mailTile, signal);
  engine.setDockRunning('mail', true);
  engine.sounds.mailChime();

  const d = engine.getDynamicDateInfo();
  const messages = [
    {
      from: 'timbl@cern.ch',
      subj: 'WorldWideWeb 0.16 on NeXTSTEP',
      date: d.shortDate,
      body: `Hi,\n\nThanks for testing the new hypertext browser on your NeXTcube. Display PostScript renders proportional headings cleanly right out of the box.\n\nBest,\nTim Berners-Lee · CERN`,
    },
    {
      from: 'ed@pixar.com',
      subj: 'RenderMan 3.2 & NeXTdimension notes',
      date: d.shortDate,
      body: `Quick update (${d.weekday}): The i860 NeXTdimension board is chewing through our test shaders nicely. Let's compare frames over lunch.\n\n— RenderMan Team`,
    },
    {
      from: 'nextedge@next.com',
      subj: 'NeXTSTEP 3.3 Developer Release Notes',
      date: d.shortDate,
      body: `Highlights in Release 3.3:\n• Enhanced Objective-C compiler & ProjectBuilder\n• Faster Display PostScript compositing\n• Improved NFS & Mach virtual memory performance`,
    },
  ];

  const box = engine.getSafeWorkspaceBox();
  const win = engine.createWindow({
    id: 'nx-mail',
    appName: 'Mail',
    title: 'Active.mbox — NeXTMail',
    icon: NEXT_ICONS.mail,
    x: box.left + 16,
    y: box.top + 18,
    width: 550,
    height: 342,
    content: `
      <div class="nx-mail-list" id="nx-mlist"></div>
      <div class="nx-scroll-layout">
        ${leftScrollHtml()}
        <div class="nx-mail-read" id="nx-mread"></div>
      </div>
    `,
  });

  const listEl = win.bodyEl.querySelector('#nx-mlist');
  const readEl = win.bodyEl.querySelector('#nx-mread');

  const selectMsg = (idx) => {
    listEl.innerHTML = messages
      .map(
        (m, i) => `
      <div class="nx-mail-row${i === idx ? ' selected' : ''}" data-mrow="${i}">
        <span>${m.from}</span>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.subj}</span>
        <span style="text-align:right;">${m.date}</span>
      </div>`,
      )
      .join('');
    const cur = messages[idx];
    readEl.innerHTML = `
      <div style="border-bottom:1px solid #bbb;padding-bottom:6px;margin-bottom:8px;font-family:var(--nx-font);font-size:11px;">
        <div><strong>From:</strong> ${cur.from}</div>
        <div><strong>Subject:</strong> ${cur.subj}</div>
        <div><strong>Date:</strong> ${d.fullDate} · ${d.timeStr}</div>
      </div>
      <div style="white-space:pre-wrap;">${cur.body}</div>
    `;
  };

  selectMsg(0);
  await engine.wait(1100, signal);

  for (const idx of [1, 2]) {
    const row = listEl.querySelector(`[data-mrow="${idx}"]`);
    if (row) {
      await engine.click(row, { afterMs: 120 }, signal);
      selectMsg(idx);
      await engine.wait(1350, signal);
    }
  }

  await engine.click(win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(win);
  engine.setDockRunning('mail', false);
}

/* =====================================================================
   8. Display PostScript Live Vector Demo!
   ===================================================================== */
export async function displayPostScriptDemo(engine, signal) {
  engine.onStatus('Display PostScript — Live vector rendering');
  engine.clearWindows();

  const box = engine.getSafeWorkspaceBox();
  const win = engine.createWindow({
    id: 'nx-dps',
    appName: 'Display PS',
    title: 'Display PostScript — spiral.ps',
    icon: NEXT_ICONS.nextCube,
    x: box.left + 26,
    y: box.top + 22,
    width: 490,
    height: 336,
    content: `
      <div style="flex:1;background:#ffffff;display:grid;place-items:center;position:relative;">
        <canvas id="nx-dps-canvas" width="460" height="275"></canvas>
      </div>
    `,
  });

  const canvas = win.bodyEl.querySelector('#nx-dps-canvas');
  const ctx = canvas.getContext('2d');

  let alive = true;
  let t = 0;
  let last = performance.now();
  let raf = 0;

  const draw = (now) => {
    if (!alive || engine.destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!engine.paused) t += dt * engine.speed;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 460, 275);

    ctx.save();
    ctx.translate(230, 134);
    for (let i = 0; i < 28; i++) {
      ctx.save();
      ctx.rotate(t * 0.45 + i * 0.22);
      const sz = 18 + i * 4.4;
      const shade = Math.round(25 + (i / 28) * 185);
      ctx.strokeStyle = `rgb(${shade},${shade},${shade})`;
      ctx.lineWidth = 1.4;
      ctx.strokeRect(-sz / 2, -sz / 2, sz, sz);
      ctx.restore();
    }
    ctx.restore();

    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillText('Display PostScript · 600 dpi Vector Compositing', 16, 260);
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  try {
    await engine.wait(5600, signal);
    await engine.click(win.closeBtn, { afterMs: 120 }, signal);
    engine.closeWindow(win);
  } finally {
    alive = false;
    cancelAnimationFrame(raf);
  }
}

/* =====================================================================
   9. Preferences.app — Bonk Alert & Workspace Grayscale Shade
   ===================================================================== */
async function preferencesTweak(engine, signal) {
  engine.onStatus('Preferences.app — Testing Bonk & Workspace tone');
  engine.clearWindows();

  const prefTile = engine.getDockTile('prefs');
  await engine.doubleClick(prefTile, signal);
  engine.setDockRunning('prefs', true);

  const shades = [
    { label: 'Classic #555', hex: '#555555' },
    { label: 'Warm Slate', hex: '#4c5159' },
    { label: 'Deep NeXT', hex: '#3d4047' },
  ];

  const box = engine.getSafeWorkspaceBox();
  const win = engine.createWindow({
    id: 'nx-prefs',
    appName: 'Preferences',
    title: 'Preferences — Sound & Display',
    icon: NEXT_ICONS.prefs,
    x: box.left + randInt(30, 80),
    y: box.top + 32,
    width: 410,
    height: 268,
    content: `
      <div class="nx-pref-strip">
        <div class="nx-pref-tab">🕒<span>Clock</span></div>
        <div class="nx-pref-tab">⌨<span>Keys</span></div>
        <div class="nx-pref-tab active">🔊<span>Sound</span></div>
        <div class="nx-pref-tab">🖥<span>Display</span></div>
      </div>
      <div style="padding:14px 16px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <strong>System Alert Sound: Bonk</strong>
          <div class="nx-btn" id="nx-bonk-btn">Play Bonk</div>
        </div>
        <div style="border-top:1px solid #888;padding-top:10px;">
          <div style="font-weight:700;margin-bottom:8px;">Workspace Backdrop Tone:</div>
          <div style="display:flex;gap:8px;">
            ${shades.map((s, i) => `<div class="nx-btn" data-shade="${i}">${s.label}</div>`).join('')}
          </div>
        </div>
      </div>
    `,
  });

  await engine.wait(500, signal);
  const bonkBtn = win.bodyEl.querySelector('#nx-bonk-btn');
  await engine.click(bonkBtn, { pressClass: 'pressed', afterMs: 140 }, signal);
  engine.sounds.bonk();
  await engine.wait(650, signal);

  engine.deskShadeIndex = (engine.deskShadeIndex + 1) % shades.length;
  const shadeBtn = win.bodyEl.querySelector(`[data-shade="${engine.deskShadeIndex}"]`);
  await engine.click(shadeBtn, { pressClass: 'pressed', afterMs: 140 }, signal);
  engine.setDeskShade(shades[engine.deskShadeIndex].hex);
  await engine.wait(800, signal);

  await engine.click(win.closeBtn, { afterMs: 120 }, signal);
  engine.closeWindow(win);
  engine.setDockRunning('prefs', false);
}

export const REGULAR_VIGNETTES = [
  { id: 'workspace-viewer', run: workspaceFileViewer },
  { id: 'www-cern', run: worldWideWebCern },
  { id: 'terminal-mach', run: terminalMach },
  { id: 'edit-objc', run: editObjectiveC },
  { id: 'interface-builder', run: interfaceBuilder },
  { id: 'next-mail', run: nextMail },
  { id: 'dps-demo', run: displayPostScriptDemo },
  { id: 'prefs-tweak', run: preferencesTweak },
];

export const SPECIAL_VIGNETTES = {
  'next-boot': nextBootAndLogin,
  'www-cern': worldWideWebCern,
  'interface-builder': interfaceBuilder,
  'dps-demo': displayPostScriptDemo,
};
