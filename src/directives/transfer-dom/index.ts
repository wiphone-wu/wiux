// Thanks to: https://github.com/calebroseland/vue-dom-portal
// Adapted for Vue 3

import { Directive, VNode } from "vue";

function getTarget(node: any): Node {
  if (node === undefined) {
    return document.body;
  }

  if (typeof node === "string" && node.indexOf("?") === 0) {
    return document.body;
  } else if (typeof node === "string" && node.indexOf("?") > 0) {
    node = node.split("?")[0];
  }

  if (node === "body" || node === true) {
    return document.body;
  }

  return node instanceof window.Node ? node : document.querySelector(node);
}

function getShouldUpdate(node: any): boolean {
  if (!node) {
    return false;
  }
  if (typeof node === "string" && node.indexOf("?") > 0) {
    try {
      const config = JSON.parse(node.split("?")[1]);
      return config.autoUpdate || false;
    } catch (e) {
      return false;
    }
  }
  return false;
}

const directive: Directive = {
  mounted(el: HTMLElement, { value }: any, vnode: VNode) {
    el.className = el.className
      ? el.className + " v-transfer-dom"
      : "v-transfer-dom";
    const parentNode = el.parentNode;
    let home: Comment | null = document.createComment("");
    let hasMovedOut = false;

    if (value !== false) {
      parentNode!.replaceChild(home, el);
      getTarget(value).appendChild(el);
      hasMovedOut = true;
    }

    if (!(el as any).__transferDomData) {
      (el as any).__transferDomData = {
        parentNode: parentNode,
        home: home,
        target: getTarget(value),
        hasMovedOut: hasMovedOut,
      };
    }
  },

  updated(el: HTMLElement, { value }: any) {
    const shouldUpdate = getShouldUpdate(value);
    if (!shouldUpdate) {
      return;
    }

    const ref$1 = (el as any).__transferDomData;
    if (!ref$1) return;

    const parentNode = ref$1.parentNode;
    const home = ref$1.home;
    const hasMovedOut = ref$1.hasMovedOut;

    if (!hasMovedOut && value) {
      parentNode.replaceChild(home!, el);
      getTarget(value).appendChild(el);
      (el as any).__transferDomData = Object.assign(
        {},
        (el as any).__transferDomData,
        { hasMovedOut: true, target: getTarget(value) },
      );
    } else if (hasMovedOut && value === false) {
      parentNode.replaceChild(el, home!);
      (el as any).__transferDomData = Object.assign(
        {},
        (el as any).__transferDomData,
        { hasMovedOut: false, target: getTarget(value) },
      );
    } else if (value) {
      getTarget(value).appendChild(el);
    }
  },

  beforeUnmount(el: HTMLElement) {
    el.className = el.className.replace("v-transfer-dom", "");
    if (
      (el as any).__transferDomData &&
      (el as any).__transferDomData.hasMovedOut === true
    ) {
      (el as any).__transferDomData.parentNode &&
        (el as any).__transferDomData.parentNode.appendChild(el);
    }
    (el as any).__transferDomData = null;
  },
};

export default directive;
