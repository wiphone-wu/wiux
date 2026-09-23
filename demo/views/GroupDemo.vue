<template>
  <div>
    <Group label-width="4.5em" label-margin-right="2em" label-align="right">
      <Cell title="Cell" value="value" is-link />
      <Cell title="Cell" value="value" is-link value-align="left" />
      <XInput :title="t('Reporter')" v-model="value1" />
      <XInput :placeholder="t('placeholder')">
        <template #restricted-label>
          <img
            style="display: inline-block; vertical-align: middle"
            src="../assets/cat1.jpg"
            width="24"
            height="24"
          />
        </template>
      </XInput>
      <XNumber
        :title="t('Quantity')"
        align="left"
        v-model="numberValue"
        button-style="round"
        :min="0"
        :max="5"
      />
      <Datetime
        :title="t('datetime')"
        v-model="time1"
        value-text-align="left"
      />
      <Selector
        :title="t('Category')"
        :options="categoryOptions"
        v-model="value2"
      />
      <Selector
        :title="t('Category')"
        :placeholder="t('placeholder')"
        :options="categoryOptions"
        v-model="value7"
      />
      <Selector
        :title="t('Category')"
        :options="categoryOptions"
        v-model="value8"
      />
      <XInput
        :title="t('Category')"
        :placeholder="t('Required')"
        v-model="value3"
      />
      <XInput
        :title="t('password')"
        type="password"
        :placeholder="t('Required')"
        v-model="value4"
      />
      <PopupPicker
        :title="t('Select')"
        :data="list"
        v-model="value5"
        value-text-align="left"
      />
      <PopupPicker
        :title="t('Select')"
        :placeholder="t('Required')"
        :data="list"
        v-model="value6"
        value-text-align="left"
      />
      <XAddress
        :title="t('Address')"
        v-model="addressValue"
        raw-value
        :list="addressData"
        value-text-align="left"
      />
      <XTextarea
        :title="t('Detailed')"
        :placeholder="t('Please provide the detailed info.')"
        :show-counter="false"
        :rows="3"
      />
      <XTextarea
        :placeholder="t('Please provide the detailed info.')"
        :show-counter="false"
        :rows="3"
      >
        <template #restricted-label>
          <img
            style="display: inline-block; vertical-align: middle"
            src="../assets/cat2.jpg"
            width="24"
            height="24"
          />
        </template>
      </XTextarea>
    </Group>
    <br />
    <Group>
      <template #title>
        <GroupTitle
          >{{ t("left")
          }}<span style="float: right">{{ t("right") }}</span></GroupTitle
        >
      </template>
      <Cell title="cell" />
    </Group>
    <br />
    <Group
      :title="t('label-align')"
      label-width="5.5em"
      label-margin-right="2em"
      label-align="justify"
    >
      <Cell :title="t('Title')" value="value" is-link />
      <Cell
        :title="t('Type something')"
        value="value"
        is-link
        value-align="left"
      />
      <XInput :title="t('Reporter')" v-model="value1" />
      <XNumber
        :title="t('Quantity')"
        align="left"
        v-model="numberValue"
        button-style="round"
        :min="0"
        :max="5"
      />
      <Datetime
        :title="t('datetime')"
        v-model="time1"
        value-text-align="left"
      />
      <Selector
        :title="t('Category')"
        :options="categoryOptions"
        v-model="value2"
      />
      <PopupPicker
        :title="t('Select')"
        :data="list"
        v-model="value5"
        value-text-align="left"
      />
      <XAddress
        :title="t('Address')"
        v-model="addressValue"
        raw-value
        :list="addressData"
        value-text-align="left"
        label-align="justify"
      />
      <XSwitch :title="t('Select')" />
      <XTextarea
        :title="t('Detailed')"
        :placeholder="t('Please provide the detailed info.')"
        :show-counter="false"
        :rows="3"
      />
    </Group>
    <br />
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import {
  Group,
  GroupTitle,
  Cell,
  XInput,
  Selector,
  PopupPicker,
  Datetime,
  XNumber,
  XAddress,
  XTextarea,
  XSwitch,
  useLocale,
} from "wiux";
import addressData from "../../src/data/china_address_v4.json";

export default {
  name: "GroupDemo",
  components: {
    Group,
    GroupTitle,
    Cell,
    XInput,
    Selector,
    PopupPicker,
    Datetime,
    XNumber,
    XAddress,
    XTextarea,
    XSwitch,
  },
  setup() {
    const { t } = useLocale();
    const value1 = computed(() => t("zhangsan"));
    const value2 = computed(() => t("Process technology"));
    const categoryOptions = computed(() => [
      t("Process technology"),
      t("Other"),
    ]);
    const value3 = ref("");
    const value4 = ref("");
    const value5 = ref(["A"]);
    const value6 = ref([]);
    const value7 = ref("");
    const value8 = ref("");
    const time1 = ref("2017-06-01");
    const numberValue = ref(0);
    const list = [["A", "B", "C"]];
    const addressValue = ref(["广东省", "深圳市", "南山区"]);

    return {
      t,
      value1,
      value2,
      categoryOptions,
      value3,
      value4,
      value5,
      value6,
      value7,
      value8,
      time1,
      numberValue,
      list,
      addressData,
      addressValue,
    };
  },
};
</script>
