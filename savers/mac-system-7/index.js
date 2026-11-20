import { Sys7Engine, Sys7AbortError } from './engine.js';
import { sys7Boot, REGULAR_VIGNETTES, SPECIAL_VIGNETTES } from './vignettes.js';

export function createScreensaver() {
  let engine = null;
  let running = false;
  let queuedSpecial = null;
  let sceneIndex = 0;

  async function loop(onReady) {
    running = true;
    try {
      await sys7Boot(engine);
      onReady?.();
    } catch (err) {
      if (!(err instanceof Sys7AbortError)) console.error(err);
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
        await engine.wait(620);
      } catch (err) {
        if (err instanceof Sys7AbortError) continue;
        console.error('System 7.5 vignette error:', err);
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  return {
    mount(container, options = {}) {
      engine = new Sys7Engine(container, options);
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
