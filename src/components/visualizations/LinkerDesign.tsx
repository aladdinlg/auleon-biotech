'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MonomerProps { x: number; y: number; label?: string; dim?: boolean }

function EG95Unit({ x, y, label, dim }: MonomerProps) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: dim ? 0.35 : 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <circle cx={x} cy={y} r={22} fill={dim ? '#64748b' : '#0d9488'} fillOpacity={0.25} stroke={dim ? '#64748b' : '#0d9488'} strokeWidth={2} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill={dim ? '#94a3b8' : '#0d9488'} fontWeight="bold">
        EG95
      </text>
      {label && (
        <text x={x} y={y + 30} textAnchor="middle" fontSize={7} fill="#94a3b8">{label}</text>
      )}
    </motion.g>
  );
}

function Linker({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4,2" />
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" fontSize={6} fill="#f59e0b">(GGGGS)₂</text>
    </motion.g>
  );
}

function BCR({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <motion.g
      animate={{ y: active ? y - 15 : y, opacity: active ? 1 : 0.6 }}
      transition={{ duration: 0.6 }}
      style={{ translateY: 0 }}
    >
      {/* Y-shape antibody */}
      <line x1={x} y1={0} x2={x} y2={25} stroke={active ? '#3b82f6' : '#94a3b8'} strokeWidth={3} />
      <line x1={x} y1={25} x2={x - 18} y2={45} stroke={active ? '#3b82f6' : '#94a3b8'} strokeWidth={3} />
      <line x1={x} y1={25} x2={x + 18} y2={45} stroke={active ? '#3b82f6' : '#94a3b8'} strokeWidth={3} />
      {/* CDR tips */}
      <circle cx={x - 18} cy={45} r={5} fill={active ? '#3b82f6' : '#64748b'} />
      <circle cx={x + 18} cy={45} r={5} fill={active ? '#3b82f6' : '#64748b'} />
      <text x={x} y={-6} textAnchor="middle" fontSize={7} fill={active ? '#3b82f6' : '#94a3b8'}>
        {active ? 'IgG' : 'BCR'}
      </text>
    </motion.g>
  );
}

export function LinkerDesign() {
  const [mode, setMode] = useState<'monomer' | 'tetramer'>('monomer');
  const [phase, setPhase] = useState<'approach' | 'crosslink' | 'avidity'>('approach');

  const isTetramer = mode === 'tetramer';

  const nextPhase = () => {
    if (phase === 'approach') setPhase('crosslink');
    else if (phase === 'crosslink') setPhase('avidity');
    else { setPhase('approach'); }
  };

  const titers = { monomer: 35, tetramer: 95 };

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">EG95 接头设计与多价亲合力效应</h3>
        <p className="mt-0.5 text-xs text-gray-400">Linker Design &amp; Avidity Effect · (GGGGS)₂ 柔性接头 + B细胞受体多位点交联</p>
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2 justify-center">
        {(['monomer', 'tetramer'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setPhase('approach'); }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${mode === m ? 'bg-teal-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-400'}`}
          >
            {m === 'monomer' ? '单体 Monomer' : '四聚体 Tetramer'}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Animation SVG */}
        <div className="rounded-xl border border-gray-200 bg-slate-950 dark:border-slate-700 overflow-hidden">
          <svg viewBox="0 0 280 200" className="w-full">
            {/* Antigen(s) */}
            {!isTetramer ? (
              <EG95Unit x={140} y={130} label="单体（5% TPC）" dim={false} />
            ) : (
              <g>
                <EG95Unit x={70} y={130} label="aa 51-79" />
                <EG95Unit x={130} y={130} />
                <EG95Unit x={190} y={130} />
                <EG95Unit x={250} y={130} label="aa 51-79" />
                <Linker x1={92} y1={130} x2={108} y2={130} />
                <Linker x1={152} y1={130} x2={168} y2={130} />
                <Linker x1={212} y1={130} x2={228} y2={130} />
                {/* Bracket */}
                <text x={160} y={165} textAnchor="middle" fontSize={7} fill="#f59e0b">四聚体 ~40% TPC</text>
              </g>
            )}

            {/* BCR / antibody */}
            <g transform={`translate(0, ${phase === 'approach' ? 20 : phase === 'crosslink' ? 35 : 38})`}>
              <AnimatePresence>
                {!isTetramer ? (
                  <BCR x={140} y={0} active={phase !== 'approach'} />
                ) : (
                  <>
                    <BCR x={100} y={0} active={phase !== 'approach'} />
                    <BCR x={210} y={0} active={phase !== 'approach'} />
                  </>
                )}
              </AnimatePresence>
            </g>

            {/* Avidity indicator */}
            {phase === 'avidity' && (
              <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                <rect x={60} y={160} width={160} height={22} rx={5} fill="#0d9488" fillOpacity={0.2} stroke="#0d9488" />
                <text x={140} y={174} textAnchor="middle" fontSize={9} fill="#0d9488" fontWeight="bold">
                  亲合力成熟 Avidity ↑↑{isTetramer ? ' ~20×' : ''}
                </text>
              </motion.g>
            )}
          </svg>
        </div>

        {/* Controls + bar chart */}
        <div className="space-y-3">
          <button
            onClick={nextPhase}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {phase === 'approach' ? '▶ BCR 靠近抗原' : phase === 'crosslink' ? '→ 多位点交联' : '↺ 重新演示'}
          </button>

          {/* Titer bar chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-xs font-medium text-gray-600 dark:text-slate-400">免疫后 IgG 抗体滴度对比</p>
            {(['monomer', 'tetramer'] as const).map((m) => (
              <div key={m} className="mb-2">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-slate-400">{m === 'monomer' ? '单体' : '四聚体'}</span>
                  <span className="font-bold text-teal-600">{titers[m]}%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-slate-700">
                  <motion.div
                    className="h-4 rounded-full bg-teal-600"
                    animate={{ width: `${titers[m]}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            ))}
            <p className="mt-2 text-xs text-gray-400">四聚体 IgG 滴度约为单体的 2.7×（ELISA 1:800 vs 1:220）</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
        <span className="font-semibold text-gray-900 dark:text-slate-100">(GGGGS)₂ 接头作用：</span>
        提供约15Å臂长空间自由度，防止相邻EG95单元β折叠片间的二级结构干扰，保证每个单元独立正确折叠。
        四聚体多价结构提供4个同时的B细胞受体交联位点，激活亲合力成熟通路，记忆B细胞寿命显著延长，
        同时E.coli总蛋白表达量从~5%提升至~40%（理论约8倍增益）。
      </div>
    </div>
  );
}
