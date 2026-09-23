<template>
  <div>
    <group>
      <x-address
        @on-hide="logHide"
        @on-show="logShow"
        :title="title"
        v-model="value"
        :list="addressData"
        @on-shadow-change="onShadowChange"
        :placeholder="t('Please select address')"
        :inline-desc="t('placeholder')"
        :show.sync="showAddress"
      ></x-address>
      <cell :title="t('Value above')" :value="value"></cell>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { Group, XAddress, Cell, useLocale } from "wiux";
import ChinaAddressV4Data from "../../src/data/china_address_v4.json";

export default defineComponent({
  name: "XAddressDemo",
  components: {
    Group,
    XAddress,
    Cell,
  },
  setup() {
    const { t } = useLocale();
    const title = computed(() => t("Default is empty"));
    const value = ref<string[]>([]);
    const addressData = ref(ChinaAddressV4Data);
    const showAddress = ref(false);

    const onShadowChange = (ids: any[], names: any[]) => {
      console.log(ids, names);
    };

    const logHide = (str: any) => {
      console.log("on-hide", str);
    };

    const logShow = (str: any) => {
      console.log("on-show");
    };

    return {
      t,
      title,
      value,
      addressData,
      showAddress,
      onShadowChange,
      logHide,
      logShow,
    };
  },
});
</script>
