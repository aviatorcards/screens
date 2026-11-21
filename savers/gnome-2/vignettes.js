import {
  nautilusBack,
  nautilusGo,
  openAbout,
  openCalculator,
  openEpiphany,
  openGedit,
  openLogout,
  openNautilus,
  openRun,
  openSearch,
  openTerminal,
  showEpiphanyPage,
  termInsert,
} from './apps.js';

function stamp() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function playBootSequence(engine, signal) {
  engine.onStatus('GNOME — Starting up');
  engine.showBoot();
  await engine.wait(360, signal);
  const count = engine.bootRow.children.length;
  for (let i = 0; i < count; i++) {
    engine.setBootIcon(i, true);
    await engine.wait(240, signal);
  }
  await engine.wait(320, signal);
  engine.hideBoot();
  engine.sounds.startup();
  engine.setCursorVisible(true);
  engine.onStatus('GNOME 2.4 — On the desk');
  await engine.wait(240, signal);
}

async function nautilusHome(engine, signal) {
  engine.onStatus('Nautilus — Home');
  engine.resetDesk();
  await engine.wait(240, signal);
  await engine.doubleClick(engine.desktopIcon('home'), signal);
  const win = openNautilus(engine, 'home');
  await engine.wait(420, signal);
  const start = win.treeEl.querySelector('[data-place="start"]');
  await engine.click(start, {}, signal);
  nautilusGo(engine, win, 'start');
  await engine.wait(360, signal);
  const prefs = win.viewEl.querySelector('[data-id="preferences"]');
  await engine.doubleClick(prefs, signal);
  nautilusGo(engine, win, 'prefs');
  await engine.wait(480, signal);
  await engine.click(win.backBtn, { pressClass: 'pressed' }, signal);
  nautilusBack(engine, win);
  await engine.wait(280, signal);
  await engine.openWindowList(signal);
  await engine.placeWindow(win, 0.78, 0.1, 640, signal);
  await engine.wait(280, signal);
}

async function geditNote(engine, signal) {
  engine.onStatus('gedit — notes.txt');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openApplications(['Accessories', 'Text Editor'], signal);
  const win = openGedit(engine);
  await engine.wait(360, signal);
  await engine.click(win.docEl, { rx: 0.4, ry: 0.55 }, signal);
  const lines = [
    'The workspace switcher sits on the bottom panel.',
    'Epiphany still opens the local welcome page.',
    'Nautilus is showing the home folder.',
  ];
  const line = lines[Math.floor(Math.random() * lines.length)];
  await engine.typeText(win.docEl, `\n${stamp()} — ${line}\n`, signal);
  await engine.wait(240, signal);
  await engine.openWindowMenu(win, 'File', 'Save', signal);
  win.statusEl.textContent = 'Saved notes.txt';
  await engine.wait(240, signal);
  await engine.placeWindow(win, 0.28, 0.5, 600, signal);
  await engine.wait(280, signal);
}

async function epiphanyBrowse(engine, signal) {
  engine.onStatus('Epiphany — welcome.html');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openApplications(['Internet', 'Web Browser'], signal);
  const win = openEpiphany(engine);
  await engine.wait(280, signal);
  await engine.click(win.urlEl, {}, signal);
  await engine.typeValue(win.urlEl, 'file:///home/user/welcome.html', signal);
  win.throbEl.classList.add('spin');
  win.statusEl.textContent = 'Opening welcome.html…';
  await engine.wait(700, signal);
  showEpiphanyPage(engine, win);
  await engine.animate(800, (t) => {
    const room = win.pageEl.scrollHeight - win.pageEl.clientHeight;
    win.pageEl.scrollTop = room * t;
  }, signal);
  await engine.wait(280, signal);
  await engine.placeWindow(win, 0.92, 0.16, 640, signal);
  await engine.wait(280, signal);
}

async function terminalSession(engine, signal) {
  engine.onStatus('Terminal — /home/user');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.click(engine.termLaunch, { pressClass: 'pressed' }, signal);
  const win = openTerminal(engine);
  await engine.wait(300, signal);
  await engine.click(win.termEl, { rx: 0.3, ry: 0.3 }, signal);
  await engine.typeText(win.termEl, 'pwd', signal);
  termInsert(win, '\n/home/user\nuser@desk:~$ ');
  await engine.wait(360, signal);
  await engine.typeText(win.termEl, 'ls', signal);
  termInsert(win, '\nDesktop  notes.txt  welcome.html\nuser@desk:~$ ');
  await engine.wait(240, signal);
  await engine.placeWindow(win, 0.58, 0.4, 600, signal);
  await engine.wait(280, signal);
}

