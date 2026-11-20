import {
  drawHouse,
  findControl,
  openAbout,
  openCalculator,
  openCalendar,
  openClock,
  openControlPanel,
  openDesktopDialog,
  openDosPrompt,
  openExitDialog,
  openFault,
  openFileManager,
  openFontDialog,
  openGroup,
  openMinesweeper,
  openNotepad,
  openPaintbrush,
  openProgramManager,
  openSolitaire,
  openWrite,
  revealMine,
  showDir,
  termInsert,
} from './apps.js';

export async function playBootSequence(engine, signal) {
  engine.onStatus('Windows 3.1 — Starting');
  engine.closePopups();
  engine.showBoot();
  await engine.wait(380, signal);
  engine.sounds.tada();
  await engine.wait(1050, signal);
  engine.hideBoot();
  engine.resetDesk();
  openProgramManager(engine);
  engine.setCursorVisible(true);
  engine.onStatus('Program Manager');
  await engine.wait(280, signal);
}

function fresh(engine) {
  engine.resetDesk();
  return openProgramManager(engine);
}

async function progmanGroups(engine, signal) {
  engine.onStatus('Program Manager — Groups');
  const { pm, main } = fresh(engine);
  await engine.wait(280, signal);
  const fileman = findControl(main, 'File Manager');
  await engine.click(fileman, {}, signal);
  engine.selectItem(fileman);
  await engine.wait(260, signal);
  await engine.doubleClick(findControl(pm, 'Accessories'), signal);
  const accessories = openGroup(engine, pm, 'Accessories');
  await engine.wait(240, signal);
  const notepad = findControl(accessories, 'Notepad');
  await engine.click(notepad, {}, signal);
  engine.selectItem(notepad);
  await engine.wait(220, signal);
  await engine.doubleClick(findControl(pm, 'Games'), signal);
  openGroup(engine, pm, 'Games');
  await engine.wait(240, signal);
  await engine.openWindowMenu(pm, 'Window', 'Tile', signal);
  engine.tileGroups(pm);
  await engine.wait(640, signal);
}

async function notepadJournal(engine, signal) {
  engine.onStatus('Notepad — NOTES.TXT');
  const { pm } = fresh(engine);
  await engine.wait(220, signal);
  const accessories = openGroup(engine, pm, 'Accessories');
  await engine.wait(180, signal);
  await engine.doubleClick(findControl(accessories, 'Notepad'), signal);
  const note = openNotepad(engine);
  await engine.wait(360, signal);
  await engine.click(note.docEl, { rx: 0.2, ry: 0.78 }, signal);
  await engine.typeText(note.docEl, '\nProgram Manager still keeps Main, Accessories, and Games.', signal);
  await engine.openWindowMenu(note, 'File', 'Save', signal);
  await engine.wait(480, signal);
}

async function fileManager(engine, signal) {
  engine.onStatus('File Manager — C:\\WINDOWS');
  const { main } = fresh(engine);
  await engine.wait(220, signal);
  await engine.doubleClick(findControl(main, 'File Manager'), signal);
  const fm = openFileManager(engine);
  await engine.wait(320, signal);
  const system = [...fm.treeEl.querySelectorAll('.w31-dir')].find((node) => node.dataset.dir === 'system');
  await engine.click(system, {}, signal);
  showDir(fm, 'system');
  await engine.wait(420, signal);
  const windows = [...fm.treeEl.querySelectorAll('.w31-dir')].find((node) => node.dataset.dir === 'windows');
  await engine.click(windows, {}, signal);
  showDir(fm, 'windows');
  await engine.wait(200, signal);
  const notes = findControl(fm, 'NOTES.TXT');
  await engine.click(notes, {}, signal);
  engine.selectItem(notes);
  await engine.wait(520, signal);
}

async function writeLetter(engine, signal) {
  engine.onStatus('Write — TrueType');
  const { pm } = fresh(engine);
  await engine.wait(200, signal);
  const accessories = openGroup(engine, pm, 'Accessories');
  await engine.wait(160, signal);
  await engine.doubleClick(findControl(accessories, 'Write'), signal);
  const write = openWrite(engine);
  await engine.wait(360, signal);
  await engine.click(write.docEl, { rx: 0.22, ry: 0.86 }, signal);
  await engine.typeText(write.docEl, '\n\nSincerely,\nWindows User', signal);
  await engine.openWindowMenu(write, 'Character', 'Fonts…', signal);
  const fonts = openFontDialog(engine);
  await engine.wait(520, signal);
  await engine.click(fonts.okBtn, {}, signal);
  engine.closeWindow(fonts);
  await engine.wait(360, signal);
}

