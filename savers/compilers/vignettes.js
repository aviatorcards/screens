/**
 * Short original programs. Each compile streams a verbose driver log
 * while the BUILD lamp is on. No compiler version and no distribution name.
 * rustc still prints one E0308, then a verbose successful rebuild.
 */

const SQUARES_C = [
  '#include <stdio.h>',
  '',
  'int main(void) {',
  '    for (int n = 1; n <= 5; n++) {',
  '        printf("%d %d\\n", n, n * n);',
  '    }',
  '    return 0;',
  '}',
];

const LENGTHS_CPP = [
  '#include <iostream>',
  '#include <string>',
  '',
  'int main() {',
  '    const std::string words[] = {"zig", "rust", "swift"};',
  '    for (const std::string& word : words) {',
  "        std::cout << word.size() << ' ' << word << '\\n';",
  '    }',
  '    return 0;',
  '}',
];

const MARKS_BAD = [
  'fn main() {',
  '    let n: i32 = "4";',
  '    println!("{n}");',
  '}',
];

const MARKS_OK = [
  'fn main() {',
  '    let n: i32 = 4;',
  '    println!("{n}");',
  '}',
];

const TICKS_ZIG = [
  'const std = @import("std");',
  '',
  'pub fn main() void {',
  '    std.debug.print("3 9\\n", .{});',
  '    std.debug.print("4 16\\n", .{});',
  '    std.debug.print("5 25\\n", .{});',
  '}',
];

const LABELS_SWIFT = [
  'let names = ["c", "cpp", "rust"]',
  'for name in names {',
  '    print(name.count, name)',
  '}',
];

const TABLE_GO = [
  'package main',
  '',
  'import "fmt"',
  '',
  'func main() {',
  '    langs := []string{"C", "Zig", "Go"}',
  '    for _, lang := range langs {',
  '        fmt.Printf("%d %s\\n", len(lang), lang)',
  '    }',
  '}',
];

const SERIES_HS = [
  'main = mapM_ print [n * n | n <- [1 .. 5]]',
];

// rustc E0308 for `let n: i32 = "4";`. The quote is column 18.
// After the 4-character gutter, `---` sits under `i32` and `^^^` under `"4"`.
const RUST_CODE = '    let n: i32 = "4";';
const RUST_UNDER = `${' '.repeat(11)}---${' '.repeat(3)}^^^ expected \`i32\`, found \`&str\``;
const RUST_BAR = `${' '.repeat(11)}|`;
const RUST_NOTE = `${' '.repeat(11)}expected due to this`;

if (RUST_CODE.indexOf('"') !== 17) {
  throw new Error('Rust diagnostic column drifted');
}
if (RUST_UNDER.indexOf('---') !== 11 || RUST_UNDER.indexOf('^^^') !== 17) {
  throw new Error('Rust diagnostic carets drifted');
}

const RUST_ERROR = [
  'error[E0308]: mismatched types',
  ' --> marks.rs:2:18',
  '  |',
  `2 | ${RUST_CODE}`,
  `  | ${RUST_UNDER}`,
  `  | ${RUST_BAR}`,
  `  | ${RUST_NOTE}`,
  '',
  'error: aborting due to 1 previous error',
];

// Module name padded to 16, then a space, then `(file, object)`.
const GHC_COMPILE = `[1 of 1] Compiling ${'Main'.padEnd(16, ' ')} (series.hs, series.o)`;
const GHC_LINK = 'Linking series ...';

async function settle(engine, signal) {
  engine.ensurePrompt();
  await engine.wait(160, signal);
}

async function writeFile(engine, name, lines, signal) {
  await engine.typeCommand(`cat > ${name} << 'EOF'`, signal);
  for (const line of lines) {
    await engine.typeSource(line, signal);
  }
  await engine.typeSource('EOF', signal);
}

function srcRows(lines) {
  return lines.filter((line) => line.length > 0).map((text) => ({ text, kind: 'src' }));
}

function phase(text, pause) {
  return { text, kind: 'tool', pause };
}

/** Stream compiler output with the BUILD lamp on. No prompt between lines. */
async function streamLog(engine, rows, signal) {
  engine.setLamp(true);
  engine.sounds.buildTick();
  try {
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const text = row.text;
      const kind = row.kind || (text ? 'tool' : 'plain');
      engine.print(text, kind);
      if (text && i % 8 === 7) engine.sounds.buildTick();
      await engine.wait(row.pause ?? (text ? 64 : 28), signal);
    }
    await engine.wait(160, signal);
  } finally {
    if (!engine.destroyed) engine.setLamp(false);
  }
}

