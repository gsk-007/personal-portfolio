"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";
import { navItems, sectionIds, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const activeSection = useActiveSection(sectionIds);
  const isScrolled = useScrollThreshold(8);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b transition-colors duration-200",
        isScrolled
          ? "border-border bg-background/90 backdrop-blur-md"
          : "border-transparent bg-background",
      )}
    >
      <Container className="flex h-full items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-lg text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {siteConfig.logo}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.sectionId;

                return (
                  <li key={item.sectionId}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-200 sm:px-3",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "text-foreground"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
