import { defineComponent, inject } from "vue";
import { camelAttrs } from "./util";

const defaultShapeMap: Record<string, string> = {
  line: "line",
  point: "circle",
  area: "area",
};

export function useVChartMixin(chartName: string) {
  const set = inject<(name: string, options: any) => void>(
    "vChartSet",
    () => {},
  );

  return {
    getSetFn: () => set,
  };
}

export function createBaseComponent(chartName: string) {
  return defineComponent({
    props: {
      colors: [String, Array],
      seriesField: String,
      adjust: [String, Object],
    },
    setup(props, { attrs }) {
      const set = inject<(name: string, options: any) => void>(
        "vChartSet",
        () => {},
      );

      set(chartName, {
        shape: defaultShapeMap[chartName] || "",
        ...props,
        ...camelAttrs({ ...attrs }),
      });

      return {};
    },
  });
}