async function compileVerbose(engine, command, rows, signal) {
  await engine.typeCommand(command, signal);
  await streamLog(engine, rows, signal);
  engine.sounds.doneBlip();
  await engine.wait(120, signal);
  engine.showPrompt();
}

async function runBinary(engine, cmd, lines, signal) {
  await engine.typeCommand(cmd, signal);
  for (const line of lines) {
    engine.print(line, 'out');
    await engine.wait(55, signal);
  }
  await engine.wait(160, signal);
  engine.showPrompt();
}

export async function langC(engine, signal) {
  engine.onStatus('Compilers — C');
  await settle(engine, signal);
  await writeFile(engine, 'squares.c', SQUARES_C, signal);
  await compileVerbose(engine, 'cc -std=c11 -Wall -Wextra -v -Q -o squares squares.c', [
    phase('Using built-in specs.'),
    phase('COLLECT_GCC=cc'),
    phase("COLLECT_GCC_OPTIONS='-std=c11' '-Wall' '-Wextra'"),
    phase(" '-v' '-Q' '-o' 'squares' 'squares.c'"),
    phase('cc1 -quiet -std=c11 -Wall -Wextra squares.c', 130),
    phase('ignoring nonexistent directory "/usr/local/include"'),
    phase('#include "..." search starts here:'),
    phase('#include <...> search starts here:'),
    phase(' /usr/include'),
    phase('End of search list.', 110),
    ...srcRows(SQUARES_C),
    phase('Analyzing compilation unit', 90),
    phase('Performing interprocedural optimizations'),
    phase(' <visibility> <build_ssa_passes> <inline>'),
    phase(' <pure-const> <static-var>'),
    phase('Assembling functions:'),
    phase(' main', 150),
    phase('as -o squares.o squares.s'),
    phase('squares.o'),
    phase('ld -o squares squares.o -lc'),
    phase('squares'),
  ], signal);
  await runBinary(engine, './squares', ['1 1', '2 4', '3 9', '4 16', '5 25'], signal);
}

export async function langCpp(engine, signal) {
  engine.onStatus('Compilers — C++');
  await settle(engine, signal);
  await writeFile(engine, 'lengths.cpp', LENGTHS_CPP, signal);
  await compileVerbose(engine, 'c++ -std=c++17 -Wall -Wextra -v -Q -o lengths lengths.cpp', [
    phase('Using built-in specs.'),
    phase('COLLECT_GCC=c++'),
    phase("COLLECT_GCC_OPTIONS='-std=c++17' '-Wall' '-Wextra'"),
    phase(" '-v' '-Q' '-o' 'lengths' 'lengths.cpp'"),
    phase('cc1plus -quiet -std=c++17 -Wall -Wextra lengths.cpp', 130),
    phase('#include <...> search starts here:'),
    phase(' /usr/include'),
    phase('End of search list.', 100),
    ...srcRows(LENGTHS_CPP),
    phase('Analyzing compilation unit'),
    phase('Performing interprocedural optimizations'),
    phase(' <visibility> <build_ssa_passes> <inline>'),
    phase('Assembling functions:'),
    phase(' main', 150),
    phase('as -o lengths.o lengths.s'),
    phase('lengths.o'),
    phase('ld -o lengths lengths.o -lstdc++ -lc'),
    phase('lengths'),
  ], signal);
  await runBinary(engine, './lengths', ['3 zig', '4 rust', '5 swift'], signal);
}

function rustDriver(source, tail) {
  return [
    phase('rustc --crate-name marks marks.rs --edition 2021'),
    phase('--crate-type bin -o marks', 110),
    phase('parsing marks.rs'),
    ...srcRows(source),
    phase('expanding macros'),
    phase('name resolution'),
    phase('type-checking marks.rs', 140),
    ...tail,
  ];
}

export async function langRust(engine, signal) {
  engine.onStatus('Compilers — Rust');
  await settle(engine, signal);
  await writeFile(engine, 'marks.rs', MARKS_BAD, signal);
  await engine.typeCommand('rustc -v -o marks marks.rs', signal);
  await streamLog(engine, rustDriver(MARKS_BAD, RUST_ERROR.map((text) => ({
    text,
    kind: text ? 'err' : 'plain',
    pause: text ? 42 : 24,
  }))), signal);
  await engine.wait(320, signal);
  engine.showPrompt();
  await engine.wait(180, signal);
  await writeFile(engine, 'marks.rs', MARKS_OK, signal);
  await compileVerbose(engine, 'rustc -v -o marks marks.rs', [
    ...rustDriver(MARKS_OK, []),
    phase('borrow-checking marks.rs'),
    phase('monomorphizing'),
    phase('llvm'),
    phase('linking marks'),
    phase('finished marks'),
  ], signal);
  await runBinary(engine, './marks', ['4'], signal);
}

