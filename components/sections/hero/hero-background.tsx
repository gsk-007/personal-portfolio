"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const parallaxActive = isDesktop && !reduceMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktop = () => setIsDesktop(mediaQuery.matches);

    updateDesktop();
    mediaQuery.addEventListener("change", updateDesktop);
    return () => mediaQuery.removeEventListener("change", updateDesktop);
  }, []);

  useEffect(() => {
    if (!parallaxActive) {
      setPointer({ x: 0, y: 0 });
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;

      setPointer({
        x: normalizedX * 4,
        y: normalizedY * 3,
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [parallaxActive]);

  return (
    <div
      className="hero-grain pointer-events-none absolute inset-0 min-h-full overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 min-h-full will-change-transform"
        style={parallaxActive ? { x: pointer.x, y: pointer.y } : undefined}
        transition={{ type: "spring", stiffness: 120, damping: 28 }}
      >
        <div
          className={cn(
            "hero-grid absolute inset-[-3rem]",
            reduceMotion && "hero-grid-static",
          )}
        />
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-b from-background/0 via-transparent to-background" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
