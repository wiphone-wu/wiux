<template>
  <div class="wiux-drawer">
    <div
      :style="{ transform: `translate3d(${translateX}px, 0, 0)` }"
      class="wiux-drawer-body"
    >
      <slot></slot>
      <div
        class="drawer-mask"
        :class="{ 'wiux-drawer-active': modelValue }"
        @click="hideMask"
      ></div>
    </div>
    <div
      ref="drawerRef"
      class="wiux-drawer-content"
      :style="drawerStyle"
      :class="[
        placement !== 'left' ? 'drawer-right' : 'drawer-left',
        { 'wiux-drawer-active': modelValue },
      ]"
    >
      <slot name="drawer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, type PropType } from "vue";

export default defineComponent({
  name: "Drawer",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String as PropType<"left" | "right">,
      default: "left",
    },
    showMode: {
      type: String as PropType<"push" | "overlay">,
      default: "overlay",
    },
    drawerStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue", "on-show", "on-hide"],
  setup(props, { emit }) {
    const drawerRef = ref<HTMLElement | null>(null);
    const drawerWidth = ref(0);
    const translateX = ref(0);

    function getDrawerWidth(): number {
      if (props.drawerStyle && (props.drawerStyle as any).width) {
        const match = String((props.drawerStyle as any).width).match(/(\d+)/);
        if (match) return parseInt(match[1], 10);
      }
      if (drawerRef.value) {
        return drawerRef.value.clientWidth;
      }
      return 0;
    }

    watch(
      () => props.modelValue,
      (val) => {
        if (!val) {
          emit("on-hide");
        } else {
          emit("on-show");
        }

        if (props.showMode === "overlay") {
          return;
        }

        if (!val) {
          translateX.value = 0;
        } else {
          drawerWidth.value = getDrawerWidth();
          translateX.value =
            props.placement === "left" ? drawerWidth.value : -drawerWidth.value;
        }
      },
    );

    function hideMask() {
      emit("update:modelValue", false);
    }

    onMounted(() => {
      drawerWidth.value = getDrawerWidth();
    });

    return {
      drawerRef,
      translateX,
      hideMask,
    };
  },
});
</script>

<style lang="less">
.wiux-drawer {
  display: block;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wiux-drawer > .wiux-drawer-body {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition:
    transform ease-in-out 0.38s,
    visibility 0.38s;
}

.wiux-drawer > .wiux-drawer-body > .drawer-mask {
  z-index: 9999;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity ease-in-out 0.38s,
    visibility ease-in-out 0.38s;
  background-color: rgba(0, 0, 0, 0.3);
}

.wiux-drawer > .wiux-drawer-body > .wiux-drawer-active {
  visibility: visible;
  opacity: 1;
}

.wiux-drawer > .wiux-drawer-content {
  background-color: #fff;
  position: absolute;
  top: 0;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  visibility: hidden;
  transition:
    transform ease-in-out 0.38s,
    visibility 0.38s;
  will-change: none;
  z-index: 10000;
}

.wiux-drawer > .drawer-left {
  left: 0;
  transform: translateX(-100%);
}

.wiux-drawer > .drawer-right {
  right: 0;
  transform: translateX(100%);
}

.wiux-drawer > .wiux-drawer-active {
  pointer-events: inherit;
  visibility: visible;
  transform: translateX(0%);
}
</style>
