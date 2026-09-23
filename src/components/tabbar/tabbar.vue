<template>
  <div class="weui-tabbar">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick, provide } from "vue";

export default defineComponent({
  name: "tabbar",
  props: {
    modelValue: Number,
    iconClass: String,
  },
  emits: ["update:modelValue", "change", "on-beforeChange"],
  setup(props, { emit }) {
    const currentIndex = ref(props.modelValue != null ? props.modelValue : -1);
    const itemsCount = ref(0);
    const preventDefault = ref(false);

    function updateIndex() {
      itemsCount.value = 0;
      nextTick(() => {
        const el = document.querySelector(".weui-tabbar");
        if (el) {
          itemsCount.value = el.children.length;
        }
      });
    }

    provide("tabbarParent", {
      currentIndex,
      preventDefault,
      iconClass: props.iconClass,
      updateIndex,
      onItemClick: (index: number) => {
        if (preventDefault.value) {
          emit("on-beforeChange", index);
          return;
        }
        const oldVal = currentIndex.value;
        currentIndex.value = index;
        emit("update:modelValue", index);
        emit("change", index, oldVal);
      },
    });

    onMounted(() => {
      if (props.modelValue != null && props.modelValue >= 0) {
        currentIndex.value = props.modelValue;
      }
      updateIndex();
    });

    watch(
      () => props.modelValue,
      (val) => {
        if (val != null && val !== currentIndex.value) {
          currentIndex.value = val;
        }
      },
    );

    return {
      currentIndex,
      itemsCount,
    };
  },
});
</script>

<style lang="less">
.weui-tabbar__icon {
  position: relative;
}
.weui-tabbar__icon > sup {
  position: absolute;
  top: -8px;
  left: 100%;
  transform: translateX(-50%);
  z-index: 101;
}
.weui-tabbar__item.wiux-tabbar-simple {
  padding: 0;
  height: 50px;
  line-height: 50px;
}
.wiux-tabbar-simple .weui-tabbar__label {
  font-size: 14px;
  line-height: 50px;
}
</style>
