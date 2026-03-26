import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import StepExplanation from '../../shared/StepExplanation';
import { activationToGrayscale } from '../../../utils/colorUtils';
import { CONV_LAYER_NAMES } from '../../../model/buildDemoModel';

const LAYER_INFO: Record<string, { label: string; description: string }> = {
  conv1: { label: 'Layer 1 (초기)', description: '32개 필터 | 224x224 | 가장자리, 윤곽선, 색상 변화를 감지합니다.' },
  conv3: { label: 'Layer 3 (중간)', description: '128개 필터 | 56x56 | 질감, 패턴의 조합을 인식합니다.' },
  conv5: { label: 'Layer 5 (심층)', description: '512개 필터 | 14x14 | 고수준 피부 특징(기미 질감, 주름 패턴)을 추상화합니다.' },
};

const THUMB_SIZE = 56;
const MAX_DISPLAY = 64; // Show max 64 thumbnails at once

export default function Step4FeatureMaps() {
  const { activations } = useAppStore();
  const [selectedLayer, setSelectedLayer] = useState('conv1');
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);

  const layerData = activations[selectedLayer];

  const renderThumbnail = useCallback((canvas: HTMLCanvasElement, channelIdx: number) => {
    if (!layerData) return;
    const [, h, w, channels] = layerData.shape;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(w, h);

    // Find min/max for this channel
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < h * w; i++) {
      const val = layerData.data[i * channels + channelIdx];
      if (val < min) min = val;
      if (val > max) max = val;
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const srcIdx = (y * w + x) * channels + channelIdx;
        const val = layerData.data[srcIdx];
        const gray = activationToGrayscale(val, min, max);
        const dstIdx = (y * w + x) * 4;
        imgData.data[dstIdx] = gray;
        imgData.data[dstIdx + 1] = gray;
        imgData.data[dstIdx + 2] = gray;
        imgData.data[dstIdx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [layerData]);

  useEffect(() => {
    if (!layerData) return;
    const [, , , channels] = layerData.shape;
    const count = Math.min(channels, MAX_DISPLAY);
    canvasRefs.current.forEach((canvas, idx) => {
      if (idx < count) renderThumbnail(canvas, idx);
    });
  }, [layerData, renderThumbnail]);

  // Render modal enlarged view
  useEffect(() => {
    if (selectedChannel === null || !modalCanvasRef.current || !layerData) return;
    renderThumbnail(modalCanvasRef.current, selectedChannel);
  }, [selectedChannel, layerData, renderThumbnail]);

  if (!layerData) {
    return (
      <div className="flex flex-col gap-6">
        <StepExplanation stepId={4} />
        <p className="text-[#94a3b8] text-center py-10">먼저 이미지를 업로드해주세요.</p>
      </div>
    );
  }

  const [, h, w, channels] = layerData.shape;
  const displayCount = Math.min(channels, MAX_DISPLAY);
  const info = LAYER_INFO[selectedLayer];

  return (
    <div className="flex flex-col gap-6">
      <StepExplanation stepId={4} />

      {/* Layer tabs */}
      <div className="flex items-center gap-3">
        {CONV_LAYER_NAMES.map(name => (
          <button
            key={name}
            onClick={() => { setSelectedLayer(name); setSelectedChannel(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedLayer === name
                ? 'bg-[#6366f1] text-white'
                : 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569]'
            }`}
          >
            {LAYER_INFO[name].label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Thumbnail gallery */}
        <div className="flex-1">
          <p className="text-sm text-[#94a3b8] mb-3">
            {info.description} (처음 {displayCount}개 표시 / 전체 {channels}개)
          </p>
          <div className="grid gap-2" style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${THUMB_SIZE + 16}px, 1fr))`,
          }}>
            {Array.from({ length: displayCount }).map((_, i) => (
              <div
                key={`${selectedLayer}-${i}`}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedChannel === i ? 'border-[#f59e0b] shadow-lg shadow-[#f59e0b]/20' : 'border-[#334155] hover:border-[#6366f1]'
                }`}
                onClick={() => setSelectedChannel(i)}
              >
                <canvas
                  ref={el => { if (el) canvasRefs.current.set(i, el); }}
                  width={w}
                  height={h}
                  className="w-full aspect-square bg-[#0f172a]"
                />
                <div className="bg-[#1e293b] px-1 py-0.5 text-center">
                  <span className="text-[10px] text-[#64748b]">#{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:w-[300px] flex flex-col gap-4">
          {selectedChannel !== null ? (
            <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
              <h3 className="text-sm font-bold text-white mb-3">
                채널 #{selectedChannel + 1} 상세보기
              </h3>
              <canvas
                ref={modalCanvasRef}
                width={w}
                height={h}
                className="w-full aspect-square rounded-lg border border-[#334155] bg-[#0f172a]"
              />
              <div className="mt-2 text-xs text-[#94a3b8]">
                <p>크기: {w}x{h}</p>
                <p>레이어: {selectedLayer}</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
              <p className="text-sm text-[#64748b]">썸네일을 클릭하면 상세 보기가 표시됩니다.</p>
            </div>
          )}

          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
            <h3 className="text-sm font-bold text-white mb-2">층별 변화</h3>
            <div className="space-y-2 text-xs text-[#94a3b8]">
              <div className="flex items-start gap-2">
                <span className="text-[#6366f1] font-bold shrink-0">Layer 1:</span>
                <span>원본의 윤곽선과 색상 변화가 뚜렷하게 보입니다.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#6366f1] font-bold shrink-0">Layer 3:</span>
                <span>질감과 패턴의 조합이 나타나기 시작합니다.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#6366f1] font-bold shrink-0">Layer 5:</span>
                <span>사람 눈에는 알아볼 수 없지만, 컴퓨터는 '기미의 질감' 자체를 인식하고 있습니다.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
