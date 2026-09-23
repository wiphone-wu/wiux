<template>
  <div style="height: 100%">
    <actionsheet
      v-model="showMenu"
      :menus="menus"
      @on-click-menu="changeLocale"
    ></actionsheet>

    <drawer
      v-model:model-value="drawerVisibility"
      :show-mode="showModeValue"
      :placement="showPlacementValue"
      :drawer-style="{ backgroundColor: '#35495e', width: '200px' }"
    >
      <template #drawer>
        <div>
          <group :title="t('Drawer demo')" style="margin-top: 20px">
            <cell
              :title="t('Demo')"
              :value="t('Go')"
              is-link
              @click="drawerVisibility = false"
            ></cell>
            <!-- <cell
              title="Buy me a coffee"
              is-link
              @click="drawerVisibility = false"
            ></cell> -->
            <cell
              :title="t('Github')"
              :value="t('Git Url')"
              is-link
              @click="drawerVisibility = false"
            ></cell>
          </group>
          <group :title="t('showMode')">
            <radio
              v-model="showMode"
              :options="[t('push'), t('overlay')]"
              @on-change="onShowModeChange"
            ></radio>
          </group>
          <group :title="t('placement')">
            <radio
              v-model="showPlacement"
              :options="[t('left'), t('right')]"
              @on-change="onPlacementChange"
            ></radio>
          </group>
        </div>
      </template>

      <view-box body-padding-top="46px" body-padding-bottom="50px">
        <template #header>
          <x-header
            style="
              width: 100%;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 100;
            "
            :left-options="leftOptions"
            :right-options="rightOptions"
            :title="pageTitle"
            @on-click-more="onClickMore"
          >
            <template #overwrite-left v-if="route.path === '/'">
              <span @click="drawerVisibility = !drawerVisibility">
                <x-icon
                  type="navIcon"
                  size="35"
                  style="fill: #fff; position: relative; top: -8px; left: -3px"
                ></x-icon>
              </span>
            </template>
          </x-header>
        </template>

        <router-view v-slot="{ Component }">
          <keep-alive :include="cacheList">
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </router-view>

        <template #bottom>
          <tabbar
            v-model="tabbarIndex"
            v-show="!isTabbarDemo"
            class="wiux-demo-tabbar"
            icon-class="wiux-center"
          >
            <tabbar-item>
              <template #icon>
                <svg
                  class="demo-logo-svg"
                  style="width: 27px; height: 27px; position: relative; top: 3px"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="190 310 640 400"
                  xml:space="preserve"
                >
                  <path fill="currentColor" d="M 769 416 L 734 424 L 716 430 L 616 456 L 602 463 L 591 473 L 557 535 L 486 658 L 485 662 L 487 667 L 510 706 L 512 707 L 516 702 L 587 581 L 596 570 L 608 567 L 662 561 L 675 557 L 693 547 L 706 532 L 719 504 L 710 504 L 630 515 L 627 513 L 635 507 L 677 495 L 701 490 L 721 483 L 733 476 L 753 456 L 760 443 Z" />
                  <path fill="currentColor" d="M 200 316 L 200 320 L 205 335 L 218 362 L 228 375 L 245 390 L 268 401 L 395 445 L 409 451 L 414 455 L 410 456 L 382 449 L 371 445 L 363 444 L 259 416 L 255 416 L 255 419 L 264 444 L 271 456 L 284 471 L 298 481 L 311 487 L 366 501 L 392 510 L 393 514 L 387 514 L 331 506 L 304 504 L 315 529 L 328 545 L 344 556 L 353 559 L 418 567 L 428 570 L 436 580 L 476 649 L 479 651 L 505 608 L 547 532 L 567 499 L 577 479 L 585 467 L 592 460 L 599 455 L 612 449 L 755 401 L 772 393 L 788 382 L 799 370 L 813 347 L 823 320 L 823 316 L 815 318 L 807 322 L 781 330 L 723 352 L 588 400 L 576 407 L 560 422 L 498 530 L 489 545 L 485 549 L 481 544 L 481 539 L 501 506 L 505 496 L 462 421 L 449 408 L 431 398 L 337 365 L 209 318 Z" />
                </svg>
              </template>
              <template #label>
                <span>Home</span>
              </template>
            </tabbar-item>
            <tabbar-item badge="9">
              <template #icon>
                <span class="demo-icon-22">&#xe633;</span>
              </template>
              <template #label>
                <span v-if="componentName" class="wiux-demo-tabbar-component">{{
                  componentName
                }}</span>
                <span v-else>Demos</span>
              </template>
            </tabbar-item>
          </tabbar>
        </template>
      </view-box>
    </drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Drawer,
  ViewBox,
  XHeader,
  XIcon,
  tabbar,
  tabbarItem,
  Group,
  Cell,
  Radio,
  Actionsheet,
  useLocale,
} from "wiux";

