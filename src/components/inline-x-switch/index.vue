<template>
  <input
    class="inline-x-switch weui-switch"
    type="checkbox"
    :disabled="disabled"
    v-model="currentValue"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "InlineXSwitch",
  props: {
    disabled: Boolean,
    modelValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    valueMap: {
      type: Array,
      default: () => [false, true],
    },
  },
  emits: ["update:modelValue", "on-change"],
  setup(props, { emit }) {
    const toBoolean = (val: any): boolean => {
      if (!props.valueMap) {
        return val;
      } else {
        const index = (props.valueMap as any[]).indexOf(val);
        return index === 1;
      }
    };

    const toRaw = (val: boolean): any => {
      if (!props.valueMap) {
        return val;
      } else {
        return (props.valueMap as any[])[val ? 1 : 0];
      }
    };

    const currentValue = computed({
      get: () => toBoolean(props.modelValue),
      set: (val: boolean) => {
        const rawValue = toRaw(val);
        emit("update:modelValue", rawValue);
        emit("on-change", rawValue);
      },
    });

    return {
      currentValue,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
.weui-cell_switch .weui-cell__ft {
  font-size: 0;
  position: relative;
}

input.weui-switch[disabled] {
  opacity: @switch-disabled-opacity;
}
</style>
