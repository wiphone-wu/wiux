<template>
  <div
    class="weui-cell"
    :class="{
      'wiux-tap-active': isLink || !!link,
      'weui-cell_access': isLink || !!link,
      'wiux-cell-no-border-intent': !borderIntent,
      'wiux-cell-disabled': disabled,
    }"
    :style="style"
    @click="onClick"
  >
    <div class="weui-cell__hd">
      <slot name="icon"></slot>
    </div>
    <div
      class="wiux-cell-bd"
      :class="{
        'wiux-cell-primary': primary === 'title' && valueAlign !== 'left',
      }"
    >
      <p>
        <label
          class="wiux-label"
          :style="labelStyles"
          :class="labelClass"
          v-if="title || hasTitleSlot"
        >
          <slot name="title">{{ title }}</slot>
        </label>
        <slot name="after-title"></slot>
      </p>
      <InlineDesc>
        <slot name="inline-desc">{{ inlineDesc }}</slot>
      </InlineDesc>
    </div>
    <div class="weui-cell__ft" :class="valueClass">
      <slot name="value"></slot>
      <slot>{{ value }}</slot>
      <i class="weui-loading" v-if="isLoading"></i>
    </div>
    <slot name="child"></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  inject,
  getCurrentInstance,
} from "vue";
import InlineDesc from "../inline-desc/index.vue";
import { go } from "../../libs/router";
import cleanStyle from "../../libs/clean-style";
import getParentProp from "../../libs/get-parent-prop";

export default defineComponent({
  name: "Cell",
  components: {
    InlineDesc,
  },
  props: {
    title: {
      type: [String, Number],
      default: "",
    },
    value: {
      type: [String, Number, Array],
      default: "",
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    inlineDesc: {
      type: [String, Number],
      default: "",
    },
    primary: {
      type: String,
      default: "title",
    },
    link: {
      type: [String, Object],
      default: "",
    },
    valueAlign: {
      type: [String, Boolean, Number],
      default: "",
    },
    borderIntent: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    arrowDirection: {
      type: String,
      default: "",
    },
    alignItems: {
      type: String,
      default: "",
    },
  },
  emits: ["click"],
  setup(props, { emit, slots }) {
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
    const hasTitleSlot = ref(!!slots.title);

    const labelStyles = computed(() => {
      return cleanStyle({
        width:
          parentLabelWidth.value ||
          getParentProp(instance?.proxy, "labelWidth"),
        textAlign:
          parentLabelAlign.value ||
          getParentProp(instance?.proxy, "labelAlign"),
        marginRight:
          parentLabelMarginRight.value ||
          getParentProp(instance?.proxy, "labelMarginRight"),
      }) as Record<string, string | number>;
    });

    const valueClass = computed(() => {
      return {
        "wiux-cell-primary":
          props.primary === "content" || props.valueAlign === "left",
        "wiux-cell-align-left": props.valueAlign === "left",
        "wiux-cell-arrow-transition": !!props.arrowDirection,
        "wiux-cell-arrow-up": props.arrowDirection === "up",
        "wiux-cell-arrow-down": props.arrowDirection === "down",
      };
    });

    const labelClass = computed(() => {
      const parent = instance?.proxy?.$parent;
      const align = !!(
        parentLabelAlign.value ||
        (parent &&
          ((parent as any).labelAlign === "justify" ||
            (parent as any).$parent?.labelAlign === "justify"))
      );
      return {
        "wiux-cell-justify": align,
      } as Record<string, boolean>;
    });

    const style = computed(() => {
      if (props.alignItems) {
        return {
          alignItems: props.alignItems,
        };
      }
      return {};
    });

    const onClick = () => {
      if (!props.disabled) {
        emit("click");
        go(
          props.link as string | Record<string, unknown>,
          (instance?.proxy as any)?.$router,
        );
      }
    };

    return {
      hasTitleSlot,
      labelStyles,
      valueClass,
      labelClass,
      style,
      onClick,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
@import "../../styles/weui/base/mixin/setArrow.less";

.wiux-cell-primary {
  flex: 1;
}
.wiux-label {
  display: inline-block;
  word-wrap: break-word;
  word-break: break-all;
}
.weui-cell__ft .weui-loading {
  display: inline-block;
}
.weui-cell__ft.wiux-cell-align-left {
  text-align: left;
}
.weui-cell.wiux-cell-no-border-intent:before {
  left: 0;
}
.weui-cell_access .weui-cell__ft.wiux-cell-arrow-down:after {
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
}
.weui-cell_access .weui-cell__ft.wiux-cell-arrow-up:after {
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
}
.wiux-cell-arrow-transition:after {
  transition: transform 300ms;
}
.wiux-cell-disabled {
  .wiux-label {
    color: #b2b2b2;
  }
  &.weui-cell_access .weui-cell__ft:after {
    border-color: @cell-disabled-arrow-color;
  }
}
</style>
