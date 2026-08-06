"use client";

import { useState } from "react";
import {
  Cloud,
  Layers,
  Server,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { whatIBuild } from "@/lib/content/hero";
import {
  easeOut,
  heroCardContainer,
  heroCardItem,
  heroEntranceItemReduced,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const icons: Record<(typeof whatIBuild.items)[number]["icon"], LucideIcon> = {
  layers: Layers,
  server: Server,
  cloud: Cloud,
  sparkles: Sparkles,
};

export function WhatIBuildCard() {
  const reduceMotion = useReducedMotion();
  const [sweepKey, setSweepKey] = useState(0);

  const triggerSweep = () => {
    if (!reduceMotion) {
      setSweepKey((key) => key + 1);
    }
  };

  return (
    <motion.aside
      aria-labelledby="what-i-build-heading"
      className="w-full lg:max-w-[34rem] lg:justify-self-end xl:max-w-[36rem]"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.42,
        delay: reduceMotion ? 0 : 0.48,
        ease: easeOut,
      }}
    >
      <div
        className="group/card relative overflow-hidden rounded-2xl border border-border/55 bg-surface/55 backdrop-blur-sm"
        onMouseEnter={triggerSweep}
      >
        {!reduceMotion ? (
          <motion.div
            key={sweepKey}
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ opacity: 0, x: "-120%", y: "-120%" }}
            animate={{ opacity: [0, 1, 0], x: "120%", y: "120%" }}
            transition={{ duration: 1.05, ease: easeOut }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(125deg, transparent 42%, rgba(250,250,250,0.09) 50%, transparent 58%)",
              }}
            />
          </motion.div>
        ) : null}

        <div className="relative z-10 p-7 sm:p-8">
          <h2
            id="what-i-build-heading"
            className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground"
          >
            {whatIBuild.title}
          </h2>

          <motion.ul
            className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5"
            role="list"
            initial="hidden"
            animate="visible"
            variants={
              reduceMotion
                ? { visible: { transition: { staggerChildren: 0 } } }
                : heroCardContainer
            }
          >
            {whatIBuild.items.map((item) => {
              const Icon = icons[item.icon];

              return (
                <motion.li
                  key={item.title}
                  variants={
                    reduceMotion ? heroEntranceItemReduced : heroCardItem
                  }
                  className={cn(
                    "group rounded-xl border border-transparent p-2.5 -m-2",
                    "transition-[border-color,background-color] duration-200 ease-out",
                    "hover:border-border/55 hover:bg-surface/40",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/55 bg-surface-elevated/90 transition-[border-color,background-color] duration-200 group-hover:border-foreground/10 group-hover:bg-surface-elevated">
                      <Icon
                        className="size-[1.125rem] text-foreground/75 transition-[color,transform] duration-200 group-hover:rotate-[2.5deg] group-hover:text-foreground motion-reduce:transform-none"
                        aria-hidden="true"
                        strokeWidth={1.85}
                      />
                    </div>

                    <div className="min-w-0 space-y-1 pt-0.5">
                      <p className="text-[0.9375rem] font-semibold leading-snug text-foreground">
                        {item.title}
                      </p>
                      <p className="text-[0.6875rem] leading-relaxed tracking-wide text-muted-foreground/70">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </motion.aside>
  );
}
