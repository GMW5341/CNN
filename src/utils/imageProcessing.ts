import * as tf from '@tensorflow/tfjs';

const IMAGE_SIZE = 224;

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function cropAndResize(img: HTMLImageElement): { canvas: HTMLCanvasElement; imageData: ImageData } {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // Center crop to square
  const size = Math.min(img.width, img.height);
  const sx = (img.width - size) / 2;
  const sy = (img.height - size) / 2;

  ctx.drawImage(img, sx, sy, size, size, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
  const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);

  return { canvas, imageData };
}

export function imageDataToTensor(imageData: ImageData): tf.Tensor4D {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(imageData);
    const normalized = tensor.toFloat().div(255.0);
    return normalized.expandDims(0) as tf.Tensor4D;
  });
}

export function getPixelRGB(imageData: ImageData, x: number, y: number): [number, number, number] {
  const idx = (y * imageData.width + x) * 4;
  return [imageData.data[idx], imageData.data[idx + 1], imageData.data[idx + 2]];
}

export const IMAGE_SIZE_CONST = IMAGE_SIZE;
