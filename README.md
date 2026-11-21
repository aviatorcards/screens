[Live link](https://screens.fddl.dev)

# Living OS Screensavers

Fullscreen browser-based retro operating system screensavers that look like someone never logged off. Built as zero-build static HTML, CSS, and ES modules—drop them onto any web server (such as Apache) and run straight in the browser.

## Features

- **Lobby & Dedicated Fullscreen Player**:
  - `index.html` — Front-page lobby featuring a live animated CRT Mac OS 9 diorama (with a real-time menu bar clock) and a shelf of every operating system.
  - `watch.html` — Distraction-free fullscreen screensaver player. Auto-hides the real pointer while idle and keeps controls invisible until you move near the bottom edge (or press `H`).
- **Live Real-World Time & Dates**: Menu bar and taskbar clocks tick in real time, and desktop files, Stickies, SimpleText notes, Get Info windows, Outlook Express emails, and DOS/BBS banners dynamically reflect the current day and time.
- **Play All / Auto-Cycle Mode**: Rotate automatically through all 19 screensavers (90 seconds each, pausing when choreography is paused) via **Play all** in the lobby or switcher, the `↻ All` HUD button, the `C` key, or `watch.html?cycle=1`.
- **Opt-In Synthesized Retro Audio**: Web Audio API sound synthesis starts muted by default and can be toggled anytime (`M`).
- **Modular Multi-OS Architecture**: 19 playable screensavers (18 retro operating systems plus **Compilers**) plug cleanly into `js/registry.js` and load on demand via dynamic ES imports.

---

## Screensaver Lineup

### Available Now (19)

#### Classic Mac OS 9.2 (`1999 · Platinum`)
An autonomous Platinum desktop with rounded screen corners, Rainbow Apple menu bar, dynamic per-app menus, Application Switcher, WindowShade title bars, bottom-left Control Strip, and 6 authentic tiled OS 9 desktop patterns + Platinum highlight colors.

- **Startup Sequence**: Boots with a Happy Mac, *"Welcome to Mac OS 9.2"* splash screen, startup chime (when unmuted), and marching System Extensions.
- **19 Autonomous "Ghost User" Vignettes**:
  1. **Finder Cleanup** — Opens Macintosh HD, switches to List View, drags temp files to Trash, and empties Trash via `Special → Empty Trash…`.
  2. **SimpleText Journal** — Types dated studio notes with natural cadence, occasional typo/backspace corrections, and saves via the File menu.
  3. **Stickies** — Jots pastel desktop reminders and nudges them into place.
  4. **Netscape Communicator 4.7** — Browses built-in 1999 web pages (Apple iMac DV, MacNN, Yahoo!, GeoCities MacZone '99) with a pulsing `'N'` throbber.
  5. **QuickTime Player 4** — Plays a canvas desktop movie complete with 3-2-1 film leader, color bars, and an animated Bondi iMac scene.
  6. **iTunes** — Plays a studio MP3 playlist with a live 16-band equalizer, track switching, and occasional Control Strip volume nudges.
  7. **About This Computer** — Opens from the Apple menu to display Mac OS 9.2.2 and animated memory allocation bars.
  8. **Scrapbook** — Flips through saved 1999 clippings, swatches, and an After Dark toaster clipping.
  9. **Disk First Aid** — Navigates into `Macintosh HD → Utilities`, launches Disk First Aid, and verifies the catalog B-tree and volume bitmap.
  10. **Finder Get Info** — Opens `⌘I` on `Read Me First`, adds a comment, and toggles the Locked checkbox.
  11. **Sherlock 2** — Switches brushed-silver search channels, runs queries, and inspects relevance-ranked results.
  12. **AOL Instant Messenger 4.0** — Opens the Buddy List and exchanges live IMs with `BondiBlue99`.
  13. **AppleWorks Paint** — Draws retro illustrations (Bondi iMac G3 or rainbow sunset) live stroke-by-stroke.
  14. **Calculator** — Clicks dark-bezel keys visibly to compute classic hardware upgrade totals.
  15. **Zip 100 Backup** — Drags `Website_Final_v2` onto `Backup Zip 100` with an animated candy-stripe copy progress dialog.
  16. **Outlook Express 5** — Reads dynamically dated Inbox messages.
  17. **Appearance Manager & Control Strip** — Rotates OS 9 desktop patterns and highlight colors live, then checks Monitor Resolution in the Control Strip.
  18. **Control Strip Fiddle** — Pulls open the ribbed Platinum Control Strip tab, slides the classic vertical Sound Volume popup, and toggles modules (Monitor Bit Depth, AppleTalk, File Sharing, CD Strip, Location Manager, Energy Saver), naturally leaving it open or tucking it back away.
  19. **Idle Glance** — Natural quiet moments checking the clock, desktop icons, Stickies, and casually sliding the Control Strip open or shut between tasks.
- **Classic Special Moments** (`✦` HUD menu):
  - **Flying Toasters Cameo** (After Dark starfield, flapping chrome toasters, and buttered toast).
  - **System Bomb & Reboot** (`error type 11` followed by a full Happy Mac & Extensions March restart).
  - **Switch OS 9 Theme** via Appearance Manager.
  - **Use Control Strip** to pull open and interact with the bottom-left Control Strip on demand.

#### Windows Upgrade Path (`1985–2001 · DOS → XP`)
A continuous 16-year PC evolution screensaver that starts on an IBM PC/AT 286 running **MS-DOS 3.1** and upgrades the same machine — carrying the same user journal file (`NOTES.TXT` → `My Journal.rtf` → `My Journal.txt`) — all the way through **Windows XP Luna**:

1. **1985 · MS-DOS 3.1** (`286 · 640 KB`) — Creates `NOTES.TXT` via `COPY CON` and runs `A:\SETUP` off 5.25" floppies.
2. **1985 · Windows 1.01** (`EGA · 640 KB`) — Non-overlapping tiled EGA panes (**MS-DOS Executive**, live analog **Clock**, **Notepad**), then launches Windows 3.1 Express Upgrade.
3. **1992 · Windows 3.1** (`386DX-40 · 4 MB`) — Teal desktop, **Program Manager**, **Write**, TADA startup chord, then **Windows 95 Setup Wizard**.
4. **1995 · Windows 95** (`Pentium 100 · 16 MB`) — Cloudy splash + ambient startup chord, Start Menu, **WordPad**, and the iconic **Windows 98 CD-ROM AutoPlay** upgrade dialog.
5. **1999 · Windows 98 SE** (`Pentium II 350 · 64 MB`) — Gradient title bars, Quick Launch, **Internet Explorer 5**, **Notepad**, and **Windows XP Pro CD-ROM AutoPlay** into **Windows XP Setup** billboards & the black 3-block boot screen.
6. **2001 · Windows XP Luna** (`Pentium 4 · 256 MB`) — **Bliss** hills wallpaper, glossy green `start` button, Luna Start Menu, classic yellow tour **Balloon Notifications**, **My Computer**, and the full 16-year journal before looping back to 1985.
- **Era Jump Triggers** (`✦` HUD menu): Jump straight to any of the 6 eras (`1985 · MS-DOS 3.1`, `1985 · Windows 1.01`, `1992 · Windows 3.1`, `1995 · Windows 95`, `1999 · Windows 98 SE`, or `2001 · Windows XP Luna`).

#### Apple II+ / //e (`1979 · 8-bit`)
A Monitor II P31 green-phosphor & NTSC color composite CRT framed by subtle scanlines and a bottom-right **Disk II (`S6,D1`)** red `IN USE` LED, moving across DOS 3.3, Applesoft BASIC, ProDOS 8, and classic Apple II software.

- **10 Autonomous Vignettes**:
  1. **Cold Boot & DOS 3.3 `CATALOG`** — Powers on with the iconic 1 kHz speaker beep, Disk II track-0 recalibrate clack, DOS 3.3 System Master banner, `]CATALOG`, `?SYNTAX ERROR`, and `FRE(0)` memory check.
  2. **Lo-Res (`GR`) 16-Color Kaleidoscope** — Types an Applesoft `GR` program and renders an 8-way mirrored 40×48 Lo-Res kaleidoscope with the classic 4-line split text window.
  3. **VisiCalc (1979)** — Runs Personal Software’s killer spreadsheet with inverted formula/status bar, entering `@SUM(D3...D6)` and performing live "what-if" recalculations.
  4. **Hi-Res (`HGR` 280×192) Vector Demo** — Switches to NTSC color composite to plot a multi-color rose curve and paint the iconic six-stripe Apple rainbow mark.
  5. **The Oregon Trail (MECC)** — Rolls a pixel-art covered wagon and oxen across the prairie toward Independence Rock with live date/food/miles status updates and classic trail events.
  6. **AppleWorks 2.0 (ProDOS 80-Column)** — Opens the signature overlapping file-folder index cards and types a dynamically dated studio log before saving to `/WORK.DISK`.
  7. **The Print Shop (Brøderbund, 1984)** — Designs a starburst-bordered club sign and prints it progressively to an ImageWriter II dot-matrix preview.
  8. **System Monitor (`CALL -151`)** — Drops into Wozniak’s `*` monitor for ROM hex dumps (`F800.F82F`) and 6502 mini-disassembly (`F800L`), returning via `3D0G`.
  9. **1-Bit Speaker Music (`$C030`)** — Plays an opt-in 1-bit speaker arpeggio with a live square-wave oscilloscope and 16-band pitch visualizer.
  10. **ProDOS 8 & CRT Phosphor Cycle** — Cycles Monitor II Green P31, Amber P3, and Color Composite while displaying a dynamically dated ProDOS catalog.
- **Classic Special Moments** (`✦` HUD menu): **Cold Boot & Disk II Catalog**, **VisiCalc (1979) Spreadsheet**, **The Oregon Trail (MECC)**, **Hi-Res Vector & Apple Logo**, and **CALL -151 (6502 Monitor)**.

#### CP/M-80 (`1979 · CP/M`)
A green phosphor terminal at the CP/M-80 2.2 `A>` prompt. The sign-on is the sample BIOS line `64K CP/M VERS 2.2`. Directory listings are four across, in directory order, with the drive letter once per line and no dates. A drive lamp sits beside the tube and lights while a command reads the disk. The phosphor flickers, typing hesitates, and a long command sometimes gets one wrong key and a backspace.

- **Vignettes**: Cold boot, `DIR`, `TYPE NOTES.TXT`, `PIP` copying `NOTES.TXT` to `NOTES.BAK` on the same drive, `STAT` for free space and the notes file, and a short original MBASIC program (`LIST`, `RUN`, `SYSTEM`). Then `DIRR?` (unknown command), `ED` appending a timestamped line to `NOTES.TXT`, a short `DDT` dump of that notes buffer, and `ERA NOTES.BAK` once the backup exists. `TYPE` and `STAT` show the notes file as it grows. MBASIC is on this working disk; it was not part of the Digital Research 2.2 master.
- **Specials** (`✦` HUD menu): Cold boot, DIR, PIP, MBASIC, and ED notes.

#### Commodore 64 (`1982 · 8-bit`)
A dual-mode Commodore 64 framed by its authentic VIC-II 16-color border, subtle scanline sheen, and a bottom-right **1541 Drive 8** red activity LED — moving organically between **BASIC V2** and **GEOS 2.0 deskTop**.

- **10 Autonomous Vignettes**:
  1. **Power-On & 1541 Directory** — Cold boots to `**** COMMODORE 64 BASIC V2 ****` (`38911 BASIC BYTES FREE`), runs `LOAD "$",8` with authentic Kernal border strobing, `LIST`s `WORK DISK 86`, and hits `?SYNTAX ERROR` (`PRONT "HI"`) and `?FILE NOT FOUND ERROR` (`LOAD "NOPE",8`).
  2. **10 PRINT Labyrinth** — Types `10 PRINT CHR$(205.5+RND(1)); : GOTO 10` and renders a live scrolling diagonal PETSCII maze before `BREAK IN 10`.
  3. **GEOS 2.0 Boot** — Runs `LOAD "GEOS",8,1` from Drive 8 through the Berkeley Softworks boot splash into **deskTop 2.0**.
  4. **geoWrite 2.1** — Opens `geoWrite` from the deskTop disk pad and types a dynamically dated 8-bit journal entry before saving to Drive A:.
  5. **geoPaint** — Draws the iconic Commodore `C=` logo live stroke-by-stroke using authentic VIC-II swatches.
  6. **GEOS Desk Accessories** — Launches **Calculator** (`64 * 1024 = 65536`) and **Note Pad** from the `geos` menu.
  7. **deskTop Disk Management & Preference Mgr** — Drags `SCRATCH.TMP` to Trash, flips the iconic dog-eared page corner (`Page 1 ↔ Page 2`), and cycles display palettes (`Classic B&W`, `C64 Blue`, `Green CRT`, `Amber CRT`).
  8. **VIC-II Sprite Balloons** — Drops to BASIC V2 (`special → BASIC`) and runs `BALLOON` (`SYS 49152`), floating multicolor Commodore hot-air sprites across the screen.
  9. **MOS 6581 SID Demo Scene** — Runs `SIDTUNE` with scrolling VIC-II raster border bars, 3-voice SID VU meters, sine-wave demo scroller, and opt-in synthesized 3-voice chiptune arpeggio.
  10. **VIC-II POKE Playground** — Runs `POKE 53280` / `POKE 53281` color register experiments and cycles all 16 border colors before returning to classic C64 blue.
- **Classic Special Moments** (`✦` HUD menu): **Boot GEOS 2.0 deskTop**, **Run 10 PRINT Maze**, **6581 SID Demo Scene**, and **C64 Power-On Reset**.

#### Apple Lisa OS 7/7 (`1983 · Lisa OS`)
Crisp 1-bit monochrome **Lisa Office System 7/7** on a stippled gray desktop with document-centric menus (`File/Print`, `Edit`, `Housekeeping`, `Disk`), **Stationery Pads**, split-pane scrollbars, hourglass wait cursor, **ProFile 5 MB** hard disk LED, and the **Wastebasket**.

- **Boot & 8 Autonomous Vignettes**:
  1. **ROM Self-Test & ProFile 5 MB Boot** — Runs the MC68000 / I/O / 1 MB RAM / ProFile / Diskette self-test row with two-tone beep into *"Starting From ProFile…"*.
  2. **LisaWrite** — Tears off a fresh sheet from `LisaWrite Paper` (`File/Print → Tear Off Stationery`), drafts a dynamically dated Cupertino memo with `Type Style → Bold`, and puts it away (`Save & Put Away`).
  3. **LisaDraw** — Tears off `LisaDraw Paper` and uses the left tool palette and 1-bit fill patterns to sketch a vector diagram of the Apple Lisa and ProFile 5 MB drive with selection handles.
  4. **LisaCalc → LisaGraph (Integrated 7/7 Suite)** — Updates Q3 numbers in **LisaCalc**, copies via Clipboard, opens **LisaGraph** side-by-side, and cycles 1-bit hatched Bar, Line, and Pie charts.
  5. **LisaProject** — Builds a 1-bit PERT Critical Path milestone network with double-bordered critical tasks and adds a live task box.
  6. **ProFile 5 MB & Wastebasket** — Browses the ProFile list view, drags `Scratch_Draft.lw` into the Wastebasket, and runs `Housekeeping → Empty Wastebasket`.
  7. **Calculator & Preferences** — Computes `9995 - 2495 = 7500` on the paper-tape Calculator and tests the CRT Contrast/Dimming slider in Preferences.
  8. **LisaTerminal** — Connects at 1200 baud VT100 to a Cupertino 4.2 BSD VAX host.
  9. **LisaGuide** — Walks through Apple’s pioneering interactive 1983 mouse and desktop tutorial.
- **Classic Special Moments** (`✦` HUD menu): **Lisa Self-Test & ProFile Boot**, **LisaDraw Vector Studio**, **LisaCalc → LisaGraph Suite**, **LisaProject Critical Path**, and **LisaGuide Mouse Tutorial**.

#### Amiga Workbench (`1988 · Amiga`)
A bright blue Workbench 1.3 desktop with authentic 4-color Amiga styling, Topaz-inspired typography, pull-down screen menus (`Workbench`, `Disk`, `Special`), disk drawers, and opt-in synthesized UI clicks, floppy insertion noise, Guru alert, and Boing Ball bounce tones.

- **Startup Sequence**: Cold boots at the Kickstart 1.3 *"Insert disk"* prompt with an animated floppy insertion into Workbench 1.3.
- **7 Autonomous Vignettes**:
  1. **Workbench Drawers & Version** — Opens `Workbench1.3`, checks `Special → Version`, opens `Utilities`, and launches `Clock`.
  2. **AmigaShell** — Navigates `Workbench1.3 → System → Shell` and runs `version` (`Kickstart 34.5 / Workbench 34.28`), `dir`, and `avail` (`chip` & `fast` memory).
  3. **Notepad** — Opens `Utilities → Notepad` and types a Topaz 1988 note.
  4. **Deluxe Paint II** — Launches `DeluxePaint`, runs `Picture → Clear`, selects a brush tool, and paints live on canvas.
  5. **Workbench Version** — Opens and dismisses the Kickstart/Workbench Version requester from `Special → Version`.
  6. **Guru Meditation** — Flashes the iconic red-bordered black **Guru Meditation** software failure banner before returning to Workbench.
  7. **Clock** — Opens the Workbench analog Clock on the desktop.
- **Classic Special Moments** (`✦` HUD menu): **Boing Ball** (bouncing red-and-white checkered Boing Ball cameo with bounce audio), **Deluxe Paint**, **AmigaShell**, and **Kickstart Disk** (replays the Kickstart 1.3 boot sequence).

#### Windows 3.1 (`1992 · Windows 3.1`)
A classic teal desktop anchored by **Program Manager** with navy active title bars, beveled 3D controls, `Main`, `Accessories`, and `Games` MDI group windows, and opt-in synthesized TADA fanfare, error dings, and UI clicks.

- **Startup Sequence**: Boots with the Windows 3.1 splash screen and synthesized TADA chord into Program Manager.
- **12 Autonomous Vignettes**:
  1. **Program Manager Groups** — Opens `Accessories` and `Games` alongside `Main` and arranges them via `Window → Tile`.
  2. **Notepad (`NOTES.TXT`)** — Opens `NOTES.TXT`, appends a note, and saves via `File → Save`.
  3. **File Manager (`C:\WINDOWS`)** — Browses the directory tree (`C:\WINDOWS\SYSTEM` ↔ `C:\WINDOWS`) and selects `NOTES.TXT`.
  4. **Write (TrueType)** — Signs a TrueType letter and opens `Character → Fonts…`.
  5. **Solitaire** — Drags the Ace of Hearts onto the foundation pile with a celebratory TADA chime.
  6. **Paintbrush** — Selects the brush tool and navy swatch to draw a house live on canvas.
  7. **Minesweeper** — Opens a Beginner board and reveals cells while the timer ticks.
  8. **Calculator** — Clicks buttons visibly to calculate `1024 × 4 = 4096`.
  9. **MS-DOS Prompt** — Runs `ver` (`MS-DOS Version 5.00`) and `dir *.ini` inside a DOS box.
  10. **Control Panel → Desktop** — Opens Desktop settings to inspect Screen Saver options.
  11. **Clock & Calendar** — Launches Clock alongside the April 1992 Calendar.
  12. **About Program Manager** — Opens `Help → About Program Manager…`.
- **Classic Special Moments** (`✦` HUD menu): **Play Solitaire**, **Starfield Simulation** (fullscreen flying starfield screensaver), **General Protection Fault** (classic GPF dialog in Notepad), and **Restart Windows** (`File → Exit Windows…` to DOS, types `win`, and reboots).

#### NeXTSTEP 3.3 (`1994 · NeXTSTEP`)
A NeXTstation Turbo Color matte `#555555` Workspace with the iconic floating top-left vertical Main Menu & cascading right submenus, pitch-black active / medium-gray inactive title bars, authentic **left-side vertical scrollbars**, beveled 64×64 right-edge Dock (with live analog clock & calendar tile), and bottom-left 64×64 Miniwindow tray.

- **Boot & 8 Autonomous Vignettes**:
  1. **NeXT Mach 3.3 Kernel Boot & Login Panel** — Cold boots a Motorola `MC68040` NeXTstation (`NeXT ROM Monitor`, NeXT Mach 3.3, Display PostScript) into the classic beveled Login Panel (`nextuser`).
  2. **Workspace Manager File Viewer** — Browses the iconic **Miller Columns** browser (`/ → LocalApps → WorldWideWeb.app`), drags `scratch.ps` into the swirling black-hole **Recycler** tile on the Dock, and empties it via `Tools → Empty Recycler`.
  3. **WorldWideWeb.app (CERN)** — Launches Tim Berners-Lee’s original NeXT hypertext browser/editor (`The World Wide Web` → `Technical Details` → `HyperText`), opening cascading linked hypertext windows.
  4. **Terminal (`csh` / Mach)** — Runs `hostinfo`, `ls /NextApps`, and compiles `HelloController.m` with `cc -ObjC -framework AppKit`.
  5. **Edit.app (Objective-C)** — Writes an AppKit `HelloController.m` implementation with authentic Objective-C bracket messaging (`[super init]`, `NXRunAlertPanel`), saves via `Document → Save`, and miniaturizes into a 64×64 bottom-left miniwindow.
  6. **Interface Builder (`.nib`)** — Opens `MyWindow.nib` alongside the Palettes inspector, drags an `NXButton` and `NXSlider` onto the live window canvas, and launches `Document → Test Interface`.
  7. **NeXTmail** — Reads dynamically dated 1994 messages (Tim Berners-Lee at CERN, Pixar RenderMan Studio, NeXTedge Dispatch) with live chime synthesis.
  8. **Display PostScript Vector Demo** — Renders a live rotating vector square geometry animation on an embedded Display PostScript canvas.
  9. **Preferences** — Tests the iconic NeXT `Bonk` alert sound and cycles the desktop grayscale shade (`#555555` / `#494949` / `#616161`).
- **Classic Special Moments** (`✦` HUD menu): **Mach Kernel Boot & Login**, **WorldWideWeb.app (CERN)**, **Interface Builder (.nib)**, and **Display PostScript Vector**.

#### MS-DOS 6.22 (`1994 · MS-DOS`)
A 486DX2-66 VGA text-mode & graphics PC with authentic IBM 16-color TUI apps, subtle CRT scanlines, bottom-right `TURBO 66` + amber `HDD` LEDs, and opt-in Model M keyboard clicks, PC speaker POST beep, and 14.4K dial-up tones.

- **9 Autonomous Vignettes**:
  1. **486DX2 BIOS POST & Cold Boot** — Award Modular BIOS v4.50G counting RAM to `16384K OK`, single PC speaker beep, IDE drive detection, `HIMEM`/`EMM386`/`SET BLASTER`, `Starting MS-DOS...`.
  2. **DIR, VER & MEM /C** — Lists `C:\` with live dynamic date/time stamps, runs `VER`, hits `Bad command or file name` (`DIRR`) and `Not ready reading drive A / Abort, Retry, Fail?A` (`DIR A:`), and inspects Conventional (`612K free`) & Upper Memory modules.
  3. **MS-DOS 6.22 DEFRAG** — Hypnotic 440-cluster animated hard disk map reading fragmented blocks (`r`), writing optimized cyan clusters (`W`), and finishing with a completion dialog.
  4. **MS-DOS Editor (`EDIT`)** — Deep-blue TUI editor typing dated system logs or `AUTOEXEC.BAT` notes with live `Line:Col` tracking and `File → Save → Exit`.
  5. **Norton Commander 4.0 (`NC`)** — Classic dual-pane blue & yellow file manager browsing `C:\GAMES` and copying `SAVES.ZIP` to `A:\BACKUP`.
  6. **Microsoft ScanDisk (`SCANDISK C:`)** — Checks Media Descriptor, FAT, Directory Structure, File System, Free Space, and quick Surface Scan.
  7. **QBasic 1.1 → `GORILLA.BAS`** — Opens `GORILLA.BAS` in QBasic and launches the classic `SCREEN 9` EGA skyline banana-throwing duel with live angle/velocity arcs.
  8. **Telix 14.4K ANSI BBS** — Dials `ATDT 555-0194`, connects at `14400/ARQ/V32BIS`, displays a vibrant CP437 ANSI BBS banner with today's date, and hangs up (`NO CARRIER`).
  9. **DOOM v1.666 Startup Tease** — Runs `DOOM` from `C:\GAMES\DOOM` through the classic red-and-grey startup banner (`doom1.wad`, Sound Blaster 16) and a brief Mode 13h 3D corridor preview.
- **Classic Special Moments** (`✦` HUD menu): **Run MS-DOS Defrag**, **Dial 14.4K ANSI BBS**, **QBasic GORILLA.BAS**, and **486DX2 BIOS Cold Boot**.

#### Macintosh System 7.5 (`1994 · Classic`)
A crisp 1-bit & 256-color Classic Macintosh desktop with rounded CRT corners, white Chicago menu bar with authentic blink-on-select dropdowns, Rainbow Apple, **Guide menu (`?`) & Balloon Help**, pinstripe active title bars, and live dithered 8×8 Desktop Patterns.

- **Boot & 9 Autonomous Vignettes**:
  1. **Welcome to Macintosh Boot** — Happy Mac into the iconic System 7.5 *"Welcome to Macintosh"* splash box (introducing the two-tone blue Mac OS face), marching 1994 System Extensions, and Quadra/PowerMac startup chime.
  2. **HyperCard 2.2** — Uses the classic HyperCard pointing hand cursor to browse the 1-bit Home & *Macintosh Field Guide* stacks with dissolve card transitions, peeks at a real HyperTalk script (`on mouseUp / play "Sosumi"`), and triggers Jim Reekes’ iconic *Sosumi* alert.
  3. **Finder 7.5 & Guide Menu (`?`)** — Turns on *Show Balloons* from the Guide menu so classic System 7 speech balloons float over `Macintosh HD` and `Trash`, expands `System Folder` via List View disclosure triangles, drags `Old_Cache_94` into the bulging Trash, and runs `Special → Empty Trash…`.
  4. **Note Pad 7.5** — Flips yellow ruled pages by clicking the curled bottom-left corner (`Page 1 → 2 → 3`) and jots a dynamically dated note.
  5. **Stickies** — Opens a yellow System 7.5 Stickies note on the desktop.
  6. **SimpleText & PlainTalk Speech** — Types a dated 1994 studio letter and runs `Sound → Speak All` (`Voice: Fred`).
  7. **Desktop Patterns Control Panel** — Cycles authentic dithered 8×8 System 7.5 patterns (`Classic 50% Gray`, `Periwinkle Weave`, `Teal Plaid 7.5`, `Blue Bricks`, `Warm Linen`) and applies them live.
  8. **Puzzle DA & About This Macintosh** — Slides tiles in the classic Apple Menu 15-tile rainbow Puzzle and checks 16 MB RAM bars in `About This Macintosh` (`System Software 7.5`).
  9. **After Dark 3.0: Starry Night** — Fullscreen 1994 midnight skyscraper skyline with twinkling stars, crescent moon, and animated glowing office windows.
- **Classic Special Moments** (`✦` HUD menu): **Welcome to Macintosh Boot**, **HyperCard 2.2 Stack**, **After Dark: Starry Night**, and **Desktop Patterns Panel**.

#### Windows 95 / 98 (`1995 · Windows 95`)
A teal desktop featuring the Start button, cascading Start Menu, live window-tracking taskbar, desktop icons (`My Computer`, `Recycle Bin`), and opt-in synthesized Windows 95 & 98 startup swells — transitioning live into **Windows 98 SE** in 1999 with gradient title bars.

- **Startup Sequence**: Boots through the Windows 95 (or Windows 98 SE) splash screen with a synthesized startup swell.
- **12 Autonomous Vignettes**:
  1. **Welcome to Windows 95** — Displays the classic *"Did you know…"* tips dialog on startup.
  2. **Windows Explorer** — Launches Explorer from `Start → Programs` and browses `Windows`.
  3. **My Computer** — Opens `My Computer → (C:)` and inspects `NOTES.TXT`.
  4. **Notepad (`NOTES.TXT`)** — Opens from `Programs → Accessories`, appends a note, and saves via `File → Save`.
  5. **WordPad** — Types and signs an August 1995 rich-text letter.
  6. **Solitaire** — Launches from the Start Menu and drags the Ace of Hearts to the foundation slot.
  7. **Paint** — Selects the brush and navy swatch to draw a flag live on canvas.
  8. **Minesweeper** — Opens a Beginner board and reveals cells.
  9. **Calculator** — Clicks buttons visibly to compute `1995 + 3 = 1998`.
  10. **MS-DOS Prompt** — Runs `ver` (`Windows 95. [Version 4.00.950]`).
  11. **Recycle Bin** — Opens the Recycle Bin and inspects `SETUP.EXE`.
  12. **Windows 98 SE (1999)** — Reboots into **Windows 98 SE** with gradient title bars, launches **Internet Explorer 5**, and appends a 1999 entry in Notepad.
- **Classic Special Moments** (`✦` HUD menu): **Flying Windows** (classic fullscreen flying Windows logos screensaver), **Play Solitaire**, **Windows 98 SE**, and **Shut Down** (`Start → Shut Down…` into *"It's now safe to turn off your computer"* and reboot).

#### OS/2 Warp 4 (`1996 · Warp 4`)
An IBM OS/2 Warp 4 ("Merlin") Workplace Shell desktop with the full-width top **WarpCenter** toolbar (OS/2 Warp menu, running Window List task pills, quick-launch Tray 1, live scrolling CPU bar graph, and real-time clock), classic 3D beveled Presentation Manager windows, right-click WPS object context menus, and the desktop **Shredder**.

- **Boot & 8 Autonomous Vignettes**:
  1. **OS/2 Warp 4 Boot Splash** — Blue/silver IBM OS/2 Warp 4 splash card with the iconic red/gold/blue swoop, HPFS/MMPM/2/VoiceType loading log, and opt-in startup chord.
  2. **OS/2 System, Shredder & Spiral Notebook Properties** — Opens `OS/2 System`, drags `SCRATCH.TMP` onto the desktop **Shredder** with confirmation dialog & paper-shredder audio, then right-clicks `Productivity` to open its spiral-bound **WPS Notebook Properties** (`View` → `Background`).
  3. **OS/2 Window (`[C:\]`) & REXX** — Launches `CMD.EXE` from WarpCenter, runs `VER /R`, `DIR C:\PROJECTS` with live dates, and executes `REXX SYSINFO.CMD`.
  4. **IBM VoiceType Dictation** — Activates Warp 4’s signature 1996 speech recognition bar with live animated VU bars, dictating spoken memos straight into the System Editor.
  5. **IBM WebExplorer 1.1h** — Spins the classic IBM globe while browsing 1996 pages (`IBM OS/2 Warp 4 Home Page` → `Hobbes OS/2 Archive at NMSU`).
  6. **OS/2 Pulse & Preemptive Multitasking** — Runs the scrolling green-on-black Pulse CPU oscilloscope alongside an 8-thread HPFS/DIVE test to visibly spike both Pulse and the WarpCenter CPU meter.
  7. **WPS Scheme Palette Drag-and-Drop** — Drags color/chrome schemes (`Warp 4 Default`, `Merlin Cobalt`, `Spring Meadow`, `Warm Sandstone`) directly out of the Scheme Palette onto the desktop to live-retheme the Workplace Shell.
  8. **OS/2 System Editor (`E.EXE`), `SYS3175` & Klondike Solitaire** — Types and saves a dated `WARP4.CMD` REXX utility, triggers and dismisses a classic `SYS3175` protection-exception dialog, and plays a quick animated hand of Warp 4’s built-in green-felt Klondike Solitaire.
- **Classic Special Moments** (`✦` HUD menu): **OS/2 Warp 4 Boot Splash**, **IBM VoiceType Dictation**, **WPS Scheme Palette Drag**, and **IBM WebExplorer (1996)**.

#### Haiku / BeOS (`2000 · BeOS`)
A BeOS Release 5 Personal Edition desktop with signature yellow window tabs, top-right **Deskbar** (Be menu, live **Pulse** CPU activity bars, real-time clock, live workspace switcher), **Tracker** file manager, and opt-in synthesized BeOS startup chord and UI tones.

- **Startup Sequence**: Classic BeOS boot icon row lighting up one by one into Tracker.
- **10 Autonomous Vignettes**:
  1. **Tracker (`/boot/home`)** — Opens the `BeOS` boot volume, navigates into `home`, selects `ReadMe.txt`, zooms the window, and nudges it across the desk.
  2. **StyledEdit** — Opens `ReadMe.txt` from Tracker, appends a note, and saves via `File → Save`.
  3. **Terminal** — Launches from `Be → Applications → Terminal` and runs `ls`, `uname -a` (`BeOS 5.0`), and `df` (`bfs`).
  4. **NetPositive** — Navigates to `welcome.html` with a spinning throbber, scrolls the local page, and follows a link to `notes.html`.
  5. **MediaPlayer** — Opens `sample.wav` from `/boot/home` and plays through an animated waveform scrubber.
  6. **About BeOS** — Opens `Be → About BeOS…` to inspect system details.
  7. **Backgrounds** — Opens `Preferences → Backgrounds`, switches the desk color to `Leaf`, and switches back to `Be` blue.
  8. **Find Query** — Searches for `Read` via `Be → Find…`, opens live results, and launches `ReadMe.txt` in StyledEdit.
  9. **Apps Folder** — Browses `/boot/apps` (`StyledEdit`, `Terminal`, `NetPositive`, `MediaPlayer`).
  10. **Idle Glance** — Checks the Deskbar clock, boot disk, Trash, and workspace buttons between tasks.
- **Classic Special Moments** (`✦` HUD menu): **About BeOS**, **Switch workspace** (switches to Desk 2, runs `uname -a` in Terminal, and returns to Desk 1), **Find on the disk**, and **Restart** (triggers the Restart alert and full boot icon sequence).

#### Windows XP Luna (`2001 · Bliss`)
An autonomous Windows XP Professional desktop set on layered **Bliss** rolling hills with the glossy Luna taskbar, green pill `start` button, two-column Start Menu, blinking twin-CRT network tray monitors, pale-yellow tray **Balloon Notifications**, and live **Default (blue) / Olive Green / Silver** Luna color schemes.

- **Boot, 8 Autonomous Vignettes & Easter Eggs**:
  1. **Windows XP Boot & Welcome** — Pitch-black boot screen with the scrolling 3-blue-blocks bar into the royal-blue *"welcome"* screen, lush XP Startup chord, and classic *"Take a tour of Windows XP"* tray balloon.
  2. **AIM 5 (Buddy List & IM)** — Opens the yellow Buddy List (`BlissHill`), watches `SkaterBoi02` sign on, flashes the orange taskbar tab, and exchanges live instant messages.
  3. **Winamp 2.91 Classic** — Gunmetal player + docked Playlist Editor playing through tracks with a live 16-band neon-green/red-peak spectrum visualizer canvas.
  4. **3D Pinball: Space Cadet** — Live HTML5 canvas physics pinball table with plunger launch, flashing cosmic bumpers, auto-firing flippers, and ticking LCD score.
  5. **MS Paint (XP)** — Uses the classic color palette and brush tools to sketch a sunny Bliss hill & red-roofed house (`bliss_2001.bmp`) live stroke-by-stroke.
  6. **My Computer & Recycle Bin** — Opens Explorer with XP’s blue left **Common Tasks** pane, drags `Old_Setup.tmp` to the Recycle Bin, empties it with crunch audio, and pops a tray balloon.
  7. **Display Properties (Luna Themes)** — Cycles live between **Default (blue)**, **Olive Green**, and **Silver** XP Luna visual styles.
  8. **Internet Explorer 6 & 3D Pipes** — Runs a 2002 Google search in IE6 and launches a fullscreen 3D-shaded **3D Pipes** screensaver cameo.
  9. **Classic XP Error Cascade** (`✦` special) — Triggers the iconic trailing cascade of Windows XP **`Send Error Report` / `Don't Send`** crash dialogs across Bliss.
- **Classic Special Moments** (`✦` HUD menu): **Windows XP Boot & Welcome**, **3D Pinball: Space Cadet**, **Winamp 2.91 Classic**, **AIM Buddy List & IM**, **3D Pipes Screensaver**, and **Classic XP Error Cascade**.

#### Solaris 9 (`2002 · CDE`)
Solaris 9’s Common Desktop Environment: a blue desk, Motif window frames (window menu, minimize, and maximize — Close is on the window menu), and a centered Front Panel that does not span the screen. The workspace switch shows One, Two, Three, and Four. The activity globe spins while an action starts.

- **Startup**: An original sun glyph and the words Solaris 9.
- **Vignettes**: File Manager at `/export/home/user`, Text Editor (Applications subpanel → Text Editor, saved as `notes.txt`), dtterm from the Workspace menu (`uname -sr` prints `SunOS 5.9`, then `pwd`, `ls`, and `date`), Calendar, and Style Manager. After most of these the cursor grabs the title bar and drags the window. One scene opens File Manager and Calendar and parks them by dragging. Later scenes switch to workspace Two and back, cancel Log out, and open Trash, Performance Meter, Mailer, and Help Viewer.
- **Specials**: Lock Display, Log out (Cancel, so the session stays), and Switch workspace.

#### GNOME 2.4 (`2003 · GNOME 2.4`)
The plain GNOME 2.4 desk: Metacity, the Simple theme, and the documented vertical gradient (RGB 57,55,75 to 66,82,143). Home, Start Here, and Trash sit on the desktop. The top menu panel has the foot, Applications, Actions, Home Folder, Terminal, the clock, volume, and the window list. The bottom edge has Show Desktop, the window list, and the workspace switcher.

- **Startup**: Foot mark, the word GNOME, and a row of progress icons into the desk.
- **Vignettes**: Nautilus (home, then Start Here → Preferences, including the multiroot tree), gedit, Epiphany 1.0 opening `welcome.html`, the terminal launcher (`pwd`, `ls`), gcalctool in Basic mode (left to right, so `2+3×4` is 20), Run Application, Search for Files, Show Desktop, and the clock calendar. After most of these the cursor grabs the title bar and drags the window aside. One scene opens gedit and the calculator and parks them by dragging.
- **Specials**: About GNOME (Version 2.4), Lock Screen, switch workspace, and Log Out.

#### KDE 3.1 (`2003 · KDE 3.1`)
KDE 3.1, released 28 January 2003, with Keramik window frames and the kicker along the bottom. The desk is blue, with Trash on it. The K menu opens Internet → Web Browser, Utilities → Text Editor and Calculator, Find Files, Run Command, Lock Session, and Logout.

- **Startup**: K mark and “Starting KDE 3.1”.
- **Vignettes**: Konqueror at `file:/home/user` with a second tab on `welcome.html`, KWrite, Konsole via Run Command (`pwd`, `ls`), KCalc, Find Files, and Trash. After most of these the cursor grabs the title bar and drags the window aside. One scene opens KWrite and KCalc and parks them by dragging.
- **Specials**: About KDE (Version 3.1.0), Lock Session, switch desktop, and Logout.

#### Compilers (`C · Rust · Zig · Swift`)
A full-bleed `src $ ` build terminal with an amber **`BUILD`** lamp and opt-in key click, build tick, and completion blip audio. No distribution or compiler version is named. Seven compiled languages take turns writing short original programs via heredocs, streaming a verbose compile log, and running the resulting binaries. Typing hesitates and sometimes corrects one wrong key. When the scrollback gets long, the next scene starts with `clear`. A later pass of each language writes a different program. The later C program stops on an unused-variable warning, deletes that line, and compiles again. `ls -l` then lists the binaries built so far.

- **8 Autonomous Vignettes**:
  1. **C** — Writes `squares.c`, compiles with `cc -v -Q` (search path, the source, `Assembling functions: main`, assemble, link), and runs `./squares`.
  2. **C++** — Writes `lengths.cpp`, compiles with `c++ -v -Q` the same way, and runs `./lengths`.
  3. **Rust** — Writes `marks.rs`, type-checks verbosely, hits `rustc` `error[E0308]: mismatched types` (`expected i32, found &str`), writes the fix, recompiles verbosely, and runs `./marks`.
  4. **Zig** — Writes `ticks.zig`, compiles with `zig build-exe --verbose-cc --verbose-link` (AstGen, Sema, CodeGen, link), and runs `./ticks`.
  5. **Swift** — Writes `labels.swift`, compiles with `swiftc -v` (frontend, type-check, SIL, link), and runs `./labels`.
  6. **Go** — Writes `table.go`, compiles with `go build -x` (importcfg, compile, link), and runs `./table`.
  7. **Haskell** — Writes `series.hs`, compiles with `ghc -v` (parser through CodeGen, `[1 of 1] Compiling Main`, `Linking series ...`), and runs `./series`.
  8. **Workspace** — `ls -l` shows the binaries built during this session, then `date`.
- **Language Triggers** (`✦` HUD menu): Jump directly to **C**, **C++**, **Rust**, **Zig**, **Swift**, **Go**, or **Haskell**. The second visit to a language writes a different program (`countdown.c`, `widths.cpp`, `tally.rs`, `steps.zig`, `tags.swift`, `keys.go`, `range.hs`).

---

## Controls & Shortcuts

### Lobby (`index.html`)
- `Enter` — Launch the featured screensaver (`Classic Mac OS 9.2`).
- **Play all** — Open the player and rotate through every available screensaver.

### Player (`watch.html`)
Move the mouse near the bottom edge of the screen to reveal the floating HUD, or use keyboard shortcuts:

| Key | Action |
| --- | --- |
| `F` | Toggle fullscreen |
| `Space` | Pause / resume choreography |
| `N` | Skip to next activity |
| `C` | Cycle through every available screensaver. Each one stays up for 90 seconds, and pause holds the clock. Choosing a screensaver in the switcher stops the cycle. |
| `[` / `]` | Decrease / increase speed (`0.75×`, `1×`, `1.5×`, `2×`) |
| `M` | Toggle synthesized audio (muted by default) |
| `G` | Open / close screensaver switcher |
| `H` | Show / hide HUD |
| `Esc` | Close switcher, special menu, or HUD |

### URL Parameters
- `watch.html?saver=mac-os-9` — Launch a specific screensaver directly (`index.html?saver=...` redirects automatically).
- `watch.html?speed=1.5` — Start at a custom speed (`0.75`, `1`, `1.5`, `2`).
- `watch.html?gallery=1` — Open directly to the switcher modal.
- `watch.html?cycle=1` — Rotate through every available screensaver, 90 seconds each. Add `saver=` to choose where the rotation starts.

---

## Project Structure

```text
/mnt/storage/www/screens/
├── .htaccess                     # Apache no-cache headers for HTML/CSS/ES modules
├── index.html                    # Front-page lobby & animated CRT diorama
├── watch.html                    # Fullscreen screensaver player host
├── README.md                     # Project documentation
├── css/
│   ├── landing.css               # Lobby layout, CRT diorama, and OS card thumbnails
│   └── shell.css                 # Fullscreen stage, hidden hover HUD, switcher modal
    ├── js/
    │   ├── registry.js               # Screensaver catalog & dynamic module loaders
    │   ├── human.js                  # Key cadence, one corrected typo, pointer settle
    │   ├── landing.js                # Lobby clock, diorama scaling, shelf rendering
    │   └── shell.js                  # Player lifecycle, HUD, shortcuts, fullscreen API
    ├── tests/
    │   └── human.test.mjs            # Node test for typing, pointer settle, CP/M DIR rows
└── savers/
    ├── mac-os-9/
    │   ├── index.js              # Mac OS 9 screensaver entry & vignette scheduler
    │   ├── engine.js             # Ghost cursor, Bezier motion, window & menu manager
    │   ├── apps.js               # Classic Platinum window & application builders
    │   ├── vignettes.js          # 19 choreographed scenes + Boot, Bomb & After Dark
    │   ├── mac-os-9.css          # Authentic Platinum UI & app styles
    │   ├── icons.js              # Inline SVG icons, cursors, Happy Mac, Flying Toasters
    │   ├── wallpapers.js         # 6 SVG-tiled OS 9 desktop patterns & highlight themes
    │   └── sounds.js             # Opt-in Web Audio Platinum sound synthesizer
    ├── windows-evolution/
    │   ├── index.js              # 1985–2001 Windows Upgrade Path timeline scheduler
    │   ├── engine.js             # Multi-era cursor, Setup wizards & stage manager
    │   ├── eras.js               # MS-DOS 3.1 → Win 1.01 → 3.1 → 95 → 98 SE → XP Luna
    │   ├── windows-evolution.css # Authentic era chrome, setups, boot screens & Bliss
    │   └── sounds.js             # Era startup chimes (PC beep, TADA, 95, 98, XP)
    ├── apple-ii/
    │   ├── index.js              # Apple II+ / //e entry & vignette scheduler
    │   ├── engine.js             # 40/80-col CRT, Lo-Res/Hi-Res split canvas & Disk II LED
    │   ├── vignettes.js          # 10 DOS 3.3/VisiCalc/Oregon Trail/AppleWorks/Monitor scenes
    │   ├── apple-ii.css          # P31 green, P3 amber & NTSC composite CRT styles
    │   └── sounds.js             # Opt-in 1-bit speaker beep, Disk II stepper & ImageWriter II
    ├── cpm/
    │   ├── index.js              # CP/M-80 2.2 entry & vignette scheduler
    │   ├── engine.js             # 80×24 green phosphor terminal, disk model & drive lamp
    │   ├── vignettes.js          # Cold boot, DIR, TYPE, PIP, STAT, MBASIC
    │   ├── cpm.css               # Terminal bezel, scanlines & drive lamp
    │   └── sounds.js             # Opt-in key click, terminal bell & drive tick
    ├── apple-lisa/
    │   ├── index.js              # Apple Lisa OS 7/7 entry & vignette scheduler
    │   ├── engine.js             # Stationery tear-off, split-pane windows & hourglass cursor
    │   ├── vignettes.js          # Self-Test + LisaWrite, LisaDraw, LisaCalc, LisaGraph, LisaProject
    │   ├── apple-lisa.css        # Authentic 1-bit monochrome Lisa desktop & chrome styles
    │   ├── icons.js              # 1-bit ProFile, Stationery Pads, Wastebasket & cursors
    │   └── sounds.js             # Opt-in self-test beep, ProFile seek & paper tear synthesis
    ├── commodore-64/
    │   ├── index.js              # Commodore 64 screensaver entry & vignette scheduler
    │   ├── engine.js             # Dual-mode BASIC V2 + GEOS 2.0 deskTop engine
    │   ├── vignettes.js          # 10 BASIC/GEOS/VIC-II/SID scenes + special triggers
    │   ├── commodore-64.css      # Authentic VIC-II palette, 1541 LED & GEOS 2.0 styles
    │   └── sounds.js             # Opt-in Web Audio SID 6581, key clack & 1541 rattle
    ├── amiga/
    │   ├── index.js              # Amiga Workbench 1.3 entry & vignette scheduler
    │   ├── engine.js             # Blue Workbench desktop, screen menus, Kickstart & Boing Ball
    │   ├── apps.js               # Drawers, AmigaShell, Notepad, Deluxe Paint II & Clock
    │   ├── vignettes.js          # Kickstart boot + 6 Workbench scenes & Boing Ball cameo
    │   ├── wb.css                # Authentic 4-color Workbench 1.3 styles (injected on mount)
    │   ├── icons.js              # Pixel-art Workbench icons, drawers, floppy & cursors
    │   └── sounds.js             # Opt-in UI clicks, floppy insert & Boing Ball bounce tones
    ├── windows-3.1/
    │   ├── index.js              # Windows 3.1 screensaver entry & vignette scheduler
    │   ├── engine.js             # Teal desktop, Program Manager MDI host, Starfield & DOS exit
    │   ├── apps.js               # File Manager, Write, Paintbrush, Solitaire, Minesweeper & more
    │   ├── vignettes.js          # Boot + 12 Win 3.1 scenes, Starfield, GPF & DOS restart
    │   ├── win31.css             # Authentic Windows 3.1 navy-bar & 3D chrome (injected on mount)
    │   ├── icons.js              # Classic Windows 3.1 program group & app icons
    │   └── sounds.js             # Opt-in TADA chord, error ding & UI tones
    ├── nextstep/
    │   ├── index.js              # NeXTSTEP 3.3 screensaver entry & vignette scheduler
    │   ├── engine.js             # Floating left menu, right Dock, left scrollbars & windows
    │   ├── vignettes.js          # Mach boot + File Viewer, WWW.app, IB, Terminal, Edit, DPS
    │   ├── nextstep.css          # Matte gray Workspace, black title bars & beveled Dock CSS
    │   ├── icons.js              # Paul Rand NeXT Cube, Recycler, app icons & MO wait disc
    │   └── sounds.js             # Opt-in DSP56001 bonk, whoosh, chime & key synthesis
    ├── ms-dos/
    │   ├── index.js              # MS-DOS 6.22 screensaver entry & vignette scheduler
    │   ├── engine.js             # VGA text terminal, TUI host, Mode 13h canvas & HDD LED
    │   ├── vignettes.js          # 9 BIOS/DOS/DEFRAG/EDIT/NC/QBasic/BBS/DOOM scenes
    │   ├── ms-dos.css            # Authentic IBM VGA 16-color palette & DOS TUI styles
    │   └── sounds.js             # Opt-in Model M clicks, PC speaker beep & modem tones
    ├── mac-system-7/
    │   ├── index.js              # Macintosh System 7.5 screensaver entry & vignette scheduler
    │   ├── engine.js             # Rounded-corner desk, Balloon Help, blink menus & pattern switcher
    │   ├── vignettes.js          # Boot + HyperCard, Finder, Note Pad, SimpleText, Puzzle, Starry Night
    │   ├── mac-system-7.css      # Crisp 1-bit/256-color System 7.5 chrome, pinstripes & After Dark
    │   ├── icons.js              # Happy Mac, Mac OS face, HyperCard, Trash, watch & hand cursors
    │   └── sounds.js             # Opt-in Quadra boot chime, Sosumi alert, tile slide & card flip
    ├── windows-95/
    │   ├── index.js              # Windows 95 / 98 SE entry & vignette scheduler
    │   ├── engine.js             # Start Menu, taskbar, Win 95/98 era switch & Flying Windows
    │   ├── apps.js               # Explorer, My Computer, WordPad, IE, Paint, Solitaire & more
    │   ├── vignettes.js          # Boot + 11 Win 95/98 scenes, Flying Windows & Shut Down
    │   ├── win95.css             # Classic Win 95 bevels & Win 98 gradient title bars (injected on mount)
    │   ├── icons.js              # Classic Windows 95/98 Start, desktop & application icons
    │   └── sounds.js             # Opt-in Win 95 & Win 98 startup swells & UI tones
    ├── os2-warp/
    │   ├── index.js              # OS/2 Warp 4 screensaver entry & vignette scheduler
    │   ├── engine.js             # Top WarpCenter, live CPU graph, WPS menus & PM windows
    │   ├── vignettes.js          # Boot + Shredder, Notebook, REXX, VoiceType, WebExplorer, Pulse, Klondike
    │   ├── os2-warp.css          # Workplace Shell 3D beveled chrome, WarpCenter & schemes
    │   ├── icons.js              # Warp swoop logo, Shredder, VoiceType, Pulse & PM cursors
    │   └── sounds.js             # Opt-in MMPM/2 startup fanfare, shredder whir & voice chirp
    ├── beos/
    │   ├── index.js              # Haiku / BeOS R5 entry & vignette scheduler
    │   ├── engine.js             # Yellow-tab windows, Deskbar, workspaces & boot icon row
    │   ├── apps.js               # Tracker, StyledEdit, Terminal, NetPositive, MediaPlayer & Find
    │   ├── vignettes.js          # Boot + 10 BeOS scenes, workspace switching & restart
    │   ├── beos.css              # Authentic BeOS R5 yellow tabs & Deskbar styles (injected on mount)
    │   ├── icons.js              # BeOS logo, volume, folder & application icons
    │   └── sounds.js             # Opt-in BeOS startup chord, alert & UI tones
    ├── windows-xp/
    │   ├── index.js              # Windows XP Luna screensaver entry & vignette scheduler
    │   ├── engine.js             # Bliss hills, Luna taskbar/Start Menu, balloons & Blue/Olive/Silver themes
    │   ├── vignettes.js          # Boot + AIM 5, Winamp, Space Cadet Pinball, Paint, IE6, 3D Pipes, Cascade
    │   ├── windows-xp.css        # Authentic glossy Luna chrome, Winamp skin, Pinball & Bliss styles
    │   ├── icons.js              # Glossy XP flag, AIM, Winamp, Pinball, IE6, Recycle Bin & tray icons
    │   └── sounds.js             # Opt-in XP startup chord, balloon pop, AIM sign-on/IM, pinball & error
    ├── solaris/
    │   ├── index.js              # Solaris 9 CDE entry & vignette scheduler
    │   ├── engine.js             # Front Panel, Motif windows, workspaces One–Four & title-bar dragging
    │   ├── vignettes.js          # Boot + File Manager, Text Editor, dtterm, Calendar, Style Manager
    │   ├── solaris.css           # CDE front panel, Motif frames & desk
    │   ├── icons.js              # Front Panel glyphs (original; not the Sun trademark)
    │   └── sounds.js             # Opt-in clicks, key ticks & a short startup chime
    ├── gnome-2/
    │   ├── index.js              # GNOME 2.4 entry & vignette scheduler
    │   ├── engine.js             # Metacity Simple theme, top/bottom panels, dragging & workspaces
    │   ├── apps.js               # Nautilus, gedit, Epiphany 1.0, Terminal, gcalctool & dialogs
    │   ├── vignettes.js          # Boot + Nautilus, gedit, Epiphany, gcalctool, window-drag scenes
    │   ├── gnome.css             # Authentic GNOME 2.4 Simple theme & panel styles (injected on mount)
    │   ├── icons.js              # GNOME foot, desktop, panel & application icons
    │   └── sounds.js             # Opt-in UI clicks & terminal tones
    ├── kde-3/
    │   ├── index.js              # KDE 3.1 entry & vignette scheduler
    │   ├── engine.js             # Keramik windows, bottom Kicker, virtual desktops & title-bar dragging
    │   ├── apps.js               # Konqueror, KWrite, Konsole, KCalc, Find Files & dialogs
    │   ├── vignettes.js          # Boot + Konqueror tabs, KWrite, Konsole, KCalc & window-drag scenes
    │   ├── kde.css               # Authentic KDE 3.1 Keramik & Kicker styles (injected on mount)
    │   ├── icons.js              # K menu mark, desktop & application icons
    │   └── sounds.js             # Opt-in UI clicks & session tones
    └── compilers/
        ├── index.js              # Compilers screensaver entry & 7-language scheduler
        ├── engine.js             # Terminal viewport, prompt, syntax classes & BUILD indicator lamp
        ├── vignettes.js          # C, C++, Rust (E0308 fix), Zig, Swift, Go, Haskell & a later program for each
        ├── compilers.css         # Terminal bezel, lamp & diagnostic output styles
        └── sounds.js             # Opt-in key click, build tick & completion blip synthesis
```

---

## Adding a New Screensaver

1. Create a folder under `savers/<id>/` with an `index.js` module exporting `createScreensaver()`:
   ```js
   export function createScreensaver() {
     return {
       mount(container, { speed, paused, muted, onStatus, onReady }) {},
       unmount() {},
       setSpeed(speed) {},
       setPaused(paused) {},
       setMuted(muted) {},
       nextScene() {},
       triggerSpecial(key) {},
     };
   }
   ```
2. Load any screensaver-specific CSS (either linked in `watch.html` or injected/removed cleanly inside `mount`/`unmount`).
3. Update its entry in `js/registry.js` with `status: 'available'` and `load: () => import('../savers/<id>/index.js')`. Both `index.html` and the `watch.html` switcher automatically pick it up.

---

## Hosting Notes

No build step or Node runtime is required—serve the repository root directly as static files (e.g., an Apache `<VirtualHost>` pointing `DocumentRoot` at `/mnt/storage/www/screens`, ensuring ES module `.js` files are served over HTTP/HTTPS rather than `file://`). The included `.htaccess` sets `Cache-Control: no-cache, must-revalidate, max-age=0` on `.html`, `.css`, and `.js` responses to prevent stale browser or CDN caching during development.
