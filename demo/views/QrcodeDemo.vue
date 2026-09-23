<template>
  <div style="text-align: center; margin-top: 15px">
    <Divider>{{ t("Default type = img") }}</Divider>
    <Qrcode value="https://wiux.li?x-page=demo_qrcode" type="img"></Qrcode>
    <br />
    <br />
    <Divider>{{ t("Type is canvas") }}</Divider>
    <Qrcode value="https://wiux.li?x-page=demo_qrcode"></Qrcode>
    <br />
    <Qrcode :value="value" :fg-color="fgColor"></Qrcode>
    <br />
    <span>{{ t("Current URL: ") }}{{ value }}</span>
    <br />
    <span>{{ t("Current color: ") }}{{ fgColor }}</span>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { Qrcode, Divider, useLocale } from "wiux";

export default {
  components: {
    Qrcode,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    const value = ref("https://wiux.li");
    const fgColor = ref("#000000");

    onMounted(() => {
      setInterval(() => {
        value.value = `https://wiux.li?t=${Math.random()}`;
        fgColor.value = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      }, 1000);
    });

    return {
      t,
      value,
      fgColor,
    };
  },
};
</script>
