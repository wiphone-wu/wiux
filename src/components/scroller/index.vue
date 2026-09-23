<template>
  <div class="wiux-scroller" :style="containerStyle" ref="scrollerRef">
    <div class="wiux-scroller-content" ref="contentRef">
      <div class="wiux-scroller-pulldown" v-if="usePullDown" ref="pulldownRef">
        <slot name="pulldown">
          <div class="wiux-scroller-pulldown-default">
            {{ pulldownText }}
          </div>
        </slot>
      </div>
      <slot></slot>
      <div class="wiux-scroller-pullup" v-if="usePullUp" ref="pullupRef">
        <slot name="pullup">
          <div class="wiux-scroller-pullup-default">
            {{ pullupText }}
          </div>
        </slot>
      </div>
    </div>
    <div v-if="scrollbarY" class="wiux-scrollbar-y" ref="scrollbarYRef">
      <div class="wiux-scrollbar-y-indicate" ref="scrollbarYIndicateRef"></div>
    </div>
    <div v-if="scrollbarX" class="wiux-scrollbar-x" ref="scrollbarXRef">
      <div class="wiux-scrollbar-x-indicate" ref="scrollbarXIndicateRef"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  type Ref,
} from "vue";
import { Gesture, type GestureEvent } from "../../libs/gesture";

const SCROLL_ACCELERATION = 0.0005;
const BOUNDARY_ACCELERATION = 0.03;
const PAN_RATE = 1 - 0.618;
const BOUNDARY_BOUNCE_DURATION = 500;
const MAX_SPEED = 2;
const MAX_BOUNCE_DISTANCE = 80;
const MIN_BAR_SIZE = 50;
const MIN_BAR_SCROLLED_SIZE = 10;

const PULLDOWN_DEFAULT_CONFIG = {
  content: "Pull Down To Refresh",
  height: 60,
  autoRefresh: false,
  downContent: "Pull Down To Refresh",
  upContent: "Release To Refresh",
  loadingContent: "Loading...",
};

const PULLUP_DEFAULT_CONFIG = {
  content: "Pull Up To Refresh",
  pullUpHeight: 60,
  height: 40,
  autoRefresh: false,
  downContent: "Release To Refresh",
  upContent: "Pull Up To Refresh",
  loadingContent: "Loading...",
};

