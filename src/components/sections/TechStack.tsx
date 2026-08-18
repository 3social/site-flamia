'use client';

import { techStack, categoryLabels } from "@/lib/stack";
import { SITE_CONFIG } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function TechStack() {
  return (
    <section id="tecnologia" className="py-20 md:py-32 bg-[#0A0E1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="font-syne font-bold text-4xl md:text-5xl text-[#F8FAFC] mb-4">
              {SITE_CONFIG.sections.stack.title}
            </h2>
            <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">
              {SITE_CONFIG.sections.stack.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Tech Grid - Simple Logo Wall */}
        <ScrollReveal direction="up" stagger={true} staggerDelay={0.05} delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {techStack.map((item) => (
            <div
              key={item.id}
              className="group relative p-6 bg-[#111827] border border-[#1E293B] rounded-lg hover:border-[#7C3AED] transition-all duration-300 flex items-center justify-center aspect-square"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/0 to-[#D946EF]/0 group-hover:from-[#7C3AED]/10 group-hover:to-[#D946EF]/10 rounded-lg transition-all duration-300" />

              {/* Logo/Icon */}
              <div className="relative z-10 text-center">
                <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">
                  {item.id === "claude" && "🧠"}
                  {item.id === "openai" && "⚙️"}
                  {item.id === "assemblyai" && "🎙️"}
                  {item.id === "vapi" && "📞"}
                  {item.id === "retell" && "📱"}
                  {item.id === "telnyx" && "☎️"}
                  {item.id === "n8n" && "🔗"}
                  {item.id === "make" && "⚡"}
                  {item.id === "ghl" && "📊"}
                  {item.id === "brevo" && "✉️"}
                  {item.id === "nextjs" && "▲"}
                  {item.id === "react" && "⚛️"}
                  {item.id === "typescript" && "📘"}
                  {item.id === "supabase" && "🟢"}
                  {item.id === "postgresql" && "🐘"}
                  {item.id === "stripe" && "💳"}
                </div>
                <p className="text-sm font-medium text-[#94A3B8] group-hover:text-[#7C3AED] transition-colors">
                  {item.name}
                </p>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F1629] text-[#F8FAFC] text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#1E293B]">
                {categoryLabels[item.category]}
              </div>
            </div>
          ))}
          </div>
        </ScrollReveal>

        {/* Info Box */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="mt-16 p-8 bg-gradient-to-r from-[#7C3AED]/10 to-[#D946EF]/10 border border-[#7C3AED]/20 rounded-2xl">
            <h3 className="font-syne font-bold text-xl text-[#F8FAFC] mb-4">
              Construido para producción
            </h3>
            <p className="text-[#94A3B8] mb-4">
              Cada herramienta en nuestro stack ha sido probada en producción con clientes reales. No experimentamos en tu proyecto — implementamos soluciones que ya funcionan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-[#F8FAFC] mb-1">Escalable</p>
                <p className="text-[#94A3B8]">Desde startups hasta enterprise</p>
              </div>
              <div>
                <p className="font-medium text-[#F8FAFC] mb-1">Integrado</p>
                <p className="text-[#94A3B8]">Conecta perfectamente con tu infraestructura</p>
              </div>
              <div>
                <p className="font-medium text-[#F8FAFC] mb-1">Mantenible</p>
                <p className="text-[#94A3B8]">Código limpio, documentación clara</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
