export default function (
  value: any[],
  list: any[],
  delimiter?: string,
): string {
  if (value && !list.length) {
    return "";
  }
  if (!delimiter) {
    delimiter = " ";
  }

  let rs = value.map((one, index) => {
    if (
      list.length &&
      Object.prototype.toString.call(list[0]) === "[object Array]"
    ) {
      return list[index].find((item: any) => {
        return item.value === one;
      });
    } else {
      return list.find((item: any) => {
        return item.value === one;
      });
    }
  });
  rs = rs.filter((one: any) => {
    return typeof one !== "undefined";
  });
  return rs
    .map((one: any) => {
      return one.name;
    })
    .join(delimiter)
    .replace("--", "");
}
