<template>
  <div
    class="weui-cell wiux-cell-form-preview"
    :class="{ 'wiux-cell-no-border-intent': !borderIntent }"
  >
    <div class="weui-form-preview__bd">
      <div
        class="weui-form-preview__item"
        v-for="(item, index) in list"
        :key="index"
      >
        <label class="weui-form-preview__label" v-html="item.label"></label>
        <span class="weui-form-preview__value" v-html="item.value"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

interface FormPreviewItem {
  label: string;
  value: string;
}

export default defineComponent({
  name: "CellFormPreview",
  props: {
    list: {
      type: Array as PropType<FormPreviewItem[]>,
      default: () => [],
    },
    borderIntent: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style lang="less">
.wiux-cell-form-preview .weui-form-preview__bd {
  width: 100%;
  padding: 0;
}
</style>
