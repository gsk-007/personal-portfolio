"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { projectsContent } from "@/lib/content/projects";
import { FeaturedProject } from "./featured-project";
import { ProjectPanel } from "./project-panel";
import { ProjectsBackground } from "./projects-background";

export function Projects() {
  const { heading, subheading, featured, secondary } = projectsContent;

  return (
    <Section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative"
    >
      <ProjectsBackground />

      <Container className="relative z-10">
        <div className="max-w-2xl">
          <Heading id="projects-heading" level={2}>
            {heading}
          </Heading>
          <p className="mt-4 text-body leading-body text-muted">
            {subheading}
          </p>
        </div>

        <div className="mt-14">
          <FeaturedProject
            id={featured.id}
            name={featured.name}
            description={featured.description}
            tech={featured.tech}
            github={featured.github}
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:mt-10">
          {secondary.map((project) => (
            <ProjectPanel key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
