<template>
  <cell
    @click="show"
    :title="title"
    :is-link="!readonly"
    :value-align="valueAlign"
    :border-intent="borderIntent"
  >
    <span class="wiux-cell-placeholder" v-if="!displayValue && placeholder">{{
      placeholder
    }}</span>
    <span class="wiux-cell-value" v-if="displayValue">{{ displayValue }}</span>
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <popup
      v-model="showPopup"
      style="background-color: #fff"
      @on-hide="$emit('on-hide')"
      @on-show="$emit('on-show')"
    >
      <slot name="popup-header" :options="options" :value="currentValue"></slot>
      <radio
        :options="options"
        v-model="currentValue"
        :fill-mode="false"
        @on-change="onValueChange"
      >
        <template #each-item="props">
          <slot
            name="each-item"
            :icon="props.icon"
            :label="props.label"
            :index="props.index"
            :selected="props.selected"
          >
            <p>
              <img
                class="wiux-radio-icon"
                :src="props.icon"
                v-show="props.icon"
              />
              <span class="wiux-radio-label">{{ props.label }}</span>
            </p>
          </slot>
        </template>
      </radio>
    </popup>
  </cell>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, type PropType } from "vue";
import Cell from "../cell/index.vue";
import Popup from "../popup/index.vue";
import Radio from "../radio/index.vue";

export default defineComponent({
  name: "PopupRadio",
  components: {
    Cell,
    Popup,
    Radio,
  },
  props: {
    placeholder: String,
    readonly: Boolean,
    title: String,
    valueAlign: String,
    borderIntent: Boolean,
    modelValue: {
      type: [String, Number],
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "on-change", "on-hide", "on-show", "input"],
  setup(props, { emit }) {
    const showPopup = ref(false);
    const currentValue = ref(props.modelValue || props.value);

    const displayValue = computed(() => {
      if (!props.options || !props.options.length) {
        return "";
      }
      if (typeof props.options[0] === "object") {
        const match = (props.options as any[]).find((option: any) => {
          return (
            option.key === currentValue.value ||
            option.value === currentValue.value
          );
        });
        if (match) {
          return match.value;
        }
      }
      return currentValue.value as string;
    });

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = val;
      },
    );
    watch(
      () => props.value,
      (val) => {
        currentValue.value = val;
      },
    );

    watch(currentValue, (val) => {
      emit("input", val);
      emit("update:modelValue", val);
      emit("on-change", val);
    });

    const onValueChange = () => {
      showPopup.value = false;
    };

    const show = () => {
      if (!props.readonly) {
        showPopup.value = true;
      }
    };

    return {
      showPopup,
      currentValue,
      displayValue,
      onValueChange,
      show,
    };
  },
});
</script>

<style>
.wiux-popup-radio-popup {
  background-color: #fff;
}
</style>
