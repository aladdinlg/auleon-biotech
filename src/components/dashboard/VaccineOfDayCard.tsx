'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const VACCINES = [
  {
    id: 'eg95',
    nameZH: 'EG95 亚单位疫苗',
    nameEN: 'EG95 Subunit Vaccine',
    type: '基因工程亚单位',
    typeEN: 'Recombinant Subunit',
    efficacy: '98%',
    efficacyLabel: '绵羊攻毒保护率',
    molecule: 'UniProt Q25309',
    color: 'teal',
    href: '/eg95-vaccine',
    badge: '🛡️',
    highlight: 'FnIII结构域 · aa 51-79核心表位 · 四聚体串联40% TPC',
  },
  {
    id: 'brucella',
    nameZH: '布鲁氏菌疫苗',
    nameEN: 'Brucellosis Vaccine Series',
    type: '活减毒疫苗',
    typeEN: 'Live Attenuated',
    efficacy: '65%',
    efficacyLabel: 'Rev.1 总体效力',
    molecule: 'S2 / A19 / Rev.1 / BA0711',
    color: 'amber',
    href: '/brucellosis',
    badge: '🦠',
    highlight: 'ddPCR DIVA · T4SS胞内逃逸 · Iraq BCR=4.25',
  },
  {
    id: 'capripox',
    nameZH: '山羊痘/LSD跨保护疫苗',
    nameEN: 'Capripox Cross-Protection Vaccine',
    type: '活减毒疫苗',
    typeEN: 'Live Attenuated',
    efficacy: '78-119%',
    efficacyLabel: '泰国病例下降率',
    molecule: 'LSDV / GTPV · P32 · L1R',
    color: 'orange',
    href: '/capripoxvirus',
    badge: '🐄',
    highlight: '96-97%核苷酸同源性 · EUA授权5国 · Uttarkashi 3×剂量',
  },
];

function getDayIndex(): number {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % VACCINES.length;
}

const COLOR_CLASSES = {
  teal: {
    bg: 'from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40',
    border: 'border-teal-200 dark:border-teal-800',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    stat: 'text-teal-600 dark:text-teal-400',
    link: 'bg-teal-600 hover:bg-teal-700',
  },
  amber: {
    bg: 'from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    stat: 'text-amber-600 dark:text-amber-400',
    link: 'bg-amber-600 hover:bg-amber-700',
  },
  orange: {
    bg: 'from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40',
    border: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    stat: 'text-orange-600 dark:text-orange-400',
    link: 'bg-orange-600 hover:bg-orange-700',
  },
};

export function VaccineOfDayCard() {
  const [vaccine, setVaccine] = useState(VACCINES[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setVaccine(VACCINES[getDayIndex()]);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />;
  }

  const colors = COLOR_CLASSES[vaccine.color as keyof typeof COLOR_CLASSES];

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${colors.bg} ${colors.border}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-400">
            今日精选疫苗 · Vaccine of the Day
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{vaccine.badge}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{vaccine.nameZH}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">{vaccine.nameEN}</p>
            </div>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors.badge}`}>
          {vaccine.type}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/60 p-3 dark:bg-slate-900/40">
          <p className="text-xs text-gray-500 dark:text-slate-400">{vaccine.efficacyLabel}</p>
          <p className={`text-2xl font-bold ${colors.stat}`}>{vaccine.efficacy}</p>
        </div>
        <div className="rounded-xl bg-white/60 p-3 dark:bg-slate-900/40">
          <p className="text-xs text-gray-500 dark:text-slate-400">结构参考</p>
          <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{vaccine.molecule}</p>
        </div>
      </div>

      <p className="mb-3 text-xs text-gray-600 dark:text-slate-400">{vaccine.highlight}</p>

      <Link
        href={vaccine.href}
        className={`inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${colors.link}`}
      >
        进入模块 →
      </Link>
    </div>
  );
}
