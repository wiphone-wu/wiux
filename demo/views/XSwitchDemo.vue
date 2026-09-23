<template>
  <div>
    <Group :title="t('Value map')">
      <XSwitch
        :title="t('Default true')"
        :value-map="['0', '1']"
        v-model="stringValue"
      />
      <Cell
        :title="t('value')"
        :value="(typeof stringValue + ' ' + stringValue)"
      />
    </Group>
    <Group :title="t('Basic Usage')">
      <XSwitch :title="t('Default false')" />
      <XSwitch
        :title="t('Default true')"
        :inline-desc="value1 + ''"
        v-model="value1"
      />
    </Group>
    <Group :title="t('disabled')">
      <XSwitch :title="t('Default false')" disabled />
      <XSwitch :title="t('Default true')" :value="true" disabled />
    </Group>
    <Group :title="t('prevent default')">
      <XSwitch
        :title="t('Default false')"
        prevent-default
        v-model="value2"
        @on-click="onClick"
      />
    </Group>
    <Group :title="t('html title')">
      <XSwitch
        disabled
        :title="
          '<span style=&quot;color:red&quot;>' + t('I am red') + '</span>'
        "
      />
    </Group>
    <Loading :show="showLoading" :text="t('in processing')" />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { XSwitch, Group, Cell, Loading, useLocale } from "wiux";

export default {
  name: "XSwitchDemo",
  components: {
    XSwitch,
    Group,
    Cell,
    Loading,
  },
  setup() {
    const { t } = useLocale();
    const value1 = ref(true);
    const value2 = ref(false);
    const stringValue = ref("0");
    const showLoading = ref(false);

    const onClick = (newVal: boolean, oldVal: boolean) => {
      console.log(newVal, oldVal);
      showLoading.value = true;
      setTimeout(() => {
        showLoading.value = false;
        value2.value = newVal;
      }, 1000);
    };

    return {
      t,
      value1,
      value2,
      stringValue,
      showLoading,
      onClick,
    };
  },
};
</script>
