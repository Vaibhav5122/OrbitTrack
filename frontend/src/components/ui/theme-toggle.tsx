"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { RiSunLine, RiMoonLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`size-9 text-muted-foreground ${className ?? ""}`}
        aria-label="Toggle theme"
        disabled
      >
        <RiMoonLine className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`size-9 text-muted-foreground hover:text-foreground cursor-pointer transition-colors ${className ?? ""}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <RiSunLine className="size-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <RiMoonLine className="size-4 text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </Button>
  );
}
