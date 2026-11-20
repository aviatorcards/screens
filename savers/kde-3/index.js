import { AbortSceneError, KdeEngine } from './engine.js';
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
    if (bag.length === 0) bag = shuffle(REGULAR_VIGNETTES);
    return bag.shift();
  }

  async function loop() {
    await engine.stylesReady;
    sceneController = new AbortController();
    try {
      if (engine && !engine.destroyed) {
        await playBootSequence(engine, sceneController.signal);
      }
    } catch (err) {
      if (!(err instanceof AbortSceneError)) console.error('KDE boot error:', err);
    }

    if (!running || !engine || engine.destroyed) return;
    engine.hideBoot();
    engine.setCursorVisible(true);
    mountOptions.onReady?.();

    const initialQueue = ['konqueror-browse', 'kwrite-note', 'arrange-windows', 'konsole-session', 'kcalc', 'find-files']
      .map((id) => REGULAR_VIGNETTES.find((vignette) => vignette.id === id))
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
        } else if (completedCount > 0 && completedCount % 12 === 0) {
          runner = SPECIAL_VIGNETTES.logout;
        } else if (completedCount > 0 && completedCount % 7 === 0) {
          runner = SPECIAL_VIGNETTES.desktops;
        } else if (initialQueue.length > 0) {
          runner = initialQueue.shift().run;
        } else {
          runner = nextFromBag().run;
        }

        if (runner) {
          await runner(engine, signal);
          completedCount += 1;
          await engine.wait(700, signal);
        }
      } catch (err) {
        if (err instanceof AbortSceneError) {
          if (engine && !engine.destroyed) {
            engine.closePopups();
            engine.setCursorVisible(true);
          }
        } else {
          console.error('KDE vignette error:', err);
          if (engine && !engine.destroyed) await engine.wait(800).catch(() => {});
        }
      }
    }
  }

  return {
    mount(container, options = {}) {
      mountOptions = options;
      engine = new KdeEngine(container, options);
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
