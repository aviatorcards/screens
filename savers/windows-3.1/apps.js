import { FLAG, iconSvg } from './icons.js';

export const NOTES = `[1985 · MS-DOS 3.1] Started NOTES.TXT on a 286 with 640K RAM.
[1992 · Windows 3.1] Overlapping windows, TrueType fonts & Solitaire!`;

const LETTER = `April 6, 1992

TrueType finally made it onto this 386.
The letter is Times New Roman. Program Manager
is still on the desk when this window closes.`;

export const GROUPS = {
  Main: [
    ['File Manager', 'fileman'],
    ['Control Panel', 'control'],
    ['Print Manager', 'printer'],
    ['Clipboard Viewer', 'clip'],
    ['MS-DOS Prompt', 'dos'],
    ['Windows Setup', 'setup'],
    ['PIF Editor', 'pif'],
    ['Read Me', 'readme'],
  ],
  Accessories: [
    ['Write', 'write'],
    ['Paintbrush', 'paint'],
    ['Notepad', 'notepad'],
    ['Cardfile', 'card'],
    ['Calendar', 'calendar'],
    ['Calculator', 'calc'],
    ['Clock', 'clock'],
    ['Character Map', 'charmap'],
    ['Media Player', 'media'],
    ['Sound Recorder', 'sound'],
    ['Terminal', 'term'],
    ['Object Packager', 'pack'],
    ['Recorder', 'recorder'],
  ],
  Games: [
    ['Solitaire', 'solitaire'],
    ['Minesweeper', 'mine'],
  ],
  StartUp: [],
};

const CP_ICONS = [
  ['Color', 'color'],
  ['Fonts', 'fonts'],
  ['Ports', 'ports'],
  ['Mouse', 'mouse'],
  ['Desktop', 'desktop'],
  ['Keyboard', 'keyboard'],
  ['Printers', 'printer'],
  ['International', 'intl'],
  ['Date/Time', 'datetime'],
  ['Sound', 'sound'],
  ['Drivers', 'drivers'],
  ['386 Enhanced', 'chip386'],
];

const DIRS = {
  root: {
    title: 'C:\\*.*',
    files: [],
  },
  dos: {
    title: 'C:\\DOS\\*.*',
    files: [
      ['COMMAND.COM', '48K', '04-09-91'],
      ['HIMEM.SYS', '12K', '04-09-91'],
    ],
  },
  windows: {
    title: 'C:\\WINDOWS\\*.*',
    files: [
      ['PROGMAN.EXE', '115K', '03-10-92'],
      ['WINFILE.EXE', '146K', '03-10-92'],
      ['NOTEPAD.EXE', '33K', '03-10-92'],
      ['WRITE.EXE', '245K', '03-10-92'],
      ['PBRUSH.EXE', '133K', '03-10-92'],
      ['SOL.EXE', '181K', '03-10-92'],
      ['WINMINE.EXE', '28K', '03-10-92'],
      ['NOTES.TXT', '1K', '04-06-92'],
      ['SYSTEM.INI', '2K', '03-10-92'],
      ['WIN.INI', '33K', '03-10-92'],
    ],
  },
  system: {
    title: 'C:\\WINDOWS\\SYSTEM\\*.*',
    files: [
      ['KRNL386.EXE', '75K', '03-10-92'],
      ['USER.EXE', '264K', '03-10-92'],
      ['GDI.EXE', '220K', '03-10-92'],
    ],
  },
};

const TREE = [
  { id: 'root', label: 'C:\\', depth: 0, open: true },
  { id: 'dos', label: 'DOS', depth: 1, open: false },
  { id: 'windows', label: 'WINDOWS', depth: 1, open: true },
  { id: 'system', label: 'SYSTEM', depth: 2, open: false },
];

const MINES = new Set(['0,4', '1,7', '2,8', '3,1', '4,8', '5,6', '6,2', '7,7', '8,0', '8,4']);

