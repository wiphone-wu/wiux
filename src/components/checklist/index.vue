<template>
  <div :class="disabled ? 'wiux-checklist-disabled' : ''">
    <div v-show="title" class="weui-cells__title">{{ title }}</div>
    <slot name="after-title"></slot>
    <div class="weui-cells weui-cells_checkbox">
      <label
        class="weui-cell weui-check_label"
        :class="{
          'wiux-checklist-label-left': labelPosition === 'left',
        }"
        :for="`checkbox_${uuid}_${index}`"
        v-for="(one, index) in currentOptions"
        :key="getKey(one)"
      >
        <div class="weui-cell__hd">
          <input
            type="checkbox"
            class="weui-check"
            :name="`wiux-checkbox-${uuid}`"
            :value="getKey(one)"
            v-model="currentValue"
            :id="disabled ? '' : `checkbox_${uuid}_${index}`"
            :disabled="isDisabled(getKey(one))"
          />
          <i class="weui-icon-checked wiux-checklist-icon-checked"></i>
        </div>
        <div class="weui-cell__bd">
          <p v-html="getValue(one)"></p>
          <inline-desc v-if="getInlineDesc(one)">{{
            getInlineDesc(one)
          }}</inline-desc>
        </div>
      </label>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onBeforeUpdate } from "vue";
import InlineDesc from "../inline-desc/index.vue";

export const getValue = function (item: any): string {
  return typeof item === "object" ? item.value : item;
};

export const getKey = function (item: any): string {
  return typeof item === "object" ? item.key : item;
};

export const getInlineDesc = function (item: any): string {
  return typeof item === "object" ? item.inlineDesc : "";
};

export const getLabel = function (list: any[] = [], value: any): string {
  if (!list.length) {
    return value;
  }
  if (typeof list[0] === "string") {
    return value;
  }
  const match = list.filter((one: any) => {
    return one.key === value;
  });
  if (match.length) {
    return match[0].value || match[0].label;
  }
  return value;
};

export const getLabels = function (
  list: any[] = [],
  values: any[] = [],
): string[] {
  return values.map((value) => getLabel(list, value));
};

let uuid = 0;

export default defineComponent({
  name: "Checklist",
  components: {
    InlineDesc,
  },
  props: {
    title: String,
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    max: Number,
    min: Number,
    fillMode: Boolean,
    randomOrder: Boolean,
    checkDisabled: {
      type: Boolean,
      default: true,
    },
    labelPosition: {
      type: String,
      default: "right",
    },
    disabled: Boolean,
  },
  emits: [
    "input",
    "update:modelValue",
    "on-change",
    "on-error",
    "on-clear-error",
  ],
  setup(props, { emit }) {
    const currentValue = ref<string[]>([]);
    const currentOptions = ref<any[]>(props.options);
    const tempValue = ref<string>("");
    uuid++;

    const isRadio = computed(() => {
      if (typeof props.max === "undefined") {
        return false;
      }
      return props.max === 1;
    });

    const _total = computed(() => {
      return props.fillMode
        ? currentOptions.value.length + 1
        : currentOptions.value.length;
    });

    const _min = computed(() => {
      if (!props.required && !props.min) {
        return 0;
      }
      if (!props.required && props.min) {
        return Math.min(_total.value, props.min);
      }
      if (props.required) {
        if (props.min) {
          const max = Math.max(1, props.min);
          return Math.min(_total.value, max);
        }
        return 1;
      }
      return 0;
    });

    const _max = computed(() => {
      if (!props.required && !props.max) {
        return _total.value;
      }
      if (props.max) {
        if (props.max > _total.value) {
          return _total.value;
        }
        return props.max;
      }
      return _total.value;
    });

    const valid = computed(() => {
      return (
        currentValue.value.length >= _min.value &&
        currentValue.value.length <= _max.value
      );
    });

    if (props.modelValue.length) {
      currentValue.value = [...props.modelValue] as string[];
    }

    if (props.randomOrder) {
      currentOptions.value = [...props.options].sort(() => Math.random() - 0.5);
    } else {
      currentOptions.value = [...props.options];
    }

    onBeforeUpdate(() => {
      if (isRadio.value) {
        const length = currentValue.value.length;
        if (length > 1) {
          currentValue.value = [currentValue.value[length - 1]];
        }
        const val = JSON.parse(JSON.stringify(currentValue.value));
        tempValue.value = val.length ? val[0] : "";
      }
    });

    const isDisabled = (key: string): boolean => {
      if (!props.checkDisabled) {
        return false;
      }
      if (_max.value > 1) {
        return (
          currentValue.value.indexOf(key) === -1 &&
          currentValue.value.length === _max.value
        );
      }
      return false;
    };

    const getFullValue = () => {
      const labels = getLabels(currentOptions.value, currentValue.value);
      return currentValue.value.map((one, index) => {
        return {
          value: one,
          label: labels[index],
        };
      });
    };

    watch(tempValue, (val) => {
      const _val = val ? [val] : [];
      emit("update:modelValue", _val);
      emit("on-change", _val, getLabels(currentOptions.value, _val));
    });

    watch(
      () => props.modelValue,
      (newVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(currentValue.value)) {
          currentValue.value = [...newVal] as string[];
        }
      },
    );

    watch(
      () => props.options,
      (val) => {
        currentOptions.value = [...val];
      },
    );

    watch(currentValue, (newVal) => {
      const val = JSON.parse(JSON.stringify(newVal));

      if (!isRadio.value) {
        emit("update:modelValue", val);
        emit("on-change", val, getLabels(currentOptions.value, val));
      }
    });

    return {
      uuid,
      currentValue,
      currentOptions,
      tempValue,
      isRadio,
      isDisabled,
      getFullValue,
      getValue,
      getKey,
      getInlineDesc,
    };
  },
});
</script>

<style lang="less">
.weui-cells_checkbox .weui-check:checked + .wiux-checklist-icon-checked:before {
  color: #09bb07;
}

.weui-cells_checkbox > label > * {
  pointer-events: none;
}
.wiux-checklist-disabled .wiux-checklist-icon-checked:before {
  opacity: 0.5;
}
.wiux-checklist-label-left {
  flex-direction: row-reverse;
}
</style>
