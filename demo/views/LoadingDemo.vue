<template>
  <div style="overflow: hidden">
    <Group>
      <XSwitch :title="t('Toggle')" v-model="show1" @on-change="show1change" />
      <XSwitch
        :title="t('No loading text')"
        v-model="show2"
        @on-change="show2change"
      />
    </Group>
    <div v-transfer-dom>
      <Loading :show="show1" :text="text1" />
    </div>
    <div v-transfer-dom>
      <Loading :show="show2" text="" />
    </div>
    <div style="padding: 15px">
      <XButton @click="showLoading" type="primary">{{
        t("show loading (close in 2s)")
      }}</XButton>
    </div>
    <div style="padding: 15px">
      <XButton @click="showDelayLoading" type="primary">{{
        t("show loading delay after 1s")
      }}</XButton>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Loading, Group, XSwitch, XButton, useLoading, useLocale } from "wiux";
import transferDom from "../../src/directives/transfer-dom";

const loading = useLoading();

function tick(i: number, cb: (n: number) => void) {
  setTimeout(() => {
    i++;
    cb(i);
    if (i < 100) {
      tick(i, cb);
    }
  }, 10);
}

export default {
  directives: {
    transferDom,
  },
  components: {
    Loading,
    Group,
    XSwitch,
    XButton,
  },
  setup() {
    const { t } = useLocale();
    const show1 = ref(false);
    const show2 = ref(false);
    const text1 = ref("Processing");

    const showLoading = () => {
      loading.show({
        text: t("Loading"),
      });
      setTimeout(() => {
        loading.hide();
      }, 2000);
    };

    const showDelayLoading = () => {
      loading.show({
        text: "Loading",
        delay: 1000,
      });
      setTimeout(() => {
        loading.hide();
      }, 2000);
    };

    const show1change = (val: boolean) => {
      if (val) {
        tick(0, (percent: number) => {
          if (percent === 100) {
            show1.value = false;
            return;
          }
          text1.value = `${percent}%`;
        });
      }
    };

    const show2change = (val: boolean) => {
      if (val) {
        tick(0, (percent: number) => {
          if (percent === 100) {
            show2.value = false;
            return;
          }
        });
      }
    };

    return {
      t,
      show1,
      show2,
      text1,
      showLoading,
      showDelayLoading,
      show1change,
      show2change,
    };
  },
};
</script>
