/**
 * http://ionicframework.com/docs/api/directive/ionSpinner/
 */

import "./requestAnimationFrame";

const TRANSLATE32 = "translate(32,32)";
const STROKE_OPACITY = "stroke-opacity";
const ROUND = "round";
const INDEFINITE = "indefinite";
const DURATION = "750ms";
const NONE = "none";

const SHORTCUTS: Record<string, string> = {
  a: "animate",
  an: "attributeName",
  at: "animateTransform",
  c: "circle",
  da: "stroke-dasharray",
  os: "stroke-dashoffset",
  f: "fill",
  lc: "stroke-linecap",
  rc: "repeatCount",
  sw: "stroke-width",
  t: "transform",
  v: "values",
};

interface SvgData {
  [key: string]: any;
}

interface SvgItem {
  fn?: (i: number, spinnerName?: string) => SvgData;
  t?: number;
  [key: string]: any;
}

const SPIN_ANIMATION: SvgData = {
  v: "0,32,32;360,32,32",
  an: "transform",
  type: "rotate",
  rc: INDEFINITE,
  dur: DURATION,
};

function createSvgElement(
  tagName: string,
  data: SvgData,
  parent: Element,
  spinnerName?: string,
  size?: string,
): void {
  const ele = document.createElement(SHORTCUTS[tagName] || tagName);

  for (const k in data) {
    if (Object.prototype.toString.call(data[k]) === "[object Array]") {
      const arr = data[k] as SvgItem[];
      for (let x = 0; x < arr.length; x++) {
        if (arr[x].fn) {
          for (let y = 0; y < (arr[x].t || 0); y++) {
            createSvgElement(k, arr[x].fn!(y, spinnerName), ele, spinnerName);
          }
        } else {
          createSvgElement(k, arr[x], ele, spinnerName);
        }
      }
    } else {
      setSvgAttribute(ele, k, data[k]);
    }
  }
  if (size && size !== "28px") {
    setSvgAttribute(ele, "style", `width: ${size}; height: ${size}`);
  }
  parent.appendChild(ele);
}

function setSvgAttribute(ele: Element, k: string, v: string): void {
  ele.setAttribute(SHORTCUTS[k] || k, v);
}

function animationValues(strValues: string, i: number): string {
  const values = strValues.split(";");
  const back = values.slice(i);
  const front = values.slice(0, values.length - back.length);
  const newValues = back.concat(front).reverse();
  return newValues.join(";") + ";" + newValues[0];
}

const IOS_SPINNER: SvgData = {
  sw: 4,
  lc: ROUND,
  line: [
    {
      fn(i: number, spinnerName?: string): SvgData {
        return {
          y1: spinnerName === "ios" ? 17 : 12,
          y2: spinnerName === "ios" ? 29 : 20,
          t: TRANSLATE32 + " rotate(" + (30 * i + (i < 6 ? 180 : -180)) + ")",
          a: [
            {
              fn(): SvgData {
                return {
                  an: STROKE_OPACITY,
                  dur: DURATION,
                  v: animationValues(
                    "0;.1;.15;.25;.35;.45;.55;.65;.7;.85;1",
                    i,
                  ),
                  rc: INDEFINITE,
                };
              },
              t: 1,
            },
          ],
        };
      },
      t: 12,
    },
  ],
};

