<template>
  <div>
    <div v-if="availableComponents.includes(name)">
      <component :is="componentMap[name]" />
    </div>

    <div v-else class="demo-placeholder">
      <div class="demo-placeholder-icon">🚧</div>
      <div class="demo-placeholder-text">组件还在开发中</div>
      <div class="demo-placeholder-tip">
        {{ name }} 组件正在努力开发中~<br />
        敬请期待...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { getComponentNames } from "../data/componentList";

const componentMap: Record<string, any> = {
  actionsheet: defineAsyncComponent(() => import("./ActionsheetDemo.vue")),
  alert: defineAsyncComponent(() => import("./AlertDemo.vue")),
  badge: defineAsyncComponent(() => import("./BadgeDemo.vue")),
  blur: defineAsyncComponent(() => import("./BlurDemo.vue")),
  "button-tab": defineAsyncComponent(() => import("./ButtonTabDemo.vue")),
  calendar: defineAsyncComponent(() => import("./CalendarDemo.vue")),
  card: defineAsyncComponent(() => import("./CardDemo.vue")),
  "cell-box": defineAsyncComponent(() => import("./CellBoxDemo.vue")),
  "cell-form-preview": defineAsyncComponent(
    () => import("./CellFormPreviewDemo.vue"),
  ),
  cell: defineAsyncComponent(() => import("./CellDemo.vue")),
  "check-icon": defineAsyncComponent(() => import("./CheckIconDemo.vue")),
  checker: defineAsyncComponent(() => import("./CheckerDemo.vue")),
  checklist: defineAsyncComponent(() => import("./ChecklistDemo.vue")),
  clocker: defineAsyncComponent(() => import("./ClockerDemo.vue")),
  "color-picker": defineAsyncComponent(() => import("./ColorPickerDemo.vue")),
  confirm: defineAsyncComponent(() => import("./ConfirmDemo.vue")),
  countdown: defineAsyncComponent(() => import("./CountdownDemo.vue")),
  countup: defineAsyncComponent(() => import("./CountupDemo.vue")),
  "datetime-range": defineAsyncComponent(
    () => import("./DatetimeRangeDemo.vue"),
  ),
  "datetime-view": defineAsyncComponent(() => import("./DatetimeViewDemo.vue")),
  datetime: defineAsyncComponent(() => import("./DatetimeDemo.vue")),
  divider: defineAsyncComponent(() => import("./DividerDemo.vue")),
  drawer: defineAsyncComponent(() => import("./DrawerDemo.vue")),
  flexBox: defineAsyncComponent(() => import("./FlexBoxDemo.vue")),
  flow: defineAsyncComponent(() => import("./FlowDemo.vue")),
  "form-preview": defineAsyncComponent(() => import("./FormPreviewDemo.vue")),
  grid: defineAsyncComponent(() => import("./GridDemo.vue")),
  group: defineAsyncComponent(() => import("./GroupDemo.vue")),
  icon: defineAsyncComponent(() => import("./IconDemo.vue")),
  "inline-calendar": defineAsyncComponent(
    () => import("./InlineCalendarDemo.vue"),
  ),
  "inline-loading": defineAsyncComponent(
    () => import("./InlineLoadingDemo.vue"),
  ),
  "inline-x-number": defineAsyncComponent(
    () => import("./InlineXNumberDemo.vue"),
  ),
  "inline-x-switch": defineAsyncComponent(
    () => import("./InlineXSwitchDemo.vue"),
  ),
  "load-more": defineAsyncComponent(() => import("./LoadMoreDemo.vue")),
  loading: defineAsyncComponent(() => import("./LoadingDemo.vue")),
  marquee: defineAsyncComponent(() => import("./MarqueeDemo.vue")),
  masker: defineAsyncComponent(() => import("./MaskerDemo.vue")),
  msg: defineAsyncComponent(() => import("./MsgDemo.vue")),
  panel: defineAsyncComponent(() => import("./PanelDemo.vue")),
  picker: defineAsyncComponent(() => import("./PickerDemo.vue")),
  popover: defineAsyncComponent(() => import("./PopoverDemo.vue")),
  "popup-header": defineAsyncComponent(() => import("./PopupHeaderDemo.vue")),
  "popup-picker": defineAsyncComponent(() => import("./PopupPickerDemo.vue")),
  "popup-radio": defineAsyncComponent(() => import("./PopupRadioDemo.vue")),
  popup: defineAsyncComponent(() => import("./PopupDemo.vue")),
  previewer: defineAsyncComponent(() => import("./PreviewerDemo.vue")),
  qrcode: defineAsyncComponent(() => import("./QrcodeDemo.vue")),
  radio: defineAsyncComponent(() => import("./RadioDemo.vue")),
  range: defineAsyncComponent(() => import("./RangeDemo.vue")),
  rater: defineAsyncComponent(() => import("./RaterDemo.vue")),
  scroller: defineAsyncComponent(() => import("./ScrollerDemo.vue")),
  search: defineAsyncComponent(() => import("./SearchDemo.vue")),
  selector: defineAsyncComponent(() => import("./SelectorDemo.vue")),
  spinner: defineAsyncComponent(() => import("./SpinnerDemo.vue")),
  step: defineAsyncComponent(() => import("./StepDemo.vue")),
  sticky: defineAsyncComponent(() => import("./StickyDemo.vue")),
  swipeout: defineAsyncComponent(() => import("./SwipeoutDemo.vue")),
  swiper: defineAsyncComponent(() => import("./SwiperDemo.vue")),
  tab: defineAsyncComponent(() => import("./TabDemo.vue")),
  tabbar: defineAsyncComponent(() => import("./TabbarDemo.vue")),
  "tabbar-simple": defineAsyncComponent(() => import("./TabbarSimpleDemo.vue")),
  "tabbar-icon": defineAsyncComponent(() => import("./TabbarIconDemo.vue")),
  timeline: defineAsyncComponent(() => import("./TimelineDemo.vue")),
  toast: defineAsyncComponent(() => import("./ToastDemo.vue")),
  uploader: defineAsyncComponent(() => import("./UploaderDemo.vue")),
  "v-chart": defineAsyncComponent(() => import("./VChartDemo.vue")),
  "view-box": defineAsyncComponent(() => import("./ViewBoxDemo.vue")),
  "wechat-emotion": defineAsyncComponent(
    () => import("./WechatEmotionDemo.vue"),
  ),
  "x-address": defineAsyncComponent(() => import("./XAddressDemo.vue")),
  "x-button": defineAsyncComponent(() => import("./XButtonDemo.vue")),
  "x-circle": defineAsyncComponent(() => import("./XCircleDemo.vue")),
  "x-dialog": defineAsyncComponent(() => import("./XDialogDemo.vue")),
  "x-form": defineAsyncComponent(() => import("./XFormDemo.vue")),
  "x-header": defineAsyncComponent(() => import("./XHeaderDemo.vue")),
  "x-icon": defineAsyncComponent(() => import("./XIconDemo.vue")),
  "x-img": defineAsyncComponent(() => import("./XImgDemo.vue")),
  "x-input": defineAsyncComponent(() => import("./XInputDemo.vue")),
  "x-number": defineAsyncComponent(() => import("./XNumberDemo.vue")),
  "x-progress": defineAsyncComponent(() => import("./XProgressDemo.vue")),
  "x-switch": defineAsyncComponent(() => import("./XSwitchDemo.vue")),
  "x-table": defineAsyncComponent(() => import("./XTableDemo.vue")),
  "x-textarea": defineAsyncComponent(() => import("./XTextareaDemo.vue")),
};

const availableComponents = Object.keys(componentMap);

export default {
  name: "ComponentDemo",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      componentMap,
      availableComponents,
    };
  },
};
</script>

<style scoped>
.demo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.demo-placeholder-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.demo-placeholder-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.demo-placeholder-tip {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
}
</style>
