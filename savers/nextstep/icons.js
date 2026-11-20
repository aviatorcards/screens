/**
 * Crisp Classic NeXTSTEP 3.3 (1993) SVG Icons & Cursors
 */

export const NEXT_ICONS = {
  // Paul Rand's iconic tilted black NeXT cube
  nextCube: `
    <svg viewBox="0 0 48 48" width="42" height="42">
      <g transform="rotate(-18 24 24)">
        <rect x="8" y="8" width="32" height="32" rx="1.5" fill="#111111" stroke="#000" stroke-width="1.5"/>
        <path d="M8 8 L40 8 L38 11 L11 11 Z" fill="#3a3a3a"/>
        <text x="14" y="22" font-family="Georgia,serif" font-weight="900" font-size="12" fill="#4cd964">N</text>
        <text x="27" y="21" font-family="Georgia,serif" font-weight="900" font-size="11" fill="#ffd93b">e</text>
        <text x="14" y="35" font-family="Georgia,serif" font-weight="900" font-size="12" fill="#ff4d6d">X</text>
        <text x="27" y="35" font-family="Georgia,serif" font-weight="900" font-size="12" fill="#4cc9f0">T</text>
      </g>
    </svg>
  `,

  terminal: `
    <svg viewBox="0 0 48 48" width="40" height="40">
      <rect x="6" y="7" width="36" height="27" rx="2" fill="#2b2b2b" stroke="#000" stroke-width="1.8"/>
      <rect x="9" y="10" width="30" height="21" fill="#111"/>
      <text x="12" y="23" font-family="monospace" font-weight="700" font-size="11" fill="#e5e5e5">&gt;_</text>
      <rect x="17" y="34" width="14" height="4" fill="#666" stroke="#000" stroke-width="1.2"/>
      <rect x="11" y="38" width="26" height="4" fill="#888" stroke="#000" stroke-width="1.3"/>
    </svg>
  `,

  edit: `
    <svg viewBox="0 0 48 48" width="40" height="40">
      <path d="M10 6 H30 L38 14 V42 H10 Z" fill="#f2f2f2" stroke="#000" stroke-width="1.6"/>
      <path d="M30 6 V14 H38" fill="#cccccc" stroke="#000" stroke-width="1.4"/>
      <line x1="15" y1="19" x2="33" y2="19" stroke="#333" stroke-width="1.8"/>
      <line x1="15" y1="25" x2="31" y2="25" stroke="#555" stroke-width="1.6"/>
      <line x1="15" y1="31" x2="27" y2="31" stroke="#555" stroke-width="1.6"/>
      <path d="M27 36 L39 20 L43 23 L31 39 L26 40 Z" fill="#222" stroke="#fff" stroke-width="1"/>
    </svg>
  `,

  mail: `
    <svg viewBox="0 0 48 48" width="40" height="40">
      <rect x="6" y="12" width="36" height="24" rx="1" fill="#ececec" stroke="#000" stroke-width="1.8"/>
      <path d="M7 13 L24 26 L41 13" fill="none" stroke="#111" stroke-width="1.8"/>
      <path d="M7 35 L18 24 M41 35 L30 24" stroke="#666" stroke-width="1.4"/>
      <rect x="31" y="15" width="7" height="8" fill="#c44536" stroke="#000" stroke-width="1"/>
    </svg>
  `,

  www: `
    <svg viewBox="0 0 48 48" width="40" height="40">
      <circle cx="24" cy="24" r="16" fill="#d9e4f0" stroke="#000" stroke-width="1.8"/>
      <ellipse cx="24" cy="24" rx="8" ry="16" fill="none" stroke="#1d3557" stroke-width="1.4"/>
      <line x1="8" y1="24" x2="40" y2="24" stroke="#1d3557" stroke-width="1.4"/>
      <line x1="11" y1="16" x2="37" y2="16" stroke="#1d3557" stroke-width="1.1"/>
      <line x1="11" y1="32" x2="37" y2="32" stroke="#1d3557" stroke-width="1.1"/>
      <rect x="10" y="19" width="28" height="10" fill="#111"/>
      <text x="24" y="27" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-weight="900" font-size="8.5" fill="#fff">WWW</text>
    </svg>
  `,

  ib: `
    <svg viewBox="0 0 48 48" width="40" height="40">
      <rect x="7" y="11" width="34" height="28" rx="2" fill="#d4d4d4" stroke="#000" stroke-width="1.8"/>
      <rect x="7" y="11" width="34" height="7" fill="#111"/>
      <rect x="12" y="22" width="12" height="11" fill="#fff" stroke="#000" stroke-width="1.3"/>
      <rect x="27" y="23" width="10" height="5" fill="#aaa" stroke="#000" stroke-width="1.2"/>
      <rect x="27" y="30" width="10" height="5" fill="#aaa" stroke="#000" stroke-width="1.2"/>
      <path d="M18 27 Q23 27 27 25" fill="none" stroke="#c43b3b" stroke-width="1.8"/>
    </svg>
  `,

  prefs: `
    <svg viewBox="0 0 48 48" width="40" height="40">
      <rect x="8" y="8" width="32" height="32" rx="2" fill="#dcdcdc" stroke="#000" stroke-width="1.6"/>
      <line x1="16" y1="14" x2="16" y2="34" stroke="#333" stroke-width="2.5"/>
      <line x1="24" y1="14" x2="24" y2="34" stroke="#333" stroke-width="2.5"/>
      <line x1="32" y1="14" x2="32" y2="34" stroke="#333" stroke-width="2.5"/>
      <rect x="12" y="18" width="8" height="5" fill="#fff" stroke="#000" stroke-width="1.3"/>
      <rect x="20" y="26" width="8" height="5" fill="#fff" stroke="#000" stroke-width="1.3"/>
      <rect x="28" y="16" width="8" height="5" fill="#fff" stroke="#000" stroke-width="1.3"/>
    </svg>
  `,

  recycler: `
    <svg viewBox="0 0 48 48" width="40" height="40">
      <circle cx="24" cy="24" r="17" fill="#181818" stroke="#000" stroke-width="1.6"/>
      <path d="M24 9 A15 15 0 0 1 39 24 A11 11 0 0 1 24 35 A8 8 0 0 1 16 24 A5 5 0 0 1 24 19" fill="none" stroke="#e5e5e5" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M24 39 A15 15 0 0 1 9 24 A11 11 0 0 1 24 13" fill="none" stroke="#999" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="2.8" fill="#000" stroke="#fff" stroke-width="1.1"/>
    </svg>
  `,

  folder: `
    <svg viewBox="0 0 32 28" width="26" height="22">
      <path d="M3 6 H12 L15 9 H29 V25 H3 Z" fill="#b8b8b8" stroke="#000" stroke-width="1.5"/>
      <path d="M4 10 H28 V24 H4 Z" fill="#dcdcdc"/>
      <line x1="4" y1="11" x2="28" y2="11" stroke="#fff" stroke-width="1"/>
    </svg>
  `,

  file: `
    <svg viewBox="0 0 28 32" width="20" height="24">
      <path d="M4 2 H18 L24 8 V30 H4 Z" fill="#f4f4f4" stroke="#000" stroke-width="1.5"/>
      <path d="M18 2 V8 H24" fill="#ccc" stroke="#000" stroke-width="1.2"/>
      <line x1="8" y1="14" x2="20" y2="14" stroke="#444" stroke-width="1.4"/>
      <line x1="8" y1="19" x2="18" y2="19" stroke="#666" stroke-width="1.3"/>
      <line x1="8" y1="24" x2="19" y2="24" stroke="#666" stroke-width="1.3"/>
    </svg>
  `,

  cursorArrow: `
    <svg viewBox="0 0 18 22" width="16" height="20">
      <path d="M1 1 L1 17 L5 13.5 L8 19.5 L10.6 18.2 L7.6 12.2 L13 12.2 Z" fill="#000" stroke="#fff" stroke-width="1.6"/>
    </svg>
  `,

  cursorIBeam: `
    <svg viewBox="0 0 14 20" width="12" height="18">
      <path d="M3 2 H11 M3 18 H11 M7 2 V18" stroke="#fff" stroke-width="3.2" stroke-linecap="square"/>
      <path d="M3 2 H11 M3 18 H11 M7 2 V18" stroke="#000" stroke-width="1.5" stroke-linecap="square"/>
    </svg>
  `,

  // Iconic NeXT spinning Magneto-Optical wait disc cursor!
  cursorWait: `
    <svg viewBox="0 0 20 20" width="18" height="18" class="nx-wait-spin">
      <circle cx="10" cy="10" r="8" fill="#ddd" stroke="#000" stroke-width="1.6"/>
      <path d="M10 2 A8 8 0 0 1 18 10 L10 10 Z" fill="#222"/>
      <path d="M10 18 A8 8 0 0 1 2 10 L10 10 Z" fill="#222"/>
      <circle cx="10" cy="10" r="2.2" fill="#fff" stroke="#000" stroke-width="1"/>
    </svg>
  `,
};
