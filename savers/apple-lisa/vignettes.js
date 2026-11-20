import { LISA_ICONS } from './icons.js';

/* =====================================================================
   0. Apple Lisa ROM Self-Test & Starting From ProFile 5 MB
   ===================================================================== */
export async function lisaBootSequence(engine, signal) {
  engine.onStatus('Apple Lisa — ROM Self-Test & ProFile 5 MB Boot');
  engine.closeAllWindows();
  engine.setCursorKind('hourglass');

  const boot = document.createElement('div');
  boot.className = 'lisa-boot';
  boot.innerHTML = `
    <div class="lisa-boot-card">
      <div class="lisa-boot-title">Apple Lisa · Self-Test</div>
      <div class="lisa-boot-sub" data-boot-sub>Checking system hardware (MC68000 · 5 MHz · 1024K RAM)…</div>
      <div class="lisa-selftest-row">
        <div class="lisa-st-chip" data-st="cpu"><span>68000</span><span>CPU</span></div>
        <div class="lisa-st-chip" data-st="io"><span>I/O</span><span>Board</span></div>
        <div class="lisa-st-chip" data-st="ram"><span>1 MB</span><span>Memory</span></div>
        <div class="lisa-st-chip" data-st="profile"><span>5 MB</span><span>ProFile</span></div>
        <div class="lisa-st-chip" data-st="disk"><span>3.5"</span><span>Diskette</span></div>
      </div>
      <div style="font-size:11.5px;font-weight:700;" data-boot-msg>Running Power-On Diagnostics…</div>
    </div>
  `;
  engine.root.appendChild(boot);
  engine.overlayEl = boot;

  try {
    const sub = boot.querySelector('[data-boot-sub]');
    const msg = boot.querySelector('[data-boot-msg]');
    const chips = [...boot.querySelectorAll('.lisa-st-chip')];

    for (let i = 0; i < chips.length; i++) {
      chips[i].classList.add('testing');
      engine.sounds.profileSeek();
      await engine.wait(280, signal);
      chips[i].classList.remove('testing');
      chips[i].classList.add('ok');
      await engine.wait(110, signal);
    }

    engine.sounds.selfTestBeep(false);
    await engine.wait(150, signal);
    engine.sounds.selfTestBeep(true);

    sub.textContent = 'Lisa Office System 7/7 · Release 3.1';
    msg.textContent = 'Starting From ProFile…';
    await engine.pulseProFile(6, 'ProFile 5 MB · Starting Lisa OS', signal);
    await engine.wait(420, signal);

    boot.classList.add('fade-out');
    await engine.wait(480, signal);
  } finally {
    boot.remove();
    engine.overlayEl = null;
    engine.setCursorKind('arrow');
  }
}

/* =====================================================================
   1. LisaWrite — Tear Off Stationery & Draft a Cupertino Memo
   ===================================================================== */
export async function lisaWriteMemo(engine, signal) {
  engine.onStatus('LisaWrite — Tearing Off Stationery & Drafting Memo');
  engine.closeAllWindows();

  await engine.tearOffStationery('pad-write', 'Cupertino Memo', signal);

  engine.setAppMenus('LisaWrite', ['File/Print', 'Edit', 'Type Style', 'Page Layout', 'Search']);
  const dInfo = engine.getDateInfo();

  const win = engine.createWindow({
    id: 'lisawrite',
    title: 'Cupertino Memo — LisaWrite',
    width: 540,
    height: 360,
    bodyHtml: `
      <div class="lw-ruler">
        <span>Margins: 1.0" – 6.5"</span>
        <span data-lw-style>12 pt Classic · Plain</span>
        <span>Page 1</span>
      </div>
      <div class="lw-page">
        <div style="font-weight:700;font-size:15px;margin-bottom:4px;">MEMORANDUM — BANDLEY DRIVE</div>
        <div style="font-size:12px;margin-bottom:10px;border-bottom:1px solid #0f0f0e;padding-bottom:6px;">
          Date: ${dInfo.longDate} · ${dInfo.timeStr}<br/>
          To: Lisa Office System 7/7 Team<br/>
          Re: Stationery Pads &amp; Integrated Desktop
        </div>
        <span data-lw-body></span><span class="lw-caret"></span>
      </div>
    `,
  });

  const bodySpan = win.body.querySelector('[data-lw-body]');
  const styleSpan = win.body.querySelector('[data-lw-style]');

  await engine.moveToEl(win.body, 420, signal);
  engine.setCursorKind('ibeam');
  await engine.wait(280, signal);

  await engine.typeText(
    bodySpan,
    'Tore off a fresh LisaWrite sheet from the desktop stationery pad.\n\n' +
      'With 1 MB of RAM and the ProFile 5 MB hard disk, we can keep LisaCalc, LisaGraph, and LisaDraw open side-by-side and paste tables straight through the Clipboard.\n\n',
    { charMs: 36 },
    signal,
  );

  // Switch Type Style via menu bar!
  engine.setCursorKind('arrow');
  await engine.pickMenu(
    'type style',
    [
      { label: 'Plain Text' },
      { label: 'Bold' },
      { label: 'Italic' },
      { label: 'Underline' },
      { sep: true },
      { label: '12 Point Classic' },
      { label: '18 Point Modern' },
    ],
    'Bold',
    signal,
  );
  styleSpan.textContent = '12 pt Classic · Bold';

  const boldEl = document.createElement('strong');
  bodySpan.appendChild(boldEl);
  engine.setCursorKind('ibeam');
  await engine.typeText(boldEl, 'Next milestone: Verify LisaProject critical path before Friday.', { charMs: 42 }, signal);

  await engine.wait(950, signal);
  engine.setCursorKind('arrow');

  // Authentic Lisa Save & Put Away!
  await engine.pickMenu(
    'file/print',
    [
      { label: 'Save & Continue' },
      { label: 'Save & Put Away' },
      { label: 'Revert to Previous Version' },
      { sep: true },
      { label: 'Format for Printer…' },
      { label: 'Print…' },
    ],
    'Save & Put Away',
    signal,
  );
  await engine.pulseProFile(4, 'ProFile 5 MB · Saving Cupertino Memo', signal);
  engine.closeWindow('lisawrite');
  engine.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
}