async function calculator(engine, signal) {
  engine.onStatus('Calculator — Basic, left to right');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openApplications(['Accessories', 'Calculator'], signal);
  const win = openCalculator(engine);
  await engine.wait(280, signal);
  let acc = null;
  let op = null;
  let current = '';
  const apply = (symbol, a, b) => (symbol === '+' ? a + b : a * b);
  const press = async (key) => {
    const btn = win.el.querySelector(`[data-key="${key}"]`);
    await engine.click(btn, { pressClass: 'pressed' }, signal);
    if (key >= '0' && key <= '9') {
      current += key;
      win.display.textContent = current;
      return;
    }
    if (key === '+' || key === '*') {
      if (op) acc = apply(op, acc, Number(current || '0'));
      else acc = Number(current || '0');
      op = key;
      current = '';
      win.display.textContent = String(acc);
      return;
    }
    if (key === '=') {
      const value = apply(op, acc, Number(current || '0'));
      win.display.textContent = String(value);
    }
  };
  for (const key of ['2', '+', '3', '*', '4', '=']) await press(key);
  await engine.wait(200, signal);
  await engine.placeWindow(win, 1, 0.78, 560, signal);
  await engine.wait(280, signal);
}

async function runApplication(engine, signal) {
  engine.onStatus('Run Application — gcalctool');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openActions(['Run Application'], signal);
  const win = openRun(engine);
  engine.sounds.menu();
  await engine.wait(240, signal);
  await engine.click(win.input, {}, signal);
  await engine.typeValue(win.input, 'gcalctool', signal);
  await engine.wait(200, signal);
  await engine.click(win.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(win);
  const calc = openCalculator(engine);
  await engine.wait(240, signal);
  await engine.placeWindow(calc, 0.86, 0.48, 560, signal);
  await engine.wait(280, signal);
}

async function searchFiles(engine, signal) {
  engine.onStatus('Search for Files — notes.txt');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openActions(['Search for Files'], signal);
  const win = openSearch(engine);
  await engine.wait(240, signal);
  await engine.click(win.nameEl, {}, signal);
  await engine.typeValue(win.nameEl, 'notes', signal);
  await engine.wait(200, signal);
  await engine.click(win.findBtn, { pressClass: 'pressed' }, signal);
  await engine.wait(420, signal);
  const hit = document.createElement('div');
  hit.className = 'gnome-hit';
  const name = document.createElement('b');
  name.textContent = 'notes.txt';
  hit.append(name, document.createTextNode('  /home/user/notes.txt'));
  win.resultsEl.appendChild(hit);
  await engine.wait(240, signal);
  await engine.placeWindow(win, 0.62, 0.34, 520, signal);
  await engine.wait(280, signal);
}

async function showDesktop(engine, signal) {
  engine.onStatus('Show Desktop');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.doubleClick(engine.desktopIcon('home'), signal);
  openNautilus(engine, 'home');
  await engine.wait(400, signal);
  await engine.click(engine.showDeskBtn, { pressClass: 'pressed' }, signal);
  engine.showDesktop();
  await engine.wait(700, signal);
  await engine.click(engine.showDeskBtn, { pressClass: 'pressed' }, signal);
  engine.showDesktop();
  await engine.wait(500, signal);
}

async function clockCalendar(engine, signal) {
  engine.onStatus('Clock — Calendar');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.click(engine.clockEl, {}, signal);
  engine.showCalendar();
  await engine.wait(360, signal);
  const today = engine.calendar.querySelector('.is-today');
  if (today) await engine.click(today, {}, signal);
  await engine.wait(500, signal);
  await engine.click(engine.clockEl, {}, signal);
  engine.hideCalendar();
  await engine.wait(280, signal);
}

async function arrangeWindows(engine, signal) {
  engine.onStatus('GNOME — Moving windows');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.openApplications(['Accessories', 'Text Editor'], signal);
  const note = openGedit(engine);
  await engine.wait(220, signal);
  await engine.placeWindow(note, 0.02, 0.62, 700, signal);
  await engine.wait(160, signal);
  await engine.openApplications(['Accessories', 'Calculator'], signal);
  const calc = openCalculator(engine);
  await engine.wait(200, signal);
  await engine.placeWindow(calc, 1, 0.06, 640, signal);
  await engine.wait(420, signal);
}

async function idleGlance(engine, signal) {
  engine.onStatus('GNOME — Between tasks');
  engine.resetDesk();
  await engine.wait(240, signal);
  await engine.moveToElement(engine.footBtn, 0.5, 0.5, null, signal);
  await engine.wait(280, signal);
  await engine.moveToElement(engine.volumeBtn, 0.5, 0.5, null, signal);
  await engine.wait(280, signal);
  await engine.moveToElement(engine.desktopIcon('trash'), 0.5, 0.35, null, signal);
  await engine.wait(240, signal);
  await engine.moveToElement(engine.workspaceButton(2), 0.5, 0.5, null, signal);
  await engine.wait(200, signal);
  await engine.moveToElement(engine.workspaceButton(1), 0.5, 0.5, null, signal);
  await engine.wait(360, signal);
}

async function aboutGnome(engine, signal) {
  engine.onStatus('About GNOME');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openFoot(['Run Application'], signal);
  const run = openRun(engine);
  await engine.wait(200, signal);
  await engine.click(run.input, {}, signal);
  await engine.typeValue(run.input, 'gnome-about', signal);
  await engine.wait(180, signal);
  await engine.click(run.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(run);
  const win = openAbout(engine);
  engine.sounds.menu();
  await engine.wait(1500, signal);
  await engine.click(win.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(win);
  await engine.wait(240, signal);
}

async function lockScreen(engine, signal) {
  engine.onStatus('Lock Screen');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.openActions(['Lock Screen'], signal);
  engine.showLock();
  engine.sounds.alert();
  await engine.wait(360, signal);
  await engine.click(engine.lockField, {}, signal);
  await engine.typeValue(engine.lockField, 'session', signal);
  await engine.wait(700, signal);
  engine.hideLock();
  await engine.wait(280, signal);
}

async function switchWorkspace(engine, signal) {
  engine.onStatus('Workspaces — Desk 2');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.click(engine.workspaceButton(2), { pressClass: 'pressed' }, signal);
  engine.setWorkspace(2);
  await engine.wait(240, signal);
  await engine.click(engine.termLaunch, { pressClass: 'pressed' }, signal);
  const win = openTerminal(engine);
  await engine.wait(200, signal);
  await engine.click(win.termEl, { rx: 0.25, ry: 0.3 }, signal);
  await engine.typeText(win.termEl, 'pwd', signal);
  termInsert(win, '\n/home/user\nuser@desk:~$ ');
  await engine.wait(240, signal);
  await engine.placeWindow(win, 0.7, 0.22, 560, signal);
  await engine.wait(240, signal);
  await engine.click(engine.workspaceButton(1), { pressClass: 'pressed' }, signal);
  engine.setWorkspace(1);
  engine.onStatus('Workspaces — Desk 1');
  await engine.wait(420, signal);
  await engine.click(engine.workspaceButton(2), { pressClass: 'pressed' }, signal);
  engine.setWorkspace(2);
  await engine.wait(500, signal);
  await engine.click(engine.workspaceButton(1), { pressClass: 'pressed' }, signal);
  engine.setWorkspace(1);
  await engine.wait(280, signal);
}

async function logOut(engine, signal) {
  engine.onStatus('GNOME — Log Out');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.openActions(['Log Out'], signal);
  const win = openLogout(engine);
  engine.sounds.alert();
  await engine.wait(640, signal);
  await engine.click(win.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeAllWindows();
  await playBootSequence(engine, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'nautilus-home', run: nautilusHome },
  { id: 'gedit-note', run: geditNote },
  { id: 'arrange-windows', run: arrangeWindows },
  { id: 'epiphany-browse', run: epiphanyBrowse },
  { id: 'terminal-session', run: terminalSession },
  { id: 'calculator', run: calculator },
  { id: 'run-application', run: runApplication },
  { id: 'search-files', run: searchFiles },
  { id: 'show-desktop', run: showDesktop },
  { id: 'clock-calendar', run: clockCalendar },
  { id: 'idle-glance', run: idleGlance },
];

export const SPECIAL_VIGNETTES = {
  about: aboutGnome,
  lock: lockScreen,
  workspaces: switchWorkspace,
  logout: logOut,
};
