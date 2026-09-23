<template>
  <div>
    <Group :title="t('Switch style')">
      <Radio title="type" v-model="type" :options="['1', '2', '3', '4', '5']" />
    </Group>
    <Panel
      :header="'图文组合列表'"
      :footer="footer"
      :list="list"
      :type="type"
      @on-img-error="onImgError"
    />
    <br />
    <Panel header="使用 header slot 和 body slot">
      <template #header>
        <div style="padding: 10px 15px; font-size: 14px; color: #333">
          自定义头部
        </div>
      </template>
      <template #body>
        <div style="padding: 15px; color: #666">自定义内容区域</div>
      </template>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { Panel, Group, Radio, useLocale } from "wiux";

export default defineComponent({
  components: {
    Panel,
    Group,
    Radio,
  },
  setup() {
    const { t } = useLocale();
    const type = ref("1");

    const list = computed(() => [
      {
        src: "../assets/cat1.jpg",
        fallbackSrc: "../assets/cat1.jpg",
        title: t("Title 001"),
        desc: t(
          "Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content",
        ),
        url: "/component/cell",
      },
      {
        src: "../assets/cat2.jpg",
        title: t("Title 002"),
        desc: t(
          "Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content",
        ),
        url: {
          path: "/component/radio",
          replace: false,
        },
        meta: {
          source: t("Source"),
          date: t("Date"),
          other: t("Other"),
        },
      },
    ]);

    const footer = {
      title: t("More"),
      url: "http://wiux.li",
    };

    const onImgError = (item: any, $event: any) => {
      console.log(item, $event);
    };

    return {
      t,
      type,
      list,
      footer,
      onImgError,
    };
  },
});
</script>
