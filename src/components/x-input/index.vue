<template>
  <div
    class="wiux-x-input weui-cell"
    :class="{
      'weui-cell_warn': showWarn,
      disabled: disabled,
      'wiux-x-input-has-right-full': hasRightFullHeightSlot,
    }"
  >
    <div class="weui-cell__hd">
      <div :style="labelStyles" v-if="hasRestrictedLabel">
        <slot name="restricted-label"></slot>
      </div>
      <slot name="label">
        <label
          class="weui-label"
          :class="labelClass"
          :style="{
            width: labelWidth || labelWidthComputed,
            textAlign: labelAlign,
            marginRight: labelMarginRight,
          }"
          v-if="title"
          v-html="title"
          :for="`wiux-x-input-${uuid}`"
        ></label>
        <inline-desc v-if="inlineDesc">{{ inlineDesc }}</inline-desc>
      </slot>
    </div>
    <div
      class="weui-cell__bd weui-cell__primary"
      :class="
        placeholderAlign ? `wiux-x-input-placeholder-${placeholderAlign}` : ''
      "
    >
      <input
        :id="`wiux-x-input-${uuid}`"
        v-if="
          !type ||
          type === 'text' ||
          type === 'number' ||
          type === 'email' ||
          type === 'password' ||
          type === 'tel'
        "
        class="weui-input"
        :maxlength="max"
        :autocomplete="autocomplete"
        :autocapitalize="autocapitalize"
        :autocorrect="autocorrect"
        :spellcheck="spellcheck as boolean | 'true' | 'false'"
        :style="inputStyle"
        :type="type || 'text'"
        :name="name"
        :pattern="pattern"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :value="currentValue"
        @input="onInputValue"
        @focus="focusHandler"
        @blur="onBlur"
        @keyup="onKeyUp"
        ref="inputRef"
      />
    </div>
    <div class="weui-cell__ft">
      <icon
        type="clear"
        v-show="
          !hasRightFullHeightSlot &&
          !equalWith &&
          showClear &&
          currentValue !== '' &&
          !readonly &&
          !disabled &&
          isFocus
        "
        @touchstart="clear"
        @mousedown="clear"
      ></icon>
      <icon
        @click="onClickErrorIcon"
        class="wiux-input-icon"
        type="warn"
        :title="!valid ? firstError : ''"
        v-show="showWarn"
      ></icon>
      <icon
        @click="onClickErrorIcon"
        class="wiux-input-icon"
        type="warn"
        v-if="!noValidate && hasLengthEqual && dirty && equalWith && !valid"
      ></icon>
      <icon
        type="success"
        v-show="!noValidate && equalWith && equalWith === currentValue && valid"
      ></icon>
      <icon
        type="success"
        class="wiux-input-icon"
        v-show="noValidate && iconType === 'success'"
      ></icon>
      <icon
        type="warn"
        class="wiux-input-icon"
        v-show="noValidate && iconType === 'error'"
      ></icon>
      <slot name="right"></slot>
      <div v-if="hasRightFullHeightSlot" class="wiux-x-input-right-full">
        <slot name="right-full-height"></slot>
      </div>
    </div>
    <toast v-model="showErrorToast" type="text" width="auto" :time="600">{{
      firstError
    }}</toast>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  inject,
  getCurrentInstance,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import Icon from "../icon/index.vue";
import InlineDesc from "../inline-desc/index.vue";
import Toast from "../toast/index.vue";
import isEmail from "validator/lib/isEmail";
import { isMobilePhone } from "validator";
import mask from "vanilla-masker";

const validators: Record<
  string,
  { fn: (str: string) => boolean; msg: string }
> = {
  email: {
    fn: isEmail,
    msg: "邮箱格式",
  },
  "china-mobile": {
    fn(str: string) {
      return isMobilePhone(str, "zh-CN");
    },
    msg: "手机号码",
  },
  "china-name": {
    fn(str: string) {
      return /^[\u4e00-\u9fff]{2,6}$/.test(str);
    },
    msg: "中文姓名",
  },
};

