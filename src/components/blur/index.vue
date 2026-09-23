<template>
  <div
    ref="blurRef"
    :style="{ height: height + 'px', position: 'relative', overflow: 'hidden' }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import { Blur } from "./blur";

export default defineComponent({
  name: "Blur",
  props: {
    blurAmount: {
      type: Number,
      default: 10,
    },
    url: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 200,
    },
  },
  setup(props) {
    const blurInstance = ref<any>(null);
    const blurRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      nextTick(() => {
        if (blurRef.value) {
          blurInstance.value = new Blur(blurRef.value, {
            url: props.url,
            blurAmount: props.blurAmount,
            imageClass: "wiux-bg-blur",
            duration: 100,
            opacity: 1,
          });
        }
      });
    });

    watch(
      () => props.blurAmount,
      (val) => {
        if (blurInstance.value) {
          blurInstance.value.setBlurAmount(val);
          blurInstance.value.generateBlurredImage(props.url);
        }
      },
    );

    watch(
      () => props.url,
      (val) => {
        if (blurInstance.value) {
          blurInstance.value.generateBlurredImage(val);
        }
      },
    );

    onBeforeUnmount(() => {
      blurInstance.value = null;
    });

    return {
      blurRef,
    };
  },
});
</script>

<style lang="less">
.wiux-bg-blur {
  z-index: -2;
  opacity: 0;
  position: absolute;
  min-height: 100%;
  display: block;
  top: 0;
  max-height: none;
  width: 100%;
  height: 100%;
  transition: opacity linear 0.8s;
}

.wiux-bg-blur-overlay {
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 1) 100%
  );
}
</style>
