<template>
  <div class="wiux-cell-box weui-cell" :class="className" @click="onClick">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { go } from "../../libs/router";

export default defineComponent({
  name: "CellBox",
  props: {
    isLink: Boolean,
    link: [String, Object],
    borderIntent: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const className = computed(() => {
      return {
        "wiux-tap-active": props.isLink || !!props.link,
        "weui-cell_access": props.isLink || !!props.link,
        "wiux-cell-no-border-intent": !props.borderIntent,
      };
    });

    const onClick = () => {
      if (props.link) {
        go(props.link as string);
      }
    };

    return {
      className,
      onClick,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
@import "../../styles/weui/base/mixin/setArrow.less";

.wiux-cell-primary {
  flex: 1;
}
.weui-cell.wiux-cell-no-border-intent:before {
  left: 0;
}
</style>
