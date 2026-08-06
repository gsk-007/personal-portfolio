import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const levelStyles = {
  1: "text-[length:var(--text-h1)] leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] font-semibold",
  2: "text-[length:var(--text-h2)] leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] font-semibold",
  3: "text-[length:var(--text-h3)] leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] font-medium",
  4: "text-[length:var(--text-h4)] leading-[var(--leading-heading)] tracking-[var(--tracking-normal)] font-medium",
  5: "text-[length:var(--text-body-sm)] leading-[var(--leading-heading)] tracking-[var(--tracking-normal)] font-medium",
  6: "text-[length:var(--text-caption)] leading-[var(--leading-heading)] tracking-[var(--tracking-normal)] font-medium uppercase",
} as const;

type HeadingLevel = keyof typeof levelStyles;

type HeadingProps = {
  as?: `h${HeadingLevel}`;
  level?: HeadingLevel;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"h1">, "children" | "className">;

export function Heading({
  as,
  level = 2,
  children,
  className,
  ...props
}: HeadingProps) {
  const Component = as ?? (`h${level}` as const);

  return (
    <Component className={cn(levelStyles[level], className)} {...props}>
      {children}
    </Component>
  );
}

export function DisplayHeading({
  children,
  className,
  ...props
}: Omit<HeadingProps, "level" | "as">) {
  return (
    <h1
      className={cn(
        "text-[length:var(--text-display)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
