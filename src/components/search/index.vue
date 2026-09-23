<template>
  <div
    class="wiux-search-box"
    :class="{ 'wiux-search-fixed': isFixed }"
    :style="{ top: isFixed ? top : '', position: fixPosition }"
  >
    <div
      class="weui-search-bar"
      :class="{ 'weui-search-bar_focusing': !isCancel || currentValue }"
    >
      <slot name="left"></slot>
      <form class="weui-search-bar__form" @submit.prevent="onSubmit" action=".">
        <label
          :for="`search_input_${uuid}`"
          class="wiux-search-mask"
          @click="touch"
          v-show="!isFixed && autoFixed"
        ></label>
        <div class="weui-search-bar__box">
          <i class="weui-icon-search"></i>
          <input
            v-model="currentValue"
            ref="inputRef"
            :type="type"
            autocomplete="off"
            class="weui-search-bar__input"
            :id="`search_input_${uuid}`"
            :placeholder="placeholder"
            :required="required"
            @focus="onFocus"
            @blur="onBlur"
            @compositionstart="onComposition($event, 'start')"
            @compositionend="onComposition($event, 'end')"
            @input="onComposition($event, 'input')"
          />
          <a
            href="javascript:"
            class="weui-icon-clear"
            @click="clear"
            v-show="currentValue"
          ></a>
        </div>
        <label
          :for="`search_input_${uuid}`"
          class="weui-search-bar__label"
          v-show="!isFocus && !modelValue"
        >
          <i class="weui-icon-search"></i>
          <span>{{ placeholder || t("Search") }}</span>
        </label>
      </form>
      <a href="javascript:" class="weui-search-bar__cancel-btn" @click="cancel"
        >{{ cancelText || t("Cancel") }}
      </a>
      <slot name="right"></slot>
    </div>
    <div class="weui-cells wiux-search_show" v-show="isFixed">
      <slot></slot>
      <div
        class="weui-cell weui-cell_access"
        v-for="(item, idx) in results"
        :key="idx"
        @click="handleResultClick(item)"
      >
        <div class="weui-cell__bd weui-cell_primary">
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  nextTick,
  type PropType,
} from "vue";
import useUuid from "../../libs/mixin_uuid";
import { useLocale } from "../../composables/useLocale";

export default defineComponent({
  name: "Search",
  props: {
    type: {
      type: String,
      default: "search",
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: String,
    cancelText: String,
    modelValue: {
      type: String,
      default: "",
    },
    results: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      },
    },
    autoFixed: {
      type: Boolean,
      default: true,
    },
    top: {
      type: String,
      default: "0px",
    },
    position: {
      type: String,
      default: "fixed",
    },
    autoScrollToTop: Boolean,
  },
  emits: [
    "update:modelValue",
    "on-submit",
    "on-change",
    "on-result-click",
    "on-focus",
    "on-blur",
    "on-cancel",
    "on-clear",
    "on-touch",
    "result-click",
  ],
  setup(props, { emit }) {
    const { t } = useLocale();
    const { uuid } = useUuid();
    const inputRef = ref<HTMLInputElement | null>(null);
    const onInput = ref(false);
    const currentValue = ref(props.modelValue);
    const isCancel = ref(true);
    const isFocus = ref(false);
    const isFixed = ref(false);

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = val;
      },
    );

    const fixPosition = computed(() => {
      if (isFixed.value) {
        return props.position === "absolute" ? "absolute" : "fixed";
      }
      return "static";
    });

    const emitEvent = () => {
      nextTick(() => {
        emit("update:modelValue", currentValue.value);
        emit("on-change", currentValue.value);
      });
    };

    const setFocus = () => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    };

    const setBlur = () => {
      if (inputRef.value) {
        inputRef.value.blur();
      }
    };

    const onComposition = ($event: any, type: string) => {
      if (type === "start") {
        onInput.value = true;
      }
      if (type === "end") {
        onInput.value = false;
        emitEvent();
      }
      if (type === "input") {
        if (!onInput.value) {
          emitEvent();
        }
      }
    };

    const clear = () => {
      currentValue.value = "";
      emitEvent();
      isFocus.value = true;
      setFocus();
      if (props.autoFixed && !isFixed.value) {
        isFixed.value = true;
      }
      emit("on-clear");
    };

    const cancel = () => {
      isCancel.value = true;
      currentValue.value = "";
      emitEvent();
      isFixed.value = false;
      emit("on-cancel");
    };

    const handleResultClick = (item: any) => {
      emit("result-click", item);
      emit("on-result-click", item);
      isCancel.value = true;
      isFixed.value = false;
    };

    const touch = () => {
      isCancel.value = false;
      if (props.autoFixed) {
        isFixed.value = true;
      }
      emit("on-touch");
    };

    const onFocusHandler = () => {
      isFocus.value = true;
      emit("on-focus");
      touch();
    };

    const onBlurHandler = () => {
      isFocus.value = false;
      emit("on-blur");
    };

    const onSubmit = () => {
      emit("on-submit", currentValue.value);
    };

    watch(isFixed, (val) => {
      if (val === true) {
        setFocus();
        isFocus.value = true;

        if (props.autoScrollToTop) {
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 150);
        }
      }
    });

    return {
      t,
      uuid,
      inputRef,
      currentValue,
      isCancel,
      isFocus,
      isFixed,
      fixPosition,
      setFocus,
      setBlur,
      onComposition,
      clear,
      cancel,
      handleResultClick,
      touch,
      onFocus: onFocusHandler,
      onBlur: onBlurHandler,
      onSubmit,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/weui/icon/weui_icon_font";
@import "../../styles/weui/widget/weui_searchbar/weui_searchbar";
@import "../../styles/weui/widget/weui_cell/weui_cell_global";
@import "../../styles/weui/widget/weui_cell/weui_access";

.wiux-search-fixed {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5;
  background: rgba(255, 255, 255, 1);
}
.wiux-search-box {
  width: 100%;
}
.weui-cells.wiux-search_show {
  margin-top: 0 !important;
  overflow-y: auto;
  position: fixed;
  width: 100%;
  max-height: 100%;
}
</style>
