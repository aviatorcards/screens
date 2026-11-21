import { SCREENSAVERS, getSaverById } from './registry.js?v=26';

const SPEEDS = [0.75, 1, 1.5, 2];

const CYCLE_MS = 90_000;

const state = {
  activeId: null,
  activeInstance: null,
  paused: false,
  speedIndex: 1,
  muted: true,
  hudVisible: false,
  hudPinned: false,
  galleryOpen: false,
  cycling: false,
};

const els = {
  stage: document.getElementById('stage'),
  hud: document.getElementById('hud'),
  hudSaverName: document.getElementById('hud-saver-name'),
  hudActivity: document.getElementById('hud-activity'),
  btnGallery: document.getElementById('btn-gallery'),
  btnPause: document.getElementById('btn-pause'),
  iconPause: document.getElementById('icon-pause'),
  btnNext: document.getElementById('btn-next'),
  btnCycle: document.getElementById('btn-cycle'),
  btnSpeed: document.getElementById('btn-speed'),
  labelSpeed: document.getElementById('label-speed'),
  btnSpecial: document.getElementById('btn-special'),
  specialMenu: document.getElementById('special-menu'),
  btnSound: document.getElementById('btn-sound'),
  iconSound: document.getElementById('icon-sound'),
  btnFullscreen: document.getElementById('btn-fullscreen'),
  iconFullscreen: document.getElementById('icon-fullscreen'),
  hintToast: document.getElementById('hint-toast'),
  galleryBackdrop: document.getElementById('gallery-backdrop'),
  galleryGrid: document.getElementById('gallery-grid'),
  btnCloseGallery: document.getElementById('btn-close-gallery'),
  btnPlayAll: document.getElementById('btn-play-all'),
};

let hudHideTimer = null;
let cursorHideTimer = null;
let hintFallbackTimer = null;
let hintShown = false;
let hoverInHud = false;
let loadToken = 0;
let cycleTimer = null;
let cycleDue = 0;

function availableSavers() {
  return SCREENSAVERS.filter((saver) => saver.status === 'available');
}

function writeUrl() {
  const url = new URL(window.location.href);
  if (state.activeId) url.searchParams.set('saver', state.activeId);
  if (state.cycling) url.searchParams.set('cycle', '1');
  else url.searchParams.delete('cycle');
  window.history.replaceState({}, '', url);
}

function clearCycleTimer() {
  clearTimeout(cycleTimer);
  cycleTimer = null;
}

function armCycle() {
  clearCycleTimer();
  if (!state.cycling || availableSavers().length < 2) return;
  if (!cycleDue) cycleDue = performance.now() + CYCLE_MS;
  if (state.paused) return;
  const delay = Math.max(0, cycleDue - performance.now());
  cycleTimer = setTimeout(() => {
    cycleDue = 0;
    advanceCycle();
  }, delay);
}

function setCycling(on) {
  state.cycling = Boolean(on);
  cycleDue = state.cycling ? performance.now() + CYCLE_MS : 0;
  writeUrl();
  updateControlsUI();
  armCycle();
}

function toggleCycle() {
  setCycling(!state.cycling);
  showHud(2200);
}

async function advanceCycle() {
  if (!state.cycling || state.paused) {
    if (state.cycling) armCycle();
    return;
  }
  const list = availableSavers();
  if (list.length < 2) return;
  const index = list.findIndex((saver) => saver.id === state.activeId);
  const next = list[(index + 1) % list.length];
  await loadScreensaver(next.id);
  if (!state.cycling) return;
  cycleDue = 0;
  showHud(2400);
  armCycle();
}

function showHint() {
  if (hintShown || state.galleryOpen) return;
  hintShown = true;
  clearTimeout(hintFallbackTimer);
  setTimeout(() => els.hintToast.classList.add('visible'), 350);
  setTimeout(() => els.hintToast.classList.remove('visible'), 4600);
}

function showHud(temporaryMs = 2600) {
  state.hudVisible = true;
  els.hud.classList.add('visible');
  clearTimeout(hudHideTimer);
  if (temporaryMs && !hoverInHud && !state.hudPinned && !state.galleryOpen && els.specialMenu.hidden) {
    hudHideTimer = setTimeout(hideHud, temporaryMs);
  }
}

function hideHud() {
  if (hoverInHud || state.hudPinned || !els.specialMenu.hidden) return;
  state.hudVisible = false;
  els.hud.classList.remove('visible');
}

function wakeRealCursor() {
  document.body.classList.remove('cursor-hidden');
  clearTimeout(cursorHideTimer);
  if (!state.galleryOpen && !hoverInHud) {
    cursorHideTimer = setTimeout(() => {
      if (!state.galleryOpen && !hoverInHud && !state.hudVisible) {
        document.body.classList.add('cursor-hidden');
      }
    }, 2400);
  }
}

