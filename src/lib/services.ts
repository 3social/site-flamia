export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  details: string[];
  stack: string[];
  cta: string;
  href: string;
}

export const services: Service[] = [
  {
    id: "conversational-ai",
    icon: "bot",
    title: "Agentes Conversacionales",
    description: "Agentes de IA que califican y nutren leads 24/7 en WhatsApp, web chat e Instagram.",
    details: [
      "Responden en tiempo real como humanos",
      "Califican leads automáticamente",
      "Escalan a humano cuando es necesario",
      "Integración con tu CRM",
    ],
    stack: ["Claude API", "OpenAI", "n8n", "GoHighLevel"],
    cta: "Ver más",
    href: "/servicios#conversational",
  },
  {
    id: "voice-ai",
    icon: "phone",
    title: "Agentes de Voz",
    description: "Agentes que llaman, califican leads y agendan citas sin intervención humana.",
    details: [
      "Llamadas en español con acento natural",
      "Confirmación automática de citas",
      "Cobranza amigable",
      "Reportes en tiempo real",
    ],
    stack: ["VAPI", "Retell", "Telnyx", "GHL"],
    cta: "Ver más",
    href: "/servicios#voice",
  },
  {
    id: "crm-automation",
    icon: "zap",
    title: "Automatización CRM",
    description: "Implementación y migración completa de GoHighLevel con workflows automatizados.",
    details: [
      "Setup completo de GoHighLevel",
      "Pipelines personalizados",
      "Workflows de seguimiento",
      "Capacitación de equipo",
    ],
    stack: ["GoHighLevel", "n8n", "Brevo", "Make"],
    cta: "Ver más",
    href: "/servicios#crm",
  },
  {
    id: "web-development",
    icon: "code",
    title: "Desarrollo Web y SaaS",
    description: "Plataformas web a medida, desde landing pages hasta SaaS completos.",
    details: [
      "Desarrollo full-stack personalizado",
      "Integración con APIs",
      "Bases de datos escalables",
      "Soporte post-lanzamiento",
    ],
    stack: ["Next.js", "Supabase", "PostgreSQL", "Stripe"],
    cta: "Ver más",
    href: "/servicios#development",
  },
];

export const iconMap: Record<string, React.ReactNode> = {
  bot: "🤖",
  phone: "📞",
  zap: "⚡",
  code: "💻",
};
