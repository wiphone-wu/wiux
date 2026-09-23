<template>
  <div>
    <divider>{{ t("I have bottom line") }}</divider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Divider, useLocale } from "wiux";

export default defineComponent({
  components: {
    Divider,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
});
</script>