function updateControlsUI() {
  els.iconPause.textContent = state.paused ? '▶' : '❚❚';
  els.btnPause.classList.toggle('active', state.paused);

  const speed = SPEEDS[state.speedIndex];
  els.labelSpeed.textContent = `${speed}×`;

  els.iconSound.textContent = state.muted ? '🔇' : '🔊';
  els.btnSound.classList.toggle('active', !state.muted);

  const isFs = Boolean(document.fullscreenElement);
  els.btnFullscreen.classList.toggle('active', isFs);
  els.iconFullscreen.textContent = isFs ? '🗗' : '⛶';

  els.btnCycle.classList.toggle('active', state.cycling);
  els.btnCycle.setAttribute('aria-pressed', state.cycling ? 'true' : 'false');
  els.btnPlayAll.setAttribute('aria-pressed', state.cycling ? 'true' : 'false');
}

function renderGallery() {
  els.galleryGrid.innerHTML = '';
  for (const saver of SCREENSAVERS) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'saver-card';
    if (saver.id === state.activeId) card.classList.add('active');
    if (saver.status !== 'available') card.classList.add('coming-soon');

    const badgeText =
      saver.id === state.activeId
        ? 'Running'
        : saver.status === 'available'
          ? 'Ready'
          : 'Planned';

    card.innerHTML = `
      <div class="saver-thumb ${saver.thumbClass}">
        <span class="saver-badge ${saver.id === state.activeId ? 'live' : ''}">${badgeText}</span>
      </div>
      <div class="saver-body">
        <div class="saver-era">${saver.era}</div>
        <div class="saver-name">${saver.name}</div>
        <div class="saver-desc">${saver.description}</div>
      </div>
    `;

    if (saver.status === 'available') {
      card.addEventListener('click', async () => {
        closeGallery();
        setCycling(false);
        if (saver.id !== state.activeId) await loadScreensaver(saver.id);
      });
    } else {
      card.disabled = true;
    }

    els.galleryGrid.appendChild(card);
  }
}

function openGallery() {
  state.galleryOpen = true;
  els.specialMenu.hidden = true;
  document.body.classList.remove('cursor-hidden');
  renderGallery();
  els.galleryBackdrop.hidden = false;
}

function closeGallery() {
  state.galleryOpen = false;
  els.galleryBackdrop.hidden = true;
  wakeRealCursor();
}

function renderSpecialMenu(saverMeta) {
  const specials = saverMeta?.specials || [];
  els.specialMenu.innerHTML = specials
    .map((sp) => `<button data-special="${sp.key}">${sp.label}</button>`)
    .join('');
  els.btnSpecial.style.display = specials.length > 0 ? '' : 'none';
}

async function loadScreensaver(id) {
  const token = ++loadToken;
  const saverMeta = getSaverById(id);
  if (state.activeInstance) {
    try {
      state.activeInstance.unmount();
    } catch (err) {
      console.error('Error unmounting screensaver:', err);
    }
    state.activeInstance = null;
  }

  els.stage.innerHTML = '';
  state.activeId = saverMeta.id;
  els.hudSaverName.textContent = saverMeta.shortName;
  els.hudActivity.textContent = 'Starting up…';
  document.title = `Living OS Screensavers — ${saverMeta.name}`;
  els.specialMenu.hidden = true;
  renderSpecialMenu(saverMeta);
  writeUrl();

  const mod = await saverMeta.load();
  if (token !== loadToken) return;
  const instance = mod.createScreensaver();
  state.activeInstance = instance;

  instance.mount(els.stage, {
    speed: SPEEDS[state.speedIndex],
    paused: state.paused,
    muted: state.muted,
    onStatus: (text) => {
      els.hudActivity.textContent = text;
    },
    onReady: showHint,
  });

  writeUrl();
  renderGallery();
}

function togglePause() {
  state.paused = !state.paused;
  armCycle();
  state.activeInstance?.setPaused?.(state.paused);
  updateControlsUI();
}

function cycleSpeed(delta = 1) {
  state.speedIndex = (state.speedIndex + delta + SPEEDS.length) % SPEEDS.length;
  state.activeInstance?.setSpeed?.(SPEEDS[state.speedIndex]);
  updateControlsUI();
}

function toggleSound() {
  state.muted = !state.muted;
  state.activeInstance?.setMuted?.(state.muted);
  updateControlsUI();
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.warn('Fullscreen toggle unavailable:', err);
  }
  updateControlsUI();
}

