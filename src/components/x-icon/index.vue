<template>
  <svg
    :class="['wiux-x-icon', `wiux-x-icon-${type}`]"
    :width="size"
    :height="size"
    viewBox="0 0 512 512"
    v-html="iconPath"
  ></svg>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { getIcon } from "./icons";

export default defineComponent({
  name: "XIcon",
  props: {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: "24",
    },
  },
  setup(props) {
    const iconPath = computed(() => getIcon(props.type));

    return {
      iconPath,
    };
  },
});
</script>
