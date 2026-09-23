<template>
  <div class="wiux-marquee" :style="{ height: height + 'px' }">
    <ul
      class="wiux-marquee-box"
      ref="box"
      :style="{
        transform: `translate3d(0,${currenTranslateY}px,0)`,
        transition: `transform ${noAnimate ? 0 : duration}ms`,
      }"
    >
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from "vue";

export default defineComponent({
  name: "Marquee",
  props: {
    interval: {
      type: Number,
      default: 2000,
    },
    duration: {
      type: Number,
      default: 300,
    },
    direction: {
      type: String,
      default: "up",
    },
    itemHeight: Number,
  },
  setup(props) {
    const currenTranslateY = ref(0);
    const height = ref(0);
    const length = ref(0);
    const currentIndex = ref(0);
    const noAnimate = ref(false);
    const timer = ref<ReturnType<typeof setInterval> | null>(null);
    const cloneNode = ref<Node | null>(null);
    const box = ref<HTMLElement | null>(null);

    function destroy() {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    }

    function init(): boolean {
      destroy();

      const boxEl = box.value;
      if (cloneNode.value && boxEl) {
        boxEl.removeChild(cloneNode.value);
      }
      cloneNode.value = null;

      if (!boxEl) {
        return false;
      }
      const firstItem = boxEl.firstElementChild;
      if (!firstItem) {
        return false;
      }

      length.value = boxEl.children.length;
      height.value = props.itemHeight || firstItem.clientHeight;

      if (props.direction === "up") {
        cloneNode.value = firstItem.cloneNode(true);
        boxEl.appendChild(cloneNode.value);
      } else {
        const lastItem = boxEl.lastElementChild;
        if (lastItem) {
          cloneNode.value = lastItem.cloneNode(true);
          boxEl.insertBefore(cloneNode.value, firstItem);
        }
      }
      return true;
    }

    function go(toFirst: boolean) {
      noAnimate.value = true;
      if (toFirst) {
        currentIndex.value = 0;
        currenTranslateY.value = 0;
      } else {
        currentIndex.value = length.value - 1;
        currenTranslateY.value = -(currentIndex.value + 1) * height.value;
      }
    }

    function start() {
      if (props.direction === "down") go(false);
      timer.value = setInterval(() => {
        if (props.direction === "up") {
          currentIndex.value += 1;
          currenTranslateY.value = -currentIndex.value * height.value;
        } else {
          currentIndex.value -= 1;
          currenTranslateY.value = -(currentIndex.value + 1) * height.value;
        }
        if (currentIndex.value === length.value) {
          setTimeout(() => {
            go(true);
          }, props.duration);
        } else if (currentIndex.value === -1) {
          setTimeout(() => {
            go(false);
          }, props.duration);
        } else {
          noAnimate.value = false;
        }
      }, props.interval + props.duration);
    }

    onBeforeUnmount(() => {
      destroy();
    });

    return {
      currenTranslateY,
      height,
      length,
      currentIndex,
      noAnimate,
      timer,
      cloneNode,
      box,
      destroy,
      init,
      start,
      go,
    };
  },
});
</script>

<style lang="less">
.wiux-marquee {
  width: 100%;
  overflow: hidden;
}
.wiux-marquee-box {
  padding: 0;
  margin: 0;
  width: 100%;
  height: auto;

  li {
    margin: 0;
    width: 100%;
  }
}
</style>