const PM_MENUS = [
  { label: 'File', items: [
    { label: 'New…' }, { label: 'Open', shortcut: 'Enter' }, { divider: true },
    { label: 'Move', disabled: true }, { label: 'Copy', disabled: true }, { label: 'Delete', disabled: true },
    { label: 'Properties…', shortcut: 'Alt+Enter' }, { divider: true },
    { label: 'Run…' }, { label: 'Exit Windows…' },
  ]},
  { label: 'Options', items: [
    { label: 'Auto Arrange', checked: true },
    { label: 'Minimize on Use' },
    { label: 'Save Settings on Exit', checked: true },
  ]},
  { label: 'Window', items: [
    { label: 'Cascade', shortcut: 'Shift+F5' },
    { label: 'Tile', shortcut: 'Shift+F4' },
    { label: 'Arrange Icons' },
    { divider: true },
    { label: '1 Main' }, { label: '2 Accessories' }, { label: '3 Games' }, { label: '4 StartUp' },
  ]},
  { label: 'Help', items: [
    { label: 'Contents' }, { label: 'Search for Help On…' }, { divider: true },
    { label: 'About Program Manager…' },
  ]},
];

const NOTE_MENUS = [
  { label: 'File', items: [
    { label: 'New' }, { label: 'Open…' }, { label: 'Save' }, { label: 'Save As…' },
    { divider: true }, { label: 'Exit' },
  ]},
  { label: 'Edit', items: [
    { label: 'Undo', disabled: true }, { divider: true },
    { label: 'Cut' }, { label: 'Copy' }, { label: 'Paste', disabled: true }, { label: 'Select All' },
  ]},
  { label: 'Search', items: [{ label: 'Find…' }, { label: 'Find Next', shortcut: 'F3' }] },
  { label: 'Help', items: [{ label: 'Contents' }, { label: 'About Notepad…' }] },
];

const WRITE_MENUS = [
  { label: 'File', items: [
    { label: 'New…' }, { label: 'Open…' }, { label: 'Save' }, { label: 'Save As…' },
    { divider: true }, { label: 'Exit' },
  ]},
  { label: 'Edit', items: [
    { label: 'Undo', disabled: true }, { divider: true },
    { label: 'Cut' }, { label: 'Copy' }, { label: 'Paste', disabled: true },
  ]},
  { label: 'Find', items: [{ label: 'Find…' }, { label: 'Replace…' }] },
  { label: 'Character', items: [
    { label: 'Bold' }, { label: 'Italic' }, { label: 'Underline' }, { divider: true },
    { label: 'Normal' }, { divider: true }, { label: 'Fonts…' },
  ]},
  { label: 'Paragraph', items: [
    { label: 'Left', checked: true }, { label: 'Centered' }, { label: 'Right' }, { label: 'Justified' },
  ]},
  { label: 'Document', items: [
    { label: 'Header…' }, { label: 'Footer…' }, { label: 'Ruler', checked: true },
  ]},
  { label: 'Help', items: [{ label: 'Contents' }, { label: 'About Write…' }] },
];

const FM_MENUS = [
  { label: 'File', items: [{ label: 'Open', shortcut: 'Enter' }, { label: 'Run…' }, { divider: true }, { label: 'Exit' }] },
  { label: 'Disk', items: [{ label: 'Copy Disk…' }, { label: 'Label Disk…' }, { label: 'Format Disk…' }] },
  { label: 'Tree', items: [{ label: 'Expand One Level' }, { label: 'Expand Branch' }, { label: 'Expand All' }] },
  { label: 'View', items: [{ label: 'Tree and Directory', checked: true }, { label: 'Name', checked: true }, { label: 'All File Details' }] },
  { label: 'Options', items: [{ label: 'Confirmation…' }, { label: 'Font…' }, { label: 'Status Bar', checked: true }] },
  { label: 'Window', items: [{ label: 'Cascade' }, { label: 'Tile' }, { label: 'Refresh' }] },
  { label: 'Help', items: [{ label: 'Contents' }, { label: 'About File Manager…' }] },
];

