"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollThreshold(threshold = 8) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const isPastThresholdRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const next = window.scrollY > threshold;

      if (next === isPastThresholdRef.current) {
        return;
      }

      isPastThresholdRef.current = next;
      setIsPastThreshold(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return isPastThreshold;
}
