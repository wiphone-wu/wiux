<template>
  <div>
    <group>
      <calendar
        :readonly="readonly"
        v-model="demo1"
        :title="t('Basic Usage')"
        disable-past
        :placeholder="t('Please select')"
        @on-show="log('show')"
        @on-hide="log('hide')"
      ></calendar>
    </group>

    <div style="padding: 15px">
      <x-button type="primary" @click="readonly = !readonly">{{
        t("Toggle readonly")
      }}</x-button>
    </div>

    <group>
      <calendar
        v-model="demo2"
        :title="t('Set value as TODAY')"
        disable-past
      ></calendar>
    </group>

    <group>
      <calendar
        @on-change="onChange"
        v-model="demo3"
        :title="t('Disable future')"
        disable-future
      ></calendar>
    </group>

    <group>
      <calendar
        @on-change="onChange"
        v-model="demo4"
        :title="t('Show popup header')"
        show-popup-header
        :popup-header-title="t('Please select date')"
        disable-future
      ></calendar>
    </group>

    <group>
      <calendar
        :placeholder="t('Please select date')"
        @on-change="onChange"
        v-model="demo5"
        :title="t('Multiple dates')"
        :popup-header-title="t('Please select date')"
        disable-future
      ></calendar>
    </group>

    <group>
      <calendar
        disable-weekend
        :display-format="displayFormat"
        :placeholder="t('Please select date')"
        @on-change="onChange"
        v-model="demo6"
        :title="t('Format multiple dates')"
        :popup-header-title="t('Please select date')"
      ></calendar>
      <cell-box align-items="flex-start">
        <span class="selected-days">value:</span>
        <div>
          <badge
            v-for="day in demo6"
            :text="day"
            :key="day"
            style="margin-right: 10px"
          ></badge>
        </div>
      </cell-box>
    </group>
    <div style="padding: 15px">
      <x-button type="primary" @click="demo6 = []">{{
        t("Empty value")
      }}</x-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Calendar, Group, Badge, CellBox, XButton, useLocale } from "wiux";

export default defineComponent({
  components: {
    Calendar,
    Group,
    Badge,
    CellBox,
    XButton,
  },
  setup() {
    const { t } = useLocale();

    const readonly = ref(false);
    const demo1 = ref("");
    const demo2 = ref("TODAY");
    const demo3 = ref("TODAY");
    const demo4 = ref("TODAY");
    const demo5 = ref<string[]>([]);
    const demo6 = ref<string[]>([]);

    const displayFormat = (value: any, type: string) => {
      if (type === "string") {
        return value;
      } else {
        return value.length ? value.length + " days" : "";
      }
    };

    const log = (str: string) => {
      console.log(str);
    };

    const onChange = (val: any) => {
      console.log("on change", val);
    };

    return {
      t,
      readonly,
      demo1,
      demo2,
      demo3,
      demo4,
      demo5,
      demo6,
      displayFormat,
      log,
      onChange,
    };
  },
});
</script>

<style scoped>
.selected-days {
  color: #999;
  width: 90px;
}
</style>
