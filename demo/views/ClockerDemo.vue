<template>
  <div>
    <p style="padding: 15px">
      <span>{{ t("Basic Usage") }}: </span>
      <clocker :time="time1"></clocker>
    </p>

    <group :title="t('Use in Cell')">
      <cell :title="t('Date: 2018-08-01')">
        <clocker :time="time2"></clocker>
      </cell>
    </group>

    <group :title="t('Custom template')">
      <cell :title="t('Date: 2018-08-01')">
        <clocker :time="time2">
          <span style="color: red">%D {{ t("days") }}</span>
          <span style="color: green">%H {{ t("hours") }}</span>
          <span style="color: blue"
            >%M {{ t("minutes") }} %S {{ t("seconds") }}</span
          >
        </clocker>
      </cell>
      <cell title="2026-09-03">
        <clocker :time="time3">
          <span class="day">%_D1</span>
          <span class="day">%_D2</span>
          <span class="day">%_D3</span>{{ t("days") }}
          <span class="day">%_H1</span>
          <span class="day">%_H2</span>{{ t("hours") }}
          <span class="day">%_M1</span>
          <span class="day">%_M2</span>{{ t("minutes") }}
          <span class="day">%_S1</span>
          <span class="day">%_S2</span>{{ t("seconds") }}
        </clocker>
      </cell>
    </group>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { Clocker, Cell, Group, useLocale } from "wiux";

export default {
  name: "ClockerDemo",
  components: {
    Clocker,
    Cell,
    Group,
  },
  setup() {
    const { t } = useLocale();

    const time1 = ref("2027-08-27 21:54");
    const time2 = ref("2027-08-31");
    const time3 = ref("2027-09-03");

    onMounted(() => {
      setTimeout(() => {
        time1.value = "2027-09-25 22:54";
      }, 5000);
    });

    return {
      t,
      time1,
      time2,
      time3,
    };
  },
};
</script>

<style scoped>
.day {
  display: inline-block;
  margin-left: 1px;
  padding: 0 3px;
  border-radius: 3px;
  background-color: #000;
  color: #fff;
  text-align: center;
}
</style>
