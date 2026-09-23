<template>
  <div style="height: 100vh">
    <actionsheet
      v-model="showMenu"
      :menus="menus"
      @on-click-menu="changeLocale"
    ></actionsheet>

    <drawer
      :model-value="drawerVisibility"
      :show-mode="showModeValue"
      :placement="showPlacementValue"
      :drawer-style="{ backgroundColor: '#35495e', width: '200px' }"
      @update:model-value="drawerVisibility = $event"
    >
      <template #drawer>
        <div>
          <group :title="t('Drawer Demo')" style="margin-top: 20px">
            <cell
              title="Demo"
              :value="t('Demo')"
              is-link
              @click="drawerVisibility = false"
            ></cell>
            <!-- <cell
              :title="t('Buy me a coffee')"
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
              :options="['push', 'overlay']"
              @on-change="onShowModeChange"
            ></radio>
          </group>
          <group :title="t('Placement')">
            <radio
              v-model="showPlacement"
              :options="['left', 'right']"
              @on-change="onPlacementChange"
            ></radio>
          </group>
        </div>
      </template>

      <div style="height: 100%">
        <x-header
          :left-options="{ showBack: false }"
          :right-options="{ showMore: true }"
          :title="t('Drawer Demo')"
          @on-click-more="onClickMore"
        >
          <template #overwrite-left>
            <span
              @click="drawerVisibility = !drawerVisibility"
              style="cursor: pointer"
            >
              <x-icon
                type="navIcon"
                size="35"
                style="fill: #fff; position: relative; top: -8px; left: -3px"
              ></x-icon>
            </span>
          </template>
        </x-header>

        <group :title="t('Basic Usage')">
          <cell
            :title="t('Open Drawer')"
            is-link
            @click="drawerVisibility = !drawerVisibility"
          ></cell>
        </group>

        <group :title="t('Current Settings')">
          <cell :title="t('Show Mode')" :value="showModeValue"></cell>
          <cell :title="t('Placement')" :value="showPlacementValue"></cell>
        </group>

        <divider>{{ t("Description") }}</divider>
        <div style="padding: 15px; color: #999; font-size: 14px">
          <p>{{ t("Drawer component is used for sidebar navigation.") }}</p>
          <p style="margin-top: 8px">{{ t("showMode prop:") }}</p>
          <p>{{ t("- push: push content area to display (default)") }}</p>
          <p>{{ t("- overlay: display above content") }}</p>
          <p style="margin-top: 8px">{{ t("placement prop:") }}</p>
          <p>{{ t("- left: display on left (default)") }}</p>
          <p>{{ t("- right: display on right") }}</p>
        </div>
      </div>
    </drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  Drawer,
  Group,
  Cell,
  Radio,
  XHeader,
  XIcon,
  Divider,
  Actionsheet,
  useLocale,
} from "wiux";

export default defineComponent({
  components: {
    Drawer,
    Group,
    Cell,
    Radio,
    XHeader,
    XIcon,
    Divider,
    Actionsheet,
  },
  setup() {
    const { t, locale } = useLocale();
    const drawerVisibility = ref(false);
    const showMode = ref("push");
    const showModeValue = ref<"push" | "overlay">("push");
    const showPlacement = ref("left");
    const showPlacementValue = ref<"left" | "right">("left");
    const showMenu = ref(false);

    const menus = {
      "language.noop": '<span class="menu-title">Language</span>',
      zh: "中文",
      en: "English",
    };

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

    function onClickMore() {
      showMenu.value = true;
    }

    function changeLocale(localeVal: string) {
      if (locale) {
        locale.value = localeVal as "zh" | "en";
      }
    }

    return {
      t,
      drawerVisibility,
      showMode,
      showModeValue,
      showPlacement,
      showPlacementValue,
      showMenu,
      menus,
      onShowModeChange,
      onPlacementChange,
      onClickMore,
      changeLocale,
    };
  },
});
</script>

<style scoped>
:deep(.weui-cells) {
  margin-top: 0;
}
</style>

<style>
.menu-title {
  color: #888;
}
</style>
