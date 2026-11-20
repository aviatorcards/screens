import {
  drawFlag,
  findControl,
  openCalculator,
  openDosPrompt,
  openExplorer,
  openInternet,
  openMinesweeper,
  openMyComputer,
  openNotepad,
  openPaint,
  openRecycle,
  openShutdown,
  openSolitaire,
  openWordPad,
  revealMine,
  showDriveC,
  showExplorerDir,
  termInsert,
} from './apps.js';

export async function playBootSequence(engine, signal) {
  const win98 = engine.era === '98';
  engine.onStatus(win98 ? 'Windows 98 — Starting' : 'Windows 95 — Starting');
  engine.closePopups();
  engine.showBoot();
  await engine.wait(420, signal);
  if (win98) engine.sounds.startup98();
  else engine.sounds.startup95();
  await engine.wait(1500, signal);
  engine.hideBoot();
  engine.resetDesk();
  engine.setCursorVisible(true);
  engine.onStatus(win98 ? 'Windows 98' : 'Windows 95');
  await engine.wait(320, signal);
}

function fresh(engine) {
  engine.resetDesk();
  engine.setEra('95');
}

async function startExplorer(engine, signal) {
  engine.onStatus('Windows Explorer');
  fresh(engine);
  await engine.wait(200, signal);
  await engine.openStart(['Programs', 'Windows Explorer'], signal);
  const win = openExplorer(engine);
  await engine.wait(420, signal);
  await engine.click(findControl(win, 'Windows'), signal);
  showExplorerDir(win, 'Windows');
  await engine.wait(640, signal);
}

async function myComputer(engine, signal) {
  engine.onStatus('My Computer');
  fresh(engine);
  await engine.wait(180, signal);
  await engine.doubleClick(engine.deskIcon('My Computer'), signal);
  const win = openMyComputer(engine);
  await engine.wait(360, signal);
  await engine.doubleClick(findControl(win, '(C:)'), signal);
  showDriveC(win);
  await engine.wait(240, signal);
  await engine.click(findControl(win, 'NOTES.TXT'), signal);
  engine.selectItem(findControl(win, 'NOTES.TXT'));
  await engine.wait(560, signal);
}

async function notepadJournal(engine, signal) {
  engine.onStatus('Notepad — NOTES.TXT');
  fresh(engine);
  await engine.wait(180, signal);
  await engine.openStart(['Programs', 'Accessories', 'Notepad'], signal);
  const note = openNotepad(engine);
  await engine.wait(320, signal);
  await engine.click(note.docEl, { rx: 0.22, ry: 0.72 }, signal);
  await engine.typeText(note.docEl, '\nThe taskbar still knows which windows are open.', signal);
  await engine.openWindowMenu(note, 'File', 'Save', signal);
  await engine.wait(420, signal);
}

async function wordpad(engine, signal) {
  engine.onStatus('WordPad');
  fresh(engine);
  await engine.wait(180, signal);
  await engine.openStart(['Programs', 'Accessories', 'WordPad'], signal);
  const doc = openWordPad(engine);
  await engine.wait(300, signal);
  await engine.click(doc.docEl, { rx: 0.24, ry: 0.78 }, signal);
  await engine.typeText(doc.docEl, '\n\nSincerely,\nWindows User', signal);
  await engine.wait(480, signal);
}

async function solitaire(engine, signal) {
  engine.onStatus('Solitaire');
  fresh(engine);
  await engine.wait(160, signal);
  await engine.openStart(['Programs', 'Accessories', 'Solitaire'], signal);
  const win = openSolitaire(engine);
  await engine.wait(280, signal);
  await engine.moveToElement(win.ace, 0.5, 0.45, null, signal);
  await engine.dragEl(win.ace, win.slot.offsetLeft, win.slot.offsetTop, 780, signal);
  engine.sounds.menu();
  await engine.wait(520, signal);
}

async function paint(engine, signal) {
  engine.onStatus('Paint');
  fresh(engine);
  await engine.wait(160, signal);
  await engine.openStart(['Programs', 'Accessories', 'Paint'], signal);
  const win = openPaint(engine);
  await engine.wait(220, signal);
  const wrap = win.canvas.parentElement;
  if (wrap.clientWidth > 40 && wrap.clientHeight > 40) {
    win.canvas.width = wrap.clientWidth;
    win.canvas.height = wrap.clientHeight;
  }
  await engine.click(win.brush, { pressClass: 'pressed' }, signal);
  await engine.click(win.navy, {}, signal);
  const ctx = win.canvas.getContext('2d');
  await engine.moveToElement(win.canvas, 0.3, 0.4, null, signal);
  await engine.animate(1400, (t) => {
    drawFlag(ctx, t, win.canvas.width, win.canvas.height);
  }, signal);
  await engine.wait(420, signal);
}

