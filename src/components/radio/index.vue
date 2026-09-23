<template>
  <div class="weui-cells_radio" :class="disabled ? 'wiux-radio-disabled' : ''">
    <label
      class="weui-cell weui-cell_radio weui-check__label"
      :for="`radio_${uuid}_${index}`"
      v-for="(one, index) in options"
      :key="index"
    >
      <div class="weui-cell__bd">
        <slot
          name="each-item"
          :icon="one.icon"
          :label="getValue(one)"
          :index="index"
          :selected="currentValue === getKey(one)"
        >
          <p>
            <img
              class="wiux-radio-icon"
              :src="one.icon"
              v-show="one && one.icon"
            />
            <span
              class="wiux-radio-label"
              :style="
                currentValue === getKey(one) ? selectedLabelStyle || '' : ''
              "
              >{{ getValue(one) }}</span
            >
          </p>
        </slot>
      </div>
      <div class="weui-cell__ft">
        <input
          type="radio"
          class="weui-check"
          v-model="currentValue"
          :id="disabled ? '' : `radio_${uuid}_${index}`"
          :value="getKey(one)"
        />
        <span class="weui-icon-checked"></span>
      </div>
    </label>
    <div class="weui-cell" v-show="fillMode">
      <div class="weui-cell__hd">
        <label class="weui-label">{{ fillLabel }}</label>
      </div>
      <div class="weui-cell__bd">
        <input
          class="weui-input needsclick"
          type="text"
          v-model="fillValue"
          :placeholder="fillPlaceholder"
          @blur="isFocus = false"
          @focus="onFocus()"
        />
      </div>
      <div class="weui-cell__ft" v-show="currentValue === '' && !isFocus">
        <i class="weui-icon-warn"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from "vue";

const getValue = (item: any): string => {
  return typeof item === "object" ? item.value : item;
};

const getKey = (item: any): string => {
  return typeof item === "object" ? item.key : item;
};

let uuidCounter = 0;

export default defineComponent({
  name: "Radio",
  props: {
    options: {
      type: Array as PropType<any[]>,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    fillMode: {
      type: Boolean,
      default: false,
    },
    fillPlaceholder: {
      type: String,
      default: "其他",
    },
    fillLabel: {
      type: String,
      default: "其他",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectedLabelStyle: {
      type: Object as PropType<Record<string, string>>,
      default: undefined,
    },
  },
  emits: ["update:modelValue", "on-change"],
  setup(props, { emit }) {
    const currentValue = ref<string | number>(props.modelValue);
    const fillValue = ref("");
    const isFocus = ref(false);
    const uuid = `r${++uuidCounter}`;

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = val;
      },
    );

    watch(currentValue, (newVal) => {
      const isOption = contains(props.options, newVal);
      if (newVal !== "" && isOption) {
        fillValue.value = "";
      }
      emit("on-change", newVal, getLabel(props.options, newVal));
      emit("update:modelValue", newVal);
    });

    watch(fillValue, (newVal) => {
      if (props.fillMode && isFocus.value) {
        currentValue.value = newVal;
      }
    });

    const onFocus = () => {
      currentValue.value = fillValue.value || "";
      isFocus.value = true;
    };

    return {
      currentValue,
      fillValue,
      isFocus,
      uuid,
      getValue,
      getKey,
      onFocus,
    };
  },
});

function contains(a: any[], obj: any): boolean {
  let i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}

function getLabel(list: any[] = [], value: any): any {
  if (!list.length) return value;
  if (typeof list[0] === "string") return value;
  const match = list.filter((one: any) => one.key === value);
  if (match.length) {
    return match[0].value || match[0].label;
  }
  return value;
}
</script>

<style lang="less">
.weui-cell_radio > * {
  pointer-events: none;
}
.wiux-radio-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}
.wiux-radio-label {
  vertical-align: middle;
}
.weui-cells_radio.wiux-radio-disabled
  .weui-check:checked
  + .weui-icon-checked:before {
  opacity: 0.5;
}
</style>
