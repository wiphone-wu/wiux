function getExifOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const view = new DataView(e.target!.result as ArrayBuffer);
      if (view.getUint16(0, false) !== 0xffd8) {
        return resolve(1);
      }
      const length = view.byteLength;
      let offset = 2;
      while (offset < length) {
        const marker = view.getUint16(offset, false);
        if (marker === 0xffe1) {
          const tiffOffset = offset + 10;
          if (tiffOffset + 14 > length) {
            return resolve(1);
          }
          const littleEndian = view.getUint16(tiffOffset, false) === 0x4949;
          const check = view.getUint16(tiffOffset + 2, littleEndian);
          if (check !== 0x002a) {
            return resolve(1);
          }
          const firstIFDOffset = view.getUint32(tiffOffset + 4, littleEndian);
          const ifdOffset = tiffOffset + firstIFDOffset;
          if (ifdOffset + 2 > length) {
            return resolve(1);
          }
          const entries = view.getUint16(ifdOffset, littleEndian);
          for (let i = 0; i < entries; i++) {
            const entryOffset = ifdOffset + 2 + i * 12;
            if (entryOffset + 12 > length) {
              return resolve(1);
            }
            const tag = view.getUint16(entryOffset, littleEndian);
            if (tag === 0x0112) {
              const orientation = view.getUint16(entryOffset + 8, littleEndian);
              return resolve(
                orientation >= 1 && orientation <= 8 ? orientation : 1,
              );
            }
          }
          return resolve(1);
        }
        if (marker === 0xffd9) {
          return resolve(1);
        }
        offset += 2 + view.getUint16(offset + 2, false);
      }
      resolve(1);
    };
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file.slice(0, 65536));
  });
}

function detectVerticalSquash(img: HTMLImageElement): number {
  let data: Uint8ClampedArray;
  const ih = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = ih;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  try {
    data = ctx.getImageData(0, 0, 1, ih).data;
  } catch (err) {
    console.log("Cannot check verticalSquash: CORS?");
    return 1;
  }
  let sy = 0;
  let ey = ih;
  let py = ih;
  while (py > sy) {
    const alpha = data[(py - 1) * 4 + 3];
    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }
    py = (ey + sy) >> 1;
  }
  const ratio = py / ih;
  return ratio === 0 ? 1 : ratio;
}

function detectSubsampling(img: HTMLImageElement): boolean {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (iw * ih > 1024 * 1024) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, -iw + 1, 0);
    return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
  } else {
    return false;
  }
}

function transformCoordinate(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  orientation: number,
): void {
  switch (orientation) {
    case 5:
    case 6:
    case 7:
    case 8:
      canvas.width = height;
      canvas.height = width;
      break;
    default:
      canvas.width = width;
      canvas.height = height;
  }
  switch (orientation) {
    case 2:
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
    default:
      break;
  }
}

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return blob;
}

function handleFile(
  file: File,
  options: { maxWidth: number; quality: number; enableCompress: boolean },
  doSquash: boolean,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const { maxWidth, quality, enableCompress } = options;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const image = new Image();

    getExifOrientation(file).then((orientation) => {
      try {
        image.src = URL.createObjectURL(file);
      } catch (e) {
        reject(Error(String(e)));
        return;
      }
      image.onload = () => {
        let w = image.naturalWidth;
        let h = image.naturalHeight;
        const subsampled = detectSubsampling(image);
        if (subsampled) {
          w /= 2;
          h /= 2;
        }
        const vertSquashRatio = doSquash ? detectVerticalSquash(image) : 1;
        const dw = enableCompress ? Math.min(Number(maxWidth), w) : w;
        const dh = (h * (dw / w)) / vertSquashRatio;
        detectImageAutoRotate().then((isImageAutoRotate) => {
          console.log("detectImageAutoRotate:", isImageAutoRotate);
          if (!isImageAutoRotate) {
            transformCoordinate(canvas, ctx, dw, dh, orientation);
          } else {
            canvas.width = dw;
            canvas.height = dh;
          }
          ctx.clearRect(0, 0, dw, dh);
          ctx.drawImage(image, 0, 0, dw, dh);
          URL.revokeObjectURL(image.src);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(
                  new File([blob], file.name, {
                    type: file.type,
                  }),
                );
              } else {
                reject(new Error("canvas.toBlob returned null"));
              }
            },
            file.type,
            quality,
          );
        });
      };
      image.onerror = (err) => reject(err);
    });
  });
}

let isImageAutoRotate: boolean | undefined;

function detectImageAutoRotate(): Promise<boolean> {
  const testAutoOrientationImageURL =
    "data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==";
  return new Promise((resolve) => {
    if (isImageAutoRotate === undefined) {
      const img = new Image();
      img.onload = () => {
        isImageAutoRotate = img.width === 1 && img.height === 2;
        resolve(isImageAutoRotate);
      };
      img.src = testAutoOrientationImageURL;
    } else {
      resolve(isImageAutoRotate);
    }
  });
}

export {
  getExifOrientation,
  detectVerticalSquash,
  detectSubsampling,
  transformCoordinate,
  dataURItoBlob,
  handleFile,
  detectImageAutoRotate,
};
