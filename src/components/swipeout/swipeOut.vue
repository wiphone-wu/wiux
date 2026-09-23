<template>
  <div class="wiux-swipeout">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, shallowReactive } from "vue";

interface swipeoutItemInstance {
  currentTransform: { value: number };
  isOpen: { value: boolean };
  close: () => void;
  closeWithoutAnimation: () => void;
}

export default defineComponent({
  name: "swipeout",
  setup() {
    const items: swipeoutItemInstance[] = shallowReactive([]);

    function registerItem(item: swipeoutItemInstance) {
      items.push(item);
    }

    function unregisterItem(item: swipeoutItemInstance) {
      const idx = items.indexOf(item);
      if (idx > -1) {
        items.splice(idx, 1);
      }
    }

    function closeOtherItems(currentItem: swipeoutItemInstance): boolean {
      let hasOpen = false;
      items.forEach((item) => {
        if (item !== currentItem && item.currentTransform.value !== 0) {
          item.closeWithoutAnimation();
          item.isOpen.value = false;
          hasOpen = true;
        }
      });
      return hasOpen;
    }

    provide("swipeoutRegister", registerItem);
    provide("swipeoutUnregister", unregisterItem);
    provide("swipeoutCloseOthers", closeOtherItems);
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-swipeout {
  width: 100%;
  overflow: hidden;
}
.wiux-swipeout-item {
  position: relative;
}
.wiux-swipeout-button-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 0;
  text-align: right;
}
.wiux-swipeout-button-box-left {
  text-align: left;
}
.wiux-swipeout-button-box > div {
  height: 100%;
}
.wiux-swipeout-button {
  height: 100%;
  text-align: center;
  font-size: 14px;
  color: @swipeout-button-font-color;
  border: none;
}
.wiux-swipeout-content {
  position: relative;
  background: @swipeout-content-bg-color;
}
.wiux-swipeout-content.wiux-swipeout-content-animated {
  transition: transform 0.2s;
}
.wiux-swipeout-button-primary {
  background-color: @swipeout-button-primary-bg-color;
}
.wiux-swipeout-button-warn {
  background-color: @swipeout-button-warn-bg-color;
}
.wiux-swipeout-button-default {
  background-color: @swipeout-button-default-bg-color;
}
</style>
