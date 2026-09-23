<template>
  <div class="wiux-divider">
    <span class="wiux-divider-content"><slot></slot></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Divider",
});
</script>

<style lang="less" scoped>
.wiux-divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: #999;
  font-size: 17px;
  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e5e5;
    transform: scaleY(0.5);
  }
  &::before {
    margin-right: 12px;
  }
  &::after {
    margin-left: 12px;
  }
}
.wiux-divider-content {
  flex-shrink: 0;
}
</style>
