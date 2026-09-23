<template>
  <span class="wiux-label-desc"><slot></slot></span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InlineDesc",
});
</script>

<style>
.wiux-label-desc {
  font-size: 14px;
  color: #666;
}
</style>
