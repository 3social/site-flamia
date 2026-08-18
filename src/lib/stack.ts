export interface StackItem {
  id: string;
  name: string;
  category: "ai" | "voice" | "automation" | "crm" | "web" | "payments";
  logo: string; // path to SVG or image
}

export const techStack: StackItem[] = [
  // AI & LLMs
  { id: "claude", name: "Claude API", category: "ai", logo: "/logos/stack/claude.svg" },
  { id: "openai", name: "OpenAI GPT-4o", category: "ai", logo: "/logos/stack/openai.svg" },
  { id: "assemblyai", name: "AssemblyAI", category: "ai", logo: "/logos/stack/assemblyai.svg" },

  // Voice
  { id: "vapi", name: "VAPI", category: "voice", logo: "/logos/stack/vapi.svg" },
  { id: "retell", name: "Retell", category: "voice", logo: "/logos/stack/retell.svg" },
  { id: "telnyx", name: "Telnyx", category: "voice", logo: "/logos/stack/telnyx.svg" },

  // Automation & CRM
  { id: "n8n", name: "n8n", category: "automation", logo: "/logos/stack/n8n.svg" },
  { id: "make", name: "Make", category: "automation", logo: "/logos/stack/make.svg" },
  { id: "ghl", name: "GoHighLevel", category: "crm", logo: "/logos/stack/ghl.svg" },
  { id: "brevo", name: "Brevo", category: "crm", logo: "/logos/stack/brevo.svg" },

  // Web Stack
  { id: "nextjs", name: "Next.js", category: "web", logo: "/logos/stack/nextjs.svg" },
  { id: "react", name: "React", category: "web", logo: "/logos/stack/react.svg" },
  { id: "typescript", name: "TypeScript", category: "web", logo: "/logos/stack/typescript.svg" },
  { id: "supabase", name: "Supabase", category: "web", logo: "/logos/stack/supabase.svg" },
  { id: "postgresql", name: "PostgreSQL", category: "web", logo: "/logos/stack/postgresql.svg" },

  // Payments
  { id: "stripe", name: "Stripe", category: "payments", logo: "/logos/stack/stripe.svg" },
];

export const stackByCategory = techStack.reduce(
  (acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  },
  {} as Record<string, StackItem[]>
);

export const categoryLabels: Record<string, string> = {
  ai: "Inteligencia Artificial",
  voice: "Voz & Comunicación",
  automation: "Automatización",
  crm: "CRM & Marketing",
  web: "Web & Backend",
  payments: "Pagos",
};
