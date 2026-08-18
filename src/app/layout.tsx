import type { Metadata } from "next";
import { DM_Sans, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FLAMIA - Agencia de IA para Negocios Hispanos",
  description: "Tu negocio en piloto automático. Automatiza ventas, atención al cliente y operaciones con IA. Agencia con presencia en Miami y Costa Rica.",
  keywords: ["IA", "AI", "agentes", "automatización", "CRM", "lead qualification", "Miami", "Costa Rica", "Latinoamérica"],
  openGraph: {
    title: "FLAMIA - Agencia de IA",
    description: "Automatiza tu negocio con inteligencia artificial",
    url: "https://flamia.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FLAMIA - Agencia de IA",
    description: "Automatiza tu negocio con inteligencia artificial",
  },
  metadataBase: new URL("https://flamia.ai"),
  other: {
    "facebook-domain-verification": "b4lu2ihmdaz23mlc0jlhahm9abf6uz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0E1A] text-[#F8FAFC] antialiased">
        {children}
      </body>
    </html>
  );
}
