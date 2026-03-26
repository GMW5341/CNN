/**
 * Generate sample face-like images using Canvas API.
 * This avoids SVG rasterization issues and guarantees pixel data works with TensorFlow.js.
 */

const SIZE = 224;

function createCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function drawFace(
  ctx: CanvasRenderingContext2D,
  skinColor: string,
  blushColor: string,
  features: 'spots' | 'wrinkles',
) {
  // Background
  ctx.fillStyle = '#e8ddd0';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Face oval
  ctx.beginPath();
  ctx.ellipse(112, 120, 78, 92, 0, 0, Math.PI * 2);
  ctx.fillStyle = skinColor;
  ctx.fill();

  // Forehead highlight
  ctx.beginPath();
  ctx.ellipse(112, 72, 60, 35, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fill();

  // Eyes (white)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(84, 105, 14, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(140, 105, 14, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#3a2818';
  ctx.beginPath();
  ctx.arc(84, 105, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(140, 105, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(86, 103, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(142, 103, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = '#5a3a1e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(62, 88);
  ctx.quadraticCurveTo(84, 78, 102, 86);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(122, 86);
  ctx.quadraticCurveTo(140, 78, 162, 88);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = 'rgba(160,120,80,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(108, 108);
  ctx.quadraticCurveTo(112, 130, 116, 108);
  ctx.stroke();

  // Mouth
  ctx.beginPath();
  ctx.moveTo(94, 150);
  ctx.quadraticCurveTo(112, 162, 130, 150);
  ctx.strokeStyle = '#c07070';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#d08080';
  ctx.fill();

  // Cheek blush
  const blushGrad1 = ctx.createRadialGradient(66, 128, 0, 66, 128, 20);
  blushGrad1.addColorStop(0, blushColor);
  blushGrad1.addColorStop(1, 'rgba(220,120,120,0)');
  ctx.fillStyle = blushGrad1;
  ctx.fillRect(46, 108, 40, 40);

  const blushGrad2 = ctx.createRadialGradient(158, 128, 0, 158, 128, 20);
  blushGrad2.addColorStop(0, blushColor);
  blushGrad2.addColorStop(1, 'rgba(220,120,120,0)');
  ctx.fillStyle = blushGrad2;
  ctx.fillRect(138, 108, 40, 40);

  // Skin features
  if (features === 'spots') {
    // Pigmentation spots
    const spots = [
      [75, 85, 3.5], [140, 78, 2.5], [95, 140, 3], [135, 145, 2.5],
      [68, 70, 2], [155, 85, 2], [100, 75, 1.8], [80, 135, 2.2],
    ];
    for (const [x, y, r] of spots) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160,110,70,${0.3 + Math.random() * 0.3})`;
      ctx.fill();
    }
  } else {
    // Wrinkle lines
    ctx.strokeStyle = 'rgba(160,120,80,0.3)';
    ctx.lineWidth = 0.8;
    // Forehead lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const y = 52 + i * 7;
      ctx.moveTo(78 + i * 3, y);
      ctx.quadraticCurveTo(112, y - 4, 146 - i * 3, y);
      ctx.stroke();
    }
    // Crow's feet
    for (let side = -1; side <= 1; side += 2) {
      const cx = side === -1 ? 55 : 169;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cx, 95 + i * 5);
        ctx.lineTo(cx + side * -12, 93 + i * 5);
        ctx.stroke();
      }
    }
    // Dark circles
    ctx.fillStyle = 'rgba(140,110,100,0.2)';
    ctx.beginPath();
    ctx.ellipse(84, 113, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(140, 113, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function generateSampleImage1(): HTMLCanvasElement {
  const [canvas, ctx] = createCanvas();
  drawFace(ctx, '#f0c896', 'rgba(220,120,120,0.25)', 'spots');
  return canvas;
}

export function generateSampleImage2(): HTMLCanvasElement {
  const [canvas, ctx] = createCanvas();
  drawFace(ctx, '#ffe0c0', 'rgba(200,100,100,0.2)', 'wrinkles');
  return canvas;
}