function bindEvents() {
  // Show HUD when mouse approaches bottom edge
  window.addEventListener('mousemove', (e) => {
    wakeRealCursor();
    const nearBottom = window.innerHeight - e.clientY <= 84;
    if (nearBottom) {
      showHud(2800);
    } else if (!hoverInHud && state.hudVisible && els.specialMenu.hidden) {
      clearTimeout(hudHideTimer);
      hudHideTimer = setTimeout(hideHud, 1200);
    }
  });

  // Touch devices: tap near bottom reveals HUD
  window.addEventListener(
    'touchstart',
    (e) => {
      const y = e.touches?.[0]?.clientY ?? 0;
      if (window.innerHeight - y <= 120) {
        showHud(4000);
      }
    },
    { passive: true },
  );

  els.hud.addEventListener('mouseenter', () => {
    hoverInHud = true;
    clearTimeout(hudHideTimer);
    document.body.classList.remove('cursor-hidden');
  });

  els.hud.addEventListener('mouseleave', () => {
    hoverInHud = false;
    if (els.specialMenu.hidden) {
      hudHideTimer = setTimeout(hideHud, 1400);
    }
    wakeRealCursor();
  });

  els.btnGallery.addEventListener('click', openGallery);
  els.btnCloseGallery.addEventListener('click', closeGallery);
  els.galleryBackdrop.addEventListener('click', (e) => {
    if (e.target === els.galleryBackdrop) closeGallery();
  });

  els.btnPause.addEventListener('click', togglePause);
  els.btnNext.addEventListener('click', () => state.activeInstance?.nextScene?.());
  els.btnCycle.addEventListener('click', toggleCycle);
  els.btnPlayAll.addEventListener('click', () => {
    closeGallery();
    if (!state.cycling) toggleCycle();
    else showHud(2200);
  });
  els.btnSpeed.addEventListener('click', () => cycleSpeed(1));
  els.btnSound.addEventListener('click', toggleSound);
  els.btnFullscreen.addEventListener('click', toggleFullscreen);

  els.btnSpecial.addEventListener('click', (e) => {
    e.stopPropagation();
    els.specialMenu.hidden = !els.specialMenu.hidden;
    if (!els.specialMenu.hidden) {
      showHud(0);
    }
  });

  els.specialMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-special]');
    if (!btn) return;
    const key = btn.dataset.special;
    els.specialMenu.hidden = true;
    state.activeInstance?.triggerSpecial?.(key);
    hudHideTimer = setTimeout(hideHud, 1600);
  });

  window.addEventListener('click', (e) => {
    if (!els.specialMenu.hidden && !els.btnSpecial.contains(e.target) && !els.specialMenu.contains(e.target)) {
      els.specialMenu.hidden = true;
      hudHideTimer = setTimeout(hideHud, 1400);
    }
  });

  document.addEventListener('fullscreenchange', updateControlsUI);

  // Keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toLowerCase();

    if (key === 'escape') {
      if (state.galleryOpen) closeGallery();
      else if (!els.specialMenu.hidden) els.specialMenu.hidden = true;
      else if (state.hudVisible) hideHud();
      return;
    }

    if (state.galleryOpen) {
      if (key === 'g') closeGallery();
      else if (key === 'c') {
        e.preventDefault();
        closeGallery();
        toggleCycle();
      }
      return;
    }

    if (key === ' ') {
      e.preventDefault();
      togglePause();
      showHud(2000);
    } else if (key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    } else if (key === 'n') {
      e.preventDefault();
      state.activeInstance?.nextScene?.();
      showHud(2200);
    } else if (key === 'c') {
      e.preventDefault();
      toggleCycle();
    } else if (key === 'm') {
      e.preventDefault();
      toggleSound();
      showHud(2000);
    } else if (key === 'g') {
      e.preventDefault();
      openGallery();
    } else if (key === 'h') {
      e.preventDefault();
      if (state.hudVisible) {
        state.hudPinned = false;
        hideHud();
      } else {
        showHud(4000);
      }
    } else if (key === ']') {
      e.preventDefault();
      cycleSpeed(1);
      showHud(2000);
    } else if (key === '[') {
      e.preventDefault();
      cycleSpeed(-1);
      showHud(2000);
    }
  });
}

async function init() {
  bindEvents();

  const params = new URLSearchParams(window.location.search);
  const requestedSpeed = parseFloat(params.get('speed'));
  if (!Number.isNaN(requestedSpeed)) {
    const idx = SPEEDS.findIndex((s) => s === requestedSpeed);
    if (idx >= 0) state.speedIndex = idx;
  }

  state.cycling = params.get('cycle') === '1';
  updateControlsUI();
  await loadScreensaver(params.get('saver') || availableSavers()[0]?.id || 'mac-os-9');
  if (state.cycling) armCycle();

  if (params.get('gallery') === '1') {
    openGallery();
  } else {
    wakeRealCursor();
    hintFallbackTimer = setTimeout(showHint, 9000);
  }
}

init();
