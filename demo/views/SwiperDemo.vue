<template>
  <div>
    <group-title>{{
      t("THX to: https://github.com/wechatui/swiper")
    }}</group-title>
    <group-title>{{
      t(
        "In list mode, default height is 180px. If aspect-ratio is set, height is calculated based on width",
      )
    }}</group-title>
    <swiper
      :list="demo01_list"
      v-model="demo01_index"
      @change="demo01_onIndexChange"
    ></swiper>
    <p class="copyright">
      {{ t("Image Source: http://www.gratisography.com/") }}
    </p>
    <p>{{ t("current index: ") }}{{ demo01_index }}</p>
    <x-button @click="demo01_index = 0">{{ t("go to 0") }}</x-button>
    <x-button @click="demo01_index = 1">{{ t("go to 1") }}</x-button>
    <x-button @click="demo01_index = 2">{{ t("go to 2") }}</x-button>
    <br />
    <br />
    <divider>{{ t("Gorgeous divider") }}</divider>

    <group-title>{{ t("Set min-moving-distance to 120") }}</group-title>
    <swiper
      :list="demo01_list"
      v-model="demo02_index"
      :min-moving-distance="120"
      @change="demo01_onIndexChange"
    ></swiper>
    <br />
    <br />
    <divider>{{ t("Gorgeous divider") }}</divider>

    <group-title>{{
      t("Set aspect-ratio to auto-calculate height based on width")
    }}</group-title>
    <swiper
      :list="demo02_list"
      style="width: 85%; margin: 0 auto"
      :aspect-ratio="300 / 800"
      dots-position="center"
    ></swiper>

    <br />
    <br />
    <divider>{{ t("Gorgeous divider") }}</divider>

    <group-title>{{ t("Auto play") }}</group-title>
    <swiper
      :list="demo03_list"
      auto
      style="width: 80%; margin: 0 auto"
      height="180px"
      dots-class="custom-bottom"
      dots-position="center"
    ></swiper>
    <br />
    <br />
    <divider>{{ t("Gorgeous divider") }}</divider>

    <group-title>{{ t("use swiper-item for image list") }}</group-title>
    <swiper :aspect-ratio="300 / 800">
      <swiper-item
        class="swiper-demo-img"
        v-for="(item, index) in demo04_list"
        :key="index"
        ><img :src="item"
      /></swiper-item>
    </swiper>

    <br />
    <br />

    <group-title>{{ t("set index = 1 with swiper-item") }}</group-title>
    <swiper
      :aspect-ratio="300 / 800"
      @change="onSwiperItemIndexChange"
      v-model="swiperItemIndex"
    >
      <swiper-item
        class="swiper-demo-img"
        v-for="(item, index) in demo04_list"
        :key="index"
      >
        <img :src="item" />
      </swiper-item>
    </swiper>
    <br />
    {{ swiperItemIndex }}
    <br />
    <x-button @click="swiperItemIndex = 0">{{ t("go to 0") }}</x-button>
    <x-button @click="swiperItemIndex = 1">{{ t("go to 1") }}</x-button>
    <x-button @click="swiperItemIndex = 2">{{ t("go to 2") }}</x-button>

    <br />
    <br />
    <divider>{{ t("Gorgeous divider") }}</divider>

    <group-title>{{ t("Async setting list data") }}</group-title>
    <swiper
      :list="demo05_list"
      auto
      height="180px"
      @change="demo05_onIndexChange"
    ></swiper>
    <p>{{ t("current index: ") }}{{ demo05_index }}</p>
    <x-button type="primary" @click="demo05_onLoad(1)" style="margin: 10px 0">{{
      t("Load list1")
    }}</x-button>
    <x-button type="primary" @click="demo05_onLoad(2)" style="margin: 10px 0">{{
      t("Load list2")
    }}</x-button>

    <br />
    <br />
    <divider>{{ t("Gorgeous divider") }}</divider>

    <group-title>{{
      t("Use swiper-item for custom content, define height with height prop")
    }}</group-title>
    <swiper auto height="100px">
      <swiper-item class="black"
        ><h2 class="title fadeInUp animated">
          {{ t("It is everywhere") }}
        </h2></swiper-item
      >
      <swiper-item class="black"
        ><h2 class="title fadeInUp animated">
          {{ t("You have nowhere to hide") }}
        </h2></swiper-item
      >
      <swiper-item class="black"
        ><h2 class="title fadeInUp animated">
          {{ t("It is not hateful") }}
        </h2></swiper-item
      >
      <swiper-item class="black"
        ><h2 class="title fadeInUp animated">
          {{ t("It just does not understand you") }}
        </h2></swiper-item
      >
      <swiper-item class="black"
        ><h2 class="title fadeInUp animated">
          {{ t("We are trying") }}
        </h2></swiper-item
      >
      <swiper-item class="black"
        ><h2 class="title fadeInUp animated">
          {{ t("To make some changes") }}
        </h2></swiper-item
      >
    </swiper>

    <br />
    <br />
    <divider>{{ t("Gorgeous divider") }}</divider>

    <group-title>{{ t("Vertical text scroll") }}</group-title>
    <swiper
      auto
      height="30px"
      direction="vertical"
      :interval="2000"
      class="text-scroll"
      :show-dots="false"
    >
      <swiper-item
        ><p>
          {{ t("User A completed a task and received 20 coins") }}
        </p></swiper-item
      >
      <swiper-item
        ><p>
          {{ t("User B exchanged a gift pack and spent 30 coins") }}
        </p></swiper-item
      >
      <swiper-item
        ><p>
          {{ t("User C completed a task and received 30 coins") }}
        </p></swiper-item
      >
      <swiper-item
        ><p>
          {{ t("User D exchanged a food coupon and spent 20 coins") }}
        </p></swiper-item
      >
      <swiper-item
        ><p>
          {{ t("User E exchanged a food coupon and spent 20 coins") }}
        </p></swiper-item
      >
      <swiper-item
        ><p>
          {{ t("User B exchanged a gift pack and spent 30 coins") }}
        </p></swiper-item
      >
    </swiper>

    <br />
    <br />
    <divider>{{ t("Gorgeous divider") }}</divider>

    <group-title>{{ t("Loop mode") }}</group-title>
    <swiper
      loop
      auto
      :list="demo06_list"
      v-model="demo06_index"
      @change="demo06_onIndexChange"
    ></swiper>
    <p>{{ t("current index: ") }}{{ demo06_index }}</p>

    <group-title>{{
      t("Loop mode (only two items and clickable)")
    }}</group-title>
    <swiper
      loop
      auto
      :list="demo07_list"
      v-model="demo07_index"
      @change="demo07_onIndexChange"
    ></swiper>
    <p>{{ t("current index: ") }}{{ demo07_index }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import {
  Swiper,
  SwiperItem,
  GroupTitle,
  XButton,
  Divider,
  useLocale,
} from "wiux";

const baseList = [
  {
    url: "javascript:",
    img: "../assets/cat1.jpg",
    title: "送你一朵fua",
  },
  {
    url: "javascript:",
    img: "../assets/cat2.jpg",
    title: "送你一辆车",
  },
  {
    url: "javascript:",
    img: "../assets/cat3.jpg",
    title: "送你一次旅行",
    fallbackImg: "../assets/cat3.jpg",
  },
];

const imgList = [
  "../assets/cat1.jpg",
  "../assets/cat2.jpg",
  "../assets/cat3.jpg",
];

const urlList = baseList.map((item) => ({
  url: "http://m.baidu.com",
  img: item.img,
  fallbackImg: item.fallbackImg,
  title: `(可点击)${item.title}`,
}));

const demoList = imgList.map((one) => ({
  url: "javascript:",
  img: one,
}));

const only2ClickList = baseList.slice(0, 2).map((item) => {
  return {
    ...item,
    url: "http://m.baidu.com",
  };
});

export default defineComponent({
  components: {
    Swiper,
    SwiperItem,
    GroupTitle,
    XButton,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    const demo01_list = baseList;
    const demo02_list = demoList;
    const demo03_list = demoList;
    const demo04_list = imgList;
    const demo05_list = ref<any[]>(baseList);
    const demo06_list = urlList;
    const demo07_list = only2ClickList;

    const demo01_index = ref(0);
    const demo02_index = ref(1);
    const demo05_index = ref(0);
    const demo06_index = ref(0);
    const demo07_index = ref(0);
    const swiperItemIndex = ref(1);

    function onSwiperItemIndexChange(index: number) {
      console.log("demo item change", index);
    }
    function demo01_onIndexChange(index: number) {
      demo01_index.value = index;
    }
    function demo05_onIndexChange(index: number) {
      demo05_index.value = index;
    }
    function demo05_onLoad(id: number) {
      demo05_list.value = id === 1 ? baseList : demoList;
    }
    function demo06_onIndexChange(index: number) {
      demo06_index.value = index;
    }
    function demo07_onIndexChange(index: number) {
      demo07_index.value = index;
    }

    return {
      t,
      demo01_list,
      demo02_list,
      demo03_list,
      demo04_list,
      demo05_list,
      demo06_list,
      demo07_list,
      demo01_index,
      demo02_index,
      demo05_index,
      demo06_index,
      demo07_index,
      swiperItemIndex,
      onSwiperItemIndexChange,
      demo01_onIndexChange,
      demo05_onIndexChange,
      demo05_onLoad,
      demo06_onIndexChange,
      demo07_onIndexChange,
    };
  },
});
</script>

<style scoped>
.copyright {
  font-size: 12px;
  color: #ccc;
  text-align: center;
}
.text-scroll {
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
}
.text-scroll p {
  font-size: 12px;
  text-align: center;
  line-height: 30px;
}
.black {
  background-color: #000;
}
.title {
  line-height: 100px;
  text-align: center;
  color: #fff;
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
:deep(.wiux-indicator.custom-bottom) {
  bottom: 30px;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
.fadeInUp {
  animation-name: fadeInUp;
}
.swiper-demo-img img {
  width: 100%;
}
</style>