"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ProjectsBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="projects-grid absolute inset-0 opacity-50" />

      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_65%_at_50%_35%,transparent_28%,var(--background)_82%)]"
      />

      <motion.div
        className="absolute inset-y-0 left-0 w-2/5"
        initial={false}
        animate={
          reduceMotion
            ? { opacity: 0.3 }
            : {
                opacity: [0.22, 0.34, 0.22],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 20% 50%, color-mix(in srgb, var(--foreground) 6%, transparent), transparent 72%)",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}