export default defineComponent({
  name: "XInput",
  components: {
    Icon,
    InlineDesc,
    Toast,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: String,
    modelValue: [String, Number],
    name: String,
    readonly: Boolean,
    disabled: Boolean,
    keyboard: String,
    inlineDesc: String,
    isType: [String, Function],
    min: Number,
    max: Number,
    showClear: {
      type: Boolean,
      default: true,
    },
    equalWith: String,
    textAlign: String,
    required: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: "off",
    },
    autocapitalize: {
      type: String,
      default: "off",
    },
    autocorrect: {
      type: String,
      default: "off",
    },
    spellcheck: {
      type: String,
      default: "false",
    },
    noValidate: {
      type: Boolean,
      default: false,
    },
    iconType: String,
    debounce: Number,
    placeholderAlign: String,
    labelWidth: String,
    mask: String,
    shouldToastError: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    "update:modelValue",
    "on-change",
    "on-focus",
    "on-blur",
    "on-enter",
    "on-click-error-icon",
    "on-click-clear-icon",
  ],
  setup(props, { emit, slots }) {
    const instance = getCurrentInstance();
    const parentLabelWidth = inject(
      "parentLabelWidth",
      computed(() => ""),
    );
    const parentLabelAlign = inject(
      "parentLabelAlign",
      computed(() => ""),
    );
    const parentLabelMarginRight = inject(
      "parentLabelMarginRight",
      computed(() => ""),
    );
    const uuid = ref(Math.random().toString(36).substring(3, 8));
    const inputRef = ref<HTMLInputElement | null>(null);
    const currentValue = ref(
      props.modelValue !== undefined && props.modelValue !== null
        ? String(props.modelValue)
        : "",
    );
    const isFocus = ref(false);
    const valid = ref(true);
    const errors = ref<Record<string, string>>({});
    const firstError = ref("");
    const forceShowError = ref(false);
    const pristine = ref(true);
    const touched = ref(false);
    const showErrorToast = ref(false);
    const hasLengthEqual = ref(false);
    const hasRightFullHeightSlot = ref(false);
    const hasRestrictedLabel = ref(false);
    let lastDirection = 0;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const dirty = computed(() => !pristine.value);

    const showWarn = computed(() => {
      return (
        !props.noValidate &&
        !props.equalWith &&
        !valid.value &&
        firstError.value &&
        (touched.value || forceShowError.value)
      );
    });

    const labelWidthComputed = computed(() => {
      if (props.labelWidth) {
        return props.labelWidth;
      }
      if (parentLabelWidth.value) {
        return parentLabelWidth.value;
      }
      const width = props.title.replace(/[^\x00-\xff]/g, "00").length / 2 + 1;
      if (width < 10) {
        return width + "em";
      }
      return undefined;
    });

    const labelStyles = computed(() => {
      const parent = (instance?.parent as any)?.proxy;
      return {
        width:
          props.labelWidth ||
          labelWidthComputed.value ||
          parent?.labelWidth ||
          parent?.$parent?.labelWidth ||
          labelWidthComputed.value,
        textAlign: parent?.labelAlign || parent?.$parent?.labelAlign,
        marginRight:
          parent?.labelMarginRight || parent?.$parent?.labelMarginRight,
      };
    });

    const labelAlign = computed(() => {
      const parent = (instance?.parent as any)?.proxy;
      return (
        parentLabelAlign.value ||
        parent?.labelAlign ||
        parent?.$parent?.labelAlign
      );
    });

    const labelMarginRight = computed(() => {
      const parent = (instance?.parent as any)?.proxy;
      return (
        parentLabelMarginRight.value ||
        parent?.labelMarginRight ||
        parent?.$parent?.labelMarginRight
      );
    });

    const labelClass = computed(() => {
      const parent = (instance?.parent as any)?.proxy;
      const parentLabelAlignVal =
        parentLabelAlign.value ||
        parent?.labelAlign ||
        parent?.$parent?.labelAlign;
      return {
        "wiux-cell-justify": parentLabelAlignVal === "justify",
      };
    });

    const pattern = computed(() => {
      if (props.keyboard === "number" || props.isType === "china-mobile") {
        return "[0-9]*";
      }
      return undefined;
    });

    const inputStyle = computed(() => {
      if (props.textAlign) {
        return { textAlign: props.textAlign };
      }
      return {} as Record<string, string>;
    });

    function maskValue(val: string) {
      if (props.mask) {
        return mask.toPattern(val, props.mask);
      }
      return val;
    }

    function getError() {
      const key = Object.keys(errors.value)[0];
      firstError.value = errors.value[key] || "";
    }

    function validate() {
      if (typeof props.equalWith !== "undefined") {
        validateEqual();
        return;
      }
      errors.value = {};

      if (!currentValue.value && !props.required) {
        valid.value = true;
        return;
      }

      if (!currentValue.value && props.required) {
        valid.value = false;
        errors.value.required = "必填哦";
        getError();
        return;
      }

      if (typeof props.isType === "string") {
        const validator = validators[props.isType];
        if (validator) {
          let value = currentValue.value;
          if (
            props.isType === "china-mobile" &&
            props.mask === "999 9999 9999"
          ) {
            value = currentValue.value.replace(/\s+/g, "");
          }
          valid.value = validator.fn(value);
          if (!valid.value) {
            forceShowError.value = true;
            errors.value.format = validator.msg + "格式不对哦~";
            getError();
            return;
          } else {
            delete errors.value.format;
          }
        }
      }

      if (typeof props.isType === "function") {
        const validStatus = (props.isType as Function)(currentValue.value);
        valid.value = validStatus.valid;
        if (!valid.value) {
          errors.value.format = validStatus.msg;
          forceShowError.value = true;
          getError();
          return;
        } else {
          delete errors.value.format;
        }
      }

      if (props.min) {
        if (currentValue.value.length < props.min) {
          errors.value.min = `最少应该输入${props.min}个字符哦`;
          valid.value = false;
          getError();
          return;
        } else {
          delete errors.value.min;
        }
      }

      if (props.max) {
        if (currentValue.value.length > props.max) {
          errors.value.max = `最多可以输入${props.max}个字符哦`;
          valid.value = false;
          forceShowError.value = true;
          return;
        } else {
          forceShowError.value = false;
          delete errors.value.max;
        }
      }

      valid.value = true;
    }

    function validateEqual() {
      if (!props.equalWith && currentValue.value) {
        valid.value = false;
        errors.value.equal = "输入不一致";
        return;
      }
      const willCheck =
        dirty.value ||
        currentValue.value.length >= (props.equalWith || "").length;
      if (willCheck && currentValue.value !== props.equalWith) {
        valid.value = false;
        errors.value.equal = "输入不一致";
        return;
      } else {
        if (!currentValue.value && props.required) {
          valid.value = false;
        } else {
          valid.value = true;
          delete errors.value.equal;
        }
      }
    }

    function _getInputMaskSelection(
      selection: number,
      direction: number,
      maskVal: string,
      loop?: boolean,
    ): number {
      if (!props.mask || (loop && direction === 0)) {
        return selection;
      }
      if (direction === 0) {
        direction = lastDirection;
      }
      if (direction > 0) {
        const maskChar = props.mask.substring(
          selection - direction,
          selection - direction + 1,
        );
        if (!maskChar.match(/[9SA]/)) {
          return _getInputMaskSelection(
            selection + 1,
            direction,
            maskVal,
            true,
          );
        }
      }
      return selection;
    }

    function onInputValue(e: Event) {
      const target = e.target as HTMLInputElement;
      currentValue.value = target.value;
    }

    function focusHandler($event: FocusEvent) {
      emit("on-focus", currentValue.value, $event);
      isFocus.value = true;
      setTimeout(() => {
        if (inputRef.value) {
          (inputRef.value as any).scrollIntoViewIfNeeded?.(false);
        }
      }, 1000);
    }

    function onBlur($event: FocusEvent) {
      touched.value = true;
      validate();
      isFocus.value = false;
      emit("on-blur", currentValue.value, $event);
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "Enter") {
        (e.target as HTMLInputElement).blur();
        emit("on-enter", currentValue.value, e);
      }
    }

    function clear() {
      currentValue.value = "";
      focus();
      emit("on-click-clear-icon");
    }

    function focus() {
      inputRef.value?.focus();
    }

    function onClickErrorIcon() {
      if (props.shouldToastError && firstError.value) {
        showErrorToast.value = true;
      }
      emit("on-click-error-icon", firstError.value);
    }

    function reset(value = "") {
      pristine.value = true;
      touched.value = false;
      currentValue.value = value;
      firstError.value = "";
      valid.value = true;
    }

    onBeforeMount(() => {
      if (slots["restricted-label"]) {
        hasRestrictedLabel.value = true;
      }
      if (slots["right-full-height"]) {
        hasRightFullHeightSlot.value = true;
      }
      if (props.modelValue !== undefined && props.modelValue !== null) {
        currentValue.value = props.mask
          ? maskValue(String(props.modelValue))
          : String(props.modelValue);
      }
      if (
        props.required &&
        (!currentValue.value || currentValue.value === "")
      ) {
        valid.value = false;
      }
    });

    onBeforeUnmount(() => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    });

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value =
          val !== undefined && val !== null ? String(val) : "";
        if (pristine.value === true) {
          pristine.value = false;
        }
      },
    );

    watch(
      () => props.mask,
      (val) => {
        if (val && currentValue.value) {
          currentValue.value = maskValue(currentValue.value);
        }
      },
    );

    watch(valid, () => {
      getError();
    });

    watch(
      () => props.equalWith,
      (newVal) => {
        if (newVal && props.equalWith) {
          if (newVal.length === (props.equalWith || "").length) {
            hasLengthEqual.value = true;
          }
          validateEqual();
        } else {
          validate();
        }
      },
    );

    watch(currentValue, (newVal, oldVal) => {
      let selection: number | null = null;
      try {
        if (!props.equalWith && newVal) {
          validateEqual();
        }
        if (newVal && props.equalWith) {
          if (newVal.length === (props.equalWith || "").length) {
            hasLengthEqual.value = true;
          }
          validateEqual();
        } else {
          validate();
        }
      } catch (e) {
        /* ignore validation error */
      }
      try {
        selection = inputRef.value?.selectionStart || 0;
        const direction = newVal.length - oldVal.length;
        selection = _getInputMaskSelection(
          selection,
          direction,
          maskValue(newVal),
        );
        lastDirection = direction;
      } catch (e) {
        /* ignore */
      }
      emit("update:modelValue", maskValue(newVal));
      setTimeout(() => {
        if (
          inputRef.value &&
          inputRef.value.selectionStart !== selection &&
          selection !== null
        ) {
          inputRef.value.selectionStart = selection;
          inputRef.value.selectionEnd = selection;
        }
        if (currentValue.value !== maskValue(newVal)) {
          currentValue.value = maskValue(newVal);
        }
      });

      if (props.debounce) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          emit("on-change", newVal);
        }, props.debounce);
      } else {
        emit("on-change", newVal);
      }
    });

    return {
      uuid,
      inputRef,
      currentValue,
      isFocus,
      valid,
      firstError,
      showWarn,
      showErrorToast,
      hasLengthEqual,
      hasRightFullHeightSlot,
      hasRestrictedLabel,
      dirty,
      labelWidthComputed,
      labelStyles,
      labelClass,
      labelAlign,
      labelMarginRight,
      pattern,
      inputStyle,
      onInputValue,
      focusHandler,
      onBlur,
      onKeyUp,
      clear,
      focus,
      onClickErrorIcon,
      reset,
    };
  },
});
</script>

<style lang="less">
.wiux-x-input .wiux-x-input-placeholder-right input::-webkit-input-placeholder {
  text-align: right;
}
.wiux-x-input .wiux-x-input-placeholder-center input::-webkit-input-placeholder {
  text-align: center;
}
.wiux-x-input .wiux-input-icon {
  font-size: 21px;
}
.wiux-input-icon.weui-icon-warn:before,
.wiux-input-icon.weui-icon-success:before {
  font-size: 21px;
}
.wiux-x-input .weui-icon {
  padding-left: 5px;
}
.wiux-x-input.weui-cell_vcode {
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
}
.wiux-x-input.disabled {
  .weui-input {
    -webkit-text-fill-color: #888;
    opacity: 1;
  }
}
.wiux-x-input-right-full {
  margin-left: 5px;
  height: 44px;
  vertical-align: middle;
  & img {
    height: 44px;
  }
}
.wiux-x-input-has-right-full {
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
}
</style>
