import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import StepExplanation from '../../shared/StepExplanation';
import { activationToGrayscale } from '../../../utils/colorUtils';

const BAR_HEIGHT = 4;
const MAX_BARS = 512;

export default function Step5GlobalAvgPooling() {
  const { activations, gapValues } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedMapIdx, setSelectedMapIdx] = useState(0);

  const conv5 = activations['conv5'];
  const featureMapCanvasRef = useRef<HTMLCanvasElement>(null);

  // Render the selected feature map
  useEffect(() => {
    if (!conv5 || !featureMapCanvasRef.current) return;
    const [, h, w, channels] = conv5.shape;
    const ctx = featureMapCanvasRef.current.getContext('2d')!;
    const imgData = ctx.createImageData(w, h);

    let min = Infinity, max = -Infinity;
    for (let i = 0; i < h * w; i++) {
      const val = conv5.data[i * channels + selectedMapIdx];
      if (val < min) min = val;
      if (val > max) max = val;
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const srcIdx = (y * w + x) * channels + selectedMapIdx;
        const val = conv5.data[srcIdx];
        const gray = activationToGrayscale(val, min, max);
        const dstIdx = (y * w + x) * 4;
        imgData.data[dstIdx] = gray;
        imgData.data[dstIdx + 1] = gray;
        imgData.data[dstIdx + 2] = gray;
        imgData.data[dstIdx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [conv5, selectedMapIdx]);

  // Render bar chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gapValues.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const maxVal = Math.max(...gapValues);
    const barWidth = width / Math.min(gapValues.length, MAX_BARS);

    for (let i = 0; i < Math.min(gapValues.length, MAX_BARS); i++) {
      const val = gapValues[i];
      const barHeight = (val / maxVal) * (height - 20);
      const x = i * barWidth;
      const y = height - barHeight - 10;

      const hue = (val / maxVal) * 240; // Blue to Red
      ctx.fillStyle = i === hoveredIdx
        ? '#f59e0b'
        : `hsl(${240 - hue}, 70%, 60%)`;
      ctx.fillRect(x, y, Math.max(barWidth - 0.5, 0.5), barHeight);
    }
  }, [gapValues, hoveredIdx]);

  const handleBarHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const barWidth = canvas.width / Math.min(gapValues.length, MAX_BARS);
    const idx = Math.floor((x / rect.width) * canvas.width / barWidth);
    if (idx >= 0 && idx < gapValues.length) {
      setHoveredIdx(idx);
      setSelectedMapIdx(idx);
    }
  };

  if (gapValues.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <StepExplanation stepId={5} />
        <p className="text-[#94a3b8] text-center py-10">먼저 이미지를 업로드해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StepExplanation stepId={5} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Feature map → average animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
            <h3 className="text-sm font-bold text-white mb-3">
              특징 지도 #{selectedMapIdx + 1} → 평균값
            </h3>
            <div className="flex items-center gap-4">
              {conv5 && (
                <canvas
                  ref={featureMapCanvasRef}
                  width={conv5.shape[2]}
                  height={conv5.shape[1]}
                  className="w-[140px] h-[140px] rounded border border-[#334155] bg-[#0f172a]"
                />
              )}
              <div className="text-3xl text-[#6366f1]">→</div>
              <div className="w-[80px] h-[80px] bg-[#6366f1]/20 border-2 border-[#6366f1] rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold font-mono text-white">
                  {gapValues[selectedMapIdx]?.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#64748b] mt-2">
              7x7 = 49개 값의 평균 → 단 하나의 숫자로 압축
            </p>
          </div>

          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155] w-full">
            <h3 className="text-sm font-bold text-white mb-2">수치 요약</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-[#94a3b8]">입력 크기</span>
              <span className="text-white font-mono">7 x 7 x 512</span>
              <span className="text-[#94a3b8]">출력 크기</span>
              <span className="text-white font-mono">512</span>
              <span className="text-[#94a3b8]">압축 비율</span>
              <span className="text-[#22c55e] font-mono">49:1</span>
            </div>
          </div>
        </div>

        {/* 512-dim bar chart */}
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-sm font-bold text-white">512개의 핵심 숫자 (특징 벡터)</h3>
          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="w-full h-[200px] rounded-lg border border-[#334155] bg-[#0f172a] cursor-crosshair"
            onMouseMove={handleBarHover}
            onMouseLeave={() => setHoveredIdx(null)}
          />
          {hoveredIdx !== null && (
            <div className="text-xs text-[#94a3b8]">
              인덱스: <span className="text-white font-mono">#{hoveredIdx + 1}</span> |
              값: <span className="text-white font-mono">{gapValues[hoveredIdx]?.toFixed(4)}</span>
            </div>
          )}
          <p className="text-xs text-[#64748b]">
            각 막대는 하나의 특징 지도를 평균화한 값입니다. 마우스를 올리면 해당 특징 지도를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
