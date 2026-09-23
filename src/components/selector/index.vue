<template>
  <div
    class="wiux-selector weui-cell"
    :class="{
      'weui-cell_select': !readonly,
      'weui-cell_select-after': title,
    }"
  >
    <div class="weui-cell__hd" v-if="title">
      <label
        :for="`wiux-selector-${uuid}`"
        class="weui-label"
        :class="labelClass"
        :style="
          cleanStyle({
            width: labelWidthComputed,
            textAlign: labelAlignComputed,
            marginRight: labelMarginRightComputed,
          })
        "
        v-html="title"
      ></label>
    </div>
    <div class="weui-cell__bd" v-if="!readonly">
      <select
        :id="`wiux-selector-${uuid}`"
        class="weui-select"
        v-model="currentValue"
        :name="name"
        :style="
          cleanStyle({
            direction: direction,
            color: color,
          })
        "
      >
        <option
          :value="currentValue === null ? 'null' : ''"
          v-if="showPlaceholder"
          :selected="isEmptyValue(currentValue) && !!placeholder"
        >
          {{ placeholder }}
        </option>
        <option :value="one.key" v-for="one in processOptions" :key="one.key">
          {{ direction === "rtl" ? one.value + "\u200E" : one.value }}
        </option>
      </select>
    </div>
    <div class="weui-cell__ft wiux-selector-readonly" v-else>
      {{ findValueByKey(currentValue, processOptions) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, inject } from "vue";
import cleanStyle from "../../libs/clean-style";
import mixinUuid from "../../libs/mixin_uuid";

interface OptionItem {
  key: string;
  value: string;
}

function findValueByKey(
  key: string | number | boolean,
  options: OptionItem[],
): string {
  const found = options.find((item) => item.key === String(key));
  return found ? found.value : String(key);
}

export default defineComponent({
  name: "Selector",
  props: {
    modelValue: {
      type: [String, Number, Object, Boolean],
      default: "",
    },
    title: String,
    direction: String,
    options: {
      type: Array,
      required: true,
    },
    name: String,
    placeholder: String,
    readonly: Boolean,
    valueMap: {
      type: Array as () => string[],
      validator(val: string[]) {
        if (!val.length || val.length !== 2) {
          if (process.env.NODE_ENV === "development") {
            console.error(
              "[WIUX error] selector prop:valueMap's length should be 2",
            );
          }
          return false;
        }
        return true;
      },
    },
    labelWidth: String,
    labelAlign: String,
    labelMarginRight: String,
  },
  emits: ["update:modelValue", "on-change"],
  setup(props, { emit, expose }) {
    const { uuid } = mixinUuid();
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
    const currentValue = ref<string | number | boolean>(
      String(props.modelValue ?? ""),
    );

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = String(val ?? "");
      },
    );

    watch(currentValue, (val) => {
      emit("update:modelValue", val);
      emit("on-change", val);
    });

    const isEmptyValue = (val: unknown): boolean => {
      return typeof val === "undefined" || val === "" || val === null;
    };

    const processOptions = computed<OptionItem[]>(() => {
      const opts = props.options as any[];
      if (!opts.length) {
        return [];
      }

      const isObject = typeof opts[0] === "object";

      if (isObject && !props.valueMap) {
        return opts.map((item) => ({
          key: String(item.key),
          value: String(item.value),
        }));
      }

      if (isObject && props.valueMap) {
        return opts.map((item) => ({
          key: String(item[props.valueMap![0]]),
          value: String(item[props.valueMap![1]]),
        }));
      }

      return opts.map((item) => ({
        key: String(item),
        value: String(item),
      }));
    });

    const showPlaceholder = computed(() => {
      if (isEmptyValue(currentValue.value) && props.placeholder) {
        return true;
      }
      return false;
    });

    const color = computed(() => {
      return showPlaceholder.value ? "#A9A9A9" : "";
    });

    const labelClass = computed(() => {
      const align = parentLabelAlign.value || props.labelAlign;
      return {
        "wiux-cell-justify": align === "justify",
      };
    });

    const labelWidthComputed = computed(() => {
      return props.labelWidth || parentLabelWidth.value;
    });

    const labelAlignComputed = computed(() => {
      return props.labelAlign || parentLabelAlign.value;
    });

    const labelMarginRightComputed = computed(() => {
      return props.labelMarginRight || parentLabelMarginRight.value;
    });

    const getFullValue = (): unknown => {
      if (!currentValue.value) {
        return null;
      }
      if (!props.options.length) {
        return null;
      }
      const opts = props.options as any[];
      if (typeof opts[0] !== "object") {
        return currentValue.value;
      } else {
        if (!props.valueMap) {
          return opts.filter((one: any) => one.key === currentValue.value);
        } else {
          return opts.filter(
            (one: any) => one[props.valueMap![0]] === currentValue.value,
          );
        }
      }
    };

    expose({ getFullValue });

    return {
      uuid,
      currentValue,
      isEmptyValue,
      processOptions,
      showPlaceholder,
      color,
      labelClass,
      labelWidthComputed,
      labelAlignComputed,
      labelMarginRightComputed,
      cleanStyle,
      findValueByKey,
    };
  },
});
</script>

<style lang="less">
.wiux-selector-no-padding {
  padding-left: 0;
}
.wiux-selector.weui-cell_select {
  padding: 0;
}
.wiux-selector.weui-cell_select-after {
  padding-left: 15px;
}
.wiux-selector-readonly {
  width: 100%;
  text-align: right;
}
</style>