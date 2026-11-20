import { LOGO, iconSvg } from './icons.js';

const README = `BeOS Release 5
Personal Edition

This volume is the boot disk.
Tracker keeps the files.
Deskbar keeps the apps.
The yellow tab is the window in front.
`;

export const NODES = {
  volume: { label: 'BeOS', icon: 'disk', children: ['home', 'apps', 'preferences'] },
  home: { label: 'home', icon: 'folder', children: ['Desktop', 'mail', 'config', 'ReadMe.txt', 'sample.wav'] },
  Desktop: { label: 'Desktop', icon: 'folder', children: ['welcome.html', 'notes.txt'] },
  mail: { label: 'mail', icon: 'folder', children: ['Inbox'] },
  Inbox: { label: 'Inbox', icon: 'folder', children: [] },
  config: { label: 'config', icon: 'folder', children: ['settings'] },
  settings: { label: 'settings', icon: 'doc', kind: 'text', size: '1 KB', modified: 'Aug 2, 2000', path: '/boot/home/config/settings' },
  'ReadMe.txt': {
    label: 'ReadMe.txt',
    icon: 'doc',
    kind: 'text',
    size: '248 B',
    modified: 'Oct 12, 2000',
    path: '/boot/home/ReadMe.txt',
    body: README,
  },
  'sample.wav': {
    label: 'sample.wav',
    icon: 'audio',
    kind: 'audio',
    size: '1.2 MB',
    modified: 'Sep 3, 2000',
    path: '/boot/home/sample.wav',
  },
  'welcome.html': {
    label: 'welcome.html',
    icon: 'html',
    kind: 'html',
    size: '2 KB',
    modified: 'Nov 2, 2000',
    path: '/boot/home/Desktop/welcome.html',
  },
  'notes.txt': {
    label: 'notes.txt',
    icon: 'doc',
    kind: 'text',
    size: '40 B',
    modified: 'Nov 2, 2000',
    path: '/boot/home/Desktop/notes.txt',
    body: 'Deskbar stays in the top right.\n',
  },
  apps: { label: 'apps', icon: 'folder', children: ['StyledEdit', 'Terminal', 'NetPositive', 'MediaPlayer', 'ShowImage'] },
  StyledEdit: { label: 'StyledEdit', icon: 'stylededit', kind: 'app' },
  Terminal: { label: 'Terminal', icon: 'terminal', kind: 'app' },
  NetPositive: { label: 'NetPositive', icon: 'netpositive', kind: 'app' },
  MediaPlayer: { label: 'MediaPlayer', icon: 'mediaplayer', kind: 'app' },
  ShowImage: { label: 'ShowImage', icon: 'showimage', kind: 'app' },
  preferences: { label: 'preferences', icon: 'folder', children: ['Backgrounds', 'Screen'] },
  Backgrounds: { label: 'Backgrounds', icon: 'backgrounds', kind: 'app' },
  Screen: { label: 'Screen', icon: 'screen', kind: 'app' },
  trash: { label: 'Trash', icon: 'trash', children: [] },
};

export const DESK_COLORS = [
  { id: 'be', name: 'Be', bg: 'linear-gradient(160deg, #3e7ea8 0%, #24577a 100%)' },
  { id: 'leaf', name: 'Leaf', bg: 'linear-gradient(165deg, #3d8f78 0%, #1d5c50 100%)' },
  { id: 'dusk', name: 'Dusk', bg: 'linear-gradient(165deg, #6a5a98 0%, #322850 100%)' },
  { id: 'sand', name: 'Sand', bg: 'linear-gradient(165deg, #c4a574 0%, #8a6840 100%)' },
];

const WAVE = [22, 38, 54, 30, 68, 44, 76, 36, 58, 82, 40, 64, 28, 50, 74, 34, 60, 46, 78, 32, 48, 70, 42, 26, 62, 45, 80, 36];

