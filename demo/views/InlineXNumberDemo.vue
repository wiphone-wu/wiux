<template>
  <div>
    <br />
    <div style="text-align: center">
      <inline-x-number width="50px" />
    </div>
    <br />
    <div style="text-align: center">
      <inline-x-number width="50px" button-style="round" />
    </div>
    <Group>
      <Cell :title="t('Use in Cell')">
        <inline-x-number
          style="display: block"
          :min="0"
          width="50px"
          button-style="round"
        />
      </Cell>
    </Group>
  </div>
</template>

<script lang="ts">
import { Group, Cell, InlineXNumber, useLocale } from "wiux";

export default {
  components: {
    Group,
    Cell,
    InlineXNumber,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
};
</script>
