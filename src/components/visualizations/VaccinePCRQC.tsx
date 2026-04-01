/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// PCR cycle phases
type Phase = 'denaturation' | 'annealing' | 'extension' | 'idle';

const PHASE_TEMPS: Record<Phase, number> = {
  denaturation: 95,
  annealing: 60,
  extension: 72,
  idle: 25,
};

const PHASE_COLORS: Record<Phase, string> = {
  denaturation: '#ef4444',
  annealing: '#3b82f6',
  extension: '#22c55e',
  idle: '#94a3b8',
};

const PHASE_LABELS: Record<Phase, { zh: string; en: string; desc: string }> = {
  denaturation: { zh: '变性 Denaturation (95°C)', en: 'Denaturation', desc: '95°C：双链DNA解链为单链' },
  annealing:    { zh: '退火 Annealing — EG95引物', en: 'Annealing',    desc: '60°C：EG95引物与模板特异性结合' },
  extension:    { zh: '延伸 Extension — 扩增抗原基因片段', en: 'Extension',    desc: '72°C：Taq聚合酶扩增抗原基因片段' },
  idle:         { zh: '待机', en: 'Idle',         desc: '初始/最终保持温度' },
};

const CYCLE_SEQUENCE: Phase[] = ['denaturation', 'annealing', 'extension'];

// qPCR amplification: Rn = 1 + (E^n) scaled
function amplificationRn(cycle: number, efficiency: number, threshold: number): number {
  if (cycle <= 0) return 0.01;
  const raw = 0.01 * Math.pow(1 + efficiency, cycle);
  return Math.min(raw, 1.0); // plateau at 1.0
}

function getCt(efficiency: number, threshold: number): number {
  // n where 0.01*(1+E)^n = threshold → n = log(threshold/0.01)/log(1+E)
  return Math.log(threshold / 0.01) / Math.log(1 + efficiency);
}

