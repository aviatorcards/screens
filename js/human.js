/**
 * Ghost-user timing shared by the screensavers.
 * Key cadence, a single corrected typo, and a pointer that sometimes
 * coasts past the target. No DOM and no audio: each engine still draws.
 */

const NEIGHBORS = {
  a: 's', b: 'v', c: 'x', d: 's', e: 'r', f: 'd', g: 'f', h: 'j',
  i: 'o', j: 'k', k: 'l', l: 'k', m: 'n', n: 'm', o: 'p', p: 'o',
  q: 'w', r: 'e', s: 'a', t: 'r', u: 'y', v: 'c', w: 'e', x: 'c',
  y: 't', z: 'x',
};

function neighbor(ch, rand) {
  const lower = ch.toLowerCase();
  const alt = NEIGHBORS[lower];
  if (!alt) return null;
  const picked = rand() < 0.85 ? alt : (NEIGHBORS[alt] || alt);
  if (picked === lower) return null;
  return ch === lower ? picked : picked.toUpperCase();
}

/** Pause after one key. Longer on punctuation, shorter on spaces, rare hesitations. */
export function keyDelay(ch, base, rand = Math.random) {
  let pause = base * (0.68 + rand() * 0.75);
  if (ch === ' ') pause *= 0.7;
  else if (ch === '.' || ch === '!' || ch === '?' || ch === ':') pause += base * 2.6;
  else if (ch === ',' || ch === ';') pause += base * 1.5;
  else if (ch === '\n') pause += base * 3.4;
  if (rand() < 0.02 && /[a-z]/i.test(ch)) pause += base * (2.2 + rand() * 3.2);
  return Math.max(12, pause);
}

/**
 * Steps that play back to `text`. At most one adjacent-key typo, then a backspace.
 * Short strings and non-letters are typed clean so commands stay recognizable.
 */
export function typingSteps(text, { base = 46, allowTypo = true, rand = Math.random } = {}) {
  const chars = Array.from(text);
  const steps = [];
  let typoAt = -1;
  if (allowTypo && chars.length >= 8) {
    const candidates = [];
    for (let i = 2; i < chars.length - 1; i += 1) {
      if (/[a-z]/i.test(chars[i]) && NEIGHBORS[chars[i].toLowerCase()]) candidates.push(i);
    }
    const chance = chars.length > 16 ? 0.62 : 0.22;
    if (candidates.length && rand() < chance) {
      typoAt = candidates[Math.floor(rand() * candidates.length)];
    }
  }
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    if (i === typoAt) {
      const wrong = neighbor(ch, rand);
      if (wrong && wrong !== ch) {
        steps.push({ kind: 'char', ch: wrong, delay: keyDelay(wrong, base, rand) });
        steps.push({ kind: 'backspace', delay: base * (1.15 + rand() * 0.7) });
      }
    }
    steps.push({ kind: 'char', ch, delay: keyDelay(ch, base, rand) });
  }
  return steps;
}

/** Text left on screen after every step, including the corrected typo. */
export function playedText(steps) {
  let text = '';
  for (const step of steps) {
    if (step.kind === 'backspace') text = text.slice(0, -1);
    else text += step.ch;
  }
  return text;
}

/** Run steps through engine callbacks. `check` may throw to abort the scene. */
export async function typeInto(text, options, hooks) {
  for (const step of typingSteps(text, options)) {
    if (hooks.check) hooks.check();
    hooks.apply(step);
    if (hooks.sound) hooks.sound(step);
    await hooks.wait(step.delay);
  }
}

/**
 * A small coast past the target on longer moves.
 * Returns null when the move is short or this stroke lands clean.
 */
export function cursorOvershoot(sx, sy, x, y, rand = Math.random) {
  const dx = x - sx;
  const dy = y - sy;
  const dist = Math.hypot(dx, dy);
  if (dist < 110 || rand() > 0.38) return null;
  const mag = 3.5 + rand() * 6.5;
  return {
    x: x + (dx / dist) * mag + (rand() - 0.5) * 2.5,
    y: y + (dy / dist) * mag + (rand() - 0.5) * 2.5,
    hold: 36 + rand() * 55,
  };
}

/** Place the overshoot, wait, then put the pointer on the real target. */
export async function settlePointer(sx, sy, x, y, { place, wait, signal, rand } = {}) {
  if (!place) return false;
  const over = cursorOvershoot(sx, sy, x, y, rand);
  if (!over || !wait) {
    place(x, y);
    return false;
  }
  place(over.x, over.y);
  await wait(over.hold, signal);
  place(x, y);
  return true;
}

/** Insert characters in front of a caret span, and remove the last one on backspace. */
export function caretApply(el, selector) {
  const nodes = [];
  return (step) => {
    if (step.kind === 'backspace') {
      nodes.pop()?.remove();
      return;
    }
    const caret = selector ? el.querySelector?.(selector) : null;
    const node = document.createTextNode(step.ch);
    if (caret) el.insertBefore(node, caret);
    else el.appendChild(node);
    nodes.push(node);
    if (el.scrollHeight) el.scrollTop = el.scrollHeight;
  };
}

/** Type into an input value without deleting text that was already there. */
export function valueApply(input) {
  const floor = input.value.length;
  return (step) => {
    if (step.kind === 'backspace') {
      if (input.value.length > floor) input.value = input.value.slice(0, -1);
      return;
    }
    input.value += step.ch;
  };
}

/** Type into an element's text, keeping any text that was already there. */
export function textApply(el) {
  let current = el.textContent || '';
  const floor = current.length;
  return (step) => {
    if (step.kind === 'backspace') {
      if (current.length > floor) current = current.slice(0, -1);
    } else {
      current += step.ch;
    }
    el.textContent = current;
  };
}