const SOL_MENUS = [
  { label: 'Game', items: [
    { label: 'Deal', shortcut: 'F2' }, { label: 'Undo', disabled: true },
    { label: 'Deck…' }, { label: 'Options…' }, { divider: true }, { label: 'Exit' },
  ]},
  { label: 'Help', items: [{ label: 'Contents' }, { label: 'About Solitaire…' }] },
];

const MINE_MENUS = [
  { label: 'Game', items: [
    { label: 'New', shortcut: 'F2' }, { divider: true },
    { label: 'Beginner', checked: true }, { label: 'Intermediate' }, { label: 'Expert' },
    { divider: true }, { label: 'Exit' },
  ]},
  { label: 'Help', items: [{ label: 'Contents' }, { label: 'About Minesweeper…' }] },
];

const CALC_MENUS = [
  { label: 'Edit', items: [{ label: 'Copy', shortcut: 'Ctrl+C' }, { label: 'Paste', shortcut: 'Ctrl+V' }] },
  { label: 'View', items: [{ label: 'Standard', checked: true }, { label: 'Scientific' }] },
  { label: 'Help', items: [{ label: 'Contents' }, { label: 'About Calculator…' }] },
];

const PAINT_MENUS = [
  { label: 'File', items: [{ label: 'New' }, { label: 'Open…' }, { label: 'Save' }, { divider: true }, { label: 'Exit' }] },
  { label: 'Edit', items: [{ label: 'Undo', shortcut: 'Alt+Backspace' }, { label: 'Cut' }, { label: 'Copy' }, { label: 'Paste', disabled: true }] },
  { label: 'View', items: [{ label: 'Zoom In' }, { label: 'Zoom Out' }, { label: 'View Picture' }] },
  { label: 'Text', items: [{ label: 'Fonts…' }] },
  { label: 'Pick', items: [{ label: 'Flip Horizontal' }, { label: 'Flip Vertical' }] },
  { label: 'Options', items: [{ label: 'Image Attributes…' }, { label: 'Brush Shapes…' }] },
  { label: 'Help', items: [{ label: 'Contents' }, { label: 'About Paintbrush…' }] },
];

const CP_MENUS = [
  { label: 'Settings', items: [{ label: 'Desktop' }, { label: 'Color' }, { label: 'Fonts' }, { divider: true }, { label: 'Exit' }] },
  { label: 'Help', items: [{ label: 'Contents' }, { label: 'About Control Panel…' }] },
];

function programIcon(label, icon, group) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'w31-picon';
  btn.dataset.label = label;
  if (group) btn.dataset.group = group;
  const glyph = document.createElement('span');
  glyph.className = 'w31-glyph';
  glyph.innerHTML = iconSvg(icon);
  const text = document.createElement('span');
  text.className = 'w31-plabel';
  text.textContent = label;
  btn.append(glyph, text);
  return btn;
}

function addCaret(el, light = false) {
  const caret = document.createElement('span');
  caret.className = light ? 'w31-caret light' : 'w31-caret';
  el.appendChild(caret);
}

export function findControl(win, label) {
  return [...win.el.querySelectorAll('[data-label]')].find((node) => node.dataset.label === label);
}

export function openProgramManager(engine) {
  const surface = document.createElement('div');
  surface.className = 'w31-pm w31-fill';
  const minis = document.createElement('div');
  minis.className = 'w31-minis';
  for (const name of ['Accessories', 'Games', 'StartUp']) {
    minis.appendChild(programIcon(name, 'group', name));
  }
  surface.appendChild(minis);
  const pm = engine.createWindow({
    title: 'Program Manager',
    width: 1220,
    height: 780,
    x: 14,
    y: 10,
    menus: PM_MENUS,
    node: surface,
  });
  pm.clientEl = surface;
  const main = openGroup(engine, pm, 'Main');
  return { pm, main };
}

