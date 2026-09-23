<template>
  <div class="wiux-flexBox-item" :style="style">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed } from "vue";
import { FLEXBOX_KEY } from "./flexBox.vue";

const prefixList = ["-moz-box-", "-webkit-box-", ""];

export default defineComponent({
  name: "FlexBoxItem",
  props: {
    span: {
      type: [Number, String],
      default: "",
    },
    order: {
      type: [Number, String],
      default: "",
    },
  },
  setup(props) {
    const bodyWidth = ref(0);
    const flexboxContext = inject(FLEXBOX_KEY, {
      gutter: computed(() => 8),
      orient: computed(() => "horizontal"),
    });

    bodyWidth.value = document.documentElement.offsetWidth;

    const buildWidth = (width: number | string): number => {
      if (typeof width === "number") {
        if (width < 1) {
          return width;
        } else {
          return width / 12;
        }
      } else if (typeof width === "string") {
        return parseFloat(width.replace("px", "")) / bodyWidth.value;
      }
      return 0;
    };

    const style = computed(() => {
      const styles: Record<string, string> = {};
      const marginName =
        flexboxContext.orient.value === "horizontal"
          ? "marginLeft"
          : "marginTop";

      if (flexboxContext.gutter.value * 1 !== 0) {
        styles[marginName] = `${flexboxContext.gutter.value}px`;
      }

      if (props.span) {
        for (let i = 0; i < prefixList.length; i++) {
          styles[`${prefixList[i]}flex`] =
            `0 0 ${buildWidth(props.span) * 100}%`;
        }
      }
      if (typeof props.order !== "undefined") {
        styles.order = String(props.order);
      }
      return styles;
    });

    return { style };
  },
});
</script>
