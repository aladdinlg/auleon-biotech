"use client";

import { useEffect, useRef, useState } from "react";

import { MolstarViewer } from "@/components/bio/viewers/MolstarViewer";
import { Card } from "@/components/ui/Card";

interface DNAHelixProps {
  onInteracted?: () => void;
}

/** Period of the sinusoidal path in SVG user units */
const PERIOD = 200;

export function DNAHelix({ onInteracted }: DNAHelixProps): React.JSX.Element {
  const [unwindFactor, setUnwindFactor] = useState(0);
  /** scroll offset in SVG user units — drives the helix forward */
  const [scrollOffset, setScrollOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    function tick(timestamp: number): void {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      // ~60 SVG units per second scroll speed
      setScrollOffset((prev) => (prev + delta * 0.06) % PERIOD);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="space-y-5">
      {/* DNA 双螺旋 SVG 动画 */}
      <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900">
        <style>{`
          @keyframes bp-pulse { 0%,100%{opacity:.55}50%{opacity:1} }
          .bp-pulse-g { animation: bp-pulse 1.8s ease-in-out infinite; }
        `}</style>
        <svg viewBox="0 0 720 300" className="w-full h-full" aria-label="DNA 双螺旋示意图">
          <defs>
            <linearGradient id="dna-s1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2"/>
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="1"/>
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="1"/>
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2"/>
            </linearGradient>
            <linearGradient id="dna-s2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2"/>
              <stop offset="40%" stopColor="#a78bfa" stopOpacity="1"/>
              <stop offset="60%" stopColor="#a78bfa" stopOpacity="1"/>
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2"/>
            </linearGradient>
            <clipPath id="dna-clip"><rect x="0" y="0" width="720" height="300"/></clipPath>
          </defs>
          <g clipPath="url(#dna-clip)">
            {/* translate in SVG user units for exact seamless loop */}
            <g transform={`translate(${-scrollOffset}, 0)`}>
              {/* amp responds to unwindFactor: wider spread when unwinding */}
              {(() => {
                const amp = 62 + unwindFactor * 30;
                const cy = 150;
                const T = 200; // period px
                const k = 0.552;
                const segments = 6; // 1200 SVG units — covers 720 viewBox + 1 scroll period
                const totalW = T * segments;
                const buildPath = (phase0: number) => {
                  let d = ``;
                  for (let i = 0; i < segments; i++) {
                    const x0 = i * T;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const _y0 = cy + phase0 * amp * Math.sin(0);
                    if (i === 0) d += `M ${x0},${cy} `;
                    const cp1x = x0 + T * k / 2;
                    const cp2x = x0 + T * (1 - k / 2);
                    const sign = phase0;
                    d += `C ${cp1x},${cy + sign * amp} ${cp2x},${cy + sign * amp} ${x0 + T / 2},${cy} `;
                    d += `C ${cp1x + T / 2},${cy - sign * amp} ${cp2x + T / 2},${cy - sign * amp} ${x0 + T},${cy} `;
                  }
                  return d;
                };
                const basePairX = [50, 150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150];
                const basePairLabels = ["A", "T", "G", "C", "A", "T", "G", "A", "C", "G", "T", "A"];
                const bpColors: Record<string, string> = { A: "#6ee7b7", T: "#6ee7b7", G: "#fbbf24", C: "#fbbf24" };
                return (
                  <>
                    {/* Strand 1 */}
                    <path d={buildPath(1)} stroke="url(#dna-s1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    {/* Strand 2 - opposite phase */}
                    <path d={buildPath(-1)} stroke="url(#dna-s2)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    {/* Base pairs */}
                    {basePairX.map((bx, i) => {
                      const phaseInPeriod = ((bx % T) / T) * 2 * Math.PI;
                      const y1 = cy + Math.sin(phaseInPeriod + Math.PI / 2) * amp;
                      const y2 = cy - Math.sin(phaseInPeriod + Math.PI / 2) * amp;
                      const col = bpColors[basePairLabels[i]] ?? "#6ee7b7";
                      const label = basePairLabels[i];
                      const pair = label === "A" ? "A–T" : label === "T" ? "A–T" : "G–C";
                      return (
                        <g key={bx} className="bp-pulse-g" style={{ animationDelay: `${i * 0.15}s` }}>
                          <line x1={bx} y1={Math.min(y1, y2) + 8} x2={bx} y2={Math.max(y1, y2) - 8} stroke={col} strokeWidth="2" strokeDasharray="5,3"/>
                          <circle cx={bx} cy={y1} r="6" fill={col} opacity="0.9"/>
                          <circle cx={bx} cy={y2} r="6" fill={col} opacity="0.9"/>
                          <text x={bx + 8} y={(y1 + y2) / 2 + 4} fill={col} fontSize="9" fontFamily="monospace" opacity="0.85">{pair}</text>
                        </g>
                      );
                    })}
                    {/* void ref to totalW to avoid lint */}
                    <rect x={totalW} y={0} width={0} height={0} fill="none"/>
                  </>
                );
              })()}
            </g>
          </g>
          {/* Static labels */}
          <text x="18" y="24" fill="#94a3b8" fontSize="13" fontWeight="600" fontFamily="monospace">5&apos;</text>
          <text x="685" y="24" fill="#94a3b8" fontSize="13" fontWeight="600" fontFamily="monospace">3&apos;</text>
          <text x="18" y="290" fill="#94a3b8" fontSize="13" fontWeight="600" fontFamily="monospace">3&apos;</text>
          <text x="685" y="290" fill="#94a3b8" fontSize="13" fontWeight="600" fontFamily="monospace">5&apos;</text>
          {/* Legend */}
          <line x1="24" y1="140" x2="48" y2="140" stroke="#38bdf8" strokeWidth="3"/>
          <text x="52" y="144" fill="#7dd3fc" fontSize="11" fontFamily="sans-serif">骨架 1 Strand 1</text>
          <line x1="24" y1="160" x2="48" y2="160" stroke="#a78bfa" strokeWidth="3"/>
          <text x="52" y="164" fill="#c4b5fd" fontSize="11" fontFamily="sans-serif">骨架 2 Strand 2</text>
          <circle cx="26" cy="178" r="5" fill="#6ee7b7"/>
          <text x="34" y="182" fill="#6ee7b7" fontSize="11" fontFamily="sans-serif">A–T 碱基对</text>
          <circle cx="26" cy="196" r="5" fill="#fbbf24"/>
          <text x="34" y="200" fill="#fbbf24" fontSize="11" fontFamily="sans-serif">G–C 碱基对</text>
          {/* Unwind indicator */}
          <text x="520" y="285" fill="#64748b" fontSize="11" fontFamily="sans-serif">
            {`解旋程度 ${Math.round(unwindFactor * 100)}%`}
          </text>
        </svg>
      </div>

      <Card className="border-white/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">解旋滑块 Unwind Control</p>
            <p className="mt-1 text-xs text-slate-400">
              数值越大，两条糖-磷酸骨架越分离；解旋过程中会暂停整体自转。
            </p>
          </div>
          <p className="text-sm text-cyan-200">当前解旋程度：{Math.round(unwindFactor * 100)}%</p>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(unwindFactor * 100)}
          aria-label="双螺旋解旋程度，0 为完全缠绕，100 为完全分离"
          onChange={(event) => {
            onInteracted?.();
            setUnwindFactor(Number(event.target.value) / 100);
          }}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-400"
        />
      </Card>

      <Card className="border-white/10">
        <h3 className="text-xl font-semibold text-foreground">真实 B-DNA 十二聚体结构（PDB: 1BNA）</h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          上方是概念示意动画，下方是通过 X 射线晶体学解析的真实原子级结构。
        </p>
        <div className="mt-5">
          <MolstarViewer source={{ type: "pdb", pdbId: "1BNA" }} height={360} representation="ball_and_stick" />
        </div>
      </Card>
    </div>
  );
}
