<template>
  <popup-picker
    :fixed-columns="hideDistrict ? 2 : 0"
    :columns="columns"
    :data="list"
    :title="title"
    v-model="currentValue"
    show-name
    :inline-desc="inlineDesc"
    :placeholder="placeholder"
    :value-text-align="valueTextAlign"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    :display-format="displayFormat"
    :popup-style="popupStyle"
    :popup-title="popupTitle"
    v-model:show="showValue"
    :disabled="disabled"
    @on-shadow-change="onShadowChange"
    @on-hide="emitHide"
    @on-show="$emit('on-show')"
  >
    <template v-slot:title="props">
      <slot
        name="title"
        :label-class="props.labelClass"
        :label-style="props.labelStyles"
        :label-title="props.title"
      >
        <label
          :class="[props.labelClass, labelClass]"
          :style="props.labelStyle"
          v-if="props.labelTitle"
          v-html="props.labelTitle"
        ></label>
      </slot>
    </template>
  </popup-picker>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  computed,
  inject,
  getCurrentInstance,
} from "vue";
import PopupPicker from "../popup-picker/index.vue";
import name2value from "../../filters/name2value";
import value2name from "../../filters/value2name";

export default defineComponent({
  name: "XAddress",
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
    columns: {
      type: Number,
      default: () => 3,
    },
    rawValue: Boolean,
    list: {
      type: Array,
      required: true,
    },
    labelWidth: String,
    inlineDesc: String,
    placeholder: String,
    hideDistrict: Boolean,
    valueTextAlign: String,
    confirmText: String,
    cancelText: String,
    displayFormat: {
      type: Function,
      default: (val: any[], names: any[]) => names,
    },
    popupStyle: Object,
    popupTitle: String,
    show: Boolean,
    disabled: Boolean,
  },
  emits: [
    "update:modelValue",
    "update:show",
    "on-show",
    "on-hide",
    "on-shadow-change",
  ],
  setup(props, { emit }) {
    const parentLabelAlign = inject(
      "parentLabelAlign",
      computed(() => ""),
    );
    const currentValue = ref(props.modelValue as any[]);
    const showValue = ref(false);

    if (props.show) {
      showValue.value = true;
    }

    if (currentValue.value.length && props.rawValue) {
      const parsedVal = name2value(currentValue.value, props.list);
      if (/__/.test(parsedVal)) {
        console.error("[WIUX] Wrong address value", currentValue.value);
        currentValue.value = [];
      } else {
        currentValue.value = parsedVal.split(" ");
      }
    }

    const labelClass = computed(() => {
      const instance = getCurrentInstance();
      const parent = (instance?.parent as any)?.proxy;
      const pLabelAlign =
        parentLabelAlign.value ||
        parent?.labelAlign ||
        parent?.$parent?.labelAlign;
      return {
        "wiux-cell-justify": pLabelAlign === "justify",
      };
    });

    function getAddressName() {
      return value2name(currentValue.value, props.list);
    }

    function onShadowChange(ids: any[], names: any[]) {
      emit("on-shadow-change", ids, names);
    }

    function emitHide(val: any) {
      emit("on-hide", val);
    }

    watch(currentValue, (val) => {
      emit("update:modelValue", val);
    });

    watch(
      () => props.modelValue,
      (val) => {
        if (
          val &&
          val.length &&
          typeof val[0] === "string" &&
          !/\d+/.test(val[0])
        ) {
          const id = name2value(val as string[], props.list).split(" ");
          if (id[0] !== "__" && id[1] !== "__") {
            currentValue.value = id;
            return;
          }
        }
        currentValue.value = val || [];
      },
    );

    watch(
      () => props.show,
      (val) => {
        showValue.value = val || false;
      },
    );

    watch(showValue, (val) => {
      emit("update:show", val);
    });

    return {
      currentValue,
      showValue,
      labelClass,
      onShadowChange,
      emitHide,
      getAddressName,
    };
  },
});
</script>
