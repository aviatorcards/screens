import { CpmEngine, CpmAbortError } from './engine.js';
import { REGULAR_VIGNETTES, SPECIAL_VIGNETTES } from './vignettes.js';

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const BY_ID = new Map(REGULAR_VIGNETTES.map((vignette) => [vignette.id, vignette.run]));
BY_ID.set('cpm-boot', SPECIAL_VIGNETTES['cpm-boot']);

export function createScreensaver() {
  let engine = null;
  let running = false;
  let sceneController = null;
  let pendingSpecial = null;
  let bag = [];
  let mountOptions = {};

  function nextFromBag() {
    if (bag.length === 0) bag = shuffle(REGULAR_VIGNETTES);
    return bag.shift();
  }

  async function loop() {
    const initialQueue = [
      'cpm-boot',
      'cpm-dir',
      'cpm-type',
      'cpm-pip',
      'cpm-stat',
      'cpm-mbasic',
      'cpm-miss',
      'cpm-ed',
      'cpm-ddt',
      'cpm-era',
    ]
      .map((id) => BY_ID.get(id))
      .filter(Boolean);

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
          runner = initialQueue.shift();
        } else {
          runner = nextFromBag().run;
        }

        if (!notifiedReady) {
          notifiedReady = true;
          mountOptions.onReady?.();
        }

        if (runner) {
          await runner(engine, signal);
          await engine.wait(580, signal);
        }
      } catch (err) {
        if (err instanceof CpmAbortError || err?.name === 'CpmAbortError') {
          if (engine && !engine.destroyed) engine.resetTransient();
        } else {
          console.error('CP/M vignette error:', err);
          if (engine && !engine.destroyed) {
            await engine.wait(900).catch(() => {});
          }
        }
      }
    }
  }

  return {
    mount(container, options = {}) {
      mountOptions = options;
      engine = new CpmEngine(container, options);
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
