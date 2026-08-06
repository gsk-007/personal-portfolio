import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const spacingStyles = {
  default: "py-[var(--section-spacing)]",
  sm: "py-[var(--section-spacing-sm)]",
  lg: "py-[var(--section-spacing-lg)]",
} as const;

type SectionProps = {
  children: ReactNode;
  spacing?: keyof typeof spacingStyles;
  className?: string;
} & ComponentPropsWithoutRef<"section">;

export function Section({
  children,
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("w-full scroll-mt-[var(--header-height)]", spacingStyles[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}
