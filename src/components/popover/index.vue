<template>
  <div v-click-outside="onClickedOutside">
    <span ref="triggerRef" @click="toggle">
      <slot></slot>
    </span>
    <div
      class="wiux-popover"
      v-transfer-dom
      ref="popoverRef"
      :style="popoverStyle"
      v-show="visible"
    >
      <div :class="arrowClass"></div>
      <div @click="$emit('on-click-content')">
        <slot name="content">
          <div v-html="content"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import clickOutside from "../../directives/click-outside";
import transferDom from "../../directives/transfer-dom";

export default defineComponent({
  name: "Popover",
  directives: {
    transferDom,
    clickOutside,
  },
  props: {
    content: String,
    placement: String,
    gutter: {
      type: Number,
      default: 5,
    },
  },
  emits: ["on-show", "on-hide", "on-click-content"],
  setup(props, { emit }) {
    const triggerRef = ref<HTMLElement>();
    const popoverRef = ref<HTMLElement>();
    const visible = ref(false);
    const position = reactive({
      top: 0,
      left: 0,
    });
    const popoverStyle = ref<Record<string, string>>({});

    function isFixedPosition(el: HTMLElement): boolean {
      let current: HTMLElement | null = el;
      while (current) {
        const style = window.getComputedStyle(current);
        if (style.position === "fixed") {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    }

    function init(isReset?: boolean) {
      if (!triggerRef.value || !popoverRef.value) return;

      const trigger = triggerRef.value.children[0] as HTMLElement;
      if (!trigger) return;

      const popover = popoverRef.value;
      const isFixed = isFixedPosition(trigger);

      if (isFixed) {
        const rect = trigger.getBoundingClientRect();
        switch (props.placement) {
          case "top":
            position.left =
              rect.left - popover.offsetWidth / 2 + trigger.offsetWidth / 2;
            position.top = rect.top - popover.offsetHeight - props.gutter;
            break;
          case "left":
            position.left = rect.left - popover.offsetWidth - props.gutter;
            position.top =
              rect.top + trigger.offsetHeight / 2 - popover.offsetHeight / 2;
            break;
          case "right":
            position.left = rect.right + props.gutter;
            position.top =
              rect.top + trigger.offsetHeight / 2 - popover.offsetHeight / 2;
            break;
          case "bottom":
            position.left =
              rect.left - popover.offsetWidth / 2 + trigger.offsetWidth / 2;
            position.top = rect.bottom + props.gutter;
            break;
          default:
            console.warn("[WIUX] Wrong placement prop for Popover");
        }
        popoverStyle.value = {
          position: "fixed",
          top: position.top + "px",
          left: position.left + "px",
        };
      } else {
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;

        switch (props.placement) {
          case "top":
            position.left =
              trigger.offsetLeft -
              popover.offsetWidth / 2 +
              trigger.offsetWidth / 2;
            position.top =
              scrollTop +
              trigger.getBoundingClientRect().top -
              popover.offsetHeight -
              props.gutter;
            break;
          case "left":
            position.left =
              trigger.offsetLeft - popover.offsetWidth - props.gutter;
            position.top =
              scrollTop +
              trigger.getBoundingClientRect().top +
              trigger.offsetHeight / 2 -
              popover.offsetHeight / 2;
            break;
          case "right":
            position.left =
              trigger.offsetLeft + trigger.offsetWidth + props.gutter;
            position.top =
              scrollTop +
              trigger.getBoundingClientRect().top +
              trigger.offsetHeight / 2 -
              popover.offsetHeight / 2;
            break;
          case "bottom":
            position.left =
              trigger.offsetLeft -
              popover.offsetWidth / 2 +
              trigger.offsetWidth / 2;
            position.top =
              scrollTop +
              trigger.getBoundingClientRect().top +
              trigger.offsetHeight +
              props.gutter;
            break;
          default:
            console.warn("[WIUX] Wrong placement prop for Popover");
        }
        popoverStyle.value = {
          top: position.top + "px",
          left: position.left + "px",
        };
      }
    }

    function reset() {
      if (visible.value) {
        nextTick(() => {
          init();
        });
      }
    }

    function onClickedOutside() {
      if (visible.value) {
        visible.value = false;
        emit("on-hide");
      }
    }

    function toggle() {
      visible.value = !visible.value;
      if (visible.value) {
        nextTick(() => {
          init();
        });
      }
      emit(visible.value ? "on-show" : "on-hide");
    }

    onMounted(() => {
      nextTick(() => {
        init();
        window.addEventListener("resize", reset);
        window.addEventListener("scroll", reset, true);
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", reset);
      window.removeEventListener("scroll", reset, true);
    });

    return {
      triggerRef,
      popoverRef,
      visible,
      popoverStyle,
      arrowClass: {
        "wiux-popover-arrow": true,
        "wiux-popover-arrow-up": props.placement === "bottom",
        "wiux-popover-arrow-right": props.placement === "left",
        "wiux-popover-arrow-left": props.placement === "right",
        "wiux-popover-arrow-down": props.placement === "top",
      },
      onClickedOutside,
      toggle,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-popover {
  position: absolute;
  left: 0;
  top: 0;
  background-color: @popover-bg-color;
  color: @popover-font-color;
  border-radius: @popover-border-radius;
  z-index: 500;
}
.wiux-popover-arrow {
  position: absolute;
  width: 0;
  height: 0;
}
.wiux-popover-arrow-up {
  border-left: @popover-border-width solid transparent;
  border-right: @popover-border-width solid transparent;
  border-bottom: @popover-border-width solid @popover-bg-color;
  left: 50%;
  transform: translateX(-50%);
  top: -@popover-border-width;
}
.wiux-popover-arrow-down {
  border-left: @popover-border-width solid transparent;
  border-right: @popover-border-width solid transparent;
  border-top: @popover-border-width solid @popover-bg-color;
  left: 50%;
  transform: translateX(-50%);
  bottom: -@popover-border-width;
}
.wiux-popover-arrow-left {
  border-top: @popover-border-width solid transparent;
  border-bottom: @popover-border-width solid transparent;
  border-right: @popover-border-width solid @popover-bg-color;
  top: 50%;
  transform: translateY(-50%);
  left: -@popover-border-width;
}
.wiux-popover-arrow-right {
  border-top: @popover-border-width solid transparent;
  border-bottom: @popover-border-width solid transparent;
  border-left: @popover-border-width solid @popover-bg-color;
  top: 50%;
  transform: translateY(-50%);
  right: -@popover-border-width;
}
</style>
