/**
 * Classic Mac OS 9.2 Desktop Patterns & Platinum Highlight Colors
 * Pure SVG data-URI tiles so they render razor-sharp at any resolution with zero external assets.
 */

function svgTile(svg) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg.trim())}")`;
}

export const DESKTOP_PATTERNS = [
  {
    id: 'macos-default',
    name: 'Mac OS Default',
    swatch: '#63639c',
    backgroundColor: '#63639c',
    backgroundImage: svgTile(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#63639c"/>
        <path d="M0 16 L16 0 L32 16 L16 32 Z" fill="#6e6eaa" opacity="0.72"/>
        <path d="M4 16 L16 4 L28 16 L16 28 Z" fill="#59598f" opacity="0.6"/>
        <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="#7777b5" opacity="0.55"/>
        <rect x="15" y="15" width="2" height="2" fill="#8b8bc8"/>
        <rect x="0" y="0" width="2" height="2" fill="#8b8bc8"/>
        <path d="M0 0 L32 32 M32 0 L0 32" stroke="#4f4f82" stroke-width="1" opacity="0.35"/>
      </svg>
    `),
    backgroundSize: '32px 32px',
  },
  {
    id: 'bondi',
    name: 'Bondi iMac',
    swatch: '#2c868e',
    backgroundColor: '#2a7f87',
    backgroundImage: svgTile(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <rect width="24" height="24" fill="#2a7f87"/>
        <path d="M0 0 H24 V2 H0 Z M0 12 H24 V14 H0 Z" fill="#35929b" opacity="0.55"/>
        <path d="M0 0 V24 H2 V0 Z M12 0 V24 H14 V0 Z" fill="#226e75" opacity="0.45"/>
        <rect x="4" y="4" width="6" height="6" fill="#3c9da6" opacity="0.35"/>
        <rect x="16" y="16" width="6" height="6" fill="#3c9da6" opacity="0.35"/>
      </svg>
    `),
    backgroundSize: '24px 24px',
  },
  {
    id: 'azul',
    name: 'Azul Wave',
    swatch: '#3a6ea5',
    backgroundColor: '#3a6ea5',
    backgroundImage: svgTile(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <rect width="36" height="36" fill="#3a6ea5"/>
        <path d="M0 9 Q9 3 18 9 T36 9" fill="none" stroke="#4f85be" stroke-width="2" opacity="0.65"/>
        <path d="M0 21 Q9 15 18 21 T36 21" fill="none" stroke="#2f5d8f" stroke-width="2" opacity="0.55"/>
        <path d="M0 33 Q9 27 18 33 T36 33" fill="none" stroke="#5a90c7" stroke-width="1.5" opacity="0.5"/>
        <circle cx="9" cy="15" r="1.5" fill="#6ea5db" opacity="0.45"/>
        <circle cx="27" cy="27" r="1.5" fill="#6ea5db" opacity="0.45"/>
      </svg>
    `),
    backgroundSize: '36px 36px',
  },
  {
    id: 'graphite',
    name: 'Graphite Pro',
    swatch: '#6b717a',
    backgroundColor: '#696f78',
    backgroundImage: svgTile(`
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <rect width="16" height="16" fill="#696f78"/>
        <rect x="0" y="0" width="8" height="8" fill="#737983" opacity="0.6"/>
        <rect x="8" y="8" width="8" height="8" fill="#737983" opacity="0.6"/>
        <path d="M0 0 L16 16" stroke="#5b6169" stroke-width="1" opacity="0.5"/>
        <rect x="3" y="3" width="2" height="2" fill="#828994" opacity="0.5"/>
        <rect x="11" y="11" width="2" height="2" fill="#828994" opacity="0.5"/>
      </svg>
    `),
    backgroundSize: '16px 16px',
  },
  {
    id: 'quantum',
    name: 'Quantum Foam',
    swatch: '#4d4c7d',
    backgroundColor: '#484775',
    backgroundImage: svgTile(`
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
        <rect width="28" height="28" fill="#484775"/>
        <circle cx="7" cy="7" r="5" fill="none" stroke="#616099" stroke-width="1.5" opacity="0.65"/>
        <circle cx="21" cy="21" r="5" fill="none" stroke="#616099" stroke-width="1.5" opacity="0.65"/>
        <circle cx="21" cy="7" r="2.5" fill="#5b5a91" opacity="0.55"/>
        <circle cx="7" cy="21" r="2.5" fill="#3a3961" opacity="0.55"/>
      </svg>
    `),
    backgroundSize: '28px 28px',
  },
  {
    id: 'platinum-tiles',
    name: 'Platinum Slate',
    swatch: '#7e8b9c',
    backgroundColor: '#7b8899',
    backgroundImage: svgTile(`
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <rect width="20" height="20" fill="#7b8899"/>
        <path d="M0 0 H20 V1 H1 V20 H0 Z" fill="#8e9cad" opacity="0.6"/>
        <path d="M19 0 H20 V20 H0 V19 H19 Z" fill="#677485" opacity="0.55"/>
      </svg>
    `),
    backgroundSize: '20px 20px',
  },
];

export const HIGHLIGHT_COLORS = [
  { id: 'lavender', name: 'Mac OS Lavender', color: '#6666cc', text: '#ffffff', soft: '#ccccff' },
  { id: 'blue', name: 'Blueberry', color: '#2e64c5', text: '#ffffff', soft: '#b8d2ff' },
  { id: 'graphite', name: 'Graphite', color: '#5f6773', text: '#ffffff', soft: '#cfd5de' },
  { id: 'strawberry', name: 'Strawberry', color: '#c44569', text: '#ffffff', soft: '#f8c6d4' },
  { id: 'tangerine', name: 'Tangerine', color: '#d47420', text: '#ffffff', soft: '#ffe0bd' },
  { id: 'lime', name: 'Lime', color: '#4d913c', text: '#ffffff', soft: '#cbe8c3' },
];
