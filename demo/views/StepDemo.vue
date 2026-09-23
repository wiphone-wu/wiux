<template>
  <div style="width: 95%; margin: 0 auto">
    <br />
    <div>
      <step v-model="step1" background-color="#fbf9fe">
        <step-item :title="t('step 1')" :description="t('step 1')"></step-item>
        <step-item :title="t('step 2')" :description="t('step 2')"></step-item>
        <step-item :title="t('step 3')" :description="t('step 3')"></step-item>
      </step>
    </div>
    <divider></divider>
    <div>
      <step v-model="step2" background-color="#fbf9fe" gutter="20px">
        <step-item :title="t('Done')"></step-item>
        <step-item :title="t('In progress')"></step-item>
        <step-item :title="t('End')"></step-item>
      </step>
      <div class="btn_wrap">
        <x-button type="primary" @click="nextStep">{{
          t("next step")
        }}</x-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Step, StepItem, XButton, Divider, useLocale } from "wiux";

export default defineComponent({
  components: {
    Step,
    StepItem,
    XButton,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    const step1 = ref(1);
    const step2 = ref(0);

    const nextStep = () => {
      step2.value++;
    };

    return {
      t,
      step1,
      step2,
      nextStep,
    };
  },
});
</script>

<style lang="less">
.btn_wrap {
  padding: 0 1rem;
  margin-top: 2rem;
}
</style>
