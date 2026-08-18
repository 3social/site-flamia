import { SITE_CONFIG } from "@/lib/constants";

export function HowWeWork() {
  return (
    <section className="py-20 md:py-32 bg-[#0F1629]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-[#F8FAFC] mb-4">
            Cómo trabajamos
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">
            Tres pasos simples para transformar tu negocio
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SITE_CONFIG.process.map((item, idx) => (
            <div key={item.step} className="relative">
              {/* Card */}
              <div className="p-8 bg-[#111827] border border-[#1E293B] rounded-2xl h-full">
                {/* Step Number */}
                <div className="w-12 h-12 bg-gradient-to-br from-[#7C3AED] to-[#D946EF] rounded-full flex items-center justify-center text-white font-syne font-bold text-lg mb-4">
                  {item.step}
                </div>

                {/* Title */}
                <h3 className="font-syne font-bold text-xl text-[#F8FAFC] mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[#94A3B8] text-sm md:text-base">
                  {item.description}
                </p>
              </div>

              {/* Connector Line (hidden on last item) */}
              {idx < SITE_CONFIG.process.length - 1 && (
                <div className="hidden md:block absolute top-24 -right-4 w-8 h-1 bg-gradient-to-r from-[#7C3AED] to-[#D946EF]" />
              )}
            </div>
          ))}
        </div>

        {/* Timeline Info */}
        <div className="mt-16 p-8 bg-[#111827] border border-[#1E293B] rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-[#94A3B8] mb-2">TIEMPO TOTAL</p>
              <p className="text-2xl font-syne font-bold text-[#F8FAFC]">
                2-4 semanas
              </p>
            </div>
            <div>
              <p className="text-sm text-[#94A3B8] mb-2">COSTO INICIAL</p>
              <p className="text-2xl font-syne font-bold text-[#F8FAFC]">
                Según proyecto
              </p>
            </div>
            <div>
              <p className="text-sm text-[#94A3B8] mb-2">SOPORTE</p>
              <p className="text-2xl font-syne font-bold text-[#F8FAFC]">
                Post-lanzamiento
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
