<template>
  <div class="wiux-button-group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, watch, type Ref, onMounted } from "vue";

export const BUTTON_TAB_KEY = Symbol("button-tab");

export interface ButtonTabContext {
  currentIndex: Ref<number>;
  height: Ref<number | undefined>;
  childrenCount: Ref<number>;
  registerChild: () => number;
  unregisterChild: () => void;
  setIndex: (index: number) => void;
}

export default defineComponent({
  name: "ButtonTab",
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
    },
  },
  emits: ["update:modelValue", "change", "beforeChange"],
  setup(props, { emit }) {
    const currentIndex = ref(props.modelValue);
    const childrenCount = ref(0);
    const preventDefault = ref(false);

    watch(currentIndex, (val, oldVal) => {
      emit("update:modelValue", val);
      emit("change", val, oldVal);
    });

    watch(
      () => props.modelValue,
      (val) => {
        currentIndex.value = val;
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
      if (preventDefault.value) {
        emit("beforeChange", index);
        return;
      }
      currentIndex.value = index;
    };

    const context: ButtonTabContext = {
      currentIndex,
      height: ref(props.height),
      childrenCount,
      registerChild,
      unregisterChild,
      setIndex,
    };

    provide(BUTTON_TAB_KEY, context);

    return {
      currentIndex,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
@import "../../styles/redDot.less";
@import "../../styles/1px.less";

.setLineWithoutRight(@c: #C7C7C7) {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 1px;
  border-left: 1px solid @c;
  border-top: 1px solid @c;
  border-bottom: 1px solid @c;
  color: @c;
  height: 200%;
  transform-origin: left top;
  transform: scale(0.5);
  z-index: 1;
}

.setLineWithoutLeft(@c: #C7C7C7) {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 1px;
  border-right: 1px solid @c;
  border-top: 1px solid @c;
  border-bottom: 1px solid @c;
  border-left: none;
  color: @c;
  height: 200%;
  transform-origin: left top;
  transform: scale(0.5);
  z-index: 1;
}

.setLineMiddle(@c: #C7C7C7) {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 1px;
  border-right: 1px solid @c;
  border-top: 1px solid @c;
  border-bottom: 1px solid @c;
  border-left: none;
  color: @c;
  height: 200%;
  transform-origin: left top;
  transform: scale(0.5);
  z-index: 1;
}

.wiux-button-group {
  -webkit-touch-callout: none;

  & {
    display: flex;
  }

  & > a.wiux-button-tab-item-last {
    border-top-right-radius: @button-tab-border-radius * 2;
    border-bottom-right-radius: @button-tab-border-radius * 2;
    &:after {
      .setLineWithoutLeft(@button-tab-default-border-color);
      border-top-right-radius: @button-tab-border-radius * 2;
      border-bottom-right-radius: @button-tab-border-radius * 2;
    }
  }

  & > a.wiux-button-tab-item-first {
    border-top-left-radius: @button-tab-border-radius * 2;
    border-bottom-left-radius: @button-tab-border-radius * 2;
    &:after {
      .setLine(@button-tab-default-border-color);
      border-top-left-radius: @button-tab-border-radius * 2;
      border-bottom-left-radius: @button-tab-border-radius * 2;
    }
  }

  & > a.wiux-button-tab-item-middle {
    &:after {
      .setLineWithoutLeft(@button-tab-default-border-color);
    }
  }

  & > a {
    &:after {
      background-clip: padding-box;
      box-sizing: border-box;
    }
    display: block;
    position: relative;
    flex: 1;
    width: 100%;
    height: @button-tab-height;
    padding: 0;
    font-size: 14px;
    line-height: @button-tab-line-height;
    text-align: center;
    color: @button-tab-default-text-color;
    white-space: nowrap;
    background: @button-tab-default-background-color;
    -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
  }

  & > a.wiux-button-group-current {
    color: @button-tab-active-text-color;
    background: @button-tab-active-background-color;
  }

  & > a.wiux-button-group-current:disabled,
  & > a:disabled {
    border-color: #cdcdcd;
    background: #e5e5e5;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    color: #aaa;
  }
}
</style>
