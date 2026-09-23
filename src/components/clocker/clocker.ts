export interface CountdownOffset {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
  [key: string]: number;
}

export interface TickEvent {
  finalDate: Date;
  offset: CountdownOffset;
  strftime: (format: string) => string;
}

export type TickCallback = (event: TickEvent) => void;
export type FinishCallback = () => void;

const matchers = [
  /^[0-9]*$/,
  /([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/,
  /[0-9]{4}([/-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/,
];

function parseDateString(dateString: string | number | Date): Date {
  if (dateString instanceof Date) {
    return dateString;
  }
  const str = String(dateString);
  const isMatch = matchers.some((m) => m.test(str));
  if (isMatch) {
    if (/^[0-9]*$/.test(str)) {
      return new Date(Number(str));
    }
    return new Date(str.replace(/-/g, "/"));
  }
  throw new Error(`Couldn't cast \`${dateString}\` to a date object.`);
}

const DIRECTIVE_KEY_MAP: Record<string, string> = {
  Y: "years",
  m: "months",
  w: "weeks",
  D: "days",
  H: "hours",
  M: "minutes",
  S: "seconds",
};

function escapedRegExp(str: string): RegExp {
  const sanitize = str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  return new RegExp(sanitize);
}

function splitNumber(number: number): string[] {
  let str = String(number);
  str = str.length === 1 ? "0" + str : str;
  return str.split("");
}

function pluralize(format: string, count: number): string {
  let plural = "s";
  let singular = "";
  if (format) {
    const parts = format.replace(/(:||\s)/gi, "").split(/,/);
    if (parts.length === 1) {
      plural = parts[0];
    } else {
      singular = parts[0];
      plural = parts[1];
    }
  }
  return Math.abs(count) === 1 ? singular : plural;
}

export class Countdown {
  private options: { precision: number };
  private interval: ReturnType<typeof setInterval> | null = null;
  private finalDate!: Date;
  private totalSecsLeft: number = 0;
  private offset: CountdownOffset = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    weeks: 0,
    months: 0,
    years: 0,
  };
  private tickCallback: TickCallback | null = null;
  private finishCallback: FinishCallback | null = null;

  constructor(
    finalDate: string | number | Date,
    options?: { precision?: number },
  ) {
    this.options = { precision: options?.precision || 100 };
    this.setFinalDate(finalDate);
  }

  onTick(callback: TickCallback): this {
    this.tickCallback = callback;
    return this;
  }

  onFinish(callback: FinishCallback): this {
    this.finishCallback = callback;
    return this;
  }

  setFinalDate(value: string | number | Date): this {
    this.finalDate = parseDateString(value);
    return this;
  }

  start(): this {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.update();
    if (this.totalSecsLeft > 0) {
      this.interval = setInterval(() => {
        this.update();
      }, this.options.precision);
    }
    return this;
  }

  stop(): this {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
    return this;
  }

  remove(): void {
    this.stop();
  }

  private getOffset(): CountdownOffset {
    this.totalSecsLeft = this.finalDate.getTime() - new Date().getTime();
    this.totalSecsLeft = Math.ceil(this.totalSecsLeft / 1000);
    this.totalSecsLeft = this.totalSecsLeft < 0 ? 0 : this.totalSecsLeft;

    return {
      seconds: this.totalSecsLeft % 60,
      minutes: Math.floor(this.totalSecsLeft / 60) % 60,
      hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
      days: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
      weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
      months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30),
      years: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 365),
    };
  }

  private update(): void {
    this.offset = this.getOffset();
    const list = ["days", "hours", "minutes", "seconds"] as const;
    for (const key of list) {
      const numbers = splitNumber(this.offset[key]);
      while (numbers.length < 3) {
        numbers.unshift("0");
      }
      for (let n = 0; n < numbers.length; n++) {
        this.offset[`${key}_${n + 1}`] = Number(numbers[n]);
      }
    }

    if (this.totalSecsLeft === 0) {
      this.stop();
      if (this.finishCallback) {
        this.finishCallback();
      }
    } else {
      this.dispatchEvent();
    }
  }

  private dispatchEvent(): void {
    const event: TickEvent = {
      finalDate: this.finalDate,
      offset: this.offset,
      strftime: (format: string) => {
        return this.strftime(this.offset, format);
      },
    };
    if (this.tickCallback) {
      this.tickCallback(event);
    }
  }

  private strftime(offsetObject: CountdownOffset, format: string): string {
    const directives = format.match(/%(-|!)?[A-Z]{1}(:[^]+)?/gi);
    let d2h = false;
    if (
      directives &&
      directives.indexOf("%D") < 0 &&
      directives.indexOf("%H") >= 0
    ) {
      d2h = true;
    }
    if (directives) {
      for (let i = 0, len = directives.length; i < len; ++i) {
        const directive = directives[i].match(/%(-|!)?([a-zA-Z]{1})(:[^]+)?/);
        if (!directive) continue;
        const regexp = escapedRegExp(directive[0]);
        const modifier = directive[1] || "";
        const plural = directive[3] || "";
        let value: number | null = null;
        const dir = directive[2];

        if (DIRECTIVE_KEY_MAP.hasOwnProperty(dir)) {
          const key = DIRECTIVE_KEY_MAP[dir];
          value = Number(offsetObject[key]);
          if (key === "hours" && d2h) {
            value += Number(offsetObject["days"]) * 24;
          }
        }
        if (value !== null) {
          if (modifier === "!") {
            format = format.replace(regexp, pluralize(plural, value));
          }
          if (modifier === "") {
            format = format.replace(
              regexp,
              value < 10 ? "0" + value : String(value),
            );
          }
          if (modifier === "-") {
            format = format.replace(regexp, String(value));
          }
        }
      }
    }
    format = format
      .replace("%_M1", String(offsetObject.minutes_1))
      .replace("%_M2", String(offsetObject.minutes_2))
      .replace("%_S1", String(offsetObject.seconds_1))
      .replace("%_S2", String(offsetObject.seconds_2))
      .replace("%_S3", String(offsetObject.seconds_3))
      .replace("%_H1", String(offsetObject.hours_1))
      .replace("%_H2", String(offsetObject.hours_2))
      .replace("%_H3", String(offsetObject.hours_3))
      .replace("%_D1", String(offsetObject.days_1))
      .replace("%_D2", String(offsetObject.days_2))
      .replace("%_D3", String(offsetObject.days_3));
    format = format.replace(/%%/, "%");
    return format;
  }
}
