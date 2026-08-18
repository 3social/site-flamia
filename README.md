# FLAMIA — Agencia de IA

Sitio web oficial de FLAMIA: Agencia de IA para negocios hispanos en Latinoamérica y EE.UU.

## 🚀 Stack Tecnológico

- **Next.js 15** — Framework React moderno con App Router
- **TypeScript** — Type safety en todo el proyecto
- **Tailwind CSS v4** — Utilidades de estilo
- **Framer Motion** — Animaciones y scroll reveals
- **shadcn/ui** — Componentes base

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🏗️ Instalación y Setup

### 1. Instalación de dependencias

```bash
npm install
```

### 2. Ejecutar en desarrollo

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

### 3. Build para producción

```bash
npm run build
npm run start
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout global
│   ├── page.tsx            # Home page
│   └── globals.css         # Estilos FLAMIA
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── HowWeWork.tsx
│   │   ├── TechStack.tsx
│   │   ├── ClientLogos.tsx
│   │   └── FinalCTA.tsx
│   └── ui/
│       ├── container-scroll-animation.tsx
│       └── WhatsAppButton.tsx
│
└── lib/
    ├── services.ts
    ├── clients.ts
    ├── stack.ts
    └── constants.ts
```

## 🎨 Colores FLAMIA

- **Navy:** #0A0E1A (fondo)
- **Violet:** #7C3AED (accent)
- **Magenta:** #D946EF (accent)

## 🔤 Tipografía

- **Syne** — Headlines
- **DM Sans** — Body
- **JetBrains Mono** — Código

## 🔧 Cambiar Datos

### Servicios: `src/lib/services.ts`
### Clientes: `src/lib/clients.ts`
### Stack: `src/lib/stack.ts`
### Copy General: `src/lib/constants.ts`

## 🚀 Deploy a Vercel

```bash
git push origin main
```

Conectar repo en https://vercel.com/new

---

**Versión:** 1.0.0 (MVP)
**Stack:** Next.js 15 + TypeScript + Tailwind CSS v4 + Framer Motion
