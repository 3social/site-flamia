import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { TechStack } from "@/components/sections/TechStack";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E1A]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Services Section */}
        <Services />

        {/* How We Work Section */}
        <HowWeWork />

        {/* Tech Stack Section */}
        <TechStack />

        {/* Client Logos Section */}
        <ClientLogos />

        {/* Final CTA Section */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
