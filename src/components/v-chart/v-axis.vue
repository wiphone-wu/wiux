<script lang="ts">
import { defineComponent, inject } from "vue";
import { camelAttrs } from "./util";

export default defineComponent({
  props: {
    x: Boolean,
    y: Boolean,
    field: String,
    disabled: Boolean,
    autoAlign: Boolean,
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props, { attrs }) {
    const setAxis = inject<(options: any) => void>("vChartSetAxis", () => {});

    const _options = {
      ...props,
      ...props.options,
      ...camelAttrs({ ...attrs }),
    };
    setAxis(_options);

    return {};
  },
});
</script>
