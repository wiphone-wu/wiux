<template>
  <div
    class="weui-grids"
    :class="{
      'wiux-grid-no-lr-borders': !showLrBorders,
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, provide, type Ref } from "vue";

export interface GridContext {
  column: Ref<number>;
  showLrBorders: Ref<boolean>;
  showVerticalDividers: Ref<boolean>;
  disabled: Ref<boolean>;
  register: (item: any) => void;
  unregister: (item: any) => void;
}

export const GRID_KEY = Symbol("grid");

export default defineComponent({
  name: "Grid",
  props: {
    rows: {
      type: Number,
      validator() {
        return true;
      },
    },
    cols: {
      type: Number,
    },
    showLrBorders: {
      type: Boolean,
      default: true,
    },
    showVerticalDividers: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const children: any[] = [];
    const columnCount = ref(3);

    const countColumn = () => {
      children.forEach((c, index) => {
        c.index = index;
      });
      columnCount.value = children.length || 3;
    };

    const register = (item: any) => {
      children.push(item);
      countColumn();
    };

    const unregister = (item: any) => {
      const idx = children.indexOf(item);
      if (idx > -1) {
        children.splice(idx, 1);
      }
      countColumn();
    };

    const column = computed(() => props.cols || columnCount.value);

    const showLrBordersRef = computed(() => props.showLrBorders);
    const showVerticalDividersRef = computed(() => props.showVerticalDividers);
    const disabledRef = computed(() => props.disabled);

    provide<GridContext>(GRID_KEY, {
      column,
      showLrBorders: showLrBordersRef,
      showVerticalDividers: showVerticalDividersRef,
      disabled: disabledRef,
      register,
      unregister,
    });

    return {
      column,
    };
  },
});
</script>

<style lang="less">
.weui-grids.wiux-grid-no-lr-borders {
  &:after {
    display: none;
  }
}
</style>
