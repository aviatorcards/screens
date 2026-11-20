/**
 * Screensaver Registry
 * Add new OS screensavers here by providing an `id`, metadata, and a dynamic `load()` function
 * returning an object with `{ mount(container, options), unmount(), setSpeed(n), setPaused(b), setMuted(b), nextScene(), triggerSpecial(key) }`.
 */
export const SCREENSAVERS = [
  {
    id: 'mac-os-9',
    name: 'Classic Mac OS 9.2',
    shortName: 'Mac OS 9.2',
    era: '1999 · Platinum',
    description:
      'A Platinum desktop that uses itself. Finder, SimpleText, QuickTime, SoundJam, Netscape, and Sherlock take turns at the machine, and sometimes the toasters fly.',
    thumbClass: 'thumb-macos9',
    status: 'available',
    specials: [
      { key: 'after-dark', label: 'Flying Toasters Cameo' },
      { key: 'system-bomb', label: 'System Bomb & Reboot' },
      { key: 'appearance', label: 'Switch OS 9 Theme' },
      { key: 'control-strip', label: 'Use Control Strip' },
    ],
    load: () => import('../savers/mac-os-9/index.js?v=4'),
  },
  {
    id: 'windows-evolution',
    name: 'Windows Upgrade Path',
    shortName: 'DOS → XP',
    era: '1985–2001 · DOS → XP',
    description:
      'Watch one PC upgrade through 16 years of history: MS-DOS 3.1 → Windows 1.01 → Windows 3.1 → Windows 95 → Windows 98 SE → Windows XP Luna, carrying the same journal file through every Setup wizard.',
    thumbClass: 'thumb-winevo',
    status: 'available',
    specials: [
      { key: 'era-dos', label: '1985 · MS-DOS 3.1' },
      { key: 'era-win1', label: '1985 · Windows 1.01' },
      { key: 'era-win31', label: '1992 · Windows 3.1' },
      { key: 'era-win95', label: '1995 · Windows 95' },
      { key: 'era-win98', label: '1998 · Windows 98 SE' },
      { key: 'era-winxp', label: '2001 · Windows XP Luna' },
    ],
    load: () => import('../savers/windows-evolution/index.js?v=4'),
  },
  {
    id: 'cpm',
    name: 'CP/M-80',
    shortName: 'CP/M',
    era: '1979 · CP/M',
    description:
      'Planned: CP/M-80 2.2 on a green phosphor screen. The A> prompt runs DIR, PIP, and a little MBASIC.',
    thumbClass: 'thumb-cpm',
    status: 'coming-soon',
  },
  {
    id: 'commodore-64',
    name: 'Commodore 64',
    shortName: 'Commodore 64',
    era: '1982 · 8-bit',
    description:
      'Commodore 64 blue, from the BASIC V2 READY prompt and 10 PRINT into GEOS 2.0 deskTop with geoWrite, geoPaint, VIC-II sprites, and 6581 SID demos.',
    thumbClass: 'thumb-c64',
    status: 'available',
    specials: [
      { key: 'geos-boot', label: 'Boot GEOS 2.0 deskTop' },
      { key: 'ten-print', label: 'Run 10 PRINT Maze' },
      { key: 'sid-demo', label: '6581 SID Demo Scene' },
      { key: 'hard-reset', label: 'C64 Power-On Reset' },
    ],
    load: () => import('../savers/commodore-64/index.js?v=3'),
  },
  {
    id: 'amiga-workbench',
    name: 'Amiga Workbench',
    shortName: 'Workbench',
    era: '1987 · Amiga',
    description:
      'Workbench 1.3 on the bright blue screen. Drawers open, the Shell types, Deluxe Paint draws, and the Boing Ball takes a bounce.',
    thumbClass: 'thumb-amiga',
    status: 'available',
    specials: [
      { key: 'boing', label: 'Boing Ball' },
      { key: 'dpaint', label: 'Deluxe Paint' },
      { key: 'shell', label: 'AmigaShell' },
      { key: 'kickstart', label: 'Kickstart Disk' },
    ],
    load: () => import('../savers/amiga/index.js?v=3'),
  },
  {
    id: 'windows-3.1',
    name: 'Windows 3.1',
    shortName: 'Windows 3.1',
    era: '1992 · Windows 3.1',
    description:
      'Program Manager on the teal desktop. Main, Accessories, and Games open inside it, while Notepad, File Manager, Paintbrush, and Solitaire take turns under navy title bars.',
    thumbClass: 'thumb-win31',
    status: 'available',
    specials: [
      { key: 'solitaire', label: 'Play Solitaire' },
      { key: 'starfield', label: 'Starfield Simulation' },
      { key: 'gpf', label: 'General Protection Fault' },
      { key: 'restart', label: 'Restart Windows' },
    ],
    load: () => import('../savers/windows-3.1/index.js?v=5'),
  },
  {
    id: 'nextstep',
    name: 'NeXTSTEP 3.3',
    shortName: 'NeXTSTEP',
    era: '1993 · NeXTSTEP',
    description:
      'NeXTSTEP 3.3 Workspace on a matte dark gray desk. Miller Columns File Viewer, Tim Berners-Lee’s WorldWideWeb.app, Interface Builder, Terminal, Edit, NeXTmail, Display PostScript, floating left menus, and the right-edge Dock.',
    thumbClass: 'thumb-next',
    status: 'available',
    specials: [
      { key: 'next-boot', label: 'Mach Kernel Boot & Login' },
      { key: 'www-cern', label: 'WorldWideWeb.app (CERN)' },
      { key: 'interface-builder', label: 'Interface Builder (.nib)' },
      { key: 'dps-demo', label: 'Display PostScript Vector' },
    ],
    load: () => import('../savers/nextstep/index.js?v=5'),
  },
  {
    id: 'ms-dos',
    name: 'MS-DOS 6.22',
    shortName: 'MS-DOS 6.22',
    era: '1994 · MS-DOS',
    description:
      '486DX2 BIOS POST into MS-DOS 6.22 — DIR, MEM, hypnotic DEFRAG cluster maps, MS-DOS Edit, Norton Commander, ScanDisk, QBasic Mode 13h, 14.4K ANSI BBS, and DOOM startup.',
    thumbClass: 'thumb-dos',
    status: 'available',
    specials: [
      { key: 'defrag', label: 'Run MS-DOS Defrag' },
      { key: 'bbs', label: 'Dial 14.4K ANSI BBS' },
      { key: 'qbasic', label: 'QBasic Mode 13h Starfield' },
      { key: 'bios-boot', label: '486DX2 BIOS Cold Boot' },
    ],
    load: () => import('../savers/ms-dos/index.js?v=3'),
  },
  {
    id: 'mac-system-7',
    name: 'Macintosh System 7.5',
    shortName: 'System 7.5',
    era: '1994 · Classic',
    description:
      'Crisp 1-bit & 256-color Classic Mac desktop with HyperCard 2.2, Balloon Help, Finder disclosure triangles, SimpleText PlainTalk speech, yellow Note Pad, Desktop Patterns, 15-tile Puzzle, and After Dark: Starry Night.',
    thumbClass: 'thumb-sys7',
    status: 'available',
    specials: [
      { key: 'sys7-boot', label: 'Welcome to Macintosh Boot' },
      { key: 'hypercard', label: 'HyperCard 2.2 Stack' },
      { key: 'after-dark-city', label: 'After Dark: Starry Night' },
      { key: 'desktop-patterns', label: 'Desktop Patterns Panel' },
    ],
    load: () => import('../savers/mac-system-7/index.js?v=7'),
  },
  {
    id: 'windows-95',
    name: 'Windows 95 / 98',
    shortName: 'Windows 95',
    era: '1995 · Windows 95',
    description:
      'Windows 95 on the teal desk, then Windows 98 SE when the title bars go gradient. My Computer, WordPad, and Internet Explorer take a turn, and the taskbar keeps whatever is running.',
    thumbClass: 'thumb-win95',
    status: 'available',
    specials: [
      { key: 'flying', label: 'Flying Windows' },
      { key: 'solitaire', label: 'Play Solitaire' },
      { key: 'win98', label: 'Windows 98 SE' },
      { key: 'shutdown', label: 'Shut Down' },
    ],
    load: () => import('../savers/windows-95/index.js?v=6'),
  },
  {
    id: 'os2-warp',
    name: 'OS/2 Warp 4',
    shortName: 'Warp 4',
    era: '1996 · Warp 4',
    description:
      'OS/2 Warp 4 ("Merlin") and the Workplace Shell. Top WarpCenter with live CPU meter, OS/2 System & Shredder, spiral-bound Notebook Properties, REXX, IBM VoiceType dictation, WebExplorer, Pulse, Scheme Palette drag-and-drop, and Klondike.',
    thumbClass: 'thumb-warp',
    status: 'available',
    specials: [
      { key: 'warp-boot', label: 'OS/2 Warp 4 Boot Splash' },
      { key: 'voicetype', label: 'IBM VoiceType Dictation' },
      { key: 'scheme-palette', label: 'WPS Scheme Palette Drag' },
      { key: 'webexplorer', label: 'IBM WebExplorer (1996)' },
    ],
    load: () => import('../savers/os2-warp/index.js?v=6'),
  },
  {
    id: 'haiku',
    name: 'Haiku / BeOS',
    shortName: 'BeOS',
    era: '2000 · BeOS',
    description:
      'A BeOS Release 5 desk that uses itself. Yellow tabs, Tracker, Deskbar, Terminal, and NetPositive take turns, and the workspaces still switch.',
    thumbClass: 'thumb-haiku',
    status: 'available',
    specials: [
      { key: 'about', label: 'About BeOS' },
      { key: 'workspaces', label: 'Switch workspace' },
      { key: 'find', label: 'Find on the disk' },
      { key: 'restart', label: 'Restart' },
    ],
    load: () => import('../savers/beos/index.js?v=3'),
  },
  {
    id: 'windows-xp',
    name: 'Windows XP Luna',
    shortName: 'Windows XP',
    era: '2001 · Bliss',
    description:
      'Autonomous Windows XP Professional on Bliss hills with the glossy Luna taskbar & two-column Start menu, AOL Instant Messenger, Winamp 2.91, 3D Pinball: Space Cadet, Paint, IE6, live Blue/Olive/Silver Luna themes, tray balloons, and 3D Pipes.',
    thumbClass: 'thumb-winxp',
    status: 'available',
    specials: [
      { key: 'xp-boot', label: 'Windows XP Boot & Welcome' },
      { key: 'pinball', label: '3D Pinball: Space Cadet' },
      { key: 'winamp', label: 'Winamp 2.91 Classic' },
      { key: 'aim', label: 'AIM Buddy List & IM' },
      { key: 'pipes-3d', label: '3D Pipes Screensaver' },
      { key: 'error-cascade', label: 'Classic XP Error Cascade' },
    ],
    load: () => import('../savers/windows-xp/index.js?v=12'),
  },
];

export function getSaverById(id) {
  return SCREENSAVERS.find((s) => s.id === id && s.status === 'available') || SCREENSAVERS[0];
}
