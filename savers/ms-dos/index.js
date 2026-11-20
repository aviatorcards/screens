import { DosEngine, DosAbortError } from './engine.js';
import { REGULAR_VIGNETTES, SPECIAL_VIGNETTES, dosColdBoot } from './vignettes.js';

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
      bag = shuffle(REGULAR_VIGNETTES.filter((v) => v.id !== 'dos-boot'));
    }
    return bag.shift();
  }

  async function loop() {
    // Always open with the iconic 486DX2 BIOS POST & MS-DOS 6.22 startup!
    sceneController = new AbortController();
    try {
      if (engine && !engine.destroyed) {
        await dosColdBoot(engine, sceneController.signal);
      }
    } catch (err) {
      if (!(err instanceof DosAbortError) && err?.name !== 'DosAbortError') {
        console.error('MS-DOS boot error:', err);
      }
    }

    if (!running || !engine || engine.destroyed) return;
    mountOptions.onReady?.();

    const initialQueue = [
      REGULAR_VIGNETTES.find((v) => v.id === 'dos-dir-mem'),
      REGULAR_VIGNETTES.find((v) => v.id === 'dos-defrag'),
      REGULAR_VIGNETTES.find((v) => v.id === 'dos-edit'),
      REGULAR_VIGNETTES.find((v) => v.id === 'dos-nc'),
      REGULAR_VIGNETTES.find((v) => v.id === 'dos-bbs'),
      REGULAR_VIGNETTES.find((v) => v.id === 'dos-qbasic'),
      REGULAR_VIGNETTES.find((v) => v.id === 'dos-scandisk'),
      REGULAR_VIGNETTES.find((v) => v.id === 'dos-doom'),
    ].filter(Boolean);

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
          await engine.wait(550, signal);
        }
      } catch (err) {
        if (err instanceof DosAbortError || err?.name === 'DosAbortError') {
          if (engine && !engine.destroyed) {
            engine.setHdd(false);
            engine.showVgaCanvas(false);
            engine.hideTui();
            engine.showPromptIdle();
          }
        } else {
          console.error('MS-DOS vignette error:', err);
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
      engine = new DosEngine(container, options);
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
