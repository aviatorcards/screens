import {
  findControl,
  openClock,
  openDPaint,
  openNotepad,
  openShell,
  openSystem,
  openUtilities,
  openVersion,
  openWorkbench,
  paintDeluxe,
  termPrint,
} from './apps.js';

export async function playBootSequence(engine, signal) {
  engine.onStatus('Kickstart 1.3 — Insert disk');
  engine.closePopups();
  engine.showBoot();
  await engine.wait(240, signal);
  engine.sounds.insert();
  await engine.animate(1500, (t) => engine.tickInsert(t), signal);
  await engine.wait(320, signal);
  engine.hideBoot();
  engine.resetDesk();
  engine.setCursorVisible(true);
  engine.onStatus('Workbench 1.3');
  await engine.wait(280, signal);
}

function fresh(engine) {
  engine.resetDesk();
  engine.setCursorVisible(true);
}

async function runCmd(engine, doc, cmd, output, signal) {
  await engine.typeText(doc, cmd, signal);
  termPrint(doc, `\n${output}\n1.Workbench1.3:> `);
  await engine.wait(320, signal);
}

async function drawers(engine, signal) {
  engine.onStatus('Workbench1.3');
  fresh(engine);
  await engine.wait(180, signal);
  await engine.doubleClick(engine.deskIcon('Workbench1.3'), signal);
  const disk = openWorkbench(engine);
  await engine.wait(240, signal);
  await engine.openScreenMenu('Special', 'Version', signal);
  const req = openVersion(engine);
  await engine.wait(420, signal);
  await engine.click(req.ok, { pressClass: 'lit' }, signal);
  engine.closeWindow(req);
  await engine.wait(180, signal);
  await engine.doubleClick(findControl(disk, 'Utilities'), signal);
  const utils = openUtilities(engine);
  await engine.wait(240, signal);
  await engine.doubleClick(findControl(utils, 'Clock'), signal);
  openClock(engine);
  await engine.wait(640, signal);
}

async function shell(engine, signal) {
  engine.onStatus('AmigaShell');
  fresh(engine);
  await engine.wait(160, signal);
  await engine.doubleClick(engine.deskIcon('Workbench1.3'), signal);
  const disk = openWorkbench(engine);
  await engine.wait(200, signal);
  await engine.doubleClick(findControl(disk, 'System'), signal);
  const sys = openSystem(engine);
  await engine.wait(200, signal);
  await engine.doubleClick(findControl(sys, 'Shell'), signal);
  const win = openShell(engine);
  await engine.wait(180, signal);
  await engine.click(win.docEl, { rx: 0.22, ry: 0.24 }, signal);
  await runCmd(engine, win.docEl, 'version', 'Kickstart version 34.5\nWorkbench version 34.20', signal);
  await runCmd(
    engine,
    win.docEl,
    'dir',
    'System (dir)\nUtilities (dir)\nExpansion (dir)\nDevs (dir)\nFonts (dir)\nPrefs (dir)\nTrashcan (dir)',
    signal,
  );
  await runCmd(
    engine,
    win.docEl,
    'avail',
    'Type       Available       In-Use   Maximum    Largest\nchip          487424       536576   1048576     487424\nfast         1048576            0   1048576    1048576\ntotal        1536000       536576   2097152    1048576',
    signal,
  );
  await engine.typeText(win.docEl, 'say "Workbench"', signal);
  engine.sounds.say();
  termPrint(win.docEl, '\n1.Workbench1.3:> ');
  await engine.wait(720, signal);
}

async function notepad(engine, signal) {
  engine.onStatus('Notepad');
  fresh(engine);
  await engine.wait(160, signal);
  await engine.doubleClick(engine.deskIcon('Workbench1.3'), signal);
  const disk = openWorkbench(engine);
  await engine.wait(180, signal);
  await engine.doubleClick(findControl(disk, 'Utilities'), signal);
  const utils = openUtilities(engine);
  await engine.wait(180, signal);
  await engine.doubleClick(findControl(utils, 'Notepad'), signal);
  const note = openNotepad(engine);
  await engine.wait(180, signal);
  await engine.click(note.docEl, { rx: 0.16, ry: 0.18 }, signal);
  const notes = [
    '1988\n\nDrawers on the blue screen.\nThe Shell still speaks Topaz.',
    '1988\n\nUtilities has the Clock.\nDeluxe Paint is on the desk.',
    '1988\n\nWorkbench 1.3.\nThe Shell still speaks Topaz.',
  ];
  await engine.typeText(note.docEl, notes[Math.floor(Math.random() * notes.length)], signal);
  await engine.wait(480, signal);
}

async function dpaint(engine, signal) {
  engine.onStatus('Deluxe Paint II');
  fresh(engine);
  await engine.wait(160, signal);
  await engine.doubleClick(engine.deskIcon('DeluxePaint'), signal);
  const win = openDPaint(engine);
  await engine.wait(220, signal);
  await engine.openScreenMenu('Picture', 'Clear', signal);
  await engine.click(win.tool, signal);
  win.tool.classList.add('on');
  const canvas = win.canvas;
  canvas.width = Math.max(40, canvas.clientWidth);
  canvas.height = Math.max(40, canvas.clientHeight);
  await engine.animate(1700, (t) => paintDeluxe(canvas, t), signal);
  await engine.wait(520, signal);
}

async function version(engine, signal) {
  engine.onStatus('Workbench Version');
  fresh(engine);
  await engine.wait(180, signal);
  await engine.openScreenMenu('Special', 'Version', signal);
  const win = openVersion(engine);
  await engine.wait(480, signal);
  await engine.click(win.ok, { pressClass: 'lit' }, signal);
  engine.closeWindow(win);
  await engine.wait(240, signal);
}

async function guru(engine, signal) {
  engine.onStatus('Guru Meditation');
  fresh(engine);
  await engine.wait(220, signal);
  engine.showGuru();
  engine.sounds.guru();
  await engine.wait(2200, signal);
  engine.hideGuru();
  engine.setCursorVisible(true);
  await engine.wait(280, signal);
}

async function clock(engine, signal) {
  engine.onStatus('Clock');
  fresh(engine);
  await engine.wait(140, signal);
  openClock(engine);
  await engine.wait(900, signal);
}

async function boing(engine, signal) {
  engine.onStatus('Boing Ball');
  fresh(engine);
  engine.showBoing();
  let hop = -1;
  await engine.animate(5200, (t) => {
    const n = Math.floor(t * 5);
    if (n !== hop && n < 5) {
      hop = n;
      engine.sounds.boing();
    }
    engine.tickBoing(t);
  }, signal);
  engine.hideBoing();
  engine.setCursorVisible(true);
  await engine.wait(200, signal);
}

async function kickstart(engine, signal) {
  await playBootSequence(engine, signal);
  await engine.wait(360, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'drawers', run: drawers },
  { id: 'shell', run: shell },
  { id: 'notepad', run: notepad },
  { id: 'dpaint', run: dpaint },
  { id: 'version', run: version },
  { id: 'guru', run: guru },
  { id: 'clock', run: clock },
];

export const SPECIAL_VIGNETTES = {
  boing,
  dpaint,
  shell,
  kickstart,
};
