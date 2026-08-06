import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const spacingStyles = {
  default: "py-16 md:py-24 lg:py-28",
  sm: "py-10 md:py-16",
  lg: "py-20 md:py-32 lg:py-36",
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
      className={cn("w-full scroll-mt-16", spacingStyles[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}
