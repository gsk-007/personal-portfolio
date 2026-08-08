import { GardenBreak } from "@/components/sections/garden-break";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";

export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col" tabIndex={-1}>
      <Hero />
      <Experience />
      <Projects />
      <GardenBreak />
      <Contact />
    </main>
  );
}
