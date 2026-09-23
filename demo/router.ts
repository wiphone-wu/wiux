import type { RouteRecordRaw } from "vue-router";
import Home from "./views/Home.vue";
import DemoList from "./views/DemoList.vue";
import ComponentDemo from "./views/ComponentDemo.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/demo",
    name: "demoList",
    component: DemoList,
  },
  {
    path: "/component/:name",
    name: "componentDemo",
    component: ComponentDemo,
    props: true,
  },
];

export default routes;
