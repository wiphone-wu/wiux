<template>
  <div>
    <canvas
      :style="{
        height: `${size}px`,
        width: `${size}px`,
      }"
      :height="size"
      :width="size"
      v-show="type === 'canvas'"
      ref="canvasRef"
    ></canvas>
    <img
      :src="imgData"
      v-if="type === 'img'"
      :style="{
        height: `${size}px`,
        width: `${size}px`,
      }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, onMounted } from "vue";
import QRCodeImpl from "qr.js/lib/QRCode";
import ErrorCorrectLevel from "qr.js/lib/ErrorCorrectLevel";

function getBackingStorePixelRatio(ctx: any): number {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  );
}

function utf16to8(str: string): string {
  let out = "";
  const len = str.length;
  for (let i = 0; i < len; i++) {
    const c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  return out;
}

export default defineComponent({
  name: "Qrcode",
  props: {
    value: String,
    size: {
      type: Number,
      default: 160,
    },
    level: {
      type: String,
      default: "L",
    },
    bgColor: {
      type: String,
      default: "#FFFFFF",
    },
    fgColor: {
      type: String,
      default: "#000000",
    },
    type: {
      type: String,
      default: "img",
    },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const imgData = ref("");

    const render = () => {
      if (typeof props.value === "undefined") {
        return;
      }

      // @ts-ignore
      const level = (ErrorCorrectLevel as any)[props.level];
      const qrcode = new QRCodeImpl(-1, level);
      qrcode.addData(utf16to8(props.value!));
      qrcode.make();

      const canvas = canvasRef.value;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cells = qrcode.modules;
      const tileW = props.size / cells.length;
      const tileH = props.size / cells.length;
      const scale =
        (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
      canvas.height = canvas.width = props.size * scale;
      ctx.scale(scale, scale);

      cells.forEach((row: any[], rdx: number) => {
        row.forEach((cell: any, cdx: number) => {
          ctx.fillStyle = cell ? props.fgColor : props.bgColor;
          const w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
          const h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
          ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
        });
      });
      if (props.type === "img") {
        imgData.value = canvas.toDataURL("image/png");
      }
    };

    watch(
      () => props.value,
      () => {
        nextTick(() => render());
      },
    );

    watch(
      () => props.size,
      () => {
        nextTick(() => render());
      },
    );

    watch(
      () => props.level,
      () => {
        nextTick(() => render());
      },
    );

    watch(
      () => props.bgColor,
      () => {
        nextTick(() => render());
      },
    );

    watch(
      () => props.fgColor,
      () => {
        nextTick(() => render());
      },
    );

    onMounted(() => {
      nextTick(() => render());
    });

    return {
      canvasRef,
      imgData,
      render,
    };
  },
});
</script>
