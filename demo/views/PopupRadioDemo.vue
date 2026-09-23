<template>
  <div>
    <group>
      <popup-radio
        :title="t('Options')"
        :options="options1"
        v-model="option1"
      ></popup-radio>
    </group>

    <group>
      <popup-radio
        :title="t('Options')"
        :options="options2"
        v-model="option2"
        :placeholder="t('Placeholder')"
      ></popup-radio>
    </group>

    <group>
      <popup-radio :title="t('Options')" :options="options3" v-model="option3">
        <template #popup-header>
          <p class="wiux-1px-b demo3-slot">{{ t("Please select an option") }}</p>
        </template>
      </popup-radio>
    </group>

    <group>
      <popup-radio
        :title="t('Readonly')"
        readonly
        :options="options3"
        v-model="option4"
      >
        <template #popup-header>
          <p class="wiux-1px-b demo3-slot">{{ t("Please select an option") }}</p>
        </template>
      </popup-radio>
    </group>

    <group>
      <popup-radio
        :title="t('Slot: each-item')"
        :options="options3"
        v-model="option5"
      >
        <template #each-item="props">
          <p>
            {{ t("Custom item") }}
            <img
              :src="'../assets/cat' + (props.index + 1) + '.jpg'"
              class="wiux-radio-icon"
            />
            {{ props.label }}
            <br />
            <span style="color: #666"
              >{{ props.index + 1 }} {{ t("Another line") }}</span
            >
          </p>
        </template>
      </popup-radio>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Group, PopupRadio, useLocale } from "wiux";

export default defineComponent({
  components: {
    Group,
    PopupRadio,
  },
  setup() {
    const { t } = useLocale();
    const option1 = ref("A");
    const options1 = ["A", "B", "C"];
    const option2 = ref("");
    const options2 = [
      {
        key: "A",
        value: "label A",
      },
      {
        key: "B",
        value: "label B",
      },
    ];
    const option3 = ref("C");
    const options3 = ["A", "B", "C"];
    const option4 = ref("B");
    const option5 = ref("B");

    return {
      t,
      option1,
      options1,
      option2,
      options2,
      option3,
      options3,
      option4,
      option5,
    };
  },
});
</script>

<style scoped>
.demo3-slot {
  text-align: center;
  padding: 8px 0;
  color: #888;
}
</style>
