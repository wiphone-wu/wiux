<template>
  <div></div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import Picker from "../datetime/datetimePicker";
import format from "../../tools/date/format";

export default defineComponent({
  name: "DatetimeView",
  props: {
    format: {
      type: String,
      default: "YYYY-MM-DD",
    },
    title: String,
    modelValue: {
      type: String,
      default: "",
    },
    inlineDesc: String,
    placeholder: String,
    minYear: Number,
    maxYear: Number,
    confirmText: String,
    cancelText: String,
    clearText: String,
    yearRow: {
      type: String,
      default: "{value}",
    },
    monthRow: {
      type: String,
      default: "{value}",
    },
    dayRow: {
      type: String,
      default: "{value}",
    },
    hourRow: {
      type: String,
      default: "{value}",
    },
    minuteRow: {
      type: String,
      default: "{value}",
    },
    required: {
      type: Boolean,
      default: false,
    },
    minHour: {
      type: Number,
      default: 0,
    },
    maxHour: {
      type: Number,
      default: 23,
    },
    startDate: String,
    endDate: String,
    valueTextAlign: String,
    displayFormat: Function,
    readonly: Boolean,
    hourList: Array,
    minuteList: Array,
    show: Boolean,
    defaultSelectedValue: String,
    computeHoursFunction: Function,
    computeDaysFunction: Function,
    orderMap: Object,
  },
  emits: [
    "update:modelValue",
    "on-change",
    "on-clear",
    "on-hide",
    "on-cancel",
    "on-confirm",
    "on-show",
    "update:show",
  ],
  setup(props, { emit, expose }) {
    const instance = getCurrentInstance();
    const uuid = Math.random().toString(36).substring(3, 8);
    let picker: InstanceType<typeof Picker> | null = null;
    let isFirstSetValue = false;
    const currentValue = ref(props.modelValue);

    function buildPickerOptions() {
      const options: any = {
        trigger: `#wiux-datetime-view-${uuid}`,
        format: props.format,
        value: currentValue.value,
        confirmText: props.confirmText || "完成",
        cancelText: props.cancelText || "取消",
        clearText: props.clearText,
        yearRow: props.yearRow,
        monthRow: props.monthRow,
        dayRow: props.dayRow,
        hourRow: props.hourRow,
        minuteRow: props.minuteRow,
        minHour: props.minHour,
        maxHour: props.maxHour,
        startDate: props.startDate,
        endDate: props.endDate,
        hourList: props.hourList,
        minuteList: props.minuteList,
        defaultSelectedValue: props.defaultSelectedValue,
        computeHoursFunction: props.computeHoursFunction,
        computeDaysFunction: props.computeDaysFunction,
        orderMap: props.orderMap || {},
        renderInline: true,
        onSelect(type: string, val: string, wholeValue: string) {
          emit("update:modelValue", wholeValue);
          emit("on-change", wholeValue);
        },
        onConfirm(value: string) {
          emit("on-confirm", value);
        },
        onClear(value: string) {
          emit("on-clear", value);
        },
        onHide(type: string) {
          emit("on-hide", type);
          if (type === "Cancel") {
            emit("on-cancel");
          }
        },
        onShow() {
          emit("on-show");
        },
      };
      if (props.minYear) {
        options.minYear = props.minYear;
      }
      if (props.maxYear) {
        options.maxYear = props.maxYear;
      }
      return options;
    }

    function render() {
      if (picker) {
        picker.destroy();
      }
      picker = new Picker(buildPickerOptions());
      picker.show();
    }

    onMounted(() => {
      const el = instance?.proxy?.$el;
      if (el) {
        el.setAttribute("id", `wiux-datetime-view-${uuid}`);
      }
      render();
    });

    onBeforeUnmount(() => {
      picker?.destroy();
    });

    watch(
      () => props.modelValue,
      (val) => {
        if (props.readonly || (picker && picker.config.renderInline)) {
          currentValue.value = val;
          return;
        }
        if (currentValue.value !== val) {
          currentValue.value = val;
          render();
        }
      },
    );

    watch(
      () => props.format,
      (val) => {
        if (currentValue.value) {
          currentValue.value = format(currentValue.value, val);
        }
        render();
      },
    );

    watch(
      () => props.startDate,
      () => {
        render();
      },
    );

    watch(
      () => props.endDate,
      () => {
        render();
      },
    );

    watch(
      () => props.show,
      (val) => {
        if (val) {
          picker?.show(currentValue.value);
        } else {
          picker?.hide(currentValue.value);
        }
      },
    );

    expose({ render });

    return {};
  },
});
</script>
