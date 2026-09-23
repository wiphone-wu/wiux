<template>
  <div>
    <popup-header
      :left-text="t('Cancel')"
      :right-text="t('Confirm')"
      :title="t('Please select bank card')"
    ></popup-header>
    <group>
      <x-switch v-model="show1" :title="t('Use in Popup')"></x-switch>
    </group>
    <div v-transfer-dom>
      <popup v-model="show1">
        <popup-header
          :left-text="t('Cancel')"
          :right-text="t('Confirm')"
          :title="t('Please select bank card')"
          :show-bottom-border="false"
          @on-click-left="show1 = false"
          @on-click-right="show1 = false"
        ></popup-header>
        <group gutter="0">
          <radio :options="bankOptions"></radio>
        </group>
      </popup>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { PopupHeader, Popup, Group, XSwitch, Radio, useLocale } from "wiux";
import TransferDom from "../../src/directives/transfer-dom";

export default defineComponent({
  components: {
    PopupHeader,
    Popup,
    Group,
    XSwitch,
    Radio,
  },
  directives: {
    TransferDom,
  },
  setup() {
    const { t } = useLocale();
    const show1 = ref(false);

    const bankOptions = computed(() => [
      t("Card 1"),
      t("Card 2"),
      t("Card 3"),
      t("Card 4"),
    ]);

    return {
      t,
      show1,
      bankOptions,
    };
  },
});
</script>
