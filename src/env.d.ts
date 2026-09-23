declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "async-validator" {
  const AsyncValidator: any;
  export default AsyncValidator;
}

declare module "photoswipe/dist/photoswipe" {
  const PhotoSwipe: any;
  export default PhotoSwipe;
}

declare module "photoswipe/dist/photoswipe-ui-default" {
  const UI: any;
  export default UI;
}

declare module "qr.js/lib/QRCode" {
  const QRCode: any;
  export default QRCode;
}

declare module "qr.js/lib/ErrorCorrectLevel" {
  const ErrorCorrectLevel: any;
  export default ErrorCorrectLevel;
}

declare module "vanilla-masker" {
  const mask: any;
  export default mask;
}

declare const process: {
  env: {
    NODE_ENV: string;
  };
};

declare module "*.less" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.css" {}
