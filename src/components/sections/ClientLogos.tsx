'use client';

import { clients, clientPlaceholders } from "@/lib/clients";
import { SITE_CONFIG } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function ClientLogos() {
  const displayClients = clients.length > 0 ? clients : clientPlaceholders;
  const isEmpty = clients.length === 0;

  return (
    <section id="clientes" className="py-20 md:py-32 bg-[#0F1629]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="font-syne font-bold text-4xl md:text-5xl text-[#F8FAFC] mb-4">
              {SITE_CONFIG.sections.clients.title}
            </h2>
            <p className="text-lg text-[#94A3B8]">
              {SITE_CONFIG.sections.clients.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" stagger={true} staggerDelay={0.08} delay={0.1}>
          {isEmpty ? (
            // Placeholder Grid
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {displayClients.map((client) => (
                <div
                  key={client.id}
                  className="group relative p-8 bg-[#111827] border border-[#1E293B] rounded-lg hover:border-[#7C3AED] transition-all duration-300 h-32 flex items-center justify-center overflow-hidden"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />

                  <div className="relative z-10 text-center">
                    <p className="text-sm text-[#94A3B8] font-medium mb-2">
                      {client.industry}
                    </p>
                    <p className="text-xs text-[#94A3B8]">{client.country}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Actual Clients Grid
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {displayClients.map((client) => (
                <div
                  key={client.id}
                  className="group relative p-8 bg-[#111827] border border-[#1E293B] rounded-lg hover:border-[#7C3AED] transition-all duration-300 h-32 flex flex-col items-center justify-center"
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/0 to-[#D946EF]/0 group-hover:from-[#7C3AED]/5 group-hover:to-[#D946EF]/5 rounded-lg transition-all duration-300" />

                  {/* Logo Container */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="max-w-[80%] max-h-[80%] object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-xs font-medium text-[#94A3B8]">
                          {client.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0F1629] text-[#F8FAFC] text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#1E293B]">
                    {client.industry} • {client.country}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>

        {isEmpty && (
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-12 text-center p-8 bg-[#111827] border border-[#1E293B] rounded-lg">
              <p className="text-[#94A3B8] mb-4">
                Nuestros clientes confían en nosotros para automatizar sus operaciones.
              </p>
              <p className="text-sm text-[#94A3B8]">
                ¿Quieres ser el próximo? Agenda tu llamada hoy.
              </p>
              <a
                href={SITE_CONFIG.contact.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-4 px-6 py-2 bg-gradient-to-r from-[#7C3AED] to-[#D946EF] text-[#F8FAFC] font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Agenda una llamada
              </a>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
