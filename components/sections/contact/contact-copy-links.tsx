"use client";

import type { ComponentType, SVGProps } from "react";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { SocialLink } from "@/components/ui/social-link";
import { cn } from "@/lib/utils";

type ContactChannel = {
  id: string;
  label: string;
  href: string;
  copyValue: string;
  copyLabel: string;
  external?: boolean;
};

type EmailCta = {
  href: string;
  label: string;
  copyValue: string;
  copyLabel: string;
};

type ContactCopyLinksProps = {
  channels: readonly ContactChannel[];
  copiedLabel: string;
  emailCta: EmailCta;
  className?: string;
};

const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
};

export function ContactCopyLinks({
  channels,
  copiedLabel,
  emailCta,
  className,
}: ContactCopyLinksProps) {
  return (
    <nav aria-label="Contact links" className={className}>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {channels.map((channel) => {
          const Icon = icons[channel.id];

          return (
            <li key={channel.id} className="flex items-center gap-2">
              <SocialLink
                href={channel.href}
                label={channel.label}
                icon={Icon}
                external={channel.external}
              />
              <CopyButton
                value={channel.copyValue}
                label={channel.copyLabel}
                copiedLabel={copiedLabel}
              />
            </li>
          );
        })}

        <li className="flex items-center gap-2">
          <Button href={emailCta.href} size="lg">
            <Mail className="size-4" aria-hidden="true" />
            {emailCta.label}
          </Button>
          <CopyButton
            value={emailCta.copyValue}
            label={emailCta.copyLabel}
            copiedLabel={copiedLabel}
          />
        </li>
      </ul>
    </nav>
  );
}
