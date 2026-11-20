import { solarisDate } from './engine.js';

export async function playBootSequence(engine, signal) {
  engine.onStatus('Solaris — Starting up');
  engine.showBoot();
  engine.setCursorVisible(false);
  await engine.wait(320, signal);
  await engine.animate(1100, (t) => engine.setBootProgress(t), signal);
  await engine.wait(260, signal);
  engine.hideBoot();
  engine.sounds.startup();
  engine.onStatus('Solaris 9 — Common Desktop Environment');
  await engine.wait(220, signal);
}

async function openFromPanel(engine, id, signal) {
  await engine.click(engine.control(id), { pressClass: 'pressed' }, signal);
  await engine.launch(signal);
}

async function fileManager(engine, signal) {
  engine.onStatus('File Manager — /export/home/user');
  engine.resetDesk();
  await engine.wait(180, signal);
  await openFromPanel(engine, 'files', signal);
  const win = engine.openFileManager();
  await engine.wait(360, signal);
  await engine.placeWindow(win, 0.58, 0.1, 620, signal);
  await engine.wait(240, signal);
}

async function textEditor(engine, signal) {
  engine.onStatus('Text Editor — notes.txt');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.chooseSubpanel('apps', 'Text Editor', signal);
  await engine.launch(signal);
  const win = engine.openEditor();
  await engine.wait(240, signal);
  await engine.click(win.docEl, { rx: 0.3, ry: 0.28 }, signal);
  const note = `Studio log\nSolaris 9\nCommon Desktop Environment\n${solarisDate()}\n`;
  await engine.typeText(win.docEl, note, signal);
  await engine.wait(180, signal);
  await engine.appMenu(win, 'File', 'Save As...', signal);
  const dialog = engine.openSaveAs(win);
  await engine.wait(200, signal);
  await engine.click(dialog.field, {}, signal);
  await engine.wait(160, signal);
  await engine.click(dialog.okBtn, { pressClass: 'pressed' }, signal);
  engine.confirmSave(dialog);
  await engine.wait(280, signal);
  await openFromPanel(engine, 'files', signal);
  const files = engine.openFileManager();
  await engine.wait(240, signal);
  const icon = files.el.querySelector('[data-file="notes.txt"]');
  await engine.click(icon, {}, signal);
  engine.selectFile(icon);
  await engine.wait(220, signal);
  await engine.placeWindow(win, 0.08, 0.46, 600, signal);
  await engine.wait(200, signal);
}

async function terminal(engine, signal) {
  engine.onStatus('Terminal — SunOS 5.9');
  engine.resetDesk();
  await engine.wait(180, signal);
  await engine.chooseRoot('Terminal', signal);
  await engine.launch(signal);
  const win = engine.openTerminal();
  await engine.wait(220, signal);
  await engine.runCommand(win, 'uname -sr', ['SunOS 5.9'], signal);
  await engine.runCommand(win, 'pwd', [engine.home], signal);
  const names = engine.files.filter((name) => !name.startsWith('.'));
  await engine.runCommand(win, 'ls', names.length ? [names.join('  ')] : [], signal);
  await engine.runCommand(win, 'date', [solarisDate()], signal);
  await engine.placeWindow(win, 0.62, 0.18, 600, signal);
  await engine.wait(220, signal);
}

async function dragTwo(engine, signal) {
  engine.onStatus('Front Panel — moving windows');
  engine.resetDesk();
  await engine.wait(160, signal);
  await openFromPanel(engine, 'files', signal);
  const files = engine.openFileManager();
  await engine.wait(180, signal);
  await openFromPanel(engine, 'calendar', signal);
  const cal = engine.openCalendar();
  await engine.wait(200, signal);
  await engine.placeWindow(files, 0.06, 0.08, 640, signal);
  await engine.wait(160, signal);
  await engine.placeWindow(cal, 0.56, 0.22, 640, signal);
  await engine.wait(220, signal);
}

async function calendar(engine, signal) {
  engine.onStatus('Calendar');
  engine.resetDesk();
  await engine.wait(160, signal);
  await openFromPanel(engine, 'calendar', signal);
  const win = engine.openCalendar();
  await engine.wait(420, signal);
  const today = win.el.querySelector('.today');
  if (today) await engine.moveToElement(today, 0.5, 0.5, null, signal);
  await engine.wait(280, signal);
  await engine.placeWindow(win, 0.34, 0.12, 580, signal);
  await engine.wait(200, signal);
}

