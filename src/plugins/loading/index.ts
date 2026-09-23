import { createVNode, render } from "vue";
import LoadingComponent from "../../components/loading/index.vue";

interface LoadingOptions {
  text?: string;
  delay?: number;
  onShow?: (vm: any) => void;
  onHide?: (vm: any) => void;
}

let $vm: any = null;
let container: HTMLDivElement | null = null;
let delayTimer: ReturnType<typeof setTimeout> | null = null;

function createLoadingVM() {
  if ($vm) return;

  container = document.createElement("div");
  document.body.appendChild(container);

  const vnode = createVNode(LoadingComponent, { show: false, text: "" });
  render(vnode, container);
  $vm = vnode.component;
}

function ensureVM() {
  if (!$vm) {
    createLoadingVM();
  }
}

export const loading = {
  show(options: LoadingOptions | string = {}) {
    ensureVM();
    if (!container || !$vm) return;

    if (typeof options === "string") {
      $vm.props.text = options;
    } else if (typeof options === "object") {
      const props = $vm.props;
      if (props) {
        const propKeys = Object.keys(props).filter((k) => k !== "show");
        for (const key of propKeys) {
          if (key in options) {
            props[key] = (options as Record<string, unknown>)[key];
          }
        }
      }
    }

    if (delayTimer) {
      clearTimeout(delayTimer);
      delayTimer = null;
    }

    const delay = (typeof options === "object" ? options.delay : 0) || 0;
    delayTimer = setTimeout(() => {
      $vm.props.show = true;
      if (typeof options === "object" && options.onShow) {
        options.onShow($vm);
      }
    }, delay);
  },
  hide() {
    if (delayTimer) {
      clearTimeout(delayTimer);
      delayTimer = null;
    }
    ensureVM();
    if ($vm) {
      $vm.props.show = false;
    }
  },
  isVisible() {
    ensureVM();
    return $vm ? $vm.props.show : false;
  },
};

export function useLoading() {
  return loading;
}
