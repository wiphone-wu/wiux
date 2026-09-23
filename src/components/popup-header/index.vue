<template>
  <div class="wiux-popup-header" :class="showBottomBorder ? 'wiux-1px-b' : ''">
    <div class="wiux-popup-header-left" @click="$emit('on-click-left')">
      <slot name="left-text">{{ leftText }}</slot>
    </div>
    <div class="wiux-popup-header-title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="wiux-popup-header-right" @click="$emit('on-click-right')">
      <slot name="right-text">{{ rightText }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PopupHeader",
  props: {
    leftText: String,
    rightText: String,
    title: String,
    showBottomBorder: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["on-click-left", "on-click-right"],
});
</script>

<style lang="less">
@import "../../styles/1px.less";
@import "../../styles/variable.less";

.wiux-popup-header {
  display: flex;
  height: @popup-header-height;
  line-height: @popup-header-height;
  font-size: @popup-header-font-size;
  background-color: @popup-header-bg-color;
}
.wiux-popup-header-title {
  flex: 1;
  text-align: center;
  color: @popup-header-title-text-color;
}
.wiux-popup-header-left {
  padding-left: @popup-header-left-text-padding;
  color: @popup-header-left-text-color;
}
.wiux-popup-header-right {
  padding-right: @popup-header-right-text-padding;
  color: @popup-header-right-text-color;
}
.wiux-popup-header.wiux-1px-b:after {
  border-color: #d9d9d9;
}
</style>
