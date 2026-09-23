<template>
  <div class="wiux-cell-box">
    <div
      class="weui-cell wiux-tap-active"
      :class="{ 'weui-cell_access': !disabled }"
      @click="onClick"
      v-show="showCell"
    >
      <div class="weui-cell__hd">
        <slot
          name="title"
          :label-class="labelClass"
          :label-style="labelStyles"
          :label-title="title"
        >
          <label
            class="weui-label"
            :class="labelClass"
            :style="labelStyles"
            v-if="title"
            v-html="title"
          ></label>
        </slot>
        <inline-desc v-if="inlineDesc">{{ inlineDesc }}</inline-desc>
      </div>
      <div class="wiux-cell-primary wiux-popup-picker-select-box">
        <div
          class="wiux-popup-picker-select"
          :style="`text-align:${valueTextAlign}`"
        >
          <span
            class="wiux-popup-picker-value wiux-cell-value"
            v-if="
              !displayFormat && !showName && currentValue && currentValue.length
            "
            >{{ array2string(currentValue) }}</span
          >
          <span
            class="wiux-popup-picker-value wiux-cell-value"
            v-if="
              !displayFormat && showName && currentValue && currentValue.length
            "
            >{{ value2name(currentValue, data) }}</span
          >
          <span
            class="wiux-popup-picker-value wiux-cell-value"
            v-if="displayFormat && currentValue && currentValue.length"
            >{{
              displayFormat(currentValue, value2name(currentValue, data))
            }}</span
          >
          <span
            v-if="(!currentValue || !currentValue.length) && placeholder"
            class="wiux-popup-picker-placeholder wiux-cell-placeholder"
            >{{ placeholder }}</span
          >
        </div>
      </div>
      <div class="weui-cell__ft"></div>
    </div>

    <div v-transfer-dom="isTransferDom">
      <popup
        v-model="showValue"
        class="wiux-popup-picker"
        :id="`wiux-popup-picker-${uuid}`"
        @on-hide="onPopupHide"
        @on-show="onPopupShow"
        :popup-style="popupStyle"
      >
        <div class="wiux-popup-picker-container">
          <popup-header
            :left-text="cancelText || '取消'"
            :right-text="confirmTextDisplay"
            @on-click-left="onHide(false)"
            @on-click-right="onHide(true)"
            :title="popupTitle"
          ></popup-header>
          <picker
            :data="data"
            v-model="tempValue"
            @on-change="onPickerChange"
            :columns="columns"
            :fixed-columns="fixedColumns"
            :container="'#wiux-popup-picker-' + uuid"
            :column-width="columnWidth"
          ></picker>
        </div>
      </popup>
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
  getCurrentInstance,
  toRef,
} from "vue";
import Picker from "../picker/index.vue";
import Popup from "../popup/index.vue";
import PopupHeader from "../popup-header/index.vue";
import InlineDesc from "../inline-desc/index.vue";
import array2string from "../../filters/array2String";
import value2name from "../../filters/value2name";
import TransferDom from "../../directives/transfer-dom/index";

const getObject = function (obj: any) {
  return JSON.parse(JSON.stringify(obj));
};

