<template>
  <div>
    <divider>{{ t("default") }}</divider>
    <div style="padding: 10px">
      <XButton>{{ t("submit") }}</XButton>
      <XButton type="primary" style="display: block; margin-top: 10px">{{
        t("primary")
      }}</XButton>
      <XButton type="warn" style="display: block; margin-top: 10px">{{
        t("Delete")
      }}</XButton>

      <divider>{{ t("link") }}</divider>
      <XButton type="primary" link="/">{{ t("Go to demo list") }}</XButton>
      <XButton
        type="default"
        link="BACK"
        style="display: block; margin-top: 10px"
        >{{ t("Back") }}</XButton
      >

      <divider>{{ t("action type") }}</divider>
      <XButton type="primary" action-type="button">{{ t("submit") }}</XButton>
      <XButton
        type="warn"
        action-type="reset"
        style="display: block; margin-top: 10px"
        >{{ t("reset") }}</XButton
      >

      <divider>{{ t("loading") }}</divider>
      <XButton type="default" show-loading>{{ t("submit") }}</XButton>
      <XButton
        type="primary"
        show-loading
        style="display: block; margin-top: 10px"
        >{{ t("submit") }}</XButton
      >
      <XButton
        type="warn"
        show-loading
        style="display: block; margin-top: 10px"
        >{{ t("submit") }}</XButton
      >

      <divider>{{ t("mini") }}</divider>
      <XButton mini>{{ t("submit") }}</XButton>
      <XButton mini type="primary">{{ t("primary") }}</XButton>
      <XButton mini type="warn">{{ t("Delete") }}</XButton>
      <br /><br />
      <XButton mini plain>{{ t("submit") }}</XButton>
      <XButton mini plain type="primary">{{ t("primary") }}</XButton>
      <XButton mini plain type="warn">{{ t("primary") }}</XButton>

      <divider>{{ t("plain") }}</divider>
      <XButton plain>{{ t("submit") }}</XButton>
      <XButton plain type="primary" style="display: block; margin-top: 10px">{{
        t("primary")
      }}</XButton>
      <XButton plain type="warn" style="display: block; margin-top: 10px">{{
        t("warn")
      }}</XButton>

      <divider>{{ t("you can customize styles") }}</divider>
      <XButton plain type="primary" style="border-radius: 99px">{{
        t("primary")
      }}</XButton>
      <XButton
        plain
        type="primary"
        class="custom-primary-red"
        style="display: block; margin-top: 10px"
        >{{ t("primary") }}</XButton
      >

      <divider>{{ t("disabled") }}</divider>
      <XButton disabled>{{ t("disable submit") }}</XButton>
      <XButton
        type="primary"
        disabled
        style="display: block; margin-top: 10px"
        >{{ t("disable primary") }}</XButton
      >
      <XButton type="warn" disabled style="display: block; margin-top: 10px">{{
        t("disable Delete")
      }}</XButton>
      <br />
      <XButton mini disabled>{{ t("disable mini submit") }}</XButton>
      <XButton mini type="primary" disabled>{{
        t("disable mini primary")
      }}</XButton>
      <XButton mini type="warn" disabled>{{
        t("disable mini Delete")
      }}</XButton>
      <br /><br />
      <XButton plain disabled>{{ t("disable plain") }}</XButton>
      <XButton
        plain
        type="primary"
        disabled
        style="display: block; margin-top: 10px"
        >{{ t("disable plain primary") }}</XButton
      >

      <divider>{{ t("use :text and :disabled") }}</divider>
      <XButton
        :text="submit001"
        :disabled="disable001"
        @click="processButton001"
        type="primary"
      />

      <divider>{{ t("combined with flexBox") }}</divider>
      <FlexBox>
        <FlexBoxItem>
          <XButton type="primary">{{ t("primary") }}</XButton>
        </FlexBoxItem>
        <FlexBoxItem>
          <XButton type="warn">{{ t("Delete") }}</XButton>
        </FlexBoxItem>
      </FlexBox>
      <divider>{{ t("combined with flexBox") }}</divider>
      <FlexBox>
        <FlexBoxItem>
          <XButton type="default">{{ t("default") }}</XButton>
        </FlexBoxItem>
        <FlexBoxItem>
          <XButton type="primary">{{ t("primary") }}</XButton>
        </FlexBoxItem>
        <FlexBoxItem>
          <XButton type="warn">{{ t("Delete") }}</XButton>
        </FlexBoxItem>
      </FlexBox>
    </div>

    <divider>{{ t("iOS Gradients(v2.7.4)") }}</divider>
    <div style="padding: 10px">
      <XButton :gradients="['#1D62F0', '#19D5FD']">{{
        t("iOS Gradients")
      }}</XButton>
      <XButton
        :gradients="['#A644FF', '#FC5BC4']"
        style="display: block; margin-top: 10px"
        >{{ t("iOS Gradients") }}</XButton
      >
      <XButton
        :gradients="['#FF2719', '#FF61AD']"
        style="display: block; margin-top: 10px"
        >{{ t("iOS Gradients") }}</XButton
      >
      <XButton
        :gradients="['#6F1BFE', '#9479DF']"
        style="display: block; margin-top: 10px"
        >{{ t("iOS Gradients") }}</XButton
      >
      <XButton
        :gradients="['#FF5E3A', '#FF9500']"
        style="display: block; margin-top: 10px"
        >{{ t("iOS Gradients") }}</XButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import { XButton, FlexBox, FlexBoxItem, Divider, useLocale } from "wiux";

export default {
  name: "XButtonDemo",
  components: {
    XButton,
    FlexBox,
    FlexBoxItem,
    Divider,
  },
  setup() {
    const { t, locale } = useLocale();
    const submit001 = ref(t("Click me"));
    const disable001 = ref(false);

    const processButton001 = () => {
      submit001.value = t("processing");
      disable001.value = true;
    };

    watch(locale, () => {
      submit001.value = disable001.value ? t("processing") : t("Click me");
    });

    return {
      t,
      submit001,
      disable001,
      processButton001,
    };
  },
};
</script>

<style lang="less">
.custom-primary-red {
  border-radius: 99px !important;
  border-color: #ce3c39 !important;
  color: #ce3c39 !important;
  &:active {
    border-color: rgba(206, 60, 57, 0.6) !important;
    color: rgba(206, 60, 57, 0.6) !important;
    background-color: transparent;
  }
}
</style>