const route = useRoute();
const router = useRouter();
const { locale, t } = useLocale();

const cacheList = ref(["Home", "DemoList"]);
const drawerVisibility = ref(false);
const showMode = ref<"push" | "overlay">("push");
const showModeValue = ref<"push" | "overlay">("push");
const showPlacement = ref<"left" | "right">("left");
const showPlacementValue = ref<"left" | "right">("left");
const tabbarIndex = ref(0);
const showMenu = ref(false);

const menus = {
  "language.noop": '<span class="menu-title">Language</span>',
  zh: "中文",
  en: "English",
};

const pageTitle = computed(() => {
  if (route.path === "/") return "Home";
  if (route.path === "/demo") return "Demo List";
  const name = route.params.name as string;
  return name ? `Demo/${name}` : "Demo";
});

const componentName = computed(() => {
  if (route.path.startsWith("/component/")) {
    return (route.params.name as string) || "";
  }
  return "";
});

const isTabbarDemo = computed(() => {
  return /tabbar/.test(route.path);
});

const leftOptions = computed(() => ({
  showBack: route.path !== "/",
}));

const rightOptions = computed(() => ({
  showMore: true,
}));

function onClickMore() {
  showMenu.value = true;
}

function changeLocale(localeVal: string) {
  if (locale) {
    locale.value = localeVal as "zh" | "en";
  }
}

function onShowModeChange(val: "push" | "overlay") {
  drawerVisibility.value = false;
  setTimeout(() => {
    showModeValue.value = val;
  }, 400);
}

function onPlacementChange(val: "left" | "right") {
  drawerVisibility.value = false;
  setTimeout(() => {
    showPlacementValue.value = val;
  }, 400);
}

watch(
  () => route.path,
  (path) => {
    if (path === "/") tabbarIndex.value = 0;
    else if (path === "/demo" || path.startsWith("/component/"))
      tabbarIndex.value = 1;
  },
  { immediate: true },
);

watch(tabbarIndex, (index) => {
  if (index === 0 && route.path !== "/") {
    router.push("/");
  } else if (
    index === 1 &&
    route.path !== "/demo" &&
    !route.path.startsWith("/component/")
  ) {
    router.push("/demo");
  }
});
</script>

<script lang="ts">
export default {
  name: "DemoApp",
};
</script>

<style>
@font-face {
  font-family: "wiux-demo";
  font-display: swap;
  src: url("//at.alicdn.com/t/font_70323_wlronpvr565yiudi.eot");
  src:
    url("//at.alicdn.com/t/font_70323_wlronpvr565yiudi.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_70323_wlronpvr565yiudi.woff") format("woff"),
    url("//at.alicdn.com/t/font_70323_wlronpvr565yiudi.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_70323_wlronpvr565yiudi.svg#iconfont")
      format("svg");
}

html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

body {
  background-color: #fbf9fe;
}

.demo-icon {
  font-family: "wiux-demo";
  font-size: 20px;
  color: #04be02;
}

.demo-icon-big {
  font-size: 28px;
}

.demo-icon:before {
  content: attr(icon);
}

.demo-icon-22 {
  font-family: "wiux-demo";
  font-size: 22px;
  color: #888;
}

.wiux-demo-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.wiux-demo-tabbar .weui-bar__item_on .demo-icon-22 {
  color: #09bb07;
}

.wiux-demo-tabbar .demo-logo-svg {
  color: #888;
}

.wiux-demo-tabbar .weui-bar__item_on .demo-logo-svg {
  color: #09bb07;
}

.wiux-demo-tabbar-component {
  background-color: #09bb07;
  color: #fff;
  border-radius: 7px;
  padding: 0 4px;
  line-height: 14px;
}

.menu-title {
  color: #888;
}
</style>