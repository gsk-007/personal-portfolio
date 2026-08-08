"use client";

import type { ComponentType, SVGProps } from "react";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
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

type ContactCopyLinksProps = {
  channels: readonly ContactChannel[];
  copiedLabel: string;
  className?: string;
};

const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  email: Mail,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
};

export function ContactCopyLinks({
  channels,
  copiedLabel,
  className,
}: ContactCopyLinksProps) {
  return (
    <nav aria-label="Contact links" className={className}>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
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
      </ul>
    </nav>
  );
}
