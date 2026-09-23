<template>
  <div ref="sliderRef" class="wiux-slider">
    <div class="wiux-swiper" :style="{ height: xheight }">
      <slot></slot>

      <div
        class="wiux-swiper-item"
        v-for="(item, index) in list"
        :key="'list-' + index"
        :data-index="index"
        @click="clickListItem(item)"
      >
        <a href="javascript:">
          <div
            class="wiux-img"
            :style="{ backgroundImage: buildBackgroundUrl(item) }"
          ></div>
          <p class="wiux-swiper-desc" v-if="showDescMask">{{ item.title }}</p>
        </a>
      </div>

      <div
        v-if="listTwoLoopItem.length > 0"
        class="wiux-swiper-item wiux-swiper-item-clone"
        v-for="(item, index) in listTwoLoopItem"
        :key="'clone-' + index"
        :data-index="index"
        @click="clickListItem(item)"
      >
        <a href="javascript:">
          <div
            class="wiux-img"
            :style="{ backgroundImage: buildBackgroundUrl(item) }"
          ></div>
          <p class="wiux-swiper-desc" v-if="showDescMask">{{ item.title }}</p>
        </a>
      </div>
    </div>
    <div
      :class="[dotsClass, 'wiux-indicator', `wiux-indicator-${dotsPosition}`]"
      v-show="showDots"
    >
      <a href="javascript:" v-for="key in swiperLength" :key="key">
        <i
          class="wiux-icon-dot"
          :class="{ active: key - 1 === currentIndex }"
        ></i>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  provide,
} from "vue";
import Swiper from "./swiper";
import { go } from "../../libs/router";

interface ListItem {
  url?: string;
  img?: string;
  fallbackImg?: string;
  title?: string;
}

