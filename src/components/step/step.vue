<template>
  <div class="wiux-step">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, watch, onMounted, type Ref } from "vue";

export const STEP_KEY = Symbol("step");

export interface StepContext {
  current: Ref<number>;
  backgroundColor: Ref<string>;
  gutter: Ref<string>;
  childrenCount: Ref<number>;
  registerChild: () => number;
  unregisterChild: () => void;
}

export default defineComponent({
  name: "Step",
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    backgroundColor: {
      type: String,
      default: "#fff",
    },
    gutter: {
      type: String,
      default: "10px",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const current = ref(props.modelValue);
    const childrenCount = ref(0);
    const children: Ref<number[]> = ref([]);

    watch(current, (val) => {
      emit("update:modelValue", val);
    });

    watch(
      () => props.modelValue,
      (val) => {
        current.value = val;
      },
    );

    const registerChild = () => {
      const idx = childrenCount.value;
      childrenCount.value++;
      children.value.push(idx);
      return idx;
    };

    const unregisterChild = () => {
      childrenCount.value--;
    };

    const context: StepContext = {
      current,
      backgroundColor: ref(props.backgroundColor),
      gutter: ref(props.gutter),
      childrenCount,
      registerChild,
      unregisterChild,
    };

    provide(STEP_KEY, context);

    return {};
  },
});
</script>

<style lang="less">
.wiux-step {
  display: flex;
}
.wiux-step-item {
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.wiux-step-item-with-tail {
  flex: 1;
}

.wiux-step-item-tail {
  height: 1px;
  position: absolute;
  left: 0;
  top: 12px;
  padding: 0 0;
  transition: all 0.4s ease 0s;
}

.wiux-step-item-tail-finish {
  background: #09bb07 none repeat scroll 0 0;
}

.wiux-step-item-tail-process,
.wiux-step-item-tail-wait {
  background: #ccc none repeat scroll 0 0;
}

.wiux-step-item-icon {
  width: 22px;
  height: 22px;
  display: inline-block;
  text-align: center;
}

.wiux-step-item-checked::before {
  font-size: 15px !important;
  line-height: 22px;
  margin: 0 !important;
  transform: translateY(-4px);
}

.wiux-step-item-title {
  font-size: 0.8rem;
}

.wiux-step-item-head {
  position: relative;
  display: inline-block;
  margin-right: 0; // NOTE: 原来是 -4

  .wiux-step-item-head-inner {
    width: 22px;
    height: 22px;
    line-height: 22px;
    border-radius: 99px;
    text-align: center;
    font-size: 14px;
    transition: all 0.4s ease 0s;
    background: #fff none repeat scroll 0 0;
  }
}

.wiux-step-item-head-finish .wiux-step-item-head-inner {
  border: 1px solid #09bb07;
  color: #09bb07;
}

.wiux-step-item-head-process .wiux-step-item-head-inner {
  border: 1px solid #09bb07;
  color: #fff;
  background: #09bb07 none repeat scroll 0 0;
}

.wiux-step-item-head-wait .wiux-step-item-head-inner {
  border: 1px solid #888;
  color: #888;
}

.wiux-step-item-main {
  display: inline-block;
  position: relative;
  vertical-align: top;
  color: #888;
  padding-left: 5px;
}

.wiux-step-item-main-process {
  font-weight: bold;
  color: #666;
}
</style>
