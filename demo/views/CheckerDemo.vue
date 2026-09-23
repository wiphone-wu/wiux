<template>
  <div style="padding: 15px 0">
    <divider>{{ t("Radio: no default value") }}</divider>
    <div class="box">
      <checker
        v-model="demo1"
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
      >
        <checker-item value="1">{{ t("A") }}</checker-item>
        <checker-item value="2">{{ t("B") }}</checker-item>
        <checker-item value="3">{{ t("C") }}</checker-item>
        <checker-item value="4">{{ t("D") }}</checker-item>
        <checker-item value="5">{{ t("E") }}</checker-item>
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo1 }}</span>
      <br />
    </div>

    <divider>radioRequired</divider>
    <div class="box">
      <checker
        v-model="demo1Required"
        radio-required
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
      >
        <checker-item value="1">{{ t("A") }}</checker-item>
        <checker-item value="2">{{ t("B") }}</checker-item>
        <checker-item value="3">{{ t("C") }}</checker-item>
        <checker-item value="4">{{ t("D") }}</checker-item>
        <checker-item value="5">{{ t("E") }}</checker-item>
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo1Required }}</span>
      <br />
    </div>

    <divider>{{ t("Radio: Object value") }}</divider>
    <div class="box">
      <checker
        v-model="demo11"
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
      >
        <checker-item
          :value="item"
          v-for="(item, index) in items1"
          :key="index"
          >{{ item.value }}</checker-item
        >
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo11 }}</span>
      <br />
      <br />
      <checker
        v-model="demo12"
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
      >
        <checker-item
          :value="item"
          v-for="(item, index) in items1"
          :key="index"
          >{{ item.value }}</checker-item
        >
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo12 }}</span>
      <br />
    </div>

    <divider>{{ t("Checkbox: Object value") }}</divider>
    <div class="box">
      <checker
        v-model="demo21"
        type="checkbox"
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
      >
        <checker-item
          :value="item"
          v-for="(item, index) in items1"
          :key="index"
          >{{ item.value }}</checker-item
        >
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo21 }}</span>
      <br />
      <br />
      <checker
        v-model="demo22"
        type="checkbox"
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
      >
        <checker-item
          :value="item"
          v-for="(item, index) in items1"
          :key="index"
          >{{ item.value }}</checker-item
        >
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo22 }}</span>
      <br />
      <br />
      <checker
        v-model="demo23"
        type="checkbox"
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
        :max="2"
      >
        <checker-item
          :value="item"
          v-for="(item, index) in items1"
          :key="index"
          >{{ item.value }}</checker-item
        >
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo23 }}</span>
      <br />
    </div>

    <divider>{{ t("Checkbox") }}</divider>
    <div class="box">
      <checker
        v-model="demo1Checkbox"
        type="checkbox"
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
      >
        <checker-item :value="1">{{ t("F") }}</checker-item>
        <checker-item :value="2">{{ t("G") }}</checker-item>
        <checker-item :value="3">{{ t("H") }}</checker-item>
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo1Checkbox }}</span>
      <br />
    </div>

    <divider>{{ t("Checkbox with max limit 2") }}</divider>
    <div class="box">
      <checker
        v-model="demo1CheckboxMax"
        :max="2"
        type="checkbox"
        default-item-class="demo1-item"
        selected-item-class="demo1-item-selected"
      >
        <checker-item value="1">1</checker-item>
        <checker-item value="2">2</checker-item>
        <checker-item value="3">3</checker-item>
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo1CheckboxMax }}</span>
      <br />
    </div>

    <divider>{{ t("Default value 2") }}</divider>
    <div class="box">
      <checker
        v-model="demo2"
        default-item-class="demo2-item"
        selected-item-class="demo2-item-selected"
      >
        <checker-item value="1">1</checker-item>
        <checker-item value="2">2</checker-item>
        <checker-item value="3">3</checker-item>
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo2 }}</span>
      <br />
    </div>

    <divider>{{ t("Custom styles") }}</divider>
    <div class="box">
      <checker
        v-model="demo3"
        default-item-class="demo3-item"
        selected-item-class="demo3-item-selected"
      >
        <checker-item value="one">
          <img
            src="../assets/cat1.jpg"
            style="width: 50px; height: 50px"
            alt=""
          />
        </checker-item>
        <checker-item value="two">
          <img
            src="../assets/cat2.jpg"
            style="width: 50px; height: 50px"
            alt=""
          />
        </checker-item>
        <checker-item value="three">
          <img
            src="../assets/cat3.jpg"
            style="width: 50px; height: 50px"
            alt=""
          />
        </checker-item>
      </checker>
      <br />
      <span>{{ t("Current value is") }}: {{ demo3 }}</span>
      <br />
    </div>

    <divider>{{ t("Use in Popup") }}</divider>
    <group>
      <cell
        :title="t('Select color')"
        :value="demo4"
        is-link
        @click="showPopup = true"
      ></cell>
    </group>
    <popup v-model="showPopup" class="checker-popup">
      <div style="padding: 10px 10px 40px 10px">
        <p style="padding: 5px 5px 5px 2px; color: #888">Colors</p>
        <checker
          v-model="demo4"
          default-item-class="demo4-item"
          selected-item-class="demo4-item-selected"
          disabled-item-class="demo4-item-disabled"
        >
          <checker-item :value="t('I')" @on-item-click="onItemClick">{{
            t("I")
          }}</checker-item>
          <checker-item :value="t('J')" @on-item-click="onItemClick">{{
            t("J")
          }}</checker-item>
          <checker-item :value="t('K')" @on-item-click="onItemClick">{{
            t("K")
          }}</checker-item>
          <checker-item :value="t('L')" disabled @on-item-click="onItemClick">{{
            t("L")
          }}</checker-item>
        </checker>
      </div>
    </popup>

    <divider>{{ t("A real world radio example") }} {{ demo5 }}</divider>
    <checker
      v-model="demo5"
      default-item-class="demo5-item"
      selected-item-class="demo5-item-selected"
    >
      <checker-item v-for="i in [1, 2, 3]" :key="i" :value="i"
        >￥{{ i * 300 }}</checker-item
      >
    </checker>
    <br />
    <divider>{{ t("A real world checkbox example") }} {{ demo6 }}</divider>
    <checker
      v-model="demo6"
      type="checkbox"
      default-item-class="demo5-item"
      selected-item-class="demo5-item-selected"
    >
      <checker-item v-for="i in [1, 2, 3]" :key="i" :value="i">{{
        [t("good"), t("nice"), t("awesome")][i - 1]
      }}</checker-item>
    </checker>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  Checker,
  CheckerItem,
  Divider,
  Group,
  Cell,
  Popup,
  useLocale,
} from "wiux";

