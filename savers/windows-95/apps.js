import { iconSvg, SMILE } from './icons.js';

export const NOTES = `[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.
[1992 · Windows 3.1] TrueType fonts and Minesweeper.
[1995 · Windows 95] Long filenames, the Start button, and 32-bit speed!`;

const LETTER = `August 24, 1995

The Start button is finally on this desk.
Long filenames fit in Notepad, and the
taskbar keeps every window I leave open.`;

const MINES = new Set(['0,4', '1,7', '2,8', '3,1', '4,8', '5,6', '6,2', '7,7', '8,0', '8,4']);

const DATE = '08-24-95';

function menus(spec) {
  return spec.map(([label, items]) => ({
    label,
    items: items.map((entry) => {
      if (entry === '-') return { divider: true };
      if (typeof entry === 'string') return { label: entry };
      return entry;
    }),
  }));
}

const FILE_MENUS = menus([
  ['File', ['New', 'Open…', 'Save', '-', 'Exit']],
  ['Edit', ['Undo', '-', 'Cut', 'Copy', 'Paste']],
  ['View', ['Large Icons', 'Small Icons', 'List', { label: 'Details', checked: true }]],
  ['Help', ['About…']],
]);

const NOTE_MENUS = menus([
  ['File', ['New', 'Open…', 'Save', '-', 'Exit']],
  ['Edit', ['Undo', '-', 'Cut', 'Copy', 'Paste', '-', 'Select All']],
  ['Search', ['Find…']],
  ['Help', ['About Notepad…']],
]);

const WORD_MENUS = menus([
  ['File', ['New', 'Open…', 'Save', '-', 'Exit']],
  ['Edit', ['Undo', '-', 'Cut', 'Copy', 'Paste']],
  ['View', ['Toolbar', 'Format Bar', 'Ruler']],
  ['Insert', ['Date and Time…']],
  ['Format', ['Font…', 'Paragraph…']],
  ['Help', ['About WordPad…']],
]);

const PAINT_MENUS = menus([
  ['File', ['New', 'Open…', 'Save', '-', 'Exit']],
  ['Edit', ['Undo', 'Cut', 'Copy', 'Paste']],
  ['View', ['Zoom']],
  ['Image', ['Flip/Rotate', 'Attributes…']],
  ['Colors', ['Edit Colors…']],
  ['Help', ['About Paint…']],
]);

const SOL_MENUS = menus([
  ['Game', [{ label: 'Deal', shortcut: 'F2' }, 'Undo', 'Deck…', 'Options…', '-', 'Exit']],
  ['Help', ['Contents', 'About Solitaire…']],
]);

const MINE_MENUS = menus([
  ['Game', [
    { label: 'New', shortcut: 'F2' },
    '-',
    { label: 'Beginner', checked: true },
    'Intermediate',
    'Expert',
    '-',
    'Exit',
  ]],
  ['Help', ['Contents', 'About Minesweeper…']],
]);

const CALC_MENUS = menus([
  ['Edit', [{ label: 'Copy', shortcut: 'Ctrl+C' }, { label: 'Paste', shortcut: 'Ctrl+V' }]],
  ['View', [{ label: 'Standard', checked: true }, 'Scientific']],
  ['Help', ['About Calculator…']],
]);

const IE_MENUS = menus([
  ['File', ['New', 'Open…', 'Save', '-', 'Close']],
  ['Edit', ['Cut', 'Copy', 'Paste', 'Select All']],
  ['View', ['Toolbar', 'Status Bar']],
  ['Go', ['Back', 'Forward', 'Home Page']],
  ['Favorites', ['Add to Favorites…']],
  ['Help', ['About Internet Explorer…']],
]);

function glyph(name) {
  const span = document.createElement('span');
  span.className = 'w95-glyph';
  span.innerHTML = iconSvg(name);
  return span;
}

function addCaret(el, light = false) {
  const caret = document.createElement('span');
  caret.className = light ? 'w95-caret light' : 'w95-caret';
  el.appendChild(caret);
}

export function findControl(win, label) {
  return [...win.el.querySelectorAll('[data-label]')].find((node) => node.dataset.label === label);
}

