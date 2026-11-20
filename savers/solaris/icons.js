/** Original CDE-style glyphs. Not Sun or Oracle trademarks. */

export function iconSvg(name) {
  const paths = {
    folder:
      '<path d="M4 10h10l2 2h12v14H4V10z" fill="#e6c15a" stroke="#5a4718" stroke-width="1.4"/><path d="M4 14h24v12H4z" fill="#f0d78a" stroke="#5a4718" stroke-width="1.2"/>',
    doc:
      '<path d="M8 4h11l6 6v18H8V4z" fill="#fff" stroke="#2a3340" stroke-width="1.4"/><path d="M19 4v6h6" fill="none" stroke="#2a3340" stroke-width="1.4"/><path d="M11 16h10M11 20h10M11 24h7" stroke="#5c6b7c" stroke-width="1.3"/>',
    note:
      '<path d="M7 5h14l5 5v18H7V5z" fill="#fff7d6" stroke="#2a3340" stroke-width="1.4"/><path d="M21 5v5h5" fill="none" stroke="#2a3340" stroke-width="1.4"/><path d="M11 16h10M11 20h8" stroke="#6a5a28" stroke-width="1.3"/>',
    mail:
      '<rect x="4" y="8" width="24" height="16" rx="1" fill="#f4f7fb" stroke="#2a3340" stroke-width="1.4"/><path d="M4 9l12 9 12-9" fill="none" stroke="#2a5f99" stroke-width="1.6"/>',
    lock:
      '<rect x="8" y="14" width="16" height="12" rx="1" fill="#d5dde6" stroke="#2a3340" stroke-width="1.4"/><path d="M11 14V11a5 5 0 0 1 10 0v3" fill="none" stroke="#2a3340" stroke-width="1.6"/><circle cx="16" cy="20" r="1.4" fill="#2a3340"/>',
    door:
      '<path d="M9 5h12v22H9z" fill="#f4f7fb" stroke="#2a3340" stroke-width="1.4"/><path d="M9 5l-3 2v20l3-2" fill="#d5dde6" stroke="#2a3340" stroke-width="1.2"/><circle cx="18" cy="16" r="1.2" fill="#2a3340"/>',
    printer:
      '<rect x="8" y="5" width="16" height="7" fill="#fff" stroke="#2a3340" stroke-width="1.3"/><rect x="5" y="12" width="22" height="10" rx="1" fill="#d5dde6" stroke="#2a3340" stroke-width="1.4"/><rect x="9" y="18" width="14" height="8" fill="#fff" stroke="#2a3340" stroke-width="1.2"/><circle cx="23" cy="16" r="1" fill="#2a3340"/>',
    style:
      '<rect x="5" y="7" width="9" height="9" fill="#6f93c4" stroke="#2a3340" stroke-width="1"/><rect x="16" y="7" width="9" height="9" fill="#e6c15a" stroke="#2a3340" stroke-width="1"/><rect x="5" y="18" width="9" height="8" fill="#7dae7a" stroke="#2a3340" stroke-width="1"/><rect x="16" y="18" width="9" height="8" fill="#d08a8a" stroke="#2a3340" stroke-width="1"/>',
    meter:
      '<rect x="4" y="6" width="24" height="20" fill="#0e141c" stroke="#2a3340" stroke-width="1.3"/><path d="M7 20l4-6 3 3 5-8 4 5" fill="none" stroke="#8fd18f" stroke-width="1.5"/>',
    help:
      '<path d="M8 6h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V8a2 2 0 0 1 2-2z" fill="#f4f7fb" stroke="#2a3340" stroke-width="1.3"/><path d="M16 6v16" stroke="#2a3340" stroke-width="1"/><text x="11" y="16" font-size="8" font-family="sans-serif" fill="#1a3d6e">?</text>',
    trash:
      '<path d="M10 10h12l-1 16H11L10 10z" fill="#d5dde6" stroke="#2a3340" stroke-width="1.3"/><path d="M8 9h16" stroke="#2a3340" stroke-width="1.6"/><path d="M13 7h6v2h-6z" fill="#b7c3d1" stroke="#2a3340" stroke-width="1.1"/><path d="M14 13v9M18 13v9" stroke="#5e6b78" stroke-width="1.2"/>',
    globe:
      '<circle cx="16" cy="16" r="10" fill="#2f6faf" stroke="#1a3348" stroke-width="1.4"/><ellipse cx="16" cy="16" rx="5" ry="10" fill="none" stroke="#d5e6f5" stroke-width="1.2"/><path d="M6 16h20M8 11h16M8 21h16" fill="none" stroke="#d5e6f5" stroke-width="1.1"/>',
  };
  const body = paths[name] || paths.doc;
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${body}</svg>`;
}
