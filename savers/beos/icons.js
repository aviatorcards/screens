/** BeOS Release 5 glyphs. Inline SVG, drawn to read at 16px and 32px. */

export const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true">
  <rect x="7" y="6" width="16" height="52" rx="4" fill="#2a4fd0"/>
  <path d="M22 8h11c9.5 0 16 5.6 16 13.2S42.2 34.4 33 34.4H22V8z" fill="#f04332"/>
  <path d="M22 32.2h13.5C46.2 32.2 54 38.2 54 46.6S46.4 61 36 61H22V32.2z" fill="#d21f22"/>
</svg>`;

const ICONS = {
  disk: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="7" width="24" height="18" rx="2" fill="#d5d8df" stroke="#2a2a2a" stroke-width="1.2"/>
    <rect x="6" y="9" width="20" height="10" fill="#8ea0b8"/>
    <rect x="7" y="10" width="18" height="8" fill="#243044"/>
    <circle cx="22" cy="21.5" r="1.3" fill="#ffe14a" stroke="#222" stroke-width="0.6"/>
    <rect x="8" y="20" width="8" height="2" rx="0.4" fill="#9aa3b2"/>
  </svg>`,
  folder: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M4 10h8l2 2h14v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" fill="#f0c020" stroke="#2a2a2a" stroke-width="1.2"/>
    <path d="M4 13h24v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V13z" fill="#ffe14a" stroke="#2a2a2a" stroke-width="1.2"/>
  </svg>`,
  trash: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M10 8h12l-1 16H11L10 8z" fill="#c5c8ce" stroke="#222" stroke-width="1.2"/>
    <path d="M8 8h16" stroke="#222" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M13 6h6v2h-6z" fill="#9aa0a8" stroke="#222" stroke-width="1"/>
    <path d="M14 12v8M18 12v8" stroke="#666" stroke-width="1"/>
  </svg>`,
  doc: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M8 4h11l6 6v18H8V4z" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <path d="M19 4v6h6" fill="#e6e6e6" stroke="#222" stroke-width="1.1"/>
    <path d="M11 16h10M11 19h10M11 22h7" stroke="#7a8494" stroke-width="1.1"/>
  </svg>`,
  html: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M8 4h11l6 6v18H8V4z" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <path d="M19 4v6h6" fill="#d9e6f5" stroke="#222" stroke-width="1.1"/>
    <circle cx="16" cy="20" r="4.2" fill="#3a7ca8" stroke="#222" stroke-width="1"/>
    <path d="M12.2 20h7.6M16 15.8c1.2 1.4 1.2 6.8 0 8.4M16 15.8c-1.2 1.4-1.2 6.8 0 8.4" stroke="#fff" stroke-width="0.8" fill="none"/>
  </svg>`,
  audio: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="6" y="6" width="20" height="20" rx="2" fill="#1c1c1c" stroke="#222" stroke-width="1.1"/>
    <path d="M10 18v-4l4-2v8l-4-2z" fill="#7dff9a"/>
    <path d="M16 13c2 1.2 2 4.8 0 6" stroke="#7dff9a" stroke-width="1.2" fill="none"/>
    <path d="M18 11c3 2 3 8 0 10" stroke="#3d7e4a" stroke-width="1.2" fill="none"/>
  </svg>`,
  stylededit: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="5" y="4" width="16" height="22" rx="1" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <path d="M8 10h10M8 14h10M8 18h7" stroke="#222" stroke-width="1.1"/>
    <path d="M18 18l8 8" stroke="#e23a2c" stroke-width="2" stroke-linecap="round"/>
    <path d="M16.5 19.5l3-1 6 6-2 2-6-6z" fill="#f0c020" stroke="#222" stroke-width="0.8"/>
  </svg>`,
  terminal: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="6" width="24" height="18" rx="2" fill="#f7f7f7" stroke="#222" stroke-width="1.2"/>
    <path d="M8 12l4 3-4 3" fill="none" stroke="#111" stroke-width="1.4"/>
    <path d="M14 18h7" stroke="#111" stroke-width="1.4"/>
  </svg>`,
  netpositive: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="10" fill="#3a7ca8" stroke="#222" stroke-width="1.2"/>
    <path d="M6 16h20M16 6c3 3.2 3 16.8 0 20M16 6c-3 3.2-3 16.8 0 20" stroke="#fff" stroke-width="1.1" fill="none"/>
    <path d="M8 12h16M8 20h16" stroke="#d6ecff" stroke-width="0.8" fill="none"/>
  </svg>`,
  mediaplayer: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="6" width="24" height="18" rx="2" fill="#222" stroke="#111" stroke-width="1.1"/>
    <path d="M13 11l8 5-8 5z" fill="#ffe14a"/>
  </svg>`,
  showimage: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="6" width="24" height="18" rx="1.5" fill="#fff" stroke="#222" stroke-width="1.2"/>
    <path d="M4 20l7-6 5 4 4-3 8 7" fill="#8fbf7a" stroke="#222" stroke-width="0.6"/>
    <circle cx="21" cy="11" r="2" fill="#ffe14a" stroke="#222" stroke-width="0.7"/>
  </svg>`,
  backgrounds: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="6" width="24" height="18" rx="1.5" fill="#3a7ca8" stroke="#222" stroke-width="1.2"/>
    <rect x="8" y="10" width="7" height="5" fill="#ffe14a" stroke="#222" stroke-width="0.7"/>
    <rect x="17" y="10" width="7" height="5" fill="#3d8f78" stroke="#222" stroke-width="0.7"/>
    <rect x="8" y="16.5" width="7" height="5" fill="#6a5a98" stroke="#222" stroke-width="0.7"/>
    <rect x="17" y="16.5" width="7" height="5" fill="#a07848" stroke="#222" stroke-width="0.7"/>
  </svg>`,
  screen: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="5" y="5" width="22" height="16" rx="1.5" fill="#d9dde4" stroke="#222" stroke-width="1.2"/>
    <rect x="7" y="7" width="18" height="12" fill="#24577a"/>
    <path d="M12 24h8M16 21v3" stroke="#222" stroke-width="1.3"/>
  </svg>`,
};

