<template>
  <div style="padding: 15px">
    <group :title="t('Basic Usage')">
      <button-tab v-model="tabIndex1">
        <button-tab-item>{{ t("Today") }}</button-tab-item>
        <button-tab-item>{{ t("This Week") }}</button-tab-item>
        <button-tab-item>{{ t("This Month") }}</button-tab-item>
      </button-tab>
    </group>

    <divider></divider>

    <group :title="t('Custom height')">
      <button-tab v-model="tabIndex2" :height="40">
        <button-tab-item>{{ t("Today") }}</button-tab-item>
        <button-tab-item>{{ t("This Week") }}</button-tab-item>
        <button-tab-item>{{ t("This Month") }}</button-tab-item>
      </button-tab>
    </group>

    <divider></divider>

    <group :title="t('Default selected')">
      <button-tab v-model="tabIndex3">
        <button-tab-item>{{ t("Today") }}</button-tab-item>
        <button-tab-item>{{ t("This Week") }}</button-tab-item>
        <button-tab-item>{{ t("This Month") }}</button-tab-item>
      </button-tab>
    </group>

    <divider></divider>

    <group :title="t('Listen to change: change')">
      <button-tab v-model="tabIndex4" @change="onIndexChange">
        <button-tab-item>{{ t("Today") }}</button-tab-item>
        <button-tab-item>{{ t("This Week") }}</button-tab-item>
        <button-tab-item>{{ t("This Month") }}</button-tab-item>
      </button-tab>
      <div style="padding: 10px 15px; color: #999">{{ eventMsg }}</div>
    </group>

    <divider></divider>

    <group :title="t('red dot')">
      <button-tab v-model="tabIndex5">
        <button-tab-item>{{ t("Today") }}</button-tab-item>
        <button-tab-item>{{ t("This Week") }}</button-tab-item>
        <button-tab-item
          ><span class="wiux-redDot-s">{{
            t("This Month")
          }}</span></button-tab-item
        >
      </button-tab>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ButtonTab, ButtonTabItem, Group, Cell, Divider, useLocale } from "wiux";

export default defineComponent({
  components: {
    ButtonTab,
    ButtonTabItem,
    Group,
    Cell,
    Divider,
  },
  setup() {
    const { t } = useLocale();

    const tabIndex1 = ref(0);
    const tabIndex2 = ref(0);
    const tabIndex3 = ref(2);
    const tabIndex4 = ref(0);
    const tabIndex5 = ref(0);
    const tabLabels = ["Today", "This Week", "This Month"];
    const eventMsg = ref("");

    const onIndexChange = (index: number, oldIndex: number) => {
      eventMsg.value = `${t("Current value is")} ${index}`;
    };

    return {
      t,
      tabIndex1,
      tabIndex2,
      tabIndex3,
      tabIndex4,
      tabIndex5,
      tabLabels,
      eventMsg,
      onIndexChange,
    };
  },
});
</script>
