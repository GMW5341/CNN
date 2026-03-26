import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useAppStore } from '../../../store/useAppStore';
import { diagnosticLabels } from '../../../model/diagnosticLabels';
import { scoreToColor } from '../../../utils/colorUtils';
import StepExplanation from '../../shared/StepExplanation';

const SVG_WIDTH = 900;
const SVG_HEIGHT = 700;
const LEFT_X = 80;
const RIGHT_X = SVG_WIDTH - 200;
const TOP_NODES = 30; // Show top 30 of 512 input nodes
const TOP_EDGES = 8; // Top 8 edges per output

export default function Step6DenseLayer() {
  const { scores, denseWeights, gapValues } = useAppStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredOutput, setHoveredOutput] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter labels by search
  const filteredLabels = useMemo(() => {
    if (!searchTerm) return diagnosticLabels;
    const term = searchTerm.toLowerCase();
    return diagnosticLabels.filter(
      l => l.nameKo.includes(term) || l.nameEn.toLowerCase().includes(term) || l.key.includes(term)
    );
  }, [searchTerm]);

  // Get top contributing input nodes for hovered output
  const topInputNodes = useMemo(() => {
    if (hoveredOutput === null || !denseWeights) return [];
    const { weights } = denseWeights;
    const contributions = weights.map((row, i) => ({
      inputIdx: i,
      weight: row[hoveredOutput],
      absWeight: Math.abs(row[hoveredOutput]),
      value: gapValues[i] ?? 0,
    }));
    contributions.sort((a, b) => b.absWeight - a.absWeight);
    return contributions.slice(0, TOP_EDGES);
  }, [hoveredOutput, denseWeights, gapValues]);

  // D3 rendering
  useEffect(() => {
    if (!svgRef.current || scores.length === 0 || !denseWeights) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const numOutputs = scores.length;

    // Determine which input nodes to show (top contributing overall)
    const inputImportance = new Float32Array(gapValues.length);
    for (let i = 0; i < gapValues.length; i++) {
      for (let j = 0; j < numOutputs; j++) {
        inputImportance[i] += Math.abs(denseWeights.weights[i][j]);
      }
    }
    const sortedInputs = Array.from(inputImportance)
      .map((v, i) => ({ idx: i, importance: v }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, TOP_NODES);

    // Layout
    const inputSpacing = (SVG_HEIGHT - 60) / TOP_NODES;
    const outputSpacing = (SVG_HEIGHT - 60) / numOutputs;

    // Draw edges (dimmed by default)
    const edgesGroup = svg.append('g').attr('class', 'edges');

    // Draw input nodes
    const inputNodes = svg.append('g').attr('class', 'input-nodes');
    sortedInputs.forEach((node, i) => {
      const y = 30 + i * inputSpacing;
      const val = gapValues[node.idx];
      const maxVal = Math.max(...gapValues);
      const r = 3 + (val / maxVal) * 5;

      inputNodes.append('circle')
        .attr('cx', LEFT_X)
        .attr('cy', y)
        .attr('r', r)
        .attr('fill', '#6366f1')
        .attr('opacity', 0.6)
        .attr('data-input-idx', node.idx);

      inputNodes.append('text')
        .attr('x', LEFT_X - 15)
        .attr('y', y + 3)
        .attr('text-anchor', 'end')
        .attr('fill', '#64748b')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .text(`#${node.idx}`);
    });

    // Draw output nodes
    const outputNodes = svg.append('g').attr('class', 'output-nodes');
    diagnosticLabels.forEach((label, i) => {
      const y = 30 + i * outputSpacing;
      const score = scores[i];
      const r = 4 + (score / 100) * 6;

      outputNodes.append('circle')
        .attr('cx', RIGHT_X)
        .attr('cy', y)
        .attr('r', r)
        .attr('fill', scoreToColor(score))
        .attr('stroke', hoveredOutput === i ? '#fff' : 'none')
        .attr('stroke-width', 2)
        .attr('cursor', 'pointer')
        .attr('data-output-idx', i)
        .on('mouseenter', () => setHoveredOutput(i))
        .on('mouseleave', () => setHoveredOutput(null));

      outputNodes.append('text')
        .attr('x', RIGHT_X + 15)
        .attr('y', y + 3)
        .attr('text-anchor', 'start')
        .attr('fill', hoveredOutput === i ? '#fff' : '#94a3b8')
        .attr('font-size', '8px')
        .text(`${label.nameKo} ${score}점`);
    });

    // Draw edges for hovered output
    if (hoveredOutput !== null) {
      const outputY = 30 + hoveredOutput * outputSpacing;

      topInputNodes.forEach(({ inputIdx, weight }) => {
        const inputNodeRank = sortedInputs.findIndex(n => n.idx === inputIdx);
        if (inputNodeRank === -1) return;

        const inputY = 30 + inputNodeRank * inputSpacing;
        const isPositive = weight > 0;

        edgesGroup.append('line')
          .attr('x1', LEFT_X)
          .attr('y1', inputY)
          .attr('x2', RIGHT_X)
          .attr('y2', outputY)
          .attr('stroke', isPositive ? '#6366f1' : '#ef4444')
          .attr('stroke-width', Math.min(Math.abs(weight) * 20, 4))
          .attr('opacity', 0.7);

        // Highlight the input node
        inputNodes.select(`circle[data-input-idx="${inputIdx}"]`)
          .attr('fill', isPositive ? '#6366f1' : '#ef4444')
          .attr('opacity', 1)
          .attr('r', 7);
      });
    }

    // Labels
    svg.append('text').attr('x', LEFT_X).attr('y', 16).attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8').attr('font-size', '11px').attr('font-weight', 'bold')
      .text('512개 특징 (상위 30개)');

    svg.append('text').attr('x', RIGHT_X).attr('y', 16).attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8').attr('font-size', '11px').attr('font-weight', 'bold')
      .text('65종 진단 점수');

  }, [scores, denseWeights, gapValues, hoveredOutput, topInputNodes]);

  if (scores.length === 0 || !denseWeights) {
    return (
      <div className="flex flex-col gap-6">
        <StepExplanation stepId={6} />
        <p className="text-[#94a3b8] text-center py-10">먼저 이미지를 업로드해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StepExplanation stepId={6} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Network graph */}
        <div className="flex-1 overflow-x-auto">
          <svg
            ref={svgRef}
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            className="bg-[#0f172a] rounded-xl border border-[#334155]"
          />
          {hoveredOutput !== null && (
            <div className="mt-2 text-sm text-[#94a3b8]">
              <span className="text-white font-bold">{diagnosticLabels[hoveredOutput].nameKo}</span>
              : 상위 {TOP_EDGES}개 연결 표시 중 |
              <span className="text-[#6366f1]"> 파랑 = 양의 가중치</span>,
              <span className="text-[#ef4444]"> 빨강 = 음의 가중치</span>
            </div>
          )}
        </div>

        {/* Score panel */}
        <div className="lg:w-[320px] flex flex-col gap-4">
          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
            <h3 className="text-sm font-bold text-white mb-3">진단 점수 (0~100)</h3>
            <input
              type="text"
              placeholder="검색 (예: 색소침착, wrinkle)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full mb-3 px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#6366f1]"
            />
            <div className="max-h-[500px] overflow-y-auto space-y-1.5">
              {filteredLabels.map((label) => {
                const idx = diagnosticLabels.indexOf(label);
                const score = scores[idx];
                return (
                  <div
                    key={label.key}
                    className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                      hoveredOutput === idx ? 'bg-[#334155]' : 'hover:bg-[#334155]/50'
                    }`}
                    onMouseEnter={() => setHoveredOutput(idx)}
                    onMouseLeave={() => setHoveredOutput(null)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white truncate">{label.nameKo}</div>
                      <div className="h-1.5 bg-[#0f172a] rounded-full mt-1">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${score}%`,
                            backgroundColor: scoreToColor(score),
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold shrink-0" style={{ color: scoreToColor(score) }}>
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {hoveredOutput !== null && (
            <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
              <h3 className="text-sm font-bold text-white mb-2">
                {diagnosticLabels[hoveredOutput].nameKo}
              </h3>
              <p className="text-xs text-[#94a3b8] mb-2">가장 영향력 높은 입력 노드:</p>
              <div className="space-y-1">
                {topInputNodes.map(({ inputIdx, weight, value }) => (
                  <div key={inputIdx} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-[#64748b]">#{inputIdx}</span>
                    <div className="flex-1 h-1 bg-[#0f172a] rounded">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${Math.min(Math.abs(weight) * 100, 100)}%`,
                          backgroundColor: weight > 0 ? '#6366f1' : '#ef4444',
                        }}
                      />
                    </div>
                    <span className="font-mono text-white">{weight.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
