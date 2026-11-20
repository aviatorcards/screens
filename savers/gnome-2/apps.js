import { FOOT, iconSvg } from './icons.js';

const FILE_MENUS = [
  { label: 'File', items: [{ label: 'Save' }] },
  { label: 'Edit', items: [{ label: 'Select All' }] },
  { label: 'View', items: [{ label: 'Toolbar' }] },
  { label: 'Search', items: [{ label: 'Find' }] },
  { label: 'Help', items: [{ label: 'About' }] },
];

const NAUTILUS_MENUS = [
  { label: 'File', items: [{ label: 'Open' }] },
  { label: 'Edit', items: [{ label: 'Select All' }] },
  { label: 'View', items: [{ label: 'Icons' }] },
  { label: 'Go', items: [{ label: 'Back' }, { label: 'Home' }] },
  { label: 'Bookmarks', items: [{ label: 'Add Bookmark' }] },
  { label: 'Help', items: [{ label: 'About' }] },
];

const BROWSER_MENUS = [
  { label: 'File', items: [{ label: 'Open' }] },
  { label: 'Edit', items: [{ label: 'Find' }] },
  { label: 'View', items: [{ label: 'Toolbar' }] },
  { label: 'Go', items: [{ label: 'Back' }, { label: 'Home' }] },
  { label: 'Bookmarks', items: [{ label: 'Add Bookmark' }] },
  { label: 'Help', items: [{ label: 'About' }] },
];

const TERM_MENUS = [
  { label: 'File', items: [{ label: 'Open Terminal' }] },
  { label: 'Edit', items: [{ label: 'Paste' }] },
  { label: 'View', items: [{ label: 'Zoom In' }] },
  { label: 'Terminal', items: [{ label: 'Reset' }] },
  { label: 'Help', items: [{ label: 'About' }] },
];

export const PLACES = {
  home: {
    title: 'user',
    uri: 'file:///home/user',
    status: '3 items',
    items: [
      { id: 'desktop', label: 'Desktop', icon: 'folder' },
      { id: 'notes', label: 'notes.txt', icon: 'text' },
      { id: 'welcome', label: 'welcome.html', icon: 'html' },
    ],
  },
  desktop: {
    title: 'Desktop',
    uri: 'file:///home/user/Desktop',
    status: '0 items',
    items: [],
  },
  start: {
    title: 'Start Here',
    uri: 'start-here:',
    status: '2 items',
    items: [
      { id: 'applications', label: 'Applications', icon: 'folder' },
      { id: 'preferences', label: 'Preferences', icon: 'prefs' },
    ],
  },
  prefs: {
    title: 'Preferences',
    uri: 'start-here:/preferences',
    status: '2 items',
    items: [
      { id: 'background', label: 'Background', icon: 'prefs' },
      { id: 'theme', label: 'Theme', icon: 'prefs' },
    ],
  },
};

function toolButton(label, icon) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'gnome-tb';
  btn.innerHTML = iconSvg(icon);
  const text = document.createElement('span');
  text.textContent = label;
  btn.appendChild(text);
  return btn;
}

function fileButton(item) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'gnome-ficon';
  btn.dataset.id = item.id;
  const glyph = document.createElement('span');
  glyph.className = 'gnome-glyph';
  glyph.innerHTML = iconSvg(item.icon);
  const label = document.createElement('span');
  label.className = 'gnome-label';
  label.textContent = item.label;
  btn.append(glyph, label);
  return btn;
}

function withCaret(el, text, className) {
  if (text) el.appendChild(document.createTextNode(text));
  const caret = document.createElement('span');
  caret.className = className;
  el.appendChild(caret);
  return el;
}

