import { KMARK, iconSvg } from './icons.js';

const KONQ_MENUS = [
  { label: 'Location', items: [{ label: 'Open' }] },
  { label: 'Edit', items: [{ label: 'Select All' }] },
  { label: 'View', items: [{ label: 'Icons' }] },
  { label: 'Go', items: [{ label: 'Home' }] },
  { label: 'Bookmarks', items: [{ label: 'Add Bookmark' }] },
  { label: 'Window', items: [{ label: 'New Tab' }] },
  { label: 'Help', items: [{ label: 'About KDE' }] },
];

const KWRITE_MENUS = [
  { label: 'File', items: [{ label: 'Save' }] },
  { label: 'Edit', items: [{ label: 'Select All' }] },
  { label: 'View', items: [{ label: 'Toolbar' }] },
  { label: 'Help', items: [{ label: 'About KWrite' }, { label: 'About KDE' }] },
];

const HOME_ITEMS = [
  { id: 'desktop', label: 'Desktop', icon: 'folder' },
  { id: 'notes', label: 'notes.txt', icon: 'text' },
  { id: 'welcome', label: 'welcome.html', icon: 'html' },
];

function iconButton(className, label, icon) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.setAttribute('aria-label', label);
  btn.innerHTML = iconSvg(icon);
  return btn;
}

function withCaret(el, text) {
  if (text) el.appendChild(document.createTextNode(text));
  const caret = document.createElement('span');
  caret.className = 'kde-caret';
  el.appendChild(caret);
}

function fileButton(item) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'kde-ficon';
  btn.dataset.id = item.id;
  const glyph = document.createElement('span');
  glyph.className = 'kde-glyph';
  glyph.innerHTML = iconSvg(item.icon);
  const label = document.createElement('span');
  label.className = 'kde-label';
  label.textContent = item.label;
  btn.append(glyph, label);
  return btn;
}

function welcomeNode() {
  const page = document.createElement('div');
  page.className = 'kde-page';
  const h = document.createElement('h2');
  h.textContent = 'Desk notes';
  const p1 = document.createElement('p');
  p1.textContent = 'KDE 3.1 draws window frames in the Keramik style. The K menu and the pager live on the kicker along the bottom edge.';
  const p2 = document.createElement('p');
  p2.textContent = 'Konqueror can keep this page in a second tab while the home folder stays open in the first.';
  const p3 = document.createElement('p');
  p3.textContent = 'This page is welcome.html from the home folder.';
  page.append(h, p1, p2, p3);
  return page;
}

export function openKonqueror(engine) {
  const app = document.createElement('div');
  app.className = 'kde-app';
  const bar = document.createElement('div');
  bar.className = 'kde-toolbar';
  const backBtn = iconButton('kde-tb', 'Back', 'back');
  const homeBtn = iconButton('kde-tb', 'Home', 'folder');
  const locEl = document.createElement('input');
  locEl.className = 'kde-entry';
  locEl.setAttribute('aria-label', 'Location');
  bar.append(backBtn, homeBtn, locEl);
  const tabsEl = document.createElement('div');
  tabsEl.className = 'kde-tabs';
  const viewEl = document.createElement('div');
  viewEl.className = 'kde-view';
  const statusEl = document.createElement('div');
  statusEl.className = 'kde-status';
  app.append(bar, tabsEl, viewEl, statusEl);
  const win = engine.createWindow({
    title: 'Konqueror',
    app: 'Konqueror',
    icon: 'browser',
    width: 700,
    height: 440,
    menus: KONQ_MENUS,
    node: app,
  });
  win.locEl = locEl;
  win.tabsEl = tabsEl;
  win.viewEl = viewEl;
  win.statusEl = statusEl;
  win.tabs = [{ title: 'Konqueror', url: '', kind: 'empty' }];
  win.active = 0;
  renderKonq(engine, win);
  return win;
}

function renderKonq(engine, win) {
  const tab = win.tabs[win.active];
  win.locEl.value = tab.url || '';
  engine.setTitle(win, `${tab.title} — Konqueror`);
  win.statusEl.textContent = tab.url || '';
  win.tabsEl.replaceChildren();
  win.tabs.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kde-tab';
    btn.dataset.tab = String(index);
    btn.textContent = item.title;
    if (index === win.active) btn.classList.add('on');
    win.tabsEl.appendChild(btn);
  });
  win.viewEl.replaceChildren();
  if (tab.kind === 'dir') {
    for (const item of HOME_ITEMS) win.viewEl.appendChild(fileButton(item));
  } else if (tab.kind === 'html') {
    win.viewEl.appendChild(welcomeNode());
  } else if (tab.kind === 'trash') {
    const empty = document.createElement('div');
    empty.className = 'kde-page';
    empty.textContent = '0 items';
    win.viewEl.appendChild(empty);
  }
}

export function konqAddTab(engine, win) {
  win.tabs.push({ title: 'New Tab', url: '', kind: 'empty' });
  win.active = win.tabs.length - 1;
  renderKonq(engine, win);
}

export function konqSelect(engine, win, index) {
  win.active = index;
  renderKonq(engine, win);
}

export function konqShow(engine, win, spec) {
  Object.assign(win.tabs[win.active], spec);
  renderKonq(engine, win);
}

export function openKWrite(engine) {
  const doc = document.createElement('div');
  doc.className = 'kde-doc';
  withCaret(doc, 'KDE 3.1\nKeramik draws these window frames.\n');
  const win = engine.createWindow({
    title: 'notes.txt — KWrite',
    app: 'KWrite',
    icon: 'text',
    width: 560,
    height: 360,
    menus: KWRITE_MENUS,
    node: doc,
  });
  win.docEl = doc;
  return win;
}

