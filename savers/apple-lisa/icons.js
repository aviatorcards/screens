/**
 * Crisp 1-Bit Monochrome SVG Icons & Cursors for Apple Lisa OS 7/7 (1983)
 */
export const LISA_ICONS = {
  // Iconic ProFile 5 MB external hard drive that sat atop the Lisa
  profile5mb: `
    <svg viewBox="0 0 40 34" width="38" height="32">
      <rect x="3" y="9" width="34" height="17" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <line x1="3" y1="15" x2="37" y2="15" stroke="#0f0f0e" stroke-width="1.2"/>
      <rect x="7" y="19" width="12" height="3" fill="#0f0f0e"/>
      <circle cx="31" cy="20.5" r="2" fill="#0f0f0e"/>
      <rect x="8" y="26" width="5" height="3" fill="#0f0f0e"/>
      <rect x="27" y="26" width="5" height="3" fill="#0f0f0e"/>
    </svg>
  `,

  // LisaWrite Stationery Pad (stacked sheets — tear off a fresh page!)
  padWrite: `
    <svg viewBox="0 0 38 36" width="34" height="32">
      <rect x="9" y="6" width="22" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.5"/>
      <rect x="6" y="4" width="22" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.5"/>
      <path d="M4 2 H21 L26 7 V28 H4 Z" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <path d="M21 2 V7 H26" fill="none" stroke="#0f0f0e" stroke-width="1.5"/>
      <line x1="8" y1="12" x2="21" y2="12" stroke="#0f0f0e" stroke-width="1.5"/>
      <line x1="8" y1="16" x2="22" y2="16" stroke="#0f0f0e" stroke-width="1.5"/>
      <line x1="8" y1="20" x2="18" y2="20" stroke="#0f0f0e" stroke-width="1.5"/>
    </svg>
  `,

  // LisaDraw Stationery Pad
  padDraw: `
    <svg viewBox="0 0 38 36" width="34" height="32">
      <rect x="8" y="5" width="23" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.5"/>
      <rect x="4" y="2" width="23" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <circle cx="12" cy="11" r="4" fill="none" stroke="#0f0f0e" stroke-width="1.6"/>
      <rect x="14" y="13" width="9" height="9" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.6"/>
      <line x1="7" y1="24" x2="22" y2="8" stroke="#0f0f0e" stroke-width="1.3"/>
    </svg>
  `,

  // LisaCalc Stationery Pad
  padCalc: `
    <svg viewBox="0 0 38 36" width="34" height="32">
      <rect x="8" y="5" width="23" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.5"/>
      <rect x="4" y="2" width="23" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <line x1="4" y1="10" x2="27" y2="10" stroke="#0f0f0e" stroke-width="1.4"/>
      <line x1="4" y1="16" x2="27" y2="16" stroke="#0f0f0e" stroke-width="1.4"/>
      <line x1="4" y1="22" x2="27" y2="22" stroke="#0f0f0e" stroke-width="1.4"/>
      <line x1="12" y1="2" x2="12" y2="28" stroke="#0f0f0e" stroke-width="1.4"/>
      <line x1="19" y1="2" x2="19" y2="28" stroke="#0f0f0e" stroke-width="1.4"/>
    </svg>
  `,

  // LisaGraph Stationery Pad
  padGraph: `
    <svg viewBox="0 0 38 36" width="34" height="32">
      <rect x="8" y="5" width="23" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.5"/>
      <rect x="4" y="2" width="23" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <rect x="8" y="16" width="4" height="8" fill="#0f0f0e"/>
      <rect x="14" y="10" width="4" height="14" fill="none" stroke="#0f0f0e" stroke-width="1.5"/>
      <rect x="20" y="7" width="4" height="17" fill="#0f0f0e"/>
      <line x1="6" y1="24" x2="25" y2="24" stroke="#0f0f0e" stroke-width="1.5"/>
    </svg>
  `,

  // LisaProject Stationery Pad (PERT boxes)
  padProject: `
    <svg viewBox="0 0 38 36" width="34" height="32">
      <rect x="8" y="5" width="23" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.5"/>
      <rect x="4" y="2" width="23" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <rect x="7" y="6" width="7" height="5" fill="#0f0f0e"/>
      <rect x="17" y="13" width="7" height="5" fill="none" stroke="#0f0f0e" stroke-width="1.5"/>
      <rect x="11" y="20" width="8" height="5" fill="#0f0f0e"/>
      <path d="M14 8 H20 V13 M20 18 V22 H19" fill="none" stroke="#0f0f0e" stroke-width="1.3"/>
    </svg>
  `,

  // LisaTerminal
  terminal: `
    <svg viewBox="0 0 38 34" width="34" height="30">
      <rect x="5" y="4" width="28" height="20" rx="2" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <rect x="9" y="8" width="20" height="12" fill="#0f0f0e"/>
      <path d="M12 12 L15 14 L12 16 M17 16 H22" stroke="#f5f4ed" stroke-width="1.5" fill="none"/>
      <rect x="10" y="26" width="18" height="4" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.5"/>
    </svg>
  `,

  // Calculator
  calculator: `
    <svg viewBox="0 0 34 36" width="30" height="32">
      <rect x="5" y="2" width="24" height="32" rx="2" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <rect x="8" y="5" width="18" height="7" fill="#0f0f0e"/>
      <rect x="8" y="15" width="4" height="4" fill="#0f0f0e"/>
      <rect x="15" y="15" width="4" height="4" fill="#0f0f0e"/>
      <rect x="22" y="15" width="4" height="4" fill="#0f0f0e"/>
      <rect x="8" y="21" width="4" height="4" fill="#0f0f0e"/>
      <rect x="15" y="21" width="4" height="4" fill="#0f0f0e"/>
      <rect x="22" y="21" width="4" height="10" fill="#0f0f0e"/>
      <rect x="8" y="27" width="11" height="4" fill="#0f0f0e"/>
    </svg>
  `,

  // Clipboard
  clipboard: `
    <svg viewBox="0 0 34 36" width="30" height="32">
      <rect x="6" y="5" width="22" height="28" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <rect x="12" y="2" width="10" height="5" fill="#0f0f0e"/>
      <line x1="10" y1="14" x2="24" y2="14" stroke="#0f0f0e" stroke-width="1.5"/>
      <line x1="10" y1="19" x2="24" y2="19" stroke="#0f0f0e" stroke-width="1.5"/>
      <line x1="10" y1="24" x2="19" y2="24" stroke="#0f0f0e" stroke-width="1.5"/>
    </svg>
  `,

  // Preferences
  preferences: `
    <svg viewBox="0 0 36 34" width="32" height="30">
      <rect x="4" y="4" width="28" height="26" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <line x1="9" y1="12" x2="27" y2="12" stroke="#0f0f0e" stroke-width="1.6"/>
      <rect x="18" y="9" width="5" height="6" fill="#0f0f0e"/>
      <line x1="9" y1="22" x2="27" y2="22" stroke="#0f0f0e" stroke-width="1.6"/>
      <rect x="12" y="19" width="5" height="6" fill="#0f0f0e"/>
    </svg>
  `,

  // LisaGuide
  lisaGuide: `
    <svg viewBox="0 0 36 34" width="32" height="30">
      <rect x="5" y="4" width="26" height="26" rx="3" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <rect x="13" y="9" width="10" height="14" rx="4" fill="none" stroke="#0f0f0e" stroke-width="1.8"/>
      <line x1="18" y1="9" x2="18" y2="15" stroke="#0f0f0e" stroke-width="1.6"/>
      <path d="M18 4 V9" stroke="#0f0f0e" stroke-width="1.4"/>
    </svg>
  `,

  // Iconic Lisa Wastebasket (slatted office wastebasket — NOT Mac Trash!)
  wastebasketEmpty: `
    <svg viewBox="0 0 34 36" width="32" height="34">
      <ellipse cx="17" cy="7" rx="11" ry="3.2" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <path d="M6 7 L9 32 H25 L28 7" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <line x1="12" y1="11" x2="13" y2="30" stroke="#0f0f0e" stroke-width="1.3"/>
      <line x1="17" y1="11" x2="17" y2="30" stroke="#0f0f0e" stroke-width="1.3"/>
      <line x1="22" y1="11" x2="21" y2="30" stroke="#0f0f0e" stroke-width="1.3"/>
      <line x1="8" y1="18" x2="26" y2="18" stroke="#0f0f0e" stroke-width="1.2"/>
      <line x1="9" y1="25" x2="25" y2="25" stroke="#0f0f0e" stroke-width="1.2"/>
    </svg>
  `,

  wastebasketFull: `
    <svg viewBox="0 0 34 36" width="32" height="34">
      <path d="M9 8 L13 2 L19 5 L24 3 L26 8 Z" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.6"/>
      <ellipse cx="17" cy="9" rx="11" ry="3" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <path d="M6 9 L9 33 H25 L28 9" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.8"/>
      <line x1="12" y1="13" x2="13" y2="31" stroke="#0f0f0e" stroke-width="1.3"/>
      <line x1="17" y1="13" x2="17" y2="31" stroke="#0f0f0e" stroke-width="1.3"/>
      <line x1="22" y1="13" x2="21" y2="31" stroke="#0f0f0e" stroke-width="1.3"/>
    </svg>
  `,

  // Mini titlebar document icon (clicking/closing puts away window)
  miniDoc: `
    <svg viewBox="0 0 12 12" width="11" height="11">
      <path d="M2 1 H8 L10 3 V11 H2 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
      <path d="M8 1 V3 H10" fill="none" stroke="currentColor" stroke-width="1.2"/>
    </svg>
  `,

  // Cursors: Arrow, Lisa Hourglass (iconic!), I-Beam, Crosshair
  cursorArrow: `
    <svg viewBox="0 0 18 22" width="16" height="20">
      <path d="M1 1 L1 17 L5 13.4 L8.2 19.6 L10.8 18.4 L7.6 12.2 L13.2 12.2 Z" fill="#0f0f0e" stroke="#f5f4ed" stroke-width="1.6"/>
    </svg>
  `,

  cursorHourglass: `
    <svg viewBox="0 0 18 22" width="16" height="20">
      <rect x="2" y="1" width="14" height="2.5" fill="#0f0f0e" stroke="#f5f4ed" stroke-width="0.8"/>
      <rect x="2" y="18.5" width="14" height="2.5" fill="#0f0f0e" stroke="#f5f4ed" stroke-width="0.8"/>
      <path d="M4 3.5 L9 11 L4 18.5 H14 L9 11 L14 3.5 Z" fill="#f5f4ed" stroke="#0f0f0e" stroke-width="1.6"/>
      <path d="M6.5 5.5 H11.5 L9 9.2 Z" fill="#0f0f0e"/>
      <path d="M7 17 H11 L9 14 Z" fill="#0f0f0e"/>
    </svg>
  `,

  cursorIbeam: `
    <svg viewBox="0 0 14 20" width="13" height="18">
      <path d="M3 2 H11 M7 2 V18 M3 18 H11" stroke="#0f0f0e" stroke-width="1.8" fill="none"/>
    </svg>
  `,

  cursorCross: `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <path d="M9 1 V17 M1 9 H17" stroke="#0f0f0e" stroke-width="2" fill="none"/>
    </svg>
  `,
};
