export default class Manager {
  data: any[];
  count: number;
  fixedColumns: number = 0;

  constructor(data: any[], count: number, fixedColumns?: number) {
    this.data = data;
    this.count = count;
    if (fixedColumns) {
      this.fixedColumns = fixedColumns;
    }
  }

  getChildren(value: string): any[] {
    return this.data.filter((one: any) => {
      return one.parent === value;
    });
  }

  getFirstColumn(): any[] {
    return this.data.filter((one: any) => {
      return !one.parent || one.parent === 0 || one.parent === "0";
    });
  }

  getPure(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  getColumns(value: string[]): any[] {
    if (value.length > 0) {
      const matchCount = this.getPure(this.data).filter((item: any) => {
        return this.getPure(value).indexOf(item.value) > -1;
      }).length;
      if (matchCount < this.getPure(value).length) {
        value = [];
      }
    }
    const data: any[] = [];
    const max = this.fixedColumns || 8;
    for (let i = 0; i < max; i++) {
      if (i === 0) {
        data.push(this.getFirstColumn());
      } else {
        if (!value[i]) {
          if (typeof data[i - 1][0] === "undefined") {
            break;
          } else {
            const topValue = data[i - 1][0].value;
            data.push(this.getChildren(topValue));
          }
        } else {
          data.push(this.getChildren(value[i - 1]));
        }
      }
    }
    const list = data.filter((item: any) => {
      return item.length > 0;
    });
    this.count = list.length;
    return list;
  }
}
