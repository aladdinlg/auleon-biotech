'use client';

import { useState, useEffect, useRef } from 'react';

interface Node {
  id: string;
  labelZH: string;
  labelEN: string;
  x: number;
  y: number;
  r: number;
  color: string;
  icon: string;
}

interface Edge {
  from: string;
  to: string;
  label: string;
  isVaccineTarget?: boolean;
}

const NODES: Node[] = [
  { id: 'dog', labelZH: '终末宿主（犬）', labelEN: 'Definitive Host (Dog)', x: 240, y: 60, r: 38, color: '#f59e0b', icon: '🐕' },
  { id: 'egg', labelZH: '虫卵', labelEN: 'Egg', x: 420, y: 180, r: 30, color: '#94a3b8', icon: '🥚' },
  { id: 'onco', labelZH: '六钩蚴', labelEN: 'Oncosphere', x: 380, y: 340, r: 34, color: '#ef4444', icon: '🦠' },
  { id: 'cyst', labelZH: '棘球蚴包囊', labelEN: 'Hydatid Cyst', x: 120, y: 340, r: 38, color: '#8b5cf6', icon: '🫧' },
  { id: 'sheep', labelZH: '中间宿主（羊）', labelEN: 'Intermediate Host', x: 80, y: 180, r: 36, color: '#22c55e', icon: '🐑' },
];

const EDGES: Edge[] = [
  { from: 'dog', to: 'egg', label: '粪便排虫卵' },
  { from: 'egg', to: 'onco', label: '草场摄入孵化' },
  { from: 'onco', to: 'cyst', label: '穿透肠黏膜→门静脉→肝', isVaccineTarget: true },
  { from: 'cyst', to: 'sheep', label: '包囊在器官发育' },
  { from: 'sheep', to: 'dog', label: '犬摄入含原头节器官' },
];

function getCenter(nodes: Node[], id: string) {
  const n = nodes.find((n) => n.id === id)!;
  return { x: n.x, y: n.y };
}

export function EG95LifeCycle() {
  const [step, setStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vaccineDeployed, setVaccineDeployed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = EDGES.length;

  useEffect(() => {
    if (!isPlaying) return;
    if (step >= totalSteps - 1) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, step, totalSteps]);

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setStep(-1);
    setVaccineDeployed(false);
  };

  const activeEdge = step >= 0 ? EDGES[step] : null;

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">EG95疫苗与细粒棘球绦虫生活史</h3>
        <p className="mt-0.5 text-xs text-gray-400">EG95 Vaccine Life Cycle · 点击「部署疫苗」阻断六钩蚴侵入</p>
      </div>

      <svg viewBox="0 0 500 420" className="w-full rounded-xl border border-gray-200 bg-slate-950 dark:border-slate-700">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
          </marker>
          <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
          </marker>
          <marker id="arrow-vaccine" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Edges */}
        {EDGES.map((edge, i) => {
          const from = getCenter(NODES, edge.from);
          const to = getCenter(NODES, edge.to);
          const isActive = activeEdge?.from === edge.from && activeEdge?.to === edge.to;
          const isVaccineBlocked = vaccineDeployed && edge.isVaccineTarget;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isVaccineBlocked ? '#22c55e' : isActive ? '#f59e0b' : '#475569'}
                strokeWidth={isVaccineBlocked ? 3 : isActive ? 2.5 : 1}
                strokeDasharray={isVaccineBlocked ? '6,3' : undefined}
                markerEnd={`url(#arrow${isVaccineBlocked ? '-vaccine' : isActive ? '-red' : ''})`}
                style={{ transition: 'all 0.4s' }}
              />
              <text x={midX} y={midY - 6} textAnchor="middle" fontSize={8} fill={isVaccineBlocked ? '#22c55e' : '#94a3b8'}>
                {isVaccineBlocked ? '🛡️ EG95 IgG 阻断' : edge.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const isHighlighted =
            activeEdge?.from === node.id || activeEdge?.to === node.id;
          return (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y} r={node.r}
                fill={node.color} fillOpacity={isHighlighted ? 0.35 : 0.15}
                stroke={node.color} strokeWidth={isHighlighted ? 2.5 : 1.5}
                style={{ transition: 'all 0.3s' }}
              />
              <text x={node.x} y={node.y - 2} textAnchor="middle" fontSize={18}>{node.icon}</text>
              <text x={node.x} y={node.y + 16} textAnchor="middle" fontSize={8} fill={node.color} fontWeight="bold">
                {node.labelZH}
              </text>
              <text x={node.x} y={node.y + 26} textAnchor="middle" fontSize={7} fill="#64748b">
                {node.labelEN}
              </text>
            </g>
          );
        })}

        {/* Step label */}
        {activeEdge && (
          <text x={250} y={410} textAnchor="middle" fontSize={9} fill="#94a3b8">
            步骤 {step + 1}/{totalSteps}：{activeEdge.label}
          </text>
        )}
      </svg>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => { if (step < 0) setStep(0); setIsPlaying((p) => !p); }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isPlaying ? '⏸ 暂停' : step >= 0 ? '▶ 继续' : '▶ 启动'}
        </button>
        <button
          onClick={() => setVaccineDeployed((v) => !v)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${vaccineDeployed ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'}`}
        >
          {vaccineDeployed ? '✅ 疫苗已部署' : '💉 部署疫苗'}
        </button>
        <button onClick={reset} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300">
          ↺ 重置
        </button>
      </div>

      <div className="rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
        <span className="font-semibold text-gray-900 dark:text-slate-100">疫苗作用靶点：</span>
        六钩蚴（Oncosphere）在孵化后穿越肠黏膜进入门静脉的关键窗口期。EG95 诱导的特异性 IgG 与六钩蚴表面结合，激活补体调理和吞噬细胞杀伤，阻断其进入肝脏建立包囊病灶。保护率 98%（绵羊攻毒模型）。
      </div>
    </div>
  );
}
