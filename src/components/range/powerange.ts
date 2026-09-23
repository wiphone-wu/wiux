export interface PowerangeOptions {
  callback?: (value: number) => void;
  decimal?: boolean;
  disable?: boolean;
  disabledOpacity?: number;
  hideRange?: boolean;
  min?: number;
  max?: number;
  start?: number | null;
  step?: number | null;
  vertical?: boolean;
  minHTML?: string;
  maxHTML?: string;
  initialBarWidth?: number;
  onTouchstart?: (e: Event) => void;
  onTouchend?: (e: Event) => void;
}

function getWidth(el: HTMLElement): number {
  const width = window.getComputedStyle(el, null).width;
  if (width === "100%" || width === "auto") {
    return 0;
  }
  return parseInt(width, 10);
}

const percentage = {
  of(perc: number, num: number): number {
    return (perc / 100) * num;
  },
  from(part: number, target: number): number {
    return (part / target) * 100;
  },
};

function findClosest(target: number, points: number[]): number {
  let diff: number | null = null;
  let closest = points[0];
  for (let i = 0; i < points.length; i++) {
    diff = Math.abs(target - closest);
    const current = Math.abs(target - points[i]);
    if (current < diff) {
      closest = points[i];
    }
  }
  return closest;
}

class ClassList {
  el: HTMLElement;
  list: DOMTokenList;

  constructor(el: HTMLElement) {
    this.el = el;
    this.list = el.classList;
  }

  add(name: string): void {
    this.list.add(name);
  }

  remove(name: string): void {
    this.list.remove(name);
  }

  has(name: string): boolean {
    return this.list.contains(name);
  }
}

function classes(el: HTMLElement): ClassList {
  return new ClassList(el);
}

function eventBind(
  el: HTMLElement | Window | Document,
  type: string,
  fn: EventListener,
  capture?: boolean,
): void {
  el.addEventListener(type, fn as EventListener, capture || false);
}

function eventUnbind(
  el: HTMLElement | Window | Document,
  type: string,
  fn: EventListener,
  capture?: boolean,
): void {
  el.removeEventListener(type, fn as EventListener, capture || false);
}

function touchEvents(el: HTMLElement, obj: any) {
  return {
    bind(event: string, method: string) {
      const map: Record<string, string> = {
        touchstart: "touchstart",
        touchmove: "touchmove",
        touchend: "touchend",
      };
      eventBind(el, map[event] || event, (e: Event) => {
        (obj as any)[method](e);
      });
    },
    unbind() {},
  };
}

function mouseEvents(el: HTMLElement, obj: any) {
  return {
    bind() {
      eventBind(el, "mousedown", (e: Event) => {
        (obj as any).onmousedown(e);
        const moveHandler = (ev: Event) => {
          (obj as any).onmousemove(ev);
        };
        const upHandler = (ev: Event) => {
          (obj as any).onmouseup(ev);
          eventUnbind(document, "mousemove", moveHandler);
          eventUnbind(document, "mouseup", upHandler);
        };
        eventBind(document, "mousemove", moveHandler);
        eventBind(document, "mouseup", upHandler);
      });
    },
    unbind() {},
  };
}

class Horizontal {
  element: HTMLInputElement;
  options: PowerangeOptions;
  slider!: HTMLElement;
  handle!: HTMLElement;
  steps: number[] = [];
  hasAppend = false;
  startX = 0;
  handleOffsetX = 0;
  restrictHandleX = 0;
  touch: any;
  mouse: any;

  constructor(element: HTMLInputElement, options: PowerangeOptions) {
    this.element = element;
    this.options = options || {};
    this.slider = this.create("span", "range-bar");

    if (this.element !== null && this.element.type === "text") this.init();
    if (this.options.step) {
      this.step(
        this.slider.offsetWidth || this.options.initialBarWidth || 0,
        getWidth(this.handle),
      );
    }
    this.setStart(this.options.start || 0);
  }

  setStart(start: number): void {
    const begin = start === null ? this.options.min! : start;
    const part =
      percentage.from(
        begin - this.options.min!,
        this.options.max! - this.options.min!,
      ) || 0;
    const offset = percentage.of(
      part,
      this.slider.offsetWidth - this.handle.offsetWidth,
    );
    const position = this.options.step
      ? findClosest(offset, this.steps)
      : offset;
    this.setPosition(position);
    this.setValue(
      this.handle.style.left,
      this.slider.offsetWidth - this.handle.offsetWidth,
    );
  }

  setStep(): void {
    this.step(
      getWidth(this.slider) || this.options.initialBarWidth || 0,
      getWidth(this.handle),
    );
  }

  setPosition(val: number): void {
    this.handle.style.left = val + "px";
    const quantity = this.slider.querySelector(
      ".range-quantity",
    ) as HTMLElement;
    if (quantity) {
      quantity.style.width = val + "px";
    }
  }

  onmousedown(e: MouseEvent | TouchEvent): void {
    this.options.onTouchstart && this.options.onTouchstart(e);
    let clientX: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    this.startX = clientX;
    this.handleOffsetX = this.handle.offsetLeft;
    this.restrictHandleX = this.slider.offsetWidth - this.handle.offsetWidth;
    this.unselectable(this.slider, true);
  }

  onmousemove(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    let clientX: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const leftOffset = this.handleOffsetX + clientX - this.startX;
    const position = this.steps.length
      ? findClosest(leftOffset, this.steps)
      : leftOffset;

    if (leftOffset <= 0) {
      this.setPosition(0);
    } else if (leftOffset >= this.restrictHandleX) {
      this.setPosition(this.restrictHandleX);
    } else {
      this.setPosition(position);
    }
    this.setValue(
      this.handle.style.left,
      this.slider.offsetWidth - this.handle.offsetWidth,
    );
  }

