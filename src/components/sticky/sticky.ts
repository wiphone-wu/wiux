function gtIOS6(): boolean {
  const userAgent = window.navigator.userAgent;
  const ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_.]+)/);
  return !!(ios && ios[2] && parseInt(ios[2].replace(/_/g, "."), 10) >= 6);
}

function isSupportSticky(): boolean {
  const prefixTestList = ["", "-webkit-", "-ms-", "-moz-", "-o-"];
  let stickyText = "";
  for (let i = 0; i < prefixTestList.length; i++) {
    stickyText += "position:" + prefixTestList[i] + "sticky;";
  }
  const div = document.createElement("div");
  const body = document.body;
  div.style.cssText = "display:none;" + stickyText;
  body.appendChild(div);
  const isSupport = /sticky/i.test(window.getComputedStyle(div).position);
  body.removeChild(div);
  return isSupport;
}

function getScrollParent(el: HTMLElement): HTMLElement | Window {
  let parent = el.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflow = style.overflow + style.overflowY;
    if (/(auto|scroll)/.test(overflow)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

interface StickyOptions {
  scrollBox?: string | HTMLElement | Window;
  offset?: number;
  checkStickySupport?: boolean;
}

export function sticky(nav: HTMLElement, options: StickyOptions = {}) {
  let scrollBox: HTMLElement | Window =
    (options.scrollBox as HTMLElement | Window) || window;
  const offset = options.offset || 0;
  const checkStickySupport = options.checkStickySupport === true;

  console.log(
    "[sticky.ts] sticky() called, nav =",
    nav,
    ", nav.className =",
    nav.className,
  );
  console.log("[sticky.ts] options =", JSON.stringify(options));
  console.log(
    "[sticky.ts] scrollBox =",
    scrollBox,
    ", offset =",
    offset,
    ", checkStickySupport =",
    checkStickySupport,
  );

  if (typeof scrollBox === "string" && scrollBox) {
    const el = document.getElementById(scrollBox);
    console.log(
      "[sticky.ts] scrollBox is string, looking for element id =",
      scrollBox,
      ", found =",
      !!el,
    );
    if (!el) {
      if (process.env.NODE_ENV === "development") {
        console.error("[WIUX] sticky: scroll-box element doesn't exist");
      }
      return;
    }
    scrollBox = el;
  }

  // Auto-detect scroll container when not explicitly specified
  if (scrollBox === window) {
    const detected = getScrollParent(nav);
    if (detected !== window) {
      scrollBox = detected;
      console.log(
        "[sticky.ts] auto-detected scroll parent =",
        scrollBox,
        ", className =",
        (scrollBox as HTMLElement).className,
      );
    }
  }

  function getOffsetTop(el: HTMLElement): number {
    if (scrollBox === window) {
      return el.offsetTop;
    }
    const scrollRect = (scrollBox as HTMLElement).getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return elRect.top - scrollRect.top + (scrollBox as HTMLElement).scrollTop;
  }

  let navOffsetY = getOffsetTop(nav) - offset;
  console.log(
    "[sticky.ts] navOffsetY =",
    navOffsetY,
    ", nav.offsetTop =",
    nav.offsetTop,
  );

  const getTop = function (): number {
    if (scrollBox === window) {
      return (
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop
      );
    } else {
      return (scrollBox as HTMLElement).scrollTop;
    }
  };

  const getFillElem = function (el: HTMLElement): HTMLElement {
    let next = el.nextSibling;
    while (next && next.nodeType !== 1) {
      next = next.nextSibling;
    }
    if (
      next &&
      (next as HTMLElement).classList &&
      (next as HTMLElement).classList.contains("wiux-sticky-fill")
    ) {
      return next as HTMLElement;
    }
    return el.parentNode as HTMLElement;
  };

  // Calculate the base top offset for fixed positioning
  // This accounts for the scroll container's padding-top (e.g., header height)
  let baseTop = offset;

  const scrollHandler = function () {
    const distance = getTop();
    console.log(
      "[sticky.ts] scrollHandler, distance =",
      distance,
      ", navOffsetY =",
      navOffsetY,
      ", nav.className =",
      nav.className,
    );
    if (distance > navOffsetY) {
      nav.style.top = baseTop + "px";
      nav.classList.add("wiux-fixed");
      console.log(
        "[sticky.ts] -> added wiux-fixed with top =",
        nav.style.top,
        ", className now =",
        nav.className,
      );
    } else {
      nav.classList.remove("wiux-fixed");
      console.log(
        "[sticky.ts] -> removed wiux-fixed, className now =",
        nav.className,
      );
    }
  };

  // Remove previous listener if exists
  if ((scrollBox as any).e) {
    scrollBox.removeEventListener("scroll", (scrollBox as any).e);
  }

  const isIOS6 = gtIOS6();
  const supportSticky = isSupportSticky();
  console.log(
    "[sticky.ts] gtIOS6() =",
    isIOS6,
    ", isSupportSticky() =",
    supportSticky,
  );
  console.log(
    "[sticky.ts] checkStickySupport && (gtIOS6 || isSupportSticky) =",
    checkStickySupport && (isIOS6 || supportSticky),
  );

  if (checkStickySupport && (isIOS6 || supportSticky)) {
    nav.style.top = baseTop + "px";
    nav.classList.add("wiux-sticky");
    console.log(
      "[sticky.ts] -> using CSS sticky, top =",
      nav.style.top,
      ", added wiux-sticky, className now =",
      nav.className,
    );
  } else {
    console.log(
      "[sticky.ts] -> using JS scroll handler, attaching scroll event to",
      scrollBox === window ? "window" : scrollBox,
    );
    if (nav.classList.contains("wiux-fixed")) {
      const top = getTop();
      navOffsetY = getOffsetTop(getFillElem(nav)) - offset;
      if (top < navOffsetY) {
        nav.classList.remove("wiux-fixed");
      }
    } else {
      navOffsetY = getOffsetTop(nav) - offset;
    }
    (scrollBox as any).e = scrollHandler;
    scrollBox.addEventListener("scroll", scrollHandler);
  }
}
