<template>
  <div>
    <group>
      <cell :title="t('Total')" value="￥1024"></cell>
      <cell-form-preview :list="list"></cell-form-preview>
    </group>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { Group, Cell, CellFormPreview, useLocale } from "wiux";

export default {
  name: "CellFormPreviewDemo",
  components: {
    Group,
    Cell,
    CellFormPreview,
  },
  setup() {
    const { t } = useLocale();

    const list = computed(() => [
      {
        label: t("Apple"),
        value: "3.29",
      },
      {
        label: t("Banana"),
        value: "1.04",
      },
      {
        label: t("Fish"),
        value: "8.00",
      },
    ]);

    return {
      t,
      list,
    };
  },
};
</script>
