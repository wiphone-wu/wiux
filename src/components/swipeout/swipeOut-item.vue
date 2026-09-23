<template>
  <div
    class="wiux-swipeout-item"
    @touchstart="start"
    @mousedown="start"
    @touchmove="move"
    @mousemove="move"
    @touchend="end"
    @mouseup="end"
    @touchcancel="end"
  >
    <div
      class="wiux-swipeout-button-box wiux-swipeout-button-box-left"
      ref="leftButtonBoxRef"
    >
      <slot name="left-menu"></slot>
    </div>
    <div class="wiux-swipeout-button-box" ref="rightButtonBoxRef">
      <slot name="right-menu"></slot>
    </div>
    <div
      class="wiux-swipeout-content"
      @mousedown="onContentClick"
      @touchstart="onContentClick"
      ref="contentRef"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  provide,
  inject,
  watch,
  type Ref,
} from "vue";

interface swipeoutItemInstance {
  currentTransform: Ref<number>;
  isOpen: Ref<boolean>;
  close: () => void;
  closeWithoutAnimation: () => void;
}

export default defineComponent({
  name: "swipeoutItem",
  props: {
    sensitivity: {
      type: Number,
      default: 0,
    },
    autoCloseOnButtonClick: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    threshold: {
      type: Number,
      default: 0.3,
    },
    underlayColor: {
      type: String,
      default: "",
    },
    transitionMode: {
      type: String,
      default: "reveal",
    },
  },
  emits: ["on-open", "on-close"],
  setup(props, { emit, expose, slots }) {
    const contentRef: Ref<HTMLElement | null> = ref(null);
    const leftButtonBoxRef: Ref<HTMLElement | null> = ref(null);
    const rightButtonBoxRef: Ref<HTMLElement | null> = ref(null);
    const hasLeftMenu = ref(false);
    const hasRightMenu = ref(false);
    const leftMenuWidth = ref(160);
    const rightMenuWidth = ref(160);
    const pageX = ref<number | undefined>(undefined);
    const pageY = ref<number | undefined>(undefined);
    const distX = ref(0);
    const distY = ref(0);
    const direction = ref("");
    const valid = ref<boolean | undefined>(undefined);
    const isOpen = ref(false);
    const isAnimated = ref(false);
    const currentTransform = ref(0);

    const swipeoutRegister = inject<(item: swipeoutItemInstance) => void>(
      "swipeoutRegister",
      () => {},
    );
    const swipeoutUnregister = inject<(item: swipeoutItemInstance) => void>(
      "swipeoutUnregister",
      () => {},
    );
    const swipeoutCloseOthers = inject<(item: swipeoutItemInstance) => boolean>(
      "swipeoutCloseOthers",
      () => false,
    );

    const instance: swipeoutItemInstance = {
      currentTransform,
      isOpen,
      close: doClose,
      closeWithoutAnimation: doCloseWithoutAnimation,
    };

    function calculateMenuWidth(dir: string) {
      const slotContent = slots[`${dir}-menu`];
      if (!slotContent) return;
      const vnode = slotContent();
      let width = 0;
      vnode.forEach((one: any) => {
        if (one.props && one.props.width) {
          width += one.props.width || 80;
        } else {
          width += 80;
        }
      });
      if (dir === "left") {
        leftMenuWidth.value = width;
      } else {
        rightMenuWidth.value = width;
      }
    }

    function render() {
      if (slots["left-menu"]) {
        hasLeftMenu.value = true;
        calculateMenuWidth("left");
      }
      if (slots["right-menu"]) {
        hasRightMenu.value = true;
        calculateMenuWidth("right");
      }
    }

    onMounted(() => {
      nextTick(() => {
        render();
        hideButtonBoxes();
        swipeoutRegister(instance);
      });
    });

    onBeforeUnmount(() => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      swipeoutUnregister(instance);
    });

    function getMenuWidth(): number {
      if (!hasLeftMenu.value && hasRightMenu.value) {
        return rightMenuWidth.value;
      }
      if (hasLeftMenu.value && !hasRightMenu.value) {
        return leftMenuWidth.value;
      }
      if (hasLeftMenu.value && hasRightMenu.value) {
        return distX.value < 0 ? rightMenuWidth.value : leftMenuWidth.value;
      }
      return 0;
    }

    function showButtonBox(dir: string) {
      if (dir === "left" && leftButtonBoxRef.value) {
        leftButtonBoxRef.value.style.display = "";
        if (rightButtonBoxRef.value) {
          rightButtonBoxRef.value.style.display = "none";
        }
      } else if (dir === "right" && rightButtonBoxRef.value) {
        rightButtonBoxRef.value.style.display = "";
        if (leftButtonBoxRef.value) {
          leftButtonBoxRef.value.style.display = "none";
        }
      }
    }

    function hideButtonBoxes() {
      if (leftButtonBoxRef.value) {
        leftButtonBoxRef.value.style.display = "none";
      }
      if (rightButtonBoxRef.value) {
        rightButtonBoxRef.value.style.display = "none";
      }
    }

    function updateButtonBoxStyle(x: number) {
      if (props.transitionMode !== "follow") return;

      if (x > 0 && leftButtonBoxRef.value) {
        const offset = x === 0 ? leftMenuWidth.value : leftMenuWidth.value - x;
        leftButtonBoxRef.value.style.transform = `translate3d(-${offset}px, 0, 0)`;
        leftButtonBoxRef.value.style.backgroundColor =
          props.underlayColor || "";
      } else if (x < 0 && rightButtonBoxRef.value) {
        let offset = rightMenuWidth.value - Math.abs(x);
        if (offset < 0) {
          offset = 0;
        }
        rightButtonBoxRef.value.style.transform = `translate3d(${offset}px, 0, 0)`;
        rightButtonBoxRef.value.style.backgroundColor =
          props.underlayColor || "";
      }
    }

    function setOffsetNative(x: number, animated = false, force = false) {
      if (props.disabled && !force) {
        return;
      }

      if (x === 0) {
        setTimeout(() => {
          isOpen.value = false;
        }, 300);
      }

      if (x < 0 && Math.abs(x) === rightMenuWidth.value) {
        distX.value = -rightMenuWidth.value;
      } else if (x > 0 && Math.abs(x) === leftMenuWidth.value) {
        distX.value = leftMenuWidth.value;
      }

      currentTransform.value = x;

      if (contentRef.value) {
        if (animated) {
          isAnimated.value = true;
          contentRef.value.classList.add("wiux-swipeout-content-animated");
          const cb = function () {
            if (contentRef.value) {
              contentRef.value.classList.remove(
                "wiux-swipeout-content-animated",
              );
              isAnimated.value = false;
              contentRef.value.removeEventListener("webkitTransitionEnd", cb);
              contentRef.value.removeEventListener("transitionend", cb);
            }
          };
          contentRef.value.addEventListener("webkitTransitionEnd", cb);
          contentRef.value.addEventListener("transitionend", cb);
        }
        contentRef.value.style.transform = "translate3d(" + x + "px, 0, 0)";
      }

      if (x === 0) {
        hideButtonBoxes();
      } else if (x > 0) {
        showButtonBox("left");
        updateButtonBoxStyle(x);
      } else if (x < 0) {
        showButtonBox("right");
        updateButtonBoxStyle(x);
      }

      if (animated && rightButtonBoxRef.value) {
        rightButtonBoxRef.value.style.transition = "transform 0.2s";
        const cbR = function () {
          if (rightButtonBoxRef.value) {
            rightButtonBoxRef.value.style.transition = "";
            rightButtonBoxRef.value.removeEventListener(
              "webkitTransitionEnd",
              cbR,
            );
            rightButtonBoxRef.value.removeEventListener("transitionend", cbR);
          }
        };
        rightButtonBoxRef.value.addEventListener("webkitTransitionEnd", cbR);
        rightButtonBoxRef.value.addEventListener("transitionend", cbR);
      }
      if (animated && leftButtonBoxRef.value) {
        leftButtonBoxRef.value.style.transition = "transform 0.2s";
        const cbL = function () {
          if (leftButtonBoxRef.value) {
            leftButtonBoxRef.value.style.transition = "";
            leftButtonBoxRef.value.removeEventListener(
              "webkitTransitionEnd",
              cbL,
            );
            leftButtonBoxRef.value.removeEventListener("transitionend", cbL);
          }
        };
        leftButtonBoxRef.value.addEventListener("webkitTransitionEnd", cbL);
        leftButtonBoxRef.value.addEventListener("transitionend", cbL);
      }
    }

    function _setClose(delay = 0) {
      setOffsetNative(0, true);
      emit("on-close");
      if (!delay) {
        isOpen.value = false;
      } else {
        setTimeout(() => {
          isOpen.value = false;
        }, delay);
      }
      distX.value = 0;
    }

    function doClose() {
      setOffsetNative(0, true, true);
    }

    function doCloseWithoutAnimation() {
      if (contentRef.value) {
        contentRef.value.classList.remove("wiux-swipeout-content-animated");
        contentRef.value.style.transform = "translate3d(0px, 0, 0)";
      }
      hideButtonBoxes();
      currentTransform.value = 0;
      distX.value = 0;
      isOpen.value = false;
    }

    function open(position = "right") {
      setOffsetNative(
        position === "right" ? -rightMenuWidth.value : leftMenuWidth.value,
        true,
        true,
      );
    }

    function close() {
      setOffsetNative(0, true, true);
    }

    function onContentClick() {
      if (currentTransform.value !== 0) {
        _setClose(200);
      }
    }

    function onItemClick(text?: string) {
      if (props.autoCloseOnButtonClick) {
        _setClose();
      }
    }

    function start(ev: MouseEvent | TouchEvent) {
      if (
        props.disabled ||
        isOpen.value ||
        (ev.target as HTMLElement).nodeName.toLowerCase() === "button"
      ) {
        return;
      }

      if (swipeoutCloseOthers(instance)) {
        ev.preventDefault();
        return;
      }

      const touch = (ev as TouchEvent).touches
        ? (ev as TouchEvent).touches[0]
        : (ev as MouseEvent);
      pageX.value = touch.pageX;
      pageY.value = touch.pageY;

      if (!(ev as TouchEvent).touches) {
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", end);
      }
    }

    function move(ev: MouseEvent | TouchEvent) {
      if (props.disabled) {
        return;
      }
      if ((ev.target as HTMLElement).nodeName.toLowerCase() === "button") {
        ev.preventDefault();
        return;
      }
      if (pageX.value === undefined) {
        ev.preventDefault();
        return;
      }

      const touch = (ev as TouchEvent).touches
        ? (ev as TouchEvent).touches[0]
        : (ev as MouseEvent);
      const dx = touch.pageX - pageX.value!;
      const dy = touch.pageY - pageY.value!;
      distX.value = dx;
      distY.value = dy;

      if (!direction.value) {
        direction.value = dx > 0 ? "left" : "right";
      }

      if (
        (direction.value === "right" && dx > 0 && hasRightMenu.value) ||
        (direction.value === "left" && dx < 0 && hasLeftMenu.value)
      ) {
        valid.value = true;
        ev.preventDefault();
      }

      if (valid.value === undefined) {
        if (dx > 0 && hasLeftMenu.value === false) {
          valid.value = false;
        } else if (dx < 0 && hasRightMenu.value === false) {
          valid.value = false;
        } else if (
          Math.abs(dx) > props.sensitivity ||
          Math.abs(dy) > props.sensitivity
        ) {
          valid.value = Math.abs(dx) > Math.abs(dy);
        } else {
          ev.preventDefault();
        }
      }

      if (valid.value === true) {
        const mw = getMenuWidth();
        let offset: number;
        if (Math.abs(dx) <= mw) {
          offset = dx;
        } else {
          const extra = (Math.abs(dx) - mw) * 0.5;
          offset = (mw + extra) * (dx < 0 ? -1 : 1);
        }

        currentTransform.value = offset;

        if (contentRef.value) {
          contentRef.value.style.transform =
            "translate3d(" + offset + "px, 0, 0)";
        }

        if (offset > 0) {
          showButtonBox("left");
        } else if (offset < 0) {
          showButtonBox("right");
        } else {
          hideButtonBoxes();
        }
        updateButtonBoxStyle(offset);

        ev.preventDefault();
      }
    }

    function end(ev: MouseEvent | TouchEvent) {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);

      if (props.disabled) {
        return;
      }
      if ((ev.target as HTMLElement).nodeName.toLowerCase() === "button") {
        return;
      }
      if (valid.value === true) {
        if (distX.value < 0 && direction.value === "right") {
          const threshold =
            props.threshold <= 1
              ? rightMenuWidth.value * props.threshold
              : props.threshold;

          if (distX.value < -threshold) {
            setOffsetNative(-rightMenuWidth.value, true);
            emit("on-open");
            isOpen.value = true;
          } else {
            _setClose();
          }
        } else if (distX.value > 0 && direction.value === "left") {
          const threshold =
            props.threshold <= 1
              ? leftMenuWidth.value * props.threshold
              : props.threshold;

          if (distX.value > threshold) {
            setOffsetNative(leftMenuWidth.value, true);
            emit("on-open");
            isOpen.value = true;
          } else {
            _setClose();
          }
        }
      } else if (pageX.value !== undefined) {
        hideButtonBoxes();
      }

      pageX.value = undefined;
      pageY.value = undefined;
      valid.value = undefined;
      direction.value = "";
    }

    watch(
      () => props.disabled,
      (newVal) => {
        if (newVal === true) {
          setOffsetNative(0, true, true);
        }
      },
    );

    provide("swipeoutItemParent", {
      onItemClick,
    });

    expose({
      open,
      close,
      render,
    });

    return {
      contentRef,
      leftButtonBoxRef,
      rightButtonBoxRef,
      distX,
      hasLeftMenu,
      hasRightMenu,
      isOpen,
      isAnimated,
      start,
      move,
      end,
      onContentClick,
      onItemClick,
      open,
      close,
    };
  },
});
</script>
