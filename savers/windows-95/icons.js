/** 32×32 Windows 95 icons in the VGA palette, plus the waving flag logo. */

const PAL = {
  K: '#000',
  W: '#fff',
  S: '#c0c0c0',
  D: '#808080',
  X: '#404040',
  N: '#000080',
  B: '#0000ff',
  R: '#ff0000',
  M: '#800000',
  E: '#008000',
  L: '#00ff00',
  Y: '#ffff00',
  O: '#808000',
  T: '#008080',
  C: '#00ffff',
  P: '#800080',
  F: '#ff00ff',
  H: '#c0c000',
  A: '#ff8080',
  U: '#e6d2a4',
  J: '#b8a078',
  Q: '#6e6248',
};

function blank() {
  return Array.from({ length: 32 }, () => Array(32).fill('.'));
}

function rect(g, x, y, w, h, c) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (g[yy] && g[yy][xx] !== undefined) g[yy][xx] = c;
    }
  }
}

function frame(g, x, y, w, h, c) {
  rect(g, x, y, w, 1, c);
  rect(g, x, y + h - 1, w, 1, c);
  rect(g, x, y, 1, h, c);
  rect(g, x + w - 1, y, 1, h, c);
}

function disk(g, cx, cy, r, c) {
  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 32; x += 1) {
      if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r) g[y][x] = c;
    }
  }
}

function ring(g, cx, cy, r, thick, c) {
  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 32; x += 1) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (d <= r && d >= r - thick) g[y][x] = c;
    }
  }
}

function fit(g) {
  let minX = 32;
  let minY = 32;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 32; x += 1) {
      if (g[y][x] === '.') continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < 0) return g;
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const left = Math.floor((32 - w) / 2);
  const top = Math.floor((32 - h) / 2);
  const out = blank();
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) out[top + y][left + x] = g[minY + y][minX + x];
  }
  return out;
}

