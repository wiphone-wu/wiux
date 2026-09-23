<template>
  <div class="weui-msg">
    <div class="weui-msg__icon-area">
      <i class="weui-icon_msg" :class="`weui-icon-${icon || 'success'}`"></i>
    </div>
    <div class="weui-msg__text-area">
      <h2 class="weui-msg__title" v-html="title"></h2>
      <p class="weui-msg__desc">
        <slot name="description"></slot>
      </p>
      <p class="weui-msg__desc" v-if="description" v-html="description"></p>
    </div>
    <div class="weui-msg__opr-area">
      <p class="weui-btn-area">
        <slot name="buttons">
          <a
            v-for="(button, index) in buttons"
            :key="index"
            href="javascript:;"
            class="weui-btn"
            :class="`weui-btn_${button.type}`"
            @click="onClick(button.onClick, button.link)"
            >{{ button.text }}</a
          >
        </slot>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, PropType } from "vue";
import { go } from "../../libs/router";

export default defineComponent({
  name: "Msg",
  props: {
    icon: String,
    title: String,
    description: String,
    buttons: {
      type: Array as PropType<
        { text: string; type?: string; onClick?: Function; link?: string }[]
      >,
      default: () => [],
    },
  },
  setup(props) {
    const instance = getCurrentInstance();
    const router = (instance?.proxy as any)?.$router;

    const onClick = (
      handler: Function | undefined,
      link: string | undefined,
    ) => {
      typeof handler === "function" && handler();
      link && go(link, router);
    };

    return {
      onClick,
    };
  },
});
</script>
