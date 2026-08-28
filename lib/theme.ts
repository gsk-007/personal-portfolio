export const THEME_STORAGE_KEY = "portfolio-theme";

export type Theme = "light" | "dark";

export const THEME_COLORS = {
  light: "#fafafa",
  dark: "#09090b",
} as const;

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function resolveTheme(stored: string | null): Theme {
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return getSystemTheme();
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLORS[theme]);
  }
}
