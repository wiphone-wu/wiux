import formatter from "./format";

export function each(
  obj: Record<string, any>,
  fn: (key: string, value: any) => void | boolean,
) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (fn.call(obj[key], key, obj[key]) === false) {
        break;
      }
    }
  }
}

export function trimZero(val: any): string {
  val = String(val);
  val = val ? parseFloat(val.replace(/^0+/g, "")) : "";
  val = val || 0;
  val = val + "";
  return val;
}

export function generateRange(start = 0, end: number): string[] {
  const results: string[] = [];
  for (let i = start; i <= end; i++) {
    results.push(addZero(i));
  }
  return results;
}

export function isToday(val1: Date, val2: Date): boolean {
  return (
    val1.getFullYear() === val2.getFullYear() &&
    val1.getMonth() === val2.getMonth() &&
    val1.getDate() === val2.getDate()
  );
}

export function addZero(val: number | string): string {
  const str = String(val);
  return str.length < 2 ? "0" + str : str;
}

export function isLeapYear(year: number): boolean {
  return (year % 100 !== 0 && year % 4 === 0) || year % 400 === 0;
}

export function getMaxDay(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return [4, 6, 9, 11].indexOf(month) >= 0 ? 30 : 31;
}

export function parseRow(tmpl: string, value: any): string {
  return tmpl.replace(/\{value\}/g, value);
}

export function parseDate(
  format: string,
  value: string,
): Record<string, string> {
  const formatParts = format.split(/[^A-Za-z]+/);
  let valueParts = value
    .replace(/\s/g, "-")
    .replace(/:/g, "-")
    .replace(/\//g, "-")
    .split("-");
  if (formatParts.length !== valueParts.length) {
    const date = formatter(new Date(), format);
    valueParts = date.split(/\D+/);
  }

  const result: Record<string, string> = {};

  for (let i = 0; i < formatParts.length; i++) {
    if (formatParts[i]) {
      result[formatParts[i]] = valueParts[i];
    }
  }
  return result;
}

export function getElement(expr: string | Element): Element {
  return typeof expr === "string" ? document.querySelector(expr)! : expr;
}

export function toElement(html: string): Element {
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = html;
  return tempContainer.firstElementChild!;
}

export function removeElement(el: Element | null) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}
