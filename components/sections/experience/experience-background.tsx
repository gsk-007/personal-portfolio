"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";

type ExperienceBackgroundProps = {
  activeIndex: number;
  itemCount: number;
};

export function ExperienceBackground({
  activeIndex,
  itemCount,
}: ExperienceBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const spotlightY = itemCount > 1 ? (activeIndex / (itemCount - 1)) * 100 : 50;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="experience-grid absolute inset-0 opacity-60" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_40%,transparent_30%,var(--background)_88%)]" />

      <motion.div
        className="absolute inset-y-0 right-0 w-3/5"
        initial={false}
        animate={
          reduceMotion
            ? { opacity: 0.35 }
            : {
                opacity: [0.28, 0.42, 0.28],
                background: [
                  `radial-gradient(ellipse 55% 40% at 62% ${spotlightY}%, color-mix(in srgb, var(--foreground) 7%, transparent), transparent 72%)`,
                  `radial-gradient(ellipse 60% 42% at 58% ${spotlightY}%, color-mix(in srgb, var(--foreground) 9%, transparent), transparent 74%)`,
                  `radial-gradient(ellipse 55% 40% at 62% ${spotlightY}%, color-mix(in srgb, var(--foreground) 7%, transparent), transparent 72%)`,
                ],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                background: { duration: 0.55, ease: easeOut },
              }
        }
      />

      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}