/* =====================================================================
   2. LisaDraw — 1-Bit Vector Hardware Diagram of the Apple Lisa
   ===================================================================== */
export async function lisaDrawWorkstation(engine, signal) {
  engine.onStatus('LisaDraw — Sketching Vector Lisa Workstation');
  engine.closeAllWindows();

  await engine.tearOffStationery('pad-draw', 'Lisa Architecture', signal);
  engine.setAppMenus('LisaDraw', ['File/Print', 'Edit', 'Arrange', 'Shades', 'Lines']);

  const win = engine.createWindow({
    id: 'lisadraw',
    title: 'Lisa Architecture — LisaDraw',
    width: 576,
    height: 374,
    bodyHtml: `
      <div class="ld-wrap">
        <div class="ld-palette">
          <div class="ld-tool active" data-tool="arrow">↖</div>
          <div class="ld-tool" data-tool="text">A</div>
          <div class="ld-tool" data-tool="line">╱</div>
          <div class="ld-tool" data-tool="rect">▭</div>
          <div class="ld-tool" data-tool="rrect">▢</div>
          <div class="ld-tool" data-tool="oval">◯</div>
        </div>
        <div class="ld-canvas-area">
          <div class="ld-patterns">
            <span>Fill:</span>
            <span class="ld-swatch active" data-pat="white" style="background:#f5f4ed;"></span>
            <span class="ld-swatch" data-pat="dots" style="background:radial-gradient(#0f0f0e 1px,#f5f4ed 1px) 0 0/4px 4px;"></span>
            <span class="ld-swatch" data-pat="hatch" style="background:repeating-linear-gradient(45deg,#0f0f0e 0 1px,#f5f4ed 1px 4px);"></span>
            <span class="ld-swatch" data-pat="black" style="background:#0f0f0e;"></span>
          </div>
          <canvas class="ld-canvas" data-ld-canvas width="490" height="304"></canvas>
        </div>
      </div>
    `,
  });

  const canvas = win.body.querySelector('[data-ld-canvas]');
  const ctx = canvas.getContext('2d');

  const selectTool = async (name) => {
    const btn = win.body.querySelector(`[data-tool="${name}"]`);
    await engine.clickEl(btn, {}, signal);
    win.body.querySelectorAll('.ld-tool').forEach((t) => t.classList.toggle('active', t === btn));
  };

  const selectPat = async (name) => {
    const sw = win.body.querySelector(`[data-pat="${name}"]`);
    await engine.clickEl(sw, {}, signal);
    win.body.querySelectorAll('.ld-swatch').forEach((s) => s.classList.toggle('active', s === sw));
  };

  const makeDotPattern = () => {
    const p = document.createElement('canvas');
    p.width = 4;
    p.height = 4;
    const g = p.getContext('2d');
    g.fillStyle = '#f5f4ed';
    g.fillRect(0, 0, 4, 4);
    g.fillStyle = '#0f0f0e';
    g.fillRect(0, 0, 1, 1);
    g.fillRect(2, 2, 1, 1);
    return ctx.createPattern(p, 'repeat');
  };

  const makeHatchPattern = () => {
    const p = document.createElement('canvas');
    p.width = 6;
    p.height = 6;
    const g = p.getContext('2d');
    g.fillStyle = '#f5f4ed';
    g.fillRect(0, 0, 6, 6);
    g.strokeStyle = '#0f0f0e';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(0, 6);
    g.lineTo(6, 0);
    g.stroke();
    return ctx.createPattern(p, 'repeat');
  };

  const drawHandles = (x, y, w, h) => {
    ctx.fillStyle = '#0f0f0e';
    const pts = [
      [x, y], [x + w / 2, y], [x + w, y],
      [x, y + h / 2], [x + w, y + h / 2],
      [x, y + h], [x + w / 2, y + h], [x + w, y + h],
    ];
    for (const [hx, hy] of pts) {
      ctx.fillRect(hx - 2.5, hy - 2.5, 5, 5);
    }
  };

  const dotPat = makeDotPattern();
  const hatchPat = makeHatchPattern();

  const canvasToViewport = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    return { x: r.left + (cx / canvas.width) * r.width, y: r.top + (cy / canvas.height) * r.height };
  };

  // Step 1: Draw main Lisa chassis (Rectangle + Dot Fill)
  await selectTool('rect');
  await selectPat('dots');
  engine.setCursorKind('cross');

  const p1 = canvasToViewport(130, 88);
  const p2 = canvasToViewport(360, 214);
  await engine.moveTo(p1.x, p1.y, 420, signal);
  engine.sounds.click();
  await engine.moveTo(p2.x, p2.y, 560, signal);
  engine.sounds.click();

  ctx.fillStyle = dotPat;
  ctx.strokeStyle = '#0f0f0e';
  ctx.lineWidth = 2;
  ctx.fillRect(130, 88, 230, 126);
  ctx.strokeRect(130, 88, 230, 126);
  await engine.wait(280, signal);

  // Step 2: Draw 12" monochrome CRT bezel & active screen on left side of Lisa
  await selectTool('rrect');
  await selectPat('white');
  engine.setCursorKind('cross');
  const p3 = canvasToViewport(146, 102);
  const p4 = canvasToViewport(266, 186);
  await engine.moveTo(p3.x, p3.y, 380, signal);
  engine.sounds.click();
  await engine.moveTo(p4.x, p4.y, 480, signal);
  engine.sounds.click();

  ctx.fillStyle = '#0f0f0e';
  ctx.fillRect(146, 102, 120, 84);
  ctx.fillStyle = '#f5f4ed';
  ctx.fillRect(154, 110, 104, 68);
  ctx.fillStyle = '#0f0f0e';
  ctx.fillRect(154, 110, 104, 9); // mini menu bar
  ctx.strokeRect(166, 126, 62, 40); // mini Lisa window
  ctx.fillRect(166, 126, 62, 7);
  await engine.wait(280, signal);

  // Step 3: Draw dual Twiggy 5.25" / Sony drive bay on right side
  await selectTool('rect');
  await selectPat('hatch');
  engine.setCursorKind('cross');
  const p5 = canvasToViewport(282, 110);
  const p6 = canvasToViewport(346, 184);
  await engine.moveTo(p5.x, p5.y, 380, signal);
  engine.sounds.click();
  await engine.moveTo(p6.x, p6.y, 420, signal);
  engine.sounds.click();

  ctx.fillStyle = hatchPat;
  ctx.fillRect(282, 110, 64, 74);
  ctx.strokeRect(282, 110, 64, 74);
  ctx.fillStyle = '#0f0f0e';
  ctx.fillRect(292, 130, 44, 5);
  ctx.fillRect(292, 154, 44, 5);
  await engine.wait(260, signal);

  // Step 4: Draw iconic ProFile 5 MB hard drive sitting on top of the Lisa!
  await selectPat('white');
  engine.setCursorKind('cross');
  const p7 = canvasToViewport(164, 38);
  const p8 = canvasToViewport(326, 84);
  await engine.moveTo(p7.x, p7.y, 420, signal);
  engine.sounds.click();
  await engine.moveTo(p8.x, p8.y, 500, signal);
  engine.sounds.click();

  ctx.fillStyle = '#f5f4ed';
  ctx.fillRect(164, 38, 162, 46);
  ctx.strokeRect(164, 38, 162, 46);
  ctx.beginPath();
  ctx.moveTo(164, 56);
  ctx.lineTo(326, 56);
  ctx.stroke();
  ctx.fillStyle = '#0f0f0e';
  ctx.fillRect(180, 66, 56, 6);
  ctx.beginPath();
  ctx.arc(308, 69, 4, 0, Math.PI * 2);
  ctx.fill();

  // Keyboard & Lisa Mouse below
  ctx.fillStyle = dotPat;
  ctx.fillRect(130, 224, 210, 32);
  ctx.strokeRect(130, 224, 210, 32);
  ctx.fillStyle = '#f5f4ed';
  ctx.fillRect(354, 232, 20, 24);
  ctx.strokeRect(354, 232, 20, 24);
  ctx.fillStyle = '#0f0f0e';
  ctx.fillRect(358, 235, 12, 6);

  // Callout labels (Text Tool)
  await selectTool('text');
  engine.setCursorKind('ibeam');
  const pLbl = canvasToViewport(378, 64);
  await engine.moveTo(pLbl.x, pLbl.y, 380, signal);
  engine.sounds.key();
  ctx.fillStyle = '#0f0f0e';
  ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
  ctx.fillText('← ProFile 5 MB', 336, 64);
  ctx.fillText('← 12" 720×364 CRT', 20, 148);
  ctx.fillText('Apple Lisa 1 (1983) · MC68000 · 1 MB RAM', 112, 282);

  // Show classic LisaDraw selection handles on ProFile
  await selectTool('arrow');
  engine.setCursorKind('arrow');
  drawHandles(164, 38, 162, 46);
  await engine.wait(1700, signal);

  await engine.setAsideWindow('lisadraw', signal);
  engine.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
}

