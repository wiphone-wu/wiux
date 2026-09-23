<template>
  <div
    ref="elRef"
    class="pswp wiux-previewer"
    tabindex="-1"
    role="dialog"
  >
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>
      <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
          <div class="pswp__counter"></div>
          <slot name="button-after"></slot>
          <button
            class="pswp__button pswp__button--close"
            title="Close (Esc)"
          ></button>
          <button
            class="pswp__button pswp__button--share"
            title="Share"
          ></button>
          <button
            class="pswp__button pswp__button--fs"
            title="Toggle fullscreen"
          ></button>
          <button
            class="pswp__button pswp__button--zoom"
            title="Zoom in/out"
          ></button>
          <slot name="button-before"></slot>
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"
        >
          <div class="pswp__share-tooltip"></div>
        </div>
        <button
          class="pswp__button pswp__button--arrow--left"
          title="Previous (arrow left)"
        ></button>
        <button
          class="pswp__button pswp__button--arrow--right"
          title="Next (arrow right)"
        ></button>
        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>
      </div>
    </div>
    <slot name="wrap-after"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import PhotoSwipe from "photoswipe/dist/photoswipe";
import UI from "photoswipe/dist/photoswipe-ui-default";

import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";

export interface PreviewerImage {
  msrc?: string;
  src: string;
  w?: number;
  h?: number;
  title?: string;
}

export default defineComponent({
  name: "Previewer",
  props: {
    list: {
      type: Array as () => PreviewerImage[],
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ["on-close", "change"],
  setup(props, { emit }) {
    const photoswipe = ref<any>(null);
    const elRef = ref<HTMLElement | null>(null);

    const imgs = computed(() => {
      return props.list.map((one) => {
        const result: PreviewerImage = { ...one };
        if (!result.msrc) {
          result.msrc = result.src;
        }
        if (typeof result.w === "undefined") {
          result.w = 0;
          result.h = 0;
        }
        return result;
      });
    });

    watch(imgs, (newVal, oldVal) => {
      if (!photoswipe.value) {
        return;
      }
      if (newVal.length && newVal.length - oldVal.length === -1) {
        const index = photoswipe.value.getCurrentIndex();
        photoswipe.value.invalidateCurrItems();
        photoswipe.value.items.splice(index, 1);
        let goToIndex = index;
        if (goToIndex > photoswipe.value.items.length - 1) {
          goToIndex = 0;
        }
        photoswipe.value.goTo(goToIndex);
        photoswipe.value.updateSize(true);
        photoswipe.value.ui.update();
      } else if (!newVal.length) {
        close();
      }
    });

    const doInit = (index: number) => {
      const self = photoswipe;
      const options = Object.assign(
        {
          history: false,
          shareEl: false,
          tapToClose: true,
          index: index,
        },
        props.options,
      );

      photoswipe.value = new PhotoSwipe(elRef.value, UI, imgs.value, options);

      photoswipe.value.listen("gettingData", (_index: number, item: any) => {
        if (!item.w || !item.h || item.w < 1 || item.h < 1) {
          const img = new Image();
          img.onload = function () {
            item.w = (this as HTMLImageElement).width;
            item.h = (this as HTMLImageElement).height;
            photoswipe.value.updateSize(true);
          };
          img.src = item.src;
        }
      });

      photoswipe.value.init();
      photoswipe.value.listen("close", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        emit("on-close");
        photoswipe.value = null;
      });
      photoswipe.value.listen("afterChange", () => {
        emit("change", {
          currentIndex: photoswipe.value.getCurrentIndex(),
        });
      });
    };

    const init = (index: number) => {
      const showItem = imgs.value[index];
      if (!showItem.w || !showItem.h || showItem.w < 5 || showItem.h < 5) {
        const img = new Image();
        img.onload = function () {
          showItem.w = (this as HTMLImageElement).width;
          showItem.h = (this as HTMLImageElement).height;
          doInit(index);
        };
        img.src = showItem.src;
      } else {
        doInit(index);
      }
    };

    const show = (index: number) => {
      init(index);
    };

    const getCurrentIndex = () => {
      if (photoswipe.value) {
        return photoswipe.value.getCurrentIndex();
      }
    };

    const close = () => {
      photoswipe.value && photoswipe.value.close();
    };

    const goTo = (index: number) => {
      photoswipe.value && photoswipe.value.goTo(index);
    };

    const prev = () => {
      photoswipe.value && photoswipe.value.prev();
    };

    const next = () => {
      photoswipe.value && photoswipe.value.next();
    };

    return {
      photoswipe,
      elRef,
      show,
      getCurrentIndex,
      close,
      goTo,
      prev,
      next,
    };
  },
});
</script>