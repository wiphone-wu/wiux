<template>
  <a
    href="javascript:;"
    class="weui-tabbar__item"
    :class="{
      'weui-bar__item_on': isActive,
      'wiux-tabbar-simple': simple,
    }"
    @click="onItemClick"
  >
    <div
      class="weui-tabbar__icon"
      :class="[iconClass || parentIconClass, { 'wiux-redDot': showDot }]"
      v-if="!simple"
    >
      <slot name="icon" v-if="!simple && !(hasActiveIcon && isActive)"></slot>
      <slot
        name="icon-active"
        v-if="!simple && hasActiveIcon && isActive"
      ></slot>
      <sup v-if="badge"><badge :text="badge"></badge></sup>
    </div>
    <p class="weui-tabbar__label">
      <slot name="label"></slot>
    </p>
  </a>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  computed,
  onMounted,
  nextTick,
  getCurrentInstance,
} from "vue";
import Badge from "../badge/index.vue";
import { go } from "../../libs/router.js";

interface tabbarParent {
  currentIndex: { value: number };
  preventDefault: { value: boolean };
  iconClass: string;
  updateIndex: () => void;
  onItemClick: (index: number) => void;
}

export default defineComponent({
  name: "tabbarItem",
  components: {
    Badge,
  },
  props: {
    showDot: {
      type: Boolean,
      default: false,
    },
    badge: String,
    link: [String, Object],
    iconClass: String,
    selected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["on-item-click"],
  setup(props, { emit, slots }) {
    const parent = inject<tabbarParent>("tabbarParent", {
      currentIndex: { value: -1 },
      preventDefault: { value: false },
      iconClass: "",
      updateIndex: () => {},
      onItemClick: () => {},
    });

    const currentIndex = ref(-1);
    const isSelected = ref(props.selected);
    const simple = ref(false);
    const hasActiveIcon = ref(false);

    const parentIconClass = computed(() => parent.iconClass);

    const isActive = computed(() => {
      return parent.currentIndex.value === currentIndex.value;
    });

    onMounted(() => {
      if (!slots.icon) {
        simple.value = true;
      }
      if (slots["icon-active"]) {
        hasActiveIcon.value = true;
      }
      parent.updateIndex();

      const instance = getCurrentInstance();
      nextTick(() => {
        const el = instance?.vnode.el as HTMLElement;
        if (el && el.parentElement) {
          const children = el.parentElement.children;
          for (let i = 0; i < children.length; i++) {
            if (children[i] === el) {
              currentIndex.value = i;
              break;
            }
          }
        }
        if (isSelected.value) {
          parent.currentIndex.value = currentIndex.value;
        }
      });
    });

    function onItemClick() {
      if (props.disabled) return;
      parent.onItemClick(currentIndex.value);
      emit("on-item-click", currentIndex.value);
      go(props.link as string);
    }

    return {
      currentIndex,
      isActive,
      simple,
      hasActiveIcon,
      parentIconClass,
      onItemClick,
    };
  },
});
</script>
