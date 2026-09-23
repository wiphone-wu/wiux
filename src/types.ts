export interface MenuItem {
  label?: string;
  value?: string | number;
  type?: "primary" | "warn" | "default" | "disabled" | "info";
  [key: string]: unknown;
}

export interface ActionsheetProps {
  modelValue?: boolean;
  showCancel?: boolean;
  cancelText?: string;
  theme?: "ios" | "android";
  menus?: Record<string, string | MenuItem> | MenuItem[];
  closeOnClickingMask?: boolean;
  closeOnClickingMenu?: boolean;
}

export interface CellProps {
  title?: string | number;
  value?: string | number | string[];
  isLink?: boolean;
  isLoading?: boolean;
  inlineDesc?: string | number;
  primary?: string;
  link?: string | Record<string, unknown>;
  valueAlign?: string | boolean | number;
  borderIntent?: boolean;
  disabled?: boolean;
  arrowDirection?: string;
  alignItems?: string;
}

export interface GroupProps {
  title?: string;
  titleColor?: string;
  labelWidth?: string;
  labelAlign?: string;
  labelMarginRight?: string;
  gutter?: string | number;
  footerTitle?: string;
  footerTitleColor?: string;
}

export interface XButtonProps {
  type?: string;
  disabled?: boolean;
  mini?: boolean;
  plain?: boolean;
  text?: string;
  actionType?: string;
  showLoading?: boolean;
  link?: string | Record<string, unknown>;
  gradients?: string[];
}

export interface XSwitchProps {
  title: string;
  disabled?: boolean;
  modelValue?: boolean | string | number;
  inlineDesc?: string | boolean | number;
  preventDefault?: boolean;
  valueMap?: any[];
}

export interface GridProps {
  rows?: number;
  cols?: number;
  showLrBorders?: boolean;
  showVerticalDividers?: boolean;
  disabled?: boolean;
}

export interface GridItemProps {
  icon?: string;
  label?: string;
  link?: string | Record<string, unknown>;
  disabled?: boolean;
}

export interface FlexBoxProps {
  gutter?: number;
  orient?: string;
  justify?: string;
  align?: string;
  wrap?: string;
  direction?: string;
}

export interface FlexBoxItemProps {
  span?: number | string;
  order?: number | string;
}

export interface BadgeProps {
  text?: string | number;
}

export interface RadioProps {
  options: any[];
  modelValue?: string | number;
  fillMode?: boolean;
  fillPlaceholder?: string;
  fillLabel?: string;
  disabled?: boolean;
  selectedLabelStyle?: Record<string, string>;
}

export interface LoadingProps {
  show?: boolean;
  text?: string;
  position?: string;
  transition?: string;
}

export interface XNumberProps {
  min?: number;
  max?: number;
  readonly?: boolean;
  step?: number;
  modelValue?: number | string;
  name?: string;
  title?: string;
  fillable?: boolean;
  width?: string;
  buttonStyle?: string;
  align?: string;
}

export interface XDialogProps {
  modelValue?: boolean;
  maskTransition?: string;
  maskZIndex?: string | number;
  dialogTransition?: string;
  dialogClass?: string;
  hideOnBlur?: boolean;
  dialogStyle?: Record<string, string>;
}

export interface ColorPickerProps {
  modelValue?: string;
  colors: string[];
  size?: "large" | "middle" | "small";
}

export interface CountdownProps {
  modelValue?: number;
  start?: boolean;
}

export interface CountupProps {
  tag?: string;
  start?: boolean;
  startVal?: number;
  endVal: number;
  decimals?: number;
  duration?: number;
  options?: Record<string, unknown>;
}

export interface XIconProps {
  type: string;
  size?: string | number;
}

export interface XImgProps {
  src?: string;
  webpSrc?: string;
  defaultSrc?: string;
  errorClass?: string;
  successClass?: string;
  offset?: number;
  container?: string;
  delay?: number;
}

export interface XInputProps {
  title?: string;
  type?: string;
  placeholder?: string;
  modelValue?: string | number;
  name?: string;
  readonly?: boolean;
  disabled?: boolean;
  keyboard?: string;
  inlineDesc?: string;
  isType?: string | Function;
  min?: number;
  max?: number;
  showClear?: boolean;
  equalWith?: string;
  textAlign?: string;
  required?: boolean;
  noValidate?: boolean;
  iconType?: string;
  debounce?: number;
  placeholderAlign?: string;
  labelWidth?: string;
  mask?: string;
  shouldToastError?: boolean;
}

export interface XAddressProps {
  title: string;
  modelValue?: any[];
  columns?: number;
  rawValue?: boolean;
  list: any[];
  labelWidth?: string;
  inlineDesc?: string;
  placeholder?: string;
  hideDistrict?: boolean;
  valueTextAlign?: string;
  confirmText?: string;
  cancelText?: string;
  displayFormat?: Function;
  popupStyle?: Record<string, any>;
  popupTitle?: string;
  show?: boolean;
  disabled?: boolean;
}

export interface PopoverProps {
  content?: string;
  placement?: string;
  gutter?: number;
}

