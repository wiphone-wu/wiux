<template>
  <Teleport to="body">
    <div
      v-if="showMask"
      class="wiux-popup-mask"
      :class="{ 'wiux-popup-show': modelValue }"
      :style="{ zIndex: maskZIndex }"
      @click="onMaskClick"
      @touchmove.prevent
    ></div>
    <Transition :name="`wiux-popup-animate-${position}`">
      <div
        v-show="modelValue"
        :key="shouldRerenderOnShow ? rerenderKey : undefined"
        :style="styles"
        class="wiux-popup-dialog"
        :class="[`wiux-popup-${position}`, modelValue ? 'wiux-popup-show' : '']"
        v-bind="attrs"
      >
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";

export default defineComponent({
  name: "Popup",
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    height: {
      type: String,
      default: "auto",
    },
    width: {
      type: String,
      default: "auto",
    },
    showMask: {
      type: Boolean,
      default: true,
    },
    isTransparent: Boolean,
    hideOnBlur: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: "bottom",
    },
    maxHeight: String,
    popupStyle: Object,
    shouldRerenderOnShow: {
      type: Boolean,
      default: false,
    },
    shouldScrollTopOnShow: {
      type: Boolean,
      default: false,
    },
    maskZIndex: {
      type: [Number, String],
      default: "",
    },
  },
  emits: ["update:modelValue", "on-show", "on-hide", "on-first-show"],
  setup(props, { emit, attrs }) {
    let hasFirstShow = false;
    const rerenderKey = ref(0);

    const styles = computed(() => {
      const result: Record<string, any> = {};
      if (
        !props.position ||
        props.position === "bottom" ||
        props.position === "top"
      ) {
        result.height = props.height;
      } else {
        result.width = props.width;
      }

      if (props.maxHeight) {
        result["max-height"] = props.maxHeight;
      }

      if (props.isTransparent) {
        result.background = "transparent";
      }
      if (props.popupStyle) {
        for (const key in props.popupStyle) {
          result[key] = (props.popupStyle as any)[key];
        }
      }
      return result;
    });

    watch(
      () => props.modelValue,
      (val) => {
        if (val) {
          if (props.shouldRerenderOnShow) {
            rerenderKey.value++;
          }
          emit("on-show");
          if (!hasFirstShow) {
            hasFirstShow = true;
            emit("on-first-show");
          }
        } else {
          emit("on-hide");
        }
      },
    );

    const onMaskClick = () => {
      if (props.hideOnBlur) {
        emit("update:modelValue", false);
      }
    };

    return {
      styles,
      rerenderKey,
      onMaskClick,
      attrs,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-popup-dialog {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: @popup-background-color;
  z-index: 501;
  transition-property: transform;
  transition-duration: 300ms;
  max-height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.wiux-popup-dialog.wiux-popup-left {
  width: auto;
  height: 100%;
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
}
.wiux-popup-dialog.wiux-popup-right {
  width: auto;
  height: 100%;
  top: 0;
  right: 0;
  bottom: auto;
  left: auto;
}
.wiux-popup-dialog.wiux-popup-top {
  width: 100%;
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
}
.wiux-popup-mask {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  z-index: 500;
  transition: opacity 400ms;
  pointer-events: none;
}
.wiux-popup-mask.wiux-popup-show {
  opacity: 1;
  pointer-events: auto;
}

.wiux-popup-animate-bottom-enter-active,
.wiux-popup-animate-bottom-leave-active {
  transition: transform 300ms;
}
.wiux-popup-animate-bottom-enter-from,
.wiux-popup-animate-bottom-leave-to {
  transform: translateY(100%);
}
.wiux-popup-animate-bottom-enter-to,
.wiux-popup-animate-bottom-leave-from {
  transform: translateY(0);
}

.wiux-popup-animate-top-enter-active,
.wiux-popup-animate-top-leave-active {
  transition: transform 300ms;
}
.wiux-popup-animate-top-enter-from,
.wiux-popup-animate-top-leave-to {
  transform: translateY(-100%);
}
.wiux-popup-animate-top-enter-to,
.wiux-popup-animate-top-leave-from {
  transform: translateY(0);
}

.wiux-popup-animate-left-enter-active,
.wiux-popup-animate-left-leave-active {
  transition: transform 300ms;
}
.wiux-popup-animate-left-enter-from,
.wiux-popup-animate-left-leave-to {
  transform: translateX(-100%);
}
.wiux-popup-animate-left-enter-to,
.wiux-popup-animate-left-leave-from {
  transform: translateX(0);
}

.wiux-popup-animate-right-enter-active,
.wiux-popup-animate-right-leave-active {
  transition: transform 300ms;
}
.wiux-popup-animate-right-enter-from,
.wiux-popup-animate-right-leave-to {
  transform: translateX(100%);
}
.wiux-popup-animate-right-enter-to,
.wiux-popup-animate-right-leave-from {
  transform: translateX(0);
}
</style>