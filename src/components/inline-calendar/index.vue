<template>
  <div
    class="inline-calendar"
    :class="{ 'is-weekend-highlight': highlightWeekend }"
  >
    <div class="calendar-header" v-show="!hideHeader">
      <div class="calendar-year">
        <span @click="go(year - 1, month)">
          <a class="year-prev wiux-prev-icon" href="javascript:"></a>
        </span>
        <a class="calendar-year-txt calendar-title" href="javascript:">{{
          year
        }}</a>
        <span class="calendar-header-right-arrow" @click="go(year + 1, month)">
          <a class="year-next wiux-next-icon" href="javascript:"></a>
        </span>
      </div>

      <div class="calendar-month">
        <span @click="prev">
          <a class="month-prev wiux-prev-icon" href="javascript:"></a>
        </span>
        <a class="calendar-month-txt calendar-title" href="javascript:">{{
          months[month]
        }}</a>
        <span @click="next" class="calendar-header-right-arrow">
          <a class="month-next wiux-next-icon" href="javascript:"></a>
        </span>
      </div>
    </div>

    <table>
      <thead v-show="!hideWeekList">
        <tr>
          <th
            v-for="(week, index) in weeksList"
            :key="index"
            class="week"
            :class="`is-week-list-${index}`"
          >
            {{ week }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day, k1) in days" :key="k1">
          <td
            v-for="(child, k2) in day"
            :key="k2"
            :data-date="formatDate(year, month, child)"
            :class="buildClass(Number(k2), child)"
            @click="select(k1, Number(k2), child)"
          >
            <slot
              name="each-day"
              :year="year"
              :month="month"
              :child="processDateItem(child)"
              :date="processDateItem(child)"
              :row="k1"
              :col="k2"
              :raw-date="formatDate(year, month, child)"
              :show-date="
                replaceText(child.day, formatDate(year, month, child))
              "
              :is-show="showChild(year, month, child)"
            >
              <span
                class="wiux-calendar-each-date"
                :style="getMarkStyle(child)"
                v-show="showChild(year, month, child)"
              >
                {{ replaceText(child.day, formatDate(year, month, child)) }}
                <span
                  class="wiux-calendar-top-tip"
                  v-if="isShowTopTip(child)"
                  :style="isShowTopTip(child, 'style')"
                >
                  <span>{{ isShowTopTip(child, "text") }}</span>
                </span>
              </span>
              <span
                class="wiux-calendar-dot"
                v-if="isShowBottomDot(child)"
              ></span>
              <div
                v-html="renderFunctionResult(k1, Number(k2), child)"
                v-show="showChild(year, month, child)"
              ></div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, type PropType } from "vue";
import format from "../datetime/format";
import { getDays, zero, isBetween } from "./util";
import getProps from "./props";
import { useLocale } from "../../composables/useLocale";

interface DayItem {
  year: number;
  month: number;
  month_str: number;
  day: number;
  date?: number;
  weekDay?: number;
  isLastMonth?: boolean;
  isNextMonth?: boolean;
  isCurrent?: boolean;
  isToday?: boolean;
  formattedDate?: string;
  isWeekend?: boolean;
}

interface MarkItem {
  date: string;
  bottomDot?: boolean;
  topTip?: {
    color?: string;
    text?: string;
  };
  backgroundColor?: string;
  color?: string;
  border?: string;
}

