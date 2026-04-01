"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/Button";

export function ThemeToggle(): React.JSX.Element {
  // next-themes v0.4+ resolves the theme synchronously on the first client render
  // by reading the class injected on <html> via a blocking script — but the server
  // never runs that script, so resolvedTheme is undefined there.
  // Using a mounted gate ensures the first client render is identical to the server
  // render (both show the neutral "◐" state), preventing React Error #418.
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="secondary"
      className="w-full justify-center gap-2"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span aria-hidden="true">{mounted ? (isDark ? "☀" : "☾") : "◐"}</span>
      <span>
        {mounted ? (isDark ? "切换到亮色" : "切换到暗色") : "主题切换"}
      </span>
    </Button>
  );
}
