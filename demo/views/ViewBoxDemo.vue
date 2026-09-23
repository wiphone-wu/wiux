<template>
  <div>
    <divider>{{ t("ViewBox basic usage") }}</divider>
    <div style="height: 600px; overflow: hidden">
      <view-box
        ref="viewBoxRef"
        body-padding-top="0px"
        body-padding-bottom="0px"
      >
        <div style="padding: 15px">
          <p v-for="i in 100" :key="i">
            {{ t("This is line") + " " + i + " " + t("for scroll testing") }}
          </p>
        </div>
      </view-box>
    </div>
    <div style="padding: 15px">
      <x-button type="primary" @click="scrollToTop">{{
        t("Scroll to top")
      }}</x-button>
      <x-button type="warn" @click="scrollToBottom">{{
        t("Scroll to bottom")
      }}</x-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ViewBox, Divider, XButton, useLocale } from "wiux";

export default defineComponent({
  components: {
    ViewBox,
    Divider,
    XButton,
  },
  setup() {
    const { t } = useLocale();
    const viewBoxRef = ref<any>(null);

    const scrollToTop = () => {
      viewBoxRef.value?.scrollTo(0);
    };

    const scrollToBottom = () => {
      const body = viewBoxRef.value?.getScrollBody();
      if (body) {
        viewBoxRef.value.scrollTo(body.scrollHeight);
      }
    };

    return {
      t,
      viewBoxRef,
      scrollToTop,
      scrollToBottom,
    };
  },
});
</script>