const spinners: Record<string, SvgData> = {
  android: {
    c: [
      {
        sw: 6,
        da: 128,
        os: 82,
        r: 26,
        cx: 32,
        cy: 32,
        f: NONE,
      },
    ],
  },

  ios: IOS_SPINNER,

  "ios-small": IOS_SPINNER,

  bubbles: {
    sw: 0,
    c: [
      {
        fn(i: number): SvgData {
          return {
            cx: 24 * Math.cos((2 * Math.PI * i) / 8),
            cy: 24 * Math.sin((2 * Math.PI * i) / 8),
            t: TRANSLATE32,
            a: [
              {
                fn(): SvgData {
                  return {
                    an: "r",
                    dur: DURATION,
                    v: animationValues("1;2;3;4;5;6;7;8", i),
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
            ],
          };
        },
        t: 8,
      },
    ],
  },

  circles: {
    c: [
      {
        fn(i: number): SvgData {
          return {
            r: 5,
            cx: 24 * Math.cos((2 * Math.PI * i) / 8),
            cy: 24 * Math.sin((2 * Math.PI * i) / 8),
            t: TRANSLATE32,
            sw: 0,
            a: [
              {
                fn(): SvgData {
                  return {
                    an: "fill-opacity",
                    dur: DURATION,
                    v: animationValues(".3;.3;.3;.4;.7;.85;.9;1", i),
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
            ],
          };
        },
        t: 8,
      },
    ],
  },

  crescent: {
    c: [
      {
        sw: 4,
        da: 128,
        os: 82,
        r: 26,
        cx: 32,
        cy: 32,
        f: NONE,
        at: [SPIN_ANIMATION],
      },
    ],
  },

  dots: {
    c: [
      {
        fn(i: number): SvgData {
          return {
            cx: 16 + 16 * i,
            cy: 32,
            sw: 0,
            a: [
              {
                fn(): SvgData {
                  return {
                    an: "fill-opacity",
                    dur: DURATION,
                    v: animationValues(".5;.6;.8;1;.8;.6;.5", i),
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
              {
                fn(): SvgData {
                  return {
                    an: "r",
                    dur: DURATION,
                    v: animationValues("4;5;6;5;4;3;3", i),
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
            ],
          };
        },
        t: 3,
      },
    ],
  },

  lines: {
    sw: 7,
    lc: ROUND,
    line: [
      {
        fn(i: number): SvgData {
          return {
            x1: 10 + i * 14,
            x2: 10 + i * 14,
            a: [
              {
                fn(): SvgData {
                  return {
                    an: "y1",
                    dur: DURATION,
                    v: animationValues("16;18;28;18;16", i),
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
              {
                fn(): SvgData {
                  return {
                    an: "y2",
                    dur: DURATION,
                    v: animationValues("48;44;36;46;48", i),
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
              {
                fn(): SvgData {
                  return {
                    an: STROKE_OPACITY,
                    dur: DURATION,
                    v: animationValues("1;.8;.5;.4;1", i),
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
            ],
          };
        },
        t: 4,
      },
    ],
  },

  ripple: {
    f: NONE,
    "fill-rule": "evenodd",
    sw: 3,
    circle: [
      {
        fn(i: number): SvgData {
          return {
            cx: 32,
            cy: 32,
            a: [
              {
                fn(): SvgData {
                  return {
                    an: "r",
                    begin: i * -1 + "s",
                    dur: "2s",
                    v: "0;24",
                    keyTimes: "0;1",
                    keySplines: "0.1,0.2,0.3,1",
                    calcMode: "spline",
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
              {
                fn(): SvgData {
                  return {
                    an: STROKE_OPACITY,
                    begin: i * -1 + "s",
                    dur: "2s",
                    v: ".2;1;.2;0",
                    rc: INDEFINITE,
                  };
                },
                t: 1,
              },
            ],
          };
        },
        t: 2,
      },
    ],
  },

  spiral: {
    defs: [
      {
        linearGradient: [
          {
            id: "sGD",
            gradientUnits: "userSpaceOnUse",
            x1: 55,
            y1: 46,
            x2: 2,
            y2: 46,
            stop: [
              {
                offset: 0.1,
                class: "stop1",
              },
              {
                offset: 1,
                class: "stop2",
              },
            ],
          },
        ],
      },
    ],
    g: [
      {
        sw: 4,
        lc: ROUND,
        f: NONE,
        path: [
          {
            stroke: "url(#sGD)",
            d: "M4,32 c0,15,12,28,28,28c8,0,16-4,21-9",
          },
          {
            d: "M60,32 C60,16,47.464,4,32,4S4,16,4,32",
          },
        ],
        at: [SPIN_ANIMATION],
      },
    ],
  },
};

interface AndroidAnimInstance {
  stop: boolean;
}

const animations: Record<string, (ele: Element) => () => AndroidAnimInstance> =
  {
    android(ele: Element) {
      const self: AndroidAnimInstance = {
        stop: false,
      };

      let rIndex = 0;
      let rotateCircle = 0;
      let startTime: number;
      const svgEle = ele.querySelector("g") as SVGGElement;
      const circleEle = ele.querySelector("circle") as SVGCircleElement;

      function run(): void {
        if (self.stop) return;

        const v = easeInOutCubic(Date.now() - startTime, 650);
        let scaleX = 1;
        let translateX = 0;
        let dasharray = 188 - 58 * v;
        let dashoffset = 182 - 182 * v;

        if (rIndex % 2) {
          scaleX = -1;
          translateX = -64;
          dasharray = 128 - -58 * v;
          dashoffset = 182 * v;
        }

        const rotateLine = [0, -101, -90, -11, -180, 79, -270, -191][rIndex];

        setSvgAttribute(
          circleEle,
          "da",
          String(Math.max(Math.min(dasharray, 188), 128)),
        );
        setSvgAttribute(
          circleEle,
          "os",
          String(Math.max(Math.min(dashoffset, 182), 0)),
        );
        setSvgAttribute(
          circleEle,
          "t",
          "scale(" +
            scaleX +
            ",1) translate(" +
            translateX +
            ",0) rotate(" +
            rotateLine +
            ",32,32)",
        );

        rotateCircle += 4.1;
        if (rotateCircle > 359) rotateCircle = 0;
        setSvgAttribute(svgEle, "t", "rotate(" + rotateCircle + ",32,32)");

        if (v >= 1) {
          rIndex++;
          if (rIndex > 7) rIndex = 0;
          startTime = Date.now();
        }

        window.requestAnimationFrame(run);
      }

      return function () {
        startTime = Date.now();
        run();
        return self;
      };
    },
  };

function easeInOutCubic(t: number, c: number): number {
  t /= c / 2;
  if (t < 1) return (1 / 2) * t * t * t;
  t -= 2;
  return (1 / 2) * (t * t * t + 2);
}

export default function (el: Element, icon: string, size?: string): Element {
  const spinnerName = icon;
  const container = document.createElement("div");
  createSvgElement(
    "svg",
    {
      viewBox: "0 0 64 64",
      g: [spinners[spinnerName]],
    },
    container,
    spinnerName,
    size,
  );

  el.innerHTML = container.innerHTML;

  function start(): void {
    if (animations[spinnerName]) {
      animations[spinnerName](el)();
    }
  }

  start();
  return el;
}
