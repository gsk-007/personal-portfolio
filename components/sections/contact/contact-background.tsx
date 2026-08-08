"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ContactBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="contact-grid absolute inset-0 opacity-45" />

      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_100%,transparent_35%,var(--background)_88%)]"
      />

      <motion.div
        className="contact-horizon absolute inset-x-0 bottom-0 h-48"
        initial={false}
        animate={
          reduceMotion
            ? { opacity: 0.35 }
            : { opacity: [0.28, 0.42, 0.28] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent" />
    </div>
  );
}
