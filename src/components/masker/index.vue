<template>
  <div class="wiux-masker-box">
    <slot></slot>
    <div
      class="wiux-masker"
      :class="{ 'wiux-masker-fullscreen': fullscreen }"
      :style="style"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { toRGB } from "./converter";

export default defineComponent({
  name: "Masker",
  props: {
    color: {
      type: String,
      default: "0, 0, 0",
    },
    opacity: {
      type: Number,
      default: 0.5,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const style = computed(() => {
      const color = /,/.test(props.color)
        ? props.color
        : toRGB(props.color.replace("#", "")).join(",");
      return {
        backgroundColor: `rgba(${color},${props.opacity})`,
      };
    });

    return {
      style,
    };
  },
});
</script>

<style>
.wiux-masker-box {
  position: relative;
}
.wiux-masker {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: inherit;
}
.wiux-masker-fullscreen {
  position: fixed;
  z-index: 10001;
}
</style>
