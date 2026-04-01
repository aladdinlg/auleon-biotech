"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface BindingMechanismDemoProps {
  mode: "lock-key" | "induced-fit" | "antigen-antibody";
  title: string;
  description: string;
  onInteracted?: () => void;
}

interface EnzymeBindingProps {
  onInteracted?: () => void;
}

export function BindingMechanismDemo({
  mode,
  title,
  description,
  onInteracted,
}: BindingMechanismDemoProps): React.JSX.Element {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setPhase((current) => {
        const next = current + 0.02;

        if (next >= 1) {
          setPlaying(false);
          return 1;
        }

        return next;
      });
    }, 40);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [playing]);

  function reset(): void {
    onInteracted?.();
    setPlaying(false);
    setPhase(0);
  }

  // ── visual parameters differ per mode ──────────────────────────────
  // lock-and-key: cleft is FIXED, substrate slides straight in
  // induced-fit:  cleft starts narrow, opens then snaps shut
  // antigen-antibody: EG95 antigen body (enzyme) + IgG Fab fragment (substrate)
  const isLockKey = mode === "lock-key";
  const isAntigenAb = mode === "antigen-antibody";

  // Lock-key: fixed opening that perfectly fits the substrate from the start
  // Induced-fit: opens up as substrate approaches, then closes at phase≈0.9
  const cleftW = isLockKey
    ? 30 // constant — already the right shape
    : 10 + (phase < 0.75 ? phase * 40 : (1 - phase) * 40 + 30); // opens then closes

  const enzX = 280;
  const enzY = 150;

  // Substrate approach path
  const subStartX = 580;
  const subDockedX = 280;
  const subX = subStartX - phase * (subStartX - subDockedX);
  // lock-key: straight horizontal slide; induced-fit: diagonal dip into cleft
  const subY = isLockKey ? 78 : 80 + phase * 60;
  const isNearDocked = phase > 0.8;

  // Status text
  const statusText = isAntigenAb
    ? (phase < 0.4 ? "IgG Fab 片段靠近 EG95 抗原…" : phase < 0.8 ? "CDR 接触抗原决定簇 (aa 51-79)…" : "抗原-抗体复合物形成 ✓")
    : isLockKey
    ? (phase < 0.5 ? "底物靠近…" : phase < 0.9 ? "几何完美匹配中…" : "锁钥结合完成 ✓")
    : (phase < 0.4 ? "底物靠近中…" : phase < 0.8 ? "构象诱导变化中…" : "酶-底物复合物形成 ✓");

  const statusColor = phase < (isLockKey ? 0.5 : 0.4)
    ? "#94a3b8"
    : phase < (isLockKey ? 0.9 : 0.8)
    ? "#f59e0b"
    : "#34d399";

  return (
    <div className="space-y-5">
      {/* 酶结合 SVG 动画 */}
      <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900">
        <svg viewBox="0 0 720 300" className="w-full h-full" aria-label="酶与底物结合示意图">
          {/* Enzyme body */}
          <path
            d={`M ${enzX - 100},${enzY - 70} Q ${enzX - 60},${enzY - 90} ${enzX},${enzY - 80} Q ${enzX + 70},${enzY - 70} ${enzX + 90},${enzY - 20} Q ${enzX + 100},${enzY + 20} ${enzX + 80},${enzY + 60} Q ${enzX + 40},${enzY + 90} ${enzX},${enzY + 80} Q ${enzX - 60},${enzY + 90} ${enzX - 90},${enzY + 50} Q ${enzX - 110},${enzY + 10} ${enzX - 100},${enzY - 70} Z`}
            fill="#1d4ed8"
            fillOpacity="0.75"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          {/* Active site cleft */}
          <path
            d={`M ${enzX - cleftW},${enzY - 80} Q ${enzX},${isLockKey ? enzY - 55 : enzY - 30 + phase * 20} ${enzX + cleftW},${enzY - 80}`}
            fill="#020617"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <text x={enzX} y={enzY + 10} fill="#bfdbfe" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">{isAntigenAb ? "EG95 抗原 Antigen" : "酶 Enzyme"}</text>
          <text x={enzX} y={enzY + 28} fill="#93c5fd" fontSize="10" textAnchor="middle" fontFamily="sans-serif">{isAntigenAb ? "抗原决定簇 Epitope (aa 51-79) ↑" : "活性位点 ↑"}</text>

          {/* Substrate / Fab fragment */}
          <ellipse
            cx={subX}
            cy={subY}
            rx="28"
            ry="22"
            fill={isAntigenAb ? (isNearDocked ? '#1d4ed8' : '#3b82f6') : (isNearDocked ? '#059669' : '#10b981')}
            fillOpacity="0.85"
            stroke={isAntigenAb ? (isNearDocked ? '#60a5fa' : '#93c5fd') : (isNearDocked ? '#34d399' : '#6ee7b7')}
            strokeWidth="2"
          />
          <text x={subX} y={subY + 4} fill={isAntigenAb ? "#dbeafe" : "#022c22"} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">{isAntigenAb ? "IgG Fab" : "底物"}</text>
          {/* Approach arrow */}
          {phase < 0.9 && (
            <g opacity={1 - phase}>
              <line x1={subX + 35} y1={subY} x2={subX + 70} y2={subY} stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="5,3"/>
              <polygon points={`${subX + 35},${subY - 4} ${subX + 25},${subY} ${subX + 35},${subY + 4}`} fill="#6ee7b7"/>
            </g>
          )}
          {/* Docked: H-bond indicators or CDR contacts */}
          {phase > 0.85 && (
            <g opacity={(phase - 0.85) / 0.15}>
              {[enzX - 15, enzX, enzX + 15].map((hx, i) => (
                <line key={i} x1={hx} y1={68} x2={hx} y2={80} stroke={isAntigenAb ? "#60a5fa" : "#f59e0b"} strokeWidth="1.5" strokeDasharray="3,3"/>
              ))}
              <text x="340" y="65" fill={isAntigenAb ? "#93c5fd" : "#fbbf24"} fontSize="10" fontFamily="sans-serif">{isAntigenAb ? "CDR 接触 H-bond" : "氢键 H-bond"}</text>
            </g>
          )}

          {/* Mode indicator box */}
          <g transform="translate(490, 150)">
            <rect x="0" y="-50" width="205" height="105" rx="10" fill="rgba(15,23,42,0.85)" stroke="#1e3a5f"/>
            {isAntigenAb ? (
              <>
                <text x="10" y="-28" fill="#f1f5f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">抗原-抗体结合</text>
                <text x="10" y="-10" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Antigen-Antibody Binding</text>
                <text x="10" y="12" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">EG95表位 aa 51-79</text>
                <text x="10" y="28" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">IgG Fab CDR 三环接触</text>
              </>
            ) : isLockKey ? (
              <>
                <text x="10" y="-28" fill="#f1f5f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">锁钥模型</text>
                <text x="10" y="-10" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Lock-and-Key Model</text>
                <text x="10" y="12" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">活性位点形状固定不变</text>
                <text x="10" y="28" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">底物几何精确互补</text>
              </>
            ) : (
              <>
                <text x="10" y="-28" fill="#f1f5f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">诱导契合学说</text>
                <text x="10" y="-10" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Induced-Fit Model</text>
                <text x="10" y="12" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">底物接近时酶构象改变</text>
                <text x="10" y="28" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">活性位点弹性适应底物</text>
              </>
            )}
            {/* Progress bar */}
            <rect x="10" y="42" width="180" height="6" rx="3" fill="#1e293b"/>
            <rect x="10" y="42" width={phase * 180} height="6" rx="3" fill="#10b981"/>
          </g>

          {/* Status text */}
          <text x="360" y="240"
            fill={statusColor}
            fontSize="13" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            {statusText}
          </text>
        </svg>
      </div>

      <Card className="border-white/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
            <p className="mt-2 text-xs text-slate-400">进度 {Math.round(phase * 100)}%</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                onInteracted?.();
                setPlaying((current) => !current);
              }}
            >
              {playing ? "暂停" : "播放"}
            </Button>
            <Button variant="secondary" size="sm" onClick={reset}>
              重置
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function EnzymeBinding({ onInteracted }: EnzymeBindingProps): React.JSX.Element {
  return (
    <BindingMechanismDemo
      mode="lock-key"
      title="锁钥模型 Lock & Key Model"
      description="底物和活性位点的几何互补性非常高，因此从最初接触开始就像一把匹配的钥匙。"
      onInteracted={onInteracted}
    />
  );
}
