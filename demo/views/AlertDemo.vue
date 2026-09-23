<template>
  <div>
    <Group>
      <XSwitch :title="t('Show Alert')" v-model="show" />
    </Group>
    <Alert
      v-model="show"
      :title="t('Congratulations')"
      @on-show="onShow"
      @on-hide="onHide"
    >
      {{ t("Your Message is sent successfully~") }}
    </Alert>

    <Group :title="t('Text prop: content')">
      <XSwitch :title="t('Show Alert')" v-model="show2" />
    </Group>
    <Alert
      v-model="show2"
      :title="t('Congratulations')"
      :content="t('Your Message is sent successfully~')"
    />

    <Group :title="t('Use in Composable')">
      <Cell :title="t('Show Alert')" @click="showPlugin" is-link />
      <Cell
        :title="t('Will auto close in 3s')"
        @click="showPluginAuto"
        is-link
      />
    </Group>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Alert, Group, XSwitch, Cell, useAlert, useLocale } from "wiux";

const alert = useAlert();

export default {
  components: {
    Alert,
    Group,
    XSwitch,
    Cell,
  },
  setup() {
    const { t } = useLocale();

    const show = ref(false);
    const show2 = ref(false);

    const onHide = () => {
      console.log("on hide");
    };

    const onShow = () => {
      console.log("on show");
    };

    const showPlugin = () => {
      alert.show({
        title: t("Wiux is Cool"),
        content: t("Do you agree?"),
        onShow() {
          console.log("Plugin: I'm showing");
        },
        onHide() {
          console.log("Plugin: I'm hiding");
        },
      });
    };

    const showPluginAuto = () => {
      alert.show({
        title: t("Wiux is Cool"),
        content: t("Will auto close in 3s"),
        onHide() {
          console.log("Plugin: I'm hiding");
        },
      });
      setTimeout(() => {
        alert.hide();
      }, 3000);
    };

    return {
      t,
      show,
      show2,
      onHide,
      onShow,
      showPlugin,
      showPluginAuto,
    };
  },
};
</script>
