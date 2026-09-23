import type { RouterScrollBehavior } from "vue-router";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createLocale } from "../src/index";
import App from "./App.vue";
import routes from "./router";
import "../src/styles/index.less";
import demoZhCN from "./locales/zh";
import demoEn from "./locales/en";

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  }
  // DemoList handles its own scroll restoration via keep-alive
  if (to.name === "demoList") {
    return false;
  }
  return { top: 0 };
};

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior,
});

const app = createApp(App);

app.use(router);

const i18n = createLocale("zh", {
  zh: demoZhCN,
  en: demoEn,
});
app.use(i18n);

app.mount("#app");
