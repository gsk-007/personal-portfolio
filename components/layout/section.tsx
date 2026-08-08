import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { sectionDividerClass } from "@/lib/section-styles";
import { cn } from "@/lib/utils";

const spacingStyles = {
  default: "py-12 md:py-20 lg:py-24",
  sm: "py-8 md:py-12",
  lg: "py-16 md:py-28 lg:py-32",
} as const;

type SectionProps = {
  children: ReactNode;
  spacing?: keyof typeof spacingStyles;
  divider?: boolean;
  className?: string;
} & ComponentPropsWithoutRef<"section">;

export function Section({
  children,
  spacing = "default",
  divider = false,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "w-full scroll-mt-16",
        spacingStyles[spacing],
        divider && sectionDividerClass,
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
