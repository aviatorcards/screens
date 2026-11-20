import { LORES_COLORS, HIRES_COLORS } from './engine.js';

/* =====================================================================
   1. Cold Boot, Disk II Recalibrate & DOS 3.3 CATALOG
   ===================================================================== */
export async function apple2ColdBootAndCatalog(engine, signal) {
  engine.onStatus('Apple //e — Cold Boot & DOS 3.3 CATALOG');
  await engine.coldBootBanner(signal);

  await engine.typeCommand('CATALOG', {}, signal);
  await engine.diskSeek(8, 'DISK II · S6,D1 · CATALOG', signal, false);

  const catalog = [
    '',
    'DISK VOLUME 254',
    '',
    ' A 004 HELLO',
    ' B 034 VISICALC',
    ' A 008 LORES.KALEIDO',
    ' A 014 HIRES.SPIRO',
    ' B 062 OREGON.TRAIL',
    ' S 048 APPLEWORKS.SYS',
    ' B 051 PRINT.SHOP',
    ' A 009 BACH.1BIT',
    ' B 012 MONITOR.HEX',
    '',
  ];
  for (const line of catalog) {
    engine.print(line);
    await engine.wait(75, signal);
  }
  await engine.wait(550, signal);

  // Authentic Applesoft typo & quick memory check
  await engine.typeCommand('PRNT "APPLE //E"', {}, signal);
  engine.sounds.beep(1000, 0.08, 0.036);
  engine.print('?SYNTAX ERROR');
  await engine.wait(420, signal);

  await engine.typeCommand('PRINT FRE(0)+65536;" BYTES FREE"', {}, signal);
  engine.print('48128 BYTES FREE');
  await engine.wait(850, signal);
}

/* =====================================================================
   2. Applesoft BASIC Lo-Res (GR) 16-Color Kaleidoscope
   ===================================================================== */
export async function apple2LoResKaleido(engine, signal) {
  engine.onStatus('Applesoft BASIC — Lo-Res (GR) 40×48 Kaleidoscope');
  engine.showTextMode();
  engine.setColumns(40);
  engine.setPhosphor('green');
  engine.clearText();
  engine.print('DOS 3.3 · APPLESOFT BASIC');
  engine.print('');
  await engine.wait(280, signal);

  await engine.typeCommand('NEW', {}, signal);
  await engine.typeCommand('10 GR : HOME', { delay: 44 }, signal);
  await engine.typeCommand('20 C=INT(RND(1)*15)+1 : COLOR=C', { delay: 40 }, signal);
  await engine.typeCommand('30 X=INT(RND(1)*20) : Y=INT(RND(1)*20)', { delay: 38 }, signal);
  await engine.typeCommand('40 PLOT X,Y : PLOT 39-X,Y : GOTO 20', { delay: 38 }, signal);
  await engine.typeCommand('RUN', { delay: 62 }, signal);
  await engine.wait(220, signal);

  // Switch to Composite Color for vibrant 16-color Lo-Res graphics
  engine.setPhosphor('color');
  engine.showGfxMode({ split: true, width: 280, height: 160 });
  const ctx = engine.gfxCtx;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 280, 160);

  const cellW = 7; // 40 * 7 = 280
  const cellH = 4; // 40 * 4 = 160 (classic GR mixed mode leaves 4 lines of text)

  const plot = (x, y, colorIdx) => {
    if (x < 0 || x >= 40 || y < 0 || y >= 40) return;
    ctx.fillStyle = LORES_COLORS[colorIdx % 16];
    ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
  };

  try {
    for (let step = 0; step < 150; step++) {
      const c = 1 + ((step + Math.floor(Math.sin(step * 0.17) * 5 + 15)) % 15);
      const cx = Math.floor(Math.abs(Math.sin(step * 0.23) * 19));
      const cy = Math.floor(Math.abs(Math.cos(step * 0.19) * 19));

      // 8-way kaleidoscope symmetry
      const pts = [
        [cx, cy],
        [39 - cx, cy],
        [cx, 39 - cy],
        [39 - cx, 39 - cy],
        [cy, cx],
        [39 - cy, cx],
        [cy, 39 - cx],
        [39 - cy, 39 - cx],
      ];
      for (const [px, py] of pts) {
        plot(px, py, c);
      }
      if (step % 6 === 0) {
        engine.setSplitLines([
          'APPLESOFT LO-RES KALEIDOSCOPE (GR)',
          `COLOR=${String(c).padStart(2, ' ')}   X=${String(cx).padStart(2, ' ')}   Y=${String(cy).padStart(2, ' ')}`,
          `PLOT ${cx},${cy} : PLOT ${39 - cx},${39 - cy}`,
          'PRESS CTRL-C TO BREAK',
        ]);
      }
      if (step % 14 === 0) {
        engine.sounds.speakerNote(240 + c * 42, 0.045, 0.014);
      }
      await engine.wait(48, signal);
    }
    await engine.wait(900, signal);
  } finally {
    engine.showTextMode();
  }

  engine.setPhosphor('green');
  engine.print('');
  engine.print('BREAK IN 40');
  await engine.wait(600, signal);
}

/* =====================================================================
   3. Hi-Res (HGR) Vector Spirograph & Six-Color Apple Logo
   ===================================================================== */
