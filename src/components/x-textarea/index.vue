<template>
  <div class="weui-cell wiux-x-textarea">
    <div class="weui-cell__hd">
      <div :style="labelStyles" v-if="hasRestrictedLabel">
        <slot name="restricted-label"></slot>
      </div>
      <slot name="label">
        <label
          class="weui-label"
          :class="labelClass"
          :style="
            {
              width: labelWidthComputed,
              textAlign: labelAlignComputed,
              marginRight: labelMarginRightComputed,
            } as any
          "
          v-if="title"
          v-html="title"
        ></label>
        <inline-desc v-if="inlineDesc">{{ inlineDesc }}</inline-desc>
      </slot>
    </div>
    <div class="weui-cell__bd">
      <textarea
        class="weui-textarea"
        :autocomplete="autocomplete"
        :autocapitalize="autocapitalize"
        :autocorrect="autocorrect"
        :spellcheck="(spellcheck as boolean | 'true' | 'false')"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :name="name"
        :rows="rows"
        :cols="cols"
        :value="currentValue"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        :style="({ ...textareaStyle } as any)"
        :maxlength="max"
        ref="textareaRef"
      ></textarea>
      <div
        class="weui-textarea-counter"
        v-show="showCounter && max"
        @click="focus"
      >
        <span>{{ count }}</span
        >/{{ max }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  inject,
  onMounted,
  onBeforeUnmount,
  nextTick,
  getCurrentInstance,
} from "vue";
import InlineDesc from "../inline-desc/index.vue";

export default defineComponent({
  name: "XTextarea",
  components: {
    InlineDesc,
  },
  props: {
    title: String,
    inlineDesc: String,
    showCounter: {
      type: Boolean,
      default: true,
    },
    max: Number,
    modelValue: String,
    name: String,
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    rows: {
      type: Number,
      default: 3,
    },
    cols: {
      type: Number,
      default: 30,
    },
    height: Number,
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
    autosize: Boolean,
    labelWidth: String,
    labelAlign: String,
    labelMarginRight: String,
  },
  emits: ["update:modelValue", "on-change", "on-focus", "on-blur"],
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
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const currentValue = ref(props.modelValue || "");
    const hasRestrictedLabel = ref(false);

    const count = computed(() => {
      const len = currentValue.value ? currentValue.value.length : 0;
      return len > (props.max || 0) ? props.max : len;
    });

    const textareaStyle = computed(() => {
      if (props.height) {
        return {
          height: `${props.height}px`,
          overflowY: "auto",
          wordWrap: "break-word",
        };
      }
      return {};
    });

    const labelWidthComputed = computed(() => {
      if (props.labelWidth) {
        return props.labelWidth;
      }
      if (parentLabelWidth.value) {
        return parentLabelWidth.value;
      }
      if (props.title) {
        const width = props.title.replace(/[^\x00-\xff]/g, "00").length / 2 + 1;
        return width + "em";
      }
      return undefined;
    });

    const labelStyles = computed(() => {
      const parent = (instance?.proxy?.$parent as any) || {};
      return {
        width:
          parentLabelWidth.value ||
          parent.labelWidth ||
          props.labelWidth ||
          labelWidthComputed.value,
        textAlign:
          parentLabelAlign.value || parent.labelAlign || props.labelAlign,
        marginRight:
          parentLabelMarginRight.value ||
          parent.labelMarginRight ||
          props.labelMarginRight,
      };
    });

    const labelClass = computed(() => {
      const parent = (instance?.proxy?.$parent as any) || {};
      const grandParent = parent?.$parent || {};
      const parentLabelAlignVal =
        parentLabelAlign.value || parent.labelAlign || grandParent.labelAlign;
      return {
        "wiux-cell-justify": parentLabelAlignVal === "justify",
      };
    });

    const labelAlignComputed = computed(() => {
      return props.labelAlign || parentLabelAlign.value;
    });

    const labelMarginRightComputed = computed(() => {
      return props.labelMarginRight || parentLabelMarginRight.value;
    });

    const onInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      let val = target.value;
      if (props.max && val && val.length > props.max) {
        const newLines = (val.match(/\n/g) || []).length;
        val = val.slice(0, props.max - newLines);
        nextTick(() => {
          updateAutosize();
        });
      }
      currentValue.value = val;
      emit("update:modelValue", val);
      emit("on-change", val);
    };

    const onFocus = () => {
      emit("on-focus");
    };

    const onBlur = () => {
      emit("on-blur");
    };

    const focus = () => {
      textareaRef.value?.focus();
    };

    const updateAutosize = () => {
      if (textareaRef.value && props.autosize) {
        const el = textareaRef.value;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    };

    const bindAutosize = () => {
      if (textareaRef.value && props.autosize) {
        const el = textareaRef.value;
        el.style.overflow = "hidden";
        el.style.resize = "none";
        updateAutosize();
        el.addEventListener("input", updateAutosize);
      }
    };

    const unbindAutosize = () => {
      if (textareaRef.value) {
        textareaRef.value.removeEventListener("input", updateAutosize);
      }
    };

    watch(
      () => props.modelValue,
      (val) => {
        if (val !== undefined) {
          currentValue.value = val;
        }
      },
    );

    watch(
      () => props.autosize,
      (val) => {
        unbindAutosize();
        if (val) {
          bindAutosize();
        }
      },
    );

    onMounted(() => {
      if (slots && slots["restricted-label"]) {
        hasRestrictedLabel.value = true;
      }
      nextTick(() => {
        if (props.autosize) {
          bindAutosize();
        }
      });
    });

    onBeforeUnmount(() => {
      unbindAutosize();
    });

    return {
      textareaRef,
      currentValue,
      hasRestrictedLabel,
      count,
      textareaStyle,
      labelWidthComputed,
      labelStyles,
      labelClass,
      labelAlignComputed,
      labelMarginRightComputed,
      onInput,
      onFocus,
      onBlur,
      focus,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/weui/widget/weui_cell/weui_cell_global";
@import "../../styles/weui/widget/weui_cell/weui_form/weui_form_common";

.wiux-x-textarea.weui-cell {
  align-items: flex-start;
}
</style>
