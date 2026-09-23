<template>
  <div class="weui-tab">
    <slot name="header"></slot>
    <div
      class="weui-tab__panel wiux-fix-safari-overflow-scrolling"
      ref="viewBoxBody"
      id="wiux_view_box_body"
      :style="{ paddingTop: bodyPaddingTop, paddingBottom: bodyPaddingBottom }"
    >
      <slot></slot>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ViewBox",
  props: {
    bodyPaddingTop: String,
    bodyPaddingBottom: String,
  },
  setup(props, { expose }) {
    const viewBoxBody = ref<HTMLElement | null>(null);

    const scrollTo = (top: number) => {
      if (viewBoxBody.value) {
        viewBoxBody.value.scrollTop = top;
      }
    };

    const getScrollTop = () => {
      return viewBoxBody.value?.scrollTop || 0;
    };

    const getScrollBody = () => {
      return viewBoxBody.value;
    };

    expose({
      scrollTo,
      getScrollTop,
      getScrollBody,
      viewBoxBody,
    });

    return {
      viewBoxBody,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/weui/widget/weui_tab/wiux-tabbar";
</style>
