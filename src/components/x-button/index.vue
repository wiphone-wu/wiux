<template>
  <button
    :style="buttonStyle"
    class="weui-btn"
    :class="classes"
    :disabled="disabled"
    :type="(actionType as 'button' | 'submit' | 'reset')"
    @click="onClick"
  >
    <i class="weui-loading" v-if="showLoading"></i>
    <slot>{{ text }}</slot>
  </button>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  getCurrentInstance,
  type PropType,
} from "vue";
import { go } from "../../libs/router";

export default defineComponent({
  name: "XButton",
  props: {
    type: {
      type: String,
      default: "default",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mini: {
      type: Boolean,
      default: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
    actionType: {
      type: String,
      default: "",
    },
    showLoading: {
      type: Boolean,
      default: false,
    },
    link: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
      default: "",
    },
    gradients: {
      type: Array as PropType<string[]>,
      validator: (val: string[]) => val.length === 2,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();

    const noBorder = computed(() => Array.isArray(props.gradients));

    const buttonStyle = computed(() => {
      if (props.gradients) {
        return {
          background: `linear-gradient(90deg, ${props.gradients[0]}, ${props.gradients[1]})`,
          color: "#FFFFFF",
        };
      }
      return {};
    });

    const classes = computed(() => {
      return [
        {
          "weui-btn_disabled": !props.plain && props.disabled,
          "weui-btn_plain-disabled": props.plain && props.disabled,
          "weui-btn_mini": props.mini,
          "wiux-x-button-no-border": noBorder.value,
        },
        !props.plain ? `weui-btn_${props.type}` : "",
        props.plain ? `weui-btn_plain-${props.type}` : "",
        props.showLoading ? "weui-btn_loading" : "",
      ];
    });

    const onClick = () => {
      if (!props.disabled) {
        emit("click");
        go(
          props.link as string | Record<string, unknown>,
          (instance?.proxy as any)?.$router,
        );
      }
    };

    return {
      buttonStyle,
      classes,
      onClick,
    };
  },
});
</script>

<style lang="less">
.weui-btn.wiux-x-button-no-border:after {
  display: none;
}
</style>
