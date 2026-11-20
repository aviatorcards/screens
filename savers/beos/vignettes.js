import {
  NOTES_HTML,
  WELCOME_HTML,
  iconEl,
  openAbout,
  openAlert,
  openBackgrounds,
  openFind,
  openMediaPlayer,
  openNetPositive,
  openResults,
  openStyledEdit,
  openTerminal,
  openTracker,
  showPage,
  termInsert,
  DESK_COLORS,
} from './apps.js';

export async function playBootSequence(engine, signal) {
  engine.onStatus('BeOS — Starting up');
  engine.showBoot();
  await engine.wait(420, signal);
  const count = engine.bootRow.children.length;
  for (let i = 0; i < count; i++) {
    engine.setBootIcon(i, true);
    if (i === 0) engine.hideBootHint();
    await engine.wait(260, signal);
  }
  await engine.wait(380, signal);
  engine.hideBoot();
  engine.sounds.startup();
  engine.setCursorVisible(true);
  engine.onStatus('Tracker — On the desk');
  await engine.wait(280, signal);
}

async function trackerHome(engine, signal) {
  engine.onStatus('Tracker — Opening the boot disk');
  engine.resetDesk();
  await engine.wait(280, signal);
  await engine.doubleClick(engine.desktopIcon('volume'), signal);
  const disk = openTracker(engine, 'volume');
  await engine.wait(520, signal);
  await engine.doubleClick(iconEl(disk, 'home'), signal);
  const home = openTracker(engine, 'home');
  await engine.wait(420, signal);
  const readme = iconEl(home, 'ReadMe.txt');
  await engine.click(readme, {}, signal);
  engine.selectItem(readme);
  await engine.wait(360, signal);
  await engine.click(home.zoomBtn, { pressClass: 'pressed' }, signal);
  engine.zoomWindow(home);
  await engine.wait(500, signal);
  await engine.click(home.zoomBtn, { pressClass: 'pressed' }, signal);
  engine.zoomWindow(home);
  await engine.moveWindow(home, home.el.offsetLeft + 36, home.el.offsetTop + 18, 480, signal);
  await engine.wait(420, signal);
}

async function styledEdit(engine, signal) {
  engine.onStatus('StyledEdit — ReadMe.txt');
  engine.resetDesk();
  await engine.wait(240, signal);
  await engine.doubleClick(engine.desktopIcon('volume'), signal);
  const disk = openTracker(engine, 'volume');
  await engine.wait(360, signal);
  await engine.doubleClick(iconEl(disk, 'home'), signal);
  const home = openTracker(engine, 'home');
  await engine.wait(300, signal);
  await engine.doubleClick(iconEl(home, 'ReadMe.txt'), signal);
  const edit = openStyledEdit(engine, 'ReadMe.txt');
  await engine.wait(500, signal);
  await engine.click(edit.docEl, { rx: 0.7, ry: 0.72 }, signal);
  await engine.typeText(edit.docEl, '\nNetPositive still opens the local welcome page.\n', signal);
  await engine.wait(280, signal);
  await engine.openWindowMenu(edit, 'File', 'Save', signal);
  await engine.wait(640, signal);
}

async function terminalSession(engine, signal) {
  engine.onStatus('Terminal — desk:/boot/home');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openBeMenu(['Applications', 'Terminal'], signal);
  const win = openTerminal(engine);
  await engine.wait(360, signal);
  await engine.click(win.termEl, { rx: 0.2, ry: 0.2 }, signal);
  await engine.typeText(win.termEl, 'ls', signal);
  termInsert(win, '\nDesktop  config  mail  ReadMe.txt  sample.wav\ndesk:/boot/home$ ');
  await engine.wait(420, signal);
  await engine.typeText(win.termEl, 'uname -a', signal);
  termInsert(win, '\nBeOS desk 5.0 1000009 BePC BeOS\ndesk:/boot/home$ ');
  await engine.wait(420, signal);
  await engine.typeText(win.termEl, 'df', signal);
  termInsert(win, '\nMount      Type   Total   Free\n/boot      bfs    2047M   1612M\ndesk:/boot/home$ ');
  await engine.wait(700, signal);
}