/* =====================================================================
   3. LisaCalc → Clipboard → LisaGraph (Integrated 7/7 Multitasking!)
   ===================================================================== */
export async function lisaCalcAndGraph(engine, signal) {
  engine.onStatus('LisaCalc → LisaGraph — Integrated 7/7 Suite');
  engine.closeAllWindows();
  engine.setAppMenus('LisaCalc', ['File/Print', 'Edit', 'Format', 'Calculate']);

  await engine.selectDeskIcon('pad-calc', { doubleClick: true }, signal);
  engine.setCursorKind('hourglass');
  await engine.pulseProFile(4, 'ProFile 5 MB · Opening Q3 Plan', signal);
  engine.setCursorKind('arrow');

  const rows = [
    { item: 'Lisa 1 System', q1: 420, q2: 580, q3: 740 },
    { item: 'ProFile 5 MB', q1: 390, q2: 540, q3: 690 },
    { item: 'Lisa 7/7 Suite', q1: 410, q2: 560, q3: 720 },
    { item: 'Dot Matrix Prn', q1: 260, q2: 340, q3: 430 },
  ];

  const { w } = engine.getStageSize();
  const calcWin = engine.createWindow({
    id: 'lisacalc',
    title: 'Q3 Plan — LisaCalc',
    width: Math.min(440, Math.round(w * 0.46)),
    height: 290,
    x: 124,
    y: 26,
    bodyHtml: `
      <div class="lc-formula-bar">
        <span data-lc-ref>D2: 740</span>
        <span data-lc-formula>Formula: SUM(B2:D2)</span>
      </div>
      <div class="lc-grid" data-lc-grid></div>
    `,
  });

  const gridEl = calcWin.body.querySelector('[data-lc-grid]');
  const refEl = calcWin.body.querySelector('[data-lc-ref]');
  const formEl = calcWin.body.querySelector('[data-lc-formula]');

  const renderCalc = (activeKey = 'D2') => {
    let html = `
      <div class="lc-cell hdr"></div>
      <div class="lc-cell hdr">Product</div>
      <div class="lc-cell hdr">Q1</div>
      <div class="lc-cell hdr">Q2</div>
      <div class="lc-cell hdr">Q3</div>
      <div class="lc-cell hdr">Total</div>
    `;
    let sumQ1 = 0;
    let sumQ2 = 0;
    let sumQ3 = 0;
    rows.forEach((r, idx) => {
      const rn = idx + 1;
      const tot = r.q1 + r.q2 + r.q3;
      sumQ1 += r.q1;
      sumQ2 += r.q2;
      sumQ3 += r.q3;
      html += `
        <div class="lc-cell hdr">${rn}</div>
        <div class="lc-cell">${r.item}</div>
        <div class="lc-cell num ${activeKey === `B${rn}` ? 'active' : ''}">${r.q1}</div>
        <div class="lc-cell num ${activeKey === `C${rn}` ? 'active' : ''}">${r.q2}</div>
        <div class="lc-cell num ${activeKey === `D${rn}` ? 'active' : ''}">${r.q3}</div>
        <div class="lc-cell num ${activeKey === `E${rn}` ? 'active' : ''}">${tot}</div>
      `;
    });
    html += `
      <div class="lc-cell hdr">5</div>
      <div class="lc-cell" style="font-weight:700;">TOTAL UNITS</div>
      <div class="lc-cell num" style="font-weight:700;">${sumQ1}</div>
      <div class="lc-cell num" style="font-weight:700;">${sumQ2}</div>
      <div class="lc-cell num" style="font-weight:700;">${sumQ3}</div>
      <div class="lc-cell num ${activeKey === 'E5' ? 'active' : ''}" style="font-weight:700;">${sumQ1 + sumQ2 + sumQ3}</div>
    `;
    gridEl.innerHTML = html;
  };

  renderCalc('D1');
  await engine.wait(700, signal);

  // Update Q3 Lisa 1 units 740 -> 910 and watch totals recalculate!
  await engine.moveToEl(calcWin.body, 380, signal);
  engine.sounds.key();
  rows[0].q3 = 910;
  refEl.textContent = 'D1: 910';
  formEl.textContent = 'Recalculating E1..E5…';
  renderCalc('D1');
  await engine.wait(420, signal);
  renderCalc('E5');
  refEl.textContent = 'E5: 6,260';
  formEl.textContent = 'Formula: SUM(E1:E4)';
  await engine.wait(650, signal);

  // Copy table via Edit -> Copy to Clipboard!
  await engine.pickMenu(
    'edit',
    [
      { label: 'Undo Last Change' },
      { sep: true },
      { label: 'Cut' },
      { label: 'Copy' },
      { label: 'Paste' },
    ],
    'Copy',
    signal,
  );
  await engine.wait(300, signal);

  // Open LisaGraph side-by-side to show cooperative multitasking!
  engine.setAppMenus('LisaGraph', ['File/Print', 'Edit', 'Graph', 'Customize']);
  const graphWin = engine.createWindow({
    id: 'lisagraph',
    title: 'Q3 Chart — LisaGraph',
    width: Math.min(460, Math.round(w * 0.48)),
    height: 310,
    x: Math.max(180, w - 500),
    y: 96,
    bodyHtml: `
      <div class="lg-head">
        <span>Data: Pasted from LisaCalc</span>
        <div class="lg-tabs">
          <span class="lg-tab active" data-gmode="bar">Bar</span>
          <span class="lg-tab" data-gmode="line">Line</span>
          <span class="lg-tab" data-gmode="pie">Pie</span>
        </div>
      </div>
      <canvas class="lg-canvas" data-lg-canvas width="430" height="240"></canvas>
    `,
  });

  await engine.pickMenu(
    'edit',
    [
      { label: 'Undo' },
      { sep: true },
      { label: 'Copy' },
      { label: 'Paste' },
    ],
    'Paste',
    signal,
  );

  const gCanvas = graphWin.body.querySelector('[data-lg-canvas]');
  const gCtx = gCanvas.getContext('2d');

  const makeStripe = (dir = 0) => {
    const p = document.createElement('canvas');
    p.width = 6;
    p.height = 6;
    const g = p.getContext('2d');
    g.fillStyle = '#f5f4ed';
    g.fillRect(0, 0, 6, 6);
    g.strokeStyle = '#0f0f0e';
    g.lineWidth = 1.2;
    g.beginPath();
    if (dir === 0) {
      g.moveTo(0, 6); g.lineTo(6, 0);
    } else if (dir === 1) {
      g.moveTo(0, 0); g.lineTo(6, 6);
    } else {
      g.fillStyle = '#0f0f0e';
      g.fillRect(0, 0, 3, 3);
      g.fillRect(3, 3, 3, 3);
    }
    g.stroke();
    return gCtx.createPattern(p, 'repeat');
  };

  const pats = ['#0f0f0e', makeStripe(0), makeStripe(1), makeStripe(2)];

  const drawGraph = (mode) => {
    gCtx.fillStyle = '#f5f4ed';
    gCtx.fillRect(0, 0, 430, 240);
    gCtx.strokeStyle = '#0f0f0e';
    gCtx.fillStyle = '#0f0f0e';
    gCtx.font = 'bold 11px Helvetica, Arial, sans-serif';

    if (mode === 'bar') {
      gCtx.lineWidth = 1.5;
      gCtx.beginPath();
      gCtx.moveTo(46, 20);
      gCtx.lineTo(46, 198);
      gCtx.lineTo(408, 198);
      gCtx.stroke();

      const labels = ['Lisa 1', 'ProFile', '7/7 Suite', 'Printer'];
      const vals = rows.map((r) => r.q3);
      vals.forEach((v, idx) => {
        const bh = Math.round((v / 1000) * 160);
        const bx = 70 + idx * 84;
        gCtx.fillStyle = pats[idx % pats.length];
        gCtx.fillRect(bx, 198 - bh, 46, bh);
        gCtx.strokeRect(bx, 198 - bh, 46, bh);
        gCtx.fillStyle = '#0f0f0e';
        gCtx.fillText(labels[idx], bx + 2, 214);
        gCtx.fillText(String(v), bx + 11, 192 - bh);
      });
      gCtx.fillText('Q3 Shipments by Product (Units)', 124, 18);
    } else if (mode === 'line') {
      gCtx.lineWidth = 1.5;
      gCtx.beginPath();
      gCtx.moveTo(46, 24);
      gCtx.lineTo(46, 198);
      gCtx.lineTo(406, 198);
      gCtx.stroke();
      ['Q1', 'Q2', 'Q3'].forEach((q, qi) => {
        gCtx.fillText(q, 96 + qi * 124, 216);
      });
      rows.slice(0, 3).forEach((r, ri) => {
        const pts = [r.q1, r.q2, r.q3].map((v, qi) => [102 + qi * 124, 198 - Math.round((v / 1000) * 158)]);
        gCtx.lineWidth = ri === 0 ? 2.5 : 1.5;
        gCtx.beginPath();
        pts.forEach(([px, py], pi) => (pi === 0 ? gCtx.moveTo(px, py) : gCtx.lineTo(px, py)));
        gCtx.stroke();
        pts.forEach(([px, py]) => {
          gCtx.fillStyle = ri === 0 ? '#0f0f0e' : '#f5f4ed';
          gCtx.fillRect(px - 4, py - 4, 8, 8);
          gCtx.strokeRect(px - 4, py - 4, 8, 8);
        });
      });
      gCtx.fillStyle = '#0f0f0e';
      gCtx.fillText('Quarterly Growth Trend (Q1 → Q3)', 122, 18);
    } else {
      const cx = 148;
      const cy = 122;
      const r = 74;
      const totals = rows.map((row) => row.q1 + row.q2 + row.q3);
      const grand = totals.reduce((a, b) => a + b, 0);
      let ang = -Math.PI / 2;
      totals.forEach((val, idx) => {
        const slice = (val / grand) * Math.PI * 2;
        gCtx.beginPath();
        gCtx.moveTo(cx, cy);
        gCtx.arc(cx, cy, r, ang, ang + slice);
        gCtx.closePath();
        gCtx.fillStyle = pats[idx % pats.length];
        gCtx.fill();
        gCtx.lineWidth = 1.5;
        gCtx.stroke();
        ang += slice;
      });
      // Legend on right
      rows.forEach((row, idx) => {
        const ly = 64 + idx * 30;
        gCtx.fillStyle = pats[idx % pats.length];
        gCtx.fillRect(256, ly, 18, 14);
        gCtx.strokeRect(256, ly, 18, 14);
        gCtx.fillStyle = '#0f0f0e';
        const pct = Math.round((totals[idx] / grand) * 100);
        gCtx.fillText(`${row.item} (${pct}%)`, 282, ly + 11);
      });
      gCtx.fillText('Share of Total 1983 Shipments', 120, 22);
    }
  };

  for (const mode of ['bar', 'line', 'pie']) {
    const tab = graphWin.body.querySelector(`[data-gmode="${mode}"]`);
    if (mode !== 'bar') await engine.clickEl(tab, {}, signal);
    graphWin.body.querySelectorAll('.lg-tab').forEach((t) => t.classList.toggle('active', t === tab));
    drawGraph(mode);
    await engine.wait(1250, signal);
  }

  engine.closeWindow('lisagraph');
  engine.closeWindow('lisacalc');
  engine.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
}