export function openGroup(engine, pm, name) {
  const existing = engine.windows.find((win) => win.parent === pm && win.groupName === name);
  if (existing) {
    engine.focusWindow(existing);
    return existing;
  }
  const mini = pm.clientEl.querySelector(`[data-group="${CSS.escape(name)}"]`);
  if (mini) mini.remove();
  const icons = document.createElement('div');
  icons.className = 'w31-icons w31-fill';
  for (const [label, icon] of GROUPS[name]) icons.appendChild(programIcon(label, icon));
  const openCount = engine.windows.filter((win) => win.parent === pm).length;
  const count = GROUPS[name].length;
  const cols = count ? Math.min(5, count) : 3;
  const rows = count ? Math.ceil(count / cols) : 1;
  const win = engine.createWindow({
    title: name,
    parent: pm,
    scale: false,
    width: cols * 74 + 16,
    height: rows * 72 + 34,
    x: 8 + openCount * 22,
    y: 8 + openCount * 26,
    node: icons,
  });
  win.groupName = name;
  return win;
}

function openDialog(engine, { title, width, height, buttons, defaultLabel, build }) {
  const root = document.createElement('div');
  root.className = 'w31-dialog w31-fill';
  build(root);
  const actions = document.createElement('div');
  actions.className = 'w31-actions';
  const map = {};
  for (const label of buttons) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w31-btn' + (label === defaultLabel ? ' default' : '');
    btn.textContent = label;
    btn.dataset.label = label;
    actions.appendChild(btn);
    map[label] = btn;
  }
  root.appendChild(actions);
  const win = engine.createWindow({
    title, width, height, center: true, scale: false, node: root,
  });
  win.okBtn = map[defaultLabel] || map[buttons[0]];
  win.buttons = map;
  return win;
}

export function openNotepad(engine) {
  const doc = document.createElement('div');
  doc.className = 'w31-note w31-fill';
  doc.append(document.createTextNode(NOTES));
  addCaret(doc);
  const win = engine.createWindow({
    title: 'Notepad - NOTES.TXT',
    width: 480,
    height: 320,
    x: 96,
    y: 48,
    menus: NOTE_MENUS,
    node: doc,
  });
  win.docEl = doc;
  return win;
}

export function openWrite(engine) {
  const wrap = document.createElement('div');
  wrap.className = 'w31-fill';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  const ruler = document.createElement('div');
  ruler.className = 'w31-ruler';
  const doc = document.createElement('div');
  doc.className = 'w31-letter w31-fill';
  doc.append(document.createTextNode(LETTER));
  addCaret(doc);
  wrap.append(ruler, doc);
  const win = engine.createWindow({
    title: 'Write - NOTES.WRI',
    width: 540,
    height: 380,
    x: 110,
    y: 40,
    menus: WRITE_MENUS,
    node: wrap,
  });
  win.docEl = doc;
  return win;
}

export function openFontDialog(engine) {
  return openDialog(engine, {
    title: 'Fonts',
    width: 460,
    height: 280,
    buttons: ['OK', 'Cancel'],
    defaultLabel: 'OK',
    build(root) {
      const row = document.createElement('div');
      row.className = 'w31-fonts';
      const fonts = ['Arial', 'Courier New', 'Symbol', 'Times New Roman', 'Wingdings'];
      const sizes = ['10', '12', '14', '18', '24'];
      for (const [caption, values, selected] of [['Font', fonts, 'Times New Roman'], ['Size', sizes, '12']]) {
        const label = document.createElement('label');
        label.append(document.createTextNode(caption));
        const list = document.createElement('div');
        list.className = 'w31-sunlist';
        for (const value of values) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'w31-font' + (value === selected ? ' selected' : '');
          btn.dataset.label = value;
          btn.textContent = value;
          list.appendChild(btn);
        }
        label.appendChild(list);
        row.appendChild(label);
      }
      const sample = document.createElement('div');
      sample.className = 'w31-sample';
      sample.textContent = 'AaBbYyZz';
      root.append(row, sample);
    },
  });
}

