import { cn, formatPercent, progressWidthClass } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  className,
  showLabel = true,
}: ProgressBarProps): React.JSX.Element {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel ? (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>学习进度</span>
          <span>{formatPercent(safeValue)}</span>
        </div>
      ) : null}
      <div
        className="h-2.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="学习进度"
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-500",
            progressWidthClass(safeValue),
          )}
        />
      </div>
    </div>
  );
}