/* =====================================================================
   4. LisaProject — PERT Critical Path Schedule Network
   ===================================================================== */
export async function lisaProjectPert(engine, signal) {
  engine.onStatus('LisaProject — PERT Critical Path Milestone Chart');
  engine.closeAllWindows();

  await engine.tearOffStationery('pad-project', 'Lisa 7/7 Release', signal);
  engine.setAppMenus('LisaProject', ['File/Print', 'Edit', 'Chart', 'Customize']);

  const dInfo = engine.getDateInfo();
  const win = engine.createWindow({
    id: 'lisaproject',
    title: 'Lisa 7/7 Release — LisaProject',
    width: 600,
    height: 368,
    bodyHtml: `
      <div class="lg-head">
        <span>Schedule Chart (PERT) · Critical Path Highlighted</span>
        <span>Updated: ${dInfo.shortDate}</span>
      </div>
      <canvas class="lg-canvas" data-lp-canvas width="560" height="296"></canvas>
    `,
  });

  const canvas = win.body.querySelector('[data-lp-canvas]');
  const ctx = canvas.getContext('2d');

  const drawPert = (includeBonus = false) => {
    ctx.fillStyle = '#f5f4ed';
    ctx.fillRect(0, 0, 560, 296);

    const nodes = [
      { id: 'hw', x: 24, y: 112, w: 112, h: 64, title: '68000 Rev C', meta: '14d · Eng', crit: true },
      { id: 'os', x: 176, y: 46, w: 120, h: 64, title: 'Lisa OS 3.1', meta: '21d · Sys', crit: true },
      { id: 'doc', x: 176, y: 176, w: 120, h: 64, title: 'LisaGuide', meta: '10d · Pub', crit: false },
      { id: 'qa', x: 336, y: 112, w: 112, h: 64, title: '7/7 Suite QA', meta: '12d · QA', crit: true },
      { id: 'ship', x: 472, y: 120, w: 72, h: 48, title: 'SHIP', meta: dInfo.shortDate, crit: true, milestone: true },
    ];

    if (includeBonus) {
      nodes.push({ id: 'pf', x: 336, y: 204, w: 112, h: 56, title: 'ProFile 10MB', meta: '8d · Disk', crit: false });
    }

    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const edges = [
      ['hw', 'os', true],
      ['hw', 'doc', false],
      ['os', 'qa', true],
      ['doc', 'qa', false],
      ['qa', 'ship', true],
    ];
    if (includeBonus) {
      edges.push(['doc', 'pf', false], ['pf', 'ship', false]);
    }

    // Draw edges
    for (const [aId, bId, crit] of edges) {
      const a = byId[aId];
      const b = byId[bId];
      const x1 = a.x + a.w;
      const y1 = a.y + a.h / 2;
      const x2 = b.x;
      const y2 = b.y + b.h / 2;
      ctx.strokeStyle = '#0f0f0e';
      ctx.lineWidth = crit ? 2.6 : 1.2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo((x1 + x2) / 2, y1);
      ctx.lineTo((x1 + x2) / 2, y2);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Arrowhead
      ctx.fillStyle = '#0f0f0e';
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 7, y2 - 4);
      ctx.lineTo(x2 - 7, y2 + 4);
      ctx.closePath();
      ctx.fill();
    }

    // Draw task boxes & rounded milestones
    for (const n of nodes) {
      ctx.fillStyle = '#f5f4ed';
      ctx.strokeStyle = '#0f0f0e';
      ctx.lineWidth = n.crit ? 2.5 : 1.4;

      if (n.milestone) {
        ctx.beginPath();
        ctx.roundRect(n.x, n.y, n.w, n.h, 12);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(n.x, n.y, n.w, n.h);
        ctx.strokeRect(n.x, n.y, n.w, n.h);
        if (n.crit) {
          ctx.lineWidth = 1;
          ctx.strokeRect(n.x + 3, n.y + 3, n.w - 6, n.h - 6);
        }
      }

      ctx.fillStyle = '#0f0f0e';
      ctx.font = 'bold 11.5px Helvetica, Arial, sans-serif';
      ctx.fillText(n.title, n.x + 10, n.y + 24);
      ctx.font = '11px Helvetica, Arial, sans-serif';
      ctx.fillText(n.meta, n.x + 10, n.y + 44);
    }

    ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
    ctx.fillText('Double border = Critical Path (47 working days)', 18, 282);
  };

  drawPert(false);
  await engine.wait(1100, signal);

  // Use Chart menu -> Add Task & Recalculate!
  await engine.pickMenu(
    'chart',
    [
      { label: 'Schedule Chart (PERT)' },
      { label: 'Task Timeline (Gantt)' },
      { sep: true },
      { label: 'Add Task Box…' },
      { label: 'Highlight Critical Path' },
    ],
    'Add Task Box',
    signal,
  );

  engine.sounds.key();
  drawPert(true);
  await engine.wait(1800, signal);

  await engine.setAsideWindow('lisaproject', signal);
  engine.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
}

