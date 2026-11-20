import { CompilerEngine, CompilerAbortError } from './engine.js';
import { REGULAR_VIGNETTES, SPECIAL_VIGNETTES } from './vignettes.js';

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ORDER = [
  'lang-c',
  'lang-cpp',
  'lang-rust',
  'lang-zig',
  'lang-swift',
  'lang-go',
  'lang-hs',
];

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
    const initialQueue = ORDER
      .map((id) => REGULAR_VIGNETTES.find((vignette) => vignette.id === id)?.run)
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
        if (err instanceof CompilerAbortError || err?.name === 'CompilerAbortError') {
          if (engine && !engine.destroyed) engine.resetTransient();
        } else {
          console.error('Compilers vignette error:', err);
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
      engine = new CompilerEngine(container, options);
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
