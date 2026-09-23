<template>
  <div>
    <br />
    <x-progress :percent="percent1" @on-cancel="onCancel"></x-progress>
    <br />
    <div style="padding: 10px">
      <x-progress :percent="percent2" :show-cancel="false"></x-progress>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { XProgress, useToast } from "wiux";

const toast = useToast();

export default {
  name: "XProgressDemo",
  components: {
    XProgress,
  },
  setup() {
    const percent1 = ref(30);
    const percent2 = ref(60);

    const onCancel = () => {
      toast.text("on onCancel", "middle");
    };

    return {
      percent1,
      percent2,
      onCancel,
    };
  },
};
</script>