/* =====================================================================
   5. ProFile 5 MB Desktop Manager & Wastebasket Cleanup
   ===================================================================== */
export async function lisaProfileAndWastebasket(engine, signal) {
  engine.onStatus('Desktop Manager — ProFile 5 MB & Wastebasket');
  engine.closeAllWindows();

  await engine.selectDeskIcon('profile', { doubleClick: true }, signal);
  engine.setCursorKind('hourglass');
  await engine.pulseProFile(4, 'ProFile 5 MB · Reading Catalog', signal);
  engine.setCursorKind('arrow');

  const dInfo = engine.getDateInfo();
  const win = engine.createWindow({
    id: 'profile-win',
    title: 'ProFile (5 MB Hard Disk)',
    width: 500,
    height: 290,
    x: 136,
    y: 44,
    bodyHtml: `
      <div class="lf-info">
        <span>6 Documents · 1,840K in use</span>
        <span>3,072K available</span>
      </div>
      <div class="lf-rows" data-lf-rows>
        <div class="lf-row hdr"><span>Name</span><span>Kind</span><span>Size</span><span>Modified</span></div>
        <div class="lf-row" data-file="memo"><span>Cupertino Memo</span><span>LisaWrite</span><span>14K</span><span>${dInfo.shortDate}</span></div>
        <div class="lf-row" data-file="arch"><span>Lisa Architecture</span><span>LisaDraw</span><span>28K</span><span>${dInfo.shortDate}</span></div>
        <div class="lf-row" data-file="plan"><span>Q3 Plan</span><span>LisaCalc</span><span>19K</span><span>${dInfo.shortDate}</span></div>
        <div class="lf-row" data-file="pert"><span>Lisa 7/7 Release</span><span>LisaProject</span><span>22K</span><span>${dInfo.shortDate}</span></div>
        <div class="lf-row" data-file="scratch"><span>Scratch_Draft.lw</span><span>LisaWrite</span><span>6K</span><span>Yesterday</span></div>
      </div>
    `,
  });

  await engine.wait(700, signal);
  const scratchRow = win.body.querySelector('[data-file="scratch"]');
  const wasteEl = engine.root.querySelector('[data-desk="wastebasket"]');
  scratchRow.classList.add('selected');

  await engine.dragElTo(scratchRow, wasteEl, 'Scratch_Draft.lw', signal);
  scratchRow.remove();
  engine.setWastebasketFull(true);
  engine.sounds.crumple();
  await engine.wait(650, signal);

  // Empty Wastebasket via Housekeeping menu!
  await engine.pickMenu(
    'housekeeping',
    [
      { label: 'View Alphabetically' },
      { label: 'View Pictorially' },
      { sep: true },
      { label: 'Empty Wastebasket' },
      { label: 'Repair ProFile Disk…' },
    ],
    'Empty Wastebasket',
    signal,
  );
  engine.sounds.crumple();
  engine.setWastebasketFull(false);
  await engine.wait(700, signal);

  await engine.setAsideWindow('profile-win', signal);
}

