"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseActiveExperienceOptions = {
  rootMargin?: string;
};

export function useActiveExperience(
  itemCount: number,
  options: UseActiveExperienceOptions = {},
) {
  const { rootMargin = "-45% 0px -45% 0px" } = options;
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const refCallbacks = useRef<((element: HTMLElement | null) => void)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isObserverReady = useRef(false);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const setupObserver = useCallback(() => {
    const elements = chapterRefs.current.filter(
      (element): element is HTMLElement => element !== null,
    );

    if (elements.length !== itemCount) {
      isObserverReady.current = false;
      return;
    }

    if (isObserverReady.current) {
      return;
    }

    const visibility = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = elements.indexOf(entry.target as HTMLElement);

          if (index === -1) {
            continue;
          }

          if (entry.isIntersecting) {
            visibility.set(index, entry.intersectionRatio);
          } else {
            visibility.delete(index);
          }
        }

        if (visibility.size === 0) {
          return;
        }

        const nextActive = [...visibility.entries()].sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0];

        if (
          nextActive === undefined ||
          nextActive === activeIndexRef.current
        ) {
          return;
        }

        activeIndexRef.current = nextActive;
        setActiveIndex(nextActive);
      },
      {
        rootMargin,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    observerRef.current = observer;
    isObserverReady.current = true;
  }, [itemCount, rootMargin]);

  const getChapterRef = useCallback(
    (index: number) => {
      if (!refCallbacks.current[index]) {
        refCallbacks.current[index] = (element: HTMLElement | null) => {
          chapterRefs.current[index] = element;
          setupObserver();
        };
      }

      return refCallbacks.current[index];
    },
    [setupObserver],
  );

  const scrollToChapter = useCallback((index: number) => {
    chapterRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  useEffect(() => {
    setupObserver();

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      isObserverReady.current = false;
    };
  }, [setupObserver]);

  return {
    activeIndex,
    setChapterRef: getChapterRef,
    scrollToChapter,
  };
}
