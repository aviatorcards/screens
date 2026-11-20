/** Original GNOME 2.4-era glyphs. Not the GNOME foot trademark. */

export const FOOT = `<svg viewBox="0 0 64 64" aria-hidden="true">
  <ellipse cx="34" cy="40" rx="16" ry="14" fill="#3c4a28"/>
  <ellipse cx="16" cy="30" rx="5" ry="7" fill="#3c4a28"/>
  <ellipse cx="26" cy="20" rx="5" ry="8" fill="#3c4a28"/>
  <ellipse cx="38" cy="16" rx="4.6" ry="7.4" fill="#3c4a28"/>
  <ellipse cx="49" cy="22" rx="4.2" ry="6.2" fill="#3c4a28"/>
</svg>`;

const ICONS = {
  home: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M5 15 L16 6 L27 15 V27 H5Z" fill="#7eace0" stroke="#1c334c" stroke-width="1.3"/>
    <path d="M13 27 V18 H19 V27" fill="#f6f1e6" stroke="#1c334c" stroke-width="1.2"/>
  </svg>`,
  start: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" rx="4" fill="#efe8c8" stroke="#3c4a28" stroke-width="1.3"/>
    <ellipse cx="18" cy="20" rx="7" ry="6" fill="#3c4a28"/>
    <ellipse cx="10" cy="15" rx="2.1" ry="3" fill="#3c4a28"/>
    <ellipse cx="14.2" cy="11" rx="2" ry="3.2" fill="#3c4a28"/>
    <ellipse cx="19.2" cy="9.6" rx="1.8" ry="2.8" fill="#3c4a28"/>
    <ellipse cx="23.6" cy="12.4" rx="1.6" ry="2.4" fill="#3c4a28"/>
  </svg>`,
  trash: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M9 11 H23 L21.4 27 H10.6Z" fill="#c5c8ce" stroke="#222" stroke-width="1.2"/>
    <path d="M8 10 H24" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M13 8 H19 V10 H13Z" fill="#9aa0a8" stroke="#222" stroke-width="1"/>
    <path d="M13 15 V23 M16.5 15 V23 M20 15 V23" stroke="#666" stroke-width="1"/>
  </svg>`,
  folder: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M4 11 H13 L15 13 H28 V25 H4Z" fill="#e3b34a" stroke="#5a3e10" stroke-width="1.2"/>
    <path d="M4 15 H28 V25 H4Z" fill="#f0cb6a" stroke="#5a3e10" stroke-width="1.2"/>
  </svg>`,
  text: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M8 4 H19 L25 10 V28 H8Z" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <path d="M19 4 V10 H25" fill="#e6e6e6" stroke="#222" stroke-width="1"/>
    <path d="M11 15 H22 M11 19 H22 M11 23 H17" stroke="#5c6770" stroke-width="1.2"/>
  </svg>`,
  html: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M8 4 H19 L25 10 V28 H8Z" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <path d="M19 4 V10 H25" fill="#d5e4f5" stroke="#222" stroke-width="1"/>
    <circle cx="16" cy="20" r="5" fill="#3a7eb8" stroke="#17324a" stroke-width="1"/>
    <path d="M11.4 20 H20.6 M16 15.2 C17.4 16.8 17.4 23.2 16 24.8 M16 15.2 C14.6 16.8 14.6 23.2 16 24.8" stroke="#fff" stroke-width="0.9" fill="none"/>
  </svg>`,
  terminal: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="3" y="5" width="26" height="20" rx="2" fill="#f7f7f5" stroke="#222" stroke-width="1.2"/>
    <path d="M8 12 L13 16 L8 20" fill="none" stroke="#222" stroke-width="1.6"/>
    <path d="M15 20 H23" stroke="#222" stroke-width="1.6"/>
  </svg>`,
  calc: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="6" y="3" width="20" height="26" rx="2" fill="#d9d9d4" stroke="#222" stroke-width="1.2"/>
    <rect x="9" y="6" width="14" height="5" fill="#c9ddd0" stroke="#222" stroke-width="0.8"/>
    <path d="M10 15 H13 M19 15 H22 M10 19 H13 M19 19 H22 M10 23 H13 M19 23 H22" stroke="#333" stroke-width="1.4"/>
  </svg>`,
  browser: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="11" fill="#4e8ec4" stroke="#17324a" stroke-width="1.2"/>
    <path d="M5 16 H27 M16 5 C20 9 20 23 16 27 M16 5 C12 9 12 23 16 27" stroke="#fff" stroke-width="1.1" fill="none"/>
    <path d="M8 11 H24 M8 21 H24" stroke="#d6ecff" stroke-width="0.8" fill="none"/>
  </svg>`,
  prefs: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="6" width="24" height="20" rx="2" fill="#eceae4" stroke="#333" stroke-width="1.2"/>
    <path d="M8 12 H18 M8 17 H14 M8 22 H20" stroke="#5c6770" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="22" cy="12" r="2" fill="#4b6983"/>
    <circle cx="18" cy="17" r="2" fill="#4b6983"/>
    <circle cx="23" cy="22" r="2" fill="#4b6983"/>
  </svg>`,
  run: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="8" width="24" height="16" rx="2" fill="#f4f4f2" stroke="#222" stroke-width="1.2"/>
    <path d="M8 14 L12 17 L8 20" fill="none" stroke="#222" stroke-width="1.5"/>
    <path d="M14 20 H22" stroke="#222" stroke-width="1.5"/>
  </svg>`,
  search: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="14" cy="14" r="7" fill="none" stroke="#222" stroke-width="2"/>
    <path d="M19 19 L26 26" stroke="#222" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,
  lock: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="8" y="14" width="16" height="12" rx="2" fill="#d0d4da" stroke="#222" stroke-width="1.2"/>
    <path d="M11 14 V11 a5 5 0 0 1 10 0 V14" fill="none" stroke="#222" stroke-width="1.6"/>
    <circle cx="16" cy="20" r="1.4" fill="#222"/>
  </svg>`,
  logout: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M7 6 H16 V10 H14 V8 H9 V24 H14 V22 H16 V26 H7Z" fill="#d0d4da" stroke="#222" stroke-width="1.1"/>
    <path d="M15 16 H26 M22 12 L26 16 L22 20" fill="none" stroke="#222" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  back: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M20 7 L10 16 L20 25" fill="none" stroke="#223" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  up: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 8 L16 24 M16 8 L9 15 M16 8 L23 15" fill="none" stroke="#223" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  volume: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M6 13 H11 L17 8 V24 L11 19 H6Z" fill="#333"/>
    <path d="M20 12 C22 13.4 22 18.6 20 20" fill="none" stroke="#333" stroke-width="1.6"/>
    <path d="M23 9 C26.5 12 26.5 20 23 23" fill="none" stroke="#333" stroke-width="1.6"/>
  </svg>`,
  windows: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="5" y="7" width="14" height="11" fill="#f4f4f2" stroke="#222" stroke-width="1.2"/>
    <rect x="13" y="14" width="14" height="11" fill="#e4e4e0" stroke="#222" stroke-width="1.2"/>
  </svg>`,
  showdesk: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="6" width="24" height="16" rx="1" fill="#7eace0" stroke="#1c334c" stroke-width="1.2"/>
    <path d="M8 26 H24" stroke="#222" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M16 22 V26" stroke="#222" stroke-width="1.6"/>
  </svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || ICONS.folder;
}
