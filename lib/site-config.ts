export const siteConfig = {
  name: "Gursimrat Kalra",
  logo: "GSK",
  title: "Gursimrat Kalra | Software Engineer",
  description:
    "Full Stack Engineer building reliable backend systems, modern web applications, and production software on AWS.",
  url: "https://example.com",
  author: {
    name: "Gursimrat Kalra",
    email: "gsingh16472@gmail.com",
  },
  links: {
    github: "https://github.com/gsk-007",
    linkedin: "https://linkedin.com/in/gursimrat-kalra",
    resume: "/resume.pdf",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  sectionId: string;
};

export const navItems: NavItem[] = [
  { label: "Experience", href: "#experience", sectionId: "experience" },
  { label: "Projects", href: "#projects", sectionId: "projects" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export const sectionIds = navItems.map((item) => item.sectionId);