export default defineComponent({
  name: "PopupPicker",
  directives: {
    TransferDom,
  },
  components: {
    Picker,
    Popup,
    PopupHeader,
    InlineDesc,
  },
  props: {
    valueTextAlign: {
      type: String,
      default: "right",
    },
    title: String,
    cancelText: String,
    confirmText: String,
    data: {
      type: Array,
      default: () => [],
    },
    placeholder: String,
    columns: {
      type: Number,
      default: 0,
    },
    fixedColumns: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    showName: Boolean,
    inlineDesc: [String, Number, Array, Object, Boolean],
    showCell: {
      type: Boolean,
      default: true,
    },
    show: Boolean,
    displayFormat: Function,
    isTransferDom: {
      type: Boolean,
      default: true,
    },
    columnWidth: Array,
    popupStyle: Object,
    popupTitle: String,
    disabled: Boolean,
  },
  emits: [
    "on-show",
    "on-hide",
    "on-change",
    "on-shadow-change",
    "update:modelValue",
    "update:show",
  ],
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
    const parentLabelMarginRight = inject(
      "parentLabelMarginRight",
      computed(() => ""),
    );
    const uuid = ref(Math.random().toString(36).substring(3, 8));
    const onShowProcess = ref(false);
    const tempValue = ref(getObject(props.modelValue));
    const closeType = ref(false);
    const currentData = ref(JSON.stringify(props.data));
    const showValue = ref(
      typeof props.show !== "undefined" ? props.show : false,
    );
    const currentValue = ref(getObject(props.modelValue));

    const labelStyles = computed(() => {
      const parent = (instance?.parent as any)?.proxy;
      const pLabelWidth =
        parentLabelWidth.value ||
        parent?.labelWidth ||
        parent?.$parent?.labelWidth;
      const pLabelAlign =
        parentLabelAlign.value ||
        parent?.labelAlign ||
        parent?.$parent?.labelAlign;
      const pLabelMarginRight =
        parentLabelMarginRight.value ||
        parent?.labelMarginRight ||
        parent?.$parent?.labelMarginRight;
      return {
        display: "block",
        width: pLabelWidth || "auto",
        textAlign: pLabelAlign,
        marginRight: pLabelMarginRight,
      };
    });

    const labelClass = computed(() => {
      const parent = (instance?.parent as any)?.proxy;
      const pLabelAlign =
        parentLabelAlign.value ||
        parent?.labelAlign ||
        parent?.$parent?.labelAlign;
      return {
        "wiux-cell-justify": pLabelAlign === "justify",
      };
    });

    function value2nameFn(value: any[], data: any[]) {
      return value2name(value, data);
    }

    function getNameValues() {
      return value2name(currentValue.value, props.data);
    }

    function onClick() {
      if (!props.disabled) {
        showValue.value = true;
      }
    }

    function onHide(type: boolean) {
      showValue.value = false;
      if (type) {
        closeType.value = true;
        currentValue.value = getObject(tempValue.value);
      }
      if (!type) {
        closeType.value = false;
        if ((props.modelValue as any[]).length > 0) {
          tempValue.value = getObject(currentValue.value);
        }
      }
    }

    function onPopupShow() {
      closeType.value = false;
      emit("on-show");
    }

    function onPopupHide() {
      if ((props.modelValue as any[]).length > 0) {
        tempValue.value = getObject(currentValue.value);
      }
      emit("on-hide", closeType.value);
    }

    function onPickerChange(val: any) {
      if (JSON.stringify(currentValue.value) !== JSON.stringify(val)) {
        if ((props.modelValue as any[]).length) {
          const nowData = JSON.stringify(props.data);
          if (nowData !== currentData.value && currentData.value !== "[]") {
            tempValue.value = getObject(val);
          }
          currentData.value = nowData;
        }
      }
      const _val = getObject(val);
      emit("on-shadow-change", _val, value2name(_val, props.data).split(" "));
    }

    watch(
      () => props.modelValue,
      (val: any) => {
        if (JSON.stringify(val) !== JSON.stringify(tempValue.value)) {
          tempValue.value = getObject(val);
          currentValue.value = getObject(val);
        }
      },
    );

    watch(currentValue, (val: any) => {
      emit("update:modelValue", getObject(val));
      emit("on-change", getObject(val));
    });

    watch(
      () => props.show,
      (val: boolean) => {
        showValue.value = val;
      },
    );

    watch(showValue, (val: boolean) => {
      emit("update:show", val);
    });

    watch(
      () => props.data,
      () => {
        currentData.value = JSON.stringify(props.data);
      },
      { deep: true },
    );

    const confirmTextDisplay = computed(() => {
      return props.confirmText || "完成";
    });

    return {
      uuid,
      showValue,
      currentValue,
      tempValue,
      labelStyles,
      labelClass,
      value2name: value2nameFn,
      array2string,
      getNameValues,
      confirmTextDisplay,
      cancelText: toRef(props, "cancelText"),
      popupTitle: toRef(props, "popupTitle"),
      onClick,
      onHide,
      onPopupShow,
      onPopupHide,
      onPickerChange,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
@import "../../styles/1px.less";

.wiux-cell-primary {
  flex: 1;
}
.wiux-cell-box {
  position: relative;
}
.wiux-cell-box:not(:first-child):before {
  content: " ";
  position: absolute;
  top: 0;
  width: 100%;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
  left: 15px;
}
.wiux-popup-picker-header {
  height: 44px;
  color: @popup-picker-header-text-color;
  background-color: @popup-picker-header-bg-color;
  font-size: @popup-picker-header-font-size;
  position: relative;
  &:after {
    .setBottomLine(#e5e5e5);
  }
}
// .wiux-popup-picker-value {
//   display: inline-block;
// }
.wiux-popup-picker-header-menu {
  text-align: left;
  padding-left: 15px;
  line-height: 44px;
}
.wiux-popup-picker-header-menu-right {
  text-align: right;
  padding-right: 15px;
}
.wiux-popup-picker-select {
  width: 100%;
  position: relative;
}
.wiux-popup-picker-select-box.weui-cell__bd:after {
  content: " ";
  display: inline-block;
  transform: rotate(45deg);
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  position: relative;
  top: -2px;
  position: absolute;
  top: 50%;
  right: 15px;
  margin-top: -4px;
}
// .wiux-popup-picker-select {
//   width: 100%;
//   box-sizing: border-box;
//   height: 100%;
//   display: flex;
//   align-items: center;
// }
.wiux-popup-picker-select-box {
  position: relative;
}
.wiux-popup-picker-placeholder {
  color: #999;
}
</style>
