let lastTime = 0;
const vendors = ["webkit", "moz"];
for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  (window as any).requestAnimationFrame = (window as any)[
    vendors[x] + "RequestAnimationFrame"
  ];
  (window as any).cancelAnimationFrame =
    (window as any)[vendors[x] + "CancelAnimationFrame"] ||
    (window as any)[vendors[x] + "CancelRequestAnimationFrame"];
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (
    callback: FrameRequestCallback,
  ): number {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}
if (!window.cancelAnimationFrame) {
  (window as any).cancelAnimationFrame = function (id: number) {
    clearTimeout(id);
  };
}
