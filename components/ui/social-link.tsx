import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type SocialLinkProps = {
  href: string;
  label: string;
  icon?: IconComponent;
  external?: boolean;
  className?: string;
};

export function SocialLink({
  href,
  label,
  icon: Icon,
  external = false,
  className,
}: SocialLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-muted",
        "transition-colors duration-200 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {Icon ? (
        <Icon
          className="size-4 transition-transform duration-200 group-hover:-translate-y-px"
          aria-hidden="true"
        />
      ) : null}
      <span className="relative">
        {label}
        <span
          className="absolute -bottom-px left-0 h-px w-0 bg-foreground/50 transition-all duration-200 group-hover:w-full"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}
