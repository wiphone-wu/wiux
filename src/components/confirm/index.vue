<template>
  <div class="wiux-confirm">
    <XDialog
      v-model="showValue"
      :dialog-class="
        theme === 'android' ? 'weui-dialog weui-skin_android' : 'weui-dialog'
      "
      :mask-transition="maskTransition"
      :dialog-transition="theme === 'android' ? 'wiux-fade' : dialogTransition"
      :hide-on-blur="hideOnBlur"
      :mask-z-index="maskZIndex"
      @on-hide="$emit('on-hide')"
    >
      <div
        class="weui-dialog__hd"
        v-if="!!title"
        :class="{ 'with-no-content': !showContent }"
      >
        <strong class="weui-dialog__title">{{ title }}</strong>
      </div>
      <template v-if="showContent">
        <div class="weui-dialog__bd" v-if="!showInput">
          <slot><div v-html="content"></div></slot>
        </div>
        <div v-else class="wiux-prompt">
          <input
            class="wiux-prompt-msgBox"
            v-bind="inputAttrs"
            v-model="msg"
            :placeholder="placeholder"
            ref="inputRef"
          />
        </div>
      </template>
      <div class="weui-dialog__ft">
        <a
          v-if="showCancelButton"
          href="javascript:;"
          class="weui-dialog__btn weui-dialog__btn_default"
          @click="handleCancel"
          >{{ cancelText || t("Cancel") }}</a
        >
        <a
          v-if="showConfirmButton"
          href="javascript:;"
          class="weui-dialog__btn"
          :class="`weui-dialog__btn_${confirmType}`"
          @click="handleConfirm"
          >{{ confirmText || t("Confirm") }}</a
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
  name: "Confirm",
  components: {
    XDialog,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "ios",
    },
    hideOnBlur: {
      type: Boolean,
      default: false,
    },
    title: String,
    confirmText: String,
    cancelText: String,
    maskTransition: {
      type: String,
      default: "wiux-fade",
    },
    maskZIndex: [Number, String],
    dialogTransition: {
      type: String,
      default: "wiux-dialog",
    },
    content: String,
    closeOnConfirm: {
      type: Boolean,
      default: true,
    },
    inputAttrs: {
      type: Object,
      default: () => ({ type: "text" }),
    },
    showContent: {
      type: Boolean,
      default: true,
    },
    confirmType: {
      type: String,
      default: "primary",
    },
    showCancelButton: {
      type: Boolean,
      default: true,
    },
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue", "on-show", "on-hide", "on-confirm", "on-cancel"],
  setup(props, { emit, expose }) {
    const { t } = useLocale();

    const showValue = ref(false);
    const msg = ref("");
    const inputRef = ref<HTMLInputElement | null>(null);

    if (props.modelValue) {
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
      if (val) {
        if (props.showInput) {
          msg.value = "";
        }
        emit("on-show");
      }
    });

    const setInputValue = (val: string) => {
      msg.value = val;
    };

    const setInputFocus = () => {
      inputRef.value?.focus();
    };

    const handleConfirm = () => {
      if (!showValue.value) return;
      if (props.closeOnConfirm) {
        showValue.value = false;
      }
      emit("on-confirm", msg.value);
    };

    const handleCancel = () => {
      if (!showValue.value) return;
      showValue.value = false;
      emit("on-cancel");
    };

    expose({
      setInputValue,
      setInputFocus,
    });

    return {
      t,
      showValue,
      msg,
      inputRef,
      handleConfirm,
      handleCancel,
      setInputValue,
      setInputFocus,
    };
  },
});
</script>

<style lang="less">
.wiux-prompt {
  padding-bottom: 1.6em;
}

.wiux-prompt-msgBox {
  width: 80%;
  border: 1px solid #dedede;
  border-radius: 5px;
  padding: 4px 5px;
  appearance: none;
  outline: none;
  font-size: 16px;
}
</style>