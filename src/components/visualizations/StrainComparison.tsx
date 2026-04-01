'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const DIMENSIONS = [
  { key: 'efficacy', label: '保护效力 Efficacy', max: 100 },
  { key: 'safety', label: '安全性 Safety', max: 100 },
  { key: 'divaCompat', label: 'DIVA兼容', max: 100 },
  { key: 'herdImmunity', label: '群免疫 Herd', max: 100 },
  { key: 'costScore', label: '成本优势 Cost', max: 100 },
  { key: 'pregnancySafety', label: '妊娠安全 Pregnancy', max: 100 },
];

interface StrainData {
  id: string;
  name: string;
  color: string;
  efficacy: number;
  safety: number;
  divaCompat: number;
  herdImmunity: number;
  costScore: number;
  pregnancySafety: number;
}

const STRAINS: StrainData[] = [
  { id: 's2', name: 'S2 (B.suis)', color: '#3b82f6', efficacy: 72, safety: 78, divaCompat: 30, herdImmunity: 82, costScore: 88, pregnancySafety: 62 },
  { id: 'a19', name: 'A19 (B.abortus)', color: '#f59e0b', efficacy: 57, safety: 72, divaCompat: 40, herdImmunity: 68, costScore: 80, pregnancySafety: 55 },
  { id: 'rev1', name: 'Rev.1 (B.mel.)', color: '#ef4444', efficacy: 65, safety: 60, divaCompat: 35, herdImmunity: 75, costScore: 76, pregnancySafety: 42 },
  { id: 'ba0711', name: 'BA0711 (新型)', color: '#22c55e', efficacy: 78, safety: 90, divaCompat: 90, herdImmunity: 82, costScore: 70, pregnancySafety: 85 },
];

export function StrainComparison() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const W = 480, H = 400;
    const cx = W / 2, cy = H / 2;
    const radius = 140;
    const numDim = DIMENSIONS.length;
    const angleSlice = (Math.PI * 2) / numDim;

    d3.select(svg).selectAll('*').remove();
    const g = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`).append('g');

    // Radial scale
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Grid circles
    [20, 40, 60, 80, 100].forEach((v) => {
      g.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', rScale(v))
        .attr('fill', 'none')
        .attr('stroke', '#374151').attr('stroke-width', 0.5).attr('stroke-dasharray', '3,2');
      g.append('text')
        .attr('x', cx + 3).attr('y', cy - rScale(v) + 4)
        .attr('font-size', 8).attr('fill', '#6b7280').text(v);
    });

    // Axis lines + labels
    DIMENSIONS.forEach((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      g.append('line')
        .attr('x1', cx).attr('y1', cy).attr('x2', x).attr('y2', y)
        .attr('stroke', '#374151').attr('stroke-width', 0.8);

      // Label
      const lx = cx + (radius + 22) * Math.cos(angle);
      const ly = cy + (radius + 22) * Math.sin(angle);
      const lines = dim.label.split(' ');
      lines.forEach((line, li) => {
        g.append('text')
          .attr('x', lx).attr('y', ly + li * 10 - (lines.length - 1) * 5)
          .attr('text-anchor', 'middle').attr('font-size', 8)
          .attr('fill', '#9ca3af').text(line);
      });
    });

    // Draw strain polygons
    STRAINS.forEach((strain) => {
      const isHighlighted = highlighted === null || highlighted === strain.id;
      const points = DIMENSIONS.map((dim, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const val = strain[dim.key as keyof StrainData] as number;
        return [
          cx + rScale(val) * Math.cos(angle),
          cy + rScale(val) * Math.sin(angle),
        ];
      });
      const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';

      g.append('path')
        .attr('d', pathData)
        .attr('fill', strain.color)
        .attr('fill-opacity', isHighlighted ? 0.18 : 0.04)
        .attr('stroke', strain.color)
        .attr('stroke-width', isHighlighted ? 2 : 0.8)
        .attr('stroke-opacity', isHighlighted ? 1 : 0.3)
        .style('transition', 'all 0.3s ease');
    });

    // Legend
    const legendG = g.append('g').attr('transform', `translate(10, 10)`);
    STRAINS.forEach((strain, i) => {
      const row = legendG.append('g')
        .attr('transform', `translate(0, ${i * 22})`)
        .style('cursor', 'pointer')
        .on('click', () => setHighlighted(highlighted === strain.id ? null : strain.id));

      row.append('rect')
        .attr('width', 14).attr('height', 14).attr('rx', 2)
        .attr('fill', strain.color)
        .attr('opacity', highlighted === null || highlighted === strain.id ? 1 : 0.3);
      row.append('text')
        .attr('x', 18).attr('y', 11)
        .attr('font-size', 10)
        .attr('fill', highlighted === null || highlighted === strain.id ? strain.color : '#6b7280')
        .text(strain.name);
    });
  }, [highlighted]);

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">布鲁氏菌疫苗株多维比较</h3>
        <p className="mt-0.5 text-xs text-gray-400">Brucellosis Vaccine Strain Comparison · 点击图例高亮单株</p>
      </div>
      <svg ref={svgRef} className="w-full" style={{ maxHeight: 420 }} />
      <div className="grid grid-cols-2 gap-3 text-xs">
        {STRAINS.map((s) => (
          <div
            key={s.id}
            className="cursor-pointer rounded-lg border p-2 transition-colors hover:border-current"
            style={{ borderColor: s.color + '60', backgroundColor: s.color + '10' }}
            onClick={() => setHighlighted(highlighted === s.id ? null : s.id)}
          >
            <p className="font-semibold" style={{ color: s.color }}>{s.name}</p>
            <p className="mt-0.5 text-gray-500 dark:text-slate-400">
              效力 {s.efficacy}% · 安全 {s.safety}% · DIVA {s.divaCompat}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
