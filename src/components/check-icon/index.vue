<template>
  <div class="wiux-check-icon" @click="updateValue">
    <icon type="success" v-show="type === 'default' && value"></icon>
    <icon type="success_circle" v-show="type === 'plain' && value"></icon>
    <icon type="circle" v-show="!value"></icon>
    <span><slot></slot></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Icon from "../icon/index.vue";

export default defineComponent({
  name: "CheckIcon",
  components: {
    Icon,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "default",
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const updateValue = () => {
      emit("update:value", !props.value);
    };
    return {
      updateValue,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-check-icon {
  display: inline-block;
}
.wiux-check-icon > span {
  line-height: 23px;
  color: #222;
  vertical-align: middle;
}
.wiux-check-icon > .weui-icon-success:before,
.wiux-check-icon > .weui-icon-success-circle:before {
  color: @check-icon-color-checked;
}
</style>
