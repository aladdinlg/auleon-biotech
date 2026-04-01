"use client";

import { useEffect, useState } from "react";

import { PlaybackControls } from "@/components/bio/animations/PlaybackControls";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface TranscriptionSceneProps {
  onInteracted?: () => void;
}

const TEMPLATE_SEQUENCE = "TACCGAATGCTTACT";
const MRNA_SEQUENCE = "AUGGCUUACGAAUGA";
const STEP_LABELS = ["解旋形成转录泡", "RNA 聚合酶结合启动子", "mRNA 逐步合成", "释放并重新缠绕"] as const;

function nucleotideTone(base: string): string {
  switch (base) {
    case "A":
    case "U":
      return "bg-sky-400/20 text-sky-200";
    case "G":
    case "C":
      return "bg-rose-400/20 text-rose-200";
    case "T":
      return "bg-emerald-400/20 text-emerald-200";
    default:
      return "bg-white/10 text-slate-300";
  }
}

function SequenceText({
  label,
  sequence,
  direction,
  revealCount,
}: {
  label: string;
  sequence: string;
  direction: string;
  revealCount?: number;
}): React.JSX.Element {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-xs text-slate-400">{direction}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sequence.split("").map((base, index) => {
          const isVisible = revealCount === undefined ? true : index < revealCount;

          return (
            <span
              key={`${label}-${base}-${index}`}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-semibold transition",
                nucleotideTone(base),
                !isVisible && "opacity-25",
              )}
            >
              {base}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function TranscriptionScene({ onInteracted }: TranscriptionSceneProps): React.JSX.Element {
  // Start at step 1 so DNA + RNA polymerase are immediately visible
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setPhase((current) => {
        const next = current + 0.03 * speed;

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

  const visibleMrnaCount =
    step === 2 ? Math.max(1, Math.floor(phase * MRNA_SEQUENCE.length)) : step === 3 ? MRNA_SEQUENCE.length : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {/* 转录过程 SVG 动画 */}
          <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900">
            <style>{`
              @keyframes rnap-move { from { transform: translateX(0); } to { transform: translateX(220px); } }
              @keyframes mrna-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
              @keyframes bubble-pulse { 0%,100%{opacity:.7}50%{opacity:1} }
              .rnap-enzyme { animation: rnap-move ${(2 / (speed || 1)).toFixed(2)}s linear ${playing ? 'running' : 'paused'} forwards; }
              .transcription-bubble { animation: bubble-pulse 1.2s ease-in-out infinite; }
            `}</style>
            <svg viewBox="0 0 720 300" className="w-full h-full" aria-label="转录过程示意图">
              {/* DNA double strand */}
              {/* Template strand (bottom) */}
              <line x1="60" y1="130" x2="660" y2="130" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round"/>
              {/* Coding strand (top) */}
              <line x1="60" y1="100" x2="660" y2="100" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round"/>
              {/* Connecting rungs */}
              {[100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580, 620].map((x) => (
                <line key={x} x1={x} y1={102} x2={x} y2={128} stroke="#475569" strokeWidth="2" strokeDasharray="4,3"/>
              ))}
              {/* Labels */}
              <text x="62" y="94" fill="#c4b5fd" fontSize="11" fontFamily="sans-serif">编码链 Coding Strand 5&apos;→3&apos;</text>
              <text x="62" y="148" fill="#7dd3fc" fontSize="11" fontFamily="sans-serif">模板链 Template Strand 3&apos;→5&apos;</text>

              {/* Step 0: only DNA */}
              {/* Step 1+: Transcription bubble opens */}
              {step >= 1 && (
                <g className="transcription-bubble">
                  <path d="M 260,115 Q 320,85 380,115" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5,3"/>
                  <path d="M 260,115 Q 320,145 380,115" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5,3"/>
                  <text x="298" y="80" fill="#f59e0b" fontSize="10" fontFamily="sans-serif">转录泡</text>
                </g>
              )}

              {/* RNA polymerase: step 1+, moves right with phase */}
              {step >= 1 && (
                <g transform={`translate(${200 + (step === 1 ? phase * 60 : step === 2 ? 60 + phase * 120 : 180)}, 0)`}>
                  <rect x="250" y="80" width="70" height="60" rx="12" fill="#f59e0b" opacity="0.9"/>
                  <text x="285" y="108" fill="#1c1917" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">RNA</text>
                  <text x="285" y="122" fill="#1c1917" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">聚合酶</text>
                  {/* Direction arrow */}
                  <polygon points="325,107 335,112 325,117" fill="#1c1917"/>
                </g>
              )}

              {/* Step 2+: mRNA emerges below template strand */}
              {step >= 2 && (
                <g>
                  <text x="62" y="190" fill="#34d399" fontSize="11" fontFamily="sans-serif">mRNA 转录产物 5&apos;→3&apos;</text>
                  <line
                    x1="60"
                    y1="200"
                    x2={60 + (step === 2 ? phase : 1) * 400}
                    y2="200"
                    stroke="#34d399"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* mRNA ribose markers */}
                  {[80, 120, 160, 200, 240, 280, 320, 360, 400].map((x) => {
                    const visible = x <= 60 + (step === 2 ? phase : 1) * 400;
                    return visible ? (
                      <circle key={x} cx={x} cy={200} r="4" fill="#059669" opacity="0.8"/>
                    ) : null;
                  })}
                  {/* mRNA 5' cap */}
                  <circle cx="60" cy="200" r="7" fill="#34d399" opacity="0.9"/>
                  <text x="54" y="204" fill="#064e3b" fontSize="9" fontWeight="700" fontFamily="monospace">5&apos;</text>
                </g>
              )}

              {/* Step 3: termination */}
              {step >= 3 && (
                <g>
                  <text x="480" y="250" fill="#f87171" fontSize="12" fontWeight="600" fontFamily="sans-serif">终止 ■</text>
                  {/* Re-formed DNA rungs after polymerase */}
                  {[420, 460, 500, 540].map((x) => (
                    <line key={`r-${x}`} x1={x} y1={102} x2={x} y2={128} stroke="#2563eb" strokeWidth="2"/>
                  ))}
                </g>
              )}

              {/* Direction arrow */}
              <g transform="translate(0,260)">
                <line x1="60" y1="0" x2="660" y2="0" stroke="#334155" strokeWidth="1.5" strokeDasharray="8,4"/>
                <polygon points="660,0 650,-4 650,4" fill="#334155"/>
                <text x="60" y="-6" fill="#475569" fontSize="10" fontFamily="sans-serif">转录方向 →</text>
              </g>
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
        </div>

        <Card className="border-border/70">
          <h3 className="text-xl font-semibold text-foreground">序列实时面板</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            左侧动画按 3&apos;→5&apos; 模板链读取，下方实时展示正在延长的 mRNA 序列。
          </p>

          <div className="mt-5 space-y-4">
            <SequenceText
              label="DNA 模板链"
              sequence={TEMPLATE_SEQUENCE}
              direction="3'-T A C C G A A T G C T T A C T-5'"
            />
            <SequenceText
              label="mRNA 转录产物"
              sequence={MRNA_SEQUENCE}
              direction="5'-A U G G C U U A C G A A U G A-3'"
              revealCount={visibleMrnaCount}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-muted/50 p-4 text-sm leading-7 text-muted-foreground">
            <p className="font-medium text-foreground">配对提示</p>
            <p className="mt-2">A↔U 用蓝色强调，G↔C 用红色强调，模板链 T 对应转录产物中的 A 则以绿色提醒。</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
