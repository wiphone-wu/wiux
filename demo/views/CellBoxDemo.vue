<template>
  <div>
    <group>
      <cell-box is-link link="/demo/CheckIconDemo">{{
        t("Go to Homepage")
      }}</cell-box>
      <cell-box>{{ t("Default") }}</cell-box>
    </group>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Group, CellBox, useLocale } from "wiux";

export default defineComponent({
  components: {
    Group,
    CellBox,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
});
</script>
