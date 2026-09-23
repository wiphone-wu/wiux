<template>
  <div>
    <load-more
      :tip="t('default')"
      :show-loading="false"
      background-color="#fbf9fe"
    ></load-more>
    <div style="padding: 0 15px">
      <x-table>
        <thead>
          <tr>
            <th>{{ t("Product") }}</th>
            <th>{{ t("Price") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apple</td>
            <td>$1.25</td>
          </tr>
          <tr>
            <td>Banana</td>
            <td>$1.20</td>
          </tr>
        </tbody>
      </x-table>
    </div>
    <div>
      <load-more
        :tip="t('cell-bordered=false')"
        :show-loading="false"
        background-color="#fbf9fe"
      ></load-more>
      <x-table :cell-bordered="false" style="background-color: #fff">
        <thead>
          <tr>
            <th>{{ t("Product") }}</th>
            <th>{{ t("Price") }}</th>
            <th>{{ t("Quantity") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apple</td>
            <td>$1.25</td>
            <td>x 1</td>
          </tr>
          <tr>
            <td>Banana</td>
            <td>$1.20</td>
            <td>x 2</td>
          </tr>
        </tbody>
      </x-table>

      <load-more
        :tip="t('content-bordered=false')"
        :show-loading="false"
        background-color="#fbf9fe"
      ></load-more>

      <x-table
        :cell-bordered="false"
        :content-bordered="false"
        style="background-color: #fff"
      >
        <thead>
          <tr style="background-color: #f7f7f7">
            <th>{{ t("Product") }}</th>
            <th>{{ t("Price") }}</th>
            <th>{{ t("Quantity") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apple</td>
            <td>$1.25</td>
            <td>x 1</td>
          </tr>
          <tr>
            <td>Banana</td>
            <td>$1.20</td>
            <td>x 2</td>
          </tr>
        </tbody>
      </x-table>
    </div>
    <div style="padding: 15px">
      <load-more
        :tip="t('full-bordered')"
        :show-loading="false"
        background-color="#fbf9fe"
      ></load-more>
      <x-table full-bordered style="background-color: #fff">
        <thead>
          <tr>
            <th>{{ t("Product") }}</th>
            <th>{{ t("Price") }}</th>
            <th>{{ t("Quantity") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apple</td>
            <td colspan="2">$1.25 x 10</td>
          </tr>
          <tr>
            <td>Banana</td>
            <td>$1.20</td>
            <td>x 08</td>
          </tr>
        </tbody>
      </x-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { XTable, LoadMore, useLocale } from "wiux";

export default defineComponent({
  components: {
    XTable,
    LoadMore,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
});
</script>
