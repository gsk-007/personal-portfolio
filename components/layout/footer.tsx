import Link from "next/link";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site-config";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
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
            <li>
              <FooterLink href={siteConfig.links.github} label="GitHub" />
            </li>
            <li>
              <FooterLink href={siteConfig.links.linkedin} label="LinkedIn" />
            </li>
            <li>
              <FooterLink
                href={`mailto:${siteConfig.author.email}`}
                label="Email"
              />
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}

type FooterLinkProps = {
  href: string;
  label: string;
};

function FooterLink({ href, label }: FooterLinkProps) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-sm text-muted transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  );
}
