import { Directive } from "vue";

const directive: Directive = {
  mounted(el: HTMLElement, { value }: any) {
    const onClickOutside = value;
    (el as any).__clickOutsideHandler = function (e: MouseEvent) {
      if (el && !el.contains(e.target as Node)) {
        onClickOutside(e);
      }
    };
    document.addEventListener("click", (el as any).__clickOutsideHandler, true);
  },
  beforeUnmount(el: HTMLElement) {
    document.removeEventListener(
      "click",
      (el as any).__clickOutsideHandler,
      true,
    );
    (el as any).__clickOutsideHandler = null;
  },
};

export default directive;