async function solitaire(engine, signal) {
  engine.onStatus('Solitaire — Ace of hearts');
  fresh(engine);
  await engine.wait(180, signal);
  const sol = openSolitaire(engine);
  await engine.wait(280, signal);
  await engine.moveToElement(sol.ace, 0.5, 0.45, null, signal);
  await engine.dragEl(sol.ace, sol.slot.offsetLeft, sol.slot.offsetTop, 780, signal);
  engine.sounds.tada();
  await engine.wait(560, signal);
}

async function paintbrush(engine, signal) {
  engine.onStatus('Paintbrush — Brush');
  const { pm } = fresh(engine);
  await engine.wait(180, signal);
  const accessories = openGroup(engine, pm, 'Accessories');
  await engine.doubleClick(findControl(accessories, 'Paintbrush'), signal);
  const paint = openPaintbrush(engine);
  await engine.wait(240, signal);
  const wrap = paint.canvas.parentElement;
  if (wrap.clientWidth > 40 && wrap.clientHeight > 40) {
    paint.canvas.width = wrap.clientWidth;
    paint.canvas.height = wrap.clientHeight;
  }
  await engine.click(paint.brush, { pressClass: 'pressed' }, signal);
  await engine.click(paint.navy, {}, signal);
  const ctx = paint.canvas.getContext('2d');
  await engine.animate(1600, (t) => {
    drawHouse(ctx, t, paint.canvas.width, paint.canvas.height);
  }, signal);
  await engine.wait(420, signal);
}

async function minesweeper(engine, signal) {
  engine.onStatus('Minesweeper — Beginner');
  const { pm } = fresh(engine);
  await engine.wait(180, signal);
  const games = openGroup(engine, pm, 'Games');
  await engine.doubleClick(findControl(games, 'Minesweeper'), signal);
  const mine = openMinesweeper(engine);
  await engine.wait(280, signal);
  const cell = findControl(mine, '4,4');
  await engine.click(cell, {}, signal);
  revealMine(mine, 4, 4);
  mine.timer.textContent = '003';
  await engine.wait(640, signal);
}

async function calculator(engine, signal) {
  engine.onStatus('Calculator — 1024 × 4');
  const { pm } = fresh(engine);
  await engine.wait(180, signal);
  const accessories = openGroup(engine, pm, 'Accessories');
  await engine.doubleClick(findControl(accessories, 'Calculator'), signal);
  const calc = openCalculator(engine);
  await engine.wait(240, signal);
  const steps = [
    ['1', '1'],
    ['0', '10'],
    ['2', '102'],
    ['4', '1024'],
    ['*', '1024'],
    ['4', '4'],
    ['=', '4096'],
  ];
  for (const [key, shown] of steps) {
    await engine.click(findControl(calc, key), { pressClass: 'pressed' }, signal);
    calc.display.textContent = shown;
  }
  await engine.wait(520, signal);
}

async function dosPrompt(engine, signal) {
  engine.onStatus('MS-DOS Prompt — Version 5.00');
  const { main } = fresh(engine);
  await engine.wait(180, signal);
  await engine.doubleClick(findControl(main, 'MS-DOS Prompt'), signal);
  const dos = openDosPrompt(engine);
  await engine.wait(220, signal);
  await engine.click(dos.termEl, { rx: 0.18, ry: 0.16 }, signal);
  await engine.typeText(dos.termEl, 'ver\n', signal);
  termInsert(dos, 'MS-DOS Version 5.00\n\nC:\\WINDOWS>');
  await engine.wait(180, signal);
  await engine.typeText(dos.termEl, 'dir *.ini\n', signal);
  termInsert(dos, 'SYSTEM.INI        2K  03-10-92\nWIN.INI          33K  03-10-92\n       2 file(s)\n\nC:\\WINDOWS>');
  await engine.wait(640, signal);
}

