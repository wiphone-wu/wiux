<template>
  <div>
    <group>
      <x-switch v-model="show" :title="t('Show/Hide')"></x-switch>
      <x-switch v-model="show2" :title="t('Use .sync')"></x-switch>
      <x-switch v-model="showToast" :title="t('Show toast')"></x-switch>
      <x-switch
        v-model="showHideOnBlur"
        :title="t('Click mask to close')"
      ></x-switch>
      <x-switch
        v-model="showDialogStyle"
        :title="t('Custom dialog style')"
      ></x-switch>
      <x-switch
        v-model="showScrollBox"
        :title="t('Very long content')"
      ></x-switch>
    </group>

    <x-dialog v-model="showToast" class="dialog-demo">
      <div style="padding: 15px">
        <x-button @click="doShowToast" type="primary">{{
          t("show toast")
        }}</x-button>
      </div>
      <div @click="showToast = false">
        <span class="wiux-close"></span>
      </div>
    </x-dialog>

    <x-dialog v-model="show" class="dialog-demo">
      <div class="img-box">
        <img src="../assets/cat1.jpg" style="max-width: 100%" />
      </div>
      <div @click="show = false">
        <span class="wiux-close"></span>
      </div>
    </x-dialog>

    <x-dialog v-model="show2" class="dialog-demo">
      <div class="img-box">
        <img src="../assets/cat2.jpg" style="max-width: 100%" />
      </div>
      <div @click="show2 = false">
        <span class="wiux-close"></span>
      </div>
    </x-dialog>

    <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
      <div class="img-box">
        <img src="../assets/cat3.jpg" style="max-width: 100%" />
      </div>
      <div @click="showHideOnBlur = false">
        <span class="wiux-close"></span>
      </div>
    </x-dialog>

    <x-dialog
      v-model="showDialogStyle"
      hide-on-blur
      :dialog-style="{
        'max-width': '100%',
        width: '100%',
        height: '50%',
        'background-color': 'transparent',
      }"
    >
      <p
        style="color: #fff; text-align: center"
        @click="showDialogStyle = false"
      >
        <span style="font-size: 30px">HELLO WORLD</span>
        <br />
        <br />
        <x-icon type="ios-close-outline" style="fill: #fff"></x-icon>
      </p>
    </x-dialog>

    <x-dialog v-model="showScrollBox" class="dialog-demo">
      <p class="dialog-title">{{ t("Long content") }}</p>
      <div
        class="img-box"
        style="
          height: 100px;
          padding: 15px 0;
          overflow: scroll;
          -webkit-overflow-scrolling: touch;
        "
      >
        <p v-for="i in 20" :key="i">{{ i }}</p>
      </div>
      <div @click="showScrollBox = false">
        <span class="wiux-close"></span>
      </div>
    </x-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { XDialog, XButton, Group, XSwitch, XIcon, useToast, useLocale } from "wiux";

const toast = useToast();

export default defineComponent({
  name: "XDialogDemo",
  components: {
    XDialog,
    XButton,
    Group,
    XSwitch,
    XIcon,
  },
  setup() {
    const { t } = useLocale();
    const show = ref(false);
    const show2 = ref(false);
    const showToast = ref(false);
    const showHideOnBlur = ref(false);
    const showScrollBox = ref(false);
    const showDialogStyle = ref(false);

    const doShowToast = () => {
      toast.show({
        text: t("show toast"),
      });
    };

    return {
      t,
      show,
      show2,
      showToast,
      showHideOnBlur,
      showScrollBox,
      showDialogStyle,
      doShowToast,
    };
  },
});
</script>

<style lang="less" scoped>
@import "../../src/styles/close.less";

.dialog-demo {
  :deep(.weui-dialog) {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .wiux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>