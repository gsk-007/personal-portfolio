import { Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { contactContent } from "@/lib/content/contact";
import { sectionCardClass, sectionCardPaddingClass } from "@/lib/section-styles";
import { cn } from "@/lib/utils";
import { ContactBackground } from "./contact-background";
import { ContactCopyLinks } from "./contact-copy-links";

export function Contact() {
  const {
    sectionHeading,
    title,
    message,
    status,
    ctas,
    copy,
    urls,
    channels,
  } = contactContent;

  return (
    <Section
      id="contact"
      aria-labelledby="contact-heading"
      divider
      className="relative"
    >
      <ContactBackground />

      <Container className="relative z-10">
        <Heading id="contact-heading" level={2}>
          {sectionHeading}
        </Heading>

        <div className={cn(sectionCardClass, sectionCardPaddingClass, "mt-14 w-full")}>
          <Badge showIndicator className="text-foreground/70">
            {status.label}
          </Badge>

          <h3
            id="contact-title"
            className="mt-6 text-h2 font-semibold tracking-tight text-foreground"
          >
            {title}
          </h3>

          <p className="mt-4 max-w-xl text-body leading-body text-muted">
            {message}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button href={urls.mailto} size="lg" className="w-full sm:w-auto">
              <Mail className="size-4" aria-hidden="true" />
              {ctas.email.label}
            </Button>
          </div>

          <ContactCopyLinks
            channels={channels}
            copiedLabel={copy.copied}
            className="mt-8 border-t border-border/50 pt-8"
          />
        </div>
      </Container>
    </Section>
  );
}
