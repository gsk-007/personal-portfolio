export type ProjectHighlight = {
  title: string;
  detail: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  highlights: ProjectHighlight[];
  tech: string[];
  github: string;
  live?: string;
  featured?: boolean;
};

export const projectsContent = {
  heading: "Projects",
  subheading:
    "Systems I've designed, built, and shipped — with emphasis on backend architecture, infrastructure, and production quality.",
  featured: {
    id: "zapurl",
    name: "ZapURL",
    description:
      "Production-grade URL shortening service with Redis caching, observability, and a test-driven workflow.",
    highlights: [
      {
        title: "Layered redirect path",
        detail:
          "Nanoid short codes with Redis cache lookups and PostgreSQL persistence for durable storage.",
      },
      {
        title: "Docker-native development",
        detail:
          "Compose-based environment with health checks, hot-reload, and isolated Vitest runs against real services.",
      },
      {
        title: "Built for observability",
        detail:
          "Structured logging with Winston and an optional Prometheus + Grafana monitoring profile.",
      },
    ],
    tech: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Vitest",
    ],
    github: "https://github.com/gsk-007/ZapURL",
  },
  secondary: [
    {
      id: "ticketing",
      name: "Ticketing Platform",
      description:
        "Microservices ticketing system deployed on Kubernetes with event-driven service communication.",
      highlights: [
        {
          title: "Service decomposition",
          detail:
            "Auth, tickets, orders, payments, and expiration as independent Node.js services.",
        },
        {
          title: "Event-driven coordination",
          detail:
            "NATS messaging between services with BullMQ-backed background job processing.",
        },
        {
          title: "K8s dev workflow",
          detail:
            "Skaffold dev loop, Traefik ingress routing, and Dockerized local cluster deployment.",
        },
      ],
      tech: [
        "Node.js",
        "MongoDB",
        "NATS",
        "BullMQ",
        "Docker",
        "Kubernetes",
      ],
      github: "https://github.com/gsk-007/ticketing",
    },
    {
      id: "mood",
      name: "Mood",
      description:
        "AI-powered mood journal that analyzes sentiment and surfaces patterns over time.",
      highlights: [
        {
          title: "LLM-powered insights",
          detail:
            "OpenAI mood prediction and entry summarization orchestrated with LangChain.",
        },
        {
          title: "Conversational layer",
          detail:
            "Ask questions about journal history with context-aware AI responses.",
        },
        {
          title: "Trend visualization",
          detail:
            "Sentiment charting to track mood patterns and average scores over time.",
        },
      ],
      tech: ["Next.js", "OpenAI API", "LangChain", "Tailwind CSS"],
      github: "https://github.com/gsk-007/mood",
    },
    {
      id: "vidquizai",
      name: "VidQuizAI",
      description:
        "Video-to-quiz pipeline that transcribes MP4 uploads and generates multiple-choice questions with AI.",
      highlights: [
        {
          title: "Multi-service pipeline",
          detail:
            "React frontend, Node.js API, and Python FastAPI service orchestrated for transcription and quiz generation.",
        },
        {
          title: "Async job processing",
          detail:
            "MongoDB persistence with Redis-backed queues and real-time status polling during video processing.",
        },
        {
          title: "Segmented output",
          detail:
            "Per-segment transcripts with generated questions and CSV export for offline use.",
        },
      ],
      tech: [
        "React",
        "Node.js",
        "FastAPI",
        "MongoDB",
        "Redis",
        "Ollama",
      ],
      github: "https://github.com/gsk-007/VidQuizAI",
    },
    {
      id: "ai-agent-gemini",
      name: "AI Agent (Gemini)",
      description:
        "Modular TypeScript AI agent powered by Google Gemini's free tier with extensible tools and memory.",
      highlights: [
        {
          title: "Gemini-native agent",
          detail:
            "Built on @google/genai instead of OpenAI for zero-cost agent prototyping and experimentation.",
        },
        {
          title: "Modular architecture",
          detail:
            "Separated agent, tools, memory, and types modules for clean extension and reasoning workflows.",
        },
        {
          title: "CLI-driven interaction",
          detail:
            "TypeScript entry point for direct agent conversations with environment-based API key config.",
        },
      ],
      tech: ["TypeScript", "Node.js", "Google Gemini API"],
      github: "https://github.com/gsk-007/ai-agent-gemini",
    },
  ] satisfies ProjectItem[],
} as const;
