'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { FeatureCollection, Geometry } from 'geojson';

// Verified outbreak data — WOAH/FAO/peer-reviewed sources
const LSD_OUTBREAK_DATA = [
  // Africa (baseline, pre-2012 endemic)
  { country: "Zambia",       iso3: "ZMB", year: 1929, region: "Africa",       cluster: "endemic" },
  { country: "Egypt",        iso3: "EGY", year: 1988, region: "Africa",       cluster: "endemic" },
  { country: "Israel",       iso3: "ISR", year: 1989, region: "Middle East",  cluster: "wave1"  },
  { country: "South Africa", iso3: "ZAF", year: 1945, region: "Africa",       cluster: "endemic" },
  { country: "Kenya",        iso3: "KEN", year: 1957, region: "Africa",       cluster: "endemic" },
  { country: "Ethiopia",     iso3: "ETH", year: 1983, region: "Africa",       cluster: "endemic" },
  { country: "Sudan",        iso3: "SDN", year: 1972, region: "Africa",       cluster: "endemic" },
  { country: "Nigeria",      iso3: "NGA", year: 1974, region: "Africa",       cluster: "endemic" },
  // Wave 1: Middle East 2012-2014
  { country: "Jordan",       iso3: "JOR", year: 2012, region: "Middle East",  cluster: "wave1"  },
  { country: "Iraq",         iso3: "IRQ", year: 2012, region: "Middle East",  cluster: "wave1"  },
  { country: "Kuwait",       iso3: "KWT", year: 2012, region: "Middle East",  cluster: "wave1"  },
  { country: "Saudi Arabia", iso3: "SAU", year: 2012, region: "Middle East",  cluster: "wave1"  },
  { country: "Lebanon",      iso3: "LBN", year: 2013, region: "Middle East",  cluster: "wave1"  },
  { country: "Turkey",       iso3: "TUR", year: 2013, region: "Middle East",  cluster: "wave1"  },
  { country: "Iran",         iso3: "IRN", year: 2014, region: "Middle East",  cluster: "wave1"  },
  // Wave 2: Europe & Caucasus 2015-2016
  { country: "Russia",         iso3: "RUS", year: 2015, region: "Europe",     cluster: "wave2"  },
  { country: "Kazakhstan",     iso3: "KAZ", year: 2015, region: "Europe",     cluster: "wave2"  },
  { country: "Greece",         iso3: "GRC", year: 2015, region: "Europe",     cluster: "wave2"  },
  { country: "Bulgaria",       iso3: "BGR", year: 2016, region: "Europe",     cluster: "wave2"  },
  { country: "North Macedonia",iso3: "MKD", year: 2016, region: "Europe",     cluster: "wave2"  },
  { country: "Serbia",         iso3: "SRB", year: 2016, region: "Europe",     cluster: "wave2"  },
  { country: "Kosovo",         iso3: "XKX", year: 2016, region: "Europe",     cluster: "wave2"  },
  { country: "Albania",        iso3: "ALB", year: 2016, region: "Europe",     cluster: "wave2"  },
  { country: "Montenegro",     iso3: "MNE", year: 2016, region: "Europe",     cluster: "wave2"  },
  // Wave 3: South Asia & China 2019
  { country: "India",       iso3: "IND", year: 2019, region: "South Asia",    cluster: "wave3"  },
  { country: "Bangladesh",  iso3: "BGD", year: 2019, region: "South Asia",    cluster: "wave3"  },
  { country: "China",       iso3: "CHN", year: 2019, region: "East Asia",     cluster: "wave3"  },
  { country: "Nepal",       iso3: "NPL", year: 2020, region: "South Asia",    cluster: "wave3"  },
  { country: "Pakistan",    iso3: "PAK", year: 2020, region: "South Asia",    cluster: "wave3"  },
  // Wave 4: Southeast Asia 2020-2022
  { country: "Vietnam",     iso3: "VNM", year: 2020, region: "Southeast Asia", cluster: "wave4" },
  { country: "Myanmar",     iso3: "MMR", year: 2020, region: "Southeast Asia", cluster: "wave4" },
  { country: "Thailand",    iso3: "THA", year: 2021, region: "Southeast Asia", cluster: "wave4" },
  { country: "Laos",        iso3: "LAO", year: 2021, region: "Southeast Asia", cluster: "wave4" },
  { country: "Cambodia",    iso3: "KHM", year: 2021, region: "Southeast Asia", cluster: "wave4" },
  { country: "Malaysia",    iso3: "MYS", year: 2021, region: "Southeast Asia", cluster: "wave4" },
  { country: "Indonesia",   iso3: "IDN", year: 2022, region: "Southeast Asia", cluster: "wave4" },
  { country: "Mongolia",    iso3: "MNG", year: 2021, region: "East Asia",      cluster: "wave4" },
  { country: "Japan",       iso3: "JPN", year: 2024, region: "East Asia",      cluster: "wave4" },
];

