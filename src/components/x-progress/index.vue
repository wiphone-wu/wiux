<template>
  <div class="weui-progress">
    <div class="weui-progress__bar">
      <div
        class="weui-progress__inner-bar"
        :style="{ width: percent + '%' }"
      ></div>
    </div>
    <a href="javascript:;" class="weui-progress_opr" v-show="showCancel">
      <i class="weui-icon-cancel" @click="cancel"></i>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "XProgress",
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["on-cancel"],
  setup(props, { emit }) {
    const cancel = () => {
      emit("on-cancel");
    };

    return {
      cancel,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/weui/widget/weui_progress/weui_progress";
</style>
