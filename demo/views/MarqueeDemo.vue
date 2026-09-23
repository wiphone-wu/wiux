<template>
  <div>
    <divider>{{ t("Default") }}</divider>
    <marquee>
      <marquee-item
        v-for="i in 5"
        :key="i"
        @click="onClick(i)"
        class="align-middle"
        >hello world {{ i }}</marquee-item
      >
    </marquee>
    <br />
    <divider>{{ t("Use in Cell") }}</divider>
    <group>
      <cell :title="t('Notice')">
        <marquee>
          <marquee-item v-for="i in 5" :key="i" @click="onClick(i)"
            >{{ t("JavaScript is the best language") }} {{ i }}</marquee-item
          >
        </marquee>
      </cell>
    </group>
    <br />
    <divider>{{ t("Async data") }}</divider>
    <marquee>
      <marquee-item
        v-for="i in asyncCount"
        :key="i"
        @click="onClick(i)"
        class="align-middle"
        >hello world {{ i }}</marquee-item
      >
    </marquee>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Group, Cell, Marquee, MarqueeItem, Divider, useLocale } from "wiux";

export default defineComponent({
  components: {
    Group,
    Cell,
    Marquee,
    MarqueeItem,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    const asyncCount = ref(0);

    const onClick = (i: number) => {
      console.log(i);
    };

    onMounted(() => {
      setTimeout(() => {
        asyncCount.value = 5;
      }, 1000);
    });

    return {
      t,
      asyncCount,
      onClick,
    };
  },
});
</script>

<style scoped>
.align-middle {
  text-align: center;
}
</style>
