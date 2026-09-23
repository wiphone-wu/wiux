<template>
  <div>
    <group-title>{{
      t("The first one is selected without setting default value")
    }}</group-title>
    <picker :data="years" v-model="year1" @on-change="change"></picker>

    <br />

    <group-title>{{
      t("Asynchronous loading and dynamic change of data")
    }}</group-title>
    <picker :data="years001" v-model="year001" @on-change="change"></picker>
    <br />
    <group>
      <cell :title="t('Current value')" :value="year001"></cell>
    </group>
    <x-button
      type="primary"
      @click="
        changeValue([
          ['1', '3', '5', '7', '9', '11'],
          ['2', '3', '4', '5'],
          ['a', 'b', 'c'],
        ])
      "
      >{{ t("Set value 1") }}</x-button
    >
    <x-button
      type="primary"
      @click="
        changeValue([
          ['1', '3', '5', '7', '9', '11'],
          ['2', '3', '4', '5'],
        ])
      "
      >{{ t("Set value 2") }}</x-button
    >
    <x-button
      type="primary"
      @click="changeValue([['2', '4', '6', '8', '10', '11']])"
      >{{ t("Set value 3") }}</x-button
    >

    <br />

    <group-title>{{ t("With default value") }}</group-title>
    <picker :data="years" v-model="year2" @on-change="change"></picker>

    <br />

    <group-title>{{ t("Two-way data binding") }}</group-title>
    <picker :data="years" v-model="year3" @on-change="change3"></picker>
    <select v-model="year5">
      <option v-for="one in years[0]" :value="one.value">{{ one.name }}</option>
    </select>

    <br />

    <group-title>{{ t("Multi cols in non chained-mode") }}</group-title>
    <picker :data="years1" v-model="year4" @on-change="change"></picker>

    <br />

    <group-title>{{ t("Five columns") }}</group-title>
    <picker :data="year6" v-model="year6Value" @on-change="change"></picker>

    <br />

    <group-title
      >{{ t("Locations in chained-mode") }} {{ t("Current value") }}
      {{ year7Value }} <br />
      {{ t("Selected value corresponding to text") }}:
      {{ year7Names }}</group-title
    >
    <picker
      :data="year7"
      :columns="3"
      v-model="year7Value"
      @on-change="change"
      ref="picker1"
    ></picker>
    <x-button @click="setData1" type="primary"
      >{{ t("Set value to") }}: ["USA", "usa002", "0005"]</x-button
    >
    <x-button @click="setData2" type="primary"
      >{{ t("Set value to") }}: ["china", "china002", "gz"]</x-button
    >
    <x-button @click="setList" type="primary">{{ t("Add List") }}</x-button>

    <br />

    <group-title>{{ t("3 cols data but only show 2 cols") }}</group-title>
    <picker
      :data="year7"
      :fixedColumns="2"
      :columns="3"
      v-model="year8Value"
      @on-change="change"
    ></picker>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { Cell, Group, GroupTitle, XButton, Picker, useLocale } from "wiux";

const yearsData: any[] = [];
for (let i = 2020; i <= 2040; i++) {
  yearsData.push({
    name: i + "年",
    value: i + "",
  });
}

export default defineComponent({
  components: {
    Picker,
    GroupTitle,
    XButton,
    Cell,
    Group,
  },
  setup() {
    const { t } = useLocale();
    const years = ref([yearsData]);
    const years001 = ref<any[]>([]);
    const year001 = ref<any[]>([]);
    const year1 = ref([""]);
    const year2 = ref(["2022"]);
    const year3 = ref(["2025"]);
    const year4 = ref(["2022", "4"]);
    const year5 = ref("2025");
    const years1 = ref([yearsData, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]);
    const year6 = ref([
      ["你", "我", "他"],
      ["you", "I", "him"],
      ["ni", "wo", "ta"],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
    ]);
    const year6Value = ref(["我", "him", "ni", "1", "2"]);
    const year7 = ref([
      {
        name: "中国",
        value: "china",
        parent: 0,
      },
      {
        name: "美国",
        value: "USA",
        parent: 0,
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
        parent: "USA",
      },
      {
        name: "美国002",
        value: "usa002",
        parent: "USA",
      },
      {
        name: "广州",
        value: "gz",
        parent: "china001",
      },
      {
        name: "深圳",
        value: "sz",
        parent: "china001",
      },
      {
        name: "广西001",
        value: "gz",
        parent: "china002",
      },
      {
        name: "广西002",
        value: "sz",
        parent: "china002",
      },
      {
        name: "美国001_001",
        value: "0003",
        parent: "usa001",
      },
      {
        name: "美国001_002",
        value: "0004",
        parent: "usa001",
      },
      {
        name: "美国002_001",
        value: "0005",
        parent: "usa002",
      },
      {
        name: "美国002_002",
        value: "0006",
        parent: "usa002",
      },
    ]);
    const year7Value = ref<any[]>(["china", "china001", "gz"]);
    const year8Value = ref<any[]>([]);
    const picker1Ref = ref<any>(null);

    const year7Names = computed(() => {
      return year7Value.value.map((v) => {
        const item = year7.value.find((d) => d.value === v);
        return item ? item.name : v;
      });
    });

    function changeValue(value: any[]) {
      years001.value = value;
    }

    function change(value: any) {
      console.log("new Value", value);
    }

    function change3(value: any[]) {
      year5.value = value[0];
    }

    function setData1() {
      year7Value.value = ["USA", "usa002", "0005"];
    }

    function setData2() {
      year7Value.value = ["china", "china002", "gz"];
    }

    function setList() {
      year7.value.push({
        name: "美国002_003",
        value: "0007",
        parent: "usa002",
      });
    }

    watch(year5, (val) => {
      year3.value[0] = val;
    });

    watch(year3, (val) => {
      year5.value = val[0];
    });

    return {
      t,
      years,
      years001,
      year001,
      year1,
      year2,
      year3,
      year4,
      year5,
      years1,
      year6,
      year6Value,
      year7,
      year7Value,
      year7Names,
      year8Value,
      picker1Ref,
      changeValue,
      change,
      change3,
      setData1,
      setData2,
      setList,
    };
  },
});
</script>
