'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { FeatureCollection, Geometry } from 'geojson';

// Country data: ISO numeric code → { firstYear, policy }
const LSD_DATA: Record<number, { firstYear: number; policy: string }> = {
  788: { firstYear: 1988, policy: '地方性流行，长期防控计划' },  // Tunisia
  12:  { firstYear: 2000, policy: '周期性疫情，区域扑灭计划' },  // Algeria
  818: { firstYear: 2006, policy: '与口蹄疫联合防控' },          // Egypt
  792: { firstYear: 2013, policy: 'EUA紧急疫苗授权' },           // Turkey
  300: { firstYear: 2015, policy: '紧急扑灭，疫苗支持' },        // Greece
  100: { firstYear: 2016, policy: '进口限制+强制免疫' },         // Bulgaria
  356: { firstYear: 2019, policy: '边境检疫升级' },              // India
  764: { firstYear: 2021, policy: 'DLD紧急授权GTPV疫苗' },      // Thailand
  360: { firstYear: 2022, policy: 'BBPMSOH EUA授权' },           // Indonesia
  704: { firstYear: 2021, policy: 'DAH紧急使用授权' },           // Vietnam
  116: { firstYear: 2022, policy: '澳龙援助出口50万剂' },        // Cambodia
  418: { firstYear: 2021, policy: '澳龙援助出口20万剂' },        // Laos
  144: { firstYear: 2023, policy: '监控体系建立中' },            // Sri Lanka
  586: { firstYear: 2022, policy: '边境预警，疫苗储备' },        // Pakistan
  682: { firstYear: 2000, policy: '地方性流行，区域管控' },      // Saudi Arabia
  368: { firstYear: 2012, policy: 'Iraq持续高流行区' },          // Iraq
  364: { firstYear: 2018, policy: '季节性暴发，免疫加强' },      // Iran
};

const YEAR_MIN = 2010, YEAR_MAX = 2024;

function getColor(year: number | undefined, currentYear: number): string {
  if (!year || year > currentYear) return '#1e293b'; // not affected
  if (currentYear - year <= 2) return '#ef4444'; // recent (<3y)
  if (currentYear - year <= 6) return '#f59e0b'; // moderate (3-6y)
  return '#64748b'; // long-standing (>6y)
}

export function LSDSpreadMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [year, setYear] = useState(2021);
  const [tooltip, setTooltip] = useState<{ name: string; data: typeof LSD_DATA[number] } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [worldData, setWorldData] = useState<FeatureCollection<Geometry, any> | null>(null);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((r) => r.json())
      .then((topology) => {
        // Convert topojson to GeoJSON
        import('topojson-client').then(({ feature }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const countries = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, any>;
          setWorldData(countries);
        }).catch(() => {
          // topojson-client might not be installed; use a simplified approach
          setWorldData({ type: 'FeatureCollection', features: [] });
        });
      })
      .catch(() => {
        setWorldData({ type: 'FeatureCollection', features: [] });
      });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !worldData) return;

    const W = 640, H = 360;
    d3.select(svg).selectAll('*').remove();
    const g = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`).append('g');

    const projection = d3.geoNaturalEarth1().scale(100).translate([W / 2, H / 2 + 20]);
    const path = d3.geoPath().projection(projection);

    // Background
    g.append('rect').attr('width', W).attr('height', H).attr('fill', '#0f172a');

    // Countries
    g.selectAll('path.country')
      .data(worldData.features)
      .join('path')
      .attr('class', 'country')
      .attr('d', (d) => path(d) ?? '')
      .attr('fill', (d) => {
        const id = +(d.id ?? 0);
        const lsdEntry = LSD_DATA[id];
        return getColor(lsdEntry?.firstYear, year);
      })
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.3)
      .style('cursor', (d) => LSD_DATA[+(d.id ?? 0)] ? 'pointer' : 'default')
      .on('mouseenter', (event, d) => {
        const id = +(d.id ?? 0);
        const lsdEntry = LSD_DATA[id];
        if (lsdEntry && lsdEntry.firstYear <= year) {
          setTooltip({ name: d.properties?.name ?? `Country ${id}`, data: lsdEntry });
        }
      })
      .on('mouseleave', () => setTooltip(null));

    // Graticule
    g.append('path')
      .datum(d3.geoGraticule()())
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 0.3);

    // Title
    g.append('text')
      .attr('x', W / 2).attr('y', 16)
      .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', '#94a3b8')
      .text(`LSD 传播地图 — ${year}年`);

    // Legend
    const legend = g.append('g').attr('transform', `translate(${W - 130}, ${H - 80})`);
    [
      { color: '#ef4444', label: '近期暴发 (<3年)' },
      { color: '#f59e0b', label: '中期流行 (3-6年)' },
      { color: '#64748b', label: '长期流行 (>6年)' },
      { color: '#1e293b', label: '未报告' },
    ].forEach(({ color, label }, i) => {
      legend.append('rect').attr('x', 0).attr('y', i * 16).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', color);
      legend.append('text').attr('x', 14).attr('y', i * 16 + 8).attr('font-size', 8).attr('fill', '#94a3b8').text(label);
    });
  }, [worldData, year]);

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">牛结节性皮肤病（LSD）全球传播地图</h3>
        <p className="mt-0.5 text-xs text-gray-400">LSD Global Spread Map · 拖动时间轴观察扩散趋势</p>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700">
        <svg ref={svgRef} className="w-full" style={{ minHeight: 280 }} />
        {tooltip && (
          <div className="absolute bottom-4 left-4 rounded-lg bg-slate-800/95 p-3 text-xs text-white max-w-48">
            <p className="font-semibold">{tooltip.name}</p>
            <p className="mt-1 text-slate-300">首次报告：{tooltip.data.firstYear}年</p>
            <p className="mt-0.5 text-slate-400">{tooltip.data.policy}</p>
          </div>
        )}
      </div>

      {/* Time slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
          <span>{YEAR_MIN}</span>
          <span className="font-bold text-teal-600 dark:text-teal-400">{year}年</span>
          <span>{YEAR_MAX}</span>
        </div>
        <input
          type="range" min={YEAR_MIN} max={YEAR_MAX} step={1} value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full accent-teal-600"
        />
      </div>

      {!worldData && (
        <div className="rounded-lg bg-gray-50 p-3 text-xs text-center text-gray-400 dark:bg-slate-800">地图数据加载中...</div>
      )}

      <div className="rounded-xl bg-slate-800/50 p-3 text-xs leading-5 text-slate-400">
        LSD自1988年于北非地方性流行，2013年入侵土耳其，2015年蔓延至欧洲（希腊、保加利亚），
        2019年进入印度次大陆，2021-2022年东南亚大规模暴发（泰国/印尼/越南/柬埔寨/老挝）。
        澳龙EG95提供跨保护的GTPV疫苗已在东南亚多国获得EUA授权。
      </div>
    </div>
  );
}
