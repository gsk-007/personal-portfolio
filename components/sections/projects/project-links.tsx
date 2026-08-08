import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectLinksProps = {
  github: string;
  live?: string;
  size?: "sm" | "md";
  className?: string;
};

export function ProjectLinks({
  github,
  live,
  size = "md",
  className,
}: ProjectLinksProps) {
  const buttonSize = size === "sm" ? "sm" : "md";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        size={buttonSize}
      >
        <GitHubIcon className="size-4" aria-hidden="true" />
        GitHub
        <ArrowUpRight
          className="size-3.5 transition-transform duration-200 group-hover/panel:translate-x-0.5 group-hover/panel:-translate-y-0.5 group-hover/featured:translate-x-0.5 group-hover/featured:-translate-y-0.5"
          aria-hidden="true"
        />
      </Button>

      {live ? (
        <Button
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size={buttonSize}
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Live demo
          <ArrowUpRight
            className="size-3.5 transition-transform duration-200 group-hover/panel:translate-x-0.5 group-hover/panel:-translate-y-0.5 group-hover/featured:translate-x-0.5 group-hover/featured:-translate-y-0.5"
            aria-hidden="true"
          />
        </Button>
      ) : null}
    </div>
  );
}