export function openKonsole(engine) {
  const term = document.createElement('div');
  term.className = 'kde-term';
  withCaret(term, 'user@desk:~$ ');
  const win = engine.createWindow({
    title: 'Konsole',
    app: 'Konsole',
    icon: 'terminal',
    width: 620,
    height: 320,
    menus: [
      { label: 'File', items: [{ label: 'New Shell' }] },
      { label: 'Edit', items: [{ label: 'Paste' }] },
      { label: 'View', items: [{ label: 'Fullscreen' }] },
      { label: 'Help', items: [{ label: 'About KDE' }] },
    ],
    node: term,
  });
  win.termEl = term;
  return win;
}

export function termInsert(win, text) {
  const caret = win.termEl.querySelector('.kde-caret');
  win.termEl.insertBefore(document.createTextNode(text), caret);
  win.termEl.scrollTop = win.termEl.scrollHeight;
}

export function openKCalc(engine) {
  const app = document.createElement('div');
  app.className = 'kde-calc';
  const display = document.createElement('div');
  display.className = 'kde-calc-display';
  display.textContent = '0';
  const keys = document.createElement('div');
  keys.className = 'kde-keys';
  for (const key of ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+']) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kde-key';
    btn.dataset.key = key;
    btn.textContent = key;
    keys.appendChild(btn);
  }
  app.append(display, keys);
  const win = engine.createWindow({
    title: 'KCalc',
    app: 'KCalc',
    icon: 'calc',
    width: 280,
    height: 300,
    node: app,
  });
  win.display = display;
  return win;
}

export function openRun(engine) {
  const node = document.createElement('div');
  node.className = 'kde-dialog';
  const field = document.createElement('div');
  field.className = 'kde-field';
  const label = document.createElement('span');
  label.textContent = 'Command:';
  const input = document.createElement('input');
  input.className = 'kde-entry';
  input.setAttribute('aria-label', 'Command');
  field.append(label, input);
  const row = document.createElement('div');
  row.className = 'kde-dialog-buttons';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'kde-btn';
  cancelBtn.textContent = 'Cancel';
  const okBtn = document.createElement('button');
  okBtn.type = 'button';
  okBtn.className = 'kde-btn';
  okBtn.textContent = 'Run';
  row.append(cancelBtn, okBtn);
  node.append(field, row);
  const win = engine.createWindow({
    title: 'Run Command',
    app: 'Run Command',
    icon: 'run',
    width: 420,
    height: 160,
    center: true,
    node,
  });
  win.input = input;
  win.okBtn = okBtn;
  return win;
}

export function openFind(engine) {
  const node = document.createElement('div');
  node.className = 'kde-dialog';
  const named = document.createElement('div');
  named.className = 'kde-field';
  const namedLabel = document.createElement('span');
  namedLabel.textContent = 'Named:';
  const nameEl = document.createElement('input');
  nameEl.className = 'kde-entry';
  named.append(namedLabel, nameEl);
  const look = document.createElement('div');
  look.className = 'kde-field';
  const lookLabel = document.createElement('span');
  lookLabel.textContent = 'Look in:';
  const lookEl = document.createElement('input');
  lookEl.className = 'kde-entry';
  lookEl.value = '/home/user';
  look.append(lookLabel, lookEl);
  const row = document.createElement('div');
  row.className = 'kde-dialog-buttons';
  const findBtn = document.createElement('button');
  findBtn.type = 'button';
  findBtn.className = 'kde-btn';
  findBtn.textContent = 'Find';
  row.appendChild(findBtn);
  const results = document.createElement('div');
  results.className = 'kde-results';
  node.append(named, look, row, results);
  const win = engine.createWindow({
    title: 'Find Files',
    app: 'Find Files',
    icon: 'find',
    width: 480,
    height: 300,
    center: true,
    node,
  });
  win.nameEl = nameEl;
  win.findBtn = findBtn;
  win.resultsEl = results;
  return win;
}

export function openAbout(engine) {
  const node = document.createElement('div');
  node.className = 'kde-about';
  const mark = document.createElement('div');
  mark.className = 'kde-about-mark';
  mark.innerHTML = KMARK;
  const title = document.createElement('h2');
  title.textContent = 'The K Desktop Environment';
  const version = document.createElement('p');
  version.textContent = 'Version 3.1.0';
  const date = document.createElement('p');
  date.textContent = '28 January 2003';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'kde-btn';
  close.textContent = 'Close';
  node.append(mark, title, version, date, close);
  const win = engine.createWindow({
    title: 'About KDE',
    app: 'About KDE',
    icon: 'k',
    width: 340,
    height: 280,
    center: true,
    node,
  });
  win.okBtn = close;
  return win;
}

export function openLogout(engine) {
  const node = document.createElement('div');
  node.className = 'kde-dialog';
  const row = document.createElement('div');
  row.className = 'kde-dialog-buttons';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'kde-btn';
  cancelBtn.textContent = 'Cancel';
  const okBtn = document.createElement('button');
  okBtn.type = 'button';
  okBtn.className = 'kde-btn';
  okBtn.textContent = 'Logout';
  row.append(cancelBtn, okBtn);
  const label = document.createElement('p');
  label.textContent = 'Logout';
  label.style.margin = '4px 0 0';
  label.style.fontWeight = '700';
  node.append(label, row);
  const win = engine.createWindow({
    title: 'Logout',
    app: 'Logout',
    icon: 'logout',
    width: 320,
    height: 140,
    center: true,
    node,
  });
  win.okBtn = okBtn;
  return win;
}

export function openTrash(engine) {
  const win = openKonqueror(engine);
  konqShow(engine, win, { title: 'Trash', url: 'trash:/', kind: 'trash' });
  return win;
}
