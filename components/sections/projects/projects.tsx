"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { projectsContent } from "@/lib/content/projects";
import { FeaturedProject } from "./featured-project";
import { ProjectsBackground } from "./projects-background";
import { MaskRevealContainer, MaskRevealItem, ScrollRevealText } from "@/components/motion";
import dynamic from "next/dynamic";

const ProjectPanel = dynamic(() => import("./project-panel").then(mod => mod.ProjectPanel), { ssr: false });

export function Projects() {
  const { heading, subheading, featured, secondary } = projectsContent;

  return (
    <Section
      id="projects"
      aria-labelledby="projects-heading"
      divider
      className="relative"
    >
      <ProjectsBackground />

      <Container size="wide" className="relative z-10">
        <MaskRevealContainer className="max-w-2xl 2xl:max-w-3xl">
          <Heading id="projects-heading" level={2}>
            {heading.split(" ").map((word, i) => (
              <MaskRevealItem key={i} className="mr-2 last:mr-0">{word}</MaskRevealItem>
            ))}
          </Heading>
          <div className="mt-4 block">
            <ScrollRevealText 
              text={subheading} 
              className="text-body leading-body text-foreground/90"
            />
          </div>
        </MaskRevealContainer>

        <div className="mt-14 2xl:mt-20 lg:px-8 xl:px-12 2xl:px-24">
          <FeaturedProject
            id={featured.id}
            name={featured.name}
            description={featured.description}
            tech={featured.tech}
            github={featured.github}
          />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2 lg:mt-12 lg:px-8 xl:px-12 2xl:gap-14 2xl:px-24">
          {secondary.map((project) => (
            <ProjectPanel key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
