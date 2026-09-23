<template>
  <li class="wiux-timeline-item">
    <div
      :class="[
        'wiux-timeline-item-color',
        {
          'wiux-timeline-item-head': !isFirst,
          'wiux-timeline-item-head-first': isFirst,
        },
      ]"
      :style="headStyle"
    >
      <Icon
        v-show="isFirst && parent?.isShowIcon?.value"
        type="success_no_circle"
        class="wiux-timeline-item-checked"
      ></Icon>
    </div>
    <div class="wiux-timeline-item-tail" :style="tailStyle"></div>
    <div class="wiux-timeline-item-content">
      <slot></slot>
    </div>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import Icon from "../icon/index.vue";
import { TIMELINE_KEY, type TimelineContext } from "./timeline.vue";

export default defineComponent({
  name: "TimelineItem",
  components: {
    Icon,
  },
  setup() {
    const parent = inject<TimelineContext>(TIMELINE_KEY);
    const currentIndex = ref(0);
    const isLast = ref(true);
    const isFirst = ref(true);

    onMounted(() => {
      const idx = parent?.registerChild();
      if (idx !== undefined) {
        currentIndex.value = idx;
      }
      updateStatus();
    });

    onBeforeUnmount(() => {
      parent?.unregisterChild();
    });

    const updateStatus = () => {
      if (!parent) return;
      const idx = currentIndex.value;
      const childrenCount = parent.childrenCount.value;
      isLast.value = idx === childrenCount - 1;
      isFirst.value = idx === 0;
    };

    watch(
      () => parent?.childrenCount.value,
      () => {
        updateStatus();
      },
    );

    const headStyle = computed(() => ({
      backgroundColor: parent?.color?.value || "",
    }));

    const tailStyle = computed(() => {
      if (isLast.value) {
        return {
          display: "none",
          backgroundColor: parent?.color?.value || "",
        };
      }
      return {
        display: "block",
        backgroundColor: parent?.color?.value || "",
      };
    });

    return {
      parent,
      isLast,
      isFirst,
      headStyle,
      tailStyle,
    };
  },
});
</script>
