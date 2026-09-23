<script lang="ts">
import { defineComponent, inject } from "vue";
import { camelAttrs } from "./util";

export default defineComponent({
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs }) {
    const setLegend = inject<(options: any) => void>(
      "vChartSetLegend",
      () => {},
    );

    setLegend({
      ...props.options,
      disabled: props.disabled,
      ...camelAttrs({ ...attrs }),
    });

    return {};
  },
});
</script>
