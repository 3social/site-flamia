"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A0E1A]/80 backdrop-blur-md border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-syne font-bold text-xl md:text-2xl">
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#D946EF] bg-clip-text text-transparent">
              FLAMIA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {SITE_CONFIG.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={SITE_CONFIG.contact.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gradient-to-r from-[#7C3AED] to-[#D946EF] text-[#F8FAFC] font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Agendar llamada
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-[#111827] rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-[#1E293B] py-4 space-y-4">
            {SITE_CONFIG.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={SITE_CONFIG.contact.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#D946EF] text-[#F8FAFC] font-medium rounded-lg text-center text-sm"
            >
              Agendar llamada
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
