<template>
  <div class="weui-wePay-flow__line" :class="classes" :style="styles">
    <div
      class="weui-wePay-flow__process"
      :style="{ width: getWidth(processSpan) }"
    ></div>
    <div
      v-if="tip"
      :class="`weui-wePay-flow__info-${finalTipDirection}`"
      :style="{ left: getWidth(processSpan) }"
    >
      {{ tip }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from "vue";

export default defineComponent({
  name: "FlowLine",
  props: {
    tip: String,
    tipDirection: String,
    isDone: Boolean,
    lineSpan: [Number, String],
    processSpan: [Number, String],
  },
  setup(props) {
    const instance = getCurrentInstance();

    function getWidth(span: string | number | undefined): string | undefined {
      return typeof span === "number" ? `${span}%` : span;
    }

    const finalTipDirection = computed(() => {
      if (typeof props.tipDirection === "undefined") {
        return (instance?.proxy?.$parent as any)?.orientation === "vertical"
          ? "left"
          : "top";
      }
      return props.tipDirection as string;
    });

    const styles = computed(() => {
      const direction = (instance?.proxy?.$parent as any)?.orientation;
      const stylesObj: Record<string, string> = {};
      if (props.lineSpan) {
        if (direction === "vertical") {
          stylesObj.height = getWidth(props.lineSpan as string | number) || "";
        } else {
          stylesObj.width = getWidth(props.lineSpan as string | number) || "";
        }
        stylesObj.flex = "none";
        stylesObj["-webkit-box-flex"] = "0";
      }
      if (direction === "vertical" && !props.lineSpan) {
        stylesObj.width = "3px";
      }
      return Object.keys(stylesObj).length ? stylesObj : undefined;
    });

    const classes = computed(() => {
      return {
        "weui-wePay-flow__line_done": !!props.isDone,
        "weui-wePay-flow__line_ing": !props.isDone && !!props.tip,
      };
    });

    return {
      getWidth,
      finalTipDirection,
      styles,
      classes,
    };
  },
});
</script>
