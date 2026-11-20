import {
  konqAddTab,
  konqSelect,
  konqShow,
  openAbout,
  openFind,
  openKCalc,
  openKWrite,
  openKonqueror,
  openKonsole,
  openLogout,
  openRun,
  openTrash,
  termInsert,
} from './apps.js';

function stamp() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function playBootSequence(engine, signal) {
  engine.onStatus('KDE — Starting up');
  engine.showBoot();
  await engine.wait(280, signal);
  await engine.animate(1100, (t) => engine.setBootProgress(t), signal);
  await engine.wait(280, signal);
  engine.hideBoot();
  engine.sounds.startup();
  engine.setCursorVisible(true);
  engine.onStatus('KDE 3.1 — On the desk');
  await engine.wait(240, signal);
}

async function konquerorBrowse(engine, signal) {
  engine.onStatus('Konqueror — file:/home/user');
  engine.resetDesk();
  await engine.wait(220, signal);
  await engine.openKMenu(['Internet', 'Web Browser'], signal);
  const win = openKonqueror(engine);
  await engine.wait(280, signal);
  await engine.click(win.locEl, {}, signal);
  await engine.typeValue(win.locEl, 'file:/home/user', signal);
  await engine.wait(420, signal);
  konqShow(engine, win, { title: 'user', url: 'file:/home/user', kind: 'dir' });
  await engine.wait(500, signal);
  await engine.openWindowMenu(win, 'Window', 'New Tab', signal);
  konqAddTab(engine, win);
  await engine.wait(200, signal);
  await engine.click(win.locEl, {}, signal);
  await engine.typeValue(win.locEl, 'file:/home/user/welcome.html', signal);
  await engine.wait(480, signal);
  konqShow(engine, win, { title: 'welcome.html', url: 'file:/home/user/welcome.html', kind: 'html' });
  await engine.wait(700, signal);
  const first = win.tabsEl.querySelector('[data-tab="0"]');
  await engine.click(first, {}, signal);
  konqSelect(engine, win, 0);
  await engine.wait(420, signal);
  const second = win.tabsEl.querySelector('[data-tab="1"]');
  await engine.click(second, {}, signal);
  konqSelect(engine, win, 1);
  await engine.wait(240, signal);
  await engine.placeWindow(win, 0.8, 0.08, 640, signal);
  await engine.wait(280, signal);
}

async function kwriteNote(engine, signal) {
  engine.onStatus('KWrite — notes.txt');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openKMenu(['Utilities', 'Text Editor'], signal);
  const win = openKWrite(engine);
  await engine.wait(320, signal);
  await engine.click(win.docEl, { rx: 0.4, ry: 0.55 }, signal);
  await engine.typeText(win.docEl, `\n${stamp()} — This note stays in the home folder.\n`, signal);
  await engine.wait(240, signal);
  await engine.openWindowMenu(win, 'File', 'Save', signal);
  await engine.wait(220, signal);
  await engine.placeWindow(win, 0.2, 0.52, 600, signal);
  await engine.wait(280, signal);
}

