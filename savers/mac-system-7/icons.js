/**
 * Crisp 1-bit & 256-color Classic Macintosh System 7.5 (1994) SVG icons & cursors
 */
export const SYS7_ICONS = {
  // Classic 6-stripe Rainbow Apple for the menu bar
  rainbowApple: `<svg viewBox="0 0 18 20" width="14" height="16">
    <defs>
      <clipPath id="s7AppleClip">
        <path d="M12.2 5.2 C10.8 5.2 10 6 9.1 6 C8.1 6 7.1 5.2 5.8 5.2 C3.4 5.2 1.8 7.2 1.8 10.4 C1.8 14.3 4.3 18.6 6.4 18.6 C7.4 18.6 8.1 17.9 9.1 17.9 C10.1 17.9 10.7 18.6 11.8 18.6 C13.8 18.6 15.8 15.2 16.2 13.7 C13.6 12.6 13.3 9.1 15.8 7.8 C14.9 6.2 13.5 5.2 12.2 5.2 Z"/>
      </clipPath>
    </defs>
    <path d="M9.3 4.8 C9.4 2.9 10.8 1.5 12.5 1.3 C12.6 3.2 11.1 4.8 9.3 4.8 Z" fill="#61bb46"/>
    <g clip-path="url(#s7AppleClip)">
      <rect x="0" y="5" width="18" height="2.4" fill="#61bb46"/>
      <rect x="0" y="7.4" width="18" height="2.2" fill="#fdb827"/>
      <rect x="0" y="9.6" width="18" height="2.2" fill="#f5821f"/>
      <rect x="0" y="11.8" width="18" height="2.2" fill="#e03a3e"/>
      <rect x="0" y="14" width="18" height="2.2" fill="#963d97"/>
      <rect x="0" y="16.2" width="18" height="2.8" fill="#009ddc"/>
    </g>
  </svg>`,

  // Iconic 1-bit Happy Mac
  happyMac: `<svg viewBox="0 0 36 42" width="100%" height="100%">
    <rect x="4" y="2" width="28" height="34" rx="2" fill="#e6e6dc" stroke="#000" stroke-width="2"/>
    <rect x="8" y="6" width="20" height="15" fill="#fff" stroke="#000" stroke-width="1.6"/>
    <rect x="13" y="10" width="2" height="3" fill="#000"/>
    <rect x="21" y="10" width="2" height="3" fill="#000"/>
    <path d="M17.5 11 L17.5 14 L16 14" fill="none" stroke="#000" stroke-width="1.4"/>
    <path d="M13.5 16.5 Q18 19.5 22.5 16.5" fill="none" stroke="#000" stroke-width="1.5"/>
    <rect x="20" y="26" width="8" height="2" fill="#000"/>
    <rect x="7" y="36" width="22" height="4" fill="#c8c8be" stroke="#000" stroke-width="1.8"/>
  </svg>`,

  // Iconic System 7.5 Smiling Two-Tone Blue Mac OS Face (introduced in 7.5!)
  macOsFace: `<svg viewBox="0 0 48 48" width="100%" height="100%">
    <rect x="4" y="4" width="40" height="40" rx="3" fill="#5c85d6" stroke="#000" stroke-width="2"/>
    <path d="M25 4 L44 4 L44 44 L22 44 C20 35, 27 29, 25 22 C23 16, 26 10, 25 4 Z" fill="#a8c4f5"/>
    <path d="M25 6 C23 14, 21 20, 24 26 L19 26" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="14" y="14" width="3" height="5" fill="#000"/>
    <rect x="31" y="14" width="3" height="5" fill="#000"/>
    <path d="M14 31 Q24 39 34 31" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,

  // Classic Macintosh HD (1994 SCSI box)
  macHd: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="3" y="12" width="30" height="15" fill="#e8e8e8" stroke="#000" stroke-width="1.6"/>
    <path d="M3 12 L8 8 L28 8 L33 12 Z" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <rect x="6" y="16" width="16" height="3" fill="#b8b8b8" stroke="#000" stroke-width="1"/>
    <rect x="26" y="16.5" width="4" height="2" fill="#2ea84f"/>
    <line x1="3" y1="24" x2="33" y2="24" stroke="#888" stroke-width="1"/>
  </svg>`,

  // 3.5" Floppy Disk
  floppy: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M6 4 L27 4 L31 8 L31 32 L6 32 Z" fill="#8898c8" stroke="#000" stroke-width="1.6"/>
    <rect x="11" y="4" width="13" height="10" fill="#d8d8d8" stroke="#000" stroke-width="1.2"/>
    <rect x="19" y="6" width="3" height="6" fill="#333"/>
    <rect x="10" y="18" width="17" height="14" fill="#ffffff" stroke="#000" stroke-width="1.2"/>
    <line x1="13" y1="22" x2="24" y2="22" stroke="#555" stroke-width="1"/>
    <line x1="13" y1="26" x2="22" y2="26" stroke="#555" stroke-width="1"/>
  </svg>`,

  // Classic System 7 Periwinkle Folder
  folder: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M3 10 L13 10 L15.5 13 L33 13 L33 29 L3 29 Z" fill="#b8c4e8" stroke="#000" stroke-width="1.5"/>
    <line x1="4" y1="14" x2="32" y2="14" stroke="#ffffff" stroke-width="1.2"/>
    <line x1="4" y1="28" x2="32" y2="28" stroke="#6c78a8" stroke-width="1.2"/>
  </svg>`,

  // System Folder (with mini Mac emblem)
  systemFolder: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M3 10 L13 10 L15.5 13 L33 13 L33 29 L3 29 Z" fill="#b8c4e8" stroke="#000" stroke-width="1.5"/>
    <rect x="13" y="16" width="10" height="10" fill="#fff" stroke="#000" stroke-width="1.2"/>
    <rect x="15" y="18" width="6" height="4" fill="#98a8dc" stroke="#000" stroke-width="0.8"/>
    <line x1="15" y1="24" x2="21" y2="24" stroke="#000" stroke-width="1"/>
  </svg>`,

  // Classic System 7 Ribbed Metal Trash (Empty)
  trashEmpty: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="14" y="4" width="8" height="3" fill="#d8d8d8" stroke="#000" stroke-width="1.4"/>
    <rect x="7" y="7" width="22" height="3.5" fill="#e8e8e8" stroke="#000" stroke-width="1.5"/>
    <path d="M9 10.5 L27 10.5 L26 32 L10 32 Z" fill="#d8d8d8" stroke="#000" stroke-width="1.6"/>
    <line x1="13.5" y1="13" x2="14" y2="29" stroke="#000" stroke-width="1.2"/>
    <line x1="18" y1="13" x2="18" y2="29" stroke="#000" stroke-width="1.2"/>
    <line x1="22.5" y1="13" x2="22" y2="29" stroke="#000" stroke-width="1.2"/>
  </svg>`,

  // Classic System 7 Bulging Trash (Full!)
  trashFull: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="13" y="3" width="8" height="3" transform="rotate(-10 17 4.5)" fill="#d8d8d8" stroke="#000" stroke-width="1.4"/>
    <rect x="6" y="6.5" width="22" height="3.5" transform="rotate(-8 17 8)" fill="#e8e8e8" stroke="#000" stroke-width="1.5"/>
    <path d="M8 11 C5 18, 6 26, 9 32 L27 32 C30 26, 31 18, 28 11 Z" fill="#cccccc" stroke="#000" stroke-width="1.6"/>
    <path d="M13 13 C11 19, 11.5 25, 13 30" fill="none" stroke="#000" stroke-width="1.2"/>
    <line x1="18" y1="13" x2="18" y2="30" stroke="#000" stroke-width="1.2"/>
    <path d="M23 13 C25 19, 24.5 25, 23 30" fill="none" stroke="#000" stroke-width="1.2"/>
  </svg>`,

  // HyperCard 2.2 Stack Icon
  hyperCard: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="10" y="5" width="20" height="22" fill="#e8e8e8" stroke="#000" stroke-width="1.4"/>
    <rect x="7" y="8" width="20" height="22" fill="#f4f4f4" stroke="#000" stroke-width="1.4"/>
    <rect x="4" y="11" width="20" height="22" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <rect x="4" y="11" width="20" height="5" fill="#000"/>
    <circle cx="14" cy="24" r="4.2" fill="none" stroke="#000" stroke-width="1.5"/>
    <path d="M14 21.5 L14 26.5 M11.5 24 L16.5 24" stroke="#000" stroke-width="1.3"/>
  </svg>`,

  // TeachText / SimpleText Document
  teachText: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <path d="M7 4 L22 4 L29 11 L29 32 L7 32 Z" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <path d="M22 4 L22 11 L29 11 Z" fill="#d8d8d8" stroke="#000" stroke-width="1.2"/>
    <line x1="11" y1="15" x2="25" y2="15" stroke="#000" stroke-width="1.3"/>
    <line x1="11" y1="19" x2="24" y2="19" stroke="#000" stroke-width="1.3"/>
    <line x1="11" y1="23" x2="22" y2="23" stroke="#000" stroke-width="1.3"/>
    <line x1="11" y1="27" x2="18" y2="27" stroke="#000" stroke-width="1.3"/>
  </svg>`,

  // Classic Yellow Note Pad
  notePad: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="6" y="5" width="24" height="27" fill="#fff6a8" stroke="#000" stroke-width="1.5"/>
    <rect x="6" y="5" width="24" height="5" fill="#d4aa40" stroke="#000" stroke-width="1.3"/>
    <line x1="10" y1="15" x2="26" y2="15" stroke="#8a7a30" stroke-width="1"/>
    <line x1="10" y1="20" x2="24" y2="20" stroke="#8a7a30" stroke-width="1"/>
    <path d="M6 25 L13 25 L6 32 Z" fill="#e6cf66" stroke="#000" stroke-width="1.1"/>
  </svg>`,

  // Classic System 7.5 Puzzle DA
  puzzle: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="5" y="5" width="26" height="26" fill="#000" stroke="#000" stroke-width="1.5"/>
    <rect x="7" y="7" width="10" height="10" fill="#61bb46"/>
    <rect x="19" y="7" width="10" height="10" fill="#fdb827"/>
    <rect x="7" y="19" width="10" height="10" fill="#009ddc"/>
    <rect x="19" y="19" width="10" height="10" fill="#e03a3e"/>
  </svg>`,

  // Desktop Patterns Control Panel
  desktopPatterns: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="4" y="6" width="28" height="24" fill="#d8e0f4" stroke="#000" stroke-width="1.5"/>
    <rect x="8" y="10" width="8" height="8" fill="#5c78c8"/>
    <rect x="16" y="18" width="8" height="8" fill="#5c78c8"/>
    <rect x="24" y="10" width="4" height="8" fill="#5c78c8"/>
    <rect x="8" y="18" width="8" height="8" fill="#ffffff"/>
    <rect x="16" y="10" width="8" height="8" fill="#ffffff"/>
  </svg>`,

  // After Dark Moon & Stars
  afterDark: `<svg viewBox="0 0 36 36" width="100%" height="100%">
    <rect x="4" y="5" width="28" height="26" rx="2" fill="#0d1738" stroke="#000" stroke-width="1.5"/>
    <path d="M18 9 A8 8 0 1 0 26 21 A6.5 6.5 0 1 1 18 9 Z" fill="#ffe66d"/>
    <circle cx="24" cy="12" r="1.2" fill="#fff"/>
    <circle cx="27" cy="16" r="1" fill="#fff"/>
    <circle cx="11" cy="24" r="1" fill="#fff"/>
  </svg>`,

  // Menu Bar Balloon Help (?)
  balloonHelp: `<svg viewBox="0 0 18 18" width="15" height="15">
    <text x="9" y="14" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-weight="bold" font-size="16" fill="#000">?</text>
  </svg>`,

  // Menu Bar Compact Mac Application Switcher icon
  appFinder: `<svg viewBox="0 0 16 18" width="14" height="15">
    <rect x="2" y="1.5" width="12" height="14" rx="1" fill="#fff" stroke="#000" stroke-width="1.3"/>
    <rect x="4" y="3.5" width="8" height="6" fill="#b8c4e8" stroke="#000" stroke-width="1"/>
    <line x1="8" y1="12" x2="12" y2="12" stroke="#000" stroke-width="1.2"/>
  </svg>`,

  // Classic 1-bit System 7 Cursors
  cursorArrow: `<svg viewBox="0 0 18 22" width="16" height="20">
    <path d="M1 1 L1 16.5 L4.8 13 L7.6 19.2 L10.3 18 L7.5 11.8 L12.5 11.8 Z" fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="miter"/>
  </svg>`,

  cursorIbeam: `<svg viewBox="0 0 14 20" width="12" height="18">
    <path d="M3 2 H11 M7 2 V18 M3 18 H11" stroke="#000" stroke-width="1.5" fill="none"/>
  </svg>`,

  // Iconic Classic Mac Wristwatch wait cursor!
  cursorWatch: `<svg viewBox="0 0 18 22" width="16" height="20">
    <rect x="6" y="1" width="6" height="4" fill="#000"/>
    <rect x="6" y="17" width="6" height="4" fill="#000"/>
    <circle cx="9" cy="11" r="6.8" fill="#fff" stroke="#000" stroke-width="1.6"/>
    <line x1="9" y1="11" x2="9" y2="6.5" stroke="#000" stroke-width="1.5"/>
    <line x1="9" y1="11" x2="12.5" y2="11" stroke="#000" stroke-width="1.5"/>
  </svg>`,

  // Iconic HyperCard Browse Pointing Hand!
  cursorHand: `<svg viewBox="0 0 20 22" width="18" height="20">
    <path d="M8 2 C7 2 6.5 3 6.5 4 V10 L5 9 C4 8.5 3 9.5 3.5 10.8 L6.5 16 C7.5 18 9.2 19 11.5 19 H13.5 C15.8 19 17 17.5 17 15 V10 C17 9 16 8.5 15 9 V8.5 C15 7.5 14 7 13 7.5 V7 C13 6 12 5.5 11 6 V4 C11 2.8 9.5 2 8 2 Z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`,
};
