/**
 * Crisp Classic Mac OS 9.2 SVG Icons, Cursors, and Retro Graphics
 */

export const ICONS = {
  rainbowApple: `
    <svg viewBox="0 0 18 20" width="14" height="16" shape-rendering="crispEdges">
      <defs>
        <clipPath id="apple-clip">
          <path d="M12.2 4.3c.9-1.1 1.4-2.5 1.2-3.9-1.3.1-2.8.9-3.7 2-.8.9-1.5 2.4-1.3 3.7 1.4.1 2.9-.7 3.8-1.8zM14.7 10.6c0-2.1 1.7-3.2 1.8-3.3-1-1.5-2.5-1.7-3.1-1.7-1.3-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.9-3.6 2.2-1.5 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 1.9-1.1 2.7-2.2.8-1.2 1.2-2.4 1.2-2.5-.1-.1-2.6-1-2.6-3.6z"/>
        </clipPath>
      </defs>
      <g clip-path="url(#apple-clip)">
        <rect x="0" y="0" width="18" height="7.5" fill="#61bb46"/>
        <rect x="0" y="7.5" width="18" height="2.4" fill="#fdb827"/>
        <rect x="0" y="9.9" width="18" height="2.4" fill="#f5821f"/>
        <rect x="0" y="12.3" width="18" height="2.4" fill="#e03a3e"/>
        <rect x="0" y="14.7" width="18" height="2.4" fill="#963d97"/>
        <rect x="0" y="17.1" width="18" height="3" fill="#009ddc"/>
      </g>
    </svg>
  `,

  finderFace: `
    <svg viewBox="0 0 32 32" width="32" height="32">
      <rect x="3" y="3" width="26" height="26" rx="2" fill="#88a8e8" stroke="#111" stroke-width="1.5"/>
      <path d="M16 4 H28 V28 H15 Q13 18 16 4 Z" fill="#d8e6ff"/>
      <path d="M16 4 Q13 14 15 19 H18" fill="none" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="10.5" y1="10" x2="10.5" y2="14" stroke="#111" stroke-width="2" stroke-linecap="round"/>
      <line x1="21.5" y1="10" x2="21.5" y2="14" stroke="#111" stroke-width="2" stroke-linecap="round"/>
      <path d="M9 21 Q16 26.5 23 21" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,

  macHd: `
    <svg viewBox="0 0 36 36" width="36" height="36">
      <path d="M5 12 L10 7 H26 L31 12 V27 H5 Z" fill="#d8dadf" stroke="#1a1a1a" stroke-width="1.3"/>
      <path d="M6 12 H30 V26 H6 Z" fill="#c7cbd4"/>
      <path d="M6 12 H30 V14 H6 Z" fill="#f5f6f8"/>
      <rect x="8" y="21" width="11" height="2.2" fill="#5b606b"/>
      <rect x="24" y="21.2" width="3.5" height="2" rx="0.6" fill="#4ad657" stroke="#1e5e25" stroke-width="0.6"/>
      <path d="M10 8 L26 8 L29.5 11.5 H6.5 Z" fill="#eceef2"/>
      <circle cx="17.5" cy="16.5" r="2.1" fill="#63639c" opacity="0.7"/>
    </svg>
  `,

  zipDisk: `
    <svg viewBox="0 0 36 36" width="36" height="36">
      <rect x="5" y="5" width="26" height="26" rx="2.5" fill="#2e59a8" stroke="#111" stroke-width="1.3"/>
      <rect x="10" y="5.5" width="16" height="8" fill="#d8dde6" stroke="#111" stroke-width="1"/>
      <rect x="19" y="7" width="4" height="5" fill="#4a5568"/>
      <rect x="9" y="16" width="18" height="12" rx="1" fill="#f7f7f2" stroke="#1f3b70" stroke-width="0.9"/>
      <line x1="11" y1="20" x2="25" y2="20" stroke="#c54336" stroke-width="1.6"/>
      <text x="18" y="26" text-anchor="middle" font-size="6.5" font-weight="bold" fill="#1e3c78" font-family="Helvetica, Arial, sans-serif">ZIP 100</text>
    </svg>
  `,

  folder: `
    <svg viewBox="0 0 36 36" width="36" height="36">
      <path d="M4 10 H14 L16.5 12.5 H32 V28 H4 Z" fill="#8faae0" stroke="#1c2740" stroke-width="1.3"/>
      <path d="M5 13 H31 V27 H5 Z" fill="#a8c0f0"/>
      <path d="M5 13 H31 V15 H5 Z" fill="#d4e3ff"/>
      <path d="M5 26 H31 V27.5 H5 Z" fill="#6f8bc7"/>
    </svg>
  `,

  systemFolder: `
    <svg viewBox="0 0 36 36" width="36" height="36">
      <path d="M4 10 H14 L16.5 12.5 H32 V28 H4 Z" fill="#8faae0" stroke="#1c2740" stroke-width="1.3"/>
      <path d="M5 13 H31 V27 H5 Z" fill="#a8c0f0"/>
      <path d="M5 13 H31 V15 H5 Z" fill="#d4e3ff"/>
      <rect x="13" y="16" width="10" height="9" rx="1" fill="#e5eeff" stroke="#1c2740" stroke-width="1"/>
      <circle cx="16.2" cy="19.3" r="0.8" fill="#1c2740"/>
      <circle cx="19.8" cy="19.3" r="0.8" fill="#1c2740"/>
      <path d="M15.8 22.3 Q18 23.8 20.2 22.3" fill="none" stroke="#1c2740" stroke-width="0.9"/>
    </svg>
  `,

  simpleTextDoc: `
    <svg viewBox="0 0 36 36" width="36" height="36">
      <path d="M8 4 H22 L28 10 V32 H8 Z" fill="#ffffff" stroke="#1a1a1a" stroke-width="1.3"/>
      <path d="M22 4 V10 H28" fill="#dfe4ec" stroke="#1a1a1a" stroke-width="1.1"/>
      <line x1="11.5" y1="14" x2="24.5" y2="14" stroke="#475569" stroke-width="1.4"/>
      <line x1="11.5" y1="18" x2="24.5" y2="18" stroke="#64748b" stroke-width="1.3"/>
      <line x1="11.5" y1="22" x2="21.5" y2="22" stroke="#64748b" stroke-width="1.3"/>
      <line x1="11.5" y1="26" x2="23.5" y2="26" stroke="#64748b" stroke-width="1.3"/>
      <path d="M23 23 L29.5 16.5 L31.5 18.5 L25 25 L22.5 25.5 Z" fill="#e5a93c" stroke="#1a1a1a" stroke-width="0.9"/>
    </svg>
  `,

  trashEmpty: `
    <svg viewBox="0 0 36 36" width="36" height="36">
      <rect x="9" y="7" width="18" height="3" rx="1" fill="#d9dde4" stroke="#1a1a1a" stroke-width="1.2"/>
      <rect x="14.5" y="4.5" width="7" height="2.6" rx="0.8" fill="#c7ccd4" stroke="#1a1a1a" stroke-width="1.1"/>
      <path d="M10 10 H26 L24.5 31 H11.5 Z" fill="#cfd4dc" stroke="#1a1a1a" stroke-width="1.3"/>
      <line x1="14" y1="13" x2="14.6" y2="28" stroke="#7d8491" stroke-width="1.4"/>
      <line x1="18" y1="13" x2="18" y2="28" stroke="#7d8491" stroke-width="1.4"/>
      <line x1="22" y1="13" x2="21.4" y2="28" stroke="#7d8491" stroke-width="1.4"/>
      <path d="M10.8 11 H13.5 L12.5 29.5 H11.8 Z" fill="#eef1f6" opacity="0.7"/>
    </svg>
  `,

  trashFull: `
    <svg viewBox="0 0 36 36" width="36" height="36">
      <path d="M10 10 L13 5 L18 7 L22 4.5 L26 9 L24 12 H11 Z" fill="#fffef5" stroke="#1a1a1a" stroke-width="1.1"/>
      <path d="M14 8 L17 9.5 M20 7.5 L22 10" stroke="#7c8594" stroke-width="0.9"/>
      <path d="M8.5 11 H27.5 L25.5 31.5 H10.5 Z" fill="#cfd4dc" stroke="#1a1a1a" stroke-width="1.3"/>
      <path d="M8.5 11 Q18 14 27.5 11" fill="none" stroke="#1a1a1a" stroke-width="1"/>
      <line x1="13.5" y1="14" x2="14.2" y2="28.5" stroke="#7d8491" stroke-width="1.4"/>
      <line x1="18" y1="14" x2="18" y2="28.5" stroke="#7d8491" stroke-width="1.4"/>
      <line x1="22.5" y1="14" x2="21.8" y2="28.5" stroke="#7d8491" stroke-width="1.4"/>
    </svg>
  `,

  sherlock: `
    <svg viewBox="0 0 32 32" width="24" height="24">
      <circle cx="14" cy="14" r="9" fill="#d7ecff" stroke="#1a1a1a" stroke-width="1.8"/>
      <circle cx="14" cy="14" r="6.2" fill="#eef7ff" stroke="#5d8fc9" stroke-width="1"/>
      <line x1="20.5" y1="20.5" x2="28" y2="28" stroke="#5c3a21" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M7 9 Q14 3 21 9 Q14 11 7 9 Z" fill="#8b6b43" stroke="#1a1a1a" stroke-width="1"/>
    </svg>
  `,

  netscape: `
    <svg viewBox="0 0 32 32" width="24" height="24">
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#0d4e5a" stroke="#111" stroke-width="1.4"/>
      <rect x="2" y="21" width="28" height="9" rx="2" fill="#082e38"/>
      <path d="M9 22 V10 L21 22 V10" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="square" stroke-linejoin="bevel"/>
      <path d="M5 24 Q16 20 27 24" fill="none" stroke="#45d1c8" stroke-width="1.5"/>
    </svg>
  `,

  aim: `
    <svg viewBox="0 0 32 32" width="22" height="22">
      <circle cx="16" cy="7.5" r="3.6" fill="#ffd426" stroke="#1a1a1a" stroke-width="1.3"/>
      <path d="M16 12 L12 19 L7 18 M16 12 L22 15 L25 12 M13 19 L10 27 M17 19 L23 26" fill="none" stroke="#ffd426" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 12 L12 19 L7 18 M16 12 L22 15 L25 12 M13 19 L10 27 M17 19 L23 26" fill="none" stroke="#1a1a1a" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  outlook: `
    <svg viewBox="0 0 32 32" width="22" height="22">
      <rect x="3" y="7" width="26" height="18" rx="1.5" fill="#f7f9fc" stroke="#1a1a1a" stroke-width="1.4"/>
      <path d="M3.5 8 L16 17 L28.5 8" fill="none" stroke="#2d63b8" stroke-width="1.8"/>
      <path d="M3.5 24 L11.5 16 M28.5 24 L20.5 16" stroke="#94a3b8" stroke-width="1.2"/>
    </svg>
  `,

  paint: `
    <svg viewBox="0 0 32 32" width="22" height="22">
      <path d="M16 4 C9 4 4 9.5 4 16 C4 22.5 9.5 27 16 27 C18.5 27 20 25.5 20 23.8 C20 22.6 19 21.8 19 20.8 C19 19.8 20 19 21.5 19 H24 C26.8 19 28 17 28 14.5 C28 8.5 22.5 4 16 4 Z" fill="#e6cfa3" stroke="#1a1a1a" stroke-width="1.4"/>
      <circle cx="10.5" cy="12" r="2.2" fill="#e03a3e"/>
      <circle cx="16" cy="9.5" r="2.2" fill="#fdb827"/>
      <circle cx="21.5" cy="12" r="2.2" fill="#009ddc"/>
      <circle cx="10.5" cy="18.5" r="2.2" fill="#61bb46"/>
    </svg>
  `,

  caution: `
    <svg viewBox="0 0 36 36" width="34" height="34">
      <path d="M18 3 L34 32 H2 Z" fill="#ffd633" stroke="#1a1a1a" stroke-width="1.6" stroke-linejoin="round"/>
      <rect x="16.3" y="12" width="3.4" height="11" rx="1" fill="#1a1a1a"/>
      <circle cx="18" cy="27.2" r="2" fill="#1a1a1a"/>
    </svg>
  `,

  bomb: `
    <svg viewBox="0 0 40 40" width="38" height="38">
      <circle cx="18" cy="24" r="11.5" fill="#1e1e1e" stroke="#000" stroke-width="1.5"/>
      <circle cx="14" cy="20" r="2.8" fill="#555"/>
      <rect x="15" y="10.5" width="6" height="3.5" fill="#333" stroke="#000" stroke-width="1"/>
      <path d="M18 10.5 Q20 5 26 7 Q30 8.5 31 5" fill="none" stroke="#5a432b" stroke-width="2" stroke-linecap="round"/>
      <path d="M31 5 L34 2 M31 5 L35 6 M31 5 L29 1.5 M31 5 L33 9" stroke="#ff5500" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="31" cy="5" r="2" fill="#ffdd33"/>
    </svg>
  `,

  happyMac: `
    <svg viewBox="0 0 48 54" width="48" height="54">
      <rect x="4" y="3" width="40" height="48" rx="3" fill="#e6e6ec" stroke="#111" stroke-width="2"/>
      <rect x="9" y="8" width="30" height="23" rx="1.5" fill="#9fb6df" stroke="#111" stroke-width="1.6"/>
      <rect x="11" y="10" width="26" height="19" fill="#d7e6ff"/>
      <rect x="17" y="14" width="2.4" height="4.2" fill="#111"/>
      <rect x="28.6" y="14" width="2.4" height="4.2" fill="#111"/>
      <path d="M23 14 V20 H25.2" fill="none" stroke="#111" stroke-width="1.6"/>
      <path d="M17.5 23.5 Q24 27.5 30.5 23.5" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round"/>
      <rect x="25" y="38" width="13" height="2.4" fill="#333"/>
      <rect x="9" y="38" width="6" height="2.4" fill="#888"/>
      <rect x="9" y="45" width="30" height="2" fill="#b4b8c2"/>
    </svg>
  `,

  quicktime: `
    <svg viewBox="0 0 32 32" width="22" height="22">
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#1c4fbf" stroke="#111" stroke-width="1.4"/>
      <circle cx="16" cy="16" r="7.2" fill="none" stroke="#fff" stroke-width="1.8"/>
      <path d="M14.2 12.4 L21.2 16 L14.2 19.6 Z" fill="#fff"/>
    </svg>
  `,

  soundjam: `
    <svg viewBox="0 0 32 32" width="22" height="22">
      <circle cx="15" cy="17" r="11" fill="#e4e8f2" stroke="#111" stroke-width="1.4"/>
      <circle cx="15" cy="17" r="3.2" fill="#f7f8fb" stroke="#111" stroke-width="1.2"/>
      <circle cx="15" cy="17" r="1.2" fill="#111"/>
      <path d="M15 6.2 A10.6 10.6 0 0 1 25.2 15" fill="none" stroke="#2e59a8" stroke-width="2"/>
      <path d="M19.5 18.2 V9.2 L26.2 7.6 V16.2" fill="#2e59a8" stroke="#111" stroke-width="1"/>
    </svg>
  `,

  scrapbook: `
    <svg viewBox="0 0 32 32" width="22" height="22">
      <rect x="8" y="3.5" width="17" height="25" rx="1.2" fill="#f6f3ea" stroke="#111" stroke-width="1.3"/>
      <path d="M8 8 H5.5 M8 13 H5.5 M8 18 H5.5 M8 23 H5.5" stroke="#6d6254" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M12 10 H21 M12 14 H21 M12 18 H17" stroke="#5c6d8c" stroke-width="1.3" stroke-linecap="round"/>
      <rect x="12" y="21" width="8" height="4" fill="#f0c24b" stroke="#111" stroke-width="0.8"/>
    </svg>
  `,

  diskFirstAid: `
    <svg viewBox="0 0 32 32" width="22" height="22">
      <rect x="5" y="4" width="22" height="24" rx="2" fill="#f7f7f7" stroke="#111" stroke-width="1.3"/>
      <rect x="14" y="8.5" width="4" height="15" rx="0.6" fill="#d23b3b"/>
      <rect x="8.5" y="14" width="15" height="4" rx="0.6" fill="#d23b3b"/>
    </svg>
  `,

  cursorArrow: `
    <svg viewBox="0 0 18 22" width="16" height="20">
      <path d="M1 1 L1 16.5 L4.8 13 L7.6 19.2 L10.3 18 L7.5 11.8 L12.5 11.8 Z" fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="miter"/>
    </svg>
  `,

  cursorIBeam: `
    <svg viewBox="0 0 14 20" width="12" height="18">
      <path d="M3 2 H11 M3 18 H11 M7 2 V18" stroke="#fff" stroke-width="3.2" stroke-linecap="square"/>
      <path d="M3 2 H11 M3 18 H11 M7 2 V18" stroke="#000" stroke-width="1.4" stroke-linecap="square"/>
    </svg>
  `,

  cursorWatch: `
    <svg viewBox="0 0 18 22" width="16" height="20">
      <rect x="5" y="1" width="8" height="4" fill="#111" stroke="#fff" stroke-width="1"/>
      <rect x="5" y="17" width="8" height="4" fill="#111" stroke="#fff" stroke-width="1"/>
      <circle cx="9" cy="11" r="6.8" fill="#fff" stroke="#111" stroke-width="1.5"/>
      <line x1="9" y1="11" x2="9" y2="6.5" stroke="#111" stroke-width="1.5"/>
      <line x1="9" y1="11" x2="12.5" y2="12.5" stroke="#111" stroke-width="1.3"/>
    </svg>
  `,

  flyingToaster: `
    <svg viewBox="0 0 84 64" width="84" height="64">
      <!-- Back wing -->
      <path class="toaster-wing-back" d="M22 24 C10 10 2 12 4 22 C8 25 14 27 22 28 Z" fill="#f2f4f8" stroke="#111" stroke-width="1.5"/>
      <!-- Toaster body -->
      <path d="M22 22 C22 14 30 10 42 10 C54 10 62 14 62 22 V46 C62 49 59 51 55 51 H29 C25 51 22 49 22 46 Z" fill="#d2d7e0" stroke="#111" stroke-width="2"/>
      <path d="M26 22 C26 16 32 13 42 13 C52 13 58 16 58 22 V44 H26 Z" fill="#eef1f6"/>
      <!-- Slots -->
      <rect x="31" y="14" width="8" height="4" rx="1.5" fill="#222"/>
      <rect x="44" y="14" width="8" height="4" rx="1.5" fill="#222"/>
      <!-- Chrome shine -->
      <path d="M29 22 V43" stroke="#fff" stroke-width="3" opacity="0.9"/>
      <path d="M55 22 V43" stroke="#9ba3b0" stroke-width="2.5"/>
      <!-- Lever -->
      <rect x="62" y="30" width="8" height="4" rx="1.5" fill="#222"/>
      <!-- Front wing -->
      <path class="toaster-wing-front" d="M36 28 C20 12 8 18 11 29 C16 34 26 36 37 35 Z" fill="#ffffff" stroke="#111" stroke-width="1.6"/>
      <path class="toaster-wing-front" d="M16 25 L31 30 M19 29 L33 32" stroke="#aab3c2" stroke-width="1.2"/>
    </svg>
  `,

  flyingToast: `
    <svg viewBox="0 0 46 42" width="46" height="42">
      <path d="M9 14 C6 8 11 4 23 4 C35 4 40 8 37 14 V35 C37 37 35 38 32 38 H14 C11 38 9 37 9 35 Z" fill="#b86b2b" stroke="#2a1608" stroke-width="1.8"/>
      <path d="M12 14 C10 10 14 7 23 7 C32 7 36 10 34 14 V34 H12 Z" fill="#e6b667"/>
      <rect x="19" y="16" width="9" height="8" rx="1.5" fill="#fff099" transform="rotate(-12 23 20)"/>
    </svg>
  `,

  csDisplay: `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <rect x="2" y="2.5" width="14" height="10.5" rx="1.2" fill="#e6e7ec" stroke="#111" stroke-width="1.1"/>
      <rect x="3.8" y="4.2" width="10.4" height="7" fill="#6d8fd1" stroke="#243861" stroke-width="0.8"/>
      <path d="M5 9.8 L9.5 5.4 L12.5 5.4 L8 9.8 Z" fill="#b9d1ff" opacity="0.7"/>
      <rect x="6.5" y="13.2" width="5" height="1.6" fill="#9ca2ad" stroke="#111" stroke-width="0.8"/>
      <rect x="4.5" y="14.8" width="9" height="1.4" fill="#cfd3dc" stroke="#111" stroke-width="0.8"/>
    </svg>
  `,

  csColors: `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <rect x="2" y="2.5" width="14" height="12.5" rx="1" fill="#fff" stroke="#111" stroke-width="1.1"/>
      <rect x="3" y="3.5" width="2.4" height="10.5" fill="#61bb46"/>
      <rect x="5.4" y="3.5" width="2.4" height="10.5" fill="#fdb827"/>
      <rect x="7.8" y="3.5" width="2.4" height="10.5" fill="#f5821f"/>
      <rect x="10.2" y="3.5" width="2.4" height="10.5" fill="#e03a3e"/>
      <rect x="12.6" y="3.5" width="2.4" height="10.5" fill="#009ddc"/>
    </svg>
  `,

  csAppleTalk: `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <rect x="2" y="3" width="6.5" height="6" rx="0.8" fill="#e5e8ef" stroke="#111" stroke-width="1"/>
      <rect x="3.2" y="4.2" width="4.1" height="3.2" fill="#9bc2f5"/>
      <rect x="9.5" y="3" width="6.5" height="6" rx="0.8" fill="#e5e8ef" stroke="#111" stroke-width="1"/>
      <rect x="10.7" y="4.2" width="4.1" height="3.2" fill="#9bc2f5"/>
      <path d="M5.2 9 V13.5 H12.8 V9" fill="none" stroke="#2c56b0" stroke-width="1.5"/>
      <circle cx="9" cy="13.5" r="1.6" fill="#4ad657" stroke="#111" stroke-width="0.8"/>
    </svg>
  `,

  csSharing: `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <path d="M2.5 5 H7.2 L8.6 6.4 H15.5 V13.5 H2.5 Z" fill="#8faae0" stroke="#111" stroke-width="1"/>
      <path d="M3.2 7 H14.8 V12.8 H3.2 Z" fill="#b4caf5"/>
      <path d="M6 15.4 H12 M9 13.5 V15.4" stroke="#111" stroke-width="1.2"/>
      <circle cx="9" cy="10" r="1.5" fill="#fff" stroke="#1c2740" stroke-width="0.8"/>
    </svg>
  `,

  csCd: `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <circle cx="9" cy="9" r="6.8" fill="#dfe5f2" stroke="#111" stroke-width="1.1"/>
      <path d="M9 2.6 A6.4 6.4 0 0 1 15 7.5 L10.8 8.4 A2 2 0 0 0 9 7 Z" fill="#7ec8ff" opacity="0.85"/>
      <path d="M9 15.4 A6.4 6.4 0 0 1 3 10.5 L7.2 9.6 A2 2 0 0 0 9 11 Z" fill="#f3a6d8" opacity="0.85"/>
      <circle cx="9" cy="9" r="2" fill="#fff" stroke="#111" stroke-width="0.9"/>
    </svg>
  `,

  csLocation: `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <path d="M9 2.4 L15.4 7.8 H13.5 V14.8 H4.5 V7.8 H2.6 Z" fill="#f4e6c1" stroke="#111" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M9 2.4 L15.4 7.8 H2.6 Z" fill="#c8533b" stroke="#111" stroke-width="1"/>
      <rect x="7.5" y="10" width="3" height="4.8" fill="#6b4b32" stroke="#111" stroke-width="0.8"/>
    </svg>
  `,

  csEnergy: `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <path d="M9 2.2 C6.2 2.2 4.3 4.2 4.3 6.8 C4.3 8.6 5.4 9.8 6.4 11.2 V12.6 H11.6 V11.2 C12.6 9.8 13.7 8.6 13.7 6.8 C13.7 4.2 11.8 2.2 9 2.2 Z" fill="#ffe159" stroke="#111" stroke-width="1.1"/>
      <rect x="6.5" y="12.6" width="5" height="2.6" rx="0.6" fill="#bfc5cf" stroke="#111" stroke-width="0.9"/>
      <line x1="7.5" y1="6.8" x2="10.5" y2="6.8" stroke="#c97a00" stroke-width="1.1"/>
    </svg>
  `,
};

export function csSoundIcon(level = 5) {
  const waves =
    level <= 0
      ? `<path d="M11.2 6.2 L15.2 11.8 M15.2 6.2 L11.2 11.8" stroke="#c52828" stroke-width="1.5" stroke-linecap="round"/>`
      : `
        ${level >= 1 ? '<path d="M10.8 7.2 Q12.3 9 10.8 10.8" fill="none" stroke="#111" stroke-width="1.2" stroke-linecap="round"/>' : ''}
        ${level >= 4 ? '<path d="M12.6 5.4 Q15 9 12.6 12.6" fill="none" stroke="#111" stroke-width="1.2" stroke-linecap="round"/>' : ''}
        ${level >= 6 ? '<path d="M14.4 3.8 Q17.4 9 14.4 14.2" fill="none" stroke="#2c56b0" stroke-width="1.2" stroke-linecap="round"/>' : ''}
      `;
  return `
    <svg viewBox="0 0 18 18" width="16" height="16">
      <path d="M2.2 6.8 H5.2 L9 3.6 V14.4 L5.2 11.2 H2.2 Z" fill="#cfd5df" stroke="#111" stroke-width="1.1" stroke-linejoin="round"/>
      ${waves}
    </svg>
  `;
}
