<template>
  <div>
    <div
      class="weui-cells__title"
      v-if="title"
      :style="
        cleanStyle({
          color: titleColor,
        })
      "
      v-html="title"
    ></div>
    <slot name="title"></slot>
    <div
      class="weui-cells"
      :class="{
        'wiux-no-group-title': !title,
      }"
      :style="
        cleanStyle({
          marginTop: typeof gutter === 'number' ? gutter + 'px' : gutter,
        })
      "
    >
      <slot name="after-title"></slot>
      <slot></slot>
    </div>
    <div
      class="weui-cells__title wiux-group-footer-title"
      v-if="footerTitle"
      :style="
        cleanStyle({
          color: footerTitleColor,
        })
      "
      v-html="footerTitle"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from "vue";
import cleanStyle from "../../libs/clean-style";

export default defineComponent({
  name: "Group",
  props: {
    title: {
      type: String,
      default: "",
    },
    titleColor: {
      type: String,
      default: "",
    },
    labelWidth: {
      type: String,
      default: "",
    },
    labelAlign: {
      type: String,
      default: "",
    },
    labelMarginRight: {
      type: String,
      default: "",
    },
    gutter: {
      type: [String, Number],
      default: "",
    },
    footerTitle: {
      type: String,
      default: "",
    },
    footerTitleColor: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    provide(
      "parentLabelWidth",
      computed(() => props.labelWidth),
    );
    provide(
      "parentLabelAlign",
      computed(() => props.labelAlign),
    );
    provide(
      "parentLabelMarginRight",
      computed(() => props.labelMarginRight),
    );

    return {
      cleanStyle,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";
@import "../../styles/weui/widget/weui_cell/weui_cell_global.less";
@import "../../styles/blank.less";

.wiux-no-group-title {
  margin-top: @group-title-margin-top;
}

.wiux-group-footer-title.weui-cells__title {
  margin-top: @group-footer-title-margin-top;
  margin-bottom: @group-footer-title-margin-bottom;
  padding-top: 0;
  font-size: 12px;
}

.wiux-cell-value {
  color: @cell-value-color;
}
.wiux-cell-placeholder {
  color: @cell-placeholder-color;
}
</style>
