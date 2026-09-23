const arrayFrom = (nodeList: NodeListOf<Element>): Element[] =>
  Array.prototype.slice.call(nodeList);

interface SwiperOptions {
  container: string | Element;
  item?: string;
  direction?: string;
  activeClass?: string;
  threshold?: number;
  duration?: number;
  auto?: boolean;
  loop?: boolean;
  interval?: number;
  height?: string;
  minMovingDistance?: number;
  imgList?: string[];
}

interface EventHandlers {
  swiped?: (prev: number, index: number) => void;
}

class Swiper {
  _options: SwiperOptions;
  _start: { x: number; y: number } = { x: 0, y: 0 };
  _move: { x: number; y: number } = { x: 0, y: 0 };
  _end: { x: number; y: number } = { x: 0, y: 0 };
  _eventHandlers: EventHandlers = {};
  _prev: number = 0;
  _current: number = 0;
  _goto: number = 0;
  _width: number = 0;
  _height: number | string = 0;
  _distance: number = 0;
  _offset: number[] = [];
  $box: Element;
  $container: Element;
  $items: NodeListOf<Element>;
  count: number;
  realCount: number;
  _position: number[] = [];
  _firstItemIndex: number = 0;
  _isMoved: boolean = false;
  _isDragging: boolean = false;
  timer: number | null = null;
  touchstartHandler: ((e: TouchEvent | MouseEvent) => void) | null = null;
  touchmoveHandler: ((e: TouchEvent | MouseEvent) => void) | null = null;
  touchendHandler: ((e: TouchEvent | MouseEvent) => void) | null = null;
  transitionEndHandler: ((e: Event) => void) | null = null;
  resizeHandler: (() => void) | null = null;

  constructor(options: SwiperOptions) {
    const _default: SwiperOptions = {
      container: ".wiux-swiper",
      item: ".wiux-swiper-item",
      direction: "vertical",
      activeClass: "active",
      threshold: 50,
      duration: 300,
      auto: false,
      loop: false,
      interval: 3000,
      height: "auto",
      minMovingDistance: 0,
    };
    this._options = Object.assign(_default, options);
    this._options.height = this._options.height!.replace("px", "");
    this._start = { x: 0, y: 0 };
    this._move = { x: 0, y: 0 };
    this._end = { x: 0, y: 0 };
    this._eventHandlers = {};
    this._prev = 0;
    this._current = 0;
    this._goto = 0;
    this._width = 0;
    this._height = 0;
    this._distance = 0;
    this._offset = [];
    this.$box =
      typeof options.container === "string"
        ? document.querySelector(options.container)!
        : options.container;
    this.$container = this.$box.querySelector(".wiux-swiper")!;
    this.$items = this.$container.querySelectorAll(this._options.item!);
    this.count = this.$items.length;
    this.realCount = this.$items.length;
    this._position = [];
    this._firstItemIndex = 0;
    this._isMoved = false;

    if (!this.count) {
      return;
    }
    this._init();
    this._auto();
    this._bind();
    this._onResize();
    return this;
  }

  _auto() {
    const me = this;
    me.stop();
    if (me._options.auto) {
      me.timer = window.setTimeout(() => {
        me.next();
      }, me._options.interval);
    }
  }

