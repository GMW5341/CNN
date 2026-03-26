import { useRef, useState, useCallback, useEffect } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { getPixelRGB, IMAGE_SIZE_CONST } from '../../../utils/imageProcessing';
import StepExplanation from '../../shared/StepExplanation';

const MAGNIFIER_SIZE = 7; // 7x7 pixel grid in magnifier
const CELL_SIZE = 36;

export default function Step1ImageInput() {
  const { imageData } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [pixelInfo, setPixelInfo] = useState<{ x: number; y: number; r: number; g: number; b: number } | null>(null);

  // Render imageData directly to canvas (no HTMLImageElement needed)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(imageData, 0, 0);
  }, [imageData]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageData) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = IMAGE_SIZE_CONST / rect.width;
    const scaleY = IMAGE_SIZE_CONST / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x >= 0 && x < IMAGE_SIZE_CONST && y >= 0 && y < IMAGE_SIZE_CONST) {
      setHoverPos({ x, y });
      const [r, g, b] = getPixelRGB(imageData, x, y);
      setPixelInfo({ x, y, r, g, b });
    }
  }, [imageData]);

  const handleMouseLeave = useCallback(() => {
    setHoverPos(null);
    setPixelInfo(null);
  }, []);

  if (!imageData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <StepExplanation stepId={1} />
        <div className="text-center">
          <p className="text-[#94a3b8] text-lg">상단에서 이미지를 업로드하거나 샘플을 선택해주세요.</p>
          <p className="text-[#64748b] text-sm mt-2">224x224 픽셀로 자동 크롭됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StepExplanation stepId={1} />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas area */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative inline-block">
            <canvas
              ref={canvasRef}
              width={IMAGE_SIZE_CONST}
              height={IMAGE_SIZE_CONST}
              className="w-[448px] h-[448px] rounded-lg border-2 border-[#334155] cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            <p className="text-center text-[#64748b] text-xs mt-2">
              {IMAGE_SIZE_CONST}x{IMAGE_SIZE_CONST}x3 (RGB)
            </p>
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-[340px] flex flex-col gap-4">
          {/* Magnifier */}
          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
            <h3 className="text-sm font-bold text-white mb-3">X-Ray 픽셀 뷰어</h3>
            {hoverPos && imageData ? (
              <>
                <div className="inline-grid gap-[1px] bg-[#0f172a] p-1 rounded"
                  style={{
                    gridTemplateColumns: `repeat(${MAGNIFIER_SIZE}, ${CELL_SIZE}px)`,
                  }}
                >
                  {Array.from({ length: MAGNIFIER_SIZE * MAGNIFIER_SIZE }).map((_, idx) => {
                    const dx = (idx % MAGNIFIER_SIZE) - Math.floor(MAGNIFIER_SIZE / 2);
                    const dy = Math.floor(idx / MAGNIFIER_SIZE) - Math.floor(MAGNIFIER_SIZE / 2);
                    const px = hoverPos.x + dx;
                    const py = hoverPos.y + dy;
                    const isCenter = dx === 0 && dy === 0;

                    if (px < 0 || py < 0 || px >= IMAGE_SIZE_CONST || py >= IMAGE_SIZE_CONST) {
                      return <div key={idx} className="bg-[#0f172a]" style={{ width: CELL_SIZE, height: CELL_SIZE }} />;
                    }

                    const [r, g, b] = getPixelRGB(imageData, px, py);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-center text-[8px] font-mono leading-none ${
                          isCenter ? 'ring-2 ring-[#f59e0b]' : ''
                        }`}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          backgroundColor: `rgb(${r},${g},${b})`,
                          color: (r + g + b) / 3 > 128 ? '#000' : '#fff',
                        }}
                      >
                        <div className="text-center">
                          <div>{r}</div>
                          <div>{g}</div>
                          <div>{b}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-[#94a3b8]">
                  중앙 픽셀이 현재 마우스 위치입니다
                </div>
              </>
            ) : (
              <p className="text-[#64748b] text-sm">마우스를 이미지 위에 올려보세요</p>
            )}
          </div>

          {/* Pixel info */}
          {pixelInfo && (
            <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
              <h3 className="text-sm font-bold text-white mb-2">현재 픽셀 정보</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-[#94a3b8]">위치 (x, y)</div>
                <div className="font-mono text-white">({pixelInfo.x}, {pixelInfo.y})</div>
                <div className="text-[#94a3b8]">R (빨강)</div>
                <div className="font-mono text-red-400">{pixelInfo.r}</div>
                <div className="text-[#94a3b8]">G (초록)</div>
                <div className="font-mono text-green-400">{pixelInfo.g}</div>
                <div className="text-[#94a3b8]">B (파랑)</div>
                <div className="font-mono text-blue-400">{pixelInfo.b}</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-[#334155]"
                  style={{ backgroundColor: `rgb(${pixelInfo.r},${pixelInfo.g},${pixelInfo.b})` }}
                />
                <span className="text-xs font-mono text-[#94a3b8]">
                  rgb({pixelInfo.r}, {pixelInfo.g}, {pixelInfo.b})
                </span>
              </div>
            </div>
          )}

          {/* Privacy notice */}
          <div className="bg-[#022c22] rounded-xl p-3 border border-[#065f46] text-xs text-[#6ee7b7]">
            <span className="font-bold">Privacy</span>: 이미지는 브라우저 내에서만 처리되며 서버로 전송되지 않습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
