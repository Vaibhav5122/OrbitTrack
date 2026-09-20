import React from "react";
import { cn } from "@/lib/utils";

interface OrbitLoaderProps {
  size?: "xs" | "sm" | "md" | "lg" | "fullscreen";
  text?: string;
  className?: string;
}

export function OrbitLoader({ size = "md", text, className }: OrbitLoaderProps) {
  if (size === "xs") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <div className="relative size-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        {text && <span className="text-xs font-medium text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (size === "sm") {
    return (
      <div className={cn("inline-flex items-center gap-2.5", className)}>
        <div className="relative size-5">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
          <div className="absolute inset-1 animate-ping rounded-full bg-primary/20" />
        </div>
        {text && <span className="text-sm font-medium">{text}</span>}
      </div>
    );
  }

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative flex size-14 items-center justify-center">
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-2 border-dashed border-primary/30" />
        
        <div className="absolute inset-1.5 animate-[spin_2s_linear_infinite_reverse] rounded-full border-2 border-primary/40 border-t-primary" />
        
        <div className="size-4 animate-pulse rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.6)]" />

        <div className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 animate-[spin_1.5s_linear_infinite] rounded-full bg-primary shadow-sm" />
      </div>

      {text && (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-semibold tracking-wide text-foreground">{text}</p>
          <span className="text-xs text-muted-foreground animate-pulse">Connecting to OrbitTrack...</span>
        </div>
      )}
    </div>
  );

  if (size === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
