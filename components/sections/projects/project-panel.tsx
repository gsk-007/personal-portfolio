"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectItem } from "@/lib/content/projects";
import { projectArchitectures } from "@/lib/content/project-architecture";
import { sectionCardClass } from "@/lib/section-styles";
import { cn } from "@/lib/utils";
import { ArchitecturePreview } from "./architecture-preview";
import { ProjectLinks } from "./project-links";
import { TechPills } from "./tech-pills";

type ProjectPanelProps = {
  project: ProjectItem;
  className?: string;
};

const PANEL_HEIGHT = "h-[440px]";

export function ProjectPanel({ project, className }: ProjectPanelProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const architecture = projectArchitectures[project.id];

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const spotlight = spotlightRef.current;

    if (!panelRef.current || !spotlight || reduceMotion) {
      return;
    }

    const rect = panelRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    spotlight.style.setProperty("--spotlight-x", `${x}%`);
    spotlight.style.setProperty("--spotlight-y", `${y}%`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty("--spotlight-x", "50%");
      spotlightRef.current.style.setProperty("--spotlight-y", "50%");
    }
  };

  return (
    <article
      ref={panelRef}
      aria-labelledby={`project-${project.id}-heading`}
      className={cn("group/panel", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={spotlightRef}
        className={cn(
          PANEL_HEIGHT,
          sectionCardClass,
          "panel-spotlight relative overflow-hidden",
          "transition-[border-color,box-shadow] duration-300",
          "hover:border-foreground/14 hover:shadow-[0_6px_32px_-10px_rgba(0,0,0,0.4)]",
        )}
      >
        {!reduceMotion ? (
          <div className="panel-spotlight-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        ) : null}

        <div className="relative flex h-full flex-col p-6 sm:p-7">
          <div className="shrink-0">
            <div className="flex items-start justify-between gap-3">
              <h3
                id={`project-${project.id}-heading`}
                className="min-w-0 text-h3 font-semibold tracking-tight text-foreground"
              >
                {project.name}
              </h3>

              <ProjectLinks
                github={project.github}
                live={project.live}
                size="sm"
                className="shrink-0"
              />
            </div>

            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {project.description}
            </p>
          </div>

          <ul className="mt-5 shrink-0 space-y-2" role="list">
            {project.highlights.map((highlight) => (
              <li
                key={highlight.title}
                className="relative pl-3.5 text-sm leading-snug text-foreground/75 before:absolute before:left-0 before:top-[0.55rem] before:size-1 before:rounded-full before:bg-foreground/30"
              >
                <span className="font-medium text-foreground/90">
                  {highlight.title}
                </span>
                <span className="text-muted-foreground">
                  {" — "}
                  {highlight.detail}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 shrink-0 h-[100px] overflow-hidden">
            {architecture ? (
              <motion.div
                className="h-full rounded-lg border border-border/40 bg-surface-elevated/30 px-3 py-3"
                animate={
                  reduceMotion
                    ? undefined
                    : isHovered
                      ? { x: 3, y: -2 }
                      : { x: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <ArchitecturePreview
                  nodes={architecture.nodes}
                  isActive={isHovered}
                  size="panel"
                />
              </motion.div>
            ) : null}
          </div>

          <div className="mt-5 shrink-0 border-t border-border/50 pt-5">
            <TechPills items={project.tech} size="sm" />
          </div>
        </div>
      </div>
    </article>
  );
}
