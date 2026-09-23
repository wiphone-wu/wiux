<template>
  <div class="demo-list-box" ref="listBoxRef">
    <flexBox :gutter="0" v-for="(list, index) in componentRows" :key="index">
      <flexBox-item
        :span="1 / 3"
        v-for="component in list"
        :key="component.name"
        class="box wiux-1px-t wiux-tap-active"
        :class="{ 'box--disabled': !component.available }"
        @click="go(component.name, component.available)"
      >
        <div class="wiux-1px-r box-inner">
          <span
            class="demo-icon demo-icon-big"
            v-if="component.icon"
            v-html="component.icon"
            :style="{
              color: component.available ? component.color || '#666' : '#ccc',
            }"
          ></span>
          <br v-if="component.icon" />
          <span
            :style="{ fontSize: component.name.length > 12 ? '12px' : '' }"
            >{{ component.displayName }}</span
          >
        </div>
      </flexBox-item>
    </flexBox>
  </div>
</template>

<script lang="ts">
import {
  computed,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
  nextTick,
  ref,
} from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { FlexBox, FlexBoxItem } from "wiux";
import componentList, { type ComponentListItem } from "../data/componentList";

interface DisplayComponent {
  name: string;
  displayName: string;
  icon: string;
  color?: string;
  available: boolean;
}

export default {
  name: "DemoList",
  components: {
    FlexBox,
    FlexBoxItem,
  },
  setup() {
    const router = useRouter();
    let savedScrollTop = 0;
    const listBoxRef = ref<HTMLElement | null>(null);

    console.log("[DemoList] setup() called");

    function getScrollContainer(): HTMLElement | null {
      return document.getElementById("wiux_view_box_body");
    }

    function getScrollTop(): number {
      const container = getScrollContainer();
      if (container) {
        return container.scrollTop;
      }
      return (
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    }

    function setScrollTop(top: number) {
      const container = getScrollContainer();
      if (container) {
        container.scrollTop = top;
      }
      console.log(
        "[DemoList] setScrollTop called, top =",
        top,
        "container.scrollTop after =",
        container?.scrollTop,
      );
    }

    onBeforeRouteLeave((to, from, next) => {
      savedScrollTop = getScrollTop();
      console.log(
        "[DemoList] onBeforeRouteLeave - saving scrollTop =",
        savedScrollTop,
      );
      next();
    });

    onMounted(() => {
      console.log(
        "[DemoList] onMounted(), scrollY =",
        window.scrollY,
        "body.scrollTop =",
        document.body.scrollTop,
      );
    });

    onBeforeUnmount(() => {
      console.log("[DemoList] onBeforeUnmount(), scrollY =", window.scrollY);
    });

    onActivated(() => {
      console.log("[DemoList] onActivated(), savedScrollTop =", savedScrollTop);
      nextTick(() => {
        setScrollTop(savedScrollTop);
        console.log(
          "[DemoList] onActivated nextTick, restored to",
          savedScrollTop,
        );
      });
    });

    onDeactivated(() => {
      console.log("[DemoList] onDeactivated()");
    });

    const availableComponents = [
      "actionsheet",
      "alert",
      "badge",
      "blur",
      "button-tab",
      "calendar",
      "card",
      "cell-box",
      "cell-form-preview",
      "cell",
      "check-icon",
      "checker",
      "checklist",
      "clocker",
      "color-picker",
      "confirm",
      "countdown",
      "countup",
      "datetime-range",
      "datetime-view",
      "datetime",
      "divider",
      "drawer",
      "flexBox",
      "flow",
      "form-preview",
      "grid",
      "group",
      "icon",
      "inline-calendar",
      "inline-loading",
      "inline-x-number",
      "inline-x-switch",
      "load-more",
      "loading",
      "marquee",
      "masker",
      "msg",
      "panel",
      "picker",
      "popover",
      "popup-header",
      "popup-picker",
      "popup-radio",
      "popup",
      "previewer",
      "qrcode",
      "radio",
      "range",
      "rater",
      "scroller",
      "search",
      "selector",
      "spinner",
      "step",
      "sticky",
      "swipeout",
      "swiper",
      "tab",
      "tabbar",
      "timeline",
      "toast",
      "uploader",
      "v-chart",
      "view-box",
      "wechat-emotion",
      "x-address",
      "x-button",
      "x-circle",
      "x-dialog",
      "x-form",
      "x-header",
      "x-icon",
      "x-img",
      "x-input",
      "x-number",
      "x-progress",
      "x-switch",
      "x-table",
      "x-textarea",
    ];

    function camelCase(input: string): string {
      let str = input.replace(
        /-(.)/g,
        function (_match: string, group1: string) {
          return group1.toUpperCase();
        },
      );
      str = str.replace(/_(.)/g, function (_match: string, group1: string) {
        return group1.toUpperCase();
      });
      return str.slice(0, 1).toUpperCase() + str.slice(1);
    }

    const displayComponents = computed<DisplayComponent[]>(() => {
      return componentList.map((item: ComponentListItem) => ({
        name: item.name,
        displayName: camelCase(item.name),
        icon: item.icon,
        color: item.color,
        available: availableComponents.includes(item.name),
      }));
    });

    const componentRows = computed(() => {
      const list = displayComponents.value;
      let chunks: DisplayComponent[][] = [];
      let count = Math.ceil(list.length / 3);
      while (count > 0) {
        chunks.push(list.slice((count - 1) * 3, count * 3));
        count--;
      }
      chunks = chunks.reverse();
      const lastList = chunks[chunks.length - 1];
      const lastLength = lastList.length;
      if (lastLength < 3) {
        for (let i = 0; i < 3 - lastLength; i++) {
          lastList.push({
            name: "----",
            displayName: "——",
            icon: "&nbsp;",
            available: true,
          });
        }
      }
      return chunks;
    });

    const go = (name: string, available: boolean) => {
      if (available) {
        router.push(`/component/${name}`);
      }
    };

    return {
      componentRows,
      go,
      listBoxRef,
    };
  },
};
</script>

<style scoped lang="less">
@import "../../src/styles/1px.less";

.demo-list-box {
  background-color: #fff;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.box {
  text-align: center;
}

.box-inner {
  padding: 15px 0;
  width: 100%;
  height: 100%;
}

.box--disabled {
  opacity: 0.3;
  pointer-events: none;
}

.demo-icon {
  margin-right: 0;
}

.demo-icon-big {
  font-size: 26px;
  display: inline-block;
}
</style>
