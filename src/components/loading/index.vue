<template>
  <transition :name="transition">
    <div
      class="weui-loading_toast wiux-loading"
      :class="!text ? 'wiux-loading-no-text' : ''"
      v-show="show"
    >
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast" :style="position ? `position:${position}` : ''">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content" v-if="text">{{ text }}<slot></slot></p>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";

export default defineComponent({
  name: "Loading",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "",
    },
    transition: {
      type: String,
      default: "wiux-mask",
    },
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    watch(
      () => props.show,
      (val) => {
        emit("update:show", val);
      },
    );
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
.wiux-loading .weui-toast {
  z-index: @loading-z-index;
}
.weui-icon_toast.weui-loading {
  margin: 30px 0 0;
  width: 38px;
  height: 38px;
  vertical-align: baseline;
  display: inline-block;
}
.wiux-mask-enter,
.wiux-mask-leave-active,
.wiux-mask-leave-active,
.wiux-mask-enter-active {
  position: relative;
  z-index: 1;
}
.wiux-mask-enter,
.wiux-mask-leave-active {
  opacity: 0;
}
.wiux-mask-leave-active,
.wiux-mask-enter-active {
  transition: opacity 300ms;
}
.wiux-loading-no-text .weui-toast {
  min-height: 98px;
}
.weui-loading_toast.wiux-loading {
  animation: none;
  border: none;
  border-radius: 0;
  width: auto;
  height: auto;
  display: block;
}
</style>
