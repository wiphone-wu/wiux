<template>
  <div style="display: inline-block">
    <span v-if="showTimeString">{{ timeString }}</span>
    <div ref="templateRef" style="display: none"><slot></slot></div>
    <div class="wiux-clocker-tpl" v-html="displayString"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  onUpdated,
  watch,
  nextTick,
} from "vue";
import { Countdown } from "./clocker";

const DEFAULT_FORMAT = "%D 天 %H 小时 %M 分 %S 秒";

export default defineComponent({
  name: "Clocker",
  props: {
    time: [String, Number],
    format: {
      type: String,
      default: "",
    },
  },
  emits: ["on-tick", "on-finish"],
  setup(props, { emit }) {
    const showTimeString = ref(true);
    const timeString = ref("");
    const displayString = ref("");
    const slotString = ref("");
    const templateRef = ref<HTMLElement | null>(null);
    let clocker: Countdown | null = null;

    const effectiveFormat = computed(() => props.format || DEFAULT_FORMAT);

    const update = (event: any) => {
      if (showTimeString.value) {
        timeString.value = event.strftime(effectiveFormat.value);
      } else {
        displayString.value = event.strftime(slotString.value);
      }
    };

    const render = () => {
      if (!props.time) return;
      clocker = new Countdown(props.time as string | number)
        .onTick((event) => {
          update(event);
          emit("on-tick", event);
        })
        .onFinish(() => {
          timeString.value = "00:00:00";
          emit("on-finish");
        })
        .start();
    };

    onMounted(() => {
      nextTick(() => {
        if (templateRef.value) {
          const html = templateRef.value.innerHTML;
          if (html !== "") {
            showTimeString.value = false;
            slotString.value = html;
          }
        }
        render();
      });
    });

    onUpdated(() => {
      if (templateRef.value && !showTimeString.value) {
        const html = templateRef.value.innerHTML;
        if (html !== slotString.value) {
          slotString.value = html;
        }
      }
    });

    watch(
      () => props.time,
      () => {
        if (clocker) {
          clocker.remove();
        }
        render();
      },
    );

    onBeforeUnmount(() => {
      if (clocker) {
        clocker.remove();
        clocker = null;
      }
    });

    return {
      showTimeString,
      timeString,
      displayString,
      templateRef,
    };
  },
});
</script>

<style scoped>
.wiux-clocker-tpl {
  display: inline;
}
</style>
