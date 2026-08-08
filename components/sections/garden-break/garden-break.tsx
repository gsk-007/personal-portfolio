import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EncouragementScratch } from "./encouragement-scratch";

export function GardenBreak() {
  return (
    <Section
      divider
      spacing="sm"
      aria-labelledby="before-you-go-heading"
      className="relative"
    >
      <Container className="relative z-10">
        <EncouragementScratch className="w-full" />
      </Container>
    </Section>
  );
}
