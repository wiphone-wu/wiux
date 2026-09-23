<template>
  <div class="wiux-checker-item" :class="classNames" @click="select">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, inject, watch } from "vue";

function isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export default defineComponent({
  name: "CheckerItem",
  props: {
    value: {
      type: [String, Number, Object],
      required: true,
    },
    disabled: Boolean,
  },
  emits: ["on-item-click"],
  setup(props, { emit }) {
    const parent: any = inject("checkerParent");

    watch(
      () => props.disabled,
      (val) => {
        if (
          val &&
          parent.type === "radio" &&
          parent.currentValue === props.value
        ) {
          parent.currentValue = "";
        }
      },
    );

    const classNames = computed(() => {
      const isSimpleValue =
        typeof props.value === "string" || typeof props.value === "number";
      const names: Record<string, boolean> = {
        "wiux-tap-active": !props.disabled,
      };

      if (parent.defaultItemClass) {
        names[parent.defaultItemClass] = true;
      }

      if (parent.selectedItemClass) {
        let selected = false;
        if (parent.type === "radio") {
          if (isSimpleValue && parent.currentValue === props.value) {
            selected = true;
          } else if (
            typeof props.value === "object" &&
            isEqual(parent.currentValue, props.value)
          ) {
            selected = true;
          }
        } else {
          if (typeof props.value === "string") {
            if (
              parent.currentValue &&
              parent.currentValue.indexOf(props.value) > -1
            ) {
              selected = true;
            }
          } else if (parent.currentValue && parent.currentValue.length) {
            const match = parent.currentValue.filter((one: any) => {
              return isEqual(one, props.value);
            });
            selected = match.length > 0;
          }
        }
        names[parent.selectedItemClass] = selected;
      }

      if (parent.disabledItemClass) {
        names[parent.disabledItemClass] = props.disabled;
      }

      return names;
    });

    const selectRadio = () => {
      if (!props.disabled) {
        if (parent.currentValue === props.value) {
          if (!parent.radioRequired) {
            parent.currentValue = "";
          }
        } else {
          parent.currentValue = props.value;
        }
      }
      emit("on-item-click", props.value, props.disabled);
    };

    const selectCheckbox = () => {
      if (!parent.currentValue || parent.currentValue === null) {
        parent.currentValue = [];
      }
      const isSimpleValue =
        typeof props.value === "string" || typeof props.value === "number";
      if (!props.disabled) {
        let index = -1;
        if (isSimpleValue) {
          index = parent.currentValue.indexOf(props.value);
        } else {
          index = parent.currentValue
            .map((one: any) => JSON.stringify(one))
            .indexOf(JSON.stringify(props.value));
        }
        if (index > -1) {
          parent.currentValue.splice(index, 1);
        } else {
          if (
            !parent.max ||
            (parent.max &&
              parent.currentValue !== null &&
              parent.currentValue.length < parent.max)
          ) {
            if (!parent.currentValue || !parent.currentValue.length) {
              parent.currentValue = [];
            }
            parent.currentValue.push(props.value);
          }
        }
      }
      emit("on-item-click", props.value, props.disabled);
    };

    const select = () => {
      if (parent.type === "radio") {
        selectRadio();
      } else {
        selectCheckbox();
      }
    };

    return {
      classNames,
      select,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/tap.less";
</style>
