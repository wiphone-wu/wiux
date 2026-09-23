<template>
  <div>
    <group>
      <cell
        v-for="(type, index) in types"
        :title="type"
        :key="type"
        :inline-desc="index === 3 ? t('size=40px') : ''"
      >
        <spinner :type="type" :size="index === 3 ? '40px' : ''"></spinner>
      </cell>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Spinner, Group, Cell, useLocale } from "wiux";

export default defineComponent({
  components: {
    Spinner,
    Group,
    Cell,
  },
  setup() {
    const { t } = useLocale();
    const types = ref([
      "android",
      "ios",
      "ios-small",
      "bubbles",
      "circles",
      "crescent",
      "dots",
      "lines",
      "ripple",
      "spiral",
    ]);

    return {
      t,
      types,
    };
  },
});
</script>
