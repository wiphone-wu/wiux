<template>
  <div class="wiux-actionsheet">
    <transition name="wiux-actionsheet-mask">
      <div
        class="weui-mask weui-mask_transparent"
        @click="onClickingMask"
        v-show="show"
      ></div>
    </transition>

    <div class="weui-skin_android" v-if="theme === 'android'">
      <transition
        name="wiux-android-actionsheet"
        @after-enter="emitEvent('on-after-show')"
        @after-leave="emitEvent('on-after-hide')"
      >
        <div class="weui-actionsheet" v-show="show">
          <div class="weui-actionsheet__menu">
            <div
              class="weui-actionsheet__cell"
              v-for="(text, key) in menuList"
              :key="key"
              @click="onMenuClick(text, key)"
              v-html="getLabel(text)"
            ></div>
          </div>
        </div>
      </transition>
    </div>

    <transition
      name="wiux-ios-actionsheet"
      v-else
      @after-enter="emitEvent('on-after-show')"
      @after-leave="emitEvent('on-after-hide')"
    >
      <div
        class="weui-actionsheet"
        :class="{ 'weui-actionsheet_toggle': show }"
        v-show="show"
      >
        <div class="weui-actionsheet__menu">
          <div class="weui-actionsheet__cell" v-if="hasHeaderSlot">
            <slot name="header"></slot>
          </div>
          <div
            class="weui-actionsheet__cell"
            v-for="(text, key) in menuList"
            :key="key"
            @click="onMenuClick(text, key)"
            v-html="getLabel(text)"
            :class="`wiux-actionsheet-menu-${getType(text) || 'default'}`"
          ></div>
        </div>
        <div
          class="weui-actionsheet__action"
          @click="emitEvent('on-click-menu', 'Cancel')"
          v-if="showCancel"
        >
          <div class="weui-actionsheet__cell">
            {{ cancelText || t("Cancel") }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  type PropType,
} from "vue";
import { useLocale } from "../../composables/useLocale";

interface MenuItem {
  label?: string;
  value?: string | number;
  type?: "primary" | "warn" | "default" | "disabled" | "info";
  [key: string]: unknown;
}

type MenuRecord = Record<string, string | MenuItem>;

export default defineComponent({
  name: "Actionsheet",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    showCancel: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: "",
    },
    theme: {
      type: String as PropType<"ios" | "android">,
      default: "ios",
    },
    menus: {
      type: [Object, Array] as PropType<MenuRecord | MenuItem[]>,
      default: () => ({}),
    },
    closeOnClickingMask: {
      type: Boolean,
      default: true,
    },
    closeOnClickingMenu: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    "update:modelValue",
    "on-click-menu",
    "on-click-mask",
    "on-after-show",
    "on-after-hide",
  ],
  setup(props, { emit, slots }) {
    const { t } = useLocale();

    const show = ref(props.modelValue);
    const hasHeaderSlot = ref(false);

    const menuList = computed<Record<string, string | MenuItem>>(() => {
      if (Array.isArray(props.menus)) {
        const result: Record<string, string | MenuItem> = {};
        props.menus.forEach((item, index) => {
          result[String(index)] = item;
        });
        return result;
      }
      return props.menus as MenuRecord;
    });

    const getLabel = (item: string | MenuItem): string => {
      if (typeof item === "string") {
        return t(item, item);
      }
      return t(item.label || "", item.label || "");
    };

    const getType = (item: string | MenuItem): string | undefined => {
      if (typeof item === "string") {
        return undefined;
      }
      return item.type;
    };

    const onMenuClick = (text: string | MenuItem, key: string) => {
      if (typeof text === "string") {
        emitEvent("on-click-menu", key, text);
      } else {
        if (text.type !== "disabled" && text.type !== "info") {
          if (text.value || text.value === 0) {
            emitEvent("on-click-menu", text.value, text);
          } else {
            emitEvent("on-click-menu", "", text);
            show.value = false;
          }
        }
      }
    };

    const onClickingMask = () => {
      emit("on-click-mask");
      if (props.closeOnClickingMask) {
        show.value = false;
      }
    };

    const emitEvent = (
      event: string,
      menu?: string | number,
      item?: string | MenuItem,
    ) => {
      if (
        event === "on-click-menu" &&
        menu !== undefined &&
        !String(menu).includes(".noop")
      ) {
        let _item = item;
        if (typeof _item === "object" && _item !== null) {
          _item = JSON.parse(JSON.stringify(_item));
        }
        emit("on-click-menu", menu, _item);
        if (props.closeOnClickingMenu) {
          show.value = false;
        }
      }
      if (event === "on-after-show" || event === "on-after-hide") {
        emit(event);
      }
    };

    const fixIos = (zIndex: number) => {
      if (typeof document === "undefined") return;
      const tabbar = document.querySelector(".weui-tabbar") as HTMLElement;
      if (tabbar && /iphone/i.test(navigator.userAgent)) {
        tabbar.style.zIndex = String(zIndex);
      }
    };

    watch(show, (val) => {
      emit("update:modelValue", val);
      if (val) {
        fixIos(-1);
      } else {
        setTimeout(() => {
          fixIos(100);
        }, 200);
      }
    });

    watch(
      () => props.modelValue,
      (val) => {
        show.value = val;
      },
    );

    onMounted(() => {
      hasHeaderSlot.value = !!slots.header;
    });

    onBeforeUnmount(() => {
      fixIos(100);
    });

    return {
      show,
      hasHeaderSlot,
      menuList,
      t,
      getLabel,
      getType,
      onMenuClick,
      onClickingMask,
      emitEvent,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-actionsheet-menu-primary {
  color: @actionsheet-label-primary-color;
}
.wiux-actionsheet-menu-warn {
  color: @actionsheet-label-warn-color;
}
.wiux-actionsheet-menu-default {
  color: @actionsheet-label-default-color;
}
.wiux-actionsheet-menu-disabled {
  color: @actionsheet-label-disabled-color;
}

.wiux-actionsheet-mask-enter,
.wiux-actionsheet-mask-leave-active,
.wiux-android-actionsheet-enter,
.wiux-android-actionsheet-leave-active {
  opacity: 0;
}
.wiux-actionsheet-mask-leave-active,
.wiux-actionsheet-mask-enter-active,
.wiux-android-actionsheet-leave-active,
.wiux-android-actionsheet-enter-active {
  transition: opacity 300ms !important;
}

.wiux-ios-actionsheet-enter-active,
.wiux-ios-actionsheet-leave-active {
  transition: transform 0.3s;
}
.wiux-ios-actionsheet-enter-from,
.wiux-ios-actionsheet-leave-to {
  transform: translate(0, 100%) !important;
}
.wiux-ios-actionsheet-enter-to,
.wiux-ios-actionsheet-leave-from {
  transform: translate(0, 0) !important;
}
</style>
