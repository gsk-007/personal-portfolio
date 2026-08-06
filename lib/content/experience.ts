export type ExperienceItem = {
  id: string;
  role: string;
  navLabel: string;
  company: string;
  duration: string;
  location: string;
  achievements: [string, string];
  tech: string[];
};

export const experienceContent = {
  heading: "Experience",
  items: [
    {
      id: "laitkor-cs",
      role: "Software Engineer",
      navLabel: "Software Engineer",
      company: "Laitkor Consultancy Services",
      duration: "Feb 2026 — Present",
      location: "Lucknow, India",
      achievements: [
        "Ship Next.js apps and Node.js services for call transcription, voicemail, and SMS via AssemblyAI, migrating to event-driven webhooks.",
        "Migrated Electron 9→37 across 28 releases, upgrading React, Node.js, Webpack, and 100+ dependencies toward full mobile parity.",
      ],
      tech: [
        "Next.js",
        "React",
        "Electron",
        "Node.js",
        "TypeScript",
        "AWS",
        "AssemblyAI",
      ],
    },
    {
      id: "laitkor-labs",
      role: "DevOps Engineer (Contract)",
      navLabel: "DevOps Engineer",
      company: "Laitkor Labs",
      duration: "Jul 2025 — Jan 2026",
      location: "Lucknow, India",
      achievements: [
        "Architected CI/CD with GitHub Actions and Dockerized AWS deployments across Linux and Windows.",
        "Built RAG search, Whisper transcription, and embeddable chatbots on Next.js, PostgreSQL, and Prisma.",
      ],
      tech: [
        "AWS",
        "Docker",
        "GitHub Actions",
        "Next.js",
        "Node.js",
        "Prisma",
        "PostgreSQL",
        "Aurora MySQL",
      ],
    },
    {
      id: "inovaare-associate",
      role: "Associate Product Engineer",
      navLabel: "Associate Product Engineer",
      company: "Inovaare Cloud Solutions",
      duration: "Jul 2024 — Dec 2024",
      location: "Bhubaneswar, India",
      achievements: [
        "Upgraded Angular v8→17 to unblock compliance requirements and enable new feature development.",
        "Optimized MongoDB queries, cutting database load by 60% and improving UI response time by 40%.",
      ],
      tech: ["Angular", "TypeScript", "MongoDB"],
    },
    {
      id: "inovaare-trainee",
      role: "Trainee Product Engineer",
      navLabel: "Trainee Product Engineer",
      company: "Inovaare Cloud Solutions",
      duration: "Jan 2024 — Jun 2024",
      location: "Bhubaneswar, India",
      achievements: [
        "Led a 5-member evaluation of low-code tools and delivered a working FlutterFlow prototype.",
        "Shipped an Angular dynamic form generator that reduced manual product configuration work.",
      ],
      tech: ["Angular", "FlutterFlow", "TypeScript", "REST APIs"],
    },
  ] satisfies ExperienceItem[],
} as const;