async function netpositiveBrowse(engine, signal) {
  engine.onStatus('NetPositive — Local welcome');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openBeMenu(['Applications', 'NetPositive'], signal);
  const win = openNetPositive(engine);
  await engine.wait(280, signal);
  await engine.click(win.urlEl, {}, signal);
  win.statusEl.textContent = 'Resolving…';
  win.throbEl.classList.add('spin');
  await engine.typeValue(win.urlEl, WELCOME_HTML.url, signal);
  await engine.wait(360, signal);
  win.statusEl.textContent = 'Transferring welcome.html…';
  await engine.wait(700, signal);
  engine.setTitle(win, WELCOME_HTML.title);
  showPage(win, WELCOME_HTML);
  await engine.wait(500, signal);
  await engine.animate(900, (t) => {
    const room = win.pageEl.scrollHeight - win.pageEl.clientHeight;
    win.pageEl.scrollTop = room * t * 0.55;
  }, signal);
  await engine.wait(400, signal);
  const link = win.pageEl.querySelector('[data-np="notes"]');
  await engine.click(link, {}, signal);
  win.throbEl.classList.add('spin');
  win.statusEl.textContent = 'Transferring notes.html…';
  await engine.wait(520, signal);
  engine.setTitle(win, NOTES_HTML.title);
  win.urlEl.value = NOTES_HTML.url;
  showPage(win, NOTES_HTML);
  await engine.wait(900, signal);
}

async function mediaPlayer(engine, signal) {
  engine.onStatus('MediaPlayer — sample.wav');
  engine.resetDesk();
  await engine.wait(220, signal);
  await engine.doubleClick(engine.desktopIcon('volume'), signal);
  const disk = openTracker(engine, 'volume');
  await engine.wait(280, signal);
  await engine.doubleClick(iconEl(disk, 'home'), signal);
  const home = openTracker(engine, 'home');
  await engine.wait(260, signal);
  await engine.doubleClick(iconEl(home, 'sample.wav'), signal);
  const win = openMediaPlayer(engine);
  await engine.wait(320, signal);
  await engine.click(win.playBtn, { pressClass: 'pressed' }, signal);
  win.playBtn.textContent = '❚❚';
  await engine.animate(4800, (t) => {
    win.knob.style.left = `${t * 100}%`;
    const sec = Math.min(16, Math.floor(t * 16));
    win.timeEl.textContent = `0:${String(sec).padStart(2, '0')}`;
    const lit = Math.floor(t * win.bars.length);
    win.bars.forEach((bar, i) => bar.classList.toggle('past', i <= lit));
  }, signal);
  win.playBtn.textContent = '▶';
  await engine.wait(420, signal);
}

