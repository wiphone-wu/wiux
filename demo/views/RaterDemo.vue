<template>
  <div>
    <group :title="t('Normal usage')">
      <cell
        :title="t('Set default score = 5')"
        :inline-desc="t('total 5 stars if not specified')"
      >
        <rater v-model="data3"></rater>
      </cell>
      <cell :title="t('Change color')">
        <rater v-model="data3" :max="6" active-color="#04BE02"></rater>
      </cell>
    </group>

    <group :title="t('Disabled = true')">
      <cell :title="t('Your historical score')">
        <rater v-model="data4" disabled></rater>
      </cell>
      <cell :title="decimalTitle">
        <rater v-model="data41" active-color="#04BE02" disabled></rater>
      </cell>
      <cell :title="t('Custom font size(15px)')">
        <rater
          v-model="data42"
          active-color="#04BE02"
          :font-size="15"
          disabled
        ></rater>
      </cell>
    </group>

    <group :title="t('Custom star, some symbols like ♥ ❤ are not suitable.')">
      <cell :title="t('Love')">
        <rater v-model="data4" star="♡" active-color="red" :margin="15"></rater>
      </cell>
      <cell :title="t('Use HTML')">
        <rater
          v-model="data41"
          star="<span>X</span>"
          active-color="red"
          :margin="15"
        ></rater>
      </cell>
      <cell :title="t('Sun')">
        <rater
          v-model="data5"
          star="☼"
          active-color="#FF9900"
          :margin="4"
        ></rater>
      </cell>
      <cell :title="t('Smiley')">
        <rater
          v-model="data5"
          star="☻"
          active-color="#FF9900"
          :margin="4"
        ></rater>
      </cell>
      <cell :title="t('Different stars')">
        <rater
          v-model="data5"
          star="✩"
          active-color="#FF9900"
          :margin="4"
        ></rater>
      </cell>
      <cell :title="t('Embarrassed')">
        <rater
          v-model="data5"
          star="囧"
          active-color="#FF9900"
          :margin="4"
        ></rater>
      </cell>
    </group>

    <group :title="t('Two-way binding')">
      <cell :title="t('Your historical score')">
        <rater v-model="data6" active-color="#04BE02"></rater>
      </cell>
      <cell
        :title="t('Current val')"
        primary="content"
        :inline-desc="data6 + ''"
      >
        <range v-model="data6" :step="1" :min="0" :max="5"></range>
      </cell>
    </group>

    <group :title="t('Set minimum')">
      <cell :title="t('Min = 3')">
        <rater v-model="data7" :min="3"></rater>
      </cell>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { Rater, Group, Cell, Range, useLocale } from "wiux";

export default defineComponent({
  components: {
    Rater,
    Group,
    Cell,
    Range,
  },
  setup() {
    const { t } = useLocale();
    const data3 = ref("5");
    const data4 = ref(3);
    const data41 = ref(3.7);
    const data42 = ref(3.5);
    const data5 = ref(3);
    const data6 = ref(3);
    const data7 = ref(0);

    const decimalTitle = computed(
      () => t("Decimal score") + " " + data41.value,
    );

    return {
      t,
      data3,
      data4,
      data41,
      data42,
      data5,
      data6,
      data7,
      decimalTitle,
    };
  },
});
</script>
