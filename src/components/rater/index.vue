<template>
  <div class="wiux-rater">
    <input v-model="currentValue" style="display: none" />
    <a
      class="wiux-rater-box"
      v-for="i in max"
      :key="i"
      @click="handleClick(i - 1)"
      :class="{ 'is-active': currentValue > i - 1 }"
      :style="{
        color: colors && colors[i - 1] ? colors[i - 1] : '#ccc',
        marginRight: margin + 'px',
        fontSize: fontSize + 'px',
        width: fontSize + 'px',
        height: fontSize + 'px',
        lineHeight: fontSize + 'px',
      }"
    >
      <span class="wiux-rater-inner">
        <span v-html="star"></span>
        <span
          class="wiux-rater-outer"
          :style="{ color: activeColor, width: cutPercent + '%' }"
          v-if="cutPercent > 0 && cutIndex === i - 1"
          v-html="star"
        ></span>
      </span>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  name: "Rater",
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 5,
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    modelValue: {
      type: [Number, String],
      default: 0,
    },
    disabled: Boolean,
    star: {
      type: String,
      default: "★",
    },
    activeColor: {
      type: String,
      default: "#fc6",
    },
    margin: {
      type: Number,
      default: 2,
    },
    fontSize: {
      type: Number,
      default: 22,
    },
  },
  emits: ["update:modelValue", "input"],
  setup(props, { emit }) {
    const colors = ref<string[]>([]);
    const currentValue = ref<number>(
      parseFloat(String(props.value || props.modelValue || 0)),
    );

    const sliceValue = computed(() => {
      const _val = currentValue.value.toFixed(2).split(".");
      return _val.length === 1
        ? [parseInt(_val[0]), 0]
        : [parseInt(_val[0]), parseInt(_val[1])];
    });

    const cutIndex = computed(() => sliceValue.value[0]);

    const cutPercent = computed(() => sliceValue.value[1]);

    const updateStyle = () => {
      for (let j = 0; j < props.max; j++) {
        if (j <= currentValue.value - 1) {
          colors.value[j] = props.activeColor;
        } else {
          colors.value[j] = "#ccc";
        }
      }
    };

    const handleClick = (i: number, force?: boolean) => {
      if (!props.disabled || force) {
        if (currentValue.value === i + 1) {
          currentValue.value = i < props.min ? props.min : i;
          updateStyle();
        } else {
          currentValue.value = i + 1 < props.min ? props.min : i + 1;
        }
      }
    };

    watch(
      () => props.value,
      (val) => {
        currentValue.value = parseFloat(String(val || 0));
      },
    );
    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = parseFloat(String(val || 0));
      },
    );
    watch(currentValue, (val) => {
      updateStyle();
      emit("input", val);
      emit("update:modelValue", val);
    });

    updateStyle();

    return {
      colors,
      currentValue,
      sliceValue,
      cutIndex,
      cutPercent,
      handleClick,
      updateStyle,
    };
  },
});
</script>

<style>
.wiux-rater {
  text-align: left;
  display: inline-block;
  line-height: normal;
}
.wiux-rater a {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  color: #ccc;
}
.wiux-rater a:last-child {
  padding-right: 2px !important;
  margin-right: 0px !important;
}
.wiux-rater a:hover {
  color: #ffdd99;
}
.wiux-rater a.is-disabled {
  color: #ccc !important;
  cursor: not-allowed;
}
.wiux-rater-box {
  position: relative;
}
.wiux-rater-inner {
  position: relative;
  display: inline-block;
}
.wiux-rater-outer {
  position: absolute;
  left: 0;
  top: 0;
  display: inline-block;
  overflow: hidden;
}
</style>
