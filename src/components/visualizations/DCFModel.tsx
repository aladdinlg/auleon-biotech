'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface Bar {
  id: string;
  label: string;
  labelEN: string;
  value: number;
  base: number; // cumulative base for waterfall
  color: string;
  isTotal?: boolean;
}

const BARS: Bar[] = [
  { id: 'nav', label: '净资产价值 NAV', labelEN: 'Net Asset Value', value: 121, base: 0, color: '#94a3b8' },
  { id: 'dcf_inc', label: 'DCF 增量', labelEN: 'DCF Increment', value: 631, base: 121, color: '#0d9488' },
  { id: 'total', label: 'DCF 总估值', labelEN: 'Total DCF', value: 752, base: 0, color: '#0d9488', isTotal: true },
  { id: 'deal', label: '40%股权对价', labelEN: '40% Deal Price', value: 274, base: 0, color: '#f59e0b' },
];

const PROFIT_DATA = [
  { label: '2024A', value: 19.57, color: '#94a3b8', note: '实际利润' },
  { label: '2025P', value: 64.84, color: '#f59e0b', note: '8月预测' },
  { label: '2026E', value: 80, color: '#0d9488', note: '承诺' },
  { label: '2027E', value: 85, color: '#0d9488', note: '承诺' },
  { label: '2028E', value: 90, color: '#0d9488', note: '承诺' },
];

