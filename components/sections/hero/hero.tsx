"use client";

import { useRef } from "react";
import { ArrowUpRight, ChevronDown, FileText } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { HeroBackground } from "@/components/sections/hero/hero-background";
import { WhatIBuildCard } from "@/components/sections/hero/what-i-build-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HeroStaggerContainer, HeroStaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/heading";
import { heroContent } from "@/lib/content/hero";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const socialLinks = [
  { label: "GitHub", href: siteConfig.links.github, icon: GitHubIcon, external: true },
  { label: "LinkedIn", href: siteConfig.links.linkedin, icon: LinkedInIcon, external: true },
  { label: "Resume", href: heroContent.links.resume.href, icon: FileText, external: false },
] as const;

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [1, 0.92, 0.75]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -16]);
  const backgroundOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0.35]);

  return (
    <Section
      id="hero"
      aria-labelledby="hero-heading"
      spacing="sm"
      className={cn(
        "relative flex min-h-[calc(100dvh-var(--spacing-16))] flex-col items-start overflow-hidden !py-0",
        "pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-8",
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={reduceMotion ? undefined : { opacity: backgroundOpacity }}
      >
        <HeroBackground />
      </motion.div>

      <motion.div
        ref={heroRef}
        className="relative z-10 flex w-full flex-1 flex-col"
        style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
      >
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
            <HeroStaggerContainer className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <HeroStaggerItem>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface-elevated/80 px-3.5 py-1.5 text-xs font-medium tracking-wide text-foreground/70 shadow-sm backdrop-blur-sm">
                  {!reduceMotion ? (
                    <motion.span
                      className="relative flex size-2 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <motion.span
                        className="absolute inset-0 rounded-full bg-emerald-400"
                        animate={{ scale: [1, 2.2, 1], opacity: [0.45, 0, 0.45] }}
                        transition={{
                          duration: 1.1,
                          repeat: Infinity,
                          repeatDelay: 8.5,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.span
                        className="size-2 rounded-full bg-emerald-400"
                        animate={{
                          scale: [1, 1.18, 1],
                          boxShadow: [
                            "0 0 6px rgba(52,211,153,0.55), 0 0 2px rgba(110,231,183,0.8)",
                            "0 0 14px rgba(52,211,153,0.95), 0 0 6px rgba(110,231,183,1)",
                            "0 0 6px rgba(52,211,153,0.55), 0 0 2px rgba(110,231,183,0.8)",
                          ],
                        }}
                        transition={{
                          duration: 1.1,
                          repeat: Infinity,
                          repeatDelay: 8.5,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.span>
                  ) : (
                    <span
                      className="size-2 shrink-0 rounded-full bg-emerald-400 shadow-sm"
                      aria-hidden="true"
                    />
                  )}
                  {heroContent.availability.label}
                </span>
              </HeroStaggerItem>

              <HeroStaggerItem className="mt-5 sm:mt-6">
                <DisplayHeading id="hero-heading">{siteConfig.author.name}</DisplayHeading>
              </HeroStaggerItem>

              <HeroStaggerItem className="mt-4 space-y-3">
                <p className="text-h4 font-medium tracking-tight text-foreground/90">
                  {heroContent.role}
                </p>
                <p className="max-w-lg text-body leading-body text-foreground/85">
                  {heroContent.headline}
                </p>
              </HeroStaggerItem>

              <HeroStaggerItem className="mt-3.5 max-w-md">
                <p className="text-body-sm leading-body text-muted">
                  {heroContent.supporting}
                </p>
              </HeroStaggerItem>

              <HeroStaggerItem className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Button href={heroContent.ctas.primary.href} size="lg">
                  {heroContent.ctas.primary.label}
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Button>
                <Button href={heroContent.ctas.secondary.href} variant="secondary" size="lg">
                  {heroContent.ctas.secondary.label}
                </Button>
              </HeroStaggerItem>

              <HeroStaggerItem className="mt-6">
                <nav aria-label="Social links">
                  <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 lg:justify-start">
                    {socialLinks.map(({ label, href, icon: Icon, external }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="group inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <Icon className="size-4 transition-transform duration-200 group-hover:-translate-y-px" aria-hidden="true" />
                          <span className="relative">
                            {label}
                            <span className="absolute -bottom-px left-0 h-px w-0 bg-foreground/50 transition-all duration-200 group-hover:w-full" aria-hidden="true" />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </HeroStaggerItem>
            </HeroStaggerContainer>

            <WhatIBuildCard />
          </div>
        </Container>

        <motion.div
          className="mt-10 flex justify-center sm:mt-12 lg:mt-auto lg:pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0.2 : 0.95 }}
        >
          <a
            href="#experience"
            aria-label="Scroll to experience section"
            className="flex flex-col items-center gap-1 text-muted transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
            <motion.span
              animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
              transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex size-8 items-center justify-center rounded-full border border-border/55 bg-surface/35"
            >
              <ChevronDown className="size-4" aria-hidden="true" />
            </motion.span>
          </a>
        </motion.div>
      </motion.div>
    </Section>
  );
}
