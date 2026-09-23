<template>
  <div>
    <Group :title="t('Default')">
      <XNumber :title="t('Quantity')" />
    </Group>

    <Group :title="t('Listen on-change event')">
      <XNumber
        :title="t('Quantity')"
        v-model="changeValue"
        :min="0"
        @on-change="change"
      />
    </Group>

    <Group :title="t('Set width to 100px')">
      <XNumber :title="t('Quantity')" width="100px" />
    </Group>

    <Group :title="t('Round button')">
      <XNumber
        :title="t('Quantity')"
        v-model="roundValue"
        button-style="round"
        :min="0"
        :max="5"
      />
    </Group>

    <Group :title="t('Set step to 0.5')">
      <XNumber :title="t('Quantity')" :step="0.5" />
    </Group>

    <Group :title="t('Set value to 1, min to -5, max to 8')">
      <XNumber :title="t('Quantity')" :min="-5" :max="8" :model-value="1" />
    </Group>

    <Group :title="t('Set as fillable')">
      <XNumber :title="t('Quantity')" :model-value="10" fillable />
    </Group>

    <Group :title="t('Set as readonly')">
      <XNumber :title="t('Quantity')" :model-value="3" readonly />
    </Group>

    <Group :title="t('Set align left')">
      <XNumber :title="t('Quantity')" align="left" />
    </Group>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { XNumber, Group, useLocale } from "wiux";

export default {
  name: "XNumberDemo",
  components: {
    XNumber,
    Group,
  },
  setup() {
    const { t } = useLocale();
    const changeValue = ref(0);
    const roundValue = ref(0);

    const change = (val: number) => {
      console.log("change", val);
    };

    return {
      t,
      changeValue,
      roundValue,
      change,
    };
  },
};
</script>