export function DCFModel() {
  const waterfallRef = useRef<SVGSVGElement>(null);
  const profitRef = useRef<SVGSVGElement>(null);

  // Waterfall chart
  useEffect(() => {
    const svg = waterfallRef.current;
    if (!svg) return;
    const W = 360, H = 220;
    const padL = 30, padB = 50, padT = 20, padR = 15;
    const plotW = W - padL - padR, plotH = H - padT - padB;

    d3.select(svg).selectAll('*').remove();
    const g = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`).append('g');

    const maxVal = 800;
    const yScale = d3.scaleLinear().domain([0, maxVal]).range([padT + plotH, padT]);
    const xScale = d3.scaleBand().domain(BARS.map((b) => b.id)).range([padL, padL + plotW]).padding(0.3);

    // Grid
    [200, 400, 600, 800].forEach((v) => {
      const y = yScale(v);
      g.append('line').attr('x1', padL).attr('y1', y).attr('x2', padL + plotW).attr('y2', y)
        .attr('stroke', '#374151').attr('stroke-width', 0.4).attr('stroke-dasharray', '3,2');
      g.append('text').attr('x', padL - 3).attr('y', y + 3).attr('text-anchor', 'end').attr('font-size', 7).attr('fill', '#6b7280').text(`¥${v}M`);
    });

    // Bars
    BARS.forEach((bar) => {
      const x = xScale(bar.id)!;
      const bW = xScale.bandwidth();
      const y1 = yScale(bar.base + bar.value);
      const y2 = yScale(bar.base);
      const barH = y2 - y1;

      // Connector line
      if (!bar.isTotal && bar.base > 0) {
        const prevBar = BARS.find((b) => b.base + b.value === bar.base);
        if (prevBar) {
          const prevX = xScale(prevBar.id)! + xScale.bandwidth();
          g.append('line').attr('x1', prevX).attr('y1', yScale(bar.base)).attr('x2', x).attr('y2', yScale(bar.base))
            .attr('stroke', '#374151').attr('stroke-width', 1).attr('stroke-dasharray', '3,2');
        }
      }

      g.append('rect')
        .attr('x', x).attr('y', y1).attr('width', bW).attr('height', barH)
        .attr('fill', bar.color).attr('opacity', 0.85).attr('rx', 3);

      // Value label
      g.append('text')
        .attr('x', x + bW / 2).attr('y', y1 - 4)
        .attr('text-anchor', 'middle').attr('font-size', 9).attr('font-weight', 'bold')
        .attr('fill', bar.color)
        .text(`¥${bar.value}M`);

      // X label (multi-line)
      const lines = bar.label.split(' ');
      lines.forEach((line, i) => {
        g.append('text')
          .attr('x', x + bW / 2).attr('y', H - padB + 10 + i * 11)
          .attr('text-anchor', 'middle').attr('font-size', 7).attr('fill', '#94a3b8')
          .text(line);
      });
    });

    // Axes
    g.append('line').attr('x1', padL).attr('y1', padT + plotH).attr('x2', padL + plotW).attr('y2', padT + plotH).attr('stroke', '#6b7280');

    // Title
    g.append('text').attr('x', W / 2).attr('y', 12).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#6b7280').text('澳龙估值瀑布图 DCF Waterfall');
  }, []);

  // Profit timeline chart
  useEffect(() => {
    const svg = profitRef.current;
    if (!svg) return;
    const W = 360, H = 180;
    const padL = 35, padB = 30, padT = 15, padR = 15;
    const plotW = W - padL - padR, plotH = H - padT - padB;

    d3.select(svg).selectAll('*').remove();
    const g = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`).append('g');

    const maxProfit = 100;
    const yScale = d3.scaleLinear().domain([0, maxProfit]).range([padT + plotH, padT]);
    const xScale = d3.scaleBand().domain(PROFIT_DATA.map((d) => d.label)).range([padL, padL + plotW]).padding(0.3);

    [25, 50, 75, 100].forEach((v) => {
      g.append('line').attr('x1', padL).attr('y1', yScale(v)).attr('x2', padL + plotW).attr('y2', yScale(v))
        .attr('stroke', '#374151').attr('stroke-width', 0.4).attr('stroke-dasharray', '3,2');
      g.append('text').attr('x', padL - 3).attr('y', yScale(v) + 3).attr('text-anchor', 'end').attr('font-size', 7).attr('fill', '#6b7280').text(`¥${v}M`);
    });

    PROFIT_DATA.forEach((d) => {
      const x = xScale(d.label)!;
      const bW = xScale.bandwidth();
      const barH = plotH - (yScale(d.value) - padT);

      g.append('rect')
        .attr('x', x).attr('y', yScale(d.value))
        .attr('width', bW).attr('height', barH)
        .attr('fill', d.color).attr('opacity', 0.8).attr('rx', 3);

      g.append('text')
        .attr('x', x + bW / 2).attr('y', yScale(d.value) - 4)
        .attr('text-anchor', 'middle').attr('font-size', 8).attr('font-weight', 'bold')
        .attr('fill', d.color).text(`¥${d.value}M`);

      g.append('text').attr('x', x + bW / 2).attr('y', H - padB + 10).attr('text-anchor', 'middle').attr('font-size', 8).attr('fill', '#94a3b8').text(d.label);
      g.append('text').attr('x', x + bW / 2).attr('y', H - padB + 20).attr('text-anchor', 'middle').attr('font-size', 7).attr('fill', '#64748b').text(d.note);
    });

    g.append('line').attr('x1', padL).attr('y1', padT + plotH).attr('x2', padL + plotW).attr('y2', padT + plotH).attr('stroke', '#6b7280');
    g.append('text').attr('x', W / 2).attr('y', 10).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#6b7280').text('利润承诺时间线 Profit Commitment');
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">澳龙生物 DCF 估值模型</h3>
        <p className="mt-0.5 text-xs text-gray-400">Auleon Biologicals DCF Valuation · 恒通股份收购分析</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <svg ref={waterfallRef} className="w-full rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
        <svg ref={profitRef} className="w-full rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'NAV 净资产', value: '¥121M', color: 'gray', note: '账面基础估值' },
          { label: 'DCF 溢价', value: '521%', color: 'teal', note: 'DCF vs NAV 超额溢价' },
          { label: '3年承诺总利润', value: '¥255M', color: 'amber', note: '¥80M+¥85M+¥90M' },
        ].map((m) => (
          <div key={m.label} className={`rounded-xl border p-3 text-center ${
            m.color === 'gray' ? 'border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800' :
            m.color === 'teal' ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30' :
            'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
          }`}>
            <p className="text-xs text-gray-500 dark:text-slate-400">{m.label}</p>
            <p className={`text-xl font-bold ${
              m.color === 'gray' ? 'text-gray-700 dark:text-gray-300' :
              m.color === 'teal' ? 'text-teal-700 dark:text-teal-300' :
              'text-amber-700 dark:text-amber-300'
            }`}>{m.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">{m.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
