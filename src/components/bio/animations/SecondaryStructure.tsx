"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface SecondaryStructureProps {
  onInteracted?: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 2] as const;

export function SecondaryStructure({ onInteracted }: SecondaryStructureProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"alpha" | "beta">("alpha");
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setPhase((current) => {
        const next = Math.min(1, current + 0.02 * speed);

        if (next >= 1) {
          setPlaying(false);
        }

        return next;
      });
    }, 40);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [playing, speed]);

  function resetScene(nextTab?: "alpha" | "beta"): void {
    onInteracted?.();
    setPlaying(false);
    setPhase(0);

    if (nextTab) {
      setActiveTab(nextTab);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTab === "alpha" ? "primary" : "secondary"}
          onClick={() => resetScene("alpha")}
        >
          α-螺旋 Alpha Helix
        </Button>
        <Button
          variant={activeTab === "beta" ? "primary" : "secondary"}
          onClick={() => resetScene("beta")}
        >
          β-折叠 Beta Sheet
        </Button>
      </div>

      {/* 二级结构 SVG — 根据 activeTab 切换 α-螺旋 / β-折叠 */}
      <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900">
        <style>{`
          @keyframes hbond-appear { from { stroke-dashoffset: 40; opacity: 0; } to { stroke-dashoffset: 0; opacity: 0.85; } }
          .hbond-line { stroke-dasharray: 6,4; animation: hbond-appear 0.6s ease-out forwards; }
        `}</style>
        <svg viewBox="0 0 720 340" className="w-full h-full" aria-label={activeTab === 'alpha' ? 'α-螺旋结构示意图' : 'β-折叠结构示意图'}>
          {activeTab === 'alpha' ? (
            <g>
              {/* α-螺旋: ribbon coil drawn as overlapping ellipses */}
              <text x="260" y="35" fill="#60a5fa" fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">α-螺旋 Alpha Helix</text>
              {/* Helical ribbon: series of rotated ellipses representing coil turns */}
              {Array.from({ length: 7 }).map((_, i) => {
                const y = 60 + i * 32;
                const opacity = phase < (i / 7) ? 0.15 : 1;
                return (
                  <g key={i} opacity={opacity} style={{ transition: 'opacity 0.3s' }}>
                    <ellipse cx="260" cy={y} rx="60" ry="14" fill="none" stroke="#3b82f6" strokeWidth="9" strokeOpacity="0.85"/>
                    {i > 0 && (
                      <line
                        x1="200" y1={y - 14}
                        x2="200" y2={y - 18}
                        stroke="#f97316" strokeWidth="1.5"
                        strokeDasharray="5,3"
                        className="hbond-line"
                        style={{ animationDelay: `${i * 0.08}s` }}
                      />
                    )}
                  </g>
                );
              })}
              {/* Axis line */}
              <line x1="260" y1="52" x2="260" y2="286" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="6,4" opacity="0.5"/>
              {/* H-bond legend */}
              <g transform="translate(370, 100)">
                <rect x="0" y="0" width="280" height="155" rx="12" fill="rgba(15,23,42,0.8)" stroke="#1e3a5f" strokeWidth="1"/>
                <text x="16" y="28" fill="#93c5fd" fontSize="13" fontWeight="700" fontFamily="sans-serif">α-螺旋特征</text>
                <line x1="16" y1="44" x2="30" y2="44" stroke="#3b82f6" strokeWidth="4"/>
                <text x="36" y="48" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">多肽主链螺旋卷绕</text>
                <line x1="16" y1="64" x2="30" y2="64" stroke="#f97316" strokeWidth="2" strokeDasharray="5,3"/>
                <text x="36" y="68" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">氢键（i ↔ i+4 残基）</text>
                <text x="16" y="92" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">• 每圈 3.6 个氨基酸</text>
                <text x="16" y="112" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">• 螺距 0.54 nm</text>
                <text x="16" y="132" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">• 右手螺旋结构</text>
              </g>
              {/* Direction labels */}
              <text x="330" y="64" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">N 端 →</text>
              <text x="330" y="290" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">← C 端</text>
            </g>
          ) : (
            <g>
              {/* β-折叠: parallel arrows */}
              <text x="340" y="35" fill="#34d399" fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">β-折叠片 Beta Sheet</text>
              {[0, 1, 2, 3].map((row) => {
                const y = 70 + row * 58;
                const isParallel = row % 2 === 0;
                const x1 = isParallel ? 60 : 420;
                const x2 = isParallel ? 400 : 80;
                const arrowDir = isParallel ? 1 : -1;
                const opacity = phase < (row / 4) ? 0.1 : 1;
                return (
                  <g key={row} opacity={opacity} style={{ transition: 'opacity 0.3s' }}>
                    {/* Strand arrow */}
                    <line x1={x1} y1={y + 12} x2={x2 - arrowDir * 20} y2={y + 12} stroke="#10b981" strokeWidth="12" strokeLinecap="round" strokeOpacity="0.85"/>
                    <polygon
                      points={isParallel
                        ? `${x2 - 20},${y} ${x2},${y + 12} ${x2 - 20},${y + 24}`
                        : `${x2 + 20},${y} ${x2},${y + 12} ${x2 + 20},${y + 24}`}
                      fill="#10b981" opacity="0.9"
                    />
                    {/* H-bonds to previous strand */}
                    {row > 0 && [100,160,220,280,340].map((hx) => (
                      <line
                        key={hx}
                        x1={hx} y1={y - 18}
                        x2={hx} y2={y - 4}
                        stroke="#f97316" strokeWidth="1.5"
                        className="hbond-line"
                        style={{ animationDelay: `${row * 0.1 + hx * 0.001}s` }}
                      />
                    ))}
                    {/* Residue label */}
                    <text
                      x={isParallel ? 80 : 420}
                      y={y + 8}
                      fill="#6ee7b7"
                      fontSize="10"
                      fontFamily="monospace"
                    >{isParallel ? 'N→C' : 'C→N'}</text>
                  </g>
                );
              })}
              {/* Legend */}
              <g transform="translate(440, 100)">
                <rect x="0" y="0" width="250" height="155" rx="12" fill="rgba(15,23,42,0.8)" stroke="#1e3a5f" strokeWidth="1"/>
                <text x="16" y="28" fill="#6ee7b7" fontSize="13" fontWeight="700" fontFamily="sans-serif">β-折叠特征</text>
                <rect x="16" y="38" width="22" height="10" rx="2" fill="#10b981" opacity="0.85"/>
                <text x="44" y="48" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">β-链（箭头=N→C）</text>
                <line x1="16" y1="68" x2="32" y2="68" stroke="#f97316" strokeWidth="2" strokeDasharray="5,3"/>
                <text x="40" y="72" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">链间氢键</text>
                <text x="16" y="96" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">• 平行 / 反平行排列</text>
                <text x="16" y="116" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">• 侧链交替朝向两侧</text>
                <text x="16" y="136" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">• 比α螺旋更伸展</text>
              </g>
            </g>
          )}
          {/* Progress overlay */}
          <text x="20" y="330" fill="#475569" fontSize="10" fontFamily="sans-serif">{`演示进度 ${Math.round(phase * 100)}%`}</text>
        </svg>
      </div>

      <Card className="border-white/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">二级结构演示控制</p>
            <p className="mt-1 text-xs text-slate-400">
              可以播放、暂停或重置当前动画，并观察氢键如何逐步稳定结构。
            </p>
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
            <Button variant="secondary" size="sm" onClick={() => resetScene()}>
              重置
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {SPEED_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={speed === option ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  onInteracted?.();
                  setSpeed(option);
                }}
              >
                {option}x
              </Button>
            ))}
          </div>
          <p className={cn("text-sm", phase >= 1 ? "text-emerald-300" : "text-slate-300")}>
            当前进度 {Math.round(phase * 100)}%
          </p>
        </div>
      </Card>
    </div>
  );
}
