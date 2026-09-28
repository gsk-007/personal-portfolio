"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";
import { navItems, sectionIds, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const activeSection = useActiveSection(sectionIds);
  const isScrolled = useScrollThreshold(8);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const activePill = hoveredSection ?? activeSection;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b transition-colors duration-200",
        isScrolled
          ? "border-border bg-background/90 backdrop-blur-md"
          : "border-transparent bg-background",
      )}
    >
      <Container size="wide" className="flex h-full items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-lg text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {siteConfig.logo}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Primary" onMouseLeave={() => setHoveredSection(null)}>
            <ul className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.sectionId;
                const isPillActive = activePill === item.sectionId;

                return (
                  <li key={item.sectionId} className="relative flex">
                    <a
                      href={item.href}
                      onMouseEnter={() => setHoveredSection(item.sectionId)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative z-10 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-200 sm:px-3",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive || isPillActive
                          ? "text-foreground"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </a>

                    {isPillActive && (
                      <motion.div
                        layoutId="header-nav-pill"
                        className="absolute inset-0 z-0 rounded-lg bg-surface-elevated/70 shadow-sm border border-border/40"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
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
