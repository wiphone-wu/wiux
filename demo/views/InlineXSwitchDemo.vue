<template>
  <div>
    <div style="text-align: center; margin-top: 15px">
      <InlineXSwitch v-model="value" />
    </div>
    <Group>
      <XSwitch :title="t('Switch')" v-model="value" />
    </Group>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { InlineXSwitch, XSwitch, Group, useLocale } from "wiux";

export default {
  components: {
    InlineXSwitch,
    XSwitch,
    Group,
  },
  setup() {
    const { t } = useLocale();
    const value = ref(false);
    return { t, value };
  },
};
</script>
