<template>
  <div
    class="wiux-tab-wrap"
    :class="barPosition === 'top' ? 'wiux-tab-bar-top' : ''"
  >
    <div class="wiux-tab-container">
      <div
        class="wiux-tab"
        :class="[{ 'wiux-tab-no-animate': !animate }, { scrollable }]"
        ref="navRef"
      >
        <slot></slot>
        <div
          v-if="animate"
          class="wiux-tab-ink-bar"
          :class="barClass"
          :style="barStyle"
        >
          <span
            class="wiux-tab-bar-inner"
            :style="innerBarStyle"
            v-if="customBarWidth"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRef,
  provide,
  watch,
  computed,
  onMounted,
  nextTick,
  type Ref,
} from "vue";

export const TAB_KEY = Symbol("tab");

export interface TabContext {
  currentIndex: Ref<number>;
  lineWidth: Ref<number>;
  activeColor: Ref<string | undefined>;
  defaultColor: Ref<string | undefined>;
  disabledColor: Ref<string | undefined>;
  animate: Ref<boolean>;
  preventDefault: Ref<boolean>;
  childrenCount: Ref<number>;
  registerChild: () => number;
  unregisterChild: () => void;
  setIndex: (index: number) => void;
}

export default defineComponent({
  name: "Tab",
  props: {
    modelValue: {
      type: Number,
      default: -1,
    },
    lineWidth: {
      type: Number,
      default: 3,
    },
    activeColor: String,
    barActiveColor: String,
    defaultColor: String,
    disabledColor: String,
    animate: {
      type: Boolean,
      default: true,
    },
    customBarWidth: [Function, String],
    preventDefault: Boolean,
    scrollThreshold: {
      type: Number,
      default: 4,
    },
    barPosition: {
      type: String,
      default: "bottom",
      validator(val: string) {
        return ["bottom", "top"].indexOf(val) !== -1;
      },
    },
  },
  emits: ["update:modelValue", "change", "on-beforeChange"],
  setup(props, { emit }) {
    const navRef = ref<HTMLElement | null>(null);
    const currentIndex = ref(props.modelValue);
    const childrenCount = ref(0);
    const direction = ref("forward");
    const hasReady = ref(false);

    onMounted(() => {
      nextTick(() => {
        setTimeout(() => {
          hasReady.value = true;
        }, 0);
      });
    });

    watch(currentIndex, (newIndex, oldIndex) => {
      direction.value = newIndex > oldIndex ? "forward" : "backward";
      emit("update:modelValue", newIndex);
      emit("change", newIndex, oldIndex);
      if (hasReady.value) {
        scrollToActiveTab();
      }
    });

    watch(
      () => props.modelValue,
      (val) => {
        if (val >= 0) {
          currentIndex.value = val;
        }
      },
    );

    const registerChild = () => {
      childrenCount.value++;
      return childrenCount.value - 1;
    };

    const unregisterChild = () => {
      childrenCount.value--;
    };

    const setIndex = (index: number) => {
      if (props.preventDefault) {
        emit("on-beforeChange", index);
        return;
      }
      currentIndex.value = index;
    };

    const scrollable = computed(() => {
      return childrenCount.value > props.scrollThreshold;
    });

    const barLeft = computed(() => {
      if (hasReady.value) {
        const nav = navRef.value;
        if (!nav || !nav.children || !nav.children.length) return "0%";
        const count = scrollable.value
          ? nav.offsetWidth /
            (
              nav.children[currentIndex.value || 0] as HTMLElement
            ).getBoundingClientRect().width
          : childrenCount.value;
        return `${(currentIndex.value || 0) * (100 / count)}%`;
      }
      return "0%";
    });

    const barRight = computed(() => {
      if (hasReady.value) {
        const nav = navRef.value;
        if (!nav || !nav.children || !nav.children.length) return "100%";
        const count = scrollable.value
          ? nav.offsetWidth /
            (
              nav.children[currentIndex.value || 0] as HTMLElement
            ).getBoundingClientRect().width
          : childrenCount.value;
        return `${(count - (currentIndex.value || 0) - 1) * (100 / count)}%`;
      }
      return "100%";
    });

    const innerBarStyle = computed(() => {
      return {
        width:
          typeof props.customBarWidth === "function"
            ? (props.customBarWidth as Function)(currentIndex.value)
            : props.customBarWidth,
        background: props.barActiveColor || props.activeColor,
      };
    });

    const barStyle = computed(() => {
      const commonStyle: Record<string, string | null> = {
        left: barLeft.value,
        right: barRight.value,
        display: "block",
        height: props.lineWidth + "px",
        transition: !hasReady.value ? "none" : null,
      };
      if (!props.customBarWidth) {
        commonStyle.background =
          props.barActiveColor || props.activeColor || "";
      } else {
        commonStyle.background = "transparent";
      }
      return commonStyle as any;
    });

    const barClass = computed(() => {
      return {
        "wiux-tab-ink-bar-transition-forward": direction.value === "forward",
        "wiux-tab-ink-bar-transition-backward": direction.value === "backward",
      };
    });

    const scrollToActiveTab = () => {
      if (
        !scrollable.value ||
        !navRef.value ||
        !navRef.value.children ||
        !navRef.value.children.length
      ) {
        return;
      }
      const currentIndexTab = navRef.value.children[
        currentIndex.value
      ] as HTMLElement;
      if (!currentIndexTab) return;
      let count = 0;
      const nav = navRef.value;
      const step = () => {
        const scrollDuration = 15;
        nav.scrollLeft +=
          (currentIndexTab.offsetLeft -
            (nav.offsetWidth - currentIndexTab.offsetWidth) / 2 -
            nav.scrollLeft) /
          scrollDuration;
        if (++count < scrollDuration) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const context: TabContext = {
      currentIndex,
      lineWidth: toRef(props, "lineWidth"),
      activeColor: toRef(props, "activeColor"),
      defaultColor: toRef(props, "defaultColor"),
      disabledColor: toRef(props, "disabledColor"),
      animate: toRef(props, "animate"),
      preventDefault: toRef(props, "preventDefault"),
      childrenCount,
      registerChild,
      unregisterChild,
      setIndex,
    };

    provide(TAB_KEY, context);

    return {
      navRef,
      barStyle,
      barClass,
      innerBarStyle,
      scrollable,
      barLeft,
      barRight,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

@prefixClass: wiux-tab;
@easing-in-out: cubic-bezier(0.35, 0, 0.25, 1);
@effect-duration: 0.3s;

.@{prefixClass} {
  &-ink-bar {
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: @tab-bar-active-color;
    text-align: center;

    &-transition-forward {
      transition:
        right @effect-duration @easing-in-out,
        left @effect-duration @easing-in-out @effect-duration * 0.3;
    }
    &-transition-backward {
      transition:
        right @effect-duration @easing-in-out @effect-duration * 0.3,
        left @effect-duration @easing-in-out;
    }
  }
}

.wiux-tab-bar-top .@{prefixClass} {
  &-ink-bar {
    top: 0;
  }
}

.wiux-tab {
  display: flex;
  background-color: #fff;
  height: 44px;
  position: relative;
}

.wiux-tab button {
  padding: 0;
  border: 0;
  outline: 0;
  background: 0 0;
  appearance: none;
}

.wiux-tab-ink-bar {
  position: absolute;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: @tab-bar-active-color;
  text-align: center;
}

.wiux-tab-bar-inner {
  display: block;
  background-color: @tab-text-active-color;
  margin: auto;
  height: 100%;
  transition: width 0.3s @easing-in-out;
}

.wiux-tab-item-badge {
  position: absolute;
  top: 0;
  bottom: 0;
  box-sizing: border-box;
  display: inline-block;
  height: 18px;
  min-width: 18px;
  padding: 0 4px;
  border-radius: 30px;
  margin: auto 0 auto 4px;
  line-height: 18px;
  font-size: 11px;
  background-clip: padding-box;
  vertical-align: middle;
}

.wiux-tab .wiux-tab-item {
  display: block;
  flex: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: linear-gradient(180deg, #e5e5e5, #e5e5e5, rgba(229, 229, 229, 0))
    bottom center no-repeat;
  background-size: 100% 1px;
  font-size: 14px;
  text-align: center;
  line-height: 44px;
  color: @tab-text-default-color;
  border-bottom: 3px solid transparent;
  position: relative;
}

.wiux-tab .wiux-tab-item.wiux-tab-selected {
  color: @tab-text-active-color;
  border-bottom: 3px solid @tab-text-active-color;
}

.wiux-tab .wiux-tab-item.wiux-tab-disabled {
  color: @tab-text-disabled-color;
}

.wiux-tab-no-animate .wiux-tab-item.wiux-tab-selected {
  background: 0 0;
}

.wiux-tab-container {
  width: 100%;
}

.wiux-tab-wrap {
  position: relative;
  width: 100%;
}

.scrollable {
  overflow-y: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  // padding-bottom: 17px;
  box-sizing: content-box;
}

.scrollable::-webkit-scrollbar {
  display: none;
}

.scrollable .wiux-tab-ink-bar {
  // bottom: 17px;
  position: absolute;
}

.scrollable .wiux-tab-item {
  flex: 0 0 22%;
}

.wiux-tab-bar-top {
  .wiux-tab {
    .wiux-tab-item {
      border-top: 3px solid transparent;
      border-bottom: none;
    }
    .wiux-tab-item.wiux-tab-selected {
      border-top: 3px solid @tab-text-active-color;
      border-bottom: none;
    }
  }
}
</style>
