<template>
  <span
    ref="elRef"
    class="wiux-spinner"
    :class="className"
    :style="styles"
  ></span>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, nextTick } from "vue";
import Spinner from "./spinner";

const types = [
  "android",
  "ios",
  "ios-small",
  "bubbles",
  "circles",
  "crescent",
  "dots",
  "lines",
  "ripple",
  "spiral",
];

export default defineComponent({
  name: "Spinner",
  props: {
    type: {
      type: String,
      default: "ios",
    },
    size: String,
  },
  setup(props) {
    const elRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      nextTick(() => {
        if (elRef.value) {
          Spinner(elRef.value, props.type, props.size);
        }
      });
    });

    const styles = computed(() => {
      if (typeof props.size !== "undefined" && props.size !== "28px") {
        return {
          width: props.size,
          height: props.size,
        };
      }
      return {};
    });

    const className = computed(() => {
      const rs: Record<string, boolean> = {};
      for (let i = 0; i < types.length; i++) {
        rs[`wiux-spinner-${types[i]}`] = props.type === types[i];
      }
      return rs;
    });

    return {
      elRef,
      styles,
      className,
    };
  },
});
</script>

<style>
.wiux-spinner {
  stroke: #444;
  fill: #444;
  vertical-align: middle;
  display: inline-block;
  width: 28px;
  height: 28px;
}

.wiux-spinner svg {
  width: 28px;
  height: 28px;
}

.wiux-spinner.wiux-spinner-inverse {
  stroke: #fff;
  fill: #fff;
}

.wiux-spinner-android {
  stroke: #4b8bf4;
}

.wiux-spinner-ios,
.wiux-spinner-ios-small {
  stroke: #69717d;
}

.wiux-spinner-spiral .stop1 {
  stop-color: #fff;
  stop-opacity: 0;
}

.wiux-spinner-spiral.wiux-spinner-inverse .stop1 {
  stop-color: #000;
}

.wiux-spinner-spiral.wiux-spinner-inverse .stop2 {
  stop-color: #fff;
}
</style>
