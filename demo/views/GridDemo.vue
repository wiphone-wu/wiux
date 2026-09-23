<template>
  <div>
    <div style="padding: 10px 15px; color: #999; font-size: 14px">
      {{ t("2 columns") }}
    </div>
    <Grid>
      <GridItem :label="t('Grid')" v-for="i in 2" :key="i">
        <template #icon>
          <img src="../assets/grid_icon.png" />
        </template>
      </GridItem>
    </Grid>

    <div style="padding: 10px 15px; color: #999; font-size: 14px">
      {{ t("3 columns") }}
    </div>
    <Grid :show-lr-borders="false" :show-vertical-dividers="false">
      <GridItem link="/component/cell" :label="t('Go to Cell')">
        <template #icon>
          <img src="../assets/grid_icon.png" />
        </template>
      </GridItem>
      <GridItem :link="{ path: '/component/cell' }" :label="t('Go to Cell')">
        <template #icon>
          <img src="../assets/grid_icon.png" />
        </template>
      </GridItem>
      <GridItem link="/component/cell" @on-item-click="onItemClick">
        <template #icon>
          <img src="../assets/grid_icon.png" />
        </template>
        <template #label>
          <span>{{ t("Go to Cell") }}</span>
        </template>
      </GridItem>
    </Grid>

    <div style="padding: 10px 15px; color: #999; font-size: 14px">
      {{ t("4 columns") }}
    </div>
    <Grid :show-lr-borders="false">
      <GridItem :label="t('Grid')" v-for="i in 4" :key="i">
        <template #icon>
          <img src="../assets/grid_icon.png" />
        </template>
      </GridItem>
    </Grid>

    <div style="padding: 10px 15px; color: #999; font-size: 14px">
      {{ t("Custom content") }}
    </div>
    <Grid :show-vertical-dividers="false">
      <GridItem v-for="i in 5" :key="i">
        <span class="grid-center">{{ i }}</span>
      </GridItem>
    </Grid>

    <div style="padding: 10px 15px; color: #999; font-size: 14px">
      {{ t("Custom col") }}
    </div>
    <Grid :cols="3" :show-lr-borders="false">
      <GridItem v-for="i in 6" :key="i">
        <span class="grid-center">{{ i }}</span>
      </GridItem>
    </Grid>
  </div>
</template>

<script lang="ts">
import { Grid, GridItem, useLocale } from "wiux";

export default {
  name: "GridDemo",
  components: {
    Grid,
    GridItem,
  },
  setup() {
    const { t } = useLocale();
    const onItemClick = () => {
      console.log("on item click");
    };
    return { t, onItemClick };
  },
};
</script>

<style scoped>
.grid-center {
  display: block;
  text-align: center;
  color: #666;
}
.weui-grids {
  background-color: #fff;
}
</style>