export function openNautilus(engine, placeKey) {
  const app = document.createElement('div');
  app.className = 'gnome-app';
  const bar = document.createElement('div');
  bar.className = 'gnome-toolbar';
  const handle = document.createElement('div');
  handle.className = 'gnome-handle';
  const backBtn = toolButton('Back', 'back');
  const upBtn = toolButton('Up', 'up');
  const homeBtn = toolButton('Home', 'home');
  const reloadBtn = toolButton('Reload', 'browser');
  bar.append(handle, backBtn, upBtn, homeBtn, reloadBtn);

  const locRow = document.createElement('div');
  locRow.className = 'gnome-locrow';
  const locLabel = document.createElement('span');
  locLabel.textContent = 'Location:';
  const locEl = document.createElement('input');
  locEl.className = 'gnome-entry';
  locEl.readOnly = true;
  locRow.append(locLabel, locEl);

  const split = document.createElement('div');
  split.className = 'gnome-split';
  const treeEl = document.createElement('div');
  treeEl.className = 'gnome-tree';
  for (const key of ['home', 'desktop', 'start']) {
    const place = PLACES[key];
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'gnome-tree-item';
    item.dataset.place = key;
    const glyph = document.createElement('span');
    glyph.className = 'gnome-glyph';
    glyph.innerHTML = iconSvg(key === 'start' ? 'start' : key === 'desktop' ? 'folder' : 'home');
    const name = document.createElement('span');
    name.textContent = place.title === 'user' ? 'Home' : place.title;
    item.append(glyph, name);
    treeEl.appendChild(item);
  }
  const viewEl = document.createElement('div');
  viewEl.className = 'gnome-view gnome-igrid';
  split.append(treeEl, viewEl);

  const statusEl = document.createElement('div');
  statusEl.className = 'gnome-status';
  app.append(bar, locRow, split, statusEl);

  const win = engine.createWindow({
    title: 'Nautilus',
    app: 'Nautilus',
    icon: 'folder',
    width: 640,
    height: 420,
    menus: NAUTILUS_MENUS,
    node: app,
  });
  win.backBtn = backBtn;
  win.homeBtn = homeBtn;
  win.locEl = locEl;
  win.treeEl = treeEl;
  win.viewEl = viewEl;
  win.statusEl = statusEl;
  win.stack = [];
  win.index = -1;
  nautilusGo(engine, win, placeKey);
  return win;
}

export function nautilusGo(engine, win, key, push = true) {
  const place = PLACES[key];
  if (!place) return;
  if (push) {
    win.stack = win.stack.slice(0, win.index + 1);
    win.stack.push(key);
    win.index = win.stack.length - 1;
  }
  win.place = key;
  engine.setTitle(win, `${place.title} — Nautilus`);
  win.locEl.value = place.uri;
  win.statusEl.textContent = place.status;
  win.viewEl.replaceChildren();
  for (const item of place.items) win.viewEl.appendChild(fileButton(item));
  const treeKey = key === 'prefs' ? 'start' : key;
  win.treeEl.querySelectorAll('.gnome-tree-item').forEach((el) => {
    el.classList.toggle('selected', el.dataset.place === treeKey);
  });
}

export function nautilusBack(engine, win) {
  if (win.index <= 0) return;
  win.index -= 1;
  nautilusGo(engine, win, win.stack[win.index], false);
}

export function openGedit(engine) {
  const app = document.createElement('div');
  app.className = 'gnome-app';
  const doc = document.createElement('div');
  doc.className = 'gnome-doc';
  withCaret(doc, 'GNOME 2.4\nThe Simple theme keeps the panels gray.\n', 'gnome-caret');
  const status = document.createElement('div');
  status.className = 'gnome-status';
  status.textContent = 'Plain text';
  app.append(doc, status);
  const win = engine.createWindow({
    title: 'notes.txt - gedit',
    app: 'gedit',
    icon: 'text',
    width: 560,
    height: 380,
    menus: FILE_MENUS,
    node: app,
  });
  win.docEl = doc;
  win.statusEl = status;
  return win;
}

