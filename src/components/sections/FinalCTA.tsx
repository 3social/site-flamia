'use client';

import { SITE_CONFIG } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function FinalCTA() {
  return (
    <section id="contacto" className="py-20 md:py-32 bg-[#0A0E1A] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-[#7C3AED] to-transparent rounded-full blur-3xl" />
      </div>

      <ScrollReveal direction="up">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h2 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl text-[#F8FAFC] mb-6">
            {SITE_CONFIG.sections.finalCta.title}
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-[#94A3B8] mb-8">
            {SITE_CONFIG.sections.finalCta.subtitle}
          </p>

          {/* CTA Button */}
          <a
            href={SITE_CONFIG.contact.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-10 py-4 bg-gradient-to-r from-[#7C3AED] to-[#D946EF] text-[#F8FAFC] font-syne font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
          >
            {SITE_CONFIG.sections.finalCta.cta}
          </a>

          {/* Secondary CTA */}
          <div className="mt-8">
            <p className="text-sm text-[#94A3B8] mb-4">
              O escríbenos directamente
            </p>
            <a
              href={SITE_CONFIG.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#25D366] hover:text-white transition-colors font-medium"
            >
              <span>💬</span>
              Por WhatsApp
            </a>
          </div>

          {/* Location Info */}
          <div className="mt-12 pt-8 border-t border-[#1E293B] flex flex-col md:flex-row justify-center items-center gap-8 text-sm text-[#94A3B8]">
            <div>
              <p className="text-[#F8FAFC] font-medium mb-1">
                {SITE_CONFIG.locations.miami.country}
              </p>
              <p>info@flamia.ai</p>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#1E293B]" />
            <div>
              <p className="text-[#F8FAFC] font-medium mb-1">
                {SITE_CONFIG.locations.costarica.country}
              </p>
              <p>hola@flamia.ai</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
