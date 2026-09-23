import { createVNode, render } from "vue";
import AlertComponent from "../../components/alert/index.vue";

interface AlertOptions {
  title?: string;
  content?: string;
  buttonText?: string;
  hideOnBlur?: boolean;
  maskZIndex?: number | string;
  onShow?: () => void;
  onHide?: () => void;
}

let $vm: any = null;
let container: HTMLDivElement | null = null;

function createVM() {
  if ($vm) return;

  container = document.createElement("div");
  document.body.appendChild(container);

  const vnode = createVNode(AlertComponent, {
    modelValue: false,
    title: "",
    content: "",
  });
  render(vnode, container);
  $vm = vnode.component;
}

function ensureVM() {
  if (!$vm) createVM();
}

export const alert = {
  show(options: AlertOptions | string = {}) {
    ensureVM();
    if (!container) return;

    const opts: AlertOptions =
      typeof options === "string" ? { content: options } : options;

    const props: Record<string, any> = {
      modelValue: true,
      title: opts.title || "",
      content: opts.content || "",
      buttonText: opts.buttonText || "",
      hideOnBlur: opts.hideOnBlur || false,
      maskZIndex: opts.maskZIndex !== undefined ? opts.maskZIndex : undefined,
      onOnShow: () => {
        opts.onShow && opts.onShow();
      },
      onOnHide: () => {
        opts.onHide && opts.onHide();
      },
    };

    const vnode = createVNode(AlertComponent, props);
    render(vnode, container);
    $vm = vnode.component;
  },
  hide() {
    if (!container) return;
    const vnode = createVNode(AlertComponent, { modelValue: false });
    render(vnode, container);
    $vm = vnode.component;
  },
  isVisible() {
    ensureVM();
    return $vm ? $vm.props.modelValue : false;
  },
};

export function useAlert() {
  return alert;
}
