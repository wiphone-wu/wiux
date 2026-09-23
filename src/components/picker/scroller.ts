/*
 * Anima Scroller
 * Based Zynga Scroller (http://github.com/zynga/scroller)
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 */

const isBrowser = typeof window === "object";

const TEMPLATE = `
<div class="scroller-component" data-role="component">
  <div class="scroller-mask" data-role="mask"></div>
  <div class="scroller-indicator" data-role="indicator"></div>
  <div class="scroller-content" data-role="content"></div>
</div>
`;

import Animate from "./animate";
import {
  getElement,
  getComputedStyle,
  easeOutCubic,
  easeInOutCubic,
} from "./util";

let passiveSupported = false;
if (isBrowser) {
  try {
    const options = Object.defineProperty({}, "passive", {
      get: function () {
        passiveSupported = true;
        return true;
      },
    });
    window.addEventListener("test", options as any, options);
    window.removeEventListener("test", options as any, options);
  } catch (err) {}
}

const getDpr = function () {
  let dpr: number = 1;
  if (isBrowser) {
    if (
      (window as any).WIUX_CONFIG &&
      (window as any).WIUX_CONFIG.$picker &&
      (window as any).WIUX_CONFIG.$picker.respectHtmlDataDpr
    ) {
      dpr = Number(document.documentElement.getAttribute("data-dpr")) || 1;
    }
  }
  return dpr;
};

interface ScrollerOptions {
  itemClass?: string;
  onSelect?: (value: string) => void;
  defaultValue?: string | number;
  data?: any[];
  template?: string;
  callback?: (top: number) => void;
}

class Scroller {
  isDestroy: boolean = false;
  dpr!: number;
  options!: ScrollerOptions;
  __container!: Element;
  __component!: Element;
  __content!: Element;
  __itemHeight: number = 0;
  __callback!: (top: number) => void;
  __clientTop: number = 0;
  __clientHeight: number = 0;
  __contentHeight: number = 0;
  __scrollTop: number = 0;
  __minScrollTop: number = 0;
  __maxScrollTop: number = 0;
  __scheduledTop: number = 0;
  __lastTouchTop: number | null = null;
  __lastTouchMove: number | null = null;
  __initialTouchTop: number = 0;
  __lastScale: number = 1;
  __positions: number[] = [];
  __minDecelerationScrollTop: number | null = null;
  __maxDecelerationScrollTop: number | null = null;
  __decelerationVelocityY: number | null = null;
  __isSingleTouch: boolean = false;
  __isTracking: boolean = false;
  __didDecelerationComplete: boolean = false;
  __isGesturing: boolean = false;
  __isDragging: boolean = false;
  __isDecelerating: boolean = false;
  __isAnimating: number = 0;
  __interruptedAnimation: boolean = false;
  __enableScrollY: boolean = false;
  __prevValue: string | null = null;
  value: string | null = null;
  __mouseMoveHandler: ((e: any) => void) | null = null;
  __mouseUpHandler: ((e: any) => void) | null = null;

