<template>
  <div>
    <badge text="1"></badge>
    <br />
    <badge text="123"></badge>
    <br />
    <Group :title="t('Use in Cell')">
      <Cell :title="t('Red dot')" is-link>
        <div class="badge-value">
          <span class="vertical-middle">{{ t("New Messages") }} &nbsp;</span>
          <badge></badge>
        </div>
      </Cell>
      <Cell :title="t('Single digit')" is-link>
        <div class="badge-value">
          <span class="vertical-middle">{{ t("New Messages") }} &nbsp;</span>
          <badge text="8"></badge>
        </div>
      </Cell>
      <Cell :title="t('Big Number')" is-link>
        <div class="badge-value">
          <span class="vertical-middle">{{ t("New Messages") }} &nbsp;</span>
          <badge text="888"></badge>
        </div>
      </Cell>
    </Group>
  </div>
</template>

<script lang="ts">
import { Badge, Group, Cell, useLocale } from "wiux";

export default {
  name: "BadgeDemo",
  components: {
    Badge,
    Group,
    Cell,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
};
</script>

<style scoped>
.badge-value {
  display: inline-block !important;
}
.vertical-middle {
  vertical-align: middle;
}
</style>
