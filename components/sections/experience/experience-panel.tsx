"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ExperienceItem } from "@/lib/content/experience";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ExperiencePanelProps = {
  experience: ExperienceItem;
  className?: string;
  animated?: boolean;
};

const panelMotion = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
};

const panelMotionReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const achievementItem = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

const techContainer = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut, delay: 0.22 },
  },
};

function PanelContent({
  experience,
  animated,
}: {
  experience: ExperienceItem;
  animated: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const useMotion = animated && !reduceMotion;

  const header = (
    <header className="space-y-1.5">
      <h3
        id={`experience-role-${experience.id}`}
        className="text-h3 font-semibold tracking-tight text-foreground light:text-heading"
      >
        {experience.role}
      </h3>
      <p className="group/company relative inline-block text-sm font-medium text-foreground/85">
        <span>{experience.company}</span>
        <span
          className="absolute -bottom-px left-0 h-px w-0 bg-foreground/40 transition-all duration-300 group-hover/company:w-full"
          aria-hidden="true"
        />
      </p>
      <p className="text-sm text-muted-foreground">
        {experience.duration}
        <span className="text-muted-foreground/50"> · </span>
        {experience.location}
      </p>
    </header>
  );

  const achievements = useMotion ? (
    <motion.ul
      className="mt-6 space-y-2"
      role="list"
      variants={contentContainer}
      initial="hidden"
      animate="visible"
    >
      {experience.achievements.map((achievement) => (
        <motion.li
          key={achievement}
          variants={achievementItem}
          className={cn(
            "group/achievement relative rounded-r-md border-l-2 border-transparent py-1 pl-4 text-sm leading-snug text-foreground/80",
            "transition-[border-color,background-color] duration-200",
            "hover:border-foreground/25 hover:bg-surface-elevated/40",
            "before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-foreground/30",
          )}
        >
          {achievement}
        </motion.li>
      ))}
    </motion.ul>
  ) : (
    <ul className="mt-6 space-y-2" role="list">
      {experience.achievements.map((achievement) => (
        <li
          key={achievement}
          className={cn(
            "group/achievement relative rounded-r-md border-l-2 border-transparent py-1 pl-4 text-sm leading-snug text-foreground/80",
            "transition-[border-color,background-color] duration-200",
            "hover:border-foreground/25 hover:bg-surface-elevated/40",
            "before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-foreground/30",
          )}
        >
          {achievement}
        </li>
      ))}
    </ul>
  );

  const tech = useMotion ? (
    <motion.div
      className="mt-6 border-t border-border/50 pt-6"
      variants={techContainer}
      initial="hidden"
      animate="visible"
    >
      <TechPills items={experience.tech} />
    </motion.div>
  ) : (
    <div className="mt-6 border-t border-border/50 pt-6">
      <TechPills items={experience.tech} />
    </div>
  );

  return (
    <>
      {header}
      {achievements}
      {tech}
    </>
  );
}

function TechPills({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" role="list" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>
          <span className="inline-flex rounded-full border border-border/60 bg-surface-elevated px-2.5 py-1 text-xs text-muted-foreground transition-[color,background-color,border-color] duration-200 hover:border-foreground/20 hover:bg-surface-elevated/90 hover:text-foreground/85 light:border-heading/20 light:bg-heading/8 light:text-heading/80 light:hover:border-heading/35 light:hover:bg-heading/12 light:hover:text-heading">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ExperiencePanel({
  experience,
  className,
  animated = true,
}: ExperiencePanelProps) {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion ? panelMotionReduced : panelMotion;

  if (!animated) {
    return (
      <article
        aria-labelledby={`experience-role-${experience.id}`}
        className={cn(
          "rounded-2xl border border-border/55 bg-surface p-7 sm:p-8",
          className,
        )}
      >
        <PanelContent experience={experience} animated={false} />
      </article>
    );
  }

  return (
    <motion.article
      aria-labelledby={`experience-role-${experience.id}`}
      initial={motionProps.initial}
      animate={motionProps.animate}
      exit={motionProps.exit}
      transition={{ duration: 0.45, ease: easeOut }}
      className={cn(
        "rounded-2xl border border-border/55 bg-surface p-7 sm:p-8",
        className,
      )}
    >
      <PanelContent experience={experience} animated />
    </motion.article>
  );
}
