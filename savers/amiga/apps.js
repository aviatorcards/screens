import { glyph } from './icons.js';

export const WORKBENCH_MENUS = [
  {
    label: 'Workbench',
    items: [
      { label: 'Open' },
      { label: 'Close' },
      { label: 'Duplicate' },
      { label: 'Rename' },
      { label: 'Info' },
      { label: 'Discard', ghost: true },
    ],
  },
  {
    label: 'Disk',
    items: [
      { label: 'Empty Trash' },
      { label: 'Initialize', ghost: true },
    ],
  },
  {
    label: 'Special',
    items: [
      { label: 'Clean Up' },
      { label: 'Last Error', ghost: true },
      { label: 'Redraw' },
      { label: 'Snapshot' },
      { label: 'Version' },
    ],
  },
];

export const DPAINT_MENUS = [
  {
    label: 'Picture',
    items: [
      { label: 'Clear' },
      { label: 'Undo' },
      { label: 'Save' },
    ],
  },
  {
    label: 'Brush',
    items: [
      { label: 'Size' },
      { label: 'Rotate' },
    ],
  },
  {
    label: 'Mode',
    items: [
      { label: 'Matte' },
      { label: 'Color' },
    ],
  },
];

const DISK_ICONS = [
  ['System', 'drawer'],
  ['Utilities', 'drawer'],
  ['Expansion', 'drawer'],
  ['Prefs', 'prefs'],
];

const UTIL_ICONS = [
  ['Clock', 'clock'],
  ['Notepad', 'note'],
  ['Calculator', 'calc'],
  ['Say', 'say'],
];

const SYSTEM_ICONS = [
  ['Shell', 'shell'],
  ['DiskCopy', 'floppy'],
  ['Format', 'floppy'],
];

function iconButton(label, icon, className) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.dataset.label = label;
  btn.appendChild(glyph(icon));
  const text = document.createElement('span');
  text.className = 'wb-label';
  text.textContent = label;
  btn.appendChild(text);
  return btn;
}

export function findControl(win, label) {
  return [...win.el.querySelectorAll('[data-label]')].find((node) => node.dataset.label === label) || null;
}

export function openDrawer(engine, title, icons, x, y) {
  const wrap = document.createElement('div');
  wrap.className = 'wb-icons';
  for (const [label, icon] of icons) wrap.appendChild(iconButton(label, icon, 'wb-iicon'));
  return engine.createWindow({
    title,
    kind: 'drawer',
    width: 560,
    height: 340,
    x,
    y,
    node: wrap,
  });
}

export function openWorkbench(engine) {
  return openDrawer(engine, 'Workbench1.3', DISK_ICONS, 172, 48);
}

export function openUtilities(engine) {
  return openDrawer(engine, 'Utilities', UTIL_ICONS, 228, 100);
}

export function openSystem(engine) {
  return openDrawer(engine, 'System', SYSTEM_ICONS, 214, 96);
}

export function openShell(engine) {
  const doc = document.createElement('div');
  doc.className = 'wb-term';
  doc.appendChild(document.createTextNode('1.Workbench1.3:> '));
  const caret = document.createElement('i');
  caret.className = 'wb-caret';
  doc.appendChild(caret);
  const win = engine.createWindow({
    title: 'Shell',
    kind: 'shell',
    width: 620,
    height: 320,
    x: 196,
    y: 142,
    clientClass: 'term',
    node: doc,
  });
  win.docEl = doc;
  return win;
}

export function termPrint(el, text) {
  const caret = el.querySelector('.wb-caret');
  const node = document.createTextNode(text);
  if (caret) el.insertBefore(node, caret);
  else el.appendChild(node);
  el.scrollTop = el.scrollHeight;
}

export function openNotepad(engine) {
  const doc = document.createElement('div');
  doc.className = 'wb-note';
  const caret = document.createElement('i');
  caret.className = 'wb-caret';
  doc.appendChild(caret);
  const win = engine.createWindow({
    title: 'Notepad',
    kind: 'note',
    width: 500,
    height: 340,
    x: 210,
    y: 88,
    clientClass: 'paper',
    node: doc,
  });
  win.docEl = doc;
  return win;
}

