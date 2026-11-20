import { C64Engine, C64AbortError } from './engine.js';
import { REGULAR_VIGNETTES, SPECIAL_VIGNETTES } from './vignettes.js';

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createScreensaver() {
  let engine = null;
  let running = false;
  let sceneController = null;
  let pendingSpecial = null;
  let bag = [];
  let mountOptions = {};

  function nextFromBag() {
    if (bag.length === 0) {
      bag = shuffle(REGULAR_VIGNETTES);
    }
    return bag.shift();
  }

  async function loop() {
    // Authentic opening arc: C64 Power-On & DIR -> 10 PRINT -> Boot GEOS -> geoWrite -> geoPaint -> SID Demo
    const initialQueue = [
      REGULAR_VIGNETTES.find((v) => v.id === 'c64-dir'),
      REGULAR_VIGNETTES.find((v) => v.id === 'basic-10print'),
      REGULAR_VIGNETTES.find((v) => v.id === 'boot-geos'),
      REGULAR_VIGNETTES.find((v) => v.id === 'geos-geowrite'),
      REGULAR_VIGNETTES.find((v) => v.id === 'geos-geopaint'),
      REGULAR_VIGNETTES.find((v) => v.id === 'geos-accessories'),
      REGULAR_VIGNETTES.find((v) => v.id === 'geos-desktop'),
      REGULAR_VIGNETTES.find((v) => v.id === 'basic-sid'),
      REGULAR_VIGNETTES.find((v) => v.id === 'basic-balloon'),
      REGULAR_VIGNETTES.find((v) => v.id === 'basic-poke'),
    ].filter(Boolean);

    let notifiedReady = false;

    while (running && engine && !engine.destroyed) {
      sceneController = new AbortController();
      const { signal } = sceneController;

      try {
        let runner = null;
        if (pendingSpecial) {
          const key = pendingSpecial;
          pendingSpecial = null;
          runner = SPECIAL_VIGNETTES[key];
        } else if (initialQueue.length > 0) {
          runner = initialQueue.shift().run;
        } else {
          runner = nextFromBag().run;
        }

        if (!notifiedReady) {
          notifiedReady = true;
          mountOptions.onReady?.();
        }

        if (runner) {
          await runner(engine, signal);
          await engine.wait(650, signal);
        }
      } catch (err) {
        if (err instanceof C64AbortError || err?.name === 'C64AbortError') {
          if (engine && !engine.destroyed) {
            engine.setDriveActivity(false, false);
            engine.setRasterBorder(false);
            engine.showGfxCanvas(false);
            engine.cleanupGeosMenus();
            engine.clearGeosWindows();
          }
        } else {
          console.error('Commodore 64 vignette error:', err);
          if (engine && !engine.destroyed) {
            await engine.wait(1000).catch(() => {});
          }
        }
      }
    }
  }

  return {
    mount(container, options = {}) {
      mountOptions = options;
      engine = new C64Engine(container, options);
      running = true;
      bag = [];
      loop();
    },

    unmount() {
      running = false;
      sceneController?.abort();
      engine?.destroy();
      engine = null;
    },

    setSpeed(speed) {
      engine?.setSpeed(speed);
    },

    setPaused(paused) {
      engine?.setPaused(paused);
    },

    setMuted(muted) {
      engine?.setMuted(muted);
    },

    nextScene() {
      pendingSpecial = null;
      sceneController?.abort();
    },

    triggerSpecial(key) {
      if (SPECIAL_VIGNETTES[key]) {
        pendingSpecial = key;
        sceneController?.abort();
      }
    },
  };
}
