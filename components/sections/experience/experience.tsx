"use client";

import { AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ExperienceBackground } from "@/components/sections/experience/experience-background";
import { ExperienceNav } from "@/components/sections/experience/experience-nav";
import { ExperiencePanel } from "@/components/sections/experience/experience-panel";
import { Heading } from "@/components/ui/heading";
import { useActiveExperience } from "@/hooks/use-active-experience";
import { experienceContent } from "@/lib/content/experience";

export function Experience() {
  const { items, heading } = experienceContent;
  const { activeIndex, setChapterRef: getChapterRef, scrollToChapter } =
    useActiveExperience(items.length);
  const activeExperience = items[activeIndex] ?? items[0];

  return (
    <Section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative"
    >
      <ExperienceBackground activeIndex={activeIndex} itemCount={items.length} />

      <Container className="relative z-10">
        <Heading id="experience-heading" level={2}>
          {heading}
        </Heading>

        <div className="mt-14 hidden lg:grid lg:grid-cols-4 lg:gap-16">
          <aside className="col-span-1">
            <div className="sticky top-24">
              <ExperienceNav
                items={items}
                activeIndex={activeIndex}
                onSelect={scrollToChapter}
              />
            </div>
          </aside>

          <div
            className="relative col-span-3"
            style={{ minHeight: `${items.length * 100}vh` }}
          >
            <div className="sticky top-24 z-10">
              <AnimatePresence mode="wait">
                <ExperiencePanel
                  key={activeExperience.id}
                  experience={activeExperience}
                />
              </AnimatePresence>
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                ref={getChapterRef(index)}
                className="pointer-events-none absolute inset-x-0 h-screen"
                style={{ top: `${index * 100}vh` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="mt-14 space-y-8 lg:hidden">
          {items.map((item) => (
            <ExperiencePanel
              key={item.id}
              experience={item}
              animated={false}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