async function aboutBeos(engine, signal) {
  engine.onStatus('BeOS — About this system');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openBeMenu(['About BeOS…'], signal);
  const win = openAbout(engine);
  engine.sounds.menu();
  await engine.wait(1600, signal);
  await engine.click(win.closeBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(win);
  await engine.wait(280, signal);
}

async function backgrounds(engine, signal) {
  engine.onStatus('Backgrounds — Desk color');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openBeMenu(['Preferences', 'Backgrounds'], signal);
  const win = openBackgrounds(engine);
  await engine.wait(360, signal);
  const leaf = win.el.querySelector('[data-color="leaf"]');
  await engine.click(leaf, { pressClass: 'pressed' }, signal);
  win.el.querySelectorAll('.beos-swatch').forEach((swatch) => swatch.classList.toggle('on', swatch === leaf));
  await engine.wait(200, signal);
  await engine.click(win.applyBtn, { pressClass: 'pressed' }, signal);
  engine.setDeskBackground(DESK_COLORS.find((color) => color.id === 'leaf').bg);
  await engine.wait(900, signal);
  const be = win.el.querySelector('[data-color="be"]');
  await engine.click(be, { pressClass: 'pressed' }, signal);
  win.el.querySelectorAll('.beos-swatch').forEach((swatch) => swatch.classList.toggle('on', swatch === be));
  await engine.click(win.applyBtn, { pressClass: 'pressed' }, signal);
  engine.setDeskBackground(DESK_COLORS.find((color) => color.id === 'be').bg);
  await engine.wait(420, signal);
}

async function findQuery(engine, signal) {
  engine.onStatus('Find — ReadMe.txt');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openBeMenu(['Find…'], signal);
  const find = openFind(engine);
  await engine.wait(240, signal);
  await engine.click(find.queryEl, {}, signal);
  await engine.typeValue(find.queryEl, 'Read', signal);
  await engine.wait(180, signal);
  await engine.click(find.searchBtn, { pressClass: 'pressed' }, signal);
  const results = openResults(engine, 'Read');
  await engine.wait(420, signal);
  const row = iconEl(results, 'ReadMe.txt');
  await engine.doubleClick(row, signal);
  openStyledEdit(engine, 'ReadMe.txt');
  await engine.wait(900, signal);
}

async function appsFolder(engine, signal) {
  engine.onStatus('Tracker — apps');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.doubleClick(engine.desktopIcon('volume'), signal);
  const disk = openTracker(engine, 'volume');
  await engine.wait(360, signal);
  await engine.doubleClick(iconEl(disk, 'apps'), signal);
  const apps = openTracker(engine, 'apps');
  await engine.wait(300, signal);
  for (const name of ['StyledEdit', 'Terminal', 'NetPositive', 'MediaPlayer']) {
    const icon = iconEl(apps, name);
    await engine.click(icon, {}, signal);
    engine.selectItem(icon);
    await engine.wait(220, signal);
  }
  await engine.wait(360, signal);
}

async function idleGlance(engine, signal) {
  engine.onStatus('Tracker — Between tasks');
  engine.resetDesk();
  await engine.wait(300, signal);
  await engine.moveToElement(engine.clockEl, 0.5, 0.5, null, signal);
  await engine.wait(400, signal);
  await engine.click(engine.desktopIcon('volume'), {}, signal);
  engine.selectItem(engine.desktopIcon('volume'));
  await engine.wait(360, signal);
  await engine.moveToElement(engine.desktopIcon('trash'), 0.5, 0.35, null, signal);
  await engine.wait(300, signal);
  await engine.moveToElement(engine.workspaceButton(2), 0.5, 0.5, null, signal);
  await engine.wait(280, signal);
  await engine.moveToElement(engine.workspaceButton(1), 0.5, 0.5, null, signal);
  await engine.wait(420, signal);
}

async function switchWorkspace(engine, signal) {
  engine.onStatus('Workspaces — Desk 2');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.click(engine.workspaceButton(2), { pressClass: 'pressed' }, signal);
  engine.setWorkspace(2);
  await engine.wait(280, signal);
  const win = openTerminal(engine, { workspace: 2 });
  await engine.wait(240, signal);
  await engine.click(win.termEl, { rx: 0.25, ry: 0.3 }, signal);
  await engine.typeText(win.termEl, 'uname -a', signal);
  termInsert(win, '\nBeOS desk 5.0 1000009 BePC BeOS\ndesk:/boot/home$ ');
  await engine.wait(800, signal);
  await engine.click(engine.workspaceButton(1), { pressClass: 'pressed' }, signal);
  engine.setWorkspace(1);
  engine.onStatus('Workspaces — Desk 1');
  await engine.wait(500, signal);
}

async function restartSystem(engine, signal) {
  engine.onStatus('BeOS — Restart');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.openBeMenu(['Restart'], signal);
  const alert = openAlert(engine, {
    title: 'Restart',
    text: 'Are you sure you want to restart the system?',
    ok: 'Restart',
  });
  engine.sounds.alert();
  await engine.wait(700, signal);
  await engine.click(alert.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeAllWindows();
  await playBootSequence(engine, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'tracker-home', run: trackerHome },
  { id: 'stylededit-readme', run: styledEdit },
  { id: 'terminal-session', run: terminalSession },
  { id: 'netpositive-browse', run: netpositiveBrowse },
  { id: 'mediaplayer-play', run: mediaPlayer },
  { id: 'about-beos', run: aboutBeos },
  { id: 'backgrounds', run: backgrounds },
  { id: 'find-query', run: findQuery },
  { id: 'apps-folder', run: appsFolder },
  { id: 'idle-glance', run: idleGlance },
];

export const SPECIAL_VIGNETTES = {
  about: aboutBeos,
  workspaces: switchWorkspace,
  find: findQuery,
  restart: restartSystem,
};
