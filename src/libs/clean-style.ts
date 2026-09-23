export default function cleanStyle(
  styles: Record<string, any> = {},
): Record<string, any> {
  for (const i in styles) {
    if (typeof styles[i] === "undefined") {
      delete styles[i];
    }
  }
  return styles;
}