export function openFileManager(engine) {
  const root = document.createElement('div');
  root.className = 'w31-fm w31-fill';
  const drives = document.createElement('div');
  drives.className = 'w31-drives';
  for (const [name, on] of [['A:', false], ['C:', true], ['D:', false]]) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w31-drive' + (on ? ' on' : '');
    btn.textContent = name;
    drives.appendChild(btn);
  }
  const split = document.createElement('div');
  split.className = 'w31-split';
  const tree = document.createElement('div');
  tree.className = 'w31-tree';
  for (const item of TREE) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w31-dir';
    btn.dataset.dir = item.id;
    btn.dataset.label = item.label;
    btn.style.paddingLeft = `${6 + item.depth * 14}px`;
    btn.textContent = `${item.open ? '[-]' : '[+]'} ${item.label}`;
    tree.appendChild(btn);
  }
  const files = document.createElement('div');
  files.className = 'w31-files';
  const cols = document.createElement('div');
  cols.className = 'w31-cols';
  for (const name of ['Name', 'Size', 'Date']) {
    const span = document.createElement('span');
    span.textContent = name;
    cols.appendChild(span);
  }
  const rows = document.createElement('div');
  rows.className = 'w31-rows';
  files.append(cols, rows);
  split.append(tree, files);
  const status = document.createElement('div');
  status.className = 'w31-status';
  root.append(drives, split, status);
  const win = engine.createWindow({
    title: 'File Manager',
    width: 640,
    height: 420,
    x: 70,
    y: 36,
    menus: FM_MENUS,
    node: root,
  });
  win.treeEl = tree;
  win.rowsEl = rows;
  win.statusEl = status;
  showDir(win, 'windows');
  return win;
}

export function showDir(win, id) {
  const dir = DIRS[id];
  win.treeEl.querySelectorAll('.w31-dir').forEach((node) => node.classList.toggle('selected', node.dataset.dir === id));
  win.rowsEl.replaceChildren();
  for (const [name, size, date] of dir.files) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'w31-row';
    row.dataset.label = name;
    for (const value of [name, size, date]) {
      const span = document.createElement('span');
      span.textContent = value;
      row.appendChild(span);
    }
    win.rowsEl.appendChild(row);
  }
  win.statusEl.textContent = dir.files.length === 1 ? '1 file' : `${dir.files.length} file(s)`;
  win.titleEl.textContent = `File Manager - [${dir.title}]`;
}

export function openSolitaire(engine) {
  const felt = document.createElement('div');
  felt.className = 'w31-felt w31-fill';
  const back = document.createElement('div');
  back.className = 'w31-card back';
  back.style.left = '12px';
  back.style.top = '12px';
  felt.appendChild(back);
  const waste = makeCard('7', '♦', 66, 12);
  felt.appendChild(waste);
  const slot = document.createElement('div');
  slot.className = 'w31-slot';
  slot.style.left = '230px';
  slot.style.top = '12px';
  felt.appendChild(slot);
  for (const x of [284, 338, 392]) {
    const empty = document.createElement('div');
    empty.className = 'w31-slot';
    empty.style.left = `${x}px`;
    empty.style.top = '12px';
    felt.appendChild(empty);
  }
  felt.append(
    makeCard('K', '♠', 12, 96),
    makeCard('4', '♣', 66, 96),
    makeCard('3', '♥', 66, 118),
    makeCard('Q', '♦', 174, 96),
    makeCard('A', '♥', 120, 96),
  );
  const win = engine.createWindow({
    title: 'Solitaire',
    width: 520,
    height: 400,
    x: 120,
    y: 36,
    menus: SOL_MENUS,
    node: felt,
  });
  win.ace = felt.querySelector('[data-card="AH"]');
  win.slot = slot;
  return win;
}

