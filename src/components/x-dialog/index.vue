<template>
  <Teleport to="body">
    <Transition :name="maskTransition">
      <div
        v-show="show"
        class="weui-mask wiux-x-dialog"
        :style="maskStyle"
        v-bind="attrs"
        @click.self="onMaskClick"
      >
        <Transition :name="dialogTransition">
          <div :class="dialogClass" v-show="show" :style="dialogStyle">
            <slot></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, computed, watch, useAttrs } from "vue";

export default defineComponent({
  name: "XDialog",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    maskTransition: {
      type: String,
      default: "wiux-mask",
    },
    maskZIndex: [String, Number],
    dialogTransition: {
      type: String,
      default: "wiux-dialog",
    },
    dialogClass: {
      type: String,
      default: "weui-dialog",
    },
    hideOnBlur: Boolean,
    dialogStyle: Object,
  },
  emits: ["update:modelValue", "on-show", "on-hide", "on-click-mask"],
  setup(props, { emit }) {
    const attrs = useAttrs();
    const show = computed(() => props.modelValue);

    watch(show, (val) => {
      if (val) {
        emit("on-show");
      } else {
        emit("on-hide");
      }
    });

    const maskStyle = computed(() => {
      const base: Record<string, string | number> = {};
      if (typeof props.maskZIndex !== "undefined") {
        base.zIndex = props.maskZIndex;
      }
      return base;
    });

    const onMaskClick = () => {
      if (props.hideOnBlur) {
        emit("update:modelValue", false);
        emit("on-click-mask");
      }
    };

    return {
      show,
      maskStyle,
      onMaskClick,
      attrs,
    };
  },
});
</script>
