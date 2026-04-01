"use client";

/**
 * MolstarErrorSuppressor — 应用级全局错误过滤器
 *
 * Molstar canvas3d animation loop 在路由切换 / flex 重排时容器瞬间变为 0×0，
 * handleResize → SsaoPass.setSize → texture.define 抛出
 * "empty textures are not allowed" WebGL 错误。该错误不经过 React render 树，
 * 以 unhandledrejection 或同步 ErrorEvent 形式触发 Next.js dev overlay。
 *
 * 此组件挂载在 <body> 最顶层，确保在任何 Molstar Viewer 初始化之前
 * 就注册好过滤器，静默处理该非致命错误。
 */
import { useEffect } from "react";

export function MolstarErrorSuppressor(): null {
  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg = String(
        (e.reason as { message?: string } | null)?.message ?? e.reason ?? "",
      );
      if (msg.includes("empty textures")) {
        e.preventDefault();
      }
    };
    const handleError = (e: ErrorEvent) => {
      if (e.message?.includes("empty textures")) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);
  return null;
}
