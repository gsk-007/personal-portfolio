"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
};

export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearResetTimer;
  }, [clearResetTimer]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearResetTimer();
      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        resetTimerRef.current = null;
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("flex shrink-0 items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg border border-border/60 bg-surface-elevated/80 text-muted",
          "transition-[color,background-color,border-color,transform] duration-200",
          "hover:-translate-y-px hover:border-foreground/20 hover:bg-surface-elevated hover:text-foreground",
          "active:translate-y-0 active:bg-surface",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        aria-label={label}
      >
        {copied ? (
          <Check className="size-3.5" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
      </button>

      <span
        className="inline-flex min-w-[4.5rem] justify-center text-xs font-medium tracking-wide"
        aria-live="polite"
      >
        <span
          className={cn(
            "transition-opacity duration-200",
            copied ? "text-foreground/80 opacity-100" : "opacity-0",
          )}
        >
          {copiedLabel}
        </span>
      </span>
    </div>
  );
}
