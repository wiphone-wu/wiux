<template>
  <div>
    <div style="padding: 15px">
      <XButton @click="showPosition('top')" type="primary">{{
        t("Top")
      }}</XButton>
      <XButton @click="showPosition('middle')" type="primary">{{
        t("Middle")
      }}</XButton>
      <XButton @click="showPosition('bottom')" type="primary">{{
        t("Bottom")
      }}</XButton>
      <XButton @click="showPosition('')" type="primary">{{
        t("Default")
      }}</XButton>
    </div>

    <Toast
      v-model="showPositionValue"
      type="text"
      :time="800"
      is-show-mask
      :text="t('placeholder')"
      :position="position"
      >{{ t("Basic Usage") }}</Toast
    >

    <Group>
      <XSwitch :title="t('Basic usage')" v-model="show1" />
      <XSwitch :title="t('type is text')" v-model="show2" />
      <XSwitch :title="t('type is cancel')" v-model="show3" />
      <XSwitch :title="t('type is warn')" v-model="show4" />
      <XSwitch :title="t('time is 1s')" v-model="show5" />
      <XSwitch :title="t('Very long text')" v-model="show6" />
    </Group>

    <Toast v-model="show1" @on-hide="onHide">{{ t("Basic usage") }}</Toast>
    <Toast v-model="show2" type="text">{{ t("Success~") }}</Toast>
    <Toast v-model="show3" type="cancel">{{ t("type is cancel") }}</Toast>
    <Toast v-model="show4" type="warn">{{ t("type is warn") }}</Toast>
    <Toast v-model="show5" :time="1000">{{ t("Display time 1s") }}</Toast>
    <Toast v-model="show6" type="text" width="20em"
      >Talk is cheap, show me the code.</Toast
    >

    <Group :title="t('prop:text')">
      <XSwitch :title="t('type is success')" v-model="show7" />
      <XSwitch :title="t('type is text')" v-model="show8" />
    </Group>

    <Toast
      v-model="show7"
      type="success"
      :text="t('Success~')"
      :position="position"
    />
    <Toast
      v-model="show8"
      type="text"
      :text="t('placeholder')"
      :position="position"
    />

    <Group :title="t('Use in Composable')">
      <XSwitch
        :title="t('Default switch')"
        v-model="show9"
        @on-change="onChange"
      />
    </Group>
    <div style="padding: 15px">
      <XButton type="primary" @click="useTextFunction">{{
        t("use text function")
      }}</XButton>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Toast, Group, XSwitch, XButton, useToast, useLocale } from "wiux";

const toast = useToast();

export default {
  components: {
    Toast,
    Group,
    XSwitch,
    XButton,
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
    const show9 = ref(false);
    const position = ref("default");
    const showPositionValue = ref(false);

    const showPosition = (pos: string) => {
      position.value = pos;
      showPositionValue.value = true;
    };

    const onHide = () => {
      console.log("on hide");
    };

    const onChange = (val: boolean) => {
      if (val) {
        toast.show({
          text: t("placeholder"),
          onShow() {
            console.log("Plugin: I'm showing");
          },
          onHide() {
            console.log("Plugin: I'm hiding");
            show9.value = false;
          },
        });
      } else {
        toast.hide();
      }
    };

    const useTextFunction = () => {
      toast.text(t("placeholder"), "top");
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
      show9,
      position,
      showPositionValue,
      showPosition,
      onHide,
      onChange,
      useTextFunction,
    };
  },
};
</script>