export async function langZig(engine, signal) {
  engine.onStatus('Compilers — Zig');
  await settle(engine, signal);
  await writeFile(engine, 'ticks.zig', TICKS_ZIG, signal);
  await compileVerbose(engine, 'zig build-exe ticks.zig --verbose-cc --verbose-link', [
    phase('compile ticks.zig', 90),
    phase('AstGen'),
    ...srcRows(TICKS_ZIG),
    phase('Sema', 120),
    phase('  std.debug.print'),
    phase('CodeGen'),
    phase('  ticks.o'),
    phase('link'),
    phase('  ld -o ticks ticks.o'),
    phase('./ticks'),
  ], signal);
  await runBinary(engine, './ticks', ['3 9', '4 16', '5 25'], signal);
}

export async function langSwift(engine, signal) {
  engine.onStatus('Compilers — Swift');
  await settle(engine, signal);
  await writeFile(engine, 'labels.swift', LABELS_SWIFT, signal);
  await compileVerbose(engine, 'swiftc -v -o labels labels.swift', [
    phase('swift-frontend -frontend -c labels.swift -o labels.o', 120),
    phase('parsing labels.swift'),
    ...srcRows(LABELS_SWIFT),
    phase('type-checking labels.swift', 110),
    phase('sil-gen'),
    phase('ir-gen'),
    phase('swift-frontend -frontend -emit-module'),
    phase('  labels.swiftmodule'),
    phase('ld -o labels labels.o'),
    phase('labels'),
  ], signal);
  await runBinary(engine, './labels', ['1 c', '3 cpp', '4 rust'], signal);
}

export async function langGo(engine, signal) {
  engine.onStatus('Compilers — Go');
  await settle(engine, signal);
  await writeFile(engine, 'table.go', TABLE_GO, signal);
  await compileVerbose(engine, 'go build -x -o table table.go', [
    phase('WORK=/tmp/go-build'),
    phase('mkdir -p $WORK/b001/'),
    phase('cat >$WORK/b001/importcfg'),
    phase('# import config'),
    phase('packagefile fmt=fmt.a', 100),
    phase('compile -o $WORK/b001/_pkg_.a -p main'),
    phase('  -complete -pack table.go', 90),
    ...srcRows(TABLE_GO),
    phase('link -o table -buildmode=exe'),
    phase('  $WORK/b001/_pkg_.a'),
    phase('table'),
  ], signal);
  await runBinary(engine, './table', ['1 C', '3 Zig', '2 Go'], signal);
}

export async function langHs(engine, signal) {
  engine.onStatus('Compilers — Haskell');
  await settle(engine, signal);
  await writeFile(engine, 'series.hs', SERIES_HS, signal);
  await compileVerbose(engine, 'ghc -v -o series series.hs', [
    phase('*** Chasing dependencies:'),
    phase('Chasing modules from: *series.hs'),
    phase('*** Parser:', 80),
    ...srcRows(SERIES_HS),
    phase('*** Renamer/typechecker:', 110),
    phase('*** Desugar:'),
    phase('*** Simplifier:'),
    phase('*** Simplifier Phase 0'),
    phase('*** Simplifier Phase 1'),
    phase('*** CoreTidy:'),
    phase('*** CorePrep:'),
    phase('*** CodeGen:', 120),
    phase(GHC_COMPILE, 100),
    phase('*** Linker:'),
    phase(GHC_LINK),
  ], signal);
  await runBinary(engine, './series', ['1', '4', '9', '16', '25'], signal);
}

export const REGULAR_VIGNETTES = [
  { id: 'lang-c', run: langC },
  { id: 'lang-cpp', run: langCpp },
  { id: 'lang-rust', run: langRust },
  { id: 'lang-zig', run: langZig },
  { id: 'lang-swift', run: langSwift },
  { id: 'lang-go', run: langGo },
  { id: 'lang-hs', run: langHs },
];

export const SPECIAL_VIGNETTES = {
  'lang-c': langC,
  'lang-cpp': langCpp,
  'lang-rust': langRust,
  'lang-zig': langZig,
  'lang-swift': langSwift,
  'lang-go': langGo,
  'lang-hs': langHs,
};
