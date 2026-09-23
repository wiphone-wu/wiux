<template>
  <div>
    <blur :blur-amount="40" :url="url">
      <p class="center"><img :src="url" /></p>
    </blur>
    <flexBox :gutter="0">
      <flexBox-item v-for="(img, index) in images" :key="index">
        <img :src="img" style="width: 100%" @click="url = img" />
      </flexBox-item>
    </flexBox>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Blur, FlexBox, FlexBoxItem } from "wiux";

export default defineComponent({
  name: "BlurDemo",
  components: {
    Blur,
    FlexBox,
    FlexBoxItem,
  },
  setup() {
    const images = [
      "../assets/cat1.jpg",
      "../assets/cat2.jpg",
      "../assets/cat3.jpg",
    ];
    const url = ref(images[0]);

    return {
      images,
      url,
    };
  },
});
</script>

<style scoped>
.center {
  text-align: center;
  padding-top: 20px;
  color: #fff;
  font-size: 18px;
}
.center img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ececec;
}
</style>
