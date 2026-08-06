"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ExperienceItem } from "@/lib/content/experience";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ExperienceNavProps = {
  items: readonly ExperienceItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

type PulseState = {
  from: number;
  to: number;
  key: number;
};

export function ExperienceNav({
  items,
  activeIndex,
  onSelect,
}: ExperienceNavProps) {
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const previousIndexRef = useRef(activeIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [nodeOffsets, setNodeOffsets] = useState<number[]>([]);
  const [pulse, setPulse] = useState<PulseState | null>(null);

  const itemCount = items.length;
  const progress =
    itemCount > 1 ? activeIndex / (itemCount - 1) : 1;

  useEffect(() => {
    const measureNodes = () => {
      const navHeight = navRef.current?.offsetHeight ?? 0;

      if (navHeight === 0) {
        return;
      }

      setNodeOffsets(
        items.map((_, index) => {
          const node = itemRefs.current[index];
          if (!node) {
            return index / Math.max(itemCount - 1, 1);
          }

          const { offsetTop, offsetHeight } = node;
          return (offsetTop + offsetHeight / 2) / navHeight;
        }),
      );
    };

    measureNodes();
    window.addEventListener("resize", measureNodes);
    return () => window.removeEventListener("resize", measureNodes);
  }, [itemCount, items]);

  useEffect(() => {
    const previous = previousIndexRef.current;

    if (previous !== activeIndex && !reduceMotion) {
      setPulse({ from: previous, to: activeIndex, key: Date.now() });
    }

    previousIndexRef.current = activeIndex;
  }, [activeIndex, reduceMotion]);

  const activeNodeOffset =
    nodeOffsets[activeIndex] ?? progress;
  const pulseFromOffset =
    nodeOffsets[pulse?.from ?? 0] ??
    (itemCount > 1 ? (pulse?.from ?? 0) / (itemCount - 1) : 0);
  const pulseToOffset =
    nodeOffsets[pulse?.to ?? 0] ??
    (itemCount > 1 ? (pulse?.to ?? 0) / (itemCount - 1) : 1);

  return (
    <nav
      ref={navRef}
      aria-label="Experience navigation"
      className="relative pl-6"
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-px bg-border/50"
        aria-hidden="true"
      />

      <motion.div
        className="absolute left-0 w-px origin-top bg-foreground/25"
        aria-hidden="true"
        initial={false}
        animate={{ scaleY: progress }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: easeOut }
        }
        style={{ top: 0, height: "100%" }}
      />

      {hoveredIndex !== null && hoveredIndex !== activeIndex ? (
        <motion.div
          className="absolute left-0 w-px origin-top bg-foreground/10"
          aria-hidden="true"
          initial={false}
          animate={{
            scaleY:
              itemCount > 1 ? hoveredIndex / (itemCount - 1) : 1,
          }}
          transition={{ duration: 0.3, ease: easeOut }}
          style={{ top: 0, height: "100%" }}
        />
      ) : null}

      {pulse && !reduceMotion ? (
        <>
          <motion.div
            key={`pulse-line-${pulse.key}`}
            className="absolute left-0 w-px origin-top bg-foreground"
            aria-hidden="true"
            initial={{ scaleY: pulseFromOffset }}
            animate={{ scaleY: pulseToOffset }}
            transition={{ duration: 0.5, ease: easeOut }}
            style={{ top: 0, height: "100%" }}
            onAnimationComplete={() => setPulse(null)}
          />
          <motion.div
            key={`pulse-signal-${pulse.key}`}
            className="absolute left-0 size-2 -translate-x-1/2 rounded-full bg-foreground shadow-[0_0_12px_rgba(250,250,250,0.45)]"
            aria-hidden="true"
            initial={{ top: `${pulseFromOffset * 100}%`, opacity: 1 }}
            animate={{ top: `${pulseToOffset * 100}%`, opacity: [1, 1, 0.2] }}
            transition={{ duration: 0.5, ease: easeOut }}
          />
        </>
      ) : null}

      <motion.div
        className="pointer-events-none absolute -left-6 top-0 w-px -translate-x-1/2"
        aria-hidden="true"
        initial={false}
        animate={{
          top: `${activeNodeOffset * 100}%`,
          opacity: reduceMotion ? 0 : 1,
        }}
        transition={{ duration: 0.45, ease: easeOut }}
        style={{
          height: "3.5rem",
          marginTop: "-1.75rem",
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--foreground) 14%, transparent), transparent)",
          boxShadow: "0 0 24px color-mix(in srgb, var(--foreground) 8%, transparent)",
        }}
      />

      <ol className="space-y-6">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const isFuture = index > activeIndex;
          const isHovered = hoveredIndex === index;
          const isPreview = isHovered && !isActive;

          return (
            <li
              key={item.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="absolute -left-6 top-2 flex size-3 -translate-x-1/2 items-center justify-center">
                {isActive && !reduceMotion ? (
                  <motion.span
                    key={`ripple-${activeIndex}`}
                    className="absolute inset-0 rounded-full border border-foreground/25"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    transition={{ duration: 0.5, ease: easeOut }}
                    aria-hidden="true"
                  />
                ) : null}

                <motion.span
                  className={cn(
                    "relative rounded-full transition-colors duration-200",
                    isFuture && !isPreview
                      ? "size-2 border border-border bg-transparent"
                      : "size-2 bg-foreground",
                    isActive && "shadow-[0_0_10px_rgba(250,250,250,0.35)]",
                  )}
                  aria-hidden="true"
                  initial={false}
                  animate={{
                    scale: isActive ? 1.35 : isPreview ? 1.2 : isPast ? 1 : 0.9,
                    opacity: isActive || isPreview ? 1 : isPast ? 0.85 : 0.45,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.3, ease: easeOut }
                  }
                />
              </span>

              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "w-full text-left transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive || isPreview
                    ? "text-foreground"
                    : isPast
                      ? "text-foreground/70 hover:text-foreground"
                      : "text-muted hover:text-foreground/80",
                )}
              >
                <motion.span
                  className="block text-sm font-medium leading-snug"
                  initial={false}
                  animate={{
                    opacity: isActive || isPreview ? 1 : isPast ? 0.8 : 0.55,
                  }}
                  transition={{ duration: 0.25, ease: easeOut }}
                >
                  {item.navLabel}
                </motion.span>
                <span
                  className={cn(
                    "mt-1 block text-xs transition-colors duration-200",
                    isActive || isPreview
                      ? "text-muted-foreground"
                      : "text-muted-foreground/70",
                  )}
                >
                  {item.company}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
