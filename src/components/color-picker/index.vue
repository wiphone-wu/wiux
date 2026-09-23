<template>
  <div class="wiux-color-picker">
    <flexBox>
      <flexBox-item v-for="color in colors" :key="color" class="wiux-color-box">
        <span
          class="wiux-color-item"
          :style="{
            borderRadius: width / 2 + 'px',
            backgroundColor: color,
            width: width + 'px',
            height: width + 'px',
          }"
          :class="{
            'wiux-color-white': color === '#fff' || color === '#FFF',
            'wiux-color-picker-small': size === 'small',
            'wiux-color-picker-middle': size === 'middle',
          }"
          @click="change(color)"
        >
          <icon
            v-if="color === currentValue"
            class="wiux-color-checked"
            :style="{ lineHeight: width + 'px' }"
            type="success-no-circle"
          />
        </span>
      </flexBox-item>
    </flexBox>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import Icon from "../icon/index.vue";
import { FlexBox, FlexBoxItem } from "../flexBox/index";

const sizeMap: Record<string, number> = {
  large: 40,
  middle: 30,
  small: 20,
};

export default defineComponent({
  name: "ColorPicker",
  components: {
    Icon,
    FlexBox,
    FlexBoxItem,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    colors: {
      type: Array as () => string[],
      required: true,
    },
    size: {
      type: String,
      default: "large",
    },
  },
  emits: ["update:modelValue", "on-change"],
  setup(props, { emit }) {
    const currentValue = ref(props.modelValue);

    const width = computed(() => sizeMap[props.size] || 40);

    watch(
      () => props.modelValue,
      (val) => {
        currentValue.value = val;
      },
    );

    watch(currentValue, (color) => {
      emit("on-change", color);
      emit("update:modelValue", color);
    });

    const change = (color: string) => {
      currentValue.value = color;
    };

    return {
      currentValue,
      width,
      change,
    };
  },
});
</script>

<style lang="less">
.wiux-color-box {
  text-align: center;
}
.wiux-color-picker {
  font-size: 0;
}
.wiux-color-item {
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  position: relative;
}
.wiux-color-checked.weui-icon-success-no-circle:before {
  color: #fff;
}
.wiux-color-checked {
  width: 100%;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.wiux-color-white {
  border: 1px solid #ccc;
}
.wiux-color-white .wiux-color-checked:before {
  color: #ccc;
}
.wiux-color-picker-small .wiux-color-checked:before {
  font-size: 10px;
}
.wiux-color-picker-middle .wiux-color-checked:before {
  font-size: 18px;
}
</style>
