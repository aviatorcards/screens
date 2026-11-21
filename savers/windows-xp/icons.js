/**
 * Glossy 2001 Windows XP Luna SVG icons & cursors
 */
export const XP_ICONS = {
  // 4-color waving Windows XP flag
  xpFlag: `<svg viewBox="0 0 28 28" width="100%" height="100%">
    <path d="M2 6 Q8 3 13 6 L11.5 14 Q6.5 11.5 1 14 Z" fill="#f14f21" stroke="#b52d08" stroke-width="0.6"/>
    <path d="M15 7 Q20.5 9.5 26 6.5 L24.5 14.5 Q19 17.2 13.5 14.8 Z" fill="#7fba00" stroke="#4f7c00" stroke-width="0.6"/>
    <path d="M1.2 16 Q6.5 13.5 11.5 16 L10 24 Q5 21.5 0.2 24 Z" fill="#00a4ef" stroke="#006aa6" stroke-width="0.6"/>
    <path d="M13.6 16.8 Q19 19.2 24.5 16.4 L23 24.4 Q17.5 27 12.2 24.6 Z" fill="#ffb900" stroke="#c08000" stroke-width="0.6"/>
  </svg>`,

  // Glossy My Computer CRT + Tower
  myComputer: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <rect x="19" y="7" width="16" height="25" rx="2" fill="#d8e0ec" stroke="#44546a" stroke-width="1.4"/>
    <rect x="22" y="11" width="10" height="3" fill="#9fb0c8" stroke="#5c6c84" stroke-width="0.8"/>
    <circle cx="30" cy="24" r="1.8" fill="#32c84a"/>
    <rect x="4" y="9" width="24" height="19" rx="2.5" fill="#e6eef8" stroke="#3c4c64" stroke-width="1.5"/>
    <rect x="7" y="12" width="18" height="13" rx="1" fill="url(#xpMonGrad)"/>
    <defs>
      <linearGradient id="xpMonGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#48a8ff"/>
        <stop offset="60%" stop-color="#1e66cc"/>
        <stop offset="100%" stop-color="#3ab54a"/>
      </linearGradient>
    </defs>
    <path d="M12 28 L20 28 L22 33 L10 33 Z" fill="#b8c4d4" stroke="#44546a" stroke-width="1.2"/>
  </svg>`,

  // Glossy Yellow My Documents Folder
  myDocuments: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <path d="M4 11 L15 11 L18 14 L34 14 L34 32 L4 32 Z" fill="#e8b838" stroke="#996810" stroke-width="1.3"/>
    <rect x="12" y="6" width="16" height="18" fill="#ffffff" stroke="#445c80" stroke-width="1.1"/>
    <line x1="15" y1="10" x2="25" y2="10" stroke="#6080b0" stroke-width="1.2"/>
    <line x1="15" y1="14" x2="24" y2="14" stroke="#90a4c0" stroke-width="1.1"/>
    <path d="M6 17 L37 17 L34 33 L3 33 Z" fill="#ffd858" stroke="#a67212" stroke-width="1.3"/>
    <path d="M7 18.5 L35 18.5" stroke="#fff7c4" stroke-width="1.4"/>
  </svg>`,

  // Translucent XP Recycle Bin (Empty)
  recycleEmpty: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <ellipse cx="20" cy="9" rx="12" ry="3.5" fill="#d8ecff" stroke="#3a6a9c" stroke-width="1.3"/>
    <path d="M8 9 L11 33 C11 35, 29 35, 29 33 L32 9 Z" fill="rgba(168,214,252,0.88)" stroke="#3a6a9c" stroke-width="1.4"/>
    <path d="M16 17 L20 13 L24 17 M25 22 L22 27 L17 25 M14 23 L16 18" fill="none" stroke="#228b3b" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // XP Recycle Bin (Full)
  recycleFull: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <polygon points="12,11 16,4 24,6 28,11" fill="#ffffff" stroke="#666" stroke-width="1"/>
    <polygon points="18,11 23,5 30,9 26,12" fill="#eef4ff" stroke="#5c78a0" stroke-width="1"/>
    <ellipse cx="20" cy="11" rx="12" ry="3.5" fill="#d8ecff" stroke="#3a6a9c" stroke-width="1.3"/>
    <path d="M8 11 L11 34 C11 36, 29 36, 29 34 L32 11 Z" fill="rgba(168,214,252,0.9)" stroke="#3a6a9c" stroke-width="1.4"/>
    <path d="M16 19 L20 15 L24 19 M25 24 L22 29 L17 27 M14 25 L16 20" fill="none" stroke="#228b3b" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // Internet Explorer 6 glossy blue 'e' with gold orbital ring
  ie6: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <circle cx="20" cy="20" r="13.5" fill="#1d8cf0" stroke="#0c4c96" stroke-width="1.3"/>
    <path d="M11 21 H31 C31 14, 26 9, 20 9 C13 9, 9 14, 9 20 C9 27, 14 31, 21 31 C25 31, 28 29, 30 26 H23 C22 27, 21 27.5, 19.5 27.5 C16.5 27.5, 14.5 25, 14.5 22.5 H32" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(-32 20 20)" fill="none" stroke="#ffc414" stroke-width="2.6"/>
  </svg>`,

  // AIM running man — yellow badge, readable at tray size
  aim: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <circle cx="20" cy="20" r="16.5" fill="#ffcc00" stroke="#1a1a1a" stroke-width="1.5"/>
    <circle cx="17.2" cy="13.2" r="2.35" fill="#1a1a1a"/>
    <g fill="none" stroke="#1a1a1a" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16.6 16.2 L13.4 22.4"/>
      <path d="M16.2 17.4 L11.2 16.2"/>
      <path d="M16.2 17.6 L22.2 19.6 L25.4 16.4"/>
      <path d="M13.4 22.4 L9.6 28.6"/>
      <path d="M13.6 22.2 L19.8 27.8"/>
    </g>
  </svg>`,

  // Winamp 2.91 Classic Lightning Bolt
  winamp: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <rect x="5" y="5" width="30" height="30" rx="4" fill="#2c3038" stroke="#111" stroke-width="1.5"/>
    <polygon points="22,6 11,22 19,22 16,34 29,18 21,18" fill="#ffd628" stroke="#a66800" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,

  // 3D Pinball — Space Cadet
  pinball: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <rect x="4" y="4" width="32" height="32" rx="6" fill="#1d184a" stroke="#5c70c8" stroke-width="1.6"/>
    <circle cx="15" cy="15" r="6" fill="#e63946" stroke="#ffd166" stroke-width="1.8"/>
    <circle cx="27" cy="24" r="5.5" fill="url(#pbBall)" stroke="#222" stroke-width="1"/>
    <defs>
      <radialGradient id="pbBall" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="60%" stop-color="#b8c4d4"/>
        <stop offset="100%" stop-color="#485468"/>
      </radialGradient>
    </defs>
    <path d="M9 30 L19 26" stroke="#4cc9f0" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  // XP Paint Cup & Palette
  paint: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <path d="M12 16 L28 16 L26 34 L14 34 Z" fill="#e8eef6" stroke="#3c5270" stroke-width="1.4"/>
    <path d="M15 16 L11 6 L15 5 L18 16 Z" fill="#e63946" stroke="#66141a" stroke-width="1"/>
    <path d="M20 16 L20 4 L24 4 L23 16 Z" fill="#2a9d8f" stroke="#124a42" stroke-width="1"/>
    <path d="M24 16 L29 7 L32 9 L27 16 Z" fill="#f4a261" stroke="#7a4414" stroke-width="1"/>
    <circle cx="20" cy="25" r="4" fill="#3a86ff"/>
  </svg>`,

  // XP Notepad
  notepad: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <rect x="8" y="6" width="24" height="29" rx="1.5" fill="#ffffff" stroke="#3c5472" stroke-width="1.4"/>
    <rect x="8" y="6" width="24" height="6" fill="#2e78d2" stroke="#1b4d8f" stroke-width="1.2"/>
    <line x1="12" y1="17" x2="28" y2="17" stroke="#7a98be" stroke-width="1.3"/>
    <line x1="12" y1="22" x2="27" y2="22" stroke="#7a98be" stroke-width="1.3"/>
    <line x1="12" y1="27" x2="23" y2="27" stroke="#7a98be" stroke-width="1.3"/>
  </svg>`,

  // XP Display Properties Monitor + Palette
  displayProps: `<svg viewBox="0 0 40 40" width="100%" height="100%">
    <rect x="4" y="6" width="30" height="22" rx="2" fill="#dbe6f4" stroke="#3a4c66" stroke-width="1.4"/>
    <rect x="7" y="9" width="24" height="16" fill="#52a8ff"/>
    <path d="M7 20 Q16 14 31 21 L31 25 L7 25 Z" fill="#46b842"/>
    <rect x="14" y="28" width="10" height="5" fill="#a8b8cc" stroke="#3a4c66" stroke-width="1.2"/>
  </svg>`,

  // XP Start Menu User Avatar (Classic Chess / Blue Sky tile)
  userAvatar: `<svg viewBox="0 0 48 48" width="100%" height="100%">
    <rect x="0" y="0" width="48" height="48" fill="url(#xpAvBg)"/>
    <defs>
      <linearGradient id="xpAvBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f6a623"/>
        <stop offset="100%" stop-color="#c95b12"/>
      </linearGradient>
    </defs>
    <circle cx="24" cy="17" r="8" fill="#fff4d6"/>
    <path d="M10 42 C10 31, 16 26, 24 26 C32 26, 38 31, 38 42 Z" fill="#fff4d6"/>
  </svg>`,

  // System Tray Icons
  securityShield: `<svg viewBox="0 0 20 20" width="100%" height="100%">
    <path d="M10 2 L17 4.5 V10 C17 14.5 13.8 17.5 10 18.8 C6.2 17.5 3 14.5 3 10 V4.5 Z" fill="#e63228" stroke="#ffffff" stroke-width="1.1"/>
    <path d="M10 3.2 L15.8 5.2 V10 H10 Z" fill="#f7c424"/>
    <path d="M10 10 H15.8 C15.4 13.5 12.8 16 10 17.2 Z" fill="#2c82e0"/>
    <path d="M4.2 10 H10 V17.2 C7.2 16 4.6 13.5 4.2 10 Z" fill="#32b84a"/>
  </svg>`,

  networkTray: `<svg viewBox="0 0 20 20" width="100%" height="100%">
    <rect x="2" y="3" width="9" height="7" rx="1" fill="#d8e4f0" stroke="#1c2a3a" stroke-width="1"/>
    <rect x="3.5" y="4.5" width="6" height="4" fill="#3ee8ff" class="xp-net-led-a"/>
    <rect x="9" y="9" width="9" height="7" rx="1" fill="#d8e4f0" stroke="#1c2a3a" stroke-width="1"/>
    <rect x="10.5" y="10.5" width="6" height="4" fill="#2460b0" class="xp-net-led-b"/>
  </svg>`,

  volumeTray: `<svg viewBox="0 0 20 20" width="100%" height="100%">
    <polygon points="3,8 7,8 12,4 12,16 7,12 3,12" fill="#e8eef6" stroke="#1c3450" stroke-width="1.1"/>
    <path d="M14.5 7 Q17 10 14.5 13" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`,

  infoBalloon: `<svg viewBox="0 0 20 20" width="100%" height="100%">
    <circle cx="10" cy="10" r="8.5" fill="#2276d8" stroke="#0d3d7a" stroke-width="1.2"/>
    <rect x="9" y="8.5" width="2.2" height="6.2" fill="#fff"/>
    <circle cx="10.1" cy="5.8" r="1.3" fill="#fff"/>
  </svg>`,

  errorIcon: `<svg viewBox="0 0 32 32" width="100%" height="100%">
    <circle cx="16" cy="16" r="14" fill="#e02a22" stroke="#7a0d08" stroke-width="1.5"/>
    <path d="M10 10 L22 22 M22 10 L10 22" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round"/>
  </svg>`,

  // Crisp XP Cursors
  cursorArrow: `<svg viewBox="0 0 18 24" width="17" height="22">
    <path d="M1 1 L1 17.4 L4.8 13.6 L8.2 21.6 L11.1 20.2 L7.7 12.4 L13.4 12.2 Z" fill="#ffffff" stroke="#000000" stroke-width="1.35" stroke-linejoin="miter"/>
  </svg>`,

  cursorHand: `<svg viewBox="0 0 20 22" width="18" height="20">
    <path d="M8 2 C7 2 6.5 3 6.5 4 V10 L5 9 C4 8.5 3 9.5 3.5 10.8 L6.5 16 C7.5 18 9.2 19 11.5 19 H13.5 C15.8 19 17 17.5 17 15 V10 C17 9 16 8.5 15 9 V8.5 C15 7.5 14 7 13 7.5 V7 C13 6 12 5.5 11 6 V4 C11 2.8 9.5 2 8 2 Z" fill="#fff" stroke="#000" stroke-width="1.3" stroke-linejoin="round"/>
  </svg>`,

  cursorIbeam: `<svg viewBox="0 0 16 22" width="14" height="20">
    <path d="M4 2 H12 M8 2 V20 M4 20 H12" stroke="#000" stroke-width="1.5" fill="none"/>
  </svg>`,
};
