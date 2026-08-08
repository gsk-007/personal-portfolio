import { Container } from "@/components/layout/container";
import { sectionDividerClass } from "@/lib/section-styles";
import { SocialLink } from "@/components/ui/social-link";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const currentYear = new Date().getFullYear();

const footerLinks = [
  { label: "GitHub", href: siteConfig.links.github, external: true },
  { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
  {
    label: "Email",
    href: `mailto:${siteConfig.author.email}`,
    external: false,
  },
] as const;

const builtWithLinkClass =
  "text-muted underline-offset-4 transition-colors duration-200 hover:text-foreground/85 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

export function Footer() {
  return (
    <footer className={cn(sectionDividerClass, "bg-surface")}>
      <Container className="space-y-5 py-8 sm:py-10">
        <div
          className="flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <p>
            &copy; {currentYear} {siteConfig.author.name}
          </p>

          <p>
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className={builtWithLinkClass}
            >
              Next.js
            </a>
            <span className="text-muted/45"> · </span>
            <a
              href="https://www.framer.com/motion/"
              target="_blank"
              rel="noopener noreferrer"
              className={builtWithLinkClass}
            >
              Framer Motion
            </a>
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {footerLinks.map(({ label, href, external }) => (
              <li key={label}>
                <SocialLink href={href} label={label} external={external} />
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
