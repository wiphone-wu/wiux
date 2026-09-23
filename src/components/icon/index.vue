<template>
  <i :class="[className, isMsg ? 'weui-icon_msg' : '']"></i>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Icon",
  props: {
    type: {
      type: String,
      default: "",
    },
    isMsg: Boolean,
  },
  setup(props) {
    const className = computed(() => {
      return `weui-icon weui_icon_${props.type} weui-icon-${props.type.replace(/_/g, "-")}`;
    });

    return {
      className,
    };
  },
});
</script>

<style lang="less">
.icon-big:before {
  font-size: 93px;
}
</style>
