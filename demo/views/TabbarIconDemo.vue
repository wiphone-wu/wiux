<template>
  <div>
    <group>
      <cell is-link :title="t('tabbar')" link="/component/tabbar"></cell>
    </group>
    <tabbar @change="onIndexChange">
      <tabbar-item>
        <template #icon>
          <img src="../assets/icon_nav_button.png" />
        </template>
        <template #icon-active>
          <img src="../assets/icon_nav_msg.png" />
        </template>
        <template #label>
          <span>{{ t("one") }}</span>
        </template>
      </tabbar-item>
      <tabbar-item>
        <template #icon>
          <img src="../assets/icon_nav_article.png" />
        </template>
        <template #icon-active>
          <img src="../assets/icon_nav_cell.png" />
        </template>
        <template #label>
          <span>{{ t("two") }}</span>
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
    function onIndexChange(newIndex: number, oldIndex: number) {
      console.log(newIndex, oldIndex);
    }
    return {
      t,
      onIndexChange,
    };
  },
});
</script>