export default {
  name: "CheckerDemo",
  components: {
    Checker,
    CheckerItem,
    Divider,
    Group,
    Cell,
    Popup,
  },
  setup() {
    const { t } = useLocale();

    const items1 = [
      { key: "1", value: "A" },
      { key: "2", value: "B" },
      { key: "3", value: "C" },
    ];
    const demo1 = ref("");
    const demo1Required = ref("");
    const demo11 = ref<any>(null);
    const demo12 = ref<any>({ key: "2", value: "B" });
    const demo21 = ref<any>(null);
    const demo22 = ref<any>([{ key: "2", value: "B" }]);
    const demo23 = ref<any>(null);
    const demo1Checkbox = ref([2, 1]);
    const demo1CheckboxMax = ref(["2", "3"]);
    const demo2 = ref("2");
    const demo3 = ref("");
    const demo4 = ref(t("I"));
    const showPopup = ref(false);
    const demo5 = ref(1);
    const demo6 = ref([2, 3]);

    const onItemClick = (value: any, disabled: boolean) => {
      console.log(value, disabled);
      if (!disabled) {
        showPopup.value = false;
      }
    };

    return {
      t,
      items1,
      demo1,
      demo1Required,
      demo11,
      demo12,
      demo21,
      demo22,
      demo23,
      demo1Checkbox,
      demo1CheckboxMax,
      demo2,
      demo3,
      demo4,
      showPopup,
      demo5,
      demo6,
      onItemClick,
    };
  },
};
</script>

<style scoped>
.box {
  padding: 0 15px;
}
.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 15px;
}
.demo1-item-selected {
  border: 1px solid green;
}
.demo2-item {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  display: inline-block;
  border-radius: 50%;
  line-height: 40px;
  text-align: center;
}
.demo2-item-selected {
  border-color: green;
}
.demo3-item {
  padding: 5px 5px;
  font-size: 0;
}
.demo3-item-selected {
  outline: 1px solid #8b8aee;
}
.demo4-item {
  background-color: #ddd;
  color: #222;
  font-size: 14px;
  padding: 5px 10px;
  margin-right: 10px;
  line-height: 18px;
  border-radius: 15px;
}
.demo4-item-selected {
  background-color: #ff3b3b;
  color: #fff;
}
.demo4-item-disabled {
  color: #999;
}
.demo5-item {
  width: 100px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
}
.demo5-item-selected {
  background: #ffffff url(../assets/checker/active.png) no-repeat right bottom;
  border-color: #ff4a00;
}
</style>
