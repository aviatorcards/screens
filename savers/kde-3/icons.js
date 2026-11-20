/** Original KDE 3-era glyphs. Not the KDE gear trademark. */

export const KMARK = `<svg viewBox="0 0 64 64" aria-hidden="true">
  <circle cx="32" cy="32" r="28" fill="#2d6ec2" stroke="#163e78" stroke-width="3"/>
  <ellipse cx="26" cy="22" rx="14" ry="9" fill="#fff" opacity="0.22"/>
  <path d="M24 16 V48 M24 32 L44 16 M24 32 L44 48" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const ICONS = {
  k: KMARK,
  folder: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M4 11 H13 L15.2 13.4 H28 V25.5 H4Z" fill="#7eb0e6" stroke="#1d3f68" stroke-width="1.2"/>
    <path d="M4 15 H28 V25.5 H4Z" fill="#d7ebff" stroke="#1d3f68" stroke-width="1.1"/>
    <path d="M7 15 H24" stroke="#fff" stroke-width="1.4" opacity="0.7"/>
  </svg>`,
  trash: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M9 11 H23 L21.2 27 H10.8Z" fill="#d5dbe3" stroke="#243140" stroke-width="1.2"/>
    <path d="M8 10 H24" stroke="#243140" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M13 7.5 H19 V10 H13Z" fill="#9aa8b8" stroke="#243140" stroke-width="1"/>
    <path d="M13 15 V23 M16.5 15 V23 M20 15 V23" stroke="#5c6b7c" stroke-width="1.1"/>
  </svg>`,
  text: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M7 4 H18 L25 11 V28 H7Z" fill="#fff" stroke="#243140" stroke-width="1.2"/>
    <path d="M18 4 V11 H25" fill="#d5e6f8" stroke="#243140" stroke-width="1"/>
    <path d="M11 16 H21 M11 20 H21 M11 24 H16" stroke="#3d4e62" stroke-width="1.3"/>
    <path d="M19 20 L25 26" stroke="#2d6ec2" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,
  html: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M7 4 H18 L25 11 V28 H7Z" fill="#fff" stroke="#243140" stroke-width="1.2"/>
    <path d="M18 4 V11 H25" fill="#d5e6f8" stroke="#243140" stroke-width="1"/>
    <circle cx="16" cy="20" r="5.2" fill="#3c86c8" stroke="#163e78" stroke-width="1"/>
    <path d="M11.2 20 H20.8 M16 15 C17.6 16.6 17.6 23.4 16 25 M16 15 C14.4 16.6 14.4 23.4 16 25" stroke="#fff" stroke-width="0.9" fill="none"/>
  </svg>`,
  browser: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="11" fill="#3c86c8" stroke="#163e78" stroke-width="1.3"/>
    <path d="M6 16 H26 M16 5.5 C20.2 9.2 20.2 22.8 16 26.5 M16 5.5 C11.8 9.2 11.8 22.8 16 26.5" stroke="#eaf5ff" stroke-width="1.15" fill="none"/>
    <circle cx="16" cy="16" r="3.2" fill="#eaf5ff" opacity="0.35"/>
  </svg>`,
  terminal: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="3" y="5" width="26" height="20" rx="2" fill="#1b1f24" stroke="#243140" stroke-width="1.2"/>
    <path d="M8 12 L13 16 L8 20" fill="none" stroke="#d5dde6" stroke-width="1.6"/>
    <path d="M15 20 H23" stroke="#d5dde6" stroke-width="1.6"/>
  </svg>`,
  calc: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="6" y="3" width="20" height="26" rx="3" fill="#e7eef5" stroke="#243140" stroke-width="1.2"/>
    <rect x="9" y="6" width="14" height="6" rx="1" fill="#d5e6d8" stroke="#243140" stroke-width="0.8"/>
    <path d="M10 16 H13 M19 16 H22 M10 20 H13 M19 20 H22 M10 24 H13 M19 24 H22" stroke="#243140" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  find: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="14" cy="14" r="7" fill="#eaf3fb" stroke="#163e78" stroke-width="2"/>
    <path d="M19.2 19.2 L26 26" stroke="#163e78" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,
  run: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="4" y="8" width="24" height="16" rx="3" fill="#e7eef5" stroke="#243140" stroke-width="1.2"/>
    <path d="M9 14 L13 17 L9 20" fill="none" stroke="#163e78" stroke-width="1.6"/>
    <path d="M15 20 H23" stroke="#163e78" stroke-width="1.6"/>
  </svg>`,
  lock: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="8" y="14" width="16" height="12" rx="2" fill="#d5dbe3" stroke="#243140" stroke-width="1.2"/>
    <path d="M11 14 V11 a5 5 0 0 1 10 0 V14" fill="none" stroke="#243140" stroke-width="1.6"/>
  </svg>`,
  back: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M20 7 L10 16 L20 25" fill="none" stroke="#163e78" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  logout: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M6 7 H16 V11 H14 V9 H8 V23 H14 V21 H16 V25 H6Z" fill="#d5dbe3" stroke="#243140" stroke-width="1.1"/>
    <path d="M15 16 H26 M22 12 L26 16 L22 20" fill="none" stroke="#163e78" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || ICONS.folder;
}
