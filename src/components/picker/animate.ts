const time =
  Date.now ||
  function () {
    return +new Date();
  };

let running: Record<string, any> = {};
let counter = 1;
const desiredFrames = 60;
const millisecondsPerSecond = 1000;

const Animate = {
  requestAnimationFrame: (function () {
    if (typeof window !== "undefined") {
      const requestFrame = window.requestAnimationFrame;
      return function (callback: (...args: any[]) => void, root?: any) {
        requestFrame(callback);
      };
    }
    return function () {};
  })(),

  stop(id: number) {
    const cleared = running[id] != null;
    if (cleared) {
      running[id] = null;
    }
    return cleared;
  },

  isRunning(id: number) {
    return running[id] != null;
  },

  start(
    stepCallback: (percent: number, now: number, virtual: boolean) => void,
    verifyCallback: ((id: number) => boolean) | undefined,
    completedCallback:
      | ((renderedFramesPerSecond: number, droppedFrameCount: number) => void)
      | undefined,
    duration: number,
    easingMethod: (pos: number) => number,
    root?: any,
  ) {
    const _this = this;
    const start = time();
    let lastFrame = start;
    let percent = 0;
    let dropCounter = 0;
    const id = counter++;

    if (!root) {
      root = document.body;
    }

    if (id % 20 === 0) {
      const newRunning: Record<string, any> = {};
      for (const usedId in running) {
        newRunning[usedId] = true;
      }
      running = newRunning;
    }

    let isAnimating = false;

    const step = function (virtual?: boolean) {
      const render = virtual !== true;
      const now = time();

      if (!running[id] || (verifyCallback && !verifyCallback(id))) {
        running[id] = null;
        if (completedCallback) {
          completedCallback(
            desiredFrames -
              dropCounter / ((now - start) / millisecondsPerSecond),
            dropCounter,
          );
        }
        return;
      }

      if (render) {
        const droppedFrames =
          Math.round(
            (now - lastFrame) / (millisecondsPerSecond / desiredFrames),
          ) - 1;
        for (let j = 0; j < Math.min(droppedFrames, 4); j++) {
          step(true);
          dropCounter++;
        }
      }

      if (duration) {
        percent = (now - start) / duration;
        if (percent > 1) {
          percent = 1;
        }
      }

      const value = easingMethod ? easingMethod(percent) : percent;
      if (
        (stepCallback as any)(value, now, render) === false ||
        percent === 1
      ) {
        running[id] = null;
        if (completedCallback) {
          completedCallback(
            desiredFrames -
              dropCounter / ((now - start) / millisecondsPerSecond),
            dropCounter,
          );
        }
      } else if (render) {
        lastFrame = now;
        Animate.requestAnimationFrame(step);
      }
    };

    running[id] = true;
    Animate.requestAnimationFrame(step);
    return id;
  },
};

export default Animate;
