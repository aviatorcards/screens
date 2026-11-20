import { WarpEngine, WarpAbortError } from './engine.js';
import { warpBoot, REGULAR_VIGNETTES, SPECIAL_VIGNETTES } from './vignettes.js';

export function createScreensaver() {
  let engine = null;
  let running = false;
  let queuedSpecial = null;
  let sceneIndex = 0;

  async function loop(onReady) {
    running = true;
    try {
      await warpBoot(engine);
      onReady?.();
    } catch (err) {
      if (!(err instanceof WarpAbortError)) console.error(err);
    }

    while (running && engine && !engine.destroyed) {
      engine.clearAbort();
      let fn = null;

      if (queuedSpecial) {
        fn = SPECIAL_VIGNETTES[queuedSpecial] || null;
        queuedSpecial = null;
      }
      if (!fn) {
        fn = REGULAR_VIGNETTES[sceneIndex % REGULAR_VIGNETTES.length];
        sceneIndex++;
      }

      try {
        await fn(engine);
        await engine.wait(650);
      } catch (err) {
        if (err instanceof WarpAbortError) {
          continue;
        }
        console.error('OS/2 Warp vignette error:', err);
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  return {
    mount(container, options = {}) {
      engine = new WarpEngine(container, options);
      sceneIndex = 0;
      queuedSpecial = null;
      loop(options.onReady);
    },
    unmount() {
      running = false;
      if (engine) {
        engine.unmount();
        engine = null;
      }
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
      engine?.abortCurrent();
    },
    triggerSpecial(key) {
      if (SPECIAL_VIGNETTES[key]) {
        queuedSpecial = key;
        engine?.abortCurrent();
      }
    },
  };
}
