<template>
  <div class="wiux-x-switch weui-cell weui-cell_switch">
    <div class="weui-cell__bd">
      <label
        class="weui-label"
        :style="labelStyle"
        :class="labelClass"
        v-html="title"
      ></label>
      <InlineDesc v-if="inlineDesc">{{ inlineDesc }}</InlineDesc>
    </div>
    <div class="weui-cell__ft">
      <input
        class="weui-switch"
        type="checkbox"
        :disabled="disabled"
        :checked="currentValue"
        @change="onChange"
      />
      <div
        v-if="preventDefault"
        class="wiux-x-switch-overlay"
        @click="onClick"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  inject,
  getCurrentInstance,
  type PropType,
} from "vue";
import InlineDesc from "../inline-desc/index.vue";
import cleanStyle from "../../libs/clean-style";

export default defineComponent({
  name: "XSwitch",
  components: {
    InlineDesc,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [Boolean, String, Number] as PropType<boolean | string | number>,
      default: undefined,
    },
    value: {
      type: [Boolean, String, Number] as PropType<boolean | string | number>,
      default: false,
    },
    inlineDesc: {
      type: [String, Boolean, Number],
      default: "",
    },
    preventDefault: {
      type: Boolean,
      default: false,
    },
    valueMap: {
      type: Array as PropType<any[]>,
      default: () => [false, true],
    },
  },
  emits: ["update:modelValue", "on-click", "on-change"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const parentLabelWidth = inject(
      "parentLabelWidth",
      computed(() => ""),
    );
    const parentLabelAlign = inject(
      "parentLabelAlign",
      computed(() => ""),
    );

    const toBoolean = (val: any): boolean => {
      if (!props.valueMap) {
        return !!val;
      }
      const index = props.valueMap.indexOf(val);
      return index === 1;
    };

    const toRaw = (val: boolean): any => {
      if (!props.valueMap) {
        return val;
      }
      return props.valueMap[val ? 1 : 0];
    };

    const currentValue = computed({
      get: () => {
        const val =
          props.modelValue !== undefined ? props.modelValue : props.value;
        const result = toBoolean(val);
        return result;
      },
      set: (val: boolean) => {
        const rawValue = toRaw(val);
        emit("update:modelValue", rawValue);
        emit("on-change", rawValue);
      },
    });

    const onChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      currentValue.value = target.checked;
    };

    const parent = computed(() => {
      const $parent = instance?.proxy?.$parent || {};
      return $parent as any;
    });

    const labelStyle = computed(() => {
      const isHTML = /<\/?[^>]*>/.test(props.title);
      const width = Math.min(isHTML ? 5 : props.title.length + 1, 14) + "em";
      return cleanStyle({
        display: "block",
        width: parentLabelWidth.value || parent.value.labelWidth || width,
        textAlign: parentLabelAlign.value || parent.value.labelAlign,
      });
    });

    const labelClass = computed(() => {
      const align = parentLabelAlign.value || parent.value.labelAlign;
      return {
        "wiux-cell-justify": align === "justify",
      };
    });

    const onClick = () => {
      emit("on-click", !currentValue.value, currentValue.value);
    };

    return {
      currentValue,
      labelStyle,
      labelClass,
      onClick,
      onChange,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/weui/base/fn";
.weui-cell_switch .weui-cell__ft {
  font-size: 0;
  position: relative;
}

input.weui-switch[disabled] {
  opacity: @switch-disabled-opacity;
}

.wiux-x-switch.weui-cell_switch {
  padding-top: 6px;
  padding-bottom: 6px;
}

.wiux-x-switch-overlay {
  width: 60px;
  height: 50px;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
}

.wiux-cell-justify {
  height: unit(@weuiCellLineHeight, em);
  &&:after {
    content: ".";
    display: inline-block;
    width: 100%;
    overflow: hidden;
    height: 0;
  }
}
</style>