export interface SwiperProps {
  list?: any[];
  direction?: string;
  showDots?: boolean;
  showDescMask?: boolean;
  dotsPosition?: string;
  dotsClass?: string;
  auto?: boolean;
  loop?: boolean;
  interval?: number;
  threshold?: number;
  duration?: number;
  height?: string;
  aspectRatio?: number;
  minMovingDistance?: number;
  modelValue?: number;
}

export interface tabbarProps {
  modelValue?: number;
  iconClass?: string;
}

export interface tabbarItemProps {
  showDot?: boolean;
  badge?: string;
  link?: string | Record<string, unknown>;
  iconClass?: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface XTextareaProps {
  title?: string;
  inlineDesc?: string;
  showCounter?: boolean;
  max?: number;
  modelValue?: string;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  height?: number;
  autocomplete?: string;
  autocapitalize?: string;
  autocorrect?: string;
  spellcheck?: string;
  autosize?: boolean;
  labelWidth?: string;
  labelAlign?: string;
  labelMarginRight?: string;
}

export interface XProgressProps {
  percent?: number;
  showCancel?: boolean;
}

export interface XHeaderProps {
  leftOptions?: {
    showBack?: boolean;
    backText?: string;
    preventGoBack?: boolean;
  };
  title?: string;
  transition?: string;
  rightOptions?: {
    showMore?: boolean;
  };
}

export interface RangeProps {
  decimal?: boolean;
  modelValue?: number;
  min?: number;
  minHTML?: string;
  maxHTML?: string;
  max?: number;
  step?: number;
  disabled?: boolean;
  disabledOpacity?: number;
  rangeBarHeight?: number;
  rangeHandleHeight?: number;
}

export interface SearchProps {
  type?: string;
  required?: boolean;
  placeholder?: string;
  cancelText?: string;
  modelValue?: string;
  results?: any[];
  autoFixed?: boolean;
  top?: string;
  position?: string;
  autoScrollToTop?: boolean;
}

export interface PreviewerProps {
  list: PreviewerImage[];
  index?: number;
  options?: Record<string, unknown>;
}

export interface PreviewerImage {
  msrc?: string;
  src: string;
  w?: number;
  h?: number;
}

export interface QrcodeProps {
  value?: string;
  size?: number;
  level?: string;
  bgColor?: string;
  fgColor?: string;
  type?: string;
}

export interface TimelineProps {
  color?: string;
  isShowIcon?: boolean;
}

export interface TimelineItemProps {}

export interface StickyProps {
  scrollBox?: string;
  offset?: number;
  checkStickySupport?: boolean;
  disabled?: boolean;
}

export interface swipeoutProps {}

export interface swipeoutItemProps {
  sensitivity?: number;
  autoCloseOnButtonClick?: boolean;
  disabled?: boolean;
  threshold?: number;
  underlayColor?: string;
  transitionMode?: string;
}

export interface swipeoutButtonProps {
  text?: string;
  backgroundColor?: string;
  type?: string;
  width?: number;
  disabled?: boolean;
}

export interface ScrollerProps {
  height?: string;
  lockX?: boolean;
  lockY?: boolean;
  scrollbarX?: boolean;
  scrollbarY?: boolean;
  bounce?: boolean;
  usePullDown?: boolean;
  usePullUp?: boolean;
  pullDownConfig?: Record<string, unknown>;
  pullUpConfig?: Record<string, unknown>;
  scrollBottomOffset?: number;
}

export interface WechatEmotionProps {
  isGif?: boolean;
}

export interface XTableProps {
  fullBordered?: boolean;
  cellBordered?: boolean;
  contentBordered?: boolean;
}

export interface ViewBoxProps {
  bodyPaddingTop?: string;
  bodyPaddingBottom?: string;
}

export interface VChartProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  data?: any[];
  tooltip?: Record<string, any>;
  shape?: string;
  preventRender?: boolean;
  preventDefault?: boolean;
}

export interface DrawerProps {
  modelValue?: boolean;
  placement?: "left" | "right";
  showMode?: "push" | "overlay";
  drawerStyle?: Record<string, string>;
}

export interface XCircleProps {
  strokeWidth?: number;
  strokeColor?: string | string[];
  trailWidth?: number;
  trailColor?: string;
  percent?: number;
  strokeLinecap?: string;
  anticlockwise?: boolean;
  id?: string;
}

export interface UploaderFileItem {
  url: string;
  blob?: Blob;
  fetchStatus?: string;
  progress?: number;
  [key: string]: any;
}

export interface UploaderProps {
  title?: string;
  files?: UploaderFileItem[];
  limit?: number | string;
  limitPrompt?: (limit: number) => string;
  capture?: boolean | string;
  enableCompress?: boolean;
  maxWidth?: string | number;
  quality?: string | number;
  url?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  params?: Record<string, string>;
  name?: string;
  autoUpload?: boolean;
  multiple?: string | boolean;
  readonly?: boolean;
}

export interface XFormProps {
  model?: Record<string, any>;
}

export interface XFormFieldProps {
  prop?: string;
  rules?: any[] | any;
  required?: boolean;
  message?: string;
}
