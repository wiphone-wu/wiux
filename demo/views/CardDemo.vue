<template>
  <div>
    <divider>{{ t("Simple card with header and content") }}</divider>
    <card :header="{ title: t('My wallet') }">
      <template #content>
        <div class="card-demo-flex card-demo-content01">
          <div class="wiux-1px-r">
            <span>1130</span>
            <br />
            {{ t("JD Point") }}
          </div>
          <div class="wiux-1px-r">
            <span>15</span>
            <br />
            {{ t("JD Coupon") }}
          </div>
          <div class="wiux-1px-r">
            <span>0</span>
            <br />
            {{ t("JD Gift card") }}
          </div>
          <div>
            <span>88</span>
            <br />
            {{ t("7 days overdue") }}
          </div>
        </div>
      </template>
    </card>

    <br />
    <divider>{{ t("With footer") }}</divider>
    <card
      :header="{ title: t('Product details') }"
      :footer="{ title: t('More'), link: '/component/panel' }"
    >
      <template #content>
        <p class="card-padding">{{ t("Custom content") }}</p>
      </template>
    </card>

    <br />
    <divider>{{ t("Use header slot and content slot") }}</divider>
    <card>
      <template #header>
        <img src="../assets/vue1.jpg" style="width: 100%; display: block" />
      </template>
      <template #content>
        <div class="card-padding">
          <p style="color: #999; font-size: 12px">
            {{ t("Posted on January 21, 2027") }}
          </p>
          <p style="font-size: 14px; line-height: 1.2">
            {{ t("Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content") }}
          </p>
        </div>
      </template>
    </card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Card, Divider, useLocale } from "wiux";

export default defineComponent({
  components: {
    Card,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
});
</script>

<style scoped lang="less">
@import "../../src/styles/1px.less";

.card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  padding: 10px 0;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.card-demo-flex span {
  color: #f74c31;
}
</style>
