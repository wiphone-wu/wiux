<script lang="ts">
import { defineComponent, ref, onMounted, watch, h } from "vue";
import { CountUp } from "countup.js";

export default defineComponent({
  name: "Countup",
  props: {
    tag: {
      type: String,
      default: "span",
    },
    start: {
      type: Boolean,
      default: true,
    },
    startVal: {
      type: Number,
      default: 0,
    },
    endVal: {
      type: Number,
      required: true,
    },
    decimals: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 2,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    let countup: CountUp | null = null;
    const elRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (elRef.value) {
        countup = new CountUp(elRef.value, props.endVal, {
          startVal: props.startVal,
          decimalPlaces: props.decimals,
          duration: props.duration,
          ...props.options,
        });
        if (props.start) {
          countup.start();
        }
      }
    });

    watch(
      () => props.start,
      (val) => {
        if (val && countup) {
          countup.start();
        }
      },
    );

    watch(
      () => props.endVal,
      (val) => {
        if (countup) {
          countup.update(val);
        }
      },
    );

    return () => h(props.tag, { ref: elRef }, [props.startVal]);
  },
});
</script>
