<template>
  <div>
    <group>
      <cell is-link :title="t('tabbar')" link="/component/tabbar"></cell>
    </group>
    <tabbar>
      <tabbar-item>
        <template #label>
          <span>{{ t("Wechat") }}</span>
        </template>
      </tabbar-item>
      <tabbar-item show-dot>
        <template #label>
          <span>{{ t("Message") }}</span>
        </template>
      </tabbar-item>
      <tabbar-item selected link="/component/demo">
        <template #label>
          <span>{{ t("Explore") }}</span>
        </template>
      </tabbar-item>
      <tabbar-item badge="2">
        <template #label>
          <span>{{ t("News") }}</span>
        </template>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { tabbar, tabbarItem, Group, Cell, useLocale } from "wiux";

export default defineComponent({
  components: {
    tabbar,
    tabbarItem,
    Group,
    Cell,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
});
</script>
