<template>
  <div>
    <group :title="t('Single column')" label-width="5em">
      <popup-picker
        :title="t('Phone')"
        :data="list1"
        v-model="value1"
        @on-show="onShow"
        @on-hide="onHide"
        @on-change="onChange"
        :placeholder="t('Please select')"
      ></popup-picker>
      <popup-picker
        :popup-title="t('Please select')"
        :title="t('Phone model')"
        :data="list1"
        v-model="value1_1"
        @on-show="onShow"
        @on-hide="onHide"
        @on-change="onChange"
        :placeholder="t('Please select')"
      >
        <template #title="{ labelClass, labelStyle }">
          <span :class="labelClass" :style="labelStyle" style="height: 24px">
            <span
              class="demo-icon demo-icon-big"
              style="font-size: 20px; vertical-align: middle"
              >&#xe61b;</span
            >
            <span style="vertical-align: middle">{{ t("Phone") }}</span>
          </span>
        </template>
      </popup-picker>
      <datetime :title="t('Datetime')" v-model="date111"></datetime>
    </group>
    <br />
    <div class="picker-buttons">
      <x-button type="primary" @click="value1 = []">{{
        t("Clear value")
      }}</x-button>
      <x-button type="primary" @click="changeList10">{{
        t("Reassign list")
      }}</x-button>
      <x-button type="primary" @click="changeList11">{{
        t("Push to change list")
      }}</x-button>
    </div>
    <group :title="t('Double columns')">
      <popup-picker
        :title="t('Detailed model')"
        :data="list2"
        v-model="value2"
      ></popup-picker>
    </group>
    <br />

    <group :title="t('Chained columns')">
      <popup-picker
        :title="t('Chained display value')"
        :data="list3"
        :columns="3"
        v-model="value3"
        ref="picker3"
      ></popup-picker>
      <cell :title="t('Get text for value')" :value="picker3Name"></cell>
      <popup-picker
        :title="t('Chained display text')"
        :data="list3"
        :columns="3"
        v-model="value4"
        show-name
      ></popup-picker>
    </group>

    <br />
    <div class="picker-buttons">
      <x-button type="primary" @click="changeList21">{{
        t("Push to change list")
      }}</x-button>
    </div>

    <br />
    <divider>{{ t("Control the visibility of popup-picker") }}</divider>
    <div style="margin: 0 15px">
      <x-button @click="showPopupPicker = true" type="primary"
        >{{ t("Show PopupPicker. value: ") }} {{ value5 }}</x-button
      >
    </div>
    <group>
      <popup-picker
        :show.sync="showPopupPicker"
        :show-cell="false"
        title="TEST"
        :data="[['1', '2', '3', '4', '5']]"
        v-model="value5"
      ></popup-picker>
    </group>

    <br />
    <group :title="t('Hide without affecting other popup-picker masks')">
      <x-switch :title="t('Hide popup-picker')" v-model="switch6"></x-switch>
      <popup-picker
        v-if="!switch6"
        :title="t('Display value')"
        :data="[t('I will not affect the mask layer').split('')]"
        v-model="value6"
      ></popup-picker>
    </group>

    <br />
    <group :title="t('Display format')">
      <popup-picker
        :title="t('Time')"
        :inline-desc="inlineDesc"
        v-model="formatDemoValue"
        :data="[
          ['01', '02', '03'],
          ['11', '12', '13'],
        ]"
        :display-format="format"
      ></popup-picker>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, computed } from "vue";
import {
  Datetime,
  Group,
  PopupPicker,
  XButton,
  XSwitch,
  Divider,
  Cell,
  useLocale,
} from "wiux";

export default defineComponent({
  components: {
    Datetime,
    Group,
    PopupPicker,
    XButton,
    XSwitch,
    Divider,
    Cell,
  },
  setup() {
    const { t } = useLocale();
    const date111 = ref("");
    const value1 = ref<string[]>(["iPhone"]);
    const value1_1 = ref<string[]>(["iPhone"]);
    const value2 = ref<string[]>(["iPhone", "华为3"]);
    const value3 = ref<string[]>([]);
    const value4 = ref<string[]>([]);
    const value5 = ref<string[]>(["2"]);
    const showPopupPicker = ref(false);
    const formatDemoValue = ref<string[]>(["01", "12"]);
    const switch6 = ref(false);
    const value6 = ref<string[]>([]);
    const picker3 = ref<any>(null);

    const picker3Name = ref("");

    const inlineDesc = computed(
      () => t("Current value") + ` [${formatDemoValue.value}]`,
    );

    const list1 = ref([
      ["小米", "iPhone", "华为", "情怀", "三星", "其他", "不告诉你"],
    ]);
    const list2 = ref([
      ["小米", "iPhone", "华为", "情怀", "三星", "其他", "不告诉你"],
      ["小米1", "iPhone2", "华为3", "情怀4", "三星5", "其他6", "不告诉你7"],
    ]);

    const list3 = ref([
      {
        name: "中国",
        value: "china",
        parent: "0",
      },
      {
        name: "美国",
        value: "usa",
        parent: "0",
      },
      {
        name: "广东",
        value: "china001",
        parent: "china",
      },
      {
        name: "广西",
        value: "china002",
        parent: "china",
      },
      {
        name: "美国001",
        value: "usa001",
        parent: "usa",
      },
      {
        name: "美国002",
        value: "usa002",
        parent: "usa",
      },
      {
        name: "广州",
        value: "china001001",
        parent: "china001",
      },
      {
        name: "深圳",
        value: "china001002",
        parent: "china001",
      },
      {
        name: "广西001",
        value: "china002001",
        parent: "china002",
      },
      {
        name: "广西002",
        value: "china002002",
        parent: "china002",
      },
      {
        name: "美国001_001",
        value: "usa001001",
        parent: "usa001",
      },
      {
        name: "美国001_002",
        value: "usa001002",
        parent: "usa001",
      },
      {
        name: "美国002_001",
        value: "usa002001",
        parent: "usa002",
      },
      {
        name: "美国002_002",
        value: "usa002002",
        parent: "usa002",
      },
    ]);

    function onChange(val: any) {
      console.log("val change", val);
    }

    function changeList10() {
      list1.value = [
        ["小米1", "iPhone1", "华为1", "情怀1", "三星1", "其他1", "不告诉你1"],
      ];
    }

    function changeList11() {
      list1.value[0].push("我是push条目");
    }

    function changeList21() {
      list3.value.push({
        name: "美国002_007",
        value: "usa002007",
        parent: "usa002",
      });
    }

    function onShow() {
      console.log("on show");
    }

    function onHide(type: boolean) {
      console.log("on hide", type);
    }

    function format(val: any, name: string) {
      return name.replace(" ", "");
    }

    watch(value3, () => {
      nextTick(() => {
        picker3Name.value = picker3.value?.getNameValues() || "";
      });
    });

    return {
      t,
      date111,
      value1,
      value1_1,
      value2,
      value3,
      value4,
      value5,
      showPopupPicker,
      formatDemoValue,
      inlineDesc,
      list1,
      list2,
      list3,
      picker3,
      picker3Name,
      onChange,
      changeList10,
      changeList11,
      changeList21,
      switch6,
      value6,
      onShow,
      onHide,
      format,
    };
  },
});
</script>

<style scoped>
.picker-buttons {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