  constructor(container: string | Element, options: ScrollerOptions = {}) {
    const self = this;

    self.dpr = getDpr();

    self.options = {
      itemClass: "scroller-item",
      onSelect() {},
      defaultValue: 0,
      data: [],
    };

    for (const key in options) {
      if ((options as any)[key] !== undefined) {
        (self.options as any)[key] = (options as any)[key];
      }
    }

    self.__container = getElement(container as string);

    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = options.template || TEMPLATE;

    const component = (self.__component = tempContainer.querySelector(
      "[data-role=component]",
    )!);
    const content = (self.__content = component.querySelector(
      "[data-role=content]",
    )!);
    const indicator = component.querySelector("[data-role=indicator]")!;

    const data = self.options.data!;
    let html = "";
    if (data.length && data[0].constructor === Object) {
      data.forEach(function (row: any) {
        html +=
          '<div class="' +
          self.options.itemClass +
          '" data-value=' +
          JSON.stringify({
            value: encodeURI(row.value),
          }) +
          ">" +
          row.name +
          "</div>";
      });
    } else {
      data.forEach(function (val: any) {
        html +=
          '<div class="' +
          self.options.itemClass +
          '" data-value=' +
          JSON.stringify({
            value: encodeURI(val),
          }) +
          ">" +
          val +
          "</div>";
      });
    }
    content.innerHTML = html;

    self.__container.appendChild(component);

    self.__itemHeight = parseFloat(getComputedStyle(indicator, "height"));

    self.__callback =
      options.callback ||
      function (top: number) {
        const distance = -top * self.dpr;
        (content as HTMLElement).style.webkitTransform =
          "translate3d(0, " + distance + "px, 0)";
        (content as HTMLElement).style.transform =
          "translate3d(0, " + distance + "px, 0)";
      };

    const rect = component.getBoundingClientRect();

    self.__clientTop = rect.top + (component as any).clientTop || 0;

    self.__setDimensions(
      (component as HTMLElement).clientHeight,
      (content as HTMLElement).offsetHeight,
    );

    if ((component as HTMLElement).clientHeight === 0) {
      self.__setDimensions(
        parseFloat(getComputedStyle(component, "height")),
        204,
      );
    }
    self.select(self.options.defaultValue as string, false);

    const touchStartHandler = function (e: any) {
      if (e.target.tagName.match(/input|textarea|select/i)) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
      self.__doTouchStart(e, e.timeStamp);
    };

    const touchMoveHandler = function (e: any) {
      self.__doTouchMove(e, e.timeStamp);
    };

    const touchEndHandler = function (e: any) {
      self.__doTouchEnd(e.timeStamp);
    };

    const willPreventDefault = passiveSupported ? { passive: false } : false;
    const willNotPreventDefault = passiveSupported ? { passive: true } : false;

    component.addEventListener(
      "touchstart",
      touchStartHandler,
      willPreventDefault as any,
    );
    component.addEventListener(
      "mousedown",
      touchStartHandler,
      willPreventDefault as any,
    );

    component.addEventListener(
      "touchmove",
      touchMoveHandler,
      willNotPreventDefault as any,
    );
    component.addEventListener(
      "touchend",
      touchEndHandler,
      willNotPreventDefault as any,
    );

    self.__mouseMoveHandler = touchMoveHandler;
    self.__mouseUpHandler = touchEndHandler;
    document.addEventListener(
      "mousemove",
      touchMoveHandler,
      willNotPreventDefault as any,
    );
    document.addEventListener(
      "mouseup",
      touchEndHandler,
      willNotPreventDefault as any,
    );
  }

  __setDimensions(clientHeight: number, contentHeight: number) {
    const self = this;

    self.__clientHeight = clientHeight;
    self.__contentHeight = contentHeight;

    const totalItemCount = self.options.data!.length;
    const clientItemCount = Math.round(self.__clientHeight / self.__itemHeight);

    self.__minScrollTop = -self.__itemHeight * (clientItemCount / 2);
    self.__maxScrollTop =
      self.__minScrollTop + totalItemCount * self.__itemHeight - 0.1;
  }

  selectByIndex(index: number, animate?: boolean) {
    const self = this;
    if (index < 0 || index > self.__content.childElementCount - 1) {
      return;
    }
    self.__scrollTop = self.__minScrollTop + index * self.__itemHeight;

    self.scrollTo(self.__scrollTop, animate);

    self.__selectItem(self.__content.children[index] as HTMLElement);
  }

  select(value: string | number, animate?: boolean) {
    const self = this;

    const children = self.__content.children;
    for (let i = 0, len = children.length; i < len; i++) {
      if (
        decodeURI(
          JSON.parse((children[i] as HTMLElement).dataset.value!).value,
        ) === String(value)
      ) {
        self.selectByIndex(i, animate);
        return;
      }
    }

    self.selectByIndex(0, animate);
  }

  getValue() {
    return this.value;
  }

  scrollTo(top: number, animate?: boolean) {
    const self = this;

    animate = animate === undefined ? true : animate;

    if (self.__isDecelerating) {
      Animate.stop(self.__isDecelerating as any);
      self.__isDecelerating = false;
    }

    top =
      Math.round(parseFloat((top / self.__itemHeight).toFixed(5))) *
      self.__itemHeight;
    top = Math.max(Math.min(self.__maxScrollTop, top), self.__minScrollTop);

    if (top === self.__scrollTop || !animate) {
      self.__publish(top);
      self.__scrollingComplete();
      return;
    }
    self.__publish(top, 250);
  }

  destroy() {
    this.isDestroy = true;
    if (this.__mouseMoveHandler) {
      document.removeEventListener("mousemove", this.__mouseMoveHandler);
      this.__mouseMoveHandler = null;
    }
    if (this.__mouseUpHandler) {
      document.removeEventListener("mouseup", this.__mouseUpHandler);
      this.__mouseUpHandler = null;
    }
    if (this.__component.parentNode) {
      this.__component.parentNode.removeChild(this.__component);
    }
  }

