import Scroller from "../picker/scroller";
import {
  isToday,
  generateRange,
  each,
  trimZero,
  addZero,
  getMaxDay,
  parseRow,
  parseDate,
  getElement,
  toElement,
  removeElement,
} from "./util";
import { getYears, getMonths, getDays } from "./makeData";

const isBrowser = typeof window === "object";

const MASK_TEMPLATE = '<div class="dp-mask"></div>';

const TEMPLATE = `<div class="dp-container">
  <div class="dp-header">
    <div class="dp-item dp-left wiux-datetime-cancel" data-role="cancel">cancel</div>
    <div class="dp-item wiux-datetime-clear" data-role="clear"></div>
    <div class="dp-item dp-right wiux-datetime-confirm" data-role="confirm">done</div>
  </div>
  <div class="dp-content">
    <div class="dp-item" data-role="year"></div>
    <div class="dp-item" data-role="month"></div>
    <div class="dp-item" data-role="day"></div>
    <div class="dp-item" data-role="noon"></div>
    <div class="dp-item" data-role="hour"></div>
    <div class="dp-item" data-role="minute"></div>
  </div>
</div>`;

const SHOW_ANIMATION_TIME = 200;
const SHOW_CONTAINER_TIME = 300;

const TYPE_MAP: Record<string, string[]> = {
  year: ["YYYY"],
  month: ["MM", "M"],
  day: ["DD", "D"],
  hour: ["HH", "H"],
  minute: ["mm", "m"],
  noon: ["A"],
};

let MASK: Element | null = null;

let CURRENT_PICKER: DatetimePicker | null = null;

const NOW = new Date();

interface DatetimePickerConfig {
  template?: string;
  trigger?: string | Element;
  output?: string | Element;
  currentYear?: number;
  currentMonth?: number;
  minYear?: number;
  maxYear?: number;
  minHour?: number;
  maxHour?: number;
  hourList?: string[];
  minuteList?: string[];
  startDate?: Date | string;
  endDate?: Date | string;
  yearRow?: string;
  monthRow?: string;
  dayRow?: string;
  noonRow?: string;
  hourRow?: string;
  minuteRow?: string;
  format?: string;
  value?: string;
  onSelect?: (type: string, value: string, wholeValue: string) => void;
  onConfirm?: (value: string) => boolean | void;
  onClear?: (value: string) => boolean | void;
  onShow?: () => void;
  onHide?: (type: string) => void;
  confirmText?: string;
  clearText?: string;
  cancelText?: string;
  destroyOnHide?: boolean;
  renderInline?: boolean;
  computeHoursFunction?: (
    date: string,
    isToday: boolean,
    generateRange: any,
  ) => any[];
  computeDaysFunction?: (
    params: { year: number; month: number; min: number; max: number },
    generateRange: any,
  ) => any[];
  isOneInstance?: boolean;
  orderMap?: Record<string, string>;
  defaultSelectedValue?: string;
}

const DEFAULT_CONFIG: DatetimePickerConfig = {
  template: TEMPLATE,
  trigger: undefined,
  output: undefined,
  currentYear: NOW.getFullYear(),
  currentMonth: NOW.getMonth() + 1,
  minYear: 2000,
  maxYear: 2030,
  minHour: 0,
  maxHour: 23,
  hourList: undefined,
  minuteList: undefined,
  startDate: undefined,
  endDate: undefined,
  yearRow: "{value}",
  monthRow: "{value}",
  dayRow: "{value}",
  noonRow: "{value}",
  hourRow: "{value}",
  minuteRow: "{value}",
  format: "YYYY-MM-DD",
  value: NOW.getFullYear() + "-" + (NOW.getMonth() + 1) + "-" + NOW.getDate(),
  onSelect() {},
  onConfirm() {},
  onClear() {},
  onShow() {},
  onHide() {},
  confirmText: "ok",
  clearText: "",
  cancelText: "Cancel",
  destroyOnHide: false,
  renderInline: false,
  computeHoursFunction: undefined,
  computeDaysFunction: undefined,
  isOneInstance: false,
  orderMap: {},
  defaultSelectedValue: "",
};

