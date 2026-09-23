<template>
  <div>
    <div style="padding: 15px">
      <color-picker :colors="colors1" v-model="color1"></color-picker>
      <br />
      <color-picker
        :colors="colors1"
        v-model="color1"
        size="middle"
      ></color-picker>
    </div>
    <group :title="t('Use in Cell')">
      <cell :title="t('Color:') + color1">
        <color-picker
          :colors="colors1"
          v-model="color1"
          size="small"
        ></color-picker>
      </cell>
    </group>
    <group :title="t('A cell without title')">
      <cell primary="content">
        <color-picker
          :colors="colors1"
          v-model="color1"
          size="middle"
        ></color-picker>
      </cell>
    </group>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { ColorPicker, Group, Cell, useLocale } from "wiux";

export default {
  name: "ColorPickerDemo",
  components: {
    ColorPicker,
    Group,
    Cell,
  },
  setup() {
    const { t } = useLocale();
    const color1 = ref("#FFEF7D");
    const colors1 = [
      "#FF3B3B",
      "#FFEF7D",
      "#8AEEB1",
      "#8B8AEE",
      "#CC68F8",
      "#fff",
    ];

    return {
      t,
      color1,
      colors1,
    };
  },
};
</script>