export default defineComponent({
  name: "InlineCalendar",
  props: getProps(),
  emits: [
    "update:modelValue",
    "on-change",
    "on-select-single-date",
    "on-view-change",
  ],
  setup(props, { emit }) {
    const { t } = useLocale();
    const year = ref(0);
    const month = ref(0);
    const days = ref<any[]>([]);
    const today = format(new Date(), "YYYY-MM-DD");
    const months = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];
    const currentValue = ref<string | string[]>("");
    const viewChangeEventCount = ref(-1);

    const weeksList = computed(() => {
      const weeksList = props.weeksList as string[];
      if (weeksList && weeksList.length) {
        return weeksList;
      }
      return [t("Su"), t("Mo"), t("Tu"), t("We"), t("Th"), t("Fr"), t("Sa")];
    });

    const replaceTextList = computed(() => {
      const rs: Record<string, string> = {};
      const replaceTextList = props.replaceTextList as Record<string, string>;
      for (let i in replaceTextList) {
        rs[convertDate(i)] = replaceTextList[i];
      }
      return rs;
    });

    const currentYearMonth = computed(() => {
      return year.value + "" + month.value;
    });

    const multi = computed(() => {
      return (
        Object.prototype.toString.call(currentValue.value) === "[object Array]"
      );
    });

    function convertDate(date: string): string {
      return date === "TODAY" ? today : date;
    }

    function formatDate(yearVal: number, monthVal: number, child: any): string {
      return [yearVal, zero(child.month + 1), zero(child.day)].join("-");
    }

    function isBetweenFn(formattedDate: string): boolean {
      return isBetween(
        formattedDate,
        props.disablePast as boolean,
        props.disableFuture as boolean,
        props.startDate as string,
        props.endDate as string,
      );
    }

    function isDisabled(date: any): boolean {
      let disabled = !isBetweenFn(date.formattedDate);
      disabled = disabled || (date.isWeekend && props.disableWeekend);
      disabled = disabled || date.isNextMonth || date.isLastMonth;

      if (!props.disableDateFunction) {
        return disabled;
      } else {
        const value = (props.disableDateFunction as Function)(date);
        if (typeof value === "undefined") {
          return disabled;
        } else {
          return value;
        }
      }
    }

    function buildClass(index: number, child: any): Record<string, boolean> {
      let isCurrent = false;
      if (!child.isLastMonth && !child.isNextMonth) {
        if (multi.value && (currentValue.value as string[]).length > 0) {
          isCurrent =
            (currentValue.value as string[]).indexOf(
              formatDate(year.value, month.value, child),
            ) > -1;
        } else {
          isCurrent =
            currentValue.value === formatDate(year.value, month.value, child);
        }
      }
      return {
        current: isCurrent,
        "is-disabled": isDisabled(child),
        "is-today": child.isToday,
        [`is-week-${index}`]: true,
      };
    }

    function render(
      yearVal: number | null,
      monthVal: number | null,
      force: any = false,
    ) {
      const value = multi.value
        ? (currentValue.value as string[])[
            (currentValue.value as string[]).length - 1
          ]
        : (currentValue.value as string);
      const data = getDays({
        year: yearVal,
        month: monthVal,
        value,
        rangeBegin: convertDate((props.startDate as string) || ""),
        rangeEnd: convertDate((props.endDate as string) || ""),
        returnSixRows: props.returnSixRows as boolean,
        disablePast: props.disablePast as boolean,
        disableFuture: props.disableFuture as boolean,
      });

      if (year.value === data.year && month.value === data.month && !force) {
        return;
      }
      year.value = data.year;
      month.value = data.month;
      days.value = data.days;
    }

    function prev() {
      if (month.value === 0) {
        month.value = 11;
        year.value = year.value - 1;
      } else {
        month.value = month.value - 1;
      }
      render(year.value, month.value, true);
    }

    function next() {
      if (month.value === 11) {
        month.value = 0;
        year.value = year.value + 1;
      } else {
        month.value = month.value + 1;
      }
      render(year.value, month.value, true);
    }

    function switchViewToToday() {
      const todayDate = new Date();
      render(todayDate.getFullYear(), todayDate.getMonth());
    }

    function switchViewToCurrentValue() {
      if (
        !currentValue.value ||
        (multi.value && !(currentValue.value as string[]).length)
      ) {
        return;
      }

      let value: string;
      let yearVal: number;
      let monthVal: number;
      if (typeof currentValue.value === "string") {
        value = currentValue.value;
      } else {
        value = (currentValue.value as string[])[0];
      }
      const splitList = value.split("-");
      yearVal = parseInt(splitList[0], 10);
      monthVal = parseInt(splitList[1], 10);
      switchViewToMonth(yearVal, monthVal);
    }

    function switchViewToMonth(yearVal: number, monthVal: number) {
      if (!yearVal || !monthVal) {
        return switchViewToToday();
      }
      render(yearVal, monthVal - 1);
    }

    function go(yearVal: number, monthVal: number) {
      render(yearVal, monthVal, true);
    }

    function select(k1: number, k2: number, data: any) {
      if (data.isLastMonth && !props.showLastMonth) {
        return;
      }
      if (data.isNextMonth && !props.showNextMonth) {
        return;
      }
      if (!isBetweenFn(data.formattedDate)) {
        return;
      }

      if (isDisabled(data)) {
        if (!isBetweenFn(data.formattedDate)) {
          return;
        } else {
          if (
            props.disableDateFunction &&
            (props.disableDateFunction as Function)(data)
          ) {
            return;
          }
          if (data.isWeekend && props.disableWeekend) {
            return;
          }
        }
      }

      let _currentValue: string;
      if (!data.isLastMonth && !data.isNextMonth) {
        _currentValue = [
          year.value,
          zero(month.value + 1),
          zero(data.day),
        ].join("-");
      } else {
        _currentValue = [data.year, zero(data.month + 1), zero(data.day)].join(
          "-",
        );
      }

      if (multi.value) {
        console.log(
          "[InlineCalendar] select - multi mode, date:",
          _currentValue,
          "currentValue before:",
          JSON.parse(JSON.stringify(currentValue.value)),
        );
        let index = (currentValue.value as string[]).indexOf(_currentValue);
        if (index > -1) {
          (currentValue.value as string[]).splice(index, 1);
        } else {
          (currentValue.value as string[]).push(_currentValue);
        }
        console.log(
          "[InlineCalendar] select - currentValue after:",
          JSON.parse(JSON.stringify(currentValue.value)),
        );
      } else {
        console.log(
          "[InlineCalendar] select - single mode, date:",
          _currentValue,
        );
        currentValue.value = _currentValue;
        emit("on-select-single-date", currentValue.value);
      }

      if (props.renderOnValueChange) {
        render(null, null);
      }
    }

    function showChild(yearVal: number, monthVal: number, child: any): boolean {
      if (replaceText(child.day, formatDate(yearVal, monthVal, child))) {
        return (
          (!child.isLastMonth && !child.isNextMonth) ||
          (child.isLastMonth && props.showLastMonth) ||
          (child.isNextMonth && props.showNextMonth)
        );
      } else {
        return false;
      }
    }

    function replaceText(day: number, formatDay: string): string {
      let text = replaceTextList.value[formatDay];
      if (!text && typeof text === "undefined") {
        return "" + day;
      } else {
        return text;
      }
    }

    function isShowBottomDot(item: any): boolean {
      if (!(props.marks as MarkItem[]).length) {
        return false;
      }
      const match = (props.marks as MarkItem[]).filter(
        (one) => one.date === item.formattedDate,
      );
      if (match.length) {
        if (match[0].bottomDot) {
          return true;
        }
      }
      return false;
    }

    function isShowTopTip(item: any, returnWhat?: string): any {
      if (!(props.marks as MarkItem[]).length) {
        return false;
      }
      const match = (props.marks as MarkItem[]).filter(
        (one) => one.date === item.formattedDate,
      );
      if (match.length) {
        const markItem = match[0];
        if (markItem.topTip) {
          if (returnWhat === "style") {
            return {
              color: markItem.topTip.color,
            };
          }
          if (returnWhat === "text") {
            return markItem.topTip.text;
          }
          return true;
        }
      }
      return false;
    }

    function getMarkStyle(item: any): any {
      if (!(props.marks as MarkItem[]).length) {
        return undefined;
      }
      const match = (props.marks as MarkItem[]).filter(
        (one) => one.date === item.formattedDate,
      );
      const isSelected = item.formattedDate === currentValue.value;
      if (match.length) {
        return {
          backgroundColor: isSelected ? "" : match[0].backgroundColor,
          color: isSelected ? "" : match[0].color,
          border: isSelected ? "" : match[0].border,
        };
      }
      return undefined;
    }

    function processDateItem(item: any): any {
      const temp = JSON.parse(JSON.stringify(item));
      temp.isDisabled = isDisabled(item);
      temp.isBetween = isBetweenFn(item.formattedDate);
      return temp;
    }

    function renderFunctionResult(k1: number, k2: number, child: any): string {
      const fn = props.renderFunction as Function;
      if (fn) {
        return fn(k1, k2, child);
      }
      return "";
    }

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = (
          multi.value ? val : convertDate(val as string)
        ) as string | string[];
      },
    );

    watch(
      () => (props as any).value,
      (val: string | string[]) => {
        currentValue.value = (
          multi.value ? val : convertDate(val as string)
        ) as string | string[];
      },
    );

    watch(currentValue, (val: any, oldVal: any) => {
      emit("update:modelValue", currentValue.value);
      emit("on-change", currentValue.value);

      if (props.renderOnValueChange) {
        if (val && oldVal && val.slice(0, 7) === oldVal.slice(0, 7)) {
          return;
        }
        render(null, null, "value change");
      }
    });

    watch(
      () => props.renderFunction,
      () => {
        render(year.value, month.value, currentValue.value as string);
      },
    );

    watch(
      () => props.renderMonth,
      (val: any) => {
        if (val && val.length === 2) {
          render(val[0], val[1] - 1);
        }
      },
    );

    watch(
      () => props.returnSixRows,
      () => {
        render(year.value, month.value);
      },
    );

    watch(
      () => props.startDate,
      () => {
        render(year.value, month.value);
      },
    );

    watch(
      () => props.endDate,
      () => {
        render(year.value, month.value);
      },
    );

    watch(
      () => props.disablePast,
      () => {
        render(year.value, month.value);
      },
    );

    watch(
      () => props.disableFuture,
      () => {
        render(year.value, month.value);
      },
    );

    watch(currentYearMonth, () => {
      const lastLine = days.value[days.value.length - 1];
      const lastDate = lastLine[lastLine.length - 1];

      let daysList: any[] = [];
      days.value.forEach((line: any) => {
        daysList = daysList.concat(line);
      });
      daysList = daysList.filter((date: any) => {
        return !date.isLastMonth && !date.isNextMonth;
      });
      viewChangeEventCount.value++;
      emit(
        "on-view-change",
        {
          year: year.value,
          month: month.value + 1,
          firstDate: days.value[0][0].formattedDate,
          lastDate: lastDate.formattedDate,
          firstCurrentMonthDate: daysList[0]?.formattedDate,
          lastCurrentMonthDate: daysList[daysList.length - 1]?.formattedDate,
          allDates: days.value,
        },
        viewChangeEventCount.value,
      );
    });

    const value = (props.modelValue || (props as any).value) as
      | string
      | string[];
    console.log(
      "[InlineCalendar] created - modelValue:",
      props.modelValue,
      "value prop:",
      (props as any).value,
      "resolved:",
      value,
    );
    currentValue.value = value;
    console.log(
      "[InlineCalendar] created - currentValue:",
      currentValue.value,
      "multi:",
      multi.value,
    );
    if (multi.value) {
      for (let i = 0; i < (currentValue.value as string[]).length; i++) {
        (currentValue.value as any)[i] = convertDate(
          (currentValue.value as string[])[i],
        );
      }
    } else {
      currentValue.value = convertDate(currentValue.value as string);
    }

    const renderMonthVal = props.renderMonth as [number | null, number | null];
    render(
      renderMonthVal[0],
      renderMonthVal[1] != null ? renderMonthVal[1] - 1 : null,
    );

    return {
      year,
      month,
      days,
      today,
      months,
      currentValue,
      viewChangeEventCount,
      weeksList,
      replaceTextList,
      currentYearMonth,
      multi,
      convertDate,
      formatDate,
      isBetween: isBetweenFn,
      isDisabled,
      buildClass,
      render,
      prev,
      next,
      switchViewToToday,
      switchViewToCurrentValue,
      switchViewToMonth,
      go,
      select,
      showChild,
      replaceText,
      isShowBottomDot,
      isShowTopTip,
      getMarkStyle,
      processDateItem,
      renderFunctionResult,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.calendar-year > span,
.calendar-month > span {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  padding: 8px;
  width: 24px;
  height: 24px;
}

.calendar-year > span.calendar-header-right-arrow,
.calendar-month > span.calendar-header-right-arrow {
  left: auto;
  right: 0;
}
.wiux-prev-icon,
.wiux-next-icon {
  position: absolute;
  left: 0;
  top: 15px;
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1px solid @calendar-arrow-color;
  border-radius: 0;
  border-top: none;
  border-right: none;
  transform: rotate(45deg);
  margin-left: 15px;
  line-height: 40px;
}
.wiux-next-icon {
  transform: rotate(-135deg);
  left: auto;
  top: 14px;
  right: 15px;
}
.is-weekend-highlight td.is-week-list-0,
.is-weekend-highlight td.is-week-list-6,
.is-weekend-highlight td.is-week-0,
.is-weekend-highlight td.is-week-6 {
  color: @calendar-highlight-color;
}
.inline-calendar a {
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.calendar-year,
.calendar-month {
  position: relative;
}
.calendar-header {
  line-height: 40px;
  font-size: 1.2em;
  overflow: hidden;
}
.calendar-header > div {
  float: left;
  width: 50%;
  text-align: center;
  overflow: hidden;
}
.calendar-header span:last-of-type {
  float: right;
  vertical-align: bottom;
}
.switch-btn,
.calendar-title {
  display: inline-block;
  border-radius: 4px;
  line-height: 30px;
}
.switch-btn {
  width: 30px;
  margin: 5px;
  color: #39b5b8;
  font-family: "SimSun";
}
.calendar-title {
  padding: 0 6%;
  color: #333;
}
.switch-btn:active,
.calendar-title:active,
.calendar-header a.active {
  background-color: #39b5b8;
  color: #fff;
}
.calendar-week {
  overflow: hidden;
}
.calendar-week span {
  float: left;
  width: 14.28%;
  font-size: 1.6em;
  line-height: 34px;
  text-align: center;
}
.inline-calendar {
  width: 100%;
  background-color: @calendar-bg-color;
  border-radius: 2px;
  transition: all 0.5s ease;
}
.inline-calendar td.is-today,
.inline-calendar td.is-today.is-disabled {
  color: @calendar-today-font-color;
}
.calendar-enter,
.calendar-leave-active {
  opacity: 0;
  transform: translate3d(0, -10px, 0);
}
.calendar:before {
  position: absolute;
  left: 30px;
  top: -10px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #dedede;
}
.calendar:after {
  position: absolute;
  left: 30px;
  top: -9px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #fff;
}
.inline-calendar table {
  clear: both;
  width: 100%;
  border-collapse: collapse;
  color: #444444;
}
.inline-calendar td {
  padding: 5px 0;
  text-align: center;
  vertical-align: middle;
  font-size: @calendar-date-item-font-size;
  position: relative;
}
.inline-calendar td.week {
  pointer-events: none !important;
  cursor: default !important;
}
.inline-calendar td.is-disabled {
  color: @calendar-disabled-font-color;
}
.inline-calendar td > span.wiux-calendar-each-date {
  position: relative;
  display: inline-block;
  width: @calendar-each-date-item-size;
  height: @calendar-each-date-item-size;
  line-height: @calendar-each-date-item-line-height;
  border-radius: 50%;
  text-align: center;
  border: 1px solid transparent;
  box-sizing: border-box;
}
.inline-calendar td.current > span.wiux-calendar-each-date {
  background-color: @calendar-selected-bg-color;
  color: #fff !important;
}
.inline-calendar th {
  color: @calendar-header-day-item-color;
  font-weight: normal;
}

.wiux-calendar-top-tip {
  position: absolute;
  left: -10px;
  top: 0;
  font-size: 20px;
  transform: scale(0.5);
  transform-origin: top left;
}
.wiux-calendar-dot {
  display: block;
  text-align: center;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: @calendar-highlight-color;
  margin: 0 auto;
}
</style>
