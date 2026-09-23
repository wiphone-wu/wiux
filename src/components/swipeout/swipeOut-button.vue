<template>
  <button
    class="wiux-swipeout-button"
    :class="{
      'wiux-swipeout-button-primary': type === 'primary',
      'wiux-swipeout-button-warn': type === 'warn',
      'wiux-swipeout-button-default': type === 'default',
    }"
    :style="{
      width: `${width}px`,
      backgroundColor: backgroundColor,
      opacity: disabled ? '0.4' : '1',
    }"
    @click="onButtonClick"
    type="button"
    :disabled="disabled"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "swipeoutButton",
  props: {
    text: {
      type: String,
      default: "",
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 80,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const parent: any = inject("swipeoutItemParent", null);

    function onButtonClick() {
      if (parent) {
        parent.onItemClick(props.text);
      }
    }

    return {
      onButtonClick,
    };
  },
});
</script>
