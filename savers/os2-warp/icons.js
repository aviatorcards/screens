/**
 * Crisp inline SVG icons & cursors for IBM OS/2 Warp 4 ("Merlin", 1996)
 */
export const WARP_ICONS = {
  // Iconic IBM OS/2 Warp 4 swoop emblem (red/blue/gold vortex)
  warpLogo: `<svg viewBox="0 0 32 32" width="100%" height="100%">
    <rect x="2" y="2" width="28" height="28" rx="3" fill="#183f78" stroke="#0c2244" stroke-width="1.2"/>
    <ellipse cx="16" cy="17" rx="11" ry="5.5" transform="rotate(-24 16 17)" fill="none" stroke="#e4382c" stroke-width="3.2"/>
    <ellipse cx="16" cy="16" rx="9" ry="4" transform="rotate(-24 16 16)" fill="none" stroke="#ffd24a" stroke-width="1.6"/>
    <path d="M6 21 C11 11, 21 9, 27 11" fill="none" stroke="#62b4ff" stroke-width="2.2" stroke-linecap="round"/>
    <text x="16" y="21" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="9.5" fill="#fff" stroke="#0c2244" stroke-width="0.6">OS/2</text>
  </svg>`,

  // OS/2 System folder (blue/gray beveled folder with system emblem)
  os2System: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M3 10 L13 10 L16 13 L33 13 L33 30 L3 30 Z" fill="#4f82b8" stroke="#182f4a" stroke-width="1.4"/>
    <path d="M4 11 L12.5 11 L15.5 14 L32 14" fill="none" stroke="#a6ccf0" stroke-width="1.2"/>
    <rect x="10" y="17" width="16" height="10" rx="1" fill="#dbe6f2" stroke="#1e3c60" stroke-width="1.1"/>
    <path d="M12 24 C15 19, 21 19, 24 21" fill="none" stroke="#d8352a" stroke-width="1.8"/>
    <circle cx="18" cy="22" r="2.2" fill="#235a9e"/>
  </svg>`,

  // Classic Warp 4 manila WPS Folder
  folder: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M3 10 L13 10 L16 13 L33 13 L33 30 L3 30 Z" fill="#e6c86e" stroke="#4a3c16" stroke-width="1.4"/>
    <path d="M4 11 L12.5 11 L15.5 14 L32 14" fill="none" stroke="#fff4c4" stroke-width="1.3"/>
    <path d="M3 29 L33 29" stroke="#9e8234" stroke-width="1.2"/>
  </svg>`,

  folderOpen: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M3 9 L13 9 L16 12 L31 12 L31 29 L3 29 Z" fill="#c7a548" stroke="#4a3c16" stroke-width="1.4"/>
    <path d="M5 16 L34 16 L31 30 L2 30 Z" fill="#f0d57d" stroke="#4a3c16" stroke-width="1.4"/>
    <path d="M6 17.5 L32 17.5" stroke="#fff7d4" stroke-width="1.2"/>
  </svg>`,

  // Drives object (hard drive + floppy)
  drives: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="4" y="12" width="28" height="17" rx="1.5" fill="#d4d4d4" stroke="#222" stroke-width="1.4"/>
    <rect x="6" y="14" width="24" height="5" fill="#a8a8a8" stroke="#555" stroke-width="0.9"/>
    <rect x="11" y="15.5" width="14" height="2" fill="#222"/>
    <rect x="24" y="23" width="5" height="2.4" fill="#32c84a" stroke="#1a5c24" stroke-width="0.7"/>
    <rect x="7" y="22.5" width="12" height="3.5" fill="#888" stroke="#444" stroke-width="0.8"/>
    <path d="M7 12 L11 7 L25 7 L29 12 Z" fill="#e8e8e8" stroke="#222" stroke-width="1.2"/>
  </svg>`,

  // Iconic OS/2 WPS Shredder!
  shredder: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="10" y="3" width="16" height="11" fill="#ffffff" stroke="#222" stroke-width="1.2"/>
    <line x1="13" y1="6" x2="23" y2="6" stroke="#555" stroke-width="1.1"/>
    <line x1="13" y1="9" x2="21" y2="9" stroke="#555" stroke-width="1.1"/>
    <rect x="5" y="13" width="26" height="10" rx="1" fill="#b4bcc4" stroke="#222" stroke-width="1.4"/>
    <rect x="8" y="15.5" width="20" height="2.2" fill="#222"/>
    <circle cx="27" cy="20" r="1.4" fill="#d8352a"/>
    <path d="M9 23 L9 32 M13 23 L12 33 M17 23 L17 32 M21 23 L22 33 M25 23 L26 32" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M9 23 L9 32 M13 23 L12 33 M17 23 L17 32 M21 23 L22 33 M25 23 L26 32" stroke="#555" stroke-width="0.6" stroke-linecap="round"/>
  </svg>`,

  // Templates folder (pad of tear-off objects)
  templates: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M3 11 L13 11 L16 14 L32 14 L32 30 L3 30 Z" fill="#d9c074" stroke="#4a3c16" stroke-width="1.3"/>
    <rect x="11" y="7" width="14" height="16" fill="#fff" stroke="#222" stroke-width="1.1"/>
    <rect x="14" y="10" width="14" height="16" fill="#eef6ff" stroke="#235a9e" stroke-width="1.1"/>
    <line x1="17" y1="14" x2="25" y2="14" stroke="#235a9e" stroke-width="1.2"/>
    <line x1="17" y1="18" x2="24" y2="18" stroke="#666" stroke-width="1.1"/>
    <line x1="17" y1="22" x2="22" y2="22" stroke="#666" stroke-width="1.1"/>
  </svg>`,

  // Connections (Globe + network cable)
  connections: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <circle cx="18" cy="17" r="11" fill="#3a84c8" stroke="#142d4a" stroke-width="1.4"/>
    <ellipse cx="18" cy="17" rx="5.5" ry="11" fill="none" stroke="#b6dcff" stroke-width="1"/>
    <line x1="7" y1="17" x2="29" y2="17" stroke="#b6dcff" stroke-width="1"/>
    <path d="M12 12 C14 10, 17 11, 16 14 C15 16, 13 15, 12 12 Z" fill="#6ac26a"/>
    <path d="M20 15 C23 13, 26 16, 24 20 C22 22, 19 19, 20 15 Z" fill="#6ac26a"/>
    <rect x="10" y="27" width="16" height="5" rx="1" fill="#c8c8c8" stroke="#222" stroke-width="1.2"/>
    <circle cx="14" cy="29.5" r="1" fill="#2cc84a"/>
    <circle cx="18" cy="29.5" r="1" fill="#f0b830"/>
  </svg>`,

  // Assistance Center (Information book with red ?)
  assistance: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M6 7 L26 7 L29 10 L29 30 L9 30 L6 27 Z" fill="#2b5f9e" stroke="#112947" stroke-width="1.4"/>
    <rect x="9" y="10" width="18" height="18" fill="#f7f9fc" stroke="#112947" stroke-width="1"/>
    <text x="18" y="24" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="16" fill="#cf2c24">?</text>
  </svg>`,

  // OS/2 Command Prompt [C:\]
  cmdOs2: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="3" y="6" width="30" height="24" rx="1.5" fill="#c8c8c8" stroke="#222" stroke-width="1.4"/>
    <rect x="5" y="8" width="26" height="4" fill="#235a9e"/>
    <rect x="5" y="12.5" width="26" height="15.5" fill="#0d1117"/>
    <text x="7.5" y="22.5" font-family="monospace" font-weight="bold" font-size="8.5" fill="#e6edf3">[C:\]</text>
    <rect x="26" y="19" width="3" height="5" fill="#58d68d"/>
  </svg>`,

  // OS/2 System Editor (E.EXE)
  editor: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="6" y="4" width="22" height="28" fill="#fffdf2" stroke="#222" stroke-width="1.4"/>
    <line x1="10" y1="10" x2="24" y2="10" stroke="#235a9e" stroke-width="1.5"/>
    <line x1="10" y1="15" x2="23" y2="15" stroke="#555" stroke-width="1.2"/>
    <line x1="10" y1="20" x2="24" y2="20" stroke="#555" stroke-width="1.2"/>
    <line x1="10" y1="25" x2="19" y2="25" stroke="#555" stroke-width="1.2"/>
    <path d="M21 26 L31 12 L34 14 L24 28 L20 29 Z" fill="#f0b63a" stroke="#222" stroke-width="1.1"/>
  </svg>`,

  // IBM WebExplorer 1996
  webExplorer: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <circle cx="18" cy="18" r="13" fill="#1e62a8" stroke="#0d2b4d" stroke-width="1.5"/>
    <ellipse cx="18" cy="18" rx="6.5" ry="13" fill="none" stroke="#98ceff" stroke-width="1.1"/>
    <line x1="5" y1="18" x2="31" y2="18" stroke="#98ceff" stroke-width="1.1"/>
    <path d="M8 12 Q18 15 28 12 M8 24 Q18 21 28 24" fill="none" stroke="#98ceff" stroke-width="1"/>
    <path d="M18 6 L21 18 L18 30 L15 18 Z" fill="#e4382c" stroke="#fff" stroke-width="0.9"/>
    <circle cx="18" cy="18" r="2.2" fill="#ffd24a" stroke="#222" stroke-width="0.8"/>
  </svg>`,

  // OS/2 Pulse CPU Monitor
  pulse: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="4" y="6" width="28" height="24" rx="2" fill="#b8c0c8" stroke="#222" stroke-width="1.4"/>
    <rect x="7" y="9" width="22" height="16" fill="#091a10" stroke="#333" stroke-width="1"/>
    <polyline points="8,19 12,19 14,12 17,22 20,14 23,19 28,19" fill="none" stroke="#38ef68" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="26" cy="27.5" r="1.3" fill="#38ef68"/>
  </svg>`,

  // WPS Scheme Palette
  schemePalette: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M18 5 C9 5, 4 11, 4 19 C4 26, 10 31, 17 31 C20 31, 21 29, 20 27 C19 25, 21 23, 24 23 L27 23 C31 23, 33 20, 33 16 C33 10, 26 5, 18 5 Z" fill="#dfc296" stroke="#3a2810" stroke-width="1.4"/>
    <circle cx="12" cy="13" r="2.8" fill="#d8352a" stroke="#222" stroke-width="0.7"/>
    <circle cx="20" cy="10.5" r="2.8" fill="#235a9e" stroke="#222" stroke-width="0.7"/>
    <circle cx="27" cy="14" r="2.8" fill="#2fa84f" stroke="#222" stroke-width="0.7"/>
    <circle cx="11" cy="21" r="2.8" fill="#f0c230" stroke="#222" stroke-width="0.7"/>
    <circle cx="16" cy="26" r="2" fill="#9db7c4" stroke="#3a2810" stroke-width="0.9"/>
  </svg>`,

  // IBM VoiceType (Warp 4 microphone)
  voiceType: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="13" y="5" width="10" height="16" rx="5" fill="#6b7785" stroke="#1c2229" stroke-width="1.4"/>
    <line x1="15" y1="9" x2="21" y2="9" stroke="#cbd4de" stroke-width="1"/>
    <line x1="15" y1="12" x2="21" y2="12" stroke="#cbd4de" stroke-width="1"/>
    <line x1="15" y1="15" x2="21" y2="15" stroke="#cbd4de" stroke-width="1"/>
    <path d="M9 17 C9 23, 27 23, 27 17" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>
    <line x1="18" y1="23" x2="18" y2="30" stroke="#222" stroke-width="2"/>
    <line x1="12" y1="30" x2="24" y2="30" stroke="#222" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M27 8 Q31 12 27 16" fill="none" stroke="#2ea84f" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M30 6 Q35 12 30 18" fill="none" stroke="#2ea84f" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`,

  // Klondike Solitaire
  klondike: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="5" y="7" width="17" height="23" rx="2" fill="#fff" stroke="#222" stroke-width="1.3"/>
    <rect x="14" y="5" width="17" height="23" rx="2" fill="#fff" stroke="#222" stroke-width="1.3"/>
    <text x="17" y="13" font-family="Georgia,serif" font-weight="bold" font-size="8" fill="#c92424">A</text>
    <path d="M22.5 14 L26 18 L22.5 22 L19 18 Z" fill="#c92424"/>
    <text x="8" y="16" font-family="Georgia,serif" font-weight="bold" font-size="8" fill="#111">K</text>
  </svg>`,

  // Document / REXX file
  docFile: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M8 4 L22 4 L28 10 L28 32 L8 32 Z" fill="#ffffff" stroke="#222" stroke-width="1.4"/>
    <path d="M22 4 L22 10 L28 10 Z" fill="#d4d4d4" stroke="#222" stroke-width="1.1"/>
    <line x1="12" y1="15" x2="24" y2="15" stroke="#444" stroke-width="1.2"/>
    <line x1="12" y1="19.5" x2="24" y2="19.5" stroke="#444" stroke-width="1.2"/>
    <line x1="12" y1="24" x2="20" y2="24" stroke="#444" stroke-width="1.2"/>
  </svg>`,

  // WarpCenter icons
  lockup: `<svg viewBox="0 0 20 20" width="100%" height="100%">
    <path d="M6.5 9 V6.5 A3.5 3.5 0 0 1 13.5 6.5 V9" fill="none" stroke="#333" stroke-width="1.8"/>
    <rect x="4.5" y="9" width="11" height="8.5" rx="1" fill="#e6b83c" stroke="#333" stroke-width="1.2"/>
    <circle cx="10" cy="13" r="1.3" fill="#222"/>
  </svg>`,

  windowList: `<svg viewBox="0 0 20 20" width="100%" height="100%">
    <rect x="2" y="3" width="11" height="9" fill="#fff" stroke="#222" stroke-width="1.1"/>
    <rect x="2" y="3" width="11" height="2.6" fill="#235a9e"/>
    <rect x="7" y="8" width="11" height="9" fill="#eef4fa" stroke="#222" stroke-width="1.1"/>
    <rect x="7" y="8" width="11" height="2.6" fill="#235a9e"/>
  </svg>`,

  minimizedViewer: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="4" y="6" width="28" height="24" fill="#d0d8e0" stroke="#222" stroke-width="1.4"/>
    <rect x="4" y="6" width="28" height="5" fill="#235a9e"/>
    <rect x="8" y="15" width="8" height="6" fill="#fff" stroke="#333" stroke-width="1"/>
    <rect x="20" y="15" width="8" height="6" fill="#fff" stroke="#333" stroke-width="1"/>
    <rect x="8" y="23" width="8" height="4" fill="#e6c86e" stroke="#333" stroke-width="0.9"/>
  </svg>`,

  // Classic OS/2 Presentation Manager Cursors
  cursorArrow: `<svg viewBox="0 0 20 24" width="18" height="22">
    <path d="M1.5 1.5 L1.5 18.5 L5.8 14.3 L9.1 21.2 L12.0 19.8 L8.7 13.0 L14.8 13.0 Z" fill="#ffffff" stroke="#000000" stroke-width="1.5" stroke-linejoin="miter"/>
  </svg>`,

  cursorIbeam: `<svg viewBox="0 0 16 22" width="14" height="20">
    <path d="M4 2 H12 M8 2 V20 M4 20 H12" stroke="#000" stroke-width="1.6" fill="none"/>
  </svg>`,

  // Iconic OS/2 ticking clock wait pointer!
  cursorWait: `<svg viewBox="0 0 22 22" width="20" height="20">
    <circle cx="11" cy="11" r="9.5" fill="#ffffff" stroke="#000000" stroke-width="1.6"/>
    <circle cx="11" cy="11" r="7.2" fill="none" stroke="#235a9e" stroke-width="0.9"/>
    <line x1="11" y1="11" x2="11" y2="5.5" stroke="#000" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="11" y1="11" x2="15.5" y2="11" stroke="#cf2c24" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="11" cy="11" r="1.2" fill="#000"/>
  </svg>`,
};