  __selectItem(selectedItem: HTMLElement) {
    const self = this;

    const selectedItemClass = self.options.itemClass + "-selected";
    const lastSelectedElem = self.__content.querySelector(
      "." + selectedItemClass,
    );
    if (lastSelectedElem) {
      lastSelectedElem.classList.remove(selectedItemClass);
    }
    selectedItem.classList.add(selectedItemClass);

    if (self.value !== null) {
      self.__prevValue = self.value;
    }

    self.value = decodeURI(JSON.parse(selectedItem.dataset.value!).value);
  }

  __scrollingComplete() {
    const self = this;

    const index = Math.round(
      (self.__scrollTop - self.__minScrollTop - self.__itemHeight / 2) /
        self.__itemHeight,
    );

    self.__selectItem(self.__content.children[index] as HTMLElement);

    if (
      self.__prevValue !== null &&
      self.__prevValue !== self.value &&
      !self.isDestroy &&
      self.options.onSelect
    ) {
      self.options.onSelect(self.value!);
    }
  }

  __doTouchStart(ev: any, timeStamp: number) {
    const touches = ev.touches;
    const self = this;
    const target = ev.touches ? ev.touches[0] : ev;
    const isMobile = !!ev.touches;

    self.__interruptedAnimation = true;

    if (self.__isDecelerating) {
      Animate.stop(self.__isDecelerating as any);
      self.__isDecelerating = false;
      self.__interruptedAnimation = true;
    }

    if (self.__isAnimating) {
      Animate.stop(self.__isAnimating as any);
      self.__isAnimating = 0;
      self.__interruptedAnimation = true;
    }

    let currentTouchTop: number;
    const isSingleTouch = (isMobile && touches.length === 1) || !isMobile;
    if (isSingleTouch) {
      currentTouchTop = target.pageY;
    } else {
      currentTouchTop = Math.abs(target.pageY + touches[1].pageY) / 2;
    }

    self.__initialTouchTop = currentTouchTop;
    self.__lastTouchTop = currentTouchTop;
    self.__lastTouchMove = timeStamp;
    self.__lastScale = 1;
    self.__enableScrollY = !isSingleTouch;
    self.__isTracking = true;
    self.__didDecelerationComplete = false;
    self.__isDragging = !isSingleTouch;
    self.__isSingleTouch = isSingleTouch;
    self.__positions = [];
  }

  __doTouchMove(ev: any, timeStamp: number) {
    const self = this;
    const touches = ev.touches;
    const target = ev.touches ? ev.touches[0] : ev;
    const isMobile = !!ev.touches;

    if (!self.__isTracking) {
      return;
    }

    let currentTouchTop: number;

    if (isMobile && touches.length === 2) {
      currentTouchTop = Math.abs(target.pageY + touches[1].pageY) / 2;
    } else {
      currentTouchTop = target.pageY;
    }

    const positions = self.__positions;

    if (self.__isDragging) {
      const moveY = currentTouchTop - self.__lastTouchTop!;
      let scrollTop = self.__scrollTop;

      if (self.__enableScrollY) {
        scrollTop -= moveY;

        const minScrollTop = self.__minScrollTop;
        const maxScrollTop = self.__maxScrollTop;

        if (scrollTop > maxScrollTop || scrollTop < minScrollTop) {
          if (scrollTop > maxScrollTop) {
            scrollTop = maxScrollTop;
          } else {
            scrollTop = minScrollTop;
          }
        }
      }

      if (positions.length > 40) {
        positions.splice(0, 20);
      }

      positions.push(scrollTop, timeStamp);

      self.__publish(scrollTop);
    } else {
      const minimumTrackingForScroll = 0;
      const minimumTrackingForDrag = 5;

      const distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);

      self.__enableScrollY = distanceY >= minimumTrackingForScroll;

      positions.push(self.__scrollTop, timeStamp);

      self.__isDragging =
        self.__enableScrollY && distanceY >= minimumTrackingForDrag;

      if (self.__isDragging) {
        self.__interruptedAnimation = false;
      }
    }