/* =====================================================================
   6. Lisa Calculator (with Paper Tape!) & Preferences Contrast Check
   ===================================================================== */
export async function lisaCalculatorAndPrefs(engine, signal) {
  engine.onStatus('Lisa Accessories — Calculator & Screen Preferences');
  engine.closeAllWindows();

  await engine.selectDeskIcon('calculator', { doubleClick: true }, signal);
  engine.setAppMenus('Calculator', ['File/Print', 'Edit', 'Tape']);

  const calcWin = engine.createWindow({
    id: 'lisa-calc-da',
    title: 'Calculator',
    width: 344,
    height: 256,
    x: 150,
    y: 66,
    scrollbars: false,
    bodyHtml: `
      <div class="lcalc-wrap">
        <div class="lcalc-pad">
          <div class="lcalc-lcd" data-lcd>0</div>
          <div class="lcalc-keys">
            ${['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '00', '=']
              .map((k) => `<div class="lcalc-key" data-ckey="${k}">${k}</div>`)
              .join('')}
          </div>
        </div>
        <div class="lcalc-tape" data-tape>PAPER TAPE\n----------\n</div>
      </div>
    `,
  });

  const lcd = calcWin.body.querySelector('[data-lcd]');
  const tape = calcWin.body.querySelector('[data-tape]');

  // Iconic 1983 Lisa $9,995 vs 1984 Macintosh $2,495 math!
  const seq = [
    ['9', '9'], ['9', '99'], ['9', '999'], ['5', '9995'],
    ['-', '9995'],
    ['2', '2'], ['4', '24'], ['9', '249'], ['5', '2495'],
    ['=', '7500'],
  ];

  for (const [k, disp] of seq) {
    const keyEl = calcWin.body.querySelector(`[data-ckey="${k}"]`);
    await engine.clickEl(keyEl, {}, signal);
    lcd.textContent = disp;
    if (k === '-') tape.textContent += '  9995.00\n- ';
    else if (k === '=') tape.textContent += '2495.00\n----------\n= 7500.00\n';
    await engine.wait(110, signal);
  }
  await engine.wait(700, signal);

  // Open Preferences alongside Calculator to adjust CRT Contrast
  await engine.selectDeskIcon('preferences', { doubleClick: true }, signal);
  engine.setAppMenus('Preferences', ['File/Print', 'Edit', 'Defaults']);

  const prefWin = engine.createWindow({
    id: 'lisa-prefs',
    title: 'Preferences',
    width: 360,
    height: 224,
    x: 420,
    y: 120,
    scrollbars: false,
    bodyHtml: `
      <div style="padding:14px 16px;display:flex;flex-direction:column;gap:12px;font-size:12px;">
        <div><strong>Screen Contrast &amp; Dimming</strong></div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span>Dim</span>
          <div style="flex:1;height:12px;border:1.5px solid #0f0f0e;position:relative;background:#f5f4ed;">
            <div data-slider-knob style="position:absolute;top:-2px;left:76%;width:12px;height:14px;background:#0f0f0e;"></div>
          </div>
          <span>Bright</span>
        </div>
        <div><strong>Startup Device:</strong> <span class="lisa-btn default" style="margin-left:6px;">ProFile 5 MB</span></div>
        <div style="font-size:11px;">Double-click speed: Normal · Speaker volume: Medium</div>
      </div>
    `,
  });

  const knob = prefWin.body.querySelector('[data-slider-knob]');
  await engine.moveToEl(knob, 420, signal);
  engine.sounds.click();
  knob.style.left = '38%';
  engine.setContrast(0.84);
  await engine.wait(700, signal);
  knob.style.left = '82%';
  engine.setContrast(1.03);
  await engine.wait(650, signal);
  knob.style.left = '76%';
  engine.setContrast(1);
  await engine.wait(550, signal);

  engine.closeWindow('lisa-prefs');
  engine.closeWindow('lisa-calc-da');
  engine.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
}

