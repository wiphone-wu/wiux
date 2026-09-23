<template>
  <div>
    <br />
    <br />
    <div class="space-btn" @click="spaceChange">{{ t("Show space") }}</div>
    <div class="space" v-if="showSpace">{{ t("Space") }}</div>
    <div style="height: 44px">
      <sticky
        ref="stickyRef"
        :offset="46"
        :check-sticky-support="false"
        :disabled="disabled"
      >
        <tab :line-width="1">
          <tab-item :selected="true">{{ t("Now showing") }}</tab-item>
          <tab-item>{{ t("Coming soon") }}</tab-item>
        </tab>
      </sticky>
      <div class="wiux-sticky-fill" style="height: 44px"></div>
    </div>
    <p v-for="i in 100" :key="i" style="padding: 3px 15px">{{ i }}<br /></p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import { Sticky, Tab, TabItem, useLocale } from "wiux";

export default defineComponent({
  name: "StickyDemo",
  components: {
    Sticky,
    Tab,
    TabItem,
  },
  setup() {
    const { t } = useLocale();
    const showSpace = ref(false);
    const stickyRef = ref<any>(null);
    const disabled = ref(false);

    function spaceChange() {
      showSpace.value = !showSpace.value;
      nextTick(() => {
        if (stickyRef.value) {
          stickyRef.value.bindSticky();
        }
      });
    }

    return {
      t,
      showSpace,
      stickyRef,
      disabled,
      spaceChange,
    };
  },
});
</script>

<style scoped>
.space-btn {
  padding: 5px 0;
  margin: 10px;
  text-align: center;
  border: 1px red solid;
}

.space {
  padding: 30px 0;
  margin: 10px;
  text-align: center;
  border: 1px green solid;
}
</style>
