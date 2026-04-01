"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { VaccineOfDayCard } from "@/components/dashboard/VaccineOfDayCard";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { CHAPTERS } from "@/lib/constants";
import { formatPercent } from "@/lib/utils";

export function DashboardClient(): React.JSX.Element {
  const { overallProgress, getChapterProgress } = useLearningProgress();

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="overflow-hidden dark:bg-[radial-gradient(circle_at_top_left,rgba(13,148,136,0.18),transparent_38%),radial-gradient(circle_at_right,rgba(16,185,129,0.22),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]">
          <Badge className="bg-muted text-foreground">澳龙生物 学习总览</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-foreground lg:text-5xl">
            兽用免疫学知识图谱
            <span className="mt-2 block text-xl font-medium text-teal-200">
              Veterinary Immunology Knowledge Graph
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            从兽用生物制品基础出发，逐步走到EG95亚单位疫苗、布鲁氏菌病疫苗、山羊痘/LSD疫苗、注册法规与市场战略。
            结合真实分子结构数据、交互可视化与业务分析。
          </p>
          <div className="mt-8 max-w-xl">
            <ProgressBar value={overallProgress} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/bio-foundation"
              className="inline-flex h-11 items-center justify-center rounded-full bg-teal-600 px-4 text-sm font-medium text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-500"
            >
              开始学习 M1
            </Link>
            <Button variant="secondary">继续学习路径</Button>
          </div>
        </Card>

        {/* VaccineOfDayCard — rotates daily through EG95/Brucella/Capripox */}
        <VaccineOfDayCard />
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">模块总览 Module Grid</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">模块导航与进度</h2>
          </div>
          <p className="text-sm text-muted-foreground">整体进度 {formatPercent(overallProgress)}</p>
        </div>

        <motion.div
          className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
          initial={false}
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {CHAPTERS.map((chapter) => {
            const progress = getChapterProgress(chapter.id);

            return (
              <motion.div
                key={chapter.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Card className="border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">模块 M{chapter.order}</p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">
                      {chapter.title}
                      <span className="mt-1 block text-sm font-normal text-muted-foreground">
                        {chapter.titleEn}
                      </span>
                    </h3>
                  </div>
                  <Badge className={chapter.available ? "bg-teal-400/15 text-teal-300" : "bg-muted text-muted-foreground"}>
                    {chapter.available ? "已开放" : "锁定"}
                  </Badge>
                </div>

                <div className="mt-5 rounded-2xl bg-muted/50 p-4">
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{chapter.description}</p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="rounded-2xl bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">预估学习时间</p>
                    <p className="mt-2 font-semibold text-foreground">{chapter.duration}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">当前进度</p>
                    <p className="mt-2 font-semibold text-foreground">{formatPercent(progress)}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <ProgressBar value={progress} showLabel={false} />
                </div>

                <div className="mt-6">
                  {chapter.available ? (
                    <Link
                      href={chapter.href}
                      className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-muted/30 px-4 text-sm font-medium text-foreground transition hover:border-teal-400/50 hover:bg-muted/50"
                    >
                      进入本模块
                    </Link>
                  ) : (
                    <Button variant="ghost" className="w-full justify-center text-muted-foreground" disabled>
                      等待解锁
                    </Button>
                  )}
                </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
