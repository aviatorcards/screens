const PROGRAM = [
  '10 PRINT "STUDIO LOG"',
  '20 FOR I=1 TO 3',
  '30 PRINT I',
  '40 NEXT I',
  '50 END',
];

async function settle(engine, signal) {
  engine.ensurePrompt();
  await engine.wait(220, signal);
}

export async function cpmBoot(engine, signal) {
  engine.onStatus('CP/M-80 2.2 — Cold boot');
  await engine.coldBoot(signal);
  await engine.wait(480, signal);
}

export async function cpmDir(engine, signal) {
  engine.onStatus('CP/M-80 — DIR');
  await settle(engine, signal);
  await engine.typeCommand('DIR', {}, signal);
  await engine.diskAccess(signal, 300);
  for (const line of engine.dirLines()) {
    engine.print(line);
    await engine.wait(70, signal);
  }
  await engine.wait(180, signal);
  engine.showPrompt('A>');
  await engine.wait(520, signal);
}

export async function cpmType(engine, signal) {
  engine.onStatus('CP/M-80 — TYPE NOTES.TXT');
  await settle(engine, signal);
  await engine.typeCommand('TYPE NOTES.TXT', {}, signal);
  await engine.diskAccess(signal, 280);
  for (const line of engine.notes) {
    engine.print(line);
    await engine.wait(80, signal);
  }
  await engine.wait(180, signal);
  engine.showPrompt('A>');
  await engine.wait(480, signal);
}

export async function cpmPip(engine, signal) {
  engine.onStatus('CP/M-80 — PIP');
  await settle(engine, signal);
  await engine.typeCommand('PIP', {}, signal);
  await engine.diskAccess(signal, 360);
  await engine.typeCommand('NOTES.BAK=NOTES.TXT', { prompt: '*' }, signal);
  await engine.diskAccess(signal, 440);
  engine.noteBackup();
  engine.showPrompt('*');
  await engine.wait(380, signal);
  engine.commitLine('*^C');
  engine.sounds.keyClick();
  await engine.wait(160, signal);
  engine.showPrompt('A>');
  await engine.wait(420, signal);
}

export async function cpmStat(engine, signal) {
  engine.onStatus('CP/M-80 — STAT');
  await settle(engine, signal);
  await engine.typeCommand('STAT', {}, signal);
  await engine.diskAccess(signal, 300);
  engine.print(engine.spaceLine());
  await engine.wait(360, signal);
  engine.showPrompt('A>');
  const spec = engine.hasBak ? 'NOTES.*' : 'NOTES.TXT';
  await engine.wait(200, signal);
  await engine.typeCommand(`STAT ${spec}`, {}, signal);
  await engine.diskAccess(signal, 320);
  for (const line of engine.statLines()) {
    engine.print(line);
    await engine.wait(70, signal);
  }
  await engine.wait(180, signal);
  engine.showPrompt('A>');
  await engine.wait(480, signal);
}

export async function cpmMbasic(engine, signal) {
  engine.onStatus('CP/M-80 — MBASIC');
  await settle(engine, signal);
  await engine.typeCommand('MBASIC', {}, signal);
  await engine.diskAccess(signal, 520);
  const banner = [
    'BASIC-80 Rev. 5.21',
    '[CP/M Version]',
    'Copyright 1977-1981 (C) by Microsoft',
    '',
    'Ok',
  ];
  for (const line of banner) {
    engine.print(line);
    await engine.wait(90, signal);
  }
  for (const line of PROGRAM) {
    await engine.typeCommand(line, { prompt: '' }, signal);
    await engine.wait(90, signal);
  }
  await engine.typeCommand('LIST', { prompt: '' }, signal);
  await engine.wait(80, signal);
  for (const line of PROGRAM) {
    engine.print(line);
    await engine.wait(50, signal);
  }
  engine.print('Ok');
  await engine.wait(200, signal);
  await engine.typeCommand('RUN', { prompt: '' }, signal);
  await engine.wait(80, signal);
  engine.print('STUDIO LOG');
  await engine.wait(70, signal);
  engine.print(' 1 ');
  await engine.wait(70, signal);
  engine.print(' 2 ');
  await engine.wait(70, signal);
  engine.print(' 3 ');
  await engine.wait(70, signal);
  engine.print('Ok');
  await engine.wait(280, signal);
  await engine.typeCommand('SYSTEM', { prompt: '' }, signal);
  await engine.wait(160, signal);
  engine.showPrompt('A>');
  await engine.wait(480, signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'cpm-dir', run: cpmDir },
  { id: 'cpm-type', run: cpmType },
  { id: 'cpm-pip', run: cpmPip },
  { id: 'cpm-stat', run: cpmStat },
  { id: 'cpm-mbasic', run: cpmMbasic },
];

export const SPECIAL_VIGNETTES = {
  'cpm-boot': cpmBoot,
  'cpm-dir': cpmDir,
  'cpm-pip': cpmPip,
  'cpm-mbasic': cpmMbasic,
};
