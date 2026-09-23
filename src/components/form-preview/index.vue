<template>
  <div class="wiux-form-preview weui-form-preview">
    <div class="weui-form-preview__hd">
      <label class="weui-form-preview__label" v-html="headerLabel"></label>
      <em
        class="weui-form-preview__value"
        v-html="headerValue || '&nbsp;'"
      ></em>
    </div>
    <div class="weui-form-preview__bd">
      <div
        class="weui-form-preview__item"
        v-for="item in bodyItems"
        :key="item.label"
      >
        <label class="weui-form-preview__label">{{ item.label }}</label>
        <span class="weui-form-preview__value">{{ item.value }}</span>
      </div>
    </div>
    <div class="weui-form-preview__ft">
      <a
        class="weui-form-preview__btn"
        :class="{
          'weui-form-preview__btn_default': button.style === 'default',
          'weui-form-preview__btn_primary': button.style === 'primary',
        }"
        href="javascript:"
        v-for="(button, index) in footerButtons"
        :key="index"
        @click="onButtonClick(button.onButtonClick, button.link)"
        >{{ button.text }}</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, PropType } from "vue";
import { go } from "../../libs/router";

export default defineComponent({
  name: "FormPreview",
  props: {
    headerLabel: String,
    headerValue: String,
    bodyItems: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => [],
    },
    footerButtons: {
      type: Array as PropType<
        {
          text: string;
          style?: string;
          onButtonClick?: Function;
          link?: string;
        }[]
      >,
      default: () => [],
    },
    name: String,
  },
  setup(props) {
    const instance = getCurrentInstance();

    function onButtonClick(cb: Function | undefined, link: string | undefined) {
      cb && cb(props.name);
      if (link) {
        go(link, (instance?.proxy as any)?.$router);
      }
    }

    return {
      onButtonClick,
    };
  },
});
</script>

<style lang="less">
.wiux-form-preview {
  overflow: hidden;
}
</style>
