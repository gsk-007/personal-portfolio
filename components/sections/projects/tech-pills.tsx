import { cn } from "@/lib/utils";

type TechPillsProps = {
  items: readonly string[];
  highlightedItems?: readonly string[];
  className?: string;
  size?: "sm" | "md";
  linearHighlight?: boolean;
};

export function TechPills({
  items,
  highlightedItems = [],
  className,
  size = "md",
  linearHighlight = false,
}: TechPillsProps) {
  return (
    <ul
      className={cn("flex flex-wrap gap-2", className)}
      role="list"
      aria-label="Technologies"
    >
      {items.map((item) => {
        const isHighlighted = highlightedItems.includes(item);

        return (
          <li key={item}>
            <span
              className={cn(
                "inline-flex rounded-full border border-border/60 bg-surface-elevated text-muted-foreground",
                "light:border-heading/20 light:bg-heading/8 light:text-heading/80",
                linearHighlight
                  ? "transition-[color,background-color,border-color] duration-150 ease-linear"
                  : "transition-[color,background-color,border-color] duration-300",
                "hover:border-foreground/20 hover:bg-surface-elevated/90 hover:text-foreground/85",
                "light:hover:border-heading/35 light:hover:bg-heading/12 light:hover:text-heading",
                isHighlighted &&
                  "border-foreground/25 bg-surface-elevated/95 text-foreground/90 light:border-heading/40 light:bg-heading/14 light:text-heading",
                size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
              )}
            >
              {item}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
