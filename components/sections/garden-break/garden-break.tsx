"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Blocks, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { encouragementScratchContent } from "@/lib/content/encouragement-scratch";
import { cn } from "@/lib/utils";
import { EncouragementScratch } from "./encouragement-scratch";
import { SmashBlocks } from "./smash-blocks";

type TabId = "smash" | "scratch";

interface TabItem {
  id: TabId;
  label: string;
  icon: typeof Blocks;
}

const TABS: TabItem[] = [
  { id: "smash", label: "Smash the Blocks", icon: Blocks },
  { id: "scratch", label: "Scratch Card", icon: Sparkles },
];

export function GardenBreak() {
  const [activeTab, setActiveTab] = useState<TabId>("smash");

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % TABS.length;
      setActiveTab(TABS[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + TABS.length) % TABS.length;
      setActiveTab(TABS[prevIndex].id);
    }
  };

  return (
    <Section
      divider
      spacing="sm"
      aria-labelledby="before-you-go-heading"
      className="relative"
    >
      <Container size="wide" className="relative z-10">
        {/* Top Centered Section Header & Apple-style Segmented Control */}
        <div className="flex flex-col items-center text-center">
          <div className="max-w-xl">
            <Heading id="before-you-go-heading" level={2}>
              {encouragementScratchContent.heading}
            </Heading>
            <p className="mt-3 text-body leading-body text-muted">
              {activeTab === "smash"
                ? "Bounce the ball and smash through 5 arcade levels to unlock a secret message."
                : encouragementScratchContent.subtitle}
            </p>
          </div>

          {/* Apple-style Pill Segmented Control in Top Center */}
          <div className="mt-6 flex justify-center">
            <div
              role="tablist"
              aria-label="Interactive break activities"
              className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface-elevated/90 p-1 shadow-sm backdrop-blur-md"
            >
              {TABS.map((tab, index) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={cn(
                      "relative z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "text-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5 sm:size-4" />
                    <span>{tab.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="garden-break-active-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-border/70 bg-surface shadow-sm light:bg-white light:shadow-sm"
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.45,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Panels */}
        <div className="relative mt-8">
          {/* Smash the Blocks Tab Panel */}
          <div
            id="panel-smash"
            role="tabpanel"
            aria-labelledby="tab-smash"
            className={activeTab === "smash" ? "block" : "hidden"}
          >
            <SmashBlocks />
          </div>

          {/* Scratch Card Tab Panel (preserved and mounted) */}
          <div
            id="panel-scratch"
            role="tabpanel"
            aria-labelledby="tab-scratch"
            className={activeTab === "scratch" ? "block" : "hidden"}
          >
            <EncouragementScratch hideHeader className="w-full" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
