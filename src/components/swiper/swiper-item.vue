<template>
  <div class="wiux-swiper-item"><slot></slot></div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  nextTick,
  inject,
} from "vue";

export default defineComponent({
  name: "SwiperItem",
  setup() {
    const rerender = inject<() => void>("swiperRerender");

    onMounted(() => {
      nextTick(() => {
        if (rerender) {
          rerender();
        }
      });
    });

    onBeforeUnmount(() => {
      nextTick(() => {
        if (rerender) {
          rerender();
        }
      });
    });
  },
});
</script>
