<template>
  <div
    class="wiux-tab-item"
    :class="[
      currentSelected ? activeClass : '',
      {
        'wiux-tab-selected': currentSelected,
        'wiux-tab-disabled': disabled,
      },
    ]"
    :style="itemStyle"
    @click="onItemClick"
  >
    <slot></slot>
    <span
      :style="{
        background: badgeBackground,
        color: badgeColor,
      }"
      class="wiux-tab-item-badge"
      v-if="typeof badgeLabel !== 'undefined' && badgeLabel !== ''"
    >
      {{ badgeLabel }}
    </span>
  </div>
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
import { TAB_KEY, type TabContext } from "./tab.vue";

export default defineComponent({
  name: "TabItem",
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    activeClass: String,
    disabled: Boolean,
    badgeBackground: {
      type: String,
      default: "#f74c31",
    },
    badgeColor: {
      type: String,
      default: "#fff",
    },
    badgeLabel: String,
  },
  emits: ["on-item-click"],
  setup(props, { emit }) {
    const parent = inject<TabContext>(TAB_KEY);

    if (!parent) {
      console.warn("[TabItem] must be used inside Tab");
      return {
        currentSelected: false,
        itemStyle: {},
        onItemClick: () => {},
      };
    }

    const currentIndex = ref(-1);

    onMounted(() => {
      currentIndex.value = parent.registerChild();
      if (props.selected) {
        parent.setIndex(currentIndex.value);
      }
    });

    onBeforeUnmount(() => {
      parent.unregisterChild();
    });

    const currentSelected = computed(
      () => parent.currentIndex.value === currentIndex.value,
    );

    const itemStyle = computed(() => {
      return {
        borderWidth: parent.lineWidth.value + "px",
        borderColor: parent.activeColor.value,
        color: currentSelected.value
          ? parent.activeColor.value
          : props.disabled
            ? parent.disabledColor.value
            : parent.defaultColor.value,
        border: parent.animate.value ? "none" : "auto",
      };
    });

    const onItemClick = () => {
      if (props.disabled) return;
      parent.setIndex(currentIndex.value);
      emit("on-item-click", currentIndex.value);
    };

    return {
      currentSelected,
      itemStyle,
      onItemClick,
    };
  },
});
</script>
