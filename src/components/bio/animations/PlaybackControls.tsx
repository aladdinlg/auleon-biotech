"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PlaybackControlsProps {
  step: number;
  totalSteps: number;
  stepLabel: string;
  playing: boolean;
  speed: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 1, 2] as const;

export function PlaybackControls({
  step,
  totalSteps,
  stepLabel,
  playing,
  speed,
  onTogglePlay,
  onPrev,
  onNext,
  onSpeedChange,
}: PlaybackControlsProps): React.JSX.Element {
  return (
    <Card className="border-white/10 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            步骤 {step}/{totalSteps}：{stepLabel}
          </p>
          <p className="mt-1 text-xs text-slate-400">可播放、暂停、逐步前后切换，并调整演示速度。</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onPrev}>
            上一步
          </Button>
          <Button size="sm" onClick={onTogglePlay}>
            {playing ? "暂停" : "播放"}
          </Button>
          <Button variant="secondary" size="sm" onClick={onNext}>
            下一步
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SPEED_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={speed === option ? "primary" : "secondary"}
            size="sm"
            onClick={() => onSpeedChange(option)}
          >
            {option}x
          </Button>
        ))}
      </div>
    </Card>
  );
}
