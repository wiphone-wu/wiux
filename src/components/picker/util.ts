export function getElement(expr: string | Element): Element {
  return typeof expr === "string" ? document.querySelector(expr)! : expr;
}

export function getComputedStyle(el: Element, key: string): string {
  const computedStyle = window.getComputedStyle(el);
  return computedStyle[key as any] || "";
}

export function easeOutCubic(pos: number): number {
  return Math.pow(pos - 1, 3) + 1;
}

export function easeInOutCubic(pos: number): number {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3);
  }
  return 0.5 * (Math.pow(pos - 2, 3) + 2);
}
