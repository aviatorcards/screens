/** 32×32 Workbench 1.3 icons in the four-color palette. */

const PAL = {
  K: '#000000',
  W: '#ffffff',
  B: '#0055aa',
  O: '#ff8800',
  R: '#e10600',
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

function svgFrom(g) {
  let rects = '';
  for (let y = 0; y < 32; y += 1) {
    let x = 0;
    while (x < 32) {
      const color = g[y][x];
      if (color === '.') {
        x += 1;
        continue;
      }
      let x2 = x + 1;
      while (x2 < 32 && g[y][x2] === color) x2 += 1;
      rects += `<rect x="${x}" y="${y}" width="${x2 - x}" height="1" fill="${PAL[color]}"/>`;
      x = x2;
    }
  }
  return `<svg viewBox="0 0 32 32" width="32" height="32" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

function floppy() {
  const g = blank();
  rect(g, 6, 2, 20, 28, 'W');
  frame(g, 6, 2, 20, 28, 'K');
  rect(g, 8, 6, 16, 9, 'O');
  rect(g, 10, 8, 12, 1, 'K');
  rect(g, 10, 11, 8, 1, 'K');
  rect(g, 8, 20, 16, 7, 'K');
  rect(g, 11, 22, 10, 2, 'W');
  rect(g, 14, 16, 4, 3, 'B');
  return g;
}

function drawer() {
  const g = blank();
  rect(g, 9, 4, 14, 6, 'O');
  frame(g, 9, 4, 14, 6, 'K');
  rect(g, 4, 10, 24, 16, 'W');
  frame(g, 4, 10, 24, 16, 'K');
  rect(g, 10, 16, 12, 4, 'K');
  rect(g, 11, 17, 10, 2, 'W');
  return g;
}

function ram() {
  const g = blank();
  for (const y of [8, 12, 16, 20, 24]) {
    rect(g, 2, y, 5, 2, 'K');
    rect(g, 25, y, 5, 2, 'K');
    rect(g, 3, y, 3, 1, 'W');
    rect(g, 26, y, 3, 1, 'W');
  }
  rect(g, 7, 5, 18, 23, 'K');
  rect(g, 9, 8, 14, 7, 'O');
  rect(g, 10, 17, 12, 2, 'W');
  rect(g, 10, 21, 12, 2, 'W');
  return g;
}

function trash() {
  const g = blank();
  rect(g, 10, 3, 12, 3, 'K');
  rect(g, 6, 6, 20, 3, 'K');
  rect(g, 8, 10, 16, 17, 'W');
  frame(g, 8, 10, 16, 17, 'K');
  rect(g, 12, 13, 2, 11, 'K');
  rect(g, 18, 13, 2, 11, 'K');
  return g;
}

function shell() {
  const g = blank();
  rect(g, 3, 5, 26, 22, 'W');
  frame(g, 3, 5, 26, 22, 'K');
  rect(g, 5, 7, 22, 16, 'K');
  rect(g, 7, 10, 9, 2, 'O');
  rect(g, 7, 14, 14, 2, 'O');
  rect(g, 7, 18, 6, 2, 'O');
  return g;
}

function dpaint() {
  const g = floppy();
  for (let i = 0; i < 14; i += 1) {
    const x = 22 - i;
    const y = 6 + i;
    rect(g, x, y, 2, 2, 'R');
  }
  rect(g, 8, 6, 8, 4, 'W');
  return g;
}

function clock() {
  const g = blank();
  disk(g, 16, 16, 13, 'W');
  ring(g, 16, 16, 13, 2, 'K');
  rect(g, 15, 7, 2, 9, 'K');
  rect(g, 15, 15, 8, 2, 'O');
  rect(g, 15, 6, 2, 2, 'K');
  rect(g, 15, 24, 2, 2, 'K');
  rect(g, 5, 15, 2, 2, 'K');
  rect(g, 25, 15, 2, 2, 'K');
  return g;
}

function note() {
  const g = blank();
  rect(g, 7, 2, 18, 27, 'W');
  frame(g, 7, 2, 18, 27, 'K');
  rect(g, 19, 2, 6, 6, 'O');
  frame(g, 19, 2, 6, 6, 'K');
  for (const y of [11, 15, 19, 23]) rect(g, 10, y, 12, 1, 'B');
  return g;
}

function prefs() {
  const g = blank();
  rect(g, 3, 7, 26, 18, 'W');
  frame(g, 3, 7, 26, 18, 'K');
  rect(g, 6, 12, 16, 2, 'K');
  rect(g, 16, 10, 4, 6, 'O');
  rect(g, 6, 19, 16, 2, 'K');
  rect(g, 9, 17, 4, 6, 'O');
  return g;
}

function calc() {
  const g = blank();
  rect(g, 5, 2, 22, 28, 'W');
  frame(g, 5, 2, 22, 28, 'K');
  rect(g, 8, 5, 16, 6, 'K');
  rect(g, 9, 6, 14, 4, 'O');
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      rect(g, 8 + col * 6, 14 + row * 5, 4, 3, 'K');
    }
  }
  return g;
}

function say() {
  const g = blank();
  rect(g, 4, 5, 24, 15, 'W');
  frame(g, 4, 5, 24, 15, 'K');
  rect(g, 10, 20, 4, 3, 'W');
  frame(g, 10, 20, 4, 3, 'K');
  rect(g, 12, 23, 3, 4, 'K');
  rect(g, 8, 10, 10, 2, 'K');
  rect(g, 8, 14, 14, 2, 'O');
  return g;
}

const ART = {
  floppy,
  drawer,
  ram,
  trash,
  shell,
  dpaint,
  clock,
  note,
  prefs,
  calc,
  say,
};

export function iconSvg(name) {
  const draw = ART[name] || floppy;
  return svgFrom(draw());
}

export function glyph(name) {
  const span = document.createElement('span');
  span.className = 'wb-glyph';
  span.innerHTML = iconSvg(name);
  return span;
}
