"use client";

import { useEffect, useState } from "react";

import { PlaybackControls } from "@/components/bio/animations/PlaybackControls";
import { Card } from "@/components/ui/Card";

interface TranslationSceneProps {
  onInteracted?: () => void;
}

const STEP_LABELS = ["核糖体组装", "起始密码子识别", "肽链延伸", "终止", "蛋白质释放"] as const;
const MRNA_CODONS = ["AUG", "GCU", "UAC", "GAA", "UGA"] as const;

export function TranslationScene({ onInteracted }: TranslationSceneProps): React.JSX.Element {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setPhase((current) => {
        const next = current + 0.028 * speed;

        if (next < 1) {
          return next;
        }

        setStep((currentStep) => {
          if (currentStep >= STEP_LABELS.length - 1) {
            setPlaying(false);
            return currentStep;
          }

          return currentStep + 1;
        });

        return 0;
      });
    }, 50);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [playing, speed]);

  function moveToStep(nextStep: number): void {
    onInteracted?.();
    setPlaying(false);
    setPhase(0);
    setStep(Math.max(0, Math.min(STEP_LABELS.length - 1, nextStep)));
  }

  /* phase used below to smoothly interpolate ribosome position */
  // (consumed in ribosome transform via ribosomeOffset below)
  const ribosomeOffset = step >= 1 ? (Math.min(step - 1, MRNA_CODONS.length - 1) + phase) : 0;

  return (
    <div className="space-y-5">
      {/* 翻译过程 SVG 动画 */}
      <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900">
        <svg viewBox="0 0 720 300" className="w-full h-full" aria-label="翻译过程示意图">
          {/* mRNA strand across middle */}
          <line x1="40" y1="220" x2="680" y2="220" stroke="#34d399" strokeWidth="4" strokeLinecap="round"/>
          <text x="42" y="240" fill="#34d399" fontSize="11" fontFamily="sans-serif">mRNA 5&apos;→3&apos;</text>
          {/* mRNA codons */}
          {MRNA_CODONS.map((codon, i) => (
            <g key={codon}>
              <rect x={80 + i * 100} y={202} width={80} height={22} rx={4} fill={i === Math.min(step, MRNA_CODONS.length - 1) ? '#065f46' : '#1e3a2a'} opacity="0.9"/>
              <text x={80 + i * 100 + 40} y={217} fill={i === Math.min(step, MRNA_CODONS.length - 1) ? '#6ee7b7' : '#34d399'} fontSize="12" fontWeight="700" fontFamily="monospace" textAnchor="middle">{codon}</text>
            </g>
          ))}

          {/* Ribosome body: large subunit (top) + small subunit (bottom), positioned at active codon */}
          {step >= 1 && (
            <g transform={`translate(${Math.min(ribosomeOffset, MRNA_CODONS.length - 1) * 100}, 0)`}>
              {/* Large 60S subunit */}
              <ellipse cx="200" cy="155" rx="80" ry="45" fill="#1d4ed8" opacity="0.85"/>
              <text x="200" y="159" fill="#bfdbfe" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">60S 大亚基</text>
              {/* Small 40S subunit */}
              <ellipse cx="200" cy="212" rx="65" ry="25" fill="#1e40af" opacity="0.85"/>
              <text x="200" y="216" fill="#bfdbfe" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">40S 小亚基</text>
              {/* A-site tRNA when in elongation */}
              {step === 2 && (
                <g>
                  <rect x="195" y="80" width="30" height="60" rx="6" fill="#f59e0b" opacity="0.9"/>
                  <text x="210" y="108" fill="#1c1917" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="monospace">tRNA</text>
                  <text x="210" y="122" fill="#1c1917" fontSize="9" textAnchor="middle" fontFamily="monospace">A位</text>
                </g>
              )}
              {step === 2 && (
                <g>
                  {/* P-site tRNA */}
                  <rect x="150" y="83" width="28" height="55" rx="5" fill="#10b981" opacity="0.8"/>
                  <text x="164" y="109" fill="#022c22" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="monospace">tRNA</text>
                  <text x="164" y="122" fill="#022c22" fontSize="9" textAnchor="middle" fontFamily="monospace">P位</text>
                </g>
              )}
            </g>
          )}

          {/* Growing polypeptide chain */}
          {step >= 2 && (
            <g>
              <text x="42" y="50" fill="#f9a8d4" fontSize="11" fontFamily="sans-serif">多肽链 Polypeptide</text>
              {Array.from({ length: Math.min(step - 1, MRNA_CODONS.length - 1) }).map((_, i) => (
                <g key={i}>
                  <circle cx={60 + i * 36} cy={70} r={14} fill="#be185d" opacity="0.85"/>
                  <text x={60 + i * 36} y={74} fill="#fce7f3" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="monospace">
                    {["Met","Ala","Tyr","Glu"][i] ?? "aa"}
                  </text>
                  {i > 0 && <line x1={60 + (i - 1) * 36 + 14} y1={70} x2={60 + i * 36 - 14} y2={70} stroke="#f9a8d4" strokeWidth="2"/>}
                </g>
              ))}
            </g>
          )}

          {/* Step labels */}
          <rect x="400" y="30" width="280" height="90" rx="10" fill="rgba(30,41,59,0.7)"/>
          <text x="420" y="52" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">当前步骤</text>
          <text x="420" y="72" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="sans-serif">{STEP_LABELS[step]}</text>
          <text x="420" y="92" fill="#64748b" fontSize="10" fontFamily="sans-serif">{`步骤 ${step + 1} / ${STEP_LABELS.length}`}</text>
          {step === 4 && (
            <text x="420" y="112" fill="#34d399" fontSize="12" fontWeight="700" fontFamily="sans-serif">✓ 翻译完成</text>
          )}
        </svg>
      </div>

      <PlaybackControls
        step={step + 1}
        totalSteps={STEP_LABELS.length}
        stepLabel={STEP_LABELS[step]}
        playing={playing}
        speed={speed}
        onTogglePlay={() => {
          onInteracted?.();
          setPlaying((current) => !current);
        }}
        onPrev={() => moveToStep(step - 1)}
        onNext={() => moveToStep(step + 1)}
        onSpeedChange={(nextSpeed) => {
          onInteracted?.();
          setSpeed(nextSpeed);
        }}
      />

      <Card className="border-border/70">
        <div className="grid gap-3 md:grid-cols-5">
          {MRNA_CODONS.map((codon, index) => (
            <div key={codon} className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">密码子 {index + 1}</p>
              <p className="mt-2 font-mono text-lg font-semibold text-foreground">{codon}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
