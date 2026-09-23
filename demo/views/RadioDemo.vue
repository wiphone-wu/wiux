<template>
  <div>
    <Group :title="t('default')">
      <Radio :options="radio001" @on-change="change" />
    </Group>

    <Group :title="t('Default value China(disabled)')">
      <Radio :options="radio001" model-value="China" disabled />
    </Group>

    <Group :title="fillModeTitle">
      <Radio
        :selected-label-style="{ color: '#FF9900' }"
        fill-mode
        :options="radio001"
        v-model="radio001Value"
        @on-change="change"
      />
    </Group>

    <Group :title="t('fill mode with custom placeholder and label')">
      <Radio
        fill-mode
        fill-label="Other"
        fill-placeholder="填写其他的哦"
        :options="radio001"
        @on-change="change"
      />
    </Group>

    <Group :title="t('object options')">
      <Radio
        fill-mode
        fill-label="Other"
        fill-placeholder="other"
        :options="radio003"
        @on-change="change"
      />
    </Group>

    <Group :title="t('Slot: each-item')">
      <Radio :options="radio001">
        <template #each-item="{ icon, label, index, selected }">
          <p>
            V{{ index + 1 }}
            <img
              :src="'../assets/cat' + (index + 1) + '.jpg'"
              class="wiux-radio-icon"
            />
            {{ label }}
          </p>
        </template>
      </Radio>
    </Group>
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { Radio, Group, useLocale } from "wiux";

export default {
  name: "RadioDemo",
  components: {
    Radio,
    Group,
  },
  setup() {
    const { t } = useLocale();
    const radio001 = ["China", "Japan"];
    const radio001Value = ref("China");
    const radio003 = [
      {
        icon: "../assets/cat1.jpg",
        key: "001",
        value: "radio001",
      },
      {
        icon: "../assets/cat2.jpg",
        key: "002",
        value: "radio002",
      },
    ];

    const fillModeTitle = computed(
      () => t("fill mode value is") + " " + radio001Value.value,
    );

    const change = (value: string, label: string) => {
      console.log("change:", value, label);
    };

    return {
      t,
      radio001,
      radio001Value,
      radio003,
      fillModeTitle,
      change,
    };
  },
};
</script>
