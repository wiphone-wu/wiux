<template>
  <div>
    <img src="../assets/cat1.jpg" style="width: 100%" />
    <Search
      @result-click="resultClick"
      @on-change="getResult"
      :results="results"
      v-model="value"
      position="absolute"
      auto-scroll-to-top
      top="46px"
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="searchRef"
    ></Search>
    <Group>
      <Cell :title="t('keyword')">{{ value }}</Cell>
    </Group>

    <div style="padding: 15px">
      <XButton @click="setFocus" type="primary">{{ t("set focus") }}</XButton>
    </div>
    <br />
    <Search
      @on-submit="onSubmit"
      :auto-fixed="autoFixed"
      @on-focus="onFocus"
      @on-cancel="onCancel"
    ></Search>
    <Divider>{{ t("set value") }}</Divider>
    <Search
      @on-submit="onSubmit"
      :auto-fixed="false"
      v-model="value2"
      @on-focus="onFocus"
      @on-cancel="onCancel"
    ></Search>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { Search, Group, Cell, XButton, Divider, useToast, useLocale } from "wiux";

const toast = useToast();

interface ResultItem {
  title: string;
  other: number;
}

function getResultData(val: string): ResultItem[] {
  let rs: ResultItem[] = [];
  for (let i = 0; i < 1; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i,
    });
  }
  return rs;
}

export default defineComponent({
  name: "SearchDemo",
  components: {
    Search,
    Group,
    Cell,
    XButton,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    const searchRef = ref<any>(null);
    const results = ref<ResultItem[]>([]);
    const value = ref("test");
    const value2 = ref("wiux");
    const autoFixed = ref(false);

    const setFocus = () => {
      if (searchRef.value) {
        searchRef.value.setFocus();
      }
    };

    const resultClick = (item: ResultItem) => {
      toast.text("you click the result item: " + JSON.stringify(item));
    };

    const getResult = (val: string) => {
      console.log("on-change", val);
      results.value = val ? getResultData(val) : [];
    };

    const onSubmit = (val: string) => {
      if (searchRef.value) {
        searchRef.value.setBlur();
      }
      console.log("on submit", val);
    };

    const onFocus = () => {
      console.log("on focus");
    };

    const onCancel = () => {
      console.log("on cancel");
    };

    return {
      t,
      searchRef,
      results,
      value,
      value2,
      autoFixed,
      setFocus,
      resultClick,
      getResult,
      onSubmit,
      onFocus,
      onCancel,
    };
  },
});
</script>
