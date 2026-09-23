<template>
  <div>
    <LoadMore :tip="t('Loading...')" />
    <LoadMore
      :show-loading="false"
      :tip="t('No data available')"
      background-color="#fbf9fe"
    />
    <LoadMore :show-loading="false" background-color="#fbf9fe" />
  </div>
</template>

<script lang="ts">
import { LoadMore, useLocale } from "wiux";

export default {
  components: {
    LoadMore,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
};
</script>