export function startTree(era) {
  const accessories = [
    { label: 'Notepad', icon: 'notepad' },
    { label: 'WordPad', icon: 'wordpad' },
    { label: 'Paint', icon: 'paint' },
    { label: 'Calculator', icon: 'calculator' },
    {
      label: 'Games',
      icon: 'folder',
      children: [
        { label: 'Solitaire', icon: 'solitaire' },
        { label: 'Minesweeper', icon: 'mine' },
      ],
    },
  ];
  const programs = [
    { label: 'Accessories', icon: 'folder', children: accessories },
    { label: 'StartUp', icon: 'folder' },
    { label: 'MS-DOS Prompt', icon: 'dos' },
    { label: 'Windows Explorer', icon: 'explorer' },
  ];
  if (era === '98') {
    programs.splice(1, 0, { label: 'Internet Explorer', icon: 'ie' });
  }
  return [
    {
      label: 'Programs',
      icon: 'programs',
      children: programs,
    },
    { label: 'Documents', icon: 'documents' },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Control Panel', icon: 'settings' },
        { label: 'Printers', icon: 'printer' },
      ],
    },
    {
      label: 'Find',
      icon: 'find',
      children: [
        { label: 'Files or Folders…', icon: 'find' },
        { label: 'Computer…', icon: 'computer' },
      ],
    },
    { label: 'Help', icon: 'help' },
    { divider: true },
    { label: 'Run…', icon: 'run' },
    { label: 'Shut Down…', icon: 'shutdown' },
  ];
}

function statusLine(text) {
  const bar = document.createElement('div');
  bar.className = 'w95-status';
  bar.textContent = text;
  return bar;
}

function largeIcon(label, name) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'w95-licon';
  btn.dataset.label = label;
  btn.appendChild(glyph(name));
  const text = document.createElement('span');
  text.textContent = label;
  btn.appendChild(text);
  return btn;
}

export function openMyComputer(engine) {
  const root = document.createElement('div');
  root.className = 'w95-app';
  const view = document.createElement('div');
  view.className = 'w95-licons w95-sunken';
  const drives = [
    ['3½ Floppy (A:)', 'floppy'],
    ['(C:)', 'drive'],
    ['(D:)', 'cd'],
  ];
  for (const [label, name] of drives) view.appendChild(largeIcon(label, name));
  const status = statusLine('3 object(s)');
  root.append(view, status);
  const win = engine.createWindow({
    title: 'My Computer',
    icon: 'computer',
    width: 440,
    height: 320,
    x: 120,
    y: 28,
    menus: FILE_MENUS,
    node: root,
  });
  win.view = view;
  win.statusEl = status;
  return win;
}

const DRIVE_C = [
  ['Windows', 'folder'],
  ['Program Files', 'folder'],
  ['My Documents', 'documents'],
  ['NOTES.TXT', 'file'],
];

export function showDriveC(win) {
  win.view.replaceChildren();
  for (const [label, name] of DRIVE_C) win.view.appendChild(largeIcon(label, name));
  win.titleEl.textContent = '(C:)';
  win.taskText.textContent = '(C:)';
  win.title = '(C:)';
  win.statusEl.textContent = '4 object(s)';
}

function treeButton(label, name, depth) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.dataset.label = label;
  btn.style.paddingLeft = `${4 + depth * 12}px`;
  btn.appendChild(glyph(name));
  btn.appendChild(document.createTextNode(label));
  return btn;
}

function fileRow(name, size, type, icon) {
  const row = document.createElement('div');
  row.className = 'w95-file';
  row.dataset.label = name;
  const title = document.createElement('span');
  title.className = 'w95-name';
  title.appendChild(glyph(icon));
  title.appendChild(document.createTextNode(name));
  row.appendChild(title);
  for (const value of [size, type, DATE]) {
    const cell = document.createElement('span');
    cell.textContent = value;
    row.appendChild(cell);
  }
  return row;
}

const C_FILES = [
  ['Windows', '', 'File Folder', 'folder'],
  ['Program Files', '', 'File Folder', 'folder'],
  ['My Documents', '', 'File Folder', 'documents'],
  ['NOTES.TXT', '1KB', 'Text Document', 'file'],
];

const WINDOWS_FILES = [
  ['Explorer.exe', '200KB', 'Application', 'exe'],
  ['Notepad.exe', '45KB', 'Application', 'exe'],
  ['Wordpad.exe', '180KB', 'Application', 'exe'],
  ['Sol.exe', '156KB', 'Application', 'exe'],
  ['Winmine.exe', '40KB', 'Application', 'exe'],
];

