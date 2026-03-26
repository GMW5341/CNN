import * as tf from '@tensorflow/tfjs';

const IMAGE_SIZE = 224;

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('이미지를 디코딩할 수 없습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsDataURL(file);
  });
}

export function cropAndResizeFromImage(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  const ctx = canvas.getContext('2d')!;

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  if (imgW === 0 || imgH === 0) {
    throw new Error('이미지 크기가 0입니다. 유효한 이미지를 업로드해주세요.');
  }

  // Fill white background first (in case of transparency)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);

  // Center crop to square
  const size = Math.min(imgW, imgH);
  const sx = (imgW - size) / 2;
  const sy = (imgH - size) / 2;
  ctx.drawImage(img, sx, sy, size, size, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

  return ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
}

export function cropAndResizeFromCanvas(sourceCanvas: HTMLCanvasElement): ImageData {
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
