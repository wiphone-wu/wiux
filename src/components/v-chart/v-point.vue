<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  props: {
    styles: {
      type: Object,
    },
    colors: {
      type: Array,
    },
    seriesField: String,
    shape: String,
    size: [Number, Array],
  },
  setup(props, { attrs }) {
    const setPoint = inject<(options: any) => void>("vChartSetPoint", () => {});

    setPoint({
      ...props,
      ...attrs,
    });

    return {};
  },
});
</script>
