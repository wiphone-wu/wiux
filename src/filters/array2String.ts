export default function (array: string[]): string {
  return array.length === 1 ? array[0] : array.join(" ");
}
