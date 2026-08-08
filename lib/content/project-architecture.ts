export type ArchitectureNode = {
  id: string;
  label: string;
  sublabel?: string;
  techKeys?: string[];
};

export type ProjectArchitecture = {
  nodes: ArchitectureNode[];
};

export const projectArchitectures: Record<string, ProjectArchitecture> = {
  zapurl: {
    nodes: [
      { id: "url", label: "URL", sublabel: "Request" },
      {
        id: "api",
        label: "Express API",
        sublabel: "Node.js",
        techKeys: ["Node.js", "TypeScript", "Docker"],
      },
      {
        id: "redis",
        label: "Redis",
        sublabel: "Cache",
        techKeys: ["Redis"],
      },
      {
        id: "postgres",
        label: "PostgreSQL",
        sublabel: "Store",
        techKeys: ["PostgreSQL"],
      },
      {
        id: "metrics",
        label: "Metrics",
        sublabel: "Observability",
      },
    ],
  },
  ticketing: {
    nodes: [
      { id: "ingress", label: "Traefik", sublabel: "Ingress" },
      { id: "services", label: "Services", sublabel: "Node.js" },
      { id: "nats", label: "NATS", sublabel: "Events" },
      { id: "mongo", label: "MongoDB", sublabel: "Store" },
    ],
  },
  mood: {
    nodes: [
      { id: "user", label: "User", sublabel: "Journal" },
      { id: "next", label: "Next.js", sublabel: "App" },
      { id: "langchain", label: "LangChain", sublabel: "Orchestration" },
      { id: "openai", label: "OpenAI", sublabel: "LLM" },
    ],
  },
  vidquizai: {
    nodes: [
      { id: "upload", label: "Upload", sublabel: "MP4" },
      { id: "node", label: "Node API", sublabel: "Queue" },
      { id: "python", label: "FastAPI", sublabel: "AI" },
      { id: "mongo", label: "MongoDB", sublabel: "Store" },
    ],
  },
  "ai-agent-gemini": {
    nodes: [
      { id: "cli", label: "CLI", sublabel: "Input" },
      { id: "agent", label: "Agent", sublabel: "Core" },
      { id: "tools", label: "Tools", sublabel: "Extend" },
      { id: "gemini", label: "Gemini", sublabel: "API" },
    ],
  },
};