async function konsoleSession(engine, signal) {
  engine.onStatus('Konsole — /home/user');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.openKMenu(['Run Command…'], signal);
  const run = openRun(engine);
  await engine.wait(220, signal);
  await engine.click(run.input, {}, signal);
  await engine.typeValue(run.input, 'konsole', signal);
  await engine.wait(180, signal);
  await engine.click(run.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(run);
  const win = openKonsole(engine);
  await engine.wait(280, signal);
  await engine.click(win.termEl, { rx: 0.3, ry: 0.35 }, signal);
  await engine.typeText(win.termEl, 'pwd', signal);
  termInsert(win, '\n/home/user\nuser@desk:~$ ');
  await engine.wait(320, signal);
  await engine.typeText(win.termEl, 'ls', signal);
  termInsert(win, '\nDesktop  notes.txt  welcome.html\nuser@desk:~$ ');
  await engine.wait(220, signal);
  await engine.placeWindow(win, 0.6, 0.36, 600, signal);
  await engine.wait(280, signal);
}

async function calculator(engine, signal) {
  engine.onStatus('KCalc');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.openKMenu(['Utilities', 'Calculator'], signal);
  const win = openKCalc(engine);
  await engine.wait(240, signal);
  let current = '';
  let acc = null;
  const press = async (key) => {
    const btn = win.el.querySelector(`[data-key="${key}"]`);
    await engine.click(btn, { pressClass: 'pressed' }, signal);
    if (key >= '0' && key <= '9') {
      current += key;
      win.display.textContent = current;
      return;
    }
    if (key === '*') {
      acc = Number(current || '0');
      current = '';
      return;
    }
    if (key === '=') win.display.textContent = String(acc * Number(current || '0'));
  };
  for (const key of ['1', '0', '2', '4', '*', '2', '=']) await press(key);
  await engine.wait(200, signal);
  await engine.placeWindow(win, 1, 0.72, 560, signal);
  await engine.wait(280, signal);
}

async function findFiles(engine, signal) {
  engine.onStatus('Find Files — notes.txt');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.openKMenu(['Find Files'], signal);
  const win = openFind(engine);
  await engine.wait(220, signal);
  await engine.click(win.nameEl, {}, signal);
  await engine.typeValue(win.nameEl, 'notes.txt', signal);
  await engine.wait(180, signal);
  await engine.click(win.findBtn, { pressClass: 'pressed' }, signal);
  await engine.wait(400, signal);
  const hit = document.createElement('div');
  hit.className = 'kde-hit';
  hit.textContent = '/home/user/notes.txt';
  win.resultsEl.appendChild(hit);
  await engine.wait(220, signal);
  await engine.placeWindow(win, 0.08, 0.58, 520, signal);
  await engine.wait(280, signal);
}

async function trashCan(engine, signal) {
  engine.onStatus('Trash');
  engine.resetDesk();
  await engine.wait(200, signal);
  await engine.doubleClick(engine.desktopIcon('trash'), signal);
  const win = openTrash(engine);
  await engine.wait(200, signal);
  await engine.placeWindow(win, 0.7, 0.12, 620, signal);
  await engine.wait(360, signal);
}

async function arrangeWindows(engine, signal) {
  engine.onStatus('KDE — Moving windows');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.openKMenu(['Utilities', 'Text Editor'], signal);
  const note = openKWrite(engine);
  await engine.wait(220, signal);
  await engine.placeWindow(note, 0.02, 0.58, 700, signal);
  await engine.wait(160, signal);
  await engine.openKMenu(['Utilities', 'Calculator'], signal);
  const calc = openKCalc(engine);
  await engine.wait(200, signal);
  await engine.placeWindow(calc, 1, 0.04, 640, signal);
  await engine.wait(420, signal);
}

async function idleGlance(engine, signal) {
  engine.onStatus('KDE — Between tasks');
  engine.resetDesk();
  await engine.wait(240, signal);
  await engine.moveToElement(engine.kBtn, 0.5, 0.5, null, signal);
  await engine.wait(280, signal);
  await engine.moveToElement(engine.clockEl, 0.5, 0.5, null, signal);
  await engine.wait(260, signal);
  await engine.moveToElement(engine.desktopButton(2), 0.5, 0.5, null, signal);
  await engine.wait(200, signal);
  await engine.moveToElement(engine.desktopButton(1), 0.5, 0.5, null, signal);
  await engine.wait(280, signal);
  await engine.moveToElement(engine.desktopIcon('trash'), 0.5, 0.35, null, signal);
  await engine.wait(360, signal);
}

async function aboutKde(engine, signal) {
  engine.onStatus('About KDE');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.openKMenu(['Internet', 'Web Browser'], signal);
  const win = openKonqueror(engine);
  await engine.wait(240, signal);
  await engine.openWindowMenu(win, 'Help', 'About KDE', signal);
  const about = openAbout(engine);
  engine.sounds.menu();
  await engine.wait(1500, signal);
  await engine.click(about.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(about);
  await engine.wait(280, signal);
}

async function lockSession(engine, signal) {
  engine.onStatus('Lock Session');
  engine.resetDesk();
  await engine.wait(160, signal);
  await engine.openKMenu(['Lock Session'], signal);
  engine.showLock();
  engine.sounds.alert();
  await engine.wait(360, signal);
  await engine.click(engine.lockField, {}, signal);
  await engine.typeValue(engine.lockField, 'session', signal);
  await engine.wait(700, signal);
  engine.hideLock();
  await engine.wait(260, signal);
}

async function switchDesktop(engine, signal) {
  engine.onStatus('Desktops — Desk 2');
  engine.resetDesk();
  await engine.wait(160, signal);
  await engine.click(engine.desktopButton(2), { pressClass: 'pressed' }, signal);
  engine.setDesktop(2);
  await engine.wait(220, signal);
  const win = openKonsole(engine);
  await engine.wait(200, signal);
  await engine.click(win.termEl, { rx: 0.3, ry: 0.4 }, signal);
  await engine.typeText(win.termEl, 'pwd', signal);
  termInsert(win, '\n/home/user\nuser@desk:~$ ');
  await engine.wait(200, signal);
  await engine.placeWindow(win, 0.64, 0.2, 560, signal);
  await engine.wait(220, signal);
  await engine.click(engine.desktopButton(1), { pressClass: 'pressed' }, signal);
  engine.setDesktop(1);
  engine.onStatus('Desktops — Desk 1');
  await engine.wait(460, signal);
  await engine.click(engine.desktopButton(2), { pressClass: 'pressed' }, signal);
  engine.setDesktop(2);
  await engine.wait(480, signal);
  await engine.click(engine.desktopButton(1), { pressClass: 'pressed' }, signal);
  engine.setDesktop(1);
  await engine.wait(260, signal);
}

async function logOut(engine, signal) {
  engine.onStatus('KDE — Logout');
  engine.resetDesk();
  await engine.wait(160, signal);
  await engine.openKMenu(['Logout'], signal);
  const win = openLogout(engine);
  engine.sounds.alert();
  await engine.wait(640, signal);
  await engine.click(win.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeAllWindows();
  await playBootSequence(engine, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'konqueror-browse', run: konquerorBrowse },
  { id: 'kwrite-note', run: kwriteNote },
  { id: 'arrange-windows', run: arrangeWindows },
  { id: 'konsole-session', run: konsoleSession },
  { id: 'kcalc', run: calculator },
  { id: 'find-files', run: findFiles },
  { id: 'trash', run: trashCan },
  { id: 'idle-glance', run: idleGlance },
];

export const SPECIAL_VIGNETTES = {
  about: aboutKde,
  lock: lockSession,
  desktops: switchDesktop,
  logout: logOut,
};
