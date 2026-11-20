import { XP_ICONS } from './icons.js?v=12';
import { XP_THEMES } from './engine.js?v=13';

function formatLongDate(now = new Date()) {
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * 0. Windows XP Boot (3 Blue Blocks) -> Royal Blue "welcome" -> Startup Chord + Tour Balloon
 */
export async function xpBootAndWelcome(engine) {
  engine.setStatus('Starting Windows XP…');
  engine.closeAllWindows();

  const boot = document.createElement('div');
  boot.className = 'xp-boot';
  boot.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="width:68px;height:68px;">${XP_ICONS.xpFlag}</div>
      <div>
        <div style="font-size:15px;color:#cfd8e8;letter-spacing:0.5px;">Microsoft<sup style="font-size:9px;">®</sup></div>
        <div style="font-size:44px;font-weight:700;line-height:1;letter-spacing:-1px;">Windows<span style="color:#f56224;font-size:24px;vertical-align:super;margin-left:3px;">xp</span></div>
      </div>
    </div>
    <div class="xp-boot-bar">
      <div class="xp-boot-blocks">
        <div class="xp-boot-block"></div>
        <div class="xp-boot-block"></div>
        <div class="xp-boot-block"></div>
      </div>
    </div>
  `;
  engine.root.appendChild(boot);
  engine.overlayEl = boot;

  try {
    await engine.wait(2100);
    boot.classList.add('fade-out');
    await engine.wait(450);
    boot.remove();

    const welcome = document.createElement('div');
    welcome.className = 'xp-welcome';
    welcome.innerHTML = `<div class="xp-welcome-word">welcome</div>`;
    engine.root.appendChild(welcome);
    engine.overlayEl = welcome;

    engine.sounds.xpStartup();
    await engine.wait(1450);
    welcome.classList.add('fade-out');
    await engine.wait(580);
    welcome.remove();
    engine.overlayEl = null;

    engine.showBalloon(
      'Take a tour of Windows XP',
      'To learn about the exciting new features in Windows XP, click here.',
      XP_ICONS.xpFlag,
    );
    await engine.wait(1650);
    engine.hideBalloon();
    engine.showBalloon(
      'Desktop Cleanup',
      'There are unused icons on your desktop.',
    );
    await engine.wait(1500);
    engine.hideBalloon();
  } finally {
    if (engine.overlayEl) {
      engine.overlayEl.remove();
      engine.overlayEl = null;
    }
  }
}

/**
 * 1. AIM 5 — yellow buddy list, sign-on, and a live instant message.
 */
export async function aimInstantMessage(engine) {
  engine.setStatus('AIM — Buddy list & instant message');
  engine.closeAllWindows();

  await engine.openStartAndPick('AIM');
  await engine.wait(160);

  const list = engine.createWindow({
    id: 'aim-list',
    title: 'Buddy List',
    icon: XP_ICONS.aim,
    width: 250,
    height: 390,
    x: 118,
    y: 22,
    menus: ['File', 'People'],
    bodyHtml: `
      <div class="xp-aim-list">
        <div class="xp-aim-head">
          <span class="xp-aim-mark">${XP_ICONS.aim}</span>
          <div>
            <div class="xp-aim-sn">BlissHill</div>
            <div class="xp-aim-avail">Available</div>
          </div>
        </div>
        <div class="xp-aim-scroll">
          <div class="xp-aim-group">Buddies</div>
          <div data-online>
            <div class="xp-aim-buddy" data-buddy="WinampKid"><i></i>WinampKid</div>
            <div class="xp-aim-buddy away"><i></i>DialupDave<span>away</span></div>
          </div>
          <div class="xp-aim-group">Offline</div>
          <div data-offline>
            <div class="xp-aim-buddy offline" data-buddy="SkaterBoi02"><i></i>SkaterBoi02</div>
            <div class="xp-aim-buddy offline"><i></i>PaintShop</div>
            <div class="xp-aim-buddy offline"><i></i>Cadet99</div>
          </div>
        </div>
      </div>
    `,
  });

  await engine.wait(700);
  const buddy = list.body.querySelector('[data-buddy="SkaterBoi02"]');
  engine.sounds.aimSignOn();
  buddy.classList.remove('offline');
  buddy.classList.add('just-on');
  list.body.querySelector('[data-online]').prepend(buddy);
  await engine.wait(520);

  await engine.clickEl(buddy);
  buddy.classList.add('lit');
  await engine.wait(180);

  const chat = engine.createWindow({
    id: 'aim-chat',
    title: 'SkaterBoi02 - Instant Message',
    icon: XP_ICONS.aim,
    width: 470,
    height: 330,
    x: 392,
    y: 58,
    menus: ['File', 'Edit', 'Insert', 'People'],
    bodyHtml: `
      <div class="xp-aim-chat">
        <div class="xp-aim-tools">
          <span>Arial</span>
          <span class="xp-aim-tool">B</span>
          <span class="xp-aim-tool">I</span>
          <span class="xp-aim-tool">U</span>
          <span class="xp-aim-tool">:)</span>
        </div>
        <div class="xp-aim-log" data-aim-log></div>
        <div class="xp-aim-note" data-aim-note></div>
        <div class="xp-aim-compose">
          <div data-aim-draft></div>
          <div class="xp-btn default" data-aim-send>Send</div>
        </div>
      </div>
    `,
  });

  const log = chat.body.querySelector('[data-aim-log]');
  const draft = chat.body.querySelector('[data-aim-draft]');
  const sendBtn = chat.body.querySelector('[data-aim-send]');
  const note = chat.body.querySelector('[data-aim-note]');

  const addLine = (name, color, msg) => {
    const div = document.createElement('div');
    div.className = 'xp-aim-line';
    div.innerHTML = `<b style="color:${color}">${name}:</b> ${msg}`;
    log.appendChild(div);
  };

  note.textContent = 'SkaterBoi02 is typing...';
  await engine.wait(800);
  engine.sounds.aimMessage();
  engine.flashTask('aim-chat', true);
  addLine('SkaterBoi02', '#c41230', 'yo u there?? did u download the new winamp skins yet? :)');
  note.textContent = '';
  await engine.wait(600);
  engine.focusWindow('aim-chat');

  engine.setCursorKind('ibeam');
  await engine.moveToEl(draft);
  await engine.typeText(draft, 'haha yes!! booting space cadet pinball in a sec ;)', { charMs: 36 });
  engine.setCursorKind('arrow');
  await engine.clickEl(sendBtn);
  addLine('BlissHill', '#003399', draft.textContent);
  draft.textContent = '';
  engine.sounds.aimMessage();

  note.textContent = 'SkaterBoi02 is typing...';
  await engine.wait(780);
  engine.sounds.aimMessage();
  addLine('SkaterBoi02', '#c41230', 'nice!! beat 250k and send me a screenshot in paint lol');
  note.textContent = '';

  await engine.wait(1100);
  await engine.clickCloseWindow('aim-chat');
  await engine.wait(280);
  await engine.clickCloseWindow('aim-list');
}

/**
 * 2. Winamp 2.91 Classic Skin — Live 20-Band Spectrum Visualizer & Playlist!
 */
export async function winampClassic(engine) {
  engine.setStatus('Winamp 2.91 — Playing Studio Playlist');
  engine.closeAllWindows();

  await engine.selectDeskIcon('winamp', { doubleClick: true });
  await engine.wait(220);

  const win = engine.createWindow({
    id: 'winamp',
    title: 'Winamp 2.91',
    icon: XP_ICONS.winamp,
    width: 390,
    height: 245,
    raw: true,
    bodyHtml: `
      <div class="xp-winamp-shell" style="height:100%;display:flex;flex-direction:column;">
        <div class="xp-wa-top">
          <span>WINAMP 2.91</span>
          <span data-close-win style="padding:0 4px;">×</span>
        </div>
        <div class="xp-wa-main">
          <div class="xp-wa-display">
            <div class="xp-wa-lcd">
              <div class="xp-wa-time" data-wa-time>00:00</div>
              <canvas class="xp-wa-spec" width="100" height="22"></canvas>
            </div>
            <div class="xp-wa-right">
              <div class="xp-wa-marquee" data-wa-title>1. DJ Mike Llama - Llama Whippin' Intro</div>
              <div class="xp-wa-meta">
                <span class="xp-wa-badge">192 kbps</span>
                <span class="xp-wa-badge">44 kHz</span>
                <span class="xp-wa-badge" style="color:#46ff72;">STEREO</span>
              </div>
              <div class="xp-wa-controls">
                <div class="xp-wa-btn">⏮</div>
                <div class="xp-wa-btn active" data-wa-play>▶</div>
                <div class="xp-wa-btn">⏸</div>
                <div class="xp-wa-btn">■</div>
                <div class="xp-wa-btn" data-wa-next>⏭</div>
                <span style="margin-left:auto;font-size:10px;color:#9eb0cc;">EQ · PL</span>
              </div>
            </div>
          </div>
        </div>
        <div class="xp-wa-playlist">
          <div class="xp-wa-track active" data-tr="0"><span>1. DJ Mike Llama - Llama Whippin' Intro</span><span>0:05</span></div>
          <div class="xp-wa-track" data-tr="1"><span>2. Bliss Horizon - XP 2001 Synth Mix</span><span>3:42</span></div>
          <div class="xp-wa-track" data-tr="2"><span>3. Space Cadet - Orbital Pinball Theme</span><span>2:58</span></div>
          <div class="xp-wa-track" data-tr="3"><span>4. Late Night Dialup - 56k Chillout</span><span>4:11</span></div>
        </div>
      </div>
    `,
  });

  const canvas = win.el.querySelector('.xp-wa-spec');
  const ctx = canvas.getContext('2d');
  const timeEl = win.el.querySelector('[data-wa-time]');
  const titleEl = win.el.querySelector('[data-wa-title]');
  const nextBtn = win.el.querySelector('[data-wa-next]');
  const tracks = [...win.el.querySelectorAll('.xp-wa-track')];
  const peaks = new Array(16).fill(4);
  let secs = 1;

  const drawSpec = (energy = 1) => {
    ctx.fillStyle = '#050b07';
    ctx.fillRect(0, 0, 100, 22);
    for (let i = 0; i < 16; i++) {
      const h = Math.min(20, Math.max(2, Math.floor((Math.sin(i * 0.55 + secs * 0.4) * 0.5 + 0.5) * 14 * energy + Math.random() * 7)));
      if (h > peaks[i]) peaks[i] = h;
      else peaks[i] = Math.max(2, peaks[i] - 0.7);
      const grad = ctx.createLinearGradient(0, 22, 0, 2);
      grad.addColorStop(0, '#18c83c');
      grad.addColorStop(0.6, '#d8e828');
      grad.addColorStop(1, '#f03020');
      ctx.fillStyle = grad;
      ctx.fillRect(i * 6 + 2, 22 - h, 4, h);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(i * 6 + 2, 21 - Math.round(peaks[i]), 4, 1.5);
    }
  };

  for (let f = 0; f < 22; f++) {
    drawSpec(0.85);
    timeEl.textContent = `00:0${Math.min(5, Math.floor(f / 5) + 1)}`;
    secs++;
    await engine.wait(85);
  }

  // Click Next track -> Track 2!
  await engine.clickEl(nextBtn);
  tracks.forEach((t, idx) => t.classList.toggle('active', idx === 1));
  titleEl.textContent = '2. Bliss Horizon - XP 2001 Synth Mix (192 kbps)';

  for (let f = 0; f < 46; f++) {
    drawSpec(1.15);
    const s = Math.floor(f / 4) + 1;
    timeEl.textContent = `00:${String(s).padStart(2, '0')}`;
    secs++;
    await engine.wait(75);
  }

  await engine.clickCloseWindow('winamp');
}

/**
 * 3. 3D Pinball for Windows — Space Cadet (Live Canvas Physics!)
 */
export async function spaceCadetPinball(engine) {
  engine.setStatus('3D Pinball: Space Cadet — Live Table');
  engine.closeAllWindows();

  await engine.openStartAndPick('3D Pinball');
  await engine.wait(180);

  const win = engine.createWindow({
    id: 'pinball',
    title: '3D Pinball for Windows - Space Cadet',
    icon: XP_ICONS.pinball,
    width: 530,
    height: 410,
    menus: ['Game', 'Options', 'Help'],
    bodyHtml: `
      <div class="xp-pinball-wrap">
        <canvas data-pb-canvas width="366" height="354" style="display:block;flex:1;"></canvas>
        <div class="xp-pinball-side">
          <div style="font-weight:700;color:#fff;font-size:12px;text-align:center;">SPACE CADET</div>
          <div>
            <div style="font-size:10px;color:#7ca4d8;">SCORE</div>
            <div class="xp-pb-lcd" data-pb-score>0</div>
          </div>
          <div style="font-size:11px;display:flex;flex-direction:column;gap:5px;">
            <div>BALL: <strong style="color:#fff;">1 of 3</strong></div>
            <div>RANK: <strong style="color:#ffd166;">Cadet</strong></div>
            <div>MISSION: <strong style="color:#58f08a;">Launch Training</strong></div>
          </div>
          <div style="margin-top:auto;font-size:10px;color:#6880a4;border-top:1px solid #2b3854;padding-top:8px;">
            Z / / Flippers · Space Plunger
          </div>
        </div>
      </div>
    `,
  });

  const canvas = win.body.querySelector('[data-pb-canvas]');
  const scoreEl = win.body.querySelector('[data-pb-score]');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const bumpers = [
    { x: 145, y: 118, r: 22, color: '#e63946', flash: 0 },
    { x: 225, y: 118, r: 22, color: '#4cc9f0', flash: 0 },
    { x: 185, y: 174, r: 24, color: '#ffd166', flash: 0 },
  ];

  let bx = 338;
  let by = 315;
  let vx = 0;
  let vy = -12.5;
  let score = 0;
  let leftFlip = 0;
  let rightFlip = 0;

  for (let f = 0; f < 145; f++) {
    engine.checkAbort();
    while (engine.paused) await engine.wait(40);

    // Physics step
    if (f < 22) {
      // Launch lane up right side and curve into playfield
      by += vy;
      if (by < 56) {
        bx -= 6;
        vx = -4.2;
        vy = 2.1;
      }
    } else {
      vy += 0.24; // gravity
      bx += vx;
      by += vy;

      // Walls
      if (bx < 26) { bx = 26; vx = Math.abs(vx) * 0.92; }
      if (bx > 316) { bx = 316; vx = -Math.abs(vx) * 0.92; }
      if (by < 26) { by = 26; vy = Math.abs(vy) * 0.9; }

      // Bumper collisions
      for (const b of bumpers) {
        if (b.flash > 0) b.flash--;
        const dx = bx - b.x;
        const dy = by - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < b.r + 9) {
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);
          bx = b.x + nx * (b.r + 9.5);
          by = b.y + ny * (b.r + 9.5);
          vx = nx * 7.2 + (Math.random() - 0.5) * 2;
          vy = ny * 7.2 - 1.5;
          b.flash = 7;
          score += 2500;
          scoreEl.textContent = score.toLocaleString();
          engine.sounds.pinballBumper();
        }
      }

      // Auto-flippers at bottom!
      if (by > 294 && by < 328) {
        if (bx < 175) {
          leftFlip = 7;
          vy = -10.5 - Math.random() * 2.5;
          vx = 2.2 + Math.random() * 3.2;
          score += 500;
          scoreEl.textContent = score.toLocaleString();
          engine.sounds.click();
        } else {
          rightFlip = 7;
          vy = -10.5 - Math.random() * 2.5;
          vx = -2.2 - Math.random() * 3.2;
          score += 500;
          scoreEl.textContent = score.toLocaleString();
          engine.sounds.click();
        }
      }
      if (by > 342) { by = 305; vy = -11; }
    }

    if (leftFlip > 0) leftFlip--;
    if (rightFlip > 0) rightFlip--;

    // Draw Space Cadet Table
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#10103a');
    grad.addColorStop(0.5, '#1d1654');
    grad.addColorStop(1, '#0b0a24');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Table outline & launch rail
    ctx.strokeStyle = '#5c74c8';
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, 340, H - 28);
    ctx.beginPath();
    ctx.moveTo(324, 80);
    ctx.lineTo(324, H - 14);
    ctx.stroke();

    // Glowing starfield & mission triangles
    ctx.fillStyle = '#4cc9f0';
    for (let s = 0; s < 5; s++) {
      ctx.fillRect(72 + s * 46, 52, 14, 6);
    }

    // Bumpers
    for (const b of bumpers) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.flash > 0 ? '#ffffff' : b.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffd166';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#1b1448';
      ctx.fill();
    }

    // Flippers
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(95, 314);
    ctx.lineTo(160, leftFlip > 0 ? 298 : 326);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(255, 314);
    ctx.lineTo(190, rightFlip > 0 ? 298 : 326);
    ctx.stroke();

    // Metallic silver pinball
    const ballGrad = ctx.createRadialGradient(bx - 3, by - 3, 1, bx, by, 9);
    ballGrad.addColorStop(0, '#ffffff');
    ballGrad.addColorStop(0.55, '#c8d4e6');
    ballGrad.addColorStop(1, '#4c5870');
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(bx, by, 8.5, 0, Math.PI * 2);
    ctx.fill();

    await engine.wait(32);
  }

  await engine.wait(500);
  await engine.clickCloseWindow('pinball');
}

/**
 * 4. MS Paint (XP) — Drawing Bliss Hill & Sun Live!
 */
export async function msPaintXp(engine) {
  engine.setStatus('Paint — Sketching bliss_2001.bmp');
  engine.closeAllWindows();

  await engine.openStartAndPick('Paint');
  await engine.wait(180);

  const colors = ['#000000', '#ffffff', '#e02424', '#ff9800', '#ffe030', '#38b030', '#2e90ff', '#7c4dff', '#8d5524'];
  const win = engine.createWindow({
    id: 'paint',
    title: 'bliss_2001.bmp - Paint',
    icon: XP_ICONS.paint,
    width: 540,
    height: 375,
    menus: ['File', 'Edit', 'View', 'Image', 'Colors', 'Help'],
    bodyHtml: `
      <div class="xp-paint-layout">
        <div class="xp-paint-mid">
          <div class="xp-paint-tools">
            <div class="xp-ptool">✂</div><div class="xp-ptool">⬚</div>
            <div class="xp-ptool">✎</div><div class="xp-ptool active">🖌</div>
            <div class="xp-ptool">🪣</div><div class="xp-ptool">╱</div>
            <div class="xp-ptool">▭</div><div class="xp-ptool">◯</div>
          </div>
          <div class="xp-paint-canvas-wrap">
            <canvas data-paint-canvas width="445" height="260" style="background:#fff;box-shadow:1px 1px 0 #444;"></canvas>
          </div>
        </div>
        <div class="xp-paint-palette">
          ${colors.map((c, i) => `<div class="xp-swatch ${i === 6 ? 'active' : ''}" data-sw="${c}" style="background:${c};"></div>`).join('')}
        </div>
      </div>
    `,
  });

  const canvas = win.body.querySelector('[data-paint-canvas]');
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();

  // Fill sky
  ctx.fillStyle = '#5eb4ff';
  ctx.fillRect(0, 0, 445, 165);
  await engine.wait(300);

  // Paint green rolling hill live with cursor!
  const swGreen = win.body.querySelector('[data-sw="#38b030"]');
  await engine.clickEl(swGreen);
  ctx.fillStyle = '#48b832';
  for (let x = 0; x <= 445; x += 28) {
    const y = 160 - Math.sin((x / 445) * Math.PI) * 34;
    await engine.moveTo(rect.left + x, rect.top + y, 70);
    ctx.fillRect(x, y, 32, 260 - y);
  }

  // Paint golden sun
  const swYellow = win.body.querySelector('[data-sw="#ffe030"]');
  await engine.clickEl(swYellow);
  await engine.moveTo(rect.left + 365, rect.top + 56, 300);
  ctx.fillStyle = '#ffe030';
  ctx.beginPath();
  ctx.arc(365, 56, 26, 0, Math.PI * 2);
  ctx.fill();

  // Paint fluffy white cloud
  const swWhite = win.body.querySelector('[data-sw="#ffffff"]');
  await engine.clickEl(swWhite);
  for (const [cx, cy, r] of [[110, 62, 22], [134, 56, 26], [160, 64, 20]]) {
    await engine.moveTo(rect.left + cx, rect.top + cy, 160);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Paint tiny red house on hill!
  const swRed = win.body.querySelector('[data-sw="#e02424"]');
  await engine.clickEl(swRed);
  await engine.moveTo(rect.left + 210, rect.top + 130, 260);
  ctx.fillStyle = '#f8f4e8';
  ctx.fillRect(190, 132, 46, 36);
  ctx.fillStyle = '#d82824';
  ctx.beginPath();
  ctx.moveTo(182, 132);
  ctx.lineTo(213, 106);
  ctx.lineTo(244, 132);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a441a';
  ctx.fillRect(206, 148, 14, 20);

  await engine.wait(1100);
  await engine.clickCloseWindow('paint');
}

/**
 * 5. My Computer (Blue Task Pane) & Emptying Recycle Bin
 */
export async function myComputerAndRecycle(engine) {
  engine.setStatus('My Computer — Explorer & Recycle Bin');
  engine.closeAllWindows();

  await engine.selectDeskIcon('my-computer', { doubleClick: true });
  await engine.wait(220);

  const win = engine.createWindow({
    id: 'my-comp',
    title: 'My Computer',
    icon: XP_ICONS.myComputer,
    width: 575,
    height: 360,
    x: 115,
    y: 54,
    menus: ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'],
    bodyHtml: `
      <div class="xp-explorer-layout">
        <aside class="xp-task-pane">
          <div class="xp-pane-box">
            <div class="xp-pane-head">System Tasks</div>
            <div class="xp-pane-list">
              <span>View system information</span>
              <span>Add or remove programs</span>
              <span>Change a setting</span>
            </div>
          </div>
          <div class="xp-pane-box">
            <div class="xp-pane-head">Other Places</div>
            <div class="xp-pane-list">
              <span>My Network Places</span>
              <span>My Documents</span>
              <span>Control Panel</span>
            </div>
          </div>
          <div class="xp-pane-box">
            <div class="xp-pane-head">Details</div>
            <div class="xp-pane-list" style="color:#222;">
              <strong>My Computer</strong>
              <span>System Folder</span>
            </div>
          </div>
        </aside>
        <div class="xp-explorer-main">
          <div class="xp-group-head">Files Stored on This Computer</div>
          <div class="xp-file-grid">
            <div class="xp-file-item">
              <div style="width:32px;height:32px;">${XP_ICONS.myDocuments}</div>
              <div>Shared Documents</div>
            </div>
            <div class="xp-file-item" data-temp-file>
              <div style="width:32px;height:32px;">${XP_ICONS.notepad}</div>
              <div>Old_Setup.tmp</div>
            </div>
          </div>
          <div class="xp-group-head">Hard Disk Drives</div>
          <div class="xp-file-grid">
            <div class="xp-file-item">
              <div style="width:32px;height:32px;">${XP_ICONS.myComputer}</div>
              <div><strong>Local Disk (C:)</strong><br/><span style="font-size:10px;color:#555;">40.0 GB NTFS</span></div>
            </div>
          </div>
        </div>
      </div>
    `,
  });

  await engine.wait(650);
  const tempEl = win.body.querySelector('[data-temp-file]');
  const recycleEl = engine.root.querySelector('[data-desk="recycle"]');
  tempEl.classList.add('selected');
  await engine.wait(260);

  await engine.dragElTo(
    tempEl,
    recycleEl,
    `<div style="width:32px;height:32px;">${XP_ICONS.notepad}</div>`,
  );
  tempEl.remove();
  engine.setRecycleFull(true);
  await engine.wait(450);

  // Empty Recycle Bin with crunch + XP tray balloon!
  await engine.selectDeskIcon('recycle', { doubleClick: true });
  engine.sounds.recycleEmpty();
  engine.setRecycleFull(false);
  engine.showBalloon(
    'Recycle Bin Emptied',
    'Removed Old_Setup.tmp — 18.4 GB free on Local Disk (C:).',
    XP_ICONS.infoBalloon,
  );
  await engine.wait(1400);
  engine.hideBalloon();
  await engine.clickCloseWindow('my-comp');
}

/**
 * 6. Display Properties — Switching Luna Color Schemes (Blue / Olive Green / Silver)
 */
export async function displayPropertiesLuna(engine) {
  engine.setStatus('Display Properties — Luna Theme Switcher');
  engine.closeAllWindows();

  await engine.openStartAndPick('Control Panel');
  await engine.wait(180);

  const nextIdx = (engine.themeIndex + 1) % XP_THEMES.length;
  const nextTheme = XP_THEMES[nextIdx];

  const win = engine.createWindow({
    id: 'display-props',
    title: 'Display Properties',
    icon: XP_ICONS.displayProps,
    width: 390,
    height: 335,
    bodyHtml: `
      <div class="xp-disp-wrap">
        <div style="display:flex;gap:3px;font-size:11px;">
          <span style="padding:3px 9px;background:#e4e1d4;border:1px solid #999;">Themes</span>
          <span style="padding:3px 9px;background:#e4e1d4;border:1px solid #999;">Desktop</span>
          <span style="padding:3px 9px;background:#e4e1d4;border:1px solid #999;">Screen Saver</span>
          <span style="padding:3px 9px;background:#ffffff;border:1px solid #888;border-bottom:none;font-weight:700;">Appearance</span>
        </div>
        <div class="xp-disp-preview">
          <div style="position:absolute;left:28px;top:24px;right:48px;height:78px;background:#ece9d8;border:2px solid #0a3c9e;border-radius:5px 5px 0 0;overflow:hidden;">
            <div data-prev-bar style="height:18px;background:var(--xp-title-mid);color:#fff;font-size:10px;font-weight:700;padding:2px 6px;">Active Window</div>
            <div style="padding:8px;font-size:10.5px;">Window Text · Windows XP Style</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:11px;">
          <label>Windows and buttons: <strong>Windows XP style</strong></label>
          <div style="display:flex;align-items:center;gap:8px;">
            <span>Color scheme:</span>
            <div data-scheme-select style="flex:1;background:#fff;border:1px solid #7f9db9;padding:3px 7px;">${XP_THEMES[engine.themeIndex].label} ▾</div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:auto;">
          <div class="xp-btn default" data-disp-ok>OK</div>
          <div class="xp-btn">Cancel</div>
          <div class="xp-btn" data-disp-apply>Apply</div>
        </div>
      </div>
    `,
  });

  await engine.wait(650);
  const sel = win.body.querySelector('[data-scheme-select]');
  await engine.clickEl(sel);
  sel.textContent = `${nextTheme.label} ▾`;
  await engine.wait(450);

  await engine.clickEl(win.body.querySelector('[data-disp-apply]'));
  engine.applyTheme(nextIdx);
  engine.showBalloon(
    'Appearance Updated',
    `Switched Windows XP Luna color scheme to ${nextTheme.label}.`,
    XP_ICONS.displayProps,
  );
  await engine.wait(1350);
  engine.hideBalloon();
  await engine.clickEl(win.body.querySelector('[data-disp-ok]'));
  engine.closeWindow('display-props');
}

/**
 * 7. Internet Explorer 6 — Classic 2002 Google Search
 */
export async function ie6WebSurfing(engine) {
  engine.setStatus('Internet Explorer 6 — Browsing 2002 Web');
  engine.closeAllWindows();

  await engine.selectDeskIcon('ie6', { doubleClick: true });
  await engine.wait(200);

  const win = engine.createWindow({
    id: 'ie6',
    title: 'Google - Microsoft Internet Explorer',
    icon: XP_ICONS.ie6,
    width: 600,
    height: 385,
    menus: ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'],
    bodyHtml: `
      <div style="background:#ece9d8;border-bottom:1px solid #b5b0a2;padding:5px 8px;display:flex;align-items:center;gap:6px;">
        <span class="xp-btn" style="padding:2px 8px;">◀ Back</span>
        <span class="xp-btn" style="padding:2px 8px;">▶</span>
        <span style="font-size:11px;color:#555;">Address</span>
        <div data-ie-url style="flex:1;background:#fff;border:1px solid #7f9db9;padding:2px 7px;font-size:11px;">http://www.google.com/</div>
        <span class="xp-btn" style="padding:2px 8px;" data-ie-go>Go</span>
      </div>
      <div data-ie-page style="flex:1;background:#ffffff;padding:22px 26px;overflow:hidden;font-family:Arial,sans-serif;">
        <div style="text-align:center;margin-top:16px;">
          <div style="font-family:Georgia,serif;font-size:48px;font-weight:700;letter-spacing:-2px;">
            <span style="color:#1b46c8;">G</span><span style="color:#d62d20;">o</span><span style="color:#ffa700;">o</span><span style="color:#1b46c8;">g</span><span style="color:#008744;">l</span><span style="color:#d62d20;">e</span>
          </div>
          <div style="margin:14px auto;width:320px;border:1px solid #7f9db9;padding:5px 8px;text-align:left;min-height:18px;font-size:12px;" data-ie-q></div>
          <div style="display:flex;justify-content:center;gap:10px;">
            <span class="xp-btn" data-ie-search>Google Search</span>
            <span class="xp-btn">I'm Feeling Lucky</span>
          </div>
          <div style="margin-top:24px;font-size:11px;color:#666;">Searching 2,073,418,204 web pages · ${formatLongDate()}</div>
        </div>
      </div>
    `,
  });

  const qEl = win.body.querySelector('[data-ie-q]');
  const searchBtn = win.body.querySelector('[data-ie-search]');
  const pageEl = win.body.querySelector('[data-ie-page]');
  const urlEl = win.body.querySelector('[data-ie-url]');

  await engine.wait(450);
  engine.setCursorKind('ibeam');
  await engine.moveToEl(qEl);
  await engine.typeText(qEl, 'windows xp bliss wallpaper location', { charMs: 40 });
  engine.setCursorKind('arrow');
  await engine.clickEl(searchBtn);

  urlEl.textContent = 'http://www.google.com/search?q=windows+xp+bliss+wallpaper+location';
  pageEl.innerHTML = `
    <div style="border-bottom:1px solid #3366cc;padding-bottom:6px;margin-bottom:12px;display:flex;justify-content:space-between;font-size:11px;">
      <span><strong>Web</strong> · Results 1 - 3 of about 42,800 for <strong>windows xp bliss</strong></span>
      <span>(0.14 seconds)</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;font-size:12px;">
      <div>
        <div style="color:#0000cc;text-decoration:underline;font-weight:700;">Bliss — Sonoma County, California (Charles O'Rear, 1996)</div>
        <div>Photographed along Highway 12/121 in Sonoma County with a Mamiya RZ67 medium-format camera…</div>
        <div style="color:#008000;font-size:11px;">www.microsoft.com/windowsxp/bliss/ - 14k - Cached</div>
      </div>
      <div>
        <div style="color:#0000cc;text-decoration:underline;font-weight:700;">Customize Windows XP: Luna Blue, Olive Green &amp; Silver</div>
        <div>Explore official Windows XP visual styles, ClearType fonts, and 3D OpenGL screensavers…</div>
        <div style="color:#008000;font-size:11px;">www.winsupersite.com/xp/luna.asp - 28k - Cached</div>
      </div>
    </div>
  `;

  await engine.wait(1550);
  await engine.clickCloseWindow('ie6');
}

/**
 * 8. Fullscreen 3D Pipes Screensaver Cameo!
 */
export async function xp3DPipesSaver(engine) {
  engine.setStatus('Windows XP Screensaver — 3D Pipes');
  engine.closeAllWindows();

  const overlay = document.createElement('div');
  overlay.className = 'xp-pipes-overlay';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%;height:100%;display:block;';
  overlay.appendChild(canvas);
  engine.root.appendChild(overlay);
  engine.overlayEl = overlay;

  const W = (canvas.width = window.innerWidth || 1280);
  const H = (canvas.height = window.innerHeight || 720);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  const palette = ['#2892ff', '#ff3b30', '#34c759', '#ffcc00', '#af52de', '#00d4ff'];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [0.7, -0.45],
    [-0.7, 0.45],
  ];

  const drawJoint = (x, y, r, color) => {
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, 1, x, y, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.45, color);
    g.addColorStop(1, '#101420');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  try {
    let pipeColor = palette[0];
    let x = W * 0.5;
    let y = H * 0.5;
    let dir = dirs[0];

    for (let step = 0; step < 96; step++) {
      engine.checkAbort();
      while (engine.paused) await engine.wait(40);

      if (step % 18 === 0) {
        pipeColor = palette[Math.floor(step / 18) % palette.length];
        x = W * (0.2 + Math.random() * 0.6);
        y = H * (0.2 + Math.random() * 0.6);
        drawJoint(x, y, 13, pipeColor);
      }

      const len = 36 + Math.random() * 44;
      let nx = x + dir[0] * len;
      let ny = y + dir[1] * len;
      if (nx < 60 || nx > W - 60 || ny < 60 || ny > H - 60) {
        dir = dirs[Math.floor(Math.random() * dirs.length)];
        nx = Math.max(70, Math.min(W - 70, x + dir[0] * len));
        ny = Math.max(70, Math.min(H - 70, y + dir[1] * len));
      }

      // Draw glossy 3D cylinder segment
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0d1018';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      ctx.strokeStyle = pipeColor;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x - 2, y - 2);
      ctx.lineTo(nx - 2, ny - 2);
      ctx.stroke();

      drawJoint(nx, ny, 11, pipeColor);
      x = nx;
      y = ny;
      dir = dirs[Math.floor(Math.random() * dirs.length)];
      await engine.wait(55);
    }

    await engine.wait(600);
    overlay.classList.add('fade-out');
    await engine.wait(480);
  } finally {
    overlay.remove();
    engine.overlayEl = null;
  }
}

/**
 * 9. Classic XP Error Dialog Cascade Easter Egg!
 */
export async function errorCascade(engine) {
  engine.setStatus('Windows XP — Classic Error Cascade');
  engine.closeAllWindows();

  const trail = [];
  const { w, h } = engine.getStageSize();
  let x = Math.max(80, Math.round(w * 0.25));
  let y = Math.max(60, Math.round(h * 0.16));
  let vx = 18;
  let vy = 16;

  try {
    engine.sounds.xpError();
    for (let i = 0; i < 16; i++) {
      engine.checkAbort();
      const d = document.createElement('div');
      d.className = 'xp-win active';
      d.style.cssText = `width:440px;height:168px;left:${x}px;top:${y}px;z-index:${200 + i};`;
      d.innerHTML = `
        <div class="xp-titlebar">
          <span class="xp-title-text">Notepad</span>
          <div class="xp-cap-btns"><div class="xp-cap close">×</div></div>
        </div>
        <div class="xp-body" style="background:#ece9d8;padding:12px 14px;justify-content:space-between;">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <div style="width:30px;height:30px;flex-shrink:0;">${XP_ICONS.errorIcon}</div>
            <div style="font-size:11.5px;line-height:1.35;">
              <div>Notepad has encountered a problem and needs to close. We are sorry for the inconvenience.</div>
              <div style="margin-top:6px;">If you were in the middle of something, the information you were working on might be lost.</div>
            </div>
          </div>
          <div style="display:flex;justify-content:center;gap:8px;">
            <span class="xp-btn default" data-ok>Send Error Report</span>
            <span class="xp-btn">Don't Send</span>
          </div>
        </div>
      `;
      engine.windowsEl.appendChild(d);
      trail.push(d);
      if (i % 4 === 0 && i > 0) engine.sounds.xpError();
      x += vx;
      y += vy;
      if (x + 450 > w) vx = -Math.abs(vx);
      if (y + 186 > h) vy = -Math.abs(vy);
      await engine.wait(95);
    }

    await engine.wait(1100);
    const lastOk = trail[trail.length - 1]?.querySelector('[data-ok]');
    if (lastOk) await engine.clickEl(lastOk);
  } finally {
    trail.forEach((n) => n.remove());
  }
}

export const REGULAR_VIGNETTES = [
  aimInstantMessage,
  winampClassic,
  spaceCadetPinball,
  msPaintXp,
  myComputerAndRecycle,
  displayPropertiesLuna,
  ie6WebSurfing,
  xp3DPipesSaver,
];

export const SPECIAL_VIGNETTES = {
  'xp-boot': xpBootAndWelcome,
  pinball: spaceCadetPinball,
  winamp: winampClassic,
  aim: aimInstantMessage,
  'pipes-3d': xp3DPipesSaver,
  'error-cascade': errorCascade,
};