async function minesweeper(engine, signal) {
  engine.onStatus('Minesweeper');
  fresh(engine);
  await engine.wait(160, signal);
  await engine.openStart(['Programs', 'Accessories', 'Minesweeper'], signal);
  const win = openMinesweeper(engine);
  await engine.wait(260, signal);
  await engine.click(findControl(win, '4,4'), { pressClass: 'pressed' }, signal);
  revealMine(win, 4, 4);
  win.timer.textContent = '003';
  await engine.wait(640, signal);
}

async function calculator(engine, signal) {
  engine.onStatus('Calculator');
  fresh(engine);
  await engine.wait(160, signal);
  await engine.openStart(['Programs', 'Accessories', 'Calculator'], signal);
  const calc = openCalculator(engine);
  await engine.wait(220, signal);
  const steps = [
    ['1', '1'],
    ['9', '19'],
    ['9', '199'],
    ['5', '1995'],
    ['+', '1995'],
    ['3', '3'],
    ['=', '1998'],
  ];
  for (const [key, shown] of steps) {
    await engine.click(findControl(calc, key), { pressClass: 'pressed' }, signal);
    calc.display.textContent = shown;
  }
  await engine.wait(480, signal);
}

async function dosPrompt(engine, signal) {
  engine.onStatus('MS-DOS Prompt');
  fresh(engine);
  await engine.wait(160, signal);
  await engine.openStart(['Programs', 'MS-DOS Prompt'], signal);
  const win = openDosPrompt(engine);
  await engine.wait(200, signal);
  await engine.click(win.termEl, { rx: 0.16, ry: 0.12 }, signal);
  await engine.typeText(win.termEl, 'ver', signal);
  await engine.wait(200, signal);
  termInsert(win, '\n\nWindows 95. [Version 4.00.950]\n\nC:\\WINDOWS>');
  await engine.wait(640, signal);
}

async function recycle(engine, signal) {
  engine.onStatus('Recycle Bin');
  fresh(engine);
  await engine.wait(180, signal);
  await engine.doubleClick(engine.deskIcon('Recycle Bin'), signal);
  const win = openRecycle(engine);
  await engine.wait(280, signal);
  await engine.click(findControl(win, 'SETUP.EXE'), signal);
  engine.selectItem(findControl(win, 'SETUP.EXE'));
  await engine.wait(560, signal);
}

async function windows98(engine, signal) {
  engine.onStatus('Windows 98 SE');
  fresh(engine);
  engine.setEra('98');
  await playBootSequence(engine, signal);
  engine.onStatus('Internet Explorer');
  await engine.openStart(['Programs', 'Accessories', 'Internet Explorer'], signal);
  openInternet(engine);
  await engine.wait(640, signal);
  engine.onStatus('Notepad — Windows 98');
  await engine.openStart(['Programs', 'Accessories', 'Notepad'], signal);
  const note = openNotepad(engine, 188, 54);
  await engine.wait(240, signal);
  await engine.click(note.docEl, { rx: 0.24, ry: 0.74 }, signal);
  await engine.typeText(note.docEl, '\n[1998 · Windows 98 SE] Gradient title bars, Quick Launch & USB!', signal);
  await engine.wait(640, signal);
}

async function flyingWindows(engine, signal) {
  engine.onStatus('Flying Windows');
  fresh(engine);
  await engine.wait(160, signal);
  engine.showFlying();
  engine.setCursorVisible(false);
  await engine.animate(5200, (t) => engine.tickFlying(t), signal);
  engine.hideFlying();
  engine.setCursorVisible(true);
  engine.onStatus('Windows 95');
  await engine.wait(240, signal);
}

async function shutDown(engine, signal) {
  engine.onStatus('Shut Down Windows');
  fresh(engine);
  await engine.wait(180, signal);
  await engine.openStart(['Shut Down…'], signal);
  const dialog = openShutdown(engine);
  await engine.wait(480, signal);
  await engine.click(dialog.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeAllWindows();
  engine.showSafe();
  engine.setCursorVisible(false);
  await engine.wait(1600, signal);
  await playBootSequence(engine, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'start-explorer', run: startExplorer },
  { id: 'my-computer', run: myComputer },
  { id: 'notepad-journal', run: notepadJournal },
  { id: 'wordpad', run: wordpad },
  { id: 'solitaire', run: solitaire },
  { id: 'paint', run: paint },
  { id: 'minesweeper', run: minesweeper },
  { id: 'calculator', run: calculator },
  { id: 'dos-prompt', run: dosPrompt },
  { id: 'recycle', run: recycle },
  { id: 'win98', run: windows98 },
];

export const SPECIAL_VIGNETTES = {
  flying: flyingWindows,
  solitaire,
  win98: windows98,
  shutdown: shutDown,
};
