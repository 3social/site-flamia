export interface Client {
  id: string;
  name: string;
  logo: string; // path to /public/logos/clientes/nombre.svg
  logoColor?: string; // optional: color version for hover
  industry: string; // "Real Estate" | "Dental" | "Retail" | etc.
  country: string; // "🇺🇸 Miami, FL" | "🇲🇽 México" | etc.
  url?: string; // website (optional)
  featured?: boolean;
}

// Inicialmente vacío - los logos se agregarán después
export const clients: Client[] = [];

// Placeholder de clientes para desarrollo
export const clientPlaceholders = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i}`,
  name: `Cliente ${i + 1}`,
  logo: "",
  industry: "Industria",
  country: "País",
  featured: i === 0,
}));
