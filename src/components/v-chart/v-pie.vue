<script lang="ts">
import { defineComponent, inject } from "vue";

const camel = function (key: string): string {
  return key.replace(/(-[a-z])/g, function ($1) {
    return $1.toUpperCase().replace("-", "");
  });
};

const camelBatch = function (attrs: Record<string, any>): Record<string, any> {
  for (const i in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, i)) {
      const key = camel(i);
      attrs[key] = attrs[i];
      if (key !== i) {
        delete attrs[i];
      }
    }
  }
  return attrs;
};

export default defineComponent({
  props: {
    coord: {
      type: String,
      default: "polar",
    },
    transposed: {
      type: Boolean,
      default: true,
    },
    seriesField: {
      type: String,
    },
    colors: {
      type: Array,
    },
  },
  setup(props, { attrs }) {
    const setPie = inject<(options: any) => void>("vChartSetPie", () => {});

    setPie({
      ...props,
      ...camelBatch({ ...attrs }),
    });

    return {};
  },
});
</script>