async function desktopSettings(engine, signal) {
  engine.onStatus('Control Panel — Desktop');
  const { main } = fresh(engine);
  await engine.wait(180, signal);
  await engine.doubleClick(findControl(main, 'Control Panel'), signal);
  const panel = openControlPanel(engine);
  await engine.wait(220, signal);
  await engine.doubleClick(findControl(panel, 'Desktop'), signal);
  const dialog = openDesktopDialog(engine);
  await engine.wait(280, signal);
  await engine.moveToElement(findControl(dialog, 'Screen Saver'), 0.55, 0.5, null, signal);
  await engine.wait(460, signal);
  await engine.click(dialog.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(dialog);
  await engine.wait(360, signal);
}

async function clockCalendar(engine, signal) {
  engine.onStatus('Clock and Calendar — April 1992');
  const { pm } = fresh(engine);
  await engine.wait(180, signal);
  const accessories = openGroup(engine, pm, 'Accessories');
  await engine.doubleClick(findControl(accessories, 'Clock'), signal);
  openClock(engine);
  await engine.wait(200, signal);
  await engine.doubleClick(findControl(accessories, 'Calendar'), signal);
  const calendar = openCalendar(engine);
  await engine.wait(240, signal);
  await engine.moveToElement(findControl(calendar, 'day-6'), 0.5, 0.5, null, signal);
  await engine.wait(640, signal);
}

async function aboutProgman(engine, signal) {
  engine.onStatus('About Program Manager');
  const { pm } = fresh(engine);
  await engine.wait(220, signal);
  await engine.openWindowMenu(pm, 'Help', 'About Program Manager…', signal);
  const about = openAbout(engine);
  await engine.wait(860, signal);
  await engine.click(about.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(about);
  await engine.wait(280, signal);
}

async function playStarfield(engine, signal) {
  engine.onStatus('Starfield Simulation');
  fresh(engine);
  await engine.wait(180, signal);
  engine.showStarfield();
  engine.setCursorVisible(false);
  await engine.animate(5200, (t) => engine.tickStars(t), signal);
  engine.hideStarfield();
  engine.setCursorVisible(true);
  engine.onStatus('Program Manager');
  await engine.wait(280, signal);
}

async function generalProtectionFault(engine, signal) {
  engine.onStatus('Notepad — General Protection Fault');
  const { pm } = fresh(engine);
  await engine.wait(180, signal);
  const accessories = openGroup(engine, pm, 'Accessories');
  await engine.doubleClick(findControl(accessories, 'Notepad'), signal);
  const note = openNotepad(engine);
  await engine.wait(360, signal);
  engine.sounds.error();
  const fault = openFault(engine);
  await engine.wait(980, signal);
  await engine.click(fault.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeWindow(fault);
  engine.closeWindow(note);
  await engine.wait(320, signal);
}

async function restartWindows(engine, signal) {
  engine.onStatus('Exit Windows');
  const { pm } = fresh(engine);
  await engine.wait(220, signal);
  await engine.openWindowMenu(pm, 'File', 'Exit Windows…', signal);
  const dialog = openExitDialog(engine);
  await engine.wait(420, signal);
  await engine.click(dialog.okBtn, { pressClass: 'pressed' }, signal);
  engine.closeAllWindows();
  engine.showDos();
  engine.setCursorVisible(true);
  await engine.click(engine.dosTerm, { rx: 0.12, ry: 0.08 }, signal);
  await engine.typeText(engine.dosTerm, 'win', signal);
  await engine.wait(260, signal);
  await playBootSequence(engine, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'progman-groups', run: progmanGroups },
  { id: 'notepad-journal', run: notepadJournal },
  { id: 'file-manager', run: fileManager },
  { id: 'write-letter', run: writeLetter },
  { id: 'solitaire', run: solitaire },
  { id: 'paintbrush', run: paintbrush },
  { id: 'minesweeper', run: minesweeper },
  { id: 'calculator', run: calculator },
  { id: 'dos-prompt', run: dosPrompt },
  { id: 'desktop-settings', run: desktopSettings },
  { id: 'clock-calendar', run: clockCalendar },
  { id: 'about-progman', run: aboutProgman },
];

export const SPECIAL_VIGNETTES = {
  solitaire,
  starfield: playStarfield,
  gpf: generalProtectionFault,
  restart: restartWindows,
};
