import DatetimePicker from "../../components/datetime/datetimePicker";
import "../../components/datetime/index.vue";

interface DatetimeOptions {
  cancelText?: string;
  confirmText?: string;
  clearText?: string;
  format?: string;
  value?: string;
  startDate?: string;
  endDate?: string;
  minYear?: number;
  maxYear?: number;
  minHour?: number;
  maxHour?: number;
  hourList?: string[];
  minuteList?: string[];
  yearRow?: string;
  monthRow?: string;
  dayRow?: string;
  hourRow?: string;
  minuteRow?: string;
  defaultSelectedValue?: string;
  computeHoursFunction?: Function;
  computeDaysFunction?: Function;
  orderMap?: Record<string, number>;
  destroyOnHide?: boolean;
  isOneInstance?: boolean;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  onClear?: (value: string) => void;
  onShow?: () => void;
  onHide?: (type: string) => void;
}

let datetimeInstance: DatetimePicker | null = null;

export const datetime = {
  show(options: DatetimeOptions = {}) {
    if (datetimeInstance) {
      datetimeInstance.hide();
      datetimeInstance = null;
    }

    const opts: any = {
      destroyOnHide: true,
      isOneInstance: true,
      ...options,
    };

    if (opts.onConfirm) {
      const originalOnConfirm = opts.onConfirm;
      opts.onConfirm = function (value: string) {
        originalOnConfirm(value);
      };
    }

    if (opts.onCancel) {
      const originalOnCancel = opts.onCancel;
      opts.onHide = function (type: string) {
        if (type === "Cancel") {
          originalOnCancel();
        }
      };
    }

    if (opts.onClear) {
      const originalOnClear = opts.onClear;
      opts.onClear = function (value: string) {
        originalOnClear(value);
      };
    }

    datetimeInstance = new DatetimePicker(opts);
    datetimeInstance.show();
  },
  hide() {
    if (datetimeInstance) {
      datetimeInstance.hide();
      datetimeInstance = null;
    }
  },
};

export function useDatetime() {
  return datetime;
}
