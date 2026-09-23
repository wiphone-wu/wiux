<template>
  <div class="wiux-toast">
    <div class="weui-mask_transparent" v-show="isShowMask && show"></div>
    <transition :name="currentTransition">
      <div
        class="weui-toast"
        :style="{ width: width }"
        :class="toastClass"
        v-show="show"
      >
        <i
          class="weui-icon-success-no-circle weui-icon_toast"
          v-show="type !== 'text'"
        ></i>
        <p
          class="weui-toast__content"
          v-if="text"
          :style="style"
          v-html="text"
        ></p>
        <p class="weui-toast__content" v-else :style="style">
          <slot></slot>
        </p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onBeforeUnmount } from "vue";

export default defineComponent({
  name: "Toast",
  props: {
    modelValue: Boolean,
    time: {
      type: Number,
      default: 2000,
    },
    type: {
      type: String,
      default: "success",
    },
    transition: String,
    width: {
      type: String,
      default: "7.6em",
    },
    isShowMask: {
      type: Boolean,
      default: false,
    },
    text: String,
    position: String,
  },
  emits: ["update:modelValue", "on-show", "on-hide"],
  setup(props, { emit }) {
    const show = ref(false);
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const currentTransition = computed(() => {
      if (props.transition) return props.transition;
      if (props.position === "top") return "wiux-slide-from-top";
      if (props.position === "bottom") return "wiux-slide-from-bottom";
      return "wiux-fade";
    });

    const toastClass = computed(() => {
      return {
        "weui-toast_forbidden": props.type === "warn",
        "weui-toast_cancel": props.type === "Cancel",
        "weui-toast_success": props.type === "success",
        "weui-toast_text": props.type === "text",
        "wiux-toast-top": props.position === "top",
        "wiux-toast-bottom": props.position === "bottom",
        "wiux-toast-middle": props.position === "middle",
      };
    });

    const style = computed(() => {
      if (props.type === "text" && props.width === "auto") {
        return { padding: "10px" };
      }
      return undefined;
    });

    watch(show, (val) => {
      if (val) {
        emit("update:modelValue", true);
        emit("on-show");

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          show.value = false;
          emit("update:modelValue", false);
          emit("on-hide");
        }, props.time);
      }
    });

    watch(
      () => props.modelValue,
      (val) => {
        show.value = val;
      },
    );

    onBeforeUnmount(() => {
      if (timeout) clearTimeout(timeout);
    });

    if (props.modelValue) {
      show.value = true;
    }

    return {
      show,
      currentTransition,
      toastClass,
      style,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.weui-toast.wiux-toast-top {
  top: @toast-position-top-offset;
}
.weui-toast.wiux-toast-bottom {
  top: auto;
  bottom: @toast-position-bottom-offset;
  transform: translateX(-50%);
}
.weui-toast.wiux-toast-middle {
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.wiux-slide-from-top-enter,
.wiux-slide-from-top-leave-active {
  opacity: 0;
  transform: translateX(-50%) translateY(-100%) !important;
}
.wiux-slide-from-bottom-enter,
.wiux-slide-from-bottom-leave-active {
  opacity: 0;
  transform: translateX(-50%) translateY(100%) !important;
}
.wiux-slide-from-top-enter-active,
.wiux-slide-from-top-leave-active,
.wiux-slide-from-bottom-enter-active,
.wiux-slide-from-bottom-leave-active {
  transition: all 400ms cubic-bezier(0.36, 0.66, 0.04, 1);
}
.weui-toast {
  transform: translateX(-50%);
  margin-left: 0 !important;
}
.weui-toast.weui-toast_forbidden {
  color: #f76260;
}
.weui-toast.weui-toast_forbidden .weui-toast__content {
  margin-top: 10px;
}
.weui-toast.weui-toast_text {
  min-height: 0;
}
.weui-toast_text .weui-toast__content {
  margin: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 15px;
}
.weui-toast__content {
  font-size: @toast-content-font-size;
}
.weui-loading_toast .weui-toast__content {
  margin-top: 0;
}
.weui-toast_success .weui-icon_toast:before {
  content: "\EA08";
}
.weui-toast_cancel .weui-icon_toast:before {
  content: "\EA0D";
}
.weui-toast_forbidden .weui-icon_toast.weui-icon-success-no-circle:before {
  content: "\EA0B";
  color: #f76260;
}
</style>
