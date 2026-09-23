export default function (start: number, end: number, pad = true, step = 1) {
  const result: string[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(pad ? String(i).padStart(2, "0") : String(i));
  }
  return result;
}
