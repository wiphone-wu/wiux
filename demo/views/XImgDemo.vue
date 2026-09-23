<template>
  <div>
    <div
      v-for="src in list"
      :key="src"
      style="background-color: yellow; text-align: center"
    >
      <span v-if="loadStatus[src] === 'loading'" style="font-size: 20px">{{ t("Loading") }}</span>
      <span v-else-if="loadStatus[src] === 'error'" style="font-size: 20px">{{ t("load error") }}</span>
      <x-img
        :src="src"
        :webp-src="`${src}?type=webp`"
        @on-success="success"
        @on-error="error"
        class="img-demo"
        error-class="img-error"
        :offset="-100"
        container="#wiux_view_box_body"
      ></x-img>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { XImg, useLocale } from "wiux";

export default defineComponent({
  name: "XImgDemo",
  components: {
    XImg,
  },
  setup() {
    const { t } = useLocale();
    const list = ref([
      "../assets/cat1.jpg",
      "../assets/cat2.jpg",
      "../assets/cat3.jpg",
    ]);

    const loadStatus = reactive<Record<string, string>>({});

    list.value.forEach((src) => {
      loadStatus[src] = "loading";
    });

    onMounted(() => {
      const container = document.getElementById("wiux_view_box_body");
      if (container) {
        container.scrollTop = 0;
      }
    });

    const success = (src: string, _ele: any) => {
      console.log("success load", src);
      loadStatus[src] = "success";
    };

    const error = (src: string, _ele: any, msg: string) => {
      console.log("error load", msg, src);
      loadStatus[src] = "error";
    };

    return {
      t,
      list,
      loadStatus,
      success,
      error,
    };
  },
});
</script>

<style>
.img-demo {
  width: 100%;
  height: auto;
}
.img-error {
  background-color: yellow;
}
.img-error:after {
  content: "加载失败";
  color: red;
}
</style>