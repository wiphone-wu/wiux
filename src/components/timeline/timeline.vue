<template>
  <div class="wiux-timeline">
    <ul>
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, type Ref } from "vue";

export const TIMELINE_KEY = Symbol("timeline");

export interface TimelineContext {
  color: Ref<string>;
  isShowIcon: Ref<boolean>;
  registerChild: () => number;
  unregisterChild: () => void;
  childrenCount: Ref<number>;
}

export default defineComponent({
  name: "Timeline",
  props: {
    color: String,
    isShowIcon: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const childrenCount = ref(0);

    const registerChild = () => {
      const idx = childrenCount.value;
      childrenCount.value++;
      return idx;
    };

    const unregisterChild = () => {
      childrenCount.value--;
    };

    const context: TimelineContext = {
      color: ref(props.color || ""),
      isShowIcon: ref(props.isShowIcon),
      registerChild,
      unregisterChild,
      childrenCount,
    };

    provide(TIMELINE_KEY, context);

    return {};
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-timeline {
  padding: 1rem;
}

.wiux-timeline > ul > li {
  list-style: none;
}

@wiux-timeline: ~"wiux-timeline";

.@{wiux-timeline} {
  &-item {
    position: relative;
  }

  &-item-content {
    padding: 0 0 1.5rem 1.2rem;
  }

  &-item-head,
  &-item-head-first {
    position: absolute;
    content: "";
    z-index: 99;
    border-radius: 99px;
  }

  &-item-head {
    width: 10px;
    height: 10px;
    left: 1px;
    top: 4px;
  }

  &-item-head-first {
    width: 20px;
    height: 20px;
    left: -4px;
    top: 5px;
  }

  &-item-tail {
    position: absolute;
    content: "";
    height: 100%;
    width: 2px;
    left: 5px;
    top: 5px;
    background-color: @timeline-item-bg-color;
  }

  &-item-checked {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;

    &.weui-icon-success-no-circle::before {
      font-size: 14px;
      position: absolute;
      left: 3px;
      top: 3px;
      margin: 0 !important;
      color: #fff;
    }
  }
}

.wiux-timeline-item-color {
  background-color: @timeline-item-bg-color;
}
</style>
