<template>
  <div>
    <br />
    <x-header>{{ t("Page title") }}</x-header>
    <br />
    <x-header :title="t('Page title using title')"></x-header>
    <br />
    <x-header :left-options="{ showBack: false }">{{
      t("Hide back button")
    }}</x-header>
    <br />
    <x-header :left-options="{ backText: '' }">{{
      t("Empty back button")
    }}</x-header>
    <br />
    <x-header
      :right-options="{ showMore: true }"
      @on-click-more="showMenus = true"
      >{{ t("Show more menu") }}</x-header
    >
    <br />
    <x-header
      >{{ t("Show feedback link button")
      }}<template #right
        ><a>{{ t("Feedback") }}</a></template
      ></x-header
    >
    <br />
    <x-header
      >{{ t("Very long text header")
      }}<template #right
        ><a>{{ t("Feedback") }}</a></template
      ></x-header
    >
    <br />
    <x-header
      >{{ t("Show left hook")
      }}<template #left
        ><a>{{ t("Close") }}</a></template
      ></x-header
    >
    <br />
    <x-header>
      <span>{{ t("overwrite-left") }}</span>
      <template #overwrite-left>
        <x-icon
          type="navIcon"
          size="35"
          style="fill: #fff; position: relative; top: -8px; left: -3px"
        ></x-icon>
      </template>
    </x-header>
    <br />
    <x-header style="background-color: #000">{{
      t("custom background color")
    }}</x-header>
    <br />
    <x-header :title="t('slot:overwrite-title')">
      <template #overwrite-title>
        <div class="overwrite-title-demo">
          <button-tab>
            <button-tab-item selected>A</button-tab-item>
            <button-tab-item>B</button-tab-item>
          </button-tab>
        </div>
      </template>
    </x-header>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" show-cancel></actionsheet>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  XHeader,
  Actionsheet,
  ButtonTab,
  ButtonTabItem,
  XIcon,
  useLocale,
} from "wiux";
import TransferDom from "../../src/directives/transfer-dom";

export default {
  name: "XHeaderDemo",
  components: {
    XHeader,
    Actionsheet,
    ButtonTab,
    ButtonTabItem,
    XIcon,
  },
  directives: {
    TransferDom,
  },
  setup() {
    const { t } = useLocale();
    const showMenus = ref(false);
    const menus = {
      menu1: "Take Photo",
      menu2: "Choose from photos",
    };

    return {
      t,
      showMenus,
      menus,
    };
  },
};
</script>

<style>
.overwrite-title-demo {
  margin-top: 5px;
}
</style>