export default defineComponent({
  name: "Swiper",
  props: {
    list: {
      type: Array as () => ListItem[],
      default: () => [],
    },
    direction: {
      type: String,
      default: "horizontal",
    },
    showDots: {
      type: Boolean,
      default: true,
    },
    showDescMask: {
      type: Boolean,
      default: true,
    },
    dotsPosition: {
      type: String,
      default: "right",
    },
    dotsClass: String,
    auto: Boolean,
    loop: Boolean,
    interval: {
      type: Number,
      default: 3000,
    },
    threshold: {
      type: Number,
      default: 50,
    },
    duration: {
      type: Number,
      default: 300,
    },
    height: {
      type: String,
      default: "auto",
    },
    aspectRatio: Number,
    minMovingDistance: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:modelValue", "change", "on-get-height", "on-click-list-item"],
  setup(props, { emit }) {
    const sliderRef = ref<HTMLElement | null>(null);
    const currentIndex = ref(props.modelValue || 0);
    const xheight = ref("auto");
    const swiperLength = ref(props.list.length);
    const hasRender = ref(false);
    const listTwoLoopItem = ref<ListItem[]>([]);
    let swiperInstance: Swiper | null = null;

    function hasTwoLoopItem() {
      if (props.list.length === 2 && props.loop) {
        listTwoLoopItem.value = [...props.list];
      } else {
        listTwoLoopItem.value = [];
      }
    }

    function clickListItem(item: ListItem) {
      go(item.url, (window as any).__vueRouter);
      emit("on-click-list-item", JSON.parse(JSON.stringify(item)));
    }

    function buildBackgroundUrl(item: ListItem): string {
      return item.fallbackImg
        ? `url(${item.img}), url(${item.fallbackImg})`
        : `url(${item.img})`;
    }

    function render(index: number = 0) {
      if (!sliderRef.value) return;
      if (swiperInstance) {
        swiperInstance.destroy();
      }
      swiperInstance = new Swiper({
        container: sliderRef.value,
        direction: props.direction,
        auto: props.auto,
        loop: props.loop,
        interval: props.interval,
        threshold: props.threshold,
        duration: props.duration,
        height: props.height,
        minMovingDistance: props.minMovingDistance,
      });
      swiperInstance.on("swiped", (prev: number, idx: number) => {
        currentIndex.value = idx % swiperLength.value;
      });
      if (index > 0) {
        swiperInstance.go(index);
      }
    }

    function rerender() {
      if (hasRender.value) {
        return;
      }
      hasRender.value = true;
      hasTwoLoopItem();
      nextTick(() => {
        const idx = props.modelValue || 0;
        currentIndex.value = idx;
        const childrenCount = sliderRef.value
          ? sliderRef.value.querySelectorAll(
              ".wiux-swiper .wiux-swiper-item:not(.wiux-swiper-item-clone)",
            ).length
          : 0;
        swiperLength.value = props.list.length || childrenCount;
        destroy();
        render(props.modelValue);
      });
    }

    provide("swiperRerender", rerender);

    function destroy() {
      hasRender.value = false;
      if (swiperInstance) {
        swiperInstance.destroy();
        swiperInstance = null;
      }
    }

    function getHeight(): string {
      const hasHeight = parseInt(props.height, 10);
      if (hasHeight) return props.height;
      if (!hasHeight) {
        if (props.aspectRatio) {
          if (sliderRef.value) {
            return sliderRef.value.offsetWidth * props.aspectRatio + "px";
          }
        }
        return "180px";
      }
      return "180px";
    }

    onMounted(() => {
      hasTwoLoopItem();
      nextTick(() => {
        if (props.list && props.list.length > 0) {
          render(props.modelValue);
        }
        xheight.value = getHeight();
        emit("on-get-height", xheight.value);
      });
    });

    onBeforeUnmount(() => {
      destroy();
    });

    watch(
      () => props.auto,
      (val) => {
        if (!val) {
          swiperInstance && swiperInstance.stop();
        } else {
          swiperInstance && swiperInstance._auto();
        }
      },
    );

    watch(
      () => props.list,
      (val, oldVal) => {
        if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
          rerender();
        }
      },
    );

    watch(currentIndex, (newIndex) => {
      emit("change", newIndex);
      emit("update:modelValue", newIndex);
    });

    watch(
      () => props.modelValue,
      (val) => {
        if (val !== currentIndex.value) {
          currentIndex.value = val;
          nextTick(() => {
            swiperInstance && swiperInstance.go(val);
          });
        }
      },
    );

    return {
      sliderRef,
      currentIndex,
      xheight,
      swiperLength,
      listTwoLoopItem,
      clickListItem,
      buildBackgroundUrl,
      rerender,
    };
  },
});
</script>

<style lang="less">
@import "../../styles/variable.less";

@pre: wiux;

.@{pre}-slider {
  overflow: hidden;
  position: relative;

  > .@{pre}-indicator,
  .@{pre}-indicator-right {
    position: absolute;
    right: 15px;
    bottom: 10px;

    > a {
      float: left;
      margin-left: 6px;

      > .@{pre}-icon-dot {
        display: inline-block;
        vertical-align: middle;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: #d0cdd1;
      }
      > .@{pre}-icon-dot.active {
        background-color: @swiper-indicator-active-color;
      }
    }
  }

  > .@{pre}-indicator-center {
    right: 50%;
    transform: translateX(50%);
  }

  > .@{pre}-indicator-left {
    left: 15px;
    right: auto;
  }

  > .@{pre}-swiper {
    overflow: hidden;
    position: relative;
    user-select: none;
    -webkit-user-drag: none;

    > .@{pre}-swiper-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      user-select: none;
      -webkit-user-drag: none;

      > a {
        display: block;
        width: 100%;
        height: 100%;
        -webkit-user-drag: none;

        > .@{pre}-img {
          display: block;
          width: 100%;
          height: 100%;
          background: center center no-repeat;
          background-size: cover;
          -webkit-user-drag: none;
        }

        > .@{pre}-swiper-desc {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1.4em;
          font-size: 16px;
          padding: 20px 50px 12px 13px;
          margin: 0;
          background-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0,
            rgba(0, 0, 0, 0.7) 100%
          );
          color: #fff;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: normal;
        }
      }
    }
  }
}
</style>
