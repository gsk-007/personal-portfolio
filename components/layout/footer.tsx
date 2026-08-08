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

export function Footer() {
  return (
    <footer className={cn(sectionDividerClass, "bg-surface")}>
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {siteConfig.author.name}
          </p>
          <p className="text-sm text-muted">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
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
