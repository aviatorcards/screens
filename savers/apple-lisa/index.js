import { LisaEngine, LisaAbortError } from './engine.js';
import { lisaBootSequence, REGULAR_VIGNETTES, SPECIAL_VIGNETTES } from './vignettes.js';

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
    // Authentic Apple Lisa cold boot self-test first
    sceneController = new AbortController();
    try {
      if (engine && !engine.destroyed) {
        await lisaBootSequence(engine, sceneController.signal);
      }
    } catch (err) {
      if (!(err instanceof LisaAbortError)) {
        console.error('Apple Lisa boot error:', err);
      }
    }

    if (!running || !engine || engine.destroyed) return;
    mountOptions.onReady?.();

    const initialQueue = [
      'lisa-write',
      'lisa-draw',
      'lisa-calc-graph',
      'lisa-project',
      'lisa-desktop',
      'lisa-accessories',
      'lisa-terminal',
      'lisa-guide',
    ]
      .map((id) => REGULAR_VIGNETTES.find((v) => v.id === id))
      .filter(Boolean);

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

        if (runner) {
          await runner(engine, signal);
          await engine.wait(620, signal);
        }
      } catch (err) {
        if (err instanceof LisaAbortError || err?.name === 'LisaAbortError') {
          if (engine && !engine.destroyed) {
            engine.closeAllWindows();
          }
        } else {
          console.error('Apple Lisa vignette error:', err);
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
      engine = new LisaEngine(container, options);
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
