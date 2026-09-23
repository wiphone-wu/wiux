<template>
  <div>
    <group>
      <cell is-link :title="t('Simple')" link="/component/tabbar-simple"></cell>
      <cell
        is-link
        :title="t('Switch icons')"
        link="/component/tabbar-icon"
      ></cell>
    </group>
    <tabbar>
      <tabbar-item>
        <template #icon>
          <img src="../assets/icon_nav_button.png" />
        </template>
        <template #label>
          <span>{{ t("Wechat") }}</span>
        </template>
      </tabbar-item>
      <tabbar-item show-dot>
        <template #icon>
          <img src="../assets/icon_nav_msg.png" />
        </template>
        <template #label>
          <span>{{ t("Message") }}</span>
        </template>
      </tabbar-item>
      <tabbar-item selected link="/component/demo">
        <template #icon>
          <img src="../assets/icon_nav_article.png" />
        </template>
        <template #label>
          <span>{{ t("Explore") }}</span>
        </template>
      </tabbar-item>
      <tabbar-item badge="2">
        <template #icon>
          <img src="../assets/icon_nav_cell.png" />
        </template>
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