function fillList(list, rows) {
  list.replaceChildren();
  const head = document.createElement('div');
  head.className = 'w95-cols';
  for (const label of ['Name', 'Size', 'Type', 'Modified']) {
    const span = document.createElement('span');
    span.textContent = label;
    head.appendChild(span);
  }
  list.appendChild(head);
  for (const row of rows) list.appendChild(fileRow(...row));
}

export function openExplorer(engine) {
  const root = document.createElement('div');
  root.className = 'w95-app';
  const body = document.createElement('div');
  body.className = 'w95-explore w95-sunken';
  const tree = document.createElement('div');
  tree.className = 'w95-tree';
  const nodes = [
    ['Desktop', 'desk', 0],
    ['My Computer', 'computer', 1],
    ['3½ Floppy (A:)', 'floppy', 2],
    ['(C:)', 'drive', 2],
    ['Windows', 'folder', 3],
    ['Program Files', 'folder', 3],
    ['My Documents', 'documents', 3],
    ['(D:)', 'cd', 2],
    ['Recycle Bin', 'recycle', 1],
  ];
  for (const [label, name, depth] of nodes) tree.appendChild(treeButton(label, name, depth));
  const list = document.createElement('div');
  list.className = 'w95-list';
  fillList(list, C_FILES);
  body.append(tree, list);
  const status = statusLine('4 object(s)');
  root.append(body, status);
  const win = engine.createWindow({
    title: 'Exploring - C:\\',
    icon: 'explorer',
    width: 560,
    height: 380,
    x: 108,
    y: 16,
    menus: FILE_MENUS,
    node: root,
  });
  win.treeEl = tree;
  win.listEl = list;
  win.statusEl = status;
  const current = [...tree.querySelectorAll('button')].find((node) => node.dataset.label === '(C:)');
  current?.classList.add('selected');
  return win;
}

export function showExplorerDir(win, id) {
  const rows = id === 'Windows' ? WINDOWS_FILES : C_FILES;
  fillList(win.listEl, rows);
  win.treeEl.querySelectorAll('button').forEach((node) => node.classList.remove('selected'));
  const current = [...win.treeEl.querySelectorAll('button')].find((node) => node.dataset.label === id);
  current?.classList.add('selected');
  const title = id === 'Windows' ? 'Exploring - C:\\Windows' : 'Exploring - C:\\';
  win.titleEl.textContent = title;
  win.taskText.textContent = title;
  win.title = title;
  win.statusEl.textContent = `${rows.length} object(s)`;
}

function editor(className, text, light = false) {
  const doc = document.createElement('div');
  doc.className = `${className} w95-sunken`;
  doc.appendChild(document.createTextNode(text));
  addCaret(doc, light);
  return doc;
}

export function openNotepad(engine, x = 150, y = 36) {
  const doc = editor('w95-note w95-app', NOTES);
  const win = engine.createWindow({
    title: 'Notepad - NOTES.TXT',
    icon: 'notepad',
    width: 480,
    height: 330,
    x,
    y,
    menus: NOTE_MENUS,
    node: doc,
  });
  win.docEl = doc;
  return win;
}

export function openWordPad(engine) {
  const root = document.createElement('div');
  root.className = 'w95-app';
  const ruler = document.createElement('div');
  ruler.className = 'w95-ruler';
  const doc = editor('w95-write w95-app', LETTER);
  root.append(ruler, doc);
  const win = engine.createWindow({
    title: 'Document - WordPad',
    icon: 'wordpad',
    width: 520,
    height: 370,
    x: 130,
    y: 24,
    menus: WORD_MENUS,
    node: root,
  });
  win.docEl = doc;
  return win;
}

