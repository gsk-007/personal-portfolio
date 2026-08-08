import { siteConfig } from "@/lib/site-config";

export const contactContent = {
  sectionHeading: "Contact",
  title: "Let's build something.",
  message:
    "If you're building backend systems, shipping products, or exploring AI — I'd love to hear about it.",
  status: {
    label: "Open to opportunities",
  },
  ctas: {
    email: {
      label: "Email me",
    },
  },
  copy: {
    copied: "Copied",
    email: "Copy email",
    github: "Copy GitHub link",
    linkedin: "Copy LinkedIn link",
  },
  email: siteConfig.author.email,
  urls: {
    mailto: `mailto:${siteConfig.author.email}`,
    github: siteConfig.links.github,
    linkedin: siteConfig.links.linkedin,
  },
  channels: [
    {
      id: "github",
      label: "GitHub",
      href: siteConfig.links.github,
      copyValue: siteConfig.links.github,
      copyLabel: "Copy GitHub link",
      external: true,
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:${siteConfig.author.email}`,
      copyValue: siteConfig.author.email,
      copyLabel: "Copy email",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: siteConfig.links.linkedin,
      copyValue: siteConfig.links.linkedin,
      copyLabel: "Copy LinkedIn link",
      external: true,
    },
  ],
} as const;
