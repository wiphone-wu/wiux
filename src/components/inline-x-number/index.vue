<template>
  <div
    :class="{ 'wiux-number-round': buttonStyle === 'round' }"
    class="wiux-inline-x-number"
  >
    <div>
      <a
        @click="sub"
        class="wiux-number-selector wiux-number-selector-sub"
        :class="{ 'wiux-number-disabled': disabledMin }"
      >
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="18"
          height="18"
        >
          <defs></defs>
          <path
            d="M863.74455 544.00086 163.424056 544.00086c-17.664722 0-32.00086-14.336138-32.00086-32.00086s14.336138-32.00086 32.00086-32.00086l700.320495 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.440237 544.00086 863.74455 544.00086z"
          ></path>
        </svg>
      </a>
      <input
        v-model.number="currentValue"
        :name="name"
        class="wiux-number-input"
        :style="{ width: width }"
        :readonly="!fillable"
        pattern="[0-9]*"
        type="number"
        @blur="blur"
      />
      <a
        @click="add"
        class="wiux-number-selector wiux-number-selector-plus"
        :class="{ 'wiux-number-disabled': disabledMax }"
      >
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="20"
          height="20"
        >
          <defs></defs>
          <path
            d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z"
          ></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  name: "InlineXNumber",
  props: {
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    modelValue: {
      type: [Number, String],
      default: 0,
    },
    name: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    fillable: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "50px",
    },
    buttonStyle: {
      type: String,
      default: "square",
    },
    align: {
      type: String,
      default: "right",
    },
  },
  emits: ["update:modelValue", "on-change"],
  setup(props, { emit }) {
    const currentValue = ref<number | string>(0);
    currentValue.value = props.modelValue;

    const disabledMin = computed(() => {
      return typeof props.min === "undefined"
        ? false
        : currentValue.value === ""
          ? true
          : Number(currentValue.value) <= props.min;
    });

    const disabledMax = computed(() => {
      return typeof props.max === "undefined"
        ? false
        : currentValue.value === ""
          ? true
          : Number(currentValue.value) >= props.max;
    });

    watch(
      () => props.modelValue,
      (newValue) => {
        currentValue.value = newValue === "" ? "" : newValue;
        emit("on-change", newValue);
      },
    );

    watch(currentValue, (newValue) => {
      if (newValue !== "") {
        if (
          typeof props.min !== "undefined" &&
          Number(currentValue.value) < props.min
        ) {
          currentValue.value = props.min;
        }
        if (props.max && Number(currentValue.value) > props.max) {
          currentValue.value = props.max;
        }
      }
      emit(
        "update:modelValue",
        currentValue.value === "" ? "" : currentValue.value,
      );
    });

    const add = () => {
      if (!disabledMax.value) {
        const val = Number(currentValue.value) || 0;
        currentValue.value = parseFloat((val + props.step).toFixed(10));
      }
    };

    const sub = () => {
      if (!disabledMin.value) {
        const val = Number(currentValue.value) || 0;
        currentValue.value = parseFloat((val - props.step).toFixed(10));
      }
    };

    const blur = () => {
      if (currentValue.value === "") {
        currentValue.value = 0;
      }
    };

    return {
      currentValue,
      disabledMin,
      disabledMax,
      add,
      sub,
      blur,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
.wiux-inline-x-number {
  display: inline-block;
}

.wiux-number-input {
  float: left;
  height: 20px;
  font-size: 20px;
  color: @number-input-font-color;
  appearance: none;
  border: 1px solid #ececec;
  padding: 3px 0;
  text-align: center;
  border-radius: 1px;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.wiux-number-round .wiux-number-input {
  border: none;
}

.wiux-number-selector {
  float: left;
  height: 20px;
  font-size: 25px;
  line-height: 18px;
  color: @number-button-font-color;
  border: 1px solid @number-square-button-enabled-border-color;
  svg {
    fill: @number-button-font-color;
  }
}

.wiux-number-round .wiux-number-selector {
  width: 20px;
  border-radius: 13px;
}

.wiux-number-selector.wiux-number-disabled svg {
  fill: #ccc;
}

.wiux-number-round .wiux-number-selector.wiux-number-disabled {
  border-color: @number-round-button-disabled-border-color;
  svg {
    fill: #ccc;
  }
}

.wiux-number-selector-sub {
  border-right: none;
  padding: 4px 8px 2px 8px;
  border-radius: 2px 0 0 2px;
}

.wiux-number-selector-plus {
  border-left: none;
  margin-right: 5px;
  padding: 3px 8px;
  border-radius: 0 2px 2px 0;
}

.wiux-number-round .wiux-number-selector-sub svg {
  position: relative;
  top: 1px;
}

.wiux-number-round .wiux-number-selector-sub,
.wiux-number-round .wiux-number-selector-plus {
  padding: 2px;
  border: 1px solid @number-round-button-enabled-border-color;
  text-align: center;
}
</style>
