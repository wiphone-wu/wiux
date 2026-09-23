<template>
  <div>
    <group :title="t('default range')">
      <cell :title="t('Default')" :inline-desc="desc1" primary="content">
        <range v-model="data1" @on-change="onChange"></range>
      </cell>
      <cell :title="t('allow decimals')" :inline-desc="desc2" primary="content">
        <range v-model="data2" decimal></range>
      </cell>
      <cell :title="t('value=20')" :inline-desc="desc3" primary="content">
        <range v-model="data3"></range>
      </cell>
    </group>
    <group :title="t('min and max')">
      <cell :title="t('min=8')" :inline-desc="desc4" primary="content">
        <range v-model="data4" :min="8"></range>
      </cell>
      <cell :title="t('max=88')" :inline-desc="desc5" primary="content">
        <range v-model="data5" :max="88"></range>
      </cell>
      <cell :title="t('min and max')" :inline-desc="desc6" primary="content">
        <range v-model="data6" :min="7" :max="77"></range>
      </cell>
      <cell :title="t('change min and max')" primary="content">
        <range
          v-model="dynamicValue"
          :min="min"
          :max="max"
          :step="step"
        ></range>
      </cell>
      <cell :title="t('Current value')" :value="dynamicValue + ''"></cell>
    </group>
    <br />
    <div style="margin: 0 10px">
      <x-button type="primary" @click="update">{{ updateText }}</x-button>
    </div>

    <group :title="t('Step')">
      <cell :title="t('step=10')" :inline-desc="desc7" primary="content">
        <range v-model="data7" :min="7" :max="77" :step="10"></range>
      </cell>
    </group>

    <group :title="t('disabled')">
      <cell :title="t('disabled=true')" :inline-desc="desc8" primary="content">
        <range v-model="data8" disabled></range>
      </cell>
      <cell :title="t('Opacity')" :inline-desc="desc8" primary="content">
        <range v-model="data8" disabled :disabled-opacity="0.1"></range>
      </cell>
    </group>

    <group :title="t('bar height')">
      <cell :title="t('Line width')" :inline-desc="desc9" primary="content">
        <range v-model="data9" :range-bar-height="4"></range>
      </cell>
    </group>

    <group :title="t('custom min and max html')">
      <cell :title="t('Text size')" :inline-desc="desc10" primary="content">
        <range
          v-model="data10"
          :min="12"
          :max="22"
          min-HTML="<span style='font-size:12px;'>小</span>"
          max-HTML="<span style='font-size:22px;'>大</span>"
        ></range>
      </cell>
      <cell :title="t('brightness')" :inline-desc="desc11" primary="content">
        <range
          v-model="data11"
          min-HTML="<span style='font-size:16px;color:#F90;'>☼</span>"
          max-HTML="<span style='font-size:30px;color:#F90;'>☼</span>"
        ></range>
      </cell>
    </group>

    <group :title="t('two way binding')">
      <cell :title="t('Default')" primary="content">
        <range v-model="data12"></range>
      </cell>
      <cell :title="t('Default')" primary="content">
        <range v-model="data12"></range>
      </cell>
    </group>

    <group :title="showTitle">
      <cell :title="t('Default')" primary="content">
        <range :step="10" v-model="data13" v-show="showData13"></range>
      </cell>
    </group>

    <group :title="t('touchstart and touchend')">
      <cell :title="t('Default')" primary="content">
        <range
          :step="1"
          v-model="data14"
          @on-touchstart="onTouchstart"
          @on-touchend="onTouchend"
        ></range>
      </cell>
    </group>
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { Range, Group, Cell, XButton, useLocale } from "wiux";

export default {
  name: "RangeDemo",
  components: {
    Range,
    Group,
    Cell,
    XButton,
  },
  setup() {
    const { t } = useLocale();
    const data1 = ref(0);
    const data2 = ref(0);
    const data3 = ref(20);
    const data4 = ref(18);
    const data5 = ref(28);
    const data6 = ref(37);
    const data7 = ref(17);
    const data8 = ref(25);
    const data9 = ref(50);
    const data10 = ref(14);
    const data11 = ref(30);
    const data12 = ref(0);
    const data13 = ref(10);
    const data14 = ref(0);
    const showData13 = ref(false);
    const min = ref(0);
    const max = ref(100);
    const step = ref(1);
    const dynamicValue = ref(0);

    const desc1 = computed(() => t("value:") + " " + data1.value);
    const desc2 = computed(() => t("value is:") + " " + data2.value);
    const desc3 = computed(() => t("value is:") + " " + data3.value);
    const desc4 = computed(() => t("value is:") + " " + data4.value);
    const desc5 = computed(() => t("value is:") + " " + data5.value);
    const desc6 = computed(() => t("value is:") + " " + data6.value);
    const desc7 = computed(() => t("value is:") + " " + data7.value);
    const desc8 = computed(() => t("value is:") + " " + data8.value);
    const desc9 = computed(() => t("value is:") + " " + data9.value);
    const desc10 = computed(() => t("font size:") + " " + data10.value);
    const desc11 = computed(() => t("value is:") + " " + data11.value + "%");
    const showTitle = computed(
      () => t("use v-show") + " " + t("data:") + " " + data13.value,
    );
    const updateText = computed(
      () =>
        t("update min =") +
        " " +
        min.value +
        ", " +
        t("max =") +
        " " +
        max.value +
        " " +
        t("and step =") +
        " " +
        step.value,
    );

    setTimeout(() => {
      showData13.value = true;
    }, 2000);

    const onChange = (val: number) => {
      console.log("change", val);
    };

    const update = () => {
      min.value = Math.floor(Math.random() * 30);
      max.value = Math.floor(50 + Math.random() * 100);
      step.value = 1 + Math.floor(Math.random() * 10);
    };

    const onTouchstart = (e: Event) => {
      console.log("touchstart");
    };

    const onTouchend = (e: Event) => {
      console.log("touchend");
    };

    return {
      t,
      data1,
      data2,
      data3,
      data4,
      data5,
      data6,
      data7,
      data8,
      data9,
      data10,
      data11,
      data12,
      data13,
      data14,
      showData13,
      min,
      max,
      step,
      dynamicValue,
      desc1,
      desc2,
      desc3,
      desc4,
      desc5,
      desc6,
      desc7,
      desc8,
      desc9,
      desc10,
      desc11,
      showTitle,
      updateText,
      onChange,
      update,
      onTouchstart,
      onTouchend,
    };
  },
};
</script>
