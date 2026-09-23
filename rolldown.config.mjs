import { defineConfig } from "rolldown";
import Vue from "unplugin-vue/rolldown";

function wiuxResolveStylePlugin() {
  return {
    name: "wiux-resolve-style",

    resolveId(id) {
      if (id.includes("?vue&type=style") && id.includes("&lang.css")) {
        return `${id}.js`;
      }

      return null;
    },
  };
}

function wiuxStyleInjectPlugin() {
  return {
    name: "wiux-style-inject",

    transform(code, id) {
      const isVueStyle = id.includes("?vue&type=style");
      const isCssFile = id.split("?")[0].endsWith(".css");

      if (!isVueStyle && !isCssFile) {
        return null;
      }

      const css = JSON.stringify(code);

      return {
        code: [
          "const __wiux_style = document.createElement('style');",
          `__wiux_style.textContent = ${css};`,
          "document.head.appendChild(__wiux_style);",
        ].join("\n"),

        map: null,

        moduleType: "js",
      };
    },
  };
}

export default defineConfig({
  input: "src/index.ts",

  output: [
    {
      format: "es",
      file: "dist/wiux.es.js",
      sourcemap: true,
    },
    {
      format: "umd",
      file: "dist/wiux.umd.js",
      name: "Wiux",
      sourcemap: true,
      globals: {
        vue: "Vue",
      },
    },
  ],

  external: ["vue"],

  plugins: [
    wiuxResolveStylePlugin(),
    Vue({
      style: {
        preprocessLang: "less",
      },
    }),
    wiuxStyleInjectPlugin(),
  ],
});