export async function apple2HiResVector(engine, signal) {
  engine.onStatus('Apple //e — Hi-Res (HGR 280×192) Vector Demo');
  engine.showTextMode();
  engine.setColumns(40);
  engine.setPhosphor('green');
  engine.clearText();
  engine.print(']LOAD HIRES.SPIRO');
  await engine.diskSeek(6, 'DISK II · S6,D1 · HIRES.SPIRO', signal, false);
  await engine.typeCommand('RUN', {}, signal);
  await engine.wait(180, signal);

  engine.setPhosphor('color');
  engine.showGfxMode({ split: true, width: 280, height: 160 });
  const ctx = engine.gfxCtx;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 280, 160);

  const palette = [
    HIRES_COLORS.green,
    HIRES_COLORS.violet,
    HIRES_COLORS.orange,
    HIRES_COLORS.blue,
    HIRES_COLORS.white,
  ];

  // Subtle classic Apple II Hi-Res frame border
  ctx.strokeStyle = HIRES_COLORS.blue;
  ctx.lineWidth = 1;
  ctx.strokeRect(2.5, 2.5, 275, 155);

  try {
    // Part A: Draw a glowing 280x160 vector Lissajous / Rose sculpture on left half
    const cx = 92;
    const cy = 80;
    let prevX = null;
    let prevY = null;
    for (let i = 0; i <= 220; i++) {
      const a = (i / 220) * Math.PI * 4;
      const r = 58 * Math.cos(2.5 * a);
      const x = Math.round(cx + r * Math.cos(a));
      const y = Math.round(cy + r * Math.sin(a) * 0.92);
      const colIdx = Math.floor(i / 44) % palette.length;

      if (prevX !== null) {
        ctx.strokeStyle = palette[colIdx];
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      prevX = x;
      prevY = y;

      if (i % 10 === 0) {
        engine.setSplitLines([
          'HGR : HCOLOR=3 : REM 280X160 HI-RES',
          `HPLOT ${String(x).padStart(3, ' ')},${String(y).padStart(3, ' ')}   ANGLE=${String(Math.round((a * 180) / Math.PI)).padStart(3, ' ')} DEG`,
          'APPLE II NTSC ARTIFACT COLOR MODE',
          'RENDERING ROSE CURVE + RAINBOW MARK…',
        ]);
        await engine.wait(28, signal);
      }
    }

    // Part B: Paint the iconic 6-stripe rainbow Apple mark on right side, stripe by stripe
    const stripes = [
      { y0: 42, y1: 56, color: '#61bb46', name: 'GREEN' },
      { y0: 56, y1: 68, color: '#fdb827', name: 'YELLOW' },
      { y0: 68, y1: 80, color: '#f5821f', name: 'ORANGE' },
      { y0: 80, y1: 92, color: '#e03a3e', name: 'RED' },
      { y0: 92, y1: 104, color: '#963d97', name: 'VIOLET' },
      { y0: 104, y1: 118, color: '#009ddc', name: 'BLUE' },
    ];

    const appleCx = 212;
    const isInsideApple = (px, py) => {
      // Leaf
      const lx = (px - (appleCx + 6)) / 9;
      const ly = (py - 33) / 6;
      if (lx * lx + ly * ly <= 1 && px > appleCx - 2) return 'leaf';
      // Dual lobes of classic Apple silhouette
      const leftLobe = Math.pow((px - (appleCx - 11)) / 24, 2) + Math.pow((py - 80) / 36, 2) <= 1;
      const rightLobe = Math.pow((px - (appleCx + 11)) / 24, 2) + Math.pow((py - 80) / 36, 2) <= 1;
      // Classic bite on the right
      const bite = Math.pow((px - (appleCx + 36)) / 14, 2) + Math.pow((py - 76) / 14, 2) <= 1;
      // Top dimple
      const topDimple = Math.pow((px - appleCx) / 8, 2) + Math.pow((py - 41) / 6, 2) <= 1;
      // Bottom dimple
      const botDimple = Math.pow((px - appleCx) / 7, 2) + Math.pow((py - 119) / 6, 2) <= 1;
      if ((leftLobe || rightLobe) && !bite && !topDimple && !botDimple) return 'body';
      return null;
    };

    // Paint leaf first
    ctx.fillStyle = '#61bb46';
    for (let py = 26; py <= 42; py += 2) {
      for (let px = appleCx - 4; px <= appleCx + 20; px += 2) {
        if (isInsideApple(px, py) === 'leaf') ctx.fillRect(px, py, 2, 2);
      }
    }
    engine.sounds.speakerNote(523.25, 0.07, 0.02);
    await engine.wait(160, signal);

    for (let s = 0; s < stripes.length; s++) {
      const st = stripes[s];
      ctx.fillStyle = st.color;
      for (let py = st.y0; py < st.y1; py += 2) {
        for (let px = appleCx - 38; px <= appleCx + 38; px += 2) {
          if (isInsideApple(px, py) === 'body') {
            ctx.fillRect(px, py, 2, 2);
          }
        }
        await engine.wait(22, signal);
      }
      engine.sounds.speakerNote(330 + s * 65, 0.075, 0.02);
      engine.setSplitLines([
        'HGR : REM SIX-COLOR APPLE II DEMO',
        `PAINTING STRIPE ${s + 1}/6 · ${st.name}`,
        'APPLE COMPUTER INC. — CUPERTINO, CA',
        'READY.',
      ]);
      await engine.wait(140, signal);
    }

    // Crisp text label under the apple
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('APPLE ][', appleCx - 28, 138);
    await engine.wait(2000, signal);
  } finally {
    engine.showTextMode();
  }
  engine.setPhosphor('green');
}

/* =====================================================================
   4. VisiCalc (1979) — Personal Software's Killer Spreadsheet
   ===================================================================== */
