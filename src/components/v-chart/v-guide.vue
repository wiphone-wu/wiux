<script lang="ts">
import { defineComponent, inject } from "vue";
import { camelAttrs } from "./util";

export default defineComponent({
  props: {
    type: {
      type: String,
      validator: (val: string) => {
        const types = ["line", "text", "tag", "rect", "html", "arc"];
        return types.indexOf(val) !== -1;
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    top: Boolean,
    withPoint: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { attrs }) {
    const addGuide = inject<(options: any) => void>("vChartAddGuide", () => {});

    addGuide({
      type: props.type,
      options: {
        top: props.top,
        withPoint: props.withPoint,
        ...camelAttrs(props.options),
        ...camelAttrs({ ...attrs }),
      },
    });

    return {};
  },
});
</script>
