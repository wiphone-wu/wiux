<template>
  <div
    class="text-body"
    :style="scrollable ? 'height:375px;overflow:scroll;' : ''"
  >
    <Spinner v-show="text !== t('initialization done(click to close me)')" />
    <br />
    <span>{{ text }}</span>
    <div v-if="scrollable" style="height: 1000px"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Spinner, useLocale } from "wiux";

export default defineComponent({
  components: {
    Spinner,
  },
  props: {
    scrollable: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { t } = useLocale();
    const text = ref(t("initializing~"));

    onMounted(() => {
      setTimeout(() => {
        text.value = t("initialization done(click to close me)");
      }, 2000);
    });

    return {
      t,
      text,
    };
  },
});
</script>

<style>
.text-body {
  padding: 30px 0;
  color: #666;
  text-align: center;
}
</style>