function makeCard(rank, suit, x, y) {
  const el = document.createElement('div');
  const red = suit === '♥' || suit === '♦';
  el.className = `w31-card ${red ? 'red' : 'black'}`;
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

export function openMinesweeper(engine) {
  const root = document.createElement('div');
  root.className = 'w31-mine w31-fill';
  const top = document.createElement('div');
  top.className = 'w31-mine-top';
  const count = document.createElement('div');
  count.className = 'w31-lcd';
  count.textContent = '010';
  const face = document.createElement('button');
  face.type = 'button';
  face.className = 'w31-face';
  face.innerHTML = iconSvg('smile');
  face.setAttribute('aria-label', 'New game');
  const timer = document.createElement('div');
  timer.className = 'w31-lcd';
  timer.textContent = '000';
  top.append(count, face, timer);
  const grid = document.createElement('div');
  grid.className = 'w31-grid';
  for (let y = 0; y < 9; y += 1) {
    for (let x = 0; x < 9; x += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'w31-cell';
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      cell.dataset.label = `${x},${y}`;
      grid.appendChild(cell);
    }
  }
  root.append(top, grid);
  const win = engine.createWindow({
    title: 'Minesweeper',
    width: 230,
    height: 286,
    x: 150,
    y: 48,
    scale: false,
    menus: MINE_MENUS,
    node: root,
  });
  win.grid = grid;
  win.timer = timer;
  win.seen = new Set();
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
  root.className = 'w31-calc w31-fill';
  const display = document.createElement('div');
  display.className = 'w31-calc-display';
  display.textContent = '0';
  const keys = document.createElement('div');
  keys.className = 'w31-keys';
  for (const key of ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+']) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w31-key';
    btn.dataset.label = key;
    btn.textContent = key;
    keys.appendChild(btn);
  }
  root.append(display, keys);
  const win = engine.createWindow({
    title: 'Calculator',
    width: 240,
    height: 260,
    x: 160,
    y: 64,
    scale: false,
    menus: CALC_MENUS,
    node: root,
  });
  win.display = display;
  return win;
}

export function openPaintbrush(engine) {
  const root = document.createElement('div');
  root.className = 'w31-paint w31-fill';
  const main = document.createElement('div');
  main.className = 'w31-paint-main';
  const tools = document.createElement('div');
  tools.className = 'w31-tools';
  const names = ['Pick', 'Brush', 'Line', 'Box', 'Fill', 'Text', 'Erase', 'Curve'];
  let brush = null;
  for (const name of names) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w31-tool' + (name === 'Brush' ? ' on' : '');
    btn.dataset.label = name;
    btn.textContent = name.slice(0, 1);
    btn.setAttribute('aria-label', name);
    if (name === 'Brush') brush = btn;
    tools.appendChild(btn);
  }
  const wrap = document.createElement('div');
  wrap.className = 'w31-canvas-wrap';
  const canvas = document.createElement('canvas');
  wrap.appendChild(canvas);
  main.append(tools, wrap);
  const palette = document.createElement('div');
  palette.className = 'w31-palette';
  const colors = ['#000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#fff', '#c0c0c0', '#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f'];
  let navy = null;
  for (const color of colors) {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'w31-swatch' + (color === '#000080' ? ' on' : '');
    swatch.style.background = color;
    swatch.dataset.color = color;
    swatch.dataset.label = color;
    if (color === '#000080') navy = swatch;
    palette.appendChild(swatch);
  }
  root.append(main, palette);
  const win = engine.createWindow({
    title: 'Paintbrush - untitled',
    width: 560,
    height: 400,
    x: 88,
    y: 32,
    menus: PAINT_MENUS,
    node: root,
  });
  const w = Math.max(240, wrap.clientWidth || 360);
  const h = Math.max(140, wrap.clientHeight || 220);
  canvas.width = w;
  canvas.height = h;
  win.canvas = canvas;
  win.brush = brush;
  win.navy = navy;
  return win;
}

