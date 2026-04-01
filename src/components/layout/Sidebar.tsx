"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { CHAPTERS } from "@/lib/constants";
import { formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

function SidebarIcon({ icon }: { icon: string }): React.JSX.Element {
  const commonProps = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (icon) {
    case "helix":
      return (
        <svg {...commonProps}>
          <path d="M8 4c4 0 8 3.5 8 8s-4 8-8 8" />
          <path d="M16 4c-4 0-8 3.5-8 8s4 8 8 8" />
          <path d="M9 7h6M7.5 12h9M9 17h6" />
        </svg>
      );
    case "protein":
      return (
        <svg {...commonProps}>
          <path d="M6 6c2.5-3 9.5-3 12 0s2.5 9-1 11-8.5 2-11 0S3.5 9 6 6Z" />
          <path d="M9 9c1-1 5-1 6 1s-1 4-3 5" />
        </svg>
      );
    case "spark":
      return (
        <svg {...commonProps}>
          <path d="m12 3 1.8 4.7L19 9.5l-4 3.4L16 18l-4-2.4L8 18l1-5.1L5 9.5l5.2-1.8L12 3Z" />
        </svg>
      );
    case "target":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="m12 4 0 3m0 10 0 3m8-8-3 0M7 12 4 12" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" />
          <path d="m5 9 7 4 7-4M12 13v8" />
        </svg>
      );
  }
}

function DnaLogo(): React.JSX.Element {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M8 4c4 0 8 3.5 8 8s-4 8-8 8" />
        <path d="M16 4c-4 0-8 3.5-8 8s4 8 8 8" />
        <path d="M9 7h6M7 12h10M9 17h6" />
      </svg>
    </div>
  );
}

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { overallProgress, getChapterProgress } = useLearningProgress();

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <DnaLogo />
          <div>
            <p className="text-sm font-semibold text-foreground">澳龙生物 · 知识图谱</p>
            <p className="text-xs text-muted-foreground">Veterinary Immunology Knowledge Graph</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? "关闭" : "目录"}
        </Button>
      </div>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm transition lg:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <aside
        aria-label="主导航"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[320px] flex-col border-r border-border/60 bg-background/95 px-5 py-6 text-foreground shadow-2xl backdrop-blur transition-transform duration-300 dark:bg-[linear-gradient(180deg,rgba(10,15,30,0.98),rgba(15,23,42,0.94))] lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-start gap-4">
          <DnaLogo />
          <div>
            <h1 className="text-lg font-semibold leading-tight">澳龙生物 · 知识图谱</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              兽用免疫学知识图谱 · Veterinary Immunology Knowledge Graph
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-border/70 bg-muted/50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">学习地图 Learning Map</p>
          <div className="mt-3">
            <ProgressBar value={overallProgress} />
          </div>
        </div>

        <nav className="mt-6 space-y-2">
          {CHAPTERS.map((chapter) => {
            const isActive =
              pathname === chapter.href || (chapter.href !== "/" && pathname.startsWith(chapter.href));
            const content = (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 transition",
                  isActive
                    ? "border-teal-400/40 bg-teal-400/10 text-foreground"
                    : "border-border/50 bg-muted/20 text-foreground hover:border-border hover:bg-muted/50",
                  !chapter.available && "opacity-75",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                    isActive ? "bg-teal-400/20 text-teal-300" : "bg-muted/50",
                  )}
                >
                  <SidebarIcon icon={chapter.icon} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">
                      M{chapter.order}：{chapter.title}
                    </p>
                    {chapter.available ? (
                      <Badge tone="success" className="bg-teal-400/15 text-[10px] text-teal-300">
                        {formatPercent(getChapterProgress(chapter.id))}
                      </Badge>
                    ) : (
                      <Badge className="bg-white/10 text-[10px] text-slate-300">锁定</Badge>
                    )}
                  </div>
                    <p className="truncate text-xs text-muted-foreground">{chapter.titleEn}</p>
                </div>
              </div>
            );

            if (!chapter.available) {
              return <div key={chapter.id}>{content}</div>;
            }

            return (
              <Link key={chapter.id} href={chapter.href} onClick={() => setIsOpen(false)}>
                {content}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 rounded-3xl border border-border/70 bg-muted/50 p-4">
          <div>
            <p className="text-sm font-semibold">当前阶段</p>
            <p className="mt-1 text-xs text-muted-foreground">
              五个章节均已开放；侧边栏会根据当前路由和可见章节同步高亮学习位置。
            </p>
          </div>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
