<template>
  <div class="wiux-sticky-box" ref="stickyBoxRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  onActivated,
  nextTick,
  type Ref,
} from "vue";
import { sticky } from "./sticky";

export default defineComponent({
  name: "Sticky",
  props: {
    scrollBox: {
      type: String,
      default: "",
    },
    offset: {
      type: Number,
      default: 0,
    },
    checkStickySupport: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    const initTimes = ref(0);
    const stickyBoxRef: Ref<HTMLElement | null> = ref(null);

    function bindSticky() {
      console.log(
        "[Sticky] bindSticky() called, disabled =",
        props.disabled,
        ", stickyBoxRef =",
        !!stickyBoxRef.value,
      );
      if (props.disabled) {
        console.log("[Sticky] bindSticky() skipped: disabled");
        return;
      }
      if (!stickyBoxRef.value) {
        console.log("[Sticky] bindSticky() skipped: no stickyBoxRef");
        return;
      }
      nextTick(() => {
        console.log(
          "[Sticky] bindSticky() nextTick, stickyBoxRef =",
          !!stickyBoxRef.value,
        );
        if (stickyBoxRef.value) {
          console.log(
            "[Sticky] calling sticky() with scrollBox =",
            props.scrollBox,
            ", offset =",
            props.offset,
            ", checkStickySupport =",
            props.checkStickySupport,
          );
          sticky(stickyBoxRef.value, {
            scrollBox: props.scrollBox,
            offset: props.offset,
            checkStickySupport: props.checkStickySupport,
          });
        }
      });
    }

    onMounted(() => {
      console.log("[Sticky] onMounted()");
      nextTick(() => {
        console.log("[Sticky] onMounted() nextTick, calling bindSticky()");
        bindSticky();
      });
    });

    onActivated(() => {
      if (initTimes.value > 0) {
        bindSticky();
      }
      initTimes.value++;
    });

    onBeforeUnmount(() => {
      // cleanup
    });

    expose({
      bindSticky,
    });

    return {
      stickyBoxRef,
      bindSticky,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-sticky-box {
  z-index: @sticky-zIndex;
}
.wiux-sticky {
  width: 100%;
  position: sticky;
  top: 0;
}
.wiux-fixed {
  width: 100%;
  position: fixed;
  top: 0;
  transform: translate3d(0, 0, 0);
}
.wiux-sticky-fill {
  display: none;
}
.wiux-fixed + .wiux-sticky-fill {
  display: block;
}
</style>
