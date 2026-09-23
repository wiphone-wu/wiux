<template>
  <a
    href="javascript:;"
    class="weui-grid"
    :class="{
      'wiux-grid-item-no-border':
        (isLast && !gridContext.showLrBorders.value) ||
        (!isLast && !gridContext.showVerticalDividers.value),
    }"
    @click="onClick"
    :style="style"
  >
    <div class="weui-grid__icon" v-if="hasIconSlot || icon">
      <slot name="icon">
        <img :src="icon" alt="" />
      </slot>
    </div>
    <p v-if="hasLabelSlot || label" class="weui-grid__label">
      <slot name="label">
        <span v-html="label"></span>
      </slot>
    </p>
    <slot></slot>
  </a>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  computed,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import { GRID_KEY, type GridContext } from "./grid.vue";
import { go } from "../../libs/router";

export default defineComponent({
  name: "GridItem",
  props: {
    icon: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    link: {
      type: [String, Object],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["on-item-click"],
  setup(props, { emit, slots }) {
    const instance = getCurrentInstance();
    const gridContext = inject<GridContext>(GRID_KEY, {
      column: computed(() => 3),
      showLrBorders: computed(() => true),
      showVerticalDividers: computed(() => true),
      disabled: computed(() => false),
      register: () => {},
      unregister: () => {},
    });

    const hasIconSlot = ref(false);
    const hasLabelSlot = ref(false);
    const index = ref(0);

    const proxy = instance?.proxy as any;

    onMounted(() => {
      hasIconSlot.value = !!slots.icon;
      hasLabelSlot.value = !!slots.label;
      gridContext.register(proxy);
    });

    onBeforeUnmount(() => {
      gridContext.unregister(proxy);
    });

    const isLast = computed(() => {
      return !((index.value + 1) % gridContext.column.value);
    });

    const style = computed(() => {
      const column = gridContext.column.value;
      if (!column) {
        return {};
      }
      return {
        width: `${100 / column}%`,
      };
    });

    const onClick = () => {
      if (!props.disabled && !gridContext.disabled.value) {
        emit("on-item-click");
        go(
          props.link as string | Record<string, unknown>,
          (instance?.proxy as any)?.$router,
        );
      }
    };

    return {
      gridContext,
      isLast,
      style,
      hasIconSlot,
      hasLabelSlot,
      index,
      onClick,
    };
  },
});
</script>

<style lang="less">
.weui-grid.wiux-grid-item-no-border {
  &:before {
    display: none;
  }
}
</style>
