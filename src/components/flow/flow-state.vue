<template>
  <div
    class="weui-wePay-flow__li"
    :class="{ 'weui-wePay-flow__li_done': isDone }"
  >
    <div class="weui-wePay-flow__state">{{ state }}</div>
    <p :class="`weui-wePay-flow__title-${titlePosition}`">
      <slot name="title">{{ title }}</slot>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from "vue";

export default defineComponent({
  name: "FlowState",
  props: {
    state: [String, Number],
    title: String,
    isDone: Boolean,
  },
  setup() {
    const instance = getCurrentInstance();

    const titlePosition = computed(() => {
      return (instance?.proxy?.$parent as any)?.orientation === "vertical"
        ? "right"
        : "bottom";
    });

    return {
      titlePosition,
    };
  },
});
</script>
