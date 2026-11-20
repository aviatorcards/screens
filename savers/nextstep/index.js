import { NextStepEngine, NextAbortError } from './engine.js';
import { REGULAR_VIGNETTES, SPECIAL_VIGNETTES, nextBootAndLogin } from './vignettes.js';

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
    sceneController = new AbortController();
    try {
      if (engine && !engine.destroyed) {
        await nextBootAndLogin(engine, sceneController.signal);
      }
    } catch (err) {
      if (!(err instanceof NextAbortError) && err?.name !== 'NextAbortError') {
        console.error('NeXTSTEP boot error:', err);
      }
    }

    if (!running || !engine || engine.destroyed) return;
    mountOptions.onReady?.();

    const initialQueue = [
      REGULAR_VIGNETTES.find((v) => v.id === 'workspace-viewer'),
      REGULAR_VIGNETTES.find((v) => v.id === 'www-cern'),
      REGULAR_VIGNETTES.find((v) => v.id === 'terminal-mach'),
      REGULAR_VIGNETTES.find((v) => v.id === 'interface-builder'),
      REGULAR_VIGNETTES.find((v) => v.id === 'edit-objc'),
      REGULAR_VIGNETTES.find((v) => v.id === 'next-mail'),
      REGULAR_VIGNETTES.find((v) => v.id === 'dps-demo'),
      REGULAR_VIGNETTES.find((v) => v.id === 'prefs-tweak'),
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
          await engine.wait(650, signal);
        }
      } catch (err) {
        if (err instanceof NextAbortError || err?.name === 'NextAbortError') {
          if (engine && !engine.destroyed) {
            engine.setCursorMode('arrow');
            engine.cleanupSubmenus();
            engine.clearWindows();
          }
        } else {
          console.error('NeXTSTEP vignette error:', err);
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
      engine = new NextStepEngine(container, options);
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
