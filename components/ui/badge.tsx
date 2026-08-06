import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  showIndicator?: boolean;
};

export function Badge({
  children,
  className,
  showIndicator = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface-elevated/80 px-3.5 py-1.5 text-xs font-medium tracking-wide text-foreground/70 shadow-[0_1px_2px_rgba(0,0,0,0.2)] backdrop-blur-sm",
        className,
      )}
    >
      {showIndicator ? (
        <span
          className="relative flex size-1.5 shrink-0"
          aria-hidden="true"
        >
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/40 motion-reduce:animate-none" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500/90" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