export async function apple2VisiCalc(engine, signal) {
  engine.onStatus('VisiCalc (1979) — Recalculating Hardware Budget');
  engine.setPhosphor('green');
  engine.showTextMode();
  engine.setColumns(40);
  engine.clearText();
  await engine.typeCommand('BRUN VISICALC', {}, signal);
  await engine.diskSeek(8, 'DISK II · S6,D1 · VISICALC', signal, false);

  const cols = ['A', 'B', 'C', 'D', 'E'];
  const rows = 13;
  const data = {
    A1: 'ITEM',
    B1: 'QTY',
    C1: 'PRICE',
    D1: 'TOTAL',
    E1: 'NOTES',
    A2: '---------',
    B2: '----',
    C2: '------',
    D2: '-------',
    E2: '--------',
    A3: 'APPLE //E',
    B3: '1',
    C3: '1395',
    D3: '1395',
    E3: '64K RAM',
    A4: 'DISK II',
    B4: '2',
    C4: '545',
    D4: '1090',
    E4: 'S6 D1+D2',
    A5: 'MONITOR II',
    B5: '1',
    C5: '229',
    D5: '229',
    E5: 'GREEN P31',
    A6: '80-COL CD',
    B6: '1',
    C6: '125',
    D6: '125',
    E6: 'EXT 64K',
    A8: 'SUBTOTAL',
    D8: '',
    A9: 'TAX 6.5%',
    D9: '',
    A10: 'GRAND TOT',
    D10: '',
  };

  let activeCell = 'A1';
  let statusExpr = 'A1 (L) ITEM';
  let entryLine = 'VISICALC 1.37 · PERSONAL SOFTWARE INC.';

  const renderSheet = () => {
    let gridHtml = `<div class="vc-cell hdr"></div>`;
    for (const c of cols) gridHtml += `<div class="vc-cell hdr">${c}</div>`;
    for (let r = 1; r <= rows; r++) {
      gridHtml += `<div class="vc-cell rownum">${r}</div>`;
      for (const c of cols) {
        const key = `${c}${r}`;
        const val = data[key] || '';
        const isNum = c === 'B' || c === 'C' || c === 'D';
        const cls = ['vc-cell', isNum ? 'num' : '', activeCell === key ? 'active' : ''].filter(Boolean).join(' ');
        gridHtml += `<div class="${cls}">${val}</div>`;
      }
    }

    engine.showAppMode(`
      <div class="vc-wrap">
        <div class="vc-top">
          <div class="vc-status-row">
            <span class="a2-inv">${statusExpr}</span>
            <span>C  24K FREE</span>
          </div>
          <div class="vc-entry-row">${entryLine}<span class="a2-cursor"></span></div>
        </div>
        <div class="vc-grid">${gridHtml}</div>
      </div>
    `);
  };

  renderSheet();
  await engine.wait(900, signal);

  // Move to D8 and enter @SUM(D3...D6)
  const path1 = ['B3', 'C3', 'D3', 'D5', 'D7', 'D8'];
  for (const cell of path1) {
    activeCell = cell;
    statusExpr = `${cell} ${data[cell] ? '(V) ' + data[cell] : ''}`;
    entryLine = 'VALUE OR LABEL';
    engine.sounds.keyClick();
    renderSheet();
    await engine.wait(220, signal);
  }

  const formula = '@SUM(D3...D6)';
  let typed = '';
  for (const ch of formula) {
    typed += ch;
    entryLine = `VALUE: ${typed}`;
    engine.sounds.keyClick();
    renderSheet();
    await engine.wait(80, signal);
  }
  await engine.wait(320, signal);
  data.D8 = '2839';
  statusExpr = 'D8 (V) @SUM(D3...D6)';
  entryLine = 'RECALCULATING...';
  engine.sounds.beep(1150, 0.05, 0.025);
  renderSheet();
  await engine.wait(520, signal);

  // Fill D9 tax & D10 grand total
  activeCell = 'D9';
  statusExpr = 'D9 (V) +D8*0.065';
  entryLine = 'VALUE: +D8*0.065';
  renderSheet();
  await engine.wait(480, signal);
  data.D9 = '184.54';
  engine.sounds.keyClick();
  renderSheet();
  await engine.wait(420, signal);

  activeCell = 'D10';
  statusExpr = 'D10 (V) +D8+D9';
  entryLine = 'VALUE: +D8+D9';
  renderSheet();
  await engine.wait(480, signal);
  data.D10 = '3023.54';
  engine.sounds.beep(1000, 0.06, 0.03);
  renderSheet();
  await engine.wait(900, signal);

  // Live "What-If" magic! Change Disk II QTY in B4 from 2 -> 1 and watch cascade recalc!
  activeCell = 'B4';
  statusExpr = 'B4 (V) 2';
  entryLine = 'WHAT-IF: CHANGE DISK II QTY -> 1';
  renderSheet();
  await engine.wait(700, signal);

  data.B4 = '1';
  engine.sounds.keyClick();
  renderSheet();
  await engine.wait(320, signal);

  data.D4 = '545';
  renderSheet();
  await engine.wait(240, signal);
  data.D8 = '2294';
  renderSheet();
  await engine.wait(240, signal);
  data.D9 = '149.11';
  renderSheet();
  await engine.wait(240, signal);
  data.D10 = '2443.11';
  activeCell = 'D10';
  statusExpr = 'D10 (V) +D8+D9 = 2443.11';
  entryLine = 'COMMAND: /B C D E F G I M P R S T V W -';
  engine.sounds.beep(1000, 0.08, 0.035);
  renderSheet();
  await engine.wait(1700, signal);

  engine.showTextMode();
}