async function styleManager(engine, signal) {
  engine.onStatus('Style Manager');
  engine.resetDesk();
  await engine.wait(160, signal);
  await openFromPanel(engine, 'style', signal);
  const win = engine.openStyleManager();
  await engine.wait(280, signal);
  const color = win.el.querySelector('[data-style="Color"]');
  const backdrop = win.el.querySelector('[data-style="Backdrop"]');
  await engine.moveToElement(color, 0.5, 0.45, null, signal);
  await engine.wait(320, signal);
  await engine.moveToElement(backdrop, 0.5, 0.45, null, signal);
  await engine.wait(280, signal);
  await engine.placeWindow(win, 0.48, 0.14, 580, signal);
  await engine.wait(200, signal);
}

async function switchWorkspace(engine, signal) {
  engine.onStatus('Workspace — Two');
  engine.resetDesk();
  await engine.wait(160, signal);
  await openFromPanel(engine, 'files', signal);
  const win = engine.openFileManager();
  await engine.wait(240, signal);
  await engine.click(engine.workspaceButton('Two'), { pressClass: 'pressed' }, signal);
  engine.setWorkspace('Two');
  engine.onStatus('Workspace — Two');
  await engine.wait(1600, signal);
  await engine.click(engine.workspaceButton('One'), { pressClass: 'pressed' }, signal);
  engine.setWorkspace('One');
  engine.onStatus('Workspace — One');
  await engine.wait(240, signal);
  await engine.placeWindow(win, 0.4, 0.16, 560, signal);
  await engine.wait(180, signal);
}

async function logoutCancel(engine, signal) {
  engine.onStatus('Log out');
  engine.resetDesk();
  await engine.wait(160, signal);
  await engine.click(engine.control('exit'), { pressClass: 'pressed' }, signal);
  await engine.launch(signal);
  engine.showLogout();
  await engine.wait(1200, signal);
  await engine.click(engine.logoutCancel, { pressClass: 'pressed' }, signal);
  engine.hideLogout();
  await engine.wait(200, signal);
}

async function trash(engine, signal) {
  engine.onStatus('Trash');
  engine.resetDesk();
  await engine.wait(140, signal);
  await openFromPanel(engine, 'trash', signal);
  const win = engine.openTrash();
  await engine.wait(360, signal);
  await engine.placeWindow(win, 0.7, 0.2, 520, signal);
  await engine.wait(180, signal);
}

async function performanceMeter(engine, signal) {
  engine.onStatus('Performance Meter');
  engine.resetDesk();
  await engine.wait(140, signal);
  await openFromPanel(engine, 'meter', signal);
  const win = engine.openPerformanceMeter();
  await engine.wait(520, signal);
  await engine.placeWindow(win, 0.72, 0.08, 520, signal);
  await engine.wait(180, signal);
}

async function mailer(engine, signal) {
  engine.onStatus('Mailer');
  engine.resetDesk();
  await engine.wait(140, signal);
  await openFromPanel(engine, 'mail', signal);
  const win = engine.openMailer();
  await engine.wait(360, signal);
  await engine.placeWindow(win, 0.22, 0.18, 540, signal);
  await engine.wait(160, signal);
}

async function helpViewer(engine, signal) {
  engine.onStatus('Help Viewer');
  engine.resetDesk();
  await engine.wait(140, signal);
  await openFromPanel(engine, 'help', signal);
  const win = engine.openHelp();
  await engine.wait(360, signal);
  await engine.placeWindow(win, 0.3, 0.12, 540, signal);
  await engine.wait(160, signal);
}

async function lockDisplay(engine, signal) {
  engine.onStatus('Lock Display');
  engine.resetDesk();
  await engine.wait(160, signal);
  await engine.click(engine.control('lock'), { pressClass: 'pressed' }, signal);
  await engine.launch(signal);
  engine.showLock();
  await engine.wait(200, signal);
  await engine.click(engine.lockField, {}, signal);
  await engine.typeValue(engine.lockField, '....', signal);
  await engine.wait(1600, signal);
  engine.hideLock();
  await engine.wait(180, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'fileman', run: fileManager },
  { id: 'editor', run: textEditor },
  { id: 'terminal', run: terminal },
  { id: 'drag', run: dragTwo },
  { id: 'calendar', run: calendar },
  { id: 'style', run: styleManager },
  { id: 'workspace', run: switchWorkspace },
  { id: 'logout', run: logoutCancel },
  { id: 'trash', run: trash },
  { id: 'meter', run: performanceMeter },
  { id: 'mail', run: mailer },
  { id: 'help', run: helpViewer },
];

export const SPECIAL_VIGNETTES = {
  lock: lockDisplay,
  logout: logoutCancel,
  workspace: switchWorkspace,
};