function renderScroller(
  el: Element,
  data: any[],
  value: string,
  fn: (currentValue: string) => void,
): Scroller {
  data = data.map((one: any) => {
    one.value = one.value + "";
    return one;
  });
  return new Scroller(el, {
    data,
    defaultValue: value + "",
    onSelect: fn,
  });
}

function showMask() {
  if (!isBrowser) {
    return;
  }

  if (!MASK) {
    MASK = toElement(MASK_TEMPLATE);
    document.body.appendChild(MASK);

    MASK.addEventListener(
      "click",
      function () {
        CURRENT_PICKER && CURRENT_PICKER.hide("Cancel");
      },
      false,
    );
    MASK.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
      },
      false,
    );
  }
  (MASK as HTMLElement).style.display = "block";

  setTimeout(function () {
    MASK && ((MASK as HTMLElement).style.opacity = "0.5");
  }, 0);
}

function hideMask() {
  if (!MASK) {
    return;
  }

  (MASK as HTMLElement).style.opacity = "0";

  setTimeout(function () {
    MASK && ((MASK as HTMLElement).style.display = "none");
  }, SHOW_ANIMATION_TIME);
}

class DatetimePicker {
  config!: DatetimePickerConfig;
  value!: string;
  renderInline!: boolean;
  trigger: Element | null = null;
  triggerHandler: ((e: Event) => void) | null = null;
  container: HTMLElement | null = null;
  valueMap: Record<string, string> | null = null;
  renderText!: boolean;
  yearScroller: Scroller | null = null;
  monthScroller: Scroller | null = null;
  dayScroller: Scroller | null = null;
  noonScroller: Scroller | null = null;
  hourScroller: Scroller | null = null;
  minuteScroller: Scroller | null = null;
  reMakeData!: boolean;
  willShow!: boolean;

  constructor(config: DatetimePickerConfig) {
    const self = this;
    self.config = {} as DatetimePickerConfig;
    self.value = config.value || "";
    each(DEFAULT_CONFIG as any, function (key: string, val: any) {
      (self.config as any)[key] =
        (config as any)[key] !== undefined ? (config as any)[key] : val;
    });

    this.renderInline = self.config.renderInline || false;

    if (config.defaultSelectedValue && !config.value) {
      self.config.value = config.defaultSelectedValue;
    }

    if (typeof this.config.startDate === "string") {
      this.config.startDate = new Date(
        (this.config.startDate as string).replace(/-/g, "/"),
      );
    }

    if (typeof this.config.endDate === "string") {
      this.config.endDate = new Date(
        (this.config.endDate as string).replace(/-/g, "/"),
      );
    }

    if (this.config.startDate && !this.config.endDate) {
      this.config.endDate = new Date("2030/12/31");
    }

    if (!this.config.startDate && this.config.endDate) {
      this.config.startDate = new Date(`${this.config.minYear}/01/01`);
    }

    this.reMakeData = !!(this.config.startDate && this.config.endDate);

    if (!this.renderInline) {
      let trigger = self.config.trigger;

      this.triggerHandler = function (e: Event) {
        e.preventDefault();
        self.show(self.value);
      };
      if (trigger && isBrowser) {
        trigger = self.trigger = getElement(trigger as string);
        this.trigger = trigger as Element;
        this.trigger &&
          this.trigger.addEventListener("click", this.triggerHandler, false);
      }
    }
  }

  _show(newValueMap: Record<string, string>) {
    const self = this;
    self._setText();
    if (self.container) {
      self.container.style.display = "block";
    }

    if (this.renderInline && self.container) {
      self.container.classList.add("wiux-datetime-view");
    }

    each(TYPE_MAP, function (type: string) {
      (self as any)[type + "Scroller"] &&
        (self as any)[type + "Scroller"].select(
          type === "noon" ? newValueMap[type] : trimZero(newValueMap[type]),
          false,
        );
    });

    setTimeout(function () {
      if (self.container) {
        self.container.style.transform = "translateY(0)";
      }
    }, 0);
  }

