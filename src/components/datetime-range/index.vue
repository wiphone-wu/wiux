<template>
  <div>
    <popup-picker
      :data="list"
      :title="title"
      :display-format="cellFormat"
      v-model="currentValue"
      :inline-desc="inlineDesc"
      :placeholder="placeholder"
      @on-hide="emitHide"
      @on-show="onShow"
      :value-text-align="valueTextAlign"
      :column-width="[1 / 2, 1 / 6]"
      :confirm-text="confirmTextLabel"
    ></popup-picker>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import value2name from "../../filters/value2name";
import PopupPicker from "../popup-picker/index.vue";
import getDateRange from "../../tools/date/range";
import getNumberRange from "../../tools/number/range";

export default defineComponent({
  name: "DatetimeRange",
  components: {
    PopupPicker,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    startDate: String,
    endDate: String,
    format: {
      type: String,
      default: "YYYY-MM-DD",
    },
    rawValue: Boolean,
    inlineDesc: String,
    placeholder: String,
    hideDistrict: Boolean,
    valueTextAlign: String,
    confirmText: {
      type: String,
      default: "确定",
    },
  },
  emits: ["on-hide", "on-show", "on-change", "update:modelValue"],
  setup(props, { emit }) {
    const currentValue = ref<any[]>((props.modelValue as any[]) || []);
    const confirmTextLabel = computed(() => props.confirmText);

    function cellFormat(val: string[]) {
      return val[0] + " " + val[1] + ":" + val[2];
    }

    function emitHide(val: any) {
      emit("on-hide", val);
    }

    function onShow() {
      emit("on-show");
    }

    function getAddressName() {
      return value2name(currentValue.value, list.value);
    }

    const list = computed(() => {
      if (!props.startDate || !props.endDate) {
        return [];
      }
      const datesNames = getDateRange(
        props.startDate,
        props.endDate,
        props.format,
      );
      const datesValues = getDateRange(
        props.startDate,
        props.endDate,
        "YYYY-MM-DD",
      );
      const hours = getNumberRange(0, 23);
      const minutes = getNumberRange(0, 59);
      return [
        datesNames.map((one: string, index: number) => {
          return {
            name: one,
            value: datesValues[index],
          };
        }),
        hours.map((h: string) => ({ name: h, value: h })),
        minutes.map((m: string) => ({ name: m, value: m })),
      ];
    });

    const nameValue = computed(() => {
      return value2name(currentValue.value, list.value);
    });

    watch(
      currentValue,
      (val: any[]) => {
        emit("on-change", val);
        emit("update:modelValue", val);
      },
      { deep: true },
    );

    watch(
      () => props.modelValue,
      (val: any) => {
        currentValue.value = val || [];
      },
    );

    return {
      currentValue,
      confirmTextLabel,
      cellFormat,
      emitHide,
      onShow,
      getAddressName,
      list,
      nameValue,
    };
  },
});
</script>
