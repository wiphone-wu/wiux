<template>
  <div>
    <img
      class="previewer-demo-img"
      v-for="(item, index) in list"
      :key="item.src"
      :src="item.src"
      width="100"
      @click="show(index)"
    />
    <div v-transfer-dom>
      <Previewer
        :list="list"
        ref="previewerRef"
        :options="options"
        @change="logIndexChange"
      ></Previewer>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Previewer } from "wiux";
import TransferDom from "../../src/directives/transfer-dom/index";

interface PreviewerImage {
  msrc?: string;
  src: string;
  w?: number;
  h?: number;
}

export default {
  components: {
    Previewer,
  },
  directives: {
    TransferDom,
  },
  setup() {
    const previewerRef = ref<any>(null);

    const list = ref<PreviewerImage[]>([
      {
        msrc: "../assets/cat1.jpg",
        src: "../assets/cat1.jpg",
        w: 800,
        h: 400,
      },
      {
        msrc: "../assets/cat2.jpg",
        src: "../assets/cat2.jpg",
        w: 1200,
        h: 900,
      },
      {
        msrc: "../assets/cat3.jpg",
        src: "../assets/cat3.jpg",
      },
    ]);

    const options = {
      getThumbBoundsFn(index: number) {
        const thumbnail = document.querySelectorAll(".previewer-demo-img")[
          index
        ] as HTMLElement;
        const pageYScroll =
          window.pageYOffset || document.documentElement.scrollTop;
        const rect = thumbnail.getBoundingClientRect();
        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      },
    };

    const logIndexChange = (arg: any) => {
      console.log(arg);
    };

    const show = (index: number) => {
      if (previewerRef.value) {
        previewerRef.value.show(index);
      }
    };

    return {
      previewerRef,
      list,
      options,
      logIndexChange,
      show,
    };
  },
};
</script>

<style scoped>
.previewer-demo-img {
  margin: 5px;
}
</style>
