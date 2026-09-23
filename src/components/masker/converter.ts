/*!
 * HEX <=> RGB Conversion
 * Copyright(c) 2011 Daniel Lamb <daniellmb.com>
 * MIT Licensed
 */

export function toRGB(color: string): number[] {
  const num = parseInt(color, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

export function toHex(red: number, green: number, blue: number): string {
  return (blue | (green << 8) | (red << 16) | (1 << 24)).toString(16).slice(1);
}
