"use client";

import { Card } from "@/components/ui/Card";
import { MolstarViewer } from "@/components/bio/viewers/MolstarViewer";

interface CompareViewerProps {
  left: {
    label: string;
    source: React.ComponentProps<typeof MolstarViewer>["source"];
  };
  right: {
    label: string;
    source: React.ComponentProps<typeof MolstarViewer>["source"];
  };
}

export function CompareViewer({ left, right }: CompareViewerProps): React.JSX.Element {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="bg-slate-950/40 p-4">
        <p className="mb-3 text-sm font-medium text-foreground">{left.label}</p>
        <MolstarViewer source={left.source} height={320} />
      </Card>
      <Card className="bg-slate-950/40 p-4">
        <p className="mb-3 text-sm font-medium text-foreground">{right.label}</p>
        <MolstarViewer source={right.source} height={320} />
      </Card>
    </div>
  );
}