export default defineComponent({
  name: "Scroller",
  props: {
    height: {
      type: String,
      default: "",
    },
    lockX: {
      type: Boolean,
      default: false,
    },
    lockY: {
      type: Boolean,
      default: false,
    },
    scrollbarX: {
      type: Boolean,
      default: false,
    },
    scrollbarY: {
      type: Boolean,
      default: false,
    },
    bounce: {
      type: Boolean,
      default: true,
    },
    usePullDown: {
      type: Boolean,
      default: false,
    },
    usePullUp: {
      type: Boolean,
      default: false,
    },
    pullDownConfig: {
      type: Object,
      default: () => ({}),
    },
    pullUpConfig: {
      type: Object,
      default: () => ({}),
    },
    scrollBottomOffset: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    "on-scroll",
    "on-scroll-bottom",
    "on-pulldown-loading",
    "on-pullup-loading",
  ],
  setup(props, { emit, expose }) {
    const scrollerRef: Ref<HTMLElement | null> = ref(null);
    const contentRef: Ref<HTMLElement | null> = ref(null);
    const pulldownRef: Ref<HTMLElement | null> = ref(null);
    const pullupRef: Ref<HTMLElement | null> = ref(null);
    const scrollbarYRef: Ref<HTMLElement | null> = ref(null);
    const scrollbarYIndicateRef: Ref<HTMLElement | null> = ref(null);
    const scrollbarXRef: Ref<HTMLElement | null> = ref(null);
    const scrollbarXIndicateRef: Ref<HTMLElement | null> = ref(null);

    const pulldownText = ref("Pull Down To Refresh");
    const pullupText = ref("Pull Up To Refresh");
    const pulldownStatus = ref<"up" | "down" | "loading">("up");
    const pullupStatus = ref<"up" | "down" | "loading" | "disabled">("up");

    let gesture: Gesture | null = null;
    let scrollLeft = 0;
    let scrollTop = 0;
    let contentHeight = 0;
    let contentWidth = 0;
    let containerHeight = 0;
    let containerWidth = 0;
    let animFrameId: number | null = null;
    let pullupHeight = 0;
    let pulldownHeight = 0;
    let panStartScrollLeft = 0;
    let panStartScrollTop = 0;
    let isPanning = false;
    let scrollbarHideTimer: ReturnType<typeof setTimeout> | null = null;

    const pdConfig = computed(() => ({
      ...PULLDOWN_DEFAULT_CONFIG,
      ...props.pullDownConfig,
    }));
    const puConfig = computed(() => ({
      ...PULLUP_DEFAULT_CONFIG,
      ...props.pullUpConfig,
    }));

    const containerStyle = computed(() => {
      const style: Record<string, string> = {
        overflow: "hidden",
        position: "relative",
      };
      let h = props.height;

      if (!h && props.lockX) {
        h = `${document.documentElement.clientHeight}px`;
      }

      if (h && h.indexOf("-") === 0) {
        h = `${document.documentElement.clientHeight + parseInt(h)}px`;
      }

      if (h) {
        style.height = h;
      }

      return style;
    });

    function updateSize(): void {
      if (!scrollerRef.value || !contentRef.value) return;
      containerHeight = scrollerRef.value.clientHeight;
      containerWidth = scrollerRef.value.clientWidth;
      contentHeight = Math.max(
        contentRef.value.scrollHeight,
        contentRef.value.offsetHeight,
      );
      contentWidth = Math.max(
        contentRef.value.scrollWidth,
        contentRef.value.offsetWidth,
      );
      pullupHeight = puConfig.value.height;
      pulldownHeight = pdConfig.value.height;
    }

    function getMaxScrollY(): number {
      return Math.max(0, contentHeight - containerHeight);
    }

    function getMaxScrollX(): number {
      return Math.max(0, contentWidth - containerWidth);
    }

    function isOutY(): boolean {
      return scrollTop < -0.5 || scrollTop > getMaxScrollY() + 0.5;
    }

    function isOutX(): boolean {
      return scrollLeft < -0.5 || scrollLeft > getMaxScrollX() + 0.5;
    }

    function rubberBand(value: number, min: number, max: number): number {
      if (!props.bounce) {
        return Math.min(max, Math.max(min, value));
      }
      if (value < min) {
        return min + (value - min) * PAN_RATE;
      }
      if (value > max) {
        return max + (value - max) * PAN_RATE;
      }
      return value;
    }

    function applyTransform(x: number, y: number, showBar = true): void {
      if (props.lockX) x = 0;
      if (props.lockY) y = 0;

      scrollLeft = x;
      scrollTop = y;

      if (contentRef.value) {
        contentRef.value.style.transition = "none";
        contentRef.value.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
      }

      if (showBar) {
        updateScrollbar(true);
      }
    }

    function boundaryCheck(
      duration = BOUNDARY_BOUNCE_DURATION,
      callback?: () => void,
    ): void {
      const maxY = getMaxScrollY();
      const maxX = getMaxScrollX();
      const targetX = Math.min(maxX, Math.max(0, scrollLeft));
      const targetY = Math.min(maxY, Math.max(0, scrollTop));

      if (
        Math.abs(targetX - scrollLeft) > 0.5 ||
        Math.abs(targetY - scrollTop) > 0.5
      ) {
        animateTo(targetX, targetY, duration, "ease", () => {
          updateScrollbar(false);
          callback?.();
        });
      } else {
        applyTransform(targetX, targetY, false);
        updateScrollbar(false);
        callback?.();
      }
    }

    function computeScroll(
      pos: number,
      velocity: number,
      viewportSize: number,
      contentSize: number,
    ): {
      pos: number;
      duration: number;
      easing: string;
      status: string;
    } | null {
      if (Math.abs(velocity) < 0.02) return null;

      const maxScroll = Math.max(0, contentSize - viewportSize);
      if (pos < 0 || pos > maxScroll) return null;

      const v = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, velocity));
      const a = SCROLL_ACCELERATION * (v / Math.abs(v));
      const a2 = BOUNDARY_ACCELERATION;
      let t = v / a;
      let s = pos + (t * v) / 2;
      let status = "inside";

      if (isNaN(s) || isNaN(t)) return null;

      const boundaryStart = 0;
      const boundaryEnd = viewportSize;
      const innerSize = contentSize;

      if (s < -boundaryStart) {
        const _s = -boundaryStart - pos;
        const disc = -2 * a * _s + v * v;
        if (disc < 0 || _s <= 0) {
          return null;
        }
        const _t = (Math.sqrt(disc) + v) / a;
        const v0 = v - a * _t;
        const _t2 = Math.abs(v0 / a2);
        let s2 = (v0 / 2) * _t2;
        if (s2 < -MAX_BOUNCE_DISTANCE) s2 = -MAX_BOUNCE_DISTANCE;
        if (s2 > MAX_BOUNCE_DISTANCE) s2 = MAX_BOUNCE_DISTANCE;
        t = _t + _t2;
        s = props.bounce ? -boundaryStart + s2 : -boundaryStart;
        status = "outside";
      } else if (s > innerSize - boundaryEnd) {
        const _s = boundaryEnd - innerSize + pos;
        const disc = -2 * a * _s + v * v;
        if (disc < 0) {
          s = maxScroll;
          t = Math.abs(((maxScroll - pos) * 2) / (v || 1));
          status = "inside";
        } else {
          const _t = (Math.sqrt(disc) - v) / a;
          const v0 = v - a * _t;
          const _t2 = Math.abs(v0 / a2);
          let s2 = (v0 / 2) * _t2;
          if (s2 < -MAX_BOUNCE_DISTANCE) s2 = -MAX_BOUNCE_DISTANCE;
          if (s2 > MAX_BOUNCE_DISTANCE) s2 = MAX_BOUNCE_DISTANCE;
          t = _t + _t2;
          s = props.bounce
            ? innerSize - boundaryEnd + s2
            : innerSize - boundaryEnd;
          status = "outside";
        }
      }

      if (isNaN(s) || isNaN(t) || t <= 0) return null;

      return {
        pos: s,
        duration: Math.min(Math.abs(t), 2500),
        easing: Math.abs(v) > 1.2 ? "circular" : "quadratic",
        status,
      };
    }

    function animateTo(
      targetX: number,
      targetY: number,
      duration: number,
      easing: string,
      callback?: () => void,
    ): void {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }

      const startX = scrollLeft;
      const startY = scrollTop;
      const startTime = performance.now();
      const dur = Math.max(duration, 1);

      function easeFn(p: number, type: string): number {
        if (type === "circular") {
          return 1 - Math.sqrt(1 - p * p);
        }
        if (type === "quadratic") {
          return p * (2 - p);
        }
        if (type === "ease") {
          return p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        }
        return p;
      }

      function step(now: number): void {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / dur, 1);
        const eased = easeFn(progress, easing);

        applyTransform(
          startX + (targetX - startX) * eased,
          startY + (targetY - startY) * eased,
        );
        emitScroll();

        if (progress < 1) {
          animFrameId = requestAnimationFrame(step);
        } else {
          applyTransform(targetX, targetY);
          emitScroll();
          animFrameId = null;
          callback?.();
        }
      }

      animFrameId = requestAnimationFrame(step);
    }

    function emitScroll(): void {
      emit("on-scroll", { top: scrollTop, left: scrollLeft });

      const scrollerEl = scrollerRef.value;
      if (scrollerEl) {
        const h = scrollerEl.clientHeight;
        const sh = contentHeight;
        if (scrollTop + h >= sh - props.scrollBottomOffset) {
          emit("on-scroll-bottom");
        }
      }
    }

    function computeBar(
      pos: number,
      isY: boolean,
    ): { size: number; pos: number } {
      const spacing = 2;
      const viewport = isY ? containerHeight : containerWidth;
      const content = isY ? contentHeight : contentWidth;
      const indicateSize = Math.max(0, viewport - spacing * 2);
      const containerSize = Math.max(content, viewport);
      let barSize = Math.round((indicateSize * viewport) / containerSize);
      const barShiftSize = barSize < MIN_BAR_SIZE ? MIN_BAR_SIZE - barSize : 0;
      barSize = Math.min(
        indicateSize,
        Math.max(Math.min(MIN_BAR_SIZE, indicateSize), barSize),
      );
      let barPos = ((indicateSize - barShiftSize) * pos) / containerSize;

      const maxScroll = Math.max(0, content - viewport);
      const overStart = isY
        ? Math.max(0, -scrollTop)
        : Math.max(0, -scrollLeft);
      const overEnd = isY
        ? Math.max(0, scrollTop - maxScroll)
        : Math.max(0, scrollLeft - maxScroll);

      if (overStart > 0) {
        const pct = Math.min(1, overStart / MAX_BOUNCE_DISTANCE);
        barPos = -pct * (barSize - MIN_BAR_SCROLLED_SIZE);
      } else if (overEnd > 0) {
        const pct = Math.min(1, overEnd / MAX_BOUNCE_DISTANCE);
        barPos =
          pct * (barSize - MIN_BAR_SCROLLED_SIZE) + indicateSize - barSize;
      }

      return { size: Math.round(barSize), pos: Math.round(barPos) };
    }

    function updateScrollbar(keepVisible: boolean): void {
      if (
        props.scrollbarY &&
        scrollbarYRef.value &&
        scrollbarYIndicateRef.value
      ) {
        const info = computeBar(scrollTop, true);
        scrollbarYIndicateRef.value.style.height = info.size + "px";
        scrollbarYIndicateRef.value.style.transform = `translateY(${info.pos}px)`;
        if (keepVisible) {
          scrollbarYRef.value.style.opacity = "1";
          scrollbarYRef.value.style.transition = "";
        }
      }

      if (
        props.scrollbarX &&
        scrollbarXRef.value &&
        scrollbarXIndicateRef.value
      ) {
        const info = computeBar(scrollLeft, false);
        scrollbarXIndicateRef.value.style.width = info.size + "px";
        scrollbarXIndicateRef.value.style.transform = `translateX(${info.pos}px)`;
        if (keepVisible) {
          scrollbarXRef.value.style.opacity = "1";
          scrollbarXRef.value.style.transition = "";
        }
      }

      if (scrollbarHideTimer) {
        clearTimeout(scrollbarHideTimer);
        scrollbarHideTimer = null;
      }

      if (!keepVisible) {
        scrollbarHideTimer = setTimeout(() => {
          if (scrollbarYRef.value) {
            scrollbarYRef.value.style.opacity = "0";
            scrollbarYRef.value.style.transition =
              "opacity 300ms ease-out 100ms";
          }
          if (scrollbarXRef.value) {
            scrollbarXRef.value.style.opacity = "0";
            scrollbarXRef.value.style.transition =
              "opacity 300ms ease-out 100ms";
          }
        }, 100);
      }
    }

    function onPanStart(_e: GestureEvent): void {
      isPanning = true;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      if (contentRef.value) {
        contentRef.value.style.transition = "none";
      }
      panStartScrollLeft = scrollLeft;
      panStartScrollTop = scrollTop;
      updateScrollbar(true);
    }

    function onPan(e: GestureEvent): void {
      const maxX = getMaxScrollX();
      const maxY = getMaxScrollY();
      const rawX = panStartScrollLeft - e.deltaX;
      const rawY = panStartScrollTop - e.deltaY;
      const x = props.lockX ? scrollLeft : rubberBand(rawX, 0, maxX);
      const y = props.lockY ? scrollTop : rubberBand(rawY, 0, maxY);
      applyTransform(x, y);
      emitScroll();

      if (
        pulldownStatus.value === "loading" ||
        pullupStatus.value === "loading"
      )
        return;

      if (props.usePullDown && rawY < 0) {
        const newStatus =
          Math.abs(rawY) >= pdConfig.value.height ? "up" : "down";
        if (newStatus !== pulldownStatus.value) {
          pulldownStatus.value = newStatus;
          pulldownText.value =
            (pdConfig.value as any)[newStatus + "Content"] ||
            pdConfig.value.content;
        }
      }

      if (props.usePullUp && pullupStatus.value !== "disabled") {
        if (rawY > maxY) {
          const overDistance = rawY - maxY;
          const newStatus =
            overDistance >= puConfig.value.pullUpHeight ? "down" : "up";
          if (newStatus !== pullupStatus.value) {
            pullupStatus.value = newStatus;
            pullupText.value =
              (puConfig.value as any)[newStatus + "Content"] ||
              puConfig.value.content;
          }
        } else if (pullupStatus.value !== "up") {
          pullupStatus.value = "up";
          pullupText.value = puConfig.value.upContent || "Pull Up To Refresh";
        }
      }
    }

    function onPanEnd(e: GestureEvent): void {
      isPanning = false;
      const velocityX = -e.velocityX;
      const velocityY = -e.velocityY;
      const maxY = getMaxScrollY();
      const rawY = panStartScrollTop - e.deltaY;
      const outX = !props.lockX && isOutX();
      const outY = !props.lockY && isOutY();

      if (outY) {
        if (
          props.usePullDown &&
          rawY < 0 &&
          pulldownStatus.value !== "loading"
        ) {
          if (rawY < -pdConfig.value.height) {
            pulldownStatus.value = "loading";
            pulldownText.value = pdConfig.value.loadingContent || "Loading...";
            animateTo(scrollLeft, -pdConfig.value.height, 300, "ease", () => {
              emit("on-pulldown-loading");
            });
            return;
          }
        }
        if (
          props.usePullUp &&
          pullupStatus.value !== "disabled" &&
          pullupStatus.value !== "loading"
        ) {
          if (rawY > maxY + puConfig.value.pullUpHeight) {
            pullupStatus.value = "loading";
            pullupText.value = puConfig.value.loadingContent || "Loading...";
            animateTo(
              scrollLeft,
              maxY + puConfig.value.height,
              300,
              "ease",
              () => {
                emit("on-pullup-loading");
              },
            );
            return;
          }
        }
      }

      if (outX || outY) {
        boundaryCheck();
        return;
      }

      const transX = props.lockX
        ? null
        : computeScroll(scrollLeft, velocityX, containerWidth, contentWidth);
      const transY = props.lockY
        ? null
        : computeScroll(scrollTop, velocityY, containerHeight, contentHeight);

      let targetX = scrollLeft;
      let targetY = scrollTop;
      let duration = 0;
      let easing = "quadratic";

      if (transX) {
        targetX = transX.pos;
        duration = transX.duration;
        easing = transX.easing;
      }
      if (transY) {
        targetY = transY.pos;
        duration = Math.max(duration, transY.duration);
        easing = transY.easing;
      }
      if (transX && transY) {
        duration = Math.max(transX.duration, transY.duration);
      }

      if (
        duration > 0 &&
        (Math.abs(targetX - scrollLeft) > 0.5 ||
          Math.abs(targetY - scrollTop) > 0.5)
      ) {
        animateTo(targetX, targetY, duration, easing, () => {
          boundaryCheck();
        });
      } else {
        boundaryCheck();
      }
    }

    function onTap(_e: GestureEvent): void {
      boundaryCheck();
    }

    function reset(
      scrollPosition?: { top?: number; left?: number },
      duration?: number,
      easing?: string,
    ): void {
      nextTick(() => {
        updateSize();
        if (scrollPosition) {
          const x = scrollPosition.left ?? scrollLeft;
          const y = scrollPosition.top ?? scrollTop;
          if (duration && duration > 0) {
            animateTo(x, y, duration, easing || "ease");
          } else {
            applyTransform(x, y, false);
          }
        }
        boundaryCheck();
      });
    }

    function donePulldown(): void {
      pulldownStatus.value = "up";
      pulldownText.value = pdConfig.value.upContent || "Pull Down To Refresh";
      animateTo(scrollLeft, 0, BOUNDARY_BOUNCE_DURATION, "ease", () => {
        updateSize();
      });
    }

    function disablePullUp(): void {
      pullupStatus.value = "disabled";
      pullupText.value = "No More Data";
    }

    function enablePullUp(): void {
      pullupStatus.value = "up";
      pullupText.value = "Pull Up To Refresh";
    }

    function donePullUp(): void {
      pullupStatus.value = "up";
      pullupText.value = puConfig.value.upContent || "Pull Up To Refresh";
      nextTick(() => {
        updateSize();
        boundaryCheck(300);
      });
    }

    let resizeObserver: ResizeObserver | null = null;

    onMounted(() => {
      if (!scrollerRef.value) return;

      nextTick(() => {
        updateSize();
        updateScrollbar(false);
      });

      gesture = new Gesture(scrollerRef.value, {
        threshold: 5,
      });

      gesture.on("panStart", onPanStart);
      gesture.on("pan", onPan);
      gesture.on("panEnd", onPanEnd);
      gesture.on("tap", onTap);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          if (isPanning) {
            updateSize();
            return;
          }
          updateSize();
          boundaryCheck();
        });
        resizeObserver.observe(scrollerRef.value);
        if (contentRef.value) {
          resizeObserver.observe(contentRef.value);
        }
      }
    });

    onBeforeUnmount(() => {
      if (gesture) {
        gesture.destroy();
        gesture = null;
      }
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (scrollbarHideTimer) {
        clearTimeout(scrollbarHideTimer);
        scrollbarHideTimer = null;
      }
    });

    watch(
      () => props.height,
      () => {
        nextTick(() => {
          updateSize();
          boundaryCheck();
        });
      },
    );

    expose({
      reset,
      donePulldown,
      disablePullUp,
      enablePullUp,
      donePullUp,
      getStyles: () => containerStyle.value,
    });

    return {
      scrollerRef,
      contentRef,
      pulldownRef,
      pullupRef,
      scrollbarYRef,
      scrollbarYIndicateRef,
      scrollbarXRef,
      scrollbarXIndicateRef,
      containerStyle,
      pulldownText,
      pullupText,
    };
  },
});
</script>

