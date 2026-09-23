<template>
  <div>
    <group :title="t('Auto countdown')">
      <cell title="15s" v-model="value">
        <countdown
          v-model="time1"
          @on-finish="finish"
          v-show="show"
        ></countdown>
      </cell>
    </group>
    <group :title="t('Manual mode')">
      <x-switch :title="t('Start')" v-model="start"></x-switch>
      <cell title="15s">
        <countdown
          v-model="time2"
          :start="start"
          @on-finish="finish2"
        ></countdown>
      </cell>
    </group>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Group, Cell, Countdown, XSwitch, useLocale } from "wiux";

export default {
  name: "CountdownDemo",
  components: {
    Group,
    Cell,
    Countdown,
    XSwitch,
  },
  setup() {
    const { t } = useLocale();
    const show = ref(true);
    const time1 = ref(15);
    const time2 = ref(15);
    const value = ref("");
    const start = ref(false);

    const finish = (index: number) => {
      show.value = false;
      value.value = "completed";
      console.log("current index", index);
    };

    const finish2 = (index: number) => {
      start.value = false;
      time2.value = 20;
    };

    return {
      t,
      show,
      time1,
      time2,
      value,
      start,
      finish,
      finish2,
    };
  },
};
</script>