  updateItemWidth() {
    this._width =
      (this.$box as HTMLElement).offsetWidth ||
      document.documentElement.offsetWidth;
    this._distance =
      this._options.direction === "horizontal"
        ? this._width
        : (this._height as number);
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  _loop() {
    return this._options.loop && this.realCount >= 3;
  }

  _onResize() {
    const me = this;
    this.resizeHandler = () => {
      setTimeout(() => {
        me.updateItemWidth();
        me._setOffset();
        me._setTransform();
      }, 100);
    };
    window.addEventListener("orientationchange", this.resizeHandler, false);
  }

  _init() {
    this._height =
      this._options.height === "auto"
        ? "auto"
        : (this._options.height as unknown as number) - 0;
    this.updateItemWidth();
    this._initPosition();
    this._activate(this._current);
    this._setOffset();
    this._setTransform();
    if (this._loop()) {
      this._loopRender();
    }
  }

  _initPosition() {
    for (let i = 0; i < this.realCount; i++) {
      this._position.push(i);
    }
  }

  _movePosition(position: number) {
    const me = this;
    if (position > 0) {
      const firstIndex = me._position.splice(0, 1);
      me._position.push(firstIndex[0]);
    } else if (position < 0) {
      const lastIndex = me._position.pop();
      me._position.unshift(lastIndex!);
    }
  }

  _setOffset() {
    const me = this;
    const index = me._position.indexOf(me._current);
    me._offset = [];
    arrayFrom(me.$items).forEach(($item, key) => {
      me._offset.push((key - index) * me._distance);
    });
  }

  _setTransition(duration?: number | string) {
    duration = duration || this._options.duration || "none";
    const transition = duration === "none" ? "none" : duration + "ms";
    arrayFrom(this.$items).forEach(($item) => {
      ($item as HTMLElement).style.webkitTransition = transition;
      ($item as HTMLElement).style.transition = transition;
    });
  }

  _setTransform(offset?: number) {
    const me = this;
    offset = offset || 0;
    arrayFrom(me.$items).forEach(($item, key) => {
      let distance = me._offset[key] + offset;
      let transform = `translate3d(${distance}px, 0, 0)`;
      if (me._options.direction === "vertical") {
        transform = `translate3d(0, ${distance}px, 0)`;
      }
      ($item as HTMLElement).style.webkitTransform = transform;
      ($item as HTMLElement).style.transform = transform;
      me._isMoved = true;
    });
  }

  _getPageX(e: TouchEvent | MouseEvent): number {
    if ("changedTouches" in e) {
      return (e as TouchEvent).changedTouches[0].pageX;
    }
    return (e as MouseEvent).pageX;
  }

  _getPageY(e: TouchEvent | MouseEvent): number {
    if ("changedTouches" in e) {
      return (e as TouchEvent).changedTouches[0].pageY;
    }
    return (e as MouseEvent).pageY;
  }

  _bind() {
    const me = this;
    me.touchstartHandler = (e: TouchEvent | MouseEvent) => {
      me.stop();
      me._start.x = me._getPageX(e);
      me._start.y = me._getPageY(e);
      me._setTransition("none");
      me._isMoved = false;
      me._isDragging = true;
      if (!("changedTouches" in e)) {
        e.preventDefault();
      }
    };

    me.touchmoveHandler = (e: TouchEvent | MouseEvent) => {
      if (!me._isDragging || me.count === 1) {
        return;
      }
      me._move.x = me._getPageX(e);
      me._move.y = me._getPageY(e);
      const distanceX = me._move.x - me._start.x;
      const distanceY = me._move.y - me._start.y;
      let distance = distanceY;
      const noScrollerY = Math.abs(distanceX) > Math.abs(distanceY);
      if (me._options.direction === "horizontal" && noScrollerY) {
        distance = distanceX;
      }
      if (
        !this._options.loop &&
        (this._current === this.count - 1 || this._current === 0)
      ) {
        distance = distance / 3;
      }
      if (
        (((me._options.minMovingDistance &&
          Math.abs(distance) >= me._options.minMovingDistance) ||
          !me._options.minMovingDistance) &&
          noScrollerY) ||
        me._isMoved
      ) {
        me._setTransform(distance);
      }

      if (noScrollerY && e.cancelable) {
        e.preventDefault();
      }
    };

    me.touchendHandler = (e: TouchEvent | MouseEvent) => {
      if (!me._isDragging || me.count === 1) {
        return;
      }
      me._isDragging = false;
      me._end.x = me._getPageX(e);
      me._end.y = me._getPageY(e);

      let distance = me._end.y - me._start.y;
      if (me._options.direction === "horizontal") {
        distance = me._end.x - me._start.x;
      }

      distance = me.getDistance(distance);
      if (
        distance !== 0 &&
        me._options.minMovingDistance &&
        Math.abs(distance) < me._options.minMovingDistance &&
        !me._isMoved
      ) {
        return;
      }
      if (distance > me._options.threshold!) {
        me.move(-1);
      } else if (distance < -me._options.threshold!) {
        me.move(1);
      } else {
        me.move(0);
      }

      me._loopRender();
    };

    me.transitionEndHandler = (e: Event) => {
      me._activate(me._current);
      const cb = me._eventHandlers.swiped;
      if (cb) {
        cb.apply(me, [me._prev % me.count, me._current % me.count]);
      }
      me._auto();
      me._loopRender();
      e.preventDefault();
    };

    me.$container.addEventListener(
      "touchstart",
      me.touchstartHandler as EventListener,
      false,
    );
    me.$container.addEventListener(
      "touchmove",
      me.touchmoveHandler as EventListener,
      false,
    );
    me.$container.addEventListener(
      "touchend",
      me.touchendHandler as EventListener,
      false,
    );
    me.$container.addEventListener(
      "mousedown",
      me.touchstartHandler as EventListener,
      false,
    );
    document.addEventListener(
      "mousemove",
      me.touchmoveHandler as EventListener,
      false,
    );
    document.addEventListener(
      "mouseup",
      me.touchendHandler as EventListener,
      false,
    );
    if (me.$items[1]) {
      me.$items[1].addEventListener(
        "webkitTransitionEnd",
        me.transitionEndHandler as EventListener,
        false,
      );
    }
  }

  _loopRender() {
    const me = this;
    if (me._loop()) {
      if (me._offset[me._offset.length - 1] === 0) {
        me.$container.appendChild(me.$items[0]);
        me._loopEvent(1);
      } else if (me._offset[0] === 0) {
        me.$container.insertBefore(
          me.$items[me.$items.length - 1],
          me.$container.firstChild,
        );
        me._loopEvent(-1);
      }
    }
  }

  _loopEvent(num: number) {
    const me = this;
    me._itemDestroy();
    me.$items = me.$container.querySelectorAll(me._options.item!);
    if (me.$items[1]) {
      me.$items[1].addEventListener(
        "webkitTransitionEnd",
        me.transitionEndHandler as EventListener,
        false,
      );
    }
    me._movePosition(num);
    me._setOffset();
    me._setTransform();
  }

  getDistance(distance: number): number {
    if (this._loop()) {
      return distance;
    } else {
      if (distance > 0 && this._current === 0) {
        return 0;
      } else if (distance < 0 && this._current === this.realCount - 1) {
        return 0;
      } else {
        return distance;
      }
    }
  }

  _moveIndex(num: number) {
    if (num !== 0) {
      this._prev = this._current;
      this._current += this.realCount;
      this._current += num;
      this._current %= this.realCount;
    }
  }

  _activate(index: number) {
    const clazz = this._options.activeClass!;
    Array.prototype.forEach.call(this.$items, ($item: Element, key: number) => {
      $item.classList.remove(clazz);
      if (index === Number(($item as HTMLElement).dataset.index)) {
        $item.classList.add(clazz);
      }
    });
  }

  go(index: number) {
    const me = this;
    me.stop();

    index = index || 0;
    index += this.realCount;
    index = index % this.realCount;
    index =
      this._position.indexOf(index) - this._position.indexOf(this._current);

    me._moveIndex(index);
    me._setOffset();
    me._setTransition();
    me._setTransform();
    me._auto();
    return this;
  }

  next() {
    this.move(1);
    return this;
  }

  move(num: number) {
    this.go(this._current + num);
    return this;
  }

  on(event: string, callback: (prev: number, index: number) => void) {
    if (this._eventHandlers[event as keyof EventHandlers]) {
      console.error(`[swiper] event ${event} is already registered`);
    }
    if (typeof callback !== "function") {
      console.error("[swiper] parameter callback must be a function");
    }
    (this._eventHandlers as any)[event] = callback;
    return this;
  }

  _itemDestroy() {
    if (this.$items.length) {
      arrayFrom(this.$items).forEach((item) => {
        item.removeEventListener(
          "webkitTransitionEnd",
          this.transitionEndHandler as EventListener,
          false,
        );
      });
    }
  }

  destroy() {
    this.stop();
    this._current = 0;
    this._setTransform(0);
    if (this.resizeHandler) {
      window.removeEventListener(
        "orientationchange",
        this.resizeHandler,
        false,
      );
    }
    this.$container.removeEventListener(
      "touchstart",
      this.touchstartHandler as EventListener,
      false,
    );
    this.$container.removeEventListener(
      "touchmove",
      this.touchmoveHandler as EventListener,
      false,
    );
    this.$container.removeEventListener(
      "touchend",
      this.touchendHandler as EventListener,
      false,
    );
    this.$container.removeEventListener(
      "mousedown",
      this.touchstartHandler as EventListener,
      false,
    );
    document.removeEventListener(
      "mousemove",
      this.touchmoveHandler as EventListener,
      false,
    );
    document.removeEventListener(
      "mouseup",
      this.touchendHandler as EventListener,
      false,
    );
    this._itemDestroy();
    if (this._options.loop && this.count === 2) {
      let $item = this.$container.querySelector(`${this._options.item}-clone`);
      if ($item) {
        this.$container.removeChild($item);
      }
      $item = this.$container.querySelector(`${this._options.item}-clone`);
      if ($item) {
        this.$container.removeChild($item);
      }
    }
  }
}

export default Swiper;