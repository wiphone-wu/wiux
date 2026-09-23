<template>
  <div>
    <div style="padding: 15px">
      <x-button type="primary" plain @click="showPlugin">{{
        t("Use in Composable")
      }}</x-button>
    </div>

    <group :title="t('Default format: YYYY-MM-DD')">
      <datetime
        v-model="value1"
        @on-change="change"
        :title="t('Birthday')"
        @on-cancel="log('cancel')"
        @on-confirm="onConfirm"
        @on-hide="log('hide', $event)"
      ></datetime>
    </group>

    <group :title="t('Custom minute list: every 15 minutes')">
      <datetime
        v-model="minuteListValue"
        format="YYYY-MM-DD HH:mm"
        :minute-list="['00', '15', '30', '45']"
        @on-change="change"
        :title="t('Birthday')"
      ></datetime>
    </group>

    <group :title="t('Custom hour list')">
      <datetime
        v-model="hourListValue"
        format="YYYY-MM-DD HH:mm"
        :hour-list="['09', '10', '11', '12', '13', '14', '15', '16']"
        :minute-list="['00', '15', '30', '45']"
        @on-change="change"
        :title="t('Birthday')"
      ></datetime>
    </group>

    <group title="Readonly">
      <datetime
        v-model="valueReadonly"
        :readonly="readonly"
        @on-change="change"
        :title="t('Birthday')"
      ></datetime>
    </group>
    <div style="padding: 15px">
      <x-button type="primary" plain @click="readonly = !readonly">{{
        t("Toggle readonly")
      }}</x-button>
    </div>

    <group :title="t('Format display value')">
      <datetime
        v-model="formatValue"
        :display-format="formatValueFunction"
        @on-change="change"
        :title="t('Birthday')"
      ></datetime>
    </group>

    <div style="padding: 15px">
      <x-button type="primary" @click="formatValue = '2017-11-11'"
        >{{ t("Set time to") }} 2027-11-11</x-button
      >
    </div>

    <group :title="t('Define range of hours')">
      <datetime
        v-model="limitHourValue"
        format="YYYY-MM-DD HH:mm"
        :min-hour="9"
        :max-hour="18"
        @on-change="change"
        :title="t('Define range of hours')"
        :inline-desc="t('Working hours: 09 ~ 18')"
      ></datetime>
    </group>

    <group
      :title="t('Set start-date and end-date') + ' 2025-11-11 ~ 2027-10-11'"
    >
      <datetime
        v-model="limitHourValue"
        :start-date="startDate"
        :end-date="endDate"
        format="YYYY-MM-DD HH:mm"
        @on-change="change"
        :title="t('Start time')"
      ></datetime>
    </group>

    <group :title="t('Set end-date only') + ' 2027-10-11'">
      <datetime
        v-model="onlySetEndDateValue"
        :end-date="onlySetEndDate"
        format="YYYY-MM-DD HH:mm"
        @on-change="change"
        :title="t('Start time')"
      ></datetime>
    </group>

    <group :title="t('Format') + ': ' + format">
      <datetime
        v-model="value2"
        :format="format"
        @on-change="change"
        :title="t('Start time')"
      ></datetime>
    </group>

    <div style="padding: 15px">
      <x-button type="primary" @click="toggleFormat">{{
        t("Toggle format")
      }}</x-button>
    </div>

    <group :title="t('12-hour clock')">
      <datetime
        :title="t('AM/PM')"
        v-model="noonValue"
        format="YYYY-MM-DD A"
      ></datetime>
    </group>

    <group :title="t('Placeholder')">
      <datetime
        v-model="value3"
        default-selected-value="2017-06-18 13"
        format="YYYY-MM-DD HH"
        :placeholder="t('Please select')"
        @on-change="change"
        :title="t('Start time')"
      ></datetime>
    </group>

    <group :title="t('Set default-selected-value to') + ' 2027-11-11'">
      <datetime
        v-model="value3_1"
        default-selected-value="2027-11-11"
        format="YYYY-MM-DD"
        :placeholder="t('Please select')"
        @on-change="change"
        :title="t('Start time')"
        :inline-desc="t('Current value') + ': ' + value3_1"
      ></datetime>
    </group>

    <group :title="t('Set min-year and max-year')">
      <datetime
        v-model="value4"
        :placeholder="t('Please select')"
        :min-year="2020"
        :max-year="2026"
        format="YYYY-MM-DD HH:mm"
        @on-change="change"
        :title="t('Years after 2020')"
      ></datetime>
    </group>

    <group :title="t('Prop: compute-hours-function')">
      <datetime
        format="YYYY-MM-DD HH"
        v-model="computeHoursValue"
        :compute-hours-function="computeHoursFunction"
        :title="t('Birthday')"
        @on-change="change"
      ></datetime>
    </group>

    <group :title="t('Prop: compute-days-function')">
      <datetime
        format="YYYY-MM-DD HH"
        v-model="computeDaysValue"
        :compute-days-function="computeDaysFunction"
        :title="t('Birthday')"
        @on-change="change"
      ></datetime>
    </group>

    <group :title="t('Specified template text in Chinese')">
      <datetime
        v-model="value5"
        :placeholder="t('Please select')"
        :min-year="2020"
        :max-year="2026"
        format="YYYY-MM-DD HH:mm"
        @on-change="change"
        :title="t('Specified template text in Chinese')"
        year-row="{value}年"
        month-row="{value}月"
        day-row="{value}日"
        hour-row="{value}点"
        minute-row="{value}分"
        confirm-text="完成"
        cancel-text="取消"
      ></datetime>
    </group>

    <group :title="t('Show center button and clear the value')">
      <datetime
        v-model="value6"
        @on-change="change"
        :title="t('Birthday')"
        :clear-text="t('Clear')"
        @on-clear="clearValue"
      ></datetime>
    </group>

    <group :title="t('Show center button to set date to today')">
      <datetime
        v-model="value7"
        @on-change="change"
        :title="t('Birthday')"
        :clear-text="t('Today')"
        @on-clear="setToday"
      ></datetime>
    </group>

    <group :title="t('Custom trigger slot')">
      <datetime
        v-model="value7"
        @on-change="change"
        :title="t('Birthday')"
        :clear-text="t('Today')"
        @on-clear="setToday"
      >
        <x-button>{{ t("Click me") }}</x-button>
      </datetime>
    </group>

    <group :title="t('Required')">
      <datetime
        v-model="value8"
        :title="t('Required')"
        :clear-text="t('Clear')"
        @on-clear="clearValue8"
        :required="true"
      ></datetime>
    </group>

    <group :title="t('Use prop: show.sync to control visibility')">
      <datetime
        v-model="value9"
        @on-change="change"
        :title="t('Birthday')"
        :show="visibility"
        @update:show="visibility = $event"
      ></datetime>
    </group>

    <div style="padding: 15px">
      <x-button type="primary" plain @click="visibility = true">{{
        t("Show")
      }}</x-button>
    </div>

    <group :title="t('Default format: YYYY-MM-DD')">
      <datetime
        :order-map="{
          year: 3,
          month: 2,
          day: 1,
        }"
        v-model="value1"
        @on-change="change"
        :title="t('Customize column order')"
        @on-cancel="log('cancel')"
        @on-confirm="onConfirm"
        @on-hide="log('hide', $event)"
      ></datetime>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Group, Datetime, XButton, useLocale, useDatetime } from "wiux";

