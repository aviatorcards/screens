import { MacOS9Engine, AbortSceneError } from './engine.js';
import { REGULAR_VIGNETTES, SPECIAL_VIGNETTES, playBootSequence } from './vignettes.js';

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
  let completedCount = 0;
  let bag = [];
  let mountOptions = {};

  function nextFromBag() {
    if (bag.length === 0) {
      bag = shuffle(REGULAR_VIGNETTES);
    }
    return bag.shift();
  }

  async function loop() {
    sceneController = new AbortController();
    try {
      if (engine && !engine.destroyed) {
        await playBootSequence(engine, sceneController.signal);
      }
    } catch (err) {
      if (!(err instanceof AbortSceneError) && err?.name !== 'AbortSceneError') {
        console.error('Mac OS 9 boot error:', err);
      }
    }

    if (!running || !engine || engine.destroyed) return;
    mountOptions.onReady?.();

    // Open with a curated engaging sequence first, then shuffle-bag forever
    const initialQueue = [
      REGULAR_VIGNETTES.find((v) => v.id === 'finder-cleanup'),
      REGULAR_VIGNETTES.find((v) => v.id === 'control-strip-fiddle'),
      REGULAR_VIGNETTES.find((v) => v.id === 'quicktime-movie'),
      REGULAR_VIGNETTES.find((v) => v.id === 'about-this-mac'),
      REGULAR_VIGNETTES.find((v) => v.id === 'soundjam-listen'),
      REGULAR_VIGNETTES.find((v) => v.id === 'simpletext-journal'),
      REGULAR_VIGNETTES.find((v) => v.id === 'netscape-surf'),
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
        } else if (completedCount > 0 && completedCount % 11 === 0) {
          runner = SPECIAL_VIGNETTES['system-bomb'];
        } else if (completedCount > 0 && completedCount % 6 === 0) {
          runner = SPECIAL_VIGNETTES['after-dark'];
        } else if (initialQueue.length > 0) {
          runner = initialQueue.shift().run;
        } else {
          runner = nextFromBag().run;
        }

        if (runner) {
          await runner(engine, signal);
          completedCount += 1;
          await engine.wait(900, signal);
        }
      } catch (err) {
        if (err instanceof AbortSceneError || err?.name === 'AbortSceneError') {
          // Scene interrupted cleanly by Next / Special / Unmount
          if (engine && !engine.destroyed) {
            engine.setCursorMode('arrow');
            engine.selectDesktopIcon(null);
            engine.cleanupControlStripPopups();
            engine.closeNonPersistentWindows(0);
          }
        } else {
          console.error('Mac OS 9 vignette error:', err);
          if (engine && !engine.destroyed) {
            await engine.wait(1200).catch(() => {});
          }
        }
      }
    }
  }

  return {
    mount(container, options = {}) {
      mountOptions = options;
      engine = new MacOS9Engine(container, options);
      running = true;
      completedCount = 0;
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
