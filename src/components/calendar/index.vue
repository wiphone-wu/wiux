<template>
  <div class="wiux-calendar">
    <cell
      :title="title"
      primary="content"
      @click="onClick"
      :is-link="!readonly"
    >
      <span class="wiux-cell-placeholder" v-if="shouldShowPlaceholder">{{
        placeholder
      }}</span>
      <span class="wiux-cell-value" v-if="!shouldShowPlaceholder">{{
        displayFormat(resolvedValue, getType(resolvedValue))
      }}</span>
    </cell>
    <Teleport to="body" v-if="shouldTransferDom">
      <popup v-model="show" @on-show="onPopupShow" @on-hide="onPopupHide">
        <popup-header
          v-if="shouldConfirm"
          @on-click-left="onClickLeft"
          @on-click-right="onClickRight"
          :title="popupHeaderTitle"
          :left-text="cancelText || t('Cancel')"
          :right-text="confirmText || t('Done')"
        ></popup-header>

        <inline-calendar
          v-model="currentValue"
          @on-change="onCalendarValueChange"
          @on-select-single-date="onSelectSingleDate"
          :render-month="renderMonth"
          :start-date="startDate"
          :end-date="endDate"
          :show-last-month="showLastMonth"
          :show-next-month="showNextMonth"
          :highlight-weekend="highlightWeekend"
          :return-six-rows="returnSixRows"
          :hide-header="hideHeader"
          :hide-week-list="hideWeekList"
          :replace-text-list="replaceTextList"
          :weeks-list="weeksList"
          :render-function="renderFunction"
          :render-on-value-change="renderOnValueChange"
          :disable-past="disablePast"
          :disable-future="disableFuture"
          :marks="marks"
          :disable-weekend="disableWeekend"
          :disable-date-function="disableDateFunction"
        ></inline-calendar>
      </popup>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, type PropType } from "vue";
import { useLocale } from "../../composables/useLocale";

import InlineCalendar from "../inline-calendar/index.vue";
import Popup from "../popup/index.vue";
import Cell from "../cell/index.vue";
import PopupHeader from "../popup-header/index.vue";
import format from "../../tools/date/format";

const getType = (value: any): string => {
  if (typeof value === "string") {
    return "string";
  }
  if (Object.prototype.toString.call(value) === "[object Array]") {
    return "array";
  }
  return "";
};

const pure = function (value: any) {
  const type = getType(value);
  if (type === "string") {
    return value;
  } else if (type === "array") {
    return JSON.parse(JSON.stringify(value));
  }
  return value;
};

export default defineComponent({
  name: "Calendar",
  components: {
    InlineCalendar,
    Popup,
    PopupHeader,
    Cell,
  },
  props: {
    modelValue: {
      type: [String, Array] as PropType<string | string[]>,
      default: "",
    },
    value: {
      type: [String, Array] as PropType<string | string[]>,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
    showPopupHeader: {
      type: Boolean,
      default: false,
    },
    popupHeaderTitle: {
      type: String,
    },
    cancelText: {
      type: String,
      default: "",
    },
    confirmText: {
      type: String,
      default: "",
    },
    displayFormat: {
      type: Function,
      default: (value: any) => {
        return typeof value === "string" ? value : value.join(", ");
      },
    },
    shouldTransferDom: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    renderMonth: {
      type: Array,
      default: () => [null, null],
    },
    startDate: String,
    endDate: String,
    showLastMonth: {
      type: Boolean,
      default: true,
    },
    showNextMonth: {
      type: Boolean,
      default: true,
    },
    highlightWeekend: {
      type: Boolean,
      default: false,
    },
    returnSixRows: {
      type: Boolean,
      default: true,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideWeekList: {
      type: Boolean,
      default: false,
    },
    replaceTextList: {
      type: Object,
      default: () => ({}),
    },
    weeksList: Array,
    renderFunction: {
      type: Function,
      default: () => "",
    },
    renderOnValueChange: {
      type: Boolean,
      default: true,
    },
    disablePast: {
      type: Boolean,
      default: false,
    },
    disableFuture: {
      type: Boolean,
      default: false,
    },
    disableWeekend: {
      type: Boolean,
      default: false,
    },
    disableDateFunction: Function,
    marks: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "input", "on-show", "on-hide", "on-change"],
  setup(props, { emit }) {
    const { t } = useLocale();
    const show = ref(false);
    const currentValue = ref<string | string[]>("");

    const resolvedValue = computed(() => {
      return props.modelValue || props.value;
    });

    const shouldConfirm = computed(() => {
      return props.showPopupHeader || getType(resolvedValue.value) === "array";
    });

    const shouldShowPlaceholder = computed(() => {
      const val = resolvedValue.value;
      if (typeof val === "string" && !val) {
        return true;
      }
      if (getType(val) === "array" && !(val as string[]).length) {
        return true;
      }
      return false;
    });

    const initValue = () => {
      const val = resolvedValue.value;
      console.log(
        "[Calendar] initValue - resolvedValue:",
        val,
        "getType:",
        getType(val),
      );
      if (val === "TODAY") {
        currentValue.value = format(new Date(), "YYYY-MM-DD");
        emit("update:modelValue", currentValue.value);
        emit("input", currentValue.value);
      } else {
        if (getType(val) === "string") {
          currentValue.value = val as string;
        } else {
          currentValue.value = pure(val);
        }
      }
    };

    initValue();

    watch(
      () => props.modelValue,
      (newVal: any, oldVal: any) => {
        if (getType(newVal) === "string") {
          currentValue.value = newVal;
          emit("on-change", newVal);
        } else {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            emit("on-change", pure(newVal));
          }
          currentValue.value = pure(newVal);
        }
      },
    );

    watch(
      () => props.value,
      (newVal: any, oldVal: any) => {
        if (getType(newVal) === "string") {
          currentValue.value = newVal;
          emit("on-change", newVal);
        } else {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            emit("on-change", pure(newVal));
          }
          currentValue.value = pure(newVal);
        }
      },
    );

    const onClick = () => {
      if (!props.readonly) {
        show.value = true;
      }
    };

    const onPopupShow = () => {
      emit("on-show");
    };

    const onPopupHide = () => {
      emit("on-hide");
      currentValue.value = pure(resolvedValue.value);
    };

    const onClickLeft = () => {
      show.value = false;
      currentValue.value = pure(resolvedValue.value);
    };

    const onClickRight = () => {
      show.value = false;
      const value = pure(currentValue.value);
      console.log(
        "[Calendar] onClickRight - currentValue:",
        currentValue.value,
        "emitting:",
        value,
      );
      emit("update:modelValue", value);
      emit("input", value);
    };

    const onCalendarValueChange = (val: any) => {
      console.log(
        "[Calendar] onCalendarValueChange - val:",
        val,
        "shouldConfirm:",
        shouldConfirm.value,
      );
      if (!shouldConfirm.value) {
        show.value = false;
        emit("update:modelValue", pure(val));
        emit("input", pure(val));
      }
    };

    const onSelectSingleDate = () => {
      if (!shouldConfirm.value) {
        show.value = false;
      }
    };

    return {
      t,
      show,
      currentValue,
      resolvedValue,
      shouldConfirm,
      shouldShowPlaceholder,
      getType,
      onClick,
      onPopupShow,
      onPopupHide,
      onClickLeft,
      onClickRight,
      onCalendarValueChange,
      onSelectSingleDate,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/weui/base/fn";
@import "../../styles/weui/base/mixin/setOnepx.less";

.wiux-calendar {
  position: relative;
  &:before {
    .setTopLine(@weuiCellBorderColor);
    left: @weuiCellGapH;
  }
}
</style>