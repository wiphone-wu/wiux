<template>
  <table
    class="wiux-table"
    :class="{
      'wiux-table-bordered': fullBordered,
      'wiux-table-no-cell-bordered': !cellBordered,
      'wiux-table-no-content-bordered': !contentBordered,
    }"
  >
    <slot></slot>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "XTable",
  props: {
    fullBordered: Boolean,
    cellBordered: {
      type: Boolean,
      default: true,
    },
    contentBordered: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style lang="less">
@import "../../styles/1px.less";

.wiux-table {
  line-height: 40px;
  position: relative;
  width: 100%;
  border-collapse: collapse;

  &:after {
    .setTopLine();
  }
  th {
    font-weight: 500;
  }
}

.wiux-table.wiux-table-bordered {
  &:before {
    .setLeftLine();
  }
}

.wiux-table td,
.wiux-table th {
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  text-align: center;
}

.wiux-table td,
.wiux-table th {
  position: relative;
  border-right: 0;
  border-bottom: 0;
}

.wiux-table td,
.wiux-table th {
  &:before {
    .setBottomLine();
  }
}

.wiux-table.wiux-table-no-content-bordered td {
  &:before {
    border-bottom-width: 0;
  }
}

.wiux-table.wiux-table-no-content-bordered tr:last-child td {
  &:before {
    border-bottom-width: 1px;
  }
}

.wiux-table td,
.wiux-table th {
  &:after {
    .setRightLine();
  }
}

.wiux-table.wiux-table-no-cell-bordered td,
.wiux-table.wiux-table-no-cell-bordered th {
  &:after {
    border-right-width: 0;
  }
}

.wiux-table tr td:last-child,
.wiux-table tr th:last-child {
  &:after {
    border-right-width: 0;
  }
}

.wiux-table.wiux-table-bordered tr td:last-child,
.wiux-table.wiux-table-bordered tr th:last-child {
  &:after {
    border-right-width: 1px;
  }
}
</style>
