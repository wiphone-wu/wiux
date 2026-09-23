<template>
  <img :src="computedSrc" class="wiux-x-img" :class="{ 'b-loaded': loaded }" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";

export default defineComponent({
  name: "XImg",
  props: {
    src: String,
    webpSrc: String,
    defaultSrc: {
      type: String,
      default:
        "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    },
    errorClass: String,
    successClass: String,
    offset: {
      type: Number,
      default: 100,
    },
    container: String,
    delay: {
      type: Number,
      default: 0,
    },
  },
  emits: ["on-success", "on-error"],
  setup(props, { emit }) {
    const loaded = ref(false);
    const computedSrc = ref(props.defaultSrc);

    const supportsWebp = ref(false);

    const detectWebp = () => {
      const canvas = document.createElement("canvas");
      if (canvas.getContext && canvas.getContext("2d")) {
        supportsWebp.value =
          canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
      }
    };

    const loadImage = () => {
      const targetSrc =
        supportsWebp.value && props.webpSrc ? props.webpSrc : props.src;
      if (!targetSrc) return;

      const img = new Image();
      img.onload = () => {
        computedSrc.value = targetSrc;
        loaded.value = true;
        emit("on-success", props.src, null);
      };
      img.onerror = (e) => {
        emit("on-error", props.src, null, "load error");
      };
      img.src = targetSrc;
    };

    onMounted(() => {
      detectWebp();
      setTimeout(() => {
        loadImage();
      }, props.delay);
    });

    watch(
      () => props.src,
      () => {
        loaded.value = false;
        computedSrc.value = props.defaultSrc;
        loadImage();
      },
    );

    return {
      loaded,
      computedSrc,
    };
  },
});
</script>

<style>
.wiux-x-img {
  transition: opacity 500ms ease-in-out;
  max-width: 100%;
  opacity: 0;
}
.wiux-x-img.b-loaded {
  opacity: 1;
}
</style>
