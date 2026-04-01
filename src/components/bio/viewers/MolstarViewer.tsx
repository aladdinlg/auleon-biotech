/**
 * MolstarViewer — 恢复版（带即时 WebGL context 销毁）
 *
 * 使用 @e-infra/react-molstar-wrapper 的 Viewer 组件渲染真实 3D 分子结构。
 * 关键改进：组件卸载时立即调用 Manager.getInstance().disposePlugin()，
 * 绕过 wrapper 内置的 30s GC 定时器，防止切换章节时 WebGL context 累积泄漏。
 *
 * 支持的数据源：
 * - pdb: RCSB PDB CIF 格式（https://files.rcsb.org/download/{id}.cif）
 * - uniprot: AlphaFold 预测结构（wrapper 默认 URL）
 * - pubchem: PubChem 2D 结构图像（wrapper 不支持 SDF 格式，改用 PNG 展示）
 */
"use client";

import "@e-infra/react-molstar-wrapper/style.css";
import { useRef, useEffect, useMemo, useState, Component, type JSX, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { Props as ViewerInternalProps } from "@e-infra/react-molstar-wrapper";

type RepresentationMode =
  | "cartoon"
  | "ball_and_stick"
  | "spacefill"
  | "line"
  | "surface"
  | "backbone";

type ViewerSource =
  | { type: "pubchem"; cid: number; residueName?: string }
  | { type: "uniprot"; accession: string }
  | { type: "pdb"; pdbId: string };

interface MolstarViewerProps {
  source: ViewerSource;
  height?: number;
  bgColor?: `#${string}`;
  spin?: boolean;
  className?: string;
  representation?: RepresentationMode;
}

/**
 * Manager 单例的最小接口，用于在 cleanup 时立即销毁 WebGL context。
 * 与 @e-infra/react-molstar-wrapper 的 Manager 类 API 保持一致。
 */
interface ManagerSingleton {
  getInstance(): { disposePlugin(container: HTMLElement): void };
}

// 动态加载 Viewer，避免 SSR 问题（Mol* 需要 document 对象）
const DynViewer = dynamic(
  () => import("@e-infra/react-molstar-wrapper").then((m) => m.Viewer),
  { ssr: false },
);

/** 根据 ViewerSource 类型（pdb / uniprot）构建 Viewer 所需的 proteins + modelSourceUrls 配置 */
function buildViewerProps(
  source: Extract<ViewerSource, { type: "pdb" | "uniprot" }>,
  height: number,
  bgColor: `#${string}` | undefined,
  spin: boolean,
  representation: RepresentationMode | undefined,
): ViewerInternalProps {
  const shared = {
    bgColor: bgColor ?? ("#0f172a" as const satisfies `#${string}`),
    spin: spin as true,
    initialUI: "minimal" as const,
    height,
  };

  const protein = { ...(representation ? { representation } : {}) };

  switch (source.type) {
    case "pdb":
      return {
        ...shared,
        proteins: [{ ...protein, uniProtId: source.pdbId }],
        modelSourceUrls: {
          uniProtId: (id: string) =>
            `https://files.rcsb.org/download/${id}.cif`,
        },
      };

    case "uniprot":
      return {
        ...shared,
        proteins: [{ ...protein, uniProtId: source.accession }],
      };
  }
}

/**
 * PubChem 小分子 2D 结构卡片
 *
 * wrapper 内部强制以 mmCIF 格式解析所有 URL 来源，无法处理 PubChem SDF 格式。
 * 改用 PubChem 官方 PNG 端点展示 2D 结构图，无 WebGL 依赖，加载稳定可靠。
 */
function PubChem2DCard({
  cid,
  residueName,
  height,
  className,
}: {
  cid: number;
  residueName?: string;
  height: number;
  className?: string;
}): JSX.Element {
  const [imgError, setImgError] = useState(false);
  const pngUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?record_type=2d&image_size=large`;
  const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-lg overflow-hidden bg-white/5 border border-border/40",
        className,
      )}
      style={{ height: `${height}px` }}
    >
      {!imgError ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pngUrl}
            alt={residueName ? `${residueName} 2D 结构` : `PubChem CID ${cid} 2D 结构`}
            className="max-h-[75%] max-w-[90%] object-contain"
            onError={() => setImgError(true)}
          />
          <div className="absolute bottom-2 flex items-center gap-2 text-xs text-muted-foreground">
            {residueName && (
              <span className="font-medium text-foreground/70">{residueName}</span>
            )}
            <a
              href={pubchemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              PubChem CID {cid}
            </a>
            <span className="text-muted-foreground/50">· 2D 结构</span>
          </div>
        </>
      ) : (
        <div className="text-center text-sm text-muted-foreground px-4">
          <p>2D 结构图加载失败</p>
          <a
            href={pubchemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-xs underline underline-offset-2 hover:text-foreground transition-colors"
          >
            在 PubChem 查看 CID {cid}
          </a>
        </div>
      )}
    </div>
  );
}

export function MolstarViewer({
  source,
  height = 320,
  bgColor,
  spin = false,
  representation,
  className,
}: MolstarViewerProps): JSX.Element {
  // pubchem 类型不需要 Molstar，直接渲染 2D 卡片
  if (source.type === "pubchem") {
    return (
      <PubChem2DCard
        cid={source.cid}
        residueName={source.residueName}
        height={height}
        className={className}
      />
    );
  }

  // pdb / uniprot 类型使用 Molstar 3D 查看器
  return <MolstarPdbUniprotViewer source={source} height={height} bgColor={bgColor} spin={spin} representation={representation} className={className} />;
}

// ── Molstar 错误边界 ─────────────────────────────────────────────────────────
// 捕获 DynViewer 渲染/初始化阶段的 React 错误，防止冒泡为 Runtime Error overlay
interface MolstarBoundaryState { hasError: boolean }
class MolstarErrorBoundary extends Component<{ children: ReactNode }, MolstarBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): MolstarBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error): void {
    console.warn("Molstar init error (non-fatal):", error);
  }
  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          3D 结构加载失败，请刷新重试
        </div>
      );
    }
    return this.props.children;
  }
}

/** Molstar 3D 查看器（仅用于 pdb / uniprot 类型）*/
function MolstarPdbUniprotViewer({
  source,
  height,
  bgColor,
  spin,
  representation,
  className,
}: Omit<MolstarViewerProps, "source"> & {
  source: Extract<ViewerSource, { type: "pdb" | "uniprot" }>;
}): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerCacheRef = useRef<ManagerSingleton | null>(null);
  // 只有容器具有实际尺寸后才挂载 DynViewer，防止 0×0 纹理错误
  const [isReady, setIsReady] = useState(false);

  // 等待容器具有实际尺寸（offsetWidth > 0 && offsetHeight > 0）
  // 根因：Molstar canvas3d 在 0×0 容器中初始化时触发
  // "empty textures are not allowed" WebGL 错误
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number;
    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        setIsReady(true);
        return;
      }
      rafId = requestAnimationFrame(check);
    };
    check();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 预加载 Manager + 卸载时立即销毁 WebGL context，绕过 wrapper 的 30s GC 定时器
  useEffect(() => {
    let cancelled = false;
    void import("@e-infra/react-molstar-wrapper").then(({ Manager }) => {
      if (!cancelled) {
        managerCacheRef.current = Manager as unknown as ManagerSingleton;
      }
    });

    return () => {
      cancelled = true;

      // eslint-disable-next-line react-hooks/exhaustive-deps
      const container = containerRef.current;
      const manager = managerCacheRef.current;
      if (!container || !manager) return;

      // Viewer 组件将自身的容器 div 标记为 class="react-molstar"
      const molstarEl = container.querySelector<HTMLElement>(".react-molstar");
      if (molstarEl) {
        try {
          manager.getInstance().disposePlugin(molstarEl);
        } catch {
          // Plugin 可能已经被销毁，忽略错误
        }
      }
    };
  }, []);

  const viewerProps = useMemo(
    () => buildViewerProps(source, height ?? 320, bgColor, spin ?? false, representation),
    [source, height, bgColor, spin, representation],
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative rounded-lg overflow-hidden", className)}
      // minWidth + minHeight 防止容器被 CSS 折叠为 0，确保 canvas3d 有有效尺寸
      style={{ height: `${height ?? 320}px`, minWidth: 200, minHeight: 200 }}
    >
      {isReady ? (
        <MolstarErrorBoundary>
          {/* DynViewer 在客户端动态加载，仅在容器具有实际尺寸后挂载 */}
          <DynViewer {...viewerProps} />
        </MolstarErrorBoundary>
      ) : (
        <div className="flex h-full animate-pulse items-center justify-center rounded-lg bg-slate-800/50 text-sm text-muted-foreground">
          3D 结构准备中...
        </div>
      )}
    </div>
  );
}
