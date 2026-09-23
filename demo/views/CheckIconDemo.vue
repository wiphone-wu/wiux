<template>
  <div>
    <div style="padding: 15px">
      <check-icon v-model:value="demo1"
        >{{ t("Do you agree?") }} ({{ demo1 }})</check-icon
      >
      <br />
      <br />
      <check-icon v-model:value="demo2" type="plain"
        >{{ t("Do you agree?") }} ({{ demo2 }})</check-icon
      >
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { CheckIcon, useLocale } from "wiux";

export default {
  name: "CheckIconDemo",
  components: {
    CheckIcon,
  },
  setup() {
    const { t } = useLocale();
    const demo1 = ref(false);
    const demo2 = ref(true);
    return {
      t,
      demo1,
      demo2,
    };
  },
};
</script>
