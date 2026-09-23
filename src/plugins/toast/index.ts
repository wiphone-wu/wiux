import { createVNode, render } from "vue";
import ToastComponent from "../../components/toast/index.vue";

interface ToastOptions {
  text?: string;
  type?: string;
  width?: string;
  position?: string;
  time?: number;
  isShowMask?: boolean;
  onShow?: () => void;
  onHide?: () => void;
}

let $vm: any = null;
let container: HTMLDivElement | null = null;

function createVM() {
  if ($vm) return;

  container = document.createElement("div");
  document.body.appendChild(container);

  const vnode = createVNode(ToastComponent, {
    modelValue: false,
    text: "",
    type: "success",
    time: 2000,
  });
  render(vnode, container);
  $vm = vnode.component;
}

function ensureVM() {
  if (!$vm) createVM();
}

export const toast = {
  show(options: ToastOptions | string = {}) {
    ensureVM();
    if (!container) return;

    const opts: ToastOptions =
      typeof options === "string" ? { text: options } : options;

    const props: Record<string, any> = {
      modelValue: true,
      text: opts.text || "",
      type: opts.type || "success",
      width: opts.width || "7.6em",
      position: opts.position || "",
      time: opts.time !== undefined ? opts.time : 2000,
      isShowMask: opts.isShowMask || false,
      onOnShow: () => {
        opts.onShow && opts.onShow();
      },
      onOnHide: () => {
        opts.onHide && opts.onHide();
      },
    };

    render(null, container);
    const vnode = createVNode(ToastComponent, props);
    render(vnode, container);
    $vm = vnode.component;
  },
  text(text: string, position = "default") {
    this.show({
      type: "text",
      width: "auto",
      position,
      text,
    });
  },
  hide() {
    if (!container) return;
    render(null, container);
    const vnode = createVNode(ToastComponent, { modelValue: false });
    render(vnode, container);
    $vm = vnode.component;
  },
  isVisible() {
    ensureVM();
    return $vm ? $vm.props.modelValue : false;
  },
};

export function useToast() {
  return toast;
}
