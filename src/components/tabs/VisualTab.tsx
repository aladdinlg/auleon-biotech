'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface VisualTabProps {
  visualizationId: string;
}

function SkeletonLoader() {
  return (
    <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-400">加载可视化模块…</p>
      </div>
    </div>
  );
}

function PlaceholderViz({ id }: { id: string }) {
  return (
    <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600">
      <div className="text-center">
        <p className="text-2xl">🔬</p>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-slate-400">
          {id} — 可视化开发中
        </p>
        <p className="mt-1 text-xs text-gray-400">Visualization coming in a future sprint</p>
      </div>
    </div>
  );
}

// Dynamic imports — all ssr:false to avoid SSR issues with D3/canvas/WebGL
const VizRegistry: Record<string, React.ComponentType> = {};

const DYNAMIC_MAP: Record<string, () => Promise<{ [key: string]: React.ComponentType }>> = {
  'm1-vaccine-pcr-qc': () => import('@/components/visualizations/VaccinePCRQC').then((m) => ({ default: m.VaccinePCRQC })),
  'm2-eg95-lifecycle': () => import('@/components/visualizations/EG95LifeCycle').then((m) => ({ default: m.EG95LifeCycle })),
  'm3-strain-comparison': () => import('@/components/visualizations/StrainComparison').then((m) => ({ default: m.StrainComparison })),
  'm3-bcr-model': () => import('@/components/visualizations/BCRModel').then((m) => ({ default: m.BCRModel })),
  'm3-brucella-evasion': () => import('@/components/visualizations/BrucellaEvasion').then((m) => ({ default: m.BrucellaEvasion })),
  'm4-capripox-phylogeny': () => import('@/components/visualizations/CapripoxPhylogeny').then((m) => ({ default: m.CapripoxPhylogeny })),
  'm4-lsd-spread-map': () => import('@/components/visualizations/LSDSpreadMap').then((m) => ({ default: m.LSDSpreadMap })),
  'm5-vich-matrix': () => import('@/components/visualizations/VICHMatrix').then((m) => ({ default: m.VICHMatrix })),
  'm5-ctd-navigator': () => import('@/components/visualizations/CTDNavigator').then((m) => ({ default: m.CTDNavigator })),
  'm6-dcf-model': () => import('@/components/visualizations/DCFModel').then((m) => ({ default: m.DCFModel })),
  'm2-linker-design': () => import('@/components/visualizations/LinkerDesign').then((m) => ({ default: m.LinkerDesign })),
};

function useDynamicViz(id: string) {
  return useMemo(() => {
    if (id in VizRegistry) return VizRegistry[id];
    const loader = DYNAMIC_MAP[id];
    if (!loader) return null;
    const Component = dynamic(() => loader().then((m) => ({ default: m.default })), {
      ssr: false,
      loading: () => <SkeletonLoader />,
    });
    VizRegistry[id] = Component;
    return Component;
  }, [id]);
}

export function VisualTab({ visualizationId }: VisualTabProps) {
  const VizComponent = useDynamicViz(visualizationId);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gray-50 p-1 dark:bg-slate-900">
        {VizComponent ? (
          <VizComponent />
        ) : (
          <PlaceholderViz id={visualizationId} />
        )}
      </div>
      <p className="text-center text-xs text-gray-400 dark:text-slate-500">
        交互提示：调整参数观察实时变化 · Adjust parameters to observe real-time changes
      </p>
    </div>
  );
}

export { SkeletonLoader };
