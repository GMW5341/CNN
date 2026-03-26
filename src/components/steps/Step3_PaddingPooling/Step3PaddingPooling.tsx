import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import StepExplanation from '../../shared/StepExplanation';

type ViewMode = 'padding' | 'pooling';

const GRID_SIZE = 8;
const CELL_SIZE = 48;

export default function Step3PaddingPooling() {
  const { activations } = useAppStore();
  const [viewMode, setViewMode] = useState<ViewMode>('padding');
  const [poolPos, setPoolPos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Get a small region from conv1 for demonstration
  const conv1 = activations['conv1'];
  const sampleGrid: number[][] = [];
  if (conv1) {
    const [, , w, channels] = conv1.shape;
    for (let y = 0; y < GRID_SIZE; y++) {
      const row: number[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        const idx = (y * w + x) * channels;
        row.push(Math.round(conv1.data[idx] * 10) / 10);
      }
      sampleGrid.push(row);
    }
  }

  // Padding view: add zeros around the grid
  const paddedGrid: number[][] = [];
  if (sampleGrid.length > 0) {
    const padded = GRID_SIZE + 2;
    for (let y = 0; y < padded; y++) {
      const row: number[] = [];
      for (let x = 0; x < padded; x++) {
        if (y === 0 || y === padded - 1 || x === 0 || x === padded - 1) {
          row.push(0);
        } else {
          row.push(sampleGrid[y - 1][x - 1]);
        }
      }
      paddedGrid.push(row);
    }
  }

  // Pooling animation
  const pooledGrid: number[][] = [];
  if (sampleGrid.length > 0) {
    for (let y = 0; y < GRID_SIZE; y += 2) {
      const row: number[] = [];
      for (let x = 0; x < GRID_SIZE; x += 2) {
        const vals = [
          sampleGrid[y][x],
          sampleGrid[y][x + 1],
          sampleGrid[y + 1]?.[x] ?? 0,
          sampleGrid[y + 1]?.[x + 1] ?? 0,
        ];
        row.push(Math.max(...vals));
      }
      pooledGrid.push(row);
    }
  }

  // Pooling animation loop
  const animatePool = useCallback(() => {
    setPoolPos(prev => {
      let { x, y } = prev;
      x += 2;
      if (x >= GRID_SIZE) {
        x = 0;
        y += 2;
        if (y >= GRID_SIZE) {
          y = 0;
          setIsAnimating(false);
        }
      }
      return { x, y };
    });
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(animatePool, 800);
    return () => clearInterval(interval);
  }, [isAnimating, animatePool]);

  if (!conv1) {
    return (
      <div className="flex flex-col gap-6">
        <StepExplanation stepId={3} />
        <p className="text-[#94a3b8] text-center py-10">먼저 이미지를 업로드해주세요.</p>
      </div>
    );
  }

  const getValueColor = (val: number) => {
    const intensity = Math.min(Math.abs(val) * 30, 255);
    return val === 0
      ? 'rgba(100,116,139,0.3)'
      : `rgba(99,102,241,${intensity / 255})`;
  };

  return (
    <div className="flex flex-col gap-6">
      <StepExplanation stepId={3} />

      {/* Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setViewMode('padding')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'padding'
              ? 'bg-[#6366f1] text-white'
              : 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569]'
          }`}
        >
          Padding 적용
        </button>
        <button
          onClick={() => setViewMode('pooling')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'pooling'
              ? 'bg-[#6366f1] text-white'
              : 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569]'
          }`}
        >
          Max Pooling 적용
        </button>
        {viewMode === 'pooling' && (
          <button
            onClick={() => { setPoolPos({ x: 0, y: 0 }); setIsAnimating(true); }}
            className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg text-sm font-medium"
          >
            ▶ 풀링 애니메이션
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {viewMode === 'padding' ? (
          <>
            {/* Original grid */}
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-sm font-bold text-white">원본 ({GRID_SIZE}x{GRID_SIZE})</h3>
              <div className="inline-grid gap-[1px] bg-[#0f172a] p-1 rounded"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}
              >
                {sampleGrid.flatMap((row, y) =>
                  row.map((val, x) => (
                    <div key={`${y}-${x}`}
                      className="flex items-center justify-center font-mono text-xs text-white"
                      style={{ width: CELL_SIZE, height: CELL_SIZE, backgroundColor: getValueColor(val) }}
                    >
                      {val.toFixed(1)}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center text-4xl text-[#6366f1]">→</div>

            {/* Padded grid */}
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-sm font-bold text-white">패딩 적용 ({GRID_SIZE + 2}x{GRID_SIZE + 2})</h3>
              <div className="inline-grid gap-[1px] bg-[#0f172a] p-1 rounded"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE + 2}, ${CELL_SIZE - 4}px)` }}
              >
                {paddedGrid.flatMap((row, y) =>
                  row.map((val, x) => {
                    const isPad = y === 0 || y === paddedGrid.length - 1 || x === 0 || x === row.length - 1;
                    return (
                      <div key={`p-${y}-${x}`}
                        className={`flex items-center justify-center font-mono text-xs ${
                          isPad ? 'text-[#f59e0b] border border-[#f59e0b]/30' : 'text-white'
                        }`}
                        style={{
                          width: CELL_SIZE - 4,
                          height: CELL_SIZE - 4,
                          backgroundColor: isPad ? 'rgba(245,158,11,0.1)' : getValueColor(val),
                        }}
                      >
                        {val.toFixed(1)}
                      </div>
                    );
                  })
                )}
              </div>
              <p className="text-xs text-[#f59e0b]">노란색 = 패딩(0)으로 채워진 영역</p>
            </div>
          </>
        ) : (
          <>
            {/* Original grid with pool overlay */}
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-sm font-bold text-white">원본 ({GRID_SIZE}x{GRID_SIZE})</h3>
              <div className="inline-grid gap-[1px] bg-[#0f172a] p-1 rounded"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}
              >
                {sampleGrid.flatMap((row, y) =>
                  row.map((val, x) => {
                    const inPool = x >= poolPos.x && x < poolPos.x + 2 &&
                                   y >= poolPos.y && y < poolPos.y + 2;
                    const isMax = inPool && val === Math.max(
                      sampleGrid[poolPos.y]?.[poolPos.x] ?? -Infinity,
                      sampleGrid[poolPos.y]?.[poolPos.x + 1] ?? -Infinity,
                      sampleGrid[poolPos.y + 1]?.[poolPos.x] ?? -Infinity,
                      sampleGrid[poolPos.y + 1]?.[poolPos.x + 1] ?? -Infinity,
                    );
                    return (
                      <div key={`${y}-${x}`}
                        className={`flex items-center justify-center font-mono text-xs ${
                          isMax ? 'ring-2 ring-[#22c55e] text-[#22c55e] font-bold' :
                          inPool ? 'ring-1 ring-[#ef4444]/50 text-white' : 'text-white'
                        }`}
                        style={{
                          width: CELL_SIZE, height: CELL_SIZE,
                          backgroundColor: inPool ? 'rgba(239,68,68,0.15)' : getValueColor(val),
                        }}
                      >
                        {val.toFixed(1)}
                      </div>
                    );
                  })
                )}
              </div>
              <p className="text-xs text-[#94a3b8]">빨간 영역 = 2x2 풀링 윈도우, 초록 = 최대값</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center text-4xl text-[#6366f1]">→</div>

            {/* Pooled grid */}
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-sm font-bold text-white">풀링 결과 ({GRID_SIZE / 2}x{GRID_SIZE / 2})</h3>
              <div className="inline-grid gap-[1px] bg-[#0f172a] p-1 rounded"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE / 2}, ${CELL_SIZE * 2}px)` }}
              >
                {pooledGrid.flatMap((row, y) =>
                  row.map((val, x) => (
                    <div key={`pool-${y}-${x}`}
                      className="flex items-center justify-center font-mono text-sm text-white font-bold"
                      style={{
                        width: CELL_SIZE * 2,
                        height: CELL_SIZE * 2,
                        backgroundColor: getValueColor(val),
                      }}
                    >
                      {val.toFixed(1)}
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-[#22c55e]">
                {GRID_SIZE}x{GRID_SIZE} → {GRID_SIZE / 2}x{GRID_SIZE / 2} (크기 50% 축소)
              </p>
            </div>
          </>
        )}

        {/* Description panel */}
        <div className="lg:w-[260px]">
          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
            <h3 className="text-sm font-bold text-white mb-2">
              {viewMode === 'padding' ? '패딩 (Padding)' : '맥스 풀링 (Max Pooling)'}
            </h3>
            {viewMode === 'padding' ? (
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                합성곱 연산 시 가장자리 픽셀은 필터의 중앙에 올 수 없어 정보가 손실됩니다.
                <br /><br />
                <strong className="text-white">Same Padding</strong>은 가장자리에 0을 채워
                출력 크기를 입력과 동일하게 유지합니다. 이렇게 하면 가장자리의
                피부 특징도 놓치지 않고 분석할 수 있습니다.
              </p>
            ) : (
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                2x2 영역에서 <strong className="text-[#22c55e]">가장 큰 값</strong>만 선택하여
                데이터 크기를 절반으로 줄입니다.
                <br /><br />
                이 과정에서 <strong className="text-white">위치 정보는 버려지고</strong> 핵심 특징만
                남습니다. 덕분에 피부 특징이 사진에서 약간 다른 위치에 있더라도
                동일하게 감지할 수 있습니다.
                <br /><br />
                224x224 → 112x112 → 56x56 → 28x28 → 14x14 → 7x7
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
