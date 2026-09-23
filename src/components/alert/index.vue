<template>
  <div class="wiux-alert">
    <XDialog
      v-model="showValue"
      :mask-transition="maskTransition"
      :dialog-transition="dialogTransition"
      :hide-on-blur="hideOnBlur"
      :mask-z-index="maskZIndex"
      @on-hide="$emit('on-hide')"
      @on-show="$emit('on-show')"
    >
      <div class="weui-dialog__hd">
        <strong class="weui-dialog__title">{{ title }}</strong>
      </div>
      <div class="weui-dialog__bd">
        <slot>
          <div v-html="content"></div>
        </slot>
      </div>
      <div class="weui-dialog__ft">
        <a
          href="javascript:;"
          class="weui-dialog__btn weui-dialog__btn_primary"
          @click="handleHide"
          >{{ buttonText || t("OK") }}</a
        >
      </div>
    </XDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useLocale } from "../../composables/useLocale";
import XDialog from "../x-dialog/index.vue";

export default defineComponent({
  name: "Alert",
  components: {
    XDialog,
  },
  props: {
    modelValue: Boolean,
    title: String,
    content: String,
    buttonText: String,
    hideOnBlur: {
      type: Boolean,
      default: false,
    },
    maskTransition: {
      type: String,
      default: "wiux-mask",
    },
    dialogTransition: {
      type: String,
      default: "wiux-dialog",
    },
    maskZIndex: [Number, String],
  },
  emits: ["update:modelValue", "on-show", "on-hide"],
  setup(props, { emit }) {
    const { t } = useLocale();

    const showValue = ref(false);

    if (typeof props.modelValue !== "undefined") {
      showValue.value = props.modelValue;
    }

    watch(
      () => props.modelValue,
      (val) => {
        showValue.value = val;
      },
    );

    watch(showValue, (val) => {
      emit("update:modelValue", val);
    });

    const handleHide = () => {
      showValue.value = false;
    };

    return {
      t,
      showValue,
      handleHide,
    };
  },
});
</script>