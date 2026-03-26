import { useRef, useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import StepExplanation from '../../shared/StepExplanation';
import { activationToGrayscale } from '../../../utils/colorUtils';

const DISPLAY_SIZE = 224;

export default function Step2Convolution() {
  const { imageData, activations, model, selectedFilterIndex, setSelectedFilterIndex, animationSpeed } = useAppStore();
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const [filterPos, setFilterPos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(animationSpeed);
  const [filterWeights, setFilterWeights] = useState<number[][]>([]);

  // Get conv1 activation data
  const conv1Data = activations['conv1'];

  // Extract filter weights from model
  useEffect(() => {
    if (!model) return;
    const conv1Layer = model.getLayer('conv1');
    const [weights] = conv1Layer.getWeights();
    const data = weights.arraySync() as number[][][][]; // [3, 3, 3, 32]
    // Extract the selected filter's weights (average across input channels for display)
    const filterW: number[][] = [];
    for (let ky = 0; ky < 3; ky++) {
      const row: number[] = [];
      for (let kx = 0; kx < 3; kx++) {
        let sum = 0;
        for (let c = 0; c < 3; c++) {
          sum += data[ky][kx][c][selectedFilterIndex];
        }
        row.push(Math.round(sum * 1000) / 1000);
      }
      filterW.push(row);
    }
    setFilterWeights(filterW);
  }, [model, selectedFilterIndex]);

  // Draw input image with filter overlay
  useEffect(() => {
    const canvas = inputCanvasRef.current;
    if (!canvas || !imageData) return;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(imageData, 0, 0);

    // Draw filter box
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(filterPos.x - 1, filterPos.y - 1, 5, 5);
  }, [imageData, filterPos]);

  // Draw output feature map
  useEffect(() => {
    const canvas = outputCanvasRef.current;
    if (!canvas || !conv1Data) return;
    const ctx = canvas.getContext('2d')!;

    const [, h, w, channels] = conv1Data.shape;
    const imgData = ctx.createImageData(w, h);

    let min = Infinity, max = -Infinity;
    for (let i = 0; i < h * w; i++) {
      const idx = i * channels + selectedFilterIndex;
      const val = conv1Data.data[idx];
      if (val < min) min = val;
      if (val > max) max = val;
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const srcIdx = (y * w + x) * channels + selectedFilterIndex;
        const val = conv1Data.data[srcIdx];
        const gray = activationToGrayscale(val, min, max);
        const dstIdx = (y * w + x) * 4;
        imgData.data[dstIdx] = gray;
        imgData.data[dstIdx + 1] = gray;
        imgData.data[dstIdx + 2] = gray;
        imgData.data[dstIdx + 3] = 255;

        // Highlight current filter position
        if (x >= filterPos.x && x < filterPos.x + 3 && y >= filterPos.y && y < filterPos.y + 3) {
          imgData.data[dstIdx] = 245;
          imgData.data[dstIdx + 1] = 158;
          imgData.data[dstIdx + 2] = 11;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [conv1Data, filterPos, selectedFilterIndex]);

  // Animation loop
  const animate = useCallback(() => {
    setFilterPos(prev => {
      let { x, y } = prev;
      x += 1;
      if (x >= DISPLAY_SIZE - 2) {
        x = 0;
        y += 1;
        if (y >= DISPLAY_SIZE - 2) {
          y = 0;
          setIsPlaying(false);
        }
      }
      return { x, y };
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = 0;
    const interval = 1000 / (10 * speed); // positions per second

    const step = (time: number) => {
      if (time - lastTime >= interval) {
        animate();
        lastTime = time;
      }
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, speed, animate]);

  if (!imageData || !conv1Data) {
    return (
      <div className="flex flex-col gap-6">
        <StepExplanation stepId={2} />
        <p className="text-[#94a3b8] text-center py-10">먼저 이미지를 업로드해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StepExplanation stepId={2} />

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-sm font-medium"
        >
          {isPlaying ? '⏸ 일시정지' : '▶ 재생'}
        </button>
        <button
          onClick={() => { setFilterPos({ x: 0, y: 0 }); setIsPlaying(false); }}
          className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg text-sm"
        >
          초기화
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#94a3b8]">속도:</span>
          <input
            type="range" min="0.5" max="5" step="0.5" value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="w-24 accent-[#6366f1]"
          />
          <span className="text-sm text-white font-mono">{speed}x</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#94a3b8]">필터:</span>
          <select
            value={selectedFilterIndex}
            onChange={e => setSelectedFilterIndex(parseInt(e.target.value))}
            className="bg-[#334155] text-white rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 32 }).map((_, i) => (
              <option key={i} value={i}>필터 #{i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input image with filter overlay */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-bold text-white">입력 이미지</h3>
          <canvas
            ref={inputCanvasRef}
            width={DISPLAY_SIZE}
            height={DISPLAY_SIZE}
            className="w-[400px] h-[400px] rounded-lg border-2 border-[#334155]"
          />
          <span className="text-xs text-[#64748b]">
            필터 위치: ({filterPos.x}, {filterPos.y})
          </span>
        </div>

        {/* Output feature map */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-bold text-white">특징 지도 (Feature Map)</h3>
          <canvas
            ref={outputCanvasRef}
            width={DISPLAY_SIZE}
            height={DISPLAY_SIZE}
            className="w-[400px] h-[400px] rounded-lg border-2 border-[#334155]"
          />
          <span className="text-xs text-[#64748b]">
            필터 #{selectedFilterIndex + 1}의 출력
          </span>
        </div>

        {/* Filter weights display */}
        <div className="lg:w-[240px] flex flex-col gap-4">
          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
            <h3 className="text-sm font-bold text-white mb-3">3x3 필터 가중치</h3>
            {filterWeights.length > 0 && (
              <div className="inline-grid grid-cols-3 gap-1">
                {filterWeights.flatMap((row, ky) =>
                  row.map((val, kx) => (
                    <div
                      key={`${ky}-${kx}`}
                      className="w-16 h-10 flex items-center justify-center rounded text-xs font-mono"
                      style={{
                        backgroundColor: val > 0 ? `rgba(99,102,241,${Math.min(Math.abs(val) * 2, 1)})` : `rgba(239,68,68,${Math.min(Math.abs(val) * 2, 1)})`,
                        color: '#fff',
                      }}
                    >
                      {val.toFixed(3)}
                    </div>
                  ))
                )}
              </div>
            )}
            <p className="text-xs text-[#64748b] mt-2">
              양수(파랑) = 해당 패턴에 반응<br />
              음수(빨강) = 반대 패턴에 반응
            </p>
          </div>

          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
            <h3 className="text-sm font-bold text-white mb-2">합성곱 연산</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              3x3 필터가 이미지의 각 위치에서 겹치는 9개 픽셀 값과 곱한 뒤 모두 더합니다.
              이 연산이 224x224번 반복되어 하나의 특징 지도가 만들어집니다.
              총 32개의 필터가 각각 다른 패턴을 찾아 32장의 특징 지도를 생성합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