export function openClock(engine) {
  const face = document.createElement('div');
  face.className = 'wb-clockface';
  const time = document.createElement('div');
  time.className = 'wb-time';
  time.textContent = engine.clockString();
  const sub = document.createElement('div');
  sub.textContent = 'Clock';
  face.append(time, sub);
  return engine.createWindow({
    title: 'Clock',
    kind: 'clock',
    width: 230,
    height: 150,
    x: 250,
    y: 132,
    scale: false,
    clientClass: 'solid',
    node: face,
  });
}

export function openVersion(engine) {
  const body = document.createElement('div');
  body.className = 'wb-req';
  const a = document.createElement('p');
  a.textContent = 'Workbench version 34.20';
  const b = document.createElement('p');
  b.textContent = 'Kickstart version 34.5';
  const ok = document.createElement('button');
  ok.type = 'button';
  ok.className = 'wb-gadget';
  ok.dataset.label = 'OK';
  ok.textContent = 'OK';
  body.append(a, b, ok);
  const win = engine.createWindow({
    title: 'Version',
    kind: 'requester',
    width: 320,
    height: 168,
    scale: false,
    center: true,
    clientClass: 'solid',
    node: body,
  });
  win.ok = ok;
  return win;
}

const TOOLS = [
  ['draw', 'M3 13 L10 3 L13 6 L6 16 Z'],
  ['line', 'M3 13 H13 M8 4 V14'],
  ['curve', 'M3 12 Q8 2 13 12'],
  ['box', 'M3 3 H13 V13 H3 Z'],
  ['circle', 'M8 3 A5 5 0 1 0 8.1 3'],
  ['fill', 'M8 2 L13 8 L10 8 L10 14 L6 14 L6 8 L3 8 Z'],
  ['text', 'M4 4 H12 M8 4 V13 M5 13 H11'],
  ['brush', 'M3 13 L9 3 L12 6 L6 16 Z M10 4 L13 2'],
];

function toolButton(name, path, on) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = on ? 'wb-tool on' : 'wb-tool';
  btn.dataset.tool = name;
  btn.setAttribute('aria-label', name);
  btn.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${path}" fill="none" stroke="#000" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  return btn;
}

export function openDPaint(engine) {
  const dp = document.createElement('div');
  dp.className = 'wb-dp';
  const canvas = document.createElement('canvas');
  canvas.className = 'wb-canvas';
  const tools = document.createElement('div');
  tools.className = 'wb-tools';
  let circle = null;
  for (const [name, path] of TOOLS) {
    const btn = toolButton(name, path, name === 'circle');
    if (name === 'circle') circle = btn;
    tools.appendChild(btn);
  }
  const pals = document.createElement('div');
  pals.className = 'wb-pals';
  const colors = ['#000', '#fff', '#e10600', '#ff8800', '#ffdd00', '#00aa00', '#00aaaa', '#0055aa', '#cc44cc', '#884400', '#ff88aa', '#888', '#004488', '#88ff88', '#aa0000', '#222'];
  colors.forEach((color, index) => {
    const swatch = document.createElement('i');
    swatch.className = index === 2 ? 'wb-swatch on' : 'wb-swatch';
    swatch.style.background = color;
    pals.appendChild(swatch);
  });
  dp.append(canvas, tools, pals);
  const win = engine.createWindow({
    title: 'DeluxePaint II',
    kind: 'dpaint',
    width: 700,
    height: 460,
    x: 172,
    y: 46,
    clientClass: 'paint',
    node: dp,
  });
  win.canvas = canvas;
  win.tool = circle;
  return win;
}

export function paintDeluxe(canvas, t) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  const floor = Math.floor(h * 0.72);
  ctx.fillStyle = '#d00000';
  ctx.fillRect(0, floor, Math.floor(w * Math.min(1, t * 1.4)), 8);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, floor + 8, Math.floor(w * Math.min(1, t * 1.4)), 8);
  const radius = Math.min(w, h) * 0.28 * Math.min(1, t * 1.15);
  if (radius < 2) return;
  const cx = Math.floor(w * 0.46);
  const cy = Math.floor(h * 0.42);
  const step = 8;
  for (let y = -radius; y < radius; y += step) {
    for (let x = -radius; x < radius; x += step) {
      if (x * x + y * y > radius * radius) continue;
      const on = (Math.floor((x + radius) / step) + Math.floor((y + radius) / step)) % 2 === 0;
      ctx.fillStyle = on ? '#e10600' : '#fff';
      ctx.fillRect(cx + x, cy + y, step, step);
    }
  }
}