function icon(g) {
  const norm = fit(g);
  let body = '';
  for (let y = 0; y < 32; y += 1) {
    let x = 0;
    while (x < 32) {
      const ch = norm[y][x];
      const fill = PAL[ch];
      if (!fill) {
        x += 1;
        continue;
      }
      let end = x + 1;
      while (end < 32 && norm[y][end] === ch) end += 1;
      body += `<rect x="${x}" y="${y}" width="${end - x}" height="1" fill="${fill}"/>`;
      x = end;
    }
  }
  return `<svg viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
}

function pc(g, x, y, w, h) {
  const bezel = Math.max(2, Math.round(w * 0.12));
  frame(g, x, y, w, h - 6, 'K');
  rect(g, x + 1, y + 1, w - 2, h - 8, 'U');
  rect(g, x + bezel, y + bezel, w - bezel * 2, h - 8 - bezel * 2, 'N');
  rect(g, x + bezel, y + bezel, w - bezel * 2, h - 8 - bezel * 2, 'B');
  rect(g, x + bezel, y + bezel, Math.max(2, (w - bezel * 2) >> 2), 2, 'W');
  rect(g, x + (w >> 2), y + h - 6, w >> 1, 2, 'K');
  frame(g, x, y + h - 4, w, 4, 'K');
  rect(g, x + 1, y + h - 3, w - 2, 2, 'U');
  rect(g, x + 2, y + h - 3, Math.max(3, w >> 2), 1, 'J');
  if (w > 10) g[y + h - 2][x + w - 3] = 'L';
}

function computerIcon() {
  const g = blank();
  frame(g, 4, 1, 24, 18, 'K');
  rect(g, 5, 2, 22, 16, 'U');
  rect(g, 7, 4, 18, 12, 'K');
  rect(g, 8, 5, 16, 10, 'B');
  rect(g, 8, 5, 5, 2, 'W');
  rect(g, 12, 19, 8, 2, 'K');
  rect(g, 13, 19, 6, 1, 'U');
  frame(g, 3, 21, 26, 8, 'K');
  rect(g, 4, 22, 24, 6, 'U');
  rect(g, 6, 24, 10, 2, 'J');
  rect(g, 6, 24, 10, 1, 'Q');
  rect(g, 22, 24, 4, 2, 'L');
  g[24][23] = 'E';
  return icon(g);
}

function networkIcon() {
  const g = blank();
  pc(g, 1, 2, 14, 16);
  pc(g, 17, 8, 14, 16);
  rect(g, 8, 26, 16, 2, 'K');
  rect(g, 8, 27, 16, 1, 'S');
  return icon(g);
}

function recycleIcon() {
  const g = blank();
  frame(g, 6, 5, 20, 4, 'K');
  rect(g, 7, 6, 18, 2, 'S');
  rect(g, 8, 6, 16, 1, 'W');
  for (let i = 0; i < 16; i += 1) {
    const inset = i > 11 ? 2 : i > 6 ? 1 : 0;
    const x = 7 + inset;
    const y = 10 + i;
    const w = 18 - inset * 2;
    rect(g, x, y, w, 1, 'S');
    g[y][x] = 'K';
    g[y][x + w - 1] = 'K';
    for (let k = 3; k < w - 1; k += 3) g[y][x + k] = i % 4 === 3 ? 'D' : 'K';
    if (i % 4 === 3) rect(g, x + 1, y, w - 2, 1, 'D');
  }
  rect(g, 9, 26, 14, 1, 'K');
  return icon(g);
}

function folderIcon(withPage) {
  const g = blank();
  rect(g, 3, 8, 12, 5, 'H');
  frame(g, 3, 8, 12, 5, 'K');
  rect(g, 4, 9, 10, 1, 'Y');
  rect(g, 3, 12, 26, 15, 'Y');
  frame(g, 3, 12, 26, 15, 'K');
  rect(g, 4, 13, 24, 1, 'W');
  rect(g, 4, 25, 24, 1, 'H');
  if (withPage) {
    rect(g, 16, 4, 12, 16, 'W');
    frame(g, 16, 4, 12, 16, 'K');
    for (let i = 0; i < 4; i += 1) rect(g, 18, 7 + i * 3, 8, 1, 'B');
  }
  return icon(g);
}

function pageIcon(lines, mark) {
  const g = blank();
  rect(g, 7, 2, 16, 26, 'W');
  rect(g, 23, 2, 4, 4, 'W');
  frame(g, 7, 2, 20, 26, 'K');
  g[3][22] = 'K';
  g[4][21] = 'K';
  g[5][20] = 'K';
  rect(g, 20, 6, 6, 1, 'K');
  const color = mark || 'B';
  for (let i = 0; i < lines; i += 1) rect(g, 10, 8 + i * 3, 12, 1, color);
  return icon(g);
}

function ieIcon() {
  const g = blank();
  const cx = 16;
  const cy = 16.5;
  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 32; x += 1) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const ang = Math.atan2(dy, dx);
      const ct = Math.cos(ang + 0.7);
      const st = Math.sin(ang + 0.7);
      const er = Math.hypot(dx / 14.5, dy / 6.2);
      if (er > 0.82 && er < 1.08) g[y][x] = st > 0 ? 'Y' : 'H';
      const d = Math.hypot(dx, dy);
      const ringOn = d < 12.2 && d > 6.4;
      const gap = dx > 1.5 && ang > -1.05 && ang < 0.72 && d > 7.2;
      const bar = Math.abs(dy) < 2.1 && dx > -3 && dx < 11.4 && d < 12.4;
      if ((ringOn && !gap) || bar) g[y][x] = 'B';
    }
  }
  return icon(g);
}

function notepadIcon() {
  return pageIcon(6, 'B');
}

function wordpadIcon() {
  const g = blank();
  rect(g, 6, 3, 18, 26, 'W');
  frame(g, 6, 3, 18, 26, 'K');
  rect(g, 9, 7, 12, 2, 'R');
  for (let i = 0; i < 4; i += 1) rect(g, 9, 12 + i * 3, 12, 1, 'N');
  rect(g, 20, 16, 8, 2, 'J');
  rect(g, 26, 12, 2, 8, 'Q');
  g[11][27] = 'K';
  return icon(g);
}

function paintIcon() {
  const g = blank();
  disk(g, 14, 16, 11, 'W');
  ring(g, 14, 16, 11, 1.4, 'K');
  disk(g, 9, 13, 2.2, 'R');
  disk(g, 14, 11, 2.2, 'Y');
  disk(g, 18, 14, 2.2, 'B');
  disk(g, 16, 19, 2.2, 'E');
  disk(g, 10, 18, 2.2, 'P');
  rect(g, 22, 6, 3, 12, 'J');
  rect(g, 23, 4, 2, 4, 'K');
  rect(g, 21, 17, 6, 3, 'S');
  frame(g, 21, 17, 6, 3, 'K');
  return icon(g);
}

function calculatorIcon() {
  const g = blank();
  frame(g, 6, 2, 20, 28, 'K');
  rect(g, 7, 3, 18, 26, 'S');
  rect(g, 9, 5, 14, 6, 'W');
  frame(g, 9, 5, 14, 6, 'X');
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      rect(g, 9 + col * 4, 14 + row * 4, 3, 3, 'D');
      frame(g, 9 + col * 4, 14 + row * 4, 3, 3, 'K');
    }
  }
  return icon(g);
}

function solitaireIcon() {
  const g = blank();
  rect(g, 8, 3, 16, 22, 'W');
  frame(g, 8, 3, 16, 22, 'K');
  rect(g, 11, 6, 3, 3, 'R');
  rect(g, 12, 5, 1, 5, 'R');
  rect(g, 10, 7, 5, 1, 'R');
  rect(g, 11, 18, 4, 3, 'R');
  g[16][12] = 'R';
  g[21][14] = 'R';
  return icon(g);
}

function mineIcon() {
  const g = blank();
  for (let i = 0; i < 7; i += 1) {
    g[2 + i][4 + i] = 'K';
    g[3 + i][4 + i] = 'K';
    g[2 + i][26 - i] = 'K';
    g[3 + i][26 - i] = 'K';
    g[26 - i][4 + i] = 'K';
    g[25 - i][4 + i] = 'K';
    g[26 - i][26 - i] = 'K';
    g[25 - i][26 - i] = 'K';
  }
  rect(g, 15, 1, 2, 7, 'K');
  rect(g, 15, 24, 2, 7, 'K');
  rect(g, 1, 15, 7, 2, 'K');
  rect(g, 24, 15, 7, 2, 'K');
  disk(g, 16, 16, 8, 'K');
  disk(g, 13, 13, 3, 'S');
  g[12][12] = 'W';
  return icon(g);
}

function dosIcon() {
  const g = blank();
  frame(g, 3, 3, 26, 20, 'K');
  rect(g, 4, 4, 24, 18, 'S');
  rect(g, 6, 6, 20, 14, 'K');
  rect(g, 8, 9, 2, 2, 'L');
  rect(g, 8, 12, 8, 2, 'L');
  rect(g, 12, 20, 8, 3, 'K');
  frame(g, 6, 23, 20, 5, 'K');
  rect(g, 7, 24, 18, 3, 'S');
  return icon(g);
}

function explorerIcon() {
  const g = blank();
  frame(g, 4, 5, 22, 18, 'K');
  rect(g, 5, 6, 20, 3, 'N');
  rect(g, 5, 9, 20, 13, 'W');
  rect(g, 8, 12, 6, 1, 'B');
  rect(g, 8, 15, 10, 1, 'S');
  rect(g, 8, 18, 8, 1, 'S');
  rect(g, 14, 16, 14, 12, 'Y');
  frame(g, 14, 16, 14, 12, 'K');
  rect(g, 14, 16, 6, 3, 'H');
  frame(g, 14, 16, 6, 3, 'K');
  return icon(g);
}

function programsIcon() {
  const g = blank();
  frame(g, 4, 4, 24, 22, 'K');
  rect(g, 5, 5, 22, 4, 'N');
  rect(g, 5, 9, 22, 16, 'S');
  rect(g, 8, 12, 7, 6, 'R');
  rect(g, 16, 12, 7, 6, 'E');
  rect(g, 8, 19, 7, 5, 'B');
  rect(g, 16, 19, 7, 5, 'Y');
  return icon(g);
}

function settingsIcon() {
  const g = blank();
  frame(g, 4, 6, 24, 20, 'K');
  rect(g, 5, 7, 22, 18, 'S');
  for (let i = 0; i < 3; i += 1) {
    const y = 10 + i * 5;
    rect(g, 8, y, 16, 2, 'W');
    frame(g, 8, y, 16, 2, 'K');
    const x = 10 + i * 4;
    rect(g, x, y - 1, 3, 4, 'N');
  }
  return icon(g);
}

function findIcon() {
  const g = blank();
  ring(g, 13, 13, 9, 3, 'K');
  ring(g, 13, 13, 7.2, 1.6, 'C');
  disk(g, 11, 11, 2, 'W');
  for (let i = 0; i < 10; i += 1) {
    g[18 + i][18 + i] = 'K';
    g[19 + i][18 + i] = 'K';
    g[18 + i][19 + i] = 'D';
  }
  return icon(g);
}

function helpIcon() {
  const g = blank();
  disk(g, 16, 16, 13, 'B');
  disk(g, 16, 16, 12, 'N');
  rect(g, 14, 8, 4, 2, 'W');
  rect(g, 12, 10, 3, 2, 'W');
  rect(g, 17, 10, 3, 2, 'W');
  rect(g, 15, 12, 3, 4, 'W');
  rect(g, 15, 18, 3, 2, 'W');
  rect(g, 15, 22, 3, 3, 'W');
  return icon(g);
}

function runIcon() {
  const g = blank();
  frame(g, 5, 8, 22, 16, 'K');
  rect(g, 6, 9, 20, 3, 'N');
  rect(g, 6, 12, 20, 11, 'W');
  rect(g, 9, 16, 2, 2, 'K');
  rect(g, 12, 16, 8, 2, 'K');
  return icon(g);
}

function shutdownIcon() {
  const g = blank();
  frame(g, 6, 4, 20, 16, 'K');
  rect(g, 7, 5, 18, 14, 'S');
  rect(g, 9, 7, 14, 10, 'B');
  rect(g, 9, 7, 4, 2, 'W');
  frame(g, 8, 21, 16, 7, 'K');
  rect(g, 9, 22, 14, 5, 'U');
  disk(g, 22, 24, 2.2, 'R');
  return icon(g);
}

function floppyIcon() {
  const g = blank();
  frame(g, 6, 3, 20, 26, 'K');
  rect(g, 7, 4, 18, 24, 'S');
  rect(g, 8, 4, 16, 8, 'D');
  frame(g, 8, 4, 16, 8, 'K');
  rect(g, 18, 6, 4, 4, 'W');
  frame(g, 10, 16, 12, 8, 'K');
  rect(g, 11, 17, 10, 6, 'W');
  rect(g, 14, 18, 4, 4, 'K');
  return icon(g);
}

function driveIcon() {
  const g = blank();
  frame(g, 4, 8, 24, 16, 'K');
  rect(g, 5, 9, 22, 14, 'S');
  rect(g, 5, 9, 22, 2, 'W');
  rect(g, 8, 14, 16, 3, 'X');
  rect(g, 8, 18, 6, 2, 'D');
  disk(g, 22, 19, 1.6, 'L');
  return icon(g);
}

function cdIcon() {
  const g = blank();
  disk(g, 16, 16, 12.6, 'S');
  ring(g, 16, 16, 12.6, 1.3, 'K');
  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 32; x += 1) {
      const dx = x + 0.5 - 16;
      const dy = y + 0.5 - 16;
      const d = Math.hypot(dx, dy);
      if (d <= 4 || d >= 11.4) continue;
      const a = Math.atan2(dy, dx);
      if (a > -0.5 && a < 0.15) g[y][x] = 'R';
      else if (a >= 0.15 && a < 0.8) g[y][x] = 'Y';
      else if (a >= 0.8 && a < 1.45) g[y][x] = 'L';
      else if (a >= 1.45 && a < 2.1) g[y][x] = 'C';
    }
  }
  disk(g, 16, 16, 3.1, 'W');
  ring(g, 16, 16, 3.1, 1, 'K');
  return icon(g);
}

function mailIcon() {
  const g = blank();
  rect(g, 2, 9, 28, 16, 'W');
  frame(g, 2, 9, 28, 16, 'K');
  rect(g, 3, 10, 26, 2, 'N');
  for (let i = 0; i < 9; i += 1) {
    g[11 + i][3 + i] = 'B';
    g[11 + i][4 + i] = 'N';
    g[11 + i][27 - i] = 'B';
    g[11 + i][26 - i] = 'N';
  }
  rect(g, 4, 21, 24, 2, 'B');
  return icon(g);
}

function inboxIcon() {
  const g = blank();
  rect(g, 6, 6, 14, 12, 'W');
  frame(g, 6, 6, 14, 12, 'K');
  for (let i = 0; i < 3; i += 1) rect(g, 8, 8 + i * 3, 10, 1, 'B');
  rect(g, 8, 7, 8, 10, 'W');
  frame(g, 8, 7, 8, 10, 'N');
  frame(g, 3, 18, 26, 8, 'K');
  rect(g, 4, 19, 24, 6, 'S');
  rect(g, 4, 19, 24, 1, 'W');
  rect(g, 10, 21, 12, 3, 'D');
  return icon(g);
}

function deskIcon() {
  const g = blank();
  frame(g, 4, 3, 24, 18, 'K');
  rect(g, 5, 4, 22, 16, 'S');
  rect(g, 7, 6, 18, 12, 'T');
  rect(g, 11, 21, 10, 2, 'K');
  frame(g, 6, 23, 20, 5, 'K');
  rect(g, 7, 24, 18, 3, 'S');
  return icon(g);
}

function printerIcon() {
  const g = blank();
  rect(g, 10, 2, 12, 8, 'W');
  frame(g, 10, 2, 12, 8, 'K');
  frame(g, 4, 9, 24, 12, 'K');
  rect(g, 5, 10, 22, 10, 'S');
  rect(g, 7, 12, 10, 3, 'N');
  disk(g, 23, 13, 1.5, 'L');
  rect(g, 8, 20, 16, 8, 'W');
  frame(g, 8, 20, 16, 8, 'K');
  return icon(g);
}

function exeIcon() {
  const g = blank();
  frame(g, 5, 4, 22, 24, 'K');
  rect(g, 6, 5, 20, 4, 'N');
  rect(g, 6, 9, 20, 18, 'S');
  rect(g, 10, 13, 12, 8, 'W');
  frame(g, 10, 13, 12, 8, 'K');
  rect(g, 12, 16, 8, 2, 'B');
  return icon(g);
}

function smallFace() {
  const rows = [
    '................',
    '....YYYYYYYY....',
    '...YYYYYYYYYY...',
    '..YYYYYYYYYYYY..',
    '..YYKKYYYYKKYY..',
    '..YYKKYYYYKKYY..',
    '..YYYYYYYYYYYY..',
    '..YYYYYYYYYYYY..',
    '..YYKKKKKKKKYY..',
    '..YYYKKKKKKYYY..',
    '..YYYYYYYYYYYY..',
    '...YYYYYYYYYY...',
    '....YYYYYYYY....',
    '......YYYY......',
    '................',
    '................',
  ];
  let body = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < 16; x += 1) {
      const fill = PAL[row[x]];
      if (fill) body += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`;
    }
  });
  return `<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
}

export const FLAG = `<svg viewBox="0 0 80 60" aria-hidden="true">
  <path fill="#ff0000" d="M4 16 L34 6 L32 26 L2 34 Z"/>
  <path fill="#00a000" d="M38 8 L76 16 L72 34 L34 26 Z"/>
  <path fill="#0000ee" d="M2 38 L32 30 L30 52 L4 58 Z"/>
  <path fill="#ffe000" d="M36 30 L72 38 L66 56 L30 52 Z"/>
</svg>`;

export const SMILE = smallFace();

const ICONS = {
  computer: computerIcon(),
  network: networkIcon(),
  recycle: recycleIcon(),
  inbox: inboxIcon(),
  folder: folderIcon(false),
  documents: folderIcon(true),
  ie: ieIcon(),
  notepad: notepadIcon(),
  wordpad: wordpadIcon(),
  paint: paintIcon(),
  calculator: calculatorIcon(),
  solitaire: solitaireIcon(),
  mine: mineIcon(),
  dos: dosIcon(),
  explorer: explorerIcon(),
  programs: programsIcon(),
  settings: settingsIcon(),
  find: findIcon(),
  help: helpIcon(),
  run: runIcon(),
  shutdown: shutdownIcon(),
  file: pageIcon(5, 'N'),
  exe: exeIcon(),
  floppy: floppyIcon(),
  drive: driveIcon(),
  cd: cdIcon(),
  mail: mailIcon(),
  desk: deskIcon(),
  printer: printerIcon(),
};

export function iconSvg(name) {
  return ICONS[name] || ICONS.file;
}
