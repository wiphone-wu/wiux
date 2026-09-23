<template>
  <div>
    <datetime-view
      v-model="value1"
      ref="datetimeView"
      :format="format"
    ></datetime-view>
    <p class="info">{{ t("Current value") }}: {{ value1 }}</p>
    <div style="padding: 15px">
      <x-button
        @click="changeValue('2017-11-11')"
        :disabled="format !== 'YYYY-MM-DD'"
        type="primary"
        >{{ t("Set time to") }} 2017-11-11</x-button
      >
      <x-button
        @click="changeValue('2016-08-08')"
        :disabled="format !== 'YYYY-MM-DD'"
        type="primary"
        >{{ t("Set time to") }} 2016-08-08</x-button
      >
      <x-button
        @click="toggleFormat"
        :disabled="format === 'YYYY-MM-DD HH'"
        type="primary"
        >{{ t("Toggle format") }}</x-button
      >
      <x-button @click="changeFormatAndValue" type="primary">{{
        t("Format 2019-10-23 10")
      }}</x-button>
      <x-button @click="showPopup = true" type="primary">{{
        t("Show popup with datetime-view")
      }}</x-button>
    </div>
    <popup v-model="showPopup">
      <datetime-view v-model="value2"></datetime-view>
    </popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import { DatetimeView, XButton, Popup, useLocale } from "wiux";

export default defineComponent({
  components: {
    DatetimeView,
    XButton,
    Popup,
  },
  setup() {
    const { t } = useLocale();
    const value1 = ref("2017-10-11");
    const value2 = ref("2017-10-24");
    const showPopup = ref(false);
    const format = ref("YYYY-MM-DD");
    const datetimeView = ref<any>(null);

    function toggleFormat() {
      if (format.value === "YYYY-MM-DD") {
        format.value = "YYYY-MM-DD HH:mm";
      } else {
        format.value = "YYYY-MM-DD";
      }
    }

    function changeValue(val: string) {
      value1.value = val;
      nextTick(() => {
        datetimeView.value?.render();
      });
    }

    function changeFormatAndValue() {
      format.value = "YYYY-MM-DD HH";
      nextTick(() => {
        value1.value = "2019-10-23 10";
        nextTick(() => {
          datetimeView.value?.render();
        });
      });
    }

    return {
      t,
      value1,
      value2,
      showPopup,
      format,
      datetimeView,
      toggleFormat,
      changeValue,
      changeFormatAndValue,
    };
  },
});
</script>

<style scoped>
.info {
  padding-top: 15px;
  text-align: center;
  color: #666;
}
</style>