/* =====================================================================
   5. The Oregon Trail (MECC, 1985)
   ===================================================================== */
export async function apple2OregonTrail(engine, signal) {
  engine.onStatus('The Oregon Trail (MECC) — Rolling Westward');
  engine.setPhosphor('green');
  engine.showTextMode();
  engine.setColumns(40);
  engine.clearText();
  await engine.typeCommand('BRUN OREGON.TRAIL', {}, signal);
  await engine.diskSeek(9, 'DISK II · S6,D1 · OREGON.TRAIL', signal, false);

  const dInfo = engine.getDateInfo();
  const root = engine.showAppMode(`
    <div class="ot-wrap">
      <div class="ot-scene">
        <canvas class="ot-canvas" data-ot-canvas width="280" height="128"></canvas>
        <div class="ot-banner" data-ot-banner style="display:none;"></div>
      </div>
      <div class="ot-stats">
        <div class="ot-stat-row"><span>DATE:</span><span data-ot-date>${dInfo.shortDate.toUpperCase()}, 1848</span></div>
        <div class="ot-stat-row"><span>WEATHER:</span><span data-ot-weather>FAIR</span></div>
        <div class="ot-stat-row"><span>HEALTH:</span><span data-ot-health>GOOD</span></div>
        <div class="ot-stat-row"><span>FOOD:</span><span data-ot-food>482 POUNDS</span></div>
        <div class="ot-stat-row"><span>NEXT LANDMARK:</span><span data-ot-next>68 MILES</span></div>
        <div class="ot-stat-row"><span>MILES TRAVELED:</span><span data-ot-miles>812 MILES</span></div>
      </div>
      <div class="ot-prompt" data-ot-prompt>PRESS SPACE BAR TO SIZE UP THE SITUATION</div>
    </div>
  `);

  const canvas = root.querySelector('[data-ot-canvas]');
  const ctx = canvas.getContext('2d');
  const banner = root.querySelector('[data-ot-banner]');
  const elWeather = root.querySelector('[data-ot-weather]');
  const elHealth = root.querySelector('[data-ot-health]');
  const elFood = root.querySelector('[data-ot-food]');
  const elNext = root.querySelector('[data-ot-next]');
  const elMiles = root.querySelector('[data-ot-miles]');
  const elPrompt = root.querySelector('[data-ot-prompt]');

  const green = '#46ff78';
  const dim = '#1d8a3c';

  const drawFrame = (step, landmarkDist) => {
    ctx.fillStyle = '#040d06';
    ctx.fillRect(0, 0, 280, 128);

    // Stars & crescent moon
    ctx.fillStyle = dim;
    for (let s = 0; s < 14; s++) {
      const sx = (s * 43 + 17) % 270;
      const sy = 8 + ((s * 19) % 28);
      ctx.fillRect(sx, sy, 2, 2);
    }

    // Distant Rockies / Chimney Rock silhouette scrolling right -> left
    const shift = (step * 1.4) % 280;
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 72);
    for (let x = 0; x <= 280; x += 14) {
      const wx = x + shift;
      const peak =
        Math.sin(wx * 0.04) * 14 +
        Math.cos(wx * 0.09) * 8 +
        (Math.abs(((wx % 280) - 180)) < 14 ? -18 : 0);
      ctx.lineTo(x, 66 + peak * 0.6);
    }
    ctx.stroke();

    // Horizon line & prairie scrub
    ctx.strokeStyle = green;
    ctx.beginPath();
    ctx.moveTo(0, 104);
    ctx.lineTo(280, 104);
    ctx.stroke();

    for (let b = 0; b < 9; b++) {
      const bx = (280 - ((step * 4 + b * 36) % 300));
      ctx.fillStyle = dim;
      ctx.fillRect(bx, 108 + (b % 3) * 4, 8, 2);
    }

    // Distant Independence Rock approaching from left
    if (landmarkDist < 36) {
      const rx = Math.round(14 + (36 - landmarkDist) * 2.2);
      ctx.fillStyle = dim;
      ctx.beginPath();
      ctx.moveTo(rx - 22, 104);
      ctx.lineTo(rx - 10, 82);
      ctx.lineTo(rx + 12, 80);
      ctx.lineTo(rx + 26, 104);
      ctx.closePath();
      ctx.fill();
    }

    // Covered Wagon (heading left, iconic MECC silhouette!)
    const wx = 176;
    const wy = 78 + (step % 2);
    ctx.fillStyle = green;
    // Canvas top arch
    ctx.beginPath();
    ctx.arc(wx + 24, wy + 4, 18, Math.PI, 0, false);
    ctx.lineTo(wx + 42, wy + 12);
    ctx.lineTo(wx + 6, wy + 12);
    ctx.closePath();
    ctx.fill();
    // Dark ribs on canvas
    ctx.fillStyle = '#040d06';
    ctx.fillRect(wx + 16, wy - 10, 2, 20);
    ctx.fillRect(wx + 28, wy - 10, 2, 20);
    // Wooden wagon bed
    ctx.fillStyle = green;
    ctx.fillRect(wx + 4, wy + 12, 40, 7);

    // Spinning spoked wheels
    const drawWheel = (cx, cy, r) => {
      ctx.strokeStyle = green;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      const ang = -step * 0.45;
      ctx.lineWidth = 1;
      for (let k = 0; k < 4; k++) {
        const a = ang + (k * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
    };
    drawWheel(wx + 12, 98, 6);
    drawWheel(wx + 37, 98, 6);

    // Yoke & pair of oxen pulling left
    ctx.strokeStyle = green;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(wx + 4, wy + 16);
    ctx.lineTo(wx - 44, wy + 17);
    ctx.stroke();

    const drawOx = (ox) => {
      const leg = step % 2 === 0 ? 2 : -2;
      ctx.fillStyle = green;
      ctx.fillRect(ox, wy + 11, 16, 8); // body
      ctx.fillRect(ox - 5, wy + 9, 6, 6); // head
      ctx.fillRect(ox - 6, wy + 7, 2, 3); // horn
      // legs
      ctx.fillRect(ox + 2 + leg, wy + 19, 2, 6);
      ctx.fillRect(ox + 12 - leg, wy + 19, 2, 6);
    };
    drawOx(wx - 24);
    drawOx(wx - 50);
  };

  let miles = 812;
  let food = 482;
  let nextLm = 68;

  for (let step = 0; step < 36; step++) {
    miles += 2;
    nextLm = Math.max(0, nextLm - 2);
    if (step % 2 === 0) food = Math.max(120, food - 3);
    elMiles.textContent = `${miles} MILES`;
    elNext.textContent = `${nextLm} MILES`;
    elFood.textContent = `${food} POUNDS`;
    drawFrame(step, nextLm);

    if (step === 12) {
      elWeather.textContent = 'WARM';
      elHealth.textContent = 'FAIR';
      banner.style.display = 'block';
      banner.innerHTML = 'TERRY HAS MILD DYSENTERY.<br/>PARTY RESTS 1 DAY TO RECOVER.';
      engine.sounds.beep(780, 0.12, 0.032);
      await engine.wait(1500, signal);
      banner.style.display = 'none';
      elHealth.textContent = 'GOOD';
    } else if (step === 34) {
      banner.style.display = 'block';
      banner.innerHTML = 'YOU HAVE REACHED INDEPENDENCE ROCK!<br/>CARVED NAMES &amp; RESUPPLIED FOR THE PASS.';
      elPrompt.textContent = 'PRESS RETURN TO CONTINUE ON THE TRAIL';
      engine.sounds.speakerNote(523.25, 0.1, 0.025);
      await engine.wait(120, signal);
      engine.sounds.speakerNote(659.25, 0.1, 0.025);
      await engine.wait(120, signal);
      engine.sounds.speakerNote(783.99, 0.18, 0.028);
      await engine.wait(2000, signal);
      break;
    } else {
      await engine.wait(140, signal);
    }
  }

  engine.showTextMode();
}

/* =====================================================================
   6. AppleWorks 2.0 (ProDOS 8 · 80-Column Integrated Suite)
   ===================================================================== */
export async function apple2AppleWorks(engine, signal) {
  engine.onStatus('AppleWorks 2.0 — ProDOS 80-Column Word Processor');
  engine.setPhosphor('green');
  engine.showTextMode();
  engine.setColumns(80);
  engine.clearText();
  engine.print('PRODOS 8  V1.1.1   (C) APPLE COMPUTER 1983-85');
  engine.print('');
  await engine.typeCommand('-APPLEWORKS.SYS', { prompt: ']', delay: 50 }, signal);
  await engine.diskSeek(8, 'DISK II · S6,D1 · APPLEWORKS', signal, false);

  const dInfo = engine.getDateInfo();

  // Stage 1: Iconic AppleWorks overlapping file-folder card Main Menu
  const menuItems = [
    '1. Add files to the Desktop',
    '2. Work with one of the files on the Desktop',
    '3. Save Desktop files to disk',
    '4. Remove files from the Desktop',
    '5. Other Activities',
    '6. Quit',
  ];

  const renderMenu = (selIdx) => {
    engine.showAppMode(`
      <div class="aw-wrap">
        <div class="aw-header">
          <span>Disk: /WORK.DISK</span>
          <span>MAIN MENU</span>
          <span>Escape: Help</span>
        </div>
        <div class="aw-body">
          <div class="aw-cards">
            <div class="aw-card">
              <div class="aw-card-tab">APPLEWORKS 2.0</div>
              ${menuItems
                .map((m, i) => `<div class="aw-menu-item ${i === selIdx ? 'sel' : ''}">${m}</div>`)
                .join('')}
            </div>
          </div>
        </div>
        <div class="aw-footer">
          <span>Type number, or use arrows, then press Return</span>
          <span>55K Avail.</span>
        </div>
      </div>
    `);
  };

  renderMenu(0);
  await engine.wait(700, signal);
  engine.sounds.keyClick();
  renderMenu(1);
  await engine.wait(650, signal);
  engine.sounds.keyClick();

  // Stage 2: Word Processor editor with live typing & dynamic date
  const noteHeader = `STUDIO LOG — ${dInfo.longDate.toUpperCase()} (${dInfo.timeStr})\n${'-'.repeat(58)}\n\n`;
  const noteBody =
    `Booted the Apple //e off Disk II (Slot 6, Drive 1).\n` +
    `Checked the VisiCalc hardware budget, ran a 280x192 Hi-Res\n` +
    `vector plot, and backed up our ProDOS files.\n\n` +
    `Remember: Open-Apple + S saves straight to /WORK.DISK.\n` +
    `Green phosphor still looks sharp at ${dInfo.timeStr}.`;

  let typed = '';
  const renderEditor = (statusRight = 'Line 4  Column 1') => {
    engine.showAppMode(`
      <div class="aw-wrap">
        <div class="aw-header">
          <span>File: STUDIO.NOTES</span>
          <span>REVIEW/ADD/CHANGE</span>
          <span>Escape: Main Menu</span>
        </div>
        <div class="aw-body">
          <div class="aw-editor">${noteHeader}${typed}<span class="a2-cursor"></span></div>
        </div>
        <div class="aw-footer">
          <span>Type entry or use Open-Apple commands</span>
          <span>${statusRight}</span>
        </div>
      </div>
    `);
  };

  renderEditor('Line 4  Column 1');
  await engine.wait(420, signal);

  for (let i = 0; i < noteBody.length; i++) {
    const ch = noteBody[i];
    typed += ch;
    const linesCount = (noteHeader + typed).split('\n').length;
    const colCount = (noteHeader + typed).split('\n').pop().length + 1;
    renderEditor(`Line ${linesCount}  Column ${colCount}`);
    if (ch !== ' ' && ch !== '\n') engine.sounds.keyClick();
    await engine.wait(ch === '\n' ? 180 : 38 + Math.random() * 26, signal);
  }

  await engine.wait(500, signal);
  renderEditor('Saving /WORK.DISK/STUDIO.NOTES…');
  await engine.diskSeek(6, 'DISK II · S6,D1 · SAVE', signal, false);
  renderEditor('Saved · 54K Avail.');
  await engine.wait(1100, signal);

  engine.showTextMode();
  engine.setColumns(40);
}

/* =====================================================================
   7. The Print Shop (Brøderbund, 1984) — Sign Designer & ImageWriter II
   ===================================================================== */
export async function apple2PrintShop(engine, signal) {
  engine.onStatus('The Print Shop (1984) — Designing & Printing a Sign');
  engine.setPhosphor('green');
  engine.showTextMode();
  engine.setColumns(40);
  engine.clearText();
  await engine.typeCommand('BRUN PRINT.SHOP', {}, signal);
  await engine.diskSeek(7, 'DISK II · S6,D1 · PRINT.SHOP', signal, false);

  const dInfo = engine.getDateInfo();
  const options = ['GREETING CARD', 'SIGN', 'LETTERHEAD', 'BANNER', 'SCREEN MAGIC'];

  const renderPS = (selIdx, statusMsg) => {
    const el = engine.showAppMode(`
      <div class="ps-wrap">
        <div class="ps-titlebar">*** THE PRINT SHOP — BRODERBUND ***</div>
        <div class="ps-split">
          <div class="ps-menu-box">
            <div>
              <div style="margin-bottom:8px;">WHAT WOULD YOU LIKE TO MAKE?</div>
              ${options.map((o, i) => `<div class="ps-opt ${i === selIdx ? 'sel' : ''}">${i === selIdx ? '> ' : '  '}${o}</div>`).join('')}
            </div>
            <div style="font-size:0.86em;opacity:0.88;">${statusMsg}</div>
          </div>
          <div class="ps-preview-box">
            <div style="margin-bottom:4px;font-size:0.86em;">SIGN PREVIEW (IMAGEWRITER II)</div>
            <div class="ps-paper-frame">
              <canvas class="ps-canvas" data-ps-canvas width="200" height="160"></canvas>
            </div>
          </div>
        </div>
      </div>
    `);
    return el.querySelector('[data-ps-canvas]');
  };

  let canvas = renderPS(0, 'USE ARROWS TO SELECT');
  await engine.wait(550, signal);
  engine.sounds.keyClick();
  canvas = renderPS(1, 'BORDER: STARBURST · GRAPHIC: APPLE');
  await engine.wait(450, signal);

  const ctx = canvas.getContext('2d');
  const drawSign = (revealRows = 160) => {
    ctx.fillStyle = '#040d06';
    ctx.fillRect(0, 0, 200, 160);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, 200, revealRows);
    ctx.clip();

    // Checkerboard / Starburst Print Shop border
    ctx.fillStyle = '#46ff78';
    for (let x = 6; x < 194; x += 10) {
      ctx.fillRect(x, 6, 6, 6);
      ctx.fillRect(x, 148, 6, 6);
    }
    for (let y = 16; y < 146; y += 10) {
      ctx.fillRect(6, y, 6, 6);
      ctx.fillRect(188, y, 6, 6);
    }
    ctx.strokeStyle = '#46ff78';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, 168, 128);

    // Retro pixel computer icon in center-top
    ctx.strokeRect(76, 26, 48, 32);
    ctx.fillRect(82, 32, 36, 20);
    ctx.fillStyle = '#040d06';
    ctx.fillRect(86, 36, 28, 12);
    ctx.fillStyle = '#46ff78';
    ctx.fillRect(72, 60, 56, 8);
    ctx.fillRect(80, 62, 40, 2);

    // Bold Print Shop headline text
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('APPLE //E', 100, 92);
    ctx.font = 'bold 12px monospace';
    ctx.fillText('COMPUTING CLUB', 100, 110);
    ctx.font = 'bold 10px monospace';
    ctx.fillText(dInfo.shortDate.toUpperCase() + ' · ROOM 204', 100, 130);
    ctx.restore();
  };

  drawSign(160);
  await engine.wait(900, signal);

  // Simulate ImageWriter II dot-matrix progressive print!
  canvas = renderPS(1, 'PRINTING TO IMAGEWRITER II (SLOT 1)...');
  const pCtx = canvas.getContext('2d');
  for (let row = 16; row <= 160; row += 18) {
    // Re-run drawSign into the active canvas
    const drawOn = (c, rev) => {
      const g = c.getContext('2d');
      g.fillStyle = '#040d06';
      g.fillRect(0, 0, 200, 160);
      g.save();
      g.beginPath();
      g.rect(0, 0, 200, rev);
      g.clip();
      g.fillStyle = '#46ff78';
      for (let x = 6; x < 194; x += 10) {
        g.fillRect(x, 6, 6, 6);
        g.fillRect(x, 148, 6, 6);
      }
      for (let y = 16; y < 146; y += 10) {
        g.fillRect(6, y, 6, 6);
        g.fillRect(188, y, 6, 6);
      }
      g.strokeStyle = '#46ff78';
      g.lineWidth = 2;
      g.strokeRect(16, 16, 168, 128);
      g.strokeRect(76, 26, 48, 32);
      g.fillRect(82, 32, 36, 20);
      g.fillStyle = '#040d06';
      g.fillRect(86, 36, 28, 12);
      g.fillStyle = '#46ff78';
      g.fillRect(72, 60, 56, 8);
      g.font = 'bold 16px monospace';
      g.textAlign = 'center';
      g.fillText('APPLE //E', 100, 92);
      g.font = 'bold 12px monospace';
      g.fillText('COMPUTING CLUB', 100, 110);
      g.font = 'bold 10px monospace';
      g.fillText(dInfo.shortDate.toUpperCase() + ' · ROOM 204', 100, 130);
      g.restore();
      if (rev < 160) {
        g.fillStyle = '#46ff78';
        g.fillRect(12, rev, 176, 2);
      }
    };
    drawOn(canvas, row);
    engine.sounds.printerZip(0.22);
    await engine.wait(280, signal);
  }
  if (pCtx) await engine.wait(1100, signal);
  engine.showTextMode();
}

