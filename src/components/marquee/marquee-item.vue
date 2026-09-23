<template>
  <li>
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent, onMounted, nextTick, getCurrentInstance } from "vue";

export default defineComponent({
  name: "MarqueeItem",
  setup() {
    const instance = getCurrentInstance();

    onMounted(() => {
      nextTick(() => {
        const parent = instance?.proxy?.$parent as any;
        if (parent && typeof parent.destroy === "function") {
          parent.destroy();
          parent.init();
          parent.start();
        }
      });
    });
  },
});
</script>