  onmouseup(e: MouseEvent | TouchEvent): void {
    this.options.onTouchend && this.options.onTouchend(e);
    this.unselectable(this.slider, false);
  }

  unselectable(element: HTMLElement, set: boolean): void {
    if (!classes(element).has("unselectable") && set === true) {
      classes(element).add("unselectable");
    } else {
      classes(element).remove("unselectable");
    }
  }

  disable(force?: boolean): void {
    if (this.options.disable || force) {
      this.mouse && this.mouse.unbind();
      this.touch && this.touch.unbind();
    }
    if (this.options.disable) {
      if (this.options.disabledOpacity) {
        this.slider.style.opacity = String(this.options.disabledOpacity);
      }
      classes(this.slider).add("range-bar-disabled");
    }
  }

  init(): void {
    this.hide();
    this.append();
    this.bindEvents();
    this.checkValues(this.options.start || 0);
    this.setRange(this.options.min!, this.options.max!);
    this.disable();
  }

  reInit(opts: {
    value: number;
    min: number;
    max: number;
    step: number;
  }): void {
    this.options.start = opts.value;
    this.options.min = opts.min;
    this.options.max = opts.max;
    this.options.step = opts.step;
    this.disable(true);
    this.init();
  }

  checkStep(value: number): number {
    if (value < 0) value = Math.abs(value);
    this.options.step = value;
    return this.options.step;
  }

  setValue(offset: string, size: number): void {
    const part = percentage.from(parseFloat(offset), size);
    let value: number;
    if (offset === "0px" || size === 0) {
      value = this.options.min!;
    } else {
      value =
        percentage.of(part, this.options.max! - this.options.min!) +
        this.options.min!;
      value = this.options.decimal
        ? Math.round(value * 100) / 100
        : Math.round(value);
      if (value > this.options.max!) {
        value = this.options.max!;
      }
    }

    const changed = this.element.value !== String(value);
    this.element.value = String(value);
    this.options.callback && this.options.callback(value);
    if (changed) {
      this.changeEvent();
    }
  }

  changeEvent(): void {
    if (typeof Event === "function") {
      const event = document.createEvent("HTMLEvents");
      event.initEvent("change", false, true);
      this.element.dispatchEvent(event);
    }
  }

  checkValues(start: number): void {
    if (start < this.options.min!) this.options.start = this.options.min!;
    if (start > this.options.max!) this.options.start = this.options.max!;
    if (this.options.min! >= this.options.max!)
      this.options.min = this.options.max;
  }

  step(sliderSize: number, handleSize: number): number[] {
    const dimension = sliderSize - handleSize;
    const part = percentage.from(
      this.checkStep(this.options.step || 1),
      this.options.max! - this.options.min!,
    );
    const interval = percentage.of(part, dimension);
    const steps: number[] = [];
    for (let i = 0; i <= dimension; i += interval) {
      steps.push(i);
    }
    this.steps = steps;
    for (let i = 10; i >= 0; i--) {
      this.steps[steps.length - i] = dimension - interval * i;
    }
    return this.steps;
  }

  create(type: string, name: string): HTMLElement {
    const elem = document.createElement(type);
    elem.className = name;
    return elem;
  }

  insertAfter(reference: Node, target: Node): void {
    reference.parentNode!.insertBefore(target, reference.nextSibling);
  }

  setRange(min: number, max: number): void {
    if (
      typeof min === "number" &&
      typeof max === "number" &&
      !this.options.hideRange
    ) {
      const minEl = this.slider.querySelector(".range-min");
      const maxEl = this.slider.querySelector(".range-max");
      if (minEl) minEl.innerHTML = this.options.minHTML || String(min);
      if (maxEl) maxEl.innerHTML = this.options.maxHTML || String(max);
    }
  }

  generate(): HTMLElement {
    const elements: Record<string, { type: string; selector: string }> = {
      handle: { type: "span", selector: "range-handle" },
      min: { type: "span", selector: "range-min" },
      max: { type: "span", selector: "range-max" },
      quantity: { type: "span", selector: "range-quantity" },
    };

    for (const key in elements) {
      if (Object.prototype.hasOwnProperty.call(elements, key)) {
        const temp = this.create(elements[key].type, elements[key].selector);
        this.slider.appendChild(temp);
      }
    }
    return this.slider;
  }

  append(): void {
    if (!this.hasAppend) {
      const slider = this.generate();
      this.insertAfter(this.element, slider);
    }
    this.hasAppend = true;
  }

  hide(): void {
    this.element.style.display = "none";
  }

  bindEvents(): void {
    this.handle = this.slider.querySelector(".range-handle") as HTMLElement;
    this.touch = touchEvents(this.handle, this);
    this.touch.bind("touchstart", "onmousedown");
    this.touch.bind("touchmove", "onmousemove");
    this.touch.bind("touchend", "onmouseup");
    this.mouse = mouseEvents(this.handle, this);
    this.mouse.bind();
  }
}

const defaults: PowerangeOptions = {
  callback: () => {},
  decimal: false,
  disable: false,
  disabledOpacity: undefined,
  hideRange: false,
  min: 0,
  max: 100,
  start: null,
  step: null,
  vertical: false,
};

export default function (
  element: HTMLInputElement,
  options: PowerangeOptions,
): Horizontal {
  options = Object.assign({}, defaults, options);
  return new Horizontal(element, options);
}