const WAVE_COLORS = {
  endemic: "#6b7280",
  wave1:   "#f59e0b",
  wave2:   "#3b82f6",
  wave3:   "#8b5cf6",
  wave4:   "#ef4444",
};

const WAVE_LABELS = {
  endemic: "非洲地方性 Pre-2012",
  wave1:   "第一波：中东 2012-14",
  wave2:   "第二波：欧洲/高加索 2015-16",
  wave3:   "第三波：南亚/中国 2019-20",
  wave4:   "第四波：东南亚 2021-24",
};

// ISO 3166-1 alpha-3 → ISO numeric (for topojson d.id lookup)
const ISO3_TO_NUMERIC: Record<string, number> = {
  ZMB: 894, EGY: 818, ISR: 376, ZAF: 710, KEN: 404,
  ETH: 231, SDN: 736, NGA: 566, JOR: 400, IRQ: 368,
  KWT: 414, SAU: 682, LBN: 422, TUR: 792, IRN: 364,
  RUS: 643, KAZ: 398, GRC: 300, BGR: 100, MKD: 807,
  SRB: 688, ALB:   8, MNE: 499, IND: 356, BGD:  50,
  CHN: 156, NPL: 524, PAK: 586, VNM: 704, MMR: 104,
  THA: 764, LAO: 418, KHM: 116, MYS: 458, IDN: 360,
  MNG: 496, JPN: 392,
};

// Numeric-keyed lookup for fast D3 access
const LSD_LOOKUP: Record<number, typeof LSD_OUTBREAK_DATA[number]> = {};
for (const entry of LSD_OUTBREAK_DATA) {
  const num = ISO3_TO_NUMERIC[entry.iso3];
  if (num) LSD_LOOKUP[num] = entry;
}

const YEAR_MIN = 2010, YEAR_MAX = 2024;

function getColor(entry: typeof LSD_OUTBREAK_DATA[number] | undefined, currentYear: number): string {
  if (!entry || entry.year > currentYear) return '#1e293b';
  return WAVE_COLORS[entry.cluster as keyof typeof WAVE_COLORS];
}

export function LSDSpreadMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [year, setYear] = useState(2021);
  const [tooltip, setTooltip] = useState<{ name: string; data: typeof LSD_OUTBREAK_DATA[number] } | null>(null);
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
        return getColor(LSD_LOOKUP[id], year);
      })
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.3)
      .style('cursor', (d) => LSD_LOOKUP[+(d.id ?? 0)] ? 'pointer' : 'default')
      .on('mouseenter', (event, d) => {
        const id = +(d.id ?? 0);
        const lsdEntry = LSD_LOOKUP[id];
        if (lsdEntry && lsdEntry.year <= year) {
          setTooltip({ name: d.properties?.name ?? lsdEntry.country, data: lsdEntry });
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
    const legend = g.append('g').attr('transform', `translate(10, ${H - 100})`);
    ([
      { color: WAVE_COLORS.endemic, label: WAVE_LABELS.endemic },
      { color: WAVE_COLORS.wave1,   label: WAVE_LABELS.wave1 },
      { color: WAVE_COLORS.wave2,   label: WAVE_LABELS.wave2 },
      { color: WAVE_COLORS.wave3,   label: WAVE_LABELS.wave3 },
      { color: WAVE_COLORS.wave4,   label: WAVE_LABELS.wave4 },
      { color: '#1e293b',           label: '未报告 Unreported' },
    ] as { color: string; label: string }[]).forEach(({ color, label }, i) => {
      legend.append('rect').attr('x', 0).attr('y', i * 14).attr('width', 9).attr('height', 9).attr('rx', 2).attr('fill', color);
      legend.append('text').attr('x', 13).attr('y', i * 14 + 7.5).attr('font-size', 7).attr('fill', '#94a3b8').text(label);
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
          <div className="absolute bottom-4 left-4 rounded-lg bg-slate-800/95 p-3 text-xs text-white max-w-52">
            <p className="font-semibold">{tooltip.name}</p>
            <p className="mt-1 text-slate-300">首次报告：{tooltip.data.year}年</p>
            <p className="mt-0.5 text-slate-400">{tooltip.data.region}</p>
            <p className="mt-0.5 font-medium" style={{ color: WAVE_COLORS[tooltip.data.cluster as keyof typeof WAVE_COLORS] }}>
              {WAVE_LABELS[tooltip.data.cluster as keyof typeof WAVE_LABELS]}
            </p>
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
        LSD自1929年于非洲地方性流行（赞比亚），1988年传至北非（埃及），2012-14年第一波席卷中东，
        2015-16年第二波蔓延欧洲与高加索地区，2019-20年第三波进入南亚与中国，
        2020-24年第四波在东南亚大规模暴发（越南/缅甸/泰国/柬埔寨/老挝/马来西亚/印尼），2024年传入日本。
        数据来源：WOAH / FAO / 同行评审文献。
      </div>
    </div>
  );
}
