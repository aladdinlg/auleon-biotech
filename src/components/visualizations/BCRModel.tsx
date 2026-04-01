'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Seroprevalence decay data over 20 years
const SERO_DATA = Array.from({ length: 21 }, (_, i) => ({
  year: i,
  rate: 9.22 * Math.exp(-0.16 * i) + (i === 20 ? 0.05 : 0),
}));
// Clamp final value to 0.73
SERO_DATA[20] = { year: 20, rate: 0.73 };

export function BCRModel() {
  const barRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGSVGElement>(null);

  // Bar chart: BCR, NPV, IRR key metrics
  useEffect(() => {
    const svg = barRef.current;
    if (!svg) return;
    const W = 320, H = 180;
    const padL = 60, padB = 30, padT = 15;
    const plotH = H - padT - padB;

    d3.select(svg).selectAll('*').remove();
    const g = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`).append('g');

    const metrics = [
      { label: 'BCR', value: 4.25, unit: '倍', color: '#0d9488', max: 5 },
      { label: 'NPV', value: 10.56, unit: 'M$', color: '#3b82f6', max: 15 },
      { label: 'IRR', value: 91.38, unit: '%', color: '#8b5cf6', max: 100 },
    ];

    metrics.forEach((m, i) => {
      const bW = 60, gap = 20;
      const x = padL + i * (bW + gap);
      const yScale = d3.scaleLinear().domain([0, m.max]).range([plotH, 0]);
      const barH = plotH - yScale(m.value);

      g.append('rect')
        .attr('x', x).attr('y', padT + yScale(m.value))
        .attr('width', bW).attr('height', barH)
        .attr('fill', m.color).attr('rx', 4).attr('opacity', 0.85);

      g.append('text')
        .attr('x', x + bW / 2).attr('y', padT + yScale(m.value) - 4)
        .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 'bold')
        .attr('fill', m.color)
        .text(`${m.value}${m.unit}`);

      g.append('text')
        .attr('x', x + bW / 2).attr('y', H - 8)
        .attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#9ca3af')
        .text(m.label);
    });

    // Title
    g.append('text')
      .attr('x', W / 2).attr('y', 10)
      .attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#6b7280')
      .text('Iraq CBA 核心指标');
  }, []);

  // Line chart: seroprevalence decay
  useEffect(() => {
    const svg = lineRef.current;
    if (!svg) return;
    const W = 320, H = 180;
    const padL = 45, padB = 30, padT = 20, padR = 15;
    const plotW = W - padL - padR, plotH = H - padT - padB;

    d3.select(svg).selectAll('*').remove();
    const g = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`).append('g');

    const xScale = d3.scaleLinear().domain([0, 20]).range([padL, padL + plotW]);
    const yScale = d3.scaleLinear().domain([0, 10]).range([padT + plotH, padT]);

    // Grid
    [2, 4, 6, 8].forEach((v) => {
      g.append('line')
        .attr('x1', padL).attr('y1', yScale(v)).attr('x2', padL + plotW).attr('y2', yScale(v))
        .attr('stroke', '#374151').attr('stroke-width', 0.4).attr('stroke-dasharray', '3,2');
    });

    // Axes
    g.append('line').attr('x1', padL).attr('y1', padT + plotH).attr('x2', padL + plotW).attr('y2', padT + plotH).attr('stroke', '#6b7280').attr('stroke-width', 1);
    g.append('line').attr('x1', padL).attr('y1', padT).attr('x2', padL).attr('y2', padT + plotH).attr('stroke', '#6b7280').attr('stroke-width', 1);

    // X ticks
    [0, 5, 10, 15, 20].forEach((v) => {
      g.append('text').attr('x', xScale(v)).attr('y', padT + plotH + 12).attr('text-anchor', 'middle').attr('font-size', 8).attr('fill', '#9ca3af').text(v + 'y');
    });
    // Y ticks
    [0, 2, 4, 6, 8, 10].forEach((v) => {
      g.append('text').attr('x', padL - 5).attr('y', yScale(v) + 3).attr('text-anchor', 'end').attr('font-size', 8).attr('fill', '#9ca3af').text(v + '%');
    });

    // Area fill
    const area = d3.area<(typeof SERO_DATA)[0]>()
      .x((d) => xScale(d.year))
      .y0(padT + plotH)
      .y1((d) => yScale(d.rate))
      .curve(d3.curveCatmullRom);

    g.append('path')
      .datum(SERO_DATA)
      .attr('d', area)
      .attr('fill', '#ef4444')
      .attr('opacity', 0.15);

    // Line
    const line = d3.line<(typeof SERO_DATA)[0]>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.rate))
      .curve(d3.curveCatmullRom);

    g.append('path').datum(SERO_DATA).attr('d', line).attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 2);

    // Annotation: start and end
    g.append('text').attr('x', xScale(0) + 4).attr('y', yScale(9.22) - 4).attr('font-size', 8).attr('fill', '#ef4444').text('9.22%');
    g.append('circle').attr('cx', xScale(0)).attr('cy', yScale(9.22)).attr('r', 3).attr('fill', '#ef4444');
    g.append('text').attr('x', xScale(20) - 4).attr('y', yScale(0.73) - 6).attr('text-anchor', 'end').attr('font-size', 8).attr('fill', '#22c55e').text('0.73%');
    g.append('circle').attr('cx', xScale(20)).attr('cy', yScale(0.73)).attr('r', 3).attr('fill', '#22c55e');

    // Label
    g.append('text').attr('x', W / 2).attr('y', 12).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#6b7280').text('血清流行率 20年下降轨迹');
    g.append('text').attr('x', padL + plotW / 2).attr('y', H - 2).attr('text-anchor', 'middle').attr('font-size', 8).attr('fill', '#6b7280').text('年份 Year');
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">布鲁氏菌病免疫计划成本收益模型</h3>
        <p className="mt-0.5 text-xs text-gray-400">Iraq Cost-Benefit Analysis · 20年持续免疫效益评估</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <svg ref={barRef} className="w-full rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
        </div>
        <div>
          <svg ref={lineRef} className="w-full rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '收益成本比 BCR', value: '4.25×', color: 'teal', note: '每¥1投入产出¥4.25回报' },
          { label: '净现值 NPV', value: '$10.56M', color: 'blue', note: '20年折现净收益（美元）' },
          { label: '内部收益率 IRR', value: '91.38%', color: 'violet', note: '极高回报效率' },
        ].map((m) => (
          <div key={m.label} className={`rounded-xl border p-3 text-center ${
            m.color === 'teal' ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30' :
            m.color === 'blue' ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30' :
            'border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30'
          }`}>
            <p className="text-xs text-gray-500 dark:text-slate-400">{m.label}</p>
            <p className={`text-xl font-bold ${
              m.color === 'teal' ? 'text-teal-700 dark:text-teal-300' :
              m.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
              'text-violet-700 dark:text-violet-300'
            }`}>{m.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">{m.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
