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
  personalSignoff: {
    heading: "Not everything here is about code.",
    closing: "Pick a topic. I'll probably have something to say.",
    interests: [
      {
        id: "guitar",
        emoji: "🎸",
        label: "Guitar",
        hint: "Still learning — mostly chords and late-night strumming.",
      },
      {
        id: "football",
        emoji: "⚽",
        label: "Football",
        hint: "Premier League weekends are non-negotiable.",
      },
      {
        id: "table-tennis",
        emoji: "🏓",
        label: "Table Tennis",
        hint: "Fast hands, slow ego.",
      },
      {
        id: "fitness",
        emoji: "🏋️",
        label: "Fitness",
        hint: "Gym's where I debug my own consistency.",
      },
      {
        id: "reading",
        emoji: "📚",
        label: "Reading",
        hint: "Usually fiction, occasionally a technical rabbit hole.",
      },
    ],
  },
} as const;
