<script lang="ts">
import { defineComponent, inject } from "vue";
import { camelAttrs } from "./util";

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    showCrosshairs: {
      type: Boolean,
      default: true,
    },
    showItemMarker: {
      type: Boolean,
      default: true,
    },
    showXValue: {
      type: Boolean,
      default: false,
    },
    showValueInLegend: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props, { attrs }) {
    const setTooltip = inject<(options: any) => void>(
      "vChartSetTooltip",
      () => {},
    );

    const options: Record<string, any> = {
      disabled: props.disabled,
      showCrosshairs: props.showCrosshairs,
      showItemMarker: props.showItemMarker,
      showValueInLegend: props.showValueInLegend,
      ...camelAttrs(props.options),
      ...camelAttrs({ ...attrs }),
    };
    if (props.showXValue) {
      options.onShow = function (ev: any) {
        if (!ev || !ev.items) return;
        const { items } = ev;
        items[0].name = items[0].title;
      };
    }
    setTooltip(options);

    return {};
  },
});
</script>
