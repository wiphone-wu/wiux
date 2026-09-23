<template>
  <div>
    <Group>
      <XSwitch :title="t('Basic Usage')" v-model="show1" />
      <XSwitch :title="t('Android Theme')" v-model="show7" />
      <XSwitch :title="t('Show cancel menu')" v-model="show2" />
      <XSwitch :title="t('Array menu')" v-model="show5" />
    </Group>

    <Group :title="t('Prevent closing when clicking mask')">
      <XSwitch :title="t('Basic Usage')" v-model="show4" />
    </Group>

    <Group>
      <XSwitch :title="t('Menu as tips')" v-model="show3" />
      <XSwitch :title="t('Slot: header')" v-model="show6" />
      <XSwitch :title="t('Prevent auto closing')" v-model="show8" />
    </Group>

    <Actionsheet
      v-model="show1"
      :menus="menus1"
      @on-click-menu="onMenuClick"
      @on-after-show="log('after show')"
      @on-after-hide="log('after hide')"
    />

    <Actionsheet
      v-model="show2"
      :menus="menus2"
      show-cancel
      :cancelText="t('Cancel')"
      @on-click-menu="onMenuClick"
    />

    <Actionsheet
      v-model="show3"
      :menus="menus3"
      show-cancel
      @on-click-menu="onMenuClick"
    />

    <Actionsheet
      v-model="show4"
      :menus="menus1"
      :close-on-clicking-mask="false"
      show-cancel
      :cancelText="t('Cancel')"
      @on-click-mask="onClickMask"
    />

    <Actionsheet
      v-model="show5"
      :menus="menus5"
      show-cancel
      @on-click-menu="onMenuClick5"
    />

    <Actionsheet v-model="show6" :menus="menus1">
      <template #header>
        <p
          style="text-align: center; padding: 10px 0"
          v-html="t('Actionsheet header')"
        ></p>
      </template>
    </Actionsheet>

    <Actionsheet
      v-model="show7"
      :menus="menu7"
      theme="android"
      @on-click-menu="onMenuClick"
      @on-after-show="log('after show')"
      @on-after-hide="log('after hide')"
    />

    <Actionsheet
      v-model="show8"
      :menus="menus8"
      :close-on-clicking-mask="false"
      :close-on-clicking-menu="false"
      @on-click-menu="onDemo8MenuClick"
    />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Actionsheet, Group, XSwitch, useLoading, useLocale } from "wiux";

const loading = useLoading();

export default {
  name: "ActionsheetDemo",
  components: {
    Actionsheet,
    Group,
    XSwitch,
  },
  setup() {
    const { t } = useLocale();

    const show1 = ref(false);
    const show2 = ref(false);
    const show3 = ref(false);
    const show4 = ref(false);
    const show5 = ref(false);
    const show6 = ref(false);
    const show7 = ref(false);
    const show8 = ref(false);

    const menus1 = {
      menu1: "Share to friends",
      menu2: "Share to timeline",
    };

    const menus2 = {
      menu1: "Take Photo",
      menu2: "Choose from photos",
    };

    const menus3 = {
      "title.noop": "Actionsheet header",
      delete: '<span style="color:red">Delete</span>',
    };

    const menus5 = [
      {
        label: "Actionsheet header",
        type: "info" as const,
      },
      {
        label: "Primary",
        type: "primary" as const,
        value: "primary",
      },
      {
        label: "Warn",
        type: "warn" as const,
      },
      {
        label: "Disabled",
        type: "disabled" as const,
      },
      {
        label: "Default",
      },
    ];

    const menu7 = {
      menu1: "Peking Duck",
      menu2: "Shaanxi Noodles",
      menu3: "Xi'an Meat Burger",
    };

    const menus8 = {
      menu1: "Close me",
      menu2: "Close me",
    };

    const onMenuClick = (key: string, item: any) => {
      console.log(key, item);
    };

    const onMenuClick5 = (key: string, item: any) => {
      console.log(key, item);
    };

    const onClickMask = () => {
      console.log("on click mask");
    };

    const onDemo8MenuClick = (key: string, item: any) => {
      console.log(key, item);
      loading.show({
        text: t("processing"),
      });
      setTimeout(() => {
        loading.hide();
        show8.value = false;
      }, 1000);
    };

    const log = (msg: string) => {
      console.log(msg);
    };

    return {
      t,
      show1,
      show2,
      show3,
      show4,
      show5,
      show6,
      show7,
      show8,
      menus1,
      menus2,
      menus3,
      menus5,
      menu7,
      menus8,
      onMenuClick,
      onMenuClick5,
      onClickMask,
      onDemo8MenuClick,
      log,
    };
  },
};
</script>
