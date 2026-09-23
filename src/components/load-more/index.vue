<template>
  <div
    class="wiux-loadmore weui-loadmore"
    :class="{
      'weui-loadmore_line': !showLoading,
      'weui-loadmore_dot': !showLoading && !tip,
    }"
  >
    <i class="weui-loading" v-if="showLoading"></i>
    <span class="weui-loadmore__tips" v-show="tip || !showLoading">{{
      tip
    }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoadMore",
  props: {
    showLoading: {
      type: Boolean,
      default: true,
    },
    tip: String,
  },
});
</script>

<style lang="less">
@import "../../styles/weui/base/fn";
.wiux-loadmore {
  &.weui-loadmore_line {
    display: flex;
    border-top: 0;

    &:before,
    &:after {
      position: relative;
      top: -1px;
      flex: 1;
      content: "";
      border-top: 1px solid @weuiLineColorLight;
    }
  }
}
</style>
