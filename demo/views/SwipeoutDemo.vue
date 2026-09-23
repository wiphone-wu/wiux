<template>
  <div>
    <div class="wiux-1px-t">
      <swipeout>
        <swipeout-item
          @on-close="handleEvents('on-close')"
          @on-open="handleEvents('on-open')"
          transition-mode="follow"
        >
          <template #right-menu>
            <swipeout-button @click="onButtonClick('fav')" type="primary">{{
              t("Yes")
            }}</swipeout-button>
            <swipeout-button @click="onButtonClick('delete')" type="warn">{{
              t("Right")
            }}</swipeout-button>
          </template>
          <template #content>
            <div class="demo-content wiux-1px-t">
              {{ t("JavaScript is the best language") }}
            </div>
          </template>
        </swipeout-item>

        <swipeout-item :threshold="0.5" underlay-color="#ccc">
          <template #right-menu>
            <swipeout-button
              @click="onButtonClick('fav')"
              background-color="#336DD6"
              >{{ t("Fav") }}</swipeout-button
            >
            <swipeout-button
              @click="onButtonClick('delete')"
              background-color="#D23934"
              :disabled="true"
              >{{ t("Delete") }}</swipeout-button
            >
          </template>
          <template #content>
            <div class="demo-content wiux-1px-tb">
              {{ t("threshold = 0.5") }}
            </div>
          </template>
        </swipeout-item>

        <swipeout-item
          :disabled="disabled"
          ref="swipeoutItemRef"
          :sensitivity="15"
        >
          <template #right-menu>
            <swipeout-button
              @click="onButtonClick('fav')"
              type="primary"
              :width="70"
              >{{ t("Fav") }}</swipeout-button
            >
            <swipeout-button
              @click="onButtonClick('delete')"
              type="warn"
              :width="70"
              >{{ t("Delete") }}</swipeout-button
            >
            <swipeout-button
              @click="onButtonClick('ignore')"
              type="default"
              :width="70"
              >{{ t("Ignore") }}</swipeout-button
            >
          </template>

          <template #left-menu>
            <swipeout-button @click="onButtonClick('fav')" type="primary">{{
              t("Fav")
            }}</swipeout-button>
            <swipeout-button @click="onButtonClick('delete')" type="warn">{{
              t("Delete")
            }}</swipeout-button>
          </template>

          <template #content>
            <div class="demo-content wiux-1px-b">
              {{ statusText }}
            </div>
          </template>
        </swipeout-item>
      </swipeout>
    </div>

    <div style="padding: 15px">
      <x-button
        @click="disabled = false"
        type="primary"
        :disabled="!disabled"
        >{{ t("set Enabled") }}</x-button
      >
      <x-button @click="disabled = true" type="warn" :disabled="disabled">{{
        t("set Disabled")
      }}</x-button>
      <x-button @click="() => swipeoutItemRef?.open('left')" type="primary">{{
        t("open left menu")
      }}</x-button>
      <x-button @click="() => swipeoutItemRef?.open('right')" type="primary">{{
        t("open right menu")
      }}</x-button>
      <x-button @click="() => swipeoutItemRef?.close()" type="warn">{{
        t("close menu")
      }}</x-button>
    </div>
    <br />
    <group-title>{{ t("Use wiux-1px style") }}</group-title>
    <swipeout class="wiux-1px-tb">
      <swipeout-item transition-mode="follow" v-for="i in 3" :key="i">
        <template #right-menu>
          <swipeout-button type="primary">{{ t("Yes") }}</swipeout-button>
          <swipeout-button type="warn">{{ t("Right") }}</swipeout-button>
        </template>
        <template #content>
          <div
            :class="{ 'wiux-1px-b': i !== 3, 'wiux-1px-t': i === 1 }"
            style="padding: 12px"
          >
            {{ t("JavaScript is the best language") }}
          </div>
        </template>
      </swipeout-item>
    </swipeout>
    <br />
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import {
  swipeout,
  swipeoutItem,
  swipeoutButton,
  XButton,
  GroupTitle,
  useToast,
  useLocale,
} from "wiux";

const toast = useToast();
export default defineComponent({
  name: "swipeoutDemo",
  components: {
    swipeout,
    swipeoutItem,
    swipeoutButton,
    XButton,
    GroupTitle,
  },
  setup() {
    const { t } = useLocale();
    const disabled = ref(false);
    const swipeoutItemRef = ref<any>(null);

    const statusText = computed(() =>
      disabled.value ? t("now disabled") : t("now enabled"),
    );

    function onButtonClick(type: string) {
      toast.text("on button click " + type);
    }

    function handleEvents(type: string) {
      console.log("event: ", type);
    }

    return {
      t,
      disabled,
      swipeoutItemRef,
      statusText,
      onButtonClick,
      handleEvents,
    };
  },
});
</script>

<style lang="less">
@import "../../src/styles/1px.less";

.demo-content {
  padding: 10px 10px;
}
</style>
