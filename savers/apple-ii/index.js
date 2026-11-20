import { Apple2Engine, Apple2AbortError } from './engine.js';
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
    const initialQueue = [
      'apple2-boot',
      'apple2-lores',
      'apple2-visicalc',
      'apple2-hires',
      'apple2-oregon',
      'apple2-appleworks',
      'apple2-printshop',
      'apple2-monitor',
      'apple2-music',
      'apple2-phosphor',
    ]
      .map((id) => REGULAR_VIGNETTES.find((v) => v.id === id))
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
          await engine.wait(580, signal);
        }
      } catch (err) {
        if (err instanceof Apple2AbortError || err?.name === 'Apple2AbortError') {
          if (engine && !engine.destroyed) {
            engine.resetTransient();
          }
        } else {
          console.error('Apple II vignette error:', err);
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
      engine = new Apple2Engine(container, options);
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
