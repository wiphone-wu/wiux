<template>
  <div>
    <Group>
      <XSwitch :title="t('Show')" v-model="show" />
    </Group>
    <Group>
      <XSwitch :title="t('Show Prompt')" v-model="show3" />
    </Group>
    <Group>
      <XSwitch :title="t('Set default input text')" v-model="show5" />
    </Group>
    <Group>
      <XSwitch :title="t('Android Theme')" v-model="show2" />
    </Group>
    <Group>
      <XSwitch :title="t('Prevent auto closing')" v-model="show4" />
    </Group>
    <Group>
      <XSwitch :title="t('showCancelButton=false')" v-model="show6" />
    </Group>

    <Confirm
      v-model="show"
      :title="t('Tips')"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide="onHide"
    >
      <p style="text-align: center">{{ t("Are you sure?") }}</p>
    </Confirm>

    <Confirm
      v-model="show3"
      show-input
      :title="t('Tips')"
      :input-attrs="{ type: 'number' }"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide="onHide"
    >
    </Confirm>

    <Confirm
      v-model="show5"
      show-input
      ref="confirm5"
      :title="t('Tips')"
      @on-cancel="onCancel"
      @on-confirm="onConfirm5"
      @on-show="onShow5"
      @on-hide="onHide"
    >
    </Confirm>

    <Confirm
      v-model="show2"
      :title="t('Tips')"
      theme="android"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide="onHide"
    >
      <p style="text-align: center">I miss you</p>
    </Confirm>

    <Confirm
      v-model="show4"
      :close-on-confirm="false"
      :title="t('Tips')"
      @on-confirm="onConfirm4"
    >
      <p style="text-align: center">{{ t("Are you sure?") }}</p>
    </Confirm>

    <Confirm
      v-model="show6"
      :show-cancel-button="false"
      :title="t('Tips')"
      @on-confirm="onConfirm"
    >
      <p style="text-align: center">{{ t("Are you sure?") }}</p>
    </Confirm>

    <div style="padding: 15px">
      <XButton @click="showPlugin" type="primary">{{ t("Show") }}</XButton>
    </div>
    <div style="padding: 15px">
      <XButton @click="showPlugin2" type="primary">{{
        t("Use in Plugin")
      }}</XButton>
    </div>
    <div style="padding: 15px">
      <XButton @click="showPlugin3" type="primary">{{
        t("Call prompt by using Composable")
      }}</XButton>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  Confirm,
  Group,
  XSwitch,
  XButton,
  useConfirm,
  useLoading,
  useToast,
  useLocale,
} from "wiux";

const confirm = useConfirm();
const loading = useLoading();
const toast = useToast();

export default {
  components: {
    Confirm,
    Group,
    XSwitch,
    XButton,
  },
  setup() {
    const { t } = useLocale();
    const confirm5 = ref<any>(null);

    const show = ref(false);
    const show2 = ref(false);
    const show3 = ref(false);
    const show4 = ref(false);
    const show5 = ref(false);
    const show6 = ref(false);

    const onCancel = () => {
      console.log("on cancel");
    };

    const onConfirm = (msg: string) => {
      console.log("on confirm");
      if (msg) {
        toast.text(String(msg));
      } else {
        toast.text("请输入数字");
      }
    };

    const onConfirm4 = () => {
      console.log("on confirm");
      loading.show({
        text: t("processing"),
      });
      setTimeout(() => {
        loading.hide();
        show4.value = false;
      }, 1000);
    };

    const onConfirm5 = (value: string) => {
      confirm5.value?.setInputValue?.("");
      toast.text("input value: " + value);
    };

    const onHide = () => {
      console.log("on hide");
    };

    const onShow = () => {
      console.log("on show");
    };

    const onShow5 = () => {
      confirm5.value?.setInputValue?.("default");
    };

    const showPlugin = () => {
      confirm.show({
        title: t("Title"),
        content: t("Content"),
        onShow() {
          console.log("plugin show");
        },
        onHide() {
          console.log("plugin hide");
        },
        onCancel() {
          console.log("plugin cancel");
        },
        onConfirm() {
          console.log("plugin confirm");
        },
      });
    };

    const showPlugin2 = () => {
      showPlugin();
    };

    const showPlugin3 = () => {
      confirm.prompt(t("Call prompt by using Composable"), {
        title: t("Title"),
        onShow() {
          console.log("prompt show");
          confirm.setInputValue("set value");
        },
        onHide() {
          console.log("prompt hide");
        },
        onCancel() {
          console.log("prompt cancel");
        },
        onConfirm(msg?: string | undefined) {
          toast.text("input value: " + msg);
        },
      });
    };

    return {
      t,
      show,
      show2,
      show3,
      show4,
      show5,
      show6,
      confirm5,
      onCancel,
      onConfirm,
      onConfirm4,
      onConfirm5,
      onHide,
      onShow,
      onShow5,
      showPlugin,
      showPlugin2,
      showPlugin3,
    };
  },
};
</script>