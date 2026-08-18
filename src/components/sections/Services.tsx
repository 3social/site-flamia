'use client';

import { services, iconMap } from "@/lib/services";
import { SITE_CONFIG } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Services() {
  return (
    <section id="servicios" className="py-20 md:py-32 bg-[#0A0E1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up" duration={0.8}>
          <div className="text-center mb-16">
            <h2 className="font-syne font-bold text-4xl md:text-5xl text-[#F8FAFC] mb-4">
              {SITE_CONFIG.sections.services.title}
            </h2>
            <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">
              {SITE_CONFIG.sections.services.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Services Grid - Smaller and more compact */}
        <ScrollReveal direction="up" stagger={true} staggerDelay={0.15} delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative p-5 bg-[#111827] border border-[#1E293B] rounded-xl hover:border-[#7C3AED] transition-all duration-300 hover:bg-[#0F1629]"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/0 to-[#D946EF]/0 group-hover:from-[#7C3AED]/5 group-hover:to-[#D946EF]/5 rounded-xl transition-all duration-300 -z-10" />

                {/* Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#D946EF] rounded-lg flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform">
                  {iconMap[service.icon] || "✨"}
                </div>

                {/* Content */}
                <h3 className="font-syne font-bold text-sm md:text-base text-[#F8FAFC] mb-2">
                  {service.title}
                </h3>
                <p className="text-[#94A3B8] mb-3 text-xs md:text-sm leading-tight">
                  {service.description}
                </p>

                {/* Features - Minimal */}
                <ul className="space-y-1 mb-3">
                  {service.details.slice(0, 2).map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-1 text-xs text-[#94A3B8]"
                    >
                      <span className="text-[#7C3AED] font-bold flex-shrink-0">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Stack Technologies - Minimal */}
                <div className="mb-3 pb-3 border-b border-[#1E293B]">
                  <p className="text-xs text-[#94A3B8] mb-1 font-medium">STACK:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.stack.slice(0, 1).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-[#0F1629] border border-[#1E293B] text-xs text-[#94A3B8] rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {service.stack.length > 1 && (
                      <span className="px-1.5 py-0.5 bg-[#0F1629] border border-[#1E293B] text-xs text-[#94A3B8] rounded">
                        +{service.stack.length - 1}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={service.href}
                  className="inline-flex text-[#7C3AED] hover:text-[#D946EF] transition-colors font-medium text-xs"
                >
                  Más →
                </a>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-[#94A3B8] mb-6">
              ¿Listo para transformar tu negocio?
            </p>
            <a
              href={SITE_CONFIG.contact.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-8 py-3 bg-gradient-to-r from-[#7C3AED] to-[#D946EF] text-[#F8FAFC] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Agendar llamada
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
