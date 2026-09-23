/**
 * 轻量级手势识别器，替代 Hammer.js
 * 支持 pan(拖拽)、tap(点击) 手势识别
 * 同时支持 touch 和 mouse 事件
 */

export interface GestureEvent {
  type: string;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  direction: string;
  distance: number;
  angle: number;
  target: EventTarget | null;
  srcEvent: Event;
  preventDefault: () => void;
  center: { x: number; y: number };
}

export type GestureCallback = (e: GestureEvent) => void;

export interface GestureOptions {
  threshold?: number;
  tapMaxDistance?: number;
  tapMaxTime?: number;
  direction?: string;
}

const VELOCITY_INTERVAL = 25;

const DIRECTION_LEFT = "2";
const DIRECTION_RIGHT = "4";
const DIRECTION_UP = "8";
const DIRECTION_DOWN = "16";

const DIRECTION_MAP: Record<string, string> = {
  "2": "left",
  "4": "right",
  "8": "up",
  "16": "down",
};

export class Gesture {
  private el: HTMLElement;
  private options: Required<GestureOptions>;
  private handlers: Record<string, GestureCallback[]> = {};

  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private currentX = 0;
  private currentY = 0;
  private deltaX = 0;
  private deltaY = 0;
  private velocityX = 0;
  private velocityY = 0;
  private direction = "";
  private isPanning = false;
  private startTime = 0;
  private lastTime = 0;
  private isMouseDown = false;
  private intervalX = 0;
  private intervalY = 0;
  private intervalTime = 0;

  private boundTouchStart: (e: TouchEvent) => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundTouchEnd: (e: TouchEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;
  private boundBlur: () => void;
  private boundSelectStart: (e: Event) => void;
  private boundDragStart: (e: DragEvent) => void;

  constructor(el: HTMLElement, options: GestureOptions = {}) {
    this.el = el;
    this.options = {
      threshold: options.threshold || 10,
      tapMaxDistance: options.tapMaxDistance || 10,
      tapMaxTime: options.tapMaxTime || 300,
      direction: options.direction || "",
    };

    this.boundTouchStart = this.onTouchStart.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
    this.boundTouchEnd = this.onTouchEnd.bind(this);
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundBlur = this.onBlur.bind(this);
    this.boundSelectStart = this.onSelectStart.bind(this);
    this.boundDragStart = this.onDragStart.bind(this);

    this.bindEvents();
  }

  on(event: string, callback: GestureCallback): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(callback);
  }

  off(event: string, callback?: GestureCallback): void {
    if (!callback) {
      delete this.handlers[event];
      return;
    }
    const handlers = this.handlers[event];
    if (handlers) {
      const idx = handlers.indexOf(callback);
      if (idx > -1) handlers.splice(idx, 1);
    }
  }

  destroy(): void {
    this.forceEnd();
    this.unbindEvents();
    this.handlers = {};
  }

  private forceEnd(): void {
    if (this.isPanning || this.isMouseDown) {
      this.isPanning = false;
      this.isMouseDown = false;
      this.emit("panEnd", new Event("forceEnd"));
      this.cleanupMouseListeners();
    }
  }

  private cleanupMouseListeners(): void {
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("mouseup", this.boundMouseUp);
    window.removeEventListener("mouseup", this.boundMouseUp);
    window.removeEventListener("blur", this.boundBlur);
  }

  private bindEvents(): void {
    this.el.addEventListener("touchstart", this.boundTouchStart, {
      passive: false,
    });
    this.el.addEventListener("touchmove", this.boundTouchMove, {
      passive: false,
    });
    this.el.addEventListener("touchend", this.boundTouchEnd);
    this.el.addEventListener("touchcancel", this.boundTouchEnd);
    this.el.addEventListener("mousedown", this.boundMouseDown);
    this.el.addEventListener("selectstart", this.boundSelectStart);
    this.el.addEventListener("dragstart", this.boundDragStart);
  }

  private unbindEvents(): void {
    this.el.removeEventListener("touchstart", this.boundTouchStart);
    this.el.removeEventListener("touchmove", this.boundTouchMove);
    this.el.removeEventListener("touchend", this.boundTouchEnd);
    this.el.removeEventListener("touchcancel", this.boundTouchEnd);
    this.el.removeEventListener("mousedown", this.boundMouseDown);
    this.el.removeEventListener("selectstart", this.boundSelectStart);
    this.el.removeEventListener("dragstart", this.boundDragStart);
    this.cleanupMouseListeners();
  }