  show(value?: string) {
    if (!isBrowser) {
      return;
    }

    const self = this;
    const config = self.config;
    if (config.isOneInstance) {
      if (document.querySelector("#wiux-datetime-instance")) {
        return;
      }
      self.willShow = true;
    }

    CURRENT_PICKER = self;
    const valueMap = (self.valueMap = parseDate(
      config.format || "YYYY-MM-DD",
      value || config.value || "",
    ));
    const newValueMap: Record<string, string> = {};

    each(TYPE_MAP, function (type: string, list: string[]) {
      newValueMap[type] =
        list.length === 1
          ? valueMap[list[0]]
          : valueMap[list[0]] || valueMap[list[1]];
    });

    if (self.container) {
      self._show(newValueMap);
    } else {
      let template = config.template || TEMPLATE;
      if (config.orderMap) {
        for (const i in config.orderMap) {
          template = template.replace(
            `data-role="${i}"`,
            `data-role="${i}" style="order:${config.orderMap[i]}"`,
          );
        }
      }

      const container = (self.container = toElement(template) as HTMLElement);
      if (config.isOneInstance) {
        container.id = "wiux-datetime-instance";
      }
      if (!self.renderInline) {
        document.body.appendChild(container);
        self.container.style.display = "block";
      } else {
        const trigger = document.querySelector(self.config.trigger as string);
        if (trigger) {
          trigger.appendChild(container);
        }
      }

      each(TYPE_MAP, function (type: string) {
        const div = self.find("[data-role=" + type + "]");
        if (newValueMap[type] === undefined) {
          removeElement(div);
          return;
        }
        let data: any[];
        if (type === "day") {
          data = self._makeData(
            type,
            trimZero(newValueMap.year),
            trimZero(newValueMap.month),
          );
        } else if (type === "hour") {
          data = self._makeData(
            type,
            trimZero(newValueMap.year),
            trimZero(newValueMap.month),
            trimZero(newValueMap.day),
          );
        } else {
          data = self._makeData(type);
        }

        (self as any)[type + "Scroller"] = renderScroller(
          div!,
          data,
          trimZero(newValueMap[type]),
          function (currentValue: string) {
            setTimeout(function () {
              if (config.onSelect) {
                config.onSelect.call(self, type, currentValue, self.getValue());
              }
            }, 0);
            if (type === "year" || type === "month" || type === "day") {
              self.hourScroller &&
                self._setHourScroller(
                  self.yearScroller!.value!,
                  self.monthScroller?.value || "",
                  self.dayScroller?.value || "",
                  self.hourScroller.value!,
                );
            }
            let currentDay: string;
            if (type === "year") {
              const currentMonth = self.monthScroller
                ? self.monthScroller.value!
                : String(config.currentMonth);
              self._setMonthScroller(currentValue, currentMonth);
              if (self.dayScroller) {
                currentDay = self.dayScroller.value!;
                self._setDayScroller(currentValue, currentMonth, currentDay);
              }
            } else if (type === "month") {
              const currentYear = self.yearScroller
                ? self.yearScroller.value!
                : String(config.currentYear);
              if (self.dayScroller) {
                currentDay = self.dayScroller.value!;
                self._setDayScroller(currentYear, currentValue, currentDay);
              }
            }
          },
        );
      });

      if (!self.renderText && !self.renderInline) {
        if (self.config.confirmText) {
          const confirmEl = self.find("[data-role=confirm]");
          if (confirmEl) confirmEl.textContent = self.config.confirmText;
        }

        if (self.config.cancelText) {
          const cancelEl = self.find("[data-role=cancel]");
          if (cancelEl) cancelEl.textContent = self.config.cancelText;
        }
        if (self.config.clearText) {
          const clearEl = self.find("[data-role=clear]");
          if (clearEl) clearEl.textContent = self.config.clearText;
        }
        self.renderText = true;
      }

      this._show(newValueMap);

      const cancelBtn = self.find("[data-role=cancel]");
      if (cancelBtn) {
        cancelBtn.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            self.hide("Cancel");
          },
          false,
        );
      }

