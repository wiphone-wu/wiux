<template>
  <div style="padding: 10px">
    <Group :title="t('Icons')">
      <div
        style="
          padding: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 24px;
        "
      >
        <Icon type="success" />
        <Icon type="info" />
        <Icon type="info-circle" />
        <Icon type="warn" />
        <Icon type="waiting" />
        <Icon type="waiting-circle" />
        <Icon type="safe-success" />
        <Icon type="safe_warn" />
        <Icon type="success-circle" />
        <Icon type="success-no-circle" />
        <Icon type="circle" />
        <Icon type="download" />
        <Icon type="cancel" />
        <Icon type="search" />
        <Icon type="clear" />
      </div>
    </Group>
    <Group :title="t('Msg Icons')">
      <div style="padding: 10px; display: flex; flex-wrap: wrap; gap: 10px">
        <Icon type="success" is-msg />
        <Icon type="info" is-msg />
        <Icon type="warn" is-msg />
        <Icon type="waiting" is-msg />
        <Icon type="safe_success" is-msg />
        <Icon type="safe_warn" is-msg />
      </div>
    </Group>
  </div>
</template>

<script lang="ts">
import { Icon, Group, useLocale } from "wiux";

export default {
  components: {
    Icon,
    Group,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
};
</script>
