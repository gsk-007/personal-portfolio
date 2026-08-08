"use client";

import { useCallback, useState } from "react";
import { projectArchitectures } from "@/lib/content/project-architecture";
import { cn } from "@/lib/utils";
import { ArchitecturePreview } from "./architecture-preview";
import { ProjectLinks } from "./project-links";
import { TechPills } from "./tech-pills";

type FeaturedProjectProps = {
  id: string;
  name: string;
  description: string;
  tech: readonly string[];
  github: string;
  live?: string;
};

export function FeaturedProject({
  id,
  name,
  description,
  tech,
  github,
  live,
}: FeaturedProjectProps) {
  const architecture = projectArchitectures[id];
  const [isHovered, setIsHovered] = useState(false);
  const [highlightedTech, setHighlightedTech] = useState<string[]>([]);

  const handleHighlightedTechChange = useCallback((nextTech: string[]) => {
    setHighlightedTech((current) => {
      if (
        current.length === nextTech.length &&
        current.every((key, index) => key === nextTech[index])
      ) {
        return current;
      }

      return nextTech;
    });
  }, []);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHighlightedTech([]);
  };

  return (
    <article
      aria-labelledby={`project-${id}-heading`}
      className="group/featured"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/55 bg-surface",
          "transition-[border-color,box-shadow] duration-300",
          "group-hover/featured:border-foreground/14 group-hover/featured:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.45)]",
        )}
      >
        <div className="grid lg:grid-cols-2 lg:gap-0">
          <div className="flex flex-col p-7 sm:p-8 lg:p-10 xl:p-12">
            <span
              className="inline-flex rounded-full border border-border/60 bg-surface-elevated px-2.5 py-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
            >
              Featured
            </span>

            <h3
              id={`project-${id}-heading`}
              className="mt-4 text-h2 font-semibold tracking-tight text-foreground"
            >
              {name}
            </h3>

            <p className="mt-3 max-w-lg text-body leading-body text-foreground/80">
              {description}
            </p>

            <div className="mt-8">
              <TechPills
                items={tech}
                highlightedItems={highlightedTech}
                linearHighlight
              />
            </div>

            <ProjectLinks github={github} live={live} className="mt-8" />
          </div>

          <div
            className={cn(
              "border-t border-border/45 lg:border-l lg:border-t-0",
              "bg-surface-elevated/25 p-6 sm:p-8 lg:p-10",
              "h-[280px] lg:min-h-[380px]",
              "transition-[border-color,background-color] duration-300",
              "group-hover/featured:border-foreground/10 group-hover/featured:bg-surface-elevated/40",
            )}
          >
            <div className="h-[280px]">
              {architecture ? (
                <ArchitecturePreview
                  nodes={architecture.nodes}
                  techTimeline={tech}
                  isActive={isHovered}
                  size="featured"
                  onHighlightedTechChange={handleHighlightedTechChange}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
