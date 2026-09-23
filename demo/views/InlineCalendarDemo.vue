<template>
  <div>
    <inline-calendar
      ref="calendar"
      @on-change="onChange"
      @on-view-change="onViewChange"
      class="inline-calendar-demo"
      v-model="value"
      start-date="2025-04-01"
      end-date="2028-05-30"
      :show-last-month="showLastMonth"
      :show-next-month="showNextMonth"
      :highlight-weekend="highlightWeekend"
      :return-six-rows="return6Rows"
      :hide-header="hideHeader"
      :hide-week-list="hideWeekList"
      :replace-text-list="replaceTextList"
      :weeks-list="weeksList"
      :render-function="buildSlotFn"
      :disable-past="disablePast"
      :disable-future="disableFuture"
      :disable-weekend="disableWeekend"
      :disable-date-function="disableDateFunction"
    ></inline-calendar>

    <group>
      <cell :title="t('Current value')" :value="value"></cell>
      <cell :title="t('Start date')" value="2025-04-01"></cell>
      <cell :title="t('End date')" value="2028-05-30"></cell>
    </group>

    <div style="margin: 15px">
      <x-button type="primary" @click="switchViewToToday">{{
        t("Switch to current month")
      }}</x-button>
      <x-button type="primary" @click="switchViewToMonth(2025, 12)"
        >{{ t("Switch to") }} 2025-12</x-button
      >
      <x-button type="primary" @click="switchViewToMonth(2027, 10)"
        >{{ t("Switch to") }} 2027-10</x-button
      >
      <x-button type="primary" @click="switchViewToCurrentValue">{{
        t("Switch to current value")
      }}</x-button>
    </div>

    <group :title="t('Control params')" style="margin-top: 30px">
      <x-switch v-model="disablePast" :title="t('Disable past')"></x-switch>
      <x-switch v-model="disableFuture" :title="t('Disable future')"></x-switch>
      <x-switch
        v-model="disableWeekend"
        :title="t('Disable weekend')"
      ></x-switch>
      <x-switch
        v-model="showLastMonth"
        :title="t('Show last month')"
      ></x-switch>
      <x-switch
        v-model="showNextMonth"
        :title="t('Show next month')"
      ></x-switch>
      <x-switch
        v-model="return6Rows"
        :title="t('Always show 6 rows')"
        :inline-desc="t('If not, the height of calendar would change')"
      ></x-switch>
      <x-switch
        v-model="highlightWeekend"
        :title="t('Highlight weekend')"
      ></x-switch>
      <cell :title="t('Current value')" :value="value"></cell>
    </group>
    <group :title="t('Control nav')">
      <x-switch
        v-model="hideHeader"
        :title="t('Hide calendar header')"
      ></x-switch>
      <x-switch v-model="hideWeekList" :title="t('Hide week list')"></x-switch>
      <x-switch
        v-model="changeWeeksList"
        :title="t('Change week list')"
      ></x-switch>
    </group>
    <group :title="t('Replace text')">
      <x-switch v-model="replace" :title="t('Replace date text')"></x-switch>
    </group>
    <br />
    <div style="margin: 15px">
      <x-button type="primary" @click="value = '2026-11-11'"
        >{{ t("Set time to") }} 2026-11-11</x-button
      >
      <x-button type="primary" @click="value = '2026-11-22'"
        >{{ t("Set time to") }} 2026-11-22</x-button
      >
      <x-button type="primary" @click="value = '2027-08-09'"
        >{{ t("Set time to") }} 2027-08-09</x-button
      >
      <x-button type="primary" @click="value = 'TODAY'">{{
        t("Set value as TODAY")
      }}</x-button>
      <x-button type="primary" @click="value = '2027-06-05'"
        >{{ t("Set time to") }} 2027-06-05</x-button
      >
    </div>
    <br />
    <group :title="t('Custom every day cell')">
      <x-switch
        v-model="useCustomFn"
        :title="t('Add custom contents in cell')"
        :inline-desc="t('Add red dot for dates ending in 8')"
      ></x-switch>
    </group>

    <br />

    <!-- <divider> 按月份顺序渲染一系列日历</divider>
    <group>
      <cell title="选中值" :value="listValue"></cell>
    </group> -->
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import {
  InlineCalendar,
  Group,
  Cell,
  XSwitch,
  XButton,
  Divider,
  useLocale,
} from "wiux";

export default defineComponent({
  components: {
    InlineCalendar,
    Group,
    Cell,
    XSwitch,
    XButton,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    const value = ref("");
    const listValue = ref("");
    const showLastMonth = ref(true);
    const showNextMonth = ref(true);
    const highlightWeekend = ref(false);
    const return6Rows = ref(true);
    const hideHeader = ref(false);
    const hideWeekList = ref(false);
    const replace = ref(false);
    const replaceTextList = ref<Record<string, string>>({});
    const changeWeeksList = ref(false);
    const weeksList = ref<string[]>([]);
    const useCustomFn = ref(false);
    const buildSlotFn = ref<Function>(() => "");
    const disablePast = ref(false);
    const disableFuture = ref(false);
    const disableWeekend = ref(false);

    const disableDateFunction = (date: any) => {
      if (date.formattedDate === "2017-10-16") {
        return true;
      }
    };

    const onChange = (val: any) => {
      console.log("on-change", val);
    };

    const onViewChange = (val: any, count: number) => {
      console.log("on view change", val, count);
    };

    const calendar = ref<any>(null);

    const switchViewToToday = () => {
      if (calendar.value) {
        calendar.value.switchViewToToday();
      }
    };

    const switchViewToMonth = (year: number, month: number) => {
      if (calendar.value) {
        calendar.value.switchViewToMonth(year, month);
      }
    };

    const switchViewToCurrentValue = () => {
      if (calendar.value) {
        calendar.value.switchViewToCurrentValue();
      }
    };

    watch(replace, (val) => {
      replaceTextList.value = val ? { TODAY: "今" } : {};
    });

    watch(useCustomFn, (val) => {
      buildSlotFn.value = val
        ? (line: number, index: number, data: any) => {
            return /8/.test(data.date)
              ? '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>'
              : '<div style="height:19px;"></div>';
          }
        : () => "";
    });

    watch(changeWeeksList, (val) => {
      weeksList.value = val
        ? ["日", "一", "二", "三", "四", "五", "六"]
        : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    });

    return {
      t,
      calendar,
      value,
      listValue,
      showLastMonth,
      showNextMonth,
      highlightWeekend,
      return6Rows,
      hideHeader,
      hideWeekList,
      replace,
      replaceTextList,
      changeWeeksList,
      weeksList,
      useCustomFn,
      buildSlotFn,
      disablePast,
      disableFuture,
      disableWeekend,
      disableDateFunction,
      onChange,
      onViewChange,
      switchViewToToday,
      switchViewToMonth,
      switchViewToCurrentValue,
    };
  },
});
</script>

<style lang="less" scoped>
.inline-calendar-demo {
  background: rgba(255, 255, 255, 0.9);
}
</style>
