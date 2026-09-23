<template>
  <div
    class="wiux-flexBox"
    :class="{
      'wiux-flex-col': orient === 'vertical',
      'wiux-flex-row': orient === 'horizontal',
    }"
    :style="styles"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, provide } from "vue";

export const FLEXBOX_KEY = Symbol("flexBox");

export default defineComponent({
  name: "FlexBox",
  props: {
    gutter: {
      type: Number,
      default: 8,
    },
    orient: {
      type: String,
      default: "horizontal",
    },
    justify: {
      type: String,
      default: "",
    },
    align: {
      type: String,
      default: "",
    },
    wrap: {
      type: String,
      default: "",
    },
    direction: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    provide(FLEXBOX_KEY, {
      gutter: computed(() => props.gutter),
      orient: computed(() => props.orient),
    });

    const styles = computed(() => {
      return {
        justifyContent: props.justify,
        WebkitJustifyContent: props.justify,
        alignItems: props.align,
        WebkitAlignItems: props.align,
        flexWrap: props.wrap,
        WebkitFlexWrap: props.wrap,
        flexDirection: props.direction,
        WebkitFlexDirection: props.direction,
      } as Record<string, string>;
    });

    return { styles };
  },
});
</script>

<style lang="less">
.wiux-flexBox {
  width: 100%;
  text-align: left;
  display: flex;
  display: -webkit-flex;
  box-align: center;
  align-items: center;
  .wiux-flexBox-item {
    flex: 1;
    -webkit-flex: 1;
    min-width: 20px;
    width: 0%;
    &:first-child {
      margin-left: 0 !important;
      margin-top: 0 !important;
    }
  }
}

.wiux-flex-row {
  box-direction: row;
  box-orient: horizontal;
  flex-direction: row;
}

.wiux-flex-col {
  box-orient: vertical;
  flex-direction: column;
  > .wiux-flexBox-item {
    width: 100%;
  }
}
</style>
