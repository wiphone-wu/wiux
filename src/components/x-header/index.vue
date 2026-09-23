<template>
  <div class="wiux-header">
    <div class="wiux-header-left">
      <slot name="overwrite-left">
        <transition :name="transition">
          <a
            class="wiux-header-back"
            @click.prevent
            v-show="leftOptions.showBack"
            @click="onClickBack"
            >{{
              typeof leftOptions.backText === "undefined"
                ? backText
                : leftOptions.backText
            }}</a
          >
        </transition>
        <transition :name="transition">
          <div
            class="left-arrow"
            @click="onClickBack"
            v-show="leftOptions.showBack"
          ></div>
        </transition>
      </slot>
      <slot name="left"></slot>
    </div>
    <h1
      class="wiux-header-title"
      @click="$emit('on-click-title')"
      v-if="!shouldOverWriteTitle"
    >
      <slot>
        <transition :name="transition">
          <span v-show="title">{{ title }}</span>
        </transition>
      </slot>
    </h1>
    <div class="wiux-header-title-area" v-if="shouldOverWriteTitle">
      <slot name="overwrite-title"></slot>
    </div>
    <div class="wiux-header-right">
      <a
        class="wiux-header-more"
        @click.prevent
        @click="$emit('on-click-more')"
        v-if="rightOptions.showMore"
      ></a>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onBeforeMount,
  getCurrentInstance,
} from "vue";

export default defineComponent({
  name: "XHeader",
  props: {
    leftOptions: Object,
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default: () => ({
        showMore: false,
      }),
    },
  },
  emits: ["on-click-more", "on-click-back", "on-click-title"],
  setup(props, { emit, slots }) {
    const instance = getCurrentInstance();
    const shouldOverWriteTitle = ref(false);

    const backText = "返回";

    const leftOptions = computed(() => {
      return Object.assign(
        {
          showBack: true,
          preventGoBack: false,
        },
        props.leftOptions || {},
      );
    });

    const onClickBack = () => {
      if (leftOptions.value.preventGoBack) {
        emit("on-click-back");
      } else {
        const router = (instance?.proxy as any)?.$router;
        if (router) {
          router.back();
        } else {
          window.history.back();
        }
      }
    };

    onBeforeMount(() => {
      if (slots && slots["overwrite-title"]) {
        shouldOverWriteTitle.value = true;
      }
    });

    return {
      shouldOverWriteTitle,
      backText,
      leftOptions,
      onClickBack,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

.wiux-header {
  position: relative;
  padding: 3px 0;
  box-sizing: border-box;
  background-color: @header-background-color;
}
.wiux-header .wiux-header-title {
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  color: @header-title-color;
}
.wiux-header-title-area,
.wiux-header .wiux-header-title {
  margin: 0 88px;
  height: 40px;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wiux-header .wiux-header-title > span {
  display: inline-block;
}
.wiux-header .wiux-header-left,
.wiux-header .wiux-header-right {
  position: absolute;
  top: 14px;
  display: block;
  font-size: 14px;
  line-height: 21px;
  color: @header-text-color;
}
.wiux-header .wiux-header-left a,
.wiux-header .wiux-header-left button,
.wiux-header .wiux-header-right a,
.wiux-header .wiux-header-right button {
  float: left;
  margin-right: 8px;
  color: @header-text-color;
}
.wiux-header .wiux-header-left a:active,
.wiux-header .wiux-header-left button:active,
.wiux-header .wiux-header-right a:active,
.wiux-header .wiux-header-right button:active {
  opacity: 0.5;
}
.wiux-header .wiux-header-left {
  left: 18px;
}
.wiux-header .wiux-header-left .wiux-header-back {
  padding-left: 16px;
}
.wiux-header .wiux-header-left .left-arrow {
  position: absolute;
  width: 30px;
  height: 30px;
  top: -5px;
  left: -5px;

  &:before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid @header-arrow-color;
    border-width: 1px 0 0 1px;
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
  }
}
.wiux-header .wiux-header-right {
  right: 15px;
}
.wiux-header .wiux-header-right a,
.wiux-header .wiux-header-right button {
  margin-left: 8px;
  margin-right: 0;
}
.wiux-header .wiux-header-right .wiux-header-more:after {
  content: "\2022\2022\2022";
  padding-right: 7px;
  font-size: 20px;
  letter-spacing: -6px;
}
.wiux-header-fade-in-right-enter-active {
  animation: fadeInRight 0.5s;
}
.wiux-header-fade-in-left-enter-active {
  animation: fadeInLeft 0.5s;
}
@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translateX(150px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-150px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