      const confirmBtn = self.find("[data-role=confirm]");
      if (confirmBtn) {
        confirmBtn.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            self.confirm();
          },
          false,
        );
      }

      if (self.config.clearText) {
        const clearBtn = self.find("[data-role=clear]");
        if (clearBtn) {
          clearBtn.addEventListener(
            "click",
            function (e) {
              e.preventDefault();
              self.clear();
            },
            false,
          );
        }
      }
    }

    if (!this.renderInline) {
      showMask();
      if (config.onShow) config.onShow.call(self);
    }
  }

  _setText() {
    // i18n support
  }

  _makeData(type: string, year?: string, month?: string, day?: string): any[] {
    const config = this.config;
    const valueMap = this.valueMap;
    const list = TYPE_MAP[type];
    let data: any[] = [];
    let min = 0;
    let max = 0;

    if (type === "year") {
      min = config.minYear || 2000;
      max = config.maxYear || 2030;
      if (this.reMakeData && this.config.startDate && this.config.endDate) {
        const { minYear, maxYear } = getYears(
          this.config.startDate as Date,
          this.config.endDate as Date,
        );
        min = minYear;
        max = maxYear;
      }
    } else if (type === "month") {
      min = 1;
      max = 12;
      if (
        this.reMakeData &&
        this.config.startDate &&
        this.config.endDate &&
        this.yearScroller
      ) {
        const { minMonth, maxMonth } = getMonths(
          this.config.startDate as Date,
          this.config.endDate as Date,
          parseInt(this.yearScroller.value!) * 1,
        );
        min = Math.max(min, minMonth);
        max = Math.min(max, maxMonth);
      }
    } else if (type === "day") {
      min = 1;
      max = getMaxDay(parseFloat(year!), parseFloat(month!));
      if (
        this.reMakeData &&
        this.config.startDate &&
        this.config.endDate &&
        this.yearScroller &&
        this.monthScroller
      ) {
        const { minDay, maxDay } = getDays(
          this.config.startDate as Date,
          this.config.endDate as Date,
          parseInt(this.yearScroller.value!) * 1,
          parseInt(this.monthScroller.value!) * 1,
        );
        min = Math.max(min, minDay);
        max = Math.min(max, maxDay);
      }
    } else if (type === "hour") {
      min = this.config.minHour || 0;
      max = this.config.maxHour || 23;
    } else if (type === "minute") {
      min = 0;
      max = 59;
    }

    for (let i = min; i <= max; i++) {
      let name: string;
      if (type === "year") {
        name = parseRow(config.yearRow || "{value}", i);
      } else {
        const val = valueMap && list[0] ? addZero(i) : i;
        name = parseRow((config as any)[type + "Row"] || "{value}", val);
      }
      data.push({
        name: name,
        value: i,
      });
    }

    if (type === "noon") {
      data.push({
        name: "\u4e0a\u5348",
        value: "AM",
      });
      data.push({
        name: "\u4e0b\u5348",
        value: "PM",
      });
    }

    if (type === "hour" && this.config.hourList) {
      data = this.config.hourList.map((hour) => {
        return {
          name: parseRow(config.hourRow || "{value}", hour),
          value: Number(hour),
        };
      });
    }

    if (type === "day" && this.config.computeDaysFunction) {
      const rs = this.config.computeDaysFunction(
        {
          year: parseFloat(year!),
          month: parseFloat(month!),
          min,
          max,
        },
        generateRange,
      );
      if (rs) {
        data = rs.map((day) => {
          return {
            name: parseRow(config.dayRow || "{value}", addZero(day)),
            value: Number(day),
          };
        });
      }
    }

    if (type === "hour" && this.config.computeHoursFunction) {
      const isTodayVal = isToday(
        new Date(`${year}/${month}/${day}`),
        new Date(),
      );
      const rs = this.config.computeHoursFunction(
        `${year}-${month}-${day}`,
        isTodayVal,
        generateRange,
      );
      data = rs.map((hour) => {
        return {
          name: parseRow(config.hourRow || "{value}", hour),
          value: Number(hour),
        };
      });
    }

    if (type === "minute" && this.config.minuteList) {
      data = this.config.minuteList.map((minute) => {
        return {
          name: parseRow(config.minuteRow || "{value}", minute),
          value: Number(minute),
        };
      });
    }
    return data;
  }

  _setMonthScroller(currentValue: string, month: string) {
    if (!this.monthScroller) {
      return;
    }
    const self = this;
    this.monthScroller.destroy();
    const div = self.find("[data-role=month]");
    self.monthScroller = renderScroller(
      div!,
      self._makeData("month"),
      month,
      function (currentValue: string) {
        if (self.config.onSelect)
          self.config.onSelect.call(
            self,
            "month",
            currentValue,
            self.getValue(),
          );
        if (self.dayScroller) {
          const currentYear = self.yearScroller
            ? self.yearScroller.value!
            : String(self.config.currentYear);
          const currentDay = self.dayScroller.value!;
          self._setDayScroller(currentYear, currentValue, currentDay);
        }
        if (self.yearScroller && self.monthScroller && self.hourScroller) {
          self._setHourScroller(
            self.yearScroller.value!,
            currentValue,
            self.dayScroller?.value || "",
            self.hourScroller.value!,
          );
        }
      },
    );
  }

  _setDayScroller(year: string, month: string, day: string) {
    if (!this.dayScroller) {
      return;
    }
    const self = this;
    const maxDay = getMaxDay(parseFloat(year), parseFloat(month));
    let adjustedDay = day;
    if (parseFloat(day) > maxDay) {
      adjustedDay = String(maxDay);
    }
    self.dayScroller!.destroy();
    const div = self.find("[data-role=day]");
    self.dayScroller = renderScroller(
      div!,
      self._makeData("day", year, month),
      adjustedDay,
      function (currentValue: string) {
        if (self.config.onSelect)
          self.config.onSelect.call(self, "day", currentValue, self.getValue());
        if (self.hourScroller) {
          self._setHourScroller(
            year,
            month,
            currentValue,
            self.hourScroller.value!,
          );
        }
      },
    );
  }

  _setHourScroller(year: string, month: string, day: string, hour: string) {
    if (!this.hourScroller) {
      return;
    }
    const self = this;
    self.hourScroller!.destroy();
    const div = self.find("[data-role=hour]");
    self.hourScroller = renderScroller(
      div!,
      self._makeData("hour", year, month, day),
      hour || "",
      function (currentValue: string) {
        if (self.config.onSelect)
          self.config.onSelect.call(
            self,
            "hour",
            currentValue,
            self.getValue(),
          );
      },
    );
  }

  find(selector: string): Element | null {
    return this.container ? this.container.querySelector(selector) : null;
  }

  hide(type?: string) {
    if (!this.container) {
      return;
    }
    const self = this;
    if (self.container!.style) {
      self.container!.style.removeProperty("transform");
    }

    setTimeout(function () {
      if (self.container) {
        self.container.style.display = "none";
      }
    }, SHOW_CONTAINER_TIME);

    hideMask();

    if (self.config.onHide) self.config.onHide.call(self, type || "");
    if (self.config.destroyOnHide) {
      setTimeout(() => {
        self.destroy();
      }, 500);
    }
  }

  select(type: string, value: string) {
    const scroller = (this as any)[type + "Scroller"] as Scroller;
    if (scroller) {
      scroller.select(value, false);
    }
  }

  destroy() {
    const self = this;
    if (this.trigger && this.triggerHandler) {
      this.trigger.removeEventListener("click", this.triggerHandler, false);
    }
    if (!self.config.isOneInstance && !self.willShow) {
      removeElement(MASK);
      MASK = null;
    }
    removeElement(self.container);
    self.container = null;
  }

  getValue(): string {
    const self = this;
    const config = self.config;

    let value = config.format || "YYYY-MM-DD";

    function formatValue(
      scroller: Scroller | null,
      expr1: string | undefined,
      expr2: string | undefined,
    ) {
      if (scroller) {
        const val = scroller.value;
        if (expr1 && val) {
          value = value.replace(new RegExp(expr1, "g"), addZero(val));
        }
        if (expr2 && val) {
          value = value.replace(new RegExp(expr2, "g"), trimZero(val));
        }
      }
    }

    each(TYPE_MAP, function (key: string, list: string[]) {
      formatValue((self as any)[key + "Scroller"], list[0], list[1]);
    });

    return value;
  }

  confirm() {
    const value = this.getValue();
    this.value = value;

    if (
      this.config.onConfirm &&
      this.config.onConfirm.call(this, value) === false
    ) {
      return;
    }

    this.hide("confirm");
  }

  clear() {
    const value = this.getValue();

    if (
      this.config.onClear &&
      this.config.onClear.call(this, value) === false
    ) {
      return;
    }

    this.hide("clear");
  }
}

export default DatetimePicker;