export const BOOT_ICONS = [
  `<svg viewBox="0 0 36 36" aria-hidden="true"><rect x="8" y="8" width="20" height="20" rx="2" fill="#d9dde6" stroke="#9ab"/><rect x="13" y="13" width="10" height="10" fill="#2a4fd0"/><path d="M8 12H5M8 18H4M8 24H5M28 12h3M28 18h4M28 24h3M12 8V5M18 8V4M24 8V5M12 28v3M18 28v4M24 28v3" stroke="#c5cad6" stroke-width="1.4"/></svg>`,
  `<svg viewBox="0 0 36 36" aria-hidden="true"><rect x="6" y="10" width="24" height="14" rx="1" fill="#2f6b3a" stroke="#9d9"/><rect x="9" y="13" width="8" height="8" fill="#111"/><rect x="20" y="14" width="7" height="2" fill="#d7c15a"/><rect x="20" y="18" width="7" height="2" fill="#888"/></svg>`,
  `<svg viewBox="0 0 36 36" aria-hidden="true"><rect x="5" y="9" width="26" height="18" rx="2" fill="#e4e7ee" stroke="#889"/><rect x="8" y="12" width="20" height="9" fill="#243044"/><circle cx="25" cy="24" r="1.6" fill="#6ec8ff"/></svg>`,
  `<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="10" fill="#f2f4f8" stroke="#99a"/><circle cx="18" cy="18" r="3" fill="#d0d4dc" stroke="#889"/><path d="M18 8a10 10 0 0 1 8 4" stroke="#7eb6ff" stroke-width="1.4" fill="none"/></svg>`,
  `<svg viewBox="0 0 36 36" aria-hidden="true"><rect x="5" y="6" width="26" height="18" rx="1.5" fill="#cfd3dc" stroke="#667"/><rect x="8" y="9" width="20" height="12" fill="#3a7ca8"/><path d="M13 28h10M18 24v4" stroke="#aab" stroke-width="1.6"/></svg>`,
  `<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="10" fill="#3c9a54"/><path d="M12 18.5l4 4 8-9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
];

export const DESKTOP_ICONS = [
  { id: 'volume', label: 'BeOS', icon: 'disk', x: 22, y: 36 },
  { id: 'trash', label: 'Trash', icon: 'trash', x: 22, y: 'end' },
];

export function iconSvg(name) {
  return ICONS[name] || ICONS.doc;
}