const TRACKER_MENUS = [
  {
    label: 'File',
    items: [
      { label: 'Open', shortcut: 'Alt O' },
      { label: 'Get Info', shortcut: 'Alt I' },
      { label: 'Duplicate', shortcut: 'Alt D' },
      { divider: true },
      { label: 'Move to Trash' },
      { divider: true },
      { label: 'Close', shortcut: 'Alt W' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Alt Z', disabled: true },
      { divider: true },
      { label: 'Cut', shortcut: 'Alt X' },
      { label: 'Copy', shortcut: 'Alt C' },
      { label: 'Paste', shortcut: 'Alt V' },
      { label: 'Select All', shortcut: 'Alt A' },
    ],
  },
  {
    label: 'Window',
    items: [
      { label: 'Icon View', checked: true },
      { label: 'Mini Icon View' },
      { label: 'List View' },
      { divider: true },
      { label: 'Clean Up' },
      { label: 'Close', shortcut: 'Alt W' },
    ],
  },
];

const EDIT_MENUS = [
  {
    label: 'File',
    items: [
      { label: 'New', shortcut: 'Alt N' },
      { label: 'Open…', shortcut: 'Alt O' },
      { label: 'Save', shortcut: 'Alt S' },
      { label: 'Save As…' },
      { divider: true },
      { label: 'Close', shortcut: 'Alt W' },
      { label: 'Quit', shortcut: 'Alt Q' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Alt Z' },
      { divider: true },
      { label: 'Cut', shortcut: 'Alt X' },
      { label: 'Copy', shortcut: 'Alt C' },
      { label: 'Paste', shortcut: 'Alt V' },
      { label: 'Select All', shortcut: 'Alt A' },
    ],
  },
  {
    label: 'Font',
    items: [{ label: 'Swis721' }, { label: 'Dutch' }, { label: 'Courier' }],
  },
  {
    label: 'Size',
    items: [{ label: '10' }, { label: '12', checked: true }, { label: '14' }, { label: '18' }],
  },
];

const TERM_MENUS = [
  {
    label: 'File',
    items: [
      { label: 'New Terminal', shortcut: 'Alt N' },
      { label: 'Close', shortcut: 'Alt W' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Copy', shortcut: 'Alt C' },
      { label: 'Paste', shortcut: 'Alt V' },
      { label: 'Select All', shortcut: 'Alt A' },
    ],
  },
  {
    label: 'Settings',
    items: [{ label: 'Window title…' }, { label: 'Font' }],
  },
];

const NP_MENUS = [
  {
    label: 'File',
    items: [
      { label: 'Open Location…', shortcut: 'Alt L' },
      { label: 'Close', shortcut: 'Alt W' },
      { label: 'Quit', shortcut: 'Alt Q' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Copy', shortcut: 'Alt C' },
      { label: 'Select All', shortcut: 'Alt A' },
    ],
  },
  {
    label: 'Go',
    items: [
      { label: 'Back', shortcut: 'Alt ←' },
      { label: 'Forward' },
      { label: 'Home' },
      { label: 'Stop' },
    ],
  },
];

const MP_MENUS = [
  {
    label: 'File',
    items: [
      { label: 'Open…', shortcut: 'Alt O' },
      { label: 'Close', shortcut: 'Alt W' },
      { label: 'Quit', shortcut: 'Alt Q' },
    ],
  },
  {
    label: 'Controls',
    items: [
      { label: 'Play', shortcut: 'Alt P' },
      { label: 'Pause' },
      { label: 'Stop' },
    ],
  },
];

const SIMPLE_FILE = [
  {
    label: 'File',
    items: [{ label: 'Close', shortcut: 'Alt W' }],
  },
];

function countLabel(n) {
  return n === 1 ? '1 item' : `${n} items`;
}

function fillRoot(className) {
  const root = document.createElement('div');
  root.className = `beos-fill ${className}`;
  return root;
}

export function iconEl(win, label) {
  return [...win.el.querySelectorAll('.beos-ficon, .beos-row')].find((node) => node.dataset.label === label);
}

export function openTracker(engine, folderId, opts = {}) {
  const node = NODES[folderId];
  const kids = (node.children || []).map((id) => ({ id, ...NODES[id] }));
  const root = fillRoot('beos-tracker');
  const view = document.createElement('div');
  view.className = 'beos-icons-view';
  for (const kid of kids) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'beos-ficon';
    btn.dataset.label = kid.label;
    btn.dataset.id = kid.id;
    const glyph = document.createElement('span');
    glyph.className = 'beos-glyph';
    glyph.innerHTML = iconSvg(kid.icon || 'doc');
    const label = document.createElement('span');
    label.className = 'beos-label';
    label.textContent = kid.label;
    btn.append(glyph, label);
    view.appendChild(btn);
  }
  const status = document.createElement('div');
  status.className = 'beos-status';
  status.textContent = countLabel(kids.length);
  root.append(view, status);
  return engine.createWindow({
    title: node.label,
    app: 'Tracker',
    width: 560,
    height: 400,
    menus: TRACKER_MENUS,
    node: root,
    ...opts,
  });
}

export function openStyledEdit(engine, fileId, opts = {}) {
  const file = NODES[fileId];
  const root = fillRoot('');
  const doc = document.createElement('div');
  doc.className = 'beos-doc';
  doc.append(document.createTextNode(file.body || ''));
  const caret = document.createElement('span');
  caret.className = 'beos-caret';
  doc.appendChild(caret);
  root.appendChild(doc);
  const win = engine.createWindow({
    title: file.label,
    app: 'StyledEdit',
    width: 480,
    height: 340,
    menus: EDIT_MENUS,
    node: root,
    ...opts,
  });
  win.docEl = doc;
  return win;
}

export function openTerminal(engine, opts = {}) {
  const root = fillRoot('');
  const term = document.createElement('div');
  term.className = 'beos-term';
  term.setAttribute('role', 'log');
  term.append(document.createTextNode('desk:/boot/home$ '));
  const caret = document.createElement('span');
  caret.className = 'beos-caret';
  term.appendChild(caret);
  root.appendChild(term);
  const win = engine.createWindow({
    title: 'Terminal',
    app: 'Terminal',
    width: 560,
    height: 320,
    menus: TERM_MENUS,
    node: root,
    ...opts,
  });
  win.termEl = term;
  return win;
}

export function termInsert(win, text) {
  const caret = win.termEl.querySelector('.beos-caret');
  win.termEl.insertBefore(document.createTextNode(text), caret);
  win.termEl.scrollTop = win.termEl.scrollHeight;
}

export const WELCOME_HTML = {
  title: 'Welcome',
  url: 'file:///boot/home/Desktop/welcome.html',
  node() {
    const doc = document.createElement('article');
    doc.className = 'np-doc';
    doc.innerHTML = `
      <div class="np-banner">BeOS Release 5</div>
      <h1>Welcome home.</h1>
      <p>This page lives on the boot disk, under Desktop. NetPositive opened it the same way it opens anything else: a path, a little waiting, then the words.</p>
      <p>Tracker is on the desk. The yellow tab is the window in front. A gray tab is still open, just not the one in use.</p>
      <p>Personal Edition is the release that ended up on ordinary PCs. The kernel still says BePC. The file system is still BFS. The menu in the corner is still the Be menu.</p>
      <p><button type="button" class="np-a" data-np="notes">Desk notes</button></p>
      <h2>On this volume</h2>
      <ul>
        <li>home — files for the person at the desk</li>
        <li>apps — StyledEdit, Terminal, NetPositive, MediaPlayer</li>
        <li>preferences — where the desk color lives</li>
      </ul>
      <p>Thirty-two workspaces if you want them. Four are showing in the Deskbar tonight.</p>
      <p>The pointer will move on by itself. Leave the yellow tab where it is.</p>
    `;
    return doc;
  },
};

export const NOTES_HTML = {
  title: 'Desk notes',
  url: 'file:///boot/home/Desktop/notes.html',
  node() {
    const doc = document.createElement('article');
    doc.className = 'np-doc';
    doc.innerHTML = `
      <div class="np-banner">Desk notes</div>
      <h1>Things the desk is doing.</h1>
      <p>Terminal is bash, and the prompt is the volume plus the path. <em>uname</em> answers with BePC when this is Personal Edition on a PC.</p>
      <p>MediaPlayer will take sample.wav from home. It is a short tone, not a movie.</p>
      <p>Workspaces keep their own color. The one in the corner, lit yellow, is the desk you are on.</p>
    `;
    return doc;
  },
};

export function openNetPositive(engine, opts = {}) {
  const root = fillRoot('beos-np');
  const tools = document.createElement('div');
  tools.className = 'beos-np-tools';
  for (const label of ['‹', '›', 'Stop']) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'beos-tool';
    btn.textContent = label;
    tools.appendChild(btn);
  }
  const url = document.createElement('input');
  url.className = 'beos-np-url';
  url.readOnly = true;
  url.value = '';
  url.setAttribute('aria-label', 'Location');
  const throb = document.createElement('div');
  throb.className = 'beos-throb';
  tools.append(url, throb);
  const page = document.createElement('div');
  page.className = 'beos-np-page';
  const status = document.createElement('div');
  status.className = 'beos-np-status';
  status.textContent = 'No document.';
  root.append(tools, page, status);
  const win = engine.createWindow({
    title: 'NetPositive',
    app: 'NetPositive',
    width: 700,
    height: 470,
    menus: NP_MENUS,
    node: root,
    ...opts,
  });
  win.urlEl = url;
  win.pageEl = page;
  win.statusEl = status;
  win.throbEl = throb;
  return win;
}

export function showPage(win, page) {
  win.pageEl.replaceChildren(page.node());
  win.statusEl.textContent = 'Document: Done.';
  win.throbEl.classList.remove('spin');
  win.pageEl.scrollTop = 0;
}

export function openMediaPlayer(engine, opts = {}) {
  const root = fillRoot('beos-mp');
  const stage = document.createElement('div');
  stage.className = 'beos-mp-stage';
  WAVE.forEach((height) => {
    const bar = document.createElement('div');
    bar.className = 'beos-mp-bar';
    bar.style.height = `${height}%`;
    stage.appendChild(bar);
  });
  const controls = document.createElement('div');
  controls.className = 'beos-mp-controls';
  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'beos-tool';
  play.dataset.act = 'play';
  play.textContent = '▶';
  play.setAttribute('aria-label', 'Play');
  const track = document.createElement('div');
  track.className = 'beos-mp-track';
  const knob = document.createElement('div');
  knob.className = 'beos-mp-knob';
  track.appendChild(knob);
  const time = document.createElement('span');
  time.className = 'beos-mp-time';
  time.textContent = '0:00';
  controls.append(play, track, time);
  root.append(stage, controls);
  const win = engine.createWindow({
    title: 'sample.wav',
    app: 'MediaPlayer',
    width: 460,
    height: 300,
    menus: MP_MENUS,
    node: root,
    ...opts,
  });
  win.playBtn = play;
  win.knob = knob;
  win.timeEl = time;
  win.bars = [...stage.querySelectorAll('.beos-mp-bar')];
  return win;
}

export function openAbout(engine) {
  const root = fillRoot('beos-about');
  const mark = document.createElement('div');
  mark.className = 'mark';
  mark.innerHTML = LOGO;
  const title = document.createElement('h1');
  title.textContent = 'BeOS';
  const lines = [
    'Release 5',
    'Personal Edition',
    '',
    'Copyright 1991–2000',
    'Be Incorporated',
    '',
    'Kernel  BeOS 5.0',
    'Build  1000009',
    'Platform  BePC',
  ];
  root.append(mark, title);
  for (const line of lines) {
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
  return engine.createWindow({
    title: 'About BeOS',
    app: null,
    width: 340,
    height: 360,
    center: true,
    scale: false,
    node: root,
  });
}

export function openFind(engine) {
  const root = fillRoot('beos-find');
  const row = document.createElement('div');
  row.className = 'beos-find-row';
  const label = document.createElement('span');
  label.textContent = 'Name contains';
  const input = document.createElement('input');
  input.className = 'beos-find-q';
  input.readOnly = true;
  input.setAttribute('aria-label', 'Name contains');
  row.append(label, input);
  const actions = document.createElement('div');
  actions.className = 'beos-find-actions';
  const search = document.createElement('button');
  search.type = 'button';
  search.className = 'beos-btn default';
  search.dataset.act = 'search';
  search.textContent = 'Search';
  actions.appendChild(search);
  root.append(row, actions);
  const win = engine.createWindow({
    title: 'Find',
    app: 'Tracker',
    width: 380,
    height: 168,
    menus: SIMPLE_FILE,
    node: root,
    scale: false,
  });
  win.queryEl = input;
  win.searchBtn = search;
  return win;
}

export function openResults(engine, query) {
  const hits = Object.values(NODES).filter(
    (node) => node.kind && node.kind !== 'app' && node.label.toLowerCase().includes(query.toLowerCase()),
  );
  const root = fillRoot('beos-list');
  const head = document.createElement('div');
  head.className = 'beos-list-head';
  for (const name of ['Name', 'Size', 'Modified', 'Location']) {
    const span = document.createElement('span');
    span.textContent = name;
    head.appendChild(span);
  }
  const scroll = document.createElement('div');
  scroll.className = 'beos-list-scroll';
  for (const hit of hits) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'beos-row';
    row.dataset.label = hit.label;
    for (const value of [hit.label, hit.size || '', hit.modified || '', hit.path || '']) {
      const span = document.createElement('span');
      span.textContent = value;
      row.appendChild(span);
    }
    scroll.appendChild(row);
  }
  const status = document.createElement('div');
  status.className = 'beos-status';
  status.textContent = countLabel(hits.length);
  root.append(head, scroll, status);
  return engine.createWindow({
    title: 'Find results',
    app: 'Tracker',
    width: 560,
    height: 240,
    menus: TRACKER_MENUS,
    node: root,
  });
}

export function openBackgrounds(engine) {
  const root = fillRoot('beos-bgprefs');
  const heading = document.createElement('h2');
  heading.textContent = 'Workspace background';
  const note = document.createElement('p');
  note.style.margin = '0';
  note.textContent = 'Solid color for this workspace.';
  const swatches = document.createElement('div');
  swatches.className = 'beos-swatches';
  DESK_COLORS.forEach((color, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'beos-swatch' + (index === 0 ? ' on' : '');
    btn.dataset.color = color.id;
    btn.style.background = color.bg;
    btn.setAttribute('aria-label', color.name);
    swatches.appendChild(btn);
  });
  const actions = document.createElement('div');
  actions.className = 'beos-bg-actions';
  const apply = document.createElement('button');
  apply.type = 'button';
  apply.className = 'beos-btn default';
  apply.dataset.act = 'apply';
  apply.textContent = 'Apply';
  actions.appendChild(apply);
  root.append(heading, note, swatches, actions);
  const win = engine.createWindow({
    title: 'Backgrounds',
    app: 'Backgrounds',
    width: 420,
    height: 230,
    menus: SIMPLE_FILE,
    node: root,
    scale: false,
  });
  win.applyBtn = apply;
  return win;
}

export function openAlert(engine, { title, text, ok }) {
  const root = fillRoot('beos-alert');
  const p = document.createElement('p');
  p.textContent = text;
  const actions = document.createElement('div');
  actions.className = 'beos-alert-actions';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'beos-btn';
  cancel.textContent = 'Cancel';
  const yes = document.createElement('button');
  yes.type = 'button';
  yes.className = 'beos-btn default';
  yes.dataset.act = 'ok';
  yes.textContent = ok;
  actions.append(cancel, yes);
  root.append(p, actions);
  const win = engine.createWindow({
    title,
    app: null,
    width: 380,
    height: 168,
    center: true,
    scale: false,
    node: root,
  });
  win.okBtn = yes;
  return win;
}
