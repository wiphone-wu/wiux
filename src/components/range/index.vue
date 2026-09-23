<template>
  <div
    ref="boxRef"
    class="wiux-range-input-box"
    style="position: relative; margin-right: 30px; margin-left: 50px"
  >
    <input
      ref="inputRef"
      class="wiux-range-input"
      v-model.number="currentValue"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import Powerange from "./powerange";
import type { PowerangeOptions } from "./powerange";

export default defineComponent({
  name: "Range",
  props: {
    decimal: Boolean,
    modelValue: {
      default: 0,
      type: Number,
    },
    min: {
      type: Number,
      default: 0,
    },
    minHTML: String,
    maxHTML: String,
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    disabled: Boolean,
    disabledOpacity: Number,
    rangeBarHeight: {
      type: Number,
      default: 1,
    },
    rangeHandleHeight: {
      type: Number,
      default: 30,
    },
  },
  emits: ["update:modelValue", "on-change", "on-touchstart", "on-touchend"],
  setup(props, { emit }) {
    const currentValue = ref(props.modelValue);
    const boxRef = ref<HTMLElement | null>(null);
    const inputRef = ref<HTMLInputElement | null>(null);
    let range: any = null;
    let handleOrientationchange: (() => void) | null = null;

    const update = () => {
      let value = currentValue.value;
      if (value < props.min) {
        value = props.min;
      }
      if (value > props.max) {
        value = props.max;
      }
      if (range) {
        range.reInit({
          min: props.min,
          max: props.max,
          step: props.step,
          value,
        });
        currentValue.value = value;
        range.setStart(currentValue.value);
        range.setStep();
      }
    };

    onMounted(() => {
      nextTick(() => {
        const el = boxRef.value;
        if (!el) return;

        const parentNode = el.parentNode as HTMLElement;
        const computedWidth = parentNode
          ? window.getComputedStyle(parentNode).width.replace("px", "")
          : "300";

        const options: PowerangeOptions = {
          callback: (value: number) => {
            currentValue.value = value;
          },
          decimal: props.decimal,
          start: currentValue.value,
          min: props.min,
          max: props.max,
          minHTML: props.minHTML,
          maxHTML: props.maxHTML,
          disable: props.disabled,
          disabledOpacity: props.disabledOpacity,
          initialBarWidth: parseInt(computedWidth) - 80,
          onTouchstart: (e: Event) => {
            emit("on-touchstart", e);
          },
          onTouchend: (e: Event) => {
            emit("on-touchend", e);
          },
        };
        if (props.step !== 0) {
          options.step = props.step;
        }

        const inputEl = inputRef.value;
        if (inputEl) {
          range = Powerange(inputEl, options);
          const handleTop =
            (props.rangeHandleHeight - props.rangeBarHeight) / 2;
          const handleEl = el.querySelector(".range-handle") as HTMLElement;
          const barEl = el.querySelector(".range-bar") as HTMLElement;
          if (handleEl) {
            handleEl.style.top = `-${handleTop}px`;
          }
          if (barEl) {
            barEl.style.height = `${props.rangeBarHeight}px`;
          }
        }

        handleOrientationchange = () => {
          update();
        };
        window.addEventListener(
          "orientationchange",
          handleOrientationchange,
          false,
        );
      });
    });

    watch(currentValue, (val) => {
      if (range) {
        range.setStart(val);
      }
      emit("update:modelValue", val);
      emit("on-change", val);
    });

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = val;
      },
    );

    watch(
      () => props.min,
      () => {
        update();
      },
    );

    watch(
      () => props.step,
      () => {
        update();
      },
    );

    watch(
      () => props.max,
      () => {
        update();
      },
    );

    onBeforeUnmount(() => {
      if (handleOrientationchange) {
        window.removeEventListener(
          "orientationchange",
          handleOrientationchange,
          false,
        );
      }
    });

    return {
      currentValue,
      boxRef,
      inputRef,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
@import "./powerange.less";
</style>