export function drawHouse(ctx, t, w, h) {
  const p = (px, py) => [w * px, h * py];
  const pts = [p(0.22, 0.74), p(0.22, 0.42), p(0.5, 0.2), p(0.78, 0.42), p(0.78, 0.74), p(0.22, 0.74)];
  const door = [p(0.42, 0.74), p(0.42, 0.5), p(0.56, 0.5), p(0.56, 0.74)];
  const segs = [];
  for (let i = 1; i < pts.length; i += 1) segs.push([pts[i - 1], pts[i]]);
  for (let i = 1; i < door.length; i += 1) segs.push([door[i - 1], door[i]]);
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = Math.max(2, w / 180);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000080';
  const show = Math.max(1, Math.ceil(t * segs.length));
  ctx.beginPath();
  for (let i = 0; i < show; i += 1) {
    ctx.moveTo(segs[i][0][0], segs[i][0][1]);
    ctx.lineTo(segs[i][1][0], segs[i][1][1]);
  }
  ctx.stroke();
  if (t > 0.84) {
    ctx.fillStyle = '#7eb6ff';
    ctx.fillRect(w * 0.6, h * 0.46, w * 0.12, h * 0.14);
    ctx.strokeRect(w * 0.6, h * 0.46, w * 0.12, h * 0.14);
  }
}

export function openDosPrompt(engine) {
  const term = document.createElement('div');
  term.className = 'w31-dos w31-fill';
  term.append(document.createTextNode('C:\\WINDOWS>'));
  addCaret(term, true);
  const win = engine.createWindow({
    title: 'MS-DOS Prompt',
    width: 560,
    height: 300,
    x: 100,
    y: 56,
    node: term,
  });
  win.termEl = term;
  return win;
}

export function termInsert(win, text) {
  const caret = win.termEl.querySelector('.w31-caret');
  win.termEl.insertBefore(document.createTextNode(text), caret);
  win.termEl.scrollTop = win.termEl.scrollHeight;
}

export function openControlPanel(engine) {
  const icons = document.createElement('div');
  icons.className = 'w31-icons gray w31-fill';
  for (const [label, icon] of CP_ICONS) icons.appendChild(programIcon(label, icon));
  return engine.createWindow({
    title: 'Control Panel',
    width: 460,
    height: 300,
    x: 120,
    y: 48,
    menus: CP_MENUS,
    node: icons,
  });
}

export function openDesktopDialog(engine) {
  return openDialog(engine, {
    title: 'Desktop',
    width: 420,
    height: 236,
    buttons: ['OK', 'Cancel'],
    defaultLabel: 'OK',
    build(root) {
      const form = document.createElement('div');
      form.className = 'w31-form';
      const saver = field('Screen Saver', 'Starfield Simulation');
      form.append(
        field('Pattern', '(None)'),
        field('Wallpaper', '(None)'),
        saver.row,
        field('Delay', '2 minutes'),
      );
      root.appendChild(form);
      root.saverField = saver.box;
    },
  });
}

function field(label, value) {
  const row = document.createElement('div');
  row.className = 'w31-row';
  const name = document.createElement('span');
  name.textContent = label;
  const box = document.createElement('div');
  box.className = 'w31-field';
  box.textContent = value;
  box.dataset.label = label;
  row.append(name, box);
  return { row, box };
}

