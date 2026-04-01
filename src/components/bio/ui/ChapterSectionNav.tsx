"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface ChapterSectionItem {
  id: string;
  label: string;
}

interface ChapterSectionNavProps {
  items: ChapterSectionItem[];
}

export function ChapterSectionNav({ items }: ChapterSectionNavProps): React.JSX.Element {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [items, pathname]);

  return (
    <nav className="sticky top-3 z-20 rounded-3xl border border-border/70 bg-card/90 p-3 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`${pathname}#${item.id}`}
            aria-current={activeId === item.id ? "true" : undefined}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
              activeId === item.id
                ? "border-emerald-400/40 bg-emerald-400/15 text-foreground"
                : "border-border/70 text-muted-foreground hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-foreground",
            )}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
