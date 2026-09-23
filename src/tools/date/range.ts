import formatter from "../../components/datetime/format";

export default function (startDate: string, endDate: string, format: string) {
  const start = new Date(startDate.replace(/-/g, "/"));
  const end = new Date(endDate.replace(/-/g, "/"));
  const result: string[] = [];
  let date = new Date(start);
  while (date <= end) {
    result.push(formatter(date, format));
    date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  }
  return result;
}
