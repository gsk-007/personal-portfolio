import type { Transition, Variants } from "framer-motion";

export const easeOut = [0.21, 0.47, 0.32, 0.98] as const;

export const transition: Transition = {
  duration: 0.5,
  ease: easeOut,
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition,
  },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerReducedVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

export const heroEntranceItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export const heroEntranceItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: easeOut },
  },
};

export const heroEntranceContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const heroEntranceContainerReduced: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

export const heroCardItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

export const heroCardContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.12,
    },
  },
};

export function getMotionVariants(reduceMotion: boolean | null) {
  return reduceMotion ? fadeVariants : fadeUpVariants;
}

export function getStaggerVariants(reduceMotion: boolean | null) {
  return reduceMotion ? staggerContainerReducedVariants : staggerContainerVariants;
}

export function getHeroEntranceVariants(reduceMotion: boolean | null) {
  return reduceMotion ? heroEntranceContainerReduced : heroEntranceContainer;
}

export function getHeroEntranceItemVariants(reduceMotion: boolean | null) {
  return reduceMotion ? heroEntranceItemReduced : heroEntranceItem;
}
