<script lang="ts">
import { defineComponent, inject } from "vue";
import { camelAttrs } from "./util";

export default defineComponent({
  props: {
    x: Boolean,
    y: Boolean,
    field: String,
  },
  setup(props, { attrs }) {
    const setScale = inject<(options: any) => void>("vChartSetScale", () => {});
    const setField = inject<(axis: string, field: string) => void>(
      "vChartSetField",
      () => {},
    );

    const emitSetting = () => {
      ["x", "y"].forEach((item) => {
        if (props[item as keyof typeof props]) {
          setScale({
            [item]: {
              ...camelAttrs({ ...attrs }),
            },
          });
          if (props.field) {
            setField(item, props.field);
          }
        }
      });
    };

    emitSetting();

    return {};
  },
});
</script>
