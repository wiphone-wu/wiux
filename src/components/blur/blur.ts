export interface BlurOptions {
  url: string;
  blurAmount?: number;
  imageClass?: string;
  duration?: number;
  opacity?: number;
}

function randomID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

const SVG = {
  svgNs: "http://www.w3.org/2000/svg",
  xLink: "http://www.w3.org/1999/xLink",

  createElement(name: string, attrs?: Record<string, string>) {
    const element = document.createElementNS(SVG.svgNs, name) as SVGElement;
    if (attrs) {
      SVG.setAttr(element, attrs);
    }
    return element;
  },

  setAttr(element: SVGElement, attrs: Record<string, string>) {
    for (const key in attrs) {
      if (key === "href") {
        element.setAttributeNS(SVG.xLink, key, attrs[key]);
      } else {
        element.setAttribute(key, attrs[key]);
      }
    }
    return element;
  },
};

export class Blur {
  private internalID: string;
  private element: HTMLElement;
  private width: number;
  private height: number;
  private parent: HTMLElement;
  private options: Required<BlurOptions>;
  private blurredImage: SVGElement | null = null;

  constructor(element: HTMLElement, options: BlurOptions) {
    this.internalID = randomID();
    this.element = element;
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
    this.parent = element.parentNode as HTMLElement;
    this.options = {
      blurAmount: 10,
      imageClass: "",
      duration: 100,
      opacity: 1,
      ...options,
    };
    this.generateBlurredImage(this.options.url);
  }

  setBlurAmount(blurAmount: number) {
    this.options.blurAmount = blurAmount;
  }

  generateBlurredImage(url: string) {
    const previousImage = this.blurredImage;
    this.internalID = randomID();

    if (previousImage && previousImage.parentNode) {
      previousImage.parentNode.removeChild(previousImage);
    }

    this.blurredImage = this.createSVG(url, this.width, this.height);
  }

  private createSVG(url: string, width: number, height: number): SVGElement {
    const svg = SVG.createElement("svg", {
      xmlns: SVG.svgNs,
      version: "1.1",
      width: String(width),
      height: String(height),
      id: "blurred" + this.internalID,
      class: this.options.imageClass,
      viewBox: "0 0 " + width + " " + height,
      preserveAspectRatio: "none",
    });

    const filterId = "blur" + this.internalID;
    const filter = SVG.createElement("filter", {
      id: filterId,
    });

    const gaussianBlur = SVG.createElement("feGaussianBlur", {
      in: "SourceGraphic",
      stdDeviation: String(this.options.blurAmount),
    });

    const image = SVG.createElement("image", {
      x: "0",
      y: "0",
      width: String(width),
      height: String(height),
      externalResourcesRequired: "true",
      href: url,
      style: "filter:url(#" + filterId + ")",
      preserveAspectRatio: "none",
    });

    filter.appendChild(gaussianBlur);
    svg.appendChild(filter);
    svg.appendChild(image);

    this.parent.insertBefore(svg, this.element);

    setTimeout(() => {
      svg.style.opacity = String(this.options.opacity);
    }, this.options.duration);

    return svg;
  }
}