export function openPaint(engine) {
  const root = document.createElement('div');
  root.className = 'w95-app';
  const main = document.createElement('div');
  main.className = 'w95-paint-main';
  const tools = document.createElement('div');
  tools.className = 'w95-tools';
  let brush = null;
  for (const name of ['Pick', 'Brush', 'Line', 'Box', 'Fill', 'Text', 'Erase', 'Curve']) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `w95-tool${name === 'Brush' ? ' on' : ''}`;
    btn.dataset.label = name;
    btn.textContent = name.slice(0, 1);
    btn.setAttribute('aria-label', name);
    if (name === 'Brush') brush = btn;
    tools.appendChild(btn);
  }
  const wrap = document.createElement('div');
  wrap.className = 'w95-canvas-wrap w95-sunken';
  const canvas = document.createElement('canvas');
  wrap.appendChild(canvas);
  main.append(tools, wrap);
  const palette = document.createElement('div');
  palette.className = 'w95-palette';
  const colors = ['#000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#fff', '#c0c0c0', '#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f'];
  let navy = null;
  for (const color of colors) {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = `w95-swatch${color === '#000080' ? ' on' : ''}`;
    swatch.style.background = color;
    swatch.dataset.label = color;
    if (color === '#000080') navy = swatch;
    palette.appendChild(swatch);
  }
  root.append(main, palette);
  const win = engine.createWindow({
    title: 'untitled - Paint',
    icon: 'paint',
    width: 540,
    height: 390,
    x: 118,
    y: 18,
    menus: PAINT_MENUS,
    node: root,
  });
  const w = Math.max(220, wrap.clientWidth || 360);
  const h = Math.max(140, wrap.clientHeight || 220);
  canvas.width = w;
  canvas.height = h;
  win.canvas = canvas;
  win.brush = brush;
  win.navy = navy;
  return win;
}

export function drawFlag(ctx, t, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  const panes = [
    { color: '#ff0000', pts: [[0.16, 0.22], [0.46, 0.16], [0.44, 0.46], [0.14, 0.5]] },
    { color: '#00a000', pts: [[0.5, 0.16], [0.84, 0.22], [0.8, 0.5], [0.48, 0.46]] },
    { color: '#0000ee', pts: [[0.14, 0.54], [0.44, 0.5], [0.42, 0.82], [0.12, 0.84]] },
    { color: '#ffe000', pts: [[0.48, 0.5], [0.8, 0.54], [0.76, 0.86], [0.46, 0.82]] },
  ];
  const n = Math.ceil(t * panes.length);
  ctx.lineWidth = Math.max(1, w / 280);
  ctx.lineJoin = 'miter';
  for (let i = 0; i < n; i += 1) {
    const pane = panes[i];
    ctx.beginPath();
    pane.pts.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(w * x, h * y);
      else ctx.lineTo(w * x, h * y);
    });
    ctx.closePath();
    ctx.fillStyle = pane.color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
  }
}

