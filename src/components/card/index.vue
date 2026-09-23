<template>
  <div class="weui-panel weui-panel_access">
    <div
      class="weui-panel__hd"
      v-if="header && header.title"
      v-html="header.title"
      @click="$emit('on-click-header')"
    ></div>
    <slot name="header"></slot>
    <div class="weui-panel__bd">
      <div class="wiux-card-content"><slot name="content"></slot></div>
    </div>
    <div class="weui-panel__ft">
      <a
        class="weui-cell weui-cell_access weui-cell_link"
        href="javascript:"
        v-if="footer && footer.title"
        @click="onClickFooter"
      >
        <div class="weui-cell__bd" v-html="footer.title"></div>
      </a>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, getCurrentInstance } from "vue";
import { go } from "../../libs/router";

interface CardHeader {
  title: string;
}

interface CardFooter {
  title: string;
  link?: string;
}

export default defineComponent({
  name: "Card",
  props: {
    header: {
      type: Object as PropType<CardHeader>,
    },
    footer: {
      type: Object as PropType<CardFooter>,
    },
  },
  emits: ["on-click-header", "on-click-footer"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();

    function onClickFooter() {
      if (props.footer && props.footer.link) {
        go(props.footer.link, (instance?.proxy as any)?.$router);
      }
      emit("on-click-footer");
    }

    return {
      onClickFooter,
    };
  },
});
</script>

<style lang="less"></style>