  private emit(event: string, srcEvent: Event): void {
    const handlers = this.handlers[event];
    if (!handlers || handlers.length === 0) return;

    const gestureEvent: GestureEvent = {
      type: event,
      deltaX: this.deltaX,
      deltaY: this.deltaY,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      direction: this.direction,
      distance: Math.sqrt(
        this.deltaX * this.deltaX + this.deltaY * this.deltaY,
      ),
      angle: Math.atan2(this.deltaY, this.deltaX) * (180 / Math.PI),
      target: srcEvent.target,
      srcEvent,
      preventDefault: () => srcEvent.preventDefault(),
      center: {
        x: this.currentX,
        y: this.currentY,
      },
    };

    handlers.forEach((cb) => cb(gestureEvent));
  }

  private getTouches(e: TouchEvent): { x: number; y: number } {
    const touch = e.touches[0] || e.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  }

  private handleStart(x: number, y: number, srcEvent: Event): void {
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;
    this.currentX = x;
    this.currentY = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.direction = "";
    this.isPanning = false;
    this.startTime = Date.now();
    this.lastTime = this.startTime;
    this.intervalX = x;
    this.intervalY = y;
    this.intervalTime = this.startTime;
  }

  private handleMove(x: number, y: number, srcEvent: Event): void {
    const now = Date.now();

    this.currentX = x;
    this.currentY = y;
    this.deltaX = x - this.startX;
    this.deltaY = y - this.startY;

    this.lastX = x;
    this.lastY = y;
    this.lastTime = now;

    const intervalDt = now - this.intervalTime;
    if (intervalDt >= VELOCITY_INTERVAL) {
      this.velocityX = (x - this.intervalX) / intervalDt;
      this.velocityY = (y - this.intervalY) / intervalDt;
      this.intervalX = x;
      this.intervalY = y;
      this.intervalTime = now;
    } else if (intervalDt > 0 && this.velocityX === 0 && this.velocityY === 0) {
      this.velocityX = (x - this.intervalX) / intervalDt;
      this.velocityY = (y - this.intervalY) / intervalDt;
    }

    if (!this.isPanning) {
      const distance = Math.abs(this.deltaX) + Math.abs(this.deltaY);
      if (distance >= this.options.threshold) {
        this.isPanning = true;
        this.direction = this.calcDirection();
        this.emit("panStart", srcEvent);
      }
    }

    if (this.isPanning) {
      this.direction = this.calcDirection();
      this.emit("pan", srcEvent);
    }
  }

  private handleEnd(srcEvent: Event): void {
    const now = Date.now();
    const sinceLastMove = now - this.lastTime;
    if (sinceLastMove > 40) {
      this.velocityX = 0;
      this.velocityY = 0;
    } else {
      const intervalDt = now - this.intervalTime || sinceLastMove || 1;
      if (intervalDt > 0 && intervalDt < VELOCITY_INTERVAL * 2) {
        this.velocityX = (this.currentX - this.intervalX) / intervalDt;
        this.velocityY = (this.currentY - this.intervalY) / intervalDt;
      }
    }

    if (this.isPanning) {
      this.isPanning = false;
      this.emit("panEnd", srcEvent);
    } else {
      const duration = Date.now() - this.startTime;
      const distance = Math.abs(this.deltaX) + Math.abs(this.deltaY);
      if (
        distance <= this.options.tapMaxDistance &&
        duration <= this.options.tapMaxTime
      ) {
        this.emit("tap", srcEvent);
      }
    }
  }

  private calcDirection(): string {
    if (Math.abs(this.deltaX) > Math.abs(this.deltaY)) {
      return this.deltaX > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT;
    } else {
      return this.deltaY > 0 ? DIRECTION_DOWN : DIRECTION_UP;
    }
  }

  private onTouchStart(e: TouchEvent): void {
    const pos = this.getTouches(e);
    this.handleStart(pos.x, pos.y, e);
  }

  private onTouchMove(e: TouchEvent): void {
    const pos = this.getTouches(e);
    this.handleMove(pos.x, pos.y, e);
  }

  private onTouchEnd(e: TouchEvent): void {
    this.handleEnd(e);
  }

  private onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return;
    e.preventDefault();
    this.isMouseDown = true;
    this.handleStart(e.clientX, e.clientY, e);
    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("mouseup", this.boundMouseUp);
    window.addEventListener("mouseup", this.boundMouseUp);
    window.addEventListener("blur", this.boundBlur);
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.isMouseDown) return;
    e.preventDefault();
    this.handleMove(e.clientX, e.clientY, e);
  }

  private onMouseUp(e: MouseEvent): void {
    if (!this.isMouseDown) return;
    this.isMouseDown = false;
    this.handleEnd(e);
    this.cleanupMouseListeners();
  }

  private onBlur(): void {
    this.forceEnd();
  }

  private onSelectStart(e: Event): void {
    if (this.isPanning || this.isMouseDown) {
      e.preventDefault();
    }
  }

  private onDragStart(e: DragEvent): void {
    e.preventDefault();
  }
}

export function getDirectionName(direction: string): string {
  return DIRECTION_MAP[direction] || "";
}
