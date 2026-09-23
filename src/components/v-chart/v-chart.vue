<script lang="ts">
import { computed, defineComponent, h, nextTick, provide, ref } from "vue";
import FCanvas from "@antv/f-vue";
import {
  Area,
  Axis,
  Chart,
  Interval,
  Legend,
  Line,
  Point,
  Tooltip,
} from "@antv/f2";

type Options = Record<string, any>;

export default defineComponent({
  name: "VChart",

  props: {
    width: Number,
    height: Number,

    backgroundColor: {
      type: String,
      default: "#fff",
    },

    data: {
      type: Array,
      default: () => [],
    },

    preventRender: {
      type: Boolean,
      default: false,
    },

    preventDefault: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { slots }) {
    const xField = ref("");
    const yField = ref("");

    const xFieldOptions = ref<Options>({});
    const yFieldOptions = ref<Options>({});

    const xAxisOptions = ref<Options | null>(null);
    const yAxisOptions = ref<Options | null>(null);

    const lineOptions = ref<Options | null>(null);
    const areaOptions = ref<Options | null>(null);
    const barOptions = ref<Options | null>(null);
    const pieOptions = ref<Options | null>(null);
    const pointOptions = ref<Options | null>(null);
    const tooltipOptions = ref<Options | null>(null);
    const legendOptions = ref<Options | null>(null);

    const detectFields = () => {
      if (xField.value && yField.value) return;

      const first = props.data[0] as Options | undefined;
      if (!first) return;

      const keys = Object.keys(first);
      if (keys.length < 2) return;

      let indexes = [0, 1];

      if (
        typeof first[keys[0]] === "number" &&
        typeof first[keys[1]] !== "number"
      ) {
        indexes = [1, 0];
      } else if (
        typeof first[keys[0]] === "string" &&
        typeof first[keys[1]] === "string" &&
        keys[2] === "value"
      ) {
        indexes = [0, 2];
      }

      xField.value = keys[indexes[0]];
      yField.value = keys[indexes[1]];
    };

    detectFields();

    const isReady = ref(false);

    nextTick(() => {
      isReady.value = true;
    });

    const chartWidth = computed(() => props.width || window.innerWidth);

    const chartHeight = computed(() => {
      if (props.height) return props.height;

      return window.innerWidth > window.innerHeight
        ? window.innerHeight - 54
        : window.innerWidth * 0.707;
    });

    const pixelRatio = computed(() => {
      return (window as any).$devicePixelRatio || window.devicePixelRatio || 1;
    });

    const chartData = computed(() => {
      if (!pieOptions.value) return props.data;

      return (props.data as Options[]).map((item: Options) => ({
        ...item,
        a: "1",
      }));
    });

    const scales = computed(() => ({
      [xField.value]: {
        tickCount: barOptions.value ? 0 : 5,
        ...(barOptions.value ? {} : { range: [0, 1] }),
        ...xFieldOptions.value,
      },

      [yField.value]: {
        tickCount: 5,
        ...yFieldOptions.value,
      },
    }));

    const coord = computed(() => {
      if (!pieOptions.value) return undefined;

      return {
        type: pieOptions.value.coord || "polar",
        transposed: pieOptions.value.transposed !== false,
        radius: pieOptions.value.radius,
        innerRadius: pieOptions.value.innerRadius,
      };
    });

    const getColor = (options: Options) => {
      if (!options.seriesField) {
        return options.colors;
      }

      if (Array.isArray(options.colors) && options.colors.length) {
        return {
          field: options.seriesField,
          range: options.colors,
        };
      }

      return options.seriesField;
    };

    const getGeometryProps = (options: Options) => ({
      x: xField.value,
      y: yField.value,
      color: getColor(options),
      shape: options.shape,
      size: options.size,
      adjust: options.adjust,
      style: options.styles,
    });

    const set = (name: string, options: Options) => {
      const targets: Record<string, typeof lineOptions> = {
        line: lineOptions,
        area: areaOptions,
        bar: barOptions,
      };

      if (targets[name]) {
        targets[name].value = options;
      }
    };

    provide("vChartSet", set);

    provide("vChartSetPie", (options: Options) => {
      pieOptions.value = options;
    });

    provide("vChartSetPoint", (options: Options) => {
      pointOptions.value = options;
    });

    provide("vChartSetScale", (options: Options) => {
      if (options.x) xFieldOptions.value = options.x;
      if (options.y) yFieldOptions.value = options.y;
    });

    provide("vChartSetField", (axis: string, field: string) => {
      if (axis === "x") xField.value = field;
      if (axis === "y") yField.value = field;
    });

    provide("vChartSetAxis", (options: Options) => {
      if (options.x) xAxisOptions.value = options.x;
      if (options.y) yAxisOptions.value = options.y;
    });

    provide("vChartSetTooltip", (options: Options) => {
      tooltipOptions.value = options;
    });

    provide("vChartSetLegend", (options: Options) => {
      legendOptions.value = options;
    });

    provide("vChartAddGuide", () => {});

    return () => {
      const chartChildren: any[] = [];

      if (xField.value) {
        chartChildren.push(
          h(Axis, {
            field: xField.value,
            ...(xAxisOptions.value?.disabled
              ? { visible: false }
              : xAxisOptions.value || {}),
          } as any),
        );
      }

      if (yField.value) {
        chartChildren.push(
          h(Axis, {
            field: yField.value,
            ...(yAxisOptions.value?.disabled
              ? { visible: false }
              : yAxisOptions.value || {}),
          } as any),
        );
      }

      if (tooltipOptions.value && !tooltipOptions.value.disabled) {
        chartChildren.push(
          h(Tooltip, {
            showCrosshairs: !barOptions.value,
            ...tooltipOptions.value,
          } as any),
        );
      }

      if (legendOptions.value && !legendOptions.value.disabled) {
        chartChildren.push(
          h(Legend, {
            ...legendOptions.value.options,
            ...legendOptions.value,
          } as any),
        );
      }

      if (lineOptions.value) {
        chartChildren.push(h(Line, getGeometryProps(lineOptions.value) as any));
      }

      if (areaOptions.value) {
        chartChildren.push(h(Area, getGeometryProps(areaOptions.value) as any));
      }

      if (barOptions.value) {
        chartChildren.push(
          h(Interval, getGeometryProps(barOptions.value) as any),
        );
      }

      if (pointOptions.value) {
        chartChildren.push(
          h(Point, getGeometryProps(pointOptions.value) as any),
        );
      }

      if (pieOptions.value) {
        chartChildren.push(
          h(Interval, {
            x: "a",
            y: "percent",
            color: pieOptions.value.colors?.length
              ? {
                  field: pieOptions.value.seriesField,
                  range: pieOptions.value.colors,
                }
              : pieOptions.value.seriesField,
            adjust: "stack",
            style: {
              lineWidth: 1,
              stroke: "#fff",
              lineJoin: "round",
              lineCap: "round",
            },
          } as any),
        );
      }

      const hiddenConfig = h(
        "div",
        { class: "v-chart-config" },
        slots.default ? slots.default() : [],
      );

      const canvas =
        props.data.length && !props.preventRender && isReady.value
          ? h(
              FCanvas,
              {
                width: chartWidth.value,
                height: chartHeight.value,
                pixelRatio: pixelRatio.value,
              },
              {
                default: () =>
                  h(
                    Chart,
                    {
                      data: chartData.value,
                      scale: scales.value,
                      coord: coord.value,
                    } as any,
                    chartChildren,
                  ),
              },
            )
          : null;

      return h(
        "div",
        {
          style: {
            backgroundColor: props.backgroundColor,
            width: `${chartWidth.value}px`,
            height: `${chartHeight.value}px`,
          },
          onTouchstart: (event: TouchEvent) => {
            if (props.preventDefault) {
              event.preventDefault();
            }
          },
        },
        [hiddenConfig, canvas],
      );
    };
  },
});
</script>

<style>
.v-chart-config {
  display: none;
}
</style>
