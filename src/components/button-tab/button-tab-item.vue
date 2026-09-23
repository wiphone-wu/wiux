<template>
  <a
    class="wiux-button-tab-item"
    :class="classes"
    href="javascript:"
    :style="itemStyle"
    @click="onItemClick"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { BUTTON_TAB_KEY, type ButtonTabContext } from "./index.vue";

export default defineComponent({
  name: "ButtonTabItem",
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["on-item-click"],
  setup(props, { emit }) {
    const parent = inject<ButtonTabContext>(BUTTON_TAB_KEY);

    if (!parent) {
      console.warn("[ButtonTabItem] must be used inside ButtonTab");
      return {
        classes: {},
        itemStyle: {},
        onItemClick: () => {},
      };
    }

    const currentIndex = ref(-1);

    onMounted(() => {
      currentIndex.value = parent.registerChild();
    });

    onBeforeUnmount(() => {
      parent.unregisterChild();
    });

    const classes = computed(() => {
      const idx = currentIndex.value;
      return {
        "wiux-button-group-current": idx === parent.currentIndex.value,
        "wiux-button-tab-item-first": idx === 0,
        "wiux-button-tab-item-last": idx === parent.childrenCount.value - 1,
        "wiux-button-tab-item-middle":
          idx > 0 && idx !== parent.childrenCount.value - 1,
      };
    });

    const itemStyle = computed(() => {
      if (parent.height.value) {
        return {
          height: `${parent.height.value}px`,
          lineHeight: `${parent.height.value}px`,
        };
      }
      return {};
    });

    const onItemClick = () => {
      if (props.disabled) return;
      parent.setIndex(currentIndex.value);
      emit("on-item-click", currentIndex.value);
    };

    return {
      classes,
      itemStyle,
      onItemClick,
    };
  },
});
</script>
