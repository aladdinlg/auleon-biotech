"use client";

import { useState, useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";

interface KineticsPoint {
  substrate: number;
  velocity: number;
  inverseSubstrate: number;
  inverseVelocity: number;
}

interface KineticsChartProps {
  mode: "mm" | "lb";
  data: KineticsPoint[];
  vmax: number;
  km: number;
  xIntercept: number;
  yIntercept: number;
}

function ChartTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>): React.JSX.Element | null {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3 text-xs text-foreground shadow-2xl">
      <p className="font-semibold text-foreground">X = {typeof label === "number" ? label.toFixed(2) : label}</p>
      {payload.map((item) => (
        <p key={String(item.dataKey)} className="mt-1 text-slate-300">
          {String(item.name ?? item.dataKey ?? '')}: {typeof item.value === "number" ? item.value.toFixed(2) : String(item.value)}
        </p>
      ))}
    </div>
  );
}

export function KineticsChart({
  mode,
  data,
  vmax,
  km,
  xIntercept,
  yIntercept,
}: KineticsChartProps): React.JSX.Element {
  // 延迟一帧渲染，确保父容器完成 CSS 布局后 ResponsiveContainer 才测量尺寸
  // 防止 Next.js 路由切换时父容器宽度为 0 导致 width(-1) 警告
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ height: 320 }} />;
  return (
    <div style={{ minHeight: 320, minWidth: 100, height: "100%" }}>
      <ResponsiveContainer width="100%" height={300} minWidth={0}>
      <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 12 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" />
        <XAxis
          dataKey={mode === "mm" ? "substrate" : "inverseSubstrate"}
          tick={{ fill: "#cbd5e1", fontSize: 12 }}
          stroke="#64748b"
          label={{
            value: mode === "mm" ? "底物浓度 [S] (μM)" : "1 / [S]",
            position: "insideBottom",
            offset: -8,
            fill: "#cbd5e1",
          }}
        />
        <YAxis
          tick={{ fill: "#cbd5e1", fontSize: 12 }}
          stroke="#64748b"
          label={{
            value: mode === "mm" ? "反应速率 V" : "1 / V",
            angle: -90,
            position: "insideLeft",
            fill: "#cbd5e1",
          }}
        />
        <Tooltip content={(props) => <ChartTooltip {...props} />} />
        {mode === "mm" ? (
          <>
            <ReferenceLine y={vmax} stroke="#fbbf24" strokeDasharray="6 6" label="最大反应速率 Vmax" />
            <ReferenceLine x={km} stroke="#34d399" strokeDasharray="6 6" />
            <ReferenceLine y={vmax / 2} stroke="#34d399" strokeDasharray="6 6" label="Km 对应 Vmax/2" />
            <Line type="monotone" dataKey="velocity" stroke="#38bdf8" strokeWidth={3} dot={false} />
          </>
        ) : (
          <>
            <ReferenceLine x={xIntercept} stroke="#34d399" strokeDasharray="6 6" label="X 截距 = -1/Km" />
            <ReferenceLine y={yIntercept} stroke="#fbbf24" strokeDasharray="6 6" label="Y 截距 = 1/Vmax" />
            <Line type="monotone" dataKey="inverseVelocity" stroke="#f87171" strokeWidth={3} dot={false} />
          </>
        )}
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
