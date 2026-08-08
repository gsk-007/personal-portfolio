"use client";

import { useCallback, useState } from "react";
import type { contactContent } from "@/lib/content/contact";
import { cn } from "@/lib/utils";

type PersonalSignoffContent = typeof contactContent.personalSignoff;

const interestHoverMotion: Record<string, string> = {
  guitar:
    "[@media(hover:hover)]:group-hover:rotate-6 [@media(hover:hover)]:group-focus-visible:rotate-6 motion-reduce:[@media(hover:hover)]:group-hover:rotate-0 motion-reduce:[@media(hover:hover)]:group-focus-visible:rotate-0",
  football:
    "[@media(hover:hover)]:group-hover:translate-x-0.5 [@media(hover:hover)]:group-focus-visible:translate-x-0.5 motion-reduce:[@media(hover:hover)]:group-hover:translate-x-0 motion-reduce:[@media(hover:hover)]:group-focus-visible:translate-x-0",
  "table-tennis":
    "[@media(hover:hover)]:group-hover:scale-110 [@media(hover:hover)]:group-focus-visible:scale-110 motion-reduce:[@media(hover:hover)]:group-hover:scale-100 motion-reduce:[@media(hover:hover)]:group-focus-visible:scale-100",
  fitness:
    "[@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-focus-visible:-translate-y-0.5 motion-reduce:[@media(hover:hover)]:group-hover:translate-y-0 motion-reduce:[@media(hover:hover)]:group-focus-visible:translate-y-0",
  reading:
    "[@media(hover:hover)]:group-hover:-rotate-3 [@media(hover:hover)]:group-focus-visible:-rotate-3 motion-reduce:[@media(hover:hover)]:group-hover:rotate-0 motion-reduce:[@media(hover:hover)]:group-focus-visible:rotate-0",
};

const interestActiveMotion: Record<string, string> = {
  guitar: "rotate-6 motion-reduce:rotate-0",
  football: "translate-x-0.5 motion-reduce:translate-x-0",
  "table-tennis": "scale-110 motion-reduce:scale-100",
  fitness: "-translate-y-0.5 motion-reduce:translate-y-0",
  reading: "-rotate-3 motion-reduce:rotate-0",
};

type ContactPersonalSignoffProps = {
  content: PersonalSignoffContent;
  className?: string;
};

export function ContactPersonalSignoff({
  content,
  className,
}: ContactPersonalSignoffProps) {
  const { heading, closing, interests } = content;
  const [activeId, setActiveId] = useState<string | null>(null);

  const clearActive = useCallback(() => setActiveId(null), []);

  return (
    <div className={cn(className)}>
      <p className="text-caption leading-body text-muted/75">{heading}</p>

      <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5">
        {interests.map((interest) => {
          const isActive = activeId === interest.id;
          const hoverMotion = interestHoverMotion[interest.id] ?? "";
          const activeMotion = interestActiveMotion[interest.id] ?? "";
          const showHint = isActive;

          return (
            <li key={interest.id}>
              <button
                type="button"
                className={cn(
                  "group relative inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 -mx-1.5 -my-1",
                  "text-sm font-medium text-muted-foreground/90",
                  "transition-colors duration-200 hover:text-foreground focus-visible:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "active:scale-[0.98] motion-reduce:active:scale-100",
                )}
                aria-expanded={showHint}
                aria-describedby={`contact-signoff-hint-${interest.id}`}
                onClick={() =>
                  setActiveId((current) =>
                    current === interest.id ? null : interest.id,
                  )
                }
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    clearActive();
                  }
                }}
              >
                <span
                  className={cn(
                    "inline-block text-[15px] leading-none transition-transform duration-200 ease-out motion-reduce:transition-none",
                    hoverMotion,
                    showHint && activeMotion,
                  )}
                  aria-hidden="true"
                >
                  {interest.emoji}
                </span>

                <span className="relative">
                  {interest.label}
                  <span
                    className={cn(
                      "absolute -bottom-px left-0 h-px bg-foreground/40 transition-all duration-200 motion-reduce:transition-none",
                      showHint
                        ? "w-full"
                        : "w-0 [@media(hover:hover)]:group-hover:w-full [@media(hover:hover)]:group-focus-visible:w-full",
                    )}
                    aria-hidden="true"
                  />
                </span>

                <span
                  id={`contact-signoff-hint-${interest.id}`}
                  role="tooltip"
                  className={cn(
                    "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[14rem] -translate-x-1/2",
                    "rounded-md border border-border/55 bg-surface-elevated/95 px-2.5 py-1.5 text-center text-[11px] leading-snug text-foreground/85 shadow-sm backdrop-blur-sm",
                    "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                    showHint
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0",
                  )}
                >
                  {interest.hint}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-caption leading-body text-muted/70">{closing}</p>
    </div>
  );
}
