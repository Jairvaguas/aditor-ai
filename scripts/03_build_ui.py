import os

def write_file(path, content):
    dirname = os.path.dirname(path)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Creado/Actualizado: {path}")

def build_ui():
    # 1. Configurar Layout con Fuentes
    layout_tsx = """
import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // Asumiendo que existe, si no, creamos utils o simplificamos

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "Aditor AI - Tu Director de Performance",
  description: "Auditoría automática de campañas de Meta Ads con IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn(syne.variable, dmSans.variable, "bg-[#1A1A2E] text-white font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
"""
    # Crear lib/utils.ts si hace falta para 'cn' (clsx + tailwind-merge)
    utils_ts = """
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
"""
    write_file("src/lib/utils.ts", utils_ts)
    write_file("src/app/layout.tsx", layout_tsx)

    # 2. Configurar Globals CSS
    globals_css = """
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 26, 26, 46;
  --background-end-rgb: 26, 26, 46;
}

body {
  font-family: var(--font-dm-sans), sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-syne), sans-serif;
}
"""
    write_file("src/app/globals.css", globals_css)

    # 3. Landing Page (Screen 1)
    page_tsx = """
import Link from "next/link";
import { ArrowRight, Search, TrendingUp, Repeat } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E94560] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Tu Director de{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E94560] to-[#FFE66D]">
            Performance en IA
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Analizá tus campañas de Meta Ads en segundos. Detectá fugas de presupuesto y oportunidades de escala automáticamente.
        </p>

        <div className="flex flex-col items-center gap-4 pt-4">
            <Link 
              href="/conectar"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#1A1A2E] bg-white rounded-full overflow-hidden transition-transform active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#E94560] to-[#FFE66D] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
              <span className="relative flex items-center gap-2">
                Auditar mis campañas gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <p className="text-sm text-gray-500">Sin tarjeta. Sin registro todavía.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-4xl text-center">
        {[
          { label: "1ra auditoría", value: "GRATIS" },
          { label: "Luego", value: "$47 / mes" },
          { label: "Frecuencia", value: "Semanal" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
        {[
          { 
            icon: Search, 
            title: "Detecta fugas", 
            desc: "Identifica campañas con ROAS bajo que están quemando tu presupuesto." 
          },
          { 
            icon: TrendingUp, 
            title: "Escala con confianza", 
            desc: "Te dice exactamente qué creativos y audiencias merecen más plata." 
          },
          { 
            icon: Repeat, 
            title: "100% Automático", 
            desc: "Recibí un reporte accionable cada lunes a las 8AM sin hacer nada." 
          },
        ].map((feat, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="p-3 bg-white/10 rounded-xl mb-4 text-[#4ECDC4]">
              <feat.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
            <p className="text-gray-400 text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
"""
    write_file("src/app/page.tsx", page_tsx)

    # 4. Connect Page (Screen 2)
    connect_page_tsx = """
import Link from "next/link";
import { Check, Lock, ShieldCheck } from "lucide-react";

export default function ConnectPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#4ECDC4] rounded-full blur-[150px] opacity-10" />
      
      <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Conectá tu cuenta de Meta Ads</h1>
          <p className="text-gray-400">
            Solo necesitás un clic. Vas a ver los primeros hallazgos gratis, sin registrarte.
          </p>
        </div>

        {/* Permission Card */}
        <div className="bg-[#24243E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Green Header */}
          <div className="bg-[#4ECDC4]/10 p-4 border-b border-[#4ECDC4]/20 flex items-start gap-3">
             <div className="p-1 bg-[#4ECDC4]/20 rounded-full text-[#4ECDC4] mt-0.5">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-[#4ECDC4] font-bold text-sm uppercase tracking-wide">Tu seguridad primero</h3>
               <p className="text-xs text-[#4ECDC4]/80 mt-1">
                 Solo leemos datos. Nunca modificamos tus campañas.
               </p>
             </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Allowed Permissions */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white/70 uppercase">Permisos solicitados</p>
              <ul className="space-y-2">
                {[
                  "Leer estructura de campañas",
                  "Leer métricas de anuncios (ROAS, CPM)",
                  "Ver creativos y copys"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-white/10" />

            {/* Restricted Permissions */}
            <div className="space-y-3 opacity-50">
               <p className="text-sm font-semibold text-white/70 uppercase">Lo que NO tocamos</p>
               <ul className="space-y-2">
                {[
                  "Editar o crear campañas",
                  "Datos de facturación o tarjetas",
                  "Administrar usuarios"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Button */}
            <div className="pt-2">
              <Link
                href="/teaser" 
                className="flex items-center justify-center gap-3 w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
              >
                {/* Facebook Icon SVG */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Conectar con Facebook
              </Link>
              <p className="text-center text-xs text-gray-500 mt-3">
                Conexión encriptada vía OAuth 2.0
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
"""
    write_file("src/app/conectar/page.tsx", connect_page_tsx)

if __name__ == "__main__":
    build_ui()
