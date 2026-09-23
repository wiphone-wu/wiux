<template>
  <div>
    <tab>
      <tab-item selected @on-item-click="onItemClick">{{
        t("Shipped")
      }}</tab-item>
      <tab-item @on-item-click="onItemClick">{{ t("Not shipped") }}</tab-item>
      <tab-item @on-item-click="onItemClick">{{ t("All orders") }}</tab-item>
    </tab>
    <br />
    <br />
    <tab bar-position="top">
      <tab-item selected @on-item-click="onItemClick">{{
        t("Shipped")
      }}</tab-item>
      <tab-item @on-item-click="onItemClick">{{ t("Not shipped") }}</tab-item>
      <tab-item @on-item-click="onItemClick">{{ t("All orders") }}</tab-item>
    </tab>
    <br />
    <br />
    <divider>{{ t("Manual switch") }}</divider>
    <tab v-model="index01" prevent-default @on-beforeChange="switchTabItem">
      <tab-item selected>{{ t("Shipped") }}</tab-item>
      <tab-item>{{ t("Not shipped") }}</tab-item>
      <tab-item>{{ t("All orders") }}</tab-item>
    </tab>
    <br />
    <br />
    <divider>{{ t("Fixed bar width") }}</divider>
    <tab :line-width="1" custom-bar-width="60px">
      <tab-item selected>{{ t("Shipped") }}</tab-item>
      <tab-item>{{ t("Not shipped") }}</tab-item>
      <tab-item>{{ t("All orders") }}</tab-item>
    </tab>
    <br />
    <br />
    <divider>{{ t("Define bar width with function") }}</divider>
    <tab :line-width="1" :custom-bar-width="getBarWidth">
      <tab-item selected>AA</tab-item>
      <tab-item>AAAA</tab-item>
      <tab-item>AAAAAAA</tab-item>
    </tab>
    <br />
    <br />
    <br />
    <divider>{{ t("Set bar color") }}</divider>
    <tab bar-active-color="#668599" :line-width="1">
      <tab-item>{{ t("Shipped") }}</tab-item>
      <tab-item selected>{{ t("Not shipped") }}</tab-item>
      <tab-item>{{ t("All orders") }}</tab-item>
      <tab-item>{{ t("All orders") }}</tab-item>
      <tab-item>{{ t("All orders") }}</tab-item>
    </tab>

    <br />
    <br />
    <br />
    <divider>{{ t("Set different active styles") }}</divider>
    <tab :animate="false">
      <tab-item active-class="active-6-1">{{ t("Shipped") }}</tab-item>
      <tab-item active-class="active-6-2" selected>{{
        t("Not shipped")
      }}</tab-item>
      <tab-item active-class="active-6-3">{{ t("All orders") }}</tab-item>
    </tab>
    <br />
    <br />
    <br />
    <divider>{{ t("No animation animate=false") }}</divider>
    <tab :animate="false">
      <tab-item>{{ t("Shipped") }}</tab-item>
      <tab-item selected>{{ t("Not shipped") }}</tab-item>
      <tab-item>{{ t("All orders") }}</tab-item>
    </tab>
    <br />
    <br />
    <br />
    <divider>{{ t("Not full width") }}</divider>
    <tab style="width: 80%">
      <tab-item>{{ t("Shipped") }}</tab-item>
      <tab-item selected>{{ t("Not shipped") }}</tab-item>
      <tab-item>{{ t("All orders") }}</tab-item>
    </tab>
    <br />
    <br />
    <br />
    <divider>{{ t("Disabled tab") }}</divider>
    <tab>
      <tab-item selected>A</tab-item>
      <tab-item>B</tab-item>
      <tab-item disabled>{{ t("Disabled") }}</tab-item>
    </tab>
    <br />
    <br />
    <br />
    <divider>{{ t("Set badge") }}</divider>
    <tab>
      <tab-item selected badge-label="1">{{ t("Received messages") }}</tab-item>
      <tab-item badge-background="#38C972" badge-color="#fff" badge-label="2">{{
        t("Sent messages")
      }}</tab-item>
    </tab>
    <br />
    <br />
    <br />
    <divider>{{ t("Auto scroll") }}</divider>
    <tab>
      <tab-item v-for="n in 8" :key="n" :selected="n === 1">{{
        t("Shipped") + n
      }}</tab-item>
    </tab>
    <br />
    <br />
    <br />
    <divider>{{ t("Set scroll threshold") }}</divider>
    <tab :scroll-threshold="5">
      <tab-item v-for="n in 5" :key="n" :selected="n === 1">{{
        t("Shipped") + n
      }}</tab-item>
    </tab>
    <br />
    <br />
    <br />
    <div>
      <tab :line-width="2" active-color="#fc378c" v-model="index">
        <tab-item
          class="wiux-center"
          :selected="demo2 === item"
          v-for="(item, idx) in list2"
          @click="demo2 = item"
          :key="idx"
          >{{ item }}</tab-item
        >
      </tab>
      <swiper v-model="index" height="100px" :show-dots="false">
        <swiper-item v-for="(item, idx) in list2" :key="idx">
          <div class="tab-swiper wiux-center">
            {{ item }} {{ t(" Container") }}
          </div>
        </swiper-item>
      </swiper>
    </div>

    <br />
    <div class="box">
      <x-button @click="index = 0" :disabled="index === 0" type="primary">{{
        t("go to 0")
      }}</x-button>
      <x-button @click="index = 1" :disabled="index === 1" type="primary">{{
        t("go to 1")
      }}</x-button>

      <x-button @click="addTab" :disabled="list2.length === 5" type="primary">{{
        t("Add tab item")
      }}</x-button>
      <x-button
        @click="removeTab"
        :disabled="list2.length <= 2"
        type="primary"
        >{{ t("Remove tab item") }}</x-button
      >
      <x-button @click="next" type="primary">{{
        t("Active next current: ") + index
      }}</x-button>
      <x-button @click="prev" type="primary">{{
        t("Active prev current: ") + index
      }}</x-button>
    </div>

    <br />
    <br />
    <tab :line-width="2">
      <tab-item
        :selected="demo3 === item"
        v-for="(item, idx) in list3"
        :class="{ 'wiux-1px-r': idx === 0 }"
        @click="demo3 = item"
        :key="idx"
        >{{ item }}</tab-item
      >
    </tab>
    <br />
    <br />
    <br />
    <divider>{{ t("scroll tab (sticky demo)") }}</divider>
    <sticky
      scroll-box="wiux_view_box_body"
      :check-sticky-support="false"
      :offset="46"
    >
      <tab :line-width="1">
        <tab-item
          :selected="demo4 === item"
          v-for="(item, idx) in list4"
          @click="demo4 = item"
          :key="idx"
          >{{ item }}</tab-item
        >
      </tab>
    </sticky>
    <br v-for="i in 40" :key="i" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import {
  Tab,
  TabItem,
  Divider,
  XButton,
  Swiper,
  SwiperItem,
  Sticky,
  useLoading,
  useLocale,
} from "wiux";

