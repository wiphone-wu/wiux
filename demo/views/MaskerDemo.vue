<template>
  <div>
    <div
      style="margin: 10px; overflow: hidden"
      v-for="(item, index) in list"
      :key="index"
    >
      <masker style="border-radius: 2px">
        <div
          class="m-img"
          :style="{ backgroundImage: 'url(' + item.img + ')' }"
        ></div>
        <template #content>
          <div class="m-title">
            {{ item.title }}
            <br />
            <span class="m-time">2026-09-18</span>
          </div>
        </template>
      </masker>
    </div>
    <div style="margin: 10px; overflow: hidden">
      <masker style="border-radius: 2px" color="F9C90C" :opacity="0.8">
        <div
          class="m-img"
          style="background-image: url(../assets/cat1.jpg)"
        ></div>
        <template #content>
          <div class="m-title">
            Wiux
            <br />
            <span class="m-time">2026-09-18</span>
          </div>
        </template>
      </masker>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { Masker, useLocale } from "wiux";

export default defineComponent({
  components: {
    Masker,
  },
  setup() {
    const { t } = useLocale();

    const list = computed(() => [
      {
        title: t("long long content"),
        img: "../assets/cat1.jpg",
      },
      {
        title: t("long long content"),
        img: "../assets/cat2.jpg",
      },
      {
        title: t("long long content"),
        img: "../assets/cat3.jpg",
      },
    ]);

    return {
      list,
    };
  },
});
</script>

<style lang="less">
.m-img {
  padding-bottom: 33%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}

.m-title {
  color: #fff;
  text-align: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  font-size: 16px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}

.m-time {
  font-size: 12px;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
  display: inline-block;
  margin-top: 5px;
}
</style>
