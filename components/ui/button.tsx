import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-foreground text-background shadow-[0_1px_2px_rgba(0,0,0,0.25)] hover:-translate-y-[2px] hover:bg-foreground/92 hover:shadow-[0_6px_20px_rgba(250,250,250,0.08)] active:translate-y-0 active:bg-foreground/88 active:shadow-[0_1px_2px_rgba(0,0,0,0.25)]",
  secondary:
    "border border-border/80 bg-surface-elevated/80 text-foreground hover:-translate-y-[2px] hover:border-foreground/20 hover:bg-surface hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] active:translate-y-0 active:bg-surface-elevated",
  ghost:
    "text-foreground hover:-translate-y-[2px] hover:bg-surface-elevated active:translate-y-0 active:bg-surface",
} as const;

const sizeStyles = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

type ButtonVariant = keyof typeof variantStyles;
type ButtonSize = keyof typeof sizeStyles;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  ComponentPropsWithoutRef<"button"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  ComponentPropsWithoutRef<"a"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  "group inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;

    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