export function VaccinePCRQC() {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<Phase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [phaseStep, setPhaseStep] = useState(0);
  const [efficiency, setEfficiency] = useState(0.95);
  const [threshold, setThreshold] = useState(0.2);
  const [maxCycles] = useState(40);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  // Auto-advance phases
  const advance = useCallback(() => {
    setPhaseStep(prev => {
      const nextStep = (prev + 1) % CYCLE_SEQUENCE.length;
      setCurrentPhase(CYCLE_SEQUENCE[nextStep]);
      if (nextStep === 0) {
        setCurrentCycle(c => {
          if (c + 1 >= maxCycles) {
            setIsRunning(false);
            setCurrentPhase('idle');
            return c;
          }
          return c + 1;
        });
      }
      return nextStep;
    });
  }, [maxCycles]);

  useEffect(() => {
    if (!isRunning) return;
    animRef.current = setTimeout(advance, 700);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [isRunning, advance, phaseStep]);

  const reset = () => {
    if (animRef.current) clearTimeout(animRef.current);
    setIsRunning(false);
    setCurrentCycle(0);
    setCurrentPhase('idle');
    setPhaseStep(0);
  };

  const ct = getCt(efficiency, threshold);
  const currentRn = amplificationRn(currentCycle, efficiency, threshold);

  // Chart dimensions
  const cW = 340, cH = 160;
  const padL = 35, padB = 25, padR = 10, padT = 10;
  const plotW = cW - padL - padR;
  const plotH = cH - padT - padB;

  // Generate amplification curve points
  const points = Array.from({ length: maxCycles + 1 }, (_, i) => {
    const rn = amplificationRn(i, efficiency, threshold);
    const x = padL + (i / maxCycles) * plotW;
    const y = padT + plotH - rn * plotH;
    return `${x},${y}`;
  }).join(' ');

  // Current cycle marker
  const markerX = padL + (currentCycle / maxCycles) * plotW;
  const markerY = padT + plotH - Math.min(currentRn, 1) * plotH;

  // Threshold line Y
  const threshY = padT + plotH - threshold * plotH;

  return (
    <div className="space-y-5 p-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">疫苗批次PCR质控 / Vaccine Batch PCR QC</h3>
        <p className="mt-0.5 text-xs text-gray-400">Vaccine Batch PCR Quality Control · 实时热循环与qPCR扩增曲线</p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Left: thermal cycler visual */}
        <div className="flex flex-col items-center gap-3">
          {/* Temperature display */}
          <div
            className="flex h-32 w-48 flex-col items-center justify-center rounded-2xl transition-all duration-500"
            style={{ backgroundColor: PHASE_COLORS[currentPhase] + '22', border: `2px solid ${PHASE_COLORS[currentPhase]}` }}
          >
            <div className="text-4xl font-bold" style={{ color: PHASE_COLORS[currentPhase] }}>
              {PHASE_TEMPS[currentPhase]}°C
            </div>
            <div className="mt-1 text-sm font-semibold" style={{ color: PHASE_COLORS[currentPhase] }}>
              {PHASE_LABELS[currentPhase].zh} {PHASE_LABELS[currentPhase].en}
            </div>
            <div className="mt-1 text-center text-xs text-gray-500 dark:text-slate-400 px-3">
              {PHASE_LABELS[currentPhase].desc}
            </div>
          </div>

          {/* Cycle counter */}
          <div className="flex items-center gap-4 rounded-xl bg-gray-50 px-5 py-3 dark:bg-slate-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{currentCycle}</div>
              <div className="text-xs text-gray-400">循环 Cycle</div>
            </div>
            <div className="h-10 w-px bg-gray-200 dark:bg-slate-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(Math.pow(2, currentCycle)).toLocaleString()}</div>
              <div className="text-xs text-gray-400">拷贝数</div>
            </div>
          </div>

          {/* Phase indicator dots */}
          <div className="flex gap-3">
            {CYCLE_SEQUENCE.map((p, _i) => (
              <div key={p} className="flex flex-col items-center gap-1">
                <div
                  className="h-4 w-4 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: currentPhase === p ? PHASE_COLORS[p] : PHASE_COLORS[p] + '44',
                    transform: currentPhase === p ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
                <span className="text-[9px] text-gray-400">{PHASE_LABELS[p].zh}</span>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(r => !r)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRunning ? '⏸ 暂停' : currentCycle > 0 ? '▶ 继续' : '▶ 启动'}
            </button>
            <button onClick={reset}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300">
              ↺ 重置
            </button>
          </div>
        </div>

        {/* Right: amplification curve + DNA schematic */}
        <div className="flex-1 space-y-4">
          {/* qPCR amplification curve */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-600 dark:text-slate-400">qPCR扩增曲线 Amplification Curve</p>
            <svg ref={chartRef} viewBox={`0 0 ${cW} ${cH}`} className="w-full rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              {/* Grid lines */}
              {[0.25, 0.5, 0.75, 1.0].map(v => {
                const y = padT + plotH - v * plotH;
                return <line key={v} x1={padL} y1={y} x2={cW - padR} y2={y} stroke="#e5e7eb" strokeWidth={0.5} strokeDasharray="3,2" />;
              })}
              {/* X grid */}
              {[10, 20, 30, 40].map(c => {
                const x = padL + (c / maxCycles) * plotW;
                return <line key={c} x1={x} y1={padT} x2={x} y2={padT + plotH} stroke="#e5e7eb" strokeWidth={0.5} strokeDasharray="3,2" />;
              })}

              {/* Threshold line */}
              <line x1={padL} y1={threshY} x2={cW - padR} y2={threshY} stroke="#f59e0b" strokeWidth={1} strokeDasharray="5,3" />
              <text x={padL + 2} y={threshY - 3} fontSize={7} fill="#f59e0b">Ct阈值</text>

              {/* Ct vertical line */}
              {ct <= maxCycles && (
                <>
                  <line x1={padL + (ct / maxCycles) * plotW} y1={padT} x2={padL + (ct / maxCycles) * plotW} y2={padT + plotH} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3,2" />
                  <text x={padL + (ct / maxCycles) * plotW + 2} y={padT + 12} fontSize={7} fill="#f59e0b">Ct={ct.toFixed(1)}</text>
                </>
              )}

              {/* Amplification curve */}
              <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth={1.5} />

              {/* Current position marker */}
              {currentCycle > 0 && (
                <>
                  <line x1={markerX} y1={padT} x2={markerX} y2={padT + plotH} stroke="#ef4444" strokeWidth={1} />
                  <circle cx={markerX} cy={markerY} r={3} fill="#ef4444" />
                </>
              )}

              {/* Axes */}
              <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
              <line x1={padL} y1={padT + plotH} x2={cW - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />

              {/* Axis labels */}
              {[10, 20, 30, 40].map(c => (
                <text key={c} x={padL + (c / maxCycles) * plotW} y={cH - 5} fontSize={7} fill="#9ca3af" textAnchor="middle">{c}</text>
              ))}
              {[0, 0.5, 1.0].map(v => (
                <text key={v} x={padL - 2} y={padT + plotH - v * plotH + 3} fontSize={7} fill="#9ca3af" textAnchor="end">{v.toFixed(1)}</text>
              ))}
              <text x={cW / 2} y={cH} fontSize={7} fill="#9ca3af" textAnchor="middle">循环数 Cycle</text>
              <text x={8} y={cH / 2} fontSize={7} fill="#9ca3af" textAnchor="middle" transform={`rotate(-90,8,${cH / 2})`}>Rn (荧光)</text>
            </svg>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
                <span>扩增效率 E</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{(efficiency * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min={0.7} max={1.0} step={0.01} value={efficiency}
                onChange={e => { setEfficiency(Number(e.target.value)); reset(); }}
                className="w-full accent-blue-600" />
              <div className="text-[9px] text-gray-400">理想值100%（每循环倍增）</div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
                <span>检测阈值</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{threshold.toFixed(2)}</span>
              </div>
              <input type="range" min={0.05} max={0.5} step={0.01} value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="w-full accent-amber-600" />
              <div className="text-[9px] text-gray-400">Ct = {ct.toFixed(1)} 循环</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/30">
          <p className="text-xs font-semibold text-red-700 dark:text-red-300">变性 95°C</p>
          <p className="mt-1 text-xs leading-4 text-red-600 dark:text-red-400">氢键断裂，dsDNA→2×ssDNA。Tm约95°C（GC含量依赖）</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">退火 55-65°C</p>
          <p className="mt-1 text-xs leading-4 text-blue-600 dark:text-blue-400">引物（20-30bp）与模板互补结合，Tm-5°C为最优退火温度</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3 dark:bg-green-950/30">
          <p className="text-xs font-semibold text-green-700 dark:text-green-300">延伸 72°C</p>
          <p className="mt-1 text-xs leading-4 text-green-600 dark:text-green-400">Taq聚合酶最适温度，速率约1kb/min，5&apos;→3&apos;方向合成</p>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
        <span className="font-semibold text-gray-900 dark:text-slate-100">Ct值意义：</span>
        Ct = log(N₀)/log(1+E) × 常数，初始模板量越多Ct越小。临床诊断（如SARS-CoV-2）：Ct≤30阳性，Ct≥37阴性，30-37为弱阳性灰区。
        dPCR无需标准曲线，直接计数阳性液滴比例（泊松分布），检测灵敏度达0.01%突变等位基因频率。
      </div>
    </div>
  );
}
