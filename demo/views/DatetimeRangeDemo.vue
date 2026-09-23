<template>
  <div>
    <group :title="value[0] + ' ' + value[1] + ':' + value[2]">
      <datetime-range
        :title="t('Choose')"
        start-date="2017-01-01"
        end-date="2017-02-02"
        format="YYYY年MM月DD日"
        v-model="value"
        @on-change="onChange"
      ></datetime-range>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Group, DatetimeRange, useLocale } from "wiux";

export default defineComponent({
  components: {
    Group,
    DatetimeRange,
  },
  setup() {
    const { t } = useLocale();
    const value = ref(["2017-01-15", "03", "05"]);

    function onChange(val: any) {
      console.log("change", val);
    }

    return {
      t,
      value,
      onChange,
    };
  },
});
</script>
