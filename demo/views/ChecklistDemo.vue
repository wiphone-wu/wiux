<template>
  <div>
    <checklist
      :title="t('Basic Usage')"
      :label-position="labelPosition"
      required
      :options="commonList"
      v-model="checklist001"
      @on-change="change"
    ></checklist>
    <div style="padding: 15px">
      <x-button
        @click="labelPosition = labelPosition === 'left' ? '' : 'left'"
        type="primary"
        >{{ t("Switch the position of labels") }}</x-button
      >
      <x-button @click="selectFirst" type="primary">{{
        t("Select first option")
      }}</x-button>
      <x-button @click="selectFirstTwo" type="primary">{{
        t("Select first two")
      }}</x-button>
      <x-button @click="selectLeft" type="primary">{{
        t("Select the remaining options")
      }}</x-button>
    </div>

    <checklist
      :title="t('Preselect China and Japan (disabled)')"
      disabled
      label-position="left"
      :options="commonList"
      v-model="checklist002"
      @on-change="change"
    ></checklist>

    <checklist
      :title="t('Set max=2')"
      :options="commonList"
      v-model="checklist003"
      :max="2"
      @on-change="change"
    ></checklist>

    <checklist
      :title="t('Set max=1 (radio mode)')"
      :options="commonList"
      v-model="radioValue"
      :max="1"
      @on-change="change"
    ></checklist>

    <checklist
      :title="t('Set random order')"
      random-order
      :options="checklist005"
      v-model="checklist005Value"
      @on-change="change"
    ></checklist>

    <checklist
      ref="demoObject"
      :title="t('Option Array with key and value (key must be string)')"
      :options="objectList"
      v-model="objectListValue"
      @on-change="change"
    ></checklist>
    <group>
      <cell-box>{{ fullValues }}</cell-box>
    </group>
    <div style="padding: 15px">
      <x-button type="primary" @click="getFull">getFullValue()</x-button>
    </div>

    <checklist
      :title="t('Object with inlineDesc property')"
      :options="inlineDescList"
      v-model="inlineDescListValue"
      @on-change="change"
    ></checklist>

    <checklist
      :title="t('Async list')"
      :max="3"
      :options="asyncList"
      v-model="asyncListValue"
      @on-change="change"
    ></checklist>

    <divider>{{ t("Reference") }}</divider>
    <group :title="t('See also')">
      <cell title="Checker" is-link link="/component/checker"></cell>
    </group>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import {
  Group,
  CellBox,
  Checklist,
  Cell,
  Divider,
  XButton,
  useLocale,
} from "wiux";

export default {
  name: "ChecklistDemo",
  components: {
    Group,
    Checklist,
    Cell,
    Divider,
    XButton,
    CellBox,
  },
  setup() {
    const { t } = useLocale();

    const fullValues = ref<any[]>([]);
    const labelPosition = ref("");
    const commonList = ["China", "Japan", "America"];
    const checklist001 = ref<string[]>([]);
    const checklist002 = ref(["China", "Japan"]);
    const checklist003 = ref(["China", "Japan"]);
    const checklist005 = ["01", "02", "03"];
    const checklist005Value = ref<string[]>([]);
    const objectList = [
      { key: "1", value: "001 value" },
      { key: "2", value: "002 value" },
      { key: "3", value: "003 value" },
    ];
    const objectListValue = ref(["1", "2"]);
    const inlineDescList = [
      {
        key: "1",
        value: "Tiger is good",
        inlineDesc: "Tiger is the king of mountain",
      },
      {
        key: "2",
        value: "Lion is better",
        inlineDesc: "Lion is the king of woods",
      },
      { key: "3", value: "Camel is best, no inline-desc" },
    ];
    const inlineDescListValue = ref([1]);
    const asyncList = ref<string[]>([]);
    const asyncListValue = ref<string[]>([]);
    const radioValue = ref(["China"]);
    const demoObject = ref<any>(null);

    onMounted(() => {
      setTimeout(() => {
        asyncList.value = ["A", "B", "C", "D"];
      }, 3000);
    });

    const change = (val: any, label: any) => {
      console.log("change", val, label);
    };

    const selectFirst = () => {
      checklist001.value = ["China"];
    };

    const selectFirstTwo = () => {
      checklist001.value = ["China", "Japan"];
    };

    const selectLeft = () => {
      const left = commonList.filter(
        (item) => !checklist001.value.includes(item),
      );
      checklist001.value = left;
    };

    const getFull = () => {
      if (demoObject.value) {
        fullValues.value = demoObject.value.getFullValue();
      }
    };

    return {
      t,
      fullValues,
      labelPosition,
      commonList,
      checklist001,
      checklist002,
      checklist003,
      checklist005,
      checklist005Value,
      objectList,
      objectListValue,
      inlineDescList,
      inlineDescListValue,
      asyncList,
      asyncListValue,
      radioValue,
      demoObject,
      change,
      selectFirst,
      selectFirstTwo,
      selectLeft,
      getFull,
    };
  },
};
</script>

<style scoped>
.error {
  padding-left: 15px;
  line-height: 28px;
  color: #888;
  font-size: 12px;
}
</style>