    self.__lastTouchTop = currentTouchTop;
    self.__lastTouchMove = timeStamp;
    self.__lastScale = 1;
  }

  __doTouchEnd(timeStamp: number) {
    const self = this;

    if (!self.__isTracking) {
      return;
    }

    self.__isTracking = false;

    if (self.__isDragging) {
      self.__isDragging = false;

      if (self.__isSingleTouch && timeStamp - self.__lastTouchMove! <= 100) {
        const positions = self.__positions;
        const endPos = positions.length - 1;
        let startPos = endPos;

        for (
          let i = endPos;
          i > 0 && positions[i] > self.__lastTouchMove! - 100;
          i -= 2
        ) {
          startPos = i;
        }

        if (startPos !== endPos) {
          const timeOffset = positions[endPos] - positions[startPos];
          const movedTop = self.__scrollTop - positions[startPos - 1];

          self.__decelerationVelocityY = (movedTop / timeOffset) * (1000 / 60);

          const minVelocityToStartDeceleration = 4;

          if (
            Math.abs(self.__decelerationVelocityY!) >
            minVelocityToStartDeceleration
          ) {
            self.__startDeceleration(timeStamp);
          }
        }
      }
    }

    if (!self.__isDecelerating) {
      self.scrollTo(self.__scrollTop);
    }

    self.__positions.length = 0;
  }

  __startDeceleration(timeStamp: number) {
    const self = this;

    self.__minDecelerationScrollTop = self.__minScrollTop;
    self.__maxDecelerationScrollTop = self.__maxScrollTop;

    const step = function (percent: number, now: number, render: boolean) {
      self.__stepThroughDeceleration(render);
    };

    const minVelocityToKeepDecelerating = 0.5;

    const verify = function () {
      const shouldContinue =
        Math.abs(self.__decelerationVelocityY!) >=
        minVelocityToKeepDecelerating;
      if (!shouldContinue) {
        self.__didDecelerationComplete = true;
      }
      return shouldContinue;
    };

    const completed = function (
      renderedFramesPerSecond: number,
      dropCounter: number,
    ) {
      self.__isDecelerating = false;
      if (
        self.__scrollTop <= self.__minScrollTop ||
        self.__scrollTop >= self.__maxScrollTop
      ) {
        self.scrollTo(self.__scrollTop);
        return;
      }
      if (self.__didDecelerationComplete) {
        self.__scrollingComplete();
      }
    };

    self.__isDecelerating = Animate.start(
      step,
      verify,
      completed,
      0,
      (p: number) => p,
    ) as any;
  }

  __stepThroughDeceleration(render: boolean) {
    const self = this;

    let scrollTop = self.__scrollTop + self.__decelerationVelocityY!;

    let scrollTopFixed = Math.max(
      Math.min(self.__maxDecelerationScrollTop!, scrollTop),
      self.__minDecelerationScrollTop!,
    );
    if (scrollTopFixed !== scrollTop) {
      scrollTop = scrollTopFixed;
      self.__decelerationVelocityY = 0;
    }

    if (Math.abs(self.__decelerationVelocityY!) <= 1) {
      if (Math.abs(scrollTop % self.__itemHeight) < 1) {
        self.__decelerationVelocityY = 0;
      }
    } else {
      self.__decelerationVelocityY! *= 0.95;
    }

    self.__publish(scrollTop);
  }

  __publish(top: number, animationDuration?: number) {
    const self = this;

    const wasAnimating = self.__isAnimating;
    if (wasAnimating) {
      Animate.stop(wasAnimating as any);
      self.__isAnimating = 0;
    }

    if (animationDuration) {
      self.__scheduledTop = top;

      const oldTop = self.__scrollTop;
      const diffTop = top - oldTop;

      const step = function (percent: number, now: number, render: boolean) {
        self.__scrollTop = oldTop + diffTop * percent;
        if (self.__callback) {
          self.__callback(self.__scrollTop);
        }
      };

      const verify = function (id: number) {
        return self.__isAnimating === id;
      };

      let animId: number;

      const completed = function (
        renderedFramesPerSecond: number,
        dropCounter: number,
      ) {
        if (animId === self.__isAnimating) {
          self.__isAnimating = 0;
          self.__scrollingComplete();
        }
      };

      animId = Animate.start(
        step,
        verify,
        completed,
        animationDuration,
        wasAnimating ? easeOutCubic : easeInOutCubic,
      ) as any;
      self.__isAnimating = animId;
    } else {
      self.__scheduledTop = self.__scrollTop = top;
      if (self.__callback) {
        self.__callback(top);
      }
    }
  }

  __isAtMinScrollTop() {
    return this.__scrollTop <= this.__minScrollTop;
  }

  __isAtMaxScrollTop() {
    return this.__scrollTop >= this.__maxScrollTop;
  }
}

export default Scroller;