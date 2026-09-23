<template>
  <div>
    <divider>{{ t("A Horizontal Scroller without Scrollbar") }}</divider>
    <scroller lock-y :scrollbar-x="false">
      <div class="box1">
        <div class="box1-item" v-for="i in 7" :key="i">
          <span>{{ " " + i + " " }}</span>
        </div>
      </div>
    </scroller>

    <divider>{{ t("A Horizontal Scroller with Scrollbar") }}</divider>
    <scroller lock-y :scrollbar-x="true">
      <div class="box1">
        <div class="box1-item" v-for="i in 7" :key="i">
          <span>{{ " " + i + " " }}</span>
        </div>
      </div>
    </scroller>

    <divider>{{ t("A Horizontal Scroller without bounce effect") }}</divider>
    <scroller lock-y :scrollbar-x="true" :bounce="false">
      <div class="box1">
        <div class="box1-item" v-for="i in 7" :key="i">
          <span>{{ " " + i + " " }}</span>
        </div>
      </div>
    </scroller>

    <divider>{{ scrollTopTitle }}</divider>
    <scroller
      lock-x
      height="200px"
      @on-scroll="onScroll"
      ref="scrollerEventRef"
    >
      <div class="box2">
        <p v-for="i in 80" :key="i">placeholder {{ i }}</p>
      </div>
    </scroller>

    <x-button
      type="primary"
      @click="() => scrollerEventRef?.reset({ top: 0 })"
      >{{ t("reset") }}</x-button
    >

    <divider>{{ t("event:on-scroll-bottom") }}</divider>
    <scroller
      lock-x
      height="200px"
      @on-scroll-bottom="onScrollBottom"
      ref="scrollerBottomRef"
      :scroll-bottom-offset="200"
    >
      <div class="box2">
        <p v-for="i in bottomCount" :key="i">placeholder {{ i }}</p>
        <load-more tip="loading"></load-more>
      </div>
    </scroller>

    <divider>{{ t("A Vertical Scroller with scrollbar") }}</divider>
    <scroller lock-x :scrollbar-y="true" height="200px" ref="scrollerRef">
      <div class="box2">
        <p v-for="i in 20" :key="i" v-if="showList1">
          placeholder {{ i + "" + i }}
        </p>
        <p v-for="i in 10" :key="i" v-if="!showList1">placeholder {{ i }}</p>
        <x-button
          style="margin: 10px 0"
          type="primary"
          @click="onClickButton"
          >{{ t("Button") }}</x-button
        >
        <group>
          <cell
            @click="onCellClick"
            :title="t('Title')"
            :value="t('Value')"
          ></cell>
        </group>
      </div>
    </scroller>
    <x-button @click="changeList" type="primary">{{
      t("show another list")
    }}</x-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, computed } from "vue";
import {
  Scroller,
  Divider,
  XButton,
  Group,
  Cell,
  useToast,
  LoadMore,
  useLocale,
} from "wiux";

const toast = useToast();

export default defineComponent({
  name: "ScrollerDemo",
  components: {
    Scroller,
    Divider,
    XButton,
    Group,
    Cell,
    LoadMore,
  },
  setup() {
    const { t } = useLocale();
    const showList1 = ref(true);
    const scrollTop = ref(0);
    const onFetching = ref(false);
    const bottomCount = ref(20);
    const scrollerEventRef = ref<any>(null);
    const scrollerBottomRef = ref<any>(null);
    const scrollerRef = ref<any>(null);

    const scrollTopTitle = computed(
      () => t("A Vertical Scroller") + " scrollTop: " + scrollTop.value,
    );

    function onScrollBottom() {
      if (onFetching.value) {
        return;
      }
      onFetching.value = true;
      setTimeout(() => {
        bottomCount.value += 10;
        nextTick(() => {
          scrollerBottomRef.value?.reset();
        });
        onFetching.value = false;
      }, 2000);
    }

    function onScroll(pos: { top: number; left: number }) {
      scrollTop.value = pos.top;
    }

    function onCellClick() {
      toast.text("I'm on bottom.");
    }

    function onClickButton() {
      toast.text("I'm on top.");
    }

    function changeList() {
      showList1.value = false;
      nextTick(() => {
        scrollerRef.value?.reset({ top: 0 });
      });
    }

    return {
      t,
      showList1,
      scrollTop,
      scrollTopTitle,
      onFetching,
      bottomCount,
      scrollerEventRef,
      scrollerBottomRef,
      scrollerRef,
      onScrollBottom,
      onScroll,
      onCellClick,
      onClickButton,
      changeList,
    };
  },
});
</script>

<style scoped>
.box1 {
  height: 100px;
  position: relative;
  width: 1490px;
}
.box1-item {
  width: 200px;
  height: 100px;
  background-color: #ccc;
  display: block;
  margin-left: 15px;
  float: left;
  text-align: center;
  line-height: 100px;
}
.box1-item:first-child {
  margin-left: 0;
}
.box2-wrap {
  height: 300px;
  overflow: hidden;
}
.box2 p {
  padding: 3px 15px;
  margin: 0;
}
</style>
