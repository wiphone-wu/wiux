<template>
  <div class="wiux-step-item" :class="{ 'wiux-step-item-with-tail': !isLast }">
    <div
      :class="'wiux-step-item-tail wiux-step-item-tail-' + currentStatus"
      v-show="!isLast"
      :style="{ right: parent?.gutter?.value }"
    ></div>
    <div :class="'wiux-step-item-head wiux-step-item-head-' + currentStatus">
      <div class="wiux-step-item-head-inner">
        <span
          v-if="!icon && currentStatus !== 'finish'"
          class="wiux-step-item-icon"
          >{{ currentStepNumber }}</span
        >
        <span v-else :class="'wiux-step-item-icon wiux-step-item-' + iconName">
          <Icon type="success_no_circle" class="wiux-step-item-checked"></Icon>
        </span>
      </div>
    </div>
    <div
      :class="'wiux-step-item-main wiux-step-item-main-' + currentStatus"
      :style="{
        backgroundColor: parent?.backgroundColor?.value,
        paddingRight: isLast ? 0 : parent?.gutter?.value,
      }"
    >
      <span class="wiux-step-item-title">{{ title }}</span>
      <div class="wiux-step-item-description">{{ description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import Icon from "../icon/index.vue";
import { STEP_KEY, type StepContext } from "./step.vue";

export default defineComponent({
  name: "StepItem",
  components: {
    Icon,
  },
  props: {
    title: String,
    description: String,
    icon: String,
    status: String,
  },
  setup(props) {
    const parent = inject<StepContext>(STEP_KEY);

    const currentStepNumber = ref(0);
    const currentStatus = ref(props.status || "wait");
    const isLast = ref(false);

    onMounted(() => {
      const idx = parent?.registerChild();
      if (idx !== undefined) {
        currentStepNumber.value = idx + 1;
      }
      updateStatus();
    });

    onBeforeUnmount(() => {
      parent?.unregisterChild();
    });

    const updateStatus = () => {
      if (!parent) return;
      const idx = currentStepNumber.value - 1;
      const childrenCount = parent.childrenCount.value;
      isLast.value = idx === childrenCount - 1;

      if (idx === parent.current.value) {
        currentStatus.value = "process";
      } else if (idx < parent.current.value) {
        currentStatus.value = "finish";
      } else {
        currentStatus.value = "wait";
      }
    };

    watch(
      () => parent?.current.value,
      () => {
        updateStatus();
      },
    );

    watch(
      () => parent?.childrenCount.value,
      () => {
        updateStatus();
      },
    );

    const iconName = computed(() => {
      return props.icon || "check";
    });

    return {
      parent,
      currentStepNumber,
      currentStatus,
      isLast,
      iconName,
    };
  },
});
</script>