/* =====================================================================
   8. Woz's System Monitor (CALL -151) & 6502 Disassembler
   ===================================================================== */
export async function apple2SystemMonitor(engine, signal) {
  engine.onStatus('System Monitor (CALL -151) — 6502 Hex & Disassembly');
  engine.showTextMode();
  engine.setColumns(40);
  engine.setPhosphor('green');
  engine.clearText();
  engine.print('APPLESOFT II · 65C02 SYSTEM');
  engine.print('');
  await engine.wait(300, signal);

  await engine.typeCommand('CALL -151', { prompt: ']' }, signal);
  await engine.wait(280, signal);

  // Hex dump of Apple II Monitor ROM F800.F82F
  await engine.typeCommand('F800.F82F', { prompt: '*' }, signal);
  const hexLines = [
    'F800- 4A 08 20 47 F8 28 A9 0F',
    'F808- 90 02 69 E0 85 2E B1 26',
    'F810- 45 30 25 2E 51 26 91 26',
    'F818- 60 20 00 F8 E4 2C B0 03',
    'F820- C8 10 F6 60 69 00 48 20',
    'F828- 00 F8 68 C5 2D B0 03 18',
  ];
  for (const h of hexLines) {
    engine.print(h);
    await engine.wait(110, signal);
  }
  await engine.wait(600, signal);

  // Iconic 6502 mini-disassembler (F800L)
  await engine.typeCommand('F800L', { prompt: '*' }, signal);
  const disasm = [
    'F800-   4A          LSR',
    'F801-   08          PHP',
    'F802-   20 47 F8    JSR   $F847',
    'F805-   28          PLP',
    'F806-   A9 0F       LDA   #$0F',
    'F808-   90 02       BCC   $F80C',
    'F80A-   69 E0       ADC   #$E0',
    'F80C-   85 2E       STA   $2E',
    'F80E-   B1 26       LDA   ($26),Y',
    'F810-   45 30       EOR   $30',
    'F818-   60          RTS',
  ];
  for (const d of disasm) {
    engine.print(d);
    await engine.wait(120, signal);
  }
  await engine.wait(1050, signal);

  // Warm return to Applesoft BASIC via 3D0G
  await engine.typeCommand('3D0G', { prompt: '*' }, signal);
  engine.sounds.beep(1000, 0.08, 0.032);
  await engine.wait(450, signal);
}

