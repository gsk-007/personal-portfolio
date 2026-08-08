import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { contactContent } from "@/lib/content/contact";
import { sectionCardClass, sectionCardPaddingClass } from "@/lib/section-styles";
import { cn } from "@/lib/utils";
import { ContactBackground } from "./contact-background";
import { ContactCopyLinks } from "./contact-copy-links";
import { ContactPersonalSignoff } from "./contact-personal-signoff";

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
    email,
    personalSignoff,
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

        <div className={cn(sectionCardClass, sectionCardPaddingClass, "mt-8 w-full sm:mt-10")}>
          <Badge showIndicator className="text-foreground/70">
            {status.label}
          </Badge>

          <h3
            id="contact-title"
            className="mt-4 text-h2 font-semibold tracking-tight text-foreground sm:mt-5"
          >
            {title}
          </h3>

          <p className="mt-4 max-w-xl text-body leading-body text-muted sm:mt-5">
            {message}
          </p>

          <ContactCopyLinks
            channels={channels}
            copiedLabel={copy.copied}
            emailCta={{
              href: urls.mailto,
              label: ctas.email.label,
              copyValue: email,
              copyLabel: copy.email,
            }}
            className="mt-6 border-t border-border/50 pt-6"
          />

          <ContactPersonalSignoff
            content={personalSignoff}
            className="mt-8 sm:mt-10"
          />
        </div>
      </Container>
    </Section>
  );
}
