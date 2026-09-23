import { createVNode, render, nextTick } from "vue";
import ConfirmComponent from "../../components/confirm/index.vue";

interface ConfirmOptions {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  showInput?: boolean;
  placeholder?: string;
  closeOnConfirm?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  onCancel?: () => void;
  onConfirm?: (msg?: string) => void;
}

let $vm: any = null;
let container: HTMLDivElement | null = null;

function createVM() {
  if ($vm) return;

  container = document.createElement("div");
  document.body.appendChild(container);

  const vnode = createVNode(ConfirmComponent, {
    modelValue: false,
    title: "",
    showInput: false,
    closeOnConfirm: true,
    showCancelButton: true,
    showConfirmButton: true,
  });
  render(vnode, container);
  $vm = vnode.component;
}

function ensureVM() {
  if (!$vm) createVM();
}

export const confirm = {
  show(options: ConfirmOptions = {}) {
    ensureVM();
    if (!container) return;

    const resetVNode = createVNode(ConfirmComponent, { modelValue: false });
    render(resetVNode, container);

    const props: Record<string, any> = {
      modelValue: true,
      title: options.title || "",
      content: options.content || "",
      showInput: options.showInput || false,
      placeholder: options.placeholder || "",
      closeOnConfirm:
        options.closeOnConfirm !== undefined ? options.closeOnConfirm : true,
      showCancelButton:
        options.showCancelButton !== undefined
          ? options.showCancelButton
          : true,
      showConfirmButton:
        options.showConfirmButton !== undefined
          ? options.showConfirmButton
          : true,
      onOnConfirm: (msg: string) => {
        options.onConfirm && options.onConfirm(msg);
      },
      onOnCancel: () => {
        options.onCancel && options.onCancel();
      },
      onOnShow: () => {
        options.onShow && options.onShow();
      },
      onOnHide: () => {
        options.onHide && options.onHide();
      },
    };

    if (options.confirmText !== undefined)
      props.confirmText = options.confirmText;
    if (options.cancelText !== undefined) props.cancelText = options.cancelText;

    const vnode = createVNode(ConfirmComponent, props);
    render(vnode, container);
    $vm = vnode.component;
  },
  setInputValue(val: string) {
    nextTick(() => {
      setTimeout(() => {
        if ($vm?.exposed?.setInputValue) {
          $vm.exposed.setInputValue(val);
        }
      }, 10);
    });
  },
  prompt(placeholder: string, options: ConfirmOptions = {}) {
    this.show(
      Object.assign({}, options, {
        placeholder,
        showInput: true,
      }),
    );
  },
  hide() {
    if (!container) return;
    const vnode = createVNode(ConfirmComponent, {
      modelValue: false,
      title: "",
      showInput: false,
      closeOnConfirm: true,
      showCancelButton: true,
      showConfirmButton: true,
    });
    render(vnode, container);
    $vm = vnode.component;
  },
  isVisible() {
    return $vm ? $vm.props.modelValue : false;
  },
};

export function useConfirm() {
  return confirm;
}