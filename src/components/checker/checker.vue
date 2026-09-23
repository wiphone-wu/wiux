<template>
  <div class="wiux-checker-box">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, provide, reactive } from "vue";

export default defineComponent({
  name: "Checker",
  props: {
    defaultItemClass: String,
    selectedItemClass: String,
    disabledItemClass: String,
    type: {
      type: String,
      default: "radio",
    },
    modelValue: [String, Number, Array, Object],
    max: Number,
    radioRequired: Boolean,
  },
  emits: ["update:modelValue", "on-change"],
  setup(props, { emit }) {
    const currentValue = ref<any>(props.modelValue);

    watch(
      () => props.modelValue,
      (newValue) => {
        currentValue.value = newValue;
      },
    );

    watch(currentValue, (val) => {
      emit("update:modelValue", val);
      emit("on-change", val);
    });

    const parentState = reactive({
      type: props.type,
      defaultItemClass: props.defaultItemClass,
      selectedItemClass: props.selectedItemClass,
      disabledItemClass: props.disabledItemClass,
      max: props.max,
      radioRequired: props.radioRequired,
      currentValue,
    });

    provide("checkerParent", parentState);

    return {
      currentValue,
    };
  },
});
</script>

<style>
.wiux-checker-item {
  display: inline-block;
}
</style>