export function openClock(engine) {
  const face = document.createElement('div');
  face.className = 'w31-clock-face w31-fill';
  face.innerHTML = `<svg data-clock viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="#fff" stroke="#000" stroke-width="3"/>
    <line x1="50" y1="8" x2="50" y2="14" stroke="#000" stroke-width="2"/>
    <line x1="50" y1="86" x2="50" y2="92" stroke="#000" stroke-width="2"/>
    <line x1="8" y1="50" x2="14" y2="50" stroke="#000" stroke-width="2"/>
    <line x1="86" y1="50" x2="92" y2="50" stroke="#000" stroke-width="2"/>
    <line class="hour" x1="50" y1="50" x2="50" y2="28" stroke="#000" stroke-width="3" stroke-linecap="round"/>
    <line class="min" x1="50" y1="50" x2="50" y2="18" stroke="#000" stroke-width="2" stroke-linecap="round"/>
    <line class="sec" x1="50" y1="54" x2="50" y2="16" stroke="#c00000" stroke-width="1"/>
    <circle cx="50" cy="50" r="2.4" fill="#c00000"/>
  </svg>`;
  const win = engine.createWindow({
    title: 'Clock',
    width: 220,
    height: 230,
    x: 70,
    y: 40,
    scale: false,
    node: face,
  });
  engine._tickClocks();
  return win;
}

export function openCalendar(engine) {
  const root = document.createElement('div');
  root.className = 'w31-month w31-fill';
  const title = document.createElement('h2');
  title.textContent = 'April 1992';
  const grid = document.createElement('div');
  grid.className = 'w31-cal';
  for (const name of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) {
    const cell = document.createElement('i');
    cell.textContent = name;
    grid.appendChild(cell);
  }
  // April 1, 1992 was a Wednesday.
  for (let i = 0; i < 3; i += 1) grid.appendChild(document.createElement('b'));
  for (let day = 1; day <= 30; day += 1) {
    const cell = document.createElement('b');
    cell.textContent = String(day);
    cell.dataset.label = `day-${day}`;
    if (day === 6) cell.className = 'mark';
    grid.appendChild(cell);
  }
  root.append(title, grid);
  return engine.createWindow({
    title: 'Calendar - April 1992',
    width: 340,
    height: 280,
    x: 310,
    y: 58,
    scale: false,
    node: root,
  });
}

export function openAbout(engine) {
  return openDialog(engine, {
    title: 'About Program Manager',
    width: 360,
    height: 360,
    buttons: ['OK'],
    defaultLabel: 'OK',
    build(root) {
      root.classList.add('w31-about');
      const mark = document.createElement('div');
      mark.className = 'mark';
      mark.innerHTML = FLAG;
      const h = document.createElement('h1');
      h.textContent = 'Microsoft Windows';
      root.append(mark, h);
      for (const line of [
        'Program Manager',
        'Version 3.1',
        '',
        'Copyright 1985–1992 Microsoft Corporation',
        '',
        'This product is licensed to:',
        'Windows User',
        '',
        '386 Enhanced Mode',
        '4,096 KB free memory',
      ]) {
        if (!line) {
          const gap = document.createElement('div');
          gap.className = 'gap';
          root.appendChild(gap);
          continue;
        }
        const p = document.createElement('p');
        p.textContent = line;
        root.appendChild(p);
      }
    },
  });
}

export function openExitDialog(engine) {
  return openDialog(engine, {
    title: 'Exit Windows',
    width: 380,
    height: 150,
    buttons: ['OK', 'Cancel'],
    defaultLabel: 'OK',
    build(root) {
      const p = document.createElement('p');
      p.textContent = 'This will end your Windows session.';
      root.appendChild(p);
    },
  });
}

export function openFault(engine) {
  return openDialog(engine, {
    title: 'Application Error',
    width: 440,
    height: 150,
    buttons: ['Close'],
    defaultLabel: 'Close',
    build(root) {
      const row = document.createElement('div');
      row.className = 'w31-msg';
      const mark = document.createElement('div');
      mark.className = 'w31-stop';
      mark.innerHTML = iconSvg('stop');
      const p = document.createElement('p');
      p.textContent = 'NOTEPAD caused a General Protection Fault in\nmodule NOTEPAD.EXE at 0002:1498.';
      row.append(mark, p);
      root.appendChild(row);
    },
  });
}
