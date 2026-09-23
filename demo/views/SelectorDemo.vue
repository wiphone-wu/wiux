<template>
  <div>
    <group :title="t('no placeholder, the current value is : ') + defaultValue">
      <selector
        ref="defaultValueRef"
        :title="t('Provinces')"
        :options="list"
        v-model="defaultValue"
      ></selector>
      <selector
        ref="defaultValueRef2"
        :title="t('Provinces')"
        direction="rtl"
        :options="list"
        v-model="defaultValue"
      ></selector>
    </group>

    <div style="padding: 15px">
      <x-button type="primary" @click="getValue('defaultValueRef')">{{
        t("get full value")
      }}</x-button>
    </div>

    <group :title="t('with placeholder')">
      <selector
        placeholder="请选择省份"
        v-model="demo01"
        :title="t('Provinces')"
        name="district"
        :options="list"
        @on-change="onChange"
      ></selector>
    </group>

    <group :title="t('without title')">
      <selector
        placeholder="请选择省份"
        v-model="demo02"
        :options="list"
      ></selector>
    </group>

    <group :title="t('set value=gx')">
      <selector
        v-model="value1"
        :title="t('Provinces')"
        :options="plainList"
        @on-change="onChange"
      ></selector>
    </group>

    <group :title="t('readonly, displays just like a cell')">
      <selector
        model-value="gd"
        readonly
        :title="t('Provinces')"
        :options="list"
      ></selector>
    </group>

    <group :title="t('use plain options')">
      <selector
        ref="plainValueRef"
        model-value="C"
        title="Selector"
        :options="list1"
        @on-change="onChange"
      ></selector>
    </group>

    <div style="padding: 15px">
      <x-button type="primary" @click="getValue('plainValueRef')">{{
        t("get full value")
      }}</x-button>
    </div>

    <group :title="t('boolean selector: ') + value3">
      <selector
        v-model="value3"
        title="Wiux Is Cool"
        :options="list2"
      ></selector>
    </group>

    <group
      :title="t('set valueMap for directly using API data')"
      label-width="5em"
    >
      <selector
        ref="valueMapRef"
        v-model="valueMapValue"
        :value-map="['idValue', 'idLabel']"
        title="Selector"
        :options="valueMapList"
        @on-change="onChange"
      ></selector>
      <cell-box align-items="flex-start">
        <pre>{{ valueMapList }}</pre>
      </cell-box>
      <cell title="value" :value="valueMapValue"></cell>
    </group>

    <div style="padding: 15px">
      <x-button type="primary" @click="getValue('valueMapRef')">{{
        t("get full value")
      }}</x-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { Selector, Group, Cell, CellBox, XButton, useToast, useLocale } from "wiux";

const toast = useToast();

export default defineComponent({
  components: {
    Selector,
    Group,
    Cell,
    CellBox,
    XButton,
  },
  setup() {
    const { t } = useLocale();
    const defaultValueRef = ref();
    const plainValueRef = ref();
    const valueMapRef = ref();

    const demo01 = ref("");
    const demo02 = ref("");
    const defaultValue = ref(t("gd"));
    const plainList = computed(() => [t("gd"), t("gx")]);
    const list = computed(() => [
      { key: "gd", value: t("gd") },
      { key: "gx", value: t("gx") },
    ]);
    const list2 = computed(() => [
      { key: true, value: t("yes") },
      { key: false, value: t("no") },
    ]);
    const value1 = computed(() => t("gx"));
    const value3 = ref(true);
    const list1 = ref(["A", "B", "C"]);
    const valueMapValue = ref("key01");
    const valueMapList = ref([
      {
        idValue: "key01",
        idLabel: "value01",
        otherProp: "prop01",
      },
      {
        idValue: "key02",
        idLabel: "value02",
        otherProp: "prop02",
      },
    ]);

    const onChange = (val: any) => {
      console.log(val);
    };

    const getValue = (refName: string) => {
      let refComp: any = null;
      if (refName === "defaultValueRef") {
        refComp = defaultValueRef.value;
      } else if (refName === "plainValueRef") {
        refComp = plainValueRef.value;
      } else if (refName === "valueMapRef") {
        refComp = valueMapRef.value;
      }
      if (refComp && refComp.getFullValue) {
        toast.text(JSON.stringify(refComp.getFullValue(), null, 2));
      }
    };

    return {
      t,
      defaultValueRef,
      plainValueRef,
      valueMapRef,
      demo01,
      demo02,
      defaultValue,
      plainList,
      list,
      list2,
      value1,
      value3,
      list1,
      valueMapValue,
      valueMapList,
      onChange,
      getValue,
    };
  },
});
</script>