/* =====================================================================
   7. LisaTerminal — 1200 Baud VT100 Mainframe Session
   ===================================================================== */
export async function lisaTerminalSession(engine, signal) {
  engine.onStatus('LisaTerminal — 1200 Baud VT100 Engineering Session');
  engine.closeAllWindows();

  await engine.selectDeskIcon('terminal', { doubleClick: true }, signal);
  engine.setAppMenus('LisaTerminal', ['File/Print', 'Edit', 'Setup', 'Phone']);

  const dInfo = engine.getDateInfo();
  const win = engine.createWindow({
    id: 'lisaterm',
    title: 'Cupertino VAX — LisaTerminal (1200 8N1)',
    width: 530,
    height: 320,
    bodyHtml: `<div class="lterm-body" data-lterm></div>`,
  });

  const term = win.body.querySelector('[data-lterm]');
  term.textContent = 'ATDT 408-555-0183\n';
  engine.sounds.modemChirp();
  await engine.wait(520, signal);
  term.textContent += 'CONNECT 1200\n\n4.2 BSD UNIX (apple-vax.cupertino)\n\nlogin: ';
  await engine.typeText(term, 'lisa-dev\n', { charMs: 55 }, signal);
  await engine.wait(320, signal);
  term.textContent += `Last login: ${dInfo.weekday} ${dInfo.shortDate} on tty04\n% `;
  await engine.wait(400, signal);

  await engine.typeText(term, 'uname -a\n', { charMs: 52 }, signal);
  term.textContent += 'UNIX 4.2BSD apple-vax VAX-11/780\n% ';
  await engine.wait(420, signal);

  await engine.typeText(term, 'cat /usr/lisa/release.txt\n', { charMs: 46 }, signal);
  const lines = [
    'LISA OFFICE SYSTEM 7/7 — BUILD LOG',
    '  QuickDraw / LisaGraf : OK',
    '  Stationery Manager   : OK',
    '  ProFile 5MB Driver   : OK',
    '  Cooperative Switcher : OK',
    '% ',
  ];
  for (const l of lines) {
    term.textContent += l + '\n';
    await engine.wait(110, signal);
  }
  await engine.wait(700, signal);

  await engine.typeText(term, 'logout\n', { charMs: 55 }, signal);
  term.textContent += 'NO CARRIER';
  await engine.wait(700, signal);

  await engine.setAsideWindow('lisaterm', signal);
  engine.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
}

