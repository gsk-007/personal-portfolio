import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col" tabIndex={-1}>
      <Hero />
      <Experience />
    </main>
  );
}
