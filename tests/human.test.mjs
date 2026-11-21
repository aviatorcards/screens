import assert from 'node:assert/strict';
import test from 'node:test';
import { cursorOvershoot, keyDelay, playedText, settlePointer, typingSteps } from '../js/human.js';
import { formatCpmDirectory } from '../savers/cpm/engine.js';

function always(n) {
  return () => n;
}

test('corrected typing plays back to the original text', () => {
  const samples = [
    '',
    'DIR',
    'A>',
    'notes.txt',
    'TYPE NOTES.TXT',
    'fn main() {\n    let n: i32 = 4;\n}\n',
    'The workspace switcher sits on the bottom panel.',
    'cc -std=c11 -Wall -Wextra -o squares squares.c',
  ];
  for (const text of samples) {
    for (let i = 0; i < 30; i += 1) {
      const steps = typingSteps(text, { base: 40 });
      assert.equal(playedText(steps), text);
      for (const step of steps) assert.ok(step.delay >= 12);
    }
  }
});

test('a forced typo is one wrong letter and a backspace, then the real letter', () => {
  const text = 'TYPE NOTES.TXT';
  const steps = typingSteps(text, { base: 40, rand: always(0) });
  const backs = steps.filter((step) => step.kind === 'backspace');
  assert.equal(backs.length, 1);
  assert.equal(playedText(steps), text);
  const idx = steps.findIndex((step) => step.kind === 'backspace');
  assert.ok(idx > 0);
  assert.equal(steps[idx - 1].kind, 'char');
  assert.equal(steps[idx + 1].kind, 'char');
  assert.notEqual(steps[idx - 1].ch, steps[idx + 1].ch);
});

test('short commands and disabled typos are typed clean', () => {
  assert.equal(typingSteps('DIR', { rand: always(0) }).some((s) => s.kind === 'backspace'), false);
  const clean = typingSteps('TYPE NOTES.TXT', { allowTypo: false, rand: always(0) });
  assert.equal(clean.some((s) => s.kind === 'backspace'), false);
  assert.equal(playedText(clean), 'TYPE NOTES.TXT');
});

test('punctuation waits longer than a letter', () => {
  const rand = always(0.5);
  assert.ok(keyDelay('.', 40, rand) > keyDelay('a', 40, rand));
  assert.ok(keyDelay('\n', 40, rand) > keyDelay('a', 40, rand));
  assert.ok(keyDelay(' ', 40, rand) < keyDelay('a', 40, rand));
});

test('the pointer coasts only on a long move', () => {
  assert.equal(cursorOvershoot(0, 0, 40, 0, always(0)), null);
  assert.equal(cursorOvershoot(0, 0, 400, 0, always(0.9)), null);
  const over = cursorOvershoot(0, 0, 400, 0, always(0));
  assert.ok(over.x > 400);
  assert.ok(over.hold >= 36);
});

test('the pointer always finishes on the target', async () => {
  const seen = [];
  const landed = await settlePointer(0, 0, 400, 10, {
    rand: always(0),
    wait: async () => {},
    place: (x, y) => seen.push([x, y]),
  });
  assert.equal(landed, true);
  assert.deepEqual(seen.at(-1), [400, 10]);
  const missed = [];
  const quiet = await settlePointer(0, 0, 20, 0, {
    rand: always(0),
    wait: async () => {},
    place: (x, y) => missed.push([x, y]),
  });
  assert.equal(quiet, false);
  assert.deepEqual(missed, [[20, 0]]);
});

test('CP/M DIR puts the drive letter once per line', () => {
  const lines = formatCpmDirectory([
    ['ASM', 'COM'],
    ['DDT', 'COM'],
    ['DUMP', 'COM'],
    ['ED', 'COM'],
    ['LOAD', 'COM'],
  ]);
  assert.deepEqual(lines, [
    'A: ASM      COM : DDT      COM : DUMP     COM : ED       COM',
    'A: LOAD     COM',
  ]);
  assert.equal(lines[0].split('A:').length - 1, 1);
});
