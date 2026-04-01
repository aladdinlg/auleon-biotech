'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 0 | 1 | 2 | 3;

const PHASE_INFO = [
  { label: '待机', labelEN: 'Idle', desc: 'Brucella（杆状）接近巨噬细胞，准备被吞噬', color: '#94a3b8' },
  { label: '吞噬', labelEN: 'Phagocytosis', desc: '巨噬细胞将布鲁氏菌内化至吞噬体（Phagosome）', color: '#f59e0b' },
  { label: 'T4SS 注射', labelEN: 'T4SS Injection', desc: 'T4SS分泌系统向细胞质注入效应蛋白，修饰吞噬体膜，阻止与溶酶体融合', color: '#ef4444' },
  { label: '胞内增殖', labelEN: 'Replication Niche', desc: '布鲁氏菌在BCV（Brucella-Containing Vacuole）内增殖，逃逸宿主杀菌机制', color: '#8b5cf6' },
];

export function BrucellaEvasion() {
  const [phase, setPhase] = useState<Phase>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNormal, setShowNormal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setPhase((p) => {
      if (p >= 3) { setIsPlaying(false); return 3; }
      return (p + 1) as Phase;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(advance, 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, phase, advance]);

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setPhase(0);
  };

  const info = PHASE_INFO[phase];

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">布鲁氏菌胞内逃逸机制</h3>
        <p className="mt-0.5 text-xs text-gray-400">Brucella Intracellular Evasion · T4SS 介导的溶酶体融合阻断</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Main animation SVG */}
        <div className="flex-1">
          <svg viewBox="0 0 320 260" className="w-full rounded-xl border border-gray-200 bg-slate-950 dark:border-slate-700">
            {/* Macrophage outline */}
            <ellipse cx={160} cy={140} rx={130} ry={100} fill="#1e293b" stroke="#3b82f6" strokeWidth={2} />
            <text x={160} y={252} textAnchor="middle" fontSize={9} fill="#3b82f6">巨噬细胞 Macrophage</text>

            {/* Nucleus */}
            <ellipse cx={100} cy={160} rx={40} ry={28} fill="#1e3a5f" stroke="#60a5fa" strokeWidth={1} />
            <text x={100} y={164} textAnchor="middle" fontSize={7} fill="#60a5fa">细胞核</text>

            {/* Lysosome (normal pathway) */}
            {showNormal && (
              <g>
                <circle cx={220} cy={170} r={22} fill="#ef444422" stroke="#ef4444" strokeWidth={1.5} />
                <text x={220} y={167} textAnchor="middle" fontSize={7} fill="#ef4444">溶酶体</text>
                <text x={220} y={177} textAnchor="middle" fontSize={7} fill="#ef4444">Lysosome</text>
                {/* Arrow showing normal fusion */}
                {phase >= 1 && (
                  <line x1={200} y1={160} x2={175} y2={145} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="3,2" markerEnd="url(#arrow-green)" />
                )}
                <text x={186} y={148} fontSize={7} fill="#22c55e">正常融合↓</text>
              </g>
            )}

            {/* Brucella bacterium */}
            {phase === 0 && (
              <g>
                <ellipse cx={270} cy={80} rx={18} ry={8} fill="#f59e0b" opacity={0.8} />
                <text x={270} y={84} textAnchor="middle" fontSize={7} fill="#78350f">Brucella</text>
                <text x={270} y={96} textAnchor="middle" fontSize={7} fill="#94a3b8">靠近中...</text>
              </g>
            )}

            {/* Phase 1: Phagosome */}
            {phase >= 1 && (
              <g>
                <circle cx={170} cy={130} r={30}
                  fill={phase >= 2 ? (showNormal ? '#22c55e22' : '#ef444422') : '#f59e0b22'}
                  stroke={phase >= 2 ? (showNormal ? '#22c55e' : '#ef4444') : '#f59e0b'}
                  strokeWidth={phase >= 2 ? 2 : 1.5}
                  strokeDasharray={phase >= 2 && !showNormal ? '4,2' : undefined}
                />
                <text x={170} y={127} textAnchor="middle" fontSize={7} fill={phase >= 2 ? '#ef4444' : '#f59e0b'}>吞噬体</text>
                <text x={170} y={137} textAnchor="middle" fontSize={6} fill="#94a3b8">Phagosome</text>
                {/* Bacteria inside */}
                <ellipse cx={170} cy={120} rx={10} ry={5} fill="#f59e0b" opacity={0.7} />
              </g>
            )}

            {/* Phase 2: T4SS needles */}
            {phase >= 2 && !showNormal && (
              <g>
                {[150, 165, 185, 200].map((x, i) => (
                  <line key={i} x1={x} y1={110} x2={x - 5 + i * 4} y2={95} stroke="#ef4444" strokeWidth={1.5} />
                ))}
                <text x={176} y={88} textAnchor="middle" fontSize={7} fill="#ef4444" fontWeight="bold">T4SS 效应蛋白</text>
                <text x={176} y={98} textAnchor="middle" fontSize={6} fill="#ef4444">↓ 阻止溶酶体融合</text>
              </g>
            )}

            {/* Phase 3: BCV replication */}
            {phase >= 3 && !showNormal && (
              <g>
                {[[168, 118], [174, 124], [162, 128], [178, 115]].map(([x, y], i) => (
                  <ellipse key={i} cx={x} cy={y} rx={5} ry={2.5} fill="#8b5cf6" opacity={0.7} />
                ))}
                <text x={170} y={158} textAnchor="middle" fontSize={8} fill="#8b5cf6">🦠×4 BCV 胞内增殖</text>
              </g>
            )}

            <defs>
              <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#22c55e" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Phase info + controls */}
        <div className="w-full space-y-3 lg:w-52">
          {/* Phase steps */}
          {PHASE_INFO.map((p, i) => (
            <button
              key={i}
              onClick={() => { setIsPlaying(false); setPhase(i as Phase); }}
              className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-all ${
                phase === i ? 'ring-2 ring-offset-1' : 'opacity-50 hover:opacity-80'
              }`}
              style={{ backgroundColor: p.color + '20', borderColor: p.color + '60', border: '1px solid' }}
            >
              <span className="font-bold" style={{ color: p.color }}>{i}. {p.label}</span>
              <br />
              <span className="text-gray-500">{p.labelEN}</span>
            </button>
          ))}

          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying((r) => !r)}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold text-white transition-colors ${isPlaying ? 'bg-amber-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={reset} className="flex-1 rounded-lg bg-gray-200 py-2 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-slate-300">
              ↺
            </button>
          </div>

          <button
            onClick={() => setShowNormal((n) => !n)}
            className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              showNormal ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-400'
            }`}
          >
            {showNormal ? '✓ 正常路径对比中' : '对比正常溶酶体路径'}
          </button>
        </div>
      </div>

      {/* Phase description */}
      <div className="rounded-xl p-4" style={{ backgroundColor: info.color + '15', border: `1px solid ${info.color}40` }}>
        <p className="font-semibold text-sm" style={{ color: info.color }}>阶段 {phase}：{info.label} / {info.labelEN}</p>
        <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-slate-400">{info.desc}</p>
      </div>

      <div className="rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
        <span className="font-semibold text-gray-900 dark:text-slate-100">为何需要细胞免疫：</span>
        布鲁氏菌通过T4SS阻断吞噬溶酶体融合，在BCV中逃逸杀菌。单纯体液免疫（抗体）无法清除胞内菌。
        活减毒疫苗可诱导CD4+/CD8+ T细胞和IFNγ通路，激活感染巨噬细胞杀菌能力，这是其保护优势的核心。
        IRF3基因多态性可影响不同个体的巨噬细胞清除效率，是疫苗效果个体差异的遗传基础。
      </div>
    </div>
  );
}
