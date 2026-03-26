export function activationToGrayscale(value: number, min: number, max: number): number {
  if (max === min) return 128;
  return Math.round(((value - min) / (max - min)) * 255);
}

export function activationToHeatmap(value: number, min: number, max: number): [number, number, number] {
  if (max === min) return [128, 128, 128];
  const t = (value - min) / (max - min);

  // Blue -> Cyan -> Green -> Yellow -> Red
  let r: number, g: number, b: number;
  if (t < 0.25) {
    const s = t / 0.25;
    r = 0; g = Math.round(255 * s); b = 255;
  } else if (t < 0.5) {
    const s = (t - 0.25) / 0.25;
    r = 0; g = 255; b = Math.round(255 * (1 - s));
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25;
    r = Math.round(255 * s); g = 255; b = 0;
  } else {
    const s = (t - 0.75) / 0.25;
    r = 255; g = Math.round(255 * (1 - s)); b = 0;
  }
  return [r, g, b];
}

export function scoreToColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#84cc16';
  if (score >= 40) return '#f59e0b';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}
