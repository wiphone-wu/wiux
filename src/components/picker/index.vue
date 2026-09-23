<template>
  <div class="wiux-picker">
    <flexBox :gutter="0">
      <flexBox-item
        :span="columnWidth && (columnWidth as any[])[index]"
        v-for="(one, index) in currentData"
        :key="index"
        style="margin-left: 0"
      >
        <div class="wiux-picker-item" :id="`wiux-picker-${uuid}-${index}`"></div>
      </flexBox-item>
    </flexBox>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import Scroller from "./scroller";
import { FlexBox, FlexBoxItem } from "../flexBox";
import Manager from "./chain";
import value2name from "../../filters/value2name";
import "./scroller.css";

export default defineComponent({
  name: "Picker",
  components: {
    FlexBox,
    FlexBoxItem,
  },
  props: {
    data: Array,
    columns: {
      type: Number,
      default: 0,
    },
    fixedColumns: {
      type: Number,
      default: 0,
    },
    modelValue: Array,
    itemClass: {
      type: String,
      default: "scroller-item",
    },
    columnWidth: Array,
  },
  emits: ["on-change", "update:modelValue"],
  setup(props, { emit }) {
    const uuid = ref(Math.random().toString(36).substring(3, 8));
    const scrollers: Scroller[] = [];
    const currentData = ref<any[]>((props.data as any[]) || []);
    const currentValue = ref<any[]>((props.modelValue as any[]) || []);
    let store: Manager | null = null;
    let isInternalUpdate = false;

    if (props.columns !== 0) {
      const length = props.columns;
      store = new Manager(
        props.data as any[],
        length,
        props.fixedColumns || props.columns,
      );
      currentData.value = store.getColumns(currentValue.value);
    }

    function getId(i: number): string {
      return `#wiux-picker-${uuid.value}-${i}`;
    }

    function render(data: any[], value: any[]) {
      const count = data.length;
      console.log(
        "[Picker] render() called, data cols:",
        count,
        "value:",
        JSON.stringify(value),
        "isInternalUpdate:",
        isInternalUpdate,
      );
      if (!data || !data.length) {
        console.log("[Picker] render() early return - no data");
        return;
      }

      if (value.length < count) {
        for (let i = 0; i < count; i++) {
          currentValue.value[i] = data[i][0].value || data[i][0];
        }
      }

      for (let i = 0; i < data.length; i++) {
        if (!document.querySelector(getId(i))) {
          console.log(
            "[Picker] render() early return - DOM not ready for col",
            i,
          );
          return;
        }

        console.log(
          "[Picker] render() destroying scroller",
          i,
          "and creating new one",
        );
        scrollers[i] && scrollers[i].destroy();
        scrollers[i] = new Scroller(getId(i), {
          data: data[i],
          defaultValue: value[i] || data[i][0].value,
          itemClass: props.itemClass,
          onSelect(scrollerValue: string) {
            console.log(
              "[Picker] render onSelect col",
              i,
              "value:",
              scrollerValue,
            );
            isInternalUpdate = true;
            console.log("[Picker] render onSelect set isInternalUpdate = true");
            currentValue.value[i] = scrollerValue;
            if (
              !props.columns ||
              (props.columns && getValue().length === store!.count)
            ) {
              nextTick(() => {
                emit("on-change", getValue());
              });
            }
            if (props.columns !== 0) {
              console.log(
                "[Picker] render onSelect calling renderChain(" + (i + 1) + ")",
              );
              renderChain(i + 1);
            }
            isInternalUpdate = false;
            console.log(
              "[Picker] render onSelect set isInternalUpdate = false",
            );
          },
        });
        if (currentValue.value) {
          scrollers[i].select(value[i]);
        }
      }
      console.log("[Picker] render() done");
    }

    function renderChain(i: number) {
      console.log(
        "[Picker] renderChain(" + i + ") entered, currentData.length:",
        currentData.value.length,
        "isInternalUpdate:",
        isInternalUpdate,
      );
      if (!props.columns) {
        console.log(
          "[Picker] renderChain(" + i + ") early return - no props.columns",
        );
        return;
      }

      if (i > currentData.value.length - 1) {
        console.log(
          "[Picker] renderChain(" + i + ") early return - i > last col index",
        );
        return;
      }

      isInternalUpdate = true;
      console.log(
        "[Picker] renderChain(" + i + ") set isInternalUpdate = true",
      );

      const ID = getId(i);
      scrollers[i].destroy();
      const list = store!.getChildren(currentValue.value[i - 1]);
      console.log(
        "[Picker] renderChain(" + i + ") parent value:",
        currentValue.value[i - 1],
        "children:",
        JSON.stringify(list.map((l: any) => l.name || l.value)),
      );

      scrollers[i] = new Scroller(ID, {
        data: list,
        itemClass: props.itemClass,
        onSelect(scrollerValue: string) {
          console.log(
            "[Picker] renderChain onSelect col",
            i,
            "value:",
            scrollerValue,
          );
          isInternalUpdate = true;
          console.log(
            "[Picker] renderChain onSelect col",
            i,
            "set isInternalUpdate = true",
          );
          currentValue.value[i] = scrollerValue;
          nextTick(() => {
            emit("on-change", getValue());
          });
          renderChain(i + 1);
          isInternalUpdate = false;
          console.log(
            "[Picker] renderChain onSelect col",
            i,
            "set isInternalUpdate = false",
          );
        },
      });

      if (list.length) {
        console.log(
          "[Picker] renderChain(" + i + ") setting currentValue[" + i + "] =",
          list[0].value,
        );
        currentValue.value[i] = list[0].value;
        renderChain(i + 1);
      } else {
        console.log(
          "[Picker] renderChain(" +
            i +
            ") no children, setting currentValue[" +
            i +
            "] = null",
        );
        currentValue.value[i] = null;
      }

      isInternalUpdate = false;
      console.log(
        "[Picker] renderChain(" + i + ") set isInternalUpdate = false, exiting",
      );
    }

    function getValue(): any[] {
      const data: any[] = [];
      for (let i = 0; i < currentData.value.length; i++) {
        if (scrollers[i]) {
          data.push(scrollers[i].value);
        } else {
          return [];
        }
      }
      return data;
    }

    function emitValueChange(val: any[]) {
      if (!props.columns || (props.columns && val.length === store!.count)) {
        emit("on-change", val);
      }
    }

    function getNameValues() {
      return value2name(currentValue.value, currentData.value);
    }

    watch(
      () => props.modelValue,
      (val: any) => {
        if (JSON.stringify(val) !== JSON.stringify(currentValue.value)) {
          currentValue.value = val || [];
        }
      },
    );

    watch(
      currentValue,
      (val: any[], oldVal: any[]) => {
        console.log(
          "[Picker] currentValue watch fired, val:",
          JSON.stringify(val),
          "oldVal:",
          JSON.stringify(oldVal),
          "isInternalUpdate:",
          isInternalUpdate,
        );
        emit("update:modelValue", val);
        if (props.columns !== 0) {
          if (val.length > 0) {
            if (
              JSON.stringify(val) !== JSON.stringify(oldVal) &&
              !isInternalUpdate
            ) {
              console.log(
                "[Picker] currentValue watch - calling render (external update)",
              );
              currentData.value = store!.getColumns(val);
              nextTick(() => {
                render(currentData.value, val);
              });
            } else if (isInternalUpdate) {
              console.log(
                "[Picker] currentValue watch - skipping render (internal update)",
              );
            } else {
              console.log(
                "[Picker] currentValue watch - skipping render (val === oldVal)",
              );
            }
          } else {
            console.log(
              "[Picker] currentValue watch - render with empty value",
            );
            render(currentData.value, []);
          }
        } else {
          if (val.length) {
            for (let i = 0; i < val.length; i++) {
              if (scrollers[i] && scrollers[i].value !== val[i]) {
                scrollers[i].select(val[i]);
              }
            }
          } else {
            render(currentData.value, []);
          }
        }
      },
      { deep: true },
    );

    watch(
      () => props.data,
      (val: any) => {
        if (JSON.stringify(val) !== JSON.stringify(currentData.value)) {
          currentData.value = val || [];
        }
      },
      { deep: true },
    );

    watch(
      currentData,
      (newData: any[]) => {
        if (Object.prototype.toString.call(newData[0]) === "[object Array]") {
          nextTick(() => {
            render(newData, currentValue.value);
            nextTick(() => {
              emitValueChange(getValue());

              if (
                JSON.stringify(getValue()) !==
                JSON.stringify(currentValue.value)
              ) {
                if (
                  !props.columns ||
                  (props.columns && getValue().length === store!.count)
                ) {
                  currentValue.value = getValue();
                }
              }
            });
          });
        } else {
          if (props.columns !== 0) {
            if (!newData.length) {
              return;
            }
            const length = props.columns;
            store = new Manager(
              newData,
              length,
              props.fixedColumns || props.columns,
            );
            currentData.value = store.getColumns(currentValue.value);
          }
        }
      },
      { deep: true },
    );

    onMounted(() => {
      nextTick(() => {
        render(currentData.value, currentValue.value);
      });
    });

    onBeforeUnmount(() => {
      for (let i = 0; i < currentData.value.length; i++) {
        scrollers[i] && scrollers[i].destroy();
        scrollers[i] = null!;
      }
    });

    return {
      uuid,
      currentData,
      currentValue,
      getNameValues,
    };
  },
});
</script>
