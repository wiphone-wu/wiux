<template>
  <div>
    <Group>
      <Cell :title="t('My Account')" :value="t('Protected')" @click="onClick" />
      <Cell
        :title="t('Money')"
        :is-loading="!money"
        :value="money"
        @click="onClick"
      />
      <Cell :title="t('Withdraw')" disabled is-link />
    </Group>

    <Group :title="t('Use is-link to show arrow')">
      <Cell is-link>
        <template #title>
          <span style="color: green"
            ><span style="vertical-align: middle">{{ t("Messages") }}</span
            ><Badge text="1"
          /></span>
        </template>
      </Cell>
      <Cell :title="t('Notifications')" is-link />
      <Cell :title="t('Privacy')" is-link />
      <Cell :title="t('General')" is-link>
        <template #icon>
          <img
            width="20"
            style="display: block; margin-right: 5px"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII="
          />
        </template>
      </Cell>
    </Group>

    <Group label-width="5em" :title="t('align-items')">
      <Cell
        primary="content"
        :title="t('Default')"
        :value="
          t(
            'Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content',
          )
        "
      />
      <Cell
        title="flex-start"
        align-items="flex-start"
        :value="
          t(
            'Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content',
          )
        "
      />
    </Group>

    <Group :title="t('Collapse')">
      <Cell
        :title="t('Title 001')"
        is-link
        :border-intent="false"
        :arrow-direction="showContent001 ? 'up' : 'down'"
        @click="showContent001 = !showContent001"
      />
      <template v-if="showContent001">
        <div class="sub-item" style="padding: 10px 15px; color: #888">
          content 001
        </div>
        <div class="sub-item" style="padding: 10px 15px; color: #888">
          content 001
        </div>
        <div class="sub-item" style="padding: 10px 15px; color: #888">
          content 001
        </div>
      </template>

      <Cell
        :title="t('Title 002')"
        is-link
        :border-intent="false"
        :arrow-direction="showContent002 ? 'up' : 'down'"
        @click="showContent002 = !showContent002"
      />
      <template v-if="showContent002">
        <CellFormPreview :border-intent="false" :list="list" />
      </template>

      <Cell
        :title="t('Title 003')"
        is-link
        :border-intent="false"
        :arrow-direction="showContent003 ? 'up' : 'down'"
        @click="showContent003 = !showContent003"
      />
      <template v-if="showContent003">
        <div class="sub-item" style="padding: 10px 15px; color: #888">
          I'm content 003
        </div>
      </template>

      <Cell
        :title="t('Animated')"
        is-link
        :border-intent="false"
        :arrow-direction="showContent004 ? 'up' : 'down'"
        @click="showContent004 = !showContent004"
      />
      <p class="slide" :class="showContent004 ? 'animate' : ''">
        blablabla...<br />blablabla...<br />blablabla...<br />blablabla...
      </p>
    </Group>

    <Group>
      <Cell :title="t('Notifications')" :value="t('Enabled')" />
    </Group>

    <Group :title="t('Use slot for complicated content')">
      <Cell :title="t('Slot content')">
        <div>
          <span style="color: green">{{ t("Hi, I'm Wiux.") }}</span>
        </div>
      </Cell>
    </Group>

    <Group :title="t('is-link is set to true automatically when link exists')">
      <Cell
        :title="t('Go to Radio Demo')"
        link="/component/radio"
        inline-desc='link="/component/radio"'
      />
      <Cell
        :title="t('Go to Homepage')"
        :link="{ path: '/' }"
        inline-desc=':link={path:"/home"}'
      />
      <Cell
        :title="t('Http link')"
        link="https://wiux.li"
        inline-desc='link="https://wiux.li"'
      />
    </Group>
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { Group, Cell, Badge, CellFormPreview, useLocale } from "wiux";

export default {
  name: "CellDemo",
  components: {
    Group,
    Cell,
    Badge,
    CellFormPreview,
  },
  setup() {
    const { t } = useLocale();

    const list = computed(() => [
      { label: t("Apple"), value: "3.29" },
      { label: t("Banana"), value: "1.04" },
      { label: t("Fish"), value: "8.00" },
    ]);

    const money = ref<string>("");
    const showContent001 = ref(false);
    const showContent002 = ref(false);
    const showContent003 = ref(false);
    const showContent004 = ref(false);

    setTimeout(() => {
      money.value = "-1024";
    }, 2000);

    const onClick = () => {
      console.log("on click");
    };

    return {
      t,
      list,
      money,
      showContent001,
      showContent002,
      showContent003,
      showContent004,
      onClick,
    };
  },
};
</script>

<style scoped>
.sub-item {
  color: #888;
}
.slide {
  padding: 0 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
}
.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}
</style>