export default defineComponent({
  components: {
    Group,
    Datetime,
    XButton,
  },
  setup() {
    const { t } = useLocale();
    const datetimePlugin = useDatetime();
    const readonly = ref(true);
    const minuteListValue = ref("2027-06-12 09:00");
    const hourListValue = ref("2027-06-12 09:00");
    const format = ref("YYYY-MM-DD HH:mm");
    const value1 = ref("2025-11-12");
    const valueReadonly = ref("2025-11-12");
    const value2 = ref("");
    const value3 = ref("");
    const value3_1 = ref("");
    const value4 = ref("");
    const value5 = ref("");
    const value6 = ref("2026-08-18");
    const value7 = ref("");
    const value8 = ref("");
    const limitHourValue = ref("");
    const startDate = "2025-11-11";
    const endDate = "2027-10-11";
    const formatValue = ref("2027-10-11");
    const noonValue = ref("2028-04-13 PM");
    const value9 = ref("");
    const visibility = ref(false);
    const computeHoursValue = ref("");
    const computeDaysValue = ref("");
    const onlySetEndDate = "2027-10-11";
    const onlySetEndDateValue = ref("");

    function formatValueFunction(val: string) {
      return val.replace(/-/g, "$");
    }

    function computeHoursFunction(
      date: Date,
      isToday: boolean,
      generateRange: Function,
    ) {
      if (isToday) {
        return generateRange(new Date().getHours(), 23);
      } else {
        return generateRange(0, 23);
      }
    }

    function computeDaysFunction(options: any, generateRange: Function) {
      return [options.month];
    }

    function log(str1: string, str2: string = "") {
      console.log(str1, str2);
    }

    function onConfirm(val: string) {
      console.log("on-confirm arg", val);
      console.log("current value", value1.value);
    }

    function toggleFormat() {
      if (format.value === "YYYY-MM-DD") {
        format.value = "YYYY-MM-DD HH:mm";
      } else if (format.value === "YYYY-MM-DD HH:mm") {
        format.value = "YYYY-MM-DD";
      }
    }

    function change(value: string) {
      console.log("change", value);
    }

    function clearValue(value: string) {
      value6.value = "";
    }

    function clearValue8(value: string) {
      value8.value = "";
    }

    function setToday(value: string) {
      const now = new Date();
      let month: string | number = now.getMonth() + 1;
      let day: string | number = now.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      value7.value = now.getFullYear() + "-" + month + "-" + day;
      console.log("set today ok");
    }

    function showPlugin() {
      datetimePlugin.show({
        cancelText: "取消",
        confirmText: "确定",
        format: "YYYY-MM-DD HH",
        value: "2027-05-20 18",
        onConfirm(val: string) {
          console.log("plugin confirm", val);
        },
        onShow() {
          console.log("plugin show");
        },
        onHide() {
          console.log("plugin hide");
        },
      });
    }

    return {
      t,
      readonly,
      minuteListValue,
      hourListValue,
      format,
      value1,
      valueReadonly,
      value2,
      value3,
      value3_1,
      value4,
      value5,
      value6,
      value7,
      value8,
      limitHourValue,
      startDate,
      endDate,
      formatValue,
      noonValue,
      value9,
      visibility,
      computeHoursValue,
      computeDaysValue,
      onlySetEndDate,
      onlySetEndDateValue,
      formatValueFunction,
      computeHoursFunction,
      computeDaysFunction,
      log,
      onConfirm,
      toggleFormat,
      change,
      clearValue,
      clearValue8,
      setToday,
      showPlugin,
    };
  },
});
</script>