/* =====================================================================
   8. LisaGuide — Interactive 1983 Mouse & Desktop Tutorial
   ===================================================================== */
export async function lisaGuideTutorial(engine, signal) {
  engine.onStatus('LisaGuide — Interactive 1983 Mouse Tutorial');
  engine.closeAllWindows();

  await engine.selectDeskIcon('lisaguide', { doubleClick: true }, signal);
  engine.setAppMenus('LisaGuide', ['File/Print', 'Topics', 'Help']);

  const win = engine.createWindow({
    id: 'lisaguide',
    title: 'LisaGuide — Learning to Use Lisa',
    width: 500,
    height: 300,
    scrollbars: false,
    bodyHtml: `
      <div style="padding:18px 22px;display:flex;flex-direction:column;justify-content:space-between;height:100%;">
        <div data-guide-body>
          <div style="font-size:15px;font-weight:800;margin-bottom:8px;">Lesson 1: Pointing &amp; Clicking the Mouse</div>
          <p style="margin:0 0 10px;line-height:1.5;">
            Welcome to Apple Lisa. Slide the mouse across your desk to move the arrow pointer.
            Point to any stationery pad, then choose <strong>Tear Off Stationery</strong> to begin a new document.
          </p>
          <div style="border:1.5px solid #0f0f0e;padding:12px;display:flex;align-items:center;gap:14px;">
            <div style="width:36px;height:36px;">${LISA_ICONS.lisaGuide}</div>
            <div>Click the button below to advance to Lesson 2: <em>Windows &amp; Split Scrollbars</em>.</div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <span class="lisa-btn" data-g-prev>Previous</span>
          <span class="lisa-btn default" data-g-next>Continue</span>
        </div>
      </div>
    `,
  });

  await engine.wait(1100, signal);
  await engine.clickEl(win.body.querySelector('[data-g-next]'), {}, signal);

  win.body.querySelector('[data-guide-body]').innerHTML = `
    <div style="font-size:15px;font-weight:800;margin-bottom:8px;">Lesson 2: Windows, Folders &amp; The Wastebasket</div>
    <p style="margin:0 0 10px;line-height:1.5;">
      Every document lives in its own window with split-pane scrollbars.
      Double-click the miniature document icon in the upper-left corner of a title bar to <strong>Set Aside</strong> your work neatly back onto the desktop.
    </p>
    <div style="border:1.5px solid #0f0f0e;padding:12px;display:flex;align-items:center;gap:14px;">
      <div style="width:34px;height:34px;">${LISA_ICONS.wastebasketEmpty}</div>
      <div>Drag unwanted sheets to the <strong>Wastebasket</strong>, or pull them back out before emptying.</div>
    </div>
  `;

  await engine.wait(1500, signal);
  await engine.setAsideWindow('lisaguide', signal);
  engine.setAppMenus('Desktop Manager', ['File/Print', 'Edit', 'Housekeeping', 'Disk']);
}

export const REGULAR_VIGNETTES = [
  { id: 'lisa-write', run: lisaWriteMemo },
  { id: 'lisa-draw', run: lisaDrawWorkstation },
  { id: 'lisa-calc-graph', run: lisaCalcAndGraph },
  { id: 'lisa-project', run: lisaProjectPert },
  { id: 'lisa-desktop', run: lisaProfileAndWastebasket },
  { id: 'lisa-accessories', run: lisaCalculatorAndPrefs },
  { id: 'lisa-terminal', run: lisaTerminalSession },
  { id: 'lisa-guide', run: lisaGuideTutorial },
];

export const SPECIAL_VIGNETTES = {
  'lisa-boot': lisaBootSequence,
  'lisa-draw': lisaDrawWorkstation,
  'lisa-project': lisaProjectPert,
  'lisa-graph': lisaCalcAndGraph,
  'lisa-guide': lisaGuideTutorial,
};
