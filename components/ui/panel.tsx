import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelProps = ComponentPropsWithoutRef<"article"> & {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className, ...props }: PanelProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border/55 bg-surface",
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}
