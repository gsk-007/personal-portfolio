import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "body",
            "body-sm",
            "caption",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "background",
            "foreground",
            "muted",
            "muted-foreground",
            "heading",
            "accent",
            "accent-foreground",
            "ring",
            "border",
            "border-subtle",
            "surface",
            "surface-elevated",
          ],
        },
      ],
      "bg-color": [
        {
          bg: [
            "background",
            "foreground",
            "muted",
            "heading",
            "accent",
            "accent-foreground",
            "surface",
            "surface-elevated",
          ],
        },
      ],
      "border-color": [
        {
          border: [
            "foreground",
            "muted",
            "heading",
            "accent",
            "border",
            "border-subtle",
            "surface",
          ],
        },
      ],
      "ring-color": [
        {
          ring: ["foreground", "muted", "heading", "accent", "ring"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
