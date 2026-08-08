"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const PARALLAX_SPRING = { stiffness: 120, damping: 28 } as const;

export function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const isDesktopRef = useRef(false);
  const reduceMotionRef = useRef(reduceMotion);
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const springX = useSpring(parallaxX, PARALLAX_SPRING);
  const springY = useSpring(parallaxY, PARALLAX_SPRING);

  reduceMotionRef.current = reduceMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const updateDesktop = () => {
      isDesktopRef.current = mediaQuery.matches;

      if (!mediaQuery.matches) {
        parallaxX.set(0);
        parallaxY.set(0);
      }
    };

    updateDesktop();
    mediaQuery.addEventListener("change", updateDesktop);

    const handlePointerMove = (event: PointerEvent) => {
      if (reduceMotionRef.current || !isDesktopRef.current) {
        return;
      }

      const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;

      parallaxX.set(normalizedX * 4);
      parallaxY.set(normalizedY * 3);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", updateDesktop);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [parallaxX, parallaxY]);

  const parallaxEnabled = !reduceMotion;

  return (
    <div
      className="hero-grain pointer-events-none absolute inset-0 min-h-full overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 min-h-full will-change-transform"
        style={
          parallaxEnabled
            ? { x: springX, y: springY }
            : undefined
        }
      >
        <div
          className={cn(
            "hero-grid absolute -inset-12",
            reduceMotion && "hero-grid-static",
          )}
        />
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-b from-background/0 via-transparent to-background" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