<style>
.wiux-scroller {
  width: 100%;
  overflow: hidden;
  position: relative;
  touch-action: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.wiux-scroller-content {
  display: inline-block;
  min-width: 100%;
  min-height: 100%;
  vertical-align: top;
  transform: translate3d(0px, 0px, 0px);
  transform-origin: 0 0;
  will-change: transform;
}

.wiux-scroller-pulldown,
.wiux-scroller-pullup {
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  color: #999;
}

.wiux-scroller-pulldown-default,
.wiux-scroller-pullup-default {
  padding: 10px 0;
}

.wiux-scrollbar-y,
.wiux-scrollbar-x {
  opacity: 0;
  position: absolute;
  z-index: 999;
  overflow: hidden;
  border-radius: 3px;
  pointer-events: none;
}

.wiux-scrollbar-y {
  width: 3px;
  top: 2px;
  bottom: 2px;
  right: 2px;
}

.wiux-scrollbar-x {
  height: 3px;
  left: 2px;
  right: 2px;
  bottom: 2px;
}

.wiux-scrollbar-y-indicate,
.wiux-scrollbar-x-indicate {
  position: absolute;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.wiux-scrollbar-y-indicate {
  width: 100%;
  top: 0;
}

.wiux-scrollbar-x-indicate {
  height: 100%;
  left: 0;
}
</style>