export function openEpiphany(engine) {
  const app = document.createElement('div');
  app.className = 'gnome-app';
  const bar = document.createElement('div');
  bar.className = 'gnome-toolbar';
  const backBtn = toolButton('Back', 'back');
  const homeBtn = toolButton('Home', 'home');
  const urlEl = document.createElement('input');
  urlEl.className = 'gnome-entry';
  urlEl.setAttribute('aria-label', 'Location');
  const throb = document.createElement('div');
  throb.className = 'gnome-throb';
  throb.innerHTML = iconSvg('browser');
  bar.append(backBtn, homeBtn, urlEl, throb);
  const page = document.createElement('div');
  page.className = 'gnome-page';
  const status = document.createElement('div');
  status.className = 'gnome-status';
  status.textContent = 'Ready';
  app.append(bar, page, status);
  const win = engine.createWindow({
    title: 'Epiphany',
    app: 'Epiphany',
    icon: 'browser',
    width: 680,
    height: 440,
    x: 180,
    y: 36,
    menus: BROWSER_MENUS,
    node: app,
  });
  win.urlEl = urlEl;
  win.pageEl = page;
  win.statusEl = status;
  win.throbEl = throb;
  return win;
}

export function showEpiphanyPage(engine, win) {
  win.throbEl.classList.remove('spin');
  engine.setTitle(win, 'Desk notes — Epiphany');
  win.statusEl.textContent = 'file:///home/user/welcome.html';
  win.pageEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = 'Desk notes';
  const p1 = document.createElement('p');
  p1.textContent = 'GNOME 2.4 uses the Simple theme. The menu panel keeps Applications and Actions, a home folder launcher, and a terminal launcher.';
  const p2 = document.createElement('p');
  p2.textContent = 'The bottom panel lists open windows beside Show Desktop and the workspace switcher. Epiphany 1.0 is the browser that ships with this desktop.';
  const p3 = document.createElement('p');
  p3.textContent = 'This page is welcome.html from the home folder. Nautilus keeps that file next to Desktop and notes.txt.';
  const p4 = document.createElement('p');
  p4.textContent = 'The clock on the menu panel opens a calendar. The workspace switcher sits at the right of the bottom edge.';
  win.pageEl.style.paddingBottom = '150px';
  win.pageEl.append(h, p1, p2, p3, p4);
}

export function openTerminal(engine) {
  const term = document.createElement('div');
  term.className = 'gnome-term';
  withCaret(term, 'user@desk:~$ ', 'gnome-caret');
  const win = engine.createWindow({
    title: 'Terminal',
    app: 'Terminal',
    icon: 'terminal',
    width: 620,
    height: 340,
    menus: TERM_MENUS,
    node: term,
  });
  win.termEl = term;
  return win;
}

export function termInsert(win, text) {
  const caret = win.termEl.querySelector('.gnome-caret');
  win.termEl.insertBefore(document.createTextNode(text), caret);
  win.termEl.scrollTop = win.termEl.scrollHeight;
}

export function openCalculator(engine) {
  const app = document.createElement('div');
  app.className = 'gnome-calc';
  const mode = document.createElement('div');
  mode.className = 'gnome-calc-mode';
  mode.textContent = 'Basic';
  const display = document.createElement('div');
  display.className = 'gnome-calc-display';
  display.textContent = '0';
  const keys = document.createElement('div');
  keys.className = 'gnome-keys';
  for (const key of ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+']) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gnome-key';
    btn.dataset.key = key;
    btn.textContent = key;
    keys.appendChild(btn);
  }
  app.append(mode, display, keys);
  const win = engine.createWindow({
    title: 'Calculator',
    app: 'Calculator',
    icon: 'calc',
    width: 280,
    height: 340,
    menus: [
      { label: 'Calculator', items: [{ label: 'Quit' }] },
      { label: 'Help', items: [{ label: 'About' }] },
    ],
    node: app,
  });
  win.display = display;
  return win;
}