/* =====================================================================
   9. 1-Bit Speaker Music ($C030) & Hi-Res Oscilloscope
   ===================================================================== */
export async function apple2SpeakerMusic(engine, signal) {
  engine.onStatus('Apple //e — 1-Bit Speaker ($C030) Music Visualizer');
  engine.showTextMode();
  engine.setColumns(40);
  engine.setPhosphor('green');
  engine.clearText();
  await engine.typeCommand('RUN BACH.1BIT', {}, signal);
  await engine.diskSeek(5, 'DISK II · S6,D1 · BACH.1BIT', signal, false);

  engine.showGfxMode({ split: true, width: 280, height: 160 });
  const ctx = engine.gfxCtx;

  // Classic Baroque arpeggio (C major / A minor / F major / G7)
  const melody = [
    [261.63, 'C4'], [329.63, 'E4'], [392.0, 'G4'], [523.25, 'C5'],
    [659.25, 'E5'], [392.0, 'G4'], [523.25, 'C5'], [659.25, 'E5'],
    [220.0, 'A3'], [261.63, 'C4'], [329.63, 'E4'], [440.0, 'A4'],
    [523.25, 'C5'], [329.63, 'E4'], [440.0, 'A4'], [523.25, 'C5'],
    [174.61, 'F3'], [220.0, 'A3'], [261.63, 'C4'], [349.23, 'F4'],
    [440.0, 'A4'], [261.63, 'C4'], [349.23, 'F4'], [440.0, 'A4'],
    [196.0, 'G3'], [246.94, 'B3'], [293.66, 'D4'], [392.0, 'G4'],
    [493.88, 'B4'], [392.0, 'G4'], [523.25, 'C5'], [523.25, 'C5'],
  ];

  const bars = new Array(16).fill(10);

  try {
    for (let i = 0; i < melody.length; i++) {
      const [freq, name] = melody[i];
      engine.sounds.speakerNote(freq, 0.16, 0.028);

      const barIdx = i % bars.length;
      for (let b = 0; b < bars.length; b++) {
        bars[b] = Math.max(8, bars[b] * 0.72);
      }
      bars[barIdx] = Math.min(82, 22 + (freq / 700) * 62);
      bars[(barIdx + 1) % bars.length] = Math.max(bars[(barIdx + 1) % bars.length], bars[barIdx] * 0.65);

      ctx.fillStyle = '#040d06';
      ctx.fillRect(0, 0, 280, 160);

      // Draw crisp 1-bit square wave oscilloscope across top half
      ctx.strokeStyle = '#46ff78';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const cycles = Math.max(2, Math.round(freq / 72));
      for (let x = 8; x < 272; x += 2) {
        const phase = ((x - 8) / 264) * cycles * Math.PI * 2 + i * 0.8;
        const y = Math.sin(phase) >= 0 ? 22 : 52;
        if (x === 8) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw 16 phosphor pitch bars on lower half
      for (let b = 0; b < bars.length; b++) {
        const h = Math.round(bars[b]);
        ctx.fillStyle = b === barIdx ? '#9dffb8' : '#26c953';
        ctx.fillRect(14 + b * 16, 152 - h, 11, h);
      }

      engine.setSplitLines([
        'APPLE II 1-BIT SPEAKER SYNTH ($C030)',
        `NOTE: ${name.padEnd(4, ' ')}  FREQ: ${String(Math.round(freq)).padStart(3, ' ')} HZ   STEP: ${String(i + 1).padStart(2, '0')}/32`,
        'LDA $C030 ; TOGGLE SPEAKER CONE',
        'PRESS M TO TOGGLE AUDIO',
      ]);

      await engine.wait(175, signal);
    }
    await engine.wait(650, signal);
  } finally {
    engine.showTextMode();
  }
}

/* =====================================================================
   10. ProDOS 8 Catalog & Monitor Phosphor Cycle (Green / Amber / Color)
   ===================================================================== */
export async function apple2PhosphorCycle(engine, signal) {
  engine.onStatus('ProDOS 8 — Monitor Phosphor Check (P31 / Amber / Color)');
  engine.showTextMode();
  engine.setColumns(80);
  engine.clearText();

  const dInfo = engine.getDateInfo();
  const modes = [
    { id: 'green', label: 'APPLE MONITOR II — P31 GREEN PHOSPHOR' },
    { id: 'amber', label: 'AMDEK COLOR-300A — P3 AMBER PHOSPHOR' },
    { id: 'color', label: 'APPLECOLOR COMPOSITE MONITOR IIE' },
    { id: 'green', label: 'APPLE MONITOR II — P31 GREEN PHOSPHOR' },
  ];

  for (const m of modes) {
    engine.setPhosphor(m.id);
    engine.clearText();
    engine.print(`/WORK.DISK   ${m.label}`);
    engine.print('');
    engine.print(' NAME           TYPE  BLOCKS  MODIFIED         CREATED          ENDFILE');
    engine.print('');
    engine.print(` PRODOS          SYS      32  18-JUN-85 00:00  18-JUN-85 00:00    15485`);
    engine.print(` BASIC.SYSTEM    SYS      21  18-JUN-85 00:00  18-JUN-85 00:00    10240`);
    engine.print(` STUDIO.NOTES    AWP       6  ${dInfo.prodosDate} ${dInfo.timeStr.slice(0, 5)}  ${dInfo.prodosDate} 09:00     2418`);
    engine.print(` VISICALC.DIF    TXT       9  ${dInfo.prodosDate} ${dInfo.timeStr.slice(0, 5)}  14-MAY-83 11:20     4102`);
    engine.print(` HIRES.SPIRO     BAS       4  ${dInfo.prodosDate} ${dInfo.timeStr.slice(0, 5)}  02-NOV-84 16:40     1640`);
    engine.print('');
    engine.print('BLOCKS FREE: 208     BLOCKS USED:  72     TOTAL BLOCKS:  280');
    engine.sounds.keyClick();
    await engine.wait(1450, signal);
  }

  engine.setColumns(40);
  await engine.wait(400, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'apple2-boot', run: apple2ColdBootAndCatalog },
  { id: 'apple2-lores', run: apple2LoResKaleido },
  { id: 'apple2-visicalc', run: apple2VisiCalc },
  { id: 'apple2-hires', run: apple2HiResVector },
  { id: 'apple2-oregon', run: apple2OregonTrail },
  { id: 'apple2-appleworks', run: apple2AppleWorks },
  { id: 'apple2-printshop', run: apple2PrintShop },
  { id: 'apple2-monitor', run: apple2SystemMonitor },
  { id: 'apple2-music', run: apple2SpeakerMusic },
  { id: 'apple2-phosphor', run: apple2PhosphorCycle },
];

export const SPECIAL_VIGNETTES = {
  'apple2-boot': apple2ColdBootAndCatalog,
  visicalc: apple2VisiCalc,
  oregon: apple2OregonTrail,
  'hires-demo': apple2HiResVector,
  monitor: apple2SystemMonitor,
};
