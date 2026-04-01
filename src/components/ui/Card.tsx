import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/70 bg-card/90 p-6 text-card-foreground shadow-panel backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
