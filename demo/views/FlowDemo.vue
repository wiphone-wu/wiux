<template>
  <div>
    <flow>
      <flow-state state="1" :title="t('Paid')" is-done></flow-state>
      <flow-line is-done></flow-line>

      <flow-state state="2" is-done>
        <template #title
          ><span>{{ t("Shipped") }}</span></template
        >
      </flow-state>
      <flow-line :tip="t('processing')"></flow-line>

      <flow-state state="3" :title="t('Delivered')"></flow-state>
      <flow-line></flow-line>

      <flow-state state="4" :title="t('Done')"></flow-state>
    </flow>

    <flow>
      <flow-state :title="t('Paid')" is-done></flow-state>
      <flow-line is-done :line-span="15"></flow-line>

      <flow-state :title="t('Shipped')" is-done></flow-state>
      <flow-line is-done :line-span="30"></flow-line>

      <flow-state :title="t('Delivered')" is-done></flow-state>
      <flow-line
        :tip="t('processing')"
        tip-direction="bottom"
        :line-span="45"
        :process-span="60"
      ></flow-line>

      <flow-state :title="t('Done')"></flow-state>
    </flow>

    <flow orientation="vertical" style="height: 250px">
      <flow-state state="1" :title="t('Paid')" is-done></flow-state>
      <flow-line is-done></flow-line>

      <flow-state state="2" :title="t('Shipped')" is-done></flow-state>
      <flow-line :tip="t('processing')"></flow-line>

      <flow-state state="3" :title="t('Delivered')"></flow-state>
      <flow-line></flow-line>

      <flow-state state="4" :title="t('Done')"></flow-state>
    </flow>

    <flow orientation="vertical" style="height: 200px">
      <flow-state state="1" :title="t('Paid')" is-done></flow-state>
      <flow-line is-done :line-span="15"></flow-line>

      <flow-state state="2" :title="t('Shipped')" is-done></flow-state>
      <flow-line :line-span="30"></flow-line>

      <flow-state state="3" :title="t('Delivered')"></flow-state>
      <flow-line :line-span="45"></flow-line>

      <flow-state state="4" :title="t('Done')"></flow-state>
    </flow>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Flow, FlowLine, FlowState, useLocale } from "wiux";

export default defineComponent({
  components: {
    Flow,
    FlowLine,
    FlowState,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
});
</script>
