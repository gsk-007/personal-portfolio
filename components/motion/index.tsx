"use client";

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import {
  getHeroEntranceItemVariants,
  getHeroEntranceVariants,
  getMotionVariants,
  getStaggerVariants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerContainerProps = HTMLMotionProps<"div"> & {
  variants?: Variants;
};

export function StaggerContainer({
  className,
  children,
  variants,
  ...props
}: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants ?? getStaggerVariants(reduceMotion)}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  variants?: Variants;
};

export function StaggerItem({
  className,
  children,
  variants,
  ...props
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={variants ?? getMotionVariants(reduceMotion)}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HeroStaggerContainer({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={getHeroEntranceVariants(reduceMotion)}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HeroStaggerItem({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={getHeroEntranceItemVariants(reduceMotion)}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function FadeIn({
  className,
  children,
  delay = 0,
  ...props
}: FadeInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={getMotionVariants(reduceMotion)}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type MotionDivProps = HTMLMotionProps<"div">;

export function MotionDiv({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
