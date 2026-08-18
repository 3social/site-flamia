"use client";

import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <a
      href={SITE_CONFIG.contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Button */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#1da754] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#111827] text-[#F8FAFC] text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-[#1E293B] pointer-events-none">
          Escríbenos por WhatsApp
        </div>
      </div>
    </a>
  );
}
