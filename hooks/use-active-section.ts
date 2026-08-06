"use client";

import { useEffect, useState } from "react";

type UseActiveSectionOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

export function useActiveSection(
  sectionIds: string[],
  options: UseActiveSectionOptions = {},
) {
  const { rootMargin = "-20% 0px -55% 0px", threshold = 0 } = options;
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;

          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        }

        if (visibleSections.size === 0) {
          setActiveSection(null);
          return;
        }

        const mostVisible = [...visibleSections.entries()].sort(
          (a, b) => b[1] - a[1],
        )[0];

        setActiveSection(mostVisible?.[0] ?? null);
      },
      { rootMargin, threshold },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionIds, rootMargin, threshold]);

  return activeSection;
}
