<template>
  <div class="wiux-circle">
    <svg viewBox="0 0 100 100">
      <defs v-if="isGradient">
        <linearGradient :id="id" x1="10%" y1="45%" x2="50%" y2="0%">
          <stop
            offset="0%"
            :style="{ 'stop-color': strokeColor[0], 'stop-opacity': 1 }"
          />
          <stop
            offset="100%"
            :style="{ 'stop-color': strokeColor[1], 'stop-opacity': 1 }"
          />
        </linearGradient>
      </defs>
      <path
        :d="pathString"
        :stroke="trailColor"
        :stroke-width="trailWidth"
        :fill-opacity="0"
      />
      <path
        :d="pathString"
        :stroke-linecap="
          strokeLinecap as 'inherit' | 'round' | 'butt' | 'square'
        "
        :stroke="isGradient ? url : strokeColor"
        :stroke-width="strokeWidth"
        fill-opacity="0"
        :style="pathStyle"
      />
    </svg>
    <div class="wiux-circle-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "XCircle",
  props: {
    strokeWidth: {
      type: Number,
      default: 1,
    },
    strokeColor: {
      type: [Array, String] as any,
      default: "#3FC7FA",
    },
    trailWidth: {
      type: Number,
      default: 1,
    },
    trailColor: {
      type: String,
      default: "#D9D9D9",
    },
    percent: {
      type: Number,
      default: 0,
    },
    strokeLinecap: {
      type: String,
      default: "round",
    },
    anticlockwise: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "wiux-circle-gradient",
    },
  },
  setup(props) {
    const url = computed(() => "url(#" + props.id + ")");

    const radius = computed(() => 50 - props.strokeWidth / 2);

    const pathString = computed(() => {
      return `M 50,50 m 0,-${radius.value}
      a ${radius.value},${radius.value} 0 1 1 0,${2 * radius.value}
      a ${radius.value},${radius.value} 0 1 1 0,-${2 * radius.value}`;
    });

    const len = computed(() => Math.PI * 2 * radius.value);

    const pathStyle = computed(() => {
      const percent = props.anticlockwise
        ? props.percent - 100
        : 100 - props.percent;
      return {
        "stroke-dasharray": `${len.value}px ${len.value}px`,
        "stroke-dashoffset": `${(percent / 100) * len.value}px`,
        transition: "stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease",
      };
    });

    const isGradient = computed(() => typeof props.strokeColor !== "string");

    return {
      url,
      radius,
      pathString,
      len,
      pathStyle,
      isGradient,
    };
  },
});
</script>

<style>
.wiux-circle {
  position: relative;
  width: 100%;
  height: 100%;
}
.wiux-circle-content {
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
