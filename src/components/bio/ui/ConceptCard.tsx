"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ConceptCardProps {
  title: string;
  titleEn: string;
  description: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export function ConceptCard({
  title,
  titleEn,
  description,
  children,
  defaultOpen = false,
}: ConceptCardProps): React.JSX.Element {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {title} <span className="text-sm text-muted-foreground">{titleEn}</span>
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setOpen((value) => !value)}>
          {open ? "收起" : "展开"}
        </Button>
      </div>
      {open && children ? <div className="mt-5">{children}</div> : null}
    </Card>
  );
}