const loading = useLoading();

export default defineComponent({
  components: {
    Tab,
    TabItem,
    Divider,
    XButton,
    Swiper,
    SwiperItem,
    Sticky,
  },
  setup() {
    const { t, locale } = useLocale();

    const index01 = ref(0);

    const list2 = ref([
      t("Featured"),
      t("Food"),
      t("Movie"),
      t("Hotel"),
      t("Delivery"),
    ]);
    const demo2 = ref(t("Food"));

    const list3 = ref([t("Received messages"), t("Sent messages")]);
    const demo3 = ref(t("Received messages"));

    const list4 = ref([t("Now screening"), t("Upcoming")]);
    const demo4 = ref(t("Upcoming"));

    const index = ref(0);

    watch(locale, () => {
      list2.value = ["Featured", "Food", "Movie", "Hotel", "Delivery"].map(
        (key) => t(key),
      );
      demo2.value = t("Food");
      list3.value = ["Received messages", "Sent messages"].map((key) => t(key));
      demo3.value = t("Received messages");
      list4.value = ["Now screening", "Upcoming"].map((key) => t(key));
      demo4.value = t("Upcoming");
    });

    const getBarWidth = (idx: number) => {
      return (idx + 1) * 22 + "px";
    };

    const switchTabItem = (idx: number) => {
      console.log("on-beforeChange", idx);
      loading.show({
        text: t("loading"),
      });
      setTimeout(() => {
        loading.hide();
        index01.value = idx;
      }, 1000);
    };

    const onItemClick = (idx: number) => {
      console.log("on item click:", idx);
    };

    const addTab = () => {
      list2.value = [...list2.value, t("New")];
    };

    const removeTab = () => {
      list2.value = list2.value.slice(0, -1);
    };

    const next = () => {
      if (index.value < list2.value.length - 1) {
        index.value++;
      } else {
        index.value = 0;
      }
    };

    const prev = () => {
      if (index.value > 0) {
        index.value--;
      } else {
        index.value = list2.value.length - 1;
      }
    };

    return {
      t,
      index01,
      list2,
      demo2,
      list3,
      demo3,
      list4,
      demo4,
      index,
      getBarWidth,
      switchTabItem,
      onItemClick,
      addTab,
      removeTab,
      next,
      prev,
    };
  },
});
</script>

<style scoped>
.box {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 10px;
}

.box .wiux-button {
  margin-top: 0;
}

.tab-swiper {
  background: #e8e8e8;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active-6-1 {
  color: rgb(252, 55, 140) !important;
  border-color: rgb(252, 55, 140) !important;
}
.active-6-2 {
  color: #04be02 !important;
  border-color: #04be02 !important;
}
.active-6-3 {
  color: rgb(55, 174, 252) !important;
  border-color: rgb(55, 174, 252) !important;
}
.tab-swiper {
  background-color: #fff;
  height: 100px;
}
</style>