export function openRun(engine) {
  const node = document.createElement('div');
  node.className = 'gnome-dialog';
  const field = document.createElement('div');
  field.className = 'gnome-field';
  const label = document.createElement('span');
  label.textContent = 'Command:';
  const input = document.createElement('input');
  input.className = 'gnome-entry';
  input.setAttribute('aria-label', 'Command');
  field.append(label, input);
  const row = document.createElement('div');
  row.className = 'gnome-dialog-buttons';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'gnome-btn';
  cancelBtn.textContent = 'Cancel';
  const okBtn = document.createElement('button');
  okBtn.type = 'button';
  okBtn.className = 'gnome-btn';
  okBtn.textContent = 'Run';
  row.append(cancelBtn, okBtn);
  node.append(field, row);
  const win = engine.createWindow({
    title: 'Run Application',
    app: 'Run Application',
    icon: 'run',
    width: 420,
    height: 168,
    center: true,
    node,
  });
  win.input = input;
  win.okBtn = okBtn;
  return win;
}

export function openSearch(engine) {
  const node = document.createElement('div');
  node.className = 'gnome-dialog';
  node.style.justifyContent = 'flex-start';
  const nameField = fieldRow('Name contains:');
  const lookField = fieldRow('Look in folder:');
  lookField.input.value = '/home/user';
  const row = document.createElement('div');
  row.className = 'gnome-dialog-buttons';
  const findBtn = document.createElement('button');
  findBtn.type = 'button';
  findBtn.className = 'gnome-btn';
  findBtn.textContent = 'Find';
  row.appendChild(findBtn);
  const results = document.createElement('div');
  results.className = 'gnome-results';
  node.append(nameField.row, lookField.row, row, results);
  const win = engine.createWindow({
    title: 'Search for Files',
    app: 'Search for Files',
    icon: 'search',
    width: 480,
    height: 320,
    center: true,
    node,
  });
  win.nameEl = nameField.input;
  win.findBtn = findBtn;
  win.resultsEl = results;
  return win;
}

function fieldRow(labelText) {
  const row = document.createElement('div');
  row.className = 'gnome-field';
  const label = document.createElement('span');
  label.textContent = labelText;
  label.style.width = '110px';
  const input = document.createElement('input');
  input.className = 'gnome-entry';
  row.append(label, input);
  return { row, input };
}

export function openAbout(engine) {
  const node = document.createElement('div');
  node.className = 'gnome-about';
  const mark = document.createElement('div');
  mark.className = 'gnome-about-mark';
  mark.innerHTML = FOOT;
  const title = document.createElement('h2');
  title.textContent = 'The GNOME Desktop';
  const version = document.createElement('p');
  version.textContent = 'Version 2.4';
  const row = document.createElement('div');
  row.className = 'gnome-about-row';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'gnome-btn';
  close.textContent = 'Close';
  row.appendChild(close);
  node.append(mark, title, version, row);
  const win = engine.createWindow({
    title: 'About GNOME',
    app: 'About GNOME',
    icon: 'start',
    width: 340,
    height: 250,
    center: true,
    node,
  });
  win.okBtn = close;
  return win;
}

export function openLogout(engine) {
  const node = document.createElement('div');
  node.className = 'gnome-dialog';
  const text = document.createElement('p');
  text.textContent = 'Are you sure you want to log out?';
  const row = document.createElement('div');
  row.className = 'gnome-dialog-buttons';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'gnome-btn';
  cancelBtn.textContent = 'Cancel';
  const okBtn = document.createElement('button');
  okBtn.type = 'button';
  okBtn.className = 'gnome-btn';
  okBtn.textContent = 'Log Out';
  row.append(cancelBtn, okBtn);
  node.append(text, row);
  const win = engine.createWindow({
    title: 'Log Out',
    app: 'Log Out',
    icon: 'logout',
    width: 380,
    height: 160,
    center: true,
    node,
  });
  win.okBtn = okBtn;
  return win;
}
