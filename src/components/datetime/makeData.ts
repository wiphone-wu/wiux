function isLeapYear(year: number): boolean {
  return (year % 100 !== 0 && year % 4 === 0) || year % 400 === 0;
}

export function getMaxDay(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return [4, 6, 9, 11].indexOf(month) >= 0 ? 30 : 31;
}

export function getYears(
  startDate: Date,
  endDate: Date,
): { minYear: number; maxYear: number } {
  let startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const rs: number[] = [];
  while (startYear <= endYear) {
    rs.push(startYear);
    startYear++;
  }
  return {
    minYear: rs[0],
    maxYear: rs[rs.length - 1],
  };
}

export function getMonths(
  startDate: Date,
  endDate: Date,
  year: number,
): { minMonth: number; maxMonth: number } {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const endMonth = endDate.getMonth() + 1;
  let start = 1;
  let end = 12;
  if (year === startYear) {
    start = startMonth;
  }
  if (year === endYear) {
    end = endMonth;
  }
  return {
    minMonth: start,
    maxMonth: end,
  };
}

export function getDays(
  startDate: Date,
  endDate: Date,
  year: number,
  month: number,
): { minDay: number; maxDay: number } {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const endMonth = endDate.getMonth() + 1;
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  let start = 1;
  let end = getMaxDay(year, month);

  if (year === startYear && month === startMonth) {
    start = startDay;
  }
  if (year === endYear && month === endMonth) {
    end = endDay;
  }
  return {
    minDay: start,
    maxDay: end,
  };
}
