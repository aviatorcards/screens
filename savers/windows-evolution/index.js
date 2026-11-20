import { WinEvoEngine, WinEvoAbortError } from './engine.js';
import { TIMELINE_ERAS } from './eras.js?v=6';

export function createScreensaver() {
  let engine = null;
  let running = false;
  let sceneController = null;
  let eraIndex = 0;
  let jumpIndex = null;
  let mountOptions = {};

  async function loop() {
    let notifiedReady = false;

    while (running && engine && !engine.destroyed) {
      sceneController = new AbortController();
      const { signal } = sceneController;

      if (jumpIndex !== null) {
        eraIndex = jumpIndex;
        jumpIndex = null;
      }

      const era = TIMELINE_ERAS[eraIndex % TIMELINE_ERAS.length];

      if (!notifiedReady) {
        notifiedReady = true;
        mountOptions.onReady?.();
      }

      try {
        await era.run(engine, signal);
        eraIndex = (eraIndex + 1) % TIMELINE_ERAS.length;
        await engine.wait(400, signal);
      } catch (err) {
        if (err instanceof WinEvoAbortError || err?.name === 'WinEvoAbortError') {
          if (jumpIndex === null) {
            // Next Scene pressed -> advance to next era in timeline
            eraIndex = (eraIndex + 1) % TIMELINE_ERAS.length;
          }
        } else {
          console.error('Windows Evolution error:', err);
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
      engine = new WinEvoEngine(container, options);
      running = true;
      eraIndex = 0;
      jumpIndex = null;
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
      jumpIndex = null;
      sceneController?.abort();
    },

    triggerSpecial(key) {
      const idx = TIMELINE_ERAS.findIndex((e) => e.key === key);
      if (idx >= 0) {
        jumpIndex = idx;
        sceneController?.abort();
      }
    },
  };
}
