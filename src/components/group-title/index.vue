<template>
  <div class="weui-cells__title">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "GroupTitle",
});
</script>
