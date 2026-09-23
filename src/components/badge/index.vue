<template>
  <span
    v-text="text"
    :class="[
      'wiux-badge',
      {
        'wiux-badge-dot': typeof text === 'undefined',
        'wiux-badge-single':
          typeof text !== 'undefined' && String(text).length === 1,
      },
    ]"
  ></span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Badge",
  props: {
    text: {
      type: [String, Number],
      default: undefined,
    },
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-badge {
  display: inline-block;
  text-align: center;
  background: @badge-bg-color;
  color: #fff;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  padding: 0 6px;
  background-clip: padding-box;
  vertical-align: middle;
}
.wiux-badge-single {
  padding: 0;
  width: 16px;
}
.wiux-badge-dot {
  height: auto;
  padding: 5px;
}
</style>
