<template>
  <div style="text-align: center">
    <popover
      placement="top"
      style="margin: 20px"
      @on-show="onShow"
      @on-hide="onHide"
    >
      <template #content>
        <div class="popover-demo-content">
          {{ t("Demo") }}
        </div>
      </template>
      <button class="btn btn-default">{{ t("Popover on top") }}</button>
    </popover>

    <popover placement="bottom" style="margin: 20px">
      <template #content>
        <div class="popover-demo-content">
          {{ t("Demo") }}
        </div>
      </template>
      <button class="btn btn-default">{{ t("Popover on bottom") }}</button>
    </popover>

    <popover placement="left" style="margin: 20px">
      <template #content>
        <div class="popover-demo-content">
          {{ t("Demo") }}
        </div>
      </template>
      <button class="btn btn-default">{{ t("Popover on left") }}</button>
    </popover>

    <popover placement="right" style="margin: 20px">
      <template #content>
        <div class="popover-demo-content">
          {{ t("Demo") }}
        </div>
      </template>
      <button class="btn btn-default">{{ t("Popover on right") }}</button>
    </popover>

    <div
      style="position: fixed; bottom: 100px; text-align: center; width: 100%"
    >
      <p>{{ t("Attach to fixed element") }}</p>
      <popover placement="right" style="margin: 20px">
        <template #content>
          <div class="popover-demo-content">
            {{ t("Demo") }}
          </div>
        </template>
        <button class="btn btn-default">{{ t("Popover on right") }}</button>
      </popover>
    </div>
    <p style="padding-top: 600px">
      <popover
        placement="top"
        style="margin: 20px"
        @on-show="onShow"
        @on-hide="onHide"
      >
        <template #content>
          <div class="popover-demo-content">
            {{ t("Demo") }}
          </div>
        </template>
        <button class="btn btn-default">{{ t("Scroll bar") }}</button>
      </popover>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Popover, useLocale } from "wiux";

export default defineComponent({
  components: {
    Popover,
  },
  setup() {
    const { t } = useLocale();
    function onShow() {
      console.log("on show");
    }
    function onHide() {
      console.log("on hide");
    }
    return {
      t,
      onShow,
      onHide,
    };
  },
});
</script>

<style scoped>
.popover-demo-content {
  padding: 5px 10px;
}
</style>