function makeCard(rank, suit, x, y) {
  const el = document.createElement('div');
  const red = suit === '♥' || suit === '♦';
  el.className = `w95-card ${red ? 'red' : 'black'}`;
  el.dataset.card = `${rank}${suit === '♥' ? 'H' : suit === '♠' ? 'S' : suit === '♦' ? 'D' : 'C'}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.zIndex = String(2 + Math.round(y / 20));
  el.append(document.createTextNode(rank));
  const mark = document.createElement('div');
  mark.className = 'suit';
  mark.textContent = suit;
  el.appendChild(mark);
  return el;
}

export function openSolitaire(engine) {
  const felt = document.createElement('div');
  felt.className = 'w95-felt w95-app';
  const back = document.createElement('div');
  back.className = 'w95-card back';
  back.style.left = '14px';
  back.style.top = '14px';
  felt.appendChild(back);
  felt.appendChild(makeCard('7', '♦', 72, 14));
  const slot = document.createElement('div');
  slot.className = 'w95-slot';
  slot.style.left = '246px';
  slot.style.top = '14px';
  felt.appendChild(slot);
  for (const x of [304, 362, 420]) {
    const empty = document.createElement('div');
    empty.className = 'w95-slot';
    empty.style.left = `${x}px`;
    empty.style.top = '14px';
    felt.appendChild(empty);
  }
  felt.append(
    makeCard('K', '♠', 14, 108),
    makeCard('4', '♣', 72, 108),
    makeCard('3', '♥', 72, 130),
    makeCard('Q', '♦', 188, 108),
    makeCard('A', '♥', 130, 108),
  );
  const win = engine.createWindow({
    title: 'Solitaire',
    icon: 'solitaire',
    width: 500,
    height: 380,
    x: 140,
    y: 28,
    scale: false,
    menus: SOL_MENUS,
    node: felt,
  });
  win.ace = felt.querySelector('[data-card="AH"]');
  win.slot = slot;
  return win;
}

function mineCount(x, y) {
  let n = 0;
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (!dx && !dy) continue;
      if (MINES.has(`${x + dx},${y + dy}`)) n += 1;
    }
  }
  return n;
}

export function openMinesweeper(engine) {
  const root = document.createElement('div');
  root.className = 'w95-app w95-mine';
  const top = document.createElement('div');
  top.className = 'w95-mine-top w95-sunken';
  const count = document.createElement('div');
  count.className = 'w95-lcd';
  count.textContent = '010';
  const face = document.createElement('button');
  face.type = 'button';
  face.className = 'w95-face';
  face.innerHTML = SMILE;
  face.setAttribute('aria-label', 'New game');
  const timer = document.createElement('div');
  timer.className = 'w95-lcd';
  timer.textContent = '000';
  top.append(count, face, timer);
  const grid = document.createElement('div');
  grid.className = 'w95-grid';
  for (let y = 0; y < 9; y += 1) {
    for (let x = 0; x < 9; x += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'w95-cell';
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      cell.dataset.label = `${x},${y}`;
      grid.appendChild(cell);
    }
  }
  root.append(top, grid);
  const win = engine.createWindow({
    title: 'Minesweeper',
    icon: 'mine',
    width: 236,
    height: 292,
    x: 180,
    y: 40,
    scale: false,
    menus: MINE_MENUS,
    node: root,
  });
  win.grid = grid;
  win.timer = timer;
  win.seen = new Set();
  return win;
}

export function revealMine(win, x, y) {
  const flood = (cx, cy) => {
    const key = `${cx},${cy}`;
    if (cx < 0 || cy < 0 || cx > 8 || cy > 8 || win.seen.has(key) || MINES.has(key)) return;
    win.seen.add(key);
    const cell = win.grid.querySelector(`[data-x="${cx}"][data-y="${cy}"]`);
    const n = mineCount(cx, cy);
    cell.classList.add('open');
    if (n) {
      cell.classList.add(`c${Math.min(4, n)}`);
      cell.textContent = String(n);
      return;
    }
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) flood(cx + dx, cy + dy);
    }
  };
  flood(x, y);
}

export function openCalculator(engine) {
  const root = document.createElement('div');
  root.className = 'w95-app w95-calc';
  const display = document.createElement('div');
  display.className = 'w95-calc-display';
  display.textContent = '0';
  const keys = document.createElement('div');
  keys.className = 'w95-keys';
  for (const key of ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+']) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w95-key';
    btn.dataset.label = key;
    btn.textContent = key;
    keys.appendChild(btn);
  }
  root.append(display, keys);
  const win = engine.createWindow({
    title: 'Calculator',
    icon: 'calculator',
    width: 248,
    height: 292,
    x: 200,
    y: 48,
    scale: false,
    menus: CALC_MENUS,
    node: root,
  });
  win.display = display;
  return win;
}

export function openDosPrompt(engine) {
  const term = document.createElement('div');
  term.className = 'w95-dos w95-app';
  term.append(document.createTextNode('C:\\WINDOWS>'));
  addCaret(term, true);
  const win = engine.createWindow({
    title: 'MS-DOS Prompt',
    icon: 'dos',
    width: 560,
    height: 280,
    x: 124,
    y: 40,
    node: term,
  });
  win.termEl = term;
  return win;
}

export function termInsert(win, text) {
  const caret = win.termEl.querySelector('.w95-caret');
  win.termEl.insertBefore(document.createTextNode(text), caret);
  win.termEl.scrollTop = win.termEl.scrollHeight;
}

export function openRecycle(engine) {
  const root = document.createElement('div');
  root.className = 'w95-app';
  const view = document.createElement('div');
  view.className = 'w95-licons w95-sunken';
  view.appendChild(largeIcon('SETUP.EXE', 'exe'));
  const status = statusLine('1 object(s)');
  root.append(view, status);
  const win = engine.createWindow({
    title: 'Recycle Bin',
    icon: 'recycle',
    width: 420,
    height: 300,
    x: 160,
    y: 36,
    menus: FILE_MENUS,
    node: root,
  });
  win.view = view;
  return win;
}

export function openInternet(engine) {
  const root = document.createElement('div');
  root.className = 'w95-app';
  const row = document.createElement('div');
  row.className = 'w95-addrrow';
  const label = document.createElement('span');
  label.textContent = 'Address';
  const addr = document.createElement('div');
  addr.className = 'w95-addr';
  addr.textContent = 'http://home/welcome.htm';
  row.append(label, addr);
  const page = document.createElement('div');
  page.className = 'w95-page w95-sunken';
  const heading = document.createElement('h1');
  heading.textContent = 'Welcome';
  const lead = document.createElement('p');
  lead.textContent = 'This computer just found the Internet.';
  const more = document.createElement('p');
  more.textContent = 'Internet Explorer is ready on this desk.';
  page.append(heading, lead, more);
  root.append(row, page);
  return engine.createWindow({
    title: 'Welcome - Internet Explorer',
    icon: 'ie',
    width: 560,
    height: 400,
    x: 110,
    y: 16,
    menus: IE_MENUS,
    node: root,
  });
}

export function openWelcome(engine) {
  const tips = [
    "If you don't know how to do something, you can look it up in Help. Just click the Start button, and then click Help.",
    'Every open window keeps a button on the taskbar.',
    'Right-click the desktop when you want a new wallpaper or screen saver.',
  ];
  const root = document.createElement('div');
  root.className = 'w95-dialog';
  const heading = document.createElement('h2');
  heading.className = 'w95-welcome-h';
  heading.textContent = 'Did you know…';
  const tip = document.createElement('p');
  tip.className = 'w95-welcome-tip';
  tip.textContent = tips[0];
  const check = document.createElement('label');
  check.className = 'w95-welcome-check';
  const mark = document.createElement('i');
  const caption = document.createElement('span');
  caption.textContent = 'Show this Welcome screen the next time you start Windows';
  check.append(mark, caption);
  const buttons = document.createElement('div');
  buttons.className = 'w95-dlg-btns';
  for (const [label, on] of [['What\'s New', false], ['Online Registration', false], ['Next Tip', false], ['Close', true]]) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `w95-btn${on ? ' default' : ''}`;
    btn.dataset.label = label;
    btn.textContent = label;
    buttons.appendChild(btn);
  }
  root.append(heading, tip, check, buttons);
  const win = engine.createWindow({
    title: 'Welcome',
    icon: 'computer',
    width: 460,
    height: 248,
    scale: false,
    center: true,
    node: root,
  });
  win.tips = tips;
  win.tipEl = tip;
  win.tipIndex = 0;
  win.nextBtn = buttons.querySelector('[data-label="Next Tip"]');
  win.closeBtn = buttons.querySelector('[data-label="Close"]');
  return win;
}

export function openShutdown(engine) {
  const win98 = engine.era === '98';
  const root = document.createElement('div');
  root.className = 'w95-dialog';
  const head = document.createElement('div');
  head.className = 'w95-shut-head';
  head.appendChild(glyph('computer'));
  const question = document.createElement('p');
  question.textContent = win98 ? 'What do you want the computer to do?' : 'Are you sure you want to:';
  head.appendChild(question);
  const choices = document.createElement('div');
  const options = win98
    ? [['Shut down', true], ['Restart', false], ['Restart in MS-DOS mode', false]]
    : [
      ['Shut down the computer?', true],
      ['Restart the computer?', false],
      ['Restart the computer in MS-DOS mode?', false],
    ];
  for (const [label, on] of options) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `w95-choice${on ? ' on' : ''}`;
    btn.dataset.label = label;
    const mark = document.createElement('i');
    const text = document.createElement('span');
    text.textContent = label;
    btn.append(mark, text);
    choices.appendChild(btn);
  }
  const buttons = document.createElement('div');
  buttons.className = 'w95-dlg-btns';
  const ok = document.createElement('button');
  ok.type = 'button';
  ok.className = 'w95-btn default';
  ok.dataset.label = win98 ? 'OK' : 'Yes';
  ok.textContent = win98 ? 'OK' : 'Yes';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'w95-btn';
  cancel.dataset.label = win98 ? 'Cancel' : 'No';
  cancel.textContent = win98 ? 'Cancel' : 'No';
  buttons.append(ok, cancel);
  if (win98) {
    const help = document.createElement('button');
    help.type = 'button';
    help.className = 'w95-btn';
    help.textContent = 'Help';
    buttons.appendChild(help);
  }
  root.append(head, choices, buttons);
  const win = engine.createWindow({
    title: 'Shut Down Windows',
    icon: 'shutdown',
    width: 420,
    height: 230,
    scale: false,
    center: true,
    node: root,
  });
  win.okBtn = ok;
  return win;
}
