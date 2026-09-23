<template>
  <div>
    <br />
    <p style="text-align: center">
      <InlineLoading />
    </p>
    <br />
    <p style="text-align: center">
      <span
        style="vertical-align: middle; display: inline-block; font-size: 14px"
        >{{ t("Loading...") }}&nbsp;&nbsp;</span
      ><InlineLoading />
    </p>
    <br />
    <p style="text-align: center">
      <InlineLoading /><span
        style="vertical-align: middle; display: inline-block; font-size: 14px"
        >&nbsp;&nbsp;{{ t("Loading...") }}</span
      >
    </p>
  </div>
</template>

<script lang="ts">
import { InlineLoading, useLocale } from "wiux";

export default {
  components: {
    InlineLoading,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
};
</script>
