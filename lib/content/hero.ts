import { siteConfig } from "@/lib/site-config";

export const heroContent = {
  role: "Software Engineer",
  headline:
    "Building products from frontend to backend, with a growing focus on scalable systems and cloud infrastructure.",
  supporting: "Curious. Practical. Easy to work with.",
  availability: {
    label: "At Laitkor Consultancy Services",
  },
  ctas: {
    primary: {
      label: "View Projects",
      href: "#projects",
    },
    secondary: {
      label: "Contact Me",
      href: "#contact",
    },
  },
  links: {
    resume: {
      label: "Resume",
      href: siteConfig.links.resume,
    },
  },
} as const;

export const whatIBuild = {
  title: "What I Build",
  items: [
    {
      title: "Legacy Modernization",
      subtitle: "React • Electron • Angular",
      icon: "layers" as const,
    },
    {
      title: "Backend Systems",
      subtitle: "Node.js • APIs • TypeScript",
      icon: "server" as const,
    },
    {
      title: "Cloud & DevOps",
      subtitle: "AWS • Docker • CI/CD",
      icon: "cloud" as const,
    },
    {
      title: "AI-powered Applications",
      subtitle: "LLMs • RAG • Automation",
      icon: "sparkles" as const,
    },
  ],
} as const;
