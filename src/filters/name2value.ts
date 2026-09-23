const specialMap: Record<string, string> = {
  "北京市": "110100",
  "天津市": "120100",
  "上海市": "310100",
  "重庆市": "500100",
};

export default function (name: string[], list: any[]): string {
  const rs = name.map((one: string, index: number) => {
    let parent: any = "";
    if (index === 2) {
      parent = list.find((item: any) => {
        return item.name === name[1];
      }) || { value: "__" };

      if (specialMap[name[0]]) {
        parent = {
          value: specialMap[name[0]],
        };
      }
      return list.find((item: any) => {
        return item.name === one && item.parent === parent.value;
      });
    } else {
      if (index === 1 && specialMap[name[0]]) {
        return {
          value: specialMap[name[0]],
        };
      }
      return list.find((item: any) => {
        return item.name === one;
      });
    }
  });

  return rs
    .map((one: any) => {
      return one ? one.value : "__";
    })
    .join(" ");
}
