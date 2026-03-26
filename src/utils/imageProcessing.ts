import * as tf from '@tensorflow/tfjs';

const IMAGE_SIZE = 224;

/**
 * Read a user-uploaded file and return 224x224 ImageData.
 * Uses createImageBitmap (fast, widely supported) with Image fallback.
 */
export async function fileToImageData(file: File): Promise<ImageData> {
  // Approach 1: createImageBitmap (most reliable, no Image element needed)
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      const imageData = bitmapToImageData(bitmap);
      bitmap.close();
      return imageData;
    } catch {
      // Fall through to approach 2
    }
  }

  // Approach 2: FileReader → Image → Canvas
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  return imgToImageData(img);
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('이미지 형식을 지원하지 않습니다. JPG, PNG, WebP 파일을 사용해주세요.'));
    img.src = src;
  });
}

function bitmapToImageData(bitmap: ImageBitmap): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);

  const size = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - size) / 2;
  const sy = (bitmap.height - size) / 2;
  ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

  return ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
}

function imgToImageData(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const size = Math.min(imgW, imgH);
  const sx = (imgW - size) / 2;
  const sy = (imgH - size) / 2;
  ctx.drawImage(img, sx, sy, size, size, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

  return ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
}

/**
 * Convert a Canvas element (from sample image generator) to 224x224 ImageData.
 */
export function canvasToImageData(sourceCanvas: HTMLCanvasElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(sourceCanvas, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
  return ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
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
