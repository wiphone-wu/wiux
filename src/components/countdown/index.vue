<template>
  <span>{{ currentTime }}</span>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";

export default defineComponent({
  name: "Countdown",
  props: {
    modelValue: {
      type: Number,
      default: 60,
    },
    start: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue", "on-finish"],
  setup(props, { emit }) {
    const currentTime = ref(props.modelValue || 60);
    const index = ref(0);
    let interval: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      interval = setInterval(() => {
        if (currentTime.value > 0) {
          currentTime.value--;
        } else {
          stop();
          index.value++;
          emit("on-finish", index.value);
        }
      }, 1000);
    };

    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    watch(
      () => props.modelValue,
      (val) => {
        currentTime.value = val;
      },
    );

    watch(currentTime, (val) => {
      emit("update:modelValue", val);
    });

    watch(
      () => props.start,
      (newVal, oldVal) => {
        if (newVal === true && oldVal === false && currentTime.value > 0) {
          tick();
        }
        if (newVal === false && oldVal === true) {
          stop();
        }
      },
    );

    onMounted(() => {
      if (props.start) {
        tick();
      }
    });

    onBeforeUnmount(() => {
      stop();
    });

    return {
      currentTime,
    };
  },
});
</script>
