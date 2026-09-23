<template>
  <div class="wiux-circle-demo">
    <divider>{{ t("Basic Usage") }}</divider>
    <div style="width: 150px; height: 150px">
      <x-circle :percent="percent" :stroke-width="5" stroke-color="#04BE02">
        <span>{{ percent }}%</span>
      </x-circle>
    </div>

    <div class="circle-demo-range">
      <range v-model="percent" :min="0" :max="100"></range>
    </div>

    <div style="width: 150px; height: 150px">
      <x-circle
        :percent="percent"
        :stroke-width="5"
        stroke-color="#04BE02"
        :anticlockwise="true"
      >
        <span>{{ percent }}%</span>
      </x-circle>
    </div>
    <h4>{{ t("Counterclockwise") }}</h4>
    <br />

    <divider>{{ t("Gradient") }}</divider>
    <div style="width: 100px; height: 100px">
      <x-circle
        :percent="80"
        :stroke-width="6"
        :trail-width="6"
        :stroke-color="['#36D1DC', '#5B86E5']"
        trail-color="#ececec"
      >
        <span style="color: #36d1dc">80%</span>
      </x-circle>
    </div>
    <h4>{{ t("Gradient") }}</h4>
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { XCircle, Range, Divider, useLocale } from "wiux";

export default defineComponent({
  components: {
    XCircle,
    Range,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    const percent = ref(50);

    return {
      t,
      percent,
    };
  },
});
</script>

<style scoped>
.wiux-circle-demo {
  text-align: center;
}
.wiux-circle-demo > div {
  margin-left: auto;
  margin-right: auto;
}
.circle-demo-range {
  width: 250px;
  margin-top: 25px;
  margin-bottom: 25px;
}
</style>
