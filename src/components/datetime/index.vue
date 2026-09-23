<template>
  <a
    class="wiux-datetime weui-cell"
    :class="{ 'weui-cell_access': !readonly }"
    href="javascript:"
  >
    <slot>
      <div>
        <slot name="title">
          <p :style="labelStyle" :class="labelClass" v-html="title"></p>
        </slot>
        <inline-desc v-if="inlineDesc">{{ inlineDesc }}</inline-desc>
      </div>
      <div
        class="weui-cell__ft wiux-cell-primary wiux-datetime-value"
        :style="valueTextAlign ? `text-align:${valueTextAlign}` : ''"
      >
        <span
          class="wiux-cell-placeholder"
          v-if="!currentValue && placeholder"
          >{{ placeholder }}</span
        >
        <span class="wiux-cell-value" v-if="currentValue">{{
          displayFormat ? displayFormat(currentValue) : currentValue
        }}</span>
        <icon
          class="wiux-input-icon"
          type="warn"
          v-show="!valid"
          :title="firstError"
        ></icon>
      </div>
    </slot>
  </a>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  inject,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import { useLocale } from "../../composables/useLocale";
import Icon from "../icon/index.vue";
import InlineDesc from "../inline-desc/index.vue";
import Picker from "./datetimePicker";
import format from "../../tools/date/format";

export default defineComponent({
  name: "Datetime",
  components: {
    Icon,
    InlineDesc,
  },
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
  setup(props, { emit }) {
    const { t } = useLocale();
    const instance = getCurrentInstance();
    const parentLabelWidth = inject(
      "parentLabelWidth",
      computed(() => ""),
    );
    const parentLabelAlign = inject(
      "parentLabelAlign",
      computed(() => ""),
    );
    const parentLabelMarginRight = inject(
      "parentLabelMarginRight",
      computed(() => ""),
    );
    const uuid = Math.random().toString(36).substring(3, 8);
    const currentShow = ref(false);
    const currentValue = ref(props.modelValue);
    const valid = ref(true);
    const errors = ref<Record<string, string>>({});
    let picker: InstanceType<typeof Picker> | null = null;
    let isFirstSetValue = false;

    const labelStyle = computed(() => {
      const parent = instance?.proxy?.$parent;
      if (!parent) return {};
      return {
        width: parentLabelWidth.value || (parent as any).labelWidth,
        textAlign: parentLabelAlign.value || (parent as any).labelAlign,
        marginRight:
          parentLabelMarginRight.value || (parent as any).labelMarginRight,
      };
    });

    const labelClass = computed(() => {
      const parent = instance?.proxy?.$parent;
      const align =
        parentLabelAlign.value ||
        (parent as any)?.labelAlign ||
        (parent as any)?.$parent?.labelAlign;
      return {
        "wiux-cell-justify": align === "justify",
      };
    });

    const firstError = computed(() => {
      const key = Object.keys(errors.value)[0];
      return errors.value[key];
    });

    const pickerOptions = computed(() => {
      const options: any = {
        trigger: `#wiux-datetime-${uuid}`,
        format: props.format,
        value: currentValue.value,
        confirmText: props.confirmText || t("Done"),
        cancelText: props.cancelText || t("Cancel"),
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
        onSelect(type: string, val: string, wholeValue: string) {
          if (picker && picker.config.renderInline) {
            emit("update:modelValue", wholeValue);
            emit("on-change", wholeValue);
          }
        },
        onConfirm(value: string) {
          currentValue.value = value;
        },
        onClear(value: string) {
          emit("on-clear", value);
        },
        onHide(type: string) {
          currentShow.value = false;
          emit("update:show", false);
          validate();
          emit("on-hide", type);
          if (type === "Cancel") {
            emit("on-cancel");
          }
          if (type === "confirm") {
            setTimeout(() => {
              emit("on-confirm", currentValue.value);
            });
          }
        },
        onShow() {
          currentShow.value = true;
          emit("update:show", true);
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
    });

    function renderPicker() {
      if (picker) {
        picker.destroy();
      }
      picker = new Picker(pickerOptions.value);
    }

    function validate() {
      if (!currentValue.value && props.required) {
        valid.value = false;
        errors.value = { required: "必填" };
        return;
      }
      valid.value = true;
      errors.value = {};
    }

    onMounted(() => {
      const el = instance?.proxy?.$el;
      if (el) {
        el.setAttribute("id", `wiux-datetime-${uuid}`);
      }
      if (!props.readonly) {
        renderPicker();
        if (props.show) {
          picker?.show(currentValue.value);
        }
      }
    });

    watch(
      () => props.readonly,
      (val) => {
        if (val) {
          picker?.destroy();
        } else {
          renderPicker();
        }
      },
    );

    watch(
      () => props.show,
      (val) => {
        if (val === currentShow.value) return;
        if (val) {
          picker?.show(currentValue.value);
        } else {
          picker?.hide();
        }
      },
    );

    watch(currentValue, (val, oldVal) => {
      emit("update:modelValue", val);
      if (!isFirstSetValue) {
        isFirstSetValue = true;
        if (oldVal) {
          emit("on-change", val);
        }
      } else {
        emit("on-change", val);
      }
      validate();
    });

    watch(
      () => props.startDate,
      () => {
        renderPicker();
      },
    );

    watch(
      () => props.endDate,
      () => {
        renderPicker();
      },
    );

    watch(
      () => props.format,
      (val) => {
        if (currentValue.value) {
          currentValue.value = format(currentValue.value, val);
        }
        renderPicker();
      },
    );

    watch(
      () => props.modelValue,
      (val) => {
        if (props.readonly || (picker && picker.config.renderInline)) {
          currentValue.value = val;
          return;
        }
        if (currentValue.value !== val) {
          currentValue.value = val;
          renderPicker();
        }
      },
    );

    onBeforeUnmount(() => {
      picker?.destroy();
    });

    return {
      currentValue,
      valid,
      firstError,
      labelStyle,
      labelClass,
    };
  },
});
</script>

<style lang="less">
@import "./style.less";

.wiux-datetime-clear {
  text-align: center;
}
</style>