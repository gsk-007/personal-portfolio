import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const levelStyles = {
  1: "text-h1 leading-heading tracking-tight font-semibold",
  2: "text-h2 leading-heading tracking-tight font-semibold",
  3: "text-h3 leading-heading tracking-tight font-medium",
  4: "text-h4 leading-heading tracking-normal font-medium",
  5: "text-body-sm leading-heading tracking-normal font-medium",
  6: "text-caption leading-heading tracking-normal font-medium uppercase",
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
        "text-display leading-display tracking-tight font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
